import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBoard } from '@/hooks/useBoard';
import { Task, ColumnId, Priority } from '@/types/task';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import BoardColumn from '@/components/BoardColumn';
import TaskDialog from '@/components/TaskDialog';
import ActivityLog from '@/components/ActivityLog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { Plus, Search, LogOut, RotateCcw, Activity, LayoutDashboard } from 'lucide-react';

const columns: ColumnId[] = ['todo', 'doing', 'done'];

const Board = () => {
  const { logout, userEmail } = useAuth();
  const board = useBoard();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortByDue, setSortByDue] = useState(false);

  const filteredTasks = useMemo(() => {
    let tasks = board.tasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q));
    }
    if (priorityFilter !== 'all') {
      tasks = tasks.filter(t => t.priority === priorityFilter);
    }
    if (sortByDue) {
      tasks = [...tasks].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    return tasks;
  }, [board.tasks, search, priorityFilter, sortByDue]);

  const tasksByColumn = (col: ColumnId) => filteredTasks.filter(t => t.columnId === col);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const toCol = result.destination.droppableId as ColumnId;
    board.moveTask(result.draggableId, toCol);
  };

  const handleSave = (data: { title: string; description: string; priority: Priority; dueDate: string | null; tags: string[] }) => {
    if (editingTask) {
      board.editTask(editingTask.id, data);
    } else {
      board.createTask(data);
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      board.deleteTask(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black relative overflow-hidden">
      {/* Neon grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-purple-500/20 bg-black/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">TaskFlow</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-gray-400">{userEmail}</span>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-gray-300 hover:text-white hover:bg-purple-600/20">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="border-b border-purple-500/20 bg-black/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-9 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px] h-9 bg-gray-900/50 border-gray-700 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white">All priorities</SelectItem>
                <SelectItem value="high" className="text-white">High</SelectItem>
                <SelectItem value="medium" className="text-white">Medium</SelectItem>
                <SelectItem value="low" className="text-white">Low</SelectItem>
                <SelectItem value="none" className="text-white">None</SelectItem>
              </SelectContent>
            </Select>

            <Button variant={sortByDue ? 'secondary' : 'outline'} size="sm" onClick={() => setSortByDue(!sortByDue)} className="h-9 bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-purple-600/20 hover:text-white">
              Sort by due date
            </Button>

            <div className="ml-auto flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-9 bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-purple-600/20 hover:text-white">
                    <Activity className="h-4 w-4" /> Activity
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-900 border-gray-700">
                  <SheetHeader>
                    <SheetTitle className="text-white">Activity Log</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <ActivityLog entries={board.activityLog} />
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="outline" size="sm" className="gap-1.5 h-9 bg-gray-900/50 border-gray-700 text-red-400 hover:bg-red-600/20 hover:text-red-400" onClick={() => setResetOpen(true)}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>

              <Button size="sm" className="gap-1.5 h-9 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => { setEditingTask(null); setDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Board */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {columns.map(col => (
                  <BoardColumn
                    key={col}
                    columnId={col}
                    tasks={tasksByColumn(col)}
                    onEdit={handleEdit}
                    onDelete={id => setDeleteId(id)}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <TaskDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        task={editingTask}
      />

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Reset Board</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will permanently delete all tasks and activity history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => board.resetBoard()} className="bg-red-600 text-white hover:bg-red-700">
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">Are you sure you want to delete this task?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Board;
