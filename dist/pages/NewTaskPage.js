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
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const TodoForm_1 = __importDefault(require("../components/TodoForm"));
const ProjectContext_1 = require("../contexts/ProjectContext");
const PageContainer = styled_components_1.default.div `
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;
const PageHeader = styled_components_1.default.header `
  margin-bottom: 2rem;
`;
const Title = styled_components_1.default.h1 `
  color: var(--text-primary);
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;
const Subtitle = styled_components_1.default.p `
  color: var(--text-secondary);
  font-size: 1rem;
`;
const NewTaskPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [searchParams] = (0, react_router_dom_1.useSearchParams)();
    const { projects } = (0, ProjectContext_1.useProject)();
    // Get query parameters
    const projectId = searchParams.get('projectId');
    const columnId = searchParams.get('columnId');
    // State for project and column information
    const [projectName, setProjectName] = (0, react_1.useState)('');
    const [columnName, setColumnName] = (0, react_1.useState)('');
    // On component mount, get project and column names
    (0, react_1.useEffect)(() => {
        if (projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                setProjectName(project.name);
                if (columnId) {
                    const column = project.columns.find(c => c.id === columnId);
                    if (column) {
                        setColumnName(column.title);
                    }
                }
            }
        }
    }, [projectId, columnId, projects]);
    // Handle cancel button
    const handleCancel = () => {
        navigate(-1); // Go back to previous page
    };
    return ((0, jsx_runtime_1.jsxs)(PageContainer, { children: [(0, jsx_runtime_1.jsxs)(PageHeader, { children: [(0, jsx_runtime_1.jsx)(Title, { children: "Nova Tarefa" }), projectName && ((0, jsx_runtime_1.jsxs)(Subtitle, { children: ["Adicionando tarefa ao projeto \"", projectName, "\"", columnName && ` na coluna "${columnName}"`] }))] }), (0, jsx_runtime_1.jsx)(TodoForm_1.default, { onCancel: handleCancel, projectId: projectId || undefined, columnId: columnId || undefined })] }));
};
exports.default = NewTaskPage;
