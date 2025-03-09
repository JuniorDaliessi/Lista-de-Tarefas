import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './contexts/TodoContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FiltersPage from './pages/FiltersPage';
import AllTodosPage from './pages/AllTodosPage';

function App() {
  return (
    <TodoProvider>
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
  );
}

export default App;
