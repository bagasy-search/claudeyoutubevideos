import React from "react";
import { interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { C, fontFamily, ent, prog } from "./kit";
import { TRAMPAS } from "./motor";

// Piezas especiales de soot05 (en coordenadas de MUNDO salvo que diga "pantalla").

// grilletes en los tobillos de un personaje (pies en x,y; h = alto del personaje); se cierran en t0
export const Grilletes: React.FC<{ t: number; x: number; y: number; h?: number; t0?: number; aX?: number; aY?: number; peso?: number }> = ({ t, x, y, h = 430, t0 = -9, aX, aY, peso = 1 }) => {
  const S = h / 560;
  const cierra = interpolate(t, [t0, t0 + 0.12], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tob = [x - 30 * S, x + 30 * S];
  const yy = y - 26 * S;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      {aX !== undefined && (
        <path d={`M ${tob[1]} ${yy} Q ${(tob[1] + aX) / 2} ${Math.max(yy, aY ?? yy) + 60} ${aX} ${aY ?? yy}`} stroke="#9aa3b3" strokeWidth={10 * S * peso} fill="none" strokeDasharray={`${18 * S} ${8 * S}`} />
      )}
      <line x1={tob[0]} y1={yy} x2={tob[1]} y2={yy} stroke="#9aa3b3" strokeWidth={8 * S * peso} strokeDasharray={`${14 * S} ${6 * S}`} />
      {tob.map((tx, i) => (
        <g key={i} transform={`translate(${tx} ${yy})`}>
          <path d={`M ${-22 * S} ${-cierra * S * 0.4} A ${22 * S} ${22 * S} 0 0 1 ${22 * S} ${-cierra * S * 0.4}`} fill="none" stroke="#c8ccd4" strokeWidth={13 * S * peso} />
          <path d={`M ${-22 * S} 0 A ${22 * S} ${22 * S} 0 0 0 ${22 * S} 0`} fill="none" stroke="#8b93a3" strokeWidth={13 * S * peso} />
          <rect x={-8 * S} y={-26 * S} width={16 * S} height={10 * S} fill="#5a6070" />
        </g>
      ))}
      {aX !== undefined && <circle cx={aX} cy={aY ?? yy} r={18 * S} fill="none" stroke="#5a6070" strokeWidth={10 * S} />}
    </svg>
  );
};

// la factura del carcelero: rollo que se desenrolla hacia abajo desde (x,y) con renglones de cobro
export const Recibo: React.FC<{ t: number; t0: number; x: number; y: number; largo: number; items: [string, string][]; w?: number; dur?: number; resalta?: number }> = ({ t, t0, x, y, largo, items, w = 220, dur = 0.9, resalta = -1 }) => {
  if (t < t0) return null;
  const u = prog(t, t0, t0 + dur);
  const H = 40 + (largo - 40) * u;
  const r = rnd(7);
  return (
    <svg style={{ position: "absolute", left: x - w / 2, top: y, overflow: "visible" }} width={w} height={H + 40}>
      <rect x={6} y={14} width={w - 12} height={H} fill="#fff3d6" />
      <rect x={6} y={14} width={14} height={H} fill="#ecd9a8" />
      <text x={w / 2} y={50} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={28} fill={C.rojo}>BILL</text>
      {items.map(([a, b], i) => {
        const yy = 84 + i * 34;
        if (yy > H) return null;
        return (
          <g key={i}>
            {i === resalta && <rect x={10} y={yy - 26} width={w - 20} height={34} fill={C.ambar} opacity={0.55 + 0.3 * Math.sin(t * 9)} />}
            <text x={22} y={yy} fontFamily={fontFamily} fontWeight={600} fontSize={22} fill="#5a2a08">{a}</text>
            <text x={w - 18} y={yy} textAnchor="end" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill={C.rojo}>{b}</text>
          </g>
        );
      })}
      {Array.from({ length: Math.max(0, Math.floor((H - 84 - items.length * 34) / 30)) }, (_, i) => (
        <rect key={i} x={22} y={84 + items.length * 34 + i * 30 - 14} width={(w - 50) * (0.5 + r() * 0.5)} height={8} rx={4} fill="#d8b98a" />
      ))}
      <rect x={0} y={0} width={w} height={24} rx={12} fill="#c98f4a" />
      <ellipse cx={w / 2} cy={H + 18} rx={w / 2 + 4} ry={18} fill="#c98f4a" />
    </svg>
  );
};

// nube verde de la fiebre: blobs que crecen desde (x,y) entre t0 y t1, se disipa en t2
export const Nube: React.FC<{ t: number; t0: number; t1: number; t2?: number; x: number; y: number; r: number; seed?: number; color?: string }> = ({ t, t0, t1, t2 = 1e9, x, y, r, seed = 3, color = "#7be36a" }) => {
  if (t < t0 || t > t2 + 0.6) return null;
  const u = prog(t, t0, t1);
  const out = 1 - prog(t, t2, t2 + 0.6);
  const R = rnd(seed);
  const bs = Array.from({ length: 18 }, () => ({ a: R() * Math.PI * 2, d: R(), s: 0.25 + R() * 0.35, f: R() * 6 }));
  return (
    <svg style={{ position: "absolute", left: x - r * 1.6, top: y - r * 1.6, overflow: "visible", opacity: 0.55 * out }} width={r * 3.2} height={r * 3.2}>
      {bs.map((b, i) => {
        const dd = b.d * r * u;
        return <circle key={i} cx={r * 1.6 + Math.cos(b.a + t * 0.2) * dd} cy={r * 1.6 + Math.sin(b.a + t * 0.2) * dd * 0.6} r={r * b.s * (0.3 + 0.7 * u) * (1 + 0.08 * Math.sin(t * 2 + b.f))} fill={color} />;
      })}
    </svg>
  );
};

// el camino de las 7 trampas sobre el mundo (pines en coordenadas de mundo, tamaño constante en pantalla)
export const Pines: React.FC<{ t: number; t0: number; t1: number; z: number; P: [number, number][] }> = ({ t, t0, t1, z, P }) => {
  if (t < t0 || t > t1 + 0.4) return null;
  const out = 1 - prog(t, t1, t1 + 0.4);
  const k = 1 / z;
  const path = P.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y - 90 * k}`).join(" ");
  const u = prog(t, t0 + 0.2, t0 + 0.2 + 0.22 * 7);
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: out }} width={1} height={1}>
        <path d={path} stroke="#fff3d6" strokeWidth={8 * k} fill="none" strokeDasharray={`${24 * k} ${16 * k}`} strokeDashoffset={-t * 60 * k} pathLength={1000} style={{ strokeDasharray: `${u * 1000} 1000` }} />
      </svg>
      {P.map(([x, y], i) => {
        const ti = t0 + 0.2 + i * 0.22;
        if (t < ti) return null;
        const s = ent(t, ti, 0, { damping: 9, stiffness: 200 }) * out;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s * k})`, transformOrigin: "50% 100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", background: C.violeta, borderRadius: 10, padding: "2px 12px", marginBottom: 6, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(20,10,40,.35)" }}>{TRAMPAS[i].replace("THE ", "")}</div>
            <div style={{ width: 74, height: 74, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: C.rojo, border: "6px solid #fff3d6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 0 rgba(20,10,40,.35)" }}>
              <span style={{ transform: "rotate(45deg)", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff" }}>{i + 1}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

// cartel de hotel que baja colgado y se balancea (PANTALLA)
export const Letrero: React.FC<{ t: number; t0: number; t1: number; txt: string; estrellas: number; x?: number }> = ({ t, t0, t1, txt, estrellas, x = 960 }) => {
  if (t < t0 || t > t1 + 0.4) return null;
  const baja = ent(t, t0, 0, { damping: 8, stiffness: 120 });
  const sube = prog(t, t1, t1 + 0.4);
  const ang = Math.sin((t - t0) * 5) * 14 * Math.exp(-(t - t0) * 1.2);
  return (
    <div style={{ position: "absolute", left: x - 360, top: -440 + 470 * baja - 600 * sube, width: 720, transformOrigin: "50% -200px", transform: `rotate(${ang}deg)` }}>
      <svg width={720} height={200} style={{ position: "absolute", top: -200 }}><line x1={160} y1={0} x2={160} y2={200} stroke="#5a3418" strokeWidth={8} /><line x1={560} y1={0} x2={560} y2={200} stroke="#5a3418" strokeWidth={8} /></svg>
      <div style={{ background: "#7a4520", border: "10px solid #c98f4a", borderRadius: 26, padding: "18px 0 22px", textAlign: "center", boxShadow: "0 16px 0 rgba(20,10,40,.35)" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 96, color: C.oro, letterSpacing: 6, lineHeight: 1 }}>{txt}</div>
        <div style={{ fontSize: 70, lineHeight: 1.1, marginTop: 8, letterSpacing: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ color: i < estrellas ? C.oro : "rgba(255,243,214,.25)", display: "inline-block", transform: `scale(${i < estrellas ? ent(t, t0 + 0.5 + i * 0.12) : 1})` }}>★</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// en lo oscuro: sólo dos ojos que parpadean (PANTALLA)
export const Ojos: React.FC<{ t: number; t0: number; t1: number; x: number; y: number; s?: number; n?: number }> = ({ t, t0, t1, x, y, s = 1, n = 1 }) => {
  if (t < t0 || t > t1) return null;
  const op = Math.min(prog(t, t0, t0 + 0.4), 1 - prog(t, t1 - 0.3, t1));
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, opacity: op }} width={1920} height={1080}>
      {Array.from({ length: n }, (_, k) => {
        const r = rnd(k + 11);
        const cx = k === 0 ? x : r() * 1700 + 110, cy = k === 0 ? y : 300 + r() * 600, ss = k === 0 ? s : 0.4 + r() * 0.4;
        const parp = ((t + k * 0.7) % 2.6) < 0.12 ? 0.1 : 1;
        if (k > 0 && t < t0 + 0.4 + k * 0.25) return null;
        return (
          <g key={k} transform={`translate(${cx} ${cy}) scale(${ss})`}>
            {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 40} 0) scale(1 ${parp})`}><ellipse rx={26} ry={32} fill="#fff" /><circle cx={Math.sin(t * 0.8 + k) * 6} cy={4} r={14} fill="#1b1240" /></g>)}
          </g>
        );
      })}
    </svg>
  );
};
