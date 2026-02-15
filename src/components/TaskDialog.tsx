import { useState, useEffect } from 'react';
import { Task, Priority } from '@/types/task';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; priority: Priority; dueDate: string | null; tags: string[] }) => void;
  task?: Task | null;
}

const TaskDialog = ({ open, onClose, onSave, task }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setPriority(task?.priority || 'none');
      setDueDate(task?.dueDate || '');
      setTags(task?.tags || []);
      setTagInput('');
      setTitleError('');
    }
  }, [open, task]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    onSave({ title: title.trim(), description: description.trim(), priority, dueDate: dueDate || null, tags });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              value={title}
              onChange={e => { setTitle(e.target.value); setTitleError(''); }}
              placeholder="What needs to be done?"
            />
            {titleError && <p className="text-xs text-destructive">{titleError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={v => setPriority(v as Priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due Date</Label>
              <Input id="task-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
