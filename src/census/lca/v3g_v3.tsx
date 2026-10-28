// lc02 · vuelta 3 (v3g, P41-P60): piezas nuevas. Todo en coordenadas del MUNDO salvo lo que dice «pantalla».
//  · caras nuevas (se AGREGAN a EXPRESIONES con prefijo v3g_: dormido, dolor, boca, mirada); no se toca ninguna existente
//  · MejillaV3: la mejilla hinchada que cambia la SILUETA de la cabeza (bulto que sobresale + brillo + calor + latido)
//  · InfeccionV3: la infección que baja mandíbula → cuello → pecho → sangre, con rótulos anclados en la pared
//  · Ventisca: nieve que pega de costado, rayas de viento y ráfagas (tormenta de verdad)
//  · CalendarioPared: el almanaque de la pared con los días que se tachan
//  · Durmiente: un PjM acostado (rotado) bajo la frazada
//  · SombraPj: la sombra grande de un PjM en la pared (luz de vela)
//  · CuerdaVoz: la onda de la charla entre dos bocas que se aplana (silencio)
//  · ManosNieve: inserto (pantalla) de las dos manos con manga que se frotan nieve
//  · VelaW, CartelColgante, VeloOscuro, RelojMano (inserto del reloj radiocontrolado)
import React from "react";
import { interpolate } from "remotion";
import { EXPRESIONES } from "../../anikit/personaje";
import { Halo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { AMBAR } from "../elenco";
import { F_MONO } from "../hud";
import { Junta, PjM, PjMProps, cl, tr } from "./lc02_planos2_comp";

// ---------------------------------------------------------------- caras nuevas (aditivas)
const N = EXPRESIONES.neutral;
const XP = EXPRESIONES as Record<string, typeof N>;
if (!XP.v3g_dormido) {
  XP.v3g_dormido = { ...N, abre: 0.05, ceja: -6, cejaY: 4, bocaW: 6, bocaC: 1 };
  XP.v3g_dolor = { ...N, abre: 0.55, ceja: -24, cejaY: -2, parpado: 0.2, bocaW: 10, bocaC: -6, bocaO: 3, dientes: 0.8, gota: 1 };
  XP.v3g_boca = { ...N, abre: 1.05, ceja: -20, cejaY: -4, bocaW: 9, bocaC: 0, bocaO: 12, gota: 0.6 };
  XP.v3g_mirada = { ...N, abre: 0.8, pupila: 3.1, parpado: 0.5, ceja: -4, cejaY: 3, bocaW: 6, bocaC: -0.6 };
  XP.v3g_sombra = { ...N, abre: 0, pupila: 0, ceja: 0, cejaY: 0, parpado: 0, bocaW: 0, bocaC: 0, bocaO: 0, gota: 0 };
  XP.v3g_serio = { ...N, ceja: 6, cejaY: 2, parpado: 0.3, bocaW: 7, bocaC: -1.5 };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type Pt = { x: number; y: number };

// ---------------------------------------------------------------- mejilla hinchada (cambia la silueta)
// k 0..1 = cuánto se hinchó; latido 0..1 = pulso rojo; calor 0..1 = ondas de calor que suben
export const MejillaV3: React.FC<{ j: Junta; k: number; f: number; latido?: number; calor?: number }> = ({ j, k, f, latido = 0, calor = 0 }) => {
  if (k <= 0.01) return null;
  const e = j.esc;
  const pul = 1 + 0.07 * latido * Math.max(0, Math.sin(f / 4.2));
  // el bulto sale por ABAJO y atrás de la mandíbula (muela de atrás): cambia la silueta sin tapar ojos ni boca
  const bx = j.cabeza.x + j.dir * 34 * e, by = j.cabeza.y + 22 * e;
  const rx = 30 * k * e * pul, ry = 32 * k * e * pul;
  const tinte = 0.35 + 0.25 * latido * Math.max(0, Math.sin(f / 4.2));
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={rx} ry={ry} fill="#17100d" />
      <ellipse cx={bx + j.dir * 6 * e} cy={by + 2 * e} rx={rx * 0.62} ry={ry * 0.62} fill="#a8322a" opacity={tinte * k} />
      <path d={`M${bx + j.dir * rx * 0.2},${by - ry * 0.75} q${j.dir * rx * 0.7},${ry * 0.3} ${j.dir * rx * 0.75},${ry * 0.9}`} stroke="#e8b0a0" strokeWidth={3 * e} fill="none" strokeLinecap="round" opacity={0.6 * k} />
      {calor > 0 && [0, 1, 2].map((i) => {
        const q = ((f / 22 + i / 3) % 1);
        const x0 = bx + j.dir * (rx + 8 * e) + (i - 1) * 10 * e;
        const y0 = by - q * 50 * e;
        return <path key={i} d={`M${x0},${y0} q${6 * e},${-7 * e} 0,${-14 * e} q${-6 * e},${-7 * e} 0,${-14 * e}`} stroke="#ff8a5a" strokeWidth={3.2 * e} fill="none" strokeLinecap="round" opacity={calor * Math.sin(q * Math.PI) * 0.9} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- la infección que baja por el cuerpo (P49)
// t1 mandíbula, t2 cuello, t3 pecho, t4 sangre (circula por brazos y piernas). rótulos anclados en el mundo
export const InfeccionV3: React.FC<{ j: Junta; f: number; t1: number; t2: number; t3: number; t4: number; rotX: number; rotY: number[]; tam?: number }> = ({ j, f, t1, t2, t3, t4, rotX, rotY, tam = 20 }) => {
  const e = j.esc;
  const mand: Pt = { x: j.cabeza.x + j.dir * 6 * e, y: j.cabeza.y + 46 * e };
  const cuello: Pt = { x: j.hombro.x + j.dir * 4 * e, y: j.hombro.y - 10 * e };
  const pecho: Pt = { x: lerp(j.hombro.x, j.cad.x, 0.32) + j.dir * 6 * e, y: lerp(j.hombro.y, j.cad.y, 0.32) };
  const seg = (a: Pt, b: Pt, t: number, w: number) => t > 0.01 ? (
    <g>
      <path d={`M${a.x},${a.y} L${lerp(a.x, b.x, t)},${lerp(a.y, b.y, t)}`} stroke="#ff3a2e" strokeWidth={w * 2.4} strokeLinecap="round" opacity={0.25} />
      <path d={`M${a.x},${a.y} L${lerp(a.x, b.x, t)},${lerp(a.y, b.y, t)}`} stroke="#ff4a3a" strokeWidth={w} strokeLinecap="round" />
    </g>
  ) : null;
  // venitas que salen del trazo
  const ramas = (a: Pt, b: Pt, t: number, s: number) => t < 0.2 ? null : [0.3, 0.55, 0.8].map((u, i) => {
    if (t < u) return null;
    const p = { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) };
    const lado = (i % 2 ? 1 : -1) * s;
    return <path key={i} d={`M${p.x},${p.y} q${lado * 10 * e},${4 * e} ${lado * 18 * e},${12 * e}`} stroke="#ff4a3a" strokeWidth={3 * e} fill="none" strokeLinecap="round" opacity={0.9} />;
  });
  const lat = 1 + 0.18 * Math.max(0, Math.sin(f / 3.4));
  // la sangre: puntos que viajan del pecho a las manos y a la cadera
  const viajes = [j.manoD, j.manoI, j.cad];
  const rot = (i: number, txt: string, o: number, ancla: Pt) => {
    if (o <= 0.01) return null;
    const w = txt.length * tam * 0.58 + tam * 1.4;
    const y = rotY[i];
    return (
      <g opacity={o}>
        <path d={`M${rotX - 6},${y - tam * 0.35} C${rotX - 40},${y - tam * 0.35} ${ancla.x + j.dir * 30},${ancla.y} ${ancla.x + j.dir * 8},${ancla.y}`} stroke="#ffb0a0" strokeWidth={2.4} fill="none" strokeDasharray="5 4" />
        <circle cx={ancla.x} cy={ancla.y} r={5 * e} fill="#ffb0a0" />
        <rect x={rotX} y={y - tam * 1.05} width={w} height={tam * 1.5} rx={tam * 0.75} fill="rgba(10,14,30,0.72)" stroke="#ff4a3a" strokeWidth={2.4} />
        <text x={rotX + w / 2} y={y} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={tam} fill="#f6ecd2">{txt}</text>
      </g>
    );
  };
  return (
    <g>
      {/* foco en la mandíbula */}
      {t1 > 0 && <circle cx={mand.x} cy={mand.y} r={(7 + 5 * t1) * e * lat} fill="#ff3a2e" opacity={0.9 * t1} />}
      {seg(mand, cuello, t2, 9 * e)}{ramas(mand, cuello, t2, j.dir)}
      {seg(cuello, pecho, t3, 9 * e)}{ramas(cuello, pecho, t3, -j.dir)}
      {t3 > 0.6 && <g transform={`translate(${pecho.x},${pecho.y}) scale(${e * lat * tr(t3, 0.6, 1)})`}><path d="M0,10 C-22,-6 -14,-24 0,-12 C14,-24 22,-6 0,10 Z" fill="#ff3a2e" /></g>}
      {t4 > 0 && viajes.map((b, i) => (
        <g key={i}>
          <path d={`M${pecho.x},${pecho.y} L${b.x},${b.y}`} stroke="#ff4a3a" strokeWidth={6 * e} strokeLinecap="round" opacity={0.55 * t4} />
          {[0, 1, 2, 3].map((q) => { const u = ((f / 18 + q / 4 + i * 0.13) % 1) * t4; return <circle key={q} cx={lerp(pecho.x, b.x, u)} cy={lerp(pecho.y, b.y, u)} r={5.5 * e} fill="#ff6a5a" opacity={t4} />; })}
        </g>
      ))}
      {rot(0, "1 · JAW", t1, mand)}
      {rot(1, "2 · NECK", t2 > 0.5 ? tr(t2, 0.5, 1) : 0, cuello)}
      {rot(2, "3 · BLOOD", t4, pecho)}
    </g>
  );
};

// ---------------------------------------------------------------- ventisca: nieve de costado, rayas de viento, ráfagas
// viento > 0 sopla hacia +x; px por cuadro. n copos en la caja x0..x0+w, y0..y0+h (mundo)
export const Ventisca: React.FC<{ f: number; x0: number; w: number; y0: number; h: number; n?: number; viento?: number; rayas?: number; rafagas?: number; o?: number; seed?: number; tam?: number }> = ({ f, x0, w, y0, h, n = 260, viento = -16, rayas = 40, rafagas = 3, o = 1, seed = 0, tam = 1 }) => {
  const r = (s: string) => { let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 100003; return (Math.sin(x * 12.9898 + seed * 7.1) * 43758.5453) % 1 + (Math.sin(x * 12.9898 + seed * 7.1) * 43758.5453 < 0 ? 1 : 0); };
  const md = (a: number, m: number) => ((a % m) + m) % m;
  const ang = Math.atan2(3.2, viento);
  return (
    <g opacity={o}>
      {Array.from({ length: n }).map((_, i) => {
        const v = 0.7 + r(`v${i}`) * 0.8;
        const x = x0 + md(r(`x${i}`) * w + f * viento * v, w);
        const y = y0 + md(r(`y${i}`) * h + f * 3.2 * v + Math.sin(f / 9 + i) * 10, h);
        const rr = (2 + r(`r${i}`) * 3.4) * tam;
        const lx = Math.cos(ang) * rr * 3.2, ly = Math.sin(ang) * rr * 3.2;
        return <path key={i} d={`M${x},${y} l${-lx},${-ly}`} stroke="#f4f6ff" strokeWidth={rr * 1.25} strokeLinecap="round" opacity={0.55 + 0.4 * r(`o${i}`)} />;
      })}
      {Array.from({ length: rayas }).map((_, i) => {
        const v = 1 + r(`rv${i}`) * 0.7;
        const L = 90 + r(`rl${i}`) * 160;
        const x = x0 + md(r(`rx${i}`) * w + f * viento * 1.7 * v, w);
        const y = y0 + md(r(`ry${i}`) * h + f * 2 * v, h);
        return <path key={`r${i}`} d={`M${x},${y} l${Math.sign(-viento) * L},${-L * 0.12}`} stroke="#dfe8ff" strokeWidth={2.2} strokeLinecap="round" opacity={0.28} />;
      })}
      {Array.from({ length: rafagas }).map((_, i) => {
        const per = 70 + i * 23;
        const q = md(f + i * 37, per) / per;
        const x = viento < 0 ? x0 + w - q * (w + 900) : x0 - 900 + q * (w + 900);
        const y = y0 + h * (0.35 + 0.5 * r(`gy${i}${Math.floor((f + i * 37) / per)}`));
        return <ellipse key={`g${i}`} cx={x} cy={y} rx={520} ry={26} fill="#e8eeff" opacity={0.07 * Math.sin(q * Math.PI)} />;
      })}
    </g>
  );
};

// cartel colgante que se sacude con el viento (x,y = el soporte en la pared)
export const CartelColgante: React.FC<{ x: number; y: number; f: number; txt: string; fuerza?: number; color?: string; fondo?: string; w?: number }> = ({ x, y, f, txt, fuerza = 1, color = "#f6ecd2", fondo = "#2f6a52", w = 170 }) => {
  const a = fuerza * (14 * Math.sin(f / 5.3) + 6 * Math.sin(f / 2.1));
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={w * 0.5 + 18} height={8} rx={3} fill="#2a2630" />
      <g transform={`rotate(${a} ${x + w * 0.5} ${y})`}>
        <path d={`M${x + w * 0.2},${y} V${y + 24} M${x + w * 0.8},${y} V${y + 24}`} stroke="#2a2630" strokeWidth={3} />
        <rect x={x} y={y + 24} width={w} height={54} rx={6} fill={fondo} stroke="#e8e2d8" strokeWidth={3} />
        <text x={x + w / 2} y={y + 62} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={30} fill={color}>{txt}</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- almanaque de pared (P46): 14 días que se tachan
export const CalendarioPared: React.FC<{ x: number; y: number; n: number; s?: number; mes?: string; inicio?: number; desde?: number }> = ({ x, y, n, s = 1, mes = "DECEMBER", inicio = 11, desde = 5 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-4} y={-14} width={8} height={14} rx={3} fill="#3a2a22" />
    <rect x={-92} y={0} width={184} height={176} rx={6} fill="#f2ece0" stroke="#bdb6a8" strokeWidth={3} />
    <rect x={-92} y={0} width={184} height={34} rx={6} fill="#c0352c" />
    <text x={0} y={25} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={20} fill="#fff">{mes}</text>
    {Array.from({ length: 21 }).map((_, i) => {
      const cx = -87 + (i % 7) * 25, cy = 48 + Math.floor(i / 7) * 40;
      const tach = i >= desde && i < desde + n;
      return (
        <g key={i}>
          <rect x={cx} y={cy} width={22} height={32} rx={3} fill="#fbf7ee" stroke="#d8d0c0" strokeWidth={1.5} />
          <text x={cx + 11} y={cy + 13} textAnchor="middle" fontFamily={F_MONO} fontWeight={700} fontSize={10} fill="#6a6258">{i + inicio}</text>
          {tach && <path d={`M${cx + 3},${cy + 5} L${cx + 19},${cy + 29} M${cx + 19},${cy + 5} L${cx + 3},${cy + 29}`} stroke="#c0352c" strokeWidth={3.4} strokeLinecap="round" />}
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- acostado bajo la frazada
// (x, y) = los pies en el colchón; cabeza hacia -x si cab = -1. La frazada tapa del pecho para abajo.
export const Durmiente: React.FC<{ pj: PjMProps; x: number; y: number; cab?: 1 | -1; frazada: string; f: number; respira?: number }> = ({ pj, x, y, cab = -1, frazada, f, respira = 1 }) => {
  const L = 300; // largo del cuerpo acostado
  const r = 2.2 * respira * Math.sin(f / 22);
  return (
    <g>
      <g transform={`translate(${x},${y}) rotate(${cab < 0 ? -90 : 90}) translate(${-x},${-y})`}>
        <PjM {...pj} ruta={[{ f: 0, x, y }]} dir={[{ f: 0, v: (cab < 0 ? 1 : -1) as 1 | -1 }]} poses={[{ f: 0, v: { hI: 4, cI: 6, hD: 8, cD: 10, pI: 0, rI: 0, pD: 0, rD: 0 } }]} />
      </g>
      {/* frazada: del pie hasta el hombro, con el bulto del cuerpo */}
      <path d={`M${x + cab * -18},${y + 6} Q${x + cab * 40},${y - 70 - r} ${x + cab * (L * 0.45)},${y - 64 - r} Q${x + cab * (L * 0.62)},${y - 74 - r} ${x + cab * (L * 0.7)},${y - 40} L${x + cab * (L * 0.72)},${y + 6} Z`} fill={frazada} />
      <path d={`M${x + cab * (L * 0.18)},${y - 52 - r} Q${x + cab * (L * 0.4)},${y - 40} ${x + cab * (L * 0.6)},${y - 58 - r}`} stroke="#000" strokeOpacity={0.18} strokeWidth={4} fill="none" />
    </g>
  );
};

// ---------------------------------------------------------------- sombra de un PjM en la pared
export const SOMBRA_LOOK = (l: PjMProps["look"]): PjMProps["look"] => ({ ...l, camisa: "#120c14", pantalon: "#120c14", zapatos: "#120c14", accesorios: (l.accesorios ?? []).map((a: any) => ({ ...a, color: "#120c14", vuelta: "#120c14" })) } as any);
export const SombraPj: React.FC<{ pj: PjMProps; ox: number; oy: number; s: number; o: number }> = ({ pj, ox, oy, s, o }) => {
  const p0 = pj.ruta[0];
  return (
    <g opacity={o} transform={`translate(${p0.x + ox},${(p0.y ?? 0) + oy}) scale(${s}) translate(${-p0.x},${-(p0.y ?? 0)})`}>
      <PjM {...pj} look={SOMBRA_LOOK(pj.look)} luz={undefined} mundo={undefined} atras={undefined} caras={[{ f: 0, v: "v3g_sombra" }]} habla={undefined} />
    </g>
  );
};

// ---------------------------------------------------------------- la charla entre dos bocas que se aplana
export const CuerdaVoz: React.FC<{ a: Pt; b: Pt; amp: number; f: number; o: number; corte?: number }> = ({ a, b, amp, f, o, corte = 0 }) => {
  if (o <= 0.01) return null;
  const n = 48;
  const L = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / L, uy = (b.y - a.y) / L;
  const pts = Array.from({ length: n + 1 }).map((_, i) => {
    const t = i / n;
    const env = Math.sin(t * Math.PI);
    const w = amp * env * (Math.sin(t * 26 - f * 0.5) * 18 + Math.sin(t * 61 + f * 0.9) * 8);
    return { x: a.x + ux * L * t - uy * w, y: a.y + uy * L * t + ux * w };
  });
  const medio = n / 2;
  const hueco = corte * 6;
  const d1 = pts.filter((_, i) => i <= medio - hueco).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const d2 = pts.filter((_, i) => i >= medio + hueco).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const col = amp > 0.35 ? AMBAR : "#cfc8e8";
  return (
    <g opacity={o}>
      <path d={d1} stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9} />
      <path d={d2} stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  );
};

// ---------------------------------------------------------------- inserto (pantalla): manos con manga frotando nieve
export const ManosNieve: React.FC<{ f: number; manga?: string; puno?: string; frota?: number; vapor?: number }> = ({ f, manga = "#2f7f86", puno = "#d9cdb2", frota = 1, vapor = 1 }) => {
  const t = Math.sin(f * 0.42) * frota;
  const cx = 960, cy = 600;
  const mD = { x: cx + 70 + 46 * t, y: cy + 10 - 10 * Math.abs(t) };
  const mI = { x: cx - 70 - 46 * t, y: cy + 16 + 8 * Math.abs(t) };
  const md = (a: number, m: number) => ((a % m) + m) % m;
  return (
    <g>
      {/* suelo nevado y huella */}
      <rect x={0} y={0} width={1920} height={1080} fill="#202a44" />
      <path d="M0,640 Q480,600 960,630 Q1440,660 1920,610 L1920,1080 L0,1080 Z" fill="#c6d0e2" />
      <ellipse cx={cx} cy={760} rx={300} ry={60} fill="#aab6cc" />
      {/* nieve cayendo cerca de la lente */}
      {Array.from({ length: 60 }).map((_, i) => { const x = md(i * 211 + f * (2 + (i % 5)), 1980) - 30; const y = md(i * 97 + f * (4 + (i % 4)), 1100) - 10; return <circle key={i} cx={x} cy={y} r={2 + (i % 4)} fill="#f4f6ff" opacity={0.8} />; })}
      {/* brazos (mangas) desde abajo */}
      <path d={`M${mI.x - 40},${mI.y + 40} L${cx - 560},1180`} stroke={manga} strokeWidth={130} strokeLinecap="round" />
      <path d={`M${mD.x + 40},${mD.y + 40} L${cx + 560},1180`} stroke={manga} strokeWidth={130} strokeLinecap="round" />
      <path d={`M${mI.x - 52},${mI.y + 4} L${mI.x - 8},${mI.y + 70}`} stroke={puno} strokeWidth={128} strokeLinecap="butt" />
      <path d={`M${mD.x + 52},${mD.y + 4} L${mD.x + 8},${mD.y + 70}`} stroke={puno} strokeWidth={128} strokeLinecap="butt" />
      {/* nieve entre las manos */}
      <ellipse cx={cx + 10 * t} cy={cy - 8} rx={96} ry={58} fill="#f4f6ff" />
      <ellipse cx={cx + 20 * t} cy={cy - 24} rx={60} ry={30} fill="#ffffff" />
      {/* manos (negras, como el elenco) */}
      <ellipse cx={mI.x} cy={mI.y} rx={74} ry={60} fill="#17100d" transform={`rotate(${-20 + 10 * t} ${mI.x} ${mI.y})`} />
      <ellipse cx={mD.x} cy={mD.y} rx={74} ry={60} fill="#17100d" transform={`rotate(${20 + 10 * t} ${mD.x} ${mD.y})`} />
      <ellipse cx={mI.x + 52} cy={mI.y - 30} rx={30} ry={18} fill="#17100d" transform={`rotate(-30 ${mI.x + 52} ${mI.y - 30})`} />
      <ellipse cx={mD.x - 52} cy={mD.y - 30} rx={30} ry={18} fill="#17100d" transform={`rotate(30 ${mD.x - 52} ${mD.y - 30})`} />
      {/* nieve que se desgrana y cae */}
      {Array.from({ length: 18 }).map((_, i) => { const q = md(f / 20 + i / 18, 1); const sx = (i % 2 ? 1 : -1) * (40 + (i * 13) % 90); return <circle key={`c${i}`} cx={cx + sx * (0.4 + q)} cy={cy + 40 + q * 150} r={5 + (i % 3) * 3} fill="#ffffff" opacity={1 - q} />; })}
      {/* vapor del aliento que entra por arriba */}
      {vapor > 0 && [0, 1, 2].map((i) => { const q = md(f / 40 + i / 3, 1); return <ellipse key={`v${i}`} cx={cx - 300 + q * 380} cy={160 - q * 40} rx={90 + q * 120} ry={34 + q * 30} fill="#eef2fa" opacity={0.35 * Math.sin(q * Math.PI) * vapor} />; })}
    </g>
  );
};

// ---------------------------------------------------------------- vela sobre una mesa (x, y = base)
export const VelaW: React.FC<{ x: number; y: number; f: number; alto?: number; luz?: number }> = ({ x, y, f, alto = 60, luz = 1 }) => (
  <g>
    <rect x={x - 22} y={y - 6} width={44} height={8} rx={4} fill="#b8a888" />
    <rect x={x - 8} y={y - alto} width={16} height={alto} fill="#f2ece0" />
    <path d={`M${x},${y - alto} q${-8 + Math.sin(f / 3)},-14 ${Math.sin(f / 4) * 2},-30 q8,16 0,30 Z`} fill="#ffd27a" />
    <Halo x={x} y={y - alto - 16} r={340} color="#ffcf6e" fuerza={0.6 * luz * (0.92 + 0.08 * Math.sin(f / 4))} />
  </g>
);

// velo oscuro (mundo): apaga un set encendido (súper sin luz)
export const VeloOscuro: React.FC<{ o: number; color?: string }> = ({ o, color = "#0b0d16" }) => <rect x={-3000} y={-3000} width={12000} height={9000} fill={color} opacity={o} />;

// ---------------------------------------------------------------- inserto (pantalla): el reloj radiocontrolado en la mano de Theo
// la mano con manga (naranja de Theo) sostiene el reloj; los arcos de la señal llegan desde arriba a la izquierda
export const RelojMano: React.FC<{ f: number; x: number; y: number; s?: number; senal: number; fecha?: string; hora?: string; manga?: string; puno?: string; giro?: number }> = ({ f, x, y, s = 1, senal, fecha = "DEC 19", hora = "7:41", manga = "#c8582b", puno = "#efe3c8", giro = 0 }) => {
  const recibe = senal > 0.5 && Math.floor(f / 10) % 2 === 0;
  return (
    <g transform={`translate(${x},${y}) rotate(${giro}) scale(${s})`}>
      {/* brazo desde abajo a la derecha */}
      <path d="M150,200 L620,760" stroke={manga} strokeWidth={170} strokeLinecap="round" />
      <path d="M118,168 L190,236" stroke={puno} strokeWidth={170} strokeLinecap="butt" />
      {/* reloj */}
      <g transform="rotate(-6)">
        <rect x={-250} y={-160} width={500} height={320} rx={30} fill="#e8e4dc" />
        <rect x={-222} y={-132} width={444} height={264} rx={16} fill={recibe ? "#2a3a2c" : "#1c2420"} />
        <text x={0} y={-22} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={116} fill="#bfe8c8">{hora}</text>
        <text x={0} y={92} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={70} fill={AMBAR}>{fecha}</text>
        {[0, 1, 2].map((k) => <path key={k} d={`M${168 + k * 14},${-106 - k * 10} q${16 + k * 8},${14 + k * 8} 0,${30 + k * 16}`} stroke="#bfe8c8" strokeWidth={5} fill="none" opacity={0.25 + 0.75 * (senal > 0.2 && Math.floor(f / 8) % 3 >= k ? 1 : 0)} />)}
        <text x={-200} y={-100} fontFamily={F_MONO} fontWeight={800} fontSize={22} fill="#bfe8c8" opacity={senal}>WWVB</text>
      </g>
      {/* mano que lo agarra: dedos encima del borde */}
      <ellipse cx={170} cy={120} rx={86} ry={70} fill="#17100d" transform="rotate(-30 170 120)" />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={210 - i * 34} cy={150 + i * 8} rx={26} ry={34} fill="#17100d" />)}
      <ellipse cx={226} cy={40} rx={30} ry={40} fill="#17100d" transform="rotate(20 226 40)" />
    </g>
  );
};
// arcos de la señal que entran por la esquina de arriba a la izquierda (pantalla)
export const SenalEntra: React.FC<{ f: number; x: number; y: number; o: number }> = ({ f, x, y, o }) => o <= 0.01 ? null : (
  <g opacity={o}>
    {[0, 1, 2, 3, 4].map((i) => {
      const q = ((f / 40 + i / 5) % 1);
      const r = 120 + (1 - q) * 900;
      return <path key={i} d={`M${x - r * 0.95},${y - r * 0.31} A${r},${r} 0 0 1 ${x - r * 0.31},${y - r * 0.95}`} stroke={AMBAR} strokeWidth={8} fill="none" opacity={Math.sin(q * Math.PI) * 0.85} strokeLinecap="round" />;
    })}
  </g>
);

// mini Theo en el mapa (P42): círculo con Theo sosteniendo el reloj, que titila cuando llega la onda
export { cl, interpolate };
