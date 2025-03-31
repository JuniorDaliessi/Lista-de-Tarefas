import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #777;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`;

const Button = styled.button`
  padding: 0.7rem 1.2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const CancelButton = styled(Button)`
  background-color: #f1f1f1;
  color: #555;
  border: none;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SubmitButton = styled(Button)<{ disabled: boolean }>`
  background-color: #3498db;
  color: white;
  border: none;
  opacity: ${props => props.disabled ? 0.7 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.disabled ? '#3498db' : '#2980b9'};
  }
`;

interface CreateProjectModalProps {
  onClose: () => void;
  onCreateProject: (name: string, description: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreateProject }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateProject(name, description);
    }
  };
  
  const isFormValid = name.trim().length > 0;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Criar Novo Projeto</ModalTitle>
            <CloseButton type="button" onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <FormGroup>
              <Label htmlFor="project-name">Nome do Projeto</Label>
              <Input 
                id="project-name"
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Digite o nome do projeto"
                autoFocus
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="project-description">Descrição</Label>
              <TextArea 
                id="project-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Digite uma descrição para o projeto (opcional)"
              />
            </FormGroup>
          </ModalBody>
          
          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit" disabled={!isFormValid}>
              Criar Projeto
            </SubmitButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateProjectModal;
export {}; 