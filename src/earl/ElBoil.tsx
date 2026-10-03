// Kit del video earlboil (el hervido de camarones del barco). Tres piezas con profundidad (cama + plano medio +
// vapor/partículas al frente), en el idioma del galpón de Earl:
//   ElBoilClock     — la olla de aluminio vista de costado con su canasta: entra cada cosa a su tiempo
//                     (papas 15' → chorizo y choclo 5-7' → camarón 2-3' → hielo → reposo 15'), con un reloj
//   ElFlavorInside  — corte de un camarón: restorán (la salsa queda afuera) vs barco (el sabor entra en el reposo)
//   ElPeel3         — los 3 pasos para pelar rápido, en tarjetas que se van dando vuelta
// Textos SIEMPRE por props.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EL, LABEL, MARKER, STENCIL, hexA, rnd } from "./ElTheme";
import { ElBed, Stamp, Tape, ease } from "./ElParts";

const Steam: React.FC<{ x: number; y: number; w: number; n?: number; strength?: number }> = ({ x, y, w, n = 10, strength = 1 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: number) => rnd(i * 13 + k); const t = ((f * 1.2 + r(1) * 120) % 120) / 120;
        return <div key={i} style={{ position: "absolute", left: x + r(2) * w + Math.sin(f / 14 + i) * 30, top: y - t * 420, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${0.22 * strength * (1 - t)}), transparent 70%)`, filter: "blur(10px)" }} />;
      })}
    </>
  );
};

export const ElBoilClock: React.FC<{ steps: { label: string; time: string; color: string }[]; title?: string; every?: number; bed?: string; soak?: string }> = ({ steps, title = "the order it goes in", every = 40, bed, soak = "kill the heat · ice · soak 15 min" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const n = steps.length; const last = 10 + n * every;
  const iceOn = interpolate(f, [last, last + 12], [0, 1], ease);
  const level = 0.72;
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={31} dim={0.62} />
      <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 58, color: EL.white, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{title}</div>
      {/* quemador y olla */}
      <div style={{ position: "absolute", left: 260, top: 880, width: 640, height: 60, background: "linear-gradient(#2b2b2b, #111)", borderRadius: 8 }} />
      {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 48, top: 850 + Math.sin(f / 3 + i) * 4, width: 18, height: 34, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 50% 70%, #9fd3ff, #2f7bff 60%, transparent 70%)", opacity: 1 - iceOn * 0.95 }} />)}
      <div style={{ position: "absolute", left: 280, top: 300, width: 600, height: 560, borderRadius: "14px 14px 40px 40px", background: "linear-gradient(90deg, #8e9499, #d8dde0 35%, #a7adb1 70%, #7c8287)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: `${level * 100}%`, borderRadius: "0 0 30px 30px", background: `linear-gradient(${hexA("#C76B2E", 0.85)}, ${hexA("#8A3E12", 0.95)})` }} />
        {/* lo que va entrando */}
        {steps.map((s, i) => {
          const at = 10 + i * every; const k = spring({ frame: f - at, fps, config: { damping: 16 } });
          return Array.from({ length: 6 }).map((_, j) => <div key={`${i}-${j}`} style={{ position: "absolute", left: 60 + rnd(i * 9 + j) * 460, top: 160 + (1 - k) * -400 + rnd(i * 3 + j) * 280 + Math.sin(f / 9 + j) * 6, width: 44 + rnd(j) * 20, height: 34 + rnd(j + 2) * 16, borderRadius: "40%", background: s.color, opacity: k, boxShadow: "0 3px 6px rgba(0,0,0,0.3)" }} />);
        })}
        {Array.from({ length: 22 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 500, top: 170 + ((rnd(i * 2) * 300 - f * 4) % 300 + 300) % 300, width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)", opacity: 1 - iceOn }} />)}
        {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i * 5) * 500, top: 120 + iceOn * (60 + rnd(i) * 80), width: 50, height: 40, borderRadius: 8, background: "rgba(235,248,255,0.85)", opacity: iceOn, transform: `rotate(${rnd(i) * 40}deg)` }} />)}
      </div>
      <Steam x={300} y={300} w={560} n={12} strength={1 - iceOn * 0.7} />
      {/* columna de pasos con tiempos */}
      <div style={{ position: "absolute", left: 1000, top: 230, width: 760 }}>
        {steps.map((s, i) => {
          const at = 10 + i * every; const k = spring({ frame: f - at, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22, transform: `translateX(${(1 - k) * 80}px)`, opacity: k }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: s.color, border: "4px solid #fff", flexShrink: 0 }} />
              <div style={{ flex: 1, background: "rgba(244,246,244,0.95)", borderRadius: 14, padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: MARKER, fontSize: 44, color: EL.marker }}>{s.label}</span>
                <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: EL.red }}>{s.time}</span>
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 18, transform: `scale(${spring({ frame: f - last, fps, config: { damping: 12 } })})`, transformOrigin: "left center" }}><Tape text={soak} size={44} rot={-2} /></div>
      </div>
    </AbsoluteFill>
  );
};

const ShrimpCut: React.FC<{ x: number; label: string; inside: boolean; good: boolean; at: number }> = ({ x, label, inside, good, at }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 90], [0, 1], ease);
  return (
    <div style={{ position: "absolute", left: x, top: 230, width: 760, height: 640 }}>
      <svg width={760} height={520} viewBox="0 0 760 520" style={{ position: "absolute", top: 40 }}>
        <defs><clipPath id={`c${x}`}><path d="M90 300 C 120 120, 420 60, 600 170 C 690 230, 690 360, 580 420 C 480 470, 300 440, 260 380 C 220 330, 140 360, 90 300 Z" /></clipPath></defs>
        <path d="M90 300 C 120 120, 420 60, 600 170 C 690 230, 690 360, 580 420 C 480 470, 300 440, 260 380 C 220 330, 140 360, 90 300 Z" fill="#F6E4D8" stroke="#E07A4A" strokeWidth={26} />
        <g clipPath={`url(#c${x})`}>
          {Array.from({ length: 70 }).map((_, i) => {
            const sx = 120 + rnd(i * 3 + x) * 540, sy = 120 + rnd(i * 7 + x) * 320;
            const depth = rnd(i + 11);
            const show = inside ? depth < t : depth < 0.12;
            return show ? <circle key={i} cx={sx} cy={sy} r={7} fill={["#C0392B", "#7B3F00", "#E67E22", "#556B2F"][i % 4]} opacity={0.85} /> : null;
          })}
        </g>
        {!inside ? Array.from({ length: 40 }).map((_, i) => { const a = rnd(i) * Math.PI * 2; return <circle key={i} cx={380 + Math.cos(a) * (300 + rnd(i * 2) * 30)} cy={290 + Math.sin(a) * (170 + rnd(i * 3) * 20)} r={9} fill="#E8B04A" opacity={t} />; }) : null}
      </svg>
      <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center" }}><Tape text={label} size={46} color={good ? EL.green : EL.red} rot={good ? -2 : 2} /></div>
    </div>
  );
};
export const ElFlavorInside: React.FC<{ left?: string; right?: string; title?: string; bed?: string }> = ({ left = "restaurant: sauce on the outside", right = "the boat: soaked in", title = "where the flavor goes", bed }) => (
  <AbsoluteFill>
    <ElBed src={bed} seed={33} dim={0.65} />
    <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 58, color: EL.white, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{title}</div>
    <ShrimpCut x={120} label={left} inside={false} good={false} at={10} />
    <ShrimpCut x={1040} label={right} inside good at={30} />
  </AbsoluteFill>
);

export const ElPeel3: React.FC<{ steps?: string[]; title?: string; bed?: string; every?: number }> = ({ steps = ["twist the head off", "peel from the legs", "squeeze the tail"], title = "peel it in 3 moves", bed, every = 30 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={35} dim={0.6} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 60, color: EL.white, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{title}</div>
      {steps.map((s, i) => {
        const k = spring({ frame: f - 10 - i * every, fps, config: { damping: 15, stiffness: 90 } });
        return (
          <div key={i} style={{ position: "absolute", left: 140 + i * 570, top: 280, width: 500, height: 520, perspective: 1200 }}>
            <div style={{ width: "100%", height: "100%", transform: `rotateY(${(1 - k) * 180}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 26, background: "#F4F6F4", boxShadow: "0 30px 50px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
                <div style={{ width: 150, height: 150, borderRadius: 75, background: EL.buoy, color: "#fff", fontFamily: STENCIL, fontSize: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ fontFamily: MARKER, fontSize: 50, color: EL.marker, textAlign: "center", padding: "0 30px", lineHeight: 1.1 }}>{s}</div>
              </div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 26, background: EL.navy }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 120, bottom: 90 }}><Stamp text="no knife needed" at={10 + steps.length * every} size={52} color={EL.red} rot={-6} style={{ background: "rgba(255,255,255,0.92)", mixBlendMode: "normal" }} /></div>
    </AbsoluteFill>
  );
};
