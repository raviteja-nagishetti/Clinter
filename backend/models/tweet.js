var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
  index: Number,
  user: String,
  msg: String,
  likeCount:Number,
  google_id: String,
  likers: [String]
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
