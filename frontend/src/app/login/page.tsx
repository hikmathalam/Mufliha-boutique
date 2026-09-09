/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_BASE from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to login");
      
      login(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1a120c]">
      {/* Left: Decorative Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a120c]/60 via-transparent to-[#1a120c]/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787&auto=format&fit=crop"
          alt="Luxury Bridal Jewellery"
          className="w-full h-full object-cover"
        />
        {/* Overlay content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-14">
          <div className="border-l-2 border-[#c89233] pl-6 mb-8">
            <p className="font-serif text-2xl italic text-[#f5eedc] leading-relaxed mb-3">
              "Every bride deserves to shine in pure luxury."
            </p>
            <p className="text-[#ddbf7f] text-sm uppercase tracking-widest">— Mufliha Boutique</p>
          </div>
          <div className="flex gap-8">
            {[
              { num: "500+", label: "Happy Brides" },
              { num: "6 Mo", label: "Warranty" },
              { num: "100+", label: "Premium Pieces" }
            ].map((s, i) => (
              <div key={i}>
                <p className="font-serif text-2xl text-[#c89233] font-bold">{s.num}</p>
                <p className="text-[#ddbf7f] text-xs uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Logo top-left overlay */}
        <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover border border-[#c89233]/40" />
          <span className="font-serif text-lg text-[#ddbf7f]">Mufliha Boutique</span>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#1a120c]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center flex flex-col items-center">
            <img
              src="/logo.jpg"
              alt="Mufliha Boutique Logo"
              className="h-16 w-16 rounded-full object-cover border border-[#c89233]/30 mb-3"
            />
            <Link href="/" className="text-xl font-serif text-[#c89233] hover:text-[#ddbf7f]">Mufliha Boutique</Link>
          </div>

          <div className="bg-[#2d2116] p-10 rounded-xl border border-[#c89233]/20 shadow-2xl">
            <h2 className="text-3xl font-serif text-[#ddbf7f] mb-2">Welcome Back</h2>
            <p className="text-[#ddbf7f]/50 text-sm mb-8">Sign in to manage your bookings</p>
            
            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[#ddbf7f]/70 mb-2 text-sm uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a120c] border border-[#c89233]/20 rounded-lg p-3.5 text-[#fbf8f1] focus:outline-none focus:border-[#c89233] transition-colors placeholder:text-[#c89233]/20"
                  placeholder="your@email.com"
                  required 
                />
              </div>
              <div>
                <label className="block text-[#ddbf7f]/70 mb-2 text-sm uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a120c] border border-[#c89233]/20 rounded-lg p-3.5 text-[#fbf8f1] focus:outline-none focus:border-[#c89233] transition-colors placeholder:text-[#c89233]/20"
                  placeholder="••••••••"
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#b07628] to-[#c89233] text-[#1a120c] font-bold py-3.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-widest text-sm mt-2"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <p className="mt-6 text-center text-[#ddbf7f]/40 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#c89233] hover:text-[#ddbf7f] transition-colors">Register here</Link>
            </p>
          </div>

          <p className="text-center text-[#ddbf7f]/30 text-xs mt-6">
            <Link href="/" className="hover:text-[#ddbf7f]/60 transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

