const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require("../schema.js");


// Validate Listing Function: For validating schema
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


// Show all Listings
router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));


// New Route: To make any new listing by yourself
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
})


// Show Route: To show details about a specific listing
router.get("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requrest for does not exist!");
        res.redirect("/listings");
    } else { res.render("./listings/show.ejs", { listing }); };
    
}));


// Create Route: To take response from the new.ejs form 
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));


// Edit Route: To edit some information in any listing
router.get("/:id/edit", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requrest for does not exist!");
        res.redirect("/listings");
    } else { res.render("./listings/edit.ejs", { listing }); };
    
}));


// Update Route: To update the info sent through put request in edit form
router.put("/:id", validateListing, wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));


// Delete Listing: To delete the showing listing
router.delete("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect(`/listings`);
}));


module.exports = router;