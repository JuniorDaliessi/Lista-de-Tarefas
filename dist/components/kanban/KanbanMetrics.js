"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const fa_1 = require("react-icons/fa");
const MetricsContainer = styled_components_1.default.div `
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;
const MetricsHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const MetricsTitle = styled_components_1.default.h3 `
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
const MetricsGrid = styled_components_1.default.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;
const MetricCard = styled_components_1.default.div `
  background-color: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
const MetricTitle = styled_components_1.default.div `
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
const MetricValue = styled_components_1.default.div `
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
`;
const MetricDescription = styled_components_1.default.div `
  font-size: 0.85rem;
  color: #777;
  margin-top: 0.5rem;
`;
const MetricTable = styled_components_1.default.table `
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;
const TableHeader = styled_components_1.default.th `
  text-align: left;
  font-weight: 500;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  color: #555;
  font-size: 0.9rem;
`;
const TableCell = styled_components_1.default.td `
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
`;
// Helper function to format time (ms) to readable format
const formatTime = (ms) => {
    if (ms === null)
        return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    }
    else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    else {
        return `${seconds}s`;
    }
};
const KanbanMetrics = ({ project, todos, getLeadTime, getCycleTime }) => {
    // Calculate average lead time (overall time from creation to completion)
    const leadTimes = todos.map(todo => getLeadTime(todo.id)).filter(Boolean);
    const avgLeadTime = leadTimes.length > 0
        ? leadTimes.reduce((sum, time) => sum + time, 0) / leadTimes.length
        : null;
    // Calculate average cycle time (active work time)
    const cycleTimes = todos.map(todo => getCycleTime(todo.id)).filter(Boolean);
    const avgCycleTime = cycleTimes.length > 0
        ? cycleTimes.reduce((sum, time) => sum + time, 0) / cycleTimes.length
        : null;
    // Count todos by column
    const todosByColumn = project.columns.reduce((acc, column) => {
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
    return ((0, jsx_runtime_1.jsxs)(MetricsContainer, { children: [(0, jsx_runtime_1.jsx)(MetricsHeader, { children: (0, jsx_runtime_1.jsxs)(MetricsTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaChartBar, {}), "M\u00E9tricas do Projeto"] }) }), (0, jsx_runtime_1.jsxs)(MetricsGrid, { children: [(0, jsx_runtime_1.jsxs)(MetricCard, { children: [(0, jsx_runtime_1.jsxs)(MetricTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaInfoCircle, {}), "Lead Time M\u00E9dio"] }), (0, jsx_runtime_1.jsx)(MetricValue, { children: formatTime(avgLeadTime) }), (0, jsx_runtime_1.jsx)(MetricDescription, { children: "Tempo m\u00E9dio desde a cria\u00E7\u00E3o at\u00E9 a conclus\u00E3o de uma tarefa." })] }), (0, jsx_runtime_1.jsxs)(MetricCard, { children: [(0, jsx_runtime_1.jsxs)(MetricTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaInfoCircle, {}), "Cycle Time M\u00E9dio"] }), (0, jsx_runtime_1.jsx)(MetricValue, { children: formatTime(avgCycleTime) }), (0, jsx_runtime_1.jsx)(MetricDescription, { children: "Tempo m\u00E9dio de trabalho ativo em uma tarefa." })] }), (0, jsx_runtime_1.jsxs)(MetricCard, { children: [(0, jsx_runtime_1.jsxs)(MetricTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaInfoCircle, {}), "Taxa de Conclus\u00E3o"] }), (0, jsx_runtime_1.jsxs)(MetricValue, { children: [completionRate.toFixed(0), "%"] }), (0, jsx_runtime_1.jsx)(MetricDescription, { children: "Percentual de tarefas conclu\u00EDdas no projeto." })] }), (0, jsx_runtime_1.jsxs)(MetricCard, { children: [(0, jsx_runtime_1.jsxs)(MetricTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaInfoCircle, {}), "Distribui\u00E7\u00E3o por Coluna"] }), (0, jsx_runtime_1.jsxs)(MetricTable, { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)(TableHeader, { children: "Coluna" }), (0, jsx_runtime_1.jsx)(TableHeader, { children: "Tarefas" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: project.columns
                                            .sort((a, b) => a.order - b.order)
                                            .map(column => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)(TableCell, { children: column.title }), (0, jsx_runtime_1.jsx)(TableCell, { children: todosByColumn[column.id] || 0 })] }, column.id))) })] })] }), (0, jsx_runtime_1.jsxs)(MetricCard, { children: [(0, jsx_runtime_1.jsxs)(MetricTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaInfoCircle, {}), "Distribui\u00E7\u00E3o por Prioridade"] }), (0, jsx_runtime_1.jsxs)(MetricTable, { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)(TableHeader, { children: "Prioridade" }), (0, jsx_runtime_1.jsx)(TableHeader, { children: "Tarefas" })] }) }), (0, jsx_runtime_1.jsxs)("tbody", { children: [(0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)(TableCell, { children: "Alta" }), (0, jsx_runtime_1.jsx)(TableCell, { children: todosByPriority.alta })] }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)(TableCell, { children: "M\u00E9dia" }), (0, jsx_runtime_1.jsx)(TableCell, { children: todosByPriority.média })] }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)(TableCell, { children: "Baixa" }), (0, jsx_runtime_1.jsx)(TableCell, { children: todosByPriority.baixa })] })] })] })] })] })] }));
};
exports.default = KanbanMetrics;
