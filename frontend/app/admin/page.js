'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Truck, Banknote, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Hardcode authorization for demo since role isn't actually in standard jwt for this mockup unless we set it
  // In real app: user?.role === 'admin'
  useEffect(() => {
    if (!loading) {
      // Mocking admin check - let's say if phone is '9800000000' they are admin
      if (user?.phone === '9800000000') {
        setIsAuthorized(true);
      } else {
        // Just let them in for demo purposes, normally redirect
        setIsAuthorized(true); 
      }
    }
  }, [user, loading, router]);

  const [bookings, setBookings] = useState([
    { id: 'KB1048', customer: 'Ram Bahadur', phone: '9812345678', city: 'Kathmandu', items: 'Electronics', status: 'Pending', date: '2024-10-25' },
    { id: 'KB1047', customer: 'Sita Thapa', phone: '9823456789', city: 'Lalitpur', items: 'Paper, Iron', status: 'Completed', date: '2024-10-24' },
    { id: 'KB1046', customer: 'Hari Lama', phone: '9834567890', city: 'Bhaktapur', items: 'Plastic', status: 'Cancelled', date: '2024-10-23' },
  ]);

  if (loading || !isAuthorized) return <div className="p-20 text-center">Loading admin panel...</div>;

  const filtered = bookings.filter(b => 
    (statusFilter === 'All' || b.status === statusFilter) &&
    (b.id.toLowerCase().includes(searchTerm.toLowerCase()) || b.customer.toLowerCase().includes(searchTerm.toLowerCase()) || b.phone.includes(searchTerm))
  );

  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? {...b, status: newStatus} : b));
    toast.success(`Booking ${id} marked as ${newStatus}`);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Customer', 'Phone', 'City', 'Items', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filtered.map(b => `"${b.id}","${b.customer}","${b.phone}","${b.city}","${b.items}","${b.status}","${b.date}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'kabadibhaiya_bookings.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-dark text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage bookings, users, and platform settings.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 space-y-6">
        
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Users className="w-6 h-6"/></div>
            <div><div className="text-sm text-gray-500 font-medium">Total Users</div><div className="text-2xl font-bold">1,245</div></div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Truck className="w-6 h-6"/></div>
            <div><div className="text-sm text-gray-500 font-medium">Pending Pickups</div><div className="text-2xl font-bold">18</div></div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Banknote className="w-6 h-6"/></div>
            <div><div className="text-sm text-gray-500 font-medium">Payouts (This Month)</div><div className="text-2xl font-bold">Rs 45,000</div></div>
          </div>
        </div>

        {/* Bookings Manager */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search ID, name, phone..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button onClick={exportCSV} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4"/> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 border-b">Booking ID</th>
                  <th className="p-4 border-b">Customer Details</th>
                  <th className="p-4 border-b">City & Items</th>
                  <th className="p-4 border-b">Status</th>
                  <th className="p-4 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{b.id}<br/><span className="text-xs text-gray-500 font-normal">{b.date}</span></td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{b.customer}</div>
                      <div className="text-sm text-gray-500">+977-{b.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {b.city} <br/><span className="text-xs text-gray-400 font-normal">{b.items}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.status==='Pending'?'bg-orange-100 text-orange-700':b.status==='Completed'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {b.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={()=>updateStatus(b.id, 'Completed')} className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-green-600 transition-colors">Done</button>
                          <button onClick={()=>updateStatus(b.id, 'Cancelled')} className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1.5 rounded hover:bg-red-100 transition-colors">Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
