import { Camera, Sun, Sunrise, Sunset } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstagramScoreProps {
  placeName: string;
  className?: string;
}

function getScore(name: string): number {
  // Deterministic hash-based score between 5.0 and 9.8
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return Math.round((5 + (Math.abs(hash) % 48) / 10) * 10) / 10;
}

function getBestPhotoTime(name: string): { label: string; icon: typeof Sun } {
  const hash = name.length % 3;
  if (hash === 0) return { label: "Golden Hour (Sunrise)", icon: Sunrise };
  if (hash === 1) return { label: "Golden Hour (Sunset)", icon: Sunset };
  return { label: "Midday (Best Light)", icon: Sun };
}

const InstagramScore = ({ placeName, className }: InstagramScoreProps) => {
  const score = getScore(placeName);
  const photoTime = getBestPhotoTime(placeName);
  const PhotoIcon = photoTime.icon;

  const color =
    score >= 8 ? "text-travel-coral" :
    score >= 6.5 ? "text-travel-gold" :
    "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-3 mt-2 text-xs", className)}>
      <div className={cn("flex items-center gap-1 font-semibold", color)}>
        <Camera className="w-3.5 h-3.5" />
        <span>{score}/10</span>
        <span className="text-muted-foreground font-normal">📸</span>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <PhotoIcon className="w-3 h-3" />
        <span>{photoTime.label}</span>
      </div>
    </div>
  );
};

export default InstagramScore;
