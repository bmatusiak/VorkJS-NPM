var fs = require("fs");
var path = require("path");

module.exports = function(thisVork,callback) {
    //Config Setup
    var configDefaults = {
        basepath: __dirname,
        DEBUG: false,
        modelsPath: 'models',
        viewsPath: 'views',
        elementsPath: 'elements',
        controlersPath: 'controlers',
        componetsPath: 'componets',
        layoutsPath: 'layouts',
        webrootPath: 'webroot',
        helpersPath: 'helpers',
        baseControler: "index",
        baseUrl: "/",
        DS: '/',
        cache: true,// set to for production
        EOL: '\r\n',
        dbConfig: 'db',
        port: Number(process.env.app_port || process.env.VCAP_APP_PORT || process.env.PORT || 3000),
        ip:Number(process.env.IP || "0.0.0.0"),
        globals: {},
        struction:'struction'
    };
    
    return function(configFN){
        configFN(configDefaults);  
        thisVork.config = configDefaults;
        
        //turn webroot into array so componets can add more static roots
        if(typeof(thisVork.config.webrootPath) === "string"){
               var tmp = thisVork.config.webrootPath;
               thisVork.config.webrootPath = [];
               thisVork.config.webrootPath.push(tmp);
        }
        
        thisVork.mvcFolders = {
            model:thisVork.config.modelsPath,
            controler:thisVork.config.controlersPath,
            view:thisVork.config.viewsPath,
            element:thisVork.config.elementsPath,
            layout:thisVork.config.layoutsPath,
            helper:thisVork.config.helpersPath,
            componet:thisVork.config.componetsPath
        };
        
       thisVork.mvcFileExt = {
            model:'js',
            controler:'js',
            view:'html',
            element:'html',
            layout:'html',
            helper:'js'
        }; 
        
        var dbFileName = thisVork.config.basepath+"/"+thisVork.config.dbConfig+".js";
        if(path.existsSync(dbFileName))
            thisVork.db = require(dbFileName);
        
        
        var structionFileName = thisVork.config.basepath+"/"+thisVork.config.struction+".js";
        if(path.existsSync(structionFileName))
            thisVork.config.struction = require(structionFileName);
        
        if(thisVork.config.struction && thisVork.config.struction.initConfig){
            thisVork.config.struction.initConfig(thisVork);   
        }
        
        thisVork.loadedComponets = {};
        thisVork.constructs = [];thisVork.destructs = [];
        var componetsDir  = thisVork.config.basepath + thisVork.config.DS + thisVork.mvcFolders.componet;
        if(path.existsSync(componetsDir)){
            var componetsDirs = fs.readdirSync(componetsDir);
            for (var i = 0; i < componetsDirs.length; i++) {
                var dir = componetsDirs[i], long_dir = componetsDir + thisVork.config.DS + dir;
                
                try{
                    thisVork.loadedComponets[dir] = require(long_dir+"/init.js")(thisVork.config.globals);
                }catch(e){console.log(e);continue;}
                
                try{
                    if(thisVork.loadedComponets[dir].construct){
                        thisVork.constructs.push(thisVork.loadedComponets[dir].construct);
                    }
                }catch(e){console.log(e);}
                try{
                    if(thisVork.loadedComponets[dir].destruct){
                        thisVork.destructs.push(thisVork.loadedComponets[dir].destruct);
                    }
                }catch(e){console.log(e);}
                
                try{
                    if(thisVork.loadedComponets[dir].webroot){
                        thisVork.config.webrootPath.push(thisVork.loadedComponets[dir].webroot); 
                    }
                }catch(e){console.log(e);}
            }
        }
        
        if(thisVork.config.struction && thisVork.config.struction.initConfig){
            thisVork.config.struction.init(thisVork);
        }
        
        callback();
        
        return thisVork;
    };
};