"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/dispatch";
import { addMessage } from "@/features/messages/messages.slice";
import { Message } from "@/features/messages/messages.type";
import socket from "@/lib/socket";
import { User } from "@/features/users/user.type";

type UseChatSocketProps = {
  currentUser: User | null;
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
    if (!currentUser) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("onConnection", currentUser);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");

      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);

    console.log("Joined room:", roomId);

    return () => {
      socket.emit("leaveRoom", roomId);

      console.log("Left room:", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const handleNewMessage = (message: Message) => {
      console.log("New message:", message);

      dispatch(addMessage(message));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [roomId, dispatch]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    if (!roomId || !currentUser || !targetUser) return;

    socket.emit("sendMessage", {
      roomId,
      text: text.trim(),
      senderId: currentUser,
      receiverId: targetUser,
    });
  };

  const sendTyping = () => {
    if (!roomId || !currentUser) return;

    socket.emit("typing", {
      roomId,
      userid: currentUser,
    });
  };

  return {
    sendMessage,
    sendTyping,
  };
};

export default useChatSocket;
