import Scene3D from './Scene3D';
import CameraController from './CameraController';
import FeatureCards3D from './FeatureCards3D';
import { Html } from '@react-three/drei';
import { Brain } from 'lucide-react';

const FeaturesSection3D = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background py-20">
      {/* Section header */}
      <div className="container mx-auto px-4 mb-12 text-center relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Brain className="w-4 h-4" />
          Powered by AI
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Everything You Need for the{" "}
          <span className="text-primary">Perfect Trip</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          From destination discovery to transportation, we've got every aspect of your journey covered.
        </p>
      </div>
      
      {/* 3D Feature Cards */}
      <div className="h-[600px] w-full">
        <Scene3D 
          cameraPosition={[0, 0, 10]}
          enableEnvironment={false}
        >
          <CameraController 
            targetPosition={[0, -1, 10]} 
            targetLookAt={[0, -1, 0]}
            autoRotate={false}
            enableOrbit={true}
          />
          
          {/* Ambient lighting for feature cards */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          
          <FeatureCards3D />
        </Scene3D>
      </div>
    </section>
  );
};

export default FeaturesSection3D;
