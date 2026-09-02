'use client';
import Link from 'next/link';
import { Calendar, User, Clock, ChevronLeft, Share2, Facebook, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogPostPage({ params }) {
  // Mock data fetching based on slug
  const post = {
    title: 'Why Recycling E-Waste is Crucial for Nepal',
    category: 'Environment',
    author: 'Aarav Sharma',
    date: 'Oct 12, 2024',
    readTime: '5 min',
    content: `
      <p>Electronic waste, or e-waste, is one of the fastest-growing waste streams in Kathmandu and across Nepal. As our reliance on smartphones, laptops, and other gadgets increases, so does the amount of toxic waste ending up in our landfills.</p>
      
      <h3>The Hidden Dangers of E-Waste</h3>
      <p>When old electronics are dumped alongside regular trash, hazardous materials like lead, mercury, and cadmium can seep into the soil and water supply. This poses severe health risks to the community and causes long-term environmental degradation.</p>
      
      <h3>The Value in Old Electronics</h3>
      <p>What many people don't realize is that e-waste contains valuable materials. Circuit boards often contain small amounts of gold, silver, and copper. By recycling e-waste properly, we can recover these precious metals and reduce the need for destructive mining practices.</p>
      
      <div class="bg-primary-light p-6 rounded-xl my-8 border-l-4 border-primary">
        <p class="font-bold text-primary-dark mb-0">Did you know? KabadiBhaiya offers special rates for bulk e-waste pickup from corporate offices in the valley.</p>
      </div>

      <h3>How You Can Help</h3>
      <ol>
        <li><strong>Don't Throw It Away:</strong> Keep a separate bin for old batteries, cables, and broken devices.</li>
        <li><strong>Repair Before Recycling:</strong> Sometimes a simple repair can extend the life of a device by years.</li>
        <li><strong>Use KabadiBhaiya:</strong> When it's truly broken, schedule a pickup with us. We ensure your e-waste is sent to certified processing facilities, not just dumped in the river.</li>
      </ol>
      
      <p>By making conscious choices about how we dispose of our electronics, we can protect the beautiful environment of Nepal for future generations.</p>
    `
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Header Image */}
      <div className="h-[40vh] w-full bg-dark relative flex items-end">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark to-orange-400 opacity-80"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10 pb-16">
          <Link href="/blog" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4"/> Back to Blog
          </Link>
          <div className="mb-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">{post.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white max-w-4xl leading-tight mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-2"><User className="w-4 h-4"/> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {post.date}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4"/> {post.readTime} read</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="lg:w-2/3 bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 prose prose-lg prose-orange max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-gray-700 leading-relaxed space-y-6" />
          
          {/* Tags & Share */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-2">
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">#EWaste</span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">#Recycling</span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">#Nepal</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Share:</span>
              <button onClick={copyLink} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"><Share2 className="w-5 h-5"/></button>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"><Facebook className="w-5 h-5"/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"><Twitter className="w-5 h-5"/></a>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-8">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-200 pb-2">Related Articles</h3>
            <div className="space-y-4">
              <Link href="#" className="block group">
                <h4 className="font-semibold text-gray-700 group-hover:text-primary transition-colors">Understanding Scrap Metal Prices in Kathmandu</h4>
                <p className="text-sm text-gray-500 mt-1">Oct 5, 2024</p>
              </Link>
              <Link href="#" className="block group">
                <h4 className="font-semibold text-gray-700 group-hover:text-primary transition-colors">5 Creative Ways to Reuse Plastic Bottles at Home</h4>
                <p className="text-sm text-gray-500 mt-1">Sep 28, 2024</p>
              </Link>
            </div>
          </div>

          <div className="bg-primary rounded-2xl p-8 text-center text-white shadow-lg">
            <h3 className="font-bold text-2xl mb-2">Have e-waste?</h3>
            <p className="text-white/80 mb-6 text-sm">Schedule a free pickup today and earn cash for your old electronics.</p>
            <Link href="/schedule" className="block w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Schedule Pickup
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
