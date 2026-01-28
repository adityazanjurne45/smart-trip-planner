import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Calendar, Wallet, Sparkles, ArrowRight } from "lucide-react";
const HeroSearch = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const handlePlanTrip = () => {
    navigate("/auth?mode=signup");
  };
  return <div className="w-full max-w-4xl mx-auto animate-fade-up" style={{
    animationDelay: "0.3s"
  }}>
      {/* Floating Search Card */}
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-border/50 shadow-hero bg-primary-foreground text-destructive-foreground">
          {/* Quick Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-powered planning in seconds
            </span>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* From */}
            <div className="relative group">
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                From
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'from' ? 'scale-[1.02]' : ''}`}>
                <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'from' ? 'text-primary' : 'text-muted-foreground'}`} />
                <Input placeholder="Your city" value={from} onChange={e => setFrom(e.target.value)} onFocus={() => setFocusedField('from')} onBlur={() => setFocusedField(null)} className="pl-12 h-14 rounded-xl bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300" />
                {focusedField === 'from' && <div className="absolute inset-0 -z-10 bg-primary/5 rounded-xl blur-sm" />}
              </div>
            </div>

            {/* To */}
            <div className="relative group">
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                To
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'to' ? 'scale-[1.02]' : ''}`}>
                <Navigation className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'to' ? 'text-accent' : 'text-muted-foreground'}`} />
                <Input placeholder="Destination" value={to} onChange={e => setTo(e.target.value)} onFocus={() => setFocusedField('to')} onBlur={() => setFocusedField(null)} className="pl-12 h-14 rounded-xl bg-background/50 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300" />
                {focusedField === 'to' && <div className="absolute inset-0 -z-10 bg-accent/5 rounded-xl blur-sm" />}
              </div>
            </div>

            {/* Days */}
            <div className="relative group">
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Duration
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'days' ? 'scale-[1.02]' : ''}`}>
                <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'days' ? 'text-travel-forest' : 'text-muted-foreground'}`} />
                <Input type="number" placeholder="Days" min="1" max="30" value={days} onChange={e => setDays(e.target.value)} onFocus={() => setFocusedField('days')} onBlur={() => setFocusedField(null)} className="pl-12 h-14 rounded-xl bg-background/50 border-border/50 focus:border-travel-forest focus:ring-2 focus:ring-travel-forest/20 transition-all duration-300" />
              </div>
            </div>

            {/* Budget */}
            <div className="relative group">
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Budget
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'budget' ? 'scale-[1.02]' : ''}`}>
                <Wallet className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'budget' ? 'text-travel-gold' : 'text-muted-foreground'}`} />
                <Input type="number" placeholder="USD" min="100" value={budget} onChange={e => setBudget(e.target.value)} onFocus={() => setFocusedField('budget')} onBlur={() => setFocusedField(null)} className="pl-12 h-14 rounded-xl bg-background/50 border-border/50 focus:border-travel-gold focus:ring-2 focus:ring-travel-gold/20 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button onClick={handlePlanTrip} className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-hero hover:shadow-[0_25px_70px_-15px_hsl(var(--primary)/0.4)] hover:scale-[1.02] transition-all duration-300 group">
            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Plan My Trip
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>;
};
export default HeroSearch;