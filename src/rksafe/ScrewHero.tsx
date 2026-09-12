// ScrewHero.tsx — EL PLANO HERO DEL "TORNILLO DE 3 DÓLARES" (canal Ray Kessler)
//
// Pedido del creador (sep-2026): un plano tipo PRODUCTO DE MUSEO — fondo blanco graded
// ultra-moderno, las piezas de ferretería FLOTANDO en 3D sobre una tarima/estante,
// proyectando sombras, TODO desenfocado; y cuando Ray dice CUÁL es el tornillo, la cámara
// hace RACK-FOCUS al tornillo correcto (el corto y rechoncho), que se enfoca, se eleva y
// se ilumina, mientras los señuelos quedan borrosos y atenuados atrás.
//
// Es un QUIEBRE DELIBERADO de paleta (el canal es negro+brass): este beat es la vitrina
// blanca de galería. La continuidad la sostienen la tipografía del canal (Oswald/Inter),
// el acento brass y el keyring de esquina.
//
// Se puede usar de dos formas:
//   · SVG (default): dibuja los tornillos, cero assets. Control total del 3D/sombra/foco.
//   · Foto: pasá `heroImage` (y opcional `decoyImages`) y flota ESAS con el mismo rack-focus.
//
// Props clave:
//   focusStartF / focusEndF : cuadros (relativos a la Sequence) del rack-focus. Si no se pasan,
//     se derivan de la duración (28% → 52%). El build los ancla a la frase "the short stubby ones".
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, Keyring, rgba, clamp01, enter } from "./RayStage";

type Piece = {
  kind: "stubby" | "wood" | "bolt" | "nail";
  x: number;        // centro X en % del ancho
  scale: number;    // tamaño relativo
  rot: number;      // giro en grados
  hero?: boolean;
};

const DEFAULT_PIECES: Piece[] = [
  { kind: "bolt", x: 20, scale: 0.86, rot: -14 },
  { kind: "wood", x: 39, scale: 0.95, rot: 8 },
  { kind: "stubby", x: 58, scale: 1.0, rot: -6, hero: true },
  { kind: "nail", x: 79, scale: 0.82, rot: 18 },
];

// ── Un tornillo/pieza dibujado en SVG, con gradiente metálico y specular ───────────────────────
const ScrewSVG: React.FC<{ kind: Piece["kind"]; id: string }> = ({ kind, id }) => {
  // paleta metálica cálida (acero con leve tinte brass, pega con el canal)
  const g = `mg_${id}`;
  const gh = `mh_${id}`;
  const steelA = "#EDEDF0", steelB = "#AFB2BB", steelC = "#6E727C", steelD = "#4A4D55";
  const headGrad = (
    <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={steelA} />
      <stop offset="0.42" stopColor={steelB} />
      <stop offset="0.75" stopColor={steelC} />
      <stop offset="1" stopColor={steelD} />
    </linearGradient>
  );
  const shankGrad = (
    <linearGradient id={gh} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={steelC} />
      <stop offset="0.28" stopColor={steelA} />
      <stop offset="0.5" stopColor={steelB} />
      <stop offset="0.82" stopColor={steelC} />
      <stop offset="1" stopColor={steelD} />
    </linearGradient>
  );

  if (kind === "stubby") {
    // tornillo de chapa CORTO y RECHONCHO: cabeza plana ancha (pan/truss) + cruz Phillips + rosca corta
    return (
      <svg width="220" height="300" viewBox="0 0 220 300" style={{ overflow: "visible" }}>
        <defs>{headGrad}{shankGrad}</defs>
        {/* rosca corta */}
        <g>
          {Array.from({ length: 7 }).map((_, i) => (
            <path key={i} d={`M85 ${120 + i * 20} L135 ${120 + i * 20 + 8} L135 ${120 + i * 20 + 18} L85 ${120 + i * 20 + 10} Z`} fill={`url(#${gh})`} opacity={0.96} />
          ))}
          <path d="M108 258 L112 258 L110 286 Z" fill={steelD} />
        </g>
        {/* cabeza ancha */}
        <ellipse cx="110" cy="96" rx="82" ry="30" fill={`url(#${g})`} stroke={steelD} strokeWidth="1.4" />
        <ellipse cx="110" cy="88" rx="82" ry="26" fill={`url(#${g})`} />
        {/* cruz Phillips */}
        <g stroke={steelD} strokeWidth="7" strokeLinecap="round" opacity="0.9">
          <line x1="86" y1="88" x2="134" y2="88" />
          <line x1="110" y1="70" x2="110" y2="106" />
        </g>
        {/* specular */}
        <ellipse cx="86" cy="80" rx="26" ry="8" fill="#FFFFFF" opacity="0.55" />
      </svg>
    );
  }
  if (kind === "wood") {
    // tornillo de madera LARGO y fino (señuelo) — cabeza avellanada + punta
    return (
      <svg width="150" height="360" viewBox="0 0 150 360" style={{ overflow: "visible" }}>
        <defs>{headGrad}{shankGrad}</defs>
        <path d="M60 90 L90 90 L86 300 L75 340 L64 300 Z" fill={`url(#${gh})`} />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M58 ${100 + i * 18} L92 ${100 + i * 18 + 9} L92 ${100 + i * 18 + 15} L58 ${100 + i * 18 + 6} Z`} fill={rgba(V.ink0, 0.18)} />
        ))}
        <path d="M40 72 L110 72 L90 96 L60 96 Z" fill={`url(#${g})`} stroke="#4A4D55" strokeWidth="1.2" />
        <line x1="52" y1="84" x2="98" y2="84" stroke="#4A4D55" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="60" cy="80" rx="14" ry="4" fill="#FFF" opacity="0.5" />
      </svg>
    );
  }
  if (kind === "bolt") {
    // bulón hexagonal (señuelo)
    return (
      <svg width="200" height="300" viewBox="0 0 200 300" style={{ overflow: "visible" }}>
        <defs>{headGrad}{shankGrad}</defs>
        <rect x="80" y="120" width="40" height="150" rx="6" fill={`url(#${gh})`} />
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="80" y1={132 + i * 17} x2="120" y2={132 + i * 17 + 6} stroke={rgba(V.ink0, 0.2)} strokeWidth="3" />
        ))}
        <polygon points="100,52 148,80 148,132 100,160 52,132 52,80" fill={`url(#${g})`} stroke="#4A4D55" strokeWidth="1.6" />
        <polygon points="100,66 134,86 134,126 100,146 66,126 66,86" fill="none" stroke={rgba(V.ink0, 0.25)} strokeWidth="2" />
        <ellipse cx="82" cy="82" rx="16" ry="6" fill="#FFF" opacity="0.5" />
      </svg>
    );
  }
  // nail (señuelo)
  return (
    <svg width="120" height="360" viewBox="0 0 120 360" style={{ overflow: "visible" }}>
      <defs>{headGrad}{shankGrad}</defs>
      <path d="M54 60 L66 60 L62 320 L60 336 L58 320 Z" fill={`url(#${gh})`} />
      <ellipse cx="60" cy="58" rx="34" ry="11" fill={`url(#${g})`} stroke="#4A4D55" strokeWidth="1.2" />
      <ellipse cx="50" cy="54" rx="10" ry="3" fill="#FFF" opacity="0.5" />
    </svg>
  );
};

export const ScrewHero: React.FC<{
  kicker?: string;
  title?: string;
  sub?: string;
  pieces?: Piece[];
  heroImage?: string;        // opción foto ultra-real para el hero (si se pasa, reemplaza el SVG)
  decoyImages?: string[];    // fotos para los señuelos (opcional)
  bed?: string;              // no se usa (fondo propio blanco), aceptado por compatibilidad del build
  focusStartF?: number;
  focusEndF?: number;
  durationInFrames?: number;
}> = ({
  kicker = "THE ONE THAT STOPS THE LIFT",
  title = "$3",
  sub = "The short, stubby sheet-metal screw. Not the long one.",
  pieces = DEFAULT_PIECES,
  heroImage,
  decoyImages = [],
  focusStartF,
  focusEndF,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: dur, fps } = useVideoConfig();

  // rack-focus: arranca borroso, sostiene, y engancha nítido cuando Ray nombra el tornillo
  const fs = focusStartF ?? Math.round(dur * 0.30);
  const fe = focusEndF ?? Math.round(dur * 0.52);
  const focus = clamp01(interpolate(frame, [fs, fe], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 0.8, 0.24, 1) }));
  const appear = enter(frame, 12);

  // barrido de luz suave que cruza la vitrina
  const sweep = interpolate(frame % 220, [0, 220], [-30, 130]);

  const heroBlur = interpolate(focus, [0, 1], [16, 0]);
  const decoyBlur = interpolate(focus, [0, 1], [16, 7]);   // los señuelos quedan levemente fuera de foco
  const decoyDim = interpolate(focus, [0, 1], [1, 0.5]);
  const decoyDesat = interpolate(focus, [0, 1], [0, 0.6]);

  const SHELF_Y = 65;     // % de alto donde apoya la tarima

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Fondo galería: blanco graded ultra-moderno */}
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 34%, #FBFAF6 0%, #EFEDE6 52%, #DED9CE 100%)` }} />
      {/* velo brass muy sutil arriba + viñeta abajo (grade) */}
      <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 50% 8%, ${rgba(V.brassSoft, 0.10)} 0%, rgba(0,0,0,0) 60%)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,0) 62%, ${rgba(V.ink0, 0.10)} 100%)` }} />

      {/* La tarima / estante de museo */}
      <div style={{ position: "absolute", left: "10%", right: "10%", top: `${SHELF_Y}%`, height: 3, background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.28)} 20%, ${rgba(V.ink0, 0.28)} 80%, rgba(0,0,0,0))`, opacity: appear }} />
      <div style={{ position: "absolute", left: "14%", right: "14%", top: `calc(${SHELF_Y}% + 3px)`, height: 90, background: `linear-gradient(180deg, ${rgba(V.ink0, 0.10)} 0%, rgba(0,0,0,0) 100%)`, opacity: appear * 0.7, filter: "blur(2px)" }} />

      {/* Las piezas flotando */}
      {pieces.map((p, i) => {
        const isHero = !!p.hero;
        const bob = Math.sin((frame + i * 40) / 46) * (isHero ? 8 : 5);
        const lift = isHero ? interpolate(focus, [0, 1], [0, -26], { easing: Easing.out(Easing.cubic) }) : 0;
        const sc = p.scale * (isHero ? interpolate(focus, [0, 1], [1, 1.14]) : interpolate(focus, [0, 1], [1, 0.94]));
        const floatY = -70 + bob + lift;         // px por encima de la tarima
        const shadowSpread = interpolate(bob, [-8, 8], [1.06, 0.9]);
        const heroImg = isHero ? heroImage : decoyImages[Math.max(0, i - (pieces.findIndex((q) => q.hero)))];
        return (
          <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${SHELF_Y}%`, transform: "translate(-50%, 0)", opacity: appear }}>
            {/* sombra proyectada sobre la tarima */}
            <div style={{ position: "absolute", left: "50%", top: 6, width: 150 * p.scale, height: 26 * p.scale, transform: `translateX(-50%) scaleX(${shadowSpread.toFixed(3)})`, background: `radial-gradient(50% 50% at 50% 50%, ${rgba(V.ink0, isHero ? 0.5 : 0.34)} 0%, rgba(0,0,0,0) 70%)`, filter: `blur(${isHero ? 6 : 8}px)`, opacity: isHero ? 1 : decoyDim }} />
            {/* la pieza */}
            <div style={{
              position: "absolute", left: "50%", top: floatY,
              transform: `translate(-50%, -100%) rotate(${p.rot}deg) scale(${sc.toFixed(3)})`,
              filter: `blur(${(isHero ? heroBlur : decoyBlur).toFixed(1)}px) saturate(${isHero ? 1 : (1 - decoyDesat).toFixed(2)}) drop-shadow(0 14px 18px ${rgba(V.ink0, 0.28)})`,
              opacity: isHero ? 1 : decoyDim,
            }}>
              {heroImg
                ? <Img src={staticFile(heroImg)} style={{ width: 260 * p.scale, height: "auto", display: "block" }} />
                : <ScrewSVG kind={p.kind} id={`p${i}`} />}
            </div>
          </div>
        );
      })}

      {/* anillo de foco brass que "encuentra" el hero */}
      {(() => {
        const hi = pieces.findIndex((q) => q.hero);
        const hero = pieces[hi];
        if (!hero) return null;
        const ringA = clamp01(interpolate(focus, [0.35, 0.75, 1], [0, 1, 0.85]));
        return (
          <div style={{ position: "absolute", left: `${hero.x}%`, top: `${SHELF_Y - 12}%`, transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", border: `2px solid ${rgba(V.brass, 0.7 * ringA)}`, boxShadow: `0 0 40px ${rgba(V.brassSoft, 0.25 * ringA)}, inset 0 0 30px ${rgba(V.brassSoft, 0.12 * ringA)}`, opacity: ringA }} />
        );
      })()}

      {/* barrido de luz */}
      <AbsoluteFill style={{ background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.5) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)`, mixBlendMode: "overlay", opacity: 0.5 }} />

      {/* Copy — entra con el foco */}
      <div style={{ position: "absolute", left: "8%", top: "12%", opacity: clamp01(interpolate(focus, [0.25, 0.7], [0, 1])), transform: `translateY(${interpolate(focus, [0.25, 0.7], [14, 0])}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, textTransform: "uppercase", color: "#9A7A2E" }}>{kicker}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 6 }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 0.9, color: V.ink0, textShadow: `0 2px 0 ${rgba(V.brass, 0.15)}` }}>{title}</div>
        </div>
        <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 32, lineHeight: 1.3, color: "#3A3A3E", maxWidth: 560, marginTop: 8 }}>{sub}</div>
        <div style={{ height: 3, width: 190, marginTop: 14, background: `linear-gradient(90deg, ${V.brass}, ${rgba(V.brass, 0.1)})`, borderRadius: 2 }} />
      </div>

      {/* marca de esquina (brass sobre blanco) */}
      <div style={{ position: "absolute", right: "5%", bottom: "7%", display: "flex", alignItems: "center", gap: 10, opacity: appear * 0.9 }}>
        <Keyring size={28} />
        <div style={{ fontFamily: F_DISPLAY, fontSize: 22, letterSpacing: 2, color: "#9A7A2E" }}>The Four Thousand Doors</div>
      </div>
    </AbsoluteFill>
  );
};
