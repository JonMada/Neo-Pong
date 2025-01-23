import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AIMenu = () => {
  const [player1, setPlayer1] = useState(""); // Estado para el jugador 1
  const [player1Color, setPlayer1Color] = useState("#ff0000"); // Color inicial para player 1
  const [difficulty, setDifficulty] = useState("normal"); // Dificultad seleccionada
  const navigate = useNavigate();

  // Función para generar un color aleatorio
  const getRandomColor = () => {
    const minBrightness = 128;
    const red = Math.floor(
      Math.random() * (256 - minBrightness) + minBrightness
    );
    const green = Math.floor(
      Math.random() * (256 - minBrightness) + minBrightness
    );
    const blue = Math.floor(
      Math.random() * (256 - minBrightness) + minBrightness
    );

    // Convertir a formato hexadecimal
    const randomColor = `#${red.toString(16).padStart(2, "0")}${green
      .toString(16)
      .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

    return randomColor;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Configuración para la IA: nombre fijo y color aleatorio
    const player2 = { name: "AI", color: getRandomColor() };

    // Redirigir a la página del juego pasando los nombres y colores como estado
    navigate("/game", {
      state: {
        player1: { name: player1, color: player1Color },
        player2: player2,
        difficulty: difficulty,
      },
    });
  };

  return (
    <div className="homepage">
      <h1>Neo-Pong</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-player">
          <label htmlFor="player1">Your Name:</label>
          <input
            type="text"
            id="player1"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            required
          />
          <label htmlFor="player1Color">Select Color:</label>
          <input
            type="color"
            id="player1Color"
            value={player1Color}
            onChange={(e) => setPlayer1Color(e.target.value)}
          />
        </div>

        {/* Selector de Dificultad */}
        <div className="difficulty-select">
          <label>Select Difficulty:</label>
          <div className="difficulty-buttons">
            <button
              type="button"
              className={`difficulty-button ${
                difficulty === "easy" ? "selected" : ""
              }`}
              onClick={() => setDifficulty("easy")}
            >
              Easy
            </button>
            <button
              type="button"
              className={`difficulty-button ${
                difficulty === "normal" ? "selected" : ""
              }`}
              onClick={() => setDifficulty("normal")}
            >
              Normal
            </button>
            <button
              type="button"
              className={`difficulty-button ${
                difficulty === "hard" ? "selected" : ""
              }`}
              onClick={() => setDifficulty("hard")}
            >
              Hard
            </button>
          </div>
        </div>

        <button type="submit" className="ia-button">
          Start Match
        </button>
      </form>
    </div>
  );
};

export default AIMenu;
