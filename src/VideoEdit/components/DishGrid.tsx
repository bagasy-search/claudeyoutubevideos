import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// DishGrid — grilla dinámica de comidas para el HOOK. Las celdas van apareciendo
// una a una (pop con spring, escalonado) mientras la abuela dice "te voy a contar
// 25 comidas de antes". Toda la grilla tiene un zoom lento (Ken Burns) + viñeta
// cálida. Fondo oscuro para que respire sobre el b-roll. Cierra el primer minuto
// con energía en vez de una foto fija.
export const DishGrid: React.FC<{
  durationInFrames: number;
  images: string[];
  cols?: number;
  title?: string;
  eyebrow?: string;
}> = ({ durationInFrames, images, cols = 5, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const imgs = images.slice(0, cols * cols);
  const rows = Math.ceil(imgs.length / cols);

  // zoom lento del conjunto
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.08]);
  // fade in/out del bloque entero
  const blockIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const blockOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const gap = 8;
  const cellW = (width - gap * (cols + 1)) / cols;
  const cellH = (height - gap * (rows + 1)) / rows;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a06", opacity: blockIn * blockOut }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, padding: gap, display: "flex", flexWrap: "wrap", gap, alignContent: "flex-start" }}>
        {imgs.map((src, i) => {
          // aparición escalonada: cada celda entra ~1.4 frames después de la anterior
          const start = 4 + i * 1.4;
          const s = spring({ frame: frame - start, fps, config: { damping: 14, mass: 0.6 }, durationInFrames: 18 });
          const op = interpolate(frame - start, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ width: cellW, height: cellH, overflow: "hidden", borderRadius: 4, transform: `scale(${0.6 + s * 0.4})`, opacity: op, boxShadow: "0 4px 14px rgba(0,0,0,0.5)" }}>
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.92) contrast(1.03)" }} />
            </div>
          );
        })}
      </AbsoluteFill>
      {/* viñeta cálida */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px 70px rgba(0,0,0,0.72)", pointerEvents: "none" }} />
      {/* título centrado que crece con la grilla */}
      {(title || eyebrow) && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
          <div style={{ textAlign: "center", background: "rgba(12,9,5,0.55)", padding: "18px 40px", borderRadius: 10, backdropFilter: "blur(2px)", opacity: interpolate(frame, [10, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            {eyebrow && <div style={{ fontFamily: "Georgia, serif", fontSize: 30, letterSpacing: 6, color: "#E9C87A", textTransform: "uppercase" }}>{eyebrow}</div>}
            {title && <div style={{ fontFamily: "Georgia, serif", fontSize: 92, fontWeight: 700, color: "#FBF3E2", textShadow: "0 3px 18px rgba(0,0,0,0.8)", lineHeight: 1.05 }}>{title}</div>}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
