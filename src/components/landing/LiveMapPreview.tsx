import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Clock, Route } from "lucide-react";

interface Point {
  x: number;
  y: number;
  label: string;
  type: "start" | "end" | "attraction" | "hotel";
}

const LiveMapPreview = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vehicleProgress, setVehicleProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const points: Point[] = [
    { x: 80, y: 280, label: "New York", type: "start" },
    { x: 200, y: 180, label: "Hotel", type: "hotel" },
    { x: 350, y: 120, label: "Beach", type: "attraction" },
    { x: 500, y: 160, label: "Museum", type: "attraction" },
    { x: 620, y: 100, label: "Miami", type: "end" },
  ];

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setVehicleProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw route with gradient
    const gradient = ctx.createLinearGradient(80, 0, 620, 0);
    gradient.addColorStop(0, "hsl(185, 72%, 32%)");
    gradient.addColorStop(0.5, "hsl(16, 85%, 58%)");
    gradient.addColorStop(1, "hsl(160, 45%, 35%)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Animated dash
    const dashProgress = isVisible ? vehicleProgress * 10 : 0;
    ctx.setLineDash([15, 10]);
    ctx.lineDashOffset = -dashProgress;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Curved path through points
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      const cpY = Math.min(prev.y, curr.y) - 30;
      ctx.quadraticCurveTo(cpX, cpY, curr.x, curr.y);
    }
    ctx.stroke();

    // Draw markers
    points.forEach((point) => {
      // Outer glow
      const glowGradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        20
      );
      glowGradient.addColorStop(0, getPointColor(point.type, 0.4));
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Inner circle
      ctx.fillStyle = getPointColor(point.type, 1);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // White center
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "hsl(200, 25%, 15%)";
      ctx.font = "600 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(point.label, point.x, point.y + 28);
    });

    // Draw vehicle
    if (isVisible) {
      const totalLength = getTotalPathLength();
      const currentDistance = (vehicleProgress / 100) * totalLength;
      const vehiclePos = getPositionOnPath(currentDistance);

      // Vehicle shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.ellipse(vehiclePos.x + 2, vehiclePos.y + 3, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vehicle emoji
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🚗", vehiclePos.x, vehiclePos.y - 5);
    }
  }, [vehicleProgress, isVisible, points]);

  function getPointColor(type: string, opacity: number): string {
    switch (type) {
      case "start":
        return `hsla(185, 72%, 32%, ${opacity})`;
      case "end":
        return `hsla(160, 45%, 35%, ${opacity})`;
      case "hotel":
        return `hsla(16, 85%, 58%, ${opacity})`;
      case "attraction":
        return `hsla(42, 90%, 55%, ${opacity})`;
      default:
        return `hsla(185, 72%, 32%, ${opacity})`;
    }
  }

  function getTotalPathLength(): number {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  }

  function getPositionOnPath(distance: number): { x: number; y: number } {
    let accumulated = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);

      if (accumulated + segmentLength >= distance) {
        const t = (distance - accumulated) / segmentLength;
        return {
          x: points[i - 1].x + dx * t,
          y: points[i - 1].y + dy * t,
        };
      }
      accumulated += segmentLength;
    }
    return points[points.length - 1];
  }

  return (
    <section ref={containerRef} className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Route className="w-4 h-4" />
            Interactive Preview
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            See Your Route{" "}
            <span className="text-accent">Come to Life</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Watch animated routes with real-time vehicle tracking and smart navigation.
          </p>
        </div>

        {/* Map Preview Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-hero">
            {/* Map Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>New York</span>
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-travel-forest rounded-full" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="w-4 h-4 text-travel-forest" />
                  <span>Miami</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>~18h drive</span>
              </div>
            </div>

            {/* Canvas Map */}
            <div className="relative h-80 md:h-96 bg-gradient-to-br from-background to-secondary/50">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ width: "100%", height: "100%" }}
              />

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Start</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-travel-coral" />
                  <span className="text-muted-foreground">Hotel</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-travel-gold" />
                  <span className="text-muted-foreground">Attraction</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-travel-forest" />
                  <span className="text-muted-foreground">Destination</span>
                </div>
              </div>

              {/* Route Stats */}
              <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-border">
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(vehicleProgress)}%
                </div>
                <div className="text-xs text-muted-foreground">Journey Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMapPreview;
