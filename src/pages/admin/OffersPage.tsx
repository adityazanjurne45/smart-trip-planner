import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tag, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Offer { id: string; code: string; description: string; discount: number; expiresAt: string; }
const KEY = "travello_admin_offers";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [disc, setDisc] = useState(10);
  const [exp, setExp] = useState("");

  useEffect(() => {
    try { setOffers(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {}
  }, []);

  const save = (n: Offer[]) => { setOffers(n); localStorage.setItem(KEY, JSON.stringify(n)); };

  const add = () => {
    if (!code.trim() || !desc.trim() || !exp) { toast.error("Fill all fields"); return; }
    const newOffer: Offer = { id: crypto.randomUUID(), code: code.toUpperCase().trim(), description: desc.trim(), discount: disc, expiresAt: exp };
    save([newOffer, ...offers]);
    setCode(""); setDesc(""); setDisc(10); setExp("");
    toast.success("Offer created");
  };

  const remove = (id: string) => { save(offers.filter(o => o.id !== id)); toast.success("Offer removed"); };

  const isExpired = (e: string) => new Date(e) < new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Offers & Coupons</h1>
        <p className="text-sm text-muted-foreground">Create and manage promotional codes</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" />New Offer</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="space-y-1"><Label>Code</Label><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="SUMMER25" /></div>
          <div className="space-y-1 md:col-span-2"><Label>Description</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="25% off summer trips" /></div>
          <div className="space-y-1"><Label>Discount %</Label><Input type="number" min="1" max="100" value={disc} onChange={(e) => setDisc(+e.target.value)} /></div>
          <div className="space-y-1"><Label>Expires</Label><Input type="date" value={exp} onChange={(e) => setExp(e.target.value)} /></div>
          <Button onClick={add} className="md:col-span-5 gap-2"><Plus className="w-4 h-4" />Create Offer</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-8">No offers yet.</p>}
        {offers.map(o => (
          <Card key={o.id} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-primary" />
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="font-mono text-base">{o.code}</Badge>
                <Button size="sm" variant="ghost" onClick={() => remove(o.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
              <p className="text-sm">{o.description}</p>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-2xl font-bold text-primary">{o.discount}% OFF</span>
                <Badge variant={isExpired(o.expiresAt) ? "destructive" : "secondary"}>
                  {isExpired(o.expiresAt) ? "Expired" : `Until ${new Date(o.expiresAt).toLocaleDateString()}`}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
