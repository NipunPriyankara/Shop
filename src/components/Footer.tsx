'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Instagram, Facebook, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-charcoal-dark border-t border-white/5 mt-20 relative overflow-hidden">
      
      {/* Subtle bottom glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          
          {/* Brand & Socials */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <Link href="/" className="flex items-center gap-2.5 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-none bg-white flex items-center justify-center relative overflow-hidden">
                {settings.logoUrl ? (
                  <Image src={settings.logoUrl} alt={settings.storeName} fill className="object-cover" />
                ) : (
                  <Sparkles className="w-4 h-4 text-charcoal-dark" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold tracking-widest uppercase text-white font-sans">{settings.storeName}</span>
                <span className="text-[9px] text-[#eae2d5]/60 uppercase tracking-[0.2em] -mt-1 font-semibold">Skincare Luxury</span>
              </div>
            </Link>
            
            <p className="text-[#eae2d5]/70 text-xs sm:text-sm leading-relaxed max-w-sm">
              Authentic international skincare formulations imported directly to Sri Lanka. Bringing dermatologist-approved routines straight to your vanity. 🌿
            </p>
            
            <div className="flex gap-2 justify-center md:justify-start">
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center text-[#eae2d5]/80 hover:text-rose-gold hover:border-rose-gold/60 transition-colors duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center text-[#eae2d5]/80 hover:text-rose-gold hover:border-rose-gold/60 transition-colors duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 w-full text-center md:text-left">Shop Categories</h4>
            <ul className="space-y-3.5">
              {['Serums', 'Moisturizers', 'Cleansers', 'Sunscreens', 'Masks', 'Exfoliants'].map((item) => (
                <li key={item}>
                  <Link href={`/shop?category=${item}`} className="text-[#eae2d5]/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 w-full text-center md:text-left">Customer Care</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'About Our Journey', href: '/about' },
                { label: 'Shipping & Delivery Info', href: '/shipping' },
                { label: 'Returns & Refund Policy', href: '/returns' },
                { label: 'Privacy & Terms of Service', href: '/privacy' },
                { label: 'Frequently Asked Questions', href: '/faq' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#eae2d5]/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Hours */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 w-full text-center md:text-left">Get In Touch</h4>
            <ul className="space-y-3.5 mb-6 flex flex-col items-center md:items-start">
              <li className="flex items-center gap-3 text-[#eae2d5]/80 text-sm">
                <Phone className="w-4 h-4 text-rose-gold" />
                <span className="font-semibold text-xs">{settings.storePhone}</span>
              </li>
              <li className="flex items-center gap-3 text-[#eae2d5]/80 text-sm">
                <Mail className="w-4 h-4 text-rose-gold" />
                <span className="font-semibold text-xs">{settings.storeEmail}</span>
              </li>
            </ul>
            <div className="p-4 bg-white/5 border border-white/10 rounded-none w-full max-w-xs text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-xs text-[#eae2d5]/60 font-semibold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-rose-gold" />
                <span>Business Hours</span>
              </div>
              <p className="text-xs text-white font-bold uppercase tracking-wider">Mon – Sat: 9:00 AM – 6:00 PM</p>
              <p className="text-[10px] text-rose-gold/80 uppercase tracking-widest font-bold mt-1">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[#eae2d5]/50 text-xs font-semibold uppercase tracking-widest">© 2026 {settings.storeName}. Authenticity Guaranteed.</p>
          <p className="text-[#eae2d5]/50 text-xs font-semibold uppercase tracking-wider">
            🇱🇰 Colombo, Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
