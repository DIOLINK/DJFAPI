// src/api/ApiService.ts
/**
 * Clase base para manejar requests HTTP usando fetch, bajo principios SOLID.
 * Puede extenderse por cada dominio de datos (ej: GalleryService, BookingService...)
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}

function buildQuery(params?: Record<string, any>): string {
  if (!params) return '';
  const esc = encodeURIComponent;
  return (
    '?' +
    Object.entries(params)
      .map(([k, v]) => `${esc(k)}=${esc(v)}`)
      .join('&')
  );
}

export class ApiService {
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = this.baseUrl + endpoint + buildQuery(config.params);
    const headers = { ...this.defaultHeaders, ...(config.headers || {}) };
    const { body, method = 'GET' } = config;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        // Manejo de error básico. Puede extenderse.
        const err = await response.json().catch(() => ({}));
        throw { status: response.status, ...err };
      }
      // Si no hay contenido (DELETE 204) => return true
      if (response.status === 204) return true as T;
      return (await response.json()) as T;
    } catch (error: any) {
      // Manejo centralizado de errores
      throw error;
    }
  }
}
