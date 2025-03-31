import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

interface SearchAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  className?: string;
  onSuggestionSelect?: (suggestion: string) => void;
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(79, 134, 247, 0.15);
    outline: none;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.1rem;
  pointer-events: none;
  transition: color var(--transition-fast);
  z-index: 1;
`;

const SuggestionsContainer = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--background-primary);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: var(--shadow-md);
`;

const SuggestionItem = styled.li<{ active: boolean }>`
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  background-color: ${(props) => props.active ? 'var(--accent-light)' : 'transparent'};
  
  &:hover {
    background-color: var(--accent-light);
  }
`;

const NoSuggestions = styled.li`
  padding: 0.8rem 1rem;
  color: var(--text-secondary);
  font-style: italic;
`;

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ 
  placeholder, 
  value, 
  onChange, 
  suggestions,
  className,
  onSuggestionSelect
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Atualizar o inputValue quando o value prop mudar
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Filtrar sugestões com base no valor digitado
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    
    const filtered = suggestions.filter(
      suggestion => suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    setFilteredSuggestions(filtered);
    setActiveSuggestion(0);
  }, [inputValue, suggestions]);
  
  // Fechar sugestões ao clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
    onChange(newValue);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    
    // Chamar o callback onSuggestionSelect se estiver definido
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navegação por teclado (setas para cima/baixo)
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter' && activeSuggestion >= 0 && filteredSuggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  return (
    <SearchContainer ref={containerRef} className={className}>
      <SearchIcon>
        <FaSearch />
      </SearchIcon>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined}
      />
      
      {showSuggestions && inputValue.trim() !== '' && (
        <SuggestionsContainer>
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={index}
                active={index === activeSuggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === activeSuggestion}
              >
                {suggestion}
              </SuggestionItem>
            ))
          ) : (
            <NoSuggestions>Nenhuma sugestão encontrada</NoSuggestions>
          )}
        </SuggestionsContainer>
      )}
    </SearchContainer>
  );
};

export default SearchAutocomplete; 