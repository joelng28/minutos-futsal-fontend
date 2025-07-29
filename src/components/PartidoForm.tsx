import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config";
import type { Jugador } from "../models/modelJugador";


interface Props {
  temporadaId: number | null;
}

export default function PartidoForm({ temporadaId }: Props) {
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [seleccionados, setSeleccionados] = useState<{ [id: number]: boolean }>({});
  const [titulares, setTitulares] = useState<{ [id: number]: boolean }>({});
  const navigate = useNavigate();
  const { showToast } = useToast();

  const seleccionarJugador = (id: number) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const seleccionarTitular = (id: number) => {
    setTitulares((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    async function fetchJugadores() {
      try {
        const res = await axios.get(API_URL + "/temporadas/" + temporadaId + "/jugadores");
        setJugadores(res.data.in);
      } catch (error) {
        showToast("Error cargando jugadores: " + error, "error");
      }
    }

    setSeleccionados({});
    fetchJugadores();
  }, [temporadaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!temporadaId) {
      showToast("Debe seleccionar una temporada", "error");
      return;
    }
    if (!fecha) {
      showToast("Debe seleccionar fecha y hora del partido", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/partidos", {
        temporada_id: temporadaId,
        fecha: fecha,
      });
      showToast("Partido creado correctamente", "success")
      setFecha("");
      navigate('/minutos');
    } catch (error) {
      showToast("Error al crear partido: " + error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-default">
    <form onSubmit={handleSubmit}>
      <h2 className="heading-h2">Crear Partido</h2>
      <h3 className="heading-h3">Datos</h3>
      <div className="flex">
        <label htmlFor="ubicacion" className="label-text-default">Ubicación</label>
        <select
          id="ubicacion"
          
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Ubicación --</option>
          
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
      <div>
        <table className="table-default">
          <thead>
            <tr className="table-head-default">
              <th className="table-head-el-default">Participa</th>
              <th className="table-head-el-default">Titular</th>
              <th className="table-head-el-default">Dorsal</th>
              <th className="table-head-el-default">Nombre</th>
              <th className="table-head-el-default">Posicion</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((jug) => (
              <tr key={jug.id} className="table-row-default">
                <td className="table-row-el-default">
                  <input
                    type="checkbox"
                    checked={!!seleccionados[jug.id]}
                    onChange={() => seleccionarJugador(jug.id)}
                  >
                  </input>
                </td>
                <td className="table-row-el-default">
                  <input
                    type="checkbox"
                    checked={!!titulares[jug.id]}
                    onChange={() => seleccionarTitular(jug.id)}
                  >
                  </input>
                </td>
                <td className="table-row-el-default">{jug.dorsal}</td>
                <td className="table-row-el-default">{jug.posicion}</td>
                <td className="table-row-el-default">{jug.nombre}</td></tr>
            ))}

          </tbody>
        </table>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Crear Partido"}
      </button>
    </form>
    </div>
  );
}