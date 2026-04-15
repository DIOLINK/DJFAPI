// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { GallerySection } from "../GallerySection";
import { describe, it, beforeEach, expect, vi } from "vitest";

vi.mock("../../api/GalleryService", () => {
  // implementation as a CLASS! so 'new GalleryService()' works
  return {
    GalleryService: vi.fn().mockImplementation(function () {
      // These will be set per-test
      return {
        fetchGallery: (typeof globalThis._fetchGalleryMock === 'function') ? globalThis._fetchGalleryMock : () => Promise.resolve({ images: [] }),
      };
    })
  };
});
import { GalleryService } from "../../api/GalleryService";

describe("GallerySection", () => {
  beforeEach(() => {
    (GalleryService as any).mockClear();
    globalThis._fetchGalleryMock = undefined;
  });

  it("muestra loader de carga inicialmente", () => {
    globalThis._fetchGalleryMock = () => new Promise(() => {});
    render(<GallerySection />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("renderiza imágenes desde el backend", async () => {
    const images = ["a.jpg", "b.jpg", "c.jpg"];
    globalThis._fetchGalleryMock = () => Promise.resolve({ images });
    render(<GallerySection />);
    for (const [i, src] of images.entries()) {
      await waitFor(() => {
        const img = screen.getByAltText(`Imagen ${i+1}`);
        expect(img).toHaveAttribute('src', src);
      });
    }
  });

  it("muestra mensaje de error si falla el fetch", async () => {
    globalThis._fetchGalleryMock = () => Promise.reject(new Error("fail"));
    render(<GallerySection />);
    await waitFor(() => expect(screen.getByText(/no se pudo cargar/i)).toBeInTheDocument());
  });

  it("muestra mensaje si no hay imágenes", async () => {
    globalThis._fetchGalleryMock = () => Promise.resolve({ images: [] });
    render(<GallerySection />);
    await waitFor(() => expect(screen.getByText(/no hay imágenes/i)).toBeInTheDocument());
  });
});
