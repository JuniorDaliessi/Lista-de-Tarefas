import React from 'react';
import styled from 'styled-components';
import { FaCheck, FaEdit, FaTrash, FaClock } from 'react-icons/fa';

const TodoItemContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease;
  border-left: 4px solid ${(props) => {
    switch (props.priority) {
      case 'alta':
        return '#e74c3c';
      case 'média':
        return '#f39c12';
      default:
        return '#2ecc71';
    }
  }};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TodoInfo = styled.div`
  flex: 1;
`;

const TodoTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
`;

const TodoDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const TodoMeta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #888;
  
  svg {
    margin-right: 4px;
  }
`;

const TodoActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.color || '#333'};
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TodoItem = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  const { id, title, description, completed, date, priority } = todo;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  return (
    <TodoItemContainer priority={priority}>
      <TodoInfo>
        <TodoTitle completed={completed}>{title}</TodoTitle>
        {description && <TodoDescription>{description}</TodoDescription>}
        {date && (
          <TodoMeta>
            <FaClock /> {formatDate(date)}
          </TodoMeta>
        )}
      </TodoInfo>
      
      <TodoActions>
        <IconButton 
          color={completed ? '#2ecc71' : '#333'} 
          onClick={() => onToggleComplete(id)}
          title={completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        >
          <FaCheck />
        </IconButton>
        
        <IconButton 
          color="#3498db" 
          onClick={() => onEdit(todo)}
          title="Editar tarefa"
        >
          <FaEdit />
        </IconButton>
        
        <IconButton 
          color="#e74c3c" 
          onClick={() => onDelete(id)}
          title="Excluir tarefa"
        >
          <FaTrash />
        </IconButton>
      </TodoActions>
    </TodoItemContainer>
  );
};

export default TodoItem; 