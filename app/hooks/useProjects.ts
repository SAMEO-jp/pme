import { useState, useEffect } from 'react';
import { Project } from '../types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('currentUser_projects');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(parsedProjects);
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load projects'));
      setLoading(false);
    }
  }, []);

  return { projects, loading, error };
}; 