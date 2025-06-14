import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedChat: null,
  messages: null
};

const chatSelectedSlice = createSlice({
  name: 'chatSelected',
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      if (state.messages) {
        state.messages.push(action.payload);
      } else {
        state.messages = [action.payload];
      }
    }

  },
});

export const { setSelectedChat, clearSelectedChat, setMessages, addMessage } = chatSelectedSlice.actions;
export default chatSelectedSlice.reducer;

export const fetchMessages = (receiverId) => async (dispatch) => {
  try {
    const serverUrl = import.meta.env.VITE_API_URL;

    const response = await fetch(`${serverUrl}/api/message`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverId })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch messages");
    }

    const data = await response.json();

    dispatch(setMessages(data.messages));
  } catch (error) {
    console.log("Error while fetching messages:", error.message);
  }
};
