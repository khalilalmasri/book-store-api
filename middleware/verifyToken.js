const jwt = require("jsonwebtoken");

//verify token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      // if token was wrong
      res.status(403).json("Token is not valid!");
    }
  } else {
    // if no token
    res.status(401).json("You are not authenticated!");
    // const bearerHeader = req.headers["authorization"];
    //     if (typeof bearerHeader !== "undefined") {
    //         const bearer = bearerHeader.split(" ");
    //         const bearerToken = bearer[1];
    //         req.token = bearerToken;
    //         next();
    //     } else {
    //         res.sendStatus(403);
  }
}

//verify token and authorization
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("you are not allowed to do that!");
    }
  });
}

//verify token and admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("you are not allowed,only admin can do that!");
    }
  });
}
module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
