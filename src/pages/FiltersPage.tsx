import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTodo } from '../contexts/TodoContext';
import TodoItem from '../components/TodoItem';
import { FaFilter, FaSort } from 'react-icons/fa';
import SearchAutocomplete from '../components/SearchAutocomplete';

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

// Estilizando nosso componente SearchAutocomplete para corresponder ao estilo da página
const StyledSearchAutocomplete = styled(SearchAutocomplete)`
  margin-bottom: 1.5rem;
`;

const FiltersPage: React.FC = () => {
  const { todos, sortBy, setSortBy } = useTodo();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [priorityFilter, setPriorityFilter] = useState('todas');
  
  // Extrair títulos únicos para o autocomplete
  const todoTitles = useMemo(() => {
    const titles = todos.map(todo => todo.title);
    return Array.from(new Set(titles)); // Usar Array.from em vez de spread operator
  }, [todos]);
  
  // Mapear títulos para IDs para facilitar a navegação
  const titleToIdMap = useMemo(() => {
    const map: Record<string, string> = {};
    todos.forEach(todo => {
      map[todo.title] = todo.id;
    });
    return map;
  }, [todos]);
  
  // Navegação para a página de detalhes quando uma sugestão for selecionada
  const handleSuggestionSelect = useCallback((title: string) => {
    const todoId = titleToIdMap[title];
    if (todoId) {
      navigate(`/tarefa/${todoId}`);
    }
  }, [navigate, titleToIdMap]);
  
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

  // Ordenar as tarefas com base no sortBy
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case 'data':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'prioridade':
        const priorityValues = { alta: 0, média: 1, baixa: 2 };
        return priorityValues[a.priority] - priorityValues[b.priority];
      case 'alfabética':
        return a.title.localeCompare(b.title);
      case 'criação':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
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
        <StyledSearchAutocomplete
          placeholder="Buscar tarefas por título ou descrição..."
          value={searchTerm}
          onChange={setSearchTerm}
          suggestions={todoTitles}
          onSuggestionSelect={handleSuggestionSelect}
        />
        
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
        
        <FilterGroup>
          <FilterLabel>
            <FaSort />
            Ordenar por
          </FilterLabel>
          <FilterOptions>
            <FilterOption 
              active={sortBy === 'data'} 
              onClick={() => setSortBy('data')}
            >
              Data
            </FilterOption>
            <FilterOption 
              active={sortBy === 'prioridade'} 
              onClick={() => setSortBy('prioridade')}
            >
              Prioridade
            </FilterOption>
            <FilterOption 
              active={sortBy === 'alfabética'} 
              onClick={() => setSortBy('alfabética')}
            >
              Alfabética
            </FilterOption>
            <FilterOption 
              active={sortBy === 'criação'} 
              onClick={() => setSortBy('criação')}
            >
              Data de criação
            </FilterOption>
          </FilterOptions>
        </FilterGroup>
      </FiltersContainer>
      
      <ResultsContainer>
        <ResultsHeader>
          <h2>Resultados</h2>
          <ResultsCount>{sortedTodos.length} tarefas encontradas</ResultsCount>
        </ResultsHeader>
        
        {sortedTodos.length > 0 ? (
          sortedTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
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