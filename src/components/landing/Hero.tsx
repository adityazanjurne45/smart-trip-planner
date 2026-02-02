import { Link } from "react-router-dom";
import { Star, MapPin, Users, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-travel.jpg";

const Hero = () => {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image with Premium Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful coastal Mediterranean town at sunset"
          className="w-full h-full object-cover"
        />
        {/* Multi-layer gradient for depth and text clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/5" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-soft mb-8 animate-fade-up"
          >
            <Star className="w-4 h-4 text-travel-gold fill-travel-gold" />
            <span className="text-foreground text-sm font-medium">
              Trusted by 10,000+ travelers worldwide
            </span>
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-card shadow-sm" 
                />
              ))}
            </div>
          </div>

          {/* Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.1] animate-fade-up" 
            style={{ animationDelay: "0.1s" }}
          >
            Plan Smarter.
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-travel-coral bg-clip-text text-transparent">
              Travel Better.
            </span>
          </h1>

          {/* Subheadline with improved contrast */}
          <p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up" 
            style={{ animationDelay: "0.2s" }}
          >
            AI-powered trip planning that's{" "}
            <span className="text-primary font-semibold">budget-friendly</span>,{" "}
            <span className="text-accent font-semibold">traffic-aware</span>, and{" "}
            <span className="text-travel-forest font-semibold">personalized</span> just for you.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" 
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/auth?mode=signup">
              <Button 
                variant="travel" 
                size="xl" 
                className="group shadow-hero hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Planning Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="xl" 
                className="bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div 
            className="flex flex-wrap items-center justify-center gap-3 mb-16 animate-fade-up" 
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { label: "AI-Powered", color: "bg-primary/10 text-primary" },
              { label: "Real-time Traffic", color: "bg-accent/10 text-accent" },
              { label: "Budget Optimized", color: "bg-travel-forest/10 text-travel-forest" },
              { label: "Hotel & Transport", color: "bg-travel-gold/10 text-travel-gold" },
            ].map((pill) => (
              <span 
                key={pill.label}
                className={`px-4 py-2 rounded-full text-sm font-medium ${pill.color} border border-current/10`}
              >
                {pill.label}
              </span>
            ))}
          </div>

          {/* Stats Cards */}
          <div 
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-up" 
            style={{ animationDelay: "0.5s" }}
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-soft hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-2xl font-bold text-foreground">500+</span>
              </div>
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Destinations</span>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-soft hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">10K+</span>
              </div>
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Travelers</span>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-soft hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-travel-gold fill-travel-gold" />
                <span className="text-2xl font-bold text-foreground">4.9</span>
              </div>
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToFeatures}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group z-20"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Explore Features</span>
        <div className="w-10 h-14 rounded-full border-2 border-current/50 flex items-start justify-center p-2 group-hover:border-primary transition-colors">
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
