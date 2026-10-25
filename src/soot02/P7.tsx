import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, APION, CIVIL } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cam, Chip, Grande, Emote, cabeza, Particulas, Rayos } from "./kit";
import { Muro, Fuerte, Arbol, Trampas } from "./kit2";
import { Galera, Remero, MapaMar, Pancarta, CuentaN, Flecha, Carta, DiplomaBronce, Lapida2, IconoTrampa } from "./mar";
import { Egipto, Laurel, Sello } from "./P1";

// soot02 · trampa 7, EL RETIRO (797,89-894,67 s) + CTA (894,67-909,6). Sobreviviste → 26 años, 46 de edad, la espalda rota
// → el diploma: ciudadano, esposa, hijos, el nombre nuevo → las lápidas con el nombre del barco → la meta se corre a 28
// → el giro: la escalera → la segunda carta de Apion → de espaldas 26 años para que los hijos miren adelante → Hadrian's Wall.
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const ESPOSA = CIVIL(2), HIJO = CIVIL(3), HIJA = CIVIL(1);

// escalera de madera: de la aldea al laurel
const Escalera: React.FC<{ t: number; t0: number; x: number; y0: number; y1: number }> = ({ t, t0, x, y0, y1 }) => {
  const u = prog(t, t0, t0 + 0.9);
  const n = 9, alto = (y0 - y1) * u;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
      <line x1={x - 70} y1={y0} x2={x - 70} y2={y0 - alto} stroke="#8a5a2a" strokeWidth={18} strokeLinecap="round" />
      <line x1={x + 70} y1={y0} x2={x + 70} y2={y0 - alto} stroke="#8a5a2a" strokeWidth={18} strokeLinecap="round" />
      {Array.from({ length: n }, (_, i) => { const yy = y0 - ((i + 0.5) / n) * (y0 - y1); return yy >= y0 - alto ? <line key={i} x1={x - 70} y1={yy} x2={x + 70} y2={yy} stroke="#c49058" strokeWidth={14} strokeLinecap="round" /> : null; })}
    </svg>
  );
};
// suelo de pasto y arena para que nadie quede parado sobre el mar
const Suelo: React.FC<{ y?: number; c?: string[] }> = ({ y = 880, c = ["#e8c07a", "#d8a85a"] }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    <path d={`M 0 ${y} Q 480 ${y - 40} 960 ${y - 10} Q 1440 ${y + 20} 1920 ${y - 30} L 1920 1080 L 0 1080 Z`} fill={c[0]} />
    <path d={`M 0 ${y + 50} Q 480 ${y + 20} 960 ${y + 40} Q 1440 ${y + 60} 1920 ${y + 30} L 1920 1080 L 0 1080 Z`} fill={c[1]} />
  </svg>
);
// botón de suscripción + campana
const Suscribir: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  if (t < t0) return null;
  const e = ent(t, t0), click = t > t0 + 0.9;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e})`, display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ background: click ? "#6a6f92" : C.rojo, color: "#fff", fontFamily, fontWeight: 700, fontSize: 64, padding: "18px 48px", borderRadius: 22, boxShadow: "0 10px 0 rgba(0,0,0,.3)", transform: `scale(${t > t0 + 0.8 && t < t0 + 1.0 ? 0.92 : 1})` }}>{click ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      <svg width={110} height={110} viewBox="-55 -55 110 110" style={{ transform: `rotate(${t > t0 + 1.2 ? Math.sin(t * 22) * 18 * Math.max(0, 1 - (t - t0 - 1.2)) : 0}deg)`, overflow: "visible" }}>
        <path d="M -30 20 Q -30 -36 0 -38 Q 30 -36 30 20 L 40 30 L -40 30 Z" fill={C.oro} stroke={C.noche} strokeWidth={6} />
        <circle cx={0} cy={40} r={10} fill={C.oro} stroke={C.noche} strokeWidth={5} />
      </svg>
    </div>
  );
};

export const P7: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 797,89 · TRAP #7 · THE RETIREMENT — desde el casco vacío de Plinio subimos al sol */}
    <Escena t={t} t0={797.89} t1={800.33} entra="sube" sale="fundido" fondo="none" golpes={[798.0, 799.2]}>
      <Galera x={960} y={760} s={0.5} t={t} boga={0.4} vela corvus={null} />
      <Pancarta t={t} t0={798.0} n={7} titulo="THE RETIREMENT" y={360} />
    </Escena>

    {/* 800,33 · "But let's say you survived. The bench, the crabs, the rams, the storms." */}
    <Escena t={t} t0={800.33} t1={805.77} entra="fundido" sale="fundido" fondo="none" quieta golpes={[800.4, 802.2, 803.0, 803.9, 804.7]}>
      <Suelo y={870} />
      <Persona x={960} y={900} h={480} t={t} seed={7} ropa={APION} expr={t < 802 ? "sorpresa" : "orgullo"} bI={t > 805 ? 160 : 30} bD={t > 805 ? 160 : 30} cI={20} cD={20} />
      <Chip t={t} t0={800.4} text="LET'S SAY YOU SURVIVED" color={C.violeta} x={960} y={130} centro size={60} />
      {[["THE BENCH", 2, 802.17], ["THE CRABS", 3, 803.03], ["THE RAMS", 4, 803.85], ["THE STORMS", 6, 804.73]].map(([txt, n, t0], i) => {
        const tt = t0 as number;
        if (t < tt) return null;
        const x = [330, 690, 1230, 1590][i];
        return (
          <React.Fragment key={i}>
            <svg style={{ position: "absolute", left: x - 90, top: 300, overflow: "visible", transform: `scale(${ent(t, tt)})` }} width={180} height={180} viewBox="-90 -90 180 180"><circle r={86} fill="rgba(27,18,64,.85)" stroke="#fff" strokeWidth={6} /><IconoTrampa n={n as number} s={1.1} /></svg>
            <Chip t={t} t0={tt} text={txt as string} color={C.rojo} x={x} y={520} centro size={38} />
            {t > tt + 0.35 && <div style={{ position: "absolute", left: x, top: 390, width: 150, height: 20, background: "#3fbf5a", borderRadius: 10, transform: `translate(-50%,-50%) rotate(-30deg) scaleX(${ent(t, tt + 0.35)})` }} />}
          </React.Fragment>
        );
      })}
      <Trampas t={t} t0={800.4} n={6} y={980} on="#3fbf5a" />
    </Escena>

    {/* 805,77 · "26 years have passed. You are 46 years old. Back ruined, hands like leather, half deaf from the mallet." */}
    <Escena t={t} t0={805.77} t1={813.71} entra="fundido" sale="fundido" fondo="none" quieta golpes={[805.8, 807.5, 809.1, 810.7, 812.0]}>
      {t < 807.49 && <CuentaN t={t} t0={805.8} t1={807.3} de={0} a={26} x={960} y={420} size={220} color={C.crema} suf=" YEARS" />}
      {t < 807.49 && <Particulas t={t} tipo="destellos" n={30} seed={4} />}
      {t >= 807.49 && <Suelo y={900} />}
      {t >= 807.49 && <Persona x={760} y={940} h={520} t={t} seed={7} ropa={APION} viejo expr={t < 809 ? "neutro" : "triste"} inclina={t > 809.13 ? 14 : 0} bD={t > 810.7 ? 70 : 10} cD={t > 810.7 ? 100 : 10} />}
      {t >= 809.13 && <Emote t={t} t0={809.2} tipo="sudor" {...L(760, 940, 520)} s={1} />}
      {t >= 811.99 && <Emote t={t} t0={812.0} tipo="preg" x={640} y={400} s={0.9} />}
      {t >= 807.49 && <Grande t={t} t0={807.49} text="AGE 46" x={1380} y={260} size={150} color={C.crema} />}
      <Chip t={t} t0={809.13} text="BACK: RUINED" color={C.rojo} x={1380} y={420} centro size={52} />
      <Chip t={t} t0={810.73} text="HANDS: LEATHER" color={C.oro} tinta={C.noche} x={1380} y={520} centro size={52} />
      <Chip t={t} t0={811.99} text="EARS: HALF DEAF (THE MALLET)" color={C.violeta} x={1380} y={620} centro size={42} />
    </Escena>

    {/* 813,71 · "And Rome keeps its promise. Bronze diploma, citizen, legal wife, Roman children, the new name without anyone laughing." */}
    <Escena t={t} t0={813.71} t1={826.75} entra="fundido" sale="fundido" fondo="none" quieta golpes={[813.8, 815.4, 817.6, 819.2, 821.0, 822.8, 825.0]}>
      {t < 819.15 && <Rayos t={t} x={960} y={520} op={0.16} />}
      {t < 819.15 && <DiplomaBronce x={960} y={540} s={1.1} t={t} t0={815.35} abre={prog(t, 815.6, 816.4)} />}
      {t > 817.55 && t < 819.15 && <Laurel x={960} y={250} s={1.6 * ent(t, 817.6)} />}
      <Chip t={t} t0={813.71} t1={815.3} text="ROME KEEPS ITS PROMISE" color={C.violeta} x={960} y={140} centro size={60} />
      <Chip t={t} t0={815.35} t1={819.1} text="BRONZE DIPLOMA" color={C.oro} tinta={C.noche} x={960} y={900} centro size={56} />
      <Chip t={t} t0={817.55} t1={819.1} text="ROMAN CITIZEN ✓" color="#3fbf5a" x={960} y={990} centro size={52} />
      {t >= 819.15 && (
        <>
          <Suelo y={890} c={["#7aae5a", "#5c8f3e"]} />
          <Persona x={640} y={920} h={500} t={t} seed={7} ropa={APION} viejo expr="orgullo" bD={60} cD={40} />
          <Persona x={900} y={920} h={460} t={t} seed={171} ropa={ESPOSA} expr="feliz" aparece={819.2} />
          {t >= 820.99 && <Persona x={1140} y={920} h={300} t={t} seed={172} ropa={HIJO} expr="feliz" aparece={821.0} salta={Math.abs(Math.sin(t * 5)) * 14} />}
          {t >= 820.99 && <Persona x={1300} y={920} h={270} t={t} seed={173} ropa={HIJA} expr="feliz" aparece={821.2} />}
          <Emote t={t} t0={819.3} tipo="brillos" {...L(900, 920, 460)} s={0.8} />
        </>
      )}
      <Chip t={t} t0={819.15} t1={822.7} text="LEGAL WIFE ✓" color="#3fbf5a" x={1500} y={160} centro size={50} />
      <Chip t={t} t0={820.99} t1={822.7} text="ROMAN CHILDREN ✓" color="#3fbf5a" x={1500} y={260} centro size={50} />
      {t >= 822.77 && <Grande t={t} t0={822.77} text="ANTONIUS MAXIMUS" x={960} y={200} size={120} color={C.crema} />}
      <Chip t={t} t0={825.0} text="NOBODY LAUGHS" color={C.rojo} x={960} y={330} centro size={50} />
    </Escena>

    {/* 826,83 · "Many veterans stayed near Misenum and Ravenna. Their tombstones still survive. The ship's name like a coat of arms. The Mars. The Triton. The Victoria. The Hope." */}
    <Escena t={t} t0={826.75} t1={831.19} entra="fundido" sale="fundido" fondo="#1f5c9c" golpes={[826.9, 828.2, 829.3]}>
      <MapaMar t={t} puntos={[{ n: "MISENUM", t0: 828.2, color: C.rojo }, { n: "RAVENNA", t0: 829.3, color: C.oro }]} zoom={{ n: "ROME", z: 2.2, t: [826.9, 828.0] }} />
      <Chip t={t} t0={826.9} text="THE VETERANS STAYED" color={C.violeta} x={960} y={140} centro size={58} />
    </Escena>
    <Escena t={t} t0={831.19} t1={842.09} entra="fundido" sale="fundido" fondo="none" quieta golpes={[831.2, 833.4, 838.55, 839.4, 840.35, 841.4]}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 820 Q 480 760 960 790 Q 1440 820 1920 770 L 1920 1080 L 0 1080 Z" fill="#5c8f3e" /><path d="M 0 880 Q 480 840 960 860 Q 1440 880 1920 850 L 1920 1080 L 0 1080 Z" fill="#4a7a30" /></svg>
      {[["MARS", 838.53], ["TRITON", 839.39], ["VICTORIA", 840.35], ["SPES", 841.39]].map(([b, t0], i) => {
        const tt = t0 as number, x = 300 + i * 440;
        const luz = t >= tt ? ent(t, tt) : 0;
        return (
          <React.Fragment key={i}>
            <Lapida2 x={x} y={700} s={0.78} t={t} t0={831.3 + i * 0.25} barco={b as string} anos={["XXVI", "XXVI", "XXVIII", "XXVI"][i]} />
            {t >= tt && <div style={{ position: "absolute", left: x, top: 470, width: 260, height: 70, borderRadius: 35, transform: "translate(-50%,-50%)", background: `rgba(255,210,122,${0.45 * luz})`, filter: "blur(16px)" }} />}
            {t >= tt && <Chip t={t} t0={tt} text={["THE MARS", "THE TRITON", "THE VICTORIA", "THE HOPE"][i]} color={[C.rojo, "#2fb5d8", C.oro, "#3fbf5a"][i]} tinta={i === 2 ? C.noche : undefined} x={x} y={960} centro size={44} />}
          </React.Fragment>
        );
      })}
      <Chip t={t} t0={831.19} t1={838.4} text="THEIR TOMBSTONES SURVIVE" color={C.violeta} x={960} y={130} centro size={56} />
      <Chip t={t} t0={833.41} t1={838.4} text="THE SHIP = THE FAMILY CREST" color={C.rojo} x={960} y={230} centro size={50} />
    </Escena>

    {/* 842,09 · "But the deal had one last catch. Rome kept moving the finish line. 26 → 28. Two more years for the same small piece of bronze." */}
    <Escena t={t} t0={842.09} t1={854.43} entra="fundido" sale="fundido" fondo="none" quieta golpes={[842.1, 844.4, 846.5, 849.0, 850.8, 852.1]}>
      {(() => {
        const meta = 1050 + prog(t, 846.6, 850.6) * 420;
        return (
          <>
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
              <rect x={0} y={770} width={1920} height={310} fill="#8a5a2a" />
              <rect x={0} y={760} width={1920} height={24} fill="#c9b8a0" />
              {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 170} y1={784} x2={i * 170} y2={1080} stroke="#6b3a1f" strokeWidth={6} />)}
              <rect x={meta - 8} y={520} width={16} height={260} fill="#fff" />
              <path d={`M ${meta + 8} 520 L ${meta + 120} 550 L ${meta + 8} 580 Z`} fill={C.rojo} />
              <g transform={`translate(520 785) scale(1.1)`}><Remero fase={t * 0.5 * Math.PI * 2} ropa="#2fb5d8" piel="#c98b62" pelo="#d8d0c4" expr="cansado" seed={7} t={t} /></g>
            </svg>
            <CuentaN t={t} t0={846.6} t1={850.6} de={26} a={28} x={meta} y={430} size={110} color={t > 849 ? "#ff6a6a" : C.crema} suf=" YRS" />
          </>
        );
      })()}
      <Chip t={t} t0={842.09} t1={846.4} text="ONE LAST CATCH" color={C.rojo} x={960} y={140} centro size={60} />
      <Chip t={t} t0={844.41} t1={846.4} text="THEY MOVED THE FINISH LINE" color={C.violeta} x={960} y={240} centro size={50} />
      <Chip t={t} t0={846.51} t1={850.7} text="LATER EMPERORS" color={C.violeta} x={420} y={160} size={50} />
      <Chip t={t} t0={850.81} text="+2 MORE YEARS OF ROWING" color={C.rojo} x={960} y={150} centro size={56} />
      {t >= 852.13 && <DiplomaBronce x={960} y={930} s={0.35} t={t} t0={852.15} abre={1} />}
      <Chip t={t} t0={852.13} text="SAME SMALL BRONZE" color={C.oro} tinta={C.noche} x={960} y={250} centro size={48} />
    </Escena>

    {/* 854,43 · "So, was rowing on a Roman warship a death trap? Here is the twist." */}
    <Escena t={t} t0={854.43} t1={859.01} entra="fundido" sale="fundido" fondo="#14122a" golpes={[855.0, 857.75]}>
      <Grande t={t} t0={855.0} text="A DEATH TRAP?" y={430} size={170} color={C.crema} />
      <Trampas t={t} t0={855.2} n={7} y={600} />
      <Chip t={t} t0={857.75} text="HERE IS THE TWIST" color={C.rojo} x={960} y={800} centro size={66} />
    </Escena>

    {/* 859,01 · "Thousands still lined up, willingly. For a poor kid in Egypt or Thrace, the fleet was a ladder — maybe the only one." */}
    <Escena t={t} t0={859.01} t1={872.63} entra="fundido" sale="fundido" fondo="none" quieta golpes={[859.1, 861.6, 862.6, 866.2, 867.5, 868.7, 870.5]}>
      {t < 862.59 && (
        <>
          <Galera x={1500} y={760} s={0.6} t={t} boga={0} vela corvus={null} balanceo={0.3} />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <rect x={0} y={860} width={1300} height={220} fill="#b5a080" />
            {Array.from({ length: 60 }, (_, i) => {
              const x = 1180 - i * 34 + (t - 859) * 30, y = 860 - (i % 2) * 6;
              const e = ent(t, 859.1 + i * 0.02);
              return <g key={i} transform={`translate(${x} ${y}) scale(${e * 0.9})`}><circle cx={0} cy={-58} r={14} fill={["#f2b48a", "#c98b62", "#8d5a3b", "#f5c7a0"][i % 4]} /><path d="M -16 0 L -12 -42 L 12 -42 L 16 0 Z" fill={["#3fa7a0", "#e0a63a", "#7a5bd1", "#5c8f3e", "#c9673f"][i % 5]} /></g>;
            })}
          </svg>
        </>
      )}
      <Chip t={t} t0={859.01} t1={862.5} text="THOUSANDS LINED UP" color={C.violeta} x={600} y={160} centro size={56} />
      <Chip t={t} t0={861.59} t1={862.5} text="WILLINGLY" color={C.rojo} x={600} y={260} centro size={60} />
      {t >= 862.59 && (
        <>
          <Egipto t={t} />
          <Persona x={620} y={960} h={380} t={t} seed={7} ropa={APION} expr={t < 866 ? "neutro" : t < 868.7 ? "sorpresa" : "feliz"} mira={1} miraY={-1} />
          {t >= 866.15 && <Escalera t={t} t0={866.2} x={960} y0={960} y1={200} />}
          {t >= 868.71 && <Laurel x={960} y={170} s={1.5 * ent(t, 868.8)} />}
        </>
      )}
      <Chip t={t} t0={862.59} t1={866.0} text="A POOR KID · EGYPT · THRACE" color={C.oro} tinta={C.noche} x={960} y={140} centro size={50} />
      <Chip t={t} t0={866.15} text="THE FLEET = A LADDER" color={C.violeta} x={1440} y={300} centro size={52} />
      <Chip t={t} t0={867.49} text="MAYBE THE ONLY ONE" color={C.rojo} x={1440} y={400} centro size={46} />
      <Chip t={t} t0={868.71} text="NOBODY → ROMAN" color="#3fbf5a" x={1440} y={520} centro size={52} />
      <Chip t={t} t0={870.51} text="CHILDREN: ROMAN FOREVER" color={C.oro} tinta={C.noche} x={1440} y={620} centro size={44} />
    </Escena>

    {/* 872,63 · "Remember Apion? Years later, another letter to his sister. Still in the navy. Signs as Antonius Maximus. Greetings from his own children. He made it." */}
    <Escena t={t} t0={872.63} t1={883.87} entra="fundido" sale="fundido" fondo="none" quieta golpes={[872.7, 874.5, 876.8, 878.1, 880.2, 882.9]}>
      <Suelo y={900} c={["#7aae5a", "#5c8f3e"]} />
      {t < 874.5 && <Persona x={960} y={960} h={520} t={t} seed={7} ropa={APION} expr="feliz" bD={140} cD={30} />}
      <Chip t={t} t0={872.63} t1={874.4} text="REMEMBER APION?" color={C.violeta} x={960} y={140} centro size={62} />
      {t >= 874.51 && <Carta x={760} y={560} s={1.0} t={t} t0={874.51} escribe={prog(t, 874.8, 878.0)} lineas={7} titulo="TO MY SISTER" firma="Antonius Maximus" />}
      <Chip t={t} t0={873.83} text="YEARS LATER" color={C.oro} tinta={C.noche} x={1500} y={160} centro size={48} />
      <Chip t={t} t0={876.77} text="STILL IN THE NAVY" color={C.violeta} x={1500} y={260} centro size={46} />
      <Chip t={t} t0={878.05} text="SIGNS: ANTONIUS MAXIMUS" color={C.rojo} x={1500} y={360} centro size={40} />
      {t >= 880.17 && [0, 1, 2].map((i) => <Persona key={i} x={1360 + i * 150} y={900} h={240} t={t} seed={180 + i} ropa={CIVIL(i + 1)} expr="feliz" aparece={880.2 + i * 0.2} bD={i === 1 ? 150 : 30} />)}
      <Chip t={t} t0={880.17} text="+ GREETINGS FROM HIS KIDS" color="#3fbf5a" x={1500} y={460} centro size={40} />
      <Sello t={t} t0={882.91} text="HE MADE IT" x={760} y={560} color="#3fbf5a" size={120} />
    </Escena>

    {/* 883,87 · "Rome built its empire on land, but it held the sea with the backs of men who never saw where they were going. Backwards for 26 years so their children could face forward." */}
    <Escena t={t} t0={883.87} t1={894.67} entra="fundido" sale="fundido" fondo="none" quieta golpes={[883.9, 885.4, 889.3, 892.0]}>
      {t < 889.29 && (
        <Cam t={t} k={[[883.9, 960, 540, 1.0], [889.3, 960, 600, 1.15]]}>
          <Galera x={960} y={720} s={0.95} t={t} boga={0.6} vela corvus={null} balanceo={0.6} />
        </Cam>
      )}
      <Chip t={t} t0={883.87} t1={885.3} text="AN EMPIRE ON LAND" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={885.37} t1={889.2} text="THE SEA: ON THE BACKS OF ROWERS" color={C.rojo} x={960} y={140} centro size={52} />
      {t >= 889.29 && (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 900 Q 960 860 1920 900 L 1920 1080 L 0 1080 Z" fill="#e8c07a" /></svg>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}><g transform="translate(560 900) scale(1.4)"><Remero fase={t * 0.5 * Math.PI * 2} ropa="#2fb5d8" piel="#c98b62" pelo="#d8d0c4" expr="cansado" seed={7} t={t} /></g></svg>
          <Flecha t={t} t0={889.6} x1={760} y1={420} x2={360} y2={420} color={C.rojo} grosor={18} />
          {t >= 891.9 && [0, 1].map((i) => <Persona key={i} x={1300 + i * 200} y={940} h={300 - i * 30} t={t} seed={172 + i} ropa={i ? HIJA : HIJO} expr="feliz" aparece={891.95 + i * 0.2} flip mira={1} />)}
          {t >= 891.9 && <Flecha t={t} t0={892.2} x1={1220} y1={420} x2={1680} y2={420} color="#3fbf5a" grosor={18} />}
        </>
      )}
      <Chip t={t} t0={889.29} text="26 YEARS FACING BACKWARDS" color={C.rojo} x={560} y={300} centro size={44} />
      <Chip t={t} t0={892.0} text="SO THEY COULD FACE FORWARD" color="#3fbf5a" x={1450} y={300} centro size={44} />
    </Escena>

    {/* 894,67 · CTA — "26 years on a Roman bench, subscribe and hit the bell, next time... Hadrian's Wall, and tell me which trap would have got you first" */}
    <Escena t={t} t0={894.67} t1={900.95} entra="fundido" sale="paneo" fondo="none" quieta golpes={[894.7, 897.9, 898.9]}>
      <Suelo y={900} />
      <Persona x={560} y={960} h={480} t={t} seed={7} ropa={APION} expr="feliz" bD={150} cD={20} habla />
      <Chip t={t} t0={894.7} text="26 YEARS ON A ROMAN BENCH" color={C.violeta} x={1180} y={260} centro size={52} />
      <Suscribir t={t} t0={897.91} x={1180} y={480} />
    </Escena>
    <Escena t={t} t0={900.95} t1={909.7} entra="paneo" sale="nada" fondo="none" quieta golpes={[901.0, 903.6, 904.7, 906.0]}>
      {t < 904.65 && (
        <Cam t={t} k={[[901.0, 960, 540, 1.0], [904.6, 960, 560, 1.12]]}>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <path d="M 0 700 Q 300 560 640 640 Q 980 720 1280 580 Q 1600 470 1920 600 L 1920 1080 L 0 1080 Z" fill="#7a9a6a" />
            <path d="M 0 860 Q 480 780 960 840 Q 1440 900 1920 820 L 1920 1080 L 0 1080 Z" fill="#5c7a4a" />
          </svg>
          <Muro x={960} y={660} w={2000} h={150} t={t} t0={901.2} d={2.2} />
          <Fuerte x={1200} y={560} s={0.55} t={t} t0={902.0} piedra />
          <Arbol x={260} y={760} s={0.4} />
          <Arbol x={1700} y={720} s={0.35} />
        </Cam>
      )}
      {t < 904.65 && <Chip t={t} t0={901.0} text="NEXT: THE EDGE OF THE WORLD" color={C.violeta} x={960} y={140} centro size={54} />}
      {t >= 903.63 && t < 904.65 && <Grande t={t} t0={903.63} text="HADRIAN'S WALL" y={300} size={140} color={C.crema} />}
      {t >= 904.65 && (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2d1b69, #14122a 75%)", opacity: prog(t, 904.65, 905.0) }} />
          <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
            {Array.from({ length: 7 }, (_, i) => {
              const e = ent(t, 906.0 + i * 0.12), x = 240 + i * 240, sel = Math.floor((t - 907.2) * 3) % 7 === i && t > 907.2;
              return <g key={i} transform={`translate(${x} 560) scale(${e * (sel ? 1.18 : 1)})`}><circle r={100} fill={sel ? C.rojo : "rgba(255,255,255,.12)"} stroke="#fff" strokeWidth={6} /><IconoTrampa n={i + 1} s={1.2} /><text y={150} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#fff">#{i + 1}</text></g>;
            })}
          </svg>
          <Chip t={t} t0={904.7} text="TELL ME IN THE COMMENTS" color={C.violeta} x={960} y={200} centro size={58} />
          <Chip t={t} t0={906.01} text="WHICH TRAP GETS YOU FIRST?" color={C.rojo} x={960} y={860} centro size={58} />
        </>
      )}
    </Escena>
  </>
);
