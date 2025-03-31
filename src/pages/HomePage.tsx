import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTasks } from 'react-icons/fa';
import TodoForm from '../components/TodoForm';
import { useTodo } from '../contexts/TodoContext';
import SearchAutocomplete from '../components/SearchAutocomplete';

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

const StyledSearchAutocomplete = styled(SearchAutocomplete)`
  max-width: 600px;
  margin: 0 auto 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
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
  const navigate = useNavigate();
  
  // Calcular estatísticas
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Extrair títulos únicos para o autocomplete
  const todoTitles = useMemo(() => {
    const titles = todos.map(todo => todo.title);
    return Array.from(new Set(titles)); // Usar Array.from em vez de spread operator
  }, [todos]);
  
  // Mapear títulos para IDs para facilitar a navegação
  const titleToIdMap = useMemo(() => {
    const map: Record<string, string> = {};
    todos.forEach(todo => {
      map[todo.title] = todo.id;
    });
    return map;
  }, [todos]);
  
  // Navegação para a página de detalhes quando uma sugestão for selecionada
  const handleSuggestionSelect = useCallback((title: string) => {
    const todoId = titleToIdMap[title];
    if (todoId) {
      navigate(`/tarefa/${todoId}`);
    }
  }, [navigate, titleToIdMap]);
  
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
      
      <StyledSearchAutocomplete
        placeholder="Buscar tarefas..."
        value={searchQuery}
        onChange={setSearchQuery}
        suggestions={todoTitles}
        onSuggestionSelect={handleSuggestionSelect}
      />
      
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
      </main>
    </HomeContainer>
  );
};

export default HomePage; 