import { io } from "socket.io-client";

const serverUrl = import.meta.env.VITE_API_URL;
const socket = io(serverUrl || `http://localhost:3000`, {
  withCredentials: true,
});

export default socket;
