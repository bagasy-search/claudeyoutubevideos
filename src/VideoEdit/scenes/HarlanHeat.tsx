
// HarlanHeat.tsx — KIT DEL CALEFACTOR (canal Harlan the Lineman). Mismo mundo que HarlanLine,
// HarlanGen y HarlanBox (Ohio en invierno, liniero jubilado, taller y apagón), pero centrado en el
// calefactor eléctrico y en DÓNDE NO SE ENCHUFA: el tablero colgado de la pared del taller con los
// 5 lugares prohibidos, cada uno con su ícono y su cruz roja.
//
// Reglas de oficio (las mismas de HarlanLine / HarlanBox / LouDiner):
//  · Todo determinista (rnd con hash entero): el farm rinde en chunks.
//  · Nada de <Video>. Sólo <Img>; el fondo usa SIEMPRE la versión _blur (la hornea 60_build).
//  · Los íconos están DIBUJADOS en SVG/CSS: cero imágenes externas, así un asset que falta no mata
//    el chunk con un 404 y el tablero se ve igual en el still de prueba.
//  · PROFUNDIDAD = 3 planos que se mueven a distinta velocidad: pared de tablilla con foto blur
//    (lento), tablero colgado que se hamaca (medio), polvo desenfocado delante (rápido).
//  · El SONIDO no vive acá: fxpack agenda style.fx.compSfx en la mezcla, alineado a SFX_AT.
//  · Los arrays llegan como {text} aunque la firma diga otra cosa: siempre normalizar.
//  · El escalonado NO es fijo: startAt/stagger los calcula la fábrica contra el hueco real
//    (kit.mjs `escalonar`). Acá sólo se respeta el mismo cálculo como default.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadStencil } from "@remotion/google-fonts/BlackOpsOne";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

const BEBAS = loadBebas("normal", { subsets: ["latin"] }).fontFamily;
const STENCIL = loadStencil().fontFamily;
const HAND = loadCaveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const OSW = loadOswald("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;

const C = {
  ink: "#0A0C0E", night: "#0E1620", steel: "#8E989F", slate: "#171B1F", slateLite: "#232A31",
  wood: "#6B4A2C", woodLite: "#8A6238", hivis: "#F5C400", orange: "#FF6A13", red: "#E0301E",
  redDeep: "#8C160C", glow: "#FFD27A", warm: "#FFB347", white: "#F4F6F7", paper: "#F3EEE2",
};
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (seed: number, salt = 0) => {
  let h = Math.imul(((seed | 0) + salt * 7919) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};
const blurOf = (src: string) => src.replace(/\.(jpe?g|png)$/i, "_blur.jpg");
const fadeIO = (f: number, D: number, i = 7, o = 10) => Math.min(interpolate(f, [0, i], [0, 1], CL), interpolate(f, [D - o, D], [1, 0], CL));
/** Los arrays del kit llegan como {text} aunque la firma diga string: se acepta todo. */
const campo = (x: unknown, ...claves: string[]): string => {
  if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    for (const k of claves) if (o[k] !== undefined && o[k] !== null) return String(o[k]);
    return "";
  }
  return x === undefined || x === null ? "" : String(x);
};

/** Golpes de cada pieza (segundos desde el arranque): referencia para style.fx.compSfx. */
export const SFX_AT = {
  OutletDangerBoard: {
    whoosh: 0.1,
    clack: "startAt + i*stagger (cada renglón que entra)",
    cruz: "startAt + i*stagger + 0.4*stagger (cada cruz roja)",
    stamp: "después de la última cruz, ~0.84*D",
  },
} as const;

// ─── capas compartidas ────────────────────────────────────────────────────────────────────────
const Fondo: React.FC<{ src?: string; dark?: number; seed?: number }> = ({ src, dark = 0.68, seed = 1 }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const z = interpolate(f, [0, D], [1.1, 1.19], CL);
  const dx = (rnd(seed, 3) - 0.5) * 4 * interpolate(f, [0, D], [0, 1], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      {src ? <Img src={staticFile(blurOf(src))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translateX(${dx}%)` }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(10,12,14,${dark * 0.5}) 0%, rgba(10,12,14,${Math.min(0.97, dark + 0.28)}) 100%)` }} />
      {/* luz de linterna de taller: un charco tibio que respira lento */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 34% 26%, rgba(255,190,110,0.20), rgba(0,0,0,0) 58%)" }} />
    </AbsoluteFill>
  );
};

/** Pared de tablilla perforada (pegboard) con dos bultos colgados: el plano MÁS lejano. */
const ParedTaller: React.FC<{ push: number }> = ({ push }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{
      background: "linear-gradient(170deg, #23282C 0%, #171B1E 45%, #0D1013 100%)",
      transform: `translateX(${-push * 22}px) scale(1.04)`,
    }} />
    <AbsoluteFill style={{
      backgroundImage: "radial-gradient(circle at 17px 17px, rgba(0,0,0,0.55) 0 5px, rgba(0,0,0,0) 6px)",
      backgroundSize: "46px 46px", opacity: 0.5, transform: `translateX(${-push * 22}px) scale(1.04)`,
    }} />
    {/* rollo de alargue y un cinturón colgados de un clavo: siluetas, no detalles */}
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: 0.35, transform: `translateX(${-push * 34}px)` }}>
      <g fill="none" stroke="#0A0C0E" strokeWidth="16">
        <circle cx="1660" cy="250" r="86" /><circle cx="1660" cy="250" r="46" />
        <path d="M1746 250 q60 10 66 96" />
      </g>
      <path d="M120 96 q40 -22 92 0 l14 250 q-60 26 -120 0 z" fill="#0A0C0E" opacity="0.75" />
    </svg>
  </AbsoluteFill>
);

const Grano: React.FC<{ o?: number }> = ({ o = 0.08 }) => {
  const f = useCurrentFrame();
  const s = Math.floor(f / 2) % 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%"><filter id={`hh${s}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={s} /></filter><rect width="100%" height="100%" filter={`url(#hh${s})`} /></svg>
    </AbsoluteFill>
  );
};

const Vineta: React.FC<{ o?: number }> = ({ o = 0.6 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${o}) 100%)` }} />
);

/** Polvo DELANTE del tablero: pocos motas grandes, muy desenfocadas, más rápidas que el fondo. */
const PolvoDelante: React.FC<{ n?: number; o?: number }> = ({ n = 14, o = 0.45 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      {Array.from({ length: n }, (_, i) => {
        const r = 10 + rnd(i, 4) * 24;
        const sp = 0.3 + rnd(i, 2) * 0.5;
        const x = (rnd(i, 1) * 2100 - 90 + Math.sin((f + i * 17) / 40) * 30) % 2100;
        const y = (((rnd(i, 3) * 1250 - f * sp) % 1180) + 1180) % 1180 - 50;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: C.glow, opacity: 0.16 + rnd(i, 5) * 0.28, filter: `blur(${4 + r / 5}px)` }} />;
      })}
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ text?: string; color?: string; op?: number; size?: number }> = ({ text, color = C.hivis, op = 1, size = 30 }) =>
  text ? <div style={{ fontFamily: OSW, fontWeight: 600, fontSize: size, letterSpacing: 8, color, opacity: op, textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{text}</div> : null;

/** Sello de goma que golpea (escala 2,2 → 1 con temblor). */
const Sello: React.FC<{ text: string; at: number; color?: string; x: number; y: number; rot?: number; size?: number }> = ({ text, at, color = C.red, x, y, rot = -8, size = 110 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 260 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: interpolate(f - at, [0, 3], [0, 0.94], CL),
      border: `10px solid ${color}`, borderRadius: 18, padding: "6px 34px", fontFamily: STENCIL, fontSize: size, color, letterSpacing: 4, whiteSpace: "nowrap",
      mixBlendMode: "screen", textShadow: `0 0 18px ${color}55`, boxShadow: `0 0 30px ${color}33` }}>{text}</div>
  );
};

// ─── íconos del tablero (SVG puro, trazo amarillo de taller) ────────────────────────────────────
/** viewBox 0 0 100 100. Se dibujan con trazo, sin relleno: leen bien chicos y en la cruz roja después. */
const IconoTaller: React.FC<{ icon: string; s: string; w?: number }> = ({ icon, s, w = 6 }) => {
  const st = { stroke: s, strokeWidth: w, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  // ZAPA (power strip): cuerpo alargado, tres tomacorrientes, cordón que sale para abajo.
  if (icon === "strip") return (
    <g {...st}>
      <rect x="8" y="34" width="70" height="34" rx="10" />
      {[16, 36, 56].map((x) => <g key={x}><path d={`M${x} 44 v14`} /><path d={`M${x + 8} 44 v14`} /></g>)}
      <path d="M78 52 q16 0 15 16 q-1 14 -12 18" />
      <path d="M70 44 v14" />
    </g>
  );
  // ADAPTADOR DE TRES PATAS (cube tap): bloque con las tres patas afuera y tres bocas en la cara.
  if (icon === "adapter") return (
    <g {...st}>
      <rect x="34" y="24" width="44" height="52" rx="8" />
      <path d="M34 38 H16" /><path d="M34 62 H16" /><circle cx="22" cy="50" r="4" />
      <circle cx="50" cy="40" r="4" /><circle cx="66" cy="40" r="4" /><path d="M58 56 v10" />
    </g>
  );
  // ALARGUE FINO: rollo de cable con la ficha al final.
  if (icon === "cord") return (
    <g {...st}>
      <circle cx="40" cy="56" r="25" /><circle cx="40" cy="56" r="13" />
      <path d="M63 46 q10 -6 12 -18" />
      <rect x="68" y="14" width="24" height="15" rx="4" />
      <path d="M74 14 V6" /><path d="M86 14 V6" />
    </g>
  );
  // TOMACORRIENTE FLOJO O CALIENTE: la placa de pared con las ondas de calor arriba.
  if (icon === "outlet") return (
    <g {...st}>
      <rect x="28" y="28" width="44" height="64" rx="10" />
      <path d="M42 44 v13" /><path d="M58 44 v13" /><circle cx="50" cy="72" r="6" />
      <path d="M36 20 q5 -8 0 -15" /><path d="M50 18 q5 -8 0 -15" /><path d="M64 20 q5 -8 0 -15" />
    </g>
  );
  // CIRCUITO COMPARTIDO DE LA COCINA: una sola boca alimenta dos artefactos a la vez.
  if (icon === "kitchen") return (
    <g {...st}>
      <rect x="6" y="38" width="24" height="28" rx="6" />
      <path d="M14 48 v8" /><path d="M22 48 v8" />
      <path d="M30 46 H48 V28 H66" /><path d="M30 58 H48 V78 H66" />
      <path d="M56 42 l-9 13 h8 l-7 12" />
      <rect x="66" y="14" width="28" height="20" rx="3" /><path d="M66 20 h9" />
      <path d="M66 66 h26 v22 h-26 z" /><path d="M92 72 q8 4 0 12" />
    </g>
  );
  // respaldo: un calefactor genérico (resistencia brillante con rejilla)
  return (
    <g {...st}>
      <rect x="16" y="26" width="68" height="46" rx="8" />
      <path d="M28 38 v22" /><path d="M44 38 v22" /><path d="M60 38 v22" /><path d="M76 38 v22" />
      <path d="M30 72 l-6 14" /><path d="M70 72 l6 14" />
    </g>
  );
};

const DEFAULTS = [
  { label: "POWER STRIP", note: "Rated for lamps, not for heat", icon: "strip" },
  { label: "THREE-PRONG ADAPTER", note: "No path to ground", icon: "adapter" },
  { label: "THIN EXTENSION CORD", note: "Light cord cooks at 1500 watts", icon: "cord" },
  { label: "LOOSE OR WARM OUTLET", note: "Warm plate means a loose terminal", icon: "outlet" },
  { label: "SHARED KITCHEN CIRCUIT", note: "Fridge and microwave already live there", icon: "kitchen" },
];

/** Geometría del tablero (px locales del panel interior). */
const B = { x: 92, y: 104, w: 1136, h: 864, frame: 26, padX: 36, plateTop: 28, plateH: 106, rowsTop: 170, rowsBottom: 790 };

// ═══ 1) OUTLET DANGER BOARD ══════════════════════════════════════════════════════════════════
/** Tablero de taller colgado de dos clavos: los 5 lugares donde NUNCA se enchufa un calefactor.
 *  Cada renglón entra con su ícono dibujado y después lo cruza una X roja (con golpe y temblor),
 *  y al final cae el sello. El escalonado lo manda la fábrica (startAt/stagger); si no vienen, se
 *  calculan con la MISMA fórmula de kit.mjs `escalonar`, así el último renglón nunca queda a medio
 *  dibujar. La cruz se corre antes si el cue es corto: siempre termina antes del fundido de salida. */
export const OutletDangerBoard: React.FC<{
  durationInFrames: number;
  items?: ({ label?: string; note?: string; icon?: string } | string)[];
  title?: string;
  eyebrow?: string;
  sub?: string;
  stamp?: string;
  image?: string;
  startAt?: number;
  stagger?: number;
}> = ({
  durationInFrames,
  items,
  title = "NEVER PLUG A HEATER HERE",
  eyebrow = "SPACE HEATER · SHOP BOARD",
  sub = "Straight into the wall. Nothing in between.",
  stamp = "NEVER",
  image,
  startAt,
  stagger,
}) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: durCfg } = useVideoConfig();
  const D = Math.max(75, durationInFrames || durCfg || 180);
  const op = fadeIO(f, D);
  const F = (s: number) => Math.round(s * fps);

  const L = (items && items.length ? items : DEFAULTS).slice(0, 6).map((x) => {
    const label = campo(x, "label", "text");
    const d = DEFAULTS.find((y) => y.label === label.toUpperCase().trim());
    return { label: label || d?.label || "", note: campo(x, "note") || d?.note || "", icon: campo(x, "icon") || d?.icon || "heater" };
  }).filter((x) => x.label);
  const n = L.length || 1;

  // escalonado: mismo cálculo que kit.mjs `escalonar` (cola 1,1 s para que la última cruz respire)
  const inicioF = startAt != null ? Math.round(startAt) : Math.min(F(0.9), Math.max(F(0.25), Math.round(D * 0.06)));
  const pasoF = stagger != null ? Math.max(2, Math.round(stagger))
    : n > 1 ? Math.min(F(1.1), Math.max(F(0.55), Math.floor(Math.max(1, D - inicioF - F(1.1)) / (n - 1)))) : F(0.55);
  const rowIn = (i: number) => inicioF + i * pasoF;
  // la cruz entra a los 0,4 pasos; si el cue es corto se corre para terminar ANTES del fundido
  const cruzTope = D - F(0.34) - 14;
  const cruzAt = (i: number) => Math.min(rowIn(i) + Math.max(5, Math.round(pasoF * 0.4)), cruzTope);
  const finCruces = cruzAt(n - 1) + 14;
  const stampAt = Math.min(D - 12, Math.max(Math.round(D * 0.84), finCruces + 6));

  // geometría de los renglones
  const area = B.rowsBottom - B.rowsTop;
  const rowH = Math.min(112, Math.floor((area - (n - 1) * 12) / n));
  const gap = Math.floor((area - n * rowH) / Math.max(1, n - 1));
  const tile = Math.min(96, rowH - 16);
  const panelW = B.w - B.frame * 2;

  const board = spring({ frame: f - 2, fps, config: { damping: 15, stiffness: 110 } });
  const sway = Math.sin(f / 34) * 0.4 + (1 - board) * 2.2;
  const push = interpolate(f, [0, D], [0, 1], CL);
  const subK = interpolate(f, [D * 0.34, D * 0.46], [0, 1], { ...CL, easing: easeOut });
  const tapeK = interpolate(f, [8, 30], [0, 1], { ...CL, easing: easeOut });

  return (
    <AbsoluteFill style={{ opacity: op, overflow: "hidden" }}>
      <Fondo src={image} dark={0.72} seed={17} />
      <ParedTaller push={push} />

      {/* ── plano 2: el tablero colgado ── */}
      <div style={{ position: "absolute", left: B.x, top: B.y, width: B.w, height: B.h, transformOrigin: "50% -6%",
        transform: `translateY(${(1 - board) * 260}px) scale(${0.94 + board * 0.06}) rotate(${-0.6 + sway}deg)`, opacity: board }}>
        {/* clavos y alambre */}
        <div style={{ position: "absolute", left: "50%", top: -118, width: 420, height: 130, marginLeft: -210, transform: "translateX(0)" }}>
          <svg width="420" height="130"><path d="M12 8 L210 122 L408 8" stroke="#3A4148" strokeWidth="5" fill="none" /></svg>
          {[12, 408].map((x) => <div key={x} style={{ position: "absolute", left: x - 7, top: 0, width: 14, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#9AA4AD,#4A5158)", boxShadow: "0 3px 6px rgba(0,0,0,0.7)" }} />)}
        </div>
        {/* marco de madera */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: `linear-gradient(160deg, ${C.woodLite}, ${C.wood} 55%, #4E3520)`,
          boxShadow: "0 60px 90px rgba(0,0,0,0.8), 0 10px 24px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.14)" }} />
        {/* chapa del panel */}
        <div style={{ position: "absolute", inset: B.frame, borderRadius: 6, background: `linear-gradient(168deg, ${C.slateLite}, ${C.slate} 60%, #101417)`,
          boxShadow: "inset 0 18px 40px rgba(0,0,0,0.75), inset 0 0 0 3px rgba(0,0,0,0.55)" }}>
          {/* perforaciones de pegboard */}
          <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 13px 13px, rgba(0,0,0,0.5) 0 3.5px, rgba(0,0,0,0) 4.5px)", backgroundSize: "34px 34px", opacity: 0.55, borderRadius: 6 }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 12%, rgba(255,205,140,0.12), rgba(0,0,0,0) 62%)" }} />

          {/* placa amarilla de cabecera */}
          <div style={{ position: "absolute", left: B.padX, top: B.plateTop, width: panelW - B.padX * 2, height: B.plateH, background: `linear-gradient(175deg, #FFD83A, ${C.hivis})`,
            borderRadius: 6, transform: "rotate(-0.35deg)", boxShadow: "0 14px 26px rgba(0,0,0,0.55), inset 0 -6px 0 rgba(0,0,0,0.14)", padding: "10px 26px", overflow: "hidden" }}>
            <Eyebrow text={eyebrow} color="#3A2E00" size={24} />
            <div style={{ fontFamily: STENCIL, fontSize: title.length > 22 ? 44 : 54, lineHeight: 1.05, color: "#140F00", letterSpacing: 2, marginTop: 2 }}>{title.toUpperCase()}</div>
            <div style={{ position: "absolute", right: 22, top: 12, width: 62, height: 62, borderRadius: 31, border: "6px solid #140F00", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: BEBAS, fontSize: 44, color: "#140F00", transform: "rotate(6deg)" }}>{n}</div>
          </div>
          {/* cinta de peligro al pie del tablero: se despliega de izquierda a derecha */}
          <div style={{ position: "absolute", left: 0, bottom: 0, width: (panelW) * tapeK, height: 26, borderBottomLeftRadius: 6, overflow: "hidden", opacity: 0.95 }}>
            <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(-45deg, ${C.hivis} 0 26px, #141414 26px 52px)` }} />
          </div>

          {/* renglones */}
          {L.map((it, i) => {
            const rin = spring({ frame: f - rowIn(i), fps, config: { damping: 15, stiffness: 130 } });
            const cx = cruzAt(i);
            const k1 = interpolate(f, [cx, cx + 8], [0, 1], { ...CL, easing: easeOut });
            const k2 = interpolate(f, [cx + 6, cx + 14], [0, 1], { ...CL, easing: easeOut });
            const cruzado = k2 > 0.02;
            // temblor del golpe: decaimiento exponencial, determinista
            const tt = f - (cx + 6);
            const shake = tt > 0 ? 4 * Math.exp(-tt / 5) * Math.sin(tt * 1.7) : 0;
            const flash = tt > 0 ? Math.exp(-tt / 7) : 0;
            const y = B.rowsTop + i * (rowH + gap);
            return (
              <div key={i} style={{ position: "absolute", left: B.padX, top: y, width: panelW - B.padX * 2, height: rowH,
                opacity: rin, transform: `translateX(${(1 - rin) * -90}px) rotate(${(1 - rin) * -1.4}deg)` }}>
                {/* fondo del renglón: se tiñe de rojo cuando lo cruza */}
                <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: cruzado ? "rgba(224,48,30,0.13)" : "rgba(255,255,255,0.035)",
                  boxShadow: cruzado ? `inset 0 0 0 2px rgba(224,48,30,${0.35 + flash * 0.4})` : "inset 0 0 0 1px rgba(255,255,255,0.07)" }} />
                {/* número de renglón */}
                <div style={{ position: "absolute", left: 16, top: rowH / 2 - 26, width: 56, fontFamily: STENCIL, fontSize: 42, color: cruzado ? C.red : C.hivis, opacity: cruzado ? 0.9 : 0.75 }}>{String(i + 1).padStart(2, "0")}</div>
                {/* ícono + cruz roja */}
                <div style={{ position: "absolute", left: 82, top: (rowH - tile) / 2, width: tile, height: tile, borderRadius: 14,
                  background: "rgba(255,255,255,0.05)", boxShadow: cruzado ? `inset 0 0 0 3px ${C.red}, 0 0 ${26 * flash}px rgba(224,48,30,0.7)` : "inset 0 0 0 3px rgba(140,155,168,0.55)",
                  transform: `translateX(${shake}px)` }}>
                  <svg width={tile} height={tile} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
                    <IconoTaller icon={it.icon} s={cruzado ? "#C9D3DC" : C.hivis} w={cruzado ? 5 : 6} />
                  </svg>
                  <svg width={tile} height={tile} viewBox="0 0 96 96" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: cruzado ? 1 : 0 }}>
                    <g stroke={C.red} strokeWidth={13} strokeLinecap="round" fill="none" style={{ filter: "drop-shadow(0 0 8px rgba(224,48,30,0.65))" }}>
                      <path d="M22 22 L74 74" strokeDasharray={74} strokeDashoffset={74 * (1 - k1)} />
                      <path d="M74 22 L22 74" strokeDasharray={74} strokeDashoffset={74 * (1 - k2)} />
                    </g>
                  </svg>
                </div>
                {/* texto */}
                <div style={{ position: "absolute", left: 206, right: 130, top: it.note ? rowH / 2 - 44 : rowH / 2 - 24 }}>
                  <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: rowH > 100 ? 44 : 38, lineHeight: 1.05, letterSpacing: 1, textTransform: "uppercase",
                    color: cruzado ? "rgba(244,246,247,0.72)" : C.white, textShadow: "0 3px 12px rgba(0,0,0,0.85)" }}>{it.label}</div>
                  {it.note ? <div style={{ fontFamily: HAND, fontSize: 34, lineHeight: 1.1, color: cruzado ? "rgba(255,210,122,0.6)" : C.glow, marginTop: 2 }}>{it.note}</div> : null}
                </div>
                {/* chip NO + barra roja del borde: el remate del cruce */}
                {cruzado ? (
                  <React.Fragment>
                    <div style={{ position: "absolute", right: 24, top: rowH / 2 - 22, width: 74, height: 44, borderRadius: 8, background: C.red,
                      border: `3px solid ${C.redDeep}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: STENCIL, fontSize: 30, color: "#fff", letterSpacing: 2,
                      transform: `scale(${interpolate(k2, [0, 1], [1.9, 1])})`, opacity: k2, boxShadow: "0 8px 18px rgba(0,0,0,0.55)" }}>NO</div>
                    <div style={{ position: "absolute", right: 0, top: rowH / 2 - 34, width: 8, height: 68, borderRadius: 4, background: C.red, transform: `scaleY(${k2})`, boxShadow: `0 0 14px rgba(224,48,30,${0.5 * k2})` }} />
                  </React.Fragment>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── plano 3: columna de la derecha (número calado, nota a tiza, sello) ── */}
      <div style={{ position: "absolute", left: 1290 - push * 26, top: 30, fontFamily: BEBAS, fontSize: 620, lineHeight: 0.9, color: "transparent",
        WebkitTextStroke: `4px rgba(245,196,0,${0.42 + board * 0.16})`, letterSpacing: -10 }}>{n}</div>
      <div style={{ position: "absolute", left: 1300, top: 606, width: 540, opacity: subK, transform: `translateY(${(1 - subK) * 26}px) rotate(-2deg)` }}>
        <div style={{ fontFamily: HAND, fontSize: 58, lineHeight: 1.15, color: C.glow, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{sub}</div>
        <svg width="520" height="46" style={{ marginTop: -6 }}><path d="M8 26 Q240 4 512 24" stroke={C.red} strokeWidth="7" fill="none" strokeLinecap="round"
          strokeDasharray={520} strokeDashoffset={520 * (1 - subK)} /></svg>
      </div>
      {stamp ? <Sello text={stamp.toUpperCase()} at={stampAt} x={1568} y={880} rot={-9} size={118} /> : null}

      <PolvoDelante n={14} o={0.42} />
      <Vineta o={0.62} />
      <Grano />
    </AbsoluteFill>
  );
};
