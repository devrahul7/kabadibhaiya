import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Chatbot from '@/components/ui/Chatbot';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'KabadiBhaiya - Scrap Recycling in Nepal',
  description: 'Schedule a free pickup for your scrap in Kathmandu, Lalitpur, and Bhaktapur.',
  manifest: '/manifest.json',
  themeColor: '#e67e22',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={poppins.className}>
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Chatbot />
            <Footer />
            <Toaster position="top-right" />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
