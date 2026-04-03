"use client";

import { useState, useCallback, useRef, useEffect } from "react";

function d12() {
  return Math.floor(Math.random() * 12) + 1;
}

const copy = {
  hope: { headline: "Hope Rises", sub: "The light finds its edge." },
  fear: { headline: "Fear Takes Hold", sub: "The dark remembers its name." },
};

// ─── Sound Engine ───────────────────────────────────────────────────────────
class SoundEngine {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return this.ctx;
  }

  private master(ctx: AudioContext, vol = 0.5) {
    const g = ctx.createGain();
    g.gain.value = vol;
    g.connect(ctx.destination);
    return g;
  }

  // Crisp click — hover / number tick
  tick(vol = 0.08) {
    try {
      const ctx = this.getCtx();
      const buf = ctx.createBuffer(1, 512, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < 512; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 40);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = "highpass"; f.frequency.value = 2400;
      src.connect(f); f.connect(this.master(ctx, vol));
      src.start();
    } catch {}
  }

  // Button press — authoritative impact
  rollPress() {
    try {
      const ctx = this.getCtx();
      const g = this.master(ctx, 0.55);
      const now = ctx.currentTime;

      // Low thud
      const osc1 = ctx.createOscillator();
      const env1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(30, now + 0.18);
      env1.gain.setValueAtTime(0.8, now);
      env1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(env1); env1.connect(g);
      osc1.start(now); osc1.stop(now + 0.25);

      // Mid crack
      const osc2 = ctx.createOscillator();
      const env2 = ctx.createGain();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(220, now);
      osc2.frequency.exponentialRampToValueAtTime(60, now + 0.1);
      env2.gain.setValueAtTime(0.3, now);
      env2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc2.connect(env2); env2.connect(g);
      osc2.start(now); osc2.stop(now + 0.15);

      // Noise burst
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      const nf = ctx.createBiquadFilter();
      const ne = ctx.createGain();
      noise.buffer = buf; nf.type = "bandpass"; nf.frequency.value = 1200; nf.Q.value = 0.8;
      ne.gain.setValueAtTime(0.4, now); ne.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      noise.connect(nf); nf.connect(ne); ne.connect(g);
      noise.start(now);
    } catch {}
  }

  // Dice tumbling — rhythmic wooden rattles
  diceRattle(duration = 2700) {
    try {
      const ctx = this.getCtx();
      const count = 14;
      const interval = duration / count;
      for (let i = 0; i < count; i++) {
        const t = ctx.currentTime + (i * interval) / 1000;
        const vol = 0.18 * (1 - i / count) + 0.04;

        const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.025), ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.exp(-j / 80);

        const src = ctx.createBufferSource();
        const f = ctx.createBiquadFilter();
        const g = ctx.createGain();
        src.buffer = buf;
        f.type = "bandpass"; f.frequency.value = 600 + Math.random() * 400; f.Q.value = 1.2;
        g.gain.setValueAtTime(vol, t);
        src.connect(f); f.connect(g); g.connect(ctx.destination);
        src.start(t);
      }
    } catch {}
  }

  // Die lands — solid weighted thud with resonance
  dieLand(type: "hope" | "fear") {
    try {
      const ctx = this.getCtx();
      const g = this.master(ctx, 0.6);
      const now = ctx.currentTime;

      const freq = type === "hope" ? 110 : 75;

      // Body impact
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 2, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.08);
      env.gain.setValueAtTime(1.0, now);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(env); env.connect(g);
      osc.start(now); osc.stop(now + 0.4);

      // Resonance tail
      const osc2 = ctx.createOscillator();
      const env2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.value = freq * 3.5;
      env2.gain.setValueAtTime(0.25, now + 0.02);
      env2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(env2); env2.connect(g);
      osc2.start(now + 0.02); osc2.stop(now + 0.55);

      // Crack transient
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.015), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 30);
      const noise = ctx.createBufferSource();
      const nf = ctx.createBiquadFilter();
      const ne = ctx.createGain();
      noise.buffer = buf; nf.type = "highpass"; nf.frequency.value = 3000;
      ne.gain.setValueAtTime(0.5, now);
      noise.connect(nf); nf.connect(ne); ne.connect(g);
      noise.start(now);
    } catch {}
  }

  // Winner reveal — ascending authority tone (Hope: bright chime, Fear: dark toll)
  winnerReveal(type: "hope" | "fear") {
    try {
      const ctx = this.getCtx();
      const g = this.master(ctx, 0.5);
      const now = ctx.currentTime;

      if (type === "hope") {
        // Bright ascending triad — D major feel
        const freqs = [293.66, 369.99, 440, 587.33];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const env = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          const t = now + i * 0.09;
          env.gain.setValueAtTime(0, t);
          env.gain.linearRampToValueAtTime(0.35 - i * 0.04, t + 0.04);
          env.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
          osc.connect(env); env.connect(g);
          osc.start(t); osc.stop(t + 1.3);
        });
        // Shimmer overtone
        const shimmer = ctx.createOscillator();
        const senv = ctx.createGain();
        shimmer.type = "sine"; shimmer.frequency.value = 1174.66;
        senv.gain.setValueAtTime(0.08, now + 0.2);
        senv.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        shimmer.connect(senv); senv.connect(g);
        shimmer.start(now + 0.2); shimmer.stop(now + 1.5);
      } else {
        // Dark descending toll — minor feel
        const freqs = [220, 174.61, 146.83, 110];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const env = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          const t = now + i * 0.12;
          env.gain.setValueAtTime(0, t);
          env.gain.linearRampToValueAtTime(0.4 - i * 0.05, t + 0.06);
          env.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
          osc.connect(env); env.connect(g);
          osc.start(t); osc.stop(t + 2.0);
        });
        // Low rumble sub
        const sub = ctx.createOscillator();
        const senv = ctx.createGain();
        sub.type = "sine"; sub.frequency.value = 55;
        senv.gain.setValueAtTime(0.3, now + 0.3);
        senv.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        sub.connect(senv); senv.connect(g);
        sub.start(now + 0.3); sub.stop(now + 2.2);
      }
    } catch {}
  }

  // Page transition whoosh — cinematic sweep
  transition() {
    try {
      const ctx = this.getCtx();
      const g = this.master(ctx, 0.35);
      const now = ctx.currentTime;

      const buf = ctx.createBuffer(1, ctx.sampleRate * 1.2, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

      const src = ctx.createBufferSource();
      src.buffer = buf;

      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.setValueAtTime(200, now);
      f.frequency.exponentialRampToValueAtTime(3000, now + 0.6);
      f.frequency.exponentialRampToValueAtTime(8000, now + 1.0);
      f.Q.value = 1.5;

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.8, now + 0.3);
      env.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      src.connect(f); f.connect(env); env.connect(g);
      src.start(now); src.stop(now + 1.2);
    } catch {}
  }
}

const sound = typeof window !== "undefined" ? new SoundEngine() : null;

// ─── Component ──────────────────────────────────────────────────────────────
export default function DualityLanding() {
  const [phase, setPhase] = useState<"idle" | "rolling" | "settling" | "result" | "exit" | "done">("idle");
  const [hopeVal, setHopeVal] = useState("?");
  const [fearVal, setFearVal] = useState("?");
  const [dominant, setDominant] = useState<"hope" | "fear" | null>(null);
  const [dieHopeState, setDieHopeState] = useState<"idle" | "rolling" | "land" | "winner" | "loser">("idle");
  const [dieFearState, setDieFearState] = useState<"idle" | "rolling" | "land" | "winner" | "loser">("idle");
  const [showScores, setShowScores] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [diceFadeOut, setDiceFadeOut] = useState(false);
  const lastTickTime = useRef(0);

  const hopeDieRef = useRef<HTMLDivElement>(null);
  const fearDieRef = useRef<HTMLDivElement>(null);

  const handleTilt = useCallback((e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (phase !== "idle" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    ref.current.style.transform = `perspective(400px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;
  }, [phase]);

  const handleTiltLeave = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  const cycleNumbers = useCallback((
    setVal: (v: string) => void,
    finalVal: number,
    totalMs: number,
    onDone?: () => void
  ) => {
    const start = performance.now();
    function tick() {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / totalMs, 1);
      if (progress >= 1) { setVal(String(finalVal)); onDone?.(); return; }
      setVal(String(d12()));
      // Tick sound — throttled to avoid audio spam
      const now = performance.now();
      if (now - lastTickTime.current > 80) {
        sound?.tick(0.04 + (1 - progress) * 0.04);
        lastTickTime.current = now;
      }
      setTimeout(tick, 40 + progress * progress * 260);
    }
    tick();
  }, []);

  const performRoll = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("rolling");
    sound?.rollPress();

    let hVal = d12();
    let fVal = d12();
    while (hVal === fVal) fVal = d12();
    const dom = hVal > fVal ? "hope" : "fear";
    const ROLL = 2700;

    setDieHopeState("rolling");
    setDieFearState("rolling");
    sound?.diceRattle(ROLL);

    // Hope lands slightly earlier
    cycleNumbers(setHopeVal, hVal, ROLL - 100, () => {
      setDieHopeState("land");
      sound?.dieLand("hope");
      // Smooth: land → settle → winner/loser
      setTimeout(() => setDieHopeState(dom === "hope" ? "winner" : "loser"), 500);
    });

    cycleNumbers(setFearVal, fVal, ROLL - 50, () => {
      setDieFearState("land");
      sound?.dieLand("fear");
      setTimeout(() => setDieFearState(dom === "fear" ? "winner" : "loser"), 500);
    });

    setTimeout(() => {
      setPhase("settling");
      setDominant(dom);
      setShowScores(true);

      // Winner sound after both dice have settled
      setTimeout(() => sound?.winnerReveal(dom), 700);

      // Dice gently dissolve
      setTimeout(() => setDiceFadeOut(true), 1400);

      // Result fades in after dice are gone
      setTimeout(() => { setShowResult(true); setPhase("result"); }, 2100);

      // Hold result for 5s then offer transition
      setTimeout(() => {
        sound?.transition();
        setPhase("exit");
        setTimeout(() => setPhase("done"), 1600);
      }, 7200);
    }, ROLL + 200);
  }, [phase, cycleNumbers]);

  const skip = useCallback(() => {
    if (phase === "exit" || phase === "done") return;
    sound?.transition();
    setPhase("exit");
    setTimeout(() => setPhase("done"), 1600);
  }, [phase]);

  if (phase === "done") return null;

  // Derive class names
  const hopeClass = [
    dieHopeState === "rolling" ? "dl-rolling-hope" : "",
    dieHopeState === "land" ? "dl-land" : "",
    dieHopeState === "winner" ? "dl-winner-hope" : "",
    dieHopeState === "loser" ? "dl-loser" : "",
  ].filter(Boolean).join(" ");

  const fearClass = [
    dieFearState === "rolling" ? "dl-rolling-fear" : "",
    dieFearState === "land" ? "dl-land" : "",
    dieFearState === "winner" ? "dl-winner-fear" : "",
    dieFearState === "loser" ? "dl-loser" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <div className={`dl-wrap ${phase === "exit" ? "dl-exit" : ""}`}>
        <div className="dl-bg" />

        <div className="dl-inner">
          {/* Wordmark */}
          <div className="dl-wordmark-row">
            <img src="/logo.png" alt="BladeBound" className="dl-logo" />
            <h1 className="dl-wordmark">BladeBound</h1>
          </div>
          <div className="dl-rule" />
          <p className="dl-subtitle">The Duality Awaits</p>

          {/* Dice stage */}
          <div className="dl-dice-stage">
            <div className={`dl-dice-arena ${diceFadeOut ? "dl-dice-fade" : ""}`}>
              {/* Hope */}
              <div className="dl-die-col">
                <div
                  ref={hopeDieRef}
                  className={`dl-die dl-die-hope ${hopeClass}`}
                  onMouseMove={(e) => handleTilt(e, hopeDieRef)}
                  onMouseLeave={() => handleTiltLeave(hopeDieRef)}
                  onMouseEnter={() => phase === "idle" && sound?.tick(0.06)}
                >
                  <div className="dl-die-rim dl-rim-hope" />
                  <div className="dl-die-face dl-face-hope">
                    <span className="dl-die-num dl-num-hope">{hopeVal}</span>
                  </div>
                </div>
                <span className="dl-die-label dl-lbl-hope">Hope</span>
              </div>

              {/* VS */}
              <div className="dl-vs">
                <div className="dl-vs-line" />
                <span className="dl-vs-text">vs</span>
                <div className="dl-vs-line" />
              </div>

              {/* Fear */}
              <div className="dl-die-col">
                <div
                  ref={fearDieRef}
                  className={`dl-die dl-die-fear ${fearClass}`}
                  onMouseMove={(e) => handleTilt(e, fearDieRef)}
                  onMouseLeave={() => handleTiltLeave(fearDieRef)}
                  onMouseEnter={() => phase === "idle" && sound?.tick(0.06)}
                >
                  <div className="dl-die-rim dl-rim-fear" />
                  <div className="dl-die-face dl-face-fear">
                    <span className="dl-die-num dl-num-fear">{fearVal}</span>
                  </div>
                </div>
                <span className="dl-die-label dl-lbl-fear">Fear</span>
              </div>
            </div>

            {/* Score tally */}
            {showScores && !diceFadeOut && (
              <div className="dl-scores">
                <span className="dl-score"><span className="dl-dot dl-dot-hope" />Hope <strong>{hopeVal}</strong></span>
                <span className="dl-score"><span className="dl-dot dl-dot-fear" />Fear <strong>{fearVal}</strong></span>
              </div>
            )}

            {/* Result */}
            {showResult && dominant && (
              <div className="dl-result">
                <p className="dl-result-eye">The verdict is cast</p>
                <h2 className={`dl-result-hl dl-hl-${dominant}`}>{copy[dominant].headline}</h2>
                <p className="dl-result-sub">{copy[dominant].sub}</p>
                <button
                  className="dl-result-enter"
                  onClick={skip}
                  onMouseEnter={() => sound?.tick(0.08)}
                >
                  Enter BladeBound →
                </button>
              </div>
            )}
          </div>

          {/* Roll CTA */}
          {phase === "idle" && (
            <button className="dl-btn-roll" onClick={performRoll}>
              Roll Duality
            </button>
          )}
        </div>

        {phase === "idle" && (
          <button className="dl-skip" onClick={skip} onMouseEnter={() => sound?.tick(0.05)}>
            Enter BladeBound
          </button>
        )}
      </div>

      <style jsx global>{`
        .dl-wrap {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          opacity: 1;
          transition: opacity 1.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .dl-exit { opacity: 0; pointer-events: none; }

        .dl-bg {
          position: absolute; inset: 0; background: #070416;
        }
        .dl-bg::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 65% at 50% 50%,
            rgba(68,56,89,0.35) 0%, rgba(7,4,22,0.9) 65%, #070416 100%);
        }
        .dl-bg::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 50% 40% at 50% 48%,
            rgba(105,53,76,0.15) 0%, transparent 60%);
        }

        .dl-inner {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center;
        }

        .dl-wordmark-row {
          display: flex; align-items: center; gap: 1rem;
          opacity: 0;
          animation: dl-up 0.9s 0.2s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .dl-logo {
          width: 44px; height: 44px; border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 0 16px rgba(213,96,71,0.15);
        }
        .dl-wordmark {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 600; letter-spacing: 0.25em;
          color: #fdf2e1; text-transform: uppercase;
        }
        .dl-rule {
          width: 240px; height: 1px;
          background: linear-gradient(90deg, transparent, #d56047 40%, #ae4641 60%, transparent);
          margin: 1rem 0 0.7rem; opacity: 0;
          animation: dl-fade 0.9s 0.6s ease-out forwards;
        }
        .dl-subtitle {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.65rem; letter-spacing: 0.4em;
          text-transform: uppercase; color: rgba(253,242,225,0.35);
          margin-bottom: 3.5rem; opacity: 0;
          animation: dl-up 0.9s 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        /* Dice stage */
        .dl-dice-stage {
          position: relative; display: flex; flex-direction: column;
          align-items: center; min-height: 240px; margin-bottom: 3rem;
          opacity: 0; animation: dl-up 0.9s 1s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .dl-dice-arena {
          display: flex; align-items: center;
          gap: clamp(2rem, 5vw, 4.5rem);
          transition: opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1);
        }
        .dl-dice-fade { opacity: 0; transform: scale(0.88) translateY(-8px); pointer-events: none; }

        .dl-die-col { display: flex; flex-direction: column; align-items: center; gap: 1rem; }

        /* Die shape */
        .dl-die {
          position: relative;
          width: clamp(100px, 13vw, 140px); height: clamp(100px, 13vw, 140px);
          will-change: transform; cursor: default;
          /* Smooth transition for winner/loser state changes */
          transition: filter 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .dl-die-rim {
          position: absolute; inset: 0;
          clip-path: polygon(50% 0%,75% 6.7%,93.3% 25%,100% 50%,93.3% 75%,75% 93.3%,50% 100%,25% 93.3%,6.7% 75%,0% 50%,6.7% 25%,25% 6.7%);
          transform: scale(1.04); transform-origin: center;
        }
        .dl-die-face {
          position: absolute; inset: 0;
          clip-path: polygon(50% 0%,75% 6.7%,93.3% 25%,100% 50%,93.3% 75%,75% 93.3%,50% 100%,25% 93.3%,6.7% 75%,0% 50%,6.7% 25%,25% 6.7%);
          display: flex; align-items: center; justify-content: center;
        }
        .dl-die-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 600; line-height: 1;
          user-select: none; position: relative; z-index: 1;
        }

        /* Hope colors */
        .dl-rim-hope { background: linear-gradient(140deg,#d56047 0%,#8B3A20 40%,#3A1810 55%,#ae4641 80%,#d56047 100%); }
        .dl-face-hope { background: linear-gradient(150deg,#1a0c06 0%,#0e0804 55%,#070402 100%); box-shadow: inset 0 2px 4px rgba(213,96,71,0.15), inset 0 -2px 4px rgba(0,0,0,0.6); }
        .dl-num-hope { color: #d56047; text-shadow: 0 0 14px rgba(213,96,71,0.6),0 0 30px rgba(213,96,71,0.2),0 2px 4px rgba(0,0,0,0.9); }
        .dl-lbl-hope { color: rgba(213,96,71,0.5); }

        /* Fear colors */
        .dl-rim-fear { background: linear-gradient(140deg,#69354c 0%,#3A1830 40%,#150A18 55%,#443859 80%,#69354c 100%); }
        .dl-face-fear { background: linear-gradient(150deg,#100818 0%,#080610 55%,#040408 100%); box-shadow: inset 0 2px 4px rgba(105,53,76,0.2), inset 0 -2px 4px rgba(0,0,0,0.7); }
        .dl-num-fear { color: #9B7DB8; text-shadow: 0 0 14px rgba(105,53,76,0.7),0 0 30px rgba(68,56,89,0.3),0 2px 4px rgba(0,0,0,0.9); }
        .dl-lbl-fear { color: rgba(105,53,76,0.6); }

        .dl-die-label {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
          transition: color 0.8s ease-out;
        }

        /* Winner / loser — CSS transitions, not sudden jumps */
        .dl-die-hope.dl-winner-hope {
          filter: drop-shadow(0 0 18px rgba(213,96,71,0.85)) drop-shadow(0 0 40px rgba(213,96,71,0.3));
          transform: scale(1.04);
        }
        .dl-die-fear.dl-winner-fear {
          filter: drop-shadow(0 0 18px rgba(105,53,76,0.9)) drop-shadow(0 0 40px rgba(68,56,89,0.35));
          transform: scale(1.04);
        }
        .dl-loser { opacity: 0.22 !important; transform: scale(0.91) !important; filter: none; }

        /* VS divider */
        .dl-vs { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0.25; }
        .dl-vs-line { width: 1px; height: 40px; background: linear-gradient(to bottom,transparent,#fdf2e1,transparent); }
        .dl-vs-text { font-family: 'Inter', system-ui, sans-serif; font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; color: #79717b; }

        /* Scores */
        .dl-scores {
          display: flex; gap: 2rem; margin-top: 1.2rem;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #79717b;
          animation: dl-fade 0.6s ease-out forwards;
        }
        .dl-score { display: flex; align-items: center; gap: 0.5rem; }
        .dl-score strong { color: #fdf2e1; font-weight: 500; font-size: 0.85rem; }
        .dl-dot { width: 6px; height: 6px; border-radius: 50%; }
        .dl-dot-hope { background: #d56047; }
        .dl-dot-fear { background: #69354c; }

        /* Result */
        .dl-result {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          text-align: center; width: max-content;
          animation: dl-result-in 1.2s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .dl-result-eye {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.6rem; letter-spacing: 0.4em; text-transform: uppercase;
          color: rgba(253,242,225,0.3); margin-bottom: 0.6rem;
        }
        .dl-result-hl {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700;
          line-height: 1; letter-spacing: 0.05em; margin-bottom: 0.6rem;
        }
        .dl-hl-hope { color: #d56047; text-shadow: 0 0 24px rgba(213,96,71,0.5),0 0 60px rgba(213,96,71,0.15); }
        .dl-hl-fear { color: #9B7DB8; text-shadow: 0 0 24px rgba(105,53,76,0.6),0 0 60px rgba(68,56,89,0.25); }
        .dl-result-sub {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.85rem;
          font-style: italic; color: rgba(253,242,225,0.45); margin-bottom: 2rem;
        }
        .dl-result-enter {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #d56047; background: transparent;
          border: 1px solid rgba(213,96,71,0.3);
          padding: 0.7rem 2.2rem; cursor: pointer;
          transition: border-color 200ms, background 200ms, transform 100ms;
        }
        .dl-result-enter:hover { border-color: rgba(213,96,71,0.7); background: rgba(213,96,71,0.08); }
        .dl-result-enter:active { transform: scale(0.97); }

        /* Roll button */
        .dl-btn-roll {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: #fdf2e1; background: transparent;
          border: 1px solid rgba(213,96,71,0.35);
          padding: 1rem 3.5rem; cursor: pointer;
          position: relative; overflow: hidden; outline: none;
          transition: border-color 200ms, letter-spacing 200ms, transform 100ms;
          opacity: 0;
          animation: dl-up 0.9s 1.2s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .dl-btn-roll::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(213,96,71,0.1),rgba(174,70,65,0.07));
          opacity: 0; transition: opacity 200ms;
        }
        .dl-btn-roll::after {
          content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 0; height: 1px;
          background: linear-gradient(90deg,#d56047,#ae4641);
          transition: width 250ms;
        }
        .dl-btn-roll:hover { border-color: rgba(213,96,71,0.8); letter-spacing: 0.36em; }
        .dl-btn-roll:hover::before { opacity: 1; }
        .dl-btn-roll:hover::after { width: 70%; }
        .dl-btn-roll:active { transform: scale(0.97); }

        /* Skip */
        .dl-skip {
          position: fixed; bottom: 2rem; right: 2.5rem; z-index: 500;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(253,242,225,0.3); background: transparent;
          border: 1px solid rgba(253,242,225,0.1);
          padding: 0.6rem 1.4rem; cursor: pointer; outline: none;
          transition: color 200ms, border-color 200ms;
          opacity: 0; animation: dl-fade 1s 1.8s ease-out forwards;
        }
        .dl-skip:hover { color: rgba(253,242,225,0.7); border-color: rgba(253,242,225,0.3); }

        /* Roll animations */
        @keyframes dl-rollHope {
          0%   { transform: perspective(500px) rotateX(0) rotateY(0) scale(1); }
          12%  { transform: perspective(500px) rotateX(-28deg) rotateY(22deg) scale(0.88) translateY(-14px); }
          26%  { transform: perspective(500px) rotateX(42deg) rotateY(-36deg) scale(0.84) translateY(-18px); }
          40%  { transform: perspective(500px) rotateX(-35deg) rotateY(28deg) scale(0.87) translateY(-12px); }
          55%  { transform: perspective(500px) rotateX(20deg) rotateY(-44deg) scale(0.90) translateY(-8px); }
          68%  { transform: perspective(500px) rotateX(-14deg) rotateY(18deg) scale(0.94) translateY(-4px); }
          80%  { transform: perspective(500px) rotateX(8deg) rotateY(-8deg) scale(0.97) translateY(-2px); }
          90%  { transform: perspective(500px) rotateX(-3deg) rotateY(3deg) scale(1.02) translateY(1px); }
          100% { transform: perspective(500px) rotateX(0) rotateY(0) scale(1) translateY(0); }
        }
        @keyframes dl-rollFear {
          0%   { transform: perspective(500px) rotateX(0) rotateY(0) scale(1); }
          12%  { transform: perspective(500px) rotateX(24deg) rotateY(-20deg) scale(0.89) translateY(-16px); }
          26%  { transform: perspective(500px) rotateX(-44deg) rotateY(32deg) scale(0.83) translateY(-20px); }
          40%  { transform: perspective(500px) rotateX(32deg) rotateY(-48deg) scale(0.86) translateY(-14px); }
          55%  { transform: perspective(500px) rotateX(-22deg) rotateY(38deg) scale(0.91) translateY(-8px); }
          68%  { transform: perspective(500px) rotateX(14deg) rotateY(-16deg) scale(0.95) translateY(-4px); }
          80%  { transform: perspective(500px) rotateX(-6deg) rotateY(7deg) scale(0.98) translateY(-1px); }
          90%  { transform: perspective(500px) rotateX(3deg) rotateY(-3deg) scale(1.025) translateY(2px); }
          100% { transform: perspective(500px) rotateX(0) rotateY(0) scale(1) translateY(0); }
        }
        @keyframes dl-landBounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.06); }
          55%  { transform: scale(0.975); }
          75%  { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        .dl-rolling-hope { animation: dl-rollHope 2.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .dl-rolling-fear { animation: dl-rollFear 2.8s cubic-bezier(0.16,1,0.3,1) forwards; }
        .dl-land { animation: dl-landBounce 0.45s ease-out forwards; }

        /* Shared keyframes */
        @keyframes dl-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dl-fade {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes dl-result-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.3ms !important; }
        }
        @media (max-width: 640px) {
          .dl-die { width: 96px !important; height: 96px !important; }
          .dl-die-num { font-size: 1.7rem !important; }
          .dl-skip { bottom: 1.4rem; right: 1.4rem; }
        }
      `}</style>
    </>
  );
}
