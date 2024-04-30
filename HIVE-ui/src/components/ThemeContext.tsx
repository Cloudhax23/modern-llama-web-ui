import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const ThemeContext = createContext({
  toggleTheme: () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  },
  prefersDarkMode: false,
});

export const useThemeContext = () => useContext(ThemeContext);
