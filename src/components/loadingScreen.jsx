import { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadResources = async () => {
      // Simulamos el proceso de carga aumentando el progreso cada 100ms
      for (let i = 0; i <= 100; i++) {
        await new Promise((resolve) => setTimeout(resolve, 40)); // 40ms para cada incremento
        setProgress(i);
      }
      setTimeout(() => {
        setLoading(false);
      }, 800);
    };

    loadResources();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingScreen;
