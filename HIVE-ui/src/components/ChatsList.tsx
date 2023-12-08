import React, { useState } from 'react';
import { Chat } from '../types';
import { IconButton, Menu, MenuItem, ListItemText, Dialog, DialogContent, TextField, DialogActions, Button, DialogTitle } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTheme } from '@mui/material/styles';

interface ChatsListProps {
  selectedChat: Chat | null;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onDeleteChat: (chat: Chat) => void;
  onRenameChat: (chat: Chat, newName: string) => void; 
}

const ChatsList: React.FC<ChatsListProps> = ({ selectedChat, chats, onChatSelect, onDeleteChat, onRenameChat }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const theme = useTheme();

  const chatItemStyle = (chatId: string) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '10px',
    backgroundColor: selectedChat?.id === chatId
      ? theme.palette.action.hover // Background color for selected chat
      : hoveredChatId === chatId
      ? theme.palette.action.hover // Background color for hovered chat
      : 'transparent', // Default background color
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, chat: Chat) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (selectedChat) {
      onDeleteChat(selectedChat);
    }
    handleClose();
  };

  const handleRenameClick = () => {
    setNewName(selectedChat?.name || ''); // Set current name as default
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const submitRename = () => {
    if (selectedChat) {
      onRenameChat(selectedChat, newName);
    }
    handleDialogClose();
  };

  return (
  <div className="chats-list">
    {chats.map(chat => (
        <div
        key={chat.id}
        style={chatItemStyle(chat.id)}
        onClick={() => onChatSelect(chat)}
        onMouseEnter={() => setHoveredChatId(chat.id)}
        onMouseLeave={() => setHoveredChatId(null)}
      >
        <div>{chat.name}</div>
        {selectedChat?.id === chat.id && (
          <IconButton size="small" onClick={(e) => handleClick(e, chat)}>
            <MoreHorizIcon />
          </IconButton>
        )}
      </div>
    ))}
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleRenameClick}>
        <ListItemText primary="Rename" />
      </MenuItem>
      <MenuItem onClick={handleDelete}>
        <ListItemText style={{ color: theme.palette.error.main }} primary="Delete" />
      </MenuItem>
    </Menu>
    <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Rename Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            type="text"
            fullWidth
            value={newName}
            onChange={handleNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ color: theme.palette.text.primary }} onClick={handleDialogClose}>Cancel</Button>
          <Button style={{ color: theme.palette.text.primary }} onClick={submitRename}>Rename</Button>
        </DialogActions>
      </Dialog>
  </div>
  );
};

export default ChatsList;
