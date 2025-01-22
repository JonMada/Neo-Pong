import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <h1 className="main-menu__title">Neo-Pong</h1>
      <div className="main-menu__options">
        <button
          className="main-menu__button"
          onClick={() => navigate("/local-game")}
        >
          Multiplayer Local
        </button>
        <button
          className="main-menu__button"
          onClick={() => navigate("/ai-game")}
        >
          Challenge the AI
        </button>
        <button
          className="main-menu__button"
          onClick={() => navigate("/online-game")}
        >
          Play Online
        </button>
      </div>
    </div>
  );
};

export default Menu;
