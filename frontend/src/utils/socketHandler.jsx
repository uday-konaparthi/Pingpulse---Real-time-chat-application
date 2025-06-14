import { useState } from "react";

const sendMessage = () => {
  const [input, setInput] = useState('')
  if (input.trim()) {
    socket.emit("chat message", input);
    setInput("");
  }
};

export default sendMessage;
