
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Zap className="size-5" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Unstoppable
              </span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Your comprehensive platform to track job applications, prepare for interviews, and achieve unstoppable success in your career.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4 text-purple-700 dark:text-purple-300">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/scheduler" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Scheduler
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Job Tracker
                </Link>
              </li>
              <li>
                <Link to="/prep" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Interview Prep
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4 text-purple-700 dark:text-purple-300">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-purple-200 dark:border-purple-800 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Unstoppable. All rights reserved. Keep pushing forward! 🚀</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
