import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import styled from 'styled-components';
import { FaPlus, FaSave, FaTimes, FaRegCalendarAlt, FaFlag, FaTags, FaCheck, FaTrash, FaTasks, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Todo, SubTask } from '../types/Todo';
import { useTodo } from '../contexts/TodoContext';
import { v4 as uuidv4 } from 'uuid';

interface TodoFormProps {
  editTodo?: Todo;
  onCancel?: () => void;
  projectId?: string;
  columnId?: string;
}

const FormContainer = styled.form`
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
  animation: slideUp var(--transition-normal);
  border-top: 4px solid var(--accent-color);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background-color: rgba(59, 130, 246, 0.08);
    border-radius: 0 var(--radius-md) 0 100%;
    z-index: 0;
  }
`;

const FormTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
`;

const Button = styled.button`
  padding: 0.8rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--accent-color);
  color: white;
  
  &:hover {
    background-color: var(--accent-light);
  }
  
  &:disabled {
    background-color: var(--accent-light);
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--hover-background);
    color: var(--text-primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 0.95rem;
  appearance: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--text-secondary);
    border-bottom: 2px solid var(--text-secondary);
    pointer-events: none;
    transition: all var(--transition-fast);
  }
  
  &:focus-within::after {
    border-color: var(--accent-color);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.95rem;
  
  input {
    margin-right: 0.5rem;
    width: 18px;
    height: 18px;
    accent-color: var(--accent-color);
  }
`;

const FormColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SuccessMessage = styled.div`
  background-color: var(--success-color);
  color: white;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideDown 0.3s ease-in-out;
  
  svg {
    margin-right: 0.5rem;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SubtasksSection = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const SubtasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: var(--background-secondary);
  cursor: pointer;
  
  h4 {
    margin: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    font-weight: 600;
    
    svg {
      margin-right: 0.5rem;
      color: var(--accent-color);
    }
  }
`;

const SubtasksList = styled.div`
  padding: 0.8rem 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const SubtaskItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  opacity: ${props => props.completed ? 0.7 : 1};
  
  span {
    flex: 1;
    margin: 0 0.75rem;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    font-size: 0.95rem;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SubtaskCheckbox = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--success-color);
`;

const SubtaskDeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  border-radius: 50%;
  transition: all var(--transition-fast);
  
  &:hover {
    opacity: 1;
    background-color: rgba(239, 68, 68, 0.1);
    transform: translateY(-1px);
  }
`;

const AddSubtaskForm = styled.div`
  display: flex;
  padding: 0.8rem 1rem;
  border-top: 1px solid var(--border-color);
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md) 0 0 var(--radius-md);
    font-size: 0.95rem;
    background-color: var(--background-primary);
    color: var(--text-primary);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
  }
  
  button {
    padding: 0.75rem 1rem;
    background-color: var(--accent-color);
    color: white;
    border: none;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    
    &:hover {
      background-color: var(--accent-light);
    }
  }
`;

const TodoForm: React.FC<TodoFormProps> = ({ editTodo, onCancel, projectId, columnId }) => {
  const { addTodo, updateTodo, categories } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'média' | 'alta'>('média');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Subtasks state
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(false);
  
  // Preencher o formulário se estiver editando uma tarefa existente
  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description);
      setDate(editTodo.date ? editTodo.date.slice(0, 10) : '');
      setPriority(editTodo.priority);
      setCategory(editTodo.category || '');
      setSubtasks(editTodo.subtasks || []);
      setShowSubtasks(editTodo.subtasks && editTodo.subtasks.length > 0);
    }
    
    // Focar no campo de título ao montar o componente
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editTodo]);

  // Esconder mensagem de sucesso após alguns segundos
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Memoização dos manipuladores de eventos
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  }, []);

  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as 'baixa' | 'média' | 'alta');
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  }, []);

  const handleNewCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  }, []);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setDate('');
    setPriority('média');
    setCategory('');
    setNewCategory('');
    setSubtasks([]);
    setNewSubtask('');
    setShowSubtasks(false);
  }, []);

  // Subtask handlers
  const handleAddSubtask = useCallback(() => {
    if (!newSubtask.trim()) return;
    
    const newSubtaskItem: SubTask = {
      id: uuidv4(),
      title: newSubtask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setSubtasks(prev => [...prev, newSubtaskItem]);
    setNewSubtask('');
  }, [newSubtask]);
  
  const handleDeleteSubtask = useCallback((id: string) => {
    setSubtasks(prev => prev.filter(subtask => subtask.id !== id));
  }, []);
  
  const handleToggleSubtask = useCallback((id: string) => {
    setSubtasks(prev => prev.map(subtask => 
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    ));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validação básica
    if (!title.trim()) {
      setErrorMsg('Por favor, insira um título para a tarefa');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Usar a nova categoria se selecionada
      const finalCategory = category === 'nova' ? newCategory.trim() : category;

      const todoData = {
        title,
        description,
        date: date || new Date().toISOString().slice(0, 10),
        priority,
        category: finalCategory,
        completed: editTodo ? editTodo.completed : false,
        projectId: projectId || undefined,
        columnId: columnId || undefined
      };

      if (editTodo) {
        updateTodo({ 
          ...todoData, 
          id: editTodo.id, 
          createdAt: editTodo.createdAt,
          subtasks 
        });
      } else {
        addTodo({
          ...todoData,
          subtasks
        });
      }

      // Mostrar mensagem de sucesso
      setShowSuccess(true);
      
      // Resetar o formulário se não estiver editando
      if (!editTodo) {
        resetForm();
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      } else if (onCancel) {
        // Se estiver editando, fechar o modo de edição após um delay
        setTimeout(() => {
          onCancel();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      setErrorMsg('Ocorreu um erro ao salvar a tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, date, priority, category, newCategory, subtasks, editTodo, addTodo, updateTodo, resetForm, onCancel, projectId, columnId]);

  return (
    <FormContainer onSubmit={handleSubmit} ref={formRef} aria-labelledby="form-title">
      <FormTitle id="form-title">
        {editTodo ? <FaSave aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
        {editTodo ? 'Editar Tarefa' : 'Nova Tarefa'}
      </FormTitle>
      
      {showSuccess && (
        <SuccessMessage role="status" aria-live="polite">
          <span>
            <FaCheck aria-hidden="true" />
            {editTodo ? 'Tarefa atualizada com sucesso!' : 'Tarefa adicionada com sucesso!'}
          </span>
        </SuccessMessage>
      )}
      
      {errorMsg && (
        <SuccessMessage 
          role="alert" 
          style={{ backgroundColor: 'var(--error-color)' }}
        >
          {errorMsg}
        </SuccessMessage>
      )}
      
      <FormGroup>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Adicione um título"
          required
          ref={titleInputRef}
          aria-required="true"
          aria-invalid={errorMsg && !title ? "true" : "false"}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Adicione uma descrição (opcional)"
          aria-required="false"
        />
      </FormGroup>

      <FormColumns>
        <FormGroup>
          <Label htmlFor="date">
            <FaRegCalendarAlt aria-hidden="true" />
            Data
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={handleDateChange}
            aria-label="Data de conclusão da tarefa"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="priority">
            <FaFlag aria-hidden="true" />
            Prioridade
          </Label>
          <Select
            id="priority"
            value={priority}
            onChange={handlePriorityChange}
            aria-label="Selecione a prioridade da tarefa"
          >
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta</option>
          </Select>
        </FormGroup>
      </FormColumns>

      <FormGroup>
        <Label htmlFor="category">
          <FaTags aria-hidden="true" />
          Categoria
        </Label>
        <Select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          aria-label="Selecione a categoria da tarefa"
        >
          <option value="">Sem categoria</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="nova">+ Nova categoria</option>
        </Select>
      </FormGroup>

      {category === 'nova' && (
        <FormGroup>
          <Label htmlFor="newCategory">Nome da nova categoria</Label>
          <Input
            id="newCategory"
            type="text"
            value={newCategory}
            onChange={handleNewCategoryChange}
            placeholder="Digite o nome da nova categoria"
            required
            aria-required="true"
            aria-invalid={category === 'nova' && !newCategory ? "true" : "false"}
          />
        </FormGroup>
      )}
      
      <FormGroup>
        <Label htmlFor="subtasks">
          <FaTasks aria-hidden="true" />
          Subtarefas
        </Label>
        <SubtasksSection>
          <SubtasksHeader onClick={() => setShowSubtasks(!showSubtasks)}>
            <h4>
              <FaTasks />
              Subtarefas ({subtasks.filter(s => s.completed).length}/{subtasks.length})
            </h4>
            {showSubtasks ? <FaChevronUp /> : <FaChevronDown />}
          </SubtasksHeader>
          
          {showSubtasks && subtasks.length > 0 && (
            <SubtasksList>
              {subtasks.map(subtask => (
                <SubtaskItem key={subtask.id} completed={subtask.completed}>
                  <SubtaskCheckbox 
                    onClick={() => handleToggleSubtask(subtask.id)}
                    aria-label={subtask.completed ? "Marcar como pendente" : "Marcar como concluída"}
                  >
                    {subtask.completed ? <FaCheck /> : <div style={{ width: '1em', height: '1em', border: '1px solid var(--accent-color)', borderRadius: '50%' }} />}
                  </SubtaskCheckbox>
                  <span>{subtask.title}</span>
                  <SubtaskDeleteButton 
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    aria-label="Excluir subtarefa"
                    type="button"
                  >
                    <FaTrash size={12} />
                  </SubtaskDeleteButton>
                </SubtaskItem>
              ))}
            </SubtasksList>
          )}
          
          <AddSubtaskForm>
            <input
              type="text"
              placeholder="Adicionar subtarefa..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
            />
            <button 
              type="button" 
              aria-label="Adicionar subtarefa"
              onClick={handleAddSubtask}
            >
              <FaPlus />
            </button>
          </AddSubtaskForm>
        </SubtasksSection>
      </FormGroup>

      <ButtonGroup>
        {onCancel && (
          <SecondaryButton 
            type="button" 
            onClick={onCancel}
            aria-label="Cancelar edição"
          >
            <FaTimes aria-hidden="true" />
            Cancelar
          </SecondaryButton>
        )}
        <PrimaryButton 
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {editTodo ? <FaSave aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
          {isSubmitting 
            ? 'Salvando...' 
            : editTodo 
              ? 'Atualizar Tarefa' 
              : 'Adicionar Tarefa'
          }
        </PrimaryButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default memo(TodoForm); 