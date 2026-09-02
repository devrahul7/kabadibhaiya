require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Price = require('../models/Price');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Connected for Seeding');

    await Price.deleteMany();
    await BlogPost.deleteMany();
    console.log('Cleared existing Prices and BlogPosts');

    const prices = [
      { name: 'Iron/Steel', nameNp: 'फलाम/स्टिल', category: 'metal', price: 28, trend: 'stable' },
      { name: 'Copper', nameNp: 'तामा', category: 'metal', price: 550, trend: 'up' },
      { name: 'Brass', nameNp: 'पित्तल', category: 'metal', price: 380, trend: 'stable' },
      { name: 'Aluminium', nameNp: 'एल्युमिनियम', category: 'metal', price: 95, trend: 'up' },
      { name: 'Stainless Steel', nameNp: 'खिया नलाग्ने स्टिल', category: 'metal', price: 45, trend: 'stable' },
      { name: 'Lead', nameNp: 'सिसा (धातु)', category: 'metal', price: 140, trend: 'down' },
      { name: 'Zinc', nameNp: 'जस्ता', category: 'metal', price: 85, trend: 'stable' },
      { name: 'Newspaper', nameNp: 'पत्रपत्रिका', category: 'paper', price: 15, trend: 'stable' },
      { name: 'Books/Notebooks', nameNp: 'किताब/कापी', category: 'paper', price: 11, trend: 'down' },
      { name: 'Cardboard', nameNp: 'कार्टुन', category: 'paper', price: 9, trend: 'stable' },
      { name: 'White Paper', nameNp: 'सेतो कागज', category: 'paper', price: 21, trend: 'up' },
      { name: 'Magazines', nameNp: 'म्यागजिन', category: 'paper', price: 9, trend: 'stable' },
      { name: 'PET Bottles', nameNp: 'प्लास्टिक बोतल', category: 'plastic', price: 11, trend: 'stable' },
      { name: 'Hard Plastic', nameNp: 'कडा प्लास्टिक', category: 'plastic', price: 9, trend: 'stable' },
      { name: 'Plastic Bags', nameNp: 'प्लास्टिक झोला', category: 'plastic', price: 4, trend: 'down' },
      { name: 'HDPE', nameNp: 'एच.डी.पी.इ', category: 'plastic', price: 16, trend: 'up' },
      { name: 'Computers/Laptops', nameNp: 'कम्प्युटर/ल्यापटप', category: 'electronics', price: 90, trend: 'stable' },
      { name: 'Mobile Phones', nameNp: 'मोबाइल फोन', category: 'electronics', price: 175, trend: 'up' },
      { name: 'TV/Monitors', nameNp: 'टिभी/मोनिटर', category: 'electronics', price: 40, trend: 'down' },
      { name: 'Refrigerators', nameNp: 'फ्रिज', category: 'electronics', price: 25, trend: 'stable' },
      { name: 'Washing Machines', nameNp: 'वाशिङ मेसिन', category: 'electronics', price: 20, trend: 'stable' },
      { name: 'Wires/Cables', nameNp: 'तार/केबल', category: 'electronics', price: 135, trend: 'up' },
      { name: 'Glass Bottles', nameNp: 'सिसा बोतल', category: 'glass', price: 2, trend: 'stable' },
      { name: 'Glass Sheets', nameNp: 'सिसा पाता', category: 'glass', price: 1, trend: 'down' },
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

    const adminExists = await User.findOne({ email: 'admin@kabadibhaiya.com.np' });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('Admin@1234', 12);
      await User.create({
        name: 'Super Admin',
        phone: '9800000000',
        email: 'admin@kabadibhaiya.com.np',
        passwordHash,
        role: 'admin',
        city: 'Kathmandu'
      });
      console.log('Admin user created');
    }

    console.log('Seeding Complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
};

seedDB();
