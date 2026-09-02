'use client';
import { useLang } from '@/context/LanguageContext';
import Link from 'next/link';
import { Calendar, Truck, Banknote, Star, MapPin, Calculator, Smartphone, CheckCircle } from 'lucide-react';
import CoverageMap from '@/components/home/CoverageMap';
import { useState } from 'react';

export default function Home() {
  const { t } = useLang();
  
  // Hardcoded prices for quick calc
  const prices = { iron: 28, copper: 550, paper: 15, plastic: 10 };
  const [calcItem, setCalcItem] = useState('iron');
  const [calcKg, setCalcKg] = useState(10);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <section className="bg-dark relative overflow-hidden py-24 md:py-32 text-white">
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero', 'headline')}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              {t('hero', 'subheadline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/schedule" className="bg-primary hover:bg-primary-dark text-white text-center font-semibold py-3 px-8 rounded-full transition-colors shadow-lg">
                {t('hero', 'scheduleFree')}
              </Link>
              <Link href="/prices" className="bg-white/10 hover:bg-white/20 text-white text-center font-semibold py-3 px-8 rounded-full transition-colors backdrop-blur-sm">
                {t('hero', 'viewPrices')}
              </Link>
            </div>
            
            <div className="mt-12 flex gap-8 text-gray-400 text-sm">
              <div><span className="text-white font-bold text-xl block">10,000+</span> Customers</div>
              <div><span className="text-white font-bold text-xl block">3</span> Cities</div>
              <div><span className="text-white font-bold text-xl block">100%</span> Free Pickup</div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative h-[400px] w-full hidden md:block">
            {/* Floating Price Cards */}
            <div className="absolute top-10 right-20 bg-white text-gray-800 p-4 rounded-2xl shadow-xl animate-float">
              <div className="text-sm text-gray-500 font-semibold">Iron Scrap</div>
              <div className="text-2xl font-bold text-primary">Rs 28 <span className="text-sm font-normal">/kg</span></div>
            </div>
            <div className="absolute top-48 right-10 bg-white text-gray-800 p-4 rounded-2xl shadow-xl animate-float" style={{animationDelay: '1s'}}>
              <div className="text-sm text-gray-500 font-semibold">Copper</div>
              <div className="text-2xl font-bold text-primary">Rs 550 <span className="text-sm font-normal">/kg</span></div>
            </div>
            <div className="absolute bottom-20 right-40 bg-white text-gray-800 p-4 rounded-2xl shadow-xl animate-float" style={{animationDelay: '2s'}}>
              <div className="text-sm text-gray-500 font-semibold">Old Papers</div>
              <div className="text-2xl font-bold text-primary">Rs 15 <span className="text-sm font-normal">/kg</span></div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative blob */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">{t('howItWorks', 'title')}</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-primary-light text-primary">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks', 'step1')}</h3>
              <p className="text-gray-600">{t('howItWorks', 'step1desc')}</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-primary-light text-primary">
                <Truck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks', 'step2')}</h3>
              <p className="text-gray-600">{t('howItWorks', 'step2desc')}</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-accent-light text-accent">
                <Banknote className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks', 'step3')}</h3>
              <p className="text-gray-600">{t('howItWorks', 'step3desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Price Calculator */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-primary-light rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-lg">
            <div className="md:w-1/2">
              <div className="flex items-center gap-3 text-primary-dark mb-4">
                <Calculator className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Quick Estimate</h2>
              </div>
              <p className="text-gray-700 mb-6">See how much you can earn before booking a pickup.</p>
              <Link href="/prices" className="text-primary font-semibold hover:underline">View all prices &rarr;</Link>
            </div>
            
            <div className="md:w-1/2 bg-white rounded-2xl p-6 shadow-md w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
                <select className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-primary focus:border-primary" value={calcItem} onChange={e=>setCalcItem(e.target.value)}>
                  <option value="iron">Iron</option>
                  <option value="copper">Copper</option>
                  <option value="paper">Paper/Cardboard</option>
                  <option value="plastic">Plastic</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Weight (kg)</label>
                <input type="number" className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-primary focus:border-primary" value={calcKg} onChange={e=>setCalcKg(e.target.value)} min="1" />
              </div>
              <div className="border-t pt-4 flex justify-between items-end">
                <span className="text-gray-500">Estimated Value</span>
                <span className="text-3xl font-bold text-accent">Rs {prices[calcItem] * calcKg}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Coverage Map */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Coverage Area</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide free doorstep pickup services across the Kathmandu Valley.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="md:col-span-1 flex flex-col gap-4">
              {['Kathmandu', 'Lalitpur', 'Bhaktapur'].map(city => (
                <div key={city} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{city}</h4>
                    <p className="text-xs text-gray-500">Full Coverage</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:col-span-3 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <CoverageMap />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {name: 'Ramesh Shrestha', text: 'Very punctual and professional. Got a fair price for all my old newspapers and iron scrap.', city: 'Kathmandu'},
              {name: 'Sunita Maharjan', text: 'Loved the eSewa payment option. The pickup guy was very polite. Will definitely use again.', city: 'Lalitpur'},
              {name: 'Bikash Tamang', text: 'Best kabadi service in the valley. No more waiting for the cart to pass by my house.', city: 'Bhaktapur'}
            ].map((r,i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
                <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" className="w-5 h-5"/><Star fill="currentColor" className="w-5 h-5"/><Star fill="currentColor" className="w-5 h-5"/><Star fill="currentColor" className="w-5 h-5"/><Star fill="currentColor" className="w-5 h-5"/></div>
                <p className="text-gray-700 mb-6 italic">"{r.text}"</p>
                <div>
                  <h4 className="font-semibold text-gray-800">{r.name}</h4>
                  <p className="text-sm text-gray-500">{r.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Payment Methods */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 font-medium mb-8">GET PAID INSTANTLY VIA</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-80">
            <div className="flex items-center gap-2 text-xl font-bold text-green-600 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">eSewa</div>
            <div className="flex items-center gap-2 text-xl font-bold text-purple-600 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">Khalti</div>
            <div className="flex items-center gap-2 text-xl font-bold text-red-600 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">IME Pay</div>
            <div className="flex items-center gap-2 text-xl font-bold text-primary bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">Cash</div>
          </div>
        </div>
      </section>

      {/* 7. WhatsApp Strip */}
      <section className="bg-primary py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Want to book faster?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/9779800000000" target="_blank" rel="noreferrer" className="bg-[#25D366] hover:bg-[#1ebe5a] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-colors">
              <Smartphone className="w-5 h-5" /> WhatsApp
            </a>
            <a href="viber://chat?number=9779800000000" target="_blank" rel="noreferrer" className="bg-[#7360F2] hover:bg-[#6050ce] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-colors">
              <Smartphone className="w-5 h-5" /> Viber
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
