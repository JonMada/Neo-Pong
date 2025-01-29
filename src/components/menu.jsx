import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Menu = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

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
      </div>
      {isMobile && (
        <div className="main-menu__warning">
          <p>
            This game is designed for PC. It may not provide the best experience
            on mobile devices. It is best played on a full-screen monitor.
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
