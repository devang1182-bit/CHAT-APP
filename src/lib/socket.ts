import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000", {
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;