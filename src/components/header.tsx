
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/auth";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    requireAuth: true,
    hidden: false,
  },
  {
    name: "Interview Scheduler",
    href: "/scheduler",
    requireAuth: true,
    hidden: false,
  },
  {
    name: "Interview Tracker",
    href: "/tracker",
    requireAuth: true,
    hidden: false,
  },
  {
    name: "Preparation",
    href: "/prep",
    requireAuth: true,
    hidden: false,
  },
  {
    name: "News & Hiring",
    href: "/news",
    requireAuth: false,
    hidden: false,
  },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, session } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Fixed theme toggle function
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get user display name and avatar from Supabase user metadata
  const getUserDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.name || user.email || "";
  };

  const getUserAvatar = () => {
    if (!user) return "";
    return user.user_metadata?.avatar_url || "";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold group">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white group-hover:scale-110 transition-transform">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Unstoppable
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:ml-10 md:flex md:items-center md:gap-4 md:space-x-4 lg:space-x-6">
          {navigation
            .filter((item) => !item.hidden && (!item.requireAuth || user))
            .map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400 relative group",
                  location.pathname === item.href
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-foreground/70"
                )}
              >
                {item.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-200 group-hover:w-full",
                  location.pathname === item.href ? "w-full" : ""
                )} />
              </Link>
            ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:justify-end">
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Now always visible */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-1 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
            </Button>

            {/* User Menu (if logged in) */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 transition-all"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        {getUserDisplayName().charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-purple-200 dark:border-purple-800">
                  <DropdownMenuLabel className="text-purple-700 dark:text-purple-300">
                    {getUserDisplayName()}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-200 dark:bg-purple-800" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem 
                      onClick={() => navigate("/profile")}
                      className="hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
                    >
                      <User className="mr-2 h-4 w-4 text-purple-600" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/dashboard")}
                      className="hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/feedback")}
                      className="hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
                    >
                      <Settings className="mr-2 h-4 w-4 text-purple-600" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-purple-200 dark:bg-purple-800" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="hover:bg-red-50 dark:hover:bg-red-900 text-red-600 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-l border-purple-200 dark:border-purple-800">
                <div className="flex flex-col space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/"
                      className="flex items-center gap-2 font-bold group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        <Zap className="h-5 w-5" />
                      </div>
                      <span className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Unstoppable
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="hover:bg-purple-100 dark:hover:bg-purple-900"
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>

                  <nav className="flex flex-col space-y-2">
                    {navigation
                      .filter((item) => !item.hidden && (!item.requireAuth || user))
                      .map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex py-3 px-4 text-base font-medium transition-colors hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg",
                            location.pathname === item.href
                              ? "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900"
                              : "text-foreground/70"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </nav>

                  <div className="flex flex-col space-y-2 pt-4 border-t border-purple-200 dark:border-purple-800">
                    {!user && (
                      <Button
                        variant="default"
                        onClick={() => {
                          navigate("/login");
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        Sign In
                      </Button>
                    )}
                    {user && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      >
                        Log Out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
