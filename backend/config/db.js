// backend/config/db.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
let serviceAccount;

// Helper function to create service account from environment variables
function createServiceAccountFromEnv() {
  return {
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
}

// Helper function to validate service account
function validateServiceAccount(account, source) {
  if (!account || typeof account !== 'object') {
    throw new Error(`Invalid service account from ${source}`);
  }
  if (!account.project_id || typeof account.project_id !== 'string') {
    throw new Error(`Service account from ${source} is missing valid project_id`);
  }
  if (!account.private_key || typeof account.private_key !== 'string') {
    throw new Error(`Service account from ${source} is missing valid private_key`);
  }
  if (!account.client_email || typeof account.client_email !== 'string') {
    throw new Error(`Service account from ${source} is missing valid client_email`);
  }
}

// Strategy 1: Try environment variables first (preferred for production)
if (process.env.FIREBASE_PROJECT_ID) {
  try {
    serviceAccount = createServiceAccountFromEnv();
    validateServiceAccount(serviceAccount, 'environment variables');
    console.log('Using Firebase credentials from environment variables');
  } catch (error) {
    console.warn('Environment variables found but incomplete:', error.message);
    serviceAccount = null;
  }
}

// Strategy 2: Fall back to JSON file if env vars not available
const jsonPath = path.join(__dirname, 'event-management-system-5f73a-firebase-adminsdk-fbsvc-7204e66ca4.json');

if (!serviceAccount) {
  try {
    if (fs.existsSync(jsonPath)) {
      serviceAccount = require(jsonPath);
      validateServiceAccount(serviceAccount, 'JSON file');
      console.log('Using Firebase credentials from JSON file');
    }
  } catch (error) {
    console.warn('JSON file not found or invalid:', error.message);
  }
}

// If still no credentials, throw a helpful error
if (!serviceAccount) {
  const errorMessage = `
Firebase credentials not found!

Please set the following environment variables in Railway:
- FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY
- FIREBASE_CLIENT_EMAIL

Or ensure the service account JSON file exists at:
${jsonPath}

Current environment check:
- NODE_ENV: ${process.env.NODE_ENV || 'not set'}
- RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'not set'}
- FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? 'set' : 'not set'}
- JSON file exists: ${fs.existsSync(jsonPath) ? 'yes' : 'no'}
  `.trim();
  throw new Error(errorMessage);
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
