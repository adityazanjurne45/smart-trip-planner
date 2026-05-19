import { Link } from "react-router-dom";
import { MapPin, Heart, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl">Travello</span>
            </Link>
            <p className="text-background/70 max-w-sm mb-6">
              AI-powered trip planning that helps you discover amazing destinations, find perfect accommodations, and plan smart transportation.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-background/70 hover:text-background transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} Travello. All rights reserved.
          </p>
          <p className="text-background/60 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-travel-coral fill-travel-coral" /> for travelers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
