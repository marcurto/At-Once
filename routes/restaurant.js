var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");
const uploadCloud = require("../config/cloudinary");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Dish = require("../models/dish");
const Menu = require("../models/menu")
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
      price: req.body.price,
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
    category: req.body.category,
    price: req.body.price,
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
  // Restaurant profile
  router.get("/restaurant-profile", withAuth, async (req, res, next) => {
    try {
      const restaruantProfile = await Restaurant.findOne({user:req.userID})
      res.render("restaurant/restaurant-profile", {restaurant: restaruantProfile});
  } catch (error){
      next()
  }
  });
  router.post("/restaurant-profile", withAuth, async (req, res, next) => {
    const restaurantInfo = {
      name: req.body.name,
      description: req.body.description,
      contactInfo: {
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        website: req.body.website,
      },
      imgPath: req.body.imgPath,
      user: req.userID
    };
    const theRestaurant = await new Restaurant(restaurantInfo);
    theRestaurant.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.render('restaurant/restaurant-profile', {restaurant: theRestaurant});
    });
  });
  // Update profile
  router.get('/restaurant-profile-edit/:id', withAuth, async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findById({user: req.userID})
      console.log(restaurant)
      res.render("restaurant/restaurant-profile-edit", {restaurant_id:req.params.id});
  } catch (error){
      next()
  }
  });
  router.post("/restaurant-profile-edit/:id", withAuth, async (req, res, next) => {
    const updatedProfile = {
      name: req.body.name,
      description: req.body.description,
      contactInfo: {
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        website: req.body.website,
      },
      imgPath: req.body.imgPath,
      user: req.userID
    };
    Restaurant.update({_id: req.params.id}, updatedProfile, (err, theRestaurant) => {
      if (err) {return next(err); }
      res.redirect('/restaurant/restaurant-profile');
    });
  })
  //Your menu
  router.get("/menu", withAuth, async (req, res, next) => {
    try {
      const menuDishes = await Menu.findOne({user: req.userID}).populate('dishes')
      res.render("restaurant/menu", {menu: menuDishes});
  } catch (error){
      next()
  }
  });
  // Create menu
  router.get("/menu-create", withAuth, async (req, res, next) => {
      try {
          const dishes = await Dish.find({user: req.userID})
          res.render("restaurant/menu-create", {dishes: dishes});
      } catch (error){
          next()
      }
  });
  router.post("/menu", withAuth, async (req, res, next) => {
    const restaurant = await Restaurant.findOne({user: req.userID})
    const menutInfo = {
      name: req.body.name,
      dishes: [],
      user: req.userID,
      restaurantMenu: restaurant._id
    };
    for (var key in req.body) {
      if (req.body[key] == "true") {           
        menutInfo.dishes.push(key);
      }
  }
    const theMenu = await new Menu(menutInfo);
    theMenu.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/restaurant/menu');
    });
  });
  // Edit menu
  router.get('/menu-edit/:id', withAuth, async (req, res, next) => {
    try {
      const dishes = await Dish.find({user: req.userID})
      res.render("restaurant/menu-edit", {dishes: dishes, menu_id: req.params.id});
  } catch (error){
      next()
  }
  });
  router.post("/menu-edit/edit/:id", withAuth, async (req, res, next) => {
    const restaurant = await Restaurant.findOne({user: req.userID})
    const updatedMenu = {
      name: req.body.name,
      dishes: [],
      user: req.userID,
      restaurant: restaurant._id
    };
    console.log(updatedMenu, 'holi')
    for (var key in req.body) {
      if (req.body[key] == "true") {           
        updatedMenu.dishes.push(key);
      }
  }
    Menu.update({_id: req.params.id}, updatedMenu, (err) => {
      if (err) {return next(err); }
      res.redirect('/restaurant/menu');
    });
  });
  // Remove menu
  router.post('/menu/remove/:id', withAuth, (req, res, next) => {
    console.log(req.params.id)
    Menu.findByIdAndRemove(req.params.id)
    .then((removedMenu) => {
      res.redirect('/restaurant/menu');
    })
    .catch((error) => {
        next();
    })
  });
module.exports = router;