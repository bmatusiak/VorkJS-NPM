module.exports = function(thisVork) {

    return function() {
        function compleateRequest(content, res, next) {
            if (res.writable && content) {
                res.send(content); 
            }else{
                next();
            }
        }

        return function(req, res, next) {
            thisVork.loadAction(
                req,
                res,
                function(content) {
                    compleateRequest(content, res ,next);
                }
            );
        };
    };
};