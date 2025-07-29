/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

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
