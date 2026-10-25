import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, APION, CIVIL, CENTURION } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cam, Chip, Grande, Emote, cabeza, Particulas, Rayos } from "./kit";
import { Galera, Corte, Remero, MapaMar, Pancarta, CuentaN, Flecha, Salpica, Playa, Flota, Columna, Nubes } from "./mar";
import { Laurel } from "./P1";

// soot02 · trampa 5, EL CUERVO (537,95-652,89 s). Roma contra Cartago sin flota → copian un barco varado → 120 barcos en
// 60 días → remar en el aire sobre la arena → inventan el corvus → cae el puente → la batalla de mar se vuelve de tierra
// → Mylae, Duilio, la columna con espolones → la gloria para los marines; vos abajo → el puente pesa arriba: en tormenta, vuelca.
const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const DUILIO = { tunica: "#f2ead8", tunica2: "#c9b8a0", cinto: "#a3202f", piel: "#f2b48a", piel2: "#d98d66", pelo: "#5a3a22" };

// cabeza de cuervo (para «como un pico»)
const Cuervo: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <svg style={{ position: "absolute", left: x - 160 * s, top: y - 140 * s, overflow: "visible" }} width={320 * s} height={280 * s} viewBox="-160 -140 320 280">
    <g transform={`rotate(${Math.sin(t * 4) * 5})`}>
      <ellipse cx={-30} cy={20} rx={110} ry={90} fill="#1e1a2e" />
      <path d="M 50 -10 L 160 20 L 50 50 Z" fill="#3a3550" />
      <path d="M 50 20 L 160 20 L 50 50 Z" fill="#2a2540" />
      <circle cx={10} cy={-10} r={20} fill="#fff" /><circle cx={16} cy={-8} r={9} fill="#120c20" />
      <path d="M -120 -40 Q -150 -90 -100 -70 Q -110 -110 -60 -80" fill="#1e1a2e" />
    </g>
  </svg>
);
// bancos en la playa remando en el aire
const RemoAire: React.FC<{ t: number }> = ({ t }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {Array.from({ length: 3 }, (_, f) => Array.from({ length: 6 }, (_, k) => {
      const x = 260 + k * 260 + f * 40, y = 720 + f * 120;
      const s = 0.55 + f * 0.1;
      const heroe = f === 2 && k === 2;
      return <g key={f + "-" + k} transform={`translate(${x} ${y}) scale(${s})`}><Remero fase={t * 0.6 * Math.PI * 2 - f * 0.2} ropa={heroe ? "#2fb5d8" : ["#9a6a4a", "#7a7a5a", "#8a5a7a", "#6a7a4a", "#a8673f"][(k + f) % 5]} piel={heroe ? "#c98b62" : ["#f2b48a", "#c98b62", "#8d5a3b", "#f5c7a0"][(k + f * 2) % 4]} pelo={heroe ? "#1d1410" : "#3a2214"} expr={heroe ? "cansado" : (["neutro", "cansado"] as const)[(k + f) % 2]} seed={k + f * 10} t={t} /></g>;
    }))}
  </svg>
);

export const P5: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 537,95 · TRAP #5 · THE CROW */}
    <Escena t={t} t0={537.95} t1={540.2} entra="atraviesa" ix={1300} iy={420} sale="fundido" fondo="none" golpes={[538.3, 539.2]}>
      <Galera x={900} y={720} s={0.5} t={t} boga={0.6} vela={false} corvus={0} />
      <Pancarta t={t} t0={538.0} n={5} titulo="THE CROW" y={380} />
    </Escena>

    {/* 540,2 · "In 264 BC, Rome went to war with Carthage, the greatest naval power in the western Mediterranean, and Rome had a problem" */}
    <Escena t={t} t0={540.2} t1={549.4} entra="fundido" sale="fundido" fondo="#1f5c9c" golpes={[540.2, 543.2, 545.0, 547.9]}>
      <MapaMar t={t} puntos={[{ n: "ROME", t0: 543.0, color: C.rojo }, { n: "CARTHAGE", t0: 543.6, color: "#7a5bd1" }]} rutas={[{ de: "CARTHAGE", a: "SICILY", t0: 545.2 }, { de: "CARTHAGE", a: "DREPANA", t0: 545.5 }, { de: "CARTHAGE", a: "AEGATES", t0: 545.8 }]} />
      <Grande t={t} t0={540.3} text="264 BC" x={960} y={170} size={140} color={C.crema} />
      <Chip t={t} t0={543.2} text="ROME vs CARTHAGE" color={C.rojo} x={960} y={300} centro size={60} />
      <Chip t={t} t0={545.0} text="GREATEST NAVAL POWER" color="#7a5bd1" x={540} y={960} centro size={52} />
      <Chip t={t} t0={547.9} text="ROME HAD A PROBLEM" color={C.oro} tinta={C.noche} x={1400} y={960} centro size={56} />
    </Escena>

    {/* 549,4 · "Rome did not really have a navy. So, according to Polybius, they copied one." — un legionario en un botecito */}
    <Escena t={t} t0={549.4} t1={554.3} entra="fundido" sale="paneo" fondo="none" golpes={[549.4, 551.9, 553.1]}>
      <Persona x={960} y={780} h={420} t={t} seed={150} ropa={CENTURION} casco="legion" expr={t < 551.8 ? "miedo" : "orgullo"} bD={t > 553 ? 150 : 50} cD={30} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <g transform={`translate(960 ${790 + Math.sin(t * 2) * 8}) rotate(${Math.sin(t * 1.6) * 4})`}><path d="M -200 -40 L 200 -40 Q 180 40 0 50 Q -180 40 -200 -40 Z" fill="#9a5a2a" stroke="#5a3418" strokeWidth={8} /><line x1={-150} y1={-30} x2={-260} y2={60} stroke="#c49058" strokeWidth={10} /></g>
      </svg>
      <Chip t={t} t0={549.4} text="NO REAL NAVY" color={C.rojo} x={960} y={150} centro size={66} />
      <Chip t={t} t0={551.9} text="POLYBIUS:" color="#1d6f8a" x={960} y={260} centro size={50} />
      <Grande t={t} t0={553.1} text="THEY COPIED ONE" y={960} size={110} color={C.crema} />
    </Escena>

    {/* 554,3 · "A Carthaginian warship ran aground. The Romans captured it and used it as a model. 100 quinqueremes and 20 triremes in about 60 days" */}
    <Escena t={t} t0={554.3} t1={563.8} entra="paneo" sale="fundido" fondo="none" quieta golpes={[554.3, 556.7, 557.8, 559.2]}>
      {t < 559.1 && (
        <>
          <Playa t={t} />
          <Galera x={1050} y={760} s={0.55} t={t} boga={0} vela={false} marines={false} color="#3a2a3a" franja="#1a1a1a" agua={null} balanceo={0} />
          {t > 556.6 && Array.from({ length: 4 }, (_, i) => <Persona key={i} x={interpolate(t, [556.6, 557.8], [-200 - i * 150, 300 + i * 150], cl)} y={pp(320, 620)} h={320} t={t} seed={160 + i} ropa={CENTURION} casco="legion" camina={t < 557.8 ? 2 : 0} expr="orgullo" bD={t > 557.9 ? 150 : 10} />)}
          {t > 557.8 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><g transform={`translate(1050 760)`} opacity={0.8}><path d="M -500 -60 L 480 -60 L 500 40 L -480 40 Z" fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="16 12" /><text x={0} y={-90} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={42} fill="#fff">MODEL</text></g></svg>}
        </>
      )}
      {t >= 559.1 && (
        <AbsoluteFill style={{ background: "#1b3a6b" }}>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{Array.from({ length: 30 }, (_, i) => <line key={i} x1={0} y1={i * 40} x2={1920} y2={i * 40} stroke="#fff" strokeOpacity={0.08} strokeWidth={2} />)}{Array.from({ length: 50 }, (_, i) => <line key={"v" + i} x1={i * 40} y1={0} x2={i * 40} y2={1080} stroke="#fff" strokeOpacity={0.08} strokeWidth={2} />)}</svg>
          <Flota t={t} t0={559.2} n={120} hunde={0} tA={[0, 1]} y={600} cols={15} s={1.5} />
        </AbsoluteFill>
      )}
      <Chip t={t} t0={554.3} t1={558.9} text="RAN AGROUND" color="#7a5bd1" x={1050} y={150} centro size={60} />
      <Chip t={t} t0={556.7} t1={558.9} text="CAPTURED" color={C.rojo} x={1050} y={260} centro size={56} />
      <CuentaN t={t} t0={559.3} t1={561.4} a={120} suf=" SHIPS" x={560} y={150} size={110} color={C.crema} />
      <Chip t={t} t0={559.9} text="100 QUINQUEREMES + 20 TRIREMES" color={C.violeta} x={960} y={1000} centro size={46} />
      <CuentaN t={t} t0={561.0} t1={562.8} a={60} pre="IN " suf=" DAYS" x={1420} y={150} size={110} color={C.oro} />
    </Escena>

    {/* 563,8 · "while the ships were still being built, the new rowers trained on land... benches on the beach... pulled imaginary oars through the air while an officer shouted the rhythm. That was your training." */}
    <Escena t={t} t0={563.8} t1={580.4} entra="fundido" sale="paneo" fondo="none" quieta golpes={[565.9, 568.0, 572.0, 574.3, 577.0, 578.4]}>
      <Cam t={t} k={[[563.8, 960, 540, 1.0], [572.6, 960, 560, 1.0], [574.0, 1500, 330, 1.6], [576.4, 1500, 330, 1.6], [577.6, 830, 800, 1.7], [580.4, 830, 800, 1.8]]}>
        <Playa t={t} />
        {/* esqueletos de barco en construcción al fondo */}
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[300, 900].map((x, i) => <g key={i} transform={`translate(${x} 700)`}><path d="M -220 0 Q 0 60 220 0" stroke="#8a5a2a" strokeWidth={12} fill="none" />{Array.from({ length: 9 }, (_, k) => <path key={k} d={`M ${-200 + k * 50} ${10 + Math.abs(k - 4) * -3} q -10 -60 0 -110`} stroke="#a8622c" strokeWidth={9} fill="none" />)}</g>)}</svg>
        <RemoAire t={t} />
        <Persona x={1500} y={pp(520, 330)} h={520} t={t} seed={170} ropa={CENTURION} casco="centurion" expr="enojado" habla={Math.sin(t * 0.6 * Math.PI * 2) > 0.3} bD={100} cD={60} flip />
        <Emote t={t} t0={572.2} tipo="enojo" {...L(1500, pp(520, 330), 520)} s={1.2} />
      </Cam>
      {t > 572.0 && t < 576.6 && <div style={{ position: "absolute", left: 220, top: 220, transform: `scale(${1 + 0.15 * Math.max(0, Math.cos(t * 0.6 * Math.PI * 2)) ** 6})`, fontFamily, fontWeight: 700, fontSize: 110, color: C.crema, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill" }}>{Math.cos(t * 0.6 * Math.PI * 2) > 0 ? "PULL!" : "...AND"}</div>}
      <Chip t={t} t0={563.8} t1={572.4} text="SHIPS NOT READY YET" color={C.violeta} x={120} y={130} size={52} />
      <Chip t={t} t0={565.85} t1={572.4} text="TRAINED ON LAND" color={C.rojo} x={120} y={240} size={60} />
      <Chip t={t} t0={568.0} t1={572.4} text="SAME ORDER AS ON A SHIP" color={C.oro} tinta={C.noche} x={1300} y={130} size={46} />
      <Chip t={t} t0={570.4} t1={572.4} text="IMAGINARY OARS" color="#1d6f8a" x={1300} y={230} size={52} />
      <Chip t={t} t0={576.97} text="YOUR TRAINING:" color={C.violeta} x={960} y={140} centro size={58} />
      <Grande t={t} t0={578.43} text="AIR ROWING" y={300} size={150} color={C.crema} />
    </Escena>

    {/* 580,4 · "Of course, the Carthaginians were far better sailors, so the Romans changed the game." */}
    <Escena t={t} t0={580.4} t1={585.2} entra="paneo" sale="fundido" fondo="none" golpes={[580.7, 583.2]}>
      {(() => { const a = (t - 580.4) * 1.1; return <Galera x={960 + Math.cos(a) * 520} y={680 + Math.sin(a) * 30} s={0.36} t={t} boga={1.2} vela={false} flip={Math.sin(a) > 0} color="#3a2a3a" franja="#1a1a1a" />; })()}
      <Galera x={960} y={720} s={0.42} t={t} boga={0.4} vela={false} balanceo={3} />
      <Chip t={t} t0={580.73} text="FAR BETTER SAILORS" color="#7a5bd1" x={960} y={150} centro size={62} />
      <Chip t={t} t0={583.2} text="SO ROME CHANGED THE GAME" color={C.rojo} x={960} y={960} centro size={62} />
    </Escena>

    {/* 585,2 · "They invented the corvus, the crow... boarding bridge about 11 meters long, mounted on a pole at the front... heavy iron spike under its tip, like a beak" */}
    <Escena t={t} t0={585.2} t1={595.2} entra="fundido" sale="nada" fondo="none" quieta golpes={[585.2, 586.7, 587.5, 590.1, 592.1, 594.3]}>
      <Cam t={t} k={[[585.2, 960, 560, 1.0], [589.6, 960, 560, 1.0], [590.6, 1240, 380, 1.4], [595.2, 1240, 380, 1.4]]}>
        <Galera x={760} y={660} s={0.8} t={t} boga={0.3} vela={false} corvus={interpolate(t, [585.2, 586.2], [0, 0.0], cl)} />
        {t > 587.5 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><circle cx={760 + 481 * 0.8} cy={660 - 470 * 0.8} r={24} fill={C.oro} opacity={prog(t, 590.1, 590.4)} /><circle cx={760 + (470 + Math.cos(-78 * Math.PI / 180) * 512) * 0.8} cy={660 + (-110 + Math.sin(-78 * Math.PI / 180) * 512) * 0.8} r={60 * prog(t, 592.1, 592.5)} fill="none" stroke={C.rojo} strokeWidth={8} /></svg>}
      </Cam>
      {t > 594.3 && <Cuervo x={1660} y={330} s={1.1 * ent(t, 594.3)} t={t} />}
      <Grande t={t} t0={585.2} text="THE CORVUS" x={500} y={170} size={130} color={C.crema} />
      <Chip t={t} t0={586.65} text="'THE CROW'" color={C.noche} x={500} y={300} centro size={56} />
      <Chip t={t} t0={587.51} text="BOARDING BRIDGE · ~11 M" color={C.oro} tinta={C.noche} x={960} y={960} centro size={56} />
      <Chip t={t} t0={590.09} text="ON A POLE AT THE FRONT" color="#1d6f8a" x={1400} y={960} centro size={44} />
      <Chip t={t} t0={592.13} text="IRON SPIKE" color={C.rojo} x={1500} y={600} centro size={56} />
    </Escena>

    {/* 595,2 · "When an enemy ship came close, the Romans let the bridge fall. The spike smashed through the enemy deck and locked the two ships together." */}
    <Escena t={t} t0={595.2} t1={603.1} entra="nada" sale="nada" fondo="none" quieta golpes={[597.0, 599.0, 600.2]}>
      <Cam t={t} k={[[595.2, 1240, 380, 1.4], [596.6, 1100, 560, 0.75], [598.6, 1100, 560, 0.75], [599.1, 1150, 520, 0.85], [603.1, 1150, 540, 0.8]]}>
        <Galera x={760} y={660} s={0.8} t={t} boga={t < 597 ? 0.3 : 0} vela={false} corvus={prog(t, 597.0, 599.0) ** 2} />
        <Galera x={interpolate(t, [595.2, 597.6], [2700, 760 + 0.8 * 1500], cl)} y={680} s={0.8} t={t} boga={t < 597.6 ? 1.0 : 0} vela={false} flip color="#3a2a3a" franja="#1a1a1a" marines={false} />
        <Salpica t={t} t0={599.0} x={760 + 0.8 * 990} y={600} s={1.6} />
      </Cam>
      {t > 599.0 && t < 599.3 && <AbsoluteFill style={{ background: "#fff", opacity: 1 - prog(t, 599.0, 599.3) }} />}
      <Chip t={t} t0={595.3} text="ENEMY CLOSE..." color="#7a5bd1" x={960} y={140} centro size={60} />
      <Grande t={t} t0={597.0} text="DROP IT!" x={500} y={300} size={140} color={C.rojo} />
      <Grande t={t} t0={599.0} text="SMASH!" x={1450} y={300} size={150} color={C.oro} />
      <Chip t={t} t0={600.2} text="LOCKED TOGETHER" color={C.violeta} x={960} y={960} centro size={66} />
    </Escena>

    {/* 603,1 · "And just like that, a sea battle became a land battle, which Rome was very, very good at." — los marines cruzan el puente */}
    <Escena t={t} t0={603.1} t1={609.0} entra="nada" sale="fundido" fondo="none" quieta golpes={[604.4, 606.4, 607.8]}>
      <Cam t={t} k={[[603.1, 1150, 540, 0.8], [605, 1150, 500, 1.0], [609, 1150, 500, 1.0]]}>
        <Galera x={760} y={660} s={0.8} t={t} boga={0} vela={false} corvus={1} />
        <Galera x={760 + 0.8 * 1500} y={680} s={0.8} t={t} boga={0} vela={false} flip color="#3a2a3a" franja="#1a1a1a" marines={false} />
        {Array.from({ length: 6 }, (_, i) => {
          const u = ((t - 603.6) * 0.42 + i * 0.17);
          if (u < 0 || u > 1.3) return null;
          const k = Math.min(1, u);
          const x = 760 + 0.8 * (480 + k * 520) + (u > 1 ? (u - 1) * 300 : 0);
          const y = 660 + 0.8 * (-130 + k * 50);
          return <Persona key={i} x={x} y={y} h={170} t={t} seed={180 + i} ropa={CENTURION} casco="legion" camina={2.6} expr="enojado" bD={140} cD={20} />;
        })}
      </Cam>
      <Chip t={t} t0={604.37} text="SEA BATTLE" color="#1d6f8a" x={420} y={150} centro size={62} />
      <Chip t={t} t0={605.2} text="→ LAND BATTLE" color={C.rojo} x={1040} y={150} centro size={62} />
      <Chip t={t} t0={606.41} text="ROME: VERY," color={C.oro} tinta={C.noche} x={760} y={960} centro size={58} />
      <Chip t={t} t0={607.83} text="VERY GOOD AT IT" color={C.oro} tinta={C.noche} x={1260} y={960} centro size={58} />
    </Escena>

    {/* 609,0 · "In 260 BC, at Mylae, the consul Gaius Duilius tried it for the first time. The Carthaginians came in fast and confident. The crows came down, and Roman marines poured across." */}
    <Escena t={t} t0={609.0} t1={622.25} entra="fundido" sale="fundido" fondo="none" quieta golpes={[609.0, 611.3, 612.3, 615.4, 618.0, 619.9]}>
      {t < 612.3 && <MapaMar t={t} puntos={[{ n: "MYLAE", t0: 611.2, color: C.rojo }]} zoom={{ n: "MYLAE", z: 2.6, t: [610.6, 612.3] }} />}
      {t >= 612.3 && t < 615.4 && (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #5b2bb5, #1b1240 80%)" }}>
          <Persona x={960} y={pp(820, 440)} h={820} t={t} seed={190} ropa={DUILIO} expr="orgullo" aparece={612.3} bD={120} cD={40} />
        </AbsoluteFill>
      )}
      {t >= 615.4 && (
        <Cam t={t} k={[[615.4, 960, 560, 0.62], [622.25, 960, 560, 0.7]]}>
          {[0, 1, 2].map((i) => {
            const y = 420 + i * 260;
            const xe = interpolate(t, [615.4, 617.8], [3000, 760 + 0.8 * 1500 - i * 40], cl);
            return (
              <React.Fragment key={i}>
                <Galera x={760 - i * 40} y={y} s={0.8} t={t + i} boga={0} vela={false} corvus={prog(t, 617.95 + i * 0.25, 618.9 + i * 0.25) ** 2} />
                <Galera x={xe} y={y + 20} s={0.8} t={t + i} boga={t < 617.8 ? 1.6 : 0} vela={false} flip color="#3a2a3a" franja="#1a1a1a" marines={false} />
                <Salpica t={t} t0={618.9 + i * 0.25} x={760 - i * 40 + 0.8 * 990} y={y - 40} s={1.4} />
                {t > 619.9 && Array.from({ length: 4 }, (_, k) => { const u = (t - 619.9) * 0.5 + k * 0.22; if (u > 1.2) return null; const kk = Math.min(1, u); return <Persona key={k} x={760 - i * 40 + 0.8 * (480 + kk * 520) + (u > 1 ? (u - 1) * 300 : 0)} y={y + 0.8 * (-130 + kk * 50)} h={150} t={t} seed={200 + k} ropa={CENTURION} casco="legion" camina={2.6} expr="enojado" />; })}
              </React.Fragment>
            );
          })}
        </Cam>
      )}
      {t < 612.3 && <Grande t={t} t0={609.0} text="260 BC" x={960} y={170} size={130} color={C.crema} />}
      <Chip t={t} t0={612.33} t1={615.2} text="CONSUL GAIUS DUILIUS" color={C.oro} tinta={C.noche} x={960} y={120} centro size={62} />
      <Chip t={t} t0={613.6} t1={615.2} text="FIRST TRY" color={C.violeta} x={960} y={980} centro size={56} />
      <Chip t={t} t0={615.43} t1={617.8} text="FAST + CONFIDENT" color="#7a5bd1" x={960} y={130} centro size={62} />
      <Chip t={t} t0={617.95} text="THE CROWS COME DOWN" color={C.rojo} x={960} y={130} centro size={62} />
      <Chip t={t} t0={619.91} text="MARINES POUR ACROSS" color={C.oro} tinta={C.noche} x={960} y={980} centro size={60} />
    </Escena>

    {/* 622,25 · "Rome captured dozens of enemy ships. Duilius got the first naval triumph... and a column in the forum decorated with the bronze rams" */}
    <Escena t={t} t0={622.25} t1={632.27} entra="fundido" sale="fundido" fondo="#ffb86b" golpes={[622.6, 624.6, 627.7]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #ffe08a, #ff9a4d 60%, #c2452a)" }} />
      <Rayos t={t} x={960} y={400} op={0.16} />
      {t < 627.6 && <div style={{ position: "absolute", left: 200, top: 470, width: 1120, height: 500, borderRadius: 40, background: "rgba(27,18,64,.85)", transform: `scale(${ent(t, 622.3)})` }} />}
      {t < 627.6 && <Flota t={t} t0={622.4} n={40} hunde={0} tA={[0, 1]} x={760} y={720} cols={10} s={1.6} />}
      {t < 627.6 && t > 624.5 && <Persona x={1600} y={pp(620, 360)} h={620} t={t} seed={190} ropa={DUILIO} expr="feliz" bD={160} bI={160} salta={624.7} />}
      {t > 624.5 && t < 627.6 && <Laurel x={1600} y={360 - 80} s={1.6} />}
      {t >= 627.6 && <Columna x={960} y={560} s={0.95} t={t} tR={628.6} />}
      {t >= 627.6 && <Particulas t={t} tipo="destellos" n={20} seed={14} />}
      <Chip t={t} t0={622.25} t1={627.4} text="DOZENS OF SHIPS CAPTURED" color={C.rojo} x={760} y={150} centro size={58} />
      <Chip t={t} t0={624.61} t1={627.4} text="1ST NAVAL TRIUMPH" color={C.oro} tinta={C.noche} x={760} y={270} centro size={52} />
      <Chip t={t} t0={627.67} text="COLUMNA ROSTRATA" color={C.violeta} x={1420} y={300} centro size={44} />
      <Chip t={t} t0={629.6} text="DECORATED WITH RAMS" color={C.rojo} x={1420} y={390} centro size={40} />
    </Escena>

    {/* 632,27 · "Great news for Duilius. For you, the marines took the glory. You stayed below and rowed." */}
    <Escena t={t} t0={632.27} t1={638.43} entra="fundido" sale="fundido" fondo="#3a1c0e" quieta golpes={[632.3, 634.6, 636.4]}>
      {t < 636.3 && (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #ffcf6a, #c2452a 80%)" }}>
          <Rayos t={t} x={960} y={300} op={0.15} />
          {Array.from({ length: 5 }, (_, i) => <Persona key={i} x={520 + i * 220} y={pp(460, 470) + (i % 2) * 20} h={460} t={t} seed={210 + i} ropa={i === 2 ? DUILIO : CENTURION} casco={i === 2 ? "no" : "legion"} expr="feliz" bD={150} bI={i % 2 ? 150 : 20} salta={632.4 + i * 0.1} />)}
          <Particulas t={t} tipo="lluviaoro" n={50} seed={8} />
        </AbsoluteFill>
      )}
      {t >= 636.3 && (
        <Cam t={t} k={[[636.3, 860, 760, 1.6], [638.43, 820, 740, 1.9]]}>
          <Corte t={t} boga={0.55} agua={0.08} heroeExpr="cansado" oscuro={0.6} luz={0.4} />
        </Cam>
      )}
      <Chip t={t} t0={632.27} t1={636.1} text="GREAT NEWS FOR DUILIUS" color={C.oro} tinta={C.noche} x={960} y={140} centro size={60} />
      <Chip t={t} t0={634.6} t1={636.1} text="GLORY → MARINES" color={C.rojo} x={960} y={960} centro size={60} />
      <Chip t={t} t0={636.35} text="YOU: BELOW. ROWING." color="#2fb5d8" tinta={C.noche} x={960} y={150} centro size={62} />
    </Escena>

    {/* 638,43 · "that heavy bridge, hanging high at the front... a very big problem. Heavy, high, top-heavy. In calm water, no matter. In a storm, it mattered more than anything." */}
    <Escena t={t} t0={638.43} t1={652.95} entra="fundido" sale="atraviesa" sx={960} sy={500} fondo="none" quieta golpes={[639.5, 643.95, 645.3, 646.1, 648.5, 650.6]}>
      <Cam t={t} k={[[638.43, 1150, 420, 1.5], [642.4, 1150, 420, 1.5], [643.8, 960, 560, 1.0], [652.95, 960, 560, 1.0]]}>
        {(() => {
          const tormenta = prog(t, 650.3, 651.4);
          return (
            <div style={{ position: "absolute", inset: 0 }}>
              <Galera x={960} y={660} s={0.75} t={t} boga={0.5} vela={false} corvus={0} balanceo={1 + tormenta * 13} ola={0.3 + tormenta * 0.7} agua={tormenta > 0.3 ? "#1b1f4c" : "#1f5c9c"} />
              {t > 643.9 && t < 650.4 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
                {/* centro de gravedad que sube */}
                {(() => { const cy = interpolate(t, [645.3, 646.6], [700, 520], cl); return <g transform={`translate(1000 ${cy})`}><circle r={34} fill="#fff" stroke={C.noche} strokeWidth={6} /><path d="M 0 -34 A 34 34 0 0 1 34 0 L 0 0 Z M 0 34 A 34 34 0 0 1 -34 0 L 0 0 Z" fill={C.noche} /></g>; })()}
                {t > 645.3 && <text x={1060} y={500} fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#fff" stroke={C.noche} strokeWidth={8} paintOrder="stroke">CENTER OF GRAVITY ↑</text>}
              </svg>}
            </div>
          );
        })()}
      </Cam>
      <Chip t={t} t0={638.43} t1={643.6} text="THAT HEAVY BRIDGE" color={C.oro} tinta={C.noche} x={500} y={150} centro size={58} />
      <Chip t={t} t0={639.5} t1={643.6} text="HIGH AT THE FRONT" color={C.violeta} x={500} y={260} centro size={52} />
      <Chip t={t} t0={641.6} t1={643.6} text="A VERY BIG PROBLEM" color={C.rojo} x={500} y={960} centro size={56} />
      <Chip t={t} t0={643.95} text="HEAVY" color={C.rojo} x={120} y={140} size={56} />
      <Chip t={t} t0={645.33} text="+ HIGH" color={C.ambar} tinta={C.noche} x={360} y={140} size={56} />
      <Chip t={t} t0={646.07} text="= TOP-HEAVY" color={C.violeta} x={620} y={140} size={56} />
      <Chip t={t} t0={648.51} t1={650.4} text="CALM WATER: FINE" color={C.lima} tinta={C.noche} x={960} y={960} centro size={58} />
      <Chip t={t} t0={650.59} text="IN A STORM..." color={C.rojo} x={960} y={960} centro size={70} />
    </Escena>
  </>
);
