import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box, IconButton, InputAdornment } from '@mui/material';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import StopCircle from '@mui/icons-material/StopCircle'

interface InputBarProps {
  sendMessage: (message: string) => void;
  awaitingResponse: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ sendMessage, awaitingResponse }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!awaitingResponse && message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      width: '100%', // Take the full width of the parent container
    }}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Add the onKeyDown handler here
        placeholder="Type a message..."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSend}>
                {awaitingResponse ? <StopCircle /> : <ArrowUpward />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ 
          flex: 1,         
          '& fieldset': {
            paddingLeft: (theme) => theme.spacing(2.5),
            borderRadius: '20px',
          },
        }}
      />
    </Box>
  );
};

export default InputBar;
