import { MapPin, Building2, Car, Brain, Shield, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description: "Our intelligent system analyzes your preferences, travel history, and real-time data to deliver highly personalized recommendations.",
    color: "bg-primary/10 text-primary border-primary/20",
    iconBg: "bg-primary/15",
  },
  {
    icon: MapPin,
    title: "Smart Destinations",
    description: "Discover nearby attractions and hidden gems at your destination, optimized for your trip duration and interests.",
    color: "bg-accent/10 text-accent border-accent/20",
    iconBg: "bg-accent/15",
  },
  {
    icon: Building2,
    title: "Hotel Recommendations",
    description: "Find budget-friendly accommodations near tourist spots with transparent pricing and verified reviews.",
    color: "bg-travel-forest/10 text-travel-forest border-travel-forest/20",
    iconBg: "bg-travel-forest/15",
  },
  {
    icon: Car,
    title: "Smart Transport",
    description: "Get vehicle suggestions based on distance, traffic conditions, and cost efficiency for seamless travel.",
    color: "bg-travel-gold/10 text-travel-gold border-travel-gold/20",
    iconBg: "bg-travel-gold/15",
  },
  {
    icon: Shield,
    title: "Secure Planning",
    description: "Your travel data is protected with enterprise-grade security and authentication measures.",
    color: "bg-primary/10 text-primary border-primary/20",
    iconBg: "bg-primary/15",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Get a complete trip plan in seconds instead of hours of research. More time for adventure!",
    color: "bg-accent/10 text-accent border-accent/20",
    iconBg: "bg-accent/15",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need for the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Perfect Trip
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From destination discovery to transportation, we've got every aspect of your journey covered with AI-powered precision.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 border border-border shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color.split(' ')[1]}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
