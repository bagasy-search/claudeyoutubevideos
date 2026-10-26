import React from "react";
import { C, prog } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA, Ropa } from "./persona";
import { Key, CUB, MAR, BarcoLejos } from "./barco";
import { G, S, P, arco, Sable, Microbio, Mosquito, Limon, Fruta, Cofre, Frasco, Sierra, Botella, Balde, Nube, Moneda8, Pila, Precio, Sello, Signo, Flecha, TINTA } from "./obj";
import { Txt, Lbl, Lista, Contador, Flash, en } from "./dsl";
import { CartelTrampa } from "./mundo";
import { Mapa } from "./mapa";

// TRAMPA 6 · LA FIEBRE (571,5-668,5): lo que mataba no eran espadas ni cañones: escorbuto (encías, dientes, moretones,
// heridas viejas que se abren; un limón lo arreglaba), las fiebres del Caribe y África, Barbanegra en Charleston pidiendo
// un cofre de medicinas, el carpintero con la sierra, y el giro: el seguro pirata con la lista de precios del cuerpo.
const BARBANEGRA: Ropa = { ...CAPITAN, tunica: "#1d1420", tunica2: "#0e0a14", barba: "#0e0a14", pelo: "#0e0a14", gorroCol: "#0e0a14" };
const CARPINTERO: Ropa = { ...PIRATA(3), tunica: "#8a5a2a", tunica2: "#5a3418", gorro: "gorra", gorroCol: "#5a3418" };
const CHAR = 14000;

export const K6: Key[] = [
  [573.9, 2050, 1330, -1.6, 0.9],
  [581.3, 2050, 1370, -2.6, 0.7, "seco"],
  [590.2, 2050, 1360, -3.0, 0.7],
  [593.7, 2350, 1330, -3.2, 0.7],
  [598.4, 2150, 1340, -2.2, 0.8],
  [610.5, 2050, 1360, -1.7, 0.6, "seco"],
  [615.0, CHAR + 250, 1680, 0.95, 0.6, "seco"],
  [622.6, CHAR + 500, 1820, 1.3, 1.0],
  [626.5, CHAR + 500, 1850, 2.2, 0.8],
  [627.9, 2300, 1360, -1.8, 0.5, "seco"],
  [632.0, 2250, 1360, -2.6, 0.7],
  [636.7, 2170, 1370, -2.05, 0.7],
  [640.8, 2600, 1400, -3.2, 0.7],
  [642.6, 2050, 1330, -1.5, 0.8],
  [646.1, 2050, 1300, -1.2, 0.8],
  [653.3, 2050, 1320, -2.0, 0.9],
  [663.6, 2050, 1300, -1.3, 1.2],
];

export const A6: React.FC<{ t: number }> = ({ t }) => {
  if (t < 571 || t > 670) return null;
  const escorbuto = en(t, 581.2, 601.2);
  return (
    <>
      {/* qué mataba: el chico mira las tres cartas */}
      {en(t, 573.8, 581.3) && <Persona x={1700} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} expr={t > 580.3 ? "miedo" : "neutro"} />}
      {/* escorbuto: el mismo pirata, peor cada vez */}
      {escorbuto && <Persona x={t < 593.6 ? 2050 : 2350} y={CUB} h={265} t={t} seed={250} ropa={PIRATA(2)} expr={t < 585.4 ? "neutro" : t < 598.4 ? "triste" : "sorpresa"} habla={en(t, 588, 593.6)}
        inclina={en(t, 591.3, 593.6) ? 8 : 0} bD={en(t, 598.4, 601.1) ? 150 : 10} cD={en(t, 598.4, 601.1) ? 30 : 0} />}
      {en(t, 598.3, 601.2) && [1800, 2500].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={251 + i} ropa={PIRATA(i + 4)} flip={i === 1} expr="neutro" bD={70} bI={70} cD={90} cI={90} />)}
      {/* la tripulación cae */}
      {en(t, 610.4, 615) && [1650, 1850, 2050, 2250, 2450].map((x, i) => {
        const cae = 611.4 + i * 0.5;
        return <Persona key={i} x={x} y={CUB} h={250} t={t} seed={253 + i} ropa={PIRATA(i)} flip={i > 2} expr={t > cae ? "dormido" : "miedo"} inclina={t > cae ? Math.min(85, (t - cae) * 300) * (i % 2 ? 1 : -1) : 0} />;
      })}
      {/* sin cirujano: el carpintero */}
      {en(t, 628, 642.6) && <Persona x={2400} y={CUB} h={275} t={t} seed={258} ropa={CARPINTERO} flip expr={t > 634.6 ? "orgullo" : "neutro"} bD={t > 632.2 ? 120 : 20} cD={40}
        manoD={<g transform={`translate(0 -20) rotate(${-30 + (en(t, 632.2, 634.6) ? Math.sin(t * 14) * 20 : 0)}) scale(0.65)`}><Sierra /></g>} />}
      {en(t, 628, 642.6) && <Persona x={1900} y={CUB} h={250} t={t} seed={259} ropa={PIRATA(1)} expr="miedo" bD={en(t, 637.6, 642.6) ? 130 : 10} cD={60}
        manoD={en(t, 638.8, 642.6) ? <g transform="scale(0.28)"><Botella c="#7a3a1a" /></g> : undefined} />}
      {/* seguro: la tripulación festeja; el cuerpo con precios */}
      {en(t, 644.5, 653.3) && [1650, 1850, 2250, 2450].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={260 + i} ropa={PIRATA(i)} flip={i > 1} expr="feliz" bD={t > 646.2 ? 160 : 20} cD={t > 646.2 ? 0 : 40} />)}
      {en(t, 653.3, 670) && <Persona x={2050} y={CUB} h={300} t={t} seed={264} ropa={PIRATA(5)} expr={t > 663.6 ? "orgullo" : "sorpresa"} bD={40} bI={40} />}
      {en(t, 663.5, 670) && [1600, 1780, 2320, 2500].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={265 + i} ropa={PIRATA(i + 1)} flip={i > 1} expr="orgullo" ladea={Math.sin(t * 6 + i) * 6} />)}
      <G>
        {/* espadas, cañones, enfermedad */}
        <P t={t} t0={577.6} t1={581.2} x={1880} y={1220} s={0.8} rot={-30}><Sable /></P>
        <P t={t} t0={578.5} t1={581.2} x={2050} y={1220} s={1}><circle r={60} fill="#2a2a34" /></P>
        <P t={t} t0={578.3} t1={581.2} x={1880} y={1220} s={1}><Signo k="cross" /></P>
        <P t={t} t0={579.3} t1={581.2} x={2050} y={1220} s={1}><Signo k="cross" /></P>
        {en(t, 580.2, 581.3) && <g transform={`translate(2250 1230) scale(${0.4 + prog(t, 580.2, 580.6) * 0.5})`}><Microbio t={t} /></g>}
        <Lbl t={t} t0={580.3} t1={581.2} x={2250} y={1110} txt="DISEASE" size={56} color={C.lima} />
        <S t={577.6} p="sword" g={-8} />
        <S t={578.3} p="fail" g={-12} />
        <S t={578.5} p="cannon" g={-12} />
        <S t={579.3} p="fail" g={-12} />
        <S t={580.3} p="squish" g={-4} />
        {/* escorbuto */}
        <P t={t} t0={582.7} t1={585.4} x={2220} y={1320} s={0.4}><Fruta k="pina" /></P>
        <P t={t} t0={583.0} t1={585.4} x={2320} y={1320} s={0.4}><Fruta k="banana" /></P>
        <P t={t} t0={583.6} t1={585.4} x={2270} y={1320} s={0.9}><Signo k="cross" /></P>
        <S t={583.6} p="fail" g={-12} />
        <Lbl t={t} t0={585.6} t1={587.9} x={2050} y={1240} txt="NO NEW TISSUE" size={34} color={C.lila} />
        <S t={585.6} p="sad" g={-12} />
        {/* moretón al apoyarse */}
        {en(t, 591.3, 593.6) && <g><rect x={2120} y={1180} width={18} height={320} fill="#6b3a1f" /><circle cx={2100} cy={1360} r={10 + prog(t, 591.6, 592.2) * 14} fill="#7a3a9a" opacity={0.8} /></g>}
        <Lbl t={t} t0={591.6} t1={593.6} x={2050} y={1250} txt="BRUISES" size={48} color={C.lila} />
        {en(t, 590.6, 592.4) && <rect x={2040} y={1260 + Math.min(1, (t - 590.6) / 0.6) ** 2 * 230} width={14} height={20} rx={5} fill="#fff8e8" stroke={TINTA} strokeWidth={3} transform={`rotate(${(t - 590.6) * 300} 2047 ${1270 + Math.min(1, (t - 590.6) / 0.6) ** 2 * 230})`} />}
        <S t={591.2} p="tick" g={-6} pitch={1.6} />
        <S t={591.6} p="squish" g={-10} />
        {/* heridas viejas que se abren */}
        {en(t, 593.7, 598.3) && <path d={`M 2318 1328 l 10 -8 l 10 8 l 10 -8 l 10 8 l 10 -8`} stroke={t > 595.4 ? C.rojo : "#c98a7a"} strokeWidth={t > 595.4 ? 6 : 3} fill="none" strokeLinecap="round" />}
        <Lbl t={t} t0={594.2} t1={598.3} x={2350} y={1205} txt="HEALED YEARS AGO..." size={26} color={C.crema} />
        <Lbl t={t} t0={595.6} t1={598.3} x={2350} y={1245} txt="...OPENS AGAIN" size={26} color={C.rojo} />
        <S t={595.5} p="rip" g={-8} />
        {/* el limón */}
        <P t={t} t0={599.2} t1={601.1} x={2150} y={1210} s={0.55} flota><Limon /></P>
        {en(t, 599.2, 601.1) && <circle cx={2150} cy={1210} r={70 + Math.sin(t * 5) * 6} fill="#fff3c4" opacity={0.25} />}
        <S t={599.2} p="sparkle" g={-8} />
        {/* mosquitos */}
        {en(t, 610.4, 615) && Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${1600 + ((i * 97 + t * (60 + i * 9)) % 1000)} ${1220 + Math.sin(t * 3 + i) * 80})`}><Mosquito t={t} s={0.22} /></g>)}
        <S t={610.5} p="mosquito" g={-6} d={4.4} />
        {[611.4, 611.9, 612.4, 612.9, 613.4].map((a, i) => <S key={i} t={a + 0.15} p="thud" g={-8} pitch={1 + i * 0.05} />)}
        {/* sin cirujano */}
        <Lbl t={t} t0={632.4} t1={636.6} x={2400} y={1160} txt="THE CARPENTER" size={44} color={C.oro} />
        <S t={632.3} p="saw" g={-8} d={1.2} />
        <S t={634.7} p="sparkle" g={-10} />
        {en(t, 640.8, 642.6) && <g transform={`translate(2600 ${CUB - 40}) scale(0.5)`}><Balde t={t} agua="#1d1420" /></g>}
        {t > 640.9 && t < 642.6 && <g transform={`translate(2600 ${CUB - 130})`}><Nube t={t} t0={640.9} r={50} n={5} c="#8a8494" /></g>}
        <Lbl t={t} t0={641.0} t1={642.5} x={2600} y={1300} txt="HOT TAR" size={40} color={C.naranja} />
        <S t={640.9} p="sizzle" g={-6} />
        {/* seguro */}
        {en(t, 646.2, 653.3) && Array.from({ length: 16 }, (_, i) => { const a = 646.4 + i * 0.12; const p = arco(t, a, a + 1.0, [1650 + ((i * 131) % 800), 1000], [1650 + ((i * 131) % 800), CUB - 10], -40); return t > a && <g key={i} transform={`translate(${p.x} ${p.y}) scale(0.6)`}><Moneda8 r={40} t={t} gira={1} /></g>; })}
        {Array.from({ length: 8 }, (_, i) => <S key={i} t={646.5 + i * 0.24} p="coin" g={-10} pitch={1 + (i % 4) * 0.08} />)}
        <S t={646.3} p="cheer" g={-10} />
        {/* el cuerpo con precios */}
        {([[656.6, 1760, 1260, "RIGHT ARM · 600", "M 1880 1280 L 1990 1320"], [658.8, 2340, 1260, "LEFT ARM · 500", "M 2230 1280 L 2110 1320"], [660.7, 1760, 1440, "FINGER · 100", "M 1880 1440 L 1985 1420"], [661.8, 2340, 1440, "EYE · 100", "M 2230 1420 L 2080 1260"]] as [number, number, number, string, string][]).map(([a, x, y, txt, d], i) => (
          <g key={i}>
            {en(t, a, 668.5) && <g transform={`translate(${x} ${y}) scale(${0.36 * prog(t, a, a + 0.25)}) rotate(${i % 2 ? 6 : -6})`}><rect x={-230} y={-50} width={460} height={100} rx={18} fill={i < 2 ? C.oro : C.crema} stroke={TINTA} strokeWidth={8} /><text x={0} y={22} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={58} fill={TINTA}>{txt}</text></g>}
            <Flecha t={t} t0={a + 0.1} t1={668.5} d={d} w={6} />
            <S t={a} p="stamp" g={-8} pitch={1 + i * 0.08} />
            <S t={a + 0.2} p="coin" g={-12} />
          </g>
        ))}
      </G>
    </>
  );
};

// mundo: Barbanegra bloquea Charleston
export const M6: React.FC<{ t: number }> = ({ t }) => {
  if (t < 614 || t > 629) return null;
  return (
    <>
      <BarcoLejos x={CHAR - 450} y={MAR - 30} t={t} s={1.6} tipo="pirata" />
      <BarcoLejos x={CHAR - 1400} y={MAR - 30} t={t} s={1.2} tipo="pirata" />
      {en(t, 622.5, 629) && <BarcoLejos x={CHAR + 1700} y={MAR - 20} t={t} s={1.1} tipo="mercante" flip />}
      {en(t, 616, 629) && <Persona x={CHAR + 200} y={MAR - 60} h={270} t={t} seed={270} ropa={BARBANEGRA} expr="enojado" habla={en(t, 623.5, 628)} bD={en(t, 624.5, 628) ? 110 : 30} cD={30} />}
      {en(t, 622.5, 629) && [CHAR + 520, CHAR + 680, CHAR + 840].map((x, i) => <Persona key={i} x={x} y={MAR - 60} h={230} t={t} seed={271 + i} ropa={{ ...PIRATA(i), tunica: ["#e8e0d0", "#a8c0d8", "#d8b0c0"][i], gorro: "no", barba: undefined }} flip expr="miedo" bD={170} bI={170} cD={0} cI={0} />)}
      <G>
        <Lbl t={t} t0={615.6} t1={622.4} x={CHAR + 250} y={MAR - 640} txt="BLACKBEARD" size={110} color={C.rojo} />
        <S t={615.0} p="whoosh_big" g={-4} />
        <S t={615.8} p="cannon" g={-10} />
        <S t={617.5} p="bell" g={-8} />
        <Lbl t={t} t0={622.8} t1={626.4} x={CHAR + 680} y={MAR - 330} txt="HOSTAGES" size={56} color={C.crema} />
        <S t={622.8} p="gasp" g={-8} />
        {en(t, 624.6, 626.4) && <g transform={`translate(${CHAR + 380} ${MAR - 200}) scale(0.5)`}><Pila n={3} oro /></g>}
        <P t={t} t0={625.6} t1={626.4} x={CHAR + 380} y={MAR - 230} s={0.8}><Signo k="cross" /></P>
        <S t={625.6} p="fail" g={-10} />
        <Lbl t={t} t0={625.6} t1={626.4} x={CHAR + 380} y={MAR - 95} txt="NOT GOLD" size={50} color={C.rojo} />
        <P t={t} t0={626.5} x={CHAR + 480} y={MAR - 120} s={0.5}><Cofre t={t} abre={prog(t, 626.9, 627.4)} txt="MEDICINE" /></P>
        {en(t, 627.2, 629) && [0, 1, 2].map((i) => <g key={i} transform={`translate(${CHAR + 440 + i * 40} ${MAR - 170 - Math.sin(t * 3 + i) * 8}) scale(0.22)`}><Frasco c={["#7ac8e8", "#c8a0d8", "#9be15d"][i]} /></g>)}
        <S t={626.6} p="wood_hit" g={-6} />
        <S t={627.2} p="sparkle" g={-6} />
      </G>
    </>
  );
};

export const O6: React.FC<{ t: number }> = ({ t }) => {
  if (t < 571 || t > 670) return null;
  return (
    <>
      <CartelTrampa t={t} t0={571.54} n={6} nombre="THE FEVER" t1={573.8} />
      <S t={571.54} p="whoosh_big" g={-4} />
      <S t={571.75} p="wood_hit" g={-4} />
      <Txt t={t} t0={574.0} t1={577.4} text="WHAT KILLED SAILORS?" y={170} size={110} />
      <Txt t={t} t0={581.4} t1={584.0} text="SCURVY" y={170} size={160} color={C.lila} />
      <S t={581.4} p="boom" g={-10} />
      <Contador t={t} t0={582.6} t1={583.6} de={0} a={2} x={960} y={900} size={110} color={C.crema} post=" MONTHS" tFin={585.4} />
      {/* encías y dientes */}
      {en(t, 588, 591.3) && (
        <div style={{ position: "absolute", left: 1420, top: 620, transform: `scale(${prog(t, 588, 588.3)})` }}>
          <svg width={1} height={1} style={{ overflow: "visible" }}>
            <ellipse cx={0} cy={0} rx={300} ry={200} fill={TINTA} />
            <ellipse cx={0} cy={0} rx={280} ry={180} fill="#5a1a2a" />
            <path d="M -260 -60 Q 0 -190 260 -60 L 260 -10 Q 0 -120 -260 -10 Z" fill={`rgb(${200 - prog(t, 588.2, 589.6) * 80},${110 - prog(t, 588.2, 589.6) * 60},${140 + prog(t, 588.2, 589.6) * 40})`} />
            {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-210 + i * 60} y={-90 + Math.abs(i - 3) * 10} width={48} height={70} rx={14} fill="#fff8e8" stroke={TINTA} strokeWidth={5} transform={`rotate(${t > 590.2 ? Math.sin(t * 18 + i) * 12 : 0} ${-186 + i * 60} ${-90 + Math.abs(i - 3) * 10})`} />)}
          </svg>
        </div>
      )}
      <Txt t={t} t0={588.2} t1={590.1} text="GUMS SWELL & TURN PURPLE" y={170} size={90} color={C.lila} />
      <Txt t={t} t0={590.2} t1={591.3} text="LOOSE TEETH" y={170} size={110} color={C.crema} />
      <S t={588.1} p="squish" g={-8} />
      <S t={590.3} p="rattle" g={-8} d={1} />
      <Txt t={t} t0={598.5} t1={601.0} text="A LEMON." y={900} size={110} color={C.oro} />
      <Txt t={t} t0={599.4} t1={601.1} text="THE CURE (NOBODY KNEW)" y={170} size={96} color={C.oro} />
      {/* fiebres tropicales */}
      <Mapa t={t} t0={601.2} t1={610.4} titulo="FEVER COUNTRY"
        cam={[[601.2, -60, 18, 1.6], [605.0, -40, 14, 1.4], [608.0, -40, 14, 1.5]]}
        pins={[{ lugar: "jamaica", t0: 603.6, txt: "CARIBBEAN", icono: "cruz" }, { lugar: "antigua", t0: 604.0, icono: "cruz" }, { lugar: "nassau", t0: 604.3, icono: "cruz" }, { lugar: "capecoast", t0: 605.0, txt: "WEST AFRICA", icono: "cruz" }, { lugar: "africa", t0: 605.4, icono: "cruz" }]} />
      {en(t, 601.6, 610.4) && <Persona x={260} y={1050} h={380} t={t} seed={7} ropa={GRUMETE} expr="miedo" bD={70} cD={-40} aparece={601.6} />}
      <S t={601.2} p="unroll" g={-4} />
      {[603.6, 604.0, 604.3, 605.0, 605.4].map((a, i) => <S key={i} t={a} p="stamp" g={-10} pitch={1 + i * 0.05} />)}
      <Txt t={t} t0={606.4} t1={608.2} text="YELLOW FEVER" y={900} size={120} color={C.oro} />
      <Txt t={t} t0={608.3} t1={610.4} text="MALARIA" y={900} size={140} color={C.lima} />
      {en(t, 606.4, 610.4) && Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 200 + ((i * 233 + t * 140) % 1500), top: 380 + Math.sin(t * 4 + i) * 120 + (i % 3) * 150 }}><svg width={1} height={1} style={{ overflow: "visible" }}><Mosquito t={t} s={0.5} /></svg></div>)}
      <S t={606.4} p="mosquito" g={-6} d={4} />
      <Txt t={t} t0={612.0} t1={614.9} text="WHOLE CREWS · IN WEEKS" y={170} size={96} color={C.rojo} />
      <Contador t={t} t0={612.3} t1={614.6} de={120} a={18} x={960} y={900} size={130} color={C.crema} pre="CREW: " tFin={614.9} />
      <Txt t={t} t0={628.2} t1={631.9} text="NO REAL SURGEON" y={170} size={120} />
      <Lista t={t} x={70} y={640} size={40} w={560} titulo="THE OPERATION" t1={642.5}
        items={[{ txt: "ANESTHETIC", t0: 636.8, tacha: 637.3 }, { txt: "LEATHER STRAP", t0: 637.8, ok: true }, { txt: "BOTTLE OF RUM", t0: 639.0, ok: true }, { txt: "HOT TAR", t0: 640.9, ok: true }]} />
      {[636.8, 637.8, 639.0, 640.9].map((a, i) => <S key={i} t={a} p="write" g={-12} />)}
      <S t={637.3} p="fail" g={-10} />
      <Txt t={t} t0={642.7} t1={644.5} text="BUT HERE'S THE STRANGE PART" y={170} size={84} color={C.lila} />
      <Txt t={t} t0={644.7} t1={646.0} text="PIRATES HAD INSURANCE" y={170} size={110} color={C.oro} />
      <S t={644.7} p="boom" g={-6} />
      <Contador t={t} t0={646.4} t1={649.0} de={0} a={800} x={960} y={190} size={170} color={C.oro} pre="$" tFin={653.2} />
      <Txt t={t} t0={649.2} t1={653.2} text="FOR A LOST LIMB · ROBERTS' ARTICLES" y={330} size={56} color={C.crema} />
      <Txt t={t} t0={653.4} t1={656.4} text="THE OLD BUCCANEERS: MORE PRECISE" y={170} size={84} />
      <Txt t={t} t0={663.7} t1={668.4} text="YOUR BODY HAD A PRICE LIST" y={170} size={96} color={C.oro} />
      {en(t, 665.2, 668.4) && <div style={{ position: "absolute", left: 1500, top: 720 }}><svg width={1} height={1} style={{ overflow: "visible" }}><Sello t={t} t0={665.3} txt="EVERYONE KNEW" size={70} /></svg></div>}
      <S t={665.3} p="stamp" g={-6} />
      
    </>
  );
};
export const _6 = { Precio };
