const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_SESSION;

const User = require("../models/user");

const withAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.locals.isUserLoggedIn = false;
      next();
    } else {
      const decoded = await jwt.verify(token, secret);

      req.userID = decoded.userID;
      res.locals.currentUserInfo = await User.findById(req.userID);
      res.locals.isUserLoggedIn = true;
      req.isRestaurant = await User.findById(req.userID).isRestaurant; // Creem una variable global que et diu si l'usuari que ha fet log in és un restaurant o un client.
      next();
    }
  } catch (err) {
    console.error(err);
    res.locals.isUserLoggedIn = false;
    next(err);
  }
};

module.exports = withAuth;