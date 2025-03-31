import React, { ReactNode } from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: flex;
  overflow-x: auto;
  flex: 1;
  padding: 0.5rem;
  gap: 1rem;
  min-height: 500px;
  
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
  
  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 4px;
    
    &:hover {
      background-color: var(--text-secondary);
    }
  }
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  /* Responsividade para dispositivos móveis */
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    padding-bottom: 1rem;
    min-height: auto;
    padding: 0.5rem 0.5rem 1.5rem 0.5rem;
    -webkit-overflow-scrolling: touch; /* Melhor rolagem para iOS */
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.3rem 0.3rem 1.5rem 0.3rem;
  }
`;

// Wrapper adicional para melhor controle do layout em dispositivos móveis
const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  
  /* Instruções de rolagem em dispositivos móveis */
  &::after {
    content: "";
    display: none;
  }
  
  @media (max-width: 768px) {
    &::after {
      content: "← Deslize para ver mais colunas →";
      display: block;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.8rem;
      padding: 0.5rem;
      font-style: italic;
      opacity: 0.7;
    }
  }
`;

interface KanbanBoardProps {
  children: ReactNode;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ children }) => {
  return (
    <BoardWrapper>
      <BoardContainer>
        {children}
      </BoardContainer>
    </BoardWrapper>
  );
};

export default KanbanBoard;
export {}; 