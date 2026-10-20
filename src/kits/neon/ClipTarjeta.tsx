// nx-clip-tarjeta — un caso real (un creador, un video) como ejemplo: el clip flota en una tarjeta de vidrio con borde
// de luz, colgado del objeto anterior; abajo la ficha del creador con la cifra que cuenta sola y, en la palabra clave,
// un marco de neón se DIBUJA alrededor de la parte del clip que importa (resaltado).
import React from "react";
import { Img, OffthreadVideo, interpolate, staticFile } from "remotion";
import { BlurDef, FPS, Hilo, N, SANS, balanceo, clamp, easeOut, pop, ramp, useSvgId, useT, vis } from "./base";

type P2 = [number, number];
const src = (p: string) => (p.startsWith("http") ? p : staticFile(p));
const fmt = (v: number, dec: number) => v.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export type Resaltado = { x: number; y: number; w: number; h: number; t: number; color?: string; forma?: "rect" | "circulo" }; // fracciones 0..1 del clip
export type Cifra = { hasta: number; sufijo?: string; t: number; dur?: number; decimales?: number };
// (x, y) = centro del clip en el MUNDO. ratio = ancho/alto del clip (9/16 vertical, 16/9 horizontal).
export const ClipTarjeta: React.FC<{ x: number; y: number; t0: number; t1?: number; clip: string; video?: boolean; startFrom?: number; ancho?: number; ratio?: number; colgadoDe?: P2; handle?: string; cifra?: Cifra; resaltar?: Resaltado[]; inclina?: number }> = ({ x, y, t0, t1 = Infinity, clip, video = true, startFrom = 0, ancho = 330, ratio = 9 / 16, colgadoDe, handle, cifra, resaltar = [], inclina = -4 }) => {
  const t = useT();
  const blur = useSvgId("ctb");
  if (!vis(t, colgadoDe ? t0 - 0.45 : t0, t1)) return null;
  const w = ancho, h = w / ratio, r = Math.min(w, h) * 0.06;
  const e = pop(t, t0, 13, 120);
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const sw = balanceo(t, t0, 4, 1.3) * 0.6;
  const ry = Math.sin(t * 0.6 + 0.8) * 7, rx = Math.sin(t * 0.45) * 3;
  const flota = Math.sin(t * 1.3 + 0.4) * 7;
  const kC = cifra ? ramp(t, cifra.t, cifra.dur ?? 1.1, easeOut) : 0;
  return (
    <>
      {colgadoDe && <Hilo a={colgadoDe} b={[x, y - h / 2 + 2]} t0={t0 - 0.42} t1={t1} dur={0.42} />}
      <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2 + flota, width: w, height: h, perspective: 1400, opacity: Math.min(1, e * 1.4) * (1 - sal) }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0%", transform: `rotate(${inclina * e + sw}deg) rotateY(${ry}deg) rotateX(${rx}deg) scale(${0.6 + 0.4 * e})` }}>
          {/* halo detrás del vidrio */}
          <div style={{ position: "absolute", inset: -w * 0.25, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.12) 0%, transparent 62%)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", background: "#000", border: "2px solid rgba(255,255,255,.9)", boxShadow: "0 0 18px rgba(255,255,255,.4), 0 0 70px rgba(255,255,255,.1), 0 34px 50px rgba(0,0,0,.6)" }}>
            {video ? <OffthreadVideo src={src(clip)} muted startFrom={Math.round(startFrom * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Img src={src(clip)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${120 + ry * 2}deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 34%, rgba(255,255,255,0) 72%, rgba(255,255,255,.07) 100%)` }} />
            {/* barra de progreso del clip */}
            <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${Math.min(100, Math.max(0, (t - t0) / 8) * 100)}%`, background: N.rojo, boxShadow: `0 0 8px ${N.rojo}` }} />
          </div>
          {/* resaltado: marco de neón que se dibuja alrededor de la parte clave */}
          <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs><BlurDef id={blur} s={5} /></defs>
            {resaltar.map((q, i) => {
              const k = ramp(t, q.t, 0.55, easeOut);
              if (k <= 0) return null;
              const col = q.color ?? N.fosfo;
              const bx = q.x * w, by = q.y * h, bw = q.w * w, bh = q.h * h;
              const d = q.forma === "circulo"
                ? `M${bx + bw / 2},${by} a${bw / 2},${bh / 2} 0 1,1 -0.1,0`
                : `M${bx},${by} H${bx + bw} V${by + bh} H${bx} Z`;
              const L = q.forma === "circulo" ? Math.PI * (bw + bh) / 2 : 2 * (bw + bh);
              const lat = interpolate(t, [q.t + 0.55, q.t + 0.7, q.t + 1.2], [0, 1, 0], clamp);
              return (
                <g key={i}>
                  {q.forma !== "circulo" && <rect x={bx} y={by} width={bw} height={bh} fill={col} opacity={0.04 * k + 0.1 * lat} />}
                  <path d={d} fill="none" stroke={col} strokeWidth={12} opacity={0.35 + 0.3 * lat} filter={`url(#${blur})`} strokeDasharray={`${L * k} ${L}`} strokeLinejoin="round" />
                  <path d={d} fill="none" stroke={col} strokeWidth={4} strokeDasharray={`${L * k} ${L}`} strokeLinejoin="round" strokeLinecap="round" />
                  <path d={d} fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.9} strokeDasharray={`${L * k} ${L}`} strokeLinejoin="round" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      {/* ficha del creador + cifra que cuenta sola */}
      {(handle || cifra) && (() => {
        const kf = pop(t, t0 + 0.35, 13);
        return (
          <div style={{ position: "absolute", left: x - 400, top: y + h / 2 + 34 + flota * 0.5, width: 800, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: Math.min(1, kf) * (1 - sal), transform: `translateY(${(1 - kf) * 24}px)` }}>
            {handle && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 18px 8px 8px", borderRadius: 40, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.35)", boxShadow: "0 0 14px rgba(255,255,255,.15)" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${N.rojo}, ${N.violeta})` }} />
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#fff" }}>{handle}</div>
              </div>
            )}
            {cifra && t >= cifra.t && (
              <div style={{ position: "relative", fontFamily: SANS, fontWeight: 900, fontSize: 54, color: kC >= 1 ? "#04140a" : "#fff", letterSpacing: -1, padding: "0 12px", isolation: "isolate" }}>
                <span style={{ position: "absolute", inset: "6px 0 4px", background: N.fosfo, borderRadius: 4, zIndex: -1, transformOrigin: "0 50%", transform: `scaleX(${ramp(t, cifra.t + (cifra.dur ?? 1.1), 0.3, easeOut)}) skewX(-6deg)`, boxShadow: `0 0 20px ${N.fosfo}` }} />
                {fmt(cifra.hasta * kC, cifra.decimales ?? 0)}{cifra.sufijo ? " " + cifra.sufijo : ""}
              </div>
            )}
          </div>
        );
      })()}
    </>
  );
};
