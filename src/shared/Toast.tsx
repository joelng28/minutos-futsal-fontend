import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [visible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3 segundos y desaparece
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onClose, 1000); // esperar animación
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const bgColor = type === "success" ? "bg-green-400" : "bg-red-400";

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 px-4 py-2 text-black rounded shadow transition-all duration-300
        ${bgColor}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      {message}
    </div>
  );
}