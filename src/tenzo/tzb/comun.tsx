// Piezas de tz-b (tz03, tz04): tramos en SEGUNDOS de la voz → planos, el alba en la ventana del Cuarto, el cuarto que
// se entibia con el farol, rayitas de preso, la pantalla del celular en macro, jinete sobre el caballo y nube de polvo.
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { useF } from "../../anikit/camara";
import { Actor } from "../../anikit/actor";
import { Halo } from "../../anikit/luz";
import { PlanoM, Trans } from "../../anikit/montaje";
import { Look, LuzP, Pose } from "../../anikit/personaje";
import { ACENTO, ORO } from "../elenco";
import { Caballo, CABALLO_LOMO } from "../sets/caballo";

// ---------- tramos (mismo criterio que tz-c: contiguos, redondeo a cuadros sin acumular error) ----------
export type TramoS = { t0: number; t1: number; el: React.ReactNode; trans?: Trans };
export const planosDe = (tramos: TramoS[], fps = 30): PlanoM[] =>
  tramos.map((t, i) => {
    if (i > 0 && Math.abs(tramos[i - 1].t1 - t.t0) > 0.001) throw new Error(`tramo ${i} no es contiguo: ${tramos[i - 1].t1} → ${t.t0}`);
    const a = Math.round(t.t0 * fps), b = Math.round(t.t1 * fps);
    return { dur: b - a, el: t.el, trans: t.trans };
  });
// segundos absolutos → cuadro dentro del plano que arranca en t0
export const fr = (t: number, t0: number) => Math.round((t - t0) * 30);
export const ent = (f: number, a: number, b: number, curva = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curva });

// ---------- Cuarto de Leo ----------
// la ventana del Cuarto (x 2560-3000, vidrio visible y 280-620) pasa de noche a gris de amanecer: t 0..1
export const Alba: React.FC<{ t: number }> = ({ t }) => (
  <g opacity={t}>
    <defs>
      <linearGradient id="tzbAlba" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8d96a3" /><stop offset="0.7" stopColor="#b9bcc0" /><stop offset="1" stopColor="#d6cfc4" />
      </linearGradient>
    </defs>
    <rect x={2560} y={280} width={440} height={340} fill="url(#tzbAlba)" opacity={0.82} />
    <rect x={2774} y={280} width={12} height={340} fill="#3a3f48" />
    <path d="M2560,620 L3000,620 L2700,900 L2040,900 Z" fill="#b9bcc0" opacity={0.08} />
  </g>
);

// el cuarto se entibia con el farol (k 0..1): un velo ámbar sobre todo + halo grande desde el farol
export const Tibio: React.FC<{ k: number; x: number; y: number }> = ({ k, x, y }) =>
  k <= 0.001 ? null : (
    <g style={{ mixBlendMode: "screen" }}>
      <rect x={-900} y={-700} width={5200} height={2000} fill={ORO} opacity={0.07 * k} />
      <Halo x={x} y={y} r={1500} color={ORO} fuerza={0.5 * k} />
    </g>
  );

// rendija de luz bajo la puerta cerrada (el que golpea trae el farol)
export const Rendija: React.FC<{ x: number; piso: number; k: number }> = ({ x, piso, k }) =>
  k <= 0 ? null : (
    <g opacity={k}>
      <rect x={x - 118} y={piso - 5} width={236} height={5} fill={ORO} />
      <path d={`M${x - 118},${piso} L${x + 118},${piso} L${x + 260},${piso + 70} L${x - 40},${piso + 70} Z`} fill={ORO} opacity={0.25} />
      <Halo x={x} y={piso} r={260} color={ORO} fuerza={0.3} />
    </g>
  );

// rayitas de preso (de a 5 con la cruzada). n puede ser fraccionario: la última se está dibujando
export const Rayitas: React.FC<{ n: number; x: number; y: number; color?: string; alto?: number; paso?: number; porFila?: number }> = ({ n, x, y, color = "#2a2622", alto = 46, paso = 14, porFila = 25 }) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < Math.ceil(n); i++) {
    const u = Math.min(1, n - i);
    const fila = Math.floor(i / porFila), k = i % porFila, grupo = Math.floor(k / 5), j = k % 5;
    const gx = x + grupo * (paso * 5 + 10), gy = y + fila * (alto + 24);
    const w = random(`ry${i}`) * 4 - 2;
    if (j < 4) out.push(<path key={i} d={`M${gx + j * paso + w},${gy} L${gx + j * paso - w},${gy + alto * u}`} stroke={color} strokeWidth={4} strokeLinecap="round" />);
    else out.push(<path key={i} d={`M${gx - 6},${gy + alto * 0.8} L${gx - 6 + (paso * 3 + 12) * u},${gy + alto * 0.8 - (alto * 0.6) * u}`} stroke={color} strokeWidth={4} strokeLinecap="round" />);
  }
  return <g>{out}</g>;
};

// hoja de papel sobre el escritorio (vista cenital) con las rayitas
export const Hoja: React.FC<{ x: number; y: number; w?: number; h?: number; rot?: number; children?: React.ReactNode }> = ({ x, y, w = 760, h = 520, rot = -2, children }) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    <rect x={x - w / 2 + 10} y={y - h / 2 + 14} width={w} height={h} fill="#000" opacity={0.25} />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#ece7db" />
    {Array.from({ length: Math.floor(h / 44) }).map((_, i) => <rect key={i} x={x - w / 2} y={y - h / 2 + 40 + i * 44} width={w} height={2} fill="#bfc8d6" opacity={0.6} />)}
    {children}
  </g>
);

// ---------- pantalla del celular en macro (HUD, coordenadas de pantalla) ----------
type Tarjeta = "baile" | "grito" | "perro" | "choque" | "chica" | "video";
const Contenido: React.FC<{ t: Tarjeta; f: number; w: number; h: number }> = ({ t, f, w, h }) => {
  const cx = w / 2, cy = h / 2;
  const fondo = { baile: "#3a2a4a", grito: "#2a3440", perro: "#3a3a2a", choque: "#402a26", chica: "#2a3a3a", video: "#30303a" }[t];
  const s = (k: number) => Math.sin(f / 4 + k);
  return (
    <g>
      <rect width={w} height={h} fill={fondo} />
      <Halo x={cx} y={cy} r={w} color={ACENTO} fuerza={0.18} />
      {t === "baile" && (
        <g transform={`translate(${cx},${cy + 60}) rotate(${s(0) * 8})`} fill="#e9e3d6">
          <circle cx={0} cy={-210} r={46} /><rect x={-34} y={-160} width={68} height={170} rx={30} />
          <path d={`M-30,-140 L${-110},${-230 + s(1) * 40}`} stroke="#e9e3d6" strokeWidth={24} strokeLinecap="round" />
          <path d={`M30,-140 L${110},${-230 - s(1) * 40}`} stroke="#e9e3d6" strokeWidth={24} strokeLinecap="round" />
          <path d={`M-18,0 L${-60 + s(2) * 20},150 M18,0 L${60 - s(2) * 20},150`} stroke="#e9e3d6" strokeWidth={26} strokeLinecap="round" />
        </g>
      )}
      {t === "grito" && (
        <g transform={`translate(${cx},${cy})`}>
          <circle cx={0} cy={-20} r={120} fill="#e9e3d6" />
          <ellipse cx={0} cy={30} rx={50} ry={34 + s(0) * 10} fill="#2a1a1a" />
          <path d="M-60,-70 L-20,-55 M60,-70 L20,-55" stroke="#2a1a1a" strokeWidth={10} strokeLinecap="round" />
          {[-1, 1].map((k) => <text key={k} x={k * 190} y={-60 + s(k) * 20} fontSize={110} fontWeight={800} fill={ACENTO} textAnchor="middle" fontFamily="sans-serif">$</text>)}
          <rect x={-120} y={150} width={240} height={140} rx={30} fill="#e9e3d6" />
        </g>
      )}
      {t === "perro" && (
        <g transform={`translate(${cx},${cy + 40})`} fill="#d8b98a">
          <ellipse cx={0} cy={0} rx={150} ry={80} /><circle cx={150} cy={-80} r={70} />
          <path d="M120,-140 L110,-200 L160,-150 Z M190,-140 L215,-195 L215,-130 Z" />
          <rect x={-120} y={40} width={30} height={110} rx={12} /><rect x={80} y={40} width={30} height={110} rx={12} />
          <path d={`M-150,-20 Q-230,${-90 + s(0) * 50} -250,${-60 + s(0) * 60}`} stroke="#d8b98a" strokeWidth={22} fill="none" strokeLinecap="round" />
          <circle cx={170} cy={-90} r={10} fill="#2a1a1a" />
        </g>
      )}
      {t === "choque" && (
        <g transform={`translate(${cx},${cy + 60})`}>
          <rect x={-260 + Math.min(0, s(0) * 10)} y={-60} width={220} height={100} rx={20} fill="#c9cdd4" />
          <rect x={40} y={-60} width={220} height={100} rx={20} fill={ACENTO} transform="rotate(-12 40 -10)" />
          <path d="M0,-150 L30,-60 L110,-90 L50,-20 L120,40 L20,20 L0,110 L-20,20 L-120,40 L-50,-20 L-110,-90 L-30,-60 Z" fill="#ffe2a8" opacity={0.85 + s(1) * 0.15} />
        </g>
      )}
      {t === "chica" && (
        <g transform={`translate(${cx},${cy + 40})`}>
          <path d="M-110,-150 Q0,-330 110,-150 L130,60 L-130,60 Z" fill="#3a2418" />
          <circle cx={0} cy={-160} r={92} fill="#e9d2b8" />
          <path d="M-40,-150 q10,-10 20,0 M20,-150 q10,-10 20,0" stroke="#2a1a1a" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M-30,-110 Q0,-90 30,-110" stroke="#c0503a" strokeWidth={10} fill="none" strokeLinecap="round" />
          <rect x={-120} y={-60} width={240} height={260} rx={60} fill={ACENTO} />
        </g>
      )}
      {t === "video" && (
        <g transform={`translate(${cx},${cy})`}>
          <rect x={-200} y={-140} width={400} height={280} rx={30} fill="#4a4a56" />
          <path d="M-40,-60 L70,0 L-40,60 Z" fill="#e9e3d6" />
        </g>
      )}
      {/* íconos al costado (corazón, comentario, compartir) y barra de progreso */}
      {[0, 1, 2].map((k) => <circle key={k} cx={w - 60} cy={h * 0.55 + k * 110} r={30} fill="#e9e3d6" opacity={0.75} />)}
      <rect x={0} y={h - 10} width={w * ((f % 60) / 60)} height={10} fill={ACENTO} />
    </g>
  );
};

// macro del celular: las tarjetas suben cada `periodo` cuadros con un pulgar que barre; `congela` = cuadro en que el
// pulgar queda en el aire y todo se detiene. Coordenadas de pantalla (1920x1080).
export const PantallaMacro: React.FC<{ secuencia: Tarjeta[]; periodo?: number; congela?: number; desde?: number; x?: number; y?: number; s?: number; rot?: number }> = ({ secuencia, periodo = 24, congela, desde = 0, x = 960, y = 560, s = 1, rot = -6 }) => {
  const f0 = useF();
  const f = Math.max(0, (congela !== undefined ? Math.min(f0, congela) : f0) - desde);
  const W = 560, H = 1000;
  const i = Math.floor(f / periodo), u = (f % periodo) / periodo;
  const sw = interpolate(u, [0, 0.28], [1, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }); // la nueva entra de abajo
  const pul = interpolate(u, [0, 0.25, 0.55, 1], [0, 1, 0.15, 0], { extrapolateRight: "clamp" });
  const congelado = congela !== undefined && f0 >= congela;
  const respira = congelado ? Math.sin((f0 - congela!) / 12) * 4 : 0;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
        <Halo x={0} y={0} r={900} color={ACENTO} fuerza={0.35} />
        <rect x={-W / 2 - 26} y={-H / 2 - 26} width={W + 52} height={H + 52} rx={70} fill="#121216" stroke="#2e2e36" strokeWidth={6} />
        <clipPath id="tzbPant"><rect x={-W / 2} y={-H / 2} width={W} height={H} rx={46} /></clipPath>
        <g clipPath="url(#tzbPant)">
          <g transform={`translate(${-W / 2},${-H / 2 - H * (1 - sw)})`}><Contenido t={secuencia[Math.max(0, i - 1) % secuencia.length]} f={f} w={W} h={H} /></g>
          <g transform={`translate(${-W / 2},${-H / 2 + H * sw})`}><Contenido t={secuencia[i % secuencia.length]} f={f} w={W} h={H} /></g>
        </g>
        {/* el pulgar (piel, uña) barre de abajo hacia arriba */}
        <g transform={`translate(${150},${H / 2 - 40 - 330 * pul + respira}) rotate(-28)`}>
          <ellipse cx={0} cy={0} rx={78} ry={150} fill="#d9a882" />
          <ellipse cx={0} cy={-90} rx={46} ry={52} fill="#efc8a8" />
          <rect x={-90} y={60} width={180} height={400} rx={80} fill="#d9a882" />
        </g>
      </g>
    </svg>
  );
};

// ---------- caballo con jinete ----------
// Jinete sentado en el lomo: sigue el rebote del caballo. x = centro del caballo; s = escala del caballo.
export const POSE_JINETE: Partial<Pose> = { tronco: 18, pI: 80, rI: 70, pD: 80, rD: 70, hD: 70, cD: 30, hI: 70, cI: 30 };
export const Montado: React.FC<{ x: number; piso: number; fase: number; dir?: 1 | -1; s?: number; variante?: "normal" | "mara"; look: Look; cara: string; escala: number; pose?: Partial<Pose>; luz?: LuzP; seed?: number; giro?: number; enManoD?: React.ReactNode; quieto?: boolean }> = ({ x, piso, fase, dir = 1, s = 1, variante = "normal", look, cara, escala, pose = POSE_JINETE, luz, seed = 2, giro = 0, enManoD, quieto }) => {
  const sube = quieto ? 0 : 14 * Math.abs(Math.sin(fase * Math.PI * 2)) * s;
  const y = piso - (CABALLO_LOMO - 16) * s - sube;
  return (
    <>
      <Caballo x={x} piso={piso} fase={fase} dir={dir} s={s} variante={variante} quieto={quieto} />
      <Actor look={look} escala={escala} seed={seed} luz={luz} ruta={[{ f: 0, x: x - 10 * dir * s, y }]} dir={[{ f: 0, v: dir }]} asiento={[{ f: 0, v: 0 }]} poses={[{ f: 0, v: pose }]} caras={[{ f: 0, v: cara }]} giros={[{ f: 0, v: giro }]} enManoD={enManoD} />
    </>
  );
};

// nube de polvo que levantan los cascos (mundo): x, piso, k 0..1 cuánto creció
export const NubePolvo: React.FC<{ x: number; piso: number; k: number; f: number; color?: string; ancho?: number }> = ({ x, piso, k, f, color = "#e8c48e", ancho = 520 }) => (
  <g opacity={Math.min(1, k * 1.4)}>
    {Array.from({ length: 16 }).map((_, i) => {
      const r = (50 + random(`np${i}`) * 90) * (0.4 + k);
      const cx = x + (random(`nx${i}`) - 0.5) * ancho * (0.5 + k) + Math.sin(f / 20 + i) * 10;
      const cy = piso - r * 0.6 - random(`ny${i}`) * 120 * k;
      return <circle key={i} cx={cx} cy={cy} r={r} fill={color} opacity={0.55} />;
    })}
  </g>
);
