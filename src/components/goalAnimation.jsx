import React, { useEffect, useState } from "react";

const GoalAnimation = ({ onAnimationEnd }) => {
  const [animationState, setAnimationState] = useState("start");

  useEffect(() => {
    if (animationState === "start") {
      const timer = setTimeout(() => {
        setAnimationState("end");
        // Llamar a onAnimationEnd cuando termine la animación
        setTimeout(() => {
          onAnimationEnd();
        }, 2500);
      }, 2500); // La animación dura 2 segundos

      return () => clearTimeout(timer);
    }
  }, [animationState, onAnimationEnd]);

  return (
    <div className="goal-animation-container">
      <div className={`goal-animation ${animationState}`}>
        <h1>GOAL!</h1>
      </div>
    </div>
  );
};

export default GoalAnimation;
