import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Todo } from '../types/Todo';
import { useTodo } from '../contexts/TodoContext';

interface TodoFormProps {
  editTodo?: Todo;
  onCancel?: () => void;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #0077ff;
    box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #0077ff;
    box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #0077ff;
    box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #0077ff;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
`;

const TodoForm: React.FC<TodoFormProps> = ({ editTodo, onCancel }) => {
  const { addTodo, updateTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'média' | 'alta'>('média');
  
  // Preencher o formulário se estiver editando uma tarefa existente
  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description);
      setDate(editTodo.date ? editTodo.date.slice(0, 10) : '');
      setPriority(editTodo.priority);
    }
  }, [editTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!title.trim()) {
      alert('Por favor, insira um título para a tarefa');
      return;
    }

    const todoData = {
      title,
      description,
      date: date || new Date().toISOString().slice(0, 10),
      priority,
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
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Adicione um título"
          required
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

      <FormGroup>
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="priority">Prioridade</Label>
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

      <ButtonGroup>
        {onCancel && (
          <CancelButton type="button" onClick={onCancel}>
            Cancelar
          </CancelButton>
        )}
        <SubmitButton type="submit">
          {editTodo ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
        </SubmitButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default TodoForm; 