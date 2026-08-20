/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import { useAppSelector } from "@/hooks/selector";
import { useAppDispatch } from "@/hooks/dispatch";

import { GetUsersAction } from "@/features/users/get-users/get-users.action";
import { User } from "@/features/users/user.type";
import { logout } from "@/features/users/user.slice";

import { clearMessages } from "@/features/messages/messages.slice";
import { Message } from "@/features/messages/messages.type";
import useChatSocket from "@/hooks/chat.events";
import { GetMessagesAction } from "@/features/messages/get-message/get-message.action";
import socket from "@/lib/socket";
import { DeleteMessageAction } from "@/features/messages/delete-message/delete-message.action";

const Chat = () => {
  let typingTimeout: string | number | NodeJS.Timeout | undefined;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [typing, setTyping] = useState<boolean>(false);
  const [messageText, setMessageText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [menuControl, setMenuControl] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { users, currentUser } = useAppSelector((state) => state.users);
  console.log(currentUser, "Current User");
  const { messages } = useAppSelector((state) => state.messages);
  console.log("Messages :", messages );
  const targetUser = selectedUser?.id ?? null;

  const handleContextMenu = (e: MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    setMenuControl({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    const closeMenu = () =>
      setMenuControl((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const roomId =
    currentUser?.uid && targetUser
      ? [currentUser.uid, targetUser].sort().join("_")
      : null;

  const menuOpen = Boolean(anchorEl);

  const { sendMessage, sendTyping } = useChatSocket({
    currentUser,
    targetUser,
    roomId,
  });

  const handleDelete = (msg : Message) => {
    console.log("message being deleted" , msg);
    dispatch(DeleteMessageAction(msg.id));
  };

  // const debouncedStopTyping = useDebounceCallback(() => {
  //   stopTyping();
  // }, 0);

  // const handleStopTyping = () => {
  //   debouncedStopTyping();
  // };

  useEffect(() => {
    if (!roomId) return;
    const handleTyping = (data: { roomId: string; userid: string }) => {
      if (!typing) {
        setTyping(true);
      }

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setTyping(false);
        // handleStopTyping();
      }, 1000);
      console.log("someone is typing", data);
    };

    socket.on("typing", handleTyping);
  }, [roomId]);

  // useEffect(() => {
  //   if (!roomId) return;
  //   const handleStopTyping = (data: { roomId: string; userid: string }) => {
  //     setTyping(false);
  //     console.log("someone has been stopped  typing", data);
  //   };

  //   socket.on("typing-stop", handleStopTyping);
  // }, [roomId]);

  useEffect(() => {
    dispatch(GetUsersAction());
  }, [dispatch]);

  const handleSelectUser = (user: User) => {
    dispatch(clearMessages());
    setSelectedUser(user);
    setMessageText("");
  };

  useEffect(() => {
    if (!roomId) return;
    dispatch(GetMessagesAction(roomId));
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    if (!selectedUser) return;
    sendMessage(messageText);
    setMessageText("");
  };

  const handleMessageChange = (value: string) => {
    setMessageText(value);
    if (value.trim()) {
      sendTyping();
      console.log(currentUser?.displayName, "is typing");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/sign-in");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);

    router.push("/profile");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">
            {currentUser?.displayName || "Chat App"}
          </Typography>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Typography>⋮</Typography>
          </IconButton>

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
              Logout
            </MenuItem>

            <MenuItem onClick={handleProfile}>Profile</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Paper
          square
          sx={{
            width: 280,
            borderRight: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <Box sx={{ p: 2 }}>
            <h3>Users</h3>
          </Box>

          <Divider />

          <List>
            {users
              .filter((user) => user.id !== currentUser?.uid)
              .map((user) => (
                <ListItemButton
                  key={user.id}
                  selected={selectedUser?.id === user.id}
                  onClick={() => handleSelectUser(user)}
                >
                  <ListItemText primary={user.displayName} />
                </ListItemButton>
              ))}
          </List>
        </Paper>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" color="primary">
              {selectedUser ? selectedUser.displayName : "Select a user"}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            {!selectedUser ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography color="primary">
                  Select a user to start chatting
                </Typography>
              </Box>
            ) : messages.length === 0 ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography color="text.secondary">No messages yet</Typography>
              </Box>
            ) : (
              messages.map((msg: Message) => {
                const isCurrentUser = msg.senderId === currentUser?.uid;
                
                return (
                  <>
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        justifyContent: isCurrentUser
                          ? "flex-end"
                          : "flex-start",
                        mb: 1,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          maxWidth: "60%",
                        }}
                      >
                        <Typography
                          onContextMenu={handleContextMenu}
                          className={`message-bubble ${isCurrentUser ? "sent" : "received"}`}
                        >
                          {msg.message}
                          {menuControl.visible && (
                            <button
                              style={{
                                color: "black",
                                position: "absolute",
                                top: `${menuControl.y}px`,
                                left: `${menuControl.x}px`,
                                backgroundColor: "white",
                                border: "1px solid #ccc",
                                listStyle: "none",
                                padding: "5px 0",
                                margin: 0,
                                zIndex: 1000,
                              }}
                              onClick={() => handleDelete(msg)}
                            >
                              Delete Msg
                            </button>
                          )}
                        </Typography>
                        <div className="msg-time">
                          {new Date(Number(msg.createdAt)).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </Paper>
                    </Box>
                  </>
                );
              })
            )}
          </Box>
          <div>
            {typing ? (
              <p style={{ color: "black" }}>Typing</p>
            ) : (
              // <div className="message-row other">
              //   <div className="typing-bubble">
              //     <span></span><span></span><span></span>
              //   </div>
              // </div>
              <></>
            )}
          </div>
          {selectedUser && (
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #ddd",
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={messageText}
                placeholder="Type a message..."
                onChange={(event) => handleMessageChange(event.target.value)}
                onKeyDown={handleKeyDown}
              />

              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
