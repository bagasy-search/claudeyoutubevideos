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
  [565.39, 6950, 760, 0.8], [567.85, 6200, 700, 0.75], [572.09, 5600, 760, 1.2], [575.31, 5300, 760, 1.4],
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
        <Mundo t={t} cam={cam} luna={[1700, 300, 60]} />
        {/* el chico entra de pie, mira a cámara y se encoge con lo incómodo */}
        {t > 567.8 && t < 574.2 && (() => {
          const x = interpolate(t, [567.8, 568.7], [2150, 1480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const anda = t < 568.7;
          const enc = prog(t, 568.9, 569.5); // se encoge
          const gira = t > 572.2; // NOT INVENTING: mira a los textos, sorprendido
          return <>
            <Persona x={x} y={1000} h={500 - enc * 45} t={t} seed={3} ropa={SAJON} expr={gira ? "sorpresa" : t > 568.9 ? "miedo" : "neutro"} flip={anda}
              camina={anda ? 1.4 : 0} inclina={anda ? 4 : enc * 10} mira={gira ? -0.8 : anda ? -0.6 : 0} miraY={gira ? -0.3 : 0} ladea={enc * (gira ? -6 : 8)}
              bD={anda ? 20 : -80 * enc + 20 * (1 - enc)} cD={anda ? 10 : 110 * enc} bI={anda ? 20 : -80 * enc + 20 * (1 - enc)} cI={anda ? 10 : 110 * enc} />
            <Emote t={t} t0={569.3} t1={572.2} tipo="sudor" x={1480} y={1000 - 455 * 0.8} s={1} />
            <Emote t={t} t0={572.3} tipo="excl" x={1480} y={1000 - 455 * 0.8} s={1} />
          </>;
        })()}
        {/* espejo: tu sombra es un vikingo */}
        {t > 573.9 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: `rgba(10,6,30,${0.55 * ent(t, 573.9)})` }}>
            <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${ent(t, 574.0)})`, width: 600, height: 760, borderRadius: "50% 50% 46% 46%", border: "18px solid #c9a24a", background: "radial-gradient(circle, #3a3a7a, #16123d)", overflow: "hidden" }}>
              <Persona x={300} y={780} h={620} t={t} seed={601} ropa={VIK(2)} casco="vikingo" barba={barbaDe(2)} expr={t > 575.4 ? "feliz" : "orgullo"} bD={t > 575.4 ? 140 : 20} cD={t > 575.4 ? 60 : 10} />
              {/* el del espejo te guiña */}
              {t > 576.3 && t < 576.8 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={600} height={760}><ellipse cx={342} cy={280} rx={30} ry={36} fill="#f5d0b0" /><path d="M 318 282 Q 342 298 366 282" stroke="#3b2416" strokeWidth={8} fill="none" strokeLinecap="round" /></svg>}
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
        <MapaN t={t} cam={[[578.37, 510, 381, 1.0], [580.7, 560, 400, 1.1], [582.0, 672, 410, 3.0], [582.4, 672, 410, 3.1]]} desde="NORWAY"
          pulsa={[{ n: "LINDISFARNE", t0: 580.9, color: C.rojo, label: "LINDISFARNE", lado: "aba" }]}
          rutas={[{ de: "NORWAY", a: "LINDISFARNE", t0: 578.9, color: C.rojo, curva: 60, dur: 1.9, ancho: 10 }]}>
          {t > 578.9 && (() => {
            const a = lugarN("NORWAY"), b = lugarN("LINDISFARNE"); const u = prog(t, 578.9, 580.9);
            // sigue la misma curva (cuadrática) que la ruta
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 60;
            const bx = (1 - u) ** 2 * a.x + 2 * (1 - u) * u * mx + u * u * b.x, by = (1 - u) ** 2 * a.y + 2 * (1 - u) * u * my + u * u * b.y;
            const salta = t > 581.0;
            return (
              <div style={{ position: "absolute", left: bx + 40, top: by - 20, transform: `translate(-50%,-50%) scale(0.12) scaleX(-1)` }}>
                <Drakkar x={0} y={0} s={1} t={t} vela={1} remos={u < 1 ? 1.5 : 0} />
                {/* 3 vikingos saltan del barco a la orilla (a la izquierda en pantalla = +x local) y corren */}
                {[0, 1, 2].map((i) => {
                  const tj = 581.0 + i * 0.22; const v = prog(t, tj, tj + 0.5);
                  const lx = -320 + i * 330 + v * 700 + Math.max(0, t - tj - 0.5) * 420;
                  const ly = -40 + v * 100 - Math.sin(v * Math.PI) * 260;
                  const corre = t > tj + 0.5;
                  return <Persona key={i} x={lx} y={ly} h={440} t={t} seed={603 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={t > tj ? "feliz" : "enojado"} camina={corre ? 2.4 : 0}
                    bD={t > tj && !corre ? 160 : 60 + Math.sin(t * 6 + i) * 20} cD={30} bI={t > tj && !corre ? 160 : 20} cI={20} manoD={<LanzaMano a={30} inclina={-10} largo={300} />} />;
                })}
              </div>
            );
          })()}
        </MapaN>
        <G t={t} t0={578.6} t1={581.4} text="793" x={500} y={300} size={200} color={C.ambar} />
        <G t={t} t0={581.5} text="793" x={300} y={160} size={120} color={C.ambar} />
        <Ch t={t} t0={581.2} text="NORTHUMBRIA" color={C.teal} tinta={C.noche} x={960} y={980} centro size={52} />
      </Escena>
      <Escena t={t} t0={582.4} t1={586.27} entra="iris" ix={1100} iy={600} golpes={[583.6, 585.4]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2c08a, #ffe8c0 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={780} width={1920} height={300} fill="#3a7ac8" /><path d="M 600 800 Q 1100 640 1700 800 Z" fill="#7aa04a" /></svg>
        <Iglesia x={1200} y={640} s={0.62} t={t} arde={prog(t, 585.4, 586.2)} />
        {[0, 1, 2].map((i) => <Drakkar key={i} x={interpolate(t, [582.5, 584.6], [-400 - i * 380, 300 + i * 220], { extrapolateRight: "clamp" })} y={850 + i * 20} s={0.42} t={t} vela={1} remos={1} />)}
        <Ch t={t} t0={582.6} text="THE MONASTERY OF LINDISFARNE" color={C.violeta} x={960} y={150} centro size={56} />
        <Ch t={t} t0={583.6} text="OUT OF NOWHERE" color={C.rojo} x={960} y={260} centro size={56} />
        {/* los monjes salen de la iglesia y huyen (enteros, frenan antes del borde) */}
        {t > 583.4 && [0, 1, 2].map((i) => { const x = interpolate(t, [583.4 + i * 0.15, 585.8], [1420, 1560 + i * 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); const corre = t < 585.8; return <Persona key={i} x={x} y={792 + i * 6} h={190} t={t} seed={612 + i} ropa={{ tunica: "#6a4a2e", tunica2: "#4a321e", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#a8a8a8" }} expr="miedo" camina={corre ? 2.4 : 0} flip={!corre} mira={corre ? 0.6 : -0.8} bD={150} cD={60} bI={150} cI={60} />; })}
        {/* los vikingos saltan de los barcos y corren a la iglesia */}
        {t > 584.5 && [0, 1, 2].map((i) => { const x = interpolate(t, [584.5 + i * 0.2, 586.2], [560 + i * 120, 880 + i * 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <Persona key={i} x={x} y={812 - i * 4} h={210} t={t} seed={615 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" camina={2.2} salta={584.5 + i * 0.2} manoD={<LanzaMano a={70} inclina={-30} largo={260} />} />; })}
        <Sello t={t} t0={585.4} text="DESTROYED" x={620} y={430} size={90} rot={-8} />
      </Escena>
      {/* 2 · Alcuino: semejante terror nunca se había visto en Britania */}
      <Escena t={t} t0={586.27} t1={593.49} entra="sube">
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #4a3a6a, #120e2a 80%)" }} />
        {(() => {
          // Alcuino escribe la carta: la pluma va al ritmo del texto (rápido mientras se escribe, después se detiene)
          const escribe = t > 586.5 && t < 589.0;
          const fin = t > 589.4;
          return <>
            {/* atril con el pergamino */}
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              <rect x={1398} y={830} width={24} height={200} fill="#5e3a1e" stroke="#2a1530" strokeWidth={6} />
              <rect x={1320} y={1010} width={180} height={24} rx={8} fill="#5e3a1e" stroke="#2a1530" strokeWidth={6} />
            </svg>
            <Persona x={1480} y={1010} h={540} t={t} seed={610} ropa={{ tunica: "#3a2a4a", tunica2: "#2a1a3a", cinto: "#c9a24a", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#a8a8a8" }} viejo
              expr={fin ? (t > 591.5 ? "miedo" : "triste") : "triste"} mira={fin ? -0.9 : 0.6} miraY={fin ? 0 : 0.7} inclina={escribe ? 6 : 0} ladea={fin ? Math.sin(t * 3) * 6 : 0}
              flip bD={escribe ? 38 + Math.sin(t * 14) * 8 : fin ? 20 : 34} cD={escribe ? 22 + Math.sin(t * 21) * 12 : fin ? 10 : 20}
              bI={fin && t > 591.5 ? 150 : 10} cI={fin && t > 591.5 ? 70 : 10}
              manoD={<g transform={`translate(${escribe ? Math.sin(t * 9) * 15 : 0} 0)`}><path d="M 0 0 L 10 -110 Q 30 -80 14 0 Z" fill="#f4ead2" stroke="#2a1530" strokeWidth={4} /></g>} />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              <path d="M 1280 860 L 1560 800 L 1580 850 L 1300 912 Z" fill="#8a5a32" stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
              <path d="M 1310 852 L 1540 804 L 1552 836 L 1320 884 Z" fill="#f4ead2" />
              {Array.from({ length: 4 }, (_, k) => { const L = prog(t, 586.5 + k * 0.6, 587.1 + k * 0.6); return <line key={k} x1={1330 + k * 4} y1={856 - k * 8 + 14} x2={1330 + k * 4 + 190 * L} y2={856 - k * 8 + 14 - 40 * L} stroke="#3b2416" strokeWidth={4} />; })}
            </svg>
            <Emote t={t} t0={591.5} tipo="sudor" x={1400} y={600} s={1.1} />
          </>;
        })()}
        <Cita t={t} t0={586.5} texto="“Such terror has never before appeared in Britain… nor was it thought that such a voyage was possible.”" autor="ALCUIN, SCHOLAR · 793" x={700} y={440} w={1120} size={56} />
      </Escena>
      {/* 3 · la sorpresa era su modelo de negocio: monasterios en días santos, pueblos en día de mercado */}
      <Escena t={t} t0={593.49} t1={603.31} entra="diag" golpes={[593.9, 596.0, 600.0]}>
        <AbsoluteFill style={{ background: "#16123d" }} />
        {/* un vikingo salta de atrás de un barril: ¡SORPRESA! */}
        {t < 596.2 && (() => {
          const H = 480, up = prog(t, 593.75, 594.15);
          const Y = 1010 + (1 - up) * 330; // asoma de detrás del barril
          const arriba = t > 594.0;
          const guina = t > 594.95 && t < 595.5;
          const S = H / 560;
          return <>
            <Persona x={960} y={Y} h={H} t={t} seed={622} ropa={VIK(1)} casco="vikingo" barba={barbaDe(1)} expr={arriba ? "feliz" : "orgullo"} salta={594.15} mira={guina ? 0 : arriba ? 0 : -0.6}
              bD={arriba ? (guina ? 95 : 150) : 10} cD={arriba ? (guina ? -60 : 40) : 10} bI={arriba ? 150 : 10} cI={arriba ? 40 : 10} />
            {guina && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><ellipse cx={960 + 38 * S} cy={Y - 452 * S} rx={27 * S} ry={33 * S} fill="#eab58e" /><path d={`M ${960 + 16 * S} ${Y - 452 * S} Q ${960 + 38 * S} ${Y - 438 * S} ${960 + 60 * S} ${Y - 452 * S}`} stroke="#3b2416" strokeWidth={7} fill="none" strokeLinecap="round" /></svg>}
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={780} y={860} width={360} height={220} rx={24} fill="#8a5a32" stroke="#2a1530" strokeWidth={10} />{[910, 990].map((yy) => <line key={yy} x1={780} y1={yy} x2={1140} y2={yy} stroke="#5e3a1e" strokeWidth={10} />)}</svg>
            <Emote t={t} t0={594.1} tipo="excl" x={1020} y={720} s={1.1} />
            {guina && <Emote t={t} t0={595.0} tipo="brillos" x={1000} y={760} s={1} />}
          </>;
        })()}
        <G t={t} t0={593.6} t1={595.9} text="SURPRISE" y={200} size={170} color={C.ambar} />
        <G t={t} t0={594.2} t1={595.9} text="= THE BUSINESS MODEL" y={360} size={74} color={C.crema} />
        {t > 595.9 && (
          <>
            <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg, #f2c08a, #ffe8c0)", overflow: "hidden", clipPath: `inset(0 ${(1 - ent(t, 595.9)) * 100}% 0 0)` }}>
              <Iglesia x={480} y={560} s={0.55} t={t} />
              {[150, 270, 600, 720].map((x0, i) => { const huye = t > 599.4; const x = huye ? x0 + (x0 < 480 ? -1 : 1) * 0 + interpolate(t, [599.4, 601.2], [0, x0 < 480 ? 60 : 160], { extrapolateRight: "clamp" }) : x0 + Math.sin(t * 1.4 + i) * 6; return <Persona key={i} x={x} y={880} h={200} t={t} seed={620 + i} ropa={{ tunica: "#6a5a4a", tunica2: "#4a3a2a", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#3a2418" }} expr={huye ? "miedo" : "feliz"} mira={huye ? -0.8 : 0} camina={huye && t < 601.2 ? 2 : 0} bD={huye ? 150 : 100 + Math.sin(t * 3 + i) * 10} cD={huye ? 60 : 110} manoD={huye ? undefined : <g><rect x={-6} y={-60} width={12} height={50} fill="#f4ead2" /><ellipse cx={0} cy={-70} rx={8} ry={12} fill="#ffb24a" /></g>} />; })}
              {t > 599.3 && <Emote t={t} t0={599.3} tipo="excl" x={300} y={600} s={1} />}
              <Ch t={t} t0={596.4} text="MONASTERIES" color={C.violeta} x={480} y={170} centro size={60} />
              {t > 598.4 && <Drakkar x={interpolate(t, [598.4, 599.6], [-300, 250], { extrapolateRight: "clamp" })} y={1000} s={0.26} t={t} vela={1} remos={1} />}
              <Ch t={t} t0={597.4} text="ON HOLY DAYS ✝" color={C.ambar} tinta={C.noche} x={480} y={290} centro size={52} />
            </div>
            <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg, #8ad0f0, #d8f0f8)", overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - ent(t, 597.0)) * 100}%)` }}>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={960} height={1080}>
                {casa(240, 760, 0.7)}{casa(720, 760, 0.7)}
                {[[380, 820], [560, 840]].map(([x, y], i) => <g key={i}><rect x={x - 70} y={y - 40} width={140} height={60} fill="#c8743a" stroke="#2a1530" strokeWidth={6} /><path d={`M ${x - 80} ${y - 40} L ${x} ${y - 100} L ${x + 80} ${y - 40} Z`} fill={i ? "#d6283e" : "#2f78a8"} stroke="#2a1530" strokeWidth={6} /></g>)}
                <rect x={430} y={580} width={100} height={260} fill="#2a1530" /><rect x={436} y={590} width={40} height={240} fill="#8a6a4a" transform="rotate(-20 436 590)" />
              </svg>
              <Ch t={t} t0={600.4} text="TOWNS" color={C.rojo} x={480} y={170} centro size={60} />
              {[0, 1, 2].map((i) => { const huye = t > 602.0; const x = huye ? interpolate(t, [602.0, 603.3], [200 + i * 220, 60 + i * 200]) : 100 + i * 230 + Math.max(0, t - 597) * 45; return <Persona key={i} x={x} y={1010} h={190} t={t} seed={650 + i} ropa={{ tunica: ["#c8743a", "#2f78a8", "#7aa04a"][i], tunica2: "#4a3a2a", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#3a2418" }} expr={huye ? "miedo" : "feliz"} camina={huye ? 2.2 : 1} flip={huye} bD={huye ? 150 : 10} cD={huye ? 60 : 10} manoD={!huye && i === 1 ? <rect x={-30} y={-6} width={60} height={46} rx={8} fill="#c9a24a" stroke="#2a1530" strokeWidth={5} /> : undefined} />; })}
              {t > 601.2 && <Drakkar x={interpolate(t, [601.2, 602.2], [1200, 720], { extrapolateRight: "clamp" })} y={930} s={0.26} t={t} vela={1} remos={1} flip />}
              <Ch t={t} t0={601.4} text="MARKET DAYS" color={C.teal} tinta={C.noche} x={480} y={290} centro size={52} />
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
          // se arriman agachados (siluetas), rodean la casa y al prender el techo apuntan las lanzas a la PUERTA
          const a = Math.PI * (0.05 + i * 0.13);
          const r = interpolate(t, [603.4, 610.3, 612.0], [1060, 900, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const izq = i % 2 === 0;
          const x = 960 + Math.cos(a) * r * (izq ? -1 : 1);
          const mueve = t < 612.0;
          const apunta = t > 612.2;
          const estoca = t > 614.0 ? Math.max(0, Math.sin((t - 614.0) * 9)) * 18 : 0;
          return <Persona key={i} x={x} y={1020 - (i % 3) * 20} h={300} t={t} seed={630 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" sombra={t < 612.2 ? "#05041a" : undefined} flip={!izq}
            camina={mueve ? (t > 610.3 ? 1.6 : 0.5) : 0} inclina={mueve ? 14 : apunta ? 10 + estoca * 0.4 : 0} mira={apunta ? 0.9 : 0}
            bD={apunta ? 75 + estoca : 30} cD={apunta ? 10 : 20}
            manoD={i % 3 === 0 ? <g transform="rotate(-150)"><rect x={-6} y={0} width={12} height={110} fill="#6b4022" /><circle cx={0} cy={120} r={20 + Math.sin(t * 20 + i) * 6} fill="#ffb24a" /></g> : <LanzaMano a={apunta ? -10 : 60} inclina={apunta ? -60 : -30} largo={340} />} />;
        })}
        {/* alguien se asoma por la puerta… y vuelve a entrar */}
        {t > 614.0 && t < 615.4 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><circle cx={960} cy={830 - Math.sin(prog(t, 614.0, 615.4) * Math.PI) * 30} r={22} fill="#2a1020" /><circle cx={952} cy={824 - Math.sin(prog(t, 614.0, 615.4) * Math.PI) * 30} r={5} fill="#fff" /><circle cx={968} cy={824 - Math.sin(prog(t, 614.0, 615.4) * Math.PI) * 30} r={5} fill="#fff" /></svg>}
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
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{casa(960, 960, 1.35, 1, t)}
          {/* ventana encendida con la familia adentro */}
          <rect x={754} y={836} width={156} height={100} rx={10} fill="#ffcf6a" stroke="#2a1530" strokeWidth={10} />
        </svg>
        <div style={{ position: "absolute", left: 759, top: 841, width: 146, height: 90, overflow: "hidden" }}>
          {[0, 1, 2].map((k) => <Persona key={k} x={28 + k * 45} y={k === 1 ? 170 : 180} h={k === 1 ? 150 : 135} t={t} seed={671 + k} soloCabeza mujer={k === 0} ropa={{ tunica: "#6a4a2e", tunica2: "#4a321e", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: k === 1 ? "#c9c4c0" : "#6a3a1a" }} viejo={k === 1} barba={k === 1 ? "#d8d4cf" : undefined} expr={t > 619.8 ? "miedo" : "sorpresa"} mira={Math.sin(t * 2.2 + k) * 0.9} ladea={Math.sin(t * 7 + k) * 5} />)}
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => { const izq = i < 3; const x0 = izq ? 180 + i * 150 : 1440 + (i - 3) * 150; const x = x0 + (izq ? 1 : -1) * interpolate(t, [615.7, 617.6], [-60, 0], { extrapolateRight: "clamp" }); return <Persona key={i} x={x} y={1040} h={320} t={t} seed={660 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" sombra="#0a0410" flip={izq} camina={t < 617.6 ? 1.2 : 0} bD={30 + Math.max(0, Math.sin(t * 5 + i)) * 40} cD={20} manoD={<LanzaMano a={60} inclina={-30} largo={360} />} />; })}
        <Particulas t={t} tipo="brasas" n={40} seed={12} />
        <G t={t} t0={615.8} text="BURNT NJAL" y={190} size={150} color={C.crema} />
        <Ch t={t} t0={617.8} text="BURNED ALIVE · IN HIS OWN HOUSE" color={C.rojo} x={960} y={330} centro size={52} />
        <Ch t={t} t0={619.8} text="WITH HIS FAMILY INSIDE" color={C.ambar} tinta={C.noche} x={960} y={420} centro size={50} />
      </Escena>
      {/* 6 · en Inglaterra, el golpe sorpresa más famoso: enero de 878, Noche de Reyes, Chippenham, el rey Alfredo */}
      <Escena t={t} t0={622.03} t1={630.0} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[622.03, 700, 720, 1.6], [626.0, 646, 767, 4.4], [630, 646, 767, 5.0]]} desde="NORWAY"
          pulsa={[{ n: "CHIPPENHAM", t0: 624.4, color: C.rojo, label: "CHIPPENHAM", lado: "der" }]} />
        {/* Guthrum señala el objetivo en el mapa */}
        {t < 626.0 && <>
          {(() => {
            const gx = interpolate(t, [622.05, 623.4], [1760, 1560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const brazo = interpolate(t, [623.5, 624.3], [15, 95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <>
              <Persona x={gx} y={1000} h={520} t={t} seed={690} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} expr={t > 624.4 ? "orgullo" : "enojado"} flip camina={t < 623.4 ? 1.3 : 0} mira={0.8}
                bD={brazo + (t > 624.4 ? Math.sin(t * 8) * 5 : 0)} cD={t > 623.5 ? 0 : 10} salta={624.4} />
              <Ch t={t} t0={623.2} text="GUTHRUM" color={C.rojo} x={1560} y={360} centro size={46} />
            </>;
          })()}
        </>}
        {t > 625.6 && (
          <AbsoluteFill style={{ clipPath: `circle(${prog(t, 625.6, 626.3) * 125}% at 950px 550px)` }}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #2a2a6a 75%)" }} />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 800 Q 960 740 1920 800 L 1920 1080 L 0 1080 Z" fill="#e8eef8" /></svg>
            <CasaLarga t={t} x={1060} y={820} s={1.1} luz={625.0} />
            {/* sombras de los invitados festejando detrás de las ventanas */}
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 1060 + (i - 1.5) * 220 * 1.1 - 12, top: 820 - 360 * 1.1 + 300 * 1.1 + Math.abs(Math.sin(t * 4 + i)) * -10, width: 24, height: 24, borderRadius: 12, background: "#2a1020" }} />)}
            {/* los vikingos se acercan por la nieve, agachados */}
            {[0, 1, 2].map((i) => { const x = interpolate(t, [626.2, 629.8], [130 + i * 110, 330 + i * 120], { extrapolateRight: "clamp" }); return <Persona key={i} x={x} y={990 + i * 8} h={280} t={t} seed={700 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" sombra="#0a0410" camina={t < 629.8 ? 1.0 : 0} inclina={16} manoD={<LanzaMano a={60} inclina={-20} largo={300} />} />; })}
            <Ch t={t} t0={626.6} text="CHIPPENHAM" color={C.rojo} x={1060} y={980} centro size={48} />
          </AbsoluteFill>
        )}
        <Nieve2 t={t} />
        <Ch t={t} t0={622.2} t1={626.8} text="THE MOST FAMOUS SURPRISE ATTACK OF THE AGE" color={C.violeta} x={960} y={150} centro size={50} />
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
        {t > 634.6 && Array.from({ length: 6 }, (_, i) => {
          // irrumpen, buscan al rey; cuando salta por la ventana corren hacia ella y uno la señala
          const x = interpolate(t, [634.6, 636.4, 638.4, 640.8], [170 + i * 30, 300 + i * 150, 300 + i * 150, 520 + i * 170], { extrapolateRight: "clamp" });
          const corre = t < 636.4 || t > 638.4;
          const busca = t > 636.4 && t < 638.4;
          return <Persona key={i} x={x} y={1040} h={380} t={t} seed={640 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={t > 638.4 && i === 5 ? "sorpresa" : "enojado"} camina={corre ? 2 : 0} mira={busca ? Math.sin(t * 3 + i) : 0.9}
            bD={t > 638.4 && i === 5 ? 120 : busca ? 60 + Math.sin(t * 6 + i) * 25 : 30} cD={t > 638.4 && i === 5 ? 0 : 20} salta={i === 5 ? 638.5 : undefined} manoD={i === 5 && t > 638.4 ? undefined : <LanzaMano a={60} inclina={-30} largo={360} />} />;
        })}
        <Flash t={t} t0={634.6} dur={0.18} />
        <Ch t={t} t0={629.85} t1={634.5} text="THE TWELFTH NIGHT FEAST" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={58} />
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
      <Escena t={t} t0={649.53} t1={667.9} zoom={0} entra="corte" golpes={[653.8, 658.4, 660.5, 662.0, 665.1]}>
        {/* A · el campamento de los expertos y el veterano que cuenta sus golpes */}
        {t < 658.35 && (
          <Mundo t={t} cam={cam} luna={[1730, 450, 55]}>
            {t < 653.6 && <Persona x={5000} y={gy(5000) + 4} h={250} t={t} seed={3} ropa={SAJON} expr="miedo" inclina={18} mira={Math.sin(t * 1.6) * 0.9} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />}
            {/* 3 expertos llegan, se sientan en el tronco frente a la carpa y miran a cámara */}
            {t < 653.6 && [0, 1, 2].map((i) => {
              const X0 = 5900 + i * 170; const llega = 650.6 + i * 0.25;
              const x = interpolate(t, [649.53, llega], [X0 + 520, X0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const sienta = prog(t, llega, llega + 0.3);
              const H = 340;
              return <Persona key={i} x={x} y={gy(X0) + 4 + sienta * H * 0.2} h={H} t={t} seed={680 + i} ropa={VIK(i + 2)} casco="vikingo" barba={barbaDe(i + 2)} expr={t > 652.2 ? (i === 1 ? "feliz" : "orgullo") : "neutro"} flip={sienta < 1}
                camina={sienta < 0.01 ? 1.5 : 0} mira={sienta > 0.5 ? 0 : -0.7} bD={t > 652.3 && i === 1 ? 95 : t > 651.8 && i === 0 ? 150 : 30} cD={t > 652.3 && i === 1 ? 0 : t > 651.8 && i === 0 ? 40 + Math.sin(t * 9) * 20 : 30}
                manoD={i === 2 ? <LanzaMano a={60} inclina={-20} largo={320} /> : undefined} />;
            })}
            {t < 653.6 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}><rect x={5800} y={gy(6070) - 70} width={540} height={146} rx={40} fill="#7a4a2a" stroke="#2a1530" strokeWidth={8} /><circle cx={5835} cy={gy(6070) + 3} r={40} fill="#c9905a" stroke="#2a1530" strokeWidth={6} /></svg>}
          </Mundo>
        )}
        {t < 658.35 && t > 653.6 && (() => {
          const e = prog(t, 653.6, 654.1);
          const n = Math.max(0, Math.min(25, Math.floor((t - 654.2) / 0.15)));
          const golpe = (t - 654.2) % 0.15 < 0.05 && n < 25;
          return <>
            <AbsoluteFill style={{ background: `rgba(6,4,22,${0.45 * e})` }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${(1 - e) * 300}px)` }}>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                <rect x={700} y={500} width={760} height={380} rx={20} fill="#8a5a32" stroke="#2a1530" strokeWidth={12} />
                {[580, 680, 780].map((yy) => <line key={yy} x1={712} y1={yy} x2={1448} y2={yy} stroke="#5e3a1e" strokeWidth={6} />)}
                {Array.from({ length: n }, (_, k) => { const g = Math.floor(k / 5), m = k % 5; const gx = 760 + (g % 3) * 230, gy0 = 540 + Math.floor(g / 3) * 170; return m < 4 ? <line key={k} x1={gx + m * 34} y1={gy0} x2={gx + m * 34} y2={gy0 + 120} stroke="#f4ead2" strokeWidth={12} strokeLinecap="round" /> : <line key={k} x1={gx - 16} y1={gy0 + 100} x2={gx + 120} y2={gy0 + 20} stroke={C.rojo} strokeWidth={12} strokeLinecap="round" />; })}
              </svg>
              <Persona x={460} y={1040} h={560} t={t} seed={691} ropa={VIK(2)} casco="vikingo" barba="#c9c4c0" viejo expr={n > 20 ? "orgullo" : "feliz"} mira={0.9} bD={golpe ? 70 : 95} cD={golpe ? 40 : 60} manoD={<g transform="rotate(-90)"><rect x={-5} y={-10} width={10} height={70} fill="#c8d0dc" stroke="#2a1530" strokeWidth={3} /></g>} />
              {golpe && <Particulas t={t} tipo="destellos" n={6} seed={n + 1} />}
            </div>
          </>;
        })()}
        <G t={t} t0={649.8} t1={653.6} text="THE BEST NIGHT ATTACKERS" y={170} size={84} color={C.crema} />
        <Ch t={t} t0={650.4} t1={653.6} text="IN EUROPE" color={C.rojo} x={960} y={290} centro size={60} />
        <Ch t={t} t0={653.8} t1={658.2} text="THEY'VE DONE IT TO OTHERS · MANY TIMES" color={C.violeta} x={960} y={150} centro size={54} />
        {/* B · corte: vos solo en la oscuridad; ellos ya te están mirando */}
        {t >= 658.35 && (() => {
          const bx = interpolate(t, [660.4, 664.8], [360, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const anda = t > 660.4 && t < 664.8;
          const OJOS: [number, number, number][] = [[880, 600, 658.5], [1220, 690, 658.7], [1560, 560, 658.9], [1760, 720, 659.1], [700, 520, 659.3], [1380, 780, 659.5], [1040, 520, 659.7]];
          const salen = prog(t, 665.0, 666.0);
          return <>
            <AbsoluteFill style={{ background: "radial-gradient(circle at 25% 75%, #2a2470, #0a0820 70%)" }} />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              <circle cx={220} cy={170} r={95} fill="#fff4d6" opacity={0.12} /><circle cx={220} cy={170} r={62} fill="#fff4d6" />
              <path d="M 0 900 Q 960 860 1920 900 L 1920 1080 L 0 1080 Z" fill="#14243a" />
              {/* la flecha de lo que vas a hacer… y la X donde te esperan */}
              {t > 660.5 && <path d="M 560 960 Q 900 880 1240 960" stroke={C.rojo} strokeWidth={14} fill="none" strokeDasharray="34 22" opacity={0.95} pathLength={1} style={{ strokeDasharray: `${prog(t, 660.5, 661.8)} 1` }} />}
              {t > 662.0 && <g transform={`translate(1300 960) scale(${ent(t, 662.0)})`}><path d="M -40 -30 L 40 30 M 40 -30 L -40 30" stroke={C.rojo} strokeWidth={18} strokeLinecap="round" /></g>}
              {OJOS.map(([x, y, t0], k) => { const ab = t > t0 ? (Math.floor((t + k) * 1.3) % 4 === 0 && ((t + k) * 1.3) % 1 < 0.2 ? 0.15 : 1) : 0; const op = (t > t0 ? ent(t, t0) : 0) * (1 - salen); return <g key={k} opacity={op}><ellipse cx={x - 20} cy={y} rx={11} ry={11 * ab} fill="#ffe28a" /><ellipse cx={x + 20} cy={y} rx={11} ry={11 * ab} fill="#ffe28a" /></g>; })}
            </svg>
            {/* los dueños de los ojos salen de la oscuridad */}
            {t > 665.0 && [[900, 0], [1180, 1], [1460, 2], [1720, 3]].map(([x, k]) => <Persona key={k} x={x} y={990} h={400} t={t} seed={695 + k} ropa={VIK(k)} casco="vikingo" barba={barbaDe(k)} expr="feliz" sombra="#05041a" opacity={salen} flip bD={40 + k * 10} cD={30} manoD={<LanzaMano a={60} inclina={-30} largo={340} />} />)}
            {t > 665.0 && [[900, 0], [1180, 1], [1460, 2], [1720, 3]].map(([x, k]) => <svg key={"o" + k} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080} opacity={salen}><circle cx={x - 14} cy={990 - 400 * 0.81} r={7} fill="#ffe28a" /><circle cx={x + 14} cy={990 - 400 * 0.81} r={7} fill="#ffe28a" /></svg>)}
            <Persona x={bx} y={990} h={480} t={t} seed={3} ropa={SAJON} expr={t > 665.0 ? "sorpresa" : "miedo"} inclina={anda ? 14 : 6} mira={t > 665.0 ? 0.9 : Math.sin(t * 2.2) * 0.9} camina={anda ? 0.6 : 0} salta={665.1} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />
            <Emote t={t} t0={659.0} t1={665.0} tipo="sudor" x={bx} y={990 - 480 * 0.8} s={0.9} />
            <Emote t={t} t0={665.1} tipo="susto" x={bx} y={990 - 480 * 0.8} s={0.9} />
          </>;
        })()}
        <Ch t={t} t0={658.4} t1={665.0} text="THEY KNOW WHERE YOU COME FROM" color={C.teal} tinta={C.noche} x={1150} y={160} centro size={48} />
        <Ch t={t} t0={660.5} t1={665.0} text="HOW YOU MOVE" color={C.ambar} tinta={C.noche} x={1150} y={250} centro size={48} />
        <Ch t={t} t0={662.0} t1={665.0} text="WHAT MISTAKE YOU'RE ABOUT TO MAKE" color={C.rojo} x={1150} y={340} centro size={48} />
        <Flash t={t} t0={658.35} dur={0.2} color="#000" />
        <G t={t} t0={665.1} text="YOU BROUGHT A SURPRISE" x={1150} y={180} size={78} color={C.ambar} />
        <G t={t} t0={665.6} text="TO ITS INVENTORS" x={1150} y={300} size={78} color={C.crema} />
      </Escena>
    </AbsoluteFill>
  );
};

// nieve fina sobre el mapa de enero
const Nieve2: React.FC<{ t: number }> = ({ t }) => (
  <>{Array.from({ length: 50 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 397) % 1920 + Math.sin(t + i) * 20, top: ((i * 211 + t * 60) % 1080), width: 8, height: 8, borderRadius: 4, background: "#fff", opacity: 0.6 }} />)}</>
);

void Rayos; void Cuenta; void Llamas; void Tienda;
