var express = require('express'),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require('mongoose'),
methodOverride = require("method-override"),
flash = require('connect-flash'),
Blog  = require('./models/blogs'),
Comment     = require('./models/comments'),
User        = require('./models/users'),
passport    = require('passport'),
LocalStrategy = require('passport-local'),
seedDb      = require("./seeds");

var commentsRoutes = require("./routes/comments"),
blogsRoutes = require("./routes/blogs");
indexRoutes = require("./routes/index");
// console.log(process.env.DATABASEURL);
// mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://localhost/bloggers_stop");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(flash());

// seedDb();

app.use(require("express-session")({
    secret: "Again I am the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(blogsRoutes);
app.use(commentsRoutes);

app.listen(3000,function(){
    console.log("Server has started !") 
});