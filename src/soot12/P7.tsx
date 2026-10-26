import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote, Rayos, fontFamily } from "./kit";
import { Mundo, camEn, Key, SAJON, SENOR, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, MapaN, lugarN, Globo } from "./comun";
import { Cita } from "./escenas";
import { Corona, Iglesia, Esqueleto, Drakkar, Tienda, Perro } from "./vik";
import { Craneo } from "./kit2";

// 667,7-779,8 s · TRAMPA 7: LA MAÑANA DESPUÉS. Lo imposible: ganaste. Pero siempre hay más: la red vikinga, el día de San
// Bricio (1002), Oxford, la fosa de 30+ jóvenes, Gunnhild, Sven Barba de Horquilla rey de Inglaterra (1013) y la fosa de Dorset.
export const CAM7: Key[] = [
  [667.71, 5000, 720, 1.0], [670.47, 4900, 700, 0.9], [673.83, 5200, 700, 0.75], [680.2, 5400, 700, 0.8],
  [681.51, 5750, 610, 0.8], [685.87, 5820, 590, 0.84],
  [758.64, 5200, 640, 0.5], [762.02, 5300, 680, 0.6],
];
const VERDE = { tunica: "#4f8a5a", tunica2: "#2f5e3a", cinto: "#5a3418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#a8552a" };
const ETHELRED = { tunica: "#a8283a", tunica2: "#6a1a2a", cinto: "#c9a24a", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#c9a24a" };
const SVEN = { tunica: "#2a2a4a", tunica2: "#1a1a30", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2418" };

// cámara del mapa de la red (la misma que se le pasa al MapaN) y el tirón de los hilos
const camN = (t: number) => camEn(t, [[685.87, 820, 388, 0.7], [695.9, 820, 388, 0.74]]);
const tiron = (t: number, i: number) => { const k = (t - 689.6) % 1.0; return t > 689.6 && k < 0.35 ? Math.sin((k / 0.35) * Math.PI) * (20 + (i % 3) * 6) : 0; };
const cava2 = (t: number) => t > 765.0 && t < 770.6;
const CartelP: React.FC<{ t: number; t0: number; t1: number; n: number; nombre: string }> = ({ t, t0, t1, n, nombre }) => {
  if (t < t0 || t > t1) return null;
  const e = ent(t, t0, 0, { damping: 12, stiffness: 160 });
  const out = interpolate(t, [t1 - 0.3, t1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 960, top: 250, transform: `translate(-50%,-50%) scale(${e * out}) rotate(${(1 - e) * -10}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 60, color: C.noche, background: C.ambar, padding: "6px 34px", borderRadius: 18, letterSpacing: 4, boxShadow: "0 8px 0 rgba(10,5,30,.5)" }}>TRAP #{n}</div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 110, color: C.crema, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${C.noche}`, marginTop: 6, whiteSpace: "nowrap" }}>{nombre}</div>
        <div style={{ display: "flex", gap: 22, marginTop: 14 }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{ width: 42, height: 42, borderRadius: 21, border: "6px solid #fff", background: i < n ? C.rojo : "rgba(255,255,255,.15)", transform: `scale(${ent(t, t0, 0.15 + i * 0.05) * (i === n - 1 ? 1 + 0.2 * Math.sin(t * 9) : 1)})`, boxShadow: i === n - 1 ? `0 0 30px ${C.rojo}` : undefined }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const P7: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM7);
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 7 · REDISEÑO v5 en 3 tiros: (1) los ingleses se infiltran agachados · (2) amanece y el chico respira aliviado
          · (3) de cada carpa sale UN vikingo que se estira, bosteza, ve al chico y agarra el hacha */}
      <Escena t={t} t0={667.71} t1={685.87} zoom={0} entra="corte" golpes={[673.9, 675.4, 676.9, 678.4, 680.3, 681.6, 683.0]}>
        {t < 673.85 && <Tiro84a t={t} />}
        {t >= 673.85 && t < 681.5 && <Tiro84b t={t} />}
        {t >= 681.5 && <Tiro84c t={t} />}
        <Flash t={t} t0={673.85} dur={0.15} color="#fff4d6" />
        <Flash t={t} t0={681.5} dur={0.15} color="#000" />
        {t > 680.2 && t < 681.5 && <Particulas t={t} tipo="destellos" n={60} seed={7} />}
        <CartelP t={t} t0={667.8} t1={670.4} n={7} nombre="THE MORNING AFTER" />
        <Ch t={t} t0={670.6} t1={673.8} text="NOW IMAGINE THE IMPOSSIBLE" color={C.violeta} x={960} y={150} centro size={58} />
        <G t={t} t0={672.4} t1={673.8} text="YOU DID IT" y={270} size={130} color={C.lima} />
        <Ch t={t} t0={673.9} t1={680.1} text="DOG: QUIET ✓" color={C.lima} tinta={C.noche} x={110} y={150} size={50} />
        <Ch t={t} t0={675.4} t1={680.1} text="GUARD: ASLEEP ✓" color={C.lima} tinta={C.noche} x={110} y={240} size={50} />
        <Ch t={t} t0={676.9} t1={680.1} text="DITCH: DRY ✓" color={C.lima} tinta={C.noche} x={110} y={330} size={50} />
        <Ch t={t} t0={678.4} t1={680.1} text="CAUGHT IN THEIR BEDS ✓" color={C.lima} tinta={C.noche} x={110} y={420} size={50} />
        <G t={t} t0={680.3} t1={681.5} text="CONGRATULATIONS" y={200} size={120} color={C.ambar} />
        <Ch t={t} t0={681.6} text="THE MOST DANGEROUS TRAP OF ALL" color={C.rojo} x={900} y={140} centro size={54} />
        <Cuenta t={t} t0={683.0} de={1} a={2000} dur={1.3} x={1690} y={150} size={96} color={C.crema} />
        <G t={t} t0={683.0} text="THERE'S ALWAYS MORE OF THEM" y={985} size={84} color={C.crema} />
      </Escena>
      {/* 1 · no vivían en un campamento: vivían en una red · hermanos, primos, juramentados, otras flotas, otros ejércitos · y memoria larga */}
      <Escena t={t} t0={685.87} t1={695.95} zoom={0} entra="zoom" golpes={[689.6, 690.6, 691.6, 692.6, 693.6, 694.6]}>
        <MapaN t={t} cam={[[685.87, 820, 388, 0.7], [695.9, 820, 388, 0.74]]} desde="NORWAY"
          pulsa={[{ n: "DENMARK", t0: 688.2, color: C.rojo }, { n: "NORWAY", t0: 688.4, color: C.rojo }, { n: "DUBLIN", t0: 688.6, color: C.rojo }, { n: "REPTON", t0: 688.8, color: C.rojo }, { n: "PARIS", t0: 689.0, color: C.rojo }, { n: "LEUVEN", t0: 689.2, color: C.rojo }]}
          rutas={[["DENMARK", "NORWAY"], ["NORWAY", "DUBLIN"], ["DUBLIN", "REPTON"], ["REPTON", "DENMARK"], ["DENMARK", "LEUVEN"], ["LEUVEN", "PARIS"], ["PARIS", "REPTON"]].map(([de, a], i) => ({ de, a, t0: 688.4 + i * 0.22, color: C.ambar, curva: 50, dur: 0.6, ancho: 8 }))}>
          {["DENMARK", "NORWAY", "DUBLIN", "REPTON", "PARIS", "LEUVEN"].map((n, i) => t > 688.2 + i * 0.2 && (
            <div key={n} style={{ position: "absolute", left: lugarN(n).x, top: lugarN(n).y - 30 + tiron(t, i) * 0.6, transform: `translate(-50%,-50%) scale(${ent(t, 688.2 + i * 0.2)})` }}>
              <div style={{ position: "relative", width: 110, height: 110, borderRadius: 55, background: "#f4ead2", border: "6px solid #2a1530", overflow: "hidden" }}>
                <Persona x={55} y={175} h={150} t={t} seed={790 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={i % 2 ? "enojado" : "orgullo"} soloCabeza />
              </div>
            </div>
          ))}
        </MapaN>
        {/* el jefe que mueve los hilos: tira y los nodos se sacuden */}
        {t > 688.0 && (() => {
          const c = camN(t);
          const hx = 1690 - 217 * 0.946, hy = 1010 - 410 * 0.946 + tiron(t, 0) * 0.8;
          return <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              {["DENMARK", "NORWAY", "DUBLIN", "REPTON", "PARIS", "LEUVEN"].map((n, i) => t > 688.3 + i * 0.2 && <line key={n} x1={hx} y1={hy} x2={960 + (lugarN(n).x - c.x) * c.z} y2={540 + (lugarN(n).y - 30 - c.y) * c.z + tiron(t, i) * 0.6 * c.z} stroke="#f4ead2" strokeWidth={3} opacity={0.75} />)}
            </svg>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${(1 - prog(t, 688.0, 688.5)) * 500}px)` }}>
              <Persona x={1690} y={1010} h={530} t={t} seed={799} ropa={VIK(3)} casco="vikingo" barba="#c9c4c0" expr="orgullo" flip mira={-0.8} bD={130} cD={-20} bI={20} cI={10}
                manoD={<g transform="rotate(30)"><rect x={-70} y={-10} width={140} height={18} rx={8} fill="#8a5a32" stroke="#2a1530" strokeWidth={5} /></g>} />
            </div>
          </>;
        })()}
        <Ch t={t} t0={686.0} t1={688.0} text="NOT ONE CAMP" color={C.violeta} x={960} y={110} centro size={60} />
        <G t={t} t0={688.1} text="A NETWORK" y={130} size={96} color={C.crema} />
        {["BROTHERS", "COUSINS", "SWORN FRIENDS", "OTHER FLEETS", "OTHER ARMIES", "A LONG MEMORY"].map((s, i) => (
          <Ch key={s} t={t} t0={689.6 + i * 1.0} text={s} color={i === 5 ? C.rojo : [C.teal, C.ambar][i % 2]} tinta={i === 5 ? "#fff" : C.noche} x={110} y={330 + i * 105} size={46} />
        ))}
      </Escena>
      {/* 2 · 1002, 13 de noviembre, día de San Bricio: Etelredo ordena matar a todos los daneses de Inglaterra */}
      <Escena t={t} t0={695.95} t1={706.97} entra="iris" ix={960} iy={540} golpes={[696.2, 699.3, 702.6, 703.0, 703.4, 703.8]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a1a4a, #5a2a4a 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={900} width={1920} height={180} fill="#3a3a3a" /></svg>
        <Iglesia x={1560} y={640} s={0.8} t={t} />
        {/* vecinos que se juntan a leer el decreto */}
        {t > 703.6 && [0, 1].map((k) => { const x = interpolate(t, [703.6 + k * 0.3, 705.0 + k * 0.3], [-200 - k * 120, 800 + k * 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <Persona key={k} x={x} y={1000} h={300} t={t} seed={725 + k} mujer={k === 1} ropa={{ tunica: ["#c8743a", "#2f78a8"][k], tunica2: "#4a3a2a", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#6a3a1a" }} expr={t > 705.2 ? "miedo" : "neutro"} camina={t < 705.0 + k * 0.3 ? 1.6 : 0} bI={t > 705.2 ? 150 : undefined} cI={t > 705.2 ? 70 : undefined} />; })}
        <Persona x={480} y={1060} h={720} t={t} seed={720} ropa={ETHELRED} expr="enojado" bD={t > 702.4 ? 105 : t > 699.3 ? 40 + Math.sin(t * 5) * 20 : 20} cD={t > 702.4 ? 0 : 30} mira={0.6} habla={t > 699.3 && t < 702.4} />
        <Corona x={480} y={1060 - 720 * 1.02} s={0.66} t={t} t0={696.4} />
        <G t={t} t0={696.2} t1={702.4} text="1002" x={1000} y={260} size={200} color={C.ambar} />
        <Ch t={t} t0={699.3} t1={702.4} text="13 NOVEMBER · ST BRICE'S DAY" color={C.violeta} x={1000} y={430} centro size={48} />
        <Ch t={t} t0={700.6} t1={702.4} text="KING ÆTHELRED OF ENGLAND" color={C.rojo} x={1000} y={530} centro size={48} />
        {/* el decreto se clava en la puerta de la iglesia: tres martillazos */}
        {t > 702.5 && (() => {
          const golpes = [703.0, 703.4, 703.8];
          const g = golpes.filter((x) => t > x).length;
          const ult = golpes[Math.max(0, g - 1)];
          const sacude = g > 0 && t - ult < 0.12 ? Math.sin((t - ult) * 80) * 6 : 0;
          const levanta = golpes.some((x) => t > x - 0.3 && t < x);
          return <>
            <div style={{ position: "absolute", left: 1450 + sacude, top: 700, transform: `translate(-50%,-50%) scale(${0.62 * ent(t, 702.6)}) rotate(2deg)`, width: 760, padding: "40px 50px", background: "#f4ead2", border: "10px solid #2a1530", borderRadius: 16, fontFamily, fontWeight: 700, textAlign: "center", color: C.noche }}>
              <div style={{ fontSize: 44, color: "#8a6a3a" }}>BY ORDER OF THE KING</div>
              <div style={{ fontSize: 76, lineHeight: 1.05, marginTop: 16 }}>EVERY DANE<br />IN ENGLAND</div>
              <div style={{ fontSize: 86, color: C.rojo, marginTop: 10 }}>→ KILLED</div>
              {[-330, 330].map((dx, k) => g > k * 2 && <div key={dx} style={{ position: "absolute", left: 380 + dx - 16, top: 14, width: 32, height: 32, borderRadius: 16, background: "#6a6a7a", border: "5px solid #2a1530" }} />)}
            </div>
            {/* el pregonero con el martillo */}
            <Persona x={1150} y={1000} h={380} t={t} seed={726} ropa={{ tunica: "#3a5aa8", tunica2: "#22386e", cinto: "#3b230f", piel: "#e8a880", piel2: "#c98864", pelo: "#3a2418" }} expr="enojado" mira={0.8} bD={levanta ? 150 : 95} cD={levanta ? 40 : 10}
              manoD={<g transform="rotate(180)"><rect x={-6} y={-10} width={12} height={90} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} /><rect x={-26} y={70} width={52} height={28} rx={4} fill="#6a6a7a" stroke="#2a1530" strokeWidth={4} /></g>} />
            {golpes.map((x) => t > x && t < x + 0.3 && <svg key={x} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{[0, 1, 2, 3, 4].map((k) => { const a = k * 1.26 + 0.3, r = 20 + (t - x) * 300; return <line key={k} x1={1250 + Math.cos(a) * r} y1={580 + Math.sin(a) * r} x2={1250 + Math.cos(a) * (r + 24)} y2={580 + Math.sin(a) * (r + 24)} stroke="#fff3a0" strokeWidth={8} strokeLinecap="round" />; })}</svg>)}
          </>;
        })()}
      </Escena>
      {/* 3 · Oxford: un grupo de daneses se refugia en la iglesia de Santa Frideswida · el pueblo la incendia con ellos adentro */}
      <Escena t={t} t0={706.97} t1={714.54} entra="zoom" golpes={[708.6, 711.8]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a1236, #3a2a6a)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={950} width={1920} height={130} fill="#3a3a3a" /></svg>
        <Iglesia x={1200} y={560} s={1.25} t={t} arde={prog(t, 711.8, 713.6)} />
        {/* los daneses (OPACOS) corren a la iglesia y entran por la puerta, uno por uno; después la puerta se cierra */}
        {Array.from({ length: 5 }, (_, i) => {
          const PX = 1456, PY = 960; // puerta de la iglesia (centro abajo)
          const llega = 708.3 + i * 0.32;
          const x = interpolate(t, [707.2, llega], [260 + i * 90 - 300, PX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (t > llega + 0.4) return null;
          const dentro = t > llega;
          const u = dentro ? prog(t, llega, llega + 0.4) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: dentro ? `inset(${PY - 200}px ${1920 - PX - 56}px ${1080 - PY}px ${PX - 56}px)` : "none", filter: `brightness(${1 - u * 0.75})` }}>
              <Persona x={x} y={PY - u * 14} h={175 - u * 25} t={t} seed={730 + i} ropa={VIK(i)} barba={barbaDe(i)} expr="miedo" camina={dentro ? 1.4 : 2.4} mira={dentro ? 0 : -0.8} bD={150} cD={60} bI={150} cI={60} />
            </div>
          );
        })}
        {/* la puerta se cierra */}
        {t > 710.0 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={1400} y={760 + 0} width={112 * prog(t, 710.0, 710.3)} height={200} fill="#6a4a2a" stroke="#2a1530" strokeWidth={6} /></svg>}
        {/* el pueblo llega con antorchas y las tira al techo */}
        {t > 710.6 && Array.from({ length: 4 }, (_, i) => { const x = interpolate(t, [710.6, 711.6], [-120 - i * 120, 240 + i * 130], { extrapolateRight: "clamp" }); const tira = t > 711.6 + i * 0.12; return <Persona key={i} x={x} y={1010} h={300} t={t} seed={740 + i} expr="enojado" ropa={{ tunica: ["#c8743a", "#2f78a8", "#7aa04a", "#8a3a5a"][i], tunica2: "#3a2a1a", cinto: "#2a1a10", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#3a2418" }} camina={t < 711.6 ? 2 : 0} bD={tira ? 160 : 60} cD={tira ? 20 : 40} manoD={tira ? undefined : <g transform="rotate(-150)"><rect x={-6} y={0} width={12} height={110} fill="#6b4022" /><circle cx={0} cy={120} r={22 + Math.sin(t * 20 + i) * 6} fill="#ffb24a" /></g>} />; })}
        {/* antorchas volando hacia el techo */}
        {t > 711.6 && Array.from({ length: 4 }, (_, i) => { const t0 = 711.6 + i * 0.12; const u = prog(t, t0, t0 + 0.55); if (t < t0 || u >= 1) return null; const x0 = 240 + i * 130, y0 = 700, x1 = 900 + i * 110, y1 = 520; return <svg key={"a" + i} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><g transform={`translate(${x0 + (x1 - x0) * u} ${y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 220}) rotate(${u * 540})`}><rect x={-6} y={-55} width={12} height={110} fill="#6b4022" /><circle cx={0} cy={-60} r={22} fill="#ffb24a" /></g></svg>; })}
        {t > 711.8 && <Particulas t={t} tipo="brasas" n={50} seed={13} />}
        <Ch t={t} t0={707.2} text="OXFORD" color={C.ambar} tinta={C.noche} x={120} y={150} size={62} />
        <Ch t={t} t0={708.6} text="ST FRIDESWIDE'S CHURCH · “FOR SAFETY”" color={C.violeta} x={120} y={260} size={46} />
        <Sello t={t} t0={711.9} text="SET ON FIRE" x={420} y={520} size={80} rot={-8} />
      </Escena>
      {/* 4 · hace unos años, en Oxford, desenterraron más de 30 jóvenes tirados en una zanja · ¿víctimas de ese día? */}
      <Escena t={t} t0={714.54} t1={727.35} entra="sube" golpes={[717.0, 719.6, 724.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #a8c8e0, #e0eef4 45%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={0} y={440} width={1920} height={640} fill="#8a6a44" />
          <rect x={0} y={420} width={1920} height={30} fill="#6a9a4a" />
          <path d="M 260 560 L 1660 560 L 1560 960 L 360 960 Z" fill="#5e4428" stroke="#3a2a18" strokeWidth={8} />
          {/* cuadrícula de excavación */}
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={260 + i * 200} y1={540} x2={260 + i * 200} y2={570} stroke="#fff" strokeWidth={4} />)}
          <line x1={240} y1={548} x2={1680} y2={548} stroke="#fff" strokeWidth={4} />
        </svg>
        {Array.from({ length: 12 }, (_, i) => <Esqueleto key={i} x={480 + (i % 4) * 320} y={630 + Math.floor(i / 4) * 95} s={0.6} t={t} t0={717.0 + i * 0.12} rot={(i * 37) % 30 - 15} />)}
        {/* heridas marcadas en rojo sobre los cráneos */}
        {t > 720.4 && Array.from({ length: 6 }, (_, i) => { const k = [0, 2, 5, 7, 9, 10][i]; const cx = 480 + (k % 4) * 320 - 108, cy = 630 + Math.floor(k / 4) * 95; return <svg key={i} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><circle cx={cx} cy={cy} r={34 * ent(t, 720.4 + i * 0.12)} fill="none" stroke={C.rojo} strokeWidth={6} /></svg>; })}
        {(() => {
          // la arqueóloga cepilla, se sobresalta cuando aparece la cuenta y después se queda pensando
          const salto = t > 719.6;
          const piensa = t > 724.2;
          return <Persona x={interpolate(t, [714.6, 716.6], [180, 300], { extrapolateRight: "clamp" })} y={600} h={340} t={t} seed={750} mujer ropa={{ tunica: "#e8a82a", tunica2: "#c8881a", cinto: "#3a2418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2418" }}
            expr={piensa ? "triste" : salto ? "sorpresa" : "neutro"} mira={piensa ? -0.3 : 0.6} miraY={piensa ? -0.4 : 0.6} inclina={salto ? 0 : 12} camina={t < 716.6 ? 1.4 : 0} salta={salto && !piensa ? 719.6 : undefined}
            bD={piensa ? -118 : salto ? 120 : 70 + Math.sin(t * 8) * 14} cD={piensa ? 122 : salto ? 40 : 50} manoD={piensa ? undefined : <g><rect x={-5} y={0} width={10} height={70} fill="#8a5a32" /><rect x={-9} y={66} width={18} height={26} rx={4} fill="#f2d27a" /></g>} />;
        })()}
        <Emote t={t} t0={719.7} t1={724.1} tipo="excl" x={300} y={330} s={0.8} />
        <Ch t={t} t0={714.8} text="A FEW YEARS AGO · OXFORD" color={C.violeta} x={760} y={150} centro size={54} />
        <Cuenta t={t} t0={719.6} de={0} a={30} dur={0.8} x={1450} y={260} size={150} color={C.crema} sufijo="+" />
        <Ch t={t} t0={720.2} text="YOUNG MEN · TERRIBLE WOUNDS" color={C.rojo} x={1200} y={400} centro size={42} />
        <Ch t={t} t0={724.2} text="VICTIMS OF THAT VERY DAY?" color={C.ambar} tinta={C.noche} x={960} y={960} centro size={56} />
      </Escena>
      {/* 5 · una crónica posterior: entre los muertos, Gunnhild, hermana del rey de Dinamarca · quizás no es cierto, pero el rey actuó como si lo fuera */}
      <Escena t={t} t0={727.35} t1={741.38} entra="barrido" banda={C.rojo} golpes={[730.8, 735.3, 739.0]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a2a6a, #0c0a24 80%)" }} />
        <Rayos t={t} x={760} y={540} color="#cfd8ff" op={0.1} />
        {(() => {
          // entra caminando, se presenta, al «no están seguros» se lleva la mano al pecho; al final baja la mirada
          const x = interpolate(t, [727.4, 729.2], [-250, 680], { extrapolateRight: "clamp" });
          const pecho = t > 735.3;
          const saluda = t > 730.8 && t < 735.3;
          return <Persona x={x} y={1050} h={680} t={t} seed={760} mujer corona ropa={{ tunica: "#2a6ad8", tunica2: "#1a4aa8", cinto: "#c9a24a", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#f2d27a" }}
            expr={t > 739.0 ? "triste" : pecho ? "miedo" : saluda ? "orgullo" : "neutro"} camina={t < 729.2 ? 1.3 : 0} mira={pecho ? -0.4 : 0.5} miraY={t > 739.0 ? 0.7 : 0} ladea={t > 739.0 ? -8 : 0}
            bD={pecho ? -92 : saluda ? 110 + Math.sin(t * 5) * 10 : 15} cD={pecho ? 102 : saluda ? 40 : 10} />;
        })()}
        <Emote t={t} t0={739.4} tipo="lagrimas" x={680} y={1050 - 680 * 0.8} s={1.2} />
        {t > 739.0 && <AbsoluteFill style={{ background: `rgba(120,10,30,${prog(t, 739.0, 739.8) * 0.3})` }} />}
        <Ch t={t} t0={727.6} t1={735.2} text="A LATER CHRONICLE CLAIMS…" color={C.violeta} x={1350} y={260} centro size={52} />
        <G t={t} t0={730.8} text="GUNNHILD" x={1350} y={420} size={130} color={C.crema} />
        <Ch t={t} t0={732.0} text="SISTER OF THE KING OF DENMARK" color={C.ambar} tinta={C.noche} x={1350} y={560} centro size={40} />
        <Emote t={t} t0={735.3} tipo="preg" x={900} y={420} s={1.3} />
        <Ch t={t} t0={735.4} text="HISTORIANS AREN'T SURE" color={C.teal} tinta={C.noche} x={1350} y={680} centro size={48} />
        <Sello t={t} t0={739.0} text="HE ACTED AS IF IT WAS" x={1300} y={850} size={58} rot={-6} />
      </Escena>
      {/* 6 · Sven Barba de Horquilla: diez años saqueando Inglaterra · 1013: Etelredo huye, Sven es rey de Inglaterra */}
      <Escena t={t} t0={741.38} t1={754.59} zoom={0} entra="zoom" golpes={[741.6, 747.7, 751.4]}>
        <MapaN t={t} cam={[[741.38, 640, 540, 1.0], [754.5, 700, 600, 1.15]]} desde="NORWAY"
          zona={[{ n: "ENGLAND", t0: 751.4, r: 160, color: C.rojo }]}
          rutas={Array.from({ length: 10 }, (_, i) => ({ de: "DENMARK", a: ["ENGLAND", "EASTANGLIA", "WINCHESTER", "OXFORD", "THANET"][i % 5], t0: 742.4 + i * 0.5, color: C.rojo, curva: 40 + (i % 3) * 40, dur: 0.5, ancho: 8 }))}>
          {(() => { const a = lugarN("DENMARK"), b = lugarN("THANET"); const u = prog(t, 742.4, 747.4); return <div style={{ position: "absolute", left: a.x + (b.x - a.x) * u, top: a.y + (b.y - a.y) * u, transform: `translate(-50%,-50%) scale(0.09)` }}><Drakkar x={0} y={0} s={1} t={t} vela={1} remos={1} /></div>; })()}
          {t > 747.7 && (() => { const a = lugarN("WINCHESTER"), b0 = lugarN("PARIS"); const b = { x: a.x + (b0.x - a.x) * 0.6, y: a.y + (b0.y - a.y) * 0.55 }; const u = prog(t, 747.7, 750.8); return <div style={{ position: "absolute", left: a.x + (b.x - a.x) * u, top: a.y + (b.y - a.y) * u, transform: `translate(-50%,-50%) scale(0.1)` }}>
            <Persona x={-60} y={60} h={520} t={t} seed={721} ropa={ETHELRED} corona expr="miedo" mira={-0.9} bD={150} cD={60} bI={150} cI={60} />
            <Drakkar x={0} y={0} s={1} t={t} vela={0} remos={3} escudos={false} />
          </div>; })()}
        </MapaN>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          {(() => {
            const Y = 990, H = 500, X = 1660;
            const rey = t > 751.4;
            const senala = t > 742.4 && t < 751.4;
            return <>
              <Persona x={X} y={Y} h={H} t={t} seed={770} ropa={SVEN} barba="#3a2418" casco={rey ? "no" : "vikingo"} expr={rey ? "feliz" : t > 747.7 ? "feliz" : "orgullo"} flip mira={senala ? 0.9 : 0} habla={t > 747.7 && t < 751.4} salta={rey ? 751.5 : undefined}
                bD={rey ? 150 : senala ? 95 + Math.sin(t * 4) * 6 : 30} cD={rey ? 50 : senala ? 0 : 10} bI={rey ? 150 : t > 747.7 ? 120 : 20} cI={rey ? 50 : t > 747.7 ? 110 : 10} />
              {rey && <Corona x={X} y={interpolate(t, [751.5, 752.2], [300, Y - H * 1.02], { extrapolateRight: "clamp" })} s={0.5} t={t} t0={751.5} />}
              {/* la barba en horquilla */}
              <svg style={{ position: "absolute", left: X - 72, top: Y - H * 0.62, overflow: "visible" }} width={144} height={126}><path d="M 40 10 L 30 120 L 70 40 L 80 10 Z M 120 10 L 130 120 L 90 40 L 80 10 Z" fill="#3a2418" transform="scale(0.9)" /></svg>
            </>;
          })()}
        </div>
        <Ch t={t} t0={741.6} text="SWEIN FORKBEARD · KING OF DENMARK" color={C.rojo} x={110} y={120} size={48} />
        <G t={t} t0={742.4} text={String(Math.round(interpolate(t, [742.4, 747.4], [1003, 1013], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))} x={330} y={270} size={130} color={C.ambar} />
        <Ch t={t} t0={743.2} t1={747.6} text="RAIDING ENGLAND · AGAIN AND AGAIN" color={C.violeta} x={110} y={370} size={40} />
        <Ch t={t} t0={747.7} text="ÆTHELRED FLEES THE COUNTRY" color={C.teal} tinta={C.noche} x={110} y={370} size={40} />
        <G t={t} t0={751.4} text="KING OF ENGLAND" x={520} y={950} size={96} color={C.crema} />
      </Escena>
      {/* 7 · eso compró un ataque sorpresa exitoso: no paz, un rey danés */}
      <Escena t={t} t0={754.59} t1={762.49} entra="diag" golpes={[758.7, 760.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a, #16123d)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={900} width={1920} height={180} fill="#2f5a40" /></svg>
        {[0, 1, 2, 3].map((i) => {
          // festejan la «paz» saltando; al tacharla se desinflan; con la corona danesa se achican de miedo
          const fest = t < 758.9;
          const base = 754.7 + i * 0.13;
          const salta = fest && t > base ? base + Math.floor((t - base) / 0.75) * 0.75 : undefined;
          const desinfla = t > 758.9 ? prog(t, 758.9, 759.6) : 0;
          const miedo = t > 760.2;
          return <Persona key={i} x={700 + i * 170 - (miedo ? prog(t, 760.2, 761.2) * 80 : 0)} y={980} h={300 - desinfla * 30 - (miedo ? prog(t, 760.2, 760.8) * 20 : 0)} t={t} seed={800 + i} ropa={VERDE} casco="saxon"
            expr={fest ? "feliz" : miedo ? "miedo" : "triste"} salta={salta} inclina={desinfla * 14} mira={miedo ? 0.9 : 0} miraY={!fest && !miedo ? 0.6 : 0}
            bD={fest ? 140 + Math.sin(t * 8 + i) * 12 : miedo ? 150 : 5} cD={fest ? -20 : miedo ? 70 : 0} bI={fest ? 140 + Math.sin(t * 8 + i + 1) * 12 : miedo ? 150 : 5} cI={fest ? -20 : miedo ? 70 : 0} />;
        })}
        {t > 760.3 && [0, 1, 2, 3].map((i) => <Emote key={i} t={t} t0={760.3 + i * 0.1} tipo="sudor" x={700 + i * 170 - prog(t, 760.2, 761.2) * 80} y={980 - 280 * 0.8} s={0.6} />)}
        <Ch t={t} t0={754.8} text="WHAT A SUCCESSFUL SURPRISE ATTACK BOUGHT THE ENGLISH:" color={C.violeta} x={960} y={160} centro size={46} />
        <div style={{ position: "absolute", left: 360, top: 480, transform: `translate(-50%,-50%) scale(${ent(t, 758.7)})` }}>
          <svg width={360} height={300} viewBox="-180 -150 360 300" style={{ overflow: "visible" }}>
            <path d="M -110 0 Q -60 -90 20 -60 Q 80 -110 120 -60 Q 60 -40 70 10 Q 20 80 -60 60 Q -120 60 -110 0 Z" fill="#fff" stroke="#2a1530" strokeWidth={8} />
            <path d="M -160 -130 L 160 130 M 160 -130 L -160 130" stroke={C.rojo} strokeWidth={30} strokeLinecap="round" opacity={prog(t, 759.0, 759.3)} />
          </svg>
          <div style={{ textAlign: "center", fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: "#fff" }}>PEACE</div>
        </div>
        {/* llega el rey danés en persona */}
        {t > 760.2 && (() => { const x = interpolate(t, [760.2, 761.2], [2150, 1580], { extrapolateRight: "clamp" }); return <>
          <Persona x={x} y={980} h={420} t={t} seed={771} ropa={SVEN} barba="#3a2418" expr="orgullo" flip camina={t < 761.2 ? 1.6 : 0} mira={-0.8} bD={t > 761.2 ? 100 : 20} cD={10} />
          <Corona x={x} y={980 - 420 * 1.02} s={0.45} t={t} />
        </>; })()}
        <Ch t={t} t0={761.0} text="A DANISH KING" color={C.ambar} tinta={C.noche} x={1580} y={380} centro size={56} />
      </Escena>
      {/* 8 · y cuando salía al revés: Dorset, 2009, una fosa con ~50 jóvenes escandinavos, todos decapitados · perder no era volver a casa */}
      <Escena t={t} t0={762.49} t1={780.0} entra="iris" ix={960} iy={700} golpes={[764.9, 770.9, 774.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #c8b8a8, #e8dcc8 50%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 0 520 Q 600 300 1200 420 Q 1600 500 1920 460 L 1920 1080 L 0 1080 Z" fill="#7a9a5a" />
          <path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#8a6a44" />
          <ellipse cx={960} cy={860} rx={560} ry={150} fill="#4a3220" />
          {/* la ruta en obra */}
          <rect x={0} y={660} width={1920} height={40} fill="#3a3a44" />
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 200 + 40} y={676} width={100} height={8} fill="#f2c230" />)}
        </svg>
        {/* excavadora: entra, cava (brazo que sube y baja) y FRENA cuando el capataz grita */}
        {(() => {
          const cava = t > 765.0 && t < 770.6;
          const brazo = cava ? Math.sin((t - 765) * 3.2) * 18 : t >= 770.6 ? -14 : 0;
          const x = interpolate(t, [762.6, 764.8, 770.6], [-500, 60, 200], { extrapolateRight: "clamp" });
          return <svg style={{ position: "absolute", left: x, top: 420, overflow: "visible" }} width={420} height={260} viewBox="0 0 420 260">
            <rect x={40} y={110} width={220} height={100} rx={10} fill="#f2c230" stroke="#2a1530" strokeWidth={8} />
            <rect x={150} y={50} width={90} height={70} fill="#f2c230" stroke="#2a1530" strokeWidth={8} /><rect x={165} y={62} width={60} height={40} fill="#9ad8ff" />
            <circle cx={195} cy={86} r={13} fill="#f2b48a" /><path d="M 180 80 Q 195 62 210 80 Z" fill="#f28a2a" />
            <rect x={30} y={200} width={250} height={50} rx={25} fill="#2a2a34" />
            {[60, 110, 160, 210, 255].map((cx) => <circle key={cx} cx={cx} cy={225} r={14} fill="#5a5a66" transform={`rotate(${t < 770.6 ? t * 200 : 0} ${cx} 225)`} />)}
            <g transform={`rotate(${brazo} 260 140)`}><path d="M 260 140 L 360 80 L 400 170 L 350 190 Z" fill="#f2c230" stroke="#2a1530" strokeWidth={8} />
              {cava && Math.sin((t - 765) * 3.2) > 0.3 && <path d="M 360 180 Q 380 200 400 178" stroke="#5e4428" strokeWidth={14} fill="none" strokeLinecap="round" />}</g>
          </svg>;
        })()}
        {cava2(t) && <Particulas t={t} tipo="polvo" n={20} seed={9} />}
        {/* los obreros: el capataz ve el cráneo, corre y frena la máquina; al final se sacan el casco */}
        {[0, 1].map((i) => {
          const para = t > 770.4;
          const x = i === 0 ? interpolate(t, [770.4, 771.4], [1480, 1180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1650;
          const respeto = t > 775.4;
          return <Persona key={i} x={x} y={760} h={300} t={t} seed={810 + i} ropa={{ tunica: "#f28a2a", tunica2: "#c86a1a", cinto: "#3a3a44", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2418" }} casco={respeto ? "no" : "saxon"}
            expr={respeto ? "triste" : t > 770.9 ? "sorpresa" : "neutro"} flip camina={i === 0 && t > 770.4 && t < 771.4 ? 2 : 0} mira={-0.6} miraY={respeto ? 0.8 : 0.5} inclina={respeto ? 12 : 0}
            bD={respeto ? 60 : i === 0 && para ? 150 : t > 770.9 ? 130 : 20} cD={respeto ? 80 : i === 0 && para ? 20 : t > 770.9 ? 90 : 10}
            manoD={respeto ? <g><path d="M -40 0 Q -40 -60 0 -64 Q 40 -60 40 0 Z" fill="#8c7a5c" stroke="#2a1530" strokeWidth={5} /></g> : undefined} />;
        })}
        <Globo t={t} t0={770.5} t1={772.6} x={1180} y={380} text="STOP!" size={60} cola="der" color={C.crema} />
        {t > 770.8 && Array.from({ length: 10 }, (_, i) => <Craneo key={i} x={560 + (i % 5) * 200} y={820 + Math.floor(i / 5) * 80} s={0.32} t={t} t0={770.9 + i * 0.08} />)}
        <Ch t={t} t0={762.7} t1={764.8} text="WHEN IT WENT THE OTHER WAY…" color={C.violeta} x={960} y={150} centro size={56} />
        <Ch t={t} t0={764.9} t1={770.8} text="DORSET · 2009 · ROAD BUILDERS" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={52} />
        {t < 770.8 && <Cuenta t={t} t0={767.0} de={0} a={50} dur={0.8} x={960} y={290} size={140} color={C.crema} prefijo="~" />}
        <Ch t={t} t0={768.2} t1={770.8} text="YOUNG SCANDINAVIAN MEN" color={C.teal} tinta={C.noche} x={960} y={420} centro size={50} />
        <Sello t={t} t0={770.9} t1={774.0} text="ALL BEHEADED" x={560} y={210} size={68} rot={-6} />
        {t > 774 && <AbsoluteFill style={{ background: `rgba(8,6,24,${prog(t, 774, 775) * 0.45})` }} />}
        <G t={t} t0={775.4} text="LOSING ≠ GOING HOME" y={170} size={110} color={C.crema} />
      </Escena>
    </AbsoluteFill>
  );
};

void Flash; void SAJON; void gy; void Cita; void Cartel;

// ───────── E084 · set propio (sin Mundo): cielo que amanece, carpas con durmientes adentro, 3 tiros
const mz = (a: string, b: string, k: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  return `rgb(${[16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k)).join(",")})`;
};
const Cielo84: React.FC<{ t: number; am: number; suelo: number }> = ({ t, am, suelo }) => (
  <>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${mz("#0a0826", "#5a6ac8", am)} 0%, ${mz("#1c1550", "#c88aa8", am)} 45%, ${mz("#4a3290", "#ffc88a", am)} 80%)` }} />
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={(i * 397) % 1920} cy={(i * 173) % 640} r={1.5 + (i % 3)} fill="#fff" opacity={(0.4 + 0.4 * Math.sin(t * 2 + i)) * (1 - am)} />)}
      <path d={`M 0 ${suelo - 60} ${Array.from({ length: 21 }, (_, i) => `L ${i * 96} ${suelo - 60 - (Math.sin(i * 1.3) * 0.5 + 0.5) * 90}`).join(" ")} L 1920 ${suelo} L 0 ${suelo} Z`} fill={mz("#1c1848", "#7a5a8a", am)} />
      <rect x={0} y={suelo} width={1920} height={1080 - suelo} fill={mz("#173a46", "#4a7a52", am)} />
      <rect x={0} y={suelo} width={1920} height={14} fill={mz("#2a6a6a", "#7aaa5a", am)} />
      {Array.from({ length: 60 }, (_, i) => { const x = i * 33 + (i % 4) * 7; return <path key={i} d={`M ${x} ${suelo + 6} q ${4 + Math.sin(t * 1.5 + i) * 4} -26 ${8} -40`} stroke={mz("#2a5a5a", "#5a8a4a", am)} strokeWidth={5} fill="none" />; })}
    </svg>
  </>
);
// carpa con un durmiente adentro: los pies asoman por la puerta y salen «z»
const Carpa84: React.FC<{ t: number; x: number; base: number; s: number; k: number; duerme: boolean; luz?: boolean }> = ({ t, x, base, s, k, duerme, luz }) => (
  <>
    <Tienda x={x} y={base - 180 * s} s={s} k={k} t={t} luz={luz} />
    {duerme && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <ellipse cx={x - 16 * s} cy={base - 8 * s} rx={16 * s} ry={22 * s} fill="#e8dcc0" stroke="#2a1530" strokeWidth={4} />
      <ellipse cx={x + 16 * s} cy={base - 8 * s} rx={16 * s} ry={22 * s} fill="#e8dcc0" stroke="#2a1530" strokeWidth={4} />
      {[0, 1, 2].map((j) => { const q = ((t * 0.6 + j / 3 + k * 0.17) % 1); return <text key={j} x={x + 50 * s + q * 70 * s} y={base - 240 * s - q * 150 * s} fontSize={(26 + q * 30) * s} fontWeight={700} fontFamily={fontFamily} fill="#f4ead2" opacity={Math.sin(q * Math.PI)}>z</text>; })}
    </svg>}
  </>
);
// hacha de mano, mango a lo largo del antebrazo y hoja arriba
const Hacha84: React.FC<{ a: number }> = ({ a }) => (
  <g transform={`rotate(${a})`}>
    <rect x={-8} y={-250} width={16} height={290} rx={7} fill="#8a5a32" stroke="#2a1530" strokeWidth={5} />
    <path d="M 6 -240 Q 80 -268 86 -190 Q 50 -196 6 -196 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={6} strokeLinejoin="round" />
  </g>
);

// tiro 1 · 667,7-673,8: noche, el perro y el guardia duermen; 3 ingleses cruzan agachados a ras del suelo
const Tiro84a: React.FC<{ t: number }> = ({ t }) => {
  const push = 1 + prog(t, 667.71, 673.85) * 0.06;
  const avance = interpolate(t, [667.71, 672.3], [0, 470], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const llegan = t > 672.35;
  const festeja = t > 672.5;
  return (
    <AbsoluteFill>
      <Cielo84 t={t} am={0} suelo={800} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><circle cx={1760} cy={330} r={95} fill="#fff4d6" opacity={0.12} /><circle cx={1760} cy={330} r={58} fill="#fff4d6" /><circle cx={1742} cy={318} r={10} fill="#ece0bc" /></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 900px", transform: `scale(${push})` }}>
        {[[420, 0], [780, 1], [1140, 2], [1500, 0]].map(([x, k]) => <Carpa84 key={x} t={t} x={x} base={812} s={0.72} k={k} duerme />)}
        {/* guardia dormido apoyado en la lanza (vertical, al costado) y el perro enroscado a sus pies */}
        <Persona x={210} y={850} h={290} t={t} seed={77} ropa={VIK(3)} casco="vikingo" barba={barbaDe(3)} expr="dormido" ladea={10 + Math.sin(t * 1.3) * 3} inclina={4} bD={8} cD={4}
          manoD={<LanzaMano a={-4} inclina={0} largo={330} />} />
        <Perro x={330} y={842} s={0.36} t={t} modo="duerme" />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {[0, 1, 2].map((j) => { const q = ((t * 0.5 + j / 3) % 1); return <text key={j} x={250 + q * 50} y={560 - q * 110} fontSize={30 + q * 26} fontWeight={700} fontFamily={fontFamily} fill="#f4ead2" opacity={Math.sin(q * Math.PI)}>z</text>; })}
        </svg>
        {/* los 3 ingleses: el chico adelante, 330 px entre cada uno, pies a ras del suelo */}
        {[0, 1, 2].map((i) => {
          const x = 1180 + avance - i * 330;
          const H = 380;
          const yo = i === 0;
          return <Persona key={i} x={x} y={1010} h={H} t={t} seed={yo ? 3 : 720 + i} ropa={yo ? SAJON : VERDE} casco={yo ? "no" : "saxon"}
            expr={festeja ? "feliz" : llegan ? "orgullo" : i === 1 ? "miedo" : "neutro"} camina={llegan ? 0 : 0.7} inclina={llegan ? (festeja ? -4 : 6) : 20}
            mira={festeja ? (yo ? -0.9 : 0.9) : Math.sin(t * 1.7 + i * 2) * 0.8} miraY={llegan ? 0 : 0.3}
            bD={festeja ? 160 : llegan ? 20 : 30 + Math.sin(t * 4.4 + i) * 8} cD={festeja ? 30 : llegan ? 20 : 95} bI={festeja && !yo ? 150 : llegan ? 20 : 25 - Math.sin(t * 4.4 + i) * 8} cI={festeja && !yo ? 40 : llegan ? 20 : 90} salta={festeja ? 672.55 + i * 0.12 : undefined} />;
        })}
        <Emote t={t} t0={668.6} t1={672.3} tipo="sudor" x={1180 + avance - 330} y={1010 - 380 * 0.8} s={0.8} />
      </div>
    </AbsoluteFill>
  );
};

// tiro 2 · 673,8-681,5: amanece (3 s); primer plano del chico que respira aliviado, se seca la frente y festeja
const Tiro84b: React.FC<{ t: number }> = ({ t }) => {
  const am = prog(t, 673.85, 676.85);
  const seca = t > 674.0 && t < 675.6; // se seca la frente
  const mira = t > 675.6 && t < 678.3; // mira el campamento atrás, asiente
  const pulgar = t > 678.4 && t < 680.2;
  const salta = t > 680.2;
  const X = 1380, Y = 1070, H = 640;
  return (
    <AbsoluteFill>
      <Cielo84 t={t} am={am} suelo={790} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <circle cx={880} cy={800 - am * 170} r={170} fill="#ffd27a" opacity={0.25 * am} />
        <circle cx={880} cy={800 - am * 170} r={105} fill="#ffd27a" opacity={Math.min(1, am * 3)} />
        <rect x={0} y={790} width={1920} height={290} fill={mz("#173a46", "#4a7a52", am)} />
        <rect x={0} y={790} width={1920} height={10} fill={mz("#2a6a6a", "#7aaa5a", am)} />
      </svg>
      {/* el campamento chiquito atrás, todavía dormido */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 0.85 }}>
        {[[230, 0], [470, 1], [1640, 2], [1840, 0]].map(([x, k]) => <Carpa84 key={x} t={t} x={x} base={800} s={0.36} k={k} duerme />)}
      </div>
      <Persona x={X} y={Y} h={H} t={t} seed={3} ropa={SAJON}
        expr={salta || pulgar ? "feliz" : seca ? (t < 674.5 ? "sorpresa" : "feliz") : "feliz"}
        inclina={seca ? -9 * Math.sin(prog(t, 674.0, 675.6) * Math.PI) : salta ? -4 : 0} ladea={seca ? -6 : mira ? Math.sin((t - 675.6) * 5) * 6 : 0}
        mira={mira ? -0.9 : pulgar ? 0.9 : salta ? 0 : -0.2} miraY={seca ? -0.3 : 0}
        bD={salta ? 165 : pulgar ? 92 : 12} cD={salta ? 20 : pulgar ? -6 : 8}
        bI={salta ? 165 : 12} cI={salta ? 20 : 8} salta={salta ? 680.25 : undefined}
        />
      {t > 674.0 && t < 674.9 && [0, 1, 2].map((j) => { const q = prog(t, 674.0 + j * 0.1, 674.8 + j * 0.1); return <div key={j} style={{ position: "absolute", left: X - 190 - q * 130, top: Y - H * 0.74 + j * 26, width: 70 * (1 - q * 0.5), height: 14, borderRadius: 7, background: "#fff", opacity: (1 - q) * 0.8 }} />; })}
      <Globo t={t} t0={674.6} t1={678.3} x={960} y={420} text="PHEW… WE MADE IT?" size={50} cola="der" color="#fff" />
      <Emote t={t} t0={680.3} tipo="brillos" x={X - 40} y={Y - H * 0.9} s={1.1} />
    </AbsoluteFill>
  );
};

// tiro 3 · 681,5-685,9: amanecer pleno; de cada carpa sale UN vikingo (desfasados 0,5 s): se estira, bosteza, ve al chico y agarra el hacha
const Tiro84c: React.FC<{ t: number }> = ({ t }) => {
  const push = 1 + prog(t, 681.5, 685.87) * 0.05;
  const CARPAS: [number, number, number][] = [[600, 1, 681.7], [1320, 2, 682.2], [240, 0, 682.7], [1680, 1, 683.2]];
  const susto = t > 681.95;
  const ultimo = CARPAS.filter(([, , t0]) => t > t0).slice(-1)[0];
  const mirX = ultimo ? (ultimo[0] < 960 ? -0.9 : 0.9) : 0;
  return (
    <AbsoluteFill>
      <Cielo84 t={t} am={1} suelo={850} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><circle cx={300} cy={330} r={150} fill="#fff2b0" opacity={0.25} /><circle cx={300} cy={330} r={90} fill="#ffe08a" /></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 860px", transform: `scale(${push})` }}>
        {CARPAS.map(([x, k, t0]) => <Carpa84 key={x} t={t} x={x} base={858} s={0.86} k={k} duerme={t < t0} luz={t > t0} />)}
        {CARPAS.map(([x, k, t0], i) => {
          if (t < t0) return null;
          const lt = t - t0;
          const estira = lt > 0.25 && lt < 0.95; // brazos arriba + bostezo
          const ve = lt > 0.95; // ve al chico
          const hacha = lt > 1.35; // agarra el hacha vertical
          const haciaChico = x < 960 ? 0.9 : -0.9;
          return <Persona key={x} x={x} y={872} h={380} t={t} seed={730 + i} ropa={VIK(k + i)} casco="vikingo" barba={barbaDe(i + 1)} aparece={t0}
            flip={x > 960} expr={estira ? "dormido" : ve ? (hacha ? "enojado" : "sorpresa") : "neutro"}
            inclina={estira ? -10 : 0} ladea={estira ? Math.sin(lt * 8) * 5 : 0} mira={ve ? Math.abs(haciaChico) : 0}
            bD={estira ? 172 : hacha ? 168 : 20} cD={estira ? 8 : hacha ? 6 : 10} bI={estira ? 172 : 15} cI={estira ? 8 : 10}
            salta={ve && !hacha ? t0 + 0.95 : undefined}
            manoD={hacha ? <Hacha84 a={180} /> : undefined} />;
        })}
        {/* el chico en el medio, a 360 px de cada vikingo: festeja… y se congela */}
        <Persona x={960} y={905} h={340} t={t} seed={3} ropa={SAJON}
          expr={susto ? "miedo" : "feliz"} mira={susto ? mirX : 0} inclina={susto ? 6 : -4}
          bD={susto ? 100 : 160} cD={susto ? 120 : 30} bI={susto ? 100 : 160} cI={susto ? 120 : 30} />
        <Emote t={t} t0={682.0} tipo="sudor" x={960} y={905 - 340 * 0.8} s={0.75} />
      </div>
    </AbsoluteFill>
  );
};
