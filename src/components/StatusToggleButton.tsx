import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle } from "lucide-react";

interface StatusToggleButtonProps {
  status: string;
  onStatusChange: (update: { status: string }) => void;
}

export function StatusToggleButton({ status, onStatusChange }: StatusToggleButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isActive = status === 'active';

  const handleToggle = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    onStatusChange({ status: isActive ? 'inactive' : 'active' });
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${isActive ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'}`}
        onClick={handleToggle}
        title={`Profile is ${status}`}
      >
        {isActive ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? 'Deactivate Profile' : 'Activate Profile'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive
                ? 'Are you sure you want to deactivate this profile? This will disable most actions for this profile.'
                : 'Are you sure you want to activate this profile? This will enable all actions for this profile.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {isActive ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
