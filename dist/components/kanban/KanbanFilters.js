"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const fa_1 = require("react-icons/fa");
const FiltersContainer = styled_components_1.default.div `
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;
const FiltersHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const FiltersTitle = styled_components_1.default.h3 `
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
const FiltersContent = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;
const FilterGroup = styled_components_1.default.div `
  min-width: 200px;
`;
const FilterLabel = styled_components_1.default.div `
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
`;
const OptionsList = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const FilterOption = styled_components_1.default.div `
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#3498db' : '#e9f5fe'};
  color: ${props => props.active ? 'white' : '#0c5460'};
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#d6ebf5'};
  }
`;
const ClearButton = styled_components_1.default.button `
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: #3498db;
  font-size: 0.9rem;
  cursor: pointer;
  gap: 0.3rem;
  
  &:hover {
    text-decoration: underline;
  }
`;
const KanbanFilters = ({ priorityFilter, categoryFilter, onChangePriority, onChangeCategory, categories, }) => {
    // Clear all filters
    const handleClearAll = () => {
        onChangePriority(null);
        onChangeCategory(null);
    };
    // Handler for priority filter
    const handlePriorityClick = (priority) => {
        if (priorityFilter === priority) {
            onChangePriority(null); // Toggle off if already selected
        }
        else {
            onChangePriority(priority);
        }
    };
    // Handler for category filter
    const handleCategoryClick = (category) => {
        if (categoryFilter === category) {
            onChangeCategory(null); // Toggle off if already selected
        }
        else {
            onChangeCategory(category);
        }
    };
    const isAnyFilterActive = priorityFilter !== null || categoryFilter !== null;
    return ((0, jsx_runtime_1.jsxs)(FiltersContainer, { children: [(0, jsx_runtime_1.jsxs)(FiltersHeader, { children: [(0, jsx_runtime_1.jsxs)(FiltersTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaFilter, {}), "Filtros"] }), isAnyFilterActive && ((0, jsx_runtime_1.jsxs)(ClearButton, { onClick: handleClearAll, children: [(0, jsx_runtime_1.jsx)(fa_1.FaTimes, {}), "Limpar filtros"] }))] }), (0, jsx_runtime_1.jsxs)(FiltersContent, { children: [(0, jsx_runtime_1.jsxs)(FilterGroup, { children: [(0, jsx_runtime_1.jsx)(FilterLabel, { children: "Prioridade" }), (0, jsx_runtime_1.jsxs)(OptionsList, { children: [(0, jsx_runtime_1.jsx)(FilterOption, { active: priorityFilter === 'baixa', onClick: () => handlePriorityClick('baixa'), children: "Baixa" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: priorityFilter === 'média', onClick: () => handlePriorityClick('média'), children: "M\u00E9dia" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: priorityFilter === 'alta', onClick: () => handlePriorityClick('alta'), children: "Alta" })] })] }), categories.length > 0 && ((0, jsx_runtime_1.jsxs)(FilterGroup, { children: [(0, jsx_runtime_1.jsx)(FilterLabel, { children: "Categoria" }), (0, jsx_runtime_1.jsx)(OptionsList, { children: categories.map(category => ((0, jsx_runtime_1.jsx)(FilterOption, { active: categoryFilter === category, onClick: () => handleCategoryClick(category), children: category }, category))) })] }))] })] }));
};
exports.default = KanbanFilters;
