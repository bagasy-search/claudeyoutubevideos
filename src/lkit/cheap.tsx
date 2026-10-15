// lkit · kit de texto "TheCheapFix" (14-oct-2026). Molde: youtu.be/SUqzcj5udsk (1,07M vistas, 24 cortes/min).
// Tres piezas, siempre ENCIMA del b-roll (nunca sobre el avatar):
//  - BigLine (overlay): la frase clave en MAYÚSCULAS blancas, sans gruesa, centrada; el plano de abajo se oscurece y se desenfoca.
//  - PricePill (overlay): la plata dicha ("$246", "about $1") en una píldora roja.
//  - Leak (overlay): destello naranja de ~0,6 s sobre un corte (entrada de cada ítem).
//  - ItemQ (lo usa ItemCard con look="q"): "#N" + nombre en una caja de borde rojo sobre seda negra con signos "?".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import { cl, eo, fit, lin, sp, useT } from "./core";

const fMo = loadMont("normal", { weights: ["600", "800"], subsets: ["latin", "latin-ext"] });
export const SANS = fMo.fontFamily;
export const RED = "#E5484D";

// fade de entrada/salida de una superposición de d cuadros
const io = (f: number, d: number, fin = 5, fout = 5) => cl(f / fin) * (1 - cl((f - (d - fout)) / fout));

export const BigLine: React.FC<{ txt: string; d: number; dim?: number }> = ({ txt, d, dim = 0.5 }) => {
  const f = useCurrentFrame();
  const o = io(f, d, 5, 6);
  const T = String(txt).toUpperCase();
  const lines = T.length > 46 ? 3 : T.length > 20 ? 2 : 1;
  const sz = fit(T, 1180, 84, "label", lines, 1, 40) * 0.92;
  return (
    <AbsoluteFill>
      {/* el plano de abajo se apaga y se desenfoca (no lo tapa: se sigue viendo qué es) */}
      <AbsoluteFill style={{ backdropFilter: `blur(${7 * o}px) brightness(${1 - dim * o})`, WebkitBackdropFilter: `blur(${7 * o}px) brightness(${1 - dim * o})` } as React.CSSProperties} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
        <div style={{ maxWidth: 1260, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: sz, lineHeight: 1.12, letterSpacing: 1,
          color: "#fff", textShadow: "0 4px 18px rgba(0,0,0,0.55)", transform: `translateY(${(1 - eo(f / 8)) * 14}px)` }}>{T}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PricePill: React.FC<{ txt: string; d: number; y?: number }> = ({ txt, d, y = 46 }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 12, 230), o = 1 - cl((f - (d - 5)) / 5);
  const sz = fit(txt, 900, 58, "label", 1, 0, 30);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: `${y}%`, opacity: cl(u * 2) * o }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: sz, color: "#fff", background: RED, borderRadius: sz, padding: `${sz * 0.14}px ${sz * 0.55}px`,
        boxShadow: "0 10px 28px rgba(0,0,0,0.35)", whiteSpace: "nowrap", transform: `scale(${0.7 + 0.3 * u})` }}>{txt}</div>
    </AbsoluteFill>
  );
};

export const Leak: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const u = f / Math.max(1, d), o = Math.sin(Math.PI * cl(u));
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.9 * o, pointerEvents: "none",
      background: `radial-gradient(ellipse 55% 75% at ${10 + 80 * u}% 40%, rgba(255,150,40,0.95), rgba(255,90,20,0.55) 38%, rgba(255,60,0,0) 70%),
                   radial-gradient(ellipse 30% 50% at ${70 - 50 * u}% 75%, rgba(255,210,120,0.8), rgba(255,210,120,0) 70%)` }} />
  );
};

// seda negra con pliegues que se mueven + "?" que flotan
const Silk: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: "#07070a", overflow: "hidden" }}>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ position: "absolute", left: "-30%", top: `${-20 + i * 32}%`, width: "160%", height: "46%", borderRadius: "50%",
        transform: `rotate(${-18 + i * 11 + 3 * Math.sin(f / 70 + i)}deg) translateX(${40 * Math.sin(f / 90 + i * 2)}px)`,
        background: "radial-gradient(ellipse at 50% 50%, rgba(120,110,140,0.22), rgba(40,36,52,0.08) 45%, rgba(0,0,0,0) 70%)", filter: "blur(18px)" }} />
    ))}
    {Array.from({ length: 9 }, (_, i) => {
      const r = (n: number) => { const x = Math.sin(i * 77.3 + n * 19.1) * 43758.5; return x - Math.floor(x); };
      return <div key={"q" + i} style={{ position: "absolute", left: `${6 + r(1) * 88}%`, top: `${(r(2) * 100 - f * (0.06 + 0.06 * r(3)) + 200) % 110 - 5}%`,
        fontFamily: SANS, fontWeight: 800, fontSize: 40 + 50 * r(4), color: "rgba(230,225,240,0.35)", filter: `blur(${r(5) > 0.6 ? 2 : 0}px)`,
        transform: `rotate(${-15 + 30 * r(6)}deg)` }}>?</div>;
    })}
  </AbsoluteFill>
);

export const ItemQ: React.FC<{ a: number; d: number; n: number; name: string; instead?: string; t?: number }> = ({ a, d, n, name, instead, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 2, 14, 150), out = lin(f, d - 6, d, 0, 1);
  const ins = t != null && instead ? sp(f, at(t), 14, 170) : 0;
  const nsz = fit(name, 860, 54, "label", 2, 0, 30);
  return (
    <AbsoluteFill>
      <Silk f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: cl(u * 2) * (1 - out), transform: `scale(${0.86 + 0.14 * u})`, textAlign: "center", maxWidth: 980,
          border: `3px solid ${RED}`, borderRadius: 18, background: "rgba(40,10,14,0.55)", padding: "26px 54px 30px",
          boxShadow: `0 0 40px rgba(229,72,77,0.25), inset 0 0 30px rgba(229,72,77,0.12)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#fff", lineHeight: 1 }}>#{n}</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: nsz, color: "#fff", lineHeight: 1.15, marginTop: 10 }}>{name}</div>
          {ins > 0 ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: Math.min(40, nsz * 0.75), color: RED, marginTop: 14, opacity: ins,
            transform: `translateY(${(1 - ins) * 12}px)` }}>→ {instead}</div> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CHEAP_OVERLAYS: Record<string, React.FC<any>> = { BigLine, PricePill, Leak };
