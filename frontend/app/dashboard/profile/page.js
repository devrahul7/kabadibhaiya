'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      city: user?.city || 'Kathmandu'
    }
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      // Mock API call
      setTimeout(() => {
        setUser({ ...user, ...data });
        toast.success('Profile updated successfully');
        setIsSaving(false);
      }, 1000);
    } catch(err) {
      toast.error('Failed to update profile');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Uneditable)</label>
            <input value={`+977-${user?.phone}`} disabled className="w-full p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input {...register('name')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input {...register('email')} type="email" className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select {...register('city')} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none">
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
            </select>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-70">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
