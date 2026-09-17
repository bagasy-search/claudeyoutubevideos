// Kit.tsx — kit PREMIUM CLARO del video `famanchascara` (canal Federer Archivos).
// Look: papel clínico crema + tinta oscura + teal/verde + ámbar, SOBRE footage luminoso de vlog.
// Cada componente = CAPAS: cama (foto/clip con parallax) + tarjeta + tipografía cinética + acento + SFX.
// ⛔ Sin velos negros, sin viñeta, sin grading. ⛔ OffthreadVideo (nunca <Video>). ⛔ Sin Math.random.
// ⛔ Todo texto por PROPS (sin defaults de otro video). Tiempos (hits/flipAt) en SEGUNDOS desde el inicio
//    del componente, calculados por el build contra el mapa de palabras.
import React from "react";
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import { F_INTER, F_OSWALD } from "../VideoEdit/kit/premium/theme";

export const C = {
  paper: "#F8F4EA",
  paper2: "#FFFDF7",
  ink: "#10262A",
  ink2: "#3D5356",
  teal: "#0F9C97",
  tealDeep: "#0B6F6B",
  tealSoft: "#CDEDEA",
  green: "#3E8E57",
  amber: "#E39B2D",
  amberSoft: "#FBE7C4",
  red: "#C8473E",
  redSoft: "#F6D9D5",
  line: "#E4DCC8",
};
const FPS = 30;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.out(Easing.cubic);

const hash01 = (seed: number, salt: number) => {
  let t = (Math.floor(seed) * 2654435761 + Math.floor(salt * 1000003)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// ── helpers ───────────────────────────────────────────────────────────────
const usePop = (atS = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - Math.round(atS * fps), fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });
};
const useOut = (tail = 10) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return interpolate(f, [d - tail, d], [1, 0], clamp);
};

export const Sfx: React.FC<{ at?: number; src: string; vol?: number }> = ({ at = 0, src, vol = 0.32 }) => (
  <Sequence from={Math.max(0, Math.round(at * FPS))} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${src}`)} volume={vol} />
  </Sequence>
);

/** CAMA: foto o clip a pantalla completa con parallax lento. Sin oscurecer (look vlog luminoso). */
export const Bed: React.FC<{ src?: string; seed?: number; blur?: number; wash?: number; startFrom?: number }> = ({ src, seed = 7, blur = 0, wash = 0, startFrom = 0 }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const k = interpolate(f, [0, Math.max(2, d)], [0, 1], clamp);
  const inn = hash01(seed, 1) < 0.5;
  const s = inn ? 1.06 + 0.07 * k : 1.13 - 0.07 * k;
  const ox = 35 + 30 * hash01(seed, 2), oy = 35 + 30 * hash01(seed, 3);
  const style: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${s.toFixed(4)})`, transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
    filter: blur ? `blur(${blur}px)` : undefined,
  };
  if (!src) return <AbsoluteFill style={{ background: C.paper }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.paper }}>
      {/\.mp4$/i.test(src)
        ? <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(startFrom * FPS)} style={style} />
        : <Img src={staticFile(src)} style={style} />}
      {wash > 0 && <AbsoluteFill style={{ background: `rgba(248,244,234,${wash})` }} />}
    </AbsoluteFill>
  );
};

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; accent?: string }> = ({ style, children, accent = C.teal }) => (
  <div style={{
    background: C.paper2, borderRadius: 30, boxShadow: "0 30px 70px rgba(16,38,42,0.28), 0 4px 14px rgba(16,38,42,0.12)",
    borderTop: `10px solid ${accent}`, padding: "38px 46px", color: C.ink, fontFamily: F_INTER, ...style,
  }}>{children}</div>
);
const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.tealDeep }) => (
  <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color }}>{children}</div>
);
const Title: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 64, color = C.ink, style }) => (
  <div style={{ fontFamily: F_INTER, fontWeight: 900, fontSize: size, lineHeight: 1.05, color, letterSpacing: -1, ...style }}>{children}</div>
);
const lift = (p: number, dy = 40): React.CSSProperties => ({ opacity: p, transform: `translateY(${((1 - p) * dy).toFixed(1)}px)` });

// ── 1. SpotCircle — foto + círculo que se dibuja sobre la mancha + etiqueta ─────────────
export const SpotCircle: React.FC<{ bed: string; x: number; y: number; r?: number; label: string; sub?: string; hitAt?: number; durationInFrames?: number }> = ({ bed, x, y, r = 9, label, sub, hitAt = 0.4 }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [hitAt * FPS, hitAt * FPS + 20], [0, 1], { ...clamp, easing: ease });
  const zoom = interpolate(f, [0, hitAt * FPS + 30], [1.0, 1.18], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lab = usePop(hitAt + 0.5);
  const out = useOut();
  const R = r * 10.8; const circ = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${x}% ${y}%` }}>
        <Bed src={bed} seed={11} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={x * 19.2} cy={y * 10.8} r={R} fill="none" stroke={C.amber} strokeWidth={9}
            strokeDasharray={circ} strokeDashoffset={circ * (1 - draw)} strokeLinecap="round" transform={`rotate(-90 ${x * 19.2} ${y * 10.8})`} />
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: x > 55 ? 110 : undefined, right: x > 55 ? undefined : 110, bottom: 120, ...lift(lab, 30), transform: `scale(${0.85 + 0.15 * lab})` }}>
        <Card accent={C.amber} style={{ padding: "26px 40px", maxWidth: 720 }}>
          <Title size={58}>{label}</Title>
          {sub && <div style={{ fontSize: 32, color: C.ink2, marginTop: 10, fontWeight: 600 }}>{sub}</div>}
        </Card>
      </div>
      <Sfx at={hitAt} src="line_draw.mp3" vol={0.25} />
      <Sfx at={hitAt + 0.5} src="sfx_pop.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 2. RecipeCard — la ficha de la receta, fila por fila (hero) ─────────────
export const RecipeCard: React.FC<{ bed: string; photo: string; kicker: string; title: string; rows: { k: string; v: string }[]; hits?: number[]; durationInFrames?: number }> = ({ bed, photo, kicker, title, rows, hits = [] }) => {
  const f = useCurrentFrame();
  const card = usePop(0.15);
  const out = useOut();
  const ph = interpolate(f, [0, 400], [1.08, 1.0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={21} blur={6} wash={0.18} />
      <div style={{ position: "absolute", left: 110, top: 120, width: 640, height: 840, borderRadius: 30, overflow: "hidden", boxShadow: "0 40px 90px rgba(16,38,42,0.35)", transform: `rotate(-2.5deg) translateY(${(1 - card) * 60}px)`, opacity: card, border: "12px solid #fff" }}>
        <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${ph})` }} />
      </div>
      <div style={{ position: "absolute", left: 820, top: 110, width: 990, ...lift(card, 50) }}>
        <Card>
          <Kicker>{kicker}</Kicker>
          <Title size={70} style={{ marginTop: 8, marginBottom: 20 }}>{title}</Title>
          {rows.map((r, i) => {
            const p = interpolate(f, [(hits[i] ?? 0.6 + i * 0.8) * FPS, (hits[i] ?? 0.6 + i * 0.8) * FPS + 12], [0, 1], { ...clamp, easing: ease });
            return (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 26, padding: "18px 0", borderTop: `2px solid ${C.line}`, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
                <div style={{ width: 230, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: C.tealDeep, textTransform: "uppercase" }}>{r.k}</div>
                <div style={{ flex: 1, fontWeight: 800, fontSize: 44, color: C.ink, lineHeight: 1.12 }}>{r.v}</div>
              </div>
            );
          })}
        </Card>
      </div>
      {rows.map((_, i) => <Sfx key={i} at={hits[i] ?? 0.6 + i * 0.8} src="sfx_paper_tick.mp3" vol={0.3} />)}
      <Sfx at={0.1} src="sfx_whoosh_soft.mp3" vol={0.25} />
    </AbsoluteFill>
  );
};

// ── 3. DropsCount — tres gotas que caen y se cuentan ─────────────
export const DropsCount: React.FC<{ bed: string; n: number; label: string; sub?: string; hits?: number[]; durationInFrames?: number }> = ({ bed, n, label, sub, hits = [] }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const panel = usePop(0.1);
  const shown = hits.length ? hits.filter((h) => f >= h * FPS + 14).length : n;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={31} />
      <div style={{ position: "absolute", right: 120, top: 150, width: 700, ...lift(panel) }}>
        <Card accent={C.amber} style={{ textAlign: "center", padding: "40px 40px 50px" }}>
          <svg width={600} height={300} viewBox="0 0 600 300">
            {Array.from({ length: n }).map((_, i) => {
              const at = (hits[i] ?? 0.4 + i * 0.5) * FPS;
              const fall = interpolate(f, [at, at + 14], [-120, 0], { ...clamp, easing: Easing.in(Easing.quad) });
              const op = interpolate(f, [at, at + 4], [0, 1], clamp);
              const sq = interpolate(f, [at + 14, at + 18, at + 24], [1, 0.8, 1], clamp);
              const cx = 300 + (i - (n - 1) / 2) * 170;
              return (
                <g key={i} transform={`translate(${cx} ${150 + fall}) scale(${1 / sq} ${sq})`} opacity={op}>
                  <path d="M0 -95 C 40 -35, 62 0, 62 32 C 62 70, 34 92, 0 92 C -34 92, -62 70, -62 32 C -62 0, -40 -35, 0 -95 Z" fill={C.amber} />
                  <ellipse cx={-22} cy={20} rx={12} ry={22} fill="#fff" opacity={0.55} />
                </g>
              );
            })}
          </svg>
          <Title size={120} color={C.ink} style={{ marginTop: 6 }}>{`${shown} ${label}`}</Title>
          {sub && <div style={{ fontSize: 36, fontWeight: 700, color: C.ink2, marginTop: 10 }}>{sub}</div>}
        </Card>
      </div>
      {Array.from({ length: n }).map((_, i) => <Sfx key={i} at={(hits[i] ?? 0.4 + i * 0.5) + 0.45} src="px_bubble.mp3" vol={0.35} />)}
    </AbsoluteFill>
  );
};

// ── 4. DayNight — las dos mitades de la receta (noche / día) ─────────────
export const DayNight: React.FC<{ nightBed: string; dayBed: string; nightTitle: string; nightText: string; dayTitle: string; dayText: string; flipAt?: number; durationInFrames?: number }> = ({ nightBed, dayBed, nightTitle, nightText, dayTitle, dayText, flipAt = 2 }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const a = usePop(0.1), b = usePop(flipAt);
  const split = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const Half = ({ bed, left, p, title, text, icon, col }: { bed: string; left: boolean; p: number; title: string; text: string; icon: string; col: string }) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: left ? 0 : 960, width: 960, overflow: "hidden", clipPath: `inset(0 ${left ? (1 - split) * 50 : 0}% 0 ${left ? 0 : (1 - split) * 50}%)` }}>
      <AbsoluteFill><Bed src={bed} seed={left ? 41 : 42} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 110, ...lift(p) }}>
        <Card accent={col} style={{ padding: "30px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 64 }}>{icon}</div>
            <Title size={60} color={col}>{title}</Title>
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, marginTop: 12, color: C.ink, lineHeight: 1.15 }}>{text}</div>
        </Card>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out, background: C.paper }}>
      {Half({ bed: nightBed, left: true, p: a, title: nightTitle, text: nightText, icon: "🌙", col: C.tealDeep })}
      {Half({ bed: dayBed, left: false, p: b, title: dayTitle, text: dayText, icon: "☀️", col: C.amber })}
      <div style={{ position: "absolute", left: 955, top: 0, width: 10, height: "100%", background: C.paper2, boxShadow: "0 0 20px rgba(0,0,0,0.2)" }} />
      <Sfx at={0.05} src="sfx_whoosh_soft.mp3" vol={0.25} />
      <Sfx at={flipAt} src="sfx_pop.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 5. PromiseTruth — lo que promete el título vs lo que se puede esperar (2.5D flip) ─────────────
export const PromiseTruth: React.FC<{ bed: string; promise: string; truthTitle: string; truths: string[]; flipAt?: number; hits?: number[]; durationInFrames?: number }> = ({ bed, promise, truthTitle, truths, flipAt = 1.6, hits = [] }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const rot = interpolate(f, [flipAt * FPS, flipAt * FPS + 18], [0, 180], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const inn = usePop(0.05);
  const strike = interpolate(f, [(flipAt - 0.6) * FPS, (flipAt - 0.2) * FPS], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={51} blur={5} wash={0.12} />
      <AbsoluteFill style={{ perspective: 2200, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1180, height: 600, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${rot}deg) scale(${0.9 + 0.1 * inn})`, opacity: inn }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
            <Card accent={C.red} style={{ height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Kicker color={C.red}>LO QUE DICE EL TÍTULO</Kicker>
              <div style={{ position: "relative", marginTop: 26 }}>
                <Title size={96}>{promise}</Title>
                <div style={{ position: "absolute", left: 0, top: "52%", height: 12, width: `${strike * 100}%`, background: C.red, borderRadius: 6 }} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <Card accent={C.green} style={{ height: "100%", boxSizing: "border-box" }}>
              <Kicker color={C.green}>LO HONESTO</Kicker>
              <Title size={70} style={{ marginTop: 10, marginBottom: 24 }}>{truthTitle}</Title>
              {truths.map((t, i) => {
                const at = hits[i] ?? flipAt + 0.8 + i * 0.7;
                const p = interpolate(f, [at * FPS, at * FPS + 12], [0, 1], { ...clamp, easing: ease });
                return (
                  <div key={i} style={{ display: "flex", gap: 22, alignItems: "center", fontSize: 58, fontWeight: 800, padding: "14px 0", opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
                    <div style={{ width: 54, height: 54, borderRadius: 27, background: C.green, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>✓</div>
                    {t}
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={flipAt} src="sfx_whoosh_soft.mp3" vol={0.3} />
      <Sfx at={flipAt - 0.6} src="line_draw.mp3" vol={0.2} />
    </AbsoluteFill>
  );
};

// ── 6. QuoteCard — la frase de la paciente, con su foto ─────────────
export const QuoteCard: React.FC<{ bed: string; image: string; quote: string; attrib: string; durationInFrames?: number }> = ({ bed, image, quote, attrib }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const p = usePop(0.1);
  const words = quote.split(" ");
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={61} blur={8} wash={0.2} />
      <div style={{ position: "absolute", left: 130, top: 170, width: 560, height: 740, borderRadius: 26, overflow: "hidden", border: "14px solid #fff", boxShadow: "0 40px 80px rgba(16,38,42,0.35)", transform: `rotate(2deg) scale(${0.9 + 0.1 * p})`, opacity: p }}>
        <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, 300], [1.12, 1.0], clamp)})` }} />
      </div>
      <div style={{ position: "absolute", left: 790, top: 230, width: 1000 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 220, color: C.teal, lineHeight: 0.6, opacity: p }}>“</div>
        <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 64, lineHeight: 1.18, color: C.ink, background: "rgba(255,253,247,0.92)", padding: "30px 40px", borderRadius: 24, boxShadow: "0 20px 50px rgba(16,38,42,0.18)" }}>
          {words.map((w, i) => {
            const q = interpolate(f, [8 + i * 2.2, 16 + i * 2.2], [0, 1], clamp);
            return <span key={i} style={{ opacity: q }}>{w} </span>;
          })}
          <div style={{ fontSize: 34, fontWeight: 700, color: C.tealDeep, marginTop: 20, opacity: interpolate(f, [20 + words.length * 2.2, 34 + words.length * 2.2], [0, 1], clamp) }}>{attrib}</div>
        </div>
      </div>
      <Sfx at={0.1} src="sfx_pop.mp3" vol={0.35} />
    </AbsoluteFill>
  );
};

// ── 7. SkinDiagram — corte de la piel: melanocitos que el sol "enciende" ─────────────
export const SkinDiagram: React.FC<{ title: string; labels: { text: string }[]; sunAt?: number; spotAt?: number; durationInFrames?: number }> = ({ title, labels, sunAt = 1.2, spotAt = 3 }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const t = usePop(0.05);
  const sun = interpolate(f, [sunAt * FPS, sunAt * FPS + 20], [0, 1], clamp);
  const spot = interpolate(f, [spotAt * FPS, spotAt * FPS + 30], [0, 1], { ...clamp, easing: ease });
  const cam = interpolate(f, [0, 360], [1.0, 1.08], clamp);
  const cells = Array.from({ length: 11 });
  return (
    <AbsoluteFill style={{ opacity: out, background: `linear-gradient(180deg, #EAF6F5 0%, ${C.paper} 100%)` }}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* rayos de sol: salen del sol (arriba a la derecha) hacia la piel */}
          {Array.from({ length: 7 }).map((_, i) => {
            const x0 = 1640, y0 = 170, x1 = 520 + i * 190, y1 = 460;
            return <line key={i} x1={x0} y1={y0} x2={x0 + (x1 - x0) * sun} y2={y0 + (y1 - y0) * sun} stroke={C.amber} strokeWidth={12} strokeLinecap="round" opacity={0.8 * sun} />;
          })}
          <circle cx={1640} cy={170} r={80} fill={C.amber} opacity={Math.max(0.15, sun)} />
          {/* capas de piel */}
          <path d="M0 470 C 400 440, 800 500, 1200 465 S 1700 450, 1920 470 L1920 1080 L0 1080 Z" fill="#F3C9A8" />
          <path d="M0 470 C 400 440, 800 500, 1200 465 S 1700 450, 1920 470 L1920 520 C 1600 510, 1200 530, 800 540 S 300 515, 0 520 Z" fill="#E8B08C" />
          <path d="M0 640 C 500 610, 1100 670, 1920 630 L1920 1080 L0 1080 Z" fill="#EFB7A0" />
          {cells.map((_, i) => {
            const x = 110 + i * 170, y = 610;
            const near = Math.abs(x - 960) < 260;
            const glow = near ? spot : sun * 0.35;
            return (
              <g key={i}>
                <path d={`M${x} ${y} l -40 -60 M${x} ${y} l 40 -62 M${x} ${y} l 0 -70`} stroke="#8A5A3C" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
                <circle cx={x} cy={y} r={30 + glow * 10} fill={near ? `rgb(${Math.round(160 - 60 * glow)},${Math.round(100 - 50 * glow)},${Math.round(60 - 30 * glow)})` : "#A06A46"} />
                {near && <circle cx={x} cy={y} r={50 + 30 * glow} fill={C.amber} opacity={0.25 * glow} />}
              </g>
            );
          })}
          <ellipse cx={960} cy={495} rx={260 * spot} ry={26 * spot} fill="#6E4127" opacity={0.75 * spot} />
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 70, ...lift(t) }}>
        <Card style={{ padding: "22px 36px" }}><Title size={56}>{title}</Title></Card>
      </div>
      {labels.map((l, i) => {
        const at = i === 0 ? sunAt + 0.4 : spotAt + 0.6 + (i - 1) * 0.8;
        const p = usePopSafe(f, at);
        const pos = [{ left: 120, top: 300 }, { left: 1180, top: 760 }, { left: 140, top: 820 }][i] || { left: 140, top: 820 };
        return (
          <div key={i} style={{ position: "absolute", ...pos, opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
            <Card accent={i === 1 ? C.amber : C.teal} style={{ padding: "18px 30px" }}><div style={{ fontSize: 40, fontWeight: 800 }}>{l.text}</div></Card>
          </div>
        );
      })}
      <Sfx at={sunAt} src="sfx_whoosh_soft.mp3" vol={0.2} />
      <Sfx at={spotAt} src="sfx_chime.mp3" vol={0.25} />
    </AbsoluteFill>
  );
};
function usePopSafe(f: number, atS: number) {
  return interpolate(f, [atS * FPS, atS * FPS + 12], [0, 1], { ...clamp, easing: ease });
}

// ── 8. FingerTest — la prueba del dedo: plana vs levantada ─────────────
export const FingerTest: React.FC<{ bed: string; leftImage: string; rightImage: string; leftTag: string; rightTag: string; left: { title: string; sub: string }; right: { title: string; sub: string }; hits?: number[]; durationInFrames?: number }> = ({ bed, leftImage, rightImage, leftTag, rightTag, left, right, hits = [] }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const Col = ({ img, d, at, x, col, tag }: { img: string; d: { title: string; sub: string }; at: number; x: number; col: string; tag: string }) => {
    const p = usePopSafe(f, at);
    return (
      <div style={{ position: "absolute", left: x, top: 130, width: 780, ...lift(p, 60) }}>
        <div style={{ height: 470, borderRadius: 26, overflow: "hidden", border: "12px solid #fff", boxShadow: "0 30px 70px rgba(16,38,42,0.3)" }}>
          <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [at * FPS, at * FPS + 200], [1.15, 1.02], clamp)})` }} />
        </div>
        <Card accent={col} style={{ marginTop: -40, marginLeft: 30, marginRight: 30, position: "relative", padding: "26px 34px" }}>
          <Kicker color={col}>{tag}</Kicker>
          <Title size={52} style={{ marginTop: 6 }}>{d.title}</Title>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.ink2, marginTop: 8 }}>{d.sub}</div>
        </Card>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={81} blur={10} wash={0.3} />
      {Col({ img: leftImage, d: left, at: hits[0] ?? 0.3, x: 140, col: C.green, tag: leftTag })}
      {Col({ img: rightImage, d: right, at: hits[1] ?? 2, x: 1000, col: C.amber, tag: rightTag })}
      <Sfx at={hits[0] ?? 0.3} src="sfx_pop.mp3" vol={0.3} />
      <Sfx at={hits[1] ?? 2} src="sfx_pop.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 9. RedFlags — señales de alarma, tarjeta por tarjeta ─────────────
export const RedFlags: React.FC<{ bed: string; title: string; items: { text: string }[]; hits?: number[]; footer?: string; durationInFrames?: number }> = ({ bed, title, items, hits = [], footer }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const t = usePop(0.05);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={91} blur={9} wash={0.28} />
      <div style={{ position: "absolute", left: 120, top: 90, ...lift(t) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 20, background: C.red, color: "#fff", padding: "16px 34px", borderRadius: 999, fontWeight: 900, fontSize: 46, fontFamily: F_INTER }}>⚠ {title}</div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 230, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        {items.map((it, i) => {
          const at = hits[i] ?? 0.6 + i * 0.9;
          const p = usePopSafe(f, at);
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${(1 - p) * (i % 2 ? 3 : -3)}deg)` }}>
              <Card accent={C.red} style={{ padding: "26px 34px", display: "flex", gap: 24, alignItems: "center" }}>
                <div style={{ minWidth: 70, height: 70, borderRadius: 35, background: C.redSoft, color: C.red, fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1 }}>{it.text}</div>
              </Card>
            </div>
          );
        })}
      </div>
      {footer && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: usePopSafe(f, (hits[items.length] ?? items.length * 0.9 + 1)) }}>
          <span style={{ background: C.ink, color: "#fff", fontFamily: F_INTER, fontWeight: 900, fontSize: 50, padding: "16px 40px", borderRadius: 18 }}>{footer}</span>
        </div>
      )}
      {items.map((_, i) => <Sfx key={i} at={hits[i] ?? 0.6 + i * 0.9} src="sfx_text_thud.mp3" vol={0.25} />)}
    </AbsoluteFill>
  );
};

// ── 10. LabelCallouts — el frasco con flechas a lo que hay que leer en la etiqueta ─────────────
export const LabelCallouts: React.FC<{ image: string; title: string; callouts: { x: number; y: number; text: string; side?: "l" | "r" }[]; hits?: number[]; durationInFrames?: number }> = ({ image, title, callouts, hits = [] }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const t = usePop(0.05);
  const cam = interpolate(f, [0, 420], [1.0, 1.1], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}><Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 70, ...lift(t) }}><Card style={{ padding: "20px 34px" }}><Title size={54}>{title}</Title></Card></div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {callouts.map((c, i) => {
          const at = (hits[i] ?? 0.8 + i * 1) * FPS;
          const d = interpolate(f, [at, at + 12], [0, 1], clamp);
          const lx = c.side === "l" ? 520 : 1400;
          const ly = 260 + i * 190;
          return (
            <g key={i} opacity={d > 0 ? 1 : 0}>
              <line x1={c.x * 19.2} y1={c.y * 10.8} x2={c.x * 19.2 + (lx - c.x * 19.2) * d} y2={c.y * 10.8 + (ly - c.y * 10.8) * d} stroke={C.ink} strokeWidth={5} />
              <circle cx={c.x * 19.2} cy={c.y * 10.8} r={14 * d} fill={C.amber} stroke="#fff" strokeWidth={5} />
            </g>
          );
        })}
      </svg>
      {callouts.map((c, i) => {
        const at = (hits[i] ?? 0.8 + i * 1) + 0.3;
        const p = usePopSafe(f, at);
        const lx = c.side === "l" ? 520 : 1400;
        const ly = 260 + i * 190;
        return (
          <div key={i} style={{ position: "absolute", left: c.side === "l" ? undefined : lx, right: c.side === "l" ? 1920 - lx : undefined, top: ly - 42, opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
            <div style={{ background: C.paper2, borderLeft: `10px solid ${C.teal}`, borderRadius: 16, padding: "14px 26px", fontFamily: F_INTER, fontWeight: 800, fontSize: 40, color: C.ink, boxShadow: "0 16px 36px rgba(16,38,42,0.25)", whiteSpace: "nowrap" }}>{c.text}</div>
          </div>
        );
      })}
      {callouts.map((_, i) => <Sfx key={i} at={(hits[i] ?? 0.8 + i * 1)} src="line_draw.mp3" vol={0.18} />)}
    </AbsoluteFill>
  );
};

// ── 11. ClockRing — anillo que se completa (48 h, 3 semanas…) ─────────────
export const ClockRing: React.FC<{ bed: string; big: string; unit: string; label: string; sub?: string; image?: string; durationInFrames?: number }> = ({ bed, big, unit, label, sub, image }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const p = usePop(0.1);
  const fill = interpolate(f, [8, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const R = 200, circ = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={111} />
      <div style={{ position: "absolute", right: 110, top: 110, width: 760, ...lift(p) }}>
        <Card accent={C.teal} style={{ textAlign: "center" }}>
          <div style={{ position: "relative", width: 480, height: 480, margin: "0 auto" }}>
            <svg width={480} height={480}>
              <circle cx={240} cy={240} r={R} fill={C.tealSoft} stroke={C.line} strokeWidth={26} />
              <circle cx={240} cy={240} r={R} fill="none" stroke={C.teal} strokeWidth={26} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - fill)} transform="rotate(-90 240 240)" />
            </svg>
            {image && <Img src={staticFile(image)} style={{ position: "absolute", left: 90, top: 90, width: 300, height: 300, borderRadius: 150, objectFit: "cover", opacity: 0.35 }} />}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 170, color: C.ink, lineHeight: 0.9 }}>{big}</div>
              <div style={{ fontFamily: F_INTER, fontWeight: 900, fontSize: 44, color: C.tealDeep, letterSpacing: 4 }}>{unit}</div>
            </div>
          </div>
          <Title size={50} style={{ marginTop: 20 }}>{label}</Title>
          {sub && <div style={{ fontSize: 34, fontWeight: 700, color: C.ink2, marginTop: 8 }}>{sub}</div>}
        </Card>
      </div>
      <Sfx at={0.2} src="counter_up.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 12. NoList — lo que NO va en la cara, tachado ─────────────
export const NoList: React.FC<{ bed: string; title: string; items: { text: string; image?: string }[]; hits?: number[]; durationInFrames?: number }> = ({ bed, title, items, hits = [] }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const t = usePop(0.05);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={121} blur={10} wash={0.25} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", ...lift(t) }}>
        <span style={{ background: C.paper2, fontFamily: F_INTER, fontWeight: 900, fontSize: 64, color: C.ink, padding: "14px 44px", borderRadius: 20, boxShadow: "0 16px 40px rgba(16,38,42,0.2)" }}>{title}</span>
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 290, display: "flex", gap: 34, justifyContent: "center" }}>
        {items.map((it, i) => {
          const at = hits[i] ?? 0.5 + i * 0.7;
          const p = usePopSafe(f, at);
          const x = interpolate(f, [(at + 0.35) * FPS, (at + 0.35) * FPS + 8], [0, 1], clamp);
          return (
            <div key={i} style={{ width: 380, opacity: p, transform: `translateY(${(1 - p) * 50}px)` }}>
              <div style={{ background: C.paper2, borderRadius: 26, overflow: "hidden", boxShadow: "0 24px 56px rgba(16,38,42,0.28)", position: "relative" }}>
                {it.image && <Img src={staticFile(it.image)} style={{ width: "100%", height: 380, objectFit: "cover" }} />}
                <div style={{ padding: "22px 20px", fontFamily: F_INTER, fontWeight: 900, fontSize: 44, textAlign: "center", color: C.ink }}>{it.text}</div>
                <svg width={380} height={500} style={{ position: "absolute", left: 0, top: 0 }}>
                  <line x1={40} y1={40} x2={40 + 300 * x} y2={40 + 380 * x} stroke={C.red} strokeWidth={18} strokeLinecap="round" />
                  <line x1={340} y1={40} x2={340 - 300 * x} y2={40 + 380 * x} stroke={C.red} strokeWidth={18} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      {items.map((_, i) => <Sfx key={i} at={(hits[i] ?? 0.5 + i * 0.7) + 0.35} src="stinger_hit.mp3" vol={0.18} />)}
    </AbsoluteFill>
  );
};

// ── 13. MixRatio — 1 gota de ricino + 3 de rosa mosqueta ─────────────
export const MixRatio: React.FC<{ bed: string; title: string; a: { n: number; label: string }; b: { n: number; label: string }; note: string; hits?: number[]; durationInFrames?: number }> = ({ bed, title, a, b, note, hits = [] }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const t = usePop(0.05);
  const pa = usePopSafe(f, hits[0] ?? 0.6), pb = usePopSafe(f, hits[1] ?? 1.6), pn = usePopSafe(f, hits[2] ?? 2.8);
  const Drops = ({ n, col, p }: { n: number; col: string; p: number }) => (
    <div style={{ display: "flex", gap: 14, justifyContent: "center", height: 130 }}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width={80} height={120} viewBox="-60 -100 120 200" style={{ transform: `translateY(${(1 - Math.min(1, p * 1.5 - i * 0.15)) * -60}px)`, opacity: Math.max(0, Math.min(1, p * 1.5 - i * 0.15)) }}>
          <path d="M0 -95 C 40 -35, 62 0, 62 32 C 62 70, 34 92, 0 92 C -34 92, -62 70, -62 32 C -62 0, -40 -35, 0 -95 Z" fill={col} />
        </svg>
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={131} blur={8} wash={0.22} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Card accent={C.teal} style={{ width: 1400, ...lift(t), textAlign: "center" }}>
          <Title size={62}>{title}</Title>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 30 }}>
            <div style={{ width: 420, opacity: pa }}>{Drops({ n: a.n, col: "#C9A646", p: pa })}<div style={{ fontSize: 44, fontWeight: 900 }}>{a.n} {a.label}</div></div>
            <div style={{ fontSize: 110, fontWeight: 900, color: C.teal, opacity: pb }}>+</div>
            <div style={{ width: 520, opacity: pb }}>{Drops({ n: b.n, col: C.amber, p: pb })}<div style={{ fontSize: 44, fontWeight: 900 }}>{b.n} {b.label}</div></div>
          </div>
          <div style={{ marginTop: 30, background: C.amberSoft, borderRadius: 18, padding: "18px 26px", fontSize: 40, fontWeight: 800, opacity: pn }}>{note}</div>
        </Card>
      </AbsoluteFill>
      <Sfx at={hits[0] ?? 0.6} src="px_bubble.mp3" vol={0.3} />
      <Sfx at={hits[1] ?? 1.6} src="px_bubble.mp3" vol={0.3} />
      <Sfx at={hits[2] ?? 2.8} src="sfx_pop.mp3" vol={0.25} />
    </AbsoluteFill>
  );
};

// ── 14. NumberPunch — número grande sobre foto ─────────────
export const NumberPunch: React.FC<{ bed: string; value: string; unit?: string; caption: string; tone?: "teal" | "amber" | "red"; side?: "l" | "r"; durationInFrames?: number }> = ({ bed, value, unit, caption, tone = "teal", side = "l" }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const p = usePop(0.15);
  const col = tone === "amber" ? C.amber : tone === "red" ? C.red : C.teal;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={141} />
      <div style={{ position: "absolute", [side === "l" ? "left" : "right"]: 110, top: 180, width: 820, transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: side === "l" ? "left center" : "right center", opacity: Math.min(1, p * 1.4) } as React.CSSProperties}>
        <Card accent={col}>
          <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 230, lineHeight: 0.95, color: col }}>{value}</div>
          {unit && <div style={{ fontWeight: 900, fontSize: 60, color: C.ink, marginTop: 4 }}>{unit}</div>}
          <div style={{ fontWeight: 700, fontSize: 40, color: C.ink2, marginTop: 14, lineHeight: 1.2, opacity: interpolate(f, [18, 30], [0, 1], clamp) }}>{caption}</div>
        </Card>
      </div>
      <Sfx at={0.15} src="text_slam.mp3" vol={0.22} />
    </AbsoluteFill>
  );
};

// ── 15. ChapterCard — separador de capa ─────────────
export const ChapterCard: React.FC<{ bed: string; number: string; title: string; sub?: string; durationInFrames?: number }> = ({ bed, number, title, sub }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const wipe = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const p = usePopSafe(f, 0.35);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={151} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${wipe * 58}%`, background: "rgba(248,244,234,0.94)", boxShadow: "20px 0 60px rgba(16,38,42,0.2)" }} />
      <div style={{ position: "absolute", left: 120, top: 300, width: 900, ...lift(p, 50) }}>
        <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 64, color: C.teal, letterSpacing: 6 }}>{number}</div>
        <div style={{ width: 140 * p, height: 10, background: C.amber, borderRadius: 5, margin: "14px 0 24px" }} />
        <Title size={96}>{title}</Title>
        {sub && <div style={{ fontFamily: F_INTER, fontSize: 44, fontWeight: 700, color: C.ink2, marginTop: 20 }}>{sub}</div>}
      </div>
      <Sfx at={0} src="sfx_whoosh_soft.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 16. KineticWords (OVERLAY) — palabras clave sobre el plano que haya debajo ─────────────
export const KineticWords: React.FC<{ words: { t: string; hl?: boolean }[]; ats?: number[]; pos?: "low" | "top"; durationInFrames?: number }> = ({ words, ats = [], pos = "low" }) => {
  const f = useCurrentFrame();
  const out = useOut(8);
  return (
    <AbsoluteFill style={{ opacity: out, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, [pos === "low" ? "bottom" : "top"]: 110, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, padding: "0 140px" } as React.CSSProperties}>
        {words.map((w, i) => {
          const at = (ats[i] ?? 0.1 + i * 0.3) * FPS;
          const p = spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 180 } });
          return (
            <span key={i} style={{
              fontFamily: F_INTER, fontWeight: 900, fontSize: 84, lineHeight: 1.1, padding: "6px 26px", borderRadius: 16,
              background: w.hl ? C.amber : C.paper2, color: C.ink, boxShadow: "0 14px 34px rgba(16,38,42,0.3)",
              opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`, display: "inline-block",
            }}>{w.t}</span>
          );
        })}
      </div>
      {words.map((_, i) => <Sfx key={i} at={ats[i] ?? 0.1 + i * 0.3} src="sfx_paper_tick.mp3" vol={0.18} />)}
    </AbsoluteFill>
  );
};

// ── 17. NameTag (OVERLAY) ─────────────
export const NameTag: React.FC<{ name: string; role: string; durationInFrames?: number }> = ({ name, role }) => {
  const f = useCurrentFrame();
  const out = useOut(10);
  const w = interpolate(f, [4, 22], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 110, bottom: 120, display: "flex", alignItems: "stretch", overflow: "hidden", borderRadius: 18, boxShadow: "0 18px 44px rgba(16,38,42,0.3)", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
        <div style={{ width: 16, background: C.teal }} />
        <div style={{ background: C.paper2, padding: "18px 36px" }}>
          <div style={{ fontFamily: F_INTER, fontWeight: 900, fontSize: 54, color: C.ink }}>{name}</div>
          <div style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 32, color: C.tealDeep }}>{role}</div>
        </div>
      </div>
      <Sfx at={0.1} src="sfx_whoosh_soft.mp3" vol={0.2} />
    </AbsoluteFill>
  );
};

// ── 18. WeekTimeline — semana 1 / 2 / 3 / meses, con playhead ─────────────
export const WeekTimeline: React.FC<{ bed: string; title: string; marks: { label: string; sub: string }[]; hits?: number[]; durationInFrames?: number }> = ({ bed, title, marks, hits = [] }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const t = usePop(0.05);
  const n = marks.length;
  const cur = hits.length ? hits.filter((h) => f >= h * FPS).length : n;
  const head = interpolate(f, [0, 1], [0, 0]) + (() => {
    let x = 0;
    for (let i = 0; i < n; i++) { const at = (hits[i] ?? 0.6 + i * 1.2) * FPS; x = Math.max(x, interpolate(f, [at, at + 14], [i === 0 ? 0 : (i - 1) / Math.max(1, n - 1), i / Math.max(1, n - 1)], { ...clamp, easing: ease })); }
    return x;
  })();
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={181} blur={9} wash={0.3} />
      <div style={{ position: "absolute", left: 120, top: 110, ...lift(t) }}><Card style={{ padding: "20px 36px" }}><Title size={60}>{title}</Title></Card></div>
      <div style={{ position: "absolute", left: 300, right: 300, top: 520, height: 14, background: C.line, borderRadius: 7 }}>
        <div style={{ width: `${head * 100}%`, height: "100%", background: C.teal, borderRadius: 7 }} />
      </div>
      {marks.map((m, i) => {
        const x = 300 + (1320 * i) / Math.max(1, n - 1);
        const at = hits[i] ?? 0.6 + i * 1.2;
        const p = usePopSafe(f, at);
        const on = i < cur;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 34, top: 493, width: 68, height: 68, borderRadius: 34, background: on ? C.teal : C.paper2, border: `8px solid ${on ? C.paper2 : C.line}`, boxShadow: "0 8px 20px rgba(16,38,42,0.25)", transform: `scale(${0.8 + 0.3 * p})` }} />
            <div style={{ position: "absolute", left: x - 190, width: 380, top: i % 2 ? 610 : 240, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * (i % 2 ? 30 : -30)}px)` }}>
              <Card accent={on ? C.teal : C.line} style={{ padding: "20px 22px" }}>
                <div style={{ fontFamily: F_OSWALD, fontSize: 52, fontWeight: 700, color: C.tealDeep }}>{m.label}</div>
                <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6, lineHeight: 1.15 }}>{m.sub}</div>
              </Card>
            </div>
          </React.Fragment>
        );
      })}
      {marks.map((_, i) => <Sfx key={i} at={hits[i] ?? 0.6 + i * 1.2} src="node_pop.mp3" vol={0.25} />)}
    </AbsoluteFill>
  );
};

// ── 19. FaqFlip — pregunta que se da vuelta y muestra la respuesta ─────────────
export const FaqFlip: React.FC<{ bed: string; question: string; answer: string; flipAt?: number; tone?: "green" | "amber" | "red"; durationInFrames?: number }> = ({ bed, question, answer, flipAt = 1.5, tone = "green" }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const inn = usePop(0.05);
  const rot = interpolate(f, [flipAt * FPS, flipAt * FPS + 16], [0, 180], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const col = tone === "amber" ? C.amber : tone === "red" ? C.red : C.green;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={191} />
      <div style={{ position: "absolute", right: 120, top: 200, width: 820, height: 560, perspective: 2000 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `rotateX(${rot}deg) scale(${0.85 + 0.15 * inn})`, opacity: inn }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
            <Card accent={C.teal} style={{ height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Kicker>ME PREGUNTAN</Kicker>
              <Title size={68} style={{ marginTop: 14 }}>{question}</Title>
            </Card>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
            <Card accent={col} style={{ height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Kicker color={col}>RESPUESTA</Kicker>
              <Title size={64} style={{ marginTop: 14 }}>{answer}</Title>
            </Card>
          </div>
        </div>
      </div>
      <Sfx at={0.05} src="sfx_pop.mp3" vol={0.25} />
      <Sfx at={flipAt} src="sfx_whoosh_soft.mp3" vol={0.25} />
    </AbsoluteFill>
  );
};

// ── 20. GuideCTA — portada real + QR REAL + dominio (capa over) ─────────────
export const GuideCTA: React.FC<{ bed: string; cover: string; qr: string; domain: string; kicker: string; title: string; sub: string; durationInFrames?: number }> = ({ bed, cover, qr, domain, kicker, title, sub }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const p = usePop(0.1), q = usePopSafe(f, 0.6);
  const tilt = interpolate(f, [0, 300], [-8, -3], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={201} blur={10} wash={0.35} />
      <div style={{ position: "absolute", left: 140, top: 110, width: 600, height: 860, perspective: 1800 }}>
        <Img src={staticFile(cover)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14, boxShadow: "30px 40px 80px rgba(16,38,42,0.4)", transform: `rotateY(${tilt * 2}deg) translateY(${(1 - p) * 80}px)`, opacity: p }} />
      </div>
      <div style={{ position: "absolute", left: 830, top: 130, width: 960, ...lift(p) }}>
        <Card accent={C.amber}>
          <Kicker color={C.tealDeep}>{kicker}</Kicker>
          <Title size={64} style={{ marginTop: 10 }}>{title}</Title>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.ink2, marginTop: 12, lineHeight: 1.25 }}>{sub}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 34, opacity: q, transform: `scale(${0.9 + 0.1 * q})`, transformOrigin: "left center" }}>
            <div style={{ background: "#fff", padding: 20, borderRadius: 18, boxShadow: "0 10px 30px rgba(16,38,42,0.2)" }}>
              <Img src={staticFile(qr)} style={{ width: 360, height: 360, display: "block" }} />
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, color: C.ink2 }}>📺 En el televisor: escanee</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: C.ink2, marginTop: 10 }}>📱 En el teléfono: enlace abajo</div>
              <div style={{ fontFamily: F_INTER, fontWeight: 900, fontSize: 58, color: C.tealDeep, marginTop: 22 }}>{domain}</div>
            </div>
          </div>
        </Card>
      </div>
      <Sfx at={0.1} src="sfx_whoosh_soft.mp3" vol={0.25} />
      <Sfx at={0.6} src="sfx_chime.mp3" vol={0.25} />
    </AbsoluteFill>
  );
};

// ── 21. PhotoPair — día 1 / día 21 (RECREACIÓN) polaroids ─────────────
export const PhotoPair: React.FC<{ bed: string; left: string; right: string; leftLabel: string; rightLabel: string; note: string; flipAt?: number; durationInFrames?: number }> = ({ bed, left, right, leftLabel, rightLabel, note, flipAt = 1.5 }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const a = usePop(0.1), b = usePopSafe(f, flipAt);
  const Pol = ({ src, label, p, rot, x }: { src: string; label: string; p: number; rot: number; x: number }) => (
    <div style={{ position: "absolute", left: x, top: 150, width: 700, background: "#fff", padding: "24px 24px 30px", boxShadow: "0 36px 80px rgba(16,38,42,0.35)", transform: `rotate(${rot}deg) translateY(${(1 - p) * 120}px)`, opacity: p }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: 520, objectFit: "cover" }} />
      <div style={{ fontFamily: F_INTER, fontWeight: 900, fontSize: 52, textAlign: "center", marginTop: 18, color: C.ink }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={211} blur={10} wash={0.3} />
      {Pol({ src: left, label: leftLabel, p: a, rot: -4, x: 180 })}
      {Pol({ src: right, label: rightLabel, p: b, rot: 3, x: 1030 })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", opacity: b }}>
        <span style={{ background: C.ink, color: "#fff", fontFamily: F_INTER, fontWeight: 800, fontSize: 38, padding: "12px 30px", borderRadius: 14 }}>{note}</span>
      </div>
      <Sfx at={0.1} src="universfield-camera-shutter-199580.mp3" vol={0.35} />
      <Sfx at={flipAt} src="universfield-camera-shutter-199580.mp3" vol={0.35} />
    </AbsoluteFill>
  );
};

// ── 22. WindowRays — el vidrio frena una parte y deja pasar otra ─────────────
export const WindowRays: React.FC<{ bed: string; title: string; blocked: string; passes: string; durationInFrames?: number }> = ({ bed, title, blocked, passes }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const t = usePop(0.05);
  const r1 = interpolate(f, [15, 45], [0, 1], clamp), r2 = interpolate(f, [55, 90], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={221} wash={0.1} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={930} y={180} width={60} height={760} rx={10} fill="rgba(205,237,234,0.85)" stroke="#fff" strokeWidth={6} />
        <line x1={120} y1={330} x2={120 + 810 * r1} y2={330 + 90 * r1} stroke={C.red} strokeWidth={22} strokeLinecap="round" />
        {r1 > 0.98 && <text x={930} y={300} fontSize={80} fill={C.red} fontWeight={900}>✕</text>}
        <line x1={120} y1={700} x2={120 + 1680 * r2} y2={700 + 160 * r2} stroke={C.amber} strokeWidth={22} strokeLinecap="round" strokeDasharray="60 26" />
      </svg>
      <div style={{ position: "absolute", left: 110, top: 70, ...lift(t) }}><Card style={{ padding: "18px 34px" }}><Title size={54}>{title}</Title></Card></div>
      <div style={{ position: "absolute", left: 140, top: 390, opacity: r1 }}><Card accent={C.red} style={{ padding: "14px 28px" }}><div style={{ fontSize: 40, fontWeight: 800 }}>{blocked}</div></Card></div>
      <div style={{ position: "absolute", right: 140, top: 880, opacity: r2 }}><Card accent={C.amber} style={{ padding: "14px 28px" }}><div style={{ fontSize: 40, fontWeight: 800 }}>{passes}</div></Card></div>
      <Sfx at={0.5} src="sfx_whoosh_soft.mp3" vol={0.2} />
      <Sfx at={1.9} src="sfx_whoosh_soft.mp3" vol={0.2} />
    </AbsoluteFill>
  );
};

// ── 23. Repaso — checklist final con íconos, ítem por ítem ─────────────
export const Repaso: React.FC<{ bed: string; title: string; items: { k: string; text: string; tone?: "teal" | "amber" | "red" }[]; hits?: number[]; durationInFrames?: number }> = ({ bed, title, items, hits = [] }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const t = usePop(0.05);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={231} blur={10} wash={0.3} />
      <div style={{ position: "absolute", left: 260, right: 260, top: 70, ...lift(t) }}>
        <Card>
          <Title size={62} style={{ marginBottom: 16 }}>{title}</Title>
          {items.map((it, i) => {
            const at = hits[i] ?? 0.5 + i * 0.8;
            const p = usePopSafe(f, at);
            const col = it.tone === "amber" ? C.amber : it.tone === "red" ? C.red : C.teal;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, padding: "13px 0", borderTop: `2px solid ${C.line}`, opacity: 0.25 + 0.75 * p }}>
                <div style={{ minWidth: 250, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: "#fff", background: col, borderRadius: 12, padding: "10px 16px", textAlign: "center", transform: `scale(${0.9 + 0.1 * p})` }}>{it.k}</div>
                <div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1.12 }}>{it.text}</div>
              </div>
            );
          })}
        </Card>
      </div>
      {items.map((_, i) => <Sfx key={i} at={hits[i] ?? 0.5 + i * 0.8} src="sfx_paper_tick.mp3" vol={0.25} />)}
    </AbsoluteFill>
  );
};

// ── 24. DoseFingers — la cantidad de protector: dos dedos ─────────────
export const DoseFingers: React.FC<{ bed: string; image: string; title: string; sub: string; durationInFrames?: number }> = ({ bed, image, title, sub }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const p = usePop(0.1);
  const line = interpolate(f, [18, 45], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={241} blur={8} wash={0.25} />
      <div style={{ position: "absolute", left: 150, top: 150, width: 820, height: 780, borderRadius: 30, overflow: "hidden", border: "14px solid #fff", boxShadow: "0 40px 90px rgba(16,38,42,0.35)", transform: `scale(${0.9 + 0.1 * p})`, opacity: p }}>
        <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <svg width={820} height={780} style={{ position: "absolute", inset: 0 }}>
          <line x1={120} y1={330} x2={120 + 580 * line} y2={330} stroke={C.amber} strokeWidth={10} strokeDasharray="26 14" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 300, width: 760, ...lift(p) }}>
        <Card accent={C.amber}>
          <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 170, color: C.amber, lineHeight: 0.95 }}>{title}</div>
          <div style={{ fontSize: 42, fontWeight: 800, marginTop: 12 }}>{sub}</div>
        </Card>
      </div>
      <Sfx at={0.1} src="sfx_pop.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

// ── 25. BeforeAfterWipe — recreación honesta: el tono más parejo, barrido lento ─────────────
export const TonoWipe: React.FC<{ before: string; after: string; leftLabel: string; rightLabel: string; tag: string; durationInFrames?: number }> = ({ before, after, leftLabel, rightLabel, tag }) => {
  const f = useCurrentFrame();
  const out = useOut();
  const { durationInFrames: d } = useVideoConfig();
  const x = interpolate(f, [10, Math.max(20, d - 20)], [92, 50], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Img src={staticFile(after)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - x}% 0 0)` }}>
        <Img src={staticFile(before)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 8, marginLeft: -4, background: "#fff", boxShadow: "0 0 20px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: 90, bottom: 90 }}><span style={{ background: C.paper2, fontFamily: F_INTER, fontWeight: 900, fontSize: 48, padding: "10px 28px", borderRadius: 14, color: C.ink }}>{leftLabel}</span></div>
      <div style={{ position: "absolute", right: 90, bottom: 90 }}><span style={{ background: C.teal, fontFamily: F_INTER, fontWeight: 900, fontSize: 48, padding: "10px 28px", borderRadius: 14, color: "#fff" }}>{rightLabel}</span></div>
      <div style={{ position: "absolute", right: 60, top: 50 }}><span style={{ background: "rgba(16,38,42,0.75)", fontFamily: F_INTER, fontWeight: 800, fontSize: 28, padding: "8px 20px", borderRadius: 10, color: "#fff", letterSpacing: 3 }}>{tag}</span></div>
      <Sfx at={0.3} src="sfx_whoosh_soft.mp3" vol={0.2} />
    </AbsoluteFill>
  );
};
