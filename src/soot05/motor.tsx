import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { C, FPS, fontFamily, ent, prog, Chip, Grande, Emote, Emo } from "./kit";
import { Persona, Ropa, Expr, CIVIL } from "./persona";
import { Ico, IcoK } from "./iconos";
import { Mundo, CieloMundo } from "./mundo";

// Motor de soot05: UNA cámara que viaja por un mundo único (sin cortes). Los datos (cámara, actores, eventos,
// sonido) se declaran con helpers de una línea en datos*.ts; el mezclador de SFX lee esas mismas líneas.

// ── cámara: llaves [t, x, y, z, dur]. Entre llaves la cámara viaja (curva suave; si el salto es largo
// se aleja en el medio = vuelo); al llegar sigue derivando lento (nunca queda quieta).
export type Llave = [number, number, number, number, number?];
const easeIO = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export type Pose = { x: number; y: number; z: number };
const deriva = (k: Llave, i: number, dt: number): Pose => {
  const dir = i % 2 ? 1 : -1;
  const d = Math.max(0, dt);
  const f = 1 + dir * Math.min(0.07, 0.014 * d);
  return { x: k[1] + Math.sin(i * 1.7) * 9 * d, y: k[2] + Math.cos(i * 2.3) * 4 * d, z: k[3] * f };
};
export const camara = (K: Llave[], t: number): Pose => {
  let i = 0;
  while (i + 1 < K.length && K[i + 1][0] <= t) i++;
  if (t < K[0][0]) return { x: K[0][1], y: K[0][2], z: K[0][3] };
  return pose(K, i, t);
};
const pose = (K: Llave[], i: number, t: number): Pose => {
  const k = K[i];
  if (i === 0) return deriva(k, i, t - k[0]);
  const a = pose(K, i - 1, k[0]);
  // viaje mínimo según lo que recorre la pantalla (OJO vuelta 1: nada de teletransportes de 1 cuadro)
  const zm = Math.sqrt(a.z * k[3]);
  const d = Math.max(k[4] ?? 0.9, Math.min(2.2, 0.45 + Math.hypot(k[1] - a.x, k[2] - a.y) * zm / 2600 + Math.abs(Math.log(k[3] / a.z)) * 0.35));
  if (t >= k[0] + d) return deriva(k, i, t - k[0] - d);
  const u = easeIO(Math.min(1, Math.max(0, (t - k[0]) / d)));
  const dist = Math.hypot(k[1] - a.x, k[2] - a.y);
  const lz0 = Math.log(a.z), lz1 = Math.log(k[3]);
  let lz = lz0 + (lz1 - lz0) * u;
  const zNec = 1500 / Math.max(1, dist);
  const lzMed = (lz0 + lz1) / 2;
  if (Math.log(zNec) < lzMed) lz += (Math.log(zNec) - lzMed) * 4 * u * (1 - u);
  return { x: a.x + (k[1] - a.x) * u, y: a.y + (k[2] - a.y) * u, z: Math.exp(lz) };
};

// ── actores
export type Act = {
  a: number; b: number; ropa?: Ropa; seed?: number;
  x: number | [number, number]; y: number | [number, number]; tw?: [number, number]; // tw = tramo del movimiento
  h?: number; expr?: Expr | [number, Expr][]; habla?: boolean | [number, number][]; flip?: boolean; camina?: number;
  bI?: number; bD?: number; cI?: number; cD?: number; mira?: number; miraY?: number; salta?: number[]; viejo?: boolean; aparece?: number;
  rot?: number | [number, number]; ronchas?: number | [number, number]; sobre?: Gorro; manoD?: IcoK; manoI?: IcoK; sombra?: string; ladea?: number; inclina?: number;
};
export const YO_TUNICA = "#b39a76";
export type Gorro = "corona" | "mitra" | "cofia" | "gorro" | "sombrero" | "capelo" | "barba" | "coronaFR" | "pelado" | "capYO";
const GORRO: Record<Gorro, React.ReactNode> = {
  corona: <g transform="translate(0 -560)"><path d="M -80 30 L -90 -40 L -45 0 L 0 -60 L 45 0 L 90 -40 L 80 30 Z" fill={C.oro} stroke="#b87a14" strokeWidth={6} />{[-45, 0, 45].map((x, i) => <circle key={x} cx={x} cy={12} r={10} fill={[C.rojo, C.teal, C.rojo][i]} />)}</g>,
  coronaFR: <g transform="translate(0 -560)"><path d="M -80 30 L -90 -40 L -45 0 L 0 -60 L 45 0 L 90 -40 L 80 30 Z" fill={C.oro} stroke="#b87a14" strokeWidth={6} /><path d="M 0 -20 q -14 18 0 40 q 14 -22 0 -40" fill="#2b3a9f" /></g>,
  mitra: <g transform="translate(0 -540)"><path d="M -70 20 L -80 -70 Q -40 -110 0 -140 Q 40 -110 80 -70 L 70 20 Z" fill="#fff" stroke="#d8d0e8" strokeWidth={4} /><rect x={-10} y={-136} width={20} height={156} fill={C.oro} /><rect x={-74} y={-10} width={148} height={18} fill={C.oro} /></g>,
  cofia: <path d="M -104 -470 Q -110 -580 0 -582 Q 110 -580 104 -470 Q 60 -520 0 -522 Q -60 -520 -104 -470 Z" fill="#f4f0e8" stroke="#c8c0d0" strokeWidth={5} />,
  gorro: <g><path d="M -110 -500 Q -100 -600 0 -606 Q 100 -600 110 -500 Z" fill="#3b1a5a" /><rect x={-120} y={-512} width={240} height={26} rx={12} fill="#2a1240" /></g>,
  sombrero: <g transform="translate(0 -540)"><rect x={-64} y={-120} width={128} height={120} rx={8} fill="#2a2440" /><rect x={-120} y={-12} width={240} height={26} rx={12} fill="#2a2440" /><rect x={-64} y={-34} width={128} height={18} fill={C.rojo} /></g>,
  capelo: <g transform="translate(0 -540)"><ellipse cx={0} cy={0} rx={150} ry={26} fill="#c81d2e" /><path d="M -80 0 Q -70 -70 0 -74 Q 70 -70 80 0 Z" fill="#e8344a" /></g>,
  barba: <path d="M -90 -420 Q -80 -330 0 -320 Q 80 -330 90 -420 Q 60 -380 0 -384 Q -60 -380 -90 -420 Z" fill="#5a4a3a" />,
  // gorro de cuero amarillo del preso de la miniatura (va solo en YO)
  capYO: <g><path d="M -112 -478 Q -112 -600 0 -606 Q 112 -600 112 -478 Q 0 -506 -112 -478 Z" fill="#c99a2a" /><path d="M -118 -476 Q 0 -506 118 -476 L 118 -458 Q 0 -488 -118 -458 Z" fill="#a87a1a" /><circle cx={0} cy={-606} r={14} fill="#a87a1a" /></g>,
  pelado: <ellipse cx={0} cy={-520} rx={96} ry={50} fill="#e8a27a" />,
};
const lerpT = (t: number, tw: [number, number] | undefined, v: number | [number, number]) =>
  typeof v === "number" ? v : v[0] + (v[1] - v[0]) * (tw ? interpolate(t, tw, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }) : 0);
const mano = (k?: IcoK) => (k ? <g transform="translate(-60 -60) scale(0.6)"><Ico k={k} s={200} /></g> : undefined);

export const Actores: React.FC<{ t: number; A: Act[]; x0: number; x1: number }> = ({ t, A, x0, x1 }) => (
  <>
    {A.map((p, i) => {
      if (t < p.a || t >= p.b) return null;
      const x = lerpT(t, p.tw, p.x), y = lerpT(t, p.tw, p.y);
      if (x < x0 - 400 || x > x1 + 400) return null;
      const mov = p.tw && typeof p.x !== "number" && t > p.tw[0] && t < p.tw[1];
      const ex = Array.isArray(p.expr) ? (p.expr.filter(([tt]) => t >= tt).pop()?.[1] ?? p.expr[0][1]) : p.expr;
      const habla = Array.isArray(p.habla) ? p.habla.some(([a, b]) => t >= a && t < b) : p.habla;
      const salta = p.salta ? p.salta.filter((s) => t >= s).pop() : undefined;
      const rot = p.rot === undefined ? 0 : typeof p.rot === "number" ? p.rot : lerpT(t, p.tw, p.rot);
      const ron = p.ronchas === undefined ? 0 : typeof p.ronchas === "number" ? p.ronchas : prog(t, p.ronchas[0], p.ronchas[1]);
      const flip = p.flip ?? (typeof p.x !== "number" ? p.x[1] < p.x[0] : false);
      const el = (
        <Persona key={i} x={x} y={y} h={p.h ?? 420} t={t} seed={p.seed ?? i + 1} ropa={p.ropa ?? CIVIL(i)} expr={ex} habla={habla}
          camina={mov ? p.camina ?? 1.7 : 0} flip={flip} bI={p.bI} bD={p.bD} cI={p.cI} cD={p.cD} mira={p.mira} miraY={p.miraY} salta={salta}
          viejo={p.viejo} aparece={p.aparece} ronchas={ron} sobre={p.sobre ? GORRO[p.sobre] : p.ropa?.tunica === YO_TUNICA ? GORRO.capYO : undefined} manoD={mano(p.manoD)} manoI={mano(p.manoI)} sombra={p.sombra} ladea={p.ladea} inclina={p.inclina} />
      );
      return rot ? <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: `${x}px ${y}px`, transform: `rotate(${rot}deg)` }}>{el}</div> : el;
    })}
  </>
);

// ── eventos de pantalla (o) y de mundo (w)
export type Ev = {
  t: number; t1?: number; k: "chip" | "grande" | "ico" | "sello" | "cuenta" | "flash" | "oscuro" | "emote" | "globo" | "linea";
  txt?: string; x?: number; y?: number; c?: string; tinta?: string; s?: number; ico?: IcoK; de?: number; a?: number; dur?: number; pre?: string; suf?: string;
  rot?: number; anim?: "pop" | "cae" | "sube" | "vuela" | "gira"; hx?: number; hy?: number; emo?: Emo; tag?: string; ts?: number; fijo?: boolean; icos?: IcoK[]; x2?: number; y2?: number;
};
const Sello: React.FC<{ t: number; e: Ev }> = ({ t, e }) => {
  const u = Math.min(1, (t - e.t) / 0.18);
  const s = u < 1 ? 2.6 - 1.6 * u : 1 + 0.06 * Math.exp(-(t - e.t - 0.18) * 10);
  const c = e.c ?? C.rojo;
  return (
    <div style={{ position: "absolute", left: e.x ?? 960, top: e.y ?? 540, transform: `translate(-50%,-50%) rotate(${e.rot ?? -8}deg) scale(${s})`, opacity: Math.min(1, u * 2), fontFamily, fontWeight: 700, fontSize: e.s ?? 110, color: c, border: `${(e.s ?? 110) * 0.09}px solid ${c}`, borderRadius: 18, padding: "0 30px", whiteSpace: "nowrap", letterSpacing: 4, background: "rgba(255,243,214,.92)", boxShadow: "0 10px 0 rgba(20,10,40,.3)" }}>
      {e.txt}
    </div>
  );
};
const IcoEv: React.FC<{ t: number; e: Ev; mundo?: boolean }> = ({ t, e }) => {
  const s0 = e.s ?? 1;
  const dt = t - e.t;
  let dx = 0, dy = 0, rot = e.rot ?? 0, sc = ent(t, e.t, 0, { damping: 10, stiffness: 190 });
  if (e.anim === "cae") { dy = -(Math.max(0, 1 - dt * 2.4) ** 2) * 700; sc = 1; }
  if (e.anim === "sube") dy = -dt * 40;
  if (e.anim === "gira") rot += dt * 120;
  if (e.anim === "vuela" && e.x2 !== undefined) { const u = prog(t, e.t, e.t + (e.dur ?? 0.8)); dx = (e.x2 - (e.x ?? 0)) * u; dy = ((e.y2 ?? e.y ?? 0) - (e.y ?? 0)) * u - Math.sin(u * Math.PI) * 220; rot += u * 360; }
  const flota = Math.sin(t * 2.2 + e.t) * 8;
  const out = e.t1 !== undefined ? interpolate(t, [e.t1, e.t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const S = 200 * s0;
  return (
    <div style={{ position: "absolute", left: (e.x ?? 960) + dx - S / 2, top: (e.y ?? 540) + dy + flota - S / 2, width: S, transform: `rotate(${rot}deg) scale(${sc * out})`, transformOrigin: "50% 50%" }}>
      <Ico k={e.ico!} s={S} />
      {e.tag && (
        <div style={{ position: "absolute", left: "50%", top: S * 0.92, transform: "translateX(-50%) rotate(-3deg)", fontFamily, fontWeight: 700, fontSize: e.ts ?? 40 * Math.max(0.8, s0), color: "#fff", background: e.c ?? C.rojo, borderRadius: 12, padding: "2px 16px", whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(20,10,40,.3)" }}>{e.tag}</div>
      )}
      {e.k === "ico" && e.txt === "X" && t > e.t + 0.35 && (
        <svg style={{ position: "absolute", inset: 0 }} width={S} height={S} viewBox="0 0 200 200"><path d={`M 20 20 L ${20 + 160 * prog(t, e.t + 0.35, e.t + 0.5)} ${20 + 160 * prog(t, e.t + 0.35, e.t + 0.5)} M 180 20 L ${180 - 160 * prog(t, e.t + 0.5, e.t + 0.65)} ${20 + 160 * prog(t, e.t + 0.5, e.t + 0.65)}`} stroke={C.rojo} strokeWidth={22} strokeLinecap="round" fill="none" /></svg>
      )}
    </div>
  );
};
const Globo: React.FC<{ t: number; e: Ev }> = ({ t, e }) => {
  const s = ent(t, e.t, 0, { damping: 11, stiffness: 180 });
  const out = e.t1 !== undefined ? interpolate(t, [e.t1, e.t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const x = e.x ?? 960, y = e.y ?? 300;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s * out})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "relative", background: "#fff", borderRadius: 40, padding: "18px 34px", fontFamily, fontWeight: 700, fontSize: e.s ?? 54, color: "#2a1530", whiteSpace: "nowrap", boxShadow: "0 10px 0 rgba(20,10,40,.3)", display: "flex", alignItems: "center", gap: 18 }}>
        {e.icos?.map((k, i) => <Ico key={i} k={k} s={(e.s ?? 54) * 2.2} />)}
        {e.txt}
        <div style={{ position: "absolute", left: (e.hx ?? 0.3) * 100 + "%", bottom: -34, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: "40px solid #fff" }} />
      </div>
    </div>
  );
};
// años (1356, 1774…) sin separador de miles
const anio = (e: Ev) => !e.suf && !e.pre && (e.a ?? 0) >= 1000 && (e.a ?? 0) <= 2100 && (e.de ?? 0) >= 1000;
const Cuenta: React.FC<{ t: number; e: Ev }> = ({ t, e }) => {
  const v = Math.round((e.de ?? 0) + ((e.a ?? 0) - (e.de ?? 0)) * prog(t, e.t, e.t + (e.dur ?? 0.8)));
  const size = e.s ?? 200;
  const out = e.t1 !== undefined ? interpolate(t, [e.t1, e.t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <div style={{ position: "absolute", left: e.x ?? 960, top: e.y ?? 540, transform: `translate(-50%,-50%) scale(${ent(t, e.t) * out})`, fontFamily, fontWeight: 700, fontSize: size, color: e.c ?? "#fff", WebkitTextStroke: `${size * 0.08}px #2a1530`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 ${size * 0.06}px 0 #2a1530` }}>{e.pre}{anio(e) ? String(v) : v.toLocaleString("en-US")}{e.suf}</div>;
};

const DUR: Partial<Record<Ev["k"], number>> = { chip: 2.6, grande: 2.4, ico: 2.6, sello: 2.2, cuenta: 2.8, emote: 1.6, globo: 2.6, flash: 0.35 };
export const Eventos: React.FC<{ t: number; E: Ev[]; mundo?: boolean }> = ({ t, E, mundo }) => (
  <>
    {E.map((e, i) => {
      const t1 = e.t1 ?? e.t + (DUR[e.k] ?? 2.5);
      if (t < e.t || t > t1 + 0.3) return null;
      const ee = { ...e, t1 };
      switch (e.k) {
        case "chip": return <Chip key={i} t={t} t0={e.t} t1={t1} text={e.txt!} color={e.c ?? C.violeta} tinta={e.tinta} x={e.x ?? 960} y={e.y ?? 140} size={e.s ?? 62} centro={e.x === undefined || e.hx === 1} />;
        case "grande": {
          const out = interpolate(t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <div key={i} style={{ position: "absolute", inset: 0, opacity: out }}><Grande t={t} t0={e.t} text={e.txt!} x={e.x ?? 960} y={e.y ?? 540} size={e.s ?? 150} color={e.c ?? C.crema} /></div>;
        }
        case "ico": return <IcoEv key={i} t={t} e={ee} mundo={mundo} />;
        case "sello": return <Sello key={i} t={t} e={ee} />;
        case "cuenta": return <Cuenta key={i} t={t} e={ee} />;
        case "globo": return <Globo key={i} t={t} e={ee} />;
        case "emote": return <Emote key={i} t={t} t0={e.t} t1={t1} tipo={e.emo!} x={e.x!} y={e.y!} s={e.s ?? 1.4} />;
        case "flash": return <AbsoluteFill key={i} style={{ background: e.c ?? "#fff", opacity: interpolate(t, [e.t, t1], [0.85, 0], { extrapolateRight: "clamp" }) }} />;
        case "oscuro": {
          const a = interpolate(t, [e.t, e.t + 0.3, t1 - 0.3, t1], [0, e.a ?? 0.9, e.a ?? 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <AbsoluteFill key={i} style={{ background: e.c ?? "#08040f", opacity: a }} />;
        }
        default: return null;
      }
    })}
  </>
);

// ── HUD: la factura que crece todo el video (arriba a la derecha) + el camino de las 7 trampas (abajo)
export type Cargo = [number, number, string]; // t, peniques, concepto
const plata = (d: number) => (d >= 12 ? `${Math.floor(d / 12)}s ${d % 12}d` : `${d}d`);
export const Factura: React.FC<{ t: number; F: Cargo[]; visible: [number, number][] }> = ({ t, F, visible }) => {
  const on = visible.some(([a, b]) => t >= a && t < b);
  const v = visible.find(([a, b]) => t >= a - 0.4 && t < b + 0.4);
  if (!v) return null;
  const e = Math.min(prog(t, v[0], v[0] + 0.35), 1 - prog(t, v[1], v[1] + 0.3));
  if (!on && e <= 0) return null;
  let total = 0, ult: Cargo | null = null;
  for (const c of F) {
    if (t < c[0]) break;
    total += c[1];
    ult = c;
  }
  const prev = ult ? total - ult[1] : 0;
  const shown = ult && t < ult[0] + 0.45 ? Math.round(prev + (total - prev) * prog(t, ult[0], ult[0] + 0.45)) : total;
  const golpe = ult ? Math.exp(-(t - ult[0]) * 6) : 0;
  return (
    <div style={{ position: "absolute", right: 46, top: 34, transform: `translateY(${(1 - e) * -260}px) scale(${1 + golpe * 0.12}) rotate(${2 - golpe * 4}deg)`, transformOrigin: "100% 0" }}>
      <div style={{ background: "#f6e3b4", borderRadius: 16, padding: "12px 26px 14px", boxShadow: "0 10px 0 rgba(20,10,40,.35)", border: "5px solid #c98f4a", fontFamily, textAlign: "right", minWidth: 270 }}>
        <div style={{ fontWeight: 700, fontSize: 30, color: "#8a5a2a", letterSpacing: 3 }}>YOUR BILL</div>
        <div style={{ fontWeight: 700, fontSize: 70, color: C.rojo, lineHeight: 1 }}>{plata(shown)}</div>
      </div>
      {ult && t < ult[0] + 1.6 && (
        <div style={{ position: "absolute", right: 10, top: 150 + (t - ult[0]) * 20, opacity: 1 - prog(t, ult[0] + 1.1, ult[0] + 1.6), fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", background: C.rojo, borderRadius: 12, padding: "4px 16px", whiteSpace: "nowrap" }}>+ {ult[2]}</div>
      )}
    </div>
  );
};
export const TRAMPAS = ["THE BILL", "THE CHAINS", "THE WAIT", "THE HOLE", "THE FEVER", "THE DEBT", "THE DOOR"];
export const Camino: React.FC<{ t: number; T: number[]; visible: [number, number][] }> = ({ t, T, visible }) => {
  const v = visible.find(([a, b]) => t >= a && t < b + 0.3);
  if (!v) return null;
  const e = Math.min(prog(t, v[0], v[0] + 0.4), 1 - prog(t, v[1], v[1] + 0.3));
  const n = T.filter((x) => t >= x).length;
  return (
    <div style={{ position: "absolute", left: 40, bottom: 34, display: "flex", gap: 12, alignItems: "center", transform: `translateY(${(1 - e) * 160}px)` }}>
      {TRAMPAS.map((nom, i) => {
        const act = i === n - 1, hecho = i < n - 1;
        const pop = act ? 1 + 0.25 * Math.exp(-(t - T[i]) * 5) : 1;
        return (
          <div key={i} style={{ width: act ? 86 : 54, height: 54, borderRadius: 27, background: act ? C.rojo : hecho ? "#7a6aa8" : "rgba(27,18,64,.65)", border: "4px solid #fff3d6", fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop})`, boxShadow: "0 6px 0 rgba(20,10,40,.3)" }}>
            {hecho ? "✓" : i + 1}
          </div>
        );
      })}
      {n > 0 && <div style={{ marginLeft: 10, fontFamily, fontWeight: 700, fontSize: 36, color: "#fff3d6", background: "rgba(27,18,64,.88)", border: "4px solid #fff3d6", borderRadius: 27, padding: "2px 22px", lineHeight: 1.2 }}>{TRAMPAS[n - 1]}</div>}
    </div>
  );
};

// ── escena completa: cielo + mundo bajo la cámara + actores + eventos de mundo; encima los de pantalla
export const Plano: React.FC<{ t: number; K: Llave[]; A: Act[]; W: Ev[]; extraMundo?: (c: Pose) => React.ReactNode; medio?: (c: Pose) => React.ReactNode; tinte?: number }> = ({ t, K, A, W, extraMundo, medio, tinte = 0 }) => {
  const c = camara(K, t);
  const p = camara(K, t - 1 / FPS);
  const vel = Math.hypot((c.x - p.x) * c.z, (c.y - p.y) * c.z) + Math.abs(Math.log(c.z / p.z)) * 900;
  const blur = vel > 50 ? Math.min(7, (vel - 50) / 40) : 0;
  const x0 = c.x - 960 / c.z - 500, x1 = c.x + 960 / c.z + 500;
  return (
    <AbsoluteFill>
      <CieloMundo t={t} cx={c.x} cy={c.y} z={c.z} />
      <AbsoluteFill style={{ overflow: "hidden", filter: `brightness(1.16) saturate(1.1)${blur ? ` blur(${blur.toFixed(1)}px)` : ""}` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: `translate(${960 - c.x * c.z}px, ${540 - c.y * c.z}px) scale(${c.z})` }}>
          <Mundo t={t} x0={x0} x1={x1} />
          {extraMundo?.(c)}
          <Actores t={t} A={A} x0={x0} x1={x1} />
        </div>
      </AbsoluteFill>
      {/* entre actores y rótulos de mundo: oscuros y carteles (los rótulos quedan siempre nítidos y opacos encima) */}
      {medio?.(c)}
      <AbsoluteFill style={{ overflow: "hidden", filter: blur ? `blur(${blur.toFixed(1)}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: `translate(${960 - c.x * c.z}px, ${540 - c.y * c.z}px) scale(${c.z})` }}>
          <Eventos t={t} E={W} mundo />
        </div>
      </AbsoluteFill>
      {tinte > 0 && <AbsoluteFill style={{ background: "#0a0518", opacity: tinte }} />}
    </AbsoluteFill>
  );
};
