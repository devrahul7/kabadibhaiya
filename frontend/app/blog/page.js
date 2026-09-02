'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    slug: 'why-recycle-ewaste-nepal',
    title: 'Why Recycling E-Waste is Crucial for Nepal',
    category: 'Environment',
    excerpt: 'Electronic waste is growing rapidly in Kathmandu. Learn why it is important to recycle old electronics and how you can do it safely.',
    author: 'Aarav Sharma',
    date: 'Oct 12, 2026',
    readTime: '5 min',
    image: '/items/ewaste.jpg'
  },
  {
    id: 2,
    slug: 'scrap-prices-explained',
    title: 'Understanding Scrap Metal Prices in Kathmandu',
    category: 'Market Guide',
    excerpt: 'Scrap prices fluctuate based on global markets and local demand. Here is a guide to understanding how we calculate prices for iron and copper.',
    author: 'Sita Thapa',
    date: 'Oct 5, 2026',
    readTime: '4 min',
    image: '/items/copper.jpg'
  },
  {
    id: 3,
    slug: 'creative-ways-reuse-plastic',
    title: '5 Creative Ways to Reuse Plastic Bottles at Home',
    category: 'DIY',
    excerpt: 'Before you send those plastic bottles to the kabadi, check out these creative ways to upcycle them into useful household items.',
    author: 'Pema Sherpa',
    date: 'Sep 28, 2026',
    readTime: '3 min',
    image: '/items/plastic.jpg'
  },
  {
    id: 4,
    slug: 'kabadi-bhaiya-impact',
    title: 'How KabadiBhaiya is Changing the Scrap Industry',
    category: 'Company News',
    excerpt: 'We started with a simple idea: make scrap collection easy, certified, and transparent. Here is a look at our environmental impact in Kathmandu Valley.',
    author: 'Rahul Admin',
    date: 'Sep 15, 2026',
    readTime: '6 min',
    image: '/items/hero-kathmandu.jpg'
  }
];


export default function BlogPage() {
  const { t } = useLang();
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Environment', 'Market Guide', 'DIY', 'Company News'];
  
  const filteredPosts = filter === 'All' ? mockPosts : mockPosts.filter(p => p.category === filter);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-dark text-white py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/10 z-0"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('blog', 'title')}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Tips, guides, and news about recycling, sustainability, and the kabadi market in Nepal.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-10 flex overflow-x-auto hide-scrollbar border border-gray-100 max-w-4xl mx-auto justify-center">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col">
              <Link href={`/blog/${post.slug}`} className="block h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold rounded-full text-primary shadow-sm z-10">{post.category}</span>
              </Link>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1">{post.excerpt}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-gray-400"/> {post.author}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-primary font-semibold flex items-center gap-1 text-sm group-hover:underline">
                    {t('blog', 'readMore')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No posts found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
