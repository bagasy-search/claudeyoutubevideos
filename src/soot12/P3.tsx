import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote, Rayos } from "./kit";
import { Mundo, camEn, Key, SAJON, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, MapaN, lugarN } from "./comun";
import { Cita } from "./escenas";
import { Perro, Caballo, Drakkar, Esqueleto } from "./vik";

// 295,1-393,4 s · TRAMPA 3: LOS PERROS. Cruzás, te pegás al terraplén, un gruñido. Los animales del campamento, el barco
// de Gokstad con sus 6 perros, Gunnar y su perro Sam (la saga de Njal), y vuelta al mundo: docenas de perros, un ladrido son diez.
export const CAM3: Key[] = [
  [295.06, 3560, 880, 1.8], [297.31, 3720, 800, 1.5], [299.0, 3900, 800, 2.1], [303.25, 3980, 760, 1.6],
  [305.0, 4200, 780, 2.0], [307.33, 4380, 800, 3.0],
  [371.68, 4300, 700, 1.2], [373.18, 4900, 680, 0.9], [378.0, 5300, 680, 0.85], [381.6, 4800, 720, 1.3],
  [386.8, 4500, 760, 1.6], [388.5, 5200, 620, 0.55], [393.39, 5300, 640, 0.6],
];

// animalitos planos para las grillas
const Ave: React.FC<{ x: number; y: number; s?: number; pavo?: boolean; t: number; t0: number }> = ({ x, y, s = 1, pavo, t, t0 }) => (
  <svg style={{ position: "absolute", left: x - 120 * s, top: y - 120 * s, overflow: "visible", transform: `scale(${ent(t, t0)})` }} width={240 * s} height={240 * s} viewBox="-120 -120 240 240">
    {pavo && Array.from({ length: 9 }, (_, i) => { const a = -150 + i * 15; const r = Math.PI / 180; return <g key={i}><line x1={0} y1={30} x2={Math.cos(a * r) * 110} y2={30 + Math.sin(a * r) * 110} stroke="#2f8a6a" strokeWidth={14} /><circle cx={Math.cos(a * r) * 110} cy={30 + Math.sin(a * r) * 110} r={16} fill="#2a5ad8" stroke="#f2c230" strokeWidth={5} /></g>; })}
    <ellipse cx={0} cy={40} rx={44} ry={50} fill={pavo ? "#2a6ad8" : "#8a6a4a"} stroke="#2a1530" strokeWidth={7} />
    <circle cx={10} cy={-20} r={26} fill={pavo ? "#2a6ad8" : "#9a7a5a"} stroke="#2a1530" strokeWidth={7} />
    <path d="M 34 -24 L 58 -14 L 34 -6 Z" fill="#f2c230" stroke="#2a1530" strokeWidth={5} />
    <circle cx={16} cy={-24} r={5} fill="#2a1530" />
    {!pavo && <path d="M -40 30 Q -100 0 -110 60 Q -70 50 -40 70 Z" fill="#6a4a2e" stroke="#2a1530" strokeWidth={6} />}
  </svg>
);
const Oveja: React.FC<{ x: number; y: number; s?: number; t: number; t0: number }> = ({ x, y, s = 1, t, t0 }) => (
  <svg style={{ position: "absolute", left: x - 120 * s, top: y - 100 * s, overflow: "visible", transform: `scale(${ent(t, t0)})` }} width={240 * s} height={200 * s} viewBox="-120 -100 240 200">
    {[-50, -20, 30, 60].map((lx) => <rect key={lx} x={lx - 8} y={20} width={16} height={60} fill="#2a1530" />)}
    {[[-50, -10], [-10, -30], [30, -10], [10, 20], [-30, 20], [60, 10]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={42} fill="#f4ead2" stroke="#2a1530" strokeWidth={6} />)}
    <ellipse cx={92} cy={-24} rx={28} ry={34} fill="#3a2a3a" />
    <circle cx={100} cy={-30} r={5} fill="#fff" />
  </svg>
);
// la casa de Gunnar (casa larga) con ventanas que se encienden
export const CasaLarga: React.FC<{ t: number; luz?: number; x?: number; y?: number; s?: number }> = ({ t, luz = 1e9, x = 1250, y = 760, s = 1 }) => {
  const l = prog(t, luz, luz + 0.6);
  return (
    <svg style={{ position: "absolute", left: x - 500 * s, top: y - 360 * s, overflow: "visible" }} width={1000 * s} height={420 * s} viewBox="-500 -360 1000 420">
      <path d="M -460 -120 Q 0 -360 460 -120 L 440 40 L -440 40 Z" fill="#7a5a3a" stroke="#2a1530" strokeWidth={10} />
      <path d="M -470 -110 Q 0 -380 470 -110" fill="none" stroke="#c9a24a" strokeWidth={22} />
      {[-300, -100, 100, 300].map((wx) => <rect key={wx} x={wx - 34} y={-70} width={68} height={60} rx={6} fill={l > 0 ? `rgba(255,200,90,${0.3 + l * 0.7})` : "#1a1020"} stroke="#2a1530" strokeWidth={6} />)}
      <path d="M -40 40 L -40 -50 Q 0 -80 40 -50 L 40 40 Z" fill={l > 0 ? "#ffb84a" : "#2a1530"} />
      <path d="M -470 -110 L -520 -170 M 470 -110 L 520 -170" stroke="#2a1530" strokeWidth={12} strokeLinecap="round" />
    </svg>
  );
};
// Gunnar con el arco
const Arco = (tensa: number) => (
  <g transform="rotate(-80)">
    <path d="M 0 -150 Q 70 0 0 150" fill="none" stroke="#7a4a22" strokeWidth={12} strokeLinecap="round" />
    <path d={`M 0 -150 L ${-30 * tensa} 0 L 0 150`} fill="none" stroke="#f4ead2" strokeWidth={4} />
    {tensa > 0.3 && <line x1={-30 * tensa} y1={0} x2={150} y2={0} stroke="#5e3a1e" strokeWidth={6} />}
  </g>
);

export const P3: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM3);
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 3 · cruzaste la zanja, pegado al terraplén, adentro · y un gruñido */}
      <Escena t={t} t0={295.06} t1={307.36} zoom={0} entra="corte" golpes={[305.1]}>
        <Mundo t={t} cam={cam} e={{ perros: t > 305 ? "alerta" : "duerme" }}>
          {(() => {
            const x = interpolate(t, [295.3, 299.0], [3560, 3880], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const acost = t > 299;
            return <Persona x={x} y={gy(x) + (acost ? 18 : 24)} h={260} t={t} seed={3} ropa={SAJON} expr={t > 305 ? "sorpresa" : "miedo"} inclina={acost ? -24 : 30} habla={t > 299 && t < 303.2} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />;
          })()}
          {/* ojos del perro en la oscuridad */}
          {t > 305 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {[0, 1, 2].map((i) => { const k = ((t - 305 - i * 0.3) % 1.2) / 1.2; return <circle key={i} cx={4440} cy={780} r={40 + k * 140} fill="none" stroke="#ff6a4a" strokeWidth={6} opacity={(1 - k) * 0.7} />; })}
            </svg>
          )}
        </Mundo>
        {t > 305 && <AbsoluteFill style={{ background: "radial-gradient(circle at 55% 55%, transparent 25%, rgba(5,3,18,.7) 60%)" }} />}
        <Cartel t={t} t0={295.1} t1={297.3} n={3} nombre="THE DOGS" />
        <Ch t={t} t0={297.5} t1={303.2} text="ACROSS THE DITCH ✓" color={C.lima} tinta={C.noche} x={120} y={150} size={58} />
        <Ch t={t} t0={299.4} t1={303.2} text="BREATHE THROUGH YOUR MOUTH" color={C.violeta} x={120} y={260} size={52} />
        <G t={t} t0={303.4} t1={305.0} text="INSIDE THE LINE" y={220} size={120} color={C.crema} />
        <G t={t} t0={305.2} text="GRRRR…" y={220} size={150} color={C.rojo} />
      </Escena>
      {/* 1 · la vida vikinga estaba llena de animales · los perros no eran mascotas: eran defensa */}
      <Escena t={t} t0={307.36} t1={314.68} entra="zoom" ix={1150} iy={600} golpes={[309.0, 309.6, 310.2, 310.8, 312.6]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a, #3a5a4a 72%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 790 Q 960 760 1920 790 L 1920 1080 L 0 1080 Z" fill="#2f5a40" /></svg>
        <Caballo x={330} y={640} s={0.75} t={t} t0={309.0} come={t > 310.5} />
        <Oveja x={780} y={720 - Math.abs(Math.sin(t * 3)) * 14} s={1.2} t={t} t0={309.6} />
        <Ave x={1130} y={680 - Math.abs(Math.sin(t * 5)) * 30} s={1.2} t={t} t0={310.2} />
        <Perro x={1430} y={700} s={0.75} t={t} t0={310.8} modo={t > 312.6 ? "ladra" : "alerta"} />
        <Ch t={t} t0={307.6} text="WE FORGET THIS:" color={C.violeta} x={960} y={150} centro size={58} />
        <Ch t={t} t0={308.4} text="FULL OF ANIMALS" color={C.ambar} tinta={C.noche} x={960} y={260} centro size={64} />
        <Sello t={t} t0={312.0} text="NOT PETS" x={1450} y={400} size={80} rot={-8} />
        <G t={t} t0={312.9} text="PART OF THE DEFENSE" y={930} size={96} color={C.crema} />
      </Escena>
      {/* 2 · Gokstad, Noruega: el jefe enterrado en su barco con 12 caballos, 2 halcones, 2 pavos reales y 6 perros */}
      <Escena t={t} t0={314.68} t1={318.0} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[314.68, 900, 500, 1.0], [318.0, 1232, 144, 3.6]]} desde="NORWAY" pulsa={[{ n: "GOKSTAD", t0: 315.6, color: C.ambar, label: "GOKSTAD", lado: "der" }]}>
          {t > 316.2 && <div style={{ position: "absolute", left: lugarN("GOKSTAD").x - 30, top: lugarN("GOKSTAD").y + 20, transform: `translate(-50%,-50%) scale(${0.06 * ent(t, 316.2)})` }}><Drakkar x={0} y={0} s={1} t={t} vela={0} /></div>}
        </MapaN>
        {t > 317.4 && <AbsoluteFill style={{ background: "#1e1840", opacity: prog(t, 317.4, 318.0) }} />}
        <Ch t={t} t0={315.0} text="NORWAY" color={C.teal} tinta={C.noche} x={120} y={150} size={60} />
        <Ch t={t} t0={316.0} text="THE GOKSTAD SHIP BURIAL" color={C.ambar} tinta={C.noche} x={120} y={260} size={54} />
      </Escena>
      <Escena t={t} t0={318.0} t1={325.39} entra="iris" ix={960} iy={420} golpes={[320.3, 321.6, 322.7, 323.9]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #1e1840, #3a2a5a)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 0 520 Q 960 120 1920 520 L 1920 1080 L 0 1080 Z" fill="#5e4428" />
          <path d="M 0 520 Q 960 120 1920 520" fill="none" stroke="#4a8a3a" strokeWidth={30} />
          {Array.from({ length: 24 }, (_, i) => <ellipse key={i} cx={(i * 173) % 1920} cy={600 + (i * 71) % 400} rx={20} ry={9} fill="#4a3420" />)}
        </svg>
        <Drakkar x={960} y={520} s={0.95} t={t} vela={0} escudos />
        <Esqueleto x={960} y={420} s={0.55} t={t} t0={318.6} />
        {/* lo que lo acompañó */}
        {[["12", "HORSES", 320.3, 300], ["2", "HAWKS", 321.6, 760], ["2", "PEACOCKS", 322.7, 1180], ["6", "DOGS", 323.9, 1620]].map(([n, txt, t0, x]) => (
          <div key={txt as string} style={{ position: "absolute", left: (x as number) === 1620 ? 1560 : x as number, top: 830, transform: `translate(-50%,-50%) scale(${ent(t, t0 as number)})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 130, lineHeight: 1, color: txt === "DOGS" ? C.rojo : C.crema, WebkitTextStroke: `8px ${C.noche}`, paintOrder: "stroke" }}>{n}</div>
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 46, color: "#fff", background: txt === "DOGS" ? C.rojo : C.violeta, padding: "2px 18px", borderRadius: 12 }}>{txt}</div>
          </div>
        ))}
        <Ave x={760} y={660} s={0.85} t={t} t0={321.6} />
        <Ave x={1180} y={660} s={0.85} t={t} t0={322.7} pavo />
        <Perro x={1540} y={680} s={0.6} t={t} t0={323.9} modo="alerta" />
        <Caballo x={300} y={650} s={0.5} t={t} t0={320.3} />
        <Ch t={t} t0={318.3} text="THE DEAD CHIEFTAIN TOOK WITH HIM…" color={C.violeta} x={960} y={150} centro size={54} />
      </Escena>
      {/* 3 · eso valía un buen perro: lo bastante para llevarlo a la tumba · y las sagas cuentan qué era un perro de noche */}
      <Escena t={t} t0={325.39} t1={333.39} entra="sube" golpes={[326.6, 330.6]}>
        <Mundo t={t} cam={{ x: 4900, y: 640, z: 0.9 }} />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 35% 60%, transparent 20%, rgba(5,3,18,.75) 60%)" }} />
        <Perro x={640} y={760} s={1.1} t={t} t0={325.5} modo={t > 327.4 && Math.sin(t * 5) > 0 ? "ladra" : "alerta"} />
        {t > 327.4 && [0, 1, 2].map((i) => { const k = ((t - 327.4 - i * 0.3) % 0.9) / 0.9; return <svg key={i} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d={`M ${800 + k * 200} ${420 - k * 60} Q ${860 + k * 260} 560 ${800 + k * 200} ${700 + k * 60}`} fill="none" stroke="#fff3c4" strokeWidth={10} opacity={1 - k} /></svg>; })}
        {t > 327.6 && t < 330.6 && (
          <div style={{ position: "absolute", left: 1080, top: 420, display: "flex", flexDirection: "column", gap: 22, transform: `scale(${ent(t, 327.6)})`, transformOrigin: "0 50%" }}>
            {[["DOG", 4, C.rojo], ["YOU", 1, C.teal]].map(([n, v, col]) => (
              <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 130, fontFamily: "Fredoka", fontWeight: 700, fontSize: 52, color: "#fff" }}>{n}</div>
                <div style={{ height: 64, width: 150 * (v as number) * prog(t, 327.8, 328.8), background: col as string, borderRadius: 14, border: "6px solid #fff" }} />
              </div>
            ))}
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 40, color: C.ambar }}>HEARS 4× FARTHER</div>
          </div>
        )}
        <G t={t} t0={326.6} text="WORTH TAKING TO THE GRAVE" y={190} size={92} color={C.ambar} />
        {t > 330.6 && (
          <div style={{ position: "absolute", left: 1420, top: 560, transform: `translate(-50%,-50%) scale(${ent(t, 330.6)})`, display: "flex", gap: 0 }}>
            <div style={{ width: 440, height: 130, background: "#f4ead2", border: "8px solid #2a1530", borderRadius: "14px 0 0 14px", fontFamily: "Fredoka", fontWeight: 700, fontSize: 60, color: C.noche, display: "flex", alignItems: "center", justifyContent: "center" }}>THE SAGAS</div>
            <div style={{ width: 440, height: 130, background: "#efe2c4", border: "8px solid #2a1530", borderLeft: "none", borderRadius: "0 14px 14px 0", fontFamily: "Fredoka", fontWeight: 700, fontSize: 60, color: C.rojo, display: "flex", alignItems: "center", justifyContent: "center" }}>AT NIGHT…</div>
          </div>
        )}
      </Escena>
      {/* 4 · la saga de Njal: Gunnar y su enorme perro irlandés Sam, listo como un hombre */}
      <Escena t={t} t0={333.39} t1={344.15} entra="barrido" banda={C.ambar} golpes={[335.0, 338.8, 341.4]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2b07a, #ffe2b0 62%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 860 Q 960 800 1920 860 L 1920 1080 L 0 1080 Z" fill="#7aa04a" /></svg>
        <CasaLarga t={t} x={1450} y={820} s={0.75} />
        <Persona x={560} y={1000} h={560} t={t} seed={90} ropa={{ tunica: "#2a6ad8", tunica2: "#1a4aa8", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#e8c97a" }} barba="#e8c97a" expr={t > 336 ? "feliz" : "orgullo"} mira={0.7} miraY={0.4} manoI={Arco(0)} bI={20} bD={t > 335.4 ? 55 + Math.sin(t * 5) * 8 : 10} cD={t > 335.4 ? 20 : 10} />
        <Perro x={830} y={920} s={1.15} t={t} t0={334.6} modo={t > 341.4 ? "ladra" : "alerta"} color="#9a8a7a" />
        <Ch t={t} t0={333.6} text="THE SAGA OF NJAL" color={C.violeta} x={120} y={150} size={58} />
        <Ch t={t} t0={335.0} text="GUNNAR" color={C.rojo} x={120} y={270} size={66} />
        <Ch t={t} t0={336.4} text="SAM · A HUGE IRISH HOUND" color={C.ambar} tinta={C.noche} x={830} y={960} centro size={50} />
        <Ch t={t} t0={338.8} text="AS SMART AS A MAN" color={C.teal} tinta={C.noche} x={1450} y={250} centro size={56} />
        <Ch t={t} t0={341.4} text="BARKS AT EVERY ENEMY" color={C.rojo} x={1450} y={360} centro size={56} />
      </Escena>
      {/* 5 · vienen de noche, lo primero que hacen: matar al perro · no sirvió: un aullido terrible despierta la casa */}
      <Escena t={t} t0={344.15} t1={355.57} entra="corte" golpes={[348.4, 349.6, 350.9, 353.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 860 Q 960 800 1920 860 L 1920 1080 L 0 1080 Z" fill="#1e3a3a" /></svg>
        <CasaLarga t={t} x={1450} y={820} s={0.75} luz={352.6} />
        {Array.from({ length: 6 }, (_, i) => {
          const x = interpolate(t, [344.4, 348.2], [-200 - i * 110, 420 - i * 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <Persona key={i} x={x} y={1000 + (i % 2) * 20} h={420} t={t} seed={400 + i} sombra="#05041a" camina={t < 348.2 ? 1.2 : 0} manoD={<LanzaMano a={70} inclina={-40} largo={360} />} />;
        })}
        {(() => {
          const muere = t > 351.6;
          const k = prog(t, 351.6, 352.2);
          return (
            <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - k * 0.25 }}>
              <Perro x={1000} y={900} s={0.8} t={t} modo={muere ? "duerme" : t > 350.8 ? "aulla" : t > 346 ? "ladra" : "alerta"} color="#9a8a7a" />
            </div>
          );
        })()}
        {t > 350.8 && t < 353.6 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            {[0, 1, 2, 3].map((i) => { const k = ((t - 350.8 - i * 0.22) % 0.9) / 0.9; return <circle key={i} cx={1080} cy={760} r={60 + k * 700} fill="none" stroke="#fff3c4" strokeWidth={10} opacity={(1 - k) * 0.8} />; })}
          </svg>
        )}
        <Flash t={t} t0={350.9} dur={0.2} color="#fff3c4" />
        <Ch t={t} t0={344.4} t1={349.5} text="HIS ENEMIES COME IN THE DARK" color={C.violeta} x={120} y={150} size={56} />
        <Ch t={t} t0={346.4} t1={349.5} text="STEP 1: KILL THE DOG" color={C.rojo} x={120} y={260} size={56} />
        <Sello t={t} t0={349.6} t1={350.8} text="IT DID NOT WORK" x={960} y={320} size={90} rot={-6} />
        <G t={t} t0={350.9} text="AWOOOOO" y={250} size={170} color={C.crema} />
        <Ch t={t} t0={353.0} text="THE WHOLE HOUSE: AWAKE" color={C.ambar} tinta={C.noche} x={1350} y={420} centro size={54} />
      </Escena>
      {/* 6 · lo que dijo Gunnar */}
      <Escena t={t} t0={355.57} t1={364.04} entra="iris" ix={1000} iy={900}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 760 Q 960 700 1920 760 L 1920 1080 L 0 1080 Z" fill="#1e3a3a" /></svg>
        <CasaLarga t={t} x={1500} y={700} s={0.6} luz={355.0} />
        <Perro x={900} y={720} s={0.95} t={t} modo="duerme" color="#9a8a7a" />
        <Persona x={600} y={770} h={480} t={t} seed={90} ropa={{ tunica: "#2a6ad8", tunica2: "#1a4aa8", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#e8c97a" }} barba="#e8c97a" expr="triste" inclina={14} mira={0.7} miraY={0.7} bD={50 + Math.sin(t * 2) * 6} cD={30} />
        <Cita t={t} t0={355.8} texto="You have been hard treated, Sam, my foster child… it may be that we too will not be far apart now." autor="GUNNAR · NJAL'S SAGA" y={880} size={42} w={1560} />
      </Escena>
      {/* 7 · Gunnar, solo con su arco, contra toda la banda: 16 heridos, 2 muertos */}
      <Escena t={t} t0={364.04} t1={371.68} entra="barrido" golpes={[365.2, 366.4, 367.6, 368.5, 370.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a1a4a, #6a3a5a 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 880 L 1920 880 L 1920 1080 L 0 1080 Z" fill="#2a2a3a" /></svg>
        <Persona x={1500} y={1000} h={600} t={t} seed={90} ropa={{ tunica: "#2a6ad8", tunica2: "#1a4aa8", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#e8c97a" }} barba="#e8c97a" expr="enojado" bI={90} cI={0} manoI={Arco(0.5 + Math.sin(t * 7) * 0.5)} />
        {Array.from({ length: 8 }, (_, i) => {
          const t0 = 364.6 + i * 0.8;
          const u = prog(t, t0, t0 + 0.4);
          return u > 0 && u < 1 ? <div key={i} style={{ position: "absolute", left: 1380 - u * 900, top: 640 + (i % 3) * 60, width: 120, height: 8, background: "#5e3a1e" }} /> : null;
        })}
        {Array.from({ length: 9 }, (_, i) => <Persona key={i} x={140 + i * 90} y={1000 + (i % 2) * 24} h={360} t={t} seed={420 + i} sombra="#120a20" camina={0.6} inclina={t > 365.2 + (i % 8) * 0.6 && i % 3 !== 0 ? 50 : 0} />)}
        <Ch t={t} t0={364.3} text="ALONE · ONE BOW" color={C.violeta} x={960} y={150} centro size={60} />
        <Cuenta t={t} t0={365.0} de={0} a={16} dur={4.0} x={620} y={300} size={210} color={C.ambar} />
        <Ch t={t} t0={365.4} text="WOUNDED" color={C.ambar} tinta={C.noche} x={620} y={450} centro size={56} />
        <Cuenta t={t} t0={370.0} de={0} a={2} dur={0.4} x={1080} y={300} size={210} color={C.rojo} />
        <Ch t={t} t0={370.3} text="KILLED" color={C.rojo} x={1080} y={450} centro size={56} />
      </Escena>
      {/* 8 · tu problema: 2.000 hombres no tienen UN perro: tienen docenas · y caballos, y el ganado robado a tus vecinos */}
      <Escena t={t} t0={371.68} t1={393.6} zoom={0} entra="zoom" golpes={[376.7, 378.1, 386.9, 388.6]}>
        <Mundo t={t} cam={cam} e={{ perros: t > 386.8 ? "ladra" : "alerta", despierta: 388.7 }}>
          {/* docenas de perros */}
          {t > 376.6 && Array.from({ length: 18 }, (_, i) => {
            const x = 4300 + i * 175 + (i % 3) * 40;
            return <Perro key={i} x={x} y={826 + (i % 2) * 8} s={0.5} t={t} t0={376.7 + i * 0.04} modo={t > 386.8 + (i % 10) * 0.12 ? "ladra" : "alerta"} flip={i % 2 === 1} color={["#7a6a62", "#5a4a42", "#8a7a6a", "#3a3036"][i % 4]} />;
          })}
          {/* caballos y ganado robado */}
          {t > 378.1 && [[4700, 0], [5800, 1], [6400, 2]].map(([x, i]) => <Oveja key={i} x={x} y={815} s={0.4} t={t} t0={378.9 + i * 0.1} />)}
          {t > 381.8 && t < 386.8 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{[0, 1, 2].map((i) => { const k = ((t - 381.8 - i * 0.35) % 1.05) / 1.05; return <path key={i} d={`M ${4560 + k * 300} ${700 - k * 80} Q ${4640 + k * 380} 790 ${4560 + k * 300} ${880 + k * 80}`} fill="none" stroke="#fff3c4" strokeWidth={14} opacity={1 - k} />; })}</svg>}
        </Mundo>
        <Ch t={t} t0={371.9} t1={376.6} text="SO HERE IS YOUR PROBLEM" color={C.violeta} x={960} y={150} centro size={60} />
        <Ch t={t} t0={373.4} t1={376.6} text="2,000 MEN ≠ 1 DOG" color={C.ambar} tinta={C.noche} x={960} y={260} centro size={60} />
        <G t={t} t0={376.7} t1={378.0} text="DOZENS" y={240} size={180} color={C.rojo} />
        <Ch t={t} t0={378.1} t1={381.5} text="+ HORSES" color={C.teal} tinta={C.noche} x={300} y={160} size={56} />
        <Ch t={t} t0={379.4} t1={381.5} text="+ YOUR NEIGHBORS' STOLEN SHEEP" color={C.ambar} tinta={C.noche} x={300} y={270} size={50} />
        <Ch t={t} t0={381.8} t1={386.7} text="BETTER EARS THAN YOU" color={C.violeta} x={960} y={150} centro size={58} />
        <Ch t={t} t0={384.0} t1={386.7} text="NOTHING TO LOSE" color={C.rojo} x={960} y={260} centro size={58} />
        <G t={t} t0={386.9} t1={388.5} text="1 BARK = 10" y={230} size={150} color={C.crema} />
        <Sello t={t} t0={388.7} text="CAMP: AWAKE" x={760} y={880} size={100} rot={-5} />
        {t > 390.6 && <AbsoluteFill style={{ background: `rgba(4,3,16,${prog(t, 390.6, 391.4) * 0.6})` }} />}
        <Ch t={t} t0={390.9} text="…AND THAT WAS THE QUIET PART" color={C.ambar} tinta={C.noche} x={960} y={540} centro size={64} />
      </Escena>
    </AbsoluteFill>
  );
};

void Particulas; void Emote; void VIK; void barbaDe;
