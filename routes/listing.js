const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');

// Import Our controllers
const listingController = require('../controllers/listings.js')

// Show all Listings
router.get("/", wrapAsync(listingController.index));


// New Route: To make any new listing by yourself
router.get("/new", isLoggedIn, listingController.renderNewForm);


// Show Route: To show details about a specific listing
router.get("/:id", wrapAsync(listingController.showListing));


// Create Route: To take response from the new.ejs form 
router.post("/", validateListing, wrapAsync(listingController.createListing));


// Edit Route: To edit some information in any listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// Update Route: To update the info sent through put request in edit form
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


// Delete Listing: To delete the showing listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;