import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Pencil} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubscriberForm } from "./SubscriberForm";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { SortableTableHeader } from "./table/SortableTableHeader";
import { sortData } from "@/utils/sorting";
import { SortConfig } from "@/types/sorting";
import { PaymentStatusButton } from "./PaymentStatusButton";
import { ClaimStatusButton } from "./ClaimStatusButton";
import { StatusToggleButton } from "./StatusToggleButton";
import { RemarkIcon } from "./remarks/RemarkIcon";

interface SubscribersTableProps {
  subscribers: any[];
  onEdit: (subscriber: any) => void;
  onView: (subscriber: any) => void;
  onPaymentChange: (subscriberId: string, paymentUpdate: any) => void;
  onClaimChange: (subscriberId: string, claimUpdate: any) => void;
  onStatusChange: (subscriberId: string, statusUpdate: any) => void;
  onRemarkClick: (subscriberId: string) => void;
}

export function SubscribersTable({ 
  subscribers, 
  onEdit, 
  onView,
  onPaymentChange,
  onClaimChange,
  onStatusChange,
  onRemarkClick,
}: SubscribersTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current?.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedSubscribers = sortData(subscribers, sortConfig);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center"></TableHead>
              <SortableTableHeader
                field="fullName"
                label="Name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHead className="text-center">Student Number</TableHead>
              <TableHead className="text-center">Course</TableHead>
              <TableHead className="text-center">Package</TableHead>
              <TableHead className="text-center">Payment Status</TableHead>
              <SortableTableHeader
                field="claimDate"
                label="Claim Status"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHead className="text-center">Remarks</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="text-center">
                  <Avatar>
                    <AvatarImage
                      src={subscriber.pictureUrl}
                      alt={subscriber.fullName}
                    />
                    <AvatarFallback>{subscriber.fullName[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="text-center">{subscriber.fullName}</TableCell>
                <TableCell className="text-center">{subscriber.studentNumber}</TableCell>
                <TableCell className="text-center">{subscriber.degreeProgram}</TableCell>
                <TableCell className="text-center">{subscriber.package}</TableCell>
                <TableCell className="text-center">
                  <PaymentStatusButton
                    status={subscriber.paymentStatus || "not_paid"}
                    partialAmount={subscriber.partialAmount}
                    paymentDate={subscriber.paymentDate}
                    onStatusChange={(update) => onPaymentChange(subscriber.id, update)}
                    disabled={subscriber.status === 'inactive'}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <ClaimStatusButton
                    isClaimed={subscriber.isClaimed}
                    claimDate={subscriber.claimDate}
                    claimedBy={subscriber.claimedBy}
                    paymentStatus={subscriber.paymentStatus || "not_paid"}
                    onClaimChange={(update) => onClaimChange(subscriber.id, update)}
                    disabled={subscriber.status === 'inactive'}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <RemarkIcon 
                    hasRemarks={subscriber.hasRemarks} 
                    onClick={() => onRemarkClick(subscriber.id)} 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <Dialog>
                          <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                disabled={subscriber.status === 'inactive'}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          </TooltipTrigger>
                          <DialogContent className="max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Subscriber</DialogTitle>
                              <DialogDescription>
                                Update the subscriber's information below.
                              </DialogDescription>
                            </DialogHeader>
                            <SubscriberForm
                              onSubmit={(formData) => {
                                if (formData instanceof FormData) {
                                  formData.append('id', subscriber.id);
                                }
                                onEdit(formData);
                              }}
                              initialData={subscriber}
                              mode="edit"
                            />
                          </DialogContent>
                        </Dialog>
                        <TooltipContent>
                          {subscriber.status === 'inactive' 
                            ? 'This action is unavailable for inactive profiles'
                            : 'Edit Profile'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8" 
                            onClick={() => onView(subscriber)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          View Profile
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <StatusToggleButton
                              status={subscriber.status || 'active'}
                              onStatusChange={(update) => onStatusChange(subscriber.id, update)}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Toggle Profile Status
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
