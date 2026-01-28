import { Link } from "react-router-dom";
import { Star, MapPin, Users, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";
import HeroSearch from "./HeroSearch";

const Hero = () => {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Cinematic Background with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-foreground/20" />
        <img
          src={heroImage}
          alt="Beautiful coastal Mediterranean town at sunset"
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
        />
        {/* Gradient Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/40 to-foreground/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/10" />
        
        {/* Ambient Light Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/15 backdrop-blur-md border border-primary-foreground/20 mb-8 animate-fade-up">
            <Star className="w-4 h-4 text-travel-gold fill-travel-gold" />
            <span className="text-primary-foreground text-sm font-medium">
              Trusted by 10,000+ travelers worldwide
            </span>
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent border border-primary-foreground/20" />
              ))}
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-6 leading-[1.1] animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Plan Smarter.
            <br />
            <span className="bg-gradient-to-r from-travel-gold via-accent to-travel-coral bg-clip-text text-transparent">
              Travel Better.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            AI-powered trip planning that's{" "}
            <span className="text-travel-gold font-medium">budget-friendly</span>,{" "}
            <span className="text-accent font-medium">traffic-aware</span>, and{" "}
            <span className="text-travel-forest font-medium">personalized</span> just for you.
          </p>

          {/* Floating Search Bar */}
          <HeroSearch />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-12 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin className="w-4 h-4 text-travel-coral" />
                <span className="text-2xl font-bold text-primary-foreground">500+</span>
              </div>
              <span className="text-primary-foreground/60 text-xs uppercase tracking-wider">Destinations</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-travel-coral" />
                <span className="text-2xl font-bold text-primary-foreground">10K+</span>
              </div>
              <span className="text-primary-foreground/60 text-xs uppercase tracking-wider">Travelers</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-travel-coral fill-travel-coral" />
                <span className="text-2xl font-bold text-primary-foreground">4.9</span>
              </div>
              <span className="text-primary-foreground/60 text-xs uppercase tracking-wider">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToFeatures}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer group z-20"
      >
        <span className="text-xs uppercase tracking-widest">Explore Features</span>
        <div className="w-8 h-12 rounded-full border-2 border-current flex items-start justify-center p-2 group-hover:border-primary-foreground transition-colors">
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
