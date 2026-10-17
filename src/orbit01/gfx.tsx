// Gráficos animados propios de Orbit Dossier (todo dibujado por código, nada de texto horneado en imágenes).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, random } from "remotion";
import { interpolate } from "./lib";
import { C, COND, MONO, SANS, clamp, ease, easeOut, sf } from "./lib";

type G = { dur: number; m: number[]; g: any };
const fi = (f: number, a: number, b = a + 18) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: easeOut });

export const Stars: React.FC<{ drift?: number; n?: number }> = ({ drift = 0.15, n = 260 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #0b1626 0%, ${C.bg} 70%)` }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: n }).map((_, i) => {
          const x = (random("x" + i) * 1920 + f * drift * (0.3 + random("z" + i))) % 1920;
          const y = random("y" + i) * 1080;
          const r = 0.5 + random("r" + i) * 1.6;
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (20 + random("t" + i) * 40) + i));
          return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={tw * (0.35 + random("o" + i) * 0.6)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Head: React.FC<{ k: string; t: string; o?: number }> = ({ k, t, o = 1 }) => (
  <div style={{ position: "absolute", left: 96, top: 80, opacity: o }}>
    <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "0.3em", color: C.amber }}>{k}</div>
    <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 64, color: C.ink, letterSpacing: "0.02em", marginTop: 6 }}>{t}</div>
  </div>
);

const Disk: React.FC<{ src: string; x: number; y: number; d: number; o?: number; pos?: string; scale?: number }> = ({ src, x, y, d, o = 1, pos = "50% 50%", scale = 1 }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", overflow: "hidden", opacity: o,
    boxShadow: "0 0 60px rgba(111,214,255,0.12)" }}>
    <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${scale})` }} />
  </div>
);

// ── 1. Lecturas del magnetómetro y del plasma: el pico del 16-dic-1997 ──
export const Spike: React.FC<G> = ({ dur, m, g }) => {
  const f = useCurrentFrame();
  const W = 1500, X0 = 210;
  const prog = interpolate(f, [0, Math.min(dur - 20, 150)], [0, 1], { ...clamp, easing: (t) => t });
  const trace = (seed: string, base: number, amp: number, spikeAt: number, spikeH: number, startF: number) => {
    const pts: string[] = [];
    const N = 300;
    const p2 = interpolate(f, [startF, startF + 120], [0, 1], clamp);
    for (let i = 0; i <= N * p2; i++) {
      const u = i / N;
      const noise = (random(seed + i) - 0.5) * amp + Math.sin(u * 30 + seed.length) * amp * 0.3;
      const sp = Math.exp(-Math.pow((u - spikeAt) / 0.018, 2)) * spikeH;
      pts.push(`${X0 + u * W},${base - noise - sp}`);
    }
    return pts.join(" ");
  };
  const flag = g.mode === 2;
  const lab = fi(f, 90);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Stars drift={0.05} n={120} />
      <Head k={flag ? "REANALYZED · 2018" : "GALILEO · FLYBY E12 · 16 DEC 1997"} t={flag ? "THE SAME FEW SECONDS" : "INSTRUMENT READINGS"} />
      {[0, 1].map((r) => (
        <div key={r} style={{ position: "absolute", left: X0, top: 300 + r * 330, width: W, height: 260, borderTop: "1px solid rgba(234,241,248,0.15)", borderBottom: "1px solid rgba(234,241,248,0.15)" }}>
          <div style={{ position: "absolute", left: 0, top: -40, fontFamily: MONO, fontSize: 22, letterSpacing: "0.15em", color: r ? C.amber : C.cyan }}>
            {r ? "CHARGED PARTICLE DENSITY" : "MAGNETIC FIELD"}
          </div>
        </div>
      ))}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <polyline points={trace("mag", 430, 26, 0.55, 130, 0)} fill="none" stroke={C.cyan} strokeWidth={3} style={{ filter: `drop-shadow(0 0 6px ${C.cyan})` }} />
        <polyline points={trace("pla", 800, 18, 0.55, 170, m[1] ?? 40)} fill="none" stroke={C.amber} strokeWidth={3} style={{ filter: `drop-shadow(0 0 6px ${C.amber})` }} />
        <line x1={X0 + 0.55 * W} x2={X0 + 0.55 * W} y1={270} y2={940} stroke="rgba(255,255,255,0.4)" strokeDasharray="8 8" opacity={lab} />
      </svg>
      <div style={{ position: "absolute", left: X0 + 0.55 * W + 20, top: 950, opacity: lab, fontFamily: MONO, fontSize: 24, color: C.ink, letterSpacing: "0.1em" }}>
        {flag ? "→ A PLUME OF WATER" : "CLOSEST APPROACH · ~200 KM"}
      </div>
    </AbsoluteFill>
  );
};

// ── 2. Tamaño: la Luna contra Europa ──
export const Size: React.FC<G> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 22), b = fi(f, 10, 34);
  const dm = 560, de = dm * (3122 / 3474);
  return (
    <AbsoluteFill>
      <Stars />
      <Disk src="img/n_GSFC_20171208_Archive_e000868.jpg" x={600} y={500} d={dm * a} scale={1.08} />
      <Disk src="img/n_PIA00016.jpg" x={1320} y={500 + (dm - de) / 2} d={de * b} scale={2.1} />
      {[[600, "OUR MOON", "3,474 KM"], [1320, "EUROPA", "3,122 KM"]].map(([x, t, k], i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) - 250, width: 500, top: 830, textAlign: "center", opacity: i ? b : a }}>
          <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 64, color: C.ink }}>{t}</div>
          <div style={{ fontFamily: MONO, fontSize: 28, color: C.cyan, letterSpacing: "0.12em" }}>{k}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ── 3. El agua: todos los océanos de la Tierra contra el de Europa (esferas de igual volumen) ──
export const Water: React.FC<G> = () => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 24), b = fi(f, 26, 56);
  const r1 = 170, r2 = r1 * Math.cbrt(2);
  const ball = (x: number, r: number, o: number) => (
    <div style={{ position: "absolute", left: x - r * o, top: 470 - r * o, width: 2 * r * o, height: 2 * r * o, borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #9fe3ff 0%, #2a8fd6 35%, #0b3e78 75%, #062448 100%)", boxShadow: "0 0 80px rgba(80,180,255,0.35)" }} />
  );
  return (
    <AbsoluteFill>
      <Stars />
      <Head k="LIQUID WATER" t="EARTH'S OCEANS VS. EUROPA'S OCEAN" o={a} />
      {ball(560, r1, a)}
      {ball(1340, r2, b)}
      <div style={{ position: "absolute", left: 310, width: 500, top: 780, textAlign: "center", opacity: a }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 58, color: C.ink }}>ALL OF EARTH'S OCEANS</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, letterSpacing: "0.1em" }}>≈1.3 BILLION KM³</div>
      </div>
      <div style={{ position: "absolute", left: 1090, width: 500, top: 780, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 58, color: C.cyan }}>EUROPA</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, letterSpacing: "0.1em" }}>ABOUT TWICE AS MUCH</div>
      </div>
      <div style={{ position: "absolute", left: 1340 - 90, top: 400, width: 180, textAlign: "center", fontFamily: COND, fontWeight: 800, fontSize: 120, color: "#fff",
        opacity: fi(f, 50, 70), textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>2×</div>
    </AbsoluteFill>
  );
};

// ── 4. Se abre el expediente ──
export const Dossier: React.FC<G> = ({ dur }) => {
  const f = useCurrentFrame();
  const open = fi(f, 4, 30);
  const st = interpolate(f, [26, 34], [2.2, 1], { ...clamp, easing: easeOut });
  const so = fi(f, 26, 30);
  return (
    <AbsoluteFill>
      <Stars />
      <div style={{ position: "absolute", left: 460, top: 170, width: 1000, height: 720, background: "#d9cfb6", transform: `perspective(1600px) rotateX(${(1 - open) * 50}deg) rotate(-1.5deg)`,
        boxShadow: "0 40px 120px rgba(0,0,0,0.8)", borderRadius: 6, padding: 60, boxSizing: "border-box" }}>
        <div style={{ fontFamily: MONO, fontSize: 26, color: "#5a4d33", letterSpacing: "0.25em" }}>ORBIT DOSSIER · CASE FILE</div>
        <div style={{ height: 2, background: "#5a4d33", opacity: 0.4, margin: "18px 0 40px" }} />
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 150, color: "#1c1a14", lineHeight: 1 }}>FILE 01</div>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 90, color: "#1c1a14", lineHeight: 1.05 }}>EUROPA · MOON OF JUPITER</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: "#5a4d33", marginTop: 40, letterSpacing: "0.12em", lineHeight: 1.6 }}>
          SUBJECT: A HIDDEN GLOBAL OCEAN<br />EVIDENCE: MAGNETIC · TELESCOPIC · SPACECRAFT
        </div>
        <div style={{ position: "absolute", right: 70, bottom: 70, transform: `rotate(-12deg) scale(${st})`, opacity: so, border: `6px solid ${C.red}`,
          color: C.red, fontFamily: COND, fontWeight: 800, fontSize: 80, padding: "4px 26px", letterSpacing: "0.08em" }}>OPEN</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 5. Marca + suscripción ──
export const Brand: React.FC<G> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 24), b = fi(f, 30, 50);
  const ring = (f / 30) * 40;
  return (
    <AbsoluteFill>
      <Stars drift={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ellipse cx={960} cy={430} rx={330} ry={95} fill="none" stroke={C.cyan} strokeWidth={2.5} opacity={0.7 * a} transform={`rotate(-14 960 430)`} strokeDasharray="1400" strokeDashoffset={1400 * (1 - a)} />
        <circle cx={960 + 330 * Math.cos((ring * Math.PI) / 180)} cy={430 + 95 * Math.sin((ring * Math.PI) / 180)} r={10} fill={C.amber} opacity={a} transform={`rotate(-14 960 430)`} />
        <circle cx={960} cy={430} r={70 * a} fill="url(#pl)" />
        <defs><radialGradient id="pl" cx="35%" cy="30%"><stop offset="0%" stopColor="#fff3d6" /><stop offset="60%" stopColor="#c99a62" /><stop offset="100%" stopColor="#5a3b1f" /></radialGradient></defs>
      </svg>
      <div style={{ position: "absolute", top: 590, width: "100%", textAlign: "center", opacity: a }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 130, color: C.ink, letterSpacing: "0.12em", marginRight: "-0.12em" }}>ORBIT DOSSIER</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, letterSpacing: "0.3em", marginTop: 6 }}>THE STRANGEST PLACES IN OUR SOLAR SYSTEM</div>
      </div>
      <div style={{ position: "absolute", top: 860, width: "100%", display: "flex", justifyContent: "center", opacity: b, transform: `scale(${0.9 + 0.1 * b})` }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: "#fff", background: "#cc1f1f", padding: "16px 46px", borderRadius: 8, letterSpacing: "0.06em" }}>SUBSCRIBE</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 6. El campo de Júpiter barre Europa ──
export const Magneto: React.FC<G> = ({ dur, m }) => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 24);
  const eu = fi(f, m[1] ?? 60);
  const ang = (f / 30) * 0.5;
  const ex = 960 + 560 * Math.cos(ang), ey = 540 + 170 * Math.sin(ang);
  const lines = [1, 1.5, 2.1, 2.8, 3.6];
  return (
    <AbsoluteFill>
      <Stars />
      <Head k="JUPITER'S MAGNETOSPHERE" t="THE STRONGEST MAGNETIC FIELD OF ANY PLANET" o={a} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {lines.flatMap((k, i) => [1, -1].map((s) => (
          <path key={i + "" + s} d={`M 960 ${540 - 150} C ${960 + s * 210 * k} ${540 - 260 * k}, ${960 + s * 260 * k} ${540 + 260 * k}, 960 ${540 + 150}`}
            fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.55 * a} strokeDasharray="10 14" strokeDashoffset={-f * 1.4} />
        )))}
        <ellipse cx={960} cy={540} rx={560} ry={170} fill="none" stroke="rgba(234,241,248,0.25)" strokeDasharray="4 10" opacity={eu} />
      </svg>
      <Disk src="img/n_PIA26077.jpg" x={960} y={540} d={300 * a} scale={1.25} />
      <div style={{ position: "absolute", left: ex - 20, top: ey - 20, width: 40, height: 40, borderRadius: 99, background: "radial-gradient(circle at 35% 30%, #fff8ea, #c8a77d)", opacity: eu,
        boxShadow: `0 0 20px ${C.amber}` }} />
      <div style={{ position: "absolute", left: ex + 30, top: ey - 18, fontFamily: MONO, fontSize: 24, color: C.amber, opacity: eu, letterSpacing: "0.12em" }}>EUROPA</div>
    </AbsoluteFill>
  );
};

// ── 7. El campo inducido que se da vuelta ──
export const Flip: React.FC<G> = ({ dur, m }) => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 20);
  const T = 100;
  const ph = Math.sin((f / T) * Math.PI * 2);
  const dir = ph >= 0 ? 1 : -1;
  const cond = fi(f, m[3] ?? 200);
  const W = 1300, X0 = 310;
  const wave = (yb: number, amp: number, col: string, lag: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) { const u = i / 200; const t = f - (1 - u) * 160; pts.push(`${X0 + u * W},${yb - amp * Math.sin(((t - lag) / T) * Math.PI * 2)}`); }
    return <polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth={3} />;
  };
  return (
    <AbsoluteFill>
      <Stars drift={0.05} />
      <Head k="GALILEO MAGNETOMETER · 1996-2000" t="EUROPA ANSWERS BACK" o={a} />
      <Disk src="img/n_PIA25334.jpg" x={960} y={430} d={300 * a} scale={1.3} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[-1, 1].map((s) => (
          <path key={s} d={`M 960 ${270} C ${960 + s * 330} ${170}, ${960 + s * 330} ${690}, 960 ${590}`} fill="none" stroke={C.amber} strokeWidth={3}
            opacity={0.85 * a * Math.abs(ph)} />
        ))}
        <g opacity={a} transform={`translate(960 430) rotate(${dir > 0 ? 0 : 180})`}>
          <line x1={0} y1={210} x2={0} y2={-200} stroke={C.amber} strokeWidth={6} />
          <polygon points="-22,-190 22,-190 0,-232" fill={C.amber} />
        </g>
        <g opacity={fi(f, m[1] ?? 60)}>{wave(800, 50, C.cyan, 0)}</g>
        <g opacity={fi(f, m[2] ?? 120)}>{wave(940, 40, C.amber, 0)}</g>
      </svg>
      <div style={{ position: "absolute", left: X0, top: 720, fontFamily: MONO, fontSize: 22, color: C.cyan, letterSpacing: "0.12em", opacity: fi(f, m[1] ?? 60) }}>JUPITER'S FIELD, AS EUROPA FEELS IT</div>
      <div style={{ position: "absolute", left: X0, top: 868, fontFamily: MONO, fontSize: 22, color: C.amber, letterSpacing: "0.12em", opacity: fi(f, m[2] ?? 120) }}>EUROPA'S INDUCED FIELD · FLIPS EVERY TIME</div>
      <div style={{ position: "absolute", right: 110, top: 360, textAlign: "right", opacity: cond }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 70, color: C.ink }}>SOMETHING BELOW</div>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 70, color: C.cyan }}>CONDUCTS ELECTRICITY</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 8. El paper de 2000 ──
export const Paper: React.FC<G> = () => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 26);
  const hl = fi(f, 40, 70);
  return (
    <AbsoluteFill>
      <Stars />
      <div style={{ position: "absolute", left: 360, top: 150, width: 1200, height: 780, background: "#f4f1ea", transform: `translateY(${(1 - a) * 80}px) rotate(1deg)`, opacity: a,
        boxShadow: "0 40px 120px rgba(0,0,0,0.75)", padding: "70px 90px", boxSizing: "border-box", color: "#141414" }}>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "0.2em", color: "#8a1f11" }}>SCIENCE · VOL. 289 · 25 AUGUST 2000</div>
        <div style={{ height: 2, background: "#141414", opacity: 0.25, margin: "20px 0 44px" }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, lineHeight: 1.12 }}>
          Galileo Magnetometer Measurements:{" "}
          <span style={{ background: `linear-gradient(90deg, rgba(255,178,62,0.7) ${hl * 100}%, transparent ${hl * 100}%)` }}>A Stronger Case for a Subsurface Ocean at Europa</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 30, marginTop: 44, color: "#444" }}>M. G. Kivelson, K. K. Khurana, C. T. Russell, M. Volwerk, R. J. Walker, C. Zimmer</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 9. Corte de profundidad: hielo, océano, y la Fosa de las Marianas ×10 ──
export const Depth: React.FC<G> = ({ dur, m, g }) => {
  const f = useCurrentFrame();
  const ph2 = g.phase === 2;
  const TOP = 190, PX = 7; // 1 km = 7 px (hielo 20 km, océano 100 km) → hasta ~1030
  const ice = ph2 ? 1 : fi(f, 0, 24);
  const oc = ph2 ? 1 : fi(f, m[1] ?? 120, (m[1] ?? 120) + 30);
  const earth = ph2 ? 1 : fi(f, m[2] ?? 230);
  const deep = ph2 ? 1 : fi(f, m[3] ?? 280);
  const n = ph2 ? Math.min(10, Math.floor(interpolate(f, [8, Math.min(dur - 20, 140)], [0, 10.99], clamp))) : 0;
  const colX = 860, colW = 520;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Head k="CROSS-SECTION · TO SCALE" t={ph2 ? "TEN CHALLENGER DEEPS" : "HOW DEEP IT GOES"} />
      <div style={{ position: "absolute", left: colX, top: TOP, width: colW, height: 20 * PX * ice, background: "linear-gradient(180deg,#f6f2e8,#cfdde6)" }} />
      <div style={{ position: "absolute", left: colX, top: TOP + 20 * PX, width: colW, height: 100 * PX * oc, background: "linear-gradient(180deg,#1468a8,#06223f)" }} />
      <div style={{ position: "absolute", left: colX, top: TOP + 120 * PX, width: colW, height: 40, background: "#3b2c22", opacity: oc }} />
      <div style={{ position: "absolute", left: colX + colW + 30, top: TOP + 40, opacity: ice }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 54, color: C.ice }}>ICE SHELL</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>15–25 KM</div>
      </div>
      <div style={{ position: "absolute", left: colX + colW + 30, top: TOP + 20 * PX + 230, opacity: oc }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 54, color: C.cyan }}>LIQUID OCEAN</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>60–150 KM DEEP</div>
      </div>
      <div style={{ position: "absolute", left: colX + colW + 30, top: TOP + 120 * PX - 6, opacity: oc, fontFamily: MONO, fontSize: 24, color: "#c9a27c" }}>ROCKY SEAFLOOR</div>
      {/* columna de la Tierra: 11 km */}
      <div style={{ position: "absolute", left: 380, top: TOP, width: 260, height: 11 * PX * earth, background: "linear-gradient(180deg,#2a8fd6,#0b3e78)", opacity: earth }} />
      <div style={{ position: "absolute", left: 300, width: 420, top: TOP + 11 * PX + 20, textAlign: "center", opacity: earth }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 50, color: C.ink }}>EARTH'S DEEPEST POINT</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: deep ? C.amber : C.dim, opacity: Math.max(0.4, deep) }}>CHALLENGER DEEP · 11 KM</div>
      </div>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: colX + 20, top: TOP + 20 * PX + i * 11 * PX, width: 150, height: 11 * PX - 4, border: `2px solid ${C.amber}`,
          background: "rgba(255,178,62,0.12)", boxSizing: "border-box" }} />
      ))}
      {ph2 && <div style={{ position: "absolute", left: colX + 200, top: TOP + 20 * PX + 330, fontFamily: COND, fontWeight: 800, fontSize: 140, color: C.amber,
        textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>×{n}</div>}
    </AbsoluteFill>
  );
};

// ── 10. Resonancia 1:2:4 ──
export const Reso: React.FC<G> = ({ dur, m }) => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 24);
  const lab = fi(f, m[2] ?? 150);
  const ecc = interpolate(f, [m[3] ?? 330, (m[3] ?? 330) + 40], [0, 1], clamp);
  const base = (f / 30) * 0.9;
  const moons = [
    { n: "IO", r: 210, k: 4, c: "#e8c65a", s: 22 },
    { n: "EUROPA", r: 330, k: 2, c: "#f3e6cf", s: 20 },
    { n: "GANYMEDE", r: 470, k: 1, c: "#a99d8c", s: 28 },
  ];
  return (
    <AbsoluteFill>
      <Stars drift={0.05} />
      <Head k="ORBITAL RESONANCE" t="A RHYTHM OF THREE MOONS" o={a} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {moons.map((o, i) => {
          const ex = o.n === "EUROPA" ? 1 + 0.12 * ecc : 1;
          return <ellipse key={i} cx={1000} cy={570} rx={o.r * ex} ry={o.r * 0.42 / ex} fill="none" stroke={o.n === "EUROPA" ? C.cyan : "rgba(234,241,248,0.25)"} strokeWidth={o.n === "EUROPA" ? 2.5 : 1.5} opacity={a} />;
        })}
      </svg>
      <Disk src="img/n_PIA26077.jpg" x={1000} y={570} d={150 * a} scale={1.25} />
      {moons.map((o, i) => {
        const ex = o.n === "EUROPA" ? 1 + 0.12 * ecc : 1;
        const t = base * o.k * 0.5;
        const x = 1000 + o.r * ex * Math.cos(t), y = 570 + (o.r * 0.42 / ex) * Math.sin(t);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - o.s, top: y - o.s, width: o.s * 2, height: o.s * 2, borderRadius: 99, background: `radial-gradient(circle at 35% 30%, #fff, ${o.c})`, opacity: a }} />
            <div style={{ position: "absolute", left: x + o.s + 8, top: y - 16, fontFamily: MONO, fontSize: 22, color: o.n === "EUROPA" ? C.cyan : C.dim, opacity: a }}>{o.n}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 96, top: 330, opacity: lab }}>
        {[["GANYMEDE", "1 ORBIT"], ["EUROPA", "2 ORBITS"], ["IO", "4 ORBITS"]].map(([n, k], i) => (
          <div key={i} style={{ display: "flex", gap: 20, alignItems: "baseline", marginBottom: 14, opacity: fi(f, (m[2] ?? 150) + i * 12) }}>
            <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 60, color: n === "EUROPA" ? C.cyan : C.ink, width: 300 }}>{n}</div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: C.amber }}>{k}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 96, top: 230, fontFamily: MONO, fontSize: 28, color: C.amber, letterSpacing: "0.12em", opacity: fi(f, m[1] ?? 20) * (1 - lab) }}>EUROPA: ONE ORBIT EVERY 3.55 DAYS</div>
      <div style={{ position: "absolute", left: 96, bottom: 110, fontFamily: COND, fontWeight: 800, fontSize: 56, color: C.ink, opacity: ecc }}>A SLIGHTLY STRETCHED, OVAL ORBIT</div>
    </AbsoluteFill>
  );
};

// ── 11. Lista que se tilda (receta / lo que necesita la vida) ──
const Rows: React.FC<{ rows: [string, string, number][]; head: [string, string]; foot?: [string, number] }> = ({ rows, head, foot }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stars drift={0.05} />
      <Head k={head[0]} t={head[1]} o={fi(f, 0)} />
      {rows.map(([t, mk, at], i) => {
        const o = fi(f, at);
        const col = mk === "✓" ? "#57e389" : mk === "?" ? C.amber : C.ink;
        return (
          <div key={i} style={{ position: "absolute", left: 300, top: 320 + i * 170, display: "flex", alignItems: "center", gap: 40, opacity: o, transform: `translateX(${(1 - o) * -60}px)` }}>
            <div style={{ width: 110, height: 110, border: `4px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: COND, fontWeight: 800, fontSize: 90, color: col }}>
              {mk && f > at + 10 ? mk : ""}
            </div>
            <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 100, color: C.ink, letterSpacing: "0.02em" }}>{t}</div>
          </div>
        );
      })}
      {foot && <div style={{ position: "absolute", right: 140, bottom: 120, fontFamily: COND, fontWeight: 800, fontSize: 110, color: C.cyan, opacity: fi(f, foot[1]) }}>{foot[0]}</div>}
    </AbsoluteFill>
  );
};
export const Recipe: React.FC<G> = ({ m }) => (
  <Rows head={["WHAT EUROPA HAS", "THE INGREDIENTS"]} rows={[["SALT WATER", "✓", 0], ["CARBON", "✓", m[1] ?? 50], ["A ROCKY SEAFLOOR", "?", m[2] ?? 80]]} foot={["= A RECIPE", m[4] ?? 200]} />
);
export const Check: React.FC<G> = ({ m, g }) =>
  g.mode === 1 ? (
    <Rows head={["WHAT LIFE NEEDS", "NOT A SUN"]} rows={[["WATER", "", m[1] ?? 20], ["THE RIGHT CHEMICALS", "", m[2] ?? 45], ["A SOURCE OF ENERGY", "", m[3] ?? 75]]} />
  ) : (
    <Rows head={["EUROPA CLIPPER WILL MEASURE", "IS EUROPA HABITABLE?"]} rows={[["WATER", "✓", m[1] ?? 20], ["CHEMISTRY", "?", m[2] ?? 45], ["ENERGY", "?", m[3] ?? 75]]} />
  );

// ── 12. Palabra sola ──
export const Word: React.FC<G> = ({ dur, g }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.0, 1.08], clamp);
  const o = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0.6], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Stars drift={0.05} n={140} />
      <div style={{ textAlign: "center", opacity: o, transform: `scale(${s})` }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 260, color: C.ink, letterSpacing: "0.08em", marginRight: "-0.08em" }}>{g.text}</div>
        {g.sub && <div style={{ fontFamily: MONO, fontSize: 30, color: C.cyan, letterSpacing: "0.3em", marginTop: 10, opacity: fi(f, 20) }}>{g.sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ── 13. La radiación parte el hielo ──
export const Split: React.FC<G> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [20, 70], [0, 1], { ...clamp, easing: ease });
  const atom = (x: number, y: number, r: number, col: string, t: string) => (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: 99, background: `radial-gradient(circle at 35% 30%, #fff, ${col})`,
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: COND, fontWeight: 800, fontSize: r * 0.9, color: "#0b1626" }}>{t}</div>
  );
  return (
    <AbsoluteFill>
      <Stars drift={0.05} />
      <Head k="RADIOLYSIS" t="RADIATION SPLITS THE ICE" o={fi(f, 0)} />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = 200 + random("rx" + i) * 1500, y0 = -100 - random("ry" + i) * 400;
        const y = y0 + ((f * 18 + i * 90) % 1300);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3, height: 90, background: `linear-gradient(180deg, transparent, ${C.amber})`, opacity: 0.55 }} />;
      })}
      {atom(960, 560, 90, C.red, "O")}
      {atom(960 - 120 - p * 380, 560 + 70 - p * 120, 56, "#9fd8ff", "H")}
      {atom(960 + 120 + p * 380, 560 + 70 - p * 120, 56, "#9fd8ff", "H")}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: COND, fontWeight: 800, fontSize: 90, color: C.ink, opacity: fi(f, 60) }}>
        H₂O → <span style={{ color: "#9fd8ff" }}>HYDROGEN</span> + <span style={{ color: C.red }}>OXYGEN</span>
      </div>
    </AbsoluteFill>
  );
};

// ── 14. El presupuesto de energía ──
export const Budget: React.FC<G> = ({ dur, m }) => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 24);
  const down = fi(f, m[1] ?? 70), up = fi(f, 20);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 230, background: "linear-gradient(180deg,#f6f2e8,#b9cfdc)", opacity: a }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, bottom: 140, background: "linear-gradient(180deg,#0f5a96,#041a33)", opacity: a }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, background: "#2c211a", opacity: a }} />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 260 + i * 180;
        const y = 240 + ((f * 3 + i * 47) % 500);
        return <div key={i} style={{ position: "absolute", left: x, top: y, fontFamily: COND, fontWeight: 800, fontSize: 44, color: "#bfe9ff", opacity: down * (1 - (y - 240) / 520) }}>O₂</div>;
      })}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 360 + i * 200;
        const y = 920 - ((f * 2.4 + i * 61) % 460);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14, height: 14, borderRadius: 99, background: C.amber, boxShadow: `0 0 18px ${C.amber}`, opacity: up * ((920 - y) / 460 < 0.9 ? 1 : 0.3) }} />;
      })}
      {[520, 980, 1420].map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x - 30, bottom: 140, width: 60, height: 120 + i * 30, background: "linear-gradient(0deg,#3a2a20,#6b4a32)", clipPath: "polygon(30% 0,70% 0,100% 100%,0 100%)", opacity: a }} />
      ))}
      <div style={{ position: "absolute", left: 80, top: 90, fontFamily: COND, fontWeight: 800, fontSize: 56, color: "#1c2a36", opacity: down }}>OXYGEN TRICKLING DOWN</div>
      <div style={{ position: "absolute", right: 80, bottom: 170, fontFamily: COND, fontWeight: 800, fontSize: 56, color: C.amber, opacity: up }}>CHEMICAL ENERGY FROM BELOW</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: COND, fontWeight: 800, fontSize: 100, color: C.ink, opacity: fi(f, m[2] ?? 200),
        textShadow: "0 6px 40px rgba(0,0,0,0.8)" }}>A REAL ENERGY BUDGET</div>
    </AbsoluteFill>
  );
};

// ── 15. Cierre: el próximo expediente ──
export const End: React.FC<G> = ({ dur, m }) => {
  const f = useCurrentFrame();
  const a = fi(f, 0, 24), b = fi(f, m[1] ?? 120);
  return (
    <AbsoluteFill>
      <Stars />
      <Disk src="img/n_GSFC_20171208_Archive_e000868.jpg" x={1460} y={520} d={620 * a} scale={1.08} pos="50% 50%" />
      <div style={{ position: "absolute", left: 110, top: 300, width: 900, opacity: a }}>
        <div style={{ fontFamily: MONO, fontSize: 28, color: C.amber, letterSpacing: "0.3em" }}>NEXT FILE · 02</div>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 96, color: C.ink, lineHeight: 1.02, marginTop: 20 }}>THE CRATER ON THE MOON EVERY SPACE AGENCY IS RACING TO REACH</div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 760, display: "flex", gap: 30, alignItems: "center", opacity: b }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: "#fff", background: "#cc1f1f", padding: "16px 46px", borderRadius: 8, letterSpacing: "0.06em" }}>SUBSCRIBE</div>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 52, color: C.dim, letterSpacing: "0.1em" }}>ORBIT DOSSIER</div>
      </div>
    </AbsoluteFill>
  );
};

export const GFX: Record<string, React.FC<G>> = {
  spike: Spike, size: Size, water: Water, dossier: Dossier, brand: Brand, magneto: Magneto, flip: Flip, paper: Paper, depth: Depth,
  reso: Reso, recipe: Recipe, check: Check, word: Word, split: Split, budget: Budget, end: End,
};
