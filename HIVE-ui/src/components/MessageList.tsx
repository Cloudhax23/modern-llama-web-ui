import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const bottomOfList = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    bottomOfList.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <List sx={{ flexGrow: 1, overflowY: 'auto', width: '100%' }}>
      {messages.map((message) => (
        <ListItem key={message.id}>
          <Message message={message} />
        </ListItem>
      ))}
      <div ref={bottomOfList} />
    </List>
  );
};

export default MessageList;
