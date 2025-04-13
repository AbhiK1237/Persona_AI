// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
    // Check if user has a saved preference, or use system preference as default
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // Check system preference
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Update theme in localStorage and apply to document when theme changes
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Toggle between light and dark theme
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};