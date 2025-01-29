import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Importación de Menus
import Menu from "./components/menu";
import LocalMenu from "./components/localMenu";
import AIMenu from "./components/AIMenu";

import GameCanvas from "./components/gameCanvas";
import AudioPlayer from "./components/audioPlayer";
import CursorEffect from "./components/cursor";
import GameOver from "./components/gameOver";
import HomeButton from "./components/homeButton";

import LoadingScreen from "./components/loadingScreen";

import "./styles/main.scss";

const App = () => {
  return (
    <Router>
      <div className="app">
        <LoadingScreen />
        <CursorEffect />
        <HomeButton />
        <AudioPlayer />
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/local-game" element={<LocalMenu />} />
          <Route path="/ai-game" element={<AIMenu />} />
          <Route path="/game" element={<GameCanvas />} />
          <Route path="/game-over" element={<GameOver />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
