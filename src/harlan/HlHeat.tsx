// Harlan the Lineman — kit del video hlheater (estufas eléctricas). Misma marca que HlKit (amarillo de seguridad,
// naranja de cono, negro de poste; Oswald + Allerta Stencil + Caveat). Tres piezas con profundidad (fondo + plano
// medio + chispas/calor al frente). Textos SIEMPRE por props.
//   HlStripHeat    — la estufa enchufada a una zapatilla finita vs directo a la pared: el cable fino se pone rojo,
//                    el termómetro sube; el de la pared queda frío
//   HlCircuitLoad  — la barra de un circuito de 15 A: entra la estufa (12,5 A), entra otra cosa → se pasa → la
//                    llave salta
//   HlThreeFeet    — un cuarto visto de arriba: la estufa en el medio, el círculo de 3 pies se abre y empuja afuera
//                    cortina, cama, frazada, árbol
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadStencil } from "@remotion/google-fonts/AllertaStencil";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

const OS = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const ST = loadStencil("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const HD = loadHand("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const C = { yellow: "#F6C400", orange: "#F26B1D", ice: "#CFE8F5", pole: "#3B2A1E", ink: "#121417", night: "#0D1B2A", bone: "#F4F1EA", red: "#D62828", warm: "#F4A259", green: "#3FA34D" };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Embers: React.FC<{ n?: number; seed?: number; o?: number }> = ({ n = 40, seed = 1, o = 0.7 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => { const r = (k: number) => rnd(seed * 31 + i * 7 + k); const s = 2 + r(1) * 5; const y = 1100 - ((r(2) * 1100 + f * (1 + r(3) * 2)) % 1140); const x = (r(4) * 1920 + Math.sin(f / 20 + i) * 30) % 1920; return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: i % 3 ? C.warm : C.yellow, boxShadow: `0 0 ${s * 2}px ${C.orange}`, opacity: o * (0.3 + 0.7 * r(5)) }} />; })}
    </AbsoluteFill>
  );
};
const Bed: React.FC<{ src?: string; dim?: number }> = ({ src, dim = 0.62 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {src ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + f * 0.0004})`, filter: "blur(5px)" }} /> : null}
      <AbsoluteFill style={{ background: `rgba(13,27,42,${dim})` }} />
    </AbsoluteFill>
  );
};
const Title: React.FC<{ t: string; color?: string }> = ({ t, color = C.bone }) => <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center", fontFamily: ST, fontSize: 60, color, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{t}</div>;

// estufa chica (radiador de aceite visto de frente)
const Heater: React.FC<{ w?: number; glow?: number }> = ({ w = 220, glow = 0.6 }) => (
  <div style={{ width: w, height: w * 1.05, position: "relative" }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", gap: w * 0.03, padding: `0 ${w * 0.04}px` }}>
      {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ flex: 1, borderRadius: w * 0.05, background: "linear-gradient(90deg, #cfd2d4, #f6f6f4 40%, #b9bcbe)", boxShadow: `0 0 ${30 * glow}px rgba(242,107,29,${0.5 * glow})` }} />)}
    </div>
    <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -w * 0.06, height: w * 0.06, background: "#2a2a2a", borderRadius: 4 }} />
  </div>
);

export const HlStripHeat: React.FC<{ title?: string; amps?: string; badLabel?: string; goodLabel?: string; badNote?: string; goodNote?: string; bed?: string }> = ({ title = "where you plug it in", amps = "12.5 amps · for hours", badLabel = "power strip / thin cord", goodLabel = "straight into the wall", badNote = "gets hotter and hotter", goodNote = "stays cool", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const heat = interpolate(f, [30, 130], [0, 1], cl);
  const inA = spring({ frame: f - 6, fps, config: { damping: 14 } }); const inB = spring({ frame: f - 18, fps, config: { damping: 14 } });
  const wireColor = (h: number) => `rgb(${40 + 215 * h}, ${40 + 60 * h * (1 - h)}, ${40 - 20 * h})`;
  const Side: React.FC<{ x: number; bad: boolean; k: number }> = ({ x, bad, k }) => {
    const h = bad ? heat : heat * 0.08;
    return (
      <div style={{ position: "absolute", left: x, top: 210, width: 820, height: 760, opacity: k, transform: `translateY(${(1 - k) * 60}px)` }}>
        {/* pared con enchufe */}
        <div style={{ position: "absolute", right: 30, top: 120, width: 130, height: 190, borderRadius: 14, background: C.bone, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>
          {[0, 1].map((j) => <div key={j} style={{ position: "absolute", left: 40, top: 30 + j * 80, width: 50, height: 56, display: "flex", gap: 10, justifyContent: "center" }}><div style={{ width: 9, height: 26, background: "#333", borderRadius: 2 }} /><div style={{ width: 9, height: 26, background: "#333", borderRadius: 2 }} /></div>)}
        </div>
        {bad ? (
          // zapatilla finita en el piso
          <div style={{ position: "absolute", left: 300, top: 560, width: 300, height: 64, borderRadius: 14, background: `linear-gradient(${interpolate(h, [0, 1], [0, 1]) > 0.7 ? "#f0d9c0" : "#f2f2f0"}, #c9c9c7)`, boxShadow: `0 0 ${60 * h}px rgba(214,40,40,${h * 0.8})`, display: "flex", alignItems: "center", gap: 18, padding: "0 20px" }}>
            {Array.from({ length: 4 }).map((_, j) => <div key={j} style={{ width: 40, height: 30, borderRadius: 6, background: j === 0 ? wireColor(h) : "#555" }} />)}
          </div>
        ) : null}
        {/* el cable */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={820} height={760}>
          <path d={bad ? "M200 600 C 250 640, 280 600, 320 592 M600 590 C 680 560, 700 420, 700 270" : "M200 600 C 400 660, 690 520, 700 270"} stroke={wireColor(h)} strokeWidth={bad ? 10 : 18} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${20 * h}px rgba(242,107,29,${h}))` }} />
        </svg>
        <div style={{ position: "absolute", left: 40, top: 400 }}><Heater w={190} glow={0.4} /></div>
        {/* termómetro */}
        <div style={{ position: "absolute", left: 480, top: 120, width: 40, height: 300, borderRadius: 20, background: "rgba(255,255,255,0.15)", border: "4px solid #fff", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${10 + h * 88}%`, background: h > 0.6 ? C.red : h > 0.3 ? C.orange : C.green }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: -10, width: "100%", fontFamily: OS, fontWeight: 700, fontSize: 44, color: bad ? C.red : C.green, textTransform: "uppercase", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{bad ? badLabel : goodLabel}</div>
        <div style={{ position: "absolute", left: 0, top: 690, fontFamily: HD, fontSize: 52, color: C.bone, opacity: interpolate(f, [110, 125], [0, 1], cl) }}>{bad ? badNote : goodNote}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.72} />
      <Title t={title} />
      <div style={{ position: "absolute", top: 128, width: "100%", textAlign: "center", fontFamily: OS, fontWeight: 500, fontSize: 40, color: C.yellow }}>{amps}</div>
      <Side x={100} bad k={inA} />
      <div style={{ position: "absolute", left: 958, top: 230, width: 4, height: 700, background: "rgba(255,255,255,0.25)" }} />
      <Side x={1020} bad={false} k={inB} />
      <Embers n={30} seed={3} o={0.5 * heat} />
    </AbsoluteFill>
  );
};

export const HlCircuitLoad: React.FC<{ title?: string; limit?: number; items: { label: string; amps: number }[]; every?: number; trip?: string; bed?: string }> = ({ title = "one heater per circuit", limit = 15, items, every = 40, trip = "the breaker trips", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const W = 1400, X = 260, Y = 380, H = 140;
  let acc = 0; const segs = items.map((it, i) => { const s = { ...it, from: acc, at: 14 + i * every }; acc += it.amps; return s; });
  const over = acc > limit; const tripAt = 14 + (items.length - 1) * every + 24;
  const tripped = over && f > tripAt; const shake = over ? Math.sin(f * 2.2) * interpolate(f, [tripAt - 20, tripAt], [0, 8], cl) * (tripped ? 0 : 1) : 0;
  const scale = W / Math.max(limit * 1.6, acc * 1.05);
  const lever = spring({ frame: f - tripAt, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.74} />
      <Title t={title} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 14, background: "rgba(255,255,255,0.1)", border: "4px solid rgba(255,255,255,0.5)", transform: `translateX(${shake}px)`, overflow: "hidden", opacity: tripped ? 0.7 : 1 }}>
        {segs.map((s, i) => { const k = spring({ frame: f - s.at, fps, config: { damping: 16 } }); return <div key={i} style={{ position: "absolute", left: s.from * scale, top: 0, height: "100%", width: s.amps * scale * k, background: s.from + s.amps > limit ? C.red : i === 0 ? C.orange : C.yellow, borderRight: "4px solid rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OS, fontWeight: 700, fontSize: 38, color: C.ink, whiteSpace: "nowrap", overflow: "hidden" }}>{k > 0.8 ? `${s.label} · ${s.amps} A` : ""}</div>; })}
      </div>
      {/* límite */}
      <div style={{ position: "absolute", left: X + limit * scale - 3, top: Y - 60, width: 6, height: H + 120, background: C.bone }} />
      <div style={{ position: "absolute", left: X + limit * scale - 150, top: Y - 120, width: 300, textAlign: "center", fontFamily: ST, fontSize: 44, color: C.bone }}>{limit} A circuit</div>
      {/* la llave */}
      <div style={{ position: "absolute", left: 860, top: 640, width: 200, height: 300, borderRadius: 16, background: "linear-gradient(#3a3d40, #1e2022)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 60, top: 70, width: 80, height: 160, borderRadius: 10, background: "#0e0f10" }}>
          <div style={{ position: "absolute", left: 8, top: 8 + lever * 80 * (over ? 1 : 0), width: 64, height: 64, borderRadius: 8, background: tripped ? C.red : "#d8d8d4" }} />
        </div>
        <div style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center", fontFamily: OS, fontWeight: 700, fontSize: 30, color: C.bone }}>{tripped ? "OFF" : "ON"}</div>
      </div>
      {tripped ? <div style={{ position: "absolute", left: 1120, top: 720, fontFamily: HD, fontSize: 72, color: C.yellow, transform: `scale(${lever})`, transformOrigin: "left center" }}>{trip}</div> : null}
      <Embers n={20} seed={5} o={0.35} />
    </AbsoluteFill>
  );
};

export const HlThreeFeet: React.FC<{ title?: string; radius?: string; items?: string[]; rule?: string; bed?: string }> = ({ title = "three feet, every direction", radius = "3 ft", items = ["curtains", "bed", "blankets", "couch", "the dog's bed", "Christmas tree"], rule = "walk all the way around it", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const open = spring({ frame: f - 20, fps, config: { damping: 15, stiffness: 50 } });
  const cx = 960, cy = 590, R = 300 * open;
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.75} />
      <Title t={title} />
      {/* piso de madera visto de arriba */}
      <div style={{ position: "absolute", left: 260, top: 170, width: 1400, height: 860, borderRadius: 18, background: "repeating-linear-gradient(90deg, #7a5532 0 120px, #6c4a2b 120px 124px)", opacity: 0.55, boxShadow: "inset 0 0 120px rgba(0,0,0,0.6)" }} />
      {/* círculo de calor */}
      <div style={{ position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,107,29,0.45), rgba(242,107,29,0.08) 70%)", border: `6px dashed ${C.yellow}` }} />
      <div style={{ position: "absolute", left: cx + R * 0.71 - 20, top: cy - R * 0.71 - 70, fontFamily: ST, fontSize: 56, color: C.yellow, opacity: open }}>{radius}</div>
      <div style={{ position: "absolute", left: cx - 70, top: cy - 75 }}><Heater w={140} glow={1} /></div>
      {items.map((it, i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2; const d = interpolate(open, [0, 1], [130, 420]);
        const k = spring({ frame: f - 6 - i * 4, fps, config: { damping: 14 } });
        return <div key={i} style={{ position: "absolute", left: cx + Math.cos(a) * d * 1.25 - 130, top: cy + Math.sin(a) * d * 0.8 - 34, width: 260, textAlign: "center", padding: "10px 0", borderRadius: 10, background: "rgba(244,241,234,0.95)", fontFamily: OS, fontWeight: 700, fontSize: 32, color: C.ink, textTransform: "uppercase", opacity: k, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>{it}</div>;
      })}
      <div style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center", fontFamily: HD, fontSize: 56, color: C.bone, opacity: interpolate(f, [80, 95], [0, 1], cl) }}>{rule}</div>
      <Embers n={30} seed={9} o={0.5} />
    </AbsoluteFill>
  );
};
