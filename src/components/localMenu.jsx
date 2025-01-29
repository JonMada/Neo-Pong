import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ColorSlider from "./colorSlider";

const LocalMenu = () => {
  const [player1, setPlayer1] = useState("");
  const [player1Color, setPlayer1Color] = useState("#ff0000");
  const [player2, setPlayer2] = useState("");
  const [player2Color, setPlayer2Color] = useState("#0000ff");
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Comprobación: si alguno de los nombres es "AI", mostrar el modal con un mensaje de error
    if (player1.toLowerCase() === "ai" || player2.toLowerCase() === "ai") {
      setErrorMessage(
        'The name "AI" is not allowed. Please choose another name.'
      );
      setShowModal(true); // Mostrar el modal
      return; // No continuar con el envío del formulario
    }

    // Si todo está bien, redirigir al juego
    navigate("/game", {
      state: {
        player1: { name: player1, color: player1Color },
        player2: { name: player2, color: player2Color },
      },
    });
  };

  const closeModal = () => {
    setShowModal(false); // Cerrar el modal
    setErrorMessage(""); // Limpiar el mensaje de error
  };

  return (
    <div className="local-menu">
      <form className="local-menu-form" onSubmit={handleSubmit}>
        <div className="local-menu-player">
          <label htmlFor="player1" className="local-menu-label">
            Player 1 Name:
          </label>
          <input
            type="text"
            id="player1"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            className="local-menu-input"
            required
          />
          <ColorSlider
            color={player1Color}
            setColor={setPlayer1Color}
            playerName="Player 1"
          />
        </div>
        <div className="local-menu-player">
          <label htmlFor="player2" className="local-menu-label">
            Player 2 Name:
          </label>
          <input
            type="text"
            id="player2"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            className="local-menu-input"
            required
          />
          <ColorSlider
            color={player2Color}
            setColor={setPlayer2Color}
            playerName="Player 2"
          />
        </div>
        <button type="submit" className="local-menu-button">
          Start Match
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="modal-message">{errorMessage}</p>
            <button className="modal-close-button" onClick={closeModal}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalMenu;
