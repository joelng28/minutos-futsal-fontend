import { useState, useEffect } from "react";
import axios from "axios";

interface Partido {
  id: number;
  fecha: string;
}

interface Jugador {
  id: number;
  nombre: string;
}

export default function MinutosForm() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partidoId, setPartidoId] = useState<number | "">("");
  const [jugadorId, setJugadorId] = useState<number | "">("");
  const [minutos, setMinutos] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, jRes] = await Promise.all([
          axios.get("/api/partidos"),
          axios.get("/api/jugadores"),
        ]);
        setPartidos(pRes.data);
        setJugadores(jRes.data);
      } catch {
        setError("Error cargando partidos o jugadores");
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!partidoId) {
      setError("Seleccione un partido");
      return;
    }
    if (!jugadorId) {
      setError("Seleccione un jugador");
      return;
    }
    if (minutos === "" || minutos < 0 || minutos > 60) {
      setError("Ingrese minutos válidos (0-60)");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/minutos", {
        partido_id: partidoId,
        jugador_id: jugadorId,
        minutos,
      });
      setSuccess(true);
      setPartidoId("");
      setJugadorId("");
      setMinutos("");
    } catch {
      setError("Error al guardar minutos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Registrar Minutos Jugados</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">Minutos registrados correctamente</p>}

      <div className="mb-4">
        <label htmlFor="partido" className="block mb-1 font-medium">Partido</label>
        <select
          id="partido"
          value={partidoId}
          onChange={(e) => setPartidoId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Seleccione partido --</option>
          {partidos.map((p) => (
            <option key={p.id} value={p.id}>
              {new Date(p.fecha).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="jugador" className="block mb-1 font-medium">Jugador</label>
        <select
          id="jugador"
          value={jugadorId}
          onChange={(e) => setJugadorId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Seleccione jugador --</option>
          {jugadores.map((j) => (
            <option key={j.id} value={j.id}>{j.nombre}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="minutos" className="block mb-1 font-medium">Minutos Jugados</label>
        <input
          id="minutos"
          type="number"
          value={minutos}
          onChange={(e) => setMinutos(e.target.value === "" ? "" : Number(e.target.value))}
          min={0}
          max={60}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Registrar Minutos"}
      </button>
    </form>
  );
}