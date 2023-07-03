//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

// MongoDB Setup :

mongoose.connect("mongodb+srv://prasad:" + process.env.PASSWORD + "@cluster0.yijpl91.mongodb.net/blogSiteDB?retryWrites=true&w=majority");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model("Blog", blogSchema);

// -----------------------------------------------------------------------------------------------------------------

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Logic :

app.get("/", (req, res) => {

  Blog.find({})
    .then((result) => {
      if (result) {
        res.render("home", { posts: result });
      }
    })



});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const title = req.body.postTitle;
  const content = req.body.postContent;
  
  const newPost = new Blog({
    title:title,
    content:content
  });

  newPost.save()
    .then((result)=>{
      if(result){
        res.redirect("/");
      }
    })
    .catch((err)=>{
      console.log(err);
    })

});

app.get("/posts/:postName", (req, res) => {
  let requestedTitle = _.lowerCase(req.params.postName);
  Blog.find({})
    .then((result) => {
      result.forEach((document) => {
        if (document.title.toLocaleLowerCase() === requestedTitle) {
          res.render("post", { postTitle: document.title, postContent: document.content });
        }
      });
    })
    .catch((error) => {
      console.log("Error retrieving blog data:", error);
    });


  // posts.forEach((post)=>{
  //   if(_.lowerCase(post.postTitle)===requestedTitle){
  //     res.render("post", {postTitle: post.postTitle, postContent: post.postContent});
  //   };
  // });

});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
