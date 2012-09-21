module.exports = new Vork();
function Vork() {
    var thisVork = this;
    thisVork.configure = require("./configure.js")(thisVork,function(loadItems){
        if(!loadItems){
            loadItems = ["tools","request","mvc","loadAction","listen"]
        }
        for(var i in loadItems){
              thisVork[loadItems[i]] = require("./"+loadItems[i]+".js")(thisVork); 
        }
    });
}