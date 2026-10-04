// Kit del video hankwolf (lobos en Colorado). Tres piezas con profundidad (papel/terreno + plano medio + grano al
// frente), en el idioma de Hank (libreta de campo, musgo, naranja de acento):
//   HkBallotMap  — el rectángulo de Colorado partido por la Divisoria Continental: el este (ciudades) se pinta SÍ, el
//                  oeste (condados de rancho, donde viven los lobos) NO; abajo, la barra 50,9 vs 49,1
//   HkCollarTrack — mapa topográfico de noche: puntos de collar GPS dejan rastro desde la suelta; uno se va lejísimo
//   HkFladry     — la cerca de soga con banderitas rojas flameando; el lobo llega, frena y se da vuelta; al costado
//                  las otras herramientas (jinetes, perros, sacar los animales muertos)
// Textos SIEMPRE por props.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HK, HAND, MONO, SANS, rnd } from "./theme";
import { Paper } from "./HkMaui";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const Grain: React.FC<{ o?: number }> = ({ o = 0.2 }) => {
  const f = useCurrentFrame();
  return <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o }} />;
};
const Title: React.FC<{ t: string; dark?: boolean }> = ({ t, dark }) => <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 62, color: dark ? HK.bone : HK.ink, textTransform: "uppercase", letterSpacing: 1 }}>{t}</div>;

// ── votación ────────────────────────────────────────────────────────────────────────────────────────────────────
export const HkBallotMap: React.FC<{ title?: string; yes?: number; no?: number; eastLabel?: string; westLabel?: string; cities?: string[]; divide?: string }> = ({ title = "Proposition 114 · 2020", yes = 50.9, no = 49.1, eastLabel = "cities · mostly YES", westLabel = "ranch counties · mostly NO", cities = ["Fort Collins", "Boulder", "Denver"], divide = "Continental Divide" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const X = 360, Y = 170, W = 1200, H = 600; const dx = X + W * 0.52;
  const west = interpolate(f, [20, 50], [0, 1], cl), east = interpolate(f, [40, 70], [0, 1], cl);
  const divDraw = interpolate(f, [8, 40], [0, 1], cl);
  const bar = spring({ frame: f - 80, fps, config: { damping: 18, stiffness: 60 } });
  // la divisoria: una línea quebrada de norte a sur
  const pts = Array.from({ length: 13 }).map((_, i) => [dx + Math.sin(i * 1.7) * 40 + (rnd(i) - 0.5) * 30, Y + (H / 12) * i]);
  const path = "M" + pts.map((p) => p.join(" ")).join(" L ");
  const westPoly = `M${X} ${Y} L ${pts.map((p) => p.join(" ")).join(" L ")} L ${X} ${Y + H} Z`;
  const eastPoly = `M${X + W} ${Y} L ${pts.map((p) => p.join(" ")).join(" L ")} L ${X + W} ${Y + H} Z`;
  return (
    <AbsoluteFill>
      <Paper />
      <Title t={title} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={westPoly} fill={HK.red} opacity={0.18 + 0.55 * west} />
        <path d={eastPoly} fill={HK.moss} opacity={0.18 + 0.55 * east} />
        {/* picos de montaña sobre la divisoria */}
        {pts.slice(1, 12).map((p, i) => <path key={i} d={`M${p[0] - 34} ${p[1] + 20} L ${p[0]} ${p[1] - 26} L ${p[0] + 34} ${p[1] + 20} Z`} fill={HK.bone} stroke={HK.ink} strokeWidth={3} opacity={divDraw} />)}
        <path d={path} fill="none" stroke={HK.ink} strokeWidth={6} strokeDasharray="18 12" pathLength={1} style={{ strokeDasharray: `${divDraw} 1` }} />
        <rect x={X} y={Y} width={W} height={H} fill="none" stroke={HK.ink} strokeWidth={6} />
      </svg>
      {cities.map((c, i) => <div key={c} style={{ position: "absolute", left: dx + 200 + (i % 2) * 40, top: Y + 120 + i * 120, display: "flex", alignItems: "center", gap: 12, opacity: east }}><div style={{ width: 22, height: 22, borderRadius: 11, background: HK.ink }} /><span style={{ fontFamily: MONO, fontSize: 34, color: HK.ink, fontWeight: 700 }}>{c}</span></div>)}
      <div style={{ position: "absolute", left: X + 40, top: Y + H - 90, fontFamily: HAND, fontSize: 50, color: HK.ink, opacity: west }}>{westLabel}</div>
      <div style={{ position: "absolute", left: dx + 80, top: Y + H - 90, fontFamily: HAND, fontSize: 50, color: HK.ink, opacity: east }}>{eastLabel}</div>
      <div style={{ position: "absolute", left: dx - 160, top: Y + H + 12, width: 320, textAlign: "center", fontFamily: MONO, fontSize: 26, color: HK.ink, opacity: divDraw }}>{divide}</div>
      {/* barra del resultado */}
      <div style={{ position: "absolute", left: X, top: 830, width: W, height: 90, borderRadius: 10, overflow: "hidden", border: `5px solid ${HK.ink}`, opacity: bar }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${yes * bar}%`, background: HK.moss, display: "flex", alignItems: "center", paddingLeft: 24, fontFamily: SANS, fontWeight: 700, fontSize: 48, color: HK.bone }}>YES {yes}%</div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${no * bar}%`, background: HK.red, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 24, fontFamily: SANS, fontWeight: 700, fontSize: 48, color: HK.bone }}>NO {no}%</div>
        <div style={{ position: "absolute", left: "50%", top: -10, bottom: -10, width: 4, background: HK.gold }} />
      </div>
      <Grain o={0.18} />
    </AbsoluteFill>
  );
};

// ── collares GPS ────────────────────────────────────────────────────────────────────────────────────────────────
export const HkCollarTrack: React.FC<{ title?: string; release?: string; note?: string; wanderer?: string; n?: number }> = ({ title = "every wolf wears a GPS collar", release = "release site", note = "ranchers check the map like the weather", wanderer = "hundreds of miles", n = 7 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const T = Math.max(60, durationInFrames - 30);
  const ox = 820, oy = 600;
  const tracks = Array.from({ length: n }).map((_, i) => {
    const far = i === 0; const steps = far ? 60 : 26;
    let x = ox, y = oy; const pts: [number, number][] = [[x, y]];
    const dir = far ? -Math.PI / 2.6 : rnd(i * 5) * Math.PI * 2;
    for (let k = 1; k < steps; k++) { const a = dir + (rnd(i * 31 + k) - 0.5) * 1.6; const st = far ? 26 : 12 + rnd(i + k) * 10; x += Math.cos(a) * st; y += Math.sin(a) * st; pts.push([x, y]); }
    return { pts, far };
  });
  return (
    <AbsoluteFill style={{ background: "#0E1A14", overflow: "hidden" }}>
      {/* curvas de nivel */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `scale(${1.04 + f * 0.0004})` }}>
        {Array.from({ length: 16 }).map((_, i) => <ellipse key={i} cx={760 + rnd(i) * 300} cy={560 + rnd(i + 3) * 120} rx={120 + i * 70} ry={70 + i * 42} fill="none" stroke="rgba(160,200,170,0.13)" strokeWidth={2} transform={`rotate(${-12 + rnd(i * 2) * 10} 960 540)`} />)}
        {tracks.map((t, i) => {
          const k = Math.floor(interpolate(f, [10, T], [1, t.pts.length], cl));
          const d = "M" + t.pts.slice(0, k).map((p) => p.join(" ")).join(" L ");
          const head = t.pts[k - 1];
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={t.far ? HK.orange : HK.gold} strokeWidth={t.far ? 5 : 3} strokeDasharray={t.far ? "0" : "8 6"} opacity={0.9} />
              <circle cx={head[0]} cy={head[1]} r={t.far ? 12 : 8} fill={t.far ? HK.orange : HK.gold} />
              <circle cx={head[0]} cy={head[1]} r={(t.far ? 12 : 8) + ((f + i * 7) % 30)} fill="none" stroke={t.far ? HK.orange : HK.gold} opacity={1 - ((f + i * 7) % 30) / 30} />
            </g>
          );
        })}
        <circle cx={ox} cy={oy} r={22} fill="none" stroke={HK.bone} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: ox + 30, top: oy + 20, fontFamily: MONO, fontSize: 28, color: HK.bone }}>{release}</div>
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: MONO, fontSize: 30, color: "#cfe3d4", letterSpacing: 2 }}>● GPS  {title}</div>
      <div style={{ position: "absolute", right: 80, top: 160, fontFamily: HAND, fontSize: 56, color: HK.orange, opacity: interpolate(f, [T * 0.6, T * 0.6 + 15], [0, 1], cl) }}>{wanderer} →</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: HAND, fontSize: 52, color: HK.bone }}>{note}</div>
      <Grain o={0.2} />
    </AbsoluteFill>
  );
};

// ── fladry ──────────────────────────────────────────────────────────────────────────────────────────────────────
const Wolf: React.FC<{ w: number; flip?: boolean }> = ({ w, flip }) => (
  <svg width={w} height={w * 0.55} viewBox="0 0 200 110" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
    <path d="M44 48 C 22 48, 8 64, 2 86 C 18 80, 32 68, 48 60 Z" fill="#2a2a28" />
    <ellipse cx={90} cy={54} rx={52} ry={19} fill="#2a2a28" />
    <path d="M124 46 L 146 34 L 150 16 L 158 30 L 164 18 L 168 34 L 196 46 L 194 52 L 172 54 L 152 64 L 130 66 Z" fill="#2a2a28" />
    {[50, 62, 118, 132].map((x, i) => <path key={i} d={`M${x} 60 L ${x + 8} 60 L ${x + 6 + (i % 2) * 3} 106 L ${x - 1 + (i % 2) * 3} 106 Z`} fill="#2a2a28" />)}
  </svg>
);
export const HkFladry: React.FC<{ title?: string; tools?: string[]; caption?: string; bed?: string }> = ({ title = "fladry", tools = ["range riders", "guard dogs", "haul away dead stock"], caption = "works best for a while", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const wx = interpolate(f, [10, 60], [1950, 1280], cl) + interpolate(f, [72, 130], [0, 380], cl);
  const turned = f > 68;
  return (
    <AbsoluteFill>
      {bed ? <Img src={staticFile(bed)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(4px) brightness(0.75)" }} /> : <AbsoluteFill style={{ background: "linear-gradient(#c9d6e0 0%, #e8e2cf 45%, #b7a36e 46%, #8f7e4c 100%)" }} />}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.3))" }} />
      <Title t={title} dark />
      {/* postes y soga con banderas que flamean */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={120 + i * 180} y={560 + i * 30} width={12} height={240 - i * 14} fill="#4a3826" />)}
        <path d={`M126 600 ${Array.from({ length: 7 }).map((_, i) => `L ${126 + i * 180} ${600 + i * 30 + 6 * Math.sin(i)}`).join(" ")}`} fill="none" stroke="#e8e0cc" strokeWidth={4} />
        {Array.from({ length: 30 }).map((_, i) => {
          const x = 140 + i * 37; const y = 600 + (i * 37 / 180) * 30; const flap = Math.sin(f / 4 + i * 0.9) * 18;
          return <path key={i} d={`M${x} ${y} L ${x + 6 + flap * 0.4} ${y + 56} L ${x + 22 + flap} ${y + 50} L ${x + 16} ${y} Z`} fill={i % 2 ? "#E8432E" : HK.orange} opacity={0.95} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: wx, top: 690, filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.4))" }}><Wolf w={300} flip={!turned} /></div>
      {/* las otras herramientas */}
      <div style={{ position: "absolute", right: 80, top: 170, width: 520 }}>
        {tools.map((t, i) => { const k = spring({ frame: f - 90 - i * 18, fps, config: { damping: 14 } }); return <div key={t} style={{ marginBottom: 18, padding: "16px 24px", background: "rgba(241,235,221,0.95)", borderLeft: `10px solid ${HK.orange}`, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: HK.ink, textTransform: "uppercase", opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>+ {t}</div>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontFamily: HAND, fontSize: 54, color: HK.bone, opacity: interpolate(f, [100, 115], [0, 1], cl) }}>{caption}</div>
      <Grain o={0.18} />
    </AbsoluteFill>
  );
};
