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
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const fa_1 = require("react-icons/fa");
const TodoContext_1 = require("../contexts/TodoContext");
const ProjectContext_1 = require("../contexts/ProjectContext");
const TodoForm_1 = __importDefault(require("../components/TodoForm"));
const TaskDetailContainer = styled_components_1.default.div `
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
`;
const BackButton = styled_components_1.default.button `
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 1rem;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  cursor: pointer;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;
const TaskCard = styled_components_1.default.div `
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--accent-color);
`;
const TaskHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;
const TaskTitle = styled_components_1.default.h1 `
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-right: 1rem;
  
  @media (max-width: 576px) {
    margin-bottom: 1rem;
  }
`;
const TaskActions = styled_components_1.default.div `
  display: flex;
  gap: 0.8rem;
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: flex-end;
  }
`;
const ActionButton = styled_components_1.default.button `
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-secondary);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-md);
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-light);
    color: var(--accent-color);
  }
`;
const EditButton = (0, styled_components_1.default)(ActionButton) `
  background-color: var(--accent-light);
  color: var(--accent-color);
  
  &:hover {
    background-color: var(--accent-color);
    color: white;
  }
`;
const DeleteButton = (0, styled_components_1.default)(ActionButton) `
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
  
  &:hover {
    background-color: var(--error-color);
    color: white;
  }
`;
const CompleteButton = (0, styled_components_1.default)(ActionButton) `
  background-color: ${props => props.completed ? 'rgba(76, 175, 80, 0.1)' : 'var(--background-secondary)'};
  color: ${props => props.completed ? 'var(--success-color)' : 'var(--text-secondary)'};
  
  &:hover {
    background-color: ${props => props.completed ? 'var(--success-color)' : 'var(--accent-light)'};
    color: ${props => props.completed ? 'white' : 'var(--accent-color)'};
  }
`;
const TaskDescription = styled_components_1.default.div `
  margin-bottom: 2rem;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
  
  p {
    margin: 0 0 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;
const TaskMeta = styled_components_1.default.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;
const MetaItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  
  svg {
    color: var(--accent-color);
    margin-right: 0.8rem;
  }
`;
const MetaLabel = styled_components_1.default.span `
  color: var(--text-secondary);
  margin-right: 0.5rem;
`;
const MetaValue = styled_components_1.default.span `
  color: var(--text-primary);
  font-weight: 500;
`;
const Badge = styled_components_1.default.span `
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.variant) {
        case 'alta':
            return 'rgba(244, 67, 54, 0.15)';
        case 'média':
            return 'rgba(255, 152, 0, 0.15)';
        case 'baixa':
            return 'rgba(76, 175, 80, 0.15)';
        default:
            return 'var(--accent-light)';
    }
}};
  color: ${props => {
    switch (props.variant) {
        case 'alta':
            return 'var(--error-color)';
        case 'média':
            return 'var(--warning-color)';
        case 'baixa':
            return 'var(--success-color)';
        default:
            return 'var(--accent-color)';
    }
}};
`;
const CompletionStatus = styled_components_1.default.div `
  padding: 0.8rem;
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: 500;
  margin-bottom: 2rem;
  background-color: ${props => props.completed ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)'};
  color: ${props => props.completed ? 'var(--success-color)' : 'var(--error-color)'};
`;
const SubtasksContainer = styled_components_1.default.div `
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;
const SubtasksHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--background-secondary);
  cursor: pointer;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: var(--accent-color);
    }
  }
`;
const SubtasksList = styled_components_1.default.div `
  padding: 1rem 1.5rem;
`;
const SubtaskItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--border-color);
  opacity: ${props => props.completed ? 0.7 : 1};
  
  span {
    flex: 1;
    margin: 0 0.8rem;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;
const SubtaskCheckbox = styled_components_1.default.div `
  width: 1.4rem;
  height: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--success-color);
`;
const SubtaskDeleteButton = styled_components_1.default.button `
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;
const ProjectBadge = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent-light);
  border-radius: var(--radius-md);
  color: var(--accent-dark);
  width: fit-content;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: var(--accent-color);
    color: white;
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;
const OverdueIndicator = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.8rem 1.2rem;
  background-color: var(--error-light);
  color: var(--error-color);
  font-weight: 600;
  border-radius: var(--radius-md);
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: 576px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
`;
const TaskDateMeta = (0, styled_components_1.default)(MetaItem) `
  ${props => props.isOverdue && `
    svg, ${MetaLabel}, ${MetaValue} {
      color: var(--error-color);
    }
    
    ${MetaValue} {
      font-weight: bold;
    }
  `}
`;
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    catch (error) {
        console.error("Erro ao formatar data:", error);
        return dateString;
    }
};
const TaskDetailPage = () => {
    const { id } = (0, react_router_dom_1.useParams)();
    const { todos, updateTodo, deleteTodo, toggleTodoCompletion, toggleSubtaskCompletion, deleteSubtask } = (0, TodoContext_1.useTodo)();
    const { projects, setActiveProjectId } = (0, ProjectContext_1.useProject)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [showSubtasks, setShowSubtasks] = (0, react_1.useState)(true);
    // Encontrar a tarefa pelo ID
    const todo = todos.find(todo => todo.id === id);
    // Encontrar o projeto associado à tarefa
    const associatedProject = (todo === null || todo === void 0 ? void 0 : todo.projectId) ? projects.find(project => project.id === todo.projectId) : null;
    // Verificar se a tarefa está em atraso
    const isOverdue = (0, react_1.useCallback)(() => {
        if (!todo || !todo.date || todo.completed)
            return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo.date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }, [todo]);
    // Calcular dias de atraso ou dias restantes
    const getDaysUntilDue = (0, react_1.useCallback)(() => {
        if (!todo || !todo.date)
            return '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo.date);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0)
            return `Atrasado por ${Math.abs(diffDays)} dia(s)`;
        if (diffDays === 0)
            return 'Vence hoje';
        return `${diffDays} dia(s) restante(s)`;
    }, [todo]);
    // Redirecionar para a página inicial se a tarefa não for encontrada
    (0, react_1.useEffect)(() => {
        if (!todo && todos.length > 0) {
            navigate('/');
        }
    }, [todo, todos, navigate]);
    // Função para navegar para o quadro Kanban do projeto
    const navigateToKanban = () => {
        if (todo === null || todo === void 0 ? void 0 : todo.projectId) {
            setActiveProjectId(todo.projectId);
            navigate('/kanban');
        }
    };
    if (!todo) {
        return ((0, jsx_runtime_1.jsxs)(TaskDetailContainer, { children: [(0, jsx_runtime_1.jsxs)(BackButton, { onClick: () => navigate('/'), children: [(0, jsx_runtime_1.jsx)(fa_1.FaArrowLeft, {}), " Voltar"] }), (0, jsx_runtime_1.jsx)("p", { children: "Tarefa n\u00E3o encontrada" })] }));
    }
    const handleDeleteTodo = () => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            deleteTodo(todo.id);
            navigate('/');
        }
    };
    const handleToggleComplete = () => {
        toggleTodoCompletion(todo.id);
    };
    const completedSubtasks = todo.subtasks.filter(subtask => subtask.completed).length;
    const totalSubtasks = todo.subtasks.length;
    if (isEditing) {
        return ((0, jsx_runtime_1.jsxs)(TaskDetailContainer, { children: [(0, jsx_runtime_1.jsxs)(BackButton, { onClick: () => setIsEditing(false), children: [(0, jsx_runtime_1.jsx)(fa_1.FaArrowLeft, {}), " Cancelar edi\u00E7\u00E3o"] }), (0, jsx_runtime_1.jsx)(TodoForm_1.default, { editTodo: todo, onCancel: () => setIsEditing(false) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(TaskDetailContainer, { children: [(0, jsx_runtime_1.jsxs)(BackButton, { onClick: () => navigate(-1), children: [(0, jsx_runtime_1.jsx)(fa_1.FaArrowLeft, {}), " Voltar"] }), (0, jsx_runtime_1.jsxs)(TaskCard, { children: [(0, jsx_runtime_1.jsxs)(TaskHeader, { children: [(0, jsx_runtime_1.jsx)(TaskTitle, { children: todo.title }), (0, jsx_runtime_1.jsxs)(TaskActions, { children: [(0, jsx_runtime_1.jsx)(CompleteButton, { completed: todo.completed, onClick: handleToggleComplete, title: todo.completed ? 'Marcar como pendente' : 'Marcar como concluída', children: todo.completed ? (0, jsx_runtime_1.jsx)(fa_1.FaCheck, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaTimes, {}) }), (0, jsx_runtime_1.jsx)(EditButton, { onClick: () => setIsEditing(true), title: "Editar tarefa", children: (0, jsx_runtime_1.jsx)(fa_1.FaEdit, {}) }), (0, jsx_runtime_1.jsx)(DeleteButton, { onClick: handleDeleteTodo, title: "Excluir tarefa", children: (0, jsx_runtime_1.jsx)(fa_1.FaTrash, {}) })] })] }), (0, jsx_runtime_1.jsx)(CompletionStatus, { completed: todo.completed, children: todo.completed ? 'Tarefa Concluída' : 'Tarefa Pendente' }), isOverdue() && !todo.completed && ((0, jsx_runtime_1.jsxs)(OverdueIndicator, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaExclamationTriangle, {}), (0, jsx_runtime_1.jsx)("span", { children: getDaysUntilDue() })] })), todo.description && ((0, jsx_runtime_1.jsx)(TaskDescription, { children: (0, jsx_runtime_1.jsx)("p", { children: todo.description }) })), (0, jsx_runtime_1.jsxs)(TaskMeta, { children: [(0, jsx_runtime_1.jsxs)(TaskDateMeta, { isOverdue: isOverdue(), children: [(0, jsx_runtime_1.jsx)(fa_1.FaCalendarAlt, {}), (0, jsx_runtime_1.jsx)(MetaLabel, { children: "Data:" }), (0, jsx_runtime_1.jsx)(MetaValue, { children: formatDate(todo.date) })] }), (0, jsx_runtime_1.jsxs)(MetaItem, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaClock, {}), (0, jsx_runtime_1.jsx)(MetaLabel, { children: "Criada em:" }), (0, jsx_runtime_1.jsx)(MetaValue, { children: formatDate(todo.createdAt) })] }), (0, jsx_runtime_1.jsxs)(MetaItem, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaFlag, {}), (0, jsx_runtime_1.jsx)(MetaLabel, { children: "Prioridade:" }), (0, jsx_runtime_1.jsx)(MetaValue, { children: (0, jsx_runtime_1.jsx)(Badge, { variant: todo.priority, children: todo.priority }) })] }), todo.category && ((0, jsx_runtime_1.jsxs)(MetaItem, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTag, {}), (0, jsx_runtime_1.jsx)(MetaLabel, { children: "Categoria:" }), (0, jsx_runtime_1.jsx)(MetaValue, { children: (0, jsx_runtime_1.jsx)(Badge, { variant: "category", children: todo.category }) })] }))] }), associatedProject && ((0, jsx_runtime_1.jsxs)(ProjectBadge, { onClick: navigateToKanban, children: [(0, jsx_runtime_1.jsx)(fa_1.FaProjectDiagram, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Projeto:" }), " ", associatedProject.name] }), (0, jsx_runtime_1.jsx)(fa_1.FaColumns, { style: { marginLeft: 'auto' } }), (0, jsx_runtime_1.jsx)("span", { children: "Ver no Kanban" })] })), todo.subtasks && todo.subtasks.length > 0 && ((0, jsx_runtime_1.jsxs)(SubtasksContainer, { children: [(0, jsx_runtime_1.jsxs)(SubtasksHeader, { onClick: () => setShowSubtasks(!showSubtasks), children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTasks, {}), "Subtarefas (", completedSubtasks, "/", totalSubtasks, ")"] }), showSubtasks ? (0, jsx_runtime_1.jsx)(fa_1.FaChevronUp, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaChevronDown, {})] }), showSubtasks && ((0, jsx_runtime_1.jsx)(SubtasksList, { children: todo.subtasks.map(subtask => ((0, jsx_runtime_1.jsxs)(SubtaskItem, { completed: subtask.completed, children: [(0, jsx_runtime_1.jsx)(SubtaskCheckbox, { onClick: () => toggleSubtaskCompletion(todo.id, subtask.id), children: subtask.completed ? (0, jsx_runtime_1.jsx)(fa_1.FaCheck, {}) : (0, jsx_runtime_1.jsx)("div", { style: { width: '1em', height: '1em', border: '1px solid var(--accent-color)', borderRadius: '50%' } }) }), (0, jsx_runtime_1.jsx)("span", { children: subtask.title }), (0, jsx_runtime_1.jsx)(SubtaskDeleteButton, { onClick: () => deleteSubtask(todo.id, subtask.id), title: "Excluir subtarefa", children: (0, jsx_runtime_1.jsx)(fa_1.FaTrash, { size: 14 }) })] }, subtask.id))) }))] }))] })] }));
};
exports.default = TaskDetailPage;
