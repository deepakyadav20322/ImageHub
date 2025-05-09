"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModeToggle from "./mode-toggle";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/authSlice";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //   const { theme, setTheme } = useTheme()
  const {user,isAuthenticated:isLoggedIn} = useSelector((state: RootState) => state.auth);

  // const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);  



  const handleLogout = () => {

    dispatch(logout());
    navigate('/login',{ replace: true });
  };

  return (
    // <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 lg:px-6">
    <header className="sticky top-0 z-50 w-full dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-2 lg:px-6">
      <div className="container flex h-16 items-center justify-between mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center border-2 ">
              <span className="dark:text-primary-foreground text-blue-600  font-bold">MH</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
             <span className="dark:text-white text-blue-600"> Media Hub</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-2">
          {/* Search - Hidden on mobile */}
          {/* <div className="hidden sm:flex relative w-40 lg:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" />
          </div> */}

          {/* Theme Toggle */}

          <ModeToggle />

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>{user?(user?.firstName).at(0):"U"}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
              <Link className="cursor-pointer" to={'/dashboard/media'}>
                <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
                </Link>
            
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Login/Signup buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={"/login"}
                  className="inline-flex text-white h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors dark:hover:bg-muted hover:bg-blue-700 bg-blue-600 dark:bg-black hover:border-blue-800 dark:hover:border-slate-600 border-2"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 "
                >
                  Sign up
                </Link>
              </div>

              {/* Mobile login button */}
              {/* <Link
                to={"/login"}
                className="sm:hidden h-9 w-9"
                onClick={handleLogin}
              >
                <LogIn className="h-4 w-4" />
                <span className="sr-only">Login</span>
              </Link> */}
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Now using fixed positioning to overlay content */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-50 bg-background border-t shadow-lg px-4">
          <div className="container py-4 flex flex-col gap-4">
            {/* Mobile Search */}
            {/* <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div> */}

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium py-2 transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Login/Signup buttons for mobile - Only show when not logged in */}
            {!isLoggedIn && (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to={'/login'} >
                  Login
                </Link>
                <Link to={'/signup'}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
