// cme3d01 · CTA 2 (pág. 56 de la guía): el libro sigue sobre la mesa, las hojas pasan hasta la 56, las barras del ahorro
// SALTAN de la página como edificios, la cuenta del recupero (honesta: 46,99 ÷ 23,5 ≈ 2 meses) y la descripción con el link.
// No corta el video: entra y sale por el mismo mundo. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { C2, PT, screenOf } from "./barrio3d";
import { World, Desc } from "./Min1";
import { BigNum, COL, FONT, Tag, e, extrude, s, spr } from "./lib";

export const CTA2_FRAMES = s(20.5);
// punto de la página derecha (u,v) a h metros sobre el papel, en coordenadas del mundo
const bookPt = (u: number, v: number, h: number): [number, number, number] => {
  const q = new THREE.Vector3(0.004 + (u - 0.5) * 0.29, 0.006 + 0.038 + 0.0005 + h, (v - 0.5) * 0.438 - 0.012).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.06);
  return [PT.book[0] + q.x, PT.book[1] + q.y, PT.book[2] + q.z];
};

export const Cta2: React.FC = () => <Cta2Body t={C2 + useCurrentFrame() / 30} />;
// t = segundo GLOBAL del video (la usa Rest.tsx dentro del video entero)
export const Cta2Body: React.FC<{ t: number }> = ({ t }) => {
  const c = t - C2;
  const L: React.ReactNode[] = [<World key="w" t={t} />];
  L.push(<BigNum key="p56" t={c} at={1.3} text="PÁG. 56" size={120} x={1560} y={190} out={3.3} col="#ffd60a" edge="#5a4500" />);
  const lab = [
    { u: 0.223, h: 4.5, at: 4.6, tx: "REFRIGERADOR", $: "4,5" },
    { u: 0.395, h: 10, at: 5.64, tx: "CALENTADOR", $: "10" },
    { u: 0.567, h: 9, at: 6.7, tx: "AIRE", $: "9" },
  ];
  lab.forEach((b, i) => { const p = screenOf(t, bookPt(b.u, 0.407, 0.0062 * b.h)); L.push(<Tag key={"b" + i} t={c} at={b.at + 0.25} x={p.x} y={p.y} dx={(i - 1) * 120 - 60} dy={-150 - i * 40} text={`${b.$} US$`} sub={b.tx} col={COL.ink} out={11.0} size={46} />); });
  const tp = screenOf(t, bookPt(0.785, 0.407, 0.0062 * 17));
  L.push(<Tag key="tot" t={c} at={8.32} x={tp.x} y={tp.y} dx={60} dy={-230} text="23,5 US$ / MES" col="#ffd60a" out={10.9} size={62} />);
  L.push(<BigNum key="y" t={c} at={11.02} text="≈ 280 US$" sub="AL AÑO" size={150} x={960} y={250} out={13.2} col="#7dff9e" edge="#0e4a24" />);
  // la cuenta del recupero: precio ÷ ahorro
  const k = spr(c, 13.62, 0.9), o = e(c, 13.62, 13.8) * (1 - e(c, 16.2, 16.5));
  if (o > 0.01) L.push(<div key="eq" style={{ position: "absolute", left: 960, top: 300, opacity: o, perspective: 1300 }}>
    <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -600}px) rotateX(10deg) rotateY(${-8 + 3 * Math.sin(c)}deg)`, padding: "28px 48px", borderRadius: 24, background: "rgba(12,16,22,.93)", boxShadow: "0 50px 100px rgba(0,0,0,.7), inset 0 0 0 3px #7dff9e66", fontFamily: FONT, textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 800, fontSize: 46, color: COL.dim }}>46,99 US$ <span style={{ color: COL.ink }}>÷</span> 23,5 US$/mes</div>
      <div style={{ fontWeight: 900, fontSize: 120, color: "#7dff9e", lineHeight: 1.05, textShadow: extrude(10, "#0e4a24"), opacity: e(c, 13.9, 14.1) }}>= 2 MESES</div>
      <div style={{ fontWeight: 800, fontSize: 30, color: COL.amber, letterSpacing: 4, opacity: e(c, 15.0, 15.3) }}>Y LA GUÍA YA SE PAGÓ SOLA</div>
    </div>
  </div>);
  L.push(<Desc key="d" t={t} at={C2 + 16.52} out={C2 + 20.6} />);
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
