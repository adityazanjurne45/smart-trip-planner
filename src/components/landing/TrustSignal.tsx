import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Star, Users, Zap, ArrowRight, Shield, CheckCircle } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Travelers" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: Zap, value: "30s", label: "Avg. Plan Time" },
];

const benefits = [
  "AI-powered personalized recommendations",
  "Real-time traffic & weather updates",
  "Budget optimization & tracking",
  "Secure data & privacy protection",
];

const TrustSignal = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-travel-forest">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} 
        />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-travel-gold/15 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-6 animate-fade-up">
                <Lock className="w-4 h-4" />
                Secure & Personalized
              </div>

              {/* Headline */}
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-up" 
                style={{ animationDelay: "0.1s" }}
              >
                Unlock Your
                <br />
                <span className="text-travel-gold">Personalized Experience</span>
              </h2>

              {/* Description */}
              <p 
                className="text-lg text-primary-foreground/80 mb-8 leading-relaxed animate-fade-up" 
                style={{ animationDelay: "0.2s" }}
              >
                Create a free account to save trips, get AI-powered recommendations tailored to your preferences, and access exclusive features.
              </p>

              {/* Benefits List */}
              <ul className="space-y-3 mb-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-primary-foreground/90">
                    <CheckCircle className="w-5 h-5 text-travel-gold flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div 
                className="flex flex-col sm:flex-row gap-4 animate-fade-up" 
                style={{ animationDelay: "0.4s" }}
              >
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
                    variant="outline"
                    className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
                  >
                    Already have an account?
                  </Button>
                </Link>
              </div>

              {/* Trust Text */}
              <p 
                className="mt-6 text-sm text-primary-foreground/60 flex items-center gap-2 animate-fade-up" 
                style={{ animationDelay: "0.5s" }}
              >
                <Shield className="w-4 h-4" />
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>

            {/* Right Column - Stats Card */}
            <div 
              className="bg-primary-foreground/10 backdrop-blur-md rounded-3xl p-8 border border-primary-foreground/20 shadow-2xl animate-fade-up" 
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-2xl font-bold text-primary-foreground mb-8 text-center">
                Join Our Community
              </h3>
              
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label} 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-travel-gold/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-travel-gold" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-foreground">
                        {stat.value}
                      </div>
                      <div className="text-sm text-primary-foreground/70">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="mt-8 p-4 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-travel-gold fill-travel-gold" />
                  ))}
                </div>
                <p className="text-primary-foreground/80 text-sm italic mb-3">
                  "Travello made planning our family vacation so easy. The AI recommendations were spot on!"
                </p>
                <p className="text-primary-foreground/60 text-xs font-medium">
                  — Sarah M., Verified Traveler
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignal;
