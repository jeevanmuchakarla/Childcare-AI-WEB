import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('theme-primary') || '#00A3FF');
  const [gradientTo, setGradientTo] = useState(localStorage.getItem('theme-gradient-to') || '#34C759');
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme-dark') === 'true');

  useEffect(() => {
    // Apply primary color
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--gradient-to', gradientTo);
    localStorage.setItem('theme-primary', primaryColor);
    localStorage.setItem('theme-gradient-to', gradientTo);
    
    // Convert hex to RGB for opacity utilities if needed
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
  }, [primaryColor, gradientTo]);

  useEffect(() => {
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme-dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor, gradientTo, setGradientTo, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
