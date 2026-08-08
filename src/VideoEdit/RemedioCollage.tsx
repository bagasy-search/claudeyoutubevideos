import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

/**
 * RemedioCollage — estilo "recorte de revista / scrapbook documental".
 * Fondo de papel + PNGs recortados (rembg) flotando con sombra dura,
 * entrada paper-pop con leve rotación, título grande y etiquetas.
 *
 * Pensado para los momentos en que el Dr. habla de una receta / pastillas /
 * romero natural y queremos mostrar todo tipo "collage" con los objetos
 * recortados sobre papel.
 */

export type CollageItem = {
  /** ruta dentro de /public (usar staticFile). Debe ser un PNG con transparencia */
  src: string;
  /** posición del centro en % del lienzo */
  x: number;
  y: number;
  /** ancho en px (a 1920x1080) */
  w: number;
  /** rotación final en grados */
  rot?: number;
  /** frame en el que entra (relativo a la escena) */
  delay?: number;
  /** etiqueta manuscrita opcional debajo del recorte */
  label?: string;
  /** blanco y negro (estilo referencia) */
  bw?: boolean;
};

const INK = "#2b2620";
const ACCENT = "#c0392b";
const PAPER_CREAM = "#f3ecdc"; // crema plano tipo la referencia

// Papel crema procedural: color plano + grano sutil (SVG feTurbulence), sin assets.
const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PAPER_CREAM }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <filter id="paperGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paperGrain)" opacity="0.05" />
    </svg>
    {/* leve mancha cálida para que no sea plano perfecto */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 40% 35%, rgba(255,250,235,0.6) 0%, rgba(214,203,176,0.25) 100%)",
      }}
    />
  </AbsoluteFill>
);

const CutOut: React.FC<{ item: CollageItem }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = item.delay ?? 0;

  // paper-pop: escala con rebote + leve asentamiento de rotación
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 120 },
  });
  const scale = interpolate(s, [0, 1], [0.6, 1]);
  const opacity = interpolate(frame - delay, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });
  const rot = item.rot ?? 0;
  const rotNow = interpolate(s, [0, 1], [rot - 8, rot]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: `translate(-50%, -50%) rotate(${rotNow}deg) scale(${scale})`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Img
        src={staticFile(item.src)}
        style={{
          width: item.w,
          height: "auto",
          filter:
            (item.bw
              ? "grayscale(1) contrast(1.12) brightness(1.02) "
              : "") + "drop-shadow(8px 12px 10px rgba(0,0,0,0.35))",
        }}
      />
      {item.label ? (
        <div
          style={{
            marginTop: 6,
            fontFamily: "'Caveat', 'Bradley Hand', cursive",
            fontSize: 42,
            color: INK,
            background: "rgba(255,251,240,0.85)",
            padding: "2px 14px",
            transform: `rotate(${(rot ?? 0) * -0.4}deg)`,
            borderRadius: 4,
          }}
        >
          {item.label}
        </div>
      ) : null}
    </div>
  );
};

export const RemedioCollage: React.FC<{
  title?: string;
  kicker?: string;
  items?: CollageItem[];
}> = ({ title = "Romero natural", kicker = "LA RECETA", items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const defaultItems: CollageItem[] = [
    { src: "cutouts/p_fedvitd_romero_frasco_vidrio.png", x: 32, y: 60, w: 620, rot: -6, delay: 6, label: "aceite de romero", bw: true },
    { src: "cutouts/p_fedvitd_pastillas_calcio_mano.png", x: 72, y: 42, w: 680, rot: 5, delay: 16, label: "sin pastillas", bw: true },
    { src: "cutouts/p_fedvitd_romero_maceta.png", x: 78, y: 78, w: 440, rot: -4, delay: 26, label: "planta fresca", bw: true },
    { src: "cutouts/p_fedvitd_aceite_romero_frasco.png", x: 22, y: 28, w: 420, rot: 8, delay: 34, bw: true },
  ];
  const list = items ?? defaultItems;

  // título entra deslizando
  const tS = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const tY = interpolate(tS, [0, 1], [-40, 0]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* fondo papel crema procedural */}
      <PaperBg />
      {/* viñeta suave */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* título tipo titular de revista */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 90,
          transform: `translateY(${tY}px)`,
          opacity: tS,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: ACCENT,
            color: "#fff",
            fontFamily: "'Anton', 'Arial Black', sans-serif",
            fontSize: 34,
            letterSpacing: 3,
            padding: "4px 16px",
            transform: "rotate(-2deg)",
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontFamily: "'Anton', 'Arial Black', sans-serif",
            fontSize: 120,
            lineHeight: 0.95,
            color: INK,
            marginTop: 8,
            textShadow: "3px 3px 0 rgba(0,0,0,0.08)",
          }}
        >
          {title}
        </div>
      </div>

      {/* recortes */}
      {list.map((it, i) => (
        <CutOut key={i} item={it} />
      ))}
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES_COLLAGE = 150;

export const MainCollageDemo: React.FC = () => {
  return (
    <Sequence from={0} durationInFrames={TOTAL_FRAMES_COLLAGE}>
      <RemedioCollage />
    </Sequence>
  );
};
