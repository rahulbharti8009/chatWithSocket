import React, { useState } from "react";
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
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types";
import Icon from "react-native-vector-icons/FontAwesome";
import { localSaveMobile } from "../utils/localDB";
import { BASE_URL } from "../utils/constant";
import DB from "../db/DBEntity";
import AsyncStorage from "@react-native-async-storage/async-storage";


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export const LoginUI: React.FC<Props> = ({ navigation }) => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");

  const [otp, setOtp] = useState("1234");

  const handleLogin = async () => {
    if (mobile.length < 10) {
      Alert.alert("Invalid Mobile", "Mobile number must be 10 digits");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      mobile: mobile,
      name: name,

    });

    try {
        DB.mobile = mobile

      console.log("BASE_URL" , `${BASE_URL}api/chatLoginSignup`)
      const response = await fetch(`${BASE_URL}api/chatLoginSignup`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });
            
      if (!response.ok) {
        const text = await response.text();
        console.error("Server returned error HTML/text:", text);
        Alert.alert("Error", "Something went wrong: " + response.status);
        return;
      }
      
      const result = await response.json();
      console.log("✅ API Response:", result);
      localSaveMobile(mobile, async(mobile)=> {
        console.log("✅ callback:", mobile);
        await AsyncStorage.setItem("mobile",mobile.toString())
        navigation.navigate('Home', {mobile});
      })
    } catch (error) {
      Alert.alert("Login Failed", `${JSON.stringify(error)}`);
      console.error(error);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "This would trigger Google Sign-In flow.");
    // Implement actual Google sign-in here (optional)
  };

  return (
    <SafeAreaView 
      style={[styles.container,{flex: 1}]}
    >
      <View style={styles.box}>
        <Text style={styles.heading}>Login Screen</Text>

        <TextInput
          placeholder="Enter Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="number-pad"
          style={styles.input}
          maxLength={10}
        />

        {mobile.length >= 10 && (
          <>
        
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="number-pad"
          />
        <TextInput
          placeholder="Enter your profile name."
          value={name}
          onChangeText={setName}
          keyboardType="default"
          style={styles.input}
          maxLength={10}
        />
</>
        )}

      

<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
<Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={{ marginVertical: 20, fontWeight: "500" }}>OR</Text>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Image   source={require('../assets/google.png')} // adjust the path
               style={{ marginRight: 10, width: 20, height: 20 }} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#00695C",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  googleButtonText: {
    fontSize: 16,
    color: "#444",
  },
});
