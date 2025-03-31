import React, { ReactNode, useRef, useEffect } from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: flex;
  overflow-x: auto;
  flex: 1;
  padding: 0.5rem;
  gap: 1rem;
  min-height: 500px;
  width: 100%;
  align-items: flex-start;
  scroll-snap-type: x mandatory;
  
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
    padding-bottom: 2rem;
    min-height: auto;
    padding: 0.5rem 0.5rem 2rem 0.5rem;
    -webkit-overflow-scrolling: touch; /* Melhor rolagem para iOS */
    align-items: stretch;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.3rem 0.3rem 2rem 0.3rem;
  }
`;

// Wrapper adicional para melhor controle do layout em dispositivos móveis
const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  
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
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to bottom, transparent, var(--background-secondary));
      padding: 1rem 0 0.5rem;
    }
  }
`;

const ScrollButtons = styled.div`
  display: none;
  
  @media (min-width: 769px) {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 0.75rem;
  }
`;

const ScrollButton = styled.button`
  background-color: var(--background-primary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: var(--accent-color);
    color: white;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: var(--background-primary);
      color: var(--text-secondary);
      transform: none;
    }
  }
`;

interface KanbanBoardProps {
  children: ReactNode;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ children }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  
  const handleScrollLeft = () => {
    if (boardRef.current) {
      boardRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (boardRef.current) {
      boardRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <BoardWrapper>
      <BoardContainer ref={boardRef}>
        {children}
      </BoardContainer>
      <ScrollButtons>
        <ScrollButton onClick={handleScrollLeft} aria-label="Rolar para a esquerda">
          ←
        </ScrollButton>
        <ScrollButton onClick={handleScrollRight} aria-label="Rolar para a direita">
          →
        </ScrollButton>
      </ScrollButtons>
    </BoardWrapper>
  );
};

export default KanbanBoard; 