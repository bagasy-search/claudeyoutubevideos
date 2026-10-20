// nx-celular-ui — mostrar una app / un video / una pantalla como prueba: celular de vidrio colgado del objeto
// anterior, con leve balanceo y reflejo, disco rojo que late detrás. La pantalla es un clip/captura real (`pantalla`)
// o el feed de ejemplo incluido (videos que se deslizan con cada toque + aviso que baja).
import React from "react";
import { Img, OffthreadVideo, interpolate, staticFile } from "remotion";
import { FPS, Hilo, SANS, balanceo, clamp, easeOut, pop, ramp, useT, vis } from "./base";

const src = (p: string) => (p.startsWith("http") ? p : staticFile(p));
type P2 = [number, number];
const FONDOS = [
  ["#ff5f6d", "#ffc371", "#3a1c71"], ["#00c6ff", "#0072ff", "#1a1a40"], ["#f7971e", "#ffd200", "#6a0572"],
  ["#11998e", "#38ef7d", "#0b3d2e"], ["#fc466b", "#3f5efb", "#120c2a"], ["#8e2de2", "#4a00e0", "#ff6a88"],
];
const Corazon: React.FC<{ s: number; fill: string }> = ({ s, fill }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.6 2.9 4.5 6.7 4.5c2.2 0 3.6 1.3 4.3 2.5.7-1.2 2.1-2.5 4.3-2.5 3.8 0 5.8 4.1 4.3 7.3C19.5 16.4 12 21 12 21z" fill={fill} /></svg>
);

const Globo: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3C6.5 3 2.5 6.6 2.5 11c0 2.4 1.2 4.5 3.1 6l-.9 3.6 4.1-2.1c1 .3 2.1.4 3.2.4 5.5 0 9.5-3.6 9.5-8S17.5 3 12 3z" fill="rgba(255,255,255,.92)" /><circle cx={8} cy={11} r={1.2} fill="#333" /><circle cx={12} cy={11} r={1.2} fill="#333" /><circle cx={16} cy={11} r={1.2} fill="#333" /></svg>
);

// feed vertical de ejemplo: cada toque desliza al video siguiente
const Feed: React.FC<{ w: number; h: number; t: number; toques: number[] }> = ({ w, h, t, toques }) => {
  let idx = 0, desl = 0;
  for (const tq of toques) { if (t >= tq + 0.12) { const k = ramp(t, tq + 0.12, 0.38, easeOut); desl = idx + k; if (k >= 1) idx++; } }
  const off = (toques.filter((tq) => t >= tq + 0.5).length + (desl % 1)) * h;
  const likes = 1200 + Math.floor((t * 37) % 900);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: -off, width: w }}>
        {FONDOS.map((c, i) => (
          <div key={i} style={{ position: "relative", width: w, height: h, overflow: "hidden", background: `radial-gradient(circle at ${30 + (i * 23) % 50}% ${35 + (i * 17) % 30}%, ${c[0]} 0%, ${c[1]} 35%, ${c[2]} 85%)` }}>
            <div style={{ position: "absolute", left: w * 0.28, top: h * 0.3, width: w * 0.44, height: w * 0.44, borderRadius: "50%", background: "rgba(255,255,255,.18)", filter: "blur(6px)", transform: `translateY(${Math.sin(t * 2 + i) * 8}px)` }} />
            <div style={{ position: "absolute", left: w * 0.2, top: h * 0.52, width: w * 0.6, height: h * 0.3, borderRadius: `${w * 0.3}px ${w * 0.3}px 0 0`, background: "rgba(0,0,0,.22)", filter: "blur(4px)" }} />
          </div>
        ))}
      </div>
      {/* cromo de la app */}
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.07, display: "flex", justifyContent: "center", gap: w * 0.08, fontFamily: SANS, fontWeight: 700, fontSize: w * 0.05, color: "rgba(255,255,255,.7)" }}>
        <span>Siguiendo</span><span style={{ color: "#fff", borderBottom: "2px solid #fff", paddingBottom: 3 }}>Para ti</span>
      </div>
      <div style={{ position: "absolute", right: w * 0.04, top: h * 0.46, display: "flex", flexDirection: "column", alignItems: "center", gap: h * 0.025, fontFamily: SANS, fontWeight: 700, fontSize: w * 0.038, color: "#fff" }}>
        <div style={{ width: w * 0.13, height: w * 0.13, borderRadius: "50%", background: "linear-gradient(135deg,#ddd,#888)", border: "2px solid #fff" }} />
        <div style={{ textAlign: "center" }}><Corazon s={w * 0.11} fill="#ff2d55" /><div>{(likes / 1000).toFixed(1)}K</div></div>
        <div style={{ textAlign: "center" }}><Globo s={w * 0.1} /><div>284</div></div>
      </div>
      <div style={{ position: "absolute", left: w * 0.05, bottom: h * 0.07, width: w * 0.7 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: w * 0.046, color: "#fff", marginBottom: 6 }}>@videos.que.atrapan</div>
        <div style={{ height: 6, width: "90%", borderRadius: 3, background: "rgba(255,255,255,.75)", marginBottom: 5 }} />
        <div style={{ height: 6, width: "62%", borderRadius: 3, background: "rgba(255,255,255,.55)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: `${((t * 0.25) % 1) * 100}%`, background: "#fff" }} />
      {/* dedo: toque + deslizar hacia arriba */}
      {toques.map((tq, i) => {
        const k = interpolate(t, [tq - 0.1, tq + 0.45], [0, 1], clamp);
        if (k <= 0 || k >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: w * 0.5 - 22, top: h * (0.72 - 0.35 * easeOut(Math.max(0, (k - 0.3) / 0.7))) - 22, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.45)", border: "2px solid rgba(255,255,255,.8)", opacity: Math.sin(Math.PI * k), transform: `scale(${0.8 + 0.3 * Math.sin(Math.PI * k)})` }} />;
      })}
    </div>
  );
};

export type PantallaCel = { src: string; video?: boolean; startFrom?: number };
// (x, y) = centro del celular en el MUNDO. colgadoDe = punto del objeto anterior (el hilo llega y recién ahí aparece).
export const CelularUI: React.FC<{ x: number; y: number; t0: number; t1?: number; ancho?: number; colgadoDe?: P2; pantalla?: PantallaCel; toques?: number[]; aviso?: { texto: string; t: number; dur?: number }; disco?: boolean; pulsos?: number[] }> = ({ x, y, t0, t1 = Infinity, ancho = 300, colgadoDe, pantalla, toques = [], aviso, disco = true, pulsos = [] }) => {
  const t = useT();
  if (!vis(t, colgadoDe ? t0 - 0.45 : t0, t1)) return null;
  const w = ancho, h = w * 2.12, bz = w * 0.034, r = w * 0.16;
  const e = pop(t, t0, 12, 140);
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const rot = balanceo(t, t0, 5, 0.7) * 0.7;
  const R = h * 0.62;
  const lat = pulsos.reduce((m, p) => Math.max(m, interpolate(t, [p, p + 0.12, p + 0.7], [0, 1, 0], clamp)), 0);
  const kAv = aviso ? Math.min(pop(t, aviso.t, 13), 1 - ramp(t, aviso.t + (aviso.dur ?? 2.2), 0.35)) : 0;
  return (
    <>
      {colgadoDe && <Hilo a={colgadoDe} b={[x, y - h / 2 + 4]} t0={t0 - 0.42} t1={t1} dur={0.42} />}
      {disco && (
        <div style={{ position: "absolute", left: x - R, top: y - R, width: R * 2, height: R * 2, borderRadius: "50%", opacity: e * (1 - sal), transform: `scale(${0.9 + 0.1 * e + 0.06 * lat})`,
          background: `radial-gradient(circle, rgba(${150 + 60 * lat},14,34,.62) 0%, rgba(96,4,20,.45) 55%, rgba(60,0,10,.15) 70%, transparent 71%)`, boxShadow: `0 0 ${40 + 60 * lat}px rgba(255,30,60,${0.15 + 0.3 * lat})`, border: "1px solid rgba(255,90,110,.22)" }} />
      )}
      {pulsos.map((p, i) => {
        const k = interpolate(t, [p, p + 0.9], [0, 1], clamp);
        if (k <= 0 || k >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: x - R, top: y - R, width: R * 2, height: R * 2, borderRadius: "50%", border: "3px solid rgba(255,60,90,.8)", opacity: 1 - k, transform: `scale(${1 + 0.35 * k})` }} />;
      })}
      <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transformOrigin: "50% 0%", transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * e})`, opacity: Math.min(1, e * 1.4) * (1 - sal), filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        {/* marco metálico */}
        <div style={{ position: "absolute", inset: 0, borderRadius: r, background: "linear-gradient(135deg,#c9ced6 0%,#3a3e46 22%,#e6e9ee 48%,#2c2f35 72%,#aab0b9 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,.25), 0 0 24px rgba(255,255,255,.18)" }} />
        <div style={{ position: "absolute", left: -3, top: h * 0.2, width: 3, height: h * 0.07, borderRadius: 2, background: "#8a9099" }} />
        <div style={{ position: "absolute", right: -3, top: h * 0.28, width: 3, height: h * 0.11, borderRadius: 2, background: "#8a9099" }} />
        <div style={{ position: "absolute", inset: bz, borderRadius: r - bz, overflow: "hidden", background: "#000" }}>
          {pantalla ? (
            pantalla.video ? <OffthreadVideo src={src(pantalla.src)} muted startFrom={Math.round((pantalla.startFrom ?? 0) * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Img src={src(pantalla.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : <Feed w={w - bz * 2} h={h - bz * 2} t={t} toques={toques} />}
          {/* aviso que baja */}
          {kAv > 0 && (
            <div style={{ position: "absolute", left: w * 0.04, right: w * 0.04, top: h * 0.055 + (kAv - 1) * 120, borderRadius: w * 0.07, padding: `${w * 0.035}px ${w * 0.04}px`, background: "rgba(40,40,46,.82)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.18)", display: "flex", gap: w * 0.03, alignItems: "center", boxShadow: "0 10px 26px rgba(0,0,0,.45)" }}>
              <div style={{ width: w * 0.11, height: w * 0.11, borderRadius: w * 0.03, background: "linear-gradient(135deg,#ff2d55,#ff7a45)", flexShrink: 0 }} />
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: w * 0.044, color: "#fff", lineHeight: 1.15 }}>{aviso!.texto}<div style={{ fontWeight: 600, fontSize: w * 0.034, color: "rgba(255,255,255,.6)" }}>ahora</div></div>
            </div>
          )}
          <div style={{ position: "absolute", left: "50%", top: h * 0.018, width: w * 0.3, height: w * 0.085, borderRadius: w * 0.05, background: "#000", transform: "translateX(-50%)" }} />
          {/* reflejo del vidrio */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${118 + rot * 3}deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.04) 30%, transparent 46%)`, pointerEvents: "none" }} />
        </div>
      </div>
    </>
  );
};
