import React, { useMemo, useCallback, memo } from 'react';
import styled from 'styled-components';
import { FaSort, FaFilter, FaSearch, FaListUl, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { useTodo } from '../contexts/TodoContext';
import TodoItem from './TodoItem';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const ListContainer = styled.div`
  margin-top: 1.5rem;
  transition: all var(--transition-normal);
  animation: fadeIn var(--transition-normal);
  
  @media (max-width: 480px) {
    margin-top: 1rem;
  }
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  
  svg {
    color: var(--accent-color);
    margin-right: 0.8rem;
    font-size: 1.5rem;
  }
`;

const ListTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
  }
  
  @media (max-width: 580px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  @media (max-width: 580px) {
    width: 100%;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  gap: 0.5rem;
  }
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.4rem;
    color: var(--accent-color);
  }
  
  @media (max-width: 580px) {
    width: 100%;
    margin-bottom: 0.2rem;
  }
`;

const Select = styled.select`
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 0.8rem;
  padding-right: 2rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
  }
  
  @media (max-width: 580px) {
    width: 100%;
  }
`;

const TodoListItems = styled.div`
  height: 600px;
  width: 100%;
  overflow: visible;
  padding: 0.5rem 0;
  
  @media (max-width: 768px) {
    height: 500px;
  }

  @media (max-width: 480px) {
    height: 400px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
  background-color: var(--card-background);
  border-radius: var(--radius-md);
  margin-top: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn var(--transition-normal);
  
  svg {
    color: var(--accent-color);
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }
  
  p {
    margin: 0.5rem 0 0;
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    font-size: 1rem;
    
    svg {
      font-size: 2.5rem;
    }
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const StatItem = styled.div<{ $type: 'normal' | 'success' | 'warning' | 'error' }>`
  padding: 0.8rem 1.2rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  font-size: 0.9rem;
  flex: 1;
  min-width: 180px;
  
  ${props => {
    switch (props.$type) {
      case 'success':
        return `
          background-color: var(--success-light);
          color: var(--success-color);
        `;
      case 'warning':
        return `
          background-color: var(--warning-light);
          color: var(--warning-color);
        `;
      case 'error':
        return `
          background-color: var(--error-light);
          color: var(--error-color);
        `;
      default:
        return `
          background-color: var(--background-secondary);
          color: var(--text-primary);
        `;
    }
  }}
  
  svg {
    font-size: 1.2rem;
  }
  
  span {
    font-weight: 600;
    margin-left: auto;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

// Altura média estimada de cada item de tarefa
const ITEM_SIZE = 210;

// Definição de tipos para AutoSizer
interface Size {
  width: number;
  height: number;
}

const TodoList: React.FC = () => {
  const { filteredTodos, filter, setFilter, sortBy, setSortBy, searchQuery, todos } = useTodo();

  // Calcular estatísticas
  const stats = useMemo(() => {
    // Filtrar tarefas atrasadas (não concluídas com data de vencimento no passado)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = todos.filter(todo => {
      if (todo.completed || !todo.date) return false;
      const dueDate = new Date(todo.date);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
    
    // Tarefas pendentes (não concluídas)
    const pendingTasks = todos.filter(todo => !todo.completed);
    
    // Tarefas concluídas
    const completedTasks = todos.filter(todo => todo.completed);
    
    return {
      total: todos.length,
      pending: pendingTasks.length,
      completed: completedTasks.length,
      overdue: overdueTasks.length
    };
  }, [todos]);

  const getListTitle = useCallback(() => {
    if (searchQuery) {
      return `Resultados da busca "${searchQuery}"`;
    }
    
    switch (filter) {
      case 'pendentes':
        return 'Tarefas Pendentes';
      case 'concluídas':
        return 'Tarefas Concluídas';
      default:
        return 'Todas as Tarefas';
    }
  }, [filter, searchQuery]);
  
  const getEmptyIcon = useCallback(() => {
    if (searchQuery) {
      return <FaSearch />;
    }
    
    switch (filter) {
      case 'pendentes':
        return <FaExclamationTriangle />;
      case 'concluídas':
        return <FaCheckCircle />;
      default:
        return <FaListUl />;
    }
  }, [filter, searchQuery]);
  
  const getEmptyMessage = useCallback(() => {
    if (searchQuery) {
      return `Nenhuma tarefa encontrada para "${searchQuery}".`;
    }
    
    switch (filter) {
      case 'pendentes':
        return 'Nenhuma tarefa pendente encontrada.';
      case 'concluídas':
        return 'Nenhuma tarefa concluída encontrada.';
      default:
        return 'Nenhuma tarefa encontrada. Adicione uma nova tarefa!';
    }
  }, [filter, searchQuery]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  }, [setFilter]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  }, [setSortBy]);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (!filteredTodos || index >= filteredTodos.length) {
      console.error("Problema na renderização da lista:", { index, totalTodos: filteredTodos?.length });
      return null;
    }
    
    const todo = filteredTodos[index];
    if (!todo) {
      console.error("Todo indefinido no índice:", index);
      return null;
    }
    
    return (
      <div style={{
        ...style,
        paddingTop: 8,
        paddingBottom: 8,
      }}>
        <TodoItem key={todo.id} todo={todo} />
      </div>
    );
  }, [filteredTodos]);

  const listTitle = useMemo(() => getListTitle(), [getListTitle]);
  
  // Renderizar uma versão simplificada se houver problemas
  if (!filteredTodos) {
    return <div>Carregando tarefas...</div>;
  }

  return (
    <ListContainer>
      <ListHeader>
        <FaListUl aria-hidden="true" />
        <ListTitle>{listTitle}</ListTitle>
      </ListHeader>
      
      {/* Estatísticas de tarefas */}
      <StatsContainer>
        <StatItem $type="normal">
          <FaListUl />
          Total de Tarefas
          <span>{stats.total}</span>
        </StatItem>
        <StatItem $type="warning">
          <FaClock />
          Tarefas Pendentes
          <span>{stats.pending}</span>
        </StatItem>
        <StatItem $type="success">
          <FaCheckCircle />
          Tarefas Concluídas
          <span>{stats.completed}</span>
        </StatItem>
        <StatItem $type="error">
          <FaExclamationTriangle />
          Tarefas Atrasadas
          <span>{stats.overdue}</span>
        </StatItem>
      </StatsContainer>

      <FilterContainer>
        <FilterGroup>
          <FilterLabel htmlFor="filter">
            <FaFilter />
            Filtrar por
          </FilterLabel>
          <Select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="todas">Todas as tarefas</option>
            <option value="pendentes">Pendentes</option>
            <option value="concluídas">Concluídas</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="sort">
            <FaSort />
            Ordenar por
          </FilterLabel>
          <Select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="data">Data</option>
            <option value="prioridade">Prioridade</option>
            <option value="alfabética">Alfabética</option>
            <option value="criação">Data de criação</option>
          </Select>
        </FilterGroup>
      </FilterContainer>

      {filteredTodos.length > 0 ? (
        <TodoListItems>
          <AutoSizer>
            {({ height, width }: Size) => (
              <List
                height={height}
                itemCount={filteredTodos.length}
                itemSize={ITEM_SIZE}
                width={width}
              >
                {({ index, style }) => (
                  <div style={style}>
                    <TodoItem key={filteredTodos[index].id} todo={filteredTodos[index]} />
                  </div>
                )}
              </List>
            )}
          </AutoSizer>
        </TodoListItems>
      ) : (
        <>
          {searchQuery ? (
            <EmptyMessage>
              <FaSearch />
              <h3>Nenhuma tarefa encontrada</h3>
              <p>Sua busca por "{searchQuery}" não retornou resultados.</p>
            </EmptyMessage>
          ) : filter === 'concluídas' ? (
            <EmptyMessage>
              <FaCheckCircle />
              <h3>Nenhuma tarefa concluída</h3>
              <p>Você ainda não concluiu nenhuma tarefa. Que tal completar algumas?</p>
            </EmptyMessage>
          ) : filter === 'pendentes' ? (
            stats.overdue > 0 ? (
              <EmptyMessage>
                <FaExclamationTriangle />
                <h3>Atenção: Tarefas Atrasadas</h3>
                <p>Você tem {stats.overdue} {stats.overdue === 1 ? 'tarefa atrasada' : 'tarefas atrasadas'} que precisam de atenção.</p>
              </EmptyMessage>
            ) : (
              <EmptyMessage>
                <FaClock />
                <h3>Nenhuma tarefa pendente</h3>
                <p>Parabéns! Você completou todas as suas tarefas.</p>
              </EmptyMessage>
            )
          ) : (
            <EmptyMessage>
              <FaListUl />
              <h3>Sua lista está vazia</h3>
              <p>Adicione algumas tarefas para começar a organizar seu trabalho.</p>
            </EmptyMessage>
          )}
        </>
      )}
    </ListContainer>
  );
};

export default memo(TodoList); 