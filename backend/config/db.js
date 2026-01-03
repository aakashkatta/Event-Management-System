// backend/config/db.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let serviceAccount;

// Try to load service account from file (for local development)
try {
  serviceAccount = require('./event-management-system-5f73a-firebase-adminsdk-fbsvc-7204e66ca4.json');
} catch (error) {
  // If file doesn't exist, use environment variables (for production/deployment)
  // Firebase Admin SDK requires snake_case property names
  serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: 'googleapis.com'
  };

  // Validate required fields
  if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error('Missing required Firebase environment variables: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL must be set');
  }
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
