
export type RootStackParamList = {
    Login: undefined;
    Home: {mobile: String};
    ChatHistory : {user: ChatUser};
    AddGroupUI : {users: ChatUser[]};
    VideoCall: {}
  };

  export type ChatUser = {
    _id: string;
    name: string;
    mobile?: string;
    image?: string;
    online ?: boolean;
    admin: string;
    group_user: GroupUser[];
    __v: number;
  };

// group
export interface GroupUser {
  _id: string;
  mobile: string;
}
  // Message Type
export interface ChatMessage {
  message: string;
  from : string,
  clientFrom: string;
  clientTo: string;
  date: string;
  time: string;
}
  