const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      message: 'Admin login successful',
      token,
    });
  } else {
    return res.status(401).json({ message: 'Invalid admin password' });
  }
});

module.exports = router;
