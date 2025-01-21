import { useEffect } from "react";

const CursorEffect = () => {
  useEffect(() => {
    const cursorContainer = document.createElement("div");
    cursorContainer.classList.add("cursor-container");
    document.body.appendChild(cursorContainer);

    const moveCursor = (e) => {
      // Crear un nuevo "rastro"
      const cursor = document.createElement("div");
      cursor.classList.add("cursor-neon");
      cursorContainer.appendChild(cursor);

      // Usar clientX y clientY para obtener las coordenadas relativas al área visible de la pantalla
      cursor.style.left = `${e.clientX - 10}px`; // Ajuste para centrarlo
      cursor.style.top = `${e.clientY - 10}px`;

      // Eliminar el rastro después de un pequeño retraso
      setTimeout(() => {
        cursor.remove();
      }, 300); // El rastro durará 300ms antes de desaparecer
    };

    // Escuchar el movimiento del mouse
    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursorContainer);
    };
  }, []);

  return null;
};

export default CursorEffect;
