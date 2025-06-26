
import AsyncStorage from '@react-native-async-storage/async-storage';

export const localSaveMobile =async(mobile: String, callback:  (value: String) => void)=> {
   await AsyncStorage.setItem("mobile", mobile.toString());
   callback(mobile)
}

export const localGetMobile = async() : Promise<String | null> => {
   const mobile = await AsyncStorage.getItem("mobile");
    return mobile
 };