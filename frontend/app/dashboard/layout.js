'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { LayoutDashboard, CalendarList, Banknote, Award, User, LogOut, Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLang();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  const navItems = [
    { href: '/dashboard', label: t('dashboard', 'overview'), icon: LayoutDashboard },
    { href: '/dashboard/bookings', label: t('dashboard', 'myBookings'), icon: CalendarList },
    // { href: '/dashboard/earnings', label: t('dashboard', 'earnings'), icon: Banknote },
    { href: '/dashboard/loyalty', label: t('dashboard', 'loyalty'), icon: Award },
    { href: '/dashboard/profile', label: t('dashboard', 'profile'), icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-primary-light text-primary flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 line-clamp-1">{user.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded w-fit mt-1 border border-yellow-200">
                    <Award className="w-3 h-3"/> Bronze Member
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}>
                      <Icon className="w-5 h-5" /> {item.label}
                    </Link>
                  );
                })}
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 text-left mt-8 transition-colors">
                  <LogOut className="w-5 h-5" /> {t('nav', 'logout')}
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 z-50 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
