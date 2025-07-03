import React,{useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginUI } from '../ui/loginUI';
import { HomeUI } from '../ui/HomeUI';
import { localGetMobile } from '../utils/localDB';
import ChatHistoryUI  from '../ui/ChatHistory';

const Stack = createNativeStackNavigator();

export const MyStack = () => {

  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkAuth = async () => {
      const mobile = await localGetMobile();
      setInitialRoute(mobile ? 'Home' : 'Login');
    };
    checkAuth();
  }, []);

  if (!initialRoute) return null; // or use a loading spinner


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginUI}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeUI}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="ChatHistory" component={ChatHistoryUI} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
