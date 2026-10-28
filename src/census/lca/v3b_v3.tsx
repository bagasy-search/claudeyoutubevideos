// lc01 · vuelta 3 · componentes de v3b (planos 15-29): mano de inserto con manga (como ManoLapiz de P52/P56),
// fundidos de luz sin saltos (Mezcla / OlaLuz), autos a escala de persona, insertos rehechos (auto por dentro,
// cuaderno de archivo con guante, interruptor), semáforo con fundidos, mapa del río con todo dentro de cuadro,
// chips de ícono, tablilla de June y rótulos de pantalla con caja.
import React from "react";
import { AbsoluteFill, random, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { osc } from "../../anikit/sets/comun";
import { AMBAR, PAL, ROJO_CENSO } from "../elenco";
import { Auto, COLORES_AUTO } from "../mundo/comun";
import { F_MONO } from "../hud";
import { Interruptor, rampa } from "./lc01_planos1_comp";
import { LapizP } from "./lc01_planos2_comp";

// ---------------- fundidos ----------------
// Mezcla: dos versiones IDÉNTICAS de un plano (misma cámara, mismos actores) que sólo cambian la luz → sin fantasma
export const Mezcla: React.FC<{ a: React.ReactNode; b: React.ReactNode; t: number }> = ({ a, b, t }) => (
  <AbsoluteFill>
    {t < 0.999 && <AbsoluteFill>{a}</AbsoluteFill>}
    {t > 0.001 && <AbsoluteFill style={{ opacity: Math.min(1, t) }}>{b}</AbsoluteFill>}
  </AbsoluteFill>
);
// valor de luz por tramos con fundidos de `e` cuadros: claves [f, valor]
export const luzEn = (f: number, claves: [number, number][], e = 10) => {
  let v = claves[0][1];
  for (let i = 1; i < claves.length; i++) {
    const [t, w] = claves[i];
    v = v + (w - v) * rampa(f, t, t + e);
  }
  return v;
};
// ola de luz de izquierda a derecha: N franjas verticales de la versión prendida sobre la apagada, cada una con su fundido
export const OlaLuz: React.FC<{ apagado: React.ReactNode; prendido: React.ReactNode; f0: number; paso: number; n?: number; e?: number; dir?: 1 | -1 }> = ({ apagado, prendido, f0, paso, n = 8, e = 12, dir = 1 }) => {
  const f = useF();
  const w = 1920 / n;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{apagado}</AbsoluteFill>
      {Array.from({ length: n }).map((_, i) => {
        const k = dir === 1 ? i : n - 1 - i;
        const o = rampa(f, f0 + k * paso, f0 + k * paso + e);
        if (o <= 0.001) return null;
        return <AbsoluteFill key={i} style={{ opacity: o, clipPath: `inset(0px ${1920 - (i + 1) * w - 1}px 0px ${i * w}px)` }}>{prendido}</AbsoluteFill>;
      })}
    </AbsoluteFill>
  );
};

// ---------------- autos a escala de persona (tapan la fila chica del set) ----------------
// se dibuja en el `frente` de Superior: calle + autos grandes. y = base de las ruedas.
export const CalleAutos: React.FC<{ xs: number[]; y: number; s?: number; desde?: number; hasta?: number; piso: number }> = ({ xs, y, s = 1.75, piso }) => (
  <g>
    <rect x={-1500} y={piso + 48} width={8000} height={400} fill={osc(PAL.calle, 1.3)} />
    {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-1400 + i * 200} y={piso + 410} width={110} height={10} rx={4} fill="#d8cfb4" opacity={0.35} />)}
    {xs.map((x, i) => {
      const c = COLORES_AUTO[(i * 3 + 1) % COLORES_AUTO.length];
      const t = (["sedan", "suv", "sedan", "pickup"] as const)[i % 4];
      return <Auto key={i} x={x} y={y} color={c} tipo={t} dir={i % 3 === 1 ? -1 : 1} s={s} />;
    })}
  </g>
);

// ---------------- mano de inserto (pantalla): manga de color + puño + mano con dedos ----------------
// (x, y) = la punta del gesto; ang = desde dónde entra el brazo (0 = desde la derecha, 90 = desde abajo)
export type Gesto = "palma" | "dedo" | "pinza" | "puno" | "lapiz";
export const ManoV3: React.FC<{ x: number; y: number; ang?: number; manga?: string; puno?: string; gesto?: Gesto; guante?: boolean; s?: number; o?: number }> = ({ x, y, ang = 35, manga = "#c8582b", puno = "#efe3c8", gesto = "palma", guante = false, s = 1, o = 1 }) => {
  const piel = guante ? "#f4f2ec" : "#17100d";
  const borde = guante ? "#bdb6a6" : "#17100d";
  const dedo = (x1: number, y1: number, x2: number, y2: number, w = 30) => <path d={`M${x1},${y1} L${x2},${y2}`} stroke={piel} strokeWidth={w} strokeLinecap="round" />;
  const contorno = (x1: number, y1: number, x2: number, y2: number, w = 30) => guante ? <path d={`M${x1},${y1} L${x2},${y2}`} stroke={borde} strokeWidth={w + 6} strokeLinecap="round" /> : null;
  // dedos en coordenadas locales: la mano apunta hacia −x
  const D: [number, number, number, number, number][] =
    gesto === "palma" ? [[10, -40, -92, -62, 30], [0, -12, -112, -20, 32], [0, 16, -106, 22, 31], [10, 42, -80, 62, 28], [60, 58, 10, 112, 30]]
      : gesto === "dedo" ? [[0, -10, -120, -14, 30], [24, 14, -14, 26, 32], [26, 38, -6, 46, 30], [60, 58, 6, 70, 30]]
        : gesto === "pinza" ? [[0, -16, -96, -2, 30], [44, 52, -60, 14, 30], [26, 22, -8, 34, 30]]
          : gesto === "lapiz" ? [[0, -16, -70, -6, 30], [40, 50, -40, 18, 30], [26, 22, -8, 34, 30]]
            : [[20, -20, -10, -16, 34], [20, 10, -10, 14, 34], [40, 40, 0, 38, 32]];
  return (
    <g transform={`translate(${x},${y}) rotate(${-ang}) scale(${s})`} opacity={o}>
      <path d="M160,0 L1900,0" stroke={osc(manga, 0.82)} strokeWidth={176} strokeLinecap="round" />
      <path d="M150,0 L1900,0" stroke={manga} strokeWidth={160} strokeLinecap="round" />
      <path d="M260,-50 L1900,-50" stroke="#ffffff" strokeWidth={16} opacity={0.12} />
      {[380, 620].map((px) => <path key={px} d={`M${px},-70 q-20,70 0,140`} stroke={osc(manga, 0.7)} strokeWidth={6} fill="none" opacity={0.6} />)}
      <path d="M120,0 L178,0" stroke={puno} strokeWidth={170} strokeLinecap="butt" />
      {gesto === "lapiz" && <g transform="translate(-58,-6) rotate(-90)"><LapizP s={2.6} /></g>}
      {D.map(([a, b, c, d, w], i) => <g key={`c${i}`}>{contorno(a, b, c, d, w)}</g>)}
      <ellipse cx={58} cy={4} rx={86} ry={72} fill={borde} />
      <ellipse cx={58} cy={4} rx={guante ? 82 : 86} ry={guante ? 68 : 72} fill={piel} />
      {D.map(([a, b, c, d, w], i) => <g key={i}>{dedo(a, b, c, d, w)}</g>)}
      {guante && <path d="M110,-60 Q90,0 112,64" stroke={borde} strokeWidth={5} fill="none" />}
      {!guante && <path d="M70,-38 q-28,24 -6,52" stroke="#3a2a22" strokeWidth={5} fill="none" opacity={0.6} />}
    </g>
  );
};

// ---------------- 16 · el auto por dentro (vidrio, campera reconocible, llaves, tablero en 0, café con vapor) ----------------
export const InteriorAutoV3: React.FC<{ e0?: number; mano?: number }> = ({ e0 = 0, mano }) => {
  const f = useF();
  const z = 1 + rampa(f, e0, e0 + 200, false) * 0.1;
  const llave = Math.sin((f - e0) / 7) * 8 * Math.exp(-Math.max(0, f - e0) / 90);
  const m = mano !== undefined ? rampa(f, mano, mano + 16) : 0;
  const empa = mano !== undefined ? rampa(f, mano + 10, mano + 60) : 0;
  return (
    <AbsoluteFill style={{ background: "#1a1820" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "900px 600px" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#3a3440" />
          <path d="M1160,110 L1920,50 L1920,420 L1180,470 Z" fill="#a9bfd6" opacity={0.75} />
          <path d="M1160,470 L1920,420 L1920,660 L1140,660 Z" fill="#2a2630" />
          {/* tablero: velocímetro y nafta en 0 */}
          <g transform="translate(1720,540)"><circle r={70} fill="#15131a" stroke="#5a5560" strokeWidth={6} /><path d="M-50,30 A60,60 0 1 1 50,30" stroke="#8a8590" strokeWidth={5} fill="none" /><path d="M0,0 L-44,30" stroke="#ff6a3a" strokeWidth={6} strokeLinecap="round" /><text x={0} y={52} textAnchor="middle" fontFamily={F_HUD} fontSize={22} fill="#8a8590">0</text></g>
          {/* volante */}
          <g transform="translate(1460,540)"><ellipse rx={180} ry={200} fill="none" stroke="#1a1820" strokeWidth={34} /><rect x={-160} y={-12} width={320} height={26} fill="#1a1820" /><circle r={54} fill="#24202a" /></g>
          {/* llaves puestas que todavía se balancean */}
          <g transform={`translate(1270,630) rotate(${llave})`}><rect x={-4} y={0} width={8} height={30} fill="#9a9aa2" /><circle cx={0} cy={44} r={16} fill="none" stroke="#c9c9d0" strokeWidth={5} /><rect x={-6} y={56} width={12} height={40} rx={3} fill="#d8b24a" /><rect x={10} y={50} width={22} height={34} rx={6} fill={ROJO_CENSO} /></g>
          {/* asiento del conductor */}
          <path d="M220,1080 L280,560 Q300,410 460,390 L760,390 Q890,400 910,540 L950,1080 Z" fill="#4a4048" />
          <path d="M290,1080 L330,640 L910,640 L940,1080 Z" fill="#564a54" />
          {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={330 + i * 118} y={420} width={8} height={610} fill="#3a3238" opacity={0.6} />)}
          {/* campera doblada: capucha con piel, cierre, dos mangas cruzadas encima, bolsillo con solapa */}
          <g transform="translate(600,770) rotate(-4)">
            <ellipse cx={0} cy={80} rx={280} ry={26} fill="#000" opacity={0.3} />
            <rect x={-250} y={-40} width={500} height={120} rx={30} fill="#55663f" />
            <rect x={-250} y={-130} width={500} height={104} rx={30} fill="#6f8352" />
            <path d="M-250,-80 q250,-40 500,0" stroke="#4a5838" strokeWidth={6} fill="none" />
            {/* capucha con borde de piel */}
            <path d="M-150,-128 Q-60,-210 60,-196 Q150,-180 170,-128 Z" fill="#5f7246" />
            {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={-140 + i * 22} cy={-140 - Math.sin((i / 13) * Math.PI) * 56} r={16} fill="#d8ccb0" />)}
            {/* cierre */}
            <rect x={-6} y={-126} width={12} height={200} fill="#2a2a24" />
            {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-10} y={-120 + i * 12} width={20} height={4} fill="#9a9a8a" />)}
            <rect x={-12} y={-30} width={24} height={34} rx={4} fill="#c8c0a0" />
            {/* mangas cruzadas */}
            <path d="M-240,-20 Q-80,10 120,-6 L130,40 Q-80,60 -240,40 Z" fill="#617548" stroke="#4a5838" strokeWidth={4} />
            <path d="M240,30 Q90,10 -100,30 L-110,72 Q80,66 240,80 Z" fill="#5a6c42" stroke="#4a5838" strokeWidth={4} />
            <rect x={120} y={-110} width={96} height={52} rx={8} fill="#4a5838" />
            <rect x={120} y={-110} width={96} height={18} rx={6} fill="#3e4a30" />
          </g>
          {/* café en el portavasos, con vapor */}
          <g transform="translate(1040,720)">
            <rect x={-60} y={10} width={120} height={50} rx={10} fill="#1a1820" />
            <path d="M-34,10 L-28,-80 L28,-80 L34,10 Z" fill="#f4efe6" /><rect x={-36} y={-92} width={72} height={16} rx={5} fill="#3a2a22" /><rect x={-30} y={-50} width={60} height={22} fill={ROJO_CENSO} />
            {[0, 1, 2].map((k) => <path key={k} d={`M${-14 + k * 14},-100 q10,-18 0,-36 q-10,-18 3,-32`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.3 + 0.18 * Math.sin(f / 8 + k)} transform={`translate(0,${-((f * 0.6 + k * 14) % 18)})`} />)}
          </g>
          {/* vaho de la mano en el vidrio */}
          {empa > 0 && <ellipse cx={1330} cy={760} rx={190 * (0.6 + 0.4 * empa)} ry={150 * (0.6 + 0.4 * empa)} fill="#e8eef6" opacity={0.16 * empa} />}
          {/* marco de la ventanilla (desde afuera) + reflejos */}
          <path fillRule="evenodd" d="M-100,-100 H2020 V1180 H-100 Z M120,160 Q160,90 300,80 L1700,60 Q1820,70 1840,180 L1860,980 L100,1000 Z" fill="#6a2f36" />
          <path d="M120,160 Q160,90 300,80 L1700,60 Q1820,70 1840,180" stroke="#4a1e24" strokeWidth={18} fill="none" />
          <path d="M300,90 L700,90 L380,990 L180,990 Z" fill="#ffffff" opacity={0.07} />
          <path d="M800,80 L900,80 L560,990 L500,990 Z" fill="#ffffff" opacity={0.05} />
        </svg>
        {m > 0 && <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><ManoV3 x={1300 + (1 - m) * 420} y={740 + (1 - m) * 320} ang={40} gesto="palma" o={0.92} /></svg>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- 21 · el cuaderno HOY: mesa de archivo, mano con guante blanco y manga azul que pasa la hoja ----------------
export const CuadernoHoyV3: React.FC<{ pasa: number; zoom: number; marca: number }> = ({ pasa, zoom, marca }) => {
  const f = useF();
  const u = rampa(f, pasa, pasa + 30);
  const z = 1 + rampa(f, zoom, zoom + 60) * 0.35;
  const sx = Math.cos(u * Math.PI);
  const llega = rampa(f, pasa - 40, pasa - 6), va = rampa(f, pasa + 34, pasa + 64);
  // la pinza toma la esquina de la hoja 1 (derecha) y la lleva sobre el lomo a la izquierda
  const esq = { x: 1000 + 520 * sx, y: 830 - Math.sin(u * Math.PI) * 90 };
  const hx = esq.x + (1 - llega) * 600 + va * 900, hy = esq.y + (1 - llega) * 260 + va * 200;
  const marcaO = rampa(f, marca, marca + 14);
  return (
    <AbsoluteFill style={{ background: "#14161e" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1010px 900px" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#3a3e48" />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={0} y={i * 96} width={1920} height={3} fill="#2c3038" />)}
          <path d="M0,0 L760,0 L1500,1080 L0,1080 Z" fill="#cfe0ff" opacity={0.1} />
          {/* etiqueta de archivo, abajo a la izquierda (lejos de los rótulos) */}
          <g transform="translate(560,975) rotate(-5)"><rect x={-130} y={-40} width={260} height={80} rx={4} fill="#efe6cc" /><text x={0} y={10} textAnchor="middle" fontFamily={F_MONO} fontWeight={700} fontSize={26} fill="#3a3e48">ITEM 001</text></g>
          <g transform="rotate(-2 1000 560)">
            <rect x={460} y={262} width={1100} height={640} rx={12} fill="#000" opacity={0.4} />
            <rect x={440} y={240} width={540} height={640} rx={10} fill="#e6d8b0" />
            <rect x={1000} y={240} width={540} height={640} rx={10} fill="#e9dcb6" />
            {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1020} y={310 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
            {/* restos de la hoja 2 arrancada en el lomo */}
            {u > 0.5 && <path d="M1000,246 l22,30 -14,26 20,34 -16,30 18,44 -18,40 14,52 -16,44 18,54 -14,46 16,60 -18,56 12,96 -26,0 0,-632 Z" fill="#f1e6c4" stroke="#c9b88a" strokeWidth={3} />}
            {/* hoja 1 que gira sobre el lomo */}
            <g transform={`translate(1000,0) scale(${sx},1) translate(-1000,0)`}>
              <rect x={1000} y={240} width={540} height={640} rx={10} fill={sx > 0 ? "#efe2c0" : "#e2d2a6"} />
              {sx > 0 && <>{Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1020} y={310 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
                <text x={1110} y={410} fontFamily={F_MANO} fontWeight={700} fontSize={92} fill="#2a3a7a" opacity={0.85}>CENSUS</text>
                <text x={1240} y={600} fontFamily={F_MANO} fontWeight={700} fontSize={150} fill="#2a3a7a" opacity={0.85}>1</text>
                <circle cx={1420} cy={790} r={56} fill="#a07a3a" opacity={0.15} /></>}
            </g>
            <rect x={992} y={236} width={16} height={648} rx={6} fill="#5a1a14" />
            {/* el borde arrancado, marcado con lápiz rojo */}
            {marcaO > 0 && <ellipse cx={1010} cy={575} rx={70} ry={275} fill="none" stroke="#d8382c" strokeWidth={8} strokeDasharray={2200} strokeDashoffset={2200 * (1 - marcaO)} opacity={0.9} />}
          </g>
          {/* polvo en el haz de luz */}
          {Array.from({ length: 40 }).map((_, i) => { const x = random(`pv${i}`) * 900 + ((f * (0.3 + random(`pw${i}`) * 0.4)) % 300), y = (random(`py${i}`) * 1080 + f * (0.4 + random(`pz${i}`) * 0.5)) % 1080; return <circle key={i} cx={x + y * 0.4} cy={y} r={1.5 + random(`pr${i}`) * 2.5} fill="#e8f0ff" opacity={0.25 + 0.3 * Math.sin(f / 10 + i)} />; })}
          {llega > 0 && va < 1 && <ManoV3 x={hx} y={hy} ang={20 - u * 10} manga="#2f4a7a" puno="#e8e2d0" gesto="pinza" guante />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- 23 · mapa del río (todo dentro de cuadro) ----------------
export const MapaRioV3: React.FC<{ desde: number; pin1: number; pin2: number }> = ({ desde, pin1, pin2 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const u = rampa(f, desde, desde + 40);
  const z = 1 + rampa(f, desde, desde + 150, false) * 0.06;
  const pin = (x: number, y: number, t: string, a: number, dy = 52) => {
    if (f < a) return null;
    const s = spring({ frame: f - a, fps, config: { damping: 12, stiffness: 160 } });
    const gira = (f - a) * 9;
    return (
      <g transform={`translate(${x},${y})`}>
        <g transform={`translate(0,${(1 - s) * -60}) scale(${s})`}>
          <circle cx={0} cy={-80} r={40} fill="#13223a" stroke={AMBAR} strokeWidth={5} />
          <g transform={`translate(0,-80) rotate(${gira})`}>{Array.from({ length: 6 }).map((_, i) => <path key={i} d="M0,0 Q12,-14 4,-30" stroke={AMBAR} strokeWidth={6} fill="none" strokeLinecap="round" transform={`rotate(${i * 60})`} />)}</g>
          <path d="M-10,-40 L10,-40 L0,0 Z" fill={AMBAR} />
        </g>
        <g opacity={s}><rect x={-t.length * 13 - 18} y={dy - 34} width={t.length * 26 + 36} height={50} rx={10} fill="rgba(14,12,20,0.78)" stroke={AMBAR} strokeWidth={3} /><text x={0} y={dy} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={36} letterSpacing={3} fill="#f6ecd2">{t}</text></g>
      </g>
    );
  };
  const rio = "M240,880 C420,840 520,720 700,700 C860,690 940,580 1100,560 C1240,540 1320,470 1460,440 C1560,420 1620,390 1680,350";
  return (
    <AbsoluteFill style={{ background: "#13223a" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "900px 600px" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 17 }).map((_, i) => <rect key={i} x={i * 120} y={0} width={2} height={1080} fill="#2a4a6a" opacity={0.35} />)}
          {Array.from({ length: 10 }).map((_, i) => <rect key={`h${i}`} x={0} y={i * 120} width={1920} height={2} fill="#2a4a6a" opacity={0.35} />)}
          {/* lago Superior arriba a la derecha, con su nombre ADENTRO */}
          <path d="M1480,0 L1920,0 L1920,520 Q1760,430 1690,350 Q1560,220 1480,0 Z" fill="#3a7ac0" opacity={0.55} />
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${1640 + (i % 3) * 70 + ((f * 0.8) % 40)},${120 + i * 50} q14,-8 28,0 q14,8 28,0`} stroke="#cfe6ff" strokeWidth={3} fill="none" opacity={0.4} />)}
          <text x={1720} y={190} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#cfe6ff" letterSpacing={3}>LAKE</text>
          <text x={1720} y={230} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#cfe6ff" letterSpacing={3}>SUPERIOR</text>
          <path d={rio} stroke="#5aa0e0" strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
          <path d={rio} stroke="#cfe6ff" strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="0.02 0.06" strokeDashoffset={-(f / 90)} opacity={0.6 * u} />
          <text x={420} y={960} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#9fd0ff" letterSpacing={4} opacity={u}>ST. LOUIS RIVER</text>
          <g opacity={u}><circle cx={1680} cy={360} r={18} fill="#f6ecd2" /><text x={1650} y={420} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f6ecd2" letterSpacing={3}>DULUTH</text></g>
          {pin(700, 700, "THOMSON", pin1)}
          {pin(1100, 560, "FOND DU LAC", pin2)}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- 24 · semáforo grande con fundidos (cambia para nadie) ----------------
export const SemaforoFundido: React.FC<{ x: number; y: number; claves: [number, 0 | 1 | 2][]; s?: number }> = ({ x, y, claves, s = 1 }) => {
  const f = useF();
  const cols = ["#ff4a3d", "#ffcf3a", "#4ae08a"];
  const o = [0, 1, 2].map((k) => luzEn(f, claves.map(([t, v]) => [t, v === k ? 1 : 0] as [number, number]), 8));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-12} y={160} width={24} height={900} fill="#121016" />
      <rect x={-70} y={-180} width={140} height={360} rx={22} fill="#121016" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <path d={`M-58,${-150 + k * 112} q58,-30 116,0`} stroke="#121016" strokeWidth={14} fill="none" />
          <circle cx={0} cy={-110 + k * 110} r={42} fill="#2a2630" />
          <circle cx={0} cy={-110 + k * 110} r={42} fill={cols[k]} opacity={o[k]} />
          {o[k] > 0.02 && <Halo x={0} y={-110 + k * 110} r={170} color={cols[k]} fuerza={0.75 * o[k]} />}
        </g>
      ))}
    </g>
  );
};

// ---------------- 26 / 29 · la mano en el interruptor (inserto): pared que se ilumina con fundido, mano con manga ----------------
export const ManoInterruptorV3: React.FC<{ toques: number[]; manga?: string; z0?: number; z1?: number; dur?: number }> = ({ toques, manga = "#2f7f86", z0 = 1, z1 = 1.08, dur = 140 }) => {
  const f = useF();
  // luz: arranca prendida; cada toque invierte con fundido de 8 cuadros
  const cl: [number, number][] = [[-1000, 1]];
  let on = 1;
  for (const t of toques) { on = 1 - on; cl.push([t + 2, on]); }
  const luz = luzEn(f, cl, 8);
  let est = true;
  for (const t of toques) if (f >= t + 3) est = !est;
  // el dedo baja/sube a la tecla en cada toque
  const ult = toques.filter((t) => t - 8 <= f).pop();
  const pr = ult === undefined ? 0 : Math.max(0, 1 - Math.abs(f - ult) / 8);
  const z = z0 + (z1 - z0) * rampa(f, 0, dur, false);
  const tecla = { x: 900, y: est ? 500 : 620 };
  return (
    <AbsoluteFill style={{ background: "#2a3038", transform: `scale(${z})` }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill="#2a3038" />
        <rect x={0} y={0} width={1920} height={1080} fill="#c8d2d6" opacity={luz} />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 240} y={0} width={3} height={1080} fill="#000" opacity={0.06} />)}
        <path d="M1920,0 L1400,0 L1100,1080 L1920,1080 Z" fill="#6a7aa0" opacity={0.25 * (1 - luz)} />
        {luz > 0.02 && <Halo x={960} y={-100} r={1300} color="#fff6dc" fuerza={0.5 * luz} />}
        <g transform="translate(900,560) scale(2.6)"><Interruptor on={est} /></g>
        <ManoV3 x={tecla.x + 20 + (1 - pr) * 60} y={tecla.y + (est ? -20 : 20) * pr} ang={22} manga={manga} puno="#e6f0ee" gesto="dedo" s={1.15} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- chips de ícono (en el cielo) ----------------
export type Icono = "farol" | "cartel" | "porche" | "ventana" | "check";
const IconoSVG: React.FC<{ i: Icono }> = ({ i }) => {
  if (i === "farol") return <g stroke="#f6ecd2" strokeWidth={5} fill="none"><path d="M-6,26 L-6,-18 Q-6,-26 6,-26 L18,-26" /><path d="M10,-24 L26,-24 L22,-16 L14,-16 Z" fill={AMBAR} stroke="none" /></g>;
  if (i === "cartel") return <g><rect x={-24} y={-20} width={48} height={30} rx={4} fill={AMBAR} /><rect x={-3} y={10} width={6} height={16} fill="#f6ecd2" /></g>;
  if (i === "porche") return <g stroke="#f6ecd2" strokeWidth={4} fill="none"><path d="M-24,0 L0,-22 L24,0 L24,24 L-24,24 Z" /><circle cx={14} cy={-2} r={6} fill={AMBAR} stroke="none" /></g>;
  if (i === "ventana") return <g><rect x={-18} y={-22} width={36} height={44} fill="#fff1b8" stroke="#f6ecd2" strokeWidth={4} /></g>;
  return <path d="M-16,0 L-4,12 L18,-14" stroke="#7dff9a" strokeWidth={7} fill="none" strokeLinecap="round" />;
};
export const Chip: React.FC<{ texto: string; icono: Icono; x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string }> = ({ texto, icono, x, y, desde, hasta = 1e9, tam = 40, color = "#f6ecd2" }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 150 } });
  const o = Math.min(Math.min(1, (f - desde) / 8), 1 - rampa(f, hasta, hasta + 10));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - s) * 22}px) scale(${0.85 + 0.15 * s})`, transformOrigin: "0 50%", display: "flex", alignItems: "center", gap: 16, background: "rgba(14,12,20,0.8)", border: `3px solid ${AMBAR}`, borderRadius: 40, padding: "8px 26px 8px 14px", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 4, color, whiteSpace: "nowrap" }}>
      <svg width={60} height={60} viewBox="-30 -30 60 60"><circle r={28} fill="#241c2e" /><IconoSVG i={icono} /></svg>
      {texto}
    </div>
  );
};

// ---------------- 27 · tablilla de June (en la mano: origen = donde la toma) ----------------
export const Tablilla: React.FC<{ f: number; escribe?: number }> = ({ f, escribe = 0 }) => (
  <g transform="rotate(-8)">
    <rect x={-6} y={-70} width={74} height={96} rx={6} fill="#8a6a44" />
    <rect x={2} y={-60} width={58} height={80} rx={2} fill="#f6f2e8" />
    <rect x={18} y={-76} width={26} height={14} rx={4} fill="#9aa0a8" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={8} y={-46 + i * 13} width={Math.max(0, Math.min(44, 44 * (escribe * 5 - i)))} height={3} fill="#2a3a7a" opacity={0.8} />)}
    {f < 0 && null}
  </g>
);

// ---------------- rótulo de pantalla con caja y fundido (texto corto) ----------------
export const Pilar: React.FC<{ lineas: [string, string, string][]; x: number; y: number; desde: number; hasta?: number; tam?: number; centro?: boolean }> = ({ lineas, x, y, desde, hasta = 1e9, tam = 44, centro = false }) => {
  const f = useF();
  const o = Math.min(rampa(f, desde, desde + 10), 1 - rampa(f, hasta - 10, hasta));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(${centro ? "-50%" : "0"},${(1 - o) * 14}px)`, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color: "#f6ecd2", background: "rgba(14,12,20,0.8)", padding: "10px 24px", borderRadius: 14, border: `3px solid ${AMBAR}`, lineHeight: 1.25 }}>
      {lineas.map(([e, v, c], i) => <div key={i} style={{ whiteSpace: "nowrap" }}>{e} <span style={{ color: c }}>{v}</span></div>)}
    </div>
  );
};

// ---------------- 18 · casillas en fila (una pastilla por lugar, la cruz roja se dibuja) ----------------
export const Casillas: React.FC<{ x: number; y: number; desde: number; items: { t: string; f: number; x?: number }[]; tam?: number }> = ({ x, y, desde, items, tam = 34 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 18 }}>
      {items.map((it, i) => {
        const a = Math.max(desde, it.f - 10);
        if (f < a) return <div key={i} style={{ opacity: 0 }} />;
        const s = spring({ frame: f - a, fps, config: { damping: 14, stiffness: 150 } });
        const t = it.x !== undefined ? rampa(f, it.x, it.x + 8) : 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: Math.min(1, (f - a) / 8), transform: `translateY(${(1 - s) * -18}px)`, background: "#fdf6d8", borderRadius: 10, padding: "8px 20px", boxShadow: "0 6px 16px rgba(0,0,0,0.4)", fontFamily: F_MANO, fontWeight: 700, fontSize: tam, color: "#1d3a8a", whiteSpace: "nowrap" }}>
            <div style={{ width: 28, height: 28, border: "4px solid #1d3a8a", borderRadius: 4, position: "relative" }}>
              {t > 0 && <svg width={44} height={44} style={{ position: "absolute", left: -9, top: -11 }}><path d={`M6,6 L${6 + 32 * Math.min(1, t * 2)},${6 + 32 * Math.min(1, t * 2)} M38,6 L${38 - 32 * Math.max(0, t * 2 - 1)},${6 + 32 * Math.max(0, t * 2 - 1)}`} stroke="#d8382c" strokeWidth={6} strokeLinecap="round" /></svg>}
            </div>
            {it.t}
          </div>
        );
      })}
    </div>
  );
};

// ---------------- 26 / 29 · la ventana del 4º piso de St. Mary's dibujada encima del set, con fundido real y silueta ----------------
// (el set salta de oscuro a prendido en un umbral; esta capa va en `medio` con ventana=0 en el set)
export const VentanaSM: React.FC<{ x: number; y: number; luz: number; silueta?: number }> = ({ x, y, luz, silueta = 0 }) => (
  <g>
    {luz > 0.01 && <Halo x={x + 45} y={y + 50} r={300} color={AMBAR} fuerza={0.95 * luz} />}
    <rect x={x} y={y} width={90} height={100} fill="#251d2c" />
    <rect x={x} y={y} width={90} height={100} fill="#fff1b8" opacity={luz} />
    {silueta > 0 && <g opacity={silueta * luz * 0.75}><circle cx={x + 62} cy={y + 44} r={13} fill="#3a2a22" /><path d={`M${x + 40},${y + 100} Q${x + 44},${y + 62} ${x + 62},${y + 60} Q${x + 82},${y + 62} ${x + 86},${y + 100} Z`} fill="#3a2a22" /></g>}
    <rect x={x + 43} y={y} width={4} height={100} fill="#3a2c42" />
    <rect x={x} y={y + 48} width={90} height={4} fill="#3a2c42" />
    <rect x={x - 4} y={y - 4} width={98} height={108} fill="none" stroke="#3a2c42" strokeWidth={6} />
  </g>
);
