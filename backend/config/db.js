// backend/config/db.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let serviceAccount;

// Check if we're in production (Railway, Heroku, etc.) - prioritize environment variables
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT || process.env.PORT;

if (isProduction && process.env.FIREBASE_PROJECT_ID) {
  // Use environment variables in production
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
} else {
  // Try to load service account from file (for local development)
  try {
    serviceAccount = require('./event-management-system-5f73a-firebase-adminsdk-fbsvc-7204e66ca4.json');
    // Validate that the loaded file has required properties
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Service account JSON file is missing required properties: project_id, private_key, or client_email');
    }
  } catch (error) {
    // If file doesn't exist or is invalid, try environment variables as fallback
    if (process.env.FIREBASE_PROJECT_ID) {
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
    } else {
      throw new Error('Firebase credentials not found. Either provide a service account JSON file or set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables.');
    }
  }
}

// Final validation before initialization
if (!serviceAccount || typeof serviceAccount !== 'object') {
  throw new Error('Service account configuration is invalid or missing');
}

if (!serviceAccount.project_id || typeof serviceAccount.project_id !== 'string') {
  throw new Error(`Service account is missing valid project_id. Current value: ${serviceAccount.project_id}`);
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firestore connected...');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    console.error('Service account keys:', serviceAccount ? Object.keys(serviceAccount) : 'null');
    throw error;
  }
}

const db = admin.firestore();

module.exports = db;
