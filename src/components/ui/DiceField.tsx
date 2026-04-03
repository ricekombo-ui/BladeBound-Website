"use client";

import { useEffect, useRef } from "react";

interface Die {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  driftX: number;
  driftY: number;
  opacity: number;
  type: "hope" | "fear";
}

function drawD12(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  type: "hope" | "fear",
  opacity: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;

  // D12 — regular pentagon-based shape
  const sides = 12;
  const outerRadius = size;
  const innerRadius = size * 0.75;

  // Draw outer shape (dodecagon)
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    const px = Math.cos(angle) * outerRadius;
    const py = Math.sin(angle) * outerRadius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  // Fill with theme color
  if (type === "hope") {
    ctx.fillStyle = "rgba(213, 96, 71, 0.08)";
    ctx.strokeStyle = "rgba(213, 96, 71, 0.15)";
  } else {
    ctx.fillStyle = "rgba(105, 53, 76, 0.08)";
    ctx.strokeStyle = "rgba(105, 53, 76, 0.15)";
  }
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  // Inner facet lines
  ctx.beginPath();
  for (let i = 0; i < sides; i += 2) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    const ox = Math.cos(angle) * outerRadius;
    const oy = Math.sin(angle) * outerRadius;
    const ix = Math.cos(angle + Math.PI / sides) * innerRadius * 0.5;
    const iy = Math.sin(angle + Math.PI / sides) * innerRadius * 0.5;
    ctx.moveTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  if (type === "hope") {
    ctx.strokeStyle = "rgba(213, 96, 71, 0.08)";
  } else {
    ctx.strokeStyle = "rgba(105, 53, 76, 0.08)";
  }
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Center label
  ctx.font = `${size * 0.35}px 'Playfair Display', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (type === "hope") {
    ctx.fillStyle = `rgba(213, 96, 71, ${opacity * 0.6})`;
    ctx.fillText("H", 0, 0);
  } else {
    ctx.fillStyle = `rgba(105, 53, 76, ${opacity * 0.6})`;
    ctx.fillText("F", 0, 0);
  }

  ctx.restore();
}

export default function DiceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const diceRef = useRef<Die[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create dice — scattered pairs
    const count = Math.min(8, Math.floor(window.innerWidth / 200));
    const dice: Die[] = [];
    for (let i = 0; i < count; i++) {
      const type = i % 2 === 0 ? "hope" : "fear";
      dice.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 30 + Math.random() * 40,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.003,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.1,
        opacity: 0.15 + Math.random() * 0.2,
        type,
      });
    }
    diceRef.current = dice;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const die of diceRef.current) {
        die.x += die.driftX;
        die.y += die.driftY;
        die.rotation += die.rotationSpeed;

        // Wrap around
        if (die.x < -die.size * 2) die.x = canvas.width + die.size;
        if (die.x > canvas.width + die.size * 2) die.x = -die.size;
        if (die.y < -die.size * 2) die.y = canvas.height + die.size;
        if (die.y > canvas.height + die.size * 2) die.y = -die.size;

        drawD12(ctx, die.x, die.y, die.size, die.rotation, die.type, die.opacity);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
