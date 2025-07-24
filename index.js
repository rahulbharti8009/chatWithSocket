/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging } from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';


messaging().onMessage(async remoteMessage => {
  Alert.alert('New FCM Message', JSON.stringify(remoteMessage.notification));
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
