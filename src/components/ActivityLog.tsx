import { ActivityEntry } from '@/types/task';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Pencil, ArrowRight, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const icons: Record<ActivityEntry['action'], React.ReactNode> = {
  created: <Plus className="h-3.5 w-3.5 text-success" />,
  edited: <Pencil className="h-3.5 w-3.5 text-primary" />,
  moved: <ArrowRight className="h-3.5 w-3.5 text-priority-medium" />,
  deleted: <Trash2 className="h-3.5 w-3.5 text-destructive" />,
};

const actionLabels: Record<ActivityEntry['action'], string> = {
  created: 'created',
  edited: 'edited',
  moved: 'moved',
  deleted: 'deleted',
};

const ActivityLog = ({ entries }: { entries: ActivityEntry[] }) => {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground py-8">
        No activity yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1 pr-3">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-start gap-2.5 rounded-md p-2 hover:bg-muted/50 transition-colors">
            <div className="mt-0.5 shrink-0">{icons[entry.action]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-foreground">
                <span className="font-medium">{entry.taskTitle}</span>{' '}
                <span className="text-muted-foreground">{actionLabels[entry.action]}</span>
                {entry.details && <span className="text-muted-foreground"> · {entry.details}</span>}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ActivityLog;
