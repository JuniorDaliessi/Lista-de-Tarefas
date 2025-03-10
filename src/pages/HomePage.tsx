import React from 'react';
import styled from 'styled-components';
import { FaTasks, FaSearch } from 'react-icons/fa';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { useTodo } from '../contexts/TodoContext';

const HomeContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
  animation: fadeIn var(--transition-normal);
  
  @media (max-width: 920px) {
    width: 100%;
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const HomeHeader = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

const HomeTitle = styled.h1`
  color: var(--text-primary);
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: var(--accent-color);
    margin-right: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HomeSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
  
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all var(--transition-fast);
    
    &:focus {
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
      outline: none;
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    font-size: 1.1rem;
    pointer-events: none;
    transition: color var(--transition-fast);
  }
  
  input:focus + svg {
    color: var(--accent-color);
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    
    input {
      padding: 0.7rem 1rem 0.7rem 2.8rem;
      font-size: 0.95rem;
    }
    
    svg {
      font-size: 1rem;
      left: 0.9rem;
    }
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
`;

const StatItem = styled.div`
  background-color: var(--card-background);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
`;

const HomePage: React.FC = () => {
  const { searchQuery, setSearchQuery, todos } = useTodo();
  
  // Calcular estatísticas
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <HomeContainer>
      <HomeHeader>
        <HomeTitle>
          <FaTasks />
          Lista de Tarefas
        </HomeTitle>
        <HomeSubtitle>
          Gerencie suas tarefas de forma simples e eficiente. 
          Organize, priorize e acompanhe seu progresso.
        </HomeSubtitle>
      </HomeHeader>
      
      <SearchBar>
        <input 
          type="text" 
          placeholder="Buscar tarefas..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch />
      </SearchBar>
      
      <StatsBar>
        <StatItem>
          <StatLabel>Total de Tarefas</StatLabel>
          <StatValue>{totalTasks}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Pendentes</StatLabel>
          <StatValue>{pendingTasks}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Concluídas</StatLabel>
          <StatValue>{completedTasks}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Taxa de Conclusão</StatLabel>
          <StatValue>{completionRate}%</StatValue>
        </StatItem>
      </StatsBar>
      
      <main>
        <TodoForm />
        <TodoList />
      </main>
    </HomeContainer>
  );
};

export default HomePage; 