var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

const User = require('../models/user');

router.get("/signup", (req,res,next) =>{
res.render("auth/signup",{
    errorMessage: ""
});
});


router.post("/signup", async (req, res, next) => { 
    const { username, email, password } = req.body;
  
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
      };
  
      const theUser = new User(userSubmission);
  
      theUser.save((err) => {
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
  

module.exports = router;
