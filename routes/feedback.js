const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Feedback = require('../models/Feedback');

// 📁 Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// 📨 POST /api/feedback - submit feedback with file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, email, feedbackText, category, anonymous } = req.body;

    const fileUrl = req.file
      ? `https://${req.get('host')}/uploads/${req.file.filename}`
      : null;

    const feedback = new Feedback({
      name,
      email,
      message: feedbackText,
      category,
      anonymous,
      fileUrl: req.file
    ? `https://the-musyawa-hotell-feedback-and.onrender.com/uploads/${req.file.filename}`
    : null,
    submittedAt: new Date()
    });

    console.log("✅ Received feedback submission:", feedback);

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('❌ Error saving feedback:', error.message);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// 📥 GET /api/feedback - fetch all feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('❌ Error fetching feedbacks:', error.message);
    res.status(500).json({ message: 'Failed to fetch feedbacks' });
  }
});

// 🗑 DELETE /api/feedback/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting feedback:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
