import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define tipos para os temas
export type ThemeType = 'light' | 'dark';

// Define a interface do contexto de tema
interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

// Cria o contexto com um valor padrão undefined
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Componente provider que irá encapsular a aplicação
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Busca o tema do localStorage ou usa 'dark' como padrão
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'dark';
  });

  // Salva o tema no localStorage sempre que for alterado
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Atualiza o atributo data-theme no elemento HTML raiz
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Função para alternar entre temas
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Valores do contexto
  const value = {
    theme,
    toggleTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook personalizado para usar o contexto de tema
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}; 