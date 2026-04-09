import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useWishlist } from "@/contexts/WishlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, MapPin, Building2, UtensilsCrossed, Car, Loader2 } from "lucide-react";

const typeIcons = { hotel: Building2, place: MapPin, food: UtensilsCrossed, transport: Car };
const typeColors = { hotel: "bg-primary/10 text-primary", place: "bg-travel-coral/10 text-travel-coral", food: "bg-amber-100 text-amber-700", transport: "bg-blue-100 text-blue-700" };

const Wishlist = () => {
  const { items, removeItem, clearAll } = useWishlist();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/auth");
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
                <p className="text-muted-foreground">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            {items.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive">
                Clear All
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <Card className="border-border shadow-soft">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-4">Start exploring trips and save your favorite hotels, places, and foods!</p>
                <Button variant="travel" onClick={() => navigate("/plan-trip")}>Plan a Trip</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {items.map(item => {
                const Icon = typeIcons[item.type];
                return (
                  <Card key={item.id} className="border-border shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeColors[item.type]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <Badge variant="secondary" className="capitalize text-xs">{item.type}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </p>
                      {item.price && <p className="text-primary font-medium text-sm">{item.price}</p>}
                      {item.rating && <p className="text-xs text-muted-foreground mt-1">⭐ {item.rating}</p>}
                      <p className="text-xs text-muted-foreground mt-2">
                        Saved {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
