var express = require('express');
var router = express.Router();
const withAuth = require("../helpers/middleware");
const uploadCloud = require("../config/cloudinary");


/* GET home page. */
router.get('/', withAuth, (req, res, next) => {
  res.render('index', { title: "Welcome" });
});
module.exports = router;
