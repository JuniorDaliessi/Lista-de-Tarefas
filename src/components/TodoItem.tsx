import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { Todo } from '../types/Todo';
import { useTodo } from '../contexts/TodoContext';
import TodoForm from './TodoForm';

interface TodoItemProps {
  todo: Todo;
}

const TodoContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
`;

const TodoTitle = styled.h3<{ completed: boolean }>`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
`;

const TodoDescription = styled.p<{ completed: boolean }>`
  margin: 0.5rem 0;
  color: #666;
  font-size: 1rem;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
`;

const TodoDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const TodoDetail = styled.span`
  display: flex;
  align-items: center;
  color: #666;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props) => {
    switch (props.priority) {
      case 'alta':
        return '#ffeded';
      case 'média':
        return '#fff8e0';
      case 'baixa':
      default:
        return '#e0f7ed';
    }
  }};
  color: ${(props) => {
    switch (props.priority) {
      case 'alta':
        return '#e53935';
      case 'média':
        return '#fb8c00';
      case 'baixa':
      default:
        return '#43a047';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  padding: 0.3rem;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;

const CheckButton = styled(ActionButton)<{ completed: boolean }>`
  color: ${(props) => (props.completed ? '#43a047' : '#666')};
  &:hover {
    color: #43a047;
  }
`;

const EditButton = styled(ActionButton)`
  &:hover {
    color: #0077ff;
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    color: #e53935;
  }
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

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodoCompletion, deleteTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleComplete = () => {
    toggleTodoCompletion(todo.id);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTodo(todo.id);
    }
  };

  if (isEditing) {
    return <TodoForm editTodo={todo} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <TodoContainer>
      <TodoHeader>
        <TodoTitle completed={todo.completed}>{todo.title}</TodoTitle>
        <ActionButtons>
          <CheckButton
            completed={todo.completed}
            onClick={handleToggleComplete}
            title={todo.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            <FaCheck />
          </CheckButton>
          <EditButton onClick={() => setIsEditing(true)} title="Editar tarefa">
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

      <TodoDetails>
        {todo.date && (
          <TodoDetail>
            <span>Data: {formatDate(todo.date)}</span>
          </TodoDetail>
        )}
        <TodoDetail>
          <PriorityBadge priority={todo.priority}>
            {todo.priority}
          </PriorityBadge>
        </TodoDetail>
      </TodoDetails>
    </TodoContainer>
  );
};

export default TodoItem; 