import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza } from "./kit";
import { Trampas, Lluvia } from "./kit2";
import { Mundo, K, En, SUELO } from "./mundo";
import { Base, FX } from "./base";
import { COLONO, POW, SMITH, Poste, Canasta, Cuentas, Hacha, Choclo, Nieve, Anillos, Rayo } from "./kitj";
import { Globo, Tacha } from "./kitj2";
import { Vineta, Rotulo } from "./vineta";

// TRAMPA 5 · LOS VECINOS (439,3-550,6 s). Tsenacommacah y Wahunsenacah (Powhatan); el maíz por cobre y cuentas;
// la sequía también vacía sus campos; Smith capturado; la versión de Smith (Pocahontas) en un libro de cuentos con signo
// de pregunta; la comida que llega al fuerte; la relación que sube y baja; otoño de 1609.
export const CAM5: K[] = [
  [439.4, 24100, 620, 0.55], [440.6, 28200, 660, 0.85], [441.8, 28200, 660, 0.85], [443.4, 27950, 690, 0.72], [451.6, 28150, 690, 0.8],
  [452.6, 28200, 720, 1.3], [457.0, 28200, 720, 1.35], [458.2, 24350, 680, 0.85], [461.9, 24350, 680, 0.9], [463.2, 26200, 700, 0.95],
  [471.4, 26300, 700, 0.95], [472.4, 26300, 700, 0.9], [477.2, 29500, 790, 1.15], [479.9, 29500, 790, 1.2], [481.0, 28800, 720, 1.05],
  [487.4, 28750, 720, 1.1], [488.6, 28200, 700, 1.25], [494.2, 28200, 700, 1.3], [495.4, 25600, 680, 0.85], [499.2, 26700, 680, 0.95],
  [503.4, 28000, 680, 0.85], [504.6, 28150, 700, 0.95], [522.3, 28150, 700, 0.95], [524.6, 26950, 700, 0.95], [533.6, 25450, 700, 0.95], [534.8, 25300, 660, 0.8],
  [536.4, 24800, 620, 0.5], [545.9, 24500, 690, 0.72], [549.8, 24400, 690, 0.8],
];
const CIELO5: [number, string][] = [[439.0, "verano"], [457.0, "primavera"], [471.7, "verano"], [494.4, "invierno"], [522.4, "primavera"], [546.0, "tormenta"]];

const PUEBLO = [27400, 27520, 27900, 28020, 28480, 28600, 29000, 29120];
const ALDEA_CHICOS = [27700, 28390, 28950];

export const P5: React.FC<{ t: number }> = ({ t }) => {
  if (t < 439.2 || t > 550.8) return null;
  const jefe = 28200;
  // Smith capturado: camina río arriba, lo rodean y lo llevan
  const smX = interpolate(t, [494.6, 498.9, 500.2, 503.4], [25350, 26650, 26650, 27980], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
        {t > 476.8 && t < 494.4 && <En x={29550} w={700}><svg style={{ position: "absolute", left: 29150, top: SUELO - 200, overflow: "visible", opacity: prog(t, 477.0, 478.0) }} width={760} height={200}>{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${50 + i * 70} 200 q -40 -80 -20 -150 M ${50 + i * 70} 200 q 40 -60 30 -120`} stroke="#a08a4a" strokeWidth={10} fill="none" />)}</svg></En>}
        {/* una madre esconde su canasta y abraza al hijo */}
        {t > 483.8 && t < 487.6 && <En x={28650} w={500}>
          <Persona x={28700} y={SUELO} h={290} t={t} seed={545} ropa={POW(3)} flip expr="triste" inclina={-10} bD={70} cD={80} mira={-0.5} aparece={483.9} manoD={<path d="M -40 30 Q -50 -20 0 -26 Q 50 -20 40 30 Z" fill="#c8a868" stroke="#6a4a2a" strokeWidth={6} />} />
          <Persona x={28560} y={SUELO} h={170} t={t} seed={546} ropa={POW(1)} expr="triste" miraY={-0.6} mira={0.5} aparece={484.0} />
        </En>}
        {/* la canasta que se va del plato de una familia */}
        {t > 480.2 && t < 487.6 && (() => { const u = prog(t, 481.0, 483.6); return <Canasta x={28950 - u * 900} y={SUELO - 140 - Math.sin(u * Math.PI) * 240} s={0.45} />; })()}
        {/* Smith río arriba, en invierno, capturado */}
        {t > 494.4 && t < 504.6 && (
          <En x={smX} w={500}>
            {[1, 2].map((k) => { const huye = t > 499.3; const x = huye ? smX - 120 * k - (t - 499.3) * 700 : smX - 130 * k; return <Persona key={`c${k}`} x={x} y={SUELO} h={240} t={t} seed={585 + k} ropa={COLONO(k)} flaco={0.5} flip={huye} camina={t < 498.9 || huye ? 1.6 : 0} expr={huye ? "miedo" : "triste"} manoD={<ellipse cx={0} cy={20} rx={30} ry={22} fill="#c8b08a" stroke="#6a4a2a" strokeWidth={4} />} />; })}
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
              {nina && t > 526.4 && <div style={{ position: "absolute", left: x - 200, top: SUELO - 380, width: 400, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 60, color: "#fff", background: C.rosa, borderRadius: 12, padding: "2px 0" }}>POCAHONTAS</div>}
            </En>
          );
        })}
        {caravana && t > 529 && [24900, 25040].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={230} t={t} seed={610 + i} ropa={COLONO(i)} expr="feliz" flaco={0.2} salta={Math.abs(Math.sin(t * 5 + i)) * 16} /></En>)}
        {t > 546.0 && <Rayo t={t} t0={547.0} x={24900} />}
        {t > 546.0 && <Rayo t={t} t0={548.7} x={23900} />}
        {/* todo sale mal a la vez: corren a refugiarse */}
        {t > 546.1 && [0, 1, 2, 3, 4].map((i) => { const x = interpolate(t, [546.2, 550.6], [23700 + i * 170, 24250 + i * 170 + (i % 2 ? 200 : -100)]); return <En key={`c${i}`} x={x} w={200}><Persona x={x} y={SUELO} h={250} t={t} seed={580 + i} ropa={COLONO(i)} flaco={0.3} expr={i % 2 ? "miedo" : "sorpresa"} camina={2.2} bD={160} bI={150} cD={30} cI={30} flip={i % 2 === 1} /></En>; })}
      </Mundo>

      {/* pantalla */}
      {t < 444 && <Trampas t={t} t0={439.5} n={5} y={960} />}
      {t > 442.4 && t < 443.6 && <Grande t={t} t0={442.38} text="NOT ALONE" y={200} size={130} color={C.ambar} />}
      {/* Tsenacommacah: mapa de la tierra Powhatan con sus ~30 pueblos */}
      {t > 444.5 && t < 451.8 && (() => {
        const e = ent(t, 444.6) * (1 - prog(t, 451.3, 451.8));
        const rios = ["M 80 470 Q 300 420 520 330 T 980 160", "M 60 300 Q 260 280 420 220 T 760 90", "M 120 560 Q 420 540 640 470 T 1060 380"];
        return (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(27,18,64,.5)", opacity: e }} />
            <div style={{ position: "absolute", left: 380, top: 220, width: 1160, height: 640, transform: `scale(${e}) rotate(-1.5deg)`, background: "#f1dfb6", border: "12px solid #6b3a1f", borderRadius: 26, overflow: "hidden", boxShadow: "0 16px 0 rgba(20,10,40,.4)" }}>
              <svg width={1136} height={616} style={{ position: "absolute", left: 0, top: 0 }}>
                <path d="M 0 0 L 160 0 Q 120 200 180 340 Q 120 480 160 616 L 0 616 Z" fill="#8ab8d8" />
                {rios.map((d, i) => <path key={i} d={d} stroke="#7ab0d8" strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - prog(t, 444.6 + i * 0.15, 445.6 + i * 0.15))} />)}
                <path d="M 230 80 Q 700 10 1060 120 Q 1110 380 980 560 Q 600 610 230 540 Q 190 300 230 80 Z" fill="rgba(200,149,90,.25)" stroke="#a0683a" strokeWidth={8} strokeDasharray="26 14" opacity={prog(t, 444.9, 445.5)} />
                {Array.from({ length: 30 }, (_, i) => { const x = 270 + ((i * 271) % 760), y = 120 + ((i * 137) % 400); const on = prog(t, 445.3 + i * 0.05, 445.6 + i * 0.05); return <g key={i} transform={`translate(${x} ${y}) scale(${on})`}><path d="M -22 10 L -22 -4 Q 0 -26 22 -4 L 22 10 Z" fill="#b08a5a" stroke="#5a3a1a" strokeWidth={4} /><rect x={-6} y={0} width={12} height={10} fill="#3a2416" /></g>; })}
                <g transform={`translate(840 250) scale(${prog(t, 449.6, 450.0)})`}><circle r={30} fill={C.rojo} stroke="#fff" strokeWidth={6} /><path d="M -12 -2 L 0 -18 L 12 -2 L 8 14 L -8 14 Z" fill="#ffd34a" /></g>
                <text x={250} y={600} fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#2a4a6a">CHESAPEAKE BAY</text>
              </svg>
            </div>
            <Chip t={t} t0={445.06} t1={451.8} text="TSENACOMMACAH" color="#8a5a2e" x={960} y={140} centro size={64} />
            <Chip t={t} t0={448.06} t1={451.8} text="~30 PEOPLES" color={C.tierra} x={660} y={950} centro size={54} />
            <Chip t={t} t0={449.84} t1={451.8} text="~15,000 PEOPLE" color={C.violeta} x={1260} y={950} centro size={54} />
          </div>
        );
      })()}
      <Chip t={t} t0={453.17} t1={455.3} text="WAHUNSENACAH" color="#8a5a2e" x={960} y={140} centro size={64} />
      <Chip t={t} t0={455.75} t1={457.0} text={'"POWHATAN"'} color={C.rojo} x={960} y={140} centro size={64} />
      <Chip t={t} t0={457.81} t1={459.4} text="THE UNCOMFORTABLE TRUTH" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={460.07} t1={462.0} text="NOT FEEDING THEMSELVES" color={C.rojo} x={960} y={930} centro size={56} />
      <Chip t={t} t0={463.37} t1={471.6} text="TRADE" color={C.lima} tinta={C.noche} x={760} y={140} centro size={56} />
      <Chip t={t} t0={464.75} t1={471.6} text="OR TAKE" color={C.rojo} x={1080} y={140} centro size={56} />
      <Chip t={t} t0={467.09} t1={471.6} text="COPPER" color={C.naranja} x={300} y={290} size={44} />
      <Chip t={t} t0={467.75} t1={471.6} text="BEADS" color={C.teal} tinta={C.noche} x={300} y={378} size={44} />
      <Chip t={t} t0={468.41} t1={471.6} text="IRON TOOLS" color="#6a7484" x={300} y={466} size={44} />
      <Chip t={t} t0={469.51} t1={471.6} text="HATCHETS" color="#4a4a54" x={300} y={554} size={44} />
      <Chip t={t} t0={470.31} t1={471.6} text="FOR FOOD" color={C.oro} tinta={C.noche} x={1400} y={300} size={56} />
      {/* la sequía pega a todos: los dos maizales se secan bajo el mismo sol */}
      {t > 471.6 && t < 477.2 && (() => {
        const e = ent(t, 471.7) * (1 - prog(t, 476.7, 477.2));
        const seca = prog(t, 472.6, 475.2);
        const mz = (a: string, b: string, u: number) => { const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join(""); };
        const planta = (x: number, k: number) => { const u = Math.max(0, Math.min(1, seca * 1.3 - k * 0.06)); const cae = u * 50; const col = mz("#3a9a3a", "#a08a4a", u); return <g key={x} transform={`translate(${x} 0)`}><path d={`M 0 0 Q ${cae * 0.3} -90 ${cae} ${-170 + cae * 1.4}`} stroke={col} strokeWidth={12} fill="none" strokeLinecap="round" /><path d={`M 0 -60 q -50 -10 -70 ${20 + cae}`} stroke={col} strokeWidth={10} fill="none" /><path d={`M 0 -100 q 50 -16 70 ${10 + cae}`} stroke={col} strokeWidth={10} fill="none" />{u < 0.6 && <ellipse cx={cae * 0.5 + 10} cy={-120 + cae} rx={14} ry={30} fill="#f0c43a" opacity={1 - u / 0.6} />}</g>; };
        return (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(60,30,10,.45)", opacity: e }} />
            <svg style={{ position: "absolute", left: 0, top: 0, transform: `scale(${e})`, transformOrigin: "960px 540px" }} width={1920} height={1080}>
              <g transform="translate(960 230)">{Array.from({ length: 12 }, (_, i) => <path key={i} transform={`rotate(${i * 30 + t * 20})`} d="M 0 -120 L 14 -170 L -14 -170 Z" fill="#ffd34a" />)}<circle r={95} fill="#ffb020" stroke="#fff3a0" strokeWidth={10} /></g>
              {[0, 1].map((k) => <g key={k} transform={`translate(${k ? 1010 : 250} 400)`}>
                <rect width={660} height={420} rx={26} fill="#fff3d6" stroke="#2a1408" strokeWidth={8} />
                <text x={330} y={66} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={50} fill={k ? "#8a5a2e" : "#5a3418"}>{k ? "POWHATAN FIELDS" : "ENGLISH FIELDS"}</text>
                <rect x={30} y={330} width={600} height={60} rx={12} fill={mz("#6a4a2a", "#c8a868", seca)} />
                {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${40 + i * 20} 340 l 12 ${12 + (i % 3) * 6}`} stroke="#5a3a1a" strokeWidth={4} opacity={seca} />)}
                <g transform="translate(0 330)">{[100, 210, 320, 430, 540].map((x, i) => planta(x, i + k))}</g>
              </g>)}
            </svg>
          </div>
        );
      })()}
      <Chip t={t} t0={474.61} t1={477.1} text="HITTING EVERYONE" color={C.rojo} x={960} y={930} centro size={56} />
      <Chip t={t} t0={478.69} t1={480.1} text="THEIR FIELDS: LESS" color="#a08a4a" x={960} y={140} centro size={56} />
      <Chip t={t} t0={481.07} t1={487.5} text="EVERY BASKET THEY GIVE" color={C.oro} tinta={C.noche} x={960} y={140} centro size={54} />
      <Chip t={t} t0={482.03} t1={483.6} text="STRANGE" color="#6a6a7a" x={330} y={300} size={44} />
      <Chip t={t} t0={482.75} t1={483.6} text="HUNGRY" color={C.naranja} x={330} y={385} size={44} />
      <Chip t={t} t0={483.33} t1={484.5} text="DEMANDING" color={C.rojo} x={330} y={470} size={44} />
      {t > 485.2 && t < 487.6 && <Grande t={t} t0={485.47} text="= THEIR KIDS DON'T EAT" y={930} size={86} color="#ff5a6a" />}
      {t > 491.3 && t < 494.5 && <Globo t={t} t0={491.31} t1={494.4} x={1260} y={260} text="WHY KEEP FEEDING THEM?" size={44} cola="izq" />}
      <Chip t={t} t0={492.73} t1={494.4} text="THEY ARE TAKING YOUR LAND" color={C.rojo} x={960} y={930} centro size={54} />
      <Chip t={t} t0={494.53} t1={498.8} text="DECEMBER 1607" color="#6a8ab8" x={960} y={140} centro size={60} />
      <Chip t={t} t0={497.21} t1={498.8} text="UPRIVER, FOR FOOD" color={C.oro} tinta={C.noche} x={960} y={930} centro size={48} />
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
            <div style={{ position: "absolute", left: 590, top: 660, transform: "rotate(-90deg)", transformOrigin: "0 0" }}><Persona x={0} y={0} h={330} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" expr="miedo" /></div>
            {/* los garrotes en alto (sin golpe) */}
            {[130, 720].map((x, i) => <div key={x} style={{ position: "absolute", left: 0, top: 0 }}><Persona x={x} y={700} h={420} t={t} seed={620 + i} ropa={POW(i)} plumaPelo flip={i === 1} expr={t > 512.85 ? "sorpresa" : "enojado"} inclina={t > 512.85 ? (i ? 8 : -8) * prog(t, 512.85, 513.3) : 0} bD={t > 507.6 && t < 515.3 ? 160 : 40} cD={20} manoD={<rect x={-10} y={-10} width={20} height={130} rx={10} fill="#5a3418" />} /></div>)}
            <Persona x={1020} y={700} h={380} t={t} seed={540} ropa={POW(2)} viejo plumaPelo capa="#6a3a1a" expr={t > 512.85 ? "sorpresa" : "neutro"} flip mira={-0.4} />
            {/* Pocahontas */}
            {t > 504.9 && (() => {
              // corre (511,2-512,3), se tira en palomita (512,3-512,8) y queda tendida sobre Smith
              const x = interpolate(t, [511.2, 512.3, 512.8], [1180, 860, 680], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (t > 512.8) return <div style={{ position: "absolute", left: 560, top: 600, transform: "rotate(-90deg)", transformOrigin: "0 0" }}><Persona x={0} y={0} h={280} t={t} seed={600} ropa={POW(0)} plumaPelo expr="miedo" bI={170} bD={170} /></div>;
              const salta = prog(t, 512.3, 512.8);
              return <Persona x={x} y={700 - Math.sin(salta * Math.PI) * 90} h={300} t={t} seed={600} ropa={POW(0)} plumaPelo flip camina={salta > 0 ? 0 : 3.2} inclina={salta * 70} bI={8 + salta * 160} bD={8 + salta * 160} expr="miedo" habla={t > 511.6} />;
            })()}
            {/* el garrote se frena en el aire */}
            {t > 512.8 && t < 515.3 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1200} height={760}>
              {[[130, 230], [720, 230]].map(([x, y], i) => <g key={i} transform={`translate(${x + (i ? -60 : 60)} ${y}) scale(${ent(t, 512.85)})`}><path d="M -70 0 L -20 -20 L 0 -75 L 20 -20 L 70 0 L 20 20 L 0 75 L -20 20 Z" fill="#fff3c4" stroke={C.rojo} strokeWidth={6} /></g>)}
              <text x={600} y={250} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={130} fill={C.rojo} stroke="#fff" strokeWidth={8} paintOrder="stroke" transform={`translate(600 210) scale(${ent(t, 512.85)}) translate(-600 -210)`}>STOP!</text>
            </svg>}
            {t > 515.4 && <div style={{ position: "absolute", right: 60, top: 140, fontFamily, fontWeight: 700, fontSize: 300, color: C.rojo, lineHeight: 1, transform: `scale(${ent(t, 515.5)}) rotate(12deg)`, filter: "none" }}>?</div>}
          </div>
          <Chip t={t} t0={507.61} t1={511.0} text="ABOUT TO BE EXECUTED" color={C.rojo} x={960} y={930} centro size={52} />
          <Chip t={t} t0={511.69} t1={515.3} text="POCAHONTAS · ABOUT 11" color={C.rosa} x={960} y={930} centro size={52} />
          {[["REALLY HAPPENED?", 516.93], ["A CEREMONY HE MISUNDERSTOOD?", 519.43], ["MADE UP TO SELL BOOKS?", 521.31]].map(([s, t0], i) => (
            <Chip key={i} t={t} t0={t0 as number} t1={[519.4, 521.3, 522.4][i]} text={s as string} color={[C.teal, C.violeta, C.naranja][i]} tinta={i === 0 ? C.noche : undefined} x={960} y={940} centro size={54} />
          ))}
        </div>
      )}
      <Chip t={t} t0={522.69} t1={524.5} text="WHAT IS CERTAIN" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={525.01} t1={527.2} text="RELEASED" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={529.27} t1={530.6} text="CARRYING FOOD" color={C.oro} tinta={C.noche} x={960} y={930} centro size={56} />
      {t > 531.9 && t < 535.1 && <Grande t={t} t0={532.25} text="IT SAVED MANY" y={200} size={120} color={C.lima} />}
      {/* sube y baja */}
      {/* plano medio: las relaciones suben y bajan — regalos, amenazas, trueque, saqueo; y quién depende de quién */}
      {t > 535.0 && t < 546.05 && (() => {
        const f = t < 536.53 ? 0 : t < 537.31 ? 1 : t < 538.33 ? 2 : t < 539.09 ? 3 : t < 540.15 ? 4 : 5;
        const canasta = <g><path d="M -44 -6 L 44 -6 L 34 44 L -34 44 Z" fill="#a0683a" stroke="#4e2a12" strokeWidth={5} />{[-24, 0, 24].map((dx) => <ellipse key={dx} cx={dx} cy={-14} rx={13} ry={18} fill="#f2c230" stroke="#a07a10" strokeWidth={3} />)}</g>;
        const garrote = <g><line x1={0} y1={40} x2={0} y2={-90} stroke="#5a3a1a" strokeWidth={12} /><circle cx={0} cy={-96} r={22} fill="#5a3a1a" /></g>;
        const cuentas = <g>{[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={-24 + k * 12} cy={8 + Math.sin(k * 1.3) * 6} r={8} fill={["#3ac0e0", "#e04a6a", "#f2c230"][k % 3]} stroke="#1b1240" strokeWidth={2} />)}</g>;
        const cx = f === 4 ? interpolate(t, [539.1, 540.1], [380, 150], { extrapolateRight: "clamp" }) : 380;
        const rot: [string, string][] = [["", ""], ["GIFTS", "#2a7a3a"], ["THREATS", C.rojo], ["TRADING", C.teal], ["RAIDS", C.rojo], ["WHO NEEDS WHOM?", C.violeta]];
        return <Vineta t={t} t0={535.1} t1={546.0} x={960} y={470} w={1300} h={640} cielo="#f2d9a8" cielo2="#e8c088" suelo="#7a5a30" sueloY={470} rot={-0.8}>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1300} height={640}>
            <path d="M 1010 470 Q 1160 230 1310 470 Z" fill="#a8844a" stroke="#5a3a1a" strokeWidth={6} />
            {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M ${k * 34} 470 L ${k * 34} 250 L ${17 + k * 34} 225 L ${34 + k * 34} 250 L ${34 + k * 34} 470 Z`} fill="#7a5530" stroke="#3a2412" strokeWidth={4} />)}
            {f === 5 && [0, 1, 2, 3, 4, 5].map((k) => <ellipse key={k} cx={1080 + (k % 3) * 46} cy={455 - Math.floor(k / 3) * 34} rx={22} ry={30} fill="#f2c230" stroke="#a07a10" strokeWidth={3} />)}
          </svg>
          <Persona x={cx} y={820} h={520} t={t} seed={1320} ropa={COLONO(2)} flaco={f === 5 ? 0.35 : 0.15} flip={f === 4} camina={f === 4 ? 2.6 : 0} inclina={f === 5 ? 14 : 0} expr={(["neutro", "feliz", "miedo", "feliz", "enojado", "triste"] as const)[f]} bD={[20, 80, 20, 80, 40, 110][f]} cD={[0, 30, 0, 30, 60, 10][f]} bI={f === 2 ? 120 : 10} manoD={f === 3 ? cuentas : f === 4 ? canasta : undefined} />
          <Persona x={920} y={820} h={540} t={t} seed={1321} ropa={POW(0)} plumaPelo flip expr={(["neutro", "feliz", "enojado", "neutro", "enojado", "orgullo"] as const)[f]} bD={[20, 80, 160, 80, 130, 30][f]} cD={[0, 30, 20, 30, 20, 0][f]} manoD={f === 2 || f === 4 ? garrote : f === 1 || f === 3 ? canasta : undefined} />
          {f > 0 && <Rotulo key={f} t={t} t0={[535.1, 536.53, 537.31, 538.33, 539.09, 540.15][f]} x={650} y={80} text={rot[f][0]} color={rot[f][1]} size={56} />}
        </Vineta>;
      })()}
      {t > 546.1 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><Lluvia t={t} n={140} seed={9} /></div>}
      {t > 541.4 && t < 546.0 && <Grande t={t} t0={543.21} text="THE ENGLISH DEPEND ON THEM" y={880} size={72} color={C.ambar} />}
      <Chip t={t} t0={544.47} t1={546.0} text="NOT THE OTHER WAY AROUND" color={C.rojo} x={960} y={1010} centro size={44} />
      <Chip t={t} t0={546.6} t1={550.6} text="AUTUMN 1609" color={C.naranja} x={960} y={140} centro size={84} />
      {t > 548.7 && <Grande t={t} t0={548.71} text="EVERYTHING GOES WRONG" y={880} size={84} color="#ff5a6a" />}
      {t > 494.4 && t < 504.8 && <Nieve t={t} n={60} op={0.7} />}
    </AbsoluteFill>
  );
};
