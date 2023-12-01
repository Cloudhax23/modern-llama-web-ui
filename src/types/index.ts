export type Message = {
    id: string; // Unique identifier for the message
    chatId: string;
    author: string; // Author string for the message
    content: string; // The message content
    timestamp?: number; // Optional timestamp for when the message was sent
    isComplete?: boolean;
    // You can add more fields here as needed
};

export type Chat = {
  id: string; // Unique identifier for the chat
  name: string;
  messages: Message[];
};
