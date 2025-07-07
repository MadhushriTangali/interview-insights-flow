
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Home,
  Briefcase,
  Star,
  BookOpen,
  Newspaper
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error("Error signing out");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Error signing in with Google");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Show limited navigation for unauthenticated users
  const publicNavItems = [
    { path: "/", label: "Home", icon: Home },
  ];

  // Show full navigation for authenticated users
  const privateNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/tracker", label: "Tracker", icon: Briefcase },
    { path: "/scheduler", label: "Scheduler", icon: Calendar },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/ratings", label: "Ratings", icon: Star },
    { path: "/prep", label: "Prep", icon: BookOpen },
    { path: "/news", label: "News", icon: Newspaper },
  ];

  const navItems = user ? privateNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            InterviewTracker
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center space-x-2 transition-all duration-200",
                  isActive(item.path) && "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Right side - Auth buttons or User menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth/login")}
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate("/auth/register")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Sign up
              </Button>
              <Button 
                variant="outline"
                onClick={handleGoogleSignIn}
                className="text-sm"
              >
                Sign in with Google
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container py-4 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full justify-start space-x-2 transition-all duration-200",
                    isActive(item.path) && "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            {!user && (
              <div className="pt-4 space-y-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/auth/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Log in
                </Button>
                <Button 
                  size="sm"
                  className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={() => {
                    navigate("/auth/register");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign up
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    handleGoogleSignIn();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign in with Google
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
