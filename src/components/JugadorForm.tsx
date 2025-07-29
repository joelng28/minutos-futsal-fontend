import { useState, useEffect } from "react";
import axios from "../api/axios";
import { API_URL } from "../config";
import { useToast } from "../context/ToastContext";
import type { Jugador } from "../models/modelJugador";

interface Posicion {
  id: number;
  nombre: string;
}

interface Props {
  temporadaId: number | null;
}


export default function JugadorForm({ temporadaId }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dorsal, setDorsal] = useState<number | "">("");
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [posicionPrincipal, setPosicionPrincipal] = useState<number | "">("");
  const [posicionSecundaria, setPosicionSecundaria] = useState<number | "">("");
  const [jugadoresTemporada, setJugadoresTemporada] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(false);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [selectedJugadorId, setSelectedJugadorId] = useState<number | "">("");
  const {showToast} = useToast();

  useEffect(() => {
    async function fetchJugadores() {
      if (!temporadaId) return;
      try {
        const res = await axios.get(API_URL + "/temporadas/" + temporadaId + "/jugadores");
        setJugadoresTemporada(res.data.in);
        setJugadores(res.data.out);
      } catch (error) {
        showToast("Error al cargar jugadores de la temporada"+ error, "error");
        console.error("Error al cargar jugadores de la temporada", error);
      }
    }
    async function fetchPosiciones() {
      try {
        const posRes = await axios.get(API_URL + '/posiciones');
        setPosiciones(posRes.data);

      } catch (err) {
        showToast("Error cargando posiciones o temporadas"+err,"error");
      }
    }
    fetchJugadores();
    fetchPosiciones();
  }, [temporadaId]);

  const handleVincSubmit = async ()=>{
    try {
      await axios.post(API_URL+"/temporadas/"+temporadaId+"/jugadores", {
        "jugador_id":selectedJugadorId,
        dorsal
      });
      showToast("Jugador vinculado con éxito","success");
    } catch (error) {
      console.log(error);
      showToast("Error al vincular al jugador: "+error, "error");
    }
    setDorsal("");
    setSelectedJugadorId("");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      showToast("El nombre es obligatorio", "error");
      return;
    }
    if (!apellidos.trim()) {
      showToast("El apellido es obligatorio", "error");
      return;
    }
    if (!posicionPrincipal) {
      showToast("Debe seleccionar una posición principal","error");
      return;
    }

    setLoading(true);
    try {
      // 1. Crear jugador
      await axios.post("/jugadores", {
        nombre,
        apellido1: apellidos,
        posicion_id: posicionPrincipal,
        posicion2_id: posicionSecundaria || null,
      });

      showToast("Jugador creado con éxito", "success");
      setNombre("");
      setApellidos("");
      setPosicionPrincipal("");
      setPosicionSecundaria("");

    } catch (err){
      showToast("Error al crear jugador"+err, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{`Jugadores que participan en la temporada: ${temporadaId}`}</h2>
      <table className="table-default">
        <thead>
          <tr className="table-head-default">
            <th className="table-head-el-default">Dorsal</th>
            <th className="table-head-el-default">Nombre</th>
            <th className="table-head-el-default">Posición</th>
          </tr>
        </thead>
        <tbody>
          {jugadoresTemporada.map((jugador) => (
            <tr key={jugador.id} className="table-row-default">
              <td className="table-row-el-default">{jugador.dorsal}</td>
              <td className="table-row-el-default">{`${jugador.nombre} ${jugador.apellido1}`}</td>
              <td className="table-row-el-default">{jugador.posicion}</td>
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
          <label className="block mb-1 font-medium" htmlFor="apellidos">Apellidos</label>
          <input
            id="apellidos"
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value === "" ? "" : e.target.value)}
            className="w-full border px-3 py-2 rounded"
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
