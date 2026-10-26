import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, fontFamily, ent, prog, Escena, Chip, Grande, MapaPuntos, Particulas, Emote, cabeza, Aguila, lugar, Zzz } from "./kit";
import { Gladius, Escudo, Pilum, Soldadito, Craneo, Arbol, Lluvia } from "./kit2";
import { Campamento, Interior, Valle, Bosque, Tablero, pose } from "./kit3";

// Parte 6 (659,62-792,73 s): trampa 6, la batalla desde adentro, Cannas y el bosque de Teutoburgo.
// v3 (ojo del director): el protagonista (casco dorado, seed 1) HACE lo que se narra en cada escena, todos con los pies
// dentro del cuadro (línea de pies 975), ≥96 px de los bordes, un componente que lleva el concepto, y los chips nunca
// encima de un personaje ni de otro texto.
type PP = React.ComponentProps<typeof Persona>;
const Yo: React.FC<Omit<PP, "seed" | "casco">> = (p) => <Persona seed={1} casco="legion" {...p} />;
const PIE = 975;
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const VARO = { tunica: "#7a1fa3", tunica2: "#4a0f6a", cinto: "#3b230f", piel: "#d99872", piel2: "#b06f4e", pelo: "#8a8a8a" };
const GERMANO = { tunica: "#3a5a2a", tunica2: "#24401a", cinto: "#3b230f", piel: "#e8b090", piel2: "#c08060", pelo: "#c9a050" };
const CENTURION = { tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#3b230f", piel: "#d99872", piel2: "#b06f4e", pelo: "#2a1a10" };
const ANIBAL = { tunica: "#2f6df6", tunica2: "#1a3a90", cinto: "#3b230f", piel: "#c88a62", piel2: "#a06a4a", pelo: "#1a1010" };
const AUGUSTO = { tunica: "#f2efe6", tunica2: "#7a1fa3", cinto: "#e9a92a", piel: "#e0a07a", piel2: "#c07a5a", pelo: "#c9c9c9" };
const NOCHE = "#140a22";
// compañeros: túnica bordó más oscura y caras variadas, así el protagonista (LUCIUS, rojo vivo) se distingue siempre
const compa = (n: number) => {
  const tu = [["#a8303f", "#6e1626"], ["#b5402f", "#7a2618"], ["#9c2a45", "#5e1430"]][Math.abs(Math.round(n)) % 3];
  const pi = [["#c98b62", "#a2643f"], ["#8d5a3b", "#6a3f26"], ["#f5c7a0", "#dc9d78"], ["#e0a07a", "#b87a54"]][Math.abs(Math.round(n * 7)) % 4];
  return { tunica: tu[0], tunica2: tu[1], cinto: "#4a2a12", piel: pi[0], piel2: pi[1], pelo: "#2b1c14" };
};

// ── cosas en la mano (coordenadas del antebrazo de Persona: +y = hacia donde apunta el antebrazo)
const ESPADA = (
  <g>
    <rect x={-28} y={-8} width={56} height={16} rx={7} fill="#e9a92a" />
    <path d="M -14 8 L -14 122 L 0 154 L 14 122 L 14 8 Z" fill="#e4e8ef" stroke="#7d8796" strokeWidth={5} />
    <line x1={0} y1={16} x2={0} y2={130} stroke="#aab2c0" strokeWidth={4} />
  </g>
);
const Antorcha = ({ rot, t }: { rot: number; t: number }) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-10} y={-150} width={20} height={175} rx={7} fill="#6b3a1f" />
    <ellipse cx={0} cy={-186} rx={32} ry={48 + Math.sin(t * 17) * 6} fill="#ff8a1a" />
    <ellipse cx={0} cy={-174} rx={17} ry={27 + Math.sin(t * 23) * 4} fill="#ffe27a" />
  </g>
);
const CascoOxidado = ({ rot }: { rot: number }) => (
  <g transform={`rotate(${rot}) translate(0 -96)`}>
    <path d="M -96 30 Q -100 -92 0 -92 Q 100 -92 96 30 L 108 40 L -108 40 Z" fill="#8a5a2a" />
    <path d="M -96 30 L -84 92 L -58 82 L -64 36 Z M 96 30 L 84 92 L 58 82 L 64 36 Z" fill="#6b4220" />
    <path d="M -108 40 L 108 40 L 114 54 L -114 54 Z" fill="#5a3418" />
    {[[-50, -40, 16], [30, -60, 12], [56, 0, 18], [-20, 10, 10]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#a8692e" opacity={0.8} />)}
    <path d="M -30 -92 L -14 -60 L -34 -40" stroke="#3b230f" strokeWidth={5} fill="none" />
    <text x={0} y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#f2d9a0">XVIII</text>
  </g>
);

// ── piezas propias
const Tachado: React.FC<{ t: number; t0: number; x: number; y: number; w?: number; h?: number }> = ({ t, t0, x, y, w = 600, h = 400 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - h / 2, overflow: "visible" }} width={w} height={h}>
    <path d={`M 20 20 L ${w - 20} ${h - 20} M ${w - 20} 20 L 20 ${h - 20}`} stroke={C.rojo} strokeWidth={Math.min(w, h) / 10} strokeLinecap="round" strokeDasharray={w + h} strokeDashoffset={(w + h) * (1 - prog(t, t0, t0 + 0.25))} />
  </svg>
);
// número con separador de miles que cuenta
const Num: React.FC<{ t: number; t0: number; t1: number; de: number; a: number; x: number; y: number; size?: number; color?: string; pre?: string; suf?: string; borde?: string }> = ({ t, t0, t1, de, a, x, y, size = 150, color = "#fff", pre = "", suf = "", borde = "#2a1530" }) => {
  if (t < t0) return null;
  const v = Math.round(de + (a - de) * prog(t, t0, t1));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${ent(t, t0)})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.08}px ${borde}`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 ${size * 0.06}px 0 ${borde}` }}>{pre}{v.toLocaleString("en-US")}{suf}</div>;
};
// Grande que se va (para que el siguiente título entre en el mismo lugar sin encimarse)
const GrandeHasta: React.FC<React.ComponentProps<typeof Grande> & { hasta: number }> = ({ hasta, ...p }) => (p.t < hasta ? <Grande {...p} /> : null);
// estandarte de legión con su número (centro en x,y; alto 720·s)
const Signum: React.FC<{ x: number; y: number; s?: number; n: string; op?: number; dy?: number; pulso?: number }> = ({ x, y, s = 1, n, op = 1, dy = 0, pulso = 1 }) => (
  <div style={{ position: "absolute", left: x - 140 * s, top: y - 360 * s + dy, width: 280 * s, height: 720 * s, opacity: op, transform: `scale(${pulso})`, transformOrigin: "50% 40%" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 280, height: 720, transform: `scale(${s})`, transformOrigin: "0 0", filter: op < 1 ? `grayscale(${1 - op})` : undefined }}>
      <div style={{ position: "absolute", left: 132, top: 120, width: 16, height: 600, background: "#8a5a2a" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 280, height: 180 }}><Aguila x={140} y={90} s={0.7} /></div>
      <div style={{ position: "absolute", left: 40, top: 220, width: 200, height: 220, background: C.rojo, border: "8px solid #e9a92a", fontFamily, fontWeight: 700, fontSize: 72, color: "#fff", textAlign: "center", lineHeight: "200px" }}>{n}</div>
    </div>
  </div>
);
// elefante de Aníbal (pies en x,y)
const Elefante: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const p = Math.sin(t * 5) * 10;
  return (
    <svg style={{ position: "absolute", left: x - 220 * s, top: y - 330 * s, overflow: "visible" }} width={440 * s} height={330 * s} viewBox="-220 -330 440 330">
      <ellipse cx={0} cy={0} rx={190} ry={18} fill="rgba(20,10,40,.28)" />
      {[-120, -60, 50, 110].map((lx, i) => <rect key={lx} x={lx - 22} y={-110 + (i % 2 ? p : -p) * 0.3} width={44} height={110 - (i % 2 ? p : -p) * 0.3} rx={14} fill={i % 2 ? "#7d7f92" : "#8e90a4"} />)}
      <ellipse cx={-10} cy={-170} rx={170} ry={100} fill="#9a9cb0" />
      <path d="M -150 -210 Q -60 -260 60 -250" stroke="#b4b6c8" strokeWidth={14} fill="none" strokeLinecap="round" />
      <circle cx={150} cy={-200} r={70} fill="#9a9cb0" />
      <path d={`M 196 -170 Q 236 -110 ${214 + p} -40`} stroke="#9a9cb0" strokeWidth={34} fill="none" strokeLinecap="round" />
      <ellipse cx={108} cy={-196} rx={46} ry={62} fill="#8e90a4" />
      <path d="M 182 -150 Q 222 -140 234 -170" stroke="#fff8ec" strokeWidth={12} fill="none" strokeLinecap="round" />
      <circle cx={170} cy={-214} r={9} fill="#2a1530" />
      <path d="M -120 -268 L 80 -268 L 70 -214 L -110 -214 Z" fill={C.rojo} />
      <path d="M -120 -268 L 80 -268" stroke="#e9a92a" strokeWidth={10} />
    </svg>
  );
};
// altura (y) del cerro del Valle en x
const cerroY = (x: number) => {
  if (x < 1100) return 760 - ((x + 100) / 1200) * 120;
  const u = (-800 + Math.sqrt(640000 + 800 * (x - 1100))) / 400;
  return (1 - u) * (1 - u) * 640 + 2 * u * (1 - u) * 470 + u * u * 430;
};
// posición en pantalla de un lugar del MapaPuntos mientras la cámara vuela
const enMapa = (t: number, n: string, vt: [number, number], z: number) => {
  const l = lugar(n), v = prog(t, vt[0], vt[1]), Z = 1 + (z - 1) * v;
  return { x: (960 - l.x * Z) * v + l.x * Z, y: (540 - l.y * Z) * v + l.y * Z };
};
const Pin: React.FC<{ x: number; y: number; t: number; t0: number }> = ({ x, y, t, t0 }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 9, stiffness: 200 });
  return (
    <svg style={{ position: "absolute", left: x - 40, top: y - 110, overflow: "visible", transform: `scale(${e})`, transformOrigin: "40px 110px" }} width={80} height={110}>
      <path d="M 40 106 Q 4 60 4 40 A 36 36 0 1 1 76 40 Q 76 60 40 106 Z" fill={C.rojo} stroke="#fff" strokeWidth={6} />
      <circle cx={40} cy={40} r={14} fill="#fff" />
    </svg>
  );
};
// barra con rótulo (energía / ancho del camino)
const Barra: React.FC<{ x: number; y: number; w: number; f: number; rotulo: string; der?: string }> = ({ x, y, w, f, rotulo, der }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - 40, width: w }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill", marginBottom: 6 }}><span>{rotulo}</span>{der && <span>{der}</span>}</div>
    <div style={{ width: w, height: 70, borderRadius: 35, border: "8px solid #fff", background: "rgba(20,8,40,.45)", overflow: "hidden", boxShadow: "0 8px 0 rgba(20,10,50,.35)" }}>
      <div style={{ width: `${Math.max(0, Math.min(1, f)) * 100}%`, height: "100%", background: f > 0.5 ? C.lima : f > 0.25 ? C.ambar : C.rojo }} />
    </div>
  </div>
);
// mini barra sobre la cabeza
const MiniBarra: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <div style={{ position: "absolute", left: x - 70, top: y - 14, width: 140, height: 28, borderRadius: 14, border: "5px solid #fff", background: "rgba(20,8,40,.5)", overflow: "hidden" }}>
    <div style={{ width: `${Math.max(0.04, Math.min(1, f)) * 100}%`, height: "100%", background: f > 0.5 ? C.lima : f > 0.25 ? C.ambar : C.rojo }} />
  </div>
);
// casquito (icono de 1 hombre / 1.000 hombres)
const Casquito: React.FC<{ x: number; y: number; s?: number; color?: string; cae?: number }> = ({ x, y, s = 1, color = "#e9a92a", cae = 0 }) => (
  <svg style={{ position: "absolute", left: x - 30 * s, top: y - 30 * s, overflow: "visible", transform: `translateY(${cae * 14}px) rotate(${cae * 24}deg) scaleY(${1 - cae * 0.3})`, opacity: 1 - cae * 0.3 }} width={60 * s} height={50 * s} viewBox="-30 -30 60 50">
    <path d="M -24 8 Q -26 -26 0 -26 Q 26 -26 24 8 L 28 12 L -28 12 Z" fill={color} />
    <path d="M -24 8 L -20 20 L -14 18 L -16 10 Z M 24 8 L 20 20 L 14 18 L 16 10 Z" fill="rgba(0,0,0,.25)" />
  </svg>
);
const Huesos: React.FC<{ t: number; t0: number; n: number; x0: number; x1: number; y: number; seed?: number }> = ({ t, t0, n, x0, x1, y, seed = 1 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const ti = t0 + i * 0.08;
      if (t < ti) return null;
      const x = x0 + (((i * 263 + seed * 97) % 1000) / 1000) * (x1 - x0), yy = y + ((i * 37 + seed * 11) % 3) * 22;
      return <div key={i} style={{ position: "absolute", left: x - 55, top: yy - 11, width: 110, height: 22, borderRadius: 11, background: "#f2efe6", transform: `rotate(${((i * 47 + seed * 13) % 60) - 30}deg) scale(${ent(t, ti)})`, boxShadow: "-12px 0 0 -2px #f2efe6, 12px 0 0 -2px #f2efe6, 0 5px 0 rgba(0,0,0,.25)" }} />;
    })}
  </>
);
// lanzamiento del pilum: brazo de adelante (sube atrás y suelta en tr)
const tiro = (t: number, tr: number) => {
  if (t < tr - 0.55 || t > tr + 0.35) return null;
  if (t < tr - 0.05) { const k = prog(t, tr - 0.55, tr - 0.05); return { bD: 40 + k * 160, cD: 20 + k * 50, inclina: -8 * k }; }
  const k = prog(t, tr - 0.05, tr + 0.2);
  return { bD: 200 - k * 130, cD: 70 - k * 60, inclina: -8 + k * 18 };
};
const Vuelo: React.FC<{ t: number; tr: number; x0: number; y0: number; x1: number; y1: number; dur?: number; alto?: number; s?: number }> = ({ t, tr, x0, y0, x1, y1, dur = 0.8, alto = 360, s = 0.55 }) => {
  if (t < tr) return null;
  const k = Math.min(1, (t - tr) / dur);
  const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * alto;
  const dx = x1 - x0, dy = (y1 - y0) - Math.cos(k * Math.PI) * Math.PI * alto;
  return <Pilum x={x} y={y} s={s} rot={(Math.atan2(dy, dx) * 180) / Math.PI} />;
};

export const P6: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 158 · trampa seis: la batalla — tablero al 80 % centrado, casilla 7 adentro */}
    <Escena t={t} t0={659.62} t1={662.0} entra="corte" zoom={0.015} golpes={[659.84, 660.96]}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #7a4a22 0 150px, #6b3f1c 150px 156px, #85522a 156px 300px)" }} />
      <div style={{ position: "absolute", left: 960 - 0.82 * 960 - 48, top: 540 - 0.82 * 540 + 50, width: 1920 * 0.82, height: 1080 * 0.82, borderRadius: 30, overflow: "hidden", border: "12px solid #3b230f", boxShadow: "0 18px 0 rgba(20,10,5,.45)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.82)", transformOrigin: "0 0" }}>
          <Tablero t={t} t0={659.3} en={5} de={4} tAvanza={659.8} marca={660.7} hecho={5} />
        </div>
      </div>
      <Chip t={t} t0={659.84} text="TRAP 6 OF 7" color={C.rojo} x={180} y={130} size={62} />
      <Grande t={t} t0={660.96} text="THE BATTLE" x={1200} y={140} size={110} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 159 · tarde o temprano llega: el enemigo asoma en la cresta y vos lo ves */}
    <Escena t={t} t0={662.0} t1={663.15} entra="zoom" zoom={0.02} golpes={[662.32]}>
      <Valle t={t} hora="tarde" />
      {Array.from({ length: 12 }, (_, i) => { const x = 1180 + i * 50; const k = prog(t, 662.0 + i * 0.04, 662.5 + i * 0.04); return <Soldadito key={i} x={x} y={cerroY(x) + 8 + (1 - k) * 60} s={0.5} t={t} seed={300 + i} enemigo />; })}
      <Yo x={520} y={PIE} h={540} t={t} expr="miedo" mira={0.9} salta={662.3} bD={30} cD={20} />
      <Emote t={t} t0={662.3} tipo="excl" {...L(520, PIE, 540)} />
      <Grande t={t} t0={662.12} text="IT COMES." x={1100} y={190} size={150} color="#fff" borde="#2a0a1e" />
    </Escena>

    {/* 160 · el enemigo en la colina; vos en la fila, hombro con hombro, escudo con escudo (la fila se cierra) */}
    <Escena t={t} t0={663.15} t1={668.72} zoom={0.02} entra="corte" golpes={[663.91, 665.34, 666.38, 667.74]}>
      <Valle t={t} hora="tarde" />
      {Array.from({ length: 9 }, (_, i) => { const x = 1440 + i * 40; return <Soldadito key={i} x={x} y={cerroY(x) + 10} s={0.5} t={t} seed={200 + i} enemigo avanza={0.5} />; })}
      {(() => {
        const gap = interpolate(prog(t, 666.2, 667.0), [0, 1], [180, 150]);
        return Array.from({ length: 7 }, (_, k) => {
          const x = 880 + (k - 3) * gap;
          return (
            <React.Fragment key={k}>
              <Persona x={x} y={PIE} h={420} t={t} seed={k === 3 ? 1 : 320 + k} casco="legion" ropa={k === 3 ? undefined : compa(320 + k)} expr={k === 3 ? "miedo" : "neutro"} mira={0.7} bI={20} bD={20} />
              <Escudo x={x} y={PIE - 150} s={0.55} rot={(k - 3) * 1.5} />
            </React.Fragment>
          );
        });
      })()}
      {t > 666.9 && t < 667.5 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[0, 1, 2, 3, 4, 5].map((i) => { const x = 880 + (i - 2.5) * 150, a = prog(t, 666.9, 667.4); return <circle key={i} cx={x} cy={PIE - 150} r={20 + a * 40} fill="none" stroke="#fff" strokeWidth={8} opacity={1 - a} />; })}</svg>}
      <svg style={{ position: "absolute", left: 860, top: 452 + Math.sin(t * 6) * 8 }} width={40} height={30}><path d="M 0 0 L 40 0 L 20 28 Z" fill={C.oro} stroke="#2a1530" strokeWidth={4} /></svg>
      <Chip t={t} t0={663.91} text="THE ENEMY: ON THE HILL" color={C.rojo} x={1040} y={140} size={48} />
      <Chip t={t} t0={665.34} text="YOU: IN A LINE" color={C.violeta} x={180} y={260} size={54} />
      <Chip t={t} t0={666.38} text="SHIELD TOUCHING SHIELD" color={C.ambar} tinta={C.noche} x={180} y={370} size={48} />
    </Escena>

    {/* 161 · cómo se siente desde adentro: el corazón se dispara */}
    <Escena t={t} t0={668.72} t1={672.22} zoom={0.02} entra="zoom" golpes={[669.96, 671.15]}>
      <Valle t={t} hora="tarde" />
      {Array.from({ length: 9 }, (_, i) => { const x = 1440 + i * 40; return <Soldadito key={i} x={x} y={cerroY(x) + 10} s={0.5} t={t} seed={310 + i} enemigo avanza={0.5} />; })}
      <Persona x={360} y={PIE} h={480} t={t} seed={321} casco="legion" ropa={compa(321)} expr="neutro" mira={0.6} bI={20} bD={20} />
      <Escudo x={360} y={PIE - 165} s={0.6} />
      <Persona x={1080} y={PIE} h={480} t={t} seed={324} casco="legion" ropa={compa(324)} expr="triste" mira={0.6} bI={20} bD={20} />
      <Escudo x={1080} y={PIE - 165} s={0.6} />
      <Yo x={720} y={PIE} h={540} t={t} expr="miedo" mira={0.7} inclina={Math.sin(t * 31) * 1.2} bD={30} bI={30} cD={60} cI={60} />
      <Emote t={t} t0={670.0} tipo="sudor" {...L(720, PIE, 540)} s={1.2} />
      {(() => {
        const bpm = Math.round(interpolate(t, [668.8, 671.6], [80, 172], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        const per = 60 / bpm, W = 420;
        const pts = Array.from({ length: 106 }, (_, i) => {
          const px = i * 4, tt = t - (W - px) / 300;
          const u = ((tt % per) + per) % per / per;
          const yy = u > 0.42 && u < 0.47 ? -70 : u >= 0.47 && u < 0.52 ? 40 : u > 0.6 && u < 0.7 ? -14 : 0;
          return `${i ? "L" : "M"} ${px} ${110 + yy}`;
        }).join(" ");
        return (
          <div style={{ position: "absolute", left: 1300, top: 300, width: 460, height: 300, borderRadius: 28, background: "rgba(20,8,40,.85)", border: "8px solid #fff", boxShadow: "0 10px 0 rgba(20,10,50,.35)" }}>
            <div style={{ position: "absolute", left: 22, top: 12, fontFamily, fontWeight: 700, fontSize: 34, color: "#ffb0b8" }}>HEART RATE</div>
            <svg style={{ position: "absolute", left: 20, top: 60 }} width={420} height={170}><path d={pts} stroke={bpm > 140 ? C.rojo : C.lima} strokeWidth={7} fill="none" strokeLinejoin="round" /></svg>
            <div style={{ position: "absolute", right: 22, bottom: 8, fontFamily, fontWeight: 700, fontSize: 64, color: "#fff" }}>{bpm} <span style={{ fontSize: 30 }}>BPM</span></div>
          </div>
        );
      })()}
      <Grande t={t} t0={670.36} text="FROM THE INSIDE" x={900} y={150} size={96} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 162 · primero, la espera: a veces horas (bostezos, uno se duerme, el reloj corre) */}
    <Escena t={t} t0={672.22} t1={675.38} zoom={0.02} entra="corte" golpes={[672.96, 674.46]}>
      <Valle t={t} />
      <Persona x={300} y={PIE} h={460} t={t} seed={331} casco="legion" ropa={compa(331)} expr="triste" ladea={Math.sin(t * 2) * 8} {...pose("contar", t, 0.6)} />
      {(() => {
        const bost = t > 672.5 && t < 673.8;
        return <Yo x={640} y={PIE} h={520} t={t} expr={bost ? "sorpresa" : "dormido"} bI={bost ? 165 : 25} bD={bost ? 165 : 70} cI={bost ? 30 : 10} cD={bost ? 30 : 80} inclina={bost ? -4 : 8} ladea={bost ? -6 : 10} />;
      })()}
      <Escudo x={790} y={PIE - 150} s={0.6} rot={10} />
      <Persona x={980} y={PIE} h={460} t={t} seed={333} casco="legion" ropa={compa(333)} expr="dormido" inclina={6} ladea={14} />
      <Zzz x={1040} y={PIE - 520} t={t} />
      <Persona x={1260} y={PIE} h={460} t={t} seed={334} casco="legion" ropa={compa(334)} expr="neutro" {...pose("comer", t, 0.8)} />
      <svg style={{ position: "absolute", left: 1560 - 140, top: 110 }} width={280} height={280} viewBox="-280 -280 560 560">
        <circle r={250} fill="#fff8ec" stroke="#2a1530" strokeWidth={16} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-215} x2={0} y2={-240} stroke="#2a1530" strokeWidth={10} transform={`rotate(${i * 30})`} />)}
        <path d={`M 0 0 L 0 -200 A 200 200 0 ${(t - 672.2) * 30 > 180 ? 1 : 0} 1 ${Math.sin(((t - 672.2) * 30 * Math.PI) / 180) * 200} ${-Math.cos(((t - 672.2) * 30 * Math.PI) / 180) * 200} Z`} fill={C.ambar} opacity={0.45} />
        <line x1={0} y1={0} x2={0} y2={-180} stroke={C.rojo} strokeWidth={14} strokeLinecap="round" transform={`rotate(${(t - 672.2) * 720})`} />
        <line x1={0} y1={0} x2={0} y2={-120} stroke="#2a1530" strokeWidth={18} strokeLinecap="round" transform={`rotate(${(t - 672.2) * 30})`} />
        <circle r={18} fill="#2a1530" />
      </svg>
      <Chip t={t} t0={672.96} text="FIRST: THE WAITING" color={C.violeta} x={180} y={140} size={58} />
      <Chip t={t} t0={674.46} text="WAITING: HOURS" color={C.ambar} tinta={C.noche} x={1560} y={450} centro size={50} />
    </Escena>

    {/* 163 · el enemigo carga: vos te atrincherás detrás del escudo */}
    <Escena t={t} t0={675.38} t1={677.0} zoom={0.02} entra="corte" golpes={[675.93]}>
      <Valle t={t} hora="tarde" />
      {Array.from({ length: 10 }, (_, i) => { const k = prog(t, 675.4, 677.2); const x0 = 1200 + (i % 5) * 110, x1 = 820 + (i % 5) * 200; return <Soldadito key={i} x={interpolate(k, [0, 1], [x0, x1]) + Math.floor(i / 5) * 50} y={interpolate(k, [0, 1], [cerroY(x0) + 20, 930]) - Math.floor(i / 5) * 30} s={interpolate(k, [0, 1], [0.6, 1.9])} t={t} seed={210 + i} enemigo avanza={2} />; })}
      <Particulas t={t} tipo="polvo" n={30} seed={123} />
      <Yo x={400} y={PIE} h={540} t={t} expr="miedo" mira={0.9} salta={675.9} bD={70} cD={60} inclina={-6} />
      <Escudo x={560} y={PIE - 170} s={0.68} rot={6} />
      <Grande t={t} t0={675.93} text="CHARGE!" x={1150} y={190} size={160} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 164 · cuando están cerca, tirás tus dos jabalinas (contador de pila 2 → 0) */}
    <Escena t={t} t0={677.0} t1={679.82} zoom={0.02} entra="corte" golpes={[678.2, 679.0]}>
      <Valle t={t} hora="tarde" />
      {[0, 1, 2, 3, 4].map((i) => <Soldadito key={i} x={1260 + i * 110} y={PIE - (i % 2) * 30} s={1.3} t={t} seed={220 + i} enemigo avanza={1.5} cae={i === 1 ? 679.0 : i === 3 ? 679.6 : undefined} />)}
      <Persona x={370} y={PIE - 20} h={420} t={t} seed={341} casco="legion" ropa={compa(341)} expr="enojado" {...pose("lanzar", t + 0.4)} />
      {(() => { const a = tiro(t, 678.2) ?? tiro(t, 679.0) ?? { bD: 30, cD: 20, inclina: 0 }; return <Yo x={570} y={PIE} h={540} t={t} expr="enojado" mira={0.8} {...a} />; })()}
      <Persona x={790} y={PIE - 20} h={420} t={t} seed={343} casco="legion" ropa={compa(343)} expr="enojado" {...pose("lanzar", t + 0.9)} />
      {Array.from({ length: 6 }, (_, i) => <Vuelo key={i} t={t} tr={677.6 + i * 0.27} x0={i % 2 ? 400 : 810} y0={560} x1={1250 + (i * 97) % 450} y1={880} dur={0.9} alto={300} s={0.45} />)}
      <Vuelo t={t} tr={678.2} x0={670} y0={480} x1={1370} y1={840} />
      <Vuelo t={t} tr={679.0} x0={670} y0={480} x1={1590} y1={830} />
      <div style={{ position: "absolute", left: 1290, top: 96, width: 440, height: 170, borderRadius: 26, background: "rgba(20,8,40,.85)", border: "7px solid #fff" }}>
        <div style={{ position: "absolute", left: 22, top: 10, fontFamily, fontWeight: 700, fontSize: 36, color: C.oro }}>YOUR PILA: {t < 678.2 ? 2 : t < 679.0 ? 1 : 0}</div>
        {[0, 1].map((i) => { const ido = t > (i ? 678.2 : 679.0); return <svg key={i} style={{ position: "absolute", left: 24, top: 66 + i * 46, opacity: ido ? 0.25 : 1 }} width={390} height={36}><rect x={0} y={13} width={250} height={11} rx={5} fill="#c8925a" /><rect x={250} y={15} width={110} height={7} fill="#c8ccd4" /><path d="M 356 6 L 388 18 L 356 30 Z" fill="#e4e8ef" />{ido && <line x1={0} y1={30} x2={390} y2={4} stroke={C.rojo} strokeWidth={6} />}</svg>; })}
      </div>
      <Chip t={t} t0={677.29} text="WHEN THEY ARE CLOSE" color={C.violeta} x={180} y={140} size={54} />
      <Chip t={t} t0={678.55} text="THROW YOUR 2 JAVELINS" color={C.rojo} x={180} y={250} size={54} />
    </Escena>

    {/* 165 · desenvainás el gladius y te metés en el amontonamiento */}
    <Escena t={t} t0={679.82} t1={683.91} zoom={0.02} entra="corte" golpes={[680.05, 681.51, 683.15]}>
      <Valle t={t} hora="tarde" />
      {t < 682.2 ? <>
        {[0, 1, 2, 3].map((i) => <Soldadito key={i} x={interpolate(t, [679.8, 682.2], [1440, 1240]) + i * 130} y={PIE - (i % 2) * 24} s={1.3} t={t} seed={230 + i} enemigo avanza={1.5} />)}
        <Escudo x={420} y={PIE - 170} s={0.62} rot={-6} />
        <Yo x={580} y={PIE} h={560} t={t} expr="enojado" mira={0.8} bD={interpolate(prog(t, 679.95, 680.6), [0, 1], [15, 160])} cD={15} manoD={ESPADA} />
        <Emote t={t} t0={680.6} t1={681.4} tipo="brillos" x={640} y={PIE - 560} s={1.1} />
        {t > 681.3 && <div style={{ position: "absolute", left: 1100, top: 150, width: 640, height: 330, borderRadius: 30, background: "#f6e3b4", border: "9px solid #2a1530", boxShadow: "0 12px 0 rgba(20,10,50,.35)", transform: `scale(${ent(t, 681.3)})` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 58, color: C.rojo }}>THE GLADIUS</div>
          <Gladius x={320} y={170} s={0.85} rot={90} />
          <svg style={{ position: "absolute", left: 120, top: 230 }} width={400} height={80}>
            <line x1={10} y1={20} x2={390} y2={20} stroke="#2a1530" strokeWidth={6} />
            {Array.from({ length: 13 }, (_, i) => <line key={i} x1={10 + i * 31.6} y1={8} x2={10 + i * 31.6} y2={i % 2 ? 22 : 34} stroke="#2a1530" strokeWidth={4} />)}
            <text x={200} y={74} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={36} fill="#2a1530">≈ 60 CM · SHORT</text>
          </svg>
        </div>}
      </> : <>
        {[0, 1, 2, 3, 4].map((i) => <Soldadito key={`b${i}`} x={1020 + i * 150} y={PIE - 70} s={1.2} t={t} seed={250 + i} enemigo avanza={2} />)}
        {[0, 1, 2, 3, 4].map((i) => <Soldadito key={i} x={1000 + i * 150 + Math.sin(t * 8 + i) * 10} y={PIE} s={1.6} t={t} seed={240 + i} enemigo avanza={2} />)}
        {[0, 1].map((i) => <Persona key={`r${i}`} x={300 + i * 170} y={PIE - 10} h={420} t={t} seed={260 + i} casco="legion" ropa={compa(260 + i)} expr="enojado" {...pose("empujar", t + i * 0.3, 1.2)} bI={-40} inclina={12} />)}
        {(() => { const x = interpolate(prog(t, 682.2, 683.3), [0, 1], [560, 790]); return <>
          <Yo x={x} y={PIE} h={520} t={t} expr="enojado" mira={0.9} camina={t < 683.3 ? 1.6 : 0} bD={80} cD={10} manoD={ESPADA} inclina={10} />
          <Escudo x={x + 140} y={PIE - 160} s={0.6} rot={8} />
        </>; })()}
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[0, 1, 2].map((i) => { const a = ((t * 3 + i / 3) % 1); return <path key={i} d={`M ${930 + a * 30} ${700 + i * 50} l 30 24 l -30 24`} stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={1 - a} />; })}</svg>
        <Particulas t={t} tipo="polvo" n={30} seed={126} />
      </>}
      <Grande t={t} t0={683.01} text="INTO THE CRUSH" x={960} y={180} size={110} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 166 · no la balanceás como en las películas */}
    <Escena t={t} t0={683.91} t1={685.9} zoom={0.02} entra="corte" golpes={[684.36, 685.2]}>
      <Valle t={t} hora="tarde" />
      {(() => { const g = Math.sin((t - 683.9) * 7); return <Yo x={960} y={PIE} h={540} t={t} expr={t < 684.8 ? "feliz" : "sorpresa"} bD={95 + g * 75} cD={10} manoD={ESPADA} inclina={g * 8} salta={683.95} />; })()}
      <svg style={{ position: "absolute", left: 560, top: 220 }} width={800} height={560}>
        <path d="M 60 470 A 360 360 0 0 1 740 470" stroke="#fff" strokeWidth={18} fill="none" strokeDasharray="40 30" strokeLinecap="round" strokeDashoffset={-t * 200} />
      </svg>
      {t < 684.8 && <>
        {[0, 1].map((b) => <div key={b} style={{ position: "absolute", left: 0, right: 0, top: b ? 1000 : 0, height: 80, background: "#151018" }}>
          {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 96 - (t * 300) % 96) + 1920) % 1920 - 20, top: 22, width: 46, height: 36, borderRadius: 8, background: "#fff8ec" }} />)}
        </div>)}
      </>}
      {t > 684.8 && <Tachado t={t} t0={684.8} x={960} y={500} w={760} h={520} />}
      <Chip t={t} t0={684.36} text="NOT LIKE IN THE MOVIES" color={C.rojo} x={960} y={150} centro size={56} />
    </Escena>

    {/* 167-168 · apuñalás bajo desde atrás del escudo... mientras alguien que no ves te apuñala */}
    <Escena t={t} t0={685.9} t1={692.98} zoom={0.02} entra="corte" golpes={[685.91, 686.53, 687.91, 691.53]}>
      <Valle t={t} hora="tarde" />
      {(() => {
        const ap = pose("apunalar", t - 685.9, 1.3);
        const st = Math.max(0, (ap.bD - 40) / 50);
        const golpeado = t > 691.5;
        return <>
          {t > 690.2 && <Persona x={1520} y={PIE} h={560} t={t} seed={358} sombra={NOCHE} flip bD={95} cD={10} inclina={-6} manoD={<g transform="translate(0 10)"><path d="M -10 0 L -10 110 L 0 140 L 10 110 L 10 0 Z" fill="#c9ccd6" /></g>} opacity={prog(t, 690.2, 690.7)} />}
          {t > 690.2 && <Emote t={t} t0={690.4} tipo="preg" {...L(1520, PIE, 560)} />}
          <Persona x={1200} y={PIE} h={520} t={t} seed={355} ropa={GERMANO} expr={st > 0.5 ? "miedo" : "enojado"} flip bD={80 + Math.sin(t * 5) * 6} cD={10} bI={-60} cI={20} inclina={-12 + st * 6} />
          <Yo x={560 - (golpeado ? prog(t, 691.5, 691.8) * 40 : 0)} y={PIE} h={520} t={t} expr={golpeado ? "miedo" : "enojado"} mira={0.9} salta={golpeado ? 691.55 : undefined} {...ap} bI={-30} cI={40} manoD={ESPADA} inclina={8 + st * 6} />
          <Escudo x={735 + st * 12} y={PIE - 205} s={0.58} rot={4} />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d="M 780 860 Q 940 900 1080 880" stroke="#fff" strokeWidth={8} fill="none" strokeDasharray="22 16" opacity={0.85} />
            <circle cx={1100} cy={880} r={30 + st * 18} fill="none" stroke={C.rojo} strokeWidth={8} opacity={0.4 + st * 0.6} />
          </svg>
        </>;
      })()}
      <Chip t={t} t0={685.91} t1={690.0} text="YOU STAB" color={C.rojo} x={180} y={140} size={60} />
      <Chip t={t} t0={686.53} t1={690.0} text="LOW" color={C.ambar} tinta={C.noche} x={540} y={140} size={60} />
      <Chip t={t} t0={687.41} t1={690.0} text="FROM BEHIND YOUR SHIELD" color={C.violeta} x={180} y={250} size={52} />
      <Chip t={t} t0={690.34} text="SOMEONE YOU CAN'T SEE..." color="#2a1530" x={180} y={140} size={52} />
      <Chip t={t} t0={691.53} text="STABS BACK" color={C.rojo} x={180} y={250} size={60} />
    </Escena>

    {/* 169 · la primera fila se agota en minutos, así que rotan */}
    <Escena t={t} t0={692.98} t1={696.9} zoom={0.02} entra="corte" golpes={[693.86, 694.63, 696.12]}>
      <Valle t={t} hora="tarde" />
      {[0, 1].map((i) => <Soldadito key={i} x={1620 + i * 110} y={PIE - i * 30} s={1.3} t={t} seed={270 + i} enemigo avanza={1} />)}
      {(() => { const c = prog(t, 693.3, 695.4); return <>
        <Yo x={540} y={PIE} h={540} t={t} expr={t > 694.5 ? "triste" : "enojado"} bD={60 - c * 50} cD={20} bI={30 - c * 20} manoD={ESPADA} inclina={c * 16 + Math.sin(t * 9) * c * 2} ladea={c * 8} />
        <Escudo x={720 - c * 20} y={PIE - 170 + c * 60} s={0.58} rot={c * 22} />
      </>; })()}
      <Emote t={t} t0={693.9} tipo="sudor" {...L(540, PIE, 540)} s={1.2} />
      <Barra x={1200} y={340} w={700} f={1 - prog(t, 693.4, 695.4)} rotulo="STAMINA" der={`MIN ${Math.round(interpolate(t, [693.4, 695.4], [0, 15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}`} />
      <Chip t={t} t0={693.86} text="EXHAUSTED" color={C.rojo} x={180} y={140} size={60} />
      <Chip t={t} t0={694.63} text="IN MINUTES" color={C.ambar} tinta={C.noche} x={850} y={140} size={60} />
      <Grande t={t} t0={696.12} text="ROTATE!" x={1200} y={590} size={130} color={C.lima} borde="#2a1530" />
    </Escena>

    {/* 170 · los de atrás pasan adelante y vos atrás a respirar (vista de costado, barras de cansancio) */}
    <Escena t={t} t0={696.9} t1={700.75} zoom={0.02} entra="corte" golpes={[698.15, 699.41, 699.88]}>
      <Valle t={t} hora="tarde" />
      {[0, 1, 2].map((i) => <Soldadito key={i} x={1530 + i * 100} y={PIE - (i % 2) * 30} s={1.4} t={t} seed={280 + i} enemigo avanza={1.5} />)}
      {[0, 1].map((i) => <Persona key={i} x={260 + i * 170} y={PIE - 30} h={400} t={t} seed={402 + i} casco="legion" ropa={compa(402 + i)} expr="neutro" mira={0.6} />)}
      {(() => {
        const kf = prog(t, 697.5, 699.1), kb = prog(t, 697.9, 699.5);
        const xf = interpolate(kf, [0, 1], [760, 1260]), xb = interpolate(kb, [0, 1], [1260, 760]);
        const fb = t < 699.5 ? 0.12 : 0.12 + prog(t, 699.6, 700.7) * 0.6;
        return <>
          <Persona x={xf} y={PIE - 15} h={480} t={t} seed={401} casco="legion" ropa={compa(401)} expr="enojado" camina={kf > 0 && kf < 1 ? 1.4 : 0} bD={70} manoD={ESPADA} mira={0.8} />
          <MiniBarra x={xf} y={PIE - 15 - 540} f={1} />
          <Yo x={xb} y={PIE} h={500} t={t} expr={t > 699.6 ? "feliz" : "triste"} flip={kb > 0 && kb < 1} camina={kb > 0 && kb < 1 ? 1.4 : 0} inclina={t > 699.6 ? 6 + Math.sin(t * 4) * 5 : 12} bD={20} manoD={ESPADA} />
          <MiniBarra x={xb} y={PIE - 560} f={fb} />
          {t > 699.6 && <Emote t={t} t0={699.6} tipo="sudor" {...L(xb, PIE, 500)} />}
        </>;
      })()}
      <div style={{ position: "absolute", left: 1260 - 120, top: 1000, width: 240, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill" }}>FRONT LINE</div>
      <div style={{ position: "absolute", left: 760 - 120, top: 1000, width: 240, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill" }}>SECOND LINE</div>
      <Chip t={t} t0={697.36} text="THE MEN BEHIND STEP FORWARD" color={C.violeta} x={180} y={140} size={48} />
      <Chip t={t} t0={699.15} text="YOU STEP BACK TO BREATHE" color={C.teal} tinta={C.noche} x={180} y={245} size={48} />
    </Escena>

    {/* 171 · ese sistema le ganó muchas batallas a Roma: vos levantás el águila */}
    <Escena t={t} t0={700.75} t1={703.24} zoom={0.02} entra="corte" golpes={[701.62, 702.34]}>
      <Valle t={t} />
      {[-2, -1, 1, 2].map((k) => <Persona key={k} x={960 + k * 270} y={PIE} h={440} t={t} seed={360 + k + 3} casco="legion" ropa={compa(360 + k + 3)} expr="feliz" {...pose("festejar", t + k * 0.15)} />)}
      <Aguila x={1017} y={298} s={0.75} />
      <Yo x={960} y={PIE} h={480} t={t} expr="feliz" bD={176} cD={4} salta={701.62} />
      <Particulas t={t} tipo="lluviaoro" n={36} seed={125} />
      {Array.from({ length: 10 }, (_, i) => { const t0 = 701.0 + i * 0.16; if (t < t0) return null; const x = i < 5 ? 260 + i * 90 : 1300 + (i - 5) * 90; return (
        <svg key={i} style={{ position: "absolute", left: x - 36, top: 300 - 36, transform: `scale(${ent(t, t0)})` }} width={72} height={72} viewBox="-36 -36 72 72">
          <path d="M -6 28 Q -30 10 -22 -24 M 6 28 Q 30 10 22 -24" stroke={C.oro} strokeWidth={9} fill="none" strokeLinecap="round" />
          {[-16, -2, 12].map((yy) => <g key={yy}><ellipse cx={-24} cy={yy} rx={9} ry={5} fill={C.oro} transform={`rotate(-40 -24 ${yy})`} /><ellipse cx={24} cy={yy} rx={9} ry={5} fill={C.oro} transform={`rotate(40 24 ${yy})`} /></g>)}
        </svg>
      ); })}
      <Grande t={t} t0={701.62} text="A LOT OF BATTLES WON" x={960} y={150} size={84} color="#fff" borde="#7a3d14" />
    </Escena>

    {/* 172 · pero cuando fallaba, fallaba del todo: la pared de escudos se rompe */}
    <Escena t={t} t0={703.24} t1={706.03} zoom={0.02} entra="corte" golpes={[703.6, 704.81]}>
      <Valle t={t} hora="tarde" />
      <AbsoluteFill style={{ background: `rgba(18,6,26,${0.15 + prog(t, 704.5, 705.2) * 0.35})` }} />
      {[-2, -1, 0, 1, 2].map((k) => {
        const r = prog(t, 704.6, 705.3);
        const x = 960 + k * 200 + (k === 0 ? 0 : Math.sign(k) * r * 120);
        const yo = k === 0;
        return (
          <React.Fragment key={k}>
            {yo ? <Yo x={x} y={PIE} h={480} t={t} expr={t > 704.6 ? "miedo" : "enojado"} salta={704.65} bD={t > 704.6 ? 150 : 20} bI={t > 704.6 ? 150 : 20} cD={30} cI={30} />
              : <Persona x={x} y={PIE} h={440} t={t} seed={366 + k} casco="legion" ropa={compa(366 + k)} expr={t > 704.6 ? "miedo" : "enojado"} inclina={Math.sign(k) * r * 22} />}
            {(() => { const fx = (k + (k === 0 ? 0.3 : 0)) * r * 260, fy = -Math.sin(r * Math.PI) * 240 + r * r * 260; return <Escudo x={x + fx} y={PIE - 150 + fy} s={0.56} rot={r * (k * 70 + 40)} op={1 - r * 0.5} />; })()}
          </React.Fragment>
        );
      })}
      {t > 704.25 && t < 704.7 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[-2, -1, 0, 1, 2].map((k) => <path key={k} d={`M ${960 + k * 200 - 30} ${PIE - 240} l 30 50 l -20 30 l 40 60 l -10 40`} stroke="#2a1530" strokeWidth={8} fill="none" strokeDasharray={260} strokeDashoffset={260 * (1 - prog(t, 704.25, 704.5))} />)}</svg>}
      <GrandeHasta t={t} t0={703.6} hasta={704.81} text="WHEN IT FAILED..." x={960} y={190} size={110} color="#fff" borde="#2a1530" />
      <Grande t={t} t0={704.81} text="COMPLETELY" x={960} y={190} size={150} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 173 · Roma lo aprendió por las malas, mucho antes de tu época (el centurión y la línea de tiempo) */}
    <Escena t={t} t0={706.03} t1={709.25} zoom={0.02} entra="corte" golpes={[706.93, 708.47]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Persona x={330} y={PIE} h={600} t={t} seed={65} ropa={CENTURION} viejo casco="centurion" expr="triste" habla bD={100} cD={20} />
      {(() => {
        const m = prog(t, 707.8, 708.8);
        const xm = interpolate(m, [0, 1], [1600, 720]);
        return (
          <div style={{ position: "absolute", left: 600, top: 250, width: 1150, height: 200, borderRadius: 24, background: "#8a5a2a", border: "8px solid #3b230f", boxShadow: "0 10px 0 rgba(20,10,30,.35)" }}>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1150} height={200}>
              <line x1={110} y1={120} x2={1040} y2={120} stroke="#f6e3b4" strokeWidth={10} strokeLinecap="round" />
              {Array.from({ length: 11 }, (_, i) => <line key={i} x1={110 + i * 93} y1={104} x2={110 + i * 93} y2={136} stroke="#f6e3b4" strokeWidth={6} />)}
              <circle cx={xm - 600} cy={120} r={22} fill={m < 1 ? C.oro : C.rojo} stroke="#fff" strokeWidth={6} />
              {m > 0 && m < 1 && <path d={`M ${xm - 600 + 30} 120 L ${1000} 120`} stroke={C.oro} strokeWidth={6} strokeDasharray="14 12" />}
              <text x={110} y={70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#fff">216 BC</text>
              <text x={1000} y={70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill={C.oro}>YOU</text>
              <text x={555} y={186} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#f6e3b4" opacity={prog(t, 707.77, 708.1)}>LONG BEFORE YOUR TIME</text>
            </svg>
          </div>
        );
      })()}
      <Yo x={1000} y={PIE} h={440} t={t} expr="miedo" mira={-0.4} miraY={-0.6} {...pose("escribir", t, 0.8)} />
      {[0, 1].map((k) => <Persona key={k} x={1280 + k * 260} y={PIE} h={420} t={t} seed={370 + k} casco="legion" ropa={compa(370 + k)} expr="miedo" mira={-0.6} miraY={-0.5} />)}
      <Grande t={t} t0={706.37} text="THE HARD WAY" x={1170} y={135} size={96} color="#e8d8b8" borde="#2a1d14" />
    </Escena>

    {/* 174-175 · 216 a. C., Cannas: Aníbal (en su elefante) rodeó un ejército romano enorme y lo apretó */}
    <Escena t={t} t0={709.25} t1={717.99} zoom={0.02} entra="corte" golpes={[709.39, 712.19, 714.45, 714.85, 716.91]}>
      {t < 713.6 ? <>
        <MapaPuntos t={t} pulsa={["CANNAE"]} t0Pulsa={709.3} vuela={{ n: "CANNAE", z: 2.4, t: [710.4, 712.2] }} />
        {(() => { const p = enMapa(t, "CANNAE", [710.4, 712.2], 2.4); return <Pin x={p.x} y={p.y - 10} t={t} t0={709.3} />; })()}
      </> : <>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 50%, #e2c98a, #c8b070 70%, #a8904e)" }} />
        {(() => {
          const sq = prog(t, 714.85, 717.6), sq2 = prog(t, 716.9, 717.9);
          const cx = 1100, cy = 560;
          const romW = 700 - sq2 * 220, romH = 280 - sq2 * 70;
          const rx = 520 - sq * 110, ry = 250 - sq * 40;
          return <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <rect x={cx - romW / 2} y={cy - romH / 2} width={romW} height={romH} rx={20} fill={C.rojo} stroke="#5e0f1d" strokeWidth={10} />
            {Array.from({ length: 48 }, (_, i) => <circle key={i} cx={cx - romW / 2 + 36 + (i % 12) * ((romW - 72) / 11)} cy={cy - romH / 2 + 36 + Math.floor(i / 12) * ((romH - 72) / 3)} r={9} fill="#ffd0c0" />)}
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#2f6df6" strokeWidth={60 + sq2 * 20} strokeDasharray={sq < 1 ? `${3400 * Math.max(0.02, sq)} 9999` : undefined} opacity={t > 714.85 ? 1 : 0} />
            {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2 + 0.3; return <path key={i} d="M 0 -34 L 56 0 L 0 34" fill="#2f6df6" transform={`translate(${cx + Math.cos(a) * (rx + 70)} ${cy + Math.sin(a) * (ry + 60)}) rotate(${(a * 180) / Math.PI + 180})`} opacity={t > 714.85 ? 1 : 0} />; })}
          </svg>;
        })()}
        <Num t={t} t0={713.7} t1={714.6} de={0} a={86000} x={1100} y={560} size={70} pre="ROMANS: " />
      </>}
      <Persona x={330} y={PIE - 100} h={330} t={t} seed={375} ropa={ANIBAL} expr="feliz" {...(t > 714.85 ? { bD: 120 + Math.sin(t * 6) * 15, bI: 120 + Math.sin(t * 6) * 15, cD: 70, cI: 70 } : { bD: 150, cD: 30 })} />
      <Elefante x={320} y={PIE} s={0.8} t={t} />
      {t < 713.6 && <Num t={t} t0={709.39} t1={710.0} de={300} a={216} x={1520} y={190} size={120} suf=" BC" />}
      <Chip t={t} t0={712.19} t1={714.6} text="CANNAE · SOUTHERN ITALY" color={C.violeta} x={180} y={140} size={52} />
      <Chip t={t} t0={714.45} text="HANNIBAL" color="#2f6df6" x={180} y={360} size={58} />
      <Chip t={t} t0={714.85} text="SURROUNDED" color="#2a1530" x={180} y={140} size={60} />
      <Chip t={t} t0={716.91} text="...AND SQUEEZED" color={C.rojo} x={1000} y={140} size={60} />
    </Escena>

    {/* 176 · los del medio, tan apretados que no podían ni levantar la espada */}
    <Escena t={t} t0={717.99} t1={722.05} zoom={0.02} entra="corte" golpes={[719.43, 721.09]}>
      <Valle t={t} hora="tarde" />
      {(() => {
        const apri = prog(t, 718.3, 720.3);
        const filas = [[830, 360], [900, 400], [PIE, 440]] as const;
        return <>
          {[0, 1].map((lado) => Array.from({ length: 3 }, (_, i) => <Soldadito key={`${lado}${i}`} x={lado ? interpolate(apri, [0, 1], [1680, 1560]) - i * 70 : interpolate(apri, [0, 1], [260, 380]) + i * 70} y={PIE - i * 40} s={1.6} t={t} seed={290 + i + lado * 3} enemigo avanza={2} color="#1a3a90" />))}
          {filas.map(([y, h], r) => Array.from({ length: 6 }, (_, c) => {
            const gap = 230 - apri * 75 - r * 5;
            const x = 960 + (c - 2.5) * gap + (r % 2 ? gap / 2 : 0) * 0.3;
            const yo = r === 2 && c === 2;
            if (yo) return null;
            return <Persona key={`${r}-${c}`} x={x} y={y} h={h} t={t} seed={240 + r * 6 + c} casco="legion" ropa={compa(240 + r * 6 + c)} expr="triste" bD={0} bI={0} inclina={Math.sin(t * 4 + c + r) * 3} />;
          }))}
          {(() => { const gap = 230 - apri * 75 - 10; const x = 960 + (2 - 2.5) * gap; const tira = t > 720.4 ? Math.max(0, Math.sin((t - 720.4) * 14)) : 0; return <>
            <Yo x={x} y={PIE} h={460} t={t} expr="miedo" mira={-0.3} miraY={-0.6} bD={10 + tira * 25} cD={5} manoD={ESPADA} inclina={Math.sin(t * 30) * 1.5} />
            <Emote t={t} t0={719.6} tipo="susto" {...L(x, PIE, 460)} />
            {t > 720.6 && <svg style={{ position: "absolute", left: x + 110, top: PIE - 680, transform: `scale(${ent(t, 720.6)})` }} width={110} height={170}><path d="M 55 160 L 55 30 M 20 60 L 55 20 L 90 60" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M 10 30 L 100 140 M 100 30 L 10 140" stroke={C.rojo} strokeWidth={14} strokeLinecap="round" /></svg>}
          </>; })()}
        </>;
      })()}
      <Chip t={t} t0={718.53} t1={719.25} text="THE MIDDLE" color={C.violeta} x={180} y={140} size={58} />
      <Chip t={t} t0={719.43} t1={720.4} text="PACKED SO TIGHTLY..." color={C.rojo} x={180} y={140} size={56} />
      <Chip t={t} t0={720.61} text="NO ROOM TO RAISE A SWORD" color={C.ambar} tinta={C.noche} x={180} y={140} size={52} />
    </Escena>

    {/* 177 · unos 50.000 romanos murieron en una sola tarde (cada casco = 1.000 hombres; el sol cae) */}
    <Escena t={t} t0={722.05} t1={729.67} zoom={0.02} entra="corte" golpes={[723.57, 725.71, 727.63]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3a1030,#8c1d34 45%,#e0603a 80%,#ffb070)" }} />
      <svg style={{ position: "absolute", left: 1600 - 110, top: interpolate(t, [722, 729.6], [230, 470]) - 110 }} width={220} height={220}><circle cx={110} cy={110} r={100} fill="#ffd27a" opacity={0.9} /></svg>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d="M -100 640 Q 500 590 1000 620 T 2100 600 L 2100 1080 L -100 1080 Z" fill="#5a1a2a" /><path d="M -100 760 L 2100 760 L 2100 1080 L -100 1080 Z" fill="#3a1020" /></svg>
      {Array.from({ length: 50 }, (_, i) => { const c = i % 10, r = Math.floor(i / 10); const td = 723.6 + (i / 50) * 1.9; return <Casquito key={i} x={600 + c * 110 + (r % 2) * 40} y={680 + r * 62} s={1.1} cae={Math.min(1, Math.max(0, (t - td) / 0.25))} color={t > td ? "#8a7a7a" : "#e9a92a"} />; })}
      <Persona x={300} y={PIE} h={480} t={t} seed={77} casco="no" expr="triste" ladea={10} inclina={10} miraY={0.6} bD={40} cD={70} manoD={<g transform="rotate(150) translate(0 -40) scale(0.7)"><path d="M -96 30 Q -100 -92 0 -92 Q 100 -92 96 30 L 108 40 L -108 40 Z" fill="#e9a92a" /></g>} />
      <Chip t={t} t0={722.29} text="BY THE ANCIENT ACCOUNTS" color={C.violeta} x={180} y={140} size={50} />
      <Num t={t} t0={723.57} t1={725.4} de={0} a={50000} x={1050} y={330} size={160} />
      <Chip t={t} t0={724.37} t1={725.2} text="ROMANS DIED" color={C.rojo} x={1050} y={500} centro size={56} />
      <Chip t={t} t0={725.43} t1={727.4} text="IN ONE AFTERNOON" color={C.ambar} tinta={C.noche} x={1050} y={500} centro size={56} />
      <Chip t={t} t0={727.63} text="ONE OF THE BLOODIEST DAYS IN HISTORY" color="#2a0a1e" x={1050} y={500} centro size={46} />
      <div style={{ position: "absolute", left: 600, top: 1000, fontFamily, fontWeight: 700, fontSize: 30, color: "#f6e3b4" }}>EACH HELMET = 1,000 MEN</div>
    </Escena>

    {/* 178 · todo centurión sabía el nombre; la lección: que nunca te rodeen (pizarra + vos anotando) */}
    <Escena t={t} t0={729.67} t1={734.83} zoom={0.02} entra="corte" golpes={[730.81, 732.11, 733.75]}>
      <Campamento t={t} tropa={false} />
      <Persona x={330} y={PIE} h={600} t={t} seed={60} ropa={CENTURION} casco="centurion" expr="enojado" habla bD={95 + Math.sin(t * 3) * 6} cD={10} manoD={<rect x={-6} y={0} width={12} height={150} rx={5} fill="#6b3a1f" />} />
      <div style={{ position: "absolute", left: 560, top: 230, width: 760, height: 450, borderRadius: 20, background: "#2c3a2e", border: "14px solid #8a5a2a", boxShadow: "0 12px 0 rgba(20,10,30,.35)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 48, color: "#f2efe6" }}>CANNAE</div>
        <svg style={{ position: "absolute", left: 230, top: 70 }} width={280} height={170}>
          <rect x={90} y={55} width={100} height={60} rx={8} fill={C.rojo} />
          <ellipse cx={140} cy={85} rx={120} ry={70} fill="none" stroke="#7fb0ff" strokeWidth={14} strokeDasharray={`${prog(t, 730.2, 731.2) * 620} 999`} />
          {t > 731.3 && <path d="M 100 50 L 180 120 M 180 50 L 100 120" stroke="#fff" strokeWidth={12} strokeLinecap="round" />}
        </svg>
        {t > 732.11 && <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: "#f7c548", transform: `scale(${ent(t, 732.11)})` }}>THE LESSON:</div>}
        {t > 733.11 && <div style={{ position: "absolute", left: 0, right: 0, top: 310, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 50, lineHeight: 1.1, color: "#fff", transform: `scale(${ent(t, 733.11)})` }}>NEVER LET THEM<br /><span style={{ color: t > 733.75 ? "#ff8a9a" : "#fff" }}>SURROUND YOU</span></div>}
      </div>
      <Yo x={1500} y={PIE} h={460} t={t} expr="miedo" mira={-0.6} {...pose("escribir", t, 1.2)} />
      <svg style={{ position: "absolute", left: 1500 - 30, top: PIE - 300 }} width={110} height={80}><rect x={0} y={0} width={110} height={80} rx={8} fill="#a8622c" /><rect x={10} y={10} width={90} height={60} rx={4} fill="#3a2a1a" />{[0, 1, 2].map((i) => <line key={i} x1={20} y1={24 + i * 16} x2={20 + Math.min(70, Math.max(0, (t - 731 - i) * 50))} y2={24 + i * 16} stroke="#e8d8b8" strokeWidth={4} />)}</svg>
      <Persona x={1720} y={PIE} h={400} t={t} seed={381} casco="legion" ropa={compa(381)} expr="miedo" mira={-0.7} />
      <Chip t={t} t0={730.4} text="EVERY CENTURION KNEW THE NAME" color={C.violeta} x={180} y={140} size={48} />
    </Escena>

    {/* 179 · año 9: el gobernador Varo mete tres legiones en el bosque de Teutoburgo (vos marchás en la columna) */}
    <Escena t={t} t0={734.83} t1={740.49} zoom={0.02} entra="corte" golpes={[735.23, 737.19, 738.43, 739.63]}>
      {t < 737.0 ? <>
        <MapaPuntos t={t} pulsa={["TEUTOBURG"]} t0Pulsa={734.9} vuela={{ n: "TEUTOBURG", z: 2.4, t: [735.0, 736.8] }} />
        {(() => { const p = enMapa(t, "TEUTOBURG", [735.0, 736.8], 2.4); return <Pin x={p.x} y={p.y - 10} t={t} t0={734.9} />; })()}
        <Persona x={330} y={PIE} h={460} t={t} seed={71} ropa={VARO} casco="centurion" expr="feliz" bD={120} cD={20} habla />
        <Num t={t} t0={735.23} t1={735.6} de={1} a={9} x={1520} y={190} size={110} pre="AD " />
        <Chip t={t} t0={735.99} text="GOVERNOR VARUS" color={C.violeta} x={180} y={390} size={50} />
      </> : <>
        <Bosque t={t} luz={0.7} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d="M -100 900 Q 900 860 2100 905 L 2100 1010 Q 900 980 -100 1010 Z" fill="#6a4a2a" /></svg>
        {Array.from({ length: 12 }, (_, i) => { const x = 700 + i * 80 + (t - 737) * 40; return <Soldadito key={i} x={x} y={905 - (i % 2) * 12} s={0.6} t={t} seed={390 + i} avanza={1} />; })}
        {(["XVII", "XVIII", "XIX"] as const).map((n, i) => <Signum key={n} x={760 + i * 300 + (t - 737) * 40} y={720} s={0.38} n={n} pulso={1 + 0.12 * Math.exp(-Math.max(0, t - (737.19 + i * 0.16)) * 6) * (t > 737.19 + i * 0.16 ? 1 : 0)} />)}
        <Persona x={1560} y={PIE - 20} h={420} t={t} seed={71} ropa={VARO} casco="centurion" expr="feliz" camina={1} bD={60} />
        <Yo x={interpolate(t, [737, 740.5], [360, 600])} y={PIE} h={480} t={t} expr="neutro" camina={1.2} mira={0.6} manoD={<rect x={-6} y={-200} width={12} height={360} rx={5} fill="#8a5a2a" />} bD={20} />
        <Chip t={t} t0={737.19} text="3 LEGIONS" color={C.rojo} x={180} y={140} size={58} />
        <Grande t={t} t0={738.43} text="TEUTOBURG FOREST" x={1180} y={150} size={80} color="#fff" borde="#1d3a24" />
      </>}
    </Escena>

    {/* 180 · llovió; el camino, un sendero de barro angosto entre árboles y pantanos */}
    <Escena t={t} t0={740.49} t1={745.11} zoom={0.02} entra="corte" golpes={[740.61, 742.13, 742.49, 744.13]}>
      <Bosque t={t} luz={0.45} />
      {[180, 420, 1500, 1740].map((x, i) => <Arbol key={x} x={x} y={560} s={1} color={i % 2 ? "#14281a" : "#1a3220"} alto={900} />)}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d={`M -100 ${900 - prog(t, 742.1, 742.9) * 10} Q 960 ${880 + prog(t, 742.1, 742.9) * 20} 2100 ${900 - prog(t, 742.1, 742.9) * 10} L 2100 1010 L -100 1010 Z`} fill="#5a3a1a" />
        <ellipse cx={330} cy={1040} rx={240} ry={40} fill="#2a4a3a" /><ellipse cx={1580} cy={1040} rx={220} ry={36} fill="#2a4a3a" />
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={500 + i * 330} cy={960 + (i % 2) * 20} rx={70} ry={12} fill="#3a2410" />)}
      </svg>
      <Lluvia t={t} n={150} angulo={20} op={0.5} />
      {(() => { const x = interpolate(t, [740.5, 745.1], [820, 1060]); return <>
        <Persona x={x - 520} y={PIE - 10} h={440} t={t} seed={412} casco="legion" ropa={compa(412)} expr="triste" camina={0.9} {...pose("cargar", t, 0.3)} inclina={8 + Math.sin(t * 3) * 6} />
        <Persona x={x - 260} y={PIE} h={460} t={t} seed={413} casco="legion" ropa={compa(413)} expr="triste" camina={0.9} inclina={Math.sin(t * 5) * 10} />
        <Yo x={x} y={PIE} h={480} t={t} expr="triste" camina={0.9} inclina={6 + Math.sin(t * 4) * 4} miraY={0.5} bI={30} bD={30} />
        {[0, 1].map((i) => { const k = ((t * 1.8 + i * 0.5) % 1); return <svg key={i} style={{ position: "absolute", left: x - 60 + i * 60, top: PIE - 40 - k * 40, opacity: 1 - k }} width={60} height={40}><circle cx={10} cy={20} r={8} fill="#5a3a1a" /><circle cx={34} cy={10} r={6} fill="#5a3a1a" /><circle cx={50} cy={26} r={5} fill="#5a3a1a" /></svg>; })}
      </>; })()}
      {(() => { const w = interpolate(prog(t, 742.13, 743.2), [0, 1], [640, 170]); return t > 742.0 && (
        <div style={{ position: "absolute", left: 960 - 340, top: 300, width: 680, height: 110, transform: `scale(${ent(t, 742.0)})` }}>
          <div style={{ textAlign: "center", fontFamily, fontWeight: 700, fontSize: 38, color: "#fff", WebkitTextStroke: "7px #2a1530", paintOrder: "stroke fill" }}>ROAD WIDTH</div>
          <svg style={{ position: "absolute", left: 340 - w / 2, top: 50 }} width={w} height={60} overflow="visible"><rect x={0} y={14} width={w} height={32} rx={10} fill="#8a5a2a" stroke="#fff" strokeWidth={6} /><path d={`M 6 30 L 30 10 L 30 50 Z M ${w - 6} 30 L ${w - 30} 10 L ${w - 30} 50 Z`} fill="#fff" /></svg>
        </div>
      ); })()}
      <Chip t={t} t0={740.61} text="IT RAINED" color={C.teal} tinta={C.noche} x={180} y={140} size={58} />
      <Chip t={t} t0={742.13} text="NARROW · MUDDY" color={C.tierra} x={180} y={240} size={54} />
      <Chip t={t} t0={743.53} text="TREES & SWAMPS" color={C.violeta} x={1180} y={140} size={54} />
    </Escena>

    {/* 181 · guerreros germanos, liderados por alguien entrenado por Roma, atacaron por todos lados tres días */}
    <Escena t={t} t0={745.11} t1={751.87} zoom={0.02} entra="corte" golpes={[745.61, 747.55, 749.17, 751.07]}>
      <Bosque t={t} luz={0.55} />
      <Lluvia t={t} n={110} angulo={20} op={0.4} />
      {t < 748.9 ? <>
        {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={900 + i * 150} y={880 - (i % 2) * 30} s={0.9} t={t} seed={262 + i} enemigo avanza={1} color="#1e3a22" />)}
        <Yo x={380} y={PIE} h={480} t={t} expr="miedo" mira={0.9} bD={60} cD={60} bI={40} cI={60} />
        <Escudo x={530} y={PIE - 160} s={0.58} rot={6} />
        <Persona x={1320} y={PIE} h={580} t={t} seed={70} ropa={GERMANO} expr="enojado" flip bD={150 + Math.sin(t * 4) * 10} cD={20} manoD={<g><rect x={-8} y={-220} width={16} height={400} rx={6} fill="#8a5a2a" /><path d="M -18 -220 L 0 -280 L 18 -220 Z" fill="#c9ccd6" /></g>} />
        <svg style={{ position: "absolute", left: 1290, top: PIE - 300 }} width={60} height={60}><circle cx={30} cy={30} r={26} fill={C.oro} stroke="#7a3d14" strokeWidth={5} /><text x={30} y={40} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill="#7a3d14">SPQR</text></svg>
        <Chip t={t} t0={745.29} text="GERMAN WARRIORS" color="#3a5a2a" x={180} y={140} size={56} />
        <Chip t={t} t0={746.47} text="LED BY ARMINIUS" color={C.violeta} x={1320} y={150} centro size={52} />
        <Chip t={t} t0={747.55} text="TRAINED BY ROME ITSELF" color={C.rojo} x={1320} y={255} centro size={48} />
      </> : <>
        {(() => { const k = prog(t, 749.0, 751.6); return Array.from({ length: 14 }, (_, i) => { const a = Math.PI + (i / 13) * Math.PI; const rx = 780 - k * 250, ry = 220 - k * 60; return { i, x: 960 + Math.cos(a) * rx, y: 920 + Math.sin(a) * ry, s: 1.2 + Math.sin(a) * 0.45 }; }).sort((p, q) => p.y - q.y).map(({ i, x, y, s }) => <Soldadito key={i} x={x} y={y} s={s} t={t} seed={270 + i} enemigo avanza={1.5} color="#1e3a22" />); })()}
        {[-1, 1].map((d) => <Soldadito key={d} x={960 + d * 170} y={PIE - 10} s={1.25} t={t} seed={281 + d} cae={d > 0 ? 750.4 : undefined} />)}
        <Yo x={960} y={PIE} h={480} t={t} expr="miedo" mira={Math.sin(t * 2.5)} bD={150} bI={150} cD={40} cI={40} />
        <Escudo x={960} y={PIE - 590} s={0.55} rot={90 + Math.sin(t * 3) * 6} />
        <Grande t={t} t0={749.17} text="FROM EVERY SIDE" x={860} y={190} size={90} color="#fff" borde={C.rojo} />
        <Num t={t} t0={750.79} t1={751.3} de={1} a={3} x={1600} y={190} size={86} color={C.oro} pre="DAY " />
      </>}
    </Escena>

    {/* 182 · sin lugar para formar, ni para rotar, ni campamento al que retirarse */}
    <Escena t={t} t0={751.87} t1={756.77} zoom={0.02} entra="corte" golpes={[753.07, 754.23, 755.93]}>
      <Bosque t={t} luz={0.35} />
      <AbsoluteFill style={{ background: "rgba(18,6,26,.35)" }} />
      {[560, 860, 1100, 1380].map((x) => <div key={x} style={{ position: "absolute", left: x - 26, top: 480, width: 52, height: 520, background: "#2a1a10", borderRadius: 8 }} />)}
      <Persona x={700} y={PIE} h={420} t={t} seed={415} casco="legion" ropa={compa(415)} expr="miedo" inclina={t > 752.2 ? Math.max(0, Math.sin((t - 752.2) * 6)) * -10 : 0} mira={-0.6} />
      <Yo x={980} y={PIE} h={440} t={t} expr="miedo" flip={t > 753.7 && Math.floor((t - 753.7) * 2.2) % 2 === 0} mira={t > 754.9 ? Math.sin(t * 3) : 0.4} />
      {t > 754.95 && <Emote t={t} t0={754.95} tipo="preg" {...L(980, PIE, 440)} />}
      <Persona x={1240} y={PIE} h={420} t={t} seed={416} casco="legion" ropa={compa(416)} expr="triste" bD={20} inclina={6} />
      {([[752.11, "NO ROOM TO", "FORM A LINE", 450], [753.67, "NO ROOM TO", "ROTATE", 960], [754.93, "NO", "CAMP TO RETREAT TO", 1470]] as const).map(([t0, cab, txt, x], i) => t > t0 && (
        <div key={txt} style={{ position: "absolute", left: x - 230, top: 110, width: 460, height: 330, borderRadius: 26, background: "#2d1b69", border: "8px solid #fff", transform: `scale(${ent(t, t0)})` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: "#ff8a9a" }}>{cab}</div>
          <svg style={{ position: "absolute", left: 160, top: 76 }} width={140} height={140} viewBox="-100 -100 200 200">
            {i === 0 && [-60, -20, 20, 60].map((cx) => <rect key={cx} x={cx - 14} y={-40} width={28} height={80} rx={8} fill={C.rojo} />)}
            {i === 1 && <><path d="M 60 -40 A 70 70 0 1 0 70 20" stroke="#fff" strokeWidth={16} fill="none" /><path d="M 40 -70 L 70 -30 L 22 -26 Z" fill="#fff" /></>}
            {i === 2 && <path d="M -80 60 L 0 -60 L 80 60 Z" fill="#c9a46a" />}
          </svg>
          <Tachado t={t} t0={t0 + 0.3} x={230} y={146} w={170} h={150} />
          <div style={{ position: "absolute", left: 14, right: 14, top: 238, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: "#fff" }}>{txt}</div>
        </div>
      ))}
    </Escena>

    {/* 183 · tres legiones enteras: la XVII, la XVIII y la XIX desaparecieron (cada una con sus hombres) */}
    <Escena t={t} t0={756.77} t1={762.05} zoom={0.02} entra="corte" golpes={[757.43, 758.51, 759.39, 760.05, 760.67]}>
      <Bosque t={t} luz={0.4} />
      <Lluvia t={t} n={90} angulo={20} op={0.35} />
      {(["XVII", "XVIII", "XIX"] as const).map((n, i) => {
        const x = 760 + i * 400, tf = 760.67 + i * 0.18, f = prog(t, tf, tf + 1.0);
        const tw = [758.51, 759.39, 760.05][i];
        const pul = 1 + (t > tw ? 0.14 * Math.exp(-(t - tw) * 6) : 0);
        const hombres = Math.round(5000 * (1 - f));
        return (
          <React.Fragment key={n}>
            <Signum x={x} y={620} s={0.55} n={n} op={1 - f * 0.9} dy={f * 160} pulso={pul} />
            {Array.from({ length: 8 }, (_, j) => <div key={j} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - prog(t, tf + j * 0.06, tf + j * 0.06 + 0.4) }}><Soldadito x={x - 150 + (j % 4) * 100} y={900 + Math.floor(j / 4) * 70} s={0.55} t={t} seed={500 + i * 10 + j} /></div>)}
            <div style={{ position: "absolute", left: x - 110, top: 300, width: 220, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 38, color: f > 0.5 ? "#8a8aa8" : "#fff", WebkitTextStroke: "7px #12061a", paintOrder: "stroke fill" }}>{hombres.toLocaleString("en-US")} MEN</div>
          </React.Fragment>
        );
      })}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 55%, rgba(170,180,200,${prog(t, 760.6, 761.8) * 0.55}) 85%)` }} />
      <Yo x={290} y={PIE} h={480} t={t} expr={t > 760.7 ? "triste" : "miedo"} mira={0.9} bD={20} cD={40} />
      <GrandeHasta t={t} t0={756.95} hasta={760.67} text="3 ENTIRE LEGIONS" x={1000} y={160} size={96} color="#fff" borde="#1d3a24" />
      <Grande t={t} t0={760.67} text="DISAPPEARED" x={1000} y={160} size={110} color="#8a9ad8" borde="#12061a" />
    </Escena>

    {/* 184 · entre 15.000 y 20.000 hombres; Varo se quitó la vida */}
    <Escena t={t} t0={762.05} t1={766.63} zoom={0.02} entra="corte" golpes={[762.73, 763.45, 765.37]}>
      <Bosque t={t} luz={0.3} />
      <AbsoluteFill style={{ background: "rgba(10,8,24,.4)" }} />
      <Num t={t} t0={762.73} t1={763.4} de={0} a={15000} x={600} y={270} size={130} />
      {t > 763.37 && <div style={{ position: "absolute", left: 930, top: 200, fontFamily, fontWeight: 700, fontSize: 130, color: "#fff", WebkitTextStroke: "10px #2a1530", paintOrder: "stroke fill" }}>–</div>}
      <Num t={t} t0={763.45} t1={764.1} de={15000} a={20000} x={1300} y={270} size={130} color={C.rojo} />
      {Array.from({ length: 20 }, (_, i) => { const td = i < 15 ? 762.75 + i * 0.044 : 763.45 + (i - 15) * 0.13; return t > td && <Casquito key={i} x={420 + i * 52} y={460} s={0.9} color={i < 15 ? "#e9a92a" : C.rojo} />; })}
      <Chip t={t} t0={764.15} text="MEN" color={C.violeta} x={940} y={570} centro size={56} />
      <div style={{ position: "absolute", left: 1400, top: 240, width: 60, height: 760, background: "#2a1a10", borderRadius: 10 }} />
      <Persona x={1480} y={PIE} h={460} t={t} seed={71} ropa={VARO} casco="centurion" expr="triste" ladea={14} inclina={10} miraY={0.8} bD={20} cD={80} opacity={1 - prog(t, 765.5, 766.5) * 0.85} />
      {t > 765.3 && <Gladius x={1460} y={PIE - 20} s={0.45} rot={100} t={t} t0={765.3} />}
      <Chip t={t} t0={765.09} text="VARUS KILLED HIMSELF" color="#2a1530" x={780} y={780} centro size={52} />
    </Escena>

    {/* 185 · Roma quedó tan conmovida que esos tres números nunca se volvieron a usar (Augusto contra la puerta) */}
    <Escena t={t} t0={766.63} t1={770.85} zoom={0.02} entra="corte" golpes={[767.31, 768.73, 769.31]}>
      <Interior t={t} tono="#e8d8b8" ventana={false} />
      <div style={{ position: "absolute", left: 110, top: 380, width: 180, height: 600, borderRadius: "90px 90px 0 0", background: "#6b3a1f", border: "12px solid #3b230f" }} />
      {(() => { const b = t > 767.0 ? Math.max(0, Math.sin((t - 767) * 7)) : 0; return <>
        <Persona x={420} y={PIE} h={600} t={t} seed={72} ropa={AUGUSTO} viejo expr="enojado" flip inclina={2 + b * 11} bD={130} cD={30} bI={20} />
        {b > 0.92 && <svg style={{ position: "absolute", left: 255, top: 470 }} width={80} height={80} viewBox="-40 -40 80 80"><path d="M 0 -36 L 9 -9 L 36 0 L 9 9 L 0 36 L -9 9 L -36 0 L -9 -9 Z" fill="#fff3a0" /></svg>}
      </>; })()}
      <Chip t={t} t0={767.9} text="&quot;VARUS, GIVE ME BACK MY LEGIONS!&quot;" color="#2a1530" x={640} y={440} size={40} />
      {(["XVII", "XVIII", "XIX"] as const).map((n, i) => (
        <div key={n} style={{ position: "absolute", left: 640 + i * 360, top: 580, width: 330, height: 200, transform: `scale(${ent(t, 766.8 + i * 0.15)})` }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 130, color: "#5a4a3a", textAlign: "center" }}>{n}</div>
          <Tachado t={t} t0={769.31 + i * 0.12} x={165} y={90} w={300} h={160} />
        </div>
      ))}
      <Chip t={t} t0={767.31} text="ROME WAS SO SHAKEN" color={C.violeta} x={220} y={140} size={54} />
      <Grande t={t} t0={769.31} text="NEVER USED AGAIN" x={1150} y={300} size={86} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 186 · seis años después un ejército romano volvió al bosque (vos al frente); Tácito lo cuenta */}
    <Escena t={t} t0={770.85} t1={776.49} zoom={0.02} entra="corte" golpes={[771.29, 773.19, 775.53]}>
      <Bosque t={t} luz={0.6} />
      <Particulas t={t} tipo="luciernagas" n={24} seed={129} />
      {(() => { const d = interpolate(t, [770.85, 776.5], [0, 320]); return <>
        <Persona x={250 + d} y={PIE - 50} h={380} t={t} seed={420} casco="legion" ropa={compa(420)} expr="miedo" camina={1.1} mira={0.6} />
        <Persona x={440 + d} y={PIE - 20} h={440} t={t} seed={421} casco="legion" ropa={compa(421)} expr="miedo" camina={1.1} mira={0.6} bD={20} />
        <Yo x={660 + d} y={PIE} h={500} t={t} expr="miedo" camina={1.1} mira={0.8} bD={128} cD={42} manoD={<Antorcha rot={170} t={t} />} />
      </>; })()}
      <Num t={t} t0={771.05} t1={771.5} de={0} a={6} x={1380} y={180} size={86} suf=" YEARS LATER" />
      {t > 774.1 && <div style={{ position: "absolute", left: 1280, top: 330, width: 460, height: 440, borderRadius: 26, background: "#f6e3b4", border: "9px solid #3b230f", overflow: "hidden", transform: `scale(${ent(t, 774.1)})`, boxShadow: "0 12px 0 rgba(10,5,20,.4)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, color: "#7a3d14" }}>TACITUS</div>
        <div style={{ position: "absolute", left: 30, top: 300, width: 400, height: 26, background: "#8a5a2a", borderRadius: 6 }} />
        <Persona x={180} y={400} h={300} t={t} seed={430} ropa={AUGUSTO} viejo expr="neutro" {...pose("escribir", t, 1.5)} />
        <svg style={{ position: "absolute", left: 250, top: 230 }} width={170} height={72}><rect x={0} y={0} width={170} height={70} rx={10} fill="#fff8ec" stroke="#c9a46a" strokeWidth={4} />{[0, 1, 2].map((i) => <line key={i} x1={14} y1={18 + i * 18} x2={14 + Math.min(140, Math.max(0, (t - 774.3 - i * 0.5) * 140))} y2={18 + i * 18} stroke="#2a1530" strokeWidth={4} />)}</svg>
      </div>}
      <Chip t={t} t0={772.57} text="A ROMAN ARMY RETURNED" color={C.violeta} x={180} y={140} size={52} />
      <Chip t={t} t0={774.17} text="TACITUS DESCRIBES..." color={C.ambar} tinta={C.noche} x={180} y={245} size={52} />
    </Escena>

    {/* 187-188 · huesos al aire, blancos; armas rotas y cráneos clavados en los troncos (la antorcha los descubre) */}
    <Escena t={t} t0={776.49} t1={786.91} zoom={0.02} entra="corte" golpes={[776.49, 778.01, 781.55, 782.89, 783.99, 784.63]}>
      <Bosque t={t} luz={0.5} />
      <AbsoluteFill style={{ background: "rgba(10,8,24,.35)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "#2e3a24" }} />
      {[1240, 1480, 1720].map((x) => <div key={x} style={{ position: "absolute", left: x - 34, top: 0, width: 68, height: 960, background: "linear-gradient(90deg,#3b2414,#5a3a20 60%,#3b2414)" }} />)}
      {(() => { const x = interpolate(t, [776.5, 786.9], [560, 1040]); return <>
        <div style={{ position: "absolute", left: x - 520, top: PIE - 1020, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,110,.42), rgba(255,160,80,.12) 45%, transparent 68%)" }} />
        <Huesos t={t} t0={776.6} n={16} x0={200} x1={1700} y={950} seed={2} />
        {t > 781.2 && <>
          <Gladius x={1150} y={940} s={0.5} rot={78} t={t} t0={781.3} />
          <Pilum x={1470} y={955} s={0.45} rot={-8} dobla={0.9} t={t} t0={781.45} />
          <Gladius x={1660} y={945} s={0.45} rot={-70} t={t} t0={781.6} />
        </>}
        {t > 784.5 && [1240, 1480, 1720].map((tx, i) => <React.Fragment key={tx}><Craneo x={tx} y={430 + (i % 2) * 70} s={0.45} t={t} t0={784.63 + i * 0.15} /><div style={{ position: "absolute", left: tx - 6, top: 400 + (i % 2) * 70, width: 12, height: 12, borderRadius: 6, background: "#8a93a3", opacity: t > 784.63 + i * 0.15 ? 1 : 0 }} /></React.Fragment>)}
        <Persona x={x - 270} y={PIE - 10} h={460} t={t} seed={422} casco="legion" ropa={compa(422)} expr="miedo" camina={t < 786 ? 0.9 : 0} mira={0.5} miraY={0.6} />
        <Yo x={x} y={PIE} h={520} t={t} expr={t > 784.7 ? "sorpresa" : "miedo"} camina={t < 786 ? 0.9 : 0} mira={t > 784.7 ? 0.9 : 0.4} miraY={t > 784.7 ? -0.6 : 0.7} bD={128} cD={42} manoD={<Antorcha rot={170} t={t} />} />
      </>; })()}
      <Chip t={t} t0={776.49} t1={780.95} text="BONES IN THE OPEN" color={C.violeta} x={180} y={140} size={56} />
      <Chip t={t} t0={778.01} t1={780.95} text="WHITE" color="#e8e8e8" tinta={C.noche} x={180} y={245} size={56} />
      <Chip t={t} t0={781.25} text="BROKEN WEAPONS" color={C.rojo} x={180} y={140} size={56} />
      <Chip t={t} t0={784.63} text="SKULLS NAILED TO THE TREES" color="#2a1530" x={180} y={245} size={52} />
    </Escena>

    {/* 189 · eso era una batalla: no gloria. Un bosque que guardó tus huesos seis años (vos levantás el casco oxidado) */}
    <Escena t={t} t0={786.91} t1={792.73} zoom={0.02} entra="corte" golpes={[788.15, 788.95, 791.79]}>
      <Bosque t={t} luz={0.7} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "#2e3a24" }} />
      <Huesos t={t} t0={786.0} n={10} x0={240} x1={1200} y={960} seed={5} />
      {(() => { const sube = prog(t, 787.0, 787.8); const bD = 30 + sube * 105, cD = 40 - sube * 10; return (
        <Yo x={1480} y={PIE} h={560} t={t} expr="triste" mira={0.5} miraY={-0.4 * sube} bD={bD} cD={cD} manoD={<CascoOxidado rot={bD + cD} />} />
      ); })()}
      <Grande t={t} t0={787.49} text="THAT IS A BATTLE" x={700} y={200} size={80} color="#fff" />
      <Grande t={t} t0={788.47} text="NOT GLORY." x={660} y={350} size={120} color={C.rojo} borde="#fff" />
      <Chip t={t} t0={790.59} text="A FOREST THAT KEPT YOUR BONES" color={C.violeta} x={660} y={520} centro size={44} />
      <Num t={t} t0={791.51} t1={791.9} de={0} a={6} x={660} y={660} size={90} color="#e8e8e8" suf=" YEARS" />
    </Escena>
  </>
);
