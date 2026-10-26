// lc02 · componentes de la rehechura (planos 1-40). Archivo de lc02_planos1 (no lo usa nadie más).
// - EscenaL: la misma Escena del kit pero SIN motion blur de cámara (el Plano del kit desenfoca los paneos rápidos).
// - Poses de sentado con su `asiento`, puertas que se cierran, la casa en corte, la estufa con puerta, etiquetas
//   ancladas a objetos del mundo, diagramas (cuerdas, capas, caño que revienta, CO), íconos tachados.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import { Clave, poseEn, temblor, useF } from "../../anikit/camara";
import { Paleta } from "../../anikit/paletas";
import { Pose } from "../../anikit/personaje";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { AMBAR } from "../elenco";
import { F_MONO } from "../hud";

export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const io = { ...cl, easing: Easing.inOut(Easing.cubic) };
export const ou = { ...cl, easing: Easing.out(Easing.cubic) };
export const lerp = (f: number, a: number, b: number, v0: number, v1: number, e = io) => interpolate(f, [a, b], [v0, v1], e);

// ---------------------------------------------------------------------------------------------------------------
// EscenaL: set + cámara en 3 profundidades, sin desenfoque de movimiento (sólo temblor de mano y el leve del fondo)
type Est = { x: number; y: number; zoom: number; rot: number; foco: number };
const CtxL = createContext<Est>({ x: 0, y: 0, zoom: 1, rot: 0, foco: 1 });
const CapaL: React.FC<{ z: number; desenfoqueMax?: number; children: React.ReactNode }> = ({ z, desenfoqueMax = 3, children }) => {
  const c = useContext(CtxL);
  const par = Math.max(0.05, z);
  const zoom = 1 + (c.zoom - 1) * par;
  const blur = Math.min(3, Math.abs(z - c.foco) * desenfoqueMax);
  return (
    <AbsoluteFill style={{ transform: `translate(${-c.x * par}px, ${-c.y * par}px) rotate(${c.rot * par}deg) scale(${zoom})`, transformOrigin: "50% 50%" }}>
      <AbsoluteFill style={{ filter: blur > 0.6 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const EscenaL: React.FC<{
  Set: React.FC<any>; pal: Paleta; claves: Clave[]; setProps?: Record<string, unknown>;
  medio?: React.ReactNode; frente?: React.ReactNode; detras?: React.ReactNode; hud?: React.ReactNode; mano?: number; seed?: number; zLejos?: number; fondo?: string;
}> = ({ Set, pal, claves, setProps = {}, medio, frente, detras, hud, mano = 3, seed = 0, zLejos = 0.25, fondo }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const p = poseEn(claves, f, fps);
  const s = temblor(f, fps, mano, seed);
  const sp = { f, pal, ...setProps };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: fondo ?? pal.cielo[0], overflow: "hidden" }}>
        <CtxL.Provider value={{ x: p.x + s.x, y: p.y + s.y, zoom: p.zoom, rot: p.rot + s.rot, foco: p.foco }}>
          <CapaL z={zLejos} desenfoqueMax={3}><Set capa="lejos" {...sp} /></CapaL>
          <CapaL z={1}><Set capa="medio" {...sp} />{detras}{medio}</CapaL>
          <CapaL z={1.4} desenfoqueMax={4}><Set capa="frente" {...sp} />{frente}</CapaL>
        </CtxL.Provider>
      </AbsoluteFill>
      {hud}
    </AbsoluteFill>
  );
};
// dónde cae en pantalla un punto del mundo (igual que enPantalla del kit)
export const aPantalla = (claves: Clave[], f: number, X: number, Y: number) => {
  const c = poseEn(claves, f, 30);
  return { x: 960 + (X - 960) * c.zoom - c.x, y: 540 + (Y - 540) * c.zoom - c.y, z: c.zoom };
};

// ---------------------------------------------------------------------------------------------------------------
// poses (con su asiento)
// sentado en el piso abrazando una rodilla: asiento 16 (la cadera apoya, el pie de adelante en el piso)
export const SUELO: Partial<Pose> = { tronco: -6, pI: 88, rI: 0, pD: 135, rD: 135, hI: 20, cI: 40, hD: 70, cD: 70, cabeza: 0 };
export const A_SUELO = 16;
// sentado en el borde del colchón (cadera a la altura del colchón, los pies en el piso)
export const SENT: Partial<Pose> = { tronco: -2, pI: 86, rI: 86, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 };
export const A_COLCHON = 64;
export const A_SILLA = 60;
// en cuclillas de verdad (los dos pies en el piso, la cadera baja): asiento 40
export const CUCLI: Partial<Pose> = { tronco: 30, pI: 120, rI: 150, pD: 128, rD: 158, hD: 60, cD: 30, hI: 40, cI: 40, cabeza: -18 };
export const A_CUCLI = 44;

// ---------------------------------------------------------------------------------------------------------------
// aliento: nubecitas de vapor que salen de la boca (x,y = boca en el mundo), cada `per` cuadros
export const Aliento: React.FC<{ x: number; y: number; f: number; dir?: 1 | -1; per?: number; s?: number; desfase?: number }> = ({ x, y, f, dir = 1, per = 46, s = 1, desfase = 0 }) => {
  const t = ((f + desfase) % per) / per;
  if (t > 0.7) return null;
  const u = t / 0.7;
  return <g opacity={0.55 * (1 - u)}>{[0, 1, 2].map((i) => <circle key={i} cx={x + dir * (10 + u * 70 * s + i * 14 * s)} cy={y - u * 18 * s - i * 4} r={(6 + u * 16 + i * 3) * s} fill="#eef4ff" />)}</g>;
};

// nieve con viento fuerte (ventisca): líneas oblicuas rápidas, en coordenadas del mundo
export const Ventisca: React.FC<{ f: number; x0?: number; w?: number; y0?: number; h?: number; n?: number; viento?: number; o?: number; seed?: number }> = ({ f, x0 = -600, w = 4600, y0 = -500, h = 1700, n = 240, viento = 9, o = 0.85, seed = 0 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const r1 = ((i * 7919 + seed * 131) % 1000) / 1000, r2 = ((i * 3571 + seed * 71) % 1000) / 1000, r3 = ((i * 1543) % 1000) / 1000;
      const vy = 5 + r3 * 6;
      const yy = y0 + ((r2 * h + f * vy) % h);
      const xx = x0 + ((((r1 * w + f * viento * (0.7 + r3 * 0.6)) % w) + w) % w);
      const L = 10 + r3 * 18;
      return <line key={i} x1={xx} y1={yy} x2={xx - viento * L * 0.18} y2={yy - vy * L * 0.18} stroke="#f2f6ff" strokeWidth={2.4 + r3 * 3} strokeLinecap="round" opacity={0.5 + r3 * 0.5} />;
    })}
  </g>
);

// humo de chimenea visible (gris, sobre cielo claro u oscuro)
export const HumoChim: React.FC<{ x: number; y: number; f: number; o?: number; viento?: number; color?: string }> = ({ x, y, f, o = 1, viento = 1, color = "#9aa0b2" }) => (
  <g opacity={o}>
    {Array.from({ length: 12 }).map((_, i) => {
      const t = (f / 70 + i / 12) % 1;
      return <circle key={i} cx={x + t * 260 * viento + Math.sin(f / 25 + i) * 14} cy={y - t * 300} r={18 + t * 60} fill={color} opacity={(1 - t) * 0.75} />;
    })}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// tarjeta con ícono + rótulo y una X roja que se dibuja (NO FURNACE / NO HOSPITAL / NO ONE TO CALL). Pantalla.
export const IconoTachado: React.FC<{ x: number; y: number; icono: "estufa" | "hospital" | "telefono" | "persona" | "cuarto"; rotulo: string; desde: number; tacha?: number; w?: number; color?: string }> = ({ x, y, icono, rotulo, desde, tacha, w = 420, color = "#f6ecd2" }) => {
  const f = useF();
  if (f < desde) return null;
  const s = interpolate(f, [desde, desde + 10], [0.6, 1], ou);
  const o = interpolate(f, [desde, desde + 6], [0, 1], cl);
  const t = tacha === undefined ? 0 : interpolate(f, [tacha, tacha + 9], [0, 1], ou);
  const h = 150;
  return (
    <svg width={w + 40} height={h + 40} viewBox={`-20 -20 ${w + 40} ${h + 40}`} style={{ position: "absolute", left: x - w / 2 - 20, top: y - h / 2 - 20, opacity: o, transform: `scale(${s})`, overflow: "visible" }}>
      <rect x={0} y={0} width={w} height={h} rx={26} fill="#120f18" opacity={0.86} stroke={t > 0.5 ? "#e2483a" : "#f6ecd255"} strokeWidth={4} />
      <g transform={`translate(${h / 2 + 6},${h / 2})`} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {icono === "estufa" && <><rect x={-38} y={-26} width={76} height={58} rx={8} /><rect x={-22} y={-12} width={44} height={30} rx={5} fill="#ff8a3a" stroke="none" opacity={1 - t * 0.8} /><path d="M-8,-26 V-52" /><path d="M-30,32 v10 M30,32 v10" /></>}
        {icono === "hospital" && <><rect x={-42} y={-44} width={84} height={88} rx={8} /><path d="M0,-24 V22 M-22,0 H22" stroke="#e2483a" strokeWidth={12} /></>}
        {icono === "telefono" && <><rect x={-24} y={-46} width={48} height={92} rx={9} /><path d="M-8,34 h16" /><path d={`M34,-36 q14,14 0,30 M46,-46 q24,24 0,50`} opacity={1 - t} /></>}
        {icono === "persona" && <><circle cx={0} cy={-22} r={20} fill={color} stroke="none" /><path d="M-30,46 Q-30,4 0,4 Q30,4 30,46 Z" fill={color} stroke="none" /></>}
        {icono === "cuarto" && <><path d="M-44,40 V-14 L0,-46 L44,-14 V40 Z" /><rect x={-14} y={8} width={28} height={32} /></>}
      </g>
      <text x={h + 14} y={h / 2 + 14} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={color} letterSpacing={2}>{rotulo}</text>
      {t > 0 && <g stroke="#e2483a" strokeWidth={14} strokeLinecap="round">
        <path d={`M16,16 L${16 + (w - 32) * Math.min(1, t * 2)},${16 + (h - 32) * Math.min(1, t * 2)}`} />
        {t > 0.5 && <path d={`M${w - 16},16 L${w - 16 - (w - 32) * (t - 0.5) * 2},${16 + (h - 32) * (t - 0.5) * 2}`} />}
      </g>}
    </svg>
  );
};

// barra de energía de la ciudad (pantalla): POWER 100% → 0%
export const BarraPower: React.FC<{ x: number; y: number; v: number; desde: number; rotulo?: string }> = ({ x, y, v, desde, rotulo = "CITY POWER" }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 8], [0, 1], cl);
  const col = v > 0.5 ? AMBAR : v > 0.15 ? "#ff9a4a" : "#e2483a";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, width: 420, fontFamily: F_HUD, color: "#f6ecd2" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 30, letterSpacing: 3, textShadow: "0 3px 10px rgba(0,0,0,.7)" }}><span>{rotulo}</span><span style={{ color: col, fontVariantNumeric: "tabular-nums" }}>{Math.round(v * 100)}%</span></div>
      <div style={{ marginTop: 8, height: 26, borderRadius: 14, background: "rgba(10,10,18,.75)", border: "3px solid #f6ecd255", overflow: "hidden" }}>
        <div style={{ width: `${v * 100}%`, height: "100%", background: col, borderRadius: 12 }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// puerta (mundo): vano x..x+W, alto H. abre 1 = abierta hacia la cámara, 0 = cerrada. der = bisagra a la derecha.
// pomo() dice dónde está el picaporte (para el IK de la mano), a 260 del piso (alcanzable de pie)
export const pomo = (x: number, piso: number, W: number, abre: number, der = false) => {
  const c = Math.cos(abre * 1.25), s = Math.sin(abre * 1.25), L = W - 26;
  return { x: der ? x + W - L * c : x + L * c, y: piso - 260 + 24 * s };
};
export const Puerta: React.FC<{ x: number; piso: number; W?: number; H?: number; abre: number; der?: boolean; color?: string; vano?: string; luzVano?: string; marco?: string }> = ({ x, piso, W = 240, H = 620, abre, der = false, color = "#7a5236", vano = "#14101a", luzVano, marco = "#e8d9b5" }) => {
  const c = Math.cos(abre * 1.25), s = Math.sin(abre * 1.25);
  const xh = der ? x + W : x, xf = der ? x + W - W * c : x + W * c;
  const up = 50 * s, dn = 26 * s;
  const P = (t: number, v: number) => { const xx = xh + (xf - xh) * t; const top = piso - H - up * t, bot = piso + dn * t; return `${xx},${top + (bot - top) * v}`; };
  const panel = (v0: number, v1: number) => `M${P(0.16, v0)} L${P(0.84, v0)} L${P(0.84, v1)} L${P(0.16, v1)} Z`;
  const pk = pomo(x, piso, W, abre, der);
  return (
    <g>
      <rect x={x} y={piso - H} width={W} height={H} fill={vano} />
      {luzVano && <rect x={x} y={piso - H} width={W} height={H} fill={luzVano} opacity={0.4} />}
      <rect x={x - 14} y={piso - H - 14} width={W + 28} height={14} fill={marco} /><rect x={x - 14} y={piso - H} width={14} height={H} fill={marco} /><rect x={x + W} y={piso - H} width={14} height={H} fill={marco} />
      <path d={`M${xh},${piso - H} L${xf},${piso - H - up} L${xf},${piso + dn} L${xh},${piso} Z`} fill={color} stroke="#3a2418" strokeWidth={4} />
      {c > 0.25 && <g fill="none" stroke="#5a3a26" strokeWidth={5}><path d={panel(0.08, 0.45)} /><path d={panel(0.55, 0.92)} /></g>}
      <circle cx={pk.x} cy={pk.y} r={10} fill="#d8b46a" stroke="#6a4a20" strokeWidth={2} />
    </g>
  );
};

// manta que se cuelga en un vano: baja desde la barra (cae 0..1). x = borde izquierdo, piso, W ancho, H alto
export const MantaVano: React.FC<{ x: number; piso: number; W?: number; H?: number; cae: number; color?: string; raya?: string; id?: string; f?: number }> = ({ x, piso, W = 260, H = 630, cae, color = "#7a3a3a", raya = "#3a2a5a", id = "mv", f = 0 }) => {
  const h = Math.max(20, H * cae);
  const ond = (1 - cae) * 18 + 4;
  const y0 = piso - H;
  return (
    <g>
      <defs>
        <pattern id={`mvp${id}`} width={56} height={56} patternUnits="userSpaceOnUse">
          <rect width={56} height={56} fill={color} />
          <rect width={56} height={13} y={20} fill={raya} opacity={0.6} /><rect width={13} height={56} x={20} fill={raya} opacity={0.6} />
          <rect width={56} height={3} y={40} fill="#f2e2c8" opacity={0.45} /><rect width={3} height={56} x={40} fill="#f2e2c8" opacity={0.45} />
        </pattern>
      </defs>
      <rect x={x - 26} y={y0 - 16} width={W + 52} height={12} rx={6} fill="#3a2a22" />
      <path d={`M${x - 10},${y0 - 6} H${x + W + 10} V${y0 + h} ${Array.from({ length: 6 }).map((_, i) => `Q${x + W + 10 - (i + 0.5) * (W + 20) / 6},${y0 + h + (i % 2 ? -ond : ond) + Math.sin(f / 6 + i) * 3} ${x + W + 10 - (i + 1) * (W + 20) / 6},${y0 + h}`).join(" ")} Z`} fill={`url(#mvp${id})`} stroke="#00000044" strokeWidth={3} />
      {[0.25, 0.5, 0.75].map((q) => <path key={q} d={`M${x + W * q},${y0} V${y0 + h - 6}`} stroke="#00000022" strokeWidth={8} />)}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// la casa de ladrillo EN CORTE (pantalla, coordenadas propias 1920x1080): 2 pisos, 6 cuartos con puerta y termómetro.
// cuartos: 0 DORM 1 · 1 BAÑO · 2 PASILLO ARRIBA · 3 DORM 2 · 4 DORM 3 · 5 LIVING (el que queda caliente)
export const CUARTOS = [
  { n: "BEDROOM", x: 420, y: 300, w: 330, h: 250 },
  { n: "BATHROOM", x: 750, y: 300, w: 230, h: 250 },
  { n: "UPSTAIRS HALL", x: 980, y: 300, w: 520, h: 250 },
  { n: "BEDROOM", x: 420, y: 550, w: 330, h: 290 },
  { n: "BEDROOM", x: 750, y: 550, w: 270, h: 290 },
  { n: "LIVING ROOM", x: 1020, y: 550, w: 480, h: 290 },
];
export const CasaSeccion: React.FC<{
  f: number; frio: number[]; // 0..1 por cuarto (0 = tibio ámbar, 1 = azul helado)
  cerrada?: number[]; // 0..1 puerta de cada cuarto
  temps?: (number | null)[]; // °F que muestra cada termómetro (null = sin termómetro)
  escape?: number; // 0..1 calor que se escapa por techo y ventanas (flechas)
  rotulos?: number[]; // 0..1 opacidad del rótulo de cada cuarto
  tachas?: number[]; // 0..1 X roja sobre el rótulo
  nieve?: boolean; estufa?: number; children?: React.ReactNode;
}> = ({ f, frio, cerrada = [0, 0, 0, 0, 0, 0], temps, escape = 0, rotulos = [0, 0, 0, 0, 0, 0], tachas = [0, 0, 0, 0, 0, 0], nieve = true, estufa = 1, children }) => {
  const piso = 840;
  return (
    <g>
      {/* terreno y nieve */}
      <rect x={-100} y={piso} width={2200} height={400} fill="#e9eef8" />
      <path d={`M-100,${piso} Q400,${piso - 26} 900,${piso - 6} T2100,${piso - 10} V${piso + 30} H-100 Z`} fill="#dfe6f4" />
      {/* techo */}
      <path d="M380,300 L960,70 L1540,300 Z" fill="#2a1e22" />
      {nieve && <path d="M380,300 L960,70 L1540,300 L1520,306 L960,92 L400,306 Z" fill="#f4f6fa" />}
      <rect x={1250} y={60} width={64} height={200} fill="#6a2a22" />
      {/* muros de ladrillo (borde del corte) */}
      <rect x={390} y={300} width={1140} height={540} fill="#8a3a2e" />
      {CUARTOS.map((c, i) => {
        const fr = frio[i] ?? 0;
        const col = `rgb(${Math.round(interpolate(fr, [0, 1], [236, 110]))},${Math.round(interpolate(fr, [0, 1], [168, 168]))},${Math.round(interpolate(fr, [0, 1], [96, 232]))})`;
        const cerr = cerrada[i] ?? 0;
        const dx = c.x + 18, dw = 70; // puerta en el borde izquierdo del cuarto
        const t = temps?.[i];
        return (
          <g key={i}>
            <rect x={c.x + 10} y={c.y + 10} width={c.w - 20} height={c.h - 20} fill={col} />
            <rect x={c.x + 10} y={c.y + c.h - 30} width={c.w - 20} height={20} fill="#000" opacity={0.15} />
            {/* puerta: hoja que gira (se ve de frente: ancho que pasa de fino a lleno) */}
            <rect x={dx} y={c.y + c.h - 170} width={dw} height={160} fill="#2a2028" opacity={0.6} />
            <rect x={dx} y={c.y + c.h - 170} width={Math.max(6, dw * cerr)} height={160} fill="#6a4a32" stroke="#3a2418" strokeWidth={3} />
            {cerr > 0.9 && <circle cx={dx + dw - 12} cy={c.y + c.h - 90} r={5} fill="#d8b46a" />}
            {/* copos en los cuartos helados */}
            {fr > 0.4 && Array.from({ length: 5 }).map((_, k) => <text key={k} x={c.x + 110 + ((k * 97) % (c.w - 160))} y={c.y + 60 + ((k * 53 + f * 0.6) % (c.h - 90))} fontSize={26} fill="#ffffff" opacity={(fr - 0.4) * 1.4} fontFamily={F_HUD}>*</text>)}
            {/* termómetro */}
            {t !== undefined && t !== null && <Termito x={c.x + c.w - 52} y={c.y + 40} t={t} />}
            {/* rótulo */}
            {(rotulos[i] ?? 0) > 0.01 && <g opacity={rotulos[i]}>
              <rect x={c.x + c.w / 2 - 12 - c.n.length * 9} y={c.y + 24} width={c.n.length * 18 + 24} height={40} rx={20} fill="#120f18" opacity={0.85} />
              <text x={c.x + c.w / 2} y={c.y + 53} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#f6ecd2" letterSpacing={1}>{c.n}</text>
              {(tachas[i] ?? 0) > 0 && <path d={`M${c.x + c.w / 2 - c.n.length * 9 - 8},${c.y + 44} L${c.x + c.w / 2 - c.n.length * 9 - 8 + (c.n.length * 18 + 16) * tachas[i]},${c.y + 44}`} stroke="#e2483a" strokeWidth={7} strokeLinecap="round" />}
            </g>}
          </g>
        );
      })}
      {/* estufa en el living */}
      <g>
        <rect x={1380} y={300} width={16} height={440} fill="#1c1a20" />
        <rect x={1340} y={740} width={96} height={80} rx={8} fill="#26222a" />
        <rect x={1356} y={756} width={64} height={40} rx={6} fill={estufa > 0.05 ? "#ff8a3a" : "#120f14"} />
        {estufa > 0.05 && <Halo x={1388} y={760} r={260} color="#ff9a4a" fuerza={0.45 * estufa * (0.9 + 0.1 * Math.sin(f / 4))} />}
      </g>
      {/* escaleras */}
      <path d="M780,840 L780,800 L820,800 L820,760 L860,760 L860,720 L900,720 L900,680 L940,680 L940,640 L980,640 L980,600 L1020,600 L1020,560" stroke="#5a3a26" strokeWidth={10} fill="none" opacity={0} />
      {/* piso intermedio */}
      <rect x={390} y={540} width={1140} height={20} fill="#5a2a22" />
      {/* calor que se escapa */}
      {escape > 0 && Array.from({ length: 7 }).map((_, i) => {
        const t = ((f / 40 + i / 7) % 1);
        const px = [520, 700, 880, 1050, 1220, 1400, 640][i], py = i < 6 ? 250 - (i % 2) * 40 : 560;
        return <path key={i} d={`M${px},${py - t * 160} q-14,-20 0,-40 q14,-20 0,-40`} stroke="#ff9a4a" strokeWidth={9} fill="none" strokeLinecap="round" opacity={escape * (1 - t)} />;
      })}
      {children}
    </g>
  );
};
const Termito: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const h = interpolate(t, [-10, 75], [6, 96], cl);
  const col = t > 50 ? "#e2483a" : "#3a8adf";
  return (
    <g>
      <rect x={x - 26} y={y - 8} width={52} height={150} rx={14} fill="#f6f1e6" stroke="#bdb6a8" strokeWidth={2} />
      <rect x={x - 5} y={y + 4} width={10} height={100} rx={5} fill="#ffffff" stroke="#c8c0b0" strokeWidth={2} />
      <rect x={x - 3} y={y + 104 - h} width={6} height={h} fill={col} />
      <circle cx={x} cy={y + 112} r={10} fill={col} />
      <text x={x} y={y + 140} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={17} fill="#2a2228">{Math.round(t)}°</text>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// etiqueta anclada a un objeto del mundo (pantalla): texto en (tx,ty) con una línea hasta el punto del objeto
export const EtiquetaObj: React.FC<{ texto: string; desde: number; px: number; py: number; tx: number; ty: number; color?: string; tam?: number; hasta?: number }> = ({ texto, desde, px, py, tx, ty, color = AMBAR, tam = 36, hasta = 1e9 }) => {
  const f = useF();
  if (f < desde || f > hasta + 8) return null;
  const s = interpolate(f, [desde, desde + 9], [0, 1], ou);
  const o = interpolate(f, [desde, desde + 5, hasta, hasta + 8], [0, 1, 1, 0], cl);
  const w = texto.length * tam * 0.56 + 40;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o, overflow: "visible" }}>
        <path d={`M${px},${py} L${px + (tx - px) * s},${py + (ty - py) * s}`} stroke={color} strokeWidth={4} strokeLinecap="round" />
        <circle cx={px} cy={py} r={9 * s} fill={color} />
        <circle cx={px} cy={py} r={18 * s} fill="none" stroke={color} strokeWidth={3} opacity={0.6} />
      </svg>
      <div style={{ position: "absolute", left: tx - w / 2, top: ty - tam * 0.95, width: w, textAlign: "center", opacity: o, transform: `scale(${0.7 + 0.3 * s})`, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color: "#f6ecd2", background: "rgba(18,15,24,0.86)", border: `3px solid ${color}`, borderRadius: 40, padding: "4px 0", whiteSpace: "nowrap" }}>{texto}</div>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// estufa: puerta de hierro (abre 0..1) encima de la ventana de fuego del set (x = centro de la estufa, piso)
export const PuertaEstufa: React.FC<{ x: number; piso: number; abre: number }> = ({ x, piso, abre }) => {
  const a = abre * 1.3;
  const W = 152, x0 = x - 76, y0 = piso - 250, H = 130;
  const c = Math.cos(a), s = Math.sin(a);
  const xr = x0 + W * c * 0.98, up = 18 * s, dn = 12 * s;
  // la hoja gira sobre la bisagra izquierda y viene hacia la cámara
  return (
    <g>
      <path d={`M${x0},${y0} L${x0 - (W * (1 - c)) * 0.15},${y0 - up} L${xr - (W * (1 - c)) * 0.15},${y0 - up} L${xr},${y0 + H + dn} L${x0},${y0 + H} Z`} fill="none" />
      <path d={`M${x0},${y0} L${xr},${y0 - up} L${xr},${y0 + H + dn} L${x0},${y0 + H} Z`} fill="#2e2a32" stroke="#4a444e" strokeWidth={6} />
      {c > 0.3 && <path d={`M${x0 + (xr - x0) * 0.2},${y0 + 30} L${x0 + (xr - x0) * 0.8},${y0 + 30 - up * 0.6} L${x0 + (xr - x0) * 0.8},${y0 + H - 30 + dn * 0.6} L${x0 + (xr - x0) * 0.2},${y0 + H - 30} Z`} fill="#ff8a3a" opacity={0.75} />}
      <rect x={xr - 14} y={y0 + H / 2 - 6 - up / 2} width={22} height={12} rx={5} fill="#8a8490" />
    </g>
  );
};
// chispas que saltan de la estufa (x,y boca)
export const Chispas: React.FC<{ x: number; y: number; f: number; desde: number; n?: number; dur?: number }> = ({ x, y, f, desde, n = 16, dur = 26 }) => {
  if (f < desde || f > desde + dur) return null;
  const t = (f - desde) / dur;
  return <g>{Array.from({ length: n }).map((_, i) => { const a = -Math.PI / 2 + ((i / n) - 0.5) * 2.4; const v = 90 + ((i * 37) % 60) * 2; return <circle key={i} cx={x + Math.cos(a) * v * t} cy={y + Math.sin(a) * v * t + 260 * t * t} r={4 * (1 - t) + 1} fill={i % 2 ? "#ffd27a" : "#ff8a3a"} opacity={1 - t} />; })}</g>;
};
// un leño (mundo / en la mano)
export const Lenio: React.FC<{ rot?: number; s?: number }> = ({ rot = -20, s = 1 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}><rect x={-52} y={-15} width={104} height={30} rx={13} fill="#8a5a3a" /><path d="M-40,-8 h60 M-30,6 h56" stroke="#6a4028" strokeWidth={3} /><ellipse cx={52} cy={0} rx={10} ry={15} fill="#c89a6a" /><ellipse cx={52} cy={0} rx={5} ry={8} fill="none" stroke="#9a6a40" strokeWidth={2} /></g>
);

// ---------------------------------------------------------------------------------------------------------------
// una cuerda de leña como bloque (pantalla): x,y = esquina inferior izquierda, w (8 ft) h (4 ft), prog 0..1 crece
export const BloqueCuerda: React.FC<{ x: number; y: number; w: number; h: number; prog: number; fantasma?: boolean; seed?: number }> = ({ x, y, w, h, prog, fantasma, seed = 0 }) => {
  if (prog <= 0) return null;
  const filas = 5, cols = 10, r = Math.min(w / cols, h / filas) / 2;
  const n = Math.round(filas * cols * prog);
  return (
    <g opacity={fantasma ? 0.55 : 1}>
      {fantasma && <rect x={x} y={y - h} width={w} height={h} rx={8} fill="none" stroke={AMBAR} strokeWidth={4} strokeDasharray="12 10" />}
      {Array.from({ length: n }).map((_, k) => {
        const fi = Math.floor(k / cols), c = k % cols;
        const rr = r * (0.82 + (((k * 37 + seed * 11) % 10) / 10) * 0.2);
        const cx = x + r + c * 2 * r + (fi % 2 ? r * 0.3 : 0), cy = y - r - fi * 2 * r * 0.95;
        return <g key={k}><circle cx={cx} cy={cy} r={rr} fill={fantasma ? "#c8a070" : (k + seed) % 3 ? "#8a5a3a" : "#7a4a2e"} /><circle cx={cx} cy={cy} r={rr * 0.5} fill={fantasma ? "#e8c89a" : "#c89a6a"} /></g>;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// tarjeta de 90 días (mundo o pantalla): cuadrícula 15 × 6 que se llena
export const Cal90: React.FC<{ x: number; y: number; prog: number; s?: number }> = ({ x, y, prog, s = 1 }) => {
  const n = Math.round(90 * prog);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-6} y={-60} width={392} height={300} rx={14} fill="#f6f1e6" stroke="#00000033" strokeWidth={3} />
      <rect x={-6} y={-60} width={392} height={56} rx={14} fill="#e2483a" />
      <circle cx={190} cy={-74} r={8} fill="#3a2a22" />
      <text x={190} y={-20} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#ffffff" letterSpacing={2}>90 DAYS OF WINTER</text>
      {Array.from({ length: 90 }).map((_, i) => <rect key={i} x={10 + (i % 15) * 24.5} y={16 + Math.floor(i / 15) * 34} width={19} height={26} rx={4} fill={i < n ? "#3a8adf" : "#e0dbd0"} />)}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// escarcha de helecho (svg) en un rectángulo
export const EscarchaR: React.FC<{ x: number; y: number; w: number; h: number; o?: number }> = ({ x, y, w, h, o = 0.85 }) => (
  <g opacity={o}>
    <rect x={x} y={y} width={w} height={h} fill="#dfe8ff" opacity={0.22} />
    {Array.from({ length: 16 }).map((_, i) => {
      const lado = i % 4;
      const q = ((i * 0.37) % 1) * 0.9 + 0.05;
      const bx = lado < 2 ? x + q * w : lado === 2 ? x : x + w;
      const by = lado === 0 ? y : lado === 1 ? y + h : y + q * h;
      const ang = lado === 0 ? 90 : lado === 1 ? -90 : lado === 2 ? 0 : 180;
      const L = 110 + ((i * 53) % 120);
      const rad = ((ang + ((i * 29) % 40) - 20) * Math.PI) / 180;
      const ex = bx + Math.cos(rad) * L, ey = by + Math.sin(rad) * L;
      return <g key={i} stroke="#f4f8ff" strokeWidth={4} strokeLinecap="round" fill="none">
        <path d={`M${bx},${by} L${ex},${ey}`} />
        {[0.3, 0.5, 0.7, 0.88].map((t) => { const mx = bx + (ex - bx) * t, my = by + (ey - by) * t; const r2 = 26 * (1.1 - t); return <path key={t} d={`M${mx},${my} l${Math.cos(rad + 0.8) * r2},${Math.sin(rad + 0.8) * r2} M${mx},${my} l${Math.cos(rad - 0.8) * r2},${Math.sin(rad - 0.8) * r2}`} />; })}
      </g>;
    })}
  </g>
);

// mano con guante (pantalla): x,y punta, ang de la manga (grados, 0 = hacia abajo), color de la manga
export const ManoGuante: React.FC<{ x: number; y: number; ang?: number; manga?: string; guante?: string; s?: number; largo?: number }> = ({ x, y, ang = 30, manga = "#2f7f86", guante = "#3a3440", s = 1, largo = 900 }) => (
  <g transform={`translate(${x},${y}) rotate(${-ang}) scale(${s})`}>
    <rect x={-46} y={30} width={92} height={largo} rx={40} fill={manga} />
    <rect x={-50} y={30} width={100} height={40} rx={18} fill="#d9cdb2" />
    <ellipse cx={0} cy={0} rx={52} ry={60} fill={guante} />
    <ellipse cx={-50} cy={8} rx={18} ry={30} fill={guante} transform="rotate(-25 -50 8)" />
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// alarma de CO (objeto de mano o pared): x,y centro
export const AlarmaCO: React.FC<{ x?: number; y?: number; s?: number; on?: boolean; f?: number; caja?: boolean }> = ({ x = 0, y = 0, s = 1, on, f = 0, caja }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {caja && <rect x={-46} y={-50} width={92} height={100} rx={6} fill="#3a7ac0" />}
    <rect x={-38} y={-38} width={76} height={76} rx={16} fill="#f2ece0" stroke="#bdb6a8" strokeWidth={4} />
    {[0, 1, 2].map((k) => <rect key={k} x={-22} y={-20 + k * 10} width={44} height={4} rx={2} fill="#bdb6a8" />)}
    <circle cx={22} cy={22} r={7} fill={on && Math.floor(f / 5) % 2 ? "#ff3a2e" : "#5aff7a"} />
    <text x={-8} y={30} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#3a3440">CO</text>
    {on && Math.floor(f / 5) % 2 === 0 && <Halo x={0} y={0} r={150} color="#ff3a2e" fuerza={0.7} />}
  </g>
);

// medidor de CO en ppm (pantalla)
export const MedidorPPM: React.FC<{ x: number; y: number; ppm: number; desde: number; w?: number }> = ({ x, y, ppm, desde, w = 460 }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 8], [0, 1], cl);
  const v = Math.min(1, ppm / 400);
  const col = ppm < 70 ? "#5aff7a" : ppm < 200 ? AMBAR : "#e2483a";
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, fontFamily: F_HUD, color: "#f6ecd2" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 30, letterSpacing: 3, textShadow: "0 3px 10px rgba(0,0,0,.8)" }}><span>CO IN THE AIR</span><span style={{ color: col, fontVariantNumeric: "tabular-nums" }}>{Math.round(ppm)} ppm</span></div>
      <div style={{ marginTop: 8, height: 26, borderRadius: 14, background: "rgba(10,10,18,.8)", border: "3px solid #f6ecd255", overflow: "hidden" }}>
        <div style={{ width: `${v * 100}%`, height: "100%", background: `linear-gradient(90deg, #5aff7a, ${AMBAR} 40%, #e2483a)` }} />
      </div>
    </div>
  );
};

// gas de CO: velo gris que llena el cuarto desde arriba (mundo). n = nivel 0..1 (cuánto bajó)
export const GasCO: React.FC<{ x: number; w: number; techo: number; piso: number; n: number; f: number }> = ({ x, w, techo, piso, n, f }) => {
  const yb = techo + (piso - techo) * n;
  return (
    <g>
      <defs><linearGradient id="gasco" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8a8f9e" stopOpacity={0.55} /><stop offset="0.8" stopColor="#8a8f9e" stopOpacity={0.35} /><stop offset="1" stopColor="#8a8f9e" stopOpacity={0} /></linearGradient></defs>
      <path d={`M${x},${techo} H${x + w} V${yb} ${Array.from({ length: 10 }).map((_, i) => `Q${x + w - (i + 0.5) * w / 10},${yb + 40 * Math.sin(f / 20 + i)} ${x + w - (i + 1) * w / 10},${yb}`).join(" ")} Z`} fill="url(#gasco)" />
    </g>
  );
};

// texto «tic» que salta (pantalla) — el ruido de la estufa
export const Tic: React.FC<{ x: number; y: number; f: number; en: number[]; texto?: string; color?: string }> = ({ x, y, f, en, texto = "tick", color = AMBAR }) => (
  <>{en.map((e, i) => {
    if (f < e || f > e + 16) return null;
    const t = (f - e) / 16;
    return <div key={i} style={{ position: "absolute", left: x + i * 34, top: y - t * 26, opacity: 1 - t, transform: `rotate(${-8 + i * 6}deg) scale(${0.8 + 0.4 * Math.min(1, t * 4)})`, fontFamily: F_MANO, fontWeight: 700, fontSize: 52, color, textShadow: "0 3px 8px rgba(0,0,0,.6)" }}>{texto}</div>;
  })}</>
);

export const Texto: React.FC<{ x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string; children: React.ReactNode; centro?: boolean; peso?: number; sombra?: boolean }> = ({ x, y, desde, hasta = 1e9, tam = 48, color = "#f6ecd2", children, centro = true, peso = 600, sombra = true }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 7, hasta, hasta + 7], [0, 1, 1, 0], cl);
  const s = interpolate(f, [desde, desde + 10], [0.85, 1], ou);
  if (o <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `${centro ? "translateX(-50%) " : ""}scale(${s})`, fontFamily: F_HUD, fontWeight: peso, fontSize: tam, color, whiteSpace: "nowrap", letterSpacing: 2, textShadow: sombra ? "0 4px 16px rgba(0,0,0,.75)" : undefined }}>{children}</div>;
};



// ---------------------------------------------------------------------------------------------------------------
// plástico que se desenrolla sobre la ventana (mundo). V = ventana del living. prog 0..1 baja; cintas 0..1 cada esquina
export const PlasticoVentana: React.FC<{ V: { x: number; y: number; w: number; h: number }; prog: number; cintas: number[]; f: number }> = ({ V, prog, cintas, f }) => {
  const x0 = V.x - 34, y0 = V.y - 34, w = V.w + 68, H = V.h + 68;
  const h = H * prog;
  return (
    <g>
      <rect x={x0 - 10} y={y0 - 20} width={w + 20} height={22} rx={11} fill="#cfd8e6" stroke="#9aa6ba" strokeWidth={3} />
      {prog > 0.01 && <>
        <rect x={x0} y={y0} width={w} height={h} fill="#e4eefa" opacity={0.3} stroke="#c8d4e4" strokeWidth={3} />
        {[0.2, 0.55, 0.8].map((q) => <path key={q} d={`M${x0 + w * q},${y0 + 6} L${x0 + w * q - 30},${y0 + h - 6}`} stroke="#ffffff" strokeWidth={10} opacity={0.22} strokeLinecap="round" />)}
        <path d={`M${x0},${y0 + h} q${w / 4},${8 + Math.sin(f / 5) * 4} ${w / 2},0 t${w / 2},0`} stroke="#c8d4e4" strokeWidth={5} fill="none" />
      </>}
      {[[x0 - 6, y0 + H - 30], [x0 + w - 54, y0 + H - 30], [x0 - 6, y0 - 4], [x0 + w - 54, y0 - 4]].map(([cx, cy], i) => (cintas[i] ?? 0) > 0 ? <rect key={i} x={cx} y={cy} width={60 * cintas[i]} height={22} fill="#d9c27a" opacity={0.95} transform={`rotate(${i % 2 ? 35 : -35} ${cx + 30} ${cy + 11})`} /> : null)}
    </g>
  );
};

// troncos sin partir (rodajas grandes) en el piso (mundo)
export const Rodajas: React.FC<{ x: number; piso: number; n?: number }> = ({ x, piso, n = 5 }) => (
  <g>{Array.from({ length: n }).map((_, i) => { const cx = x + i * 92 + (i > 2 ? -230 : 0), cy = piso - 40 - (i > 2 ? 78 : 0); return <g key={i}><ellipse cx={cx} cy={cy} rx={44} ry={40} fill="#7a4a2e" /><ellipse cx={cx} cy={cy} rx={36} ry={32} fill="#c89a6a" />{[0.3, 0.6].map((q) => <ellipse key={q} cx={cx} cy={cy} rx={36 * q} ry={32 * q} fill="none" stroke="#9a6a40" strokeWidth={2} />)}</g>; })}</g>
);

// poste de luz con cables (mundo)
export const Poste: React.FC<{ x: number; piso: number; h?: number }> = ({ x, piso, h = 760 }) => (
  <g>
    <rect x={x - 14} y={piso - h} width={28} height={h} fill="#6a4a30" />
    <rect x={x - 110} y={piso - h + 40} width={220} height={16} fill="#5a3a24" />
    {[-90, -30, 30, 90].map((d) => <circle key={d} cx={x + d} cy={piso - h + 36} r={8} fill="#d8e0ea" />)}
    {[-90, -30, 30, 90].map((d) => <path key={d} d={`M${x + d},${piso - h + 36} q${d > 0 ? 400 : -400},70 ${d > 0 ? 1100 : -1100},${10 + Math.abs(d) * 0.3}`} stroke="#1a1620" strokeWidth={4} fill="none" />)}
  </g>
);

// aserrín que salta (mundo)
export const Aserrin: React.FC<{ x: number; y: number; f: number; on: boolean; dir?: number }> = ({ x, y, f, on, dir = 1 }) => !on ? null : (
  <g>{Array.from({ length: 16 }).map((_, i) => { const t = ((f * 1.7 + i * 7) % 20) / 20; const a = (-0.9 + (i % 5) * 0.35); return <circle key={i} cx={x + dir * Math.cos(a) * 150 * t} cy={y + Math.sin(a) * 70 * t + 140 * t * t} r={6 * (1 - t) + 2} fill={i % 2 ? "#e8c890" : "#c8a070"} opacity={1 - t} />; })}</g>
);

// el caño que revienta, en corte (pantalla 1920x1080): pared de casa vacía, caño de cobre, el hielo crece y lo parte
export const CanioCorte: React.FC<{ f: number; hielo: number; desde: number }> = ({ f, hielo, desde }) => {
  const y = 560, x0 = 120, x1 = 1800;
  const bul = Math.min(1, hielo * 1.2) * 26;
  const roto = f >= desde;
  const t = roto ? Math.min(1, (f - desde) / 14) : 0;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#2a2430" />
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={60 + i * 300} y={0} width={60} height={1080} fill="#6a5440" />)}
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={120 + i * 300} y={0} width={240} height={1080} fill="#e2a7a0" opacity={0.22} />)}
      <EscarchaR x={0} y={0} w={1920} h={1080} o={0.3 + hielo * 0.45} />
      <path d={`M${x0},${y - 40} H${960 - 170} Q960,${y - 40 - bul * 2} ${960 + 170},${y - 40} H${x1} V${y + 40} H${960 + 170} Q960,${y + 40 + bul * 2} ${960 - 170},${y + 40} H${x0} Z`} fill="#c8783a" stroke="#7a4420" strokeWidth={6} />
      <rect x={x0} y={y - 26} width={x1 - x0} height={52} fill="#5aa8e8" opacity={0.85} />
      <rect x={x0} y={y - 26} width={(960 - x0) * hielo} height={52} fill="#e8f4ff" />
      <rect x={x1 - (x1 - 960) * hielo} y={y - 26} width={(x1 - 960) * hielo} height={52} fill="#e8f4ff" />
      {[300, 600, 1300, 1600].map((xx) => <rect key={xx} x={xx - 16} y={y - 52} width={32} height={104} rx={4} fill="#9a5a2a" />)}
      {roto && <g>
        <path d={`M${960 - 30},${y - 44 - bul} l20,30 l-16,20 l26,28 l-10,30 l24,24`} stroke="#120f18" strokeWidth={8} fill="none" />
        {Array.from({ length: 18 }).map((_, i) => { const a = -Math.PI / 2 + ((i / 17) - 0.5) * 2.2; const v = (300 + (i % 4) * 90) * t; return <path key={i} d={`M960,${y - 30} L${960 + Math.cos(a) * v},${y - 30 + Math.sin(a) * v + 200 * t * t}`} stroke="#eaf6ff" strokeWidth={14 - (i % 3) * 3} strokeLinecap="round" opacity={0.9} />; })}
        <circle cx={960} cy={y} r={60 + 400 * t} fill="none" stroke="#ffffff" strokeWidth={14 * (1 - t) + 1} opacity={1 - t} />
        {t > 0.5 && [-300, -150, 140, 290].map((d, i) => <path key={i} d={`M${960 + d},${y + 50} l-12,${80 + i * 20} l24,0 Z`} fill="#eaf6ff" opacity={(t - 0.5) * 2} />)}
      </g>}
    </g>
  );
};

// caño de la estufa en corte con hollín (pantalla): hollin 0..1 tapa; humo que vuelve hacia el cuarto
export const HollinCorte: React.FC<{ f: number; hollin: number; vuelve: number }> = ({ f, hollin, vuelve }) => {
  const x = 960, ancho = 220, y0 = 60, y1 = 760;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#3a2e3c" />
      <rect x={0} y={900} width={1920} height={180} fill="#3a2a22" />
      <rect x={x - 260} y={y1} width={520} height={240} rx={20} fill="#26222a" />
      <rect x={x - 180} y={y1 + 60} width={360} height={130} rx={10} fill="#ff8a3a" opacity={0.85} />
      <Halo x={x} y={y1 + 120} r={420} color="#ff9a4a" fuerza={0.35} />
      <rect x={x - ancho / 2} y={y0} width={ancho} height={y1 - y0} fill="#0e0c10" stroke="#4a444e" strokeWidth={10} />
      {Array.from({ length: 19 }).map((_, i) => { const yy = y0 + 10 + i * 36; const w = hollin * (60 + ((i * 37) % 10) * 3); return <g key={i}><path d={`M${x - ancho / 2 + 5},${yy} q${w},14 0,36`} fill="#2a2628" stroke="#4a4446" strokeWidth={2} /><path d={`M${x + ancho / 2 - 5},${yy + 10} q${-w},14 0,36`} fill="#2a2628" stroke="#4a4446" strokeWidth={2} /></g>; })}
      {Array.from({ length: 14 }).map((_, i) => {
        const t = ((f / 30) + i / 14) % 1;
        const tope = y1 - (y1 - y0 - 80) * (1 - hollin * 0.75);
        const sube = t < 0.55;
        const yy = sube ? y1 - (t / 0.55) * (y1 - tope) : tope + ((t - 0.55) / 0.45) * 420 * vuelve;
        const xx = sube ? x + Math.sin(i + f / 10) * 18 : x + (i % 2 ? 1 : -1) * (130 + ((t - 0.55) / 0.45) * 440 * vuelve);
        return <circle key={i} cx={xx} cy={yy} r={20 + t * 34} fill="#9a9fae" opacity={(sube ? 0.6 : 0.6 * vuelve) * (1 - t * 0.4)} />;
      })}
      <defs><marker id="flh" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={4} markerHeight={4} orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#e2483a" /></marker></defs>
      {vuelve > 0.1 && [-1, 1].map((d) => <path key={d} d={`M${x + d * 140},${330} q${d * 220},30 ${d * 300},300`} stroke="#e2483a" strokeWidth={14} fill="none" strokeLinecap="round" opacity={vuelve} markerEnd="url(#flh)" />)}
    </g>
  );
};

// tarjeta de capa de ropa (pantalla): icono de prenda + rótulo + ✓/✗
export const TarjetaRopa: React.FC<{ x: number; y: number; desde: number; rotulo: string; ok: boolean; color: string; gotas?: number; calor?: number; prenda?: "buzo" | "remera" }> = ({ x, y, desde, rotulo, ok, color, gotas = 0, calor = 0, prenda = "buzo" }) => {
  const f = useF();
  if (f < desde) return null;
  const s = interpolate(f, [desde, desde + 10], [0.6, 1], ou), o = interpolate(f, [desde, desde + 6], [0, 1], cl);
  const W = 470, H = 150;
  return (
    <svg width={W + 60} height={H + 160} viewBox={`-30 -130 ${W + 60} ${H + 160}`} style={{ position: "absolute", left: x - W / 2 - 30, top: y - H / 2 - 130, opacity: o, transform: `scale(${s})`, overflow: "visible" }}>
      <rect x={0} y={0} width={W} height={H} rx={24} fill="#120f18" opacity={0.9} stroke={ok ? "#5ad07a" : "#e2483a"} strokeWidth={5} />
      <g transform={`translate(80,${H / 2})`}>
        {prenda === "buzo" ? <path d="M-50,-40 L-20,-50 Q0,-36 20,-50 L50,-40 L64,10 L44,16 L40,-6 L40,48 L-40,48 L-40,-6 L-44,16 L-64,10 Z" fill={color} stroke="#00000055" strokeWidth={3} />
          : <path d="M-46,-40 L-18,-48 Q0,-38 18,-48 L46,-40 L58,-14 L38,-6 L38,48 L-38,48 L-38,-6 L-58,-14 Z" fill={color} stroke="#00000055" strokeWidth={3} />}
        {prenda === "buzo" && [-24, 0, 24].map((d) => <path key={d} d={`M${d - 8},-10 l8,10 l8,-10`} stroke="#ffffff66" strokeWidth={3} fill="none" />)}
        {gotas > 0 && [[-20, -6], [10, 14], [22, -18], [-8, 26]].map(([gx, gy], i) => <path key={i} d={`M${gx},${gy - 12} q9,13 0,20 q-9,-7 0,-20 Z`} fill="#5aa8e8" opacity={Math.max(0, Math.min(1, gotas * 4 - i))} />)}
        {calor > 0 && [-30, 0, 30].map((d, i) => { const t = ((f / 18) + i / 3) % 1; return <path key={d} d={`M${d},${-56 - t * 50} q-10,-12 0,-24 q10,-12 0,-24`} stroke="#ff9a4a" strokeWidth={6} fill="none" strokeLinecap="round" opacity={calor * (1 - t)} />; })}
      </g>
      <text x={160} y={H / 2 + 14} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#f6ecd2" letterSpacing={1}>{rotulo}</text>
      <g transform={`translate(${W - 46},${H / 2})`}>{ok ? <path d="M-20,0 L-6,16 L22,-18" stroke="#5ad07a" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M-18,-18 L18,18 M18,-18 L-18,18" stroke="#e2483a" strokeWidth={10} strokeLinecap="round" />}</g>
    </svg>
  );
};

// dos figuras: una se ilumina (mitad de la humanidad) — pantalla
export const MitadHumanidad: React.FC<{ x: number; y: number; desde: number }> = ({ x, y, desde }) => {
  const f = useF();
  if (f < desde) return null;
  const o = interpolate(f, [desde, desde + 8], [0, 1], cl);
  const prog = interpolate(f, [desde + 10, desde + 30], [0, 1], cl);
  return (
    <svg width={560} height={340} viewBox="0 0 560 340" style={{ position: "absolute", left: x - 280, top: y - 170, opacity: o, overflow: "visible" }}>
      <rect x={0} y={0} width={560} height={340} rx={30} fill="#120f18" opacity={0.88} stroke={AMBAR} strokeWidth={4} />
      {[0, 1].map((i) => { const c = i === 1 && prog > 0 ? AMBAR : "#6a6474"; return <g key={i} transform={`translate(${170 + i * 220},150)`}>
        <circle cx={0} cy={-46} r={34} fill={c} />
        <path d="M-56,90 Q-56,-4 0,-4 Q56,-4 56,90 Z" fill={c} />
        {i === 1 && prog > 0 && <circle cx={0} cy={20} r={60 + 60 * prog} fill="none" stroke={AMBAR} strokeWidth={4} opacity={1 - prog * 0.7} />}
      </g>; })}
      <text x={280} y={312} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#f6ecd2" letterSpacing={2}>1 OF 2 = HALF OF HUMANITY</text>
    </svg>
  );
};

// etiqueta de precio que cuelga de un hilo (mundo): x,y = punto de donde cuelga
export const Precio: React.FC<{ x: number; y: number; texto: string; f: number; o?: number; s?: number }> = ({ x, y, texto, f, o = 1, s = 1 }) => (
  <g opacity={o} transform={`translate(${x},${y}) rotate(${Math.sin(f / 9) * 6}) scale(${s})`}>
    <path d="M0,0 L0,30" stroke="#f6ecd2" strokeWidth={2} />
    <path d="M-38,30 L38,30 L38,94 L-38,94 Z" fill="#f2d24a" stroke="#8a6a1a" strokeWidth={3} />
    <circle cx={0} cy={40} r={5} fill="#120f18" />
    <text x={0} y={82} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={32} fill="#2a2228">{texto}</text>
  </g>
);

// sol de invierno que baja detrás del horizonte (mundo): baja 0..1
export const SolBajo: React.FC<{ x: number; y: number; baja: number }> = ({ x, y, baja }) => (
  <g>
    <Halo x={x} y={y + baja * 260} r={520} color="#ffb05a" fuerza={0.55 * (1 - baja * 0.6)} />
    <circle cx={x} cy={y + baja * 260} r={70} fill="#ffcf8a" />
  </g>
);

// marco de película (pantalla svg)
export const MarcoPeli: React.FC<{ x: number; y: number; w: number; h: number; o: number; rotulo?: string }> = ({ x, y, w, h, o, rotulo }) => (
  <g opacity={o}>
    <path d={`M${x - 100},${y - 100} H${x + w + 100} V${y + h + 100} H${x - 100} Z M${x},${y} V${y + h} H${x + w} V${y} Z`} fill="#120f18" fillRule="evenodd" />
    {Array.from({ length: Math.floor(w / 70) }).map((_, i) => <g key={i}><rect x={x + 10 + i * 70} y={y - 70} width={40} height={30} rx={6} fill="#f6ecd2" opacity={0.8} /><rect x={x + 10 + i * 70} y={y + h + 40} width={40} height={30} rx={6} fill="#f6ecd2" opacity={0.8} /></g>)}
    {rotulo && <g><rect x={x + 20} y={y + 20} width={rotulo.length * 30 + 40} height={64} rx={10} fill="#120f18" opacity={0.85} /><text x={x + 40} y={y + 68} fontFamily={F_HUD} fontWeight={700} fontSize={44} fill="#f6ecd2" letterSpacing={4}>{rotulo}</text></g>}
  </g>
);

// molécula de CO (pantalla svg o mundo)
export const MoleculaCO: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number }> = ({ x, y, s = 1, o = 1, rot = 0 }) => (
  <g opacity={o} transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-20,-6 H20 M-20,6 H20" stroke="#cfd4e4" strokeWidth={6} />
    <circle cx={-34} cy={0} r={26} fill="#3a3a44" stroke="#cfd4e4" strokeWidth={3} />
    <circle cx={36} cy={0} r={30} fill="#c0352c" stroke="#ffb0a8" strokeWidth={3} />
    <text x={-34} y={9} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={26} fill="#f6ecd2">C</text>
    <text x={36} y={10} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={28} fill="#f6ecd2">O</text>
  </g>
);

// reloj de congelamiento (pantalla): anillo que se vacía con minutos
export const RelojHielo: React.FC<{ x: number; y: number; desde: number; prog: number; rotulo: string; valor: string }> = ({ x, y, desde, prog, rotulo, valor }) => {
  const f = useF();
  if (f < desde) return null;
  const o = interpolate(f, [desde, desde + 7], [0, 1], cl), s = interpolate(f, [desde, desde + 10], [0.7, 1], ou);
  const R = 92, C = 2 * Math.PI * R;
  return (
    <svg width={460} height={330} viewBox="-230 -120 460 330" style={{ position: "absolute", left: x - 230, top: y - 120, opacity: o, transform: `scale(${s})`, overflow: "visible" }}>
      <circle cx={0} cy={0} r={R + 18} fill="#120f18" opacity={0.88} />
      <circle cx={0} cy={0} r={R} fill="none" stroke="#2a3a5a" strokeWidth={16} />
      <circle cx={0} cy={0} r={R} fill="none" stroke="#9bd0ff" strokeWidth={16} strokeDasharray={`${C * (1 - prog)} ${C}`} transform="rotate(-90)" strokeLinecap="round" />
      <text x={0} y={18} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={54} fill="#eaf6ff">{valor}</text>
      <rect x={-210} y={130} width={420} height={60} rx={30} fill="#120f18" opacity={0.88} />
      <text x={0} y={172} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#9bd0ff" letterSpacing={2}>{rotulo}</text>
    </svg>
  );
};
