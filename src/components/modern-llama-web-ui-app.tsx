import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import SidebarWindow from './Sidebar';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Chat } from '../types';
import AppContextProvider from './modern-llama-web-ui-app-context-provider';

function ModernLLAMAWebUIApp() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContextProvider>
        <Box sx={{ height: '100vh', display: 'flex' }}>
          <ChatWindow />
        </Box>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default ModernLLAMAWebUIApp;
