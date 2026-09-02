'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { getAvatarUrl } from '@/lib/apiConfig';
import { Camera, Loader2, CheckCircle2, User as UserIcon, Mail, Phone, MapPin, Award } from 'lucide-react';


export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      city: user?.city || 'Kathmandu'
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        city: user.city || 'Kathmandu'
      });
    }
  }, [user, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size must be less than 3MB');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
    toast.success('New photo selected! Click "Save Changes" to apply.');
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name.trim());
      if (data.username) formData.append('username', data.username.trim().toLowerCase());
      if (data.email) formData.append('email', data.email.trim().toLowerCase());
      formData.append('city', data.city);
      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }

      const res = await api.put('/auth/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success && res.data.user) {
        setUser({
          ...res.data.user,
          hasProfileImage: true,
          avatarVersion: Date.now(), // cache buster
        });
        setAvatarFile(null);
        toast.success('🎉 Profile & picture updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Determine avatar image source
  const currentAvatarSrc = previewUrl
    ? previewUrl
    : user?.googlePicture
    ? user.googlePicture
    : user?.hasProfileImage
    ? getAvatarUrl(user.id || user._id, user.avatarVersion || 1)
    : null;


  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 mb-8">
        
        {/* Header with Loyalty Points Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Profile Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your personal details and profile picture</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-dark font-extrabold px-4 py-2 rounded-2xl border border-primary/20 text-sm">
            <Award className="w-5 h-5 text-primary" />
            <span>{user?.loyaltyPoints || 0} Green Points</span>
            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              {user?.tier || 'Bronze'}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Profile Picture Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-200/80">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-primary/10 border-4 border-white shadow-md flex items-center justify-center">
                {currentAvatarSrc ? (
                  <img
                    src={currentAvatarSrc}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = ''; }}
                  />
                ) : (
                  <span className="text-3xl font-black text-primary">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 border-2 border-white"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h3 className="font-bold text-gray-800 text-base">{user?.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">@{user?.username || 'user'}</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 transition-colors shadow-xs"
                >
                  Upload New Photo
                </button>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => { setAvatarFile(null); setPreviewUrl(null); }}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">Supports JPG, PNG, WEBP (Max 3MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Phone Number (Uneditable) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone Number (Verified)
              </label>
              <input
                value={`+977 ${user?.phone || '97426869215'}`}
                disabled
                className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 font-semibold cursor-not-allowed text-sm"
              />
              <p className="text-[11px] text-gray-400 mt-1">Phone number is locked to your account.</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-gray-400" /> Username
              </label>
              <input
                {...register('username')}
                placeholder="ram_thapa"
                className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Full Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="ram@example.com"
                className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Primary Pickup City
            </label>
            <select
              {...register('city')}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
            >
              <option value="Kathmandu">Kathmandu (काठमाडौं)</option>
              <option value="Lalitpur">Lalitpur (ललितपुर)</option>
              <option value="Bhaktapur">Bhaktapur (भक्तपुर)</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-70 flex items-center gap-2 active:scale-95 text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

