import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import type { Parte } from "./parte";
import { Svg, Ballenero, Bote, Cachalote, Isla, Galleta, Barril, Pajitas, Pistola, Splash, Gaviota } from "./kit3";
import { CartelTrampa, Titulo, MapaPacifico, Fila, Cuenta } from "./hud";
import { Persona, CAPITAN, MARINO } from "./persona";
import { Tripulacion, Marino, XMARINO } from "./reparto";
import { EnBarco, CUBIERTA } from "./estado";

// 660-803.5 s · TRAMPA 7: EL ESSEX. Una zona propia del océano (nuestro barco no se dibuja): el Essex sale con
// 21 hombres, 15 meses después la ballena lo mira, embiste dos veces y el barco se hunde. Tres botes, el mapa
// (la decisión de no ir a las Marquesas), la isla Henderson, el hambre, y el bote de Pollard: las pajitas, Owen
// Coffin. La violencia sólo se insinúa (la cámara sube a la luna antes del disparo). Cierra con 8 de 20.
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const pz = (t: number, ks: [number, number][]) => interpolate(t, ks.map((k) => k[0]), ks.map((k) => k[1]), cl);
const XE = 72000; // el Essex
const XH = 77000; // isla Henderson
const XB = XH + 4200; // primer plano del bote de Pollard
const S = 1.1; // escala de la ballena

const roto = (t: number) => pz(t, [[713.7, 0], [728, 0.7]]);
const golpe = (t: number) => {
  const g = (a: number) => (t > a && t < a + 1.2 ? Math.sin((t - a) * 70) * 26 * (1 - (t - a) / 1.2) : 0);
  return g(702.5) + g(709.75);
};
// la ballena del Essex
const ballena = (t: number) => {
  if (t < 684.6 || t > 714) return null;
  if (t < 705.2) {
    const x = pz(t, [[695.6, XE + 3600], [699.5, XE + 2800], [701.5, XE + 2100], [702.5, XE + 1700], [703.6, XE + 1950], [705.2, XE + 1900]]);
    return { x, y: pz(t, [[702.5, 60], [705.2, 130]]), flip: true, rot: 0, nada: t < 695.6 ? 0.25 : t < 702.5 ? 1.6 : 0.8 };
  }
  if (t < 707.6) return { x: pz(t, [[705.2, XE + 1900], [707.6, XE - 2700]]), y: pz(t, [[705.2, 130], [706.2, 520]]), flip: true, rot: pz(t, [[705.2, -14], [706.2, 0]]), nada: 1.6 };
  if (t < 708.3) return { x: XE - 2850, y: 520, flip: t > 707.95, rot: 0, nada: 1 };
  if (t < 709.75) return { x: pz(t, [[708.3, XE - 2850], [709.75, XE - 100]]), y: pz(t, [[708.3, 520], [709.0, 470], [709.75, 330]]), flip: false, rot: pz(t, [[709.0, 0], [709.75, -18]]), nada: 1.8 };
  return { x: pz(t, [[709.75, XE - 100], [710.6, XE - 40], [713.6, XE + 4200]]), y: pz(t, [[710.6, 330], [713.6, 90]]), flip: false, rot: pz(t, [[709.75, -18], [711, 0]]), nada: 1.2 };
};
// los tres botes
const BOTES = [-1600, -900, -200];
const boteX = (t: number, k: number) => {
  if (t < 749.3) return XE - 470 + 390 * k + (BOTES[k] - (-470 + 390 * k)) * prog(t, 716.6, 719.4) - (t - 719.4 > 0 ? (t - 719.4) * 18 : 0);
  if (t < 755.2) return XH - 820 + k * 240;
  return XH - 820 + k * 240 + (t - 755.2) * 210 + k * 60 * prog(t, 755.2, 760);
};
const boteY = (t: number) => (t < 716.6 ? -300 : t < 717.4 ? pz(t, [[716.6, -300], [717.4, 30]]) : t > 749.3 && t < 755.2 ? -14 : 30);

const Burbuja: React.FC<{ t: number; t0: number; t1: number; x: number; y: number; text: string }> = ({ t, t0, t1, x, y, text }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const e = ent(t, t0) * interpolate(t, [t1, t1 + 0.25], [1, 0], cl);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${e})`, transformOrigin: "50% 100%", background: "#fff", border: "6px solid #2a1530", borderRadius: 28, padding: "14px 30px", fontFamily, fontWeight: 700, fontSize: 52, color: "#2a1530", whiteSpace: "nowrap" }}>
      {text}
      <div style={{ position: "absolute", left: "50%", bottom: -30, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: "30px solid #2a1530", transform: "translateX(-50%)" }} />
    </div>
  );
};
const Tortuga: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <Svg x={x} y={y} s={s} rot={Math.sin(t * 2 + x) * 4}>
    <ellipse cx={0} cy={0} rx={46} ry={30} fill="#5a8a3a" stroke="#2e4a1e" strokeWidth={5} />
    <path d="M -24 -10 L 0 -22 L 24 -10 M -30 8 L 30 8" stroke="#2e4a1e" strokeWidth={4} fill="none" />
    <circle cx={54} cy={-4} r={14} fill="#8ab05a" /><circle cx={58} cy={-8} r={3} fill="#1a1a1a" />
  </Svg>
);
const Medidor: React.FC<{ t: number; t0: number; t1: number; x: number; label: string; col: string }> = ({ t, t0, t1, x, label, col }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0) * interpolate(t, [t1, t1 + 0.3], [1, 0], cl);
  const v = 1 - prog(t, t0 + 0.3, t0 + 1.3);
  return (
    <div style={{ position: "absolute", left: x - 230, top: 250, width: 460, transform: `scale(${e})`, fontFamily, fontWeight: 700 }}>
      <div style={{ fontSize: 50, color: "#fff", textShadow: "0 5px 0 #2a1530", textAlign: "center" }}>{label}</div>
      <div style={{ marginTop: 10, height: 54, borderRadius: 27, background: "rgba(20,10,40,.6)", border: "6px solid #fff", overflow: "hidden" }}>
        <div style={{ width: `${v * 100}%`, height: "100%", background: v < 0.25 ? C.rojo : col }} />
      </div>
    </div>
  );
};

// primer plano del bote de Pollard: 4 hombres
const HOMBRES = [
  { dx: -430, seed: 11, ropa: CAPITAN, barba: "#3a2616" as string | undefined }, // Pollard
  { dx: -150, seed: 501, ropa: MARINO(2), barba: undefined }, // Owen Coffin
  { dx: 130, seed: 502, ropa: MARINO(5), barba: undefined },
  { dx: 400, seed: 503, ropa: MARINO(7), barba: "#4a3a2a" },
];

export const P7: Parte = {
  a: 660, b: 803.5,
  sinBarco: (t) => t < 803.5,
  keys: [
    { t: 660.6, x: 70400, y: 2700, z: 0.45 },
    { t: 662.6, x: 70900, y: 2450, z: 0.5 },
    { t: 664.8, x: XE - 100, y: -450, z: 0.42 },
    { t: 667.8, x: XE - 300, y: -450, z: 0.5 },
    { t: 668.4, x: XE - 420, y: -430, z: 0.85 },
    { t: 675.8, x: XE - 320, y: -430, z: 0.88 },
    { t: 677.6, x: XE, y: -300, z: 0.15 },
    { t: 684.0, x: XE + 300, y: -300, z: 0.17 },
    { t: 685.6, x: XE + 650, y: -480, z: 0.7 },
    { t: 687.4, x: XE + 700, y: -480, z: 0.72 },
    { t: 688.6, x: XE + 2000, y: -330, z: 0.38 },
    { t: 695.4, x: XE + 2100, y: -330, z: 0.4 },
    { t: 701.8, x: XE + 1400, y: -300, z: 0.45 },
    { t: 702.6, x: XE + 850, y: -300, z: 0.58, e: "o" },
    { t: 705.0, x: XE + 400, y: -360, z: 0.5 },
    { t: 707.6, x: XE - 900, y: 220, z: 0.34 },
    { t: 709.3, x: XE + 200, y: 0, z: 0.4 },
    { t: 710.2, x: XE + 650, y: -220, z: 0.56, e: "o" },
    { t: 713.5, x: XE + 300, y: -300, z: 0.45 },
    { t: 717.2, x: XE - 200, y: -320, z: 0.36 },
    { t: 719.2, x: XE - 900, y: -150, z: 0.5 },
    { t: 728.0, x: XE - 1000, y: -150, z: 0.53 },
    { t: 748.6, x: XE - 1300, y: -150, z: 0.5 },
    { t: 750.6, x: XH - 300, y: -260, z: 0.5 },
    { t: 755.0, x: XH - 100, y: -260, z: 0.52 },
    { t: 757.6, x: XH + 1100, y: -150, z: 0.55 },
    { t: 766.0, x: XH + 2700, y: -150, z: 0.6 },
    { t: 767.6, x: XB, y: -230, z: 0.95 },
    { t: 789.0, x: XB, y: -240, z: 1.05 },
    { t: 791.4, x: XB, y: -280, z: 1.1 },
    { t: 792.5, x: XB, y: -1300, z: 0.6, e: "i" },
    { t: 799.6, x: XB, y: -1350, z: 0.55 },
    { t: 803.4, x: XB, y: -800, z: 0.42 },
  ],
  pal: [[660, "abismo", 1], [663, "dia", 2.5], [676.4, "calma", 2.5], [702.6, "tormenta", 1], [713.7, "tarde", 3], [749, "tropico", 2], [756.8, "calma", 2], [761, "tarde", 2.5], [766, "noche", 3], [794, "manana", 3]],
  mundo: (t) => {
    const r = roto(t);
    const sh = golpe(t);
    const hunde = pz(t, [[720, 0], [728, 520]]);
    const b = ballena(t);
    const enBotes = t > 716.4;
    return (
      <>
        {/* la ballena que acecha en lo hondo (entrada) */}
        {t < 664 && <div style={{ position: "absolute", opacity: 0.85 }}><Cachalote x={69300 + (t - 659) * 420} y={3050} t={t} s={1.7} nada={0.6} /></div>}
        {/* el Essex */}
        {t > 661 && t < 749.5 && (
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${sh}px, ${hunde + Math.abs(sh) * 0.4}px)` }}>
            <Ballenero x={XE} y={0} t={t} velas={t < 713.7 ? 1 : 0.5} botes={enBotes ? [false, false, false] : [true, true, true]} roto={r} nombre="ESSEX" />
            <EnBarco t={t} x={XE} roto={r}>
              {t < 716.4 && <Tripulacion t={t} capitan sin={[0, ...(t > 703.9 ? [1, 3, 5, 7] : [])]} expr={() => (t > 695.6 ? "miedo" : t > 687.7 ? "sorpresa" : "neutro")} />}
              {t < 716.4 && (t < 684.6 || t > 703) && <Marino i={0} t={t} expr={t > 695.6 ? "miedo" : "neutro"} />}
              {t >= 684.6 && t <= 703 && <Marino i={0} t={t} x={700} expr={t > 687.7 ? "sorpresa" : "neutro"} flip={false} bD={t > 686 ? 150 : 10} />}
              {t > 703.9 && t < 716.4 && [1, 3, 5, 7].map((i, k) => <Marino key={i} i={i} t={t} x={XMARINO(i) + k * 20} y={CUBIERTA + 30} inclina={70 * (k % 2 ? 1 : -1) * prog(t, 703.95 + k * 0.12, 704.4 + k * 0.12)} expr="miedo" />)}
            </EnBarco>
          </div>
        )}
        {/* la ballena: quieta, mira, embiste, pasa por abajo, vuelve */}
        {b && (
          <>
            {t > 698 && t < 702.5 && [0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: b.x + 700 + k * 40, top: b.y - 160 + k * 70, width: 260 + (k % 2) * 140, height: 12, borderRadius: 6, background: "#fff", opacity: 0.7 }} />)}
            <Cachalote x={b.x} y={b.y} t={t} s={S} flip={b.flip} rot={b.rot} nada={b.nada} enojo={t > 695.6} chorro={t > 688 && t < 694 ? 1 : 0} />
          </>
        )}
        {[702.5, 709.75].map((a) => <React.Fragment key={a}>
          <Splash x={XE + 860} y={10} t={t} t0={a} s={2.4} />
          {t > a && t < a + 1.6 && Array.from({ length: 9 }, (_, k) => { const u = (t - a) / 1.6; return <Svg key={k} x={XE + 840 + Math.cos(k * 0.8) * 700 * u} y={-120 - Math.sin(k * 0.8 + 0.4) * 520 * u + 900 * u * u} rot={u * 400 + k * 40}><rect x={-40} y={-10} width={80} height={20} rx={4} fill="#7a4a26" /></Svg>; })}
        </React.Fragment>)}
        {/* los tres botes */}
        {t > 716.4 && t < 767.6 && BOTES.map((_, k) => {
          const x = boteX(t, k);
          const deriva = t > 756.8;
          return (
            <React.Fragment key={k}>
              <Bote x={x} y={boteY(t)} t={t} s={0.95} rema={deriva ? 0.15 : t > 749.3 && t < 755.2 ? 0 : 1} />
              {t > 725.4 && t < 756.8 && k === 1 && <Tortuga x={x + 120} y={boteY(t) - 70} t={t} s={0.7} />}
              {t > 723.5 && t < 756.8 && k === 0 && <Galleta x={x - 60} y={boteY(t) - 66} s={0.28} />}
              {t > 724.5 && t < 756.8 && k === 2 && <Barril x={x + 80} y={boteY(t) - 80} s={0.32} />}
            </React.Fragment>
          );
        })}
        {/* enterrados en el mar: un bulto envuelto que se desliza */}
        {t > 761.1 && t < 763.6 && <Svg x={boteX(t, 1) + 240 + prog(t, 761.6, 762.4) * 120} y={-40 + prog(t, 761.6, 762.6) * 120} rot={prog(t, 761.6, 762.4) * 50}><ellipse rx={70} ry={22} fill="#e8e2d0" stroke="#8a7a66" strokeWidth={4} /></Svg>}
        <Splash x={boteX(t, 1) + 380} y={20} t={t} t0={762.5} s={0.8} />
        {/* la isla Henderson */}
        {t > 747 && t < 768 && (
          <>
            <Isla x={XH} y={10} t={t} s={1.15} seed={9} />
            {t < 751.4 && [0, 1, 2, 3].map((k) => <Gaviota key={k} x={XH - 200 + k * 140} y={-260 - (k % 2) * 60} t={t + k} s={0.6} />)}
            {t < 751.8 && [0, 1, 2, 3, 4].map((k) => <Svg key={`h${k}`} x={XH - 300 + k * 110} y={-30} s={1 - prog(t, 751.2 + k * 0.1, 751.6 + k * 0.1)}><ellipse rx={16} ry={20} fill="#f4f0e8" stroke="#b8b0a0" strokeWidth={3} /></Svg>)}
            {t > 753.25 && [0, 1, 2].map((k) => <Persona key={k} x={XH + 120 + k * 120} y={-6} h={150} t={t} seed={520 + k} ropa={MARINO(k + 3)} casco="no" pantalon="#e8e2d0" expr="triste" bD={t > 755.2 ? 150 + Math.sin(t * 6 + k) * 30 : 10} aparece={753.3 + k * 0.2} />)}
          </>
        )}
        {/* primer plano: el bote de Pollard */}
        {t > 766.2 && (
          <>
            <div style={{ position: "absolute", left: XB - 1600, top: -1900, width: 3200, height: 3200, pointerEvents: "none" }}>
              <svg style={{ position: "absolute", left: 1600 - 160, top: 200, overflow: "visible" }} width={320} height={320}><circle cx={160} cy={160} r={150} fill="#f4f0d8" /><circle cx={110} cy={120} r={28} fill="#dcd6b8" /><circle cx={200} cy={200} r={20} fill="#dcd6b8" /></svg>
            </div>
            {HOMBRES.map((m, k) => {
              const foco = t > 779.6 && t < 790.6 ? (k === 1 ? 1 : 0.55) : 1;
              const ex = k === 1 && t > 779.6 ? "triste" : k === 0 && t > 787.4 && t < 789.3 ? "miedo" : t > 775.4 ? "miedo" : "triste";
              return <Persona key={k} x={XB + m.dx + (k === 0 && t > 787.4 ? 60 * prog(t, 787.4, 788) : 0)} y={60} h={300} t={t} seed={m.seed} ropa={m.ropa} casco={k === 0 ? "capitan" : "no"} barba={m.barba} pantalon="#3a3440" expr={ex} flip={k > 1} mira={0.5} opacity={foco} bD={k === 0 && t > 775.4 && t < 780 ? 110 : 10} />;
            })}
            <Svg x={XB} y={40} s={2.4}>
              <path d="M -250 -40 Q -270 -70 -280 -84 Q -150 -46 0 -44 Q 150 -46 280 -84 Q 270 -70 250 -40 Q 160 30 0 34 Q -160 30 -250 -40 Z" fill="#e8e2d0" stroke="#7a6a56" strokeWidth={5} />
              <path d="M -262 -54 Q 0 -30 262 -54" stroke="#3a6ab0" strokeWidth={8} fill="none" />
              {[-160, -40, 80, 190].map((d, i) => <path key={i} d={`M ${d} -40 l 16 40`} stroke="#b8ac96" strokeWidth={3} />)}
            </Svg>
            {t > 775.4 && t < 781.4 && <Pajitas x={XB - 290} y={-50} s={0.7} saca={prog(t, 779.0, 779.6)} />}
            <Burbuja t={t} t0={787.4} t1={789.2} x={XB - 370} y={-360} text="TAKE ME INSTEAD." />
            <Burbuja t={t} t0={789.3} t1={790.5} x={XB - 150} y={-360} text="NO." />
            {t > 790.65 && t < 792.8 && <Pistola x={XB + 220} y={-110} s={0.5} rot={28} humo={t > 792.55 ? 1 : 0} />}
          </>
        )}
      </>
    );
  },
  hud: (t) => (
    <>
      <CartelTrampa t={t} t0={660.5} t1={662.8} n={7} nombre="THE ESSEX" />
      <Titulo t={t} t0={662.9} t1={664.9} text="AUGUST 1819" y={200} size={140} color={C.crema} />
      <Chip t={t} t0={665.0} t1={667.9} text="LEAVES NANTUCKET" color={C.violeta} x={960} y={140} centro size={56} />
      <Cuenta t={t} t0={665.2} t1={666.6} t2={667.9} de={0} a={21} x={960} y={330} size={130} color={C.crema} suf=" MEN" />
      <Chip t={t} t0={668.0} t1={676.2} text="CAPT. GEORGE POLLARD · 28" color={C.ambar} tinta={C.noche} x={540} y={140} centro size={48} />
      <Chip t={t} t0={670.4} t1={676.2} text="FIRST MATE OWEN CHASE · 23" color={C.teal} tinta={C.noche} x={1380} y={140} centro size={48} />
      <Chip t={t} t0={672.6} t1={676.2} text="SOME OF THE CREW: TEENAGERS" color={C.rojo} x={960} y={250} centro size={48} />
      <Titulo t={t} t0={676.4} t1={679.5} text="15 MONTHS LATER" y={200} size={130} color={C.crema} />
      <Chip t={t} t0={679.6} t1={684.6} text="NOVEMBER 20, 1820" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={680.6} t1={684.6} text="3,000+ KM FROM THE NEAREST COAST" color={C.rojo} x={960} y={250} centro size={50} />
      <Chip t={t} t0={684.8} t1={687.6} text="THEN CHASE SEES SOMETHING NEW" color={C.violeta} x={960} y={140} centro size={54} />
      <Chip t={t} t0={687.7} t1={695.4} text="A SPERM WHALE · ~26 M (HE CLAIMED)" color={C.teal} tinta={C.noche} x={960} y={140} centro size={52} />
      <Chip t={t} t0={690.4} t1={695.4} text="LYING STILL · LOOKING AT THE SHIP" color="#5a5e6a" x={960} y={250} centro size={48} />
      <Chip t={t} t0={695.6} t1={702.4} text="STRAIGHT AT THE ESSEX" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={698.4} t1={702.4} text="FASTER · FASTER" color={C.ambar} tinta={C.noche} x={960} y={250} centro size={52} />
      <Chip t={t} t0={702.6} t1={703.9} text="THE ESSEX SHUDDERS" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={703.97} t1={705.1} text="MEN FALL DOWN" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={705.2} t1={709.6} text="IT TURNS AROUND… AND COMES BACK" color={C.violeta} x={960} y={140} centro size={54} />
      <Chip t={t} t0={709.75} t1={713.6} text="SECOND HIT · RIGHT IN THE BOW" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={713.7} t1={715.3} text="THE ESSEX BEGINS TO SINK" color="#5a5e6a" x={960} y={140} centro size={58} />
      <Titulo t={t} t0={715.4} t1={718.7} text="A WHALE ATTACKED A WHALE SHIP" y={190} size={96} color={C.crema} />
      <Chip t={t} t0={716.6} t1={718.7} text="ON PURPOSE" color={C.rojo} x={960} y={330} centro size={64} />
      <Chip t={t} t0={718.9} t1={728.1} text="20 MEN · 3 SMALL BOATS" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={720.6} t1={723.3} text="THE LARGEST OCEAN ON EARTH" color={C.teal} tinta={C.noche} x={960} y={250} centro size={50} />
      <Chip t={t} t0={723.5} t1={728.1} text="HARDTACK" color={C.tierra} x={520} y={250} centro size={48} />
      <Chip t={t} t0={724.5} t1={728.1} text="SOME WATER" color={C.teal} tinta={C.noche} x={960} y={250} centro size={48} />
      <Chip t={t} t0={725.5} t1={728.1} text="A FEW TURTLES" color={C.lima} tinta={C.noche} x={1400} y={250} centro size={48} />
      <MapaPacifico t={t} t0={728.3} t1={749.0} tMarq={728.8} tRuta={738.8} tIsla={747.5} />
      <Chip t={t} t0={733.0} t1={736.9} text="RUMOR: THE ISLANDERS EAT VISITORS" color={C.rojo} x={960} y={1010} centro size={46} />
      <Chip t={t} t0={737.0} t1={747.0} text="THE DECISION: SAIL THE OTHER WAY" color={C.violeta} x={960} y={1010} centro size={46} />
      <Chip t={t} t0={747.1} t1={749.0} text="THAT DECISION IS THE WHOLE TRAGEDY" color={C.rojo} x={960} y={1010} centro size={46} />
      <Chip t={t} t0={749.3} t1={753.1} text="A TINY ISLAND · ONE WEEK" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={751.2} t1={753.1} text="THEY ATE EVERYTHING ON IT" color={C.ambar} tinta={C.noche} x={960} y={250} centro size={50} />
      <Chip t={t} t0={753.25} t1={755.1} text="3 MEN STAYED BEHIND" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={755.2} t1={756.7} text="THE REST WENT BACK TO SEA" color="#5a5e6a" x={960} y={140} centro size={56} />
      <Medidor t={t} t0={756.8} t1={761.0} x={640} label="FOOD" col={C.ambar} />
      <Medidor t={t} t0={758.3} t1={761.0} x={1280} label="WATER" col={C.teal} />
      <Chip t={t} t0={759.3} t1={761.0} text="THEN THE MEN BEGAN TO DIE" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={761.1} t1={764.1} text="AT FIRST: BURIED AT SEA" color="#5a5e6a" x={960} y={140} centro size={56} />
      <Chip t={t} t0={764.2} t1={766.1} text="THEN THEY STOPPED" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={766.2} t1={771.7} text="FEBRUARY · POLLARD'S BOAT" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={767.8} t1={771.7} text="4 STARVING MEN · NOTHING TO EAT" color={C.rojo} x={960} y={250} centro size={48} />
      <Chip t={t} t0={771.9} t1={775.3} text="WHAT SAILORS WHISPERED ABOUT FOR CENTURIES" color="#5a5e6a" x={960} y={140} centro size={46} />
      <Titulo t={t} t0={775.4} t1={776.5} text="THEY DREW LOTS" y={190} size={130} color={C.crema} />
      <Chip t={t} t0={776.6} t1={779.5} text="SHORT STRAW: KILLED TO FEED THE OTHERS" color={C.rojo} x={960} y={140} centro size={48} />
      <Titulo t={t} t0={779.6} t1={781.3} text="OWEN COFFIN" y={190} size={140} color={C.crema} />
      <Titulo t={t} t0={781.4} t1={782.7} text="HE WAS 18" y={190} size={150} color={C.rojo} />
      <Chip t={t} t0={782.8} t1={787.2} text="THE CAPTAIN'S OWN COUSIN" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={784.6} t1={787.2} text="POLLARD PROMISED HIS MOTHER" color={C.ambar} tinta={C.noche} x={960} y={250} centro size={48} />
      <Chip t={t} t0={790.65} t1={792.4} text="ANOTHER YOUNG MAN · CHOSEN BY LOT" color="#5a5e6a" x={960} y={140} centro size={50} />
      {t > 792.55 && t < 793.1 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(t, [792.55, 793.1], [0.9, 0], cl) }} />}
      <MapaPacifico t={t} t0={794.1} t1={799.6} tRuta={780} tIsla={0} tRescate={795.4} />
      <Chip t={t} t0={794.4} t1={799.6} text="~90 DAYS LATER · RESCUED" color={C.lima} tinta={C.noche} x={960} y={1010} centro size={50} />
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(t, [803.0, 803.5], [1, 0], cl) }}>
        <Titulo t={t} t0={799.85} t1={803.2} text="8 OF 20 SURVIVED" y={260} size={130} color={C.crema} />
        <Fila t={t} t0={800.0} n={20} vivos={8} tMuere={800.9} y={700} />
      </div>
      {t > 687.8 && t < 690 && <Emote t={t} t0={687.8} tipo="excl" x={1000} y={360} s={1.4} />}
    </>
  ),
};
