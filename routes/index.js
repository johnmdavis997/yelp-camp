// Require packages and models
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Landing page
router.get("/", function (req, res) {
    res.render("campgrounds/landing");
});

// Show register form
router.get("/register", function(req, res){
    res.render("register")
})

// Register logic
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.render("register")
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login");
});

// Login logic
router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), function(req, res){
});

// Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are logged out")
    res.redirect("/campgrounds")
});

module.exports = router;