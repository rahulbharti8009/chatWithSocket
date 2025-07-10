import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  Text, Animated,
  TouchableOpacity,
  useColorScheme,
  View,
  StyleSheet,
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
  const scrollY = useRef(new Animated.Value(0)).current;
  // const {mobile} = route.params
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [group, setGroup] = useState<ChatUser[]>([]);

  const [isLoading, setlaoding] = useState(true);
  const [chatType, setChatType] = useState('chat');

  const { theme, toggleTheme, themeColor } = useTheme();

  const headerHeight = 60; // Customize as needed

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });


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
        // socket.emit('group', mobile);

          console.log('Received users list: 1');

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
       <Animated.FlatList
            style={{ backgroundColor: themeColor.chatBG, paddingTop: headerHeight-10 }}
            data={users}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
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
       <Animated.FlatList
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
      <Animated.View style={[styles.header, {backgroundColor: themeColor.background, transform: [{ translateY: headerTranslate }] }]}>

        <CustomHeader title='Home' />
      </Animated.View>
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
            <ActivityIndicator style={{}} size="large" color="#F8F8F8FF" />
          </View>
        </>
      )}

      {!isLoading && users.length > 0 && (
      <>
    <ChatTypeComp/>
       
           <View
            style={{
              bottom: 10,
              position: 'absolute',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    elevation: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
  },
  item: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});
