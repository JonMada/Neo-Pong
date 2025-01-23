import { useState, useEffect } from "react";
import ReactHowler from "react-howler";
import { FaPlay, FaPause } from "react-icons/fa";

import Song1 from "../assets/audio/song.mp3";
import Song2 from "../assets/audio/song2.mp3";
import Song3 from "../assets/audio/song3.mp3";
import Song4 from "../assets/audio/song4.mp3";
import Song5 from "../assets/audio/song5.mp3";

const AudioPlayer = () => {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Lista de canciones
  const songs = [Song1, Song2, Song3, Song4, Song5];

  const shuffleSongs = (songList) => {
    return songList.sort(() => Math.random() - 0.5);
  };

  // Lista de canciones aleatoria
  const shuffledSongs = shuffleSongs([...songs]);

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const handleEnd = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % shuffledSongs.length);
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
        src={shuffledSongs[currentSongIndex]}
        playing={playing}
        volume={volume}
        loop={false} //
        onEnd={handleEnd}
      />
    </div>
  );
};

export default AudioPlayer;
