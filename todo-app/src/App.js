import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTasks, FaPlus, FaList, FaChartBar } from 'react-icons/fa';
import TodoList from './components/TodoList';

// Estilos globais
const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    gap: 20px;
  }

  a {
    text-decoration: none;
    color: #333;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;

    &:hover {
      background-color: #f0f0f0;
    }

    &.active {
      background-color: #4285f4;
      color: white;
    }
  }
`;

const Button = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;

  &:hover {
    background-color: #3367d6;
  }
`;

// Páginas de exemplo
const HomePage = () => {
  return (
    <div>
      <h2>Minhas Tarefas</h2>
      <p>Bem-vindo ao Todo App. Gerencie suas tarefas de forma simples e eficiente.</p>
      <Button>
        <FaPlus /> Nova Tarefa
      </Button>
    </div>
  );
};

const DashboardPage = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Estatísticas e visualizações das suas tarefas</p>
  </div>
);

function App() {
  return (
    <Router>
      <AppContainer>
        <Header>
          <Title>
            <FaTasks /> Todo App
          </Title>
          <Nav>
            <ul>
              <li>
                <Link to="/">
                  <FaTasks /> Início
                </Link>
              </li>
              <li>
                <Link to="/tarefas">
                  <FaList /> Tarefas
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  <FaChartBar /> Dashboard
                </Link>
              </li>
            </ul>
          </Nav>
        </Header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tarefas" element={<TodoList />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
