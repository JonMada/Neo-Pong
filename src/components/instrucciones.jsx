import React, { useState, useEffect } from "react";

const Instrucciones = ({ player1Name, player2Name }) => {
  const [fade, setFade] = useState(false);

  // Usamos useEffect para iniciar el desvanecimiento después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true); // Cambia el estado para activar el desvanecimiento
    }, 4000);

    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, []);

  return (
    <div className={`instructions-container ${fade ? "fade-out" : ""}`}>
      <div className="instruction instruction-left">
        <p>
          <span>{player1Name}</span> use W and S to move up and down.
        </p>
      </div>

      {player2Name !== "AI" && (
        <div className="instruction instruction-right">
          <p>
            <span>{player2Name}</span> use the arrow keys to move up and down.
          </p>
        </div>
      )}
    </div>
  );
};

export default Instrucciones;
