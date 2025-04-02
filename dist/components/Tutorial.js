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
const TutorialOverlay = styled_components_1.default.div `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;
const TutorialModal = styled_components_1.default.div `
  background-color: var(--card-background);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  animation: fadeInScale 0.4s ease-out;
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
const TutorialHeader = styled_components_1.default.div `
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const TutorialTitle = styled_components_1.default.h2 `
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
`;
const CloseButton = styled_components_1.default.button `
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  padding: 0.5rem;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
  }
`;
const TutorialContent = styled_components_1.default.div `
  padding: 2rem 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 3px;
  }
`;
const TutorialStep = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const StepTitle = styled_components_1.default.h3 `
  margin: 0;
  font-size: 1.2rem;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;
const StepDescription = styled_components_1.default.p `
  margin: 0;
  color: var(--text-primary);
  line-height: 1.6;
`;
const StepImage = styled_components_1.default.div `
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem 0;
  box-shadow: var(--shadow-sm);
  
  svg {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }
`;
const ImageCaption = styled_components_1.default.div `
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 0.5rem;
`;
const TutorialFooter = styled_components_1.default.div `
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
`;
const ProgressIndicator = styled_components_1.default.div `
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
const ProgressDot = styled_components_1.default.div `
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--accent-color)' : 'var(--border-color)'};
  transition: background-color var(--transition-fast);
`;
const ButtonGroup = styled_components_1.default.div `
  display: flex;
  gap: 0.8rem;
`;
const TutorialButton = styled_components_1.default.button `
  display: flex;
  align-items: center;
  background-color: ${props => props.disabled ? 'var(--border-color)' : 'var(--accent-color)'};
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color var(--transition-fast), transform var(--transition-fast);
  
  svg {
    margin: 0 0.3rem;
  }
  
  &:hover:not(:disabled) {
    background-color: var(--accent-light);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;
const Tutorial = ({ onClose }) => {
    const [currentStep, setCurrentStep] = (0, react_1.useState)(0);
    const steps = [
        {
            title: 'Bem-vindo ao Todo App',
            icon: (0, jsx_runtime_1.jsx)(fa_1.FaClipboardList, {}),
            description: 'Gerencie suas tarefas com facilidade! Este tutorial rápido vai te mostrar como usar o aplicativo da melhor maneira.',
            image: (0, jsx_runtime_1.jsx)(fa_1.FaClipboardList, {}),
            caption: 'Organize suas tarefas diárias com facilidade e eficiência'
        },
        {
            title: 'Adicionando Tarefas',
            icon: (0, jsx_runtime_1.jsx)(fa_1.FaCheckCircle, {}),
            description: 'Use o formulário na parte superior para adicionar novas tarefas. Você pode definir título, descrição, data, prioridade e categoria.',
            image: (0, jsx_runtime_1.jsx)(fa_1.FaCheckCircle, {}),
            caption: 'Preencha os detalhes da tarefa e clique em "Adicionar Tarefa"'
        },
        {
            title: 'Filtrando e Ordenando',
            icon: (0, jsx_runtime_1.jsx)(fa_1.FaFilter, {}),
            description: 'Use os filtros para ver apenas tarefas pendentes ou concluídas. Você também pode ordenar por data, prioridade ou alfabeticamente.',
            image: (0, jsx_runtime_1.jsx)(fa_1.FaFilter, {}),
            caption: 'Encontre facilmente o que precisa com filtros personalizados'
        },
        {
            title: 'Modo Escuro/Claro',
            icon: (0, jsx_runtime_1.jsx)(fa_1.FaSun, {}),
            description: 'Alterne entre os temas claro e escuro de acordo com sua preferência usando o botão no canto superior direito da tela.',
            image: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaSun, {}), (0, jsx_runtime_1.jsx)(fa_1.FaMoon, {})] }),
            caption: 'Escolha o tema que mais combina com você'
        },
        {
            title: 'Modo Offline',
            icon: (0, jsx_runtime_1.jsx)(fa_1.FaCheckCircle, {}),
            description: 'O aplicativo funciona mesmo sem conexão com a internet! Suas alterações serão salvas localmente e sincronizadas quando você reconectar.',
            image: (0, jsx_runtime_1.jsx)(fa_1.FaCheckCircle, {}),
            caption: 'Continue gerenciando suas tarefas mesmo offline'
        }
    ];
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
        else if (e.key === 'ArrowRight') {
            handleNext();
        }
        else if (e.key === 'ArrowLeft') {
            handlePrevious();
        }
    };
    (0, react_1.useEffect)(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentStep]);
    const currentStepData = steps[currentStep];
    return ((0, jsx_runtime_1.jsx)(TutorialOverlay, { children: (0, jsx_runtime_1.jsxs)(TutorialModal, { role: "dialog", "aria-modal": "true", "aria-labelledby": "tutorial-title", children: [(0, jsx_runtime_1.jsxs)(TutorialHeader, { children: [(0, jsx_runtime_1.jsx)(TutorialTitle, { id: "tutorial-title", children: "Tutorial do Todo App" }), (0, jsx_runtime_1.jsx)(CloseButton, { onClick: onClose, "aria-label": "Fechar tutorial", children: (0, jsx_runtime_1.jsx)(fa_1.FaTimes, {}) })] }), (0, jsx_runtime_1.jsx)(TutorialContent, { children: (0, jsx_runtime_1.jsxs)(TutorialStep, { children: [(0, jsx_runtime_1.jsxs)(StepTitle, { children: [currentStepData.icon, currentStepData.title] }), (0, jsx_runtime_1.jsx)(StepDescription, { children: currentStepData.description }), (0, jsx_runtime_1.jsxs)(StepImage, { children: [currentStepData.image, (0, jsx_runtime_1.jsx)(ImageCaption, { children: currentStepData.caption })] })] }) }), (0, jsx_runtime_1.jsxs)(TutorialFooter, { children: [(0, jsx_runtime_1.jsx)(ProgressIndicator, { children: steps.map((_, index) => ((0, jsx_runtime_1.jsx)(ProgressDot, { active: index === currentStep }, index))) }), (0, jsx_runtime_1.jsxs)(ButtonGroup, { children: [(0, jsx_runtime_1.jsxs)(TutorialButton, { onClick: handlePrevious, disabled: currentStep === 0, "aria-label": "Etapa anterior", children: [(0, jsx_runtime_1.jsx)(fa_1.FaArrowLeft, {}), " Anterior"] }), currentStep < steps.length - 1 ? ((0, jsx_runtime_1.jsxs)(TutorialButton, { onClick: handleNext, "aria-label": "Pr\u00F3xima etapa", children: ["Pr\u00F3ximo ", (0, jsx_runtime_1.jsx)(fa_1.FaArrowRight, {})] })) : ((0, jsx_runtime_1.jsx)(TutorialButton, { onClick: onClose, "aria-label": "Concluir tutorial", children: "Come\u00E7ar a usar" }))] })] })] }) }));
};
exports.default = Tutorial;
