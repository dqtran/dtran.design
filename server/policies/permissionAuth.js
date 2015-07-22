module.exports = function(req, res, next) {

    if(req.user){
        next();
    }else{
        var err = new Error('Not acceptable request. Please login first.');
        err.status = 403;
        err.code = 32;
        next(err);
    }

};
