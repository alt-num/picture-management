import { Card, CardContent } from "@/components/ui/card";
import { SubscriberDetailsDialog } from "@/components/SubscriberDetailsDialog";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { SubscriberFilters } from "@/components/SubscriberFilters";
import { SubscribersTable } from "@/components/SubscribersTable";
import { RemarkViewer } from "@/components/remarks/RemarkViewer";
import { Remark } from "@/types/remark";

const Dashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [claimFilter, setClaimFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<number | undefined>();
  const [remarksFilter, setRemarksFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRemarkViewerOpen, setIsRemarkViewerOpen] = useState(false);
  const [selectedSubscriberRemarks, setSelectedSubscriberRemarks] = useState<any[]>([]);

  // Fetch subscribers from API
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/api/profiles');
        if (!response.ok) {
          throw new Error('Failed to fetch subscribers');
        }
        const data = await response.json();
        // Add hasRemarks field based on remarks count
        const subscribersWithRemarkInfo = await Promise.all(
          data.map(async (subscriber: any) => {
            const remarksResponse = await fetch(`http://localhost:3001/api/remarks/${subscriber.id}`);
            if (remarksResponse.ok) {
              const remarks = await remarksResponse.json();
              return { ...subscriber, hasRemarks: remarks.length > 0 };
            }
            return { ...subscriber, hasRemarks: false };
          })
        );
        setSubscribers(subscribersWithRemarkInfo);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
        toast({
          title: "Error",
          description: "Failed to load subscribers",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, [toast]);

  const handleAddSubscriber = async (formData: FormData) => {
    try {
      console.log('Sending request to server...');
      const response = await fetch('http://localhost:3001/api/profiles', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to add subscriber');
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      setSubscribers(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Subscriber added successfully",
      });
    } catch (error) {
      console.error('Error adding subscriber:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add subscriber",
        variant: "destructive",
      });
    }
  };

  const handleEditSubscriber = async (formData: FormData) => {
    try {
      // Get the subscriber ID from the form data
      const subscriberId = formData.get('id');
      if (!subscriberId) {
        throw new Error('No subscriber ID found');
      }

      console.log('Editing subscriber:', subscriberId);
      console.log('Form data entries:', Array.from(formData.entries()));

      const response = await fetch(`http://localhost:3001/api/profiles/${subscriberId}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to update subscriber');
      }

      const updated = await response.json();
      console.log('Server response:', updated);

      // Update the local state with the new data
      setSubscribers(prevSubscribers => {
        const newSubscribers = prevSubscribers.map(sub => 
          sub.id === subscriberId ? { ...sub, ...updated } : sub
        );
        console.log('Updated subscribers:', newSubscribers);
        return newSubscribers;
      });

      // Refresh the subscribers list
      const refreshResponse = await fetch('http://localhost:3001/api/profiles');
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setSubscribers(refreshedData);
      }

      // Close any open dialogs
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog) {
        const closeButton = dialog.querySelector('button[aria-label="Close"]');
        if (closeButton instanceof HTMLButtonElement) {
          closeButton.click();
        }
      }

      toast({
        title: "Success",
        description: "Subscriber updated successfully",
      });
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update subscriber",
        variant: "destructive"
      });
    }
  };

  const handleViewSubscriber = (subscriber: any) => {
    setSelectedSubscriber(subscriber);
    setIsDetailsOpen(true);
  };

  const handlePaymentChange = async (subscriberId: string, update: any) => {
    try {
      const formData = new FormData();
      formData.append('id', subscriberId);
      formData.append('paymentStatus', update.status);
      if (update.partialAmount) {
        formData.append('partialAmount', update.partialAmount.toString());
      }
      if (update.paymentDate) {
        formData.append('paymentDate', update.paymentDate);
      }

      const response = await fetch(`http://localhost:3001/api/profiles/${subscriberId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update payment status');
      }

      const data = await response.json();
      setSubscribers(prevSubscribers =>
        prevSubscribers.map(sub =>
          sub.id === subscriberId ? { ...sub, ...data } : sub
        )
      );

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update payment status",
      });
    }
  };

  const handleClaimChange = async (subscriberId: string, update: any) => {
    try {
      const formData = new FormData();
      formData.append('id', subscriberId);
      formData.append('isClaimed', update.isClaimed.toString());
      if (update.claimDate) {
        formData.append('claimDate', update.claimDate);
      }
      if (update.claimedBy) {
        formData.append('claimedBy', update.claimedBy);
      }

      const response = await fetch(`http://localhost:3001/api/profiles/${subscriberId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update claim status');
      }

      const data = await response.json();
      setSubscribers(prevSubscribers =>
        prevSubscribers.map(sub =>
          sub.id === subscriberId ? { ...sub, ...data } : sub
        )
      );

      toast({
        title: "Success",
        description: update.isClaimed ? "Item claimed successfully" : "Claim removed successfully",
      });
    } catch (error) {
      console.error('Error updating claim status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update claim status",
      });
    }
  };

  const handleStatusChange = async (subscriberId: string, update: { status: string }) => {
    try {
      const formData = new FormData();
      formData.append('id', subscriberId);
      formData.append('status', update.status);

      const response = await fetch(`http://localhost:3001/api/profiles/${subscriberId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const data = await response.json();
      setSubscribers(prevSubscribers =>
        prevSubscribers.map(sub =>
          sub.id === subscriberId ? { ...sub, ...data } : sub
        )
      );

      toast({
        title: "Success",
        description: `Profile ${update.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
      });
    }
  };

  const handleRemarkClick = async (subscriberId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/remarks/${subscriberId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch remarks');
      }
      const remarks = await response.json();
      setSelectedSubscriberRemarks(remarks);
      setSelectedSubscriber(subscribers.find(s => s.id === subscriberId));
      setIsRemarkViewerOpen(true);
    } catch (error) {
      console.error('Error fetching remarks:', error);
      toast({
        title: "Error",
        description: "Failed to load remarks",
        variant: "destructive"
      });
    }
  };

  const handleAddRemark = async (remark: Omit<Remark, 'id' | 'date'>) => {
    if (!selectedSubscriber) return;
    
    try {
      const response = await fetch('http://localhost:3001/api/remarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...remark,
          profileId: selectedSubscriber.id,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add remark');
      }

      // Refresh remarks for the selected subscriber
      const remarksResponse = await fetch(`http://localhost:3001/api/remarks/${selectedSubscriber.id}`);
      if (remarksResponse.ok) {
        const updatedRemarks = await remarksResponse.json();
        setSelectedSubscriberRemarks(updatedRemarks);
        
        // Update the hasRemarks status in the subscribers list
        setSubscribers(prev => prev.map(sub => 
          sub.id === selectedSubscriber.id 
            ? { ...sub, hasRemarks: true }
            : sub
        ));
      }

      toast({
        title: "Success",
        description: "Remark added successfully",
      });
    } catch (error) {
      console.error('Error adding remark:', error);
      toast({
        title: "Error",
        description: "Failed to add remark",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRemark = async (remarkId: string) => {
    if (!selectedSubscriber) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/remarks/${remarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete remark');
      }

      // Refresh remarks for the selected subscriber
      const remarksResponse = await fetch(`http://localhost:3001/api/remarks/${selectedSubscriber.id}`);
      if (remarksResponse.ok) {
        const updatedRemarks = await remarksResponse.json();
        setSelectedSubscriberRemarks(updatedRemarks);
        
        // Update the hasRemarks status in the subscribers list
        setSubscribers(prev => prev.map(sub => 
          sub.id === selectedSubscriber.id 
            ? { ...sub, hasRemarks: updatedRemarks.length > 0 }
            : sub
        ));
      }

      toast({
        title: "Success",
        description: "Remark deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting remark:', error);
      toast({
        title: "Error",
        description: "Failed to delete remark",
        variant: "destructive"
      });
    }
  };

  // Filter subscribers based on all criteria
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const searchFields = [
      subscriber.fullName,
      subscriber.studentNumber,
      subscriber.degreeProgram,
      subscriber.package,
    ];
    const matchesSearch =
      searchTerm === "" ||
      searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCourse =
      courseFilter === "all" || subscriber.degreeProgram === courseFilter;

    const matchesPackage =
      packageFilter === "all" || subscriber.package === packageFilter;

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && subscriber.paymentStatus === "full") ||
      (paymentFilter === "partial" && subscriber.paymentStatus === "partial") ||
      (paymentFilter === "unpaid" && subscriber.paymentStatus === "not_paid");

    const matchesClaim =
      claimFilter === "all" ||
      (claimFilter === "claimed" && subscriber.isClaimed) ||
      (claimFilter === "unclaimed" && !subscriber.isClaimed);

    const matchesDate =
      !dateFilter ||
      (subscriber.claimDate &&
        new Date(subscriber.claimDate).getFullYear() === dateFilter);

    const matchesRemarks =
      remarksFilter === "all" ||
      (remarksFilter === "withRemarks" ? subscriber.hasRemarks : !subscriber.hasRemarks);

    const matchesStatus =
      statusFilter === "all" || subscriber.status === statusFilter;

    return (
      matchesSearch &&
      matchesCourse &&
      matchesPackage &&
      matchesPayment &&
      matchesClaim &&
      matchesDate &&
      matchesRemarks &&
      matchesStatus
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading subscribers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAddSubscriber={handleAddSubscriber} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Subscriber Management
              </h2>
              <p className="text-muted-foreground">
                Manage and track your subscribers
              </p>
            </div>

            <SubscriberFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              courseFilter={courseFilter}
              setCourseFilter={setCourseFilter}
              packageFilter={packageFilter}
              setPackageFilter={setPackageFilter}
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
              claimFilter={claimFilter}
              setClaimFilter={setClaimFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              remarksFilter={remarksFilter}
              setRemarksFilter={setRemarksFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <SubscribersTable
              subscribers={filteredSubscribers}
              onView={handleViewSubscriber}
              onEdit={handleEditSubscriber}
              onPaymentChange={handlePaymentChange}
              onClaimChange={handleClaimChange}
              onStatusChange={handleStatusChange}
              onRemarkClick={handleRemarkClick}
            />
          </CardContent>
        </Card>
      </main>
      
      <SubscriberDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        subscriber={selectedSubscriber}
      />
      {selectedSubscriber && (
        <RemarkViewer
          open={isRemarkViewerOpen}
          onClose={() => setIsRemarkViewerOpen(false)}
          profileId={selectedSubscriber?.id}
          remarks={selectedSubscriberRemarks}
          onAddRemark={handleAddRemark}
          onDeleteRemark={handleDeleteRemark}
        />
      )}
    </div>
  );
};

export default Dashboard;