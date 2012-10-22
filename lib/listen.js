module.exports = function(thisVork) {
        
    thisVork.express = require('express');
    thisVork.app = thisVork.express();
    thisVork.server = require('http').createServer(thisVork.app);
    
    thisVork.sessionSettings = {secret: thisVork.config.secret || "secret", 
                                     key: thisVork.config.sessionKey || "express.id"};
    
    return function(moreConfigureation){
        
        thisVork.app.configure(function () {
            thisVork.app.use(thisVork.express.cookieParser(thisVork.sessionSettings.secret));
            thisVork.app.use(thisVork.express.bodyParser());
            thisVork.app.use(thisVork.express.session(thisVork.sessionSettings));
                                     
            function addWebroot(path){
                thisVork.app.use(thisVork.express.static(path)); 
            }
            for(var i in thisVork.config.webrootPath){
                addWebroot(thisVork.config.webrootPath[i]);
            }
            
            if(typeof(moreConfigureation) == "function")
                moreConfigureation(thisVork.express,thisVork.app);
                
            thisVork.app.use(thisVork.mvc());
        });
        thisVork.server.listen(thisVork.config.port,thisVork.config.ip);
        console.log("Listen Started!");
    };
};