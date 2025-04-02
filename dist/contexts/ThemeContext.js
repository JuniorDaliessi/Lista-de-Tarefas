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
exports.useTheme = exports.ThemeProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
// Cria o contexto com um valor padrão undefined
const ThemeContext = (0, react_1.createContext)(undefined);
// Componente provider que irá encapsular a aplicação
const ThemeProvider = ({ children }) => {
    // Busca o tema do localStorage ou usa 'dark' como padrão
    const [theme, setTheme] = (0, react_1.useState)(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    });
    // Salva o tema no localStorage sempre que for alterado
    (0, react_1.useEffect)(() => {
        localStorage.setItem('theme', theme);
        // Atualiza o atributo data-theme no elemento HTML raiz
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    // Função para alternar entre temas
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    // Valores do contexto
    const value = {
        theme,
        toggleTheme
    };
    return (0, jsx_runtime_1.jsx)(ThemeContext.Provider, { value: value, children: children });
};
exports.ThemeProvider = ThemeProvider;
// Hook personalizado para usar o contexto de tema
const useTheme = () => {
    const context = (0, react_1.useContext)(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};
exports.useTheme = useTheme;
