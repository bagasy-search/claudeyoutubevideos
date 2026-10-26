import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Zzz } from "./kit";
import { Persona, Ropa } from "./persona";
import { CamP, Llave, aPantalla } from "./mundo";
import { CHICO, GUARDIA, SIERVO, Rata, Gato, Pulgas, PanTrampa, Manta, Perro } from "./objetos";
import { TarjetaTrampa, Inserto, Yo } from "./comun";
import { Acostado } from "./T3";

// TRAMPA 5 · LAS RATAS (550,2-660,9 s). Medianoche: el primer y el segundo sueño (Ekirch); despertás y las oís:
// ratas en la paja, en los muros y en los juncos bajo tu manta; vienen por la comida (granero, cocina, sobras)
// y traen pulgas; el gato no alcanza; la guía de París de 1393 (pan con pegamento y vela, la manta doblada);
// y lo que no da risa: 1348, la Peste Negra, de un tercio a la mitad de Europa. Arriba, en el muro, alguien vigila…
export const T0 = 550.2, T1 = 660.9;
export const CAM: Llave[] = [
  [551.0, 5300, 2820, 1.0], [552.6, 5300, 2860, 1.5], [556.3, 5300, 2870, 1.6],
  [576.6, 5300, 2870, 1.6], [580.4, 5800, 2820, 1.15], [583.4, 5850, 2800, 0.95], [585.6, 5300, 2900, 1.6], [588.0, 5300, 2900, 1.6],
  [589.6, 4600, 3200, 0.9], [590.6, 3300, 3560, 1.7], [592.1, 3310, 3570, 1.75], [593.3, 6150, 2850, 1.05], [594.9, 6150, 2880, 1.1], [595.7, 6150, 2920, 2.0],
  [596.6, 6100, 2850, 1.0], [601.6, 6150, 2830, 0.95], [603.4, 6150, 2830, 0.75], [605.4, 6150, 2850, 0.8], [607.2, 6100, 2900, 1.2],
  [654.9, 5300, 2870, 1.5], [656.9, 5300, 2880, 1.6], [658.2, 4300, 2400, 0.75], [660.6, 2620, 1880, 1.0],
];
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PISO = 2965;
const ESPOSO: Ropa = { tunica: "#5a3a7a", tunica2: "#3a2050", cinto: "#f7c548", piel: "#f2b48a", piel2: "#d98d66", pelo: "#c9c9c9" };
const ESPOSA: Ropa = { tunica: "#e05a8a", tunica2: "#a8305a", cinto: "#f7c548", piel: "#f8d0b0", piel2: "#e0a080", pelo: "#f2c94c" };

// ratas que corren por el salón: [x0, x1, y, t0, dur]
const RATAS: [number, number, number, number, number][] = [
  [5200, 6300, PISO - 24, 580.7, 2.4], [6400, 5300, PISO - 24, 581.4, 2.2], [5600, 6800, PISO - 24, 582.0, 2.6],
  [4980, 5900, 2420, 582.4, 2.0], [6600, 5600, 2420, 583.0, 2.2], // por arriba, en la viga de la pared
  [5500, 6000, PISO - 20, 584.2, 1.6], [6000, 5650, PISO - 20, 585.0, 1.6], // en los juncos, junto a tu manta
  [5900, 6500, 2820, 591.6, 2.0], [6500, 5800, 2820, 592.6, 2.0], [5800, 6600, PISO - 24, 593.3, 2.4],
  [6000, 6700, PISO - 24, 601.9, 2.4], [6800, 5600, PISO - 24, 602.3, 2.6], [5300, 6600, PISO - 24, 602.7, 2.8], [6900, 5800, 2820, 603.1, 2.4], [5500, 6400, 2820, 603.5, 2.2],
];

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t < T0 - 1 || t > T1 + 1) return null;
  const despierto = t > 554.9;
  const tapado = prog(t, 655.6, 656.6);
  return (
    <>
      {/* el salón dormido */}
      {[[5980, 1], [6250, 3], [6550, 5], [6800, 6], [6950, 4]].map(([x, r], i) => <Acostado key={i} x={x} y={PISO - 10} h={260} t={t} seed={80 + i} ropa={SIERVO(r)} flip={i % 2 === 1} />)}
      {[4990, 6420].map((x, i) => <Perro key={i} x={x} y={PISO - 60} s={0.75} t={t} duerme color={["#c9a36a", "#3a3a48"][i]} />)}
      {/* vos, acostado otra vez */}
      {t < 551.6 ? (
        <Persona x={5300} y={PISO} h={270} t={t} seed={7} ropa={CHICO} expr="miedo" />
      ) : (
        <Acostado x={5300} y={PISO - 10} h={260} t={t} seed={7} ropa={CHICO} expr={!despierto ? "dormido" : t < 576 ? "neutro" : "miedo"} />
      )}
      {t > 551.6 && <Manta x={5320} y={PISO - 30} s={0.8} t={t} w={300} cubre={1 + tapado * 1.4} />}
      {/* ratas */}
      {RATAS.map(([x0, x1, y, t0, d], i) => t > t0 && t < t0 + d + 0.1 && <Rata key={i} x={interpolate(t, [t0, t0 + d], [x0, x1], cl)} y={y} s={0.5} t={t} flip={x1 < x0} />)}
      {/* una rata te camina por encima de la manta */}
      {t > 585.7 && t < 588.2 && <Rata x={interpolate(t, [585.8, 588.0], [5080, 5420], cl)} y={PISO - 70 - Math.sin(prog(t, 585.8, 588.0) * Math.PI) * 25} s={0.75} t={t} />}
      {/* la paja del techo y los muros se mueven */}
      {t > 582.4 && t < 584.4 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={5000 + i * 220} y1={2400} x2={5000 + i * 220 + Math.sin(t * 20 + i) * 20} y2={2370} stroke="#c9b26a" strokeWidth={8} />)}
        </svg>
      )}
      {/* la cocina: ratas en el granero y en el caldero */}
      {t > 589.4 && t < 593 && [[2900, 3600], [3700, 3000], [3100, 3750], [3600, 2950], [2950, 3500], [3450, 3050]].map(([x0, x1], i) => <Rata key={i} x={interpolate(t, [589.5 + i * 0.22, 591.6 + i * 0.22], [x0, x1], cl)} y={3690 - (i % 3) * 30 - Math.abs(Math.sin(t * 9 + i)) * 26} s={1.1} t={t} flip={x1 < x0} />)}
      {/* el gato */}
      {t > 596.2 && t < 608 && (
        <Gato x={interpolate(t, [596.4, 598.0], [5300, 6050], cl)} y={PISO - 70} s={0.75} t={t} susto={t > 602} flip={t > 603.5} />
      )}
      {t > 605.5 && t < 608 && <Pulgas t={t} x={6050} y={PISO - 120} n={14} rad={110} seed={4} t0={605.6} />}
      {t > 594.6 && t < 597 && <Pulgas t={t} x={6150} y={PISO - 40} n={18} rad={90} seed={3} t0={594.8} />}
      {/* arriba, en el muro: el guardia que tiene que estar mirando */}
      {t > 657 && <Persona x={2620} y={1945} h={330} t={t} seed={22} ropa={GUARDIA} casco="medieval" expr="dormido" inclina={8} bD={20} cD={10} />}
      {t > 657.5 && <div style={{ position: "absolute", left: 2700, top: 1600 }}><Zzz x={0} y={0} t={t} /></div>}
    </>
  );
};

// barra de la noche: primer sueño / despierto / segundo sueño
const Barra: React.FC<{ t: number }> = ({ t }) => {
  const X0 = 210, W = 1400, Y = 520;
  const tramo = (a: number, b: number, col: string, t0: number, label: string, ly: number) => {
    const u = prog(t, t0, t0 + 0.7);
    return (
      <>
        <div style={{ position: "absolute", left: X0 + a * W, top: Y, width: (b - a) * W * u, height: 120, background: col, borderRadius: 20, border: `8px solid ${C.noche}`, boxSizing: "border-box" }} />
        {u > 0.5 && <div style={{ position: "absolute", left: X0 + ((a + b) / 2) * W, top: ly, transform: `translate(-50%,-50%) scale(${ent(t, t0 + 0.4)})`, fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: `8px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{label}</div>}
      </>
    );
  };
  return (
    <>
            <div style={{ position: "absolute", left: X0 + W - 70, top: Y - 150, fontSize: 84, opacity: ent(t, 575.3) }}>🌅</div>
      {tramo(0, 0.42, "#3b4cc0", 562.4, "FIRST SLEEP", Y - 60)}
      {tramo(0.43, 0.57, C.ambar, 568.2, "AWAKE ~1 HOUR", Y + 200)}
      {tramo(0.58, 1, "#3b4cc0", 563.6, "SECOND SLEEP", Y - 60)}
      {t > 571.4 && ["🙏", "💬", "🔥"].map((k, i) => <div key={k} style={{ position: "absolute", left: X0 + 0.43 * W + 10 + i * 70, top: Y + 280, fontSize: 64, transform: `scale(${ent(t, [571.5, 572.5, 573.6][i])})` }}>{k}</div>)}
      {t > 566.8 && t < 568.1 && <div style={{ position: "absolute", left: X0, top: Y + 30, width: 0.42 * W * prog(t, 566.8, 568.1), height: 60, fontSize: 50 }}>💤</div>}
    </>
  );
};

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t < T0 - 0.5 || t > T1 + 0.6) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const yo = P(5300, PISO - 120);
  return (
    <>
      <TarjetaTrampa t={t} t0={550.19} t1={552.4} n={5} nombre="THE RATS" hora="MIDNIGHT" color={C.tierra} />
      {/* reloj de medianoche */}
      {t >= 552.5 && t < 556.5 && (
        <div style={{ position: "absolute", left: 1500, top: 260, transform: `translate(-50%,-50%) scale(${ent(t, 552.6)})` }}>
          <svg width={300} height={300} viewBox="-150 -150 300 300">
            <circle r={130} fill={C.crema} stroke={C.noche} strokeWidth={14} />
            {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-110} x2={0} y2={-92} stroke={C.noche} strokeWidth={8} transform={`rotate(${i * 30})`} />)}
            <line x1={0} y1={0} x2={0} y2={-70} stroke={C.noche} strokeWidth={14} strokeLinecap="round" transform={`rotate(${interpolate(t, [552.6, 553.2], [-60, 0], cl)})`} />
            <line x1={0} y1={0} x2={0} y2={-100} stroke={C.rojo} strokeWidth={8} strokeLinecap="round" transform={`rotate(${interpolate(t, [552.6, 553.2], [-300, 0], cl)})`} />
          </svg>
        </div>
      )}
      {t >= 552.63 && t < 553.5 && <Grande t={t} t0={552.63} text="MIDNIGHT." y={180} size={130} color={C.crema} />}
      <Chip t={t} t0={553.53} t1={556.4} text="YOU WERE PROBABLY ASLEEP…" color={C.violeta} x={160} y={150} size={52} />
      <Chip t={t} t0={554.93} t1={556.4} text="THEN YOU WERE AWAKE." color={C.ambar} tinta={C.noche} x={160} y={250} size={52} />
      {t > 554.9 && t < 556.4 && <Emote t={t} t0={555.0} tipo="excl" {...cabeza(yo.x, yo.y, 200 * c.z)} />}
      {t > 553.4 && t < 554.9 && <Zzz x={yo.x + 40} y={yo.y - 160} t={t} />}
      {/* inserto: el primer y el segundo sueño */}
      <Inserto t={t} t0={556.45} t1={576.4} ix={yo.x} iy={yo.y} fondo="#3b2a8a" fondo2="#0e0828">
        {t < 562.3 ? (
          <>
            <div style={{ position: "absolute", left: 960, top: 220, transform: `translate(-50%,-50%) scale(${ent(t, 556.6)})`, fontFamily, fontWeight: 700, fontSize: 80, color: C.crema, WebkitTextStroke: `9px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>THAT WAS NORMAL.</div>
            <Persona x={560} y={960} h={480} t={t} seed={60} ropa={{ tunica: "#3a3a48", tunica2: "#22222e", cinto: "#a8743a", piel: "#f2c6a0", piel2: "#d99a78", pelo: "#7a5a3a" }} expr="orgullo" aparece={557.5} habla={t > 558 && t < 562} bD={120} cD={30} />
            <Chip t={t} t0={558.0} text="HISTORIAN ROGER EKIRCH" color={C.teal} tinta={C.noche} x={820} y={420} size={56} />
            {t > 559.7 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 860 + (i % 7) * 140, top: 560 + Math.floor(i / 7) * 190, width: 110, height: 150, background: "#f3e2b8", border: `6px solid ${C.noche}`, borderRadius: 8, transform: `rotate(${(i % 3 - 1) * 8}deg) scale(${ent(t, 559.8 + i * 0.07)})`, boxShadow: "0 8px 0 rgba(0,0,0,.3)" }}>{[0, 1, 2, 3].map((k) => <div key={k} style={{ margin: "16px 12px 0", height: 8, background: "#a8743a", borderRadius: 4 }} />)}</div>)}
            <Chip t={t} t0={559.79} text="HUNDREDS OF OLD REFERENCES" color={C.oro} tinta={C.noche} x={860} y={890} size={50} />
          </>
        ) : (
          <>
            <Barra t={t} />
            <Yo t={t} t0={562.35} x={1760} h={430} y={1000} expr={t > 568.1 && t < 574.6 ? "sorpresa" : "dormido"} habla={t > 571.5 && t < 574.5} bD={t > 571.5 && t < 574.5 ? 110 : 10} cD={t > 571.5 && t < 574.5 ? 40 : 10} mira={-0.6} flip />
            <Chip t={t} t0={564.61} t1={566.8} text="BED SOON AFTER DARK" color={C.violeta} x={960} y={880} centro size={54} />
            <Chip t={t} t0={566.87} t1={568.1} text="A FEW HOURS…" color="#3b4cc0" x={960} y={880} centro size={54} />
            <Chip t={t} t0={568.17} t1={571.4} text="WIDE AWAKE IN THE MIDDLE OF THE NIGHT" color={C.ambar} tinta={C.noche} x={960} y={880} centro size={50} />
            <Chip t={t} t0={571.49} t1={574.6} text="PRAY · TALK · CHECK THE FIRE" color={C.rojo} x={960} y={880} centro size={54} />
            <Chip t={t} t0={574.63} text="…THEN BACK TO SLEEP" color="#3b4cc0" x={960} y={880} centro size={54} />
          </>
        )}
      </Inserto>
      {/* despierto a medianoche: ahora las oís */}
      <Chip t={t} t0={576.43} t1={579.2} text="IT IS MIDNIGHT. YOU ARE WIDE AWAKE." color={C.violeta} x={960} y={140} centro size={52} />
      {t >= 579.21 && t < 580.6 && <Grande t={t} t0={579.33} text="…AND NOW YOU HEAR THEM." y={180} size={90} color={C.crema} />}
      {t > 579.3 && t < 581 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: yo.x - 300 + i * 260, top: yo.y - 200 - i * 40, fontFamily, fontWeight: 700, fontSize: 56, color: C.crema, WebkitTextStroke: `6px ${C.noche}`, paintOrder: "stroke fill", transform: `rotate(${(i - 1) * 12}deg) scale(${ent(t, 579.4 + i * 0.2)})` }}>scritch</div>)}
      {t >= 580.69 && t < 581.4 && <Grande t={t} t0={580.69} text="RATS." y={180} size={150} color={C.rojo} />}
      <Chip t={t} t0={581.45} t1={586.9} text="BLACK RATS" color={C.noche} x={160} y={150} size={60} />
      <Chip t={t} t0={582.43} t1={586.9} text="IN THE THATCH" color={C.oro} tinta={C.noche} x={160} y={250} size={46} />
      <Chip t={t} t0={583.29} t1={586.9} text="IN THE WALLS" color={C.tierra} x={160} y={330} size={46} />
      <Chip t={t} t0={584.23} t1={586.9} text="IN THE WARM, ROTTEN RUSHES…" color={C.lima} tinta={C.noche} x={160} y={410} size={46} />
      {t >= 585.8 && t < 587.2 && <Grande t={t} t0={585.8} text="…UNDER YOUR BLANKET" y={940} size={90} color={C.crema} />}
      {t > 585.8 && t < 587.2 && <Emote t={t} t0={585.9} tipo="susto" {...cabeza(yo.x, yo.y, 200 * c.z)} />}
      <Chip t={t} t0={587.21} t1={589.6} text="WHY? THE CASTLE IS FULL OF FOOD" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={52} />
      <Chip t={t} t0={589.67} t1={592.6} text="THE GRANARY" color={C.oro} tinta={C.noche} x={160} y={150} size={54} />
      <Chip t={t} t0={590.83} t1={592.6} text="THE KITCHEN" color={C.rojo} x={160} y={250} size={54} />
      <Chip t={t} t0={591.57} t1={593.3} text="SCRAPS UNDER EVERY TABLE" color={C.tierra} x={960} y={950} centro size={52} />
      <Chip t={t} t0={593.27} t1={595.2} text="…AND THEY BRING GUESTS" color={C.violeta} x={960} y={140} centro size={56} />
      {t >= 595.27 && t < 596.4 && <Grande t={t} t0={595.27} text="FLEAS." y={190} size={150} color={C.rojo} />}
      {/* el gato */}
      <Chip t={t} t0={596.27} t1={598.6} text="CASTLES KEPT CATS" color={C.teal} tinta={C.noche} x={160} y={150} size={56} />
      {t > 598.6 && t < 601.8 && (
        <div style={{ position: "absolute", left: 1260, top: 170, transform: `rotate(4deg) scale(${ent(t, 598.69)})`, width: 520, padding: "26px 30px", background: "#f3e2b8", border: `8px solid ${C.tierra}`, borderRadius: 12, fontFamily, fontWeight: 700, color: C.noche, boxShadow: "0 12px 0 rgba(14,8,40,.4)" }}>
          <div style={{ fontSize: 34, color: C.tierra }}>HOUSEHOLD ACCOUNTS</div>
          <div style={{ fontSize: 30, marginTop: 10, opacity: 0.5 }}>bread ........ 4d</div>
          <div style={{ fontSize: 30, opacity: 0.5 }}>candles ...... 2d</div>
          <div style={{ fontSize: 40, marginTop: 6, color: C.rojo, transform: `scale(${ent(t, 601.0)})`, transformOrigin: "left" }}>food for the CAT 🐈</div>
        </div>
      )}
      {t >= 601.83 && t < 603.2 && <Grande t={t} t0={601.83} text="ONE CAT" y={180} size={120} color={C.crema} />}
      {t >= 603.25 && t < 605.5 && <Grande t={t} t0={603.25} text="VS. A CASTLE FULL OF RATS" y={180} size={84} color={C.rojo} />}
      {t > 604.3 && t < 605.5 && <Chip t={t} t0={604.35} text="NOT A FAIR FIGHT" color={C.noche} x={960} y={300} centro size={52} />}
      <Chip t={t} t0={605.61} t1={607.3} text="…AND THE CAT HAS FLEAS TOO" color={C.rojo} x={960} y={160} centro size={56} />
      {/* inserto: la guía de París, 1393 */}
      <Inserto t={t} t0={607.35} t1={634.95} ix={P(6050, PISO - 100).x} iy={P(6050, PISO - 100).y} fondo="#f3d58a" fondo2="#a8541f">
        {t < 617.1 ? (
          <>
            <div style={{ position: "absolute", left: 960, top: 130, transform: `translate(-50%,-50%) scale(${ent(t, 609.27)})`, fontFamily, fontWeight: 700, fontSize: 110, color: C.crema, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>PARIS · c. 1393</div>
            <div style={{ position: "absolute", left: 760, top: 300, width: 420, height: 520, background: "#8a2a2a", borderRadius: 14, border: `10px solid ${C.noche}`, transform: `scale(${ent(t, 607.6)}) rotate(-3deg)`, boxShadow: "0 16px 0 rgba(14,8,40,.4)" }}>
              <div style={{ margin: "60px 40px", padding: 20, border: `6px solid ${C.oro}`, fontFamily, fontWeight: 700, fontSize: 46, color: C.oro, textAlign: "center", lineHeight: 1.2 }}>HOUSEHOLD<br />GUIDE</div>
              {t > 614.4 && <div style={{ position: "absolute", left: 40, right: 40, bottom: 60, background: "#f3e2b8", borderRadius: 10, padding: 14, fontFamily, fontWeight: 700, fontSize: 32, color: C.noche, textAlign: "center", transform: `scale(${ent(t, 614.6)})` }}>CHAPTER: FLEAS<br />IN YOUR BEDROOM</div>}
            </div>
            <Persona x={430} y={960} h={480} t={t} seed={61} ropa={ESPOSO} viejo expr="orgullo" aparece={608.0} habla={t > 612 && t < 614} bD={110} cD={20} />
            <Persona x={1500} y={960} h={420} t={t} seed={62} ropa={ESPOSA} expr="sorpresa" aparece={613.07} flip />
            <Chip t={t} t0={611.99} text="AN OLDER HUSBAND" color={C.violeta} x={430} y={1010} centro size={46} />
            <Chip t={t} t0={613.07} text="…FOR HIS YOUNG WIFE" color={C.rosa} x={1500} y={1010} centro size={46} />
          </>
        ) : t < 626.2 ? (
          <>
            <Chip t={t} t0={617.13} text="TRICK #1" color={C.rojo} x={960} y={110} centro size={64} />
            {[[460, 620], [960, 820], [1460, 620], [960, 420]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 140, top: y - 60, width: 280, height: 120, background: "radial-gradient(ellipse at 50% 45%, #f6dca0 55%, #d9a45a 70%)", border: `14px solid #9a5a22`, borderRadius: "60px 60px 34px 34px", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.55)", transform: `scale(${ent(t, 618.2 + i * 0.25)})` }}><div style={{ margin: "14px 18px", height: 70, borderRadius: 30, background: "#d6e8f2", opacity: prog(t, 619.6, 620.2) * 0.9 }} /></div>)}
            <Yo t={t} t0={617.2} x={1590} h={450} y={1040} expr={t > 624.8 ? "feliz" : t > 622.2 ? "sorpresa" : "orgullo"} bD={t < 622.2 ? 90 : 140} cD={t < 622.2 ? 60 : 30} mira={-0.7} flip />
            <Chip t={t} t0={618.17} text="BREAD SLICES" color={C.oro} tinta={C.noche} x={160} y={220} size={50} />
            <Chip t={t} t0={619.57} text="+ STICKY GLUE" color={C.teal} tinta={C.noche} x={160} y={310} size={50} />
            {t > 622.2 && <div style={{ position: "absolute", left: 0, top: 0 }}><PanTrampa x={960} y={620} s={0.75} t={t} t0={622.3} /></div>}
            <Chip t={t} t0={622.27} text="A LIT CANDLE IN THE MIDDLE" color={C.ambar} tinta={C.noche} x={1120} y={220} size={46} />
            {t > 623.6 && Array.from({ length: 16 }, (_, i) => {
              const dst = [[460, 620], [960, 820], [1460, 620], [960, 420]][i % 4];
              const u = prog(t, 623.7 + (i % 8) * 0.15, 624.6 + (i % 8) * 0.15);
              const x0 = 960 + Math.cos(i * 1.7) * 900, y0 = 540 + Math.sin(i * 1.7) * 520;
              return <div key={i} style={{ position: "absolute", left: x0 + (dst[0] - 40 + (i % 3) * 40 - x0) * u, top: y0 + (dst[1] - y0) * u - Math.sin(u * Math.PI) * 220, width: 18, height: 14, borderRadius: 7, background: "#3a1a14" }} />;
            })}
            {t >= 624.83 && <Grande t={t} t0={625.0} text="STUCK." y={980} size={110} color={C.crema} />}
          </>
        ) : (
          <>
            <Chip t={t} t0={626.29} text="TRICK #2" color={C.rojo} x={960} y={110} centro size={64} />
            {(() => {
              const dobla = prog(t, 630.6, 632.3), aplasta = prog(t, 632.7, 633.0);
              return (
                <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                  <rect x={460} y={700} width={1000} height={70} rx={14} fill="#7a4520" />
                  <g transform={`translate(960 640) scale(${1 - dobla * 0.55} ${1 - aplasta * 0.6})`}>
                    <rect x={-480} y={-80} width={960} height={140} rx={30} fill="#8a7a6a" opacity={ent(t, 627.3)} />
                    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={-440 + i * 96} y1={-70} x2={-430 + i * 96} y2={50} stroke="#6b5d4a" strokeWidth={8} />)}
                  </g>
                  {t < 632.8 && Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={960 + Math.sin(i * 2.3 + t * 3) * 300 * (1 - dobla * 0.6)} cy={600 - Math.abs(Math.sin(t * 9 + i)) * 50} rx={9} ry={7} fill="#3a1a14" />)}
                  {aplasta > 0.5 && Array.from({ length: 8 }, (_, i) => <line key={i} x1={960} y1={640} x2={960 + Math.cos(i * 0.8) * 260} y2={640 + Math.sin(i * 0.8) * 120} stroke={C.oro} strokeWidth={12} strokeLinecap="round" opacity={1 - prog(t, 633.2, 633.6)} />)}
                </svg>
              );
            })()}
            <Yo t={t} t0={626.35} x={250} h={470} y={1070} expr={t > 632.7 ? "feliz" : t > 630.3 ? "enojado" : "orgullo"} bD={t > 630.3 ? 120 : 60} cD={t > 632.6 && t < 633 ? 0 : 80} mira={0.7} />
            <Chip t={t} t0={627.01} t1={632.6} text="A BLANKET OVER THE BED" color={C.violeta} x={160} y={220} size={50} />
            <Chip t={t} t0={628.45} t1={632.6} text="FLEAS TRAPPED INSIDE" color={C.rojo} x={160} y={310} size={50} />
            <Chip t={t} t0={630.37} t1={633.5} text="FOLD IT UP… VERY CAREFULLY" color={C.teal} tinta={C.noche} x={960} y={900} centro size={52} />
            {t >= 632.71 && <Grande t={t} t0={632.71} text="…AND CRUSH THEM." y={330} size={100} color={C.oro} />}
            {t > 633.6 && <Chip t={t} t0={633.61} text="IT SOUNDS FUNNY." color={C.lima} tinta={C.noche} x={960} y={930} centro size={50} />}
          </>
        )}
      </Inserto>
      {/* inserto: la Peste Negra */}
      <Inserto t={t} t0={634.95} t1={655.4} ix={960} iy={540} ox={yo.x} oy={yo.y} fondo="#3a1a2a" fondo2="#08040c">
        {(() => {
          const enOla = prog(t, 638.4, 643.0);
          return (
            <>
              {t < 635.9 && <Grande t={t} t0={634.95} text="IT WAS NOT." y={540} size={160} color={C.crema} />}
              {t >= 636.9 && t < 644.3 && (
                <>
                  <div style={{ position: "absolute", left: 960, top: 140, transform: `translate(-50%,-50%) scale(${ent(t, 637.09)})`, fontFamily, fontWeight: 700, fontSize: 130, color: C.crema, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill" }}>1348</div>
                  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                    <path d="M 900 300 L 980 290 L 1010 360 L 990 430 L 1050 500 L 1080 600 L 1120 700 L 1090 780 L 980 800 L 860 820 L 830 760 L 900 700 L 870 620 L 890 540 L 850 470 L 880 400 Z" fill="#5a8a4a" stroke="#fff" strokeWidth={8} />
                    <path d="M 900 300 L 980 290 L 1010 360 L 990 430 L 1050 500 L 1080 600 L 1120 700 L 1090 780 L 980 800 L 860 820 L 830 760 L 900 700 L 870 620 L 890 540 L 850 470 L 880 400 Z" fill="#2a1a1a" opacity={0.85} style={{ clipPath: `inset(${(1 - enOla) * 100}% 0 0 0)` }} />
                    {t > 638.4 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={980 + Math.sin(i * 2) * 100} cy={780 - enOla * 420 + i * 50} r={10} fill={C.rojo} />)}
                  </svg>
                  <Chip t={t} t0={638.35} text="A DISEASE ARRIVES IN ENGLAND" color={C.rojo} x={110} y={420} size={46} />
                  <Chip t={t} t0={640.29} text="CARRIED (PARTLY) BY FLEAS" color={C.ambar} tinta={C.noche} x={1150} y={420} size={44} />
                  {t > 641.7 && <div style={{ position: "absolute", left: 1480, top: 580, transform: `scale(${ent(t, 641.77)})` }}><Rata x={0} y={0} s={0.9} t={t} /></div>}
                  <Chip t={t} t0={641.99} text="…THAT LIVED ON RATS" color={C.tierra} x={1150} y={500} size={44} />
                </>
              )}
              {t >= 643.17 && t < 644.3 && <Grande t={t} t0={643.17} text="THE BLACK DEATH" y={960} size={130} color={C.rojo} />}
              {t >= 644.3 && t < 651.9 && (
                <>
                  <Chip t={t} t0={644.37} text="WITHIN A COUPLE OF YEARS" color={C.violeta} x={960} y={140} centro size={56} />
                  {Array.from({ length: 10 }, (_, i) => {
                    const muere = i < 3 ? prog(t, 646.67 + i * 0.12, 647.0 + i * 0.12) : i < 5 ? prog(t, 647.25 + (i - 3) * 0.12, 647.6 + (i - 3) * 0.12) * 0.75 : 0;
                    return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - muere * 0.85, filter: muere > 0.5 ? "grayscale(1)" : undefined }}><Persona x={260 + i * 155} y={720} h={300} t={t} seed={140 + i} ropa={SIERVO(i)} expr={muere > 0.5 ? "triste" : "miedo"} /></div>;
                  })}
                  <Chip t={t} t0={646.67} text="1/3" color={C.rojo} x={260 + 155} y={330} centro size={64} />
                  <Chip t={t} t0={647.25} text="…TO 1/2" color={C.rojo} x={260 + 155 * 3.5} y={330} centro size={64} />
                  <Chip t={t} t0={647.57} text="OF EVERYONE IN EUROPE" color={C.crema} tinta={C.noche} x={960} y={800} centro size={56} />
                  {t > 648.9 && <Chip t={t} t0={648.95} text="SOMETIMES: EVERYONE INSIDE A CASTLE" color={C.rojo} x={960} y={900} centro size={50} />}
                </>
              )}
              {t >= 651.9 && (
                <>
                  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                    <rect x={560} y={330} width={800} height={500} fill="#8a8a9a" stroke="#4a4a5a" strokeWidth={70} />
                    {[560, 720, 880, 1040, 1200].map((x) => <rect key={x} x={x - 35} y={260} width={100} height={70} fill="#8a8a9a" />)}
                  </svg>
                  {[760, 960, 1160].map((x, i) => <Persona key={x} x={x} y={800} h={280} t={t} seed={150 + i} ropa={i === 1 ? GUARDIA : SIERVO(i)} casco={i === 1 ? "medieval" : "no"} expr={t > 653.8 ? "miedo" : "orgullo"} aparece={651.93 + i * 0.02} salta={t > 653.8 ? 653.9 + i * 0.1 : undefined} />)}
                  <Chip t={t} t0={651.97} text="THICK WALLS" color={C.violeta} x={960} y={190} centro size={60} />
                  {t > 652.6 && <div style={{ position: "absolute", left: 1220, top: 180, transform: `rotate(-10deg) scale(${ent(t, 652.83, 0, { damping: 7, stiffness: 260 })})`, border: `10px solid ${C.rojo}`, borderRadius: 16, padding: "4px 24px", background: "rgba(255,255,255,.92)", fontFamily, fontWeight: 700, fontSize: 52, color: C.rojo, whiteSpace: "nowrap" }}>DID NOT HELP</div>}
                  {t > 653.7 && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 0 }}><Rata x={interpolate(t, [653.7 + i * 0.1, 655.2], [700 + i * 100, 1250 - i * 90], cl)} y={780 - (i % 2) * 120} s={0.7} t={t} flip={i % 2 === 1} /></div>)}
                  {t >= 654.17 && <Grande t={t} t0={654.17} text="THE RATS WERE ALREADY INSIDE." y={960} size={80} color={C.crema} />}
                </>
              )}
            </>
          );
        })()}
      </Inserto>
      <Chip t={t} t0={655.47} t1={657.2} text="BLANKET OVER YOUR HEAD" color={C.violeta} x={960} y={150} centro size={56} />
      {t >= 657.27 && t < 659.0 && <Grande t={t} t0={657.27} text="…AND ABOVE YOU, ON THE WALL" y={180} size={84} color={C.crema} />}
      <Chip t={t} t0={658.87} t1={661.2} text="SOMEBODY IS SUPPOSED TO BE WATCHING" color={C.rojo} x={960} y={950} centro size={52} />
    </>
  );
};
