"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");
      
      login(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brown-950 p-4">
      <div className="w-full max-w-md bg-brown-900 p-8 rounded-xl border border-gold-800/30 shadow-2xl">
        <div className="mb-8 text-center flex flex-col items-center">
          <img
            src="/logo.jpg"
            alt="Mufliha Boutique Logo"
            className="h-16 w-16 rounded-full object-cover border border-gold-500/30 mb-3"
          />
          <Link href="/" className="text-xl font-serif text-gold-500 hover:text-gold-400">Mufliha Boutique</Link>
          <h2 className="text-3xl font-serif text-gold-400 mt-4">Create Account</h2>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gold-200/70 mb-2 text-sm">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brown-950 border border-gold-800/30 rounded-lg p-3 text-gold-50 focus:outline-none focus:border-gold-500 transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-gold-200/70 mb-2 text-sm">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brown-950 border border-gold-800/30 rounded-lg p-3 text-gold-50 focus:outline-none focus:border-gold-500 transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-gold-200/70 mb-2 text-sm">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brown-950 border border-gold-800/30 rounded-lg p-3 text-gold-50 focus:outline-none focus:border-gold-500 transition-colors"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-brown-950 font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-gold-200/50 text-sm">
          Already have an account? <Link href="/login" className="text-gold-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
