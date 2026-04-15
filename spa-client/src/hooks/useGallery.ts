import { useEffect, useState } from "react";
import { GalleryService } from "../api/GalleryService";
import type { GalleryImage } from "../types";

interface UseGallery {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
}

export function useGallery(): UseGallery {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const service = new GalleryService();
    service.fetchGallery()
      .then((data) => {
        // Asume API responde { images: string[] }
        setImages((data.images || []).map((src: string, i: number) => ({ src, alt: `Imagen ${i+1}` })));
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar la galería");
        setLoading(false);
      });
  }, []);

  return { images, loading, error };
}
