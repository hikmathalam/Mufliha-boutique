"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Calendar, Check, X, Clock, AlertCircle, ArrowRight } from "lucide-react";
import API_BASE from "@/lib/api";

interface Booking {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  phone: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/bookings/my-bookings`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case "Confirmed": return <Check size={14} className="text-green-400" />;
      case "Pending": return <Clock size={14} className="text-gold-400" />;
      case "Cancelled": return <X size={14} className="text-red-400" />;
      case "Completed": return <Check size={14} className="text-blue-400" />;
      default: return <AlertCircle size={14} className="text-gold-400" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "text-green-400 border-green-800/30 bg-green-950/20";
      case "Pending": return "text-gold-400 border-gold-800/30 bg-gold-950/20";
      case "Cancelled": return "text-red-400 border-red-800/30 bg-red-950/20";
      case "Completed": return "text-blue-400 border-blue-800/30 bg-blue-950/20";
      default: return "text-gold-400 border-gold-800/30 bg-gold-950/20";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-brown-950 pb-16">
        {/* Dashboard Hero Banner */}
        <div className="relative h-48 md:h-60 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a120c]/40 to-[#1a120c] z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2864&auto=format&fit=crop"
            alt="Mufliha Boutique"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center pt-16">
            <div className="text-center">
              <p className="text-[#ddbf7f] text-xs uppercase tracking-[0.3em] mb-1">Your Account</p>
              <h1 className="font-serif text-3xl md:text-4xl text-[#f5eedc]">My Dashboard</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-6 relative z-30">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/" className="text-gold-500 hover:text-gold-400 text-sm">← Back to Home</Link>
          </div>

          <div className="bg-brown-900 rounded-2xl border border-gold-800/30 p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h1 className="text-4xl font-serif text-gold-400 sr-only">Dashboard</h1>
              <button
                onClick={logout}
                className="ml-auto px-6 py-2 border border-gold-600/50 text-gold-400 rounded-lg hover:bg-gold-600/10 transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1 bg-brown-950 rounded-xl p-6 border border-gold-800/20">
                <div className="w-16 h-16 bg-gold-900/30 rounded-full flex items-center justify-center text-gold-500 text-2xl font-serif mb-4 border border-gold-800/50">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl text-gold-200 mb-1">{user?.name}</h2>
                <p className="text-gold-100/50 text-sm mb-4">{user?.email}</p>
                <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-full">
                  Active Account
                </div>
              </div>

              <div className="md:col-span-2 bg-brown-950 rounded-xl p-6 border border-gold-800/20">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={20} className="text-gold-500" />
                  <h3 className="text-gold-200 font-semibold">Your Rentals</h3>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-gold-400 text-sm">
                    <div className="w-4 h-4 border-t-2 border-gold-500 rounded-full animate-spin" />
                    Loading bookings...
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gold-100/50 mb-4">No rental bookings yet</p>
                    <Link
                      href="/collections"
                      className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm uppercase tracking-wider font-semibold"
                    >
                      Browse Collections <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center gap-4 bg-brown-900/60 rounded-lg p-3 border border-gold-800/10"
                      >
                        <div className="w-12 h-12 rounded-lg bg-brown-800 overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={booking.product?.images?.[0] || "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=200"}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=200";
                          }}
                        />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gold-100 text-sm font-semibold truncate">
                            {booking.product?.name || "Unknown Piece"}
                          </p>
                          <p className="text-gold-200/50 text-xs">
                            {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-gold-400 text-sm font-bold">₹{booking.totalPrice}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border ${statusColor(booking.status)}`}>
                            {statusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
