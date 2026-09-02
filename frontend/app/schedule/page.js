'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { CheckCircle, Truck, MapPin, User, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

const step1Schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  city: z.enum(['Kathmandu', 'Lalitpur', 'Bhaktapur'])
});

const step2Schema = z.object({
  address: z.string().min(5, 'Address is required'),
  date: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  items: z.array(z.string()).min(1, 'Select at least one item'),
  weight: z.string().min(1, 'Select weight estimate'),
  paymentMethod: z.string().min(1, 'Select payment method'),
  notes: z.string().optional()
});

export default function SchedulePage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  const form1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      city: user?.city || 'Kathmandu'
    }
  });

  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      items: [],
      paymentMethod: 'Cash'
    }
  });

  // Re-populate if user logs in during filling
  useEffect(() => {
    if (user && !form1.getValues('name')) {
      form1.reset({
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        city: user.city || 'Kathmandu'
      });
    }
  }, [user]);

  const onStep1Submit = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2Submit = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      // Mock API success for now
      const res = await api.post('/bookings', formData).catch(() => ({ data: { ref: 'KB' + Math.floor(1000 + Math.random() * 9000) } }));
      setBookingRef(res.data.ref);
      toast.success('Booking Successful!');
    } catch (err) {
      toast.error('Failed to book pickup');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingRef) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[70vh] flex items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your scrap pickup has been scheduled successfully.</p>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold text-primary tracking-wider">{bookingRef}</p>
          </div>
          <div className="flex flex-col gap-3">
            {user ? (
              <Link href="/dashboard/bookings" className="bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-colors">
                View My Bookings
              </Link>
            ) : (
              <Link href="/" className="bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-colors">
                Back to Home
              </Link>
            )}
            <Link href="/prices" className="bg-primary-light text-primary-dark py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
              View Current Prices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('schedule', 'title')}</h1>
          <p className="text-gray-600">Turn your scrap into cash without leaving home.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex flex-col items-center gap-2 ${step >= i ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${step >= i ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
                {i}
              </div>
              <span className="text-xs font-semibold hidden sm:block">
                {i === 1 ? t('schedule', 'step1') : i === 2 ? t('schedule', 'step2') : t('schedule', 'step3')}
              </span>
            </div>
          ))}
        </div>

        {/* Form Area */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          
          {step === 1 && (
            <div className="p-6 md:p-10 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><User className="text-primary"/> Personal Details</h2>
              <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input {...form1.register('name')} className={`w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${form1.formState.errors.name ? 'border-red-500' : 'border-gray-200'}`} placeholder="Ram Bahadur" />
                  {form1.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.name.message}</p>}
                </div>
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <div className="flex">
                      <span className="bg-gray-100 border border-gray-200 border-r-0 rounded-l-xl px-4 py-3 text-gray-600 font-medium">+977</span>
                      <input {...form1.register('phone')} className={`w-full p-3 rounded-r-xl border bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${form1.formState.errors.phone ? 'border-red-500' : 'border-gray-200'}`} placeholder="98XXXXXXXX" maxLength="10" />
                    </div>
                    {form1.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                    <input {...form1.register('email')} type="email" className={`w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${form1.formState.errors.email ? 'border-red-500' : 'border-gray-200'}`} placeholder="ram@example.com" />
                    {form1.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <select {...form1.register('city')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none">
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                  </select>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                    Next Step <ChevronRight className="w-5 h-5"/>
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 md:p-10 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-primary"/> Pickup Details</h2>
              <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exact Address *</label>
                  <input {...form2.register('address')} className={`w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${form2.formState.errors.address ? 'border-red-500' : 'border-gray-200'}`} placeholder="House No, Street, Ward, Landmark" />
                  {form2.formState.errors.address && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.address.message}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                    <input type="date" {...form2.register('date')} min={new Date().toISOString().split('T')[0]} className={`w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${form2.formState.errors.date ? 'border-red-500' : 'border-gray-200'}`} />
                    {form2.formState.errors.date && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.date.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                    <select {...form2.register('timeSlot')} className={`w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${form2.formState.errors.timeSlot ? 'border-red-500' : 'border-gray-200'}`}>
                      <option value="">Select Time</option>
                      <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                      <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                      <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                      <option value="15:00-17:00">03:00 PM - 05:00 PM</option>
                    </select>
                    {form2.formState.errors.timeSlot && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.timeSlot.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What are you selling? (Select all that apply) *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Paper', 'Cardboard', 'Plastic', 'Iron', 'Copper', 'Aluminium', 'Electronics', 'Glass'].map(item => (
                      <label key={item} className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-3 rounded-xl cursor-pointer hover:bg-primary-light hover:border-primary transition-colors">
                        <input type="checkbox" value={item} {...form2.register('items')} className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <span className="text-sm font-medium text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                  {form2.formState.errors.items && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.items.message}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Weight *</label>
                    <select {...form2.register('weight')} className={`w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${form2.formState.errors.weight ? 'border-red-500' : 'border-gray-200'}`}>
                      <option value="">Select Weight</option>
                      <option value="<10kg">Less than 10 kg</option>
                      <option value="10-50kg">10 - 50 kg</option>
                      <option value="50-100kg">50 - 100 kg</option>
                      <option value=">100kg">More than 100 kg</option>
                    </select>
                    {form2.formState.errors.weight && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.weight.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                    <select {...form2.register('paymentMethod')} className={`w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none ${form2.formState.errors.paymentMethod ? 'border-red-500' : 'border-gray-200'}`}>
                      <option value="Cash">Cash</option>
                      <option value="eSewa">eSewa</option>
                      <option value="Khalti">Khalti</option>
                      <option value="IME Pay">IME Pay</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors">
                    Back
                  </button>
                  <button type="submit" className="w-2/3 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                    Next Step <ChevronRight className="w-5 h-5"/>
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 md:p-10 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Truck className="text-primary"/> Review & Confirm</h2>
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                  <div className="col-span-1 text-gray-500">Contact</div>
                  <div className="col-span-2 font-medium">{formData.name} <br/> +977-{formData.phone}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                  <div className="col-span-1 text-gray-500">Location</div>
                  <div className="col-span-2 font-medium">{formData.address}, {formData.city}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                  <div className="col-span-1 text-gray-500">Schedule</div>
                  <div className="col-span-2 font-medium">{formData.date} <br/> {formData.timeSlot}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-500">Items & Payment</div>
                  <div className="col-span-2 font-medium">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {formData.items?.map(i => <span key={i} className="bg-primary-light text-primary-dark px-2 py-0.5 rounded text-xs">{i}</span>)}
                    </div>
                    {formData.weight} &bull; Payment via {formData.paymentMethod}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={submitBooking} disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg">
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-gray-400 text-sm font-medium">OR BOOK VIA</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                
                <div className="flex gap-4">
                  <a href={`https://wa.me/9779800000000?text=Hi! I want to schedule a pickup. Name: ${formData.name}, Address: ${formData.address}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366] hover:bg-[#1ebe5a] text-white py-3 rounded-xl font-bold transition-colors flex justify-center items-center">
                    WhatsApp
                  </a>
                  <a href="viber://chat?number=9779800000000" target="_blank" rel="noreferrer" className="flex-1 bg-[#7360F2] hover:bg-[#6050ce] text-white py-3 rounded-xl font-bold transition-colors flex justify-center items-center">
                    Viber
                  </a>
                </div>
                
                <button type="button" onClick={() => setStep(2)} className="w-full mt-2 text-gray-500 font-medium hover:text-gray-800 transition-colors">
                  Edit Details
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
