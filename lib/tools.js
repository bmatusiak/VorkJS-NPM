var path = require("path");

module.exports = function(thisVork) {
    return {
        mvcFilePath: function(type,name,callback){
            var possibleFiles = [];
            possibleFiles.push(thisVork.config.basepath + thisVork.config.DS + thisVork.mvcFolders[type] + thisVork.config.DS + name + "." + thisVork.mvcFileExt[type]);
            for(var componet in thisVork.loadedComponets){
                possibleFiles.push(thisVork.loadedComponets[componet].basepath + thisVork.config.DS + thisVork.mvcFolders[type] + thisVork.config.DS + name + "." + thisVork.mvcFileExt[type]);
                
            }
            var _checkFile = function(file,next,_done){
                try{
                    path.exists(file,function(exist){
                        if(exist){
                            _done(null,file);
                        }else{
                            next();
                        }
                    });
                }catch(e){
                    _done("not found",file);
                }
            };
            function each(array,_callback){
                var next = function(){
                    var fileName = array.pop();
                    _checkFile(fileName,next,_callback);
                }; 
                next();
            }
            if(callback){
                each(possibleFiles,callback);
            }else{
                for(var i in possibleFiles){
                    if(thisVork.tools.isFile(possibleFiles[i])){
                        return    possibleFiles[i];
                    }
                }
            }
        },
        cloneConfig: function(config) {
            function Clone() {}
            return (function(obj) {Clone.prototype = obj;return new Clone();})(config);
        },
        newSandbox: function(mvc){
            return new thisVork.request(mvc);
        },
        isFile: function(file) {
            return path.existsSync(file);
        },
        isFileAsync: function(filename,callback){
                path.exists(filename,function(exist){
                    if(exist){
                        callback(null,filename);
                    }else{
                        callback("Not Found",filename);
                    }
                });
            }
    };
};