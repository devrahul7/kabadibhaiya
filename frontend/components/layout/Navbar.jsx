'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { Recycle, Menu, X, ChevronDown, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { t } = useLang();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav', 'home') },
    { href: '/prices', label: t('nav', 'prices') },
    { href: '/schedule', label: t('nav', 'schedule') },
    { href: '/blog', label: t('nav', 'blog') },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-4'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Recycle className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">KabadiBhaiya</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-gray-700'}`}>
              {link.label}
            </Link>
          ))}
          
          <LanguageToggle />

          {user ? (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-primary-light text-primary-dark px-3 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <span className="font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard className="h-4 w-4" /> {t('nav', 'dashboard')}
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left">
                    <LogOut className="h-4 w-4" /> {t('nav', 'logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors">
              {t('nav', 'login')}
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl flex flex-col p-4 border-t border-gray-100">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-4 border-b border-gray-50 text-lg ${pathname === link.href ? 'text-primary font-medium' : 'text-gray-700'}`}>
              {link.label}
            </Link>
          ))}
          
          <div className="py-4 px-4 flex items-center justify-between">
            <span className="text-gray-700 font-medium">Language</span>
            <LanguageToggle />
          </div>

          <div className="p-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-gray-100 text-gray-800 text-center py-3 rounded-xl font-medium">
                  {t('nav', 'dashboard')}
                </Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="bg-red-100 text-red-600 text-center py-3 rounded-xl font-medium">
                  {t('nav', 'logout')}
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block bg-primary text-white text-center py-3 rounded-xl font-medium">
                {t('nav', 'login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
