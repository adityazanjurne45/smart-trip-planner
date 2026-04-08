import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Send, CheckCircle, MessageSquare } from "lucide-react";

const ContactSection = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1200);
  };

  return (
    <section className="py-20 bg-muted/30" id="contact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Get in Touch</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Feel free to reach out for any travel assistance or issues
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-0.5">Call Us</p>
                  <a
                    href="tel:+919028267069"
                    className="text-foreground font-semibold hover:text-primary transition-colors"
                  >
                    +91 9028267069
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-0.5">Email Us</p>
                  <a
                    href="mailto:navjat4545@gmail.com"
                    className="text-foreground font-semibold hover:text-primary transition-colors break-all"
                  >
                    navjat4545@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground text-sm">Quick Support</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours. For urgent travel assistance, please call directly.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                    <Input
                      placeholder="Your name"
                      value={formState.name}
                      onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                      required
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                    <Textarea
                      placeholder="How can we help you?"
                      value={formState.message}
                      onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                      required
                      maxLength={1000}
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={sending}>
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
