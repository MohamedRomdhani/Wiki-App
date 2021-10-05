//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});
const articlesSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("Article", articlesSchema);
//////////////////////////Requests targeting all articles///////////////////////////////////////
app.route("articles")
.get(function(req, res) {
  Article.find({}, function(err, results) {
    if (!err) {
      res.send(results);
    } else {
      res.send(err);
    }
  })

})
.post(function(req, res) {

  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function(err) {
    if (!err) {
      res.send("Successfully added a new article.")
    } else {
      res.send(err);
    }

  });
})
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("deleted successfully");
    } else {
      res.send(err);
    }
  })


});
//////////////////////////////////////////Requests targeting a specific Article///////////////////
app.route("/articles/:articleName")
.get(function(req, res){
  ;
  Article.findOne({title: req.params.articleName}, function(err, foundarticle){
    if(!err){res.send(foundarticle);}
    else{res.send(err);}
  });
})

.put(function(req, res){
  const query = {title: req.params.articleName};

  Article.update(
    query,
    {title:req.body.title, content: req.body.content},


    function(err){
      if(!err){
        res.send("Successfully updated article");
      }
    }
  );
})
.patch(function(req,res){
  const query = {title: req.params.articleName};

  Article.update(
    query,
    {$set: req.body},


    function(err){
      if(!err){
        res.send("Successfully updated article");
      }
    }
  );
})
.delete(function(req, res){
  const query = {title: req.params.articleName};

  Article.deleteOne(query, function(err){
    if(!err){res.send("Successfully deleted");}
    else{res.send(err);}
  });
});






//TODO



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
