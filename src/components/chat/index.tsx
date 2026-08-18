"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/selector";
import { useAppDispatch } from "@/hooks/dispatch";
import { GetUsersAction } from "@/features/users/get-users/get-users.action";
import { User } from "@/features/users/user.type";
import { logout } from "@/features/users/user.slice";
import {
  addMessage,
  clearMessages,
  setMessages,
} from "@/features/messages/messages.slice";
import { Message } from "@/features/messages/messages.type";
import SendIcon from "@mui/icons-material/Send";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

const Chat = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [messageText, setMessageText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { users, currentUser } = useAppSelector((state) => state.users);
  const { messages } = useAppSelector((state) => state.messages);
  const targetUser = selectedUser?.userid;
  const menuOpen = Boolean(anchorEl);

  const roomId =
    currentUser && targetUser
      ? [currentUser, targetUser].sort().join("_")
      : null;

  useEffect(() => {
    dispatch(GetUsersAction());
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const socket = io();
    if (!socket) return;
    socket.connect();
    socket.emit("onConnection", currentUser);

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!roomId) return;

    const socket = io();
    if (!socket) return;

    socket.on("newMessage", (msg: Message) => dispatch(addMessage(msg)));

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("getMessages");
      socket.off("newMessage");
    };
  }, [roomId, dispatch]);
  

  const handleSendMessage = () => {
    const socket = io();
    if (!messageText.trim() || !roomId) return;

    socket?.emit("sendMessage", {
      roomId,
      text: messageText,
      senderId: currentUser,
      receiverId: targetUser,
    });

    setMessageText("");
  };

  const handleLogout = () => {
    io()?.disconnect();
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      <div>
        <div>
          <div className="sidebar-header">Users</div>

          {/* <div>
            {users.map((user) => (
              <div key={user.userid} onClick={() => setSelectedUser(user)}>
                <strong>{user.username}</strong>
              </div>
            ))}
          </div> */}
        </div>

        <div>
          <AppBar position="static">
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Typography variant="h6">
                  {selectedUser?.username || "Chat App"}
                </Typography>
              </div>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                  Logout
                </MenuItem>
                <MenuItem onClick={() => router.push("/profile")}>
                  Profile
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <div className="chat-messages">
            {messages.map((msg: Message) => {
              return (
                <div key={msg.id}>
                  <div>{msg.message}</div>
                </div>
              );
            })}
          </div>

          {selectedUser && (
            <div>
              <input
                value={messageText}
                placeholder="Type a message"
                onChange={(e) => {
                  setMessageText(e.target.value);
                  io()?.emit("typing", { roomId, userid: currentUser });
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />

              <IconButton onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
