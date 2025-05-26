import { API_CONFIG } from '@/config/api';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    role: string;
  };
  token: string;
  message: string;
}

interface ValidateResponse {
  valid: boolean;
}

interface Remark {
  id: string;
  profileId: string;
  content: string;
  date: string;
}

class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.baseUrl;
    this.headers = API_CONFIG.headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    let headers = { ...this.headers };

    // Only add Content-Type header if not sending FormData
    if (!(options.body instanceof FormData)) {
      headers = {
        ...headers,
        ...options.headers,
      };
    } else {
      // For FormData, only add custom headers but not Content-Type
      headers = {
        ...options.headers,
      };
    }

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async validateToken(token: string): Promise<ValidateResponse> {
    return this.request<ValidateResponse>('/auth/validate', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Profile endpoints
  async getProfiles() {
    return this.request<any[]>('/profiles');
  }

  async getProfile(id: string) {
    return this.request<any>(`/profiles/${id}`);
  }

  async createProfile(data: FormData) {
    return this.request<any>('/profiles', {
      method: 'POST',
      body: data,
    });
  }

  async updateProfile(id: string, data: FormData) {
    return this.request<any>(`/profiles/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  // Remarks endpoints
  async getRemarks(profileId: string): Promise<Remark[]> {
    return this.request<Remark[]>(`/remarks/${profileId}`);
  }

  async addRemark(remark: Omit<Remark, 'id'>): Promise<Remark> {
    return this.request<Remark>('/remarks', {
      method: 'POST',
      body: JSON.stringify(remark),
    });
  }

  async deleteRemark(remarkId: string): Promise<void> {
    return this.request<void>(`/remarks/${remarkId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(); 