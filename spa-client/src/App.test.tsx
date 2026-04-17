// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import App from './App'
import * as useGalleryModule from './hooks/useGallery'
import * as authStoreModule from './store/authStore'

describe('Landing Page Romantic SPA', () => {
  test('renderiza sección hero y CTA', () => {
    render(<App />)
    expect(screen.getByText(/Reserva tu momento especial/i)).toBeInTheDocument()
    const cta = screen.getAllByRole('button', { name: /reservar ahora/i })[0]
    expect(cta).toBeInTheDocument()
  })

  test('renderiza galería con imágenes', () => {
    // Mock useGallery to provide dummy images
    vi.spyOn(useGalleryModule, 'useGallery').mockReturnValue({
      images: [
        { src: 'pareja.jpg', alt: 'Pareja feliz' },
        { src: 'ramo.jpg', alt: 'Ramo de flores' },
        { src: 'momentos.jpg', alt: 'Momentos románticos' }
      ],
      loading: false,
      error: undefined,
    });
    render(<App />);
    expect(screen.getByAltText(/Pareja feliz/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Ramo de flores/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Momentos románticos/i)).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  test('muestra funcionalidades/ventajas (showcase)', () => {
    render(<App />)
    expect(screen.getByText(/Reserva Online/i)).toBeInTheDocument()
    expect(screen.getByText(/Confirmación instantánea/i)).toBeInTheDocument()
    expect(screen.getByText(/Recordatorios automáticos/i)).toBeInTheDocument()
  })

  test('renderiza testimonios con autores', () => {
    render(<App />)
    expect(screen.getByText(/Sofía & Pablo/i)).toBeInTheDocument()
    expect(screen.getByText(/Camila V./i)).toBeInTheDocument()
  })

  test('formulario de reserva: campos requeridos', () => {
    // Mock user auth so form renders
    const storeObj = { user: { name: 'test' }, token: 'mock-token', setUser: () => {} };
    const mockStore = (selector) => selector(storeObj);
    Object.assign(mockStore, { getState: () => storeObj });
    const authMock = vi.spyOn(authStoreModule, 'authStore', 'get').mockReturnValue(mockStore);
    render(<App />);
    // Field: Fecha y hora (DateTimePicker)
    // There may be several elements with this label due to MUI Picker rendering structure.
    expect(screen.getAllByLabelText(/Fecha y hora/i).length).toBeGreaterThan(0);
    // Field: Nota (opcional)
    expect(screen.getByLabelText(/Nota \(opcional\)/i)).toBeInTheDocument();
    // Button: Reservar (form submit, not CTA)
    const reservarButtons = screen.getAllByRole('button', { name: /reservar/i });
    // There could be more than one; ensure at least one exactly "Reservar"
    expect(reservarButtons.some(btn => btn.textContent?.trim() === 'Reservar')).toBe(true);
    authMock.mockRestore();
  });

  test('formulario de reserva: ingreso de campos', () => {
    // Mock user auth so form renders
    const storeObj = { user: { name: 'test' }, token: 'mock-token', setUser: () => {} };
    const mockStore = (selector) => selector(storeObj);
    Object.assign(mockStore, { getState: () => storeObj });
    const authMock = vi.spyOn(authStoreModule, 'authStore', 'get').mockReturnValue(mockStore);
    render(<App />);
    // Field: Fecha y hora (DateTimePicker)
    // There may be several elements due to picker rendering structure.
    expect(screen.getAllByLabelText(/Fecha y hora/i).length).toBeGreaterThan(0);
    const notaInput = screen.getByLabelText(/Nota \(opcional\)/i);
    fireEvent.change(notaInput, { target: { value: 'Quiero una cita el viernes.' } });
    expect(notaInput).toHaveValue('Quiero una cita el viernes.');
    // Button should be present (may be disabled)
    const reservarButtons = screen.getAllByRole('button', { name: /reservar/i });
    expect(reservarButtons.some(btn => btn.textContent?.trim() === 'Reservar')).toBe(true);
    authMock.mockRestore();
  });
})
