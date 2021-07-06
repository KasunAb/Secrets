//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const port = 3000;
const mongoose = require('mongoose');

const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",{
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useCreateIndex: true});

const userSchema =new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
   res.render("home");
 });

app.get("/login",(req,res)=>{
   res.render("login");
 });

 app.get("/logout",(req,res)=>{
   //deauthenticate user
   //delete cokies and sessions
    req.logout();
    res.redirect("/");
  });

app.get("/register",(req,res)=>{
   res.render("register");
 });

app.get("/secrets",(req,res)=>{
  //if user authenticated they can vist page others force to login by redirect login page
  if(req.isAuthenticated())
    res.render("secrets");
  else
    res.redirect("/login");
});

app.get("/submit",(req,res)=>{
   res.render("submit");
 });

app.post("/register",(req,res)=>{
  //this method come from passport local mongoose package this create user and save user ro database direct
   User.register({username:req.body.username}, req.body.password, function(err, user) {
     if (err) {
       //if errors come users will redirect to register page again
       console.log(err);
       res.redirect("/register");
     }else{
       //if not error we authenticate our use and redirect to secrete page
       passport.authenticate("local")(req,res,()=>{
         res.redirect("/secrets");
       });
     }
   });
});

app.post("/login",(req,res)=>{
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });
  //this function come from passport
  req.login(user,(err)=>{
    if(err)
      console.log(err);else{
      //if not error we authenticate our use and redirect to secrete page
      passport.authenticate("local")(req,res,()=>{
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
