
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 border-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-800">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg">
                <Zap className="size-7" />
              </div>
              <span className="font-bold text-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Unstoppable
              </span>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Your comprehensive platform to track job applications, prepare for interviews, and achieve unstoppable success in your career journey. Transform your job search with our powerful tools and insights.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 dark:from-purple-300 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 text-lg font-medium hover:translate-x-2 transform inline-block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/scheduler" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 text-lg font-medium hover:translate-x-2 transform inline-block">
                  Scheduler
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 text-lg font-medium hover:translate-x-2 transform inline-block">
                  Job Tracker
                </Link>
              </li>
              <li>
                <Link to="/prep" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 text-lg font-medium hover:translate-x-2 transform inline-block">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 text-lg font-medium hover:translate-x-2 transform inline-block">
                  News & Hiring
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-800 mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-lg font-medium">
            &copy; {new Date().getFullYear()} Unstoppable. All rights reserved. 
            <span className="ml-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
              Keep pushing forward! 🚀
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
