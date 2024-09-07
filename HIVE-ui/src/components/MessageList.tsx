import React, { useEffect, useRef, useState } from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/system';

interface MessageListProps {
  messages: MessageType[];
  isStreaming: boolean;
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

const MessageList: React.FC<MessageListProps> = ({ messages, isStreaming }) => {
  const bottomOfList = useRef<null | HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  useEffect(() => {
    if (isAutoScrollEnabled) {
      const timeout = setTimeout(() => {
        bottomOfList.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [messages, isStreaming, isAutoScrollEnabled]);

  useEffect(() => {
    if (isAutoScrollEnabled && isStreaming) {
      const interval = setInterval(() => {
        bottomOfList.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isStreaming, isAutoScrollEnabled]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isUserAtBottom = scrollHeight - scrollTop <= clientHeight + 10;

    if (!isUserAtBottom) {
      setIsAutoScrollEnabled(false);
    } else if (isStreaming) {
      setIsAutoScrollEnabled(true);
    }
  };

  return (
    <StyledList onScroll={handleScroll}>
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
