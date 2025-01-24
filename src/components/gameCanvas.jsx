import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScoreBoard from "./scoreBoard";
import Instrucciones from "./instrucciones";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const location = useLocation();
  const { player1, player2, difficulty } = location.state;

  const player1Y = useRef(150);
  const player2Y = useRef(150); // La IA usa esta referencia
  const ball = useRef({ x: 400, y: 200, dx: 0, dy: 0, trail: [] });

  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [showGoalAnimation, setShowGoalAnimation] = useState(false);
  const [goalLock, setGoalLock] = useState(false);
  const [ballInMiddle, setBallInMiddle] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const paddleWidth = 10;
  const paddleHeight = 125;
  const canvasWidth = 800;
  const canvasHeight = 400;

  const particles = useRef([]);

  const [pulseAlpha, setPulseAlpha] = useState(1);
  const [pulseDirection, setPulseDirection] = useState(0.01);

  // Control de las teclas de Player 1
  const handleKeyDownPlayer1 = (e) => {
    const step = 60;
    if (e.key === "w" || e.key === "W") {
      player1Y.current = Math.max(0, player1Y.current - step);
    }
    if (e.key === "s" || e.key === "S") {
      player1Y.current = Math.min(
        canvasHeight - paddleHeight,
        player1Y.current + step
      );
    }
  };

  // Control de las teclas de Player 1
  const handleKeyDownPlayer2 = (e) => {
    const step = 45;
    if (e.key === "ArrowUp" || e.key === "Up") {
      player2Y.current = Math.max(0, player2Y.current - step);
    }
    if (e.key === "ArrowDown" || e.key === "Down") {
      player2Y.current = Math.min(
        canvasHeight - paddleHeight,
        player2Y.current + step
      );
    }
  };

  // useEffect para agregar y remover los listeners de las teclas
  useEffect(() => {
    // Siempre habilitar controles para Player 1
    window.addEventListener("keydown", handleKeyDownPlayer1);

    // Solo habilitar controles para Player 2 si no es un bot (IA)
    if (player2.name !== "AI") {
      window.addEventListener("keydown", handleKeyDownPlayer2);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDownPlayer1);
      // Remover solo si Player 2 es un humano
      if (player2.name !== "AI") {
        window.removeEventListener("keydown", handleKeyDownPlayer2);
      }
    };
  }, [showGoalAnimation, ballInMiddle, player2.name]);

  //CountDown

  useEffect(() => {
    let timer;
    let hideGoTimer;

    setCountdown(3);

    timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          return "GO!";
        }
        return prev - 1;
      });
    }, 1000);

    hideGoTimer = setTimeout(() => {
      setCountdown(null);
      ball.current = {
        ...ball.current,
        dx: 0, // La pelota está estática hasta que termine el countdown
        dy: 0,
      };
      setTimeout(() => {
        const direction = Math.random() < 0.5 ? -1 : 1;
        ball.current.dx = direction * 3;
        ball.current.dy = 2; // Mantén la velocidad en Y constante
      }, 50);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(hideGoTimer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const drawPattern = () => {
      const spacing = 30;
      const brightProbability = 0.1;

      // Limpiar el canvas antes de dibujar el patrón
      context.clearRect(0, 0, canvas.width, canvas.height);

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

          gradient.addColorStop(0, "rgb(7, 187, 237)");
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
          size: Math.random() * 2.5 + 1, // Tamaño partículas
          color: `hsl(${Math.random() * 180 + 180}, 100%, ${
            Math.random() * 40 + 30
          }%)`,
          life: Math.random() * 30 + 30, // Vida partículas
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
      if (countdown !== null || showGoalAnimation) return;

      let { x, y, dx, dy } = ball.current;

      if (ball.current.trail.length > 40) ball.current.trail.shift();
      ball.current.trail.push({ x, y });

      x += dx;
      y += dy;

      if (y - 8 <= 0) {
        y = 8;
        dy = Math.abs(dy);
        createParticles(x, y);
      }

      if (y + 8 >= canvasHeight) {
        y = canvasHeight - 8;
        dy = -Math.abs(dy);
        createParticles(x, y);
      }

      // Colisión con la pala del jugador 1 (jugador)
      if (
        x - 8 <= 20 && // Golpea el lado izquierdo
        y >= player1Y.current &&
        y <= player1Y.current + paddleHeight
      ) {
        // Cálculo de la posición de impacto relativa
        const paddleCenter = player1Y.current + paddleHeight / 2;
        const relativeImpact = (y - paddleCenter) / (paddleHeight / 2); // Normalizado [-1, 1]

        // Ángulo máximo de rebote
        const maxBounceAngle = 60 * (Math.PI / 180); // Máximo en radianes
        const bounceAngle = relativeImpact * maxBounceAngle; // Ángulo del rebote

        // Mantener la velocidad constante tras el rebote
        const speed = Math.sqrt(dx * dx + dy * dy) * 1.05; // Incremento ligero en la velocidad

        // Nuevas componentes de la velocidad
        dx = Math.abs(speed * Math.cos(bounceAngle)); // Siempre positivo hacia la derecha
        dy = speed * Math.sin(bounceAngle);

        createParticles(x, y); // Animación en la colisión
      }

      // Colisión con la pala del jugador 2 (IA)
      if (
        x + 8 >= canvasWidth - 20 && // Golpea el lado derecho
        y >= player2Y.current &&
        y <= player2Y.current + paddleHeight
      ) {
        // Cálculo de la posición de impacto relativa
        const paddleCenter = player2Y.current + paddleHeight / 2;
        const relativeImpact = (y - paddleCenter) / (paddleHeight / 2);

        // Ángulo máximo de rebote
        const maxBounceAngle = 60 * (Math.PI / 180); // Máximo en radianes
        const bounceAngle = relativeImpact * maxBounceAngle; // Ángulo del rebote

        // Mantener la velocidad constante tras el rebote
        const speed = Math.sqrt(dx * dx + dy * dy) * 1.05; // Incremento ligero en la velocidad

        // Nuevas componentes de la velocidad
        dx = -Math.abs(speed * Math.cos(bounceAngle)); // Siempre negativo hacia la izquierda
        dy = speed * Math.sin(bounceAngle);

        createParticles(x, y); // Animación en la colisión
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
            dy: 2,
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
      if (showGoalAnimation) {
        drawGame();
        return;
      }

      setPulseAlpha((prevAlpha) => {
        let newAlpha = prevAlpha + pulseDirection;
        if (newAlpha <= 0.1 || newAlpha >= 1) {
          setPulseDirection(-pulseDirection);
        }
        return newAlpha;
      });

      updateBall();
      aiMovement();
      drawGame();
      updateParticles(context);
    };

    let lastMoveTime = 0;

    let smoothedTargetY = 0;

    //Movimiento de la IA

    const aiMovement = () => {
      if (ballInMiddle || ball.current.dy === 0 || player2.name !== "AI") {
        return;
      }

      const difficultySettings = {
        hard: {
          speedMultiplier: 2,
          errorMargin: 9,
          reactionDelay: 10,
        },
        normal: {
          speedMultiplier: 1.1,
          errorMargin: 15,
          reactionDelay: 15,
        },
        easy: {
          speedMultiplier: 0.2,
          errorMargin: 30,
          reactionDelay: 25,
        },
      };

      const { errorMargin, reactionDelay } = difficultySettings[difficulty];

      if (Date.now() - lastMoveTime < reactionDelay) {
        return;
      }
      lastMoveTime = Date.now();

      const predictionFactor =
        difficulty === "hard" ? 1 : difficulty === "normal" ? 0.85 : 0.7;
      const predictedBallY =
        ball.current.y +
        (ball.current.dy / Math.abs(ball.current.dy)) *
          Math.min(Math.abs(ball.current.dy) * predictionFactor, canvasHeight);

      const paddleZones = {
        top: -paddleHeight * 0.35,
        bottom: paddleHeight * 0.35,
      };

      const zonePreference =
        Math.random() < 0.4 ? "top" : Math.random() < 0.8 ? "bottom" : "center";

      const zoneOffset = paddleZones[zonePreference] || 0;

      const borderBias =
        difficulty === "hard"
          ? Math.random() * 5 - 2.5
          : difficulty === "normal"
          ? Math.random() * 10 - 5
          : Math.random() * 15 - 7.5;

      //Desviaciones según niveles de dificultad
      const deviation =
        difficulty === "hard"
          ? Math.random() < 0.2
            ? 5
            : -5
          : difficulty === "normal"
          ? Math.random() < 0.5
            ? 15
            : -15
          : Math.random() < 0.5
          ? 30
          : -30;

      const targetYUnsmoothed =
        predictedBallY -
        paddleHeight / 2 +
        zoneOffset +
        borderBias +
        (Math.random() * errorMargin - errorMargin / 2) +
        deviation; // Aplicar desviación adicional

      // Suavizar el objetivo
      smoothedTargetY = smoothedTargetY * 0.6 + targetYUnsmoothed * 0.4;

      // Movimiento suave hacia el objetivo suavizado
      player2Y.current += (smoothedTargetY - player2Y.current) * 0.05;

      // Limitar movimiento dentro de los límites
      player2Y.current = Math.max(
        0,
        Math.min(canvasHeight - paddleHeight, player2Y.current)
      );
    };

    gameLoop();
  }, [score, showGoalAnimation, ballInMiddle]);

  return (
    <div>
      {/* CountDown Animation*/}
      {countdown !== null && <div className="countdown">{countdown}</div>}

      {/* Goal Animation */}
      {showGoalAnimation && (
        <div className="goal-animation">
          <h1>GOAL!</h1>
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
