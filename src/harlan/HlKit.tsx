// Harlan the Lineman — kit del video hlicestorm (tormenta de hielo). Marca: amarillo de seguridad, naranja de
// cono, azul hielo, negro de poste creosotado; rótulo condensado (Oswald) + plantilla (Allerta Stencil) + mano (Caveat).
// Cinco piezas con profundidad (fondo + plano medio + partículas/nieve al frente). Textos SIEMPRE por props.
//   HlIceLoad       — el cable entre dos postes junta hielo, se comba, la rama de arriba se quiebra
//   HlWarmRoom      — planta de la casa vista de arriba: el frío avanza, el cuarto del medio queda tibio
//   HlBackfeed      — generador → enchufe → medidor → transformador (240 V → miles) → el liniero en el poste
//   HlRestoreOrder  — el orden de restauración que se va encendiendo
//   HlCoinCup       — la moneda arriba (se mantuvo congelado) vs abajo (se descongeló)
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadStencil } from "@remotion/google-fonts/AllertaStencil";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

const OS = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const ST = loadStencil("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const HD = loadHand("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const C = { yellow: "#F6C400", orange: "#F26B1D", ice: "#CFE8F5", iceDeep: "#7FB5D6", pole: "#3B2A1E", ink: "#121417", night: "#0D1B2A", bone: "#F4F1EA", red: "#D62828", warm: "#F4A259" };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Snow: React.FC<{ n?: number; seed?: number; o?: number; blur?: number }> = ({ n = 70, seed = 1, o = 0.8, blur = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", filter: blur ? `blur(${blur}px)` : undefined }}>
      {Array.from({ length: n }).map((_, i) => { const r = (k: number) => rnd(seed * 31 + i * 7 + k); const s = 3 + r(1) * 7; const y = ((r(2) * 1080 + f * (1.5 + r(3) * 2.5)) % 1140) - 30; const x = (r(4) * 1920 + Math.sin(f / 25 + i) * 25 - f * 0.8 + 1920) % 1920; return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: o * (0.4 + 0.6 * r(5)) }} />; })}
    </AbsoluteFill>
  );
};
const Bed: React.FC<{ src?: string; dim?: number }> = ({ src, dim = 0.6 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {src ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + f * 0.0004})`, filter: "blur(5px)" }} /> : null}
      <AbsoluteFill style={{ background: `rgba(13,27,42,${dim})` }} />
    </AbsoluteFill>
  );
};
const Title: React.FC<{ t: string; color?: string }> = ({ t, color = C.bone }) => <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center", fontFamily: ST, fontSize: 60, color, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{t}</div>;

export const HlIceLoad: React.FC<{ title?: string; label?: string; bed?: string }> = ({ title = "what ice does to a line", label = "inches of ice", bed }) => {
  const f = useCurrentFrame();
  const ice = interpolate(f, [10, 120], [0, 1], cl);
  const sag = 60 + ice * 170;
  const snap = interpolate(f, [125, 140], [0, 1], cl);
  const x1 = 260, x2 = 1660, y = 360;
  const d = `M${x1} ${y} Q ${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`;
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.55} />
      <Title t={title} />
      {[x1, x2].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 18, top: y - 60, width: 36, height: 760, background: `linear-gradient(90deg, #4a3526, ${C.pole})`, boxShadow: "0 0 30px rgba(0,0,0,0.5)" }}><div style={{ position: "absolute", left: -90, top: 40, width: 216, height: 18, background: C.pole }} /></div>)}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={d} stroke={C.ice} strokeOpacity={0.9} strokeWidth={6 + ice * 30} fill="none" strokeLinecap="round" />
        <path d={d} stroke="#1a1a1a" strokeWidth={6} fill="none" />
        {Array.from({ length: 26 }).map((_, i) => { const t = (i + 0.5) / 26; const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * ((x1 + x2) / 2) + t * t * x2; const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + sag * 2) + t * t * y; return <path key={i} d={`M${px} ${py + 8} l -4 ${10 + ice * 34 * rnd(i)} l 8 0 Z`} fill={C.ice} opacity={ice} />; })}
        {/* rama arriba del cable */}
        <g transform={`translate(1000 ${150 + snap * 240}) rotate(${-14 + snap * 40})`} opacity={1}>
          <path d="M-420 0 C -200 -20, 0 -10, 260 10" stroke="#3a2a1c" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M-420 0 C -200 -20, 0 -10, 260 10" stroke={C.ice} strokeOpacity={0.7} strokeWidth={22 + ice * 16} fill="none" strokeLinecap="round" />
        </g>
      </svg>
      {snap > 0.05 && snap < 0.6 ? <AbsoluteFill style={{ background: `rgba(255,255,255,${0.5 * (1 - snap / 0.6)})` }} /> : null}
      <div style={{ position: "absolute", right: 120, bottom: 110, background: C.yellow, padding: "14px 26px", fontFamily: OS, fontWeight: 700, fontSize: 46, color: C.ink, transform: "rotate(-2deg)" }}>{(ice * 1).toFixed(2)}" · {label}</div>
      <Snow n={60} seed={4} />
    </AbsoluteFill>
  );
};

export const HlWarmRoom: React.FC<{ title?: string; roomLabel?: string; tips?: string[] }> = ({ title = "heat one room, not the house", roomLabel = "the warm room", tips = ["blanket over the door", "towel at the bottom", "curtains closed", "everybody in here"] }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const cold = interpolate(f, [10, 120], [0, 1], cl);
  const rooms = [[260, 220, 520, 300, "kitchen"], [800, 220, 420, 300, "living room"], [1240, 220, 420, 300, "bedroom"], [260, 540, 420, 320, "bedroom"], [700, 540, 500, 320, "WARM"], [1220, 540, 440, 320, "bath"]] as const;
  return (
    <AbsoluteFill style={{ background: "#E8E4DA" }}>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,60,120,0.07) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(0,60,120,0.07) 0 1px, transparent 1px 40px)" }} />
      <Title t={title} color={C.ink} />
      {rooms.map(([x, y, w, h, n], i) => {
        const warm = n === "WARM";
        const bg = warm ? `rgba(244,162,89,${0.35 + 0.25 * Math.sin(f / 10) ** 2})` : `rgba(127,181,214,${cold * 0.75})`;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `10px solid ${C.ink}`, background: bg, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 18, top: 10, fontFamily: OS, fontWeight: 700, fontSize: 30, color: C.ink, textTransform: "uppercase" }}>{warm ? roomLabel : n}</div>
            {!warm ? <div style={{ position: "absolute", right: 18, bottom: 10, fontFamily: OS, fontSize: 40, color: "#1d4e70", opacity: cold }}>{Math.round(68 - cold * 20)}°</div> : <div style={{ position: "absolute", right: 18, bottom: 10, fontFamily: OS, fontSize: 40, color: "#8a3b07" }}>62°</div>}
            {warm ? Array.from({ length: 4 }).map((_, k) => <div key={k} style={{ position: "absolute", left: 60 + k * 100, top: 130, width: 54, height: 54, borderRadius: "50%", background: C.ink, boxShadow: `0 0 30px ${C.warm}` }} />) : null}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 270, top: 900, display: "flex", gap: 22 }}>
        {tips.map((t, i) => { const s = spring({ frame: f - 40 - i * 18, fps, config: { damping: 13 } }); return <div key={i} style={{ transform: `scale(${s})`, background: C.yellow, padding: "10px 18px", fontFamily: HD, fontSize: 40, color: C.ink, boxShadow: "0 8px 16px rgba(0,0,0,0.25)" }}>{t}</div>; })}
      </div>
    </AbsoluteFill>
  );
};

export const HlBackfeed: React.FC<{ title?: string; steps?: string[]; volts?: [string, string]; warn?: string; bed?: string }> = ({ title = "why backfeeding kills linemen", steps = ["generator", "dryer outlet", "your meter", "transformer"], volts = ["240 V", "thousands of volts"], warn = "the man on the pole thinks it's dead", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const flow = interpolate(f, [20, 130], [0, 1], cl);
  const xs = [200, 560, 920, 1280];
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.72} />
      <Title t={title} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M200 620 L 1280 620 L 1280 420 L 1640 300" stroke="#555" strokeWidth={14} fill="none" />
        <path d="M200 620 L 1280 620 L 1280 420 L 1640 300" stroke={flow > 0.7 ? C.red : C.yellow} strokeWidth={14} fill="none" pathLength={1} style={{ strokeDasharray: `${flow} 1` }} />
        {Array.from({ length: 10 }).map((_, i) => { const t = (flow * 1.2 - i * 0.08); if (t < 0 || t > 1) return null; const px = t < 0.7 ? 200 + (t / 0.7) * 1080 : 1280 + ((t - 0.7) / 0.3) * 360; const py = t < 0.7 ? 620 : 420 - ((t - 0.7) / 0.3) * 120; return <circle key={i} cx={px} cy={py} r={14} fill={t > 0.7 ? C.red : C.yellow} />; })}
      </svg>
      {steps.map((s, i) => { const k = spring({ frame: f - 6 - i * 16, fps, config: { damping: 13 } }); return <div key={i} style={{ position: "absolute", left: xs[i] - 120, top: 660, width: 240, transform: `scale(${k})`, background: C.bone, padding: "14px 10px", textAlign: "center", fontFamily: OS, fontWeight: 700, fontSize: 32, color: C.ink, textTransform: "uppercase", borderTop: `8px solid ${i === 3 ? C.red : C.yellow}` }}>{s}</div>; })}
      <div style={{ position: "absolute", left: 1080, top: 470, fontFamily: OS, fontWeight: 700, fontSize: 36, color: C.yellow }}>{volts[0]} →</div>
      <div style={{ position: "absolute", left: 1060, top: 170, fontFamily: OS, fontWeight: 700, fontSize: 52, color: C.red, opacity: interpolate(f, [100, 115], [0, 1], cl) }}>{volts[1]}</div>
      {/* poste y liniero */}
      <div style={{ position: "absolute", left: 1640, top: 160, width: 30, height: 800, background: C.pole }} />
      <div style={{ position: "absolute", left: 1600, top: 230, width: 110, height: 110, borderRadius: "50% 50% 10px 10px", background: C.yellow, boxShadow: `0 0 ${20 + 30 * interpolate(f, [110, 140], [0, 1], cl)}px ${C.red}` }} />
      <div style={{ position: "absolute", left: 1300, bottom: 70, width: 560, background: C.red, color: "#fff", padding: "14px 22px", fontFamily: HD, fontSize: 44, transform: "rotate(-2deg)", opacity: interpolate(f, [120, 135], [0, 1], cl) }}>{warn}</div>
      <Snow n={30} seed={9} o={0.5} />
    </AbsoluteFill>
  );
};

export const HlRestoreOrder: React.FC<{ title?: string; steps?: string[]; every?: number; bed?: string }> = ({ title = "the order the lights come back", steps = ["power plants & big lines", "substations", "main lines on big roads", "side streets", "the wire to your house"], every = 28, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.7} />
      <Title t={title} />
      {steps.map((s, i) => {
        const on = f > 14 + i * every; const k = spring({ frame: f - 14 - i * every, fps, config: { damping: 14 } });
        return (
          <div key={i} style={{ position: "absolute", left: 360 + i * 70, top: 190 + i * 160, width: 1100 - i * 60, height: 120, display: "flex", alignItems: "center", gap: 24, background: on ? "rgba(246,196,0,0.95)" : "rgba(255,255,255,0.12)", color: on ? C.ink : "rgba(255,255,255,0.6)", padding: "0 30px", borderRadius: 10, boxShadow: on ? "0 0 40px rgba(246,196,0,0.5)" : "none", transform: `translateX(${(1 - k) * -60}px)` }}>
            <div style={{ fontFamily: ST, fontSize: 60, width: 70 }}>{i + 1}</div>
            <div style={{ fontFamily: OS, fontWeight: 700, fontSize: 48, textTransform: "uppercase" }}>{s}</div>
          </div>
        );
      })}
      <Snow n={40} seed={13} o={0.5} />
    </AbsoluteFill>
  );
};

export const HlCoinCup: React.FC<{ title?: string; good?: string; bad?: string }> = ({ title = "the coin on the ice", good = "coin on top: stayed frozen", bad = "coin on the bottom: it thawed" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const drop = interpolate(f, [70, 110], [0, 1], cl);
  const cup = (x: number, sunk: boolean, label: string, at: number) => {
    const k = spring({ frame: f - at, fps, config: { damping: 13 } });
    return (
      <div style={{ position: "absolute", left: x, top: 230, width: 520, transform: `scale(${k})`, opacity: k }}>
        <div style={{ position: "relative", margin: "0 auto", width: 300, height: 420, borderRadius: "0 0 40px 40px", border: "8px solid rgba(255,255,255,0.8)", borderTop: "none", background: `linear-gradient(${C.ice}, ${C.iceDeep})`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 105, width: 90, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #fff3c4, #c99a2e 60%, #8a6414)", top: sunk ? 20 + drop * 360 : 20, boxShadow: "0 4px 6px rgba(0,0,0,0.4)" }} />
          {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + rnd(i) * 240, top: 60 + rnd(i * 3) * 320, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />)}
        </div>
        <div style={{ marginTop: 26, textAlign: "center", background: sunk ? C.red : C.yellow, color: sunk ? "#fff" : C.ink, padding: "12px 18px", fontFamily: HD, fontSize: 42 }}>{label}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#1C3144, #0D1B2A)" }}>
      <Title t={title} />
      {cup(300, false, good, 8)}
      {cup(1100, true, bad, 30)}
      <Snow n={40} seed={21} o={0.4} blur={1} />
    </AbsoluteFill>
  );
};
