import { Task, ColumnId } from '@/types/task';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const columnMeta: Record<ColumnId, { title: string; emoji: string }> = {
  todo: { title: 'Todo', emoji: '📋' },
  doing: { title: 'Doing', emoji: '⚡' },
  done: { title: 'Done', emoji: '✅' },
};

interface Props {
  columnId: ColumnId;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const BoardColumn = ({ columnId, tasks, onEdit, onDelete }: Props) => {
  const meta = columnMeta[columnId];

  return (
    <div className="flex flex-col rounded-xl border border-column-border bg-column p-3 min-h-[300px]">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{meta.emoji}</span>
          <h2 className="text-sm font-semibold text-foreground">{meta.title}</h2>
        </div>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 rounded-lg p-1 transition-colors ${
              snapshot.isDraggingOver ? 'bg-primary/5' : ''
            }`}
          >
            {tasks.map((task, idx) => (
              <TaskCard key={task.id} task={task} index={idx} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default BoardColumn;
