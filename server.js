require('dotenv').config();
const express = require('express');
const app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var Tweet = require('./backend/models/tweet');

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

  // ****** Body Parser **********
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(bodyParser.json())
  app.use(cors());
  // * Body Parser ********

  app.get('/api/tweets', (req, res) => {
    let query = {};
    if(req.query.username)
      query.google_id = req.query.username;  // +req.query.yera '+' for ParseInt
    //console.log(query);
    Tweet.find(query,'', {
      sort : '-index',
      limit: 50
    }, (err, docs) => {
      if (err) {
        console.log('Error while getting tweets from DB in /api/tweets: ' + err);
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
      "likeCount" : req.body.likeCount,
      "google_id" : req.body.google_id,
      "likers" : req.body.likers
    };
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
  });

  app.post('/api/delete',(req, res) =>{
    Tweet.findOneAndDelete({ index : req.body.index }, function (err, docs) { 
        if (err){ 
            console.log(err) 
        } 
        else{ 
            console.log("Deleted User : ", docs); 
        } 
    });
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
