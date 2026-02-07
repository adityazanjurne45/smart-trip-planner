import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Star, 
  Trash2, 
  MoreVertical,
  Eye,
  Copy,
  Pencil,
  Clock
} from "lucide-react";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";
import { cn } from "@/lib/utils";

interface PastTrip {
  id: string;
  boarding_point: string;
  destination: string;
  duration: number;
  budget: number;
  trip_date: string;
  rating?: number | null;
  notes?: string | null;
}

interface TripCardProps {
  trip: PastTrip;
  onDelete: (id: string) => void;
  onDuplicate?: (trip: PastTrip) => void;
  index: number;
}

const TripCard = ({ trip, onDelete, onDuplicate, index }: TripCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTripStatus = (): { label: string; color: string; bgColor: string } => {
    const tripDate = new Date(trip.trip_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(tripDate);
    endDate.setDate(endDate.getDate() + trip.duration);
    
    if (today < tripDate) {
      return { label: "Upcoming", color: "text-primary", bgColor: "bg-primary/10 border-primary/20" };
    } else if (today >= tripDate && today <= endDate) {
      return { label: "Ongoing", color: "text-travel-coral", bgColor: "bg-travel-coral/10 border-travel-coral/20" };
    }
    return { label: "Completed", color: "text-travel-forest", bgColor: "bg-travel-forest/10 border-travel-forest/20" };
  };

  const status = getTripStatus();
  const isUpcoming = status.label === "Upcoming";

  return (
    <Card 
      className="overflow-hidden border-border shadow-soft hover:shadow-medium transition-all group animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Destination Image */}
      <div className="relative h-40 overflow-hidden">
        <PlaceImageGallery
          query={trip.destination}
          type="destination"
          aspectRatio={16 / 9}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={cn("border", status.bgColor, status.color)}>
            {status.label}
          </Badge>
        </div>
        
        {/* Actions Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </DropdownMenuItem>
              {isUpcoming && (
                <DropdownMenuItem className="gap-2">
                  <Pencil className="w-4 h-4" />
                  Edit Trip
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem 
                  className="gap-2"
                  onClick={() => onDuplicate(trip)}
                >
                  <Copy className="w-4 h-4" />
                  Duplicate Trip
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Destination Name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-lg font-bold truncate">{trip.destination}</h3>
          <p className="text-white/80 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            From {trip.boarding_point}
          </p>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Trip Details */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(trip.trip_date)}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
            <Clock className="w-3.5 h-3.5" />
            {trip.duration} days
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
            <Wallet className="w-3.5 h-3.5" />
            ${trip.budget.toLocaleString()}
          </span>
        </div>

        {/* Rating */}
        {trip.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < trip.rating!
                    ? "text-travel-gold fill-travel-gold"
                    : "text-muted"
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">Your rating</span>
          </div>
        )}

        {/* Notes Preview */}
        {trip.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {trip.notes}
          </p>
        )}

        {/* Action Button */}
        <Button variant="outline" className="w-full gap-2" size="sm">
          <Eye className="w-4 h-4" />
          View Trip Details
        </Button>
      </CardContent>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the trip to {trip.destination} from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(trip.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TripCard;
