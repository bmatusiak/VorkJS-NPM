module.exports = function(thisVork) {

    return function(req,res,callback) {
        var sandbox = thisVork.tools.newSandbox(req);
        sandbox.res = res;
        
        var obj = {
            content: null,
            headers: null,
            code: 404,
            req: req
        };
        
        sandbox.view = sandbox.controler.toString();//save controlerName to viewName just so controler can be absent
        
        //run request construct
        if(thisVork.config.struction && thisVork.config.struction.construct){
            thisVork.config.struction.construct(sandbox,start,compleateRequest);   
        }else{
            start();
        }
        function start(){
            var goodControler = sandbox.is.file(thisVork.tools.mvcFilePath("controler",sandbox.controler));
            var goodView = sandbox.is.file(thisVork.tools.mvcFilePath("view",sandbox.view));
            if(goodControler || goodView){
                if(goodControler){//load controler
                    parseControler(sandbox,compleateRequest);
                }else if(goodView){//load view
                    parseView(sandbox,compleateRequest);
                }
            }else{
                compleateRequest();
            }
        }
        function parseControler(sandbox,next){
            sandbox.load.controler(sandbox.controler,sandbox.action,
                function(error,data){
                    sandbox.controler = data;
                    parseView(sandbox,next);
                });
        }
        function parseView(sandbox,next){
            sandbox.load.view(sandbox.view,false,function(error,data){
                sandbox.view = data; 
                parseLayout(sandbox,next);
            });
        }
        function parseLayout(sandbox,next){
            //load layout
            if(sandbox.is.file(thisVork.tools.mvcFilePath("layout",sandbox.layout))){
                sandbox.load.layout(sandbox.layout,false,function(error,data){
                    if(!error){
                        obj.content = data;
                    }else{
                        obj.content = sandbox.view; 
                    }
                    next();
                });
            }else{
                
                obj.content = sandbox.view;  
                next()
            }
        }
        function compleateRequest(){
            var end = function(){
                    if (obj.content) {
                        obj.headers = {
                            "Content-Type": sandbox.contentType,
                            "Content-Length": obj.content.length
                        };
                        if (!thisVork.config.DEBUG) obj.headers["Cache-Control"] = "public";
                        obj.code = 200;
                    }else{
                        if(sandbox.code)
                            obj.code = sandbox.code || obj.code;
                          
                    }
                    callback(obj);
                };
            if(thisVork.config.struction && thisVork.config.struction.destruct){
                thisVork.config.struction.destruct(sandbox,end);   
            }else{
                end();   
            }
        }

    };

};