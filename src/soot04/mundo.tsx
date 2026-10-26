import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";

// Soot 04 — UN solo mundo continuo. La cámara viaja por coordenadas de mundo (px a zoom 1):
// y = 0 es la superficie del mar (arriba cielo, abajo agua), x crece hacia el este. El barco tiene su propia
// posición bx(t); las claves de cámara pueden ser absolutas o relativas al barco (rel), y se mezclan sin cortes.

export type Key = { t: number; x: number; y: number; z: number; rel?: boolean; e?: "io" | "o" | "i" | "lin" };
export type Cam = { x: number; y: number; z: number };

const EASE = { io: Easing.inOut(Easing.cubic), o: Easing.out(Easing.cubic), i: Easing.in(Easing.cubic), lin: (u: number) => u };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

// posición del barco: tramos lineales [t, x]
export const tramos = (ks: [number, number][]) => (t: number) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) {
      const [ta, xa] = ks[i - 1], [tb, xb] = ks[i];
      const u = (t - ta) / (tb - ta);
      // arranque y frenada suaves dentro de cada tramo de velocidad
      return lerp(xa, xb, u);
    }
  }
  return ks[ks.length - 1][1];
};

export const camAt = (keys: Key[], t: number, bx: (t: number) => number): Cam => {
  const abs = (k: Key) => ({ x: k.rel ? k.x + bx(t) : k.x, y: k.y, z: k.z });
  if (t <= keys[0].t) return abs(keys[0]);
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i];
    if (t <= b.t) {
      const a = keys[i - 1];
      const u = EASE[b.e ?? "io"]((t - a.t) / Math.max(0.001, b.t - a.t));
      const A = abs(a), B = abs(b);
      // el zoom se interpola en log para que acercarse y alejarse se sienta parejo
      return { x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u), z: Math.exp(lerp(Math.log(A.z), Math.log(B.z), u)) };
    }
  }
  return abs(keys[keys.length - 1]);
};

export const CamCtx = React.createContext<{ cam: Cam; t: number }>({ cam: { x: 0, y: 0, z: 1 }, t: 0 });
export const useCam = () => React.useContext(CamCtx);
export const vista = (c: Cam) => ({ x0: c.x - 960 / c.z, x1: c.x + 960 / c.z, y0: c.y - 540 / c.z, y1: c.y + 540 / c.z });

// sólo dibuja lo que cae cerca de cuadro (rendimiento: el mundo mide decenas de miles de px)
export const V: React.FC<{ x: number; y: number; w?: number; h?: number; children: React.ReactNode }> = ({ x, y, w = 2400, h = 2400, children }) => {
  const { cam } = useCam();
  const v = vista(cam);
  if (x + w / 2 < v.x0 || x - w / 2 > v.x1 || y + h / 2 < v.y0 || y - h / 2 > v.y1) return null;
  return <>{children}</>;
};

// capa de mundo: todo lo de adentro va en coordenadas de mundo
export const CapaMundo: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cam } = useCam();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: `translate(960px, 540px) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)` }}>{children}</div>
    </AbsoluteFill>
  );
};
// capa lejana (nubes, islas del horizonte, sol): paralaje f < 1, pegada al horizonte
export const CapaLejos: React.FC<{ f?: number; children: React.ReactNode }> = ({ f = 0.25, children }) => {
  const { cam } = useCam();
  const zf = Math.pow(cam.z, 0.45);
  const hy = 540 - cam.y * cam.z;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: `translate(${960 - cam.x * f * zf}px, ${hy}px) scale(${zf})` }}>{children}</div>
    </AbsoluteFill>
  );
};

// ── colores
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mezcla = (a: string, b: string, u: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(",")})`;
};
export type Pal = { cielo: [string, string, string, string]; agua: [string, string, string]; sol?: number };
export const PALETAS: Record<string, Pal> = {
  dia: { cielo: ["#2458c8", "#3f8fe8", "#8ccdf6", "#ffe8c0"], agua: ["#1f8ac4", "#0f4a8a", "#081a48"] },
  manana: { cielo: ["#5a7fd0", "#9ab4e8", "#f2c9a8", "#ffe7b8"], agua: ["#3b8fae", "#1a5a86", "#0a2448"] },
  tarde: { cielo: ["#2d1b69", "#7a2f8f", "#e2557a", "#ffb35a"], agua: ["#5a3a8a", "#2a2a6a", "#0c1238"] },
  noche: { cielo: ["#0a0820", "#16123e", "#2a2160", "#4a3a88"], agua: ["#1a2a5a", "#0e1a40", "#050a1e"] },
  tropico: { cielo: ["#0f7ec8", "#2ab8e0", "#8ae6e6", "#fff2c8"], agua: ["#14b8b0", "#0a7a96", "#063056"] },
  tormenta: { cielo: ["#1e2030", "#343648", "#4e5064", "#6a6c7c"], agua: ["#2a3a4a", "#18242e", "#080e16"] },
  humo: { cielo: ["#2a1410", "#5a2a18", "#a04a22", "#e08a3a"], agua: ["#3a2a2a", "#1e1418", "#0a0608"] },
  sangre: { cielo: ["#1a0614", "#4a0f2a", "#8c1d34", "#e8563a"], agua: ["#4a1a3a", "#240a24", "#0a0410"] },
  calma: { cielo: ["#f2a65a", "#f7c98a", "#fbe3b4", "#fff4d8"], agua: ["#4aa0b0", "#2a6a8a", "#0e2a48"] },
  abismo: { cielo: ["#0a0820", "#0a0820", "#16123e", "#2a2160"], agua: ["#0e2050", "#060e2a", "#020510"] },
};
export const palAt = (ks: [number, string, number?][], t: number): Pal => {
  let i = 0;
  while (i < ks.length - 1 && t >= ks[i + 1][0]) i++;
  const [ta, a] = ks[i];
  const nx = ks[Math.min(i + 1, ks.length - 1)];
  const A = PALETAS[a], B = PALETAS[nx[1]];
  const fd = nx[2] ?? 2.5;
  const u = nx[0] > ta ? Math.min(1, Math.max(0, (t - (nx[0] - fd)) / fd)) : 0; // funde en los `fd` s previos a la clave
  const m = (x: string, y: string) => mezcla(x, y, u);
  return { cielo: A.cielo.map((c, k) => m(c, B.cielo[k])) as Pal["cielo"], agua: A.agua.map((c, k) => m(c, B.agua[k])) as Pal["agua"] };
};

// cielo + agua de fondo en espacio de pantalla, con el horizonte donde cae y = 0
export const Fondo: React.FC<{ pal: Pal }> = ({ pal }) => {
  const { cam } = useCam();
  const z = cam.z, hy = 540 - cam.y * z;
  const [c0, c1, c2, c3] = pal.cielo, [a0, a1, a2] = pal.agua;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${c0} ${hy - 1600 * z}px, ${c1} ${hy - 800 * z}px, ${c2} ${hy - 260 * z}px, ${c3} ${hy}px, ${a0} ${hy + 1}px, ${a1} ${hy + 900 * z}px, ${a2} ${hy + 2600 * z}px)` }} />
  );
};

// olas de superficie (en mundo) — `frente` = la franja translúcida que va DELANTE del barco
export const Olas: React.FC<{ pal: Pal; alto?: number; frente?: boolean }> = ({ pal, alto = 1, frente }) => {
  const { cam, t } = useCam();
  const v = vista(cam);
  if (v.y1 < -200 || v.y0 > 4000) return null;
  const x0 = Math.floor(v.x0 / 60) * 60 - 120, x1 = v.x1 + 120;
  const paso = Math.max(30, 40 / cam.z);
  const onda = (x: number, k: number) => Math.sin(x * 0.006 + t * 1.6 + k) * 16 * alto + Math.sin(x * 0.017 - t * 2.3 + k * 2) * 7 * alto;
  const camino = (k: number, dy: number) => {
    let d = `M ${x0} ${dy + onda(x0, k)}`;
    for (let x = x0 + paso; x <= x1 + paso; x += paso) d += ` L ${x} ${dy + onda(x, k)}`;
    return d;
  };
  const w = x1 - x0;
  if (frente)
    return (
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <path d={`${camino(2.1, 26)} L ${x1 + paso} ${Math.min(5000, v.y1 + 50)} L ${x0} ${Math.min(5000, v.y1 + 50)} Z`} fill={pal.agua[0]} opacity={0.5} />
        <path d={camino(2.1, 26)} stroke="#e8fbff" strokeWidth={6} fill="none" opacity={0.75} />
      </svg>
    );
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={`${camino(0, 0)} L ${x1 + paso} 90 L ${x0} 90 Z`} fill={pal.agua[0]} />
      <path d={camino(0, 0)} stroke="#f4fdff" strokeWidth={7} fill="none" opacity={0.9} />
      {Array.from({ length: Math.ceil(w / 300) }, (_, i) => {
        const x = Math.floor(v.x0 / 300) * 300 + i * 300 + ((i * 97) % 140);
        const a = Math.max(0, Math.sin(t * 1.3 + i * 1.7));
        return <path key={i} d={`M ${x} ${60 + (i % 3) * 50} q 30 -14 60 0`} stroke="#d8f4ff" strokeWidth={5} fill="none" opacity={a * 0.6} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// rayos de sol bajo el agua y burbujas
export const Submarino: React.FC<{ op?: number }> = ({ op = 1 }) => {
  const { cam, t } = useCam();
  const v = vista(cam);
  if (v.y1 < 0) return null;
  const n = 14;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }} width={1} height={1}>
      {Array.from({ length: n }, (_, i) => {
        const x = Math.floor(v.x0 / 260) * 260 + i * 260 + Math.sin(t * 0.4 + i) * 40;
        return <path key={i} d={`M ${x} 0 L ${x + 120} 0 L ${x + 420} 1800 L ${x + 200} 1800 Z`} fill="#bff3ff" opacity={0.05 + 0.04 * Math.sin(t * 0.7 + i * 2)} />;
      })}
      {Array.from({ length: 40 }, (_, i) => {
        const bx = v.x0 + ((i * 397) % Math.max(1, v.x1 - v.x0));
        const by = 1600 - ((t * (40 + (i % 5) * 18) + i * 211) % 1600);
        return <circle key={`b${i}`} cx={bx + Math.sin(t * 2 + i) * 14} cy={by} r={4 + (i % 4) * 3} fill="none" stroke="#dff8ff" strokeWidth={3} opacity={0.35} />;
      })}
    </svg>
  );
};
