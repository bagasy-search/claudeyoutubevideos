import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Particulas, Pergamino, Moneda } from "./kit";
import { Trampas } from "./kit2";
import { Mundo, K, En, SUELO, AGUA, kx, mueve, camEn, camV } from "./mundo";
import { Base } from "./base";
import { TOM, GENT, COLONO, Poste, Cartel, Corona, Choclo, Tablero, Pez, Nieve } from "./kitj";
import { Globo, Icono, Tacha, Almacen, Carreta, Olor, Torta } from "./kitj2";

// TRAMPA 1 · EL AVISO (51,7-138,1 s). Londres, diciembre de 1606: la calle, la compañía, el cartel, la letra chica,
// el almacén común, la fila del muelle (caballeros sin oficio) y los tres barcos que zarpan.
export const CAM1: K[] = [
  [51.9, 6150, 580, 0.92], [52.7, 5300, 560, 0.85], [54.0, 5150, 560, 0.9], [55.6, 4750, 580, 1.0], [57.3, 4450, 580, 0.96],
  [59.6, 3950, 640, 1.3], [62.6, 3900, 640, 1.35], [63.6, 3300, 560, 0.95], [67.2, 3300, 540, 1.0], [69.1, 2950, 600, 0.95],
  [70.4, 2760, 610, 2.05], [86.9, 2760, 610, 2.2], [88.7, 2700, 818, 5.6], [89.7, 2700, 818, 5.8], [90.5, 2880, 600, 1.35],
  [92.9, 2850, 600, 1.42], [93.7, 2150, 650, 1.25], [99.5, 2050, 650, 1.3], [101.6, 1700, 610, 0.95], [103.5, 1250, 650, 1.2],
  [104.9, 1250, 650, 1.26], [105.85, 6020, 600, 0.9], [110.6, 6020, 600, 0.93], [112.9, 5890, 560, 1.55], [118.9, 5890, 560, 1.6],
  [119.7, 6060, 640, 1.3], [125.8, 6080, 640, 1.32], [126.4, 6060, 600, 0.95], [127.9, 6060, 600, 0.95], [129.1, 7080, 600, 0.62], [132.8, 7120, 600, 0.65], [138.2, 7700, 600, 0.6],
];
const CIELO1: [number, string][] = [[50.3, "londres"], [70.2, "amanecer"], [88.3, "londres"], [128.0, "mar"]];

// fila del muelle: 0 = vos · 1,3,6 caballeros · 2 peón · 4 carpintero · 5 herrero · 7 barbero · 8 soldado · 9-10 chicos
const FILA = Array.from({ length: 11 }, (_, i) => ({ i, x: 5600 + i * 92, gent: [1, 3, 6].includes(i), chico: i >= 9 }));
const OFICIO: Record<number, ["pala" | "sierra" | "yunque" | "navaja" | "casco" | "nino", number]> = { 2: ["pala", 120.32], 4: ["sierra", 121.3], 5: ["yunque", 122.16], 7: ["navaja", 123.04], 8: ["casco", 123.9], 9: ["nino", 124.8], 10: ["nino", 124.9] };
const YO: number[][] = [[51.0, 6050], [55.6, 5000], [58.5, 4420], [62.0, 4050], [69.4, 2960], [93.0, 2960], [94.6, 2640], [105.0, 2640], [105.5, 5600]];

const Pala: React.FC = () => <g transform="rotate(-150)"><rect x={-7} y={-40} width={14} height={150} fill="#8a5a2a" /><path d="M -34 100 L 34 100 L 30 160 Q 0 176 -30 160 Z" fill="#8a94a4" /></g>;

export const P1: React.FC<{ t: number }> = ({ t }) => {
  if (t < 51.2 || t > 138.6) return null;
  const yx = kx(YO, t);
  const yy = yx > 5500 ? SUELO - 30 : SUELO;
  const c = camV(CAM1, t);
  const enFila = t > 105.4;
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM1} cielo={CIELO1}>
        <Base t={t} />
        {/* "a bordo": colonos con su hatillo subiendo por la planchada */}
        {t > 51.2 && t < 53.8 && [0, 1, 2].map((i) => { const x = interpolate(t, [51.2, 53.8], [6230 + i * 120, 6560 + i * 120]); return <En key={`b${i}`} x={x} w={200}><Persona x={x} y={SUELO - 30 - Math.max(0, x - 6450) * 0.35} h={300} t={t} seed={150 + i} ropa={COLONO(i + 2)} expr="feliz" camina={1.6} bD={140} cD={60} manoD={<circle cx={0} cy={-30} r={34} fill="#b0905a" stroke="#5a3a1a" strokeWidth={6} />} /></En>; })}
        {t > 51.2 && t < 53.8 && <svg style={{ position: "absolute", left: 6400, top: SUELO - 40, overflow: "visible" }} width={10} height={10}><path d="M 0 10 L 420 -140" stroke="#7a4a24" strokeWidth={22} strokeLinecap="round" />{[1, 2, 3, 4, 5].map((k) => <line key={k} x1={k * 70} y1={10 - k * 25 - 6} x2={k * 70} y2={10 - k * 25 + 12} stroke="#4e2a12" strokeWidth={6} />)}</svg>}
        {/* el cartel #1 clavado en la calle */}
        {t < 55.3 && <En x={5250} w={500}><Poste t={t} t0={51.66} x={5250} y={SUELO + 10} n={1} titulo="THE AD" s={1.55} /></En>}
        {/* carreta que cruza con su olor */}
        {t > 56.8 && t < 61.5 && (() => { const x = interpolate(t, [56.8, 61.5], [3700, 5300]); return <En x={x} w={500}><Carreta t={t} x={x} y={SUELO - 90} s={0.9} /><Olor t={t} x={x + 120} y={SUELO - 200} /><Olor t={t + 0.4} x={x - 160} y={SUELO - 160} color="#a8a8b8" /></En>; })()}
        {/* la gente que habla de Virginia en cada esquina */}
        {t > 58.8 && t < 63.8 && ([[3640, "VIRGINIA!", 60.1], [3820, "GOLD!!", 60.94], [4140, "VIRGINIA?!", 61.84]] as [number, string, number][]).map(([x, s, t0], i) => (
          <En key={i} x={x} w={300}>
            <Persona x={x} y={SUELO} h={330} t={t} seed={90 + i} ropa={COLONO(i + 2)} expr={i === 1 ? "sorpresa" : "feliz"} habla flip={i === 1} gorro={i === 2 ? "gorra" : undefined} />
            <Globo t={t} t0={t0} x={x + (i === 1 ? -40 : 40)} y={SUELO - 360} text={s} size={58} cola={i === 1 ? "der" : "izq"} />
          </En>
        ))}
        {/* la Virginia Company: inversores de galera, la carta real y la corona */}
        {t > 62.2 && t < 70.5 && (
          <>
            <En x={3300} w={400}><div style={{ position: "absolute", left: 3300, top: 230, transform: `translate(-50%,-50%) scale(${ent(t, 64.6)}) rotate(${Math.sin(t * 2) * 2}deg)`, fontFamily, fontWeight: 700, fontSize: 54, color: "#ffe6b0", background: "#5a2a5a", border: "6px solid #2a1430", borderRadius: 10, padding: "6px 18px", whiteSpace: "nowrap" }}>VIRGINIA COMPANY</div></En>
            {[3150, 3450].map((x, i) => <En key={x} x={x} w={250}><Persona x={x} y={SUELO} h={360} t={t} seed={110 + i} ropa={GENT(i + 2)} expr={i ? "enojado" : "orgullo"} habla={i === 0} bD={i === 0 ? 110 : undefined} cD={i === 0 ? 30 : undefined} gorro="copa" gola flip={i === 1} aparece={63.0 + i * 0.2} barba={i ? "#5a3a2a" : undefined} /></En>)}
            {t > 66.4 && <Pergamino x={3300} y={430} w={360} abre={prog(t, 66.45, 66.9) * 0.55} lineas={5} firma={prog(t, 67.3, 68.2)} titulo="CHARTER" />}
            {/* el rey Jacobo entrega la carta */}
            {t > 65.9 && <En x={3640} w={300}><Persona x={3640} y={SUELO} h={440} t={t} seed={119} ropa={{ ...GENT(0), tunica: "#8a1a2e", tunica2: "#5a0f1e" }} capa="#c9a24a" gola barba="#6a4a2a" expr="orgullo" flip bI={150} cI={10} aparece={65.95} manoI={<g transform="rotate(-20)"><rect x={-14} y={-60} width={28} height={110} rx={10} fill="#f6e3b4" stroke="#7a3d14" strokeWidth={5} /></g>} />
              <Corona x={3640} y={SUELO - 462} s={0.48} t={t} t0={66.0} />
              <div style={{ position: "absolute", left: 3640 - 180, top: SUELO - 600, width: 360, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: "8px #1b1240", paintOrder: "stroke fill", opacity: ent(t, 66.2) }}>KING JAMES</div></En>}
          </>
        )}
        {/* el cartel de reclutamiento en la pared */}
        {t > 68.4 && t < 93.6 && (
          <En x={2700} w={500}>
            <Cartel x={2700} y={640} s={0.5} t={t} t0={68.72} titulo="VIRGINIA!" lineas={["RICH LAND", "GOLD!", "LIKE THE SPANISH", "PACIFIC PASSAGE", "ASIAN SPICES", "COME BACK RICH"]} tl={[72.64, 74.06, 75.9, 79.46, 82.98, 86.98]} />
            {/* la letra chica, al pie */}
            <svg style={{ position: "absolute", left: 2700 - 140, top: 640 + 168, overflow: "visible" }} width={280} height={40}>
              {["* settlers are company employees for 7 years", "* all goods go to the common store", "* profits go to London investors"].map((l, i) => <text key={i} x={140} y={8 + i * 10} textAnchor="middle" fontFamily={fontFamily} fontWeight={600} fontSize={7.5} fill="#5a2a1a">{l}</text>)}
            </svg>
          </En>
        )}
        {/* el almacén común y las cosas que vuelan adentro */}
        {t > 92.8 && t < 105.6 && (
          <>
            <En x={1700} w={500}><Almacen x={1700} y={SUELO - 190} s={0.75} t={t} t0={93.3} /></En>
            {([[95.32, "maiz"], [95.96, "pez"], [96.36, "piel"]] as [number, string][]).map(([t0, k], i) => {
              const u = prog(t, t0, t0 + 0.9);
              if (t < t0 || u >= 1) return null;
              const x = 2600 - u * 900, y = SUELO - 300 - Math.sin(u * Math.PI) * 300;
              return <div key={i} style={{ position: "absolute", left: 0, top: 0 }}>{k === "maiz" ? <Choclo x={x} y={y} s={0.7} rot={u * 360} /> : k === "pez" ? <Pez t={t} x={x} y={y} s={0.8} flip /> : <svg style={{ position: "absolute", left: x - 60, top: y - 40, transform: `rotate(${u * 300}deg)` }} width={120} height={80}><path d="M 10 40 Q 30 0 60 10 Q 90 0 110 40 Q 90 80 60 70 Q 30 80 10 40 Z" fill="#9a6a3a" /></svg>}</div>;
            })}
            {/* sale tu ración: un cuenquito */}
            {t > 99.8 && t < 101.4 && (() => { const u = prog(t, 99.9, 100.7); const x = 1760 + u * 820, y = SUELO - 80 - Math.sin(u * Math.PI) * 160; return <svg style={{ position: "absolute", left: x - 40, top: y - 24 }} width={80} height={48}><path d="M 4 10 L 76 10 Q 70 44 40 46 Q 10 44 4 10 Z" fill="#a0683a" stroke="#4e2a12" strokeWidth={4} /></svg>; })()}
            {/* la ganancia vuela a los inversores */}
            {t > 101.5 && Array.from({ length: 12 }, (_, i) => { const u = (t - 101.6 - i * 0.12) / 0.8; if (u < 0 || u > 1) return null; return <Moneda key={i} x={1650 - u * 520} y={SUELO - 260 - Math.sin(u * Math.PI) * 220} r={22} gira={t * 6} t={t} />; })}
            {t > 101.3 && [1050, 1200].map((x, i) => <En key={x} x={x} w={250}><Persona x={x} y={SUELO} h={340} t={t} seed={120 + i} ropa={GENT(i)} expr={t > 103.8 && i === 1 ? "enojado" : "orgullo"} gorro="copa" gola aparece={101.6 + i * 0.15} bD={t > 103.8 && i === 1 ? 70 : undefined} inclina={t > 103.86 && i === 1 ? -8 : 0} /></En>)}
            {t > 103.4 && <svg style={{ position: "absolute", left: 1250, top: SUELO - 10, overflow: "visible" }} width={300} height={60}><ellipse cx={130} cy={20} rx={140 * ent(t, 103.4)} ry={22} fill="#5a4a2a" /><ellipse cx={110} cy={14} rx={50} ry={8} fill="#7a6a4a" /></svg>}
          </>
        )}
        {/* la fila del muelle */}
        {enFila && FILA.map((f) => (
          <En key={f.i} x={f.x} w={200}>
            {f.i > 0 && <Persona x={f.x} y={SUELO - 30} h={f.chico ? 230 : 330} t={t} seed={140 + f.i} ropa={f.gent ? GENT(f.i) : COLONO(f.i)} expr={f.gent ? "orgullo" : f.i === 2 && t > 114 && t < 119 ? "enojado" : "neutro"} gola={f.gent} gorro={f.gent ? "pluma" : f.i === 8 ? "morion" : f.i === 4 ? "gorra" : undefined} capa={f.gent ? "#2a1a3a" : undefined} barba={f.i === 5 || f.i === 8 ? "#3a2416" : undefined} flip mira={-0.5}
              manoD={f.i === 2 && t > 113.6 && t < 119.2 ? <g transform="scale(0.8)"><Pala /></g> : undefined} bD={f.i === 2 && t > 113.6 && t < 119.2 ? 75 : undefined} cD={f.i === 2 && t > 113.6 && t < 119.2 ? 20 : undefined}
              ladea={f.i === 3 && t > 115.4 && t < 119 ? -14 : 0} inclina={f.i === 3 && t > 115.4 && t < 119 ? 6 : 0} />}
            {f.gent && t > 110.88 && <div style={{ position: "absolute", left: f.x - 120, top: SUELO - 470, width: 240, height: 500, background: "radial-gradient(ellipse at 50% 100%, rgba(255,230,140,.55), transparent 70%)", opacity: ent(t, 110.9 + f.i * 0.05), pointerEvents: "none" }} />}
            {OFICIO[f.i] && <Icono k={OFICIO[f.i][0]} x={f.x} y={SUELO - (f.chico ? 330 : 440)} s={0.55} t={t} t0={OFICIO[f.i][1]} />}
            {OFICIO[f.i] && t > OFICIO[f.i][1] && t < 126.2 && <div style={{ position: "absolute", left: f.x - 70, top: SUELO - (f.chico ? 270 : 380) + (f.i % 2) * 34, width: 140, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", WebkitTextStroke: "7px #1b1240", paintOrder: "stroke fill", whiteSpace: "nowrap", transform: `scale(${ent(t, OFICIO[f.i][1])})` }}>{({ pala: "LABORER", sierra: "CARPENTER", yunque: "SMITH", navaja: "BARBER", casco: "SOLDIER", nino: "BOY" } as Record<string, string>)[OFICIO[f.i][0]]}</div>}
          </En>
        ))}
        {enFila && t > 112.9 && t < 119.3 && <Globo t={t} t0={115.48} t1={118.9} x={6080} y={SUELO - 400} text="MANUAL LABOR? EW." size={54} cola="der" />}
        {/* vos: caminás por Londres, mirás el cartel, y hacés la fila */}
        {t < 105.5 && <En x={yx} w={300}><Persona x={yx} y={yy} h={430} t={t} seed={8} ropa={TOM} gorro="sombrero" expr={t > 89.7 && t < 93 ? "sorpresa" : t > 99.6 && t < 101.5 ? "triste" : "feliz"} camina={mueve(YO, t) ? 1.5 : 0} flip={t > 52 && t < 94.6} mira={t > 69.4 && t < 89.7 ? -0.8 : 0} miraY={t > 69.4 && t < 89.7 ? -0.6 : 0} /></En>}
        {enFila && <En x={5600} w={300}><Persona x={5600} y={SUELO - 30} h={430} t={t} seed={8} ropa={TOM} gorro="sombrero" expr={t > 126 && t < 128 ? "miedo" : "feliz"} flip mira={-0.6} /></En>}
        {t > 135.8 && <En x={7080} w={400}><Choclo x={7000} y={380} s={1.2} t={t} t0={136.6} /><div style={{ position: "absolute", left: 7130, top: 300, fontFamily, fontWeight: 700, fontSize: 140, color: "#fff", WebkitTextStroke: "12px #1b1240", paintOrder: "stroke fill", transform: `scale(${ent(t, 137.0)})` }}>?</div></En>}
        {t > 134.2 && t < 136.2 && <En x={7080} w={300}><Corona x={7080} y={260} s={1.1} t={t} t0={134.38} /></En>}
        {/* nieve de diciembre */}
        {t < 70 && <div style={{ position: "absolute", left: c.x - 1100 / c.z, top: c.y - 700 / c.z, transform: `scale(${1 / c.z})`, transformOrigin: "0 0" }}><Nieve t={t} n={50} op={0.7} /></div>}
      </Mundo>

      {/* pantalla */}
      {t < 56 && <Trampas t={t} t0={52.0} n={1} y={960} />}
      <Chip t={t} t0={54.16} t1={57.1} text="DECEMBER 1606" color={C.ambar} tinta={C.noche} x={330} y={140} centro size={66} />
      <Chip t={t} t0={56.6} t1={59.2} text="LONDON" color={C.rojo} x={330} y={240} centro size={58} />
      <Chip t={t} t0={58.22} t1={60.0} text="SMOKE" color="#6a6a7a" x={1380} y={240} size={50} />
      <Chip t={t} t0={58.78} t1={60.0} text="HORSES" color={C.tierra} x={1380} y={320} size={50} />
      <Chip t={t} t0={63.04} t1={66.1} text="INVESTORS" color={C.violeta} x={960} y={930} centro size={58} />
      <Chip t={t} t0={66.44} t1={69.0} text="ROYAL CHARTER · KING JAMES" color={C.oro} tinta={C.noche} x={960} y={930} centro size={56} />
      <Chip t={t} t0={68.72} t1={70.2} text="LOOKING FOR MEN" color={C.rojo} x={960} y={140} centro size={60} />
      {t > 70.1 && t < 71.8 && <Grande t={t} t0={70.56} text="IRRESISTIBLE" x={1380} y={180} size={110} color={C.ambar} />}
      {t > 74.0 && t < 77.9 && <div style={{ position: "absolute", left: 0, top: 0 }}><Particulas t={t} tipo="destellos" n={26} seed={4} /></div>}
      <Chip t={t} t0={76.68} t1={77.9} text="MEXICO" color={C.teal} tinta={C.noche} x={250} y={880} size={46} />
      <Chip t={t} t0={77.3} t1={77.9} text="PERU" color={C.teal} tinta={C.noche} x={1450} y={880} size={46} />
      {t > 86.6 && t < 88.4 && <Particulas t={t} tipo="lluviaoro" n={50} seed={6} />}
      <Chip t={t} t0={88.82} t1={89.7} text="THE FINE PRINT" color={C.rojo} x={960} y={960} centro size={58} />
      {t > 89.7 && t < 91.0 && <Grande t={t} t0={90.02} text="NOT A SETTLER" y={190} size={120} color="#ff5a6a" />}
      {t > 91.0 && t < 93.1 && <Grande t={t} t0={92.18} text="EMPLOYEE" y={190} size={140} color={C.ambar} />}
      {t > 93.6 && t < 99.5 && <Grande t={t} t0={93.74} text="7 YEARS" y={170} size={130} />}
      {t > 93.9 && t < 99.5 && Array.from({ length: 7 }, (_, i) => {
        const e = ent(t, 94.1 + i * 0.16);
        const x = 900 + (i - 3) * 140;
        return <div key={`a${i}`} style={{ position: "absolute", left: x, top: 330, transform: `translate(-50%,-50%) scale(${e}) rotate(${(i - 3) * 2}deg)`, width: 128, height: 140, background: "#fff6e0", border: "6px solid #4e2a12", borderRadius: 12, fontFamily, fontWeight: 700, textAlign: "center", boxShadow: "0 8px 0 rgba(20,10,40,.35)" }}>
          <div style={{ background: C.rojo, color: "#fff", fontSize: 26, padding: "4px 0" }}>YEAR</div>
          <div style={{ fontSize: 64, color: "#2a1408", lineHeight: "90px" }}>{i + 1}</div>
          {t > 95.0 + i * 0.5 && <svg style={{ position: "absolute", inset: 0 }} width={116} height={128}><path d="M 14 20 L 104 112 M 104 20 L 14 112" stroke={C.rojo} strokeWidth={12} strokeLinecap="round" opacity={0.85} /></svg>}
        </div>;
      })}
      <Chip t={t} t0={95.32} t1={98.6} text="GROW" color={C.lima} tinta={C.noche} x={1060} y={540} centro size={58} />
      <Chip t={t} t0={95.96} t1={98.6} text="CATCH" color={C.teal} tinta={C.noche} x={1060} y={630} centro size={58} />
      <Chip t={t} t0={96.36} t1={98.6} text="FIND" color={C.ambar} tinta={C.noche} x={1060} y={720} centro size={58} />
      <Chip t={t} t0={99.82} t1={101.4} text="YOUR FOOD" color={C.naranja} x={960} y={930} centro size={56} />
      <Chip t={t} t0={101.64} t1={103.3} text="YOUR PROFIT → LONDON" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={103.36} t1={105.2} text="NEVER SET FOOT IN A SWAMP" color={C.rojo} x={960} y={930} centro size={54} />
      {t > 106.8 && t < 112.6 && <Tablero t={t} valor={interpolate(t, [107.4, 108.6], [0, 105], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} titulo="ON BOARD" x={1680} y={150} />}
      <Chip t={t} t0={108.54} t1={110.6} text="MEN AND BOYS" color={C.teal} tinta={C.noche} x={1680} y={290} centro size={42} />
      {t < 119.4 && <Torta t={t} t0={110.88} x={330} y={300} frac={1 / 3} />}
      <Chip t={t} t0={111.86} t1={112.8} text="GENTLEMEN" color={C.violeta} x={500} y={300} size={56} />
      <Chip t={t} t0={115.48} t1={118.9} text="NEVER DONE MANUAL LABOR" color={C.rojo} x={960} y={930} centro size={56} />
      {t > 118.2 && t < 119.3 && <Grande t={t} t0={118.26} text="PROUD OF IT" y={170} size={110} color={C.ambar} />}
      {t > 125.9 && t < 128.3 && (
        <>
          <Icono k="horca" x={960} y={420} s={1.5} t={t} t0={125.98} />
          <Tacha t={t} t0={126.6} x={960} y={420} r={170} />
          <Grande t={t} t0={127.34} text="FARMERS: 0" y={720} size={120} color="#ff5a6a" />
        </>
      )}
      <Chip t={t} t0={129.4} t1={133.6} text="SUSAN CONSTANT" color={C.violeta} x={420} y={250} centro size={50} />
      <Chip t={t} t0={130.6} t1={133.6} text="GODSPEED" color={C.teal} tinta={C.noche} x={960} y={250} centro size={50} />
      <Chip t={t} t0={131.6} t1={133.6} text="DISCOVERY" color={C.naranja} x={1500} y={250} centro size={50} />
      <Chip t={t} t0={132.26} t1={133.6} text="TINY" color={C.rosa} x={1420} y={760} size={50} />
      <Chip t={t} t0={134.38} t1={136.0} text="THE FUTURE OF AN EMPIRE" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={135.88} t1={138.6} text="NOBODY KNOWS HOW TO GROW CORN" color={C.rojo} x={960} y={930} centro size={54} />
    </AbsoluteFill>
  );
};
