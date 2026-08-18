/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useWebSocketConnectionHook = (cb:(arg:unknown)=>void,event:any)=> {

  const socketRef = useRef<any>(null);

  function socketClient() {
    const socket = io({
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.on(event as unknown as string, (data) => {
        cb(data);
      });
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("connect_error", async (err) => {
      console.log(`connect_error due to ${err.message}`);
      // await fetch('/api/socket');
    });

    socketRef.current = socket;
  }

  useEffect(() => {
    socketClient();
    return ()=> {
      socketRef?.current?.disconnect();
    }
  },[]);

}

export default useWebSocketConnectionHook;
