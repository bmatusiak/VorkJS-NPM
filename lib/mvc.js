module.exports = function(thisVork) {

    return function() {

        function compleateRequest(obj, res) {
            if (res.statusCode !== 302) { //Set by Res Redirect
                res.send(obj.content, obj.headers, obj.code);
            }
        }

        function checkRequest(obj, res) {
            if (obj && obj.code === 200) {
                compleateRequest(obj, res);
                return true;
            }
            if (obj && obj.code === 400) {
                compleateRequest(obj, res);
                return true;
            }
            return false;
        }
        return function(req, res, next) {
            thisVork.loadAction(req, res,

            function(requestObj) {
                if (!checkRequest(requestObj, res)) next();
            });
        };
    }

};