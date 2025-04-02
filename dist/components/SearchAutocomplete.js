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
const SearchContainer = styled_components_1.default.div `
  position: relative;
  width: 100%;
`;
const SearchInput = styled_components_1.default.input `
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
    outline: none;
  }
`;
const SearchIcon = styled_components_1.default.span `
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.1rem;
  pointer-events: none;
  transition: color var(--transition-fast);
  z-index: 1;
`;
const SuggestionsContainer = styled_components_1.default.ul `
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--background-primary);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: var(--shadow-md);
`;
const SuggestionItem = styled_components_1.default.li `
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  background-color: ${(props) => props.active ? 'var(--accent-light)' : 'transparent'};
  
  &:hover {
    background-color: var(--accent-light);
  }
`;
const NoSuggestions = styled_components_1.default.li `
  padding: 0.8rem 1rem;
  color: var(--text-secondary);
  font-style: italic;
`;
const SearchAutocomplete = ({ placeholder, value, onChange, suggestions, className, onSuggestionSelect }) => {
    const [inputValue, setInputValue] = (0, react_1.useState)(value);
    const [filteredSuggestions, setFilteredSuggestions] = (0, react_1.useState)([]);
    const [showSuggestions, setShowSuggestions] = (0, react_1.useState)(false);
    const [activeSuggestion, setActiveSuggestion] = (0, react_1.useState)(0);
    const containerRef = (0, react_1.useRef)(null);
    // Atualizar o inputValue quando o value prop mudar
    (0, react_1.useEffect)(() => {
        setInputValue(value);
    }, [value]);
    // Filtrar sugestões com base no valor digitado
    (0, react_1.useEffect)(() => {
        if (inputValue.trim() === '') {
            setFilteredSuggestions([]);
            return;
        }
        const filtered = suggestions.filter(suggestion => suggestion.toLowerCase().includes(inputValue.toLowerCase()));
        setFilteredSuggestions(filtered);
        setActiveSuggestion(0);
    }, [inputValue, suggestions]);
    // Fechar sugestões ao clicar fora do componente
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setShowSuggestions(true);
        onChange(newValue);
    };
    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        onChange(suggestion);
        setShowSuggestions(false);
        // Chamar o callback onSuggestionSelect se estiver definido
        if (onSuggestionSelect) {
            onSuggestionSelect(suggestion);
        }
    };
    const handleKeyDown = (e) => {
        // Navegação por teclado (setas para cima/baixo)
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : prev);
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion(prev => prev > 0 ? prev - 1 : 0);
        }
        else if (e.key === 'Enter' && activeSuggestion >= 0 && filteredSuggestions.length > 0) {
            e.preventDefault();
            handleSuggestionClick(filteredSuggestions[activeSuggestion]);
        }
        else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(SearchContainer, { ref: containerRef, className: className, children: [(0, jsx_runtime_1.jsx)(SearchIcon, { children: (0, jsx_runtime_1.jsx)(fa_1.FaSearch, {}) }), (0, jsx_runtime_1.jsx)(SearchInput, { type: "text", placeholder: placeholder, value: inputValue, onChange: handleChange, onFocus: () => setShowSuggestions(true), onKeyDown: handleKeyDown, role: "combobox", "aria-autocomplete": "list", "aria-expanded": showSuggestions, "aria-activedescendant": activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined }), showSuggestions && inputValue.trim() !== '' && ((0, jsx_runtime_1.jsx)(SuggestionsContainer, { children: filteredSuggestions.length > 0 ? (filteredSuggestions.map((suggestion, index) => ((0, jsx_runtime_1.jsx)(SuggestionItem, { active: index === activeSuggestion, onClick: () => handleSuggestionClick(suggestion), id: `suggestion-${index}`, role: "option", "aria-selected": index === activeSuggestion, children: suggestion }, index)))) : ((0, jsx_runtime_1.jsx)(NoSuggestions, { children: "Nenhuma sugest\u00E3o encontrada" })) }))] }));
};
exports.default = SearchAutocomplete;
