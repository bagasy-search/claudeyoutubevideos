// ChapterCard — título de capítulo a pantalla completa entre actos (1.8–2.5 s).
// Foto de fondo oscurecida con push lento, flash de "film burn" procedural al entrar, "PART N" en versalitas +
// título SERIF grande, línea de progreso del video con ticks por capítulo, y salida con burn + whip.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

export type ChapterCardProps = { n: number; title: string; bg?: string; progress: number; total?: number };

const src = (p: string) => (/^(https?:|data:|\/)/.test(p) ? p : staticFile(p));

// Film burn: manchas de luz naranja/oro que entran desde un borde, con núcleo casi blanco. f0 = cuadro del pico.
const Burn: React.FC<{ f: number; peak: number; len: number; seed: number; fromRight?: boolean }> = ({ f, peak, len, seed, fromRight }) => {
  const t = (f - (peak - len * 0.35)) / len; // 0..1 vida del burn
  if (t < 0 || t > 1) return null;
  const env = t < 0.35 ? ease(t / 0.35) : 1 - easeInOut((t - 0.35) / 0.65);
  const side = fromRight ? 100 : 0;
  const dir = fromRight ? -1 : 1;
  const blobs = [0, 1, 2, 3].map((i) => {
    const y = 15 + rnd(seed + i * 7) * 70 + Math.sin(t * 3 + i) * 6;
    const x = side + dir * (-10 + t * (38 + rnd(seed + i) * 30) + i * 6);
    const w = (i === 0 ? 34 : 26) + rnd(seed + i * 3) * 30;
    const h = (i === 0 ? 60 : 40) + rnd(seed + i * 5) * 45;
    return { x, y, w, h, hot: i === 0 };
  });
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: env, pointerEvents: "none" }}>
      {/* lavado cálido general */}
      <AbsoluteFill style={{ background: `linear-gradient(${fromRight ? 270 : 90}deg, rgba(255,96,10,${0.5 * env}) 0%, rgba(190,40,0,${0.2 * env}) 35%, rgba(0,0,0,0) 62%)` }} />
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: "absolute", left: `${b.x - b.w / 2}%`, top: `${b.y - b.h / 2}%`, width: `${b.w}%`, height: `${b.h}%`,
          background: b.hot
            ? "radial-gradient(closest-side, rgba(255,250,225,0.95), rgba(255,200,90,0.75) 28%, rgba(255,110,20,0.45) 55%, rgba(200,40,0,0) 100%)"
            : "radial-gradient(closest-side, rgba(255,190,80,0.55), rgba(255,100,20,0.35) 45%, rgba(160,30,0,0) 100%)",
          borderRadius: "50%",
        }} />
      ))}
      {/* pelo de luz / fuga vertical tipo gate */}
      <div style={{ position: "absolute", left: `${side + dir * (t * 70 - 5)}%`, top: 0, width: "3%", height: "100%",
        background: "linear-gradient(90deg, rgba(255,200,120,0), rgba(255,235,190,0.5), rgba(255,200,120,0))" }} />
    </AbsoluteFill>
  );
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ n, title, bg = "yc/hankeat/i_144.jpg", progress, total = 6 }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const EXIT = Math.min(14, Math.floor(D * 0.22));
  const outStart = D - EXIT;
  const tOut = clamp((f - outStart) / EXIT);
  const whip = easeInOut(tOut);
  const tAll = f / Math.max(1, D - 1);

  // entrada
  const inBg = ease(f / 10);
  const kick = clamp(f / 12);
  const partIn = ease((f - 5) / 12);
  const lineIn = ease((f - 7) / 16);
  const barIn = ease((f - 9) / 14);
  const prog = clamp(progress);
  const prevTick = Math.max(0, (Math.ceil(prog * total - 1e-6) - 1) / total);
  const fillT = lerp(Math.min(prevTick, prog), prog, easeInOut((f - 10) / 22));

  const chars = Array.from(title.toUpperCase());
  const titleSize = chars.length > 16 ? 132 : chars.length > 11 ? 152 : 176;

  // whip: el contenido se va hacia la izquierda con estela
  const whipX = -whip * 900;
  const ghosts = tOut > 0 ? [1, 2, 3, 4, 5, 6] : [];
  const shake = f < 8 ? (rnd(f * 3.1) - 0.5) * 10 * (1 - f / 8) : 0; // micro sacudón del gate en el flash

  const Content: React.FC<{ ghost?: number }> = ({ ghost = 0 }) => (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${whipX + ghost * 38 * whip}px)`, opacity: ghost ? 0.16 * (1 - ghost / 7) : 1 }}>
      {/* PART N con filetes */}
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: partIn, transform: `translateY(${(1 - partIn) * 14}px)`, marginBottom: 18 }}>
        <div style={{ width: 120 * lineIn, height: 1.5, background: `linear-gradient(90deg, rgba(242,193,78,0), ${HK.gold})` }} />
        <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 500, letterSpacing: "0.55em", color: HK.gold, paddingLeft: "0.55em", textShadow: "0 0 18px rgba(242,193,78,0.35)" }}>
          PART {n}
        </div>
        <div style={{ width: 120 * lineIn, height: 1.5, background: `linear-gradient(90deg, ${HK.gold}, rgba(242,193,78,0))` }} />
      </div>
      {/* título */}
      <div style={{ display: "flex", fontFamily: SERIF, fontSize: titleSize, lineHeight: 1, color: HK.bone, letterSpacing: `${lerp(0.09, 0.03, ease(f / 40))}em`,
        textShadow: "0 6px 40px rgba(0,0,0,0.65), 0 0 2px rgba(0,0,0,0.4)", whiteSpace: "pre" }}>
        {chars.map((c, i) => {
          const t = ease((f - 8 - i * 1.1) / 14);
          return (
            <span key={i} style={{ display: "inline-block", opacity: t, transform: `translateY(${(1 - t) * 34}px) scale(${lerp(1.08, 1, t)})`,
              color: t < 0.999 ? `rgb(255,${Math.round(lerp(200, 235, t))},${Math.round(lerp(150, 221, t))})` : HK.bone }}>{c}</span>
          );
        })}
      </div>
      {/* barrido de luz por encima del título */}
      <div style={{ height: 1, width: 560 * lineIn, marginTop: 34, background: `linear-gradient(90deg, rgba(241,235,221,0), rgba(241,235,221,0.55), rgba(241,235,221,0))` }} />
    </AbsoluteFill>
  );

  const barW = 1180;
  return (
    <AbsoluteFill style={{ background: HK.ink, overflow: "hidden", opacity: 1 - clamp((f - (D - 4)) / 4) }}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.5}px)` }}>
        {/* fondo: foto oscura con push lento */}
        <AbsoluteFill style={{ opacity: inBg, transform: `scale(${lerp(1.14, 1.24, tAll)}) translateX(${whipX * 0.25}px)` }}>
          <Img src={src(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(7px) brightness(0.62) saturate(0.7) contrast(1.15) sepia(0.2)" }} />
        </AbsoluteFill>
        {/* grade: sombras frías, luces cálidas, viñeta */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,15,12,0.35), rgba(28,58,60,0.25) 45%, rgba(11,15,12,0.85))", mixBlendMode: "multiply" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%)" }} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 30% at 50% 50%, rgba(255,140,50,${0.10 + 0.06 * Math.sin(f / 9)}), rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${lerp(60, -60, tAll) + whipX * 0.6}px)` }}>
          <div style={{ fontFamily: SERIF, fontSize: 820, lineHeight: 1, color: "rgba(0,0,0,0)", WebkitTextStroke: "2px rgba(242,193,78,0.10)", opacity: ease((f - 4) / 20), marginTop: -40 }}>
            {String(n).padStart(2, "0")}
          </div>
        </AbsoluteFill>
        {ghosts.map((g) => <Content key={g} ghost={g} />)}
        <Content />

        {/* barra de progreso del video */}
        <div style={{ position: "absolute", left: (1920 - barW) / 2, top: 952, width: barW, opacity: barIn * (1 - whip), transform: `translateY(${(1 - barIn) * 10}px)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: barW, height: 2, background: "rgba(241,235,221,0.18)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: barW * fillT, height: 2, background: `linear-gradient(90deg, rgba(255,122,26,0.4), ${HK.orange})`, boxShadow: "0 0 10px rgba(255,122,26,0.6)" }} />
          {Array.from({ length: total + 1 }).map((_, i) => {
            const x = (barW * i) / total;
            const cur = i === n - 1;
            const passed = i / total <= fillT + 1e-6;
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: x - 0.75, top: -6, width: 1.5, height: 14, background: passed ? HK.orange : "rgba(241,235,221,0.35)" }} />
                {i < total && (
                  <div style={{ position: "absolute", left: x + barW / total / 2 - 40, width: 80, top: 16, textAlign: "center", fontFamily: MONO, fontSize: 15,
                    letterSpacing: "0.12em", color: cur ? HK.bone : "rgba(241,235,221,0.35)" }}>{String(i + 1).padStart(2, "0")}</div>
                )}
              </React.Fragment>
            );
          })}
          {/* cabeza luminosa */}
          <div style={{ position: "absolute", left: barW * fillT - 5, top: -4, width: 10, height: 10, borderRadius: 5, background: "#FFE2C2",
            boxShadow: `0 0 12px 4px rgba(255,122,26,0.8), 0 0 30px 8px rgba(255,122,26,0.35)` }} />
        </div>

        {/* flash de entrada + salida */}
        <Burn f={f} peak={3} len={22} seed={n * 13 + 1} />
        <Burn f={f} peak={outStart + EXIT * 0.55} len={EXIT * 1.3} seed={n * 29 + 5} fromRight />
        {/* flash blanco-cálido del corte */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 90% at 30% 50%, #FFD9A8, #FF8A2A 55%, #7A1E00)", opacity: Math.max(0.5 * Math.pow(1 - kick, 2), 0.3 * Math.sin(Math.PI * clamp((tOut - 0.35) / 0.5))), mixBlendMode: "screen" }} />
      </AbsoluteFill>

      {/* grano + barras de gate */}
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.3 }}>
        <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: "inset 0 0 180px rgba(0,0,0,0.6)" }} />
    </AbsoluteFill>
  );
};
