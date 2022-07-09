const NotFound = async (req, res, next) => {
    const error = new Error(`Page Not Found`);
    res.status(404);
    next(error);
}

const errorHandler = async (err, req, res, next) => {
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status);
    res.json({
        message: err.message,
        stack : process.env.NODE_ENV === 'production' ? null : err.stack,
    })
}

module.exports = { NotFound, errorHandler };