import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RemarkIconProps {
  hasRemarks: boolean;
  onClick: () => void;
}

export function RemarkIcon({ hasRemarks, onClick }: RemarkIconProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative"
    >
      <Mail className="h-4 w-4" />
      {hasRemarks && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
      )}
    </Button>
  );
}
