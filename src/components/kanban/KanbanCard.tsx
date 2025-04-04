import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Todo } from '../../types/Todo';
import { FaCalendarAlt, FaTrash, FaCheck, FaClock, FaTag, FaProjectDiagram, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useProject } from '../../contexts/ProjectContext';

interface CardContainerProps {
  $completed?: boolean;
  $isDragging?: boolean;
}

const CardContainer = styled.div<CardContainerProps>`
  background-color: ${props => props.$isDragging ? 'var(--accent-light)' : 'var(--card-background)'};
  border-radius: 10px;
  box-shadow: ${props => props.$isDragging ? '0 8px 20px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  padding: 1rem;
  cursor: grab;
  transition: all 0.2s ease-in-out;
  border-left: 3px solid var(--accent-color);
  position: relative;
  overflow: hidden;
  transform: ${props => props.$isDragging ? 'rotate(1deg)' : 'none'};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    cursor: grabbing;
    transform: translateY(0);
  }
  
  ${props => props.$completed && `
    opacity: 0.8;
    border-left-color: var(--success-color);
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, transparent 95%, var(--success-color) 95%);
      z-index: 0;
      pointer-events: none;
    }
  `}
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

interface CardTitleProps {
  $completed?: boolean;
}

const CardTitle = styled.h4<CardTitleProps>`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-primary);
  word-break: break-word;
  font-weight: 600;
  display: flex;
  align-items: flex-start;
  
  ${props => props.$completed && `
    text-decoration: line-through;
    color: var(--text-secondary);
  `}
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const CompletedIcon = styled(FaCheck)`
  color: var(--success-color);
  margin-right: 0.5rem;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const CardDescription = styled.p`
  margin: 0 0 0.8rem 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.6rem;
  }
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    margin-bottom: 0.6rem;
    gap: 0.4rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-secondary);
  background-color: var(--background-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  
  svg {
    margin-right: 0.3rem;
    font-size: 0.7rem;
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    
    svg {
      font-size: 0.65rem;
    }
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const CardPriority = styled.span<{ priority: 'baixa' | 'média' | 'alta' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  
  ${props => {
    switch (props.priority) {
      case 'baixa':
        return `
          background-color: var(--success-light);
          color: var(--success-color);
        `;
      case 'média':
        return `
          background-color: var(--warning-light);
          color: var(--warning-color);
        `;
      case 'alta':
        return `
          background-color: var(--error-light);
          color: var(--error-color);
        `;
      default:
        return '';
    }
  }}
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: opacity 0.2s;
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
  
  /* Em dispositivos móveis, manter sempre visível */
  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--error-light);
  }
  
  /* Em dispositivos móveis, área de clique maior */
  @media (max-width: 768px) {
    padding: 0.4rem;
  }
`;

const ProjectIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--accent-dark);
  background-color: var(--accent-light);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
  
  svg {
    margin-right: 0.3rem;
    font-size: 0.7rem;
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    
    svg {
      font-size: 0.65rem;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const successAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const ActionButton = styled.button<{ $isSuccess?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: ${props => props.$isSuccess ? 'var(--success-color)' : 'var(--text-secondary)'};
  animation: ${props => props.$isSuccess ? `${successAnimation} 0.5s ease` : 'none'};
  
  &:hover {
    background-color: var(--hover-background);
    color: ${props => props.$isSuccess ? 'var(--success-color)' : 'var(--accent-color)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StatusMessage = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease;
`;

const WarningMessage = styled(StatusMessage)`
  color: var(--warning-color);
  background-color: var(--warning-light);
`;

const ErrorMessage = styled(StatusMessage)`
  color: var(--error-color);
  background-color: var(--error-light);
`;

const SuccessMessage = styled(StatusMessage)`
  color: var(--success-color);
  background-color: var(--success-light);
`;

const ActionButtonWrapper = styled.div`
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--background-primary);
  color: var(--text-primary);
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 10;
  margin-bottom: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: var(--background-primary) transparent transparent transparent;
  }
  
  ${ActionButtonWrapper}:hover & {
    opacity: 1;
  }
`;

interface KanbanCardProps {
  todo: Todo;
  index: number;
  onClick: () => void;
  onRemove: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ todo, index, onClick, onRemove }) => {
  const { projects, advanceTaskStatus, regressTaskStatus } = useProject();
  const [isDragging, setIsDragging] = useState(false);
  const [advanceError, setAdvanceError] = useState<string | null>(null);
  const [advanceSuccess, setAdvanceSuccess] = useState(false);
  const [regressSuccess, setRegressSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isRegressing, setIsRegressing] = useState(false);
  
  // Encontrar o projeto associado à tarefa
  const associatedProject = todo.projectId ? projects.find(project => project.id === todo.projectId) : null;
  
  // Encontrar a coluna atual e a próxima (se houver)
  const currentProject = associatedProject;
  const currentColumn = currentProject?.columns.find(col => col.id === todo.columnId);
  
  // Verificar se é a última ou a primeira coluna
  const sortedColumns = currentProject?.columns.sort((a, b) => a.order - b.order) || [];
  const currentColumnIndex = sortedColumns.findIndex(col => col.id === todo.columnId);
  const isLastColumn = currentColumnIndex === sortedColumns.length - 1;
  const isFirstColumn = currentColumnIndex === 0;

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove();
  };
  
  const handleAdvanceStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!todo.projectId || !todo.columnId) {
      setAdvanceError('Tarefa não está associada a um projeto ou coluna');
      setTimeout(() => setAdvanceError(null), 3000);
      return;
    }
    
    if (isLastColumn) {
      setAdvanceError('Tarefa já está na última coluna');
      setTimeout(() => setAdvanceError(null), 3000);
      return;
    }
    
    setIsAdvancing(true);
    
    try {
      const result = advanceTaskStatus(todo.id);
      if (!result.success) {
        setAdvanceError(result.message || 'Não foi possível avançar o status');
        setTimeout(() => setAdvanceError(null), 3000);
      } else {
        setAdvanceSuccess(true);
        
        // Verificar se há mensagem de alerta no resultado de sucesso
        if (result.message && result.message.startsWith('Atenção:')) {
          // Exibir como alerta em vez de mensagem de sucesso
          setAdvanceError(result.message);
          setTimeout(() => setAdvanceError(null), 3000);
        } else {
          setSuccessMessage(result.message || 'Status avançado com sucesso!');
          setTimeout(() => {
            setSuccessMessage(null);
          }, 2000);
        }
        
        setTimeout(() => {
          setAdvanceSuccess(false);
        }, 1000);
      }
    } catch (error) {
      setAdvanceError('Erro ao avançar status');
      setTimeout(() => setAdvanceError(null), 3000);
    } finally {
      setIsAdvancing(false);
    }
  };
  
  const handleRegressStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!todo.projectId || !todo.columnId) {
      setAdvanceError('Tarefa não está associada a um projeto ou coluna');
      setTimeout(() => setAdvanceError(null), 3000);
      return;
    }
    
    if (isFirstColumn) {
      setAdvanceError('Tarefa já está na primeira coluna');
      setTimeout(() => setAdvanceError(null), 3000);
      return;
    }
    
    setIsRegressing(true);
    
    try {
      const result = regressTaskStatus(todo.id);
      if (!result.success) {
        setAdvanceError(result.message || 'Não foi possível retornar o status');
        setTimeout(() => setAdvanceError(null), 3000);
      } else {
        setRegressSuccess(true);
        setSuccessMessage(result.message || 'Status retornado com sucesso!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
        
        setTimeout(() => {
          setRegressSuccess(false);
        }, 1000);
      }
    } catch (error) {
      setAdvanceError('Erro ao retornar status');
      setTimeout(() => setAdvanceError(null), 3000);
    } finally {
      setIsRegressing(false);
    }
  };
  
  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };
  
  // Função que verifica se a data está no passado
  const isPastDue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };
  
  // Calculate days until due date
  const getDaysUntilDue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return Math.abs(diffDays);
    return diffDays;
  };
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Evita que o clique no botão de exclusão inicie o arrasto
    if ((e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      return;
    }
    
    // Armazenar os dados no formato de texto
    e.dataTransfer.setData('text/plain', JSON.stringify({
      todoId: todo.id,
      sourceColumnId: todo.columnId,
      sourceIndex: index
    }));
    
    setIsDragging(true);
    console.log(`Iniciando arrasto da tarefa ${todo.id}`);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    console.log(`Arrasto da tarefa ${todo.id} finalizado`);
  };
  
  return (
    <CardContainer
      $completed={todo.completed}
      $isDragging={isDragging}
      onClick={onClick}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-todo-id={todo.id}
      data-column-id={todo.columnId}
      data-index={index}
    >
      <CardContent>
        <CardTitle $completed={todo.completed}>
          {todo.completed && <CompletedIcon />}
          {todo.title}
        </CardTitle>
        
        {todo.description && <CardDescription>{todo.description}</CardDescription>}
        
        <CardMeta>
          {todo.date && (
            <MetaItem>
              <FaCalendarAlt />
              <span>{formatDate(todo.date)}</span>
            </MetaItem>
          )}
          {todo.category && (
            <MetaItem>
              <FaTag />
              <span>{todo.category}</span>
            </MetaItem>
          )}
          {!todo.completed && isPastDue() && (
            <MetaItem style={{ 
              color: 'var(--error-color)',
              fontWeight: 'bold'
            }}>
              <FaClock />
              <span>{getDaysUntilDue(todo.date)} dias atrasado</span>
            </MetaItem>
          )}
        </CardMeta>
        
        {/* Indicador de projeto */}
        {associatedProject && (
          <ProjectIndicator>
            <FaProjectDiagram />
            <span>{associatedProject.name}</span>
          </ProjectIndicator>
        )}
        
        <CardFooter>
          <CardPriority priority={todo.priority}>
            {todo.priority}
          </CardPriority>
          
          <CardActions>
            <ActionButtons>
              <ActionButtonWrapper>
                <ActionButton 
                  onClick={handleRegressStatus}
                  title={isFirstColumn ? "Já está na primeira coluna" : "Voltar para etapa anterior"}
                  aria-label={isFirstColumn ? "Já está na primeira coluna" : "Voltar para etapa anterior"}
                  disabled={isFirstColumn || isRegressing}
                  $isSuccess={regressSuccess}
                >
                  <FaArrowLeft size={14} />
                </ActionButton>
                {!isFirstColumn && currentProject && (
                  <Tooltip>
                    Voltar para: {
                      sortedColumns
                        [currentColumnIndex - 1]?.title || ''
                    }
                  </Tooltip>
                )}
              </ActionButtonWrapper>

              <ActionButtonWrapper>
                <ActionButton 
                  onClick={handleAdvanceStatus}
                  title={isLastColumn ? "Já está na última coluna" : "Avançar para próxima etapa"}
                  aria-label={isLastColumn ? "Já está na última coluna" : "Avançar para próxima etapa"}
                  disabled={isLastColumn || isAdvancing}
                  $isSuccess={advanceSuccess}
                >
                  <FaArrowRight size={14} />
                </ActionButton>
                {!isLastColumn && currentProject && (
                  <Tooltip>
                    Mover para: {
                      sortedColumns
                        [currentColumnIndex + 1]?.title || ''
                    }
                  </Tooltip>
                )}
              </ActionButtonWrapper>
              
              <DeleteButton 
                onClick={handleRemoveClick} 
                title="Remover da coluna"
                aria-label="Remover tarefa da coluna"
              >
                <FaTrash size={14} />
              </DeleteButton>
            </ActionButtons>
          </CardActions>
        </CardFooter>
        
        {advanceError && (
          advanceError.startsWith('Atenção:') ? (
            <WarningMessage>
              {advanceError}
            </WarningMessage>
          ) : (
            <ErrorMessage>
              {advanceError}
            </ErrorMessage>
          )
        )}
        
        {successMessage && (
          <SuccessMessage>
            {successMessage}
          </SuccessMessage>
        )}
      </CardContent>
    </CardContainer>
  );
};

export default KanbanCard; 