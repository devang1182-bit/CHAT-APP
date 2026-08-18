"use client";

import Chat from "@/components/chat";
import useWebSocketConnectionHook from "@/components/socket.io-client";
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
