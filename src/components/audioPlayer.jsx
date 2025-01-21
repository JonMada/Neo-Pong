import { useState, useEffect } from "react";
import ReactHowler from "react-howler";
import { FaPlay, FaPause } from "react-icons/fa";

import Song from "../assets/audio/song.mp3";

const AudioPlayer = () => {
  const [playing, setPlaying] = useState(true); // Estado para controlar la reproducción
  const [volume, setVolume] = useState(0.5); // Control de volumen

  // Ruta de tu archivo de audio
  const audioSrc = Song;

  // Función para alternar la reproducción
  const togglePlay = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    if (playing) {
      console.log("Reproduciendo música...");
    } else {
      console.log("Pausado...");
    }
  }, [playing]);

  return (
    <div className="audio-player">
      {/* Icono que alterna entre play/pause */}
      <button onClick={togglePlay}>{playing ? <FaPause /> : <FaPlay />}</button>

      <ReactHowler
        src={audioSrc}
        playing={playing}
        volume={volume}
        loop={true}
      />
    </div>
  );
};

export default AudioPlayer;
