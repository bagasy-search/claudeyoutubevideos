// kit btg — clon del lenguaje visual "ilustrado + real" (molde: documental de depredadores 2,5 M vistas, desglose en
// D:/claude-brain/estilos/doc-ilustrado-btg/DESGLOSE.md). Todo vectorial/código: escenario al atardecer, siluetas,
// fichero de 4 cajas, tarjetas de foto, renglón con palabra de color, mapa con cifra, balanza, curva que cae.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export const C = {
  night: "#0b1622", navy: "#14263a", dusk: "#2a3550", glow: "#e8833a", sun: "#ffd48a", ember: "#c4522a",
  ground: "#3a2a1f", ground2: "#4a3426", water: "#16404a", water2: "#0f2f37", tree: "#0d1a17",
  red: "#ff3b30", orange: "#ff8a2a", ink: "#f4efe6", dim: "rgba(244,239,230,.55)", vest: "#ff6a1a",
};
export const FONT = "'Montserrat','Poppins','Inter',system-ui,sans-serif";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const src = (p: string) => (p.startsWith("http") ? p : staticFile(p));

// ---------- 1. Escenario al atardecer (el fondo de TODAS las escenas ilustradas) ----------
// cielo navy→naranja, sol bajo, 2 líneas de árboles en silueta con parallax, suelo marrón, agua opcional con rayas.
type Tree = "pine" | "acacia" | "palm" | "mangrove";
const treePath = (k: Tree, x: number, base: number, h: number) => {
  if (k === "pine") return `M${x},${base} L${x - h * 0.22},${base} L${x - h * 0.05},${base - h * 0.45} L${x - h * 0.16},${base - h * 0.45} L${x},${base - h} L${x + h * 0.16},${base - h * 0.45} L${x + h * 0.05},${base - h * 0.45} L${x + h * 0.22},${base} Z`;
  if (k === "acacia") return `M${x - 4},${base} L${x - 3},${base - h * 0.7} L${x - h * 0.5},${base - h * 0.78} Q${x},${base - h * 1.05} ${x + h * 0.5},${base - h * 0.78} L${x + 3},${base - h * 0.7} L${x + 4},${base} Z`;
  if (k === "palm") return `M${x - 3},${base} Q${x + 6},${base - h * 0.5} ${x},${base - h} L${x - h * 0.3},${base - h * 0.85} L${x},${base - h * 0.98} L${x + h * 0.32},${base - h * 0.88} L${x + 4},${base - h} Q${x + 10},${base - h * 0.5} ${x + 3},${base} Z`;
  return `M${x - h * 0.35},${base} Q${x - h * 0.2},${base - h * 0.4} ${x - h * 0.3},${base - h * 0.7} Q${x},${base - h * 1.1} ${x + h * 0.3},${base - h * 0.7} Q${x + h * 0.2},${base - h * 0.4} ${x + h * 0.35},${base} Z`;
};
const TreeLine: React.FC<{ seed: number; base: number; hMin: number; hMax: number; color: string; kind: Tree; drift: number; gap: number }> = ({ seed, base, hMin, hMax, color, kind, drift, gap }) => {
  const trees: string[] = [];
  for (let i = 0, x = -200; x < 2300; i++) { const h = hMin + rnd(i, seed) * (hMax - hMin); trees.push(treePath(kind, x, base + 2, h)); x += gap * (0.6 + rnd(i, seed + 9) * 0.9); }
  return (
    <svg width={2400} height={1080} style={{ position: "absolute", left: -240 + drift, top: 0 }}>
      <path d={trees.join(" ")} fill={color} />
      <rect x={0} y={base} width={2400} height={1080 - base} fill={color} />
    </svg>
  );
};
export const SunsetStage: React.FC<{ tree?: Tree; water?: boolean; horizon?: number; night?: number; sunX?: number; pan?: number; children?: React.ReactNode }> = ({
  tree = "pine", water = false, horizon = 620, night = 0, sunX = 1450, pan = 0.5, children,
}) => {
  const f = useCurrentFrame();
  const d = f * pan; // parallax: lejos lento, cerca rápido
  const sky = `linear-gradient(180deg, ${C.night} 0%, ${C.navy} 38%, ${C.dusk} 62%, ${C.ember} 86%, ${C.glow} 100%)`;
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: sky, height: horizon + 20, opacity: 1 - night * 0.7 }} />
      <div style={{ position: "absolute", left: sunX - 260, top: horizon - 300, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.sun}cc 0%, ${C.glow}55 30%, transparent 68%)`, opacity: 1 - night }} />
      <div style={{ position: "absolute", left: sunX - 34, top: horizon - 52, width: 68, height: 68, borderRadius: "50%", background: C.sun, opacity: (1 - night) * 0.95 }} />
      {/* estrellas si es de noche */}
      {night > 0 && Array.from({ length: 70 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: rnd(i, 3) * 1920, top: rnd(i, 4) * horizon * 0.7, width: 2, height: 2, borderRadius: 1, background: "#fff", opacity: night * (0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i))) }} />
      ))}
      <TreeLine seed={1} base={horizon - 6} hMin={50} hMax={110} color="#1a2a2c" kind={tree} drift={-d * 0.3} gap={70} />
      <TreeLine seed={2} base={horizon + 8} hMin={80} hMax={170} color={C.tree} kind={tree} drift={-d * 0.6} gap={110} />
      {water ? (
        <AbsoluteFill style={{ top: horizon + 8 }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.water} 0%, ${C.water2} 100%)` }} />
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: ((i * 260 - d * 0.9) % 2100) - 100, top: 30 + i * 37, width: 120 + rnd(i, 5) * 140, height: 3, borderRadius: 2, background: "rgba(255,190,120,.18)" }} />
          ))}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ top: horizon + 8, background: `linear-gradient(180deg, ${C.ground2} 0%, ${C.ground} 100%)` }} />
      )}
      <AbsoluteFill style={{ background: `rgba(5,10,20,${night * 0.45})` }} />
      {children}
    </AbsoluteFill>
  );
};

// ---------- 2. Figura humana plana (chaleco naranja) y animal en silueta ----------
export const Person: React.FC<{ x: number; y: number; s?: number; walk?: boolean; arms?: "down" | "up" | "spear"; flip?: boolean; dark?: boolean }> = ({ x, y, s = 1, walk = false, arms = "down", flip = false, dark = false }) => {
  const f = useCurrentFrame();
  const sw = walk ? Math.sin(f / 4) * 14 : 0;
  const skin = dark ? "#111" : "#f2c49b", vest = dark ? "#111" : C.vest, legs = dark ? "#111" : "#2d3a5a";
  return (
    <svg width={120 * s} height={260 * s} viewBox="0 0 120 260" style={{ position: "absolute", left: x - 60 * s, top: y - 260 * s, transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
      <g transform={`rotate(${sw} 60 170)`}><rect x={46} y={165} width={13} height={92} rx={6} fill={legs} /></g>
      <g transform={`rotate(${-sw} 60 170)`}><rect x={61} y={165} width={13} height={92} rx={6} fill={legs} /></g>
      <rect x={40} y={80} width={40} height={95} rx={14} fill={vest} />
      {arms === "up" ? (<><rect x={30} y={20} width={11} height={75} rx={5} fill={skin} transform="rotate(-18 36 90)" /><rect x={79} y={20} width={11} height={75} rx={5} fill={skin} transform="rotate(18 84 90)" /></>)
        : arms === "spear" ? (<><rect x={80} y={85} width={11} height={70} rx={5} fill={skin} transform="rotate(-40 85 90)" /><rect x={95} y={-10} width={5} height={230} rx={2} fill="#6b4a2a" transform="rotate(20 97 100)" /><rect x={30} y={85} width={11} height={70} rx={5} fill={skin} /></>)
          : (<><rect x={29} y={86} width={11} height={72} rx={5} fill={skin} transform={`rotate(${sw * 0.6} 34 90)`} /><rect x={80} y={86} width={11} height={72} rx={5} fill={skin} transform={`rotate(${-sw * 0.6} 86 90)`} /></>)}
      <circle cx={60} cy={58} r={24} fill={skin} />
      <path d="M36,52 Q60,22 84,52 L84,44 Q60,14 36,44 Z" fill={dark ? "#111" : "#5a3a22"} />
    </svg>
  );
};
// animal = recorte real (rembg) pintado negro con borde de luz cálida → silueta "de afiche"
export const Beast: React.FC<{ img: string; x: number; y: number; w: number; ar: number; flip?: boolean; rim?: string; eye?: [number, number]; bob?: number }> = ({ img, x, y, w, ar, flip = true, rim = C.glow, eye, bob = 0 }) => {
  const f = useCurrentFrame();
  const h = w / ar, dy = Math.sin(f / 6) * bob;
  return (
    <div style={{ position: "absolute", left: x, top: y - h + dy, width: w, height: h, transform: flip ? "scaleX(-1)" : undefined }}>
      <Img src={src(img)} style={{ width: "100%", height: "100%", objectFit: "contain", filter: `brightness(0) drop-shadow(0 -3px 0 ${rim}) drop-shadow(0 0 14px ${rim}66)` }} />
      {eye && <div style={{ position: "absolute", left: eye[0] * w - 7, top: eye[1] * h - 7, width: 14, height: 14, borderRadius: 7, background: "#ffb030", boxShadow: "0 0 18px 6px #ff9a1a" }} />}
    </div>
  );
};

// ---------- 3. Renglón con UNA palabra de color (la firma del texto del molde) ----------
// "an animal *killing* you…" — chico, abajo a la izquierda o centrado, palabra clave en rojo/naranja y en MAYÚSCULA si pega.
// prev = el renglón anterior queda ARRIBA en gris (así lo hace el molde: "an animal killing you…" / "and an animal HUNTING you")
export const KeyLine: React.FC<{ a: number; text: string; x?: number; y?: number; size?: number; align?: "left" | "center"; color?: string; out?: number; prev?: string }> = ({ a, text, x = 140, y = 840, size = 44, align = "left", color = C.red, out, prev }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const o = out ? ease(f, out, out + 8, 1, 0) : 1;
  return (
    <>
    {prev && <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y - size * 1.5, textAlign: align, fontFamily: FONT, fontWeight: 700, fontSize: size, color: "rgba(244,239,230,.45)", opacity: o }}>
      {prev.split(" ").map((w, i) => <span key={i} style={{ marginRight: size * 0.28, fontWeight: w.startsWith("*") ? 900 : 700 }}>{w.replace(/\*/g, "")}</span>)}</div>}
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y, textAlign: align, fontFamily: FONT, fontWeight: 700, fontSize: size, color: C.ink, opacity: o, textShadow: "0 3px 14px rgba(0,0,0,.7)", letterSpacing: 0.3 }}>
      {words.map((w, i) => {
        const key = w.startsWith("*");
        const t = ease(f, a + i * 3, a + i * 3 + 7);
        return (
          <span key={i} style={{ display: "inline-block", marginRight: size * 0.28, opacity: t, transform: `translateY(${(1 - t) * 14}px)`, color: key ? color : undefined, fontWeight: key ? 900 : 700, textTransform: key && w.length > 4 ? "uppercase" : undefined }}>
            {w.replace(/\*/g, "")}
          </span>
        );
      })}
    </div>
    </>
  );
};
// "DO NOT HUNT" — 3 palabras apiladas, una en rojo, sobre video oscurecido
export const Stamp: React.FC<{ a: number; lines: string[]; hot: number; x?: number; y?: number; size?: number }> = ({ a, lines, hot, x = 160, y = 420, size = 120 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.95, color: C.ink }}>
      {lines.map((l, i) => {
        const t = ease(f, a + i * 5, a + i * 5 + 6);
        return <div key={i} style={{ opacity: t, transform: `scale(${1.25 - 0.25 * t})`, transformOrigin: "left center", color: i === hot ? C.red : undefined }}>{l}</div>;
      })}
    </div>
  );
};

// ---------- 4. Fichero de 4 cajas (el "índice" que vuelve en cada capítulo) ----------
export type Slot = { img: string; ar: number };
export const Roster: React.FC<{ a: number; slots: Slot[]; active?: number; dead?: number[]; caption?: string }> = ({ a, slots, active = -1, dead = [], caption }) => {
  const f = useCurrentFrame();
  const W = 330, H = 230, G = 40, X0 = (1920 - (slots.length * W + (slots.length - 1) * G)) / 2;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #2a1a10 0%, #0a0806 70%)` }}>
      {slots.map((s, i) => {
        const t = spring({ frame: f - a - i * 4, fps: 30, config: { damping: 16 } });
        const on = i === active, off = dead.includes(i) || (active >= 0 && !on);
        const lit = on ? ease(f, a + 18, a + 30) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 420 + (1 - t) * 60, width: W, height: H, opacity: t * (off ? 0.35 : 1), borderRadius: 10,
            background: `linear-gradient(180deg, #120d09 0%, #2b1d12 100%)`, boxShadow: `inset 0 -40px 60px rgba(255,140,50,${0.18 + lit * 0.4}), 0 0 ${lit * 50}px rgba(255,150,60,${lit * 0.6})`,
            border: `2px solid rgba(255,170,90,${0.18 + lit * 0.7})`, transform: `scale(${1 + lit * 0.08})` }}>
            <Img src={src(s.img)} style={{ position: "absolute", left: "10%", bottom: 22, width: "80%", height: H * 0.7, objectFit: "contain", filter: `brightness(0) drop-shadow(0 -2px 0 rgba(255,160,80,${0.4 + lit * 0.6}))`, transform: "scaleX(-1)" }} />
            {dead.includes(i) && <svg style={{ position: "absolute", inset: 0 }} width={W} height={H}><path d={`M30,30 L${W - 30},${H - 30} M${W - 30},30 L30,${H - 30}`} stroke={C.red} strokeWidth={10} strokeLinecap="round" opacity={ease(f, a + 25, a + 33)} /></svg>}
          </div>
        );
      })}
      {caption && <KeyLine a={a + 30} text={caption} align="center" y={720} size={46} />}
    </AbsoluteFill>
  );
};

// ---------- 5. Tarjetas de foto sobre el video borroso ----------
export const PhotoCards: React.FC<{ a: number; bg: string; bgVideo?: boolean; cards: string[]; step?: number; label?: string[] }> = ({ a, bg, bgVideo, cards, step = 14, label }) => {
  const f = useCurrentFrame();
  const W = 300, H = 400, G = 50, X0 = (1920 - (cards.length * W + (cards.length - 1) * G)) / 2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(28px) brightness(.38) saturate(.8)", transform: "scale(1.15)" }}>
        {bgVideo ? <OffthreadVideo src={src(bg)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Img src={src(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </AbsoluteFill>
      {cards.map((c, i) => {
        const t = spring({ frame: f - a - i * step, fps: 30, config: { damping: 15, mass: 0.8 } });
        const tilt = (rnd(i, 7) - 0.5) * 5;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 300 + (1 - t) * 90, width: W, height: H, opacity: t, transform: `rotate(${tilt * (1 - t * 0.6)}deg) scale(${0.9 + 0.1 * t})`,
            borderRadius: 14, overflow: "hidden", border: "5px solid rgba(255,255,255,.92)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
            <Img src={src(c)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 - 0.08 * ease(f, a + i * step, a + i * step + 90)})` }} />
            {label?.[i] && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 14px", background: "linear-gradient(0deg, rgba(0,0,0,.8), transparent)", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.ink }}>{label[i]}</div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 6. Mapa que se llena de puntos + cifra gigante ----------
// land = PNG del continente YA coloreado (africa_mask_ocre.png); pts = puntos [x,y] 0-1 que caen sobre tierra
// (los genera src/kits/btg/africa_mask.py). Sin máscara CSS: Remotion no espera a que cargue y sale vacío.
export const DotMap: React.FC<{ a: number; land: string; pts: number[][]; n: number; stat: string; sub: string; mapW?: number; ar?: number }> = ({ a, land, pts, n, stat, sub, mapW = 760, ar = 900 / 932 }) => {
  const f = useCurrentFrame();
  const mapH = mapW / ar, X = 300, Y = (1080 - mapH) / 2;
  const fill = ease(f, a + 10, a + 70);
  const val = Math.round(n * ease(f, a + 20, a + 70));
  const zoom = 1 + ease(f, a, a + 240) * 0.05;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 50%, #12304a 0%, #07131f 75%)` }}>
      <div style={{ position: "absolute", left: X, top: Y, width: mapW, height: mapH, transform: `scale(${zoom})` }}>
        <Img src={src(land)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        {pts.map(([x, y], i) => {
          const on = rnd(i, 11) < fill;
          return <div key={i} style={{ position: "absolute", left: x * mapW - 3, top: y * mapH - 3, width: 6, height: 6, borderRadius: 3, background: "#ff5a2a", opacity: on ? 1 : 0, transform: `scale(${on ? 1 : 0})` }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: X + mapW + 40, top: 420, fontFamily: FONT, color: C.orange, fontWeight: 900, fontSize: 150, lineHeight: 1, opacity: ease(f, a + 15, a + 25) }}>{val.toLocaleString("en-US")}{stat}</div>
      <div style={{ position: "absolute", left: X + mapW + 46, top: 580, fontFamily: FONT, color: C.ink, fontWeight: 700, fontSize: 40, maxWidth: 520, opacity: ease(f, a + 40, a + 52) }}>{sub}</div>
    </AbsoluteFill>
  );
};

// ---------- 7. Balanza (el hombre vs el animal: quién pesa más) ----------
export const Seesaw: React.FC<{ a: number; tip: number; left: React.ReactNode; right: React.ReactNode; num?: string }> = ({ a, tip, left, right, num }) => {
  const f = useCurrentFrame();
  const ang = interpolate(spring({ frame: f - a - 20, fps: 30, config: { damping: 9, mass: 1.2 } }), [0, 1], [0, tip]);
  return (
    <SunsetStage night={0.6} pan={0.2}>
      <div style={{ position: "absolute", left: 960 - 20, top: 790, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "90px solid #2a1c14", transform: "translateX(-30px)" }} />
      <div style={{ position: "absolute", left: 360, top: 780, width: 1200, height: 18, borderRadius: 9, background: "#8a5a32", transform: `rotate(${ang}deg)`, transformOrigin: "600px 9px" }}>
        <div style={{ position: "absolute", left: 40, bottom: 18 }}>{left}</div>
        <div style={{ position: "absolute", right: 40, bottom: 18 }}>{right}</div>
      </div>
      {num && <div style={{ position: "absolute", right: 380, top: 470, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.orange, opacity: ease(f, a + 30, a + 40) }}>{num}</div>}
    </SunsetStage>
  );
};

// ---------- 8. Curva que cae (población) ----------
export const DeclineChart: React.FC<{ a: number; pts: number[]; label: string; from: string; to: string }> = ({ a, pts, label, from, to }) => {
  const f = useCurrentFrame();
  const W = 1500, H = 420, X = 210, Y = 330;
  const d = pts.map((p, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * W},${H - p * H}`).join(" ");
  const len = 3000, prog = ease(f, a, a + 75);
  const last = Math.min(pts.length - 1, Math.floor(prog * (pts.length - 1)));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #160c0c 0%, #0c0707 100%)` }}>
      <svg style={{ position: "absolute", left: X, top: Y, overflow: "visible" }} width={W} height={H}>
        <defs><linearGradient id="dcg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ff3b30" stopOpacity=".35" /><stop offset="1" stopColor="#ff3b30" stopOpacity="0" /></linearGradient></defs>
        <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#dcg)" opacity={prog} style={{ clipPath: `inset(0 ${(1 - prog) * 100}% 0 0)` }} />
        <path d={d} fill="none" stroke="#ff4a3a" strokeWidth={6} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - prog)} />
        <circle cx={(last / (pts.length - 1)) * W} cy={H - pts[last] * H} r={11} fill="#ff4a3a" opacity={prog > 0.02 ? 1 : 0} />
        <line x1={0} x2={W} y1={H + 2} y2={H + 2} stroke="rgba(255,255,255,.2)" strokeWidth={2} />
      </svg>
      <div style={{ position: "absolute", left: X, top: Y + H + 24, fontFamily: FONT, color: C.dim, fontSize: 30, fontWeight: 700 }}>{from}</div>
      <div style={{ position: "absolute", left: X + W - 120, top: Y + H + 24, fontFamily: FONT, color: C.dim, fontSize: 30, fontWeight: 700 }}>{to}</div>
      <KeyLine a={a + 60} text={label} x={X} y={200} size={48} />
    </AbsoluteFill>
  );
};

// ---------- 9. Plano real con "punch-in" lento (el 60 % del molde es esto) ----------
export const Real: React.FC<{ v: string; from?: number; z?: [number, number]; dur: number; dark?: number }> = ({ v, from = 0, z = [1.04, 1.12], dur, dark = 0 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], z, clamp);
  const isVid = v.endsWith(".mp4");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        {isVid ? <OffthreadVideo src={src(v)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Img src={src(v)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </AbsoluteFill>
      {dark > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />}
    </AbsoluteFill>
  );
};
