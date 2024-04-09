// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  message: String,
  day: Number,
  time: String,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
