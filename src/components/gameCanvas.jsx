import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScoreBoard from "./scoreBoard";
import Instrucciones from "./instrucciones";
import GoalAnimation from "./goalAnimation";

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

  //Animación de gol

  const handleGoalAnimationEnd = () => {
    setShowGoalAnimation(false);
    setGoalLock(false);
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
        ball.current.dx = direction * 2.5;
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

    // Lógica después de que se termine el gol y la animación
    if (showGoalAnimation === false && goalLock === false) {
      // Centrar las palas después del gol
      player1Y.current = canvasHeight / 2 - paddleHeight / 2; // Centrar jugador 1
      player2Y.current = canvasHeight / 2 - paddleHeight / 2; // Centrar jugador 2
    }

    let lastTime = 0; // Tiempo del último frame
    let timeDelta = 0; // Diferencia de tiempo entre frames

    const drawPattern = () => {
      const spacing = 30;
      const brightProbability = 0.1;

      // Variación dinámica en la probabilidad de brillo y en el tamaño de las partículas
      const scoreFactor = (score.player1 + score.player2) / 10; // Factor de cambio basado en el puntaje
      const dynamicBrightProbability = Math.min(
        brightProbability + scoreFactor * 0.05,
        0.4
      ); // Probabilidad máxima de brillo

      // Desvanecer el fondo con un color oscuro translúcido para permitir el patrón anterior
      context.fillStyle = "rgba(0, 0, 0, 0.1)"; // Fondo oscuro con poca transparencia
      context.fillRect(0, 0, canvas.width, canvas.height); // Fondo que se desvanece con el tiempo

      // Obtener el tiempo actual
      const time = performance.now(); // Usar performance.now() para mayor precisión en el tiempo

      // Calcular el tiempo transcurrido
      timeDelta = (time - lastTime) / 1000; // Convertir de milisegundos a segundos
      lastTime = time;

      for (let y = 0; y < canvas.height; y += spacing) {
        for (let x = 0; x < canvas.width; x += spacing) {
          context.beginPath();

          // Usamos el tiempo transcurrido para variar si la partícula se ilumina o no
          const timeOffset = (x + y) * 0.1; // Esto varía dependiendo de la posición de la partícula
          const cycleFactor = Math.sin(time / 1000 + timeOffset); // Oscilación más controlada

          // Introducimos una probabilidad aleatoria para que no todas las partículas se iluminen
          const isBright =
            Math.random() < dynamicBrightProbability && cycleFactor > 0; // Aleatorio + tiempo

          // Cambiar el color de las partículas dependiendo del puntaje y del tiempo
          let particleColor;
          if (isBright) {
            particleColor = `rgba(7, 34, 237, 0.9)`; // Azul brillante
            context.shadowColor = "rgba(87, 102, 213, 0.9)";
          } else {
            const hue = (score.player1 + score.player2) * 10; // Cambio de color en cada gol
            particleColor = `hsl(${hue % 360}, 100%, 60%)`; // Colores cambiantes
            context.shadowColor = "transparent";
          }

          // Tamaño constante para las partículas
          const particleSize = isBright ? 2.5 : 0.6; // Tamaño fijo para las partículas brillantes

          // Dibujar la partícula
          context.arc(x, y, particleSize, 0, Math.PI * 2);
          context.fillStyle = particleColor;
          context.shadowBlur = isBright ? 10 : 0; // Sombra solo para partículas brillantes

          context.fill();
          context.shadowBlur = 0; // Resetear sombra
          context.shadowColor = "transparent"; // Resetear sombra
        }
      }
    };

    const drawPaddle = (x, y, color) => {
      // Crear un gradiente radial para el relleno con el efecto de luz de neón cyberpunk
      const radialGradient = context.createRadialGradient(
        x + paddleWidth / 2,
        y + paddleHeight / 2,
        0,
        x + paddleWidth / 2,
        y + paddleHeight / 2,
        paddleHeight / 2
      );

      // Usar colores típicos del estilo cyberpunk (cian, magenta, verde)
      radialGradient.addColorStop(0, `${color}FF`); // Centro brillante
      radialGradient.addColorStop(1, `${color}60`); // Bordes más oscuros y metálicos

      // Establecer el gradiente para el relleno de la pala
      context.fillStyle = radialGradient;
      context.lineWidth = 5;
      context.strokeStyle = `${color}FF`; // Borde neón brillante
      context.lineJoin = "round";

      // Dibujar la pala con el gradiente
      context.beginPath();
      context.moveTo(x, y + 10);
      context.lineTo(x + paddleWidth, y + 10);
      context.lineTo(x + paddleWidth, y + paddleHeight - 10);
      context.lineTo(x, y + paddleHeight - 10);
      context.closePath();
      context.fill();
      context.stroke();
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
          life: Math.random() * 30 + 30,
        });
      }
    };

    // Actualización y dibujo de partículas
    const updateParticles = (context) => {
      const activeParticles = []; // Array para almacenar las partículas vivas

      particles.current.forEach((particle) => {
        if (particle.life <= 0) {
          return; // Si la partícula está muerta, no la dibujamos
        }

        // Movimiento de las partículas
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life -= 1;

        // Dibujar la partícula
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.fill();

        // Solo agregamos partículas vivas al array
        activeParticles.push(particle);
      });

      // Actualizar las partículas activas
      particles.current = activeParticles;
    };

    //Gestion de la pelota

    const updateBall = () => {
      if (countdown !== null) return;

      if (showGoalAnimation) {
        ball.current.dx = 0;
        ball.current.dy = 0;
      }

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

      // Colisión con la pala del jugador 2 _ (IA)
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
          setShowGoalAnimation(false);
          setGoalLock(false);
        }, 3000);

        setTimeout(() => {
          setBallInMiddle(false);
          const direction = x - 8 <= 0 ? -1 : 1; // Direccion del gol
          const initialSpeed = 2.5; // Velocidad inicial para la pelota
          const maxSpeed = 10; // Máxima velocidad permitida

          ball.current = {
            x: canvasWidth / 2,
            y: canvasHeight / 2,
            dx: direction * initialSpeed,
            dy: 2,
            trail: [],
          };

          ball.current.dx =
            Math.min(Math.abs(ball.current.dx), maxSpeed) *
            Math.sign(ball.current.dx);
          ball.current.dy = Math.min(Math.abs(ball.current.dy), maxSpeed);
        }, 3500);

        return;
      }

      ball.current.x = x;
      ball.current.y = y;
      ball.current.dx = dx;
      ball.current.dy = dy;
      ball.current.trail = ball.current.trail;

      requestAnimationFrame(gameLoop);
    };

    const gameLoop = () => {
      drawGame();
      updateParticles(context);

      // Si estamos en animación de gol o la pelota está en el medio, no actualizamos el movimiento de la pelota.
      if (showGoalAnimation || ballInMiddle) {
        return;
      }

      updateBall(); // Solo actualiza la pelota si no hay animación de gol ni está en el medio
      aiMovement(); // Movimiento de la IA, incluso si hay animación de gol

      // Llama al siguiente frame para continuar la animación
    };

    let lastMoveTime = 0;

    //Movimiento de la IA

    const aiMovement = () => {
      if (ballInMiddle || ball.current.dy === 0 || player2.name !== "AI") {
        return;
      }

      const difficultySettings = {
        hard: {
          speedMultiplier: 5.5,
          errorMargin: 0.5,
          reactionDelay: 1,
        },
        normal: {
          speedMultiplier: 4.5,
          errorMargin: 2,
          reactionDelay: 2,
        },
        easy: {
          speedMultiplier: 3.2,
          errorMargin: 10,
          reactionDelay: 10,
        },
      };

      const { speedMultiplier, errorMargin, reactionDelay } =
        difficultySettings[difficulty];

      // Controlar el tiempo de reacción de la IA
      if (Date.now() - lastMoveTime < reactionDelay) {
        return;
      }
      lastMoveTime = Date.now();

      // Predicción de la posición futura de la pelota
      const predictionFactor =
        difficulty === "hard" ? 1.2 : difficulty === "normal" ? 0.9 : 0.75;

      const predictedBallY =
        ball.current.y +
        (ball.current.dy / Math.abs(ball.current.dy)) *
          Math.min(Math.abs(ball.current.dy) * predictionFactor, canvasHeight);

      // Ajustes de las zonas de la pala
      const paddleZones = {
        top: -paddleHeight * 0.35,
        bottom: paddleHeight * 0.35,
      };

      const zonePreference =
        Math.random() < 0.4 ? "top" : Math.random() < 0.8 ? "bottom" : "center";

      const zoneOffset = paddleZones[zonePreference] || 0;

      // Desviación para hacer el movimiento más humano (menos predecible)
      const deviation =
        difficulty === "hard"
          ? Math.random() * 5 - 2.5
          : difficulty === "normal"
          ? Math.random() * 10 - 5
          : Math.random() * 15 - 7.5;

      // Calcular la posición objetivo
      const targetYUnsmoothed =
        predictedBallY -
        paddleHeight / 2 +
        zoneOffset +
        deviation +
        (Math.random() * errorMargin - errorMargin / 2);

      // Movimiento de la IA: aplicar speedMultiplier y actualizar la posición de la pala
      player2Y.current +=
        (targetYUnsmoothed - player2Y.current) * speedMultiplier * 0.01;

      // Limitar el movimiento de la pala dentro de los límites del canvas
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
        <GoalAnimation onAnimationEnd={handleGoalAnimationEnd} />
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
