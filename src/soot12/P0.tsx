import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { Persona, CIVIL } from "./persona";
import { C, ent, prog, Escena, Rayos, Particulas, Emote, cabeza, Pergamino, Zzz, Cielo, Astro, Colinas } from "./kit";
import { Mundo, camEn, Key, PastoAlto, SAJON, SENOR, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Ruta, Globo, Cuenta, Sello, Flash, LanzaMano } from "./comun";
import { Corona, Drakkar } from "./vik";

// 0-51,6 s · EL GANCHO. Todo pasa en el mismo mundo (la noche del Trent): la proa del dragón contra la luna,
// vos tirado en el pasto, la cámara que se aleja y descubre 2.000 vikingos durmiendo, tu señor que susurra,
// el ojo que se abre, el rey misterioso, el plan perfecto, y el recorrido de las 7 trampas dibujado sobre el mundo.
export const CAM0: Key[] = [
  [0, 8040, 682, 3.8], [1.6, 8020, 676, 4.4],
  [1.601, 1500, 470, 2.0], [6.29, 1460, 480, 2.4],
  [6.3, 1560, 500, 1.7], [7.4, 2600, 420, 0.75], [9.9, 5400, 120, 0.32], [10.25, 5400, 120, 0.31],
  [10.26, 1400, 470, 2.1], [14.66, 1420, 470, 2.5],
  [28.7, 2050, 560, 1.25], [31.26, 2700, 690, 1.35],
  [36.66, 4150, 740, 1.15], [38.0, 4300, 780, 1.6], [39.0, 4430, 790, 2.6],
  [39.01, 1480, 470, 2.2], [40.94, 1480, 470, 2.25], [43.4, 5575, -260, 0.19], [49.14, 5575, -260, 0.185], [50.7, 5575, -260, 0.195], [51.56, 1300, 450, 0.9],
];
export const camYo = { x: 1480, y: 0 };

const YoHill: React.FC<{ t: number; expr?: "miedo" | "feliz" | "sorpresa" | "enojado" | "orgullo" | "neutro"; sube?: number; aparece?: number }> = ({ t, expr = "miedo", sube = 0, aparece }) => {
  const y = gy(1480) + 40 - sube;
  return (
    <>
      <Persona x={1480} y={y} h={330} t={t} seed={3} ropa={SAJON} expr={expr} bD={30} cD={20} mira={-0.3} aparece={aparece} manoD={<LanzaMano a={50} inclina={-14} />} />
      <Persona x={1290} y={gy(1290) + 36} h={360} t={t} seed={9} ropa={SENOR} barba="#3a2418" expr={t > 10.2 && t < 14.7 ? "feliz" : "neutro"} inclina={t > 10.2 && t < 14.7 ? 12 : 0} habla={t > 10.6 && t < 14.4} mira={0.8} />
      {/* los 200 hombres: cabezas oscuras entre el pasto */}
      {Array.from({ length: 16 }, (_, i) => <Persona key={i} x={1180 - i * 70} y={gy(1180 - i * 70) + 60} h={240 - (i % 3) * 20} t={t} seed={20 + i} ropa={CIVIL(i)} sombra="#101a2e" />)}
    </>
  );
};

export const P0: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM0);
  const L = (x: number, y: number, h: number) => cabeza(x, y, h);
  const pasto = <PastoAlto x0={600} x1={2000} t={t} dy={14} alto={170} />;
  return (
    <AbsoluteFill>
      {/* 0 · 3 de la mañana: la proa del dragón recortada contra la luna */}
      <Escena t={t} t0={0} t1={1.6} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} luna={[1240, 430, 300]} />
        <G t={t} t0={0.12} text="3:00 AM" x={470} y={190} size={170} color={C.ambar} />
        <Ch t={t} t0={0.75} text="THE RIVER TRENT · 873" color={C.violeta} x={120} y={960} size={50} />
      </Escena>
      {/* 1 · vos, boca abajo en el pasto mojado, con una lanza de ayer */}
      <Escena t={t} t0={1.6} t1={6.3} zoom={0} entra="barrido" golpes={[4.9]}>
        <Mundo t={t} cam={cam} yo={<>{<YoHill t={t} />}{pasto}</>} />
        <Particulas t={t} tipo="luciernagas" n={18} seed={4} />
        <Ch t={t} t0={2.0} text="← YOU" color={C.rojo} x={1260} y={170} size={84} />
        <Ch t={t} t0={2.9} text="FACE DOWN · WET GRASS" color={C.teal} tinta={C.noche} x={1260} y={285} size={46} />
        <Sello t={t} t0={4.9} text="NEW SPEAR" x={1580} y={560} size={70} color={C.ambar} rot={10} />
        <Ch t={t} t0={5.3} text="HANDED YESTERDAY" color={C.violeta} x={1580} y={680} centro size={46} />
      </Escena>
      {/* 2 · la cámara se aleja: 2.000 vikingos dormidos junto al río */}
      <Escena t={t} t0={6.3} t1={10.26} zoom={0} entra="zoom">
        <Mundo t={t} cam={cam} yo={<>{<YoHill t={t} />}{pasto}{[4560, 4840, 5380, 5480, 5720, 6140, 6260, 6800].map((x, i) => <Zzz key={i} x={x} y={700 - (i % 2) * 40} t={t + i * 0.3} />)}</>} />
        <Cuenta t={t} t0={7.4} de={0} a={2000} dur={1.6} y={200} size={250} color={C.crema} />
        <Ch t={t} t0={8.2} text="VIKINGS" color={C.rojo} x={960} y={350} centro size={70} />
        <Sello t={t} t0={9.3} text="ASLEEP" x={1500} y={330} size={80} color={C.teal} rot={8} />
      </Escena>
      {/* 3 · tu señor se inclina y susurra */}
      <Escena t={t} t0={10.26} t1={14.66} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} yo={<>{<YoHill t={t} expr={t > 12.6 ? "feliz" : "sorpresa"} />}{pasto}</>} />
        <Globo t={t} t0={10.6} x={620} y={300} text="psst..." size={50} cola="der" />
        <Globo t={t} t0={12.0} x={760} y={430} text="EASIEST NIGHT OF YOUR LIFE!" size={58} cola="der" color={C.ambar} />
        {t > 12.9 && <Particulas t={t} tipo="destellos" n={16} seed={9} />}
      </Escena>
      {/* 4 · «Está equivocado»: un ojo vikingo se abre en la oscuridad */}
      <Escena t={t} t0={14.66} t1={15.82} zoom={0.12} entra="corte" fondo="#12081e">
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #3a1430, #0a0414 75%)" }} />
        <Persona x={960} y={2950} h={3000} t={t} seed={204} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} expr={t < 15.05 ? "dormido" : "enojado"} mira={-0.6} />
        <G t={t} t0={15.05} text="HE IS WRONG." y={930} size={150} color={C.rojo} borde="#12081e" />
        <Flash t={t} t0={15.05} dur={0.18} color="#ff4a5a" />
      </Escena>
      {/* 5 · el rey más listo de Inglaterra (silueta: se revela al final) */}
      <Escena t={t} t0={15.82} t1={22.94} entra="iris" ix={960} iy={540} golpes={[20.6, 21.6]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #ffcf5a, #c96a1e 45%, #3a1440 100%)" }} />
        <Rayos t={t} x={960} y={620} color="#fff3c4" op={0.18} />
        <Persona x={960} y={1180} h={900} t={t} seed={60} ropa={SENOR} sombra="#2a1230" />
        <Corona x={960} y={interpolate(ent(t, 16.6), [0, 1], [-200, 300])} s={1.3} t={t} />
        <G t={t} t0={17.0} t1={20.4} text="?" x={1250} y={560} size={260} color={C.crema} />
        <Ch t={t} t0={17.3} text="THE SMARTEST KING" color={C.violeta} x={960} y={110} centro size={70} />
        <Ch t={t} t0={18.4} text="VIKING AGE ENGLAND" color={C.teal} tinta={C.noche} x={960} y={210} centro size={46} />
        <Sello t={t} t0={20.6} text="NEVER TRIED THIS" x={960} y={720} size={96} />
        <Sello t={t} t0={21.6} text="NOT ONCE" x={1460} y={920} size={70} color={C.crema} rot={8} />
      </Escena>
      {/* 6 · en el papel, el plan es perfecto */}
      <Escena t={t} t0={22.94} t1={25.5} entra="sube" golpes={[24.3]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2d1b69, #5b2bb5)" }} />
        <Pergamino x={960} y={560} w={980} abre={prog(t, 23.0, 23.5)} lineas={0} titulo="THE PLAN" />
        {t > 23.4 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            {[[600, 760, 1180, 470], [640, 820, 1240, 620], [700, 700, 1300, 520]].map(([x1, y1, x2, y2], i) => {
              const u = prog(t, 23.45 + i * 0.18, 23.9 + i * 0.18);
              return <g key={i}><line x1={x1} y1={y1} x2={x1 + (x2 - x1) * u} y2={y1 + (y2 - y1) * u} stroke={C.rojo} strokeWidth={14} strokeLinecap="round" strokeDasharray="30 18" />
                {u >= 1 && <path d={`M ${x2} ${y2} l -40 6 l 18 -36 Z`} fill={C.rojo} />}</g>;
            })}
            {[[1250, 520], [1330, 600], [1200, 640]].map(([x, y], i) => <path key={i} d={`M ${x - 40} ${y + 30} L ${x} ${y - 30} L ${x + 40} ${y + 30} Z`} fill="#8a5a32" opacity={prog(t, 23.3 + i * 0.1, 23.5 + i * 0.1)} />)}
          </svg>
        )}
        <Sello t={t} t0={24.3} text="PERFECT" x={1380} y={840} size={100} color={C.lima} rot={-10} />
      </Escena>
      {/* 7 · ellos duermen / vos estás despierto · lejos de casa */}
      <Escena t={t} t0={25.5} t1={28.72} entra="diag">
        <AbsoluteFill style={{ background: "#16123d" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, bottom: 0, background: "radial-gradient(circle at 50% 70%, #3a2a7a, #120e36)", overflow: "hidden" }}>
          <Persona x={480} y={1180} h={950} t={t} seed={205} ropa={VIK(5)} casco="vikingo" barba={barbaDe(5)} expr="dormido" ladea={-8} />
          <Zzz x={600} y={250} t={t} />
        </div>
        <div style={{ position: "absolute", left: 960, top: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 50% 70%, #2f5e3a, #10231a)", overflow: "hidden", transform: `translateY(${(1 - ent(t, 26.2)) * 1100}px)` }}>
          <Persona x={480} y={1180} h={950} t={t} seed={3} ropa={SAJON} expr="miedo" mira={-0.4} />
          <Emote t={t} t0={26.6} tipo="sudor" {...L(480, 1180, 950)} s={1.8} />
        </div>
        <div style={{ position: "absolute", left: 952, top: 0, width: 16, bottom: 0, background: "#fff" }} />
        <Ch t={t} t0={25.6} text="ASLEEP" color={C.violeta} x={480} y={110} centro size={70} />
        <Ch t={t} t0={26.4} text="AWAKE" color={C.lima} tinta={C.noche} x={1440} y={110} centro size={70} />
        <Ch t={t} t0={27.4} text="FAR FROM HOME" color={C.rojo} x={480} y={960} centro size={58} />
      </Escena>
      {/* 8 · vos conocés cada árbol y cada zanja (paneo por la loma) */}
      <Escena t={t} t0={28.72} t1={31.26} zoom={0} entra="barrido">
        <Mundo t={t} cam={cam} />
        <Ch t={t} t0={29.0} text="✓ EVERY TREE" color={C.lima} tinta={C.noche} x={200} y={200} size={64} />
        <Ch t={t} t0={30.2} text="✓ EVERY DITCH" color={C.lima} tinta={C.noche} x={200} y={320} size={64} />
      </Escena>
      {/* 9 · la fantasía: atacar dormidos, volver héroe antes del desayuno */}
      <Escena t={t} t0={31.26} t1={36.66} entra="iris" ix={960} iy={420} golpes={[33.4, 35.0]}>
        <Cielo tipo="atardecer" />
        <Rayos t={t} x={960} y={interpolate(t, [31.3, 36.6], [900, 560])} color="#fff3c4" op={0.16} />
        <Astro x={960} y={interpolate(t, [31.3, 36.6], [900, 560])} r={130} />
        <Colinas capas={["#c2558a", "#8a3a7a", "#5a2a6a"]} base={760} seed={5} alto={60} />
        {/* vikingos dormidos que reciben el golpe */}
        {[0, 1, 2].map((i) => {
          const tg = 33.4 + i * 0.3;
          const hit = t > tg;
          return (
            <React.Fragment key={i}>
              <Persona x={300 + i * 260} y={1010} h={300} t={t} seed={210 + i} ropa={VIK(i)} barba={barbaDe(i)} expr={hit ? "sorpresa" : "dormido"} inclina={hit ? -70 : -88} opacity={hit ? Math.max(0, 1 - (t - tg) * 0.6) : 1} />
              {hit && t < tg + 0.8 && <div style={{ position: "absolute", left: 300 + i * 260, top: 800, transform: `translate(-50%,-50%) scale(${ent(t, tg)})`, fontFamily: "Fredoka", fontWeight: 700, fontSize: 64, color: C.ambar, WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill" }}>BONK!</div>}
            </React.Fragment>
          );
        })}
        <Persona x={1450} y={1060} h={720} t={t} seed={3} ropa={SAJON} expr={t > 34.8 ? "orgullo" : "enojado"} bD={t > 34.8 ? 170 : 60} cD={t > 34.8 ? 10 : 40} salta={34.9} manoD={<LanzaMano a={t > 34.8 ? 180 : 100} />} />
        {t > 34.8 && <Particulas t={t} tipo="destellos" n={18} seed={2} />}
        <Ch t={t} t0={31.5} text="ATTACK IN THE DARK" color={C.violeta} x={960} y={110} centro size={58} />
        <Ch t={t} t0={33.2} text="KILL THEM IN THEIR BEDS" color={C.rojo} x={560} y={620} centro size={50} />
        <G t={t} t0={35.0} text="HERO" x={1450} y={240} size={170} color={C.oro} />
        <Ch t={t} t0={35.7} text="BEFORE BREAKFAST" color={C.teal} tinta={C.noche} x={1450} y={380} centro size={50} />
      </Escena>
      {/* 10 · suena fácil… hasta que te acercás: ojos que brillan en la oscuridad */}
      <Escena t={t} t0={36.66} t1={39.02} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} e={{ perros: t > 37.9 ? "alerta" : "duerme" }} />
        <AbsoluteFill style={{ background: `rgba(5,3,18,${interpolate(t, [37.6, 38.4], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }} />
        {t > 37.9 && [[760, 520], [1180, 470], [1500, 600]].map(([x, y], i) => (
          <svg key={i} style={{ position: "absolute", left: x - 60, top: y - 30, transform: `scale(${ent(t, 37.9 + i * 0.12)})` }} width={120} height={60}>
            {[30, 90].map((cx) => <g key={cx}><circle cx={cx} cy={30} r={24} fill="#ffe28a" opacity={0.25} /><ellipse cx={cx} cy={30} rx={13} ry={9} fill="#ffe28a" /><ellipse cx={cx} cy={30} rx={4} ry={8} fill="#1d1430" /></g>)}
          </svg>
        ))}
        <Ch t={t} t0={36.8} text="SOUNDS EASY" color={C.lima} tinta={C.noche} x={960} y={160} centro size={64} />
        <G t={t} t0={37.9} text="UNTIL YOU GET CLOSE" y={900} size={110} color={C.rojo} borde="#12081e" />
      </Escena>
      {/* 11 · esta noche entrás vos */}
      <Escena t={t} t0={39.02} t1={40.94} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} yo={<>{<YoHill t={t} expr="enojado" sube={interpolate(t, [39.3, 39.8], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}{pasto}</>} />
        <Ch t={t} t0={39.3} text="TONIGHT" color={C.rojo} x={1010} y={230} size={80} />
        <Ch t={t} t0={39.9} text="YOU'RE GOING IN" color={C.ambar} tinta={C.noche} x={1010} y={350} size={58} />
      </Escena>
      {/* 12 · el recorrido del ataque, de la loma al río: las 7 trampas sobre el mundo */}
      <Escena t={t} t0={40.94} t1={51.56} zoom={0} entra="corte" golpes={[49.2]}>
        <Mundo t={t} cam={cam} yo={<>{<YoHill t={t} expr="enojado" sube={60} />}{pasto}{t < 50.75 && <Ruta t={t} t0={42.6} dur={5.4} escala={3.7} />}</>} />
        <Ch t={t} t0={41.4} text="STEP BY STEP" color={C.violeta} x={960} y={110} centro size={60} />
        <Ch t={t} t0={43.6} text="FROM THE HILL…" color={C.teal} tinta={C.noche} x={260} y={980} size={50} />
        <Ch t={t} t0={44.8} text="…TO THE GATE" color={C.teal} tinta={C.noche} x={1240} y={980} size={50} />
        <Ch t={t} t0={46.6} t1={49.0} text="EVERY WAY IT KILLS YOU" color={C.rojo} x={960} y={220} centro size={64} />
        <G t={t} t0={49.2} text="7" y={240} size={300} color={C.ambar} />
        <Ch t={t} t0={49.6} text="TRAPS" color={C.rojo} x={960} y={420} centro size={74} />
        <G t={t} t0={50.7} text="LET'S GO" y={920} size={130} color={C.crema} />
      </Escena>
    </AbsoluteFill>
  );
};
