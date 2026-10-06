// Piezas.tsx — material real y rótulos sobrios para el tutorial de Claudio.
// La imagen hace el trabajo principal; la identidad aparece sólo como una firma pequeña.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, rnd } from "./VoltStage";

const enter = (frame: number, frames = 8) => interpolate(frame, [0, frames], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad),
});

const shadow = `0 3px 14px ${rgba(V.ink0, 0.72)}`;

/** Clip Agnes a sangre: el plano real entra y el montaje no le agrega una placa encima. */
export const Clip: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 6);
  const z = interpolate(frame, [0, 180], [1.012, 1.028], {
    extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear,
  });
  const x = interpolate(frame, [0, 180], [-0.35, 0.35], {
    extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear,
  });
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: a,
          transform: `scale(${z.toFixed(4)}) translateX(${x.toFixed(3)}%)` }}
      />
    </AbsoluteFill>
  );
};

/** Foto real con un Ken-Burns casi imperceptible: movimiento de cámara, no efecto de póster. */
export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const frame = useCurrentFrame();
  const dir = rnd(seed) > 0.5 ? 1 : -1;
  const z = interpolate(frame, [0, 240], [1.018, 1.065], {
    extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.bezier(0.22, 0.61, 0.28, 1),
  });
  const x = interpolate(frame, [0, 240], [dir * -0.7, dir * 0.9], {
    extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear,
  });
  const y = Math.sin((frame + seed % 91) / 97) * 0.16;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${z.toFixed(4)}) translate(${x.toFixed(3)}%, ${y.toFixed(3)}%)` }}
      />
    </AbsoluteFill>
  );
};

/** Dato puntual, como una anotación del propio Claudio sobre el plano. */
export const IconoNum: React.FC<{ src: string; texto?: string }> = ({ src, texto }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 8);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: "5.2%", top: "8.5%", maxWidth: "52%",
        display: "flex", alignItems: "center", gap: 14, opacity: a,
        transform: `translateY(${((1 - a) * 12).toFixed(1)}px)`,
      }}>
        <Img src={staticFile(src)} style={{ width: 66, height: 66, objectFit: "contain", filter: `drop-shadow(0 3px 8px ${rgba(V.ink0, 0.65)})` }} />
        {texto ? (
          <div style={{
            maxWidth: "100%", padding: "9px 15px 11px", borderLeft: `4px solid ${V.volt}`,
            borderRadius: 3, background: rgba(V.ink0, 0.72), color: V.white,
            fontFamily: F_DISPLAY, fontSize: 39, lineHeight: 1.06,
            letterSpacing: "0.005em", textShadow: shadow,
          }}>{texto}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Página de guía: se presenta como una hoja consultada durante el tutorial, no como una UI. */
export const Lamina: React.FC<{
  src: string; bed?: string; rotulo?: string; foco?: [number, number]; zoom?: number;
}> = ({ src, bed, rotulo, foco = [50, 50], zoom = 1.06 }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 12);
  const z = interpolate(frame, [0, 180], [1, zoom], {
    extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.bezier(0.22, 0.61, 0.28, 1),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {bed ? <Img src={staticFile(bed)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.48, filter: "brightness(0.72)", transform: "scale(1.04)" }} /> : null}
      <AbsoluteFill style={{ background: "rgba(8, 9, 6, 0.24)" }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "relative", height: "84%", aspectRatio: "0.707", overflow: "hidden", opacity: a,
          transform: `scale(${(z * (0.985 + a * 0.015)).toFixed(4)})`, transformOrigin: `${foco[0]}% ${foco[1]}%`,
          border: `2px solid ${rgba(V.white, 0.88)}`, borderRadius: 4,
          boxShadow: `0 18px 44px ${rgba(V.ink0, 0.58)}`,
        }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
      {rotulo ? <SmallLabel text={rotulo} a={a} /> : null}
    </AbsoluteFill>
  );
};

const SmallLabel: React.FC<{ text: string; a: number }> = ({ text, a }) => (
  <div style={{
    position: "absolute", left: "5.2%", bottom: "8.5%", maxWidth: "42%", opacity: a,
    borderLeft: `4px solid ${V.volt}`, padding: "8px 13px", background: rgba(V.ink0, 0.68),
    color: V.white, fontFamily: F_DISPLAY, fontSize: 34, lineHeight: 1.08, textShadow: shadow,
  }}>{text}</div>
);

/** Rótulo breve: una anotación legible, sin panel gigante ni fondo sintético. */
export const Rotulo: React.FC<{ texto: string; pos?: "bl" | "tl" | "br" }> = ({ texto, pos = "bl" }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 7);
  const anchor: React.CSSProperties = pos === "tl"
    ? { left: "5.2%", top: "9%" }
    : pos === "br"
      ? { right: "5.2%", bottom: "10%", textAlign: "right" }
      : { left: "5.2%", bottom: "10%" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", ...anchor, maxWidth: "48%", opacity: a,
        transform: `translateY(${((1 - a) * 10).toFixed(1)}px)` }}>
        <div style={{
          display: "inline-block", padding: "9px 15px 11px", borderLeft: `4px solid ${V.volt}`,
          background: rgba(V.ink0, 0.68), borderRadius: 3, color: V.white,
          fontFamily: F_DISPLAY, fontSize: 36, lineHeight: 1.1, textShadow: shadow,
        }}>{texto}</div>
      </div>
    </AbsoluteFill>
  );
};

/** CTA como ficha de taller: el QR vive en una hoja y Claudio la sostiene, no aparece duplicado. */
export const Cta: React.FC<{ src: string; lado?: "der" | "izq" }> = ({ src, lado = "der" }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 12);
  const x = (1 - a) * (lado === "der" ? 28 : -28);
  const ficha = src.includes("qr_01")
    ? { eyebrow: "HOJA PARA GUARDAR", title: "CUANDO SE VA LA LUZ", sub: "Anotá qué necesitás mantener encendido.", pose: "leaning" as ClaudioPose }
    : src.includes("qr_02")
      ? { eyebrow: "HOJA DE PRUEBA", title: "LO QUE ENTREGA DE VERDAD", sub: "La cuenta que conviene revisar antes de comprar.", pose: "explaining" as ClaudioPose }
      : { eyebrow: "MAPA DEL TALLER", title: "TODO MEDIDO", sub: "Las guías para decidir con números y sin apuro.", pose: "happy" as ClaudioPose };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "rgba(6, 8, 6, 0.52)" }} />
      <div style={{ position: "absolute", top: "50%", [lado === "der" ? "right" : "left"]: "5.5%",
        width: 700, height: 820, opacity: a, transform: `translate(${x.toFixed(1)}px, -50%)`,
        borderRadius: 18, overflow: "hidden", background: V.paper,
        border: `3px solid ${rgba(V.white, 0.96)}`, boxShadow: `0 22px 52px ${rgba(V.ink0, 0.62)}` }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.18,
          backgroundImage: `linear-gradient(${rgba(V.ink0, 0.20)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(V.ink0, 0.20)} 1px, transparent 1px)`,
          backgroundSize: "34px 34px" }} />
        <div style={{ position: "absolute", left: 42, right: 42, top: 38 }}>
          <div style={{ fontFamily: F_BODY, fontSize: 22, fontWeight: 800, letterSpacing: "0.13em", color: V.voltSoft }}>{ficha.eyebrow}</div>
          <div style={{ marginTop: 10, fontFamily: F_DISPLAY, fontSize: 53, lineHeight: 0.98, color: V.ink0 }}>{ficha.title}</div>
          <div style={{ marginTop: 12, fontFamily: F_BODY, fontSize: 28, lineHeight: 1.12, color: rgba(V.ink0, 0.72), maxWidth: 570 }}>{ficha.sub}</div>
          <div style={{ marginTop: 18, height: 5, width: "100%", background: V.volt }} />
        </div>
        <div style={{ position: "absolute", left: 145, top: 290, width: 410, height: 410, padding: 22,
          borderRadius: 16, background: V.white, border: `2px solid ${V.ink0}`,
          boxShadow: `0 9px 0 ${rgba(V.ink0, 0.16)}` }}>
          <Img src={staticFile("img/cmesilencio/cms_cta_qr_only.png")} style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: F_DISPLAY,
          fontSize: 31, letterSpacing: "0.07em", color: V.ink0 }}>ESCANEÁ Y GUARDALA</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: F_BODY,
          fontSize: 21, letterSpacing: "0.08em", color: rgba(V.ink0, 0.62) }}>claudiomendoza.vercel.app</div>
      </div>
      <ClaudioCutout pose={ficha.pose} side={lado === "der" ? "right" : "left"}
        offset={lado === "der" ? "41%" : "41%"} width={430} bottom="8%" />
    </AbsoluteFill>
  );
};

/** Ficha de datos limpia: sólo para comparar medidas o resultados, con una foto real de fondo. */
export const Ficha: React.FC<{ texto: string; bed?: string }> = ({ texto, bed }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 10);
  const lineas = String(texto || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const titulo = lineas[0] || "";
  const filas = lineas.slice(1).filter((x) => !/^\d+\s*[·.\-–]?\s*$/.test(x) && x.replace(/[^\wáéíóúñÁÉÍÓÚÑ]/gi, "").length > 1);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {bed ? <Img src={staticFile(bed)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.54, filter: "brightness(0.64)", transform: "scale(1.04)" }} /> : null}
      <AbsoluteFill style={{ background: "rgba(8, 9, 6, 0.18)" }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "54%", opacity: a, transform: `translateY(${((1 - a) * 14).toFixed(1)}px)`,
          padding: "34px 42px 36px", borderRadius: 7, background: rgba(V.paper, 0.94),
          borderLeft: `8px solid ${V.volt}`, boxShadow: `0 18px 44px ${rgba(V.ink0, 0.48)}` }}>
          <div style={{ fontFamily: F_DISPLAY, fontSize: 57, lineHeight: 1.02, color: V.ink0, marginBottom: filas.length ? 24 : 0 }}>{titulo}</div>
          {filas.map((f, i) => <div key={i} style={{ display: "flex", gap: 13, alignItems: "baseline", padding: "10px 0", borderTop: `1px solid ${rgba(V.ink0, 0.14)}`, fontFamily: F_BODY, fontSize: 31, lineHeight: 1.18, color: V.ink1 }}><span style={{ color: V.voltSoft, fontFamily: F_DISPLAY, fontSize: 27 }}>•</span><span>{f}</span></div>)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type ClaudioPose = "thinking" | "explaining" | "happy" | "leaning";

const CLAUDIO_CUTOUTS: Record<ClaudioPose, string> = {
  thinking: "img/cmesilencio_v5/v5_claudio_thinking.png",
  explaining: "img/cmesilencio_v5/v5_claudio_explaining.png",
  happy: "img/cmesilencio_v5/v5_claudio_happy.png",
  leaning: "img/cmesilencio_v5/v6_claudio_leaning.png",
};

/**
 * Claudio recortado: un gesto editorial que firma la explicación sin convertirla en un anuncio.
 * El PNG viene aislado y el movimiento se calcula por frame para que el FARM sea determinista.
 */
export const ClaudioCutout: React.FC<{
  pose: ClaudioPose;
  side?: "left" | "right";
  offset?: number | string;
  width?: number;
  bottom?: number | string;
}> = ({ pose, side = "right", offset = "4%", width = 380, bottom = "2%" }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 14);
  const bob = Math.sin(frame / 23) * 1.5;
  const slide = (1 - a) * 32;
  const scale = 0.985 + a * 0.015;
  return (
    <Img
      src={staticFile(CLAUDIO_CUTOUTS[pose])}
      style={{
        position: "absolute", zIndex: 4, pointerEvents: "none", width, height: "auto", bottom,
        [side]: offset, opacity: a,
        transform: `${side === "right" ? "" : "scaleX(-1)"} translateY(${(slide + bob).toFixed(2)}px) scale(${scale.toFixed(4)})`,
        transformOrigin: "bottom center",
        filter: `drop-shadow(0 12px 12px ${rgba(V.ink0, 0.58)})`,
      }}
    />
  );
};

const BoardPhoto: React.FC<{
  src: string; x: string; y: string; w: string; h: string; label?: string; delay?: number;
}> = ({ src, x, y, w, h, label, delay = 0 }) => {
  const frame = useCurrentFrame();
  const a = enter(Math.max(0, frame - delay), 10);
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: w, height: h, opacity: a,
      transform: `translateY(${((1 - a) * 14).toFixed(1)}px)`, overflow: "hidden",
      border: `3px solid ${rgba(V.white, 0.95)}`, borderRadius: 5,
      boxShadow: `0 7px 14px ${rgba(V.ink0, 0.24)}`,
    }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {label ? <div style={{
        position: "absolute", left: 10, right: 10, bottom: 9, padding: "5px 8px 6px",
        background: rgba(V.ink0, 0.82), color: V.white, fontFamily: F_DISPLAY, fontSize: 25,
        lineHeight: 1.02, letterSpacing: "0.02em",
      }}>{label}</div> : null}
    </div>
  );
};

const BoardGrid: React.FC = () => (
  <AbsoluteFill style={{
    opacity: 0.42, pointerEvents: "none",
    backgroundImage: `linear-gradient(${rgba(V.ink0, 0.1)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(V.ink0, 0.1)} 1px, transparent 1px)`,
    backgroundSize: "44px 44px",
  }} />
);

const BoardTitle: React.FC<{ eyebrow: string; title: string; sub: string; a: number }> = ({ eyebrow, title, sub, a }) => (
  <div style={{ position: "absolute", left: "4.2%", top: "4.5%", width: "91%", opacity: a }}>
    <div style={{ fontFamily: F_BODY, fontSize: 23, color: V.voltSoft, fontWeight: 700, letterSpacing: "0.14em" }}>{eyebrow}</div>
    <div style={{ marginTop: 5, fontFamily: F_DISPLAY, fontSize: 60, lineHeight: 0.98, color: V.ink0, letterSpacing: "0.01em" }}>{title}</div>
    <div style={{ marginTop: 12, fontFamily: F_BODY, fontSize: 27, lineHeight: 1.12, color: rgba(V.ink0, 0.74), maxWidth: "72%" }}>{sub}</div>
    <div style={{ width: "100%", height: 4, marginTop: 18, background: V.volt }} />
  </div>
);

const BoardTag: React.FC<{ children: React.ReactNode; x: string; y: string; color?: string }> = ({ children, x, y, color = V.ink0 }) => (
  <div style={{
    position: "absolute", left: x, top: y, padding: "7px 12px 8px", borderLeft: `5px solid ${V.volt}`,
    background: rgba(V.paper, 0.92), color, fontFamily: F_DISPLAY, fontSize: 30, lineHeight: 1.02,
    boxShadow: `0 3px 8px ${rgba(V.ink0, 0.13)}`,
  }}>{children}</div>
);

const OpenDiagram: React.FC<{ progress: number }> = ({ progress }) => (
  <svg viewBox="0 0 760 360" style={{ width: "100%", height: "100%", overflow: "visible" }}>
    <g fill="none" stroke={V.ink0} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={progress}>
      <path d="M115 292 L115 108 L292 78 L292 292" strokeDasharray="800" strokeDashoffset={800 * (1 - progress)} />
      <path d="M292 292 L292 78 L475 108 L475 292" strokeDasharray="800" strokeDashoffset={800 * (1 - progress)} />
      <path d="M292 292 L292 188" stroke={V.volt} strokeDasharray="160" strokeDashoffset={160 * (1 - progress)} />
      <path d="M555 286 C514 240 514 122 555 76" stroke={V.voltSoft} strokeDasharray="320" strokeDashoffset={320 * (1 - progress)} />
      <path d="M592 286 C551 240 551 122 592 76" stroke={V.voltSoft} strokeDasharray="320" strokeDashoffset={320 * (1 - progress)} />
      <path d="M58 310 H655" stroke={rgba(V.ink0, 0.4)} strokeWidth="4" strokeDasharray="10 13" />
    </g>
    <rect x="190" y="224" width="116" height="68" rx="10" fill={rgba(V.ink0, 0.9)} opacity={progress} />
    <text x="248" y="268" textAnchor="middle" fill={V.white} fontFamily={F_DISPLAY} fontSize="31" opacity={progress}>MOTOR</text>
    <text x="546" y="55" fill={V.voltSoft} fontFamily={F_DISPLAY} fontSize="28" opacity={progress}>AIRE LIBRE</text>
  </svg>
);

const DistanceDiagram: React.FC<{ progress: number }> = ({ progress }) => (
  <svg viewBox="0 0 820 330" style={{ width: "100%", height: "100%", overflow: "visible" }}>
    <g opacity={progress} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M116 220 H715" stroke={rgba(V.ink0, 0.35)} strokeWidth="4" strokeDasharray="10 12" />
      <path d="M116 220 H390" stroke={V.volt} strokeWidth="10" strokeDasharray="520" strokeDashoffset={520 * (1 - progress)} />
      <path d="M116 220 H715" stroke={V.ink0} strokeWidth="6" strokeDasharray="1040" strokeDashoffset={1040 * (1 - progress)} />
      <path d="M390 200 V240 M715 200 V240" stroke={V.ink0} strokeWidth="6" />
      <path d="M116 172 V258" stroke={V.danger} strokeWidth="8" />
      <path d="M715 172 V258" stroke={V.ink0} strokeWidth="8" />
    </g>
    <rect x="62" y="178" width="92" height="84" rx="12" fill={V.ink0} opacity={progress} />
    <path d="M78 178 H138 V155 H78 Z" fill={V.ink0} opacity={progress} />
    <circle cx="390" cy="220" r="12" fill={V.volt} opacity={progress} />
    <circle cx="715" cy="220" r="12" fill={V.ink0} opacity={progress} />
    <text x="252" y="150" textAnchor="middle" fill={V.ink0} fontFamily={F_DISPLAY} fontSize="52" opacity={progress}>7 m</text>
    <text x="552" y="150" textAnchor="middle" fill={V.ink0} fontFamily={F_DISPLAY} fontSize="52" opacity={progress}>14 m</text>
    <text x="550" y="300" textAnchor="middle" fill={V.voltSoft} fontFamily={F_DISPLAY} fontSize="30" opacity={progress}>DOBLAR DISTANCIA · −6 dB</text>
  </svg>
);

const TestDiagram: React.FC<{ progress: number }> = ({ progress }) => {
  const values = [78, 72, 69, 66];
  const labels = ["ABIERTO", "PANTALLA", "JUNTAS", "FINAL"];
  const xs = [90, 300, 510, 720];
  return (
    <svg viewBox="0 0 820 360" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <path d="M80 278 H775" stroke={rgba(V.ink0, 0.26)} strokeWidth="4" strokeDasharray="10 12" />
      <path d="M90 78 C222 122 242 159 300 172 S450 218 510 218 S658 260 720 260" fill="none" stroke={V.volt} strokeWidth="9" strokeLinecap="round" strokeDasharray="860" strokeDashoffset={860 * (1 - progress)} />
      {values.map((v, i) => (
        <g key={v} opacity={progress}>
          <circle cx={xs[i]} cy={i === 0 ? 78 : i === 1 ? 172 : i === 2 ? 218 : 260} r="15" fill={i === values.length - 1 ? V.volt : V.ink0} />
          <text x={xs[i]} y={i === 0 ? 45 : i === 1 ? 139 : i === 2 ? 185 : 227} textAnchor="middle" fill={V.ink0} fontFamily={F_DISPLAY} fontSize="49">{v}</text>
          <text x={xs[i]} y="322" textAnchor="middle" fill={rgba(V.ink0, 0.76)} fontFamily={F_BODY} fontSize="20">{labels[i]}</text>
        </g>
      ))}
      <text x="770" y="44" textAnchor="end" fill={V.voltSoft} fontFamily={F_DISPLAY} fontSize="29" opacity={progress}>dB · MISMO PUNTO</text>
    </svg>
  );
};

type GuideBoardKind = "open" | "materials" | "test" | "distance";

/**
 * Lámina densa pero doméstica: una hoja de taller con fotos reales, grilla y datos puntuales.
 * No es una UI; es el cuaderno que Claudio consulta mientras arma y mide.
 */
export const GuideBoard: React.FC<{ kind: GuideBoardKind; duration?: number }> = ({ kind }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 14);
  const draw = interpolate(frame, [18, 62], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const config = {
    open: { bed: "img/cmesilencio_v5/v5_open_barrier.jpg", eyebrow: "HOJA DE TALLER 01", title: "BARRERA ABIERTA", sub: "Corta la línea de vista sin convertir el patio en una habitación para el motor." },
    materials: { bed: "img/cmesilencio_v5/v5_materials_table.jpg", eyebrow: "HOJA DE TALLER 02", title: "LISTA DE TALLER", sub: "Lo que entra en la mesa. La pantalla no abraza al generador." },
    test: { bed: "img/cmesilencio_v5/v5_meter_test.jpg", eyebrow: "HOJA DE TALLER 03", title: "UNA PRUEBA · CUATRO LECTURAS", sub: "Misma carga, mismo punto, cuatro momentos. El número se puede repetir." },
    distance: { bed: "img/cmesilencio_v5/v5_distance_measure.jpg", eyebrow: "HOJA DE TALLER 04", title: "PRIMERO, ALEJÁ EL RUIDO", sub: "Antes de construir: orientación, una superficie sólida y distancia al aire libre." },
  }[kind];
  const drift = 1.02 + a * 0.02;
  return (
    <AbsoluteFill style={{ background: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(config.bed)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.58, filter: "brightness(0.54) saturate(0.72)", transform: `scale(${drift.toFixed(4)})` }} />
      <AbsoluteFill style={{ background: "rgba(10, 11, 8, 0.22)" }} />
      <div style={{
        position: "absolute", left: "4.6%", top: "6.2%", width: "90.8%", height: "87.6%", opacity: a,
        transform: `translateY(${((1 - a) * 28).toFixed(1)}px)`, background: rgba(V.paper, 0.97),
        border: `2px solid ${rgba(V.white, 0.92)}`, borderRadius: 16, overflow: "hidden",
        boxShadow: `0 20px 48px ${rgba(V.ink0, 0.52)}`,
      }}>
        <BoardGrid />
        <BoardTitle eyebrow={config.eyebrow} title={config.title} sub={config.sub} a={a} />
        {kind === "open" ? (
          <>
            <div style={{ position: "absolute", left: "4%", top: "27%", width: "51%", height: "61%" }}><OpenDiagram progress={draw} /></div>
            <BoardPhoto src="img/cmesilencio_v5/v5_open_barrier.jpg" x="59%" y="27%" w="37%" h="36%" label="SIN TECHO · SIN PUERTA" delay={8} />
            <BoardPhoto src="img/cmesilencio_v3/v3_03_escape_aire_caliente.jpg" x="59%" y="67%" w="17%" h="20%" label="ESCAPE LIBRE" delay={16} />
            <BoardPhoto src="img/cmesilencio_v3/v3_43_caja_ventilada.jpg" x="78%" y="67%" w="18%" h="20%" label="AIRE" delay={22} />
            <BoardTag x="5%" y="82%">3 PANELES · U ABIERTA</BoardTag>
            <BoardTag x="38%" y="79%" color={V.danger}>NO ENCERRAR EL MOTOR</BoardTag>
          </>
        ) : null}
        {kind === "materials" ? (
          <>
            <div style={{ position: "absolute", left: "4.2%", top: "29%", width: "42%" }}>
              {["$6   CONTRACHAPADO", "$5   LANA MINERAL", "$3   SELLADOR", "RESTO   TORNILLOS + BASE"].map((row, i) => (
                <div key={row} style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "17px 0 16px", borderBottom: `2px solid ${rgba(V.ink0, 0.16)}`, opacity: enter(Math.max(0, frame - 8 - i * 8), 10) }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: i === 3 ? V.amber : V.volt, display: "inline-block", flex: "0 0 auto" }} />
                  <span style={{ fontFamily: F_DISPLAY, fontSize: 34, lineHeight: 1.04, color: V.ink0 }}>{row}</span>
                </div>
              ))}
            </div>
            <BoardPhoto src="img/cmesilencio_v5/v5_marking_plywood.jpg" x="51%" y="28%" w="44%" h="34%" label="MARCAR · MEDIR · CORTAR" delay={7} />
            <BoardPhoto src="img/cmesilencio_v3/v3_09_lana_mineral.jpg" x="51%" y="66%" w="20%" h="21%" label="ABSORBENTE" delay={15} />
            <BoardPhoto src="img/cmesilencio_v3/v3_08_sellador_junta.jpg" x="73%" y="66%" w="22%" h="21%" label="JUNTAS" delay={22} />
          </>
        ) : null}
        {kind === "test" ? (
          <>
            <div style={{ position: "absolute", left: "4.5%", top: "29%", width: "64%", height: "57%" }}><TestDiagram progress={draw} /></div>
            <BoardPhoto src="img/cmesilencio_v5/v5_meter_test.jpg" x="72%" y="29%" w="24%" h="28%" label="SONÓMETRO" delay={10} />
            <BoardPhoto src="img/cmesilencio_v3/v3_28_medidor_siete_metros.jpg" x="72%" y="61%" w="24%" h="25%" label="7 METROS" delay={18} />
            <BoardTag x="5%" y="82%">MISMA CARGA · MISMO PUNTO</BoardTag>
          </>
        ) : null}
        {kind === "distance" ? (
          <>
            <div style={{ position: "absolute", left: "4.5%", top: "29%", width: "53%", height: "58%" }}><DistanceDiagram progress={draw} /></div>
            <BoardPhoto src="img/cmesilencio_v5/v5_distance_measure.jpg" x="60%" y="28%" w="36%" h="34%" label="CABLE GRUESO · PATIO" delay={8} />
            <BoardPhoto src="img/cmesilencio_v3/v3_42_pared_linea.jpg" x="60%" y="65%" w="17%" h="21%" label="MURO" delay={16} />
            <BoardPhoto src="img/cmesilencio_v3/v3_54_comparacion_distancia.jpg" x="79%" y="65%" w="17%" h="21%" label="20 PASOS" delay={22} />
            <BoardTag x="5%" y="82%">AL AIRE LIBRE · −6 dB</BoardTag>
          </>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Pregunta editorial del apagón: tarjeta de cuaderno + Claudio pensando + teclado real. */
export const TypewriterCard: React.FC<{ duration?: number }> = ({ duration = 150 }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 12);
  const question = "¿QUÉ NECESITAS\nMANTENER ENCENDIDO\nCUANDO SE VA LA LUZ?";
  const reveal = Math.floor(interpolate(frame, [12, 78], [0, question.length], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  }));
  const typed = question.slice(0, reveal);
  const caret = Math.floor(frame / 8) % 2 === 0 ? "▌" : "";
  return (
    <AbsoluteFill style={{ background: V.ink0, overflow: "hidden", pointerEvents: "none" }}>
      <Img src={staticFile("img/cmesilencio_v5/v5_outage_notebook.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.44, filter: "brightness(0.55) saturate(0.72)", transform: "scale(1.04)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,11,8,0.90) 0%, rgba(10,11,8,0.76) 56%, rgba(10,11,8,0.20) 100%)" }} />
      <div style={{
        position: "absolute", left: "6%", bottom: "9%", width: "66%", minHeight: "57%", opacity: a,
        transform: `translateY(${((1 - a) * 50).toFixed(1)}px)`, padding: "42px 54px 46px", borderRadius: 28,
        border: `3px solid ${rgba(V.volt, 0.92)}`, background: rgba(V.ink0, 0.74),
        boxShadow: `0 18px 38px ${rgba(V.ink0, 0.54)}`,
        backgroundImage: `linear-gradient(${rgba(V.white, 0.06)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(V.white, 0.06)} 1px, transparent 1px)`,
        backgroundSize: "34px 34px",
      }}>
        <div style={{ fontFamily: F_BODY, fontSize: 25, letterSpacing: "0.13em", color: V.volt, fontWeight: 700 }}>UNA PREGUNTA ANTES DE SEGUIR</div>
        <div style={{ marginTop: 27, whiteSpace: "pre-line", fontFamily: F_DISPLAY, fontSize: 75, lineHeight: 1.04, color: V.white, letterSpacing: "0.01em", textShadow: shadow }}>{typed}<span style={{ color: V.volt }}>{caret}</span></div>
        <div style={{ marginTop: 28, width: 190, height: 5, background: V.volt }} />
      </div>
      <div style={{ position: "absolute", left: "6.2%", bottom: "5.2%", color: rgba(V.white, 0.72), fontFamily: F_BODY, fontSize: 22, letterSpacing: "0.06em", opacity: a }}>ANOTALO COMO SI FUERA EN EL CUADERNO</div>
      <ClaudioCutout pose="thinking" side="right" offset="5%" width={430} bottom="2%" />
      <Loop durationInFrames={Math.max(1, Math.min(duration, 150))}>
        <Audio src={staticFile("sfx/keyboard_type.mp3")} volume={0.10} />
      </Loop>
    </AbsoluteFill>
  );
};
