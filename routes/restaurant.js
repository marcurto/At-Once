var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");
const uploadCloud = require("../config/cloudinary");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Dish = require("../models/dish")

router.get("/dashboard-restaurant", withAuth, (req, res, next) => {
  res.render("restaurant/dashboard-restaurant");
});

router.get("/dishes", withAuth, async (req, res, next) => {
    try {
        const dishes = await Dish.find({user: req.userID})
        res.render("restaurant/dishes", {dishes: dishes});
    } catch (error){
        next()
    }
});


router.post("/dishes", withAuth, async (req, res, next) => {
    const dishInfo = {
      name: req.body.name,
      description: req.body.description,
      characteristics: req.body.characteristics,
      allergies: req.body.allergies,
      category: req.body.category,
      user: req.userID,
      restaurant: req.userID
    };
  
    const theDish = await new Dish(dishInfo);
    theDish.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/restaurant/dishes');
    });
  });


module.exports = router;
