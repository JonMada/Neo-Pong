import { useLocation } from "react-router-dom";

const GameOver = () => {
  const location = useLocation();
  const { winner } = location.state;

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h1 className="title">Game Over!</h1>
        <p className="winner">{winner} wins the game</p>
      </div>
    </div>
  );
};

export default GameOver;
