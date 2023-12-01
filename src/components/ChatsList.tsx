import React from 'react';
import { Chat } from '../types';
import { IconButton, Menu, MenuItem, ListItemText } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [hoveredChatId, setHoveredChatId] = React.useState<string | null>(null);
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

  const handleRename = () => {
    if (selectedChat) {
      //onRenameChat(selectedChat);
    }
    handleClose();
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
    <MenuItem onClick={handleDelete}>
      <ListItemText primary="Delete" />
    </MenuItem>
    <MenuItem onClick={handleRename}>
      <ListItemText primary="Rename" />
    </MenuItem>
  </Menu>
</div>
  );
};

export default ChatsList;
