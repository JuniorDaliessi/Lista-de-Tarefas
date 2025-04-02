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
const Sidebar_1 = __importDefault(require("./Sidebar"));
const react_router_dom_1 = require("react-router-dom");
const fa_1 = require("react-icons/fa");
const ThemeContext_1 = require("../contexts/ThemeContext");
const LayoutContainer = styled_components_1.default.div `
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;
const MainContent = styled_components_1.default.div `
  flex: 1;
  margin-left: ${props => props.isSidebarOpen ? '280px' : '0'};
  padding: 2rem;
  background-color: var(--background-primary);
  transition: margin-left var(--transition-normal);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
    width: 100%;
  }
`;
const MobileHeader = styled_components_1.default.div `
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: var(--background-secondary);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
  
  @media (max-width: 768px) {
    display: flex;
  }
`;
const AppTitle = styled_components_1.default.h1 `
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  font-weight: 600;
`;
const HeaderControls = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;
const ThemeToggle = styled_components_1.default.button `
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--accent-color);
  }
`;
const MenuButton = styled_components_1.default.button `
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  
  &:hover {
    color: var(--accent-color);
  }
`;
const Overlay = styled_components_1.default.div `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 150;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
  cursor: pointer;
  
  @media (min-width: 769px) {
    display: none;
  }
`;
const Layout = () => {
    const { theme, toggleTheme } = (0, ThemeContext_1.useTheme)();
    const [isSidebarOpen, setIsSidebarOpen] = (0, react_1.useState)(window.innerWidth > 768);
    const [isMobile, setIsMobile] = (0, react_1.useState)(window.innerWidth <= 768);
    (0, react_1.useEffect)(() => {
        if (isMobile && isSidebarOpen) {
            document.body.classList.add('sidebar-open');
        }
        else {
            document.body.classList.remove('sidebar-open');
        }
        return () => {
            document.body.classList.remove('sidebar-open');
        };
    }, [isMobile, isSidebarOpen]);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile && !isSidebarOpen) {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return ((0, jsx_runtime_1.jsxs)(LayoutContainer, { children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, { isOpen: isSidebarOpen, closeSidebar: () => setIsSidebarOpen(false), isMobile: isMobile }), (0, jsx_runtime_1.jsx)(Overlay, { isVisible: isMobile && isSidebarOpen, onClick: () => setIsSidebarOpen(false) }), (0, jsx_runtime_1.jsxs)(MainContent, { isSidebarOpen: !isMobile && isSidebarOpen, children: [(0, jsx_runtime_1.jsxs)(MobileHeader, { children: [(0, jsx_runtime_1.jsx)(AppTitle, { children: "Todo App" }), (0, jsx_runtime_1.jsxs)(HeaderControls, { children: [(0, jsx_runtime_1.jsx)(ThemeToggle, { onClick: toggleTheme, "aria-label": "Alternar tema", children: theme === 'light' ? (0, jsx_runtime_1.jsx)(fa_1.FaMoon, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaSun, {}) }), (0, jsx_runtime_1.jsx)(MenuButton, { onClick: toggleSidebar, children: isSidebarOpen ? (0, jsx_runtime_1.jsx)(fa_1.FaTimes, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaBars, {}) })] })] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {})] })] }));
};
exports.default = Layout;
