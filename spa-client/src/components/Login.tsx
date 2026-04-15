import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useAuth } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

export function Login() {
  const { loginGoogle, user } = useAuth();

  if (user) return <Alert severity="success">Bienvenido, {user.first_name || user.username}</Alert>;

  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <GoogleLogin
        width="240"
        onSuccess={credentialResponse => {
          if (credentialResponse.credential) {
            loginGoogle(credentialResponse.credential);
          }
        }}
        onError={() => {
          alert('Error al autenticar con Google');
        }}
        text="signup_with"
        shape="rectangular"
        theme="outline"
        size="large"
      />
    </Box>
  );
}

