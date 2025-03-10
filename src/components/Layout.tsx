import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

const MainContent = styled.div<{ isSidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${props => props.isSidebarOpen ? '280px' : '0'};
  padding: 2rem;
  background-color: var(--background-primary);
  transition: margin-left var(--transition-normal);
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const MobileHeader = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: var(--background-secondary);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const AppTitle = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  font-weight: 600;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--accent-color);
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
  display: ${props => props.isVisible ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Layout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <LayoutContainer>
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
        isMobile={isMobile} 
      />
      
      <Overlay 
        isVisible={isMobile && isSidebarOpen} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      <MainContent isSidebarOpen={!isMobile && isSidebarOpen}>
        <MobileHeader>
          <AppTitle>Todo App</AppTitle>
          
          <HeaderControls>
            <ThemeToggle onClick={toggleTheme} aria-label="Alternar tema">
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </ThemeToggle>
            
            <MenuButton onClick={toggleSidebar}>
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </MenuButton>
          </HeaderControls>
        </MobileHeader>
        
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 