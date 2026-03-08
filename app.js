const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');

// Mongoose Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.get("/", (req, res) => {
    res.send("Hello World");
});

// Show all Listings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});


// New Route: To make any new listing by yourself
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
})


// Show Route: To show details about a specific listing
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
});


// Create Route: To take response from the new.ejs form 
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});


// Edit Route: To edit some information in any listing
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
});


// Update Route: To update the info sent through put request in edit form
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});


// Delete Listing: To delete the showing listing
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect(`/listings`);
});


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Villa in Tamhini",
//         description: "1873 Mulberry grove | A Holiday home in Mulshi",
//         price: 49071,
//         location: "Tamhini",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfully saved in db");
// });




app.listen(8080, () => {
    console.log("Listening to port 8080");
})