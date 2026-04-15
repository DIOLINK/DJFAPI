// src/api/GalleryService.ts
import { ApiService } from "./ApiService";

export class GalleryService extends ApiService {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL || "/api");
  }

  async fetchGallery() {
    // Cambia el endpoint real según como esté en tu backend
    return this.request<{ images: string[] }>("/gallery/");
  }
}
