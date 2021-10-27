require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

const config = {
  apiKey: process.env.FIREBASE_APP_API_KEY,
  authDomain: process.env.FIREBASE_APP_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_APP_DATABASE_URL,
  storageBucket: process.env.FIREBASE_APP_STORAGE_BUCKET,
};

const firebaseImpl = initializeApp(config);
const firebaseDatabase = getDatabase();

const gravarTeste = () => {
  const firebaseDatabase = getDatabase();
  set(ref(firebaseDatabase, 'users/' + 'renan id'), {
    username: 'renan',
    email: 'rer@',
    profile_picture: 'jpg',
  });
};

gravarTeste();
module.exports = { firebaseImpl, firebaseDatabase };
