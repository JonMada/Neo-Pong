import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <div className="home-player">
      <button onClick={() => navigate("/")}>
        <FaHome />
      </button>
    </div>
  );
};

export default HomeButton;
