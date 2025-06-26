import React from 'react'
import { ChatUser } from '../utils/types'
import { Text, View } from 'react-native'

export const ChatHistoryUI : React.FC<{item : ChatUser}> = ({item}) => {
  return (
    <View><Text>{item?.mobile}</Text></View>
  )
}
