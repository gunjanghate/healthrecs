
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown, Menu, User, X } from "lucide-react";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define the navigation items based on the user's role
  const getNavItems = () => {
    const commonItems = [
      { label: "Dashboard", path: "/" },
      { label: "Patients", path: "/patients" },
    ];

    if (user?.role === "admin") {
      return [
        ...commonItems,
        { label: "Reports", path: "/reports" },
        { label: "Settings", path: "/settings" },
      ];
    }

    if (user?.role === "doctor") {
      return [
        ...commonItems,
        { label: "Treatment", path: "/treatment" },
        { label: "Reports", path: "/reports" },
      ];
    }

    return commonItems; // Staff role
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <span className="text-primary-foreground font-bold text-lg">HR</span>
            </div>
            <span className="font-semibold hidden md:inline-block">HealthRecs</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-base font-medium transition-colors hover:text-primary relative pb-1 group ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-foreground/80"
              }`}
            >
              {item.label}
              <span 
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 
                ${location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-50 bg-background animate-fade-in">
            <nav className="container flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-lg font-medium p-2 transition-colors hover:text-primary relative
                    ${
                      location.pathname === item.path
                        ? "text-primary border-l-4 border-primary pl-4"
                        : "text-foreground/80 pl-4"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-health-danger"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          
          <ModeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative pl-2 pr-7">
                  <User className="h-5 w-5 mr-2" />
                  <span className="max-w-[100px] truncate text-sm hidden sm:inline-block">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => switchRole("doctor")}>
                  Switch to Doctor Role
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole("staff")}>
                  Switch to Staff Role
                </DropdownMenuItem>
                {user.role === "admin" ? null : (
                  <DropdownMenuItem onClick={() => switchRole("admin")}>
                    Switch to Admin Role
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
