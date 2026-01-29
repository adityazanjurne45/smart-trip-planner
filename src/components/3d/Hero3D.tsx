import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Scene3D from './Scene3D';
import TravelWorld from './TravelWorld';
import CameraController from './CameraController';
import { FloatingCard, Vehicle3D, GlowingButton3D } from './FloatingUI';
import { Float, Html } from '@react-three/drei';
import { MapPin, Calendar, Wallet } from 'lucide-react';

// 3D Search input panel
const SearchPanel3D = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    days: '',
    budget: ''
  });
  
  const handlePlanTrip = () => {
    const params = new URLSearchParams();
    if (formData.from) params.set('from', formData.from);
    if (formData.to) params.set('to', formData.to);
    if (formData.days) params.set('days', formData.days);
    if (formData.budget) params.set('budget', formData.budget);
    navigate(`/dashboard?${params.toString()}`);
  };

  return (
    <group position={[0, 0.5, 4]}>
      {/* Main search card */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
        <Html
          transform
          occlude={false}
          position={[0, 0, 0]}
          style={{
            width: '600px',
            pointerEvents: 'auto',
          }}
          center
        >
          <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-border/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-all group-focus-within:text-accent" />
                <input
                  type="text"
                  placeholder="From (City)"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-card/80 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent transition-all group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="To (Destination)"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-card/80 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-travel-forest transition-all group-focus-within:text-primary" />
                <input
                  type="number"
                  placeholder="Days"
                  min="1"
                  max="30"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-card/80 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-travel-forest/50 focus:border-travel-forest transition-all"
                />
              </div>
              <div className="relative group">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-travel-gold transition-all group-focus-within:text-primary" />
                <input
                  type="number"
                  placeholder="Budget (₹)"
                  min="0"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-card/80 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-travel-gold/50 focus:border-travel-gold transition-all"
                />
              </div>
            </div>
            
            <button 
              onClick={handlePlanTrip}
              className="w-full py-4 bg-gradient-to-r from-accent to-travel-coral text-accent-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              ✨ Plan My Trip
            </button>
          </div>
        </Html>
      </Float>
    </group>
  );
};

// Floating headline text
const FloatingHeadline = () => {
  return (
    <group position={[0, 4, 0]}>
      <Html
        transform
        occlude={false}
        position={[0, 0, 0]}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4 drop-shadow-2xl">
            Plan Smarter.
            <br />
            <span className="bg-gradient-to-r from-travel-gold via-accent to-travel-coral bg-clip-text text-transparent">
              Travel Better.
            </span>
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto drop-shadow-lg">
            AI-powered trip planning that's budget-friendly, traffic-aware, and personalized just for you.
          </p>
        </div>
      </Html>
    </group>
  );
};

// Main Hero3D component
const Hero3D = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Scene3D 
          cameraPosition={[0, 3, 12]}
          enableEnvironment={true}
        >
          <CameraController 
            targetPosition={[0, 3, 12]} 
            targetLookAt={[0, 0, 0]}
            autoRotate={true}
          />
          
          <TravelWorld />
          
          {/* Animated vehicle on road */}
          <Vehicle3D type="car" animate />
          
          {/* Floating headline */}
          <FloatingHeadline />
          
          {/* Search panel */}
          <SearchPanel3D />
        </Scene3D>
      </div>
      
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground/50 pointer-events-none" />
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/70 animate-bounce z-10">
        <span className="text-sm uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-current rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero3D;
