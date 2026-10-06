// Cine — kit v2 del canal "Before Us" (documental hiperreal de la prehistoria). Los datos viven DENTRO del mundo:
//   EmberType   texto/número que se ARMA con chispas que suben del fuego (y queda quieto, legible)
//   OchreWall   texto y palotes PINTADOS en ocre sobre la roca, con la luz del fuego parpadeando
//   ShadowWall  sombras chinas en la roca + cifras grandes pintadas
//   SkyClock    la hora de la noche: cielo que rota (star-trails), luna que avanza, hora gigante en el cielo o sobre la roca
//   CampWatch   vista cenital del campamento: cada durmiente se enciende cuando está despierto; líneas grandes por marca
//   DotTrail    un objeto real (foto) cuyas marcas se encienden en secuencia, con las fases de la luna arriba
//   MatchCut    A → B con barrido de borde de llama (misma pose, dos épocas)
//   TitleCard   título de lugar/época GRANDE, tipografía de cine
//   Flash       destello de un plano (teaser / flash-forward)
//   Nightfall   velo que apaga el cuadro hacia la noche (rampa)
// Genéricos y parametrizables: ningún texto del video está quemado acá.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media, asset } from "../yc/Media";
import { AH, BIG, MONO, SANS, SERIF, TSH, clamp, ease, easeInOut, lerp, rnd } from "./theme";

const W = 1920, H = 1080;
const useLife = (inF = 8, outF = 10) => {
  const f = useCurrentFrame(); const { durationInFrames: D, fps } = useVideoConfig();
  return { f, D, fps, a: clamp(f / inF) * (1 - clamp((f - (D - outF)) / outF)) };
};
const flick = (f: number, s = 0) => 0.9 + 0.06 * Math.sin(f / 2.1 + s) + 0.04 * Math.sin(f / 3.7 + s * 2) + 0.03 * Math.sin(f / 1.3 + s);

// muestrea los píxeles de un texto (fuente ya cargada) → puntos objetivo
const useTextPoints = (lines: { text: string; size: number; y: number }[], step = 6) => {
  const [pts, setPts] = useState<[number, number][] | null>(null);
  const [h] = useState(() => delayRender("ember text"));
  const key = JSON.stringify(lines);
  useEffect(() => {
    let dead = false;
    (async () => {
      try { await Promise.all(lines.map((l) => (document as any).fonts.load(`400 ${l.size}px "${BIG}"`))); } catch { /* sin fuente: igual dibuja */ }
      if (dead) return;
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const g = c.getContext("2d")!;
      g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
      for (const l of lines) { g.font = `400 ${l.size}px "${BIG}"`; g.fillText(l.text, W / 2, l.y); }
      const d = g.getImageData(0, 0, W, H).data; const out: [number, number][] = [];
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 140) out.push([x, y]);
      setPts(out); continueRender(h);
    })();
    return () => { dead = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return pts;
};

// ─── EMBER TYPE ───────────────────────────────────────────────────────────────
export const EmberType: React.FC<{
  text: string; sub?: string; size?: number; subSize?: number; bed?: string; bedStart?: number; dim?: number;
  formAt?: number; frost?: boolean; y?: number;
}> = ({ text, sub, size = 300, subSize = 78, bed, bedStart, dim = 0.45, formAt = 34, frost = false, y = 470 }) => {
  const { f, D, a } = useLife(6, 12);
  const lines = useMemo(() => [{ text, size, y }, ...(sub ? [{ text: sub, size: subSize, y: y + size * 0.62 + subSize * 0.5 }] : [])], [text, sub, size, subSize, y]);
  const pts = useTextPoints(lines, size > 200 ? 7 : 5);
  const cv = useRef<HTMLCanvasElement>(null);
  const exit = clamp((f - (D - 12)) / 12);
  useLayoutEffect(() => {
    const c = cv.current; if (!c || !pts) return;
    const g = c.getContext("2d")!; g.clearRect(0, 0, W, H); g.globalCompositeOperation = "lighter";
    const settled = clamp((f - formAt) / 14);
    for (let i = 0; i < pts.length; i++) {
      const [tx, ty] = pts[i];
      const d0 = rnd(i) * 18, du = 20 + rnd(i + 7) * 12;
      const p = easeInOut(clamp((f - d0) / du));
      if (p <= 0) continue;
      const sx = 960 + (rnd(i + 3) - 0.5) * 700, sy = 1120 + rnd(i + 5) * 260;
      const sw = Math.sin(p * Math.PI) * (rnd(i + 9) - 0.5) * 260;
      let x = lerp(sx, tx, p) + sw, yy = lerp(sy, ty, p);
      if (exit > 0) { yy -= exit * (80 + rnd(i + 2) * 240); x += (rnd(i + 4) - 0.5) * exit * 90; }
      const tw = 0.6 + 0.4 * Math.sin(f / 2 + i);
      const r = 1.6 + rnd(i + 11) * 1.8;
      const al = (p < 1 ? 0.9 : 0.55 * (1 - settled * 0.55)) * tw * (1 - exit);
      g.fillStyle = frost ? `rgba(200,230,255,${al})` : `rgba(255,${150 + Math.floor(rnd(i + 13) * 90)},60,${al})`;
      g.beginPath(); g.arc(x, yy, r, 0, Math.PI * 2); g.fill();
    }
    // chispas sueltas que siguen subiendo del fuego
    for (let k = 0; k < 90; k++) {
      const sp = 5 + rnd(k) * 8; const yy = 1100 - ((f * sp + rnd(k + 1) * 1400) % 1400); const x = 960 + (rnd(k + 2) - 0.5) * 1400 + Math.sin(f / 9 + k) * 20;
      g.fillStyle = `rgba(255,${140 + Math.floor(rnd(k + 3) * 80)},50,${0.5 * (1 - exit)})`; g.beginPath(); g.arc(x, yy, 1.5 + rnd(k + 4) * 2, 0, 6.3); g.fill();
    }
  }, [f, pts, formAt, frost, exit]);
  const solid = ease(clamp((f - formAt + 6) / 16)) * (1 - exit);
  const frostK = frost ? ease(clamp((f - 4) / 50)) : 0;
  const fill = frost ? "linear-gradient(180deg, #ffffff 0%, #cfe6ff 55%, #8fb8e0 100%)" : `linear-gradient(180deg, #fff6d8 0%, ${AH.flame} 40%, ${AH.ember} 100%)`;
  const glow = frost ? "0 0 40px rgba(170,210,255,0.7)" : "0 0 50px rgba(255,138,42,0.75)";
  return (
    <AbsoluteFill style={{ opacity: a, background: "#050302" }}>
      {bed ? <AbsoluteFill><Media src={bed} start={bedStart} kb="in" zoom={1.12} filter={frost ? "saturate(0.6) hue-rotate(-10deg)" : undefined} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,${dim + 0.25}) 0%, rgba(0,0,0,${dim}) 55%, rgba(0,0,0,${dim * 0.6}) 100%)` }} />
      {frost ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(200,225,255,0) ${70 - frostK * 38}%, rgba(210,235,255,${0.55 * frostK}) 100%)`, mixBlendMode: "screen" }} /> : null}
      <canvas ref={cv} width={W} height={H} style={{ position: "absolute", inset: 0 }} />
      {lines.map((l, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: l.y - l.size * 0.62, height: l.size * 1.24, lineHeight: `${l.size * 1.24}px`, textAlign: "center",
          fontFamily: BIG, fontSize: l.size, opacity: solid * (i === 0 ? 1 : 0.95), transform: `scale(${1 + 0.02 * solid})` }}>
          <span style={{ backgroundImage: fill, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(${glow.replace(/^0 0 /, "0 0 ").split(",")[0]})`, textShadow: "none" } as React.CSSProperties}>{l.text}</span>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ─── OCHRE WALL ───────────────────────────────────────────────────────────────
export const OchreWall: React.FC<{
  lines?: { text: string; size?: number }[]; tally?: number; tallyGroups?: number; bed: string; bedStart?: number; paintAt?: number; color?: string; y?: number;
}> = ({ lines = [], tally = 0, bed, bedStart, paintAt = 8, color = "#8E2E14", y = 540 }) => {
  const { f, a } = useLife(8, 12);
  const fl = flick(f);
  const tallyW = Math.min(1500, tally * 46);
  const tallyDur = Math.min(60, 8 + tally * 2);
  const totalH = lines.reduce((s, l) => s + (l.size ?? 170) * 1.05, 0) + (tally ? 220 : 0);
  let cy = y - totalH / 2;
  const textStart = paintAt + (tally ? tallyDur : 0);
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <AbsoluteFill style={{ filter: `brightness(${fl})` }}>
        <Media src={bed} start={bedStart} kb="in" zoom={1.08} />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "multiply" }}>
        {tally ? (() => { const top = cy; cy += 220; return (
          <div style={{ position: "absolute", left: 960 - tallyW / 2, top, width: tallyW, height: 190 }}>
            {Array.from({ length: tally }, (_, i) => {
              const k = ease(clamp((f - paintAt - (i * (tallyDur - 8)) / Math.max(1, tally)) / 5));
              return <div key={i} style={{ position: "absolute", left: (i / Math.max(1, tally - 1)) * (tallyW - 26), top: 10 + rnd(i) * 14, width: 22 + rnd(i + 3) * 8, height: 170 * k,
                background: color, borderRadius: 12, transform: `rotate(${(rnd(i + 5) - 0.5) * 8}deg)`, opacity: 0.92 }} />;
            })}
          </div>); })() : null}
        {lines.map((l, i) => {
          const s = l.size ?? 170; const top = cy; cy += s * 1.05;
          const k = clamp((f - textStart - i * 12) / 16);
          return <div key={i} style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: BIG, fontSize: s, lineHeight: 1, color,
            clipPath: `inset(0 ${100 - k * 100}% 0 0)`, opacity: 0.94, letterSpacing: 2 }}>{l.text}</div>;
        })}
      </AbsoluteFill>
      {/* rugosidad: el grano de la roca "come" la pintura */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 115%, rgba(255,140,50,${0.22 * fl}), rgba(0,0,0,0) 60%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// ─── SHADOW WALL ──────────────────────────────────────────────────────────────
export const ShadowWall: React.FC<{
  bed: string; bedStart?: number; stats: { value: string; label: string; hot?: boolean }[]; step?: number; firelit?: boolean; align?: "row" | "big"; [k: string]: any;
}> = (P) => {
  const { bed, bedStart, stats, step = 26, firelit = true, align = "row" } = P;
  const { f, fps, a } = useLife(8, 12);
  const fl = firelit ? flick(f, 1) : 1;
  const sway = firelit ? Math.sin(f / 7) * 0.6 + Math.sin(f / 3.3) * 0.3 : 0;
  const n = stats.length;
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <AbsoluteFill style={{ filter: `brightness(${fl})`, transform: `skewX(${sway * 0.6}deg) scale(1.04)`, transformOrigin: "50% 100%" }}>
        <Media src={bed} start={bedStart} kb="in" zoom={1.06} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.0) 45%, rgba(0,0,0,0.72) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: align === "big" ? 90 : 70, display: "flex", justifyContent: "center", gap: 90 }}>
        {stats.map((s, i) => {
          const k = spring({ frame: f - (P["s" + i] ?? 10 + i * step), fps, config: { damping: 14, stiffness: 110 } });
          const big = align === "big";
          return <div key={i} style={{ textAlign: "center", opacity: clamp(k * 1.4), transform: `translateY(${(1 - k) * 40}px)` }}>
            <div style={{ fontFamily: BIG, fontSize: big ? 300 : n > 2 ? 190 : 230, lineHeight: 0.95, color: s.hot ? AH.flame : AH.bone,
              textShadow: s.hot ? `0 0 50px rgba(255,138,42,0.7), ${TSH}` : TSH }}>{s.value}</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: big ? 70 : 50, letterSpacing: 6, color: s.hot ? AH.flame : AH.bone, textShadow: TSH, marginTop: 6 }}>{s.label}</div>
          </div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SKY CLOCK ────────────────────────────────────────────────────────────────
// mode "sky": cielo real + estelas de estrellas que rotan + luna en su arco + hora gigante en el cielo
// mode "rock": la hora proyectada con luz de fuego sobre la roca (bed = roca), con perspectiva leve
export const SkyClock: React.FC<{
  time: string; title?: string; bed: string; bedStart?: number; mode?: "sky" | "rock"; moon?: { x0: number; x1: number; phase: number }; big?: boolean;
  pole?: [number, number]; spin?: number; align?: "center" | "left" | "right";
}> = ({ time, title, bed, bedStart, mode = "sky", moon, big = false, pole = [-200, -300], spin = 9, align = "center" }) => {
  const { f, D, fps, a } = useLife(6, 10);
  const cv = useRef<HTMLCanvasElement>(null);
  const t = f / Math.max(1, D);
  useLayoutEffect(() => {
    const c = cv.current; if (!c || mode !== "sky") return;
    const g = c.getContext("2d")!; g.clearRect(0, 0, W, H); g.globalCompositeOperation = "lighter";
    const [px, py] = pole; const arc = (spin * Math.PI / 180) * (0.25 + t);
    for (let i = 0; i < 420; i++) {
      const r = 250 + rnd(i) * 2300; const th0 = rnd(i + 1) * Math.PI * 2;
      const x0 = px + Math.cos(th0) * r, y0 = py + Math.sin(th0) * r;
      if (x0 < -100 || x0 > W + 100 || y0 < -100 || y0 > H * 0.8) continue;
      const b = 0.25 + rnd(i + 2) * 0.75;
      g.strokeStyle = `rgba(${200 + Math.floor(rnd(i + 3) * 55)},${215 + Math.floor(rnd(i + 4) * 40)},255,${0.35 * b})`; g.lineWidth = 0.8 + b * 1.4;
      g.beginPath(); g.arc(px, py, r, th0, th0 + arc); g.stroke();
      const ex = px + Math.cos(th0 + arc) * r, ey = py + Math.sin(th0 + arc) * r;
      g.fillStyle = `rgba(255,255,255,${0.7 * b})`; g.beginPath(); g.arc(ex, ey, 0.8 + b * 1.6, 0, 6.3); g.fill();
    }
  }, [f, mode, pole, spin, t]);
  const chars = time.split("");
  const fl = mode === "rock" ? flick(f, 2) : 1;
  const mx = moon ? lerp(moon.x0, moon.x1, easeInOut(t)) : 0;
  const my = moon ? 330 - Math.sin(Math.PI * clamp(mx / W)) * 220 : 0;
  const size = big ? 330 : 250;
  const titleK = ease(clamp((f - 16) / 12));
  const left = align === "left" ? 140 : align === "right" ? undefined : 0;
  return (
    <AbsoluteFill style={{ opacity: a, background: "#02030a" }}>
      <AbsoluteFill style={{ transform: mode === "sky" ? `rotate(${t * spin * 0.12}deg) scale(1.12)` : undefined, filter: mode === "rock" ? `brightness(${fl})` : undefined }}>
        <Media src={bed} start={bedStart} kb={mode === "rock" ? "in" : "none"} zoom={mode === "rock" ? 1.1 : 1} />
      </AbsoluteFill>
      {mode === "sky" ? <canvas ref={cv} width={W} height={H} style={{ position: "absolute", inset: 0, opacity: ease(clamp(f / 12)) }} /> : null}
      {moon ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs><radialGradient id="mg"><stop offset="0" stopColor="#fff" stopOpacity="0.55" /><stop offset="1" stopColor="#9fb6cc" stopOpacity="0" /></radialGradient>
            <mask id="mph"><rect x={mx - 90} y={my - 90} width={180} height={180} fill="black" /><circle cx={mx} cy={my} r={64} fill="white" />
              <ellipse cx={mx} cy={my} rx={Math.abs(Math.cos(moon.phase * Math.PI * 2)) * 64} ry={64} fill={Math.cos(moon.phase * Math.PI * 2) > 0 ? "black" : "white"} />
              <rect x={moon.phase < 0.5 ? mx - 90 : mx} y={my - 90} width={90} height={180} fill="black" /></mask></defs>
          <circle cx={mx} cy={my} r={170} fill="url(#mg)" opacity={0.5 + 0.5 * (1 - Math.abs(Math.cos(moon.phase * Math.PI)))} />
          <circle cx={mx} cy={my} r={64} fill="rgba(120,140,170,0.14)" />
          <circle cx={mx} cy={my} r={64} fill="#eef3f7" mask="url(#mph)" />
        </svg>
      ) : null}
      <AbsoluteFill style={{ background: mode === "sky" ? "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" : "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.05), rgba(0,0,0,0.5))" }} />
      <div style={{ position: "absolute", left, right: align === "right" ? 140 : align === "left" ? undefined : 0, top: 540 - size * 0.62,
        display: "flex", justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        transform: mode === "rock" ? "perspective(1400px) rotateY(-9deg) rotateX(4deg)" : undefined, mixBlendMode: mode === "rock" ? "screen" : undefined }}>
        {chars.map((c, i) => {
          const s = spring({ frame: f - 3 - i * 2, fps, config: { damping: 15, stiffness: 140 } });
          return <span key={i} style={{ fontFamily: BIG, fontSize: size, lineHeight: 1.1, display: "inline-block", width: c === " " ? size * 0.22 : undefined,
            color: mode === "rock" ? `rgba(255,${190 + Math.floor(20 * fl)},120,${0.92 * fl})` : "#f4f7fb",
            textShadow: mode === "rock" ? `0 0 60px rgba(255,138,42,0.9)` : `0 0 60px rgba(160,200,255,0.55), ${TSH}`,
            opacity: clamp(s * 1.3), transform: `translateY(${(1 - s) * 50}px) scale(${lerp(1.25, 1, s)})` }}>{c}</span>;
        })}
      </div>
      {title ? <div style={{ position: "absolute", left, right: align === "right" ? 140 : align === "left" ? undefined : 0, top: 540 + size * 0.52, textAlign: align === "center" ? "center" : align,
        fontFamily: SANS, fontWeight: 600, fontSize: big ? 78 : 64, letterSpacing: 16, color: mode === "rock" ? AH.flame : AH.moon, textShadow: TSH,
        opacity: titleK, transform: `translateY(${(1 - titleK) * 18}px)` }}>{title}</div> : null}
    </AbsoluteFill>
  );
};

// ─── CAMP WATCH (vista cenital) ───────────────────────────────────────────────
export const CampWatch: React.FC<{
  bed: string; sleepers: [number, number][]; mode?: "watch" | "sleep"; lines?: { text: string; at: number; hot?: boolean }[];
  counter?: boolean; allAsleepAt?: number; spin?: number; bedFilter?: string; [k: string]: any;
}> = (P) => {
  const { bed, sleepers, mode = "watch", counter = true, allAsleepAt = 0.8, spin = 6, bedFilter = "brightness(1.35)" } = P;
  const lines: { text: string; at: number; hot?: boolean }[] = (P.lines ?? []).map((l: any, i: number) => ({ ...l, at: P["l" + i] ?? l.at ?? 0 }));
  const { f, D, fps, a } = useLife(8, 12);
  const t = f / Math.max(1, D);
  const n = sleepers.length;
  const awake = (i: number) => {
    if (mode === "sleep") return f < 20 + i * ((D * 0.55) / n);         // se van durmiendo uno por uno
    if (t > allAsleepAt - 0.05 && t < allAsleepAt + 0.08) return false;
    const v = Math.sin(t * 16 * (0.8 + rnd(i + 17) * 1.4) + rnd(i + 5) * 6.28) + (i === Math.floor(t * 7) % n ? 1.3 : 0);
    return v > 0.8;
  };
  const cnt = sleepers.filter((_, i) => awake(i)).length;
  const cur = [...lines].reverse().find((l) => f >= l.at);
  const ci = cur ? lines.indexOf(cur) : -1;
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `rotate(${t * spin}deg) scale(${1.18 + t * 0.06})` }}>
        <Media src={bed} kb="none" zoom={1} filter={bedFilter} />
        <AbsoluteFill>
          {sleepers.map(([x, y], i) => {
            const on = awake(i);
            const k = on ? 1 : 0;
            return <div key={i} style={{ position: "absolute", left: x * W - 80, top: y * H - 80, width: 160, height: 160, borderRadius: 80,
              background: `radial-gradient(circle, rgba(255,215,130,${0.95 * k}) 0%, rgba(255,138,42,${0.6 * k}) 40%, rgba(255,138,42,0) 72%)`,
              boxShadow: on ? `0 0 40px rgba(255,160,60,0.8)` : "none", mixBlendMode: "screen" }} />;
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      {counter && mode === "watch" ? (
        <div style={{ position: "absolute", right: 110, top: 90, textAlign: "right" }}>
          <div style={{ fontFamily: BIG, fontSize: 170, lineHeight: 1, color: cnt ? AH.flame : AH.moon, textShadow: `0 0 40px rgba(255,138,42,0.6), ${TSH}` }}>{cnt}<span style={{ fontSize: 80, color: AH.bone }}> / {n}</span></div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 6, color: AH.bone, textShadow: TSH }}>AWAKE</div>
        </div>
      ) : null}
      {cur ? (() => {
        const k = spring({ frame: f - cur.at, fps, config: { damping: 14 } });
        return <div key={ci} style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: BIG, fontSize: 150, lineHeight: 1,
          color: cur.hot ? AH.flame : AH.bone, textShadow: cur.hot ? `0 0 50px rgba(255,138,42,0.75), ${TSH}` : TSH, opacity: clamp(k * 1.4), transform: `scale(${lerp(1.2, 1, k)})` }}>{cur.text}</div>;
      })() : null}
    </AbsoluteFill>
  );
};

// ─── DOT TRAIL (objeto real con marcas que se encienden) ──────────────────────
export const DotTrail: React.FC<{ bed: string; dots: [number, number][]; count?: number; phases?: boolean; label?: string; startAt?: number; imgAspect?: number }> =
  ({ bed, dots, count, phases = true, label, startAt = 10, imgAspect = 2560 / 950 }) => {
  const { f, D, a } = useLife(8, 12);
  const N = Math.min(count ?? dots.length, dots.length);
  const per = Math.max(1.2, (D - startAt - 30) / N);
  const lit = clamp(Math.floor((f - startAt) / per) + 1, 0, N);
  // la foto se ajusta al ancho (cover sobre 16:9): mapeo coords normalizadas → pantalla
  const iw = W, ih = W / imgAspect, ox = 0, oy = (H - ih) / 2;
  const zs = 1.55 + 0.1 * (f / Math.max(1, D));   // zoom a la zona de las marcas
  const cxy = dots.slice(0, N).reduce((acc, [x, y]) => [acc[0] + x / N, acc[1] + y / N], [0, 0]);
  const zx = ox + cxy[0] * iw, zy = oy + cxy[1] * ih;
  const tx = W / 2 - zx, ty = H / 2 - zy;
  const phaseOf = (k: number) => (k % 30) / 30;
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${zs})`, transformOrigin: `${zx}px ${zy}px` }}>
        <Img src={asset(bed)} style={{ position: "absolute", left: ox, top: oy, width: iw, height: ih, filter: "brightness(0.8) saturate(0.8)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {dots.slice(0, N).map(([x, y], i) => {
          if (i >= lit) return null;
          const fresh = clamp(1 - (f - startAt - i * per) / 14);
          return <g key={i}><circle cx={ox + x * iw} cy={oy + y * ih} r={9 + fresh * 12} fill="none" stroke={AH.flame} strokeWidth={2} opacity={0.5 + 0.5 * fresh} />
            <circle cx={ox + x * iw} cy={oy + y * ih} r={4} fill={AH.flame} opacity={0.9} /></g>;
        })}
      </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)" }} />
      {phases ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", gap: 22, padding: "14px 0", background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0))" }}>
          {Array.from({ length: 15 }, (_, j) => {
            const idx = Math.max(0, lit - 15) + j; if (idx >= lit) return <div key={j} style={{ width: 70 }} />;
            const p = phaseOf(idx); const c = Math.cos(p * Math.PI * 2);
            return <svg key={j} width={70} height={70}><defs><mask id={`ph${j}`}><rect width={70} height={70} fill="black" /><circle cx={35} cy={35} r={30} fill="white" />
              <rect x={p < 0.5 ? 0 : 35} y={0} width={35} height={70} fill="black" />
              <ellipse cx={35} cy={35} rx={Math.abs(c) * 30} ry={30} fill={c > 0 ? "black" : "white"} /></mask></defs>
              <circle cx={35} cy={35} r={30} fill="#1b2230" /><circle cx={35} cy={35} r={30} fill="#eef3f7" mask={`url(#ph${j})`} /></svg>;
          })}
        </div>
      ) : null}
      {label ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: BIG, fontSize: 110, color: AH.bone, textShadow: TSH, opacity: ease(clamp((f - 20) / 12)) }}>{label}</div> : null}
    </AbsoluteFill>
  );
};

// ─── MATCH CUT (A → B por borde de llama) ─────────────────────────────────────
export const MatchCut: React.FC<{ a: { src: string; start?: number; tag?: string }; b: { src: string; start?: number; tag?: string }; cutAt?: number; wipe?: number }> =
  ({ a: A, b: B, cutAt: cut0 = 45, wipe = 16 }) => {
  const cutAt = Math.max(8, cut0);
  const { f, a } = useLife(4, 8);
  const p = easeInOut(clamp((f - cutAt) / wipe));
  const edge = -10 + p * 125; // % del ancho
  const jag = Array.from({ length: 24 }, (_, i) => `${clamp((edge + Math.sin(i * 1.7 + f / 2) * 3 + (rnd(i + Math.floor(f / 3)) - 0.5) * 3) / 100, -0.2, 1.2) * 100}% ${(i / 23) * 100}%`);
  const poly = `polygon(0% 0%, ${jag.join(", ")}, 0% 100%)`;
  const tag = (txt: string | undefined, k: number, col: string) => txt ? (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center", fontFamily: BIG, fontSize: 110, color: col, textShadow: TSH, opacity: k, letterSpacing: 2 }}>{txt}</div>) : null;
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <AbsoluteFill><Media src={A.src} start={A.start} kb="in" zoom={1.08} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: poly }}><Media src={B.src} start={B.start} kb="in" zoom={1.08} /></AbsoluteFill>
      {p > 0 && p < 1 ? <div style={{ position: "absolute", top: 0, bottom: 0, left: `${edge}%`, width: 60, marginLeft: -30,
        background: "linear-gradient(90deg, rgba(255,138,42,0), rgba(255,200,110,0.95), rgba(255,138,42,0))", filter: "blur(6px)", boxShadow: "0 0 80px rgba(255,138,42,0.9)" }} /> : null}
      {tag(A.tag, ease(clamp((f - 4) / 10)) * (1 - ease(clamp((f - cutAt) / 8))), AH.moon)}
      {tag(B.tag, ease(clamp((f - cutAt - wipe) / 10)), AH.flame)}
    </AbsoluteFill>
  );
};

// ─── TITLE CARD (lugar / época) ───────────────────────────────────────────────
export const TitleCard: React.FC<{ title: string; sub?: string; pos?: "bottom" | "center"; size?: number }> = ({ title, sub, pos = "bottom", size = 124 }) => {
  const { f, fps, a } = useLife(6, 12);
  const k = spring({ frame: f - 2, fps, config: { damping: 18, stiffness: 90 } });
  const ls = lerp(40, 10, k);
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: pos === "bottom" ? "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)" : "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0.1))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, ...(pos === "bottom" ? { bottom: 120 } : { top: 540 - size * 0.75 }), textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: size, color: AH.bone, letterSpacing: ls * 0.1, textShadow: TSH, opacity: clamp(k * 1.3), lineHeight: 1 }}>{title}</div>
        {sub ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: ls, color: AH.flame, textShadow: TSH, marginTop: 18, opacity: ease(clamp((f - 10) / 12)) }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ─── FLASH (destello de un plano: teaser / flash-forward) ─────────────────────
export const Flash: React.FC<{ src: string; start?: number; text?: string }> = ({ src, start, text }) => {
  const { f, D } = useLife(1, 1);
  const w = clamp(1 - f / 4) * 0.8 + clamp((f - (D - 3)) / 3) * 0.6;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.15 - (f / D) * 0.08})` }}><Media src={src} start={start} kb="none" zoom={1} /></AbsoluteFill>
      {text ? <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: BIG, fontSize: 200, color: AH.flame, textShadow: `0 0 50px rgba(255,138,42,0.8), ${TSH}` }}>{text}</div> : null}
      <AbsoluteFill style={{ background: "#fff", opacity: w }} />
    </AbsoluteFill>
  );
};

// ─── NIGHTFALL (rampa a la noche sobre el plano de abajo) ─────────────────────
export const Nightfall: React.FC<{ to?: number }> = ({ to = 0.7 }) => {
  const { f, D } = useLife(1, 1);
  const k = easeInOut(clamp(f / D));
  return <AbsoluteFill style={{ background: `rgba(6,10,26,${k * to})`, mixBlendMode: "multiply", pointerEvents: "none" }} />;
};
void MONO;

// ─── SHOT (plano a pantalla completa anclado a una frase: cortes al golpe) ─────
export const Shot: React.FC<{ src: string; start?: number; kb?: "in" | "out" | "left" | "right" | "up" | "none"; zoom?: number; filter?: string }> = ({ src, start, kb = "in", zoom = 1.1, filter }) =>
  <AbsoluteFill style={{ background: "#000" }}><Media src={src} start={start} kb={kb} zoom={zoom} filter={filter} /></AbsoluteFill>;

// ─── EMBER WORDS (cada palabra se quema al decirse y se vuelve brasa) ─────────
export const EmberWords: React.FC<{ items: string[]; size?: number; [k: string]: any }> = (P) => {
  const { f, fps, a } = useLife(6, 12);
  const { items, size = 150 } = P;
  const at = items.map((_: string, i: number) => P["t" + i] ?? i * 45);
  const cur = at.reduce((c: number, t: number, i: number) => (f >= t ? i : c), -1);
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 70%)" }} />
      {items.map((w: string, i: number) => {
        if (i !== cur) return null;
        const k = clamp((f - at[i]) / 10);
        const nextAt = at[i + 1] ?? Infinity;
        const out = clamp((f - (nextAt - 6)) / 6);
        const heat = clamp((f - at[i]) / 24);
        const col = `rgb(255,${Math.round(lerp(250, 150, heat))},${Math.round(lerp(220, 60, heat))})`;
        return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 540 - size * 0.6, textAlign: "center", fontFamily: BIG, fontSize: size, lineHeight: 1.2,
          color: col, opacity: k * (1 - out), transform: `scale(${lerp(1.18, 1, ease(k)) + out * 0.08}) translateY(${-out * 40}px)`, filter: `blur(${out * 6}px)`,
          textShadow: `0 0 ${lerp(80, 40, heat)}px rgba(255,${Math.round(lerp(220, 120, heat))},60,0.85), ${TSH}` }}>{w}</div>;
      })}
      {void fps}
    </AbsoluteFill>
  );
};

// ─── FLASH SEQ (flash-forward: varios planos de un golpe, repartidos en la duración) ─
export const FlashSeq: React.FC<{ items: { src: string; start?: number; text?: string }[] }> = ({ items }) => {
  const f = useCurrentFrame(); const { durationInFrames: D } = useVideoConfig();
  const per = D / Math.max(1, items.length); const i = Math.min(items.length - 1, Math.floor(f / per)); const lf = f - i * per;
  const it = items[i];
  const w = clamp(1 - lf / 3) * 0.85;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.2 - (lf / per) * 0.1})` }}><Media src={it.src} start={it.start} kb="none" zoom={1} /></AbsoluteFill>
      {it.text ? <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: BIG, fontSize: 230, color: AH.flame, textShadow: `0 0 50px rgba(255,138,42,0.85), ${TSH}` }}>{it.text}</div> : null}
      <AbsoluteFill style={{ background: "#fff", opacity: w }} />
    </AbsoluteFill>
  );
};
