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
const TodoForm_1 = __importDefault(require("./TodoForm"));
const TodoContainer = styled_components_1.default.div `
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.2rem;
  margin-bottom: 0.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal), 
              opacity var(--transition-normal), border-left-color var(--transition-normal);
  animation: slideUp var(--transition-normal);
  border-left: 4px solid ${props => {
    switch (props.priority) {
        case 'alta': return 'var(--error-color)';
        case 'média': return 'var(--warning-color)';
        case 'baixa':
        default: return 'var(--success-color)';
    }
}};
  
  ${props => props.isCompleting && `
    animation: completeTodo 0.5s ease-in-out;
  `}
  
  ${props => props.isDeleting && `
    animation: deleteTodo 0.3s ease-in-out forwards;
  `}
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @keyframes completeTodo {
    0% {
      background-color: var(--card-background);
    }
    50% {
      background-color: var(--success-color);
      opacity: 0.8;
    }
    100% {
      background-color: var(--card-background);
    }
  }
  
  @keyframes deleteTodo {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(100px);
      opacity: 0;
    }
  }
`;
const TodoHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
const TodoTitleWrapper = styled_components_1.default.div `
  flex: 1;
  margin-right: 1rem;
  
  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 0.8rem;
    width: 100%;
  }
`;
const TodoTitle = styled_components_1.default.h3 `
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
  word-break: break-word;
  transition: opacity var(--transition-fast), color var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    color: var(--accent-color);
  }
`;
const TodoDescription = styled_components_1.default.p `
  margin: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 1rem;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
  line-height: 1.5;
  transition: opacity var(--transition-fast);
`;
const TodoMeta = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
  font-size: 0.85rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;
const TodoMetaItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  gap: 0.3rem;
  
  svg {
    color: var(--accent-color);
    font-size: 0.9rem;
  }
`;
const CategoryBadge = styled_components_1.default.span `
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--accent-color);
  color: white;
  gap: 0.3rem;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-light);
  }
`;
const PriorityBadge = styled_components_1.default.span `
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  gap: 0.3rem;
  background-color: ${(props) => {
    switch (props.priority) {
        case 'alta':
            return 'rgba(244, 67, 54, 0.15)';
        case 'média':
            return 'rgba(255, 152, 0, 0.15)';
        case 'baixa':
        default:
            return 'rgba(76, 175, 80, 0.15)';
    }
}};
  color: ${(props) => {
    switch (props.priority) {
        case 'alta':
            return 'var(--error-color)';
        case 'média':
            return 'var(--warning-color)';
        case 'baixa':
        default:
            return 'var(--success-color)';
    }
}};
`;
const ProjectBadge = styled_components_1.default.span `
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--accent-light);
  color: var(--accent-dark);
  gap: 0.3rem;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-color);
    color: white;
    
    .project-status {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      
      .status-icon {
        color: white;
      }
    }
  }
  
  .project-status {
    display: inline-flex;
    align-items: center;
    margin-left: 0.3rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-left: 1px solid var(--border-color);
    background-color: var(--background-primary);
    color: var(--text-primary);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    margin-right: -0.4rem;
    font-weight: 700;
    position: relative;
    box-shadow: inset 1px 0 3px rgba(0, 0, 0, 0.05);
    
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background-color: var(--border-color);
      border-radius: 1px;
    }
    
    svg {
      margin-right: 0.3rem;
      color: var(--text-primary);
    }
    
    .status-icon {
      color: var(--text-secondary);
      transition: color var(--transition-fast);
    }
  }
`;
const ActionButtons = styled_components_1.default.div `
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
  }
`;
const ActionButton = styled_components_1.default.button `
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  padding: 0.4rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    background-color: var(--hover-background);
    color: var(--text-primary);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;
const CheckButton = styled_components_1.default.button `
  background-color: ${props => props.completed ? 'var(--success-color)' : 'transparent'};
  color: ${props => props.completed ? 'white' : 'var(--text-secondary)'};
  border: ${props => props.completed ? 'none' : '2px solid var(--border-color)'};
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.completed ? 'var(--success-color)' : 'var(--hover-background)'};
    border-color: var(--accent-color);
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.3);
  }
`;
const EditButton = (0, styled_components_1.default)(ActionButton) `
  &:hover {
    color: var(--accent-color);
  }
`;
const DeleteButton = (0, styled_components_1.default)(ActionButton) `
  &:hover {
    color: var(--error-color);
  }
`;
const CompletionStatus = styled_components_1.default.div `
  margin-top: 1rem;
  display: flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => props.completed ? 'rgba(76, 175, 80, 0.1)' : 'rgba(79, 134, 247, 0.1)'};
  color: ${props => props.completed ? 'var(--success-color)' : 'var(--accent-color)'};
  width: fit-content;
`;
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    catch (error) {
        return 'Data inválida';
    }
};
// Calcular quanto tempo faz desde a criação
const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    if (diffInSeconds < minute) {
        return 'agora mesmo';
    }
    else if (diffInSeconds < hour) {
        const minutes = Math.floor(diffInSeconds / minute);
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
    }
    else if (diffInSeconds < day) {
        const hours = Math.floor(diffInSeconds / hour);
        return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    }
    else if (diffInSeconds < week) {
        const days = Math.floor(diffInSeconds / day);
        return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    }
    else if (diffInSeconds < month) {
        const weeks = Math.floor(diffInSeconds / week);
        return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
    }
    else {
        return formatDate(dateString);
    }
};
const SubtasksContainer = styled_components_1.default.div `
  margin-top: 1rem;
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
`;
const SubtasksList = styled_components_1.default.ul `
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
`;
const SubtaskItem = styled_components_1.default.li `
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
  
  span {
    flex: 1;
    margin-left: 0.5rem;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    color: ${props => props.completed ? 'var(--text-tertiary)' : 'var(--text-primary)'};
  }
`;
const SubtaskCheckbox = styled_components_1.default.button `
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast), color var(--transition-fast);
  
  &:hover {
    transform: scale(1.2);
  }
`;
const SubtaskDeleteButton = styled_components_1.default.button `
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 0.2rem;
  opacity: 0.7;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;
const AddSubtaskForm = styled_components_1.default.form `
  display: flex;
  margin-top: 0.5rem;
  
  input {
    flex: 1;
    padding: 0.5rem;
    border-radius: var(--radius-md) 0 0 var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.9rem;
  }
  
  button {
    padding: 0.5rem 0.8rem;
    border: none;
    background-color: var(--accent-color);
    color: white;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    cursor: pointer;
    transition: background-color var(--transition-fast);
    
    &:hover {
      background-color: var(--accent-color-hover);
    }
  }
`;
const SubtasksHeader = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  
  h4 {
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: var(--text-secondary);
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;
const SubtaskStats = styled_components_1.default.span `
  font-size: 0.85rem;
  color: var(--text-tertiary);
`;
const DueDateItem = (0, styled_components_1.default)(TodoMetaItem) `
  ${props => props.isOverdue && `
    color: var(--error-color);
    font-weight: bold;
    
    svg {
      color: var(--error-color);
    }
  `}
`;
const OverdueIndicator = styled_components_1.default.div `
  display: flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  background-color: var(--error-light);
  color: var(--error-color);
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
  margin-top: 0.8rem;
  
  svg {
    margin-right: 0.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.6rem;
  }
`;
const TodoItem = ({ todo }) => {
    const { toggleTodoCompletion, deleteTodo, updateTodo, addSubtask, toggleSubtaskCompletion, deleteSubtask } = (0, TodoContext_1.useTodo)();
    const { projects } = (0, ProjectContext_1.useProject)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [isCompleting, setIsCompleting] = (0, react_1.useState)(false);
    const [isDeleting, setIsDeleting] = (0, react_1.useState)(false);
    const itemRef = (0, react_1.useRef)(null);
    const [showSubtasks, setShowSubtasks] = (0, react_1.useState)(false);
    const [newSubtask, setNewSubtask] = (0, react_1.useState)('');
    // Encontrar o projeto associado à tarefa
    const associatedProject = todo.projectId ? projects.find(project => project.id === todo.projectId) : null;
    // Encontrar a coluna (andamento) atual da tarefa
    const currentColumn = associatedProject && todo.columnId
        ? associatedProject.columns.find(column => column.id === todo.columnId)
        : null;
    // Verificar se a tarefa está em atraso
    const isOverdue = (0, react_1.useCallback)(() => {
        if (todo.completed)
            return false; // Tarefas concluídas não estão em atraso
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo.date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }, [todo.date, todo.completed]);
    // Calcular dias de atraso ou dias restantes
    const getDaysUntilDue = (0, react_1.useCallback)(() => {
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
    }, [todo.date]);
    // Efeito para animar quando a tarefa é completada
    (0, react_1.useEffect)(() => {
        if (isCompleting) {
            const timer = setTimeout(() => {
                setIsCompleting(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isCompleting]);
    // Memoizando os handlers com useCallback
    const handleToggleComplete = (0, react_1.useCallback)(() => {
        setIsCompleting(true);
        // Atraso para permitir que a animação seja vista antes da atualização do estado
        setTimeout(() => {
            toggleTodoCompletion(todo.id);
        }, 300);
    }, [toggleTodoCompletion, todo.id]);
    const handleDelete = (0, react_1.useCallback)(() => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            setIsDeleting(true);
            // Atraso para permitir que a animação seja vista antes da remoção
            setTimeout(() => {
                deleteTodo(todo.id);
            }, 300);
        }
    }, [deleteTodo, todo.id]);
    const handleSetEditing = (0, react_1.useCallback)((value) => {
        setIsEditing(value);
    }, []);
    // Navegação por teclado
    const handleKeyDown = (0, react_1.useCallback)((e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    }, []);
    const handleSubtaskToggle = (0, react_1.useCallback)((subtaskId) => {
        toggleSubtaskCompletion(todo.id, subtaskId);
    }, [todo.id, toggleSubtaskCompletion]);
    const handleSubtaskDelete = (0, react_1.useCallback)((subtaskId) => {
        deleteSubtask(todo.id, subtaskId);
    }, [todo.id, deleteSubtask]);
    const handleAddSubtask = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        if (newSubtask.trim()) {
            addSubtask(todo.id, newSubtask);
            setNewSubtask('');
        }
    }, [todo.id, newSubtask, addSubtask]);
    const completedSubtasks = todo.subtasks.filter(subtask => subtask.completed).length;
    const totalSubtasks = todo.subtasks.length;
    const handleTitleClick = (0, react_1.useCallback)(() => {
        navigate(`/tarefa/${todo.id}`);
    }, [navigate, todo.id]);
    if (isEditing) {
        return (0, jsx_runtime_1.jsx)(TodoForm_1.default, { editTodo: todo, onCancel: () => handleSetEditing(false) });
    }
    return ((0, jsx_runtime_1.jsxs)(TodoContainer, { priority: todo.priority, isCompleting: isCompleting, isDeleting: isDeleting, ref: itemRef, role: "article", "aria-label": `Tarefa: ${todo.title}`, children: [(0, jsx_runtime_1.jsxs)(TodoHeader, { children: [(0, jsx_runtime_1.jsx)(TodoTitleWrapper, { children: (0, jsx_runtime_1.jsx)(TodoTitle, { completed: todo.completed, "aria-checked": todo.completed, onClick: handleTitleClick, onKeyDown: (e) => handleKeyDown(e, handleTitleClick), tabIndex: 0, role: "button", children: todo.title }) }), (0, jsx_runtime_1.jsxs)(ActionButtons, { children: [(0, jsx_runtime_1.jsx)(CheckButton, { completed: todo.completed, onClick: handleToggleComplete, title: todo.completed ? 'Marcar como pendente' : 'Marcar como concluída', "aria-label": todo.completed ? 'Marcar como pendente' : 'Marcar como concluída', role: "checkbox", "aria-checked": todo.completed, onKeyDown: (e) => handleKeyDown(e, handleToggleComplete), tabIndex: 0, children: (0, jsx_runtime_1.jsx)(fa_1.FaCheck, {}) }), (0, jsx_runtime_1.jsx)(EditButton, { onClick: () => handleSetEditing(true), title: "Editar tarefa", "aria-label": "Editar tarefa", onKeyDown: (e) => handleKeyDown(e, () => handleSetEditing(true)), tabIndex: 0, children: (0, jsx_runtime_1.jsx)(fa_1.FaEdit, {}) }), (0, jsx_runtime_1.jsx)(DeleteButton, { onClick: handleDelete, title: "Excluir tarefa", "aria-label": "Excluir tarefa", onKeyDown: (e) => handleKeyDown(e, handleDelete), tabIndex: 0, children: (0, jsx_runtime_1.jsx)(fa_1.FaTrash, {}) })] })] }), todo.description && ((0, jsx_runtime_1.jsx)(TodoDescription, { completed: todo.completed, children: todo.description })), (0, jsx_runtime_1.jsxs)(TodoMeta, { children: [todo.date && ((0, jsx_runtime_1.jsxs)(DueDateItem, { isOverdue: isOverdue(), children: [(0, jsx_runtime_1.jsx)(fa_1.FaRegCalendarAlt, { "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { children: formatDate(todo.date) })] })), (0, jsx_runtime_1.jsxs)(TodoMetaItem, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaClock, { "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Criado ", getTimeAgo(todo.createdAt)] })] }), (0, jsx_runtime_1.jsx)(TodoMetaItem, { children: (0, jsx_runtime_1.jsx)(PriorityBadge, { priority: todo.priority, children: todo.priority }) }), todo.category && ((0, jsx_runtime_1.jsx)(TodoMetaItem, { children: (0, jsx_runtime_1.jsxs)(CategoryBadge, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTag, { size: 10, "aria-hidden": "true" }), todo.category] }) })), associatedProject && ((0, jsx_runtime_1.jsx)(TodoMetaItem, { children: (0, jsx_runtime_1.jsxs)(ProjectBadge, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaProjectDiagram, { size: 10, "aria-hidden": "true" }), associatedProject.name] }), currentColumn && ((0, jsx_runtime_1.jsxs)("div", { className: "project-status", children: [(0, jsx_runtime_1.jsx)(fa_1.FaColumns, { size: 12, "aria-hidden": "true", className: `status-icon ${currentColumn.id}`, style: {
                                                color: currentColumn.id === 'done' ? 'var(--success-color)' :
                                                    currentColumn.id === 'in-progress' ? 'var(--accent-color)' :
                                                        currentColumn.id === 'review' ? 'var(--warning-color)' : 'var(--text-secondary)'
                                            } }), currentColumn.title] }))] }) }))] }), isOverdue() && !todo.completed && ((0, jsx_runtime_1.jsxs)(OverdueIndicator, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaExclamationTriangle, { "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { children: getDaysUntilDue() })] })), (0, jsx_runtime_1.jsx)(CompletionStatus, { completed: todo.completed, "aria-live": "polite", children: todo.completed ? 'Tarefa concluída' : 'Tarefa pendente' }), todo.subtasks && todo.subtasks.length > 0 ? ((0, jsx_runtime_1.jsxs)(SubtasksContainer, { children: [(0, jsx_runtime_1.jsxs)(SubtasksHeader, { onClick: () => setShowSubtasks(!showSubtasks), children: [(0, jsx_runtime_1.jsxs)("h4", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTasks, {}), "Subtarefas (", completedSubtasks, "/", totalSubtasks, ")"] }), showSubtasks ? (0, jsx_runtime_1.jsx)(fa_1.FaChevronUp, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaChevronDown, {})] }), showSubtasks && ((0, jsx_runtime_1.jsx)(SubtasksList, { children: todo.subtasks.map(subtask => ((0, jsx_runtime_1.jsxs)(SubtaskItem, { completed: subtask.completed, children: [(0, jsx_runtime_1.jsx)(SubtaskCheckbox, { onClick: () => handleSubtaskToggle(subtask.id), "aria-label": subtask.completed ? "Marcar como pendente" : "Marcar como concluída", children: subtask.completed ? (0, jsx_runtime_1.jsx)(fa_1.FaCheck, {}) : (0, jsx_runtime_1.jsx)("div", { style: { width: '1em', height: '1em', border: '1px solid var(--accent-color)', borderRadius: '50%' } }) }), (0, jsx_runtime_1.jsx)("span", { children: subtask.title }), (0, jsx_runtime_1.jsx)(SubtaskDeleteButton, { onClick: () => handleSubtaskDelete(subtask.id), "aria-label": "Excluir subtarefa", children: (0, jsx_runtime_1.jsx)(fa_1.FaTrash, { size: 12 }) })] }, subtask.id))) }))] })) : null, (0, jsx_runtime_1.jsxs)(AddSubtaskForm, { onSubmit: handleAddSubtask, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Adicionar subtarefa...", value: newSubtask, onChange: (e) => setNewSubtask(e.target.value) }), (0, jsx_runtime_1.jsx)("button", { type: "submit", "aria-label": "Adicionar subtarefa", children: (0, jsx_runtime_1.jsx)(fa_1.FaPlus, {}) })] })] }));
};
// Exportando com memo para evitar re-renderizações desnecessárias
exports.default = (0, react_1.memo)(TodoItem);
