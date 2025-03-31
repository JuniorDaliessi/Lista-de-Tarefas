import React from 'react';
import styled from 'styled-components';
import { Project } from '../../types/Project';

const SelectorContainer = styled.div`
  margin-bottom: 1rem;
`;

const SelectList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
`;

const ProjectOption = styled.div<{ active: boolean }>`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#3498db' : '#f1f1f1'};
  color: ${props => props.active ? 'white' : '#555'};
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#e0e0e0'};
  }
`;

interface ProjectSelectorProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  projects, 
  activeProjectId, 
  onSelectProject 
}) => {
  if (projects.length === 0) {
    return null;
  }
  
  return (
    <SelectorContainer>
      <SelectList>
        {projects.map(project => (
          <ProjectOption 
            key={project.id}
            active={project.id === activeProjectId}
            onClick={() => onSelectProject(project.id)}
          >
            {project.name}
          </ProjectOption>
        ))}
      </SelectList>
    </SelectorContainer>
  );
};

export default ProjectSelector;
export {}; 