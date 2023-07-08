const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {nanoid} = require('nanoid');
const PostSchema = new schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  tags: {
    type: Array,
    default: [String]
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Posts', PostSchema);