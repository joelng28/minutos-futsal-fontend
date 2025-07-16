import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PartidoForm from "./components/PartidoForm";
import MinutosForm from './components/MinutosForm';

export default function App() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6">Fútbol Sala</h1>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<PartidoForm />} />
        <Route path="/minutos" element={<MinutosForm />} />
      </Routes>
    </BrowserRouter>

    </div>
  );
}