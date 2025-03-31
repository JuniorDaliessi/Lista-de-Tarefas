import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { 
  FaCheckCircle, FaExclamationTriangle, FaChartBar, FaTag, FaRegClock, 
  FaThList, FaProjectDiagram, FaCalendarAlt, FaSort, FaTasks,
  FaFilter, FaListUl, FaChartLine, FaChartPie, FaTable, FaLayerGroup,
  FaHourglassHalf, FaRocket, FaFireAlt, FaHistory, FaCodeBranch,
  FaCaretUp, FaCaretDown
} from 'react-icons/fa';
import { useTodo } from '../contexts/TodoContext';
import { useProject } from '../contexts/ProjectContext';
import { Todo, SubTask } from '../types/Todo';
import { Project } from '../types/Project';

// Estilos principais
const DashboardContainer = styled.div`
  padding: 2rem 1rem;
  animation: fadeIn var(--transition-normal);
  max-width: 1400px;
  margin: 0 auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DashboardTitle = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  
  svg {
    color: var(--accent-color);
    font-size: 1.8rem;
    margin-right: 1rem;
  }
`;

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
`;

// Grid de cards de estatísticas
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
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
    font-size: 1.1rem;
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
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.color || 'var(--accent-color)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatTrend = styled.span<{ positive?: boolean }>`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  color: ${props => props.positive ? 'var(--success-color)' : 'var(--error-color)'};
`;

const StatDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

// Layout de seções de gráficos
const GridSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.div`
  margin-bottom: 2rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h2 {
    margin: 0;
    font-size: 1.3rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    
    svg {
      color: var(--accent-color);
      margin-right: 0.8rem;
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    
    h2 {
      font-size: 1.1rem;
    }
  }
`;

const ChartContainer = styled.div`
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: none;
  background-color: ${props => props.active ? 'var(--accent-color)' : 'var(--background-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  cursor: pointer;
  font-size: 0.9rem;
`;

// Componentes de gráficos

// Gráfico de barras horizontais
const HorizontalBarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

const BarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const BarLabel = styled.div`
  flex: 0 0 150px;
  font-size: 0.9rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 25px;
  background-color: var(--background-secondary);
  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.color};
  position: relative;
  transition: width 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  
  &::after {
    content: '${props => Math.round(props.width)}%';
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
  }
`;

// Gráfico de pizza avançado
const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin: 1rem auto;
  max-width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;

const PieOuterContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  
  @media (max-width: 480px) {
    width: 180px;
    height: 180px;
  }
`;

const PieChart = styled.div<{ percentageComplete: number }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    var(--success-color) 0% ${props => props.percentageComplete}%, 
    var(--error-color) ${props => props.percentageComplete}% 100%
  );
  position: relative;
  
  &::after {
    content: '${props => props.percentageComplete}%';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background-color: var(--card-background);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-color);
  }
`;

const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-primary);
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
  border-radius: 2px;
  margin-right: 0.5rem;
`;

// Tabela de dados
const DataTable = styled.div`
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 0.8rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9rem;
  }
  
  th {
    background-color: var(--background-secondary);
    color: var(--text-primary);
    font-weight: 600;
    position: sticky;
    top: 0;
  }
  
  tr:hover td {
    background-color: var(--background-secondary);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

// Timeline/Gantt simplificado
const TimelineContainer = styled.div`
  margin-top: 1rem;
  overflow-x: auto;
`;

const TimelineItem = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  align-items: center;
  gap: 0.5rem;
`;

const TimelineLabel = styled.div`
  flex: 0 0 150px;
  font-size: 0.9rem;
  color: var(--text-primary);
`;

const TimelineBar = styled.div`
  flex: 1;
  height: 25px;
  background-color: var(--background-secondary);
  border-radius: 4px;
  position: relative;
`;

const TimelineProgress = styled.div<{ start: number; end: number; color: string }>`
  position: absolute;
  left: ${props => props.start}%;
  width: ${props => props.end - props.start}%;
  height: 100%;
  background-color: ${props => props.color};
  border-radius: 4px;
  transition: all 0.3s ease;
`;

// Heat Map (representação de intensidade)
const HeatMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const HeatMapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeatMapDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  max-width: 500px;
`;

const HeatMapLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const LegendScale = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(to right, rgba(var(--accent-color-rgb), 0.2), rgba(var(--accent-color-rgb), 1));
  height: 12px;
  width: 100px;
  border-radius: 6px;
  margin-right: 5px;
`;

const LegendText = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100px;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const WeekdayHeatMap = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 60px repeat(7, 1fr);
  }
  
  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const TimeLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  
  @media (max-width: 480px) {
    justify-content: flex-start;
    margin-bottom: 0.25rem;
    font-weight: 600;
  }
`;

const WeekdayLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 500;
  text-align: center;
  padding-bottom: 0.25rem;
  
  @media (max-width: 480px) {
    grid-column: 1 / -1;
    text-align: left;
    margin-bottom: 0.25rem;
    font-weight: 600;
  }
`;

const DayRow = styled.div`
  display: contents;
  
  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
  }
`;

const MobileTimeRow = styled.div`
  display: none;
  
  @media (max-width: 480px) {
    display: flex;
    margin-bottom: 0.25rem;
  }
`;

const HeatMapCell = styled.div<{ intensity: number }>`
  aspect-ratio: 1;
  border-radius: 4px;
  background-color: ${props => {
    const alpha = 0.1 + (props.intensity * 0.9);
    return `rgba(var(--accent-color-rgb), ${alpha})`;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.intensity > 0.6 ? 'white' : 'var(--text-primary)'};
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    aspect-ratio: auto;
    padding: 0.5rem;
    height: auto;
  }
`;

const EmptyCell = styled.div`
  aspect-ratio: 1;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

// Componente principal do Dashboard
const DashboardPage: React.FC = () => {
  // Estados para filtros e abas
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month'>('all');
  const [activeProjectTab, setActiveProjectTab] = useState<string | null>(null);
  const [selectedMetricTab, setSelectedMetricTab] = useState<'summary' | 'detailed'>('summary');
  const [selectedChartTab, setSelectedChartTab] = useState<'bar' | 'pie'>('bar');
  
  // Hooks de contexto
  const { todos, getTodoStats } = useTodo();
  const { projects, taskMetrics, getLeadTime, getCycleTime } = useProject();
  
  // Filtrar todos por período de tempo
  const filteredTodos = useMemo(() => {
    if (!todos || !Array.isArray(todos)) return [];
    
    if (dateRange === 'all') return todos;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (dateRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return todos.filter(todo => new Date(todo.createdAt) >= cutoffDate);
  }, [todos, dateRange]);
  
  // Estatísticas básicas das tarefas
  const stats = useMemo(() => {
    if (!getTodoStats || typeof getTodoStats !== 'function') {
      return { total: 0, completed: 0, pending: 0, byPriority: {}, byCategory: {} };
    }
    return getTodoStats();
  }, [getTodoStats]);
  
  // Total de subtarefas
  const subtaskStats = useMemo(() => {
    if (!todos || !Array.isArray(todos)) {
      return { total: 0, completed: 0, pending: 0, completionRate: 0 };
    }
    
    const allSubtasks = todos.flatMap(todo => todo.subtasks || []);
    const total = allSubtasks.length;
    const completed = allSubtasks.filter(subtask => subtask.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, completed, pending, completionRate };
  }, [todos]);
  
  // Estatísticas de projetos
  const projectStats = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      return { total: 0, active: 0, empty: 0, totalColumns: 0, tasksPerProject: 0 };
    }
    
    const total = projects.length;
    const active = projects.filter(p => p.todoIds && Array.isArray(p.todoIds) && p.todoIds.length > 0).length;
    const empty = total - active;
    
    // Total de colunas em todos os projetos
    const totalColumns = projects.reduce((sum, project) => {
      return sum + (project.columns && Array.isArray(project.columns) ? project.columns.length : 0);
    }, 0);
    
    // Média de tarefas por projeto
    const tasksPerProject = active > 0 
      ? projects.reduce((sum, project) => {
          return sum + (project.todoIds && Array.isArray(project.todoIds) ? project.todoIds.length : 0);
        }, 0) / active 
      : 0;
    
    return { total, active, empty, totalColumns, tasksPerProject };
  }, [projects]);
  
  // Calcular percentuais para o gráfico de tarefas
  const completionPercentage = useMemo(() => {
    if (!filteredTodos || !Array.isArray(filteredTodos) || filteredTodos.length === 0) {
      return 0;
    }
    
    const completedCount = filteredTodos.filter(t => t && t.completed).length;
    return Math.round((completedCount / filteredTodos.length) * 100);
  }, [filteredTodos]);
  
  // Preparar dados de categorias para o gráfico
  const categoryData = useMemo(() => {
    if (!filteredTodos || !Array.isArray(filteredTodos) || filteredTodos.length === 0) {
      return [];
    }
    
    const categoryCounts: Record<string, number> = {};
    
    filteredTodos.forEach(todo => {
      if (!todo) return;
      const category = todo.category || 'Sem categoria';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({ 
        name, 
        count,
        percentage: Math.round((count / filteredTodos.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTodos]);
  
  // Preparar dados de prioridades para o gráfico
  const priorityData = useMemo(() => {
    if (!filteredTodos || !Array.isArray(filteredTodos)) {
      return [
        { name: 'alta', count: 0, color: 'var(--error-color)', percentage: 0 },
        { name: 'média', count: 0, color: 'var(--warning-color)', percentage: 0 },
        { name: 'baixa', count: 0, color: 'var(--success-color)', percentage: 0 }
      ];
    }
    
    const priorities = {
      'alta': { color: 'var(--error-color)', count: 0 },
      'média': { color: 'var(--warning-color)', count: 0 },
      'baixa': { color: 'var(--success-color)', count: 0 }
    };
    
    filteredTodos.forEach(todo => {
      if (!todo) return;
      if (todo.priority in priorities) {
        priorities[todo.priority].count++;
      }
    });
    
    return Object.entries(priorities).map(([name, data]) => ({
      name,
      count: data.count,
      color: data.color,
      percentage: filteredTodos.length > 0 
        ? Math.round((data.count / filteredTodos.length) * 100) 
        : 0
    }));
  }, [filteredTodos]);
  
  // Dados para gráfico de conclusão mensal/semanal
  const completionTrendData = useMemo(() => {
    if (!todos || !Array.isArray(todos)) {
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
          label: d.toLocaleDateString('pt-BR', { month: 'short' }),
          total: 0,
          completed: 0,
          rate: 0
        };
      }).reverse();
    }
    
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        label: d.toLocaleDateString('pt-BR', { month: 'short' }),
        key: `${d.getFullYear()}-${d.getMonth()}`,
        date: d
      };
    }).reverse();
    
    const monthlyData = last6Months.map(month => {
      const startDate = new Date(month.date);
      startDate.setDate(1);
      
      const endDate = new Date(month.date);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      
      const monthTodos = todos.filter(todo => {
        if (!todo || !todo.createdAt) return false;
        const createdDate = new Date(todo.createdAt);
        return createdDate >= startDate && createdDate <= endDate;
      });
      
      const completed = monthTodos.filter(todo => todo && todo.completed).length;
      const total = monthTodos.length;
      
      return {
        label: month.label,
        total,
        completed,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });
    
    return monthlyData;
  }, [todos]);
  
  // Métricas de produtividade de projetos
  const projectMetrics = useMemo(() => {
    if (!projects || !Array.isArray(projects) || !todos || !Array.isArray(todos) || !getLeadTime) {
      return [];
    }
    
    // Usar filter para remover resultados nulos antes do map final
    return projects
      .map(project => {
        if (!project || !project.id) return null;
        
        const projectTodos = todos.filter(todo => todo && todo.projectId === project.id);
        const completed = projectTodos.filter(todo => todo && todo.completed).length;
        const total = projectTodos.length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Calcular lead time médio
        let totalLeadTime = 0;
        let todoCount = 0;
        
        projectTodos.forEach(todo => {
          if (!todo || !todo.id) return;
          const leadTime = getLeadTime(todo.id);
          if (leadTime) {
            totalLeadTime += leadTime;
            todoCount++;
          }
        });
        
        const avgLeadTimeMs = todoCount > 0 ? totalLeadTime / todoCount : 0;
        const avgLeadTimeDays = Math.round(avgLeadTimeMs / (1000 * 60 * 60 * 24) * 10) / 10;
        
        return {
          id: project.id,
          name: project.name || 'Sem nome',
          total,
          completed,
          completionRate,
          avgLeadTimeDays
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [projects, todos, getLeadTime]);
  
  // Dados para heat map de atividade por dia da semana
  const activityHeatMapData = useMemo(() => {
    if (!todos || !Array.isArray(todos)) {
      return [];
    }
    
    const dayMap = [
      'Domingo', 'Segunda', 'Terça', 'Quarta', 
      'Quinta', 'Sexta', 'Sábado'
    ];
    
    const hourMap = ['Manhã', 'Tarde', 'Noite', 'Madrugada', 'Desconhecido'];
    
    const activityMap: Record<string, number> = {};
    
    // Inicializar mapa
    dayMap.forEach(day => {
      hourMap.forEach(hour => {
        activityMap[`${day}-${hour}`] = 0;
      });
    });
    
    // Preencher dados
    todos.forEach(todo => {
      if (!todo || !todo.createdAt) return;
      
      try {
        const date = new Date(todo.createdAt);
        if (isNaN(date.getTime())) return; // Data inválida
        
        const day = dayMap[date.getDay()];
        
        let timeOfDay;
        const hours = date.getHours();
        
        if (hours >= 5 && hours < 12) timeOfDay = 'Manhã';
        else if (hours >= 12 && hours < 18) timeOfDay = 'Tarde';
        else if (hours >= 18 && hours < 22) timeOfDay = 'Noite';
        else timeOfDay = 'Madrugada';
        
        const key = `${day}-${timeOfDay}`;
        activityMap[key] = (activityMap[key] || 0) + 1;
      } catch (e) {
        console.error('Erro ao processar data de criação:', e);
      }
    });
    
    // Encontrar valor máximo para normalização
    const maxValue = Math.max(...Object.values(activityMap));
    
    // Preparar dados finais
    return Object.entries(activityMap).map(([key, value]) => ({
      key,
      label: key.split('-'),
      value,
      intensity: maxValue > 0 ? value / maxValue : 0
    }));
  }, [todos]);
  
  // Função para formatar tempo em ms para dias
  const formatTimespan = useCallback((ms: number | null): string => {
    if (!ms) return 'N/A';
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h`;
    }
  }, []);
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          <FaChartBar />
          Dashboard de Métricas
        </DashboardTitle>
        
        <FilterControls>
          <FilterSelect 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value as 'all' | 'week' | 'month')}
          >
            <option value="all">Todos os períodos</option>
            <option value="week">Últimos 7 dias</option>
            <option value="month">Último mês</option>
          </FilterSelect>
          
          <Tabs>
            <Tab 
              active={selectedMetricTab === 'summary'} 
              onClick={() => setSelectedMetricTab('summary')}
            >
              Resumo
            </Tab>
            <Tab 
              active={selectedMetricTab === 'detailed'} 
              onClick={() => setSelectedMetricTab('detailed')}
            >
              Detalhado
            </Tab>
          </Tabs>
        </FilterControls>
      </DashboardHeader>
      
      {/* Seção de Cards de Métricas */}
      <StatsGrid>
        <StatCard>
          <h3><FaThList /> Total de Tarefas</h3>
          <StatNumber>{stats.total}</StatNumber>
          <StatDescription>
            {stats.pending} pendentes e {stats.completed} concluídas
          </StatDescription>
        </StatCard>
        
        <StatCard>
          <h3><FaTasks /> Subtarefas</h3>
          <StatNumber>{subtaskStats.total}</StatNumber>
          <StatDescription>
            {subtaskStats.completed} concluídas ({Math.round(subtaskStats.completionRate)}%)
          </StatDescription>
        </StatCard>
        
        <StatCard>
          <h3><FaProjectDiagram /> Projetos</h3>
          <StatNumber>{projectStats.total}</StatNumber>
          <StatDescription>
            {projectStats.active} ativos, {Math.round(projectStats.tasksPerProject)} tarefas/projeto
          </StatDescription>
        </StatCard>
        
        <StatCard>
          <h3><FaTag /> Categorias</h3>
          <StatNumber>{categoryData.length}</StatNumber>
          <StatDescription>
            {categoryData[0]?.name || 'Nenhuma'} é a mais utilizada
          </StatDescription>
        </StatCard>
        
        <StatCard>
          <h3><FaExclamationTriangle /> Prioridade Alta</h3>
          <StatNumber color="var(--error-color)">
            {priorityData.find(p => p.name === 'alta')?.count || 0}
            <StatTrend positive={false}>
              <FaCaretUp /> {priorityData.find(p => p.name === 'alta')?.percentage || 0}%
            </StatTrend>
          </StatNumber>
          <StatDescription>
            {priorityData.find(p => p.name === 'alta')?.percentage || 0}% do total de tarefas
          </StatDescription>
        </StatCard>
        
        <StatCard>
          <h3><FaHourglassHalf /> Tempo Médio</h3>
          <StatNumber>
            {projectMetrics.length > 0 
              ? Math.round(projectMetrics.reduce((sum, p) => sum + p.avgLeadTimeDays, 0) / projectMetrics.length) 
              : 0}d
          </StatNumber>
          <StatDescription>
            Tempo médio para concluir tarefas
          </StatDescription>
        </StatCard>
      </StatsGrid>
      
      {/* Gráficos principais em Grid */}
      <GridSection>
        {/* Status de Conclusão */}
        <ChartSection>
          <ChartHeader>
            <h2><FaChartPie /> Status das Tarefas</h2>
            
            <Tabs>
              <Tab 
                active={selectedChartTab === 'pie'} 
                onClick={() => setSelectedChartTab('pie')}
              >
                Pizza
              </Tab>
              <Tab 
                active={selectedChartTab === 'bar'} 
                onClick={() => setSelectedChartTab('bar')}
              >
                Barras
              </Tab>
            </Tabs>
          </ChartHeader>
          
          <ChartContainer>
            {selectedChartTab === 'pie' ? (
              <PieChartContainer>
                <PieOuterContainer>
                  <PieChart percentageComplete={completionPercentage} />
                </PieOuterContainer>
                
                <PieLegend>
                  <LegendItem>
                    <LegendColor color="var(--success-color)" />
                    Concluídas: {stats.completed} ({completionPercentage}%)
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="var(--error-color)" />
                    Pendentes: {stats.pending} ({100 - completionPercentage}%)
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="var(--accent-color)" />
                    Total: {stats.total} tarefas
                  </LegendItem>
                </PieLegend>
              </PieChartContainer>
            ) : (
              <HorizontalBarChart>
                <BarItem>
                  <BarLabel>Concluídas</BarLabel>
                  <BarContainer>
                    <Bar width={completionPercentage} color="var(--success-color)" />
                  </BarContainer>
                </BarItem>
                <BarItem>
                  <BarLabel>Pendentes</BarLabel>
                  <BarContainer>
                    <Bar 
                      width={100 - completionPercentage} 
                      color="var(--error-color)" 
                    />
                  </BarContainer>
                </BarItem>
                <BarItem>
                  <BarLabel>Subtarefas Concluídas</BarLabel>
                  <BarContainer>
                    <Bar 
                      width={subtaskStats.completionRate} 
                      color="var(--accent-color)" 
                    />
                  </BarContainer>
                </BarItem>
              </HorizontalBarChart>
            )}
          </ChartContainer>
        </ChartSection>
        
        {/* Distribuição por Prioridade */}
        <ChartSection>
          <ChartHeader>
            <h2><FaExclamationTriangle /> Distribuição por Prioridade</h2>
          </ChartHeader>
          
          <ChartContainer>
            <HorizontalBarChart>
              {priorityData.map(priority => (
                <BarItem key={priority.name}>
                  <BarLabel>
                    {priority.name.charAt(0).toUpperCase() + priority.name.slice(1)}
                  </BarLabel>
                  <BarContainer>
                    <Bar 
                      width={priority.percentage} 
                      color={priority.color}
                    />
                  </BarContainer>
                </BarItem>
              ))}
            </HorizontalBarChart>
          </ChartContainer>
        </ChartSection>
      </GridSection>
      
      {/* Tendência de Conclusão de Tarefas */}
      <ChartSection>
        <ChartHeader>
          <h2><FaChartLine /> Tendência de Conclusão Mensal</h2>
        </ChartHeader>
        
        <ChartContainer>
          <TimelineContainer>
            {completionTrendData.map((month, index) => (
              <TimelineItem key={index}>
                <TimelineLabel>{month.label}</TimelineLabel>
                <TimelineBar>
                  <TimelineProgress 
                    start={0} 
                    end={month.rate} 
                    color="var(--accent-color)"
                  />
                </TimelineBar>
              </TimelineItem>
            ))}
          </TimelineContainer>
        </ChartContainer>
      </ChartSection>
      
      {/* Métricas de Projetos */}
      <ChartSection>
        <ChartHeader>
          <h2><FaProjectDiagram /> Métricas de Projetos</h2>
        </ChartHeader>
        
        <ChartContainer>
          <DataTable>
            <table>
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Total de Tarefas</th>
                  <th>Concluídas</th>
                  <th>Taxa de Conclusão</th>
                  <th>Tempo Médio</th>
                </tr>
              </thead>
              <tbody>
                {projectMetrics.length > 0 ? (
                  projectMetrics
                    .filter(p => p.total > 0)
                    .map(project => (
                      <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>{project.total}</td>
                        <td>{project.completed}</td>
                        <td>{project.completionRate}%</td>
                        <td>{project.avgLeadTimeDays} dias</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5}>Nenhum projeto com tarefas encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </DataTable>
        </ChartContainer>
      </ChartSection>
      
      {/* Mapa de Calor de Atividade */}
      <ChartSection>
        <ChartHeader>
          <h2><FaFireAlt /> Padrão de Atividade</h2>
        </ChartHeader>
        
        <ChartContainer>
          <HeatMapContainer>
            <HeatMapHeader>
              <HeatMapDescription>
                Este gráfico mostra quando você costuma criar tarefas durante a semana.
                As células mais escuras indicam períodos com maior atividade.
              </HeatMapDescription>
              
              <HeatMapLegend>
                <span>Intensidade:</span>
                <LegendScale />
                <LegendText>
                  <span>Baixa</span>
                  <span>Alta</span>
                </LegendText>
              </HeatMapLegend>
            </HeatMapHeader>
            
            {/* Mapa de calor organizado por dias da semana e períodos do dia */}
            <WeekdayHeatMap>
              <EmptyCell /> {/* Célula vazia no canto superior esquerdo */}
              
              {/* Rótulos dos dias da semana */}
              <WeekdayLabel>Dom</WeekdayLabel>
              <WeekdayLabel>Seg</WeekdayLabel>
              <WeekdayLabel>Ter</WeekdayLabel>
              <WeekdayLabel>Qua</WeekdayLabel>
              <WeekdayLabel>Qui</WeekdayLabel>
              <WeekdayLabel>Sex</WeekdayLabel>
              <WeekdayLabel>Sáb</WeekdayLabel>
              
              {/* Linha para Manhã */}
              <DayRow>
                <TimeLabel>Manhã</TimeLabel>
                {(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const).map((day) => {
                  const item = activityHeatMapData.find(i => i.key === `${day}-Manhã`);
                  return (
                    <HeatMapCell 
                      key={`${day}-Manhã`} 
                      intensity={item?.intensity || 0}
                      title={`${day}, período da manhã: ${item?.value || 0} tarefas`}
                    >
                      {item?.value || 0}
                    </HeatMapCell>
                  );
                })}
              </DayRow>
              
              {/* Linha para Tarde */}
              <DayRow>
                <TimeLabel>Tarde</TimeLabel>
                {(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const).map((day) => {
                  const item = activityHeatMapData.find(i => i.key === `${day}-Tarde`);
                  return (
                    <HeatMapCell 
                      key={`${day}-Tarde`} 
                      intensity={item?.intensity || 0}
                      title={`${day}, período da tarde: ${item?.value || 0} tarefas`}
                    >
                      {item?.value || 0}
                    </HeatMapCell>
                  );
                })}
              </DayRow>
              
              {/* Linha para Noite */}
              <DayRow>
                <TimeLabel>Noite</TimeLabel>
                {(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const).map((day) => {
                  const item = activityHeatMapData.find(i => i.key === `${day}-Noite`);
                  return (
                    <HeatMapCell 
                      key={`${day}-Noite`} 
                      intensity={item?.intensity || 0}
                      title={`${day}, período da noite: ${item?.value || 0} tarefas`}
                    >
                      {item?.value || 0}
                    </HeatMapCell>
                  );
                })}
              </DayRow>
              
              {/* Linha para Madrugada */}
              <DayRow>
                <TimeLabel>Madrugada</TimeLabel>
                {(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const).map((day) => {
                  const item = activityHeatMapData.find(i => i.key === `${day}-Madrugada`);
                  return (
                    <HeatMapCell 
                      key={`${day}-Madrugada`} 
                      intensity={item?.intensity || 0}
                      title={`${day}, madrugada: ${item?.value || 0} tarefas`}
                    >
                      {item?.value || 0}
                    </HeatMapCell>
                  );
                })}
              </DayRow>
            </WeekdayHeatMap>
          </HeatMapContainer>
        </ChartContainer>
      </ChartSection>
      
      {/* Tarefas por Categoria */}
      <ChartSection>
        <ChartHeader>
          <h2><FaTag /> Tarefas por Categoria</h2>
        </ChartHeader>
        
        <ChartContainer>
          <HorizontalBarChart>
            {categoryData.map(category => (
              <BarItem key={category.name}>
                <BarLabel>{category.name}</BarLabel>
                <BarContainer>
                  <Bar 
                    width={category.percentage} 
                    color="var(--accent-color)"
                  />
                </BarContainer>
              </BarItem>
            ))}
          </HorizontalBarChart>
        </ChartContainer>
      </ChartSection>
    </DashboardContainer>
  );
};

export default DashboardPage; 