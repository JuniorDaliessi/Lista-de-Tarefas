import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './contexts/TodoContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FiltersPage from './pages/FiltersPage';
import AllTodosPage from './pages/AllTodosPage';
import DashboardPage from './pages/DashboardPage';
import { GlobalStyles } from './styles/GlobalStyles';
import Tutorial from './components/Tutorial';

// Componente para capturar erros
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Erro capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2>Algo deu errado!</h2>
          <p>Detalhes do erro: {this.state.error?.message}</p>
          <p>Stack: {this.state.error?.stack}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 15px',
              backgroundColor: '#0275d8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Recarregar a página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <ThemeProvider>
        <ErrorBoundary>
          <TodoProvider>
            <GlobalStyles />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="filtros" element={<FiltersPage />} />
                  <Route path="todas-tarefas" element={<AllTodosPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
            
            {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
          </TodoProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
