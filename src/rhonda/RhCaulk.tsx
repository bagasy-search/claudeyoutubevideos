// Kit Rhonda · SILICONA (rhcaulk): gráficos DENTRO del mundo (foto real del rincón, mesada, ventana, sombra).
//   RhKnifeStop    la foto del cúter a punto de cortar el cordón: la mano de Rhonda (guante amarillo) entra y frena; sello "STOP" y
//                  el cúter queda tachado en rojo (el gancho del segundo 0)
//   RhOvernight    la ventana del baño pasa de noche a mañana (luna → sol, reloj 10 PM → 6 AM) y al lado la tira sigue "wet" toda la noche
//   RhTwoNightRule dos polaroids "Night 1 / Night 2" pinchadas en el azulejo + veredicto: SAVED (celeste) o UNDER IT → REPLACE (rojo)
//   RhTapeLine     el truco de la cinta de pintor: dos tiras azules, el cordón entra, se alisa y se arranca la cinta → línea perfecta
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { RH, SERIF, LABEL, HAND, hexA, clamp01 } from "./RhTheme";
import { Card, Stamp, Tape, lin, pop, tileBg, useOut } from "./RhParts";

const Wall: React.FC = () => (
  <AbsoluteFill style={{ ...tileBg(200, 100) }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 18% 22%, rgba(255,248,230,0.9), rgba(255,255,255,0.1) 50%, rgba(30,42,54,0.1) 100%)" }} />
  </AbsoluteFill>
);

export const RhKnifeStop: React.FC<{ img: string }> = ({ img }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(4);
  const z = interpolate(f, [0, T], [1.04, 1.12]);
  const hand = pop(f, fps, 2, 12), cross = lin(f, 10, 20);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden" }}>
      <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z) }} />
      <AbsoluteFill style={{ background: `rgba(209,52,42,${0.12 * cross})` }} />
      {/* la mano de Rhonda que frena (palma con guante amarillo) */}
      <svg width={520} height={620} viewBox="0 0 520 620" style={{ position: "absolute", right: 120, top: 120, translate: `${(1 - hand) * 600}px 0`, rotate: `${(1 - hand) * 20}deg`, filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.35))" }}>
        <path d="M 150 600 L 150 330 Q 150 300 170 290 L 170 110 Q 170 80 200 80 Q 230 80 230 110 L 230 260 L 245 60 Q 248 30 278 30 Q 308 32 306 62 L 300 260 L 330 90 Q 335 62 365 66 Q 393 72 388 102 L 360 280 L 400 170 Q 410 145 438 152 Q 462 162 452 190 L 400 380 Q 380 470 330 520 L 330 600 Z" fill={RH.yellow} stroke="#C79A00" strokeWidth={6} />
        <rect x={140} y={560} width={210} height={60} rx={10} fill={RH.blue} />
      </svg>
      {/* el cúter tachado */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={360} y1={340} x2={360 + 520 * cross} y2={340 + 420 * cross} stroke={RH.red} strokeWidth={26} strokeLinecap="round" />
        <line x1={880} y1={340} x2={880 - 520 * cross} y2={340 + 420 * cross} stroke={RH.red} strokeWidth={26} strokeLinecap="round" />
      </svg>
      <Stamp text="Stop" at={6} color={RH.red} x="30%" y="20%" rot={-10} size={120} />
      <div style={{ position: "absolute", left: 120, bottom: 90, opacity: lin(f, 14, 24), background: RH.white, padding: "10px 32px", borderLeft: `14px solid ${RH.blue}`, boxShadow: `0 14px 30px ${RH.shadow}`, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: RH.ink }}>White again in one night</div>
    </AbsoluteFill>
  );
};

export const RhOvernight: React.FC<{ img?: string }> = ({ img }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = Easing.inOut(Easing.cubic)(lin(f, 6, T * 0.8));
  const hours = 22 + Math.floor(k * 8.99), hh = hours % 24, ampm = hh >= 12 ? "PM" : "AM", h12 = hh % 12 === 0 ? 12 : hh % 12;
  const sky = `linear-gradient(180deg, ${k < 0.7 ? `rgb(${20 + 200 * Math.max(0, k - 0.5) * 2},${30 + 150 * Math.max(0, k - 0.5) * 2},${70 + 120 * Math.max(0, k - 0.5) * 2})` : "#9FC8EA"} 0%, ${k < 0.7 ? "#2A3A5E" : "#F6D9A8"} 100%)`;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Wall />
      <AbsoluteFill style={{ background: `rgba(15,22,40,${0.55 * (1 - k)})` }} />
      {/* la ventana del baño */}
      <div style={{ position: "absolute", left: 180, top: 120, width: 620, height: 720, border: "26px solid #F4F2EE", borderRadius: 8, boxShadow: `0 30px 60px ${RH.shadow}`, background: sky, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 18, background: "#F4F2EE", translate: "-50% 0" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 18, background: "#F4F2EE", translate: "0 -50%" }} />
        <div style={{ position: "absolute", left: 120 + 300 * k, top: 120 + 260 * Math.abs(k - 0.5) * 2, width: 120, height: 120, borderRadius: "50%", background: k < 0.6 ? "#F3F0D8" : RH.yellow, boxShadow: k < 0.6 ? "0 0 50px rgba(240,235,200,0.8)" : `0 0 70px ${RH.yellow}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 140, background: "repeating-linear-gradient(90deg, #FFFFFF 0 34px, #F1EEE8 34px 40px)", opacity: 0.95 }} />
      </div>
      {/* reloj + la tira */}
      <div style={{ position: "absolute", right: 170, top: 150, width: 760 }}>
        <Card style={{ padding: "30px 44px", textAlign: "center" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 130, color: RH.ink, letterSpacing: 4 }}>{h12}:00 {ampm}</div>
        </Card>
        <div style={{ marginTop: 40, position: "relative", height: 300, borderRadius: 24, background: "linear-gradient(180deg,#FFFFFF,#ECE9E3)", boxShadow: `0 20px 40px ${RH.shadow}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 110, height: 70, borderRadius: 10, background: "#EDE7DA", boxShadow: "inset 0 0 0 3px rgba(150,190,220,0.6)" }} />
          <div style={{ position: "absolute", left: 30, right: 30, top: 95, height: 100, borderRadius: 14, background: "rgba(220,238,250,0.35)", border: "2px solid rgba(255,255,255,0.9)" }} />
          <div style={{ position: "absolute", left: 40, bottom: 26, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: RH.blueDeep }}>still wet under the plastic</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RhTwoNightRule: React.FC<{ a: string; b: string; verdict?: "saved" | "replace" }> = ({ a, b, verdict = "saved" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const pa = pop(f, fps, 0, 15), pb = pop(f, fps, 8, 13), v = lin(f, T * 0.5, T * 0.62);
  const Pol: React.FC<{ src: string; label: string; k: number; rot: number }> = ({ src, label, k, rot }) => (
    <div style={{ width: 600, background: "#fff", padding: "22px 22px 100px", rotate: `${rot}deg`, translate: `0 ${(1 - k) * 140}px`, opacity: Math.min(1, k * 1.5), boxShadow: `0 30px 60px ${RH.shadow}`, position: "relative" }}>
      <Img src={staticFile(src)} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: RH.ink }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Wall />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 70, paddingBottom: 120 }}>
        <div style={{ position: "relative" }}><Tape x={220} y={-18} rot={-4} w={170} /><Pol src={a} label="Night 1" k={pa} rot={-3} /></div>
        <div style={{ position: "relative" }}><Tape x={220} y={-18} rot={4} w={170} /><Pol src={b} label="Night 2" k={pb} rot={3} /></div>
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 70, translate: `-50% ${(1 - v) * 40}px`, opacity: v, background: verdict === "saved" ? RH.blueDeep : RH.red, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 70, padding: "14px 44px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: `0 14px 30px ${RH.shadow}` }}>
        {verdict === "saved" ? "White after 2 nights? You saved it" : "Still black? It's under it. Replace"}
      </div>
    </AbsoluteFill>
  );
};

export const RhTapeLine: React.FC<{}> = () => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const tape = lin(f, 4, T * 0.25), bead = lin(f, T * 0.25, T * 0.5), smooth = lin(f, T * 0.5, T * 0.65), pull = lin(f, T * 0.68, T * 0.88);
  const W = 1500, x0 = 210, yTile = 470, yTub = 560;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* azulejo arriba, bañera abajo, rincón en el medio */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: yTub, ...tileBg(220, 110) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: yTub, bottom: 0, background: "linear-gradient(180deg,#FFFFFF,#E9E7E2)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: yTub - 6, height: 12, background: "rgba(0,0,0,0.08)" }} />
      {/* cinta azul en el azulejo y en la bañera (se arranca al final) */}
      {[yTile - 60, yTub + 40].map((y, i) => (
        <div key={i} style={{ position: "absolute", left: x0, top: y, width: W * tape, height: 56, background: "#4E8FD0", opacity: 0.95, boxShadow: "0 3px 6px rgba(0,0,0,0.2)", transformOrigin: "100% 50%", rotate: `${pull * (i ? 14 : -14)}deg`, translate: `${pull * 200}px ${pull * (i ? 200 : -200)}px` }} />
      ))}
      {/* el cordón de silicona */}
      <div style={{ position: "absolute", left: x0, top: yTile - 4, width: W * bead, height: yTub - yTile + 40, borderRadius: "0 0 0 60px", background: `linear-gradient(180deg, #FFFFFF, #ECECE8)`, boxShadow: `inset 0 ${-14 + smooth * 10}px 20px rgba(0,0,0,${0.12 - smooth * 0.06})`, clipPath: smooth > 0 ? undefined : "polygon(0 0,100% 0,100% 100%,0 100%)" }}>
        {smooth < 1 ? Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i / 22) * 100}%`, top: 10 + (i % 3) * 18, width: 50, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.05)", opacity: 1 - smooth }} />) : null}
      </div>
      {/* el dedo mojado que alisa */}
      {smooth > 0 && smooth < 1 ? <div style={{ position: "absolute", left: x0 + W * smooth - 60, top: yTile - 70, width: 120, height: 200, borderRadius: 60, background: RH.yellow, boxShadow: "0 16px 20px rgba(0,0,0,0.25)", rotate: "20deg" }} /> : null}
      <div style={{ position: "absolute", left: "50%", top: 70, translate: "-50% 0", background: RH.white, padding: "10px 36px", boxShadow: `0 14px 30px ${RH.shadow}`, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: RH.blueDeep, opacity: 0.4 + 0.6 * clamp01(pull * 2) }}>tape, caulk, smooth, pull</div>
      <div style={{ position: "absolute", left: "50%", bottom: 70, translate: "-50% 0", opacity: lin(f, T * 0.85, T * 0.95), fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: RH.ink, background: hexA(RH.white, 0.9), padding: "8px 34px", borderRadius: 12 }}>A line like a pro</div>
    </AbsoluteFill>
  );
};
