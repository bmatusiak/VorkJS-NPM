module.exports = function(thisVork) {
    return function(){
        var express = require('express');
        var app = express();
        var server = require('http').createServer(app);
        
        var sessionKey = "express.id";
        var secret = "secret";
        
        app.configure(function () {
            app.use(express.cookieParser(secret));
            
            app.use(express.bodyParser());
            app.use(express.session({secret: secret, 
                                     key: sessionKey}));
                                     
            function addWebroot(path){
                app.use(express.static(path)); 
            }
            for(var i in thisVork.config.webrootPath){
                addWebroot(thisVork.config.webrootPath[i]);
            }
            app.use(thisVork.mvc());
            
        });
        server.listen(thisVork.config.port,thisVork.config.ip);
        console.log("Listen Started!");
    };
};