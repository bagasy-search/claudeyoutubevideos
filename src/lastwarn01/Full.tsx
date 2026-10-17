// lastwarn01 · Last Warning Earth — "The 1877 El Niño Killed Millions — This Year's Is Now Just as Strong"
// Documental narrado, sin avatar. Plan (planos + gráficos) en plan.json, generado por D:/rtmp/prueba11/lastwarn01/plan.py.
import React from "react";
import {
  AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img, OffthreadVideo, staticFile, Easing,
} from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import PLAN from "./plan.json";

const { fontFamily: OSW } = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });
const { fontFamily: INT } = loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });
const { fontFamily: SER } = loadSerif("normal", { weights: ["700", "900"], subsets: ["latin"] });

const FPS = 30;
const C = { ink: "#070b14", ink2: "#0d1626", red: "#ff3b2f", amber: "#ffb020", white: "#f4f1ea", cold: "#4fa3d1", gray: "#8a93a3" };
const P = (f: string) => staticFile(`lastwarn01/${f}`);
type Shot = any;
export const TOTAL_S: number = (PLAN as any).end;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── tiempo: segundos absolutos del video dentro de un plano
const useT = (shot: Shot) => shot.a + useCurrentFrame() / FPS;
const appear = (t: number, at: number | null | undefined, dur = 0.5) =>
  at == null ? 1 : interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: ease });

// ── fuentes de imagen/clip
const isClip = (n: string) => n.startsWith("px") || n.startsWith("vd_");
const CLIPS: Record<string, number> = (PLAN as any).clips || {}; // nombre -> duración (s) de los clips (px, vd, y agnes c/)
const AICLIP: Record<string, number> = (PLAN as any).aiclips || {};

const KB: React.FC<{ src: string; dur: number; i: number; dim?: number }> = ({ src, dur, i, dim = 1 }) => {
  const f = useCurrentFrame();
  const p = Math.min(1, f / (dur * FPS));
  const dir = i % 4;
  const s = 1.06 + 0.1 * (dir % 2 === 0 ? p : 1 - p);
  const x = (dir < 2 ? -1 : 1) * 22 * (p - 0.5);
  const y = (dir % 3 === 0 ? 1 : -1) * 12 * (p - 0.5);
  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: dim < 1 ? `brightness(${dim})` : undefined }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s}) translate(${x}px, ${y}px)` }} />
    </AbsoluteFill>
  );
};

const Vid: React.FC<{ src: string; dur: number; clipDur: number; dim?: number; i: number }> = ({ src, dur, clipDur, dim = 1, i }) => {
  const f = useCurrentFrame();
  const rate = Math.max(0.45, Math.min(1, (clipDur - 0.15) / dur));
  const p = Math.min(1, f / (dur * FPS));
  const s = 1.02 + 0.05 * (i % 2 ? p : 1 - p);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.ink, filter: dim < 1 ? `brightness(${dim})` : undefined }}>
      <OffthreadVideo src={src} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
    </AbsoluteFill>
  );
};

// foto IA: si agnes la animó usa el clip (y la foto debajo como respaldo cuando el clip termina)
const AIShot: React.FC<{ name: string; dur: number; i: number; dim?: number }> = ({ name, dur, i, dim }) => {
  const cd = AICLIP[name];
  return (
    <AbsoluteFill>
      <KB src={P(`p/${name}.jpg`)} dur={dur} i={i} dim={dim} />
      {cd ? (
        <Sequence durationInFrames={Math.round(Math.min(dur, cd / 0.45 - 0.1) * FPS)}>
          <Vid src={P(`c/${name}.mp4`)} dur={dur} clipDur={cd} i={i} dim={dim} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

const Bed: React.FC<{ name: string; dur: number; i: number; dim?: number }> = ({ name, dur, i, dim = 0.42 }) => {
  if (isClip(name)) return <Vid src={P(`v/${name}.mp4`)} dur={dur} clipDur={CLIPS[name] || 8} dim={dim} i={i} />;
  if (name.startsWith("ar_")) return <KB src={P(`ar/${name}.jpg`)} dur={dur} i={i} dim={dim} />;
  return <AIShot name={name} dur={dur} i={i} dim={dim} />;
};

// archivo real: la foto entera (contain) sobre su propia versión desenfocada
const Archive: React.FC<{ name: string; dur: number; i: number; full?: boolean }> = ({ name, dur, i, full }) => {
  const f = useCurrentFrame();
  const p = Math.min(1, f / (dur * FPS));
  if (full) return <KB src={P(`ar/${name}.jpg`)} dur={dur} i={i} />;
  const s = 1 + 0.06 * p;
  const x = (i % 2 ? 1 : -1) * 18 * (p - 0.5);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <Img src={P(`ar/${name}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(0.35)", transform: "scale(1.15)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img src={P(`ar/${name}.jpg`)} style={{ maxWidth: "84%", maxHeight: "86%", objectFit: "contain", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", border: "6px solid #e9e2d0", transform: `scale(${s}) translateX(${x}px)` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Tag: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [8, 20, dur * FPS - 10, dur * FPS], [0, 1, 1, 0], clamp);
  const x = interpolate(f, [8, 26], [-30, 0], { ...clamp, easing: ease });
  return (
    <div style={{ position: "absolute", left: 70, bottom: 70, opacity: o, transform: `translateX(${x}px)`, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 8, height: 46, background: C.red }} />
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: C.white, background: "rgba(7,11,20,0.72)", padding: "8px 18px" }}>{text}</div>
    </div>
  );
};

const SubChip: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [10, 22, dur * FPS - 12, dur * FPS], [0, 1, 1, 0], clamp);
  const pulse = 1 + 0.03 * Math.sin(f / 5);
  return (
    <div style={{ position: "absolute", right: 80, bottom: 90, opacity: o, transform: `scale(${pulse})`, display: "flex", alignItems: "center", gap: 18, background: C.red, padding: "18px 34px", borderRadius: 999, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ width: 0, height: 0, borderLeft: "22px solid white", borderTop: "14px solid transparent", borderBottom: "14px solid transparent" }} />
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 40, color: "white", letterSpacing: 2 }}>SUBSCRIBE · WE'RE TRACKING THIS EL NIÑO</div>
    </div>
  );
};

// ── gráficos ──────────────────────────────────────────────────────────────
const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", ...style }}>{children}</AbsoluteFill>
);
const Kicker: React.FC<{ text: string; o?: number; color?: string; size?: number }> = ({ text, o = 1, color = C.red, size = 34 }) => (
  <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: size, letterSpacing: 6, color, opacity: o, marginTop: 18 }}>{text}</div>
);

const BigCount: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const p = interpolate(t, [s.a + 0.2, s.a + 1.8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const n = Math.round(s.n * p).toLocaleString("en-US");
  return (
    <Center>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 210, color: C.white, letterSpacing: 4, textShadow: "0 10px 60px rgba(0,0,0,0.8)" }}>{n}</div>
      <Kicker text={s.sub} o={appear(t, s.a + 1.2)} size={44} />
    </Center>
  );
};

const YearStamp: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const k = appear(t, s.a + 0.1, 0.7);
  const long = String(s.y).length > 6;
  return (
    <Center>
      <div style={{ fontFamily: long ? OSW : SER, fontWeight: long ? 700 : 900, fontSize: long ? 170 : 300, color: C.white, opacity: k, transform: `scale(${1.15 - 0.15 * k})`, letterSpacing: long ? 8 : 0, lineHeight: 1 }}>{s.y}</div>
      <div style={{ width: 520 * appear(t, s.a + 0.6, 0.8), height: 8, background: C.red, marginTop: 26 }} />
      {s.sub ? <Kicker text={s.sub} o={appear(t, s.a + 0.9)} size={38} color={C.white} /> : null}
    </Center>
  );
};

const BigNumber: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const k = appear(t, s.a + 0.15, 0.6);
  return (
    <Center>
      <Kicker text={s.sub} o={appear(t, s.a + 0.05)} color={C.white} size={36} />
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 260, color: C.red, opacity: k, transform: `scale(${1.2 - 0.2 * k})`, textShadow: "0 0 60px rgba(255,59,47,0.45)", lineHeight: 1.1 }}>{s.v}</div>
      {s.sub2 ? <Kicker text={s.sub2} o={appear(t, s.a + 1.0)} color={C.amber} size={40} /> : null}
      {s.src ? <div style={{ fontFamily: INT, fontSize: 24, color: C.gray, marginTop: 22, opacity: appear(t, s.a + 1.2) }}>{s.src}</div> : null}
    </Center>
  );
};

const NotList: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  return (
    <Center>
      <Kicker text="THE HIGHEST READING EVER FOR THIS TIME OF YEAR" color={C.white} size={36} />
      <div style={{ display: "flex", gap: 90, marginTop: 50 }}>
        {s.items.map(([label, at]: any, j: number) => {
          const o = appear(t, at, 0.3);
          const x = appear(t, at + 0.35, 0.35);
          return (
            <div key={j} style={{ position: "relative", opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
              <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 170, color: label === "EVER" ? C.red : C.white }}>{label}</div>
              {label !== "EVER" ? <div style={{ position: "absolute", left: -10, top: "52%", height: 14, width: `${x * 105}%`, background: C.red, transform: "rotate(-8deg)" }} /> : null}
            </div>
          );
        })}
      </div>
    </Center>
  );
};

const Chapter: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  return (
    <Center>
      <Kicker text={s.n} o={appear(t, s.a)} size={40} />
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 130, color: C.white, letterSpacing: 6, opacity: appear(t, s.a + 0.15, 0.6), transform: `translateY(${(1 - appear(t, s.a + 0.15, 0.6)) * 30}px)` }}>{s.title}</div>
      <div style={{ width: 700 * appear(t, s.a + 0.4, 0.8), height: 6, background: C.red, marginTop: 20 }} />
    </Center>
  );
};

const Word: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const k = appear(t, s.a + 0.1, 0.8);
  const cjk = /[\u4e00-\u9fff]/.test(s.w);
  return (
    <Center>
      <div style={{ fontFamily: cjk ? "serif" : OSW, fontWeight: 700, fontSize: cjk ? 200 : 170, color: C.white, opacity: k, letterSpacing: (cjk ? 20 : 10) + 30 * (1 - k) }}>{s.w}</div>
      {s.sub ? <Kicker text={s.sub} o={appear(t, s.a + 0.7)} size={40} /> : null}
    </Center>
  );
};

const Quote: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const words = String(s.q).split(" ");
  const span = Math.min(2.2, (s.b - s.a) * 0.4);
  return (
    <Center style={{ padding: "0 180px" }}>
      <div style={{ fontFamily: SER, fontWeight: 700, fontSize: s.q2 ? 96 : 76, color: C.white, lineHeight: 1.25 }}>
        {words.map((w, j) => <span key={j} style={{ opacity: appear(t, s.a + 0.1 + (span * j) / words.length, 0.25) }}>{w} </span>)}
      </div>
      {s.q2 ? <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 96, color: C.red, marginTop: 30, opacity: appear(t, s.q2[1], 0.5) }}>{s.q2[0]}</div> : null}
      {s.src && s.src !== "Quote" ? <Kicker text={s.src} o={appear(t, s.a + span + 0.3)} size={30} color={C.amber} /> : null}
    </Center>
  );
};

const Dots: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 120 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 54px)", gap: 14 }}>
        {Array.from({ length: 100 }).map((_, j) => {
          const red = j >= 100 - s.p;
          const o = appear(t, s.a + 0.004 * j * 30 / 30 + j * 0.008, 0.2);
          const r = red ? appear(t, s.a + 1.4 + (j - (100 - s.p)) * 0.25, 0.3) : 0;
          return <div key={j} style={{ width: 54, height: 54, borderRadius: 27, opacity: o, background: r > 0 ? C.red : "#2a3445", transform: `scale(${1 + 0.25 * r * (1 - r) * 4})` }} />;
        })}
      </div>
      <div style={{ textAlign: "left", width: 620 }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 230, color: C.red, lineHeight: 1, opacity: appear(t, s.a + 1.6) }}>~{s.p}%</div>
        <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 48, color: C.white, letterSpacing: 3, opacity: appear(t, s.a + 2.0) }}>{s.sub}</div>
        <div style={{ fontFamily: INT, fontSize: 26, color: C.gray, marginTop: 16, opacity: appear(t, s.a + 2.3) }}>1876–1879 · ASIA, AFRICA AND SOUTH AMERICA</div>
      </div>
    </AbsoluteFill>
  );
};

const Bars: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const max = s.max || 4.5;
  const unit = s.unit || "°C";
  const head = s.head || "NIÑO 3.4 · PEAK WARMTH ABOVE NORMAL";
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, padding: "150px 170px", justifyContent: "center" }}>
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 40, letterSpacing: 5, color: C.gray, marginBottom: 60 }}>{head}</div>
      {s.bars.map(([label, v, at, approx]: any, j: number) => {
        const g = at == null || at <= s.a ? 1 : appear(t, at, 1.1);
        const is26 = String(label).startsWith("2026");
        const col = is26 ? C.red : String(label).startsWith("1877") ? C.amber : "#5b6578";
        return (
          <div key={j} style={{ display: "flex", alignItems: "center", marginBottom: 46, opacity: at == null || at <= s.a ? 1 : appear(t, at, 0.3) }}>
            <div style={{ width: 470, fontFamily: OSW, fontWeight: 500, fontSize: 40, color: C.white, letterSpacing: 2 }}>{label}</div>
            <div style={{ flex: 1, height: 74, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(v / max) * 100 * g}%`, background: col, borderRadius: 4, opacity: approx ? 0.85 : 1, backgroundImage: approx === "~" ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.0) 0 18px, rgba(255,255,255,0.18) 18px 26px)" : undefined }} />
              <div style={{ position: "absolute", left: `calc(${(v / max) * 100 * g}% + 22px)`, top: 4, whiteSpace: "nowrap", fontFamily: OSW, fontWeight: 700, fontSize: 54, color: col === "#5b6578" ? C.white : col }}>
                {unit === "°C" ? "+" : ""}{(v * g).toFixed(1)}{unit}{approx === "~" ? " est." : ""}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Odds: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const g = appear(t, s.a + 0.3, 1.8);
  const R = 220, L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 110 }}>
      <div style={{ position: "relative", width: 520, height: 520 }}>
        <svg width={520} height={520} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx={260} cy={260} r={R} stroke="#2a3445" strokeWidth={36} fill="rgba(7,11,20,0.6)" />
          <circle cx={260} cy={260} r={R} stroke={C.red} strokeWidth={36} fill="none" strokeDasharray={`${L * (s.p / 100) * g} ${L}`} strokeLinecap="round" />
        </svg>
        <Center><div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 170, color: C.white }}>{Math.round(s.p * g)}%</div></Center>
      </div>
      <div style={{ width: 760, textAlign: "left" }}>
        <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 52, color: C.white, lineHeight: 1.2, letterSpacing: 2, opacity: appear(t, s.a + 0.6) }}>{s.sub}</div>
        <div style={{ fontFamily: INT, fontWeight: 600, fontSize: 28, color: C.amber, marginTop: 28, opacity: appear(t, s.a + 1.2) }}>{s.src}</div>
      </div>
    </AbsoluteFill>
  );
};

const TwoYears: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const col = (y: any, at: number) => (
    <div style={{ textAlign: "center", opacity: appear(t, at), transform: `translateY(${(1 - appear(t, at)) * 40}px)` }}>
      <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 210, color: C.white, lineHeight: 1 }}>{y[0]}</div>
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 44, color: C.red, letterSpacing: 5, marginTop: 14 }}>✕ {y[1]}</div>
    </div>
  );
  return <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 180 }}>{col(s.y1, s.a + 0.1)}{col(s.y2, s.a + 0.7)}</AbsoluteFill>;
};

const Checklist: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  return (
    <AbsoluteFill style={{ padding: "130px 200px", justifyContent: "center" }}>
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 40, letterSpacing: 5, color: C.amber, marginBottom: 50, opacity: appear(t, s.a) }}>{s.head}</div>
      {s.items.map(([k, v, at]: any, j: number) => {
        const o = appear(t, at, 0.4);
        return (
          <div key={j} style={{ display: "flex", alignItems: "baseline", gap: 34, marginBottom: 34, opacity: Math.max(0.0, o), transform: `translateX(${(1 - o) * -40}px)` }}>
            <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 72, color: C.red, width: 60 }}>✕</div>
            <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 72, color: C.white, width: 430, letterSpacing: 3 }}>{k}</div>
            <div style={{ fontFamily: INT, fontWeight: 400, fontSize: 52, color: C.white, opacity: 0.85 }}>{v}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Watch3: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const L = ["THE PEAK", "THE INDIAN OCEAN", "THE YEAR AFTER"];
  return (
    <AbsoluteFill style={{ padding: "0 220px", justifyContent: "center" }}>
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 40, letterSpacing: 5, color: C.amber, marginBottom: 50 }}>WHAT TO WATCH · THE NEXT 90 DAYS</div>
      {L.map((l, j) => {
        const on = j === s.on, done = j < s.on;
        const o = s.on === 0 ? appear(t, s.a + 0.2 + j * 0.35) : 1;
        return (
          <div key={j} style={{ display: "flex", alignItems: "center", gap: 40, marginBottom: 30, opacity: o * (on ? 1 : 0.35) }}>
            <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 110, color: on ? C.red : C.white, width: 90 }}>{j + 1}</div>
            <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 90, color: C.white, letterSpacing: 4, textDecoration: done ? "line-through" : undefined }}>{l}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Next: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  return (
    <Center style={{ padding: "0 200px" }}>
      <Kicker text="NEXT ON LAST WARNING EARTH" o={appear(t, s.a)} size={40} />
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 92, color: C.white, lineHeight: 1.15, marginTop: 24, opacity: appear(t, s.a + 0.3, 0.7) }}>{s.title}</div>
    </Center>
  );
};

const End: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const f = useCurrentFrame();
  return (
    <Center>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 110, color: C.white, letterSpacing: 10, opacity: appear(t, s.a) }}>LAST WARNING EARTH</div>
      <div style={{ marginTop: 50, background: C.red, padding: "22px 60px", borderRadius: 999, fontFamily: OSW, fontWeight: 700, fontSize: 56, color: "white", letterSpacing: 4, opacity: appear(t, s.a + 0.4), transform: `scale(${1 + 0.03 * Math.sin(f / 6)})` }}>SUBSCRIBE</div>
    </Center>
  );
};

// ── mapa (equirectangular, mosaico de dos copias para cruzar el Pacífico) ──
const MAP_W = 6144, MAP_H = 3072;
const MAPCAL = (PLAN as any).mapcal || { lon0: -180, lon1: 180, lat0: 90, lat1: -90 };
const mx = (lon: number) => ((lon - MAPCAL.lon0) / (MAPCAL.lon1 - MAPCAL.lon0)) * MAP_W;
const my = (lat: number) => ((lat - MAPCAL.lat0) / (MAPCAL.lat1 - MAPCAL.lat0)) * MAP_H;

const MapView: React.FC<{ center: [number, number]; zoom: number; zoom0?: number; dur: number; children?: (proj: (lon: number, lat: number) => [number, number], sc: number) => React.ReactNode }> = ({ center, zoom, zoom0, dur, children }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, Math.min(dur, 2.5) * FPS], [zoom0 ?? zoom * 0.9, zoom], { ...clamp, easing: ease });
  const base = 1920 / MAP_W; // escala 1 = mundo entero a lo ancho
  const sc = base * z;
  let cx = mx(center[0]);
  const cy = my(center[1]);
  const tx = 960 - cx * sc, ty = 540 - cy * sc;
  const proj = (lon: number, lat: number): [number, number] => {
    let x = mx(lon) * sc + tx;
    while (x < -200) x += MAP_W * sc;
    while (x > 2120) x -= MAP_W * sc;
    return [x, my(lat) * sc + ty];
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1d33", overflow: "hidden" }}>
      {[-1, 0, 1].map((k) => (
        <Img key={k} src={P("ar/map.jpg")} style={{ position: "absolute", left: tx + k * MAP_W * sc, top: ty, width: MAP_W * sc, height: MAP_H * sc, filter: "brightness(0.62) saturate(0.85) contrast(1.05)" }} />
      ))}
      {children ? children(proj, sc) : null}
    </AbsoluteFill>
  );
};

const Marker: React.FC<{ x: number; y: number; label: string; sub?: string; color: string; o: number; side?: number }> = ({ x, y, label, sub, color, o, side = 1 }) => {
  const f = useCurrentFrame();
  const pr = (f % 45) / 45;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <div style={{ position: "absolute", left: -60 * pr, top: -60 * pr, width: 120 * pr, height: 120 * pr, borderRadius: "50%", border: `4px solid ${color}`, opacity: 1 - pr }} />
      <div style={{ position: "absolute", left: -14, top: -14, width: 28, height: 28, borderRadius: 14, background: color, boxShadow: `0 0 30px ${color}` }} />
      <div style={{ position: "absolute", left: side > 0 ? 34 : undefined, right: side < 0 ? 34 : undefined, top: -36, whiteSpace: "nowrap", textAlign: side > 0 ? "left" : "right" }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 44, color: C.white, letterSpacing: 2, textShadow: "0 4px 20px #000" }}>{label}</div>
        {sub ? <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 56, color, textShadow: "0 4px 20px #000" }}>{sub}</div> : null}
      </div>
    </div>
  );
};

const WorldMap: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const dur = s.b - s.a;
  return (
    <MapView center={s.center} zoom={s.zoom} zoom0={s.zoom0} dur={dur}>
      {(proj) => (
        <>
          {s.markers.map(([label, sub, lat, lon, color, at, side]: any, j: number) => {
            const [x, y] = proj(lon, lat);
            return <Marker key={j} x={x} y={y} label={label} sub={sub || undefined} color={color === "cold" ? C.cold : color === "amber" ? C.amber : C.red} o={appear(t, at ?? s.a + 0.3 + j * 0.25, 0.4)} side={side ?? 1} />;
          })}
          {s.head ? <div style={{ position: "absolute", left: 70, top: 60, fontFamily: OSW, fontWeight: 500, fontSize: 38, letterSpacing: 5, color: C.amber }}>{s.head}</div> : null}
        </>
      )}
    </MapView>
  );
};

const NinoBox: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const dur = s.b - s.a;
  return (
    <MapView center={[-150, 0]} zoom={2.4} zoom0={1.5} dur={dur}>
      {(proj) => {
        const [x0, y0] = proj(-170, 5), [x1, y1] = proj(-120, -5);
        const o = appear(t, s.a + 1.0, 0.5);
        return (
          <>
            <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, border: `6px solid ${C.red}`, background: "rgba(255,59,47,0.25)", opacity: o }} />
            <div style={{ position: "absolute", left: x0, top: y0 - 110, fontFamily: OSW, fontWeight: 700, fontSize: 80, color: C.white, opacity: o, textShadow: "0 4px 20px #000" }}>NIÑO 3.4</div>
            <div style={{ position: "absolute", left: x0, top: y1 + 20, fontFamily: INT, fontWeight: 600, fontSize: 30, color: C.amber, opacity: appear(t, s.a + 1.6) }}>5°N–5°S · 170°W–120°W</div>
          </>
        );
      }}
    </MapView>
  );
};

const Pacific: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const dur = s.b - s.a;
  const f = useCurrentFrame();
  const nino = s.mode === "nino";
  return (
    <MapView center={[-165, 0]} zoom={1.7} zoom0={1.55} dur={dur}>
      {(proj) => {
        const slide = nino ? appear(t, s.a + 0.8, 3.5) : 0;
        const [wx, wy] = proj(140 + slide * 90, 0); // piscina cálida: oeste → centro-este
        const [px, py] = proj(-84, -4); // Perú
        const arrows = Array.from({ length: nino ? 3 : 7 });
        return (
          <>
            <div style={{ position: "absolute", left: wx - 330, top: wy - 170, width: 660, height: 340, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,80,40,0.85), rgba(255,120,40,0.35) 60%, rgba(255,120,40,0))", filter: "blur(6px)" }} />
            {!nino ? <div style={{ position: "absolute", left: px - 160, top: py - 120, width: 260, height: 240, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(79,163,209,0.85), rgba(79,163,209,0))", opacity: appear(t, s.a + 6.5) }} /> : null}
            {arrows.map((_, j) => {
              const ph = ((f + j * 23) % 90) / 90;
              const [ax, ay] = proj(-95 - ph * 70, -12 + (j % 4) * 7);
              return <div key={j} style={{ position: "absolute", left: ax, top: ay, fontSize: 64, color: "white", opacity: (nino ? 0.35 : 0.9) * Math.sin(ph * Math.PI) }}>←</div>;
            })}
            <div style={{ position: "absolute", left: 70, top: 60, fontFamily: OSW, fontWeight: 500, fontSize: 38, letterSpacing: 5, color: C.amber }}>{nino ? "EL NIÑO" : "NORMAL YEAR"}</div>
            <div style={{ position: "absolute", left: wx - 170, top: wy + 120, fontFamily: OSW, fontWeight: 700, fontSize: 44, color: C.white, textShadow: "0 4px 20px #000", opacity: appear(t, s.a + (nino ? 2.5 : 2.6)) }}>{nino ? "WARM WATER SLIDES EAST" : "WARM WATER PILES UP WEST"}</div>
            <div style={{ position: "absolute", left: 1200, top: 300, fontFamily: OSW, fontWeight: 700, fontSize: 44, color: C.white, textShadow: "0 4px 20px #000", opacity: appear(t, s.a + 0.6) }}>{nino ? "TRADE WINDS WEAKEN" : "TRADE WINDS →  WEST"}</div>
            {!nino ? <div style={{ position: "absolute", left: px - 360, top: py + 110, fontFamily: OSW, fontWeight: 700, fontSize: 40, color: C.cold, textShadow: "0 4px 20px #000", opacity: appear(t, s.a + 7) }}>COLD WATER RISES OFF PERU</div> : null}
          </>
        );
      }}
    </MapView>
  );
};

const Scale: React.FC<{ s: Shot }> = ({ s }) => {
  const t = useT(s);
  const max = 4.5;
  let cur = 0;
  for (const [v, , at] of s.marks) if (t >= at) cur = v;
  const fill = interpolate(t, [s.a, s.a + 0.8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ padding: "0 170px", justifyContent: "center" }}>
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 40, letterSpacing: 5, color: C.gray, marginBottom: 80 }}>NIÑO 3.4 · °C ABOVE NORMAL</div>
      <div style={{ position: "relative", height: 70, background: "#1b2434", borderRadius: 35 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 35, width: `${(cur / max) * 100 * fill}%`, background: `linear-gradient(90deg, ${C.amber}, ${C.red})` }} />
        {s.marks.map(([v, label, at]: any, j: number) => (
          <div key={j} style={{ position: "absolute", left: `${(v / max) * 100}%`, top: -30, opacity: appear(t, at, 0.4) }}>
            <div style={{ width: 6, height: 130, background: C.white, marginLeft: -3 }} />
            <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 64, color: C.white, marginTop: 10, marginLeft: -40 }}>+{v}°</div>
            <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 36, color: C.amber, marginLeft: -40, letterSpacing: 3, whiteSpace: "nowrap" }}>{label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const GFX: Record<string, React.FC<{ s: Shot }>> = { BigCount, YearStamp, BigNumber, Stat: BigNumber, NotList, Chapter, Word, Quote, Dots, Bars, Odds, TwoYears, Checklist, Watch3, Next, End, WorldMap, NinoBox, Pacific, Scale };

const ShotView: React.FC<{ s: Shot; i: number }> = ({ s, i }) => {
  const dur = s.b - s.a;
  const f = useCurrentFrame();
  let body: React.ReactNode = null;
  if (s.k === "v") body = <Vid src={P(`v/${s.src}.mp4`)} dur={dur} clipDur={CLIPS[s.src] || 8} i={i} />;
  else if (s.k === "p") body = <AIShot name={s.src} dur={dur} i={i} />;
  else if (s.k === "ar") body = <Archive name={s.src} dur={dur} i={i} full={!!s.full} />;
  else {
    const G = GFX[s.src];
    body = (
      <AbsoluteFill style={{ backgroundColor: C.ink }}>
        {s.bed ? <Bed name={s.bed} dur={dur} i={i} /> : null}
        {G ? <G s={s} /> : null}
      </AbsoluteFill>
    );
  }
  // fundido corto de entrada en los gráficos (los cortes de metraje son secos)
  const o = s.k === "g" ? interpolate(f, [0, 6], [0.4, 1], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {body}
      {s.tag ? <Tag text={s.tag} dur={dur} /> : null}
      {s.sub === 1 ? <SubChip dur={dur} /> : null}
    </AbsoluteFill>
  );
};

export const Full: React.FC = () => {
  const shots: Shot[] = (PLAN as any).shots;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      {shots.map((s, i) => {
        const from = Math.round(s.a * FPS);
        const to = Math.round(s.b * FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} premountFor={30}>
            <ShotView s={s} i={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// calibración del mapa (no va al video)
export const MapCal: React.FC = () => {
  const pts: [string, number, number][] = [["0,0", 0, 0], ["London", -0.1, 51.5], ["CapeTown", 18.4, -33.9], ["Tokyo", 139.7, 35.7], ["CapeHorn", -67.3, -56], ["Anchorage", -149.9, 61.2], ["Sydney", 151.2, -33.9], ["Lima", -77, -12], ["Mumbai", 72.9, 19.1], ["Reykjavik", -21.9, 64.1]];
  return (
    <MapView center={[0, 0]} zoom={1} zoom0={1} dur={1}>
      {(proj) => <>{pts.map(([n, lo, la]) => { const [x, y] = proj(lo, la); return <div key={n} style={{ position: "absolute", left: x - 6, top: y - 6, width: 12, height: 12, background: "red", borderRadius: 6 }}><div style={{ color: "yellow", fontSize: 18, marginLeft: 14 }}>{n}</div></div>; })}</>}
    </MapView>
  );
};

// miniatura (still 1920x1080 → thumb_yt 1280x720)
export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <MapView center={[-160, 2]} zoom={1.9} zoom0={1.9} dur={1}>
      {(proj) => {
        const [x, y] = proj(-150, 0);
        return (
          <>
            <div style={{ position: "absolute", left: x - 900, top: y - 260, width: 1800, height: 520, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,40,10,0.95), rgba(255,90,20,0.75) 45%, rgba(255,140,30,0.25) 75%, rgba(255,140,30,0))", mixBlendMode: "screen" }} />
            <div style={{ position: "absolute", left: x - 500, top: y - 120, width: 1000, height: 240, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,255,200,0.7), rgba(255,200,80,0))", mixBlendMode: "screen" }} />
          </>
        );
      }}
    </MapView>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.6) 100%)" }} />
    <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: OSW, fontWeight: 700, fontSize: 250, color: "white", letterSpacing: 6, WebkitTextStroke: "6px black", textShadow: "0 12px 40px rgba(0,0,0,0.9)" }}>
      1877 <span style={{ color: C.red }}>=</span> 2026
    </div>
    <div style={{ position: "absolute", bottom: 60, left: 0, width: "100%", textAlign: "center" }}>
      <span style={{ background: C.red, color: "white", fontFamily: OSW, fontWeight: 700, fontSize: 92, padding: "6px 40px", letterSpacing: 4 }}>SUPER EL NIÑO</span>
    </div>
  </AbsoluteFill>
);
