'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { Loader2, CalendarDays, RefreshCw } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data?.success) {
        setBookings(res.data.bookings || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Live status and history of your scheduled pickups.</p>
        </div>
        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Ref #</th>
              <th className="p-4 font-semibold">Date & Time</th>
              <th className="p-4 font-semibold">Items</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                  <span className="text-sm font-medium">Loading your bookings...</span>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-500">
                  <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-base font-bold text-gray-800">No scheduled pickups yet</p>
                  <p className="text-xs text-gray-400 mt-1">Book a doorstep scrap pickup to get started!</p>
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id || b.bookingRef} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-bold text-primary text-sm">{b.bookingRef || b._id?.slice(-6)}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 text-sm">
                      {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{b.timeSlot}</div>
                  </td>
                  <td className="p-4 text-xs text-gray-700">
                    <div className="font-medium max-w-xs truncate">{Array.isArray(b.items) ? b.items.join(', ') : b.items}</div>
                    <span className="text-[11px] text-gray-400">{b.city} • {b.address}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        b.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : b.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-700'
                          : b.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

