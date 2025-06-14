import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';

import ThemeReducer from './redux/theme'
import authReducer from './redux/user'
import chatSelectedReducer from './redux/chatSelected'
import onlineUsersReducer from './redux/onlineUsers'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // only persist the auth and theme slice
};

const rootReducer = combineReducers({
  theme: ThemeReducer,
  auth: authReducer,
  chatSelected : chatSelectedReducer,
  onlineUsers: onlineUsersReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist to work properly
    }),
});

export const persistor = persistStore(store);
