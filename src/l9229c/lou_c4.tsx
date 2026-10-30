// l9229c retoque final propio (después de la vuelta 3): hoja doblada = prop real en la mano que la mete bajo la azucarera; rollo sin texto, «37» grande en la punta
import React from "react";
import { HAND, cl, eio } from "./hkit";
import { S, D, C, Prop, Cam, Mesa } from "./pk";
import { Fondo } from "./lk";

const HKitchenTableIn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fold = eio(tt, 0.8, 2.2), go = eio(tt, 2.4, d - 1.2), x = 620 + 700 * go, y = 760 + 40 * go, lift = tt > d - 1.6 && tt < d - 1.0 ? 10 * Math.sin((tt - d + 1.6) / 0.6 * Math.PI) : 0;
  return <Cam tt={tt} d={d} z={0.07} fx={x} fy={720}>
    <Fondo id="lc_e19" tt={tt} b={14} br={0.4} />
    <div style={{ position: "absolute", left: 0, top: 600, width: 1920, height: 480, background: "linear-gradient(#e8c048,#d4a830)", boxShadow: "inset 0 30px 40px rgba(0,0,0,.25)" }} />
    {fold < 1 && <div style={{ position: "absolute", left: x - 330 * (1 - fold), top: y - 360 + 200 * fold, width: 660 * (1 - fold * 0.75), height: 440 * (1 - fold * 0.7), background: "repeating-linear-gradient(#fdfaf0 0 44px,#c8d8e8 44px 46px)", boxShadow: "12px 18px 22px rgba(0,0,0,.3)", transform: `perspective(900px) rotateX(${fold * 70}deg)`, transformOrigin: "50% 100%", opacity: 1 - cl((fold - 0.85) / 0.15) }}>
      <div style={{ position: "absolute", left: 30, top: 40, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#22314f" }}>I forgive you, Ray.</div></div>}
    {fold > 0.8 && <Prop id="folded_paper" x={x} y={y + 60} w={300} r={-6} o={cl((fold - 0.8) / 0.2)} />}
    {fold > 0.8 && <Prop id="hand_pinch" x={x - 120} y={y + 20} w={420} r={-20} sh={0} />}
    <Prop id="sugar_bowl" x={1460} y={880 - lift} w={500} />
  </Cam>;
}} />;

const HCostList: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d * 0.55), fall = cl((tt - d * 0.55) / 1.6), EDGE = 1500, rx = 300 + (EDGE - 300) * p;
  return <Cam tt={tt} d={d} z={0.06} fx={1100} fy={640}>
    <Fondo id="lc_e10" tt={tt} b={10} br={0.45} />
    <Mesa y0={600} tone="#7a5a3a" />
    <div style={{ position: "absolute", left: 160, top: 600, width: Math.max(0, rx - 160), height: 200, background: "repeating-linear-gradient(90deg,#f6f0de 0 58px,#c9d6e2 58px 61px),linear-gradient(#fbf6e8,#e8e0c8)", backgroundBlendMode: "multiply", boxShadow: "0 14px 22px rgba(0,0,0,.3)", transform: "perspective(1000px) rotateX(40deg)", transformOrigin: "50% 0" }} />
    {fall > 0 && <div style={{ position: "absolute", left: EDGE - 220, top: 740, width: 220, height: 340 * fall, background: "repeating-linear-gradient(#f6f0de 0 58px,#c9d6e2 58px 61px)", boxShadow: "16px 14px 26px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 0, bottom: 20, width: 220, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 130, lineHeight: 1, color: "#b3322a", opacity: cl(fall * 2 - 1) }}>37</div></div>}
    <Prop id="paper_roll" x={Math.min(rx, EDGE) + 300 * fall} y={680 + 700 * fall * fall} w={620} r={-4 + 360 * p + 200 * fall} sh={0.6 * (1 - fall)} />
  </Cam>;
}} />;

export const HCC4: Record<string, C> = { kitchenTableIn: HKitchenTableIn, costList: HCostList };
