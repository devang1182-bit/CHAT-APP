import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./src/firebase/firebase.js";

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

async function startServer() {
  await app.prepare();

  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:4000",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("onConnection", (uid: string) => {
      console.log("User logged in:", uid);

      socket.data.id = uid;
    });

    socket.on("joinRoom", (roomId: string) => {
      console.log(`${socket.id} joined room: ${roomId}`);

      socket.join(roomId);
    });

    socket.on("leaveRoom", (roomId: string) => {
      console.log(`${socket.id} left room: ${roomId}`);

      socket.leave(roomId);
    });

    socket.on("sendMessage", async (data) => {
      try {
        console.log("Message received:", data);

        const { roomId, text, senderId, receiverId } = data;

        if (!roomId || !text || !senderId || !receiverId) {
          console.log("Invalid message data");

          return;
        }

        const message = {
          roomId,
          senderId,
          receiverId,
          message: text,
          createdAt: Date.now(),
        };

        const messageRef = await addDoc(collection(db, "messages"), message);

        const savedMessage = {
          id: messageRef.id,
          ...message,
        };

        console.log("Message saved:", savedMessage);

        io.to(roomId).emit("newMessage", savedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("typing", (data) => {
      console.log("server is listening the typing event");
      socket.broadcast.to(data.roomId).emit("typing", data);
    });

     socket.on("stopTyping", (data) => {
      console.log("server is listening the stop typing event");
      socket.broadcast.to(data.roomId).emit("typing-stop", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}

startServer();
