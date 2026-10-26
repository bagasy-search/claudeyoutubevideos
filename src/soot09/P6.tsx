import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza, Pergamino } from "./kit";
import { Trampas, Lluvia } from "./kit2";
import { Mundo, K, En, SUELO, AGUA, kx } from "./mundo";
import { Base, FX } from "./base";
import { GENT, COLONO, SMITH, Poste, Nave, Bote, Rata, Bicho, Cofre, Barril, Explosion, Rayo, Canasta, Tablero, Nieve } from "./kitj";
import { Lupa, Tacha } from "./kitj2";
import { Vineta, Rotulo } from "./vineta";

// TRAMPA 6 · EL RESCATE (550,6-649,7 s). La flota más grande (9 barcos), el huracán, la Sea Venture achicando agua,
// tirando todo y cortando el palo mayor, Somers 3 días al timón, el arrecife de Bermudas; el resto llega a Jamestown
// sin líderes, con ratas; Smith y la pólvora; se va y nunca vuelve.
export const CAM6: K[] = [
  [550.62, 24400, 690, 0.8], [550.74, 12600, 640, 0.85], [552.9, 12600, 640, 0.88], [553.02, 3300, 640, 1.3], [556.7, 3300, 640, 1.36],
  [556.74, 7100, 600, 0.4], [561.6, 7100, 600, 0.42], [562.4, 5900, 640, 0.95], [568.8, 6050, 640, 0.95], [569.6, 6500, 600, 0.6],
  [571.4, 9900, 650, 0.8], [572.2, 11150, 650, 0.82], [574.9, 11550, 640, 0.75], [578.0, 11750, 660, 0.8], [583.1, 11850, 680, 0.95], [588.5, 11950, 660, 0.9],
  [589.4, 11840, 700, 1.6], [592.3, 12020, 700, 1.55], [593.2, 12500, 640, 0.6], [597.2, 12900, 650, 0.62], [598.6, 13350, 680, 0.75],
  [607.6, 13400, 640, 0.55], [608.4, 21800, 620, 0.5], [611.2, 22300, 620, 0.55], [612.3, 23620, 700, 1.0], [621.4, 23720, 700, 1.02],
  [622.4, 24580, 720, 1.15], [627.9, 24600, 720, 1.2], [628.7, 22250, 790, 1.55], [633.6, 22300, 800, 1.65], [636.0, 22350, 780, 1.7], [637.8, 22400, 790, 1.55], [638.9, 21700, 640, 0.6],
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
  const agua = interpolate(t, [575.7, 582.6], [90, 230], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `rotate(${Math.sin(t * 2.2) * 9}deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: "#3a2414" }} />
      {[150, 290, 430, 570, 690].map((x, i) => (
        <div key={x} style={{ position: "absolute", left: 0, top: 0 }}>
          <Persona x={x} y={700} h={300} t={t} seed={650 + i} ropa={i % 2 ? GENT(i) : COLONO(i)} gola={i % 2 === 1} gorro={i % 2 ? "pluma" : undefined} expr={i % 2 ? "miedo" : "enojado"} flip={i > 2}
            bD={60 + Math.abs(Math.sin(t * 5 + i)) * 90} cD={40} manoD={<g><path d="M -20 -10 L 20 -10 L 16 26 L -16 26 Z" fill="#8a6a4a" stroke="#4e3622" strokeWidth={4} /></g>} />
        </div>
      ))}
      {/* el agua que tiran por la borda con los baldes */}
      {[150, 290, 430, 570, 690].map((x, i) => { const k = ((t * 1.6 + i * 0.37) % 1); return <div key={`a${x}`} style={{ position: "absolute", left: x + (i > 2 ? -1 : 1) * k * 120, top: 360 - Math.sin(k * Math.PI) * 220, width: 46, height: 30, borderRadius: "50%", background: "#8fd0ff", border: "4px solid #fff", opacity: 1 - k * 0.6 }} />; })}
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
  const salto = prog(t, 636.1, 637.7);
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM6} cielo={CIELO6}>
        <Base t={t} />
        {t < 553 && <En x={12600} w={900}><Poste t={t} t0={550.7} x={12600} y={AGUA + 20} n={6} titulo="THE RESCUE" s={1.25} /></En>}
        {/* Londres: la compañía y su gran plan */}
        {t > 552.9 && t < 557.2 && (
          <>
            {[3150, 3450].map((x, i) => <En key={x} x={x} w={250}><Persona x={x} y={SUELO} h={360} t={t} seed={120 + i} ropa={GENT(i)} gorro="copa" gola flip={i === 1} expr={i ? "enojado" : "neutro"} habla={i === 0} bD={i === 0 ? 120 : undefined} cD={i === 0 ? 20 : undefined} /></En>)}
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
                {t > 565.3 + i * 0.9 && <div style={{ position: "absolute", left: x - 180, top: SUELO - (i ? 400 : 470), width: 360, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", background: i ? C.teal : C.violeta, borderRadius: 12, transform: `scale(${ent(t, 565.3 + i * 0.9)})` }}>{i ? "ADM. SOMERS" : "SIR THOMAS GATES"}</div>}
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
        {t > 611.8 && t < 628.6 && Array.from({ length: 14 }, (_, i) => { const x = 23000 + i * 85 + (i > 6 ? 900 : 0); return <En key={i} x={x} w={150}><Persona x={x} y={SUELO + (i % 2) * 8} h={200 + (i % 3) * 16} t={t} seed={720 + i} ropa={COLONO(i)} expr={t > 624.5 ? (i % 2 ? "miedo" : "sorpresa") : i % 3 === 0 ? "triste" : "neutro"} flaco={i % 3 === 0 ? 0.3 : 0} aparece={612.3 + i * 0.06} mira={t > 624.5 ? (x < 24580 ? 0.7 : -0.7) : 0} />{i % 3 === 0 && t > 614.27 && <Emote t={t} t0={614.3 + i * 0.05} tipo="sudor" x={cabeza(x, SUELO, 210).x} y={cabeza(x, SUELO, 210).y} s={0.4} />}</En>; })}
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
              <div style={{ position: "absolute", left: smithBote + 100, top: AGUA - 52, transform: "rotate(-88deg)", transformOrigin: "0 0" }}>
                <Persona x={0} y={0} h={220} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" expr={t < 634.9 ? "dormido" : "miedo"} />
              </div>
            ) : salto < 1 ? (
              <>
                {/* el cuerpo en llamas mientras salta */}
                <svg style={{ position: "absolute", left: smithBote + salto * 300 - 90, top: AGUA - 300 - Math.sin(salto * Math.PI) * 200 + salto * 120, overflow: "visible" }} width={180} height={220}>
                  {Array.from({ length: 6 }, (_, i) => { const w = Math.sin(t * (11 + i) + i * 2) * 10; const x0 = 20 + i * 28; return <path key={i} d={`M ${x0} 200 Q ${x0 - 14 + w} ${120 - (i % 3) * 20} ${x0 + 10 + w} ${40 + (i % 2) * 30} Q ${x0 + 34 - w} 130 ${x0 + 26} 200 Z`} fill={["#ff5a1a", "#ffb23a", "#fff0a0"][i % 3]} opacity={0.75 * (1 - prog(t, 637.4, 637.6))} />; })}
                </svg>
                <Persona x={smithBote + salto * 300} y={AGUA - 30 - Math.sin(salto * Math.PI) * 200 + salto * 120} h={220} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" expr="miedo" bD={170} bI={170} cD={20} cI={20} inclina={salto * 40} />
              </>
            ) : null}
            {t > 628.6 && t < 636.1 && <svg style={{ position: "absolute", left: smithBote - 70, top: AGUA - 85, overflow: "visible", transform: "scale(1.5)" }} width={80} height={70}>{t > 633.6 && <g>{[0, 1, 2, 3].map((k) => <circle key={k} cx={40 + Math.sin(t * 30 + k) * 14} cy={-6 - k * 8} r={6 - k} fill={k % 2 ? "#ffd34a" : "#ff6a2a"} />)}</g>}<path d="M 6 20 Q 40 -6 74 20 L 70 64 L 10 64 Z" fill="#6a5a3a" stroke="#3a2a12" strokeWidth={5} /><text x={40} y={52} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={18} fill="#fff">POWDER</text></svg>}
            <Explosion t={t} t0={634.95} x={smithBote} y={AGUA - 80} s={1.0} />
            {t > 637.5 && t < 638.8 && <svg style={{ position: "absolute", left: smithBote + 220, top: AGUA - 160, overflow: "visible" }} width={160} height={160}>{Array.from({ length: 9 }, (_, i) => { const k = prog(t, 637.55, 638.5); const a = -Math.PI / 2 + (i - 4) * 0.3; return <ellipse key={i} cx={80 + Math.cos(a) * 200 * k} cy={150 + Math.sin(a) * 260 * k + k * k * 140} rx={18} ry={28} fill="#8fd0ff" stroke="#fff" strokeWidth={4} opacity={1 - k} />; })}</svg>}
          </En>
        )}
        {/* Smith vuelve a Inglaterra: el barco se va río abajo */}
        {t > 639.6 && t < 643.9 && (() => { const x = interpolate(t, [639.8, 643.6], [21800, 19800]); return <En x={x} w={500}><Nave x={x} y={AGUA - 110} t={t} tam={0.85} vela={1} nombre="TO ENGLAND" /></En>; })()}
        {tormenta && t > 571 && <><Rayo t={t} t0={573.3} x={11900} /><Rayo t={t} t0={580.2} x={12300} /><Rayo t={t} t0={586.9} x={11600} /></>}
      </Mundo>

      {/* pantalla */}
      {tormenta && <Lluvia t={t} n={140} angulo={22} op={0.6} />}
      <Chip t={t} t0={553.03} t1={556.5} text="LONDON" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={554.77} t1={557.2} text="ONCE AND FOR ALL" color={C.violeta} x={960} y={930} centro size={56} />
      {t > 556.65 && t < 559.2 && <Grande t={t} t0={556.7} text="THE BIGGEST FLEET" y={200} size={110} color={C.ambar} />}
      <Chip t={t} t0={559.29} t1={562.3} text="9 SHIPS" color={C.teal} tinta={C.noche} x={760} y={140} centro size={60} />
      <Chip t={t} t0={560.33} t1={562.3} text="500-600 PEOPLE" color={C.violeta} x={1160} y={140} centro size={60} />
      <Vineta t={t} t0={561.9} t1={565.25} x={1150} y={580} w={1240} h={660} cielo="#cfe3f0" suelo="#8a6a40" sueloY={520} rot={-1}>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1240} height={660}>
          <rect x={0} y={520} width={1240} height={140} fill="#2f6f8f" /><rect x={0} y={500} width={1240} height={30} fill="#8a6a40" />
          <path d="M 760 200 L 1300 200 L 1300 520 L 800 520 Z" fill="#7a3e1a" stroke="#3a1a08" strokeWidth={8} /><rect x={1000} y={-40} width={26} height={240} fill="#5a3a1a" />
          <path d="M 300 510 L 820 230" stroke="#6a4a26" strokeWidth={30} strokeLinecap="round" />{Array.from({ length: 9 }, (_, k) => <line key={k} x1={330 + k * 56} y1={493 - k * 30} x2={344 + k * 56} y2={520 - k * 30} stroke="#3a2614" strokeWidth={5} />)}
        </svg>
        {(["caballo", "cerdo"] as const).map((k, i) => { const u = Math.min(1, Math.max(0, (t - 562.0 - i * 0.6) / 3.0)); const x = 220 + u * 520, y = 520 - u * 280; return <div key={k} style={{ position: "absolute", left: 0, top: 0, transform: `rotate(-28deg)`, transformOrigin: `${x}px ${y}px` }}><Bicho k={k} x={x} y={y - 50 + Math.abs(Math.sin(t * 8 + i)) * -8} s={k === "caballo" ? 1.0 : 0.7} t={t} /></div>; })}
        {(() => { const u = Math.min(1, Math.max(0, (t - 561.9) / 3.0)); return <Persona x={360 + u * 520} y={490 - u * 280} h={340} t={t} seed={1190} ropa={COLONO(1)} expr="neutro" camina={1.3} inclina={-10} bD={70} cD={10} />; })()}
        <Persona x={140} y={640} h={420} t={t} seed={1191} ropa={COLONO(3)} expr="neutro" mira={0.5} bD={90} cD={60} manoD={<rect x={-30} y={-40} width={60} height={50} rx={6} fill="#8a6a40" stroke="#4e2a12" strokeWidth={5} />} />
      </Vineta>
      <Chip t={t} t0={561.85} t1={565.2} text="CATTLE" color={C.tierra} x={260} y={160} size={44} />
      <Chip t={t} t0={562.49} t1={565.2} text="HORSES" color="#7a5a3a" x={260} y={235} size={44} />
      <Chip t={t} t0={563.19} t1={565.2} text="TOOLS" color="#6a7484" x={260} y={310} size={44} />
      {/* plano medio de los nuevos jefes */}
      {t > 565.2 && t < 569.7 && (
        <div style={{ position: "absolute", left: 960, top: 560, width: 1100, height: 640, transform: `translate(-50%,-50%) scale(${ent(t, 565.25) * (1 - prog(t, 569.3, 569.7))}) rotate(-1.5deg)`, background: "#d8e6f0", border: "10px solid #2a1408", borderRadius: 28, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 440, width: 1100, height: 200, background: "#8a5a2e" }} />
          {[300, 800].map((x, i) => t > 565.3 + i * 0.9 && (
            <div key={x} style={{ position: "absolute", left: 0, top: 0 }}>
              <Persona x={x} y={760} h={640} t={t} seed={660 + i} ropa={GENT(i + 2)} gola gorro={i ? "sombrero" : "morion"} barba={i ? "#d8d0c8" : "#5a3a2a"} expr="orgullo" flip={i === 1} mira={i ? -0.3 : 0.3} aparece={565.3 + i * 0.9} />
              <div style={{ position: "absolute", left: x - 250, top: 560, width: 500, whiteSpace: "nowrap", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: "#fff", background: i ? C.teal : C.violeta, border: "5px solid #1b1240", borderRadius: 14, transform: `scale(${ent(t, 565.4 + i * 0.9)})` }}>{i ? "ADM. GEORGE SOMERS" : "SIR THOMAS GATES"}</div>
            </div>
          ))}
        </div>
      )}
      <Chip t={t} t0={564.41} t1={569.6} text="THE NEW LEADERS" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={568.29} t1={569.6} text="ALL ON THE FLAGSHIP" color={C.rojo} x={960} y={930} centro size={54} />
      <Chip t={t} t0={570.7} t1={575.6} text="JULY 1609 · MID-ATLANTIC" color={C.naranja} x={960} y={1000} centro size={52} />
      {/* plano medio: el huracán. La nave se tumba ±15°, la ola pasa por encima de la cubierta, rayo, la flota se dispersa */}
      {t > 571.0 && t < 575.7 && (() => {
        const ang = Math.sin(t * 2.6) * 15, ola = prog(t, 573.0, 573.9) * (1 - prog(t, 574.3, 575.0)), flash = t > 573.3 && t < 573.55;
        return <Vineta t={t} t0={571.05} t1={575.65} x={960} y={560} w={1300} h={720} cielo={flash ? "#e8e8ff" : "#2a3048"} cielo2={flash ? "#c0c0e8" : "#4a5468"} suelo="#1f4a6a" sueloY={520} titulo="HURRICANE" colorTitulo="#3a4a8a" sacude={flash ? 10 : 4} rot={-1}>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1300} height={720}>
            {flash && <path d="M 980 0 L 930 120 L 990 130 L 920 300" stroke="#fff8c0" strokeWidth={14} fill="none" />}
            {[0, 1].map((k) => { const dx = prog(t, 571.5, 575.6) * (k ? 420 : -380); return <g key={k} transform={`translate(${(k ? 1060 : 220) + dx} ${430 + Math.sin(t * 3 + k) * 20}) rotate(${Math.sin(t * 2 + k * 2) * 18}) scale(0.32)`}><path d="M -300 0 L 300 0 L 240 120 L -240 120 Z" fill="#5a2a10" /><rect x={-10} y={-360} width={20} height={360} fill="#3a2010" /><path d="M 10 -330 Q 180 -200 10 -40 Z" fill="#c8c0b0" /></g>; })}
            <g transform={`translate(650 ${470 + Math.sin(t * 2.6 + 1) * 24}) rotate(${ang})`}>
              <rect x={-14} y={-430} width={28} height={430} fill="#3a2010" />
              <path d={`M 18 -410 Q ${180 + Math.sin(t * 9) * 40} -280 18 -110 Z`} fill="#d8d0c0" stroke="#8a7a6a" strokeWidth={5} />
              <path d="M 6 -400 L 120 -390" stroke="#d8d0c0" strokeWidth={6} />
              <path d="M -470 0 L 470 0 L 400 170 L -400 170 Z" fill="#6a3416" stroke="#2a1408" strokeWidth={10} />
              <rect x={-470} y={-16} width={940} height={20} fill="#4a2410" />
            </g>
          </svg>
          {[[470, 1153], [820, 1154]].map(([x, seed], k) => <div key={k} style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${ang}deg)`, transformOrigin: `650px ${470 + Math.sin(t * 2.6 + 1) * 24}px` }}>
            <Persona x={x} y={470 + Math.sin(t * 2.6 + 1) * 24} h={300} t={t} seed={seed} ropa={k ? GENT(1) : COLONO(2)} gola={k === 1} expr="miedo" inclina={-ang * 0.8 + (k ? 10 : -10)} bI={150} bD={k ? 40 : 150} cI={20} habla={k === 0} />
          </div>)}
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1300} height={720}>
            <path d={`M 0 ${560 + Math.sin(t * 3) * 20} Q 160 ${500 + Math.sin(t * 3 + 1) * 30} 330 ${560 + Math.sin(t * 3 + 2) * 20} T 650 ${560} T 980 ${550 + Math.sin(t * 3) * 20} T 1300 ${560} L 1300 720 L 0 720 Z`} fill="#2a5a7a" />
            <path d={`M ${-200 + ola * 900} 720 Q ${100 + ola * 900} ${720 - ola * 520} ${380 + ola * 900} ${560 - ola * 300} Q ${300 + ola * 900} ${640 - ola * 200} ${460 + ola * 900} ${600 - ola * 160} L ${600 + ola * 900} 720 Z`} fill="#3a7aa0" stroke="#e8f4ff" strokeWidth={10} opacity={ola > 0 ? 1 : 0} />
            {Array.from({ length: 12 }, (_, k) => <circle key={k} cx={(k * 113 + t * 300) % 1300} cy={540 + Math.sin(t * 5 + k) * 30} r={10 + (k % 3) * 5} fill="#e8f4ff" opacity={0.8} />)}
          </svg>
          <div style={{ position: "absolute", inset: 0 }}><Lluvia t={t} n={110} seed={14} angulo={30} op={0.7} /></div>
        </Vineta>;
      })()}
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
        <div style={{ position: "absolute", left: 1460, top: 220, fontFamily, fontWeight: 700, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 20, padding: "8px 26px", textAlign: "center" }}>
          <div style={{ fontSize: 40, color: C.rojo }}>NO SLEEP</div>
          <div style={{ fontSize: 88, color: C.noche, lineHeight: 1 }}>{Math.min(3, Math.max(1, Math.floor(interpolate(t, [590.6, 592.2], [1, 3.99]))))}<span style={{ fontSize: 36 }}> DAYS</span></div>
        </div>
      )}
      <Chip t={t} t0={594.37} t1={597.5} text="LAND!" color={C.lima} tinta={C.noche} x={960} y={140} centro size={70} />
      <Chip t={t} t0={597.6} t1={602.5} text="BERMUDA" color={C.teal} tinta={C.noche} x={960} y={930} centro size={70} />
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
      <Vineta t={t} t0={613.4} t1={617.45} x={960} y={580} w={1400} h={640} cielo="#e8d8b0" suelo="#8a6a3a" sueloY={500} rot={0.8}>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1400} height={640}>
          <line x1={466} y1={40} x2={466} y2={640} stroke="#2a1408" strokeWidth={8} strokeDasharray="20 14" /><line x1={933} y1={40} x2={933} y2={640} stroke="#2a1408" strokeWidth={8} strokeDasharray="20 14" />
          <g transform={`translate(640 ${470}) rotate(${t > 615.4 ? -70 * prog(t, 615.4, 616.0) : 0})`}><path d="M -70 -110 L 70 -110 L 60 30 L -60 30 Z" fill="#8a5a2e" stroke="#4e2a12" strokeWidth={7} /><ellipse cx={0} cy={-110} rx={70} ry={18} fill="#2a1408" /></g>
          {t > 616.0 && <circle cx={760} cy={430 + prog(t, 616.0, 616.5) * 60} r={10} fill="#e8c860" />}
          <g transform="translate(1170 500)"><rect x={-90} y={-170} width={18} height={170} fill="#5a3a1a" /><rect x={72} y={-170} width={18} height={170} fill="#5a3a1a" /><rect x={-100} y={-90} width={200} height={22} fill="#7a4a1a" /><rect x={-100} y={-290} width={200} height={200} rx={10} fill="#8a5a2a" stroke="#4e2a12" strokeWidth={6} /><text x={0} y={-160} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={120} fill="#f4ecd8" opacity={prog(t, 616.4, 616.8)}>?</text></g>
        </svg>
        <div style={{ position: "absolute", left: 40, top: 560, transform: "rotate(90deg)", transformOrigin: "0 0" }}><Persona x={0} y={0} h={300} t={t} seed={1180} ropa={COLONO(2)} expr="triste" flaco={0.3} /></div>
        <Persona x={385} y={600} h={340} t={t} seed={1181} ropa={COLONO(0)} expr="triste" inclina={10 + Math.abs(Math.sin(t * 6)) * 12} bD={100} cD={110} habla />
        <Persona x={830} y={610} h={380} t={t} seed={1182} ropa={COLONO(1)} expr={t > 616.0 ? "sorpresa" : "neutro"} flip bI={110} bD={110} cI={20} cD={20} />
        <Persona x={1000} y={610} h={340} t={t} seed={1183} ropa={COLONO(3)} expr="miedo" mira={0.6} bD={150} cD={30} />
        {[[233, 614.27, "SICK", C.lima, C.noche], [700, 615.25, "LITTLE FOOD", C.naranja, "#fff"], [1166, 616.37, "NO LEADERS", C.violeta, "#fff"]].map(([x, t0, s, c, k]) => <Rotulo key={s as string} t={t} t0={t0 as number} x={x as number} y={110} text={s as string} color={c as string} tinta={k as string} size={52} />)}
      </Vineta>
      {t > 617.4 && t < 622.2 && <Tablero t={t} valor={interpolate(t, [619.7, 620.6], [100, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} titulo="MOUTHS TO FEED" rojo={t > 620.4} x={1640} y={150} s={1.2} />}
      <Chip t={t} t0={622.67} t1={624.5} text="ONE MORE PASSENGER..." color="#6a6a7a" x={960} y={140} centro size={54} />
      {t > 624.5 && t < 626.0 && <Grande t={t} t0={624.65} text="RATS" y={200} size={160} color="#c8c8d8" />}
      {t > 634.9 && t < 635.6 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "#fff2c0", opacity: 0.85 * (1 - prog(t, 634.95, 635.6)) }} />}
      {t > 637.5 && t < 638.8 && <Grande t={t} t0={637.55} text="SPLASH!" y={260} size={130} color="#8fd0ff" />}
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
        <div style={{ position: "absolute", left: 810, top: 260, transformOrigin: "150px 170px", transform: `scale(${1.5 * ent(t, 643.8) * (1 - prog(t, 646.5, 647.0))}) rotate(-3deg)`, width: 300, height: 340, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 18, overflow: "hidden" }}>
          <Persona x={150} y={350} h={340} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" gorro="morion" expr="triste" />
          <div style={{ position: "absolute", left: 0, top: 6, width: 300, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 32, color: C.rojo }}>KEPT THEM ALIVE</div>
          <Tacha t={t} t0={646.0} x={150} y={170} r={130} />
        </div>
      )}
      <Chip t={t} t0={647.41} t1={649.7} text="OCTOBER 1609" color="#6a8ab8" x={960} y={140} centro size={56} />
      {t > 648.4 && <Grande t={t} t0={648.45} text="WINTER IS COMING" y={930} size={100} color="#cfe0ff" />}
      {t > 646.8 && <Nieve t={t} n={40} op={0.5 * prog(t, 647, 649)} />}
    </AbsoluteFill>
  );
};
