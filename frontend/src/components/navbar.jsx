import React from "react";
import { Sun, Moon, UserCircle2, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../redux/user";
import { toggleTheme } from "../redux/theme";
import { clearSelectedChat } from "../redux/chatSelected";
import socket from "../utils/sockets"

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.auth.userInfo);

  const handleLogout = async () => {
    try {
      const serverUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${serverUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // ensures cookies like 'token' are sent
      });

      dispatch(logout());
      dispatch(clearSelectedChat());
      navigate("/user/login");
      socket.disconnect();
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav
      className={`h-16 w-full px-4 sm:px-8 shadow-md flex items-center justify-between border-b
        ${
          mode === "light"
            ? "bg-white border-neutral-200 text-neutral-900"
            : "bg-gray-900 border-gray-700 text-white"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold tracking-tight text-blue-500 cursor-default">
          PingPulse
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle Dark/Light Mode"
          className={`
            p-2 rounded-full shadow-md transition-all duration-300 
            ring-1 ring-inset 
            flex items-center justify-center 
            hover:scale-110 hover:ring-2
            ${
              mode === "light"
                ? "bg-white ring-gray-200 hover:bg-gray-100 text-gray-800"
                : "bg-gray-800 ring-gray-600 hover:bg-gray-700 text-yellow-400"
            }
          `}
        >
          {mode === "light" ? (
            <Moon className="h-5 w-5 text-gray-800 transition-colors duration-300" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400 transition-colors duration-300" />
          )}
        </button>

        <button
          onClick={() => navigate("/user/profile")}
          className="
            flex items-center justify-center
            w-9 h-9 rounded-full
            bg-gradient-to-tr from-blue-600 to-indigo-500
            text-white shadow-lg
            hover:scale-110 hover:shadow-xl
            transition-transform duration-300 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-indigo-300
          "
          aria-label="Profile"
        >
          <UserCircle2 className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            handleLogout();
          }}
          className="btn bg-red-500 font-bold shadow-md  hover:from-red-600 hover:via-red-700 hover:to-red-800
          active:scale-95 active:shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 
          focus:ring-red-300 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </nav>
  );
}
