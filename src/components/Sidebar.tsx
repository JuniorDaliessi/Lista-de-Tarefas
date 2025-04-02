import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaHome, FaFilter, FaSun, FaMoon, FaSearch, FaTags, FaPlus, FaTimes, FaCheck, FaChartBar, FaTasks, FaColumns } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useTodo } from '../contexts/TodoContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  isMobile: boolean;
}

const SidebarContainer = styled.div<{ isOpen: boolean, isMobile: boolean }>`
  width: 280px;
  height: 100vh;
  background-color: var(--background-secondary);
  color: var(--text-primary);
  padding: 1.5rem 0;
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-300px'};
  box-shadow: ${props => props.isOpen ? 'var(--shadow-md)' : 'none'};
  transition: left var(--transition-normal), box-shadow var(--transition-normal);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 200;
  display: flex;
  flex-direction: column;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  @media (max-width: 768px) {
    width: 85%;
    max-width: 320px;
    padding-top: 1rem;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    left: 0;
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  }
`;

const SidebarHeader = styled.div`
  position: relative;
  padding: 0 1.5rem 0 1.5rem;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  transition: all var(--transition-fast);
  z-index: 10;
  border-radius: 50%;
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--hover-background);
    transform: rotate(90deg);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1.2rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ThemeToggle = styled.button`
  background: transparent;
  color: var(--text-secondary);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--hover-background);
    transform: rotate(15deg);
  }
  
  @media (max-width: 768px) {
    display: none; /* Oculta o botão em dispositivos móveis já que está no header */
  }
`;

const SearchContainer = styled.div`
  padding: 0 1.5rem 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;
  
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.95rem;
    transition: all var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }
    
    &::placeholder {
      color: var(--text-tertiary);
    }
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 0.9rem;
  pointer-events: none;
  transition: color var(--transition-fast);
  
  input:focus + & {
    color: var(--accent-color);
  }
`;

const SearchTypeSelect = styled.div`
  position: relative;
  
  select {
    width: 100%;
    appearance: none;
    padding: 0.8rem 1rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.95rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--text-secondary);
    border-bottom: 2px solid var(--text-secondary);
    pointer-events: none;
    transition: all var(--transition-fast);
  }
  
  &:hover::after {
    border-color: var(--accent-color);
  }
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
`;

const NavTitle = styled.h3`
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  padding-left: 0.5rem;
  letter-spacing: 0.5px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<{ active?: boolean }>`
  margin-bottom: 0.25rem;
  
  a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: ${props => props.active ? 'var(--accent-color)' : 'var(--text-primary)'};
    text-decoration: none;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    font-weight: ${props => props.active ? '600' : '400'};
    background-color: ${props => props.active ? 'var(--active-background)' : 'transparent'};
    position: relative;
    overflow: hidden;
    
    svg {
      margin-right: 0.75rem;
      font-size: 1.1rem;
      color: ${props => props.active ? 'var(--accent-color)' : 'var(--text-secondary)'};
      transition: all var(--transition-fast);
    }
    
    &:hover {
      background-color: var(--hover-background);
      color: var(--accent-color);
      transform: translateX(3px);
      
      svg {
        color: var(--accent-color);
      }
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background-color: var(--accent-color);
      transform: ${props => props.active ? 'scaleY(1)' : 'scaleY(0)'};
      transition: transform var(--transition-fast);
    }
    
    &:hover::before {
      transform: scaleY(1);
    }
  }
`;

const CategoryList = styled.div`
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
`;

const CategoryItem = styled.div<{ color: string, active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  background-color: ${props => props.active ? 'var(--active-background)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: var(--hover-background);
    transform: translateX(3px);
  }
  
  .category-color {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: ${props => props.color};
    margin-right: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .category-name {
    color: var(--text-primary);
    flex: 1;
  }
  
  .category-count {
    background-color: var(--background-primary);
    color: var(--text-secondary);
    padding: 0.15rem 0.5rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    min-width: 24px;
    text-align: center;
  }
`;

const SectionTitle = styled.div`
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  background: transparent;
  color: var(--accent-color);
  padding: 0.25rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast), transform var(--transition-fast);
  
  &:hover {
    color: var(--accent-light);
    background-color: transparent;
    transform: scale(1.1);
  }
`;

const StatusContainer = styled.div`
  margin-top: auto;
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StatusLabel = styled.span`
  font-weight: 500;
`;

const StatusValue = styled.span`
  color: var(--accent-color);
  font-weight: 600;
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, isMobile }) => {
  const { theme, toggleTheme } = useTheme();
  const { 
    searchQuery, 
    setSearchQuery,
    searchType,
    setSearchType,
    categories, 
    activeCategory, 
    setActiveCategory,
    addCategory,
    todos
  } = useTodo();
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
      setShowCategoryForm(false);
    }
  };
  
  const handleNavClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };
  
  // Calcular estatísticas de tarefas
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = todos.length - completedTasks;
  
  // Calcular contagem de tarefas por categoria
  const getCategoryCount = (category: string) => {
    return todos.filter(todo => 
      category === 'todas' ? true : todo.category === category
    ).length;
  };
  
  return (
    <SidebarContainer isOpen={isOpen} isMobile={isMobile}>
      <SidebarHeader>
        {isMobile && (
          <CloseButton onClick={closeSidebar} aria-label="Fechar menu">
            <FaTimes />
          </CloseButton>
        )}
        
        <LogoContainer>
          <Logo>
            <FaTasks />
            <span>Todo App</span>
          </Logo>
          <ThemeToggle onClick={toggleTheme} title={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </ThemeToggle>
        </LogoContainer>
      </SidebarHeader>
      
      <SearchContainer>
        <SearchInput>
          <input 
            type="text" 
            placeholder="Buscar tarefas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
        </SearchInput>
        <SearchTypeSelect>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'title' | 'description' | 'category' | 'all')}
            aria-label="Tipo de busca"
          >
            <option value="all">Buscar em tudo</option>
            <option value="title">Apenas títulos</option>
            <option value="description">Apenas descrições</option>
            <option value="category">Apenas categorias</option>
          </select>
        </SearchTypeSelect>
      </SearchContainer>
      
      <NavSection>
        <NavTitle>Navegação</NavTitle>
        <NavList>
          <NavItem>
            <NavLink to="/" onClick={handleNavClick}>
              <FaHome />
              <span>Página Inicial</span>
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/filtros" onClick={handleNavClick}>
              <FaFilter />
              <span>Filtros Avançados</span>
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/dashboard" onClick={handleNavClick}>
              <FaChartBar />
              <span>Dashboard</span>
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/kanban" onClick={handleNavClick}>
              <FaColumns />
              <span>Kanban</span>
            </NavLink>
          </NavItem>
        </NavList>
      </NavSection>
      
      <SectionTitle>
        <span>Categorias</span>
        <AddButton onClick={() => setShowCategoryForm(!showCategoryForm)}>
          <FaPlus />
        </AddButton>
      </SectionTitle>
      
      {showCategoryForm && (
        <CategoryList>
          <CategoryItem 
            color="var(--accent-color)"
            active={activeCategory === 'todas'}
            onClick={() => {
              setActiveCategory('todas');
              if (isMobile) closeSidebar();
            }}
          >
            <div className="category-color"></div>
            <div className="category-name">Todas</div>
            <div className="category-count">{todos.length}</div>
          </CategoryItem>
          
          {categories.map((category) => (
            <CategoryItem 
              key={category}
              color="var(--accent-color)"
              active={activeCategory === category}
              onClick={() => {
                setActiveCategory(category);
                if (isMobile) closeSidebar();
              }}
            >
              <div className="category-color"></div>
              <div className="category-name">{category}</div>
              <div className="category-count">{getCategoryCount(category)}</div>
            </CategoryItem>
          ))}
        </CategoryList>
      )}
      
      <StatusContainer>
        <StatusItem>
          <StatusLabel>Tarefas pendentes:</StatusLabel>
          <StatusValue>{pendingTasks}</StatusValue>
        </StatusItem>
        <StatusItem>
          <StatusLabel>Tarefas concluídas:</StatusLabel>
          <StatusValue>{completedTasks}</StatusValue>
        </StatusItem>
        <StatusItem>
          <StatusLabel>Total de tarefas:</StatusLabel>
          <StatusValue>{todos.length}</StatusValue>
        </StatusItem>
      </StatusContainer>
    </SidebarContainer>
  );
};

export default Sidebar; 