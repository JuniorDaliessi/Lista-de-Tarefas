import React from 'react';
import styled from 'styled-components';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const HomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HomeHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const HomeTitle = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const HomeSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <HomeHeader>
        <HomeTitle>Lista de Tarefas</HomeTitle>
        <HomeSubtitle>Gerencie suas tarefas de forma simples e eficiente</HomeSubtitle>
      </HomeHeader>
      
      <main>
        <TodoForm />
        <TodoList />
      </main>
    </HomeContainer>
  );
};

export default HomePage; 