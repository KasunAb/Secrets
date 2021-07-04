//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const port = 3000;
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB",{
  useNewUrlParser:true,
  useUnifiedTopology: true});

const userSchema = {
  email:String,
  password:String
};

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
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save((err)=>{
    if(err)
      res.send(err);
    else
    res.render("secrets");
  });
});

app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},(err,findUser)=>{
    if(err)
      console.log(err);
    else{
      if(password === findUser.password)
        res.render("secrets");
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
