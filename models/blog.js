const mongoose = require('mongoose')

var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);