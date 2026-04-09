"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

// ── Dodecahedron geometry ──────────────────────────────────────────────────
// 20 vertices: (±1,±1,±1), (0,±r,±φ), (±r,±φ,0), (±φ,0,±r)
const PHI = (1 + Math.sqrt(5)) / 2;
const R = 1 / PHI;

const VERTS: [number, number, number][] = [
  [-1,-1,-1], [-1,-1, 1], [-1, 1,-1], [-1, 1, 1],  // 0-3
  [ 1,-1,-1], [ 1,-1, 1], [ 1, 1,-1], [ 1, 1, 1],  // 4-7
  [ 0,-R,-PHI], [ 0,-R, PHI],                        // 8-9
  [ 0, R,-PHI], [ 0, R, PHI],                        // 10-11
  [-R,-PHI, 0], [-R, PHI, 0],                        // 12-13
  [ R,-PHI, 0], [ R, PHI, 0],                        // 14-15
  [-PHI, 0,-R], [-PHI, 0, R],                        // 16-17
  [ PHI, 0,-R], [ PHI, 0, R],                        // 18-19
];

// 12 pentagonal faces — each vertex index list is verified correct (all edges = 1.236 units)
const FACES: number[][] = [
  [0, 8, 4, 14, 12],
  [0, 8, 10, 2, 16],
  [0, 12, 1, 17, 16],
  [8, 4, 18, 6, 10],
  [4, 14, 5, 19, 18],
  [14, 12, 1, 9, 5],
  [10, 2, 13, 15, 6],
  [2, 16, 17, 3, 13],
  [1, 17, 3, 11, 9],
  [18, 6, 15, 7, 19],
  [5, 9, 11, 7, 19],
  [13, 15, 7, 11, 3],
];

// ── Math helpers ───────────────────────────────────────────────────────────
function cross(a: number[], b: number[]): number[] {
  return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
}
function dot(a: number[], b: number[]): number {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}
function norm(v: number[]): number[] {
  const l = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
  return l > 0 ? [v[0]/l, v[1]/l, v[2]/l] : [0,0,1];
}

// Rotate a vertex by Euler angles (intrinsic X→Y→Z)
function rv(p: [number,number,number], rx: number, ry: number, rz: number): number[] {
  let x = p[0], y = p[1], z = p[2];
  let y1 = y*Math.cos(rx) - z*Math.sin(rx);
  let z1 = y*Math.sin(rx) + z*Math.cos(rx);
  y = y1; z = z1;
  let x2 = x*Math.cos(ry) + z*Math.sin(ry);
  let z2 = -x*Math.sin(ry) + z*Math.cos(ry);
  x = x2; z = z2;
  const x3 = x*Math.cos(rz) - y*Math.sin(rz);
  const y3 = x*Math.sin(rz) + y*Math.cos(rz);
  return [x3, y3, z];
}

// ── Component ──────────────────────────────────────────────────────────────
export type DieState = "idle" | "entering" | "rolling" | "land" | "winner" | "loser";

interface D12CanvasProps {
  color: "hope" | "fear";
  value: string;
  dieState: DieState;
  floatDelay?: number;
}

export default function D12Canvas({ color, value, dieState, floatDelay = 0 }: D12CanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rotRef     = useRef({ x: 0.3, y: 0.5, z: 0.1 });
  const velRef     = useRef({ x: 0.002, y: 0.006, z: 0.001 });
  const rafRef     = useRef<number>(0);
  const stateRef   = useRef<DieState>(dieState);
  const rollT0     = useRef(0);
  const valueRef   = useRef(value);   // tracks live value inside the rAF closure
  const controls   = useAnimationControls();

  // Keep valueRef current on every render
  useEffect(() => { valueRef.current = value; }, [value]);

  const isHope = color === "hope";

  // Palette: [r,g,b] arrays for face lerp, strings for glow/num
  const pal = isHope ? {
    dark:    [90, 38, 14],    // lifted so low-lit faces stay visible
    mid:     [148, 65, 28],
    bright:  [210, 100, 52],
    rimR: 220, rimG: 105, rimB: 62,
    num:     "#e8784a",
    glow:    "rgba(213,96,71,0.9)",
    glowS:   "rgba(213,96,71,0.4)",
    shadow:  "rgba(180,60,30,0.5)",
  } : {
    dark:    [45, 28, 72],    // lifted so low-lit faces stay visible
    mid:     [70, 45, 115],
    bright:  [115, 78, 175],
    rimR: 130, rimG: 85, rimB: 200,
    num:     "#b090e0",
    glow:    "rgba(120,70,180,0.9)",
    glowS:   "rgba(80,50,120,0.4)",
    shadow:  "rgba(80,40,140,0.5)",
  };

  // ── Canvas render loop ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const SZ    = canvas.width;          // 240 px internal
    const SCALE = SZ * 0.30;            // radius in px
    const FOV   = 5.0;                  // perspective strength
    const CX    = SZ / 2;
    const CY    = SZ / 2;
    const LIGHT = norm([0.5, -0.7, 1.0]); // light from top-right-front

    function project(v: number[]) {
      const p = FOV / (FOV + v[2] * 0.55);
      return { x: CX + v[0] * SCALE * p, y: CY + v[1] * SCALE * p, z: v[2] };
    }

    function frame() {
      const st  = stateRef.current;
      const rot = rotRef.current;
      const vel = velRef.current;

      // ── Angular velocity per state ──────────────────────────────
      if (st === "idle" || st === "entering") {
        const t = Date.now() * 0.001;
        vel.x = Math.sin(t * 0.27 + floatDelay) * 0.0018;
        vel.y = 0.007;
        vel.z = Math.cos(t * 0.31 + floatDelay) * 0.001;
      } else if (st === "rolling") {
        const elapsed = Math.min((performance.now() - rollT0.current) / 2750, 1);
        // bell-curve speed: peak at 40% of roll, decelerate to halt
        const spd = Math.sin(elapsed * Math.PI) * 0.19 + 0.01;
        vel.x = spd * 0.65;
        vel.y = spd * 1.0;
        vel.z = spd * 0.42;
      } else {
        // land / winner / loser — decelerate to near-stop
        vel.x *= 0.84;
        vel.y *= 0.84;
        vel.z *= 0.84;
      }

      rot.x += vel.x;
      rot.y += vel.y;
      rot.z += vel.z;

      // ── Rotate all 20 vertices ──────────────────────────────────
      const rotV = VERTS.map(v => rv(v, rot.x, rot.y, rot.z));

      // ── Per-face: normal, visibility, depth, brightness ────────
      type FD = {
        face: number[]; pts: number[][]; visible: boolean;
        depth: number; brightness: number; center: number[];
      };

      const fd: FD[] = FACES.map(face => {
        const pts = face.map(i => rotV[i]);
        const e1  = [pts[1][0]-pts[0][0], pts[1][1]-pts[0][1], pts[1][2]-pts[0][2]];
        const e2  = [pts[2][0]-pts[0][0], pts[2][1]-pts[0][1], pts[2][2]-pts[0][2]];
        let n     = norm(cross(e1, e2));
        // Ensure n points outward (same direction as face center)
        const ctr = pts.reduce((s,v)=>[s[0]+v[0],s[1]+v[1],s[2]+v[2]],[0,0,0]).map(x=>x/5);
        if (dot(n, ctr) < 0) n = [-n[0],-n[1],-n[2]];
        return {
          face, pts,
          visible:    n[2] > 0,
          depth:      ctr[2],
          brightness: Math.max(0.48, dot(n, LIGHT)), // high floor — no face ever goes dark
          center:     ctr,
        };
      });

      // Back-to-front painter sort
      const vis = fd.filter(f => f.visible).sort((a,b) => a.depth - b.depth);

      ctx.clearRect(0, 0, SZ, SZ);

      let frontIdx = -1;
      let frontZ   = -Infinity;
      let frontPts: {x:number;y:number}[] = [];

      vis.forEach((f, i) => {
        const pv = f.pts.map(v => project(v));

        // Lerp face color by brightness
        const t  = f.brightness;
        const fr = Math.round(pal.dark[0] + (pal.bright[0]-pal.dark[0])*t);
        const fg = Math.round(pal.dark[1] + (pal.bright[1]-pal.dark[1])*t);
        const fb = Math.round(pal.dark[2] + (pal.bright[2]-pal.dark[2])*t);

        // Draw face fill
        ctx.beginPath();
        ctx.moveTo(pv[0].x, pv[0].y);
        for (let k = 1; k < pv.length; k++) ctx.lineTo(pv[k].x, pv[k].y);
        ctx.closePath();
        ctx.fillStyle = `rgb(${fr},${fg},${fb})`;
        ctx.fill();

        // Bevel edge — slightly lighter, rounded
        ctx.strokeStyle = `rgba(${pal.rimR},${pal.rimG},${pal.rimB},0.55)`;
        ctx.lineWidth   = SZ * 0.013;
        ctx.lineJoin    = "round";
        ctx.stroke();

        // Subtle inner highlight (top-left specular)
        if (f.brightness > 0.5) {
          const alpha = (f.brightness - 0.5) * 0.35;
          ctx.beginPath();
          ctx.moveTo(pv[0].x, pv[0].y);
          for (let k = 1; k < pv.length; k++) ctx.lineTo(pv[k].x, pv[k].y);
          ctx.closePath();
          const gx = pv.reduce((s,v)=>s+v.x,0)/5 - SZ*0.06;
          const gy = pv.reduce((s,v)=>s+v.y,0)/5 - SZ*0.06;
          const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, SZ*0.22);
          grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Track front face for number
        if (f.center[2] > frontZ) {
          frontZ   = f.center[2];
          frontIdx = i;
          frontPts = pv;
        }
      });

      // ── Draw number on frontmost face ───────────────────────────
      if (vis.length > 0 && frontPts.length > 0) {
        const cx = frontPts.reduce((s,v)=>s+v.x,0) / frontPts.length;
        const cy = frontPts.reduce((s,v)=>s+v.y,0) / frontPts.length;
        const fs  = SZ * 0.25;

        ctx.save();
        ctx.font          = `700 ${fs}px "Playfair Display", Georgia, serif`;
        ctx.textAlign     = "center";
        ctx.textBaseline  = "middle";
        ctx.shadowColor   = pal.glow;
        ctx.shadowBlur    = SZ * 0.07;
        ctx.fillStyle     = pal.num;
        ctx.fillText(valueRef.current, cx, cy);
        ctx.shadowBlur = SZ * 0.04;
        ctx.fillText(valueRef.current, cx, cy); // second pass for intensity
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    frame();
    return () => { cancelAnimationFrame(rafRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync stateRef and rollT0 ───────────────────────────────────
  useEffect(() => {
    stateRef.current = dieState;
    if (dieState === "rolling") rollT0.current = performance.now();
  }, [dieState]);

  // ── Framer Motion: position / scale / opacity / glow ──────────
  useEffect(() => {
    if (dieState === "entering") {
      controls.start({
        y: [-220, 18, -6, 0],
        scale: [0.25, 1.12, 0.96, 1],
        opacity: [0, 1, 1, 1],
        filter: [
          "drop-shadow(0 0 0px transparent)",
          `drop-shadow(0 22px 44px ${pal.shadow})`,
          `drop-shadow(0 14px 34px ${pal.shadow})`,
          `drop-shadow(0 12px 28px ${pal.shadow})`,
        ],
        transition: {
          duration: 0.88, times: [0, 0.52, 0.78, 1],
          ease: [0.22,1,0.36,1], delay: floatDelay * 0.15,
        },
      });
    } else if (dieState === "idle") {
      controls.start({
        y:      [0, -10, 0],
        scale:  1,
        opacity:1,
        filter: `drop-shadow(0 12px 28px ${pal.shadow})`,
        transition: {
          y:      { duration: 3.6+floatDelay*0.5, repeat:Infinity, repeatType:"mirror", ease:"easeInOut", delay:floatDelay },
          scale:  { duration: 0.3 },
          filter: { duration: 0.5 },
        },
      });
    } else if (dieState === "rolling") {
      controls.start({
        scale:  [1, 1.28, 1.65, 1.52, 1.32, 1.14, 1.04, 1],
        y:      [0, -28, -65, -50, -32, -16, -5,   0],
        filter: [
          `drop-shadow(0 12px 28px ${pal.shadow})`,
          `drop-shadow(0 24px 58px ${pal.shadow}) drop-shadow(0 0 28px ${pal.glowS})`,
          `drop-shadow(0 30px 72px ${pal.shadow}) drop-shadow(0 0 46px ${pal.glowS})`,
          `drop-shadow(0 26px 62px ${pal.shadow}) drop-shadow(0 0 38px ${pal.glowS})`,
          `drop-shadow(0 20px 48px ${pal.shadow}) drop-shadow(0 0 24px ${pal.glowS})`,
          `drop-shadow(0 15px 36px ${pal.shadow})`,
          `drop-shadow(0 13px 30px ${pal.shadow})`,
          `drop-shadow(0 12px 28px ${pal.shadow})`,
        ],
        transition: {
          duration: 2.75, ease: "easeInOut",
          times: [0, 0.1, 0.26, 0.42, 0.58, 0.72, 0.88, 1],
        },
      });
    } else if (dieState === "land") {
      controls.start({
        scale:  [1.06, 0.93, 1.04, 0.98, 1],
        y:      [0, 9, -4, 2, 0],
        filter: `drop-shadow(0 12px 28px ${pal.shadow})`,
        transition: { duration: 0.5, times:[0,0.28,0.55,0.78,1], ease:"easeOut" },
      });
    } else if (dieState === "winner") {
      controls.start({
        scale: 1.08,
        y: 0,
        filter: [
          `drop-shadow(0 12px 28px ${pal.shadow})`,
          `drop-shadow(0 0 30px ${pal.glow}) drop-shadow(0 0 60px ${pal.glowS}) drop-shadow(0 12px 28px ${pal.shadow})`,
        ],
        transition: {
          scale:  { duration: 0.8, ease:[0.22,1,0.36,1] },
          filter: { duration: 1.3, repeat:Infinity, repeatType:"mirror" },
        },
      });
    } else if (dieState === "loser") {
      controls.start({
        scale: 0.87, opacity: 0.2,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
        transition: { duration: 0.8, ease:[0.22,1,0.36,1] },
      });
    }
  }, [dieState]); // eslint-disable-line react-hooks/exhaustive-deps

  const dispSize = "clamp(120px, 14vw, 155px)";

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0, scale: 0.2, y: -220 }}
      style={{ display: "inline-block", lineHeight: 0 }}
    >
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        style={{ width: dispSize, height: dispSize, display: "block" }}
      />
    </motion.div>
  );
}
