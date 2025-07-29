import { io, Socket } from 'socket.io-client';
import { BASE_URL } from './constant';
import DB from '../db/DBEntity';
class MySocket {
  private static instance: MySocket;
  private socket: Socket | null = null;

  constructor() {
    console.log('Singleton instance created');
  }

  public static getInstance() {
    if (!MySocket.instance) {
      this.instance = new MySocket();
    }
    return this.instance;
  }

  public createSocket(): Socket {
    if (!DB.mobile) {
      throw new Error('DB.mobile is not set yet!');
    }
    if(this.socket == null){
      this.socket = io(BASE_URL, {
        transports: ['websocket'],
        autoConnect: false,
        query: {
          userId: DB.mobile,
        },
      });
    }

    return this.socket;
  }

  public getSocket(): Socket | null {
    if (this.socket == null) {
      this.socket = io(BASE_URL, {
        transports: ['websocket'],
        autoConnect: false,
        query: {
          userId: DB.mobile,
        },
      });
      return this.socket;
    }
    return this.socket;
  }
}

export default MySocket;
