import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { v4 as uuidv4 } from 'uuid';
import { Box, Typography } from '@mui/material';
import HiveIcon from '@mui/icons-material/Hive';
import { Chat, Message } from '../types';
import Sidebar from './Sidebar';
import { API_BACKEND_URL } from '../types';

const Window: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
 
  const saveChatsToLocalStorage = (chats: Chat[]) => {
    const chatsJson = JSON.stringify(chats);
    localStorage.setItem('chats', chatsJson);
  };

  const handleReceive = (message: Message, chatId: string, isFinalChunk: boolean) => {
    setChats(prevChats => {
        // Locate the chat by chatId
        const chatIndex = prevChats.findIndex(chat => chat.id === chatId);
        const updatedChat = { ...prevChats[chatIndex] };

        if (!isFinalChunk) {
            // If the stream is not complete, update the ongoing message content
            const messageIndex = updatedChat.messages.findIndex(msg => msg.id === message.id);
            if (messageIndex !== -1) {
                updatedChat.messages[messageIndex] = message;
            } else {
                updatedChat.messages.push(message);
            }
        } else {
            // If the stream is complete, mark the message as completed
            const messageIndex = updatedChat.messages.findIndex(msg => msg.id === message.id);
            if (messageIndex !== -1) {
                updatedChat.messages[messageIndex] = { ...message, completed: true };
            }
            setIsSending(false);
        }

        // Update the chat in the chats array
        const newChats = prevChats.map((chat, index) => index === chatIndex ? updatedChat : chat);

        // Save chats to local storage after state update
        saveChatsToLocalStorage(newChats);

        return newChats;
    });
  };
 
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  const handleStream = async (reader: ReadableStreamDefaultReader, chatId: string) => {
    let receivedText = '';

    let responseMessage = {
        id: uuidv4(),
        content: '',
        author: 'Assistant',
        timestamp: Date.now(),
        completed: false
    };

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            responseMessage = { ...responseMessage, content: receivedText, completed: true };
            handleReceive(responseMessage, chatId, true);
            break;
        }

        let chunkStr = new TextDecoder().decode(value).trim();

        if (chunkStr.startsWith('data: ')) {
            chunkStr = chunkStr.substring(6).trim();
            
            try {
                const chunkObj = JSON.parse(chunkStr);
                if (chunkObj.content) {
                    receivedText += chunkObj.content;
                    responseMessage = { ...responseMessage, content: receivedText };
                }

                if (chunkObj.stop) {
                    responseMessage = { ...responseMessage, completed: true };
                    break;
                }
            } catch (error) {
                console.error('Error parsing JSON:', chunkStr, error);
            }
        }

        handleReceive(responseMessage, chatId, false);
    }
  };

  const formatPrompt = (content: string): string => {
    // Initialize an empty string for the formatted messages
    let formattedMessages = '';

    // Check if selectedChat and its messages are defined
    if (selectedChat?.messages) {
        // Format all messages in the chat for context
        formattedMessages = selectedChat.messages.map(message => {
            return message.author === 'You' 
                ? `### Instruction:\n${message.content}\n`
                : `### Response:\n${message.content}\n`;
        }).join('');
    }

    // Add the current content at the end
    // If formattedMessages is empty, it won't affect the final string
    return `${formattedMessages}### Instruction:\n${content}\n### Response:\n`;
  };

  const handleSendMessage = async (content: string) => {
    setIsSending(true);

    const chatId = selectedChat ? selectedChat.id : uuidv4();
    
    const chatMessage: Message  = {
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

    // Send the data to the server and handle the stream
    
    const response = await fetch('http://${API_BACKEND_URL}/completion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({prompt: formatPrompt(content), n_predict: -1, stream: true, stop: ["\n### Instruction:"]})
    });

    if (response.body) {
        const reader = response.body.getReader();
        handleStream(reader, chatId);
    } else {
        // Handle errors or cases where there's no response body
    }

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
        return { ...chat, name: newName.substring(0, 10) };
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
                <Box sx={{
                  display: 'flex', // Added to align children in a row
                  flexDirection: 'column', // Added to keep children in a column
                  alignItems: 'center', // Added to center children horizontally
                  justifyContent: 'center', // Added to center children vertically
                  width: '100%', // Ensure the Box takes full width
                  height: '100%' // Optional, for full height
                }}>
                  <HiveIcon fontSize="large" />
                  <Typography variant="h5" sx={{ textAlign: 'center', width: '100%' }}>How can I help you today?</Typography>
                </Box>
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
