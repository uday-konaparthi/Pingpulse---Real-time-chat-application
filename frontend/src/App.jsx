import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Homepage from "./pages/protected/homepage";
import { loginSuccess } from "./redux/user";
import socket from "./utils/sockets";
import { addMessage } from "./redux/chatSelected";
import ProfilePage from "./pages/protected/profilepage";
import { setOnlineUsers } from "./redux/onlineUsers";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.theme.darkMode);
  const authToken = useSelector((state) => state.auth.token);
  const auth = useSelector((state) => state.auth.userInfo);
  const chatSelected = useSelector((state) => state.chatSelected.selectedChat);

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAutoLogin = async () => {
    try {
      const serverUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${serverUrl}/api/auth/autologin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      dispatch(loginSuccess(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (authToken) {
      handleAutoLogin();
      if (auth?._id) {
        socket.emit("register-user", auth._id);
      }
    } else {
      navigate("/user/login");
    }
  }, [authToken, auth]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket.io server:", socket.id);
    });

    socket.on("receive message", (data) => {
      const { senderId, receiverId } = data;
      const currentUser = auth?._id;
      const selectedUser = chatSelected._id;

      const isForCurrentChat =
        (senderId === selectedUser && receiverId === currentUser) ||
        (senderId === currentUser && receiverId === selectedUser);

      if (isForCurrentChat) {
        dispatch(addMessage(data));
      } else {
        console.log("Ignoring message not for current chat");
      }
    });

    return () => {
      socket.off("receive message");
    };
  }, [auth, chatSelected]);

  useEffect(() => {
    socket.on("getOnlineUsers", (userIds) => {
      dispatch(setOnlineUsers(userIds)); // store in redux
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/user/profile" element={<ProfilePage />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
