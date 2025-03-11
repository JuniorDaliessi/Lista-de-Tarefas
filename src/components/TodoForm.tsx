import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import styled from 'styled-components';
import { FaPlus, FaSave, FaTimes, FaRegCalendarAlt, FaFlag, FaTags, FaCheck } from 'react-icons/fa';
import { Todo } from '../types/Todo';
import { useTodo } from '../contexts/TodoContext';

interface TodoFormProps {
  editTodo?: Todo;
  onCancel?: () => void;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  animation: fadeIn var(--transition-normal);
  border: 1px solid var(--border-color);
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

const FormTitle = styled.h3`
  margin: 0 0 1.2rem 0;
  font-size: 1.2rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--accent-color);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
  
  &:last-of-type {
    margin-bottom: 1.5rem;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.4rem;
    color: var(--accent-color);
    font-size: 0.9rem;
  }
`;

const InputGroup = styled.div`
  position: relative;
  flex: 1;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  pointer-events: none;
  
  & + input {
    padding-left: 2.5rem;
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  background-color: var(--background-primary);
  color: var(--text-primary);
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  background-color: var(--background-primary);
  color: var(--text-primary);
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
    min-height: 100px;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background-color: var(--background-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  width: 100%;
  
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1rem;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 2.5rem 0.7rem 0.7rem;
    font-size: 0.9rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 0.8rem;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.7rem 1rem;
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

const SubmitButton = styled(Button)`
  background-color: var(--accent-color);
  color: white;
  
  &:hover {
    background-color: var(--accent-light);
  }
  
  &:active {
    background-color: var(--accent-dark);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.3);
  }
  
  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    transform: none !important;
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--background-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--hover-background);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.3);
  }
`;

const TodoForm: React.FC<TodoFormProps> = ({ editTodo, onCancel }) => {
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
  
  // Preencher o formulário se estiver editando uma tarefa existente
  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description);
      setDate(editTodo.date ? editTodo.date.slice(0, 10) : '');
      setPriority(editTodo.priority);
      setCategory(editTodo.category || '');
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
      };

      if (editTodo) {
        updateTodo({ ...todoData, id: editTodo.id, createdAt: editTodo.createdAt });
      } else {
        addTodo(todoData);
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
  }, [title, description, date, priority, category, newCategory, editTodo, addTodo, updateTodo, resetForm, onCancel]);

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
        <TextArea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Adicione uma descrição (opcional)"
          aria-required="false"
        />
      </FormGroup>

      <FormRow>
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
      </FormRow>

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

      <ButtonGroup>
        {onCancel && (
          <CancelButton 
            type="button" 
            onClick={onCancel}
            aria-label="Cancelar edição"
          >
            <FaTimes aria-hidden="true" />
            Cancelar
          </CancelButton>
        )}
        <SubmitButton 
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
        </SubmitButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default memo(TodoForm); 