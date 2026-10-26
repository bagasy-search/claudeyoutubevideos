import React from "react";

// SETS ILUSTRADOS CON LUZ (vuelta 8 OJO) — pieza reutilizable para toda la ola Soot (sólo React, sin imágenes).
// La receta del molde: cielo en 4 tonos saturados (índigo → violeta → magenta → naranja), un astro con halo grande,
// capas de silueta que se aclaran con la distancia (bruma entre capas), follaje en bultos con borde de luz,
// ventanas y faroles que BRILLAN (halo en modo screen), piso con perspectiva y reflejo, y paralaje por capa.
// Uso: <SetPuerto t={t} dx={deriva} /> llena 1920x1080; poner los personajes encima.

const rnd = (s: number) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

export type Hora = "dia" | "tarde" | "atardecer" | "noche";
export const CIELO: Record<Hora, [string, string, string, string]> = {
  dia: ["#2a6fd6", "#4f9ff0", "#8fd0f8", "#e6f6ff"],
  tarde: ["#3a4fc8", "#7a6ad8", "#f09ab8", "#ffd49a"],
  atardecer: ["#241552", "#5a2a8a", "#d2508a", "#ffa65a"],
  noche: ["#0c0a2a", "#1e1a52", "#3a2f7a", "#6a4a9a"],
};
// tono de las siluetas por capa (lejos → cerca) y del borde de luz
const CAPAS: Record<Hora, { s: [string, string, string]; rim: string; win: string }> = {
  dia: { s: ["#6aa8d8", "#3a7a8a", "#1e4a52"], rim: "#c8f0a0", win: "#fff2b0" },
  tarde: { s: ["#8a72c8", "#5a3f9a", "#33205e"], rim: "#ffb0a0", win: "#ffd27a" },
  atardecer: { s: ["#7a3f9a", "#4a2370", "#2a1248"], rim: "#ff8aa0", win: "#ffc85a" },
  noche: { s: ["#3a3478", "#26205a", "#140f36"], rim: "#8a7ae0", win: "#ffc45a" },
};

export const Glow: React.FC<{ x: number; y: number; r: number; col?: string; op?: number }> = ({ x, y, r, col = "#ffd27a", op = 0.7 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${col} 0%, ${col}88 22%, ${col}00 70%)`, opacity: op, mixBlendMode: "screen", pointerEvents: "none" }} />
);

export const Cielo: React.FC<{ hora: Hora; hasta?: number }> = ({ hora, hasta = 760 }) => {
  const [a, b, c, d] = CIELO[hora];
  return <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${a} 0px, ${b} ${hasta * 0.38}px, ${c} ${hasta * 0.78}px, ${d} ${hasta}px, ${d} 1080px)` }} />;
};

export const Astro: React.FC<{ x: number; y: number; r?: number; hora: Hora }> = ({ x, y, r = 80, hora }) => {
  const luna = hora === "noche" || hora === "atardecer";
  const col = luna ? "#fff4d8" : "#fff6c0";
  return (
    <>
      <Glow x={x} y={y} r={r * 5} col={luna ? "#c8a8ff" : "#ffe08a"} op={0.55} />
      <Glow x={x} y={y} r={r * 2.2} col={col} op={0.8} />
      <svg style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible" }} width={r * 2} height={r * 2}>
        <circle cx={r} cy={r} r={r} fill={col} />
        {luna && <circle cx={r * 1.45} cy={r * 0.7} r={r * 0.9} fill={CIELO[hora][1]} opacity={0.0} />}
        {luna && [[0.6, 0.7, 0.14], [1.3, 1.2, 0.1], [0.9, 1.4, 0.08]].map(([a, b, c], i) => <circle key={i} cx={r * a} cy={r * b} r={r * c} fill="#e8d8b8" />)}
      </svg>
    </>
  );
};

export const Estrellas: React.FC<{ t: number; n?: number; alto?: number; seed?: number }> = ({ t, n = 60, alto = 520, seed = 5 }) => {
  const r = rnd(seed);
  return <>{Array.from({ length: n }, (_, i) => { const x = r() * 1920, y = r() * alto, s = 2 + r() * 4, f = r() * 6; return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, background: "#fff", opacity: 0.35 + 0.6 * Math.abs(Math.sin(t * 1.2 + f)), boxShadow: `0 0 ${s * 3}px #fff` }} />; })}</>;
};

// bultos de follaje / colinas: silueta de círculos superpuestos + borde de luz arriba
export const Bultos: React.FC<{ y: number; col: string; rim?: string; seed?: number; r?: number; dx?: number; alto?: number }> = ({ y, col, rim, seed = 3, r: R = 110, dx = 0, alto = 1080 }) => {
  const r = rnd(seed);
  const cs: [number, number, number][] = [];
  for (let x = -300; x < 2300; x += R * (0.7 + r() * 0.5)) cs.push([x, y + (r() - 0.5) * R * 0.9, R * (0.7 + r() * 0.6)]);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${dx}px)`, overflow: "visible" }} width={1920} height={alto}>
      {rim && cs.map(([x, yy, rr], i) => <circle key={`r${i}`} cx={x} cy={yy - 7} r={rr} fill={rim} opacity={0.75} />)}
      {cs.map(([x, yy, rr], i) => <circle key={i} cx={x} cy={yy} r={rr} fill={col} />)}
      <rect x={-300} y={y} width={2600} height={alto - y + 400} fill={col} />
    </svg>
  );
};

export const Bruma: React.FC<{ y: number; col: string; h?: number; op?: number }> = ({ y, col, h = 260, op = 0.55 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y - h, height: h * 1.6, background: `linear-gradient(180deg, ${col}00, ${col} 55%, ${col}00)`, opacity: op, pointerEvents: "none" }} />
);

// silueta de pueblo con ventanas que brillan (halo) — las ventanas parpadean de a una, lento
export const Pueblo: React.FC<{ t: number; y: number; col: string; win: string; seed?: number; s?: number; dx?: number; torre?: boolean }> = ({ t, y, col, win, seed = 7, s = 1, dx = 0, torre = true }) => {
  const r = rnd(seed);
  const casas: { x: number; w: number; h: number; techo: number }[] = [];
  for (let x = -120; x < 2100; ) { const w = (130 + r() * 120) * s; casas.push({ x, w, h: (140 + r() * 160) * s, techo: (40 + r() * 60) * s }); x += w + 8 * s; }
  const vent: [number, number, number][] = [];
  casas.forEach((c, i) => { const n = 1 + Math.floor(r() * 3); for (let k = 0; k < n; k++) vent.push([c.x + c.w * (0.2 + 0.6 * (k + 0.5) / n), y - c.h * (0.35 + r() * 0.35), i * 3 + k]); });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx}px)` }}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        {torre && <path d={`M ${1240} ${y} L ${1240} ${y - 360 * s} L ${1275} ${y - 470 * s} L ${1310} ${y - 360 * s} L ${1310} ${y} Z`} fill={col} />}
        {casas.map((c, i) => <path key={i} d={`M ${c.x} ${y} L ${c.x} ${y - c.h} L ${c.x + c.w / 2} ${y - c.h - c.techo} L ${c.x + c.w} ${y - c.h} L ${c.x + c.w} ${y} Z`} fill={col} />)}
        {casas.filter((_, i) => i % 3 === 1).map((c, i) => <rect key={`ch${i}`} x={c.x + c.w * 0.7} y={y - c.h - c.techo * 0.9} width={18 * s} height={50 * s} fill={col} />)}
      </svg>
      {vent.map(([x, yy, k]) => {
        const on = 0.75 + 0.25 * Math.sin(t * 0.7 + k * 1.9);
        return (
          <React.Fragment key={k}>
            <Glow x={x} y={yy} r={46 * s} col={win} op={0.55 * on} />
            <div style={{ position: "absolute", left: x - 11 * s, top: yy - 15 * s, width: 22 * s, height: 30 * s, background: win, borderRadius: 3, opacity: on, boxShadow: `0 0 ${12 * s}px ${win}` }} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

// agua con brillo del astro (columna de reflejo) y olas que corren
export const AguaLuz: React.FC<{ t: number; y: number; hora: Hora; xLuz?: number; c?: [string, string] }> = ({ t, y, hora, xLuz = 1500, c }) => {
  const [a, b] = c ?? (hora === "dia" ? ["#1f86c8", "#0b3a7a"] : hora === "tarde" ? ["#5a5ab8", "#1e2a6a"] : hora === "atardecer" ? ["#6a3a8a", "#1a1040"] : ["#24306a", "#080a24"]);
  const brillo = hora === "dia" ? "#e8fbff" : hora === "noche" ? "#d8c8ff" : "#ffc890";
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
      <div style={{ position: "absolute", left: xLuz - 220, width: 440, top: y, bottom: 0, background: `linear-gradient(180deg, ${brillo}cc, ${brillo}00 80%)`, mixBlendMode: "screen", opacity: 0.5, filter: "blur(18px)" }} />
      <svg style={{ position: "absolute", left: 0, top: y - 8, overflow: "visible" }} width={1920} height={1080 - y}>
        {[0, 1, 2, 3, 4].map((f) =>
          Array.from({ length: 10 }, (_, i) => {
            const x = ((i * 250 + f * 117 - t * (24 + f * 16)) % 2500 + 2500) % 2500 - 300;
            const yy = 10 + f * f * 22;
            const cerca = Math.abs(x + 90 - xLuz) < 260;
            return <path key={`${f}-${i}`} d={`M ${x} ${yy} q 45 -10 90 0 q 45 10 90 0`} stroke={cerca ? brillo : "rgba(255,255,255,.35)"} strokeWidth={3 + f * 1.6} fill="none" strokeLinecap="round" opacity={cerca ? 0.9 : 0.6} />;
          }),
        )}
      </svg>
    </>
  );
};

// piso de tablas en perspectiva (muelle / cubierta / camarote) con luz que cae
export const PisoTablas: React.FC<{ y: number; c1?: string; c2?: string; linea?: string; xLuz?: number; luz?: string }> = ({ y, c1 = "#8a5a3a", c2 = "#4a2a1c", linea = "#3a1e12", xLuz = 960, luz = "#ffb070" }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${c1}, ${c2})` }} />
    <svg style={{ position: "absolute", left: 0, top: y, overflow: "visible" }} width={1920} height={1080 - y}>
      {Array.from({ length: 22 }, (_, i) => { const xb = -1400 + i * 220; return <line key={i} x1={960 + (xb - 960) * 0.35} y1={0} x2={xb} y2={1080 - y} stroke={linea} strokeWidth={4} opacity={0.6} />; })}
      {[0.18, 0.42, 0.72].map((k, i) => <line key={`h${i}`} x1={0} y1={(1080 - y) * k} x2={1920} y2={(1080 - y) * k} stroke={linea} strokeWidth={3} opacity={0.35} />)}
    </svg>
    <div style={{ position: "absolute", left: xLuz - 700, width: 1400, top: y - 40, height: 1120 - y, background: `radial-gradient(ellipse 50% 40% at 50% 30%, ${luz}66, ${luz}00 70%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
  </>
);

export const Farolito: React.FC<{ x: number; y: number; t: number; s?: number; col?: string; poste?: number }> = ({ x, y, t, s = 1, col = "#ffc45a", poste = 260 }) => {
  const f = 0.85 + 0.15 * Math.sin(t * 9 + x) * Math.sin(t * 3.1);
  return (
    <>
      <Glow x={x} y={y - poste * s} r={260 * s} col={col} op={0.6 * f} />
      <svg style={{ position: "absolute", left: x - 40 * s, top: y - (poste + 50) * s, overflow: "visible" }} width={80 * s} height={(poste + 50) * s}>
        <rect x={36 * s} y={40 * s} width={8 * s} height={poste * s} fill="#1a1230" />
        <path d={`M ${22 * s} ${10 * s} L ${58 * s} ${10 * s} L ${52 * s} ${52 * s} L ${28 * s} ${52 * s} Z`} fill={col} opacity={f} />
        <path d={`M ${16 * s} ${12 * s} L ${40 * s} ${-6 * s} L ${64 * s} ${12 * s} Z`} fill="#1a1230" />
      </svg>
    </>
  );
};

// grado final de cualquier set: viñeta de color + luz cálida/fría desde el astro (lo que "pega" todas las capas)
export const Grado: React.FC<{ hora: Hora; xLuz?: number; yLuz?: number; tinte?: string }> = ({ hora, xLuz = 1500, yLuz = 200, tinte }) => {
  const v = hora === "dia" ? "#0a2a5a" : hora === "noche" ? "#05031a" : "#1a0830";
  const l = hora === "dia" ? "#fff2c0" : hora === "noche" ? "#a890ff" : "#ff9a6a";
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 55% at ${xLuz}px ${yLuz}px, ${l}40, ${l}00 70%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 75% at 50% 50%, ${v}00 55%, ${v}aa 100%)`, pointerEvents: "none" }} />
      {tinte && <div style={{ position: "absolute", inset: 0, background: tinte, opacity: 0.14, mixBlendMode: "color", pointerEvents: "none" }} />}
    </>
  );
};

// ── SETS ARMADOS ────────────────────────────────────────────────────────────────────────────────────────
type SP = { t: number; dx?: number; hora?: Hora; tinte?: string; children?: React.ReactNode };

// puerto: cielo, astro, pueblo lejano con ventanas, follaje, agua con reflejo y muelle con faroles
export const SetPuerto: React.FC<SP & { barco?: React.ReactNode }> = ({ t, dx = 0, hora = "atardecer", tinte, barco, children }) => {
  const k = CAPAS[hora];
  return (
    <>
      <Cielo hora={hora} hasta={640} />
      {(hora === "noche" || hora === "atardecer") && <Estrellas t={t} n={hora === "noche" ? 70 : 30} alto={380} />}
      <Astro x={1500 + dx * 0.1} y={190} r={70} hora={hora} />
      <Bultos y={560} col={k.s[0]} seed={11} r={150} dx={dx * 0.15} />
      <Bruma y={600} col={CIELO[hora][3]} op={0.45} />
      <Pueblo t={t} y={640} col={k.s[1]} win={k.win} seed={4} s={0.9} dx={dx * 0.3} />
      <AguaLuz t={t} y={640} hora={hora} xLuz={1500 + dx * 0.1} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx * 0.5}px)` }}>{barco}</div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx}px)` }}>
        <Bultos y={900} col={k.s[2]} rim={k.rim} seed={23} r={95} />
        <Farolito x={260} y={900} t={t} col={k.win} />
        <Farolito x={1700} y={900} t={t} col={k.win} />
      </div>
      <PisoTablas y={880} c1={hora === "dia" ? "#a87448" : "#6a3f3a"} c2={hora === "dia" ? "#6a3f22" : "#2a1428"} xLuz={960} luz={k.win} />
      {children}
      <Grado hora={hora} tinte={tinte} />
    </>
  );
};

// camarote / oficina: pared de tablas iluminada por una lámpara colgante, ventana a la noche/puerto, estantes
export const SetCamarote: React.FC<SP & { ventana?: React.ReactNode; xLamp?: number }> = ({ t, dx = 0, hora = "noche", tinte, ventana, xLamp = 980, children }) => {
  const ls = Math.sin(t * 1.1) * 6; // la lámpara se mece con el barco
  const k = CAPAS[hora];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #3a1e3a, #5a2e34 45%, #2a1428)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${dx * 0.3}px)` }} width={1920} height={1080}>
        {Array.from({ length: 18 }, (_, i) => <rect key={i} x={i * 116 - 60} y={0} width={110} height={840} fill={i % 2 ? "#6a3a30" : "#5e3228"} />)}
        {Array.from({ length: 18 }, (_, i) => <line key={`l${i}`} x1={i * 116 - 4} y1={0} x2={i * 116 - 4} y2={840} stroke="#2a1218" strokeWidth={6} />)}
        <rect x={-100} y={0} width={2200} height={70} fill="#2a1218" />
        {/* estante con frascos */}
        <rect x={120} y={330} width={500} height={18} fill="#2a1218" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={140 + i * 76} y={250 + (i % 3) * 16} width={48} height={80 - (i % 3) * 16} rx={6} fill={["#c84a5a", "#4a7ad8", "#e8b04a", "#5aa86a"][i % 4]} />)}
      </svg>
      {/* ventana redonda (ojo de buey) con el exterior vivo */}
      <div style={{ position: "absolute", left: 1380 + dx * 0.3, top: 170, width: 360, height: 360, borderRadius: "50%", overflow: "hidden", border: "22px solid #c8902a", boxShadow: "inset 0 0 40px #0008, 0 0 60px #ffd27a55" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${CIELO[hora][0]}, ${CIELO[hora][2]} 60%, #1a2a6a 61%, #0a1030)` }} />
        <div style={{ position: "absolute", left: 230, top: 60, width: 50, height: 50, borderRadius: "50%", background: "#fff4d8", boxShadow: "0 0 40px #fff4d8" }} />
        {ventana}
      </div>
      {/* lámpara colgante con su pozo de luz */}
      <Glow x={xLamp + ls} y={230} r={720} col="#ffb860" op={0.55} />
      <Glow x={xLamp + ls} y={230} r={180} col="#fff0b0" op={0.9} />
      <svg style={{ position: "absolute", left: xLamp - 60, top: 0, overflow: "visible", transform: `rotate(${ls * 0.5}deg)`, transformOrigin: "60px 0px" }} width={120} height={300}>
        <line x1={60} y1={0} x2={60} y2={170} stroke="#1a0c10" strokeWidth={5} />
        <path d="M 30 170 L 90 170 L 80 250 L 40 250 Z" fill="#ffd27a" stroke="#6a3a10" strokeWidth={6} />
        <path d="M 22 172 L 60 140 L 98 172 Z" fill="#3a2010" />
      </svg>
      <PisoTablas y={840} c1="#7a4430" c2="#2a1218" xLuz={xLamp} luz="#ffb860" />
      {children}
      <Grado hora="atardecer" xLuz={xLamp} yLuz={260} tinte={tinte} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 45% 40% at ${xLamp}px 300px, #00000000 30%, #120414aa 100%)`, pointerEvents: "none" }} />
      <span style={{ display: "none" }}>{k.rim}</span>
    </>
  );
};

// cubierta del ballenero en alta mar: cielo, mar con reflejo, jarcia y borda en primer plano que se balancean
export const SetCubierta: React.FC<SP & { lejos?: React.ReactNode }> = ({ t, dx = 0, hora = "tarde", tinte, lejos, children }) => {
  const k = CAPAS[hora];
  const bal = Math.sin(t * 0.8) * 1.4;
  return (
    <>
      <Cielo hora={hora} hasta={620} />
      {hora !== "dia" && <Estrellas t={t} n={20} alto={300} />}
      <Astro x={420 + dx * 0.1} y={230} r={80} hora={hora} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: ((i * 760 + t * 16) % 2600) - 400, top: 120 + i * 70, width: 420, height: 70, borderRadius: 40, background: CIELO[hora][3], opacity: 0.35, filter: "blur(6px)" }} />)}
      <AguaLuz t={t} y={620} hora={hora} xLuz={420 + dx * 0.1} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx * 0.4}px)` }}>{lejos}</div>
      <svg style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${dx}px) rotate(${bal}deg)`, transformOrigin: "50% 120%", overflow: "visible" }} width={1920} height={1080}>
        <rect x={140} y={-60} width={46} height={1140} fill={k.s[2]} />
        <rect x={1760} y={-60} width={40} height={1140} fill={k.s[2]} />
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={163} y1={40 + i * 36} x2={-120 + i * 34} y2={880} stroke={k.s[2]} strokeWidth={6} />)}
        {[0, 1, 2, 3, 4].map((i) => <line key={`d${i}`} x1={1780} y1={60 + i * 40} x2={2050 - i * 30} y2={880} stroke={k.s[2]} strokeWidth={6} />)}
        <path d="M -40 860 L 1960 860 L 1960 900 L -40 900 Z" fill={k.s[2]} />
        <path d="M -40 852 L 1960 852" stroke={k.rim} strokeWidth={6} opacity={0.8} />
      </svg>
      <PisoTablas y={895} c1="#9a6440" c2="#3a1c1a" xLuz={600} luz={k.win} />
      {children}
      <Grado hora={hora} xLuz={420} yLuz={230} tinte={tinte} />
    </>
  );
};

// mar abierto (sin barco propio): horizonte bajo, nubes grandes iluminadas, aves y chorro lejano
export const SetMar: React.FC<SP & { lejos?: React.ReactNode; y?: number }> = ({ t, dx = 0, hora = "dia", tinte, lejos, children, y: H = 660 }) => (
  <>
    <Cielo hora={hora} hasta={H} />
    {hora === "noche" && <Estrellas t={t} n={60} alto={H - 120} />}
    <Astro x={1460 + dx * 0.1} y={210} r={80} hora={hora} />
    {[0, 1, 2, 3].map((i) => {
      const x = ((i * 640 + t * 18) % 2700) - 400, y = Math.min(150 + (i % 2) * 120, H - 260);
      return (
        <svg key={i} style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
          <path d="M 0 60 Q 30 0 90 20 Q 140 -30 200 20 Q 270 0 280 60 Z" fill={CIELO[hora][3]} opacity={0.9} />
          <path d="M 0 60 Q 140 80 280 60 Q 140 70 0 60 Z" fill={CIELO[hora][2]} />
        </svg>
      );
    })}
    <Bruma y={H} col={CIELO[hora][3]} h={140} op={0.6} />
    <AguaLuz t={t} y={H} hora={hora} xLuz={1460 + dx * 0.1} />
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx * 0.5}px)` }}>{lejos}</div>
    {children}
    <Grado hora={hora} xLuz={1460} yLuz={210} tinte={tinte} />
  </>
);

// hora a partir de un color de cielo cualquiera (para adaptar fondos viejos sin tocar cada escena)
export const horaDe = (hex: string): Hora => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = 0.3 * r + 0.59 * g + 0.11 * b, sat = Math.max(r, g, b) - Math.min(r, g, b);
  return lum < 0.3 ? "noche" : r > b + 0.08 ? "atardecer" : sat < 0.18 ? "tarde" : "dia";
};

// fondo de color liso «con luz»: el degradé de siempre + pozo de luz arriba, motas de luz que flotan lento
// (bokeh), piso con sombra y viñeta. Para las pantallas de concepto (listas, calendarios, cuentas).
export const FondoLuz: React.FC<{ t: number; c1: string; c2: string; ang?: number; luz?: string }> = ({ t, c1, c2, ang = 180, luz = "#ffffff" }) => {
  const r = rnd(9);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${ang}deg, ${c1}, ${c2})` }} />
      <Glow x={960} y={120} r={900} col={luz} op={0.28} />
      {Array.from({ length: 16 }, (_, i) => { const x0 = r() * 1920, y0 = r() * 1080, rr = 20 + r() * 70, v = 6 + r() * 10; return <div key={i} style={{ position: "absolute", left: ((x0 + t * v) % 2100) - 90, top: y0 + Math.sin(t * 0.4 + i) * 30, width: rr * 2, height: rr * 2, borderRadius: "50%", background: luz, opacity: 0.06 + 0.04 * Math.sin(t + i), filter: "blur(4px)" }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "linear-gradient(180deg, #00000000, #0000003a)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 75% at 50% 45%, #00000000 55%, #0a041a88 100%)" }} />
    </>
  );
};

// campo / granja: colinas verdes con borde de luz, pueblo lejano, cerca y camino de tierra
export const SetCampo: React.FC<SP> = ({ t, dx = 0, hora = "tarde", tinte, children }) => {
  const r = rnd(21);
  return (
    <>
      <Cielo hora={hora} hasta={600} />
      <Astro x={1480 + dx * 0.1} y={200} r={80} hora={hora} />
      <Bultos y={560} col="#6a7ac8" seed={31} r={170} dx={dx * 0.12} />
      <Bruma y={600} col={CIELO[hora][3]} op={0.5} />
      <Pueblo t={t} y={640} col="#4a5a9a" win={CAPAS[hora].win} seed={9} s={0.6} dx={dx * 0.25} torre={false} />
      <Bultos y={660} col="#3f8a4a" rim="#c8f08a" seed={37} r={140} dx={dx * 0.4} />
      <Bultos y={800} col="#2f6e3a" rim="#a8e070" seed={41} r={120} dx={dx * 0.7} />
      <svg style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${dx}px)`, overflow: "visible" }} width={1920} height={1080}>
        <path d="M 760 1080 Q 900 900 1060 820 L 1120 820 Q 1040 920 1160 1080 Z" fill="#c89a5a" />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-60 + i * 180} y={880 + (i % 2) * 6} width={14} height={110} fill="#6a3f22" />)}
        <rect x={-60} y={900} width={2100} height={12} fill="#7a4a26" /><rect x={-60} y={940} width={2100} height={12} fill="#7a4a26" />
        {Array.from({ length: 40 }, (_, i) => { const x = r() * 1920, y = 960 + r() * 110; return <path key={`g${i}`} d={`M ${x} ${y} l 6 -26 l 6 26`} fill="#1f4a28" />; })}
      </svg>
      {children}
      <Grado hora={hora} xLuz={1480} yLuz={200} tinte={tinte} />
    </>
  );
};

// isla tropical: mar turquesa, palmeras que se mecen con borde de luz, arena y follaje denso
export const SetTropico: React.FC<SP> = ({ t, dx = 0, hora = "tarde", tinte, children }) => {
  const Palma = ({ x, y, s, k }: { x: number; y: number; s: number; k: number }) => {
    const m = Math.sin(t * 0.9 + k) * 4;
    return (
      <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
        <path d={`M 0 0 Q ${30 * s} ${-200 * s} ${10 * s + m} ${-420 * s}`} stroke="#5a3418" strokeWidth={26 * s} fill="none" strokeLinecap="round" />
        <g transform={`translate(${10 * s + m} ${-420 * s}) rotate(${m})`}>
          {[-150, -110, -60, -20, 25, 70, 120, 160].map((a, i) => <path key={i} d={`M 0 0 Q ${Math.cos((a * Math.PI) / 180) * 120 * s} ${Math.sin((a * Math.PI) / 180) * 120 * s - 60 * s} ${Math.cos((a * Math.PI) / 180) * 230 * s} ${Math.sin((a * Math.PI) / 180) * 230 * s + 40 * s}`} stroke={i % 2 ? "#2f8a3a" : "#3fa84a"} strokeWidth={30 * s} fill="none" strokeLinecap="round" />)}
          <circle cx={0} cy={14 * s} r={18 * s} fill="#6a4a1a" /><circle cx={22 * s} cy={18 * s} r={16 * s} fill="#7a5a22" />
        </g>
      </svg>
    );
  };
  return (
    <>
      <Cielo hora={hora} hasta={620} />
      <Astro x={1500 + dx * 0.1} y={200} r={80} hora={hora} />
      <AguaLuz t={t} y={620} hora="dia" xLuz={1500} c={["#1fb8c0", "#0a6a96"]} />
      <Bultos y={700} col="#2a6a4a" rim="#bff08a" seed={51} r={130} dx={dx * 0.4} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx * 0.6}px)` }}>
        <Palma x={260} y={820} s={1} k={1} /><Palma x={1640} y={800} s={1.15} k={2} /><Palma x={1380} y={760} s={0.7} k={3} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "linear-gradient(180deg, #f2d08a, #c89a5a)" }} />
      {children}
      <Grado hora={hora} xLuz={1500} yLuz={200} tinte={tinte} />
    </>
  );
};
