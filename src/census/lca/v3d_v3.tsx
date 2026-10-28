// lc01 · vuelta 3 (v3d, planos 44-57): componentes nuevos. Sólo los usa lc01_planos2.tsx (P44-P57).
// · Desfase: corre el reloj de un plano (para que en un fundido de Montaje el plano vecino se dibuje igual → corte limpio, sin fantasma)
// · GloboA: globo con la cola a un punto exacto (la boca de quien habla)
// · props de mundo: Colchon, PuertaCasa, CartelCalle, CartelTienda (apagado), Venda (muela), SacoDormir, Frasco, Llave,
//   CajaHerr, Tocon, Escarcha de esquina (tapa la «aleta» del set), Antena rota (la línea que se corta río arriba)
// · PuenteV3: el set Puente con el muelle del faro anclado y, opcional, la ciudad al otro lado del agua que se apaga en OLA
// · GraficoFrio: mínimas de cada mes, grande y legible (eje del cero, enero bajo cero)
// · Picto2: «una herida = la mitad de la humanidad» (dos figuras, una se apaga)
import React, { useContext } from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { OffsetCtx, useF } from "../../anikit/camara";
import { F_GLOBO, F_HUD } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { osc } from "../../anikit/sets/comun";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { F_MONO, FRIO } from "../hud";
import { Puente } from "../mundo/puente";
import { LUCES } from "../mundo/hora";
import { io, lerp, ManoLapiz, tw } from "./lc01_planos2_comp";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- reloj corrido
export const Desfase: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const o = useContext(OffsetCtx);
  return <OffsetCtx.Provider value={o + d}>{children}</OffsetCtx.Provider>;
};
// cuadros de un plano de lc01 (mismo redondeo que lc01_Completo)
export const durDe = (a: number, b: number) => Math.round(b * 30) - Math.round(a * 30);

// ---------------------------------------------------------------- globo con cola a un punto (pantalla)
export const GloboA: React.FC<{ texto: string; x: number; y: number; tx: number; ty: number; desde: number; hasta: number; tam?: number }> = ({ texto, x, y, tx, ty, desde, hasta, tam = 44 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 12, stiffness: 170 } });
  const o = interpolate(f, [hasta - 8, hasta], [1, 0], CL);
  const w = texto.length * tam * 0.5 + 56, h = tam + 34;
  // base de la cola: en el borde de abajo, del lado del punto
  const bx = Math.max(x - w / 2 + 40, Math.min(x + w / 2 - 70, tx - 15));
  const cx = x, cy = y;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o }} width={1920} height={1080} viewBox="0 0 1920 1080">
      <g transform={`translate(${tx},${ty}) scale(${s}) translate(${-tx},${-ty})`}>
        <rect x={cx - w / 2 + 4} y={cy - h / 2 + 7} width={w} height={h} rx={24} fill="#000" opacity={0.25} />
        <path d={`M${bx},${cy + h / 2 - 4} L${tx},${ty} L${bx + 34},${cy + h / 2 - 4} Z`} fill="#fbf8f1" stroke="#221c18" strokeWidth={3} strokeLinejoin="round" />
        <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={24} fill="#fbf8f1" stroke="#221c18" strokeWidth={3} />
        <rect x={bx + 2} y={cy + h / 2 - 8} width={30} height={8} fill="#fbf8f1" />
        <text x={cx} y={cy + tam * 0.36} textAnchor="middle" fontFamily={F_GLOBO} fontSize={tam} fill="#221c18">{texto}</text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- texto de pantalla sobre zona limpia (con caja tenue)
export const Rotulo3: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number; caja?: boolean }> = ({ texto, x, y, desde, hasta = 1e9, color = "#f6ecd2", tam = 40, caja = true }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 140 } });
  const o = Math.min(interpolate(f, [desde, desde + 10], [0, 1], CL), interpolate(f, [hasta, hasta + 10], [1, 0], CL));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * 14}px)`, opacity: o, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color, whiteSpace: "nowrap", padding: caja ? "8px 26px" : 0, borderRadius: 40, background: caja ? "rgba(12,10,20,0.62)" : "none", border: caja ? `3px solid ${color}` : "none" }}>{texto}</div>
  );
};

// ---------------------------------------------------------------- colchón (mundo): centro (x,y), largo w, ángulo rot
export const Colchon: React.FC<{ x: number; y: number; rot?: number; w?: number; h?: number; comba?: number }> = ({ x, y, rot = 0, w = 250, h = 46, comba = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <path d={`M${-w / 2},${-h / 2 + 10} Q${-w / 2},${-h / 2} ${-w / 2 + 12},${-h / 2} Q0,${-h / 2 + comba} ${w / 2 - 12},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 10} V${h / 2 - 10} Q${w / 2},${h / 2} ${w / 2 - 12},${h / 2} Q0,${h / 2 + comba} ${-w / 2 + 12},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - 10} Z`} fill="#e9e2f0" stroke="#8a7a9a" strokeWidth={4} />
    {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${-w / 2 + 22 + i * ((w - 44) / 6)},${-h / 2 + 5} V${h / 2 - 5}`} stroke="#7a8ab8" strokeWidth={5} opacity={0.55} />)}
    <rect x={-w / 2 + 6} y={-3} width={w - 12} height={6} rx={3} fill="#b8a8c8" />
  </g>
);

// ---------------------------------------------------------------- puerta grande de la casa de ladrillo (mundo). abre 0..1
export const PuertaCasa: React.FC<{ x: number; piso: number; abre: number; w?: number; h?: number }> = ({ x, piso, abre, w = 116, h = 236 }) => {
  const x0 = x - w / 2, y0 = piso - h;
  const hoja = w * (1 - 0.82 * abre);
  return (
    <g>
      <rect x={x0 - 14} y={y0 - 14} width={w + 28} height={h + 14} fill="#4a2a24" />
      <rect x={x0} y={y0} width={w} height={h} fill="#16121a" />
      <rect x={x0} y={y0} width={hoja} height={h} fill="#5a3426" />
      <rect x={x0 + hoja * 0.14} y={y0 + 22} width={hoja * 0.72} height={84} fill="#4a2a1e" />
      <rect x={x0 + hoja * 0.14} y={y0 + 124} width={hoja * 0.72} height={90} fill="#4a2a1e" />
      {abre < 0.5 && <circle cx={x0 + hoja - 16} cy={y0 + 128} r={7} fill="#d8b46a" />}
      <rect x={x0 - 24} y={piso - 6} width={w + 48} height={10} fill="#6a4a40" />
    </g>
  );
};

// ---------------------------------------------------------------- cartel de esquina (mundo)
export const CartelCalle: React.FC<{ x: number; piso: number; txt: string; alto?: number; nieve?: number }> = ({ x, piso, txt, alto = 380, nieve = 0 }) => {
  const W = txt.length * 22 + 40;
  return (
    <g>
      <rect x={x - 5} y={piso - alto} width={10} height={alto} fill="#3a3a42" />
      <rect x={x - W / 2} y={piso - alto - 4} width={W} height={46} rx={6} fill="#2f6a4a" stroke="#eef2ea" strokeWidth={3} />
      <text x={x} y={piso - alto + 29} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={28} letterSpacing={2} fill="#ffffff">{txt}</text>
      {nieve > 0 && <rect x={x - W / 2} y={piso - alto - 10} width={W} height={8} rx={4} fill="#eef2fa" opacity={nieve} />}
    </g>
  );
};

// ---------------------------------------------------------------- cartel de negocio apagado (mundo)
export const CartelTienda: React.FC<{ x: number; y: number; txt: string; fondo?: string; color?: string; tam?: number; colgado?: string }> = ({ x, y, txt, fondo = "#d8d2c6", color = "#2a5a7a", tam = 34, colgado }) => {
  const W = txt.length * tam * 0.68 + 40;
  return (
    <g>
      <rect x={x - W / 2 + 4} y={y - tam - 6} width={W} height={tam + 22} rx={6} fill="#000" opacity={0.25} />
      <rect x={x - W / 2} y={y - tam - 10} width={W} height={tam + 22} rx={6} fill={fondo} />
      <text x={x} y={y} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={tam} letterSpacing={3} fill={color} opacity={0.75}>{txt}</text>
      {colgado && <g transform={`translate(${x},${y + 70}) rotate(-4)`}>
        <path d="M-30,-58 L0,-78 L30,-58" stroke="#2a2228" strokeWidth={3} fill="none" />
        <rect x={-60} y={-58} width={120} height={44} rx={4} fill="#f2ece0" stroke="#2a2228" strokeWidth={3} />
        <text x={0} y={-27} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={24} letterSpacing={2} fill={ROJO_CENSO}>{colgado}</text>
      </g>}
    </g>
  );
};

// ---------------------------------------------------------------- muela infectada: venda + cachete hinchado + latido (mundo)
// (hx, hy) = centro de la cabeza; dir = hacia dónde mira
export const Venda: React.FC<{ hx: number; hy: number; dir?: number; late?: number; o?: number }> = ({ hx, hy, dir = 1, late = 1, o = 1 }) => {
  const f = useF();
  const p = 0.5 + 0.5 * Math.sin(f / 4.5);
  const bx = hx - dir * 22; // la venda pasa por detrás de la oreja: de la pera a la coronilla
  return (
    <g opacity={o}>
      {/* cachete hinchado (sobresale del contorno de la cara) */}
      <circle cx={hx + dir * 30} cy={hy + 22} r={25 + 2 * p * late} fill="#0e0b10" />
      <path d={`M${hx + dir * 4},${hy + 44} Q${bx},${hy + 60} ${bx - dir * 6},${hy + 20} L${bx - dir * 4},${hy - 30} Q${bx},${hy - 52} ${hx - dir * 2},${hy - 48}`} fill="none" stroke="#f2ece0" strokeWidth={17} strokeLinecap="round" />
      <path d={`M${hx + dir * 4},${hy + 44} Q${bx},${hy + 60} ${bx - dir * 6},${hy + 20} L${bx - dir * 4},${hy - 30}`} fill="none" stroke="#cfc6b6" strokeWidth={3} strokeDasharray="5 9" />
      <ellipse cx={hx - dir * 12} cy={hy - 60} rx={14} ry={9} fill="#f2ece0" transform={`rotate(-30 ${hx - dir * 12} ${hy - 60})`} />
      <ellipse cx={hx + dir * 12} cy={hy - 60} rx={14} ry={9} fill="#f2ece0" transform={`rotate(30 ${hx + dir * 12} ${hy - 60})`} />
      <circle cx={hx} cy={hy - 56} r={6} fill="#e2dccf" />
      {late > 0 && [0, 1, 2].map((i) => {
        const a = (-50 + i * 40) * (Math.PI / 180);
        const r0 = 44 + 6 * p, r1 = 62 + 8 * p;
        const cx = hx + dir * 34, cy = hy + 22;
        return <path key={i} d={`M${cx + dir * Math.cos(a) * r0},${cy + Math.sin(a) * r0} L${cx + dir * Math.cos(a) * r1},${cy + Math.sin(a) * r1}`} stroke="#ff5a4a" strokeWidth={6} strokeLinecap="round" opacity={late * (0.5 + 0.5 * p)} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- objetos de mano (dibujados derechos: usar con rot)
export const SacoDormir: React.FC<{ color?: string; etiqueta?: boolean }> = ({ color = "#2f6a8a", etiqueta }) => (
  <g transform="translate(0,26)">
    <rect x={-46} y={-30} width={92} height={60} rx={28} fill={color} />
    <ellipse cx={46} cy={0} rx={14} ry={30} fill={osc(color, 0.7)} />
    <ellipse cx={46} cy={0} rx={7} ry={18} fill={osc(color, 0.5)} />
    {[-20, 18].map((x) => <rect key={x} x={x} y={-32} width={8} height={64} fill="#1a1a1e" opacity={0.6} />)}
    {etiqueta && <g><path d="M-26,30 L-30,52" stroke="#c8bfae" strokeWidth={2} /><rect x={-58} y={52} width={56} height={30} rx={3} fill="#f2ece0" /><text x={-30} y={73} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={14} fill="#1d3a8a">−30°F</text></g>}
  </g>
);
export const Llave: React.FC = () => (<g><circle cx={0} cy={-6} r={8} fill="none" stroke="#d8b46a" strokeWidth={4} /><rect x={-2} y={2} width={4} height={20} fill="#d8b46a" /><rect x={2} y={14} width={6} height={4} fill="#d8b46a" /></g>);
export const CajaHerr: React.FC = () => (
  <g transform="translate(0,40)">
    <path d="M-16,-46 Q0,-62 16,-46" stroke="#2a2228" strokeWidth={6} fill="none" />
    <rect x={-48} y={-44} width={96} height={52} rx={6} fill="#c0352c" />
    <rect x={-48} y={-30} width={96} height={6} fill="#8a2420" />
    <rect x={-8} y={-30} width={16} height={10} fill="#d8d2c8" />
  </g>
);
// frasco de nafta: u = 0 (nueva, ámbar clara) … 1 (vieja: marrón con borra)
export const Frasco: React.FC<{ u: number; s?: number }> = ({ u, s = 1 }) => {
  const c = u < 0.5 ? mezcla("#ffcf5a", "#c8862a", u * 2) : mezcla("#c8862a", "#4a321e", (u - 0.5) * 2);
  return (
    <g transform={`scale(${s}) translate(0,-30)`}>
      <rect x={-26} y={-44} width={52} height={16} rx={3} fill="#5a646c" />
      <path d="M-30,-28 H30 V44 Q30,54 20,54 H-20 Q-30,54 -30,44 Z" fill="#dfefff" opacity={0.35} stroke="#bfd8f0" strokeWidth={3} />
      <path d="M-27,-6 H27 V44 Q27,51 20,51 H-20 Q-27,51 -27,44 Z" fill={c} opacity={0.88} />
      {u > 0.55 && Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={-20 + i * 6.5} cy={46 - (i % 3) * 3} r={3 + (i % 2) * 2} fill="#2a1a10" opacity={(u - 0.55) * 2} />)}
      <rect x={-22} y={-24} width={8} height={60} rx={4} fill="#ffffff" opacity={0.4} />
    </g>
  );
};
const mezcla = (a: string, b: string, t: number) => {
  const h = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
  const m = (i: number) => { const v = Math.round(lerp(h(a, i), h(b, i), Math.max(0, Math.min(1, t)))).toString(16); return v.length < 2 ? "0" + v : v; };
  return `#${m(0)}${m(1)}${m(2)}`;
};

// ---------------------------------------------------------------- tocón de leña para sentarse (mundo): alto ≈ asiento
export const Tocon: React.FC<{ x: number; piso: number; alto?: number; w?: number }> = ({ x, piso, alto = 58, w = 96 }) => (
  <g>
    <ellipse cx={x} cy={piso + 2} rx={w * 0.62} ry={9} fill="#000" opacity={0.3} />
    <rect x={x - w / 2} y={piso - alto} width={w} height={alto} rx={6} fill="#7a4a2e" />
    {[0.2, 0.45, 0.72].map((k) => <rect key={k} x={x - w / 2 + w * k} y={piso - alto + 6} width={4} height={alto - 10} fill="#5a3420" opacity={0.6} />)}
    <ellipse cx={x} cy={piso - alto} rx={w / 2} ry={11} fill="#c89a6a" />
    <ellipse cx={x} cy={piso - alto} rx={w / 4} ry={5} fill="none" stroke="#a87a4a" strokeWidth={2} />
  </g>
);

// ---------------------------------------------------------------- escarcha de esquina (mundo): el set Living dibuja en invierno/noche
// dos «aletas» lisas en las esquinas del vidrio; acá se les ponen ramas de helecho de escarcha encima para que se lean como hielo
export const EscarchaEsquina: React.FC<{ u?: number }> = ({ u = 1 }) => {
  const V = { x: 1060, y: 230, w: 480, h: 420 };
  const rama = (ox: number, oy: number, ang: number, L: number, k: string) => {
    const a = (ang * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const Lu = L * u;
    return (
      <g key={k}>
        <path d={`M${ox},${oy} l${c * Lu},${s * Lu}`} stroke="#f4f8ff" strokeWidth={3} strokeLinecap="round" />
        {[0.3, 0.5, 0.7, 0.88].filter((t) => t * L < Lu).map((t) => {
          const px = ox + c * L * t, py = oy + s * L * t, r = 18 * (1 - t * 0.6);
          const a1 = a + 0.8, a2 = a - 0.8;
          return <path key={t} d={`M${px},${py} l${Math.cos(a1) * r},${Math.sin(a1) * r} M${px},${py} l${Math.cos(a2) * r},${Math.sin(a2) * r}`} stroke="#f4f8ff" strokeWidth={2} strokeLinecap="round" opacity={0.9} />;
        })}
      </g>
    );
  };
  return (
    <g opacity={0.95}>
      {rama(V.x + 4, V.y + V.h - 4, -62, 150, "a")}
      {rama(V.x + 4, V.y + V.h - 4, -35, 130, "b")}
      {rama(V.x + 4, V.y + V.h - 4, -12, 120, "c")}
      {rama(V.x + 40, V.y + V.h - 60, -80, 70, "d")}
      {rama(V.x + V.w - 4, V.y + 4, 118, 150, "e")}
      {rama(V.x + V.w - 4, V.y + 4, 145, 140, "f")}
      {rama(V.x + V.w - 4, V.y + 4, 168, 120, "g")}
      {rama(V.x + V.w - 50, V.y + 60, 100, 70, "h")}
    </g>
  );
};

// ---------------------------------------------------------------- set Puente con el faro ANCLADO y la ciudad al otro lado (OLA)
// ciudad: frente(f) = x del MUNDO-lejos hasta donde la ciudad ya se apagó (de derecha a izquierda: apaga lo que está a la DERECHA de frente)
type PV3 = Record<string, any> & { capa: "lejos" | "medio" | "frente"; f: number; ciudad?: boolean; apagaDesde?: number; farolas?: number; hospital?: number };
const CIUDAD = Array.from({ length: 34 }).map((_, i) => {
  const w = 60 + random(`cw${i}`) * 70;
  return { i, w, h: 40 + random(`ch${i}`) * 110, x: 380 + i * 54 + random(`cx${i}`) * 16 };
});
const HOSP_L = { x: 900, w: 120, h: 190 };
export const PuenteV3: React.FC<PV3> = (props) => {
  const { capa, ciudad = false, apagaDesde = 1e9, farolas, hospital = 1, hora = "noche", luces = 1 } = props;
  const L = LUCES[hora as keyof typeof LUCES];
  const base = <Puente {...(props as any)} luces={farolas ?? luces} />;
  if (capa !== "lejos") return base;
  const vivo = (x: number) => x < apagaDesde;
  return (
    <g>
      {base}
      {/* muelle de piedra con el faro apoyado: rompeolas con base, nieve y el faro con su base ancha */}
      <path d="M-640,606 L300,600 L330,626 L-640,632 Z" fill="#4a4456" />
      <path d="M-640,606 L300,600 L330,610 L-640,614 Z" fill={L.nieve} opacity={0.75} />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-620 + i * 78} y={612} width={50} height={12} rx={4} fill="#3a3446" />)}
      <path d="M252,602 L314,602 L304,580 L262,580 Z" fill="#d8d2c8" />
      <rect x={270} y={510} width={26} height={72} fill="#e8e2d8" />
      <rect x={270} y={540} width={26} height={10} fill="#c0352c" />
      <rect x={262} y={500} width={42} height={14} fill="#2a2230" />
      <circle cx={283} cy={492} r={8} fill={luces > 0.3 ? "#ffcf6e" : "#3a3040"} />
      {luces > 0.3 && <Halo x={283} y={492} r={60} color="#ffcf6e" fuerza={0.6} />}
      {ciudad && <g>
        {/* la costa de enfrente: colina baja con las manzanas de Duluth */}
        <path d="M330,566 Q900,540 1500,546 Q2100,552 2400,540 L2400,580 L330,580 Z" fill={osc(L.tinte, 0.42)} />
        {CIUDAD.map((b) => {
          const on = vivo(b.x + b.w / 2);
          const y0 = 566 - b.h;
          return <g key={b.i}>
            <rect x={b.x} y={y0} width={b.w} height={b.h + 6} fill={osc("#3a2e44", 0.85 + (b.i % 3) * 0.06)} />
            {Array.from({ length: Math.floor(b.h / 26) }).map((_, r) => Array.from({ length: Math.max(1, Math.floor((b.w - 14) / 20)) }).map((__, c) => random(`cv${b.i}${r}${c}`) < 0.55 ?
              <rect key={`${r}${c}`} x={b.x + 8 + c * 20} y={y0 + 10 + r * 26} width={10} height={12} fill={on ? AMBAR : "#231c2c"} opacity={on ? 0.9 : 1} /> : null))}
          </g>;
        })}
        {/* St. Mary's: alto, con cartel */}
        <rect x={HOSP_L.x} y={566 - HOSP_L.h} width={HOSP_L.w} height={HOSP_L.h + 6} fill="#4a3a54" />
        {Array.from({ length: 7 }).map((_, r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={HOSP_L.x + 10 + c * 27} y={566 - HOSP_L.h + 22 + r * 24} width={14} height={13} fill={hospital > 0.5 ? "#fff1b8" : "#231c2c"} />))}
        <rect x={HOSP_L.x + 6} y={566 - HOSP_L.h - 26} width={HOSP_L.w - 12} height={22} rx={3} fill="#1b1520" />
        <text x={HOSP_L.x + HOSP_L.w / 2} y={566 - HOSP_L.h - 9} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={14} fill={hospital > 0.5 ? "#ffffff" : "#5a5060"}>ST. MARY'S</text>
        {hospital > 0.5 && <Halo x={HOSP_L.x + 60} y={470} r={150} color="#fff1b8" fuerza={0.35} />}
        {/* calle de la costa: faroles en fila (se apagan con la ola) */}
        {Array.from({ length: 22 }).map((_, i) => { const x = 360 + i * 90; return vivo(x) ? <circle key={i} cx={x} cy={571} r={4} fill="#ffd9a0" /> : null; })}
        {/* reflejo en el agua */}
        {Array.from({ length: 18 }).map((_, i) => { const x = 400 + i * 105; return vivo(x) ? <rect key={i} x={x} y={584 + (i % 3) * 7} width={36} height={3} rx={2} fill={AMBAR} opacity={0.35} /> : null; })}
      </g>}
    </g>
  );
};

// ---------------------------------------------------------------- mínimas de cada mes (pantalla): grande, sin caja, eje del cero
const MESES3: [string, number][] = [["OCT", 36], ["NOV", 23], ["DEC", 8], ["JAN", -1], ["FEB", 3], ["MAR", 15]];
export const GraficoFrio: React.FC<{ x: number; y: number; desde: number; marca: number; hasta?: number; k?: number }> = ({ x, y, desde, marca, hasta = 1e9, k = 4 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 12) return null;
  const o = Math.min(interpolate(f, [desde, desde + 10], [0, 1], CL), interpolate(f, [hasta, hasta + 12], [1, 0], CL));
  const cero = 200, paso = 120;
  const jan = tw(f, marca, marca + 14, 0, 1);
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: 760, height: 360, overflow: "visible", opacity: o }} viewBox="-30 -40 760 360">
      <rect x={-30} y={-40} width={760} height={360} rx={24} fill="#0c0e1c" opacity={0.55} />
      <text x={0} y={2} fontFamily={F_HUD} fontWeight={600} fontSize={30} letterSpacing={3} fill="#f6ecd2">AVERAGE LOW (°F) · DULUTH</text>
      <line x1={0} y1={cero} x2={700} y2={cero} stroke="#f6ecd2" strokeWidth={3} />
      {MESES3.map(([m, v], i) => {
        const s = f < desde + 6 + i * 6 ? 0 : spring({ frame: f - desde - 6 - i * 6, fps, config: { damping: 16, stiffness: 110 } });
        const h = v * k * s;
        const xx = 20 + i * paso;
        const esJan = m === "JAN";
        const c = v < 0 ? FRIO : "#c8bfae";
        return <g key={m}>
          <rect x={xx} y={h >= 0 ? cero - h : cero} width={80} height={Math.max(3, Math.abs(h))} rx={6} fill={c} opacity={esJan ? 1 : 0.75} />
          {s > 0.6 && <text x={xx + 40} y={h >= 0 ? cero - h - 12 : cero + Math.abs(h) + 30} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={26} fill={esJan ? FRIO : "#f6ecd2"}>{v}°</text>}
          <text x={xx + 40} y={cero + (v < 0 ? 66 : 34)} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={24} fill={esJan ? FRIO : "#c8bfae"}>{m}</text>
          {esJan && jan > 0 && <rect x={xx - 10} y={cero - 18} width={100} height={110} rx={10} fill="none" stroke={FRIO} strokeWidth={4} opacity={jan} />}
        </g>;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- una herida = la mitad de la humanidad (pantalla, sobre pared lisa)
export const Picto2: React.FC<{ x: number; y: number; desde: number; herida: number; apaga: number; texto: number; hasta?: number }> = ({ x, y, desde, herida, apaga, texto, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 150 } });
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  const g = tw(f, apaga, apaga + 14, 0, 1);
  const hb = tw(f, herida, herida + 8, 0, 1);
  const t = tw(f, texto, texto + 10, 0, 1);
  const persona = (cx: number, c: string, gris: number, s2: number) => (
    <g transform={`translate(${cx},0) scale(${s2})`}>
      <circle cy={-130} r={44} fill={mezcla(c, "#3a3446", gris)} />
      <path d="M-58,90 Q-64,-60 0,-70 Q64,-60 58,90 Z" fill={mezcla(c, "#3a3446", gris)} />
    </g>
  );
  return (
    <svg style={{ position: "absolute", left: x - 300, top: y - 230, width: 600, height: 420, overflow: "visible", opacity: o }} viewBox="-300 -230 600 420">
      <rect x={-300} y={-230} width={600} height={420} rx={26} fill="#120f18" opacity={0.6 * s} />
      <g transform={`scale(${0.8 + 0.2 * s})`}>
        {persona(-110, "#2f7f86", 0, 1)}
        {persona(110, "#c8582b", g, 1)}
        {hb > 0 && <g transform={`translate(110,-10) scale(${hb})`}><rect x={-30} y={-9} width={60} height={18} rx={4} fill="#f2ece0" /><path d="M-4,-9 V9 M4,-9 V9" stroke="#e2483a" strokeWidth={3} /></g>}
        {g > 0 && <path d={`M60,-180 L${60 + 100 * g},${-180 + 260 * g} M160,-180 L${160 - 100 * g},${-180 + 260 * g}`} stroke="#e2483a" strokeWidth={14} strokeLinecap="round" />}
      </g>
      {t > 0 && <text x={0} y={160} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={38} letterSpacing={2} fill="#f6ecd2" opacity={t}>1 INJURY = <tspan fill="#ff6a5a">½ OF HUMANITY</tspan></text>}
    </svg>
  );
};

// ---------------------------------------------------------------- río arriba: la línea que se corta (plano entero, sin cámara)
// torre de alta tensión en la nieve, la represa lejos; en `rotura` salta el aislador, chispas, el cable cae y todo queda a oscuras
export const LineaRota: React.FC<{ rotura: number; nadie: number }> = ({ rotura, nadie }) => {
  const f = useF();
  const L = LUCES.noche;
  const cae = tw(f, rotura + 2, rotura + 16, 0, 1, (t) => t * t);
  const chis = f >= rotura && f < rotura + 26 ? 1 - (f - rotura) / 26 : 0;
  const dark = tw(f, rotura + 8, rotura + 30, 0, 1);
  const zoom = interpolate(f, [0, rotura, rotura + 90], [1, 1.06, 1.1], CL);
  const sh = f >= rotura && f < rotura + 12 ? Math.sin((f - rotura) * 2.6) * (12 - (f - rotura)) * 0.8 : 0;
  const tx = 1180;
  return (
    <AbsoluteFill style={{ background: L.cielo[0] ?? "#0e1222" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="lrcielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0b0f20" /><stop offset="1" stopColor="#2a2a48" /></linearGradient></defs>
        <g transform={`translate(${960 + sh},540) scale(${zoom}) translate(-960,-540)`}>
          <rect x={-200} y={-200} width={2400} height={1500} fill="url(#lrcielo)" />
          {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={random(`ls${i}`) * 1920} cy={random(`ly${i}`) * 420} r={1 + random(`lr${i}`) * 1.4} fill="#f6ecd2" opacity={0.5} />)}
          {/* el río helado y la represa lejos (con su luz de guardia que se apaga) */}
          <path d="M-100,660 Q500,610 1000,640 Q1500,670 2100,620 L2100,760 L-100,760 Z" fill="#26304a" />
          <path d="M-100,700 Q600,660 1100,690 Q1600,720 2100,680" stroke="#4a6a9a" strokeWidth={10} fill="none" opacity={0.6} />
          <g transform="translate(330,600)">
            <path d="M-120,60 L-90,-40 L90,-40 L120,60 Z" fill="#5a5a66" />
            {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-80 + i * 30} y={-30} width={12} height={(f * 3 + i * 17) % 80} fill="#8fd3ff" opacity={0.55} />)}
            <rect x={60} y={-80} width={60} height={40} fill="#3a3a46" />
            <rect x={74} y={-72} width={16} height={14} fill={dark < 0.5 ? AMBAR : "#231c2c"} />
            <text x={0} y={92} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} letterSpacing={3} fill="#c8bfae">THOMSON DAM</text>
          </g>
          {/* loma nevada */}
          <path d="M-200,1100 L-200,840 Q600,760 1300,800 Q1800,830 2200,780 L2200,1100 Z" fill={L.nieve} />
          <path d="M-200,1100 L-200,920 Q700,860 1400,900 Q1900,930 2200,880 L2200,1100 Z" fill={osc(L.nieve, 0.86)} />
          {/* torre de alta tensión */}
          <g stroke="#2a2232" strokeWidth={10} fill="none">
            <path d={`M${tx - 150},860 L${tx - 40},180 L${tx + 40},180 L${tx + 150},860`} />
            {[300, 440, 580, 720].map((y, i) => <path key={i} d={`M${tx - 150 + (860 - y) * 0.16 - 2},${y} L${tx + 150 - (860 - y) * 0.16 + 2},${y + 120} M${tx + 150 - (860 - y) * 0.16},${y} L${tx - 150 + (860 - y) * 0.16},${y + 120}`} strokeWidth={6} />)}
            <path d={`M${tx - 260},250 H${tx + 260}`} strokeWidth={12} />
          </g>
          {/* aisladores y cables: el de la derecha se corta */}
          {[-230, 230].map((d, i) => <rect key={i} x={tx + d - 8} y={250} width={16} height={46} rx={6} fill="#8a9aa8" />)}
          <path d={`M-100,330 Q${(tx - 230) / 2},420 ${tx - 230},296`} stroke="#1a1620" strokeWidth={6} fill="none" />
          {cae < 1 ? <path d={`M${tx + 230},296 Q${tx + 600},${380 + 400 * cae} ${2100},${330 + 700 * cae}`} stroke="#1a1620" strokeWidth={6} fill="none" /> : <path d={`M${tx + 230 + 10},${296 + 40} Q${tx + 260},${700} ${tx + 420},860 Q${tx + 900},880 2100,900`} stroke="#1a1620" strokeWidth={6} fill="none" />}
          {cae > 0 && cae < 1 && <path d={`M${tx + 230},296 L${tx + 236},${300 + 500 * cae}`} stroke="#1a1620" strokeWidth={6} />}
          {chis > 0 && <g>
            <circle cx={tx + 230} cy={290} r={60 * chis + 20} fill="#fff4c8" opacity={0.85 * chis} />
            <Halo x={tx + 230} y={290} r={420} color="#cfe6ff" fuerza={chis} />
            {Array.from({ length: 14 }).map((_, i) => { const a = i * 2.39, r = 40 + (1 - chis) * 260 * (0.6 + random(`ch${i}`) * 0.6); return <path key={i} d={`M${tx + 230},290 l${Math.cos(a) * r},${Math.sin(a) * r + (1 - chis) * 80}`} stroke="#ffe27a" strokeWidth={4} opacity={chis} />; })}
          </g>}
          {/* casilla de guardia vacía al pie de la torre: la silla sola, la puerta abierta */}
          <g transform="translate(640,830)">
            <rect x={-90} y={-130} width={180} height={130} fill="#4a4250" />
            <path d="M-104,-130 L0,-176 L104,-130 Z" fill="#2a2232" />
            <path d="M-104,-130 L0,-176 L104,-130 L96,-124 L0,-164 L-96,-124 Z" fill={L.nieve} />
            <rect x={-70} y={-100} width={70} height={56} fill={dark < 0.5 ? "#ffe2a0" : "#1a1620"} opacity={dark < 0.5 ? 0.8 : 1} />
            <g transform="translate(-36,-56)"><rect x={-14} y={-22} width={28} height={6} fill="#2a2232" /><rect x={-14} y={-46} width={6} height={30} fill="#2a2232" /><rect x={-10} y={-16} width={4} height={16} fill="#2a2232" /><rect x={6} y={-16} width={4} height={16} fill="#2a2232" /></g>
            <rect x={24} y={-104} width={50} height={104} fill="#1a1620" />
            <rect x={24} y={-104} width={14} height={104} fill="#6a5a4a" />
          </g>
          <rect x={-200} y={-200} width={2400} height={1500} fill="#05060c" opacity={0.45 * dark} />
          {f >= nadie && <g opacity={tw(f, nadie, nadie + 10, 0, 1)}><rect x={300} y={396} width={560} height={72} rx={36} fill="rgba(12,10,20,0.7)" stroke="#ff6a5a" strokeWidth={3} /><text x={580} y={445} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={38} letterSpacing={4} fill="#ff6a5a">WORKERS ON SHIFT: 0</text></g>}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ola sobre un plano HTML: muestra `prendido` sólo a la derecha de x (px de pantalla)
export const Recorte: React.FC<{ x: number; children: React.ReactNode }> = ({ x, children }) => (
  <AbsoluteFill style={{ clipPath: `inset(0px 0px 0px ${Math.max(0, Math.min(1920, x)).toFixed(1)}px)` }}>{children}</AbsoluteFill>
);
// frente de la ola por manzanas: avanza en escalones (cada manzana tarda `paso` cuadros y titila al apagarse)
export const frenteOla = (f: number, f0: number, f1: number, x0: number, x1: number, n = 8) => {
  if (f <= f0) return x0;
  if (f >= f1) return x1;
  const u = (f - f0) / (f1 - f0);
  const i = Math.floor(u * n);
  const r = u * n - i;
  // dentro del escalón: titila (vuelve un poco) y cae
  const tit = r < 0.35 ? 0 : r < 0.55 ? 0.6 : r < 0.7 ? 0.2 : 1;
  return lerp(x0, x1, (i + tit) / n);
};

// ---------------------------------------------------------------- inserto: el tablero de la camioneta (pantalla entera)
// la mano (manga de color) gira la llave en `gira`; la aguja de nafta sube de E a `nivel` como en un arranque de verdad
export const Tablero: React.FC<{ gira: number; nivel?: number; manga?: string }> = ({ gira, nivel = 0.62, manga = "#c8582b" }) => {
  const f = useF();
  const u = tw(f, gira, gira + 10, 0, 1);
  const ag = tw(f, gira + 6, gira + 34, 0, nivel);
  const ang = (a: number) => (-150 + 120 * a) * (Math.PI / 180);
  const G = { x: 700, y: 740, r: 150 };
  const tiembla = f >= gira + 6 ? Math.sin(f * 3.1) * 1.2 : 0;
  const empuje = interpolate(f, [0, 200], [1, 1.04], CL);
  return (
    <AbsoluteFill style={{ background: "#1a1820", transform: `scale(${empuje})` }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="tbcielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6f8fb8" /><stop offset="1" stopColor="#e6dccb" /></linearGradient></defs>
        <g transform={`translate(0,${tiembla})`}>
          {/* parabrisas: el estacionamiento de la Holiday y el lago al fondo */}
          <path d="M120,60 H1800 L1700,470 H220 Z" fill="url(#tbcielo)" />
          <path d="M220,470 L300,420 H1620 L1700,470 Z" fill="#8a9aa8" />
          <rect x={300} y={400} width={1320} height={22} fill="#6f8fae" />
          <path d="M120,60 H1800 L1700,470 H220 Z" fill="none" stroke="#0e0c12" strokeWidth={34} strokeLinejoin="round" />
          <rect x={900} y={60} width={120} height={46} rx={10} fill="#0e0c12" />
          {/* tablero */}
          <path d="M-20,480 Q960,430 1940,480 V1100 H-20 Z" fill="#2a2630" />
          <path d="M-20,480 Q960,430 1940,480 V520 Q960,470 -20,520 Z" fill="#3a3640" />
          {/* aguja de nafta */}
          <circle cx={G.x} cy={G.y} r={G.r + 22} fill="#121016" />
          <circle cx={G.x} cy={G.y} r={G.r} fill="#1d1b24" stroke="#4a4652" strokeWidth={6} />
          {Array.from({ length: 9 }).map((_, i) => { const a = ang(i / 8); return <path key={i} d={`M${G.x + Math.cos(a) * (G.r - 14)},${G.y + Math.sin(a) * (G.r - 14)} L${G.x + Math.cos(a) * (G.r - (i % 4 === 0 ? 46 : 30))},${G.y + Math.sin(a) * (G.r - (i % 4 === 0 ? 46 : 30))}`} stroke={i === 0 ? "#e2483a" : "#f6ecd2"} strokeWidth={i % 4 === 0 ? 7 : 4} strokeLinecap="round" />; })}
          <text x={G.x + Math.cos(ang(0)) * (G.r - 74)} y={G.y + Math.sin(ang(0)) * (G.r - 74) + 12} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#e2483a">E</text>
          <text x={G.x + Math.cos(ang(1)) * (G.r - 74)} y={G.y + Math.sin(ang(1)) * (G.r - 74) + 12} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#f6ecd2">F</text>
          <text x={G.x} y={G.y + 70} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} letterSpacing={3} fill="#c8bfae">FUEL</text>
          <path d={`M${G.x},${G.y} L${G.x + Math.cos(ang(ag)) * (G.r - 24)},${G.y + Math.sin(ang(ag)) * (G.r - 24)}`} stroke="#ff8a3a" strokeWidth={10} strokeLinecap="round" />
          <circle cx={G.x} cy={G.y} r={18} fill="#4a4652" />
          {f >= gira + 4 && <circle cx={G.x + 110} cy={G.y - 40} r={10} fill="#ffb03a" opacity={ag < 0.25 ? 1 : 0.25} />}
          {/* volante */}
          <path d="M60,1100 Q120,760 420,700" stroke="#121016" strokeWidth={46} fill="none" strokeLinecap="round" />
          {/* contacto y llave */}
          <circle cx={1260} cy={760} r={56} fill="#121016" />
          <circle cx={1260} cy={760} r={40} fill="#6a6672" />
          <g transform={`rotate(${-20 + 70 * u} 1260 760)`}>
            <rect x={1252} y={690} width={16} height={70} rx={4} fill="#c9c4b6" />
            <path d="M1236,690 Q1236,640 1260,630 Q1284,640 1284,690 Z" fill="#2a2630" stroke="#c9c4b6" strokeWidth={4} />
            <circle cx={1260} cy={655} r={8} fill="#c9c4b6" />
          </g>
          {/* llavero */}
          <g transform={`rotate(${Math.sin(f / 5) * 8 * (f >= gira ? 1 : 0.3)} 1260 790)`}><path d="M1260,790 V860" stroke="#9a948a" strokeWidth={4} /><circle cx={1260} cy={880} r={22} fill="none" stroke="#9a948a" strokeWidth={5} /><rect x={1240} y={896} width={40} height={50} rx={8} fill="#c0352c" /></g>
        </g>
      </svg>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`rotate(${70 * u - 20} 1260 760)`}><ManoLapiz x={1214} y={706} manga={manga} lapiz={false} s={1.0} /></g>
      </svg>
    </AbsoluteFill>
  );
};

export { io };
