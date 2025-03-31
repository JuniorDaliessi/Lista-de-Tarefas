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

const HelpText = styled.small`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
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

interface CreateColumnModalProps {
  onClose: () => void;
  onCreateColumn: (title: string, wipLimit?: number) => void;
}

const CreateColumnModal: React.FC<CreateColumnModalProps> = ({ onClose, onCreateColumn }) => {
  const [title, setTitle] = useState('');
  const [hasWipLimit, setHasWipLimit] = useState(false);
  const [wipLimit, setWipLimit] = useState(5);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateColumn(
        title,
        hasWipLimit ? wipLimit : undefined
      );
    }
  };
  
  const isFormValid = title.trim().length > 0 && (!hasWipLimit || wipLimit > 0);
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Adicionar Coluna</ModalTitle>
            <CloseButton type="button" onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <FormGroup>
              <Label htmlFor="column-title">Título da Coluna</Label>
              <Input 
                id="column-title"
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Em Andamento"
                autoFocus
              />
            </FormGroup>
            
            <FormGroup>
              <CheckboxGroup>
                <Checkbox 
                  type="checkbox"
                  id="has-wip-limit"
                  checked={hasWipLimit}
                  onChange={e => setHasWipLimit(e.target.checked)}
                />
                <Label htmlFor="has-wip-limit" style={{ display: 'inline', marginBottom: 0 }}>
                  Definir limite de WIP (Work in Progress)
                </Label>
              </CheckboxGroup>
              
              {hasWipLimit && (
                <>
                  <Input 
                    id="wip-limit"
                    type="number" 
                    value={wipLimit}
                    onChange={e => setWipLimit(parseInt(e.target.value) || 0)}
                    min="1"
                    style={{ marginTop: '0.8rem' }}
                  />
                  <HelpText>
                    O limite de WIP define o número máximo de tarefas que podem estar nesta coluna ao mesmo tempo.
                    Isto ajuda a evitar sobrecarga e a focar na conclusão de tarefas antes de iniciar novas.
                  </HelpText>
                </>
              )}
            </FormGroup>
          </ModalBody>
          
          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit" disabled={!isFormValid}>
              Adicionar Coluna
            </SubmitButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateColumnModal;
export {}; 