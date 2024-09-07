import React, { useState } from 'react';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { v4 as uuidv4 } from 'uuid';
import { Box, Typography, IconButton, Drawer } from '@mui/material';
import HiveIcon from '@mui/icons-material/Hive';
import MenuIcon from '@mui/icons-material/Menu';
import { Chat } from '../types';
import Sidebar from './Sidebar';
import { useChat } from '../hooks/useChat';

const Window: React.FC = () => {
  const { chats, setChats, selectedChat, isSending, setSelectedChat, handleSendMessage } = useChat();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const saveChatsToLocalStorage = (chats: Chat[]) => {
    const chatsJson = JSON.stringify(chats);
    localStorage.setItem('chats', chatsJson);
  };

  const handleCreateNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      name: 'New Chat',
      messages: []
    };

    setChats([...chats, newChat]);
    setSelectedChat(newChat);
  };

  const handleDeleteChat = (chatToDelete: Chat) => {
    const updatedChats = chats.filter(chat => chat.id !== chatToDelete.id);
    setChats(updatedChats);

    if (selectedChat && selectedChat.id === chatToDelete.id) {
      setSelectedChat(null);
    }

    saveChatsToLocalStorage(updatedChats);
  };

  const handleDeleteAllChats = () => {
    setChats([]);
    setSelectedChat(null);
  
    localStorage.removeItem('chats');
  };
  
  const handleRenameChat = (chatToRename: Chat, newName: string) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatToRename.id) {
        return { ...chat, name: newName.substring(0, 10) };
      }
      return chat;
    });

    setChats(updatedChats);

    if (selectedChat && selectedChat.id === chatToRename.id) {
      setSelectedChat({ ...selectedChat, name: newName });
    }

    saveChatsToLocalStorage(updatedChats);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' }
        }}
      >
        <Sidebar
          selectedChat={selectedChat}
          chats={chats}
          onChatSelect={setSelectedChat}
          onCreateNewChat={handleCreateNewChat}
          onDeleteChat={handleDeleteChat}
          onDeleteAllChats={handleDeleteAllChats}
          onRenameChat={handleRenameChat}
        />
      </Drawer>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '100%',
          alignItems: 'center',
          overflow: 'auto',
        }}
      >
        <IconButton 
          onClick={() => toggleDrawer(!drawerOpen)} 
          sx={{ 
            alignSelf: 'flex-start', 
            m: 2, 
            transition: 'margin-left 0.3s',
            marginLeft: drawerOpen ? '240px' : '12px'
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            width: '60%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: selectedChat ? 'flex-start' : 'center',
            alignItems: selectedChat ? 'flex-start' : 'center',
            overflow: 'auto',
          }}
        >
          {selectedChat ? (
            <MessageList messages={selectedChat.messages} isStreaming={isSending} />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <HiveIcon fontSize="large" />
              <Typography variant="h5" sx={{ textAlign: 'center', width: '100%' }}>
                How can I help you today?
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ width: '60%', marginBottom: 2 }}>
          <InputBar sendMessage={handleSendMessage} awaitingResponse={isSending} />
        </Box>
      </Box>
    </Box>
  );
};

export default Window;
