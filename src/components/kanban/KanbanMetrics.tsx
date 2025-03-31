import React from 'react';
import styled from 'styled-components';
import { FaChartBar, FaInfoCircle } from 'react-icons/fa';
import { Project } from '../../types/Project';
import { Todo } from '../../types/Todo';

const MetricsContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MetricsTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #3498db;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MetricTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #3498db;
    font-size: 0.9rem;
  }
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
`;

const MetricDescription = styled.div`
  font-size: 0.85rem;
  color: #777;
  margin-top: 0.5rem;
`;

const MetricTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  font-weight: 500;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  color: #555;
  font-size: 0.9rem;
`;

const TableCell = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
`;

// Helper function to format time (ms) to readable format
const formatTime = (ms: number | null): string => {
  if (ms === null) return 'N/A';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

interface KanbanMetricsProps {
  project: Project;
  todos: Todo[];
  getLeadTime: (todoId: string) => number | null;
  getCycleTime: (todoId: string) => number | null;
}

const KanbanMetrics: React.FC<KanbanMetricsProps> = ({
  project,
  todos,
  getLeadTime,
  getCycleTime
}) => {
  // Calculate average lead time (overall time from creation to completion)
  const leadTimes = todos.map(todo => getLeadTime(todo.id)).filter(Boolean) as number[];
  const avgLeadTime = leadTimes.length > 0
    ? leadTimes.reduce((sum, time) => sum + time, 0) / leadTimes.length
    : null;
  
  // Calculate average cycle time (active work time)
  const cycleTimes = todos.map(todo => getCycleTime(todo.id)).filter(Boolean) as number[];
  const avgCycleTime = cycleTimes.length > 0
    ? cycleTimes.reduce((sum, time) => sum + time, 0) / cycleTimes.length
    : null;
  
  // Count todos by column
  const todosByColumn = project.columns.reduce<Record<string, number>>((acc, column) => {
    acc[column.id] = todos.filter(todo => todo.columnId === column.id).length;
    return acc;
  }, {});
  
  // Count todos by priority
  const todosByPriority = {
    alta: todos.filter(todo => todo.priority === 'alta').length,
    média: todos.filter(todo => todo.priority === 'média').length,
    baixa: todos.filter(todo => todo.priority === 'baixa').length,
  };
  
  // Count completed todos
  const completedTodos = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;
  
  return (
    <MetricsContainer>
      <MetricsHeader>
        <MetricsTitle>
          <FaChartBar />
          Métricas do Projeto
        </MetricsTitle>
      </MetricsHeader>
      
      <MetricsGrid>
        <MetricCard>
          <MetricTitle>
            <FaInfoCircle />
            Lead Time Médio
          </MetricTitle>
          <MetricValue>{formatTime(avgLeadTime)}</MetricValue>
          <MetricDescription>
            Tempo médio desde a criação até a conclusão de uma tarefa.
          </MetricDescription>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>
            <FaInfoCircle />
            Cycle Time Médio
          </MetricTitle>
          <MetricValue>{formatTime(avgCycleTime)}</MetricValue>
          <MetricDescription>
            Tempo médio de trabalho ativo em uma tarefa.
          </MetricDescription>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>
            <FaInfoCircle />
            Taxa de Conclusão
          </MetricTitle>
          <MetricValue>{completionRate.toFixed(0)}%</MetricValue>
          <MetricDescription>
            Percentual de tarefas concluídas no projeto.
          </MetricDescription>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>
            <FaInfoCircle />
            Distribuição por Coluna
          </MetricTitle>
          <MetricTable>
            <thead>
              <tr>
                <TableHeader>Coluna</TableHeader>
                <TableHeader>Tarefas</TableHeader>
              </tr>
            </thead>
            <tbody>
              {project.columns
                .sort((a, b) => a.order - b.order)
                .map(column => (
                  <tr key={column.id}>
                    <TableCell>{column.title}</TableCell>
                    <TableCell>{todosByColumn[column.id] || 0}</TableCell>
                  </tr>
                ))
              }
            </tbody>
          </MetricTable>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>
            <FaInfoCircle />
            Distribuição por Prioridade
          </MetricTitle>
          <MetricTable>
            <thead>
              <tr>
                <TableHeader>Prioridade</TableHeader>
                <TableHeader>Tarefas</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>Alta</TableCell>
                <TableCell>{todosByPriority.alta}</TableCell>
              </tr>
              <tr>
                <TableCell>Média</TableCell>
                <TableCell>{todosByPriority.média}</TableCell>
              </tr>
              <tr>
                <TableCell>Baixa</TableCell>
                <TableCell>{todosByPriority.baixa}</TableCell>
              </tr>
            </tbody>
          </MetricTable>
        </MetricCard>
      </MetricsGrid>
    </MetricsContainer>
  );
};

export default KanbanMetrics;
export {}; 