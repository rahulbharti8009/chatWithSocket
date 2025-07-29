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
} from 'react-native';
import { MyStack } from './app/navigation/stack';
import { ThemeProvider, useTheme } from './app/theme/ThemeContext';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import MySocket from './app/utils/socket';
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  // const { theme, toggleTheme, themeColor } = useTheme();

  async function onMessageReceived(message: any) {
    await notifee.displayNotification({
      title: message.notification?.title,
      body: message.notification?.body,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher', // Ensure this exists in android/app/src/main/res
        importance: AndroidImportance.HIGH,
      },
    });
  }
  
  // Listen in foreground
  useEffect(() => {
    if (Platform.OS === 'ios') {
      
    } else {

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        // Alert.alert('Foreground FCM:', JSON.stringify(remoteMessage));
        onMessageReceived(remoteMessage);
      });
    
      return unsubscribe;
    }

  }, []);

  useEffect(() => {
    async function createChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
  
    createChannel();
  }, []);

  return (
    <SafeAreaView style={[styles.container,{
      paddingTop: StatusBar.currentHeight , backgroundColor: isDarkMode ? "#000000" : "#DD9C0FFF"
    }] }>
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
