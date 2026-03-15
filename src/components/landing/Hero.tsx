import { Link } from "react-router-dom";
import { ChevronDown, Sparkles, ArrowRight, Zap, Shield, Brain, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-travel.jpg";

const Hero = () => {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image with Strong Dark Overlay for Text Clarity */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful coastal Mediterranean town at sunset"
          className="w-full h-full object-cover"
        />
        {/* Strong multi-layer gradient for maximum text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
        <div className="absolute inset-0 bg-foreground/10" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Honest Badge */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-soft mb-8 animate-fade-up"
          >
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-foreground text-sm font-medium">
              Smart AI-powered trip planning made simple
            </span>
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
            className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up" 
            style={{ animationDelay: "0.2s" }}
          >
            AI-powered trip planning that's{" "}
            <span className="text-primary font-semibold">budget-friendly</span>,{" "}
            <span className="text-accent font-semibold">traffic-aware</span>, and{" "}
            <span className="text-travel-forest font-semibold">personalized</span> just for you.
          </p>

          {/* Auth Section - Clear Hierarchy */}
          <div 
            className="animate-fade-up mb-12" 
            style={{ animationDelay: "0.3s" }}
          >
            {/* Primary CTA for New Users */}
            <div className="mb-5">
              <Link to="/auth?mode=signup">
                <Button 
                  variant="travel" 
                  size="xl" 
                  className="group shadow-hero hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-3">
                Get personalized AI recommendations, save trips & more
              </p>
            </div>
            
            {/* Secondary CTA for Existing Users - Clear and distinct */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-sm text-muted-foreground">Already have an account?</span>
              <Link to="/auth" className="text-sm font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors">
                Log in
              </Link>
            </div>
          </div>

          {/* Feature Pills */}
          <div 
            className="flex flex-wrap items-center justify-center gap-3 mb-16 animate-fade-up" 
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { label: "AI-Powered", icon: Brain, color: "bg-primary/10 text-primary border-primary/20" },
              { label: "Real-time Data", icon: Zap, color: "bg-accent/10 text-accent border-accent/20" },
              { label: "Budget Optimized", icon: Shield, color: "bg-travel-forest/10 text-travel-forest border-travel-forest/20" },
            ].map((pill) => (
              <span 
                key={pill.label}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${pill.color} border`}
              >
                <pill.icon className="w-4 h-4" />
                {pill.label}
              </span>
            ))}
          </div>

          {/* Value Proposition Cards */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-up" 
            style={{ animationDelay: "0.5s" }}
          >
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-soft hover:shadow-medium transition-shadow text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Smart Planning</h3>
              <p className="text-sm text-muted-foreground">AI analyzes your preferences to create personalized itineraries</p>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-soft hover:shadow-medium transition-shadow text-left">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Instant Results</h3>
              <p className="text-sm text-muted-foreground">Get hotel, transport & attraction recommendations in seconds</p>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-soft hover:shadow-medium transition-shadow text-left">
              <div className="w-10 h-10 rounded-xl bg-travel-forest/10 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-travel-forest" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Budget Friendly</h3>
              <p className="text-sm text-muted-foreground">Plans optimized for your budget without compromising quality</p>
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
