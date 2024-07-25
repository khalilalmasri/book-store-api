const notFound = ((req, res, next) => {//نمرر النيكست ليقوم بدوره بتمرير الأيرور في حال وجوده
    const error = new Error(`not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  });
 const errorHandler = ((error, req, res, next) => {// نأخذالأيرور كباراميتر (هو موجود وقيمته null) ونقوم بمعالجته
      // أحياناً يكون في أيرور ولكن الستاتوس كود تكون 200 في هذه الحالة نغيرها ل 500 ليعلم المطور مالمشكلة
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: error.message,
      // stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  });

  module.exports = {notFound, errorHandler}