import React, { useCallback, useEffect, useState } from 'react';
import MessageList from './MessageList';
import InputBar from './InputBar';
import socket from '../services/socket';
import { v4 as uuidv4 } from 'uuid';
import { Box, Typography } from '@mui/material';
import { Chat, Message } from '../types';
import Sidebar from './Sidebar';

const Window: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
 
  const saveChatsToLocalStorage = (chats: Chat[]) => {
    const chatsJson = JSON.stringify(chats);
    localStorage.setItem('chats', chatsJson);
  };
  
  const handleReceivedMessage = useCallback(
    (newMessage: Message) => {
      if (selectedChat && newMessage.chatId === selectedChat.id) {
        let updatedMessages = selectedChat.messages;
  
        const existingMessageIndex = updatedMessages.findIndex(m => m.id === newMessage.id && m.author === newMessage.author);
  
        if (existingMessageIndex !== -1) {
          // Update existing message by appending new content
          updatedMessages[existingMessageIndex] = {
            ...updatedMessages[existingMessageIndex],
            content: updatedMessages[existingMessageIndex].content + newMessage.content,
            isComplete: newMessage.isComplete
          };
        } else {
          // Add new message
          updatedMessages = [...updatedMessages, newMessage];
        }
        // Update the selected chat with the new messages
        const updatedChat = { ...selectedChat, messages: updatedMessages };
        setSelectedChat(updatedChat);
        setChats(chats => chats.map(chat => chat.id === updatedChat.id ? updatedChat : chat));
        saveChatsToLocalStorage(chats); 
      }
  
      if (newMessage.isComplete) {
        setIsSending(false);
      }
    },
    [selectedChat]
  );

  useEffect(() => {
    socket.on('receiveMessage', handleReceivedMessage);
    return () => {
      socket.off('receiveMessage', handleReceivedMessage);
    };
  }, [handleReceivedMessage]);
  
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);
  
  const handleSendMessage = (content: string) => {
    setIsSending(true);
  
    const chatId = selectedChat ? selectedChat.id : uuidv4();
    const chatMessage = {
      chatId: chatId,
      id: uuidv4(),
      author: "You",
      content,
      timestamp: Date.now()
    };

    if (!selectedChat) {
      const chatName = content.substring(0, 10);
      const newChat = {
        id: chatId,
        name: chatName,
        messages: [chatMessage],
      };

      setChats([...chats, newChat]);
      setSelectedChat(newChat);
    } else {
      const updatedMessages = [...selectedChat.messages, chatMessage];
      const updatedChat = { ...selectedChat, messages: updatedMessages };

      setSelectedChat(updatedChat);
      setChats(chats => chats.map(chat => chat.id === updatedChat.id ? updatedChat : chat));
    }
    socket.emit('sendMessage', chatMessage);

    saveChatsToLocalStorage(chats); 
  };

  const handleCreateNewChat = () => {
    // Create a new chat object
    const newChat: Chat = {
      id: uuidv4(), // Generate a unique ID for the chat
      name: 'New Chat', // Assign a default name or use a user input
      messages: [] // Start with an empty messages array
    };

    // Update the chats state
    setChats([...chats, newChat]);

    // Optionally, select the new chat
    setSelectedChat(newChat);
  };

  const handleDeleteChat = (chatToDelete: Chat) => {
    // Filter out the chat to be deleted
    const updatedChats = chats.filter(chat => chat.id !== chatToDelete.id);
    setChats(updatedChats);
  
    // If the deleted chat was selected, clear the selection
    if (selectedChat && selectedChat.id === chatToDelete.id) {
      setSelectedChat(null);
    }

    saveChatsToLocalStorage(updatedChats); 
  };
  
  const handleRenameChat = (chatToRename: Chat, newName: string) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatToRename.id) {
        // Return a new object with the updated name
        return { ...chat, name: newName };
      }
      return chat;
    });
  
    setChats(updatedChats);
  
    // Update the selected chat if it's the one being renamed
    if (selectedChat && selectedChat.id === chatToRename.id) {
      setSelectedChat({ ...selectedChat, name: newName });
    }

    saveChatsToLocalStorage(updatedChats); 
  };

  return (
        <Box sx={{ 
          display: 'flex', 
          height: '100%', 
          width: '100%'
        }}>
          <Box sx={{ 
            width: '10%', 
            flexShrink: 0,
            overflow: 'auto'
          }}>
            <Sidebar selectedChat={selectedChat} chats={chats} onChatSelect={setSelectedChat} onCreateNewChat={handleCreateNewChat} onDeleteChat={handleDeleteChat} onRenameChat={handleRenameChat}/>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flexGrow: 1,
            width: '80%',
            alignItems: 'center'
          }}>
            <Box sx={{
              width: '60%',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column', // Added to ensure proper alignment of children
              justifyContent: selectedChat ? 'flex-start' : 'center', // Conditionally apply based on selectedChat
              alignItems: selectedChat ? 'flex-start' : 'center', // Conditionally apply based on selectedChat
              overflow: 'auto'
            }}>
              {selectedChat ? (
                <MessageList messages={selectedChat.messages} />
              ) : (
                <Typography variant="h5" sx={{ textAlign: 'center', width: '100%' }}>How can I help you today?</Typography>
              )}
            </Box>
            <Box sx={{
              width: '60%',
              marginBottom: 2,
            }}>
              <InputBar sendMessage={handleSendMessage} awaitingResponse={isSending} />
            </Box>
          </Box>
        </Box>
  ); 
};

export default Window;
