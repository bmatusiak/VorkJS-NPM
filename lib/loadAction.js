module.exports = function(thisVork) {

    return function(req,res,callback) {
        var sandbox = thisVork.tools.newSandbox(req);
        sandbox.res = res; 
        
        var results;
        
        sandbox.view = sandbox.controler.toString();//save controlerName to viewName just so controler can be absent
        
        var constructs = function(){
            var fn = [];var count = 0;
            for (var i = 0; i < thisVork.constructs.length; i++) {
                fn.push(thisVork.constructs[i]);
            }
            var next = function(){
                var curFN = fn.pop();
                ++count;
                if(count == thisVork.constructs.length){
                    curFN(sandbox,start);
                }else{ 
                    curFN(sandbox,next); 
                }
            }; 
            if(fn.length >= 1){
                next();
            }else{
                start();
            }
        };
        //run request construct
        if(thisVork.config.struction && thisVork.config.struction.construct){
            thisVork.config.struction.construct(sandbox,constructs,compleateRequest);   
        }else{
            constructs();
        }
        var _ERRORS = {};
        function start(){
            parseControler(sandbox,sandbox.controler,function(error){
                if(_ERRORS.controler && _ERRORS.view){
                    if(thisVork.config.handleError){
                        sandbox._error = 404;
                        sandbox.view = thisVork.config.handleError;
                        parseControler(sandbox,thisVork.config.handleError,function(error){
                            compleateRequest();
                        });
                    }else{
                        compleateRequest();
                    }
                }else{
                    compleateRequest();
                }
            });
        }
        
        function parseControler(sandbox,viewControler,next){
            sandbox.load.controler(viewControler,sandbox.action,
                    function(error){
                        _ERRORS.controler = error;
                        _ERRORS._controler = sandbox.controler;
                        parseView(sandbox,next);
                    });
        }
        function parseView(sandbox,next){
            sandbox.load.view(sandbox.view,false,function(error,data){
                    _ERRORS.view = error;
                    _ERRORS._view = sandbox.view;
                    sandbox._view = sandbox.view;
                    sandbox.view = data; 
                    parseLayout(sandbox,next);
                });
        }
        function parseLayout(sandbox,next){
            //load layout
            if(sandbox.is.file(thisVork.tools.mvcFilePath("layout",sandbox.layout))){
                sandbox.load.layout(sandbox.layout,false,function(error,data){
                    _ERRORS.layout = error;
                    _ERRORS._layout = error;
                    if(!error){
                        results = data;
                    }else{
                        results = sandbox.view; 
                    }
                    next();
                });
            }else{
                results = sandbox.view;  
                next();
            }
        }
        function compleateRequest(){
            var end = function(){
                    callback(results);
                };
                
            var destructs = function(){
                var fn = [];var count = 0;
                for (var i = 0; i < thisVork.destructs.length; i++) {
                    fn.push(thisVork.destructs[i]);
                }
                var next = function(){
                    var curFN = fn.pop();
                    ++count;
                    if(count == thisVork.destructs.length){
                        curFN(sandbox,end);
                    }else{
                        curFN(sandbox,next); 
                    }
                };
                if(fn.length >= 1){
                    next();
                }else{
                    end();
                }
            };
            
            if(thisVork.config.struction && thisVork.config.struction.destruct){
                thisVork.config.struction.destruct(sandbox,destructs);   
            }else{
                destructs();   
            }
        }

    };

};