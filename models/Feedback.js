const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Complaint', 'Compliment', 'Suggestion', 'Inquiry', 'Report Corruption', 'Other'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  fileUrl: {
    type: String,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
