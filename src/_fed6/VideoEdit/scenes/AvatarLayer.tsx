import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { COLORS } from "../theme";

// ── AVATAR LAYER ──────────────────────────────────────────────────────────────
// Una ÚNICA instancia del video del presentador (estufa_opt.mp4) que abarca todo
// el timeline: SIEMPRE provee el audio de la narración (aunque esté visualmente
// oculto), y su POSICIÓN se anima según un cronograma de modos para dar variedad:
//   · "full"     → pantalla entera (beats personales / cierre)
//   · "right"    → recuadro grande a la DERECHA (imagen/b-roll a la izquierda)
//   · "left"     → recuadro grande a la IZQUIERDA (imagen a la derecha)
//   · "cornerTR" → recuadro chico redondeado en la esquina superior derecha (PiP)
//   · "hidden"   → fuera de vista (solo se oye), el b-roll manda a pantalla completa
// Aparición/salida del avatar = CORTE LIMPIO (sin fade — no queda bien). El cambio de
// posición entre modos VISIBLES sí hace lerp de geometría (slide suave).

export type AvatarMode =
  | "full" | "right" | "left"
  | "halfL" | "halfR" // split 50/50 flush (avatar media pantalla, imagen la otra mitad)
  | "cornerTR" | "cornerTL" | "cornerBR" | "cornerBL"
  | "hidden";
export type AvatarWindow = { start: number; mode: AvatarMode }; // start en SEGUNDOS

const W = 1920;
const H = 1080;
const TRANS = 16; // frames de transición entre modos

type Geom = { x: number; y: number; w: number; h: number; r: number; op: number; chrome: number };

// PiP de esquina: mismo tamaño en las 4 esquinas (margen 54). Recuadros laterales
// grandes (left/right) = look "split" avatar a un lado + b-roll al otro.
const CW = 384, CH = 512, M = 54;
const G: Record<Exclude<AvatarMode, "hidden">, Geom> = {
  full: { x: 0, y: 0, w: W, h: H, r: 0, op: 1, chrome: 0 },
  right: { x: W - 760 - 70, y: 40, w: 760, h: 1000, r: 30, op: 1, chrome: 1 },
  left: { x: 70, y: 40, w: 760, h: 1000, r: 30, op: 1, chrome: 1 },
  // split 50/50 FLUSH (estilo Elias Yoder): avatar ocupa media pantalla, borde recto,
  // sin chrome → la imagen (HalfShot) llena la otra mitad pegada.
  halfL: { x: 0, y: 0, w: W / 2, h: H, r: 0, op: 1, chrome: 0 },
  halfR: { x: W / 2, y: 0, w: W / 2, h: H, r: 0, op: 1, chrome: 0 },
  cornerTR: { x: W - CW - M, y: M, w: CW, h: CH, r: 32, op: 1, chrome: 1 },
  cornerTL: { x: M, y: M, w: CW, h: CH, r: 32, op: 1, chrome: 1 },
  cornerBR: { x: W - CW - M, y: H - CH - M, w: CW, h: CH, r: 32, op: 1, chrome: 1 },
  cornerBL: { x: M, y: H - CH - M, w: CW, h: CH, r: 32, op: 1, chrome: 1 },
};

const geomOf = (m: AvatarMode): Geom => (m === "hidden" ? G.cornerTR : G[m]);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const AvatarLayer: React.FC<{
  src: string; // staticFile path del video del presentador (con su audio)
  windows: AvatarWindow[]; // ordenadas por start
  accent?: string;
  wav?: string; // wav para el borde audio-reactive; default = derivado del src
  // Encuadre del presentador POR VIDEO (el clip del avatar cambia entre videos). focusX/focusY =
  // dónde está su CARA en el frame fuente (0=izq/arriba .. 1=der/abajo); splitZoom = zoom extra en
  // el split 50/50. Si NO se pasa → comportamiento anterior EXACTO (cero regresión). Sirve para que
  // en halfR/halfL Federer quede CENTRADO en su media pantalla y no cortado contra el borde.
  avatarFocus?: { x?: number; y?: number; splitZoom?: number };
}> = ({ src, windows, accent = COLORS.accent, wav, avatarFocus }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame; // frames

  // AUDIO-REACTIVE: el borde del recuadro late con la amplitud de la voz.
  // Derivado del src (fly_opt.mp4 → fly.wav) salvo que se pase `wav` explícito.
  const wavSrc = wav ?? src.replace(/_opt\.mp4$/i, ".wav").replace(/\.mp4$/i, ".wav");
  const audio = useAudioData(staticFile(wavSrc));
  let amp = 0;
  if (audio) {
    const bins = visualizeAudio({ fps, frame, audioData: audio, numberOfSamples: 16 });
    amp = Math.min(1, (bins.slice(0, 6).reduce((a, b) => a + b, 0) / 6) * 7);
  }

  // ventana activa
  const starts = windows.map((w) => Math.round(w.start * fps));
  let i = 0;
  for (let k = 0; k < windows.length; k++) if (t >= starts[k]) i = k;
  const curMode = windows[i].mode;
  // ★ La PRIMERA ventana NO hace fade-in desde "hidden": el avatar tiene que estar
  // presente, lleno y nítido DESDE EL FRAME 0 (regla dura: el avatar abre el video).
  const prevMode = i > 0 ? windows[i - 1].mode : windows[0].mode;

  // geometrías "from" y "to" para fade-in-place (oculto = misma caja con op 0)
  const toGeom: Geom = curMode === "hidden" ? { ...geomOf(prevMode), op: 0 } : geomOf(curMode);
  const fromGeom: Geom = prevMode === "hidden" ? { ...geomOf(curMode), op: 0 } : geomOf(prevMode);

  const p = interpolate(t - starts[i], [0, TRANS], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const x = lerp(fromGeom.x, toGeom.x, p);
  const y = lerp(fromGeom.y, toGeom.y, p);
  const w = lerp(fromGeom.w, toGeom.w, p);
  const h = lerp(fromGeom.h, toGeom.h, p);
  const r = lerp(fromGeom.r, toGeom.r, p);
  // ★ APARICIÓN/SALIDA = CORTE LIMPIO, sin fade (el fade no queda bien en el avatar).
  // op no se interpola: salta a su valor destino (1 al aparecer, 0 al desaparecer).
  // El reposicionamiento entre posiciones VISIBLES sigue siendo suave (geometría lerp).
  const op = toGeom.op;
  const chrome = lerp(fromGeom.chrome, toGeom.chrome, p);

  // float sutil solo cuando NO está full (cuanto más chico, más flota)
  const smallness = 1 - w / W;
  const floatY = Math.sin(frame / 26) * 6 * smallness;
  const floatX = Math.cos(frame / 31) * 4 * smallness;

  // cover-sizing del video 16:9 dentro de la caja (sesgo a la cara)
  const ratio = 16 / 9;
  const kb = 1 + 0.05 * smallness * (0.5 + 0.5 * Math.sin(frame / 90));
  // ★ PUSH-IN lento y sutil cuando el avatar habla SOLO a pantalla completa (full), solo
  // en ventanas LARGAS (>4s) → "a veces". Alterna push-in / pull-out por ventana para que
  // no sea siempre igual. Le da vida al plano-presentador sin que se note brusco.
  const winEnd = i + 1 < starts.length ? starts[i + 1] : starts[i] + 99999;
  const winLen = winEnd - starts[i];
  let fullZoom = 1;
  if (curMode === "full" && winLen > fps * 4) {
    const prog = interpolate(t - starts[i], [0, winLen], [0, 1], { extrapolateRight: "clamp" });
    fullZoom = i % 2 === 0 ? 1 + 0.05 * prog : 1.05 - 0.05 * prog; // 1.00→1.05 ó 1.05→1.00
  }
  const isSplit = curMode === "halfR" || curMode === "halfL";
  // zoom extra SOLO en split y SOLO si el video lo pide (default 1 → sin cambio)
  const splitZoom = isSplit && avatarFocus?.splitZoom ? avatarFocus.splitZoom : 1;
  const zoom = (curMode === "full" ? fullZoom : kb) * splitZoom;
  let coverW = Math.max(w, h * ratio) * zoom;
  let coverH = coverW / ratio;
  const clampOff = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  // ENCUADRE del split (halfR/halfL): centrar la CARA de Federer en su media pantalla.
  //  · Si el video pasa avatarFocus.x (0..1 = dónde está su cara en ESE clip) → offX la centra ahí,
  //    con clamp para que el video SIEMPRE cubra la caja (nunca borde vacío ni corte al costado).
  //  · Si NO lo pasa → se mantiene el sesgo anterior (0.10): comportamiento idéntico a antes.
  const offX = isSplit
    ? (avatarFocus?.x != null
        ? clampOff(w / 2 - avatarFocus.x * coverW, w - coverW, 0)
        : (w - coverW) * 0.10)
    : (w - coverW) / 2;
  const offY = (isSplit && avatarFocus?.y != null)
    ? clampOff(h / 2 - avatarFocus.y * coverH, h - coverH, 0)
    : (h - coverH) * (0.28 + 0.04 * smallness); // mostrar la cara

  // ★ AUDIO CONTINUO (fix del corte de oración): UN SOLO <Video>, SIEMPRE montado en la MISMA
  // posición del árbol. Antes había DOS ramas (oculto/visible) con <Video> distintos → al cambiar
  // de modo React lo RE-MONTABA y el audio glitcheaba/cortaba la oración justo en el cambio de
  // escena. Ahora nunca se desmonta: cuando está "oculto" solo baja la opacidad a 0 (sigue sonando).
  const visible = op >= 0.001;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x + floatX,
          top: y + floatY,
          width: w,
          height: h,
          borderRadius: r,
          overflow: "hidden",
          opacity: op, // 0 = invisible pero el Video sigue montado y SONANDO (narración continua)
          // PiP "inset" limpio: sombra + hairline + glow de acento — SOLO cuando se ve.
          boxShadow:
            visible && chrome > 0.02
              ? `0 ${26 * chrome}px ${70 * chrome}px rgba(0,0,0,${0.5 * chrome}), 0 0 0 ${1.5 * chrome}px rgba(255,247,232,${0.5 * chrome}), 0 0 ${(8 + amp * 18) * chrome}px ${accent}${Math.round(amp * 70).toString(16).padStart(2, "0")}`
              : "none",
          border: visible && chrome > 0.02 ? `1px solid rgba(42,38,32,${0.22 * chrome})` : "none",
          willChange: "left, top, width, height, opacity",
        }}
      >
        <Video
          src={staticFile(src)}
          style={{ position: "absolute", left: offX, top: offY, width: coverW, height: coverH }}
        />
        {/* viñeta interna suave cuando es recuadro (solo si se ve) */}
        {visible && chrome > 0.02 && (
          <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 -70px 90px rgba(0,0,0,${0.4 * chrome})` }} />
        )}
      </div>
    </AbsoluteFill>
  );
};
