const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

const routenotFoundHandler = (req, res, next) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found",
    });
};


// ✅ Correct module exports
module.exports = {
    errorHandler,
    routenotFoundHandler
};
