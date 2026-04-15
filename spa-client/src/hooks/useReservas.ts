import { useCallback, useState } from "react";
import type { Reserva } from "../types";
import { ReservaService } from "../api/ReservaService";

interface UseReservas {
  reservas: Reserva[];
  loading: boolean;
  error: string | null;
  fetchReservas: () => Promise<void>;
  crearReserva: (data: Partial<Omit<Reserva, "id" | "paciente" | "creado" | "actualizado" | "estado">>) => Promise<Reserva | null>;
}

export function useReservas(): UseReservas {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const service = new ReservaService();

  const fetchReservas = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const list = await service.fetchReservas();
      setReservas(list || []);
    } catch {
      setError("Error cargando reservas");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearReserva = useCallback(async (data: Partial<Omit<Reserva, "id" | "paciente" | "creado" | "actualizado" | "estado">>) => {
    setLoading(true); setError(null);
    try {
      const nueva = await service.crearReserva(data);
      setReservas((old) => [...old, nueva]);
      return nueva;
    } catch {
      setError("Error creando reserva");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reservas, loading, error, fetchReservas, crearReserva };
}
