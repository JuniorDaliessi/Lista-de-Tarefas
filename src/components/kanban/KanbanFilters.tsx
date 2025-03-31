import React from 'react';
import styled from 'styled-components';
import { FaFilter, FaTimes } from 'react-icons/fa';

const FiltersContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FiltersTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #3498db;
  }
`;

const FiltersContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const FilterGroup = styled.div`
  min-width: 200px;
`;

const FilterLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
`;

const OptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterOption = styled.div<{ active: boolean }>`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#3498db' : '#e9f5fe'};
  color: ${props => props.active ? 'white' : '#0c5460'};
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#d6ebf5'};
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: #3498db;
  font-size: 0.9rem;
  cursor: pointer;
  gap: 0.3rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

interface KanbanFiltersProps {
  priorityFilter: string | null;
  categoryFilter: string | null;
  onChangePriority: (priority: string | null) => void;
  onChangeCategory: (category: string | null) => void;
  categories: string[];
}

const KanbanFilters: React.FC<KanbanFiltersProps> = ({
  priorityFilter,
  categoryFilter,
  onChangePriority,
  onChangeCategory,
  categories,
}) => {
  // Clear all filters
  const handleClearAll = () => {
    onChangePriority(null);
    onChangeCategory(null);
  };
  
  // Handler for priority filter
  const handlePriorityClick = (priority: string) => {
    if (priorityFilter === priority) {
      onChangePriority(null); // Toggle off if already selected
    } else {
      onChangePriority(priority);
    }
  };
  
  // Handler for category filter
  const handleCategoryClick = (category: string) => {
    if (categoryFilter === category) {
      onChangeCategory(null); // Toggle off if already selected
    } else {
      onChangeCategory(category);
    }
  };
  
  const isAnyFilterActive = priorityFilter !== null || categoryFilter !== null;
  
  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>
          <FaFilter />
          Filtros
        </FiltersTitle>
        
        {isAnyFilterActive && (
          <ClearButton onClick={handleClearAll}>
            <FaTimes />
            Limpar filtros
          </ClearButton>
        )}
      </FiltersHeader>
      
      <FiltersContent>
        <FilterGroup>
          <FilterLabel>Prioridade</FilterLabel>
          <OptionsList>
            <FilterOption 
              active={priorityFilter === 'baixa'} 
              onClick={() => handlePriorityClick('baixa')}
            >
              Baixa
            </FilterOption>
            <FilterOption 
              active={priorityFilter === 'média'} 
              onClick={() => handlePriorityClick('média')}
            >
              Média
            </FilterOption>
            <FilterOption 
              active={priorityFilter === 'alta'} 
              onClick={() => handlePriorityClick('alta')}
            >
              Alta
            </FilterOption>
          </OptionsList>
        </FilterGroup>
        
        {categories.length > 0 && (
          <FilterGroup>
            <FilterLabel>Categoria</FilterLabel>
            <OptionsList>
              {categories.map(category => (
                <FilterOption 
                  key={category}
                  active={categoryFilter === category} 
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </FilterOption>
              ))}
            </OptionsList>
          </FilterGroup>
        )}
      </FiltersContent>
    </FiltersContainer>
  );
};

export default KanbanFilters;
export {}; 