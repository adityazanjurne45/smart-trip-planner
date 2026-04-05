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
  MapPin as MapPinIcon,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TripDetails, Recommendations } from "@/types/trip";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tabAction?: string;
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
    "what to do each day", "show plan", "today plan", "today's plan",
    "what should i do today",
  ],
  details: [
    "show hotels", "open hotels", "view hotels", "hotel options",
    "show places", "tourist places", "attractions",
    "show transport", "transport options", "vehicle options",
    "restaurants", "food options", "where to eat",
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
    "optimize budget", "save money", "cheaper option",
  ],
  story: [
    "show story", "trip story", "trip timeline", "show timeline",
  ],
};

const TAB_LABELS: Record<string, string> = {
  map: "Map", itinerary: "Day-by-Day", details: "Details",
  booking: "Book Tickets", prepare: "Prepare", overview: "Overview", story: "Story",
};

const AIAssistant = ({ tripDetails, recommendations, onTabRequest }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset welcome message when trip changes
  useEffect(() => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: tripDetails
        ? `Hi! I'm your AI travel assistant for **${tripDetails.destinationPoint}** 🌍\n\nI can help with:\n- 🗺️ \"Show map\" — view your route\n- 📅 \"Show itinerary\" — day-by-day plan\n- 💰 \"Optimize budget\" — saving tips\n- 🎒 \"Packing list\" — what to bring\n\nWhat would you like to know?`
        : "Hi! I'm your AI travel assistant. Plan a trip first, then I can help with maps, itineraries, budgets, and more!",
    }]);
  }, [tripDetails?.destinationPoint]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const detectTabIntent = (text: string): string | null => {
    const lower = text.toLowerCase();
    for (const [tab, intents] of Object.entries(TAB_INTENTS)) {
      if (intents.some(intent => lower.includes(intent))) return tab;
    }
    return null;
  };

  const quickQuestions = tripDetails ? [
    "What's the best time to visit?",
    "Show map of destinations",
    "Show my itinerary",
    "Optimize budget",
    "Packing list",
    "Local food recommendations",
  ] : [
    "Best destinations for adventure?",
    "Budget travel tips",
    "Family-friendly destinations?",
  ];

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

    const detectedTab = detectTabIntent(messageText);

    try {
      const context = tripDetails
        ? `User is planning a trip from ${tripDetails.boardingPoint} to ${tripDetails.destinationPoint} for ${tripDetails.duration} days with a budget of $${tripDetails.budget}. Travel style: ${tripDetails.travelStyle || "solo"}. Mood: ${tripDetails.travelMood || "chill"}.`
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
        tabAction: detectedTab && tripDetails ? detectedTab : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      }]);
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

  const clearChat = () => {
    setMessages([{
      id: "welcome-new",
      role: "assistant",
      content: tripDetails
        ? `Chat cleared! I'm still here to help with your trip to **${tripDetails.destinationPoint}**. What do you need?`
        : "Chat cleared! How can I help you?",
    }]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50 travel-gradient-hero"
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
                  {tripDetails ? `Helping with ${tripDetails.destinationPoint}` : "Ask me anything about travel"}
                </SheetDescription>
              </div>
            </div>
            {messages.length > 2 && (
              <Button variant="ghost" size="icon" onClick={clearChat} title="Clear chat" className="h-8 w-8">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
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
                  {message.role === "assistant" ? (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>p:last-child]:mb-0">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  {message.tabAction && onTabRequest && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 gap-2 text-xs bg-background/50 hover:bg-background"
                      onClick={() => {
                        onTabRequest(message.tabAction!);
                        setIsOpen(false);
                      }}
                    >
                      <MapPinIcon className="w-3 h-3" />
                      Open {TAB_LABELS[message.tabAction] || message.tabAction}
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
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
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
              {quickQuestions.map((q) => (
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
              placeholder={tripDetails ? "Ask about your trip..." : "Ask a travel question..."}
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
