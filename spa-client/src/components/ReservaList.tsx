import { useEffect } from "react";
import { useReservas } from "../hooks/useReservas";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export function ReservaList() {
  const { reservas, loading, error, fetchReservas } = useReservas();

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Stack spacing={2} sx={{ maxWidth: 420, mx: 'auto', my: 4 }}>
      {reservas.length === 0 ? (
        <Alert severity="info">No tienes reservas registradas.</Alert>
      ) : reservas.map(r => (
        <Card key={r.id} variant="outlined">
          <CardContent>
            <Typography variant="h6">Reserva: {new Date(r.fecha_hora).toLocaleString()}</Typography>
            <Typography variant="body2">Estado: {r.estado}</Typography>
            {r.nota && <Typography variant="body2">Nota: {r.nota}</Typography>}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
