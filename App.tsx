/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { MyStack } from './app/navigation/stack';
import { ThemeProvider, useTheme } from './app/theme/ThemeContext';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';


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
