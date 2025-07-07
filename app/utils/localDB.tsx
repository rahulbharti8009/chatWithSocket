
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useColorScheme } from 'react-native';

export const localSaveMobile =async(mobile: String, callback:  (value: String) => void)=> {
   await AsyncStorage.setItem("mobile", mobile.toString());
   callback(mobile)
}

export const localGetMobile = async() : Promise<String | null> => {
   const mobile = await AsyncStorage.getItem("mobile");
    return mobile
 };


 export const checkInternetConnection=async() : Promise<boolean> =>{
   const state = await NetInfo.fetch()
   return !!state.isConnected
 }

