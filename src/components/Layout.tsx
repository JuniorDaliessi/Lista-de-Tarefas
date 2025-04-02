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
  overflow-x: hidden;
`;

const MainContent = styled.div<{ isSidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${props => props.isSidebarOpen ? '280px' : '0'};
  padding: 2rem;
  background-color: var(--background-primary);
  transition: margin-left var(--transition-normal);
  min-height: 100vh;
  position: relative;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1.5rem 1rem;
    width: 100%;
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
  left: 0;
  right: 0;
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

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--accent-color);
    background-color: var(--hover-background);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ThemeToggle = styled(IconButton)`
  &:hover {
    transform: rotate(15deg);
  }
`;

const MenuToggle = styled(IconButton)`
  &:hover {
    transform: scale(1.1);
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
  backdrop-filter: blur(2px);
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-open sidebar on desktop, close on mobile
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    
    // Toggle body class to prevent scrolling on mobile when sidebar is open
    if (isMobile) {
      document.body.classList.toggle('sidebar-open', !sidebarOpen);
    }
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.classList.remove('sidebar-open');
  };

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} isMobile={isMobile} />
      
      <Overlay isVisible={isMobile && sidebarOpen} onClick={closeSidebar} />
      
      <MainContent isSidebarOpen={sidebarOpen && !isMobile}>
        {isMobile && (
          <MobileHeader>
            <MenuToggle onClick={toggleSidebar} aria-label="Menu">
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </MenuToggle>
            
            <AppTitle>Todo App</AppTitle>
            
            <HeaderControls>
              <ThemeToggle onClick={toggleTheme} aria-label="Alternar tema">
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </ThemeToggle>
            </HeaderControls>
          </MobileHeader>
        )}
        
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 