import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza } from "./kit";
import { Trampas } from "./kit2";
import { Mundo, K, En, SUELO } from "./mundo";
import { Base, FX } from "./base";
import { COLONO, POW, SMITH, Poste, Canasta, Cuentas, Hacha, Choclo, Nieve, Anillos, Rayo } from "./kitj";
import { Globo, Tacha } from "./kitj2";

// TRAMPA 5 · LOS VECINOS (439,3-550,6 s). Tsenacommacah y Wahunsenacah (Powhatan); el maíz por cobre y cuentas;
// la sequía también vacía sus campos; Smith capturado; la versión de Smith (Pocahontas) en un libro de cuentos con signo
// de pregunta; la comida que llega al fuerte; la relación que sube y baja; otoño de 1609.
export const CAM5: K[] = [
  [439.4, 24100, 620, 0.55], [440.6, 28200, 660, 0.85], [441.8, 28200, 660, 0.85], [443.4, 26400, 600, 0.3], [451.6, 26600, 600, 0.3],
  [452.6, 28200, 720, 1.3], [457.0, 28200, 720, 1.35], [458.2, 24350, 680, 0.85], [461.9, 24350, 680, 0.9], [463.2, 26200, 700, 0.95],
  [471.4, 26300, 700, 0.95], [472.4, 26300, 700, 0.9], [477.2, 29500, 790, 1.15], [479.9, 29500, 790, 1.2], [481.0, 28800, 720, 1.05],
  [487.4, 28750, 720, 1.1], [488.6, 28200, 700, 1.25], [494.2, 28200, 700, 1.3], [495.4, 25600, 680, 0.85], [499.2, 26700, 680, 0.95],
  [503.4, 28000, 680, 0.85], [504.6, 28150, 700, 0.95], [522.3, 28150, 700, 0.95], [524.6, 26800, 640, 0.6], [534.8, 25300, 640, 0.6],
  [536.4, 24800, 620, 0.5], [545.9, 25200, 620, 0.48], [549.8, 24600, 600, 0.36],
];
const CIELO5: [number, string][] = [[439.0, "verano"], [457.0, "primavera"], [471.7, "verano"], [494.4, "invierno"], [522.4, "primavera"], [546.0, "tormenta"]];

const PUEBLO = [27400, 27520, 27900, 28020, 28480, 28600, 29000, 29120];
const ALDEA_CHICOS = [27700, 28390, 28950];

export const P5: React.FC<{ t: number }> = ({ t }) => {
  if (t < 439.2 || t > 550.8) return null;
  const jefe = 28200;
  // Smith capturado: camina río arriba, lo rodean y lo llevan
  const smX = interpolate(t, [495.4, 498.9, 500.2, 503.4], [25200, 26650, 26650, 27980], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const capt = t > 499.0 && t < 504.6;
  const caravana = t > 524.6 && t < 535.2;
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM5} cielo={CIELO5}>
        <Base t={t} />
        {t < 451.6 && <En x={28200} w={900}><Poste t={t} t0={439.4} x={28200} y={SUELO + 10} n={5} titulo="THE NEIGHBORS" s={1.25} /></En>}
        {/* el pueblo: gente que vive acá */}
        {t < 494.4 && PUEBLO.map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={300} t={t} seed={500 + i} ropa={POW(i)} plumaPelo={i % 2 === 0} flip={x > jefe} expr={t > 477 && t < 487.6 ? "triste" : "neutro"} flaco={t > 477 && t < 487.6 ? 0.25 : 0} /></En>)}
        {t < 494.4 && ALDEA_CHICOS.map((x, i) => <En key={x} x={x} w={150}><Persona x={x} y={SUELO} h={190} t={t} seed={520 + i} ropa={POW(i + 1)} expr={t > 484.5 && t < 487.6 ? "triste" : "feliz"} /></En>)}
        {/* Wahunsenacah en su estrado */}
        {t < 524.6 && (
          <En x={jefe} w={400}>
            <svg style={{ position: "absolute", left: jefe - 150, top: SUELO - 60, overflow: "visible" }} width={300} height={60}><rect x={0} y={0} width={300} height={60} rx={10} fill="#8a6a3a" stroke="#5a3a1a" strokeWidth={6} />{[0, 1, 2, 3].map((i) => <line key={i} x1={20 + i * 80} y1={10} x2={60 + i * 80} y2={50} stroke="#5a3a1a" strokeWidth={5} />)}</svg>
            <Persona x={jefe} y={SUELO - 60} h={360} t={t} seed={540} ropa={POW(2)} viejo plumaPelo capa="#6a3a1a" expr={t > 487.6 && t < 494.4 ? "enojado" : t > 503 && t < 504.8 ? "orgullo" : "neutro"} habla={t > 491.3 && t < 493.7} />
          </En>
        )}
        {/* los colonos con los cuencos vacíos */}
        {t > 457.8 && t < 462.2 && [24000, 24150, 24600, 24750].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={230} t={t} seed={550 + i} ropa={COLONO(i)} expr="triste" flaco={0.2} bD={70} cD={60} manoD={<path d="M -24 -4 L 24 -4 Q 20 22 0 24 Q -20 22 -24 -4 Z" fill="#a0683a" stroke="#4e2a12" strokeWidth={4} />} /></En>)}
        {/* el trueque en el borde del bosque */}
        {t > 462.0 && t < 471.8 && (
          <>
            {[25900, 26050].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={260} t={t} seed={560 + i} ropa={COLONO(i + 2)} expr={t > 464.6 && t < 466.3 && i === 1 ? "orgullo" : "feliz"} bD={70} cD={20} camina={i === 1 && t > 464.8 && t < 466.2 ? 2 : 0} flip={i === 1 && t > 464.8 && t < 466.2} /></En>)}
            {[26550, 26700].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={270} t={t} seed={570 + i} ropa={POW(i)} plumaPelo flip expr={t > 464.8 && t < 466.3 ? "enojado" : "neutro"} bI={60} cI={20} /></En>)}
            <Canasta x={t > 464.8 && t < 466.3 ? interpolate(t, [464.8, 466.2], [26330, 25700]) : 26420} y={SUELO - 120} s={0.42} />
            {t > 467.0 && <><svg style={{ position: "absolute", left: 26120, top: SUELO - 220, overflow: "visible", transform: `scale(${ent(t, 467.09)})` }} width={60} height={60}><path d="M 0 30 L 40 0 L 70 20 L 30 54 Z" fill="#d07a3a" stroke="#8a4a1a" strokeWidth={4} /></svg>
              {t > 467.7 && <Cuentas x={26230} y={SUELO - 160} s={0.35} t0={467.75} t={t} />}
              {t > 468.4 && <svg style={{ position: "absolute", left: 26180, top: SUELO - 290, overflow: "visible", transform: `scale(${ent(t, 468.41)})` }} width={60} height={60}><rect x={0} y={20} width={60} height={10} fill="#6a7484" /><rect x={50} y={0} width={10} height={50} fill="#6a7484" /></svg>}
              {t > 469.5 && <Hacha x={26300} y={SUELO - 260} s={0.3} t0={469.51} t={t} />}</>}
          </>
        )}
        {/* los campos de maíz de los Powhatan también se secan */}
        {t > 476.8 && t < 480.3 && <En x={29550} w={700}><svg style={{ position: "absolute", left: 29150, top: SUELO - 200, overflow: "visible", opacity: prog(t, 478.2, 479.2) }} width={760} height={200}>{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${50 + i * 70} 200 q -40 -80 -20 -150 M ${50 + i * 70} 200 q 40 -60 30 -120`} stroke="#a08a4a" strokeWidth={10} fill="none" />)}</svg></En>}
        {/* la canasta que se va del plato de una familia */}
        {t > 480.2 && t < 487.6 && (() => { const u = prog(t, 481.0, 483.6); return <Canasta x={28950 - u * 900} y={SUELO - 140 - Math.sin(u * Math.PI) * 240} s={0.45} />; })()}
        {/* Smith río arriba, en invierno, capturado */}
        {t > 495.0 && t < 504.6 && (
          <En x={smX} w={500}>
            <Persona x={smX} y={SUELO} h={260} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" gorro="morion" camina={(t < 498.9 || (t > 500.2 && t < 503.4)) ? 1.4 : 0} expr={capt ? "miedo" : "neutro"} />
            {capt && [-170, -90, 90, 170].map((o, i) => <Persona key={o} x={smX + o} y={SUELO} h={280} t={t} seed={580 + i} ropa={POW(i)} plumaPelo flip={o > 0} camina={t > 500.2 && t < 503.4 ? 1.4 : 0} aparece={499.1 + i * 0.08} expr="enojado" />)}
            {t > 499.1 && t < 500.4 && <Emote t={t} t0={499.13} t1={500.4} tipo="susto" x={cabeza(smX, SUELO, 260).x} y={cabeza(smX, SUELO, 260).y} s={0.6} />}
          </En>
        )}
        {/* la comida que llega al fuerte: Pocahontas y otros */}
        {caravana && [0, 1, 2, 3, 4].map((i) => {
          const x = interpolate(t, [525.4 + i * 0.3, 533.6 + i * 0.3], [27000 + i * 150, 25100 + i * 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const nina = i === 0;
          return (
            <En key={i} x={x} w={250}>
              <Persona x={x} y={SUELO} h={nina ? 210 : 280} t={t} seed={nina ? 600 : 590 + i} ropa={POW(i)} plumaPelo flip camina={1.4} expr="feliz" bD={110} cD={60} />
              <Canasta x={x - 30} y={SUELO - (nina ? 230 : 300)} s={nina ? 0.26 : 0.32} />
              {nina && t > 526.4 && <div style={{ position: "absolute", left: x - 90, top: SUELO - 330, width: 180, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 26, color: "#fff", background: C.rosa, borderRadius: 10 }}>POCAHONTAS</div>}
            </En>
          );
        })}
        {caravana && t > 529 && [24900, 25040].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={230} t={t} seed={610 + i} ropa={COLONO(i)} expr="feliz" flaco={0.2} salta={Math.abs(Math.sin(t * 5 + i)) * 16} /></En>)}
        {t > 546.0 && <Rayo t={t} t0={548.7} x={24900} />}
      </Mundo>

      {/* pantalla */}
      {t < 444 && <Trampas t={t} t0={439.5} n={5} y={960} />}
      {t > 442.4 && t < 443.6 && <Grande t={t} t0={442.38} text="NOT ALONE" y={200} size={130} color={C.ambar} />}
      {/* Tsenacommacah */}
      {t > 444.5 && t < 451.8 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: ent(t, 444.6) * (1 - prog(t, 451.3, 451.8)) }}>
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <ellipse cx={960} cy={560} rx={760 * ent(t, 445.0)} ry={330 * ent(t, 445.0)} fill="rgba(200,149,90,.32)" stroke="#c8955a" strokeWidth={10} strokeDasharray="30 16" />
            {Array.from({ length: 30 }, (_, i) => { const a = i * 2.4, r = 120 + ((i * 97) % 520); const on = t > 447.8 + i * 0.03; return <g key={i} opacity={on ? 1 : 0} transform={`translate(${960 + Math.cos(a) * r} ${560 + Math.sin(a) * r * 0.42}) scale(${on ? ent(t, 447.8 + i * 0.03) : 0})`}><circle r={16} fill="#8a5a2e" stroke="#fff" strokeWidth={5} /></g>; })}
          </svg>
          <Chip t={t} t0={445.06} t1={451.8} text="TSENACOMMACAH" color="#8a5a2e" x={960} y={140} centro size={64} />
          <Chip t={t} t0={448.06} t1={451.8} text="~30 PEOPLES" color={C.tierra} x={660} y={930} centro size={52} />
          <Chip t={t} t0={449.84} t1={451.8} text="~15,000 PEOPLE" color={C.violeta} x={1260} y={930} centro size={52} />
        </div>
      )}
      <Chip t={t} t0={453.17} t1={455.3} text="WAHUNSENACAH" color="#8a5a2e" x={960} y={140} centro size={64} />
      <Chip t={t} t0={455.75} t1={457.0} text={'"POWHATAN"'} color={C.rojo} x={960} y={140} centro size={64} />
      <Chip t={t} t0={457.81} t1={459.4} text="THE UNCOMFORTABLE TRUTH" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={460.07} t1={462.0} text="NOT FEEDING THEMSELVES" color={C.rojo} x={960} y={930} centro size={56} />
      <Chip t={t} t0={463.37} t1={471.6} text="TRADE" color={C.lima} tinta={C.noche} x={760} y={140} centro size={56} />
      <Chip t={t} t0={464.75} t1={471.6} text="OR TAKE" color={C.rojo} x={1080} y={140} centro size={56} />
      <Chip t={t} t0={467.09} t1={471.6} text="COPPER" color={C.naranja} x={300} y={300} size={44} />
      <Chip t={t} t0={467.75} t1={471.6} text="BEADS" color={C.teal} tinta={C.noche} x={300} y={375} size={44} />
      <Chip t={t} t0={468.41} t1={471.6} text="IRON TOOLS" color="#6a7484" x={300} y={450} size={44} />
      <Chip t={t} t0={469.51} t1={471.6} text="HATCHETS" color="#4a4a54" x={300} y={525} size={44} />
      <Chip t={t} t0={470.31} t1={471.6} text="FOR FOOD" color={C.oro} tinta={C.noche} x={1400} y={300} size={56} />
      {t > 471.6 && t < 477.2 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${1 - prog(t, 476.7, 477.2)})`, transformOrigin: "960px 520px" }}>
          <Anillos t={t} t0={471.8} x={960} y={500} r={260} tMarca={472.3} />
        </div>
      )}
      <Chip t={t} t0={474.61} t1={477.1} text="HITTING EVERYONE" color={C.rojo} x={960} y={930} centro size={56} />
      <Chip t={t} t0={478.69} t1={480.1} text="THEIR FIELDS: LESS" color="#a08a4a" x={960} y={140} centro size={56} />
      <Chip t={t} t0={481.07} t1={487.5} text="EVERY BASKET THEY GIVE" color={C.oro} tinta={C.noche} x={960} y={140} centro size={54} />
      <Chip t={t} t0={482.03} t1={483.6} text="STRANGE" color="#6a6a7a" x={330} y={300} size={44} />
      <Chip t={t} t0={482.75} t1={483.6} text="HUNGRY" color={C.naranja} x={330} y={375} size={44} />
      <Chip t={t} t0={483.33} t1={484.5} text="DEMANDING" color={C.rojo} x={330} y={450} size={44} />
      {t > 485.2 && t < 487.6 && <Grande t={t} t0={485.47} text="= THEIR KIDS DON'T EAT" y={930} size={86} color="#ff5a6a" />}
      {t > 491.3 && t < 494.5 && <Globo t={t} t0={491.31} t1={494.4} x={1260} y={260} text="WHY KEEP FEEDING THEM?" size={44} cola="izq" />}
      <Chip t={t} t0={492.73} t1={494.4} text="THEY ARE TAKING YOUR LAND" color={C.rojo} x={960} y={930} centro size={54} />
      <Chip t={t} t0={494.53} t1={498.8} text="DECEMBER 1607" color="#6a8ab8" x={960} y={140} centro size={60} />
      <Chip t={t} t0={497.21} t1={498.8} text="UPRIVER, FOR FOOD" color={C.oro} tinta={C.noche} x={960} y={220} centro size={48} />
      {t > 499.0 && t < 500.3 && <Grande t={t} t0={499.13} text="CAPTURED" y={200} size={140} color="#ff5a6a" />}
      <Chip t={t} t0={500.79} t1={503.3} text="TOWN → TOWN → TOWN" color={C.tierra} x={960} y={140} centro size={54} />
      <Chip t={t} t0={502.63} t1={504.6} text="BEFORE POWHATAN" color="#8a5a2e" x={960} y={930} centro size={56} />
      {/* la versión de Smith: un libro de cuentos */}
      {t > 504.7 && t < 522.4 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: ent(t, 504.8) * (1 - prog(t, 521.9, 522.4)) }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(27,18,64,.55)" }} />
          <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 760, background: "#f1dfb6", border: "14px solid #6b3a1f", borderRadius: 24, overflow: "hidden", filter: "sepia(.55)", transform: `rotate(${-1.5 + Math.sin(t * 0.8) * 0.5}deg)` }}>
            <div style={{ position: "absolute", left: 0, top: 18, width: 1200, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, color: "#6b3a1f" }}>SMITH'S STORY</div>
            {/* Smith tendido en el piso */}
            <div style={{ position: "absolute", left: 470, top: 660, transform: "rotate(-90deg)", transformOrigin: "0 0" }}><Persona x={0} y={0} h={330} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" expr="miedo" /></div>
            {/* los garrotes en alto (sin golpe) */}
            {[340, 860].map((x, i) => <div key={x} style={{ position: "absolute", left: 0, top: 0 }}><Persona x={x} y={700} h={420} t={t} seed={620 + i} ropa={POW(i)} plumaPelo flip={i === 1} expr="enojado" bD={t > 507.6 && t < 512.9 ? 160 : 40} cD={20} manoD={<rect x={-10} y={-10} width={20} height={130} rx={10} fill="#5a3418" />} /></div>)}
            <Persona x={600} y={700} h={380} t={t} seed={540} ropa={POW(2)} viejo plumaPelo capa="#6a3a1a" expr="neutro" />
            {/* Pocahontas */}
            {t > 511.3 && (() => { const x = interpolate(t, [511.4, 512.9], [1250, 560], { extrapolateRight: "clamp" }); const tendida = t > 512.9; return tendida ? <div style={{ position: "absolute", left: 430, top: 610, transform: "rotate(-90deg)", transformOrigin: "0 0" }}><Persona x={0} y={0} h={240} t={t} seed={600} ropa={POW(0)} plumaPelo expr="miedo" /></div> : <Persona x={x} y={700} h={240} t={t} seed={600} ropa={POW(0)} plumaPelo flip camina={2.5} expr="miedo" />; })()}
            {t > 515.4 && <div style={{ position: "absolute", right: 60, top: 140, fontFamily, fontWeight: 700, fontSize: 300, color: C.rojo, lineHeight: 1, transform: `scale(${ent(t, 515.5)}) rotate(12deg)`, filter: "none" }}>?</div>}
          </div>
          <Chip t={t} t0={507.61} t1={511.0} text="ABOUT TO BE EXECUTED" color={C.rojo} x={960} y={930} centro size={52} />
          <Chip t={t} t0={511.69} t1={515.3} text="POCAHONTAS · ABOUT 11" color={C.rosa} x={960} y={930} centro size={52} />
          {[["REALLY HAPPENED?", 516.93], ["A CEREMONY HE MISUNDERSTOOD?", 519.43], ["MADE UP TO SELL BOOKS?", 521.31]].map(([s, t0], i) => (
            <Chip key={i} t={t} t0={t0 as number} t1={522.4} text={s as string} color={[C.teal, C.violeta, C.naranja][i]} tinta={i === 0 ? C.noche : undefined} x={960} y={895 + i * 62} centro size={40} />
          ))}
        </div>
      )}
      <Chip t={t} t0={522.69} t1={524.5} text="WHAT IS CERTAIN" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={525.01} t1={527.2} text="RELEASED" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={529.27} t1={530.6} text="CARRYING FOOD" color={C.oro} tinta={C.noche} x={960} y={930} centro size={56} />
      {t > 531.9 && t < 535.1 && <Grande t={t} t0={532.25} text="IT SAVED MANY" y={200} size={120} color={C.lima} />}
      {/* sube y baja */}
      {t > 535.0 && t < 546.0 && (
        <svg style={{ position: "absolute", left: 360, top: 150, opacity: ent(t, 535.1) * (1 - prog(t, 545.5, 546.0)) }} width={1200} height={380}>
          <rect width={1200} height={380} rx={28} fill="#fff3d6" stroke="#2a1408" strokeWidth={8} />
          <path d={`M 60 190 L 240 90 L 420 290 L 600 100 L 780 300 L 960 120 L 1140 260`} stroke={C.violeta} strokeWidth={16} fill="none" strokeLinejoin="round" strokeDasharray="2200" strokeDashoffset={2200 * (1 - prog(t, 535.2, 539.8))} />
          {[["GIFTS", 240, 70, 536.53], ["THREATS", 420, 340, 537.31], ["TRADING", 600, 80, 538.33], ["RAIDS", 780, 350, 539.09]].map(([s, x, y, t0]) => <text key={s as string} x={x as number} y={y as number} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill={(s === "THREATS" || s === "RAIDS") ? C.rojo : "#2a7a3a"} opacity={prog(t, t0 as number, (t0 as number) + 0.2)}>{s as string}</text>)}
        </svg>
      )}
      {t > 541.4 && t < 546.0 && <Grande t={t} t0={543.21} text="THE ENGLISH DEPEND ON THEM" y={720} size={80} color={C.ambar} />}
      <Chip t={t} t0={544.47} t1={546.0} text="NOT THE OTHER WAY AROUND" color={C.rojo} x={960} y={860} centro size={50} />
      <Chip t={t} t0={546.91} t1={550.6} text="AUTUMN 1609" color={C.naranja} x={960} y={140} centro size={60} />
      {t > 548.7 && <Grande t={t} t0={548.71} text="EVERYTHING GOES WRONG" y={930} size={96} color="#ff5a6a" />}
      {t > 494.4 && t < 504.8 && <Nieve t={t} n={60} op={0.7} />}
    </AbsoluteFill>
  );
};
