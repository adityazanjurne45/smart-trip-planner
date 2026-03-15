import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Star, Users, Zap, ArrowRight, Shield, CheckCircle, ArrowUpRight } from "lucide-react";

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
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-travel-forest">
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

      {/* Glow Effects - reduced for cleaner look */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-travel-gold/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            {/* Left Column - Content */}
            <div className="text-left lg:pt-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-5 animate-fade-up">
                <Lock className="w-4 h-4" />
                Secure & Personalized
              </div>

              {/* Headline */}
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5 leading-tight animate-fade-up" 
                style={{ animationDelay: "0.1s" }}
              >
                Unlock Your
                <br />
                <span className="text-travel-gold">Personalized Experience</span>
              </h2>

              {/* Description */}
              <p 
                className="text-base md:text-lg text-primary-foreground/80 mb-6 leading-relaxed animate-fade-up" 
                style={{ animationDelay: "0.2s" }}
              >
                Create a free account to save trips, get AI-powered recommendations tailored to your preferences, and access exclusive features.
              </p>

              {/* Benefits List */}
              <ul className="space-y-2.5 mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-primary-foreground/90 text-sm md:text-base">
                    <CheckCircle className="w-5 h-5 text-travel-gold flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Section - Clear Hierarchy */}
              <div 
                className="space-y-4 animate-fade-up" 
                style={{ animationDelay: "0.4s" }}
              >
                {/* Primary CTA */}
                <Link to="/auth?mode=signup">
                  <Button
                    size="lg"
                    className="bg-primary-foreground text-primary font-semibold rounded-xl hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                  >
                    Create Free Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                {/* Secondary CTA - Clear Login Link */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm text-primary-foreground/60">Already have an account?</span>
                  <Link 
                    to="/auth" 
                    className="text-sm font-medium text-primary-foreground underline-offset-4 hover:underline transition-colors inline-flex items-center gap-1 hover:text-travel-gold"
                  >
                    Log in
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Trust Text */}
              <p 
                className="mt-5 text-xs md:text-sm text-primary-foreground/50 flex items-center gap-2 animate-fade-up" 
                style={{ animationDelay: "0.5s" }}
              >
                <Shield className="w-4 h-4" />
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>

            {/* Right Column - Stats Card - Cleaner Design */}
            <div 
              className="bg-primary-foreground/8 backdrop-blur-sm rounded-2xl p-6 md:p-7 border border-primary-foreground/15 shadow-xl animate-fade-up lg:mt-4" 
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-primary-foreground mb-6 text-center">
                Join Our Community
              </h3>
              
              <div className="space-y-3">
                {stats.map((stat) => (
                  <div 
                    key={stat.label} 
                    className="flex items-center gap-4 p-3 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/8 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-travel-gold/20 flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-5 h-5 text-travel-gold" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-bold text-primary-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm text-primary-foreground/60">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial - Smaller */}
              <div className="mt-5 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10">
                <div className="flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 text-travel-gold fill-travel-gold" />
                  ))}
                </div>
                <p className="text-primary-foreground/75 text-xs md:text-sm italic mb-2 leading-relaxed">
                  "Travello made planning our family vacation so easy. The AI recommendations were spot on!"
                </p>
                <p className="text-primary-foreground/50 text-xs font-medium">
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
