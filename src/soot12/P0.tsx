import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { Persona, CIVIL } from "./persona";
import { C, ent, prog, Escena, Rayos, Particulas, Emote, cabeza, Pergamino, Zzz, Cielo, Astro, Colinas } from "./kit";
import { Mundo, camEn, Key, PastoAlto, SAJON, SENOR, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Ruta, Globo, Cuenta, Sello, Flash, LanzaMano, Tendido } from "./comun";
import { Corona, Drakkar } from "./vik";
import { Portada } from "./Portada";

// 0-51,6 s · EL GANCHO. Todo pasa en el mismo mundo (la noche del Trent): la proa del dragón contra la luna,
// vos tirado en el pasto, la cámara que se aleja y descubre 2.000 vikingos durmiendo, tu señor que susurra,
// el ojo que se abre, el rey misterioso, el plan perfecto, y el recorrido de las 7 trampas dibujado sobre el mundo.
export const CAM0: Key[] = [
  [0, 8040, 682, 3.8], [1.6, 8020, 676, 4.4],
  [1.601, 1500, 470, 2.0], [6.29, 1460, 480, 2.4],
  [6.3, 1560, 500, 1.7], [7.4, 2600, 420, 0.75], [9.9, 5400, 120, 0.32], [10.25, 5400, 120, 0.31],
  [10.26, 1400, 470, 2.1], [14.66, 1420, 470, 2.5],
  [28.7, 2050, 560, 1.25], [31.26, 2700, 690, 1.35],
  [36.66, 4150, 740, 1.15], [38.0, 4250, 770, 1.55], [39.0, 4330, 780, 2.3],
  [39.01, 1480, 470, 2.2], [40.94, 1500, 430, 2.7], [41.25, 1500, 430, 2.7], [42.5, 5575, -260, 0.17], [49.14, 5575, -260, 0.168], [50.7, 5575, -260, 0.172], [51.56, 1300, 450, 0.9],
];
export const camYo = { x: 1480, y: 0 };

type YoP = { t: number; expr?: "miedo" | "feliz" | "sorpresa" | "enojado" | "orgullo" | "neutro"; sube?: number; aparece?: number; tendido?: boolean; lanza?: number; dosManos?: boolean;
  cod?: number; trago?: number; pasa?: number; senala?: number };
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
// lanza suelta (mismo dibujo que la del Tendido) en coords de mundo: (x, y) = mentón de quien la tiene, S = h/560
const LanzaSuelta: React.FC<{ x: number; y: number; S: number; rot?: number }> = ({ x, y, S, rot = -3 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
    <g transform={`translate(${x} ${y}) scale(${S}) translate(-60 -14) rotate(${rot})`}>
      <rect x={-120} y={-7} width={620} height={14} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} />
      <path d="M -190 0 L -116 -18 L -90 0 L -116 18 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} />
    </g>
  </svg>
);
const YoHill: React.FC<YoP> = ({ t, expr = "miedo", sube = 0, aparece, tendido, lanza = 1, dosManos, cod = 0, trago = 0, pasa, senala = 0 }) => {
  const y = gy(1480) + 40 - sube;
  if (tendido) {
    // boca abajo en el pasto mojado: sólo asoman las cabezas; tu señor (al lado) te da un codazo y te pasa la lanza nueva
    const bx = 1330 + cod * 50, cx = 1500 + cod * 14;
    const yc = gy(1500) + 18 + trago;
    return (
      <>
        {Array.from({ length: 12 }, (_, i) => <Tendido key={i} x={1180 - i * 85} y={gy(1180 - i * 85) + 4 - (i % 2) * 10} h={250 - (i % 3) * 22} t={t} seed={20 + i} ropa={CIVIL(i)} expr="miedo" mira={0.4} resp={2 + (i % 4) * 0.2} />)}
        <Tendido x={bx} y={gy(1330) + 6} h={340} t={t} seed={9} ropa={SENOR} barba="#3a2418" expr={(t > 10.2 && t < 14.7) || cod > 0.2 ? "feliz" : "neutro"} mira={0.9} habla={(t > 10.5 && t < 14.4) || (t > 2.8 && t < 3.6)} resp={1.9} />
        <Tendido x={cx} y={yc} h={330} t={t} seed={3} ropa={SAJON} expr={expr} mira={cod > 0.3 ? -0.9 : -0.3} lanza={lanza >= 1 && (pasa === undefined || pasa >= 1) ? 1 : undefined} resp={2.8} />
        {pasa !== undefined && pasa > 0 && pasa < 1 && <LanzaSuelta x={1330 + (cx - 1330) * pasa} y={gy(1330) + 6 + (yc - gy(1330) - 6) * pasa - Math.sin(pasa * Math.PI) * 40} S={330 / 560} rot={-3 - Math.sin(pasa * Math.PI) * 6} />}
      </>
    );
  }
  return (
    <>
      <Persona x={1480} y={y} h={330} t={t} seed={3} ropa={SAJON} expr={expr} bD={dosManos ? 70 : 30} cD={dosManos ? 70 : 20} bI={dosManos ? 40 : undefined} cI={dosManos ? 80 : undefined} mira={senala > 0.5 ? 0.6 : -0.3} aparece={aparece} manoD={<LanzaMano a={dosManos ? 10 : 50} inclina={-14} />} />
      <Persona x={1290} y={gy(1290) + 36} h={360} t={t} seed={9} ropa={SENOR} barba="#3a2418" expr={t > 10.2 && t < 14.7 ? "feliz" : "neutro"} inclina={t > 10.2 && t < 14.7 ? 12 : 0} habla={(t > 10.6 && t < 14.4) || (senala > 0 && senala < 1)} mira={0.8} bD={senala > 0 ? 8 + 82 * senala : undefined} cD={senala > 0 ? 10 * (1 - senala) : undefined} />
      {/* los 200 hombres: cabezas oscuras entre el pasto */}
      {Array.from({ length: 16 }, (_, i) => <Persona key={i} x={1180 - i * 70} y={gy(1180 - i * 70) + 60} h={240 - (i % 3) * 20} t={t} seed={20 + i} ropa={CIVIL(i)} sombra="#101a2e" />)}
    </>
  );
};

const GUI = [10, -434]; // guiño: ojo relativo a la cabeza asomada
export const P0: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM0);
  const L = (x: number, y: number, h: number) => cabeza(x, y, h);
  const pasto = <PastoAlto x0={600} x1={2000} t={t} dy={14} alto={170} />;
  return (
    <AbsoluteFill>
      {/* 0 · 3 de la mañana: la proa del dragón recortada contra la luna */}
      {t < 1.7 && (
      <AbsoluteFill>
        <Portada t={t} />
        <G t={t} t0={0.12} text="3:00 AM" x={470} y={190} size={170} color={C.ambar} />
        <Ch t={t} t0={0.75} text="THE RIVER TRENT · 873" color={C.violeta} x={120} y={960} size={50} />
      </AbsoluteFill>
      )}
      {/* 1 · vos, boca abajo en el pasto mojado: tu señor te da un codazo y te pasa la lanza de ayer; tragás saliva */}
      {(() => {
        const cod = interpolate(t, [2.9, 3.05, 3.4], [0, 1, 0], CL);
        const pasa = prog(t, 4.3, 4.85);
        const trago = Math.sin(prog(t, 5.0, 5.4) * Math.PI) * 9;
        return (
          <Escena t={t} t0={1.6} t1={6.3} zoom={0} entra="barrido" golpes={[4.9]}>
            <Mundo t={t} cam={cam} yo={<>{<YoHill t={t} tendido cod={cod} pasa={pasa} trago={trago} expr={t > 2.95 && t < 3.7 ? "sorpresa" : "miedo"} />}{pasto}{Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1100 + i * 31, top: gy(1100 + i * 31) - 30 - (i * 37) % 60, width: 5, height: 8, borderRadius: 4, background: "#bfe6ff", opacity: 0.55 + 0.4 * Math.sin(t * 3 + i) }} />)}</>} />
            <Particulas t={t} tipo="luciernagas" n={18} seed={4} />
            <Emote t={t} t0={3.0} t1={3.8} tipo="excl" x={1010} y={650} s={0.9} />
            <Emote t={t} t0={5.0} tipo="sudor" x={1060} y={780} s={1.1} />
            <Ch t={t} t0={2.0} text="FACE DOWN · WET GRASS" color={C.teal} tinta={C.noche} x={120} y={190} size={50} />
            <Ch t={t} t0={2.3} text="← YOU" color={C.rojo} x={1230} y={760} size={76} />
            <Sello t={t} t0={4.9} text="NEW SPEAR" x={1300} y={430} size={70} color={C.ambar} rot={-8} />
            <Ch t={t} t0={5.3} text="HANDED YESTERDAY" color={C.violeta} x={1300} y={560} centro size={46} />
          </Escena>
        );
      })()}
      {/* 2 · tu señor señala el campamento y la cámara se aleja: 2.000 vikingos dormidos junto al río */}
      <Escena t={t} t0={6.3} t1={10.26} zoom={0} entra="zoom">
        <Mundo t={t} cam={cam} yo={<>{<YoHill t={t} senala={prog(t, 6.35, 6.75)} expr={t > 6.8 ? "sorpresa" : "miedo"} />}{pasto}{[4560, 4840, 5380, 5480, 5720, 6140, 6260, 6800].map((x, i) => <Zzz key={i} x={x} y={700 - (i % 2) * 40} t={t + i * 0.3} />)}</>} />
        <Cuenta t={t} t0={7.4} de={0} a={2000} dur={1.6} x={460} y={220} size={220} color={C.crema} />
        <Ch t={t} t0={7.45} text="VIKINGS" color={C.rojo} x={460} y={380} centro size={70} />
        <Sello t={t} t0={9.3} text="ASLEEP" x={1500} y={360} size={80} color={C.teal} rot={8} />
      </Escena>
      {/* 3 · tu señor se inclina y susurra; vos tragás saliva */}
      <Escena t={t} t0={10.26} t1={14.66} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} yo={<>{<YoHill t={t} tendido trago={Math.sin(prog(t, 12.1, 12.5) * Math.PI) * 10} expr={t > 12.05 ? "miedo" : "sorpresa"} />}{pasto}</>} />
        <Globo t={t} t0={10.4} t1={11.9} x={650} y={560} text="psst..." size={70} cola="der" />
        <Globo t={t} t0={12.0} x={1240} y={540} text="EASIEST NIGHT OF YOUR LIFE!" size={56} cola="izq" color={C.ambar} />
        <Emote t={t} t0={12.1} tipo="sudor" x={1090} y={790} s={1.2} />
        {t > 12.9 && <Particulas t={t} tipo="destellos" n={16} seed={9} />}
      </Escena>
      {/* 4 · «Está equivocado»: un ojo vikingo se abre en la oscuridad (golpe de zoom, sin flash) */}
      <Escena t={t} t0={14.66} t1={15.82} zoom={0.12} entra="corte" fondo="#12081e">
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #3a1430, #0a0414 75%)" }} />
        <AbsoluteFill style={{ transformOrigin: "960px 540px", transform: `scale(${1 + 0.15 * prog(t, 15.05, 15.05 + 4 / 30)})` }}>
          <Persona x={960} y={3140} h={3000} t={t} seed={204} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} expr={t < 15.05 ? "dormido" : "enojado"} mira={-0.6} />
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 250, background: "linear-gradient(180deg, #0a0414 80%, rgba(10,4,20,0))" }} />
        <G t={t} t0={15.05} text="HE IS WRONG." y={95} size={110} color={C.rojo} borde="#12081e" />
      </Escena>
      {/* 5 · el rey más listo de Inglaterra (silueta): llega, piensa con la mano en el mentón, se cruza de brazos y niega */}
      <Escena t={t} t0={15.82} t1={22.94} zoom={0} entra="iris" ix={960} iy={540} golpes={[20.6, 21.6]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #ffcf5a, #c96a1e 45%, #3a1440 100%)" }} />
        <Rayos t={t} x={960} y={620} color="#fff3c4" op={0.18} />
        {(() => {
          const hk = interpolate(t, [15.82, 17.6], [700, 880], { ...CL, easing: (u: number) => 1 - (1 - u) ** 3 });
          const niega = t > 21.6 && t < 22.7 ? Math.sin((t - 21.6) * 15) * 11 : 0;
          const piensa = t > 17.6 && t < 20.55;
          const cruza = t >= 20.55;
          const yk = 1380;
          return (<>
            <Persona x={960} y={yk} h={hk} t={t} seed={60} ropa={SENOR} sombra="#2a1230" camina={t < 17.6 ? 1.3 : 0} ladea={niega + (piensa ? 6 : 0)}
              bD={cruza ? 42 : piensa ? 22 : 8} cD={cruza ? -105 : piensa ? -150 : 10} bI={cruza ? 42 : 8} cI={cruza ? -105 : 10} />
            <Corona x={960 + niega * 2.2} y={interpolate(ent(t, 16.6), [0, 1], [-200, yk - hk * 1.09])} s={1.3 * hk / 900} t={t} />
          </>);
        })()}
        <G t={t} t0={17.3} t1={20.4} text="?" x={1430} y={560} size={240} color={C.crema} />
        <Ch t={t} t0={17.3} text="THE SMARTEST KING" color={C.violeta} x={960} y={110} centro size={66} />
        <Ch t={t} t0={18.4} text="VIKING AGE ENGLAND" color={C.teal} tinta={C.noche} x={960} y={240} centro size={44} />
        <Sello t={t} t0={20.6} text="NEVER TRIED THIS" x={430} y={820} size={58} color="#5a0a24" rot={-8} />
        <Sello t={t} t0={21.6} text="NOT ONCE" x={1480} y={700} size={68} color="#2a0a30" rot={8} />
      </Escena>
      {/* 6 · en el papel, el plan es perfecto: tu señor asoma y guiña */}
      <Escena t={t} t0={22.94} t1={25.5} entra="sube" golpes={[24.3]}>
        <Mundo t={t} cam={{ x: 1420, y: 430, z: 1.9 }} yo={<>{<YoHill t={t} tendido expr="feliz" />}{pasto}</>} />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 42% 55%, rgba(255,190,90,.22), rgba(5,3,20,.45) 70%)" }} />
        <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 560px", transform: "translate(-330px, -10px) scale(0.78)" }}>
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
        {t > 23.4 && (() => {
          // la mano del señor que recorre la flecha que se está dibujando (entra desde abajo, no tapa caras)
          const i = t < 23.9 ? 0 : t < 24.08 ? 1 : 2;
          const A = [[600, 760, 1180, 470], [640, 820, 1240, 620], [700, 700, 1300, 520]][i];
          const u = prog(t, 23.45 + i * 0.18, 23.9 + i * 0.18);
          const sale = prog(t, 24.4, 24.8);
          const fx = A[0] + (A[2] - A[0]) * u, fy = A[1] + (A[3] - A[1]) * u + sale * 700;
          return <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
            <path d={`M ${fx + 60} ${fy + 900} L ${fx + 30} ${fy + 50}`} stroke="#22386e" strokeWidth={70} strokeLinecap="round" />
            <circle cx={fx + 28} cy={fy + 44} r={40} fill="#e8a880" stroke="#2a1530" strokeWidth={6} />
            <path d={`M ${fx + 22} ${fy + 30} L ${fx} ${fy}`} stroke="#e8a880" strokeWidth={22} strokeLinecap="round" />
          </svg>;
        })()}
        </div>
        {(() => {
          // tu señor asoma por la derecha, guiña
          const up = ent(t, 24.35, 0, { damping: 10, stiffness: 160 });
          const guino = t > 24.75 && t < 25.25;
          const hy = 1640 - up * 470;
          return (<>
            <Persona soloCabeza x={1560} y={hy} h={560} t={t} seed={9} ropa={SENOR} barba="#3a2418" expr="feliz" mira={-0.6} inclina={-8} />
            {guino && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}><circle cx={1560 + GUI[0]} cy={hy + GUI[1]} r={34} fill="#e8a880" /><path d={`M ${1560 + GUI[0] - 26} ${hy + GUI[1]} Q ${1560 + GUI[0]} ${hy + GUI[1] + 18} ${1560 + GUI[0] + 26} ${hy + GUI[1]}`} stroke="#2a1530" strokeWidth={9} fill="none" strokeLinecap="round" /></svg>}
          </>);
        })()}
        <Emote t={t} t0={24.8} tipo="brillos" x={1500} y={900} s={1.1} />
        <Sello t={t} t0={24.3} text="PERFECT" x={1500} y={330} size={96} color={C.lima} rot={-10} />
      </Escena>
      {/* 7 · ellos duermen / vos estás despierto, temblando · lejos de casa */}
      <Escena t={t} t0={25.5} t1={28.72} entra="diag">
        <AbsoluteFill style={{ background: "#16123d" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, bottom: 0, background: "radial-gradient(circle at 50% 70%, #3a2a7a, #120e36)", overflow: "hidden" }}>
          {(() => {
            const ronca = Math.sin(t * 2.6);
            return <div style={{ position: "absolute", inset: 0, transformOrigin: "480px 1240px", transform: `scaleY(${1 + ronca * 0.012}) scaleX(${1 + ronca * 0.008})` }}>
              <Persona x={480} y={1240} h={860} t={t} seed={205} ropa={VIK(5)} casco="vikingo" barba={barbaDe(5)} expr="dormido" ladea={-8 + ronca * 4} habla={ronca > 0.3} />
            </div>;
          })()}
          {[0, 0.7, 1.4].map((d) => <Zzz key={d} x={640 + d * 60} y={380 - d * 60} t={t + d} />)}
        </div>
        <div style={{ position: "absolute", left: 960, top: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 50% 70%, #2f5e3a, #10231a)", overflow: "hidden" }}>
          {(() => {
            const atras = t > 26.9 && t < 27.9;
            return <>
              <Persona x={480 + Math.sin(t * 75) * 4} y={1240 + Math.cos(t * 75) * 2} h={860} t={t} seed={3} ropa={SAJON} expr="miedo" mira={atras ? 0.9 : -0.4} flip={atras} bD={40} cD={120} bI={40} cI={120} />
              <Emote t={t} t0={26.6} tipo="sudor" {...L(480, 1240, 860)} s={1.6} />
              {atras && <Emote t={t} t0={26.9} tipo="excl" x={300} y={560} s={1} />}
            </>;
          })()}
        </div>
        <div style={{ position: "absolute", left: 952, top: 0, width: 16, bottom: 0, background: "#fff" }} />
        <Ch t={t} t0={25.6} text="ASLEEP" color={C.violeta} x={480} y={140} centro size={66} />
        <Ch t={t} t0={26.4} text="AWAKE" color={C.lima} tinta={C.noche} x={1440} y={140} centro size={66} />
        <Ch t={t} t0={27.4} text="FAR FROM HOME" color={C.rojo} x={1440} y={250} centro size={50} />
      </Escena>
      {/* 8 · vos conocés cada árbol y cada zanja: te arrastrás de verdad por la loma */}
      <Escena t={t} t0={28.72} t1={31.26} zoom={0} entra="barrido">
        {(() => {
          const u = prog(t, 28.8, 31.2);
          const sx = 560 + 560 * u;
          const bx = cam.x + (sx - 960) / cam.z + Math.sin(t * 11) * 6;
          return <Mundo t={t} cam={cam} yo={<>
            <Tendido x={bx} y={gy(bx) + 14 - Math.abs(Math.sin(t * 11)) * 6} h={330} t={t} seed={3} ropa={SAJON} expr={t > 30.1 ? "enojado" : "miedo"} mira={-0.6} lanza={1} resp={3.4} />
            {Array.from({ length: 8 }, (_, i) => { const k = ((t * 1.6 + i / 8) % 1); const px = bx + 520 * 330 / 560 + i * 8; return <div key={i} style={{ position: "absolute", left: px + k * 60, top: gy(px) - 10 - k * 50 + k * k * 60, width: 10, height: 16, borderRadius: 6, background: "#4a8a5a", opacity: 1 - k, transform: `rotate(${i * 50 + k * 200}deg)` }} />; })}
          </>} />;
        })()}
        {(() => {
          const salto = (a: number) => Math.sin(prog(t, a, a + 0.3) * Math.PI) * 26;
          return <>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${-salto(29.75)}px)` }}><Ch t={t} t0={29.0} text="✓ EVERY TREE" color={C.lima} tinta={C.noche} x={160} y={190} size={66} /></div>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${-salto(30.75)}px)` }}><Ch t={t} t0={30.2} text="✓ EVERY DITCH" color={C.lima} tinta={C.noche} x={160} y={310} size={66} /></div>
          </>;
        })()}
      </Escena>
      {/* 9 · la fantasía: atacar dormidos en la oscuridad, volver héroe antes del desayuno */}
      <Escena t={t} t0={31.26} t1={36.66} entra="iris" ix={960} iy={420} golpes={[33.4, 35.0]}>
        <Cielo tipo="noche" />
        <AbsoluteFill style={{ opacity: prog(t, 35.46, 36.2) }}><Cielo tipo="atardecer" /></AbsoluteFill>
        <div style={{ opacity: 1 - prog(t, 35.46, 35.9) }}><Astro x={1700} y={170} r={70} luna /></div>
        {t > 35.46 && <Rayos t={t} x={960} y={interpolate(t, [35.46, 36.6], [900, 640], CL)} color="#fff3c4" op={0.16} />}
        {t > 35.46 && <Astro x={960} y={interpolate(t, [35.46, 36.6], [900, 640], CL)} r={130} />}
        <Colinas capas={["#c2558a", "#8a3a7a", "#5a2a6a"]} base={760} seed={5} alto={60} />
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
        <Persona x={1450} y={1050} h={600} t={t} seed={3} ropa={SAJON} expr={t > 34.8 ? "orgullo" : "enojado"} bD={t > 34.8 ? 150 : 60} cD={t > 34.8 ? 10 : 40} salta={34.9} manoD={<LanzaMano a={t > 34.8 ? 140 : 100} largo={300} />} />
        {t > 34.8 && <Particulas t={t} tipo="destellos" n={18} seed={2} />}
        <Ch t={t} t0={31.5} t1={35.3} text="ATTACK IN THE DARK" color={C.violeta} x={760} y={150} centro size={58} />
        <Ch t={t} t0={33.2} t1={34.9} text="KILL THEM IN THEIR BEDS" color={C.rojo} x={560} y={620} centro size={50} />
        <G t={t} t0={35.0} text="HERO" x={760} y={330} size={170} color={C.oro} />
        <Ch t={t} t0={35.5} text="BEFORE BREAKFAST" color={C.teal} tinta={C.noche} x={760} y={500} centro size={50} />
      </Escena>
      {/* 10 · suena fácil… hasta que te acercás: los perros levantan la cabeza y gruñen */}
      <Escena t={t} t0={36.66} t1={39.02} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} luna={[1720, 140, 72]} e={{ perros: t > 38.45 ? "ladra" : t > 37.9 ? "alerta" : "duerme" }} yo={(() => { const bx = 3930 + Math.min(t - 36.66, 1.4) * 140; return <Tendido x={bx} y={gy(bx) + 12} h={330} t={t} seed={3} ropa={SAJON} expr={t > 37.9 ? "miedo" : "neutro"} mira={0.6} lanza={1} resp={3} />; })()} />
        <AbsoluteFill style={{ background: `rgba(5,3,18,${interpolate(t, [37.6, 38.4], [0, 0.5], CL)})` }} />
        {t > 37.9 && [[760, 520], [1180, 470], [1500, 600]].map(([x, y], i) => (
          <svg key={i} style={{ position: "absolute", left: x - 60, top: y - 30, transform: `scale(${ent(t, 37.9 + i * 0.12)})` }} width={120} height={60}>
            {[30, 90].map((cx) => <g key={cx}><circle cx={cx} cy={30} r={24} fill="#ffe28a" opacity={0.25} /><ellipse cx={cx} cy={30} rx={13} ry={9} fill="#ffe28a" /><ellipse cx={cx} cy={30} rx={4} ry={8} fill="#1d1430" /></g>)}
          </svg>
        ))}
        {t > 38.45 && <div style={{ position: "absolute", left: 1380, top: 330, transform: `translate(-50%,-50%) scale(${ent(t, 38.45)}) rotate(${Math.sin(t * 30) * 4}deg)`, fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: C.rojo, WebkitTextStroke: "7px #12081e", paintOrder: "stroke fill" }}>GRRR…</div>}
        <Ch t={t} t0={36.8} t1={37.8} text="SOUNDS EASY" color={C.lima} tinta={C.noche} x={200} y={130} size={64} />
        <G t={t} t0={37.9} text="UNTIL YOU GET CLOSE" x={780} y={150} size={96} color={C.rojo} borde="#12081e" />
      </Escena>
      {/* 11 · esta noche entrás vos */}
      <Escena t={t} t0={39.02} t1={40.94} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} luna={[1790, 110, 56]} yo={<>{<YoHill t={t} expr="enojado" dosManos={t > 39.7} sube={interpolate(t, [39.3, 39.8], [0, 60], CL)} />}{pasto}</>} />
        <Ch t={t} t0={39.3} text="TONIGHT" color={C.rojo} x={1530} y={300} centro size={92} />
        <Ch t={t} t0={39.65} text="YOU'RE GOING IN" color={C.ambar} tinta={C.noche} x={1530} y={430} centro size={62} />
      </Escena>
      {/* 12 · el recorrido del ataque, de la loma al río: las 7 trampas, una por una, mientras caminás el camino */}
      <Escena t={t} t0={40.94} t1={51.56} zoom={0} entra="corte" golpes={[49.2]}>
        <Mundo t={t} cam={cam} luna={[1720, 130, 64]} yo={<>{<YoHill t={t} expr="enojado" sube={60} dosManos />}{pasto}</>} />
        {t > 42.3 && t < 50.8 && (() => {
          // camino en pantalla: 7 paradas parejas de x=200 a x=1720 sobre el campo de abajo
          const N = 7, X0 = 180, X1 = 1720;
          const px = (i: number) => X0 + ((X1 - X0) * i) / (N - 1);
          const py = (x: number) => 820 + Math.sin(x * 0.006) * 18;
          const T0 = 42.6, T1 = 48.4; // el chico camina de la 1 a la 7
          const w = interpolate(t, [T0, T1], [0, 1], CL);
          const cx = X0 - 40 + (X1 - X0 + 40) * w;
          const op = interpolate(t, [42.3, 42.6, 50.5, 50.8], [0, 1, 1, 0], CL);
          const pts = Array.from({ length: 61 }, (_, k) => { const x = X0 - 160 + (X1 - X0 + 260) * (k / 60); return `${k ? "L" : "M"} ${x} ${py(x)}`; }).join(" ");
          const NOM = ["THE PLACE", "THE DITCH", "THE DOGS", "THE SLEEPERS", "THE SHIPS", "THE EXPERTS", "THE MORNING AFTER"];
          return <AbsoluteFill style={{ opacity: op }}>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              <path d={pts} stroke="rgba(10,6,30,.55)" strokeWidth={26} fill="none" strokeLinecap="round" />
              <path d={pts} stroke="#fff" strokeWidth={10} fill="none" strokeDasharray="34 22" strokeDashoffset={-t * 60} opacity={0.35} strokeLinecap="round" />
              <path d={pts} stroke={C.ambar} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1000} strokeDasharray={`${Math.max(0, ((cx - (X0 - 160)) / (X1 - X0 + 260)) * 1000)} 2000`} />
            </svg>
            {NOM.map((nm, i) => {
              const x = px(i), y = py(x);
              const tp = T0 + ((x - (X0 - 40)) / (X1 - X0 + 40)) * (T1 - T0);
              const on = t >= tp;
              const e = on ? ent(t, tp, 0, { damping: 9, stiffness: 220 }) : 0;
              const fila = i % 2 === 0 ? 78 : 132;
              const ult = i === N - 1;
              return <React.Fragment key={i}>
                <div style={{ position: "absolute", left: x, top: y, width: 92, height: 92, transform: `translate(-50%,-50%) scale(${0.8 + 0.3 * e - (on ? 0.1 * Math.min(1, (t - tp) * 2) : 0)})`, borderRadius: 46, border: "8px solid #fff", boxSizing: "border-box", background: on ? (t >= 49.2 ? C.rojo : C.ambar) : "rgba(255,255,255,.18)", fontFamily: "Fredoka", fontWeight: 700, fontSize: 52, color: on ? C.noche : "rgba(255,255,255,.7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: on ? `0 0 ${30 * e}px ${C.ambar}` : undefined }}>{i + 1}</div>
                {on && <div style={{ position: "absolute", left: ult ? x + 46 : i === 0 ? x - 46 : x, top: y + fila, transform: `translate(${ult ? "-100%" : i === 0 ? "0%" : "-50%"},-50%) scale(${e})`, transformOrigin: ult ? "right center" : i === 0 ? "left center" : "center", fontFamily: "Fredoka", fontWeight: 700, fontSize: 38, color: "#fff", background: "rgba(27,18,64,.9)", padding: "4px 18px", borderRadius: 12, whiteSpace: "nowrap" }}>{nm}</div>}
              </React.Fragment>;
            })}
            <Persona x={cx} y={py(cx) - 6} h={250} t={t} seed={3} ropa={SAJON} expr="enojado" camina={t < T1 ? 1.8 : 0} manoD={<LanzaMano a={40} largo={420} />} salta={t > T1 ? T1 + 0.05 : undefined} />
          </AbsoluteFill>;
        })()}
        <Ch t={t} t0={41.4} t1={43.5} text="STEP BY STEP" color={C.violeta} x={960} y={150} centro size={64} />
        <Ch t={t} t0={43.6} t1={46.3} text="FROM THE HILL…" color={C.teal} tinta={C.noche} x={160} y={420} size={54} />
        <Ch t={t} t0={44.8} t1={46.3} text="…TO THE GATE" color={C.teal} tinta={C.noche} x={1180} y={420} size={54} />
        <Ch t={t} t0={46.6} t1={48.9} text="EVERY WAY IT KILLS YOU" color={C.rojo} x={860} y={300} centro size={64} />
        <G t={t} t0={49.2} t1={50.75} text="7 TRAPS" x={520} y={230} size={170} color={C.ambar} />
        <G t={t} t0={50.7} text="LET'S GO" y={900} size={130} color={C.crema} />
      </Escena>
    </AbsoluteFill>
  );
};
