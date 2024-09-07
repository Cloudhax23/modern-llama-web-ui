import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/system';

interface MessageListProps {
  messages: MessageType[];
}

const StyledList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '100%',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.default,
  }
}));

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const bottomOfList = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      bottomOfList.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);

    return () => clearInterval(interval);
  }, [messages]);
  
  return (
    <StyledList>
      {messages.map((message) => (
        <ListItem key={message.id}>
          <Message message={message} />
        </ListItem>
      ))}
      <div ref={bottomOfList} />
    </StyledList>
  );
};

export default MessageList;
