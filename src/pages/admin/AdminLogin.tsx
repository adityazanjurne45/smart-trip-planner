import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export const ADMIN_SESSION_KEY = "travello_admin_session";
const DEMO_EMAIL = "admin@travello.com";
const DEMO_PASSWORD = "admin123";

export function isAdminAuthed() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthed()) navigate("/admin-dashboard", { replace: true });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        localStorage.setItem(ADMIN_SESSION_KEY, "true");
        toast.success("Welcome, Admin");
        navigate("/admin-dashboard", { replace: true });
      } else {
        toast.error("Invalid admin credentials");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary mx-auto flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Admin Panel Login</CardTitle>
          <CardDescription>Secure access for Travello AI administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@travello.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pwd">Password</Label>
              <div className="relative">
                <Input
                  id="admin-pwd"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? "Signing in…" : "Login"}
            </Button>

            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
              <p className="font-semibold">Demo Credentials</p>
              <p>Email: <span className="font-mono">admin@travello.com</span></p>
              <p>Password: <span className="font-mono">admin123</span></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
