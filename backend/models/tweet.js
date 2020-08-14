var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
  index: Number,
  user: String,
  msg: String,
  likeCount:Number
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
