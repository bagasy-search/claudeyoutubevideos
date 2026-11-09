// apa30 · CTA sin guía (la landing está caída): SUSCRIBIRSE + una pregunta para los comentarios. Nunca precio, nunca nombre real.
// Escena: la tarjeta del canal (la cara del presentador en el círculo) sobre el banco del granero; el dedo aprieta el botón rojo,
// el botón se hunde con peso y pasa a SUBSCRIBED, la campanita se balancea. cta2 suma la tarjeta de comentario con la pregunta.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Stage, H, phys, cl, eio, TX, DIM } from "./hkit";
import { FONT, P } from "./lib";
import PLAN from "./plan.json";

const ASK = (PLAN as unknown as { txt: { ask: [string, string, string] } }).txt.ask;
export const SubCTA: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const v2 = h.k === "cta2", card = phys(tt, 0.1, 5, 0.55), hand = eio(tt, 1.0, 1.7), press = phys(tt, 1.75, 11, 0.32), done = tt > 1.85;
  const bell = done ? Math.sin((tt - 1.9) * 14) * 22 * Math.exp(-(tt - 1.9) * 1.6) : 0;
  const ask = phys(tt, 2.8, 5, 0.6);
  const cx = v2 ? 640 : 960;
  return <>
    <div style={{ position: "absolute", left: cx, top: 470, transform: `translate(-50%,-50%) perspective(1600px) translateZ(${(1 - card) * -700}px) rotateX(${(1 - card) * 25 + 4}deg) rotateY(${-6 + 3 * Math.sin(tt * 0.4)}deg)`, opacity: cl(card * 2) }}>
      <div style={{ width: 980, padding: "44px 54px", borderRadius: 34, background: "linear-gradient(180deg,#24221f,#151412)", boxShadow: "0 60px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", display: "flex", alignItems: "center", gap: 40, fontFamily: FONT }}>
        <div style={{ width: 210, height: 210, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 6px #e9dcc0, 0 20px 40px rgba(0,0,0,.6)", flexShrink: 0 }}>
          <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", transform: "scale(1.9) translateY(14%)" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 58, color: TX, lineHeight: 1.05 }}>The Pest Almanac</div>
          <div style={{ fontWeight: 700, fontSize: 30, color: DIM, marginTop: 8 }}>garden · barn · coop — no poison</div>
          <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 30 }}>
            <div style={{ padding: "20px 46px", borderRadius: 50, background: done ? "#3a3936" : "#e5281f", color: done ? "#d8d4cc" : "#fff", fontWeight: 900, fontSize: 40, letterSpacing: 2,
              transform: `translateY(${tt > 1.7 && !done ? 6 : (1 - cl(press)) * 0}px) scale(${done ? 1 - 0.06 * Math.sin(Math.min(1, (tt - 1.85) * 3) * Math.PI) : 1})`, boxShadow: done ? "inset 0 3px 8px rgba(0,0,0,.5)" : "0 10px 0 #8a130d, 0 20px 30px rgba(0,0,0,.5)" }}>{done ? "SUBSCRIBED" : "SUBSCRIBE"}</div>
            <svg width={70} height={76} viewBox="0 0 70 76" style={{ transform: `rotate(${bell}deg)`, transformOrigin: "50% 8%", opacity: cl((tt - 1.85) * 4) }}>
              <path d="M35 6 C20 6 13 18 13 32 L13 48 L5 58 L65 58 L57 48 L57 32 C57 18 50 6 35 6 Z" fill="#f2c230" stroke="#a77d06" strokeWidth={3} />
              <circle cx={35} cy={66} r={7} fill="#f2c230" stroke="#a77d06" strokeWidth={3} />
            </svg>
          </div>
        </div>
      </div>
    </div>
    {/* el dedo que aprieta (viene desde abajo a la derecha en curva) */}
    <div style={{ position: "absolute", left: cx - 60 + 380 * (1 - hand), top: 620 + 300 * (1 - hand) + (tt > 1.7 && tt < 1.95 ? 10 : 0), fontSize: 120, transform: `rotate(${-18 + 18 * hand}deg)`, opacity: cl(hand * 3) * (1 - cl((tt - 2.6) * 2)), filter: "drop-shadow(0 18px 18px rgba(0,0,0,.5))" }}>👆</div>
    {v2 && <div style={{ position: "absolute", left: 1460, top: 520, transform: `translate(-50%,-50%) translateY(${(1 - ask) * 400}px) rotate(${3 - 2 * ask}deg)`, opacity: cl(ask * 2), width: 700, padding: "30px 36px", borderRadius: 26, background: "#f4efe4", color: "#1d1a15", fontFamily: FONT, boxShadow: "0 50px 100px rgba(0,0,0,.6)" }}>
      <div style={{ fontWeight: 800, fontSize: 28, color: "#7a6a52", letterSpacing: 3 }}>{ASK[0]}</div>
      <div style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.15, marginTop: 10 }}>{ASK[1]}</div>
      <div style={{ fontWeight: 700, fontSize: 32, color: "#a0461e", marginTop: 12 }}>{ASK[2]}</div>
    </div>}
  </>;
}}</Stage>;
export const _unused = AbsoluteFill;
