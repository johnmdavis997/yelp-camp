// Require packages and models
var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

// INDEX - Show all campgrounds
router.get("/", function (req, res) {
    // Retrieves all campgrounds from the database
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds}); 
        }
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// CREATE - add new campground to Database
router.post("/", middleware.isLoggedIn, function(req, res) {
    // adds the value of the name and image forms, and adds it to a variable
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    

    var author = {
        id: req.user._id,
        username: req.user.username
    }
    // adds the values to a variable and stores them into an object
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
    // adds the newCampground variable to the database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "New Campground has been added")
            res.redirect("/campgrounds");
        }
    });   
});

// SHOW - shows info about one campground
router.get("/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT - show form to edit a campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        res.render("campgrounds/edit", {campground: campground});
    });
});


// UPDATE - update a campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground has been updated")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
     Campground.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/campgrounds");
         } else {
             req.flash("success", "Campground removed")
             res.redirect("/campgrounds");
         }
     });
});

module.exports = router;