import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEGREE_PROGRAMS } from "@/data/degreePrograms";

interface SubscriberFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  courseFilter: string;
  setCourseFilter: (value: string) => void;
  packageFilter: string;
  setPackageFilter: (value: string) => void;
  paymentFilter: string;
  setPaymentFilter: (value: string) => void;
  claimFilter: string;
  setClaimFilter: (value: string) => void;
  dateFilter: number | undefined;
  setDateFilter: (year: number | undefined) => void;
  remarksFilter: string;
  setRemarksFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function SubscriberFilters({
  searchTerm,
  setSearchTerm,
  courseFilter,
  setCourseFilter,
  packageFilter,
  setPackageFilter,
  paymentFilter,
  setPaymentFilter,
  claimFilter,
  setClaimFilter,
  dateFilter,
  setDateFilter,
  remarksFilter,
  setRemarksFilter,
  statusFilter,
  setStatusFilter,
}: SubscriberFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      {/* Search bar row */}
      <div className="w-full">
        <Input
          placeholder="Search subscribers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Filters row */}
      <div className="flex flex-wrap gap-2">
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {DEGREE_PROGRAMS.map((program) => (
              <SelectItem key={program.name} value={program.name}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={packageFilter} onValueChange={setPackageFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Packages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Packages</SelectItem>
            <SelectItem value="Basic Package">Basic Package</SelectItem>
            <SelectItem value="With Frame">With Frame</SelectItem>
            <SelectItem value="With Extra Shots">With Extra Shots</SelectItem>
            <SelectItem value="Both Frame and Extra Shots">Both Frame and Extra Shots</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={claimFilter} onValueChange={setClaimFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Claim Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Claims</SelectItem>
            <SelectItem value="claimed">Claimed</SelectItem>
            <SelectItem value="unclaimed">Unclaimed</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          value={dateFilter?.toString() || "all"} 
          onValueChange={(value) => setDateFilter(value === "all" ? undefined : parseInt(value))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Claim Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={remarksFilter} onValueChange={setRemarksFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Remarks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Profiles</SelectItem>
            <SelectItem value="withRemarks">With Remarks</SelectItem>
            <SelectItem value="withoutRemarks">Without Remarks</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Profile Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
