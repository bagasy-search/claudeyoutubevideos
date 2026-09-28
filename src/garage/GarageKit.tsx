// GarageKit.tsx — kit PREMIUM del canal "Cole Brennan Garage" (autos chinos / EV, inglés).
// Look "DIAGNOSTIC BAY": grafito casi negro, ámbar de cinta de peligro, rojo de testigo del tablero,
// blanco frío; titulares en Anton/Barlow Condensed y los DATOS en JetBrains Mono (lectura de escáner).
// Todo componente recibe `totalF` (= duración real del cue) y reparte entrada/salida contra eso.
// Las rutas de imagen llegan YA pasadas por staticFile() (lo hace Comp.tsx del kit).
// ⛔ Sin <Video> (nada de video acá), sin sfx en runtime, sin textos por defecto de otro video.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: ANTON } = loadAnton();
export const { fontFamily: BARLOW } = loadBarlow("normal", { weights: ["500", "600", "700", "800"] });
export const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "600", "700"] });
export const { fontFamily: INTER } = loadInter("normal", { weights: ["400", "500", "600"] });

export const G = {
  ink: "#0B0C0E",
  panel: "#15171B",
  line: "rgba(255,255,255,0.10)",
  white: "#F4F2EC",
  dim: "rgba(244,242,236,0.62)",
  amber: "#FFB200",
  red: "#FF3B2F",
  green: "#39D98A",
  cyan: "#5BC8F5",
};

export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const lerp = (f: number, a: number, b: number, x: number, y: number) => interpolate(f, [a, b], [x, y], { ...cl, easing: ease });

/** entrada/salida estándar contra la duración real */
export const useIO = (totalF: number, inF = 14, outF = 10) => {
  const f = useCurrentFrame();
  const inP = lerp(f, 0, inF, 0, 1);
  const outP = interpolate(f, [Math.max(inF + 1, totalF - outF), totalF], [1, 0], cl);
  return { f, inP, outP, a: Math.min(inP, outP) };
};

export const fmt = (n: number, dec = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ───────────────────────── capas de fondo ─────────────────────────

/** Fondo de todas las escenas "tapa": la foto del momento desenfocada y oscurecida, con deriva
 *  lenta, viñeta, grano y una barrida de luz de taller. Da profundidad sin robarle foco a la pieza. */
export const BayBg: React.FC<{ image?: string; totalF: number; tint?: string }> = ({ image, totalF, tint = G.amber }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, Math.max(2, totalF)], [1.12, 1.04], cl);
  const sweep = interpolate(f, [0, Math.max(2, totalF)], [-40, 140], cl);
  return (
    <AbsoluteFill style={{ background: G.ink, overflow: "hidden" }}>
      {image ? (
        <Img src={image} style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", filter: "blur(22px) brightness(0.38) saturate(0.9)", transform: `scale(${z.toFixed(4)})` }} />
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.78) 100%)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 18}%, ${tint}14 ${sweep}%, transparent ${sweep + 18}%)` }} />
      {/* rejilla técnica tenue, como la pantalla de un escáner */}
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <Grain />
    </AbsoluteFill>
  );
};

/** grano animado barato (SVG turbulence con semilla por cuadro) */
export const Grain: React.FC<{ o?: number }> = ({ o = 0.09 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: o, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`gn${f % 7}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 7} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#gn${f % 7})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** foto flotante con marco, sombra profunda y parallax/tilt 3D leve */
export const FloatPhoto: React.FC<{ src: string; w: number; h: number; x: number; y: number; delay?: number; tilt?: number; tag?: string; tagColor?: string }> = ({ src, w, h, x, y, delay = 4, tilt = -4, tag, tagColor = G.amber }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 90, mass: 0.9 } });
  const drift = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], cl);
  const inner = 1.08 - 0.06 * drift;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 1400 }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `translateY(${((1 - s) * 90).toFixed(1)}px) rotateY(${(tilt * (1 - drift * 0.6)).toFixed(2)}deg) rotateZ(${((1 - s) * -3 + tilt * 0.12).toFixed(2)}deg) scale(${(0.92 + 0.08 * s).toFixed(4)})`,
        opacity: s, boxShadow: "0 40px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.12)", borderRadius: 10, overflow: "hidden", background: "#000",
      }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${inner.toFixed(4)})` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.08), transparent 30%, transparent 70%, rgba(0,0,0,0.35))" }} />
        {tag ? (
          <div style={{ position: "absolute", left: 18, top: 18, padding: "6px 12px", background: tagColor, color: G.ink, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>{tag}</div>
        ) : null}
      </div>
    </div>
  );
};

/** cinta de peligro diagonal que barre la pantalla */
export const HazardTape: React.FC<{ y: number; h?: number; delay?: number; angle?: number; color?: string; dir?: 1 | -1 }> = ({ y, h = 46, delay = 0, angle = -4, color = G.amber, dir = 1 }) => {
  const f = useCurrentFrame();
  const p = lerp(f, delay, delay + 16, 0, 1);
  const crawl = (f * 2.2) % 64;
  return (
    <div style={{ position: "absolute", left: -120, right: -120, top: y, height: h, transform: `rotate(${angle}deg) translateX(${((1 - p) * 2200 * -dir).toFixed(0)}px)`, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
      <div style={{ position: "absolute", inset: 0, left: -64, backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0 32px, ${G.ink} 32px 64px)`, transform: `translateX(${(crawl * dir).toFixed(1)}px)` }} />
    </div>
  );
};

/** íconos de testigo del tablero (trazos simples, se ven en cualquier tamaño) */
export type LampIcon = "engine" | "battery" | "door" | "warning" | "dollar" | "wrench" | "chip" | "flag";
export const Lamp: React.FC<{ icon: LampIcon; size: number; color: string }> = ({ icon, size, color }) => {
  const s = { fill: "none", stroke: color, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {icon === "engine" && (<g {...s}><path d="M18 40h10l6-8h24l4 8h10v8h8v-6h6v24h-6v-6h-8v10H40l-8-8H18z" /><path d="M8 50h10M34 26h20" /></g>)}
      {icon === "battery" && (<g {...s}><rect x="14" y="30" width="72" height="46" rx="4" /><path d="M26 30v-8h12v8M62 30v-8h12v8M26 53h14M66 46v14M59 53h14" /></g>)}
      {icon === "door" && (<g {...s}><path d="M28 14h44v72H28z" /><path d="M60 50h6" /><path d="M14 86h72" /></g>)}
      {icon === "warning" && (<g {...s}><path d="M50 12 90 84H10z" /><path d="M50 38v22M50 70v2" /></g>)}
      {icon === "dollar" && (<g {...s}><circle cx="50" cy="50" r="36" /><path d="M62 36c-4-5-22-7-24 3s24 8 24 18-20 9-26 2M50 24v52" /></g>)}
      {icon === "wrench" && (<g {...s}><path d="M64 14a18 18 0 0 0-16 26L14 74l12 12 34-34a18 18 0 0 0 26-16l-10 8-10-4-4-10z" /></g>)}
      {icon === "chip" && (<g {...s}><rect x="26" y="26" width="48" height="48" rx="4" /><rect x="38" y="38" width="24" height="24" /><path d="M36 12v14M50 12v14M64 12v14M36 74v14M50 74v14M64 74v14M12 36h14M12 50h14M12 64h14M74 36h14M74 50h14M74 64h14" /></g>)}
      {icon === "flag" && (<g {...s}><path d="M22 88V12M22 14h52l-10 16 10 16H22" /></g>)}
    </svg>
  );
};

// ───────────────────────── 1. GRegret — carta de capítulo ─────────────────────────

export const GRegret: React.FC<{ totalF: number; index: number; title: string; sub?: string; image: string; icon?: LampIcon }> = ({ totalF, index, title, sub, image, icon = "warning" }) => {
  const { f, a } = useIO(totalF, 10, 10);
  const { fps } = useVideoConfig();
  const slam = spring({ frame: f - 6, fps, config: { damping: 11, stiffness: 160 } });
  const numScale = 2.4 - 1.4 * slam;
  const shake = f > 8 && f < 16 ? Math.sin(f * 3.1) * (16 - f) * 1.4 : 0;
  const words = title.split(" ");
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.red} />
      <HazardTape y={70} delay={0} angle={-3} />
      <HazardTape y={960} delay={4} angle={-3} dir={-1} />
      <FloatPhoto src={image} w={820} h={520} x={1010} y={250} delay={10} tilt={-7} tag={`CASE FILE 0${index}`} tagColor={G.red} />
      <div style={{ position: "absolute", left: 120, top: 250, transform: `translateX(${shake.toFixed(1)}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: lerp(f, 4, 14, 0, 1) }}>
          <Lamp icon={icon} size={64} color={G.red} />
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: G.red, letterSpacing: 6 }}>REGRET</div>
        </div>
        <div style={{ fontFamily: ANTON, fontSize: 300, lineHeight: 0.9, color: G.white, transform: `scale(${numScale.toFixed(3)})`, transformOrigin: "left center", textShadow: "0 20px 60px rgba(0,0,0,0.8)", marginTop: 6 }}>
          #{index}
        </div>
        <div style={{ maxWidth: 820, marginTop: 20 }}>
          {words.map((w, i) => {
            const p = lerp(f, 14 + i * 3, 26 + i * 3, 0, 1);
            return (
              <span key={i} style={{ display: "inline-block", marginRight: 18, fontFamily: BARLOW, fontWeight: 800, fontSize: 78, lineHeight: 1.02, textTransform: "uppercase", color: i === words.length - 1 ? G.amber : G.white, opacity: p, transform: `translateY(${((1 - p) * 40).toFixed(1)}px)` }}>{w}</span>
            );
          })}
        </div>
        {sub ? (
          <div style={{ marginTop: 22, fontFamily: INTER, fontWeight: 500, fontSize: 32, color: G.dim, maxWidth: 780, opacity: lerp(f, 30, 44, 0, 1) }}>{sub}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 2. GPriceCut — la etiqueta que se desploma ─────────────────────────

export const GPriceCut: React.FC<{ totalF: number; model: string; before: number; after: number; currency?: string; pct?: number; note?: string; image: string }> = ({ totalF, model, before, after, currency = "$", pct, note, image }) => {
  const { f, a } = useIO(totalF);
  const { fps } = useVideoConfig();
  const card = spring({ frame: f - 4, fps, config: { damping: 16, stiffness: 110 } });
  const strike = lerp(f, 22, 34, 0, 1);
  const count = interpolate(f, [34, 70], [before, after], { ...cl, easing: Easing.out(Easing.cubic) });
  const stampS = spring({ frame: f - 60, fps, config: { damping: 9, stiffness: 200 } });
  const p = pct ?? Math.round((1 - after / before) * 100);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.red} />
      <FloatPhoto src={image} w={1060} h={640} x={90} y={220} delay={2} tilt={6} />
      {/* etiqueta de precio tipo ventanilla */}
      <div style={{ position: "absolute", right: 110, top: 190, width: 640, background: G.white, color: G.ink, padding: "34px 40px 40px", transform: `translateX(${((1 - card) * 700).toFixed(0)}px) rotate(${(2 - 2 * card + 1.5).toFixed(2)}deg)`, boxShadow: "0 50px 100px rgba(0,0,0,0.7)", borderTop: `14px solid ${G.ink}` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: "#666" }}>MSRP · WINDOW STICKER</div>
        <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 60, lineHeight: 1, textTransform: "uppercase", marginTop: 10 }}>{model}</div>
        <div style={{ height: 2, background: "#0002", margin: "22px 0" }} />
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color: strike > 0.5 ? "#8a8a8a" : G.ink }}>{currency}{fmt(before)}</div>
          <div style={{ position: "absolute", left: -8, top: "52%", height: 8, width: `${(strike * 108).toFixed(1)}%`, background: G.red, transform: "rotate(-6deg)", transformOrigin: "left" }} />
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 110, lineHeight: 1.05, color: G.red, opacity: lerp(f, 32, 38, 0, 1) }}>{currency}{fmt(Math.round(count))}</div>
        {note ? <div style={{ fontFamily: INTER, fontSize: 26, color: "#444", marginTop: 10 }}>{note}</div> : null}
        <div style={{ position: "absolute", right: -40, bottom: -50, width: 220, height: 220, borderRadius: "50%", border: `8px solid ${G.red}`, color: G.red, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: "rgba(244,242,236,0.92)", transform: `scale(${(2.2 - 1.2 * stampS).toFixed(3)}) rotate(-14deg)`, opacity: Math.min(1, stampS * 1.4) }}>
          <div style={{ fontFamily: ANTON, fontSize: 84, lineHeight: 0.9 }}>−{p}%</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 3 }}>OVERNIGHT</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 3. GValueDrop — la curva de depreciación ─────────────────────────

export const GValueDrop: React.FC<{ totalF: number; title: string; values: number[] | string; labels?: string[]; prefix?: string; image: string; sub?: string }> = ({ totalF, title, values: valuesIn, labels = [], prefix = "$", image, sub }) => {
  const { f, a } = useIO(totalF);
  const W = 1100, H = 480, X0 = 90, Y0 = 60;
  const values = (Array.isArray(valuesIn) ? valuesIn : String(valuesIn).split(/[,;\s]+/)).map(Number).filter((n) => Number.isFinite(n));
  const vs = values.length >= 2 ? values : [100, 60];
  const max = Math.max(...vs), min = Math.min(...vs) * 0.8;
  const pts = vs.map((v, i) => [X0 + (i / (vs.length - 1)) * W, Y0 + (1 - (v - min) / (max - min)) * H]);
  const draw = lerp(f, 12, Math.min(totalF - 20, 70), 0, 1);
  const upto = draw * (pts.length - 1);
  const k = Math.floor(upto), fr = upto - k;
  const vis = pts.slice(0, k + 1);
  if (k < pts.length - 1) vis.push([pts[k][0] + (pts[k + 1][0] - pts[k][0]) * fr, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * fr]);
  const d = vis.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L${vis[vis.length - 1][0].toFixed(1)},${Y0 + H} L${X0},${Y0 + H} Z`;
  const head = vis[vis.length - 1];
  const curV = vs[Math.min(vs.length - 1, k)] + ((vs[Math.min(vs.length - 1, k + 1)] - vs[Math.min(vs.length - 1, k)]) * fr);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.red} />
      <div style={{ position: "absolute", left: 120, top: 90, fontFamily: BARLOW, fontWeight: 800, fontSize: 70, textTransform: "uppercase", color: G.white, opacity: lerp(f, 0, 12, 0, 1) }}>{title}</div>
      {sub ? <div style={{ position: "absolute", left: 122, top: 176, fontFamily: INTER, fontSize: 30, color: G.dim }}>{sub}</div> : null}
      <div style={{ position: "absolute", left: 110, top: 280, width: W + 200, height: H + 160, background: "rgba(21,23,27,0.82)", border: `1px solid ${G.line}`, borderRadius: 14, boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
        <svg width={W + 200} height={H + 160}>
          {[0, 1, 2, 3].map((i) => <line key={i} x1={X0} x2={X0 + W} y1={Y0 + (i * H) / 3} y2={Y0 + (i * H) / 3} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />)}
          <defs><linearGradient id="gvd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={G.red} stopOpacity={0.45} /><stop offset="1" stopColor={G.red} stopOpacity={0} /></linearGradient></defs>
          <path d={area} fill="url(#gvd)" />
          <path d={d} fill="none" stroke={G.red} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={head[0]} cy={head[1]} r={14} fill={G.red} />
          <circle cx={head[0]} cy={head[1]} r={24 + (f % 20)} fill="none" stroke={G.red} strokeOpacity={1 - (f % 20) / 20} strokeWidth={3} />
          {labels.map((l, i) => (
            <text key={i} x={X0 + (i / Math.max(1, labels.length - 1)) * W} y={Y0 + H + 56} fill={G.dim} fontFamily={MONO} fontSize={24} textAnchor="middle">{l}</text>
          ))}
        </svg>
        <div style={{ position: "absolute", left: Math.min(head[0] + 24, W - 120), top: Math.max(6, head[1] - 90), fontFamily: MONO, fontWeight: 700, fontSize: 54, color: G.white, textShadow: "0 6px 20px #000" }}>{prefix}{fmt(Math.round(curV))}</div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 4. GGraveyard — marcas que desaparecieron ─────────────────────────

export const GGraveyard: React.FC<{ totalF: number; title: string; items: { name: string; year: string; note?: string }[]; image: string }> = ({ totalF, title, items, image }) => {
  const { f, a } = useIO(totalF);
  const { fps } = useVideoConfig();
  const n = Math.max(1, items.length);
  const step = Math.max(8, Math.min(22, Math.floor((totalF - 40) / (n + 1))));
  const cardW = Math.min(400, Math.floor((1680 - (n - 1) * 30) / n));
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.red} />
      <div style={{ position: "absolute", left: 120, top: 110, display: "flex", alignItems: "center", gap: 20 }}>
        <Lamp icon="flag" size={60} color={G.red} />
        <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 72, textTransform: "uppercase", color: G.white }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, display: "flex", gap: 30 }}>
        {items.map((it, i) => {
          const t0 = 8 + i * step;
          const s = spring({ frame: f - t0, fps, config: { damping: 15, stiffness: 120 } });
          const dead = spring({ frame: f - t0 - 14, fps, config: { damping: 10, stiffness: 220 } });
          return (
            <div key={i} style={{ width: cardW, height: 420, position: "relative", background: G.panel, border: `1px solid ${G.line}`, borderRadius: 12, padding: 34, transform: `translateY(${((1 - s) * 160).toFixed(0)}px)`, opacity: s, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", filter: `grayscale(${dead.toFixed(2)})`, overflow: "hidden" }}>
              <div style={{ fontFamily: MONO, fontSize: 24, color: G.dim, letterSpacing: 3 }}>EV MAKER</div>
              <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 70, lineHeight: 1, color: G.white, textTransform: "uppercase", marginTop: 16 }}>{it.name}</div>
              {it.note ? <div style={{ fontFamily: INTER, fontSize: 26, color: G.dim, marginTop: 16, lineHeight: 1.3 }}>{it.note}</div> : null}
              <div style={{ position: "absolute", left: 34, bottom: 34, fontFamily: MONO, fontWeight: 700, fontSize: 44, color: G.amber }}>{it.year}</div>
              <div style={{ position: "absolute", left: "50%", top: "46%", transform: `translate(-50%,-50%) rotate(-16deg) scale(${(2 - dead).toFixed(3)})`, opacity: dead, border: `6px solid ${G.red}`, color: G.red, padding: "6px 22px", fontFamily: ANTON, fontSize: 64, letterSpacing: 4, background: "rgba(11,12,14,0.7)" }}>GONE</div>
              {/* grieta */}
              <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M62 0 L55 22 L66 38 L52 60 L60 78 L48 100" stroke="rgba(255,255,255,0.35)" strokeWidth={0.6} fill="none" strokeDasharray="140" strokeDashoffset={140 - 140 * dead} />
              </svg>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5. GRecall — el aviso de recall ─────────────────────────

export const GRecall: React.FC<{ totalF: number; brand: string; count: number; models: string; issue: string; year: string; image: string }> = ({ totalF, brand, count, models, issue, year, image }) => {
  const { f, a } = useIO(totalF);
  const { fps } = useVideoConfig();
  const doc = spring({ frame: f - 2, fps, config: { damping: 17, stiffness: 100 } });
  const n = interpolate(f, [16, 56], [0, count], { ...cl, easing: Easing.out(Easing.cubic) });
  const st = spring({ frame: f - 50, fps, config: { damping: 9, stiffness: 210 } });
  const row = (lab: string, val: string, i: number) => (
    <div style={{ display: "flex", gap: 20, padding: "14px 0", borderBottom: "2px dashed #0002", opacity: lerp(f, 12 + i * 5, 22 + i * 5, 0, 1) }}>
      <div style={{ width: 190, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#777", letterSpacing: 2 }}>{lab}</div>
      <div style={{ flex: 1, fontFamily: INTER, fontWeight: 600, fontSize: 30, color: G.ink }}>{val}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.red} />
      <FloatPhoto src={image} w={760} h={500} x={1060} y={300} delay={8} tilt={-8} />
      <div style={{ position: "absolute", left: 130, top: 110, width: 900, background: "#F2EFE6", padding: "40px 48px", transform: `translateY(${((1 - doc) * 900).toFixed(0)}px) rotate(${(-1.5 + (1 - doc) * 6).toFixed(2)}deg)`, boxShadow: "0 60px 120px rgba(0,0,0,0.75)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: "#555" }}>SAFETY RECALL NOTICE</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#555" }}>{year}</div>
        </div>
        <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 84, lineHeight: 1, color: G.ink, textTransform: "uppercase", marginTop: 12 }}>{brand}</div>
        <div style={{ height: 6, background: G.red, margin: "18px 0 8px", width: `${lerp(f, 8, 24, 0, 100).toFixed(0)}%` }} />
        {row("VEHICLES", fmt(Math.round(n)), 0)}
        {row("MODELS", models, 1)}
        {row("ISSUE", issue, 2)}
        <div style={{ position: "absolute", right: 40, bottom: 50, transform: `rotate(-12deg) scale(${(2.4 - 1.4 * st).toFixed(3)})`, opacity: Math.min(1, st * 1.3), border: `8px solid ${G.red}`, color: G.red, fontFamily: ANTON, fontSize: 96, padding: "0 26px", letterSpacing: 6, mixBlendMode: "multiply" }}>RECALL</div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 6. GTariff — barras de arancel tipo manómetro ─────────────────────────

export const GTariff: React.FC<{ totalF: number; title: string; rows: { label: string; value: number; note?: string }[]; image: string; suffix?: string }> = ({ totalF, title, rows, image, suffix = "%" }) => {
  const { f, a } = useIO(totalF);
  const max = Math.max(100, ...rows.map((r) => r.value));
  const n = Math.max(1, rows.length);
  const step = Math.max(6, Math.min(16, Math.floor((totalF - 50) / n)));
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.amber} />
      <div style={{ position: "absolute", left: 140, top: 110, fontFamily: BARLOW, fontWeight: 800, fontSize: 76, textTransform: "uppercase", color: G.white }}>{title}</div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 270, display: "flex", flexDirection: "column", gap: 34 }}>
        {rows.map((r, i) => {
          const t0 = 10 + i * step;
          const p = lerp(f, t0, t0 + 26, 0, 1);
          const v = r.value * p;
          const col = r.value >= 90 ? G.red : r.value >= 30 ? G.amber : G.green;
          return (
            <div key={i} style={{ opacity: lerp(f, t0 - 4, t0 + 4, 0, 1) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 50, color: G.white, textTransform: "uppercase" }}>{r.label}{r.note ? <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 26, color: G.dim, textTransform: "none", marginLeft: 18 }}>{r.note}</span> : null}</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 60, color: col }}>{Math.round(v)}{suffix}</div>
              </div>
              <div style={{ height: 30, marginTop: 10, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${((v / max) * 100).toFixed(2)}%`, background: `linear-gradient(90deg, ${col}88, ${col})`, boxShadow: `0 0 30px ${col}66` }} />
                {Array.from({ length: 20 }).map((_, k) => <div key={k} style={{ position: "absolute", top: 0, bottom: 0, left: `${k * 5}%`, width: 2, background: "rgba(11,12,14,0.6)" }} />)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 7. GChecklist — la planilla del taller ─────────────────────────

export const GChecklist: React.FC<{ totalF: number; title: string; items: { text: string }[]; active?: number; image?: string; kicker?: string }> = ({ totalF, title, items, active = 0, image, kicker = "PRE-PURCHASE INSPECTION" }) => {
  const { f, a } = useIO(totalF);
  const { fps } = useVideoConfig();
  const board = spring({ frame: f, fps, config: { damping: 18, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.green} />
      <div style={{ position: "absolute", left: 420, top: 60, width: 1080, height: 960, background: "#8B5E34", borderRadius: 24, transform: `translateY(${((1 - board) * 400).toFixed(0)}px) rotate(${(-1 + (1 - board) * 4).toFixed(2)}deg)`, boxShadow: "0 60px 120px rgba(0,0,0,0.8)", padding: 36 }}>
        <div style={{ position: "absolute", left: "50%", top: -26, transform: "translateX(-50%)", width: 300, height: 70, background: "linear-gradient(#cfd2d6,#8d9196)", borderRadius: 12, boxShadow: "0 8px 16px rgba(0,0,0,0.5)" }} />
        <div style={{ background: "#F4F1E8", width: "100%", height: "100%", padding: "56px 60px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: "#777" }}>{kicker}</div>
          <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 62, lineHeight: 1.02, textTransform: "uppercase", color: G.ink, margin: "8px 0 26px" }}>{title}</div>
          {items.map((it, i) => {
            const done = i < active, cur = i === active;
            const p = cur ? lerp(f, 16, 30, 0, 1) : done ? 1 : 0;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: "11px 14px", background: cur ? "rgba(255,178,0,0.22)" : "transparent", borderRadius: 6, opacity: done ? 0.55 : 1 }}>
                <div style={{ width: 44, height: 44, border: `4px solid ${G.ink}`, borderRadius: 4, position: "relative", flexShrink: 0 }}>
                  <svg width={60} height={60} style={{ position: "absolute", left: -4, top: -14 }} viewBox="0 0 60 60"><path d="M8 32 L24 48 L56 8" fill="none" stroke={cur ? "#D22" : "#1a7a3c"} strokeWidth={8} strokeLinecap="round" strokeDasharray="80" strokeDashoffset={80 - 80 * p} /></svg>
                </div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: "#888", width: 46 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: INTER, fontWeight: cur ? 600 : 500, fontSize: cur ? 36 : 30, color: G.ink, lineHeight: 1.2 }}>{it.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 8. GBigStat — número de odómetro ─────────────────────────

export const Drum: React.FC<{ digit: number; f: number; t0: number; size: number }> = ({ digit, f, t0, size }) => {
  const turns = 2;
  const p = lerp(f, t0, t0 + 34, 0, 1);
  const pos = (turns * 10 + digit) * p;
  const h = size * 1.1;
  return (
    <div style={{ width: size * 0.62, height: h, overflow: "hidden", position: "relative", background: "linear-gradient(#050506, #1c1e22 50%, #050506)", borderRadius: 6, margin: "0 3px", boxShadow: "inset 0 10px 20px rgba(0,0,0,0.9), inset 0 -10px 20px rgba(0,0,0,0.9)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -(pos % 10) * h, fontFamily: MONO, fontWeight: 700, fontSize: size, lineHeight: `${h}px`, color: G.white, textAlign: "center" }}>
        {Array.from({ length: 11 }).map((_, k) => <div key={k} style={{ height: h }}>{k % 10}</div>)}
      </div>
    </div>
  );
};

export const GBigStat: React.FC<{ totalF: number; value: number; prefix?: string; suffix?: string; label: string; sub?: string; image: string; color?: string }> = ({ totalF, value, prefix = "", suffix = "", label, sub, image, color = G.amber }) => {
  const { f, a } = useIO(totalF);
  const txt = fmt(Math.round(value));
  let di = 0;
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={color} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 8, color, opacity: lerp(f, 0, 10, 0, 1), marginBottom: 26 }}>{label.toUpperCase()}</div>
        <div style={{ display: "flex", alignItems: "center", padding: "22px 26px", background: "rgba(11,12,14,0.85)", border: `2px solid ${color}55`, borderRadius: 16, boxShadow: `0 0 80px ${color}22, 0 40px 90px rgba(0,0,0,0.7)` }}>
          {prefix ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 150, color, marginRight: 10 }}>{prefix}</div> : null}
          {txt.split("").map((ch, i) => /\d/.test(ch)
            ? <Drum key={i} digit={Number(ch)} f={f} t0={6 + (di++) * 3} size={170} />
            : <div key={i} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 150, color: G.dim, margin: "0 2px" }}>{ch}</div>)}
          {suffix ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 130, color, marginLeft: 12 }}>{suffix}</div> : null}
        </div>
        {sub ? <div style={{ marginTop: 34, fontFamily: BARLOW, fontWeight: 700, fontSize: 56, color: G.white, textTransform: "uppercase", maxWidth: 1500, textAlign: "center", opacity: lerp(f, 30, 44, 0, 1) }}>{sub}</div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── 9. GTimeline — la cronología con cabezal ─────────────────────────

export const GTimeline: React.FC<{ totalF: number; title: string; events: { year: string; text: string }[]; image: string }> = ({ totalF, title, events, image }) => {
  const { f, a } = useIO(totalF);
  const n = Math.max(1, events.length);
  // cabezal LINEAL: cada hito se enciende justo cuando el cabezal lo cruza (con easing se desfasaban)
  const t0 = 10, t1 = Math.max(20, Math.min(totalF - 24, 10 + n * 40));
  const head = interpolate(f, [t0, t1], [0, 1], cl);
  const L = 160, R = 1760;
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.cyan} />
      <div style={{ position: "absolute", left: 160, top: 120, fontFamily: BARLOW, fontWeight: 800, fontSize: 74, textTransform: "uppercase", color: G.white }}>{title}</div>
      <div style={{ position: "absolute", left: L, width: R - L, top: 560, height: 6, background: "rgba(255,255,255,0.15)" }} />
      <div style={{ position: "absolute", left: L, width: (R - L) * head, top: 560, height: 6, background: G.amber, boxShadow: `0 0 24px ${G.amber}` }} />
      <div style={{ position: "absolute", left: L + (R - L) * head - 16, top: 546, width: 32, height: 32, borderRadius: "50%", background: G.amber, boxShadow: `0 0 30px ${G.amber}` }} />
      {events.map((e, i) => {
        const x = L + ((i + 0.5) / n) * (R - L);
        const cruce = t0 + ((i + 0.5) / n) * (t1 - t0);
        const p = lerp(f, cruce - 4, cruce + 10, 0, 1);
        const up = i % 2 === 0;
        return (
          <div key={i} style={{ position: "absolute", left: x - 180, width: 360, top: up ? 250 : 620, opacity: p, transform: `translateY(${((1 - p) * (up ? -30 : 30)).toFixed(0)}px)`, textAlign: "center" }}>
            {up ? null : <div style={{ width: 3, height: 40, background: G.amber, margin: "0 auto 10px" }} />}
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 58, color: G.amber }}>{e.year}</div>
            <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, color: G.white, lineHeight: 1.25, marginTop: 8 }}>{e.text}</div>
            {up ? <div style={{ width: 3, height: 40, background: G.amber, margin: "12px auto 0" }} /> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ───────────────────────── 10. GSplit — expectativa vs realidad ─────────────────────────

export const GSplit: React.FC<{ totalF: number; leftLabel: string; leftText: string; leftImage: string; rightLabel: string; rightText: string; rightImage: string }> = ({ totalF, leftLabel, leftText, leftImage, rightLabel, rightText, rightImage }) => {
  const { f, a } = useIO(totalF);
  const { fps } = useVideoConfig();
  const l = spring({ frame: f, fps, config: { damping: 18, stiffness: 100 } });
  const r = spring({ frame: f - 14, fps, config: { damping: 18, stiffness: 100 } });
  const seam = lerp(f, 0, 20, 0, 1);
  const half = (img: string, lab: string, txt: string, p: number, side: "l" | "r", col: string) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, [side === "l" ? "left" : "right"]: 0, width: "50%", overflow: "hidden", clipPath: side === "l" ? `polygon(0 0, 104% 0, 96% 100%, 0 100%)` : `polygon(4% 0, 100% 0, 100% 100%, -4% 100%)` } as React.CSSProperties}>
      <Img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.15 - 0.08 * p).toFixed(4)}) translateX(${((1 - p) * (side === "l" ? -60 : 60)).toFixed(0)}px)`, filter: side === "r" ? "saturate(0.75)" : "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.85), rgba(0,0,0,0.05) 55%)" }} />
      <div style={{ position: "absolute", left: side === "l" ? 90 : 130, right: side === "l" ? 130 : 90, bottom: 110, opacity: p, transform: `translateY(${((1 - p) * 40).toFixed(0)}px)` }}>
        <div style={{ display: "inline-block", padding: "6px 16px", background: col, color: G.ink, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 4 }}>{lab.toUpperCase()}</div>
        <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 64, lineHeight: 1.02, color: G.white, textTransform: "uppercase", marginTop: 16 }}>{txt}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: a, background: G.ink }}>
      {half(leftImage, leftLabel, leftText, l, "l", G.green)}
      {half(rightImage, rightLabel, rightText, r, "r", G.red)}
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 8, background: G.amber, transform: `translateX(-50%) skewX(-4.5deg) scaleY(${seam.toFixed(3)})`, boxShadow: `0 0 30px ${G.amber}` }} />
      <div style={{ position: "absolute", left: "50%", top: "44%", transform: `translate(-50%,-50%) scale(${lerp(f, 18, 30, 0, 1).toFixed(3)})`, width: 130, height: 130, borderRadius: "50%", background: G.ink, border: `5px solid ${G.amber}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 60, color: G.amber }}>VS</div>
      <Grain o={0.06} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11. GHeadline — titular cinético sobre la foto ─────────────────────────

export const GHeadline: React.FC<{ totalF: number; words: string[]; hot?: string[]; kicker?: string; image: string }> = ({ totalF, words, hot = [], kicker, image }) => {
  const { f, a } = useIO(totalF);
  const { fps } = useVideoConfig();
  const hotSet = new Set(hot.map((h) => h.toLowerCase().replace(/[^a-z0-9%$]/g, "")));
  const per = Math.max(3, Math.min(8, Math.floor((totalF * 0.45) / Math.max(1, words.length))));
  const z = interpolate(f, [0, Math.max(2, totalF)], [1.06, 1.16], cl);
  return (
    <AbsoluteFill style={{ opacity: a, background: G.ink, overflow: "hidden" }}>
      <Img src={image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})`, filter: "brightness(0.5) saturate(0.85)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,12,14,0.92) 0%, rgba(11,12,14,0.55) 55%, rgba(11,12,14,0.1) 100%)" }} />
      <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 1250, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {kicker ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: G.amber, marginBottom: 20, opacity: lerp(f, 0, 10, 0, 1) }}>{kicker.toUpperCase()}</div> : null}
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 26, rowGap: 4 }}>
          {words.map((w, i) => {
            const s = spring({ frame: f - 4 - i * per, fps, config: { damping: 13, stiffness: 170 } });
            const isHot = hotSet.has(w.toLowerCase().replace(/[^a-z0-9%$]/g, ""));
            return (
              <span key={i} style={{ fontFamily: ANTON, fontSize: 128, lineHeight: 1.02, textTransform: "uppercase", color: isHot ? G.ink : G.white, background: isHot ? G.amber : "transparent", padding: isHot ? "0 14px" : 0, opacity: s, transform: `translateY(${((1 - s) * 60).toFixed(0)}px) scale(${(0.9 + 0.1 * s).toFixed(3)})`, display: "inline-block", textShadow: isHot ? "none" : "0 10px 40px rgba(0,0,0,0.8)" }}>{w}</span>
            );
          })}
        </div>
      </div>
      <Grain o={0.07} />
    </AbsoluteFill>
  );
};

// ───────────────────────── OVERLAYS (van ENCIMA del avatar) ─────────────────────────

/** 12. GWarnLamp — un testigo del tablero se enciende en la esquina con su lectura */
export const GWarnLamp: React.FC<{ totalF: number; icon?: LampIcon; label: string; sub?: string; color?: string; side?: "left" | "right" }> = ({ totalF, icon = "warning", label, sub, color = G.amber, side = "right" }) => {
  const { f, a } = useIO(totalF, 8, 8);
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 180 } });
  // parpadeo de encendido como un testigo real, después fijo
  const flick = f < 14 ? ([1, 0.2, 1, 0.3, 1, 1, 0.5, 1][Math.floor(f / 2)] ?? 1) : 1;
  const pulse = 0.75 + 0.25 * Math.sin(f / 6);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: a }}>
      <div style={{ position: "absolute", [side]: 70, top: 70, display: "flex", alignItems: "center", gap: 22, padding: "18px 30px 18px 22px", background: "rgba(11,12,14,0.82)", border: `2px solid ${color}66`, borderRadius: 16, transform: `scale(${(0.7 + 0.3 * s).toFixed(3)})`, transformOrigin: side === "right" ? "right top" : "left top", boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 ${(40 * pulse).toFixed(0)}px ${color}44` } as React.CSSProperties}>
        <div style={{ opacity: flick, filter: `drop-shadow(0 0 ${(14 * pulse).toFixed(0)}px ${color})` }}><Lamp icon={icon} size={86} color={color} /></div>
        <div>
          <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 50, lineHeight: 1, color: G.white, textTransform: "uppercase" }}>{label}</div>
          {sub ? <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 24, color, marginTop: 6, letterSpacing: 1 }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 13. GReadout — zócalo tipo lectura de escáner OBD, con tipeo */
export const GReadout: React.FC<{ totalF: number; kicker: string; title: string; side?: "left" | "right" }> = ({ totalF, kicker, title, side = "left" }) => {
  const { f, a } = useIO(totalF, 10, 8);
  const bar = lerp(f, 0, 12, 0, 1);
  const chars = Math.floor(interpolate(f, [8, 8 + title.length * 0.9], [0, title.length], cl));
  const caret = Math.floor(f / 8) % 2 === 0 && chars < title.length;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: a }}>
      <div style={{ position: "absolute", [side]: 80, bottom: 120, maxWidth: 1100 } as React.CSSProperties}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: G.ink, background: G.amber, padding: "6px 14px", width: "fit-content", transform: `scaleX(${bar.toFixed(3)})`, transformOrigin: "left" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: G.red, opacity: Math.floor(f / 10) % 2 ? 1 : 0.3 }} />{kicker.toUpperCase()}
        </div>
        <div style={{ marginTop: 8, padding: "16px 26px", background: "rgba(11,12,14,0.85)", borderLeft: `6px solid ${G.amber}`, fontFamily: BARLOW, fontWeight: 700, fontSize: 56, lineHeight: 1.08, color: G.white, textTransform: "uppercase", clipPath: `inset(0 ${((1 - bar) * 100).toFixed(1)}% 0 0)` }}>
          {title.slice(0, chars)}<span style={{ opacity: caret ? 1 : 0, color: G.amber }}>▌</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
