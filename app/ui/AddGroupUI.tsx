import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ChatUser, RootStackParamList } from '../utils/types';
import CustomHeader from '../components/CustomHeader';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { checkInternetConnection } from '../utils/localDB';
import { NoInternetAlert } from '../common/no-internet';
import DB from '../db/DBEntity';
import { BASE_URL } from '../utils/constant';
import axios from 'axios';
import MySocket from '../utils/socket';

type AddGroupUIRouteProp = RouteProp<RootStackParamList, 'AddGroupUI'>;
const tag = "AddGroupUI";
const AddGroupUI = () => {
  const { themeColor } = useTheme();
  const route = useRoute<AddGroupUIRouteProp>();
  const { users } = route.params;
  const [isLoading, setLoading] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const addGroupApi = async (groupData: any) => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      NoInternetAlert();
      return;
    }

    if (groupName.length < 3) {
      Alert.alert('Invalid Group', 'Group should be greater then 3 character.');
      return;
    }
    const updatedGroupData = [...groupData, { mobile: DB.mobile }];

    let data = {
      "name": groupName,
      "admin": DB.mobile,
      "group_user": updatedGroupData
    };
    const socket = MySocket.getInstance().getSocket()
    socket?.emit("addgroup", data)
    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: `${BASE_URL}api/addchatgroups`,
    //   headers: { 
    //     'Content-Type': 'application/json'
    //   },
    //   data : data
    // };
    
    // axios.request(config)
    // .then((response) => {
    //   Alert.alert(JSON.stringify(response.data));
      
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  const handleCreateGroup = async() => {
    if (!groupName || selectedUsers.length === 0) {
      Alert.alert('Please enter group name and select members.');
      return;
    }

    const groupData = await users.filter((user) => selectedUsers.includes(user._id)).map((item) => ({"mobile": item.mobile}))
    // Alert.alert('Creating Group', JSON.stringify(groupData, null, 2));
    // Call your API here
    addGroupApi(groupData);
  };

  return (
    <>
      <CustomHeader title="Add Group" />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: themeColor.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TextInput
          placeholder="Enter group name"
          value={groupName}
          onChangeText={setGroupName}
          placeholderTextColor="#888"
          style={[
            styles.input,
            {
              borderColor: '#ccc',
              borderWidth: 1,
              backgroundColor: themeColor.background,
              color: themeColor.text,
            },
          ]}
        />

        <FlatList
          data={users}
          style={{ marginVertical: 10 }}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const isSelected = selectedUsers.includes(item._id);
            return (
              <TouchableOpacity
                onPress={() => toggleUser(item._id)}
                style={[
                  styles.userItem,
                  {
                    backgroundColor: isSelected ? themeColor.background : themeColor.background,
                    borderColor: isSelected ? themeColor.button_bg_color : '#ddd',
                    borderWidth: 1,
                  },
                ]}
              >
                <Text style={[styles.userName, { color: themeColor.text }]}>
                  {item.name}
                </Text>
                <Text style={styles.userMobile}>{item.mobile}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          onPress={handleCreateGroup}
          style={[styles.button, { backgroundColor: themeColor.button_bg_color }]}
        >
          <Text style={[styles.buttonText, { color: themeColor.button_text_color }]}>
          {isLoading ? <ActivityIndicator size="small" color="#FFFFFF"/> : 'Create Group'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
};

export default AddGroupUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  userItem: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userMobile: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  button: {
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
