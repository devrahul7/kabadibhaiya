# KabadiBhaiya 🗑️♻️
**Nepal's #1 Kabadi (Scrap) Pickup Platform**

> Full-stack web app: Next.js 14 frontend · Express/Node.js backend · MongoDB · bcrypt · JWT · Gemini AI Chatbot

---

## 🗂️ Project Structure
```
kabadi_website/
├── backend/       Express REST API + MongoDB
└── frontend/      Next.js 14 App Router
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`) **OR** a MongoDB Atlas URI
- Git

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env — set your MONGO_URI if using Atlas
npm install
npm run seed        # Seeds prices, blog posts & admin user
npm run dev         # Starts API on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local   # (already configured for localhost)
npm install
npm run dev         # Starts Next.js on http://localhost:3000
```

Open **http://localhost:3000** in your browser 🎉

---

## 🔐 Default Admin Credentials
| Field | Value |
|---|---|
| Email | admin@kabadibhaiya.com.np |
| Password | Admin@1234 |

> Access admin panel at: http://localhost:3000/admin

---

## 🌐 API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns httpOnly JWT cookies) |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/chat` | Gemini AI chatbot |
| GET | `/api/prices` | All kabadi prices |
| POST | `/api/bookings` | Create pickup booking |
| GET | `/api/bookings/my` | My bookings (auth required) |
| GET | `/api/blog` | Blog posts |
| GET | `/api/admin/stats` | Admin stats (admin role only) |

---

## 🛡️ Security Features
- **bcrypt** (12 rounds) — password hashing
- **JWT** — access (15min) + refresh (7d) tokens in **httpOnly cookies**
- **helmet** — security headers
- **express-rate-limit** — 5 login attempts/min, 20 chat messages/min
- **mongo-sanitize** — NoSQL injection prevention
- **Zod** — strict input validation on all routes
- **Account lockout** — after 5 failed login attempts (15 min lock)
- **CORS** — restricted to frontend origin only
- Gemini API key **never exposed to browser** — server-side only

---

## 📱 Features
- 🟠🟢 Orange & Green theme (Nepal-inspired)
- 🌐 English / नेपाली bilingual toggle
- 🤖 **Gemini AI chatbot** (KabadiBot) — answers all kabadi questions
- 📊 Live price table with 7-day trend charts
- 🧮 Kabadi earnings calculator
- 🗺️ Leaflet map — Kathmandu Valley coverage
- 📅 Multi-step pickup booking form
- 💳 eSewa, Khalti, IME Pay, Cash payment info
- 📱 WhatsApp & Viber quick-book buttons
- 🏆 Loyalty rewards (Bronze → Silver → Gold)
- 👤 User dashboard (bookings, earnings, profile)
- 🔒 Admin dashboard (manage all bookings)
- 📰 Blog with recycling tips & Nepal news

---

## 🏙️ Service Cities
- **Kathmandu** — Full Coverage
- **Lalitpur (Patan)** — Full Coverage
- **Bhaktapur** — Full Coverage

**Working Hours:** Sunday – Friday, 9:00 AM – 6:00 PM NPT  
**Contact:** +977-9800000000 | hello@kabadibhaiya.com.np
