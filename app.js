//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const port = 3000;
const mongoose = require('mongoose');

const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB",{
  useNewUrlParser:true,
  useUnifiedTopology: true});

const userSchema =new mongoose.Schema({
  email:String,
  password:String
});



const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
   res.render("home");
 });

app.get("/login",(req,res)=>{
   res.render("login");
 });

app.get("/register",(req,res)=>{
   res.render("register");
 });

app.get("/submit",(req,res)=>{
   res.render("submit");
 });

app.post("/register",(req,res)=>{
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email:req.body.username,
      password:hash
    });
    newUser.save((err)=>{
      if(err)
        res.send(err);
      else
      res.render("secrets");
    });
  });
});

app.post("/login",(req,res)=>{

  const username = req.body.username;

  User.findOne({email:username},(err,findUser)=>{
    if(err)
      console.log(err);
    else{
      bcrypt.compare(req.body.password, findUser.password).then(function(result) {
        if(result)
          res.render("secrets");
        else
          res.send("wrong password");
    });

    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
