import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Toast from '../shared/Toast'

interface Posicion {
  id: number;
  nombre: string;
}

interface Props {
  temporadaId: number | null;
}

interface Jugador {
  id: number;
  dorsal: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  posicion: string
}

export default function JugadorForm({ temporadaId }: Props) {
  const [nombre, setNombre] = useState("");
  const [dorsal, setDorsal] = useState<number | "">("");
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [posicionPrincipal, setPosicionPrincipal] = useState<number | "">("");
  const [posicionSecundaria, setPosicionSecundaria] = useState<number | "">("");
  const [jugadoresTemporada, setJugadoresTemporada] = useState<Jugador[]>([]);
  const [temporadasSeleccionadas, setTemporadasSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [selectedJugadorId, setSelectedJugadorId] = useState<number | "">("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function fetchJugadores() {
      if (!temporadaId) return;
      try {
        const res = await axios.get(API_URL + "/temporadas/" + temporadaId + "/jugadores");
        setJugadoresTemporada(res.data.in);
        setJugadores(res.data.out);
      } catch (error) {
        setError("Error al cargar jugadores de la temporada");
        console.error("Error al cargar jugadores de la temporada", error);
      }
    }
    async function fetchPosiciones() {
      try {
        const posRes = await axios.get(API_URL + '/posiciones');
        setPosiciones(posRes.data);

      } catch {
        setError("Error cargando posiciones o temporadas");
      }
    }
    fetchJugadores();
    fetchPosiciones();
  }, [temporadaId]);

  const handleVincSubmit = async ()=>{
    setSuccess(false);
    setError(null);
    try {
      const res = await axios.post(API_URL+"/temporadas/"+temporadaId+"/jugadores", {
        "jugador_id":selectedJugadorId,
        dorsal
      });
      setToast({message: "Jugador vinculado con éxito", type:"success"})
    } catch (error) {
      console.log(error)
      setToast({message: "Error al vincular al jugador: "+error, type:"error"})
    }
    setDorsal("");
    setSelectedJugadorId("");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
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
      <h2 className="text-xl font-semibold mb-4">{`Jugadores que participan en la temporada: ${temporadaId}`}</h2>
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-2">Dorsal</th>
            <th className="border px-2 py-2">Nombre</th>
            <th className="border px-2 py-2">Posición</th>
          </tr>
        </thead>
        <tbody>
          {jugadoresTemporada.map((jugador) => (
            <tr key={jugador.id} className="border-t">
              <td className="border px-2 py-1">{jugador.dorsal}</td>
              <td className="border px-2 py-1">{`${jugador.nombre} ${jugador.apellido1}`}</td>
              <td className="border px-2 py-1">{jugador.posicion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="max-w-md mx-auto p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Vincular un jugador existente</h2>
        <div className="p-4">
        <select
        id="jugador"
        value={selectedJugadorId ?? ""}
        onChange={(e)=>setSelectedJugadorId(Number(e.target.value))}
        className="w-full border px-3 py-2 rounded"
        >
          <option value="">--Jugador--</option>
          {jugadores.map((jug)=>(
            <option key={jug.id} value={jug.id}>{`${jug.nombre} ${jug.apellido1} (${jug.posicion})`}</option>
          ))}
        </select>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Dorsal</label>
          <input
            id="dorsal"
            type="text"
            value={dorsal}
            onChange={(e) => setDorsal(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="button"
          onClick={handleVincSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
         Vincular
        </button>
        </div>
      </div>
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
