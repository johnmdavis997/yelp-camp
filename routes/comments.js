// Require packages and models
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW - show form to add comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE - add new comment to database
router.post("/", middleware.isLoggedIn, function(req, res){
    // Find campground
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            req.flash("error", "Something went wrong")
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Creates a comment, adds it to the campground and saves to the database
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.username = req.user.username
                    comment.author.id = req.user._id
                    // Save comment
                    comment.save();
                    // Add comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added")
                    res.redirect("/campgrounds/" + campground._id)
                }
            });
        }
    })
});

// EDIT - edit a comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    res.redirect("back")
                } else {
                    res.render("comments/edit", {comment: comment, campground: campground});
                }
            })
        }
    });
});

// UPDATE - update new comment in database
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("/campgrounds");
        } else {
            Campground.findById(req.params.id, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    });
});

// DELETE - remove a comment from the database
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("back")
        }
    })
})

module.exports = router;