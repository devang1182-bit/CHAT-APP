"use client";

import { useEffect, useState } from "react";
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

const Chat = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [typing, setTyping] = useState<boolean>(false);
  const [messageText, setMessageText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { users, currentUser } = useAppSelector((state) => state.users);
  console.log(currentUser, "Current User");
  const { messages } = useAppSelector((state) => state.messages);
  const targetUser = selectedUser?.id ?? null;

  const roomId =
    currentUser?.uid && targetUser
      ? [currentUser.uid, targetUser].sort().join("_")
      : null;

  const menuOpen = Boolean(anchorEl);

  const { sendMessage, sendTyping, stopTyping } = useChatSocket({
    currentUser,
    targetUser,
    roomId,
  });

  useEffect(() => {
    if (!roomId) return;
    const handleTyping = (data: { roomId: string; userid: string }) => {
      setTyping(true);
      console.log("someone is typing", data);
    };

    socket.on("typing", handleTyping);
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    const handleStopTyping = (data: { roomId: string; userid: string }) => {
      setTyping(false);
      console.log("someone has been stopped  typing", data);
    };

    socket.on("typing-stop", handleStopTyping);
  }, [roomId]);

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
  }, [roomId, dispatch]);

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

  //   const handleStopTyping = (value: string) => {
  //     stopTyping();
  // };

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
            {selectedUser?.displayName || "Chat App"}
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
            <h6>Users</h6>
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
            <Typography variant="h6">
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
                <Typography color="text.secondary">
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
                        <Typography>{msg.message}</Typography>
                      </Paper>
                    </Box>
                  </>
                );
              })
            )}
          </Box>
          <div>
            {typing ? (
              <p style={{ height: "20px", color: "gray" }}>Typing</p>
            ) : (
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
                onChange={(event) =>
                  handleMessageChange(event.target.value) ?? stopTyping()
                }
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
