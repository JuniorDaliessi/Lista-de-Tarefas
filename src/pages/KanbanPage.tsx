import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEllipsisV, FaFilter, FaInfoCircle, FaColumns, FaSearch, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTodo } from '../contexts/TodoContext';
import { useProject } from '../contexts/ProjectContext';
import { Project } from '../types/Project';
import { Todo } from '../types/Todo';
import KanbanBoard from '../components/kanban/KanbanBoard';
import KanbanColumn from '../components/kanban/KanbanColumn';
import KanbanCard from '../components/kanban/KanbanCard';
import ProjectSelector from '../components/kanban/ProjectSelector';
import CreateProjectModal from '../components/kanban/CreateProjectModal';
import EditProjectModal from '../components/kanban/EditProjectModal';
import CreateColumnModal from '../components/kanban/CreateColumnModal';
import KanbanFilters from '../components/kanban/KanbanFilters';
import KanbanMetrics from '../components/kanban/KanbanMetrics';
import { DropResult } from 'react-beautiful-dnd';

// Styled Components
const KanbanPageContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    padding: 0 1.2rem 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 0 1rem 1rem;
    height: auto;
    min-height: calc(100vh - 80px);
  }
  
  @media (max-width: 480px) {
    padding: 0 0.5rem 0.8rem;
  }
`;

const PageHeader = styled.header`
  margin-bottom: 1.5rem;
  background: var(--background-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    border-radius: 8px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
`;

const Title = styled.h1`
  color: var(--text-primary);
  font-size: 2.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--accent-color);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    
    &::after {
      bottom: -6px;
      width: 30px;
      height: 2px;
    }
  }
`;

const TitleIcon = styled(FaColumns)`
  color: var(--accent-color);
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    
    > button {
      flex: 1;
      min-width: calc(50% - 0.25rem);
      justify-content: center;
    }
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--accent-color);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: var(--accent-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
    white-space: nowrap;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: var(--background-secondary);
  color: var(--text-primary);
  
  &:hover {
    background-color: var(--hover-background);
  }
`;

const ToggleButton = styled(SecondaryButton)<{ active: boolean }>`
  background-color: ${props => props.active ? 'var(--accent-color)' : 'var(--background-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--accent-dark)' : 'var(--hover-background)'};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    max-width: 100%;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--background-primary);
  font-size: 0.9rem;
  width: 100%;
  color: var(--text-primary);
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.2);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ClearSearchIcon = styled(FaTimes)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const SelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: var(--background-primary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    border-radius: 8px;
  }
`;

const ProjectDetails = styled.div`
  flex: 1;
`;

const ProjectName = styled.h2`
  margin: 0 0 0.3rem 0;
  font-size: 1.6rem;
  color: var(--text-primary);
`;

const ProjectDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const StyledMore = styled(FaEllipsisV)`
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 50%;
  background: var(--background-secondary);
  transition: all 0.2s;
  
  &:hover {
    color: var(--text-primary);
    background: var(--hover-background);
  }
`;

const KanbanContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: var(--background-secondary);
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    min-height: 500px;
    overflow: visible;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    min-height: 450px;
  }
`;

const PanelContainer = styled.div<{ show: boolean }>`
  max-height: ${props => props.show ? '300px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  margin-bottom: ${props => props.show ? '1rem' : '0'};
  border-radius: 12px;
  background: var(--background-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    max-height: ${props => props.show ? '350px' : '0'};
  }
  
  @media (max-width: 480px) {
    border-radius: 8px;
    max-height: ${props => props.show ? '400px' : '0'};
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--background-secondary);
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  
  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    border-radius: 8px 8px 0 0;
  }
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PanelContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
  }
`;

const NoProjectMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--background-primary);
  border-radius: 12px;
  font-size: 1.1rem;
  color: var(--text-primary);
  animation: fadeIn 0.5s ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  h3 {
    font-size: 1.8rem;
    margin: 0;
    color: var(--accent-color);
  }
  
  p {
    color: var(--text-secondary);
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  button {
    margin-top: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    
    h3 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 0.95rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
    border-radius: 8px;
    
    h3 {
      font-size: 1.3rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const AddColumnButton = styled(ActionButton)`
  min-width: 280px;
  height: 80px;
  margin-top: 36px;
  border: 2px dashed var(--border-color);
  background: var(--background-primary);
  color: var(--text-secondary);
  transition: all 0.2s;
  align-self: flex-start;
  
  &:hover {
    border-color: var(--accent-color);
    color: var(--accent-color);
    background: var(--background-primary);
  }
  
  @media (max-width: 768px) {
    min-width: 260px;
    height: 70px;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    min-width: 85vw;
    width: 85vw;
    height: 60px;
    margin-top: 15px;
    font-size: 0.85rem;
  }
`;

const KanbanPage: React.FC = () => {
  const navigate = useNavigate();
  const { todos, filteredTodos, categories } = useTodo();
  const { 
    projects, 
    activeProjectId, 
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    addColumn,
    updateColumn,
    deleteColumn,
    addTodoToProject,
    removeTodoFromProject,
    moveTodoToColumn,
    reorderTodoInColumn,
    getLeadTime,
    getCycleTime
  } = useProject();
  
  // Local state
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showCreateColumnModal, setShowCreateColumnModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get current project
  const currentProject = projects.find(p => p.id === activeProjectId) || null;
  
  // Filter todos that belong to the current project
  const projectTodos = todos.filter(todo => 
    todo.projectId === activeProjectId &&
    (priorityFilter ? todo.priority === priorityFilter : true) &&
    (categoryFilter ? todo.category === categoryFilter : true) &&
    (searchTerm ? todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 todo.description.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );
  
  // Group todos by column
  const todosByColumn = projectTodos.reduce<Record<string, Todo[]>>((acc, todo) => {
    if (todo.columnId) {
      if (!acc[todo.columnId]) {
        acc[todo.columnId] = [];
      }
      acc[todo.columnId].push(todo);
    }
    return acc;
  }, {});
  
  // Sort todos in each column by order
  Object.keys(todosByColumn).forEach(columnId => {
    todosByColumn[columnId].sort((a, b) => (a.order || 0) - (b.order || 0));
  });
  
  // Handler for creating a new project
  const handleCreateProject = useCallback((name: string, description: string) => {
    const newProject = createProject(name, description);
    setActiveProjectId(newProject.id);
    setShowCreateProjectModal(false);
  }, [createProject, setActiveProjectId]);
  
  // Handler for updating a project
  const handleUpdateProject = useCallback((project: Project) => {
    updateProject(project);
    setShowEditProjectModal(false);
  }, [updateProject]);
  
  // Handler for deleting a project
  const handleDeleteProject = useCallback((id: string) => {
    deleteProject(id);
    setShowEditProjectModal(false);
  }, [deleteProject]);
  
  // Handler for creating a column
  const handleCreateColumn = useCallback((title: string, wipLimit?: number) => {
    if (activeProjectId) {
      addColumn(activeProjectId, title, wipLimit);
      setShowCreateColumnModal(false);
    }
  }, [activeProjectId, addColumn]);
  
  // Handler for dragging a task between columns
  const handleDragTask = useCallback((
    todoId: string, 
    sourceColumnId: string, 
    destinationColumnId: string,
    newIndex: number
  ) => {
    // Check WIP limit before moving
    if (currentProject) {
      const targetColumn = currentProject.columns.find(col => col.id === destinationColumnId);
      
      if (targetColumn?.wipLimit !== undefined) {
        const currentTasksInColumn = todosByColumn[destinationColumnId]?.length || 0;
        
        // If dragging to a different column and WIP limit would be exceeded
        if (sourceColumnId !== destinationColumnId && currentTasksInColumn >= targetColumn.wipLimit) {
          alert(`WIP limit of ${targetColumn.wipLimit} reached for column "${targetColumn.title}".`);
          return;
        }
      }
    }
    
    if (sourceColumnId === destinationColumnId) {
      // Reordering within the same column
      reorderTodoInColumn(todoId, newIndex);
    } else {
      // Moving to a different column
      moveTodoToColumn(todoId, destinationColumnId, newIndex);
    }
  }, [currentProject, todosByColumn, reorderTodoInColumn, moveTodoToColumn]);
  
  // Handler for adding an existing task to the project
  const handleAddTaskToProject = useCallback((todoId: string) => {
    if (activeProjectId && currentProject) {
      // Get the first column
      const firstColumn = currentProject.columns.sort((a, b) => a.order - b.order)[0];
      if (firstColumn) {
        addTodoToProject(activeProjectId, todoId, firstColumn.id);
      }
    }
  }, [activeProjectId, currentProject, addTodoToProject]);
  
  // Handler for creating a new task and adding it directly to the project
  const handleCreateNewTask = useCallback((columnId: string) => {
    // Navigate to the task creation page with pre-filled project and column
    if (activeProjectId) {
      navigate(`/nova-tarefa?projectId=${activeProjectId}&columnId=${columnId}`);
    }
  }, [activeProjectId, navigate]);
  
  // Handler for clicking on a task
  const handleTaskClick = useCallback((todoId: string) => {
    navigate(`/tarefa/${todoId}`);
  }, [navigate]);
  
  // Handler for removing a task from the project
  const handleRemoveTaskFromProject = useCallback((todoId: string) => {
    if (activeProjectId) {
      removeTodoFromProject(activeProjectId, todoId);
    }
  }, [activeProjectId, removeTodoFromProject]);
  
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);
  
  // Toggle filters and metrics panels
  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
    if (showMetrics && !showFilters) setShowMetrics(false);
  }, [showFilters, showMetrics]);
  
  const toggleMetrics = useCallback(() => {
    setShowMetrics(!showMetrics);
    if (showFilters && !showMetrics) setShowFilters(false);
  }, [showFilters, showMetrics]);
  
  // Dentro do componente KanbanPage, adicione o handler para onDragEnd
  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Se não houver destino válido (arrastado para fora de uma coluna) ou se a posição não mudar
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Verifica se o projeto está selecionado
    if (!currentProject || !activeProjectId) {
      return;
    }
    
    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;
    const todoId = draggableId;
    
    // Verificar limites WIP se estiver movendo para uma coluna diferente
    if (sourceColumnId !== destinationColumnId) {
      const targetColumn = currentProject.columns.find(col => col.id === destinationColumnId);
      if (targetColumn && targetColumn.wipLimit !== undefined) {
        const currentTasksInColumn = todosByColumn[destinationColumnId]?.length || 0;
        
        // Se o limite WIP seria excedido
        if (currentTasksInColumn >= targetColumn.wipLimit) {
          alert(`Limite WIP de ${targetColumn.wipLimit} atingido para a coluna "${targetColumn.title}".`);
          return;
        }
      }
    }
    
    // Mover a tarefa
    if (sourceColumnId === destinationColumnId) {
      // Reordenar na mesma coluna
      reorderTodoInColumn(todoId, destination.index);
    } else {
      // Mover para outra coluna
      moveTodoToColumn(todoId, destinationColumnId, destination.index);
    }
  }, [currentProject, activeProjectId, todosByColumn, reorderTodoInColumn, moveTodoToColumn]);
  
  // Render project creation message when no projects exist
  if (projects.length === 0) {
    return (
      <KanbanPageContainer>
        <PageHeader>
          <TopBar>
            <Title><TitleIcon /> Kanban Board</Title>
          </TopBar>
        </PageHeader>
        
        <NoProjectMessage>
          <h3>Bem-vindo ao Kanban!</h3>
          <p>O método Kanban ajuda você a visualizar seu trabalho, limitar o trabalho em progresso e maximizar a eficiência. Crie seu primeiro projeto para começar a organizar suas tarefas de forma visual.</p>
          <ActionButton onClick={() => setShowCreateProjectModal(true)}>
            <FaPlus />
            Criar novo projeto
          </ActionButton>
        </NoProjectMessage>
        
        {showCreateProjectModal && (
          <CreateProjectModal 
            onClose={() => setShowCreateProjectModal(false)}
            onCreateProject={handleCreateProject}
          />
        )}
      </KanbanPageContainer>
    );
  }
  
  return (
    <KanbanPageContainer>
      <PageHeader>
        <TopBar>
          <TopBarLeft>
            <Title><TitleIcon /> Kanban</Title>
            <SearchContainer>
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tarefas..."
                aria-label="Buscar tarefas"
              />
              <SearchIcon />
              {searchTerm && <ClearSearchIcon onClick={handleClearSearch} />}
            </SearchContainer>
          </TopBarLeft>
          
          <ActionsContainer>
            <ToggleButton 
              active={showFilters} 
              onClick={toggleFilters}
              aria-label="Mostrar filtros"
              aria-pressed={showFilters}
            >
              <FaFilter />
              Filtros
            </ToggleButton>
            
            <ToggleButton 
              active={showMetrics} 
              onClick={toggleMetrics}
              aria-label="Mostrar métricas"
              aria-pressed={showMetrics}
            >
              <FaInfoCircle />
              Métricas
            </ToggleButton>
            
            <ActionButton onClick={() => setShowCreateProjectModal(true)}>
              <FaPlus />
              Novo Projeto
            </ActionButton>
          </ActionsContainer>
        </TopBar>
        
        <SelectorRow>
          <ProjectSelector 
            projects={projects} 
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
          />
        </SelectorRow>
      </PageHeader>
      
      {currentProject ? (
        <>
          <ProjectInfo>
            <ProjectDetails>
              <ProjectName>{currentProject.name}</ProjectName>
              <ProjectDescription>{currentProject.description}</ProjectDescription>
            </ProjectDetails>
            <ProjectActions>
              <StyledMore onClick={() => setShowEditProjectModal(true)} title="Editar projeto" />
            </ProjectActions>
          </ProjectInfo>
          
          <PanelContainer show={showFilters}>
            <PanelHeader onClick={toggleFilters}>
              <PanelTitle>
                <FaFilter /> Filtros
              </PanelTitle>
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </PanelHeader>
            {showFilters && (
              <PanelContent>
                <KanbanFilters 
                  priorityFilter={priorityFilter}
                  categoryFilter={categoryFilter}
                  onChangePriority={setPriorityFilter}
                  onChangeCategory={setCategoryFilter}
                  categories={categories}
                />
              </PanelContent>
            )}
          </PanelContainer>
          
          <PanelContainer show={showMetrics}>
            <PanelHeader onClick={toggleMetrics}>
              <PanelTitle>
                <FaInfoCircle /> Métricas
              </PanelTitle>
              {showMetrics ? <FaChevronUp /> : <FaChevronDown />}
            </PanelHeader>
            {showMetrics && (
              <PanelContent>
                <KanbanMetrics 
                  project={currentProject}
                  todos={projectTodos}
                  getLeadTime={getLeadTime}
                  getCycleTime={getCycleTime}
                />
              </PanelContent>
            )}
          </PanelContainer>
          
          <KanbanContainer>
            <KanbanBoard onDragEnd={handleDragEnd}>
              {currentProject.columns
                .sort((a, b) => a.order - b.order)
                .map(column => {
                  const columnTasks = todosByColumn[column.id] || [];
                  
                  return (
                    <KanbanColumn
                      key={column.id}
                      id={column.id}
                      title={column.title}
                      wipLimit={column.wipLimit}
                      tasksCount={columnTasks.length}
                      onAddCard={() => handleCreateNewTask(column.id)}
                    >
                      {columnTasks.map((todo, index) => (
                        <KanbanCard
                          key={todo.id}
                          todo={todo}
                          index={index}
                          onClick={() => handleTaskClick(todo.id)}
                          onRemove={() => handleRemoveTaskFromProject(todo.id)}
                        />
                      ))}
                    </KanbanColumn>
                  );
                })}
              
              <AddColumnButton onClick={() => setShowCreateColumnModal(true)}>
                <FaPlus /> Adicionar Coluna
              </AddColumnButton>
            </KanbanBoard>
          </KanbanContainer>
        </>
      ) : (
        <NoProjectMessage>
          Selecione um projeto para visualizar o quadro Kanban.
        </NoProjectMessage>
      )}
      
      {/* Modals */}
      {showCreateProjectModal && (
        <CreateProjectModal 
          onClose={() => setShowCreateProjectModal(false)}
          onCreateProject={handleCreateProject}
        />
      )}
      
      {showEditProjectModal && currentProject && (
        <EditProjectModal 
          project={currentProject}
          onClose={() => setShowEditProjectModal(false)}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />
      )}
      
      {showCreateColumnModal && activeProjectId && (
        <CreateColumnModal 
          onClose={() => setShowCreateColumnModal(false)}
          onCreateColumn={handleCreateColumn}
        />
      )}
    </KanbanPageContainer>
  );
};

export default KanbanPage; 