import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { checkInternetConnection, localSaveMobile } from '../utils/localDB';
import { BASE_URL } from '../utils/constant';
import DB from '../db/DBEntity';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoInternetAlert } from '../common/no-internet';
import { useTheme } from '../theme/ThemeContext';
import { getMessaging } from '@react-native-firebase/messaging';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginUI: React.FC<Props> = ({ navigation }) => {
  const [mobile, setMobile] = useState('8171800266');
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('Rahul');

  const [otp, setOtp] = useState('1234');
  const { theme, toggleTheme, themeColor } = useTheme();

    const getToken = async () => {
      const token = await getMessaging().getToken();
      // Alert.alert('FCM Token:', token);
      setName(token)
    };
    useEffect(() => {
      getToken();
    }, []);


  const handleLogin = async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      NoInternetAlert();
      return;
    }

    if (mobile.length < 10) {
      Alert.alert('Invalid Mobile', 'Mobile number must be 10 digits');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      mobile: mobile,
      name: name,
    });

    try {
      DB.mobile = mobile;
      setLoading(prev => true);
      console.log('BASE_URL', `${BASE_URL}api/chatLoginSignup`);
      const response = await fetch(`${BASE_URL}api/chatLoginSignup`, {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server returned error HTML/text:', text);
        Alert.alert('Error', 'Something went wrong: ' + response.status);
        return;
      }

      const result = await response.json();
      console.log('✅ API Response:', result);
      setLoading(prev => false);
      localSaveMobile(mobile, async mobile => {
        console.log('✅ callback:', mobile);
        await AsyncStorage.setItem('mobile', mobile.toString());
        navigation.navigate('Home', { mobile });
      });
    } catch (error) {
      Alert.alert('Login Failed', `${JSON.stringify(error)}`);
      console.error(error);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'This would trigger Google Sign-In flow.');
    // Implement actual Google sign-in here (optional)
  };

  return (
    <SafeAreaView
      style={[styles.container, { flex: 1, backgroundColor: themeColor.background }]}
    >
      <View style={styles.box}>
        <Text style={[styles.heading, { color: themeColor.text }]}>
          Login Screen
        </Text>

        <TextInput
          placeholder="Enter Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="number-pad"
          style={[
            styles.input,
            { color: themeColor.text, backgroundColor: themeColor.background },
          ]}
          maxLength={10}
        />

        {mobile.length >= 10 && (
          <>
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              style={[
                styles.input,
                { color: themeColor.text, backgroundColor: themeColor.background },
              ]}
              keyboardType="number-pad"
            />
            <TextInput
              placeholder="Enter your profile name."
              value={name}
              onChangeText={setName}
              keyboardType="default"
              style={[
                styles.input,
                { color: themeColor.text, backgroundColor: themeColor.background },
              ]}
              // maxLength={10}
            />
          </>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={[styles.loginButtonText, { color: '#FFFFFF' }]}>
            {isLoading ? <ActivityIndicator size="small" color="#FFFFFF"/> : 'Login'}
          </Text>
        </TouchableOpacity>

        <Text style={{ marginVertical: 20, fontWeight: '500' }}>OR</Text>

        <TouchableOpacity
          style={[styles.googleButton, { backgroundColor: themeColor.background }]}
          onPress={handleGoogleLogin}
        >
          <Image
            source={require('../assets/google.png')} // adjust the path
            style={{ marginRight: 10, width: 20, height: 20 }}
          />
          <Text style={[styles.googleButtonText, { color: themeColor.text }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: '#00695C',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  googleButtonText: {
    fontSize: 16,
  },
});
