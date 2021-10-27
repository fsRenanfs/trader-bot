require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

const config = {
  apiKey: process.env.FIREBASE_APP_API_KEY,
  authDomain: process.env.FIREBASE_APP_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_APP_DATABASE_URL,
  storageBucket: process.env.FIREBASE_APP_STORAGE_BUCKET,
};

const app = initializeApp(config);
const firebaseDatabase = getDatabase(app);

module.exports = { firebaseDatabase };
