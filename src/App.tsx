import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './contexts/TodoContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FiltersPage from './pages/FiltersPage';
import AllTodosPage from './pages/AllTodosPage';
import { GlobalStyles } from './styles/GlobalStyles';
import Tutorial from './components/Tutorial';

function App() {
  const [showTutorial, setShowTutorial] = useState(false);
  
  useEffect(() => {
    // Verificar se é a primeira visita do usuário
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    
    if (!hasSeenTutorial) {
      // Aguardar um pouco antes de mostrar o tutorial para garantir que o app carregou completamente
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleCloseTutorial = () => {
    // Marcar o tutorial como visto
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };
  
  return (
    <ThemeProvider>
      <TodoProvider>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="filtros" element={<FiltersPage />} />
              <Route path="todas-tarefas" element={<AllTodosPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        
        {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
