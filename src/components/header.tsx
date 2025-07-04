
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
    <header className="sticky top-0 z-40 w-full border-b border-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl">
      <div className="container flex h-18 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-bold group">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-400/50">
            <Zap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Unstoppable
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:ml-12 md:flex md:items-center md:gap-6 md:space-x-6 lg:space-x-8">
          {navigation
            .filter((item) => !item.hidden && (!item.requireAuth || user))
            .map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-base font-semibold transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400 relative group py-2 px-1",
                  location.pathname === item.href
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-foreground/80 hover:text-foreground"
                )}
              >
                {item.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full",
                  location.pathname === item.href ? "w-full" : ""
                )} />
              </Link>
            ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:justify-end">
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Now always visible */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900 dark:hover:to-blue-900 transition-all duration-300 rounded-xl h-11 w-11"
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
                    className="relative h-11 w-11 rounded-full hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 transition-all duration-300 hover:shadow-lg"
                  >
                    <Avatar className="h-11 w-11 border-2 border-gradient-to-r from-purple-400 to-blue-400">
                      <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg">
                        {getUserDisplayName().charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-purple-200 dark:border-purple-800 shadow-xl rounded-xl">
                  <DropdownMenuLabel className="text-purple-700 dark:text-purple-300 font-semibold text-base py-3">
                    {getUserDisplayName()}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem 
                      onClick={() => navigate("/profile")}
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900 dark:hover:to-blue-900 transition-all duration-200 py-3 text-base rounded-lg m-1"
                    >
                      <User className="mr-3 h-5 w-5 text-purple-600" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/dashboard")}
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900 dark:hover:to-blue-900 transition-all duration-200 py-3 text-base rounded-lg m-1"
                    >
                      <Calendar className="mr-3 h-5 w-5 text-purple-600" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/feedback")}
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900 dark:hover:to-blue-900 transition-all duration-200 py-3 text-base rounded-lg m-1"
                    >
                      <Settings className="mr-3 h-5 w-5 text-purple-600" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900 dark:hover:to-pink-900 text-red-600 transition-all duration-200 py-3 text-base rounded-lg m-1"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900 dark:hover:to-blue-900 transition-all duration-300 rounded-xl"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-l border-purple-200 dark:border-purple-800">
                <div className="flex flex-col space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/"
                      className="flex items-center gap-3 font-bold group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white">
                        <Zap className="h-6 w-6" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Unstoppable
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900 dark:hover:to-blue-900 rounded-xl"
                    >
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>

                  <nav className="flex flex-col space-y-3">
                    {navigation
                      .filter((item) => !item.hidden && (!item.requireAuth || user))
                      .map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex py-4 px-5 text-lg font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900 dark:hover:to-blue-900 rounded-xl",
                            location.pathname === item.href
                              ? "text-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 dark:text-purple-400 dark:from-purple-900 dark:to-blue-900"
                              : "text-foreground/80"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </nav>

                  <div className="flex flex-col space-y-3 pt-6 border-t border-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800">
                    {!user && (
                      <Button
                        variant="default"
                        onClick={() => {
                          navigate("/login");
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold rounded-xl"
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
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 text-lg font-semibold rounded-xl"
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
