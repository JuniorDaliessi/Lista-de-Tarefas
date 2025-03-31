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
  }
`;

const SidebarHeader = styled.div`
  position: relative;
  padding: 0 1rem 0 1.5rem;
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
  transition: color var(--transition-fast);
  z-index: 10;
  
  &:hover {
    color: var(--text-primary);
    background: none;
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
  transition: color var(--transition-fast), background-color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--hover-background);
  }
  
  @media (max-width: 768px) {
    display: none; /* Oculta o botão em dispositivos móveis já que está no header */
  }
`;

const SearchContainer = styled.div`
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
    font-size: 0.9rem;
    transition: all var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(79, 134, 247, 0.2);
    }
    
    &::placeholder {
      color: var(--text-tertiary);
    }
  }
`;

const SearchTypeSelect = styled.div`
  width: 100%;
  
  select {
    width: 100%;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.85rem;
    transition: all var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
    }
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
  transition: color var(--transition-fast);
  
  input:focus + & {
    color: var(--accent-color);
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

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.25rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: var(--hover-background);
    color: var(--text-primary);
  }
  
  &.active {
    background-color: var(--active-background);
    color: var(--accent-color);
    border-left: 3px solid var(--accent-color);
  }
`;

const CategoryItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.5rem;
  color: ${(props) => props.active ? 'var(--accent-color)' : 'var(--text-secondary)'};
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  background-color: ${(props) => props.active ? 'var(--active-background)' : 'transparent'};
  border-left: 3px solid ${(props) => props.active ? 'var(--accent-color)' : 'transparent'};
  
  &:hover {
    background-color: var(--hover-background);
    color: ${(props) => props.active ? 'var(--accent-color)' : 'var(--text-primary)'};
  }
`;

const CategoryContent = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryCount = styled.span<{ active: boolean }>`
  background-color: ${props => props.active ? 'var(--accent-color)' : 'var(--background-primary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  transition: all var(--transition-fast);
`;

const Icon = styled.span`
  margin-right: 0.8rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  min-width: 1.1rem;
`;

const Text = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
`;

const CategoryForm = styled.form`
  padding: 0 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
`;

const CategoryInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.8rem;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  border: 1px solid var(--border-color);
  border-right: none;
  background-color: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const AddCategoryButton = styled.button`
  padding: 0 0.75rem;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: var(--accent-color);
  color: white;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-light);
  }
  
  &:active {
    background-color: var(--accent-dark);
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
      
      <NavMenu>
        <NavItem>
          <StyledNavLink to="/" onClick={handleNavClick}>
            <Icon>
              <FaHome />
            </Icon>
            <Text>Página Inicial</Text>
          </StyledNavLink>
        </NavItem>
        
        <NavItem>
          <StyledNavLink to="/filtros" onClick={handleNavClick}>
            <Icon>
              <FaFilter />
            </Icon>
            <Text>Filtros Avançados</Text>
          </StyledNavLink>
        </NavItem>
        
        <NavItem>
          <StyledNavLink to="/dashboard" onClick={handleNavClick}>
            <Icon>
              <FaChartBar />
            </Icon>
            <Text>Dashboard</Text>
          </StyledNavLink>
        </NavItem>
        
        <NavItem>
          <StyledNavLink to="/kanban" onClick={handleNavClick}>
            <span><FaColumns /></span>
            Kanban
          </StyledNavLink>
        </NavItem>
      </NavMenu>
      
      <SectionTitle>
        <span>Categorias</span>
        <AddButton onClick={() => setShowCategoryForm(!showCategoryForm)}>
          <FaPlus />
        </AddButton>
      </SectionTitle>
      
      {showCategoryForm && (
        <CategoryForm onSubmit={handleCategorySubmit}>
          <CategoryInput 
            type="text" 
            placeholder="Nova categoria" 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            autoFocus
          />
          <AddCategoryButton type="submit">
            <FaPlus />
          </AddCategoryButton>
        </CategoryForm>
      )}
      
      <NavMenu>
        <CategoryItem 
          active={activeCategory === 'todas'} 
          onClick={() => {
            setActiveCategory('todas');
            if (isMobile) closeSidebar();
          }}
        >
          <CategoryContent>
            <Icon>
              <FaTags />
            </Icon>
            <Text>Todas</Text>
          </CategoryContent>
          <CategoryCount active={activeCategory === 'todas'}>
            {todos.length}
          </CategoryCount>
        </CategoryItem>
        
        {categories.map((category) => (
          <CategoryItem 
            key={category}
            active={activeCategory === category}
            onClick={() => {
              setActiveCategory(category);
              if (isMobile) closeSidebar();
            }}
          >
            <CategoryContent>
              <Icon>
                <FaTags />
              </Icon>
              <Text>{category}</Text>
            </CategoryContent>
            <CategoryCount active={activeCategory === category}>
              {getCategoryCount(category)}
            </CategoryCount>
          </CategoryItem>
        ))}
      </NavMenu>
      
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