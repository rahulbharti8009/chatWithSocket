import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
  themeColor: {
    background: string;
    text: string;
    inputBackground: string;
    inputBorder: string;
    googleButtonBorder: string;
    googleButtonText: string;
  };
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {

  const defaultTheme = useColorScheme()
  const [theme, setTheme] = useState<string>(defaultTheme === 'dark' ? 'dark' : 'light');

  const getThemeColor = () => {
    return {
      background: theme === 'dark' ? '#121212' : '#FFFFFF',
      text: theme === 'dark' ? '#FFFFFF' : '#000000',
      inputBackground: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      inputBorder: theme === 'dark' ? '#444' : '#ccc',
      googleButtonBorder: theme === 'dark' ? '#555' : '#ccc',
      googleButtonText: theme === 'dark' ? '#eee' : '#444',
      // googleButtonText: theme === 'dark' ? '#eee' : '#444',
    };
  };
  const [themeColor, setThemeColor] = useState(getThemeColor());
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
