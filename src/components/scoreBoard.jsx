import { useNavigate } from "react-router-dom";

const ScoreBoard = ({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
}) => {
  const navigate = useNavigate();

  if (player1Score === 7 || player2Score === 7) {
    setTimeout(() => {
      navigate("/game-over", {
        state: { winner: player1Score === 7 ? player1Name : player2Name },
      });
    }, 2000);
  }

  return (
    <div>
      <div className="score-board">
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
