import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";

// ── JOURNEY CANVAS ────────────────────────────────────────────────────────────
// Plano-secuencia infográfico: la cámara vuela sin cortes por un lienzo 2.5D parando
// en cada waypoint (profundidad, rack-focus, línea que se traza, pull-back final).
// ★ `dark` = paleta OSCURA + sans para el nicho ALARMA (Ben retirado); sin `dark`
//   usa la marca terrosa (default, para los videos documentales). Tarjetas GRANDES.

export type Waypoint = {
  x: number; y: number;
  z?: number;
  image?: string;
  label?: string;
  sub?: string;
  num?: string;
  dwell?: number;
  travel?: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIO = Easing.inOut(Easing.cubic);
function smoothPath(p: { x: number; y: number }[]) {
  if (p.length < 2) return "";
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
    d += ` C ${b.x + (c.x - a.x) / 6} ${b.y + (c.y - a.y) / 6}, ${c.x - (e.x - b.x) / 6} ${c.y - (e.y - b.y) / 6}, ${c.x} ${c.y}`;
  }
  return d;
}

export const JourneyCanvas: React.FC<{
  durationInFrames: number;
  waypoints: Waypoint[];
  worldImage?: string;
  eyebrow?: string;
  title?: string;
  accent?: string;
  dark?: boolean; // ★ modo oscuro (nicho alarma)
  focusScale?: number; // zoom al posarse (default 1.45 — tarjetas grandes)
  travelScale?: number; // zoom durante el viaje
}> = ({ durationInFrames, waypoints, worldImage, eyebrow, title, accent, dark = false, focusScale = 1.45, travelScale = 1.05 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ── paleta + tipografía según niche ──
  const PAL = dark
    ? { bg1: "#0E0E12", bg2: "#20212B", bg0: "#08080B", text: "#F6F6F8", textSoft: "rgba(246,246,248,0.74)", textDim: "rgba(246,246,248,0.46)", font: "'Arial Black', 'Helvetica Neue', Arial, sans-serif", line: "rgba(255,255,255,0.10)" }
    : { bg1: COLORS.bg1, bg2: COLORS.bg2, bg0: COLORS.bg0, text: COLORS.text, textSoft: COLORS.textSoft, textDim: COLORS.textDim, font: FONT_STACK, line: "rgba(42,38,32,0.10)" };
  const ACC = accent ?? (dark ? "#FFC400" : COLORS.accent);

  const CX = width * 0.5, CY = height * 0.54;
  const n = waypoints.length;
  const wxs = waypoints.map((w) => w.x), wys = waypoints.map((w) => w.y);
  const wcx = (Math.min(...wxs) + Math.max(...wxs)) / 2;
  const wcy = (Math.min(...wys) + Math.max(...wys)) / 2;
  const wspanX = (Math.max(...wxs) - Math.min(...wxs)) || 1;
  const wspanY = (Math.max(...wys) - Math.min(...wys)) || 1;

  const intro = sec(0.7);
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    const dw = sec(waypoints[i - 1]?.dwell ?? 2.4);
    const tv = sec(waypoints[i]?.travel ?? 1.5);
    arr[i] = i === 0 ? intro : arr[i - 1] + dw + tv;
  }
  const lastDwell = sec(waypoints[n - 1]?.dwell ?? 2.4);
  const endEnd = durationInFrames - sec(0.4);
  const endStart = Math.min(arr[n - 1] + lastDwell, endEnd - 1);

  let camX: number, camY: number, camS: number;
  let journeyProg = 0;
  if (frame < arr[0]) {
    const e = easeIO(interpolate(frame, [0, arr[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    camX = waypoints[0].x; camY = waypoints[0].y; camS = lerp(travelScale * 0.9, travelScale, e);
    journeyProg = 0;
  } else if (frame >= endStart) {
    const e = easeIO(interpolate(frame, [endStart, endEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const midX = waypoints.reduce((a, w) => a + w.x, 0) / n;
    const midY = waypoints.reduce((a, w) => a + w.y, 0) / n;
    const spanX = Math.max(...waypoints.map((w) => w.x)) - Math.min(...waypoints.map((w) => w.x)) || 1;
    const fit = Math.min(1.1, (width * 0.82) / spanX);
    camX = lerp(waypoints[n - 1].x, midX, e); camY = lerp(waypoints[n - 1].y, midY, e); camS = lerp(focusScale, fit, e);
    journeyProg = n - 1;
  } else {
    let i = 0;
    for (let k = 0; k < n; k++) if (frame >= arr[k]) i = k;
    const dwell = sec(waypoints[i].dwell ?? 2.4);
    const la = frame - arr[i];
    if (la < dwell || i === n - 1) {
      const look = i < n - 1 ? interpolate(la, [dwell - sec(0.5), dwell], [0, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO }) : 0;
      camX = lerp(waypoints[i].x, waypoints[Math.min(n - 1, i + 1)].x, look);
      camY = lerp(waypoints[i].y, waypoints[Math.min(n - 1, i + 1)].y, look);
      camS = interpolate(la, [0, sec(0.55), dwell], [travelScale, focusScale, focusScale], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
      journeyProg = i;
    } else {
      const tp = easeIO(interpolate(frame, [arr[i] + dwell, arr[i + 1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const prog = lerp(0.1, 1, tp);
      camX = lerp(waypoints[i].x, waypoints[i + 1].x, prog);
      camY = lerp(waypoints[i].y, waypoints[i + 1].y, prog);
      camS = lerp(focusScale, travelScale, tp);
      journeyProg = i + tp;
    }
  }

  // mapeo mundo→pantalla con parallax SUTIL + piso de escala alto (tarjetas grandes)
  const df = (z: number) => 0.92 + (z ?? 0.5) * 0.16;
  const map = (w: Waypoint) => {
    const z = w.z ?? 0.5;
    return { sx: CX + (w.x - camX) * camS * df(z), sy: CY + (w.y - camY) * camS * df(z), s: camS * (0.95 + z * 0.22), z };
  };
  const pts = waypoints.map(map);
  const segIdx = Math.floor(journeyProg);
  const segT = journeyProg - segIdx;
  const drawnPts = pts.slice(0, segIdx + 1).map((p) => ({ x: p.sx, y: p.sy }));
  if (segT > 0.001 && segIdx < n - 1) {
    drawnPts.push({ x: lerp(pts[segIdx].sx, pts[segIdx + 1].sx, segT), y: lerp(pts[segIdx].sy, pts[segIdx + 1].sy, segT) });
  }
  const pathD = drawnPts.length >= 2 ? smoothPath(drawnPts) : "";

  return (
    <AbsoluteFill style={{ fontFamily: PAL.font, background: dark ? `radial-gradient(circle at 50% 46%, ${PAL.bg2} 0%, ${PAL.bg1} 60%, ${PAL.bg0} 100%)` : PAL.bg1, overflow: "hidden" }}>
      {worldImage && (() => {
        const bgScale = 1.55 + (camS - 1) * 0.12;
        const margin = (bgScale - 1) / 2;
        const nx = Math.max(-1, Math.min(1, (camX - wcx) / (wspanX / 2)));
        const ny = Math.max(-1, Math.min(1, (camY - wcy) / (wspanY / 2)));
        const bgX = -nx * width * margin * 0.7;
        const bgY = -ny * height * margin * 0.7;
        return (
          <AbsoluteFill style={{ transform: `translate(${bgX}px, ${bgY}px) scale(${bgScale})`, opacity: dark ? 0.35 : 0.5 }}>
            <Media src={worldImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        );
      })()}
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32))" }} />

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {pathD && (
          <>
            <path d={pathD} fill="none" stroke={PAL.line} strokeWidth={3 * camS} strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke={ACC} strokeWidth={2.4 * camS} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          </>
        )}
      </svg>

      {waypoints.map((w, i) => {
        const m = pts[i];
        const dist = Math.hypot(m.sx - CX, m.sy - CY);
        const blur = Math.min(4, Math.max(0, dist / 340 - 0.5));
        const appear = interpolate(frame - (arr[i] - sec(0.6)), [0, sec(0.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO });
        const distFade = interpolate(dist, [640, 1150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const dim = appear * distFade;
        const dwellI = sec(waypoints[i].dwell ?? 2.4);
        // ⛔ El rango del interpolate de abajo TIENE que ser creciente. Para el último waypoint,
        // winEnd sale de endStart = min(arr[n-1] + lastDwell, endEnd - 1): si los waypoints no
        // entran en la duración que le dieron al componente, ese min agarra `endEnd - 1` y queda
        // ANTES de que el waypoint aparezca → [arr[i]-12, arr[i], winEnd-12, winEnd] deja de
        // crecer y Remotion tira "inputRange must be strictly monotonically increasing", que mata
        // el chunk entero a mitad del render. Pasó el 2026-07-27 en dos videos distintos
        // (ej. [360,372,127,139]: el waypoint arranca en el frame 372 y su ventana cerraba en 139).
        // El piso deja el fundido de salida sin sentido en ese caso, pero un cartel que se va raro
        // es infinitamente mejor que un render caído.
        const winEnd = Math.max(i === n - 1 ? endStart : arr[i] + dwellI, arr[i] + sec(0.5));
        const labelFocus = interpolate(frame, [arr[i] - sec(0.4), arr[i], winEnd - sec(0.4), winEnd], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO });
        const float = Math.sin(frame / 38 + i * 1.7) * 4 * m.z;
        const cardW = 330 * m.s, cardH = 220 * m.s; // ★ tarjetas GRANDES
        return (
          <div key={i} style={{ position: "absolute", left: m.sx, top: m.sy + float, transform: "translate(-50%,-50%)", opacity: w.image ? dim : dim * labelFocus, filter: blur > 0.25 ? `blur(${blur}px)` : undefined, zIndex: Math.round(m.z * 100), pointerEvents: "none" }}>
            {w.image ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 18 * m.s, overflow: "hidden", border: `${3 * m.s}px solid ${ACC}`, boxShadow: `0 ${22 * m.s}px ${50 * m.s}px rgba(0,0,0,0.55)`, background: PAL.bg2 }}>
                  <Media src={w.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 -40px 50px rgba(0,0,0,0.4)" }} />
                  <div style={{ position: "absolute", top: -14 * m.s, left: -14 * m.s, minWidth: 48 * m.s, height: 48 * m.s, padding: `0 ${13 * m.s}px`, borderRadius: 24 * m.s, background: dark ? PAL.bg0 : PAL.bg0, border: `${3 * m.s}px solid ${ACC}`, color: ACC, fontSize: 26 * m.s, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", boxSizing: "border-box" }}>{w.num ?? i + 1}</div>
                </div>
                {w.label && <div style={{ marginTop: 16 * m.s, fontSize: 36 * m.s, fontWeight: 800, color: PAL.text, textAlign: "center", opacity: labelFocus, textShadow: dark ? "0 3px 14px rgba(0,0,0,0.7)" : "none", maxWidth: 520 * m.s }}>{w.label}</div>}
                {w.sub && <div style={{ marginTop: 3, fontSize: 22 * m.s, fontWeight: 600, color: PAL.textSoft, textAlign: "center", opacity: labelFocus }}>{w.sub}</div>}
              </div>
            ) : (
              w.label && <div style={{ fontSize: 44 * m.s, fontWeight: 900, color: PAL.text, textShadow: dark ? "0 3px 14px rgba(0,0,0,0.7)" : "none" }}>{w.label}</div>
            )}
          </div>
        );
      })}

      {(eyebrow || title) && (
        <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", zIndex: 200 }}>
          {eyebrow && <div style={{ letterSpacing: 6, fontSize: 20, fontWeight: 800, textTransform: "uppercase", color: dark ? ACC : PAL.textDim }}>{eyebrow}</div>}
          {title && <div style={{ fontSize: 52, fontWeight: 800, color: PAL.text, marginTop: 8, textShadow: dark ? "0 3px 16px rgba(0,0,0,0.6)" : "none" }}>{title}</div>}
        </div>
      )}

      {waypoints.map((_, i) => (
        <SfxCue key={"a" + i} at={arr[i] - sec(0.3)} src={SFX.camTravel ?? SFX.whoosh2} volume={0.36} durationInFrames={sec(0.5)} />
      ))}
      {waypoints.map((_, i) => (
        <SfxCue key={"l" + i} at={arr[i]} src={SFX.nodeLand ?? SFX.transition} volume={0.5} durationInFrames={sec(0.9)} />
      ))}
    </AbsoluteFill>
  );
};
