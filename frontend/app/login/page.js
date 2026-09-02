'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Recycle, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  phone: z.string().min(1, 'Phone or email is required'),
  password: z.string().min(1, 'Password is required')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur']),
  password: z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match", path: ['confirmPassword']
});

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.user);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      login(res.data.user);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return null; // Avoid flicker

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-primary p-6 text-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="flex justify-center mb-2"><Recycle className="w-10 h-10" /></div>
          <h2 className="text-2xl font-bold">KabadiBhaiya</h2>
          <p className="text-primary-light text-sm">Your scrap, our responsibility.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'login' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('login')}
          >
            {t('auth', 'loginTitle')}
          </button>
          <button 
            className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'register' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('register')}
          >
            {t('auth', 'registerTitle')}
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone or Email</label>
                <input {...loginForm.register('phone')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="Enter phone or email" />
                {loginForm.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.phone.message}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button type="button" onClick={() => toast('Call +977-9800000000 to reset password', {icon: '📞'})} className="text-xs text-primary hover:underline">Forgot?</button>
                </div>
                <input type="password" {...loginForm.register('password')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="Enter password" />
                {loginForm.formState.errors.password && <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.password.message}</p>}
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...registerForm.register('name')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="Ram Bahadur" />
                {registerForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex">
                  <span className="bg-gray-100 border border-gray-200 border-r-0 rounded-l-xl px-4 py-3 text-gray-600 font-medium">+977</span>
                  <input {...registerForm.register('phone')} className="w-full p-3 rounded-r-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="98XXXXXXXX" maxLength="10" />
                </div>
                {registerForm.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select {...registerForm.register('city')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none">
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" {...registerForm.register('password')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="Create a password" />
                {registerForm.formState.errors.password && <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" {...registerForm.register('confirmPassword')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="Confirm password" />
                {registerForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start gap-2 py-2">
                <input type="checkbox" required className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                <span className="text-xs text-gray-500 leading-tight">I agree to the Terms & Conditions and Privacy Policy. I will earn 50 bonus points upon signup.</span>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link href="/schedule" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
              {t('auth', 'guestNote')} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
