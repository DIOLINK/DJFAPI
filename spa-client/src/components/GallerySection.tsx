import { useEffect, useState } from "react";
import { GalleryService } from "../api/GalleryService";

export function GallerySection() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const service = new GalleryService();
    service.fetchGallery()
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudo cargar la galería");
        setLoading(false);
      });
  }, []);

  return (
    <section className="wedding-gallery">
      <h2>Galería de momentos</h2>
      <div className="gallery-carousel">
        {loading && <span>Cargando...</span>}
        {error && <span style={{color: '#bf1650'}}>{error}</span>}
        {!loading && !error && images.length === 0 && <span>No hay imágenes.</span>}
        {images.map((src, i) => (
          <img src={src} alt={`Imagen ${i + 1}`} key={src} loading="lazy" />
        ))}
      </div>
    </section>
  );
}
