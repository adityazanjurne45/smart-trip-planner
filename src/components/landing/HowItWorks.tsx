import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, MapPinned, Sparkles, Plane } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up in seconds to access all trip planning features.",
  },
  {
    icon: MapPinned,
    step: "02",
    title: "Enter Trip Details",
    description: "Tell us your origin, destination, duration, and budget.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get AI Recommendations",
    description: "Receive personalized suggestions for places, hotels, and transport.",
  },
  {
    icon: Plane,
    step: "04",
    title: "Start Your Journey",
    description: "Use your custom itinerary and enjoy your trip!",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-wider mb-2 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Plan Your Trip in 4 Simple Steps
          </h2>
          <p className="text-muted-foreground text-lg">
            Our streamlined process makes trip planning quick and effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative text-center">
                {/* Step Number */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto relative z-10">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center z-20">
                    {step.step}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/auth?mode=signup">
            <Button variant="travel" size="xl">
              Start Planning Now
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
