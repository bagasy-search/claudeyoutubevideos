import { useCurrentFrame, useVideoConfig, interpolate, staticFile, AbsoluteFill, OffthreadVideo } from "remotion";
import { Video } from "@remotion/media";
import { Media } from "../components/Media";
import { COLORS, FONT_STACK, sec } from "../theme";
import { F_INTER } from "../kit/premium/theme";
import { SfxCue, SFX } from "../components/Sfx";

// Paleta clínica teal para los canales MÉDICO (Dr. Federer). `medico` la activa;
// por defecto se usa la terrosa (COLORS) intacta para los canales earthy.
const MED_DIAG = {
  bg: "#EAF1F4",
  textDim: "rgba(20,35,43,0.40)",
  accent: "#12B3AE",
  dotIdle: "rgba(20,35,43,0.25)",
} as const;

// ── DIAGRAM BOARD ─────────────────────────────────────────────────────────────
// Sección EXPLICATIVA: una lámina gpt-image-2 a pantalla, ESTÁTICA (sin zoom, sin
// follow-cam, sin Ken-Burns) con el AVATAR chico en un recuadro en la esquina sup.
// DERECHA (la lámina se genera dejando esa esquina libre). Si hay que explicar más,
// se divide en varias PÁGINAS que cortan SECAS (~8-10s c/u). La quietud es la función:
// acá la gente tiene que LEER y entender, no mirar efectos.
//
// El avatar va MUTED (el audio de la narración lo sigue dando el AvatarLayer global,
// que en estas ventanas va en modo `hidden`). `avatarFrom` = frame GLOBAL de inicio
// para mantener el lip-sync.
export type DiagramPage = { image: string; eyebrow?: string };

const AV_W = 392;
const AV_H = 220; // 16:9, calza la esquina superior derecha despejada
const AV_M = 46;

export const DiagramBoard: React.FC<{
  durationInFrames: number;
  pages: DiagramPage[];
  avatar?: string;
  avatarFrom?: number;
  clip?: string; // clip CORTO del avatar (ya recortado a esta ventana) → se reproduce
  // desde el frame 0 SIN trimBefore (evita el deep-seek que sale negro en el farm).
  fit?: "cover" | "contain";
  medico?: boolean; // marco/eyebrow/puntos en teal clínico (canal Dr. Federer)
  // SELLO DE PERTENENCIA (opcional): marca la lámina como página de la guía del embudo.
  // Es de las estrategias que mejor funcionan: el espectador ve el valor y recién ahí lee de dónde sale.
  tag?: string;
}> = ({ durationInFrames, pages, avatar, avatarFrom, clip, fit = "contain", medico = false, tag }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const bgFill = medico ? MED_DIAG.bg : COLORS.bg1;
  const eyebrowColor = medico ? MED_DIAG.textDim : COLORS.textDim;
  const accentColor = medico ? MED_DIAG.accent : COLORS.accent;
  const dotIdle = medico ? MED_DIAG.dotIdle : "rgba(42,38,32,0.25)";
  const FONT = medico ? F_INTER : FONT_STACK;
  const n = Math.max(1, pages.length);
  const pageDur = durationInFrames / n;
  const active = Math.min(n - 1, Math.floor(frame / pageDur));
  const page = pages[active];

  // entrada/salida suaves del CONJUNTO (un fade corto, sin movimiento interno)
  const inOp = interpolate(frame, [0, sec(0.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - sec(0.3), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inOp, outOp);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: bgFill }}>
      {/* LÁMINA estática (corte seco entre páginas — sin zoom) */}
      <AbsoluteFill style={{ opacity: op }}>
        <Media key={active} src={page.image} style={{ width: "100%", height: "100%", objectFit: fit }} />
      </AbsoluteFill>

      {/* eyebrow opcional arriba-izquierda (la der. queda para el avatar) */}
      {page.eyebrow && (
        <div style={{ position: "absolute", top: 40, left: 56, fontSize: 22, fontWeight: 800, letterSpacing: 5, textTransform: "uppercase", color: eyebrowColor, opacity: op }}>
          {page.eyebrow}
        </div>
      )}

      {/* SELLO "página de la guía" — abajo a la izquierda, discreto, no tapa el diagrama */}
      {tag && (
        <div style={{
          position: "absolute", bottom: 44, left: 56, display: "flex", alignItems: "center", gap: 10,
          padding: "8px 16px", borderRadius: 999, opacity: op * 0.92,
          border: `1px solid ${accentColor}55`, background: "rgba(0,0,0,0.28)",
          fontFamily: FONT, fontSize: 19, fontWeight: 800, letterSpacing: 2.5,
          textTransform: "uppercase", color: accentColor,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: accentColor, display: "inline-block" }} />
          {tag}
        </div>
      )}

      {/* AVATAR chico, esquina superior DERECHA, estático */}
      {(clip || avatar) && (
        <div
          style={{
            position: "absolute",
            top: AV_M,
            left: width - AV_W - AV_M,
            width: AV_W,
            height: AV_H,
            borderRadius: 22,
            overflow: "hidden",
            opacity: op,
            border: "2px solid rgba(255,255,255,0.55)",
            boxShadow: `0 18px 50px rgba(0,0,0,0.45), 0 0 0 1px ${accentColor}44`,
          }}
        >
          {clip ? (
            // clip ya recortado a la ventana → desde frame 0, seek robusto en el farm
            <OffthreadVideo src={staticFile(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Video src={staticFile(avatar!)} trimBefore={avatarFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
      )}

      {/* puntos de página (si hay varias) */}
      {n > 1 && (
        <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12, opacity: op }}>
          {pages.map((_, i) => (
            <div key={i} style={{ width: i === active ? 30 : 11, height: 11, borderRadius: 6, background: i === active ? accentColor : dotIdle }} />
          ))}
        </div>
      )}

      {/* corte seco de página = un click suave */}
      {pages.map((_, i) => i > 0 && <SfxCue key={"pg" + i} at={Math.round(i * pageDur)} src={SFX.kickerType} volume={0.4} />)}
    </AbsoluteFill>
  );
};
