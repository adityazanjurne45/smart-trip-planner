import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Link2 } from "lucide-react";
import { TripDetails } from "@/types/trip";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareTripProps {
  tripDetails: TripDetails;
}

const ShareTrip = ({ tripDetails }: ShareTripProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = `Check out my trip plan from ${tripDetails.boardingPoint} to ${tripDetails.destinationPoint} (${tripDetails.duration} days, $${tripDetails.budget} budget) — planned with Travello!`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: "Trip details copied to clipboard." });
    } catch {
      toast({ title: "Error", description: "Could not copy to clipboard.", variant: "destructive" });
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Trip to ${tripDetails.destinationPoint}`, text: shareText, url: window.location.href });
      } catch {}
    } else {
      copyLink();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={shareNative} className="gap-2 cursor-pointer">
          <Share2 className="w-4 h-4" />
          Share Trip
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink} className="gap-2 cursor-pointer">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Details"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareTrip;
