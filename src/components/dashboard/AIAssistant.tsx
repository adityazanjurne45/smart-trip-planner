import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MessageCircle,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  X,
  MapPin as MapPinIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TripDetails, Recommendations } from "@/types/trip";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mapAction?: boolean;
}

interface AIAssistantProps {
  tripDetails?: TripDetails;
  recommendations?: Recommendations;
  onTabRequest?: (tab: string) => void;
}

const TAB_INTENTS: Record<string, string[]> = {
  map: [
    "show map", "open map", "view map", "display map",
    "show route", "view route", "show directions",
    "show destinations", "view destinations", "plot destinations",
    "where is", "show location", "map of",
    "navigate to", "directions to",
  ],
  itinerary: [
    "show itinerary", "open itinerary", "view itinerary",
    "day by day", "day-by-day", "daily plan", "show schedule",
    "what to do each day", "show plan",
  ],
  details: [
    "show hotels", "open hotels", "view hotels", "hotel options",
    "show places", "tourist places", "attractions",
    "show transport", "transport options", "vehicle options",
  ],
  booking: [
    "book ticket", "book hotel", "book bus", "book train", "book flight",
    "booking", "reserve", "show booking",
  ],
  prepare: [
    "packing list", "what to pack", "show packing",
    "expense", "budget tracker", "show expenses",
    "group split", "split expenses",
  ],
  overview: [
    "show overview", "trip summary", "show summary",
    "show budget", "budget breakdown", "how much will it cost",
  ],
  story: [
    "show story", "trip story", "trip timeline", "show timeline",
  ],
};

const QUICK_QUESTIONS = [
  "What's the best time to visit?",
  "Suggest local food to try",
  "Any safety tips?",
  "Show map of destinations",
  "Show my itinerary",
  "Budget saving tips?",
];

const AIAssistant = ({ tripDetails, recommendations, onMapRequest }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: tripDetails
        ? `Hi! I'm your AI travel assistant. I can help you with questions about your trip to ${tripDetails.destinationPoint}. What would you like to know?`
        : "Hi! I'm your AI travel assistant. Ask me anything about planning your trip!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const detectMapIntent = (text: string): boolean => {
    const lower = text.toLowerCase();
    return MAP_INTENTS.some(intent => lower.includes(intent));
  };

  const handleSend = async (question?: string) => {
    const messageText = question || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const isMapIntent = detectMapIntent(messageText);

    try {
      const context = tripDetails
        ? `User is planning a trip from ${tripDetails.boardingPoint} to ${tripDetails.destinationPoint} for ${tripDetails.duration} days with a budget of $${tripDetails.budget}.`
        : "User is exploring travel options.";

      const { data, error } = await supabase.functions.invoke("ai-travel-assistant", {
        body: {
          question: messageText,
          context,
          recommendations: recommendations ? JSON.stringify(recommendations) : null,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer || "I'm sorry, I couldn't process that question. Please try again.",
        mapAction: isMapIntent && !!tripDetails,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 travel-gradient-hero"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl travel-gradient-hero flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-left">AI Travel Assistant</SheetTitle>
                <SheetDescription className="text-left">
                  Ask me anything about your trip
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    message.role === "assistant"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-[80%]",
                    message.role === "assistant"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.mapAction && onMapRequest && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 gap-2 text-xs"
                      onClick={() => {
                        onMapRequest();
                        setIsOpen(false);
                      }}
                    >
                      <MapPinIcon className="w-3 h-3" />
                      View on Map
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 rounded-xl"
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIAssistant;
