// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register); // 👈 Add this line


module.exports = router;
