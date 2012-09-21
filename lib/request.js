var url = require("url");
var fs = require("fs");
var ejs = require('ejs');

module.exports = function(thisVork) {
        
    return function(req){
        var thisSandbox = this;
        
        this.controler = null;
        this.layout = 'default';
        this.action = 'index';
        this.view = null;
        this.params = [];
        this.contentType = 'text/html';
        this.req = req;
        this.globals = thisVork.config.globals;
        this.url = url.parse(req.url);
                
        //Parse Params
        (function(){//for codeFolding ;P
            var filename = thisSandbox.url.pathname.toString();
            
            if(thisVork.config.baseUrl && thisVork.config.baseUrl != '/'){
                var _url = thisVork.config.baseUrl.toString();
                if(_url.charAt(_url.length-1) == "/"){ 
                    _url= _url.slice(0,_url.length-1);
                }
                var urlCheckk = filename.slice(0,_url.length);
                if(urlCheckk === _url){
                    filename = filename.slice(0-(filename.length-_url.length))
                    if (filename == '/') filename = "/"+thisVork.config.baseControler;
                }                     
            }else{
                if (filename == '/') filename = "/"+thisVork.config.baseControler;
            }
            
            thisSandbox.params = filename.substring(1, filename.length).split('/');
            thisSandbox.params.reverse();
            if (thisSandbox.params.length) {
                thisSandbox.controler = thisSandbox.params[thisSandbox.params.length - 1];
                thisSandbox.params.pop();
            }
            if (thisSandbox.params.length) {
                thisSandbox.action = thisSandbox.params[thisSandbox.params.length - 1];
                thisSandbox.params.pop();
            }
            thisSandbox.params.reverse();
        })();
        
        this.is = {
            file: thisVork.tools.isFile
        };
        this.get = {
            file: function(fileName){
                return fs.readFileSync(fileName, "utf8");   
            }
        };
        this.config = thisVork.tools.cloneConfig(thisVork.config);
        this.load = {
            //Objects
            controler: function(name,action,callback) {
                var isFunction = function(func){return (typeof(func) === "function");};
                var controler = _mvcObject(thisVork.tools.mvcFilePath("controler",name),thisSandbox);
                var loaded = null;
                if(isFunction(controler[action])){
                    loaded = controler[action](callback);//actions require a callback
                    if(loaded)
                        callback(null,loaded);
                    //return controler[action](callback);//actions require a callback
                }else{
                    if(isFunction(controler.index)){
                        loaded = controler.index(callback);//actions require a callback
                        if(loaded)
                            callback(null,loaded);
                    }else
                        callback({});
                }
            },
            helper: function(name,obj) {
                if(!obj) obj = thisSandbox;
                return _mvcObject(thisVork.tools.mvcFilePath("helper",name),obj);
            },
            model: function(name) {
                return _mvcObject(thisVork.tools.mvcFilePath("model",name),thisVork.db);
            },//EJS Tempaltes
            view: function(name,obj,callback) {
                if(!obj) obj = {}
                obj.vork = thisSandbox;
                return _template(thisVork.tools.mvcFilePath("view",name),obj,callback);
            },
            element: function(name,obj,callback) {
                if(!obj) obj = {}
                obj.vork = thisSandbox;
                return _template(thisVork.tools.mvcFilePath("element",name),obj,callback);
            },
            layout: function(name,obj,callback) {
                if(!obj) obj = {}
                obj.vork = thisSandbox;
                return _template(thisVork.tools.mvcFilePath("layout",name),obj,callback);
            }
        };
        
        function _mvcObject(filePath,obj) {// controlers componets helpers models
            if (thisSandbox.is.file(filePath)) {
                var object = require(filePath);
                if (typeof(object) === 'function') 
                    object = object(obj);
                if(!thisSandbox.config.cache)
                    delete require.cache[filePath];
                return object;
            }
            else return null;
        }
        function  _template(templateFile,obj,callback) {// views elements layouts
            if (thisSandbox.is.file(templateFile)) {
                if(callback){
                    callback(false,ejs.render(thisSandbox.get.file(templateFile),obj));
                }else{
                    return ejs.render(thisSandbox.get.file(templateFile),obj);
                }
            }
            else {
                if(callback){
                    callback(null,null);
                }
                return null;
            }
        }
        
    }
    
};