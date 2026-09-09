"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Heart, RotateCcw, Star, CheckCircle, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [isAvailableOnly, setIsAvailableOnly] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  const categories = [
    "All",
    "Bridal Sets",
    "Necklaces",
    "Earrings & Bangles",
    "Fancy Items",
    "Rings",
    "Anklets",
    "Bridal Dresses",
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const base = (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:5000";
      let url = `${base}/api/products?`;
      if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
      if (category !== "All") url += `category=${encodeURIComponent(category)}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;
      if (sort && sort !== "featured") url += `sort=${sort}&`;
      if (isAvailableOnly) url += `isAvailable=true&`;

      const res = await fetch(url);
      if (!res.ok) {
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.debug("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, minPrice, maxPrice, sort, isAvailableOnly]);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const base = (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:5000";
      const res = await fetch(`${base}/api/users/wishlist`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.map((item: any) => item._id));
      }
    } catch (error) {
      console.debug("Error fetching wishlist:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      alert("Please sign in to add items to your wishlist.");
      return;
    }

    // Optimistic update
    const isAdding = !wishlist.includes(productId);
    setWishlist((prev) =>
      isAdding ? [...prev, productId] : prev.filter((id) => id !== productId)
    );

    try {
      const base = (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:5000";
      const res = await fetch(`${base}/api/users/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });

      if (res.ok) {
        // Dispatch custom event to notify Navbar
        window.dispatchEvent(new Event("wishlistUpdate"));
      } else {
        throw new Error("Failed to toggle wishlist");
      }
    } catch (error) {
      console.debug("Error toggling wishlist:", error);
      // Revert state on failure
      setWishlist((prev) =>
        isAdding ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    }
  };

  const handleResetFilters = () => {
    setKeyword("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
    setIsAvailableOnly(false);
  };

  return (
    <div className="min-h-screen bg-brown-950 pb-16">
      {/* Hero Banner with Image */}
      <div className="relative h-[320px] md:h-[420px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a120c]/50 via-[#1a120c]/60 to-[#1a120c] z-10" />
        <img
          src="https://images.unsplash.com/photo-1573408301185-9519f94bf0cf?q=80&w=2940&auto=format&fit=crop"
          alt="Luxury jewellery collection"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gold-400 uppercase mb-4">
            Exclusive Rentals
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold-100 mb-4">
            Our Collections
          </h1>
          <div className="w-20 h-0.5 bg-gold-500 mb-5 mx-auto" />
          <p className="text-gold-200/80 max-w-2xl font-light text-sm md:text-base">
            Curated premium gold-plated jewellery with up to 6 months warranty on shine and color, along with designer bridal dresses.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Category image chips */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-10">
          {[
            { label: "All", img: "https://images.unsplash.com/photo-1573408301185-9519f94bf0cf?q=80&w=400" },
            { label: "Bridal Sets", img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=400" },
            { label: "Necklaces", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400" },
            { label: "Earrings & Bangles", img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=400" },
            { label: "Fancy Items", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400" },
            { label: "Rings", img: "https://images.unsplash.com/photo-1605100804763-247f6612644e?q=80&w=400" },
            { label: "Anklets", img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=400" },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategory(cat.label)}
              className={`flex flex-col items-center gap-2 group transition-all`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${category === cat.label ? "border-gold-400 shadow-[0_0_15px_rgba(200,146,51,0.5)]" : "border-gold-800/30 group-hover:border-gold-500/50"}`}>
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className={`text-[9px] md:text-[10px] uppercase tracking-wider font-semibold text-center leading-tight ${category === cat.label ? "text-gold-400" : "text-gold-500/70 group-hover:text-gold-400"}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Bridal Dresses link chip separately */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setCategory("Bridal Dresses")}
            className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 ${category === "Bridal Dresses" ? "border-gold-400 bg-gold-500/10 text-gold-400 shadow-[0_0_12px_rgba(200,146,51,0.3)]" : "border-gold-800/30 text-gold-500/70 hover:border-gold-500/50"}`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src="https://images.unsplash.com/photo-1594552072238-185671175bf9?q=80&w=200" alt="Bridal Dresses" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs uppercase tracking-widest font-semibold">Bridal Dresses</span>
          </button>
        </div>


        {/* Category Navigation Pills - hidden, replaced by image chips above */}
        {/* (kept in code for reference) */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-brown-900 border border-gold-800/30 rounded-xl p-6 h-fit sticky top-28 shadow-xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gold-800/20">
              <h2 className="font-serif text-lg text-gold-200 flex items-center gap-2">
                <Filter size={18} className="text-gold-500" />
                Refine Search
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-gold-500 hover:text-gold-300 text-xs flex items-center gap-1 transition-colors uppercase tracking-widest font-semibold"
                title="Reset All Filters"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="mb-6">
              <label className="block text-gold-300 text-xs uppercase tracking-wider mb-2 font-semibold">
                Search Pieces
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter keywords..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-brown-950 border border-gold-800/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gold-50 focus:outline-none focus:border-gold-500 transition-colors placeholder:text-gold-500/40"
                />
                <Search className="absolute left-3.5 top-3 text-gold-500/50" size={16} />
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-gold-300 text-xs uppercase tracking-wider mb-2 font-semibold">
                Price Per Day
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gold-500/60">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-brown-950 border border-gold-800/30 rounded-lg pl-6 pr-2 py-2 text-sm text-gold-50 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gold-500/60">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-brown-950 border border-gold-800/30 rounded-lg pl-6 pr-2 py-2 text-sm text-gold-50 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Sorting */}
            <div className="mb-6">
              <label className="block text-gold-300 text-xs uppercase tracking-wider mb-2 font-semibold">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-brown-950 border border-gold-800/30 rounded-lg px-3 py-2.5 text-sm text-gold-50 focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
              >
                <option value="featured">Featured / Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="availableOnly"
                checked={isAvailableOnly}
                onChange={(e) => setIsAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gold-800 bg-brown-950 text-gold-500 focus:ring-gold-500 focus:ring-offset-brown-900 cursor-pointer accent-gold-500"
              />
              <label
                htmlFor="availableOnly"
                className="text-gold-200 text-xs uppercase tracking-wider cursor-pointer font-semibold"
              >
                Available Only
              </label>
            </div>
          </div>

          {/* Product Listing Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-t-2 border-b-2 border-gold-500 rounded-full animate-spin"></div>
                <p className="text-gold-400 font-serif tracking-widest text-sm animate-pulse">
                  Unveiling luxury...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-brown-900 border border-gold-800/20 rounded-xl p-16 text-center shadow-lg">
                <HelpCircle className="mx-auto text-gold-500/30 mb-4" size={48} />
                <h3 className="font-serif text-2xl text-gold-200 mb-2">No Pieces Found</h3>
                <p className="text-gold-100/50 max-w-md mx-auto mb-6 text-sm">
                  We couldn't find any rentals matching your criteria. Try adjusting search queries, clearing price ranges, or choosing a different category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-gold-600 text-brown-950 px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product: any) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      key={product._id}
                      className="group relative bg-brown-900 rounded-xl overflow-hidden border border-gold-800/20 hover:border-gold-500/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all flex flex-col h-full"
                    >
                      {/* Image Frame */}
                      <div className="aspect-[4/5] overflow-hidden relative bg-brown-950">
                        <img
                          src={
                            product.images[0] ||
                            "https://images.unsplash.com/photo-1599643478524-fb66f72400ae?q=80&w=800"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643478524-fb66f72400ae?q=80&w=800";
                          }}
                        />

                        {/* Availability Overlay */}
                        {!product.isAvailable && (
                          <div className="absolute inset-0 bg-brown-950/80 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="border border-gold-500/50 text-gold-400 text-xs font-semibold px-3 py-1.5 uppercase tracking-widest rounded bg-brown-900/90">
                              Currently Booked
                            </span>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className="absolute top-4 right-4 p-2.5 bg-brown-950/60 backdrop-blur-md rounded-full text-gold-500 hover:text-white hover:bg-gold-500/20 transition-all z-10"
                          title="Save to Wishlist"
                        >
                          <Heart
                            className={`transition-transform duration-300 active:scale-125 ${
                              wishlist.includes(product._id)
                                ? "fill-gold-500 text-gold-500"
                                : ""
                            }`}
                            size={18}
                          />
                        </button>

                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-brown-950 via-brown-950/40 to-transparent p-4 flex flex-wrap gap-2 items-center">
                          <span className="text-[10px] font-semibold tracking-widest text-gold-400 uppercase bg-brown-950/90 px-2 py-1 rounded border border-gold-900/30">
                            {product.category}
                          </span>
                          {product.category !== "Bridal Dresses" && (
                            <span className="text-[9px] font-semibold tracking-widest text-green-400 uppercase bg-brown-950/90 px-2 py-1 rounded border border-green-900/30">
                              6-Mo Warranty
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Frame */}
                      <div className="p-5 flex flex-col flex-grow">
                        <Link href={`/collections/${product._id}`} className="group-hover:text-gold-400">
                          <h3 className="font-serif text-lg text-gold-100 hover:text-gold-400 transition-colors line-clamp-1 mb-1">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Ratings */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex text-gold-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < Math.round(product.rating || 4.5)
                                    ? "fill-gold-500"
                                    : "text-gold-900"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gold-200/50">
                            ({product.numReviews || 12})
                          </span>
                        </div>

                        {/* Price Details */}
                        <div className="mt-auto flex items-end justify-between border-t border-gold-800/10 pt-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gold-500/70 block">
                              Rental Price
                            </span>
                            <p className="text-gold-400 font-bold text-lg">
                              ₹{product.pricePerDay}{" "}
                              <span className="text-xs font-normal text-gold-200/50">
                                / day
                              </span>
                            </p>
                          </div>
                          <Link
                            href={`/collections/${product._id}`}
                            className="text-[10px] uppercase tracking-widest text-gold-300 hover:text-gold-100 border-b border-gold-800 hover:border-gold-300 transition-colors pb-0.5 font-semibold"
                          >
                            View Details &rarr;
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
