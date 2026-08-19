"use client";

import Chat from "@/app/chat/page";
import useChatSocket from "@/hooks/chat.events";

export default function Home() {
 
  return (
    <>
     <Chat/>
    </>
  );
}
