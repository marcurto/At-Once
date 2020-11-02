var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");
const uploadCloud = require("../config/cloudinary");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Dish = require("../models/dish");
const Menu = require("../models/menu");
const Comanda = require("../models/order");// Client Dashboard


router.get("/dashboard-client", withAuth, async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find()
    res.render("client/dashboard-client", { restaurants: restaurants });
  } catch (error) {
    next()
  }
});


// Carta Detail
router.get("/carta-detail/:id", withAuth, async (req, res, next) => {
  try {
    const rest = await Restaurant.findById(req.params.id);
    const menu = await Menu.findOne({ restaurant: rest._id }).populate('dishes');
    res.render("client/carta-detail", { restaurant: rest, restMenu: menu });
  } catch (error) {
    next()
  }
});

router.post("/carta-detail", withAuth, async (req, res, next) => {
  try {
    res.redirect("carta-detail/" + req.body.restaurantId);
  } catch (error) {
    next()
  }
});

//order
router.post("/order-summary/:id", withAuth, async (req, res, next) => {
  const orderInfo = {
    table: req.body.table,
    price: req.body.price,
    dishes: [],
    user: req.userID,
    restaurant: req.params.id
  };
  for (var key in req.body) {
    if (req.body[key] == "true") {
      orderInfo.dishes.push(key);
    }
  }
  const theOrder = await new Comanda(orderInfo);
  theOrder.save((err) => {
    if (err) {
      next(err);
      return;
    }
  });
  res.redirect('/client/order-summary/' + theOrder._id);
});

router.get('/order-summary/:id', withAuth, async (req, res, next) => {
  try {
    console.log(req.params.id);
    const order = await Comanda.findById(req.params.id).populate('dishes');
    console.log(order)
    res.render("client/order-summary", { order: order });
  } catch (error) {
    next()
  }
});







module.exports = router;