"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Heart, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE from "@/lib/api";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Scroll effect for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    if (!user) {
      setWishlistCount(0);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/users/wishlist`, {
        credentials: "include",
      });

      // If unauthorized or no content, treat as empty wishlist
      if (res.status === 401 || res.status === 204) {
        setWishlistCount(0);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setWishlistCount(Array.isArray(data) ? data.length : 0);
      } else {
        setWishlistCount(0);
      }
    } catch (error) {
      // Network errors (e.g. backend not running) are common during development.
      // Don't spam the console; show a debug message and fallback to zero.
      console.debug("Could not fetch wishlist count:", error);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchWishlistCount();

    // Listen to custom wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };
    window.addEventListener("wishlistUpdate", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdate", handleWishlistUpdate);
  }, [user]);

  // Handle smooth scroll or routing
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
    } else {
      // Let it navigate to homepage with hash
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled || pathname !== "/"
          ? "bg-brown-950/95 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-gold-500/20"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0"
        >
          <img
            src="/logo.jpg"
            alt="Mufliha Boutique Logo"
            className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover border border-gold-500/30"
          />
          <span className="font-serif text-lg sm:text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-100 to-gold-500 block">
            Mufliha Boutique
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 text-xs uppercase tracking-[0.2em] items-center">
          <Link
            href="/collections"
            className={`hover:text-gold-300 transition-colors ${
              pathname === "/collections" ? "text-gold-400 font-semibold" : "text-gold-50"
            }`}
          >
            Collections
          </Link>
          <Link
            href="/collections?category=Bridal Dresses"
            className={`hover:text-gold-300 transition-colors ${
              pathname.includes("Bridal") ? "text-gold-400 font-semibold" : "text-gold-50"
            }`}
          >
            Bridal
          </Link>
          <Link
            href="/#testimonials"
            onClick={(e) => handleNavClick(e, "testimonials")}
            className="hover:text-gold-300 transition-colors text-gold-50"
          >
            Testimonials
          </Link>
          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="hover:text-gold-300 transition-colors text-gold-50"
          >
            Contact
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          {/* Wishlist Icon with count badge */}
          {user && (
            <Link
              href="/wishlist"
              className="relative text-gold-300 hover:text-gold-50 transition-colors p-2"
              title="My Wishlist"
            >
              <Heart size={22} className={wishlistCount > 0 ? "fill-gold-500 text-gold-500" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-brown-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brown-900 animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* User Account Controls */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-gold-300 hover:text-gold-50 text-xs uppercase tracking-widest transition-colors font-semibold py-2"
              >
                <div className="w-8 h-8 rounded-full bg-gold-900/30 border border-gold-500/30 flex items-center justify-center text-gold-400 font-serif text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(" ")[0]}</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-brown-900 border border-gold-500/20 rounded-lg shadow-xl py-2 z-20"
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gold-200 hover:bg-gold-500/10 hover:text-gold-50 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      {(user as any)?.isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gold-200 hover:bg-gold-500/10 hover:text-gold-50 transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gold-300 hover:text-gold-50 text-xs uppercase tracking-widest transition-colors font-semibold"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="border border-gold-500 text-gold-300 px-6 py-2 uppercase tracking-widest text-xs hover:bg-gold-500 hover:text-brown-950 transition-all duration-300 font-semibold"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden text-gold-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-[72px] bg-brown-950/98 backdrop-blur-md border-b border-gold-500/20 z-40 flex flex-col px-6 py-8 gap-6 lg:hidden shadow-2xl overflow-hidden"
          >
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif text-gold-200 hover:text-gold-50"
            >
              Collections
            </Link>
            <Link
              href="/collections?category=Bridal Dresses"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif text-gold-200 hover:text-gold-50"
            >
              Bridal Collection
            </Link>
            <Link
              href="/#testimonials"
              onClick={(e) => handleNavClick(e, "testimonials")}
              className="text-lg font-serif text-gold-200 hover:text-gold-50"
            >
              Testimonials
            </Link>
            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="text-lg font-serif text-gold-200 hover:text-gold-50"
            >
              Contact
            </Link>

            <hr className="border-gold-500/10" />

            {user ? (
              <>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-serif text-gold-200 hover:text-gold-50"
                >
                  <span>My Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-gold-500 text-brown-950 text-xs font-bold px-2 py-0.5 rounded-full">
                      {wishlistCount} items
                    </span>
                  )}
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-serif text-gold-200 hover:text-gold-50"
                >
                  Dashboard
                </Link>
                {(user as any)?.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-serif text-gold-200 hover:text-gold-50"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left text-lg font-serif text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif text-gold-200 hover:text-gold-50"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="mt-4 border border-gold-500 text-gold-300 px-8 py-3 uppercase tracking-widest text-sm text-center hover:bg-gold-500 hover:text-brown-950 transition-all font-semibold"
            >
              Contact Us
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
