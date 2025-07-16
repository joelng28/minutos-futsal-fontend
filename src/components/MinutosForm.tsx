import { useState, useEffect } from "react";


interface Jugador {
  id: number;
  dorsal: number;
  nombre: string;
  enPista: boolean;
  rotacionActual: number; // en segundos
  tiempoTotal: number; // en segundos
}

export default function TablaRotaciones() {
  const [jugadores, setJugadores] = useState<Jugador[]>([
    { id: 1, dorsal: 1, nombre: "Joel Navarro", enPista: true, rotacionActual: 0, tiempoTotal: 0 },
    { id: 2, dorsal: 7, nombre: "Luis Pérez", enPista: true, rotacionActual: 0, tiempoTotal: 0 },
    { id: 3, dorsal: 10, nombre: "Marcos Ruiz", enPista: false, rotacionActual: 0, tiempoTotal: 0 },
  ]);
  const [contadorActivo, setContador] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [jugadorASustituirId, setJugadorASustituirId] = useState<number | null>(null);
  const [jugadorEntranteId, setJugadorEntranteId] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (contadorActivo) {
        setJugadores((prevJugadores) =>
          prevJugadores.map((jug) =>
            jug.enPista
              ? {
                  ...jug,
                  rotacionActual: jug.rotacionActual + 1,
                  tiempoTotal: jug.tiempoTotal + 1,
                }
              : jug
          )
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contadorActivo]);

  const abrirModal = (id: number) =>{
    setJugadorASustituirId(id);
    setJugadorEntranteId(null);
    setShowModal(true);
  }

    const confirmarSustitucion = () => {
    if (jugadorASustituirId !== null && jugadorEntranteId !== null) {
      setJugadores((prev) =>
        prev.map((jug) => {
          if (jug.id === jugadorASustituirId) {
            return { ...jug, enPista: false, rotacionActual: 0 };
          } else if (jug.id === jugadorEntranteId) {
            return { ...jug, enPista: true, rotacionActual: 0 };
          }
          return jug;
        })
      );
      setShowModal(false);
    }
  };

  const quitarDePista = (id: number) => {
    setJugadores((prev) =>
      prev.map((jug) =>
        jug.id === id
          ? { ...jug, enPista: false, rotacionActual: 0 } // quitar y reiniciar rotacionActual
          : jug
      )
    );
  };

  const añadirAPista = (id: number) => {
    setJugadores((prev) =>
      prev.map((jug) =>
        jug.id === id
          ? { ...jug, enPista: true, rotacionActual: 0 } // añadir y reiniciar rotacionActual
          : jug
      )
    );
  };

  const formatearTiempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4">
    <button onClick={() => setContador((prev)=>!prev)}>{contadorActivo ? "Pausar" : "Iniciar"}</button>
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Dorsal</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Rotación actual</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.map((jug) => (
            <tr key={jug.id} className="bg-gray-100 border-b border-white">
              <td className="px-4 py-2">{jug.dorsal}</td>
              <td className="px-4 py-2">{jug.nombre}</td>
              <td className="px-4 py-2">{formatearTiempo(jug.rotacionActual)}</td>
              <td className="px-4 py-2">{formatearTiempo(jug.tiempoTotal)}</td>
              <td className="px-4 py-2">
                {jug.enPista ? (
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => abrirModal(jug.id)}
                  >
                    Quitar
                  </button>
                ) : (
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => añadirAPista(jug.id)}
                    disabled
                  >
                    Quitar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Selecciona al jugador que entra</h2>

            <select
              className="border px-2 py-1 mb-4 w-full"
              value={jugadorEntranteId ?? ""}
              onChange={(e) => setJugadorEntranteId(Number(e.target.value))}
            >
              <option value="">-- Seleccionar jugador --</option>
              {jugadores
                .filter((jug) => !jug.enPista)
                .map((jug) => (
                  <option key={jug.id} value={jug.id}>
                    {jug.dorsal} - {jug.nombre}
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={confirmarSustitucion}
                disabled={jugadorEntranteId === null}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}  
    </div>
  );
}