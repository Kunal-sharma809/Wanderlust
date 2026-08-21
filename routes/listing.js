const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');


// Show all Listings
router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));


// New Route: To make any new listing by yourself
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./listings/new.ejs");
})


// Show Route: To show details about a specific listing
router.get("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
        req.flash("error", "Listing you request for does not exist!");
        res.redirect("/listings");
    } else { res.render("./listings/show.ejs", { listing }); };
    
}));


// Create Route: To take response from the new.ejs form 
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));


// Edit Route: To edit some information in any listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requrest for does not exist!");
        res.redirect("/listings");
    } else { res.render("./listings/edit.ejs", { listing }); };
    
}));


// Update Route: To update the info sent through put request in edit form
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));


// Delete Listing: To delete the showing listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync( async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect(`/listings`);
}));


module.exports = router;