import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

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
    navbar: string;
    navbarTextColor: string;
    button_bg_color : string;
    button_text_color : string;
    selectItem: string;
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
      navbar: theme === 'dark' ? '#eee' : '#DD9C0FFF',
      navbarTextColor: theme === 'dark' ? '#000000' : '#ffffff',
      button_bg_color: theme === 'dark' ? '#00695C' : '#00695C',
      button_text_color: theme === 'dark' ? '#ffffff' : '#ffffff',
      selectItem: theme === 'dark' ? '#00695C' : '#00695C',

    };
  };
  const [themeColor, setThemeColor] = useState<any>(getThemeColor());
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
