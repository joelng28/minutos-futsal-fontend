import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PartidoForm from "./components/PartidoForm";
import Home from './pages/Home';

export default function App() {
  return (
    
      <BrowserRouter>
      <Routes>
        <Route path="/partidos" element={<PartidoForm />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>


  );
}