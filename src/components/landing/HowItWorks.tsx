import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, MapPinned, Sparkles, Plane, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up in seconds to access all trip planning features and personalized recommendations.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  {
    icon: MapPinned,
    step: "02",
    title: "Enter Trip Details",
    description: "Tell us your origin, destination, duration, and budget preferences.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get AI Recommendations",
    description: "Receive personalized suggestions for places, hotels, and transport.",
    color: "text-travel-forest",
    bgColor: "bg-travel-forest/10",
    borderColor: "border-travel-forest/30",
  },
  {
    icon: Plane,
    step: "04",
    title: "Start Your Journey",
    description: "Use your custom itinerary and enjoy a perfectly planned trip!",
    color: "text-travel-gold",
    bgColor: "bg-travel-gold/10",
    borderColor: "border-travel-gold/30",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Plan Your Trip in{" "}
            <span className="bg-gradient-to-r from-accent to-travel-coral bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our streamlined process makes trip planning quick, effortless, and enjoyable.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={step.step} 
              className="relative group animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-1/2 w-full h-0.5 bg-gradient-to-r from-border via-border/50 to-transparent z-0" />
              )}
              
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full">
                {/* Step Number Badge */}
                <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-full ${step.bgColor} ${step.borderColor} border-2 flex items-center justify-center shadow-sm`}>
                  <span className={`text-sm font-bold ${step.color}`}>{step.step}</span>
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/auth?mode=signup">
            <Button 
              variant="travel" 
              size="xl"
              className="group shadow-hero hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Planning Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
