import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { ChatUser, RootStackParamList } from '../utils/types';
import { ChatListItem } from '../components/ChatListItem';
import { localGetMobile } from '../utils/localDB';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MySocket from '../utils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DB from '../db/DBEntity';
import CustomHeader from '../components/CustomHeader';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};
export const HomeUI: React.FC<Props> = ({ navigation }) => {
  // const {mobile} = route.params
  const [mobile, setMobile] = useState<String | null>(null);

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoading, setlaoding] = useState(true);
  const { theme, toggleTheme, themeColor } = useTheme();


  useEffect(() => {
    const saveMobile = async () => {
      try {
        const mobile = await localGetMobile();
        DB.mobile = mobile ?? '';

        const socketParams = 'users';
        const mySocket = MySocket.getInstance();
        const socket = mySocket.createSocket();

        if (!socket.connected) socket.connect();
        socket.emit('getUsers');
        const handleUsers = (data: ChatUser[]) => {
          console.log('Received users list:', data);
          setUsers(data);
          setlaoding(false);
        };
        socket.on(socketParams, handleUsers);
        return () => {
          socket.off(socketParams, handleUsers);
          // socket.removeAllListeners();
          socket.disconnect(); // 👈 disconnect cleanly
        };
      } catch (error) {
        console.error('Failed to save mobile number:', error);
      }
    };
    saveMobile();
  }, []);

  return (
    <>
        <CustomHeader title='Home'/>

      {isLoading && users.length == 0 && (
        <>
          <View
            style={{
              flex: 1,
              backgroundColor: themeColor.background,
              height: '100%',
              width: '100%',
              justifyContent: 'center', // vertically center
              alignItems: 'center', // horizontally center
            }}
          >
            <ActivityIndicator style={{}} size="small" color="#F8F8F8FF" />
          </View>
        </>
      )}

      {!isLoading && users.length > 0 && (
        <FlatList
          style={{ backgroundColor: themeColor.background }}
          data={users}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ChatListItem
              user={item}
              onPress={() => navigation.navigate('ChatHistory', { user: item })}
            />
          )}
        />
      )}
      
    </>
  );
};
