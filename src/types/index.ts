export type Message = {
    id: string; // Unique identifier for the message
    author: string; // Author string for the message
    content: string; // The message content
    timestamp?: number; // Optional timestamp for when the message was sent
    isComplete?: boolean;
    // You can add more fields here as needed
  };
  