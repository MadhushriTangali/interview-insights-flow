
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/lib/auth";
import { 
  Bell, 
  Calendar, 
  ChevronDown, 
  Clipboard, 
  LogOut, 
  Menu, 
  Settings, 
  User 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItems = () => (
    <>
      <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
        Dashboard
      </Link>
      <Link to="/scheduler" className="text-foreground hover:text-primary transition-colors">
        Scheduler
      </Link>
      <Link to="/tracker" className="text-foreground hover:text-primary transition-colors">
        Job Tracker
      </Link>
      <Link to="/prep" className="text-foreground hover:text-primary transition-colors">
        Interview Prep
      </Link>
      <Link to="/news" className="text-foreground hover:text-primary transition-colors">
        News & Hiring
      </Link>
    </>
  );

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            <span className="font-bold text-xl">InterviewPro</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && <NavItems />}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    <div className="p-3 hover:bg-muted cursor-pointer">
                      <p className="font-medium">Google Interview Tomorrow</p>
                      <p className="text-sm text-muted-foreground">Your interview is scheduled for tomorrow at 2:00 PM</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                    <div className="p-3 hover:bg-muted cursor-pointer">
                      <p className="font-medium">Feedback Reminder</p>
                      <p className="text-sm text-muted-foreground">Don't forget to rate your Microsoft interview</p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ""} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile Navigation */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <div className="flex flex-col gap-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-5 text-primary" />
                      <span className="font-bold text-xl">InterviewPro</span>
                    </div>
                    <nav className="flex flex-col space-y-4">
                      <NavItems />
                      <Link to="/profile" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                        <User className="size-4" /> Profile
                      </Link>
                      <Link to="/settings" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                        <Settings className="size-4" /> Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="text-foreground hover:text-primary transition-colors flex items-center gap-2 text-left"
                      >
                        <LogOut className="size-4" /> Logout
                      </button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
