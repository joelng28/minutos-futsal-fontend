import { useState } from "react";
import axios from "axios";

export default function TemporadaForm() {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const start = Number(startYear);
    const end = Number(endYear);

    if (!start || !end) {
      setError("Ambos años son obligatorios y deben ser números válidos");
      return;
    }
    if (start > end) {
      setError("El año de inicio no puede ser mayor que el año de fin");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/temporadas", { nombre: "Hola", anio_inicio: start, anio_fin: end });
      setSuccess(true);
      setStartYear("");
      setEndYear("");
    } catch (err) {
      setError("Error al crear la temporada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Crear Temporada</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">Temporada creada correctamente</p>}

      <div className="mb-4">
        <label htmlFor="startYear" className="block mb-1 font-medium">Año de inicio</label>
        <input
          id="startYear"
          type="number"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          min={1900}
          max={2100}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="endYear" className="block mb-1 font-medium">Año de fin</label>
        <input
          id="endYear"
          type="number"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          min={1900}
          max={2100}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Crear Temporada"}
      </button>
    </form>
  );
}