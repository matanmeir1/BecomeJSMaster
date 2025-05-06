const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  template: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  hints: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('CodeBlock', codeBlockSchema); 