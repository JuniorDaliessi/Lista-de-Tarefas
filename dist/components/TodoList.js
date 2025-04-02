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
const TodoItem_1 = __importDefault(require("./TodoItem"));
const react_window_1 = require("react-window");
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
const ListContainer = styled_components_1.default.div `
  margin-top: 1.5rem;
  transition: all var(--transition-normal);
  animation: fadeIn var(--transition-normal);
  
  @media (max-width: 480px) {
    margin-top: 1rem;
  }
`;
const ListHeader = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  
  svg {
    color: var(--accent-color);
    margin-right: 0.8rem;
    font-size: 1.5rem;
  }
`;
const ListTitle = styled_components_1.default.h2 `
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;
const FilterContainer = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
  }
  
  @media (max-width: 580px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
`;
const FilterGroup = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  @media (max-width: 580px) {
    width: 100%;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  gap: 0.5rem;
  }
`;
const FilterLabel = styled_components_1.default.label `
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.4rem;
    color: var(--accent-color);
  }
  
  @media (max-width: 580px) {
    width: 100%;
    margin-bottom: 0.2rem;
  }
`;
const Select = styled_components_1.default.select `
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 0.8rem;
  padding-right: 2rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
  }
  
  @media (max-width: 580px) {
    width: 100%;
  }
`;
const TodoListItems = styled_components_1.default.div `
  height: 600px;
  width: 100%;
  overflow: visible;
  padding: 0.5rem 0;
  
  @media (max-width: 768px) {
    height: 500px;
  }

  @media (max-width: 480px) {
    height: 400px;
  }
`;
const EmptyMessage = styled_components_1.default.div `
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  margin-top: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn var(--transition-normal);
  
  svg {
    color: var(--accent-color);
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }
  
  p {
    margin: 0.5rem 0 0;
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    font-size: 1rem;
    
    svg {
      font-size: 2.5rem;
    }
  }
`;
const StatsContainer = styled_components_1.default.div `
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;
const StatItem = styled_components_1.default.div `
  padding: 0.8rem 1.2rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  font-size: 0.9rem;
  flex: 1;
  min-width: 180px;
  
  ${props => {
    switch (props.$type) {
        case 'success':
            return `
          background-color: var(--success-light);
          color: var(--success-color);
        `;
        case 'warning':
            return `
          background-color: var(--warning-light);
          color: var(--warning-color);
        `;
        case 'error':
            return `
          background-color: var(--error-light);
          color: var(--error-color);
        `;
        default:
            return `
          background-color: var(--background-secondary);
          color: var(--text-primary);
        `;
    }
}}
  
  svg {
    font-size: 1.2rem;
  }
  
  span {
    font-weight: 600;
    margin-left: auto;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;
// Altura média estimada de cada item de tarefa
const ITEM_SIZE = 210;
const TodoList = () => {
    const { filteredTodos, filter, setFilter, sortBy, setSortBy, searchQuery, todos } = (0, TodoContext_1.useTodo)();
    // Calcular estatísticas
    const stats = (0, react_1.useMemo)(() => {
        // Filtrar tarefas atrasadas (não concluídas com data de vencimento no passado)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const overdueTasks = todos.filter(todo => {
            if (todo.completed || !todo.date)
                return false;
            const dueDate = new Date(todo.date);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate < today;
        });
        // Tarefas pendentes (não concluídas)
        const pendingTasks = todos.filter(todo => !todo.completed);
        // Tarefas concluídas
        const completedTasks = todos.filter(todo => todo.completed);
        return {
            total: todos.length,
            pending: pendingTasks.length,
            completed: completedTasks.length,
            overdue: overdueTasks.length
        };
    }, [todos]);
    const getListTitle = (0, react_1.useCallback)(() => {
        if (searchQuery) {
            return `Resultados da busca "${searchQuery}"`;
        }
        switch (filter) {
            case 'pendentes':
                return 'Tarefas Pendentes';
            case 'concluídas':
                return 'Tarefas Concluídas';
            default:
                return 'Todas as Tarefas';
        }
    }, [filter, searchQuery]);
    const getEmptyIcon = (0, react_1.useCallback)(() => {
        if (searchQuery) {
            return (0, jsx_runtime_1.jsx)(fa_1.FaSearch, {});
        }
        switch (filter) {
            case 'pendentes':
                return (0, jsx_runtime_1.jsx)(fa_1.FaExclamationTriangle, {});
            case 'concluídas':
                return (0, jsx_runtime_1.jsx)(fa_1.FaCheckCircle, {});
            default:
                return (0, jsx_runtime_1.jsx)(fa_1.FaListUl, {});
        }
    }, [filter, searchQuery]);
    const getEmptyMessage = (0, react_1.useCallback)(() => {
        if (searchQuery) {
            return `Nenhuma tarefa encontrada para "${searchQuery}".`;
        }
        switch (filter) {
            case 'pendentes':
                return 'Nenhuma tarefa pendente encontrada.';
            case 'concluídas':
                return 'Nenhuma tarefa concluída encontrada.';
            default:
                return 'Nenhuma tarefa encontrada. Adicione uma nova tarefa!';
        }
    }, [filter, searchQuery]);
    const handleFilterChange = (0, react_1.useCallback)((e) => {
        setFilter(e.target.value);
    }, [setFilter]);
    const handleSortChange = (0, react_1.useCallback)((e) => {
        setSortBy(e.target.value);
    }, [setSortBy]);
    const Row = (0, react_1.useCallback)(({ index, style }) => {
        if (!filteredTodos || index >= filteredTodos.length) {
            console.error("Problema na renderização da lista:", { index, totalTodos: filteredTodos === null || filteredTodos === void 0 ? void 0 : filteredTodos.length });
            return null;
        }
        const todo = filteredTodos[index];
        if (!todo) {
            console.error("Todo indefinido no índice:", index);
            return null;
        }
        return ((0, jsx_runtime_1.jsx)("div", { style: Object.assign(Object.assign({}, style), { paddingTop: 8, paddingBottom: 8 }), children: (0, jsx_runtime_1.jsx)(TodoItem_1.default, { todo: todo }, todo.id) }));
    }, [filteredTodos]);
    const listTitle = (0, react_1.useMemo)(() => getListTitle(), [getListTitle]);
    // Renderizar uma versão simplificada se houver problemas
    if (!filteredTodos) {
        return (0, jsx_runtime_1.jsx)("div", { children: "Carregando tarefas..." });
    }
    return ((0, jsx_runtime_1.jsxs)(ListContainer, { children: [(0, jsx_runtime_1.jsxs)(ListHeader, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaListUl, { "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)(ListTitle, { children: listTitle })] }), (0, jsx_runtime_1.jsxs)(StatsContainer, { children: [(0, jsx_runtime_1.jsxs)(StatItem, { "$type": "normal", children: [(0, jsx_runtime_1.jsx)(fa_1.FaListUl, {}), "Total de Tarefas", (0, jsx_runtime_1.jsx)("span", { children: stats.total })] }), (0, jsx_runtime_1.jsxs)(StatItem, { "$type": "warning", children: [(0, jsx_runtime_1.jsx)(fa_1.FaClock, {}), "Tarefas Pendentes", (0, jsx_runtime_1.jsx)("span", { children: stats.pending })] }), (0, jsx_runtime_1.jsxs)(StatItem, { "$type": "success", children: [(0, jsx_runtime_1.jsx)(fa_1.FaCheckCircle, {}), "Tarefas Conclu\u00EDdas", (0, jsx_runtime_1.jsx)("span", { children: stats.completed })] }), (0, jsx_runtime_1.jsxs)(StatItem, { "$type": "error", children: [(0, jsx_runtime_1.jsx)(fa_1.FaExclamationTriangle, {}), "Tarefas Atrasadas", (0, jsx_runtime_1.jsx)("span", { children: stats.overdue })] })] }), (0, jsx_runtime_1.jsxs)(FilterContainer, { children: [(0, jsx_runtime_1.jsxs)(FilterGroup, { children: [(0, jsx_runtime_1.jsxs)(FilterLabel, { htmlFor: "filter", children: [(0, jsx_runtime_1.jsx)(fa_1.FaFilter, {}), "Filtrar por"] }), (0, jsx_runtime_1.jsxs)(Select, { id: "filter", value: filter, onChange: handleFilterChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "todas", children: "Todas as tarefas" }), (0, jsx_runtime_1.jsx)("option", { value: "pendentes", children: "Pendentes" }), (0, jsx_runtime_1.jsx)("option", { value: "conclu\u00EDdas", children: "Conclu\u00EDdas" })] })] }), (0, jsx_runtime_1.jsxs)(FilterGroup, { children: [(0, jsx_runtime_1.jsxs)(FilterLabel, { htmlFor: "sort", children: [(0, jsx_runtime_1.jsx)(fa_1.FaSort, {}), "Ordenar por"] }), (0, jsx_runtime_1.jsxs)(Select, { id: "sort", value: sortBy, onChange: handleSortChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "data", children: "Data" }), (0, jsx_runtime_1.jsx)("option", { value: "prioridade", children: "Prioridade" }), (0, jsx_runtime_1.jsx)("option", { value: "alfab\u00E9tica", children: "Alfab\u00E9tica" }), (0, jsx_runtime_1.jsx)("option", { value: "cria\u00E7\u00E3o", children: "Data de cria\u00E7\u00E3o" })] })] })] }), filteredTodos.length > 0 ? ((0, jsx_runtime_1.jsx)(TodoListItems, { children: (0, jsx_runtime_1.jsx)(react_virtualized_auto_sizer_1.default, { children: ({ height, width }) => ((0, jsx_runtime_1.jsx)(react_window_1.FixedSizeList, { height: height, itemCount: filteredTodos.length, itemSize: ITEM_SIZE, width: width, children: ({ index, style }) => ((0, jsx_runtime_1.jsx)("div", { style: style, children: (0, jsx_runtime_1.jsx)(TodoItem_1.default, { todo: filteredTodos[index] }, filteredTodos[index].id) })) })) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: searchQuery ? ((0, jsx_runtime_1.jsxs)(EmptyMessage, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaSearch, {}), (0, jsx_runtime_1.jsx)("h3", { children: "Nenhuma tarefa encontrada" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Sua busca por \"", searchQuery, "\" n\u00E3o retornou resultados."] })] })) : filter === 'concluídas' ? ((0, jsx_runtime_1.jsxs)(EmptyMessage, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaCheckCircle, {}), (0, jsx_runtime_1.jsx)("h3", { children: "Nenhuma tarefa conclu\u00EDda" }), (0, jsx_runtime_1.jsx)("p", { children: "Voc\u00EA ainda n\u00E3o concluiu nenhuma tarefa. Que tal completar algumas?" })] })) : filter === 'pendentes' ? (stats.overdue > 0 ? ((0, jsx_runtime_1.jsxs)(EmptyMessage, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaExclamationTriangle, {}), (0, jsx_runtime_1.jsx)("h3", { children: "Aten\u00E7\u00E3o: Tarefas Atrasadas" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Voc\u00EA tem ", stats.overdue, " ", stats.overdue === 1 ? 'tarefa atrasada' : 'tarefas atrasadas', " que precisam de aten\u00E7\u00E3o."] })] })) : ((0, jsx_runtime_1.jsxs)(EmptyMessage, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaClock, {}), (0, jsx_runtime_1.jsx)("h3", { children: "Nenhuma tarefa pendente" }), (0, jsx_runtime_1.jsx)("p", { children: "Parab\u00E9ns! Voc\u00EA completou todas as suas tarefas." })] }))) : ((0, jsx_runtime_1.jsxs)(EmptyMessage, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaListUl, {}), (0, jsx_runtime_1.jsx)("h3", { children: "Sua lista est\u00E1 vazia" }), (0, jsx_runtime_1.jsx)("p", { children: "Adicione algumas tarefas para come\u00E7ar a organizar seu trabalho." })] })) }))] }));
};
exports.default = (0, react_1.memo)(TodoList);
