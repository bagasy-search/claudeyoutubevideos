import React from "react";
import { Gaviota, Ballenero, Isla } from "./kit3";
import { SetPuerto, SetCamarote, SetCubierta, SetMar } from "./sets";
import { Multitud, type Puesta } from "./multitud";
import { Persona, CIVIL, MARINO } from "./persona";

// vida de fondo: gente del puerto que pasa y conversa / marineros trabajando en cubierta (más apagados atrás)
const gentio = (civil: boolean) => (p: Puesta) => (
  <div style={{ position: "absolute", inset: 0, filter: `brightness(${0.62 + 0.2 * (1 - p.tono)}) saturate(0.8)` }}>
    <Persona x={p.x} y={p.y} h={p.h} t={p.t} seed={300 + p.k} ropa={civil ? CIVIL(p.k) : MARINO(p.k + 2)} flip={p.flip} camina={p.camina} bI={p.bI} bD={p.bD} cI={p.cI} cD={p.cD} inclina={p.inclina} ladea={p.ladea} casco={civil ? (p.k % 3 === 0 ? "galera" : "no") : p.k % 2 ? "gorro" : "no"} gorroCol="#2b6ad0" pantalon="#3a3248" />
  </div>
);

// vuelta 6 OJO: el fondo de rayos (sunburst) fingía la vida del plano y era lo que más separaba del molde.
// Ahora cada inserto va sobre un AMBIENTE ilustrado del tramo del relato (puerto, oficina/taberna, cubierta,
// mar abierto, deriva, puerto de noche), con profundidad, cosas que se mueven solas y una deriva lenta de cámara.
// El color del inserto (c1) queda como viñeta en los bordes para no perder la paleta de cada escena.
type Esc = "puerto" | "interior" | "cubierta" | "mar" | "deriva" | "noche";
const escenario = (t: number): Esc =>
  t < 130 ? "puerto" : t < 300 ? "interior" : t < 560 ? "cubierta" : t < 662 ? "mar" : t < 800 ? "deriva" : "noche";

export const Ambiente: React.FC<{ t: number; c1: string; c2: string; cx?: number; cy?: number }> = ({ t, c1, c2, cx = 960, cy = 540 }) => {
  const e = escenario(t);
  const dx = Math.sin(t * 0.21) * 40; // deriva lenta de cámara (capa cercana se mueve más)
  // vuelta 8 OJO: los ambientes pasan a los SETS ILUSTRADOS CON LUZ (sets.tsx), al nivel del molde
  let capa: React.ReactNode;
  if (e === "puerto") capa = <SetPuerto t={t} dx={dx} hora="tarde" barco={<Ballenero x={1320} y={650} t={t} escala={0.2} />}>
      <Multitud t={t} n={9} y={915} h={230} filas={2} seed={3} caminan={0.45} pinta={gentio(true)} />
    </SetPuerto>;
  else if (e === "interior") capa = <SetCamarote t={t} dx={dx} hora="noche" ventana={<div style={{ position: "absolute", left: 0, top: 0 }}><Ballenero x={((t * 22) % 700) - 200} y={215} t={t} escala={0.12} /></div>} />;
  else if (e === "cubierta") capa = <SetCubierta t={t} dx={dx} hora="tarde" lejos={<Ballenero x={1450} y={630} t={t + 3} escala={0.15} />}>
      <Multitud t={t} n={7} y={930} h={240} filas={2} seed={8} caminan={0.3} repertorio={["tira", "jarras", "senala", "rasca", "explica"]} pinta={gentio(false)} />
    </SetCubierta>;
  else if (e === "mar")
    capa = (
      <SetMar t={t} dx={dx} hora="dia" lejos={<>
        {(() => { const k = (t % 6) / 6; return k < 0.4 ? <div style={{ position: "absolute", left: 1500, top: 660 - k * 300, width: 40 + k * 120, height: k * 300, marginLeft: -(20 + k * 60), background: "rgba(240,250,255,.75)", borderRadius: "50% 50% 10% 10%" }} /> : null; })()}
        <Isla x={400} y={672} t={t} s={0.3} seed={3} />
        {[0, 1, 2].map((i) => <Gaviota key={i} x={((i * 700 + t * 80) % 2400) - 240} y={300 + i * 70} t={t} s={0.45} />)}
      </>} />
    );
  else if (e === "deriva")
    capa = (
      <SetMar t={t} dx={dx} hora="atardecer" lejos={<>
        {[0, 1].map((i) => { const x = ((i * 1100 + t * 60) % 2400) - 240; return <svg key={i} style={{ position: "absolute", left: x, top: 760 + i * 120, overflow: "visible" }} width={1} height={1}><path d="M -40 0 Q -10 -70 30 -90 Q 20 -40 40 0 Z" fill="#1a0f2a" /><path d="M -60 4 Q 0 -6 60 4" stroke="#ffb890" strokeWidth={4} fill="none" /></svg>; })}
      </>} />
    );
  else capa = <SetPuerto t={t} dx={dx} hora="noche"><Multitud t={t} n={6} y={915} h={230} filas={2} seed={12} caminan={0.5} pinta={gentio(true)} /></SetPuerto>;
  return (
    <>
      {capa}
      {/* paleta del inserto: viñeta suave de su color + foco de luz donde va la acción */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 75% at ${cx}px ${cy}px, rgba(255,255,255,0) 50%, ${c2}55 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: c1, opacity: 0.08, mixBlendMode: "color" }} />
    </>
  );
};
