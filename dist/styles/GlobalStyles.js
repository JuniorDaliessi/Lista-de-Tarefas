"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalStyles = void 0;
const styled_components_1 = require("styled-components");
exports.GlobalStyles = (0, styled_components_1.createGlobalStyle) `
  :root {
    /* Variáveis de tema escuro (padrão) */
    --background-primary: #121212;
    --background-secondary: #1e1e1e;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --accent-color: #4f86f7;
    --accent-light: #6e9cff;
    --accent-dark: #3a71e2;
    --border-color: rgba(255, 255, 255, 0.1);
    --card-background: #252525;
    --hover-background: rgba(255, 255, 255, 0.08);
    --active-background: rgba(255, 255, 255, 0.12);
    --success-color: #4caf50;
    --warning-color: #ff9800;
    --error-color: #f44336;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  [data-theme='light'] {
    /* Variáveis de tema claro */
    --background-primary: #f8f9fa;
    --background-secondary: #ffffff;
    --text-primary: #333333;
    --text-secondary: #6c757d;
    --accent-color: #4f86f7;
    --accent-light: #6e9cff;
    --accent-dark: #3a71e2;
    --border-color: rgba(0, 0, 0, 0.1);
    --card-background: #ffffff;
    --hover-background: rgba(0, 0, 0, 0.04);
    --active-background: rgba(0, 0, 0, 0.08);
    --success-color: #4caf50;
    --warning-color: #ff9800;
    --error-color: #f44336;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    
    @media (max-width: 768px) {
      font-size: 15px;
    }
    
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background-primary);
    color: var(--text-primary);
    transition: background-color var(--transition-normal), color var(--transition-normal);
    line-height: 1.6;
    overflow-x: hidden;
    width: 100%;
    position: relative;
    
    /* Prevenir scroll quando o sidebar estiver aberto no mobile */
    &.sidebar-open {
      @media (max-width: 768px) {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
      }
    }
  }

  a {
    color: var(--accent-color);
    text-decoration: none;
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--accent-light);
    }
  }

  button {
    cursor: pointer;
    border: none;
    background-color: var(--accent-color);
    color: white;
    padding: 0.6rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    font-weight: 500;
    transition: background-color var(--transition-fast), transform var(--transition-fast);
    font-family: var(--font-family);
    
    &:hover {
      background-color: var(--accent-light);
    }
    
    &:active {
      transform: translateY(1px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input, textarea, select {
    background-color: var(--background-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.6rem 0.8rem;
    font-size: 1rem;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    font-family: var(--font-family);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(79, 134, 247, 0.25);
    }
    
    &::placeholder {
      color: var(--text-secondary);
      opacity: 0.7;
    }
  }

  /* Estilos para scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: var(--radius-sm);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--accent-light);
  }
  
  /* Estilos para seleção de texto */
  ::selection {
    background-color: var(--accent-color);
    color: white;
  }
  
  /* Animações globais */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  /* Estilos para o modo offline */
  body.offline-mode {
    position: relative;
  }
  
  body.offline-mode::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: var(--warning-color);
    z-index: 10000;
  }
  
  #offline-message {
    animation: slideUp 0.3s ease;
  }
  
  /* Animações adicionais para feedbacks táteis e visuais */
  @keyframes success-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    }
  }
  
  @keyframes pending-pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
  
  .item-success {
    animation: success-pulse 1.5s ease-in-out;
  }
  
  .item-pending {
    animation: pending-pulse 1.5s infinite ease-in-out;
  }
  
  /* Melhorias de contraste para acessibilidade */
  @media (prefers-contrast: high) {
    :root {
      --text-primary: #000000;
      --text-secondary: #333333;
      --border-color: rgba(0, 0, 0, 0.3);
      --accent-color: #0056b3;
      --accent-light: #0066cc;
      --accent-dark: #004494;
    }
    
    [data-theme='dark'] {
      --text-primary: #ffffff;
      --text-secondary: #cccccc;
      --border-color: rgba(255, 255, 255, 0.5);
      --accent-color: #4d94ff;
      --accent-light: #66a3ff;
      --accent-dark: #3385ff;
    }
  }
  
  /* Melhorias para navegação por teclado */
  :focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
  
  :focus:not(:focus-visible) {
    outline: none;
  }
  
  :focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;
