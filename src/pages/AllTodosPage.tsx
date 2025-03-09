import React from 'react';
import styled from 'styled-components';
import { useTodo } from '../contexts/TodoContext';
import TodoItem from '../components/TodoItem';
import { FaClipboardList } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.8rem;
    color: #3498db;
  }
`;

const PageSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div<{ color?: string }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.color || '#333'};
`;

const TodosSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 1.1rem;
`;

const AllTodosPage: React.FC = () => {
  const { todos } = useTodo();
  
  // Estatísticas
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  
  // Tarefas por prioridade
  const highPriorityTodos = todos.filter(todo => todo.priority === 'alta');
  const mediumPriorityTodos = todos.filter(todo => todo.priority === 'média');
  const lowPriorityTodos = todos.filter(todo => todo.priority === 'baixa');

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FaClipboardList />
          Todas as Tarefas
        </PageTitle>
        <PageSubtitle>Visualização completa de todas as suas tarefas</PageSubtitle>
      </PageHeader>
      
      <StatsContainer>
        <StatCard>
          <StatTitle>Total de Tarefas</StatTitle>
          <StatValue>{totalTodos}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Tarefas Concluídas</StatTitle>
          <StatValue color="#43a047">{completedTodos}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Tarefas Pendentes</StatTitle>
          <StatValue color="#f57c00">{pendingTodos}</StatValue>
        </StatCard>
      </StatsContainer>
      
      <TodosSection>
        <SectionTitle>Prioridade Alta</SectionTitle>
        {highPriorityTodos.length > 0 ? (
          highPriorityTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <EmptyMessage>Nenhuma tarefa com prioridade alta</EmptyMessage>
        )}
      </TodosSection>
      
      <TodosSection>
        <SectionTitle>Prioridade Média</SectionTitle>
        {mediumPriorityTodos.length > 0 ? (
          mediumPriorityTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <EmptyMessage>Nenhuma tarefa com prioridade média</EmptyMessage>
        )}
      </TodosSection>
      
      <TodosSection>
        <SectionTitle>Prioridade Baixa</SectionTitle>
        {lowPriorityTodos.length > 0 ? (
          lowPriorityTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <EmptyMessage>Nenhuma tarefa com prioridade baixa</EmptyMessage>
        )}
      </TodosSection>
    </PageContainer>
  );
};

export default AllTodosPage; 