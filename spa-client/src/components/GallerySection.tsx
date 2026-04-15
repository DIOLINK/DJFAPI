import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useGallery } from "../hooks/useGallery";

export function GallerySection() {
  const { images, loading, error } = useGallery();

  return (
    <section className="wedding-gallery">
      <h2>Galería de momentos</h2>
      <Box sx={{ width: '100%', minHeight: 220, padding: 2 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error">{error}</Alert>
        )}
        {!loading && !error && images.length === 0 && (
          <Alert severity="info">No hay imágenes.</Alert>
        )}
        {!loading && !error && images.length > 0 && (
          <ImageList cols={3} gap={16} sx={{ maxWidth: 700, margin: 'auto' }}>
            {images.map((img) => (
              <ImageListItem key={img.src}>
                <img
                  src={img.src}
                  alt={img.alt || ''}
                  loading="lazy"
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>
    </section>
  );
}

