import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChatUser } from '../utils/types';

export const ChatListItem: React.FC<{ user: ChatUser ,  onPress: () => void }> = ({ user, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}  activeOpacity={0.7}>
      <Image
        source={{
          uri: user.image || 'https://via.placeholder.com/60',
        }}
        style={styles.avatar}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{user.name || 'No Name'}</Text>
        <Text style={styles.mobile}>{user.mobile}</Text>
        <Text style={styles.time}>{user.online ?  "online" :"offline"} </Text>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  mobile: {
    color: '#555',
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
});