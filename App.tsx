/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { MyStack } from './app/navigation/stack';
import { ThemeProvider } from './app/theme/ThemeContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.container,{
      paddingTop: StatusBar.currentHeight 
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
