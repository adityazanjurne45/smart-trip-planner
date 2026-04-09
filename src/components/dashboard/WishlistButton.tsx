import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist, WishlistItem } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  item: Omit<WishlistItem, "id" | "addedAt">;
  size?: "sm" | "default" | "icon";
  className?: string;
}

const WishlistButton = ({ item, size = "icon", className }: WishlistButtonProps) => {
  const { isInWishlist, toggleItem } = useWishlist();
  const active = isInWishlist(item.name, item.type);

  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        "transition-all duration-300",
        active && "text-red-500 hover:text-red-600",
        !active && "text-muted-foreground hover:text-red-400",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        toggleItem(item);
      }}
    >
      <Heart className={cn("w-5 h-5 transition-transform", active && "fill-current scale-110")} />
    </Button>
  );
};

export default WishlistButton;
