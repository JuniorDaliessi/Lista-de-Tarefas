import React, { useState, useCallback, memo } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaCheck, FaTag, FaClock, FaRegCalendarAlt } from 'react-icons/fa';
import { Todo } from '../types/Todo';
import { useTodo } from '../contexts/TodoContext';
import TodoForm from './TodoForm';

interface TodoItemProps {
  todo: Todo;
}

interface TodoContainerProps {
  priority: 'baixa' | 'média' | 'alta';
}

const TodoContainer = styled.div<TodoContainerProps>`
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  animation: slideUp var(--transition-normal);
  border-left: 4px solid ${props => {
    switch(props.priority) {
      case 'alta': return 'var(--error-color)';
      case 'média': return 'var(--warning-color)';
      case 'baixa': 
      default: return 'var(--success-color)';
    }
  }};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const TodoTitleWrapper = styled.div`
  flex: 1;
  margin-right: 1rem;
  
  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 0.8rem;
    width: 100%;
  }
`;

const TodoTitle = styled.h3<{ completed: boolean }>`
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
  word-break: break-word;
  transition: opacity var(--transition-fast), color var(--transition-fast);
`;

const TodoDescription = styled.p<{ completed: boolean }>`
  margin: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 1rem;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
  line-height: 1.5;
  transition: opacity var(--transition-fast);
`;

const TodoMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
  font-size: 0.85rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const TodoMetaItem = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  gap: 0.3rem;
  
  svg {
    color: var(--accent-color);
    font-size: 0.9rem;
  }
`;

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--accent-color);
  color: white;
  gap: 0.3rem;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-light);
  }
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  gap: 0.3rem;
  background-color: ${(props) => {
    switch (props.priority) {
      case 'alta':
        return 'rgba(244, 67, 54, 0.15)';
      case 'média':
        return 'rgba(255, 152, 0, 0.15)';
      case 'baixa':
      default:
        return 'rgba(76, 175, 80, 0.15)';
    }
  }};
  color: ${(props) => {
    switch (props.priority) {
      case 'alta':
        return 'var(--error-color)';
      case 'média':
        return 'var(--warning-color)';
      case 'baixa':
      default:
        return 'var(--success-color)';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  padding: 0.4rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    background-color: var(--hover-background);
    color: var(--text-primary);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CheckButton = styled(ActionButton)<{ completed: boolean }>`
  color: ${(props) => (props.completed ? 'var(--success-color)' : 'var(--text-secondary)')};
  &:hover {
    color: var(--success-color);
  }
`;

const EditButton = styled(ActionButton)`
  &:hover {
    color: var(--accent-color);
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    color: var(--error-color);
  }
`;

const CompletionStatus = styled.div<{ completed: boolean }>`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => props.completed ? 'rgba(76, 175, 80, 0.1)' : 'rgba(79, 134, 247, 0.1)'};
  color: ${props => props.completed ? 'var(--success-color)' : 'var(--accent-color)'};
  width: fit-content;
`;

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return 'Data inválida';
  }
};

// Calcular quanto tempo faz desde a criação
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  
  if (diffInSeconds < minute) {
    return 'agora mesmo';
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
  } else if (diffInSeconds < week) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
  } else if (diffInSeconds < month) {
    const weeks = Math.floor(diffInSeconds / week);
    return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
  } else {
    return formatDate(dateString);
  }
};

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodoCompletion, deleteTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);

  // Memoizando os handlers com useCallback
  const handleToggleComplete = useCallback(() => {
    toggleTodoCompletion(todo.id);
  }, [toggleTodoCompletion, todo.id]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTodo(todo.id);
    }
  }, [deleteTodo, todo.id]);

  const handleSetEditing = useCallback((value: boolean) => {
    setIsEditing(value);
  }, []);

  if (isEditing) {
    return <TodoForm editTodo={todo} onCancel={() => handleSetEditing(false)} />;
  }

  return (
    <TodoContainer priority={todo.priority}>
      <TodoHeader>
        <TodoTitleWrapper>
          <TodoTitle completed={todo.completed}>{todo.title}</TodoTitle>
        </TodoTitleWrapper>
        <ActionButtons>
          <CheckButton
            completed={todo.completed}
            onClick={handleToggleComplete}
            title={todo.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            <FaCheck />
          </CheckButton>
          <EditButton onClick={() => handleSetEditing(true)} title="Editar tarefa">
            <FaEdit />
          </EditButton>
          <DeleteButton onClick={handleDelete} title="Excluir tarefa">
            <FaTrash />
          </DeleteButton>
        </ActionButtons>
      </TodoHeader>

      {todo.description && (
        <TodoDescription completed={todo.completed}>
          {todo.description}
        </TodoDescription>
      )}

      <TodoMeta>
        {todo.date && (
          <TodoMetaItem>
            <FaRegCalendarAlt />
            <span>{formatDate(todo.date)}</span>
          </TodoMetaItem>
        )}
        
        <TodoMetaItem>
          <FaClock />
          <span>Criado {getTimeAgo(todo.createdAt)}</span>
        </TodoMetaItem>
        
        <TodoMetaItem>
          <PriorityBadge priority={todo.priority}>
            {todo.priority}
          </PriorityBadge>
        </TodoMetaItem>
        
        {todo.category && (
          <TodoMetaItem>
            <CategoryBadge>
              <FaTag size={10} />
              {todo.category}
            </CategoryBadge>
          </TodoMetaItem>
        )}
      </TodoMeta>
      
      <CompletionStatus completed={todo.completed}>
        {todo.completed ? 'Tarefa concluída' : 'Tarefa pendente'}
      </CompletionStatus>
    </TodoContainer>
  );
};

// Exportando com memo para evitar re-renderizações desnecessárias
export default memo(TodoItem); 