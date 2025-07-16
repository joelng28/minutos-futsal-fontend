import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PartidoForm from "./components/PartidoForm";
import MinutosForm from './components/MinutosForm';

export default function App() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <BrowserRouter>
      <Routes>
        <Route path="/partidos" element={<PartidoForm />} />
        <Route path="/" element={<MinutosForm />} />
      </Routes>
    </BrowserRouter>

    </div>
  );
}