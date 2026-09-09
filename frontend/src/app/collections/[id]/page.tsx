"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Check, Shield, AlertCircle, Heart, Star, Calendar, ArrowRight, X, Clock, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE from "@/lib/api";

// ✅ Configure your WhatsApp number here (country code + number, no spaces or +)
const WHATSAPP_NUMBER = "917625046891"; // Mufliha Boutique WhatsApp

/** Opens WhatsApp with a pre-filled booking enquiry message */
function openWhatsAppBooking({
  productName,
  startDate,
  endDate,
  rentalDays,
  rentalCost,
  securityDeposit,
  userName,
}: {
  productName: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  rentalCost: number;
  securityDeposit: number;
  userName: string;
}) {
  const total = rentalCost + securityDeposit;
  const message = [
    `🌟 *Rental Booking Enquiry – Mufliha Boutique*`,
    ``,
    `Hello! I'd like to book the following item:`,
    ``,
    `👗 *Item:* ${productName}`,
    `📅 *From:* ${new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
    `📅 *To:* ${new Date(endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
    `🗓️ *Duration:* ${rentalDays} day${rentalDays > 1 ? "s" : ""}`,
    `💰 *Rental Cost:* ₹${rentalCost}`,
    `🔒 *Security Deposit:* ₹${securityDeposit} (refundable)`,
    `✨ *Total Amount:* ₹${total}`,
    ``,
    `👤 *Name:* ${userName}`,
    ``,
    `Please confirm availability and share payment details. Thank you! 🙏`,
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  // Gallery State
  const [activeImage, setActiveImage] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Calculator State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rentalDays, setRentalDays] = useState(0);
  const [rentalCost, setRentalCost] = useState(0);
  const [calcError, setCalcError] = useState("");

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [fittingNotes, setFittingNotes] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [bookingError, setBookingError] = useState("");

  // Availability Check State
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [conflictingDates, setConflictingDates] = useState<{ startDate: string; endDate: string } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProduct(data);

        // Setup gallery images
        const imgs = Array.isArray(data.images) && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1599643478524-fb66f72400ae"];
        setActiveImage(imgs[0]);
        if (imgs.length > 1) {
          setGalleryImages(imgs);
        } else if (imgs[0].includes("unsplash.com")) {
          setGalleryImages([
            imgs[0],
            `${imgs[0]}&fit=crop&w=800&h=1000&q=80`,
            `${imgs[0]}&fit=crop&fp-z=2&w=800&h=1000&q=80&crop=faces,entropy`
          ]);
        } else {
          setGalleryImages(imgs);
        }
      } catch (error) {
        console.debug("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/api/users/wishlist`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setWishlist(data.map((item: any) => item._id));
        }
      } catch (error) {
        console.debug(error);
      }
    };

    fetchProduct();
    fetchWishlist();
  }, [id, user]);

  // Handle Date Range calculations
  useEffect(() => {
    if (!startDate || !endDate) {
      setRentalDays(0);
      setRentalCost(0);
      setCalcError("");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setCalcError("Start date cannot be in the past.");
      setRentalDays(0);
      return;
    }

    if (end < start) {
      setCalcError("End date must be on or after the start date.");
      setRentalDays(0);
      return;
    }

    setCalcError("");
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start day
    setRentalDays(diffDays);
    if (product) {
      setRentalCost(diffDays * product.pricePerDay);
    }
  }, [startDate, endDate, product]);

  // Check availability when dates change
  useEffect(() => {
    if (!startDate || !endDate || rentalDays <= 0 || calcError) {
      setAvailabilityStatus(null);
      setConflictingDates(null);
      return;
    }

    const checkAvailability = async () => {
      setIsCheckingAvailability(true);
      setAvailabilityStatus(null);
      setConflictingDates(null);
      try {
        const res = await fetch(
          `${API_BASE}/api/bookings/check?productId=${id}&startDate=${startDate}&endDate=${endDate}`
        );
        const data = await res.json();
        setAvailabilityStatus(data.available);
        if (!data.available && data.conflictingBooking) {
          setConflictingDates(data.conflictingBooking);
        }
      } catch (error) {
        console.debug("Availability check failed:", error);
        setAvailabilityStatus(null);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [startDate, endDate, id, rentalDays, calcError]);

  const toggleWishlist = async () => {
    if (!user) {
      alert("Please sign in to add items to your wishlist.");
      return;
    }

    const isAdding = !wishlist.includes(id as string);
    setWishlist(prev => isAdding ? [...prev, id as string] : prev.filter(i => i !== id));

    try {
      const res = await fetch(`${API_BASE}/api/users/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
        credentials: "include",
      });

      if (res.ok) {
        window.dispatchEvent(new Event("wishlistUpdate"));
      } else {
        throw new Error("Failed to toggle wishlist");
      }
    } catch (error) {
      console.debug(error);
      setWishlist(prev => isAdding ? prev.filter(i => i !== id) : [...prev, id as string]);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to complete your booking.");
      return;
    }
    if (!startDate || !endDate || rentalDays <= 0) {
      alert("Please select valid dates.");
      return;
    }

    setIsSubmittingBooking(true);
    setBookingError("");

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          startDate,
          endDate,
          phone: customerPhone,
          notes: fittingNotes
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setBookingResult(data);
      setBookingSuccess(true);
    } catch (error: any) {
      setBookingError(error.message);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setBookingSuccess(false);
    setBookingResult(null);
    setBookingError("");
    setCustomerPhone("");
    setFittingNotes("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-t-2 border-b-2 border-gold-500 rounded-full animate-spin"></div>
        <p className="text-gold-400 font-serif tracking-widest text-sm animate-pulse">Loading piece details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brown-950 flex flex-col items-center justify-center text-gold-400">
        <AlertCircle size={48} className="mb-4 text-gold-500" />
        <h2 className="text-2xl font-serif mb-2">Product Not Found</h2>
        <Link href="/collections" className="text-gold-300 hover:underline">&larr; Back to Collections</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-950 pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb link */}
        <Link
          href="/collections"
          className="text-gold-500 hover:text-gold-300 text-xs font-semibold uppercase tracking-widest mb-8 inline-flex items-center gap-2 transition-colors"
        >
          &larr; Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Images Gallery Panel */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/5] bg-brown-900 rounded-xl overflow-hidden border border-gold-800/30 shadow-2xl relative">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800";
                }}
              />
              {!product.isAvailable && (
                <div className="absolute top-4 left-4 bg-brown-950/80 backdrop-blur-sm border border-gold-800/30 text-gold-400 px-3 py-1 rounded text-xs uppercase tracking-widest font-semibold">
                  Currently Booked
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-24 h-24 rounded-lg overflow-hidden bg-brown-900 border transition-all duration-300 ${
                      activeImage === imgUrl ? "border-gold-500 scale-105 shadow-lg" : "border-gold-800/30 hover:border-gold-500/50"
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=200"; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Interactive Calculator Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Product Category & Ratings */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase bg-gold-950/40 border border-gold-900/30 px-3 py-1 rounded">
                    {product.category}
                  </span>
                  {product.category !== "Bridal Dresses" && (
                    <span className="text-xs font-semibold tracking-widest text-green-400 uppercase bg-brown-900 border border-green-800/30 px-3 py-1 rounded">
                      6 Months Warranty
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.round(product.rating || 4.5) ? "fill-gold-500" : "text-gold-900"} />
                    ))}
                  </div>
                  <span className="text-xs text-gold-200/50">({product.numReviews || 12} reviews)</span>
                </div>
              </div>

              {/* Title & Price per Day */}
              <h1 className="text-4xl lg:text-5xl font-serif text-gold-100 mb-6 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-3 mb-8 pb-6 border-b border-gold-800/20">
                <span className="text-3xl font-serif font-bold text-gold-400">₹{product.pricePerDay}</span>
                <span className="text-gold-200/50 mb-1 text-sm uppercase tracking-widest">/ Day Rental</span>
              </div>

              {/* Description */}
              <p className="text-gold-100/80 leading-relaxed mb-8 font-light text-sm md:text-base">
                {product.description}
              </p>

              {/* Product Specifications / Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-gold-200 font-serif text-lg mb-3">Highlights</h3>
                  <ul className="grid grid-cols-2 gap-3 text-gold-100/70 text-xs">
                    {product.features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={14} className="text-gold-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Security Deposit Details */}
              <div className="bg-brown-900/50 p-6 rounded-xl border border-gold-800/20 mb-8 space-y-4 shadow-inner">
                <div className="flex items-start gap-3 text-gold-200">
                  <Shield className="text-gold-500 shrink-0 mt-0.5" size={18} />
                  <div className="text-sm">
                    <p className="font-semibold text-gold-100">Refundable Security Deposit</p>
                    <p className="text-gold-200/60 mt-0.5">A security deposit of <strong>₹{product.securityDeposit}</strong> is required and fully refunded upon return.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gold-200 border-t border-gold-800/10 pt-4">
                  <Clock className="text-gold-500 shrink-0 mt-0.5" size={18} />
                  <div className="text-sm">
                    <p className="font-semibold text-gold-100">Care Guarantee</p>
                    <p className="text-gold-200/60 mt-0.5">Our team sterilizes and polishes each piece to brand-new condition prior to delivery.</p>
                  </div>
                </div>
                {product.category !== "Bridal Dresses" && (
                  <div className="flex items-start gap-3 text-gold-200 border-t border-gold-800/10 pt-4">
                    <Shield className="text-green-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-sm">
                      <p className="font-semibold text-gold-100">6 Months Gold-Plating Warranty</p>
                      <p className="text-gold-200/60 mt-0.5">This jewellery features advanced multi-layer gold forming. Comes with a 6-month replacement/polishing warranty against color fading or tarnishing.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Rental Date Calculator Section */}
              <div className="border border-gold-800/30 bg-brown-900 rounded-xl p-6 mb-8 shadow-md">
                <h3 className="text-gold-200 font-serif text-lg mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-gold-500" />
                  Estimate Rental
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gold-400 mb-1.5 font-semibold">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-brown-950 border border-gold-800/30 rounded-lg p-2.5 text-xs text-gold-50 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gold-400 mb-1.5 font-semibold">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-brown-950 border border-gold-800/30 rounded-lg p-2.5 text-xs text-gold-50 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                {calcError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mt-2 bg-red-950/20 p-2.5 border border-red-900/30 rounded-lg">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{calcError}</span>
                  </div>
                )}

                {/* Calculator Price Breakdown */}
                {rentalDays > 0 && !calcError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 border-t border-gold-800/20 pt-4 space-y-2 text-sm text-gold-200"
                  >
                    <div className="flex justify-between">
                      <span>Rental Duration:</span>
                      <span className="font-semibold text-gold-100">{rentalDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Rental Fee:</span>
                      <span>₹{product.pricePerDay} / day</span>
                    </div>
                    <div className="flex justify-between text-gold-100">
                      <span>Estimated Rental Cost:</span>
                      <span>₹{rentalCost}</span>
                    </div>
                    <div className="flex justify-between text-gold-100 pb-2 border-b border-gold-800/10">
                      <span>Refundable Security Deposit:</span>
                      <span>₹{product.securityDeposit}</span>
                    </div>
                    <div className="flex justify-between text-gold-400 font-bold pt-2 text-base">
                      <span>Total Amount:</span>
                      <span>₹{rentalCost + product.securityDeposit}</span>
                    </div>
                  </motion.div>
                )}

                {/* Availability Status */}
                {rentalDays > 0 && !calcError && (
                  <div className="mt-4">
                    {isCheckingAvailability ? (
                      <div className="flex items-center gap-2 text-gold-400 text-xs bg-gold-950/20 p-2.5 border border-gold-900/30 rounded-lg">
                        <div className="w-3 h-3 border-t-2 border-gold-500 rounded-full animate-spin" />
                        <span>Checking availability...</span>
                      </div>
                    ) : availabilityStatus === true ? (
                      <div className="flex items-center gap-2 text-green-400 text-xs bg-green-950/20 p-2.5 border border-green-900/30 rounded-lg">
                        <Check size={14} className="shrink-0" />
                        <span>Available for your selected dates</span>
                      </div>
                    ) : availabilityStatus === false && conflictingDates ? (
                      <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/20 p-2.5 border border-red-900/30 rounded-lg">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>Booked from {new Date(conflictingDates.startDate).toLocaleDateString()} to {new Date(conflictingDates.endDate).toLocaleDateString()}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Book Rental and Wishlist Actions */}
            <div className="flex gap-4 mt-6">
              <button
                disabled={!product.isAvailable || rentalDays <= 0 || !!calcError || isCheckingAvailability || availabilityStatus === false}
                onClick={() => {
                  if (!user) {
                    router.push('/login');
                    return;
                  }
                  // Redirect to WhatsApp with pre-filled booking message
                  openWhatsAppBooking({
                    productName: product.name,
                    startDate,
                    endDate,
                    rentalDays,
                    rentalCost,
                    securityDeposit: product.securityDeposit,
                    userName: user.name,
                  });
                }}
                className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 text-brown-950 font-bold uppercase tracking-widest py-4 rounded-lg hover:opacity-95 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs"
              >
                {!product.isAvailable ? (
                  "Currently Unavailable"
                ) : isCheckingAvailability ? (
                  "Checking Availability..."
                ) : rentalDays <= 0 ? (
                  "Select Dates to Book"
                ) : availabilityStatus === false ? (
                  "Unavailable for These Dates"
                ) : !user ? (
                  "Sign In to Book"
                ) : (
                  <>
                    <MessageCircle size={16} />
                    Book via WhatsApp
                  </>
                )}
                {rentalDays <= 0 && <ArrowRight size={16} />}
              </button>
              <button
                onClick={toggleWishlist}
                className="w-14 flex items-center justify-center border border-gold-600/50 text-gold-500 rounded-lg hover:bg-gold-500/10 hover:text-gold-400 transition-colors"
                title="Toggle Wishlist"
              >
                <Heart className={wishlist.includes(id as string) ? "fill-gold-500 text-gold-500" : ""} size={22} />
              </button>
            </div>

            {/* WhatsApp Quick CTA — always visible */}
            {rentalDays > 0 && !calcError && availabilityStatus === true && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-xs text-green-400 bg-green-950/20 border border-green-900/30 rounded-lg px-4 py-2.5"
              >
                <MessageCircle size={14} className="shrink-0" />
                <span>Tap <strong>Book via WhatsApp</strong> — we'll confirm within minutes!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Drawer/Modal */}
      <AnimatePresence>
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeBookingModal}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-brown-900 border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={closeBookingModal}
                className="absolute top-4 right-4 p-1.5 text-gold-500/50 hover:text-gold-400 transition-colors"
              >
                <X size={20} />
              </button>

              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="p-6 md:p-8">
                  <h3 className="font-serif text-2xl text-gold-400 mb-2">Book Appointment</h3>
                  <p className="text-xs text-gold-200/50 mb-6 uppercase tracking-wider">
                    Rent request for {product.name}
                  </p>

                  <div className="bg-brown-950 rounded-xl p-4 border border-gold-800/20 mb-6 text-sm text-gold-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gold-400">Dates:</span>
                      <span className="font-semibold">{startDate} to {endDate} ({rentalDays} days)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-400">Total Price:</span>
                      <span className="font-semibold font-serif text-gold-500">₹{rentalCost + product.securityDeposit}</span>
                    </div>
                    <p className="text-[10px] text-gold-200/40 pt-2 border-t border-gold-800/10 italic">
                      Includes refundable security deposit of ₹{product.securityDeposit}.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gold-300 text-xs uppercase tracking-wider mb-2 font-semibold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user?.name || ""}
                        disabled
                        className="w-full bg-brown-950/60 border border-gold-800/20 rounded-lg p-3 text-sm text-gold-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gold-300 text-xs uppercase tracking-wider mb-2 font-semibold">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-brown-950 border border-gold-800/30 rounded-lg p-3 text-sm text-gold-50 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gold-300 text-xs uppercase tracking-wider mb-2 font-semibold">
                        Custom Fitting & Stylist Notes
                      </label>
                      <textarea
                        rows={3}
                        value={fittingNotes}
                        onChange={(e) => setFittingNotes(e.target.value)}
                        placeholder="Provide details such as Ring/Dress sizes, preferred fitting time at showroom, or special styling requests..."
                        className="w-full bg-brown-950 border border-gold-800/30 rounded-lg p-3 text-sm text-gold-50 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  {bookingError && (
                    <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/20 p-3 border border-red-900/30 rounded-lg mt-6">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-brown-950 font-bold uppercase tracking-widest py-3.5 rounded-lg hover:opacity-90 transition-opacity mt-4 disabled:opacity-50 text-xs"
                  >
                    {isSubmittingBooking ? "Processing Request..." : "Confirm Rental Request"}
                  </button>
                </form>
              ) : bookingResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 flex flex-col items-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center text-green-500 mb-4">
                    <Check size={32} />
                  </div>
                  <h3 className="font-serif text-2xl text-gold-100 mb-2">Booking Confirmed!</h3>
                  <p className="text-gold-400 text-xs uppercase tracking-widest mb-6">Booking #{bookingResult._id.slice(-8).toUpperCase()}</p>

                  <div className="w-full bg-brown-950 rounded-xl border border-gold-800/20 p-4 text-sm text-gold-200 space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gold-400">Piece:</span>
                      <span className="font-semibold text-gold-100">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-400">Dates:</span>
                      <span className="font-semibold">{new Date(bookingResult.startDate).toLocaleDateString()} — {new Date(bookingResult.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-400">Duration:</span>
                      <span className="font-semibold">{rentalDays} days</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gold-800/10">
                      <span className="text-gold-400">Total Charged:</span>
                      <span className="font-bold font-serif text-gold-500">₹{bookingResult.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-400">Status:</span>
                      <span className="text-green-400 font-semibold uppercase text-xs">{bookingResult.status}</span>
                    </div>
                  </div>

                  <p className="text-gold-200/50 text-xs text-center max-w-xs leading-relaxed mb-6">
                    Our concierge will contact you at <strong className="text-gold-200">{customerPhone}</strong> within 24 hours to schedule your private fitting.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={closeBookingModal}
                      className="flex-1 bg-gold-600 text-brown-950 py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
                    >
                      Continue Browsing
                    </button>
                    <button
                      onClick={() => { closeBookingModal(); router.push('/dashboard'); }}
                      className="flex-1 border border-gold-600/50 text-gold-400 py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-gold-500/10 transition-colors"
                    >
                      View My Bookings
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
