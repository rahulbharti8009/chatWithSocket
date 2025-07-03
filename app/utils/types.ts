
export type RootStackParamList = {
    Login: undefined;
    Home: {mobile: String};
    ChatHistory : {user: ChatUser};
  };

  export type ChatUser = {
    _id: string;
    name?: string;
    mobile: string;
    image?: string;
    online ?: boolean
  };


  // Message Type
export interface ChatMessage {
  message: string;
  clientFrom: string;
  clientTo: string;
  date: string;
  time: string;
}
  