import { useState, useEffect } from "react";
import axios from "axios";

interface Posicion {
  id: number;
  nombre: string;
}

interface Temporada {
  id: number;
  startYear: number;
  endYear: number;
}

export default function JugadorForm() {
  const [nombre, setNombre] = useState("");
  const [dorsal, setDorsal] = useState<number | "">("");
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [posicionPrincipal, setPosicionPrincipal] = useState<number | "">("");
  const [posicionSecundaria, setPosicionSecundaria] = useState<number | "">("");
  const [temporadasSeleccionadas, setTemporadasSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [posRes, tempRes] = await Promise.all([
          axios.get("/api/posiciones"),
          axios.get("/api/temporadas"),
        ]);
        setPosiciones(posRes.data);
        setTemporadas(tempRes.data);
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
      await axios.post("/api/jugadores", {
        nombre,
        dorsal,
        posicion_id: posicionPrincipal,
        posicion_secundaria_id: posicionSecundaria || null,
        temporadas: temporadasSeleccionadas,
      });
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow mt-8">
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

      <fieldset className="mb-4">
        <legend className="font-medium mb-2">Temporadas</legend>
        {temporadas.map((temp) => (
          <label key={temp.id} className="block">
            <input
              type="checkbox"
              checked={temporadasSeleccionadas.includes(temp.id)}
              onChange={() => toggleTemporada(temp.id)}
            />
            <span className="ml-2">{temp.startYear} - {temp.endYear}</span>
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Crear Jugador"}
      </button>
    </form>
  );
}
