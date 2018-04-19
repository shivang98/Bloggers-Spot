var express = require("express");
var router = express.Router();
var User = require("../models/users");
var passport = require("passport");
var middlewareObj = require('../middleware');

router.get('/register', function(req, res){
    res.render("register");
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.render("register");
        } else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Successfully registered as new user");
                res.redirect("/blogs");
            })
        }
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully Logged Out!");
    res.redirect("/blogs");
});

module.exports = router;