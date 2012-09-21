var vork = require('vork');

vork
.configure(function(config){
    config.basepath = __dirname+'/app';
})
.listen();