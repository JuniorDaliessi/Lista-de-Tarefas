import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaTag, FaFlag, FaCheck, FaTimes, FaTasks, FaChevronDown, FaChevronUp, FaTrash, FaEdit, FaProjectDiagram, FaColumns, FaExclamationTriangle } from 'react-icons/fa';
import { useTodo } from '../contexts/TodoContext';
import { useProject } from '../contexts/ProjectContext';
import TodoForm from '../components/TodoForm';

const TaskDetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 1rem;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  cursor: pointer;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const TaskCard = styled.div`
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--accent-color);
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const TaskTitle = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-right: 1rem;
  
  @media (max-width: 576px) {
    margin-bottom: 1rem;
  }
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.8rem;
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-secondary);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-md);
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-light);
    color: var(--accent-color);
  }
`;

const EditButton = styled(ActionButton)`
  background-color: var(--accent-light);
  color: var(--accent-color);
  
  &:hover {
    background-color: var(--accent-color);
    color: white;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
  
  &:hover {
    background-color: var(--error-color);
    color: white;
  }
`;

const CompleteButton = styled(ActionButton)<{ completed: boolean }>`
  background-color: ${props => props.completed ? 'rgba(76, 175, 80, 0.1)' : 'var(--background-secondary)'};
  color: ${props => props.completed ? 'var(--success-color)' : 'var(--text-secondary)'};
  
  &:hover {
    background-color: ${props => props.completed ? 'var(--success-color)' : 'var(--accent-light)'};
    color: ${props => props.completed ? 'white' : 'var(--accent-color)'};
  }
`;

const TaskDescription = styled.div`
  margin-bottom: 2rem;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
  
  p {
    margin: 0 0 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const TaskMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    color: var(--accent-color);
    margin-right: 0.8rem;
  }
`;

const MetaLabel = styled.span`
  color: var(--text-secondary);
  margin-right: 0.5rem;
`;

const MetaValue = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`;

const Badge = styled.span<{ variant: string }>`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.variant) {
      case 'alta':
        return 'rgba(244, 67, 54, 0.15)';
      case 'média':
        return 'rgba(255, 152, 0, 0.15)';
      case 'baixa':
        return 'rgba(76, 175, 80, 0.15)';
      default:
        return 'var(--accent-light)';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'alta':
        return 'var(--error-color)';
      case 'média':
        return 'var(--warning-color)';
      case 'baixa':
        return 'var(--success-color)';
      default:
        return 'var(--accent-color)';
    }
  }};
`;

const CompletionStatus = styled.div<{ completed: boolean }>`
  padding: 0.8rem;
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: 500;
  margin-bottom: 2rem;
  background-color: ${props => props.completed ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)'};
  color: ${props => props.completed ? 'var(--success-color)' : 'var(--error-color)'};
`;

const SubtasksContainer = styled.div`
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const SubtasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--background-secondary);
  cursor: pointer;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: var(--accent-color);
    }
  }
`;

const SubtasksList = styled.div`
  padding: 1rem 1.5rem;
`;

const SubtaskItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--border-color);
  opacity: ${props => props.completed ? 0.7 : 1};
  
  span {
    flex: 1;
    margin: 0 0.8rem;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SubtaskCheckbox = styled.div`
  width: 1.4rem;
  height: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--success-color);
`;

const SubtaskDeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const ProjectBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent-light);
  border-radius: var(--radius-md);
  color: var(--accent-dark);
  width: fit-content;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: var(--accent-color);
    color: white;
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const OverdueIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.8rem 1.2rem;
  background-color: var(--error-light);
  color: var(--error-color);
  font-weight: 600;
  border-radius: var(--radius-md);
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: 576px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
`;

const TaskDateMeta = styled(MetaItem)<{ isOverdue: boolean }>`
  ${props => props.isOverdue && `
    svg, ${MetaLabel}, ${MetaValue} {
      color: var(--error-color);
    }
    
    ${MetaValue} {
      font-weight: bold;
    }
  `}
`;

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dateString;
  }
};

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { todos, updateTodo, deleteTodo, toggleTodoCompletion, toggleSubtaskCompletion, deleteSubtask } = useTodo();
  const { projects, setActiveProjectId } = useProject();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(true);
  
  // Encontrar a tarefa pelo ID
  const todo = todos.find(todo => todo.id === id);
  
  // Encontrar o projeto associado à tarefa
  const associatedProject = todo?.projectId ? projects.find(project => project.id === todo.projectId) : null;
  
  // Verificar se a tarefa está em atraso
  const isOverdue = useCallback(() => {
    if (!todo || !todo.date || todo.completed) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.date);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  }, [todo]);

  // Calcular dias de atraso ou dias restantes
  const getDaysUntilDue = useCallback(() => {
    if (!todo || !todo.date) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.date);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Atrasado por ${Math.abs(diffDays)} dia(s)`;
    if (diffDays === 0) return 'Vence hoje';
    return `${diffDays} dia(s) restante(s)`;
  }, [todo]);
  
  // Redirecionar para a página inicial se a tarefa não for encontrada
  useEffect(() => {
    if (!todo && todos.length > 0) {
      navigate('/');
    }
  }, [todo, todos, navigate]);
  
  // Função para navegar para o quadro Kanban do projeto
  const navigateToKanban = () => {
    if (todo?.projectId) {
      setActiveProjectId(todo.projectId);
      navigate('/kanban');
    }
  };
  
  if (!todo) {
    return (
      <TaskDetailContainer>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft /> Voltar
        </BackButton>
        <p>Tarefa não encontrada</p>
      </TaskDetailContainer>
    );
  }
  
  const handleDeleteTodo = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTodo(todo.id);
      navigate('/');
    }
  };
  
  const handleToggleComplete = () => {
    toggleTodoCompletion(todo.id);
  };
  
  const completedSubtasks = todo.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = todo.subtasks.length;
  
  if (isEditing) {
    return (
      <TaskDetailContainer>
        <BackButton onClick={() => setIsEditing(false)}>
          <FaArrowLeft /> Cancelar edição
        </BackButton>
        <TodoForm 
          editTodo={todo} 
          onCancel={() => setIsEditing(false)} 
        />
      </TaskDetailContainer>
    );
  }
  
  return (
    <TaskDetailContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FaArrowLeft /> Voltar
      </BackButton>
      
      <TaskCard>
        <TaskHeader>
          <TaskTitle>{todo.title}</TaskTitle>
          
          <TaskActions>
            <CompleteButton 
              completed={todo.completed}
              onClick={handleToggleComplete}
              title={todo.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
            >
              {todo.completed ? <FaCheck /> : <FaTimes />}
            </CompleteButton>
            <EditButton onClick={() => setIsEditing(true)} title="Editar tarefa">
              <FaEdit />
            </EditButton>
            <DeleteButton onClick={handleDeleteTodo} title="Excluir tarefa">
              <FaTrash />
            </DeleteButton>
          </TaskActions>
        </TaskHeader>
        
        <CompletionStatus completed={todo.completed}>
          {todo.completed ? 'Tarefa Concluída' : 'Tarefa Pendente'}
        </CompletionStatus>
        
        {/* Indicador de atraso para tarefas não concluídas */}
        {isOverdue() && !todo.completed && (
          <OverdueIndicator>
            <FaExclamationTriangle />
            <span>{getDaysUntilDue()}</span>
          </OverdueIndicator>
        )}
        
        {todo.description && (
          <TaskDescription>
            <p>{todo.description}</p>
          </TaskDescription>
        )}
        
        <TaskMeta>
          <TaskDateMeta isOverdue={isOverdue()}>
            <FaCalendarAlt />
            <MetaLabel>Data:</MetaLabel>
            <MetaValue>{formatDate(todo.date)}</MetaValue>
          </TaskDateMeta>
          
          <MetaItem>
            <FaClock />
            <MetaLabel>Criada em:</MetaLabel>
            <MetaValue>{formatDate(todo.createdAt)}</MetaValue>
          </MetaItem>
          
          <MetaItem>
            <FaFlag />
            <MetaLabel>Prioridade:</MetaLabel>
            <MetaValue>
              <Badge variant={todo.priority}>{todo.priority}</Badge>
            </MetaValue>
          </MetaItem>
          
          {todo.category && (
            <MetaItem>
              <FaTag />
              <MetaLabel>Categoria:</MetaLabel>
              <MetaValue>
                <Badge variant="category">{todo.category}</Badge>
              </MetaValue>
            </MetaItem>
          )}
        </TaskMeta>
        
        {/* Exibir o projeto associado e link para o Kanban */}
        {associatedProject && (
          <ProjectBadge onClick={navigateToKanban}>
            <FaProjectDiagram />
            <div>
              <strong>Projeto:</strong> {associatedProject.name}
            </div>
            <FaColumns style={{ marginLeft: 'auto' }} />
            <span>Ver no Kanban</span>
          </ProjectBadge>
        )}
        
        {todo.subtasks && todo.subtasks.length > 0 && (
          <SubtasksContainer>
            <SubtasksHeader onClick={() => setShowSubtasks(!showSubtasks)}>
              <h3>
                <FaTasks />
                Subtarefas ({completedSubtasks}/{totalSubtasks})
              </h3>
              {showSubtasks ? <FaChevronUp /> : <FaChevronDown />}
            </SubtasksHeader>
            
            {showSubtasks && (
              <SubtasksList>
                {todo.subtasks.map(subtask => (
                  <SubtaskItem key={subtask.id} completed={subtask.completed}>
                    <SubtaskCheckbox 
                      onClick={() => toggleSubtaskCompletion(todo.id, subtask.id)}
                    >
                      {subtask.completed ? <FaCheck /> : <div style={{ width: '1em', height: '1em', border: '1px solid var(--accent-color)', borderRadius: '50%' }} />}
                    </SubtaskCheckbox>
                    <span>{subtask.title}</span>
                    <SubtaskDeleteButton 
                      onClick={() => deleteSubtask(todo.id, subtask.id)}
                      title="Excluir subtarefa"
                    >
                      <FaTrash size={14} />
                    </SubtaskDeleteButton>
                  </SubtaskItem>
                ))}
              </SubtasksList>
            )}
          </SubtasksContainer>
        )}
      </TaskCard>
    </TaskDetailContainer>
  );
};

export default TaskDetailPage; 