import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Users } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful coastal Mediterranean town at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-sm border border-background/20 mb-8 animate-fade-up">
            <Star className="w-4 h-4 text-travel-gold fill-travel-gold" />
            <span className="text-background/90 text-sm font-medium">
              AI-Powered Trip Planning
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Plan Your Perfect Trip{" "}
            <span className="text-travel-coral">Effortlessly</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-background/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Get personalized recommendations for tourist spots, hotels, and transportation based on your destination, duration, and budget.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Start Planning
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                Log in
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin className="w-4 h-4 text-travel-coral" />
                <span className="text-2xl font-bold text-background">500+</span>
              </div>
              <span className="text-background/70 text-sm">Destinations</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-travel-coral" />
                <span className="text-2xl font-bold text-background">10K+</span>
              </div>
              <span className="text-background/70 text-sm">Travelers</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-travel-coral fill-travel-coral" />
                <span className="text-2xl font-bold text-background">4.9</span>
              </div>
              <span className="text-background/70 text-sm">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-background/40 flex items-start justify-center p-2">
          <div className="w-1.5 h-2.5 rounded-full bg-background/60 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
