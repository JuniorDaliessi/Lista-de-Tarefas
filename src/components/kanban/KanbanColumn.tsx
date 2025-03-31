import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';
import { Droppable } from 'react-beautiful-dnd';

const ColumnContainer = styled.div`
  background-color: var(--background-primary);
  border-radius: 10px;
  width: 280px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    min-width: 260px;
    width: 260px;
  }
  
  @media (max-width: 480px) {
    min-width: 85vw;
    width: 85vw;
    max-height: none;
    margin-bottom: 0.5rem;
  }
`;

const ColumnHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-secondary);
  border-radius: 10px 10px 0 0;
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const ColumnTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  line-height: 1.2;
`;

const TaskCount = styled.span<{ isWipLimitReached?: boolean }>`
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  background-color: ${props => props.isWipLimitReached ? 'var(--error-light)' : 'var(--accent-light)'};
  color: ${props => props.isWipLimitReached ? 'var(--error-color)' : 'var(--accent-dark)'};
  font-weight: 600;
  transition: all 0.2s;
  
  ${props => props.isWipLimitReached && `
    animation: pulse 1s infinite;
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  `}
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }
`;

const CardsContainer = styled.div<{ isDraggingOver: boolean }>`
  padding: 1rem;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background-color: ${props => props.isDraggingOver ? 'var(--hover-background)' : 'transparent'};
  min-height: 100px;
  transition: background-color 0.2s ease;
  
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 3px;
    
    &:hover {
      background-color: var(--text-secondary);
    }
  }
  
  /* Empty state */
  &:empty::after {
    content: 'Sem tarefas';
    display: block;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.9rem;
    padding: 2rem 0;
    font-style: italic;
    opacity: 0.7;
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    padding: 0.8rem;
    gap: 0.6rem;
    max-height: 60vh;
  }
`;

const AddCardButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.8rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  transition: all 0.2s;
  border-radius: 0 0 10px 10px;
  
  &:hover {
    background-color: var(--hover-background);
    color: var(--accent-color);
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.85rem;
  }
`;

interface KanbanColumnProps {
  id: string;
  title: string;
  wipLimit?: number;
  tasksCount: number;
  children: ReactNode;
  onAddCard: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  wipLimit, 
  tasksCount,
  children, 
  onAddCard 
}) => {
  const isWipLimitReached = wipLimit !== undefined && tasksCount >= wipLimit;
  
  return (
    <ColumnContainer>
      <ColumnHeader>
        <ColumnTitle>{title}</ColumnTitle>
        <TaskCount isWipLimitReached={isWipLimitReached}>
          {tasksCount}{wipLimit !== undefined && `/${wipLimit}`}
        </TaskCount>
      </ColumnHeader>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <CardsContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {children}
            {provided.placeholder}
          </CardsContainer>
        )}
      </Droppable>
      
      <AddCardButton onClick={onAddCard}>
        <FaPlus /> Adicionar tarefa
      </AddCardButton>
    </ColumnContainer>
  );
};

export default KanbanColumn;
export {}; 