import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  yearFilter: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
}

const TripFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  yearFilter,
  onYearChange,
  availableYears,
}: TripFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by destination..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[160px] rounded-xl">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Trips</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="ongoing">Ongoing</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {/* Year Filter */}
      <Select value={yearFilter} onValueChange={onYearChange}>
        <SelectTrigger className="w-full sm:w-[140px] rounded-xl">
          <Calendar className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TripFilters;
