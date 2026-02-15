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
          className={`group rounded-lg border bg-card p-3 shadow-sm transition-shadow ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start gap-2">
            <div {...provided.dragHandleProps} className="mt-0.5 cursor-grab text-muted-foreground/50 hover:text-muted-foreground">
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-card-foreground leading-snug">{task.title}</h3>
                <div className="flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(task)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => onDelete(task.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {task.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {task.priority !== 'none' && (
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${prio.className}`}>
                    {prio.label}
                  </Badge>
                )}
                {dueDateObj && (
                  <span className={`inline-flex items-center gap-1 text-[10px] ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                    <Calendar className="h-3 w-3" />
                    {format(dueDateObj, 'MMM d')}
                  </span>
                )}
                {task.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
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
