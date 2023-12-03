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

export const API_BACKEND_URL = process.env.REACT_APP_API_BACKED_URL || 'http://localhost:8000';
