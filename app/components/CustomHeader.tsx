// components/CustomHeader.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

const CustomHeader = ({ title }: {title: string}) => {
    const { theme, toggleTheme, themeColor } = useTheme();
  
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: themeColor.background,
        borderBottomWidth: 1,
        borderBottomColor: themeColor.background,
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={themeColor.text} />
      </TouchableOpacity>
      <Text
        style={{
          color: themeColor.headerText,
          fontSize: 18,
          fontWeight: 'bold',
          marginLeft: 16,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default CustomHeader;
