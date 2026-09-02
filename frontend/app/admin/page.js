'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Truck, Banknote, Search, Download, Plus, Edit2, Trash2,
  Upload, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
  ArrowRight, RefreshCw, X, Shield, Lock
} from 'lucide-react';
import api from '@/lib/axios';
import { getPriceImageUrl } from '@/lib/apiConfig';
import toast from 'react-hot-toast';


export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Active section tab
  const [activeTab, setActiveTab] = useState('prices'); // 'prices' | 'bookings' | 'users'

  // ─── Price Management State ───────────────────────────────────────────────────
  const [prices, setPrices] = useState([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [searchPrice, setSearchPrice] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals for editing / creating price items
  const [editModalItem, setEditModalItem] = useState(null); // item object being edited
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form state for creating / editing
  const [formData, setFormData] = useState({
    name: '',
    nameNp: '',
    category: 'metal',
    price: '',
    unit: 'kg',
    trend: 'stable',
    emoji: '📦',
    notes: '',
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // ─── Bookings State ──────────────────────────────────────────────────────────
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [searchBooking, setSearchBooking] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // ─── Users State ─────────────────────────────────────────────────────────────
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // ─── Fetch Prices ────────────────────────────────────────────────────────────
  const fetchPrices = async () => {
    setPricesLoading(true);
    try {
      const res = await api.get('/prices');
      setPrices(res.data.items || []);
    } catch (err) {
      toast.error('Failed to load prices');
    } finally {
      setPricesLoading(false);
    }
  };

  // ─── Fetch Bookings ──────────────────────────────────────────────────────────
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      // Fallback to sample bookings if none seeded
      setBookings([
        { id: 'KB1048', customer: 'Ram Bahadur', phone: '9812345678', city: 'Kathmandu', items: 'Electronics', status: 'Pending', date: '2026-09-01' },
        { id: 'KB1047', customer: 'Sita Thapa', phone: '9823456789', city: 'Lalitpur', items: 'Paper, Iron', status: 'Completed', date: '2026-08-30' },
        { id: 'KB1046', customer: 'Hari Lama', phone: '9834567890', city: 'Bhaktapur', items: 'Plastic', status: 'Cancelled', date: '2026-08-28' },
      ]);
    } finally {
      setBookingsLoading(false);
    }
  };

  // ─── Fetch Users ─────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsersList(res.data.users || []);
    } catch (err) {
      // Fallback
      setUsersList([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPrices();
      fetchBookings();
      fetchUsers();
    }
  }, [user]);

  // ─── Image File Selection Handler ───────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ─── Open Edit Modal ─────────────────────────────────────────────────────────
  const openEditModal = (item) => {
    setEditModalItem(item);
    setFormData({
      name: item.name || '',
      nameNp: item.nameNp || '',
      category: item.category || 'metal',
      price: item.price || '',
      unit: item.unit || 'kg',
      trend: item.trend || 'stable',
      emoji: item.emoji || '📦',
      notes: item.notes || '',
    });
    setSelectedImageFile(null);
    setImagePreview(item.hasItemImage ? getPriceImageUrl(item._id) : (item.imageUrl || null));
  };


  // ─── Open Create Modal ───────────────────────────────────────────────────────
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setFormData({
      name: '',
      nameNp: '',
      category: 'metal',
      price: '',
      unit: 'kg',
      trend: 'stable',
      emoji: '📦',
      notes: '',
    });
    setSelectedImageFile(null);
    setImagePreview(null);
  };

  // ─── Save Edited Price ───────────────────────────────────────────────────────
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('nameNp', formData.nameNp);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('unit', formData.unit);
      data.append('trend', formData.trend);
      data.append('emoji', formData.emoji);
      data.append('notes', formData.notes);
      if (selectedImageFile) {
        data.append('itemImage', selectedImageFile);
      }

      await api.put(`/prices/${editModalItem._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Price and image updated successfully!');
      setEditModalItem(null);
      fetchPrices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update item');
    } finally {
      setModalLoading(false);
    }
  };

  // ─── Create New Price Item ───────────────────────────────────────────────────
  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Item name and price are required');
      return;
    }
    setModalLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('nameNp', formData.nameNp);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('unit', formData.unit);
      data.append('trend', formData.trend);
      data.append('emoji', formData.emoji);
      data.append('notes', formData.notes);
      if (selectedImageFile) {
        data.append('itemImage', selectedImageFile);
      }

      await api.post('/prices', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('New scrap item added successfully!');
      setIsCreateModalOpen(false);
      fetchPrices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create item');
    } finally {
      setModalLoading(false);
    }
  };

  // ─── Delete Price Item ───────────────────────────────────────────────────────
  const handleDeleteItem = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/prices/${id}`);
      toast.success(`Deleted "${name}"`);
      fetchPrices();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  // ─── Quick Inline Price Edit ─────────────────────────────────────────────────
  const handleQuickPriceUpdate = async (id, newPrice, currentTrend) => {
    try {
      await api.put(`/prices/${id}`, { price: Number(newPrice), trend: currentTrend });
      toast.success('Price updated');
      fetchPrices();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  // ─── Update Booking Status ───────────────────────────────────────────────────
  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    toast.success(`Booking ${id} marked as ${newStatus}`);
  };

  // ─── Export CSV ──────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['ID', 'Customer', 'Phone', 'City', 'Items', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...bookings.map((b) => `"${b.id}","${b.customer}","${b.phone}","${b.city}","${b.items}","${b.status}","${b.date}"`),
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

  // ─── RBAC GUARD: Not Logged in or Not Admin ──────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-500 text-sm mb-6">
            You must be logged in with an <strong>Administrator</strong> account to view and manage this portal.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-xs text-left mb-6 text-orange-800">
            <p className="font-bold mb-1">Admin Login Credentials:</p>
            <p>Username: <code className="font-bold">admin</code> | Phone: <code className="font-bold">97426869215</code></p>
            <p>Email: <code className="font-bold">nepalikabadibhaiya@gmail.com</code></p>
            <p>Password: <code className="font-bold">Admin@1234</code></p>
          </div>
          <Link
            href="/login"
            className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
          >
            Go to Admin Login →
          </Link>
        </div>
      </div>
    );
  }

  // ─── Filtered Prices ─────────────────────────────────────────────────────────
  const filteredPrices = prices.filter((p) => {
    const matchesCat = categoryFilter === 'all' || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
    const matchesSearch =
      p.name?.toLowerCase().includes(searchPrice.toLowerCase()) ||
      p.nameNp?.includes(searchPrice) ||
      p.category?.toLowerCase().includes(searchPrice.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="bg-dark text-white pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-orange-200 mb-2">
              <Shield className="w-3.5 h-3.5 text-accent" /> Authenticated as Super Admin
            </div>
            <h1 className="text-3xl font-bold">Admin Control Center</h1>
            <p className="text-gray-400 text-sm">Manage scrap rates, upload item photos, monitor bookings, and review users.</p>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
              <div className="text-xl font-bold text-primary">{prices.length}</div>
              <div className="text-xs text-gray-400">Items Listed</div>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
              <div className="text-xl font-bold text-accent">{bookings.length}</div>
              <div className="text-xs text-gray-400">Bookings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-6">

        {/* Dashboard Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-100 flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'prices' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Banknote className="w-4 h-4" /> Scrap Prices & Photos ({prices.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'bookings' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Truck className="w-4 h-4" /> Pickup Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'users' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" /> Registered Users
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: PRICE & ITEM MANAGER (Live CRUD + Photo Upload to MongoDB)      */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'prices' && (
          <div className="space-y-6 animate-fade-in-up">

            {/* Actions Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search scrap item..."
                    value={searchPrice}
                    onChange={(e) => setSearchPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="metal">Metals</option>
                  <option value="paper">Paper</option>
                  <option value="plastic">Plastic</option>
                  <option value="electronics">Electronics</option>
                  <option value="glass">Glass</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={fetchPrices}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Refresh prices"
                >
                  <RefreshCw className={`w-4 h-4 ${pricesLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={openCreateModal}
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-md shadow-primary/20"
                >
                  <Plus className="w-4 h-4" /> Add New Scrap Item
                </button>
              </div>
            </div>

            {/* Prices Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Item Photo</th>
                      <th className="p-4">Item Name (EN / NP)</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Current Rate</th>
                      <th className="p-4">Trend</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPrices.map((item) => {
                      const imageSrc = item.hasItemImage
                        ? getPriceImageUrl(item._id)
                        : item.imageUrl || '/items/iron.jpg';


                      return (
                        <tr key={item._id} className="hover:bg-orange-50/30 transition-colors">
                          <td className="p-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
                              <img
                                src={imageSrc}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <button
                                onClick={() => openEditModal(item)}
                                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold"
                              >
                                Change
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{item.emoji || '📦'}</span>
                              <span>{item.name}</span>
                            </div>
                            <div className="text-xs text-gray-500">{item.nameNp || '—'}</div>
                          </td>
                          <td className="p-4">
                            <span className="capitalize text-xs font-semibold bg-primary-light text-primary-dark px-2.5 py-1 rounded-full">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-900 text-lg">Rs</span>
                              <input
                                type="number"
                                defaultValue={item.price}
                                onBlur={(e) => {
                                  if (Number(e.target.value) !== item.price) {
                                    handleQuickPriceUpdate(item._id, e.target.value, item.trend);
                                  }
                                }}
                                className="w-20 p-1.5 text-base font-bold rounded-lg border border-gray-300 text-primary focus:ring-2 focus:ring-primary/40 outline-none text-center"
                              />
                              <span className="text-xs text-gray-400">/{item.unit || 'kg'}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <select
                              value={item.trend}
                              onChange={(e) => handleQuickPriceUpdate(item._id, item.price, e.target.value)}
                              className="text-xs font-semibold rounded-lg p-1.5 border border-gray-200 focus:outline-none bg-white"
                            >
                              <option value="stable">➡️ Stable</option>
                              <option value="up">⬆️ Rising</option>
                              <option value="down">⬇️ Falling</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit item & photo"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item._id, item.name)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: BOOKINGS MANAGER                                                */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone, ID..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={searchBooking}
                  onChange={(e) => setSearchBooking(e.target.value)}
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <select
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings
                    .filter((b) => statusFilter === 'All' || b.status === statusFilter)
                    .map((b) => (
                      <tr key={b.id || b._id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-gray-900">{b.id || b._id?.slice(-6)}</td>
                        <td className="p-4">{b.customer || b.user?.name || 'Customer'}</td>
                        <td className="p-4 font-mono text-sm">{b.phone}</td>
                        <td className="p-4">{b.city}</td>
                        <td className="p-4 text-sm text-gray-600">{b.items}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              b.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : b.status === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={b.status}
                            onChange={(e) => updateStatus(b.id || b._id, e.target.value)}
                            className="text-xs border rounded-lg p-1.5 focus:outline-none bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: REGISTERED USERS                                               */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Registered Actors & Users
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Phone Verified</th>
                    <th className="p-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersList.length > 0 ? (
                    usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-gray-900">{u.name}</td>
                        <td className="p-4 text-primary font-medium text-sm">@{u.username || '—'}</td>
                        <td className="p-4 font-mono text-sm">{u.phone}</td>
                        <td className="p-4 text-sm text-gray-500">{u.email || '—'}</td>
                        <td className="p-4 text-sm">{u.city}</td>
                        <td className="p-4">
                          {u.isPhoneVerified ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                              Verified
                            </span>
                          ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-semibold">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400">
                        No additional users registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT PRICE ITEM & UPLOAD PHOTO                                   */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {editModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" /> Edit Scrap Item
              </h3>
              <button
                onClick={() => setEditModalItem(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Item Photo Upload Section */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Scrap Item Photo (Stored in MongoDB)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-primary/40 overflow-hidden flex items-center justify-center relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{formData.emoji}</span>
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" /> Select New Photo
                    </button>
                    <p className="text-[11px] text-gray-400 mt-1">JPEG, PNG, WebP up to 2MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Item Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Name in Nepali (NP)</label>
                  <input
                    type="text"
                    value={formData.nameNp}
                    onChange={(e) => setFormData({ ...formData, nameNp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (Rs)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none bg-white"
                  >
                    <option value="metal">Metal</option>
                    <option value="paper">Paper</option>
                    <option value="plastic">Plastic</option>
                    <option value="electronics">Electronics</option>
                    <option value="glass">Glass</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Trend</label>
                  <select
                    value={formData.trend}
                    onChange={(e) => setFormData({ ...formData, trend: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none bg-white"
                  >
                    <option value="stable">➡️ Stable</option>
                    <option value="up">⬆️ Rising</option>
                    <option value="down">⬇️ Falling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Broken copper pipes, AC coils"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-colors shadow-md disabled:opacity-70"
                >
                  {modalLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL: ADD NEW SCRAP ITEM                                               */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Add New Scrap Item
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Scrap Photo (Saved to MongoDB)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-primary/40 overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Optional, stored as binary in MongoDB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Item Name (EN) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brass Fittings"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Name in Nepali (NP)</label>
                  <input
                    type="text"
                    placeholder="पित्तल सामान"
                    value={formData.nameNp}
                    onChange={(e) => setFormData({ ...formData, nameNp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (Rs) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="350"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none bg-white"
                  >
                    <option value="metal">Metal</option>
                    <option value="paper">Paper</option>
                    <option value="plastic">Plastic</option>
                    <option value="electronics">Electronics</option>
                    <option value="glass">Glass</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Trend</label>
                  <select
                    value={formData.trend}
                    onChange={(e) => setFormData({ ...formData, trend: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none bg-white"
                  >
                    <option value="stable">➡️ Stable</option>
                    <option value="up">⬆️ Rising</option>
                    <option value="down">⬇️ Falling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-colors shadow-md disabled:opacity-70"
                >
                  {modalLoading ? 'Creating...' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
