import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChatWindow from './ChatWindow';
import { ThemeContext } from './ThemeContext';

function ModernLLAMAWebUIApp() {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [prefersDarkMode, setPrefersDarkMode] = useState(() => {
    const storedThemePreference = localStorage.getItem('themeMode');
    return storedThemePreference ? storedThemePreference === 'dark' : systemPrefersDark;
  });

  useEffect(() => {
    localStorage.setItem('themeMode', prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode]);

  const toggleTheme = () => {
    setPrefersDarkMode(!prefersDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, prefersDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex' }}>
          <ChatWindow />
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default ModernLLAMAWebUIApp;
