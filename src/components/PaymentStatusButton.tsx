import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PaymentStatusButtonProps {
  status: "not_paid" | "partial" | "full";
  onStatusChange: (newStatus: {
    status: "not_paid" | "partial" | "full";
    partialAmount?: number;
    paymentDate?: string;
  }) => void;
  disabled?: boolean;
  partialAmount?: number;
  paymentDate?: string;
}

export function PaymentStatusButton({
  status,
  onStatusChange,
  disabled = false,
  partialAmount,
  paymentDate,
}: PaymentStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentAmount, setCurrentAmount] = useState(partialAmount?.toString() || "");
  const [currentDate, setCurrentDate] = useState(
    paymentDate ? new Date(paymentDate).toISOString().slice(0, 16) : ""
  );

  const handleSubmit = () => {
    onStatusChange({
      status: currentStatus,
      partialAmount: currentAmount ? parseFloat(currentAmount) : undefined,
      paymentDate: currentDate || undefined,
    });
    setIsOpen(false);
  };

  const getStatusColor = () => {
    switch (status) {
      case "full":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "full":
        return "Paid";
      case "partial":
        return `Partial (₱${partialAmount})`;
      default:
        return "Unpaid";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}
          disabled={disabled}
        >
          {getStatusText()}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup
            value={currentStatus}
            onValueChange={(value: "not_paid" | "partial" | "full") => {
              setCurrentStatus(value);
              if (value === "full" || value === "not_paid") {
                setCurrentAmount("");
              }
              if (value === "full" || value === "partial") {
                setCurrentDate(new Date().toISOString().slice(0, 16));
              } else {
                setCurrentDate("");
              }
            }}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not_paid" id="not_paid" />
              <Label htmlFor="not_paid">Not Paid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial" id="partial" />
              <Label htmlFor="partial">Partial</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full">Full</Label>
            </div>
          </RadioGroup>

          {currentStatus === "partial" && (
            <div className="space-y-2">
              <Label htmlFor="amount">Partial Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          )}

          {(currentStatus === "partial" || currentStatus === "full") && (
            <div className="space-y-2">
              <Label htmlFor="date">Payment Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
