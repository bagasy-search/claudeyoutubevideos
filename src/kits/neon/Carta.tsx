// nx-carta-gira — plantear LA pregunta del video: un naipe de dorso violeta luminoso flota, gira en el aire y revela
// la pregunta (o una carta real); título en itálica serif encima. Opcional: dos cartas más se abren en abanico.
import React from "react";
import { interpolate } from "remotion";
import { N, SANS, SERIF, clamp, ease, easeOut, lerp, partes, pop, ramp, useSvgId, useT, vis } from "./base";
import { LineaTitulo } from "./Titulo";

type Palo = "♠" | "♥" | "♦" | "♣";
export type FrenteCarta = { rango: string; palo: Palo } | { texto: string };
const rojo = (p: Palo) => p === "♥" || p === "♦";

const Dorso: React.FC<{ w: number; h: number; t: number }> = ({ w, h, t }) => {
  const g = useSvgId("dg"), pat = useSvgId("dp");
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5a32c8" /><stop offset="0.5" stopColor="#2b1677" /><stop offset="1" stopColor="#6a40de" /></linearGradient>
        <pattern id={pat} width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={22} height={22} fill="none" stroke="#c9b2ff" strokeOpacity={0.45} strokeWidth={1.2} /></pattern>
      </defs>
      <rect width={w} height={h} rx={w * 0.07} fill={`url(#${g})`} />
      <rect x={w * 0.07} y={w * 0.07} width={w * 0.86} height={h - w * 0.14} rx={w * 0.04} fill={`url(#${pat})`} stroke="#e4d8ff" strokeWidth={2} />
      <circle cx={w / 2} cy={h / 2} r={w * 0.17} fill="#2b1677" stroke="#e4d8ff" strokeWidth={2} />
      <text x={w / 2} y={h / 2 + w * 0.07} textAnchor="middle" fontFamily={SERIF} fontSize={w * 0.2} fill="#e4d8ff">?</text>
      <rect width={w} height={h} rx={w * 0.07} fill="none" stroke="#fff" strokeOpacity={0.15 + 0.1 * Math.sin(t * 3)} strokeWidth={2} />
    </svg>
  );
};

const Frente: React.FC<{ w: number; h: number; f: FrenteCarta }> = ({ w, h, f }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.07, background: "linear-gradient(160deg,#ffffff 0%,#f1eee6 100%)", overflow: "hidden" }}>
    {"texto" in f ? (
      <div style={{ position: "absolute", inset: w * 0.08, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: w * 0.19, lineHeight: 1.02, color: "#140c26" }}>{f.texto}</div>
    ) : (
      <>
        {[0, 1].map((k) => (
          <div key={k} style={{ position: "absolute", left: w * 0.07, top: w * 0.05, transform: k ? "rotate(180deg)" : undefined, transformOrigin: `${w * 0.43}px ${h / 2 - w * 0.05}px`, fontFamily: SANS, fontWeight: 800, fontSize: w * 0.16, lineHeight: 0.95, textAlign: "center", color: rojo(f.palo) ? "#d0142c" : "#111" }}>
            {f.rango}<br /><span style={{ fontSize: w * 0.13 }}>{f.palo}</span>
          </div>
        ))}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: w * 0.5, color: rojo(f.palo) ? "#d0142c" : "#111" }}>{f.palo}</div>
      </>
    )}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,.0) 40%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 60%)", mixBlendMode: "overlay" }} />
  </div>
);

// (x, y) = centro de la carta en el MUNDO. tGiro = cuando se da vuelta (la palabra de la pregunta).
export const CartaGira: React.FC<{ x: number; y: number; t0: number; tGiro: number; t1?: number; frente: FrenteCarta; titulo?: string[]; abanico?: { rango: string; palo: Palo }[]; w?: number }> = ({ x, y, t0, tGiro, t1 = Infinity, frente, titulo, abanico = [], w = 250 }) => {
  const t = useT();
  if (!vis(t, t0, t1)) return null;
  const h = w * 1.42;
  const e = pop(t, t0, 13, 110);
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const kg = ramp(t, tGiro, 0.7, easeOut);
  const lift = Math.sin(Math.PI * ramp(t, tGiro, 0.7, ease));
  const rotY = kg * 180 + Math.sin(t * 1.3) * 9 * (1 - lift);
  const rotZ = lerp(-30, 0, e) + Math.sin(t * 0.9) * 2.5;
  const bob = Math.sin(t * 1.6) * 8;
  const flash = interpolate(t, [tGiro + 0.2, tGiro + 0.38, tGiro + 1.0], [0, 1, 0], clamp);
  const glowC = kg > 0.5 ? "rgba(255,255,255,.55)" : "rgba(183,123,255,.75)";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - sal }}>
      {titulo && (
        <div style={{ position: "absolute", left: x - 700, top: y - h / 2 - 70 - titulo.length * 84, width: 1400 }}>
          {titulo.map((l, i) => <LineaTitulo key={i} texto={l} t0={t0 + 0.1 + i * 0.15} size={partes(l).some((p) => p.it) ? 64 : 40} subrayado={false} />)}
        </div>
      )}
      <div style={{ position: "absolute", left: x - w * 1.5, top: y - w * 1.5, width: w * 3, height: w * 3, borderRadius: "50%", background: `radial-gradient(circle, ${kg > 0.5 ? "rgba(255,255,255,.22)" : "rgba(160,100,255,.22)"} 0%, transparent 60%)`, opacity: e * (1 + flash) }} />
      {abanico.map((c, i) => {
        const k = ramp(t, tGiro + 0.35 + i * 0.1, 0.5, easeOut);
        if (k <= 0) return null;
        const dir = i % 2 ? 1 : -1;
        return (
          <div key={i} style={{ position: "absolute", left: x - w * 0.42 + dir * k * w * 0.32, top: y + h * 0.18 + k * h * 0.55, width: w * 0.84, height: h * 0.84, transform: `translate(-0%,-50%) rotate(${dir * k * 9}deg)`, transformOrigin: "50% 100%", boxShadow: "0 18px 40px rgba(0,0,0,.6)", borderRadius: w * 0.06 }}>
            <Frente w={w * 0.84} h={h * 0.84} f={c} />
          </div>
        );
      })}
      {/* el filtro va en el contenedor: un filter en el elemento preserve-3d lo aplana y la carta nunca muestra el frente */}
      <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2 + bob - (1 - e) * 500, width: w, height: h, perspective: 1100, filter: `drop-shadow(0 0 ${18 + 30 * flash}px ${glowC}) drop-shadow(0 26px 30px rgba(0,0,0,.55))` }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(${1 + 0.14 * lift})` }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}><Dorso w={w} h={h} t={t} /></div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}><Frente w={w} h={h} f={frente} /></div>
        </div>
      </div>
      {flash > 0 && <div style={{ position: "absolute", left: x - w, top: y - w, width: w * 2, height: w * 2, borderRadius: "50%", border: `3px solid ${N.blanco}`, opacity: flash * 0.6, transform: `scale(${0.6 + (t - tGiro) * 1.2})`, filter: "blur(2px)" }} />}
    </div>
  );
};
