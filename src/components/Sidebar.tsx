import React from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChatsList from './ChatsList';
import { Chat } from '../types';

interface SidebarProps {
  selectedChat: Chat | null;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onCreateNewChat: () => void;
  onDeleteChat: (chat: Chat) => void;
  onRenameChat: (chat: Chat, newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedChat, chats, onChatSelect, onCreateNewChat, onDeleteChat, onRenameChat }) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      width: '100%', 
      height: '100%', 
      boxSizing: 'border-box',
      bgcolor: theme.palette.divider
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2 // Margin bottom to separate from ChatsList
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo width="56" height="56" />
          <Typography sx={{ ml: 1, fontSize: '8px' }}>
            MLLAMA-UI
          </Typography>
        </Box>
        <IconButton className="new-chat-button" size="large" onClick={onCreateNewChat}>
          <EditNoteIcon />
        </IconButton>
      </Box>
      <Box sx={{ 
        flexGrow: 1, // Allows this box to grow and fill available space
        overflowY: 'auto' // Makes it scrollable
      }}>
        <ChatsList selectedChat={selectedChat} chats={chats} onChatSelect={onChatSelect} onDeleteChat={onDeleteChat} onRenameChat={onRenameChat} />
      </Box>
      <Box>
        <Button variant="text" startIcon={<SettingsIcon />}>
          Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
