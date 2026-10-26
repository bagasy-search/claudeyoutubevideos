import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza } from "./kit";
import { Persona } from "./persona";
import { CamP, Llave, aPantalla, Llama } from "./mundo";
import { CHICO, SIERVO } from "./objetos";
import { TarjetaTrampa, Marcador } from "./comun";
import { Acostado } from "./T3";

// TRAMPA 7 · EL FUEGO (749,5-813,5 s). 4 de la mañana: todo lo que pusimos adentro arde (juncos, vigas, techo,
// colchones de paja, velas de sebo, juncos encendidos olvidados y el fuego abierto que nadie tapó); por eso la cocina
// iba aparte, en el patio (y se quemaba seguido). Los muros no arden, lo de adentro sí: la chispa, el humo por el techo,
// 20 dormidos, puertas trabadas por dentro y ventanas que son saeteras. Un castillo hecho para dejar el mundo afuera.
export const T0 = 749.5, T1 = 813.5;
export const CAM: Llave[] = [
  [750.6, 2050, 2800, 0.6], [752.4, 5800, 2600, 0.72], [756.6, 5800, 2600, 0.72], [757.4, 5500, 2900, 1.3], [758.4, 5500, 2900, 1.3],
  [759.2, 5800, 2250, 0.9], [762.4, 5800, 2300, 0.78], [763.2, 6200, 2900, 1.3], [764.0, 5000, 2700, 1.25], [766.6, 5300, 2850, 1.3],
  [767.5, 5800, 2850, 1.2], [772.4, 5800, 2800, 1.0], [774.6, 3400, 3250, 0.9], [783.6, 3400, 3250, 0.9], [785.4, 5800, 2600, 0.7],
  [789.4, 5800, 2650, 0.7], [790.3, 5550, 2900, 1.3], [791.3, 5550, 2900, 1.3], [793.2, 5800, 2550, 0.72], [795.8, 5800, 2600, 0.72],
  [796.8, 4770, 2770, 1.3], [800.9, 4770, 2770, 1.3], [801.8, 5150, 2380, 1.4], [806.8, 5150, 2420, 1.3], [808.6, 5800, 2550, 0.7], [813.3, 5800, 2600, 0.75],
];
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PISO = 2965;
// las 7 cosas que arden: [x, y, rótulo, t0]
const COSAS: [number, number, string, number][] = [
  [5500, 2930, "DRY RUSHES", 756.87], [5300, 2100, "WOODEN BEAMS", 758.55], [6300, 2060, "WOODEN ROOF", 759.71], [6200, 2900, "STRAW MATTRESSES", 762.57],
  [4980, 2560, "TALLOW CANDLES", 763.83], [5300, 2880, "FORGOTTEN RUSH LIGHTS", 764.99], [5800, 2880, "AN OPEN FIRE", 767.03],
];
const DORMIDOS: [number, number][] = [[5050, 2], [7050, 4], [5980, 1], [6250, 3], [6550, 5], [6800, 6], [4900, 0], [6950, 2]];

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t < T0 - 1 || t > T1 + 1) return null;
  const tose = t > 791.4;
  return (
    <>
      {DORMIDOS.map(([x, r], i) => {
        const tw = 796.2 + (i % 4) * 0.25; // se despiertan y corren a la puerta trabada
        if (i % 2 === 0 && t > tw) {
          const u = prog(t, tw, tw + 1.6), xd = 4600 + i * 70;
          const golpea = t > tw + 1.6 ? Math.sin(t * 15 + i) * 30 : 0;
          return <Persona key={i} x={x + (xd - x) * u} y={PISO} h={270} t={t} seed={80 + i} ropa={SIERVO(r)} expr="miedo" camina={u < 1 ? 3 : 0} flip={xd < x} bD={u < 1 ? 40 : 150 + golpea} cD={u < 1 ? 20 : 30} bI={u < 1 ? 30 : 140 - golpea} cI={30} />;
        }
        return <Acostado key={i} x={x} y={PISO - 10} h={260} t={t} seed={80 + i} ropa={SIERVO(r)} flip={i % 2 === 1} expr={tose && i % 3 === 0 ? "miedo" : "dormido"} />;
      })}
      {/* el cocinero que huye de la cocina en llamas */}
      {t > 780.2 && t < 785 && <Persona x={3500 - 600 * prog(t, 780.6, 783.6)} y={2965} h={300} t={t} seed={91} ropa={SIERVO(1)} expr="miedo" camina={3} flip bD={150} cD={40} bI={150} cI={40} />}
      {t < 796.4 ? <Acostado x={5300} y={PISO - 10} h={260} t={t} seed={7} ropa={CHICO} expr={tose ? "miedo" : "dormido"} />
        : <Persona x={5300 - 260 * prog(t, 797.2, 798.6)} y={PISO} h={270} t={t} seed={7} ropa={CHICO} expr="miedo" salta={796.4} camina={t > 797.2 && t < 798.6 ? 3 : 0} flip bD={150} cD={150} bI={150} cI={150} />}
      {/* el junco olvidado, encendido en el piso */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <g transform="translate(5300 2950) rotate(-70)"><rect x={-6} y={-90} width={12} height={100} rx={6} fill="#c9b26a" /></g>
        <Llama x={5220} y={2925} t={t} s={0.5} seed={33} />
        {/* la chispa que salta del hogar a los juncos */}
        {t > 789.6 && t < 790.6 && (() => { const u = prog(t, 789.7, 790.4); return <circle cx={5800 - 300 * u} cy={2900 - Math.sin(u * Math.PI) * 260} r={16} fill="#ffd36b" />; })()}
        {/* la cocina del patio en llamas */}
        {t > 780.2 && t < 785 && Array.from({ length: 8 }, (_, i) => <Llama key={i} x={3030 + i * 105} y={2890} t={t} s={(1.2 + (i % 3) * 0.5) * prog(t, 780.3 + i * 0.05, 781)} seed={60 + i} />)}
      </svg>
      {/* las flechas que no entran por la saetera */}
      {t > 803.0 && t < 805.2 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {[0, 1].map((i) => { const u = prog(t, 803.1 + i * 0.4, 803.5 + i * 0.4); const reb = prog(t, 803.5 + i * 0.4, 804.0 + i * 0.4); return <g key={i} transform={`translate(${4800 + u * 300 - reb * 200} ${2300 + (i ? -60 : 50) + reb * 300}) rotate(${reb * 160})`}><line x1={-120} y1={0} x2={0} y2={0} stroke="#7a4a22" strokeWidth={10} /><path d="M 0 -14 L 26 0 L 0 14 Z" fill="#8a8a9a" /></g>; })}
        </svg>
      )}
    </>
  );
};

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t < T0 - 0.5 || t > T1 + 0.6) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const n = COSAS.filter(([, , , t0]) => t >= t0).length;
  const yo = P(5300, PISO - 120);
  const puerta = P(4770, 2740), saet = P(5150, 2300);
  return (
    <>
      <TarjetaTrampa t={t} t0={749.47} t1={751.5} n={7} nombre="THE FIRE" hora="4 AM" color={C.naranja} />
      {t >= 751.61 && t < 753.2 && <><div style={{ position: "absolute", left: 960, top: 180, width: 560, height: 190, transform: "translate(-50%,-50%)", borderRadius: 30, background: "rgba(18,10,28,.85)", opacity: ent(t, 751.61) }} /><Grande t={t} t0={751.61} text="4 AM." y={180} size={150} color={C.crema} /></>}
      <Chip t={t} t0={753.29} t1={756.8} text="THINK ABOUT EVERYTHING WE PUT INSIDE" color={C.naranja} x={960} y={140} centro size={52} />
      {/* las 7 cosas que arden */}
      {t > 756.8 && t < 772.5 && <div style={{ position: "absolute", left: 80, top: 112, width: 640, height: 76 * n + 24, borderRadius: 24, background: "rgba(18,10,28,.82)", border: `4px solid ${C.naranja}`, opacity: ent(t, 756.85) }} />}
      {t > 756.8 && t < 772.5 && COSAS.map(([x, y, label, t0], i) => {
        const p = P(x, y);
        return t >= t0 && p.x > 780 && (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", pointerEvents: "none" }}>
              <div style={{ position: "absolute", left: p.x, top: p.y }}><Marcador t={t} t0={t0} x={0} y={-130} n={i + 1} s={0.8} color={C.naranja} /></div>
            </div>
          </React.Fragment>
        );
      })}
      {t > 756.8 && t < 772.5 && COSAS.map(([, , label, t0], i) => (
        <Chip key={i} t={t} t0={t0} text={`${i + 1}. ${label}`} color={i === 6 ? C.rojo : C.naranja} tinta={i === 6 ? C.crema : C.noche} x={110} y={150 + i * 76} size={40} />
      ))}
      {t > 760.8 && t < 762.5 && <Chip t={t} t0={760.83} text="(SOMETIMES THATCH)" color={C.oro} tinta={C.noche} x={1300} y={150} size={44} />}
      {t > 756.8 && t < 772.5 && (
        <div style={{ position: "absolute", left: 1760, top: 700, transform: `translate(-50%,-50%) scale(${1 + 0.15 * Math.max(0, 1 - (t - (COSAS[n - 1]?.[3] ?? 0)) * 4)})`, fontFamily, fontWeight: 700, fontSize: 120, color: C.naranja, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill" }}>🔥 ×{n}</div>
      )}
      <Chip t={t} t0={769.61} t1={772.5} text="…SOMEONE WAS SUPPOSED TO COVER IT" color={C.violeta} x={960} y={950} centro size={50} />
      {/* la cocina aparte */}
      {t >= 772.51 && t < 774.6 && <Grande t={t} t0={772.51} text="THAT IS WHY…" y={180} size={110} color={C.crema} />}
      <Chip t={t} t0={775.05} t1={778.0} text="THE KITCHEN = A SEPARATE BUILDING" color={C.oro} tinta={C.noche} x={960} y={140} centro size={54} />
      <Chip t={t} t0={776.69} t1={778.0} text="OUT IN THE COURTYARD" color={C.teal} tinta={C.noche} x={960} y={240} centro size={48} />
      {t > 778.0 && t < 779.5 && <div style={{ position: "absolute", left: 960, top: 200, transform: `translate(-50%,-50%) rotate(-6deg) scale(${ent(t, 778.05, 0, { damping: 7, stiffness: 260 })})`, border: `10px solid ${C.rojo}`, borderRadius: 16, padding: "4px 24px", background: "rgba(255,255,255,.92)", fontFamily, fontWeight: 700, fontSize: 64, color: C.rojo, whiteSpace: "nowrap" }}>NOT FOR STYLE</div>}
      {t >= 780.29 && t < 782.3 && <Grande t={t} t0={780.29} text="WHEN IT BURNED DOWN" y={180} size={96} color={C.naranja} />}
      <Chip t={t} t0={781.37} t1={784.4} text="(IT OFTEN DID)" color={C.rojo} x={960} y={280} centro size={52} />
      <Chip t={t} t0={782.37} t1={784.4} text="…THE CASTLE SURVIVED" color={C.lima} tinta={C.noche} x={960} y={950} centro size={54} />
      {t >= 784.67 && t < 786.0 && <Grande t={t} t0={784.67} text="AND CASTLES DID BURN." y={180} size={100} color={C.rojo} />}
      {/* los muros no arden: lo de adentro sí */}
      {t > 786.0 && t < 789.6 && (() => {
        const a = P(4450, 2040), b = P(7200, 2970);
        return (
          <>
            <div style={{ position: "absolute", left: a.x, top: a.y, width: b.x - a.x, height: b.y - a.y, background: C.naranja, mixBlendMode: "multiply", opacity: 0.6 * prog(t, 787.7, 788.4) * (0.8 + 0.2 * Math.sin(t * 9)) }} />
            <div style={{ position: "absolute", left: a.x - 40, top: a.y - 40, width: b.x - a.x + 80, height: b.y - a.y + 80, border: `20px solid ${C.lima}`, borderRadius: 20, opacity: ent(t, 786.1) * (1 - prog(t, 787.6, 787.9)) }} />
          </>
        );
      })()}
      <Chip t={t} t0={786.05} t1={789.6} text="STONE WALLS DO NOT BURN" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={787.75} t1={789.6} text="…EVERYTHING INSIDE THEM DOES" color={C.naranja} tinta={C.noche} x={960} y={240} centro size={56} />
      {/* la chispa */}
      {t >= 789.69 && t < 791.4 && <Grande t={t} t0={789.79} text="A SPARK." y={180} size={140} color="#ffd36b" />}
      <Chip t={t} t0={790.47} t1={791.4} text="…LANDS IN THE RUSHES" color={C.naranja} tinta={C.noche} x={960} y={950} centro size={54} />
      <Chip t={t} t0={791.43} t1={793.3} text="SMOKE ROLLS ALONG THE CEILING" color={C.noche} x={960} y={140} centro size={54} />
      {t >= 793.37 && t < 796.0 && <Grande t={t} t0={793.37} text="20 PEOPLE ASLEEP" y={940} size={110} color={C.crema} />}
      <Chip t={t} t0={795.25} t1={796.0} text="…UNDER IT" color={C.rojo} x={960} y={1040} centro size={44} />
      {t > 792 && t < 796 && <Emote t={t} t0={792.2} tipo="sudor" {...cabeza(yo.x, yo.y, 200 * c.z)} />}
      {/* puertas trabadas por dentro */}
      {t > 796.1 && t < 801.0 && (
        <>
          <div style={{ position: "absolute", left: puerta.x - 300 * c.z, top: puerta.y + 40 * c.z, fontSize: 150, transform: `translate(-50%,-50%) rotate(${Math.sin(t * 15) * 6 * prog(t, 798, 798.3)}deg) scale(${ent(t, 796.7, 0, { damping: 7, stiffness: 260 })})`, filter: "drop-shadow(0 0 18px #ff3b30)" }}>🔒</div>
        </>
      )}
      <Chip t={t} t0={796.09} t1={801.0} text="DOORS BARRED FROM THE INSIDE" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={798.15} t1={801.0} text="…BECAUSE THIS IS A CASTLE" color={C.violeta} x={960} y={240} centro size={48} />
      {t >= 799.71 && t < 801.0 && <Grande t={t} t0={799.71} text="THAT IS THE WHOLE POINT." y={940} size={90} color={C.crema} />}
      {/* ventanas = saeteras */}
      {t > 801.1 && t < 807.2 && <div style={{ position: "absolute", left: saet.x - 90 * c.z, top: saet.y - 200 * c.z, width: 180 * c.z, height: 400 * c.z, borderRadius: 40, border: `12px solid ${C.oro}`, opacity: ent(t, 801.3) }} />}
      <Chip t={t} t0={801.15} t1={807.2} text="WINDOWS = NARROW SLITS" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={803.01} t1={807.2} text="ARROWS CAN'T GET IN 🏹" color={C.lima} tinta={C.noche} x={160} y={880} size={48} />
      {t >= 805.47 && <Chip t={t} t0={805.47} t1={807.2} text="…PEOPLE CAN'T GET OUT" color={C.rojo} x={1060} y={880} size={48} />}
      {t >= 807.29 && t < 809.6 && <Grande t={t} t0={807.45} text="DESIGNED TO KEEP THE WORLD OUT" y={180} size={84} color={C.crema} />}
      {t >= 809.67 && t < 811.6 && <><div style={{ position: "absolute", left: 960, top: 180, width: 1100, height: 190, transform: "translate(-50%,-50%)", borderRadius: 30, background: "rgba(18,10,28,.85)", opacity: ent(t, 809.67) }} /><Grande t={t} t0={809.67} text="4 AM. IN A FIRE." y={180} size={120} color={C.naranja} /></>}
      {t >= 811.67 && t < 813.6 && <Grande t={t} t0={812.07} text="EXACTLY THE PROBLEM." y={940} size={110} color={C.rojo} />}
    </>
  );
};
