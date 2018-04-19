middlewareObj = {}
var Blog = require("../models/blogs");
var Comment = require("../models/comments");

middlewareObj.isBlogAuth = function (req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                req.flash("error", "Blog not found");
                res.redirect("back");
            } else{
                if(foundBlog.author.id.equals(req.user.id)){
                    next();
                } else{
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first to do that");
        res.redirect("back");
    }
}

middlewareObj.isCommentAuth = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                } else{
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "Please login first to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;