export type Priority = 'high' | 'medium' | 'low' | 'none';
export type ColumnId = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  columnId: ColumnId;
}

export interface ActivityEntry {
  id: string;
  action: 'created' | 'edited' | 'moved' | 'deleted';
  taskTitle: string;
  details?: string;
  timestamp: string;
}

export interface BoardState {
  tasks: Task[];
  activityLog: ActivityEntry[];
}
