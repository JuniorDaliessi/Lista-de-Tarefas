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
const uuid_1 = require("uuid");
const FormContainer = styled_components_1.default.form `
  display: flex;
  flex-direction: column;
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  animation: fadeIn var(--transition-normal);
  border: 1px solid var(--border-color);
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;
const FormTitle = styled_components_1.default.h3 `
  margin: 0 0 1.2rem 0;
  font-size: 1.2rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--accent-color);
  }
`;
const FormGroup = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
  
  &:last-of-type {
    margin-bottom: 1.5rem;
  }
`;
const FormRow = styled_components_1.default.div `
  display: flex;
  gap: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.2rem;
  }
`;
const Label = styled_components_1.default.label `
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.4rem;
    color: var(--accent-color);
    font-size: 0.9rem;
  }
`;
const InputGroup = styled_components_1.default.div `
  position: relative;
  flex: 1;
`;
const InputIcon = styled_components_1.default.span `
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  pointer-events: none;
  
  & + input {
    padding-left: 2.5rem;
  }
`;
const Input = styled_components_1.default.input `
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  background-color: var(--background-primary);
  color: var(--text-primary);
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
  }
`;
const TextArea = styled_components_1.default.textarea `
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  background-color: var(--background-primary);
  color: var(--text-primary);
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
    min-height: 100px;
  }
`;
const Select = styled_components_1.default.select `
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background-color: var(--background-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  width: 100%;
  
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1rem;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 2.5rem 0.7rem 0.7rem;
    font-size: 0.9rem;
  }
`;
const ButtonGroup = styled_components_1.default.div `
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 0.8rem;
  }
`;
const Button = styled_components_1.default.button `
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.7rem 1rem;
  }
`;
const SuccessMessage = styled_components_1.default.div `
  background-color: var(--success-color);
  color: white;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideDown 0.3s ease-in-out;
  
  svg {
    margin-right: 0.5rem;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
const SubmitButton = (0, styled_components_1.default)(Button) `
  background-color: var(--accent-color);
  color: white;
  
  &:hover {
    background-color: var(--accent-light);
  }
  
  &:active {
    background-color: var(--accent-dark);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.3);
  }
  
  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    transform: none !important;
  }
`;
const CancelButton = (0, styled_components_1.default)(Button) `
  background-color: var(--background-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--hover-background);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.3);
  }
`;
const SubtasksSection = styled_components_1.default.div `
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
`;
const SubtasksHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: var(--background-secondary);
  cursor: pointer;
  
  h4 {
    margin: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: var(--accent-color);
    }
  }
`;
const SubtasksList = styled_components_1.default.div `
  padding: 0.5rem 1rem;
  max-height: 200px;
  overflow-y: auto;
`;
const SubtaskItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  opacity: ${props => props.completed ? 0.7 : 1};
  
  span {
    flex: 1;
    margin: 0 0.5rem;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;
const SubtaskCheckbox = styled_components_1.default.div `
  width: 1.2rem;
  height: 1.2rem;
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
const AddSubtaskForm = styled_components_1.default.div `
  display: flex;
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--border-color);
  
  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md) 0 0 var(--radius-md);
    font-size: 0.9rem;
    background-color: var(--background-primary);
    color: var(--text-primary);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
    }
  }
  
  button {
    padding: 0.5rem 0.8rem;
    background-color: var(--accent-color);
    color: white;
    border: none;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: var(--accent-dark);
    }
  }
`;
const TodoForm = ({ editTodo, onCancel, projectId, columnId }) => {
    const { addTodo, updateTodo, categories } = (0, TodoContext_1.useTodo)();
    const [title, setTitle] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const [date, setDate] = (0, react_1.useState)('');
    const [priority, setPriority] = (0, react_1.useState)('média');
    const [category, setCategory] = (0, react_1.useState)('');
    const [newCategory, setNewCategory] = (0, react_1.useState)('');
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [showSuccess, setShowSuccess] = (0, react_1.useState)(false);
    const [errorMsg, setErrorMsg] = (0, react_1.useState)('');
    const formRef = (0, react_1.useRef)(null);
    const titleInputRef = (0, react_1.useRef)(null);
    // Subtasks state
    const [subtasks, setSubtasks] = (0, react_1.useState)([]);
    const [newSubtask, setNewSubtask] = (0, react_1.useState)('');
    const [showSubtasks, setShowSubtasks] = (0, react_1.useState)(false);
    // Preencher o formulário se estiver editando uma tarefa existente
    (0, react_1.useEffect)(() => {
        if (editTodo) {
            setTitle(editTodo.title);
            setDescription(editTodo.description);
            setDate(editTodo.date ? editTodo.date.slice(0, 10) : '');
            setPriority(editTodo.priority);
            setCategory(editTodo.category || '');
            setSubtasks(editTodo.subtasks || []);
            setShowSubtasks(editTodo.subtasks && editTodo.subtasks.length > 0);
        }
        // Focar no campo de título ao montar o componente
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [editTodo]);
    // Esconder mensagem de sucesso após alguns segundos
    (0, react_1.useEffect)(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);
    // Memoização dos manipuladores de eventos
    const handleTitleChange = (0, react_1.useCallback)((e) => {
        setTitle(e.target.value);
    }, []);
    const handleDescriptionChange = (0, react_1.useCallback)((e) => {
        setDescription(e.target.value);
    }, []);
    const handleDateChange = (0, react_1.useCallback)((e) => {
        setDate(e.target.value);
    }, []);
    const handlePriorityChange = (0, react_1.useCallback)((e) => {
        setPriority(e.target.value);
    }, []);
    const handleCategoryChange = (0, react_1.useCallback)((e) => {
        setCategory(e.target.value);
    }, []);
    const handleNewCategoryChange = (0, react_1.useCallback)((e) => {
        setNewCategory(e.target.value);
    }, []);
    const resetForm = (0, react_1.useCallback)(() => {
        setTitle('');
        setDescription('');
        setDate('');
        setPriority('média');
        setCategory('');
        setNewCategory('');
        setSubtasks([]);
        setNewSubtask('');
        setShowSubtasks(false);
    }, []);
    // Subtask handlers
    const handleAddSubtask = (0, react_1.useCallback)(() => {
        if (!newSubtask.trim())
            return;
        const newSubtaskItem = {
            id: (0, uuid_1.v4)(),
            title: newSubtask.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        setSubtasks(prev => [...prev, newSubtaskItem]);
        setNewSubtask('');
    }, [newSubtask]);
    const handleDeleteSubtask = (0, react_1.useCallback)((id) => {
        setSubtasks(prev => prev.filter(subtask => subtask.id !== id));
    }, []);
    const handleToggleSubtask = (0, react_1.useCallback)((id) => {
        setSubtasks(prev => prev.map(subtask => subtask.id === id ? Object.assign(Object.assign({}, subtask), { completed: !subtask.completed }) : subtask));
    }, []);
    const handleSubmit = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        setErrorMsg('');
        // Validação básica
        if (!title.trim()) {
            setErrorMsg('Por favor, insira um título para a tarefa');
            if (titleInputRef.current) {
                titleInputRef.current.focus();
            }
            return;
        }
        setIsSubmitting(true);
        try {
            // Usar a nova categoria se selecionada
            const finalCategory = category === 'nova' ? newCategory.trim() : category;
            const todoData = {
                title,
                description,
                date: date || new Date().toISOString().slice(0, 10),
                priority,
                category: finalCategory,
                completed: editTodo ? editTodo.completed : false,
                projectId: projectId || undefined,
                columnId: columnId || undefined
            };
            if (editTodo) {
                updateTodo(Object.assign(Object.assign({}, todoData), { id: editTodo.id, createdAt: editTodo.createdAt, subtasks }));
            }
            else {
                addTodo(Object.assign(Object.assign({}, todoData), { subtasks }));
            }
            // Mostrar mensagem de sucesso
            setShowSuccess(true);
            // Resetar o formulário se não estiver editando
            if (!editTodo) {
                resetForm();
                if (titleInputRef.current) {
                    titleInputRef.current.focus();
                }
            }
            else if (onCancel) {
                // Se estiver editando, fechar o modo de edição após um delay
                setTimeout(() => {
                    onCancel();
                }, 1500);
            }
        }
        catch (error) {
            console.error('Erro ao salvar tarefa:', error);
            setErrorMsg('Ocorreu um erro ao salvar a tarefa. Tente novamente.');
        }
        finally {
            setIsSubmitting(false);
        }
    }, [title, description, date, priority, category, newCategory, subtasks, editTodo, addTodo, updateTodo, resetForm, onCancel, projectId, columnId]);
    return ((0, jsx_runtime_1.jsxs)(FormContainer, { onSubmit: handleSubmit, ref: formRef, "aria-labelledby": "form-title", children: [(0, jsx_runtime_1.jsxs)(FormTitle, { id: "form-title", children: [editTodo ? (0, jsx_runtime_1.jsx)(fa_1.FaSave, { "aria-hidden": "true" }) : (0, jsx_runtime_1.jsx)(fa_1.FaPlus, { "aria-hidden": "true" }), editTodo ? 'Editar Tarefa' : 'Nova Tarefa'] }), showSuccess && ((0, jsx_runtime_1.jsx)(SuccessMessage, { role: "status", "aria-live": "polite", children: (0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaCheck, { "aria-hidden": "true" }), editTodo ? 'Tarefa atualizada com sucesso!' : 'Tarefa adicionada com sucesso!'] }) })), errorMsg && ((0, jsx_runtime_1.jsx)(SuccessMessage, { role: "alert", style: { backgroundColor: 'var(--error-color)' }, children: errorMsg })), (0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "title", children: "T\u00EDtulo" }), (0, jsx_runtime_1.jsx)(Input, { id: "title", type: "text", value: title, onChange: handleTitleChange, placeholder: "Adicione um t\u00EDtulo", required: true, ref: titleInputRef, "aria-required": "true", "aria-invalid": errorMsg && !title ? "true" : "false" })] }), (0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "description", children: "Descri\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)(TextArea, { id: "description", value: description, onChange: handleDescriptionChange, placeholder: "Adicione uma descri\u00E7\u00E3o (opcional)", "aria-required": "false" })] }), (0, jsx_runtime_1.jsxs)(FormRow, { children: [(0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsxs)(Label, { htmlFor: "date", children: [(0, jsx_runtime_1.jsx)(fa_1.FaRegCalendarAlt, { "aria-hidden": "true" }), "Data"] }), (0, jsx_runtime_1.jsx)(Input, { id: "date", type: "date", value: date, onChange: handleDateChange, "aria-label": "Data de conclus\u00E3o da tarefa" })] }), (0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsxs)(Label, { htmlFor: "priority", children: [(0, jsx_runtime_1.jsx)(fa_1.FaFlag, { "aria-hidden": "true" }), "Prioridade"] }), (0, jsx_runtime_1.jsxs)(Select, { id: "priority", value: priority, onChange: handlePriorityChange, "aria-label": "Selecione a prioridade da tarefa", children: [(0, jsx_runtime_1.jsx)("option", { value: "baixa", children: "Baixa" }), (0, jsx_runtime_1.jsx)("option", { value: "m\u00E9dia", children: "M\u00E9dia" }), (0, jsx_runtime_1.jsx)("option", { value: "alta", children: "Alta" })] })] })] }), (0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsxs)(Label, { htmlFor: "category", children: [(0, jsx_runtime_1.jsx)(fa_1.FaTags, { "aria-hidden": "true" }), "Categoria"] }), (0, jsx_runtime_1.jsxs)(Select, { id: "category", value: category, onChange: handleCategoryChange, "aria-label": "Selecione a categoria da tarefa", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Sem categoria" }), categories.map((cat) => ((0, jsx_runtime_1.jsx)("option", { value: cat, children: cat }, cat))), (0, jsx_runtime_1.jsx)("option", { value: "nova", children: "+ Nova categoria" })] })] }), category === 'nova' && ((0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "newCategory", children: "Nome da nova categoria" }), (0, jsx_runtime_1.jsx)(Input, { id: "newCategory", type: "text", value: newCategory, onChange: handleNewCategoryChange, placeholder: "Digite o nome da nova categoria", required: true, "aria-required": "true", "aria-invalid": category === 'nova' && !newCategory ? "true" : "false" })] })), (0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsxs)(Label, { htmlFor: "subtasks", children: [(0, jsx_runtime_1.jsx)(fa_1.FaTasks, { "aria-hidden": "true" }), "Subtarefas"] }), (0, jsx_runtime_1.jsxs)(SubtasksSection, { children: [(0, jsx_runtime_1.jsxs)(SubtasksHeader, { onClick: () => setShowSubtasks(!showSubtasks), children: [(0, jsx_runtime_1.jsxs)("h4", { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTasks, {}), "Subtarefas (", subtasks.filter(s => s.completed).length, "/", subtasks.length, ")"] }), showSubtasks ? (0, jsx_runtime_1.jsx)(fa_1.FaChevronUp, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaChevronDown, {})] }), showSubtasks && subtasks.length > 0 && ((0, jsx_runtime_1.jsx)(SubtasksList, { children: subtasks.map(subtask => ((0, jsx_runtime_1.jsxs)(SubtaskItem, { completed: subtask.completed, children: [(0, jsx_runtime_1.jsx)(SubtaskCheckbox, { onClick: () => handleToggleSubtask(subtask.id), "aria-label": subtask.completed ? "Marcar como pendente" : "Marcar como concluída", children: subtask.completed ? (0, jsx_runtime_1.jsx)(fa_1.FaCheck, {}) : (0, jsx_runtime_1.jsx)("div", { style: { width: '1em', height: '1em', border: '1px solid var(--accent-color)', borderRadius: '50%' } }) }), (0, jsx_runtime_1.jsx)("span", { children: subtask.title }), (0, jsx_runtime_1.jsx)(SubtaskDeleteButton, { onClick: () => handleDeleteSubtask(subtask.id), "aria-label": "Excluir subtarefa", type: "button", children: (0, jsx_runtime_1.jsx)(fa_1.FaTrash, { size: 12 }) })] }, subtask.id))) })), (0, jsx_runtime_1.jsxs)(AddSubtaskForm, { children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Adicionar subtarefa...", value: newSubtask, onChange: (e) => setNewSubtask(e.target.value) }), (0, jsx_runtime_1.jsx)("button", { type: "button", "aria-label": "Adicionar subtarefa", onClick: handleAddSubtask, children: (0, jsx_runtime_1.jsx)(fa_1.FaPlus, {}) })] })] })] }), (0, jsx_runtime_1.jsxs)(ButtonGroup, { children: [onCancel && ((0, jsx_runtime_1.jsxs)(CancelButton, { type: "button", onClick: onCancel, "aria-label": "Cancelar edi\u00E7\u00E3o", children: [(0, jsx_runtime_1.jsx)(fa_1.FaTimes, { "aria-hidden": "true" }), "Cancelar"] })), (0, jsx_runtime_1.jsxs)(SubmitButton, { type: "submit", disabled: isSubmitting, "aria-busy": isSubmitting, children: [editTodo ? (0, jsx_runtime_1.jsx)(fa_1.FaSave, { "aria-hidden": "true" }) : (0, jsx_runtime_1.jsx)(fa_1.FaPlus, { "aria-hidden": "true" }), isSubmitting
                                ? 'Salvando...'
                                : editTodo
                                    ? 'Atualizar Tarefa'
                                    : 'Adicionar Tarefa'] })] })] }));
};
exports.default = (0, react_1.memo)(TodoForm);
