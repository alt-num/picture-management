import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RemarkType, Remark } from '@/types/remark';

interface AddRemarkFormProps {
  open: boolean;
  onClose: () => void;
  profileId?: string;
  onSubmit: (remark: Omit<Remark, 'id' | 'date'>) => Promise<void>;
}

export function AddRemarkForm({
  open,
  onClose,
  profileId,
  onSubmit,
}: AddRemarkFormProps) {
  const [type, setType] = useState<RemarkType>('suggestion');
  const [madeBy, setMadeBy] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setType('suggestion');
    setMadeBy('');
    setTitle('');
    setBody('');
  };

  const handleSubmit = async () => {
    if (!profileId) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit({
        profileId,
        type,
        madeBy,
        title,
        body,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to add remark:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Remark</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as RemarkType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestion">Suggestion</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="request">Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Made By</label>
            <Input
              placeholder="Made by"
              value={madeBy}
              onChange={(e) => setMadeBy(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Description"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[150px] resize-y"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!type || !madeBy || !title || !body || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Remark'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
