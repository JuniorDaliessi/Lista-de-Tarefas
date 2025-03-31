import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';

const ColumnContainer = styled.div`
  background-color: var(--background-primary);
  border-radius: 10px;
  width: 280px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
  scroll-snap-align: start;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Highlight effect for columns */
  &:focus-within {
    box-shadow: 0 0 0 2px var(--accent-color), 0 4px 12px rgba(0, 0, 0, 0.1);
    outline: none;
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    min-width: 260px;
    width: 260px;
    scroll-snap-align: center;
  }
  
  @media (max-width: 480px) {
    min-width: 85vw;
    width: 85vw;
    max-height: none;
    margin-bottom: 0;
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
  position: sticky;
  top: 0;
  z-index: 2;
  
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
  
  @media (max-width: 480px) {
    max-width: 170px;
    font-size: 0.95rem;
  }
`;

const TaskCount = styled.span<{ isWipLimitReached?: boolean }>`
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  background-color: ${props => props.isWipLimitReached ? 'var(--error-light)' : 'var(--accent-light)'};
  color: ${props => props.isWipLimitReached ? 'var(--error-color)' : 'var(--accent-dark)'};
  font-weight: 600;
  transition: all 0.2s;
  flex-shrink: 0;
  
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

const CardsContainer = styled.div<{ isDraggingOver?: boolean, isEmpty?: boolean }>`
  padding: 1rem;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-height: 100px;
  max-height: calc(100vh - 300px);
  transition: background-color 0.2s ease;
  position: relative;
  background-color: ${props => 
    props.isDraggingOver ? 'var(--hover-background)' : 'transparent'};
  
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
  @media (max-width: 768px) {
    max-height: 60vh;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    gap: 0.6rem;
    max-height: 50vh;
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
  position: sticky;
  bottom: 0;
  background-color: var(--background-primary);
  z-index: 2;
  
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

const DropIndicator = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed var(--accent-color);
  border-radius: 8px;
  pointer-events: none;
  display: ${props => props.visible ? 'block' : 'none'};
  z-index: 1;
  background-color: rgba(var(--accent-rgb), 0.05);
`;

interface KanbanColumnProps {
  id: string;
  title: string;
  wipLimit?: number;
  tasksCount: number;
  children: ReactNode;
  onAddCard: () => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  wipLimit, 
  tasksCount,
  children, 
  onAddCard,
  onDragOver,
  onDrop
}) => {
  const isWipLimitReached = wipLimit !== undefined && tasksCount >= wipLimit;
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const isEmpty = React.Children.count(children) === 0;
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
    if (onDragOver) {
      onDragOver(e);
    }
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (onDrop) {
      onDrop(e);
    }
  };
  
  return (
    <ColumnContainer>
      <ColumnHeader>
        <ColumnTitle>{title}</ColumnTitle>
        <TaskCount isWipLimitReached={isWipLimitReached}>
          {tasksCount}{wipLimit !== undefined && `/${wipLimit}`}
        </TaskCount>
      </ColumnHeader>
      
      <CardsContainer
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-column-id={id}
        isDraggingOver={isDraggingOver}
        isEmpty={isEmpty}
      >
        {children}
        <DropIndicator visible={isDraggingOver} />
      </CardsContainer>
      
      <AddCardButton onClick={onAddCard}>
        <FaPlus /> Adicionar tarefa
      </AddCardButton>
    </ColumnContainer>
  );
};

export default KanbanColumn; 