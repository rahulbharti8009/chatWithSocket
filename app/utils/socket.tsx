import { io, Socket } from 'socket.io-client';
import { BASE_URL } from './constant';

// 👇 Define types for your server events (optional but recommended)
interface ServerToClientEvents {
  users: (data: any[]) => void; // adjust the type (e.g., User[]) if known
}

interface ClientToServerEvents {
  getUsers: () => void;
}

// 👇 Typed socket instance
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  BASE_URL,
  {
    transports: ["websocket"],
    autoConnect: false, // optional: control when to connect
    query: {
      userId : "8171800266", // 👈 this gets passed to the server in socket.handshake.query
    },
  }
);

export default socket;