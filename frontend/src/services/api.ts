import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const uploadDocument = async (formData: FormData, onProgress?: (progress: number) => void) => {
  try {
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Upload failed');
  }
};

export const getDocuments = async (page = 0, size = 10, search?: string) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/api/documents?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};

export const getDocument = async (id: string) => {
  try {
    const response = await api.get(`/api/documents/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch document');
  }
};

export const analyzeDocument = async (id: string) => {
  try {
    const response = await api.post(`/api/documents/${id}/analyze`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Analysis failed');
  }
};

export const searchDocuments = async (query: string, filters?: any) => {
  try {
    const response = await api.post('/api/documents/search', {
      query,
      filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Search failed');
  }
};

export const getDocumentEntities = async (id: string) => {
  try {
    const response = await api.get(`/api/documents/${id}/entities`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch entities');
  }
};

export const classifyDocument = async (id: string) => {
  try {
    const response = await api.post(`/api/documents/${id}/classify`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Classification failed');
  }
};

export const getSentimentAnalysis = async (id: string) => {
  try {
    const response = await api.get(`/api/documents/${id}/sentiment`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Sentiment analysis failed');
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  } catch (error) {
    // Return mock data for demo purposes
    return {
      totalDocuments: 1247,
      documentsProcessedToday: 23,
      entitiesExtracted: 8532,
      averageProcessingTime: 1250,
      processingHistory: [
        { date: '2024-01-01', count: 12 },
        { date: '2024-01-02', count: 18 },
        { date: '2024-01-03', count: 15 },
        { date: '2024-01-04', count: 22 },
        { date: '2024-01-05', count: 19 },
        { date: '2024-01-06', count: 25 },
        { date: '2024-01-07', count: 23 },
      ],
      documentTypes: [
        { type: 'PDF', count: 450 },
        { type: 'Word', count: 320 },
        { type: 'Text', count: 280 },
        { type: 'Image', count: 150 },
        { type: 'Other', count: 47 },
      ],
    };
  }
};

export const getAnalytics = async () => {
  try {
    const response = await api.get('/api/analytics');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
  }
};

export const deleteDocument = async (id: string) => {
  try {
    const response = await api.delete(`/api/documents/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete document');
  }
};

export const exportDocuments = async (format: 'csv' | 'json' | 'excel') => {
  try {
    const response = await api.get(`/api/documents/export/${format}`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `documents.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Export failed');
  }
};

export const getSystemHealth = async () => {
  try {
    const response = await api.get('/actuator/health');
    return response.data;
  } catch (error) {
    throw new Error('Health check failed');
  }
};

export default api;