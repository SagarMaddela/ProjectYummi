const requestLogger = (req, res, next) => {
    console.log(` From CustomLogger : [${new Date().toISOString()}] ----- ${req.method} ----- ${req.url}`);
    next();
};

module.exports = requestLogger;