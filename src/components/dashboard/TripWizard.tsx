import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MapPin, Navigation, Calendar, Wallet, Sparkles, Loader2, ArrowLeft, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { TripDetails } from "@/pages/Dashboard";
import { z } from "zod";
import CityAutocomplete from "./CityAutocomplete";
import { cn } from "@/lib/utils";

const tripSchema = z.object({
  boardingPoint: z.string().min(2, "Boarding point is required").max(100),
  destinationPoint: z.string().min(2, "Destination is required").max(100),
  duration: z.number().min(1, "Duration must be at least 1 day").max(30, "Duration cannot exceed 30 days"),
  budget: z.number().min(100, "Budget must be at least $100").max(100000, "Budget cannot exceed $100,000"),
});

interface TripWizardProps {
  onSubmit: (details: TripDetails) => void;
}

const STEPS = [
  { id: 1, title: "Where from?", icon: MapPin },
  { id: 2, title: "Where to?", icon: Navigation },
  { id: 3, title: "Duration", icon: Calendar },
  { id: 4, title: "Budget", icon: Wallet },
];

const BUDGET_LEVELS = [
  { label: "Budget", range: "$100-500", min: 100, max: 500, color: "bg-travel-forest" },
  { label: "Moderate", range: "$500-2000", min: 500, max: 2000, color: "bg-travel-ocean" },
  { label: "Comfortable", range: "$2000-5000", min: 2000, max: 5000, color: "bg-travel-gold" },
  { label: "Luxury", range: "$5000+", min: 5000, max: 100000, color: "bg-travel-coral" },
];

const TripWizard = ({ onSubmit }: TripWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [destinationPoint, setDestinationPoint] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (currentStep / STEPS.length) * 100;
  const budgetValue = parseInt(budget) || 0;
  const durationValue = parseInt(duration) || 0;
  const dailyBudget = durationValue > 0 ? Math.round(budgetValue / durationValue) : 0;

  const getBudgetLevel = () => {
    if (budgetValue < 500) return BUDGET_LEVELS[0];
    if (budgetValue < 2000) return BUDGET_LEVELS[1];
    if (budgetValue < 5000) return BUDGET_LEVELS[2];
    return BUDGET_LEVELS[3];
  };

  const validateStep = (step: number): boolean => {
    setErrors({});
    switch (step) {
      case 1:
        if (boardingPoint.trim().length < 2) {
          setErrors({ boardingPoint: "Please enter a valid boarding point" });
          return false;
        }
        break;
      case 2:
        if (destinationPoint.trim().length < 2) {
          setErrors({ destinationPoint: "Please enter a valid destination" });
          return false;
        }
        if (destinationPoint.toLowerCase() === boardingPoint.toLowerCase()) {
          setErrors({ destinationPoint: "Destination must be different from boarding point" });
          return false;
        }
        break;
      case 3:
        const dur = parseInt(duration);
        if (!dur || dur < 1 || dur > 30) {
          setErrors({ duration: "Duration must be between 1 and 30 days" });
          return false;
        }
        break;
      case 4:
        const bud = parseInt(budget);
        if (!bud || bud < 100) {
          setErrors({ budget: "Budget must be at least $100" });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    const data = {
      boardingPoint: boardingPoint.trim(),
      destinationPoint: destinationPoint.trim(),
      duration: parseInt(duration),
      budget: parseInt(budget),
    };

    try {
      tripSchema.parse(data);
      setErrors({});
      onSubmit(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Where are you starting from?</h2>
              <p className="text-muted-foreground mt-2">Enter your departure city</p>
            </div>
            <CityAutocomplete
              value={boardingPoint}
              onChange={setBoardingPoint}
              placeholder="e.g., New York, USA"
              label="Boarding Point"
              error={errors.boardingPoint}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fade-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Where do you want to go?</h2>
              <p className="text-muted-foreground mt-2">Enter your dream destination</p>
            </div>
            <CityAutocomplete
              value={destinationPoint}
              onChange={setDestinationPoint}
              placeholder="e.g., Paris, France"
              label="Destination"
              error={errors.destinationPoint}
            />
            {boardingPoint && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <MapPin className="w-4 h-4" />
                <span>From: {boardingPoint}</span>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fade-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-travel-forest/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-travel-forest" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">How long is your trip?</h2>
              <p className="text-muted-foreground mt-2">Select your trip duration</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Trip Duration (days)
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 7"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-14 text-lg text-center rounded-xl"
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration}</p>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[3, 5, 7, 14].map((days) => (
                <Button
                  key={days}
                  type="button"
                  variant={duration === String(days) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuration(String(days))}
                  className="rounded-lg"
                >
                  {days} days
                </Button>
              ))}
            </div>
          </div>
        );
      case 4:
        const budgetLevel = getBudgetLevel();
        return (
          <div className="space-y-4 animate-fade-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-travel-gold/10 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-travel-gold" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">What's your budget?</h2>
              <p className="text-muted-foreground mt-2">Total budget for your trip</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium">
                Budget (USD)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">$</span>
                <Input
                  id="budget"
                  type="number"
                  placeholder="2000"
                  min="100"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="h-14 text-lg text-center rounded-xl pl-8"
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-destructive">{errors.budget}</p>
              )}
            </div>

            {/* Budget level indicator */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budget Level</span>
                <span className={cn("font-medium px-3 py-1 rounded-full text-white", budgetLevel.color)}>
                  {budgetLevel.label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {BUDGET_LEVELS.map((level, i) => (
                  <div
                    key={level.label}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      budgetValue >= level.min ? level.color : "bg-muted"
                    )}
                  />
                ))}
              </div>
              {dailyBudget > 0 && (
                <div className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Daily budget</span>
                  <span className="font-semibold text-foreground">${dailyBudget}/day</span>
                </div>
              )}
              {dailyBudget > 0 && dailyBudget < 50 && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Low daily budget. Consider increasing for a comfortable trip.</span>
                </div>
              )}
            </div>

            {/* Quick budget options */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[500, 1000, 2500, 5000].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={budget === String(amount) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBudget(String(amount))}
                  className="rounded-lg"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="travel-card p-8 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                  currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "bg-primary/20 text-primary ring-2 ring-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2">
          {STEPS.map((step) => (
            <span
              key={step.id}
              className={cn(
                "text-xs font-medium transition-colors",
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            type="button"
            onClick={handleNext}
            className="gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="travel"
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get Recommendations
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TripWizard;
