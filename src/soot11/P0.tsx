import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../soot/lib";
import { C, Chip, Particulas, Emote } from "./kit";
import { Persona, CIVIL } from "./persona";
import { SUELO, Llave, G, Hogaza, Moneda, Bolsa, Espada, Taburete, Jarra, Banco, interp } from "./mundo";
import { PT } from "./pueblo";
import { Franz, Gente, HUD, Barras, Sello, BurbujaM, Pin, Tacha, Titulo, vig } from "./actores";

// P0 · el gancho (0-59,6 s). Todo en el mismo pueblo: la casa del puente → paneo-látigo a la iglesia → panadería →
// taberna (el taburete) → "YOU ARE THE EXECUTIONER" → día/noche en la puerta de atrás → mapa del viaje (7 pines) →
// "no es un video de sangre" → entramos a la casa y agarramos la espada.
export const P0K: Llave[] = [
  [0, 6600, 628, 3.6],
  [2.45, 6480, 560, 0.95, 2.0],
  [3.75, 6620, 610, 1.55, 0.5],
  [6.0, 7560, 590, 1.0, 0.9],
  [9.3, 7560, 610, 1.45, 0.6],
  [12.9, 7590, 640, 1.9, 2.6],
  [13.95, 1150, 570, 1.05, 0.75, 0.3],
  [15.3, 1480, 650, 1.65, 1.0],
  [17.85, 2300, 610, 1.3, 0.62],
  [19.5, 2330, 640, 2.1, 0.7],
  [21.4, 2300, 610, 1.4, 0.6],
  [23.0, 3300, 600, 1.08, 0.62],
  [25.0, 3640, 640, 1.55, 0.8],
  [27.2, 3790, 700, 2.4, 0.6],
  [28.3, 3700, 630, 1.55, 0.45],
  [30.05, 3790, 650, 2.7, 0.45],
  [31.95, 8050, 590, 1.05, 0.7, 0.35],
  [35.6, 8050, 590, 1.0, 0.4],
  [37.3, 7180, 610, 1.35, 1.5],
  [39.7, 7180, 620, 1.5, 0.5],
  [42.2, 6200, -330, 0.14, 1.6],
  [53.0, 6300, -300, 0.15, 0.5],
  [55.4, 6620, 560, 0.62, 2.1],
  [58.4, 6700, 620, 1.35, 1.2],
  [59.75, 6800, 590, 1.9, 0.7],
];
export const P0H: [number, number][] = [[0, 0], [35.7, 0], [37.2, 2], [40.6, 2], [42.6, 0]];
export const abreCasaP0 = (t: number) => interp(t, [57.6, 58.6], [0, 1]);
export const espadaP0 = (t: number) => t < 58.95;

// pinchitos del mapa (orden = orden de las trampas)
const PINES: [number, number, string][] = [[950, "BLOOD"], [2650, "TOUCH"], [4350, "CHURCH"], [6050, "ADDRESS"], [7750, "MARRIAGE"], [9450, "STAGE"], [11150, "JOBS"]].map(([x, l], i) => [x as number, i, l as string]);
// fila de cada pinchito (alto = 1) para que ninguno pise a otro ni al HUD
const PIN_Y = (i: number) => SUELO - 1100 - (i % 2) * 1300;

export const P0Mundo: React.FC<{ t: number }> = ({ t }) => {
  const caminaF = (a: number, b: number) => (t > a && t < b ? 1.5 : 0);
  return (
    <>
      {/* 0-13 · frente de la casa del puente: orgullo → monedas → mano tendida */}
      {t < 13.7 && (() => {
        const fx = interp(t, [5.9, 8.6], [6560, 7440]);
        const tiende = interp(t, [9.2, 9.6], [8, 86]);
        return (
          <>
            {/* artesanos en las puertas de la calle */}
            <Persona x={7790} y={SUELO - 10} h={280} t={t} seed={31} ropa={CIVIL(1)} gorro="panadero" expr={t > 11 ? "miedo" : "neutro"} flip mira={-1} />
            <Persona x={8010} y={SUELO - 10} h={300} t={t} seed={32} ropa={{ ...CIVIL(4), tunica: "#4a4a5a", tunica2: "#2b2b38" }} barba="#2b1c14" expr={t > 11 ? "sorpresa" : "orgullo"} flip mira={-1} />
            <Persona x={8240} y={SUELO - 10} h={290} t={t} seed={33} ropa={CIVIL(3)} gorro="campesino" expr={t > 11 ? "miedo" : "neutro"} flip mira={-1} />
            {/* el que pasa y NO le da la mano */}
            {t > 8.6 && (() => {
              const px = t < 10.9 ? interp(t, [8.6, 10.6], [7900, 7640]) : interp(t, [11.0, 12.6], [7640, 7980]);
              return <>
                <Persona x={px} y={SUELO - 6} h={290} t={t} seed={34} ropa={CIVIL(2)} gorro="toca" camina={t < 10.6 || t > 11.0 ? 1.6 : 0} flip={t < 10.9} expr={t > 10.7 ? "miedo" : "feliz"} salta={10.75} inclina={t > 10.9 ? -10 : 0} />
                <Emote t={t} t0={10.7} t1={12.6} tipo="susto" x={px} y={SUELO - 250} s={0.55} />
              </>;
            })()}
            <Franz x={fx} y={SUELO - 10} t={t} camina={caminaF(5.9, 8.6)} expr={t < 3.6 ? "orgullo" : t < 9 ? "feliz" : t < 11 ? "feliz" : "triste"}
              bD={t < 3.6 ? 8 : t < 5.9 ? 40 : t > 9.2 && t < 12.1 ? tiende : 8} cD={t > 9.2 && t < 12.1 ? 4 : t < 5.9 && t > 3.6 ? 70 : 10}
              manoD={t > 3.6 && t < 5.9 ? <g transform="translate(-6 -10) scale(0.9)"><Bolsa x={0} y={110} s={1.2} /></g> : undefined} mira={t > 9 ? 1 : 0} habla={t < 2.4} />
            {/* monedas que caen en la bolsa */}
            {vig(t, 3.75, 5.9) && Array.from({ length: 9 }, (_, i) => {
              const t0 = 3.8 + i * 0.22, u = clamp((t - t0) / 0.42, 0, 1);
              if (t < t0 || u >= 1) return null;
              return <Moneda key={i} x={6640 + Math.sin(i * 2.1) * 20} y={interpolate(u, [0, 1], [200, 760])} s={0.6} rot={u * 360} />;
            })}
            {vig(t, 0.9, 3.5) && <Particulas t={t} tipo="destellos" n={24} seed={3} />}
          </>
        );
      })()}

      {/* 13.7-17.6 · iglesia llena adelante, Franz solo atrás junto a la puerta */}
      {vig(t, 13.2, 18.3) && (
        <>
          <Persona x={PT.altar + 10} y={SUELO - 150} h={300} t={t} seed={40} ropa={{ ...CIVIL(0), tunica: "#f2ead8", tunica2: "#c9bca4" }} gorro="cura" habla={t < 15.6} flip expr="neutro" />
          {[620, 840, 1060, 1280].map((bx, b) => (
            <React.Fragment key={bx}>
              <Gente t={t} x0={bx - 95} x1={bx + 95} n={3} y={SUELO - 70} h={250} seed={60 + b} flipDe={-9} expr={t > 15.4 ? "sorpresa" : "neutro"} mira={t > 15.4 ? 1 : -1} />
              <Banco x={bx} y={SUELO} w={200} op={1} />
            </React.Fragment>
          ))}
          <Franz x={PT.bancoVerdugo} y={SUELO - 72} t={t} expr="triste" flip mira={-1} />
          <Banco x={PT.bancoVerdugo} y={SUELO} w={120} />
          {/* hueco vacío marcado entre los fieles y él */}
          {t > 15.2 && <G x={1420} y={SUELO - 300}><path d="M -70 0 L 70 0" stroke="#fff" strokeWidth={8} strokeDasharray="16 14" /><path d="M -70 -20 L -90 0 L -70 20 M 70 -20 L 90 0 L 70 20" stroke="#fff" strokeWidth={8} fill="none" /></G>}
        </>
      )}

      {/* 17.4-22.8 · panadería: la hogaza al revés con pinzas larguísimas */}
      {vig(t, 17.3, 23.2) && (() => {
        const da = interp(t, [18.3, 18.9], [8, 92]);
        return (
          <>
            <Persona x={2545} y={SUELO - 10} h={300} t={t} seed={44} ropa={{ ...CIVIL(1), tunica: "#f6efe2", tunica2: "#d8ccb8" }} gorro="panadero" flip expr={t > 19 ? "enojado" : "neutro"} mira={-1}
              bD={da} cD={4} inclina={t > 18.3 ? -10 : 0}
              manoD={t > 18.3 ? <g><line x1={0} y1={0} x2={0} y2={240} stroke="#8a93a3" strokeWidth={10} /><line x1={10} y1={0} x2={10} y2={240} stroke="#6a7382" strokeWidth={6} /><g transform="translate(0 270) rotate(90)"><Hogaza x={0} y={0} s={0.9} rot={180} /></g></g> : undefined} />
            <Franz x={2150} y={SUELO - 10} t={t} expr={t > 21.3 ? "triste" : "neutro"} mira={1} bD={t > 20.5 ? 60 : 8} cD={t > 20.5 ? 50 : 10} />
            {t > 21.3 && <Emote t={t} t0={21.3} tipo="sudor" x={2150} y={SUELO - 250} s={0.55} />}
          </>
        );
      })()}

      {/* 22.6-31.9 · taberna: charla → silencio → el taburete → "YOU ARE THE EXECUTIONER" */}
      {vig(t, 22.5, 32.4) && (() => {
        const callados = t > 23.7;
        const fx = interp(t, [22.9, 29.7], [2900, 3800]);
        const sentado = t > 29.75;
        return (
          <>
            {[3080, 3260].map((x, i) => <Persona key={x} x={x} y={SUELO - 10} h={280} t={t} seed={70 + i} ropa={CIVIL(i + 2)} gorro={i ? "campesino" : undefined} habla={!callados} flip={callados ? true : i === 1} mira={callados ? -1 : 0} expr={callados ? "miedo" : "feliz"} bD={callados ? 8 : 60} cD={60} manoD={!callados ? <Jarra x={0} y={50} s={0.6} /> : undefined} />)}
            {[3560, 3720].map((x, i) => <Persona key={x} x={x} y={SUELO - 10} h={290} t={t} seed={80 + i} ropa={CIVIL(i + 4)} gorro={i ? "toca" : undefined} habla={!callados} flip={callados || i === 1} mira={callados ? -1 : 0} expr={callados ? "sorpresa" : "feliz"} />)}
            {!callados && <><BurbujaM t={t} t0={22.7} t1={23.65} x={3120} y={SUELO - 330} text="HA HA!" /><BurbujaM t={t} t0={22.95} t1={23.65} x={3640} y={SUELO - 340} text="...and then!" size={34} /></>}
            {callados && t < 26 && <BurbujaM t={t} t0={23.75} t1={25.6} x={3400} y={SUELO - 380} text="..." size={60} />}
            {/* el borracho que casi se sienta */}
            {vig(t, 27.6, 31) && (() => {
              const bx = t < 28.9 ? interp(t, [27.6, 28.6], [3500, 3730]) : interp(t, [28.95, 29.5], [3730, 3480]);
              return <><Persona x={bx} y={SUELO - 10} h={280} t={t} seed={88} ropa={CIVIL(0)} gorro="campesino" expr={t > 28.75 ? "miedo" : "feliz"} camina={t < 28.6 || t > 28.95 ? 1.8 : 0} salta={28.75} flip={t > 28.9} inclina={t < 28.6 ? Math.sin(t * 6) * 8 : 0} />
                <Emote t={t} t0={28.75} t1={29.8} tipo="excl" x={bx} y={SUELO - 260} s={0.55} /></>;
            })()}
            <Taburete x={PT.taburete} y={SUELO} brillo={vig(t, 25, 29.7)} />
            {t > 22.9 && <Franz x={sentado ? PT.taburete : fx} y={sentado ? SUELO - 80 : SUELO - 10} t={t} camina={!sentado ? 1.3 : 0} expr={sentado ? "neutro" : "triste"} mira={sentado ? 0 : 1} flip={sentado} />}
            {sentado && <G x={PT.taburete} y={SUELO - 96}><ellipse cx={0} cy={0} rx={72} ry={20} fill="#c98a4a" /></G>}
          </>
        );
      })()}

      {/* 31.8-41 · la calle de día (se apartan) → atardecer → noche en la puerta de atrás (tocan) */}
      {vig(t, 31.4, 41.5) && (() => {
        const fx = interp(t, [32, 34.2], [7650, 7900]);
        return (
          <>
            {t < 37.6 && <Franz x={fx} y={SUELO - 10} t={t} camina={t > 32 && t < 34.2 ? 1.4 : 0} expr={t > 34 ? "triste" : "neutro"} mira={1} />}
            {t < 37.6 && <Gente t={t} x0={8000} x1={8380} n={3} seed={9} flipDe={-1} mira={-1} expr={(i) => (t > 33.8 ? "miedo" : "neutro")} aleja={{ desde: 7900, dx: 280, t0: 33.8 }} />}
            {/* de noche: los mismos tres, vendados, tocando la puerta de atrás */}
            {t > 36.8 && (
              <>
                {[0, 1, 2].map((i) => (
                  <Persona key={i} x={7190 + i * 130} y={SUELO - 10} h={270 + (i % 2) * 20} t={t} seed={9 * 100 + i} ropa={CIVIL(i * 7)} flip expr={i === 1 ? "triste" : "miedo"} mira={-1}
                    bD={i === 0 ? 70 + Math.max(0, Math.sin((t - 38) * 18)) * 25 * (t > 38 && t < 39.2 ? 1 : 0) : i === 1 ? 50 : 8} cD={i === 0 ? 40 : 90}
                    manoI={i === 1 ? <rect x={-16} y={-10} width={32} height={40} rx={8} fill="#fff" /> : undefined} />
                ))}
                <G x={7200} y={SUELO - 330}><rect x={-60} y={-8} width={50} height={16} rx={8} fill="#fff" opacity={0} /></G>
                {t > 38 && t < 39.3 && <BurbujaM t={t} t0={38} t1={39.3} x={7140} y={SUELO - 330} text="KNOCK KNOCK" size={34} />}
              </>
            )}
          </>
        );
      })()}

      {/* 41-53 · el mapa del viaje: 7 pines sobre el pueblo y el camino punteado */}
      {vig(t, 41.2, 56.5) && (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            <path d={PINES.map(([x], i) => `${i ? "L" : "M"} ${x} ${PIN_Y(i)}`).join(" ")} stroke="#fff" strokeWidth={60} fill="none" strokeDasharray="120 90" strokeLinecap="round" strokeLinejoin="round"
              pathLength={1000} style={{ strokeDasharray: `${interp(t, [43.2, 48.6], [0, 1000])} 1000` }} opacity={0.9} />
          </svg>
          {PINES.map(([x, i, l]) => <Pin key={i} t={t} t0={43.2 + i * 0.8} x={x} y={PIN_Y(i)} n={i + 1} s={3.4} label={l} color={[C.rojo, C.violeta, C.ambar, C.teal, C.rosa, C.naranja, C.lima][i]} />)}
          {/* la espada al principio del camino y el sol que "baja" al final de la vida */}
          {vig(t, 44.3, 53) && <Espada x={950 + 620} y={SUELO - 300} s={1.3 * clamp((t - 44.3) / 0.3, 0, 1)} rot={-20} />}
        </>
      )}

      {/* 57-60 · adentro: Franz descuelga la espada */}
      {vig(t, 56.8, 62) && (
        <Franz x={6700} y={SUELO - 10} t={t} expr={t > 59 ? "enojado" : "neutro"} mira={1} bD={t > 58.6 ? interp(t, [58.6, 59.0], [20, 150]) : 8} cD={t > 58.6 ? 20 : 10}
          manoD={t > 58.95 ? <g transform="rotate(180)"><Espada x={0} y={-40} s={0.75} /></g> : undefined} />
      )}
    </>
  );
};

export const P0Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chip t={t} t0={0.25} t1={2.4} text="★ BEST HOUSE IN TOWN ★" color={C.violeta} x={960} y={150} centro size={64} />
    <Sello t={t} t0={2.55} t1={3.75} text="RENT: 0" x={960} y={330} color={C.teal} size={120} rot={-8} />
    <Chip t={t} t0={3.85} t1={5.9} text="PAID EVERY WEEK" color={C.ambar} tinta={C.noche} x={200} y={170} size={58} />
    {vig(t, 3.8, 6) && <div style={{ position: "absolute", left: 200, top: 230, display: "flex", gap: 12 }}>{Array.from({ length: 7 }, (_, i) => <div key={i} style={{ width: 56, height: 56, borderRadius: 12, background: t > 3.9 + i * 0.28 ? C.lima : "rgba(27,18,64,.6)", transform: `scale(${t > 3.9 + i * 0.28 ? 1 : 0.8})` }} />)}</div>}
    <Barras t={t} t0={6.0} t1={9.1} x={540} y={470} alto={280} ancho={110} items={[{ label: "BAKER", v: 30, color: "#e0a63a" }, { label: "SMITH", v: 36, color: "#7d8796" }, { label: "CARPENTER", v: 33, color: C.tierra }, { label: "YOU", v: 100, color: C.rojo, t0: 7.6 }]} />
    <Titulo t={t} t0={9.15} t1={13.3} text="20 YEARS" y={190} size={150} color={C.crema} />
    <Chip t={t} t0={14.6} t1={17.0} text="ALONE · BY THE DOOR" color={C.rojo} x={1240} y={980} centro size={58} />
    <Chip t={t} t0={19.5} t1={22.3} text="↻ UPSIDE DOWN" color={C.ambar} tinta={C.noche} x={960} y={170} centro size={70} />
    <Chip t={t} t0={21.3} t1={22.4} text="JUST FOR YOU" color={C.violeta} x={960} y={280} centro size={54} />
    <Chip t={t} t0={23.7} t1={25.0} text="*silence*" color={C.noche} x={960} y={190} centro size={64} />
    <Chip t={t} t0={27.2} t1={28.2} text="YOUR STOOL" color={C.rojo} x={960} y={980} centro size={80} />
    <Chip t={t} t0={28.3} t1={29.9} text="NOBODY ELSE. EVER." color={C.violeta} x={960} y={200} centro size={66} />
    {/* revelación */}
    {vig(t, 30, 31.8) && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 55%, transparent 25%, rgba(40,0,20,${0.75 * clamp((t - 30) * 3, 0, 1)}) 75%)` }} />}
    {vig(t, 30.0, 31.8) && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: clamp((t - 30) * 4, 0, 1) }}><Espada x={1600} y={1050} s={1.1 * clamp((t - 30) * 3, 0, 1)} rot={12} /></div>}
    <Titulo t={t} t0={30.15} t1={31.75} text="THE EXECUTIONER" y={940} size={150} color={C.rojo} borde="#2b0a14" />
    <Chip t={t} t0={31.8} t1={33.6} text="BY THE END OF THIS VIDEO..." color={C.violeta} x={960} y={150} centro size={56} />
    <Chip t={t} t0={33.9} t1={36.0} text="☀ DAYTIME: THEY AVOID YOU" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={37.4} t1={39.6} text="☾ NIGHT: THEY KNOCK" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Titulo t={t} t0={38.9} t1={40.4} text="WHY?" y={320} size={170} color={C.ambar} />
    <Chip t={t} t0={42.0} t1={44.4} text="ONE WHOLE LIFE" color={C.rojo} x={960} y={1000} centro size={70} />
    <Chip t={t} t0={44.5} t1={48.3} text="SWORD IN → SWORD DOWN" color={C.violeta} x={960} y={1000} centro size={60} />
    <Chip t={t} t0={48.4} t1={51.8} text="THE LONELIEST JOB IN TOWN" color={C.violeta} x={960} y={1000} centro size={60} />
    <Titulo t={t} t0={51.9} t1={53.4} text="7 TRAPS" y={985} size={150} color={C.ambar} />
    {/* no es un video de sangre */}
    {vig(t, 53.2, 55.5) && (() => {
      const e = clamp((t - 53.6) / 0.3, 0, 1);
      return (
        <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${e * (t > 55.0 ? interp(t, [55.0, 55.5], [1, 0]) : 1)})` }}>
          <svg width={300} height={380} viewBox="-150 -200 300 380" style={{ overflow: "visible" }}><path d="M 0 -180 Q 130 20 110 80 Q 90 170 0 170 Q -90 170 -110 80 Q -130 20 0 -180 Z" fill={C.rojo} stroke="#fff" strokeWidth={10} /><ellipse cx={-40} cy={40} rx={22} ry={40} fill="#ff8a9a" /></svg>
        </div>
      );
    })()}
    {t > 54.4 && t < 55.2 && <><Tacha t={t} t0={54.4} x={960} y={520} w={460} rot={-40} g={30} /><Tacha t={t} t0={54.6} x={960} y={520} w={460} rot={40} g={30} /></>}
    <Chip t={t} t0={53.9} t1={55.0} text="NOT ABOUT BLOOD" color={C.rojo} x={960} y={200} centro size={70} />
    <Chip t={t} t0={55.1} t1={57.8} text="ABOUT EVERYTHING AROUND IT" color={C.teal} tinta={C.noche} x={960} y={200} centro size={60} />
    {vig(t, 55.1, 57.8) && [0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2 + t * 1.2, R = 330 * clamp((t - 55.1) * 2.5, 0, 1);
      const x = 960 + Math.cos(a) * R * 1.3, y = 560 + Math.sin(a) * R * 0.8;
      return (
        <div key={i} style={{ position: "absolute", left: 0, top: 0 }}>
          {i === 0 && <Hogaza x={x} y={y} s={0.9} rot={180} />}
          {i === 1 && <Taburete x={x} y={y + 50} s={0.9} />}
          {i === 2 && <Jarra x={x} y={y + 40} s={1} cadena espuma={false} color="#6a6a7a" />}
          {i === 3 && <Banco x={x} y={y + 60} w={170} />}
          {i === 4 && <Moneda x={x} y={y} s={1.3} />}
        </div>
      );
    })}
    <Chip t={t} t0={58.3} t1={59.5} text="PICK UP THE SWORD" color={C.rojo} x={960} y={160} centro size={64} />
  </>
);
