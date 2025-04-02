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
const BoardContainer = styled_components_1.default.div `
  display: flex;
  overflow-x: auto;
  flex: 1;
  padding: 0.5rem;
  gap: 1rem;
  min-height: 500px;
  width: 100%;
  align-items: flex-start;
  scroll-snap-type: x mandatory;
  
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
  
  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 4px;
    
    &:hover {
      background-color: var(--text-secondary);
    }
  }
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  /* Responsividade para dispositivos móveis */
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    padding-bottom: 2rem;
    min-height: auto;
    padding: 0.5rem 0.5rem 2rem 0.5rem;
    -webkit-overflow-scrolling: touch; /* Melhor rolagem para iOS */
    align-items: stretch;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.3rem 0.3rem 2rem 0.3rem;
  }
`;
// Wrapper adicional para melhor controle do layout em dispositivos móveis
const BoardWrapper = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  
  /* Instruções de rolagem em dispositivos móveis */
  &::after {
    content: "";
    display: none;
  }
  
  @media (max-width: 768px) {
    &::after {
      content: "← Deslize para ver mais colunas →";
      display: block;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.8rem;
      padding: 0.5rem;
      font-style: italic;
      opacity: 0.7;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to bottom, transparent, var(--background-secondary));
      padding: 1rem 0 0.5rem;
    }
  }
`;
const ScrollButtons = styled_components_1.default.div `
  display: none;
  
  @media (min-width: 769px) {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 0.75rem;
  }
`;
const ScrollButton = styled_components_1.default.button `
  background-color: var(--background-primary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: var(--accent-color);
    color: white;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: var(--background-primary);
      color: var(--text-secondary);
      transform: none;
    }
  }
`;
const KanbanBoard = ({ children }) => {
    const boardRef = (0, react_1.useRef)(null);
    const handleScrollLeft = () => {
        if (boardRef.current) {
            boardRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };
    const handleScrollRight = () => {
        if (boardRef.current) {
            boardRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };
    return ((0, jsx_runtime_1.jsxs)(BoardWrapper, { children: [(0, jsx_runtime_1.jsx)(BoardContainer, { ref: boardRef, children: children }), (0, jsx_runtime_1.jsxs)(ScrollButtons, { children: [(0, jsx_runtime_1.jsx)(ScrollButton, { onClick: handleScrollLeft, "aria-label": "Rolar para a esquerda", children: "\u2190" }), (0, jsx_runtime_1.jsx)(ScrollButton, { onClick: handleScrollRight, "aria-label": "Rolar para a direita", children: "\u2192" })] })] }));
};
exports.default = KanbanBoard;
