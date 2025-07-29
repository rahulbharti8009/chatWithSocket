// components/CustomHeader.js

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

const CustomChattingHeader = ({ title, online  }: {title: string,online: string}) => {
    const { theme, toggleTheme, themeColor } = useTheme();
  
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: themeColor.background,
        borderBottomWidth: 1,
        borderBottomColor: themeColor.text + '30', // slight border tint
      }}
    >
      {/* Back Button + Title */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back.png')}
            style={{
              width: 24,
              height: 24,
              tintColor: themeColor.text,
              marginRight: 12,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: themeColor.text,
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          {`${title.substring(0,1).toUpperCase()}${title.substring(1,title.length)}`}
        </Text>
      </View>

      {/* Call & Video Icons */}
      {/* <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => console.log('Voice call')}
          style={{ marginHorizontal: 8 }}
        >
          <Icon name="call-outline" size={22} color={themeColor.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Video call')}>
          <Icon name="videocam-outline" size={22} color={themeColor.text} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default CustomChattingHeader;
