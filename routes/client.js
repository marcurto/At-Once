var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");
const uploadCloud = require("../config/cloudinary");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Dish = require("../models/dish");
const Menu = require("../models/menu");
const Order = require("../models/order");


// Client Dashboard
router.get("/dashboard-client", withAuth, async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find()
        console.log(restaurants)
        res.render("client/dashboard-client", {restaurants: restaurants});
    } catch (error){
        next()
    }
});


  
// Carta Detail
router.get("/carta-detail/:id", withAuth, async (req, res, next) => {
    console.log('hola')
    try {
        const rest = await Restaurant.findById(req.params.id);
        const menu = await Menu.findOne({restaurant: rest._id}).populate('dishes');
        console.log(menu)
        res.render("client/carta-detail",{restaurant: rest, restMenu: menu});
    } catch (error){
        console.log(error);
        next()
    }
});

router.post("/carta-detail", withAuth, async (req, res, next) => {
    try {
        res.redirect("carta-detail/"+req.body.restaurantId);
    } catch (error){
        next()
    }
});


//order-summary
 router.post("/order-summary", withAuth, (req, res, next) => {
    const orderInfo = {
      name: req.body.name,
      dishes: [],
      user: req.userID,
      restaurant: req.userID
    };

    for (var key in req.body) {
      if (req.body[key] == "true") {           
        orderInfo.dishes.push(key);
      }
  }
  
    const theOrder = new Order(orderInfo);
    console.log(theOrder , "this is the order")
    theOrder.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/client/order-summary');
    });
  });

 




module.exports = router;