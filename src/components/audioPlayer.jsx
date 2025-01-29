import { useState, useEffect } from "react";
import ReactHowler from "react-howler";
import { FaPlay, FaPause } from "react-icons/fa";

import Song1 from "../assets/audio/song.mp3";
import Song2 from "../assets/audio/song2.mp3";
import Song3 from "../assets/audio/song3.mp3";
import Song4 from "../assets/audio/song4.mp3";
import Song5 from "../assets/audio/song5.mp3";

const AudioPlayer = () => {
  const [playing, setPlaying] = useState(false); // Inicializamos con 'false' para dispositivos móviles
  const [volume, setVolume] = useState(0.5);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Lista de canciones
  const songs = [Song1, Song2, Song3, Song4, Song5];

  // Función para mezclar las canciones aleatoriamente
  const shuffleSongs = (songList) => {
    return songList.sort(() => Math.random() - 0.5);
  };

  // Lista de canciones aleatorias
  const shuffledSongs = shuffleSongs([...songs]);

  // Detectar si el dispositivo es móvil
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Ejecutar la función al cargar y cambiar el tamaño de la ventana
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setPlaying(true);
    }
  }, [isMobile]);

  const handleUserInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      setPlaying(true); // Inicia la reproducción después de la interacción
    }
  };

  // Función para cambiar el estado de la reproducción
  const togglePlay = () => {
    if (isMobile) {
      if (!hasUserInteracted) {
        handleUserInteraction();
      } else {
        setPlaying(!playing);
      }
    } else {
      setPlaying(!playing);
    }
  };

  const handleEnd = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % shuffledSongs.length);
  };

  return (
    <div className="audio-player">
      {/* Botón que alterna entre play/pause */}
      <button onClick={togglePlay} className="play-pause-btn">
        {playing ? <FaPause /> : <FaPlay />}
      </button>

      {/* Reproductor de audio */}
      <ReactHowler
        src={shuffledSongs[currentSongIndex]}
        playing={playing} // Se reproduce cuando el estado 'playing' es true
        volume={volume}
        loop={false}
        onEnd={handleEnd}
      />
    </div>
  );
};

export default AudioPlayer;
