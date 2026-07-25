import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-brown-950 pt-20 pb-10 border-t border-gold-500/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/logo.jpg"
              alt="Mufliha Boutique Logo"
              className="h-14 w-14 rounded-full object-cover border border-gold-500/30"
            />
            <h3 className="font-serif text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">
              Mufliha Boutique
            </h3>
          </div>
          <p className="text-gold-200/70 font-light max-w-sm leading-relaxed mb-8">
            Elevating your special moments with unparalleled luxury in jewellery and bridal wear rentals. Where elegance meets tradition.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-xl text-gold-100 mb-6">Explore</h4>
          <ul className="space-y-3 text-gold-300/80 font-light text-sm">
            <li>
              <Link href="/collections" className="hover:text-gold-100 transition-colors">
                Jewellery Collection
              </Link>
            </li>
            <li>
              <Link href="/collections?category=Bridal Dresses" className="hover:text-gold-100 transition-colors">
                Bridal Collection
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-gold-100 transition-colors">
                How it Works
              </Link>
            </li>
            <li>
              <Link href="/#terms" className="hover:text-gold-100 transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl text-gold-100 mb-6">Visit Us</h4>
          <ul className="space-y-4 text-gold-300/80 font-light text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="shrink-0 mt-1 text-gold-500" />
              <span>123 Luxury Avenue, Golden District, Style City, 10023</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="shrink-0 text-gold-500" />
              <a
                href="https://wa.me/917625046891"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-100 transition-colors"
              >
                +91 76250 46891
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="shrink-0 text-gold-500" />
              <span>concierge@mufliha.com</span>
            </li>
          </ul>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/917625046891?text=Hello%20Mufliha%20Boutique!%20I%20have%20a%20query%20about%20your%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-green-700/20 border border-green-600/40 text-green-400 hover:bg-green-700/30 hover:text-green-300 transition-colors px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-gold-500/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gold-700">
        <p>&copy; {new Date().getFullYear()} Mufliha Boutique. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/#privacy" className="hover:text-gold-500 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/#terms" className="hover:text-gold-500 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
