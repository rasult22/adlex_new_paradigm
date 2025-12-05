import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";

type Theme = "light";

interface ThemeContextType {
    theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    useEffect(() => {
        const root = window.document.documentElement;

        // Ensure dark mode class is never applied
        root.classList.remove("dark-mode", "dark");

        // Clean up any stored theme preferences
        localStorage.removeItem("ui-theme");
    }, []);

    return <ThemeContext.Provider value={{ theme: "light" }}>{children}</ThemeContext.Provider>;
};
