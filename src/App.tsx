import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './contexts/TodoContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FiltersPage from './pages/FiltersPage';
import AllTodosPage from './pages/AllTodosPage';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
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
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
