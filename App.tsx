/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  PermissionsAndroid
} from 'react-native';
import { MyStack } from './app/navigation/stack';
import { ThemeProvider, useTheme } from './app/theme/ThemeContext';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const permission = (PERMISSIONS.ANDROID as any).POST_NOTIFICATIONS;
    const result = await check(permission);

   if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
      const status = await request(permission);
      console.log('Permission status:', status);
      return status === RESULTS.GRANTED;
    }

    return result === RESULTS.GRANTED;
  } else {
    // No permission required below Android 13
    return true;
  }
};

useEffect(() => {
  requestNotificationPermission()
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert('New FCM Message!', JSON.stringify(remoteMessage.notification));
  });

  return unsubscribe;
}, []);

// Called when the app is opened from quit state
useEffect(() => {
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });
}, []);


  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: StatusBar.currentHeight,
        },
      ]}
    >
      <StatusBar
        hidden={false}
        barStyle="light-content" // or "dark-content"
        backgroundColor="#DD9C0FFF" // Android only
        translucent={true} // false = draws below status bar
      />
      <MyStack />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
