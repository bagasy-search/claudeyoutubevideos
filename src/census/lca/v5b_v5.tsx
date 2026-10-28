// lc02 · vuelta 5 (v5b, planos P46-P79 <8): piezas nuevas. No toca los _comp compartidos ni v3*/v4*.
// - MejillaV5: la mejilla hinchada DEFORMA la silueta (bulto grande de la misma piel + borde de luz + brillo de piel tirante), sin disco rojo.
// - InfeccionV5: mandíbula → cuello → sangre; rótulos del lado de ADELANTE (lado libre), a ~30 px de mundo de cada punto, sin cruzar la cara.
// - ManosNieveV5: inserto de manos frotando nieve con movimiento CIRCULAR continuo (nunca se frena: sin cuadros duplicados).
// - EspaldaPj: figura grande de espaldas (pantalla) para el contraplano de P61.
// - PensamientoEnredo: globo de pensamiento anclado a la cabeza con el garabato adentro (P58).
// - Cajon: cajón de madera para sentarse (P59).
import React from "react";
import { interpolate } from "remotion";
import { cl, Junta } from "./lc02_planos2_comp";
import { ManoV3 } from "./v3b_v3";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type Pt = { x: number; y: number };

// ---------------------------------------------------------------- mejilla hinchada (deforma la silueta)
export const MejillaV5: React.FC<{ j: Junta; k: number; f: number; latido?: number; calor?: number }> = ({ j, k, f, latido = 0, calor = 0 }) => {
  if (k <= 0.01) return null;
  const e = j.esc, d = j.dir;
  const pul = 1 + 0.06 * latido * Math.max(0, Math.sin(f / 4.2));
  // el bulto sale de la mandíbula hacia adelante y abajo: pasa el contorno de la cabeza (R 46) y se ve como cachete inflado
  const bx = j.cabeza.x + d * (20 + 12 * k) * e, by = j.cabeza.y + (34 + 8 * k) * e;
  const rx = (16 + 24 * k) * e * pul, ry = (14 + 20 * k) * e * pul;
  const P = (g: number, sx = 1, sy = 1) => { const r = (g * Math.PI) / 180; return `${(bx + d * rx * sx * Math.cos(r)).toFixed(1)},${(by + ry * sy * Math.sin(r)).toFixed(1)}`; };
  const sw = d > 0 ? 1 : 0;
  const tib = 0.3 + 0.35 * latido * Math.max(0, Math.sin(f / 4.2));
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={rx} ry={ry} fill="#17100d" />
      {/* borde de luz cálido en el contorno de afuera: se lee el volumen inflado */}
      <path d={`M${P(-40)} A${rx},${ry} 0 0 ${sw} ${P(110)}`} stroke="#f0b49a" strokeWidth={4 * e} fill="none" strokeLinecap="round" opacity={0.85 * Math.min(1, k)} />
      {/* piel tirante: brillo chico arriba-adelante */}
      <path d={`M${P(-60, 0.7, 0.7)} A${rx * 0.7},${ry * 0.7} 0 0 ${sw} ${P(-15, 0.7, 0.7)}`} stroke="#fff3e6" strokeWidth={3.4 * e} fill="none" strokeLinecap="round" opacity={0.55 * Math.min(1, k)} />
      {/* calor interno: línea roja fina que late en el borde, no un disco */}
      <path d={`M${P(5, 0.86, 0.86)} A${rx * 0.86},${ry * 0.86} 0 0 ${sw} ${P(85, 0.86, 0.86)}`} stroke="#d0453a" strokeWidth={4 * e} fill="none" strokeLinecap="round" opacity={tib * Math.min(1, k)} />
      {calor > 0 && [0, 1, 2].map((i) => {
        const q = ((f / 22 + i / 3) % 1);
        const x0 = bx + d * (rx + 12 * e) + (i - 1) * 10 * e;
        const y0 = by - q * 50 * e;
        return <path key={i} d={`M${x0},${y0} q${6 * e},${-7 * e} 0,${-14 * e} q${-6 * e},${-7 * e} 0,${-14 * e}`} stroke="#ff8a5a" strokeWidth={3 * e} fill="none" strokeLinecap="round" opacity={calor * Math.sin(q * Math.PI) * 0.9} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- infección: rótulos del lado de adelante (lado libre)
export const InfeccionV5: React.FC<{ j: Junta; f: number; t1: number; t2: number; t3: number; t4: number; tam?: number; sep?: number }> = ({ j, f, t1, t2, t3, t4, tam = 16, sep = 30 }) => {
  const e = j.esc, d = j.dir;
  const mand: Pt = { x: j.cabeza.x + d * 30 * e, y: j.cabeza.y + 46 * e };
  const cuello: Pt = { x: j.hombro.x + d * 4 * e, y: j.hombro.y - 10 * e };
  const pecho: Pt = { x: lerp(j.hombro.x, j.cad.x, 0.35) + d * 6 * e, y: lerp(j.hombro.y, j.cad.y, 0.35) };
  const lat = 1 + 0.15 * Math.max(0, Math.sin(f / 3.4));
  const seg = (a: Pt, b: Pt, t: number) => t > 0.01 ? <path d={`M${a.x},${a.y} L${lerp(a.x, b.x, t)},${lerp(a.y, b.y, t)}`} stroke="#ff4a3a" strokeWidth={4 * e} strokeLinecap="round" /> : null;
  // la columna de rótulos arranca a `sep` del punto más adelantado (mandíbula), así ninguna línea cruza la cara
  const xb = Math.max(mand.x * d, cuello.x * d, pecho.x * d) * d + d * sep;
  const rot = (txt: string, o: number, p: Pt, y: number) => {
    if (o <= 0.01) return null;
    const w = txt.length * tam * 0.62 + tam * 1.6;
    const x0 = d > 0 ? xb : xb - w;
    return (
      <g opacity={o}>
        <path d={`M${p.x},${p.y} L${xb},${y - tam * 0.3}`} stroke="#ffb0a0" strokeWidth={2} fill="none" />
        <circle cx={p.x} cy={p.y} r={3.5 * e} fill="#ffb0a0" />
        <rect x={x0} y={y - tam * 1.05} width={w} height={tam * 1.5} rx={tam * 0.75} fill="rgba(10,14,30,0.82)" stroke="#ff4a3a" strokeWidth={2} />
        <text x={x0 + w / 2} y={y} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={tam} fill="#f6ecd2">{txt}</text>
      </g>
    );
  };
  return (
    <g>
      {t1 > 0 && <circle cx={mand.x} cy={mand.y} r={5 * e * lat} fill="#ff3a2e" opacity={t1} />}
      {seg(mand, cuello, t2)}
      {seg(cuello, pecho, t3)}
      {t4 > 0 && [j.cad, { x: pecho.x - d * 30, y: pecho.y + 60 }].map((b, i) => (
        <g key={i}>
          <path d={`M${pecho.x},${pecho.y} L${b.x},${b.y}`} stroke="#ff4a3a" strokeWidth={2.5 * e} strokeLinecap="round" opacity={0.6 * t4} />
          {[0, 1, 2].map((q) => { const u = ((f / 18 + q / 3 + i * 0.13) % 1) * t4; return <circle key={q} cx={lerp(pecho.x, b.x, u)} cy={lerp(pecho.y, b.y, u)} r={3.5 * e} fill="#ff6a5a" opacity={t4} />; })}
        </g>
      ))}
      {rot("1 · JAW", t1, mand, mand.y - 8)}
      {rot("2 · NECK", t2 > 0.5 ? (t2 - 0.5) * 2 : 0, cuello, mand.y + tam * 1.9 - 8)}
      {rot("3 · BLOOD", t4, pecho, mand.y + tam * 3.8 - 8)}
    </g>
  );
};

// ---------------------------------------------------------------- inserto: manos frotando nieve (movimiento circular continuo)
export const ManosNieveV5: React.FC<{ f: number; manga?: string; puno?: string; frota?: number }> = ({ f, manga = "#2f7f86", puno = "#d9cdb2", frota = 1 }) => {
  const a = f * 0.17; // ~1,2 s por vuelta: siempre en movimiento (un vaivén con sin() se frenaba en cada punta)
  const amp = 0.55 + 0.45 * frota;
  const dx = 34 * Math.cos(a) * amp, dy = 12 * Math.sin(a) * amp;
  const cx = 960, cy = 610;
  const md = (v: number, m: number) => ((v % m) + m) % m;
  const pD = { x: cx - 30 + dx, y: cy - 20 + dy };
  const pI = { x: cx + 30 - dx, y: cy - 10 - dy };
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#1c2540" />
      <path d="M0,600 Q480,560 960,590 Q1440,620 1920,570 L1920,1080 L0,1080 Z" fill="#c6d0e2" />
      <ellipse cx={cx} cy={800} rx={420} ry={80} fill="#aab6cc" />
      <ellipse cx={cx + 40} cy={820} rx={160} ry={34} fill="#8e9ab2" />
      {Array.from({ length: 50 }).map((_, i) => { const x = md(i * 211 + f * (2 + (i % 5)), 1980) - 30; const y = md(i * 97 + f * (4 + (i % 4)), 1100) - 10; return <circle key={i} cx={x} cy={y} r={2 + (i % 4)} fill="#f4f6ff" opacity={0.75} />; })}
      <ManoV3 x={pD.x} y={pD.y} ang={-48 + 5 * Math.sin(a)} manga={manga} puno={puno} gesto="palma" s={0.62} />
      <ellipse cx={cx + dx * 0.4} cy={cy - 4 + dy * 0.3} rx={82 - 4 * Math.sin(a * 2)} ry={46 + 3 * Math.sin(a * 2)} fill="#f4f6ff" />
      <ellipse cx={cx + dx * 0.5} cy={cy - 20 + dy * 0.3} rx={46} ry={22} fill="#ffffff" />
      <g transform="translate(1920,0) scale(-1,1)">
        <ManoV3 x={1920 - pI.x} y={pI.y} ang={-44 - 5 * Math.sin(a)} manga={manga} puno={puno} gesto="palma" s={0.62} />
      </g>
      {Array.from({ length: 16 }).map((_, i) => { const q = md(f / 20 + i / 16, 1); const sx = (i % 2 ? 1 : -1) * (40 + (i * 13) % 90); return <circle key={`c${i}`} cx={cx + sx * (0.4 + q)} cy={cy + 50 + q * 170} r={4 + (i % 3) * 3} fill={i % 4 ? "#ffffff" : "#bfe2f0"} opacity={1 - q} />; })}
    </g>
  );
};

// ---------------------------------------------------------------- figura de espaldas, grande (pantalla)
// x,y = base del cuello; s = escala; tipo "theo" (gorro rojo con vuelta) o "june" (cola de pelo); ladeo = grados de la cabeza;
// brazo = 0..1 el brazo de este lado pasa por la espalda del otro hasta `hasta`.
export const EspaldaPj: React.FC<{ x: number; y: number; s?: number; tipo: "theo" | "june"; abrigo: string; bufanda: string; ladeo?: number; dx?: number; respira?: number; brazo?: number; hasta?: Pt; luz?: string }> = ({ x, y, s = 1, tipo, abrigo, bufanda, ladeo = 0, dx = 0, respira = 0, brazo = 0, hasta, luz = "#9bb7ff" }) => {
  const osc = (c: string) => c; // el abrigo ya viene oscurecido desde la escena
  const hombro = 112;
  const mano = hasta ? { x: lerp(hombro * 0.9, (hasta.x - x) / s, brazo), y: lerp(60, (hasta.y - y) / s, brazo) } : null;
  return (
    <g transform={`translate(${x},${y + respira}) scale(${s})`}>
      {/* torso de espaldas (abrigo), cortado por el borde de abajo */}
      <path d={`M${-hombro},20 Q${-hombro - 8},-6 ${-hombro + 30},-22 L${hombro - 30},-22 Q${hombro + 8},-6 ${hombro},20 L${hombro + 22},600 L${-hombro - 22},600 Z`} fill={osc(abrigo)} />
      <path d={`M0,-18 L0,600`} stroke="#000" strokeWidth={4} opacity={0.18} />
      <path d={`M${-hombro + 26},-20 Q${-hombro - 14},10 ${-hombro - 8},90 L${-hombro - 20},600`} stroke={luz} strokeWidth={5} fill="none" opacity={0.55} />
      {/* bufanda */}
      <rect x={-64} y={-38} width={128} height={34} rx={16} fill={bufanda} />
      {/* cabeza */}
      <g transform={`translate(${dx},0) rotate(${ladeo} 0 -30)`}>
        <rect x={-20} y={-60} width={40} height={30} fill="#141016" />
        <circle cx={0} cy={-104} r={76} fill="#141016" />
        <path d={`M-62,-150 A76,76 0 0 0 -70,-70`} stroke={luz} strokeWidth={5} fill="none" opacity={0.5} />
        {tipo === "theo" ? (
          <g>
            <path d="M-80,-112 Q-80,-196 0,-198 Q80,-196 80,-112 Z" fill="#b2342a" />
            <path d="M-50,-178 Q-30,-190 -6,-192" stroke="#d45a4c" strokeWidth={5} fill="none" opacity={0.6} />
            <rect x={-84} y={-128} width={168} height={32} rx={14} fill="#efe3c8" />
          </g>
        ) : (
          <g>
            <path d="M-78,-110 Q-80,-184 0,-184 Q80,-184 78,-110 Q60,-150 0,-152 Q-60,-150 -78,-110 Z" fill="#17110d" />
            <circle cx={0} cy={-62} r={11} fill="#2f7f86" />
            <path d={`M-14,-60 Q${-24 + 6 * Math.sin(respira)},10 ${-6 + 4 * Math.sin(respira)},70 Q8,40 14,-60 Z`} fill="#17110d" />
          </g>
        )}
      </g>
      {/* brazo que pasa por la espalda del otro */}
      {mano && brazo > 0.02 && (
        <g>
          <path d={`M${hombro - 20},10 Q${(hombro + mano.x) / 2},${Math.min(10, mano.y) - 40} ${mano.x},${mano.y}`} stroke={abrigo} strokeWidth={46} fill="none" strokeLinecap="round" />
          <circle cx={mano.x} cy={mano.y} r={22} fill="#141016" />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- globo de pensamiento con el enredo adentro (anclado a la cabeza)
export const PensamientoEnredo: React.FC<{ x: number; y: number; p: number; f: number; s?: number; dir?: 1 | -1; desde: Pt }> = ({ x, y, p, f, s = 1, dir = 1, desde }) => {
  if (p <= 0.01) return null;
  const sc = s * (0.6 + 0.4 * Math.min(1, p * 1.6));
  const o = Math.min(1, p * 3);
  const dib = interpolate(p, [0.3, 1], [0, 1], cl);
  const pts = Array.from({ length: 70 }).map((_, i) => { const t = i / 69, a = t * 24 + f / 14; return [Math.cos(a) * (40 + 16 * Math.sin(t * 9)), Math.sin(a * 1.3) * (20 + 8 * Math.cos(t * 7))]; });
  const n = Math.max(2, Math.round(70 * dib));
  const b1 = { x: lerp(desde.x, x, 0.33), y: lerp(desde.y, y + 40 * s, 0.33) }, b2 = { x: lerp(desde.x, x, 0.62), y: lerp(desde.y, y + 40 * s, 0.62) };
  return (
    <g opacity={o}>
      <circle cx={b1.x} cy={b1.y} r={7 * s} fill="#f4f0e6" stroke="#221c18" strokeWidth={2.5} />
      <circle cx={b2.x} cy={b2.y} r={11 * s} fill="#f4f0e6" stroke="#221c18" strokeWidth={2.5} />
      <g transform={`translate(${x},${y}) scale(${sc * dir},${sc})`}>
        {[[-52, 4, 34], [-20, -22, 38], [22, -24, 36], [54, 2, 32], [20, 24, 34], [-24, 24, 32]].map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 3} fill="#221c18" />)}
        {[[-52, 4, 34], [-20, -22, 38], [22, -24, 36], [54, 2, 32], [20, 24, 34], [-24, 24, 32]].map(([cx, cy, r], i) => <circle key={`i${i}`} cx={cx} cy={cy} r={r} fill="#f4f0e6" />)}
        <path d={`M${pts.slice(0, n).map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L")}`} stroke="#3a3450" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- cajón de madera (mundo; base en el piso)
export const Cajon: React.FC<{ x: number; piso: number; w?: number; h?: number }> = ({ x, piso, w = 110, h = 62 }) => (
  <g transform={`translate(${x},${piso})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={4} fill="#8a5a36" stroke="#5e3a22" strokeWidth={3} />
    <path d={`M${-w / 2 + 6},${-h / 2} H${w / 2 - 6} M${-w / 2 + 8},${-h + 6} L${w / 2 - 8},-6`} stroke="#5e3a22" strokeWidth={3} />
    <rect x={-w / 2 - 4} y={-h - 8} width={w + 8} height={10} rx={4} fill="#eef4fc" />
  </g>
);

// ---------------------------------------------------------------- potencia del antibiótico (P53): grande y legible
// misma idea que GraficoPotencia pero con letra grande, trazo grueso, área bajo la curva y una cápsula que viaja por la punta.
export const GraficoPotenciaV5: React.FC<{ x: number; y: number; p: number; fecha: number; corte: number; ambar?: string }> = ({ x, y, p, fecha, corte, ambar = "#f1b64a" }) => {
  const W = 760, H = 380;
  const yv = (t: number) => y + H - (H - 40) * (1 - 0.18 * t * t - 0.06 * t);
  const pts = Array.from({ length: 41 }).map((_, i) => { const t = i / 40; return [x + t * W, yv(t)]; });
  const n = Math.max(2, Math.round(41 * p));
  const vis = pts.slice(0, n);
  const xf = x + W * 0.42;
  const tip = vis[vis.length - 1];
  const linea = vis.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L");
  return (
    <g>
      <rect x={x - 90} y={y - 96} width={W + 150} height={H + 186} rx={26} fill="#120f18" opacity={0.88} stroke="#3a3448" strokeWidth={3} />
      <text x={x - 10} y={y - 40} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={44} fill="#f6ecd2" letterSpacing={4}>PILL STRENGTH</text>
      <path d={`M${x},${y} V${y + H} H${x + W}`} stroke="#8a8498" strokeWidth={5} fill="none" />
      <text x={x - 14} y={y + 52} textAnchor="end" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={30} fill="#b8b2c6">100%</text>
      <text x={x + W} y={y + H + 52} textAnchor="end" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={32} fill="#b8b2c6" letterSpacing={3}>YEARS →</text>
      <path d={`M${x},${y + H} L${linea} L${tip[0]},${y + H} Z`} fill="#7ad08a" opacity={0.16} />
      <g opacity={fecha}><path d={`M${xf},${y + 10} V${y + H}`} stroke={ambar} strokeWidth={5} strokeDasharray="12 9" /><text x={xf + 14} y={y + H - 20} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={32} fill={ambar}>EXP. DATE</text></g>
      <path d={`M${linea}`} stroke="#7ad08a" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* cápsula en la punta de la curva */}
      {p > 0.02 && <g transform={`translate(${tip[0]},${tip[1] - 34}) rotate(-18)`}>
        <rect x={-30} y={-13} width={30} height={26} rx={13} fill="#e8e2d8" /><rect x={0} y={-13} width={30} height={26} rx={13} fill="#c0352c" />
      </g>}
      <g opacity={corte}>
        <path d={`M${xf},${y + 70} V${y + H - 10}`} stroke="#e2483a" strokeWidth={6} strokeDasharray="12 10" />
        <path d={`M${xf - 44},${y + 120} l88,88 M${xf + 44},${y + 120} l-88,88`} stroke="#e2483a" strokeWidth={14} strokeLinecap="round" />
        <text x={xf + 70} y={y + 190} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={42} fill="#ff6a5a">NOT ALL AT ONCE</text>
      </g>
    </g>
  );
};
