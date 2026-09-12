import {
  AbsoluteFill,
  Sequence,
  OffthreadVideo,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { F_INTER } from "../kit/premium/theme";

// ── ScrollDoc ───────────────────────────────────────────────────────────────
// UN SOLO lienzo continuo que abarca varias ideas sin cortes: la cámara SCROLLEA
// (zoom sutil hacia abajo, estilo iOS) por "placas" apiladas verticalmente. Cada
// placa = imagen/clip a un lado + texto explicativo escribiéndose al otro. Al bajar,
// la placa anterior sale por arriba y aparece la siguiente → se siente UNIFICADO,
// no un componente que termina y otro que empieza. Reemplaza tandas de comps sueltos.
// RENDER-SAFE: 100% determinista desde `frame`.
// ══════════════════════════════════════════════════════════════════════════════

const TEAL = "#12B3AE";
const TEALD = "#0c8f8b";
const VH = 1080;
const VW = 1920;

export type ScrollPanel = {
  media?: string; // path a mp4 (staticFile) — clip de fondo de la placa
  poster?: string; // o imagen estática (png/jpg) si no hay clip
  eyebrow?: string;
  heading?: string;
  body?: string; // se escribe con máquina de escribir
  side?: "L" | "R"; // lado de la imagen (default alterna por índice)
  stat?: string; // chip de dato opcional sobre la imagen
};

const cI = (f: number, a: number, b: number, x: number, y: number, e?: (n: number) => number) =>
  interpolate(f, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const EASE = Easing.out(Easing.cubic);
const sf = (p?: string) => (p ? staticFile(p) : undefined);

export const ScrollDoc: React.FC<{ durationInFrames: number; panels: ScrollPanel[] }> = ({
  durationInFrames: D,
  panels,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const N = Math.max(1, panels.length);
  const bound = (i: number) => Math.round((i * D) / N);
  const SCR = Math.min(22, Math.max(12, Math.round((D / N) * 0.42))); // ancho del scroll

  // posición de scroll = escalera suave 0 → N-1 (cada límite aporta 0..1)
  let sp = 0;
  for (let i = 1; i < N; i++) {
    const c = bound(i);
    sp += cI(frame, c - SCR / 2, c + SCR / 2, 0, 1, Easing.inOut(Easing.cubic));
  }
  const frac = sp - Math.floor(sp);
  const zoom = 1 + 0.022 * Math.sin(frac * Math.PI); // leve dolly durante el movimiento
  const scrollY = sp * VH;
  const outOp = cI(frame, D - 10, D, 1, 0);

  // spine vertical (conector) que recorre TODAS las placas → refuerza continuidad
  const spineX = 96;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#0a171c,#102830)", opacity: outOp, overflow: "hidden" }}>
      {/* halo ambiente fijo */}
      <AbsoluteFill style={{ background: "radial-gradient(58% 46% at 50% 42%, rgba(18,179,174,0.12), transparent 72%)" }} />

      {/* LIENZO que scrollea */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: VW,
          height: N * VH,
          transform: `translateY(${-scrollY}px) scale(${zoom})`,
          transformOrigin: `50% ${scrollY + VH / 2}px`,
        }}
      >
        {/* SPINE conector con nodos por placa + punto de luz que baja */}
        <svg width={VW} height={N * VH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line x1={spineX} y1={VH * 0.28} x2={spineX} y2={N * VH - VH * 0.28} stroke="rgba(255,255,255,0.12)" strokeWidth={4} strokeDasharray="2 16" strokeLinecap="round" />
          <line x1={spineX} y1={VH * 0.28} x2={spineX} y2={VH * 0.28 + sp * VH} stroke={TEAL} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${TEAL})` }} />
          {panels.map((_, i) => {
            const cy = i * VH + VH / 2;
            const on = sp >= i - 0.5;
            return <circle key={i} cx={spineX} cy={cy} r={on ? 13 : 9} fill={on ? TEAL : "rgba(255,255,255,0.25)"} style={{ filter: on ? `drop-shadow(0 0 12px ${TEAL})` : "none" }} />;
          })}
        </svg>

        {panels.map((p, i) => {
          const b0 = bound(i), b1 = bound(i + 1), len = b1 - b0;
          const imgLeft = p.side ? p.side === "L" : i % 2 === 0;
          const media = sf(p.media), poster = sf(p.poster);

          // entrada de la imagen (spring al llegar la placa)
          const app = spring({ frame: frame - b0 + 4, fps, config: { damping: 20, mass: 0.9, stiffness: 110 } });
          const imgRise = interpolate(app, [0, 1], [70, 0]);
          const imgScale = interpolate(app, [0, 1], [1.12, 1]);

          // texto: eyebrow → heading → body (máquina de escribir)
          const headIn = cI(frame, b0 + 6, b0 + 22, 0, 1, EASE);
          const body = p.body || "";
          const typed = Math.round(cI(frame, b0 + 20, b0 + Math.max(40, len * 0.6), 0, body.length));
          const typing = typed > 0 && typed < body.length;
          const shown = body.slice(0, typed);

          return (
            <div key={i} style={{ position: "absolute", left: 0, top: i * VH, width: VW, height: VH, display: "flex", flexDirection: imgLeft ? "row" : "row-reverse", alignItems: "center", gap: 90, padding: "0 150px 0 200px" }}>
              {/* MEDIA */}
              <div style={{ flex: "0 0 800px", height: 760, position: "relative", transform: `translateY(${imgRise}px)`, opacity: app }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 34, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)", border: `1.5px solid rgba(255,255,255,0.14)`, background: "#0c1b21" }}>
                  {media ? (
                    // el clip arranca cuando su placa se acerca (no en frame 0) → sin congelado
                    <Sequence from={Math.max(0, b0 - 12)} layout="none">
                      <OffthreadVideo src={media} muted playbackRate={1} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${imgScale})` }} />
                    </Sequence>
                  ) : poster ? (
                    <Img src={poster} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${imgScale})` }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg,#153740,#12B3AE 60%,#0c8f8b)" }} />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,20,25,0.10), rgba(10,20,25,0.42))" }} />
                  {p.stat && (
                    <div style={{ position: "absolute", left: 26, bottom: 26, padding: "12px 24px", borderRadius: 16, background: `linear-gradient(150deg,${TEAL},${TEALD})`, color: "#fff", fontFamily: F_INTER, fontWeight: 900, fontSize: 44, letterSpacing: -1, boxShadow: `0 12px 28px ${TEAL}55`, opacity: cI(frame, b0 + 16, b0 + 30, 0, 1), transform: `scale(${cI(frame, b0 + 16, b0 + 30, 0.7, 1, Easing.out(Easing.back(1.6)))})` }}>{p.stat}</div>
                  )}
                </div>
                {/* marco de acento */}
                <div style={{ position: "absolute", left: imgLeft ? -14 : "auto", right: imgLeft ? "auto" : -14, top: 40, bottom: 40, width: 6, borderRadius: 4, background: `linear-gradient(180deg,${TEAL},${TEALD})`, boxShadow: `0 0 18px ${TEAL}88`, opacity: app }} />
              </div>

              {/* TEXTO */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {p.eyebrow && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 22, opacity: cI(frame, b0 + 2, b0 + 14, 0, 1) }}>
                    <div style={{ width: 34, height: 4, borderRadius: 2, background: TEAL }} />
                    <span style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: TEAL }}>{p.eyebrow}</span>
                  </div>
                )}
                {p.heading && (
                  <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 76, lineHeight: 1.05, letterSpacing: -1.5, color: "#F3FAFB", marginBottom: 30, opacity: headIn, transform: `translateY(${interpolate(headIn, [0, 1], [24, 0])}px)` }}>{p.heading}</div>
                )}
                {body && (
                  <div style={{ fontFamily: F_INTER, fontWeight: 500, fontSize: 40, lineHeight: 1.5, color: "rgba(224,241,243,0.86)", maxWidth: 780 }}>
                    {shown}
                    {typing && <span style={{ display: "inline-block", width: 4, height: 40, marginLeft: 3, background: TEAL, transform: "translateY(6px)", opacity: frame % 16 < 8 ? 1 : 0.15 }} />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINACIÓN iOS (fija, no scrollea) */}
      <div style={{ position: "absolute", right: 54, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 16 }}>
        {panels.map((_, i) => {
          const active = Math.round(sp) === i;
          return <div key={i} style={{ width: 10, height: active ? 34 : 10, borderRadius: 6, background: active ? TEAL : "rgba(255,255,255,0.3)", boxShadow: active ? `0 0 12px ${TEAL}` : "none", transition: "none" }} />;
        })}
      </div>

      {/* viñetas superior/inferior para foco */}
      <AbsoluteFill style={{ pointerEvents: "none", background: "linear-gradient(180deg, rgba(6,14,18,0.55) 0%, transparent 16%, transparent 84%, rgba(6,14,18,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};
