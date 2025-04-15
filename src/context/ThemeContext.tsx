/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType  {
    theme: Theme;
    toggleTheme: () => void;
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const ThemeProvider : React.FC<{children: React.ReactNode}> = ({children}) => {
    const [theme, setTheme] = useState<Theme> ((localStorage.getItem("appTheme") as Theme )||"light");

    useEffect(()=> {
        document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
        localStorage.setItem("appTheme", theme)
    }, [ theme]);


    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));

    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )

}

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
  };
  
