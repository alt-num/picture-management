export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
  headers: {
    'Content-Type': 'application/json',
  },
  uploadMaxSize: Number(import.meta.env.VITE_UPLOAD_MAX_SIZE) || 5 * 1024 * 1024, // 5MB default
}; 