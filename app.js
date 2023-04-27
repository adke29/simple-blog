//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-kevin:Test123456@cluster0.6ehnxuj.mongodb.net/blogDB");

const homeStartingContent = "Welcome to Daily Journal, your trusted source for up-to-the-minute news and information. We pride ourselves on delivering the most relevant and insightful stories from around the world, covering everything from breaking news to the latest trends in politics, business, sports, entertainment, and more";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title:{type:String,required:true},
  content:{type:String, required:true}
})
const Posts = new mongoose.model("posts", postSchema);



//Start code

var outputPosts = {};


app.get("/",async function(req,res){
  await Posts.find().then(function(posts){
    outputPosts = posts;
   });
  res.render("home",{homeContent:homeStartingContent,allPosts:outputPosts});
})

app.get("/about",function(req,res){
  res.render("about",{aboutMeContent:aboutContent})
})

app.get("/contact",function(req,res){
  res.render("contact",{contactMeContent:contactContent})
})

app.get("/compose",function(req,res){
  res.render("compose");
})

app.post("/compose",async function(req,res){
  const newTitle = req.body.title;
  const newBody = req.body.post;
  const newPost = new Posts({
    title: newTitle,
    content: newBody
  });
  await newPost.save();
  res.redirect("/");
})


app.get("/posts/:postId", function(req,res){
  const postId = req.params.postId; 
  Posts.findOne({_id:postId}).then((post,err) =>{
    res.render("post",{title:post.title, body:post.content});
  }).catch(() =>{
    res.render("post",{title:"Post not Found", body:"Your post doesn't exist or has been deleted!!!!"})
  })
})


app.get("/delete/:postId",async function(req,res){
  const postId = req.params.postId;
  await Posts.findOneAndDelete({_id:postId}).catch(function(){
    console.log("Delete failed");
  }) 
  res.redirect("/");
})






app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});
