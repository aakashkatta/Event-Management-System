// backend/config/db.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let serviceAccount;

// Try to load service account from file (for local development)
try {
  serviceAccount = require('./event-management-system-5f73a-firebase-adminsdk-fbsvc-7204e66ca4.json');
} catch (error) {
  // If file doesn't exist, use environment variables (for production/deployment)
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firestore connected...');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

const db = admin.firestore();

module.exports = db;
