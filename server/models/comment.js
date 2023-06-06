const mongoose = require('mongoose');
const schema = mongoose.Schema;
const CommentSchema = new schema({
  id_post: {
    type: String,
    required: true
  },
  body: [
    {
      comment: String,
      person: String,
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('Comment', CommentSchema);