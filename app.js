const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


const sessionOptions = {
    secret: "mysupersecret", // Using this only for development phase only
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.get("/", (req, res) => {
    res.send("Hello World");
});


app.use(session(sessionOptions));
app.use(flash());

// Success Message to show while saving a new listing
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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


// Custom Error: Page Not Found Error
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});


// Handling Error using Middlewares
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("Listening to port 8080");
})