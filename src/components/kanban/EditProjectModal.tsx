import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { Project, KanbanColumn } from '../../types/Project';

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
  background-color: var(--background-secondary);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  
  @media (max-width: 768px) {
    width: 95%;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  background-color: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
  }
`;

const ColumnsList = styled.div`
  margin-top: 1rem;
`;

const ColumnItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background-color: var(--background-primary);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--hover-background);
  }
`;

const ColumnTitle = styled.div`
  font-weight: 500;
  color: var(--text-primary);
`;

const ColumnWipLimit = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.4rem;
  
  &:hover {
    background-color: var(--error-light);
    border-radius: 4px;
  }
  
  svg {
    margin-right: 0.3rem;
  }
`;

const DangerZone = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid var(--error-color);
  border-radius: 4px;
  background-color: var(--error-light);
`;

const DangerTitle = styled.h4`
  color: var(--error-color);
  margin-top: 0;
  margin-bottom: 0.8rem;
`;

const DangerDescription = styled.p`
  color: var(--text-primary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
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
  background-color: var(--background-primary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--hover-background);
  }
`;

const SubmitButton = styled(Button)<{ disabled: boolean }>`
  background-color: var(--accent-color);
  color: white;
  border: none;
  opacity: ${props => props.disabled ? 0.7 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.disabled ? 'var(--accent-color)' : 'var(--accent-light)'};
  }
`;

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ 
  project, 
  onClose, 
  onUpdateProject,
  onDeleteProject
}) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdateProject({
        ...project,
        name,
        description
      });
    }
  };
  
  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDeleteProject(project.id);
    } else {
      setShowDeleteConfirm(true);
    }
  };
  
  const isFormValid = name.trim().length > 0;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Editar Projeto</ModalTitle>
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
            
            <FormGroup>
              <Label>Colunas</Label>
              <ColumnsList>
                {project.columns.sort((a, b) => a.order - b.order).map(column => (
                  <ColumnItem key={column.id}>
                    <div>
                      <ColumnTitle>{column.title}</ColumnTitle>
                      {column.wipLimit !== undefined && (
                        <ColumnWipLimit>WIP Limit: {column.wipLimit}</ColumnWipLimit>
                      )}
                    </div>
                  </ColumnItem>
                ))}
              </ColumnsList>
            </FormGroup>
            
            <DangerZone>
              <DangerTitle>Zona de Perigo</DangerTitle>
              <DangerDescription>
                Excluir um projeto removerá todas as associações de tarefas a este projeto. 
                As tarefas em si não serão excluídas, mas serão removidas do quadro Kanban.
              </DangerDescription>
              <DeleteButton type="button" onClick={handleDeleteClick}>
                <FaTrash />
                {showDeleteConfirm ? 'Confirmar Exclusão' : 'Excluir Projeto'}
              </DeleteButton>
            </DangerZone>
          </ModalBody>
          
          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit" disabled={!isFormValid}>
              Salvar Alterações
            </SubmitButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditProjectModal;
export {}; 