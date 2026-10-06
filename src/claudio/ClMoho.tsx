// Componentes del video del MOHO (reusables por el canal), DENTRO del mundo (cama real del baño, sombra, luz):
//   ClSwab       la prueba del hisopo: dos juntas lado a lado; VIVO = espumita alrededor del hisopo / MANCHA = no pasa nada
//   ClSpores     el cepillo SECO frota y una nube de esporas sale y se posa en techo, cortina y toalla (rótulos donde caen)
//   ClFlashlight la luz rasante del inspector: el baño a media luz, un haz de linterna barre la pared y revela los puntitos en las juntas
//   ClWallLeak   la pared en corte: azulejo, pegamento, ladrillo y el caño con una pérdida gota a gota; la humedad sube y sale moho en la esquina
//   ClHygrometer el medidor de humedad sobre el estante: la aguja pasa el 60 % (zona roja) y vuelve al ventilar
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const tileBgCss = (light = "#F3EEE4") => ({ backgroundColor: light, backgroundImage: "linear-gradient(#CFC6B6 10px, transparent 10px), linear-gradient(90deg, #CFC6B6 10px, transparent 10px)", backgroundSize: "220px 220px, 220px 220px", backgroundPosition: "-5px -5px" });

// ───────────────── ClSwab
const SwabPanel: React.FC<{ alive: boolean; t0: number }> = ({ alive, t0 }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig();
  const k = lin(f, t0 - 6, t0 + 4), touch = ease(clamp01((f - t0 - 4) / 14));
  const fizz = alive ? clamp01((f - t0 - 20) / (T * 0.4)) : 0;
  return (
    <div style={{ position: "relative", width: 700, height: 520, borderRadius: 24, overflow: "hidden", boxShadow: `0 26px 56px ${CL.shadow}`, border: `10px solid ${CL.white}`, opacity: k, ...tileBgCss() }}>
      {/* junta horizontal con manchas negras */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, height: 54, background: "#D8D1C2" }} />
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i + (alive ? 0 : 50)) * 620, top: 236 + rnd(i + 9) * 38, width: 8 + rnd(i + 3) * 18, height: 6 + rnd(i + 4) * 12, borderRadius: "50%", background: alive ? "#17180F" : "#3A3A33", opacity: alive ? 1 - 0.5 * fizz : 0.75 }} />)}
      {/* espumita */}
      {alive ? Array.from({ length: 26 }, (_, i) => { const t = clamp01(fizz * 1.5 - rnd(i) * 0.5); return <div key={"b" + i} style={{ position: "absolute", left: 300 + (rnd(i + 2) - 0.5) * 200, top: 230 + (rnd(i + 5) - 0.5) * 70 - 30 * t, width: 10 + 18 * t * rnd(i + 7), height: 10 + 18 * t * rnd(i + 7), borderRadius: "50%", border: "3px solid rgba(255,255,255,0.95)", background: "rgba(255,255,255,0.35)", opacity: t }} />; }) : null}
      {/* el hisopo */}
      <div style={{ position: "absolute", left: 330, top: 260 - 260 * (1 - touch), width: 300, height: 20, rotate: "-35deg", transformOrigin: "0% 50%" }}>
        <div style={{ position: "absolute", left: 0, top: -14, width: 70, height: 48, borderRadius: 24, background: "radial-gradient(circle at 40% 40%, #FFFFFF, #E8E4DA)" }} />
        <div style={{ position: "absolute", left: 60, top: 2, width: 260, height: 14, borderRadius: 7, background: "#F2F2F2", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
      </div>
      <div style={{ position: "absolute", left: 24, top: 20, background: alive ? CL.red : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 3, padding: "6px 24px", borderRadius: 10 }}>{alive ? "HACE ESPUMA" : "NO HACE NADA"}</div>
      <div style={{ position: "absolute", right: 24, bottom: 20, opacity: lin(f, t0 + T * 0.35, t0 + T * 0.45), background: CL.white, color: alive ? CL.red : CL.navy, fontFamily: HAND, fontWeight: 700, fontSize: 58, padding: "0 24px", borderRadius: 14, boxShadow: `0 12px 26px ${CL.shadow}` }}>{alive ? "está vivo" : "es una mancha vieja"}</div>
    </div>
  );
};
export const ClSwab: React.FC<{ bed?: string }> = ({ bed }) => {
  const out = useOut(6);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={33} dim={0.42} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", gap: 60 }}>
        <SwabPanel alive t0={6} />
        <SwabPanel alive={false} t0={16} />
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClSpores
export const ClSpores: React.FC<{ img: string; from?: [number, number]; spots?: { x: number; y: number; label: string }[]; bed?: string }> = ({ img, from = [0.5, 0.62], spots = [{ x: 0.3, y: 0.12, label: "el techo" }, { x: 0.82, y: 0.35, label: "la cortina" }, { x: 0.15, y: 0.55, label: "la toalla" }] }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const fx = from[0] * W, fy = from[1] * H;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(1.03 + 0.04 * (f / T)) }} />
      <AbsoluteFill style={{ background: "rgba(20,24,34,0.18)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="spg"><stop offset="0" stopColor="#2C2A1E" stopOpacity="0.85" /><stop offset="1" stopColor="#2C2A1E" stopOpacity="0" /></radialGradient></defs>
        {spots.flatMap((s, j) => Array.from({ length: 70 }, (_, i) => {
          const t0 = 0.08 + rnd(i + j * 100) * 0.35, t = clamp01(((f / T) - t0) / 0.45); if (t <= 0) return null;
          const e = ease(t), tx = s.x * W + (rnd(i + j * 7) - 0.5) * 220, ty = s.y * H + (rnd(i + j * 11) - 0.5) * 160;
          const x = fx + (tx - fx) * e + Math.sin(i + f * 0.08) * 14 * (1 - e), y = fy + (ty - fy) * e - 80 * Math.sin(Math.PI * e);
          return <circle key={j + "-" + i} cx={x} cy={y} r={2 + 3 * rnd(i + 3)} fill="#2E2C20" opacity={0.85 * (0.4 + 0.6 * e)} />;
        }))}
        <circle cx={fx} cy={fy} r={60 + 40 * Math.sin(f * 0.3)} fill="url(#spg)" opacity={lin(f, 4, 12)} />
      </svg>
      {spots.map((s, j) => { const k = lin(f, T * 0.45 + j * 8, T * 0.55 + j * 8); return (
        <div key={j} style={{ position: "absolute", left: s.x * W, top: s.y * H, translate: "-50% -50%", opacity: k, scale: String(0.8 + 0.2 * k), background: CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 44, letterSpacing: 2, padding: "8px 24px", borderRadius: 12, textTransform: "uppercase", boxShadow: `0 12px 26px ${CL.shadow}` }}>{s.label}</div>); })}
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClFlashlight
export const ClFlashlight: React.FC<{ img: string; label?: string }> = ({ img, label = "luz de costado" }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const sweep = interpolate(f, [8, T - 10], [0.12, 0.88], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => ease(x) });
  const cx = sweep * W, cy = H * 0.5;
  const dots = Array.from({ length: 90 }, (_, i) => ({ x: (0.1 + 0.8 * rnd(i)) * W, y: (0.2 + 0.6 * rnd(i + 7)) * H, r: 2 + 4 * rnd(i + 3) }));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="beam" cx={cx} cy={cy} r={W * 0.28} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="0.7" stopColor="#000" stopOpacity="0.35" /><stop offset="1" stopColor="#000" stopOpacity="0.72" /></radialGradient>
          <radialGradient id="warm" cx={cx} cy={cy} r={W * 0.2} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFF4D6" stopOpacity="0.45" /><stop offset="1" stopColor="#FFF4D6" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#beam)" />
        <rect width={W} height={H} fill="url(#warm)" />
        {dots.map((d, i) => { const dd = Math.hypot(d.x - cx, (d.y - cy) * 1.4); const k = clamp01(1 - dd / (W * 0.18)); return k > 0 ? <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#14150E" opacity={0.85 * k} /> : null; })}
      </svg>
      {/* la linterna, apoyada contra la pared */}
      <div style={{ position: "absolute", left: cx - 520, top: cy + 60, width: 260, height: 70, rotate: "-8deg" }}>
        <div style={{ position: "absolute", left: 0, top: 10, width: 200, height: 50, borderRadius: 14, background: "linear-gradient(180deg, #3A3F48, #1E2228)" }} />
        <div style={{ position: "absolute", left: 190, top: 0, width: 70, height: 70, borderRadius: 12, background: "linear-gradient(180deg, #4A505A, #2A2E35)", boxShadow: "inset -8px 0 0 #FFF6D8" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 110, opacity: lin(f, 6, 16), background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 46, letterSpacing: 2, padding: "8px 26px", borderRadius: 12, textTransform: "uppercase", borderBottom: `5px solid ${CL.yellow}` }}>{label}</div>
    </AbsoluteFill>
  );
};

// ───────────────── ClWallLeak
export const ClWallLeak: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const damp = ease(clamp01((f - 14) / (T * 0.55)));
  const mold = clamp01((f - T * 0.5) / (T * 0.3));
  const X = 420, Y = 160, Wd = 1080, Hd = 760;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={43} dim={0.4} />
      <Contact x={X + Wd / 2} y={Y + Hd + 16} w={1200} o={0.35} />
      <div style={{ position: "absolute", left: X, top: Y, width: Wd, height: Hd, borderRadius: 14, overflow: "hidden", boxShadow: `0 30px 60px ${CL.shadow}` }}>
        {/* capas: ladrillo (fondo) | pegamento | azulejo (frente, a la derecha) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: Hd, background: "#B5643E", backgroundImage: "linear-gradient(#D9C9B4 6px, transparent 6px), linear-gradient(90deg, #D9C9B4 6px, transparent 6px)", backgroundSize: "260px 90px, 130px 90px" }} />
        <div style={{ position: "absolute", left: 520, top: 0, width: 90, height: Hd, background: "#C9C3B6" }} />
        <div style={{ position: "absolute", left: 610, top: 0, width: 470, height: Hd, ...tileBgCss("#F1EDE4") }} />
        {/* humedad que sube desde el caño */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: Hd, background: `radial-gradient(ellipse at 40% 78%, rgba(60,70,60,${0.55 * damp}), rgba(60,70,60,0) ${30 + 50 * damp}%)` }} />
        {/* el caño con la pérdida */}
        <div style={{ position: "absolute", left: 120, top: 560, width: 520, height: 64, borderRadius: 32, background: "linear-gradient(180deg, #D79A5E, #9C5F2C)", boxShadow: "inset 0 6px 0 rgba(255,255,255,0.35)" }} />
        <div style={{ position: "absolute", left: 300, top: 552, width: 40, height: 80, borderRadius: 8, background: "#7B4520" }} />
        {Array.from({ length: 4 }, (_, i) => { const t = ((f * 0.03 + i / 4) % 1); return <div key={i} style={{ position: "absolute", left: 312, top: 628 + 120 * t * t, width: 16, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(150,195,230,0.95)", opacity: 1 - t }} />; })}
        {/* moho en la esquina del azulejo, del lado de adentro */}
        {Array.from({ length: 40 }, (_, i) => <div key={"m" + i} style={{ position: "absolute", left: 610 + rnd(i) * 140, top: 520 + rnd(i + 3) * 220, width: 8 + rnd(i + 5) * 16, height: 8 + rnd(i + 5) * 16, borderRadius: "50%", background: "#15160E", opacity: mold * (rnd(i + 9) < mold ? 1 : 0) }} />)}
      </div>
      {[["Ladrillo", X + 40, Y - 56], ["Azulejo", X + 650, Y - 56]].map(([t, x, y], i) => <div key={i} style={{ position: "absolute", left: x as number, top: y as number, opacity: lin(f, 6 + i * 4, 14 + i * 4), fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CL.navy }}>{t}</div>)}
      <div style={{ position: "absolute", left: X + 60, top: Y + Hd + 30, opacity: lin(f, 16, 26), background: CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 46, letterSpacing: 2, padding: "8px 26px", borderRadius: 12, textTransform: "uppercase" }}>Pérdida gota a gota</div>
      <div style={{ position: "absolute", left: X + Wd - 470, top: Y + Hd + 30, opacity: lin(f, T * 0.6, T * 0.7), background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 46, letterSpacing: 2, padding: "8px 26px", borderRadius: 12, textTransform: "uppercase", borderBottom: `5px solid ${CL.yellow}` }}>La punta del problema</div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClHygrometer
export const ClHygrometer: React.FC<{ peak?: number; end?: number; bed?: string }> = ({ peak = 78, end = 52, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const up = ease(clamp01((f - 8) / (T * 0.35))), down = ease(clamp01((f - T * 0.55) / (T * 0.3)));
  const v = 40 + (peak - 40) * up - (peak - end) * down;
  const ang = Math.PI * (1 - v / 100);
  const p = pop(f, fps, 4);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={53} dim={0.32} />
      <Contact x={960} y={860} w={620} o={0.4} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", scale: String(0.85 + 0.15 * p) }}>
        <Card style={{ width: 620, padding: "34px 40px 26px", borderRadius: 40, background: "linear-gradient(180deg, #FFFFFF, #ECE8E0)" }}>
          <svg width={540} height={320} viewBox="0 0 540 320">
            <path d="M40 290 A 230 230 0 0 1 270 60" fill="none" stroke="#7FB77E" strokeWidth={34} />
            <path d="M270 60 A 230 230 0 0 1 406 104" fill="none" stroke={CL.yellow} strokeWidth={34} />
            <path d="M406 104 A 230 230 0 0 1 500 290" fill="none" stroke={CL.red} strokeWidth={34} />
            {[0, 20, 40, 60, 80, 100].map((t) => { const a = Math.PI * (1 - t / 100); return <text key={t} x={270 + 175 * Math.cos(a)} y={290 - 175 * Math.sin(a) + 10} textAnchor="middle" fontFamily={LABEL} fontWeight={600} fontSize={30} fill={CL.ink}>{t}</text>; })}
            <line x1={270} y1={290} x2={270 + 210 * Math.cos(ang)} y2={290 - 210 * Math.sin(ang)} stroke={CL.ink} strokeWidth={10} strokeLinecap="round" />
            <circle cx={270} cy={290} r={22} fill={CL.ink} />
          </svg>
          <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: v > 60 ? CL.red : CL.ink, lineHeight: 1 }}>{Math.round(v)}%</div>
          <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: v > 60 ? CL.red : CL.navy }}>{v > 60 ? "demasiada humedad" : "ventilado"}</div>
        </Card>
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};
