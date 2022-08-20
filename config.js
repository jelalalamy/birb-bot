//import { initializeApp } from "firebase/app";
//import { getFirestore } from 'firebase/firestore';
//const initializeApp = require('firebase/app')(initializeApp);
const { initializeApp } = require('firebase/app');
const { getFirestore }= require('firebase/firestore');
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore();

module.exports = {
  firestore
}

//export { firestore };