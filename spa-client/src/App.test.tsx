import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('Landing Page Romantic SPA', () => {
  test('renderiza sección hero y CTA', () => {
    render(<App />)
    expect(screen.getByText(/Reserva tu momento especial/i)).toBeInTheDocument()
    const cta = screen.getAllByRole('button', { name: /reservar ahora/i })[0]
    expect(cta).toBeInTheDocument()
  })

  test('renderiza galería con imágenes', () => {
    render(<App />)
    // Dummy images que aparecen en la galería
    expect(screen.getByAltText(/Pareja feliz/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Ramo de flores/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Momentos románticos/i)).toBeInTheDocument()
  })

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

  test('formulario contacto: campos requeridos', () => {
    render(<App />)
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Correo/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Cuéntanos tu idea/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument()
  })

  test('formulario contacto: ingreso texto', () => {
    render(<App />)
    const nombre = screen.getByPlaceholderText(/Nombre/i)
    const correo = screen.getByPlaceholderText(/Correo/i)
    const mensaje = screen.getByPlaceholderText(/Cuéntanos tu idea/i)
    fireEvent.change(nombre, { target: { value: 'Ana' } })
    fireEvent.change(correo, { target: { value: 'ana@email.com' } })
    fireEvent.change(mensaje, { target: { value: 'Quiero una cita el viernes.' } })
    expect(nombre).toHaveValue('Ana')
    expect(correo).toHaveValue('ana@email.com')
    expect(mensaje).toHaveValue('Quiero una cita el viernes.')
  })
})
