import './App.css'

function App() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="wedding-hero">
        <div className="hero-content">
          <h1 className="hero-title">Reserva tu momento especial</h1>
          <p className="hero-desc">Haz de cada cita una experiencia única. Agenda, confirma y recibe recordatorios de manera instantánea. Disfruta la planificación sin estrés, con toques románticos y atención personalizada.</p>
          <button className="cta-main">Reservar ahora</button>
        </div>
        <div className="hero-bg-ornament"></div>
      </section>

      {/* CARROUSEL/GALERÍA (dummy) */}
      <section className="wedding-gallery">
        <h2>Galería de momentos</h2>
        <div className="gallery-carousel">
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=480&q=80" alt="Pareja feliz"/>
          <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=480&q=80" alt="Ramo de flores"/>
          <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=480&q=80" alt="Momentos románticos"/>
        </div>
      </section>

      {/* SHOWCASE DE FUNCIONES */}
      <section className="planning-tools">
        <h2>Planificación fácil y romántica</h2>
        <div className="tools-features">
          <div className="tool-card">
            <span role="img" aria-label="calendario">🗓️</span>
            <h3>Reserva Online</h3>
            <p>Elige tu fecha ideal en menos de 1 minuto, desde cualquier lugar.</p>
          </div>
          <div className="tool-card">
            <span role="img" aria-label="notificación">📩</span>
            <h3>Confirmación instantánea</h3>
            <p>Recibe tu cita por correo y en tu Google Calendar, ¡sin preocupaciones!</p>
          </div>
          <div className="tool-card">
            <span role="img" aria-label="corazón">💖</span>
            <h3>Recordatorios automáticos</h3>
            <p>Olvida el estrés, nos encargamos de avisarte antes del gran momento.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="testimonials">
        <h2>Historias felices</h2>
        <div className="testimonial-cards">
          <blockquote className="testimonial">
            "Gracias a la plataforma, reservé y confirmé nuestra cita tan fácil... ¡Fue perfecto!"<br/>
            <span>– Sofía & Pablo</span>
          </blockquote>
          <blockquote className="testimonial">
            "El sitio es hermoso y simple, me encantó recibir todo en mi calendario y sentirme especial desde el primer click."
            <br/> <span>– Camila V.</span>
          </blockquote>
        </div>
      </section>

      {/* FORMULARIO DE CONTACTO */}
      <section className="contact-form-section">
        <h2>¿Tienes dudas? Escribe tu consulta</h2>
        <form className="contact-form">
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Correo electrónico" required />
          <textarea placeholder="Cuéntanos tu idea o pregunta..." required></textarea>
          <button type="submit" className="cta-main">Enviar mensaje</button>
        </form>
      </section>
    </>
  )
}

export default App
