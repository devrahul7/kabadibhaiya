'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  // Mock data
  const [bookings, setBookings] = useState([
    { id: 'KB1048', date: '2024-10-25', time: '09:00-11:00', items: 'Electronics, Plastic', city: 'Kathmandu', status: 'Pending' },
    { id: 'KB1042', date: '2024-10-15', time: '13:00-15:00', items: 'Paper, Iron', city: 'Lalitpur', status: 'Completed', amount: 450 },
    { id: 'KB1030', date: '2024-09-02', time: '11:00-13:00', items: 'Glass, Cardboard', city: 'Kathmandu', status: 'Cancelled' },
  ]);

  const handleCancel = (id) => {
    if(confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(b => b.id === id ? {...b, status: 'Cancelled'} : b));
      toast.success('Booking cancelled');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">History of all your scheduled pickups.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">Ref #</th>
              <th className="p-4 font-semibold">Date & Time</th>
              <th className="p-4 font-semibold">Items</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No bookings found.</td></tr>
            ) : (
              bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-primary">{b.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{b.date}</div>
                    <div className="text-xs text-gray-500">{b.time}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{b.items} <br/><span className="text-xs text-gray-400">{b.city}</span></td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.status==='Pending'?'bg-orange-100 text-orange-700':b.status==='Completed'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                      {b.status}
                    </span>
                    {b.amount && <div className="text-xs font-bold text-gray-800 mt-1 pl-1">+ Rs {b.amount}</div>}
                  </td>
                  <td className="p-4 text-right">
                    {b.status === 'Pending' && (
                      <button onClick={()=>handleCancel(b.id)} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors">
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
