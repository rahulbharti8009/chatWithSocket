import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ChatUser, RootStackParamList } from '../utils/types';
import { ChatListItem } from '../components/ChatListItem';
import { localGetMobile } from '../utils/localDB';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MySocket from '../utils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DB from '../db/DBEntity';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};
export const HomeUI: React.FC<Props> = ({ navigation }) => {
  // const {mobile} = route.params
  const [mobile, setMobile] = useState<String | null>(null);

  const [users, setUsers] = useState<ChatUser[]>([]);

  useEffect(() => {
    const fetchMobile = async () => {
      const savedMobile = await localGetMobile();
      if (savedMobile) {
        setMobile(savedMobile);
      }
    };

    fetchMobile();
  }, []);

  useEffect(() => {
    const saveMobile = async () => {
      try {
        const mobile = await AsyncStorage.getItem('mobile');
        DB.mobile = mobile ?? ""
        const socketParams = 'users';
        const mySocket = MySocket.getInstance();
        const socket = mySocket.createSocket();

        if (!socket.connected) socket.connect();
        socket.emit('getUsers');
        const handleUsers = (data: ChatUser[]) => {
          console.log('Received users list:', data);
          setUsers(data);
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

    saveMobile()
  }, []);

  return (
    <>
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ChatListItem
            user={item}
            onPress={() => navigation.navigate('ChatHistory', { user: item })}
          />
        )}
      />
    </>
  );
};
