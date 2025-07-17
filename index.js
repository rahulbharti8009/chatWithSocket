/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDaVWxMzqRYjxLzoQv4ksuS4DBsqHUaufs",
//   authDomain: "rbchat-cc2fb.firebaseapp.com",
//   projectId: "rbchat-cc2fb",
//   storageBucket: "rbchat-cc2fb.firebasestorage.app",
//   messagingSenderId: "163168958694",
//   appId: "1:163168958694:web:681232b43699b5615ce327",
//   measurementId: "G-YERKWSZ07M"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

AppRegistry.registerComponent(appName, () => App);
