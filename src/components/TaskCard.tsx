import { Task, Priority } from '@/types/task';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isPast, isToday } from 'date-fns';

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  medium: { label: 'Medium', className: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30' },
  low: { label: 'Low', className: 'bg-primary/15 text-primary border-primary/30' },
  none: { label: 'None', className: 'bg-muted text-muted-foreground border-border' },
};

interface Props {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, index, onEdit, onDelete }: Props) => {
  const prio = priorityConfig[task.priority];
  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && isPast(dueDateObj) && !isToday(dueDateObj);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group rounded-lg border border-orange-500/30 bg-gradient-to-br from-orange-600/20 to-orange-700/30 backdrop-blur-sm p-3 shadow-lg transition-all ${
            snapshot.isDragging ? 'shadow-xl ring-2 ring-orange-400/50 scale-105' : 'hover:shadow-xl hover:scale-[1.02]'
          }`}
        >
          <div className="flex items-start gap-2">
            <div {...provided.dragHandleProps} className="mt-0.5 cursor-grab text-red-500 hover:text-red-600">
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-black leading-tight font-sans">{task.title}</h3>
                <div className="flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-100/20" onClick={() => onEdit(task)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-100/20" onClick={() => onDelete(task.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {task.description && (
                <p className="mt-1 text-xs text-gray-700 line-clamp-2 font-sans leading-relaxed">{task.description}</p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {task.priority !== 'none' && (
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 bg-orange-500/20 border-orange-400/50 text-gray-800 font-medium font-sans`}>
                    {prio.label}
                  </Badge>
                )}
                {dueDateObj && (
                  <span className={`inline-flex items-center gap-1 text-[10px] ${isOverdue ? 'text-red-600' : 'text-gray-600'} font-sans`}>
                    <Calendar className="h-3 w-3" />
                    {format(dueDateObj, 'MMM d')}
                  </span>
                )}
                {task.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 bg-orange-500/20 text-gray-800 border-orange-400/30 font-medium font-sans">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
