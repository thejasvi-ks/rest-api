require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      req.isAuth = false; // adding this to handle this inside of resolvers.
      return next(); // this makes sure we get to next middle ware & not execute rest of the code.
    }
    const token = req.get("Authorization").split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      // err.statusCode = 500;
      // throw err;
      req.isAuth = false;
      return next();
    }
    if (!decodedToken) {
      // const error = new Error("Not authenticated");
      // error.statusCode = 401;
      // throw error;
      req.isAuth = false;
      return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};