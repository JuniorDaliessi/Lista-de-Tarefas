import React, { useState } from 'react';
import styled from 'styled-components';
import TodoItem from './TodoItem';
import { FaFilter, FaSort, FaSearch, FaPlus } from 'react-icons/fa';

const ListContainer = styled.div`
  padding: 16px;
`;

const ListControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    padding: 8px 8px 8px 36px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
    width: 250px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  
  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#4285f4' : '#f1f1f1'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: ${props => props.primary ? 'bold' : 'normal'};
  
  &:hover {
    background-color: ${props => props.primary ? '#3367d6' : '#e0e0e0'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;
`;

const TodoList = () => {
  // Estado de exemplo com algumas tarefas
  const [todos, setTodos] = useState([
    {
      id: '1',
      title: 'Completar projeto React',
      description: 'Finalizar o projeto usando React e styled-components',
      completed: false,
      date: '2025-04-15',
      priority: 'alta'
    },
    {
      id: '2',
      title: 'Estudar TypeScript',
      description: 'Aprender os conceitos básicos de TypeScript',
      completed: true,
      date: '2025-04-02',
      priority: 'média'
    },
    {
      id: '3',
      title: 'Fazer compras',
      description: 'Comprar itens para a semana',
      completed: false,
      date: '2025-04-05',
      priority: 'baixa'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Funções para manipular as tarefas
  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const handleEditTodo = (todo) => {
    // Aqui você implementaria a lógica para editar a tarefa
    console.log('Editar tarefa', todo);
  };
  
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Filtrar tarefas com base no termo de pesquisa
  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <ListContainer>
      <ListControls>
        <ControlGroup>
          <SearchInput>
            <FaSearch />
            <input 
              type="text" 
              placeholder="Pesquisar tarefas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
        </ControlGroup>
        
        <ControlGroup>
          <Button>
            <FaFilter /> Filtrar
          </Button>
          <Button>
            <FaSort /> Ordenar
          </Button>
          <Button primary>
            <FaPlus /> Nova Tarefa
          </Button>
        </ControlGroup>
      </ListControls>
      
      {filteredTodos.length > 0 ? (
        filteredTodos.map(todo => (
          <TodoItem 
            key={todo.id}
            todo={todo}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
          />
        ))
      ) : (
        <EmptyState>
          <h3>Nenhuma tarefa encontrada</h3>
          <p>Comece adicionando uma nova tarefa ou mude seus filtros de pesquisa.</p>
        </EmptyState>
      )}
    </ListContainer>
  );
};

export default TodoList; 