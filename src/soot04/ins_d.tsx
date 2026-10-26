import React from "react";
import { conVida } from "./poses";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import { Svg, Cachalote, Bote, Splash, Ballenero, Isla, Arpon, Tiburon, Humo, Barril0, Moneda0 } from "./kit3";
import { Persona, MARINO, TIBURON, CAPITAN, CUAQUERO } from "./persona";
import { Chico } from "./reparto";
import { Ins, Rayos2, Grad, Mar, Monto, Sello, Dice, Rot, Vuela } from "./insertos";

// relleno de los huecos que quedaban en el mundo lejano (vuelta 2 del OJO): cada uno = personaje grande actuando
const Agente: React.FC<{ x: number; y: number; h: number; t: number; expr?: any; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; habla?: boolean; manoD?: React.ReactNode }> = (p) => (
  <Persona {...p} seed={13} ropa={TIBURON} casco="galera" pantalon="#1a1420" />
);
const Marino: React.FC<{ i: number; x: number; y: number; h: number; t: number; expr?: any; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; camina?: number; salta?: number; inclina?: number; manoD?: React.ReactNode; mira?: number }> = ({ i, ...p }) => (
  <Persona {...conVida(p, 60 + i)} seed={60 + i} ropa={MARINO(i)} casco={i % 3 === 0 ? "gorro" : "no"} gorroCol={["#2b6ad0", "#d8343a", "#3d6e5a"][i % 3]} pantalon={["#3a3a4a", "#2a3a5a", "#5a4a3a"][i % 3]} />
);
const Diario: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 620, height: 520, transform: `translate(-50%,-50%) rotate(-3deg) scale(${s * ent(t, t0)})`, background: "#f4ecd8", border: `8px solid ${C.noche}`, padding: 26, fontFamily, fontWeight: 700, color: "#2a1530", textAlign: "center" }}>
    <div style={{ fontSize: 28, borderBottom: "4px solid #2a1530" }}>THE DAILY HERALD · 1841</div>
    <div style={{ fontSize: 92, color: C.rojo, marginTop: 14 }}>WANTED!</div>
    <div style={{ fontSize: 40 }}>YOUNG MEN FOR WHALING VOYAGES</div>
    {t >= 78.9 && <div style={{ fontSize: 44, color: "#2a7a3a", marginTop: 18 }}>GOOD PAY · SEE THE WORLD!</div>}
  </div>
);

export const INS_D: Ins[] = [
  // «You will be gone for four years.»
  {
    a: 14.55, b: 16.95,
    fondo: (t) => <Rayos2 t={t} c1="#2d5a8a" c2="#244a74" />,
    d: (t) => (
      <>
        <Chico x={560} y={1290} h={1050} t={t} expr="triste" bD={160} cD={10} cI={30} bI={20} />
        <Monto t={t} ks={[[15.3, 4]]} x={1250} y={460} size={240} pre="" suf=" YEARS" color={C.crema} />
        <Chip t={t} t0={14.7} text="GONE FOR…" color={C.violeta} x={1300} y={200} centro size={70} />
      </>
    ),
  },
  // «One day, you see a notice in the newspaper: wanted, young men for whaling voyages. Good pay, see the world.»
  {
    a: 73.4, b: 81.0,
    fondo: (t) => <Rayos2 t={t} c1="#f7c548" c2="#ecb83a" cx={1300} />,
    d: (t) => (
      <>
        <Chico x={440} y={1290} h={1080} t={t} expr={t < 78.9 ? "sorpresa" : "feliz"} bD={100} cD={60} bI={100} cI={60} gorro="paja" salta={79.0} />
        <Diario t={t} t0={74.4} x={1280} y={520} s={1.15} />
        {t >= 79.0 && <Emote t={t} t0={79.0} tipo="brillos" x={560} y={250} s={1.4} />}
      </>
    ),
  },
  // «you walk into an office in New York and you meet a very friendly man… a shipping agent»
  {
    a: 81.1, b: 87.5,
    fondo: () => <><Grad c1="#d8c0a0" c2="#b89878" /><div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#7a4a26" }} /></>,
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 120, top: 120, width: 300, height: 380, background: "#cfe8ff", border: "18px solid #5a3418" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 160, background: "linear-gradient(#8a8a9a,#5a5a6a)" }} /></div>
        <Chico x={interpolate(t, [81.2, 82.8], [-150, 520], { extrapolateRight: "clamp" })} y={1290} h={1000} t={t} expr={t > 83.6 ? "feliz" : "neutro"} gorro="paja" camina={t < 82.8 ? 2.4 : 0} bD={t > 84.0 ? 90 : 20} cD={t > 84 ? 0 : 20} />
        <Agente x={1380} y={1290} h={1050} t={t} expr="feliz" flip habla={t >= 83.3 && t < 85} bD={t > 84.0 ? 90 : 40} cD={t > 84 ? 0 : 100} />
        <Chip t={t} t0={82.4} text="NEW YORK" color={C.violeta} x={960} y={130} centro size={64} />
        <Chip t={t} t0={83.6} text="A VERY FRIENDLY MAN" color={C.lima} tinta={C.noche} x={960} y={240} centro size={56} />
        <Sello t={t} t0={86.5} text="SHIPPING AGENT" x={1380} y={380} size={70} rot={-6} />
      </>
    ),
  },
  // «The land shark tells you about palm trees and islands and girls who wear flowers in their hair.»
  {
    a: 90.4, b: 95.4,
    fondo: (t) => <Rayos2 t={t} c1="#ff9ab0" c2="#ff86a0" cx={1250} cy={420} />,
    d: (t) => (
      <>
        <Agente x={420} y={1290} h={1000} t={t} expr="feliz" habla bD={150} cD={30} />
        <div style={{ position: "absolute", left: 1250, top: 430, width: 900, height: 560, transform: `translate(-50%,-50%) scale(${ent(t, 90.8)})`, borderRadius: "50%", background: "#bfe8ff", border: `10px solid ${C.noche}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, bottom: 0, background: "#2a9ad0" }} />
          <div style={{ position: "absolute", left: 0, top: 0 }}><Isla x={450} y={360} t={t} s={0.7} seed={2} /></div>
          {t >= 93.4 && [0, 1].map((k) => <Persona key={k} x={300 + k * 300} y={560} h={300} t={t} seed={400 + k} ropa={{ tunica: "#ff6f91", tunica2: "#d84a70", cinto: "#ffd27a", piel: "#c98b62", piel2: "#a2643f", pelo: "#1a1010" }} casco="no" pantalon="#3aa05a" expr="feliz" salta={93.5 + k * 0.2} />)}
        </div>
        {[["PALM TREES", 91.6], ["ISLANDS", 92.6], ["FLOWERS IN THEIR HAIR", 94.0]].map(([w, t0], k) => <Chip key={k} t={t} t0={t0 as number} text={w as string} color={[C.lima, C.teal, C.rosa][k]} tinta={C.noche} x={1250} y={800 + k * 90} centro size={48} />)}
      </>
    ),
  },
  // «he has been paid a fee for every body he delivers… the fee will come out of your wages, not his»
  {
    a: 100.2, b: 108.2,
    fondo: (t) => <Rayos2 t={t} c1="#3a3048" c2="#2e2640" />,
    d: (t) => {
      const sale = prog(t, 105.7, 106.6);
      return (
        <>
          <Agente x={1450} y={1290} h={1000} t={t} expr="orgullo" flip bD={80} cD={100} manoD={<g>{[0, 1, 2].map((k) => <circle key={k} cx={k * 12} cy={-k * 12} r={24} fill={C.oro} stroke="#8a5a10" strokeWidth={4} />)}</g>} />
          <Chico x={460} y={1290} h={960} t={t} expr={t > 105.7 ? "miedo" : "neutro"} gorro="paja" mira={1} />
          {Array.from({ length: 5 }, (_, k) => <Vuela key={k} t={t} t0={102.0 + k * 0.3} t1={102.6 + k * 0.3} x0={960} y0={-100} x1={1320 + k * 20} y1={560 - k * 16} arco={-60} giro={360}><g><circle r={40} fill={C.oro} stroke="#8a5a10" strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#8a5a10">$</text></g></Vuela>)}
          <Chip t={t} t0={101.9} text="A FEE PER BODY" color={C.rojo} x={960} y={150} centro size={64} />
          {sale > 0 && <Vuela t={t} t0={105.7} t1={106.6} x0={500} y0={760} x1={1330} y1={560} arco={200} giro={360} queda={false}><g><circle r={44} fill={C.oro} stroke="#8a5a10" strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#8a5a10">$</text></g></Vuela>}
          <Chip t={t} t0={105.7} text="OUT OF YOUR WAGES" color={C.violeta} x={960} y={260} centro size={56} />
          <Sello t={t} t0={107.4} text="NOT HIS." x={960} y={430} size={90} rot={-6} />
        </>
      );
    },
  },
  // «you sign the shipping articles. Most of the young men could barely read them. Nobody expects you to.»
  {
    a: 122.2, b: 131.1,
    fondo: () => <Grad c1="#7a5a3a" c2="#4a3420" />,
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 1260, top: 620, width: 760, height: 900, transform: `translate(-50%,-50%) rotate(3deg) scale(${0.82 * ent(t, 124.6)})`, background: "#f6ecd2", border: "10px solid #5a3418", padding: 30, fontFamily, fontWeight: 700, color: "#2a1530", overflow: "hidden" }}>
          <div style={{ fontSize: 50, textAlign: "center" }}>SHIPPING ARTICLES</div>
          {Array.from({ length: 30 }, (_, k) => <div key={k} style={{ fontSize: 13, lineHeight: "20px", color: "#5a4a3a", whiteSpace: "nowrap" }}>{"whereas the undersigned seamen agree to the lay hereafter stated, all advances, outfits, slops and interest to be deducted…".slice((k * 7) % 40)}</div>)}
        </div>
        <Chico x={480} y={1290} h={1050} t={t} expr={t > 127.5 ? "sorpresa" : "neutro"} gorro="paja" mira={1} miraY={0.3} bD={t > 127.5 ? 150 : 20} cD={t > 127.5 ? 150 : 20} inclina={t > 127.5 ? 6 : 0} />
        {t >= 127.5 && <Emote t={t} t0={127.5} tipo="preg" x={260} y={420} s={1.4} />}
        <Chip t={t} t0={122.4} t1={129.6} text="HANDED TO THE SHIP" color={C.violeta} x={600} y={210} centro size={52} />
        <Chip t={t} t0={126.4} text="COULD BARELY READ IT" color={C.rojo} x={1260} y={930} centro size={52} />
        <Rot t={t} t0={129.8} text="NOBODY EXPECTS YOU TO" x={1260} y={160} size={72} color={C.crema} />
      </>
    ),
  },
  // «young men came home after years at sea with a few dollars, some with less than nothing… in debt to the ship they had just survived. And who owned the ships?»
  {
    a: 230.5, b: 242.6,
    fondo: (t) => <Mar t={t} y={720} cielo={["#8a5ab0", "#ffb88a"]} />,
    d: (t) => {
      const v = interpolate(t, [233.0, 236.6], [3.12, -11.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <>
          <div style={{ position: "absolute", left: -40, top: 860, width: 1300, height: 260, background: "#7a4a26", borderTop: "14px solid #9a6a3a" }} />
          <Chico x={interpolate(t, [237.6, 239.0], [200, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={1290} h={1000} t={t} expr={v < 0 ? "triste" : "neutro"} camina={t >= 237.6 && t < 239 ? 2 : 0} bD={10} bI={10} />
          <div style={{ position: "absolute", left: 1380, top: 470, transform: `translate(-50%,-50%) rotate(4deg) scale(${ent(t, 230.9)})`, width: 520, padding: 30, background: "#f6ecd2", border: "8px solid #5a3418", fontFamily, fontWeight: 700, color: "#2a1530", textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>CREW ACCOUNT · PAID OFF</div>
            <div style={{ fontSize: 120, color: v < 0 ? C.rojo : "#2a7a3a" }}>{v < 0 ? "-" : ""}${Math.abs(v).toFixed(2)}</div>
            <div style={{ fontSize: 30 }}>AFTER 4 YEARS AT SEA</div>
          </div>
          <Rot t={t} t0={239.2} t1={241.2} text="IN DEBT TO THE SHIP" x={960} y={150} size={86} color={C.rojo} />
          <Rot t={t} t0={241.5} text="WHO OWNED THE SHIPS?" x={960} y={150} size={86} color={C.crema} />
        </>
      );
    },
  },
  // «…was not getting rich by accident.»
  {
    a: 263.5, b: 266.0,
    fondo: (t) => <Rayos2 t={t} c1="#f7c548" c2="#ecb83a" />,
    d: (t) => (
      <>
        <Persona x={720} y={1290} h={1050} t={t} seed={210} ropa={CUAQUERO} casco="cuaquero" pantalon="#3a3a3a" expr="orgullo" bD={110 + Math.sin(t * 10) * 15} cD={70} manoD={<g>{[0, 1, 2].map((k) => <circle key={k} cx={k * 14} cy={-k * 10} r={26} fill={C.oro} stroke="#8a5a10" strokeWidth={4} />)}</g>} />
        <Svg x={1350} y={760} s={ent(t, 263.8)}>{Array.from({ length: 8 }, (_, k) => <g key={k} transform={`translate(${(k % 4) * 90 - 135} ${-Math.floor(k / 4) * 50})`}><ellipse rx={40} ry={14} fill={C.oro} stroke="#8a5a10" strokeWidth={4} /></g>)}</Svg>
        <Rot t={t} t0={264.4} text="NOT BY ACCIDENT" x={1300} y={900} size={100} color={C.noche} />
      </>
    ),
  },
  // «Lunch is salt beef, which the sailors called salt horse… On Sundays… duff, a boiled pudding with molasses. That is the highlight of your week.»
  {
    a: 308.4, b: 321.4,
    fondo: (t) => <Rayos2 t={t} c1={t < 314.3 ? "#7a3a2a" : "#3d8a5a"} c2={t < 314.3 ? "#6a3020" : "#337a4e"} cx={1300} />,
    d: (t) => {
      const domingo = t > 314.3;
      return (
        <>
          <Chico x={560} y={1290} h={1080} t={t} expr={domingo ? "feliz" : "miedo"} bD={100} cD={80} salta={316.9} manoD={<g transform="translate(20 -20)"><ellipse rx={110} ry={30} fill="#f4f0e8" stroke={C.noche} strokeWidth={6} /></g>} />
          {!domingo && (
            <>
              <Svg x={1300} y={520} s={1.4 * ent(t, 309.0)}><path d="M -140 40 Q -160 -60 -40 -80 Q 100 -100 150 -20 Q 160 60 40 70 Q -80 80 -140 40 Z" fill="#a8443a" stroke="#5a2018" strokeWidth={8} /><path d="M -100 0 Q 0 -30 110 -10" stroke="#e8a090" strokeWidth={10} fill="none" /></Svg>
              {t >= 310.8 && <Svg x={1300} y={520} s={1.6} op={0.35 * prog(t, 310.8, 311.4)}><path d="M -200 60 L -150 -60 L -80 -110 L -30 -160 L 10 -120 L -20 -60 L 140 -40 L 200 60 L 170 60 L 150 0 L -100 10 L -130 60 Z" fill="#fff" /></Svg>}
              <Rot t={t} t0={309.1} text="SALT BEEF" x={1300} y={170} size={110} color={C.crema} />
              <Chip t={t} t0={310.8} text="A.K.A. 'SALT HORSE'" color={C.noche} x={1300} y={820} centro size={56} />
              <Dice t={t} t0={312.4} text="…was it a joke?" x={1300} y={980} size={46} cola="izq" />
            </>
          )}
          {domingo && (
            <>
              <Svg x={1300} y={560} s={1.5 * ent(t, 317.1)}><path d="M -150 60 Q -160 -100 0 -110 Q 160 -100 150 60 Z" fill="#8a5a2a" stroke="#4a2a10" strokeWidth={8} />{[0, 1, 2, 3].map((k) => <path key={k} d={`M ${-120 + k * 80} -90 q 10 ${40 + (k % 2) * 30} 0 ${70 + (k % 2) * 40}`} stroke="#3a1a08" strokeWidth={22} strokeLinecap="round" fill="none" />)}<ellipse cx={0} cy={60} rx={190} ry={30} fill="#f4f0e8" stroke={C.noche} strokeWidth={6} /></Svg>
              <Chip t={t} t0={314.5} text="SUNDAY" color={C.violeta} x={1300} y={150} centro size={66} />
              <Chip t={t} t0={315.5} text="IF THE COOK IS IN A GOOD MOOD" color={C.noche} x={1300} y={250} centro size={44} />
              <Rot t={t} t0={317.1} t1={319.7} text="DUFF + MOLASSES" x={1300} y={880} size={90} color={C.oro} />
              <Rot t={t} t0={319.9} text="HIGHLIGHT OF YOUR WEEK" x={1300} y={880} size={76} color={C.crema} />
            </>
          )}
        </>
      );
    },
  },
  // «The boat. The moment someone yells, the whole ship explodes.»
  {
    a: 372.2, b: 375.2,
    fondo: () => <><Grad c1="#8ac0e8" c2="#d8ecf8" /><div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "repeating-linear-gradient(90deg,#9a6a3a 0 160px,#7a4a26 160px 168px)" }} /></>,
    d: (t) => (
      <>
        {[0, 1, 2, 3].map((k) => <Marino key={k} i={k} x={interpolate(t, [373.7, 375.2], [-200 + k * 300, 900 + k * 300], { extrapolateLeft: "clamp" })} y={1080} h={560} t={t} expr="sorpresa" camina={t > 373.7 ? 3 : 0} bD={150} />)}
        <Chico x={interpolate(t, [373.7, 375.2], [800, 1500], { extrapolateLeft: "clamp" })} y={1290} h={980} t={t} expr="miedo" camina={t > 373.7 ? 3 : 0} bD={160} bI={160} cD={10} cI={10} salta={372.9} />
        <Rot t={t} t0={372.9} text="ALL HANDS!" x={960} y={220} size={170} color={C.rojo} tiembla />
      </>
    ),
  },
  // «The whaling ship does not hunt the whale. It is too big and too slow. Instead, it carries three or four small whale boats»
  {
    a: 375.3, b: 380.3,
    fondo: (t) => <Mar t={t} y={600} />,
    d: (t) => (
      <>
        <Ballenero x={1100} y={640} t={t} escala={0.6} />
        <Persona x={330} y={1290} h={1000} t={t} seed={11} ropa={CAPITAN} casco="capitan" barba="#3a2616" pantalon="#141a30" expr="neutro" bD={t > 377.6 ? 20 : 90} cD={t > 377.6 ? 20 : 10} bI={t > 377.6 ? 140 : 30} cI={t > 377.6 ? 150 : 20} />
        <Chip t={t} t0={375.5} text="THE SHIP DOESN'T HUNT" color={C.violeta} x={1100} y={140} centro size={60} />
        <Sello t={t} t0={377.6} text="TOO BIG · TOO SLOW" x={1100} y={280} size={70} rot={-5} />
        {t >= 379.9 && <Svg x={1500} y={660} s={1.5 * ent(t, 379.9)}><circle r={90} fill="none" stroke={C.oro} strokeWidth={14} /></Svg>}
      </>
    ),
  },
  // «You drop the boat into the sea, and six men jump in. Five of them row. You are one of them.»
  {
    a: 389.4, b: 394.7,
    fondo: (t) => <Mar t={t} y={620} />,
    d: (t) => {
      const baja = interpolate(t, [389.5, 390.5], [300, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <>
          {t < 390.5 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><line x1={600} y1={0} x2={600} y2={baja - 40} stroke="#e8d28a" strokeWidth={8} /><line x1={1320} y1={0} x2={1320} y2={baja - 40} stroke="#e8d28a" strokeWidth={8} /></svg>}
          <Bote x={960} y={baja} t={t} s={1.6} rema={t > 392.5 ? 1 : 0} gente={<>{[-150, -80, -10, 60, 130, 190].map((ox, k) => <circle key={k} cx={ox} cy={-70} r={22} fill={["#f2b48a", "#c98b62", "#8d5a3b"][k % 3]} opacity={t > 391.7 + k * 0.08 ? 1 : 0} />)}</>} />
          {t >= 390.5 && <Splash x={960} y={700} t={t} t0={390.5} s={2.2} />}
          <Chico x={1560} y={interpolate(t, [391.7, 392.4], [1150, 980], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} h={760} t={t} expr="miedo" bD={160} bI={160} cD={10} cI={10} />
          <Chip t={t} t0={391.2} text="6 MEN JUMP IN" color={C.violeta} x={760} y={150} centro size={60} />
          <Chip t={t} t0={392.5} text="5 ROW" color={C.noche} x={760} y={250} centro size={56} />
          <Chip t={t} t0={393.6} text="YOU ARE ONE OF THEM →" color={C.lima} tinta={C.noche} x={1150} y={400} centro size={50} />
        </>
      );
    },
  },
  // «the harpooner stands up and throws. The iron goes in, and the whale, quite reasonably, panics. It dives, or it runs.»
  {
    a: 416.9, b: 427.2,
    fondo: (t) => <Mar t={t} y={560} cielo={["#8ab0d0", "#d0e4f0"]} />,
    d: (t) => {
      const lanza = t > 420.3;
      return (
        <>
          <Cachalote x={1450} y={680} t={t} s={1.0} flip nada={t > 425.1 ? 1 : 0.3} boca={t > 423.6 ? 1 : 0} arpones={t > 421.4 ? 1 : 0} rot={t > 425.3 ? interpolate(t, [425.3, 426.4], [0, 30], { extrapolateRight: "clamp" }) : 0} />
          <Persona x={480} y={1290} h={1060} t={t} seed={77} ropa={MARINO(6)} casco="no" pantalon="#2a2a3a" expr={lanza ? "enojado" : "neutro"} salta={419.3} bD={lanza ? 60 : 160} cD={lanza ? 10 : 40} inclina={lanza ? 10 : -6} manoD={!lanza ? <g transform="rotate(-100) scale(1.4)"><Arpon x={0} y={0} /></g> : undefined} />
          {lanza && <Vuela t={t} t0={420.3} t1={421.3} x0={600} y0={400} x1={1300} y1={600} arco={200} giro={30} s={1.6}><g transform="rotate(10)"><Arpon x={0} y={0} /></g></Vuela>}
          {t >= 421.4 && <Splash x={1300} y={620} t={t} t0={421.4} s={1.6} />}
          <Chip t={t} t0={418.8} text="THE HARPOONER" color={C.violeta} x={960} y={140} centro size={60} />
          <Rot t={t} t0={421.4} t1={423.4} text="THE IRON GOES IN" x={960} y={280} size={96} color={C.crema} />
          <Rot t={t} t0={424.2} text="IT PANICS" x={1250} y={280} size={130} color={C.rojo} tiembla />
          <Chip t={t} t0={425.3} text="DIVES…" color={C.teal} tinta={C.noche} x={1300} y={980} centro size={54} />
          <Chip t={t} t0={426.4} text="…OR RUNS" color={C.rojo} x={1650} y={980} centro size={54} />
        </>
      );
    },
  },
  // «It happened all the time, and that was the easy part.»
  {
    a: 483.1, b: 486.1,
    fondo: (t) => <Mar t={t} y={380} />,
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 660, top: 640 + Math.sin(t * 2) * 10, width: 600, height: 50, background: "#c9a06a", border: "6px solid #5a3418", transform: `rotate(${Math.sin(t * 1.4) * 4}deg)` }} />
        <Chico x={960} y={1060 + Math.sin(t * 2) * 10} h={760} t={t} expr="triste" bD={150} bI={150} cD={60} cI={60} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "rgba(30,90,140,.75)" }} />
        <Chip t={t} t0={483.4} text="IT HAPPENED ALL THE TIME" color={C.violeta} x={960} y={150} centro size={58} />
        <Rot t={t} t0={484.6} text="…THE EASY PART" x={960} y={300} size={110} color={C.crema} />
      </>
    ),
  },
  // «The dead whale is dragged back and chained to the side of the ship. Now comes the cutting in. Men stand on a narrow plank over the water…»
  {
    a: 488.6, b: 498.1,
    fondo: (t) => <Mar t={t} y={640} cielo={["#ffb88a", "#ffe0c0"]} />,
    d: (t) => (
      <>
        {/* vuelta 7: el costado del barco se leía como un rectángulo negro → tablas, portas y borda */}
        <div style={{ position: "absolute", left: -40, top: 260, width: 2000, height: 420, background: "repeating-linear-gradient(180deg,#6a4630 0 40px,#3e2818 40px 46px)", borderTop: "26px solid #9a6a3a", boxShadow: "inset 0 -60px 0 #2a1e24" }} />
        {[240, 620, 1000, 1380, 1760].map((x) => <div key={x} style={{ position: "absolute", left: x - 34, top: 380, width: 68, height: 68, borderRadius: 34, background: "#1a2a3a", border: "10px solid #c8a040" }} />)}
        <Cachalote x={interpolate(t, [488.8, 491.3], [2300, 960], { extrapolateRight: "clamp" })} y={760} t={t} s={1.0} flip={false} />
        {t >= 490.3 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{[700, 1200].map((x, k) => <path key={k} d={`M ${x} 680 L ${x + 20} 760`} stroke="#8a8a9a" strokeWidth={14} strokeDasharray="20 8" opacity={prog(t, 490.3 + k * 0.2, 490.6 + k * 0.2)} />)}</svg>}
        <div style={{ position: "absolute", left: 300, top: 640, width: 1300, height: 30, background: "#9a6a3a", border: "6px solid #5a3418", opacity: prog(t, 493.8, 494.2) }} />
        {t >= 493.8 && [0, 1, 2].map((k) => k === 1
          ? <Chico key={k} x={600 + k * 360} y={644} h={560} t={t} expr="miedo" bD={110} cD={60} inclina={Math.sin(t * 3 + k) * 6} />
          : <Marino key={k} i={k} x={600 + k * 360} y={644} h={560} t={t} expr="neutro" bD={110} cD={60} inclina={Math.sin(t * 3 + k) * 6} />)}
        {t < 493.8 && <Marino i={4} x={1730} y={1300} h={920} t={t} expr={t < 490.3 ? "orgullo" : "neutro"} flip mira={-1} bD={t > 490.3 ? 140 : 60} cD={t > 490.3 ? 20 : 100} salta={490.4} manoD={<line x1={0} y1={0} x2={0} y2={-200} stroke="#8a8a9a" strokeWidth={14} strokeDasharray="22 8" />} />}
        <Chip t={t} t0={489.4} text="DRAGGED BACK" color={C.violeta} x={960} y={130} centro size={54} />
        <Chip t={t} t0={490.3} text="CHAINED TO THE SHIP" color={C.noche} x={960} y={120} centro size={50} />
        <Rot t={t} t0={492.4} t1={493.6} text="THE CUTTING IN" x={960} y={60} size={90} color={C.crema} />
        <Chip t={t} t0={494.7} text="A NARROW PLANK OVER THE WATER" color={C.rojo} x={960} y={930} centro size={48} />
      </>
    ),
  },
  // «pulled up by ropes, swinging over the deck. Meanwhile, below you… the sharks have arrived. Dozens of them.»
  {
    a: 504.6, b: 513.7,
    fondo: () => <><Grad c1="#8ab0d0" c2="#c8dcec" /><div style={{ position: "absolute", left: 0, right: 0, top: 560, bottom: 0, background: "linear-gradient(180deg,#2a7a9a,#0e3a5a)" }} /></>,
    d: (t) => {
      const abajo = t > 507.5;
      const pend = Math.sin(t * 1.8) * 22;
      return (
        <>
          {!abajo && (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><g transform={`rotate(${pend} 1100 -40)`}><line x1={1100} y1={-40} x2={1100} y2={420} stroke="#e8d28a" strokeWidth={10} /><path d="M 1000 420 Q 1100 380 1200 420 L 1220 760 Q 1100 800 980 760 Z" fill="#f0d0b0" stroke="#a87a5a" strokeWidth={8} /></g></svg>
              <Chico x={560} y={1290} h={1000} t={t} expr="miedo" bD={150} bI={150} cD={30} cI={30} inclina={-10 + pend * 0.3} />
              <Chip t={t} t0={504.9} text="PULLED UP BY ROPES" color={C.violeta} x={560} y={140} centro size={54} />
              <Chip t={t} t0={506.1} text="SWINGING OVER THE DECK" color={C.rojo} x={560} y={240} centro size={50} />
            </>
          )}
          {abajo && (
            <>
              {Array.from({ length: Math.round(interpolate(t, [509.9, 511.7], [2, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) }, (_, k) => { const a = t * (0.6 + k * 0.07) + k * 1.7; return <Tiburon key={k} x={960 + Math.cos(a) * (300 + (k % 4) * 150)} y={820 + Math.sin(a) * (120 + (k % 3) * 40)} t={t} s={0.6} flip={Math.sin(a) > 0} boca={Math.abs(Math.sin(t * 4 + k))} />; })}
              <Chico x={960} y={660} h={480} t={t} expr="miedo" mira={0} miraY={1} bD={150} bI={150} cD={20} cI={20} inclina={Math.sin(t * 5) * 5} />
              <div style={{ position: "absolute", left: 600, top: 660, width: 720, height: 26, background: "#9a6a3a", border: "6px solid #5a3418" }} />
              <Chip t={t} t0={507.6} text="MEANWHILE, BELOW YOU…" color={C.noche} x={960} y={110} centro size={54} />
              <Monto t={t} ks={[[509.9, 2], [511.2, 12], [511.7, 24]]} x={1460} y={330} size={100} pre="" suf=" SHARKS" color={C.crema} />
              <Chip t={t} t0={512.5} text="EATING THE WHALE TOO" color={C.rojo} x={1460} y={440} centro size={46} />
            </>
          )}
        </>
      );
    },
  },
  // «boil the blubber in huge iron pots… the fuel? The crispy leftover scraps. The whale burns itself… day and night, three days straight.»
  {
    a: 530.4, b: 544.1,
    fondo: () => <Grad c1="#1a0e1a" c2="#4a1e14" />,
    d: (t) => {
      const dias = Math.min(3, Math.floor(interpolate(t, [541.2, 543.4], [1, 3.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
      return (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            {[760, 1240].map((x, k) => (
              <g key={k}>
                <path d={`M ${x - 200} 520 Q ${x - 210} 760 ${x} 780 Q ${x + 210} 760 ${x + 200} 520 Z`} fill="#3a3a44" stroke="#14141a" strokeWidth={10} />
                <ellipse cx={x} cy={520} rx={200} ry={40} fill="#d8b050" />
                {Array.from({ length: 6 }, (_, j) => { const u = ((t * 0.9 + j / 6 + k * 0.3) % 1); return <circle key={j} cx={x - 120 + j * 48} cy={520 - u * 80} r={14 - u * 8} fill="#f0d070" opacity={1 - u} />; })}
                {Array.from({ length: 7 }, (_, j) => { const f = Math.sin(t * 12 + j + k) * 20; return <path key={j} d={`M ${x - 150 + j * 50} 900 Q ${x - 160 + j * 50 + f} 830 ${x - 140 + j * 50} 780 Q ${x - 120 + j * 50} 840 ${x - 110 + j * 50} 900 Z`} fill={j % 2 ? "#ffb020" : "#ff5a1a"} />; })}
              </g>
            ))}
            <rect x={460} y={880} width={1100} height={140} fill="#a8443a" stroke="#5a2018" strokeWidth={8} />
          </svg>
          <Humo x={1000} y={460} t={t} s={2} n={14} col="#141010" op={0.7} />
          <Chico x={300} y={1290} h={980} t={t} expr="enojado" bD={110 + Math.sin(t * 4) * 20} cD={60} manoD={<line x1={0} y1={0} x2={0} y2={-260} stroke="#5a3418" strokeWidth={12} />} />
          {t >= 535.8 && Array.from({ length: 6 }, (_, k) => <Vuela key={k} t={t} t0={535.9 + k * 0.25} t1={536.6 + k * 0.25} x0={1720} y0={1000} x1={800 + (k % 2) * 440} y1={880} arco={300} giro={200} queda={false}><rect x={-26} y={-16} width={52} height={32} rx={8} fill="#b8783a" /></Vuela>)}
          <Marino i={2} x={1700} y={1290} h={900} t={t} expr="neutro" flip bD={t > 535.8 ? 110 + Math.sin(t * 6) * 30 : 30} cD={60} />
          <Chip t={t} t0={531.2} text="BOIL THE BLUBBER → OIL" color={C.ambar} tinta={C.noche} x={960} y={110} centro size={56} />
          <Dice t={t} t0={534.4} t1={535.7} text="FUEL?" x={1500} y={420} size={60} cola="der" />
          <Chip t={t} t0={536.2} text="THE CRISPY SCRAPS" color={C.tierra} x={960} y={210} centro size={50} />
          <Rot t={t} t0={538.8} t1={540.3} text="THE WHALE BURNS ITSELF" x={1100} y={340} size={78} color={C.rojo} tiembla />
          {t >= 540.4 && <Monto t={t} ks={[[541.2, 1], [542.3, 2], [543.2, 3]]} x={960} y={340} size={120} pre="DAY " color={C.crema} />}
          {t >= 540.4 && <Chip t={t} t0={540.5} text={dias >= 3 ? "3 DAYS STRAIGHT" : "DAY AND NIGHT"} color={C.noche} x={1560} y={250} centro size={52} />}
        </>
      );
    },
  },
  // «the oil is poured into wooden barrels and stored below. And you do all of this again, and again, for four years, until the ship is full.»
  {
    a: 569.7, b: 578.2,
    fondo: () => <Grad c1="#3a2414" c2="#1e120a" />,
    d: (t) => {
      const n = Math.round(interpolate(t, [570.0, 577.5], [3, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return (
        <>
          {Array.from({ length: n }, (_, k) => <Svg key={k} x={1010 + (k % 6) * 150} y={960 - Math.floor(k / 6) * 150} s={2.3}><Barril0 /></Svg>)}
          <Chico x={500} y={1290} h={1000} t={t} expr={t > 576.8 ? "triste" : "neutro"} bD={110 + Math.sin(t * 5) * 20} cD={70} inclina={Math.sin(t * 5) * 4} />
          {t < 574 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d={`M 1010 0 Q ${1020 + Math.sin(t * 9) * 8} 400 1010 ${900 - Math.floor((n - 1) / 6) * 150}`} stroke="#e0b040" strokeWidth={26} fill="none" opacity={0.9} /></svg>}
          <Chip t={t} t0={570.3} text="INTO WOODEN BARRELS" color={C.ambar} tinta={C.noche} x={1380} y={130} centro size={54} />
          <Rot t={t} t0={573.9} t1={576.6} text="AGAIN… AND AGAIN…" x={1380} y={290} size={90} color={C.crema} />
          <Monto t={t} ks={[[575.6, 0], [575.9, 4]]} x={1380} y={420} size={100} pre="" suf=" YEARS" color={C.oro} />
          <Sello t={t} t0={577.2} text="UNTIL THE SHIP IS FULL" x={1380} y={290} size={56} rot={-4} />
        </>
      );
    },
  },
  // «the captain. Out here, there is no police, no judge, no newspaper.»
  {
    a: 579.6, b: 584.8,
    fondo: (t) => <Rayos2 t={t} c1="#1d2a52" c2="#141e3e" cx={600} />,
    d: (t) => (
      <>
        <Persona x={560} y={1290} h={1100} t={t} seed={11} ropa={CAPITAN} casco="capitan" barba="#3a2616" pantalon="#141a30" expr={t > 581.6 ? "enojado" : "orgullo"} bD={t > 581.6 ? 140 : 30} bI={30} cD={t > 581.6 ? 20 : 110} cI={110} salta={579.8} manoD={t > 581.6 ? <g transform="rotate(-20)"><rect x={-60} y={-160} width={120} height={160} rx={8} fill="#5a2418" stroke={C.noche} strokeWidth={6} /><text y={-70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill={C.oro}>LOG</text></g> : undefined} />
        <Rot t={t} t0={580.0} t1={581.5} text="THE CAPTAIN" x={1350} y={300} size={110} color={C.oro} />
        {[["NO POLICE", 581.7], ["NO JUDGE", 582.8], ["NO NEWSPAPER", 583.7]].map(([w, t0], k) => (
          <div key={k} style={{ position: "absolute", left: 1330, top: 330 + k * 170, transform: `translate(-50%,-50%) scale(${ent(t, t0 as number)})`, fontFamily, fontWeight: 700, fontSize: 80, color: C.crema, WebkitTextStroke: `7px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
            {w as string}
            <div style={{ position: "absolute", left: -20, right: -20, top: "48%", height: 14, background: C.rojo, transform: `scaleX(${prog(t, (t0 as number) + 0.2, (t0 as number) + 0.45)})`, transformOrigin: "0 50%" }} />
          </div>
        ))}
      </>
    ),
  },
  // «The book about the whale was, in part, inspired by our final trap, a real ship from Nantucket.»
  {
    a: 654.4, b: 660.3,
    fondo: (t) => <Rayos2 t={t} c1="#1d3a6a" c2="#163060" />,
    d: (t) => (
      <>
        <Persona x={460} y={1290} h={1050} t={t} seed={33} ropa={MARINO(5)} casco="no" barba="#5a3a1a" pantalon="#2a2a3a" expr="orgullo" bD={100} cD={50} manoD={<g transform="rotate(-10)"><rect x={-70} y={-200} width={140} height={190} rx={8} fill="#1d3a6a" stroke={C.noche} strokeWidth={6} /><rect x={-50} y={-180} width={100} height={12} fill={C.oro} /><rect x={-50} y={-40} width={100} height={12} fill={C.oro} /></g>} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d={`M 760 420 Q 960 300 ${760 + 400 * prog(t, 656.5, 657.2)} ${420 - 40 * prog(t, 656.5, 657.2)}`} stroke={C.oro} strokeWidth={14} fill="none" strokeLinecap="round" /></svg>
        {t >= 657.4 && <Ballenero x={1420} y={640} t={t} escala={0.42 * ent(t, 657.5)} nombre="ESSEX" />}
        <Chip t={t} t0={654.6} text="MOBY-DICK" color={C.noche} x={460} y={150} centro size={56} />
        <Chip t={t} t0={656.5} text="INSPIRED BY…" color={C.violeta} x={960} y={160} centro size={60} />
        <Rot t={t} t0={658.4} text="A REAL SHIP" x={1420} y={930} size={110} color={C.crema} />
      </>
    ),
  },
];
