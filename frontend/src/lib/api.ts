import axios from 'axios';

<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com';
=======
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://namssnapi.onrender.com/api';
>>>>>>> 5a98c4268eb16c81d34e0d92059f9da8a2b20e63

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { username: string; password: string; role: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Newsletter API
export const newsletterAPI = {
  getAll: async () => {
    const response = await api.get('/newsletters');
    return response.data;
  },
  
  upload: async (formData: FormData) => {
    const response = await api.post('/newsletters', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/newsletters/${id}`);
    return response.data;
  },
  
  getDownloadUrl: async (id: number) => {
    const response = await api.get(`/newsletters/${id}/download`);
    return response.data;
  },
};

// Academic API
export const academicAPI = {
  getLinks: async () => {
    const response = await api.get('/academic-links');
    return response.data;
  },
  updateLinks: async (links: Record<string, string>) => {
    const response = await api.put('/academic-links', links);
    return response.data;
  },
};

// Change Password API
export const changePasswordAPI = {
  change: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/change-password', { oldPassword, newPassword });
    return response.data;
  },
};

// Articles API
export const articlesAPI = {
  getAll: async (params?: { category?: string; limit?: number; page?: number }) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },
  
  create: async (formData: FormData) => {
    const response = await api.post('/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  update: async (id: number, formData: FormData) => {
    const response = await api.put(`/articles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },
  
  getAllAdmin: async () => {
    const response = await api.get('/articles/admin/all');
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getAll: async (params?: { status?: string; limit?: number; page?: number }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },
  
  create: async (formData: FormData) => {
    const response = await api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  update: async (id: number, formData: FormData) => {
    const response = await api.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// Gallery API
export const galleryAPI = {
  getAll: async (params?: { eventId?: number; mediaType?: string; limit?: number; page?: number }) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },
  
  upload: async (formData: FormData) => {
    const response = await api.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/gallery/stats');
    return response.data;
  },
};

// Book Club API
export const bookClubAPI = {
  getCurrentBook: async () => {
    const response = await api.get('/bookclub/current');
    return response.data;
  },
  
  updateCurrentBook: async (formData: FormData) => {
    const response = await api.put('/bookclub/current', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getBooks: async (params?: { status?: string }) => {
    const response = await api.get('/bookclub/books', { params });
    return response.data;
  },
  
  addBook: async (formData: FormData) => {
    const response = await api.post('/bookclub/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateBook: async (id: number, formData: FormData) => {
    const response = await api.put(`/bookclub/books/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteBook: async (id: number) => {
    const response = await api.delete(`/bookclub/books/${id}`);
    return response.data;
  },
  
  getEvents: async () => {
    const response = await api.get('/bookclub/events');
    return response.data;
  },
  
  createEvent: async (eventData: any) => {
    const response = await api.post('/bookclub/events', eventData);
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  submit: async (contactData: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },
  
  getMessages: async (params?: { status?: string; limit?: number; page?: number }) => {
    const response = await api.get('/contact/messages', { params });
    return response.data;
  },
  
  updateMessageStatus: async (id: number, status: string) => {
    const response = await api.put(`/contact/messages/${id}/status`, { status });
    return response.data;
  },
  
  deleteMessage: async (id: number) => {
    const response = await api.delete(`/contact/messages/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data;
  },
};

export default api;
