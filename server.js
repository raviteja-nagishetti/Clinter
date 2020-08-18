require('dotenv').config();
const express = require('express');
const app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var User = require('./backend/models/user');
var Tweet = require('./backend/models/tweet');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var passport = require('passport');
const port = process.env.PORT || 3000


app.get('/', (req, res) => res.sendFile(__dirname+'/dist/Twitter/index.html'));
app.use(express.static(__dirname+'/dist/Twitter'));

// ************************ DB Connection ************************
var dbOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auto_reconnect: true
  };
  mongoose.connect(process.env.MONGO, dbOptions);
  
  mongoose.connection.on('connected', function () {
    console.log("Connected to DB");
  });
  mongoose.connection.on('error', function (err) {
    console.log("Error while connecting to DB: " + err);
  });
  // * DB Connection ************************

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  // ****** Body Parser **********
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(bodyParser.json())
  app.use(cors());
  // * Body Parser ********


  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/clinter",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log(profile);
    User.findOne({
      'google_id': profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    google_id : profile.id,
                    username: profile.displayName
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
  }
  ));

  app.get('/api/google',
  passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/clinter', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json(null);
  });

 
  
  app.get('/api/login',(req,res)=>{
    console.log("Auth");

    if(req.isAuthenticated()) 
    {
      res.render('/tweets');
    }  
    //else
      //res.redirect("login");

    /*
    User.findOne({ email: req.query.email }, function (err, user) {
      if (err) {
        console.log('Error while getting user from DB in /api/login: ' + err);
        res.json({
          error: err
        });
      } else {
        //console.log(user);
        if (user==null) {
          res.json({ message: 'Incorrect username.' });
        }
        else if(!user.isValid(req.query.password)) {
          res.json({ message: 'Incorrect password.' });
        }
        else
          res.json({username:user.username, userid:user.email, message: 'success' });
      }
  });*/
  });

  app.get('/api/tweets', (req, res) => {
    console.log(req.query.username);
    var query = {};
    if(req.query.username);
      query.user = req.query.username;
    console.log(JSON.stringify(query));
    Tweet.find({},'', {
      sort : 'index',
      limit: 12//+req.query.limit,// + is for parsing
    }, (err, docs) => {
      if (err) {
        console.log('Error while getting movies from DB in /api/tweets: ' + err);
        res.json({
          error: err
        });
      } else {
        res.json(docs);
      }
    });
  });
  
  app.post('/api/tweets', (req, res) => {
    var ord = {
      "index" : req.body.index,
      "user" : req.body.user,
      "msg": req.body.msg,
      "likeCount" : req.body.likeCount
    };
    //console.log(req.body.index);
    Tweet.findOne({index: req.body.index},{sort:"index"} ,function(err, doc) {
          if(doc==null){
            var newTweet = new Tweet(ord);
            newTweet.save((err, doc) => {
              if (err) {
                console.log("Error occurred");
                res.json({
                  "message": "error"
                });
              } else
                res.json(doc);
            });
          }
          else{
            //console.log("update");
            Tweet.findOneAndUpdate({ index : req.body.index}, ord,{useFindAndModify: false},(err,docs)=>{
              if (err) {
                console.log('Error while updating: ' + err);
                res.json({
                  error: err
                });
              } else {
                res.json(docs);
              }
            });
          }
    });
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))