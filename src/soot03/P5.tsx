import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Colinas, Chip, Grande, MapaPuntos, Particulas, Rayos, Emote, cabeza, Pan, Tienda } from "./kit";
import { Gladius, Letrina, Esponja, Instrumento, Comida, Soldadito, Craneo, Fuerte, Trampas, Calor, Mula } from "./kit2";
import { Cuenta } from "./P1";

// Parte 5 (547,17-659,62 s): trampa 5, el campamento: fiebre, letrinas, la peste antonina, los medici y la comida.
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const Suelo: React.FC<{ y?: number; a?: string; b?: string }> = ({ y = 860, a = "#c9773a", b = "#7a4a20" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
);
const Termometro: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => {
  const k = prog(t, t0, t0 + 1.2);
  return (
    <svg style={{ position: "absolute", left: x - 90 * s, top: y - 330 * s, overflow: "visible", transform: `scale(${ent(t, t0 - 0.3)}) rotate(${Math.sin(t * 9) * 3}deg)` }} width={180 * s} height={660 * s} viewBox="-90 -330 180 660">
      <rect x={-40} y={-320} width={80} height={520} rx={40} fill="#fff" stroke="#2a1530" strokeWidth={10} />
      <rect x={-18} y={170 - 470 * k} width={36} height={470 * k + 40} rx={18} fill={C.rojo} />
      <circle cx={0} cy={240} r={80} fill={C.rojo} stroke="#2a1530" strokeWidth={10} />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={40} y1={-260 + i * 90} x2={70} y2={-260 + i * 90} stroke="#2a1530" strokeWidth={8} />)}
    </svg>
  );
};
const Virus: React.FC<{ t: number; x: number; y: number; r?: number; t0?: number; op?: number }> = ({ t, x, y, r = 120, t0 = -9, op = 1 }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <svg style={{ position: "absolute", left: x - r * 1.6, top: y - r * 1.6, overflow: "visible", opacity: op }} width={r * 3.2} height={r * 3.2} viewBox="-160 -160 320 320">
      <g transform={`scale(${e}) rotate(${t * 25})`}>
        {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30})`}><line x1={0} y1={-90} x2={0} y2={-135} stroke="#3a9a4a" strokeWidth={12} /><circle cx={0} cy={-140} r={14} fill="#c6f04a" stroke="#3a9a4a" strokeWidth={6} /></g>)}
        <circle r={95} fill="#7ad45a" stroke="#3a9a4a" strokeWidth={12} />
        {[[-30, -20, 18], [30, 10, 14], [-10, 40, 12], [40, -40, 10]].map(([cx, cy, rr], i) => <circle key={i} cx={cx} cy={cy} r={rr} fill="#3a9a4a" opacity={0.6} />)}
      </g>
    </svg>
  );
};
const Hospital: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 300 * s, top: y - 300 * s, overflow: "visible", transform: `scale(${ent(t, t0)})`, transformOrigin: "50% 100%" }} width={600 * s} height={600 * s} viewBox="-300 -300 600 600">
    <path d="M -280 -60 L 0 -240 L 280 -60 Z" fill="#c9b8a0" stroke="#8a7a64" strokeWidth={10} />
    <rect x={-250} y={-60} width={500} height={340} fill="#efe6d6" stroke="#8a7a64" strokeWidth={10} />
    {[-170, -60, 60, 170].map((cx) => <rect key={cx} x={cx - 18} y={-40} width={36} height={300} fill="#ded2bd" />)}
    <rect x={-60} y={140} width={120} height={140} fill="#6b3a1f" />
    <g transform="translate(0 40)"><rect x={-26} y={-70} width={52} height={140} fill={C.rojo} /><rect x={-70} y={-26} width={140} height={52} fill={C.rojo} /></g>
  </svg>
);
// carta con ícono tachado o marcado
const Falta: React.FC<{ t: number; t0: number; x: number; txt: string; icono: React.ReactNode; tx: number }> = ({ t, t0, x, txt, icono, tx }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x - 300, top: 220, width: 600, height: 640, borderRadius: 36, background: "#fff8ec", border: "10px solid #2a1530", transform: `scale(${e}) rotate(${(1 - e) * -10}deg)`, boxShadow: "16px 18px 0 rgba(20,8,40,.35)" }}>
      <div style={{ position: "absolute", left: 150, top: 70, width: 300, height: 300 }}>{icono}</div>
      <svg style={{ position: "absolute", left: 100, top: 40 }} width={400} height={380}><path d="M 30 30 L 370 350 M 370 30 L 30 350" stroke={C.rojo} strokeWidth={36} strokeLinecap="round" strokeDasharray={470} strokeDashoffset={470 * (1 - prog(t, tx, tx + 0.25))} /></svg>
      <div style={{ position: "absolute", left: 20, right: 20, top: 440, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 60, lineHeight: 1.1, color: "#2a1530" }}>{txt}</div>
    </div>
  );
};
// calendario que tacha días
const Calendario: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => (
  <div style={{ position: "absolute", left: x - 330, top: y - 300, width: 660, height: 600, borderRadius: 30, background: "#fff", border: "10px solid #2a1530", transform: `scale(${ent(t, t0)})`, overflow: "hidden" }}>
    <div style={{ height: 100, background: C.rojo, fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", textAlign: "center", lineHeight: "100px" }}>EVERY DAY</div>
    {Array.from({ length: 28 }, (_, i) => {
      const on = t > t0 + 0.3 + i * 0.12;
      return <div key={i} style={{ position: "absolute", left: 24 + (i % 7) * 88, top: 124 + Math.floor(i / 7) * 115, width: 76, height: 96, borderRadius: 14, background: on ? "#effbe8" : "#f2ecf8", fontFamily, fontWeight: 700, fontSize: 52, color: "#3fa34d", textAlign: "center", lineHeight: "96px" }}>{on ? "✓" : ""}</div>;
    })}
  </div>
);

export const P5: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 136 · trampa cinco: el campamento */}
    <Escena t={t} t0={547.17} t1={549.5} entra="corte" golpes={[547.41, 548.6]}>
      <AbsoluteFill style={{ background: "#3a9a4a" }} />
      <Rayos t={t} x={960} y={430} color="#fff" op={0.14} />
      <Grande t={t} t0={547.41} text="TRAP #5" y={400} size={260} color="#fff" borde="#1d4a24" />
      <Grande t={t} t0={548.6} text="THE CAMP" y={650} size={140} color="#c6f04a" borde="#1d4a24" />
      <Trampas t={t} t0={547.2} n={5} y={850} on={C.oro} />
    </Escena>

    {/* 137 · algo que las películas nunca te muestran */}
    <Escena t={t} t0={549.5} t1={551.6} entra="zoom" golpes={[550.51]}>
      <AbsoluteFill style={{ background: "#12061a" }} />
      <div style={{ position: "absolute", left: 360, top: 220, width: 1200, height: 640, borderRadius: 20, background: "linear-gradient(180deg, #ffd27a, #e2557a)", border: "24px solid #2a2a2a", overflow: "hidden" }}>
        <Soldadito x={600} y={560} s={3} t={t} seed={3} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 80, color: "#fff", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill" }}>THE MOVIES</div>
      </div>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 380 + i * 100, top: 190, width: 50, height: 26, borderRadius: 6, background: "#555" }} />)}
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 380 + i * 100, top: 866, width: 50, height: 26, borderRadius: 6, background: "#555" }} />)}
      <Chip t={t} t0={550.51} text="NEVER SHOW YOU THIS" color={C.rojo} x={960} y={980} centro size={60} />
    </Escena>

    {/* 138 · lo más mortal no era una espada: era la fiebre */}
    <Escena t={t} t0={551.6} t1={557.96} zoom={0.05} entra="barrido" golpes={[553.29, 556.25, 557.38]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #8c1d34, #2a0a1e 75%)" }} />
      <Rayos t={t} x={960} y={420} color="#ffb0a0" op={0.08} />
      <Chip t={t} t0={553.29} text="THE DEADLIEST THING" color={C.violeta} x={160} y={140} size={58} t1={557.2} />
      {t < 557.2 ? <>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><Gladius x={960} y={560} s={1.6} rot={-30} t={t} t0={554.4} /></div>
        {t > 555.75 && <svg style={{ position: "absolute", left: 560, top: 160 }} width={800} height={800}><path d="M 80 80 L 720 720 M 720 80 L 80 720" stroke={C.rojo} strokeWidth={70} strokeLinecap="round" strokeDasharray={910} strokeDashoffset={910 * (1 - prog(t, 556.0, 556.3))} /></svg>}
        <Chip t={t} t0={556.25} text="NOT A SWORD" color={C.rojo} x={1300} y={300} size={60} />
      </> : <>
        <Persona x={760} y={1120} h={720} t={t} seed={1} casco="no" expr="triste" ladea={10} ropa={{ tunica: "#d8443a", tunica2: "#9e2531", cinto: "#6b3a1f", piel: "#cfe0a0", piel2: "#a8c070", pelo: "#4a2a17" }} />
        <Emote t={t} t0={557.4} tipo="sudor" {...L(760, 1120, 720)} s={1.4} />
        <Termometro t={t} t0={557.38} x={1320} y={560} s={1.1} />
        <Grande t={t} t0={557.38} text="A FEVER" y={180} size={160} color="#fff" borde={C.rojo} />
      </>}
    </Escena>

    {/* 139 · miles de hombres en un fuerte, compartiendo agua, letrinas, carpas con una mula */}
    <Escena t={t} t0={557.96} t1={564.6} zoom={0.04} entra="corte" golpes={[557.96, 560.93, 562.01, 563.89]}>
      <Cielo tipo="dia" />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={700} seed={111} alto={50} />
      <Fuerte x={960} y={640} s={0.95} w={1800} />
      {Array.from({ length: 70 }, (_, i) => t > 558.0 + i * 0.02 && <Soldadito key={i} x={160 + (i % 14) * 115 + (Math.floor(i / 14) % 2) * 50} y={760 + Math.floor(i / 14) * 60} s={0.75} t={t} seed={i + 20} />)}
      <Cuenta t={t} t0={557.96} t1={558.6} de={0} a={5000} x={960} y={150} size={130} color="#fff" suf=" MEN" />
      <Chip t={t} t0={560.93} text="SHARING WATER" color={C.teal} tinta={C.noche} x={160} y={280} size={52} />
      <Chip t={t} t0={562.01} text="SHARING LATRINES" color={C.ambar} tinta={C.noche} x={160} y={390} size={52} />
      <Chip t={t} t0={563.2} text="SHARING TENTS... + A MULE" color={C.rojo} x={1000} y={280} size={46} />
    </Escena>

    {/* 140 · la enfermedad corría más rápido que una carga de caballería */}
    <Escena t={t} t0={564.6} t1={568.3} zoom={0.05} entra="diag" golpes={[564.6, 566.08, 567.48]}>
      <Cielo tipo="sangre" />
      <Colinas capas={["#4a1030", "#2a0a1e"]} base={760} seed={112} alto={50} />
      {(() => {
        const fx = interpolate(t, [564.7, 568.2], [-300, 2200]);
        return <>
          {Array.from({ length: 10 }, (_, i) => { const x = 140 + i * 180; return <Soldadito key={i} x={x} y={960} s={1.6} t={t} seed={30 + i} cae={fx > x ? 564.7 + (x + 300) / 2500 * 3.5 : undefined} />; })}
          {Array.from({ length: 9 }, (_, i) => <Virus key={i} t={t} x={fx - (i % 3) * 180} y={420 + Math.floor(i / 3) * 200 + Math.sin(t * 4 + i) * 30} r={70 - (i % 3) * 10} op={0.95} />)}
        </>;
      })()}
      <Grande t={t} t0={564.6} text="DISEASE" y={150} size={140} color="#c6f04a" borde="#1d4a24" />
      <Chip t={t} t0={566.08} text="FASTER THAN ANY CAVALRY CHARGE" color={C.rojo} x={960} y={290} centro size={54} />
    </Escena>

    {/* 141 · letrinas: bancos largos de piedra con agujeros, uno al lado del otro, sin paredes */}
    <Escena t={t} t0={568.3} t1={574.3} zoom={0.04} entra="sube" banda={C.ambar} golpes={[569.65, 570.6, 572.74]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #d8c8a8, #b5a07a)" }} />
      <Letrina x={960} y={640} s={1.4} n={7} t={t} t0={568.4} />
      {Array.from({ length: 5 }, (_, i) => <Persona key={i} x={540 + i * 210} y={760} h={360} t={t} seed={190 + i} casco="no" expr={i === 2 ? "miedo" : "neutro"} aparece={570.9 + i * 0.12} mira={i < 2 ? 0.6 : -0.6} />)}
      <Emote t={t} t0={572.0} tipo="susto" {...L(960, 760, 360)} s={0.8} />
      <Chip t={t} t0={568.63} text="THE LATRINES" color={C.violeta} x={160} y={140} size={58} />
      <Chip t={t} t0={569.65} text="LONG STONE BENCHES" color={C.ambar} tinta={C.noche} x={160} y={260} size={54} />
      <Chip t={t} t0={571.65} text="SIDE BY SIDE" color={C.teal} tinta={C.noche} x={1280} y={140} size={54} />
      <Chip t={t} t0={572.74} text="NO WALLS" color={C.rojo} x={1280} y={260} size={64} />
    </Escena>

    {/* 142 · el agua corría abajo y para limpiarte: una esponja en un palo, compartida */}
    <Escena t={t} t0={574.3} t1={581.5} zoom={0.05} entra="corte" golpes={[574.62, 577.98, 580.91]}>
      <AbsoluteFill style={{ background: "#b5a07a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 220, background: "linear-gradient(180deg, #4fb3e8, #2f86b0)", overflow: "hidden" }}>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 170 + (t - 574) * 260) % 2100) - 100, top: 40 + (i % 3) * 60, width: 120, height: 14, borderRadius: 7, background: "rgba(255,255,255,.5)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 80, background: "#8a7a64" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#8a7a64" }} />
      <Esponja x={interpolate(t, [577.6, 581.5], [760, 1200])} y={600 + Math.sin(t * 3) * 14} s={1.5} t={t} t0={577.7} rot={-24} />
      <Chip t={t} t0={574.62} text="WATER RAN UNDERNEATH" color={C.teal} tinta={C.noche} x={160} y={140} size={54} />
      <Chip t={t} t0={577.98} text="A SPONGE ON A STICK" color={C.ambar} tinta={C.noche} x={160} y={260} size={58} />
      <Grande t={t} t0={580.91} text="SHARED." y={320} size={170} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 143 · no querés saber cuántos la usaron antes que vos */}
    <Escena t={t} t0={581.5} t1={585.1} entra="zoom" golpes={[583.01, 584.17]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #c6f04a, #3a9a4a 60%, #1d4a24)" }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.1} />
      <Persona x={620} y={1180} h={800} t={t} seed={1} casco="no" expr="miedo" inclina={-10} bD={150} bI={150} cD={110} cI={110} mira={0.6} />
      <Emote t={t} t0={582.2} tipo="susto" {...L(620, 1180, 800)} s={1.4} />
      <Cuenta t={t} t0={583.01} t1={584.1} de={0} a={999} x={1320} y={440} size={220} color="#fff" suf="+" />
      <Chip t={t} t0={583.3} text="MEN BEFORE YOU" color="#1d4a24" x={1080} y={620} size={60} />
    </Escena>

    {/* 144 · en el año 165 las legiones trajeron algo del este: una plaga */}
    <Escena t={t} t0={585.1} t1={591.2} zoom={0.04} entra="corte" golpes={[585.96, 588.7, 590.51]}>
      <MapaPuntos t={t} desde="SYRIA" brillo="#7ad45a" pulsa={["SYRIA"]} t0Pulsa={588.7} rutas={[{ a: "ROME", t0: 589.0 }, { a: "DANUBE", t0: 589.4 }, { a: "GAUL", t0: 589.8 }]} />
      <Cuenta t={t} t0={585.96} t1={586.6} de={100} a={165} x={1460} y={200} size={150} color="#fff" pre="AD " />
      <Chip t={t} t0={588.7} text="FROM THE EAST" color={C.violeta} x={160} y={140} size={56} />
      <Virus t={t} t0={590.4} x={1500} y={700} r={150} />
      <Grande t={t} t0={590.51} text="A PLAGUE" y={940} size={140} color="#c6f04a" borde="#1d4a24" />
    </Escena>

    {/* 145 · la peste antonina, probablemente viruela */}
    <Escena t={t} t0={591.2} t1={595.9} zoom={0.05} entra="iris" ix={960} iy={540} golpes={[592.5, 594.55]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a9a4a, #0e2a12 75%)" }} />
      <Particulas t={t} tipo="luciernagas" n={40} seed={113} />
      <Virus t={t} t0={591.3} x={960} y={600} r={230} />
      {[[300, 300, 80], [1620, 360, 90], [380, 860, 70], [1540, 860, 75]].map(([x, y, r], i) => <Virus key={i} t={t} t0={592.0 + i * 0.2} x={x} y={y} r={r} op={0.7} />)}
      <Grande t={t} t0={592.5} text="THE ANTONINE PLAGUE" y={170} size={110} color="#fff" borde="#1d4a24" />
      <Chip t={t} t0={594.38} text="LIKELY: SMALLPOX" color={C.rojo} x={960} y={1000} centro size={60} />
    </Escena>

    {/* 146 · por las mismas rutas del ejército, de campamento en campamento */}
    <Escena t={t} t0={595.9} t1={604.2} zoom={0.04} entra="barrido" golpes={[597.08, 599.25, 601.38, 603.55]}>
      {t < 599.9
        ? <MapaPuntos t={t} desde="SYRIA" brillo="#7ad45a" rutas={[{ a: "EGYPT", t0: 596.2 }, { a: "ROME", t0: 596.6 }, { a: "DANUBE", t0: 597.0 }, { a: "GAUL", t0: 597.6 }, { a: "BRITAIN", t0: 598.2 }, { a: "SPAIN", t0: 598.6 }]} />
        : <>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, #4a3a2a, #2a1d14)" }} />
          {Array.from({ length: 4 }, (_, i) => <Tienda key={i} x={300 + i * 440} y={560} s={1.4} />)}
          {Array.from({ length: 12 }, (_, i) => { const x = 160 + i * 140; return <Soldadito key={i} x={x} y={940} s={1.3} t={t} seed={40 + i} cae={i % 3 !== 1 ? 602.6 + (i % 5) * 0.2 : undefined} />; })}
          <Virus t={t} t0={600.0} x={1600} y={300} r={90} op={0.8} />
        </>}
      <Chip t={t} t0={597.08} text="ALONG THE ARMY'S OWN ROADS" color={C.violeta} x={160} y={140} size={52} />
      <Chip t={t} t0={599.25} text="CAMP TO CAMP" color="#3a9a4a" x={160} y={260} size={56} />
      <Chip t={t} t0={601.38} text="SHOULDER TO SHOULDER" color={C.ambar} tinta={C.noche} x={1080} y={140} size={52} />
      <Chip t={t} t0={603.36} text="FIRST TO FALL" color={C.rojo} x={1080} y={260} size={60} />
    </Escena>

    {/* 147 · Roma tuvo que reclutar gladiadores y hasta esclavos */}
    <Escena t={t} t0={604.2} t1={610.8} zoom={0.05} entra="corte" golpes={[605.6, 607.27, 608.67, 610.13]}>
      <Cielo tipo="atardecer" />
      <Rayos t={t} x={960} y={420} op={0.1} />
      <Colinas capas={["#7a3a6a", "#5a2a5a"]} base={760} seed={114} alto={40} />
      <Suelo y={880} />
      {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={240 + i * 290} y={900} s={1.2} t={t} seed={60 + i} cae={i % 2 ? 604.6 + i * 0.1 : undefined} />)}
      <Persona x={620} y={1080} h={600} t={t} seed={66} ropa={{ tunica: "#6b6b7a", tunica2: "#4a4a58", cinto: "#3b230f", piel: "#c98a5a", piel2: "#a86a40", pelo: "#1a1010" }} casco="legion" expr="enojado" aparece={607.27} bD={120} cD={30} manoD={<g transform="rotate(90)"><rect x={-8} y={-10} width={16} height={180} rx={6} fill="#c9ccd6" /></g>} />
      <Persona x={1320} y={1080} h={560} t={t} seed={67} ropa={CIVIL(6)} expr="triste" aparece={608.67} flip />
      <Chip t={t} t0={605.13} text="HIT SO HARD..." color={C.violeta} x={160} y={140} size={56} t1={607.1} />
      <Chip t={t} t0={607.27} text="GLADIATORS" color={C.rojo} x={420} y={280} size={64} />
      <Chip t={t} t0={608.67} text="EVEN SLAVES" color={C.ambar} tinta={C.noche} x={1140} y={280} size={64} />
      <Chip t={t} t0={609.58} text="TO REFILL THE RANKS" color={C.violeta} x={960} y={420} centro size={54} />
    </Escena>

    {/* 148 · ¿y si te herían? */}
    <Escena t={t} t0={610.8} t1={612.1} entra="zoom" golpes={[611.36]}>
      <AbsoluteFill style={{ background: C.rojo }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.12} />
      <Persona x={960} y={1160} h={800} t={t} seed={1} casco="legion" expr="miedo" bD={60} bI={60} cD={90} />
      <Emote t={t} t0={611.0} tipo="preg" {...L(960, 1160, 800)} s={1.5} />
      <Grande t={t} t0={611.17} text="GET HURT?" y={180} size={150} color="#fff" />
    </Escena>

    {/* 149 · tenían médicos de verdad, los medici, y hospitales dentro del fuerte */}
    <Escena t={t} t0={612.1} t1={618.1} zoom={0.04} entra="barrido" golpes={[613.13, 614.22, 614.98, 617.01]}>
      <Cielo tipo="dia" />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={720} seed={115} alto={50} />
      <Suelo y={880} a="#c8b88a" b="#a89868" />
      <Hospital t={t} t0={614.98} x={1300} y={640} s={1.1} />
      <Persona x={520} y={1060} h={620} t={t} seed={68} ropa={{ tunica: "#f2efe6", tunica2: "#cfc8b8", cinto: "#3a9a4a", piel: "#e0a07a", piel2: "#c07a5a", pelo: "#6a6a6a" }} viejo expr="orgullo" bD={60} cD={60} />
      <Chip t={t} t0={613.13} text="REAL DOCTORS" color={C.teal} tinta={C.noche} x={160} y={140} size={58} />
      <Grande t={t} t0={614.22} text="MEDICI" y={300} size={140} color="#fff" borde={C.teal} />
      <Chip t={t} t0={615.48} text="HOSPITALS INSIDE THE FORTS" color={C.rojo} x={160} y={260} size={50} />
      <Chip t={t} t0={617.01} text="GENUINELY GOOD" color="#3fa34d" x={1240} y={140} size={56} />
    </Escena>

    {/* 150 · fórceps, bisturíes y hasta herramientas para sacar puntas de flecha */}
    <Escena t={t} t0={618.1} t1={623.6} zoom={0.04} entra="corte" golpes={[618.82, 620.08, 622.34]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #e8f4f8, #9ac4d4 80%)" }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.2} />
      <Instrumento k="pinza" x={420} y={520} s={1.6} t={t} t0={618.82} rot={-14} />
      <Instrumento k="bisturi" x={960} y={520} s={1.6} t={t} t0={620.08} rot={10} />
      <Instrumento k="flecha" x={1500} y={520} s={1.6} t={t} t0={622.34} rot={-6} />
      <Chip t={t} t0={618.82} text="FORCEPS" color={C.teal} tinta={C.noche} x={420} y={860} centro size={58} />
      <Chip t={t} t0={620.08} text="SCALPELS" color={C.violeta} x={960} y={860} centro size={58} />
      <Chip t={t} t0={622.34} text="ARROWHEAD PULLERS" color={C.rojo} x={1500} y={860} centro size={52} />
    </Escena>

    {/* 151 · lo que no tenían: calmantes, ni idea de qué era una infección */}
    <Escena t={t} t0={623.6} t1={629.86} zoom={0.03} entra="sube" banda={C.rojo} golpes={[625.88, 628.53]}>
      <AbsoluteFill style={{ background: "#1b1240" }} />
      <Falta t={t} t0={625.5} x={600} tx={626.3} txt="PAINKILLERS" icono={<svg width={300} height={300} viewBox="-150 -150 300 300"><g transform="rotate(-35)"><rect x={-120} y={-50} width={240} height={100} rx={50} fill="#fff" stroke="#2a1530" strokeWidth={10} /><path d="M 0 -50 L 0 50" stroke="#2a1530" strokeWidth={10} /><path d="M -120 -50 L 0 -50 L 0 50 L -70 50 Q -120 50 -120 0 Z" fill={C.rojo} /></g></svg>} />
      <Falta t={t} t0={628.2} x={1320} tx={628.86} txt="WHAT IS AN INFECTION?" icono={<Virus t={t} x={150} y={150} r={90} />} />
      <Chip t={t} t0={623.63} text="WHAT THEY DID NOT HAVE" color={C.violeta} x={960} y={110} centro size={56} />
    </Escena>

    {/* 152 · un corte chico de una espada de práctica en un día caluroso en África podía matarte */}
    <Escena t={t} t0={629.86} t1={636.1} zoom={0.05} entra="corte" golpes={[630.46, 633.01, 633.88, 635.36]}>
      <Cielo tipo="polvo" />
      <Rayos t={t} x={1500} y={240} color="#fff3c4" op={0.18} />
      <Colinas capas={["#d9a060", "#c08040"]} base={700} seed={116} alto={40} />
      <Suelo y={880} a="#e0a868" b="#b07838" />
      <Calor t={t} y={560} op={0.35} />
      {(() => {
        const sick = t > 633.6;
        return <>
          <Persona x={760} y={1060} h={620} t={t} seed={1} casco="legion" expr={sick ? "triste" : "neutro"} ladea={sick ? 8 : 0} bD={50} cD={60} ropa={sick ? { tunica: "#d8443a", tunica2: "#9e2531", cinto: "#6b3a1f", piel: "#cfe0a0", piel2: "#a8c070", pelo: "#4a2a17" } : undefined} />
          <div style={{ position: "absolute", left: 870, top: 760, width: 80 * prog(t, 630.4, 630.7), height: 10, borderRadius: 5, background: C.rojo, transform: "rotate(-20deg)" }} />
          {t > 630.6 && <svg style={{ position: "absolute", left: 830, top: 690 }} width={160} height={160}><circle cx={80} cy={80} r={60 + Math.sin(t * 6) * 6} fill="none" stroke={C.rojo} strokeWidth={8} strokeDasharray="14 10" /></svg>}
          <Emote t={t} t0={633.9} tipo="sudor" {...L(760, 1060, 620)} />
          {t > 635.3 && <Craneo x={1400} y={520} s={0.9} t={t} t0={635.36} />}
        </>;
      })()}
      <Chip t={t} t0={630.46} text="A SMALL CUT" color={C.rojo} x={160} y={140} size={60} />
      <Chip t={t} t0={632.46} text="HOT DAY · AFRICA" color={C.ambar} tinta={C.noche} x={160} y={260} size={56} />
      <Chip t={t} t0={633.88} text="COULD KILL YOU" color={C.rojo} x={1200} y={200} size={60} />
      <Chip t={t} t0={635.36} text="= A BATTLE" color={C.violeta} x={1240} y={760} size={60} />
    </Escena>

    {/* 153 · al menos la comida era regular */}
    <Escena t={t} t0={636.1} t1={637.9} entra="zoom" golpes={[637.15]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #ffd27a, #e9a92a 75%)" }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.2} />
      <Persona x={960} y={1160} h={760} t={t} seed={1} casco="legion" expr="feliz" salta={637.1} bD={150} bI={150} cD={20} cI={20} />
      <Grande t={t} t0={636.67} text="AT LEAST... FOOD" y={200} size={130} color="#fff" borde="#7a3d14" />
    </Escena>

    {/* 154 · trigo molido a mano con un molino de piedra compartido por la carpa */}
    <Escena t={t} t0={637.9} t1={644.25} zoom={0.04} entra="barrido" golpes={[639.24, 641.39, 642.65, 643.53]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #e9c27a, #b5862a)" }} />
      <Rayos t={t} x={960} y={300} color="#fff" op={0.12} />
      <Comida k="trigo" x={400} y={480} s={1.6} t={t} t0={639.24} rot={-8} />
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${(t - 640) * 0}deg)` }}><Comida k="molino" x={1080} y={560} s={2.0} t={t} t0={640.3} rot={t > 641.3 ? (t - 641.3) * 120 : 0} /></div>
      {t > 641.4 && Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1080 + Math.cos(i * 2.3 + t) * (140 + ((t * 80 + i * 20) % 120)), top: 760 + ((t * 160 + i * 37) % 120), width: 10, height: 10, borderRadius: 5, background: "#fff8ec" }} />)}
      {Array.from({ length: 4 }, (_, i) => <Persona key={i} x={1460 + i * 120} y={1080} h={300} t={t} seed={140 + i} casco="no" expr="neutro" aparece={643.15 + i * 0.1} />)}
      <Chip t={t} t0={639.24} text="WHEAT" color={C.ambar} tinta={C.noche} x={400} y={800} centro size={60} />
      <Chip t={t} t0={640.15} text="GROUND BY HAND" color={C.rojo} x={160} y={140} size={56} />
      <Chip t={t} t0={642.32} text="STONE MILL" color={C.violeta} x={1080} y={180} centro size={56} />
      <Chip t={t} t0={643.15} text="SHARED BY THE TENT" color={C.teal} tinta={C.noche} x={1300} y={320} size={48} />
    </Escena>

    {/* 155 · pan o papilla */}
    <Escena t={t} t0={644.25} t1={647.2} entra="corte" golpes={[644.96, 646.36]}>
      <AbsoluteFill style={{ background: "#fff3e0" }} />
      <Rayos t={t} x={960} y={540} color={C.ambar} op={0.2} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${ent(t, 644.8)})`, transformOrigin: "520px 540px" }}><Pan x={520} y={540} s={2.2} /></div>
      <Comida k="porridge" x={1400} y={540} s={1.8} t={t} t0={646.2} />
      <Chip t={t} t0={644.96} text="BREAD" color={C.ambar} tinta={C.noche} x={520} y={860} centro size={64} />
      <Grande t={t} t0={645.53} text="OR" y={540} size={120} color={C.rojo} />
      <Chip t={t} t0={646.36} text="PORRIDGE" color={C.violeta} x={1400} y={860} centro size={64} />
    </Escena>

    {/* 156 · tocino, queso, lentejas y posca: vino agrio con agua */}
    <Escena t={t} t0={647.2} t1={654.1} zoom={0.04} entra="sube" banda={C.ambar} golpes={[647.55, 648.48, 649.27, 650.6, 652.05]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #ffd27a, #c97a2a 75%)" }} />
      <Rayos t={t} x={960} y={480} color="#fff" op={0.12} />
      <Comida k="tocino" x={360} y={440} s={1.4} t={t} t0={647.55} rot={-6} />
      <Comida k="queso" x={800} y={440} s={1.4} t={t} t0={648.48} rot={5} />
      <Comida k="lentejas" x={1240} y={440} s={1.4} t={t} t0={649.27} />
      <Comida k="jarra" x={1640} y={460} s={1.5} t={t} t0={650.32} />
      {([[647.55, "BACON", 360], [648.48, "CHEESE", 800], [649.27, "LENTILS", 1240]] as const).map(([t0, txt, x]) => <Chip key={txt} t={t} t0={t0} text={txt} color={C.violeta} x={x} y={700} centro size={54} />)}
      <Grande t={t} t0={650.6} text="POSCA" y={880} size={110} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={652.05} text="SOUR WINE + WATER" color={C.rojo} x={1600} y={700} centro size={42} />
    </Escena>

    {/* 157 · nada glamoroso, pero llegaba todos los días: más de lo que podía decir un granjero */}
    <Escena t={t} t0={654.1} t1={659.62} zoom={0.04} entra="corte" golpes={[654.32, 656.58, 658.25]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2d1b69, #7a2f8f)" }} />
      <Estrellas t={t} n={40} seed={117} alto={500} />
      <Calendario t={t} t0={655.2} x={620} y={560} />
      <Persona x={1440} y={1080} h={600} t={t} seed={69} ropa={CIVIL(4)} expr="triste" aparece={657.9} flip />
      <Emote t={t} t0={658.3} tipo="lagrimas" {...L(1440, 1080, 600)} />
      <Chip t={t} t0={654.32} text="NOT GLAMOROUS" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={658.25} text="MOST FARMERS: NOT SO LUCKY" color={C.rojo} x={1060} y={260} size={46} />
    </Escena>
  </>
);
