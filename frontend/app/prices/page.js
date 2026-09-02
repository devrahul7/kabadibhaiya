'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/context/LanguageContext';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Mock data since API might not be ready
const mockPrices = [
  { id: 1, name: 'Iron', category: 'Metal', price: 28, trend: 'up', unit: 'kg' },
  { id: 2, name: 'Copper', category: 'Metal', price: 550, trend: 'up', unit: 'kg' },
  { id: 3, name: 'Aluminium', category: 'Metal', price: 160, trend: 'stable', unit: 'kg' },
  { id: 4, name: 'Newspaper', category: 'Paper', price: 15, trend: 'down', unit: 'kg' },
  { id: 5, name: 'Cardboard', category: 'Paper', price: 12, trend: 'stable', unit: 'kg' },
  { id: 6, name: 'Plastic Bottles', category: 'Plastic', price: 20, trend: 'up', unit: 'kg' },
  { id: 7, name: 'Mixed Plastic', category: 'Plastic', price: 10, trend: 'stable', unit: 'kg' },
  { id: 8, name: 'E-Waste', category: 'Electronics', price: 50, trend: 'up', unit: 'kg' },
  { id: 9, name: 'Glass Bottles', category: 'Glass', price: 2, trend: 'stable', unit: 'piece' },
];

export default function PricesPage() {
  const { t } = useLang();
  const [filter, setFilter] = useState('All');
  const [calcItem, setCalcItem] = useState(mockPrices[0]);
  const [calcQty, setCalcQty] = useState(10);
  
  const categories = ['All', 'Metal', 'Paper', 'Plastic', 'Electronics', 'Glass'];
  
  const filteredPrices = filter === 'All' ? mockPrices : mockPrices.filter(p => p.category === filter);

  // Chart Data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: `${calcItem.name} Price (Rs)`,
      data: [calcItem.price-2, calcItem.price-1, calcItem.price-1, calcItem.price, calcItem.price, calcItem.price+1, calcItem.price],
      borderColor: '#e67e22',
      backgroundColor: '#fdebd0',
      tension: 0.4
    }]
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('prices', 'title')}</h1>
        <p className="text-white/80 flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4"/> {t('prices', 'lastUpdated')}: Today
        </p>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex overflow-x-auto hide-scrollbar border border-gray-100">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Price Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {filteredPrices.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCalcItem(item)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-primary-dark bg-primary-light px-2 py-1 rounded">{item.category}</span>
                    {item.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500"/>}
                    {item.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500"/>}
                    {item.trend === 'stable' && <ArrowRight className="w-4 h-4 text-gray-400"/>}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                  <div className="text-2xl font-bold text-primary">Rs {item.price} <span className="text-sm font-normal text-gray-500">/{item.unit}</span></div>
                </div>
              ))}
            </div>

            {/* Full Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="p-4 font-semibold">Item</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPrices.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{item.name}</td>
                        <td className="p-4 text-sm text-gray-500">{item.category}</td>
                        <td className="p-4 font-bold text-primary">Rs {item.price} <span className="text-xs font-normal text-gray-500">/{item.unit}</span></td>
                        <td className="p-4">
                          {item.trend === 'up' && <span className="text-green-500 text-sm font-medium">Rising</span>}
                          {item.trend === 'down' && <span className="text-red-500 text-sm font-medium">Falling</span>}
                          {item.trend === 'stable' && <span className="text-gray-400 text-sm font-medium">Stable</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Calculator */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Activity className="text-primary w-5 h-5"/> {t('prices', 'calculatorTitle')}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                  <select 
                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-primary focus:border-primary"
                    value={calcItem.id}
                    onChange={(e) => setCalcItem(mockPrices.find(p => p.id === parseInt(e.target.value)))}
                  >
                    {mockPrices.map(p => <option key={p.id} value={p.id}>{p.name} (Rs {p.price}/{p.unit})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({calcItem.unit})</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setCalcQty(Math.max(1, calcQty - 1))} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border-r font-bold text-gray-600">-</button>
                    <input type="number" value={calcQty} onChange={(e) => setCalcQty(parseInt(e.target.value)||0)} className="w-full p-3 text-center focus:outline-none" min="1" />
                    <button onClick={() => setCalcQty(calcQty + 1)} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border-l font-bold text-gray-600">+</button>
                  </div>
                </div>
              </div>

              <div className="bg-primary-light rounded-xl p-4 text-center mb-6">
                <div className="text-sm text-primary-dark font-medium mb-1">Estimated Value</div>
                <div className="text-3xl font-bold text-primary">Rs {(calcItem.price * calcQty).toLocaleString()}</div>
              </div>

              <Link href="/schedule" className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-3 rounded-xl transition-colors">
                Schedule Pickup for this
              </Link>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">7-Day Trend</h3>
              <div className="h-48 w-full">
                <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
