import { useState } from "react";
import { useReservas } from "../hooks/useReservas";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export function ReservaForm() {
  const { crearReserva, loading, error } = useReservas();
  const [fecha, setFecha] = useState<Date | null>(null);
  const [nota, setNota] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!fecha) return;
    const created = await crearReserva({ fecha_hora: fecha.toISOString(), nota });
    setSuccess(!!created);
    if (created) {
      setFecha(null);
      setNota("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={2}>
          <DateTimePicker
            label="Fecha y hora"
            value={fecha}
            onChange={setFecha}
            disablePast
            slotProps={{ textField: { required: true } }}
          />
          <TextField label="Nota (opcional)" multiline rows={2} value={nota} onChange={e => setNota(e.target.value)} />
        <Button variant="contained" type="submit" disabled={loading || !fecha}>
          Reservar
        </Button>
        {success && <Alert severity="success">Reserva creada. Revisa tu correo.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </LocalizationProvider>
  </Box>
  );
}
