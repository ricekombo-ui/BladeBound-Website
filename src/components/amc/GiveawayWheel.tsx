"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { GiveawayEntry } from "@/types/amc";

const COLORS = ["#d56047", "#69354c", "#6d9eeb", "#ae8c41", "#47ae70", "#9b6deb", "#e07070", "#8cae41"];
const SIZE = 420;
const RADIUS = SIZE / 2;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function GiveawayWheel({
  entries,
  onMarkWon,
}: {
  entries: GiveawayEntry[];
  onMarkWon: (id: string) => Promise<void>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<GiveawayEntry | null>(null);
  const [marking, setMarking] = useState(false);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.translate(RADIUS, RADIUS);
    ctx.rotate(rotationRef.current);

    const n = Math.max(entries.length, 1);
    const slice = (Math.PI * 2) / n;

    entries.forEach((entry, i) => {
      const start = i * slice;
      const end = start + slice;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS - 6, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#07050f";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.rotate(start + slice / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fdf2e1";
      ctx.font = "600 13px Inter, system-ui, sans-serif";
      const label = entry.name.length > 16 ? entry.name.slice(0, 15) + "…" : entry.name;
      ctx.fillText(label, RADIUS - 20, 0);
      ctx.restore();
    });

    ctx.restore();

    // Center hub
    ctx.beginPath();
    ctx.arc(RADIUS, RADIUS, 24, 0, Math.PI * 2);
    ctx.fillStyle = "#0d0a1a";
    ctx.fill();
    ctx.strokeStyle = "#d56047";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [entries]);

  useEffect(() => { draw(); }, [draw]);

  function spin() {
    if (spinning || entries.length === 0) return;
    setWinner(null);
    setSpinning(true);

    const n = entries.length;
    const slice = (Math.PI * 2) / n;
    const winningIndex = Math.floor(Math.random() * n);

    // Pointer is fixed at the top (angle = -90deg / -PI/2 in canvas space).
    // We want the winning slice's center to end up there after rotation.
    const sliceCenter = winningIndex * slice + slice / 2;
    const currentMod = rotationRef.current % (Math.PI * 2);
    const targetWithinRevolution = -Math.PI / 2 - sliceCenter;
    const extraSpins = Math.PI * 2 * (6 + Math.random() * 2); // 6-8 full spins
    const start = rotationRef.current;
    const end = start - currentMod + targetWithinRevolution + extraSpins * -1;

    const duration = 5200;
    const t0 = performance.now();

    function frame(now: number) {
      const elapsed = now - t0;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      rotationRef.current = start + (end - start) * eased;
      draw();
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setSpinning(false);
        setWinner(entries[winningIndex]);
      }
    }
    rafRef.current = requestAnimationFrame(frame);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  async function handleMarkWon() {
    if (!winner) return;
    setMarking(true);
    await onMarkWon(winner.id);
    setMarking(false);
    setWinner(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ display: "block" }} />
        {/* Pointer */}
        <div style={{
          position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "12px solid transparent", borderRight: "12px solid transparent",
          borderTop: "20px solid #fdf2e1",
        }} />
      </div>

      <button
        onClick={spin}
        disabled={spinning || entries.length === 0}
        style={{
          background: "#d56047", border: "none", borderRadius: 8,
          color: "#07050f", fontWeight: 700, fontSize: "0.95rem",
          padding: "0.85rem 2.5rem", cursor: spinning || entries.length === 0 ? "not-allowed" : "pointer",
          opacity: spinning || entries.length === 0 ? 0.5 : 1,
          letterSpacing: "0.05em",
        }}
      >
        {spinning ? "Spinning…" : "Spin the Wheel"}
      </button>

      {winner && (
        <div style={{
          background: "#0d0a1a", border: "1px solid rgba(213,96,71,0.4)", borderRadius: 12,
          padding: "1.5rem", textAlign: "center", minWidth: 300,
          boxShadow: "0 0 40px rgba(213,96,71,0.15)",
        }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            The Wheel Has Spoken
          </p>
          <h3 style={{ color: "#fdf2e1", fontSize: "1.4rem", fontFamily: "Playfair Display, Georgia, serif", margin: "0 0 1rem" }}>
            {winner.name}
          </h3>
          <div style={{ textAlign: "left", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem", lineHeight: 1.8 }}>
            <div>Discord: <span style={{ color: "#fdf2e1" }}>{winner.discord}</span></div>
            {winner.youtube && <div>YouTube: <span style={{ color: "#fdf2e1" }}>{winner.youtube}</span></div>}
            <div>Email: <span style={{ color: "#fdf2e1" }}>{winner.email}</span></div>
            <div>Zip: <span style={{ color: "#fdf2e1" }}>{winner.zip_code}</span></div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button onClick={() => setWinner(null)}
              style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", padding: "0.55rem 1.2rem", cursor: "pointer" }}>
              Respin / Dismiss
            </button>
            <button onClick={handleMarkWon} disabled={marking}
              style={{ background: "#47ae70", border: "none", borderRadius: 6, color: "#07050f", fontWeight: 700, fontSize: "0.78rem", padding: "0.55rem 1.2rem", cursor: "pointer", opacity: marking ? 0.6 : 1 }}>
              {marking ? "Saving…" : "Mark as Won"}
            </button>
          </div>
        </div>
      )}

      {!winner && <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem" }}>{entries.length} in the pool</p>}
    </div>
  );
}
