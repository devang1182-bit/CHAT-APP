import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // 1. Create the base HTTP server
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // 2. Attach Socket.IO to the HTTP server
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Adjust this in production for security
    },
  });

  // 3. Listen for client connections
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // 4. Start listening on your port
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
