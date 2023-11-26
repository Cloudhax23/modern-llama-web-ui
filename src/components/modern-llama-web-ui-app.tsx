import React from 'react';
import ChatWindow from './chat/Window/Window';
import Box from '@mui/material/Box';

function ModernLLAMAWebUIApp() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ChatWindow />
    </Box>
  );
}

export default ModernLLAMAWebUIApp;
