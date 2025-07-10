import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
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
import { GroupChatListItem } from '../components/GroupChatListItem';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};
export const HomeUI: React.FC<Props> = ({ navigation }) => {
  // const {mobile} = route.params
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [group, setGroup] = useState<ChatUser[]>([]);

  const [isLoading, setlaoding] = useState(true);
  const [chatType, setChatType] = useState('chat');

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
        socket.emit('group', mobile);
        socket.on(`getGroupApi${mobile}`, (mobile)=> {
          // Alert.alert('group====== '+mobile);
                  socket.emit('group', mobile);
        })
// ========== chat ===========
        const handleUsers = (data: ChatUser[]) => {
          console.log('Received users list:', data);
          setUsers(data);
          setlaoding(false);
        };
        socket.on(socketParams, handleUsers);
//======= group chat =======
        const handleGroup = (data: ChatUser[]) => {
          console.log('Received group list:', data);
          setGroup(data);
          setlaoding(false);
        };
        socket.on(`group${mobile}`, handleGroup);
        return () => {
          socket.off(socketParams, handleUsers);
          socket.off("group${mobile}", handleGroup);

          // socket.removeAllListeners();
          socket.disconnect(); // 👈 disconnect cleanly
        };
      } catch (error) {
        console.error('Failed to save mobile number:', error);
      }
    };
    saveMobile();
  }, []);

  const ChatTypeComp=()=> {
    switch(chatType){
      case "chat": return <>
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
      </>
      case "group": return <>
       <FlatList
          style={{ backgroundColor: themeColor.background }}
          data={group}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <GroupChatListItem
              user={item}
              onPress={() => navigation.navigate('ChatHistory', { user: item })}
            />
          )}
        />
      </>
      case "group": return <>{}</>
    }
  }

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
      <>
    <ChatTypeComp/>
       
           <View
            style={{
              bottom:10,
              position:'absolute',
              width: 300,
              height: 50,
              backgroundColor: themeColor.navbar,
              borderRadius: 50,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingHorizontal: 10,
            }}
          >
            {/* Chat 1 */}
            <TouchableOpacity onPress={() => setChatType(()=> 'chat')}>
            <Text style={{ color: themeColor.navbarTextColor }}>Chat</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ width: 1, height: '60%', backgroundColor: themeColor.navbarTextColor }} />

            {/* Chat 2 */}
            <TouchableOpacity onPress={() => setChatType(()=> 'group')}>
            <Text style={{ color: themeColor.navbarTextColor }}>Group</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ width: 1, height: '60%', backgroundColor: themeColor.navbarTextColor }} />

            {/* Group */}
            <TouchableOpacity onPress={() => {
              navigation.navigate('AddGroupUI', { users : users})
            }}>
            <Text style={{ color: themeColor.navbarTextColor }}>Group +</Text>
            </TouchableOpacity>
          </View>
      </>
      )}
      
    </>
  );
};
