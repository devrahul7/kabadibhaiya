'use client';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Recycle, Facebook, Instagram, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Recycle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">KabadiBhaiya</span>
            </div>
            <p className="text-gray-400 mb-6">{t('footer', 'tagline')}</p>
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <a href="tel:97426869215" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-accent" /> +977-97426869215
              </a>
              <a href="mailto:nepalikabadibhaiya@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-accent" /> nepalikabadibhaiya@gmail.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> Kathmandu, Lalitpur & Bhaktapur
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2 inline-block">{t('footer', 'quickLinks')}</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-gray-400 hover:text-primary transition-colors">{t('nav', 'home')}</Link></li>
              <li><Link href="/prices" className="text-gray-400 hover:text-primary transition-colors">{t('nav', 'prices')}</Link></li>
              <li><Link href="/schedule" className="text-gray-400 hover:text-primary transition-colors">{t('nav', 'schedule')}</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">{t('nav', 'blog')}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2 inline-block">{t('footer', 'followUs')}</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-pink-600 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-green-500 transition-colors"><MessageCircle className="h-5 w-5" /></a>
            </div>
            <div className="mt-8">
              <h4 className="text-sm font-semibold mb-2 text-gray-300">Working Hours</h4>
              <p className="text-gray-400 text-sm">{t('footer', 'workingHours')}</p>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2 inline-block">Payment Methods</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded px-3 py-2 text-center text-sm font-medium text-green-400">eSewa</div>
              <div className="bg-gray-800 rounded px-3 py-2 text-center text-sm font-medium text-purple-400">Khalti</div>
              <div className="bg-gray-800 rounded px-3 py-2 text-center text-sm font-medium text-red-400">IME Pay</div>
              <div className="bg-gray-800 rounded px-3 py-2 text-center text-sm font-medium text-primary">Cash</div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>{t('footer', 'copyright')}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
