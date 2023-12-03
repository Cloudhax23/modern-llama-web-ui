export interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  completed?: boolean;
}

export interface Chat {
  id: string;
  messages: Message[];
  name: string;
}

export const API_BACKED_URL = process.env.API_BACKED_URL || 'localhost:8000';