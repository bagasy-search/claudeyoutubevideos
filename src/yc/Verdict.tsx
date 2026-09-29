// Componentes del video de reglas (Yesterday's Classroom): el veredicto de HOY y las transiciones de estudio.
//   VerdictStamp — sello de goma del veredicto (4 variantes: ILLEGAL / BANNED / POLICY / GONE) que cae con peso sobre el
//                  metraje real: tinta con desgaste y corrimiento, aplastamiento al pegar, golpe de cámara al plano.
//   DetentionSlip — el papelito rosa de castigo lleno a mano (nombre en blanco, "Reason:", horas), rasgado y abrochado.
//   StateHexMap  — EE.UU. en hexágonos (uno por estado); los estados se encienden en ola con el contador subiendo.
//   ChalkWipe / BellFlash / PagePeel — transiciones firmadas (se ponen como overlay centrado en el corte).
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Caveat";
import { Media } from "./Media";
import { SERIF, TYPE, SANS, YC, clamp, ease, easeInOut, rnd } from "./theme";
import { VERDICT, Verdict } from "./Rulebook3D";

const HAND = loadFont().fontFamily;

const useFonts = (fams: string[]) => {
  const [h] = useState(() => delayRender("fuentes veredicto"));
  const [ok, setOk] = useState(false);
  useEffect(() => { Promise.all(fams.map((x) => document.fonts.load(`80px "${x}"`))).then(() => document.fonts.ready).then(() => { setOk(true); continueRender(h); }); }, [h]);
  return ok;
};

// ─── sello: se dibuja UNA vez en un canvas (tinta + desgaste determinista) ─────
const FOOT: Record<Verdict, string> = { ILLEGAL: "#E3182F", BANNED: "#F2641E", POLICY: "#7AA2FF", GONE: "#E8E1D2" };
function drawStamp(c: HTMLCanvasElement, v: Verdict, line2?: string) {
  const V = { ...VERDICT[v], ink: FOOT[v] };
  const sw = c.width, sh = c.height; const g = c.getContext("2d")!;
  g.clearRect(0, 0, sw, sh);
  g.strokeStyle = V.ink; g.fillStyle = V.ink;
  g.lineWidth = 20; g.strokeRect(14, 14, sw - 28, sh - 28);
  g.lineWidth = 6; g.strokeRect(42, 42, sw - 84, sh - 84);
  g.textAlign = "center"; g.textBaseline = "middle";
  const big = V.word.length > 9 ? 150 : 200;
  g.font = `700 ${big}px "${SANS}"`;
  g.fillText(V.word, sw / 2, line2 ? sh * 0.41 : sh / 2 + 8, sw - 130);
  if (line2) { g.font = `700 80px "${SANS}"`; g.fillText(line2, sw / 2, sh * 0.77, sw - 140); }
  g.globalCompositeOperation = "destination-out";
  const n = v === "GONE" ? 4600 : 2600;
  for (let i = 0; i < n; i++) { g.fillStyle = `rgba(0,0,0,${0.3 + rnd(i + 1) * 0.7})`; const s = 1 + rnd(i + 2) * 5; g.fillRect(rnd(i + 3) * sw, rnd(i + 4) * sh, s, s * (0.5 + rnd(i) * 0.9)); }
  for (let i = 0; i < 22; i++) { g.fillStyle = "rgba(0,0,0,0.55)"; g.beginPath(); g.ellipse(rnd(i + 90) * sw, rnd(i + 91) * sh, 10 + rnd(i + 92) * 50, 3 + rnd(i + 93) * 9, rnd(i) * 3, 0, 7); g.fill(); }
  g.globalCompositeOperation = "source-over";
}

export const VerdictStamp: React.FC<{
  verdict: Verdict; line2?: string; source?: string; bed?: string; bedStart?: number; at?: number; x?: number; y?: number; rot?: number; scale?: number;
}> = ({ verdict, line2, source, bed, bedStart, at = 10, x = 50, y = 50, rot = -8, scale = 1 }) => {
  const f = useCurrentFrame(); const { durationInFrames: D } = useVideoConfig();
  const ok = useFonts([SANS, TYPE]);
  const ref = useRef<HTMLCanvasElement>(null);
  const ref2 = useRef<HTMLCanvasElement>(null);
  const V = VERDICT[verdict];
  const W = 1100, H = line2 ? 440 : 330;
  useLayoutEffect(() => { if (ok && ref.current && ref2.current) { drawStamp(ref.current, verdict, line2); drawStamp(ref2.current, verdict, line2); } }, [ok, verdict, line2]);
  // caída: escala 2.3 → 1 acelerando; al pegar se aplasta y rebota apenas
  const fall = clamp((f - (at - 7)) / 7);
  const sc = f < at ? 2.3 - 1.3 * fall * fall : 1 + 0.05 * Math.exp(-(f - at) / 3) * Math.cos((f - at) * 1.6);
  const squash = f >= at && f < at + 4 ? 1 - 0.07 * Math.sin(((f - at) / 4) * Math.PI) : 1;
  const op = f < at - 7 ? 0 : f < at ? 0.35 + 0.65 * fall : 1;
  const kick = f >= at ? Math.exp(-(f - at) / 5) * V.weight : 0;
  const sx = kick * 26 * Math.sin((f - at) * 2.1), sy = kick * 18 * Math.cos((f - at) * 2.7);
  const out = 1 - clamp((f - (D - 8)) / 8);
  const bleed = f >= at ? ease(clamp((f - at) / 10)) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {bed ? (
        <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${1.04 + kick * 0.03})` }}>
          <AbsoluteFill style={{ filter: `brightness(${0.72 - kick * 0.1}) saturate(0.85)` }}><Media src={bed} start={bedStart} kb="in" zoom={1.08} /></AbsoluteFill>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)", opacity: bed ? 1 : 0.6 }} />
      <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: W * 1.5, height: H * 1.9, marginLeft: -W * 0.75, marginTop: -H * 0.95,
        background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 70%)", opacity: op }} />
      <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2,
        transform: `translate(${sx * 0.4}px, ${sy * 0.4}px) perspective(1400px) rotateX(${(1 - fall) * 18}deg) rotate(${rot}deg) scale(${sc * scale}, ${sc * scale * squash})`, opacity: op }}>
        {/* papel que absorbe: corrimiento de tinta detrás */}
        <canvas ref={ref} width={W} height={H} style={{ position: "absolute", inset: 0, filter: `blur(${2 + bleed * 3}px)`, opacity: 0.35 * bleed, transform: `scale(${1 + bleed * 0.012})`, mixBlendMode: "normal" }} />
        <canvas ref={ref2} width={W} height={H} style={{ position: "absolute", inset: 0, opacity: verdict === "GONE" ? 0.85 : 0.97, filter: "drop-shadow(0 0 14px rgba(0,0,0,0.55))" }} />
        {/* polvo que salta del golpe */}
        {f >= at && f < at + 22 ? Array.from({ length: 26 }, (_, i) => {
          const a = rnd(i + 3) * Math.PI * 2, p = ease((f - at) / 22);
          const r = 0.5 + p * (0.2 + rnd(i) * 0.5);
          return <div key={i} style={{ position: "absolute", left: W / 2 + Math.cos(a) * W * r * 0.55, top: H / 2 + Math.sin(a) * H * r * 0.6, width: 5 + rnd(i + 1) * 7, height: 5 + rnd(i + 1) * 7,
            borderRadius: 10, background: "rgba(245,236,215,0.9)", opacity: 1 - p, filter: "blur(1px)" }} />;
        }) : null}
      </div>
      <AbsoluteFill style={{ background: "#FFF1D8", opacity: f >= at ? 0.28 * Math.exp(-(f - at) / 2.5) * V.weight : 0, mixBlendMode: "screen" }} />
      {source ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: TYPE, fontSize: 40, color: YC.paper, letterSpacing: 1,
          textShadow: "0 3px 16px rgba(0,0,0,0.95)", opacity: ease(clamp((f - at - 8) / 12)) }}>{source}</div>
      ) : null}
    </AbsoluteFill>
  );
};
// ─── DETENTION SLIP ─────────────────────────────────────────────────────────
export const DetentionSlip: React.FC<{ reason: string; hours: string; date?: string; count?: string; bed?: string; note?: string }> = ({ reason, hours, date = "Oct. 3, 1956", count, bed, note }) => {
  const f = useCurrentFrame(); const { durationInFrames: D } = useVideoConfig();
  useFonts([HAND, SANS, TYPE]);
  const a = clamp(f / 8) * (1 - clamp((f - (D - 9)) / 9));
  const drop = ease(clamp(f / 16));
  const write = (from: number, len: number) => clamp((f - from) / len);
  const torn = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) pts.push(`${(i / 40) * 100}% ${(rnd(i + 5) * 2.4).toFixed(2)}%`);
    return `polygon(${pts.join(", ")}, 100% 100%, 0% 100%)`;
  }, []);
  const hand: React.CSSProperties = { fontFamily: HAND, color: "#1C2E6B", fontWeight: 700 };
  const line = (w: number): React.CSSProperties => ({ display: "inline-block", width: w, borderBottom: "2px solid rgba(90,40,50,0.7)", height: 44, verticalAlign: "bottom" });
  const reveal = (p: number): React.CSSProperties => ({ clipPath: `inset(-20% ${100 - p * 100}% -20% -2%)` });
  return (
    <AbsoluteFill style={{ opacity: a, background: "#120C08" }}>
      {bed ? <AbsoluteFill style={{ filter: "brightness(0.45) blur(3px) saturate(0.7)" }}><Media src={bed} kb="in" zoom={1.1} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 1180, height: 700, marginLeft: -590, marginTop: -350,
        transform: `translateY(${(1 - drop) * -120}px) rotate(${-3 + (1 - drop) * -6 + Math.sin(f / 40) * 0.3}deg) scale(${1 + f / D * 0.04})`,
        filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.7))" }}>
        <div style={{ position: "absolute", inset: 0, clipPath: torn, background: "linear-gradient(180deg, #F7CBD3, #F1B9C4)", overflow: "hidden" }}>
          {/* fibras y manchas del papel */}
          {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${rnd(i) * 100}%`, top: `${rnd(i + 3) * 100}%`, width: 2 + rnd(i + 4) * 30, height: 1, background: "rgba(120,40,60,0.12)", transform: `rotate(${rnd(i + 6) * 180}deg)` }} />)}
          <div style={{ position: "absolute", left: 70, right: 70, top: 60, display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "4px double rgba(90,30,45,0.8)", paddingBottom: 14 }}>
            <div style={{ fontFamily: SANS, fontSize: 84, letterSpacing: 10, color: "#5A1E2D" }}>DETENTION SLIP</div>
            <div style={{ fontFamily: TYPE, fontSize: 26, color: "#5A1E2D", textAlign: "right" }}>MAPLE GROVE<br />PUBLIC SCHOOLS</div>
          </div>
          <div style={{ position: "absolute", left: 70, right: 70, top: 220, fontFamily: TYPE, fontSize: 36, color: "#4A1A26", lineHeight: "78px" }}>
            <div>Pupil's name: <span style={line(420)} /> <span style={{ marginLeft: 30 }}>Date:</span> <span style={{ ...line(230), position: "relative" }}><span style={{ ...hand, ...reveal(write(22, 14)), position: "absolute", left: 10, bottom: -4, fontSize: 48, whiteSpace: "nowrap" }}>{date}</span></span></div>
            <div style={{ position: "relative" }}>Reason: <span style={line(890)} />
              <span style={{ ...hand, ...reveal(write(34, Math.max(20, reason.length * 1.3))), position: "absolute", left: 170, top: -6, fontSize: 56, whiteSpace: "nowrap" }}>{reason}</span></div>
            <div style={{ position: "relative" }}><span style={line(1030)} /></div>
            <div style={{ position: "relative" }}>Hours after school: <span style={line(150)} />
              <span style={{ ...hand, ...reveal(write(34 + Math.max(20, reason.length * 1.3) + 4, 8)), position: "absolute", left: 380, top: -14, fontSize: 70 }}>{hours}</span>
              <span style={{ marginLeft: 60 }}>Signed:</span> <span style={line(330)} />
              <svg style={{ position: "absolute", left: 770, top: 0, width: 300, height: 80, overflow: "visible" }} viewBox="0 0 300 80">
                <path d="M5 55 C 30 10, 50 70, 75 35 S 120 20, 130 50 S 170 60, 185 30 C 200 5, 215 70, 240 40 S 280 30, 295 45" fill="none" stroke="#1C2E6B" strokeWidth="4" strokeLinecap="round"
                  pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(write(34 + Math.max(20, reason.length * 1.3) + 14, 14))} />
              </svg>
            </div>
          </div>
          {note ? <div style={{ position: "absolute", right: 70, bottom: 36, ...hand, color: "#B0203A", fontSize: 52, transform: "rotate(-4deg)", ...reveal(write(80, 16)) }}>{note}</div> : null}
        </div>
        {/* grapa */}
        <div style={{ position: "absolute", left: 40, top: 30, width: 90, height: 12, borderRadius: 3, background: "linear-gradient(180deg,#E8E8E8,#8C8C8C)", transform: "rotate(-24deg)", boxShadow: "0 2px 3px rgba(0,0,0,0.5)" }} />
      </div>
      {count ? (
        <div style={{ position: "absolute", right: 90, top: 70, fontFamily: SANS, fontSize: 40, letterSpacing: 6, color: YC.ink, background: YC.bus, padding: "10px 24px",
          transform: `rotate(3deg) scale(${ease(clamp((f - 14) / 10))})`, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>{count}</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ─── MAPA DE HEXÁGONOS ──────────────────────────────────────────────────────
// grilla por filas (col, fila): 50 estados + DC
const GRID: Record<string, [number, number]> = {
  AK: [0, 0], ME: [11, 0],
  WI: [6, 1], VT: [10, 1], NH: [11, 1],
  WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], IL: [6, 2], MI: [7, 2], NY: [9, 2], MA: [10, 2],
  OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3], RI: [11, 3],
  CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4],
  AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5], DC: [9, 5],
  OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6],
  HI: [0, 7], TX: [4, 7], FL: [9, 7],
};
export const StateHexMap: React.FC<{
  title: string; on: string[]; onLabel: string; offLabel: string; onColor?: string; offColor?: string; countLabel?: string; source?: string; startAt?: number; spread?: number;
}> = ({ title, on, onLabel, offLabel, onColor = YC.apple, offColor = "#3E5A4C", countLabel, source, startAt = 18, spread = 70 }) => {
  const f = useCurrentFrame(); const { durationInFrames: D } = useVideoConfig();
  const a = clamp(f / 10) * (1 - clamp((f - (D - 10)) / 10));
  const R = 50, hw = Math.sqrt(3) * R;
  const ox = 250, oy = 300;
  const onSet = new Set(on);
  const order = [...on].sort((p, q) => (GRID[p]?.[0] ?? 0) - (GRID[q]?.[0] ?? 0) || (GRID[p]?.[1] ?? 0) - (GRID[q]?.[1] ?? 0));
  const litAt = (st: string) => startAt + (order.indexOf(st) / Math.max(1, order.length - 1)) * spread;
  const lit = order.filter((st) => f >= litAt(st)).length;
  const hex = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, k) => { const ang = Math.PI / 180 * (60 * k - 30); return `${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`; }).join(" ");
  return (
    <AbsoluteFill style={{ opacity: a, background: "radial-gradient(ellipse at 45% 40%, #1F3A2C 0%, #12211A 70%, #0A140F 100%)" }}>
      {/* borrones de tiza del pizarrón */}
      {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${rnd(i) * 100}%`, top: `${rnd(i + 2) * 100}%`, width: 300 + rnd(i + 3) * 500, height: 120 + rnd(i + 4) * 200,
        borderRadius: "50%", background: "rgba(230,235,225,0.035)", filter: "blur(30px)" }} />)}
      <div style={{ position: "absolute", left: 110, top: 70, fontFamily: SERIF, fontSize: 70, color: YC.paper, opacity: ease(clamp(f / 14)) }}>{title}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Object.entries(GRID).map(([st, [c, r]]) => {
          const cx = ox + c * hw + (r % 2 ? hw / 2 : 0), cy = oy + r * R * 1.5;
          const isOn = onSet.has(st);
          const t = isOn ? clamp((f - litAt(st)) / 8) : 0;
          const appear = ease(clamp((f - 4 - (c + r) * 1.2) / 10));
          const pop = isOn && t > 0 && t < 1 ? 1 + 0.18 * Math.sin(t * Math.PI) : 1;
          const col = isOn && t > 0 ? onColor : offColor;
          return (
            <g key={st} transform={`translate(${cx} ${cy}) scale(${appear * pop}) translate(${-cx} ${-cy})`}>
              <polygon points={hex(cx, cy, R - 4)} fill={col} fillOpacity={isOn ? 0.35 + 0.65 * t : 0.55} stroke={isOn && t > 0 ? "#FFE3B0" : "rgba(245,241,230,0.35)"} strokeWidth={isOn && t > 0 ? 3 : 2} />
              {isOn && t > 0 ? <polygon points={hex(cx, cy, R - 4)} fill="none" stroke={onColor} strokeWidth={8} opacity={(1 - t) * 0.8} transform={`translate(${cx} ${cy}) scale(${1 + t * 0.35}) translate(${-cx} ${-cy})`} /> : null}
              <text x={cx} y={cy + 12} textAnchor="middle" fontFamily={SANS} fontSize={28} fill={isOn && t > 0 ? "#FFF6E6" : "rgba(245,241,230,0.75)"} letterSpacing={2}>{st}</text>
            </g>
          );
        })}
      </svg>
      {/* contador + leyenda */}
      <div style={{ position: "absolute", right: 90, top: 290, width: 500, textAlign: "right" }}>
        <div style={{ fontFamily: SANS, fontSize: 230, lineHeight: 1, color: onColor, textShadow: `0 0 40px ${onColor}66`, fontVariantNumeric: "tabular-nums" }}>{lit}</div>
        <div style={{ fontFamily: SANS, fontSize: 34, letterSpacing: 4, color: YC.paper, marginTop: 6, whiteSpace: "nowrap" }}>{countLabel ?? onLabel}</div>
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end", fontFamily: TYPE, fontSize: 32, color: YC.paper }}>
          <div><span style={{ display: "inline-block", width: 28, height: 28, background: onColor, marginRight: 14, verticalAlign: "middle" }} />{onLabel}</div>
          <div><span style={{ display: "inline-block", width: 28, height: 28, background: offColor, marginRight: 14, verticalAlign: "middle", border: "2px solid rgba(245,241,230,0.35)" }} />{offLabel}</div>
        </div>
      </div>
      {source ? <div style={{ position: "absolute", left: 110, bottom: 50, fontFamily: TYPE, fontSize: 28, color: "rgba(245,241,230,0.7)" }}>{source}</div> : null}
    </AbsoluteFill>
  );
};

// ─── TRANSICIONES (overlay centrado en el corte; el plano de abajo cambia a la mitad) ─────
// borrador de fieltro: barre de izquierda a derecha dejando la mancha de tiza (tapa el plano viejo; el corte cae a la mitad)
// y vuelve de derecha a izquierda arrastrando la mancha (destapa el plano nuevo)
export const ChalkWipe: React.FC = () => {
  const f = useCurrentFrame(); const { durationInFrames: D } = useVideoConfig();
  const half = D / 2;
  const p1 = easeInOut(clamp(f / half)), p2 = easeInOut(clamp((f - half) / half));
  const x = f < half ? -12 + p1 * 124 : 112 - p2 * 124;           // centro del borrador (% del ancho)
  const edge = clamp((x - 4) / 100) * 100;                         // la mancha llega hasta el canto del borrador
  const smear = `repeating-linear-gradient(91deg, rgba(235,238,228,0.10) 0 5px, rgba(235,238,228,0.02) 5px 13px), linear-gradient(180deg, #264232, #1C3326)`;
  const dust = f < half ? 1 : 1 - p2 * 0.5;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: smear, clipPath: `inset(0 ${100 - edge}% 0 0)` }}>
        {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${rnd(i) * 100}%`, top: `${rnd(i + 1) * 100}%`, width: 200 + rnd(i + 2) * 500, height: 30 + rnd(i + 3) * 80,
          background: `rgba(240,242,232,${f < half ? 0.07 : 0.11})`, filter: "blur(12px)", borderRadius: "50%" }} />)}
      </AbsoluteFill>
      {Array.from({ length: 46 }, (_, i) => {
        const px = x + (rnd(i) - 0.5) * 10 + (f < half ? -1 : 1) * rnd(i + 4) * 9, py = 5 + rnd(i + 2) * 90 + ((f * (0.3 + rnd(i + 5))) % 8);
        return <div key={"p" + i} style={{ position: "absolute", left: `${px}%`, top: `${py}%`, width: 3 + rnd(i + 6) * 7, height: 3 + rnd(i + 6) * 7, borderRadius: 8,
          background: "rgba(245,245,238,0.85)", opacity: dust * 0.8, filter: "blur(1.5px)" }} />;
      })}
      <div style={{ position: "absolute", left: `${x}%`, top: "50%", width: 230, height: 1500, marginLeft: -115, marginTop: -750, transform: `rotate(${f < half ? 6 : -6}deg)` }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #6B4A2E, #A2744A 45%, #7A5534)", borderRadius: 18, boxShadow: "0 0 70px rgba(0,0,0,0.75)" }} />
        <div style={{ position: "absolute", left: f < half ? 150 : 0, width: 80, top: 0, bottom: 0, background: "linear-gradient(90deg, #DAD6CB, #B8B3A7)", borderRadius: 10, boxShadow: "inset 0 0 22px rgba(255,255,255,0.6)" }} />
      </div>
    </AbsoluteFill>
  );
};
// timbre + destello cálido (el pico cae en el corte)
export const BellFlash: React.FC = () => {
  const f = useCurrentFrame(); const { durationInFrames: D } = useVideoConfig();
  const mid = D * 0.45;
  const k = f < mid ? ease(f / mid) : Math.exp(-(f - mid) / 3.5);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(255,246,225,1) 0%, rgba(255,214,150,0.95) 45%, rgba(255,170,90,0.7) 100%)", opacity: k, mixBlendMode: "screen" }} />
      {[0, 1, 2].map((i) => {
        const t = clamp((f - i * 3) / 14);
        return <div key={i} style={{ position: "absolute", left: "50%", top: "42%", width: 300, height: 300, marginLeft: -150, marginTop: -150, borderRadius: "50%",
          border: "6px solid rgba(255,240,210,0.9)", transform: `scale(${1 + t * 5})`, opacity: (1 - t) * 0.7 * (t > 0 ? 1 : 0) }} />;
      })}
    </AbsoluteFill>
  );
};
// pase de página: la hoja del reglamento cubre la pantalla y pasa con curvatura (tiras anidadas en CSS-3D, liviano para el farm)
export const PagePeel: React.FC<{ text?: string }> = ({ text }) => {
  const f = useCurrentFrame(); const { width: Wd, height: Ht, durationInFrames: D } = useVideoConfig();
  const p = easeInOut(clamp((f - 2) / (D - 5)));
  const N = 18, sw = Wd / N;
  const bend = Math.sin(p * Math.PI) * 1.2;
  const ang = (s: number) => p * Math.PI + bend * (s - 0.3) * (1 - p * 0.3);
  const paper = "linear-gradient(90deg, #E9DDBF 0%, #F1E7CD 60%, #E2D3B0 100%)";
  const strip = (i: number): React.ReactNode => {
    const a0 = i === 0 ? ang(0.5 / N) : ang((i + 0.5) / N) - ang((i - 0.5) / N);
    const shade = Math.cos(ang((i + 0.5) / N));
    return (
      <div style={{ position: "absolute", left: i === 0 ? 0 : sw, top: 0, width: sw + 1, height: Ht, transformOrigin: "0% 50%", transform: `rotateY(${(-a0 * 180) / Math.PI}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, background: paper, backgroundSize: `${Wd}px ${Ht}px`, backgroundPosition: `${-i * sw}px 0` }} />
        {text ? <div style={{ position: "absolute", top: 380, left: 200 - i * sw, width: Wd - 400, fontFamily: TYPE, fontSize: 64, color: "rgba(30,22,16,0.85)", lineHeight: 1.5 }}>{text}</div> : null}
        <div style={{ position: "absolute", inset: 0, background: `rgba(60,40,20,${clamp(0.5 - shade * 0.5) * 0.6})` }} />
        {i < N - 1 ? strip(i + 1) : null}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ perspective: 2600, pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "rgba(0,0,0,1)", opacity: 0.4 * (1 - p) * clamp(p * 6) }} />
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>{strip(0)}</div>
    </AbsoluteFill>
  );
};
