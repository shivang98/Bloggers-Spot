var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var middlewareObj = require("../middleware");

router.get('/', function(req, res){
    res.render('landing');
});

router.get('/blogs', function(req, res){
    Blog.find({}, function(err, newBlog){
        if(err){
            console.log(err);
        } else{
            res.render('blogs/index', {blogs: newBlog});
        }
    });
});

router.post('/blogs',middlewareObj.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var dec = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBlog = {name: name, image:image, description:dec, author: author};
    Blog.create(newBlog, function(err, newBlog){
        if(err){
            console.log(err);
        } else{
            res.redirect('/blogs');        
        }
    });
});

router.get('/blogs/new',middlewareObj.isLoggedIn, function(req, res){
    res.render('blogs/new');
});

router.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else{
            // console.log(foundBlog);
            res.render('blogs/show', {blogs: foundBlog});
        }
    });
});

router.get('/blogs/:id/edit',middlewareObj.isBlogAuth, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            console.log(err);
            res.redirect('/blogs');
        } else{
            res.render("blogs/edit", {blog: foundBlog});
        }
    })
});

router.put('/blogs/:id',middlewareObj.isBlogAuth, function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else{
            console.log(updatedBlog);
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

router.delete('/blogs/:id',middlewareObj.isBlogAuth, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            req.flash("success", "Successfully deleted blogs");
            res.redirect("/blogs");
        }
    });
});

module.exports = router;