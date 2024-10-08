const logger = (req, res, next) => {
    console.log(
        `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}: ${Date.now()}`
    );
    next();
};
module.exports = logger