import { useState, useEffect, useCallback } from "react";
import { X, Gift, Tag, Plane, MapPin, Hotel, Sparkles, Copy, Check, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface TickerOffer {
  id: string;
  title: string;
  description: string;
  type: "discount" | "deal" | "alert" | "feature";
  icon: React.ElementType;
  couponCode?: string;
  discountPercent?: number;
  ctaLabel: string;
  ctaAction: "apply" | "navigate" | "info";
  ctaTarget?: string;
}

const OFFERS: TickerOffer[] = [
  {
    id: "o1",
    title: "20% Off First Trip",
    description: "Use code for your first trip plan",
    type: "discount",
    icon: Gift,
    couponCode: "TRAVELLO20",
    discountPercent: 20,
    ctaLabel: "Apply Offer",
    ctaAction: "apply",
  },
  {
    id: "o2",
    title: "40% Off Hotels This Weekend",
    description: "Flash sale on top-rated hotels",
    type: "deal",
    icon: Hotel,
    couponCode: "HOTEL40",
    discountPercent: 40,
    ctaLabel: "Claim Now",
    ctaAction: "apply",
  },
  {
    id: "o3",
    title: "Direct Flights to Bali",
    description: "New routes from major cities available now",
    type: "alert",
    icon: Plane,
    ctaLabel: "Plan Trip",
    ctaAction: "navigate",
    ctaTarget: "/plan-trip",
  },
  {
    id: "o4",
    title: "Free PDF Downloads",
    description: "Download itinerary PDFs free this month",
    type: "feature",
    icon: Sparkles,
    couponCode: "FREEPDF",
    ctaLabel: "Use Code",
    ctaAction: "apply",
  },
  {
    id: "o5",
    title: "Hidden Gems of Vietnam",
    description: "Trending destination this season",
    type: "alert",
    icon: MapPin,
    ctaLabel: "Explore",
    ctaAction: "navigate",
    ctaTarget: "/plan-trip",
  },
  {
    id: "o6",
    title: "₹500 Off Budget Trips",
    description: "Save on trips under ₹10,000",
    type: "discount",
    icon: Tag,
    couponCode: "SAVE500",
    discountPercent: 5,
    ctaLabel: "Apply Offer",
    ctaAction: "apply",
  },
];

// Global coupon store
const APPLIED_COUPONS_KEY = "travello_applied_coupons";
const SAVED_OFFERS_KEY = "travello_saved_offers";

export const getAppliedCoupons = (): { code: string; discount: number }[] => {
  try {
    return JSON.parse(localStorage.getItem(APPLIED_COUPONS_KEY) || "[]");
  } catch { return []; }
};

export const getSavedOffers = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_OFFERS_KEY) || "[]");
  } catch { return []; }
};

const NotificationTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Load already-applied coupons on mount
  useEffect(() => {
    const coupons = getAppliedCoupons();
    const applied = new Set<string>();
    OFFERS.forEach((o) => {
      if (o.couponCode && coupons.some((c) => c.code === o.couponCode)) {
        applied.add(o.id);
      }
    });
    setAppliedIds(applied);
  }, []);

  const goTo = useCallback((index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 250);
  }, []);

  const next = useCallback(() => goTo((currentIndex + 1) % OFFERS.length), [currentIndex, goTo]);
  const prev = useCallback(() => goTo((currentIndex - 1 + OFFERS.length) % OFFERS.length), [currentIndex, goTo]);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, dismissed]);

  useEffect(() => {
    if (!dismissed) return;
    const timeout = setTimeout(() => {
      setDismissed(false);
      setIsVisible(true);
    }, 60000);
    return () => clearTimeout(timeout);
  }, [dismissed]);

  const handleApplyCoupon = (offer: TickerOffer) => {
    if (!offer.couponCode) return;
    const coupons = getAppliedCoupons();
    if (coupons.some((c) => c.code === offer.couponCode)) {
      toast.info("This offer is already applied!");
      return;
    }
    coupons.push({ code: offer.couponCode, discount: offer.discountPercent || 0 });
    localStorage.setItem(APPLIED_COUPONS_KEY, JSON.stringify(coupons));
    setAppliedIds((prev) => new Set(prev).add(offer.id));
    toast.success(`Offer applied successfully 🎉`, {
      description: `Code ${offer.couponCode} — ${offer.discountPercent}% discount added to your next trip.`,
    });
  };

  const handleSaveOffer = (offer: TickerOffer) => {
    const saved = getSavedOffers();
    if (saved.includes(offer.id)) {
      toast.info("Offer already saved!");
      return;
    }
    saved.push(offer.id);
    localStorage.setItem(SAVED_OFFERS_KEY, JSON.stringify(saved));
    toast.success("Offer saved for later! 🔖");
  };

  const handleCopyCode = (offer: TickerOffer) => {
    if (!offer.couponCode) return;
    navigator.clipboard.writeText(offer.couponCode);
    setCopiedId(offer.id);
    toast.success(`Code "${offer.couponCode}" copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCTA = (offer: TickerOffer) => {
    if (offer.ctaAction === "apply") {
      handleApplyCoupon(offer);
    } else if (offer.ctaAction === "navigate" && offer.ctaTarget) {
      navigate(offer.ctaTarget);
    }
  };

  if (dismissed || !isVisible) return null;

  const current = OFFERS[currentIndex];
  const Icon = current.icon;
  const isApplied = appliedIds.has(current.id);

  const bgMap: Record<string, string> = {
    discount: "from-primary to-primary/80",
    deal: "from-emerald-600 to-emerald-500",
    alert: "from-blue-600 to-blue-500",
    feature: "from-violet-600 to-violet-500",
  };

  return (
    <div
      className={cn(
        "fixed top-16 left-0 right-0 z-40 bg-gradient-to-r text-white transition-all duration-300",
        bgMap[current.type],
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-2">
        {/* Left: Nav arrow + Icon + Content */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button onClick={prev} className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors hidden sm:block">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div
            className={cn(
              "flex items-center gap-2 min-w-0 transition-all duration-250",
              isAnimating ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
            )}
          >
            <span className="text-sm font-semibold whitespace-nowrap">{current.title}</span>
            <span className="text-xs text-white/70 truncate hidden lg:inline">— {current.description}</span>
          </div>
        </div>

        {/* Center: Coupon badge + CTA */}
        <div className={cn(
          "flex items-center gap-2 shrink-0 transition-all duration-250",
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}>
          {current.couponCode && (
            <button
              onClick={() => handleCopyCode(current)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 border border-white/25 hover:bg-white/25 transition-colors text-xs font-mono font-bold tracking-wide"
              title="Click to copy code"
            >
              {copiedId === current.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {current.couponCode}
            </button>
          )}
          <Button
            size="sm"
            onClick={() => handleCTA(current)}
            disabled={isApplied}
            className={cn(
              "h-7 px-3 text-xs font-semibold rounded-lg transition-all",
              isApplied
                ? "bg-white/20 text-white/60 cursor-not-allowed"
                : "bg-white text-foreground hover:bg-white/90 shadow-sm"
            )}
          >
            {isApplied ? "✓ Applied" : current.ctaLabel}
          </Button>
          <button
            onClick={() => handleSaveOffer(current)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors hidden sm:block"
            title="Save offer for later"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Dots + Nav arrow + Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            {OFFERS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === currentIndex ? "bg-white w-3" : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
          <button onClick={next} className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors hidden sm:block">
            <ChevronRight className="w-4 h-4" />
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => setDismissed(true), 300);
            }}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTicker;
