// tdp16 · piezas ENCIMA del plano, cada una sobre su palabra (ov). Nada arriba a la izquierda; texto limpio, sin tarjetas sobre las fotos.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, D, P, SANS, SERIF, cap, cl, e, eo, lerp, sale, sombra, spr, tapaBg } from "./lib";
import { Sello } from "./escenas";

type OP = { t: number; a: number; b: number } & Record<string, any>;

// nombre de la persona: filete rojo que crece + nombre en serif + oficio en caps (abajo a la izquierda)
export const Lower: React.FC<OP> = ({ t, a, b, name, sub }) => {
  const p = eo(t, a, 0.5) * sale(t, b);
  return <div style={{ position: "absolute", left: 96, bottom: 92, opacity: p, color: C.cream, textShadow: sombra }}>
    <div style={{ width: 90 * eo(t, a + 0.1, 0.5), height: 4, background: C.red, marginBottom: 14 }} />
    <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 64, lineHeight: 1.05, transform: `translateX(${(1 - eo(t, a, 0.5)) * -30}px)` }}>{name}</div>
    <div style={{ ...cap, fontSize: 22, marginTop: 8, opacity: eo(t, a + 0.35, 0.4) }}>{sub}</div>
  </div>;
};

// remate: la frase clave palabra por palabra, abajo al centro (sólo en los golpes)
export const Kin: React.FC<OP> = ({ t, a, b, txt }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 100, opacity: sale(t, b, 0.25) }}>
    <div style={{ display: "flex", gap: "0.28em", fontFamily: SERIF, fontWeight: 400, fontSize: 92, color: C.cream, textShadow: sombra, lineHeight: 1, maxWidth: 1500, flexWrap: "wrap", justifyContent: "center" }}>
      {String(txt).split(" ").map((w: string, i: number) => { const p = eo(t, a + i * 0.26, 0.24); return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>{w}</span>; })}
    </div>
  </AbsoluteFill>
);

// pantalla partida con recuerdo físico: el avatar se corre a la izquierda y cae una polaroid con la foto de la persona/lugar
export const Mitad: React.FC<OP> = ({ t, a, b, f, txt }) => {
  const p = cl(spr(t, a + 0.15, 1.1)), o = sale(t, b, 0.4);
  return <div style={{ position: "absolute", right: 150, top: 150, opacity: o, transform: `translateY(${(1 - p) * -700}px) rotate(${lerp(14, 4, p)}deg)` }}>
    <div style={{ width: 640, background: "#fbf8f1", padding: "22px 22px 30px", boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
      <div style={{ width: "100%", height: 560, overflow: "hidden" }}><Img src={staticFile(P + f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.11 + 0.03 * cl((t - a) / 6)})`, transformOrigin: "0% 50%" }} /></div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 40, color: C.ink, marginTop: 18, textAlign: "center" }}>{txt}</div>
    </div>
  </div>;
};

// suscribirse: botón que se aprieta con el cursor, abajo al centro (sólo sobre avatar)
export const Cta: React.FC<OP> = ({ t, a, b, txt }) => {
  const p = cl(spr(t, a, 1.1)), press = e(t, a + 1.3, a + 1.45) * (1 - e(t, a + 1.6, a + 1.8)), on = t > a + 1.5;
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", opacity: sale(t, b) }}>
    <div style={{ transform: `translateY(${(1 - p) * 160}px) scale(${1 - 0.06 * press})`, display: "flex", alignItems: "center", gap: 22, padding: "18px 38px", borderRadius: 60, background: on ? C.navy2 : C.red, boxShadow: "0 14px 40px rgba(0,0,0,.5)" }}>
      <span style={{ ...cap, color: C.cream, fontSize: 30, letterSpacing: "0.18em" }}>{on ? "subscribed" : "subscribe"}</span>
      {txt && <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.cream, fontSize: 30, opacity: 0.85 }}>{txt}</span>}
    </div>
  </div>;
};

// progreso del viaje: «stop 3 / 8» arriba a la derecha, chiquito
export const Prog: React.FC<OP> = ({ t, a, b, n, N }) => {
  const p = eo(t, a, 0.4) * sale(t, b, 0.3);
  return <div style={{ position: "absolute", right: 70, top: 62, opacity: p * 0.92, display: "flex", alignItems: "center", gap: 14, color: C.cream, textShadow: sombra }}>
    <span style={{ ...cap, fontSize: 18 }}>stop</span>
    <span style={{ fontFamily: SERIF, fontSize: 40 }}>{n}<span style={{ opacity: 0.6, fontSize: 28 }}> / {N}</span></span>
    <div style={{ display: "flex", gap: 6 }}>{Array.from({ length: N }, (_, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < n ? C.amber : "rgba(246,240,228,.35)" }} />)}</div>
  </div>;
};

// cierre: tapa del pasaporte que se cierra con el sello de la próxima parada
export const Fin: React.FC<OP> = ({ t, a, b }) => {
  const p = eo(t, a, 0.8);
  return <AbsoluteFill style={{ ...tapaBg, opacity: e(t, a, a + 0.4), alignItems: "center", justifyContent: "center" }}>
    <div style={{ textAlign: "center", color: C.cream, transform: `scale(${lerp(0.94, 1, p)})` }}>
      <div style={{ ...cap, fontSize: 24, opacity: 0.75 }}>{D.fin_top || "next stop"}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 96, marginTop: 14 }}>{D.fin_txt || ""}</div>
    </div>
    <div style={{ position: "absolute", right: 260, bottom: 170 }}><Sello t={t} at={a + 0.8} top="dirty" big="passport" bottom="see you there" col={C.amber} scale={0.7} /></div>
  </AbsoluteFill>;
};

export const OVS: Record<string, React.FC<any>> = { Lower, Kin, Mitad, Cta, Prog, Fin };
