import React, { useEffect, useState } from 'react';
import { ChatMessage, ChatUser } from '../utils/types';
import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import DB from '../db/DBEntity';
import MySocket from '../utils/socket';
import CustomHeader from '../components/CustomHeader';
import { useTheme } from '../theme/ThemeContext';

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
  const { theme, toggleTheme, themeColor } = useTheme();

  useEffect(() => {
    const socketParams = `message${ user.mobile ==  undefined ? `${user?.name.toString()}-${user?.name.toString()}`: `${DB.mobile}-${user.mobile.toString()}`}`;

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
// Alert.alert(`${user.mobile}`,`${JSON.stringify(user)}`)
    const body: ChatMessage = {
      message: message.trim(),
      from: DB.mobile.toString(),
      clientFrom: user.mobile ==  undefined ? `${user?.name.toString()}`: DB.mobile.toString(),
      clientTo: user.mobile ==  undefined ? `${user?.name.toString()}`: user.mobile.toString(),
      date: date,
      time: time,
    };

    socket?.emit('user-message', body);
    setMessage('');
  };

  return (
    <>
      <CustomHeader
        title={`${user.name == null ? user.name : user.name}`}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // adjust for platform
        style={{ flex: 1 }}
        keyboardVerticalOffset={100} // adjust if header overlaps
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: 10, backgroundColor: themeColor.background }}>
            <FlatList
              data={chat}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <>
                  {(index === 0 || item.date !== chat[index - 1]?.date) && (
                    <Text
                      style={{
                        
                        alignSelf: 'center',
                        marginVertical: 4,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        backgroundColor: theme,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'gray',
                        color:  themeColor.text,
                        overflow: 'hidden',
                      }}
                    >
                      {item.date}
                    </Text>
                  )}
                  <View
                    style={{
                      alignSelf:
                        item.from === DB.mobile
                          ? 'flex-end'
                          : 'flex-start',
                      backgroundColor:
                        item.from === DB.mobile ? '#d1d1d1' : '#add8e6',
                      marginStart: item.from === DB.mobile ? 40 : 5,
                      marginEnd: item.from === DB.mobile ? 5 : 40,
                      marginVertical: 5,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text>{item.message}</Text>
                    <Text style={{ fontSize: 10, color: 'gray' }}>
                      {item.time}
                    </Text>
                  </View>
                </>
              )}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 10,
                marginVertical: 10,
              }}
            >
              <TextInput
                placeholder="Type your message"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
                multiline
                style={{
                  color:  themeColor.text,
                  flex: 1,
                  paddingVertical: 8,
                  paddingRight: 10, // give space for the send icon
                }}
              />
              <TouchableOpacity onPress={sendMessage}>
                <Text
                  style={{ color: '#007AFF', fontWeight: '600', padding: 8 }}
                >
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default ChatHistoryUI;
