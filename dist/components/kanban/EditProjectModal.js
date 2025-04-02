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
const ModalOverlay = styled_components_1.default.div `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled_components_1.default.div `
  background-color: var(--background-secondary);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  
  @media (max-width: 768px) {
    width: 95%;
    max-height: 95vh;
  }
`;
const ModalHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;
const ModalTitle = styled_components_1.default.h3 `
  margin: 0;
  color: var(--text-primary);
`;
const CloseButton = styled_components_1.default.button `
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--text-primary);
  }
`;
const ModalBody = styled_components_1.default.div `
  padding: 1.5rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
const FormGroup = styled_components_1.default.div `
  margin-bottom: 1.5rem;
`;
const Label = styled_components_1.default.label `
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
`;
const Input = styled_components_1.default.input `
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
  }
`;
const TextArea = styled_components_1.default.textarea `
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  background-color: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
  }
`;
const ColumnsList = styled_components_1.default.div `
  margin-top: 1rem;
`;
const ColumnItem = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background-color: var(--background-primary);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--hover-background);
  }
`;
const ColumnTitle = styled_components_1.default.div `
  font-weight: 500;
  color: var(--text-primary);
`;
const ColumnWipLimit = styled_components_1.default.div `
  font-size: 0.85rem;
  color: var(--text-secondary);
`;
const DeleteButton = styled_components_1.default.button `
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.4rem;
  
  &:hover {
    background-color: var(--error-light);
    border-radius: 4px;
  }
  
  svg {
    margin-right: 0.3rem;
  }
`;
const DangerZone = styled_components_1.default.div `
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid var(--error-color);
  border-radius: 4px;
  background-color: var(--error-light);
`;
const DangerTitle = styled_components_1.default.h4 `
  color: var(--error-color);
  margin-top: 0;
  margin-bottom: 0.8rem;
`;
const DangerDescription = styled_components_1.default.p `
  color: var(--text-primary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;
const ModalFooter = styled_components_1.default.div `
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`;
const Button = styled_components_1.default.button `
  padding: 0.7rem 1.2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;
const CancelButton = (0, styled_components_1.default)(Button) `
  background-color: var(--background-primary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--hover-background);
  }
`;
const SubmitButton = (0, styled_components_1.default)(Button) `
  background-color: var(--accent-color);
  color: white;
  border: none;
  opacity: ${props => props.disabled ? 0.7 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.disabled ? 'var(--accent-color)' : 'var(--accent-light)'};
  }
`;
const EditProjectModal = ({ project, onClose, onUpdateProject, onDeleteProject }) => {
    const [name, setName] = (0, react_1.useState)(project.name);
    const [description, setDescription] = (0, react_1.useState)(project.description);
    const [showDeleteConfirm, setShowDeleteConfirm] = (0, react_1.useState)(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onUpdateProject(Object.assign(Object.assign({}, project), { name,
                description }));
        }
    };
    const handleDeleteClick = () => {
        if (showDeleteConfirm) {
            onDeleteProject(project.id);
        }
        else {
            setShowDeleteConfirm(true);
        }
    };
    const isFormValid = name.trim().length > 0;
    return ((0, jsx_runtime_1.jsx)(ModalOverlay, { onClick: onClose, children: (0, jsx_runtime_1.jsx)(ModalContent, { onClick: e => e.stopPropagation(), children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)(ModalHeader, { children: [(0, jsx_runtime_1.jsx)(ModalTitle, { children: "Editar Projeto" }), (0, jsx_runtime_1.jsx)(CloseButton, { type: "button", onClick: onClose, children: (0, jsx_runtime_1.jsx)(fa_1.FaTimes, {}) })] }), (0, jsx_runtime_1.jsxs)(ModalBody, { children: [(0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "project-name", children: "Nome do Projeto" }), (0, jsx_runtime_1.jsx)(Input, { id: "project-name", type: "text", value: name, onChange: e => setName(e.target.value), placeholder: "Digite o nome do projeto" })] }), (0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "project-description", children: "Descri\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)(TextArea, { id: "project-description", value: description, onChange: e => setDescription(e.target.value), placeholder: "Digite uma descri\u00E7\u00E3o para o projeto (opcional)" })] }), (0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsx)(Label, { children: "Colunas" }), (0, jsx_runtime_1.jsx)(ColumnsList, { children: project.columns.sort((a, b) => a.order - b.order).map(column => ((0, jsx_runtime_1.jsx)(ColumnItem, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ColumnTitle, { children: column.title }), column.wipLimit !== undefined && ((0, jsx_runtime_1.jsxs)(ColumnWipLimit, { children: ["WIP Limit: ", column.wipLimit] }))] }) }, column.id))) })] }), (0, jsx_runtime_1.jsxs)(DangerZone, { children: [(0, jsx_runtime_1.jsx)(DangerTitle, { children: "Zona de Perigo" }), (0, jsx_runtime_1.jsx)(DangerDescription, { children: "Excluir um projeto remover\u00E1 todas as associa\u00E7\u00F5es de tarefas a este projeto. As tarefas em si n\u00E3o ser\u00E3o exclu\u00EDdas, mas ser\u00E3o removidas do quadro Kanban." }), (0, jsx_runtime_1.jsxs)(DeleteButton, { type: "button", onClick: handleDeleteClick, children: [(0, jsx_runtime_1.jsx)(fa_1.FaTrash, {}), showDeleteConfirm ? 'Confirmar Exclusão' : 'Excluir Projeto'] })] })] }), (0, jsx_runtime_1.jsxs)(ModalFooter, { children: [(0, jsx_runtime_1.jsx)(CancelButton, { type: "button", onClick: onClose, children: "Cancelar" }), (0, jsx_runtime_1.jsx)(SubmitButton, { type: "submit", disabled: !isFormValid, children: "Salvar Altera\u00E7\u00F5es" })] })] }) }) }));
};
exports.default = EditProjectModal;
