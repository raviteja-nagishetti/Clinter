require('dotenv').config()
const express = require('express')
const app = express()
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var User = require('./backend/models/user');
var Tweet = require('./backend/models/tweet');

//var passport = require('passport');
const port = process.env.PORT || 3030


app.get('/', (req, res) => res.send('Hello World!'));

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

  // ****** Body Parser **********
app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(bodyParser.json())
  app.use(cors());
  // * Body Parser ********

  app.post('/api/register',(req, res)=> {
    //console.log(JSON.stringify(req.body));
    var user = new User({
      email: req.body.email,
      username: req.body.username,
      password: User.hashPassword(req.body.password)
    });
    user.save((err, doc) => {
      if (err) {
        console.log("Error occurred");
        res.json({
          "message": "error"
        });
      } else
        res.json(doc);
    })
  });
  
  app.get('/api/login',(req,res)=>{
    console.log(req.query);
    User.findOne({ email: req.query.email }, function (err, user) {
      if (err) {
        console.log('Error while getting user from DB in /api/login: ' + err);
        res.json({
          error: err
        });
      } else {
          if (user==null) {
            res.json({ message: 'Incorrect username.' });
          }
          else if(!user.isValid(req.query.password)) {
            res.json({ message: 'Incorrect password.' });
          }
          else
            res.json({username:user.username, userid:user.email, message: 'success' });
      }
  });
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
          if(doc == null){
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