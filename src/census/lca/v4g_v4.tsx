// lc02 · vuelta 4 (v4g, planos P41-P60): piezas nuevas. No toca los _comp compartidos ni v3g/v3h.
// - Tomas: sub-tomas internas de un plano con fundido CORTO de 6 cuadros (nada de corte seco: el medidor lo marca tirón).
// - MejillaV4: la mejilla hinchada como parte de la silueta de la cabeza (misma piel, sin disco rojo): bulto + borde de luz.
// - InfeccionV4: mandíbula → cuello → sangre con trazo FINO (sin glow sobre la cara) y rótulos pegados a cada punto.
// - ManosNieveV4: inserto de las manos de June (manga turquesa con puño + mano con dedos de ManoV3) frotándose nieve.
// - AvionTachado: avioneta chica en el cielo de la ventana que se tacha (NO PLANE IN SPRING).
// - RelojPulsera: reloj de pulsera con las agujas que giran locas (LOSING TRACK OF TIME).
// - GolpeOndas: arcos chicos en la puerta en cada golpe (P50).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useF } from "../../anikit/camara";
import { Junta, tr } from "./lc02_planos2_comp";
import { ManoV3 } from "./v3b_v3";
import { PilaLena } from "./v3h_v3";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type Pt = { x: number; y: number };

// ---------------------------------------------------------------- sub-tomas con fundido corto
// cortes[i] = cuadro (del plano) en que empieza tomas[i + 1]; la toma nueva entra con fundido de d cuadros encima de la vieja
export const Tomas: React.FC<{ cortes: number[]; tomas: React.ReactNode[]; d?: number }> = ({ cortes, tomas, d = 6 }) => {
  const f = useF();
  let i = 0;
  while (i < cortes.length && f >= cortes[i]) i++;
  const c = i > 0 ? cortes[i - 1] : -1e9;
  if (i > 0 && f < c + d) {
    return (
      <AbsoluteFill>
        {tomas[i - 1]}
        <AbsoluteFill style={{ opacity: (f - c + 1) / (d + 1) }}>{tomas[i]}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill>{tomas[i]}</AbsoluteFill>;
};

// ---------------------------------------------------------------- leña de verdad para el Living (no la grilla de lunares)
export const PilaV4: React.FC<{ filas?: number }> = ({ filas = 7 }) => <PilaLena x={40} piso={900} w={600} filas={filas} seed="liv" />;

// ---------------------------------------------------------------- mejilla hinchada (parte de la silueta)
export const MejillaV4: React.FC<{ j: Junta; k: number; f: number; latido?: number; calor?: number }> = ({ j, k, f, latido = 0, calor = 0 }) => {
  if (k <= 0.01) return null;
  const e = j.esc, d = j.dir;
  const pul = 1 + 0.06 * latido * Math.max(0, Math.sin(f / 4.2));
  // el bulto nace DENTRO de la cabeza (mandíbula de atrás) y empuja la silueta hacia afuera y abajo
  const bx = j.cabeza.x + d * 16 * e, by = j.cabeza.y + 34 * e;
  const rx = (14 + 22 * k) * e * pul, ry = (14 + 20 * k) * e * pul;
  const tib = 0.25 + 0.3 * latido * Math.max(0, Math.sin(f / 4.2));
  const P = (g: number) => { const r = (g * Math.PI) / 180; return `${bx + d * rx * Math.cos(r)},${by + ry * Math.sin(r)}`; };
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={rx} ry={ry} fill="#17100d" />
      {/* borde de luz SÓLO en el contorno de afuera (abajo y atrás): se lee el volumen sin dibujar un disco */}
      <path d={`M${P(-25)} A${rx},${ry} 0 0 ${d > 0 ? 1 : 0} ${P(105)}`} stroke="#e8a890" strokeWidth={3.2 * e} fill="none" strokeLinecap="round" opacity={0.7 * k} />
      <path d={`M${P(10)} A${rx},${ry} 0 0 ${d > 0 ? 1 : 0} ${P(80)}`} stroke="#c0453a" strokeWidth={5 * e} fill="none" strokeLinecap="round" opacity={tib * k} />
      {calor > 0 && [0, 1, 2].map((i) => {
        const q = ((f / 22 + i / 3) % 1);
        const x0 = bx + d * (rx + 10 * e) + (i - 1) * 10 * e;
        const y0 = by - q * 50 * e;
        return <path key={i} d={`M${x0},${y0} q${6 * e},${-7 * e} 0,${-14 * e} q${-6 * e},${-7 * e} 0,${-14 * e}`} stroke="#ff8a5a" strokeWidth={3 * e} fill="none" strokeLinecap="round" opacity={calor * Math.sin(q * Math.PI) * 0.9} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- infección: trazo fino + rótulos pegados al cuerpo
// t1 mandíbula, t2 cuello, t3 pecho, t4 sangre. Los rótulos van del lado de ATRÁS del personaje (−dir), a ~70 px del cuerpo.
export const InfeccionV4: React.FC<{ j: Junta; f: number; t1: number; t2: number; t3: number; t4: number; tam?: number }> = ({ j, f, t1, t2, t3, t4, tam = 17 }) => {
  const e = j.esc, d = j.dir;
  const mand: Pt = { x: j.cabeza.x + d * 14 * e, y: j.cabeza.y + 44 * e };
  const cuello: Pt = { x: j.hombro.x + d * 2 * e, y: j.hombro.y - 12 * e };
  const pecho: Pt = { x: lerp(j.hombro.x, j.cad.x, 0.35) + d * 4 * e, y: lerp(j.hombro.y, j.cad.y, 0.35) };
  const lat = 1 + 0.15 * Math.max(0, Math.sin(f / 3.4));
  const seg = (a: Pt, b: Pt, t: number) => t > 0.01 ? <path d={`M${a.x},${a.y} L${lerp(a.x, b.x, t)},${lerp(a.y, b.y, t)}`} stroke="#ff4a3a" strokeWidth={4 * e} strokeLinecap="round" /> : null;
  const viajes = [j.manoD, j.manoI, j.cad];
  const rot = (txt: string, o: number, p: Pt, dy: number) => {
    if (o <= 0.01) return null;
    const w = txt.length * tam * 0.62 + tam * 1.6;
    const xb = j.hombro.x - d * 92 * e; // borde del rótulo más cercano al cuerpo
    const x0 = d > 0 ? xb - w : xb;
    const y = p.y + dy;
    return (
      <g opacity={o}>
        <path d={`M${p.x},${p.y} L${xb},${y - tam * 0.3}`} stroke="#ffb0a0" strokeWidth={2} fill="none" />
        <circle cx={p.x} cy={p.y} r={3.5 * e} fill="#ffb0a0" />
        <rect x={x0} y={y - tam * 1.05} width={w} height={tam * 1.5} rx={tam * 0.75} fill="rgba(10,14,30,0.78)" stroke="#ff4a3a" strokeWidth={2} />
        <text x={x0 + w / 2} y={y} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={tam} fill="#f6ecd2">{txt}</text>
      </g>
    );
  };
  return (
    <g>
      {t1 > 0 && <circle cx={mand.x} cy={mand.y} r={5 * e * lat} fill="#ff3a2e" opacity={t1} />}
      {seg(mand, cuello, t2)}
      {seg(cuello, pecho, t3)}
      {t4 > 0 && viajes.map((b, i) => (
        <g key={i}>
          <path d={`M${pecho.x},${pecho.y} L${b.x},${b.y}`} stroke="#ff4a3a" strokeWidth={2.5 * e} strokeLinecap="round" opacity={0.6 * t4} />
          {[0, 1, 2].map((q) => { const u = ((f / 18 + q / 3 + i * 0.13) % 1) * t4; return <circle key={q} cx={lerp(pecho.x, b.x, u)} cy={lerp(pecho.y, b.y, u)} r={3.5 * e} fill="#ff6a5a" opacity={t4} />; })}
        </g>
      ))}
      {rot("1 · JAW", t1, mand, -26 * e)}
      {rot("2 · NECK", t2 > 0.5 ? tr(t2, 0.5, 1) : 0, cuello, 4 * e)}
      {rot("3 · BLOOD", t4, pecho, 34 * e)}
    </g>
  );
};

// ---------------------------------------------------------------- inserto (pantalla): manos con manga frotando nieve
export const ManosNieveV4: React.FC<{ f: number; manga?: string; puno?: string; frota?: number }> = ({ f, manga = "#2f7f86", puno = "#d9cdb2", frota = 1 }) => {
  const t = Math.sin(f * 0.42) * frota;
  const cx = 960, cy = 610;
  const md = (a: number, m: number) => ((a % m) + m) % m;
  // punta de cada mano (dedos): se cruzan y vuelven
  const pD = { x: cx - 30 + 40 * t, y: cy - 20 - 8 * Math.abs(t) };
  const pI = { x: cx + 30 + 40 * t, y: cy - 10 + 8 * Math.abs(t) };
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#1c2540" />
      <path d="M0,600 Q480,560 960,590 Q1440,620 1920,570 L1920,1080 L0,1080 Z" fill="#c6d0e2" />
      <ellipse cx={cx} cy={800} rx={420} ry={80} fill="#aab6cc" />
      {/* hueco en la nieve de donde saca los puñados */}
      <ellipse cx={cx + 40} cy={820} rx={160} ry={34} fill="#8e9ab2" />
      {Array.from({ length: 50 }).map((_, i) => { const x = md(i * 211 + f * (2 + (i % 5)), 1980) - 30; const y = md(i * 97 + f * (4 + (i % 4)), 1100) - 10; return <circle key={i} cx={x} cy={y} r={2 + (i % 4)} fill="#f4f6ff" opacity={0.75} />; })}
      {/* mano derecha: entra desde abajo a la derecha */}
      <ManoV3 x={pD.x} y={pD.y} ang={-48 + 6 * t} manga={manga} puno={puno} gesto="palma" s={0.62} />
      {/* nieve apretada entre las palmas */}
      <ellipse cx={cx + 30 * t} cy={cy - 4} rx={82} ry={46} fill="#f4f6ff" />
      <ellipse cx={cx + 36 * t} cy={cy - 20} rx={46} ry={22} fill="#ffffff" />
      {/* mano izquierda: espejo, desde abajo a la izquierda (encima de la nieve) */}
      <g transform="translate(1920,0) scale(-1,1)">
        <ManoV3 x={1920 - pI.x} y={pI.y} ang={-44 - 6 * t} manga={manga} puno={puno} gesto="palma" s={0.62} />
      </g>
      {/* nieve que se desgrana y cae, y gotas de agua */}
      {Array.from({ length: 16 }).map((_, i) => { const q = md(f / 20 + i / 16, 1); const sx = (i % 2 ? 1 : -1) * (40 + (i * 13) % 90); return <circle key={`c${i}`} cx={cx + sx * (0.4 + q)} cy={cy + 50 + q * 170} r={4 + (i % 3) * 3} fill={i % 4 ? "#ffffff" : "#bfe2f0"} opacity={1 - q} />; })}
    </g>
  );
};

// ---------------------------------------------------------------- avioneta chica en el cielo (mundo) que se tacha
export const AvionTachado: React.FC<{ x: number; y: number; o: number; tacha: number; s?: number }> = ({ x, y, o, tacha, s = 1 }) => o <= 0.01 ? null : (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-46,0 Q-40,-8 30,-6 Q46,-4 50,0 Q46,4 30,6 Q-40,8 -46,0 Z" fill="#e8ecf4" />
    <path d="M-4,-4 L-22,-34 L-10,-34 L14,-4 Z M-4,4 L-22,34 L-10,34 L14,4 Z" fill="#c8d0dc" />
    <path d="M-40,-2 L-50,-18 L-42,-18 L-30,-2 Z" fill="#c8d0dc" />
    {[0, 1, 2].map((i) => <circle key={i} cx={-6 + i * 14} cy={-1} r={2.6} fill="#5a6a84" />)}
    {tacha > 0 && <g stroke="#e2483a" strokeWidth={7} strokeLinecap="round">
      <path d={`M-58,-42 L${-58 + 116 * Math.min(1, tacha * 2)},${-42 + 84 * Math.min(1, tacha * 2)}`} />
      {tacha > 0.5 && <path d={`M58,-42 L${58 - 116 * (tacha * 2 - 1)},${-42 + 84 * (tacha * 2 - 1)}`} />}
    </g>}
  </g>
);

// ---------------------------------------------------------------- reloj de pulsera con agujas locas (mundo)
export const RelojPulsera: React.FC<{ x: number; y: number; f: number; o: number; loco: number; s?: number }> = ({ x, y, f, o, loco, s = 1 }) => o <= 0.01 ? null : (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={17} fill="#f2ece0" stroke="#2a2a32" strokeWidth={4} />
    <line x1={0} y1={0} x2={9 * Math.sin(f * 0.5 * loco)} y2={-9 * Math.cos(f * 0.5 * loco)} stroke="#2a2a32" strokeWidth={3} strokeLinecap="round" />
    <line x1={0} y1={0} x2={13 * Math.sin(f * 2.2 * loco + 1)} y2={-13 * Math.cos(f * 2.2 * loco + 1)} stroke="#c0352c" strokeWidth={2} strokeLinecap="round" />
  </g>
);

// ---------------------------------------------------------------- arcos de golpe en una puerta (mundo); golpes = cuadros
export const GolpeOndas: React.FC<{ x: number; y: number; f: number; golpes: number[]; dir?: number }> = ({ x, y, f, golpes, dir = -1 }) => (
  <g>{golpes.map((g, i) => {
    const q = (f - g) / 12;
    if (q < 0 || q > 1) return null;
    return <g key={i} opacity={1 - q}>{[0, 1].map((k) => <path key={k} d={`M${x + dir * (14 + k * 14 + q * 16)},${y - 22 - k * 8} q${dir * 12},${22 + k * 8} 0,${44 + k * 16}`} stroke="#f6ecd2" strokeWidth={4} fill="none" strokeLinecap="round" />)}</g>;
  })}</g>
);
