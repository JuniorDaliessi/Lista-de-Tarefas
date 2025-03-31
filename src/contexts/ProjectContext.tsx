import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, KanbanColumn, DefaultColumnId, TaskMetrics } from '../types/Project';
import { Todo } from '../types/Todo';
import { useTodo } from './TodoContext';
import * as LocalStorageService from '../services/localStorage';

// Default columns for new projects
const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: 'backlog', title: 'A Fazer', order: 0, wipLimit: undefined },
  { id: 'in-progress', title: 'Em Andamento', order: 1, wipLimit: 5 },
  { id: 'review', title: 'Em Revisão', order: 2, wipLimit: 3 },
  { id: 'done', title: 'Concluído', order: 3, wipLimit: undefined }
];

interface ProjectContextProps {
  projects: Project[];
  activeProjectId: string | null;
  taskMetrics: TaskMetrics[];
  
  // Project CRUD
  setActiveProjectId: (id: string | null) => void;
  createProject: (name: string, description: string) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  
  // Column management
  addColumn: (projectId: string, title: string, wipLimit?: number) => void;
  updateColumn: (projectId: string, column: KanbanColumn) => void;
  deleteColumn: (projectId: string, columnId: string) => void;
  
  // Task management in Kanban
  addTodoToProject: (projectId: string, todoId: string, columnId: string) => void;
  removeTodoFromProject: (projectId: string, todoId: string) => void;
  moveTodoToColumn: (todoId: string, targetColumnId: string, newOrder?: number) => void;
  reorderTodoInColumn: (todoId: string, newOrder: number) => void;
  
  // Metrics
  getLeadTime: (todoId: string) => number | null; // in milliseconds
  getCycleTime: (todoId: string) => number | null; // in milliseconds
  
  isLoading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { todos, updateTodo } = useTodo();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [taskMetrics, setTaskMetrics] = useState<TaskMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Load projects
      const storedProjects = LocalStorageService.getItem<Project[]>('projects') || [];
      setProjects(storedProjects);
      
      // Load task metrics
      const storedMetrics = LocalStorageService.getItem<TaskMetrics[]>('taskMetrics') || [];
      setTaskMetrics(storedMetrics);
      
      // Load active project
      const storedActiveProjectId = LocalStorageService.getItem<string>('activeProjectId');
      setActiveProjectId(storedActiveProjectId);
      
      setError(null);
    } catch (err) {
      console.error("Error loading project data:", err);
      setError("Failed to load project data");
      setProjects([]);
      setTaskMetrics([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      LocalStorageService.setItem('projects', projects);
    }
  }, [projects, isLoading]);

  // Save task metrics to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      LocalStorageService.setItem('taskMetrics', taskMetrics);
    }
  }, [taskMetrics, isLoading]);

  // Save active project to localStorage when it changes
  useEffect(() => {
    if (!isLoading) {
      LocalStorageService.setItem('activeProjectId', activeProjectId);
    }
  }, [activeProjectId, isLoading]);

  // Project CRUD operations
  const createProject = useCallback((name: string, description: string): Project => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      columns: [...DEFAULT_COLUMNS], // Copy default columns
      todoIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id 
          ? { ...updatedProject, updatedAt: new Date().toISOString() } 
          : project
      )
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    // First remove project assignment from all todos
    todos.forEach(todo => {
      if (todo.projectId === id) {
        updateTodo({
          ...todo,
          projectId: undefined,
          columnId: undefined,
          order: undefined
        });
      }
    });
    
    // Then remove the project
    setProjects(prev => prev.filter(project => project.id !== id));
    
    // If active project is deleted, set active to null
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
  }, [todos, updateTodo, activeProjectId]);

  // Column management
  const addColumn = useCallback((projectId: string, title: string, wipLimit?: number) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id !== projectId) return project;
        
        // Create new column with order at the end
        const newColumn: KanbanColumn = {
          id: uuidv4(),
          title,
          wipLimit,
          order: project.columns.length
        };
        
        return {
          ...project,
          columns: [...project.columns, newColumn],
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  const updateColumn = useCallback((projectId: string, updatedColumn: KanbanColumn) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id !== projectId) return project;
        
        return {
          ...project,
          columns: project.columns.map(column => 
            column.id === updatedColumn.id ? updatedColumn : column
          ),
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  const deleteColumn = useCallback((projectId: string, columnId: string) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id !== projectId) return project;
        
        // Move all tasks from this column to the first column
        const firstColumnId = project.columns.sort((a, b) => a.order - b.order)[0]?.id;
        
        if (firstColumnId && firstColumnId !== columnId) {
          // Update todos that were in this column
          todos.forEach(todo => {
            if (todo.projectId === projectId && todo.columnId === columnId) {
              updateTodo({
                ...todo,
                columnId: firstColumnId
              });
              
              // Update metrics
              updateTaskColumnMetrics(todo.id, firstColumnId);
            }
          });
        }
        
        // Remove the column
        const filteredColumns = project.columns.filter(column => column.id !== columnId);
        
        // Reorder remaining columns
        const reorderedColumns = filteredColumns.map((column, index) => ({
          ...column,
          order: index
        }));
        
        return {
          ...project,
          columns: reorderedColumns,
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, [todos, updateTodo]);

  // Task management in Kanban
  const addTodoToProject = useCallback((projectId: string, todoId: string, columnId: string) => {
    // Find max order in the target column for proper positioning
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const columnTodos = todos.filter(
      t => t.projectId === projectId && t.columnId === columnId
    );
    const maxOrder = columnTodos.length > 0
      ? Math.max(...columnTodos.map(t => t.order || 0))
      : -1;
    
    // Update the todo
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      updateTodo({
        ...todo,
        projectId,
        columnId,
        order: maxOrder + 1
      });
      
      // Initialize or update metrics
      updateTaskColumnMetrics(todoId, columnId);
      
      // Add to project if not already there
      if (!project.todoIds.includes(todoId)) {
        setProjects(prev => 
          prev.map(p => {
            if (p.id !== projectId) return p;
            
            return {
              ...p,
              todoIds: [...p.todoIds, todoId],
              updatedAt: new Date().toISOString()
            };
          })
        );
      }
    }
  }, [projects, todos, updateTodo]);

  const removeTodoFromProject = useCallback((projectId: string, todoId: string) => {
    // Update the todo
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      updateTodo({
        ...todo,
        projectId: undefined,
        columnId: undefined,
        order: undefined
      });
    }
    
    // Remove from project
    setProjects(prev => 
      prev.map(project => {
        if (project.id !== projectId) return project;
        
        return {
          ...project,
          todoIds: project.todoIds.filter(id => id !== todoId),
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, [todos, updateTodo]);

  const moveTodoToColumn = useCallback((todoId: string, targetColumnId: string, newOrder?: number) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo || !todo.projectId) return;
    
    const sourceColumnId = todo.columnId;
    
    // Find max order in the target column if newOrder not provided
    if (newOrder === undefined) {
      const columnTodos = todos.filter(
        t => t.projectId === todo.projectId && t.columnId === targetColumnId
      );
      const maxOrder = columnTodos.length > 0
        ? Math.max(...columnTodos.map(t => t.order || 0))
        : -1;
      newOrder = maxOrder + 1;
    }
    
    // Special handling for when a task enters the "in-progress" or "done" columns
    const now = new Date().toISOString();
    let additionalUpdates = {};
    
    if (targetColumnId === 'in-progress' && !todo.startedAt) {
      additionalUpdates = { startedAt: now };
    } else if (targetColumnId === 'done' && !todo.completedAt) {
      additionalUpdates = { completedAt: now, completed: true };
    }
    
    // Update the todo
    updateTodo({
      ...todo,
      columnId: targetColumnId,
      order: newOrder,
      ...additionalUpdates
    });
    
    // Reorganize tasks in the source column
    if (sourceColumnId) {
      const sourceTodos = todos.filter(
        t => t.id !== todoId && t.projectId === todo.projectId && t.columnId === sourceColumnId
      );
      
      // Reorder todos in the source column to fill the gap
      const sourceTodosToUpdate: Todo[] = [];
      sourceTodos.forEach(t => {
        const currentOrder = t.order || 0;
        if (currentOrder > (todo.order || 0)) {
          sourceTodosToUpdate.push({
            ...t,
            order: currentOrder - 1
          });
        }
      });
      
      // Update source column todos
      sourceTodosToUpdate.forEach(t => updateTodo(t));
    }
    
    // Reorganize tasks in the target column
    const targetTodos = todos.filter(
      t => t.id !== todoId && t.projectId === todo.projectId && t.columnId === targetColumnId
    );
    
    // Shift todos in the target column to make space
    const targetTodosToUpdate: Todo[] = [];
    targetTodos.forEach(t => {
      const currentOrder = t.order || 0;
      if (newOrder !== undefined && currentOrder >= newOrder) {
        targetTodosToUpdate.push({
          ...t,
          order: currentOrder + 1
        });
      }
    });
    
    // Update target column todos
    targetTodosToUpdate.forEach(t => updateTodo(t));
    
    // Update metrics
    updateTaskColumnMetrics(todoId, targetColumnId);
  }, [todos, updateTodo]);

  const reorderTodoInColumn = useCallback((todoId: string, newOrder: number) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo || !todo.projectId || !todo.columnId) return;
    
    // Get all todos in the same column
    const columnTodos = todos.filter(
      t => t.projectId === todo.projectId && t.columnId === todo.columnId
    );
    
    // Remove the current todo from the array for reordering
    const otherTodos = columnTodos.filter(t => t.id !== todoId);
    
    // Set the new order for the current todo
    updateTodo({
      ...todo,
      order: newOrder
    });
    
    // Reorder other todos to maintain consistent ordering
    const todosToUpdate: Todo[] = [];
    
    otherTodos.forEach(t => {
      let newPosition = t.order || 0;
      
      if (todo.order !== undefined && newOrder > todo.order) {
        // Moving down - shift todos between old and new position up by 1
        if (newPosition > todo.order && newPosition <= newOrder) {
          newPosition--;
        }
      } else if (todo.order !== undefined && newOrder < todo.order) {
        // Moving up - shift todos between new and old position down by 1
        if (newPosition >= newOrder && newPosition < todo.order) {
          newPosition++;
        }
      }
      
      // Only update if the order changed
      if (newPosition !== t.order) {
        todosToUpdate.push({
          ...t,
          order: newPosition
        });
      }
    });
    
    // Update all modified todos
    todosToUpdate.forEach(updatedTodo => {
      updateTodo(updatedTodo);
    });
  }, [todos, updateTodo]);

  // Helper for tracking task metrics
  const updateTaskColumnMetrics = useCallback((todoId: string, columnId: string) => {
    const now = new Date().toISOString();
    
    setTaskMetrics(prev => {
      // Find existing metrics for this todo
      const existingMetricsIndex = prev.findIndex(m => m.todoId === todoId);
      
      if (existingMetricsIndex >= 0) {
        // Update existing metrics
        const metrics = { ...prev[existingMetricsIndex] };
        
        // Find the last column change (that doesn't have a leftAt time)
        const lastChangeIndex = metrics.columnChanges.findIndex(change => !change.leftAt);
        
        if (lastChangeIndex >= 0) {
          // If the column hasn't changed, do nothing
          if (metrics.columnChanges[lastChangeIndex].columnId === columnId) {
            return prev;
          }
          
          // Mark the previous column as left
          metrics.columnChanges[lastChangeIndex].leftAt = now;
        }
        
        // Add new column entry
        metrics.columnChanges.push({
          columnId,
          enteredAt: now
        });
        
        const newMetrics = [...prev];
        newMetrics[existingMetricsIndex] = metrics;
        return newMetrics;
      } else {
        // Create new metrics
        return [...prev, {
          todoId,
          columnChanges: [{
            columnId,
            enteredAt: now
          }]
        }];
      }
    });
  }, []);

  // Calculate lead time (total time from first column entry to last column)
  const getLeadTime = useCallback((todoId: string): number | null => {
    const metrics = taskMetrics.find(m => m.todoId === todoId);
    if (!metrics || metrics.columnChanges.length === 0) return null;
    
    const firstEntry = new Date(metrics.columnChanges[0].enteredAt).getTime();
    
    // If task is in the last column, use either the time it entered or current time
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return null;
    
    const project = projects.find(p => p.id === todo.projectId);
    if (!project) return null;
    
    const isInLastColumn = todo.columnId === project.columns
      .sort((a, b) => b.order - a.order)[0]?.id;
    
    if (isInLastColumn) {
      if (todo.completedAt) {
        return new Date(todo.completedAt).getTime() - firstEntry;
      } else {
        return Date.now() - firstEntry;
      }
    }
    
    // For ongoing tasks, use current time
    return Date.now() - firstEntry;
  }, [taskMetrics, todos, projects]);

  // Calculate cycle time (time in active work - typically "in progress" column)
  const getCycleTime = useCallback((todoId: string): number | null => {
    const metrics = taskMetrics.find(m => m.todoId === todoId);
    if (!metrics) return null;
    
    // Find time spent in "in-progress" column
    const inProgressChanges = metrics.columnChanges.filter(
      change => change.columnId === 'in-progress'
    );
    
    if (inProgressChanges.length === 0) return 0; // Never in progress
    
    let totalTime = 0;
    
    for (const change of inProgressChanges) {
      const startTime = new Date(change.enteredAt).getTime();
      const endTime = change.leftAt 
        ? new Date(change.leftAt).getTime() 
        : Date.now(); // Still in progress
      
      totalTime += endTime - startTime;
    }
    
    return totalTime;
  }, [taskMetrics]);

  const value = useMemo(() => ({
    projects,
    activeProjectId,
    taskMetrics,
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    addColumn,
    updateColumn,
    deleteColumn,
    addTodoToProject,
    removeTodoFromProject,
    moveTodoToColumn,
    reorderTodoInColumn,
    getLeadTime,
    getCycleTime,
    isLoading,
    error
  }), [
    projects,
    activeProjectId,
    taskMetrics,
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    addColumn,
    updateColumn,
    deleteColumn,
    addTodoToProject,
    removeTodoFromProject,
    moveTodoToColumn,
    reorderTodoInColumn,
    getLeadTime,
    getCycleTime,
    isLoading,
    error
  ]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextProps => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}; 