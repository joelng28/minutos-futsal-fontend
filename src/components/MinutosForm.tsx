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
  const [contadorActivo, setContador] = useState(true);
  const [jugadorASustituirId, setJugadorASustituirId] = useState<number | null>(null);
  const [tiempo, setTiempo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (contadorActivo) {
        setTiempo(prev => prev + 1);
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

  const abrirModal = (id: number) => {
    setJugadorASustituirId(id);
  };

  const confirmarSustitucion = (idEntrante: number) => {
    if (jugadorASustituirId !== null) {
      setJugadores((prev) =>
        prev.map((jug) => {
          if (jug.id === jugadorASustituirId) return { ...jug, enPista: false, rotacionActual: 0 };
          if (jug.id === idEntrante) return { ...jug, enPista: true, rotacionActual: 0 };
          return jug;
        })
      );
      setJugadorASustituirId(null);
    }
  };

  const formatearTiempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const jugadoresEnPista = jugadores.filter(j => j.enPista);
  const jugadoresFueraDePista = jugadores.filter(j => !j.enPista);

  return (
  <div className="w-screen min-h-screen overflow-x-hidden">
    <div className="max-w-full px-4 py-5 space-y-5">
      {/* Barra superior */}
      <div className="bg-cyan-500 p-4 rounded shadow-md flex flex-wrap gap-3 items-center w-full">
        <span className="text-xl font-bold text-white">Parte 1</span>
        <span className="text-xl font-bold text-white inline-block w-[5ch] text-center">{formatearTiempo(tiempo)}</span>
        <button className='w-[10 ch] text-center' onClick={() => setContador((prev) => !prev)}>
          {contadorActivo ? "Pausar" : "Iniciar"}
        </button>
        <button className="ml-auto">Finalizar parte</button>
      </div>

      {/* Tablas */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Jugadores en pista */}
        <div className="w-full lg:w-1/2 flex flex-col gap-2">
          <div className="w-full bg-green-500 py-2 rounded text-center text-white font-semibold">
            En pista
          </div>
          <table className="w-full table-fixed border border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-2">Dorsal</th>
                <th className="border px-2 py-2">Nombre</th>
                <th className="border px-2 py-2">Rotación actual</th>
                <th className="border px-2 py-2">Total</th>
                <th className="border px-2 py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {jugadoresEnPista.map((jug) => (
                <tr key={jug.id} className="bg-gray-100 border-b border-white">
                  <td className="px-2 py-2">{jug.dorsal}</td>
                  <td className="px-2 py-2">{jug.nombre}</td>
                  <td className="px-2 py-2">{formatearTiempo(jug.rotacionActual)}</td>
                  <td className="px-2 py-2">{formatearTiempo(jug.tiempoTotal)}</td>
                  <td className="px-2 py-2">
                    {jugadorASustituirId === null ? (
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => abrirModal(jug.id)}
                      >
                        Quitar
                      </button>
                    ) : jugadorASustituirId === jug.id ? (
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => setJugadorASustituirId(null)}
                      >
                        Cancelar
                      </button>
                    ) : (
                      <button
                        className="bg-red-500/30 text-white px-2 py-1 rounded"
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
        </div>

        {/* Banquillo */}
        <div className="w-full lg:w-1/2 flex flex-col gap-2">
          <div className="w-full bg-green-500 py-2 rounded text-center text-white font-semibold">
            Banquillo
          </div>
          <table className="w-full table-fixed border border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-2">Dorsal</th>
                <th className="border px-2 py-2">Nombre</th>
                <th className="border px-2 py-2">Rotación actual</th>
                <th className="border px-2 py-2">Total</th>
                <th className="border px-2 py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {jugadoresFueraDePista.map((jug) => (
                <tr key={jug.id} className="bg-gray-100 border-b border-white">
                  <td className="px-2 py-2">{jug.dorsal}</td>
                  <td className="px-2 py-2">{jug.nombre}</td>
                  <td className="px-2 py-2">{formatearTiempo(jug.rotacionActual)}</td>
                  <td className="px-2 py-2">{formatearTiempo(jug.tiempoTotal)}</td>
                  <td className="px-2 py-2">
                    <button
                      className={`${
                        jugadorASustituirId !== null
                          ? "bg-green-500"
                          : "bg-green-500/40"
                      } text-white px-2 py-1 rounded`}
                      disabled={jugadorASustituirId === null}
                      onClick={() => confirmarSustitucion(jug.id)}
                    >
                      Añadir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

}