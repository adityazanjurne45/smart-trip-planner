import { MapPin, Building2, Car, Brain, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Tourist Spots",
    description: "Discover nearby attractions and hidden gems at your destination, optimized for your trip duration.",
    color: "bg-travel-coral/10 text-travel-coral",
  },
  {
    icon: Building2,
    title: "Hotel Recommendations",
    description: "Find budget-friendly accommodations near tourist spots with transparent pricing.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Car,
    title: "Smart Transport",
    description: "Get vehicle suggestions based on distance, traffic conditions, and cost efficiency.",
    color: "bg-travel-forest/10 text-travel-forest",
  },
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Our intelligent system analyzes your preferences to deliver personalized recommendations.",
    color: "bg-travel-coral/10 text-travel-coral",
  },
  {
    icon: Shield,
    title: "Secure Planning",
    description: "Your travel data is protected with enterprise-grade security and authentication.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Get a complete trip plan in seconds instead of hours of research.",
    color: "bg-travel-forest/10 text-travel-forest",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-wider mb-2 block">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for the Perfect Trip
          </h2>
          <p className="text-muted-foreground text-lg">
            From destination discovery to transportation, we've got every aspect of your journey covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="travel-card p-6 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
