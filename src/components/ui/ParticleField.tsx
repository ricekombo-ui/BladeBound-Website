"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  life: number;     // -1 = ambient (infinite), 0-1 = burst particle decaying
  isBurst: boolean;
}

declare global {
  interface Window {
    emberBurst?: (x: number, y: number, count?: number) => void;
  }
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function createAmbientParticle(): Particle {
      return {
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.01 + 0.005,
        life: -1,
        isBurst: false,
      };
    }

    function createBurstParticle(x: number, y: number): Particle {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1.5;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2, // bias upward
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.4,
        pulse: 0,
        pulseSpeed: 0,
        life: 1,
        isBurst: true,
      };
    }

    function emberBurst(x: number, y: number, count = 25) {
      for (let i = 0; i < count; i++) {
        particles.push(createBurstParticle(x, y));
      }
    }

    // Expose globally for other components
    window.emberBurst = emberBurst;

    function init() {
      resize();
      const count = Math.floor((canvas!.width * canvas!.height) / 25000);
      particles = Array.from({ length: Math.min(count, 60) }, () => createAmbientParticle());
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Process particles in reverse so we can splice burst particles that are done
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (p.isBurst) {
          // Burst particles: decay life, apply gravity, fade
          p.life -= 0.012;
          p.vy += 0.04; // gravity
          p.vx *= 0.99; // drag

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          p.x += p.vx;
          p.y += p.vy;

          const alpha = p.opacity * p.life;
          // Burst particles glow brighter with a warm gradient
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(213, 96, 71, ${alpha})`;
          ctx!.fill();

          // Glow halo for burst particles
          if (p.size > 1.5) {
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, p.size * p.life * 2.5, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(213, 96, 71, ${alpha * 0.15})`;
            ctx!.fill();
          }
        } else {
          // Ambient particles: original behavior
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += p.pulseSpeed;

          if (p.x < 0) p.x = canvas!.width;
          if (p.x > canvas!.width) p.x = 0;
          if (p.y < 0) p.y = canvas!.height;
          if (p.y > canvas!.height) p.y = 0;

          const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(213, 96, 71, ${alpha})`;
          ctx!.fill();
        }
      }

      // Draw faint connections (ambient only)
      const ambient = particles.filter(p => !p.isBurst);
      for (let i = 0; i < ambient.length; i++) {
        for (let j = i + 1; j < ambient.length; j++) {
          const dx = ambient[i].x - ambient[j].x;
          const dy = ambient[i].y - ambient[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx!.beginPath();
            ctx!.moveTo(ambient[i].x, ambient[i].y);
            ctx!.lineTo(ambient[j].x, ambient[j].y);
            ctx!.strokeStyle = `rgba(213, 96, 71, ${0.03 * (1 - dist / 150)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      delete window.emberBurst;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
