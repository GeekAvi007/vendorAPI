function errorHandler(err, req, res, next) {
    console.error(err);

    if(err.isOperational){
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code
        });
    }

    return res.status(500).json({
        error: "Internal Server Error!"
    });
}

module.exports = errorHandler;