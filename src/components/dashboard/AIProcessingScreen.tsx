import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Cloud, 
  Building2, 
  Route, 
  Calendar,
  Sparkles,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TripDetails } from "@/types/trip";

interface AIProcessingScreenProps {
  tripDetails: TripDetails;
  onComplete?: () => void;
}

interface ProcessingStep {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  duration: number; // in ms
}

const PROCESSING_STEPS: ProcessingStep[] = [
  { 
    id: "destinations", 
    label: "Finding best destinations based on your route", 
    icon: MapPin, 
    color: "text-primary",
    duration: 2000
  },
  { 
    id: "weather", 
    label: "Analyzing weather and seasonal conditions", 
    icon: Cloud, 
    color: "text-accent",
    duration: 1800
  },
  { 
    id: "hotels", 
    label: "Selecting budget-friendly hotels", 
    icon: Building2, 
    color: "text-travel-coral",
    duration: 2200
  },
  { 
    id: "routes", 
    label: "Optimizing travel routes and transport", 
    icon: Route, 
    color: "text-travel-forest",
    duration: 2000
  },
  { 
    id: "itinerary", 
    label: "Creating a personalized day-by-day itinerary", 
    icon: Calendar, 
    color: "text-travel-gold",
    duration: 2500
  },
];

const AIProcessingScreen = ({ tripDetails, onComplete }: AIProcessingScreenProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate step progression
    const totalDuration = PROCESSING_STEPS.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const stepTimers: NodeJS.Timeout[] = [];
    
    PROCESSING_STEPS.forEach((step, index) => {
      const timer = setTimeout(() => {
        if (index > 0) {
          setCompletedSteps(prev => [...prev, PROCESSING_STEPS[index - 1].id]);
        }
        setCurrentStepIndex(index);
      }, elapsed);
      
      elapsed += step.duration;
      stepTimers.push(timer);
    });

    // Final completion
    const completeTimer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, PROCESSING_STEPS[PROCESSING_STEPS.length - 1].id]);
      setIsComplete(true);
      onComplete?.();
    }, elapsed);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (totalDuration / 100));
      });
    }, 100);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-2xl w-full text-center">
        {/* AI Icon Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-travel-coral/20 flex items-center justify-center animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/40 animate-float"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${10 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + i * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 animate-fade-up">
          Our AI is Creating Your{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-travel-coral bg-clip-text text-transparent">
            Perfect Trip
          </span>
        </h1>
        
        <p className="text-muted-foreground mb-2 text-lg animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Analyzing your preferences and building a personalized travel plan...
        </p>
        
        <p className="text-sm text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <span className="text-primary font-medium">{tripDetails.boardingPoint}</span>
          {" → "}
          <span className="text-accent font-medium">{tripDetails.destinationPoint}</span>
          {" • "}
          <span>{tripDetails.duration} days</span>
        </p>

        {/* Processing Steps */}
        <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
          {PROCESSING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStepIndex === index && !isCompleted;
            const isPending = index > currentStepIndex;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all duration-500",
                  isCompleted && "bg-travel-forest/10 border border-travel-forest/20",
                  isCurrent && "bg-primary/10 border border-primary/20 shadow-sm",
                  isPending && "opacity-50"
                )}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  transform: isCurrent ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  isCompleted && "bg-travel-forest/20",
                  isCurrent && "bg-primary/20",
                  isPending && "bg-muted"
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-travel-forest" />
                  ) : isCurrent ? (
                    <Loader2 className={cn("w-5 h-5 animate-spin", step.color)} />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isCompleted && "text-travel-forest",
                  isCurrent && "text-foreground",
                  isPending && "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <Progress 
            value={Math.min(progress, 100)} 
            className="h-2 mb-3"
          />
          <p className="text-xs text-muted-foreground">
            {isComplete ? (
              <span className="text-travel-forest font-medium">Complete! Preparing your trip plan...</span>
            ) : (
              "This usually takes 10–15 seconds"
            )}
          </p>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-travel-coral/3 rounded-full blur-3xl" />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AIProcessingScreen;
