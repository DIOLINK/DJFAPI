import { render, screen, waitFor } from "@testing-library/react";
import { GallerySection } from "../GallerySection";

jest.mock("../../api/GalleryService");
const { GalleryService } = require("../../api/GalleryService");

describe("GallerySection", () => {
  beforeEach(() => {
    GalleryService.mockClear();
  });

  it("muestra loader de carga inicialmente", () => {
    GalleryService.mockImplementation(() => ({
      fetchGallery: () => new Promise(() => {}), // nunca resuelve
    }));
    render(<GallerySection />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("renderiza imágenes desde el backend", async () => {
    const images = ["a.jpg", "b.jpg", "c.jpg"];
    GalleryService.mockImplementation(() => ({
      fetchGallery: () => Promise.resolve({ images }),
    }));
    render(<GallerySection />);
    for (const src of images) {
      await waitFor(() => expect(screen.getByAltText(/imagen/i)).toHaveAttribute('src', src));
    }
  });

  it("muestra mensaje de error si falla el fetch", async () => {
    GalleryService.mockImplementation(() => ({
      fetchGallery: () => Promise.reject(new Error("fail")),
    }));
    render(<GallerySection />);
    await waitFor(() => expect(screen.getByText(/no se pudo cargar/i)).toBeInTheDocument());
  });

  it("muestra mensaje si no hay imágenes", async () => {
    GalleryService.mockImplementation(() => ({
      fetchGallery: () => Promise.resolve({ images: [] }),
    }));
    render(<GallerySection />);
    await waitFor(() => expect(screen.getByText(/no hay imágenes/i)).toBeInTheDocument());
  });
});
