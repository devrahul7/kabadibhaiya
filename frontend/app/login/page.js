'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Recycle, Loader2, Eye, EyeOff, Camera, CheckCircle, Mail } from 'lucide-react';

// ─── Validation Schemas ────────────────────────────────────────────────────────

const loginSchema = z.object({
  phoneOrEmail: z.string().min(1, 'Username, phone, or email is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, underscores only')
    .optional()
    .or(z.literal('')),
  phone: z.string().regex(/^(97|98)\d{8,9}$/, 'Valid Nepal number: 97/98XXXXXXXX'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur']),
  password: z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Must contain a letter and a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ─── Google Button Component ───────────────────────────────────────────────────

function GoogleLoginBtn({ onSuccess, label = 'Continue with Google' }) {
  const divRef = useRef(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

    const loadGSI = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: onSuccess,
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(divRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: divRef.current?.offsetWidth || 380,
        text: 'continue_with',
      });
    };

    if (window.google) {
      loadGSI();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = loadGSI;
      document.head.appendChild(script);
    }
  }, [onSuccess]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 text-gray-500 text-sm bg-gray-50 cursor-not-allowed"
        disabled
      >
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        Google Sign-In (add GOOGLE_CLIENT_ID to .env.local)
      </button>
    );
  }

  return <div ref={divRef} className="w-full flex justify-center" />;
}

// ─── Avatar Upload Preview ─────────────────────────────────────────────────────

function AvatarUpload({ onChange }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    onChange(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-24 h-24 rounded-full border-4 border-dashed border-primary/40 hover:border-primary bg-primary/5 flex items-center justify-center overflow-hidden transition-colors group"
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-primary transition-colors">
            <Camera className="w-7 h-7" />
            <span className="text-xs font-medium">Upload</span>
          </div>
        )}
        {preview && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}
      </button>
      <span className="text-xs text-gray-400">Profile photo (optional)</span>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─── OTP Step ─────────────────────────────────────────────────────────────────

function OtpStep({ emailOrPhone, onVerified, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { emailOrPhone, otp: code });
      toast.success('✅ Verified successfully!');
      onVerified();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await api.post('/auth/send-otp', { emailOrPhone });
      toast.success('New OTP sent!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error('Could not resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">Verify Your Email</h3>
        <p className="text-sm text-gray-500">
          A 6-digit OTP was sent to <strong>{emailOrPhone}</strong>
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (refs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-11 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || resending}
          className={`font-medium ${countdown > 0 ? 'text-gray-400' : 'text-primary hover:underline'}`}
        >
          {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
}

// ─── Forgot Password Step ───────────────────────────────────────────────────

function ForgotPasswordStep({ onBack, onComplete }) {
  const [subStep, setSubStep] = useState('request'); // 'request' | 'reset'
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    let timer;
    if (subStep === 'reset') {
      timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    }
    return () => clearInterval(timer);
  }, [subStep]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || emailOrPhone.trim().length < 3) {
      toast.error('Please enter your email, phone, or username');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { emailOrPhone: emailOrPhone.trim() });
      toast.success(res.data.message || 'Password reset code sent!');
      setSubStep('reset');
      setCountdown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter the 6-digit reset code');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
      toast.error('Password must contain at least one letter and one number');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        emailOrPhone: emailOrPhone.trim(),
        otp: code,
        newPassword,
      });
      toast.success(res.data.message || 'Password reset successfully! Please sign in.');
      onComplete();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { emailOrPhone: emailOrPhone.trim() });
      toast.success('New reset code sent!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error('Could not resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  if (subStep === 'request') {
    return (
      <form onSubmit={handleRequestOtp} className="space-y-5 animate-fade-in-up">
        <div className="text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔐</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">Forgot Password?</h3>
          <p className="text-xs text-gray-500">
            Enter your registered email, phone number, or username to receive a 6-digit reset code.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email / Phone / Username *
          </label>
          <input
            type="text"
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm font-medium"
            placeholder="e.g. 97426869215 or admin or email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20 text-sm"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code →'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-800 py-1"
        >
          ← Back to Sign In
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in-up">
      <div className="text-center">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">Set New Password</h3>
        <p className="text-xs text-gray-500">
          Enter the 6-digit OTP code sent for <strong>{emailOrPhone}</strong>
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (refs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
            className="w-10 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50"
          />
        ))}
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password *</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 pr-10 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm font-medium"
            placeholder="Min 8 chars, letter + number"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password *</label>
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm font-medium"
          placeholder="Repeat new password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20 text-sm"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '✓ Reset Password & Sign In'}
      </button>

      <div className="flex items-center justify-between text-xs pt-1">
        <button type="button" onClick={() => setSubStep('request')} className="text-gray-500 hover:text-gray-700">
          ← Change Account
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || loading}
          className={`font-semibold ${countdown > 0 ? 'text-gray-400' : 'text-primary hover:underline'}`}
        >
          {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
        </button>
      </div>
    </form>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'done'
  const [registeredEmail, setRegisteredEmail] = useState('');

  const { user, login } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { city: 'Kathmandu' },
  });

  // ─── Login ──────────────────────────────────────────────────────────────────

  const onLogin = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Google Auth ────────────────────────────────────────────────────────────

  const onGoogleSuccess = useCallback(async (response) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', { credential: response.credential });
      login(res.data.user);
      toast.success(`Welcome, ${res.data.user.name}! 🎉`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  }, [login, router]);

  // ─── Register ───────────────────────────────────────────────────────────────

  const onRegister = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.username) formData.append('username', data.username.toLowerCase());
      formData.append('phone', data.phone);
      if (data.email) formData.append('email', data.email);
      formData.append('city', data.city);
      formData.append('password', data.password);
      if (avatarFile) formData.append('profileImage', avatarFile);

      const res = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      login(res.data.user);
      toast.success('Account created! 50 bonus points awarded 🎉');

      // If email was provided, go to OTP step
      if (data.email) {
        setRegisteredEmail(data.email);
        setStep('otp');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpVerified = () => {
    setStep('done');
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  if (user && step !== 'otp') return null;

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary-dark p-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          <div className="flex justify-center mb-2 relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Recycle className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold relative z-10">KabadiBhaiya</h2>
          <p className="text-orange-100 text-sm relative z-10">Nepal's Scrap Recycling Platform</p>
        </div>

        {/* Tabs */}
        {step === 'form' && (
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-4 font-bold text-sm capitalize transition-all ${
                activeTab === 'login'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('login')}
            >
              🔑 Sign In
            </button>
            <button
              className={`flex-1 py-4 font-bold text-sm capitalize transition-all ${
                activeTab === 'register'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('register')}
            >
              ✨ Create Account
            </button>
          </div>
        )}

        <div className="p-7">

          {/* ── OTP Step ── */}
          {step === 'otp' && (
            <OtpStep
              emailOrPhone={registeredEmail}
              onVerified={onOtpVerified}
              onBack={() => setStep('form')}
            />
          )}

          {/* ── Done Step ── */}
          {step === 'done' && (
            <div className="text-center py-8 animate-fade-in-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">All Verified! 🎉</h3>
              <p className="text-gray-500">Redirecting to your dashboard...</p>
            </div>
          )}

          {/* ── FORGOT PASSWORD STEP ── */}
          {step === 'form' && activeTab === 'forgot' && (
            <ForgotPasswordStep
              onBack={() => setActiveTab('login')}
              onComplete={() => setActiveTab('login')}
            />
          )}

          {/* ── LOGIN FORM ── */}
          {step === 'form' && activeTab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5 animate-fade-in-up">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username / Phone / Email
                </label>
                <input
                  {...loginForm.register('phoneOrEmail')}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="e.g. ram_bahadur / 97426869215 / admin"
                />
                {loginForm.formState.errors.phoneOrEmail && (
                  <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.phoneOrEmail.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...loginForm.register('password')}
                    className="w-full p-3.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm font-medium"
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20 text-sm"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '→ Sign In'}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <GoogleLoginBtn onSuccess={onGoogleSuccess} label="Sign in with Google" />
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {step === 'form' && activeTab === 'register' && (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4 animate-fade-in-up">


              {/* Profile Photo */}
              <AvatarUpload onChange={setAvatarFile} />

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  {...registerForm.register('name')}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="Ram Bahadur Thapa"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username <span className="text-gray-400 font-normal">(optional — auto-generated if blank)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
                  <input
                    {...registerForm.register('username')}
                    className="w-full pl-8 p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                    placeholder="ram_bahadur"
                  />
                </div>
                {registerForm.formState.errors.username && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.username.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                <div className="flex">
                  <span className="bg-gray-100 border border-gray-200 border-r-0 rounded-l-xl px-4 py-3.5 text-gray-600 font-semibold text-sm">
                    +977
                  </span>
                  <input
                    {...registerForm.register('phone')}
                    className="flex-1 p-3.5 rounded-r-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                    placeholder="97426869215"
                    maxLength="12"
                  />
                </div>
                {registerForm.formState.errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email <span className="text-gray-400 font-normal">(for OTP verification)</span>
                </label>
                <input
                  type="email"
                  {...registerForm.register('email')}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="ram@example.com"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                <select
                  {...registerForm.register('city')}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('password')}
                    className="w-full p-3.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                    placeholder="Min 8 chars, letter + number"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerForm.register('confirmPassword')}
                    className="w-full p-3.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                    placeholder="Repeat password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {/* T&C */}
              <div className="flex items-start gap-2 py-1">
                <input type="checkbox" required id="tnc" className="mt-0.5 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                <label htmlFor="tnc" className="text-xs text-gray-500 leading-tight">
                  I agree to the Terms & Conditions. I'll receive <span className="text-primary font-semibold">50 bonus points</span> on signup.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '✨ Create Account'}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <GoogleLoginBtn onSuccess={onGoogleSuccess} label="Register with Google" />
            </form>
          )}

          {step === 'form' && (
            <div className="mt-5 pt-5 border-t border-gray-100 text-center">
              <Link href="/schedule" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                Continue as guest — Schedule pickup →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
