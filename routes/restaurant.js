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

//Create dishes
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

//Edit dishes
router.get('/dishes/edit/:id', withAuth, function (req, res, next) {
  Dish.findOne({ _id: req.params.id }, (err, theDish) => {
    if (err) { return next(err); }
    res.render('restaurant/dishes', {
      title: `Edit ${theDish.title}`,
      dish: theDish
    });
  });
});
router.post('/dishes/edit/:id', function (req, res, next) {
  const updatedDish= {
    name: req.body.name,
    description: req.body.description,
    characteristics: req.body.characteristics,
    allergies: req.body.allergies,
    category: req.body.category
  };
  Dish.update({_id: req.params.id}, updatedDish, (err, theDish) => {
    if (err) {return next(err); }
    res.redirect('/restaurant/dishes');
  });
});




  //Remove dishes
  router.post('/dishes/remove/:id', withAuth, (req, res, next) => {
    Dish.findByIdAndRemove(req.params.id)
    .then((removedDish) => {
      res.redirect('/restaurant/dishes');
    })
    .catch((error) => {
        next();
    })
  });

module.exports = router;
