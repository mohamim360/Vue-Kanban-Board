import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Calendar, FolderPlus, Folder, Edit2, Trash2 } from 'lucide-react';

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  const loadProjects = () => {
    try {
      const saved = localStorage.getItem('kanban-projects');
      if (saved) {
        const loadedProjects = JSON.parse(saved);
        setProjects(loadedProjects);
        if (!currentProject && loadedProjects.length > 0) {
          setCurrentProject(loadedProjects[0]);
        }
      } else {
        const defaultProject = createDefaultProject();
        setProjects([defaultProject]);
        setCurrentProject(defaultProject);
        localStorage.setItem('kanban-projects', JSON.stringify([defaultProject]));
      }
    } catch (e) {
      console.error('Failed to load projects', e);
    }
  };

  const createDefaultProject = () => ({
    id: 'default-' + uid(),
    name: 'My First Project',
    description: 'Welcome to your Kanban board!',
    createdAt: now(),
    columns: {
      todo: { name: 'To Do', cards: [] },
      inprogress: { name: 'In Progress', cards: [] },
      done: { name: 'Done', cards: [] }
    }
  });

  const saveProjects = (updatedProjects) => {
    try {
      localStorage.setItem('kanban-projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  };

  const createProject = (projectData) => {
    const newProject = {
      id: uid(),
      name: projectData.name,
      description: projectData.description || '',
      createdAt: now(),
      columns: {
        todo: { name: 'To Do', cards: [] },
        inprogress: { name: 'In Progress', cards: [] },
        done: { name: 'Done', cards: [] }
      }
    };
    const updated = [newProject, ...projects];
    saveProjects(updated);
    setCurrentProject(newProject);
    return newProject;
  };

  const switchProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      return project;
    }
    return null;
  };

  const deleteProject = (projectId) => {
    const filtered = projects.filter(p => p.id !== projectId);
    saveProjects(filtered);
    if (currentProject?.id === projectId) {
      setCurrentProject(filtered.length > 0 ? filtered[0] : null);
    }
    return true;
  };

  const updateCurrentProject = (updatedData) => {
    if (!currentProject) return;
    const updated = projects.map(p =>
      p.id === currentProject.id ? { ...p, ...updatedData } : p
    );
    saveProjects(updated);
    setCurrentProject({ ...currentProject, ...updatedData });
  };

  return {
    projects,
    currentProject,
    loadProjects,
    createProject,
    switchProject,
    deleteProject,
    updateCurrentProject
  };
}
