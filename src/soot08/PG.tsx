import React from "react";
import { AbsoluteFill } from "remotion";
import { C, ent, prog, Chip, Emote } from "./kit";
import { Moneda3 } from "./kit3";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, NINO, NINA, OBRERO, GenteFab } from "./mundo";
import { Gran, Sello, Tilde, Flash, sacudon, Velo, Horror, Latigo, Lista } from "./capas";
import { Retrato, Primer } from "./piezas";

// PARTE G · HORROR #6, EL ACCIDENTE (567,7-650,2 s). Piso 2 sin una sola valla: ejes, engranajes y correas a la altura
// de la cabeza de un chico → el pelo largo (sólo el mechón y el destello, nada de sangre; queda la cofia en el piso) →
// limpiar la máquina en marcha → «¿y después?»: sin paga, sin compensación, sin trabajo → la misma calle, ahora mendigando
// → Engels y el ejército que nunca salió del pueblo → 1844: las vallas bajan sobre los engranajes.
export const G0 = 567.7, G1 = 650.2;

const KG: K[] = [
  [567.7, 3300, -1500, 0.32], [570.4, 2600, -2450, 0.75], [574.2, 2550, -2420, 1.1], [578.9, 2400, -2330, 1.15], [582.4, 2400, -2300, 1.3], [586.8, 2420, -2290, 1.55], [588.3, 2420, -2290, 1.6], [591.3, 2500, -2380, 1.0],
  [591.4, 3550, -2380, 0.95], [594.0, 3600, -2330, 1.3], [599.3, 3620, -2300, 1.3], [610.7, 3600, -2300, 1.35],
  [610.71, -1500, -420, 0.95], [617.6, -1350, -420, 0.88], [624.8, 250, -300, 1.12], [634.5, 1450, -300, 1.12], [638.6, 2400, -480, 0.75],
  [638.61, 2500, -2450, 0.72], [646.9, 2500, -2450, 0.68], [650.2, 3300, -1500, 0.32],
];
const seg = (t: number) => (t < 610.71 ? "piso2" : t < 638.61 ? "calle" : "vallas");

// muleta: cuelga de la mano hasta el piso
const Muleta: React.FC = () => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
    <line x1={0} y1={-60} x2={6} y2={150} stroke="#8a5a2c" strokeWidth={10} strokeLinecap="round" />
    <line x1={-22} y1={-60} x2={22} y2={-60} stroke="#8a5a2c" strokeWidth={10} strokeLinecap="round" />
  </svg>
);
const Venda: React.FC = () => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
    <circle r={20} fill="#fffaf0" stroke="#2a1530" strokeWidth={4} /><path d="M -14 -6 L 14 -6 M -14 6 L 14 6" stroke="#d8cfc0" strokeWidth={4} />
  </svg>
);
const Gorra: React.FC = () => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
    <path d="M -30 0 Q 0 -26 30 0 Z" fill="#4a3f5c" /><rect x={-34} y={-4} width={68} height={8} rx={4} fill="#2e2a3a" />
  </svg>
);

export const PG: React.FC<{ t: number }> = ({ t }) => {
  const s = seg(t);
  const cam = camara(t, KG);
  const sh = sacudon(t, [588.0, 638.8]);
  const g2: GenteFab[] = [];
  if (s === "piso2") {
    if (t < 588.1) g2.push({ seed: 3, x: 2560, y: -2000, h: 280, ropa: NINA, gorro: "cofia", largo: true, flip: true, expr: t > 586.9 ? "miedo" : "neutro", inclina: t > 584.5 ? -22 * prog(t, 584.5, 585.4) : 0, bD: t > 584.6 ? 70 : 0, cD: 40 });
    g2.push({ seed: 7, x: 3620, y: -2000, h: 230, ropa: NINO, gorro: "gorra", flip: true, expr: t > 597 ? "miedo" : "triste", inclina: -18, bD: 80 + Math.sin(t * 9) * 14, cD: 30 });
    g2.push({ seed: 8, x: 4560, y: -2000, h: 240, ropa: NINA, gorro: "cofia", largo: true, expr: "triste", inclina: -14, bD: 70 + Math.sin(t * 8 + 1) * 12, cD: 30 });
  }
  if (s === "vallas") {
    g2.push({ seed: 3, x: 2700, y: -2000, h: 280, ropa: NINA, gorro: "cofia", largo: true, expr: t > 640.5 ? "feliz" : "neutro", mira: -1 });
    g2.push({ seed: 7, x: 3100, y: -2000, h: 240, ropa: NINO, gorro: "gorra", expr: t > 640.5 ? "feliz" : "neutro", mira: -1 });
  }
  const gP: GenteFab[] = [];
  if (s === "calle") {
    // el chico mendigando frente a su casa y los obreros que pasan hacia la fábrica
    gP.push({ seed: 21, x: -1300, y: 0, h: 290, ropa: NINO, expr: "triste", bD: 60, cD: 30, mira: 1, bI: 40, cI: 110, manoI: <Venda /> });
    for (let i = 0; i < 4; i++) {
      const x0 = -2600 - i * 420 + (t - 610.7) * 210;
      gP.push({ seed: 30 + i, x: x0, y: 0, h: 480 + (i % 2) * 30, ropa: OBRERO(i), gorro: i % 2 ? "cofia" : "gorra", largo: i % 2 === 1, camina: 1.2, expr: "neutro" });
    }
    if (t > 624.8) {
      const heridos: [number, boolean, number][] = [[-200, true, 0], [250, false, 1], [700, true, 2], [1150, false, 3], [1600, true, 4], [2050, false, 5]];
      heridos.forEach(([hx, mul, i]) => gP.push({ seed: 50 + i, x: hx + Math.max(0, t - 625.4) * 115 + (mul ? 14 * Math.sin(t * 5 + i) : 0), y: mul ? -Math.abs(Math.sin(t * 5 + i)) * 12 : 0, camina: 0.7, h: 470 - (i % 3) * 60, ropa: OBRERO(i + 2), gorro: i % 3 === 0 ? "gorra" : i % 3 === 1 ? "cofia" : undefined, largo: i % 3 === 1, expr: "triste", aparece: 624.9 + i * 0.35, bD: mul ? 8 : 0, manoD: mul ? <Muleta /> : undefined, bI: mul ? 0 : 30, cI: mul ? 0 : 110, inclina: mul ? 6 + 5 * Math.sin(t * 5 + i) : 3 * Math.sin(t * 4 + i) }));
    }
  }
  const pelo = t > 586.8 && t < 588.1;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <CieloHora t={t} luz={1.7} />
      <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: -300 }}><Horizonte t={t} /></div></Espacio>
      <Espacio cam={cam}>
        <Pueblo t={t} e={{ abre: s === "calle" ? 0 : 1, hora: 11, luz: 1.8, gente: gP, porton: 1 }}
          adentro={{ gente2: g2, vallas: s === "vallas" ? prog(t, 638.9, 640.4) : 0, polvo: 0.8 }} />
        {/* el mechón de pelo que toca el eje */}
        {pelo && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            <path d={`M 2545 -2235 Q ${2510 - prog(t, 586.8, 587.6) * 30} ${-2290 + Math.sin(t * 30) * 10} ${2530 - prog(t, 586.8, 587.6) * 70} -2300`} stroke="#8a4b22" strokeWidth={14} fill="none" strokeLinecap="round" />
            <circle cx={2460} cy={-2300} r={30 + prog(t, 587.4, 588) * 50} fill="none" stroke={C.rojo} strokeWidth={8} opacity={1 - prog(t, 587.6, 588)} />
          </svg>
        )}
        {/* lo que queda: la cofia en el piso */}
        {s === "piso2" && t > 588.1 && t < 591.4 && (
          <svg style={{ position: "absolute", left: 2480, top: -2040, overflow: "visible", opacity: ent(t, 588.6) }} width={1} height={1}>
            <ellipse cx={0} cy={20} rx={46} ry={18} fill="#f4efe4" stroke="#2a1530" strokeWidth={5} />
            <path d="M -40 20 Q 0 -14 40 20" fill="#fffaf0" stroke="#2a1530" strokeWidth={5} />
          </svg>
        )}
        {/* la línea de la altura de la cabeza */}
        {s === "piso2" && t > 579 && t < 584.4 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: ent(t, 579) * (1 - prog(t, 584, 584.4)) }} width={1} height={1}>
            <line x1={1850} y1={-2250} x2={2900} y2={-2250} stroke={C.oro} strokeWidth={10} strokeDasharray="34 20" strokeDashoffset={-t * 80} />
          </svg>
        )}
        {/* la gorra en el piso con monedas, junto al chico que pide */}
        {s === "calle" && t < 625 && (
          <div style={{ position: "absolute", left: -1150, top: -6 }}><Gorra /></div>
        )}
      </Espacio>

      {/* ── capas de pantalla ── */}
      <Latigo t={t} at={[567.75, 591.35, 610.71, 638.61]} />
      <Horror t={t} t0={567.75} n={6} nombre="THE ACCIDENT" t1={570.2} />
      <Chip t={t} t0={570.5} t1={574.0} text="1830s · ALMOST NOTHING FENCED OFF" color={C.noche} x={960} y={150} centro size={62} />
      <Chip t={t} t0={574.3} t1={576.0} text="WHEELS" color={C.violeta} x={480} y={940} centro size={64} />
      <Chip t={t} t0={575.2} t1={578.7} text="GEARS" color={C.rojo} x={960} y={940} centro size={64} />
      <Chip t={t} t0={576.4} t1={578.7} text="BELTS FROM THE CEILING" color={C.noche} x={1440} y={940} centro size={58} />
      <Chip t={t} t0={579.0} t1={582.2} text="RIGHT AT A CHILD'S HEAD HEIGHT" color={C.oro} tinta={C.noche} x={960} y={150} centro size={64} />
      <Chip t={t} t0={582.5} t1={586.6} text="LONG HAIR" color={C.rojo} x={960} y={150} centro size={80} />
      <Chip t={t} t0={584.6} t1={586.6} text="SHE LEANS OVER TO FIX A THREAD" color={C.noche} x={960} y={950} centro size={58} />
      <Flash t={t} at={[588.0]} />
      <Velo t={t} t0={588.05} t1={591.2} op={0.55} />
      <Gran t={t} t0={588.15} t1={591.2} text="LESS THAN A SECOND" y={540} size={130} color={C.crema} />
      <Lista t={t} t0={591.5} t1={598.9} x={90} y={170} titulo="NEXT IN LINE…" size={56} items={[{ txt: "SLEEVES", t0: 591.6, ok: false }, { txt: "APRONS", t0: 592.3, ok: false }, { txt: "FINGERS", t0: 593.0, ok: false }]} />
      <Chip t={t} t0={594.1} t1={598.9} text="CLEANING MACHINES · STILL RUNNING" color={C.rojo} x={1250} y={950} centro size={58} />
      <Gran t={t} t0={599.35} t1={600.2} text="AND THEN WHAT?" y={540} size={130} color={C.ambar} />
      <Lista t={t} t0={600.25} t1={607.7} x={110} y={200} titulo="IF YOU GOT HURT" size={70} items={[{ txt: "NO SICK PAY", t0: 600.3, ok: false }, { txt: "NO COMPENSATION", t0: 601.7, ok: false }, { txt: "NO JOB", t0: 606.0, ok: false }]} />
      <Primer t={t} t0={600.4} t1={610.6} lado="der" g={{ expr: "triste", bI: 40, cI: 110, manoI: <Venda /> }} emo="lagrimas" />
      <Chip t={t} t0={607.9} t1={610.6} text="SOME OWNERS PAID THE DOCTOR" color={C.lima} tinta={C.noche} x={960} y={330} centro size={60} />
      <Tilde t={t} t0={608.2} t1={610.6} x={1460} y={330} s={0.7} />
      <Chip t={t} t0={609.95} t1={610.6} text="MANY DID NOT" color={C.rojo} x={960} y={470} centro size={70} />
      <Chip t={t} t0={610.9} t1={614.5} text="LOST A HAND AT 10 → BEGGING FOR LIFE" color={C.rojo} x={960} y={170} centro size={58} />
      <Chip t={t} t0={614.7} t1={617.5} text="ON THE STREET HE WALKED TO WORK" color={C.noche} x={960} y={170} centro size={60} />
      {t > 611.5 && t < 617.5 && [0, 1, 2].map((i) => <Moneda3 key={i} t={t} t0={612 + i * 1.6} t1={617.3} x={960 + (-1150 - cam.x) * cam.z + i * 30 - 30} y={540 + (-50 - cam.y) * cam.z - 180 + Math.min(1, (t - 612 - i * 1.6) * 3) * 150} s={0.35} />)}
      <Retrato t={t} t0={617.8} t1={624.6} x={1480} y={460} g={{ seed: 92, ropa: OBRERO(5), gorro: "copa", barba: true, expr: "neutro" }} nombre="FRIEDRICH ENGELS" sub="MANCHESTER · 1840s" s={0.9} />
      <Chip t={t} t0={618.0} t1={624.6} text="WORKING IN HIS FATHER'S COTTON BUSINESS" color={C.violeta} x={760} y={150} centro size={52} />
      {/* el cuerpo: cada parte perdida se marca en rojo */}
      {t > 625.0 && t < 629.7 && (() => { const e = ent(t, 625.05) * (1 - prog(t, 629.4, 629.7)); const on = (i: number) => (t > 625.6 + i * 0.85 ? C.rojo : "#fff6dc"); return (
        <svg style={{ position: "absolute", left: 1560, top: 300, overflow: "visible", transform: `scale(${e})`, transformOrigin: "120px 300px" }} width={1} height={1}>
          <rect x={-60} y={-40} width={360} height={660} rx={30} fill="#2a1530" opacity={0.85} />
          <circle cx={120} cy={60} r={52} fill="#fff6dc" stroke="#fff" strokeWidth={4} />
          <rect x={70} y={120} width={100} height={200} rx={30} fill="#fff6dc" />
          <rect x={20} y={130} width={44} height={170} rx={20} fill={on(2)} /><rect x={176} y={130} width={44} height={170} rx={20} fill={on(2)} />
          <circle cx={42} cy={318} r={26} fill={on(1)} /><circle cx={198} cy={318} r={26} fill={on(1)} />
          <circle cx={30} cy={352} r={11} fill={on(0)} /><circle cx={54} cy={356} r={11} fill={on(0)} /><circle cx={186} cy={356} r={11} fill={on(0)} /><circle cx={210} cy={352} r={11} fill={on(0)} />
          <rect x={74} y={330} width={42} height={230} rx={20} fill={on(3)} /><rect x={124} y={330} width={42} height={230} rx={20} fill={on(3)} />
        </svg>); })()}
      {["FINGERS", "HANDS", "ARMS", "LEGS"].map((w, i) => <Chip key={w} t={t} t0={625.6 + i * 0.85} t1={629.5} text={`MISSING ${w}`} color={i % 2 ? C.noche : C.rojo} x={260 + i * 390} y={150} centro size={34} />)}
      <Gran t={t} t0={629.8} t1={634.4} text="AN ARMY BACK FROM A WAR" y={180} size={110} color={C.crema} />
      <Chip t={t} t0={634.6} t1={636.8} text="EXCEPT THIS ARMY NEVER LEFT TOWN" color={C.noche} x={960} y={150} centro size={62} />
      <Gran t={t} t0={637.0} t1={638.5} text="IT HAD JUST GONE TO WORK" y={180} size={110} color={C.ambar} />
      <Sello t={t} t0={639.4} t1={646.7} text="1844 · FENCE THE MACHINES" x={960} y={270} size={84} color={C.lima} rot={-4} />
      <Chip t={t} t0={642.4} t1={646.7} text="NO CHILD CLEANS A MOVING MACHINE" color={C.noche} x={960} y={950} centro size={60} />
      <Gran t={t} t0={646.95} t1={647.9} text="THINK ABOUT THAT." y={540} size={130} color={C.crema} />
      <Chip t={t} t0={647.95} t1={650.0} text="SOMEBODY HAD TO WRITE IT INTO LAW" color={C.rojo} x={960} y={540} centro size={70} />
      {s === "calle" && t > 625 && t < 638.5 && <Emote t={t} t0={625} tipo="lagrimas" x={960 + (250 - cam.x) * cam.z} y={540 + (-400 - cam.y) * cam.z} />}
    </AbsoluteFill>
  );
};
