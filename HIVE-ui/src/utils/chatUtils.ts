import { v4 as uuidv4 } from 'uuid';
import { Chat, Message } from '../types';

export const handleStream = async (reader: ReadableStreamDefaultReader, chatId: string, handleReceive: (message: Message, chatId: string, isFinalChunk: boolean) => void) => {
    let receivedText = '';
  
    let responseMessage = {
      id: uuidv4(),
      content: '',
      author: 'Assistant',
      timestamp: Date.now(),
      completed: false,
      tokens: 0
    };
    
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        responseMessage = { ...responseMessage, content: receivedText, completed: true };
        handleReceive(responseMessage, chatId, true);
        break;
      }
  
      const chunkStr = new TextDecoder().decode(value).trim();
      const messages = chunkStr.split('\n').filter(msg => msg.trim());
  
      for (const msg of messages) {
        if (msg.startsWith('data: ')) {
          try {
            const dataStr = msg.substring(5).trim();
            const dataObj = JSON.parse(dataStr);
  
            if (dataObj.object === 'chat.completion.chunk' && dataObj.choices && dataObj.choices.length > 0) {
              const choice = dataObj.choices[0];
              if (choice.delta && choice.delta.content) {
                receivedText += choice.delta.content;
                responseMessage = { ...responseMessage, content: receivedText };
              }
            }
  
            if (dataObj.finish_reason) {
              responseMessage = { ...responseMessage, completed: true };
              handleReceive(responseMessage, chatId, true);
              return;
            }
          } catch (error) {
            console.error('Error parsing JSON:', msg, error);
          }
        }
      }
  
      handleReceive(responseMessage, chatId, false);
    }
  };
  
  export const formatPrompt = (content: string, selectedChat: Chat | null, API_MAX_TOKENS: number, API_MAX_GEN_TOKENS: number, API_PROMPT: string) => {
    const messagesToInclude = [];
  
    let currentTokenCount = Math.ceil(content.length / 4);
  
    if (selectedChat?.messages) {
      for (let i = selectedChat.messages.length - 1; i >= 0; i--) {
        const message = selectedChat.messages[i];
        const newTokenCount = currentTokenCount + (message.tokens || 0);
  
        if (newTokenCount > API_MAX_TOKENS - API_MAX_GEN_TOKENS) break;
  
        currentTokenCount = newTokenCount;
        messagesToInclude.push({
          role: message.author === 'You' ? 'user' : 'assistant',
          content: message.content
        });
      }
    }
  
    messagesToInclude.reverse();
  
    messagesToInclude.push({
      role: 'user',
      content: content
    });
  
    messagesToInclude.unshift({
      role: 'system',
      content: API_PROMPT
    });
  
    return { messages: messagesToInclude };
  };
  