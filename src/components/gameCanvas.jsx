import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScoreBoard from "./ScoreBoard";
import Instrucciones from "./instrucciones";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const location = useLocation();
  const { player1, player2, difficulty } = location.state;

  const player1Y = useRef(150);
  const player2Y = useRef(150); // La IA usa esta referencia
  const ball = useRef({ x: 400, y: 200, dx: 2, dy: 1.5, trail: [] });

  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [showGoalAnimation, setShowGoalAnimation] = useState(false);
  const [goalLock, setGoalLock] = useState(false);
  const [ballInMiddle, setBallInMiddle] = useState(false);

  const paddleWidth = 10;
  const paddleHeight = 125;
  const canvasWidth = 800;
  const canvasHeight = 400;

  const ballSpeed = 2.5;
  const speedIncrementFactor = 2.5;
  const maxSpeed = 160;

  const particles = useRef([]);

  const [pulseAlpha, setPulseAlpha] = useState(1);
  const [pulseDirection, setPulseDirection] = useState(0.01);

  // Ajustar la velocidad de la IA según la dificultad seleccionada
  const aiSpeed = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 6;

  const normalizeSpeed = (dx, dy, speed) => {
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    return { dx: (dx / magnitude) * speed, dy: (dy / magnitude) * speed };
  };

  const handleKeyDown = (e) => {
    const step = 45;
    if ((e.key === "w" || e.key === "W") && player1Y.current > 0)
      player1Y.current -= step;
    if (
      (e.key === "s" || e.key === "S") &&
      player1Y.current < canvasHeight - paddleHeight
    )
      player1Y.current += step;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showGoalAnimation, ballInMiddle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const drawPattern = () => {
      const spacing = 30;
      const brightProbability = 0.1;

      for (let y = 0; y < canvas.height; y += spacing) {
        for (let x = 0; x < canvas.width; x += spacing) {
          context.beginPath();
          const isBright = Math.random() < brightProbability;

          if (isBright) {
            context.arc(x, y, 3, 0, Math.PI * 2);
            context.fillStyle = "rgba(7, 34, 237, 0.9)";
            context.shadowColor = "rgba(87, 102, 213, 0.9)";
            context.shadowBlur = 10;
          } else {
            context.arc(x, y, 1.5, 0, Math.PI * 2);
            context.fillStyle = "rgba(200, 200, 200, 0.5)";
            context.shadowColor = "transparent";
            context.shadowBlur = 0;
          }

          context.fill();
          context.shadowBlur = 0;
          context.shadowColor = "transparent";
        }
      }
    };

    const drawPaddle = (x, y, color) => {
      const gradient = context.createLinearGradient(0, y, 0, y + paddleHeight);
      gradient.addColorStop(0, `${color}80`);
      gradient.addColorStop(1, `${color}40`);

      context.fillStyle = gradient;
      context.lineWidth = 5;
      context.strokeStyle = `${color}FF`;
      context.lineJoin = "round";

      context.beginPath();
      context.moveTo(x, y + 10);
      context.lineTo(x + paddleWidth, y + 10);
      context.lineTo(x + paddleWidth, y + paddleHeight - 10);
      context.lineTo(x, y + paddleHeight - 10);
      context.closePath();
      context.fill();
      context.stroke();

      context.shadowColor = `${color}FF`;
      context.shadowBlur = 15;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.fill();

      context.shadowBlur = 0;
      context.shadowColor = "transparent";
    };

    const drawGame = () => {
      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height);

      drawPattern();

      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(7, 34, 237, 1)");
      gradient.addColorStop(0.5, "rgb(137, 21, 169)");
      gradient.addColorStop(1, "rgba(7, 34, 237, 0.6)");

      context.strokeStyle = gradient;
      context.lineWidth = 4;
      context.shadowColor = "rgba(7, 34, 237, 1)";
      context.shadowBlur = 50;
      context.globalAlpha = pulseAlpha;

      context.setLineDash([]);
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.stroke();

      context.shadowBlur = 0;
      context.globalAlpha = 1;

      drawPaddle(10, player1Y.current, player1.color);
      drawPaddle(canvas.width - 20, player2Y.current, player2.color);

      updateParticles(context);

      if (ball.current.trail.length > 0) {
        context.globalAlpha = 0.08;

        for (let i = 0; i < ball.current.trail.length; i++) {
          const trailPosition = ball.current.trail[i];

          const gradient = context.createRadialGradient(
            trailPosition.x,
            trailPosition.y,
            0,
            trailPosition.x,
            trailPosition.y,
            8
          );

          gradient.addColorStop(0, "rgba(7, 34, 237, 1)");
          gradient.addColorStop(1, "rgba(255, 0, 0, 0.3)");

          context.beginPath();
          context.arc(trailPosition.x, trailPosition.y, 8, 0, Math.PI * 2);
          context.fillStyle = gradient;
          context.fill();
        }

        context.globalAlpha = 1;
      }

      context.beginPath();
      context.arc(ball.current.x, ball.current.y, 10, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
    };

    // Partículas de golpeo
    const createParticles = (x, y) => {
      const numberOfParticles = 20; // Número de partículas generadas
      for (let i = 0; i < numberOfParticles; i++) {
        particles.current.push({
          x: x,
          y: y,
          dx: Math.random() * 4 - 2, // Velocidad aleatoria para las partículas
          dy: Math.random() * 4 - 2,
          size: Math.random() * 2.5 + 1, // Tamaño más grande de partículas
          color: `hsl(${Math.random() * 180 + 180}, 100%, ${
            Math.random() * 40 + 30
          }%)`,
          life: Math.random() * 30 + 30, // Vida más larga para las partículas
        });
      }
    };

    // Actualización y dibujo de partículas
    const updateParticles = (context) => {
      particles.current.forEach((particle, index) => {
        if (particle.life <= 0) {
          particles.current.splice(index, 1); // Eliminar partículas cuando se acabe su vida
        } else {
          particle.x += particle.dx;
          particle.y += particle.dy;
          particle.life -= 1;

          // Dibujar cada partícula
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fillStyle = particle.color;
          context.fill();
        }
      });
    };

    // Actualización de la pelota
    const updateBall = () => {
      if (showGoalAnimation) return;

      let { x, y, dx, dy } = ball.current;

      if (ball.current.trail.length > 40) ball.current.trail.shift();
      ball.current.trail.push({ x, y });

      x += dx;
      y += dy;

      if (y - 8 <= 0 || y + 8 >= canvasHeight) {
        dy = -dy;
        createParticles(x, y); // Crear partículas en colisión con las paredes
      }

      // Colisión con la pala del jugador 1 (jugador)
      if (
        x - 8 <= 20 &&
        y >= player1Y.current &&
        y <= player1Y.current + paddleHeight
      ) {
        dx = -dx;
        const newSpeed = Math.min(ballSpeed * speedIncrementFactor, maxSpeed);
        const normalized = normalizeSpeed(dx, dy, newSpeed);
        dx = normalized.dx;
        dy = normalized.dy;
        createParticles(x, y); // Crear partículas en colisión con la pala
      }

      // Colisión con la pala del jugador 2 (IA)
      if (
        x + 8 >= canvasWidth - 20 &&
        y >= player2Y.current &&
        y <= player2Y.current + paddleHeight
      ) {
        dx = -dx;
        const newSpeed = Math.min(ballSpeed * speedIncrementFactor, maxSpeed);
        const normalized = normalizeSpeed(dx, dy, newSpeed);
        dx = normalized.dx;
        dy = normalized.dy;
        createParticles(x, y); // Crear partículas en colisión con la pala
      }

      if ((x - 8 <= 0 || x + 8 >= canvasWidth) && !goalLock) {
        setGoalLock(true);
        setShowGoalAnimation(true);

        if (x - 8 <= 0) {
          setScore((prevScore) => ({
            ...prevScore,
            player2: prevScore.player2 + 1,
          }));
        } else {
          setScore((prevScore) => ({
            ...prevScore,
            player1: prevScore.player1 + 1,
          }));
        }

        ball.current = {
          x: canvasWidth / 2,
          y: canvasHeight / 2,
          dx: 0,
          dy: 0,
          trail: [],
        };

        setBallInMiddle(true);
        setTimeout(() => {
          setBallInMiddle(false);
          ball.current = {
            ...ball.current,
            dx: x - 8 <= 0 ? -2 : 2,
            dy: 1.3,
          };
        }, 3000);

        setTimeout(() => {
          setShowGoalAnimation(false);
          setGoalLock(false);
        }, 3000);
        return;
      }

      ball.current = { x, y, dx, dy, trail: ball.current.trail };
      requestAnimationFrame(gameLoop);
    };

    const gameLoop = () => {
      if (showGoalAnimation) return;

      setPulseAlpha((prevAlpha) => {
        let newAlpha = prevAlpha + pulseDirection;
        if (newAlpha <= 0.1 || newAlpha >= 1) {
          setPulseDirection(-pulseDirection);
        }
        return newAlpha;
      });

      updateBall();
      aiMovement(); // Movimiento de la IA
      drawGame();
      updateParticles(context);
    };

    let lastMoveTime = 0; // Variable para el control de tiempo de la IA

    const aiMovement = () => {
      // Evitar el movimiento si la pelota está en el medio o está detenida
      if (ballInMiddle || ball.current.dy === 0) {
        return;
      }

      // Configuración de la velocidad base y margen de error según la dificultad
      const difficultySettings = {
        hard: { speedMultiplier: 3.2, errorMargin: 1, reactionDelay: 1 },
        normal: { speedMultiplier: 2.6, errorMargin: 5, reactionDelay: 5 },
        easy: { speedMultiplier: 2.2, errorMargin: 7, reactionDelay: 10 },
      };

      // Establecer la velocidad base, margen de error y retraso de reacción según la dificultad
      const { speedMultiplier, errorMargin, reactionDelay } =
        difficultySettings[difficulty];

      // Control de la reacción de la IA con un retraso
      if (Date.now() - lastMoveTime < reactionDelay) {
        return; // La IA espera según el retraso de reacción antes de moverse
      }
      lastMoveTime = Date.now(); // Actualiza el tiempo de la última acción

      // Predicción de la posición futura de la pelota
      const predictedBallY = ball.current.y + ball.current.dy * 0.8; // Factor de predicción fijo

      // Introducimos algo de "ruido" o aleatoriedad para hacer el movimiento más humano
      let targetY =
        predictedBallY +
        (Math.random() * errorMargin - errorMargin / 2) + // Margen de error aleatorio
        Math.sin(Date.now() / 200) * 10; // Oscilación suave para hacer el movimiento más impredecible

      // Calcular la distancia a la que la IA tiene que moverse
      const distanceToTarget = Math.abs(player2Y.current - targetY);

      // Factor de velocidad dinámico dependiendo de la distancia (más rápido cerca de la pelota)
      const speedFactor = Math.max(0.2, 1 - distanceToTarget / canvasHeight);

      // Introducir un pequeño factor aleatorio para simular variabilidad en la IA
      const randomSpeedFactor = Math.random() * 0.2 + 0.9; // Factor aleatorio entre 0.9 y 1.1
      const speed = aiSpeed * speedMultiplier * speedFactor * randomSpeedFactor;

      // Movimiento más humano: la IA no siempre se mueve directamente al objetivo
      if (player2Y.current < targetY) {
        // Si la IA está por debajo del objetivo, intenta moverse hacia abajo
        player2Y.current += speed * (Math.random() * 0.3 + 0.7); // Movimiento no lineal
      } else if (player2Y.current > targetY) {
        // Si la IA está por encima del objetivo, intenta moverse hacia arriba
        player2Y.current -= speed * (Math.random() * 0.3 + 0.7); // Movimiento no lineal
      }

      // Aseguramos que la IA no se mueva fuera de los límites de la pantalla
      player2Y.current = Math.max(
        0,
        Math.min(canvasHeight - paddleHeight, player2Y.current)
      );
    };

    gameLoop();
  }, [score, showGoalAnimation, ballInMiddle]);

  return (
    <div>
      {showGoalAnimation && (
        <div className="goal-animation">
          <h1>¡GOAL!</h1>
        </div>
      )}

      <ScoreBoard
        player1Name={player1.name}
        player2Name={player2.name}
        player1Score={score.player1}
        player2Score={score.player2}
      />
      <canvas
        ref={canvasRef}
        className="canvas-container"
        style={{
          margin: "20px auto",
          display: "block",
          backgroundColor: "#000",
        }}
      />
      <Instrucciones player1Name={player1.name} player2Name={player2.name} />
    </div>
  );
};

export default GameCanvas;
