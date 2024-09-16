const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization || req.headers.Authorization;

      if (!authorization || !authorization.startsWith("Bearer")) {
        return next(new HttpError("Authorization header missing or malformed", 401));
      }


   
      const token = authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) {
          return next(new HttpError("Token invalid", 403));
        }
        req.user = info;
        next();
      });
    
  } catch (error) {
    return next(new HttpError("authtentication failed", 500));
  }
};

module.exports= authMiddleware;

