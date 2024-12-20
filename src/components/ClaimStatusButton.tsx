import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ClaimStatusButtonProps {
  isClaimed: boolean;
  onClaimChange: (newStatus: {
    isClaimed: boolean;
    claimDate?: string;
    claimedBy?: string;
  }) => void;
  disabled?: boolean;
  claimDate?: string;
  claimedBy?: string;
  paymentStatus: "not_paid" | "partial" | "full";
}

export function ClaimStatusButton({
  isClaimed,
  onClaimChange,
  disabled = false,
  claimDate,
  claimedBy,
  paymentStatus,
}: ClaimStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentClaimDate, setCurrentClaimDate] = useState(
    claimDate ? new Date(claimDate).toISOString().slice(0, 16) : ""
  );
  const [currentClaimedBy, setCurrentClaimedBy] = useState(claimedBy || "");

  const handleSubmit = () => {
    onClaimChange({
      isClaimed: true,
      claimDate: currentClaimDate || new Date().toISOString(),
      claimedBy: currentClaimedBy,
    });
    setIsOpen(false);
  };

  const handleUnclaim = () => {
    onClaimChange({
      isClaimed: false,
    });
    setIsOpen(false);
  };

  const getStatusColor = () => {
    if (paymentStatus !== "full") {
      return "bg-gray-100 text-gray-800";
    }
    return isClaimed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = () => {
    if (paymentStatus !== "full") {
      return "Payment Required";
    }
    if (isClaimed) {
      return "Claimed";
    }
    return "Ready for Claim";
  };

  const formatClaimDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const isDisabled = disabled || paymentStatus !== "full";

  return (
    <div className="flex flex-col items-center gap-1">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}
            disabled={isDisabled}
          >
            {getStatusText()}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isClaimed ? "Claim Details" : "Record Claim"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isClaimed ? (
              <>
                <div className="space-y-2">
                  <Label>Claimed On</Label>
                  <div className="text-sm">
                    {new Date(claimDate!).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Claimed By</Label>
                  <div className="text-sm">{claimedBy}</div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Close
                  </Button>
                  <Button variant="destructive" onClick={handleUnclaim}>
                    Remove Claim
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="claimDate">Claim Date & Time</Label>
                  <Input
                    id="claimDate"
                    type="datetime-local"
                    value={currentClaimDate}
                    onChange={(e) => setCurrentClaimDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimedBy">Claimed By</Label>
                  <Input
                    id="claimedBy"
                    value={currentClaimedBy}
                    onChange={(e) => setCurrentClaimedBy(e.target.value)}
                    placeholder="Enter name of claimer"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Record Claim</Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {isClaimed && claimDate && (
        <div className="text-xs text-gray-500">
          {formatClaimDate(claimDate)}
        </div>
      )}
    </div>
  );
}
