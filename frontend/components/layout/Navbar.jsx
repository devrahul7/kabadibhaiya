'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { getAvatarUrl } from '@/lib/apiConfig';
import { Recycle, Menu, X, ChevronDown, User as UserIcon, LogOut, LayoutDashboard, Shield } from 'lucide-react';


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { lang, t } = useLang();
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md py-2.5 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md py-3.5 border-b border-gray-100'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        
        {/* 1. Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-xs">
            <Recycle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black text-primary tracking-tight block leading-tight">KabadiBhaiya</span>
            <span className="text-[10px] font-bold text-gray-400 block -mt-0.5 tracking-wider uppercase">
              {lang === 'np' ? 'कबाडी संकलन नेपाल' : 'Scrap Pickup Nepal'}
            </span>
          </div>
        </Link>

        {/* 2. Center: Navigation Links (Centered) */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full border border-gray-200/70 shadow-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-200/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* 3. Right: Language Switcher + User Profile / Login */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* Explicit English / Nepali Switcher */}
          <LanguageToggle />

          {user ? (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-primary/10 text-primary-dark pl-2 pr-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors border border-primary/20">
                {user.googlePicture ? (
                  <img src={user.googlePicture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : user.hasProfileImage ? (
                  <img src={getAvatarUrl(user.id || user._id, user.avatarVersion || 1)} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-primary/40" />
                ) : (

                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-sm max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-primary font-medium">@{user.username || 'user'}</p>
                    {user.phone && <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>}
                  </div>
                  <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard className="h-4 w-4 text-gray-400" /> {t('nav', 'dashboard')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-bold hover:bg-orange-50">
                      <Shield className="h-4 w-4 text-primary" /> Admin Control Center
                    </Link>
                  )}
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left">
                    <LogOut className="h-4 w-4" /> {t('nav', 'logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-primary-dark transition-all shadow-xs hover:shadow-md">
              {t('nav', 'login')}
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle />
          <button className="text-gray-700 p-1.5 rounded-lg border border-gray-200" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl flex flex-col p-4 border-t border-gray-100 animate-fade-in-up">
          <div className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-xl text-base font-bold transition-all ${
                  pathname === link.href ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="p-2 border-t border-gray-100">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-gray-100 text-gray-800 text-center py-2.5 rounded-xl font-bold text-sm">
                  {t('nav', 'dashboard')}
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="bg-orange-50 text-primary text-center py-2.5 rounded-xl font-bold text-sm border border-primary/20">
                    🛡️ Admin Control Center
                  </Link>
                )}
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="bg-red-50 text-red-600 text-center py-2.5 rounded-xl font-bold text-sm">
                  {t('nav', 'logout')}
                </button>
              </div>

            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block bg-primary text-white text-center py-2.5 rounded-xl font-bold text-sm shadow-md">
                {t('nav', 'login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );

}
