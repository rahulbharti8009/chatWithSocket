// components/CustomHeader.js

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

const CustomHeader = ({ title }: {title: string}) => {
    const { theme, toggleTheme, themeColor } = useTheme();
  
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: themeColor.background,
        borderBottomWidth: 1,
        borderBottomColor: themeColor.background,
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={require('../assets/back.png')}
        style={{ width: 30, height: 30 , padding: 0,backgroundColor: themeColor.background ? '#000' : '#000', tintColor: theme ? '#ffffff': '#000000'}} // adjust size as needed
      />
      </TouchableOpacity>
      <Text
        style={{
          color: themeColor.text,
          fontSize: 18,
          fontWeight: 'bold',
          marginLeft: 16,
        }}
      >
        {title}
      </Text>
       {/* Call and Video Call buttons */}
      <View style={{ flexDirection: 'row' }}>
        {/* <TouchableOpacity onPress={() => console.log("Voice call")} style={{ marginHorizontal: 8 }}>
          <Icon name="call-outline" size={22} color={themeColor.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Video call")}>
          <Icon name="videocam-outline" size={22} color={themeColor.text} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default CustomHeader;
