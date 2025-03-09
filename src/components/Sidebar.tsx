import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaHome, FaFilter, FaClipboardList } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 1rem 0;
    position: relative;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border-left: 4px solid #3498db;
  }
`;

const Icon = styled.span`
  margin-right: 0.8rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  font-size: 1rem;
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <Logo>Todo App</Logo>
      <NavMenu>
        <NavItem>
          <StyledNavLink to="/" end>
            <Icon>
              <FaHome />
            </Icon>
            <Text>Início</Text>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/filtros">
            <Icon>
              <FaFilter />
            </Icon>
            <Text>Filtros Avançados</Text>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/todas-tarefas">
            <Icon>
              <FaClipboardList />
            </Icon>
            <Text>Todas as Tarefas</Text>
          </StyledNavLink>
        </NavItem>
      </NavMenu>
    </SidebarContainer>
  );
};

export default Sidebar; 