import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { MapPin, Navigation, Calendar, Wallet, Sparkles, Loader2, ArrowLeft, ArrowRight, Check, AlertTriangle, CalendarDays } from "lucide-react";
import { TripDetails } from "@/types/trip";
import { z } from "zod";
import CityAutocomplete from "./CityAutocomplete";
import { cn } from "@/lib/utils";
import TripDatePicker, { TripDates } from "./TripDatePicker";
import { differenceInDays, format } from "date-fns";

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
  { id: 1, title: "Departure", icon: MapPin, color: "text-primary", bgColor: "bg-primary/10" },
  { id: 2, title: "Destination", icon: Navigation, color: "text-accent", bgColor: "bg-accent/10" },
  { id: 3, title: "Dates", icon: CalendarDays, color: "text-travel-coral", bgColor: "bg-travel-coral/10" },
  { id: 4, title: "Duration", icon: Calendar, color: "text-travel-forest", bgColor: "bg-travel-forest/10" },
  { id: 5, title: "Budget", icon: Wallet, color: "text-travel-gold", bgColor: "bg-travel-gold/10" },
];

const BUDGET_LEVELS = [
  { label: "Budget", range: "$100-500", min: 100, max: 500, color: "bg-travel-forest" },
  { label: "Moderate", range: "$500-2000", min: 500, max: 2000, color: "bg-primary" },
  { label: "Comfortable", range: "$2000-5000", min: 2000, max: 5000, color: "bg-travel-gold" },
  { label: "Luxury", range: "$5000+", min: 5000, max: 100000, color: "bg-accent" },
];

const TripWizard = ({ onSubmit }: TripWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [destinationPoint, setDestinationPoint] = useState("");
  const [tripDates, setTripDates] = useState<TripDates | undefined>();
  const [duration, setDuration] = useState("7");
  const [budget, setBudget] = useState("2000");
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
          setErrors({ boardingPoint: "Please enter a valid departure city" });
          return false;
        }
        break;
      case 2:
        if (destinationPoint.trim().length < 2) {
          setErrors({ destinationPoint: "Please enter a valid destination" });
          return false;
        }
        if (destinationPoint.toLowerCase() === boardingPoint.toLowerCase()) {
          setErrors({ destinationPoint: "Destination must be different from departure" });
          return false;
        }
        break;
      case 3:
        if (!tripDates?.startDate || !tripDates?.endDate) {
          setErrors({ dates: "Please select your travel dates" });
          return false;
        }
        break;
      case 4:
        const dur = parseInt(duration);
        if (!dur || dur < 1 || dur > 30) {
          setErrors({ duration: "Duration must be between 1 and 30 days" });
          return false;
        }
        break;
      case 5:
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
    const data: TripDetails = {
      boardingPoint: boardingPoint.trim(),
      destinationPoint: destinationPoint.trim(),
      duration: parseInt(duration),
      budget: parseInt(budget),
      startDate: tripDates?.startDate ? format(tripDates.startDate, "yyyy-MM-dd") : undefined,
      endDate: tripDates?.endDate ? format(tripDates.endDate, "yyyy-MM-dd") : undefined,
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

  const handleDateChange = (dates: TripDates) => {
    setTripDates(dates);
    const days = differenceInDays(dates.endDate, dates.startDate);
    setDuration(String(days));
  };

  const renderStepContent = () => {
    const currentStepData = STEPS[currentStep - 1];
    const StepIcon = currentStepData.icon;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${currentStepData.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <StepIcon className={`w-8 h-8 ${currentStepData.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Where are you starting from?</h2>
              <p className="text-muted-foreground">Enter your departure city or location</p>
            </div>
            <CityAutocomplete
              value={boardingPoint}
              onChange={setBoardingPoint}
              placeholder="e.g., New York, USA"
              label="Departure City"
              error={errors.boardingPoint}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${currentStepData.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <StepIcon className={`w-8 h-8 ${currentStepData.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Where do you want to go?</h2>
              <p className="text-muted-foreground">Enter your dream destination</p>
            </div>
            <CityAutocomplete
              value={destinationPoint}
              onChange={setDestinationPoint}
              placeholder="e.g., Paris, France"
              label="Destination"
              error={errors.destinationPoint}
            />
            {boardingPoint && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl p-4 border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Departing from: <strong className="text-foreground">{boardingPoint}</strong></span>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${currentStepData.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <StepIcon className={`w-8 h-8 ${currentStepData.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">When do you want to travel?</h2>
              <p className="text-muted-foreground">Select your departure and return dates</p>
            </div>
            
            <TripDatePicker value={tripDates} onChange={handleDateChange} />
            
            {errors.dates && (
              <p className="text-sm text-destructive text-center">{errors.dates}</p>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${currentStepData.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <StepIcon className={`w-8 h-8 ${currentStepData.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">How long is your trip?</h2>
              <p className="text-muted-foreground">Select or enter your trip duration</p>
            </div>
            
            {/* Duration Display */}
            <div className="text-center py-4">
              <span className="text-5xl font-bold text-foreground">{duration}</span>
              <span className="text-2xl text-muted-foreground ml-2">days</span>
            </div>

            {/* Slider */}
            <div className="px-2">
              <Slider
                value={[parseInt(duration) || 7]}
                onValueChange={(value) => setDuration(String(value[0]))}
                min={1}
                max={30}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 day</span>
                <span>30 days</span>
              </div>
            </div>

            {/* Manual Input */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-muted-foreground">
                Or enter manually
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="7"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-12 text-center text-lg rounded-xl"
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration}</p>
              )}
            </div>

            {/* Quick Options */}
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 14].map((days) => (
                <Button
                  key={days}
                  type="button"
                  variant={duration === String(days) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuration(String(days))}
                  className="rounded-xl"
                >
                  {days}d
                </Button>
              ))}
            </div>
          </div>
        );
      case 5:
        const budgetLevel = getBudgetLevel();
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${currentStepData.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <StepIcon className={`w-8 h-8 ${currentStepData.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">What's your budget?</h2>
              <p className="text-muted-foreground">Total budget for your trip</p>
            </div>

            {/* Budget Display */}
            <div className="text-center py-4">
              <span className="text-4xl font-bold text-foreground">${budgetValue.toLocaleString()}</span>
            </div>

            {/* Slider */}
            <div className="px-2">
              <Slider
                value={[budgetValue]}
                onValueChange={(value) => setBudget(String(value[0]))}
                min={100}
                max={10000}
                step={100}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$100</span>
                <span>$10,000+</span>
              </div>
            </div>

            {/* Manual Input */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium text-muted-foreground">
                Or enter exact amount (USD)
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
                  className="h-12 text-center text-lg rounded-xl pl-8"
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-destructive">{errors.budget}</p>
              )}
            </div>

            {/* Budget Level & Daily Budget */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Budget Level</span>
                <span className={cn("font-medium px-3 py-1 rounded-full text-sm text-primary-foreground", budgetLevel.color)}>
                  {budgetLevel.label}
                </span>
              </div>
              {dailyBudget > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Daily budget</span>
                  <span className="font-semibold text-foreground">${dailyBudget}/day</span>
                </div>
              )}
            </div>

            {dailyBudget > 0 && dailyBudget < 50 && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>Low daily budget. Consider increasing for a comfortable trip.</span>
              </div>
            )}

            {/* Quick Options */}
            <div className="grid grid-cols-4 gap-2">
              {[500, 1500, 3000, 5000].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={budget === String(amount) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBudget(String(amount))}
                  className="rounded-xl text-xs"
                >
                  ${amount >= 1000 ? `${amount/1000}k` : amount}
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="relative flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? `${step.bgColor} ring-2 ring-primary ring-offset-2`
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className={cn("w-5 h-5", isCurrent && step.color)} />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium mt-2 transition-colors",
                      isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div 
                    className={cn(
                      "h-0.5 flex-1 mx-2 rounded-full transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )} 
                  />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-1.5 rounded-full" />
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            type="button"
            onClick={handleNext}
            className="gap-2 rounded-xl"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="travel"
            disabled={isSubmitting}
            className="gap-2 rounded-xl shadow-hero hover:shadow-xl transition-shadow"
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
