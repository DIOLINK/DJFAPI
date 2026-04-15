// src/api/AuthService.ts
import { ApiService } from './ApiService';
import type { User } from '../types';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const api = new ApiService(baseUrl);

export interface AuthResponse {
  user: User;
  token: string;
}

export const AuthService = {
  async loginGoogle(googleToken: string): Promise<AuthResponse> {
    return api.request<AuthResponse>('/auth/google/', {
      method: 'POST',
      body: { token: googleToken },
    });
  },
};
