"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/dispatch";
import { addMessage } from "@/features/messages/messages.slice";
import { Message } from "@/features/messages/messages.type";
import { CurrentUser } from "@/features/users/user.type";
import socket from "@/lib/socket";

type UseChatSocketProps = {
  currentUser: CurrentUser | null;
  targetUser: string | null;
  roomId: string | null;
};

const useChatSocket = ({
  currentUser,
  targetUser,
  roomId,
}: UseChatSocketProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!currentUser?.uid) return;

    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      socket.emit("onConnection", currentUser.uid);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    const handleConnectionError = (error: Error) => {
      console.error("Socket connection error:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectionError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectionError);

      socket.disconnect();
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!roomId || !currentUser?.uid) return;

    const joinRoom = () => {
      console.log("Joining room:", roomId);

      socket.emit("joinRoom", roomId);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);

      if (socket.connected) {
        console.log("Leaving room:", roomId);

        socket.emit("leaveRoom", roomId);
      }
    };
  }, [roomId, currentUser?.uid]);

  useEffect(() => {
    if (!roomId) return;

    const handleNewMessage = (message: Message) => {
      console.log("New message received:", message);

      dispatch(addMessage(message));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [roomId, dispatch]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    if (!roomId) return;

    if (!currentUser?.uid) return;

    if (!targetUser) return;

    socket.emit("sendMessage", {
      roomId,
      text: text.trim(),
      senderId: currentUser.uid,
      receiverId: targetUser,
    });
  };

  const sendTyping = () => {
    if (!roomId) return;

    if (!currentUser?.uid) return;

    socket.emit("typing", {
      roomId,
      userid: currentUser.uid,
    });
  };

  return {
    sendMessage,
    sendTyping,
  };
};

export default useChatSocket;
