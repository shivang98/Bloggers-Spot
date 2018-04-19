var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var Comment = require("../models/comments");
var middlewareObj = require("../middleware");


router.get('/blogs/:id/comments/new',middlewareObj.isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else{
            res.render('comments/new', {blog: foundBlog});
        }
    });
});

router.post('/blogs/:id/comments',middlewareObj.isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect('/blogs');
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundBlog.comments.push(comment);
                    foundBlog.save();
                    res.redirect('/blogs/' + req.params.id);
                }
            });
        }
    });
});

router.get("/blogs/:id/comments/:comment_id/edit",middlewareObj.isCommentAuth, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundBlog){
        if(err){
            res.redirect("back");
        } else{
            res.render('comments/edit', {comment: foundBlog, blog_id: req.params.id});
        }
    });
});

router.put("/blogs/:id/comments/:comment_id",middlewareObj.isCommentAuth, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, foundBlog){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

router.delete("/blogs/:id/comments/:comment_id",middlewareObj.isCommentAuth, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Successfully deleted comment");
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;