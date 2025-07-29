import React, { useState, useEffect } from "react";
import axios from '../api/axios'
import { API_URL } from '../config'
import { useToast } from "../context/ToastContext";


interface Props {
  temporadaId: number | null;
  setTemporadaId: (id: number) => void;
}

export default function TemporadaForm({ temporadaId, setTemporadaId }: Props) {
  const [temporadas, setTemporadas] = React.useState<any[]>([]);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [loading, setLoading] = useState(false);
  const {showToast} = useToast();

  useEffect(() => {
    async function fetchTemporadas() {
      try {
        console.log(API_URL + "/temporadas")
        const res = await axios.get("/temporadas");
        setTemporadas(res.data);
        if (res.data.length > 0 && temporadaId === null) {
        setTemporadaId(res.data[0].id); // ✅ Selecciona la primera por defecto
      }
      } catch (error) {
        console.log(error)
        showToast("Error cargando temporadas: "+error,"error");
      }
    }
    fetchTemporadas();
  }, [temporadaId]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const start = Number(startYear);
    const end = Number(endYear);

    if (!start || !end) {
      showToast("Ambos años son obligatorios y deben ser números válidos", "error");
      return;
    }
    if (start > end) {
      showToast("El año de inicio no puede ser mayor que el año de fin", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API_URL+"/temporadas", { nombre: "Hola", anio_inicio: start, anio_fin: end });
      showToast('Temporada creada correctamente', 'success');
      setStartYear("");
      setEndYear("");
    } catch (err) {
      showToast('Error al crear la temporada: '+err,'error');
      //setError("Error al crear la temporada: "+err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-default">
      <h2 className="heading-h2">Temporada</h2>
      <div className="mb-4">
        <label htmlFor="temporada" className="heading-h3">Seleccionar temporada</label>
        <select
          id="temporada"
          value={temporadaId ?? ""}
          onChange={(e) => setTemporadaId(Number(e.target.value))}
          className="select-default"
          required
        >
          <option value="">-- Temporada --</option>
          {temporadas.map((temp) => (
            <option key={temp.id} value={temp.id}>
              {`${temp.anio_inicio} - ${temp.anio_fin}`}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <h3 className="heading-h3">Crear Temporada</h3>
        <div className="mb-4">
          <label htmlFor="startYear" className="label-text-default">Año de inicio</label>
          <input
            id="startYear"
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="input-default"
            min={1900}
            max={2100}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endYear" className="label-text-default">Año de fin</label>
          <input
            id="endYear"
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="input-default"
            min={1900}
            max={2100}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="button-default bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Crear Temporada"}
        </button>
      </form></div>
  );
}
