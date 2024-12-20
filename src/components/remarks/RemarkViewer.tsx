import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Remark, RemarkType } from '@/types/remark';
import { AddRemarkForm } from './AddRemarkForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface RemarkViewerProps {
  open: boolean;
  onClose: () => void;
  profileId?: string;
  remarks: Remark[];
  onAddRemark: (remark: Omit<Remark, 'id' | 'date'>) => Promise<void>;
  onDeleteRemark: (remarkId: string) => Promise<void>;
}

export function RemarkViewer({
  open,
  onClose,
  profileId,
  remarks,
  onAddRemark,
  onDeleteRemark,
}: RemarkViewerProps) {
  const [filterType, setFilterType] = useState<RemarkType | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedRemarks, setExpandedRemarks] = useState<string[]>([]);

  const filteredRemarks = filterType === 'all'
    ? remarks
    : remarks.filter(remark => remark.type === filterType);

  const toggleExpand = (remarkId: string) => {
    setExpandedRemarks(prev => 
      prev.includes(remarkId)
        ? prev.filter(id => id !== remarkId)
        : [...prev, remarkId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Remarks</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between mb-4">
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as RemarkType | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
              <SelectItem value="complaint">Complaint</SelectItem>
              <SelectItem value="request">Request</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Remark
          </Button>
        </div>
        <ScrollArea className="h-[500px] pr-4">
          {filteredRemarks.map((remark) => (
            <Collapsible
              key={remark.id}
              open={expandedRemarks.includes(remark.id)}
              className="mb-4 p-4 border rounded-lg relative group transition-all duration-200 hover:border-primary/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {remark.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(remark.date).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2"
                  onClick={() => onDeleteRemark(remark.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="mb-1">
                <span className="text-sm text-gray-500">Made by: </span>
                <span className="font-medium">{remark.madeBy}</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">{remark.title}</h4>
              <CollapsibleContent>
                <div className="text-gray-700 break-words">
                  {remark.body}
                </div>
              </CollapsibleContent>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full hover:bg-transparent hover:text-primary"
                  onClick={() => toggleExpand(remark.id)}
                >
                  {expandedRemarks.includes(remark.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          ))}
        </ScrollArea>
      </DialogContent>
      <AddRemarkForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        profileId={profileId}
        onSubmit={onAddRemark}
      />
    </Dialog>
  );
}
