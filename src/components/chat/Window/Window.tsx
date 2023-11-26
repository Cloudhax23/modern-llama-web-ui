// src/components/Chat/ChatWindow/ChatWindow.tsx

import React, { useState } from 'react';
import MessageList from '../MessageList/MessageList';
import InputBar from '../InputBar/InputBar';
import { useChat } from '../../../hooks/useChat';
import { v4 as uuidv4 } from 'uuid';
import { Box } from '@mui/material';

const Window: React.FC = () => {
  
  const [isSending, setIsSending] = useState(false); // New state for tracking message status

  const handleMessageReceived = () => {
    setIsSending(false); // Set isSending to false when a message is received
  };

  const { messages, sendMessage } = useChat('ws://localhost:8765', handleMessageReceived); // Replace with your actual WebSocket server URL
  
  const handleSendMessage = (content: string) => {
    setIsSending(true); // Disable button when message is sent
    sendMessage({ id: uuidv4(), author: "You", content, timestamp: Date.now() });
    // You should set isSending to false when you receive a response
  };

  return (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '50%',  // Assuming you want the chat window to take 80% of the width of its container
        height: '95%', // Adjust the height as needed
      }}>
      <MessageList messages={messages} />
      <InputBar sendMessage={handleSendMessage} awaitingResponse={isSending} />
    </Box>
  );
};

export default Window;