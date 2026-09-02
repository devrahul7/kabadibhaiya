require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Price = require('../models/Price');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    await Price.deleteMany();
    await BlogPost.deleteMany();
    console.log('Cleared existing Prices and BlogPosts');

    const prices = [
      // METALS
      { name: 'Iron/Steel', nameNp: 'फलाम/स्टिल', category: 'metal', price: 28, unit: 'kg', trend: 'stable', emoji: '🔩',
        imageUrl: '/items/iron.jpg' },
      { name: 'Copper Wire', nameNp: 'तामाको तार', category: 'metal', price: 550, unit: 'kg', trend: 'up', emoji: '⚡',
        imageUrl: '/items/copper.jpg' },
      { name: 'Brass (Pittal)', nameNp: 'पित्तल र काँस', category: 'metal', price: 380, unit: 'kg', trend: 'stable', emoji: '🪙',
        imageUrl: '/items/brass.jpg' },
      { name: 'Aluminium', nameNp: 'एल्युमिनियम क्यान', category: 'metal', price: 95, unit: 'kg', trend: 'up', emoji: '🥫',
        imageUrl: '/items/aluminium.jpg' },
      { name: 'Stainless Steel', nameNp: 'खिया नलाग्ने स्टिल', category: 'metal', price: 45, unit: 'kg', trend: 'stable', emoji: '🍴',
        imageUrl: '/items/stainless.jpg' },
      { name: 'Lead', nameNp: 'सिसा (धातु)', category: 'metal', price: 140, unit: 'kg', trend: 'down', emoji: '⚙️',
        imageUrl: '/items/battery.jpg' },
      { name: 'Zinc / Sheets', nameNp: 'जस्ता पाता', category: 'metal', price: 85, unit: 'kg', trend: 'stable', emoji: '🏗️',
        imageUrl: '/items/zinc.jpg' },
      // PAPER
      { name: 'Newspaper', nameNp: 'पत्रपत्रिका', category: 'paper', price: 15, unit: 'kg', trend: 'stable', emoji: '📰',
        imageUrl: '/items/newspaper.jpg' },
      { name: 'Books/Notebooks', nameNp: 'किताब/कापी', category: 'paper', price: 11, unit: 'kg', trend: 'down', emoji: '📚',
        imageUrl: '/items/newspaper.jpg' },
      { name: 'Cardboard', nameNp: 'कार्टुन', category: 'paper', price: 9, unit: 'kg', trend: 'stable', emoji: '📦',
        imageUrl: '/items/cardboard.jpg' },
      { name: 'White Paper', nameNp: 'सेतो कागज', category: 'paper', price: 21, unit: 'kg', trend: 'up', emoji: '📄',
        imageUrl: '/items/newspaper.jpg' },
      { name: 'Magazines', nameNp: 'म्यागजिन', category: 'paper', price: 9, unit: 'kg', trend: 'stable', emoji: '📖',
        imageUrl: '/items/newspaper.jpg' },
      // PLASTIC
      { name: 'PET Bottles', nameNp: 'प्लास्टिक बोतल', category: 'plastic', price: 11, unit: 'kg', trend: 'stable', emoji: '♻️',
        imageUrl: '/items/plastic.jpg' },
      { name: 'Hard Plastic', nameNp: 'कडा प्लास्टिक (कुर्सी/बाल्टिन)', category: 'plastic', price: 9, unit: 'kg', trend: 'stable', emoji: '🪑',
        imageUrl: '/items/hardplastic.jpg' },
      { name: 'Plastic Bags', nameNp: 'प्लास्टिक झोला', category: 'plastic', price: 4, unit: 'kg', trend: 'down', emoji: '🛍️',
        imageUrl: '/items/plastic.jpg' },
      { name: 'HDPE Containers', nameNp: 'एच.डी.पी.इ (जार/ड्रम)', category: 'plastic', price: 16, unit: 'kg', trend: 'up', emoji: '🧴',
        imageUrl: '/items/plastic.jpg' },
      // ELECTRONICS
      { name: 'Computers/Laptops', nameNp: 'कम्प्युटर/ल्यापटप', category: 'electronics', price: 90, unit: 'kg', trend: 'stable', emoji: '💻',
        imageUrl: '/items/ewaste.jpg' },
      { name: 'Mobile Phones', nameNp: 'मोबाइल फोन', category: 'electronics', price: 175, unit: 'kg', trend: 'up', emoji: '📱',
        imageUrl: '/items/mobile.jpg' },
      { name: 'TV/Monitors', nameNp: 'टिभी/मोनिटर', category: 'electronics', price: 40, unit: 'kg', trend: 'down', emoji: '📺',
        imageUrl: '/items/ewaste.jpg' },
      { name: 'Refrigerators', nameNp: 'फ्रिज', category: 'electronics', price: 25, unit: 'kg', trend: 'stable', emoji: '🧊',
        imageUrl: '/items/appliances.jpg' },
      { name: 'Washing Machines', nameNp: 'वाशिङ मेसिन', category: 'electronics', price: 20, unit: 'kg', trend: 'stable', emoji: '🧺',
        imageUrl: '/items/appliances.jpg' },
      { name: 'Wires/Cables', nameNp: 'तार/केबल', category: 'electronics', price: 135, unit: 'kg', trend: 'up', emoji: '🔌',
        imageUrl: '/items/wires.jpg' },
      { name: 'Old Batteries', nameNp: 'ब्याट्री (इन्भर्टर/गाडी)', category: 'electronics', price: 140, unit: 'kg', trend: 'up', emoji: '🔋',
        imageUrl: '/items/battery.jpg' },
      // GLASS
      { name: 'Glass Bottles', nameNp: 'सिसा बोतल', category: 'glass', price: 2, unit: 'piece', trend: 'stable', emoji: '🍶',
        imageUrl: '/items/glass.jpg' },
      { name: 'Glass Sheets', nameNp: 'सिसा पाता', category: 'glass', price: 1, unit: 'kg', trend: 'down', emoji: '🪟',
        imageUrl: '/items/glass.jpg' },
    ].map(p => ({ ...p, history: [p.price, p.price, p.price, p.price, p.price, p.price, p.price] }));

    await Price.insertMany(prices);
    console.log('Prices Seeded');

    const blogs = [
      { title: 'Top 5 E-waste Recycling Tips in Nepal', titleNp: 'नेपालमा ई-कचरा व्यवस्थापनका ५ उपायहरू', slug: 'e-waste-recycling-tips', category: 'tips', author: 'Sujan Nepal', content: '<p>Learn how to properly dispose of your electronics...</p>', excerpt: 'Dispose of electronics responsibly in Nepal.' },
      { title: 'Why Kabadi Rates Fluctuate', titleNp: 'कबाडीको मूल्य किन तलमाथि हुन्छ?', slug: 'why-kabadi-rates-fluctuate', category: 'guide', author: 'Kabadi Team', content: '<p>Market prices are influenced by global supply...</p>', excerpt: 'Understanding the economics of scrap in Nepal.' },
      { title: 'Plastic Pollution in Bagmati', titleNp: 'बागमती नदीमा प्लास्टिक प्रदूषण', slug: 'plastic-pollution-bagmati', category: 'environment', author: 'Ramesh K', content: '<p>Bagmati river has been suffering from extreme plastic waste...</p>', excerpt: 'How we can save our holy river.' },
      { title: 'KabadiBhaiya Expands to Bhaktapur', titleNp: 'कवाडीभैया अब भक्तपुरमा पनि', slug: 'kabadi-bhaiya-bhaktapur', category: 'news', author: 'Admin', content: '<p>We are happy to announce our services are now available in Bhaktapur.</p>', excerpt: 'Schedule free pickups in Bhaktapur today.' },
      { title: 'How to Segregate Waste at Home', titleNp: 'घरमै फोहोर कसरी छुट्टाउने', slug: 'segregate-waste-home', category: 'tips', author: 'Sita Sharma', content: '<p>Keep wet waste separate from dry recyclable waste...</p>', excerpt: 'A simple guide to waste segregation.' },
      { title: 'Upcycling: Give Old Items New Life', titleNp: 'पुराना सामानको नयाँ प्रयोग', slug: 'upcycling-ideas', category: 'guide', author: 'Art Nepal', content: '<p>Before you sell it to kabadi, see if you can upcycle it!</p>', excerpt: 'Creative ways to reuse old materials.' }
    ];

    await BlogPost.insertMany(blogs);
    console.log('Blogs Seeded');

    // Upsert Admin user with official email and phone
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'nepalikabadibhaiya@gmail.com';
    const adminPhone = process.env.ADMIN_DEFAULT_PHONE || '97426869215';
    const passwordHash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@1234', 12);

    await User.findOneAndUpdate(
      { $or: [{ email: adminEmail }, { phone: adminPhone }, { username: 'admin' }] },
      {
        name: 'KabadiBhaiya Admin',
        username: 'admin',
        phone: adminPhone,
        email: adminEmail,
        passwordHash,
        role: 'admin',
        city: 'Kathmandu',
        isPhoneVerified: true,
        loyaltyPoints: 100,
      },
      { upsert: true, new: true }
    );
    console.log(`Admin user ready: ${adminEmail} / ${adminPhone} / admin`);

    console.log('Seeding Complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
};

seedDB();
