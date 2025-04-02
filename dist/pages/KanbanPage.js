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
const react_router_dom_1 = require("react-router-dom");
const fa_1 = require("react-icons/fa");
const TodoContext_1 = require("../contexts/TodoContext");
const ProjectContext_1 = require("../contexts/ProjectContext");
const KanbanBoard_1 = __importDefault(require("../components/kanban/KanbanBoard"));
const KanbanColumn_1 = __importDefault(require("../components/kanban/KanbanColumn"));
const KanbanCard_1 = __importDefault(require("../components/kanban/KanbanCard"));
const ProjectSelector_1 = __importDefault(require("../components/kanban/ProjectSelector"));
const CreateProjectModal_1 = __importDefault(require("../components/kanban/CreateProjectModal"));
const EditProjectModal_1 = __importDefault(require("../components/kanban/EditProjectModal"));
const CreateColumnModal_1 = __importDefault(require("../components/kanban/CreateColumnModal"));
const KanbanFilters_1 = __importDefault(require("../components/kanban/KanbanFilters"));
const KanbanMetrics_1 = __importDefault(require("../components/kanban/KanbanMetrics"));
// Styled Components
const KanbanPageContainer = styled_components_1.default.div `
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem 1.5rem;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  
  @media (min-width: 1200px) {
    max-width: 1600px;
    padding: 0 1.5rem 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0 0.75rem 1rem;
    height: auto;
  }
  
  @media (max-width: 480px) {
    padding: 0 0.5rem 0.8rem;
  }
`;
const PageHeader = styled_components_1.default.header `
  margin-bottom: 1.5rem;
  background: var(--background-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    border-radius: 8px;
  }
`;
const TopBar = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: nowrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }
`;
const TopBarLeft = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
`;
const Title = styled_components_1.default.h1 `
  color: var(--text-primary);
  font-size: 2.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--accent-color);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    
    &::after {
      bottom: -6px;
      width: 30px;
      height: 2px;
    }
  }
`;
const TitleIcon = (0, styled_components_1.default)(fa_1.FaColumns) `
  color: var(--accent-color);
`;
const ActionsContainer = styled_components_1.default.div `
  display: flex;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    
    > button {
      flex: 1;
      min-width: calc(50% - 0.25rem);
      justify-content: center;
      padding: 0.6rem 0.4rem;
      font-size: 0.8rem;
    }
  }
`;
const ActionButton = styled_components_1.default.button `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--accent-color);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  
  &:hover {
    background-color: var(--accent-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
    svg {
      margin-right: 0.3rem;
    }
  }
`;
const SecondaryButton = (0, styled_components_1.default)(ActionButton) `
  background-color: var(--background-secondary);
  color: var(--text-primary);
  
  &:hover {
    background-color: var(--hover-background);
  }
`;
const ToggleButton = (0, styled_components_1.default)(SecondaryButton) `
  background-color: ${props => props.active ? 'var(--accent-color)' : 'var(--background-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--accent-dark)' : 'var(--hover-background)'};
  }
`;
const SearchContainer = styled_components_1.default.div `
  position: relative;
  flex: 1;
  max-width: 300px;
  margin-left: 1rem;
  
  @media (max-width: 1024px) {
    max-width: 250px;
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
    max-width: 100%;
    width: 100%;
  }
`;
const SearchInput = styled_components_1.default.input `
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--background-primary);
  font-size: 0.9rem;
  width: 100%;
  color: var(--text-primary);
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.2);
  }
`;
const SearchIcon = (0, styled_components_1.default)(fa_1.FaSearch) `
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;
const ClearSearchIcon = (0, styled_components_1.default)(fa_1.FaTimes) `
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: var(--text-primary);
  }
`;
const SelectorRow = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    padding-bottom: 0.3rem;
  }
`;
const ProjectInfo = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: var(--background-primary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease-in-out;
  width: 100%;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    border-radius: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
`;
const ProjectDetails = styled_components_1.default.div `
  flex: 1;
  overflow: hidden;
`;
const ProjectName = styled_components_1.default.h2 `
  margin: 0 0 0.3rem 0;
  font-size: 1.6rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;
const ProjectDescription = styled_components_1.default.p `
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    -webkit-line-clamp: 3;
  }
`;
const ProjectActions = styled_components_1.default.div `
  display: flex;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    margin-left: auto;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
  }
`;
const StyledMore = (0, styled_components_1.default)(fa_1.FaCog) `
  cursor: pointer;
  color: var(--text-primary);
  font-size: 1.3rem;
  padding: 0.6rem;
  border-radius: 50%;
  background: var(--accent-color);
  transition: all 0.2s;
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  
  &:hover {
    color: var(--background-primary);
    background: var(--accent-light);
    transform: rotate(45deg);
    box-shadow: var(--shadow-md);
  }
  
  &:active {
    transform: rotate(90deg);
  }
`;
const KanbanContainer = styled_components_1.default.div `
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: var(--background-secondary);
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
  width: 100%;
  height: calc(100vh - 310px);
  min-height: 500px;
  
  @media (min-width: 1200px) {
    height: calc(100vh - 330px);
  }
  
  @media (max-width: 768px) {
    overflow: visible;
    border-radius: 8px;
    padding: 0.75rem;
    height: auto;
    min-height: 500px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    min-height: 450px;
    border-radius: 6px;
  }
`;
const PanelContainer = styled_components_1.default.div `
  max-height: ${props => props.show ? '300px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, margin-bottom 0.3s ease-in-out;
  margin-bottom: ${props => props.show ? '1rem' : '0'};
  border-radius: 12px;
  background: var(--background-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  
  @media (max-width: 768px) {
    max-height: ${props => props.show ? '350px' : '0'};
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    border-radius: 8px;
    max-height: ${props => props.show ? '400px' : '0'};
  }
`;
const PanelHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--background-secondary);
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  
  @media (max-width: 768px) {
    padding: 0.9rem 1.2rem;
    border-radius: 10px 10px 0 0;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    border-radius: 8px 8px 0 0;
  }
`;
const PanelTitle = styled_components_1.default.h3 `
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const PanelContent = styled_components_1.default.div `
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
  }
`;
const NoProjectMessage = styled_components_1.default.div `
  text-align: center;
  padding: 4rem 2rem;
  background: var(--background-primary);
  border-radius: 12px;
  font-size: 1.1rem;
  color: var(--text-primary);
  animation: fadeIn 0.5s ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  h3 {
    font-size: 1.8rem;
    margin: 0;
    color: var(--accent-color);
  }
  
  p {
    color: var(--text-secondary);
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  button {
    margin-top: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    
    h3 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 0.95rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
    border-radius: 8px;
    
    h3 {
      font-size: 1.3rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;
const AddColumnButton = styled_components_1.default.button `
  min-width: 280px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--background-secondary);
  color: var(--text-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: auto;
  margin-bottom: 1rem;
  font-weight: 500;
  
  &:hover {
    background-color: var(--hover-background);
    color: var(--accent-color);
    border-color: var(--accent-light);
  }
  
  @media (max-width: 768px) {
    min-width: 260px;
  }
  
  @media (max-width: 480px) {
    min-width: 85vw;
    padding: 0.8rem;
  }
`;
const FooterContainer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  width: 100%;
`;
const ScrollInstructor = styled_components_1.default.div `
  display: none;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  background-color: var(--background-primary);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    display: block;
  }
`;
const KanbanPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { todos, filteredTodos, categories } = (0, TodoContext_1.useTodo)();
    const { projects, activeProjectId, setActiveProjectId, createProject, updateProject, deleteProject, addColumn, updateColumn, deleteColumn, addTodoToProject, removeTodoFromProject, moveTodoToColumn, reorderTodoInColumn, getLeadTime, getCycleTime } = (0, ProjectContext_1.useProject)();
    // Local state
    const [showCreateProjectModal, setShowCreateProjectModal] = (0, react_1.useState)(false);
    const [showEditProjectModal, setShowEditProjectModal] = (0, react_1.useState)(false);
    const [showCreateColumnModal, setShowCreateColumnModal] = (0, react_1.useState)(false);
    const [showFilters, setShowFilters] = (0, react_1.useState)(false);
    const [showMetrics, setShowMetrics] = (0, react_1.useState)(false);
    const [priorityFilter, setPriorityFilter] = (0, react_1.useState)(null);
    const [categoryFilter, setCategoryFilter] = (0, react_1.useState)(null);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [dragOverColumnId, setDragOverColumnId] = (0, react_1.useState)(null);
    // Get current project
    const currentProject = projects.find(p => p.id === activeProjectId) || null;
    // Filter todos that belong to the current project
    const projectTodos = todos.filter(todo => todo.projectId === activeProjectId &&
        (priorityFilter ? todo.priority === priorityFilter : true) &&
        (categoryFilter ? todo.category === categoryFilter : true) &&
        (searchTerm ? todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.description.toLowerCase().includes(searchTerm.toLowerCase()) : true));
    // Group todos by column
    const todosByColumn = projectTodos.reduce((acc, todo) => {
        if (todo.columnId) {
            if (!acc[todo.columnId]) {
                acc[todo.columnId] = [];
            }
            acc[todo.columnId].push(todo);
        }
        return acc;
    }, {});
    // Sort todos in each column by order
    Object.keys(todosByColumn).forEach(columnId => {
        todosByColumn[columnId].sort((a, b) => (a.order || 0) - (b.order || 0));
    });
    // Handler for creating a new project
    const handleCreateProject = (0, react_1.useCallback)((name, description) => {
        const newProject = createProject(name, description);
        setActiveProjectId(newProject.id);
        setShowCreateProjectModal(false);
    }, [createProject, setActiveProjectId]);
    // Handler for updating a project
    const handleUpdateProject = (0, react_1.useCallback)((project) => {
        updateProject(project);
        setShowEditProjectModal(false);
    }, [updateProject]);
    // Handler for deleting a project
    const handleDeleteProject = (0, react_1.useCallback)((id) => {
        deleteProject(id);
        setShowEditProjectModal(false);
    }, [deleteProject]);
    // Handler for creating a column
    const handleCreateColumn = (0, react_1.useCallback)((title, wipLimit) => {
        if (activeProjectId) {
            addColumn(activeProjectId, title, wipLimit);
            setShowCreateColumnModal(false);
        }
    }, [activeProjectId, addColumn]);
    // Handler for dragging a task between columns
    const handleDragTask = (0, react_1.useCallback)((todoId, sourceColumnId, destinationColumnId, newIndex) => {
        var _a;
        // Check WIP limit before moving
        if (currentProject) {
            const targetColumn = currentProject.columns.find(col => col.id === destinationColumnId);
            if ((targetColumn === null || targetColumn === void 0 ? void 0 : targetColumn.wipLimit) !== undefined) {
                const currentTasksInColumn = ((_a = todosByColumn[destinationColumnId]) === null || _a === void 0 ? void 0 : _a.length) || 0;
                // If dragging to a different column and WIP limit would be exceeded
                if (sourceColumnId !== destinationColumnId && currentTasksInColumn >= targetColumn.wipLimit) {
                    alert(`WIP limit of ${targetColumn.wipLimit} reached for column "${targetColumn.title}".`);
                    return;
                }
            }
        }
        if (sourceColumnId === destinationColumnId) {
            // Reordering within the same column
            reorderTodoInColumn(todoId, newIndex);
        }
        else {
            // Moving to a different column
            moveTodoToColumn(todoId, destinationColumnId, newIndex);
        }
    }, [currentProject, todosByColumn, reorderTodoInColumn, moveTodoToColumn]);
    // Handler for adding an existing task to the project
    const handleAddTaskToProject = (0, react_1.useCallback)((todoId) => {
        if (activeProjectId && currentProject) {
            // Get the first column
            const firstColumn = currentProject.columns.sort((a, b) => a.order - b.order)[0];
            if (firstColumn) {
                addTodoToProject(activeProjectId, todoId, firstColumn.id);
            }
        }
    }, [activeProjectId, currentProject, addTodoToProject]);
    // Handler for creating a new task and adding it directly to the project
    const handleCreateNewTask = (0, react_1.useCallback)((columnId) => {
        // Navigate to the task creation page with pre-filled project and column
        if (activeProjectId) {
            navigate(`/nova-tarefa?projectId=${activeProjectId}&columnId=${columnId}`);
        }
    }, [activeProjectId, navigate]);
    // Handler for clicking on a task
    const handleTaskClick = (0, react_1.useCallback)((todoId) => {
        navigate(`/tarefa/${todoId}`);
    }, [navigate]);
    // Handler for removing a task from the project
    const handleRemoveTaskFromProject = (0, react_1.useCallback)((todoId) => {
        if (activeProjectId) {
            removeTodoFromProject(activeProjectId, todoId);
        }
    }, [activeProjectId, removeTodoFromProject]);
    const handleClearSearch = (0, react_1.useCallback)(() => {
        setSearchTerm('');
    }, []);
    // Toggle filters and metrics panels
    const toggleFilters = (0, react_1.useCallback)(() => {
        setShowFilters(!showFilters);
        if (showMetrics && !showFilters)
            setShowMetrics(false);
    }, [showFilters, showMetrics]);
    const toggleMetrics = (0, react_1.useCallback)(() => {
        setShowMetrics(!showMetrics);
        if (showFilters && !showMetrics)
            setShowFilters(false);
    }, [showFilters, showMetrics]);
    // No componente KanbanPage, adicionar essas funções para usar o drag and drop nativo
    const handleColumnDragOver = (0, react_1.useCallback)((e, columnId) => {
        e.preventDefault();
        setDragOverColumnId(columnId);
    }, []);
    const handleColumnDrop = (0, react_1.useCallback)((e, columnId) => {
        var _a;
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            console.log('Dados recebidos no drop:', data);
            if (!data || !data.todoId || !data.sourceColumnId) {
                console.error('Dados inválidos recebidos no evento de drop');
                return;
            }
            const { todoId, sourceColumnId, sourceIndex } = data;
            // Se o destino for diferente da origem, mover a tarefa para a nova coluna
            if (sourceColumnId !== columnId) {
                console.log(`Movendo tarefa ${todoId} da coluna ${sourceColumnId} para a coluna ${columnId}`);
                // Verificar limites WIP
                if (currentProject) {
                    const targetColumn = currentProject.columns.find(col => col.id === columnId);
                    if (targetColumn && targetColumn.wipLimit !== undefined) {
                        const currentTasksInColumn = ((_a = todosByColumn[columnId]) === null || _a === void 0 ? void 0 : _a.length) || 0;
                        if (currentTasksInColumn >= targetColumn.wipLimit) {
                            alert(`Limite WIP de ${targetColumn.wipLimit} atingido para a coluna "${targetColumn.title}".`);
                            return;
                        }
                    }
                }
                // Calcular a nova ordem
                const tasksInTargetColumn = todosByColumn[columnId] || [];
                const newOrder = tasksInTargetColumn.length;
                // Mover a tarefa
                moveTodoToColumn(todoId, columnId, newOrder);
            }
            else {
                // Se for na mesma coluna, pode reordenar se necessário
                // Implementar reordenação se precisar
                console.log(`Tarefa ${todoId} mantida na mesma coluna ${columnId}`);
            }
        }
        catch (error) {
            console.error('Erro ao processar o evento de drop:', error);
        }
        finally {
            setDragOverColumnId(null);
        }
    }, [currentProject, todosByColumn, moveTodoToColumn]);
    // Render project creation message when no projects exist
    if (projects.length === 0) {
        return ((0, jsx_runtime_1.jsxs)(KanbanPageContainer, { children: [(0, jsx_runtime_1.jsx)(PageHeader, { children: (0, jsx_runtime_1.jsx)(TopBar, { children: (0, jsx_runtime_1.jsxs)(Title, { children: [(0, jsx_runtime_1.jsx)(TitleIcon, {}), " Kanban Board"] }) }) }), (0, jsx_runtime_1.jsxs)(NoProjectMessage, { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Bem-vindo ao Kanban!" }), (0, jsx_runtime_1.jsx)("p", { children: "O m\u00E9todo Kanban ajuda voc\u00EA a visualizar seu trabalho, limitar o trabalho em progresso e maximizar a efici\u00EAncia. Crie seu primeiro projeto para come\u00E7ar a organizar suas tarefas de forma visual." }), (0, jsx_runtime_1.jsxs)(ActionButton, { onClick: () => setShowCreateProjectModal(true), children: [(0, jsx_runtime_1.jsx)(fa_1.FaPlus, {}), "Criar novo projeto"] })] }), showCreateProjectModal && ((0, jsx_runtime_1.jsx)(CreateProjectModal_1.default, { onClose: () => setShowCreateProjectModal(false), onCreateProject: handleCreateProject }))] }));
    }
    return ((0, jsx_runtime_1.jsxs)(KanbanPageContainer, { children: [(0, jsx_runtime_1.jsxs)(PageHeader, { children: [(0, jsx_runtime_1.jsxs)(TopBar, { children: [(0, jsx_runtime_1.jsxs)(TopBarLeft, { children: [(0, jsx_runtime_1.jsxs)(Title, { children: [(0, jsx_runtime_1.jsx)(TitleIcon, {}), " Kanban"] }), (0, jsx_runtime_1.jsxs)(SearchContainer, { children: [(0, jsx_runtime_1.jsx)(SearchInput, { value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Buscar tarefas...", "aria-label": "Buscar tarefas" }), (0, jsx_runtime_1.jsx)(SearchIcon, {}), searchTerm && (0, jsx_runtime_1.jsx)(ClearSearchIcon, { onClick: handleClearSearch })] })] }), (0, jsx_runtime_1.jsxs)(ActionsContainer, { children: [(0, jsx_runtime_1.jsxs)(ToggleButton, { active: showFilters, onClick: toggleFilters, "aria-label": "Mostrar filtros", "aria-pressed": showFilters, children: [(0, jsx_runtime_1.jsx)(fa_1.FaFilter, {}), "Filtros"] }), (0, jsx_runtime_1.jsxs)(ToggleButton, { active: showMetrics, onClick: toggleMetrics, "aria-label": "Mostrar m\u00E9tricas", "aria-pressed": showMetrics, children: [(0, jsx_runtime_1.jsx)(fa_1.FaInfoCircle, {}), "M\u00E9tricas"] }), (0, jsx_runtime_1.jsxs)(ActionButton, { onClick: () => setShowCreateProjectModal(true), children: [(0, jsx_runtime_1.jsx)(fa_1.FaPlus, {}), "Novo Projeto"] })] })] }), (0, jsx_runtime_1.jsx)(SelectorRow, { children: (0, jsx_runtime_1.jsx)(ProjectSelector_1.default, { projects: projects, activeProjectId: activeProjectId, onSelectProject: setActiveProjectId }) })] }), currentProject ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(ProjectInfo, { children: [(0, jsx_runtime_1.jsxs)(ProjectDetails, { children: [(0, jsx_runtime_1.jsx)(ProjectName, { children: currentProject.name }), (0, jsx_runtime_1.jsx)(ProjectDescription, { children: currentProject.description })] }), (0, jsx_runtime_1.jsx)(ProjectActions, { children: (0, jsx_runtime_1.jsx)(StyledMore, { onClick: () => setShowEditProjectModal(true), title: "Configura\u00E7\u00F5es do projeto" }) })] }), (0, jsx_runtime_1.jsxs)(PanelContainer, { show: showFilters, children: [(0, jsx_runtime_1.jsxs)(PanelHeader, { onClick: toggleFilters, children: [(0, jsx_runtime_1.jsxs)(PanelTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaFilter, {}), " Filtros"] }), showFilters ? (0, jsx_runtime_1.jsx)(fa_1.FaChevronUp, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaChevronDown, {})] }), showFilters && ((0, jsx_runtime_1.jsx)(PanelContent, { children: (0, jsx_runtime_1.jsx)(KanbanFilters_1.default, { priorityFilter: priorityFilter, categoryFilter: categoryFilter, onChangePriority: setPriorityFilter, onChangeCategory: setCategoryFilter, categories: categories }) }))] }), (0, jsx_runtime_1.jsxs)(PanelContainer, { show: showMetrics, children: [(0, jsx_runtime_1.jsxs)(PanelHeader, { onClick: toggleMetrics, children: [(0, jsx_runtime_1.jsxs)(PanelTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaInfoCircle, {}), " M\u00E9tricas"] }), showMetrics ? (0, jsx_runtime_1.jsx)(fa_1.FaChevronUp, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaChevronDown, {})] }), showMetrics && ((0, jsx_runtime_1.jsx)(PanelContent, { children: (0, jsx_runtime_1.jsx)(KanbanMetrics_1.default, { project: currentProject, todos: projectTodos, getLeadTime: getLeadTime, getCycleTime: getCycleTime }) }))] }), (0, jsx_runtime_1.jsx)(ScrollInstructor, { children: "Deslize para visualizar todas as colunas" }), (0, jsx_runtime_1.jsxs)(KanbanContainer, { children: [(0, jsx_runtime_1.jsx)(KanbanBoard_1.default, { children: currentProject === null || currentProject === void 0 ? void 0 : currentProject.columns.sort((a, b) => a.order - b.order).map(column => {
                                    const columnTasks = todosByColumn[column.id] || [];
                                    return ((0, jsx_runtime_1.jsx)(KanbanColumn_1.default, { id: column.id, title: column.title, wipLimit: column.wipLimit, tasksCount: columnTasks.length, onAddCard: () => handleCreateNewTask(column.id), onDeleteColumn: () => {
                                            if (window.confirm(`Tem certeza que deseja excluir a coluna "${column.title}"? Todas as tarefas nesta coluna serão removidas do projeto.`)) {
                                                if (activeProjectId) {
                                                    deleteColumn(activeProjectId, column.id);
                                                }
                                            }
                                        }, onDragOver: (e) => handleColumnDragOver(e, column.id), onDrop: (e) => handleColumnDrop(e, column.id), children: columnTasks.map((todo, index) => ((0, jsx_runtime_1.jsx)(KanbanCard_1.default, { todo: todo, index: index, onClick: () => handleTaskClick(todo.id), onRemove: () => handleRemoveTaskFromProject(todo.id) }, todo.id))) }, column.id));
                                }) }), (0, jsx_runtime_1.jsx)(FooterContainer, { children: (0, jsx_runtime_1.jsxs)(AddColumnButton, { onClick: () => setShowCreateColumnModal(true), children: [(0, jsx_runtime_1.jsx)(fa_1.FaPlus, {}), " Adicionar Coluna"] }) })] })] })) : ((0, jsx_runtime_1.jsxs)(NoProjectMessage, { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Selecione um projeto" }), (0, jsx_runtime_1.jsx)("p", { children: "Escolha um projeto existente ou crie um novo para visualizar o quadro Kanban." })] })), showCreateProjectModal && ((0, jsx_runtime_1.jsx)(CreateProjectModal_1.default, { onClose: () => setShowCreateProjectModal(false), onCreateProject: handleCreateProject })), showEditProjectModal && currentProject && ((0, jsx_runtime_1.jsx)(EditProjectModal_1.default, { project: currentProject, onClose: () => setShowEditProjectModal(false), onUpdateProject: handleUpdateProject, onDeleteProject: handleDeleteProject })), showCreateColumnModal && activeProjectId && ((0, jsx_runtime_1.jsx)(CreateColumnModal_1.default, { onClose: () => setShowCreateColumnModal(false), onCreateColumn: handleCreateColumn }))] }));
};
exports.default = KanbanPage;
