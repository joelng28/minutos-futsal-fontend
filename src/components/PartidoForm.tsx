import { useState, useEffect } from "react";
import axios from "axios";

interface Temporada {
  id: number;
  startYear: number;
  endYear: number;
}

export default function PartidoForm() {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [temporadaId, setTemporadaId] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchTemporadas() {
      try {
        const res = await axios.get("/api/temporadas");
        setTemporadas(res.data);
      } catch {
        setError("Error cargando temporadas");
      }
    }
    fetchTemporadas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!temporadaId) {
      setError("Debe seleccionar una temporada");
      return;
    }
    if (!fecha) {
      setError("Debe seleccionar fecha y hora del partido");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/partidos", {
        temporada_id: temporadaId,
        fecha,
      });
      setSuccess(true);
      setTemporadaId("");
      setFecha("");
    } catch {
      setError("Error al crear partido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Crear Partido</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">Partido creado correctamente</p>}

      <div className="mb-4">
        <label htmlFor="temporada" className="block mb-1 font-medium">Temporada</label>
        <select
          id="temporada"
          value={temporadaId}
          onChange={(e) => setTemporadaId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Seleccione temporada --</option>
          {temporadas.map((temp) => (
            <option key={temp.id} value={temp.id}>
              {temp.startYear} - {temp.endYear}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="fecha" className="block mb-1 font-medium">Fecha y hora</label>
        <input
          id="fecha"
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Crear Partido"}
      </button>
    </form>
  );
}