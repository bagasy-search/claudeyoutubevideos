// tz01 · componentes-concepto propios del video (vuelta 2 del director): globos de pensamiento con dibujo, llamadas
// tipo Awaken, cartel de neón, la toalla vista desde arriba, el corazón que late, megáfono vs pesa, vaho, multitudes, utilería.
// Pantalla = coordenadas del cuadro (hud). Mundo = SVG del set (medio / frente).
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig, random } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD, F_GLOBO } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { ACENTO, BLANCO_MANO, ORO } from "../tenzo/elenco";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const lerp = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], cl);
const TINTA = "#221c18";
const CREMA = "#f4efe6";

// ---------- globo de pensamiento con un DIBUJO adentro (children en coords 0..w × 0..h) ----------
export const Pensamiento: React.FC<{ x: number; y: number; w: number; h: number; desde: number; hasta?: number; cola: { x: number; y: number }; children?: React.ReactNode; fondo?: string }> = ({ x, y, w, h, desde, hasta, cola, children, fondo = CREMA }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 12, stiffness: 150 } });
  const o = hasta !== undefined ? lerp(f, hasta - 8, hasta, 1, 0) : 1;
  // burbujitas de la cola: del borde del globo a la cabeza
  const bx = x, by = y + h / 2;
  const id = "pz" + React.useId().replace(/:/g, "");
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[0, 1, 2].map((i) => {
          const t = 0.25 + i * 0.25;
          const r = 16 - i * 4;
          const a = lerp(f, desde + i * 3, desde + 6 + i * 3, 0, 1);
          return <circle key={i} cx={bx + (cola.x - bx) * t} cy={by + (cola.y - by) * t} r={r * a} fill={fondo} stroke={TINTA} strokeWidth={4} />;
        })}
        <g transform={`translate(${x},${y}) scale(${s}) translate(${-w / 2},${-h / 2})`}>
          <rect x={0} y={0} width={w} height={h} rx={Math.min(w, h) * 0.42} fill={fondo} stroke={TINTA} strokeWidth={5} />
          <svg x={0} y={0} width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="hidden"><defs><clipPath id={id}><rect x={2} y={2} width={w - 4} height={h - 4} rx={Math.min(w, h) * 0.42} /></clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></svg>
          <rect x={0} y={0} width={w} height={h} rx={Math.min(w, h) * 0.42} fill="none" stroke={TINTA} strokeWidth={5} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- llamada tipo Awaken: punto en el cuerpo → línea → rótulo ----------
export const Llamada: React.FC<{ px: number; py: number; lx: number; ly: number; texto: string; desde: number; hasta?: number; color?: string; tam?: number }> = ({ px, py, lx, ly, texto, desde, hasta, color = BLANCO_MANO, tam = 40 }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const t = lerp(f, desde, desde + 10, 0, 1);
  const o = hasta !== undefined ? lerp(f, hasta - 8, hasta, 1, 0) : 1;
  const izq = lx < px;
  const w = texto.length * tam * 0.66 + 50; // nunca se sale del cuadro
  lx = izq ? Math.max(lx, w + 40) : Math.min(lx, 1920 - w - 40);
  ly = Math.min(Math.max(ly, tam + 40), 1080 - tam - 40);
  const ex = px + (lx - px) * t, ey = py + (ly - py) * t;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <circle cx={px} cy={py} r={9 * Math.min(1, t * 3)} fill={color} />
        <circle cx={px} cy={py} r={18 * Math.min(1, t * 3)} fill="none" stroke={color} strokeWidth={3} opacity={0.6} />
        <line x1={px} y1={py} x2={ex} y2={ey} stroke={color} strokeWidth={4} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(${izq ? "-100%" : "0"},-50%) translateX(${izq ? -14 : 14}px)`, opacity: lerp(f, desde + 8, desde + 14, 0, 1), fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color, whiteSpace: "nowrap", background: "rgba(14,15,19,0.62)", padding: "6px 18px", borderRadius: 12 }}>{texto}</div>
    </AbsoluteFill>
  );
};

// ---------- texto grande arriba con caja (para que nunca choque con los pies) ----------
export const FraseCaja: React.FC<{ texto: string; desde: number; hasta?: number; y?: number; tam?: number; color?: string }> = ({ texto, desde, hasta, y = 120, tam = 58, color = CREMA }) => {
  const f = useF();
  if (f < desde) return null;
  const o = lerp(f, desde, desde + 10, 0, 1) * (hasta !== undefined ? lerp(f, hasta - 10, hasta, 1, 0) : 1);
  return (
    <div style={{ position: "absolute", left: "50%", top: y, transform: `translate(-50%, ${(1 - o) * 10}px)`, opacity: o, fontFamily: F_HUD, fontWeight: 500, fontSize: tam, color, whiteSpace: "nowrap", background: "rgba(12,13,16,0.6)", padding: "10px 34px", borderRadius: 18, letterSpacing: 1 }}>{texto}</div>
  );
};

// ---------- cartel de neón que se prende letra por letra (mundo) ----------
export const CartelNeon: React.FC<{ x: number; y: number; texto: string; sub?: string; desde: number; paso?: number; tam?: number; color?: string }> = ({ x, y, texto, sub, desde, paso = 4, tam = 54, color = "#9fd0ff" }) => {
  const f = useF();
  const letras = texto.split("");
  const ancho = letras.length * tam * 0.72;
  const fin = desde + letras.length * paso;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-ancho / 2 - 40} y={-tam - 30} width={ancho + 80} height={tam * (sub ? 2.2 : 1.4) + 40} rx={14} fill="#16181d" stroke="#2c3038" strokeWidth={5} />
      {f >= fin && <Halo x={0} y={-tam * 0.3} r={ancho * 0.8} color={color} fuerza={0.35} />}
      {letras.map((c, i) => {
        const t0 = desde + i * paso;
        const on = f >= t0 + 2 || (f >= t0 && (f - t0) % 2 === 0);
        // un titileo extra en la letra 3 (tubo viejo)
        const titila = i === 2 && f > fin && (f % 37 < 3);
        const lit = on && !titila;
        return (
          <g key={i}>
            <text x={-ancho / 2 + (i + 0.5) * tam * 0.72} y={0} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={tam} fill={lit ? "#eef7ff" : "#3a3f48"} stroke={lit ? color : "none"} strokeWidth={lit ? 3 : 0}>{c}</text>
            {/* chispa al prenderse */}
            {f >= t0 && f < t0 + 7 && c !== " " && Array.from({ length: 5 }).map((_, k) => {
              const a = random(`ch${i}${k}`) * Math.PI * 2, d = (f - t0) * 9;
              return <circle key={k} cx={-ancho / 2 + (i + 0.5) * tam * 0.72 + Math.cos(a) * d} cy={-tam * 0.35 + Math.sin(a) * d} r={3} fill="#fff4c8" opacity={1 - (f - t0) / 7} />;
            })}
          </g>
        );
      })}
      {sub && <text x={0} y={tam * 0.95} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={tam * 0.5} letterSpacing={tam * 0.25} fill={f >= fin + 6 ? color : "#3a3f48"}>{sub}</text>}
    </g>
  );
};

// ---------- display de la secadora con los minutos (mundo) ----------
export const DisplaySecadora: React.FC<{ x: number; y: number; seg: number; s?: number; parpadea?: boolean }> = ({ x, y, seg, s = 1, parpadea }) => {
  const f = useF();
  const m = Math.floor(seg / 60), ss = Math.floor(seg % 60);
  const on = !parpadea || f % 20 < 14;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-46} y={-18} width={92} height={36} rx={6} fill="#0d0f13" stroke="#4a505a" strokeWidth={3} />
      <Halo x={0} y={0} r={60} color={ACENTO} fuerza={0.35} />
      {on && <text x={0} y={10} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={28} fill={ACENTO}>{`${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`}</text>}
    </g>
  );
};

// ---------- vaho del aliento (mundo): nubecitas que salen de la boca cada `p` cuadros ----------
export const Vaho: React.FC<{ x: (f: number) => number; y: (f: number) => number; dir?: 1 | -1; p?: number; desde?: number }> = ({ x, y, dir = 1, p = 34, desde = 0 }) => {
  const f = useF();
  return (
    <g>{[0, 1, 2].map((k) => {
      const t0 = Math.floor((f - desde) / p) * p + desde - k * p;
      const e = f - t0;
      if (t0 < desde || e > 40) return null;
      const bx = x(t0), by = y(t0);
      return <g key={k} opacity={0.5 * (1 - e / 40)}>
        <circle cx={bx + dir * (10 + e * 1.6)} cy={by - e * 0.5} r={8 + e * 0.6} fill="#e6edf5" />
        <circle cx={bx + dir * (22 + e * 1.9)} cy={by - 4 - e * 0.7} r={6 + e * 0.5} fill="#e6edf5" />
      </g>;
    })}</g>
  );
};

// ---------- el corazón que late con ondas que viajan a un punto (mundo) ----------
export const Latido: React.FC<{ x: number; y: number; hacia?: { x: number; y: number }; desde?: number; s?: number; color?: string; periodo?: number }> = ({ x, y, hacia, desde = 0, s = 1, color = ACENTO, periodo = 26 }) => {
  const f = useF();
  if (f < desde) return null;
  const e = (f - desde) % periodo;
  const pulso = 1 + 0.22 * Math.exp(-e / 3) + 0.12 * Math.exp(-Math.max(0, e - 7) / 3) * (e > 7 ? 1 : 0);
  const a = lerp(f, desde, desde + 10, 0, 1);
  return (
    <g opacity={a}>
      {hacia && [0, 1, 2].map((k) => {
        const t = (((f - desde) / periodo + k / 3) % 1);
        return <circle key={k} cx={x + (hacia.x - x) * t} cy={y + (hacia.y - y) * t} r={10 + 30 * t} fill="none" stroke={color} strokeWidth={4 * (1 - t)} opacity={0.8 * (1 - t)} />;
      })}
      <Halo x={x} y={y} r={70 * s * pulso} color={color} fuerza={0.45} />
      <g transform={`translate(${x},${y}) scale(${s * pulso})`}>
        <path d="M0,14 C-26,-4 -24,-26 -10,-26 C-3,-26 0,-20 0,-16 C0,-20 3,-26 10,-26 C24,-26 26,-4 0,14 Z" fill={color} stroke="#5a1a0a" strokeWidth={2} />
      </g>
    </g>
  );
};

// ---------- utilería de mano (origen en la mano) ----------
export const Mango: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><ellipse cx={0} cy={8} rx={13} ry={16} fill="#f0a830" /><ellipse cx={-4} cy={3} rx={5} ry={7} fill="#ffd070" opacity={0.7} /><path d="M0,-8 q6,-8 12,-6" stroke="#3a6a2a" strokeWidth={3} fill="none" /><ellipse cx={9} cy={-11} rx={7} ry={3} fill="#4a8a3a" /></g>
);
export const Collar: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M-16,0 Q0,34 16,0" stroke="#e0b040" strokeWidth={4} fill="none" />{[-12, -6, 0, 6, 12].map((k, i) => <circle key={i} cx={k} cy={Math.abs(k) < 1 ? 17 : 17 - Math.abs(k) * 0.9} r={i === 2 ? 6 : 4} fill={i === 2 ? "#c8323a" : "#f0d070"} />)}</g>
);
export const Espada: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><rect x={-3} y={-110} width={6} height={100} rx={2} fill="#d8dce2" /><rect x={-14} y={-12} width={28} height={6} rx={2} fill="#c9963a" /><rect x={-3} y={-6} width={6} height={16} fill="#5a3a24" /></g>
);
export const Hoja: React.FC<{ s?: number; lineas?: number }> = ({ s = 1, lineas = 4 }) => (
  <g transform={`scale(${s}) rotate(-8)`}><rect x={-20} y={-6} width={40} height={50} rx={3} fill="#f1e6c8" stroke="#a8906a" strokeWidth={1.5} />{Array.from({ length: lineas }).map((_, k) => <rect key={k} x={-14} y={4 + k * 9} width={k === lineas - 1 ? 16 : 28} height={2.4} fill="#6a4a2a" />)}</g>
);
export const CajaRegalo: React.FC<{ abre: number; s?: number }> = ({ abre, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-26} y={-6} width={52} height={36} rx={3} fill="#b8483a" /><rect x={-4} y={-6} width={8} height={36} fill="#f0c860" />
    <g transform={`translate(-28,-6) rotate(${-110 * abre})`}><rect x={0} y={-10} width={56} height={10} rx={2} fill="#c8584a" /></g>
    {abre > 0.3 && <Halo x={0} y={-10} r={70} color={ACENTO} fuerza={0.6 * abre} />}
  </g>
);
export const TelMano: React.FC<{ prendido?: boolean; s?: number }> = ({ prendido = true, s = 1 }) => (
  <g transform={`scale(${s})`}><rect x={-10} y={-18} width={20} height={34} rx={4} fill="#15151a" />{prendido && <rect x={-7} y={-15} width={14} height={28} rx={2} fill={ACENTO} />}{prendido && <Halo x={0} y={0} r={50} color={ACENTO} fuerza={0.4} />}</g>
);

// ---------- megáfono enorme vs. la pesa que no se levanta (pantalla completa) ----------
export const MegafonoPesa: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useF();
  const g = f - desde;
  const grito = 1 + 0.06 * Math.sin(g / 2.2);
  const intento = Math.max(0, Math.sin(g / 9)) * lerp(g, 40, 50, 0, 1); // la pesa apenas tiembla
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #23272f, #0c0d10)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* megáfono */}
        <g transform={`translate(560,520) scale(${grito})`} opacity={lerp(g, 0, 8, 0, 1)}>
          <path d="M-180,-50 L60,-170 L60,170 L-180,50 Z" fill="#3a3f48" stroke="#5a606b" strokeWidth={8} />
          <rect x={-250} y={-50} width={80} height={100} rx={14} fill="#2a2e36" stroke="#5a606b" strokeWidth={8} />
          <ellipse cx={60} cy={0} rx={34} ry={170} fill="#4a505a" stroke="#6a707b" strokeWidth={8} />
          {[0, 1, 2, 3].map((k) => { const t = ((g / 14 + k / 4) % 1); return <path key={k} d={`M${110 + t * 260},${-150 - t * 60} Q${170 + t * 300},0 ${110 + t * 260},${150 + t * 60}`} fill="none" stroke={ACENTO} strokeWidth={14 * (1 - t)} opacity={1 - t} strokeLinecap="round" />; })}
        </g>
        {/* pesa: la barra intenta subir y no puede */}
        <g transform={`translate(1420,${780 - intento * 8})`} opacity={lerp(g, 36, 46, 0, 1)}>
          <rect x={-170} y={-16} width={340} height={32} rx={14} fill="#6a707b" />
          {[-150, 150].map((x) => <rect key={x} x={x - 30} y={-80} width={60} height={160} rx={16} fill="#2a2e36" stroke="#9aa0aa" strokeWidth={6} />)}
          <text x={0} y={150} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#9aa0aa" letterSpacing={6}>STRENGTH</text>
        </g>
        <line x1={1180} y1={860} x2={1660} y2={860} stroke="#3a3f48" strokeWidth={6} />
      </svg>
      <div style={{ position: "absolute", left: 300, top: 120, fontFamily: F_HUD, fontWeight: 600, fontSize: 96, color: CREMA, opacity: lerp(g, 2, 10, 0, 1) }}>DESIRE IS LOUD.</div>
      <div style={{ position: "absolute", right: 170, top: 330, fontFamily: F_HUD, fontWeight: 600, fontSize: 84, color: ACENTO, opacity: lerp(g, 44, 54, 0, 1), textAlign: "right" }}>IT IS NOT<br />STRONG.</div>
    </AbsoluteFill>
  );
};

// ---------- la toalla vista desde arriba, doblándose esquina con esquina (pantalla completa) ----------
export const ToallaCenital: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  // p 0..1: 0-0.5 primer doblez (cuadrado → triángulo), 0.5-1 segundo (triángulo → triángulo chico)
  const S = 520, cx = 960, cy = 560;
  const t1 = Math.min(1, p / 0.5), t2 = Math.max(0, (p - 0.5) / 0.5);
  const e = (t: number) => t * t * (3 - 2 * t);
  const a = e(t1), b = e(t2);
  const A = { x: cx - S / 2, y: cy - S / 2 }, B = { x: cx + S / 2, y: cy - S / 2 }, C = { x: cx + S / 2, y: cy + S / 2 }, D = { x: cx - S / 2, y: cy + S / 2 };
  const Cm = { x: C.x + (A.x - C.x) * a, y: C.y + (A.y - C.y) * a }; // 1er doblez: C viaja a A sobre la diagonal B-D
  const M = { x: (B.x + D.x) / 2, y: (B.y + D.y) / 2 };
  const Dm = { x: D.x + (B.x - D.x) * b, y: D.y + (B.y - D.y) * b }; // 2º doblez: D viaja a B sobre A-M
  const tela = "#e9e6e0", sombra = "#c9c4ba", dorso = "#f6f4f0";
  const manoI = b > 0 ? Dm : Cm;
  const tri = (p: { x: number; y: number }[]) => `M${p.map((q) => `${q.x},${q.y}`).join(" L")} Z`;
  return (
    <AbsoluteFill style={{ background: "#7c8088" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={180} y={170} width={1560} height={780} rx={18} fill="#c3c6cb" />
        {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={180} y={210 + k * 84} width={1560} height={3} fill="#b2b5ba" />)}
        <Halo x={1500} y={330} r={360} color={ORO} fuerza={0.45} />
        <circle cx={1500} cy={330} r={44} fill="#ffe2a8" stroke="#a87a3a" strokeWidth={4} />
        {b === 0 && <>
          <path d={tri([A, B, D])} fill={tela} />
          {[0.2, 0.4, 0.6, 0.8].map((k) => <line key={k} x1={A.x} y1={A.y + S * k} x2={A.x + S * (1 - k)} y2={A.y + S * k} stroke={sombra} strokeWidth={3} opacity={0.6} />)}
          <path d={tri([B, Cm, D])} fill={a > 0.5 ? dorso : tela} stroke="#bdb8ae" strokeWidth={3} />
        </>}
        {b > 0 && <>
          <path d={tri([A, B, M])} fill={dorso} stroke="#bdb8ae" strokeWidth={3} />
          <path d={tri([A, M, Dm])} fill={b > 0.5 ? "#fbfaf7" : sombra} stroke="#bdb8ae" strokeWidth={3} />
        </>}
        {/* las manos de Tenzo: una sostiene, la otra lleva la punta */}
        {[{ x: A.x + 30, y: A.y + 40, k: 0 }, { x: manoI.x, y: manoI.y, k: 1 }].map((m) => (
          <g key={m.k} transform={`translate(${m.x},${m.y + (m.k ? 3 * Math.sin(f / 9) : 0)})`}>
            <path d={`M${m.k ? 60 : -60},120 L${m.k ? 20 : -20},20`} stroke="#8a8a88" strokeWidth={62} strokeLinecap="round" />
            <circle cx={0} cy={0} r={40} fill="#e8b98e" stroke={TINTA} strokeWidth={5} />
            <path d="M-26,-22 q8,-18 20,-14 M-6,-30 q8,-14 18,-6 M14,-26 q10,-8 16,4" stroke={TINTA} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- haces de luz del feed que barren una cara (pantalla, encima de la escena) ----------
export const ReflejoFeed: React.FC<{ cx: number; cy: number; r: number; vel?: number }> = ({ cx, cy, r, vel = 9 }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, black ${r * 0.55}px, transparent ${r}px)`, maskImage: `radial-gradient(circle at ${cx}px ${cy}px, black ${r * 0.55}px, transparent ${r}px)` }}>
      {[0, 1, 2, 3].map((k) => {
        const y = cy + r - (((f * vel + k * 260) % (r * 2.6))) ;
        return <div key={k} style={{ position: "absolute", left: cx - r, top: y, width: r * 2, height: 70 + 40 * (k % 2), background: `linear-gradient(transparent, ${k % 2 ? "#ffb08a" : "#ffd8c0"}44, transparent)` }} />;
      })}
    </AbsoluteFill>
  );
};

// ---------- mano gigante sosteniendo el celular (pantalla): va DEBAJO del TelGrande (los dedos encima se dibujan aparte) ----------
export const DedosTel: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  // bordes del TelGrande: W 520 · H 1000 escalados
  const L = x - 260 * s, R = x + 260 * s, B = y + 500 * s;
  const piel = "#ecc9a3";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* 4 dedos que asoman por la derecha */}
        {[0, 1, 2, 3].map((k) => <rect key={k} x={R - 26} y={y + (60 + k * 92) * s} width={70} height={74 * s} rx={34 * s} fill={piel} stroke="#3a2a20" strokeWidth={5} />)}
        {/* pulgar a la izquierda */}
        <rect x={L - 50} y={y + 120 * s} width={78} height={150 * s} rx={38} fill={piel} stroke="#3a2a20" strokeWidth={5} transform={`rotate(-10 ${L} ${y + 160 * s})`} />
        {/* palma abajo */}
        <path d={`M${L - 40},1080 L${L + 10},${B - 40} L${R + 30},${B - 120} L${R + 140},1080 Z`} fill={piel} stroke="#3a2a20" strokeWidth={5} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- notificaciones que caen sobre la pantalla del TelGrande (pantalla) ----------
export const Notifs: React.FC<{ x: number; y: number; s: number; desde: number; textos: string[]; cada?: number }> = ({ x, y, s, desde, textos, cada = 9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {textos.map((t, k) => {
        const d = desde + k * cada;
        if (f < d) return null;
        const e = spring({ frame: f - d, fps, config: { damping: 14, stiffness: 170 } });
        const n = textos.filter((_, j) => desde + j * cada <= f).length;
        const fila = n - 1 - k;
        return (
          <div key={k} style={{ position: "absolute", left: x - 230 * s, top: y - 300 * s + fila * 104 * s - (1 - e) * 60, width: 460 * s, height: 90 * s, borderRadius: 22 * s, background: "rgba(58,63,72,0.96)", opacity: e, display: "flex", alignItems: "center", gap: 14 * s, padding: `0 ${18 * s}px`, boxSizing: "border-box", fontFamily: F_HUD, fontSize: 26 * s, color: "#e9e3d6", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
            <div style={{ width: 50 * s, height: 50 * s, borderRadius: 12 * s, background: k % 2 ? "#5a606b" : ACENTO, flexShrink: 0 }} />
            <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- texto de globo en estilo del kit pero con color de Mara (susurro) ----------
export const Susurro: React.FC<{ x: number; y: number; texto: string; desde: number; hasta: number }> = ({ x, y, texto, desde, hasta }) => {
  const f = useF();
  if (f < desde || f > hasta) return null;
  const o = lerp(f, desde, desde + 6, 0, 1) * lerp(f, hasta - 6, hasta, 1, 0);
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o, fontFamily: F_GLOBO, fontSize: 44, color: ACENTO, padding: "8px 22px", borderRadius: 30, border: `3px dashed ${ACENTO}`, background: "rgba(20,10,8,0.55)", whiteSpace: "nowrap" }}>{texto}</div>;
};

// ---------- llamada anclada a un punto del MUNDO (sigue a la cámara) ----------
import { Clave, enPantalla } from "../anikit/camara";
export const LlamadaMundo: React.FC<{ cl: Clave[]; X: number; Y: number; dx: number; dy: number; texto: string; desde: number; hasta?: number; color?: string; tam?: number }> = ({ cl, X, Y, dx, dy, texto, desde, hasta, color, tam }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const p = enPantalla(cl, f, fps, X, Y);
  return <Llamada px={p.x} py={p.y} lx={p.x + dx} ly={p.y + dy} texto={texto} desde={desde} hasta={hasta} color={color} tam={tam} />;
};
// punto del mundo → pantalla (para colgar globos)
export const usePantalla = (cl: Clave[], X: number, Y: number) => {
  const f = useF();
  const { fps } = useVideoConfig();
  return enPantalla(cl, f, fps, X, Y);
};

// ---------- cabeza + hombro en primer término (contraplano / por encima del hombro), silueta con borde de luz ----------
export const PrimerTermino: React.FC<{ x: number; y: number; r?: number; quien: "tenzo" | "leo"; lado?: 1 | -1; luz?: string }> = ({ x, y, r = 250, quien, lado = 1, luz = ORO }) => {
  const f = useF();
  const cuerpo = quien === "tenzo" ? "#55575c" : "#18181c";
  const cabeza = quien === "tenzo" ? "#6e5a4a" : "#16141a";
  const dy = 3 * Math.sin(f / 40);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(${x},${y + dy})`}>
          <ellipse cx={lado * 60} cy={r * 1.75} rx={r * 1.25} ry={r * 0.95} fill={cuerpo} />
          <circle cx={0} cy={0} r={r} fill={cabeza} />
          {quien === "leo" && [-0.6, -0.2, 0.25].map((a, i) => <path key={i} d={`M${Math.sin(a) * r * 0.9 - 40},${-Math.cos(a) * r * 0.9} l${40 + i * 10},-${r * 0.45} l${30},${r * 0.45} Z`} fill={cabeza} />)}
          {/* borde de luz del lado de la escena */}
          <path d={`M${-lado * r * 0.2},${-r * 0.98} A${r},${r} 0 0 ${lado > 0 ? 0 : 1} ${-lado * r},${r * 0.1}`} fill="none" stroke={luz} strokeWidth={10} opacity={0.55} strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ================= vuelta 3 (ojo del director, escenas <8) =================
import { estadoActor, ActorProps as AP } from "../anikit/actor";
import { articulaciones, huesosDe } from "../anikit/personaje";
// cara de Mara SIN sonrisa (el estilo demonio siempre sonríe): tapa los rasgos y dibuja ojos rasgados, cejas y boca recta→enojada.
// Va en el MISMO contexto de mundo que el <Actor> de Mara (mismo Escalar), con sus mismas props.
export const CaraMara: React.FC<{ a: AP; desde: number; enojo?: number; color?: string }> = ({ a, desde, enojo = 0, color = ACENTO }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = estadoActor(a, f, fps);
  const H = huesosDe("demonio", a.look.alto);
  const j = articulaciones(s.p, s.asiento, H, { h: 29, c: 15 });
  const R = H.cabezaR, k = R / 40;
  const t = lerp(f, desde, desde + 6, 0, 1);
  const e = lerp(f, desde + 6, desde + 20, 0, enojo);
  const op = a.opacidad ? a.opacidad(f) : 1;
  return (
    <g transform={`translate(${s.x},${s.y}) scale(${s.esc * s.dir},${s.esc})`} opacity={op * t}>
      <g transform={`translate(${j.cabeza.x},${j.cabeza.y + 14}) rotate(${s.p.tronco * 0.4 + s.p.cabeza}) scale(${k})`}>
        <circle r={37} fill="#0b0709" />
        {[-1, 1].map((sd) => <g key={sd} stroke={color} strokeLinecap="round" fill="none">
          <path d={`M${sd * 21},${-3 - 2 * e} L${sd * 6},${0}`} strokeWidth={4.5} />
          <path d={`M${sd * 23},${-15 - 3 * e} L${sd * 5},${-9 + 2 * e}`} strokeWidth={4} />
        </g>)}
        <path d={`M-14,21 Q0,${21 - 9 * e} 14,21`} stroke={color} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
// río en primer término (mundo): banda de agua con oleaje que tapa piernas
export const Rio: React.FC<{ y: number; x0?: number; x1?: number; alto?: number }> = ({ y, x0 = -800, x1 = 4200, alto = 420 }) => {
  const f = useF();
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += 40) pts.push(`${x},${y + 10 * Math.sin(x / 70 + f / 6)}`);
  return (
    <g>
      <path d={`M${x0},${y + alto} L${pts.join(" L")} L${x1},${y + alto} Z`} fill="#4f8fb8" opacity={0.93} />
      <path d={`M${pts.join(" L")}`} fill="none" stroke="#cfe8f4" strokeWidth={8} strokeLinecap="round" />
      {Array.from({ length: 14 }).map((_, i) => { const xx = x0 + ((i * 397 + f * 3) % (x1 - x0)); return <path key={i} d={`M${xx},${y + 60 + (i % 4) * 70} q30,-12 60,0`} stroke="#bfe0f0" strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round" />; })}
    </g>
  );
};
// salpicadura alrededor de unas piernas que vadean (mundo)
export const Salpica: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>{[0, 1, 2, 3, 4].map((i) => { const t = ((f + i * 5) % 20) / 20; return <circle key={i} cx={x + (i - 2) * 22 * (1 + t)} cy={y - 40 * Math.sin(t * Math.PI) - 4} r={7 * (1 - t) + 2} fill="#dff1fa" opacity={1 - t} />; })}</g>
);
// chispa del choque de espadas (mundo)
export const Chispa: React.FC<{ x: number; y: number; f0: number; f: number }> = ({ x, y, f0, f }) => {
  const g = f - f0;
  if (g < 0 || g > 10) return null;
  return <g opacity={1 - g / 10}>{Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={x + Math.cos(a) * (8 + g * 5)} y1={y + Math.sin(a) * (8 + g * 5)} x2={x + Math.cos(a) * (22 + g * 9)} y2={y + Math.sin(a) * (22 + g * 9)} stroke="#fff3b0" strokeWidth={6} strokeLinecap="round" />; })}<circle cx={x} cy={y} r={16 - g} fill="#fffbe0" /></g>;
};
// espada dibujada en el mundo con ángulo propio (desde la empuñadura)
export const EspadaMundo: React.FC<{ x: number; y: number; ang: number; s?: number }> = ({ x, y, ang, s = 1.3 }) => (
  <g transform={`translate(${x},${y}) rotate(${ang}) scale(${s})`}><rect x={-3} y={-120} width={7} height={110} rx={2} fill="#e4e8ee" stroke="#8a929c" strokeWidth={1.5} /><rect x={-16} y={-12} width={32} height={7} rx={2} fill="#c9963a" /><rect x={-3.5} y={-5} width={7} height={18} fill="#5a3a24" /></g>
);
// tel grande que se da vuelta sobre la mesa (mundo): giro 0 = pantalla a cámara, 1 = boca abajo
export const TelVuelta: React.FC<{ x: number; y: number; giro: number; s?: number }> = ({ x, y, giro, s = 1 }) => {
  const sy = Math.cos(giro * Math.PI);
  const pantalla = sy > 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {pantalla && <Halo x={0} y={-30} r={140 * sy} color={ACENTO} fuerza={0.45 * sy} />}
      <g transform={`scale(1,${Math.max(0.08, Math.abs(sy))})`}>
        <rect x={-34} y={-62} width={68} height={124} rx={10} fill="#15151a" stroke="#3a3a44" strokeWidth={3} />
        {pantalla ? <rect x={-28} y={-54} width={56} height={108} rx={5} fill={ACENTO} /> : <circle cx={-16} cy={-44} r={6} fill="#2a2a32" />}
      </g>
    </g>
  );
};
// caja de comentario del CTA (pantalla): «Tell me below» — sube desde abajo y se escribe sola
export const CajaComentario: React.FC<{ x: number; y: number; desde: number; texto: string }> = ({ x, y, desde, texto }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 140 } });
  const n = Math.floor(lerp(f, desde + 10, desde + 10 + texto.length * 1.6, 0, texto.length));
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - s) * 160, opacity: s, width: 760, padding: "22px 30px", borderRadius: 22, background: "#f8f3e8", boxShadow: "0 14px 30px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: "#2a2e36", flexShrink: 0 }} />
      <div style={{ fontFamily: F_GLOBO, fontSize: 40, color: "#2a2420", whiteSpace: "nowrap", overflow: "hidden" }}>{texto.slice(0, n)}<span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>|</span></div>
    </div>
  );
};
// tira de 30 días (pantalla): se pinta el 1, el 30 tiene «?»
export const Tira30: React.FC<{ x: number; y: number; desde: number; hecho?: number }> = ({ x, y, desde, hecho = 1 }) => {
  const f = useF();
  if (f < desde) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <text x={x} y={y - 26} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe6" letterSpacing={3} opacity={lerp(f, desde, desde + 8, 0, 1)}>DAY 1 → DAY 30</text>
      {Array.from({ length: 30 }).map((_, i) => {
        const a = lerp(f, desde + i * 1.2, desde + i * 1.2 + 6, 0, 1);
        const lleno = i < hecho;
        return <g key={i} opacity={a}><rect x={x + i * 38} y={y} width={30} height={46} rx={6} fill={lleno ? ACENTO : "#2a2e36"} stroke={i === 29 ? "#ffe2a6" : "#4a4f58"} strokeWidth={i === 29 ? 4 : 2} />
          {i === 29 && <text x={x + i * 38 + 15} y={y + 34} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#ffe2a6">?</text>}</g>;
      })}
    </svg>
  );
};
// posición de la mano en el MUNDO (para colgar utilería con ángulo propio: espadas, collares que caen…)
export const manoMundo = (a: AP, f: number, fps: number, lado: "D" | "I" = "D") => {
  const s = estadoActor(a, f, fps);
  const est = a.look.estilo;
  const frontal = a.look.frontal ?? (est === "frijol" || est === "demonio");
  const j = articulaciones(s.p, s.asiento, huesosDe(est, a.look.alto), frontal ? { h: 29, c: 15 } : { h: 6, c: 5 });
  const m = lado === "D" ? j.bD.mano : j.bI.mano;
  return { x: s.x + m.x * s.esc * s.dir, y: s.y + m.y * s.esc, dir: s.dir };
};
// espada en la mano de un actor, con el ángulo que da la función del cuadro
export const EspadaDe: React.FC<{ a: AP; ang: (f: number) => number; s?: number }> = ({ a, ang, s = 1.3 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const m = manoMundo(a, f, fps);
  return <EspadaMundo x={m.x} y={m.y} ang={ang(f) * m.dir} s={s} />;
};
