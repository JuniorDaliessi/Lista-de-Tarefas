import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #4285f4;
    --primary-dark: #3367d6;
    --accent-color: #fbbc05;
    --success-color: #34a853;
    --error-color: #ea4335;
    --warning-color: #f39c12;
    --text-primary: #333;
    --text-secondary: #666;
    --background: #f9f9f9;
    --card-background: #ffffff;
    --border-color: #ddd;
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
    --radius-sm: 4px;
    --radius-md: 8px;
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: var(--background);
    color: var(--text-primary);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5em;
    font-weight: 600;
  }

  p {
    margin-bottom: 1em;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
  }

  /* Adicionar estilos para links */
  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--primary-dark);
  }
  
  /* Estilo para botões */
  button {
    border: none;
    background: none;
    cursor: pointer;
  }
  
  /* Estilo para inputs */
  input, textarea, select {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    transition: border-color var(--transition-fast);
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }
`;

export default GlobalStyles; 