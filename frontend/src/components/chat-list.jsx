import React, { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, setSelectedChat } from "../redux/chatSelected";

const ChatList = ({ dividerX }) => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const chatSelected = useSelector((state) => state.chatSelected.selectedChat);
  const onlineUsers = useSelector((state) => state.onlineUsers.users);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:3000/api/user/chats`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setUsers(data);
      } catch (err) {
        console.error("err: ", err);
        setError(err.message || "Something went wrong");
      }
    };

    fetchUsers();
  }, []);

  const handleChatSelected = (user) => {
    dispatch(setSelectedChat(user));
    dispatch(fetchMessages(user._id));
  };

  return (
    <aside
      className={`
    ${chatSelected ? "hidden" : "flex"}
    sm:flex flex-1 flex-col overflow-y-auto border-r
    ${
      mode === "light"
        ? "bg-gradient-to-b from-white via-blue-50 to-blue-100 border-neutral-200 text-gray-900"
        : "bg-gray-800 border-gray-700 text-gray-100"
    }
    ${chatSelected ? "hidden" : "w-full mx-0"}
  `}
    >
      <div className=" p-4 font-bold text-lg border-b border-gray-700">
        Chats
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center p-2 font-medium">
          {error}
        </div>
      )}

      <ul
        className="flex-1 divide-y divide-gray-200 overflow-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {users.map((user) => (
          <li
            key={user._id}
            className={`rounded-lg transition-all duration-300 px-4 py-3 cursor-pointer flex gap-4 items-center
              ${
                chatSelected && chatSelected._id === user._id
                  ? mode === "light"
                    ? "bg-blue-200 shadow-md"
                    : "bg-gray-700"
                  : mode === "light"
                  ? "hover:bg-blue-100"
                  : "hover:bg-gray-700"
              }`}
            onClick={() => handleChatSelected(user)}
          >
            <div className="relative">
              {user?.profilePic ? (
                <img
                  src={user?.profilePic}
                  alt="User avatar"
                  loading="lazy"
                  className="size-12 rounded-full border-2 border-gray-400 shadow object-cover transition-all duration-300"
                />
              ) : (
                <UserRound className="border rounded-full size-12 border-2 shadow border-gray-400 text-gray-500" />
              )}

              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white-900 dark:border-gray-800 rounded-full" />
              )}
            </div>

            <div>
              <p
                className={`font-semibold text-base ${
                  mode === "light" ? "text-black" : "text-white-500"
                }`}
              >
                {user.username}
              </p>

              {onlineUsers.includes(user._id) ? (
                <p className="text-xs text-green-500 font-medium">Online</p>
              ) : (
                <p className="text-xs text-gray-400 font-medium">Offline</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatList;
