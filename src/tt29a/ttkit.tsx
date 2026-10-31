// ttkit — kit de Tell Tape (cintas reales de interrogatorio + componentes por código). Un componente por idea, ninguno repetido.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as mono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as oswald } from "@remotion/google-fonts/Oswald";

export const F = { sans: inter("normal", { weights: ["400", "600", "800"] }).fontFamily, mono: mono("normal", { weights: ["400", "600"] }).fontFamily, cond: oswald("normal", { weights: ["500", "700"] }).fontFamily };
export const K = { bg: "#0b0d10", panel: "#14171c", line: "#2b3038", text: "#ece9e2", dim: "#8d929b", y: "#f4c534", red: "#e0393e", blue: "#2f6fd6", paper: "#efe9dc", ink: "#1d1f22" };

export type W = { w: string; s: number; e: number };
export type CP = { s: number; e: number; words: W[]; img?: (n: string) => string; [k: string]: any };

const nz = (t: string) => t.toLowerCase().replace(/[^a-z0-9']/g, "");
// cuadro (relativo al inicio del componente) en que se dice la frase; -1 si no está
export const useAt = (p: CP) => (ph?: string, fb = 0) => {
  if (!ph) return fb;
  const q = ph.split(/\s+/).map(nz).filter(Boolean);
  const tk = p.words.map((w) => nz(w.w));
  for (let i = 0; i + q.length <= tk.length; i++) if (q.every((x, j) => tk[i + j] === x)) return Math.round((p.words[i].s - p.s) * 30);
  return fb;
};
export const sp = (f: number, d = 0, cfg = { damping: 14, mass: 0.9, stiffness: 120 }) => spring({ frame: f - d, fps: 30, config: cfg });
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const lin = (f: number, a: number, b: number, x = 0, y = 1, e?: (t: number) => number) => interpolate(f, [a, b], [x, y], { ...cl, easing: e ?? Easing.bezier(0.45, 0, 0.2, 1) });

// cámara orgánica: deriva curva lenta + entrada con resorte y salida fundida (nunca zoom lineal)
export const Cam: React.FC<{ dur: number; children: React.ReactNode; seed?: number; depth?: boolean }> = ({ dur, children, seed = 1, depth = true }) => {
  const f = useCurrentFrame();
  const inn = sp(f, 0, { damping: 18, mass: 1.1, stiffness: 90 });
  const out = lin(f, dur - 10, dur, 0, 1);
  const k = f / 30;
  const x = Math.sin(k * 0.37 + seed) * 14 + Math.sin(k * 0.13 + seed * 2) * 10;
  const y = Math.cos(k * 0.29 + seed) * 8;
  const s = 1.0 + 0.045 * (1 - Math.cos(Math.min(1, f / Math.max(dur, 1)) * Math.PI)) / 2 + (1 - inn) * 0.06;
  const ry = depth ? Math.sin(k * 0.21 + seed) * 2.2 : 0;
  return (
    <AbsoluteFill style={{ perspective: 1800, opacity: inn * (1 - out), filter: `blur(${(1 - inn) * 10 + out * 8}px)` }}>
      <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${s}) rotateY(${ry}deg)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// fondo vivo: fotograma real de la sala, desenfocado y oscuro, con deriva
export const RoomBg: React.FC<{ src: string; blur?: number; dark?: number }> = ({ src, blur = 18, dark = 0.72 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: K.bg, overflow: "hidden" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) saturate(0.6)`, transform: `scale(${1.15 + Math.sin(f / 300) * 0.03}) translateX(${Math.sin(f / 410) * 20}px)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(11,13,16,${dark - 0.25}) 0%, rgba(11,13,16,${dark + 0.2}) 75%)` }} />
    </AbsoluteFill>
  );
};

const Shadow = "0 30px 80px rgba(0,0,0,.55), 0 8px 20px rgba(0,0,0,.4)";
const Big: React.CSSProperties = { fontFamily: F.cond, fontWeight: 700, color: K.text, textTransform: "uppercase", letterSpacing: 1 };

// ── 1 · Room: el fotograma real, empuje lento, HUD de cámara y frases que aparecen en la escena
export const Room: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  return (
    <AbsoluteFill style={{ backgroundColor: K.bg }}>
      <Cam dur={dur} depth={false}>
        {p.clip ? <OffthreadVideo src={staticFile(p.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.7) contrast(1.05)" }} />
          : <Img src={p.img!(p.still)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.75) contrast(1.05)" }} />}
        <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.6))" }} />
      </Cam>
      <Hud f={f + Math.round((p.vid?.[0] ?? 0) * 30)} label={p.hud ?? "ORANGE CO. SHERIFF"} />
      {(p.lines ?? []).map((l: any, i: number) => {
        const a = at(l.at, i * 45); const k = sp(f, a);
        const gone = p.lines[i + 1] ? lin(f, at(p.lines[i + 1].at, 9999) - 6, at(p.lines[i + 1].at, 9999) + 6) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 420, right: 300, bottom: 110, textAlign: "center", lineHeight: 1.1, opacity: k * (1 - gone), transform: `translateY(${(1 - k) * 40 - gone * 20}px)`, ...Big, fontSize: l.text.length > 26 ? 60 : 74, textShadow: "0 6px 30px rgba(0,0,0,.9)" }}>{l.text}</div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Hud: React.FC<{ f: number; label: string; date?: string }> = ({ f, label, date = "02/25/2020" }) => {
  const tc = 15 * 3600 + 12 * 60 + Math.floor(f / 30);
  const hh = String(Math.floor(tc / 3600)).padStart(2, "0"), mm = String(Math.floor(tc / 60) % 60).padStart(2, "0"), ss = String(tc % 60).padStart(2, "0");
  return (
    <>
      <div style={{ position: "absolute", right: 60, top: 50, fontFamily: F.mono, fontSize: 26, color: K.text, display: "flex", gap: 14, alignItems: "center", textShadow: "0 2px 8px #000" }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: K.red, opacity: Math.floor(f / 20) % 2 ? 1 : 0.25 }} /> REC
      </div>
      <div style={{ position: "absolute", left: 44, bottom: 36, width: 300, height: 276, padding: "26px 24px", boxSizing: "border-box", background: "rgba(10,12,15,.94)", border: `1px solid ${K.line}`, borderRadius: 8, fontFamily: F.mono, fontSize: 24, color: K.dim, lineHeight: 1.7, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ fontSize: 18, letterSpacing: 3, color: K.dim, marginBottom: "auto" }}>CAM 02 · 480p</div>
        <div style={{ color: K.text }}>{label}</div>
        <div>{date}</div>
        <div style={{ color: K.y }}>{hh}:{mm}:{ss}</div>
      </div>
    </>
  );
};

// ── 2 · Names: polaroid de quien habla (fotograma real) + tarjeta en memoria de la víctima
export const Names: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const a = sp(f, at(p.who.at, 0)), b = sp(f, at(p.victim.at, 40), { damping: 20, mass: 1.2, stiffness: 70 });
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={2}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 110 }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: b, zIndex: 3 }}><path d={`M 640 300 Q 960 ${200 + (1 - b) * 120} 1290 ${380}`} stroke={K.red} strokeWidth={4} fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - b} />
            {[[640, 300], [1290, 380]].map(([x, y], i) => <g key={i} opacity={i ? b : 1}><circle cx={x + 3} cy={y + 5} r={16} fill="rgba(0,0,0,.5)" /><circle cx={x} cy={y} r={15} fill={K.red} /><circle cx={x - 5} cy={y - 5} r={5} fill="#ff9a9d" /></g>)}</svg>
          <div style={{ transform: `translateY(${(1 - a) * 300}px) rotate(${-6 + (1 - a) * -14}deg)`, opacity: a, background: "#f3f0e8", padding: "22px 22px 90px", boxShadow: Shadow, position: "relative", zIndex: 2 }}>
            <div style={{ width: 560, height: 420, overflow: "hidden" }}>
              <Img src={p.img!(p.who.still)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.who.pos ?? "50% 35%", transform: `scale(${p.who.zoom ?? 2.2})`, transformOrigin: p.who.pos ?? "50% 35%", filter: "saturate(.8)" }} />
            </div>
            <div style={{ position: "absolute", bottom: 22, left: 26, fontFamily: F.cond, fontSize: 46, fontWeight: 700, color: K.ink }}>{p.who.name}</div>
            <div style={{ position: "absolute", top: -18, left: "45%", width: 120, height: 36, background: "rgba(244,197,52,.75)", transform: "rotate(-4deg)" }} />
          </div>
          <div style={{ transform: `translateX(${(1 - b) * -620}px) rotate(${(1 - b) * -8 + 2}deg)`, opacity: Math.min(1, b * 2), zIndex: 1, width: 640, position: "relative", padding: "60px 50px", background: "linear-gradient(160deg,#1a1d23,#0f1115)", border: `1px solid ${K.line}`, borderRadius: 10, boxShadow: Shadow, textAlign: "center" }}>
            <div style={{ width: 70, height: 2, background: K.y, margin: "0 auto 34px", opacity: 0.8 }} />
            <div style={{ fontFamily: F.cond, fontSize: 100, color: K.text, fontWeight: 500, lineHeight: 1.0 }}>{p.victim.name}</div>
            <div style={{ fontFamily: F.mono, fontSize: 54, color: K.text, marginTop: 24, letterSpacing: 2 }}>{p.victim.sub}</div>
            <div style={{ margin: "40px auto 0", width: 18, height: 26, borderRadius: "50% 50% 45% 45%", background: `radial-gradient(circle at 50% 70%, #fff6c8, ${K.y} 55%, rgba(244,197,52,0) 75%)`, transform: `scale(${1 + Math.sin(f / 6) * 0.06})`, filter: "blur(.5px)", boxShadow: `0 0 ${40 + Math.sin(f / 9) * 8}px ${K.y}` }} />
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 3 · DayClock: el día en un reloj; la aguja viaja a cada momento cuando se nombra
export const DayClock: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const ev = p.events as { at: string; h: number; label: string }[];
  const times = ev.map((e, i) => at(e.at, 20 + i * 40));
  let ang = (ev[0].h % 12) * 30;
  ev.forEach((e, i) => { const k = sp(f, times[i], { damping: 16, mass: 1, stiffness: 80 }); const prev = i ? (ev[i - 1].h % 12) * 30 : (ev[0].h % 12) * 30 - 30; ang = i === 0 ? prev + k * 30 : ang + k * (((e.h % 12) * 30) - prev); });
  const R = 300;
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={3}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #1d2128, #0d0f13 70%)", border: "14px solid #3a4049", boxShadow: `${Shadow}, 0 0 0 3px #6b737e, inset 0 0 60px rgba(0,0,0,.8), 0 40px 60px -20px rgba(0,0,0,.9)`, transform: "rotateX(14deg)", position: "absolute", left: 230, top: 200 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: R - 3, top: 18, width: 6, height: i % 3 ? 18 : 34, background: i % 3 ? K.dim : K.text, transformOrigin: `3px ${R - 18}px`, transform: `rotate(${i * 30}deg)` }} />
            ))}
            <div style={{ position: "absolute", left: R - 5, top: 70, width: 10, height: R - 70, background: K.y, borderRadius: 5, transformOrigin: `5px ${R - 70}px`, transform: `rotate(${ang}deg)`, boxShadow: `0 0 24px ${K.y}` }} />
            <div style={{ position: "absolute", left: R - 16, top: R - 16, width: 32, height: 32, borderRadius: 16, background: K.y }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 42%)" }} />
            <div style={{ position: "absolute", width: 1000, left: R - 500, top: 2 * R + 40, textAlign: "center", whiteSpace: "nowrap", fontFamily: F.mono, fontSize: 48, color: K.y, letterSpacing: 3 }}>{p.day}</div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 380, display: "flex", flexDirection: "column", gap: 26 }}>
            {ev.map((e, i) => { const k = sp(f, times[i]); const on = i === ev.length - 1 || f < (times[i + 1] ?? 1e9); return (
              <div key={i} style={{ opacity: k * (on ? 1 : (f < (times[i + 2] ?? 1e9) ? 0.7 : 0)), transform: `translateX(${(1 - k) * 80}px)`, height: f < (times[i + 2] ?? 1e9) || on ? "auto" : 0, overflow: "hidden", display: "flex", gap: 22, alignItems: "baseline" }}>
                <span style={{ fontFamily: F.mono, fontSize: 30, color: K.y, width: 130 }}>{e.time ?? ""}</span>
                <span style={{ ...Big, fontSize: on ? 76 : 50, color: on ? K.text : "#b9bdc5" }}>{e.label}</span>
              </div>); })}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 4 · Suitcase: valija azul 3D; el cierre corre y deja (o no) un hueco
export const Suitcase: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const z = lin(f, at(p.zipAt, 60), at(p.zipAt, 60) + 50, 0, 1);
  const gap = p.gap ?? 0.12; const zipPos = z * (1 - gap);
  const rot = -28 + Math.sin(f / 90) * 6;
  const Wd = 760, H = 520, D = 200;
  const face = (st: React.CSSProperties) => ({ position: "absolute" as const, background: `linear-gradient(160deg,#3b7fe6,#1f4fa6)`, border: "2px solid #163d82", ...st });
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={4} depth={false}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2200 }}>
          <div style={{ position: "relative", width: Wd, height: H, transformStyle: "preserve-3d", transform: `translateX(-230px) rotateX(58deg) rotateZ(${rot}deg) translateY(40px)` }}>
            {/* asa telescópica parada sobre el borde de atrás */}
            <div style={{ position: "absolute", left: Wd / 2 - 120, top: 0, width: 240, height: 300, transformOrigin: "50% 0%", transform: `translateZ(${D * 0.5}px) rotateX(90deg) translateZ(0px)`, display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: 22, height: "100%", background: "linear-gradient(90deg,#5d6672,#c9d0d8,#5d6672)", borderRadius: 6 }} />
              <div style={{ width: 22, height: "100%", background: "linear-gradient(90deg,#5d6672,#c9d0d8,#5d6672)", borderRadius: 6 }} />
              <div style={{ position: "absolute", left: -10, right: -10, bottom: -10, height: 46, background: "#14171c", borderRadius: 14 }} />
            </div>
            <div style={{ ...face({ width: Wd, height: H, transform: `translateZ(${D}px)`, borderRadius: 34 }) }}>
              {[0.28, 0.5, 0.72].map((x) => <div key={x} style={{ position: "absolute", top: 40, bottom: 40, left: `${x * 100}%`, width: 10, background: "rgba(0,0,0,.18)", borderRadius: 5 }} />)}
              {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) => <div key={"c" + i} style={{ position: "absolute", left: cx ? Wd - 96 : -4, top: cy ? H - 96 : -4, width: 100, height: 100, background: "#15181d", borderRadius: `${!cx && !cy ? 34 : 8}px ${cx && !cy ? 34 : 8}px ${cx && cy ? 34 : 8}px ${!cx && cy ? 34 : 8}px`, boxShadow: "inset 0 0 0 4px #2b3038" }} />)}
              <div style={{ position: "absolute", left: 30, right: 30, top: 30, bottom: 30, border: "5px dashed rgba(0,0,0,.35)", borderRadius: 26 }} />
              <div style={{ position: "absolute", left: Wd / 2 - 110, top: -8, width: 220, height: 60, borderRadius: "30px 30px 10px 10px", border: "16px solid #0f2c63", borderBottom: "none", transform: "translateZ(30px)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 34, background: "linear-gradient(115deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 38%)" }} />
            </div>
            {[[60, 60], [Wd - 60, 60], [60, H - 60], [Wd - 60, H - 60]].map(([x, y], i) => <div key={"w" + i} style={{ position: "absolute", left: x - 28, top: y - 28, width: 56, height: 56, borderRadius: 28, background: "#0a0c10", transform: "translateZ(-14px)" }} />)}
            <div style={{ position: "absolute", left: -80, top: -60, width: Wd + 160, height: H + 120, borderRadius: 120, background: "radial-gradient(ellipse, rgba(0,0,0,.65), rgba(0,0,0,0) 70%)", transform: "translateZ(-40px)" }} />
            {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", width: Wd, height: H, borderRadius: 34, background: i === 0 ? "rgba(0,0,0,.5)" : "#1a3f86", filter: i === 0 ? "blur(30px)" : "none", transform: `translateZ(${i === 0 ? -10 : (i / 14) * D}px)` }} />)}
            {/* cierre: tirador que recorre el borde; lo que queda sin cerrar brilla */}
            <svg width={Wd + 80} height={H + 80} style={{ position: "absolute", left: -40, top: -40, transform: `translateZ(${D + 2}px)` }}>
              <rect x={40} y={40} width={Wd} height={H} rx={34} fill="none" stroke="#0f2c63" strokeWidth={12} pathLength={1} strokeDasharray={`${zipPos} 1`} />
              {p.gap > 0 && <rect x={40} y={40} width={Wd} height={H} rx={34} fill="none" stroke={K.y} strokeWidth={8} pathLength={1} strokeDasharray={`0 ${1 - gap} ${gap * z} 1`} opacity={z > 0.9 ? 0.6 + Math.sin(f / 5) * 0.4 : 0} />}
            </svg>
          </div>
          {(p.notes ?? []).map((n: any, i: number) => { const ns = p.notes as any[]; n = { ...n, x: 1220 }; const k = sp(f, at(n.at, 100 + i * 50)); const shown = ns.filter((q: any, j: number) => f >= at(q.at, 100 + j * 50)).length; const slot = i - Math.max(0, shown - 2); const gone = slot < 0 ? 1 : 0; return (
            <div key={i} style={{ position: "absolute", left: n.x ?? 1240, top: (n.y ?? 380) + Math.max(0, slot) * 130, opacity: k * (1 - gone), transform: `translateX(${(1 - k) * 60}px)`, transition: "none", fontFamily: F.cond, fontSize: 64, fontWeight: 700, maxWidth: 640, color: n.c === "y" ? K.y : K.text, textTransform: "uppercase", textShadow: "0 4px 18px #000" }}>{n.text}</div>); })}
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 5 · PhoneLog: el celular con el registro de llamadas, fila por fila cuando se nombra
export const Phone: React.FC<{ children: React.ReactNode; w?: number; h?: number; style?: React.CSSProperties }> = ({ children, w = 520, h = 1000, style }) => (
  <div style={{ width: w, height: h, borderRadius: 70, background: "#050608", padding: 22, boxShadow: `${Shadow}, inset 0 0 0 3px #2c3038`, position: "relative", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 52, overflow: "hidden", background: "#f6f6f8", position: "relative" }}>{children}</div>
    <div style={{ position: "absolute", top: 40, left: "50%", width: 150, height: 40, marginLeft: -75, borderRadius: 20, background: "#050608" }} />
  </div>
);
export const PhoneLog: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const lift = sp(f, 0, { damping: 16, mass: 1.2, stiffness: 70 });
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={5}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          {(() => { const hot = (p.rows as any[]).findIndex((r) => r.hot); if (hot < 0) return null; const g = sp(f, at(p.rows[hot].at, 120) + 40); return <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", background: `radial-gradient(circle, rgba(224,57,62,${0.35 + Math.sin(f / 7) * 0.08}), rgba(224,57,62,0) 65%)`, opacity: g }} />; })()}
          <div style={{ transform: `translateY(${(1 - lift) * 500}px) rotateZ(${-4 + lift * 4}deg) rotateX(${(1 - lift) * 30}deg)` }}>
            <Phone w={500} h={960}>
              <div style={{ padding: "110px 34px 0", fontFamily: F.sans }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: "#111", marginBottom: 30 }}>Recents</div>
                {(p.rows as any[]).map((r, i) => { const k = sp(f, at(r.at, 30 + i * 50)); const hot = r.hot; return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "24px 0", borderBottom: "1px solid #ddd", opacity: k, transform: `translateX(${(1 - k) * -80}px)`, background: hot && k > 0.9 ? `rgba(224,57,62,${0.08 + Math.sin(f / 8) * 0.05})` : "transparent" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 32, background: hot ? K.red : "#c9ccd2", color: "#fff", fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.icon}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 36, fontWeight: 600, color: hot ? K.red : "#111" }}>{r.label}</div><div style={{ fontSize: 24, color: "#888" }}>{r.sub}</div></div>
                    <div style={{ fontSize: 26, color: "#888" }}>{r.time}</div>
                  </div>); })}
              </div>
              {(() => { const hot = (p.rows as any[]).findIndex((r) => r.hot); if (hot < 0) return null; const a = at(p.rows[hot].at, 120) + 35; const c = sp(f, a, { damping: 18, mass: 1, stiffness: 90 }); return (
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#1b2a3a,#0b0f15)", transform: `translateY(${(1 - c) * 100}%)`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 200, fontFamily: F.sans, color: "#fff" }}>
                  <div style={{ fontSize: 30, opacity: 0.7 }}>calling…</div>
                  <div style={{ fontSize: 110, fontWeight: 600, marginTop: 10, transform: `translateX(${f > a + 20 && f < a + 50 ? Math.sin(f * 2.2) * 4 : 0}px)` }}>911</div>
                  <div style={{ fontFamily: F.mono, fontSize: 36, marginTop: 8, opacity: 0.85 }}>{`00:${String(Math.max(0, Math.floor((f - a - 30) / 30))).padStart(2, "0")}`}</div>
                  <div style={{ position: "relative", width: 260, height: 260, marginTop: 120 }}>
                    {[0, 1, 2].map((r) => { const ph = ((f - a) / 45 + r / 3) % 1; return <div key={r} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid #4cd964", transform: `scale(${0.4 + ph * 0.9})`, opacity: (1 - ph) * c }} />; })}
                    <div style={{ position: "absolute", left: 80, top: 80, width: 100, height: 100, borderRadius: 50, background: K.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>✆</div>
                  </div>
                </div>); })()}
            </Phone>
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 6 · Paper: documento real tipo formulario; la línea que se lee se subraya en amarillo
export const Paper: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const k = sp(f, 0, { damping: 18, mass: 1.2, stiffness: 80 });
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={6}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
          <div style={{ width: 1000, padding: "70px 80px", background: K.paper, boxShadow: Shadow, transform: `rotateX(${(1 - k) * 50 + 8}deg) rotateZ(${-2 + (1 - k) * 8}deg) translateY(${(1 - k) * 200}px)`, fontFamily: F.mono, color: K.ink }}>
            <div style={{ fontFamily: F.cond, fontSize: 50, fontWeight: 700, letterSpacing: 2, borderBottom: `3px solid ${K.ink}`, paddingBottom: 18, marginBottom: 30 }}>{p.title}</div>
            {(p.lines as any[]).map((l, i) => { const a = at(l.at, -1); const h = a >= 0 ? lin(f, a, a + 18) : 0; return (
              <div key={i} style={{ fontSize: 30, lineHeight: 1.45, margin: "14px 0", position: "relative" }}>
                <span style={{ position: "relative", zIndex: 1 }}>{l.text}</span>
                <div style={{ position: "absolute", left: -8, top: 4, bottom: 4, width: `calc(${h * 100}% + 16px)`, background: "rgba(244,197,52,.65)", zIndex: 0 }} />
              </div>); })}
          </div>
          {p.stamp && (() => { const s = sp(f, at(p.stamp.at, 120), { damping: 9, mass: 0.6, stiffness: 200 }); return (
            <div style={{ position: "absolute", right: 300, bottom: 170, transform: `rotate(-12deg) scale(${2 - s})`, opacity: s, border: `6px solid ${K.red}`, color: K.red, fontFamily: F.cond, fontWeight: 700, fontSize: 64, padding: "10px 30px", letterSpacing: 4 }}>{p.stamp.text}</div>); })()}
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 7 · Body: esquema forense (espalda y cabeza), cada marca aparece cuando se nombra
export const Body: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const k = sp(f, 0);
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={7}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <svg width={1500} height={900} viewBox="0 0 1500 900" style={{ opacity: k }}>
            <g fill="none" stroke="#9aa3ad" strokeWidth={4} strokeDasharray="1" style={{ strokeDashoffset: 1 - lin(f, 0, 60) } as any}>
              <circle cx={350} cy={130} r={80} pathLength={1} />
              <path d="M350 210 L350 230 M220 260 Q350 225 480 260 L520 520 Q470 540 455 500 L440 340 L430 600 L455 860 L380 860 L350 620 L320 860 L245 860 L270 600 L260 340 L245 500 Q230 540 180 520 Z" pathLength={1} />
            </g>
            {(p.marks as any[]).map((m, i) => { const a = sp(f, at(m.at, 40 + i * 35), { damping: 10, mass: 0.6, stiffness: 160 }); const ly = 170 + i * 170; const ln = lin(f, at(m.at, 40 + i * 35), at(m.at, 40 + i * 35) + 14); return (
              <g key={i} opacity={Math.min(1, a)}>
                <circle cx={m.x} cy={m.y} r={22 * a + Math.sin(f / 7 + i) * 3} fill="rgba(224,57,62,.35)" stroke={K.red} strokeWidth={4} />
                <polyline points={`${m.x},${m.y} ${560 + i * 20},${ly} ${640 + (760 - 640) * ln},${ly}`} fill="none" stroke={K.red} strokeWidth={2} strokeDasharray="8 8" opacity={0.75} />
                <text x={790} y={ly + 16} fill={K.text} fontFamily={F.cond} fontWeight={700} fontSize={50} style={{ textTransform: "uppercase" } as any} opacity={ln}>{m.label}</text>
              </g>); })}
          </svg>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 8 · Tally: la frase repetida; una raya por cada vez que la dice
export const Tally: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const hits = (p.hits as string[]).map((h, i) => at(h, 20 + i * 25));
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={8}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 70 }}>
          <div style={{ fontFamily: F.cond, fontSize: 120, color: K.text, fontWeight: 700, opacity: sp(f, 0) }}>“{p.phrase}”</div>
          <div style={{ display: "flex", gap: 60, alignItems: "flex-end", height: 240 }}>
            {hits.map((h, i) => { const k = sp(f, h, { damping: 9, mass: 0.5, stiffness: 220 }); return (
              <div key={i} style={{ width: 26, height: 240 * k, background: K.y, borderRadius: 4, transform: `rotate(${(i % 2 ? 4 : -4)}deg)`, boxShadow: `0 0 30px rgba(244,197,52,${k * 0.5})` }} />); })}
            <div style={{ fontFamily: F.mono, fontSize: 64, color: K.y, marginLeft: 40, opacity: sp(f, hits[hits.length - 1] + 10) }}>×{hits.length}</div>
          </div>
          {p.foot && <div style={{ fontFamily: F.mono, fontSize: 34, color: K.dim, opacity: sp(f, at(p.foot.at, 999)) }}>{p.foot.text}</div>}
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 9 · Gallery: su celular, la galería con las fotos que documentaba (borrosas, nunca morbo)
export const Gallery: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const lift = sp(f, 0, { damping: 16, mass: 1.2, stiffness: 70 });
  const tiles = Array.from({ length: 15 });
  const hue = (i: number) => [200, 25, 210, 15, 190, 30, 220, 10, 205, 35, 195, 20, 215, 5, 200][i];
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={9}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 120 }}>
          <div style={{ transform: `translateY(${(1 - lift) * 400}px) rotateY(${12 - lift * 6}deg)` }}>
            <Phone w={560} h={1000}>
              <div style={{ padding: "100px 10px 0", fontFamily: F.sans }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#111", padding: "0 20px 20px" }}>Photos</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                  {tiles.map((_, i) => { const k = sp(f, 15 + i * 3); const last = i === tiles.length - 1; const on = last ? sp(f, at(p.hotAt, 9999), { damping: 9, mass: 0.6, stiffness: 180 }) : 0; return (
                    <div key={i} style={{ height: 140, opacity: k, transform: `scale(${(0.6 + k * 0.4) * (1 + on * 0.12)})`, position: "relative", zIndex: last ? 2 : 1, overflow: last ? "visible" : "hidden" }}>
                      {p.pics ? <Img src={p.img!(p.pics[i % p.pics.length])} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${(i * 37) % 100}% ${(i * 53) % 100}%`, transform: `scale(${1.6 + (i % 3) * 0.4})`, filter: "blur(3px) saturate(.7)" }} />
                        : <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${i * 40}deg, hsl(${hue(i)},25%,${30 + (i % 4) * 8}%), hsl(${hue(i) + 20},30%,${45 + (i % 3) * 8}%))`, filter: "blur(4px)" }} />}
                      {i % 4 === 1 && <div style={{ position: "absolute", right: 6, bottom: 4, fontFamily: F.sans, fontSize: 18, color: "#fff", fontWeight: 600 }}>0:{12 + i}</div>}
                      {last && <div style={{ position: "absolute", inset: -4, border: `5px solid ${K.y}`, opacity: on, boxShadow: `0 0 40px ${K.y}`, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(0,0,0,${on * 0.5})` }}>
                        <div style={{ width: 0, height: 0, borderLeft: "34px solid #fff", borderTop: "20px solid transparent", borderBottom: "20px solid transparent", marginLeft: 8 }} /></div>}
                    </div>); })}
                </div>
              </div>
            </Phone>
          </div>
          <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 34 }}>
            {(p.lines as any[]).map((l, i) => { const k = sp(f, at(l.at, 40 + i * 50)); return <div key={i} style={{ opacity: k, transform: `translateY(${(1 - k) * 30}px)`, ...Big, fontSize: l.big ? 84 : 66, color: l.c === "y" ? K.y : K.text }}>{l.text}</div>; })}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 10 · Chat: la transcripción, pregunta y respuesta tipeadas como en el acta
export const Chat: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={10}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 1300, display: "flex", flexDirection: "column", gap: 40 }}>
            {(p.rows as any[]).map((r, i) => { const a = at(r.at, 20 + i * 70); const k = sp(f, a); const n = Math.floor(lin(f, a, a + r.text.length * 1.1, 0, r.text.length, (t) => t)); const det = r.who === "DET"; return (
              <div key={i} style={{ opacity: k, alignSelf: det ? "flex-start" : "flex-end", maxWidth: 1000, display: "flex", gap: 24, flexDirection: det ? "row" : "row-reverse", alignItems: "flex-start" }}>
                <div style={{ fontFamily: F.mono, fontSize: 26, color: det ? K.dim : K.y, paddingTop: 20, minWidth: 90, textAlign: det ? "left" : "right" }}>{r.who}</div>
                <div style={{ padding: "24px 34px", borderRadius: 18, background: det ? "#1b1f26" : "#2a2412", border: `1px solid ${det ? K.line : "rgba(244,197,52,.4)"}`, fontFamily: F.sans, fontSize: 44, color: K.text, lineHeight: 1.3, boxShadow: Shadow }}>{r.text.slice(0, n)}<span style={{ opacity: n < r.text.length ? 1 : 0, color: K.y }}>▍</span></div>
              </div>); })}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 11 · Lock: pantalla bloqueada, Face ID; quién puede abrirla (sólo ella)
export const Lock: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const scan = lin(f, 10, 70); const ok = sp(f, 75);
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={11}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 140 }}>
          <Phone w={460} h={900} style={{ transform: `rotateY(10deg)` }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg,#203046,#0c1018)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 170, fontFamily: F.sans, color: "#fff" }}>
              <div style={{ fontSize: 120, fontWeight: 600 }}>11:12</div>
              <div style={{ fontSize: 28, opacity: 0.7 }}>Sunday, February 23</div>
              <svg width={150} height={150} viewBox="0 0 100 100" style={{ marginTop: 160 }}>
                <g fill="none" stroke={ok > 0.5 ? "#4cd964" : "#fff"} strokeWidth={4} strokeLinecap="round">
                  <path d="M10 30 V15 Q10 10 15 10 H30 M70 10 H85 Q90 10 90 15 V30 M90 70 V85 Q90 90 85 90 H70 M30 90 H15 Q10 90 10 85 V70" />
                  {ok > 0.5 ? <path d="M30 52 L45 66 L72 36" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ok} /> : <><path d="M35 35 V42 M65 35 V42 M50 40 V58 H44 M36 68 Q50 78 64 68" /></>}
                </g>
                <rect x={8} y={8 + scan * 80} width={84} height={3} fill="#4cd964" opacity={ok > 0.5 ? 0 : 0.8} />
              </svg>
            </div>
          </Phone>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {(p.people as any[]).map((q, i) => { const k = sp(f, at(q.at, 60 + i * 40)); return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, opacity: k, transform: `translateX(${(1 - k) * 80}px)` }}>
                <div style={{ width: 90, height: 90, borderRadius: 45, border: `4px solid ${q.ok ? K.y : K.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.cond, fontSize: 52, color: q.ok ? K.y : K.dim }}>{q.ok ? "✓" : "✕"}</div>
                <div><div style={{ ...Big, fontSize: 60, color: q.ok ? K.text : K.dim }}>{q.name}</div><div style={{ fontFamily: F.mono, fontSize: 26, color: K.dim }}>{q.sub}</div></div>
              </div>); })}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 12 · Battery: la batería que se vacía mientras ella habla de la batería
export const Battery: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const lvl = lin(f, 10, dur - 20, 0.86, 0.04, Easing.in(Easing.quad));
  const col = lvl > 0.3 ? "#4cd964" : lvl > 0.12 ? K.y : K.red;
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={12}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
          <div style={{ position: "relative", transform: `perspective(1600px) rotateX(${38 - sp(f, 0) * 8}deg) rotateZ(-8deg) scale(${0.8 + sp(f, 0) * 0.2})`, width: 1400, height: 640, borderRadius: 90, background: "#050608", padding: 30, boxShadow: "0 70px 80px -20px rgba(0,0,0,.9), inset 0 0 0 4px #2c3038" }}>
            <svg width={700} height={300} style={{ position: "absolute", right: -560, top: 220 }}><path d="M0 100 C 160 100 200 260 420 220 S 640 120 700 180" stroke="#e8e8ea" strokeWidth={14} fill="none" strokeLinecap="round" /></svg>
            <div style={{ width: "100%", height: "100%", borderRadius: 64, background: "radial-gradient(circle at 30% 30%, #20242c, #0b0d11)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            {lvl < 0.2 && <div style={{ position: "absolute", top: 40, left: "50%", width: 640, marginLeft: -320, padding: "22px 30px", borderRadius: 30, background: "rgba(240,240,244,.94)", fontFamily: F.sans, color: "#111", transform: `translateY(${(1 - sp(f, (() => { for (let q = 0; q < dur; q++) if (lin(q, 10, dur - 20, 0.86, 0.04, Easing.in(Easing.quad)) < 0.2) return q; return dur; })())) * -220}px)`, zIndex: 3 }}><div style={{ fontSize: 34, fontWeight: 800 }}>Low Battery</div><div style={{ fontSize: 28, color: "#555" }}>{Math.max(1, Math.round(lvl * 100))}% battery remaining</div></div>}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 900, height: 380, borderRadius: 60, border: `14px solid ${K.text}`, padding: 22 }}>
              <div style={{ width: `${lvl * 100}%`, height: "100%", borderRadius: 30, background: `linear-gradient(180deg, ${col}, ${col} 45%, rgba(0,0,0,.35))`, boxShadow: `0 0 60px ${col}`, opacity: lvl < 0.1 ? 0.5 + Math.sin(f / 4) * 0.5 : 1, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 10, height: 50, borderRadius: 30, background: "rgba(255,255,255,.35)" }} />
              </div>
            </div>
            <div style={{ width: 40, height: 150, background: K.text, borderRadius: "0 20px 20px 0", marginLeft: 8 }} />
          </div>
            </div>
          </div>
          <div style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 180, lineHeight: 1, color: col, textShadow: `0 0 50px ${col}`, opacity: lvl < 0.1 ? 0.6 + Math.sin(f / 4) * 0.4 : 1 }}>{Math.max(1, Math.round(lvl * 100))}%</div>
          {p.quote && <div style={{ ...Big, fontSize: 66, color: K.text, opacity: sp(f, at(p.quote.at, 30)), textTransform: "none" }}>“{p.quote.text}”</div>}
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 13 · Report: libreta de calificaciones con lo que ella dice de sí misma; el sello al final
export const Report: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const k = sp(f, 0, { damping: 18, mass: 1.2, stiffness: 80 });
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={13}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
          <div style={{ width: 1100, background: K.paper, boxShadow: Shadow, padding: "60px 80px", transform: `rotateX(${10 + (1 - k) * 40}deg) rotateZ(${1.5}deg) translateY(${(1 - k) * 240}px)`, color: K.ink }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.cond, fontSize: 48, fontWeight: 700, borderBottom: `3px double ${K.ink}`, paddingBottom: 14 }}><span>{p.title}</span><span style={{ fontFamily: F.mono, fontSize: 28, alignSelf: "flex-end" }}>{p.sub}</span></div>
            {(p.rows as any[]).map((r, i) => { const a = at(r.at, 30 + i * 40); const s = sp(f, a, { damping: 8, mass: 0.5, stiffness: 240 }); return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #c8c0ae", padding: "22px 0", opacity: lin(f, a - 5, a + 5, 0.25, 1) }}>
                <span style={{ fontFamily: F.mono, fontSize: 36 }}>{r.label}</span>
                <span style={{ fontFamily: F.cond, fontSize: 70, fontWeight: 700, color: "#b3261e", transform: `scale(${2.2 - s * 1.2}) rotate(${-8}deg)`, opacity: s }}>{r.grade}</span>
              </div>); })}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 14 · Clips: los dos videos del celular como fichas en una regla de tiempo; el corchete mide el hueco
export const Clips: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const items = p.items as { at: string; time: string; label: string; x: number }[];
  const ruler = lin(f, 0, 40);
  const g = at(p.gapAt, 200); const gk = lin(f, g, g + 30);
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={14}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 160, right: 160, top: 640, height: 4, background: K.dim, transform: `scaleX(${ruler})`, transformOrigin: "left" }} />
          {Array.from({ length: 41 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 160 + i * 40, top: i % 5 ? 630 : 618, width: 3, height: i % 5 ? 20 : 44, background: K.dim, opacity: ruler }} />)}
          {items.map((it, i) => { const k = sp(f, at(it.at, 30 + i * 60)); return (
            <div key={i} style={{ position: "absolute", left: it.x, top: 240, width: 440, opacity: k, transform: `translateY(${(1 - k) * -120}px) rotate(${i ? 2 : -2}deg)` }}>
              <div style={{ height: 300, borderRadius: 16, background: "#07080a", border: `3px solid ${K.line}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: Shadow, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 2px, transparent 2px 5px)" }} />
                <div style={{ width: 0, height: 0, borderLeft: "56px solid rgba(255,255,255,.85)", borderTop: "34px solid transparent", borderBottom: "34px solid transparent", marginLeft: 16 }} />
                <div style={{ position: "absolute", left: 18, top: 14, fontFamily: F.mono, fontSize: 24, color: K.dim }}>VIDEO {it.label}</div>
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 64, color: K.y, textAlign: "center", marginTop: 20 }}>{it.time}</div>
              <div style={{ position: "absolute", left: 210, top: 386, width: 20, height: 20, borderRadius: 10, background: K.y }} />
            </div>); })}
          <div style={{ position: "absolute", left: items[0].x + 220, width: (items[1].x - items[0].x) * gk, top: 760, height: 50, borderLeft: `4px solid ${K.y}`, borderRight: gk > 0.98 ? `4px solid ${K.y}` : "none", borderBottom: `4px solid ${K.y}` }} />
          <div style={{ position: "absolute", left: (items[0].x + items[1].x) / 2 + 220 - 300, width: 600, top: 830, textAlign: "center", ...Big, fontSize: 70, color: K.y, opacity: gk }}>{p.gapText}</div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 15 · Plan: plano de la sala visto desde arriba; la valija se da vuelta y se corre hacia la mesa
export const Plan: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const m1 = sp(f, at(p.flip1, 40), { damping: 14, mass: 1, stiffness: 90 }); const m2 = sp(f, at(p.flip2, 140), { damping: 14, mass: 1, stiffness: 90 });
  const x = 520 + m2 * 520, y = 520 - m2 * 120, r = m1 * 180 + m2 * 180;
  const line = { stroke: "#9aa3af", strokeWidth: 9, fill: "none", filter: "drop-shadow(0 0 6px rgba(154,163,175,.45))" };
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={15}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2000 }}>
          <div style={{ transform: "rotateX(38deg) rotateZ(-6deg) translateY(-60px) scale(.9)", position: "relative" }}>
            <svg width={1500} height={900} viewBox="0 0 1500 900">
              <rect x={20} y={20} width={1460} height={860} {...line} />
              <rect x={120} y={120} width={360} height={150} rx={20} {...line} /><text x={300} y={205} fill="#c3c9d1" fontFamily={F.mono} fontSize={40} textAnchor="middle">COUCH</text>
              <rect x={1100} y={260} width={280} height={380} rx={10} {...line} /><text x={1240} y={700} fill="#c3c9d1" fontFamily={F.mono} fontSize={40} textAnchor="middle">DINING</text>
              {[0, 1, 2, 3].map((i) => <rect key={i} x={i < 2 ? 1050 : 1390} y={300 + (i % 2) * 230} width={40} height={60} {...line} />)}
              <path d="M700 880 V760 M700 760 Q760 760 760 700" {...line} /><text x={760} y={840} fill="#c3c9d1" fontFamily={F.mono} fontSize={36}>STAIRS ↑</text>
              <path d={`M520 520 Q760 ${560 - m2 * 60} ${x} ${y}`} stroke={K.y} strokeWidth={8} strokeDasharray="14 12" fill="none" opacity={m2} />
              <g transform={`translate(${x} ${y}) rotate(${r})`}>
                <rect x={-110} y={-58} width={250} height={170} rx={30} fill="rgba(0,0,0,.55)" style={{ filter: "blur(14px)" }} />
                <rect x={-120} y={-80} width={240} height={160} rx={24} fill={K.blue} stroke="#163d82" strokeWidth={6} />
                <rect x={-30} y={-104} width={60} height={26} rx={8} fill="#163d82" />
                {[[-120, -80], [84, -80], [-120, 44], [84, 44]].map(([a, b], i) => <rect key={i} x={a} y={b} width={36} height={36} rx={10} fill="#14171c" />)}
                <rect x={-96} y={-56} width={192} height={112} rx={16} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={4} strokeDasharray="8 6" />
              </g>
            </svg>
          </div>
          {(p.labels as any[]).map((l, i) => { const k = sp(f, at(l.at, 60 + i * 60)); return <div key={i} style={{ position: "absolute", left: 120, right: 120, bottom: 70, textAlign: "center", opacity: k * (1 - (p.labels[i + 1] ? sp(f, at(p.labels[i + 1].at, 9999)) : 0)), transform: `translateY(${(1 - k) * 30}px)`, ...Big, fontSize: 64, color: i ? K.y : K.text, textShadow: "0 4px 20px #000" }}>{l.text}</div>; })}
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 16 · Stack: las defensas como fichas que se apilan; cada una nueva tacha la anterior
export const Stack: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const cards = p.cards as { at: string; text: string }[]; const ts = cards.map((c, i) => at(c.at, 30 + i * 80));
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={16}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1800 }}>
          {cards.map((c, i) => { const k = sp(f, ts[i], { damping: 15, mass: 1, stiffness: 110 }); const next = ts[i + 1] !== undefined ? lin(f, ts[i + 1], ts[i + 1] + 20) : 0; const depth = cards.filter((_, j) => j > i && f >= ts[j]).length; return (
            <div key={i} style={{ position: "absolute", width: 1100, padding: "50px 60px", background: "linear-gradient(170deg,#f3efe4,#e4dccb)", borderRadius: 4, boxShadow: "0 30px 50px rgba(0,0,0,.6)", opacity: k, transform: `translateY(${(1 - k) * 500 - depth * 125 + 200}px) translateZ(${-depth * 90}px) rotateZ(${(i % 2 ? 1.5 : -1.5)}deg)`, filter: `brightness(${1 - depth * 0.14})` }}>
              <div style={{ fontFamily: F.mono, fontSize: 42, color: "#8a6d1f" }}>DEFENSE #{i + 1}</div>
              <div style={{ ...Big, fontSize: 96, marginTop: 10, position: "relative", display: "inline-block", color: K.ink }}>{c.text}
                <div style={{ position: "absolute", left: -20, right: -20, top: "48%", height: 20, background: K.red, transform: `scaleX(${next}) rotate(-2deg)`, transformOrigin: "left", borderRadius: 10, opacity: 0.9 }} />
              </div>
            </div>); })}
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 17 · Counter: el contador de palabras de la transcripción, número que corre con peso
const Odo: React.FC<{ v: number; digits: number; hot?: boolean; plus?: boolean; vel?: number }> = ({ v, digits, hot, plus, vel = 0 }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "center", width: 380, justifyContent: "flex-end" }}>
    {Array.from({ length: digits }).map((_, d) => {
      const pw = Math.pow(10, digits - 1 - d); const x = v / pw; const roll = d === digits - 1 ? x % 10 : Math.floor(x) % 10 + Math.max(0, (x % 1) * 10 - 9);
      return (
        <div key={d} style={{ width: 120, height: 170, overflow: "hidden", borderRadius: 14, background: "linear-gradient(180deg,#07080a,#1c2027 50%,#07080a)", boxShadow: "inset 0 10px 20px rgba(0,0,0,.9), inset 0 -10px 20px rgba(0,0,0,.9), 0 20px 40px rgba(0,0,0,.5)", border: `2px solid ${K.line}`, position: "relative" }}>
          <div style={{ transform: `translateY(${-roll * 170}px)`, filter: `blur(${Math.min(5, vel * (d === digits - 1 ? 10 : 1))}px)` }}>
            {Array.from({ length: 11 }).map((_, n) => <div key={n} style={{ height: 170, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontWeight: 600, fontSize: 130, color: hot ? K.y : K.text }}>{n % 10}</div>)}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 84, height: 2, background: "rgba(0,0,0,.6)" }} />
        </div>);
    })}
    <div style={{ fontFamily: F.mono, fontSize: 110, color: K.y, width: 70, opacity: plus ? 1 : 0 }}>+</div>
  </div>
);
export const Counter: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={17}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 70, padding: "70px 110px 70px 40px", borderRadius: 28, background: "linear-gradient(160deg,#3a3120,#17130c)", border: "3px solid #7a6633", boxShadow: "0 60px 80px -20px rgba(0,0,0,.9), inset 0 2px 0 rgba(255,230,160,.25)", transform: `rotateX(${(1 - sp(f, 0)) * 30}deg)` }}>
          {(p.rows as any[]).map((r, i) => { const a = at(r.at, 20 + i * 70); const k = sp(f, a); const n = Math.round(lin(f, a, a + 45, 0, r.n, Easing.out(Easing.cubic))); return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 70, opacity: Math.max(0.12, k), transform: `translateY(${(1 - k) * 60}px)`, width: 1150 }}>
              <div style={{ transform: "scale(1.3)", transformOrigin: "right center" }}><Odo v={lin(f, a, a + 55, 0, r.n, Easing.out(Easing.cubic))} vel={Math.abs(lin(f, a, a + 55, 0, r.n, Easing.out(Easing.cubic)) - lin(f - 1, a, a + 55, 0, r.n, Easing.out(Easing.cubic)))} digits={2} hot={i === 0} plus={!!r.plus && f > a + 55} /></div>
              <div style={{ ...Big, fontSize: 96, color: i === 0 ? K.text : "#b9bdc5" }}>“{r.word}”</div>
            </div>); })}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 18 · Quote: la frase dicha sobre su propio fotograma, palabra por palabra
export const Quote: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const words = (p.text as string).split(" "); const a = at(p.at, 15);
  return (
    <AbsoluteFill style={{ backgroundColor: K.bg }}>
      <Cam dur={dur} seed={18} depth={false}>
        <Img src={p.img!(p.still)} style={{ position: "absolute", right: 0, top: 0, width: "62%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "50% 40%", filter: "grayscale(.5) contrast(1.1)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 40%)" } as any} />
      </Cam>
      <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, width: 1000, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: F.cond, fontSize: 200, color: K.y, height: 120, lineHeight: 1, opacity: sp(f, a - 10) }}>“</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 22px" }}>
          {words.map((w, i) => { const k = sp(f, a + i * 4, { damping: 16, mass: 0.7, stiffness: 140 }); return <span key={i} style={{ ...Big, textTransform: "none", fontSize: 92, lineHeight: 1.12, opacity: k, transform: `translateY(${(1 - k) * 30}px)`, display: "inline-block" }}>{w}</span>; })}
        </div>
        {p.who && <div style={{ fontFamily: F.mono, fontSize: 32, color: K.dim, marginTop: 30, opacity: sp(f, a + words.length * 4 + 10) }}>— {p.who}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ── 19 · Columns: lo que preguntó / lo que nunca preguntó
export const Columns: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const col = (c: any, side: number) => (
    <div style={{ width: 720, opacity: sp(f, at(c.at, side * 100)) }}>
      <div style={{ ...Big, fontSize: 56, color: side ? K.red : K.y, borderBottom: `3px solid ${side ? K.red : K.y}`, paddingBottom: 14, marginBottom: 24 }}>{c.title}</div>
      {(c.items as any[]).map((it, i) => { const k = sp(f, at(it.at, side * 100 + 20 + i * 30)); return (
        <div key={i} style={{ display: "flex", gap: 22, alignItems: "center", padding: "16px 0", opacity: k, transform: `translateX(${(1 - k) * (side ? 60 : -60)}px)` }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, border: `3px solid ${side ? K.red : K.y}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.cond, fontSize: 34, color: side ? K.red : K.y }}>{side ? "?" : "✓"}</div>
          <div style={{ fontFamily: F.sans, fontSize: 40, color: K.text, fontWeight: 600 }}>{it.text}</div>
        </div>); })}
    </div>
  );
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={19}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 120 }}>{col(p.left, 0)}{col(p.right, 1)}</AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 20 · Years: la línea de los años hasta el juicio; la cámara viaja por ella
export const Years: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const ev = p.events as { at: string; date: string; label: string }[]; const ts = ev.map((e, i) => at(e.at, 20 + i * 60));
  let cur = 0; ts.forEach((t, i) => { cur += sp(f, t, { damping: 20, mass: 1.3, stiffness: 60 }) * (i ? 1 : 0); });
  const STEP = 760;
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={20}>
        <AbsoluteFill style={{ perspective: 1600, WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 16%, #000 84%, transparent 100%)", maskImage: "linear-gradient(90deg, transparent 0%, #000 16%, #000 84%, transparent 100%)" }}>
          <div style={{ position: "absolute", left: 960 - cur * STEP - 200, top: 560, transform: "rotateX(20deg)", transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: ev.length * STEP + 400, height: 6, background: `linear-gradient(90deg, ${K.line}, ${K.y} ${Math.min(100, (cur + 0.5) / ev.length * 100)}%, ${K.line} ${Math.min(100, (cur + 0.5) / ev.length * 100) + 0.1}%)` }} />
            {Array.from({ length: ev.length * 14 + 10 }).map((_, j) => <div key={j} style={{ position: "absolute", left: j * 40, top: j % 7 ? -8 : -22, width: 3, height: j % 7 ? 22 : 50, background: K.line }} />)}
            {ev.map((e, i) => { const k = sp(f, ts[i]); const on = Math.abs(cur - i) < 0.5; return (
              <React.Fragment key={i}>
              <div style={{ position: "absolute", left: 200 + i * STEP - 260, bottom: 60, width: 520, textAlign: "center", opacity: (0.25 + k * (on ? 0.75 : 0.25)) * Math.max(0, 1 - Math.max(0, Math.abs(cur - i) - 1)), transform: `translateY(${(1 - k) * 40}px)` }}>
                <div style={{ fontFamily: F.mono, fontSize: 62, color: K.y }}>{e.date}</div>
                <div style={{ ...Big, fontSize: on ? 92 : 66, marginTop: 14, lineHeight: 1.0 }}>{e.label}</div>
              </div>
              <div style={{ position: "absolute", left: 200 + i * STEP - 18, top: -15, width: 36, height: 36, borderRadius: 18, background: on ? K.y : K.dim, transform: `scale(${on ? 1.3 : 1})`, boxShadow: on ? `0 0 30px ${K.y}` : "none" }} />
              </React.Fragment>); })}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 21 · Glass: reloj de arena; el jurado tardó menos de dos horas
export const Glass: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const a = at(p.at, 20); const sand = lin(f, a, a + 90);
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={21}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 140 }}>
          <svg width={420} height={700} viewBox="0 0 420 700">
            <defs><clipPath id="top"><path d="M60 60 H360 Q360 260 220 350 Q60 260 60 60 Z" /></clipPath><clipPath id="bot"><path d="M220 350 Q360 440 360 640 H60 Q60 440 220 350 Z" /></clipPath></defs>
            <rect x={30} y={30} width={360} height={30} rx={8} fill="#6b5a3a" /><rect x={30} y={640} width={360} height={30} rx={8} fill="#6b5a3a" />
            <rect x={60} y={60 + sand * 260} width={300} height={300} fill={K.y} clipPath="url(#top)" opacity={0.9} />
            <rect x={60} y={640 - sand * 200} width={300} height={300} fill={K.y} clipPath="url(#bot)" opacity={0.9} />
            {sand > 0 && sand < 1 && <rect x={217} y={350} width={6} height={280} fill={K.y} />}
            <path d="M60 60 H360 Q360 260 220 350 Q360 440 360 640 H60 Q60 440 220 350 Q60 260 60 60 Z" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={5} />
          </svg>
          <div style={{ width: 760 }}>
            <div style={{ ...Big, fontSize: 130, color: K.y, opacity: sp(f, a) }}>{p.big}</div>
            <div style={{ ...Big, fontSize: 58, opacity: sp(f, a + 20) }}>{p.small}</div>
            {p.verdict && <div style={{ marginTop: 50, display: "inline-block", border: `6px solid ${K.red}`, color: K.red, ...Big, fontSize: 64, padding: "10px 30px", transform: `rotate(-6deg) scale(${2 - sp(f, at(p.verdict.at, 120), { damping: 9, mass: 0.6, stiffness: 200 })})`, opacity: sp(f, at(p.verdict.at, 120)) }}>{p.verdict.text}</div>}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 22 · Memorial: el nombre de la víctima, sobrio, con luz de vela
export const Memorial: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const dur = Math.round((p.e - p.s) * 30);
  const k = lin(f, 0, 60);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, rgba(244,197,52,${0.10 + Math.sin(f / 13) * 0.02}), ${K.bg} 55%)` }}>
      <Cam dur={dur} seed={22} depth={false}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: F.mono, fontSize: 32, color: K.dim, letterSpacing: 8, opacity: k }}>IN MEMORY OF</div>
          <div style={{ fontFamily: F.cond, fontSize: 150, color: K.text, fontWeight: 500, marginTop: 20, opacity: k, letterSpacing: 4 * (1 - k) + 2 }}>{p.name}</div>
          <div style={{ width: 300 * k, height: 2, background: K.y, margin: "34px 0" }} />
          <div style={{ fontFamily: F.mono, fontSize: 40, color: K.dim, opacity: lin(f, 40, 80) }}>{p.sub}</div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 23 · Poll: la pregunta para los comentarios + suscribirse
export const Poll: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const sub = at(p.subAt, 400); const sk = sp(f, sub, { damping: 10, mass: 0.6, stiffness: 160 }); const press = lin(f, sub + 30, sub + 36) - lin(f, sub + 38, sub + 44);
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={23}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
          <div style={{ ...Big, fontSize: 84, textAlign: "center", width: 1700, opacity: sp(f, 0) }}>{p.q}</div>
          <div style={{ display: "flex", gap: 60, perspective: 1600, marginTop: 20 }}>
          {(p.options as any[]).map((o, i) => { const k = sp(f, at(o.at, 30 + i * 30), { damping: 13, mass: 1.1, stiffness: 100 }); const sway = Math.sin(f / 40 + i * 2) * 3; return (
            <div key={i} style={{ width: 540, background: "#f3f0e8", padding: "18px 18px 26px", borderRadius: 6, opacity: Math.min(1, k * 1.5), transform: `rotateY(${(1 - k) * -90 + sway}deg) rotateZ(${(i - 1) * 3}deg) translateY(${(1 - k) * 80}px)`, boxShadow: "0 40px 60px -10px rgba(0,0,0,.75)" }}>
              <div style={{ position: "relative", height: 330, overflow: "hidden", background: "#222" }}>
                {o.still && <Img src={p.img!(o.still)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: o.pos ?? "50% 40%", transform: `scale(${o.zoom ?? 1.6})`, filter: "saturate(.75) contrast(1.05)" }} />}
                <div style={{ position: "absolute", left: 14, top: 12, width: 64, height: 64, borderRadius: 32, background: K.y, color: K.ink, fontFamily: F.cond, fontSize: 44, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(0,0,0,.5)" }}>{"ABC"[i]}</div>
              </div>
              <div style={{ fontFamily: F.cond, fontWeight: 700, fontSize: 52, color: K.ink, textAlign: "center", marginTop: 18, textTransform: "uppercase" }}>{o.text}</div>
            </div>); })}
          </div>
          <div style={{ marginTop: 40, padding: "24px 60px", borderRadius: 50, background: press > 0.5 ? "#3a3d44" : K.red, color: "#fff", fontFamily: F.sans, fontWeight: 800, fontSize: 48, transform: `scale(${sk * (1 - press * 0.06)})`, opacity: sk }}>{press > 0.5 || f > sub + 44 ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

// ── 24 · Docket: la ficha del tribunal tipeada renglón por renglón; la condena en rojo
export const Docket: React.FC<CP> = (p) => {
  const f = useCurrentFrame(); const at = useAt(p); const dur = Math.round((p.e - p.s) * 30);
  const k = sp(f, 0, { damping: 18, mass: 1.1, stiffness: 90 });
  return (
    <AbsoluteFill>
      <Cam dur={dur} seed={24}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1800 }}>
          <div style={{ width: 1380, padding: "60px 70px", background: "#0f1215", border: `1px solid ${K.line}`, borderRadius: 10, boxShadow: Shadow, transform: `rotateX(${8 + (1 - k) * 30}deg) translateY(${(1 - k) * 160}px)`, opacity: k }}>
            <div style={{ fontFamily: F.mono, fontSize: 26, color: K.dim, borderBottom: `1px solid ${K.line}`, paddingBottom: 18, marginBottom: 24 }}>STATE OF FLORIDA v. SARAH BOONE</div>
            {(p.lines as any[]).map((l, i) => { const a = at(l.at, 20 + i * 60); const n = Math.floor(lin(f, a, a + l.text.length * 0.9, 0, l.text.length, (t) => t)); return (
              <div key={i} style={{ fontFamily: F.mono, fontSize: l.hot ? 60 : 44, fontWeight: 600, color: l.hot ? K.red : K.text, margin: "22px 0", minHeight: 60, textShadow: l.hot && n === l.text.length ? `0 0 30px rgba(224,57,62,.5)` : "none" }}>{l.text.slice(0, n)}<span style={{ color: K.y, opacity: n > 0 && n < l.text.length ? 1 : 0 }}>▍</span></div>); })}
          </div>
        </AbsoluteFill>
      </Cam>
    </AbsoluteFill>
  );
};

export const LIB: Record<string, React.FC<CP>> = { Docket, Room, Names, DayClock, Suitcase, PhoneLog, Paper, Body, Tally, Gallery, Chat, Lock, Battery, Report, Clips, Plan, Stack, Counter, Quote, Columns, Years, Glass, Memorial, Poll };
