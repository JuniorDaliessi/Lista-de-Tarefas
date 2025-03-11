import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaExclamationTriangle, FaChartBar, FaTag, FaRegClock, FaThList } from 'react-icons/fa';
import { useTodo } from '../contexts/TodoContext';

const DashboardContainer = styled.div`
  padding: 2rem 0;
  animation: fadeIn var(--transition-normal);
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  svg {
    color: var(--accent-color);
    font-size: 1.8rem;
    margin-right: 1rem;
  }
`;

const DashboardTitle = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
  
  h3 {
    margin: 0 0 1.5rem;
    font-size: 1.2rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    
    svg {
      color: var(--accent-color);
      margin-right: 0.8rem;
    }
  }
`;

const StatNumber = styled.div<{ color?: string }>`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.color || 'var(--accent-color)'};
`;

const StatDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ChartSection = styled.div`
  margin-bottom: 2.5rem;
  
  h2 {
    margin: 0 0 1.5rem;
    font-size: 1.4rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    
    svg {
      color: var(--accent-color);
      margin-right: 0.8rem;
    }
  }
`;

const ChartContainer = styled.div`
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const BarChartContainer = styled.div`
  display: flex;
  height: 300px;
  align-items: flex-end;
  padding: 1rem 0;
  justify-content: space-around;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100px;
`;

const Bar = styled.div<{ height: number; color: string }>`
  width: 40px;
  height: ${props => props.height}%;
  background-color: ${props => props.color};
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease-in-out;
  position: relative;
  
  &:hover {
    opacity: 0.8;
  }
  
  &::before {
    content: '${props => props.height}%';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
`;

const BarLabel = styled.div`
  margin-top: 0.8rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PieChartContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PieChart = styled.div<{ percentageComplete: number }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    var(--success-color) 0% ${props => props.percentageComplete}%, 
    var(--error-color) ${props => props.percentageComplete}% 100%
  );
  position: relative;
  margin-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: var(--card-background);
  }
`;

const PieLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
  border-radius: 2px;
  margin-right: 0.5rem;
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.8rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-sm);
  
  span {
    margin-left: 0.5rem;
    color: var(--text-primary);
  }
  
  strong {
    margin-left: auto;
    background-color: var(--accent-color);
    color: white;
    font-size: 0.8rem;
    border-radius: 12px;
    padding: 0.2rem 0.6rem;
  }
`;

const DashboardPage: React.FC = () => {
  const { todos, getTodoStats } = useTodo();
  
  const stats = useMemo(() => getTodoStats(), [getTodoStats]);
  
  // Calcular percentuais para o gráfico
  const completionPercentage = useMemo(() => {
    return todos.length > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  }, [todos.length, stats.completed, stats.total]);
  
  // Preparar dados de categorias para o gráfico
  const categoryData = useMemo(() => {
    const categories = Object.entries(stats.byCategory)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    const total = categories.reduce((sum, cat) => sum + cat.count, 0);
    
    return categories.map(cat => ({
      ...cat,
      percentage: Math.round((cat.count / total) * 100)
    }));
  }, [stats.byCategory]);
  
  // Preparar dados de prioridades para o gráfico
  const priorityData = useMemo(() => {
    const priorities = {
      'alta': { color: 'var(--error-color)', count: stats.byPriority['alta'] || 0 },
      'média': { color: 'var(--warning-color)', count: stats.byPriority['média'] || 0 },
      'baixa': { color: 'var(--success-color)', count: stats.byPriority['baixa'] || 0 }
    };
    
    const total = Object.values(priorities).reduce((sum, p) => sum + p.count, 0);
    
    return Object.entries(priorities).map(([name, data]) => ({
      name,
      count: data.count,
      color: data.color,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0
    }));
  }, [stats.byPriority]);
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <FaChartBar />
        <DashboardTitle>Dashboard de Tarefas</DashboardTitle>
      </DashboardHeader>
      
      <StatsGrid>
        <StatCard>
          <h3><FaThList /> Total de Tarefas</h3>
          <StatNumber>{stats.total}</StatNumber>
          <StatDescription>
            {stats.total === 0 
              ? 'Você ainda não possui tarefas cadastradas.'
              : `Você possui ${stats.total} ${stats.total === 1 ? 'tarefa cadastrada' : 'tarefas cadastradas'}.`}
          </StatDescription>
        </StatCard>
        
        <StatCard>
          <h3><FaExclamationTriangle /> Tarefas Pendentes</h3>
          <StatNumber color="var(--warning-color)">{stats.pending}</StatNumber>
          <StatDescription>
            {stats.pending === 0 
              ? 'Você não possui tarefas pendentes!'
              : `Você tem ${stats.pending} ${stats.pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'} para concluir.`}
          </StatDescription>
        </StatCard>
        
        <StatCard>
          <h3><FaCheckCircle /> Tarefas Concluídas</h3>
          <StatNumber color="var(--success-color)">{stats.completed}</StatNumber>
          <StatDescription>
            {stats.completed === 0 
              ? 'Você ainda não concluiu nenhuma tarefa.'
              : `Você já concluiu ${stats.completed} ${stats.completed === 1 ? 'tarefa' : 'tarefas'}.`}
          </StatDescription>
        </StatCard>
      </StatsGrid>
      
      <ChartSection>
        <h2><FaRegClock /> Status das Tarefas</h2>
        <ChartContainer>
          <PieChartContainer>
            <div>
              <PieChart percentageComplete={completionPercentage} />
              <PieLegend>
                <LegendItem>
                  <LegendColor color="var(--success-color)" />
                  Concluídas ({completionPercentage}%)
                </LegendItem>
                <LegendItem>
                  <LegendColor color="var(--error-color)" />
                  Pendentes ({100 - completionPercentage}%)
                </LegendItem>
              </PieLegend>
            </div>
          </PieChartContainer>
        </ChartContainer>
      </ChartSection>
      
      <ChartSection>
        <h2><FaExclamationTriangle /> Distribuição por Prioridade</h2>
        <ChartContainer>
          <BarChartContainer>
            {priorityData.map(priority => (
              <BarGroup key={priority.name}>
                <Bar 
                  height={priority.percentage} 
                  color={priority.color}
                />
                <BarLabel>
                  {priority.name.charAt(0).toUpperCase() + priority.name.slice(1)}
                  <br />
                  ({priority.count})
                </BarLabel>
              </BarGroup>
            ))}
          </BarChartContainer>
        </ChartContainer>
      </ChartSection>
      
      <ChartSection>
        <h2><FaTag /> Tarefas por Categoria</h2>
        <ChartContainer>
          <CategoryList>
            {categoryData.length > 0 ? (
              categoryData.map(category => (
                <CategoryItem key={category.name}>
                  <FaTag color="var(--accent-color)" />
                  <span>{category.name || 'Sem categoria'}</span>
                  <strong>{category.count}</strong>
                </CategoryItem>
              ))
            ) : (
              <StatDescription>Nenhuma categoria encontrada.</StatDescription>
            )}
          </CategoryList>
        </ChartContainer>
      </ChartSection>
    </DashboardContainer>
  );
};

export default DashboardPage; 