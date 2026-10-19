// Lc2Kit — componentes del canal 2 de Loretta (alta producción: avatar + un clip LTX real por cada paso).
// El protagonista es el clip: casi todo va ENCIMA como "fichas" chicas en una esquina que no tapan las manos.
// Pantalla completa sólo en 3 momentos: Lc2Hook7 (los 7 platos del minuto 1), Lc2Opener (cada receta) y la tarjeta del libro.
// Marca: papel crema de recetario + ciruela de la tapa de Supper for One + tinta marrón; Fraunces + Caveat (LorTheme).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd, hexA } from "../loretta/LorTheme";

export const PLUM = "#4B1E3F", PLUM2 = "#6E3360", PLUMSOFT = "#E7D3E0";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const pop = (f: number, fps: number, at = 0, damping = 13) => spring({ frame: f - at, fps, config: { damping, stiffness: 150, mass: 0.7 } });
const outK = (f: number, d: number, n = 9) => interpolate(f, [d - n, d], [1, 0], cl);

// ---------- ficha base: tarjeta de recetario con cinta, entra con resorte desde su esquina y se va hundiéndose ----------
type Corner = "tl" | "tr" | "bl" | "br";
const Ficha: React.FC<{ corner?: Corner; w?: number | "auto"; seed?: number; children: React.ReactNode; tint?: string }> = ({ corner = "tr", w = 470, seed = 3, children, tint = LOR.white }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 2); const o = outK(f, durationInFrames);
  const left = corner.endsWith("l"), top = corner.startsWith("t");
  const rot = (rnd(seed) - 0.5) * 5;
  const pos: React.CSSProperties = { position: "absolute", width: w === "auto" ? "max-content" : w, [left ? "left" : "right"]: 64, [top ? "top" : "bottom"]: 58 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...pos, opacity: Math.min(1, p * 1.5) * o, rotate: `${rot + (1 - p) * (left ? -10 : 10)}deg`,
        translate: `${(1 - p) * (left ? -90 : 90)}px ${(1 - o) * 30}px`, scale: String(0.82 + 0.18 * p) }}>
        <div style={{ background: tint, borderRadius: 10, padding: "22px 28px 20px", boxShadow: `0 18px 40px ${LOR.shadow}, 0 2px 0 ${LOR.paperEdge}`,
          backgroundImage: `repeating-linear-gradient(transparent 0 46px, ${hexA("#7FA7C9", 0.22)} 46px 48px)`, backgroundPosition: "0 58px" }}>
          <div style={{ position: "absolute", top: -15, left: "38%", width: 120, height: 32, background: hexA(PLUM2, 0.45), rotate: `${-3 + rnd(seed + 1) * 6}deg` }} />
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
const Kicker: React.FC<{ t: string; c?: string }> = ({ t, c = PLUM }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: c, textTransform: "uppercase" }}>{t}</div>
);
// número que cuenta (con resorte al final) — se lee como "lo está midiendo"
const useCount = (to: number, from = 0, at = 6, frames = 26) => {
  const f = useCurrentFrame();
  return Math.round(interpolate(f, [at, at + frames], [from, to], { ...cl, easing: Easing.bezier(0.2, 0.9, 0.3, 1.04) }));
};
// trazo a mano que se dibuja (SVG path con dashoffset)
const Stroke: React.FC<{ d: string; at: number; dur?: number; color?: string; w?: number; len?: number }> = ({ d, at, dur = 10, color = LOR.gingham, w = 7, len = 900 }) => {
  const f = useCurrentFrame(); const k = interpolate(f, [at, at + dur], [0, 1], { ...cl, easing: ease });
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />;
};

// ---------- 1. horno: dial esmaltado que gira hasta la temperatura ----------
export const Lc2Oven: React.FC<{ temp: number; corner?: Corner; note?: string }> = ({ temp, corner = "tr", note }) => {
  const f = useCurrentFrame();
  const t = Math.min(temp, useCount(temp, 200, 6, 24));
  const ang = -135 + ((t - 200) / 350) * 270;
  const glow = interpolate(f, [26, 40], [0, 1], cl);
  return (
    <Ficha corner={corner} w={430} seed={11}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <svg width={150} height={150} viewBox="-75 -75 150 150">
          <defs><radialGradient id="enm" cx="40%" cy="35%"><stop offset="0%" stopColor="#fff" /><stop offset="70%" stopColor="#ECE6DA" /><stop offset="100%" stopColor="#C9C0AE" /></radialGradient></defs>
          <circle r={70} fill="#DCD3C0" /><circle r={64} fill="url(#enm)" stroke="#B9AF9A" strokeWidth={2} />
          {Array.from({ length: 15 }, (_, i) => { const a = (-135 + i * (270 / 14)) * Math.PI / 180; return <line key={i} x1={Math.sin(a) * 52} y1={-Math.cos(a) * 52} x2={Math.sin(a) * (i % 2 ? 46 : 41)} y2={-Math.cos(a) * (i % 2 ? 46 : 41)} stroke={LOR.inkSoft} strokeWidth={i % 2 ? 1.5 : 3} />; })}
          <circle r={30} fill="#F7F3EA" stroke="#BDB39E" strokeWidth={2} style={{ filter: "drop-shadow(0 3px 3px rgba(0,0,0,.25))" }} />
          <g transform={`rotate(${ang})`}><rect x={-5} y={-30} width={10} height={36} rx={4} fill={LOR.ink} /><circle cy={-22} r={3} fill={LOR.gingham} /></g>
          <circle r={70} fill="none" stroke={hexA("#F28C28", 0.55 * glow)} strokeWidth={6} />
        </svg>
        <div>
          <Kicker t="Oven" />
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LOR.ink, lineHeight: 0.95 }}>{t}°<span style={{ fontSize: 50 }}>F</span></div>
          {note ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, color: LOR.greenDeep, opacity: glow }}>{note}</div> : null}
        </div>
      </div>
    </Ficha>
  );
};

// ---------- 2. timer de cocina: la aguja barre los minutos ----------
export const Lc2Timer: React.FC<{ min: number; max?: number; corner?: Corner; note?: string }> = ({ min, max, corner = "tr", note }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const sweep = interpolate(f, [8, Math.min(durationInFrames - 10, 70)], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const tot = max ?? min; const shown = Math.round(sweep * tot);
  const a = sweep * Math.min(1, tot / 60) * 360;
  const arc = (deg: number) => { const r = 54, x = Math.sin(deg * Math.PI / 180) * r, y = -Math.cos(deg * Math.PI / 180) * r; return `M0 0 L0 ${-r} A${r} ${r} 0 ${deg > 180 ? 1 : 0} 1 ${x} ${y} Z`; };
  return (
    <Ficha corner={corner} w={450} seed={23}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <svg width={150} height={150} viewBox="-75 -75 150 150">
          <circle r={70} fill={LOR.gingham} /><circle r={60} fill={LOR.white} />
          <path d={arc(Math.max(0.01, a))} fill={hexA(LOR.butter, 0.8)} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-60} x2={0} y2={i % 3 ? -54 : -48} stroke={LOR.ink} strokeWidth={i % 3 ? 2 : 4} transform={`rotate(${i * 30})`} />)}
          <g transform={`rotate(${a})`}><path d="M-4 6 L0 -52 L4 6 Z" fill={LOR.ink} /></g>
          <circle r={6} fill={LOR.ink} /><rect x={-10} y={-82} width={20} height={12} rx={3} fill={LOR.gingham} />
        </svg>
        <div>
          <Kicker t="Bake" />
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: LOR.ink, lineHeight: 0.95 }}>{max ? `${min}–${max}` : Math.max(shown, Math.round(tot * 0.2))}<span style={{ fontSize: 40 }}> min</span></div>
          {note ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 32, color: LOR.greenDeep }}>{note}</div> : null}
        </div>
      </div>
    </Ficha>
  );
};

// ---------- 3. termómetro: la columna sube y marca "listo" ----------
export const Lc2Temp: React.FC<{ temp: number; what?: string; corner?: Corner }> = ({ temp, what = "safe inside", corner = "tr" }) => {
  const f = useCurrentFrame();
  const t = useCount(temp, 40, 6, 26); const k = (t - 40) / 180;
  const ok = interpolate(f, [32, 42], [0, 1], cl);
  return (
    <Ficha corner={corner} w={420} seed={31}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width={70} height={170} viewBox="0 0 70 170">
          <rect x={22} y={6} width={26} height={130} rx={13} fill="#fff" stroke={LOR.inkSoft} strokeWidth={3} />
          <rect x={29} y={130 - 118 * k} width={12} height={118 * k + 8} rx={6} fill={LOR.gingham} />
          <circle cx={35} cy={148} r={18} fill={LOR.gingham} stroke={LOR.inkSoft} strokeWidth={3} />
        </svg>
        <div>
          <Kicker t="Done at" />
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LOR.ink, lineHeight: 0.95 }}>{t}°<span style={{ fontSize: 50 }}>F</span></div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, color: LOR.greenDeep, opacity: ok }}>✓ {what}</div>
        </div>
      </div>
    </Ficha>
  );
};

// ---------- 4. etiqueta de precio colgada (y lo que cuesta afuera, tachado a mano) ----------
export const Lc2Price: React.FC<{ price: string; sub?: string; vs?: string; corner?: Corner }> = ({ price, sub = "a plate", vs, corner = "tr" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const sw = Math.sin(f / 7) * 6 * Math.exp(-f / 40);
  const vsIn = pop(f, fps, 22); const k = interpolate(f, [34, 44], [0, 1], { ...cl, easing: ease });
  return (
    <Ficha corner={corner} w="auto" seed={41} tint={LOR.butterSoft}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ rotate: `${sw}deg`, transformOrigin: "0% 50%", position: "relative" }}>
          <div style={{ background: LOR.white, border: `4px solid ${LOR.ink}`, borderRadius: 14, padding: "8px 24px 6px 40px", clipPath: "polygon(16% 0,100% 0,100% 100%,16% 100%,0 50%)" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, color: PLUM, lineHeight: 1 }}>{price}</div>
          </div>
          <div style={{ position: "absolute", left: 16, top: "50%", width: 12, height: 12, borderRadius: 6, background: LOR.ink, translate: "0 -6px" }} />
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: LOR.ink, lineHeight: 1 }}>{sub}</div>
      </div>
      {vs ? (
        <div style={{ position: "relative", marginTop: 12, opacity: vsIn, display: "inline-block", whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: LOR.inkSoft }}>{vs}</span>
          <div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 6, borderRadius: 3, background: LOR.gingham, rotate: "-3deg", transformOrigin: "left", scale: `${k} 1` }} />
        </div>
      ) : null}
    </Ficha>
  );
};

// ---------- 5. cuántos platos salen ("uno hoy, otro mañana") ----------
export const Lc2Plates: React.FC<{ n: number; labels?: string[]; corner?: Corner }> = ({ n, labels = ["tonight", "tomorrow"], corner = "tr" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <Ficha corner={corner} w="auto" seed={53}>
      <Kicker t={n === 1 ? "Makes one plate" : `Makes ${n} plates`} />
      <div style={{ display: "flex", gap: 22, marginTop: 10 }}>
        {Array.from({ length: n }, (_, i) => { const p = pop(f, fps, 8 + i * 9, 10); return (   // sin scale: en el farm (Chrome Linux) el scale>1 del resorte dejaba negra la mitad de arriba del avatar (19-oct)
          <div key={i} style={{ textAlign: "center", opacity: Math.min(1, p * 1.4), display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width={18} height={120} viewBox="0 0 18 120"><path d="M3 10 V40 M9 10 V40 M15 10 V40 M3 40 Q9 52 15 40 M9 48 V112" stroke="#8D949B" strokeWidth={3.5} fill="none" strokeLinecap="round" /></svg>
            <svg width={120} height={120} viewBox="-60 -60 120 120"><circle r={56} fill="#fff" stroke="#D8CFBF" strokeWidth={3} /><circle r={40} fill="#FBF8F1" stroke="#E5DDCC" strokeWidth={2} /><circle r={56} fill="none" stroke={hexA("#6F8FB0", 0.7)} strokeWidth={4} strokeDasharray="4 7" /></svg>
            <svg width={18} height={120} viewBox="0 0 18 120"><path d="M9 10 Q16 30 12 60 L9 60 M9 60 V112" stroke="#8D949B" strokeWidth={3.5} fill="none" strokeLinecap="round" /></svg>
            </div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: LOR.greenDeep }}>{labels[i] ?? ""}</div>
          </div>); })}
      </div>
    </Ficha>
  );
};

// ---------- 6. lista de ingredientes: se tilda cada uno cuando ella lo nombra (at = s desde el inicio) ----------
export const Lc2Ingredients: React.FC<{ title: string; items: { t: string; at: number }[]; corner?: Corner }> = ({ title, items, corner = "tl" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <Ficha corner={corner} w="auto" seed={61}>
      <Kicker t="You'll need" />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 36, color: LOR.ink, marginBottom: 6, lineHeight: 1.1 }}>{title}</div>
      {items.map((it, i) => { const at = Math.max(8 + i * 4, it.at * fps); const p = pop(f, fps, at, 15); const chk = interpolate(f, [at + 6, at + 14], [0, 1], cl);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 48, opacity: Math.min(1, 0.25 + p), translate: `${(1 - p) * -24}px 0` }}>
            <svg width={34} height={34} viewBox="0 0 34 34"><rect x={3} y={3} width={28} height={28} rx={5} fill="none" stroke={LOR.inkSoft} strokeWidth={2.5} />
              <path d="M8 18 L15 25 L28 7" fill="none" stroke={LOR.gingham} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - chk)} /></svg>
            <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: LOR.ink, whiteSpace: "nowrap" }}>{it.t}</span>
          </div>); })}
    </Ficha>
  );
};

// ---------- 7. apertura de cada receta: banda inferior "Supper No. n of 7" + fichero con 7 pestañas ----------
export const Lc2Opener: React.FC<{ n: number; total?: number; title: string; num: number; book?: string }> = ({ n, total = 7, title, num, book = "Supper for One" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 0, 16); const o = outK(f, durationInFrames, 10);
  const big = pop(f, fps, 6, 11);
  const wipe = interpolate(f, [10, 26], [0, 100], { ...cl, easing: ease });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: `linear-gradient(transparent, ${hexA("#1d0e18", 0.55)})` }} />
      <div style={{ position: "absolute", left: 90, bottom: 74, translate: `0 ${(1 - p) * 140}px` }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {Array.from({ length: total }, (_, i) => { const on = i + 1 === n, done = i + 1 < n; const q = pop(f, fps, 4 + i * 2, 14); return (
            <div key={i} style={{ width: on ? 78 : 54, height: 44, borderRadius: "10px 10px 0 0", translate: `0 ${(1 - q) * 30}px`,
              background: on ? LOR.butter : done ? PLUMSOFT : hexA(LOR.white, 0.85), display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: SERIF, fontWeight: 900, fontSize: on ? 30 : 24, color: on ? LOR.ink : PLUM, boxShadow: on ? `0 0 0 3px ${LOR.ink} inset` : "none" }}>{done ? "✓" : i + 1}</div>); })}
        </div>
        <div style={{ background: LOR.paper, borderRadius: "0 14px 14px 14px", padding: "20px 40px 22px", boxShadow: `0 24px 50px rgba(0,0,0,.35)`, borderLeft: `14px solid ${PLUM}`, maxWidth: 1350 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: PLUM2 }}>Supper</span>
            <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: LOR.inkSoft }}>NO.</span>
            <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: PLUM, lineHeight: 0.8, scale: String(0.6 + 0.4 * big), display: "inline-block" }}>{n}</span>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: LOR.inkSoft }}>of {total}</span>
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: title.length > 30 ? 66 : 78, color: LOR.ink, lineHeight: 1.02, clipPath: `inset(0 ${100 - wipe}% 0 0)` }}>{title}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: LOR.greenDeep, marginTop: 4, opacity: interpolate(f, [22, 32], [0, 1], cl) }}>recipe {num} in my book · {book}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8. MINUTO 1: los 7 platos repartidos sobre la mesa como fotos, con el contador que llega a 7 ----------
// items: { src (cuadro del plato terminado; al tener los clips = el ÚLTIMO cuadro del clip "done"), name }
export const Lc2Hook7: React.FC<{ items: { src: string; name: string }[]; word?: string; title?: string }> = ({ items, word = "suppers", title = "Dump & Bake" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const every = Math.max(5, Math.floor((durationInFrames - 34) / items.length));
  const dealt = Math.min(items.length, Math.max(0, Math.floor((f - 6) / every) + 1));
  const cnt = pop(f, fps, 6 + (dealt - 1) * every, 9);
  const slots = [[-165, -150], [145, -165], [455, -145], [765, -160], [-10, 175], [300, 190], [610, 170]];
  const push = interpolate(f, [0, durationInFrames], [1, 1.06]);
  const o = outK(f, durationInFrames, 8);
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden", background: `radial-gradient(ellipse at 50% 45%, #8a6a4a, #4a3424)` }}>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,.07) 0 3px, transparent 3px 140px), repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 9px)", scale: String(push) }} />
      <AbsoluteFill style={{ scale: String(push) }}>
        {items.map((it, i) => { const at = 6 + i * every; const p = pop(f, fps, at, 12); if (f < at) return null;
          const [x, y] = slots[i % slots.length]; const r = (rnd(i + 9) - 0.5) * 14; const fromX = (rnd(i + 2) - 0.5) * 900;
          return (
            <div key={i} style={{ position: "absolute", left: 960 + x - 145, top: 540 + y - 130, width: 290, padding: "12px 12px 0", background: "#FFFDF7",
              boxShadow: `0 ${10 + 20 * p}px ${30 + 20 * p}px rgba(0,0,0,${0.25 + 0.2 * p})`, rotate: `${r * p + (1 - p) * 30}deg`,
              translate: `${(1 - p) * fromX}px ${(1 - p) * -700}px`, scale: String(1.25 - 0.25 * p) }}>
              <Img src={staticFile(it.src)} style={{ width: 266, height: 172, objectFit: "cover", display: "block" }} />
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 28, color: LOR.ink, textAlign: "center", padding: "6px 0 10px", whiteSpace: "nowrap", overflow: "hidden" }}>{i + 1}. {it.name}</div>
            </div>); })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: "50%", translate: `${(1 - pop(f, fps, 0, 15)) * -500}px -50%`, width: 560, pointerEvents: "none" }}>
        <div style={{ background: hexA(LOR.paper, 0.97), padding: "26px 40px 30px", borderRadius: 20, boxShadow: "0 30px 70px rgba(0,0,0,.45)", borderLeft: `14px solid ${PLUM}`, rotate: "-2deg" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 260, color: PLUM, lineHeight: 0.85, display: "inline-block", scale: String(0.8 + 0.2 * cnt), transformOrigin: "left center" }}>{dealt}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: LOR.ink, lineHeight: 0.95, whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: PLUM2, lineHeight: 1.05 }}>{word} for one</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: LOR.inkSoft, marginTop: 8 }}>START TO FINISH</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 9. libro + QR (CTA) a pantalla completa ----------
export const Lc2Book: React.FC<{ cover: string; qr: string; site: string; line?: string }> = ({ cover, qr, site, line = "140 small suppers for seniors living alone" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const b = pop(f, fps, 2, 14), q = pop(f, fps, 14, 12); const o = outK(f, durationInFrames, 8);
  const tilt = interpolate(f, [0, durationInFrames], [-14, -6]);
  return (
    <AbsoluteFill style={{ opacity: o, background: `radial-gradient(ellipse at 35% 40%, ${LOR.paper}, ${LOR.paper2} 70%, ${LOR.paperEdge})`, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 120 }}>
      <div style={{ perspective: 1600 }}>
        <div style={{ transform: `rotateY(${tilt}deg) rotateZ(${-2 * b}deg)`, translate: `${(1 - b) * -500}px 0`, position: "relative" }}>
          <div style={{ position: "absolute", right: -26, top: 10, bottom: 10, width: 30, background: "repeating-linear-gradient(#fff 0 2px, #E8E0CF 2px 4px)", borderRadius: "0 6px 6px 0", transform: "rotateY(60deg)", transformOrigin: "left" }} />
          <Img src={staticFile(cover)} style={{ height: 800, borderRadius: "4px 10px 10px 4px", boxShadow: `30px 40px 80px ${LOR.shadow}, inset 6px 0 0 rgba(0,0,0,.15)`, display: "block" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, q * 1.3), translate: `0 ${(1 - q) * 60}px` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: PLUM, lineHeight: 1 }}>Supper for One</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LOR.greenDeep, marginBottom: 22 }}>{line}</div>
        <div style={{ background: "#fff", padding: 24, borderRadius: 18, boxShadow: `0 24px 50px ${LOR.shadow}`, border: `6px solid ${PLUM}`, scale: String(1 + 0.02 * Math.sin(f / 8)) }}>
          <Img src={staticFile(qr)} style={{ width: 430, height: 430, imageRendering: "pixelated", display: "block" }} />
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 38, color: LOR.ink, marginTop: 20 }}>{site}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: LOR.inkSoft }}>the link is right below this video ↓</div>
      </div>
    </AbsoluteFill>
  );
};
