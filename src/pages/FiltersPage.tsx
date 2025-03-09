import React, { useState } from 'react';
import styled from 'styled-components';
import { useTodo } from '../contexts/TodoContext';
import TodoItem from '../components/TodoItem';
import { FaFilter, FaSearch } from 'react-icons/fa';

const FiltersPageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.8rem;
    color: #3498db;
  }
`;

const PageSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: #333;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #3498db;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const FilterOption = styled.div<{ active: boolean }>`
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#3498db' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#555'};
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#e0e0e0'};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const ResultsCount = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 1.1rem;
`;

const FiltersPage: React.FC = () => {
  const { todos } = useTodo();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [priorityFilter, setPriorityFilter] = useState('todas');
  
  // Aplicar filtros às tarefas
  const filteredTodos = todos.filter(todo => {
    // Filtro de texto (busca)
    const matchesSearchTerm = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de status
    const matchesStatus = statusFilter === 'todas' || 
                          (statusFilter === 'pendentes' && !todo.completed) ||
                          (statusFilter === 'concluídas' && todo.completed);
    
    // Filtro de prioridade
    const matchesPriority = priorityFilter === 'todas' || todo.priority === priorityFilter;
    
    return matchesSearchTerm && matchesStatus && matchesPriority;
  });

  return (
    <FiltersPageContainer>
      <PageHeader>
        <PageTitle>
          <FaFilter />
          Filtros Avançados
        </PageTitle>
        <PageSubtitle>Encontre exatamente o que você está procurando</PageSubtitle>
      </PageHeader>
      
      <FiltersContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Buscar tarefas por título ou descrição..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterGroup>
          <FilterLabel>Status</FilterLabel>
          <FilterOptions>
            <FilterOption 
              active={statusFilter === 'todas'} 
              onClick={() => setStatusFilter('todas')}
            >
              Todas
            </FilterOption>
            <FilterOption 
              active={statusFilter === 'pendentes'} 
              onClick={() => setStatusFilter('pendentes')}
            >
              Pendentes
            </FilterOption>
            <FilterOption 
              active={statusFilter === 'concluídas'} 
              onClick={() => setStatusFilter('concluídas')}
            >
              Concluídas
            </FilterOption>
          </FilterOptions>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Prioridade</FilterLabel>
          <FilterOptions>
            <FilterOption 
              active={priorityFilter === 'todas'} 
              onClick={() => setPriorityFilter('todas')}
            >
              Todas
            </FilterOption>
            <FilterOption 
              active={priorityFilter === 'baixa'} 
              onClick={() => setPriorityFilter('baixa')}
            >
              Baixa
            </FilterOption>
            <FilterOption 
              active={priorityFilter === 'média'} 
              onClick={() => setPriorityFilter('média')}
            >
              Média
            </FilterOption>
            <FilterOption 
              active={priorityFilter === 'alta'} 
              onClick={() => setPriorityFilter('alta')}
            >
              Alta
            </FilterOption>
          </FilterOptions>
        </FilterGroup>
      </FiltersContainer>
      
      <ResultsContainer>
        <ResultsHeader>
          <h2>Resultados</h2>
          <ResultsCount>{filteredTodos.length} tarefas encontradas</ResultsCount>
        </ResultsHeader>
        
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <EmptyResults>
            Nenhuma tarefa encontrada com os filtros aplicados
          </EmptyResults>
        )}
      </ResultsContainer>
    </FiltersPageContainer>
  );
};

export default FiltersPage; 