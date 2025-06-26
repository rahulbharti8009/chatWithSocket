
export type RootStackParamList = {
    Login: undefined;
    Home: {mobile: String};
    ChatHistory : {user: ChatUser};

  };

  export type ChatUser = {
    _id: string;
    name?: string;
    mobile: string;
    time: string;
    image?: string;
    online ?: boolean
  };
  