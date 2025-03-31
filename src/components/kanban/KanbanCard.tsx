import React from 'react';
import styled from 'styled-components';
import { Todo } from '../../types/Todo';
import { FaCalendarAlt, FaTrash, FaCheck, FaClock, FaTag, FaProjectDiagram } from 'react-icons/fa';
import { useProject } from '../../contexts/ProjectContext';

interface CardContainerProps {
  $completed?: boolean;
}

const CardContainer = styled.div<CardContainerProps>`
  background-color: var(--card-background);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-left: 3px solid var(--accent-color);
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  
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

interface KanbanCardProps {
  todo: Todo;
  index: number;
  onClick: () => void;
  onRemove: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ todo, index, onClick, onRemove }) => {
  const { projects } = useProject();
  
  // Encontrar o projeto associado à tarefa (mesmo que estejamos dentro de um projeto, 
  // isso mostra claramente a qual projeto a tarefa pertence)
  const associatedProject = todo.projectId ? projects.find(project => project.id === todo.projectId) : null;

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card click
    onRemove();
  };
  
  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };
  
  // Calculate days until due date
  const getDaysUntilDue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Atrasado por ${Math.abs(diffDays)} dia(s)`;
    if (diffDays === 0) return 'Vence hoje';
    return `${diffDays} dia(s) restante(s)`;
  };
  
  const isPastDue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };
  
  return (
    <CardContainer $completed={todo.completed} onClick={onClick}>
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
          {!todo.completed && (
            <MetaItem style={{ 
              color: isPastDue() ? 'var(--error-color)' : 'inherit',
              fontWeight: isPastDue() ? 'bold' : 'normal'
            }}>
              <FaClock />
              <span>{getDaysUntilDue(todo.date)}</span>
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
            <DeleteButton 
              onClick={handleRemoveClick} 
              title="Remover da coluna"
              aria-label="Remover tarefa da coluna"
            >
              <FaTrash size={14} />
            </DeleteButton>
          </CardActions>
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
};

export default KanbanCard;
export {}; 