import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Clock, Users } from 'lucide-react';

const TrustSignal3D = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
            <Shield className="w-5 h-5 text-travel-forest" />
            <span className="text-foreground font-medium">100% Secure</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">AI-Powered Planning</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-foreground font-medium">10K+ Happy Travelers</span>
          </div>
        </div>
        
        {/* Main CTA Card */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-10 rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl">
            {/* Gradient border effect */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary via-accent to-travel-gold opacity-20 blur-sm -z-10" />
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Start Your Journey Today
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Experience{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-travel-coral bg-clip-text text-transparent">
                Intelligent Travel Planning?
              </span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Login to unlock personalized recommendations, save your trips, and access exclusive features designed just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-travel-coral text-accent-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border-2 border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-all duration-300"
              >
                Try Without Account
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • Free forever for basic features
            </p>
          </div>
        </div>
        
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { value: "500+", label: "Destinations" },
            { value: "10K+", label: "Trips Planned" },
            { value: "4.9★", label: "User Rating" },
            { value: "24/7", label: "AI Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignal3D;
