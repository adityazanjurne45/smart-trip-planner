import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PastTrip } from '@/types/profile';
import { MapPin, Calendar, Wallet, Star, Trash2, History, Navigation } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

interface PastTripsSectionProps {
  trips: PastTrip[];
  onDelete: (tripId: string) => Promise<{ error: any }>;
}

const PastTripsSection = ({ trips, onDelete }: PastTripsSectionProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (tripId: string) => {
    setDeletingId(tripId);
    await onDelete(tripId);
    setDeletingId(null);
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-travel-gold fill-travel-gold'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="travel-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <History className="w-5 h-5 text-travel-forest" />
        Past Trip History
      </h2>

      {trips.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No past trips yet. Start planning your first adventure!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {trip.boarding_point}
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span className="text-accent">{trip.destination}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(trip.trip_date), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{trip.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wallet className="w-4 h-4" />
                      ${trip.budget}
                    </div>
                    {trip.rating && renderStars(trip.rating)}
                  </div>
                  
                  {trip.notes && (
                    <p className="mt-2 text-sm text-muted-foreground italic">
                      "{trip.notes}"
                    </p>
                  )}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this trip to {trip.destination}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(trip.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {deletingId === trip.id ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastTripsSection;
