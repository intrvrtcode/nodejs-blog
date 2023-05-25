const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { nanoid } = require('nanoid');
const UserSchema = new schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  joined: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);