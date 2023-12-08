export interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  completed?: boolean;
  tokens?: number;
}

export interface Chat {
  id: string;
  messages: Message[];
  name: string;
}

export const API_BACKEND_URL = process.env.REACT_APP_API_BACKED_URL || 'http://localhost:8000';
export const API_MODEL_SELECTION = process.env.REACT_APP_API_MODEL_SELECTION || '/models/default';
export const API_MAX_GEN_TOKENS: number  = Number(process.env.REACT_APP_API_MAX_GEN_TOKENS) || 2048;
export const API_MAX_TOKENS: number  = Number(process.env.REACT_APP_API_MAX_TOKENS) || 4096;
export const API_PROMPT = process.env.REACT_APP_API_PROMPT || '';
export const API_ANTI_PROMPT = process.env.REACT_APP_API_ANTI_PROMPT || '### Instruction:';
export const API_ASSISTANT_PROMPT = process.env.REACT_APP_API_ASSISTANT_PROMPT || '### Response:';