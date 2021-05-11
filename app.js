const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

const homeStartingContent = " EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. No religiousness about how to organize things. No reinvention of iteration and control-flow. It's just plain JavaScript ";
const aboutContent = "This is a blog website. Here you can compose,view and edit your blogs";


const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model('Post', postSchema);



app.get('/', function(req, res) {

  Post.find({}, function(err, allPost) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        newPosts: allPost
      });
    }
  })
})

app.get('/about', function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
})

app.get('/contact', function(req, res) {
  res.render("contact");
})

app.get('/compose', function(req, res) {
  res.render("compose");
})



app.get('/posts/:postId', function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    if(err){
      console.log(err);
    }else{
     res.render("post", {

       title: post.title,

       content: post.content,

       postId:post.id

     });
   }
   });

});

app.post("/delete",function(req,res){
    // console.log(req.body.postId);
    const id = req.body.postId;
    Post.findByIdAndRemove(id,function(err){
      });
    res.redirect("/");
})

app.post("/compose", function(req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  })

  post.save(function(err) {
    if (!err)
      res.redirect('/');
  });
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
