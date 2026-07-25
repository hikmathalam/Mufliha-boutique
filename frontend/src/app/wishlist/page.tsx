"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Heart, Trash2, Calendar, Star, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/wishlist", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    // Optimistic UI update
    setWishlistItems((prev) => prev.filter((item: any) => item._id !== productId));

    try {
      const res = await fetch("http://localhost:5000/api/users/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });

      if (res.ok) {
        // Dispatch event to sync Navbar badge
        window.dispatchEvent(new Event("wishlistUpdate"));
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error(error);
      fetchWishlist(); // Revert on failure
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-brown-950 pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10 border-b border-gold-800/30 pb-6">
            <Heart className="text-gold-500 fill-gold-500" size={32} />
            <div>
              <h1 className="text-4xl font-serif text-gold-100">My Wishlist</h1>
              <p className="text-gold-200/50 text-xs uppercase tracking-wider mt-1">
                Your curated choices for the big day
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-t-2 border-b-2 border-gold-500 rounded-full animate-spin"></div>
              <p className="text-gold-400 font-serif tracking-widest text-xs">Loading items...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brown-900 border border-gold-800/20 rounded-2xl p-16 text-center shadow-xl max-w-xl mx-auto"
            >
              <Heart className="mx-auto text-gold-500/20 mb-6" size={56} />
              <h2 className="text-2xl font-serif text-gold-200 mb-3">Your wishlist is empty</h2>
              <p className="text-gold-100/50 mb-8 text-sm leading-relaxed">
                Explore our curated collections and save your favorite gold jewellery pieces or designer bridal dresses to rent for your special day.
              </p>
              <Link
                href="/collections"
                className="inline-block bg-gradient-to-r from-gold-600 to-gold-500 text-brown-950 px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                Discover Collections
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {wishlistItems.map((item: any) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item._id}
                    className="flex bg-brown-900 border border-gold-800/20 rounded-xl overflow-hidden hover:border-gold-500/30 hover:shadow-lg transition-all h-[190px]"
                  >
                    {/* Image Area */}
                    <div className="w-1/3 relative bg-brown-950">
                      <img
                        src={item.images[0] || "https://images.unsplash.com/photo-1599643478524-fb66f72400ae"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-brown-950/70 flex items-center justify-center p-1.5 text-center">
                          <span className="text-[8px] border border-gold-500/50 text-gold-400 font-bold px-1.5 py-0.5 uppercase tracking-widest rounded bg-brown-900">
                            Booked
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description Area */}
                    <div className="w-2/3 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] tracking-widest text-gold-500 uppercase font-semibold">
                            {item.category}
                          </span>
                          {/* Rating */}
                          <div className="flex text-gold-500 items-center gap-0.5">
                            <Star size={10} className="fill-gold-500" />
                            <span className="text-[9px] text-gold-200/50">({item.rating || 4.5})</span>
                          </div>
                        </div>

                        <Link href={`/collections/${item._id}`}>
                          <h3 className="font-serif text-lg text-gold-100 mt-1 hover:text-gold-400 transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>

                        <p className="text-gold-400 font-bold mt-2 font-serif text-base">
                          ₹{item.pricePerDay}{" "}
                          <span className="text-xs font-normal text-gold-200/50">/ day</span>
                        </p>
                      </div>

                      <div className="flex gap-3 pt-3 border-t border-gold-800/10">
                        <Link
                          href={`/collections/${item._id}`}
                          className="flex-1 bg-brown-950 border border-gold-800/50 text-gold-400 py-2 text-center rounded text-xs hover:bg-gold-600/10 transition-colors uppercase tracking-widest font-semibold"
                        >
                          View Info
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="px-3 border border-red-900/30 text-red-400 bg-red-950/10 rounded hover:bg-red-500/20 transition-colors"
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
