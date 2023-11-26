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
    if(!awaitingResponse) {
      sendMessage(message);
      setMessage('');
    } else {
      // Fill in
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
        sx={{ flex: 1 }}
      />
    </Box>
  );
};

export default InputBar;
