var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

const jwt = require("jsonwebtoken"); 

const User = require('../models/user');

const withAuth = require("../helpers/middleware");
const { request } = require('express');

//sign up

router.get("/signup", (req,res,next) =>{
res.render("auth/signup",{
    errorMessage: ""
});
});

router.post("/signup", async (req, res, next) => { 
    const { username, email, password, isRestaurant } = req.body;
  
    if (email === "" || password === "" || username === "") {
      res.render("auth/signup", {
        errorMessage: "Enter username, email and password to sign up.",
      });
      return;
    }
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser !== null) {
        res.render("auth/signup", {
          errorMessage: `The email ${email} is already in use.`,
        });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPass = bcrypt.hashSync(password, salt);
  
      const userSubmission = {
        username: username,
        email: email,
        password: hashedPass,
        isRestaurant: isRestaurant
      };
  
      const theUser = new User(userSubmission);
  
      theUser.save((err) => {
        console.log(err)
        if (err) {
          res.render("auth/signup", {
            errorMessage: "Something went wrong. Try again later.",
          });
          return;
        }
  
        res.redirect("/");
      });
    } catch (error) {
      next(error);
      return;
    }
  });
  
//log in

  router.get('/login', (req, res, next) => {
    res.render('auth/login', {
      errorMessage: ""
    });
  });
  
  router.post("/login", async (req, res) => { 
    const { email, password } = req.body;
  
    if (email === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, email and password to sign up.",
      });
      return;
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The email doesn't exist.",
        });
        return;
      }
      else if (bcrypt.compareSync(password, user.password)) {
        const userWithoutPass = await User.findOne({ email }).select("-password");
        const payload = { userID: userWithoutPass._id };
        const token = jwt.sign(payload, process.env.SECRET_SESSION, {
          expiresIn: "1h",
        });
        res.cookie("token", token, { httpOnly: true });
        if (userWithoutPass.isRestaurant){
        res.status(200).redirect("restaurant/dashboard-restaurant");
        } else {
         res.status(200).redirect('client/dashboard-client')
        }
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });


//log out

  router.get("/logout", withAuth, (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.redirect("/");
  });
  

module.exports = router;
