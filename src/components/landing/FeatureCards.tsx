import { Brain, Map, Wallet, Hotel, Car, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Smart suggestions based on your preferences, budget, and travel history.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    delay: 0,
  },
  {
    icon: Map,
    title: "Smart Maps",
    description: "Interactive routes with real-time traffic and animated navigation.",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    delay: 0.1,
  },
  {
    icon: Wallet,
    title: "Budget Optimization",
    description: "Get the most out of your budget with smart allocation tips.",
    gradient: "from-travel-gold/20 to-travel-gold/5",
    iconColor: "text-travel-gold",
    delay: 0.2,
  },
  {
    icon: Hotel,
    title: "Hotel Suggestions",
    description: "Curated stays near attractions with transparent pricing.",
    gradient: "from-travel-forest/20 to-travel-forest/5",
    iconColor: "text-travel-forest",
    delay: 0.3,
  },
  {
    icon: Car,
    title: "Vehicle Options",
    description: "Smart transport recommendations based on distance and conditions.",
    gradient: "from-travel-coral/20 to-travel-coral/5",
    iconColor: "text-travel-coral",
    delay: 0.4,
  },
  {
    icon: Shield,
    title: "Secure Planning",
    description: "Your travel data is protected with enterprise-grade security.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    delay: 0.5,
  },
];

const FeatureCards = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            Powered by AI
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need for the{" "}
            <span className="text-primary">Perfect Trip</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From destination discovery to transportation, we've got every aspect of your journey covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative animate-fade-up"
              style={{ animationDelay: `${feature.delay}s` }}
            >
              {/* Glassmorphism Card */}
              <div className="relative h-full p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1">
                {/* Gradient Background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Glow */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
