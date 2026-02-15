import { useState, useCallback, useEffect } from 'react';
import { Task, ActivityEntry, BoardState, ColumnId, Priority } from '@/types/task';

const STORAGE_KEY = 'taskboard_state';

const loadState = (): BoardState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        activityLog: Array.isArray(parsed.activityLog) ? parsed.activityLog : [],
      };
    }
  } catch { /* ignore */ }
  return { tasks: [], activityLog: [] };
};

const saveState = (state: BoardState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
};

const genId = () => crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2);

const addLog = (log: ActivityEntry[], action: ActivityEntry['action'], taskTitle: string, details?: string): ActivityEntry[] => {
  const entry: ActivityEntry = { id: genId(), action, taskTitle, details, timestamp: new Date().toISOString() };
  return [entry, ...log].slice(0, 50);
};

export const useBoard = () => {
  const [state, setState] = useState<BoardState>(loadState);

  useEffect(() => { saveState(state); }, [state]);

  const createTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => {
    setState(prev => {
      const newTask: Task = { ...task, id: genId(), createdAt: new Date().toISOString(), columnId: 'todo' };
      return {
        tasks: [...prev.tasks, newTask],
        activityLog: addLog(prev.activityLog, 'created', task.title),
      };
    });
  }, []);

  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;
      return {
        tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
        activityLog: addLog(prev.activityLog, 'edited', updates.title || task.title),
      };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;
      return {
        tasks: prev.tasks.filter(t => t.id !== id),
        activityLog: addLog(prev.activityLog, 'deleted', task.title),
      };
    });
  }, []);

  const moveTask = useCallback((id: string, toColumn: ColumnId) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task || task.columnId === toColumn) return prev;
      const columnNames: Record<ColumnId, string> = { todo: 'Todo', doing: 'Doing', done: 'Done' };
      return {
        tasks: prev.tasks.map(t => t.id === id ? { ...t, columnId: toColumn } : t),
        activityLog: addLog(prev.activityLog, 'moved', task.title, `${columnNames[task.columnId]} → ${columnNames[toColumn]}`),
      };
    });
  }, []);

  const resetBoard = useCallback(() => {
    setState({ tasks: [], activityLog: [] });
  }, []);

  return { ...state, createTask, editTask, deleteTask, moveTask, resetBoard };
};
