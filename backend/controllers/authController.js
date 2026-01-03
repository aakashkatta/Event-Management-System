const db = require('../config/db');
const admin = require('firebase-admin');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Query Firestore for user with matching username and password
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('username', '==', username)
      .where('password', '==', password)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    // Check if username already exists
    const usersRef = db.collection('users');
    const existingUser = await usersRef
      .where('username', '==', username)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Add new user to Firestore
    await usersRef.add({
      username,
      password,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};
