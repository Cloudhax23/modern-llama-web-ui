import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types';

export const useChat = (url: string, onMessageReceived: () => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
    
      setMessages((prevMessages) => {
        const existingMessageIndex = prevMessages.findIndex(m => m.id === newMessage.id && m.author === newMessage.author);
    
        if (existingMessageIndex !== -1) {
          // Append content to existing message and update its completeness
          const updatedMessages = [...prevMessages];
          updatedMessages[existingMessageIndex] = {
            ...updatedMessages[existingMessageIndex],
            content: updatedMessages[existingMessageIndex].content + newMessage.content,
            isComplete: newMessage.isComplete
          };
          return updatedMessages;
        } else {
          // Add new message
          return [...prevMessages, newMessage];
        }
      });
    
      // Use onMessageReceived for UI state updates
      if (newMessage.isComplete) {
        onMessageReceived();
      }
    };

    socket.onopen = () => {
      // Connection opened
    };

    socket.onerror = (error) => {
      // Handle any error that occurs
      console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
      // Connection closed
    };

    // Clean up the WebSocket connection when the component that uses the hook unmounts
    return () => {
      socket.close();
    };
  }, [url]);

  // Function to send a message
  const sendMessage = useCallback((message: Message) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      // Optimistically update the local messages state with the new message
      setMessages(prevMessages => [...prevMessages, message]);
    }
  }, [ws]);

  return { messages, sendMessage };
};
