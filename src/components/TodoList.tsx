import React from 'react';
import styled from 'styled-components';
import { useTodo } from '../contexts/TodoContext';
import TodoItem from './TodoItem';

const ListContainer = styled.div`
  margin-top: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #0077ff;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 1rem;
`;

const TodoList: React.FC = () => {
  const { filteredTodos, filter, setFilter, sortBy, setSortBy } = useTodo();

  return (
    <ListContainer>
      <FilterContainer>
        <FilterGroup>
          <FilterLabel htmlFor="filter">Filtrar por:</FilterLabel>
          <Select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="todas">Todas as tarefas</option>
            <option value="pendentes">Pendentes</option>
            <option value="concluídas">Concluídas</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="sort">Ordenar por:</FilterLabel>
          <Select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="data">Data</option>
            <option value="prioridade">Prioridade</option>
            <option value="alfabética">Alfabética</option>
            <option value="criação">Data de criação</option>
          </Select>
        </FilterGroup>
      </FilterContainer>

      {filteredTodos.length > 0 ? (
        filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      ) : (
        <EmptyMessage>
          {filter === 'todas'
            ? 'Nenhuma tarefa encontrada. Adicione uma nova tarefa!'
            : filter === 'pendentes'
            ? 'Nenhuma tarefa pendente encontrada.'
            : 'Nenhuma tarefa concluída encontrada.'}
        </EmptyMessage>
      )}
    </ListContainer>
  );
};

export default TodoList; 