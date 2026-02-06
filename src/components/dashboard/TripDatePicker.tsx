import { useState } from "react";
import { format, addDays, differenceInDays, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, ArrowRight, Plane, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface TripDates {
  startDate: Date;
  endDate: Date;
}

interface TripDatePickerProps {
  value?: TripDates;
  onChange: (dates: TripDates) => void;
  className?: string;
}

const QUICK_OPTIONS = [
  { label: "Weekend Trip", days: 2 },
  { label: "Week Trip", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "Month Trip", days: 30 },
];

const TripDatePicker = ({ value, onChange, className }: TripDatePickerProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(value?.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(value?.endDate);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const today = startOfDay(new Date());

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      if (endDate && isBefore(endDate, date)) {
        setEndDate(addDays(date, 1));
      }
      if (!endDate) {
        setEndDate(addDays(date, 7));
      }
      setIsStartOpen(false);
      
      const end = endDate && !isBefore(endDate, date) ? endDate : addDays(date, 7);
      onChange({ startDate: date, endDate: end });
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date && startDate) {
      setEndDate(date);
      setIsEndOpen(false);
      onChange({ startDate, endDate: date });
    }
  };

  const handleQuickSelect = (days: number) => {
    const start = today;
    const end = addDays(start, days);
    setStartDate(start);
    setEndDate(end);
    onChange({ startDate: start, endDate: end });
  };

  const tripDuration = startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Quick Selection Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Quick Select</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_OPTIONS.map((option) => (
            <Button
              key={option.days}
              type="button"
              variant={tripDuration === option.days ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickSelect(option.days)}
              className="rounded-xl"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Plane className="w-4 h-4" />
            Start Date
          </label>
          <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 rounded-xl",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select departure date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                disabled={(date) => isBefore(date, today)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            End Date
          </label>
          <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 rounded-xl",
                  !endDate && "text-muted-foreground"
                )}
                disabled={!startDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Select return date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                disabled={(date) => startDate ? isBefore(date, startDate) : true}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Trip Duration Display */}
      {startDate && endDate && (
        <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Departure</p>
            <p className="font-medium text-foreground">{format(startDate, "MMM d")}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-border" />
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10">
              <span className="text-lg font-bold text-primary">{tripDuration}</span>
              <span className="text-sm text-primary">days</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Return</p>
            <p className="font-medium text-foreground">{format(endDate, "MMM d")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDatePicker;
