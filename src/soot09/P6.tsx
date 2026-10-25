import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza, Pergamino } from "./kit";
import { Trampas, Lluvia } from "./kit2";
import { Mundo, K, En, SUELO, AGUA, kx } from "./mundo";
import { Base, FX } from "./base";
import { GENT, COLONO, SMITH, Poste, Nave, Bote, Rata, Bicho, Cofre, Barril, Explosion, Rayo, Canasta, Tablero, Nieve } from "./kitj";
import { Lupa, Tacha } from "./kitj2";

// TRAMPA 6 · EL RESCATE (550,6-649,7 s). La flota más grande (9 barcos), el huracán, la Sea Venture achicando agua,
// tirando todo y cortando el palo mayor, Somers 3 días al timón, el arrecife de Bermudas; el resto llega a Jamestown
// sin líderes, con ratas; Smith y la pólvora; se va y nunca vuelve.
export const CAM6: K[] = [
  [550.7, 24600, 600, 0.36], [551.7, 12600, 640, 0.85], [552.8, 12600, 640, 0.85], [553.7, 3300, 620, 0.85], [556.5, 3300, 620, 0.9],
  [557.6, 7100, 600, 0.4], [561.6, 7100, 600, 0.42], [562.4, 5900, 640, 0.95], [568.8, 6050, 640, 0.95], [569.6, 6500, 600, 0.6],
  [571.4, 10700, 600, 0.45], [574.9, 11500, 600, 0.5], [578.0, 11700, 640, 0.6], [583.1, 11850, 680, 0.95], [588.5, 11950, 660, 0.9],
  [589.4, 11840, 700, 1.6], [592.3, 12020, 700, 1.55], [593.2, 12500, 640, 0.6], [597.2, 12900, 650, 0.62], [598.6, 13350, 680, 0.75],
  [607.6, 13400, 640, 0.55], [608.4, 21800, 620, 0.5], [611.2, 22300, 620, 0.55], [612.3, 23500, 680, 0.75], [621.4, 23700, 680, 0.8],
  [622.4, 24580, 720, 1.15], [627.9, 24600, 720, 1.2], [628.7, 22250, 760, 1.25], [637.8, 22250, 790, 1.25], [638.9, 21700, 640, 0.6],
  [643.0, 20300, 620, 0.5], [643.8, 24350, 620, 0.6], [649.6, 24350, 620, 0.62],
];
const CIELO6: [number, string][] = [
  [550.0, "tormenta"], [552.9, "londres"], [557.6, "mar"], [570.6, "tormenta"], [589.3, "noche"], [589.9, "tormenta"], [590.5, "noche"], [591.1, "tormenta"],
  [591.7, "noche"], [592.3, "tormenta"], [593.0, "mar"], [598.5, "verano"], [628.6, "primavera"], [643.7, "invierno"],
];

const SV: number[][] = [[0, 6400], [569.5, 6400], [572.2, 11200], [575.0, 11500], [588.0, 12000], [593.0, 12300], [596.9, 12850]];
const svX = (t: number) => kx(SV, t);
// los otros 8: en el muelle, salen juntos, el huracán los dispersa; 7 llegan a Jamestown en agosto
const otroX = (i: number, t: number) => {
  if (t < 569.5) return 6400 + i * 300;
  if (t < 600) return interpolate(t, [569.5, 572.2, 578.0], [6400 + i * 300, 11200 + i * 260, 11200 + i * 260 + (i % 2 ? 1 : -1) * 900], { extrapolateRight: "clamp" });
  return interpolate(t, [607.8, 611.0], [19900 + i * 160, 21000 + i * 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

// la bodega de la Sea Venture: todos achican, caballeros incluidos
const Achique: React.FC<{ t: number }> = ({ t }) => {
  const agua = interpolate(t, [575.7, 582.6], [120, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `rotate(${Math.sin(t * 2.2) * 9}deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: "#3a2414" }} />
      {[150, 290, 430, 570, 690].map((x, i) => (
        <div key={x} style={{ position: "absolute", left: 0, top: 0 }}>
          <Persona x={x} y={700} h={300} t={t} seed={650 + i} ropa={i % 2 ? GENT(i) : COLONO(i)} gola={i % 2 === 1} gorro={i % 2 ? "pluma" : undefined} expr={i % 2 ? "miedo" : "enojado"} flip={i > 2}
            bD={60 + Math.abs(Math.sin(t * 5 + i)) * 90} cD={40} manoD={<g><path d="M -20 -10 L 20 -10 L 16 26 L -16 26 Z" fill="#8a6a4a" stroke="#4e3622" strokeWidth={4} /></g>} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 800, height: agua, background: "rgba(42,122,200,.75)", borderTop: "6px solid #8fd0ff" }} />
      {Array.from({ length: 10 }, (_, i) => { const k = ((t * 1.3 + i / 10) % 1); return <div key={i} style={{ position: "absolute", left: 60 + i * 70, top: 40 + k * 300, width: 10, height: 26, borderRadius: 6, background: "#8fd0ff", opacity: 1 - k }} />; })}
    </div>
  );
};

export const P6: React.FC<{ t: number }> = ({ t }) => {
  if (t < 550.5 || t > 649.8) return null;
  const sv = svX(t);
  const roto = prog(t, 588.2, 588.8) * 0.9 + prog(t, 596.9, 597.6) * 0.1;
  const tilt = prog(t, 596.9, 597.5) * 14;
  const tormenta = t > 570.6 && t < 593.2;
  const smithBote = 22250;
  const salto = prog(t, 636.1, 637.0);
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM6} cielo={CIELO6}>
        <Base t={t} />
        {t < 553 && <En x={12600} w={900}><Poste t={t} t0={550.7} x={12600} y={AGUA + 20} n={6} titulo="THE RESCUE" s={1.25} /></En>}
        {/* Londres: la compañía y su gran plan */}
        {t > 552.9 && t < 557.2 && (
          <>
            {[3150, 3450].map((x, i) => <En key={x} x={x} w={250}><Persona x={x} y={SUELO} h={360} t={t} seed={120 + i} ropa={GENT(i)} gorro="copa" gola flip={i === 1} expr="orgullo" /></En>)}
            <Pergamino x={3300} y={560} w={340} abre={prog(t, 553.9, 554.5) * 0.55} lineas={5} titulo="FIX VIRGINIA" />
          </>
        )}
        {/* el muelle: animales, herramientas, Gates y Somers */}
        {t > 557.2 && t < 571 && (
          <>
            {([["caballo", 5700], ["cerdo", 5830], ["cabra", 5940]] as ["caballo" | "cerdo" | "cabra", number][]).map(([k, x], i) => <En key={k} x={x} w={200}><Bicho k={k} x={x} y={SUELO - 80} s={k === "caballo" ? 0.6 : 0.4} t={t} t0={561.85 + i * 0.25} /></En>)}
            <En x={6150} w={200}><Barril x={6150} y={SUELO - 70} s={0.3} t={t} t0={563.19} /></En>
            {[6280, 6420].map((x, i) => (
              <En key={x} x={x} w={250}>
                <Persona x={x} y={SUELO - 30} h={300} t={t} seed={660 + i} ropa={GENT(i + 2)} gola gorro={i ? "sombrero" : "morion"} barba={i ? "#d8d0c8" : "#5a3a2a"} expr="orgullo" flip={i === 1} aparece={565.3 + i * 0.9} />
                {t > 565.3 + i * 0.9 && <div style={{ position: "absolute", left: x - 110, top: SUELO - 380, width: 220, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 26, color: "#fff", background: i ? C.teal : C.violeta, borderRadius: 10, transform: `scale(${ent(t, 565.3 + i * 0.9)})` }}>{i ? "ADM. SOMERS" : "SIR THOMAS GATES"}</div>}
              </En>
            ))}
          </>
        )}
        {/* la flota */}
        {t < 600 && Array.from({ length: 8 }, (_, k) => {
          const i = k + 1;
          const x = otroX(i, t);
          const op = t > 575 ? 1 - prog(t, 576.0, 578.0) : 1;
          if (op <= 0) return null;
          return <En key={i} x={x} w={400}><div style={{ position: "absolute", left: 0, top: 0, opacity: op }}><Nave x={x} y={AGUA - 70} t={t + i} tam={0.45 + (i % 3) * 0.12} vela={t > 569.4 ? 1 : 0.3} rolido={tormenta ? 12 : 3} /></div></En>;
        })}
        {t > 607.6 && t < 628.6 && Array.from({ length: 7 }, (_, k) => { const i = k + 1; const x = otroX(i, t); return <En key={i} x={x} w={400}><Nave x={x} y={AGUA - 70} t={t + i} tam={0.45 + (i % 3) * 0.12} vela={0.6} roto={0.25} casco="#5a3418" /></En>; })}
        {/* la Sea Venture */}
        {t < 612 && (
          <En x={sv} w={600}>
            <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${tilt}deg)`, transformOrigin: `${sv}px ${AGUA}px` }}>
              <Nave x={sv} y={AGUA - 130} t={t} tam={1.0} vela={t > 569.4 && t < 588.2 ? 1 : 0.2} rolido={tormenta ? 10 : 3} roto={roto} casco="#6a3416" nombre={(t > 569.7 && t < 571.4) || (t > 597.5 && t < 599) ? "SEA VENTURE" : undefined} />
              {/* Somers al timón */}
              {t > 589.0 && t < 593.3 && <Persona x={sv - 250} y={AGUA - 88} h={150} t={t} seed={661} ropa={GENT(3)} gola gorro="sombrero" barba="#d8d0c8" expr={t > 592 ? "sorpresa" : "enojado"} />}
            </div>
          </En>
        )}
        {t > 589.0 && t < 593.3 && <Emote t={t} t0={589.6} tipo="sudor" x={cabeza(sv - 250, AGUA - 88, 150).x} y={cabeza(sv - 250, AGUA - 88, 150).y} s={0.3} />}
        {/* lo que tiran por la borda */}
        {t > 584.9 && t < 589.5 && [0, 1, 2, 3, 4].map((i) => {
          const t0 = [585.43, 585.7, 586.07, 586.4, 586.71][i];
          const u = prog(t, t0, t0 + 1.4);
          if (u <= 0 || u >= 1) return null;
          const x = sv - 100 + i * 60 + u * 520, y = AGUA - 150 - Math.sin(u * Math.PI) * 220 + u * 260;
          return i === 0 ? <svg key={i} style={{ position: "absolute", left: x - 50, top: y - 20, transform: `rotate(${u * 300}deg)` }} width={100} height={40}><rect x={0} y={4} width={100} height={30} rx={14} fill="#2a2a34" /></svg>
            : i % 2 ? <Cofre key={i} x={x} y={y} s={0.18} t={t} rot={u * 300} /> : <Barril key={i} x={x} y={y} s={0.18} rot={u * 300} />;
        })}
        {t > 596.8 && <Explosion t={t} t0={596.95} x={12900} y={AGUA - 20} s={0.8} />}
        {/* Bermudas: todos vivos */}
        {t > 598.4 && t < 608 && Array.from({ length: 16 }, (_, i) => { const x = 13250 + i * 55 + (i % 2) * 20; return <En key={i} x={x} w={100}><Persona x={x} y={SUELO + (i % 2) * 10} h={150 + (i % 3) * 14} t={t} seed={700 + i} ropa={i % 4 === 0 ? GENT(i) : COLONO(i)} gola={i % 4 === 0} expr={t > 601 ? "triste" : "feliz"} aparece={598.7 + i * 0.05} salta={t < 600.8 ? Math.abs(Math.sin(t * 6 + i)) * 14 : 0} /></En>; })}
        {/* Jamestown: cientos de bocas nuevas, enfermas */}
        {t > 611.8 && t < 628.6 && Array.from({ length: 14 }, (_, i) => { const x = 23000 + i * 85 + (i > 6 ? 900 : 0); return <En key={i} x={x} w={150}><Persona x={x} y={SUELO + (i % 2) * 8} h={200 + (i % 3) * 16} t={t} seed={720 + i} ropa={COLONO(i)} expr={i % 3 === 0 ? "triste" : "neutro"} flaco={i % 3 === 0 ? 0.3 : 0} aparece={612.3 + i * 0.06} />{i % 3 === 0 && t > 614.27 && <Emote t={t} t0={614.3 + i * 0.05} tipo="sudor" x={cabeza(x, SUELO, 210).x} y={cabeza(x, SUELO, 210).y} s={0.4} />}</En>; })}
        {/* las ratas que se comen el maíz del almacén */}
        {t > 622.0 && t < 628.8 && (
          <>
            <En x={24620} w={300}><Canasta x={24620} y={SUELO - 70} s={0.5} llena={1 - prog(t, 626.8, 628.4)} /></En>
            {Array.from({ length: 7 }, (_, i) => { const x = interpolate(t, [622.2 + i * 0.25, 625.9 + i * 0.25], [23700 + i * 40, 24480 + (i % 4) * 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <En key={i} x={x} w={100}><Rata t={t} x={x} y={SUELO - 16 - (i % 2) * 14} s={0.6} seed={i} /></En>; })}
          </>
        )}
        {/* Smith dormido en el bote con la pólvora */}
        {t > 628.6 && t < 638.9 && (
          <En x={smithBote} w={600}>
            <Bote x={smithBote} y={AGUA - 10} t={t} s={0.8} remos={0} />
            {salto < 0.02 ? (
              <div style={{ position: "absolute", left: smithBote - 120, top: AGUA - 40, transform: "rotate(-84deg)", transformOrigin: "0 0" }}>
                <Persona x={0} y={0} h={220} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" expr={t < 634.9 ? "dormido" : "miedo"} />
              </div>
            ) : salto < 1 ? (
              <Persona x={smithBote + salto * 300} y={AGUA - 30 - Math.sin(salto * Math.PI) * 200 + salto * 120} h={220} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" expr="miedo" />
            ) : null}
            {t > 631.8 && t < 636.1 && <svg style={{ position: "absolute", left: smithBote - 40, top: AGUA - 110, overflow: "visible" }} width={80} height={70}><path d="M 6 20 Q 40 -6 74 20 L 70 64 L 10 64 Z" fill="#6a5a3a" stroke="#3a2a12" strokeWidth={5} /><text x={40} y={52} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={18} fill="#fff">POWDER</text></svg>}
            <Explosion t={t} t0={634.95} x={smithBote} y={AGUA - 80} s={0.6} />
            {t > 636.9 && t < 638.8 && <svg style={{ position: "absolute", left: smithBote + 220, top: AGUA - 160, overflow: "visible" }} width={160} height={160}>{Array.from({ length: 9 }, (_, i) => { const k = prog(t, 637.0, 637.9); const a = -Math.PI / 2 + (i - 4) * 0.3; return <ellipse key={i} cx={80 + Math.cos(a) * 120 * k} cy={150 + Math.sin(a) * 150 * k + k * k * 80} rx={10} ry={16} fill="#8fd0ff" opacity={1 - k} />; })}</svg>}
          </En>
        )}
        {/* Smith vuelve a Inglaterra: el barco se va río abajo */}
        {t > 639.6 && t < 643.9 && (() => { const x = interpolate(t, [639.8, 643.6], [21800, 19800]); return <En x={x} w={500}><Nave x={x} y={AGUA - 110} t={t} tam={0.85} vela={1} nombre="TO ENGLAND" /></En>; })()}
        {tormenta && t > 571 && <><Rayo t={t} t0={573.3} x={11900} /><Rayo t={t} t0={580.2} x={12300} /><Rayo t={t} t0={586.9} x={11600} /></>}
      </Mundo>

      {/* pantalla */}
      {tormenta && <Lluvia t={t} n={140} angulo={22} op={0.6} />}
      {t < 553 && <Trampas t={t} t0={550.8} n={6} y={960} />}
      <Chip t={t} t0={553.03} t1={556.5} text="LONDON" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={554.77} t1={557.2} text="ONCE AND FOR ALL" color={C.violeta} x={960} y={930} centro size={56} />
      {t > 556.9 && t < 559.2 && <Grande t={t} t0={556.97} text="THE BIGGEST FLEET" y={200} size={110} color={C.ambar} />}
      <Chip t={t} t0={559.29} t1={562.3} text="9 SHIPS" color={C.teal} tinta={C.noche} x={760} y={140} centro size={60} />
      <Chip t={t} t0={560.33} t1={562.3} text="500-600 PEOPLE" color={C.violeta} x={1160} y={140} centro size={60} />
      <Chip t={t} t0={561.85} t1={565.2} text="CATTLE" color={C.tierra} x={260} y={160} size={44} />
      <Chip t={t} t0={562.49} t1={565.2} text="HORSES" color="#7a5a3a" x={260} y={235} size={44} />
      <Chip t={t} t0={563.19} t1={565.2} text="TOOLS" color="#6a7484" x={260} y={310} size={44} />
      <Chip t={t} t0={564.41} t1={569.6} text="THE NEW LEADERS" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={568.29} t1={569.6} text="ALL ON THE FLAGSHIP" color={C.rojo} x={960} y={930} centro size={54} />
      <Chip t={t} t0={570.95} t1={573.9} text="JULY 1609" color={C.naranja} x={960} y={140} centro size={60} />
      {t > 574.7 && t < 575.9 && <Grande t={t} t0={574.95} text="HURRICANE" y={240} size={150} color="#fff" />}
      {/* la lupa: todos achican */}
      {t > 575.6 && t < 583.2 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${1 - prog(t, 582.7, 583.2)})`, transformOrigin: "960px 520px" }}>
          <Lupa t={t} t0={575.7} x={960} y={520} r={400}><Achique t={t} /></Lupa>
        </div>
      )}
      <Chip t={t} t0={577.07} t1={583.0} text="LEAKING" color="#2a7ac8" x={250} y={140} size={56} />
      <Chip t={t} t0={579.65} t1={583.0} text="GENTLEMEN INCLUDED" color={C.violeta} x={250} y={220} size={44} />
      <Chip t={t} t0={582.31} t1={583.0} text="DAY AND NIGHT" color={C.noche2} x={1420} y={140} size={50} />
      <Chip t={t} t0={583.23} t1={587.3} text="THROW IT ALL OVERBOARD" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={585.43} t1={587.3} text="CANNONS" color="#3a3a44" x={300} y={260} size={44} />
      <Chip t={t} t0={586.07} t1={587.3} text="CHESTS" color={C.tierra} x={300} y={335} size={44} />
      <Chip t={t} t0={586.71} t1={587.3} text="LUGGAGE" color="#7a5a3a" x={300} y={410} size={44} />
      {t > 587.5 && t < 589.2 && <Grande t={t} t0={588.19} text="CUT THE MAST" y={200} size={120} color={C.ambar} />}
      <Chip t={t} t0={589.31} t1={593.0} text="ADMIRAL SOMERS" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      {t > 590.6 && t < 593.0 && (
        <div style={{ position: "absolute", left: 80, top: 80, fontFamily, fontWeight: 700, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 20, padding: "8px 26px", textAlign: "center" }}>
          <div style={{ fontSize: 28, color: C.rojo }}>NO SLEEP</div>
          <div style={{ fontSize: 88, color: C.noche, lineHeight: 1 }}>{Math.min(3, Math.max(1, Math.floor(interpolate(t, [590.6, 592.2], [1, 3.99]))))}<span style={{ fontSize: 36 }}> DAYS</span></div>
        </div>
      )}
      <Chip t={t} t0={594.37} t1={596.8} text="LAND!" color={C.lima} tinta={C.noche} x={960} y={140} centro size={60} />
      <Chip t={t} t0={594.85} t1={597.5} text="ON PURPOSE" color={C.rojo} x={960} y={930} centro size={56} />
      {t > 597.5 && t < 598.9 && <Grande t={t} t0={597.75} text="BERMUDA" y={200} size={150} color={C.teal} />}
      {t > 599.0 && t < 601.0 && <Grande t={t} t0={599.85} text="EVERYONE SURVIVES" y={930} size={96} color={C.lima} />}
      <Chip t={t} t0={601.37} t1={604.4} text="STRANDED" color={C.rojo} x={960} y={140} centro size={60} />
      <Chip t={t} t0={602.97} t1={607.8} text="600+ MILES FROM VIRGINIA" color={C.violeta} x={960} y={930} centro size={54} />
      {[["THE LEADERS", 605.05], ["THE SUPPLIES", 605.93], ["THE INSTRUCTIONS", 606.75]].map(([s, t0], i) => (
        <React.Fragment key={i}>
          <Chip t={t} t0={t0 as number} t1={607.9} text={s as string} color={C.oro} tinta={C.noche} x={1420} y={260 + i * 80} size={42} />
        </React.Fragment>
      ))}
      <Chip t={t} t0={608.03} t1={611.3} text="MEANWHILE..." color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={611.25} t1={612.3} text="AUGUST" color={C.naranja} x={960} y={930} centro size={56} />
      <Chip t={t} t0={612.31} t1={617.3} text="HUNDREDS OF NEW MOUTHS" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={614.27} t1={617.3} text="SICK" color={C.lima} tinta={C.noche} x={300} y={260} size={44} />
      <Chip t={t} t0={615.25} t1={617.3} text="LITTLE FOOD" color={C.naranja} x={300} y={335} size={44} />
      <Chip t={t} t0={616.37} t1={617.3} text="NO LEADERS" color={C.violeta} x={300} y={410} size={44} />
      {t > 617.4 && t < 622.2 && <Tablero t={t} valor={interpolate(t, [619.7, 620.6], [100, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} titulo="MOUTHS TO FEED" rojo={t > 620.4} x={1640} y={150} s={1.2} />}
      <Chip t={t} t0={622.67} t1={624.5} text="ONE MORE PASSENGER..." color="#6a6a7a" x={960} y={140} centro size={54} />
      {t > 624.5 && t < 626.0 && <Grande t={t} t0={624.65} text="RATS" y={200} size={160} color="#c8c8d8" />}
      <Chip t={t} t0={626.13} t1={628.5} text="INTO THE STOREHOUSE" color={C.tierra} x={960} y={930} centro size={54} />
      <Chip t={t} t0={629.23} t1={631.5} text="SEPTEMBER" color={C.naranja} x={960} y={140} centro size={56} />
      <Chip t={t} t0={632.31} t1={634.9} text="GUNPOWDER ON HIS LAP" color={C.rojo} x={960} y={930} centro size={54} />
      {t > 634.9 && t < 636.1 && <Grande t={t} t0={634.95} text="FIRE!" y={200} size={150} color={C.naranja} />}
      <Chip t={t} t0={636.13} t1={638.8} text="INTO THE RIVER" color="#2a7ac8" x={960} y={140} centro size={56} />
      <Chip t={t} t0={638.91} t1={640.4} text="BADLY WOUNDED" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={640.01} t1={642.3} text="HOME · OCTOBER" color={C.violeta} x={960} y={930} centro size={54} />
      {t > 642.3 && t < 643.8 && <Grande t={t} t0={642.41} text="HE NEVER COMES BACK" y={200} size={100} color={C.ambar} />}
      {/* la ficha de Smith, tachada */}
      {t > 643.7 && t < 647.0 && (
        <div style={{ position: "absolute", left: 810, top: 300, transform: `scale(${ent(t, 643.8) * (1 - prog(t, 646.5, 647.0))}) rotate(-3deg)`, width: 300, height: 340, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 18, overflow: "hidden" }}>
          <Persona x={150} y={350} h={340} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" gorro="morion" expr="triste" />
          <div style={{ position: "absolute", left: 0, top: 6, width: 300, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 26, color: C.rojo }}>KEPT THEM ALIVE</div>
          <Tacha t={t} t0={646.0} x={150} y={170} r={130} />
        </div>
      )}
      <Chip t={t} t0={647.41} t1={649.7} text="OCTOBER 1609" color="#6a8ab8" x={960} y={140} centro size={56} />
      {t > 648.4 && <Grande t={t} t0={648.45} text="WINTER IS COMING" y={930} size={100} color="#cfe0ff" />}
      {t > 646.8 && <Nieve t={t} n={40} op={0.5 * prog(t, 647, 649)} />}
    </AbsoluteFill>
  );
};
