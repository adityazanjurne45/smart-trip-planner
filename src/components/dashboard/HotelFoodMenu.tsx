import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Leaf, Utensils } from "lucide-react";
import { getHotelMenu, MENU_CATEGORIES } from "@/lib/demoFoodMenu";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";

interface HotelFoodMenuProps {
  destination: string;
}

const HotelFoodMenu = ({ destination }: HotelFoodMenuProps) => {
  const menu = getHotelMenu(destination);
  const [active, setActive] = useState(MENU_CATEGORIES[0]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Utensils className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Restaurant Menu</h3>
          <p className="text-xs text-muted-foreground">Locally-inspired dishes from our in-house kitchen</p>
        </div>
      </div>

      <Tabs value={active} onValueChange={(v) => setActive(v as typeof active)}>
        <TabsList className="grid grid-cols-5 w-full mb-3">
          {MENU_CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c} className="text-xs">{c}</TabsTrigger>
          ))}
        </TabsList>

        {MENU_CATEGORIES.map((cat) => {
          const items = menu.filter((m) => m.category === cat);
          return (
            <TabsContent key={cat} value={cat} className="mt-0">
              <div className="grid sm:grid-cols-2 gap-3">
                {items.map((item) => (
                  <Card
                    key={item.name}
                    className="group overflow-hidden border-border/60 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 shrink-0 overflow-hidden bg-muted">
                        <div className="w-full h-full group-hover:scale-110 transition-transform duration-500">
                          <PlaceImageGallery
                            query={item.imageQuery}
                            type="tourist_place"
                            aspectRatio={1}
                            showAttribution={false}
                          />
                        </div>
                      </div>
                      <CardContent className="p-3 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                                  item.veg ? "border-green-600" : "border-red-600"
                                }`}
                                title={item.veg ? "Vegetarian" : "Non-Vegetarian"}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    item.veg ? "bg-green-600" : "bg-red-600"
                                  }`}
                                />
                              </span>
                              <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {item.description}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-primary shrink-0">{item.price}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {item.popular && (
                            <Badge className="bg-amber-500/90 text-white text-[10px] gap-0.5 px-1.5 py-0">
                              <Flame className="w-2.5 h-2.5" />
                              Popular
                            </Badge>
                          )}
                          {item.veg && (
                            <Badge variant="outline" className="text-[10px] gap-0.5 px-1.5 py-0 border-green-600/40 text-green-700 dark:text-green-400">
                              <Leaf className="w-2.5 h-2.5" />
                              Veg
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default HotelFoodMenu;
