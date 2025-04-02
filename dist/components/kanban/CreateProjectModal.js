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
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;
const ModalHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;
const ModalTitle = styled_components_1.default.h3 `
  margin: 0;
  color: #333;
`;
const CloseButton = styled_components_1.default.button `
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #777;
  
  &:hover {
    color: #333;
  }
`;
const ModalBody = styled_components_1.default.div `
  padding: 1.5rem;
`;
const FormGroup = styled_components_1.default.div `
  margin-bottom: 1.5rem;
`;
const Label = styled_components_1.default.label `
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
`;
const Input = styled_components_1.default.input `
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;
const TextArea = styled_components_1.default.textarea `
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;
const ModalFooter = styled_components_1.default.div `
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
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
  background-color: #f1f1f1;
  color: #555;
  border: none;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;
const SubmitButton = (0, styled_components_1.default)(Button) `
  background-color: #3498db;
  color: white;
  border: none;
  opacity: ${props => props.disabled ? 0.7 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.disabled ? '#3498db' : '#2980b9'};
  }
`;
const CreateProjectModal = ({ onClose, onCreateProject }) => {
    const [name, setName] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onCreateProject(name, description);
        }
    };
    const isFormValid = name.trim().length > 0;
    return ((0, jsx_runtime_1.jsx)(ModalOverlay, { onClick: onClose, children: (0, jsx_runtime_1.jsx)(ModalContent, { onClick: e => e.stopPropagation(), children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)(ModalHeader, { children: [(0, jsx_runtime_1.jsx)(ModalTitle, { children: "Criar Novo Projeto" }), (0, jsx_runtime_1.jsx)(CloseButton, { type: "button", onClick: onClose, children: (0, jsx_runtime_1.jsx)(fa_1.FaTimes, {}) })] }), (0, jsx_runtime_1.jsxs)(ModalBody, { children: [(0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "project-name", children: "Nome do Projeto" }), (0, jsx_runtime_1.jsx)(Input, { id: "project-name", type: "text", value: name, onChange: e => setName(e.target.value), placeholder: "Digite o nome do projeto", autoFocus: true })] }), (0, jsx_runtime_1.jsxs)(FormGroup, { children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "project-description", children: "Descri\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)(TextArea, { id: "project-description", value: description, onChange: e => setDescription(e.target.value), placeholder: "Digite uma descri\u00E7\u00E3o para o projeto (opcional)" })] })] }), (0, jsx_runtime_1.jsxs)(ModalFooter, { children: [(0, jsx_runtime_1.jsx)(CancelButton, { type: "button", onClick: onClose, children: "Cancelar" }), (0, jsx_runtime_1.jsx)(SubmitButton, { type: "submit", disabled: !isFormValid, children: "Criar Projeto" })] })] }) }) }));
};
exports.default = CreateProjectModal;
