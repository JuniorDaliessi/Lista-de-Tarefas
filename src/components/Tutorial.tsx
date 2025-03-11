import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheckCircle, FaClipboardList, FaFilter, FaSun, FaMoon } from 'react-icons/fa';

interface TutorialProps {
  onClose: () => void;
}

const TutorialOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;

const TutorialModal = styled.div`
  background-color: var(--card-background);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  animation: fadeInScale 0.4s ease-out;
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const TutorialHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TutorialTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  padding: 0.5rem;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const TutorialContent = styled.div`
  padding: 2rem 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 3px;
  }
`;

const TutorialStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StepTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const StepDescription = styled.p`
  margin: 0;
  color: var(--text-primary);
  line-height: 1.6;
`;

const StepImage = styled.div`
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem 0;
  box-shadow: var(--shadow-sm);
  
  svg {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }
`;

const ImageCaption = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 0.5rem;
`;

const TutorialFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
`;

const ProgressIndicator = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ProgressDot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--accent-color)' : 'var(--border-color)'};
  transition: background-color var(--transition-fast);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const TutorialButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.disabled ? 'var(--border-color)' : 'var(--accent-color)'};
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color var(--transition-fast), transform var(--transition-fast);
  
  svg {
    margin: 0 0.3rem;
  }
  
  &:hover:not(:disabled) {
    background-color: var(--accent-light);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: 'Bem-vindo ao Todo App',
      icon: <FaClipboardList />,
      description: 'Gerencie suas tarefas com facilidade! Este tutorial rápido vai te mostrar como usar o aplicativo da melhor maneira.',
      image: <FaClipboardList />,
      caption: 'Organize suas tarefas diárias com facilidade e eficiência'
    },
    {
      title: 'Adicionando Tarefas',
      icon: <FaCheckCircle />,
      description: 'Use o formulário na parte superior para adicionar novas tarefas. Você pode definir título, descrição, data, prioridade e categoria.',
      image: <FaCheckCircle />,
      caption: 'Preencha os detalhes da tarefa e clique em "Adicionar Tarefa"'
    },
    {
      title: 'Filtrando e Ordenando',
      icon: <FaFilter />,
      description: 'Use os filtros para ver apenas tarefas pendentes ou concluídas. Você também pode ordenar por data, prioridade ou alfabeticamente.',
      image: <FaFilter />,
      caption: 'Encontre facilmente o que precisa com filtros personalizados'
    },
    {
      title: 'Modo Escuro/Claro',
      icon: <FaSun />,
      description: 'Alterne entre os temas claro e escuro de acordo com sua preferência usando o botão no canto superior direito da tela.',
      image: <>{<FaSun />}{<FaMoon />}</>,
      caption: 'Escolha o tema que mais combina com você'
    },
    {
      title: 'Modo Offline',
      icon: <FaCheckCircle />,
      description: 'O aplicativo funciona mesmo sem conexão com a internet! Suas alterações serão salvas localmente e sincronizadas quando você reconectar.',
      image: <FaCheckCircle />,
      caption: 'Continue gerenciando suas tarefas mesmo offline'
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);
  
  const currentStepData = steps[currentStep];
  
  return (
    <TutorialOverlay>
      <TutorialModal role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
        <TutorialHeader>
          <TutorialTitle id="tutorial-title">Tutorial do Todo App</TutorialTitle>
          <CloseButton onClick={onClose} aria-label="Fechar tutorial">
            <FaTimes />
          </CloseButton>
        </TutorialHeader>
        
        <TutorialContent>
          <TutorialStep>
            <StepTitle>
              {currentStepData.icon}
              {currentStepData.title}
            </StepTitle>
            
            <StepDescription>{currentStepData.description}</StepDescription>
            
            <StepImage>
              {currentStepData.image}
              <ImageCaption>{currentStepData.caption}</ImageCaption>
            </StepImage>
          </TutorialStep>
        </TutorialContent>
        
        <TutorialFooter>
          <ProgressIndicator>
            {steps.map((_, index) => (
              <ProgressDot key={index} active={index === currentStep} />
            ))}
          </ProgressIndicator>
          
          <ButtonGroup>
            <TutorialButton 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              aria-label="Etapa anterior"
            >
              <FaArrowLeft /> Anterior
            </TutorialButton>
            
            {currentStep < steps.length - 1 ? (
              <TutorialButton 
                onClick={handleNext}
                aria-label="Próxima etapa"
              >
                Próximo <FaArrowRight />
              </TutorialButton>
            ) : (
              <TutorialButton 
                onClick={onClose}
                aria-label="Concluir tutorial"
              >
                Começar a usar
              </TutorialButton>
            )}
          </ButtonGroup>
        </TutorialFooter>
      </TutorialModal>
    </TutorialOverlay>
  );
};

export default Tutorial; 