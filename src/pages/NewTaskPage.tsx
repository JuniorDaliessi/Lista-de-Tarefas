import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import TodoForm from '../components/TodoForm';
import { useProject } from '../contexts/ProjectContext';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--text-primary);
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const NewTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projects } = useProject();
  
  // Get query parameters
  const projectId = searchParams.get('projectId');
  const columnId = searchParams.get('columnId');
  
  // State for project and column information
  const [projectName, setProjectName] = useState<string>('');
  const [columnName, setColumnName] = useState<string>('');
  
  // On component mount, get project and column names
  useEffect(() => {
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setProjectName(project.name);
        
        if (columnId) {
          const column = project.columns.find(c => c.id === columnId);
          if (column) {
            setColumnName(column.title);
          }
        }
      }
    }
  }, [projectId, columnId, projects]);
  
  // Handle cancel button
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Nova Tarefa</Title>
        {projectName && (
          <Subtitle>
            Adicionando tarefa ao projeto "{projectName}"
            {columnName && ` na coluna "${columnName}"`}
          </Subtitle>
        )}
      </PageHeader>
      
      <TodoForm 
        onCancel={handleCancel}
        projectId={projectId || undefined}
        columnId={columnId || undefined}
      />
    </PageContainer>
  );
};

export default NewTaskPage; 