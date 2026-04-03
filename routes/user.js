const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');


// Get request for signup User: New user should register
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Post request for getting info from the form user filled
router.post("/signup", wrapAsync(async (req, res) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
    
        const regUser = await User.register(newUser, password);
        console.log(regUser);
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));


// Get request for login user
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


// Post request for checking if user exists and with correct credentials
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        res.redirect("/listings");
})

module.exports = router;