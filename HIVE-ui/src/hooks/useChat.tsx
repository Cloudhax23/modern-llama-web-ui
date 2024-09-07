import { useEffect, useState } from 'react';
import { API_MAX_GEN_TOKENS, API_MAX_TOKENS, API_PROMPT, Chat, Message } from '../types'; // Removed backend URL and model for simulation
import { v4 as uuidv4 } from 'uuid';
import { formatPrompt } from '../utils/chatUtils'; // Still using this utility for prompt formatting

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  const saveChatsToLocalStorage = (chats: Chat[]) => {
    const chatsJson = JSON.stringify(chats);
    localStorage.setItem('chats', chatsJson);
  };

  const handleReceive = (message: Message, chatId: string, isFinalChunk: boolean) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.id === chatId);
      const updatedChat = { ...prevChats[chatIndex] };

      if (!isFinalChunk) {
        const messageIndex = updatedChat.messages.findIndex(msg => msg.id === message.id);
        if (messageIndex !== -1) {
          updatedChat.messages[messageIndex] = message;
        } else {
          updatedChat.messages.push(message);
        }
      } else {
        const messageIndex = updatedChat.messages.findIndex(msg => msg.id === message.id);
        if (messageIndex !== -1) {
          updatedChat.messages[messageIndex] = { ...message, completed: true };
        }
        setIsSending(false);
      }

      const newChats = prevChats.map((chat, index) => index === chatIndex ? updatedChat : chat);
      saveChatsToLocalStorage(newChats);

      return newChats;
    });
  };

  const handleSendMessage = async (content: string) => {
    setIsSending(true);
  
    const chatId = selectedChat ? selectedChat.id : uuidv4();
  
    const chatMessage: Message = {
      id: uuidv4(),
      author: "You",
      content,
      timestamp: Date.now(),
      tokens: Math.ceil(content.length / 4),
      completed: true
    };
  
    if (!selectedChat) {
      const newChat: Chat = {
        id: chatId,
        name: content.substring(0, 10),
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
  
    // Skipping actual API call and simulating a response
    try {
      // Simulate delay like an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate a response message from AI
      const simulatedResponseMessage: Message = {
        id: uuidv4(),
        author: "AI Bot",
        content: `You said:\n\n\`\`\`tsx\n${content}\n\`\`\``, // Markdown with TSX code block
        timestamp: Date.now(),
        tokens: Math.ceil(content.length / 4),
        completed: true
      };

      // Update chat with simulated response
      setChats(prevChats => {
        const chatIndex = prevChats.findIndex(chat => chat.id === chatId);
        const updatedChat = { ...prevChats[chatIndex] };
        updatedChat.messages.push(simulatedResponseMessage);

        const newChats = prevChats.map((chat, index) => index === chatIndex ? updatedChat : chat);
        saveChatsToLocalStorage(newChats);

        return newChats;
      });

    } catch (error) {
      console.error("Error while sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return {
    chats,
    setChats,
    selectedChat,
    isSending,
    setSelectedChat,
    handleSendMessage,
    handleReceive,
    saveChatsToLocalStorage,
  };
};
