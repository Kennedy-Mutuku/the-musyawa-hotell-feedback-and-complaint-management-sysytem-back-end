const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return !this.anonymous;
      },
      trim: true,
    },
    email: {
      type: String,
      required: function () {
        return !this.anonymous;
      },
      trim: true,
    },
    feedbackText: {  // renamed from message to feedbackText
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Compliment',
        'Complaint',
        'Suggestion',
        'Inquiry',
        'Other',
        'Report Corruption',
      ],
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    fileUrl: {
      type: String,    // <-- Added this field to store uploaded file URL/path
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
