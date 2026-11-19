// tdp16 · piezas ENCIMA del plano, cada una sobre su palabra (ov). Nada arriba a la izquierda; texto limpio, sin tarjetas sobre las fotos.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, D, P, SANS, SERIF, cap, cl, e, eo, lerp, paginaBg, sale, sombra, spr, tapaBg } from "./lib";
import { Sello, sacudon } from "./escenas";

type OP = { t: number; a: number; b: number } & Record<string, any>;

// nombre: ETIQUETA DE EQUIPAJE de papel que entra colgando del ojal y se asienta como péndulo (abajo a la izquierda, grande)
export const Lower: React.FC<OP> = ({ t, a, b, name, sub }) => {
  const k = t - a, en = eo(t, a, 0.45), sw = k < 0 ? -40 : -34 * Math.exp(-k * 3.1) * Math.cos(k * 8.5), o = sale(t, b, 0.35);
  return <div style={{ position: "absolute", left: 70, bottom: 74, opacity: o, transform: `translateX(${(1 - en) * -720}px) translateY(${e(t, b - 0.35, b) * 60}px)` }}>
    <div style={{ position: "absolute", left: -120, top: 92, width: 170, height: 5, background: "#c9b48a", transform: "rotate(-8deg)", transformOrigin: "100% 50%", boxShadow: "0 2px 4px rgba(0,0,0,.4)" }} />
    <div style={{ transformOrigin: "46px 50%", transform: `rotate(${sw}deg)`, filter: "drop-shadow(0 18px 26px rgba(0,0,0,.55))" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "26px 54px 26px 96px", ...paginaBg,
      clipPath: "polygon(36px 0, 100% 0, 100% 100%, 36px 100%, 0 70%, 0 30%)", position: "relative" }}>
      <div style={{ position: "absolute", left: 30, top: "50%", width: 34, height: 34, marginTop: -17, borderRadius: "50%", background: C.navy, boxShadow: "0 0 0 7px #b8a06a, inset 0 3px 5px rgba(0,0,0,.6)" }} />
      <div style={{ width: 8, alignSelf: "stretch", background: C.red }} />
      <div>
        <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 96, lineHeight: 1, color: C.ink, whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ ...cap, fontSize: 46, letterSpacing: "0.1em", marginTop: 12, color: "rgba(29,26,22,.75)", whiteSpace: "nowrap", opacity: eo(t, a + 0.3, 0.4) }}>{sub}</div>
      </div>
    </div>
    </div>
  </div>;
};

// remate: la frase clave en una TIRA DE PAPEL que cae con peso al tercio inferior; las palabras clave golpean grandes como sello
export const Kin: React.FC<OP> = ({ t, a, b, txt }) => {
  const ws = String(txt).split(" "), nk = ws.length > 5 ? 3 : 2, k = t - a, land = cl(spr(t, a - 0.05, 1.1));
  const fs = ws.join(" ").length > 22 ? 104 : 128, lastAt = a + 0.12 + 0.13 * (ws.length - 1);
  return <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 96, opacity: sale(t, b, 0.3) }}>
    <div style={{ ...paginaBg, padding: "30px 64px 38px", maxWidth: 1640, textAlign: "center", boxShadow: "0 26px 60px rgba(0,0,0,.6)", display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 30,
      transform: `translateY(${(1 - land) * 340 + sacudon(t, lastAt + 0.1, 7)}px) rotate(${-1.6 + (1 - land) * 6 + 0.35 * Math.sin(k * 0.6)}deg) scale(${1 + 0.008 * k})` }}>
      {ws.map((w, i) => { const at = a + 0.12 + 0.13 * i, p = cl(spr(t, at, 1.5)), key = i >= ws.length - nk;
        return <span key={i} style={{ fontFamily: SERIF, fontWeight: key ? 600 : 400, fontSize: fs, lineHeight: 1.05, color: key ? C.red : C.ink, opacity: t < at ? 0 : 1,
          display: "inline-block", transform: `translateY(${(1 - p) * -90}px) scale(${lerp(1.35, 1, p)})` }}>{w}</span>; })}
    </div>
  </AbsoluteFill>;
};

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

// suscribirse: una tira de pasaporte entra abajo a la derecha y un SELLO DE GOMA real baja, golpea y deja la marca «subscribe»
export const Cta: React.FC<OP> = ({ t, a, b, fin }) => {
  const hitAt = a + 0.45, down = e(t, a - 0.1, hitAt), up = e(t, a + 0.8, a + 1.25);
  const y = lerp(-700, 0, down) + lerp(0, -820, up), squash = t > hitAt - 0.03 && t < a + 0.8 ? 0.9 : 1;
  return <div style={{ position: "absolute", right: 150, bottom: 130, width: 620, height: 330, opacity: sale(t, b, 0.4), transform: `translateY(${sacudon(t, hitAt, 8)}px)` }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.55))" }}>
      <Sello t={t} at={hitAt} top={fin ? `next · ${D.fin_txt || ""}` : "dirty passport"} big="subscribe" bottom="" rot={-6} scale={1.35} />
    </div>
    {t < a + 1.3 && <div style={{ position: "absolute", left: 170, top: -10, transform: `translateY(${y}px) scaleY(${squash})`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 100, height: 130, margin: "0 auto", borderRadius: "50px 50px 18px 18px", background: "linear-gradient(90deg, #4a2c14, #8a5a2e 40%, #5a3519)", boxShadow: "inset 0 4px 8px rgba(255,220,170,.3)" }} />
      <div style={{ width: 50, height: 64, margin: "0 auto", background: "linear-gradient(90deg, #3a2210, #6e4523, #3a2210)" }} />
      <div style={{ width: 300, height: 64, borderRadius: 8, background: "linear-gradient(180deg, #7a4c25, #4d2d12)", boxShadow: "0 18px 30px rgba(0,0,0,.5)" }} />
      <div style={{ width: 290, height: 16, margin: "0 auto", background: "#2a1a10", borderRadius: "0 0 6px 6px" }} />
    </div>}
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

// cierre: foto real del próximo país a pantalla llena (empuje lento), «next stop» y el país grande; el sello del pasaporte golpea
export const Fin: React.FC<OP> = ({ t, a, b }) => {
  const p = eo(t, a + 0.15, 0.6), k = t - a;
  return <AbsoluteFill style={{ ...tapaBg, overflow: "hidden" }}>
    {D.fin_f && <AbsoluteFill><Img src={staticFile(P + D.fin_f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.3 - 0.18 * cl(spr(t, a, 1.0)) + 0.03 * k}) translate(${-10 * k}px, ${-4 * k}px)`, transformOrigin: "0% 50%" }} /></AbsoluteFill>}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,9,18,.15), rgba(5,9,18,.25) 45%, rgba(5,9,18,.78))" }} />
    <div style={{ position: "absolute", left: 130, bottom: 140, color: C.cream, textShadow: "0 6px 30px rgba(0,0,0,.7)", transform: `translateY(${(1 - p) * 40}px) translateX(${sacudon(t, a + 0.75, 6)}px)`, opacity: p }}>
      <div style={{ ...cap, fontSize: 40, color: C.amber, letterSpacing: "0.3em" }}>{D.fin_top || "next stop"}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 176, lineHeight: 1, marginTop: 10 }}>{D.fin_txt || ""}</div>
    </div>
    <div style={{ position: "absolute", right: 180, top: 170 }}><Sello t={t} at={a + 0.75} top="dirty" big="passport" bottom="see you there" col={C.amber} scale={1.45} rot={-10} /></div>
  </AbsoluteFill>;
};

export const OVS: Record<string, React.FC<any>> = { Lower, Kin, Mitad, Cta, Prog, Fin };
