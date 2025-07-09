
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Target, 
  BarChart3, 
  Brain, 
  Newspaper,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = user ? [
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/scheduler", label: "Scheduler", icon: Calendar },
    { path: "/tracker", label: "Tracker", icon: Target },
    { path: "/prep", label: "Preparation", icon: Brain },
    { path: "/news", label: "News & Hiring", icon: Newspaper },
  ] : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate(user ? "/dashboard" : "/")}
        >
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Target className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            InterviewMaster
          </span>
        </div>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 ${
                  isActive(item.path) 
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                    : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        )}

        {/* User Menu or Auth Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center space-x-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth/login")}
                className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth/register")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 px-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`justify-start ${
                    isActive(item.path) 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                      : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
