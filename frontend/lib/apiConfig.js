export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getApiUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export const getAvatarUrl = (userId, version) => {
  if (!userId) return '';
  const base = `${API_BASE_URL}/api/auth/avatar/${userId}`;
  return version ? `${base}?v=${version}` : base;
};

export const getPriceImageUrl = (itemId) => {
  if (!itemId) return '';
  return `${API_BASE_URL}/api/prices/image/${itemId}`;
};
