import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, Zzz } from "./kit";
import { Lluvia } from "./kit2";
import { Persona, Expr, Ropa } from "./persona";
import { CamP, Llave, aPantalla } from "./mundo";
import { CHICO, SENOR, DAMA, SIERVO, Perro, Rata, Manta } from "./objetos";
import { TarjetaTrampa, Inserto, Yo } from "./comun";

// TRAMPA 3 · EL FRÍO (281,6-415,5 s). El solar de las películas (para el señor) contra el piso del salón: banco,
// colchón de paja o piso; los juncos de Erasmo con 20 años de mugre; los perros y su lugar tibio; 30 personas;
// muros de 7 m que devuelven el frío; postigos; la Pequeña Edad de Hielo; y vos lejos del fuego que se apaga.
export const T0 = 281.6, T1 = 415.5;
export const CAM: Llave[] = [
  [284.0, 5300, 2800, 1.3], [285.4, 5300, 2700, 0.95], [287.6, 5400, 1520, 0.85], [296.9, 5300, 1540, 0.9],
  [298.3, 5100, 2780, 1.35], [300.2, 5100, 2780, 1.35], [301.6, 5800, 2640, 0.62], [303.0, 5300, 2780, 1.1], [308.2, 5500, 2800, 1.0],
  [309.4, 5150, 2900, 1.5], [310.6, 5150, 2930, 2.1], [318.3, 5250, 2930, 2.0],
  [342.2, 5150, 2880, 1.5], [344.4, 5250, 2850, 1.2], [349.6, 5500, 2850, 1.15], [354.4, 6200, 2800, 1.15],
  [355.8, 5800, 2640, 0.62], [363.4, 5800, 2640, 0.64], [365.0, 4800, 2650, 1.0], [375.6, 4850, 2650, 1.05],
  [377.0, 6700, 1350, 1.15], [380.3, 6700, 1360, 1.15], [381.6, 5150, 2330, 1.55], [390.8, 5200, 2380, 1.35],
  [392.0, 5400, 2500, 0.8], [405.0, 5400, 2650, 0.8], [406.6, 5500, 2850, 1.0], [413.0, 5450, 2860, 1.05], [415.4, 5150, 2900, 1.5],
];
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PISO = 2965;
const ERASMO: Ropa = { tunica: "#2a2a3a", tunica2: "#14141f", cinto: "#2a2a3a", piel: "#f2c4a0", piel2: "#d99d7a", pelo: "#5a4a3a" };

// persona acostada: el rig girado 90° con los pies en (x, y)
export const Acostado: React.FC<{ x: number; y: number; h: number; t: number; seed: number; ropa: Ropa; expr?: Expr; flip?: boolean }> = ({ x, y, h, t, seed, ropa, expr = "dormido", flip }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${x}px ${y}px`, transform: `translateY(${-h * 0.13}px) rotate(${flip ? 90 : -90}deg)` }}>
    <Persona x={x} y={y} h={h} t={t} seed={seed} ropa={ropa} expr={expr} />
  </div>
);

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t < T0 - 1 || t > T1 + 1) return null;
  const enSuelo = t > 307.6;
  const dormidos = t > 349;
  const exprChico: Expr = t < 297 ? "neutro" : t < 307.6 ? "feliz" : t < 318 ? "sorpresa" : t < 342 ? "miedo" : t < 349 ? "enojado" : t < 406 ? "triste" : t < 413.7 ? "dormido" : "sorpresa";
  return (
    <>
      {/* el solar: el señor y la señora (lo de las películas) */}
      {t > 292 && t < 298.5 && (
        <>
          <Persona x={5450} y={1950} h={330} t={t} seed={61} ropa={SENOR} expr="orgullo" aparece={293.35} />
          <Persona x={5620} y={1950} h={320} t={t} seed={62} ropa={DAMA} expr="feliz" aparece={293.9} flip />
        </>
      )}
      {/* banco (con suerte), colchón de paja (más suerte), piso (nuevo) */}
      {t > 301 && t < 349.5 && (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            <rect x={5480} y={2930} width={300} height={30} rx={10} fill="#c9a24a" opacity={ent(t, 304.8)} />
            {Array.from({ length: 8 }, (_, i) => <line key={i} x1={5490 + i * 38} y1={2935} x2={5500 + i * 38} y2={2955} stroke="#a07a2a" strokeWidth={4} opacity={ent(t, 304.8)} />)}
          </svg>
          {t > 303 && <Acostado x={5000} y={2905} h={240} t={t} seed={72} ropa={SIERVO(2)} />}
          {t > 304.9 && <Acostado x={5510} y={2935} h={250} t={t} seed={73} ropa={SIERVO(4)} />}
        </>
      )}
      {/* vos: parado hasta que te toca el piso; después acostado sobre los juncos */}
      {!enSuelo ? (
        <Persona x={5100} y={PISO} h={280} t={t} seed={7} ropa={CHICO} expr={exprChico} mira={t > 287 && t < 297 ? 0 : 0.3} miraY={t > 287 && t < 297 ? -1 : 0} />
      ) : (
        <>
          <Acostado x={5200} y={PISO - 10} h={260} t={t} seed={7} ropa={CHICO} expr={exprChico} />
          {t > 406.8 && <Manta x={5085} y={PISO - 30} s={0.8} t={t} t0={406.9} w={300} />}
        </>
      )}
      {/* los perros del señor: entran y reclaman el lugar tibio */}
      {t > 344.4 && t < 416 && (
        <>
          <Perro x={interpolate(t, [344.6, 347.0], [4650, 5560], cl)} y={PISO - 60} s={0.85} t={t} camina={t < 347 ? 1.6 : 0} ladra={347.5} duerme={t > 360} />
          <Perro x={interpolate(t, [345.2, 348.8], [4600, 5980], cl)} y={PISO - 60} s={0.8} t={t} camina={t < 348.8 ? 1.6 : 0} color="#5a4a3a" duerme={t > 356} />
          {t > 357 && [6150, 6300, 4990].map((x, i) => <Perro key={i} x={x} y={PISO - 60} s={0.75} t={t} duerme color={["#c9a36a", "#7a4a22", "#3a3a48"][i]} />)}
          {t > 360.4 && t < 364 && <Rata x={interpolate(t, [360.4, 362.4], [4600, 5450], cl)} y={PISO - 24} s={0.5} t={t} />}
        </>
      )}
      {/* el resto del salón duerme: roncar, toser, seguir comiendo */}
      {dormidos && (
        <>
          {[[5850, 1], [6100, 3], [6450, 5], [6700, 6]].map(([x, r], i) => <Acostado key={i} x={x} y={PISO - 10} h={260} t={t} seed={80 + i} ropa={SIERVO(r)} flip={i % 2 === 1} />)}
          {t > 351.8 && t < 353.4 && <Persona x={6350} y={PISO} h={300} t={t} seed={88} ropa={SIERVO(7)} expr="enojado" inclina={Math.sin(t * 20) * 6} />}
          {t > 353.0 && t < 355 && <Persona x={6560} y={PISO} h={300} t={t} seed={89} ropa={SIERVO(0)} expr="feliz" habla bD={110} cD={120} />}
          {/* los viejos criados, pegados al fuego */}
          {t > 405 && [5650, 5980].map((x, i) => <Acostado key={i} x={x} y={PISO - 10} h={280} t={t} seed={95 + i} ropa={SIERVO(i + 5)} flip={i === 1} />)}
        </>
      )}
    </>
  );
};

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t < T0 - 0.5 || t > T1 + 0.6) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const boy = P(5100, PISO);
  const piso = P(5150, 2960);
  const muro = P(4370, 2500);
  const frio = t > 361.8 && t < 376 ? Math.min(1, prog(t, 362.6, 363.6)) * (1 - prog(t, 375.4, 376)) : 0;
  return (
    <>
      <TarjetaTrampa t={t} t0={281.64} t1={284.2} n={3} nombre="THE COLD" hora="8 PM" color={C.teal} />
      {/* el solar de las películas */}
      <Chip t={t} t0={285.19} t1={287.5} text="CASTLE BEDROOMS IN THE MOVIES" color={C.violeta} x={960} y={140} centro size={54} />
      {["FOUR-POSTER BED", "THICK CURTAINS", "ROARING FIRE"].map((k, i) => {
        const p = [P(5600, 1360), P(5850, 1700), P(4850, 1800)][i];
        return <Chip key={k} t={t} t0={[288.19, 289.61, 290.73][i]} t1={296.8} text={`✓ ${k}`} color={C.lima} tinta={C.noche} x={p.x} y={p.y} centro size={46} />;
      })}
      <Chip t={t} t0={292.11} t1={296.8} text="THEY DID EXIST…" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={293.35} t1={296.8} text="FOR THE LORD + LADY" color={C.rojo} x={960} y={950} centro size={58} />
      {t >= 296.82 && t < 297.9 && <Grande t={t} t0={296.82} text="THE SOLAR" y={300} size={150} color={C.oro} />}
      {/* vos no */}
      <Chip t={t} t0={297.81} t1={300.2} text="NOT THE LORD" color={C.rojo} x={boy.x + 140} y={boy.y - 400} size={56} />
      <Chip t={t} t0={299.17} t1={300.2} text="YOU ARE 14" color={C.lima} tinta={C.noche} x={boy.x + 140} y={boy.y - 300} size={56} />
      <Chip t={t} t0={300.37} t1={302.8} text="YOU SLEEP IN THE GREAT HALL" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={301.79} t1={302.8} text="WITH EVERYBODY" color={C.ambar} tinta={C.noche} x={960} y={950} centro size={56} />
      {/* banco / colchón / piso */}
      {([["BENCH", "LUCKY", 303.17, C.teal], ["STRAW MATTRESS", "LUCKIER", 305.02, C.oro], ["THE FLOOR", "NEW", 308.55, C.rojo]] as const).map(([k, l, t0, col], i) =>
        t > t0 - 0.05 && t < 309.3 ? (
          <div key={i} style={{ position: "absolute", left: 140, top: 150 + i * 120, transform: `translateX(${(1 - ent(t, t0)) * -900}px)`, fontFamily, fontWeight: 700, fontSize: 64, color: "#fff", WebkitTextStroke: `8px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
            {k} <span style={{ color: col, fontSize: 48 }}>= {l}</span>
          </div>
        ) : null,
      )}
      {t >= 308.55 && t < 309.5 && <Grande t={t} t0={308.55} text="FLOOR." x={1350} y={330} size={150} color={C.rojo} />}
      {/* los juncos */}
      <Chip t={t} t0={310.14} t1={318.3} text="COVERED IN RUSHES" color={C.lima} tinta={C.noche} x={960} y={140} centro size={60} />
      <Chip t={t} t0={311.43} t1={318.3} text="SAME PLANT AS YOUR NIGHT LIGHT" color={C.ambar} tinta={C.noche} x={960} y={240} centro size={48} />
      {t > 315.9 && t < 318.4 && Array.from({ length: 10 }, (_, i) => {
        const p = P(5000 + i * 40, 2950);
        return <div key={i} style={{ position: "absolute", left: p.x, top: p.y - 30 - (i % 3) * 20, transform: `translate(-50%,-50%) scale(${ent(t, 316.0 + i * 0.05)})`, fontSize: 40 }}>{["🌸", "🌿", "🌼"][i % 3]}</div>;
      })}
      <Chip t={t} t0={316.14} t1={318.3} text="+ SWEET HERBS" color={C.rosa} x={960} y={950} centro size={56} />
      {t >= 317.26 && t < 318.4 && <Grande t={t} t0={317.26} text="SOUNDS PLEASANT…" y={500} size={110} color={C.crema} />}
      {/* inserto: Erasmo y el corte de los juncos — nace del piso */}
      <Inserto t={t} t0={318.5} t1={342.0} ix={piso.x} iy={piso.y} fondo="#c9a24a" fondo2="#5a3418">
        {t < 325.6 ? (
          <>
            <Persona x={560} y={980} h={640} t={t} seed={45} ropa={ERASMO} expr="enojado" aparece={318.7} habla={t > 325} bD={60} cD={110} />
            <svg style={{ position: "absolute", left: 560 - 110, top: 980 - 640 * 0.98 - 20, overflow: "visible", transform: `scale(${ent(t, 318.9)})` }} width={220} height={80}><path d="M 10 70 Q 10 0 110 0 Q 210 0 210 70 Z" fill="#14141f" /></svg>
            <Chip t={t} t0={319.25} text="ERASMUS" color={C.noche} x={960} y={200} size={90} />
            <Chip t={t} t0={319.52} text="DUTCH SCHOLAR" color={C.violeta} x={960} y={330} size={54} />
            <Chip t={t} t0={321.2} text="VISITED ENGLISH HOUSES" color={C.teal} tinta={C.noche} x={960} y={430} size={50} />
            {t >= 322.29 && <Grande t={t} t0={322.29} text="~200 YEARS LATER" x={1300} y={640} size={100} color={C.crema} />}
            <Chip t={t} t0={323.82} text="NOT MUCH HAD CHANGED" color={C.rojo} x={960} y={800} size={50} />
          </>
        ) : (
          <>
            {/* corte de los juncos: capas que crecen con los años */}
            {Array.from({ length: 10 }, (_, i) => {
              const sube = prog(t, 328.3 + i * 0.32, 328.6 + i * 0.32);
              return <div key={i} style={{ position: "absolute", left: 160, right: 160, top: 960 - (i + 1) * 60 * sube, height: 60 * sube, background: ["#8a6a3a", "#7a5a2a", "#9a7a3a", "#6a4a22", "#8a6a2a"][i % 5], borderTop: "4px solid rgba(255,255,255,.25)" }} />;
            })}
            <div style={{ position: "absolute", left: 160, right: 160, top: 960, height: 70, background: "#6b6b7a" }} />
            <Acostado x={760} y={958 - 600 * prog(t, 328.3, 331.6)} h={300} t={t} seed={7} ropa={CHICO} expr={t > 339.9 ? "miedo" : t > 335.2 ? "sorpresa" : "dormido"} />
            <div style={{ position: "absolute", left: 1600, top: 970, fontFamily, fontWeight: 700, fontSize: 40, color: "#fff" }}>STONE</div>
            <Chip t={t} t0={325.94} text="FLOORS COVERED IN RUSHES" color={C.noche} x={160} y={110} size={50} />
            <Chip t={t} t0={327.76} text="ONLY TOPPED UP" color={C.ambar} tinta={C.noche} x={160} y={200} size={50} />
            {t > 331.6 && <div style={{ position: "absolute", left: 1450, top: 200, transform: `translate(-50%,-50%) scale(${ent(t, 331.64, 0, { damping: 8, stiffness: 220 })})`, fontFamily, fontWeight: 700, fontSize: 140, color: C.crema, WebkitTextStroke: `12px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{Math.round(interpolate(t, [331.64, 332.6], [1, 20], cl))} YEARS</div>}
            {/* lo que hay adentro, cayendo y quedando enterrado */}
            {([["🍺 BEER", 335.2], ["🧈 GREASE", 336.35], ["🍖 FOOD SCRAPS", 337.08], ["🦴 BONES", 337.96], ["💦 SPIT", 339.31], ["🐕 DOG URINE", 339.99], ["🧍 …AND MEN'S", 341.06]] as const).map(([k, t0], i) => {
              const y = interpolate(t, [t0, t0 + 0.35], [-100, 380 + (i % 2) * 130], cl);
              return t > t0 ? <div key={k} style={{ position: "absolute", left: 200 + i * 225, top: y, transform: `rotate(${i % 2 ? 6 : -6}deg)`, background: "#fff6e0", border: `6px solid ${C.noche}`, borderRadius: 16, padding: "6px 14px", fontFamily, fontWeight: 700, fontSize: 32, color: C.noche, whiteSpace: "nowrap" }}>{k}</div> : null;
            })}
            {t >= 334.19 && t < 335.2 && <Grande t={t} t0={334.19} text="AN ANCIENT COLLECTION" y={420} size={90} color={C.crema} />}
            {t > 339.9 && <Emote t={t} t0={340.0} tipo="susto" x={1700} y={330} s={1.6} />}
          </>
        )}
      </Inserto>
      {/* tu colchón */}
      {t >= 342.26 && t < 344.4 && <Grande t={t} t0={342.26} text="YOUR MATTRESS" y={200} size={120} color={C.crema} />}
      <Chip t={t} t0={343.58} t1={345} text="NOT ALONE ON IT" color={C.rojo} x={960} y={950} centro size={58} />
      <Chip t={t} t0={344.7} t1={349.8} text="THE LORD'S HUNTING DOGS" color={C.tierra} x={160} y={150} size={56} />
      <Chip t={t} t0={347.43} t1={349.8} text="HAVE OPINIONS" color={C.rojo} x={160} y={260} size={56} />
      {t > 347.4 && t < 349.6 && <Emote t={t} t0={347.5} tipo="enojo" x={P(5560, PISO - 140).x} y={P(5560, PISO - 140).y} s={1.3} />}
      <Chip t={t} t0={348.81} t1={349.8} text="WHO GETS THE WARM SPOT" color={C.oro} tinta={C.noche} x={960} y={950} centro size={56} />
      {/* ronquidos, tos, sigue comiendo */}
      {t > 350.5 && t < 355 && <Zzz x={P(5850, PISO - 200).x} y={P(5850, PISO - 200).y} t={t} />}
      <Chip t={t} t0={350.73} t1={355} text="SNORING" color={C.violeta} x={P(5850, 2600).x} y={P(5850, 2600).y} centro size={44} />
      <Chip t={t} t0={351.99} t1={355} text="COUGHING" color={C.teal} tinta={C.noche} x={P(6350, 2560).x} y={P(6350, 2560).y} centro size={44} />
      <Chip t={t} t0={353.56} t1={355} text="STILL EATING" color={C.ambar} tinta={C.noche} x={P(6560, 2480).x} y={P(6560, 2480).y} centro size={44} />
      {/* la cuenta del salón */}
      {t > 357.9 && t < 363.5 && <div style={{ position: "absolute", left: 960, top: 180, transform: `translate(-50%,-50%) scale(${ent(t, 357.93)})`, fontFamily, fontWeight: 700, fontSize: 110, color: C.crema, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{Math.round(interpolate(t, [357.93, 358.8], [1, 30], cl))} PEOPLE</div>}
      {t > 359.1 && t < 363.5 && <div style={{ position: "absolute", left: 960, top: 320, transform: `translate(-50%,-50%) scale(${ent(t, 359.11)})`, fontFamily, fontWeight: 700, fontSize: 90, color: C.tierra, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>+ {Math.round(interpolate(t, [359.11, 359.8], [1, 12], cl))} DOGS</div>}
      <Chip t={t} t0={360.38} t1={363.5} text="+ WHATEVER THE DOGS BROUGHT IN" color={C.rojo} x={960} y={950} centro size={50} />
      {t >= 362.94 && t < 364.4 && <Grande t={t} t0={362.94} text="…AND THE COLD" y={500} size={140} color="#bfefff" />}
      {/* escarcha en los bordes mientras hablamos del frío */}
      {frio > 0 && <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${220 * frio}px ${80 * frio}px rgba(190,235,255,${0.55 * frio})`, pointerEvents: "none" }} />}
      {/* inserto: el muro en corte, 3 → 4 → casi 7 m, con una persona para la escala — nace de la pared del salón */}
      <Inserto t={t} t0={364.0} t1={376.1} ix={muro.x} iy={muro.y} fondo="#3d4a7a" fondo2="#0e0a2a">
        {(() => {
          const m = t < 365.79 ? 3 : t < 366.43 ? interpolate(t, [365.6, 365.9], [3, 4], cl) : interpolate(t, [366.9, 367.6], [4, 6.8], cl);
          const W = m * 125, x0 = 200;
          return (
            <>
              <div style={{ position: "absolute", left: x0, top: 300, width: W, height: 660, background: "repeating-linear-gradient(0deg,#7a7a92 0 76px,#5a5a72 76px 82px)", borderRadius: 8, boxShadow: "inset 0 0 0 8px #3a3a52" }} />
              <div style={{ position: "absolute", left: x0, top: 230, width: W, height: 16, background: C.oro, borderRadius: 8 }} />
              <div style={{ position: "absolute", left: x0 + W / 2, top: 140, transform: "translateX(-50%)", fontFamily, fontWeight: 700, fontSize: 90, color: "#fff", WebkitTextStroke: `9px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{m < 6.5 ? `${Math.round(m)} M` : "~7 M"}</div>
              <div style={{ position: "absolute", left: t > 371.7 ? Math.sin(t * 70) * 4 : 0, top: 0 }}><Persona x={x0 + W + 170} y={960} h={420} t={t} seed={7} ropa={CHICO} expr={t < 370.3 ? "sorpresa" : "miedo"} mira={-1} bI={t > 371.7 ? 150 : 10} cI={t > 371.7 ? 150 : 10} bD={t > 371.7 ? 150 : 10} cD={t > 371.7 ? 150 : 10} /></div>
              {t > 371.7 && [0, 1, 2, 3].map((i) => { const u = ((t - 371.7) * 0.7 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: x0 + W - 40 + u * 220, top: 400 + i * 130, fontFamily, fontWeight: 700, fontSize: 90, color: "#9fe0ff", opacity: Math.sin(u * Math.PI) }}>❄</div>; })}
            </>
          );
        })()}
        <Chip t={t} t0={364.0} text="CASTLE WALLS" color={C.violeta} x={1500} y={140} centro size={56} />
        <Chip t={t} t0={368.67} text="✓ GREAT AGAINST A SIEGE" color={C.lima} tinta={C.noche} x={1500} y={330} centro size={44} />
        <Chip t={t} t0={370.35} text="✗ TERRIBLE AT NIGHT" color={C.rojo} x={1500} y={430} centro size={44} />
        <Chip t={t} t0={371.79} text="STONE SOAKS UP COLD" color={C.teal} tinta={C.noche} x={1500} y={580} centro size={44} />
        <Chip t={t} t0={373.75} text="…GIVES IT BACK ALL NIGHT" color="#bfefff" tinta={C.noche} x={1500} y={680} centro size={42} />
      </Inserto>
      {/* vidrio: sólo reyes e iglesias */}
      <Chip t={t} t0={376.23} t1={380.4} text="GLASS WINDOWS" color={C.teal} tinta={C.noche} x={960} y={140} centro size={62} />
      <Chip t={t} t0={378.5} t1={380.4} text="LUXURY: KINGS + CHURCHES" color={C.oro} tinta={C.noche} x={960} y={950} centro size={56} />
      {t > 377 && t < 380.4 && <Emote t={t} t0={377.2} tipo="brillos" x={P(6700, 1300).x + 220} y={P(6700, 1300).y + 160} s={1.6} />}
      {/* postigos */}
      <Chip t={t} t0={382.08} t1={386.3} text="WOODEN SHUTTERS" color={C.tierra} x={160} y={150} size={58} />
      <Chip t={t} t0={383.67} t1={386.3} text="+ OILED LINEN (MAYBE)" color={C.ambar} tinta={C.noche} x={160} y={260} size={50} />
      {t > 385.7 && t < 388.3 && <div style={{ position: "absolute", inset: 0, background: "#05030f", opacity: 0.85 * prog(t, 385.7, 386.0) * (1 - prog(t, 387.9, 388.3)) }} />}
      <Chip t={t} t0={385.7} t1={387.4} text="CLOSED = DARK" color={C.noche} x={960} y={540} centro size={80} />
      <Chip t={t} t0={388.58} t1={391.0} text="OPEN = THE WIND" color={C.teal} tinta={C.noche} x={960} y={150} centro size={70} />
      <Chip t={t} t0={390.11} t1={391.6} text="STRAIGHT OFF THE MOORS" color="#bfefff" tinta={C.noche} x={960} y={950} centro size={54} />
      {t > 388.2 && t < 391.5 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {Array.from({ length: 9 }, (_, i) => { const u = ((t - 388.2) * 0.9 + i / 9) % 1; return <path key={i} d={`M ${-200 + u * 2300} ${250 + i * 80} q 80 -40 160 0 t 160 0`} stroke="#e6f8ff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8 * Math.sin(u * Math.PI)} />; })}
        </svg>
      )}
      {/* inserto: la Pequeña Edad de Hielo y la Gran Hambruna — nace de la saetera abierta */}
      <Inserto t={t} t0={391.6} t1={405.2} ix={P(5150, 2300).x} iy={P(5150, 2300).y} fondo="#7fb8e0" fondo2="#1d2a5a">
        {t < 398.2 ? (
          <>
            <svg style={{ position: "absolute", left: 300, top: 160 }} width={200} height={800} viewBox="-100 -400 200 800">
              <rect x={-40} y={-380} width={80} height={660} rx={40} fill="#fff" stroke={C.noche} strokeWidth={10} />
              <circle cx={0} cy={320} r={80} fill={C.rojo} stroke={C.noche} strokeWidth={10} />
              <rect x={-22} y={interpolate(t, [392.4, 395.4], [-300, 180], cl)} width={44} height={320 - interpolate(t, [392.4, 395.4], [-300, 180], cl)} fill={C.rojo} />
            </svg>
            <Chip t={t} t0={391.94} text="THE START OF" color={C.violeta} x={640} y={200} size={44} />
            <Chip t={t} t0={392.55} text="WHAT CLIMATE HISTORIANS CALL…" color={C.noche} x={640} y={290} size={50} />
            {t >= 394.26 && <Grande t={t} t0={394.26} text="THE LITTLE ICE AGE" x={1020} y={560} size={110} color="#e6f8ff" />}
            <Yo t={t} t0={392.0} x={1730} h={520} y={1060} expr="miedo" tiembla bD={150} cD={150} bI={150} cI={150} ropa={{ ...CHICO, piel: "#c8e6f5", piel2: "#9cc8e0" }} />
            {t > 394 && Array.from({ length: 30 }, (_, i) => { const u = (t * 0.3 + i / 30) % 1; return <div key={i} style={{ position: "absolute", left: (i * 137) % 1920, top: u * 1080, width: 12, height: 12, borderRadius: 6, background: "#fff", opacity: 0.8 }} />; })}
          </>
        ) : (
          <>
            <Lluvia t={t} n={140} angulo={14} op={0.7} />
            <div style={{ position: "absolute", left: 960, top: 170, transform: `translate(-50%,-50%) scale(${ent(t, 396.94)})`, fontFamily, fontWeight: 700, fontSize: 140, color: C.crema, WebkitTextStroke: `12px ${C.noche}`, paintOrder: "stroke fill" }}>1315</div>
            {["SUMMER 1", "SUMMER 2", "SUMMER 3"].map((k, i) => (
              <div key={k} style={{ position: "absolute", left: 300 + i * 460, top: 380, width: 400, height: 240, borderRadius: 26, background: "#2d4a7a", border: `10px solid ${C.noche}`, transform: `scale(${ent(t, 399.73 + i * 0.3)})` }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontSize: 100 }}>🌧️</div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: "#fff" }}>{k}</div>
              </div>
            ))}
            <Chip t={t} t0={398.76} text="THE RAIN WILL NOT STOP" color={C.teal} tinta={C.noche} x={960} y={300} centro size={54} />
            {t >= 401.62 && <Grande t={t} t0={401.62} text="THE GREAT FAMINE" y={780} size={130} color={C.rojo} />}
            <Chip t={t} t0={402.73} text="MILLIONS DEAD · NORTHERN EUROPE" color={C.crema} tinta={C.noche} x={960} y={930} centro size={52} />
          </>
        )}
      </Inserto>
      {/* vos bajo la manta, lejos del fuego que se muere */}
      <Chip t={t} t0={405.81} t1={409.4} text="ON THE RUSHES" color={C.lima} tinta={C.noche} x={160} y={150} size={54} />
      <Chip t={t} t0={406.99} t1={409.4} text="ROUGH WOOL BLANKET" color={C.tierra} x={160} y={260} size={54} />
      <Chip t={t} t0={409.2} t1={413.6} text="THE DYING FIRE" color={C.naranja} x={P(5800, 2700).x} y={P(5800, 2700).y} centro size={50} />
      {t > 410.2 && t < 413.6 && (() => {
        const a = P(5240, 2880), b = P(5560, 2880);
        return (
          <div style={{ position: "absolute", left: a.x, top: a.y - 20, width: (b.x - a.x) * prog(t, 410.4, 411.2), height: 14, borderRadius: 7, background: C.rojo }}>
            <div style={{ position: "absolute", left: "50%", top: -70, transform: "translateX(-50%)", fontFamily, fontWeight: 700, fontSize: 44, color: "#fff", WebkitTextStroke: `6px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap", opacity: prog(t, 412.3, 412.6) }}>NOT VERY CLOSE</div>
          </div>
        );
      })()}
      <Chip t={t} t0={410.2} t1={413.6} text="OLDER SERVANTS FIRST" color={C.violeta} x={960} y={950} centro size={50} />
      {t > 413.9 && <Emote t={t} t0={414.06} tipo="excl" x={P(5050, 2900).x} y={P(5050, 2900).y - 120} s={1.5} />}
      {t >= 414.26 && <Grande t={t} t0={414.26} text="…THEN THE ALE CATCHES UP" y={150} size={100} color={C.ambar} />}
    </>
  );
};
