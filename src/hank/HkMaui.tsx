// Kit del video hankaxis (ciervos axis en Maui). Cuatro piezas con profundidad (fondo + plano medio + capa de
// grano/partículas al frente), en el idioma de Hank (libreta de campo, musgo, naranja de acento):
//   HkIslandHop     — mapa de las islas: el salto de los ciervos (1867 Molokai → Lanai → 1959 Maui → Big Island)
//   HkThermalCount  — vista de cámara térmica nocturna: aparecen manchas blancas (ciervos) y el contador sube
//   HkFenceSplit    — la misma ladera partida por un cerco: verde adentro, tierra pelada afuera
//   HkRunoff        — corte de la montaña al arrecife: lluvia, barro rojo bajando, el agua del arrecife se enturbia
// Textos SIEMPRE por props.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HK, HAND, MONO, SANS, rnd } from "./theme";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const Grain: React.FC<{ o?: number }> = ({ o = 0.2 }) => {
  const f = useCurrentFrame();
  return <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o }} />;
};
export const Paper: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: HK.bone, backgroundImage: "radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.7), transparent 55%), radial-gradient(ellipse at 85% 90%, rgba(107,74,43,0.18), transparent 50%), repeating-linear-gradient(0deg, rgba(47,74,44,0.06) 0 2px, transparent 2px 46px)" }} />
);

// siluetas simples de las islas (coordenadas propias de 1920x1080, no a escala)
const CARD: Record<string, [number, number]> = { Molokai: [430, 150], Lanai: [250, 560], Maui: [1150, 210], "Big Island": [960, 760] };
const ISLANDS: Record<string, { d: string; lx: number; ly: number }> = {
  Molokai: { d: "M520 330 C 600 300, 760 300, 820 330 C 800 360, 640 370, 520 360 Z", lx: 670, ly: 300 },
  Lanai: { d: "M590 450 C 630 420, 690 430, 700 470 C 680 510, 610 510, 590 480 Z", lx: 645, ly: 540 },
  Maui: { d: "M900 380 C 960 330, 1060 350, 1080 420 C 1140 400, 1230 430, 1240 500 C 1200 580, 1080 580, 1040 520 C 980 540, 900 500, 900 440 Z", lx: 1070, ly: 610 },
  "Big Island": { d: "M1340 600 C 1440 540, 1600 580, 1640 700 C 1660 830, 1560 940, 1440 920 C 1350 880, 1300 740, 1340 600 Z", lx: 1490, ly: 980 },
};
export const HkIslandHop: React.FC<{ stops: { island: string; year: string; note: string; alert?: boolean }[]; title?: string; every?: number }> = ({ stops, title = "how the deer got here", every = 40 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#16343A" }}>
      <AbsoluteFill style={{ transform: `scale(${1.04 + f * 0.0004})`, backgroundImage: "repeating-radial-gradient(circle at 60% 55%, rgba(255,255,255,0.035) 0 2px, transparent 2px 60px)" }} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 60, color: HK.bone, letterSpacing: 3, textTransform: "uppercase" }}>{title}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Object.entries(ISLANDS).map(([k, v]) => {
          const idx = stops.findIndex((s) => s.island === k); const on = idx >= 0 && f > 10 + idx * every;
          const alert = idx >= 0 && stops[idx].alert;
          return <path key={k} d={v.d} fill={on ? (alert ? "#6E2B2B" : "#4D6B3C") : "#2C4A3E"} stroke={HK.bone} strokeOpacity={0.6} strokeWidth={3} />;
        })}
        {stops.slice(1).map((s, i) => {
          const a = ISLANDS[stops[i].island], b = ISLANDS[s.island]; if (!a || !b) return null;
          const t = interpolate(f, [10 + (i + 1) * every - 18, 10 + (i + 1) * every], [0, 1], cl);
          const x1 = a.lx, y1 = a.ly + 30, x2 = b.lx, y2 = b.ly - 60, mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 120;
          return <path key={i} d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} stroke={s.alert ? HK.red : HK.orange} strokeWidth={6} strokeDasharray="16 12" fill="none" pathLength={1} style={{ strokeDasharray: `${t} 1` }} />;
        })}
      </svg>
      {stops.map((s, i) => {
        const v = ISLANDS[s.island]; if (!v) return null;
        const k = spring({ frame: f - (10 + i * every), fps, config: { damping: 13 } });
        return (
          <div key={i} style={{ position: "absolute", left: (CARD[s.island] || [v.lx - 170, v.ly - 150])[0], top: (CARD[s.island] || [v.lx - 170, v.ly - 150])[1], width: 340, transform: `scale(${k}) rotate(${i % 2 ? 2 : -2}deg)`, opacity: k, background: HK.bone, padding: "14px 18px", borderRadius: 10, boxShadow: "0 18px 30px rgba(0,0,0,0.45)", borderTop: `8px solid ${s.alert ? HK.red : HK.orange}` }}>
            <div style={{ fontFamily: MONO, fontSize: 30, color: s.alert ? HK.red : HK.moss, fontWeight: 700 }}>{s.year} · {s.island}</div>
            <div style={{ fontFamily: HAND, fontSize: 36, color: HK.ink, lineHeight: 1.05 }}>{s.note}</div>
          </div>
        );
      })}
      <Grain o={0.18} />
    </AbsoluteFill>
  );
};

export const HkThermalCount: React.FC<{ label?: string; to?: number; unit?: string; caption?: string }> = ({ label = "THERMAL · NIGHT SURVEY", to = 240, unit = "deer in view", caption = "every white glow is a deer" }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const n = Math.round(interpolate(f, [10, Math.max(40, durationInFrames - 20)], [0, to], cl));
  const blobs = Array.from({ length: 70 }).map((_, i) => ({ x: 80 + rnd(i * 3.1) * 1760, y: 380 + rnd(i * 7.7) * 640, s: 10 + rnd(i * 1.9) * 16, at: 10 + rnd(i * 4.3) * Math.max(30, durationInFrames - 40) }));
  return (
    <AbsoluteFill style={{ background: "#07080A", overflow: "hidden" }}>
      {/* ladera en tonos fríos de térmica */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `translateX(${-f * 0.6}px) scale(1.06)` }}>
        <defs><linearGradient id="hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B1F3A" /><stop offset="1" stopColor="#2A1844" /></linearGradient></defs>
        <path d="M0 420 C 300 340, 700 300, 1000 360 C 1300 420, 1600 330, 2000 380 L 2000 1080 L 0 1080 Z" fill="url(#hill)" />
        {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={rnd(i + 9) * 2000} cy={420 + rnd(i + 2) * 640} r={30 + rnd(i) * 60} fill="#3A1E52" opacity={0.6} />)}
      </svg>
      {blobs.map((b, i) => {
        const o = interpolate(f, [b.at, b.at + 8], [0, 1], cl);
        return <div key={i} style={{ position: "absolute", left: b.x - f * 0.6, top: b.y, width: b.s * 2.2, height: b.s, borderRadius: "50%", background: "radial-gradient(ellipse, #FFFFFF 0%, #FFE9A8 35%, #FF8A3D 65%, transparent 72%)", opacity: o, filter: "blur(1px)" }} />;
      })}
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 4px)" }} />
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: MONO, fontSize: 30, color: "#E8E8E8", letterSpacing: 2 }}>● REC  {label}</div>
      <div style={{ position: "absolute", right: 70, top: 40, textAlign: "right" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 130, color: HK.bone, lineHeight: 1 }}>{n.toLocaleString("en-US")}</div>
        <div style={{ fontFamily: MONO, fontSize: 30, color: HK.gold }}>{unit}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: HAND, fontSize: 52, color: HK.bone }}>{caption}</div>
      <div style={{ position: "absolute", left: 900, top: 480, width: 120, height: 120, border: "3px solid rgba(255,255,255,0.6)" }} />
      <Grain o={0.25} />
    </AbsoluteFill>
  );
};

export const HkFenceSplit: React.FC<{ inside?: string; outside?: string; title?: string; bgIn?: string; bgOut?: string }> = ({ inside = "inside the fence", outside = "outside", title = "same mountain, one fence", bgIn, bgOut }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [8, 60], [0, 1], cl);
  const grow = interpolate(f, [40, 140], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: HK.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
        {bgIn ? <Img src={staticFile(bgIn)} style={{ width: 1920, height: 1080, objectFit: "cover", transform: `scale(${1.05 + f * 0.0004})` }} /> : <div style={{ width: "100%", height: "100%", background: "linear-gradient(#5E8C4E, #2F4A2C)" }} />}
        {!bgIn && Array.from({ length: 26 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i * 2.3) * 860, bottom: 60 + rnd(i * 5.1) * 380, width: 14, height: 30 + 90 * grow * (0.5 + rnd(i)), background: "linear-gradient(#8BC46A, #3E6B30)", borderRadius: "50% 50% 4px 4px", transformOrigin: "bottom" }} />)}
      </div>
      <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
        {bgOut ? <Img src={staticFile(bgOut)} style={{ width: 1920, height: 1080, objectFit: "cover", marginLeft: -960, transform: `scale(${1.05 + f * 0.0004})` }} /> : <div style={{ width: "100%", height: "100%", background: "linear-gradient(#A4774C, #6B4A2B)" }} />}
        {!bgOut && Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 60 + rnd(i * 9.3) * 820, bottom: 80 + rnd(i * 3.7) * 400, fontFamily: SANS, fontSize: 34, color: "rgba(40,24,10,0.55)", transform: `rotate(${rnd(i) * 60 - 30}deg)` }}>⋀⋀</div>)}
      </div>
      {/* poste y alambre */}
      <div style={{ position: "absolute", left: 950, top: 1080 - draw * 1080, width: 20, height: 1080, background: "linear-gradient(90deg, #5a4630, #2e2318)" }} />
      {[300, 520, 740].map((y, i) => <div key={i} style={{ position: "absolute", left: 960 - 2, top: y, width: 4, height: 2, boxShadow: `0 0 0 ${draw > 0.99 ? 0 : 0}px` }} />)}
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 58, color: HK.bone, textShadow: "0 4px 14px rgba(0,0,0,0.7)", textTransform: "uppercase", letterSpacing: 3 }}>{title}</div>
      <div style={{ position: "absolute", left: 120, bottom: 70, background: HK.bone, padding: "10px 22px", fontFamily: HAND, fontSize: 48, color: HK.moss, transform: "rotate(-2deg)", opacity: grow }}>{inside}</div>
      <div style={{ position: "absolute", right: 120, bottom: 70, background: HK.bone, padding: "10px 22px", fontFamily: HAND, fontSize: 48, color: HK.mud, transform: "rotate(2deg)", opacity: grow }}>{outside}</div>
      <Grain o={0.18} />
    </AbsoluteFill>
  );
};

export const HkRunoff: React.FC<{ title?: string; labels?: [string, string, string] }> = ({ title = "from the mountain to the reef", labels = ["bare hillside", "muddy stream", "the reef"] }) => {
  const f = useCurrentFrame();
  const rain = interpolate(f, [0, 30], [0, 1], cl);
  const mud = interpolate(f, [30, 120], [0, 1], cl);
  const murk = interpolate(f, [90, 170], [0, 0.75], cl);
  return (
    <AbsoluteFill style={{ background: "#9EC3D6" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* cielo con nubes y lluvia */}
        <rect width={1920} height={1080} fill="#B9D3DF" />
        {Array.from({ length: 5 }).map((_, i) => <ellipse key={i} cx={200 + i * 300 + Math.sin(f / 40 + i) * 20} cy={120 + (i % 2) * 40} rx={170} ry={55} fill="#8E9AA3" opacity={0.85} />)}
        {Array.from({ length: 120 }).map((_, i) => { const x = rnd(i) * 1500, y = (rnd(i * 3) * 600 + f * 18) % 600 + 150; return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 22} stroke="#5E7C8C" strokeWidth={2} opacity={rain * 0.7} />; })}
        {/* montaña pelada (roja) */}
        <path d="M0 1080 L 0 380 C 200 300, 420 260, 640 420 C 780 520, 900 640, 1080 760 L 1180 1080 Z" fill="#A0522D" />
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${80 + i * 60} ${420 + i * 25} q 20 -10 40 0`} stroke="#7A3B1F" strokeWidth={4} fill="none" />)}
        {/* arroyo de barro */}
        <path d="M600 420 C 700 560, 860 650, 1000 760 C 1080 820, 1140 880, 1200 940" stroke={`rgba(150,80,40,${0.3 + 0.7 * mud})`} strokeWidth={30} fill="none" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${mud} 1` }} />
        {/* mar y arrecife */}
        <rect x={1080} y={760} width={840} height={320} fill="#2E8CA8" />
        {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={1180 + i * 45} cy={1000 + (i % 3) * 22} r={18 + (i % 4) * 6} fill={["#F2A65A", "#E76F51", "#F4D35E", "#9BC53D"][i % 4]} opacity={1 - murk * 0.6} />)}
        <rect x={1080} y={760} width={840} height={320} fill={`rgba(140,85,45,${murk})`} />
        <ellipse cx={1200 + mud * 300} cy={800} rx={120 + mud * 260} ry={40 + mud * 50} fill="rgba(150,90,50,0.55)" opacity={mud} />
      </svg>
      {labels.map((l, i) => <div key={i} style={{ position: "absolute", left: [180, 760, 1460][i], top: [300, 560, 700][i], background: HK.bone, padding: "8px 18px", fontFamily: HAND, fontSize: 44, color: HK.ink, transform: `rotate(${i % 2 ? 2 : -2}deg)`, opacity: interpolate(f, [20 + i * 40, 30 + i * 40], [0, 1], cl), boxShadow: "0 8px 16px rgba(0,0,0,0.3)" }}>{l}</div>)}
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 58, color: HK.ink, textTransform: "uppercase", letterSpacing: 3 }}>{title}</div>
      <Grain o={0.15} />
    </AbsoluteFill>
  );
};
