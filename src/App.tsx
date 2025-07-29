import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from "./context/ToastContext";
import Home from './pages/Home';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>

  );
}