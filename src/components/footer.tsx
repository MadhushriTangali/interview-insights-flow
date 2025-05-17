
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="size-5 text-primary" />
              <span className="font-bold text-xl">InterviewPro</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Your comprehensive platform to track job applications, prepare for interviews, and improve with feedback.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/scheduler" className="text-muted-foreground hover:text-primary transition-colors">
                  Scheduler
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-muted-foreground hover:text-primary transition-colors">
                  Job Tracker
                </Link>
              </li>
              <li>
                <Link to="/prep" className="text-muted-foreground hover:text-primary transition-colors">
                  Interview Prep
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} InterviewPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
