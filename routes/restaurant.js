var express = require('express');
var router = express.Router();
const withAuth = require("../helpers/middleware");
const uploadCloud = require("../config/cloudinary");
const User = require('../models/user');
const Restaurant = require('../models/restaurant');




router.get('/dashboard-restaurant', withAuth, (req, res, next) => {
    res.render('restaurant/dashboard-restaurant' );
  });


  module.exports = router;
  