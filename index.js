/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDaVWxMzqRYjxLzoQv4ksuS4DBsqHUaufs",
  authDomain: "rbchat-cc2fb.firebaseapp.com",
  projectId: "rbchat-cc2fb",
  storageBucket: "rbchat-cc2fb.firebasestorage.app",
  messagingSenderId: "163168958694",
  appId: "1:163168958694:web:681232b43699b5615ce327",
  measurementId: "G-YERKWSZ07M"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background FCM:', remoteMessage);
    // await notifee.displayNotification({
    //   title: remoteMessage.notification?.title,
    //   body: remoteMessage.notification?.body,
    //   android: {
    //     channelId: 'default',
    //   },
    // });
  });

AppRegistry.registerComponent(appName, () => App);
