import React from "react";
import { CasaNan, Iglesia, Molino, Muelle, Nube, Gaviota, Sol, Ballenero, Lampara, Farol, Barril, Isla } from "./kit3";

// vuelta 6 OJO: el fondo de rayos (sunburst) fingía la vida del plano y era lo que más separaba del molde.
// Ahora cada inserto va sobre un AMBIENTE ilustrado del tramo del relato (puerto, oficina/taberna, cubierta,
// mar abierto, deriva, puerto de noche), con profundidad, cosas que se mueven solas y una deriva lenta de cámara.
// El color del inserto (c1) queda como viñeta en los bordes para no perder la paleta de cada escena.
type Esc = "puerto" | "interior" | "cubierta" | "mar" | "deriva" | "noche";
const escenario = (t: number): Esc =>
  t < 130 ? "puerto" : t < 300 ? "interior" : t < 560 ? "cubierta" : t < 662 ? "mar" : t < 800 ? "deriva" : "noche";

const Agua: React.FC<{ t: number; y: number; c1: string; c2: string; espuma?: string }> = ({ t, y, c1, c2, espuma = "rgba(255,255,255,.5)" }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${c1}, ${c2})` }} />
    <svg style={{ position: "absolute", left: 0, top: y - 10, overflow: "visible" }} width={1920} height={600}>
      {[0, 1, 2, 3].map((f) =>
        Array.from({ length: 9 }, (_, i) => {
          const x = ((i * 280 + f * 130 - t * (30 + f * 18)) % 2520 + 2520) % 2520 - 300;
          const yy = 14 + f * f * 34;
          return <path key={`${f}-${i}`} d={`M ${x} ${yy} Q ${x + 50} ${yy - 12} ${x + 100} ${yy} Q ${x + 150} ${yy + 12} ${x + 200} ${yy}`} stroke={espuma} strokeWidth={4 + f * 2} fill="none" strokeLinecap="round" />;
        }),
      )}
    </svg>
  </>
);

export const Ambiente: React.FC<{ t: number; c1: string; c2: string; cx?: number; cy?: number }> = ({ t, c1, c2, cx = 960, cy = 540 }) => {
  const e = escenario(t);
  const dx = Math.sin(t * 0.21) * 40; // deriva lenta de cámara (capa cercana se mueve más)
  let capa: React.ReactNode = null;
  if (e === "puerto")
    capa = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #8fd0f4, #dff3ff 60%)" }} />
        <Sol x={1500 + dx * 0.2} y={180} r={80} />
        {[0, 1, 2, 3].map((i) => <Nube key={i} x={((i * 620 + t * 14) % 2600) - 340} y={120 + (i % 2) * 90} s={0.55 + (i % 3) * 0.15} />)}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx * 0.4}px)` }}>
          <Iglesia x={260} y={700} s={0.7} />
          {[520, 820, 1120, 1420, 1720].map((x, i) => <CasaNan key={x} x={x} y={700} s={0.75 + (i % 2) * 0.1} tono={["#9aa0a8", "#a8aeb6", "#8e949c"][i % 3]} rica={i === 2} />)}
          <Molino x={1860} y={700} t={t} s={0.7} />
        </div>
        <Agua t={t} y={700} c1="#3a8fc8" c2="#164a7a" />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx}px)` }}>
          <Muelle x={1100} y={790} w={1500} />
          {[0, 1].map((k) => <Barril key={k} x={420 + k * 110} y={700} s={0.8} />)}
        </div>
        {[0, 1, 2].map((i) => <Gaviota key={i} x={((i * 700 + t * 90) % 2400) - 240} y={260 + i * 60 + Math.sin(t + i) * 20} t={t} s={0.5} />)}
      </>
    );
  else if (e === "interior")
    capa = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #8a5a34, #5a3418)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 124 + 40} y1={0} x2={i * 124 + 40} y2={820} stroke="#6a4222" strokeWidth={6} />)}
          <rect x={0} y={820} width={1920} height={260} fill="#4a2a14" />
          {Array.from({ length: 8 }, (_, i) => <line key={`p${i}`} x1={0} y1={840 + i * 34} x2={1920} y2={840 + i * 34} stroke="#3a2010" strokeWidth={4} />)}
          {/* ventana con el puerto: barcos que pasan */}
          <rect x={1340} y={170} width={420} height={330} fill="#9fd4f4" stroke="#3a2010" strokeWidth={18} />
          <rect x={1340} y={400} width={420} height={100} fill="#2e7ab0" />
          <line x1={1550} y1={170} x2={1550} y2={500} stroke="#3a2010" strokeWidth={12} />
          <line x1={1340} y1={335} x2={1760} y2={335} stroke="#3a2010" strokeWidth={12} />
          {/* estante con frascos y libros de cuentas */}
          <rect x={140} y={300} width={520} height={20} fill="#3a2010" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={160 + i * 70} y={200 + (i % 3) * 14} width={46} height={100 - (i % 3) * 14} fill={["#a33a2a", "#2a5a8a", "#c8a040", "#3a6a3a"][i % 4]} rx={4} />)}
          {/* mapa clavado */}
          <rect x={720} y={180} width={300} height={210} fill="#efe0b8" stroke="#8a6a3a" strokeWidth={6} transform="rotate(-3 870 285)" />
          <path d="M 760 300 Q 820 240 880 300 T 990 280" stroke="#2a7ab0" strokeWidth={6} fill="none" transform="rotate(-3 870 285)" />
        </svg>
        <div style={{ position: "absolute", left: 1340, top: 170, width: 420, height: 330, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0 }}><Ballenero x={((t * 22) % 900) - 200} y={235} t={t} escala={0.14} /></div>
        </div>
        <Lampara x={1080 + dx * 0.3} y={150} t={t} s={1.1} />
        {[0, 1].map((k) => <Barril key={k} x={150 + k * 130} y={850} s={1.2} />)}
      </>
    );
  else if (e === "cubierta")
    capa = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #6fb8e8, #cfeaf8 60%)" }} />
        {[0, 1, 2].map((i) => <Nube key={i} x={((i * 800 + t * 18) % 2600) - 340} y={140 + (i % 2) * 110} s={0.7} />)}
        <Agua t={t} y={640} c1="#2f7fb8" c2="#123c6a" />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx * 0.3}px)` }}><Ballenero x={1650} y={650} t={t + 3} escala={0.16} /></div>
        {/* jarcia y borda del propio barco, en primer plano, balanceándose */}
        <svg style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${Math.sin(t * 0.8) * 1.6}deg)`, transformOrigin: "50% 100%" }} width={1920} height={1080}>
          <rect x={150} y={-40} width={44} height={1120} fill="#5a3418" />
          {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={172} y1={60 + k * 40} x2={-80 + k * 30} y2={900} stroke="#3a2010" strokeWidth={5} />)}
          {[0, 1, 2, 3, 4, 5].map((k) => <line key={`r${k}`} x1={0} y1={300 + k * 110} x2={260} y2={300 + k * 110} stroke="#3a2010" strokeWidth={4} />)}
          <rect x={-20} y={880} width={1960} height={40} fill="#7a4a26" />
          <rect x={-20} y={920} width={1960} height={200} fill="#9a6a3a" />
          {Array.from({ length: 12 }, (_, i) => <line key={`d${i}`} x1={i * 170} y1={920} x2={i * 170 - 60} y2={1080} stroke="#7a4a26" strokeWidth={4} />)}
        </svg>
        {[0, 1].map((i) => <Gaviota key={i} x={((i * 900 + t * 110) % 2400) - 240} y={300 + i * 80} t={t} s={0.45} />)}
      </>
    );
  else if (e === "mar")
    capa = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #4a9ad8, #bfe4f8 62%)" }} />
        <Sol x={360} y={200} r={70} />
        {[0, 1, 2, 3].map((i) => <Nube key={i} x={((i * 640 + t * 22) % 2600) - 340} y={120 + (i % 2) * 120} s={0.6} />)}
        <Agua t={t} y={600} c1="#2a7ab4" c2="#0e3460" />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx * 0.5}px)` }}>
          {/* chorro de una ballena lejana, cada ~6 s */}
          {(() => { const k = (t % 6) / 6; return k < 0.4 ? <div style={{ position: "absolute", left: 1500, top: 600 - k * 300, width: 40 + k * 120, height: k * 300, marginLeft: -(20 + k * 60), background: "rgba(240,250,255,.7)", borderRadius: "50% 50% 10% 10%" }} /> : null; })()}
          <Isla x={400} y={612} t={t} s={0.3} seed={3} />
        </div>
        {[0, 1, 2].map((i) => <Gaviota key={i} x={((i * 700 + t * 80) % 2400) - 240} y={260 + i * 70} t={t} s={0.45} />)}
      </>
    );
  else if (e === "deriva")
    capa = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #e86a3a, #f8c070 55%)" }} />
        <Sol x={960 + dx * 0.2} y={560} r={150} col="#ffe6a0" />
        {[0, 1, 2].map((i) => <Nube key={i} x={((i * 900 + t * 10) % 2600) - 340} y={160 + i * 70} s={0.8} col="#f8a080" op={0.7} />)}
        <Agua t={t} y={600} c1="#a0483a" c2="#2a1a3a" espuma="rgba(255,220,180,.45)" />
        {/* aletas de tiburón que rondan */}
        {[0, 1].map((i) => { const x = ((i * 1100 + t * 60) % 2400) - 240; return <svg key={i} style={{ position: "absolute", left: x, top: 700 + i * 120, overflow: "visible" }} width={1} height={1}><path d="M -40 0 Q -10 -70 30 -90 Q 20 -40 40 0 Z" fill="#2a2a3a" /></svg>; })}
      </>
    );
  else
    capa = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #1a1a4a, #4a3a7a 65%)" }} />
        {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 397) % 1920, top: (i * 131) % 520, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.4 + 0.5 * Math.abs(Math.sin(t * 1.3 + i)) }} />)}
        <Sol x={1560} y={190} r={70} col="#fff6d8" />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx * 0.4}px)` }}>
          {[300, 620, 940, 1260, 1580].map((x, i) => <CasaNan key={x} x={x} y={700} s={0.75} tono="#3a4060" luz rica={i % 2 === 0} />)}
        </div>
        <Agua t={t} y={700} c1="#22305a" c2="#0c1028" espuma="rgba(255,220,150,.35)" />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx}px)` }}>
          <Muelle x={1500} y={790} w={1800} />
          <Farol x={700} y={720} t={t} s={1} />
          <Farol x={1300} y={720} t={t} s={1} />
        </div>
      </>
    );
  return (
    <>
      {capa}
      {/* paleta del inserto: viñeta de color en los bordes + foco de luz donde va la acción */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 75% 70% at ${cx}px ${cy}px, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 45%, ${c2}99 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: c1, opacity: 0.16, mixBlendMode: "color" }} />
    </>
  );
};
