import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ThemeToggle from './components/ThemeToggle';
import { useEffect } from 'react';
import { themeStore } from './stores/useThemeStore';
import { GallerySection } from './components/GallerySection';
import { ReservaForm } from './components/ReservaForm';
import { ReservaList } from './components/ReservaList';
import { Login } from './components/Login';
import { authStore } from './store/authStore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function App() {
  const { theme } = themeStore();
  // Aplica clase a body o html cuando cambia theme
  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <ThemeToggle />
      {/* HERO SECTION */}
      <Container maxWidth="md" sx={{ py: 5 }}>
  <Box className="hero-content" sx={{ textAlign: 'center', py: 4 }}>
    <h1 className="hero-title">Reserva tu momento especial</h1>
    <p className="hero-desc">Haz de cada cita una experiencia única. Agenda, confirma y recibe recordatorios de manera instantánea. Disfruta la planificación sin estrés, con toques románticos y atención personalizada.</p>
    <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
      Reservar ahora
    </Button>
  </Box>
</Container>

      {/* CARROUSEL/GALERÍA dinámica */}
      <Login />
      <GallerySection />
      {/* Solo si user autenticado mostrar reservas */}
      {authStore.getState().user && (
        <>
          <ReservaForm />
          <ReservaList />
        </>
      )}

      {/* SHOWCASE DE FUNCIONES */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
  <h2>Planificación fácil y romántica</h2>
  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2, alignItems: 'stretch' }}>
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <span role="img" aria-label="calendario" style={{ fontSize: 32 }}>🗓️</span>
        <h3>Reserva Online</h3>
        <p>Elige tu fecha ideal en menos de 1 minuto, desde cualquier lugar.</p>
      </CardContent>
    </Card>
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <span role="img" aria-label="notificación" style={{ fontSize: 32 }}>📩</span>
        <h3>Confirmación instantánea</h3>
        <p>Recibe tu cita por correo y en tu Google Calendar, ¡sin preocupaciones!</p>
      </CardContent>
    </Card>
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <span role="img" aria-label="corazón" style={{ fontSize: 32 }}>💖</span>
        <h3>Recordatorios automáticos</h3>
        <p>Olvida el estrés, nos encargamos de avisarte antes del gran momento.</p>
      </CardContent>
    </Card>
  </Stack>
</Container>

      {/* TESTIMONIOS */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
  <h2>Historias felices</h2>
  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2, alignItems: 'stretch' }}>
    <Card sx={{ flex: 1, bgcolor: 'background.paper', minHeight: 110 }}>
      <CardContent>
        <blockquote style={{ margin: 0 }}>
          "Gracias a la plataforma, reservé y confirmé nuestra cita tan fácil... ¡Fue perfecto!"
          <br/>
          <span>– Sofía & Pablo</span>
        </blockquote>
      </CardContent>
    </Card>
    <Card sx={{ flex: 1, bgcolor: 'background.paper', minHeight: 110 }}>
      <CardContent>
        <blockquote style={{ margin: 0 }}>
          "El sitio es hermoso y simple, me encantó recibir todo en mi calendario y sentirme especial desde el primer click."
          <br/> <span>– Camila V.</span>
        </blockquote>
      </CardContent>
    </Card>
  </Stack>
</Container>

      {/* FORMULARIO DE CONTACTO */}
      <Container maxWidth="sm" sx={{ py: 4 }}>
  <h2>¿Tienes dudas? Escribe tu consulta</h2>
  <Box component="form" className="contact-form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto', mt: 2 }}>
    <TextField required label="Nombre" variant="outlined" name="nombre" />
    <TextField required label="Correo electrónico" variant="outlined" type="email" name="email" />
    <TextField required label="Consulta" variant="outlined" name="consulta" multiline rows={3} />
    <Button type="submit" variant="contained" color="primary">Enviar mensaje</Button>
  </Box>
</Container>
    </>
  )
}

export default App
