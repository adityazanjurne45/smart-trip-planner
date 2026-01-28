import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Star, Users, Zap, ArrowRight } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Travelers" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: Zap, value: "30s", label: "Avg. Plan Time" },
];

const TrustSignal = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-travel-forest" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-6 animate-fade-up">
            <Lock className="w-4 h-4" />
            Secure & Personalized
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Unlock Your Personalized
            <br />
            <span className="text-travel-gold">Travel Experience</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Create a free account to save trips, get AI-powered recommendations tailored to your preferences, and access exclusive features.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-travel-gold mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-primary-foreground/70 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Link to="/auth?mode=signup">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-primary-foreground text-primary font-semibold rounded-xl hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="xl"
                variant="hero-outline"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Already have an account?
              </Button>
            </Link>
          </div>

          {/* Trust Text */}
          <p className="mt-8 text-sm text-primary-foreground/60 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            🔒 No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSignal;
