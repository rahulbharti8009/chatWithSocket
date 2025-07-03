import React, { useEffect, useState } from 'react';
import { ChatMessage, ChatUser } from '../utils/types';
import {
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import DB from '../db/DBEntity';
import MySocket from '../utils/socket';

type ChatHistoryRouteProp = RouteProp<
  { ChatHistory: { user: ChatUser } },
  'ChatHistory'
>;

const ChatHistoryUI = () => {
  const mySocket = MySocket.getInstance();
  const socket = mySocket.getSocket();
  const route = useRoute<ChatHistoryRouteProp>();
  const user = route.params.user;
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socketParams = `message${DB.mobile}-${user.mobile}`;

    socket?.on(socketParams, (msg: ChatMessage) => {
      console.log('useEffect socket ', msg);
      setChat(prev => [...prev, msg]);
    });

    return () => {
      socket?.off(socketParams);
    };
  }, [user.mobile]);

  const sendMessage = () => {
    if (!DB.mobile || !message.trim()) return;

    const t = new Date();
    const date = `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;

    let hours = t.getHours();
    const minutes = t.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const time = `${hours}:${minutes} ${ampm}`;

    const body: ChatMessage = {
      message: message.trim(),
      clientFrom: DB.mobile.toString(),
      clientTo: user.mobile.toString(),
      date: date,
      time: time,
    };

    socket?.emit('user-message', body);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // adjust for platform
      style={{ flex: 1 }}
      keyboardVerticalOffset={80} // adjust if header overlaps
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, padding: 10 }}>
          <FlatList
            data={chat}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  alignSelf:
                    item.clientFrom === DB.mobile ? 'flex-end' : 'flex-start',
                  backgroundColor:
                    item.clientFrom === DB.mobile ? '#d1d1d1' : '#add8e6',
                  marginVertical: 5,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text>{item.message}</Text>
                <Text style={{ fontSize: 10, color: 'gray' }}>{item.time}</Text>
              </View>
            )}
          />
          <TextInput
            placeholder="Type your message"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 8,
              marginVertical: 10,
            }}
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatHistoryUI;
