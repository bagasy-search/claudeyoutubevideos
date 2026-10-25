import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { loadFont as oswald } from "@remotion/google-fonts/Oswald";
import { loadFont as caveat } from "@remotion/google-fonts/Caveat";
import { Cam, F, SUELO, clamp, desenfoque, lerp, rnd, seco, suave } from "./lib";
import { Look } from "./rig";
import PROPS from "./props.json";

oswald("normal", { weights: ["700"], subsets: ["latin"] });
caveat("normal", { weights: ["700"], subsets: ["latin"] });
export const LETRA = "Oswald";
export const MANO = "Caveat";

// ---------- vestuario del canal (Soot and Sandals) ----------
export const TINTA = "#17130f";
const base = (l: Partial<Look>): Look => ({ color: TINTA, ancho: 11, papel: true, ...l });
export const CIVIL = base({ tunica: "#c9a26a", pelo: true });
export const RECLUTA = base({ tunica: "#b5532f", pelo: true });
export const LEGIO = base({ tunica: "#a3241c", armadura: "#7d8288", casco: "#8a8f95" });
export const LEGIO_ESC = { ...LEGIO, escudo: "#a3241c" };
export const CENTURION = base({ tunica: "#a3241c", armadura: "#9aa0a6", casco: "#b0a26a", cresta: "#efe6d2", crestaT: true, capa: "#6e1a16", arma: "vara", barba: true, escala: 1.08, ancho: 12 });
export const OFICIAL = base({ vestido: "#e9dccb", barba: true });
export const ESPOSA = base({ vestido: "#3f6e78", rodete: true, ancho: 10 });
export const GERMANO = base({ tunica: "#55603a", barba: true, pelo: true, arma: "garrote", ancho: 12 });
export const MEDICO = base({ vestido: "#d9cdb8", barba: true });
export const VETERANO = base({ tunica: "#8a5a3a", barba: true });

// luz de la maqueta (arriba a la izquierda) → canto iluminado de ese lado
export const CANTO = [{ dx: -2.6, dy: -2.6, color: "#ffcf8a", op: 0.85 }];
export const CANTO_FRIO = [{ dx: -2.4, dy: -2.8, color: "#cfdcff", op: 0.8 }];
export const CANTO_FUEGO = [{ dx: 2.6, dy: -2.4, color: "#ff9a4a", op: 0.9 }];

// ---------- lo que ve la cámara en la capa actual (para que los carteles nunca queden cortados) ----------
type Vista = { cx: number; cy: number; hw: number; hh: number };
const VistaCtx = React.createContext<Vista | null>(null);
// corre una caja (centro x,y · ancho w · alto h, en coords de la capa) lo justo para que entre en cuadro
export const useEncuadre = (x: number, y: number, w: number, h: number): [number, number] => {
  const v = React.useContext(VistaCtx);
  if (!v) return [x, y];
  // margen: CamaraMano agranda 5 % y cabecea, así que lo "visible" real es bastante menos que el cuadro
  const enc = (p: number, c: number, half: number, med: number, f: number) => {
    const lim = half * f - med / 2;
    return lim <= 0 ? c : clamp(p, c - lim, c + lim);
  };
  return [enc(x, v.cx, v.hw, w, 0.88), enc(y, v.cy, v.hh, h, 0.82)];
};

// ---------- capa de la maqueta: fotos (HTML <Img>, Remotion las espera) + SVG en coordenadas de reposo ----------
export type Foto = { src: string; x: number; y: number; w: number; h: number; rot?: number; op?: number };
export const Lam: React.FC<{
  D: number;
  cam: Cam;
  fotos?: Foto[];
  children?: React.ReactNode;
  extra?: number;
  sombra?: boolean;
  filtro?: string;
  opacidad?: number;
  mezcla?: React.CSSProperties["mixBlendMode"];
}> = ({ D, cam, fotos = [], children, extra = 0, sombra, filtro = "", opacidad = 1, mezcla }) => {
  const dist = D - cam.cz;
  const cerca = clamp((dist - 70) / 150, 0, 1);
  if (cerca <= 0 || opacidad <= 0) return null;
  const k = F / D;
  const m = D / dist;
  const b = desenfoque(D, cam) + extra;
  // sombra dura de cartulina: la luz viene de arriba a la izquierda → cae abajo a la derecha
  const sh = sombra ? ` drop-shadow(${(9 * m).toFixed(1)}px ${(6 * m).toFixed(1)}px ${(1.2 * m).toFixed(1)}px rgba(38,16,6,0.5))` : "";
  const W = 12000;
  const H = 6000;
  return (
    <AbsoluteFill style={{ filter: `blur(${b.toFixed(2)}px)${sh} ${filtro}`, opacity: opacidad * cerca, mixBlendMode: mezcla }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px,540px) scale(${m}) translate(${-cam.cx * k}px,${-cam.cy * k}px)` }}>
        {fotos.map((f, i) => {
          // los fondos (f_*) cubren SIEMPRE lo que ve la cámara: si el recorrido se va más allá del borde,
          // la foto crece lo justo alrededor de su centro (margen 8 % para el balanceo de CamaraMano y el blur)
          let w = f.w;
          let h = f.h;
          if (f.src.startsWith("soot/f_")) {
            const hw = ((960 * 1.08) + b * 2) / m;
            const hh = ((540 * 1.08) + b * 2) / m;
            const s = Math.max(1, (Math.abs(cam.cx * k - f.x) + hw) / (f.w / 2), (Math.abs(cam.cy * k - f.y) + hh) / (f.h / 2));
            w *= s;
            h *= s;
          }
          return (
            <Img
              key={i}
              src={staticFile(f.src)}
              style={{ position: "absolute", left: f.x - w / 2, top: f.y - h / 2, width: w, height: h, transform: f.rot ? `rotate(${f.rot}deg)` : undefined, opacity: f.op ?? 1 }}
            />
          );
        })}
        <svg width={W} height={H} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} style={{ position: "absolute", left: -W / 2, top: -H / 2, overflow: "visible" }}>
          <VistaCtx.Provider value={{ cx: cam.cx * k, cy: cam.cy * k, hw: 960 / m, hh: 540 / m }}>{children}</VistaCtx.Provider>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// fondo agnes 2624x1472 a escala e (centrado en x, y)
export const fondo = (n: string, e = 0.8, x = 0, y = -40): Foto => ({ src: `soot/f_${n}.jpg`, x, y, w: 2624 * e, h: 1472 * e });
// utilería recortada (png sin fondo): ancho w, apoyada en el piso de la capa D
// (props.json = ancho/alto del recorte real de cada png, lo escribe el paso de rembg)
export const util = (n: keyof typeof PROPS, x: number, D: number, w: number, dy = 0, rot = 0): Foto => {
  const ar = PROPS[n][1] / PROPS[n][0];
  return { src: `soot/p_${n}.png`, x, y: suelo(D) - (w * ar) / 2 + dy, w, h: w * ar, rot };
};

// ---------- piso de tiras de cartulina ----------
export const suelo = (D: number) => (SUELO * F) / D;
export const Tira: React.FC<{ D: number; color: string; canto: string; seed: number }> = ({ D, color, canto, seed }) => {
  const r = rnd(seed);
  const y0 = suelo(D) - 4;
  const pts: string[] = [];
  for (let x = -5000; x <= 5000; x += 70) pts.push(`${x},${(y0 + (r() - 0.5) * 3).toFixed(1)}`);
  return (
    <g>
      <polygon points={`-5000,3000 ${pts.join(" ")} 5000,3000`} fill={color} />
      <polyline points={pts.join(" ")} stroke={canto} strokeWidth={3} fill="none" />
    </g>
  );
};
export type Piso = [number, string, string][];
export const PISOS: Record<string, Piso> = {
  tierra: [[1400, "#9a5636", "#c98a5e"], [1250, "#8a4a2e", "#bf7c52"], [1120, "#7c4029", "#b26e48"], [1000, "#6e3824", "#a5623f"]],
  pasto: [[1400, "#6f7a3a", "#9aa45a"], [1250, "#5f6c32", "#8c9650"], [1120, "#53602c", "#7f8a48"], [1000, "#465226", "#727d40"]],
  piedra: [[1400, "#9b8c76", "#c8b89c"], [1250, "#8a7b66", "#b9a88c"], [1120, "#7a6c58", "#a8987c"], [1000, "#6b5e4c", "#97886e"]],
  arena: [[1400, "#c8a064", "#e6c48a"], [1250, "#b98f56", "#dab47a"], [1120, "#a9804a", "#cba46c"], [1000, "#9a723f", "#bc965f"]],
  barro: [[1400, "#5b4632", "#7d654a"], [1250, "#4f3c2a", "#6f5840"], [1120, "#433322", "#614c36"], [1000, "#38291b", "#54402c"]],
  noche: [[1400, "#2c2a3a", "#4a4766"], [1250, "#25233a", "#423f5e"], [1120, "#1f1d30", "#3a3754"], [1000, "#1a1828", "#33304a"]],
};
export const PisoCapas: React.FC<{ cam: Cam; piso: Piso; desde?: number }> = ({ cam, piso, desde = 0 }) => (
  <>
    {piso.slice(desde).map(([D, c, k], i) => (
      <Lam key={D} D={D} cam={cam}>
        <Tira D={D} color={c} canto={k} seed={i + 1} />
      </Lam>
    ))}
  </>
);
export const Sombra: React.FC<{ x: number; w?: number; D?: number; op?: number }> = ({ x, w = 46, D = F, op = 0.45 }) => (
  <ellipse cx={x + 10} cy={suelo(D) + 2} rx={w} ry={6} fill="#2a1206" opacity={op} />
);

// ---------- la luz-linterna: lo que la voz nombra queda iluminado, el resto en penumbra ----------
export const Linterna: React.FC<{ x: number; y: number; r: number; osc: number; frio?: boolean }> = ({ x, y, r, osc, frio }) => {
  const c = frio ? [36, 44, 70] : [70, 38, 24];
  const col = `rgb(${lerp(255, c[0], osc).toFixed(0)},${lerp(250, c[1], osc).toFixed(0)},${lerp(240, c[2], osc).toFixed(0)})`;
  return (
    <AbsoluteFill
      style={{ mixBlendMode: "multiply", background: `radial-gradient(ellipse ${r * 1.25}px ${r}px at ${960 + x}px ${540 + y}px, rgb(255,250,240) 0%, rgb(255,250,240) 32%, ${col} 100%)` }}
    />
  );
};

// ---------- cartel de cartón colgado de dos hilos: baja con rebote y se mece ----------
export const Cartel: React.FC<{
  x: number;
  y: number;
  texto: string;
  t: number;
  t0: number;
  t1?: number;
  color?: string;
  fondoC?: string;
  w?: number;
  fs?: number;
  sub?: string;
}> = ({ x: x0, y: y0, texto, t, t0, t1 = 1e9, color = "#2a1a10", fondoC = "#c99a5e", w, fs = 72, sub }) => {
  const [x, y] = useEncuadre(x0, y0, w ?? Math.max(220, texto.length * fs * 0.52 + 70), (sub ? fs * 1.75 : fs * 1.25) + 20);
  const u = interpolate(t, [t0 - 0.45, t0 + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.7)) });
  const v = suave(t, t1, t1 + 0.4);
  if (u <= 0 || v >= 1) return null;
  const W = w ?? Math.max(220, texto.length * fs * 0.52 + 70);
  const Hh = sub ? fs * 1.75 : fs * 1.25;
  const Y = lerp(y - 900, y, u) - 900 * v * v;
  const tt = t - (t0 + 0.1);
  const rot = tt > 0 ? 5 * Math.exp(-tt * 2.6) * Math.sin(tt * 8) + 0.6 * Math.sin(t * 1.3) : 0;
  return (
    <g transform={`rotate(${rot} ${x} ${Y - 600})`}>
      <line x1={x - W / 2 + 26} y1={Y - 1600} x2={x - W / 2 + 26} y2={Y - Hh / 2 + 10} stroke="#d8c8a8" strokeWidth={3} />
      <line x1={x + W / 2 - 26} y1={Y - 1600} x2={x + W / 2 - 26} y2={Y - Hh / 2 + 10} stroke="#d8c8a8" strokeWidth={3} />
      <path d={`M${x - W / 2},${Y - Hh / 2 + 4} L${x + W / 2 - 2},${Y - Hh / 2} L${x + W / 2 + 3},${Y + Hh / 2 - 4} L${x - W / 2 + 5},${Y + Hh / 2} Z`} fill={fondoC} />
      <path d={`M${x - W / 2},${Y - Hh / 2 + 4} L${x + W / 2 - 2},${Y - Hh / 2}`} stroke="#ecc58a" strokeWidth={4} />
      <circle cx={x - W / 2 + 26} cy={Y - Hh / 2 + 16} r={7} fill="#5a4024" />
      <circle cx={x + W / 2 - 26} cy={Y - Hh / 2 + 14} r={7} fill="#5a4024" />
      <text x={x} y={Y + (sub ? -fs * 0.05 : fs * 0.36)} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={fs} fill={color}>
        {texto}
      </text>
      {sub && (
        <text x={x} y={Y + fs * 0.62} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={fs * 0.4} fill={color === "#2a1a10" ? "#5a3a22" : color} opacity={color === "#2a1a10" ? 1 : 0.85} letterSpacing={3}>
          {sub}
        </text>
      )}
    </g>
  );
};

// ---------- papiro que se desenrolla; cada renglón se escribe cuando la voz lo dice ----------
export const Papiro: React.FC<{
  x: number;
  y: number;
  w: number;
  t: number;
  t0: number;
  lineas: { txt: string; t: number; tachar?: number; rojo?: boolean }[];
  titulo?: string;
  fs?: number;
  t1?: number;
}> = ({ x: x0, y: y0, w, t, t0, lineas, titulo, fs = 40, t1 = 1e9 }) => {
  // se desenrolla en t0 y (si hay t1) se vuelve a enrollar para dejarle lugar al cartel siguiente
  const abre = seco(t, t0, t0 + 0.8) * (1 - seco(t, t1, t1 + 0.5));
  const alto = (lineas.length + (titulo ? 1.6 : 0.6)) * fs * 1.25 + 40;
  const [x, y] = useEncuadre(x0, y0, w + 40, alto + 40);
  if (t > t1 + 0.5) return null;
  const h = alto * abre;
  const top = y - alto / 2;
  return (
    <g>
      <rect x={x - w / 2 + 12} y={top + 10} width={w} height={h} fill="#2a1206" opacity={0.25} />
      <rect x={x - w / 2} y={top} width={w} height={h} fill="#e9d6a8" />
      <path d={`M${x - w / 2},${top} L${x - w / 2},${top + h}`} stroke="#c9ad74" strokeWidth={6} />
      <clipPath id={`pap${Math.round(x)}_${Math.round(y)}`}>
        <rect x={x - w / 2} y={top} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#pap${Math.round(x)}_${Math.round(y)})`}>
        {titulo && (
          <text x={x} y={top + fs * 1.25} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={fs * 0.9} fill="#5a2a18" letterSpacing={4}>
            {titulo}
          </text>
        )}
        {lineas.map((l, i) => {
          const ly = top + (i + (titulo ? 2.2 : 1.1)) * fs * 1.25;
          const u = seco(t, l.t - 0.15, l.t + 0.45);
          if (u <= 0) return null;
          const tach = l.tachar !== undefined ? seco(t, l.tachar, l.tachar + 0.35) : 0;
          const lx = x - w / 2 + 40;
          const ancho = Math.min(w - 80, l.txt.length * fs * 0.42);
          return (
            <g key={i}>
              <clipPath id={`pl${i}_${Math.round(x)}`}>
                <rect x={lx - 4} y={ly - fs} width={(w - 70) * u} height={fs * 1.4} />
              </clipPath>
              <text x={lx} y={ly} fontFamily={MANO} fontWeight={700} fontSize={fs} fill={l.rojo ? "#a3241c" : "#3a2414"} clipPath={`url(#pl${i}_${Math.round(x)})`}>
                {l.txt}
              </text>
              {tach > 0 && <path d={`M${lx - 6},${ly - fs * 0.3} L${lx - 6 + (ancho + 12) * tach},${ly - fs * 0.34}`} stroke="#a3241c" strokeWidth={5} strokeLinecap="round" />}
            </g>
          );
        })}
      </g>
      {/* los dos rollos de madera */}
      <rect x={x - w / 2 - 14} y={top - 16} width={w + 28} height={24} rx={12} fill="#8a5a2e" />
      <rect x={x - w / 2 - 14} y={top + h - 8} width={w + 28} height={24} rx={12} fill="#8a5a2e" />
      <path d={`M${x - w / 2 - 6},${top - 10} L${x + w / 2 + 6},${top - 10}`} stroke="#c58a52" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

// ---------- número grande de cartón que salta (con contador) ----------
export const Numero: React.FC<{ x: number; y: number; t: number; t0: number; t1?: number; a: number; b?: number; dur?: number; pre?: string; suf?: string; fs?: number; color?: string }> = ({
  x,
  y,
  t,
  t0,
  t1 = 1e9,
  a,
  b,
  dur = 1,
  pre = "",
  suf = "",
  fs = 180,
  color = "#efe3cc",
}) => {
  const lbl = `${pre}${(b ?? a).toLocaleString("en-US")}${suf}`;
  [x, y] = useEncuadre(x, y - fs * 0.35, lbl.length * fs * 0.5, fs * 1.1);
  y += fs * 0.35;
  const u = interpolate(t, [t0 - 0.2, t0 + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  const v = suave(t, t1, t1 + 0.35);
  if (u <= 0 || v >= 1) return null;
  const n = b === undefined ? a : Math.round(lerp(a, b, seco(t, t0, t0 + dur)));
  const txt = `${pre}${n.toLocaleString("en-US")}${suf}`;
  return (
    <g transform={`translate(${x},${y + 40 * v}) scale(${u * (1 - 0.3 * v)}) rotate(${-2 + Math.sin(t * 1.1)})`} opacity={1 - v}>
      <text x={8} y={10} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={fs} fill="#2a1206" opacity={0.45}>
        {txt}
      </text>
      <text x={0} y={0} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={fs} fill={color} stroke="#2a1a10" strokeWidth={5} paintOrder="stroke">
        {txt}
      </text>
    </g>
  );
};

// ---------- lluvia de tiras de papel (cada gota cae sola, ángulo de viento) ----------
export const Lluvia: React.FC<{ t: number; n?: number; viento?: number; op?: number; seed?: number; ancho?: number }> = ({ t, n = 90, viento = 0.35, op = 0.55, seed = 3, ancho = 2600 }) => {
  const r = rnd(seed);
  const gotas = Array.from({ length: n }, () => ({ x: (r() - 0.5) * ancho, f: r(), v: 0.55 + r() * 0.5, L: 40 + r() * 50 }));
  return (
    <g opacity={op}>
      {gotas.map((g, i) => {
        const ph = (t * g.v + g.f) % 1;
        const y = -900 + ph * 1900;
        const x = g.x + viento * (y + 900);
        return <line key={i} x1={x} y1={y} x2={x + viento * g.L} y2={y + g.L} stroke="#dfe6ee" strokeWidth={3} strokeLinecap="round" />;
      })}
    </g>
  );
};

// ---------- polvo que flota en la luz ----------
export const Polvo: React.FC<{ t: number; n?: number; seed?: number; color?: string }> = ({ t, n = 40, seed = 9, color = "#ffe6b0" }) => {
  const r = rnd(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x0 = (r() - 0.5) * 1800;
        const y0 = (r() - 0.5) * 900;
        const s = 1.5 + r() * 3;
        const f = r() * 6;
        return <circle key={i} cx={x0 + 30 * Math.sin(t * 0.3 + f)} cy={y0 + 20 * Math.sin(t * 0.21 + f * 2)} r={s} fill={color} opacity={0.25 + 0.2 * Math.sin(t + f)} />;
      })}
    </g>
  );
};

// ---------- llama de antorcha / fogata de papel ----------
export const Llama: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number; palo?: number }> = ({ x, y, t, s = 1, seed = 1, palo = 0 }) => {
  const a = Math.sin(t * 9 + seed) * 0.12 + Math.sin(t * 5.3 + seed * 2) * 0.08;
  const h = 1 + 0.12 * Math.sin(t * 11 + seed * 3);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {palo > 0 && <rect x={-4} y={0} width={8} height={palo} fill="#4a2e1a" />}
      <circle cx={0} cy={-20} r={70} fill="#ff9a3c" opacity={0.12 + 0.04 * Math.sin(t * 7 + seed)} />
      <path d={`M-16,0 Q-20,${-30 * h} ${a * 60},${-62 * h} Q20,${-30 * h} 16,0 Z`} fill="#e8641e" />
      <path d={`M-9,0 Q-10,${-20 * h} ${a * 40},${-40 * h} Q11,${-18 * h} 9,0 Z`} fill="#ffc44a" />
    </g>
  );
};

// ---------- trazo que se dibuja (rutas de mapa, flechas) ----------
export const Trazo: React.FC<{ d: string; u: number; color?: string; w?: number; largo?: number; guiones?: boolean }> = ({ d, u, color = "#a3241c", w = 8, largo = 3000, guiones }) =>
  u <= 0 ? null : (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${largo * u} ${largo}`} />
      {guiones && <path d={d} fill="none" stroke="#efe3cc" strokeWidth={w * 0.35} strokeDasharray="14 22" opacity={0.7 * u} />}
    </g>
  );

// ---------- palitos de cuenta tallados (años, días) ----------
export const Palotes: React.FC<{ x: number; y: number; n: number; u: number; color?: string; h?: number }> = ({ x, y, n, u, color = "#efe3cc", h = 60 }) => {
  const k = Math.floor(n * u);
  return (
    <g>
      {Array.from({ length: k }, (_, i) => {
        const g = Math.floor(i / 5);
        const j = i % 5;
        if (j === 4) return <line key={i} x1={x + g * 90 - 8} y1={y + h * 0.8} x2={x + g * 90 + 62} y2={y + h * 0.15} stroke={color} strokeWidth={7} strokeLinecap="round" />;
        return <line key={i} x1={x + g * 90 + j * 14} y1={y} x2={x + g * 90 + j * 14 + 2} y2={y + h} stroke={color} strokeWidth={7} strokeLinecap="round" />;
      })}
    </g>
  );
};
