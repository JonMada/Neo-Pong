import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/homePage";
import GameCanvas from "./components/gameCanvas";
import AudioPlayer from "./components/audioPlayer";
import CursorEffect from "./components/cursor";
import GameOver from "./components/gameOver";
import HomeButton from "./components/homeButton";

import "./styles/main.scss";

const App = () => {
  return (
    <Router>
      <div className="app">
        <CursorEffect />
        <HomeButton />
        <AudioPlayer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GameCanvas />} />
          <Route path="/game-over" element={<GameOver />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
