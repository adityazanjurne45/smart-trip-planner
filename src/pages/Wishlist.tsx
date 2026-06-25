import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useWishlist, type WishlistItem } from "@/contexts/WishlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Heart, Trash2, MapPin, Building2, UtensilsCrossed, Plane, Loader2, Star,
  Calendar, Users, Eye, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";

type TabKey = "trips" | "hotels" | "places" | "foods";

const TAB_CONFIG: Record<TabKey, { label: string; icon: any; types: WishlistItem["type"][]; tint: string }> = {
  trips:  { label: "Trips",  icon: Plane,           types: ["transport"], tint: "from-blue-500/20 to-blue-500/5" },
  hotels: { label: "Hotels", icon: Building2,       types: ["hotel"],     tint: "from-primary/20 to-primary/5" },
  places: { label: "Places", icon: MapPin,          types: ["place"],     tint: "from-rose-500/20 to-rose-500/5" },
  foods:  { label: "Foods",  icon: UtensilsCrossed, types: ["food"],      tint: "from-amber-500/20 to-amber-500/5" },
};

const Wishlist = () => {
  const { items, removeItem, clearAll } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("hotels");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/auth");
      setLoading(false);
    });
  }, [navigate]);

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { trips: 0, hotels: 0, places: 0, foods: 0 };
    (Object.keys(TAB_CONFIG) as TabKey[]).forEach(k => {
      c[k] = items.filter(i => TAB_CONFIG[k].types.includes(i.type)).length;
    });
    return c;
  }, [items]);

  const filtered = items.filter(i => TAB_CONFIG[tab].types.includes(i.type));

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  const handlePlanTrip = (item: WishlistItem) => {
    try { localStorage.setItem("travello_prefill_destination", item.location || item.name); } catch {}
    navigate("/plan-trip");
  };

  const handleBookNow = () => navigate("/plan-trip");

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/40 via-background to-primary/5">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
                <p className="text-muted-foreground">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            {items.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive">
                <Trash2 className="w-3 h-3 mr-1" />Clear All
              </Button>
            )}
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="space-y-6">
            <TabsList className="bg-card/80 backdrop-blur p-1 shadow-soft w-full justify-start overflow-x-auto">
              {(Object.keys(TAB_CONFIG) as TabKey[]).map(k => {
                const Icon = TAB_CONFIG[k].icon;
                return (
                  <TabsTrigger key={k} value={k} className="gap-2">
                    <Icon className="w-4 h-4" />
                    {TAB_CONFIG[k].label}
                    <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5">{counts[k]}</Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={tab}>
              {filtered.length === 0 ? (
                <Card className={cn("border-dashed border-2 rounded-3xl overflow-hidden bg-gradient-to-br", TAB_CONFIG[tab].tint)}>
                  <CardContent className="p-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/70 backdrop-blur flex items-center justify-center shadow-md">
                      <Heart className="w-10 h-10 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No saved {TAB_CONFIG[tab].label.toLowerCase()} yet</h3>
                    <p className="text-muted-foreground mb-5 max-w-md mx-auto">
                      Tap the heart icon on any {TAB_CONFIG[tab].label.toLowerCase().slice(0, -1)} while exploring trips to save it here.
                    </p>
                    <Button variant="travel" onClick={() => navigate("/plan-trip")}>
                      <Plane className="w-4 h-4 mr-2" />Explore & Plan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                  {filtered.map(item => {
                    const TabIcon = TAB_CONFIG[tab].icon;
                    return (
                      <Card
                        key={item.id}
                        className="group overflow-hidden rounded-2xl border-border bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-[0_25px_50px_-12px_hsl(var(--primary)/0.25)] hover:-translate-y-1.5 transition-all duration-500"
                      >
                        <div className="relative overflow-hidden h-48">
                          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                            <PlaceImageGallery
                              query={`${item.name} ${item.location}`}
                              type={item.type === "hotel" ? "hotel" : item.type === "transport" ? "transport" : "tourist_place"}
                              aspectRatio={16 / 9}
                              showAttribution={false}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove from wishlist"
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          </button>
                          <Badge className="absolute top-3 left-3 backdrop-blur bg-white/90 text-foreground capitalize gap-1">
                            <TabIcon className="w-3 h-3" />{item.type}
                          </Badge>
                          {item.rating && (
                            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur rounded-lg px-2 py-0.5 text-xs font-bold flex items-center gap-1 shadow">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{item.rating}
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h3 className="font-bold text-base text-foreground line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />{item.location}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                            {item.price && <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-md">{item.price}</span>}
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.addedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />2 travelers</span>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePlanTrip(item)}>
                              <Eye className="w-3 h-3 mr-1" />View
                            </Button>
                            {item.type === "hotel" ? (
                              <Button variant="travel" size="sm" className="flex-1" onClick={handleBookNow}>
                                <BookOpen className="w-3 h-3 mr-1" />Book Now
                              </Button>
                            ) : (
                              <Button variant="travel" size="sm" className="flex-1" onClick={() => handlePlanTrip(item)}>
                                <Plane className="w-3 h-3 mr-1" />Plan Trip
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
