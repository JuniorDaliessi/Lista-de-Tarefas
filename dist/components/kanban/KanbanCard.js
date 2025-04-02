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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const fa_1 = require("react-icons/fa");
const ProjectContext_1 = require("../../contexts/ProjectContext");
const CardContainer = styled_components_1.default.div `
  background-color: ${props => props.$isDragging ? 'var(--accent-light)' : 'var(--card-background)'};
  border-radius: 10px;
  box-shadow: ${props => props.$isDragging ? '0 8px 20px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  padding: 1rem;
  cursor: grab;
  transition: all 0.2s ease-in-out;
  border-left: 3px solid var(--accent-color);
  position: relative;
  overflow: hidden;
  transform: ${props => props.$isDragging ? 'rotate(1deg)' : 'none'};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    cursor: grabbing;
    transform: translateY(0);
  }
  
  ${props => props.$completed && `
    opacity: 0.8;
    border-left-color: var(--success-color);
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, transparent 95%, var(--success-color) 95%);
      z-index: 0;
      pointer-events: none;
    }
  `}
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;
const CardContent = styled_components_1.default.div `
  position: relative;
  z-index: 1;
`;
const CardTitle = styled_components_1.default.h4 `
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-primary);
  word-break: break-word;
  font-weight: 600;
  display: flex;
  align-items: flex-start;
  
  ${props => props.$completed && `
    text-decoration: line-through;
    color: var(--text-secondary);
  `}
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;
const CompletedIcon = (0, styled_components_1.default)(fa_1.FaCheck) `
  color: var(--success-color);
  margin-right: 0.5rem;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;
const CardDescription = styled_components_1.default.p `
  margin: 0 0 0.8rem 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.6rem;
  }
`;
const CardMeta = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    margin-bottom: 0.6rem;
    gap: 0.4rem;
  }
`;
const MetaItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-secondary);
  background-color: var(--background-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  
  svg {
    margin-right: 0.3rem;
    font-size: 0.7rem;
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    
    svg {
      font-size: 0.65rem;
    }
  }
`;
const CardFooter = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;
const CardPriority = styled_components_1.default.span `
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  
  ${props => {
    switch (props.priority) {
        case 'baixa':
            return `
          background-color: var(--success-light);
          color: var(--success-color);
        `;
        case 'média':
            return `
          background-color: var(--warning-light);
          color: var(--warning-color);
        `;
        case 'alta':
            return `
          background-color: var(--error-light);
          color: var(--error-color);
        `;
        default:
            return '';
    }
}}
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
`;
const CardActions = styled_components_1.default.div `
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: opacity 0.2s;
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
  
  /* Em dispositivos móveis, manter sempre visível */
  @media (max-width: 768px) {
    opacity: 1;
  }
`;
const DeleteButton = styled_components_1.default.button `
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--error-light);
  }
  
  /* Em dispositivos móveis, área de clique maior */
  @media (max-width: 768px) {
    padding: 0.4rem;
  }
`;
const ProjectIndicator = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--accent-dark);
  background-color: var(--accent-light);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
  
  svg {
    margin-right: 0.3rem;
    font-size: 0.7rem;
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    
    svg {
      font-size: 0.65rem;
    }
  }
`;
const ActionButtons = styled_components_1.default.div `
  display: flex;
  gap: 0.5rem;
`;
const successAnimation = (0, styled_components_1.keyframes) `
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;
const ActionButton = styled_components_1.default.button `
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: ${props => props.$isSuccess ? 'var(--success-color)' : 'var(--text-secondary)'};
  animation: ${props => props.$isSuccess ? `${successAnimation} 0.5s ease` : 'none'};
  
  &:hover {
    background-color: var(--hover-background);
    color: ${props => props.$isSuccess ? 'var(--success-color)' : 'var(--accent-color)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const fadeIn = (0, styled_components_1.keyframes) `
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const StatusMessage = styled_components_1.default.div `
  font-size: 0.8rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease;
`;
const WarningMessage = (0, styled_components_1.default)(StatusMessage) `
  color: var(--warning-color);
  background-color: var(--warning-light);
`;
const ErrorMessage = (0, styled_components_1.default)(StatusMessage) `
  color: var(--error-color);
  background-color: var(--error-light);
`;
const SuccessMessage = (0, styled_components_1.default)(StatusMessage) `
  color: var(--success-color);
  background-color: var(--success-light);
`;
const ActionButtonWrapper = styled_components_1.default.div `
  position: relative;
`;
const Tooltip = styled_components_1.default.div `
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--background-primary);
  color: var(--text-primary);
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 10;
  margin-bottom: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: var(--background-primary) transparent transparent transparent;
  }
  
  ${ActionButtonWrapper}:hover & {
    opacity: 1;
  }
`;
const KanbanCard = ({ todo, index, onClick, onRemove }) => {
    var _a, _b;
    const { projects, advanceTaskStatus, regressTaskStatus } = (0, ProjectContext_1.useProject)();
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [advanceError, setAdvanceError] = (0, react_1.useState)(null);
    const [advanceSuccess, setAdvanceSuccess] = (0, react_1.useState)(false);
    const [regressSuccess, setRegressSuccess] = (0, react_1.useState)(false);
    const [successMessage, setSuccessMessage] = (0, react_1.useState)(null);
    const [isAdvancing, setIsAdvancing] = (0, react_1.useState)(false);
    const [isRegressing, setIsRegressing] = (0, react_1.useState)(false);
    // Encontrar o projeto associado à tarefa
    const associatedProject = todo.projectId ? projects.find(project => project.id === todo.projectId) : null;
    // Encontrar a coluna atual e a próxima (se houver)
    const currentProject = associatedProject;
    const currentColumn = currentProject === null || currentProject === void 0 ? void 0 : currentProject.columns.find(col => col.id === todo.columnId);
    // Verificar se é a última ou a primeira coluna
    const sortedColumns = (currentProject === null || currentProject === void 0 ? void 0 : currentProject.columns.sort((a, b) => a.order - b.order)) || [];
    const currentColumnIndex = sortedColumns.findIndex(col => col.id === todo.columnId);
    const isLastColumn = currentColumnIndex === sortedColumns.length - 1;
    const isFirstColumn = currentColumnIndex === 0;
    const handleRemoveClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onRemove();
    };
    const handleAdvanceStatus = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!todo.projectId || !todo.columnId) {
            setAdvanceError('Tarefa não está associada a um projeto ou coluna');
            setTimeout(() => setAdvanceError(null), 3000);
            return;
        }
        if (isLastColumn) {
            setAdvanceError('Tarefa já está na última coluna');
            setTimeout(() => setAdvanceError(null), 3000);
            return;
        }
        setIsAdvancing(true);
        try {
            const result = advanceTaskStatus(todo.id);
            if (!result.success) {
                setAdvanceError(result.message || 'Não foi possível avançar o status');
                setTimeout(() => setAdvanceError(null), 3000);
            }
            else {
                setAdvanceSuccess(true);
                // Verificar se há mensagem de alerta no resultado de sucesso
                if (result.message && result.message.startsWith('Atenção:')) {
                    // Exibir como alerta em vez de mensagem de sucesso
                    setAdvanceError(result.message);
                    setTimeout(() => setAdvanceError(null), 3000);
                }
                else {
                    setSuccessMessage(result.message || 'Status avançado com sucesso!');
                    setTimeout(() => {
                        setSuccessMessage(null);
                    }, 2000);
                }
                setTimeout(() => {
                    setAdvanceSuccess(false);
                }, 1000);
            }
        }
        catch (error) {
            setAdvanceError('Erro ao avançar status');
            setTimeout(() => setAdvanceError(null), 3000);
        }
        finally {
            setIsAdvancing(false);
        }
    };
    const handleRegressStatus = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!todo.projectId || !todo.columnId) {
            setAdvanceError('Tarefa não está associada a um projeto ou coluna');
            setTimeout(() => setAdvanceError(null), 3000);
            return;
        }
        if (isFirstColumn) {
            setAdvanceError('Tarefa já está na primeira coluna');
            setTimeout(() => setAdvanceError(null), 3000);
            return;
        }
        setIsRegressing(true);
        try {
            const result = regressTaskStatus(todo.id);
            if (!result.success) {
                setAdvanceError(result.message || 'Não foi possível retornar o status');
                setTimeout(() => setAdvanceError(null), 3000);
            }
            else {
                setRegressSuccess(true);
                setSuccessMessage(result.message || 'Status retornado com sucesso!');
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 2000);
                setTimeout(() => {
                    setRegressSuccess(false);
                }, 1000);
            }
        }
        catch (error) {
            setAdvanceError('Erro ao retornar status');
            setTimeout(() => setAdvanceError(null), 3000);
        }
        finally {
            setIsRegressing(false);
        }
    };
    // Format date to DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
    // Função que verifica se a data está no passado
    const isPastDue = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo.date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    };
    // Calculate days until due date
    const getDaysUntilDue = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(dateString);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0)
            return Math.abs(diffDays);
        return diffDays;
    };
    // Drag and drop handlers
    const handleDragStart = (e) => {
        // Evita que o clique no botão de exclusão inicie o arrasto
        if (e.target.closest('button')) {
            e.preventDefault();
            return;
        }
        // Armazenar os dados no formato de texto
        e.dataTransfer.setData('text/plain', JSON.stringify({
            todoId: todo.id,
            sourceColumnId: todo.columnId,
            sourceIndex: index
        }));
        setIsDragging(true);
        console.log(`Iniciando arrasto da tarefa ${todo.id}`);
    };
    const handleDragEnd = () => {
        setIsDragging(false);
        console.log(`Arrasto da tarefa ${todo.id} finalizado`);
    };
    return ((0, jsx_runtime_1.jsx)(CardContainer, { "$completed": todo.completed, "$isDragging": isDragging, onClick: onClick, draggable: true, onDragStart: handleDragStart, onDragEnd: handleDragEnd, "data-todo-id": todo.id, "data-column-id": todo.columnId, "data-index": index, children: (0, jsx_runtime_1.jsxs)(CardContent, { children: [(0, jsx_runtime_1.jsxs)(CardTitle, { "$completed": todo.completed, children: [todo.completed && (0, jsx_runtime_1.jsx)(CompletedIcon, {}), todo.title] }), todo.description && (0, jsx_runtime_1.jsx)(CardDescription, { children: todo.description }), (0, jsx_runtime_1.jsxs)(CardMeta, { children: [todo.date && ((0, jsx_runtime_1.jsxs)(MetaItem, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaCalendarAlt, {}), (0, jsx_runtime_1.jsx)("span", { children: formatDate(todo.date) })] })), todo.category && ((0, jsx_runtime_1.jsxs)(MetaItem, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTag, {}), (0, jsx_runtime_1.jsx)("span", { children: todo.category })] })), !todo.completed && isPastDue() && ((0, jsx_runtime_1.jsxs)(MetaItem, { style: {
                                color: 'var(--error-color)',
                                fontWeight: 'bold'
                            }, children: [(0, jsx_runtime_1.jsx)(fa_1.FaClock, {}), (0, jsx_runtime_1.jsxs)("span", { children: [getDaysUntilDue(todo.date), " dias atrasado"] })] }))] }), associatedProject && ((0, jsx_runtime_1.jsxs)(ProjectIndicator, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaProjectDiagram, {}), (0, jsx_runtime_1.jsx)("span", { children: associatedProject.name })] })), (0, jsx_runtime_1.jsxs)(CardFooter, { children: [(0, jsx_runtime_1.jsx)(CardPriority, { priority: todo.priority, children: todo.priority }), (0, jsx_runtime_1.jsx)(CardActions, { children: (0, jsx_runtime_1.jsxs)(ActionButtons, { children: [(0, jsx_runtime_1.jsxs)(ActionButtonWrapper, { children: [(0, jsx_runtime_1.jsx)(ActionButton, { onClick: handleRegressStatus, title: isFirstColumn ? "Já está na primeira coluna" : "Voltar para etapa anterior", "aria-label": isFirstColumn ? "Já está na primeira coluna" : "Voltar para etapa anterior", disabled: isFirstColumn || isRegressing, "$isSuccess": regressSuccess, children: (0, jsx_runtime_1.jsx)(fa_1.FaArrowLeft, { size: 14 }) }), !isFirstColumn && currentProject && ((0, jsx_runtime_1.jsxs)(Tooltip, { children: ["Voltar para: ", ((_a = sortedColumns[currentColumnIndex - 1]) === null || _a === void 0 ? void 0 : _a.title) || ''] }))] }), (0, jsx_runtime_1.jsxs)(ActionButtonWrapper, { children: [(0, jsx_runtime_1.jsx)(ActionButton, { onClick: handleAdvanceStatus, title: isLastColumn ? "Já está na última coluna" : "Avançar para próxima etapa", "aria-label": isLastColumn ? "Já está na última coluna" : "Avançar para próxima etapa", disabled: isLastColumn || isAdvancing, "$isSuccess": advanceSuccess, children: (0, jsx_runtime_1.jsx)(fa_1.FaArrowRight, { size: 14 }) }), !isLastColumn && currentProject && ((0, jsx_runtime_1.jsxs)(Tooltip, { children: ["Mover para: ", ((_b = sortedColumns[currentColumnIndex + 1]) === null || _b === void 0 ? void 0 : _b.title) || ''] }))] }), (0, jsx_runtime_1.jsx)(DeleteButton, { onClick: handleRemoveClick, title: "Remover da coluna", "aria-label": "Remover tarefa da coluna", children: (0, jsx_runtime_1.jsx)(fa_1.FaTrash, { size: 14 }) })] }) })] }), advanceError && (advanceError.startsWith('Atenção:') ? ((0, jsx_runtime_1.jsx)(WarningMessage, { children: advanceError })) : ((0, jsx_runtime_1.jsx)(ErrorMessage, { children: advanceError }))), successMessage && ((0, jsx_runtime_1.jsx)(SuccessMessage, { children: successMessage }))] }) }));
};
exports.default = KanbanCard;
