import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  MessageSquare,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, clearSelectedChat } from "../redux/chatSelected";
import socket from "../utils/sockets";
import PingPulseLogo from "../utils/App-Logo";
import { useSwipeable } from "react-swipeable";

export default function ChatArea({ dividerX }) {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const mode = useSelector((state) => state.theme.mode);
  const chatSelected = useSelector((state) => state.chatSelected.selectedChat);
  const chatMessages = useSelector((state) => state.chatSelected.messages);
  const auth = useSelector((state) => state.auth.userInfo);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleBackbtn = () => {
    dispatch(clearSelectedChat());
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  const sendMessage = async () => {
    const receiverId = chatSelected?._id;
    const senderId = auth?._id;

    if (input.trim() || file) {
      try {
        const serverUrl = import.meta.env.VITE_API_URL;

        const formData = new FormData();
        formData.append("receiverId", receiverId);
        formData.append("content", input);
        if (file) formData.append("image", file);

        const res = await fetch(`${serverUrl}/api/message/send`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await res.json();

        socket.emit("chat message", data.message);
        dispatch(addMessage(data.message));
        setInput("");
        removeImage();
      } catch (err) {
        console.error("Send message failed", err);
      }
    }
  };

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      // Only trigger on small screens
      if (window.innerWidth < 640) {
        handleBackbtn();
      }
    },
    delta: 50, // Minimum swipe distance in pixels
  });

  return (
    <div {...handlers} className={`flex-1 h-full touch-pan-y`}>
      {chatSelected ? (
        <main
          className={`flex flex-col h-full sm:rounded-l-3xl shadow-sm overflow-hidden ${
            mode === "light"
              ? "bg-white text-neutral-900"
              : "bg-gray-900 text-gray-100"
          }`}
        >
          {/* Header */}
          <header
            className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between ${
              mode === "light" ? "border-neutral-200" : "border-gray-700"
            }`}
          >
            <div className="flex items-center gap-3 justify-center">
              <ArrowLeft className="cursor-pointer" onClick={handleBackbtn} />
              {chatSelected?.profilePic ? (
                <img
                  src={chatSelected?.profilePic}
                  alt="User avatar"
                  loading="lazy"
                  className="size-12 rounded-full border-2 border-gray-400 object-cover"
                />
              ) : (
                <UserRound className="border rounded-full size-12 border-2 border-gray-400 text-gray-500" />
              )}

              <h2 className="font-semibold text-lg sm:text-xl">
                {chatSelected?.username}
              </h2>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto space-y-4">
            {chatMessages && chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => {
                const isSender = msg?.senderId === auth?._id;
                return (
                  <div
                    ref={scrollRef}
                    key={index}
                    className={`chat ${isSender ? "chat-end" : "chat-start"}`}
                  >
                    <div className="chat-header">
                      {isSender ? "You" : chatSelected?.username}
                      <time className="text-xs opacity-50 ml-2">
                        {new Date(msg?.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>

                    <div
                      className={`chat-bubble ${
                        isSender
                          ? "bg-blue-600 text-white"
                          : mode === "light"
                          ? "bg-neutral-200 text-black"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {/* If image exists, show image */}
                      {msg?.imageUrl && (
                        <img
                          src={msg?.imageUrl || file}
                          alt="Sent Image"
                          className="max-w-xs max-h-34 rounded-md object-cover"
                        />
                      )}

                      {/* Show text content */}
                      {msg?.content}
                    </div>

                    <div className="chat-footer opacity-50">
                      {isSender ? "Sent" : ""}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
                No messages yet. Start the conversation!
              </div>
            )}
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="px-4 pb-3">
              <div className="relative w-fit max-w-xs rounded-xl overflow-hidden shadow-md border border-gray-300 dark:border-gray-600">
                <img
                  src={preview}
                  alt="Selected Preview"
                  className="object-cover w-30 h-auto rounded-xl"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-80 transition p-1 rounded-full"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div
            className={`h-16 px-4 sm:px-6 border-t flex items-center gap-2 ${
              mode === "light"
                ? "border-neutral-200 bg-white"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <div className="relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-3">
                <ImagePlus className="size-5 cursor-pointer text-gray-400" />
              </div>
            </div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // prevent newline if needed
                  sendMessage();
                }
              }}
              type="text"
              placeholder="Type your message..."
              className={`flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                mode === "light"
                  ? "border-neutral-300 focus:ring-blue-500"
                  : "border-gray-600 focus:ring-blue-400 bg-gray-700 text-gray-100"
              }`}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </main>
      ) : (
        <div
          className={`flex flex-col items-center justify-center h-full px-6 sm:px-10 text-center relative animate-fade-in ${
            mode === "light"
              ? "bg-gradient-to-b from-white via-blue-50 to-blue-100 border-neutral-200 text-gray-900"
              : "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 border-gray-700 text-gray-100"
          }`}
        >
          <div className="flex flex-col items-center gap-3 mb-4">
            <PingPulseLogo
              className={`h-13 ${
                mode === "light" ? "text-blue-600" : "text-blue-400"
              } animate-bounce-slow`}
            />
          </div>

          <h2
            className={`text-lg sm:text-xl font-semibold mb-2 ${
              mode === "light" ? "text-gray-700" : "text-gray-200"
            }`}
          >
            @ No Conversation Selected
          </h2>

          <p
            className={`text-sm sm:text-base max-w-md leading-relaxed ${
              mode === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Select a conversation from the sidebar or start a new one to begin
            chatting with your contacts.
          </p>

          <div
            className={`mt-6 text-xs sm:text-sm animate-pulse ${
              mode === "light" ? "text-blue-500" : "text-blue-400"
            }`}
          >
            Ready when you are 💬
          </div>
        </div>
      )}
    </div>
  );
}
