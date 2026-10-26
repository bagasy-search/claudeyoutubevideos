import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote, Rayos } from "./kit";
import { Mundo, camEn, Key, SAJON, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, MapaN, lugarN, Globo } from "./comun";
import { Cita } from "./escenas";
import { CasaLarga } from "./P3";
import { Drakkar, Llamas, Iglesia, Corona, Panes, Tienda } from "./vik";

// 565,4-667,7 s · TRAMPA 6: LOS EXPERTOS. No inventás nada: los copiás. Lindisfarne 793 (Alcuino), monasterios en días
// santos, pueblos en días de mercado, la quema de casas (Njal), Chippenham 878 y Alfredo en los pantanos con los panes
// quemados. Ellos saben exactamente qué error estás por cometer.
export const CAM6: Key[] = [
  [565.39, 7600, 760, 0.8], [567.85, 6200, 700, 0.75], [572.09, 5600, 760, 1.2], [575.31, 5300, 760, 1.4],
  [649.53, 6400, 640, 0.55], [653.69, 5600, 740, 1.0], [658.31, 4700, 760, 1.3], [660.39, 4200, 740, 1.15], [664.87, 3800, 760, 1.4], [667.71, 3700, 760, 1.6],
];

const casa = (x: number, y: number, s: number, arde = 0, t = 0) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-120} width={320} height={160} fill="#8a6a4a" stroke="#2a1530" strokeWidth={10} />
    <path d="M -200 -110 L 0 -260 L 200 -110 Z" fill={arde > 0 ? "#3a2418" : "#c9a24a"} stroke="#2a1530" strokeWidth={10} />
    <rect x={-30} y={-60} width={60} height={100} fill={arde > 0 ? "#ffb24a" : "#2a1530"} />
    {arde > 0 && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-160 + i * 80} -120 Q ${-180 + i * 80} ${-220 - Math.sin(t * 11 + i) * 40} ${-150 + i * 80} ${-300 - arde * 60} Q ${-120 + i * 80} -200 ${-110 + i * 80} -120 Z`} fill={i % 2 ? "#ffb24a" : "#ff5a2a"} opacity={0.95} />)}
  </g>
);

export const P6: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM6);
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 6 · algo incómodo: no estás inventando nada, los estás copiando */}
      <Escena t={t} t0={565.39} t1={578.37} zoom={0} entra="corte" golpes={[573.95, 575.4]}>
        <Mundo t={t} cam={cam}>
          <Persona x={5260} y={gy(5260) + 4} h={250} t={t} seed={3} ropa={SAJON} expr={t > 574 ? "sorpresa" : "miedo"} inclina={18} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />
        </Mundo>
        {/* espejo: tu sombra es un vikingo */}
        {t > 573.9 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: `rgba(10,6,30,${0.55 * ent(t, 573.9)})` }}>
            <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${ent(t, 574.0)})`, width: 600, height: 760, borderRadius: "50% 50% 46% 46%", border: "18px solid #c9a24a", background: "radial-gradient(circle, #3a3a7a, #16123d)", overflow: "hidden" }}>
              <Persona x={300} y={780} h={620} t={t} seed={601} ropa={VIK(2)} casco="vikingo" barba={barbaDe(2)} expr={t > 575.4 ? "feliz" : "orgullo"} bD={t > 575.4 ? 140 : 20} cD={t > 575.4 ? 60 : 10} />
            </div>
            <Emote t={t} t0={575.4} tipo="brillos" x={1180} y={300} s={1.4} />
          </div>
        )}
        <Cartel t={t} t0={565.4} t1={567.8} n={6} nombre="THE EXPERTS" />
        <Ch t={t} t0={568.0} t1={573.9} text="SOMETHING UNCOMFORTABLE…" color={C.violeta} x={120} y={150} size={58} />
        <Ch t={t} t0={570.0} t1={573.9} text="ABOUT ATTACKING VIKINGS AT NIGHT" color={C.ambar} tinta={C.noche} x={120} y={260} size={50} />
        <Ch t={t} t0={572.2} t1={573.9} text="YOU'RE NOT INVENTING ANYTHING" color={C.teal} tinta={C.noche} x={120} y={360} size={50} />
        <G t={t} t0={574.0} text="YOU'RE COPYING THEM" y={150} size={110} color={C.crema} />
        <Ch t={t} t0={575.5} text="THEY ENTERED HISTORY WITH A SURPRISE ATTACK" color={C.rojo} x={960} y={1010} centro size={46} />
      </Escena>
      {/* 1 · 793: aparecen de la nada en Lindisfarne */}
      <Escena t={t} t0={578.37} t1={582.4} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[578.37, 900, 560, 1.0], [582.4, 661, 425, 3.8]]} desde="NORWAY"
          pulsa={[{ n: "LINDISFARNE", t0: 579.8, color: C.rojo, label: "LINDISFARNE", lado: "der" }]}
          rutas={[{ de: "NORWAY", a: "LINDISFARNE", t0: 578.9, color: C.rojo, curva: 60, dur: 1.0, ancho: 14 }]}>
          {t > 578.9 && (() => { const a = lugarN("NORWAY"), b = lugarN("LINDISFARNE"); const u = prog(t, 578.9, 580.2); return <div style={{ position: "absolute", left: a.x + (b.x - a.x) * u, top: a.y + (b.y - a.y) * u - Math.sin(u * Math.PI) * 30, transform: `translate(-50%,-50%) scale(0.07) scaleX(-1)` }}><Drakkar x={0} y={0} s={1} t={t} vela={1} remos={1} /></div>; })()}
        </MapaN>
        <G t={t} t0={578.6} text="793" y={240} size={220} color={C.ambar} />
        <Ch t={t} t0={580.4} text="NORTHUMBRIA" color={C.teal} tinta={C.noche} x={960} y={960} centro size={52} />
      </Escena>
      <Escena t={t} t0={582.4} t1={586.27} entra="iris" ix={1100} iy={600} golpes={[583.6, 585.4]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2c08a, #ffe8c0 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={780} width={1920} height={300} fill="#3a7ac8" /><path d="M 600 800 Q 1100 640 1700 800 Z" fill="#7aa04a" /></svg>
        <Iglesia x={1200} y={640} s={0.62} t={t} arde={prog(t, 585.4, 586.2)} />
        {[0, 1, 2].map((i) => <Drakkar key={i} x={interpolate(t, [582.5, 584.6], [-400 - i * 380, 300 + i * 220], { extrapolateRight: "clamp" })} y={850 + i * 20} s={0.42} t={t} vela={1} remos={1} />)}
        <Ch t={t} t0={582.6} text="THE MONASTERY OF LINDISFARNE" color={C.violeta} x={960} y={150} centro size={56} />
        <Ch t={t} t0={583.6} text="OUT OF NOWHERE" color={C.rojo} x={960} y={260} centro size={56} />
        {t > 583.6 && [0, 1, 2].map((i) => { const x = interpolate(t, [583.6, 586.2], [1300 + i * 80, 1800 + i * 120]); return <Persona key={i} x={x} y={790 + i * 6} h={190} t={t} seed={612 + i} ropa={{ tunica: "#6a4a2e", tunica2: "#4a321e", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#a8a8a8" }} expr="miedo" camina={2.4} bD={150} cD={60} bI={150} cI={60} />; })}
        <Sello t={t} t0={585.4} text="DESTROYED" x={620} y={430} size={90} rot={-8} />
      </Escena>
      {/* 2 · Alcuino: semejante terror nunca se había visto en Britania */}
      <Escena t={t} t0={586.27} t1={593.49} entra="sube">
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #4a3a6a, #120e2a 80%)" }} />
        <Persona x={1480} y={1080} h={680} t={t} seed={610} ropa={{ tunica: "#3a2a4a", tunica2: "#2a1a3a", cinto: "#c9a24a", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#a8a8a8" }} viejo expr="triste" mira={-0.5} miraY={0.5} bD={60 + Math.sin(t * 6) * 8} cD={80 + Math.sin(t * 9) * 10} manoD={<path d="M 0 0 L 10 -110 Q 30 -80 14 0 Z" fill="#f4ead2" stroke="#2a1530" strokeWidth={4} />} />
        <Cita t={t} t0={586.5} texto="“Such terror has never before appeared in Britain… nor was it thought that such a voyage was possible.”" autor="ALCUIN, SCHOLAR · 793" x={760} y={480} w={1250} size={56} />
      </Escena>
      {/* 3 · la sorpresa era su modelo de negocio: monasterios en días santos, pueblos en día de mercado */}
      <Escena t={t} t0={593.49} t1={603.31} entra="diag" golpes={[593.9, 596.0, 600.0]}>
        <AbsoluteFill style={{ background: "#16123d" }} />
        <G t={t} t0={593.6} t1={595.9} text="SURPRISE = THE BUSINESS MODEL" y={540} size={80} color={C.ambar} />
        {t > 595.9 && (
          <>
            <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg, #f2c08a, #ffe8c0)", overflow: "hidden", clipPath: `inset(0 ${(1 - ent(t, 595.9)) * 100}% 0 0)` }}>
              <Iglesia x={480} y={560} s={0.55} t={t} />
              {[300, 400, 560, 660].map((x, i) => <Persona key={i} x={x} y={880} h={200} t={t} seed={620 + i} ropa={{ tunica: "#6a5a4a", tunica2: "#4a3a2a", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#3a2418" }} expr="feliz" />)}
              <Ch t={t} t0={596.4} text="MONASTERIES" color={C.violeta} x={480} y={170} centro size={60} />
              {t > 598.4 && <Drakkar x={interpolate(t, [598.4, 600], [-300, 200], { extrapolateRight: "clamp" })} y={980} s={0.3} t={t} vela={1} remos={1} />}
              <Ch t={t} t0={597.4} text="ON HOLY DAYS ✝" color={C.ambar} tinta={C.noche} x={480} y={940} centro size={52} />
            </div>
            <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg, #8ad0f0, #d8f0f8)", overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - ent(t, 597.0)) * 100}%)` }}>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={960} height={1080}>
                {casa(240, 760, 0.7)}{casa(720, 760, 0.7)}
                {[[380, 820], [560, 840]].map(([x, y], i) => <g key={i}><rect x={x - 70} y={y - 40} width={140} height={60} fill="#c8743a" stroke="#2a1530" strokeWidth={6} /><path d={`M ${x - 80} ${y - 40} L ${x} ${y - 100} L ${x + 80} ${y - 40} Z`} fill={i ? "#d6283e" : "#2f78a8"} stroke="#2a1530" strokeWidth={6} /></g>)}
                <rect x={430} y={580} width={100} height={260} fill="#2a1530" /><rect x={436} y={590} width={40} height={240} fill="#8a6a4a" transform="rotate(-20 436 590)" />
              </svg>
              <Ch t={t} t0={600.4} text="TOWNS" color={C.rojo} x={480} y={170} centro size={60} />
              {[0, 1, 2].map((i) => <Persona key={i} x={260 + i * 220} y={1010} h={190} t={t} seed={650 + i} ropa={{ tunica: ["#c8743a", "#2f78a8", "#7aa04a"][i], tunica2: "#4a3a2a", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#3a2418" }} expr="feliz" camina={1} />)}
              <Ch t={t} t0={601.4} text="MARKET DAYS · GATES OPEN" color={C.teal} tinta={C.noche} x={480} y={940} centro size={44} />
            </div>
            <div style={{ position: "absolute", left: 952, top: 0, width: 16, height: 1080, background: "#fff" }} />
          </>
        )}
      </Escena>
      {/* 4 · su movida favorita en casa: la quema de casas · rodear, prender el techo, matar al que salga */}
      <Escena t={t} t0={603.31} t1={615.65} entra="iris" ix={960} iy={640} golpes={[606.6, 610.4, 612.2, 614.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={0} y={860} width={1920} height={220} fill="#1e3a3a" />
          {casa(960, 840, 1.6, prog(t, 612.2, 613.4), t)}
        </svg>
        {t > 612.2 && <Particulas t={t} tipo="brasas" n={60} seed={11} />}
        {t > 612.2 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, rgba(255,140,60,${0.35 * prog(t, 612.2, 613.4)}), transparent 60%)` }} />}
        {Array.from({ length: 8 }, (_, i) => {
          const a = Math.PI * (0.05 + i * 0.13);
          const r = interpolate(t, [610.4, 612.0], [1100, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <Persona key={i} x={960 + Math.cos(a) * r * (i % 2 ? 1 : -1)} y={1020 - (i % 3) * 20} h={300} t={t} seed={630 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" sombra={t < 612.2 ? "#05041a" : undefined} flip={i % 2 === 1} manoD={i % 3 === 0 ? <g transform="rotate(-150)"><rect x={-6} y={0} width={12} height={110} fill="#6b4022" /><circle cx={0} cy={120} r={20 + Math.sin(t * 20 + i) * 6} fill="#ffb24a" /></g> : <LanzaMano a={60} inclina={-30} largo={340} />} />;
        })}
        <Ch t={t} t0={603.5} t1={610.3} text="THEIR FAVORITE MOVE AT HOME" color={C.violeta} x={960} y={150} centro size={56} />
        <G t={t} t0={606.6} t1={610.2} text="THE HOUSE BURNING" y={260} size={120} color={C.ambar} />
        <Ch t={t} t0={608.4} t1={610.2} text="AGAIN AND AGAIN IN THE SAGAS" color={C.teal} tinta={C.noche} x={960} y={400} centro size={50} />
        <Ch t={t} t0={610.4} text="1 · SURROUND" color={C.teal} tinta={C.noche} x={150} y={260} size={52} />
        <Ch t={t} t0={612.2} text="2 · ROOF ON FIRE" color={C.ambar} tinta={C.noche} x={150} y={360} size={52} />
        <Ch t={t} t0={614.0} text="3 · KILL WHOEVER RUNS OUT" color={C.rojo} x={150} y={460} size={52} />
      </Escena>
      {/* 5 · así se ganó su nombre Njal «el quemado»: lo quemaron vivo en su casa, con su familia adentro */}
      <Escena t={t} t0={615.65} t1={622.03} entra="corte" golpes={[617.8]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #6a2a1a, #12061a 80%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{casa(960, 900, 1.1, 1, t)}
          {[-18, 0, 18].map((dx, i) => <g key={i}><circle cx={960 + dx} cy={862 - (i === 1 ? 10 : 0)} r={i === 1 ? 14 : 10} fill="#2a1020" /><path d={`M ${948 + dx} 900 Q ${960 + dx} ${868 - (i === 1 ? 10 : 0)} ${972 + dx} 900 Z`} fill="#2a1020" /></g>)}
        </svg>
        {[0, 1, 2, 3, 4, 5].map((i) => <Persona key={i} x={i < 3 ? 260 + i * 150 : 1360 + (i - 3) * 150} y={1040} h={320} t={t} seed={660 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" sombra="#0a0410" flip={i < 3} manoD={<LanzaMano a={60} inclina={-30} largo={360} />} />)}
        <Particulas t={t} tipo="brasas" n={40} seed={12} />
        <G t={t} t0={615.8} text="BURNT NJAL" y={190} size={150} color={C.crema} />
        <Ch t={t} t0={617.8} text="BURNED ALIVE · IN HIS OWN HOUSE" color={C.rojo} x={960} y={330} centro size={52} />
        <Ch t={t} t0={619.8} text="WITH HIS FAMILY INSIDE" color={C.ambar} tinta={C.noche} x={960} y={420} centro size={50} />
      </Escena>
      {/* 6 · en Inglaterra, el golpe sorpresa más famoso: enero de 878, Noche de Reyes, Chippenham, el rey Alfredo */}
      <Escena t={t} t0={622.03} t1={630.0} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[622.03, 700, 720, 1.6], [626.0, 646, 767, 4.4], [630, 646, 767, 5.0]]} desde="NORWAY"
          pulsa={[{ n: "CHIPPENHAM", t0: 624.4, color: C.rojo, label: "CHIPPENHAM", lado: "der" }]} />
        {t > 625.6 && (
          <AbsoluteFill style={{ opacity: prog(t, 625.6, 626.2) }}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #2a2a6a 75%)" }} />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 800 Q 960 740 1920 800 L 1920 1080 L 0 1080 Z" fill="#e8eef8" /></svg>
            <CasaLarga t={t} x={960} y={820} s={1.1} luz={625.0} />
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 960 + (i - 1.5) * 220 * 1.1 - 12, top: 820 - 360 * 1.1 + 300 * 1.1 + Math.abs(Math.sin(t * 4 + i)) * -10, width: 24, height: 24, borderRadius: 12, background: "#2a1020" }} />)}
            {t > 628 && [0, 1, 2].map((i) => <Persona key={i} x={interpolate(t, [628, 630], [-100 - i * 90, 260 - i * 90])} y={980} h={300} t={t} seed={700 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" sombra="#0a0410" camina={1.2} manoD={<LanzaMano a={60} inclina={-20} largo={320} />} />)}
          </AbsoluteFill>
        )}
        <Nieve2 t={t} />
        <Ch t={t} t0={622.2} t1={626.8} text="THE MOST FAMOUS SURPRISE ATTACK OF THE AGE" color={C.violeta} x={960} y={150} centro size={52} />
        <G t={t} t0={626.9} text="JANUARY 878" y={180} size={130} color={C.crema} />
        <Ch t={t} t0={628.2} text="RIGHT AFTER CHRISTMAS" color={C.teal} tinta={C.noche} x={960} y={310} centro size={52} />
      </Escena>
      <Escena t={t} t0={630.0} t1={640.81} entra="iris" ix={960} iy={600} golpes={[632.8, 634.6, 637.9]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #8a4a2a, #2a1020 85%)" }} />
        {/* puerta (se rompe) y ventana */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={60} y={360} width={220} height={440} fill={t > 634.6 ? "#05040f" : "#5a3418"} stroke="#2a1530" strokeWidth={10} />
          {t > 634.6 && [0, 1, 2].map((i) => <rect key={i} x={70 + i * 70 + (t - 634.6) * 300 * (i - 1)} y={420 + i * 120 + (t - 634.6) * 200} width={60} height={110} fill="#5a3418" stroke="#2a1530" strokeWidth={6} transform={`rotate(${(t - 634.6) * 200 * (i - 1)} ${100 + i * 70} ${470 + i * 120})`} />)}
          <rect x={1560} y={360} width={240} height={220} fill="#1a1440" stroke="#2a1530" strokeWidth={10} />
          <circle cx={1680} cy={440} r={30} fill="#f4ead2" />
        </svg>
        {(() => {
          const sx = interpolate(t, [637.0, 638.4], [960, 1700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const sy = 900 - Math.sin(prog(t, 637.0, 638.4) * Math.PI) * 120 - prog(t, 637.0, 638.4) * 250;
          return t < 638.4 && <>
            <Persona x={sx} y={sy} h={520 - prog(t, 637.0, 638.4) * 200} t={t} seed={371} ropa={{ tunica: "#c8a23a", tunica2: "#8a6a1a", cinto: "#3b230f", piel: "#e8a880", piel2: "#c98864", pelo: "#3a2418" }} expr={t > 634.6 ? "miedo" : "feliz"} bD={t < 634 ? 120 : 150} cD={t < 634 ? 10 : 60} bI={t > 634.6 ? 150 : undefined} cI={t > 634.6 ? 60 : undefined} />
            <Corona x={sx} y={sy - (520 - prog(t, 637.0, 638.4) * 200) * 1.02} s={0.52 - prog(t, 637.0, 638.4) * 0.2} t={t} t0={630.2} />
          </>;
        })()}
        {/* la fiesta de Noche de Reyes: mesa larga, velas */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={200} y={760} width={1520} height={60} rx={10} fill="#8a5a32" stroke="#2a1530" strokeWidth={8} />
          {Array.from({ length: 8 }, (_, i) => <g key={i}><rect x={300 + i * 190} y={700} width={16} height={60} fill="#f4ead2" /><ellipse cx={308 + i * 190} cy={690 + Math.sin(t * 9 + i) * 3} rx={10} ry={16} fill="#ffb24a" /></g>)}
          {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={420 + i * 230} cy={752} rx={50} ry={14} fill="#c9a24a" />)}
          <rect x={260} y={820} width={30} height={200} fill="#5e3a1e" /><rect x={1630} y={820} width={30} height={200} fill="#5e3a1e" />
        </svg>
        {t > 634.6 && Array.from({ length: 6 }, (_, i) => <Persona key={i} x={interpolate(t, [634.6, 636.4], [170 + i * 30, 300 + i * 150], { extrapolateRight: "clamp" })} y={1040} h={380} t={t} seed={640 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" camina={2} manoD={<LanzaMano a={60} inclina={-30} largo={360} />} />)}
        <Flash t={t} t0={634.6} dur={0.18} />
        <Ch t={t} t0={630.3} t1={634.5} text="THE TWELFTH NIGHT FEAST" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={58} />
        <Ch t={t} t0={632.8} t1={634.5} text="THE ROYAL ESTATE AT CHIPPENHAM" color={C.violeta} x={960} y={260} centro size={50} />
        <G t={t} t0={634.6} text="GUTHRUM ATTACKS" y={200} size={120} color={C.rojo} />
        <Ch t={t} t0={637.9} text="THE KING? ALFRED · THE BROTHER FROM READING" color={C.teal} tinta={C.noche} x={960} y={330} centro size={46} />
      </Escena>
      {/* 7 · escapó por poco: escondido en los pantanos de Somerset con un puñado de hombres · los panes quemados */}
      <Escena t={t} t0={640.81} t1={649.53} entra="barrido" banda={C.teal} golpes={[642.4, 646.8]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #8aa0a8, #c8d4c0 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={0} y={760} width={1920} height={320} fill="#5a7a5a" />
          {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={100 + i * 200} cy={860 + (i % 3) * 60} rx={120} ry={22} fill="#7a9aa8" opacity={0.8} />)}
          {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M ${i * 50} 790 q 6 -90 ${10 + (i % 3) * 6} -140`} stroke="#4a6a3a" strokeWidth={8} fill="none" />)}
        </svg>
        <Persona x={interpolate(t, [640.9, 642.4], [-200, 520], { extrapolateRight: "clamp" })} y={980} h={480} t={t} seed={371} ropa={{ tunica: "#c8a23a", tunica2: "#8a6a1a", cinto: "#3b230f", piel: "#e8a880", piel2: "#c98864", pelo: "#3a2418" }} expr={t > 646.8 ? "sorpresa" : "miedo"} camina={t < 642.4 ? 2 : 0} />
        {t > 644 && <Panes x={1200} y={860} s={1.2} t={t} t0={644.2} quema={prog(t, 646.8, 648.6)} />}
        {t > 646.8 && <Particulas t={t} tipo="polvo" n={30} seed={2} />}
        {t > 644.4 && t < 646.8 && <Emote t={t} t0={644.4} tipo="preg" x={560} y={760} s={1.3} />}
        {t > 645.4 && <Persona x={interpolate(t, [645.4, 646.6], [2100, 1600], { extrapolateRight: "clamp" })} y={980} h={460} t={t} seed={680} mujer ropa={{ tunica: "#8a3a5a", tunica2: "#5a2a3a", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#6a3a1a" }} expr={t > 646.8 ? "enojado" : "neutro"} flip camina={t < 646.6 ? 1.6 : 0} bD={t > 646.8 ? 150 : 20} cD={t > 646.8 ? 70 : 10} />}
        <Globo t={t} t0={647.2} x={1400} y={470} text="MY CAKES!!" size={60} cola="der" color={C.ambar} />
        <Ch t={t} t0={641.0} text="HE BARELY ESCAPED" color={C.rojo} x={960} y={150} centro size={60} />
        <Ch t={t} t0={642.6} text="THE MARSHES OF SOMERSET" color={C.violeta} x={960} y={260} centro size={54} />
        <Ch t={t} t0={644.4} text="A HANDFUL OF MEN" color={C.teal} tinta={C.noche} x={960} y={360} centro size={50} />
        <Sello t={t} t0={646.8} text="THE BURNT CAKES" x={980} y={600} size={64} rot={-8} />
      </Escena>
      {/* 8 · los mejores atacantes nocturnos de Europa: saben de dónde venís, cómo te movés y qué error vas a cometer */}
      <Escena t={t} t0={649.53} t1={667.9} zoom={0} entra="corte" golpes={[653.8, 658.4, 660.5, 665.1]}>
        <Mundo t={t} cam={cam}>
          {/* ojos que te siguen desde las tiendas */}
          {t > 658.3 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {[[4520, 790], [5000, 790], [5900, 790], [6550, 770]].map(([x, y], i) => <g key={i} opacity={ent(t, 658.4 + i * 0.15)}><circle cx={x - 18} cy={y} r={10} fill="#ffe28a" /><circle cx={x + 18} cy={y} r={10} fill="#ffe28a" /></g>)}
            </svg>
          )}
          {(() => { const x = interpolate(t, [660.4, 664.8], [4300, 3900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <Persona x={x} y={gy(x) + 4} h={250} t={t} seed={3} ropa={SAJON} expr="miedo" inclina={18} mira={t > 658.4 ? Math.sin(t * 1.6) * 0.9 : -0.3} camina={t > 660.4 && t < 664.8 ? 0.6 : 0} flip bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />; })()}
          {/* la flecha punteada de lo que vas a hacer… ya marcada por ellos */}
          {t > 660.5 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <path d={`M 4300 760 Q 4600 600 5000 760`} stroke={C.rojo} strokeWidth={14} fill="none" strokeDasharray="30 20" pathLength={1} style={{ strokeDasharray: `${prog(t, 660.5, 661.8)} 1` }} />
            </svg>
          )}
        </Mundo>
        <G t={t} t0={649.8} t1={653.6} text="THE BEST NIGHT ATTACKERS IN EUROPE" y={220} size={72} color={C.crema} />
        <Ch t={t} t0={653.8} t1={658.2} text="THEY'VE DONE IT TO OTHERS · MANY TIMES" color={C.violeta} x={960} y={150} centro size={54} />
        <Ch t={t} t0={658.4} t1={665.0} text="THEY KNOW WHERE YOU COME FROM" color={C.teal} tinta={C.noche} x={960} y={130} centro size={48} />
        <Ch t={t} t0={660.5} t1={665.0} text="HOW YOU MOVE" color={C.ambar} tinta={C.noche} x={960} y={220} centro size={48} />
        <Ch t={t} t0={662.0} t1={665.0} text="WHAT MISTAKE YOU'RE ABOUT TO MAKE" color={C.rojo} x={960} y={310} centro size={48} />
        {t > 665 && <AbsoluteFill style={{ background: `rgba(4,3,16,${prog(t, 665, 665.6) * 0.55})` }} />}
        <G t={t} t0={665.1} text="YOU BROUGHT A SURPRISE" y={470} size={96} color={C.ambar} />
        <G t={t} t0={665.6} text="TO ITS INVENTORS" y={600} size={96} color={C.crema} />
      </Escena>
    </AbsoluteFill>
  );
};

// nieve fina sobre el mapa de enero
const Nieve2: React.FC<{ t: number }> = ({ t }) => (
  <>{Array.from({ length: 50 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 397) % 1920 + Math.sin(t + i) * 20, top: ((i * 211 + t * 60) % 1080), width: 8, height: 8, borderRadius: 4, background: "#fff", opacity: 0.6 }} />)}</>
);

void Rayos; void Cuenta; void Llamas; void Tienda;
