import React, { ReactNode, createContext, useContext, useReducer } from 'react';
import { Chat } from '../types';

interface AppState {
    selectedChat: Chat | null;
    chats: Chat[];  // Add an array of chats
  }
  
type AppAction =
| { type: 'select-chat'; data: Chat }
| { type: 'create-chat'; data: Chat }
| { type: 'update-chat'; data: Chat };


const DEFAULT_APP_STATE: AppState = {
    selectedChat: null,
    chats: [], 
};

const AppReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
      case 'select-chat':
        return {
          ...state,
          selectedChat: action.data,
        };
      case 'create-chat':
        return {
          ...state,
          selectedChat: action.data,
          chats: [...state.chats, action.data],  // Add the new chat to the chats array
        };
      case 'update-chat':
        return {
            ...state,
            chats: state.chats.map(chat =>
            chat.id === action.data.id ? action.data : chat
            ),
        };
      default:
        throw new Error('Invalid action.');
    }
};

interface AppContextData {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextData | null>(null);

export const useAppContext = (): AppContextData => {
  const context = useContext(AppContext);
  if (context == null) throw new Error('App context has not been initialized.');
  return context;
};

interface AppContextProviderProps {
    children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, DEFAULT_APP_STATE);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export default AppContextProvider;