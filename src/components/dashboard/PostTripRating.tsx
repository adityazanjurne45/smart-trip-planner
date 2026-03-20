import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PostTripRatingProps {
  tripId: string;
  destination: string;
  currentRating?: number | null;
  currentNotes?: string | null;
  onRated?: () => void;
}

const PostTripRating = ({ tripId, destination, currentRating, currentNotes, onRated }: PostTripRatingProps) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState(currentNotes || "");
  const [submitted, setSubmitted] = useState(!!currentRating);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("past_trips")
        .update({ rating, notes: feedback || null })
        .eq("id", tripId);

      if (error) throw error;

      setSubmitted(true);
      toast({ title: "Thanks for your feedback!", description: "Your rating helps improve future recommendations." });
      onRated?.();
    } catch {
      toast({ title: "Error", description: "Failed to save rating.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-travel-forest bg-travel-forest/5 rounded-xl p-3 border border-travel-forest/10">
        <CheckCircle2 className="w-4 h-4" />
        <span>Rated {rating}/5 — Thank you!</span>
      </div>
    );
  }

  return (
    <Card className="travel-card border-travel-gold/20 bg-travel-gold/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Star className="w-5 h-5 text-travel-gold" />
          Rate your trip to {destination}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-7 h-7 transition-colors",
                  (hoveredRating || rating) >= star
                    ? "text-travel-gold fill-travel-gold"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Share your experience (optional)..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="rounded-xl resize-none"
          rows={2}
        />

        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={rating === 0 || saving}
          className="gap-2 rounded-xl"
        >
          <Send className="w-4 h-4" />
          Submit Rating
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostTripRating;
