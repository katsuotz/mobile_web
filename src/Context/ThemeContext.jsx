import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('system');
    const [resolvedTheme, setResolvedTheme] = useState('light');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const getSystemTheme = () => mediaQuery.matches ? 'dark' : 'light';

        const updateTheme = () => {
            const newTheme = theme === 'system' ? getSystemTheme() : theme;
            setResolvedTheme(newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        };

        updateTheme();

        if (theme === 'system') {
            mediaQuery.addEventListener('change', updateTheme);
            return () => mediaQuery.removeEventListener('change', updateTheme);
        }
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
