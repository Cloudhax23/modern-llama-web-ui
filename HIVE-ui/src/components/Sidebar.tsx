import React, { useState } from 'react';
import HiveIcon from '@mui/icons-material/Hive';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, Menu, MenuItem, Radio, RadioGroup, Typography } from '@mui/material';
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
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenSettings = () => {
    setOpenDialog(true);
  };

  const handleCloseSettings = () => {
    setOpenDialog(false);
  };

  const handleThemeChange = () => {
    //setTheme(event.target.value); // Function to change the theme
  };

  const handleDeleteAllChats = () => {
    // Logic to delete all chats
    handleCloseSettings();
  };

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
          <HiveIcon fontSize='large'/>
          <Typography sx={{ ml: 1, fontSize: '16px' }}>
            HIVE UI
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
        <Button
          variant="text"
          startIcon={<SettingsIcon />}
          style={{ color: theme.palette.text.primary }}
          onClick={handleOpenSettings}
        >
          Settings
        </Button>
        <Dialog open={openDialog} onClose={handleCloseSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup row name="theme" value={theme.palette.mode} onChange={handleThemeChange}>
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="text"
            endIcon={<DeleteIcon />}
            style={{ color: theme.palette.error.main }}
            onClick={handleDeleteAllChats}
          >
            Delete All Chats
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default Sidebar;
