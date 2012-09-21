var path = require("path");

module.exports = function(thisVork) {
    return {
        mvcFilePath: function(type,name){
            var checkFile = thisVork.config.basepath + thisVork.config.DS + thisVork.mvcFolders[type] + thisVork.config.DS + name + "." + thisVork.mvcFileExt[type];
            //check Vork Path
            if(!path.existsSync(checkFile)){
                //not found in vork path so lets hunt in componets basepaths from there init
                for(var componet in thisVork.loadedComponets){
                    checkFile = thisVork.loadedComponets[componet].basepath + thisVork.config.DS + thisVork.mvcFolders[type] + thisVork.config.DS + name + "." + thisVork.mvcFileExt[type];
                    if(path.existsSync(checkFile)){
                        break;
                    }
                }
            }
            return checkFile;
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
        }
    };
};