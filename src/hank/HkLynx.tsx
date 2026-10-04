// Kit del video hanklynx (4 linces soltados en secreto en las Highlands). Tres piezas con profundidad (papel/
// terreno + plano medio + grano al frente), en el idioma de Hank (libreta de campo, musgo, naranja de acento):
//   HkHighlandMap — silueta de Escocia, el Parque Cairngorms resaltado, el pin de Kingussie y cuatro puntos que
//                   aparecen y después quedan marcados como atrapados
//   HkFourCaught  — cuatro siluetas de lince en fila; cada una recibe su red/sello de "caught"; una queda gris
//   HkGoneSince   — tarjetas de los animales que Gran Bretaña perdió (lince, lobo, oso, castor, gato montés) con
//                   cuánto hace; el castor y el gato montés se dan vuelta: volvieron (uno ilegal, otro legal)
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

// silueta muy simplificada de Escocia (coordenadas propias)
const SCOT = "M760 180 C 800 150, 860 160, 880 200 C 930 190, 960 230, 940 270 C 990 300, 1010 360, 980 400 C 1040 430, 1060 500, 1020 540 C 1060 600, 1040 680, 980 700 C 1000 760, 960 820, 900 830 C 870 880, 800 900, 760 870 C 720 900, 660 880, 650 830 C 600 810, 590 760, 620 720 C 570 690, 560 630, 600 600 C 560 560, 570 500, 620 480 C 590 440, 600 390, 650 370 C 630 330, 650 280, 700 270 C 690 230, 720 190, 760 180 Z";

export const HkHighlandMap: React.FC<{ title?: string; park?: string; town?: string; dots?: number; caught?: string; note?: string }> = ({ title = "the Scottish Highlands", park = "Cairngorms National Park", town = "Kingussie", dots = 4, caught = "all 4 caught within days", note = "" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const mapIn = spring({ frame: f - 4, fps, config: { damping: 18 } });
  const parkIn = interpolate(f, [20, 40], [0, 1], cl);
  const tx = 1080, ty = 545; // Kingussie
  return (
    <AbsoluteFill>
      <Paper />
      <Title t={title} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: mapIn }}>
        {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={1150 + rnd(i) * 200} cy={420 + rnd(i + 2) * 120} rx={60 + i * 34} ry={40 + i * 22} fill="none" stroke="rgba(47,74,44,0.18)" strokeWidth={2} />)}
        <path d="M640 760 C 820 640, 1020 560, 1260 460 C 1400 400, 1540 360, 1700 300" fill="none" stroke="#6a9ec4" strokeWidth={16} strokeLinecap="round" />
        <path d="M560 820 C 760 700, 980 610, 1220 520 C 1380 460, 1520 420, 1760 380" fill="none" stroke={HK.ink} strokeWidth={6} strokeDasharray="22 14" />
        <path d="M900 300 C 1100 240, 1500 260, 1640 380 C 1700 520, 1600 700, 1300 760 C 1050 790, 880 700, 860 560 C 850 440, 860 340, 900 300 Z" fill={HK.moss} opacity={0.18 * parkIn} stroke={HK.moss} strokeWidth={5} strokeDasharray="14 10" />
        {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${1080 + rnd(i) * 460} ${470 + rnd(i + 5) * 220} l 22 -36 l 22 36 z`} fill={HK.bone} stroke={HK.ink} strokeWidth={2.5} opacity={parkIn} />)}
        <circle cx={1380} cy={392} r={14} fill={HK.ink} opacity={parkIn} />
      </svg>
      <div style={{ position: "absolute", left: 1404, top: 360, fontFamily: MONO, fontSize: 30, fontWeight: 700, color: HK.ink, opacity: parkIn }}>Aviemore</div>
      <div style={{ position: "absolute", left: 600, top: 650, fontFamily: HAND, fontSize: 42, color: "#4f7fa6", opacity: parkIn, transform: "rotate(-24deg)" }}>River Spey</div>
      <div style={{ position: "absolute", left: 560, top: 860, fontFamily: MONO, fontSize: 28, color: HK.ink, opacity: parkIn }}>A9 road</div>
      <div style={{ position: "absolute", left: 1220, top: 790, fontFamily: HAND, fontSize: 52, color: HK.moss, opacity: parkIn }}>{park}</div>
      {/* pin del pueblo */}
      <div style={{ position: "absolute", left: tx - 14, top: ty - 14, width: 28, height: 28, borderRadius: 14, background: HK.ink, opacity: parkIn }} />
      <div style={{ position: "absolute", left: tx - 240, top: ty + 20, width: 220, textAlign: "right", fontFamily: MONO, fontSize: 32, fontWeight: 700, color: HK.ink, opacity: parkIn }}>{town}</div>
      {/* los cuatro puntos */}
      {Array.from({ length: dots }).map((_, i) => {
        const at = 50 + i * 12; const k = spring({ frame: f - at, fps, config: { damping: 10 } });
        const gx = tx + 40 + Math.cos(i * 1.7) * (60 + i * 18), gy = ty - 30 + Math.sin(i * 1.7) * (50 + i * 12);
        const got = f > 110 + i * 14; const g = spring({ frame: f - 110 - i * 14, fps, config: { damping: 12 } });
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: gx - 18, top: gy - 18, width: 36, height: 36, borderRadius: 18, background: HK.orange, transform: `scale(${k})`, boxShadow: `0 0 0 ${10 + ((f + i * 5) % 20)}px rgba(255,122,26,${0.3 * (1 - ((f + i * 5) % 20) / 20)})` }} />
            {got ? <div style={{ position: "absolute", left: gx - 26, top: gy - 34, fontFamily: SANS, fontWeight: 700, fontSize: 60, color: HK.red, transform: `scale(${g})` }}>✕</div> : null}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 120, top: 200, fontFamily: SANS, fontWeight: 700, fontSize: 52, color: HK.red, textTransform: "uppercase", opacity: interpolate(f, [170, 185], [0, 1], cl) }}>{caught}</div>
      {note ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: HAND, fontSize: 52, color: HK.ink }}>{note}</div> : null}
      <Grain o={0.18} />
    </AbsoluteFill>
  );
};

// ── los cuatro atrapados ───────────────────────────────────────────────────────────────────────────────────────
const LynxSil: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 220 136">
    <path d="M44 54 C 36 44, 34 36, 40 32 C 46 36, 48 44, 52 50 Z" fill={color} />
    <ellipse cx={100} cy={62} rx={54} ry={20} fill={color} />
    <path d="M140 52 C 148 40, 160 36, 170 38 L 168 22 L 172 14 L 176 28 L 186 30 L 190 14 L 194 22 L 192 36 C 202 44, 204 58, 196 66 C 186 76, 168 78, 154 72 Z" fill={color} />
    <path d="M190 64 C 198 70, 200 78, 194 84 L 186 74 Z M162 72 C 158 80, 160 86, 166 88 L 170 76 Z" fill={color} />
    <circle cx={182} cy={46} r={3} fill="#F1EBDD" />
    {[60, 76, 124, 140].map((x, i) => <path key={i} d={`M${x} 72 L ${x + 11} 72 L ${x + 10} 130 C ${x + 14} 132, ${x + 14} 135, ${x + 8} 135 L ${x - 2} 135 C ${x - 4} 132, ${x} 130, ${x + 1} 130 Z`} fill={color} />)}
  </svg>
);
export const HkFourCaught: React.FC<{ title?: string; labels?: string[]; lostIndex?: number; lostNote?: string; stamp?: string; bed?: string; every?: number }> = ({ title = "four lynx · a few days", labels = ["lynx 1", "lynx 2", "lynx 3", "lynx 4"], lostIndex = 3, lostNote = "died after capture", stamp = "caught", bed, every = 26 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {bed ? <Img src={staticFile(bed)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(5px) brightness(0.55)" }} /> : <AbsoluteFill style={{ background: HK.bayou }} />}
      <Title t={title} dark />
      {labels.map((l, i) => {
        const x = 140 + i * 430; const inK = spring({ frame: f - 8 - i * 6, fps, config: { damping: 14 } });
        const at = 40 + i * every; const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 200 } });
        const lost = i === lostIndex && f > at + 40;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 330, width: 380, height: 460, opacity: inK, transform: `translateY(${(1 - inK) * 40}px)` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "rgba(241,235,221,0.95)", boxShadow: "0 24px 40px rgba(0,0,0,0.4)" }} />
            <div style={{ position: "absolute", left: 30, top: 60, filter: lost ? "grayscale(1) opacity(0.45)" : undefined }}><LynxSil w={320} color={lost ? "#777" : "#7a5a3a"} /></div>
            {/* red de captura */}
            <svg width={380} height={300} style={{ position: "absolute", left: 0, top: 20, opacity: interpolate(f - at, [0, 6], [0, 0.7], cl) }}>
              {Array.from({ length: 9 }).map((_, k) => <line key={`a${k}`} x1={20 + k * 42} y1={20} x2={-60 + k * 42} y2={280} stroke={HK.ink} strokeWidth={2} />)}
              {Array.from({ length: 9 }).map((_, k) => <line key={`b${k}`} x1={-20 + k * 42} y1={20} x2={60 + k * 42} y2={280} stroke={HK.ink} strokeWidth={2} />)}
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: MONO, fontSize: 34, fontWeight: 700, color: HK.ink }}>{l}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center" }}>
              <span style={{ display: "inline-block", padding: "6px 18px", border: `5px solid ${HK.red}`, borderRadius: 8, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: HK.red, textTransform: "uppercase", transform: `rotate(-6deg) scale(${interpolate(s, [0, 1], [1.8, 1])})`, opacity: interpolate(f - at, [0, 3], [0, 1], cl) }}>{stamp}</span>
            </div>
            {lost ? <div style={{ position: "absolute", left: 0, right: 0, top: 412, textAlign: "center", fontFamily: HAND, fontSize: 38, color: HK.ink }}>{lostNote}</div> : null}
          </div>
        );
      })}
      <Grain o={0.2} />
    </AbsoluteFill>
  );
};

// ── los que se fueron ──────────────────────────────────────────────────────────────────────────────────────────
export const HkGoneSince: React.FC<{ title?: string; items: { name: string; gone: string; back?: string; good?: boolean }[]; every?: number }> = ({ title = "what Britain lost", items, every = 26 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const n = items.length; const w = 1680 / n;
  return (
    <AbsoluteFill>
      <Paper />
      <Title t={title} />
      {items.map((it, i) => {
        const k = spring({ frame: f - 10 - i * every, fps, config: { damping: 14 } });
        const flip = it.back ? spring({ frame: f - 30 - n * every - i * 10, fps, config: { damping: 14 } }) : 0;
        const x = 120 + i * w;
        return (
          <div key={i} style={{ position: "absolute", left: x + 14, top: 260, width: w - 28, height: 520, perspective: 1200, opacity: k, transform: `translateY(${(1 - k) * 60}px)` }}>
            <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg)` }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 16, background: "#e9e2d0", border: `4px solid ${HK.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: HK.ink, textTransform: "uppercase" }}>{it.name}</div>
                <div style={{ width: "60%", height: 4, background: HK.ink }} />
                <div style={{ fontFamily: MONO, fontSize: 26, color: HK.ink }}>gone</div>
                <div style={{ fontFamily: HAND, fontSize: 48, color: HK.red, textAlign: "center", padding: "0 12px" }}>{it.gone}</div>
              </div>
              {it.back ? (
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 16, background: it.good ? HK.moss : HK.orange, border: `4px solid ${HK.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: HK.bone, textTransform: "uppercase" }}>{it.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 26, color: HK.bone }}>back</div>
                  <div style={{ fontFamily: HAND, fontSize: 44, color: HK.bone, textAlign: "center", padding: "0 12px" }}>{it.back}</div>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      <Grain o={0.16} />
    </AbsoluteFill>
  );
};
