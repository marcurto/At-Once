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


  // Restaurant profile
  router.get("/restaurant-profile", withAuth, (req, res, next) => {
    res.render("restaurant/restaurant-profile");
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
      // res.redirect('/restaurant/restaurant-profile');
    });
  });


  //Your menu
  router.get("/menu", withAuth, async (req, res, next) => {
    try {
      const menuDishes = await Menu.findOne({user: req.userID}).populate('dishes')
      res.render("restaurant/menu", {menu: menuDishes});

  } catch (error){
      next()
  }
  });

  // Create-edit menu
  router.get("/menu-edit", withAuth, async (req, res, next) => {
      try {
          const dishes = await Dish.find({user: req.userID})
          res.render("restaurant/menu-edit", {dishes: dishes});
      } catch (error){
          next()
      }
  });


  router.post("/menu", withAuth, async (req, res, next) => {

    const menutInfo = {
      name: req.body.name,
      dishes: [],
      user: req.userID,
      restaurant: req.userID
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


   /*  //Remove menu
    router.post('/menu/remove/:id', withAuth, (req, res, next) => {
      Menu.findByIdAndRemove(req.params.id)
      .then((removedMenu) => {
        res.redirect('/restaurant/menu');
      })
      .catch((error) => {
          next();
      })
    });
 */


module.exports = router;
