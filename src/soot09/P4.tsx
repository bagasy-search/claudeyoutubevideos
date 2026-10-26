import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza, Particulas } from "./kit";
import { Trampas } from "./kit2";
import { Mundo, K, En, SUELO, AGUA } from "./mundo";
import { Base, FX } from "./base";
import { TOM, GENT, COLONO, POW, SMITH, Poste, Nave, Pepitas, Frasco, Barril, Olla, Canasta, Cuentas, Nieve, Cartel, Mosquitos } from "./kitj";
import { Globo, Lupa, Olor, Tacha } from "./kitj2";

// TRAMPA 4 · EL ORO (342,7-439,3 s). El incendio del fuerte, los que trajo el barco (orfebres, refinadores, joyero, perfumista),
// la fiebre del oro en la arena del río, el barco cargado de tierra brillante que vuelve a Londres, oro de tontos,
// y Smith presidente: "el que no trabaja no come".
export const CAM4: K[] = [
  [342.8, 24350, 620, 0.65], [343.9, 21350, 640, 0.8], [345.0, 21350, 640, 0.8], [346.6, 24350, 640, 0.7], [348.0, 24350, 660, 0.8],
  [355.2, 24350, 660, 0.85], [356.8, 22950, 680, 0.8], [361.8, 23050, 700, 1.0], [366.3, 23150, 700, 1.1], [372.3, 23200, 700, 1.15],
  [373.4, 23100, 680, 0.8], [377.8, 22950, 790, 1.4], [381.6, 22950, 790, 1.45], [383.2, 23450, 700, 1.0], [392.6, 23350, 700, 0.95],
  [394.4, 22100, 700, 0.88], [396.5, 20600, 640, 0.55], [398.6, 20000, 640, 0.52], [404.6, 22900, 640, 0.6], [405.8, 24050, 680, 1.0],
  [416.4, 24150, 680, 1.05], [417.4, 24300, 600, 0.8], [419.4, 24300, 620, 0.8], [420.3, 24100, 700, 1.15], [427.9, 24150, 700, 1.2],
  [429.0, 23900, 700, 0.82], [433.4, 23950, 700, 0.82], [438.9, 24100, 660, 0.72],
];
const CIELO4: [number, string][] = [[342.0, "invierno"], [347.4, "hambre"], [355.3, "invierno"], [377.8, "primavera"], [405.4, "verano"], [434.0, "primavera"]];

// el barco de abastecimiento: anclado, se carga de "oro" y vuelve a Inglaterra
const barcoX = (t: number) => interpolate(t, [395.7, 399.5], [21900, 18400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// los recién llegados: [x final, oficio, aparece]
const NUEVOS: [number, string, number][] = [[22880, "GOLDSMITH", 362.22], [22990, "GOLDSMITH", 362.5], [23110, "REFINER", 363.44], [23220, "REFINER", 363.7], [23340, "JEWELER", 364.68], [23470, "PERFUMER", 365.54]];
// los que cavan / lavan / refinan / cargan
const FIEBRE = [22850, 22960, 23080, 23200, 23330, 23450, 23580, 23700];

const Llamas: React.FC<{ t: number; x: number; y: number; w: number; k: number }> = ({ t, x, y, w, k }) => {
  if (k <= 0) return null;
  const n = Math.round(w / 70);
  return (
    <svg style={{ position: "absolute", left: x - w / 2, top: y - 420, overflow: "visible", pointerEvents: "none" }} width={w} height={440}>
      {Array.from({ length: n }, (_, i) => {
        const h = (180 + ((i * 53) % 140) + Math.sin(t * 9 + i * 1.7) * 40) * k;
        const cx = 35 + i * 70 + Math.sin(t * 6 + i) * 8;
        return <g key={i}><path d={`M ${cx - 44} 440 Q ${cx - 50} ${440 - h * 0.5} ${cx} ${440 - h} Q ${cx + 50} ${440 - h * 0.5} ${cx + 44} 440 Z`} fill={i % 2 ? "#ff6a2a" : "#ffb020"} /><path d={`M ${cx - 20} 440 Q ${cx - 22} ${440 - h * 0.3} ${cx} ${440 - h * 0.55} Q ${cx + 22} ${440 - h * 0.3} ${cx + 20} 440 Z`} fill="#fff3a0" /></g>;
      })}
      {Array.from({ length: 6 }, (_, i) => { const u = (t * 0.5 + i / 6) % 1; return <circle key={`h${i}`} cx={w / 2 + Math.sin(i * 2.1) * w * 0.35 + u * 60} cy={440 - 300 * k - u * 380} r={40 + u * 70} fill="#3a3040" opacity={0.55 * (1 - u) * k} />; })}
    </svg>
  );
};

// cubo de agua fría por la manga
const Cubo: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const u = t - t0;
  if (u < 0 || u > 1.3) return null;
  const tip = Math.min(1, u / 0.35);
  return (
    <svg style={{ position: "absolute", left: x - 80, top: y - 120, overflow: "visible" }} width={160} height={200}>
      <g transform={`translate(70 30) rotate(${tip * 120})`}><path d="M -30 -30 L 30 -30 L 24 30 L -24 30 Z" fill="#8a6a4a" stroke="#4e3622" strokeWidth={5} /><rect x={-32} y={-36} width={64} height={10} fill="#5a5a64" /></g>
      {u > 0.3 && Array.from({ length: 10 }, (_, i) => { const k = ((u - 0.3) * 2 + i / 10) % 1; return <ellipse key={i} cx={40 + (i % 4) * 10} cy={40 + k * 150} rx={6} ry={12} fill="#7fd6ff" opacity={1 - k} />; })}
    </svg>
  );
};

export const P4: React.FC<{ t: number }> = ({ t }) => {
  if (t < 342.6 || t > 439.5) return null;
  const fuego = t > 347.4 && t < 356.5 ? Math.min(prog(t, 347.4, 348.4), 1 - prog(t, 355.0, 356.5)) : 0;
  const fiebre = t > 381.6 && t < 396.5;
  const tarea = t < 388.6 ? -1 : t < 389.9 ? 0 : t < 390.86 ? 1 : t < 391.96 ? 2 : 3; // cavar, lavar, refinar, cargar
  const bx = barcoX(t);
  const smithX = 24000;
  const furiosos = t > 419.5 && t < 428.0;
  const mejoras = t > 428.8;
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM4} cielo={CIELO4}>
        <Base t={t} />
        {t < 346 && <En x={21300} w={900}><Poste t={t} t0={342.9} x={21300} y={AGUA + 20} n={4} titulo="THE GOLD" s={1.25} /></En>}
        {/* el incendio */}
        <En x={FX} w={1000}><Llamas t={t} x={FX} y={SUELO - 30} w={1500} k={fuego} /></En>
        {/* el barco de abastecimiento */}
        {t < 400 && <En x={bx} w={500}><Nave x={bx} y={AGUA - 120} t={t} tam={0.9} vela={t > 395.4 ? 1 : 0.3} nombre={t > 393.4 && t < 397.8 ? "TO LONDON →" : undefined} /></En>}
        {t > 393.0 && t < 400 && <En x={bx} w={500}><Pepitas t={t} x={bx - 40} y={AGUA - 140} n={22} w={300} seed={5} /></En>}
        {/* los recién llegados bajan del barco */}
        {t > 357.0 && t < 377.8 && NUEVOS.map(([x, of, t0], i) => {
          const xx = interpolate(t, [357.2 + i * 0.25, 359.6 + i * 0.25], [22700, x], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const perf = of === "PERFUMER";
          return (
            <En key={i} x={xx} w={250}>
              <Persona x={xx} y={SUELO} h={250} t={t} seed={400 + i} ropa={GENT(i)} gola gorro={perf ? "pluma" : i % 2 ? "copa" : "sombrero"} camina={t < 359.6 + i * 0.25 ? 1.5 : 0} expr={perf && t > 366.3 ? "orgullo" : t > 368.5 ? "sorpresa" : "neutro"}
                manoD={perf ? <g transform="scale(0.35)"><Frasco x={0} y={0} /></g> : undefined} bD={perf && t > 366 ? 70 : 0} />
              {t > t0 && (i === 0 || NUEVOS[i - 1][1] !== of) && <div style={{ position: "absolute", left: x - 150, top: SUELO - ([0, 0, 1, 0, 0, 1][i] ? 450 : 350), width: 300, textAlign: "center", transform: `scale(${ent(t, t0)})`, fontFamily, fontWeight: 700, fontSize: 48, color: "#fff", background: perf ? C.rosa : C.oro, borderRadius: 10, padding: "2px 0" }}>{of}</div>}
              {perf && t > 366.5 && <Olor t={t} x={x + 60} y={SUELO - 230} color="#ff8fc8" />}
            </En>
          );
        })}
        {t > 368.4 && t < 372.4 && <Mosquitos t={t} x={23300} y={SUELO - 360} n={12} r={240} seed={6} />}
        {/* la arena que brilla */}
        {t > 378.4 && t < 401.5 && <En x={22950} w={600}><Pepitas t={t} x={22950} y={SUELO - 6} n={34} w={420} seed={11} apaga={prog(t, 399.4, 400.8)} /></En>}
        {/* la fiebre: todos cavando, lavando, refinando, cargando */}
        {fiebre && FIEBRE.map((x, i) => {
          const k = tarea < 0 ? 0 : tarea;
          return (
            <En key={x} x={x} w={200}>
              <Persona x={x} y={SUELO} h={220} t={t} seed={420 + i} ropa={i % 3 === 0 ? GENT(i) : COLONO(i)} gola={i % 3 === 0} expr={t < 384 ? "sorpresa" : "feliz"} flip={i % 2 === 1}
                camina={t > 381.7 && t < 383.6 ? 2.2 : 0} salta={t > 382.4 && t < 383.6 ? Math.abs(Math.sin(t * 8 + i)) * 30 : 0}
                bD={k === 0 || k === 3 ? 60 + Math.abs(Math.sin(t * 7 + i)) * 60 : k === 1 ? 80 : 40} cD={30}
                manoD={k === 0 ? <g transform="scale(0.5) rotate(-90)"><rect x={-6} y={-10} width={12} height={140} fill="#8a5a2a" /><path d="M -26 120 L 26 120 L 22 170 Q 0 180 -22 170 Z" fill="#8a94a4" /></g> : k === 1 ? <ellipse cx={0} cy={10} rx={34} ry={12} fill="#5a5a64" /> : undefined} />
              {k === 2 && <Olla x={x + 60} y={SUELO - 50} s={0.22} t={t + i} dentro="nada" />}
              {k === 3 && <Barril x={x + 50} y={SUELO - 60} s={0.18} />}
              {t > 382.4 && t < 383.8 && <Emote t={t} t0={382.46 + i * 0.05} t1={383.8} tipo="brillos" x={cabeza(x, SUELO, 220).x} y={cabeza(x, SUELO, 220).y} s={0.5} />}
            </En>
          );
        })}
        {/* Smith, presidente: el cartel en la puerta */}
        {t > 405.4 && (
          <En x={smithX} w={300}>
            <Persona x={smithX} y={SUELO} h={300} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" gorro="morion" gola expr={t > 417.2 && t < 419.5 ? "enojado" : furiosos ? "orgullo" : "neutro"} habla={t > 414.4 && t < 419.2}
              bD={t > 417.2 && t < 419.3 ? 110 : 0} cD={t > 417.2 && t < 419.3 ? 30 : 0} flip={false} />
            {t > 410.7 && <svg style={{ position: "absolute", left: smithX - 60, top: SUELO - 230, overflow: "visible", opacity: ent(t, 410.96) }} width={120} height={120}><path d="M 10 0 L 110 110" stroke={C.oro} strokeWidth={22} /></svg>}
          </En>
        )}
        {t > 421.2 && <En x={24300} w={500}><Cartel x={24300} y={SUELO - 300} s={0.42} t={t} t0={416.3} titulo="NEW RULE" lineas={["HE THAT WILL", "NOT WORK", "SHALL NOT EAT"]} tl={[417.26, 417.7, 418.84]} /></En>}
        {/* los caballeros furiosos, con ampollas, insultando; agua fría por la manga */}
        {furiosos && [24180, 24330, 24480].map((x, i) => (
          <En key={x} x={x} w={200}>
            <Persona x={x} y={SUELO} h={250} t={t} seed={430 + i} ropa={GENT(i + 1)} gola gorro="pluma" capa="#2a1a3a" flip expr={t > 425.5 + i * 0.4 && t < 426.9 + i * 0.4 ? "sorpresa" : "enojado"} habla={t > 422.6 && t < 425}
              bD={t > 421.3 && t < 422.6 ? 100 : 0} cD={t > 421.3 && t < 422.6 ? 80 : 0} />
            {t > 422.6 && t < 425.4 && <div style={{ position: "absolute", left: x - 70, top: SUELO - 330, fontFamily, fontWeight: 700, fontSize: 34, color: C.rojo, background: "#fff", borderRadius: 12, padding: "0 10px", transform: `scale(${ent(t, 422.7 + i * 0.3)}) rotate(${Math.sin(t * 10 + i) * 6}deg)` }}>#@!%</div>}
            <Cubo t={t} t0={425.6 + i * 0.45} x={x + 10} y={SUELO - 230} />
          </En>
        ))}
        {/* bajo Smith: el pozo, casas, cultivos y maíz por comercio */}
        {mejoras && (
          <>
            <En x={23600} w={300}>
              <svg style={{ position: "absolute", left: 23600 - 90, top: SUELO - 170, overflow: "visible", transform: `scale(${ent(t, 430.2)})`, transformOrigin: "90px 170px" }} width={180} height={170}>
                <rect x={10} y={100} width={160} height={70} rx={10} fill="#8a8a94" stroke="#4a4a54" strokeWidth={6} />
                <rect x={20} y={0} width={12} height={110} fill="#6b3a1f" /><rect x={148} y={0} width={12} height={110} fill="#6b3a1f" /><path d="M 0 10 L 90 -40 L 180 10 Z" fill="#7a4a24" />
              </svg>
            </En>
            {[23150, 23330].map((x, i) => (
              <En key={x} x={x} w={250}>
                <svg style={{ position: "absolute", left: x - 100, top: SUELO - 170, overflow: "visible", transform: `scale(${ent(t, 430.86 + i * 0.2)})`, transformOrigin: "100px 170px" }} width={200} height={170}>
                  <rect x={10} y={60} width={180} height={110} fill="#a0703a" stroke="#5a3418" strokeWidth={6} />
                  {[0, 1, 2, 3].map((j) => <line key={j} x1={10} y1={80 + j * 24} x2={190} y2={80 + j * 24} stroke="#7a4a24" strokeWidth={4} />)}
                  <path d="M -6 64 L 100 0 L 206 64 Z" fill="#7a5a2a" /><rect x={80} y={110} width={40} height={60} fill="#3a2416" />
                </svg>
              </En>
            ))}
            <En x={22700} w={500}>
              <svg style={{ position: "absolute", left: 22480, top: SUELO - 40, overflow: "visible" }} width={10} height={10}>
                {Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => { const g = prog(t, 431.9 + c * 0.1, 433.2 + c * 0.1); return <path key={`${r}${c}`} d={`M ${c * 60 + r * 8} ${30 - r * 4} q -6 ${-30 * g} 0 ${-50 * g} q 6 ${20 * g} 0 ${50 * g}`} fill="#4aa040" />; }))}
              </svg>
            </En>
            {t > 432.6 && (
              <En x={24800} w={400}>
                <Persona x={24900} y={SUELO} h={260} t={t} seed={60} ropa={POW(0)} expr="feliz" flip plumaPelo />
                <Canasta x={24790} y={SUELO - 50} s={0.32} />
                <Cuentas x={24660} y={SUELO - 130} s={0.4} />
              </En>
            )}
            {t > 435.8 && [23900, 24600, 24700].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={230} t={t} seed={440 + i} ropa={COLONO(i)} expr="feliz" salta={Math.abs(Math.sin(t * 5 + i)) * 20} /></En>)}
          </>
        )}
      </Mundo>

      {/* pantalla */}
      {t < 347 && <Trampas t={t} t0={343.0} n={4} y={960} />}
      <Chip t={t} t0={345.1} t1={347.4} text="DAYS AFTER THE SHIP ARRIVES" color="#6a8ab8" x={960} y={140} centro size={52} />
      {t > 347.4 && t < 349.3 && <Grande t={t} t0={347.48} text="FIRE!" y={200} size={150} color={C.naranja} />}
      <Chip t={t} t0={349.58} t1={351.2} text="ALMOST EVERYTHING" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={351.32} t1={355.2} text="HOUSES" color={C.tierra} x={320} y={260} size={46} />
      <Chip t={t} t0={352.1} t1={355.2} text="FOOD" color={C.naranja} x={320} y={340} size={46} />
      <Chip t={t} t0={352.8} t1={355.2} text="CLOTHES" color={C.violeta} x={320} y={420} size={46} />
      <Chip t={t} t0={353.88} t1={355.2} text="THE MINISTER'S BOOKS" color="#5a3418" x={320} y={500} size={46} />
      <Chip t={t} t0={355.88} t1={357.0} text="IN THE MIDDLE OF WINTER" color="#6a8ab8" x={960} y={930} centro size={54} />
      <Chip t={t} t0={357.82} t1={361.9} text="WHO CAME ON THE SHIP?" color={C.violeta} x={960} y={140} centro size={56} />
      {t > 366.3 && t < 368.4 && <Grande t={t} t0={366.32} text="YES." y={200} size={140} color={C.ambar} />}
      <Chip t={t} t0={368.56} t1={371.3} text="STARVING SWAMP" color="#6a7a2a" x={960} y={930} centro size={58} />
      <Chip t={t} t0={370.04} t1={371.3} text="DYSENTERY" color="#7a5a2a" x={960} y={140} centro size={58} />
      {t > 371.4 && t < 372.5 && <Grande t={t} t0={371.96} text="PERFUME?!" y={930} size={120} color={C.rosa} />}
      {/* Londres a pantalla completa: los inversores quieren ganancia ya */}
      {t > 372.4 && t < 377.8 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", opacity: ent(t, 372.45) * (1 - prog(t, 377.4, 377.8)), background: "linear-gradient(#8f86a8, #c9bfd6 62%, #6a5a5a 62%)" }}>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            {Array.from({ length: 16 }, (_, i) => { const h = 180 + ((i * 53) % 140); return <rect key={i} x={i * 124 - 20} y={670 - h} width={118} height={h} fill={i % 2 ? "#5a4e6a" : "#4a4058"} />; })}
            <rect x={880} y={330} width={160} height={340} fill="#3e3450" /><ellipse cx={960} cy={330} rx={120} ry={110} fill="#4a4058" /><rect x={952} y={190} width={16} height={50} fill="#3e3450" />
            {Array.from({ length: 30 }, (_, i) => <rect key={`v${i}`} x={(i * 137) % 1900} y={480 + ((i * 71) % 160)} width={22} height={30} fill="#f7d47a" opacity={0.7} />)}
          </svg>
          <div style={{ position: "absolute", left: 0, top: 40, width: 1920, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 76, color: "#fff", WebkitTextStroke: "12px #1b1240", paintOrder: "stroke fill" }}>MEANWHILE, LONDON</div>
          {[420, 760, 1160, 1500].map((x, i) => <Persona key={x} x={x} y={1120} h={760} t={t} seed={120 + i} ropa={GENT(i)} gorro="copa" gola flip={i > 1} barba={i % 2 ? "#5a3a2a" : undefined} expr={t > 376 ? "enojado" : "orgullo"} habla={i === 1 && t > 375.4} mira={i > 1 ? -0.3 : 0.3} bD={i === 2 ? 120 + Math.sin(t * 6) * 20 : undefined} cD={i === 2 ? 30 : undefined} />)}
          <svg style={{ position: "absolute", left: 860, top: 860 }} width={220} height={200}>{Array.from({ length: 9 }, (_, k) => <ellipse key={k} cx={110} cy={180 - k * 16 * ent(t, 372.8 + k * 0.08)} rx={80} ry={18} fill="#ffd34a" stroke="#b07a10" strokeWidth={5} />)}</svg>
          {t > 375.4 && <Globo t={t} t0={375.46} x={760} y={300} text="PROFIT. FAST." size={72} />}
        </div>
      )}
      <Chip t={t} t0={379.06} t1={381.6} text="SHINY YELLOW FLAKES" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      {t > 382.4 && t < 384.0 && <Grande t={t} t0={382.46} text="GOLD FEVER" y={200} size={140} color={C.oro} />}
      {/* la queja de Smith */}
      {t > 384.0 && t < 392.9 && (
        <div style={{ position: "absolute", left: 1230, top: 110, width: 620, opacity: ent(t, 384.1) * (1 - prog(t, 392.4, 392.9)), background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 20, padding: "14px 22px", fontFamily, fontWeight: 700 }}>
          <div style={{ fontSize: 40, color: C.rojo }}>JOHN SMITH COMPLAINED:</div>
          <div style={{ position: "absolute", right: -30, bottom: -20, width: 220, height: 300, overflow: "hidden" }}><Persona x={110} y={300} h={300} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" gorro="morion" expr="enojado" habla flip /></div>
          {[["NO TALK", 386.16], ["NO HOPE", 386.6], ["NO WORK", 387.72]].map(([s, t0]) => <div key={s as string} style={{ fontSize: 52, color: "#8a8a94", opacity: t > (t0 as number) ? 1 : 0, textDecoration: "line-through" }}>{s}</div>)}
          {t > 388.58 && <div style={{ fontSize: 40, color: C.noche, marginTop: 6 }}>EXCEPT...</div>}
          {[["DIG GOLD", 388.7], ["WASH GOLD", 389.9], ["REFINE GOLD", 390.86], ["LOAD GOLD", 391.96]].map(([s, t0]) => <div key={s as string} style={{ fontSize: 54, color: "#c8901a", opacity: t > (t0 as number) ? 1 : 0, transform: `scale(${t > (t0 as number) ? ent(t, t0 as number) : 0})`, transformOrigin: "left" }}>{s}</div>)}
        </div>
      )}
      <Chip t={t} t0={393.42} t1={396.4} text="A WHOLE SHIP OF IT" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      {/* los expertos de Londres lo prueban */}
      {t > 397.0 && t < 401.4 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${1 - prog(t, 400.9, 401.4)})`, transformOrigin: "960px 500px" }}>
          <Lupa t={t} t0={397.16} x={960} y={480} r={300}>
            <div style={{ position: "absolute", inset: 0, background: "#3a2a1a" }} />
            <Pepitas t={t} x={300} y={330} n={20} w={360} seed={3} apaga={prog(t, 399.2, 400.3)} />
          </Lupa>
          <Chip t={t} t0={397.42} t1={401.4} text="LONDON EXPERTS TEST IT" color={C.violeta} x={960} y={110} centro size={52} />
          {t > 399.2 && <Grande t={t} t0={399.26} text="WORTHLESS" y={880} size={120} color="#ff5a6a" />}
        </div>
      )}
      {t > 400.3 && t < 401.6 && <Grande t={t} t0={400.34} text="FOOL'S GOLD" y={300} size={150} color={C.oro} />}
      {/* el reloj de arena: las semanas de siembra que se van mientras cargan arena */}
      {t > 401.3 && t < 405.6 && (() => {
        const e = ent(t, 401.4) * (1 - prog(t, 405.2, 405.6));
        const u = prog(t, 401.6, 404.8);
        return (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(27,18,64,.5)", opacity: e }} />
            <svg style={{ position: "absolute", left: 760, top: 250, transform: `scale(${e})`, transformOrigin: "200px 260px" }} width={400} height={520} viewBox="-200 -260 400 520">
              <rect x={-170} y={-250} width={340} height={34} rx={14} fill="#8a5228" stroke="#3a1e0c" strokeWidth={8} />
              <rect x={-170} y={216} width={340} height={34} rx={14} fill="#8a5228" stroke="#3a1e0c" strokeWidth={8} />
              <path d="M -130 -216 L 130 -216 Q 130 -60 14 0 Q 130 60 130 216 L -130 216 Q -130 60 -14 0 Q -130 -60 -130 -216 Z" fill="rgba(220,240,255,.35)" stroke="#fff" strokeWidth={10} />
              <path d={`M ${-120 + 100 * u} ${-200 + 190 * u} L ${120 - 100 * u} ${-200 + 190 * u} L 0 -6 Z`} fill="#4aa040" />
              <path d={`M -120 206 L 120 206 L ${120 - 90 * u} ${206 - 150 * u} L ${-120 + 90 * u} ${206 - 150 * u} Z`} fill="#e8d090" />
              <rect x={-5} y={-6} width={10} height={206 - 150 * u} fill="#e8d090" opacity={u < 1 ? 1 : 0} />
            </svg>
            {Array.from({ length: 6 }, (_, i) => {
              const on = t > 401.8 + i * 0.45;
              return <div key={i} style={{ position: "absolute", left: 300 + i * 230, top: 830, transform: `translate(-50%,0) scale(${e})`, width: 190, padding: "6px 0", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: on ? "#8a8a94" : C.noche, background: "#fff3d6", border: "6px solid #2a1408", borderRadius: 14, textDecoration: on ? "line-through" : "none", textDecorationColor: C.rojo, textDecorationThickness: 8 }}>WEEK {i + 1}</div>;
            })}
          </div>
        );
      })()}
      <Chip t={t} t0={401.42} t1={403.9} text="WEEKS OF PLANTING SEASON" color={C.lima} tinta={C.noche} x={960} y={140} centro size={54} />
      <Chip t={t} t0={403.18} t1={403.9} text="→ GONE" color={C.rojo} x={960} y={220} centro size={54} />
      {t > 404.0 && t < 405.4 && <Grande t={t} t0={404.12} text="FOR SAND" y={180} size={130} color="#e8d090" />}
      <Chip t={t} t0={406.4} t1={408.4} text="ONE MAN REFUSES" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={408.5} t1={410.7} text="JOHN SMITH" color={C.rojo} x={960} y={140} centro size={60} />
      <Chip t={t} t0={409.6} t1={410.7} text="FORMER PRISONER" color="#6a6a7a" x={960} y={220} centro size={46} />
      {t > 410.7 && t < 412.6 && <Grande t={t} t0={410.96} text="PRESIDENT" y={200} size={130} color={C.oro} />}
      <Chip t={t} t0={412.64} t1={414.4} text="AUTUMN 1608" color={C.naranja} x={960} y={140} centro size={56} />
      <Chip t={t} t0={415.1} t1={416.3} text="ONE SIMPLE RULE" color={C.violeta} x={960} y={930} centro size={52} />
      <Chip t={t} t0={415.84} t1={416.3} text="UNPOPULAR" color={C.rojo} x={960} y={1010} centro size={40} />
      {t > 419.6 && t < 421.3 && <Grande t={t} t0={420.4} text="FURIOUS" y={930} size={120} color="#ff5a6a" />}
      <Chip t={t} t0={421.6} t1={422.6} text="BLISTERS" color={C.rosa} x={960} y={140} centro size={56} />
      <Chip t={t} t0={424.62} t1={427.6} text="COLD WATER, EVERY CURSE" color="#2a7ac8" x={960} y={140} centro size={54} />
      {t > 416.3 && t < 421.4 && (
        <div style={{ position: "absolute", left: 960, top: 150, width: 860, transform: `scale(${ent(t, 416.35) * (1 - prog(t, 421.0, 421.4))}) rotate(-1deg)`, transformOrigin: "50% 0", background: "#f4e6c4", border: "10px solid #8a6a3a", borderRadius: 18, padding: "14px 28px", fontFamily, fontWeight: 700, textAlign: "center" }}>
          <div style={{ fontSize: 40, color: "#7a1a24" }}>SMITH'S NEW RULE</div>
          <div style={{ fontSize: 68, color: C.noche, lineHeight: 1.05 }}>HE THAT WILL NOT WORK</div>
          <div style={{ fontSize: 68, color: C.rojo, lineHeight: 1.05, opacity: prog(t, 418.7, 419.0) }}>SHALL NOT EAT</div>
        </div>
      )}
      {t > 427.8 && t < 428.9 && <Grande t={t} t0={428.06} text="IT WORKS" y={200} size={130} color={C.lima} />}
      <Chip t={t} t0={430.22} t1={433.9} text="A WELL" color="#6a6a7a" x={300} y={160} size={46} />
      <Chip t={t} t0={431.02} t1={433.9} text="HOUSES" color={C.tierra} x={300} y={240} size={46} />
      <Chip t={t} t0={432.04} t1={433.9} text="CROPS" color={C.lima} tinta={C.noche} x={300} y={320} size={46} />
      <Chip t={t} t0={433.22} t1={433.9} text="CORN TRADE" color={C.oro} tinta={C.noche} x={300} y={400} size={46} />
      {/* las muertes bajan */}
      {t > 434.0 && t < 439.2 && (
        <svg style={{ position: "absolute", left: 1220, top: 140, opacity: ent(t, 434.1), transform: "scale(1.25)", transformOrigin: "100% 0" }} width={520} height={330}>
          <rect width={520} height={330} rx={24} fill="#fff3d6" stroke="#2a1408" strokeWidth={8} />
          <text x={260} y={56} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={48} fill={C.noche}>DEATHS</text>
          <path d={`M 50 90 L 140 110 L 230 100 ${prog(t, 434.56, 435.6) > 0 ? `L ${230 + 240 * prog(t, 434.56, 435.6)} ${100 + 170 * prog(t, 434.56, 435.6)}` : ""}`} stroke={C.rojo} strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      )}
      {t > 437.4 && <Grande t={t} t0={437.44} text="IT MIGHT MAKE IT" y={930} size={100} color={C.lima} />}
      {(t > 347.4 && t < 356.5) && <div style={{ position: "absolute", left: 0, top: 0 }}><Particulas t={t} tipo="brasas" n={40} seed={8} /></div>}
      {t < 377 && t > 342.6 && <Nieve t={t} n={50} op={0.6 * (1 - prog(t, 376, 377))} />}
    </AbsoluteFill>
  );
};
