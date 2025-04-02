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
const ThemeContext_1 = require("../contexts/ThemeContext");
const TodoContext_1 = require("../contexts/TodoContext");
const SidebarContainer = styled_components_1.default.div `
  width: 280px;
  height: 100vh;
  background-color: var(--background-secondary);
  color: var(--text-primary);
  padding: 1.5rem 0;
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-300px'};
  box-shadow: ${props => props.isOpen ? 'var(--shadow-md)' : 'none'};
  transition: left var(--transition-normal), box-shadow var(--transition-normal);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 200;
  display: flex;
  flex-direction: column;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  @media (max-width: 768px) {
    width: 85%;
    max-width: 320px;
    padding-top: 1rem;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    left: 0;
  }
`;
const SidebarHeader = styled_components_1.default.div `
  position: relative;
  padding: 0 1rem 0 1.5rem;
  margin-bottom: 1.5rem;
`;
const CloseButton = styled_components_1.default.button `
  position: absolute;
  top: 0;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  transition: color var(--transition-fast);
  z-index: 10;
  
  &:hover {
    color: var(--text-primary);
    background: none;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;
const LogoContainer = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1.2rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;
const Logo = styled_components_1.default.div `
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;
const ThemeToggle = styled_components_1.default.button `
  background: transparent;
  color: var(--text-secondary);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: color var(--transition-fast), background-color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--hover-background);
  }
  
  @media (max-width: 768px) {
    display: none; /* Oculta o botão em dispositivos móveis já que está no header */
  }
`;
const SearchContainer = styled_components_1.default.div `
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const SearchInput = styled_components_1.default.div `
  position: relative;
  width: 100%;
  
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.9rem;
    transition: all var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(79, 134, 247, 0.2);
    }
    
    &::placeholder {
      color: var(--text-tertiary);
    }
  }
`;
const SearchTypeSelect = styled_components_1.default.div `
  width: 100%;
  
  select {
    width: 100%;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.85rem;
    transition: all var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
    }
  }
`;
const SearchIcon = styled_components_1.default.span `
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
  transition: color var(--transition-fast);
  
  input:focus + & {
    color: var(--accent-color);
  }
`;
const SectionTitle = styled_components_1.default.div `
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AddButton = styled_components_1.default.button `
  background: transparent;
  color: var(--accent-color);
  padding: 0.25rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast), transform var(--transition-fast);
  
  &:hover {
    color: var(--accent-light);
    background-color: transparent;
    transform: scale(1.1);
  }
`;
const NavMenu = styled_components_1.default.ul `
  list-style: none;
  padding: 0;
  margin: 0;
`;
const NavItem = styled_components_1.default.li `
  margin-bottom: 0.25rem;
`;
const StyledNavLink = (0, styled_components_1.default)(react_router_dom_1.NavLink) `
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: var(--hover-background);
    color: var(--text-primary);
  }
  
  &.active {
    background-color: var(--active-background);
    color: var(--accent-color);
    border-left: 3px solid var(--accent-color);
  }
`;
const CategoryItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.5rem;
  color: ${(props) => props.active ? 'var(--accent-color)' : 'var(--text-secondary)'};
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  background-color: ${(props) => props.active ? 'var(--active-background)' : 'transparent'};
  border-left: 3px solid ${(props) => props.active ? 'var(--accent-color)' : 'transparent'};
  
  &:hover {
    background-color: var(--hover-background);
    color: ${(props) => props.active ? 'var(--accent-color)' : 'var(--text-primary)'};
  }
`;
const CategoryContent = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const CategoryCount = styled_components_1.default.span `
  background-color: ${props => props.active ? 'var(--accent-color)' : 'var(--background-primary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  transition: all var(--transition-fast);
`;
const Icon = styled_components_1.default.span `
  margin-right: 0.8rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  min-width: 1.1rem;
`;
const Text = styled_components_1.default.span `
  font-size: 0.95rem;
  font-weight: 500;
`;
const CategoryForm = styled_components_1.default.form `
  padding: 0 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
`;
const CategoryInput = styled_components_1.default.input `
  flex: 1;
  padding: 0.5rem 0.8rem;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  border: 1px solid var(--border-color);
  border-right: none;
  background-color: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;
const AddCategoryButton = styled_components_1.default.button `
  padding: 0 0.75rem;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: var(--accent-color);
  color: white;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-light);
  }
  
  &:active {
    background-color: var(--accent-dark);
  }
`;
const StatusContainer = styled_components_1.default.div `
  margin-top: auto;
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const StatusItem = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
`;
const StatusLabel = styled_components_1.default.span `
  font-weight: 500;
`;
const StatusValue = styled_components_1.default.span `
  color: var(--accent-color);
  font-weight: 600;
`;
const Sidebar = ({ isOpen, closeSidebar, isMobile }) => {
    const { theme, toggleTheme } = (0, ThemeContext_1.useTheme)();
    const { searchQuery, setSearchQuery, searchType, setSearchType, categories, activeCategory, setActiveCategory, addCategory, todos } = (0, TodoContext_1.useTodo)();
    const [showCategoryForm, setShowCategoryForm] = (0, react_1.useState)(false);
    const [newCategory, setNewCategory] = (0, react_1.useState)('');
    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            addCategory(newCategory.trim());
            setNewCategory('');
            setShowCategoryForm(false);
        }
    };
    const handleNavClick = () => {
        if (isMobile) {
            closeSidebar();
        }
    };
    // Calcular estatísticas de tarefas
    const completedTasks = todos.filter(todo => todo.completed).length;
    const pendingTasks = todos.length - completedTasks;
    // Calcular contagem de tarefas por categoria
    const getCategoryCount = (category) => {
        return todos.filter(todo => category === 'todas' ? true : todo.category === category).length;
    };
    return ((0, jsx_runtime_1.jsxs)(SidebarContainer, { isOpen: isOpen, isMobile: isMobile, children: [(0, jsx_runtime_1.jsxs)(SidebarHeader, { children: [isMobile && ((0, jsx_runtime_1.jsx)(CloseButton, { onClick: closeSidebar, "aria-label": "Fechar menu", children: (0, jsx_runtime_1.jsx)(fa_1.FaTimes, {}) })), (0, jsx_runtime_1.jsxs)(LogoContainer, { children: [(0, jsx_runtime_1.jsxs)(Logo, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTasks, {}), (0, jsx_runtime_1.jsx)("span", { children: "Todo App" })] }), (0, jsx_runtime_1.jsx)(ThemeToggle, { onClick: toggleTheme, title: theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro', children: theme === 'light' ? (0, jsx_runtime_1.jsx)(fa_1.FaMoon, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaSun, {}) })] })] }), (0, jsx_runtime_1.jsxs)(SearchContainer, { children: [(0, jsx_runtime_1.jsxs)(SearchInput, { children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Buscar tarefas...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), (0, jsx_runtime_1.jsx)(SearchIcon, { children: (0, jsx_runtime_1.jsx)(fa_1.FaSearch, {}) })] }), (0, jsx_runtime_1.jsx)(SearchTypeSelect, { children: (0, jsx_runtime_1.jsxs)("select", { value: searchType, onChange: (e) => setSearchType(e.target.value), "aria-label": "Tipo de busca", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Buscar em tudo" }), (0, jsx_runtime_1.jsx)("option", { value: "title", children: "Apenas t\u00EDtulos" }), (0, jsx_runtime_1.jsx)("option", { value: "description", children: "Apenas descri\u00E7\u00F5es" }), (0, jsx_runtime_1.jsx)("option", { value: "category", children: "Apenas categorias" })] }) })] }), (0, jsx_runtime_1.jsxs)(NavMenu, { children: [(0, jsx_runtime_1.jsx)(NavItem, { children: (0, jsx_runtime_1.jsxs)(StyledNavLink, { to: "/", onClick: handleNavClick, children: [(0, jsx_runtime_1.jsx)(Icon, { children: (0, jsx_runtime_1.jsx)(fa_1.FaHome, {}) }), (0, jsx_runtime_1.jsx)(Text, { children: "P\u00E1gina Inicial" })] }) }), (0, jsx_runtime_1.jsx)(NavItem, { children: (0, jsx_runtime_1.jsxs)(StyledNavLink, { to: "/filtros", onClick: handleNavClick, children: [(0, jsx_runtime_1.jsx)(Icon, { children: (0, jsx_runtime_1.jsx)(fa_1.FaFilter, {}) }), (0, jsx_runtime_1.jsx)(Text, { children: "Filtros Avan\u00E7ados" })] }) }), (0, jsx_runtime_1.jsx)(NavItem, { children: (0, jsx_runtime_1.jsxs)(StyledNavLink, { to: "/dashboard", onClick: handleNavClick, children: [(0, jsx_runtime_1.jsx)(Icon, { children: (0, jsx_runtime_1.jsx)(fa_1.FaChartBar, {}) }), (0, jsx_runtime_1.jsx)(Text, { children: "Dashboard" })] }) }), (0, jsx_runtime_1.jsx)(NavItem, { children: (0, jsx_runtime_1.jsxs)(StyledNavLink, { to: "/kanban", onClick: handleNavClick, children: [(0, jsx_runtime_1.jsx)(Icon, { children: (0, jsx_runtime_1.jsx)(fa_1.FaColumns, {}) }), (0, jsx_runtime_1.jsx)(Text, { children: "Kanban" })] }) })] }), (0, jsx_runtime_1.jsxs)(SectionTitle, { children: [(0, jsx_runtime_1.jsx)("span", { children: "Categorias" }), (0, jsx_runtime_1.jsx)(AddButton, { onClick: () => setShowCategoryForm(!showCategoryForm), children: (0, jsx_runtime_1.jsx)(fa_1.FaPlus, {}) })] }), showCategoryForm && ((0, jsx_runtime_1.jsxs)(CategoryForm, { onSubmit: handleCategorySubmit, children: [(0, jsx_runtime_1.jsx)(CategoryInput, { type: "text", placeholder: "Nova categoria", value: newCategory, onChange: (e) => setNewCategory(e.target.value), autoFocus: true }), (0, jsx_runtime_1.jsx)(AddCategoryButton, { type: "submit", children: (0, jsx_runtime_1.jsx)(fa_1.FaPlus, {}) })] })), (0, jsx_runtime_1.jsxs)(NavMenu, { children: [(0, jsx_runtime_1.jsxs)(CategoryItem, { active: activeCategory === 'todas', onClick: () => {
                            setActiveCategory('todas');
                            if (isMobile)
                                closeSidebar();
                        }, children: [(0, jsx_runtime_1.jsxs)(CategoryContent, { children: [(0, jsx_runtime_1.jsx)(Icon, { children: (0, jsx_runtime_1.jsx)(fa_1.FaTags, {}) }), (0, jsx_runtime_1.jsx)(Text, { children: "Todas" })] }), (0, jsx_runtime_1.jsx)(CategoryCount, { active: activeCategory === 'todas', children: todos.length })] }), categories.map((category) => ((0, jsx_runtime_1.jsxs)(CategoryItem, { active: activeCategory === category, onClick: () => {
                            setActiveCategory(category);
                            if (isMobile)
                                closeSidebar();
                        }, children: [(0, jsx_runtime_1.jsxs)(CategoryContent, { children: [(0, jsx_runtime_1.jsx)(Icon, { children: (0, jsx_runtime_1.jsx)(fa_1.FaTags, {}) }), (0, jsx_runtime_1.jsx)(Text, { children: category })] }), (0, jsx_runtime_1.jsx)(CategoryCount, { active: activeCategory === category, children: getCategoryCount(category) })] }, category)))] }), (0, jsx_runtime_1.jsxs)(StatusContainer, { children: [(0, jsx_runtime_1.jsxs)(StatusItem, { children: [(0, jsx_runtime_1.jsx)(StatusLabel, { children: "Tarefas pendentes:" }), (0, jsx_runtime_1.jsx)(StatusValue, { children: pendingTasks })] }), (0, jsx_runtime_1.jsxs)(StatusItem, { children: [(0, jsx_runtime_1.jsx)(StatusLabel, { children: "Tarefas conclu\u00EDdas:" }), (0, jsx_runtime_1.jsx)(StatusValue, { children: completedTasks })] }), (0, jsx_runtime_1.jsxs)(StatusItem, { children: [(0, jsx_runtime_1.jsx)(StatusLabel, { children: "Total de tarefas:" }), (0, jsx_runtime_1.jsx)(StatusValue, { children: todos.length })] })] })] }));
};
exports.default = Sidebar;
