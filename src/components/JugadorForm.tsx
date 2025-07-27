import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

interface Posicion {
  id: number;
  nombre: string;
}

interface Temporada {
  id: number;
  anio_inicio: number;
  anio_fin: number;
}

export default function JugadorForm() {
  const [nombre, setNombre] = useState("");
  const [dorsal, setDorsal] = useState<number | "">("");
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [posicionPrincipal, setPosicionPrincipal] = useState<number | "">("");
  const [posicionSecundaria, setPosicionSecundaria] = useState<number | "">("");
  const [temporadasSeleccionadas, setTemporadasSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const posRes = await axios.get(API_URL + '/posiciones');
        setPosiciones(posRes.data);
        //setTemporadas(tempRes.data);
      } catch {
        setError("Error cargando posiciones o temporadas");
      }
    }
    fetchData();
  }, []);

  const toggleTemporada = (id: number) => {
    setTemporadasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (dorsal === "" || dorsal <= 0) {
      setError("El dorsal debe ser un número positivo");
      return;
    }
    if (!posicionPrincipal) {
      setError("Debe seleccionar una posición principal");
      return;
    }
    if (temporadasSeleccionadas.length === 0) {
      setError("Debe seleccionar al menos una temporada");
      return;
    }

    setLoading(true);
    try {
      // 1. Crear jugador
      const res = await axios.post("/api/jugadores", {
        nombre,
        dorsal,
        posicion_id: posicionPrincipal,
        posicion_secundaria_id: posicionSecundaria || null,
      });

      const jugadorId = res.data.id;

      // 2. Asociar jugador a cada temporada
      await Promise.all(
        temporadasSeleccionadas.map((temporadaId) =>
          axios.post(`/api/temporadas/${temporadaId}/jugadores`, {
            jugador_id: jugadorId,
          })
        )
      );

      setSuccess(true);
      setNombre("");
      setDorsal("");
      setPosicionPrincipal("");
      setPosicionSecundaria("");
      setTemporadasSeleccionadas([]);
    } catch {
      setError("Error al crear jugador");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Jugadores que participan en la temporada</h2>
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-2">Dorsal</th>
            <th className="border px-2 py-2">Nombre</th>
            <th className="border px-2 py-2">Posición</th>
          </tr>
        </thead>
      </table>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Crear Jugador</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">Jugador creado correctamente</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="dorsal">Dorsal</label>
          <input
            id="dorsal"
            type="number"
            value={dorsal}
            onChange={(e) => setDorsal(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            min={1}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="posicionPrincipal">Posición Principal</label>
          <select
            id="posicionPrincipal"
            value={posicionPrincipal}
            onChange={(e) => setPosicionPrincipal(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Seleccione --</option>
            {posiciones.map((pos) => (
              <option key={pos.id} value={pos.id}>{pos.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="posicionSecundaria">Posición Secundaria (opcional)</label>
          <select
            id="posicionSecundaria"
            value={posicionSecundaria}
            onChange={(e) => setPosicionSecundaria(e.target.value ? Number(e.target.value) : "")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Ninguna --</option>
            {posiciones.map((pos) => (
              <option key={pos.id} value={pos.id}>{pos.nombre}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Crear Jugador"}
        </button>
      </form>
    </div>
  );
}
