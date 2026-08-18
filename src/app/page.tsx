"use client";

import Chat from "@/app/chat/page";
import useWebSocketConnectionHook from "@/server/socket.io-client";
export default function Home() {

    useWebSocketConnectionHook(() => {
     console.log("me conected");
   }, "MY_EVENT_NAME");
 
  return (
    <>
     <Chat/>
    </>
  );
}
