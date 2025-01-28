import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ScoreBoard = ({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
}) => {
  const navigate = useNavigate();
  const [isLatent, setIsLatent] = useState(false);

  useEffect(() => {
    // Activar la latencia
    setIsLatent(true);

    const timeout = setTimeout(() => {
      setIsLatent(false);
    }, 3000);

    // Si un jugador marca 7 puntos, redirigimos
    if (player1Score === 7 || player2Score === 7) {
      const winner = player1Score === 7 ? player1Name : player2Name;
      setTimeout(() => {
        navigate("/game-over", { state: { winner } });
      }, 2500); // Retraso de 2.5 segundos para permitir que el efecto se vea
    }

    return () => clearTimeout(timeout); // Limpiar el timeout cuando el componente se desmonte
  }, [player1Score, player2Score, navigate, player1Name, player2Name]);

  return (
    <div>
      <div className={`score-board ${isLatent ? "latency" : ""}`}>
        <span>
          {player1Name}
          <div className="score">{player1Score}</div>
        </span>
        <span>
          {player2Name}
          <div className="score">{player2Score}</div>
        </span>
      </div>
    </div>
  );
};

export default ScoreBoard;
