"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const fa_1 = require("react-icons/fa");
const TodoContext_1 = require("../contexts/TodoContext");
const ProjectContext_1 = require("../contexts/ProjectContext");
// Estilos principais
const DashboardContainer = styled_components_1.default.div `
  padding: 2rem 1rem;
  animation: fadeIn var(--transition-normal);
  max-width: 1400px;
  margin: 0 auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;
const DashboardHeader = styled_components_1.default.div `
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
const DashboardTitle = styled_components_1.default.h1 `
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
const FilterControls = styled_components_1.default.div `
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const FilterSelect = styled_components_1.default.select `
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
`;
// Grid de cards de estatísticas
const StatsGrid = styled_components_1.default.div `
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
const StatCard = styled_components_1.default.div `
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
const StatNumber = styled_components_1.default.div `
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.color || 'var(--accent-color)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const StatTrend = styled_components_1.default.span `
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  color: ${props => props.positive ? 'var(--success-color)' : 'var(--error-color)'};
`;
const StatDescription = styled_components_1.default.p `
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;
// Layout de seções de gráficos
const GridSection = styled_components_1.default.div `
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
const ChartSection = styled_components_1.default.div `
  margin-bottom: 2rem;
`;
const ChartHeader = styled_components_1.default.div `
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
const ChartContainer = styled_components_1.default.div `
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
const Tabs = styled_components_1.default.div `
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;
const Tab = styled_components_1.default.button `
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
const HorizontalBarChart = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
`;
const BarItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;
const BarLabel = styled_components_1.default.div `
  flex: 0 0 150px;
  font-size: 0.9rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const BarContainer = styled_components_1.default.div `
  flex: 1;
  height: 25px;
  background-color: var(--background-secondary);
  border-radius: 4px;
  overflow: hidden;
`;
const Bar = styled_components_1.default.div `
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
const PieChartContainer = styled_components_1.default.div `
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
const PieOuterContainer = styled_components_1.default.div `
  position: relative;
  width: 200px;
  height: 200px;
  
  @media (max-width: 480px) {
    width: 180px;
    height: 180px;
  }
`;
const PieChart = styled_components_1.default.div `
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
const PieLegend = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;
const LegendItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-primary);
`;
const LegendColor = styled_components_1.default.div `
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
  border-radius: 2px;
  margin-right: 0.5rem;
`;
// Tabela de dados
const DataTable = styled_components_1.default.div `
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
const TimelineContainer = styled_components_1.default.div `
  margin-top: 1rem;
  overflow-x: auto;
`;
const TimelineItem = styled_components_1.default.div `
  display: flex;
  margin-bottom: 0.8rem;
  align-items: center;
  gap: 0.5rem;
`;
const TimelineLabel = styled_components_1.default.div `
  flex: 0 0 150px;
  font-size: 0.9rem;
  color: var(--text-primary);
`;
const TimelineBar = styled_components_1.default.div `
  flex: 1;
  height: 25px;
  background-color: var(--background-secondary);
  border-radius: 4px;
  position: relative;
`;
const TimelineProgress = styled_components_1.default.div `
  position: absolute;
  left: ${props => props.start}%;
  width: ${props => props.end - props.start}%;
  height: 100%;
  background-color: ${props => props.color};
  border-radius: 4px;
  transition: all 0.3s ease;
`;
// Heat Map (representação de intensidade)
const HeatMapContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 480px) {
    overflow-x: auto;
    width: 100%;
    padding-bottom: 0.5rem;
  }
`;
const HeatMapHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  gap: 0.8rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
  }
`;
const HeatMapDescription = styled_components_1.default.p `
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  max-width: 500px;
`;
const HeatMapLegend = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;
const LegendScale = styled_components_1.default.div `
  display: flex;
  align-items: center;
  background: linear-gradient(to right, rgba(var(--accent-color-rgb), 0.2), rgba(var(--accent-color-rgb), 1));
  height: 12px;
  width: 100px;
  border-radius: 6px;
  margin-right: 5px;
`;
const LegendText = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  width: 100px;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;
const WeekdayHeatMap = styled_components_1.default.div `
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 60px repeat(7, 1fr);
    gap: 0.3rem;
  }
  
  @media (max-width: 480px) {
    display: grid;
    grid-template-columns: auto repeat(7, 1fr);
    gap: 0.2rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    width: 100%;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--background-secondary);
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: var(--border-color);
      border-radius: 4px;
    }
  }
`;
const TimeLabel = styled_components_1.default.div `
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding-right: 0.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding-right: 0.3rem;
    justify-content: center;
    white-space: nowrap;
  }
`;
const WeekdayLabel = styled_components_1.default.div `
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 500;
  text-align: center;
  padding-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    text-align: center;
    padding: 0.2rem 0;
  }
`;
const DayRow = styled_components_1.default.div `
  display: contents;
  
  @media (max-width: 480px) {
    display: contents;
  }
`;
const HeatMapCell = styled_components_1.default.div `
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
    padding: 0.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.3rem;
    min-width: 24px;
    min-height: 24px;
    aspect-ratio: 1;
  }
`;
const EmptyCell = styled_components_1.default.div `
  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 1;
  }
`;
// Componente principal do Dashboard
const DashboardPage = () => {
    var _a, _b, _c, _d;
    // Estados para filtros e abas
    const [dateRange, setDateRange] = (0, react_1.useState)('all');
    const [activeProjectTab, setActiveProjectTab] = (0, react_1.useState)(null);
    const [selectedMetricTab, setSelectedMetricTab] = (0, react_1.useState)('summary');
    const [selectedChartTab, setSelectedChartTab] = (0, react_1.useState)('bar');
    // Hooks de contexto
    const { todos, getTodoStats } = (0, TodoContext_1.useTodo)();
    const { projects, taskMetrics, getLeadTime, getCycleTime } = (0, ProjectContext_1.useProject)();
    // Filtrar todos por período de tempo
    const filteredTodos = (0, react_1.useMemo)(() => {
        if (!todos || !Array.isArray(todos))
            return [];
        if (dateRange === 'all')
            return todos;
        const now = new Date();
        const cutoffDate = new Date();
        if (dateRange === 'week') {
            cutoffDate.setDate(now.getDate() - 7);
        }
        else if (dateRange === 'month') {
            cutoffDate.setMonth(now.getMonth() - 1);
        }
        return todos.filter(todo => new Date(todo.createdAt) >= cutoffDate);
    }, [todos, dateRange]);
    // Estatísticas básicas das tarefas
    const stats = (0, react_1.useMemo)(() => {
        if (!getTodoStats || typeof getTodoStats !== 'function') {
            return { total: 0, completed: 0, pending: 0, byPriority: {}, byCategory: {} };
        }
        return getTodoStats();
    }, [getTodoStats]);
    // Total de subtarefas
    const subtaskStats = (0, react_1.useMemo)(() => {
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
    const projectStats = (0, react_1.useMemo)(() => {
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
    const completionPercentage = (0, react_1.useMemo)(() => {
        if (!filteredTodos || !Array.isArray(filteredTodos) || filteredTodos.length === 0) {
            return 0;
        }
        const completedCount = filteredTodos.filter(t => t && t.completed).length;
        return Math.round((completedCount / filteredTodos.length) * 100);
    }, [filteredTodos]);
    // Preparar dados de categorias para o gráfico
    const categoryData = (0, react_1.useMemo)(() => {
        if (!filteredTodos || !Array.isArray(filteredTodos) || filteredTodos.length === 0) {
            return [];
        }
        const categoryCounts = {};
        filteredTodos.forEach(todo => {
            if (!todo)
                return;
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
    const priorityData = (0, react_1.useMemo)(() => {
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
            if (!todo)
                return;
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
    const completionTrendData = (0, react_1.useMemo)(() => {
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
                if (!todo || !todo.createdAt)
                    return false;
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
    const projectMetrics = (0, react_1.useMemo)(() => {
        if (!projects || !Array.isArray(projects) || !todos || !Array.isArray(todos) || !getLeadTime) {
            return [];
        }
        // Usar filter para remover resultados nulos antes do map final
        return projects
            .map(project => {
            if (!project || !project.id)
                return null;
            const projectTodos = todos.filter(todo => todo && todo.projectId === project.id);
            const completed = projectTodos.filter(todo => todo && todo.completed).length;
            const total = projectTodos.length;
            const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
            // Calcular lead time médio
            let totalLeadTime = 0;
            let todoCount = 0;
            projectTodos.forEach(todo => {
                if (!todo || !todo.id)
                    return;
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
            .filter((p) => p !== null);
    }, [projects, todos, getLeadTime]);
    // Dados para heat map de atividade por dia da semana
    const activityHeatMapData = (0, react_1.useMemo)(() => {
        if (!todos || !Array.isArray(todos)) {
            return [];
        }
        const dayMap = [
            'Domingo', 'Segunda', 'Terça', 'Quarta',
            'Quinta', 'Sexta', 'Sábado'
        ];
        const hourMap = ['Manhã', 'Tarde', 'Noite', 'Madrugada', 'Desconhecido'];
        const activityMap = {};
        // Inicializar mapa
        dayMap.forEach(day => {
            hourMap.forEach(hour => {
                activityMap[`${day}-${hour}`] = 0;
            });
        });
        // Preencher dados
        todos.forEach(todo => {
            if (!todo || !todo.createdAt)
                return;
            try {
                const date = new Date(todo.createdAt);
                if (isNaN(date.getTime()))
                    return; // Data inválida
                const day = dayMap[date.getDay()];
                let timeOfDay;
                const hours = date.getHours();
                if (hours >= 5 && hours < 12)
                    timeOfDay = 'Manhã';
                else if (hours >= 12 && hours < 18)
                    timeOfDay = 'Tarde';
                else if (hours >= 18 && hours < 22)
                    timeOfDay = 'Noite';
                else
                    timeOfDay = 'Madrugada';
                const key = `${day}-${timeOfDay}`;
                activityMap[key] = (activityMap[key] || 0) + 1;
            }
            catch (e) {
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
    const formatTimespan = (0, react_1.useCallback)((ms) => {
        if (!ms)
            return 'N/A';
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) {
            return `${days}d ${hours}h`;
        }
        else {
            return `${hours}h`;
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)(DashboardContainer, { children: [(0, jsx_runtime_1.jsxs)(DashboardHeader, { children: [(0, jsx_runtime_1.jsxs)(DashboardTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaChartBar, {}), "Dashboard de M\u00E9tricas"] }), (0, jsx_runtime_1.jsxs)(FilterControls, { children: [(0, jsx_runtime_1.jsxs)(FilterSelect, { value: dateRange, onChange: (e) => setDateRange(e.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Todos os per\u00EDodos" }), (0, jsx_runtime_1.jsx)("option", { value: "week", children: "\u00DAltimos 7 dias" }), (0, jsx_runtime_1.jsx)("option", { value: "month", children: "\u00DAltimo m\u00EAs" })] }), (0, jsx_runtime_1.jsxs)(Tabs, { children: [(0, jsx_runtime_1.jsx)(Tab, { active: selectedMetricTab === 'summary', onClick: () => setSelectedMetricTab('summary'), children: "Resumo" }), (0, jsx_runtime_1.jsx)(Tab, { active: selectedMetricTab === 'detailed', onClick: () => setSelectedMetricTab('detailed'), children: "Detalhado" })] })] })] }), (0, jsx_runtime_1.jsxs)(StatsGrid, { children: [(0, jsx_runtime_1.jsxs)(StatCard, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaThList, {}), " Total de Tarefas"] }), (0, jsx_runtime_1.jsx)(StatNumber, { children: stats.total }), (0, jsx_runtime_1.jsxs)(StatDescription, { children: [stats.pending, " pendentes e ", stats.completed, " conclu\u00EDdas"] })] }), (0, jsx_runtime_1.jsxs)(StatCard, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTasks, {}), " Subtarefas"] }), (0, jsx_runtime_1.jsx)(StatNumber, { children: subtaskStats.total }), (0, jsx_runtime_1.jsxs)(StatDescription, { children: [subtaskStats.completed, " conclu\u00EDdas (", Math.round(subtaskStats.completionRate), "%)"] })] }), (0, jsx_runtime_1.jsxs)(StatCard, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaProjectDiagram, {}), " Projetos"] }), (0, jsx_runtime_1.jsx)(StatNumber, { children: projectStats.total }), (0, jsx_runtime_1.jsxs)(StatDescription, { children: [projectStats.active, " ativos, ", Math.round(projectStats.tasksPerProject), " tarefas/projeto"] })] }), (0, jsx_runtime_1.jsxs)(StatCard, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTag, {}), " Categorias"] }), (0, jsx_runtime_1.jsx)(StatNumber, { children: categoryData.length }), (0, jsx_runtime_1.jsxs)(StatDescription, { children: [((_a = categoryData[0]) === null || _a === void 0 ? void 0 : _a.name) || 'Nenhuma', " \u00E9 a mais utilizada"] })] }), (0, jsx_runtime_1.jsxs)(StatCard, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaExclamationTriangle, {}), " Prioridade Alta"] }), (0, jsx_runtime_1.jsxs)(StatNumber, { color: "var(--error-color)", children: [((_b = priorityData.find(p => p.name === 'alta')) === null || _b === void 0 ? void 0 : _b.count) || 0, (0, jsx_runtime_1.jsxs)(StatTrend, { positive: false, children: [(0, jsx_runtime_1.jsx)(fa_1.FaCaretUp, {}), " ", ((_c = priorityData.find(p => p.name === 'alta')) === null || _c === void 0 ? void 0 : _c.percentage) || 0, "%"] })] }), (0, jsx_runtime_1.jsxs)(StatDescription, { children: [((_d = priorityData.find(p => p.name === 'alta')) === null || _d === void 0 ? void 0 : _d.percentage) || 0, "% do total de tarefas"] })] }), (0, jsx_runtime_1.jsxs)(StatCard, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaHourglassHalf, {}), " Tempo M\u00E9dio"] }), (0, jsx_runtime_1.jsxs)(StatNumber, { children: [projectMetrics.length > 0
                                        ? Math.round(projectMetrics.reduce((sum, p) => sum + p.avgLeadTimeDays, 0) / projectMetrics.length)
                                        : 0, "d"] }), (0, jsx_runtime_1.jsx)(StatDescription, { children: "Tempo m\u00E9dio para concluir tarefas" })] })] }), (0, jsx_runtime_1.jsxs)(GridSection, { children: [(0, jsx_runtime_1.jsxs)(ChartSection, { children: [(0, jsx_runtime_1.jsxs)(ChartHeader, { children: [(0, jsx_runtime_1.jsxs)("h2", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaChartPie, {}), " Status das Tarefas"] }), (0, jsx_runtime_1.jsxs)(Tabs, { children: [(0, jsx_runtime_1.jsx)(Tab, { active: selectedChartTab === 'pie', onClick: () => setSelectedChartTab('pie'), children: "Pizza" }), (0, jsx_runtime_1.jsx)(Tab, { active: selectedChartTab === 'bar', onClick: () => setSelectedChartTab('bar'), children: "Barras" })] })] }), (0, jsx_runtime_1.jsx)(ChartContainer, { children: selectedChartTab === 'pie' ? ((0, jsx_runtime_1.jsxs)(PieChartContainer, { children: [(0, jsx_runtime_1.jsx)(PieOuterContainer, { children: (0, jsx_runtime_1.jsx)(PieChart, { percentageComplete: completionPercentage }) }), (0, jsx_runtime_1.jsxs)(PieLegend, { children: [(0, jsx_runtime_1.jsxs)(LegendItem, { children: [(0, jsx_runtime_1.jsx)(LegendColor, { color: "var(--success-color)" }), "Conclu\u00EDdas: ", stats.completed, " (", completionPercentage, "%)"] }), (0, jsx_runtime_1.jsxs)(LegendItem, { children: [(0, jsx_runtime_1.jsx)(LegendColor, { color: "var(--error-color)" }), "Pendentes: ", stats.pending, " (", 100 - completionPercentage, "%)"] }), (0, jsx_runtime_1.jsxs)(LegendItem, { children: [(0, jsx_runtime_1.jsx)(LegendColor, { color: "var(--accent-color)" }), "Total: ", stats.total, " tarefas"] })] })] })) : ((0, jsx_runtime_1.jsxs)(HorizontalBarChart, { children: [(0, jsx_runtime_1.jsxs)(BarItem, { children: [(0, jsx_runtime_1.jsx)(BarLabel, { children: "Conclu\u00EDdas" }), (0, jsx_runtime_1.jsx)(BarContainer, { children: (0, jsx_runtime_1.jsx)(Bar, { width: completionPercentage, color: "var(--success-color)" }) })] }), (0, jsx_runtime_1.jsxs)(BarItem, { children: [(0, jsx_runtime_1.jsx)(BarLabel, { children: "Pendentes" }), (0, jsx_runtime_1.jsx)(BarContainer, { children: (0, jsx_runtime_1.jsx)(Bar, { width: 100 - completionPercentage, color: "var(--error-color)" }) })] }), (0, jsx_runtime_1.jsxs)(BarItem, { children: [(0, jsx_runtime_1.jsx)(BarLabel, { children: "Subtarefas Conclu\u00EDdas" }), (0, jsx_runtime_1.jsx)(BarContainer, { children: (0, jsx_runtime_1.jsx)(Bar, { width: subtaskStats.completionRate, color: "var(--accent-color)" }) })] })] })) })] }), (0, jsx_runtime_1.jsxs)(ChartSection, { children: [(0, jsx_runtime_1.jsx)(ChartHeader, { children: (0, jsx_runtime_1.jsxs)("h2", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaExclamationTriangle, {}), " Distribui\u00E7\u00E3o por Prioridade"] }) }), (0, jsx_runtime_1.jsx)(ChartContainer, { children: (0, jsx_runtime_1.jsx)(HorizontalBarChart, { children: priorityData.map(priority => ((0, jsx_runtime_1.jsxs)(BarItem, { children: [(0, jsx_runtime_1.jsx)(BarLabel, { children: priority.name.charAt(0).toUpperCase() + priority.name.slice(1) }), (0, jsx_runtime_1.jsx)(BarContainer, { children: (0, jsx_runtime_1.jsx)(Bar, { width: priority.percentage, color: priority.color }) })] }, priority.name))) }) })] })] }), (0, jsx_runtime_1.jsxs)(ChartSection, { children: [(0, jsx_runtime_1.jsx)(ChartHeader, { children: (0, jsx_runtime_1.jsxs)("h2", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaChartLine, {}), " Tend\u00EAncia de Conclus\u00E3o Mensal"] }) }), (0, jsx_runtime_1.jsx)(ChartContainer, { children: (0, jsx_runtime_1.jsx)(TimelineContainer, { children: completionTrendData.map((month, index) => ((0, jsx_runtime_1.jsxs)(TimelineItem, { children: [(0, jsx_runtime_1.jsx)(TimelineLabel, { children: month.label }), (0, jsx_runtime_1.jsx)(TimelineBar, { children: (0, jsx_runtime_1.jsx)(TimelineProgress, { start: 0, end: month.rate, color: "var(--accent-color)" }) })] }, index))) }) })] }), (0, jsx_runtime_1.jsxs)(ChartSection, { children: [(0, jsx_runtime_1.jsx)(ChartHeader, { children: (0, jsx_runtime_1.jsxs)("h2", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaProjectDiagram, {}), " M\u00E9tricas de Projetos"] }) }), (0, jsx_runtime_1.jsx)(ChartContainer, { children: (0, jsx_runtime_1.jsx)(DataTable, { children: (0, jsx_runtime_1.jsxs)("table", { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Projeto" }), (0, jsx_runtime_1.jsx)("th", { children: "Total de Tarefas" }), (0, jsx_runtime_1.jsx)("th", { children: "Conclu\u00EDdas" }), (0, jsx_runtime_1.jsx)("th", { children: "Taxa de Conclus\u00E3o" }), (0, jsx_runtime_1.jsx)("th", { children: "Tempo M\u00E9dio" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: projectMetrics.length > 0 ? (projectMetrics
                                            .filter(p => p.total > 0)
                                            .map(project => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: project.name }), (0, jsx_runtime_1.jsx)("td", { children: project.total }), (0, jsx_runtime_1.jsx)("td", { children: project.completed }), (0, jsx_runtime_1.jsxs)("td", { children: [project.completionRate, "%"] }), (0, jsx_runtime_1.jsxs)("td", { children: [project.avgLeadTimeDays, " dias"] })] }, project.id)))) : ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 5, children: "Nenhum projeto com tarefas encontrado" }) })) })] }) }) })] }), (0, jsx_runtime_1.jsxs)(ChartSection, { children: [(0, jsx_runtime_1.jsx)(ChartHeader, { children: (0, jsx_runtime_1.jsxs)("h2", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaFireAlt, {}), " Padr\u00E3o de Atividade"] }) }), (0, jsx_runtime_1.jsx)(ChartContainer, { children: (0, jsx_runtime_1.jsxs)(HeatMapContainer, { children: [(0, jsx_runtime_1.jsxs)(HeatMapHeader, { children: [(0, jsx_runtime_1.jsx)(HeatMapDescription, { children: "Este gr\u00E1fico mostra quando voc\u00EA costuma criar tarefas durante a semana. As c\u00E9lulas mais escuras indicam per\u00EDodos com maior atividade." }), (0, jsx_runtime_1.jsxs)(HeatMapLegend, { children: [(0, jsx_runtime_1.jsx)("span", { children: "Intensidade:" }), (0, jsx_runtime_1.jsx)(LegendScale, {}), (0, jsx_runtime_1.jsxs)(LegendText, { children: [(0, jsx_runtime_1.jsx)("span", { children: "Baixa" }), (0, jsx_runtime_1.jsx)("span", { children: "Alta" })] })] })] }), (0, jsx_runtime_1.jsxs)(WeekdayHeatMap, { children: [(0, jsx_runtime_1.jsx)(EmptyCell, {}), " ", (0, jsx_runtime_1.jsx)(WeekdayLabel, { children: "Dom" }), (0, jsx_runtime_1.jsx)(WeekdayLabel, { children: "Seg" }), (0, jsx_runtime_1.jsx)(WeekdayLabel, { children: "Ter" }), (0, jsx_runtime_1.jsx)(WeekdayLabel, { children: "Qua" }), (0, jsx_runtime_1.jsx)(WeekdayLabel, { children: "Qui" }), (0, jsx_runtime_1.jsx)(WeekdayLabel, { children: "Sex" }), (0, jsx_runtime_1.jsx)(WeekdayLabel, { children: "S\u00E1b" }), (0, jsx_runtime_1.jsxs)(DayRow, { children: [(0, jsx_runtime_1.jsx)(TimeLabel, { children: "Manh\u00E3" }), ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => {
                                                    const item = activityHeatMapData.find(i => i.key === `${day}-Manhã`);
                                                    return ((0, jsx_runtime_1.jsx)(HeatMapCell, { intensity: (item === null || item === void 0 ? void 0 : item.intensity) || 0, title: `${day}, período da manhã: ${(item === null || item === void 0 ? void 0 : item.value) || 0} tarefas`, children: (item === null || item === void 0 ? void 0 : item.value) || 0 }, `${day}-Manhã`));
                                                })] }), (0, jsx_runtime_1.jsxs)(DayRow, { children: [(0, jsx_runtime_1.jsx)(TimeLabel, { children: "Tarde" }), ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => {
                                                    const item = activityHeatMapData.find(i => i.key === `${day}-Tarde`);
                                                    return ((0, jsx_runtime_1.jsx)(HeatMapCell, { intensity: (item === null || item === void 0 ? void 0 : item.intensity) || 0, title: `${day}, período da tarde: ${(item === null || item === void 0 ? void 0 : item.value) || 0} tarefas`, children: (item === null || item === void 0 ? void 0 : item.value) || 0 }, `${day}-Tarde`));
                                                })] }), (0, jsx_runtime_1.jsxs)(DayRow, { children: [(0, jsx_runtime_1.jsx)(TimeLabel, { children: "Noite" }), ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => {
                                                    const item = activityHeatMapData.find(i => i.key === `${day}-Noite`);
                                                    return ((0, jsx_runtime_1.jsx)(HeatMapCell, { intensity: (item === null || item === void 0 ? void 0 : item.intensity) || 0, title: `${day}, período da noite: ${(item === null || item === void 0 ? void 0 : item.value) || 0} tarefas`, children: (item === null || item === void 0 ? void 0 : item.value) || 0 }, `${day}-Noite`));
                                                })] }), (0, jsx_runtime_1.jsxs)(DayRow, { children: [(0, jsx_runtime_1.jsx)(TimeLabel, { children: "Madrugada" }), ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => {
                                                    const item = activityHeatMapData.find(i => i.key === `${day}-Madrugada`);
                                                    return ((0, jsx_runtime_1.jsx)(HeatMapCell, { intensity: (item === null || item === void 0 ? void 0 : item.intensity) || 0, title: `${day}, madrugada: ${(item === null || item === void 0 ? void 0 : item.value) || 0} tarefas`, children: (item === null || item === void 0 ? void 0 : item.value) || 0 }, `${day}-Madrugada`));
                                                })] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(ChartSection, { children: [(0, jsx_runtime_1.jsx)(ChartHeader, { children: (0, jsx_runtime_1.jsxs)("h2", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTag, {}), " Tarefas por Categoria"] }) }), (0, jsx_runtime_1.jsx)(ChartContainer, { children: (0, jsx_runtime_1.jsx)(HorizontalBarChart, { children: categoryData.map(category => ((0, jsx_runtime_1.jsxs)(BarItem, { children: [(0, jsx_runtime_1.jsx)(BarLabel, { children: category.name }), (0, jsx_runtime_1.jsx)(BarContainer, { children: (0, jsx_runtime_1.jsx)(Bar, { width: category.percentage, color: "var(--accent-color)" }) })] }, category.name))) }) })] })] }));
};
exports.default = DashboardPage;
