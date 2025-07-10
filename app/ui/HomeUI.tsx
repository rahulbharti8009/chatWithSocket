import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text, Animated,
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


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};
export const HomeUI: React.FC<Props> = ({ navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  // const {mobile} = route.params
  const [mobile, setMobile] = useState<String | null>(null);

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoading, setlaoding] = useState(true);
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
          <View
            style={{
              bottom: 10,
              position: 'absolute',
              width: 300,
              height: 50,
              backgroundColor: '#000',
              borderRadius: 50,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingHorizontal: 10,
            }}
          >
            {/* Chat 1 */}
            <Text style={{ color: '#fff' }}>Chat</Text>

            {/* Divider */}
            <View style={{ width: 1, height: '60%', backgroundColor: '#fff' }} />

            {/* Chat 2 */}
            <Text style={{ color: '#fff' }}>Group</Text>

            {/* Divider */}
            <View style={{ width: 1, height: '60%', backgroundColor: '#fff' }} />

            {/* Group */}
            <Text style={{ color: '#fff' }}>Group +</Text>
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
