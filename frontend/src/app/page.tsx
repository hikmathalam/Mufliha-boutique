/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { ChevronRight, Star, Camera } from "lucide-react";
import Link from "next/link";
export default function Home() {

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  } as const;

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#1a120c] text-[#fbf8f1] font-sans selection:bg-[#c89233] selection:text-[#1a120c]">


      {/* Hero Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a120c]/60 via-[#1a120c]/40 to-[#1a120c] z-10" />
          <img 
            src="/luxury_hero_bg.png" 
            alt="Luxury Bridal Jewellery" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#ddbf7f] uppercase tracking-[0.3em] text-sm md:text-base mb-6"
          >
            The Epitome of Elegance
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ddbf7f] via-[#fbf8f1] to-[#b07628]"
          >
            Warranty Gold <br className="hidden md:block" /> Jewellery Rental
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-[#e8d8b1] max-w-2xl mx-auto mb-10 font-light"
          >
            Discover our curated collection of premium gold-plated jewellery with up to 6 months color warranty, alongside breathtaking bridal dresses.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/collections" className="bg-[#c89233] text-[#1a120c] px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-[#ddbf7f] transition-all flex items-center justify-center gap-2">
              Explore Warranty Jewellery <ChevronRight size={16} />
            </Link>
            <Link href="/collections?category=Bridal Dresses" className="border border-[#c89233] text-[#ddbf7f] px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-[#c89233]/10 transition-all">
              View Bridal Collection
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-[#ddbf7f] to-transparent"></div>
        </div>
      </section>

      {/* Jewellery Collections */}
      <section id="collections" className="py-24 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c89233]/5 via-[#1a120c] to-[#1a120c] -z-10" />
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-[#f5eedc]">Warranty Gold Jewellery</h2>
            <div className="w-24 h-px bg-[#c89233] mx-auto mb-6"></div>
            <p className="text-[#ddbf7f] max-w-2xl mx-auto">Adorn yourself with our premium collection of gold-plated masterpieces covered by up to 6 months color and shine warranty.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              { title: "Bridal Sets", img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787&auto=format&fit=crop", desc: "Complete 24k gold sets for the perfect bride." },
              { title: "Necklaces", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940&auto=format&fit=crop", desc: "Statement pieces that command attention." },
              { title: "Earrings & Bangles", img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2864&auto=format&fit=crop", desc: "Intricate details for elegant finishing touches." },
              { title: "Fancy Items", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940&auto=format&fit=crop", desc: "Unique and contemporary pieces for every occasion." },
              { title: "Rings", img: "https://images.unsplash.com/photo-1605100804763-247f6612644e?q=80&w=2940&auto=format&fit=crop", desc: "Exquisite rings symbolizing eternal luxury." },
              { title: "Anklets", img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2787&auto=format&fit=crop", desc: "Delicate craftsmanship for beautiful adornments." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="group relative overflow-hidden cursor-pointer bg-[#2d2116] rounded-sm"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a120c] via-transparent to-transparent flex flex-col justify-end p-8">
                  <h3 className="font-serif text-2xl text-[#fbf8f1] mb-2">{item.title}</h3>
                  <p className="text-[#ddbf7f] text-sm transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bridal Dresses */}
      <section id="bridal" className="py-24 px-6 bg-[#2d2116] border-y border-[#c89233]/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full border border-[#c89233]/10 opacity-50" />
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full border border-[#c89233]/10 opacity-50" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
              <div className="absolute inset-0 border-2 border-[#c89233] translate-x-4 translate-y-4 rounded-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1594552072238-185671175bf9?q=80&w=2787&auto=format&fit=crop" 
                alt="Bridal Dress" 
                className="relative z-10 w-full h-full object-cover rounded-sm shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-[#1a120c] p-6 border border-[#c89233]/30 z-20 shadow-xl hidden md:block">
                <p className="font-serif text-[#ddbf7f] text-xl italic">"Breathtaking elegance"</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <p className="text-[#ddbf7f] uppercase tracking-[0.2em] text-sm mb-4">Exclusive Rentals</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-[#f5eedc] leading-tight">
              Designer Bridal <br/> Collections
            </h2>
            <p className="text-[#e8d8b1] font-light mb-8 text-lg leading-relaxed">
              Step into your fairytale with our meticulously crafted bridal gowns. From heavily embellished traditional lehengas to elegant contemporary gowns, our rental service ensures you wear luxury without compromise.
            </p>
            
            <ul className="space-y-4 mb-10 text-[#ddbf7f]">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c89233]"></div>
                Premium Designer Wear
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c89233]"></div>
                Custom Fitting Services
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c89233]"></div>
                Dry Cleaning Included
              </li>
            </ul>
            
            <button className="bg-transparent border border-[#c89233] text-[#ddbf7f] px-8 py-4 uppercase tracking-widest text-sm hover:bg-[#c89233] hover:text-[#1a120c] transition-all">
              Discover Dresses
            </button>
          </motion.div>
        </div>

        {/* Wedding Dresses Grid */}
        <div className="max-w-7xl mx-auto mt-24 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h3 className="font-serif text-3xl md:text-4xl mb-4 text-[#f5eedc]">Featured Wedding Dresses</h3>
            <div className="w-16 h-px bg-[#c89233] mx-auto mb-6"></div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: "Classic A-Line", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2883&auto=format&fit=crop", desc: "Timeless elegance with intricate lace." },
              { title: "Regal Ballgown", img: "https://images.unsplash.com/photo-1596450514735-11003b87ed72?q=80&w=2787&auto=format&fit=crop", desc: "Make a grand entrance on your special day." },
              { title: "Modern Mermaid", img: "https://images.unsplash.com/photo-1628045952342-99882fa4b043?q=80&w=2800&auto=format&fit=crop", desc: "Sleek and sophisticated silhouette." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="group relative overflow-hidden cursor-pointer rounded-sm border border-[#c89233]/20"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#1a120c]">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a120c]/90 via-[#1a120c]/20 to-transparent flex flex-col justify-end p-6">
                  <h4 className="font-serif text-xl text-[#fbf8f1] mb-1">{item.title}</h4>
                  <p className="text-[#ddbf7f] text-xs transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeInUp} className="mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-[#f5eedc]">Client Diaries</h2>
            <div className="w-24 h-px bg-[#c89233] mx-auto mb-6"></div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { name: "Aisha R.", text: "Renting my bridal jewellery from Mufliha was the best decision. The set was pristine and absolutely breathtaking." },
              { name: "Sarah M.", text: "The dress collection is beyond words. I felt like a queen on my special day. Impeccable service and quality." },
              { name: "Fatima K.", text: "From the first fitting to the final day, the experience was seamless. The gold detailing on my lehenga was stunning." }
            ].map((t, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="bg-[#2d2116]/50 p-10 border border-[#c89233]/10 hover:border-[#c89233]/40 transition-colors relative"
              >
                <div className="flex justify-center gap-1 mb-6 text-[#c89233]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="font-serif text-[#e8d8b1] italic mb-6 leading-relaxed">"{t.text}"</p>
                <p className="text-[#ddbf7f] uppercase tracking-widest text-xs font-semibold">— {t.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-24 px-6 bg-[#2d2116] overflow-hidden">
        <div className="max-w-full mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12 flex flex-col items-center">
            <Camera size={32} className="text-[#c89233] mb-4" />
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-[#f5eedc]">Follow Our Journey</h2>
            <a href="#" className="text-[#ddbf7f] hover:text-[#fbf8f1] transition-colors border-b border-[#ddbf7f]">@muflihaboutique</a>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-8 snap-x hide-scrollbar">
            {[
              "https://images.unsplash.com/photo-1595341596012-07ebcc69910e?q=80&w=2800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2836&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1589312658865-68ff3789069d?q=80&w=2787&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2787&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1595341596012-07ebcc69910e?q=80&w=2800&auto=format&fit=crop"
            ].map((img, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex-none w-64 md:w-80 aspect-square snap-center relative group"
              >
                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1a120c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-[#fbf8f1]" size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </main>
  );
}
