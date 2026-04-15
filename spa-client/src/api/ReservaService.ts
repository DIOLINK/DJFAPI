import { ApiService } from "./ApiService";
import type { Reserva } from "../types";

export class ReservaService extends ApiService {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL || "/api");
  }

  fetchReservas() {
    return this.request<Reserva[]>("/reservas/");
  }

  crearReserva(data: Partial<Omit<Reserva, 'id' | 'paciente'>>) {
    return this.request<Reserva>("/reservas/", {
      method: "POST",
      body: data,
    });
  }
}
