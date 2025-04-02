"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const SelectorContainer = styled_components_1.default.div `
  margin-bottom: 1rem;
`;
const SelectList = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
`;
const ProjectOption = styled_components_1.default.div `
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#3498db' : '#f1f1f1'};
  color: ${props => props.active ? 'white' : '#555'};
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#e0e0e0'};
  }
`;
const ProjectSelector = ({ projects, activeProjectId, onSelectProject }) => {
    if (projects.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(SelectorContainer, { children: (0, jsx_runtime_1.jsx)(SelectList, { children: projects.map(project => ((0, jsx_runtime_1.jsx)(ProjectOption, { active: project.id === activeProjectId, onClick: () => onSelectProject(project.id), children: project.name }, project.id))) }) }));
};
exports.default = ProjectSelector;
