import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const GameOver = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraemos datos del ganador y jugadores
  const { winner, player1Name, player2Name, player1Color, player2Color } =
    location.state || {};

  // Redirige si no hay datos válidos
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  // Función para reiniciar el juego
  const handleRestart = () => {
    navigate("/");
  };

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h1 className="title">Game Over!</h1>
        <p className="winner">{winner} wins the game</p>
        <button onClick={handleRestart}>Back to Menu</button>
      </div>
    </div>
  );
};

export default GameOver;
