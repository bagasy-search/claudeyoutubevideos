import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { C, ent, fontFamily, prog } from "./kit";

// Kit naval de soot02 (todo vector en código, cero imágenes): el MAR continuo (cielo + sol/luna + nubes + olas en capas),
// la quinquerreme de costado con 3 filas de remos que bogan, el CORTE interior con los tres niveles de remeros,
// espolón, corvus, columna rostrata, Vesubio, Coliseo con velario, pollos sagrados, diploma de bronce y carta de papiro.
const TINTA = "#2a1530";
type Pos = { x: number; y: number; s?: number; t?: number; t0?: number; t1?: number; rot?: number; op?: number };
const Obj: React.FC<Pos & { w: number; h: number; children: React.ReactNode }> = ({ x, y, s = 1, t = 0, t0, t1 = 1e9, rot = 0, op = 1, w, h, children }) => {
  if (t0 !== undefined && t < t0) return null;
  const e = t0 === undefined ? 1 : ent(t, t0);
  const out = t > t1 ? Math.max(0, 1 - (t - t1) / 0.2) : 1;
  return (
    <svg style={{ position: "absolute", left: x - (w / 2) * s, top: y - (h / 2) * s, overflow: "visible", opacity: op * out, transform: `scale(${e * (0.8 + 0.2 * out)}) rotate(${rot + (1 - e) * -14}deg)` }} width={w * s} height={h * s} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
      {children}
    </svg>
  );
};
const Brillo: React.FC<{ d: string; w?: number }> = ({ d, w = 10 }) => <path d={d} stroke="#fff" strokeOpacity={0.55} strokeWidth={w} fill="none" strokeLinecap="round" />;

// ── cielos del mundo (se mezclan: el mundo nunca corta, sólo cambia la hora y el clima)
export const CIELO: Record<string, string[]> = {
  alba: ["#3a2a7a", "#7a4aa8", "#e27a8a", "#ffb07a", "#ffe0a8"],
  dia: ["#3f9fe0", "#62b8ec", "#8fd0f2", "#c4e8f6", "#fff3d6"],
  tarde: ["#2d1b69", "#7a2f8f", "#e2557a", "#ff9a4d", "#ffd27a"],
  noche: ["#0b0826", "#16103a", "#24185a", "#3a2a7a", "#5a43a0"],
  tormenta: ["#14122a", "#232444", "#34385e", "#4a4f78", "#6a6f92"],
  ceniza: ["#1a0e10", "#3a1a18", "#6a2a1a", "#a8461e", "#e2783a"],
};
const mezclaHex = (a: string, b: string, u: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * u).toString(16).padStart(2, "0")).join("");
};
// clima del mundo en el segundo t: keyframes [t, cielo, oleaje 0-1]
export type Clave = [number, keyof typeof CIELO, number];
export const climaEn = (t: number, claves: Clave[]) => {
  let i = 0;
  while (i < claves.length - 1 && claves[i + 1][0] <= t) i++;
  const a = claves[i], b = claves[Math.min(i + 1, claves.length - 1)];
  const u = b[0] > a[0] ? interpolate(t, [a[0], b[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  // la transición de cielo ocupa sólo los últimos 4 s del tramo: casi siempre se ve un cielo puro
  const uc = b[0] > a[0] ? interpolate(t, [Math.max(a[0], b[0] - 4), b[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const cielo = CIELO[a[1]].map((c, k) => mezclaHex(c, CIELO[b[1]][k], uc));
  return { cielo, ola: a[2] + (b[2] - a[2]) * u, noche: a[1] === "noche" || a[1] === "tormenta" ? 1 - uc * (b[1] === "noche" || b[1] === "tormenta" ? 0 : 1) : uc * (b[1] === "noche" || b[1] === "tormenta" ? 1 : 0) };
};
export const CieloMix: React.FC<{ c: string[] }> = ({ c }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${c[0]} 0%, ${c[1]} 30%, ${c[2]} 55%, ${c[3]} 78%, ${c[4]} 100%)` }} />
);
export const Nubes: React.FC<{ t: number; n?: number; seed?: number; color?: string; op?: number; vel?: number; alto?: number }> = ({ t, n = 6, seed = 2, color = "#fff", op = 0.85, vel = 14, alto = 420 }) => {
  const r = rnd(seed);
  const ns = Array.from({ length: n }, () => ({ x: r() * 2400, y: 60 + r() * alto, s: 0.6 + r() * 0.9, v: 0.5 + r() }));
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {ns.map((c, i) => {
        const x = ((c.x + t * vel * c.v) % 2600) - 340;
        return (
          <g key={i} transform={`translate(${x} ${c.y}) scale(${c.s})`} fill={color} opacity={op}>
            <ellipse cx={0} cy={0} rx={150} ry={46} />
            <circle cx={-50} cy={-26} r={52} /><circle cx={30} cy={-44} r={64} /><circle cx={90} cy={-14} r={44} />
          </g>
        );
      })}
    </svg>
  );
};
// olas: capas de agua con crestas que avanzan (amp crece con el oleaje); y0 = línea del horizonte de la capa delantera
export const Olas: React.FC<{ t: number; y0?: number; ola?: number; capas?: number; noche?: number; vel?: number; desde?: number; colores?: string[] }> = ({ t, y0 = 760, ola = 0.2, capas = 4, noche = 0, vel = 1, desde = 0, colores }) => {
  const base = colores ?? ["#3a8fd0", "#2a74b8", "#1f5c9c", "#174a82", "#103a6a"];
  const osc = ["#2a2f6a", "#22265a", "#1b1f4c", "#15183e", "#101230"];
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: capas }, (_, i) => {
        const k = i / Math.max(1, capas - 1);
        const y = y0 - 150 + k * 150 + i * 60;
        const amp = (10 + ola * 70) * (0.5 + k * 0.8);
        const lam = 220 + k * 160 - ola * 40;
        const ph = t * (1.2 + k * 0.9) * vel + i * 1.7 + desde;
        const pts: string[] = [];
        for (let x = -40; x <= 1960; x += 20) {
          const yy = y + Math.sin(x / lam * Math.PI * 2 - ph) * amp + Math.sin(x / (lam * 0.43) * Math.PI * 2 + ph * 1.3) * amp * 0.28;
          pts.push(`${x},${yy}`);
        }
        const col = mezclaHex(base[i % base.length], osc[i % osc.length], noche);
        return (
          <g key={i}>
            <polygon points={`-40,1100 ${pts.join(" ")} 1960,1100`} fill={col} />
            <polyline points={pts.join(" ")} fill="none" stroke="#fff" strokeOpacity={0.22 + ola * 0.3} strokeWidth={4 + ola * 6} strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};
// espuma/salpicaduras puntuales
export const Salpica: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; n?: number }> = ({ t, t0, x, y, s = 1, n = 16 }) => {
  if (t < t0 || t > t0 + 1.4) return null;
  const r = rnd(Math.round(t0 * 100));
  const u = t - t0;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI * (0.1 + r() * 0.8), v = (300 + r() * 600) * s;
        const px = x + Math.cos(a) * v * u, py = y + Math.sin(a) * v * u + 900 * u * u;
        return <circle key={i} cx={px} cy={py} r={(8 + r() * 14) * s * (1 - u / 1.4)} fill="#e8f6ff" opacity={0.9} />;
      })}
    </svg>
  );
};

// ── LA QUINQUERREME de costado (proa a la derecha). Origen = línea de flotación, centro del casco. Largo ~1500 u.
// boga = ciclos por segundo de los remos (0 = quietos), corvus = ángulo del puente (0 levantado, 1 caído), rompe = 0-1 casco roto
export const Galera: React.FC<{ x: number; y: number; s?: number; t: number; boga?: number; flip?: boolean; corvus?: number | null; vela?: boolean; balanceo?: number; rompe?: number; hunde?: number; color?: string; franja?: string; marines?: boolean; nombre?: string; humo?: boolean; tinte?: string; agua?: string | null; aguaY?: number; ola?: number }> = ({ x, y, s = 1, t, boga = 0.6, flip, corvus = null, vela, balanceo = 1, rompe = 0, hunde = 0, color = "#9a5a2a", franja = C.rojo, marines = true, nombre, tinte, agua = "#1f5c9c", aguaY = 70, ola = 0.3 }) => {
  const rol = Math.sin(t * 1.3) * 1.6 * balanceo, bob = Math.sin(t * 1.9) * 8 * balanceo;
  const fase = t * boga * Math.PI * 2;
  const filas = [{ y: -36, n: 28, l: 300 }, { y: 0, n: 30, l: 330 }, { y: 34, n: 30, l: 290 }];
  return (
    <svg style={{ position: "absolute", left: x - 900 * s, top: y - 700 * s, overflow: "visible", filter: tinte }} width={1800 * s} height={1100 * s} viewBox="-900 -700 1800 1100">
      <g transform={`scale(${flip ? -1 : 1} 1) translate(0 ${bob + hunde * 320}) rotate(${rol + hunde * 75})`} opacity={1 - Math.max(0, hunde - 0.7) * 3}>
        {/* remos (detrás del casco: entran al agua) */}
        {filas.map((f, fi) => Array.from({ length: f.n }, (_, i) => {
          const xx = -560 + i * (1080 / f.n) + fi * 10;
          const a = boga ? Math.sin(fase - fi * 0.15) : 0;
          const ang = 62 + a * 16 + fi * 4, lev = boga ? Math.max(0, Math.cos(fase - fi * 0.15)) * 26 : 0;
          const rx = xx + Math.cos((ang * Math.PI) / 180) * f.l * (a * 0.35 + 0.15), ry = f.y + Math.sin((ang * Math.PI) / 180) * f.l - lev;
          return <line key={fi + "-" + i} x1={xx} y1={f.y} x2={rx} y2={ry} stroke={fi === 1 ? "#d8a868" : "#c49058"} strokeWidth={9} strokeLinecap="round" />;
        }))}
        {/* mástil y vela */}
        {vela && (
          <g>
            <rect x={-30} y={-640} width={22} height={560} fill="#6b3a1f" />
            <rect x={-260} y={-600} width={480} height={14} rx={7} fill="#6b3a1f" />
            <path d={`M -250 -588 Q ${-20 + Math.sin(t * 2) * 10} ${-560 + Math.sin(t * 2.2) * 8} 210 -588 L 230 -250 Q -20 -210 -270 -250 Z`} fill="#f2ead8" />
            <path d="M -110 -520 L 70 -520 L -20 -330 Z" fill={franja} opacity={0.85} />
          </g>
        )}
        {/* casco */}
        <path d="M -720 -120 Q -800 -200 -770 -300 Q -740 -250 -690 -110 L 640 -110 L 700 -60 L 820 0 L 860 34 L 700 40 Q 660 92 560 100 L -560 100 Q -680 80 -720 -120 Z" fill={color} />
        <path d="M -690 -110 L 640 -110 L 700 -60 L -650 -60 Z" fill="#b8733a" />
        <path d="M -560 100 L 560 100 Q 640 94 690 50 L -700 50 Q -660 92 -560 100 Z" fill="rgba(40,10,30,.35)" />
        <rect x={-660} y={-96} width={1300} height={18} fill={franja} />
        {/* troneras de las tres filas */}
        {filas.map((f, fi) => Array.from({ length: f.n }, (_, i) => <ellipse key={"p" + fi + i} cx={-560 + i * (1080 / f.n) + fi * 10} cy={f.y} rx={9} ry={7} fill="#3a1a10" />))}
        {/* ojo de proa */}
        <ellipse cx={640} cy={-20} rx={34} ry={20} fill="#fff" stroke={TINTA} strokeWidth={6} />
        <circle cx={650} cy={-20} r={11} fill={TINTA} />
        {/* espolón de bronce en la línea de flotación */}
        <path d="M 760 10 L 930 30 L 940 46 L 930 62 L 760 72 Z" fill="#d9962e" />
        <path d="M 790 24 L 920 40 M 790 58 L 920 52" stroke="#8a5414" strokeWidth={6} />
        <path d="M 770 20 L 900 34" stroke="#ffe08a" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        {/* popa curva (aplustre) */}
        <path d="M -770 -300 Q -830 -380 -760 -420 Q -790 -360 -740 -330 Z" fill="#b8733a" />
        {/* escudos en la borda + infantes */}
        {Array.from({ length: 16 }, (_, i) => <ellipse key={"e" + i} cx={-560 + i * 72} cy={-128} rx={26} ry={34} fill={i % 2 ? "#c81d2e" : "#e9a92a"} stroke="#5a1a10" strokeWidth={4} />)}
        {marines && Array.from({ length: 9 }, (_, i) => (
          <g key={"m" + i} transform={`translate(${-430 + i * 120} -160)`}>
            <rect x={-16} y={-70} width={32} height={60} rx={12} fill="#a3202f" />
            <circle cx={0} cy={-88} r={18} fill="#f2b48a" />
            <path d="M -20 -88 Q -20 -112 0 -112 Q 20 -112 20 -88 Z" fill="#e9a92a" />
            <line x1={18} y1={-60} x2={30} y2={-150} stroke="#6b3a1f" strokeWidth={6} />
          </g>
        ))}
        {/* corvus: poste en proa + puente con pico */}
        {corvus !== null && (() => {
          const ang = interpolate(corvus, [0, 1], [-78, 6]);
          return (
            <g>
              <rect x={470} y={-470} width={22} height={370} fill="#6b3a1f" />
              <line x1={481} y1={-470} x2={481 + Math.cos(((ang + 0) * Math.PI) / 180) * 520} y2={-110 + Math.sin((ang * Math.PI) / 180) * 520} stroke="#8a6a4a" strokeWidth={3} />
              <g transform={`translate(470 -110) rotate(${ang})`}>
                <rect x={0} y={-24} width={520} height={34} rx={6} fill="#c49058" />
                {Array.from({ length: 10 }, (_, i) => <line key={i} x1={20 + i * 50} y1={-24} x2={20 + i * 50} y2={10} stroke="#8a5a2a" strokeWidth={5} />)}
                <rect x={0} y={-44} width={520} height={8} fill="#8a5a2a" />
                <path d="M 500 10 L 520 10 L 512 90 Z" fill="#8a93a3" stroke="#5d6577" strokeWidth={4} />
              </g>
            </g>
          );
        })()}
        {nombre && <text x={-300} y={-10} fontFamily={fontFamily} fontWeight={700} fontSize={54} fill="#ffe08a" opacity={0.9}>{nombre}</text>}
        {/* rotura */}
        {rompe > 0 && (
          <g>
            <path d={`M 120 -40 L 160 -70 L 190 -30 L 240 -60 L 230 10 L 270 40 L 200 60 L 170 30 L 130 60 Z`} fill="#1a0a0a" transform={`scale(${rompe}) translate(${(1 - rompe) * 200} 0)`} />
          </g>
        )}
      </g>
      {agua && (() => {
        const id = `ag${Math.round(x)}${Math.round(y)}${flip ? 1 : 0}`;
        const amp = 8 + ola * 40;
        const pts = Array.from({ length: 61 }, (_, i) => { const xx = -1200 + i * 40; return `${xx},${aguaY + Math.sin(xx / 170 - t * (1.6 + ola)) * amp + Math.sin(xx / 70 + t * 2.1) * amp * 0.25}`; }).join(" ");
        return (
          <g>
            <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={agua} stopOpacity={0} /><stop offset="0.18" stopColor={agua} stopOpacity={1} /><stop offset="0.82" stopColor={agua} stopOpacity={1} /><stop offset="1" stopColor={agua} stopOpacity={0} /></linearGradient></defs>
            <polygon points={`-1200,520 ${pts} 1200,520`} fill={`url(#${id})`} />
            <polyline points={pts} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={6} />
          </g>
        );
      })()}
    </svg>
  );
};

// ── remero sentado (para el CORTE): mira a la izquierda (popa), tira del remo. fase en radianes; tam = altura total ~ 300 u
export const Remero: React.FC<{ fase: number; ropa?: string; piel?: string; pelo?: string; expr?: "neutro" | "miedo" | "cansado" | "dormido" | "feliz"; sudor?: boolean; seed?: number; t?: number }> = ({ fase, ropa = "#2a8fb0", piel = "#f2b48a", pelo = "#3a2214", expr = "cansado", sudor, seed = 1, t = 0 }) => {
  const k = Math.sin(fase); // -1 adelante (brazos estirados), 1 atrás (tirando)
  const torso = -10 + k * 22;
  const r = rnd(seed);
  const parp = ((t + r() * 4) % 3.3) < 0.12;
  return (
    <g>
      <rect x={-70} y={-6} width={140} height={20} rx={6} fill="#6b3a1f" />
      <g transform={`rotate(${torso} 0 -10)`}>
        <path d="M -38 -10 L -44 -130 Q 0 -150 44 -130 L 38 -10 Z" fill={ropa} />
        <circle cx={-52} cy={-198} r={14} fill={piel} />
        <circle cx={0} cy={-196} r={58} fill={piel} />
        <path d="M -58 -200 Q -60 -262 0 -262 Q 60 -262 58 -206 Q 30 -236 -10 -232 Q -40 -236 -58 -200 Z" fill={pelo} />
        <ellipse cx={-30} cy={-176} rx={11} ry={7} fill="#ff6f6f" opacity={0.35} />
        {/* ojos mirando a la izquierda */}
        {[-24, 10].map((ex, i) => parp || expr === "dormido"
          ? <path key={i} d={`M ${ex - 11} -200 Q ${ex} -194 ${ex + 11} -200`} stroke="#2a1a10" strokeWidth={4} fill="none" strokeLinecap="round" />
          : <g key={i}><ellipse cx={ex} cy={-200} rx={12} ry={expr === "miedo" ? 16 : 14} fill="#fff" /><circle cx={ex - 4} cy={-198} r={expr === "miedo" ? 5 : 7} fill="#2a1a10" /></g>)}
        <path d={expr === "miedo" ? "M -26 -166 Q -12 -178 2 -166" : expr === "feliz" ? "M -26 -168 Q -12 -154 2 -168" : "M -24 -164 Q -12 -170 0 -164"} stroke="#5a1a22" strokeWidth={5} fill="none" strokeLinecap="round" />
        {(expr === "cansado" || expr === "miedo") && <line x1={-38} y1={-224} x2={-12} y2={-218} stroke={pelo} strokeWidth={5} strokeLinecap="round" />}
        {sudor && <path transform={`translate(30 ${-230 + ((t * 0.9 + r()) % 1) * 60})`} d="M 0 -14 Q 9 0 0 7 Q -9 0 0 -14 Z" fill="#7fd6ff" stroke="#fff" strokeWidth={2} />}
        {/* brazos hacia el remo (a la derecha, adelante) */}
        <path d={`M 6 -122 L ${52 - k * 18} ${-92 + k * 6}`} stroke={ropa} strokeWidth={26} fill="none" strokeLinecap="round" />
        <path d={`M ${52 - k * 18} ${-92 + k * 6} L ${110 - k * 40} -70`} stroke={piel} strokeWidth={17} fill="none" strokeLinecap="round" />
        <circle cx={110 - k * 40} cy={-70} r={14} fill={piel} />
      </g>
      {/* piernas */}
      <path d={`M 64 ${-6 + k * 3} L ${82 + k * 6} 70`} stroke={piel} strokeWidth={19} fill="none" strokeLinecap="round" />
      <ellipse cx={96 + k * 6} cy={76} rx={24} ry={9} fill="#5a3418" />
      <path d={`M -26 -4 L 64 ${-6 + k * 3}`} stroke={ropa} strokeWidth={32} fill="none" strokeLinecap="round" />
      <path d="M -34 -40 L 30 -40 L 40 6 L -40 6 Z" fill={ropa} opacity={0.85} />
    </g>
  );
};
// ── EL CORTE: interior del casco abierto con los 3 niveles. Ocupa la pantalla; foco = remero protagonista (nivel de abajo, col 2).
// agua = nivel de la sentina/inundación 0-1; luz = cuánto cielo entra arriba; boga = ritmo; caos = remos que chocan
export const Corte: React.FC<{ t: number; boga?: number; agua?: number; luz?: number; caos?: number; heroeExpr?: "neutro" | "miedo" | "cansado" | "dormido" | "feliz"; sudor?: boolean; hortator?: boolean; oscuro?: number; inclina?: number; vacio?: boolean }> = ({ t, boga = 0.55, agua = 0.06, luz = 1, caos = 0, heroeExpr = "cansado", sudor = true, hortator = true, oscuro = 0, inclina = 0, vacio }) => {
  const fase = t * boga * Math.PI * 2;
  const niveles = [{ y: 330, ropa: ["#9a6a4a", "#7a7a5a", "#8a5a7a"] }, { y: 600, ropa: ["#6a7a4a", "#a8673f", "#7a6a9a"] }, { y: 880, ropa: ["#8a5a4a", "#6a5a7a", "#9a7a4a"] }];
  const pieles = ["#f2b48a", "#c98b62", "#8d5a3b", "#f5c7a0"];
  const nivAgua = 1080 - agua * 820;
  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `rotate(${inclina}deg) scale(${1 + Math.abs(inclina) * 0.012})` }}>
      {/* madera interior */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #7a4520 0%, #5a3018 45%, #3a1c0e 100%)" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 22 }, (_, i) => <line key={i} x1={0} y1={i * 52} x2={1920} y2={i * 52} stroke="#2a1408" strokeOpacity={0.35} strokeWidth={4} />)}
        {Array.from({ length: 9 }, (_, i) => <rect key={"c" + i} x={i * 240 - 10} y={0} width={26} height={1080} fill="#4a2410" opacity={0.7} />)}
        {/* luz de arriba (cubierta con rejilla) */}
        <rect x={0} y={0} width={1920} height={70} fill="#2a1408" />
        {Array.from({ length: 16 }, (_, i) => <rect key={"g" + i} x={20 + i * 120} y={12} width={90} height={46} fill="#ffe8a8" opacity={0.55 * luz} />)}
        {Array.from({ length: 6 }, (_, i) => <polygon key={"r" + i} points={`${120 + i * 320},60 ${190 + i * 320},60 ${330 + i * 320},1080 ${180 + i * 320},1080`} fill="#fff3c4" opacity={0.07 * luz * (1 - oscuro)} />)}
        {/* pisos de cada nivel */}
        {niveles.map((n, i) => <rect key={"p" + i} x={0} y={n.y + 70} width={1920} height={24} fill="#3a1c0e" />)}
        {/* troneras con manga de cuero en el casco (derecha = costado) */}
        {niveles.map((n, i) => Array.from({ length: 4 }, (_, k) => <g key={"t" + i + k}><ellipse cx={360 + k * 440 + 150} cy={n.y - 90} rx={22} ry={16} fill={i === 2 ? "#2f86b0" : "#ffe8a8"} opacity={i === 2 ? 0.9 : 0.6} /><ellipse cx={360 + k * 440 + 150} cy={n.y - 90} rx={34} ry={26} fill="none" stroke="#8a5a2a" strokeWidth={10} /></g>))}
      </svg>
      {/* remeros */}
      {!vacio && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {niveles.map((n, i) => Array.from({ length: 4 }, (_, k) => {
            const r = rnd(i * 10 + k + 3);
            const desf = caos ? (r() - 0.5) * caos * 2.4 : 0;
            const f = fase - i * 0.15 + desf;
            const heroe = i === 2 && k === 1;
            const cx = 360 + k * 440;
            const kk = Math.sin(f);
            return (
              <g key={i + "-" + k}>
                {/* el remo: del puño a la tronera */}
                <line x1={cx + 110 - kk * 40} y1={n.y - 70 + 20} x2={cx + 150} y2={n.y - 90} stroke="#d8a868" strokeWidth={16} strokeLinecap="round" />
                <g transform={`translate(${cx} ${n.y + 60}) scale(1.05)`}>
                  <Remero fase={f} ropa={heroe ? "#2fb5d8" : n.ropa[k % 3]} piel={heroe ? "#c98b62" : pieles[(i + k) % 4]} pelo={heroe ? "#1d1410" : ["#3a2214", "#1d1410", "#7a4a22"][(i * 2 + k) % 3]} expr={heroe ? heroeExpr : (["cansado", "neutro", "cansado", "dormido"] as const)[(i + k * 3) % 4] === "dormido" && boga > 0.3 ? "cansado" : (["cansado", "neutro", "cansado", "neutro"] as const)[(i + k) % 4]} sudor={sudor && (heroe || r() < 0.5)} seed={i * 10 + k} t={t} />
                </g>
              </g>
            );
          }))}
        </svg>
      )}
      {/* el hortator con su mazo, arriba a la izquierda */}
      {hortator && (() => {
        const golpe = Math.max(0, Math.cos(fase)) ** 8;
        return (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
            <g transform="translate(150 300)">
              <rect x={-60} y={-10} width={120} height={60} rx={8} fill="#6b3a1f" />
              <rect x={-30} y={-150} width={60} height={140} rx={18} fill="#4a3a8a" />
              <circle cx={0} cy={-190} r={46} fill="#d99872" />
              <path d="M -46 -196 Q -40 -240 0 -240 Q 40 -240 46 -196 Q 20 -214 0 -212 Q -20 -214 -46 -196 Z" fill="#2a1a10" />
              <circle cx={14} cy={-196} r={7} fill="#2a1a10" />
              <ellipse cx={14} cy={-166} rx={12} ry={6 + golpe * 8} fill="#5a1a22" />
              <g transform={`translate(30 -120) rotate(${-70 + golpe * 70})`}>
                <rect x={-6} y={0} width={12} height={110} fill="#6b3a1f" />
                <rect x={-26} y={100} width={52} height={36} rx={8} fill="#8a5a2a" />
              </g>
            </g>
          </svg>
        );
      })()}
      {/* sentina / agua que sube */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
        <path d={`M 0 ${nivAgua} ${Array.from({ length: 50 }, (_, i) => `L ${i * 40} ${nivAgua + Math.sin(i * 0.6 + t * 4) * (6 + agua * 14)}`).join(" ")} L 1960 ${nivAgua} L 1960 1080 L 0 1080 Z`} fill={agua > 0.15 ? "#2a6a9a" : "#5a6a3a"} opacity={agua > 0.15 ? 0.82 : 0.75} />
        {agua <= 0.15 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={100 + i * 230} cy={nivAgua + 20 + Math.sin(t * 2 + i) * 6} r={5} fill="#a8b86a" opacity={0.7} />)}
      </svg>
      {oscuro > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 37% 78%, rgba(10,5,20,0) 10%, rgba(10,5,20,${oscuro}) 45%)` }} />}
    </AbsoluteFill>
  );
};

// ── objetos del video
export const Carta: React.FC<Pos & { lineas?: number; firma?: string; escribe?: number; titulo?: string; tachado?: string; nuevo?: string; tn?: number }> = ({ lineas = 7, firma, escribe = 1, titulo, tachado, nuevo, tn = 1e9, ...p }) => {
  const nn = (p.t ?? 0) >= tn ? prog(p.t ?? 0, tn, tn + 0.4) : 0;
  return (
    <Obj {...p} w={620} h={760}>
      <rect x={-284} y={-350} width={580} height={720} rx={10} fill="rgba(20,8,40,.3)" />
      <path d="M -300 -366 L 280 -372 L 290 350 L -296 356 Z" fill="#e8cf96" />
      {Array.from({ length: 14 }, (_, i) => <line key={i} x1={-300} y1={-340 + i * 50} x2={286} y2={-344 + i * 50} stroke="#c9ad6a" strokeWidth={3} opacity={0.5} />)}
      {Array.from({ length: 10 }, (_, i) => <line key={"v" + i} x1={-280 + i * 60} y1={-366} x2={-276 + i * 60} y2={354} stroke="#c9ad6a" strokeWidth={2} opacity={0.35} />)}
      {titulo && <text x={0} y={-270} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={46} fill="#5a2a10">{titulo}</text>}
      {Array.from({ length: lineas }, (_, i) => {
        const r = rnd(i + 11);
        const w = 380 + r() * 120, k = Math.max(0, Math.min(1, escribe * lineas - i));
        return <path key={i} d={`M -240 ${-190 + i * 56} ${Array.from({ length: 12 }, (_, j) => `q ${w / 24} ${(j % 2 ? 1 : -1) * 8} ${w / 12} 0`).join(" ")}`} stroke="#3a2010" strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />;
      })}
      {tachado && (
        <g>
          <text x={0} y={250} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={58} fill="#3a2010">{tachado}</text>
          {nn > 0 && <line x1={-140} y1={232} x2={-140 + 280 * nn} y2={232} stroke={C.rojo} strokeWidth={10} strokeLinecap="round" />}
        </g>
      )}
      {nuevo && nn > 0 && <text x={0} y={322} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={50} fill={C.rojo} opacity={nn}>{nuevo}</text>}
      {firma && <text x={140} y={300} textAnchor="middle" fontFamily="'Brush Script MT', cursive" fontStyle="italic" fontSize={54} fill="#2a1a10">{firma}</text>}
    </Obj>
  );
};
export const DiplomaBronce: React.FC<Pos & { abre?: number; texto?: string }> = ({ abre = 1, texto, ...p }) => (
  <Obj {...p} w={640} h={480}>
    <defs><linearGradient id="bronce2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd88a" /><stop offset="0.45" stopColor="#d08a3a" /><stop offset="1" stopColor="#7a4414" /></linearGradient></defs>
    <g transform={`translate(${-150 * abre} 0) rotate(${-6 * abre})`}>
      <rect x={-150} y={-200} width={300} height={400} rx={14} fill="url(#bronce2)" stroke="#6a3a10" strokeWidth={8} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-120} y={-160 + i * 38} width={i % 3 === 2 ? 170 : 240} height={10} rx={5} fill="#7a4414" opacity={0.75} />)}
      {[-80, 80].map((yy) => <circle key={yy} cx={130} cy={yy} r={10} fill="#4a2a08" />)}
    </g>
    <g transform={`translate(${150 * abre} 0) rotate(${6 * abre})`}>
      <rect x={-150} y={-200} width={300} height={400} rx={14} fill="url(#bronce2)" stroke="#6a3a10" strokeWidth={8} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-120} y={-160 + i * 38} width={i % 3 === 1 ? 160 : 240} height={10} rx={5} fill="#7a4414" opacity={0.75} />)}
      {[-80, 80].map((yy) => <circle key={yy} cx={-130} cy={yy} r={10} fill="#4a2a08" />)}
    </g>
    <path d={`M ${-20 + 150 * abre - 130} -80 Q 0 -110 ${20 - 150 * abre + 130} -80 M ${-20 + 150 * abre - 130} 80 Q 0 110 ${20 - 150 * abre + 130} 80`} stroke="#c8ccd4" strokeWidth={6} fill="none" opacity={abre > 0.3 ? 1 : 0.2} />
    {texto && <text x={0} y={250} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#fff" stroke={TINTA} strokeWidth={8} paintOrder="stroke">{texto}</text>}
    <Brillo d="M -270 -170 Q -250 -200 -200 -196" />
  </Obj>
);
export const Espolon: React.FC<Pos & { texto?: boolean }> = ({ texto, ...p }) => (
  <Obj {...p} w={900} h={460}>
    <defs><linearGradient id="bronce3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe08a" /><stop offset="0.4" stopColor="#d9962e" /><stop offset="1" stopColor="#6a3a0a" /></linearGradient></defs>
    <path d="M -400 -160 L 120 -120 L 380 -40 L 420 0 L 380 40 L 120 120 L -400 160 Z" fill="url(#bronce3)" stroke="#5a3008" strokeWidth={10} />
    {[-80, 0, 80].map((yy) => <path key={yy} d={`M -380 ${yy * 1.6} L 400 ${yy * 0.1}`} stroke="#8a5414" strokeWidth={14} />)}
    <path d="M -400 -160 L -400 160 L -300 150 L -300 -150 Z" fill="#a8650f" />
    <path d="M -360 -130 L 100 -100" stroke="#fff3c4" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
    {texto && <text x={-120} y={-30} fontFamily="serif" fontWeight={700} fontSize={40} fill="#6a3a0a" opacity={0.85}>M·POPLICIO·CN·F</text>}
  </Obj>
);
export const Pollo: React.FC<Pos & { cae?: number }> = ({ cae, ...p }) => {
  const u = cae !== undefined && (p.t ?? 0) > cae ? (p.t ?? 0) - cae : 0;
  return (
    <Obj {...p} w={220} h={220}>
      <g transform={`translate(${u * 260} ${u * u * 900 - u * 200}) rotate(${u * 480})`}>
        <ellipse cx={0} cy={20} rx={70} ry={56} fill="#fff6e8" />
        <circle cx={46} cy={-40} r={36} fill="#fff6e8" />
        <path d="M 40 -78 Q 46 -100 56 -80 Q 62 -100 70 -76 Z" fill={C.rojo} />
        <path d="M 78 -42 L 104 -34 L 78 -26 Z" fill={C.ambar} />
        <path d="M 66 -22 Q 72 -6 62 -6 Z" fill={C.rojo} />
        <circle cx={56} cy={-46} r={6} fill={TINTA} />
        <path d="M -70 10 Q -110 -20 -96 -60 Q -80 -20 -60 -10 Z" fill="#e8d8c0" />
        <path d="M -20 10 Q 10 40 40 10" stroke="#e8d8c0" strokeWidth={8} fill="none" />
        <path d="M -10 74 L -16 100 M 20 74 L 26 100" stroke={C.ambar} strokeWidth={8} strokeLinecap="round" />
      </g>
    </Obj>
  );
};
export const Columna: React.FC<Pos & { n?: number; t: number; tR?: number }> = ({ n = 6, tR = -9, ...p }) => (
  <Obj {...p} w={420} h={1000}>
    <rect x={-140} y={420} width={280} height={70} fill="#c9b8a0" />
    <rect x={-80} y={-400} width={160} height={830} fill="#e8dcc4" />
    {Array.from({ length: 5 }, (_, i) => <line key={i} x1={-56 + i * 28} y1={-400} x2={-56 + i * 28} y2={420} stroke="#c9b8a0" strokeWidth={5} />)}
    <rect x={-120} y={-440} width={240} height={50} fill="#c9b8a0" />
    <circle cx={0} cy={-480} r={40} fill="#d9962e" />
    {Array.from({ length: n }, (_, i) => {
      const lado = i % 2 ? 1 : -1, yy = -320 + Math.floor(i / 2) * 260;
      const e = (p.t ?? 0) >= tR + i * 0.12 ? ent(p.t ?? 0, tR + i * 0.12) : 0;
      return <path key={i} transform={`translate(${lado * 80} ${yy}) scale(${lado * e} ${e})`} d="M 0 -40 L 120 -20 L 150 0 L 120 20 L 0 40 Z" fill="#d9962e" stroke="#6a3a0a" strokeWidth={6} />;
    })}
  </Obj>
);
export const Volcan: React.FC<Pos & { erupcion?: number; t: number }> = ({ erupcion = 1, ...p }) => {
  const t = p.t ?? 0, u = erupcion;
  return (
    <Obj {...p} w={1400} h={1100}>
      {/* columna en forma de pino (la descripción de Plinio el Joven) */}
      {u > 0 && (
        <g opacity={Math.min(1, u * 1.5)}>
          <path d={`M -40 80 Q -60 ${-200 * u} -30 ${-420 * u} L 30 ${-420 * u} Q 60 ${-200 * u} 40 80 Z`} fill="#6a5a5a" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = (i / 8) * Math.PI, rr = 160 + i * 30;
            return <circle key={i} cx={Math.cos(a) * rr * u * 1.6 - 0} cy={-480 * u - Math.sin(a) * 90 * u + Math.sin(t * 0.8 + i) * 10} r={(110 + (i % 3) * 30) * u} fill={["#5a4a4a", "#7a6a68", "#4a3a3a"][i % 3]} />;
          })}
          {Array.from({ length: 14 }, (_, i) => { const r = rnd(i + 3); const k = (t * 0.7 + r()) % 1; return <circle key={"b" + i} cx={(r() - 0.5) * 600 * k} cy={-60 - k * 400 + k * k * 500} r={8 + r() * 10} fill="#ff7a3d" opacity={1 - k} />; })}
        </g>
      )}
      <path d="M -680 520 L -220 40 Q -150 -10 -60 60 L 0 80 L 60 60 Q 150 -10 220 40 L 680 520 Z" fill="#5a4a6a" />
      <path d="M -220 40 L -60 60 L 0 80 L 60 60 L 220 40 L 300 130 L -300 130 Z" fill="#7a6a8a" />
      {u > 0.2 && <path d="M -40 80 Q -80 200 -150 300 Q -60 230 0 170 Q 60 230 120 330 Q 80 200 40 80 Z" fill="#ff6a2a" opacity={0.8} />}
    </Obj>
  );
};
export const Coliseo: React.FC<Pos & { velario?: number }> = ({ velario = 0, ...p }) => (
  <Obj {...p} w={1300} h={700}>
    <ellipse cx={0} cy={200} rx={620} ry={110} fill="#a8946e" />
    <rect x={-600} y={-160} width={1200} height={360} fill="#d8c49a" />
    {[0, 1, 2].map((f) => Array.from({ length: 13 }, (_, i) => <path key={f + "-" + i} d={`M ${-570 + i * 90} ${180 - f * 110} L ${-570 + i * 90} ${110 - f * 110} Q ${-540 + i * 90} ${80 - f * 110} ${-510 + i * 90} ${110 - f * 110} L ${-510 + i * 90} ${180 - f * 110} Z`} fill="#8a6e4a" />))}
    <rect x={-600} y={-200} width={1200} height={40} fill="#c9b48a" />
    {Array.from({ length: 24 }, (_, i) => <rect key={"m" + i} x={-590 + i * 50} y={-240} width={8} height={44} fill="#6b3a1f" />)}
    {/* velario: lonas que se despliegan desde el borde */}
    {velario > 0 && Array.from({ length: 12 }, (_, i) => {
      const x0 = -590 + i * 100;
      return <path key={"v" + i} d={`M ${x0} -236 L ${x0 + 100} -236 L ${x0 + 100 - (x0 + 50) * 0.8 * velario} ${-236 - 120 * velario} L ${x0 - (x0 + 50) * 0.8 * velario} ${-236 - 120 * velario} Z`} fill={i % 2 ? "#f2ead8" : C.rojo} opacity={0.95} />;
    })}
  </Obj>
);
export const Cojin: React.FC<Pos> = (p) => (
  <Obj {...p} w={300} h={160}>
    <path d="M -130 -40 Q 0 -80 130 -40 Q 150 0 130 40 Q 0 80 -130 40 Q -150 0 -130 -40 Z" fill="#a8622c" />
    <path d="M -110 -20 Q 0 -50 110 -20" stroke="#d98a4a" strokeWidth={8} fill="none" />
    {[-90, -30, 30, 90].map((xx) => <circle key={xx} cx={xx} cy={0} r={6} fill="#6b3a1f" />)}
  </Obj>
);
export const Remo: React.FC<Pos & { largo?: number }> = ({ largo = 900, ...p }) => (
  <Obj {...p} w={largo + 40} h={140}>
    <rect x={-largo / 2} y={-10} width={largo * 0.8} height={20} rx={10} fill="#c49058" />
    <path d={`M ${largo * 0.28} -10 L ${largo / 2} -40 L ${largo / 2} 40 L ${largo * 0.28} 10 Z`} fill="#d8a868" stroke="#8a5a2a" strokeWidth={5} />
    <rect x={-largo / 2} y={-14} width={90} height={28} rx={12} fill="#8a5a2a" />
  </Obj>
);
export const Correa: React.FC<Pos> = (p) => (
  <Obj {...p} w={240} h={240}>
    <ellipse cx={0} cy={0} rx={90} ry={60} fill="none" stroke="#7a4520" strokeWidth={26} />
    <path d="M 80 -10 L 120 -40 L 130 -10 Z" fill="#7a4520" />
  </Obj>
);
export const Galleta: React.FC<Pos> = (p) => (
  <Obj {...p} w={240} h={240}>
    <circle r={100} fill="#c99a5a" /><circle r={86} fill="#d8ad6a" />
    {[[-40, -30], [20, -50], [40, 20], [-20, 40], [0, -4]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={8} fill="#a8783a" />)}
    <path d="M 60 -60 L 80 -40 L 70 -20" stroke="#8a5a2a" strokeWidth={6} fill="none" />
  </Obj>
);
export const Anfora: React.FC<Pos & { txt?: string }> = ({ txt, ...p }) => (
  <Obj {...p} w={220} h={420}>
    <path d="M -30 -180 L 30 -180 L 30 -140 Q 100 -110 90 40 Q 80 150 0 200 Q -80 150 -90 40 Q -100 -110 -30 -140 Z" fill="#c9673f" />
    <path d="M -30 -150 Q -90 -150 -70 -90 M 30 -150 Q 90 -150 70 -90" stroke="#a8502a" strokeWidth={14} fill="none" />
    <path d="M -60 -60 Q -70 40 -40 120" stroke="#ffb08a" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.5} />
    {txt && <text x={0} y={40} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#fff6e0">{txt}</text>}
  </Obj>
);
export const Lapida2: React.FC<Pos & { barco?: string; anos?: string }> = ({ barco = "MARS", anos = "XXVI", ...p }) => (
  <Obj {...p} w={420} h={560}>
    <path d="M -180 260 L -180 -160 Q -180 -250 0 -250 Q 180 -250 180 -160 L 180 260 Z" fill="#d8d0c4" />
    <path d="M -150 -150 Q -150 -220 0 -220 Q 150 -220 150 -150" stroke="#b8ae9e" strokeWidth={8} fill="none" />
    <text x={0} y={-110} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={44} fill="#6a5e4e">D · M</text>
    <text x={0} y={-30} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={36} fill="#6a5e4e">MIL · CLASSIS</text>
    <text x={0} y={40} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={48} fill="#8a3a1a">III · {barco}</text>
    <text x={0} y={120} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={40} fill="#6a5e4e">STIP · {anos}</text>
    <path d="M -110 180 L -60 160 L 60 160 L 110 180 L 80 210 L -80 210 Z" fill="#b8ae9e" />
  </Obj>
);
// mapa del Mediterráneo simplificado (costas a mano) con puntos: Misenum, Sicilia, Cartago, Egipto...
export const MAR_LUGARES: Record<string, [number, number]> = {
  MISENUM: [905, 455], ROME: [860, 395], RAVENNA: [870, 300], SICILY: [920, 590], MYLAE: [962, 570], CAMARINA: [930, 640], DREPANA: [855, 585], CARTHAGE: [790, 640], EGYPT: [1430, 820], THRACE: [1290, 340], DALMATIA: [1010, 330], SYRIA: [1560, 640], AEGATES: [830, 600], STABIAE: [920, 470], ISRAEL: [1590, 720],
};
export const MapaMar: React.FC<{ t: number; puntos?: { n: string; t0: number; color?: string; label?: boolean }[]; rutas?: { de: string; a: string; t0: number; d?: number }[]; zoom?: { n: string; z: number; t: [number, number] }; restos?: { n: string; t0: number; k: number }[] }> = ({ t, puntos = [], rutas = [], zoom, restos = [] }) => {
  const tierra = "#e8c48a", tierra2 = "#c9a46a";
  let tr = "";
  if (zoom) { const v = prog(t, zoom.t[0], zoom.t[1]); const [lx, ly] = MAR_LUGARES[zoom.n]; const z = 1 + (zoom.z - 1) * v; tr = `translate(${(960 - lx * z) * v}px, ${(540 - ly * z) * v}px) scale(${z})`; }
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #3a8fd0, #1f5c9c 70%, #143e70)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: tr || undefined }}>
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${-100 + ((i * 173) % 2000)} ${80 + i * 85} q 30 -12 60 0 t 60 0`} stroke="#fff" strokeOpacity={0.18} strokeWidth={4} fill="none" transform={`translate(${Math.sin(t + i) * 10} 0)`} />)}
        {/* Europa */}
        <path d="M 0 0 L 1920 0 L 1920 300 Q 1700 330 1560 300 Q 1440 360 1330 330 Q 1250 380 1190 470 Q 1150 520 1120 470 Q 1100 400 1040 380 Q 990 360 960 420 Q 1010 470 1000 540 Q 970 560 950 520 Q 920 470 880 430 Q 840 380 790 330 Q 740 300 700 330 Q 640 360 600 330 Q 520 300 470 360 Q 420 440 360 470 Q 300 520 220 500 Q 150 470 100 420 Q 60 360 0 360 Z" fill={tierra} />
        {/* Italia (bota) */}
        <path d="M 790 330 Q 830 300 870 290 Q 900 340 930 400 Q 960 450 1000 470 Q 1030 500 1010 530 Q 990 560 960 540 Q 950 510 925 490 Q 900 470 880 450 Q 840 410 790 330 Z" fill={tierra2} />
        {/* Sicilia */}
        <path d="M 850 575 Q 900 560 970 565 Q 960 600 940 640 Q 900 630 860 600 Z" fill={tierra2} />
        {/* Grecia y Balcanes */}
        <path d="M 1040 380 Q 1120 360 1200 400 Q 1220 470 1180 520 Q 1150 560 1170 600 Q 1130 610 1110 560 Q 1080 500 1060 440 Z" fill={tierra2} />
        {/* África */}
        <path d="M 0 700 Q 200 640 420 650 Q 600 640 760 610 Q 820 620 830 660 Q 900 690 1000 720 Q 1150 760 1300 770 Q 1420 760 1500 800 Q 1560 760 1620 700 Q 1700 640 1920 620 L 1920 1080 L 0 1080 Z" fill={tierra} />
        {/* Anatolia y Levante */}
        <path d="M 1250 470 Q 1350 420 1500 430 Q 1600 440 1700 480 Q 1720 560 1640 590 Q 1600 640 1580 700 Q 1560 640 1520 600 Q 1420 560 1330 560 Q 1280 520 1250 470 Z" fill={tierra} />
        {rutas.map((r, i) => {
          if (t < r.t0) return null;
          const [x1, y1] = MAR_LUGARES[r.de], [x2, y2] = MAR_LUGARES[r.a];
          const u = prog(t, r.t0, r.t0 + (r.d ?? 1));
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + 60;
          return <path key={i} d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="1 18" pathLength={1000} style={{ strokeDasharray: `${u * 1000} 1000` }} />;
        })}
        {restos.map((r, i) => {
          if (t < r.t0) return null;
          const [x0, y0] = MAR_LUGARES[r.n];
          const rr = rnd(i + 7);
          return <g key={"r" + i}>{Array.from({ length: r.k }, (_, j) => { const e = ent(t, r.t0 + j * 0.01); const a = rr() * 6.28, d = rr() * 90; return <rect key={j} x={x0 + Math.cos(a) * d} y={y0 + Math.sin(a) * d * 0.6} width={10} height={4} fill="#5a2a10" transform={`rotate(${rr() * 180} ${x0 + Math.cos(a) * d} ${y0 + Math.sin(a) * d * 0.6}) scale(${e})`} />; })}</g>;
        })}
        {puntos.map((p, i) => {
          if (t < p.t0) return null;
          const [x, y] = MAR_LUGARES[p.n];
          const k = ((t - p.t0) % 1.4) / 1.4;
          return (
            <g key={p.n + i}>
              <circle cx={x} cy={y} r={12 + k * 50} fill="none" stroke={p.color ?? C.rojo} strokeWidth={5} opacity={1 - k} />
              <circle cx={x} cy={y} r={13 * ent(t, p.t0)} fill={p.color ?? C.rojo} stroke="#fff" strokeWidth={4} />
              {p.label !== false && <text x={x} y={y - 30} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#fff" stroke={TINTA} strokeWidth={8} paintOrder="stroke" opacity={ent(t, p.t0 + 0.1)}>{p.n}</text>}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
// playa con galeras varadas (el mar al fondo, arena adelante)
export const Playa: React.FC<{ t: number; noche?: number; fogatas?: boolean }> = ({ t, noche = 0, fogatas }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    <path d={`M 0 760 Q 480 720 960 750 Q 1440 780 1920 740 L 1920 1080 L 0 1080 Z`} fill={noche ? "#6a5a7a" : "#f2d49a"} />
    <path d={`M 0 790 Q 480 760 960 785 Q 1440 810 1920 775 L 1920 1080 L 0 1080 Z`} fill={noche ? "#5a4a6a" : "#e8c07a"} />
    {fogatas && [300, 820, 1400].map((x, i) => (
      <g key={i} transform={`translate(${x} 900)`}>
        <ellipse cx={0} cy={0} rx={160} ry={40} fill="#ffb347" opacity={0.25 + 0.08 * Math.sin(t * 9 + i)} />
        <path d={`M -30 0 Q -20 ${-60 - Math.sin(t * 11 + i) * 14} 0 ${-90 - Math.sin(t * 7 + i) * 18} Q 20 -60 30 0 Z`} fill="#ff7a3d" />
        <path d={`M -14 0 Q -8 -40 0 ${-56 - Math.sin(t * 13) * 10} Q 8 -40 14 0 Z`} fill="#ffe08a" />
        <rect x={-40} y={-4} width={80} height={12} rx={6} fill="#5a3418" transform="rotate(12)" />
      </g>
    ))}
  </svg>
);
// puerto de Miseno: muelle de piedra, faro y galeras alineadas
export const Puerto: React.FC<{ t: number }> = ({ t }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    <path d="M 0 520 Q 300 380 620 470 Q 760 520 900 500 L 900 640 L 0 640 Z" fill="#7a6a9a" opacity={0.7} />
    <path d="M 1100 470 Q 1400 360 1920 430 L 1920 640 L 1100 640 Z" fill="#6a5a8a" opacity={0.7} />
    <g transform="translate(1600 470)">
      <rect x={-40} y={-200} width={80} height={200} fill="#e8dcc4" />
      <rect x={-56} y={-230} width={112} height={40} fill="#c9b8a0" />
      <circle cx={0} cy={-260} r={30 + 6 * Math.sin(t * 4)} fill="#ffe08a" opacity={0.85} />
    </g>
    <rect x={0} y={640} width={1920} height={50} fill="#c9b8a0" />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 140} y={640} width={130} height={46} fill={i % 2 ? "#b5a48a" : "#d8c8ae"} />)}
  </svg>
);
export const Pancarta: React.FC<{ t: number; t0: number; n: number; titulo: string; x?: number; y?: number }> = ({ t, t0, n, titulo, x = 960, y = 470 }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 10, stiffness: 160 });
  const e2 = ent(t, t0 + 0.25, 0, { damping: 9, stiffness: 190 });
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y - 150, transform: `translate(-50%,-50%) scale(${e}) rotate(${(1 - e) * -10}deg)`, fontFamily, fontWeight: 700, fontSize: 70, color: "#fff", background: C.rojo, padding: "6px 34px", borderRadius: 18, boxShadow: "0 10px 0 rgba(20,10,50,.35)", whiteSpace: "nowrap" }}>TRAP #{n}</div>
      <div style={{ position: "absolute", left: x, top: y + 10, transform: `translate(-50%,-50%) scale(${e2})`, fontFamily, fontWeight: 700, fontSize: 190, color: C.crema, WebkitTextStroke: `16px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 14px 0 ${C.noche}` }}>{titulo}</div>
    </>
  );
};

// ── soot02: piezas del gancho y separadores
export const Relampago: React.FC<{ t: number; ts: number[]; x?: number }> = ({ t, ts, x = 1300 }) => {
  const g = ts.find((a) => t >= a && t < a + 0.45);
  if (g === undefined) return null;
  const u = t - g;
  const r = rnd(Math.round(g * 100));
  const xx = x + (r() - 0.5) * 700;
  const pts = [[xx, -20]];
  for (let i = 1; i < 9; i++) pts.push([pts[i - 1][0] + (r() - 0.5) * 140, i * 80]);
  return (
    <>
      {u < 0.07 && <AbsoluteFill style={{ background: "#eef4ff", opacity: 0.22, pointerEvents: "none" }} />}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
        <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={14} strokeLinejoin="round" opacity={Math.max(0, 1 - u * 2.6)} />
        <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#bcd8ff" strokeWidth={34} strokeLinejoin="round" opacity={Math.max(0, 0.4 - u)} />
      </svg>
    </>
  );
};
const BarquitoIcono: React.FC<{ c: string }> = ({ c }) => (
  <g><path d="M -26 0 L 26 0 L 18 12 L -18 12 Z" fill={c} /><rect x={-2} y={-24} width={4} height={24} fill={c} /><path d="M -14 -22 L 14 -22 L 12 -4 L -12 -4 Z" fill={c} opacity={0.7} /><path d="M 26 4 L 34 7 L 26 10 Z" fill={c} /></g>
);
const clampN = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// flota de N barquitos en grilla; `hunde` cuántos se dan vuelta entre tA[0] y tA[1]
export const Flota: React.FC<{ t: number; t0: number; n: number; hunde: number; tA: [number, number]; x?: number; y?: number; cols?: number; s?: number }> = ({ t, t0, n, hunde, tA, x = 960, y = 560, cols = 28, s = 1 }) => {
  const orden = React.useMemo(() => { const r = rnd(7); return Array.from({ length: n }, (_, i) => i).sort(() => r() - 0.5); }, [n]);
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 14, stiffness: 150 });
  const rows = Math.ceil(n / cols);
  return (
    <svg style={{ position: "absolute", left: x - (cols * 62 * s) / 2, top: y - (rows * 46 * s) / 2, overflow: "visible", transform: `scale(${e})` }} width={cols * 62 * s} height={rows * 46 * s}>
      {Array.from({ length: n }, (_, i) => {
        const k = orden.indexOf(i);
        const td = tA[0] + ((k + 0.5) / Math.max(1, hunde)) * (tA[1] - tA[0]);
        const u = k < hunde ? clampN((t - td) / 0.25, 0, 1) : 0;
        const cx = (i % cols) * 62 * s + 31 * s, cy = Math.floor(i / cols) * 46 * s + 30 * s;
        return <g key={i} transform={`translate(${cx} ${cy + u * 8 * s}) scale(${s}) rotate(${u * 160})`} opacity={1 - u * 0.55}><BarquitoIcono c={u > 0.5 ? "#6a6f92" : "#ffd27a"} /></g>;
      })}
    </svg>
  );
};
export const Burbujas: React.FC<{ t: number; n?: number; seed?: number; x?: number; ancho?: number }> = ({ t, n = 30, seed = 5, x = 960, ancho = 1900 }) => {
  const r = rnd(seed);
  const b = Array.from({ length: n }, () => ({ x: x - ancho / 2 + r() * ancho, f: r(), v: 0.4 + r() * 0.8, s: 4 + r() * 14 }));
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {b.map((q, i) => { const k = (t * 0.35 * q.v + q.f) % 1; return <circle key={i} cx={q.x + Math.sin(t * 3 + i) * 12} cy={1100 - k * 1200} r={q.s} fill="none" stroke="#dff4ff" strokeWidth={3} opacity={0.75} />; })}
    </svg>
  );
};
export const Submarino: React.FC<{ t: number }> = ({ t }) => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a8fd0 0%, #1a5c9c 35%, #0f3466 75%, #081a3a 100%)" }} />
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {Array.from({ length: 7 }, (_, i) => <polygon key={i} points={`${200 + i * 260 + Math.sin(t + i) * 30},0 ${290 + i * 260 + Math.sin(t + i) * 30},0 ${420 + i * 260},1080 ${240 + i * 260},1080`} fill="#bfe8ff" opacity={0.07} />)}
      <path d={`M 0 40 ${Array.from({ length: 50 }, (_, i) => `L ${i * 40} ${40 + Math.sin(i * 0.5 + t * 3) * 10}`).join(" ")} L 1960 0 L 0 0 Z`} fill="#8fd0f2" opacity={0.6} />
    </svg>
  </>
);
// íconos de las 7 trampas (para el mapa del viaje y los separadores)
export const IconoTrampa: React.FC<{ n: number; s?: number }> = ({ n, s = 1 }) => {
  const ic: Record<number, React.ReactNode> = {
    1: <g><rect x={-40} y={-50} width={80} height={100} rx={8} fill="#f6e3b4" /><rect x={-48} y={-58} width={96} height={18} rx={9} fill="#c98f4a" /><rect x={-48} y={42} width={96} height={18} rx={9} fill="#c98f4a" />{[-22, -4, 14].map((y) => <rect key={y} x={-26} y={y} width={52} height={7} rx={3} fill="#c79a5a" />)}</g>,
    2: <g><rect x={-56} y={-10} width={112} height={22} rx={6} fill="#a8622c" /><rect x={-48} y={12} width={12} height={40} fill="#6b3a1f" /><rect x={36} y={12} width={12} height={40} fill="#6b3a1f" /><line x1={-30} y1={-50} x2={50} y2={20} stroke="#d8a868" strokeWidth={12} strokeLinecap="round" /></g>,
    3: <g transform="rotate(-30)"><rect x={-7} y={-10} width={14} height={70} fill="#6b3a1f" /><rect x={-30} y={-46} width={60} height={40} rx={8} fill="#8a5a2a" /></g>,
    4: <g><path d="M -56 -26 L 24 -20 L 56 0 L 24 20 L -56 26 Z" fill="#d9962e" stroke="#6a3a0a" strokeWidth={5} /></g>,
    5: <g><rect x={-8} y={-56} width={14} height={110} fill="#6b3a1f" /><g transform="rotate(-30 0 -40)"><rect x={0} y={-50} width={70} height={16} fill="#c49058" /><path d="M 64 -34 L 72 -34 L 68 -10 Z" fill="#8a93a3" /></g></g>,
    6: <g><ellipse cx={0} cy={-14} rx={52} ry={30} fill="#6a6f92" /><circle cx={-24} cy={-30} r={24} fill="#6a6f92" /><circle cx={18} cy={-36} r={28} fill="#6a6f92" /><path d="M 4 4 L -12 30 L 4 28 L -6 56 L 22 20 L 8 22 L 18 4 Z" fill={C.ambar} /></g>,
    7: <g><rect x={-46} y={-40} width={44} height={74} rx={6} fill="#d08a3a" stroke="#6a3a10" strokeWidth={4} /><rect x={2} y={-40} width={44} height={74} rx={6} fill="#e9a94a" stroke="#6a3a10" strokeWidth={4} /><path d="M -2 -16 Q 0 -22 2 -16 M -2 16 Q 0 22 2 16" stroke="#c8ccd4" strokeWidth={4} /></g>,
  };
  return <g transform={`scale(${s})`}>{ic[n]}</g>;
};
// contador con separador de miles
export const CuentaN: React.FC<{ t: number; t0: number; t1: number; de?: number; a: number; x: number; y: number; size?: number; color?: string; pre?: string; suf?: string; borde?: string }> = ({ t, t0, t1, de = 0, a, x, y, size = 150, color = "#fff", pre = "", suf = "", borde = "#2a1530" }) => {
  if (t < t0) return null;
  const v = Math.round(de + (a - de) * prog(t, t0, t1));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${ent(t, t0)})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.08}px ${borde}`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 ${size * 0.06}px 0 ${borde}` }}>{pre}{v.toLocaleString("en-US")}{suf}</div>;
};
// flecha dibujada que señala algo
export const Flecha: React.FC<{ t: number; t0: number; x1: number; y1: number; x2: number; y2: number; color?: string; grosor?: number }> = ({ t, t0, x1, y1, x2, y2, color = "#fff", grosor = 12 }) => {
  if (t < t0) return null;
  const k = prog(t, t0, t0 + 0.3);
  const ex = x1 + (x2 - x1) * k, ey = y1 + (y2 - y1) * k;
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }} width={1920} height={1080}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={TINTA} strokeWidth={grosor + 10} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={grosor} strokeLinecap="round" />
      {k > 0.9 && <path d={`M ${ex} ${ey} L ${ex - Math.cos(a - 0.5) * 50} ${ey - Math.sin(a - 0.5) * 50} L ${ex - Math.cos(a + 0.5) * 50} ${ey - Math.sin(a + 0.5) * 50} Z`} fill={color} stroke={TINTA} strokeWidth={6} />}
    </svg>
  );
};
// agua delantera local (para que un barco "se siente" en el mar del mundo)
export const AguaFrente: React.FC<{ t: number; y: number; ola?: number; color?: string; noche?: number }> = ({ t, y, ola = 0.25, color = "#1f5c9c", noche = 0 }) => <Olas t={t} y0={y + 150} ola={ola} capas={1} colores={[color]} noche={noche} />;
