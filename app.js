// Require packages
var express                 = require("express"), 
    app                     = express(),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    flash                   = require("connect-flash")
// Require models
var Campground              = require("./models/campgrounds"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds")

// Require routes
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index")

// Configuration
mongoose.Promise = global.Promise;
// "mongodb://localhost/yelp_camp"
mongoose.connect("mongodb://kai:password@ds157873.mlab.com:57873/yelpcamp_john", {useMongoClient: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(flash())

// Seed the database
// seedDB();

// Passport configuration
app.use(require("express-session")({
    secret: "Kanye is the GOAT",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Current user middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Use routes
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// Creates the server
app.listen(process.env.PORT || 3000, function () {
    console.log("Yelp camp has started!!")
});