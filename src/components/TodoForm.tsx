import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaSave, FaTimes, FaRegCalendarAlt, FaFlag, FaTags } from 'react-icons/fa';
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

const SubmitButton = styled(Button)`
  background-color: var(--accent-color);
  color: white;
  
  &:hover {
    background-color: var(--accent-light);
  }
  
  &:active {
    background-color: var(--accent-dark);
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--background-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--hover-background);
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
  
  // Preencher o formulário se estiver editando uma tarefa existente
  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description);
      setDate(editTodo.date ? editTodo.date.slice(0, 10) : '');
      setPriority(editTodo.priority);
      setCategory(editTodo.category || '');
    }
  }, [editTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!title.trim()) {
      alert('Por favor, insira um título para a tarefa');
      return;
    }

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

    // Resetar o formulário
    resetForm();
    
    // Se estiver editando, chamar onCancel para fechar o modo de edição
    if (onCancel) onCancel();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setPriority('média');
    setCategory('');
    setNewCategory('');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>
        {editTodo ? <FaSave /> : <FaPlus />}
        {editTodo ? 'Editar Tarefa' : 'Nova Tarefa'}
      </FormTitle>
      
      <FormGroup>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Adicione um título"
          required
          autoFocus
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Descrição</Label>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Adicione uma descrição (opcional)"
        />
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label htmlFor="date">
            <FaRegCalendarAlt />
            Data
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="priority">
            <FaFlag />
            Prioridade
          </Label>
          <Select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'baixa' | 'média' | 'alta')}
          >
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta</option>
          </Select>
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label htmlFor="category">
          <FaTags />
          Categoria
        </Label>
        <Select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Digite o nome da nova categoria"
            required
          />
        </FormGroup>
      )}

      <ButtonGroup>
        {onCancel && (
          <CancelButton type="button" onClick={onCancel}>
            <FaTimes />
            Cancelar
          </CancelButton>
        )}
        <SubmitButton type="submit">
          {editTodo ? <FaSave /> : <FaPlus />}
          {editTodo ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
        </SubmitButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default TodoForm; 