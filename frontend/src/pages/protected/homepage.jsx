import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/navbar";
import ChatList from "../../components/chat-list";
import ChatArea from "../../components/chat-area";

export default function HomePage() {
  const chatSelected = useSelector((state) => state.chatSelected.selectedChat);

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />

      <div
        className="flex-1 flex overflow-hidden"
      >
        {/* ChatList */}
        <div
          className={`${
            chatSelected ? "hidden" : "flex"
          } sm:flex flex-col w-full sm:w-[320px]`}
        >
          <ChatList />
        </div>

        {/* ChatArea */}
        <div
          className={`${
            chatSelected ? "flex" : "hidden"
          } sm:flex flex-col flex-1 `}
        >
          <ChatArea />
        </div>

      </div>
    </div>
  );
}
