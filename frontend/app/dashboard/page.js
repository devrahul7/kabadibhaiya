'use client';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { CalendarList, Banknote, Award, ArrowRight, Truck } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { t } = useLang();

  // Mock data
  const stats = { totalPickups: 3, totalEarnings: 1450, points: 80, nextPickup: 'Oct 25, 2024' };
  const recentBookings = [
    { id: 'KB1042', date: '2024-10-15', items: 'Paper, Iron', status: 'Completed', amount: 450 },
    { id: 'KB1048', date: '2024-10-25', items: 'Electronics', status: 'Pending', amount: null }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Namaste, {user?.name?.split(' ')[0]}! 🙏</h1>
          <p className="text-gray-500">Ready to recycle today and earn rewards?</p>
        </div>
        <Link href="/schedule" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap">
          <Truck className="w-5 h-5"/> Schedule New Pickup
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">{t('dashboard', 'totalPickups')}</div>
          <div className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarList className="text-blue-500 w-6 h-6"/> {stats.totalPickups}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">{t('dashboard', 'totalEarnings')}</div>
          <div className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Banknote className="text-green-500 w-6 h-6"/> Rs {stats.totalEarnings}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">{t('dashboard', 'loyaltyPoints')}</div>
          <div className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-yellow-500 w-6 h-6"/> {stats.points}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">{t('dashboard', 'upcoming')}</div>
          <div className="text-lg font-bold text-gray-800 mt-1">{stats.nextPickup}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-gray-800">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="text-primary text-sm font-semibold hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <div className="font-bold text-gray-800 mb-1">{b.id}</div>
                  <div className="text-sm text-gray-500">{b.date} &bull; {b.items}</div>
                </div>
                <div className="text-right">
                  {b.status === 'Completed' ? (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded mb-1 inline-block">Completed</span>
                  ) : (
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded mb-1 inline-block">Pending</span>
                  )}
                  {b.amount && <div className="font-bold text-gray-800 mt-1">+ Rs {b.amount}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#c89b7b] to-[#a07452] rounded-3xl p-6 shadow-sm text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <h2 className="font-bold text-lg mb-6 opacity-90">Loyalty Tier</h2>
          
          <div className="text-center mb-6">
            <Award className="w-16 h-16 mx-auto mb-2 opacity-90" />
            <div className="text-3xl font-bold tracking-wider">BRONZE</div>
            <div className="text-sm opacity-80 mt-1">{stats.points} Points</div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs font-medium opacity-80 mb-2">
              <span>Bronze</span>
              <span>Silver (100)</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{width: `${(stats.points/100)*100}%`}}></div>
            </div>
            <p className="text-xs mt-3 opacity-90 text-center">Only {100 - stats.points} points to Silver! 🥈</p>
          </div>
          
          <Link href="/dashboard/loyalty" className="mt-6 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-medium transition-colors text-sm w-full">
            View Benefits <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>
    </div>
  );
}
