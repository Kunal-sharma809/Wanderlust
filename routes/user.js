const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectedUrl } = require('../middleware.js');

const userController = require('../controllers/users.js')


// Get request for signup User: New user should register
router.get("/signup", userController.renderSignupForm);

// Post request for getting info from the form user filled
router.post("/signup", wrapAsync(userController.signup));


// Get request for login user
router.get("/login", userController.renderLoginForm);


// Post request for checking if user exists and with correct credentials
router.post(
    "/login",
    saveRedirectedUrl,
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true }),
    userController.login
)

// Logout Route
router.get('/logout', userController.logout)

module.exports = router;