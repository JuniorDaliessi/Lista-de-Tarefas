import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* Variáveis de tema escuro (padrão) */
    --background-primary: #111827;
    --background-secondary: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --accent-color: #3b82f6;
    --accent-light: #60a5fa;
    --accent-dark: #2563eb;
    --border-color: rgba(255, 255, 255, 0.1);
    --card-background: #1f2937;
    --hover-background: rgba(255, 255, 255, 0.08);
    --active-background: rgba(255, 255, 255, 0.12);
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 20px;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  [data-theme='light'] {
    /* Variáveis de tema claro */
    --background-primary: #f9fafb;
    --background-secondary: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --accent-color: #3b82f6;
    --accent-light: #60a5fa;
    --accent-dark: #2563eb;
    --border-color: rgba(0, 0, 0, 0.1);
    --card-background: #ffffff;
    --hover-background: rgba(0, 0, 0, 0.04);
    --active-background: rgba(0, 0, 0, 0.08);
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
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
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    font-weight: 500;
    transition: background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
    font-family: var(--font-family);
    
    &:hover {
      background-color: var(--accent-light);
      box-shadow: var(--shadow-sm);
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
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    font-family: var(--font-family);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
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
    border-radius: var(--radius-md);
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
    from { transform: translateY(15px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
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
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
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
      --accent-color: #0056b3;
      --accent-light: #0056b3;
      --accent-dark: #003b80;
      --border-color: #333333;
    }
    
    [data-theme='light'] {
      --text-primary: #000000;
      --text-secondary: #333333;
      --accent-color: #0056b3;
      --accent-light: #0056b3;
      --accent-dark: #003b80;
      --border-color: #333333;
    }
  }
  
  /* Suporte para reduções de movimento */
  @media (prefers-reduced-motion) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* Classes utilitárias para espaçamento e layout */
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 1rem; }
  .mt-4 { margin-top: 1.5rem; }
  .mt-5 { margin-top: 2rem; }
  
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
  .mb-5 { margin-bottom: 2rem; }
  
  .shadow { box-shadow: var(--shadow-sm); }
  .shadow-md { box-shadow: var(--shadow-md); }
  .shadow-lg { box-shadow: var(--shadow-lg); }
  
  .rounded { border-radius: var(--radius-sm); }
  .rounded-md { border-radius: var(--radius-md); }
  .rounded-lg { border-radius: var(--radius-lg); }
  
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-left { text-align: left; }
  
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .flex-col { flex-direction: column; }
  .flex-wrap { flex-wrap: wrap; }
  .flex-1 { flex: 1; }
  .gap-1 { gap: 0.25rem; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 1rem; }
  .gap-4 { gap: 1.5rem; }
`; 