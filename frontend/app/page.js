'use client';
import { useLang } from '@/context/LanguageContext';
import Link from 'next/link';
import {
  Calendar, Truck, Banknote, Star, CheckCircle, Calculator, Smartphone,
  Scale, ShieldCheck, Clock, Recycle, ArrowRight, Award, MapPin, Sparkles
} from 'lucide-react';
import CoverageMap from '@/components/home/CoverageMap';
import { useState } from 'react';

// ─── Scrap Categories — Authentic Local Verified Imagery ──────────────────────
const SCRAP_CATEGORIES = [
  {
    key: 'iron', name: 'Iron & Steel', nameNp: 'फलाम र स्टिल', price: 28, unit: 'kg', emoji: '🔩',
    image: '/items/iron.jpg',
    tagEn: 'Highest Volume', tagNp: 'सबैभन्दा धेरै संकलन',
    descEn: 'Construction rods, iron grilles, pipes, sheets, old gates',
    descNp: 'फलामको डण्डी, पाइप, ग्रिल, टिनका पाता र मेसिनरी',
    itemsEn: ['Rods / Dandi', 'Pipes & Grilles', 'Heavy Machinery', 'Tin Sheets'],
    itemsNp: ['डण्डी', 'पाइप र ग्रिल', 'मेसिनरी', 'टिनका पाता']
  },
  {
    key: 'copper', name: 'Copper Wire', nameNp: 'तामाको तार', price: 550, unit: 'kg', emoji: '⚡',
    image: '/items/copper.jpg',
    tagEn: 'Highest Value', tagNp: 'सबैभन्दा महँगो दर',
    descEn: 'Pure copper wire, AC coils, motor winding, plumbing pipes',
    descNp: 'तामाको शुद्ध तार, एसी क्वाइल, मोटर वाइन्डिङ, पाइप',
    itemsEn: ['Stripped Wire', 'Armoured Cables', 'Motor Windings', 'Pipes & Tubes'],
    itemsNp: ['छिलेको तामा', 'केबल तार', 'मोटर वाइन्डिङ', 'पाइप']
  },
  {
    key: 'brass', name: 'Brass & Bronze', nameNp: 'पित्तल र काँस', price: 380, unit: 'kg', emoji: '🪙',
    image: '/items/brass.jpg',
    tagEn: 'High Demand', tagNp: 'उच्च माग',
    descEn: 'Traditional utensils, water taps, decorative items, hardware',
    descNp: 'पुराना गाग्री, थाल, धाराको टुटी, काँसका सामान',
    itemsEn: ['Old Utensils (Gagri/Thali)', 'Water Taps & Valves', 'Handicraft Scrap'],
    itemsNp: ['गाग्री र थाल', 'धाराको टुटी', 'हस्तकला सामान']
  },
  {
    key: 'aluminium', name: 'Aluminium Cans', nameNp: 'एल्युमिनियम क्यान', price: 95, unit: 'kg', emoji: '🥫',
    image: '/items/aluminium.jpg',
    tagEn: 'Instant Cash', tagNp: 'हातहातै पैसा',
    descEn: 'Beverage cans, window frames, cookware, vehicle parts',
    descNp: 'कोल्ड ड्रिंक्सका क्यान, झ्यालका सेक्सन प्रोफाइल, प्रेसर कुकर',
    itemsEn: ['Soft Aluminium Cans', 'Window Section Profiles', 'Pressure Cookers'],
    itemsNp: ['सफ्ट क्यान', 'झ्यालका सेक्सन', 'प्रेसर कुकर']
  },
  {
    key: 'paper', name: 'Newspaper & Books', nameNp: 'पत्रपत्रिका र किताब', price: 15, unit: 'kg', emoji: '📰',
    image: '/items/newspaper.jpg',
    tagEn: 'Eco Friendly', tagNp: 'वातावरण मैत्री',
    descEn: 'Daily newspapers, old textbooks, notebooks, office paper',
    descNp: 'दैनिक गोरखापत्र/कान्तिपुर, पुराना किताब, कापी, सेतो कागज',
    itemsEn: ['Gorkhapatra / Kantipur', 'College & School Books', 'Office A4 Waste'],
    itemsNp: ['दैनिक पत्रिका', 'स्कुल/कलेज किताब', 'सेतो कागज']
  },
  {
    key: 'carton', name: 'Cardboard Cartons', nameNp: 'कार्टुन र बक्स', price: 12, unit: 'kg', emoji: '📦',
    image: '/items/cardboard.jpg',
    tagEn: 'Packaging Waste', tagNp: 'प्याकेजिङ फोहोर',
    descEn: 'Corrugated cartons, packaging cardboard, parcel boxes',
    descNp: 'प्याकेजिङ कार्टुन, पार्सल बक्स, खैरो बाकस',
    itemsEn: ['Brown Shipping Boxes', 'Appliance Cartons', 'Greyboard'],
    itemsNp: ['खैरो बक्स', 'उपकरण कार्टुन', 'बोर्ड']
  },
  {
    key: 'plastic', name: 'PET Bottles & Plastic', nameNp: 'प्लास्टिक बोतल र सामान', price: 20, unit: 'kg', emoji: '♻️',
    image: '/items/plastic.jpg',
    tagEn: 'Recyclable', tagNp: 'रिसाइक्लेबल',
    descEn: 'Beverage water bottles, hard plastic chairs, buckets, drums',
    descNp: 'पानीका बोतल, कडा प्लास्टिकका कुर्सी, बाल्टिन, तेलका जार',
    itemsEn: ['Mineral Water Bottles', 'Broken Plastic Chairs', 'Oil Jars & HDPE'],
    itemsNp: ['पानीका बोतल', 'भाँचिएका कुर्सी', 'बाल्टिन र जार']
  },
  {
    key: 'ewaste', name: 'E-Waste & Electronics', nameNp: 'कम्प्युटर र इलेक्ट्रोनिक्स', price: 175, unit: 'kg', emoji: '💻',
    image: '/items/ewaste.jpg',
    tagEn: 'Certified Handling', tagNp: 'प्रमाणित संकलन',
    descEn: 'Old PCs, laptops, mobile phones, printed circuit boards',
    descNp: 'पुराना सीपीयू, मदरबोर्ड, ल्यापटप, मोबाइल फोन, एलसीडी',
    itemsEn: ['Laptops & Motherboards', 'Old Mobile Phones', 'TVs & LCD Panels'],
    itemsNp: ['ल्यापटप र मदरबोर्ड', 'मोबाइल फोन', 'एलसीडी प्यानल']
  },
  {
    key: 'appliances', name: 'Old Appliances', nameNp: 'पुराना उपकरण (फ्रिज/वासिङ)', price: 35, unit: 'kg', emoji: '🧊',
    image: '/items/appliances.jpg',
    tagEn: 'Heavy Scrap', tagNp: 'भारी कबाडी',
    descEn: 'Faulty refrigerators, washing machines, microwaves, geysers',
    descNp: 'बिग्रिएका पुराना फ्रिज, वाशिङ मेसिन, गिजर, माइक्रोवेभ',
    itemsEn: ['Old Fridges', 'Washing Machines', 'Geysers & Inverters'],
    itemsNp: ['पुराना फ्रिज', 'वाशिङ मेसिन', 'गिजर र इन्भर्टर']
  },
  {
    key: 'battery', name: 'Batteries & Inverters', nameNp: 'ब्याट्री र इन्भर्टर', price: 140, unit: 'kg', emoji: '🔋',
    image: '/items/battery.jpg',
    tagEn: 'Hazardous Safe Disposal', tagNp: 'सुरक्षित विसर्जन',
    descEn: 'Inverter batteries, car & motorcycle batteries, lead weights',
    descNp: 'इन्भर्टर ब्याट्री, गाडी तथा मोटरसाइकलका ब्याट्री, सिसा धातु',
    itemsEn: ['Inverter Batteries', 'Vehicle Batteries', 'Lead Scrap'],
    itemsNp: ['इन्भर्टर ब्याट्री', 'गाडीको ब्याट्री', 'सिसा धातु']
  },
  {
    key: 'glass', name: 'Glass Bottles', nameNp: 'सिसाको बोतल', price: 2, unit: 'piece', emoji: '🍶',
    image: '/items/glass.jpg',
    tagEn: 'Return & Reuse', tagNp: 'पुनः प्रयोग',
    descEn: 'Beer bottles, cold drink glass bottles, liquor bottles',
    descNp: 'बियरका सिसा बोतल, पेय पदार्थका बोतल र सिसाका भाँडा',
    itemsEn: ['Beer Bottles (Tuborg/Gorkha)', 'Glass Food Jars'],
    itemsNp: ['बियरका बोतल', 'सिसाका जार']
  },
  {
    key: 'stainless', name: 'Stainless Steel', nameNp: 'स्टेनलेस स्टिल', price: 45, unit: 'kg', emoji: '🍴',
    image: '/items/stainless.jpg',
    tagEn: 'Non-magnetic', tagNp: 'खिया नलाग्ने',
    descEn: 'Kitchen utensils, sink units, railing scrap, industrial steel',
    descNp: 'भान्साका स्टिलका भाँडाकुँडा, सिंक, रेलिङका टुक्रा',
    itemsEn: ['Kitchen Utensils', 'Steel Railings', 'Sink Units'],
    itemsNp: ['स्टिलका भाँडा', 'रेलिङ', 'सिंक']
  }
];

export default function Home() {
  const { lang, t } = useLang();
  const [calcItem, setCalcItem] = useState(SCRAP_CATEGORIES[0]);
  const [calcKg, setCalcKg] = useState(25);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  const filteredCategories = activeCategoryTab === 'all'
    ? SCRAP_CATEGORIES
    : SCRAP_CATEGORIES.filter(c => {
        if (activeCategoryTab === 'metals') return ['iron', 'copper', 'brass', 'aluminium', 'stainless', 'battery'].includes(c.key);
        if (activeCategoryTab === 'paper') return ['paper', 'carton'].includes(c.key);
        if (activeCategoryTab === 'plastic') return ['plastic'].includes(c.key);
        if (activeCategoryTab === 'electronics') return ['ewaste', 'appliances'].includes(c.key);
        return true;
      });

  return (
    <div className="flex flex-col min-h-screen">

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION                                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark relative overflow-hidden text-white py-14 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/25 via-dark to-dark pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-orange-200 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-accent rounded-full animate-ping" />
                <span>{t('hero', 'tag')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                {t('hero', 'headlineLine1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                  {t('hero', 'headlineHighlight')}
                </span>, {t('hero', 'headlineLine2')}
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl font-normal leading-relaxed">
                {t('hero', 'subheadline')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/schedule"
                  className="bg-primary hover:bg-primary-dark text-white text-center font-bold py-4 px-8 rounded-full transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 text-base hover:scale-[1.02]"
                >
                  <Calendar className="w-5 h-5" /> {t('hero', 'scheduleFree')}
                </Link>
                <Link
                  href="/prices"
                  className="bg-white/10 hover:bg-white/20 text-white text-center font-bold py-4 px-8 rounded-full transition-all backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 text-base"
                >
                  <Banknote className="w-5 h-5 text-accent" /> {t('hero', 'viewPrices')}
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{t('hero', 'stat1Number')}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t('hero', 'stat1Label')}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-accent">{t('hero', 'stat2Number')}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t('hero', 'stat2Label')}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-primary">{t('hero', 'stat3Number')}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t('hero', 'stat3Label')}</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-white/5 backdrop-blur-sm p-3">
                <div className="relative rounded-2xl overflow-hidden h-72 sm:h-80">
                  <img
                    src="/items/hero-kathmandu.jpg"
                    alt="Kabadi Pickup in Kathmandu Nepal"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="bg-primary text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {t('hero', 'doorstepBadge')}
                    </span>
                    <h3 className="text-base font-bold mt-1">{t('hero', 'digitalScaleTitle')}</h3>
                    <p className="text-xs text-gray-300">{t('hero', 'digitalScaleDesc')}</p>
                  </div>
                </div>

                {/* Floating Rate Badges */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-white/95 text-gray-900 rounded-xl p-2.5 flex items-center gap-3 shadow-lg">
                    <img
                      src="/items/copper.jpg"
                      alt="Copper Wire Scrap"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">{lang === 'np' ? 'तामा / Copper' : 'Copper Wire'}</div>
                      <div className="text-base font-extrabold text-primary">Rs 550 <span className="text-[10px] font-normal text-gray-500">/kg</span></div>
                    </div>
                  </div>

                  <div className="bg-white/95 text-gray-900 rounded-xl p-2.5 flex items-center gap-3 shadow-lg">
                    <img
                      src="/items/iron.jpg"
                      alt="Iron Scrap"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">{lang === 'np' ? 'फलाम / Iron' : 'Iron & Steel'}</div>
                      <div className="text-base font-extrabold text-primary">Rs 28 <span className="text-[10px] font-normal text-gray-500">/kg</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-accent text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex border border-white/20">
                <ShieldCheck className="w-8 h-8 text-white" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">{t('hero', 'noCheatingTitle')}</div>
                  <div className="text-sm font-extrabold">{t('hero', 'noCheatingSub')}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 2. COMPREHENSIVE KABADI ITEMS GALLERY                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-xs uppercase px-3 py-1 rounded-full mb-3">
              <Recycle className="w-3.5 h-3.5" /> {t('catalog', 'tag')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {t('catalog', 'title')}
            </h2>
            <p className="text-gray-600 text-base">
              {t('catalog', 'subtitle')}
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { id: 'all', label: t('catalog', 'allTab') },
                { id: 'metals', label: t('catalog', 'metalsTab') },
                { id: 'paper', label: t('catalog', 'paperTab') },
                { id: 'plastic', label: t('catalog', 'plasticTab') },
                { id: 'electronics', label: t('catalog', 'electronicsTab') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategoryTab === tab.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredCategories.map((item) => (
              <div
                key={item.key}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/80 group flex flex-col hover:-translate-y-1"
              >
                {/* ── Verified Real Item Photograph ── */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Tag pill top-left */}
                  <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span>{item.emoji}</span>
                    <span>{lang === 'np' ? item.tagNp : item.tagEn}</span>
                  </div>

                  {/* Price badge bottom-right */}
                  <div className="absolute bottom-3 right-3 bg-primary text-white font-extrabold px-3 py-1 rounded-xl text-sm shadow-md">
                    Rs {item.price} <span className="text-[11px] font-normal">/{item.unit}</span>
                  </div>
                </div>



                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs text-primary font-bold uppercase tracking-wider">
                    {lang === 'np' ? item.name : item.nameNp}
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                    {lang === 'np' ? item.nameNp : item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
                    {lang === 'np' ? item.descNp : item.descEn}
                  </p>

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      {t('catalog', 'examples')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(lang === 'np' ? item.itemsNp : item.itemsEn).map((sub, i) => (
                        <span key={i} className="text-[11px] bg-gray-50 text-gray-700 px-2 py-0.5 rounded-md border border-gray-100 font-medium">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/prices"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3.5 rounded-full border border-gray-200 shadow-sm transition-all hover:scale-105 text-sm"
            >
              {t('catalog', 'viewFullChart')} <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 3. HOW IT WORKS                                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent font-bold text-xs uppercase px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> {t('howItWorks', 'tag')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              {t('howItWorks', 'title')}
            </h2>
            <p className="text-gray-600">
              {t('howItWorks', 'subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col">
              <div className="h-48 overflow-hidden relative bg-gray-900">
                <img
                  src="/items/step1-phone.jpg"
                  alt="Online booking or WhatsApp"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                  STEP 1
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks', 'step1Title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('howItWorks', 'step1Desc')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col">
              <div className="h-48 overflow-hidden relative bg-gray-100">
                <img
                  src="/items/step2-scale.jpg"
                  alt="Digital scale doorstep weighing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                  STEP 2
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks', 'step2Title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('howItWorks', 'step2Desc')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col">
              <div className="h-48 overflow-hidden relative bg-gray-900">
                <img
                  src="/items/step3-payment.jpg"
                  alt="Instant digital payment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-accent text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                  STEP 3
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks', 'step3Title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('howItWorks', 'step3Desc')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 4. DIGITAL KABADI VS TRADITIONAL CART                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              {t('comparison', 'title')}
            </h2>
            <p className="text-gray-400">
              {t('comparison', 'subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional Street Cart */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="text-red-400 font-bold text-sm uppercase mb-4 tracking-wider">
                {t('comparison', 'traditionalTitle')}
              </div>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span> {t('comparison', 'traditional1')}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span> {t('comparison', 'traditional2')}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span> {t('comparison', 'traditional3')}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span> {t('comparison', 'traditional4')}
                </li>
              </ul>
            </div>

            {/* KabadiBhaiya Service */}
            <div className="bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary rounded-3xl p-8 shadow-xl relative">
              <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                RECOMMENDED
              </div>
              <div className="text-primary font-bold text-sm uppercase mb-4 tracking-wider">
                {t('comparison', 'modernTitle')}
              </div>
              <ul className="space-y-4 text-sm text-white">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" /> {t('comparison', 'modern1')}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" /> {t('comparison', 'modern2')}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" /> {t('comparison', 'modern3')}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" /> {t('comparison', 'modern4')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 5. QUICK ESTIMATOR WITH ITEM PREVIEW                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/80 flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase mb-3">
                <Calculator className="w-4 h-4" /> {t('calculator', 'tag')}
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                {t('calculator', 'title')}
              </h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {t('calculator', 'subtitle')}
              </p>
              <Link
                href="/prices"
                className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-sm"
              >
                {t('calculator', 'viewAllRates')}
              </Link>
            </div>

            <div className="md:w-1/2 bg-gray-50 rounded-2xl p-6 border border-gray-200 w-full">
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  {t('calculator', 'selectItem')}
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl p-3 bg-white text-sm font-semibold focus:ring-2 focus:ring-primary/40 outline-none"
                  value={calcItem.key}
                  onChange={(e) => setCalcItem(SCRAP_CATEGORIES.find((i) => i.key === e.target.value))}
                >
                  {SCRAP_CATEGORIES.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.emoji} {lang === 'np' ? item.nameNp : item.name} ({lang === 'np' ? item.name : item.nameNp}) — Rs {item.price}/{item.unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Item Photo Preview */}
              <div className="mb-4 rounded-xl overflow-hidden h-28 bg-gray-200 relative border border-gray-200 shadow-sm">
                <img
                  src={calcItem.image}
                  alt={calcItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-white text-xs font-bold">
                    {lang === 'np' ? calcItem.descNp : calcItem.descEn}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  {t('calculator', 'estQty')} ({calcItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 rounded-xl p-3 bg-white text-sm font-bold text-center focus:ring-2 focus:ring-primary/40 outline-none"
                  value={calcKg}
                  onChange={(e) => setCalcKg(Math.max(1, Number(e.target.value)))}
                />
              </div>

              <div className="bg-primary-light rounded-xl p-4 text-center">
                <div className="text-xs text-primary-dark font-bold uppercase tracking-wider mb-1">
                  {t('calculator', 'totalPayout')}
                </div>
                <div className="text-3xl font-black text-primary">
                  Rs {(calcItem.price * calcKg).toLocaleString()}
                </div>
              </div>

              <Link
                href="/schedule"
                className="mt-4 block w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-primary/20 text-sm"
              >
                {t('calculator', 'scheduleBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 6. COVERAGE MAP                                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              {t('coverage', 'title')}
            </h2>
            <p className="text-gray-600">
              {t('coverage', 'subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto items-center">
            <div className="md:col-span-1 flex flex-col gap-3">
              {[
                { en: 'Kathmandu Metropolitan', np: 'काठमाडौँ महानगरपालिका' },
                { en: 'Lalitpur City', np: 'ललितपुर महानगरपालिका' },
                { en: 'Bhaktapur & Madhyapur', np: 'भक्तपुर र मध्यपुर थिमी' },
                { en: 'Kirtipur & Outer Ring', np: 'कीर्तिपुर र रिङरोड क्षेत्र' },
              ].map((area, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {lang === 'np' ? area.np : area.en}
                    </h4>
                    <p className="text-[11px] text-gray-500">{t('coverage', 'available')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-3 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              <CoverageMap />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 7. WHATSAPP & DIRECT CALL STRIP                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-primary py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{t('cta', 'title')}</h2>
          <p className="text-orange-100 text-sm mb-6">{t('cta', 'subtitle')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/97797426869215"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebe5a] text-white px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
            >
              <Smartphone className="w-5 h-5" /> {t('cta', 'whatsappBtn')}
            </a>
            <a
              href="viber://chat?number=97797426869215"
              target="_blank"
              rel="noreferrer"
              className="bg-[#7360F2] hover:bg-[#6050ce] text-white px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
            >
              <Smartphone className="w-5 h-5" /> {t('cta', 'viberBtn')}
            </a>
            <a
              href="tel:97426869215"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
            >
              📞 {t('cta', 'callBtn')}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
