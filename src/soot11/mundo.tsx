import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { rnd, clamp } from "../soot/lib";
import { C, fontFamily } from "./kit";

// Mundo continuo de soot11: un solo pueblo (Núremberg) en coordenadas de mundo; la cámara VIAJA por él
// (paneo, dolly, zoom a un detalle). Nada corta: lo que cambia es dónde mira la cámara y la hora del día.
// Unidades = px a zoom 1. Suelo de la calle en y = SUELO.
export const SUELO = 880;

// ── cámara: llaves [t, x, y, z, dur?, arco?]. La cámara LLEGA a (x,y,z) en t moviéndose durante `dur` s
// (por defecto 0,7). Entre llaves queda en deriva lenta (nunca congelada). `arco` = se aleja a mitad del viaje.
export type Llave = [number, number, number, number, number?, number?];
export type Cam = { x: number; y: number; z: number };
const eio = Easing.inOut(Easing.cubic);
export const camEn = (keys: Llave[], t: number): Cam => {
  let i = 0;
  while (i + 1 < keys.length && t >= keys[i + 1][0] - (keys[i + 1][4] ?? 0.7)) i++;
  const k0 = keys[i];
  const drift = (tt: number, k: Llave) => 1 + Math.min(0.06, Math.max(0, tt - k[0]) * 0.006);
  if (i + 1 >= keys.length || t < keys[i + 1][0] - (keys[i + 1][4] ?? 0.7)) {
    return { x: k0[1], y: k0[2], z: k0[3] * drift(t, k0) };
  }
  const k1 = keys[i + 1];
  const d = k1[4] ?? 0.7;
  const u = eio(clamp((t - (k1[0] - d)) / d, 0, 1));
  const zA = k0[3] * drift(k1[0] - d, k0), zB = k1[3];
  let z = Math.exp(Math.log(zA) + (Math.log(zB) - Math.log(zA)) * u);
  if (k1[5]) z *= 1 - k1[5] * Math.sin(u * Math.PI);
  // al hacer zoom, el punto de interés se mueve en coordenadas de pantalla en forma lineal (no "derrapa")
  const w = zA === zB ? u : (1 / zA - 1 / z) / (1 / zA - 1 / zB || 1e-9);
  const uu = Math.abs(Math.log(zB / zA)) > 0.3 && !k1[5] ? clamp(w, 0, 1) : u;
  return { x: k0[1] + (k1[1] - k0[1]) * uu, y: k0[2] + (k1[2] - k0[2]) * uu, z };
};

// ── hora del día: llaves [t, h] con h 0 = día, 1 = atardecer, 2 = noche. Se interpola suave.
export const horaEn = (keys: [number, number][], t: number) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
    const [a, ha] = keys[i - 1], [b, hb] = keys[i];
    return ha + (hb - ha) * eio(clamp((t - a) / Math.max(0.01, b - a), 0, 1));
  }
  return keys[keys.length - 1][1];
};
const mezcla = (a: string, b: string, u: number) => {
  const p = (s: string) => [1, 3, 5].map((k) => parseInt(s.slice(k, k + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join("");
};
const CIELO: string[][] = [
  ["#4fb3e8", "#7cc7ee", "#b0e0f2", "#e2f4f4", "#fff3d6"],
  ["#2d1b69", "#7a2f8f", "#e2557a", "#ff9a4d", "#ffd27a"],
  ["#0b0826", "#161038", "#251a5c", "#3a2a80", "#5a44a8"],
];
export const cieloEn = (h: number) => {
  const a = Math.floor(clamp(h, 0, 1.999)), u = clamp(h - a, 0, 1);
  return CIELO[a].map((c, i) => mezcla(c, CIELO[a + 1][i], u));
};

export type Ctx = { t: number; cam: Cam; hora: number };
export const MundoCtx = React.createContext<Ctx>({ t: 0, cam: { x: 960, y: 540, z: 1 }, hora: 0 });
export const useMundo = () => React.useContext(MundoCtx);
// ¿el tramo [x0, x1] del mundo está a la vista? (para no dibujar lo que la cámara no ve)
export const aLaVista = (cam: Cam, x0: number, x1: number, m = 200) => {
  const half = 960 / cam.z + m;
  return x1 >= cam.x - half && x0 <= cam.x + half;
};
export const Vis: React.FC<{ x0: number; x1: number; children: React.ReactNode }> = ({ x0, x1, children }) => {
  const { cam } = useMundo();
  return aLaVista(cam, x0, x1) ? <>{children}</> : null;
};

// El mundo: cielo (pantalla) + lejanía con paralaje + capa principal + tinte de noche + desenfoque de movimiento.
export const Mundo: React.FC<{ t: number; keys: Llave[]; horas: [number, number][]; children: React.ReactNode; lejos?: React.ReactNode; sepia?: boolean; sinCielo?: boolean }> = ({ t, keys, horas, children, lejos, sepia, sinCielo }) => {
  const cam = camEn(keys, t);
  const prev = camEn(keys, t - 1 / 30);
  const hora = horaEn(horas, t);
  const vel = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 900;
  const blur = clamp((vel - 25) / 22, 0, 7);
  const s = cieloEn(hora);
  const tr = `translate(${960 - cam.x * cam.z}px, ${540 - cam.y * cam.z}px) scale(${cam.z})`;
  const noche = clamp(hora - 1, 0, 1), tarde = clamp(1 - Math.abs(hora - 1), 0, 1);
  return (
    <MundoCtx.Provider value={{ t, cam, hora }}>
      <AbsoluteFill style={{ overflow: "hidden", filter: `${blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : ""} ${sepia ? "sepia(0.85) saturate(0.9)" : ""}`.trim() || undefined }}>
        {!sinCielo && <AbsoluteFill style={{ background: `linear-gradient(180deg, ${s[0]} 0%, ${s[1]} 28%, ${s[2]} 52%, ${s[3]} 76%, ${s[4]} 100%)` }} />}
        {!sinCielo && <CieloVivo t={t} cam={cam} hora={hora} />}
        {lejos && (
          <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - cam.x * 0.35 * Math.sqrt(cam.z)}px, ${540 - (cam.y - 540) * 0.3 - 540 * Math.sqrt(cam.z)}px) scale(${Math.sqrt(cam.z)})` }}>{lejos}</AbsoluteFill>
        )}
        <AbsoluteFill style={{ transformOrigin: "0 0", transform: tr }}>{children}</AbsoluteFill>
        {noche > 0.01 && <AbsoluteFill style={{ background: "#2a2470", mixBlendMode: "multiply", opacity: noche * 0.55, pointerEvents: "none" }} />}
        {tarde > 0.01 && <AbsoluteFill style={{ background: "#ff8a4d", mixBlendMode: "soft-light", opacity: tarde * 0.35, pointerEvents: "none" }} />}
      </AbsoluteFill>
      {blur > 2 && <Rafaga t={t} dx={cam.x - prev.x} op={clamp((blur - 2) / 4, 0, 0.8)} />}
    </MundoCtx.Provider>
  );
};

// sol / luna / estrellas / nubes según la hora (en pantalla, con un paralaje mínimo)
const CieloVivo: React.FC<{ t: number; cam: Cam; hora: number }> = ({ t, cam, hora }) => {
  const r = rnd(77);
  const nubes = Array.from({ length: 7 }, () => ({ x: r() * 2600, y: 80 + r() * 300, s: 0.6 + r() * 0.9 }));
  const noche = clamp(hora - 1.2, 0, 0.8) / 0.8;
  const solY = 160 + clamp(hora, 0, 1.3) * 520;
  const off = -cam.x * 0.04;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {noche > 0 && Array.from({ length: 90 }, (_, i) => {
        const rr = rnd(i * 13 + 2); const x = rr() * 1920, y = rr() * 620, s = 1 + rr() * 2.4, f = rr() * 6;
        return <circle key={i} cx={x} cy={y} r={s} fill="#fff" opacity={noche * (0.4 + 0.5 * Math.sin(t * 2 + f))} />;
      })}
      {hora < 1.4 && (
        <g opacity={1 - clamp((hora - 1) / 0.4, 0, 1)}>
          <circle cx={1500 + off * 0.5} cy={solY} r={230} fill="#fff4c0" opacity={0.25} />
          <circle cx={1500 + off * 0.5} cy={solY} r={95} fill={hora > 0.6 ? "#ffd27a" : "#fff6cf"} />
        </g>
      )}
      {noche > 0 && (
        <g opacity={noche}>
          <circle cx={420 + off * 0.5} cy={190} r={240} fill="#fff6d8" opacity={0.1} />
          <circle cx={420 + off * 0.5} cy={190} r={80} fill="#fff6d8" />
          <circle cx={444 + off * 0.5} cy={176} r={70} fill={cieloEn(hora)[0]} />
        </g>
      )}
      {nubes.map((n, i) => {
        const x = ((n.x + t * 14 * n.s + off * n.s) % 2600 + 2600) % 2600 - 340;
        return (
          <g key={i} transform={`translate(${x} ${n.y}) scale(${n.s})`} opacity={0.85 - noche * 0.6}>
            <ellipse cx={0} cy={0} rx={130} ry={44} fill={hora > 1.3 ? "#3a2f74" : hora > 0.5 ? "#ffc9a8" : "#ffffff"} />
            <ellipse cx={-60} cy={-22} rx={70} ry={50} fill={hora > 1.3 ? "#3a2f74" : hora > 0.5 ? "#ffc9a8" : "#ffffff"} />
            <ellipse cx={50} cy={-30} rx={80} ry={58} fill={hora > 1.3 ? "#3a2f74" : hora > 0.5 ? "#ffd8bf" : "#ffffff"} />
          </g>
        );
      })}
    </svg>
  );
};
// líneas de velocidad cuando la cámara barre rápido
const Rafaga: React.FC<{ t: number; dx: number; op: number }> = ({ t, dx, op }) => {
  const r = rnd(Math.floor(t * 30));
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: 22 }, (_, i) => {
        const y = r() * 1080, x = r() * 1920, w = 200 + r() * 700;
        return <rect key={i} x={dx > 0 ? x - w : x} y={y} width={w} height={2 + r() * 5} rx={3} fill="#fff" opacity={op * (0.3 + r() * 0.5)} />;
      })}
    </svg>
  );
};

// ── lejanía: colinas, torres y la muralla del castillo de Núremberg (paralaje lento)
export const Lejania: React.FC<{ hora: number }> = ({ hora }) => {
  const k = clamp(hora / 2, 0, 1);
  const c1 = mezcla("#8fb6d8", "#2a2160", k), c2 = mezcla("#6f9a7a", "#1f1a4a", k), c3 = mezcla("#b98c6a", "#2a2050", k);
  const r = rnd(5);
  const torres = Array.from({ length: 26 }, (_, i) => ({ x: -1200 + i * 520 + r() * 200, h: 140 + r() * 220, w: 50 + r() * 50 }));
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
      <path d={`M -3000 760 ${Array.from({ length: 60 }, (_, i) => `L ${-3000 + i * 320} ${700 - Math.sin(i * 0.9) * 70 - Math.cos(i * 0.37) * 50}`).join(" ")} L 16000 1400 L -3000 1400 Z`} fill={c1} />
      {torres.map((o, i) => (
        <g key={i} fill={c3}>
          <rect x={o.x} y={760 - o.h} width={o.w} height={o.h + 80} />
          <path d={`M ${o.x - 12} ${760 - o.h} L ${o.x + o.w / 2} ${760 - o.h - o.w * 1.4} L ${o.x + o.w + 12} ${760 - o.h} Z`} fill={mezcla("#c25a3a", "#3a2050", k)} />
        </g>
      ))}
      {/* el castillo (Kaiserburg) arriba de la colina */}
      <g transform="translate(2400 0)" fill={c3}>
        <path d="M -500 760 Q -200 520 300 540 Q 700 560 900 760 Z" fill={c2} />
        <rect x={-120} y={360} width={110} height={220} />
        <rect x={20} y={430} width={420} height={150} />
        <path d="M -136 360 L -65 250 L 6 360 Z" fill={mezcla("#c25a3a", "#3a2050", k)} />
        {[40, 120, 200, 280, 360].map((x) => <rect key={x} x={x} y={410} width={40} height={24} />)}
      </g>
      <path d={`M -3000 820 ${Array.from({ length: 60 }, (_, i) => `L ${-3000 + i * 320} ${790 - Math.sin(i * 1.3 + 2) * 40}`).join(" ")} L 16000 1400 L -3000 1400 Z`} fill={c2} />
    </svg>
  );
};

// ── piso: calle de adoquines continua (dibuja sólo lo visible); el río corta en [rio0, rio1]
export const Calle: React.FC<{ x0: number; x1: number; rio?: [number, number] }> = ({ x0, x1, rio }) => {
  const { cam, hora } = useMundo();
  const half = 960 / cam.z + 300;
  const a = Math.max(x0, cam.x - half), b = Math.min(x1, cam.x + half);
  if (b <= a) return null;
  const k = clamp(hora / 2, 0, 1);
  const base = mezcla("#b8875a", "#4a3a5a", k), piedra = mezcla("#d6a878", "#5e4c70", k), junta = mezcla("#8a5e3a", "#33284a", k);
  const n0 = Math.floor(a / 90), n1 = Math.ceil(b / 90);
  const piedras: React.ReactNode[] = [];
  for (let n = n0; n <= n1; n++) {
    for (let f = 0; f < 4; f++) {
      const x = n * 90 + (f % 2) * 45, y = SUELO + 20 + f * 48 + f * f * 10;
      if (rio && x > rio[0] - 40 && x < rio[1]) continue;
      const rr = rnd(n * 7 + f * 131 + 9000);
      piedras.push(<rect key={`${n}_${f}`} x={x + 4} y={y} width={78 + f * 6} height={34 + f * 8} rx={14} fill={piedra} opacity={0.55 + rr() * 0.35} />);
    }
  }
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <rect x={a - 10} y={SUELO} width={b - a + 20} height={900} fill={base} />
      <rect x={a - 10} y={SUELO} width={b - a + 20} height={14} fill={junta} />
      {piedras}
    </svg>
  );
};

// ── casa de entramado (Fachwerk) de Núremberg. `abierta` = corte de casa de muñecas (sin pared del frente):
// se ve el interior (pared del fondo, vigas, piso). `x` = borde izquierdo, apoyada en el SUELO.
export const Fachwerk: React.FC<{ x: number; w: number; h: number; muro?: string; viga?: string; techo?: string; abierta?: boolean; fondo?: string; pisos?: number; cartel?: string; luz?: number; puerta?: boolean; y?: number }> = ({ x, w, h, muro = "#f3dcb0", viga = "#6b3a1f", techo = "#c2452e", abierta, fondo = "#e8c58f", pisos = 2, cartel, luz = 0, puerta = true, y = SUELO }) => {
  const { hora } = useMundo();
  const top = y - h;
  const th = w * 0.55;
  const ventana = mezcla("#5a3418", "#ffd27a", clamp(Math.max(luz, (hora - 1.2) * 1.4), 0, 1));
  const ph = h / pisos;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {/* techo */}
      <path d={`M ${x - 30} ${top + 6} L ${x + w / 2} ${top - th} L ${x + w + 30} ${top + 6} Z`} fill={techo} />
      <path d={`M ${x + w / 2} ${top - th} L ${x + w + 30} ${top + 6} L ${x + w / 2 + 40} ${top + 6} Z`} fill="rgba(40,10,20,.22)" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={x + w / 2 - (i + 1) * (w / 14)} y1={top - th + (i + 1) * (th / 7)} x2={x + w / 2 + (i + 1) * (w / 14)} y2={top - th + (i + 1) * (th / 7)} stroke="rgba(60,15,20,.25)" strokeWidth={6} />)}
      {/* buhardilla */}
      <rect x={x + w / 2 - 34} y={top - th * 0.55} width={68} height={60} rx={8} fill={ventana} stroke={viga} strokeWidth={8} />
      {abierta ? (
        <g>
          <rect x={x} y={top} width={w} height={h} fill={fondo} />
          {/* sombra interior arriba y vigas del techo interior */}
          <rect x={x} y={top} width={w} height={46} fill="rgba(60,25,15,.25)" />
          {Array.from({ length: Math.floor(w / 160) + 1 }, (_, i) => <rect key={i} x={x + 30 + i * 160} y={top} width={26} height={h} fill="rgba(107,58,31,.18)" />)}
          {pisos > 1 && <rect x={x} y={top + ph - 14} width={w} height={28} fill={viga} />}
          <rect x={x} y={y - 18} width={w} height={18} fill="#8a5a34" />
          {/* bordes de la fachada cortada */}
          <rect x={x - 18} y={top} width={36} height={h} fill={muro} stroke={viga} strokeWidth={8} />
          <rect x={x + w - 18} y={top} width={36} height={h} fill={muro} stroke={viga} strokeWidth={8} />
          <rect x={x - 26} y={top - 10} width={w + 52} height={26} fill={viga} />
        </g>
      ) : (
        <g>
          <rect x={x} y={top} width={w} height={h} fill={muro} />
          {/* entramado */}
          <rect x={x} y={top} width={w} height={h} fill="none" stroke={viga} strokeWidth={14} />
          {Array.from({ length: pisos }, (_, p) => {
            const yy = top + p * ph;
            const cols = Math.max(2, Math.round(w / 130));
            return (
              <g key={p} stroke={viga} strokeWidth={11}>
                <line x1={x} y1={yy + ph} x2={x + w} y2={yy + ph} />
                {Array.from({ length: cols + 1 }, (_, c) => <line key={c} x1={x + (c * w) / cols} y1={yy} x2={x + (c * w) / cols} y2={yy + ph} />)}
                {Array.from({ length: cols }, (_, c) => c % 2 === p % 2 ? <line key={`d${c}`} x1={x + (c * w) / cols} y1={yy + ph} x2={x + ((c + 1) * w) / cols} y2={yy} /> : null)}
              </g>
            );
          })}
          {Array.from({ length: pisos }, (_, p) => {
            const yy = top + p * ph;
            const cols = Math.max(2, Math.round(w / 130));
            return Array.from({ length: cols }, (_, c) => (p === pisos - 1 && puerta && c === Math.floor(cols / 2)) ? null : (
              <rect key={`${p}_${c}`} x={x + (c * w) / cols + (w / cols) * 0.28} y={yy + ph * 0.25} width={(w / cols) * 0.44} height={ph * 0.36} rx={6} fill={ventana} stroke={viga} strokeWidth={6} />
            ));
          })}
          {puerta && (() => {
            const cols = Math.max(2, Math.round(w / 130)); const c = Math.floor(cols / 2);
            const pw = Math.min(110, (w / cols) * 0.7);
            const px = x + (c * w) / cols + (w / cols - pw) / 2;
            return <path d={`M ${px} ${y} L ${px} ${y - ph * 0.62} Q ${px + pw / 2} ${y - ph * 0.8} ${px + pw} ${y - ph * 0.62} L ${px + pw} ${y} Z`} fill="#5a3418" />;
          })()}
        </g>
      )}
      {cartel && (
        <g transform={`translate(${x + w + 6} ${top + 60})`}>
          <line x1={0} y1={0} x2={120} y2={0} stroke="#3b230f" strokeWidth={8} />
          <rect x={20} y={10} width={110} height={70} rx={10} fill="#3b230f" />
          <text x={75} y={58} textAnchor="middle" fontSize={28} fontFamily={fontFamily} fontWeight={700} fill="#f7c548">{cartel}</text>
        </g>
      )}
    </svg>
  );
};

// ── objetos del mundo (SVG en coordenadas de mundo: `x,y` = punto de apoyo)
type P = { x: number; y: number; s?: number; rot?: number; op?: number };
export const G: React.FC<P & { children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, op = 1, children }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }} width={10} height={10}>
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>{children}</g>
  </svg>
);

// espada de verdugo: punta CHATA (redondeada), acanaladura, inscripción, cruz recta, mango largo
export const Espada: React.FC<P & { texto?: string; brillo?: number }> = ({ texto, brillo = 0, ...p }) => (
  <G {...p}>
    <rect x={-30} y={-120} width={60} height={-740} fill="#dfe6ee" />
    <path d="M -30 -860 Q 0 -884 30 -860 Z" fill="#dfe6ee" />
    <rect x={-30} y={-860} width={60} height={740} fill="#dfe6ee" />
    <rect x={8} y={-860} width={22} height={740} fill="#b9c4d2" />
    <path d="M -30 -860 Q 0 -886 30 -860 L 30 -850 L -30 -850 Z" fill="#c9d3df" />
    <rect x={-6} y={-820} width={12} height={640} rx={6} fill="#a9b6c6" />
    {texto && <text transform="translate(-14 -500) rotate(-90)" textAnchor="middle" fontSize={22} fontFamily={fontFamily} fontWeight={600} fill="#6a7a90" letterSpacing={2}>{texto}</text>}
    {brillo > 0 && <rect x={-30} y={-860 + brillo * 740 - 60} width={60} height={60} fill="#fff" opacity={0.75} />}
    <rect x={-120} y={-130} width={240} height={30} rx={14} fill="#8a5414" />
    <rect x={-16} y={-100} width={32} height={210} rx={10} fill="#4a2810" />
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-16} y1={-80 + i * 40} x2={16} y2={-60 + i * 40} stroke="#2b160a" strokeWidth={6} />)}
    <circle cx={0} cy={124} r={28} fill="#c98f2a" />
  </G>
);
// taburete de 3 patas
export const Taburete: React.FC<P & { brillo?: boolean }> = ({ brillo, ...p }) => (
  <G {...p}>
    {brillo && <ellipse cx={0} cy={-60} rx={170} ry={150} fill="#fff3a0" opacity={0.25} />}
    <line x1={-50} y1={-90} x2={-80} y2={0} stroke="#6b3a1f" strokeWidth={16} strokeLinecap="round" />
    <line x1={50} y1={-90} x2={80} y2={0} stroke="#6b3a1f" strokeWidth={16} strokeLinecap="round" />
    <line x1={0} y1={-90} x2={0} y2={-4} stroke="#4a2810" strokeWidth={16} strokeLinecap="round" />
    <ellipse cx={0} cy={-96} rx={72} ry={20} fill="#a8622c" />
    <ellipse cx={0} cy={-104} rx={72} ry={20} fill="#c98a4a" />
  </G>
);
// jarra (de taberna); `cadena` = colgada de un gancho con cadena
export const Jarra: React.FC<P & { cadena?: boolean; espuma?: boolean; color?: string }> = ({ cadena, espuma = true, color = "#9a6a3a", ...p }) => (
  <G {...p}>
    {cadena && <g>{Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={0} cy={-190 + i * 24} rx={i % 2 ? 6 : 11} ry={14} fill="none" stroke="#8a93a3" strokeWidth={5} />)}<path d="M -14 -214 Q 0 -236 14 -214" stroke="#555e6e" strokeWidth={7} fill="none" /></g>}
    <rect x={-40} y={-80} width={80} height={80} rx={10} fill={color} />
    <path d="M 40 -64 Q 74 -60 70 -36 Q 66 -14 40 -18" stroke={color} strokeWidth={14} fill="none" />
    <rect x={-40} y={-60} width={80} height={8} fill="rgba(0,0,0,.2)" /><rect x={-40} y={-24} width={80} height={8} fill="rgba(0,0,0,.2)" />
    {espuma && <g fill="#fff6e0"><circle cx={-24} cy={-84} r={16} /><circle cx={0} cy={-90} r={20} /><circle cx={24} cy={-84} r={16} /></g>}
  </G>
);
// pan redondo (hogaza); `rot` 180 = al revés
export const Hogaza: React.FC<P> = (p) => (
  <G {...p}>
    <path d="M -80 0 Q -86 -70 0 -76 Q 86 -70 80 0 Z" fill="#c9773a" />
    <path d="M -70 -6 Q -74 -60 0 -66 Q 74 -60 70 -6 Z" fill="#e0954a" />
    {[-30, 0, 30].map((dx) => <path key={dx} d={`M ${dx - 14} -54 L ${dx + 14} -30`} stroke="#a8582a" strokeWidth={7} strokeLinecap="round" />)}
    <rect x={-82} y={-6} width={164} height={10} rx={5} fill="#a8582a" />
  </G>
);
export const Saco: React.FC<P & { txt?: string; color?: string }> = ({ txt, color = "#d9b77a", ...p }) => (
  <G {...p}>
    <path d="M -80 0 Q -100 -110 -40 -150 L 40 -150 Q 100 -110 80 0 Z" fill={color} />
    <path d="M -40 -150 Q 0 -170 40 -150 L 30 -174 Q 0 -186 -30 -174 Z" fill="#b8955a" />
    <ellipse cx={0} cy={-150} rx={46} ry={14} fill="#f0d080" />
    {[-20, 0, 18].map((dx, i) => <circle key={i} cx={dx} cy={-156 - (i % 2) * 6} r={8} fill="#e8c060" />)}
    {txt && <text x={0} y={-60} textAnchor="middle" fontSize={34} fontFamily={fontFamily} fontWeight={700} fill="#8a6a3a">{txt}</text>}
  </G>
);
export const Cucharon: React.FC<P> = (p) => (
  <G {...p}>
    <rect x={-8} y={-260} width={16} height={240} rx={8} fill="#7d8796" />
    <ellipse cx={0} cy={0} rx={52} ry={32} fill="#9aa3b3" />
    <ellipse cx={0} cy={-6} rx={42} ry={20} fill="#5e6878" />
  </G>
);
// horca de madera (vacía; nunca con nadie colgado)
export const Horca: React.FC<P> = (p) => (
  <G {...p}>
    <rect x={-20} y={-560} width={40} height={560} fill="#6b3a1f" />
    <rect x={-20} y={-560} width={330} height={38} fill="#7d4a24" />
    <path d="M 20 -480 L 120 -560" stroke="#6b3a1f" strokeWidth={26} />
    <path d="M 260 -522 L 260 -420" stroke="#c9a36a" strokeWidth={8} />
    <ellipse cx={260} cy={-404} rx={26} ry={30} fill="none" stroke="#c9a36a" strokeWidth={8} />
    <rect x={-80} y={-20} width={160} height={30} rx={8} fill="#4a2810" />
  </G>
);
// cadalso (tarima de madera con escalera)
export const Cadalso: React.FC<P & { w?: number }> = ({ w = 700, ...p }) => (
  <G {...p}>
    <rect x={-w / 2} y={-200} width={w} height={36} fill="#a8622c" />
    <rect x={-w / 2} y={-164} width={w} height={164} fill="#7d4a24" />
    {Array.from({ length: Math.floor(w / 70) }, (_, i) => <line key={i} x1={-w / 2 + 35 + i * 70} y1={-164} x2={-w / 2 + 35 + i * 70} y2={0} stroke="#5a3418" strokeWidth={6} />)}
    <path d={`M -170 -110 L 170 -110 M -170 -40 L 170 -40 M -170 -110 L 170 -40 M 170 -110 L -170 -40`} transform={`translate(${-w / 4} 0)`} stroke="#5a3418" strokeWidth={10} />
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={w / 2 + i * 34} y={-170 + i * 36} width={40} height={14} fill="#a8622c" />)}
  </G>
);
// diario de Franz abierto, con renglones (y líneas que se escriben solas)
export const Diario: React.FC<P & { escribe?: number; titulo?: string; renglones?: string[] }> = ({ escribe = 1, titulo, renglones = [], ...p }) => (
  <G {...p}>
    <rect x={-330} y={-230} width={660} height={460} rx={16} fill="#7a3d14" />
    <rect x={-310} y={-216} width={300} height={430} fill="#fbecc8" />
    <rect x={10} y={-216} width={300} height={430} fill="#f6e3b4" />
    <rect x={-12} y={-216} width={24} height={430} fill="rgba(90,40,10,.25)" />
    {titulo && <text x={-160} y={-160} textAnchor="middle" fontSize={34} fontFamily={fontFamily} fontWeight={700} fill="#7a3d14">{titulo}</text>}
    {renglones.map((r, i) => <text key={i} x={-286} y={-110 + i * 40} fontSize={22} fontFamily={fontFamily} fontWeight={600} fill="#5a3a1a" opacity={clamp(escribe * renglones.length - i, 0, 1)}>{r}</text>)}
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={34} y={-170 + i * 42} width={240 * clamp(escribe * 9 - i, 0, 1) * (0.6 + ((i * 37) % 40) / 100)} height={9} rx={4} fill="#a8805a" opacity={0.7} />)}
  </G>
);
export const Moneda: React.FC<P> = (p) => (
  <G {...p}>
    <ellipse cx={0} cy={5} rx={38} ry={38} fill="#b87a14" />
    <circle cx={0} cy={0} r={38} fill={C.oro} />
    <circle cx={0} cy={0} r={27} fill="none" stroke="#d99a1e" strokeWidth={4} />
    <text x={0} y={12} textAnchor="middle" fontSize={32} fontFamily={fontFamily} fontWeight={700} fill="#b87a14">ƒ</text>
  </G>
);
export const Bolsa: React.FC<P> = (p) => (
  <G {...p}>
    <path d="M -70 0 Q -100 -90 -30 -120 L 30 -120 Q 100 -90 70 0 Z" fill="#8a5a2a" />
    <path d="M -36 -120 Q 0 -150 36 -120" stroke="#5a3418" strokeWidth={12} fill="none" />
    <circle cx={0} cy={-60} r={22} fill={C.oro} />
  </G>
);
// farol (calle / puerta de atrás)
export const Farol: React.FC<P & { on?: number }> = ({ on = 1, ...p }) => (
  <G {...p}>
    <circle cx={0} cy={-40} r={120} fill="#ffcf6a" opacity={0.22 * on} />
    <rect x={-26} y={-80} width={52} height={70} rx={10} fill={on > 0.3 ? "#ffd27a" : "#5a3418"} stroke="#2b1c14" strokeWidth={7} />
    <path d="M -34 -80 L 0 -112 L 34 -80 Z" fill="#2b1c14" />
  </G>
);
// río con olitas (entre x0 y x1)
export const Rio: React.FC<{ x0: number; x1: number }> = ({ x0, x1 }) => {
  const { t, hora } = useMundo();
  const k = clamp(hora / 2, 0, 1);
  const agua = mezcla("#3aa7d8", "#1d2a70", k), agua2 = mezcla("#7fd0f0", "#3a4aa0", k);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <rect x={x0} y={SUELO + 30} width={x1 - x0} height={800} fill={agua} />
      <rect x={x0 - 30} y={SUELO} width={40} height={800} fill="#8a7a6a" />
      <rect x={x1 - 10} y={SUELO} width={40} height={800} fill="#8a7a6a" />
      {Array.from({ length: 18 }, (_, i) => {
        const rr = rnd(i * 5 + 1);
        const x = x0 + (((rr() * (x1 - x0)) + t * 40 * (0.5 + rr())) % (x1 - x0));
        const y = SUELO + 60 + rr() * 160;
        return <path key={i} d={`M ${x} ${y} q 20 -12 40 0 q 20 12 40 0`} stroke={agua2} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />;
      })}
    </svg>
  );
};
// puente de piedra con arcos (de x0 a x1, a la altura del suelo)
export const Puente: React.FC<{ x0: number; x1: number }> = ({ x0, x1 }) => {
  const { hora } = useMundo();
  const k = clamp(hora / 2, 0, 1);
  const p1 = mezcla("#c9a27a", "#5a4a6a", k), p2 = mezcla("#a8825a", "#43365a", k);
  const n = 3, w = (x1 - x0) / n;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <rect x={x0} y={SUELO - 10} width={x1 - x0} height={70} fill={p1} />
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M ${x0 + i * w} ${SUELO + 60} L ${x0 + i * w} ${SUELO + 260} L ${x0 + i * w + w * 0.12} ${SUELO + 260} Q ${x0 + i * w + w / 2} ${SUELO + 70} ${x0 + (i + 1) * w - w * 0.12} ${SUELO + 260} L ${x0 + (i + 1) * w} ${SUELO + 260} L ${x0 + (i + 1) * w} ${SUELO + 60} Z`} fill={p2} />
      ))}
      <rect x={x0} y={SUELO - 40} width={x1 - x0} height={30} fill={p2} />
    </svg>
  );
};
// muralla con almenas y torre-puerta
export const Muralla: React.FC<{ x: number; w: number }> = ({ x, w }) => {
  const { hora } = useMundo();
  const k = clamp(hora / 2, 0, 1);
  const p1 = mezcla("#b5946e", "#4f4266", k), p2 = mezcla("#94744e", "#3c3152", k);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <rect x={x} y={SUELO - 520} width={w} height={520} fill={p1} />
      {Array.from({ length: Math.floor(w / 80) }, (_, i) => <rect key={i} x={x + i * 80} y={SUELO - 570} width={48} height={60} fill={p1} />)}
      {Array.from({ length: 9 }, (_, f) => Array.from({ length: Math.ceil(w / 120) }, (_, c) => <rect key={`${f}${c}`} x={x + c * 120 + (f % 2) * 60} y={SUELO - 500 + f * 56} width={110} height={50} rx={6} fill={p2} opacity={0.35} />))}
      <path d={`M ${x + w / 2 - 120} ${SUELO} L ${x + w / 2 - 120} ${SUELO - 220} Q ${x + w / 2} ${SUELO - 340} ${x + w / 2 + 120} ${SUELO - 220} L ${x + w / 2 + 120} ${SUELO} Z`} fill="#3b2614" />
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1={x + w / 2 - 105 + i * 35} y1={SUELO - 270} x2={x + w / 2 - 105 + i * 35} y2={SUELO} stroke="#6b5a4a" strokeWidth={8} />)}
    </svg>
  );
};
// banco de iglesia
export const Banco: React.FC<P & { w?: number }> = ({ w = 300, ...p }) => (
  <G {...p}>
    <rect x={-w / 2} y={-150} width={w} height={22} rx={6} fill="#7d4a24" />
    <rect x={-w / 2} y={-90} width={w} height={26} rx={6} fill="#a8622c" />
    <rect x={-w / 2 + 10} y={-90} width={18} height={90} fill="#5a3418" />
    <rect x={w / 2 - 28} y={-90} width={18} height={90} fill="#5a3418" />
    <rect x={-w / 2 + 10} y={-150} width={14} height={70} fill="#5a3418" />
  </G>
);
// vitral
export const Vitral: React.FC<P & { t: number }> = ({ t, ...p }) => (
  <G {...p}>
    <path d="M -110 0 L -110 -320 Q 0 -440 110 -320 L 110 0 Z" fill="#3b2614" />
    {[["#e8344a", -70, -260], ["#2ec4d6", 0, -320], ["#f7c548", 70, -260], ["#9b7bf0", -70, -120], ["#9be15d", 0, -180], ["#ff7a3d", 70, -120], ["#2ec4d6", -70, -40], ["#e8344a", 0, -60], ["#f7c548", 70, -40]].map(([c, x, y], i) => (
      <rect key={i} x={(x as number) - 32} y={(y as number) - 34} width={64} height={70} rx={10} fill={c as string} opacity={0.75 + 0.2 * Math.sin(t * 1.5 + i)} />
    ))}
    <path d="M -110 0 L -110 -320 Q 0 -440 110 -320 L 110 0 Z" fill="none" stroke="#2b1c14" strokeWidth={14} />
  </G>
);
// texto pintado EN el mundo (carteles, rótulos, números grandes sobre una pared)
export const TextoMundo: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; borde?: string; op?: number; rot?: number; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, size = 60, color = C.crema, borde = C.noche, op = 1, rot = 0, anchor = "middle" }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }} width={10} height={10}>
    <text x={x} y={y} transform={`rotate(${rot} ${x} ${y})`} textAnchor={anchor} fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={color} stroke={borde} strokeWidth={size * 0.14} paintOrder="stroke" strokeLinejoin="round">{text}</text>
  </svg>
);
export const interp = (t: number, a: number[], b: number[]) => interpolate(t, a, b, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });

// ── ventana: un mundo de 1920x1080 ANIDADO dentro del mundo (un dibujo del diario, un cuadro en la pared).
// La cámara se mete hasta que el dibujo llena la pantalla y la escena de adentro sigue sin corte.
export type Vent = { x: number; y: number; w: number };
export const kV = (v: Vent) => v.w / 1920;
// llave de cámara expresada en coordenadas de ADENTRO de la ventana (hz = zoom de adentro)
export const enV = (v: Vent, t: number, hx: number, hy: number, hz: number, dur?: number, arco?: number): Llave => [t, v.x + hx * kV(v), v.y + hy * kV(v), hz / kV(v), dur, arco];
export const Ventana: React.FC<{ v: Vent; children: React.ReactNode; papel?: string; sepia?: number; marco?: string; hora?: number }> = ({ v, children, papel = "#f6e3b4", sepia = 0, marco, hora }) => {
  const m = useMundo();
  // adentro la cámara "ve todo" (para Calle/Vis) y la hora puede ser otra
  return (
  <MundoCtx.Provider value={{ t: m.t, hora: hora ?? m.hora, cam: { x: 960, y: 540, z: 0.25 } }}>
  <div style={{ position: "absolute", left: v.x, top: v.y, width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${kV(v)})`, overflow: "hidden", background: papel, outline: marco ? `40px solid ${marco}` : undefined }}>
    <div style={{ position: "absolute", inset: 0, filter: sepia ? `sepia(${sepia}) saturate(${1 - sepia * 0.3})` : undefined }}>{children}</div>
  </div>
  </MundoCtx.Provider>
  );
};
