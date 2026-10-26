import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, Chip, Zzz, fontFamily } from "./kit";
import { Correa, Rodillo, Carro, Rosbif, Pudin, RelojBolsillo, Reloj } from "./kit3";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, NINO, NINA, CAPATAZ, OBRERO, GenteFab } from "./mundo";
import { Gran, Sello, Tachado, Flash, sacudon, Velo, Horror, Latigo, Lista } from "./capas";
import { Primer, Retrato, Girado } from "./piezas";
import { V } from "./kit3";
import { Persona } from "./persona";

// PARTE F · HORROR #5, LA CORREA (473,5-567,7 s). El capataz que cobra por producción → la hora 12, los ojos que se
// cierran → la correa, el billy roller, la cisterna de agua fría (piso 2) → los aprendices huérfanos que llegan en carro
// por la calle → Robert Blincoe: las promesas tachadas, los chanchos, el libro, colgado de las muñecas (sólo silueta)
// → «ninguna ley decía que no».
export const F0 = 473.5, F1 = 567.7;

const KF: K[] = [
  [473.5, 3300, -1500, 0.32], [475.8, 3500, -450, 0.8], [482.8, 3150, -420, 1.0], [488.0, 2750, -360, 1.3], [493.1, 2780, -380, 1.5], [494.3, 2950, -430, 1.3], [507.8, 2950, -430, 1.35], [512.8, 2950, -430, 1.4],
  [512.81, 5800, -2420, 1.15], [521.2, 5780, -2420, 1.2],
  [521.21, -2700, -330, 1.0], [527.5, -150, -330, 0.95], [533.1, 2450, -340, 1.0],
  [533.11, 3000, -420, 1.0], [563.5, 3300, -420, 1.05], [567.7, 3300, -700, 0.6],
];
const seg = (t: number) => (t < 512.81 ? "piso0" : t < 521.21 ? "cisterna" : t < 533.11 ? "calle" : "blincoe");

// chanchito plano
const Chancho: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <svg style={{ position: "absolute", left: x - 160 * s, top: y - 120 * s, overflow: "visible" }} width={320 * s} height={240 * s} viewBox="-160 -120 320 240">
    <ellipse cx={0} cy={10} rx={130} ry={80} fill="#f2a7b8" stroke="#2a1530" strokeWidth={8} />
    <ellipse cx={120} cy={0} rx={40} ry={34} fill="#f2a7b8" stroke="#2a1530" strokeWidth={8} />
    <ellipse cx={150} cy={4} rx={16} ry={20} fill="#e08aa0" /><circle cx={146} cy={-2} r={4} fill="#2a1530" /><circle cx={154} cy={10} r={4} fill="#2a1530" />
    <circle cx={108} cy={-14} r={7} fill="#2a1530" />
    <path d="M 90 -40 L 110 -70 L 120 -36 Z" fill="#e08aa0" stroke="#2a1530" strokeWidth={6} />
    {[-80, -30, 30, 80].map((lx, i) => <rect key={lx} x={lx - 10} y={70} width={20} height={42 + Math.sin(t * 6 + i) * 4} fill="#e08aa0" stroke="#2a1530" strokeWidth={6} />)}
    <path d={`M -130 0 q -30 ${-20 + Math.sin(t * 8) * 8} -20 -40`} stroke="#2a1530" strokeWidth={6} fill="none" />
  </svg>
);

export const PF: React.FC<{ t: number }> = ({ t }) => {
  const s = seg(t);
  const cam = camara(t, KF);
  const sh = sacudon(t, [496.8, 505.0, 514.6, 544.5]);
  const golpe = t > 496.6 && t < 497.2 ? Math.sin((t - 496.6) * Math.PI / 0.6) : 0;
  const g0: GenteFab[] = [];
  if (s === "piso0") {
    const capX = interpolate(t, [475.8, 481], [3900, 3250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const arma = t > 507.8 ? <Rodillo /> : t > 494.3 ? <Correa t={t} golpe={golpe} /> : undefined;
    g0.push({ seed: 40, x: capX, y: 0, h: 500, ropa: CAPATAZ, gorro: "gorra", barba: true, flip: true, camina: t < 481 ? 1.2 : 0, expr: t > 485 ? "enojado" : "neutro", bD: t > 494.3 ? (t > 496.4 && t < 497.3 ? 165 : 120) : 20, cD: 30, manoD: arma });
    g0.push({ seed: 2, x: 2780, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: t > 491.6 && t < 494.3 ? "dormido" : t > 494.3 ? "miedo" : "triste", ladea: t > 491.6 && t < 494.3 ? 14 : 0, mira: 1, bI: t > 496.5 && t < 499 ? 140 : 0, cI: 60 });
    g0.push({ seed: 3, x: 2350, y: 0, h: 280, ropa: NINA, gorro: "cofia", largo: true, expr: t > 500.9 ? "miedo" : "triste" });
  }
  // de fondo, mientras se cuenta lo de Blincoe: la sala sigue trabajando
  if (s === "blincoe") [2600, 3000, 3450, 3850].forEach((x, i) => g0.push({ seed: 120 + i, x, y: 0, h: 270 + (i % 2) * 30, ropa: i % 2 ? NINA : { ...NINO, tunica: "#8a8494", tunica2: "#5d5670" }, gorro: i % 2 ? "cofia" : "gorra", largo: i % 2 === 1, expr: "triste", bD: 110 + Math.sin(t * 3 + i) * 20, cD: 60, mira: i % 2 ? -1 : 1 }));
  const g2: GenteFab[] = [];
  if (s === "cisterna") {
    g2.push({ seed: 41, x: 6250, y: -2000, h: 500, ropa: CAPATAZ, gorro: "gorra", barba: true, flip: true, expr: "enojado", bD: 60 });
    const moj = t > 516.3;
    if (t < 513.9 || moj) g2.push({ seed: 2, x: moj ? 5560 - Math.max(0, t - 519.4) * 160 : 5580, y: -2000, h: 300, ropa: NINO, gorro: moj ? undefined : "gorra", expr: moj ? "sorpresa" : "miedo", bD: moj ? 30 : 0, cD: 120, bI: moj ? 30 : 0, cI: 120, camina: t > 519.4 ? 1.4 : 0, flip: t > 519.4 });
  }
  const gP: GenteFab[] = [];
  const carroX = interpolate(t, [521.3, 531.5], [-3600, 2300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <CieloHora t={t} luz={s === "calle" ? 1.4 : 1.7} />
      <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: -300 }}><Horizonte t={t} /></div></Espacio>
      <Espacio cam={cam}>
        <Pueblo t={t} e={{ abre: s === "calle" ? 0 : 1, hora: 18, luz: s === "calle" ? 1.6 : 1.8, gente: gP, porton: 1 }} adentro={{ gente: g0, gente2: g2, mulaU: undefined }} />
        {s === "cisterna" && t > 513.9 && t < 516.3 && (() => {
          const baja = prog(t, 513.9, 514.6), sube = prog(t, 515.9, 516.3);
          const fy = -2700 + 230 * baja - 230 * sube;
          return (
            <>
              <Girado t={t} rot={180} g={{ seed: 2, x: 5900 + Math.sin(t * 9) * 6 * (t > 514.6 ? 1 : 0), y: fy, h: 300, ropa: NINO, expr: "miedo", bD: 10, bI: -10, cD: 0, cI: 0 }} />
              <svg style={{ position: "absolute", left: 5620, top: -2380, overflow: "visible" }} width={560} height={380}>
                <rect x={0} y={0} width={560} height={380} fill={V.hierro} />
                <path d={`M 20 0 Q 150 ${-14 + Math.sin(t * 9) * 10} 280 0 T 540 0 L 540 20 L 20 20 Z`} fill="#7fd6ff" />
                {[80, 280, 480].map((x) => <rect key={x} x={x - 8} y={20} width={16} height={360} fill={V.hierro2} />)}
              </svg>
              {t > 514.6 && t < 515.9 && Array.from({ length: 5 }, (_, i) => { const k = (t * 1.6 + i / 5) % 1; return <circle key={`b${i}`} cx={5860 + (i * 23) % 90} cy={-2390 - k * 140} r={10 + (i % 3) * 4} fill="none" stroke="#bfefff" strokeWidth={5} opacity={1 - k} />; })}
            </>
          );
        })()}
        {s === "cisterna" && t > 514.5 && t < 515.9 && Array.from({ length: 16 }, (_, i) => { const k = prog(t, 514.5, 515.7); return <circle key={i} cx={5900 + Math.cos(i * 0.9) * 360 * k} cy={-2420 - Math.sin(k * Math.PI) * (220 + (i % 5) * 50) + k * 200} r={20} fill="#7fd6ff" />; })}
        {s === "cisterna" && t > 516.4 && Array.from({ length: 6 }, (_, i) => { const k = (t * 1.3 + i / 6) % 1; return <path key={i} transform={`translate(${5520 + (i * 27) % 130} ${-2260 + k * 240})`} d="M 0 -16 Q 10 0 0 8 Q -10 0 0 -16 Z" fill="#7fd6ff" opacity={1 - k} />; })}
        {s === "calle" && (
          <>
            <Carro t={t} x={carroX} y={0} s={1.1} rueda={t * 0.8} />
            {[0, 1, 2, 3, 4].map((i) => <Persona key={i} t={t} seed={80 + i} x={carroX - 300 + i * 150} y={-260} h={230 + (i % 2) * 20} ropa={i % 2 ? NINA : { ...NINO, tunica: "#8a8494", tunica2: "#5d5670" }} gorro={i % 2 ? "cofia" : undefined} largo={i % 2 === 1} expr={i === 2 ? "miedo" : "triste"} descalzo />)}
            <Persona t={t} seed={86} x={carroX + 520} y={0} h={500} ropa={OBRERO(3)} gorro="copa" camina={t < 531.5 ? 1.1 : 0} expr="neutro" />
          </>
        )}
      </Espacio>

      {/* ── capas de pantalla ── */}
      <Latigo t={t} at={[473.55, 512.81, 521.21, 533.11]} />
      <Horror t={t} t0={473.55} n={5} nombre="THE STRAP" t1={475.6} />
      <Chip t={t} t0={475.9} t1={478.1} text="THE OVERLOOKER" color={C.noche} x={960} y={150} centro size={80} />
      <Chip t={t} t0={478.3} t1={482.7} text="MACHINES RUNNING · CHILDREN WORKING" color={C.violeta} x={960} y={950} centro size={60} />
      <Chip t={t} t0={482.9} t1={487.9} text="PAID BY WHAT THE ROOM PRODUCES" color={C.oro} tinta={C.noche} x={960} y={150} centro size={62} />
      {/* medidor de producción que cae */}
      {t > 483 && t < 488 && (() => {
        const v = t < 485.3 ? 0.8 : 0.8 - prog(t, 485.3, 486.3) * 0.6;
        const a = -90 + v * 180;
        return (
          <svg style={{ position: "absolute", left: 1460, top: 300, overflow: "visible", transform: `scale(${ent(t, 483) * (1 - prog(t, 487.7, 488))})` }} width={360} height={240} viewBox="-180 -200 360 240">
            <path d="M -160 0 A 160 160 0 0 1 160 0 Z" fill="#fbf3dc" stroke="#2a1530" strokeWidth={10} />
            <path d="M -160 0 A 160 160 0 0 1 -80 -138" stroke={C.rojo} strokeWidth={26} fill="none" />
            <path d="M 80 -138 A 160 160 0 0 1 160 0" stroke={C.lima} strokeWidth={26} fill="none" />
            <line x1={0} y1={0} x2={0} y2={-130} stroke="#2a1530" strokeWidth={12} strokeLinecap="round" transform={`rotate(${a})`} />
            <circle r={18} fill="#2a1530" />
          </svg>
        );
      })()}
      <Chip t={t} t0={485.4} t1={487.9} text="YOU SLOW DOWN = HE LOSES MONEY" color={C.rojo} x={960} y={950} centro size={60} />
      <Chip t={t} t0={488.95} t1={490.2} text="YOU ARE 9" color={C.violeta} x={960} y={150} centro size={80} />
      {t > 490.3 && t < 494.2 && <div style={{ position: "absolute", left: 140, top: 120, transform: `scale(${ent(t, 490.3) * (1 - prog(t, 493.9, 494.2))})` }}><div style={{ position: "relative" }}><Reloj x={0} y={440} s={0.8} hora={17 + prog(t, 490.3, 491.3) * 0.98} /></div></div>}
      <Chip t={t} t0={490.35} t1={494.2} text="THE 12TH HOUR" color={C.noche} x={960} y={150} centro size={80} />
      {t > 491.8 && t < 494.3 && <div style={{ position: "absolute", left: 960 + (2780 - cam.x) * cam.z - 60, top: 540 + (-300 - cam.y) * cam.z - 160 }}><div style={{ position: "relative" }}><Zzz x={0} y={0} t={t} /></div></div>}
      <Gran t={t} t0={493.15} t1={494.3} text="WHAT DOES HE DO?" y={880} size={110} color={C.ambar} />
      <Chip t={t} t0={494.4} t1={497.8} text="SADLER COMMITTEE TESTIMONY" color={C.violeta} x={960} y={150} centro size={64} />
      <Flash t={t} at={[496.8, 514.6]} color="#ffe0e0" />
      <Chip t={t} t0={497.0} t1={500.8} text="A LEATHER STRAP · SOMETIMES WITH A BUCKLE" color={C.rojo} x={960} y={950} centro size={56} />
      <Lista t={t} t0={501.0} t1={507.7} x={90} y={160} titulo="BEATEN FOR…" size={58} items={[{ txt: "FALLING ASLEEP", t0: 501.9, ok: false }, { txt: "BEING SLOW", t0: 503.2, ok: false }, { txt: "A MISTAKE", t0: 504.5, ok: false }, { txt: "NOTHING AT ALL", t0: 505.9, ok: false }]} />
      <Gran t={t} t0={508.6} t1={512.7} text="THE BILLY ROLLER" y={180} size={120} color={C.ambar} />
      <Chip t={t} t0={510.0} t1={512.7} text="A HEAVY WOODEN ROD FROM THE MACHINES" color={C.noche} x={960} y={950} centro size={56} />
      <Chip t={t} t0={513.0} t1={517.5} text="HEAD FIRST · INTO COLD WATER" color={C.teal} tinta={C.noche} x={960} y={150} centro size={70} />
      <Chip t={t} t0={517.7} t1={521.2} text="TO WAKE THEM UP…" color={C.violeta} x={960} y={150} centro size={70} />
      <Chip t={t} t0={519.4} t1={521.2} text="STRAIGHT BACK TO WORK" color={C.rojo} x={960} y={950} centro size={68} />
      <Chip t={t} t0={521.4} t1={524.5} text="THE PAUPER APPRENTICES" color={C.rojo} x={960} y={150} centro size={76} />
      <Chip t={t} t0={524.7} t1={528.0} text="ORPHANS · WORKHOUSE CHILDREN" color={C.noche} x={960} y={950} centro size={64} />
      <Chip t={t} t0={528.1} t1={530.4} text="HUNDREDS OF MILES AWAY" color={C.violeta} x={960} y={150} centro size={70} />
      <Sello t={t} t0={530.5} t1={533.0} text="BOUND UNTIL ADULTHOOD" x={960} y={340} size={100} />
      {s === "blincoe" && <Velo t={t} t0={533.1} t1={567.4} op={0.3} />}
      <Retrato t={t} t0={533.3} t1={543.8} x={430} y={440} g={{ seed: 88, ropa: { ...NINO, tunica: "#8a8494", tunica2: "#5d5670" }, expr: t > 540 ? "feliz" : "neutro" }} nombre="ROBERT BLINCOE" sub="SENT NORTH · AGE 7" s={1.05} />
      <Primer t={t} t0={544.0} t1={548.2} lado="izq" g={{ seed: 88, ropa: { ...NINO, tunica: "#8a8494", tunica2: "#5d5670" }, expr: "triste", gorro: undefined }} emo="lagrimas" />
      <Chip t={t} t0={536.6} t1={538.5} text="A LONDON WORKHOUSE" color={C.violeta} x={1300} y={200} centro size={62} />
      <Chip t={t} t0={538.6} t1={543.8} text="PROMISED:" color={C.oro} tinta={C.noche} x={1300} y={200} centro size={66} />
      <Rosbif t={t} t0={540.2} t1={547.9} x={1000} y={520} s={0.9} />
      <Pudin t={t} t0={541.4} t1={547.9} x={1340} y={520} s={0.9} />
      <RelojBolsillo t={t} t0={542.9} t1={547.9} x={1680} y={520} s={0.9} />
      {[1000, 1340, 1680].map((x, i) => <Tachado key={x} t={t} t0={544.2 + i * 0.2} t1={547.9} x={x} y={520} w={260} h={260} />)}
      <Chip t={t} t0={544.0} t1={548.2} text="WHAT HE GOT: WORK FROM DAWN TO NIGHT" color={C.rojo} x={1300} y={800} centro size={52} />
      {t > 548.4 && t < 552.3 && <div style={{ position: "absolute", left: 700, top: 745, width: 1300, height: 46, borderRadius: 23, background: "#6b4a2e", opacity: ent(t, 548.4), border: "6px solid #2a1530" }} />}
      {t > 548.4 && t < 552.3 && <Chancho x={1100} y={600} s={1.3 * ent(t, 548.5)} t={t} />}
      {t > 548.4 && t < 552.3 && <div style={{ position: "absolute", left: 1300, top: 660, width: 460, height: 90, background: "#7a4a22", borderRadius: "0 0 40px 40px", transform: `scale(${ent(t, 548.6)})`, border: "8px solid #2a1530" }} />}
      {t > 549.8 && t < 552.3 && <Persona t={t} seed={89} x={1690} y={750} h={300} ropa={{ ...NINO, tunica: "#8a8494", tunica2: "#5d5670" }} expr="triste" flip bD={70} cD={50} aparece={549.9} />}
      <Chip t={t} t0={548.6} t1={552.0} text="SO HUNGRY THEY STOLE THE PIGS' FOOD" color={C.noche} x={960} y={150} centro size={58} />
      <Chip t={t} t0={552.1} t1={555.0} text="HIS BOOK SHOCKED THE COUNTRY" color={C.violeta} x={960} y={150} centro size={64} />
      {/* el libro que se abre, y lectores que se tapan la boca */}
      {t > 552.2 && t < 555.4 && (() => { const e = ent(t, 552.25), ab = prog(t, 552.6, 553.3); return (
        <div style={{ position: "absolute", left: 820, top: 560, transform: `translate(-50%,-50%) scale(${1.3 * e * (1 - prog(t, 555.15, 555.4))}) rotate(-3deg)` }}>
          <div style={{ position: "relative", width: 760, height: 480 }}>
            <div style={{ position: "absolute", left: 380, top: 0, width: 380, height: 480, background: "linear-gradient(90deg,#e9dcbc,#fbf3dc)", border: "8px solid #2a1530", borderRadius: "6px 18px 18px 6px" }}>{[0, 1, 2, 3, 4, 5, 6, 7].map((r) => <div key={r} style={{ position: "absolute", left: 36, top: 60 + r * 46, width: 290 - (r % 3) * 40, height: 12, borderRadius: 6, background: "#8a7a64", opacity: ab }} />)}</div>
            <div style={{ position: "absolute", left: 380 - 380 * ab, top: 0, width: 380 * Math.max(ab, 0.02), height: 480, background: ab < 0.5 ? "#7a2f3a" : "linear-gradient(270deg,#e9dcbc,#fbf3dc)", border: "8px solid #2a1530", borderRadius: "18px 6px 6px 18px" }} />
            {ab < 0.5 && <div style={{ position: "absolute", left: 400, top: 120, width: 340, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: C.oro, lineHeight: 1.15 }}>A MEMOIR OF<br />ROBERT BLINCOE</div>}
            <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", WebkitTextStroke: "7px #2a1530", paintOrder: "stroke fill" }}>PUBLISHED 1828</div>
          </div>
        </div>); })()}
      <Primer t={t} t0={552.4} t1={555.4} lado="der" x={1560} g={{ seed: 140, ropa: OBRERO(2), gorro: "copa", barba: true, expr: "sorpresa", bD: 140, cD: 130 }} emo="excl" h={900} />
      {/* colgado de las muñecas sobre una máquina en marcha: sólo silueta */}
      {t > 555.1 && t < 563.5 && (
        <>
          <AbsoluteFill style={{ background: "#1b1240", opacity: prog(t, 555.1, 555.5) * 0.7 * (1 - prog(t, 563.2, 563.5)) }} />
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <line x1={760} y1={160} x2={1160} y2={160} stroke="#fff3d6" strokeWidth={14} strokeLinecap="round" opacity={0.8} />
            <line x1={960} y1={160} x2={960} y2={250} stroke="#fff3d6" strokeWidth={8} opacity={0.8} />
            {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={720 + i * 120} cy={900} r={60} fill="none" stroke="#fff3d6" strokeWidth={10} strokeDasharray="20 16" strokeDashoffset={t * 120} opacity={0.6} />)}
            <rect x={640} y={960} width={640} height={30} rx={14} fill="#fff3d6" opacity={0.4} />
          </svg>
          <Persona t={t} seed={90} x={960} y={720 - Math.abs(Math.sin(t * 2.2)) * 50} h={460} ropa={NINO} sombra="#0e0a2a" bD={178} bI={178} cD={0} cI={0} expr="miedo" />
        </>
      )}
      <Chip t={t} t0={555.3} t1={558.2} text="HUNG BY HIS WRISTS" color={C.rojo} x={960} y={1010} centro size={62} />
      <Chip t={t} t0={558.4} t1={563.4} text="LEGS LIFTED · OVER A MOVING MACHINE" color={C.noche} x={960} y={990} centro size={46} />
      {/* contraste: la fábrica buena (New Lanark: chicos chicos a la escuela, no a la máquina) */}
      {t > 563.5 && t < 565.7 && (() => { const e = ent(t, 563.55), o = prog(t, 565.4, 565.7); return (
        <div style={{ position: "absolute", left: 960, top: 600, width: 1240, height: 600, transform: `translate(-50%,-50%) scale(${e * (1 - o)})`, background: "linear-gradient(180deg,#fff3c4,#ffd98a)", border: "10px solid #2a1530", borderRadius: 34, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 60, top: 60, width: 460, height: 270, background: "#2f4a3a", border: "12px solid #8a5a2c", borderRadius: 10, color: "#f4f1e6", fontFamily, fontWeight: 700, fontSize: 64, textAlign: "center", lineHeight: "120px" }}>A B C<br />1 2 3</div>
          <div style={{ position: "absolute", left: 600, top: 60, width: 600, fontFamily, fontWeight: 800, fontSize: 58, color: "#2a1530", lineHeight: 1.05 }}>NEW LANARK MILL</div>
          <div style={{ position: "absolute", left: 600, top: 140, width: 600, fontFamily, fontWeight: 700, fontSize: 38, color: "#6b4a2e", lineHeight: 1.15 }}>UNDER 10? SCHOOL,<br />NOT THE MACHINE</div>
          {[0, 1, 2, 3].map((i) => <Persona key={i} t={t} seed={150 + i} x={680 + i * 150} y={570} h={i % 2 ? 250 : 270} ropa={i % 2 ? NINA : NINO} expr="feliz" bD={i === 1 && t > 564 ? 150 : 20} cD={i === 1 ? 120 : 20} aparece={563.7 + i * 0.12} />)}
        </div>); })()}
      <Chip t={t} t0={563.7} t1={565.4} text="NOT EVERY MILL WAS LIKE THAT" color={C.violeta} x={960} y={150} centro size={68} />
      <Gran t={t} t0={565.4} t1={567.6} text="NO LAW SAID IT COULDN'T BE" y={520} size={100} color={C.rojo} />
    </AbsoluteFill>
  );
};
