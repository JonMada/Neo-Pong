import React, { useState, useEffect } from "react";

// Función para convertir HSL a Hexadecimal
const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

// Función para convertir Hexadecimal a HSL
const hexToHSL = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Sin saturación
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
};

const ColorSlider = ({ color, setColor, playerName }) => {
  // Extraemos el valor hue desde el color hexadecimal
  const { h } = hexToHSL(color);
  const [hue, setHue] = useState(h);

  useEffect(() => {
    // Asegurarse de que el valor inicial se sincronice correctamente
    setHue(h);
  }, [color]); // Cuando el color cambia, actualiza el valor del hue

  const handleChange = (e) => {
    const hueValue = e.target.value;
    setHue(hueValue); // Actualizamos el valor del hue

    // Convertir HSL a hexadecimal
    const hexColor = hslToHex(hueValue, 100, 50);
    setColor(hexColor); // Actualizamos el color en hexadecimal
  };

  return (
    <div className="color-slider-container">
      <input
        type="range"
        id={`colorSlider-${playerName}`}
        min="0"
        max="360"
        value={hue} // Ahora `value` se controla mediante el estado `hue`
        onChange={handleChange}
        className="slider"
        style={{
          background: `linear-gradient(to right, 
            hsl(0, 100%, 50%), 
            hsl(45, 100%, 50%), 
            hsl(90, 100%, 50%), 
            hsl(135, 100%, 50%), 
            hsl(180, 100%, 50%), 
            hsl(225, 100%, 50%), 
            hsl(270, 100%, 50%), 
            hsl(315, 100%, 50%), 
            hsl(360, 100%, 50%))`,
        }}
      />
      <div
        className="selected-color-preview"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};

export default ColorSlider;
