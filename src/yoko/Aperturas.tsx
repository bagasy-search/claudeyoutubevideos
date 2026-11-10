// Aperturas de los 5 movimientos de yoko01. Escritas de cero para este video: cada una mueve la FOTO
// del movimiento igual que se mueve el cuerpo en ese ejercicio (ver D:/rtmp/yoko01/ideas.md).
// Fotos a 1920x1080 con objectFit:'fill' para que las coordenadas de ideas.md valgan.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSans } from "@remotion/google-fonts/DMSans";
import { FONTS } from "./Piezas";

const { fontFamily: SERIF } = loadSerif("normal", { weights: ["500", "700"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "700"], subsets: ["latin"] });
const NAVY = "#17233F", CREAM = "#F6F1E4", KAKI = "#E3741C", PALE = "#FFC98A";
const KANJI = ["", "一", "二", "三", "四", "五"];
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FULL: React.CSSProperties = { width: 1920, height: 1080, objectFit: "fill", display: "block" };
const sombra = "0 2px 18px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.6)";

// Barrido de capítulo: la franja del buzo deportivo (azul marino con dos rayas claras) cruza el cuadro.
export const FranjaBuzo: React.FC<{ dir: number; len?: number }> = ({ dir, len = 20 }) => {
  const f = useCurrentFrame();
  const t = f / len; if (t < 0 || t > 1) return null;
  const k = Easing.inOut(Easing.quad)(t);
  const vertical = dir % 4 === 2;
  const sentido = dir % 2 === 1 ? -1 : 1;
  const pos = interpolate(k, [0, 1], [-1.35, 1.35]);
  const raya = (o: React.CSSProperties) => <div style={{ position: "absolute", background: CREAM, ...o }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {vertical ? (
        <div style={{ position: "absolute", left: -200, width: 2320, height: 1500, top: 540 - 750 + pos * 1080, background: NAVY, transform: "skewY(-4deg)" }}>
          {raya({ left: 0, right: 0, top: 34, height: 26 })}{raya({ left: 0, right: 0, top: 78, height: 9, opacity: 0.8 })}
          {raya({ left: 0, right: 0, bottom: 34, height: 26 })}{raya({ left: 0, right: 0, bottom: 78, height: 9, opacity: 0.8 })}
        </div>
      ) : (
        <div style={{ position: "absolute", top: -200, height: 1480, width: 2700, left: 960 - 1350 + sentido * pos * 1920, background: NAVY, transform: `skewX(${dir % 4 === 3 ? -16 : -9}deg)` }}>
          {raya({ top: 0, bottom: 0, left: 40, width: 28 })}{raya({ top: 0, bottom: 0, left: 88, width: 10, opacity: 0.8 })}
          {raya({ top: 0, bottom: 0, right: 40, width: 28 })}{raya({ top: 0, bottom: 0, right: 88, width: 10, opacity: 0.8 })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Rótulo común: "MOVEMENT · 一", número grande que se traza de izquierda a derecha y se rellena, título palabra por palabra.
const Rotulo: React.FC<{ n: number; title: string; lado: "izq" | "der"; top?: number }> = ({ n, title, lado, top = 250 }) => {
  const f = useCurrentFrame();
  const traza = interpolate(f, [16, 40], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const relleno = interpolate(f, [36, 50], [0, 1], CL);
  const der = lado === "der";
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(${der ? 270 : 90}deg, rgba(10,16,34,0.88) 0%, rgba(10,16,34,0.5) 34%, rgba(10,16,34,0) 60%)` }} />
      <div style={{ position: "absolute", top, width: 760, display: "flex", flexDirection: "column", ...(der ? { right: 110, alignItems: "flex-end" } : { left: 110, alignItems: "flex-start" }) }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 10, color: PALE, opacity: traza }}>MOVEMENT · <span style={{ fontFamily: FONTS.JP, letterSpacing: 0, fontSize: 30 }}>{KANJI[n]}</span></div>
        <div style={{ position: "relative", height: 290, marginTop: 4 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 290, lineHeight: "290px", color: `rgba(246,241,228,${relleno})`, WebkitTextStroke: `3px ${CREAM}`,
            clipPath: der ? `inset(0 0 0 ${(1 - traza) * 100}%)` : `inset(0 ${(1 - traza) * 100}% 0 0)` }}>{String(n).padStart(2, "0")}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: der ? "flex-end" : "flex-start" }}>
          {title.split(" ").map((w, i) => {
            const p = spring({ frame: f - 30 - i * 5, fps: 30, config: { damping: 15, mass: 0.6 } });
            return <span key={i} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 88, color: "#FFFFFF", textShadow: sombra, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
          })}
        </div>
        <div style={{ height: 8, marginTop: 20, width: 300 * interpolate(f, [44, 62], [0, 1], CL), display: "flex", gap: 6 }}>
          <div style={{ flex: 1, background: KAKI }} /><div style={{ width: 22, background: CREAM }} />
        </div>
      </div>
    </>
  );
};

// 1 · The big stretch: la foto se destapa de abajo (talones, y≈1000) hacia arriba (manos, y≈40)
const Estira: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const sube = interpolate(f, [10, 40], [100, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  const k = interpolate(f, [10, dur], [0, 1], CL);
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${sube}% 0 0 0)`, transform: `scale(${1.1 + 0.05 * k}) translateY(${3 - 5 * k}%)`, transformOrigin: "50% 60%" }}>
        <Img src={staticFile(src)} style={FULL} />
      </div>
    </AbsoluteFill>
  );
};

// 2 · The long leg: se ve primero la cadera (x≈1080) y la imagen se alarga hacia el pie (x≈345)
const Alarga: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const izq = interpolate(f, [10, 44], [46, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const k = interpolate(f, [10, dur], [0, 1], CL);
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${izq}%)`, transform: `scale(1.08) translateX(${2.5 - 5 * k}%)`, transformOrigin: "56% 72%" }}>
        <Img src={staticFile(src)} style={FULL} />
      </div>
    </AbsoluteFill>
  );
};

// 3 · The side bend: el cuadro pivota sobre el asiento (1000,760), entra torcido y se hamaca hasta quedar derecho
const Hamaca: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - 10);
  const ang = 11 * Math.exp(-t / 16) * Math.cos(t / 7.5);
  const k = interpolate(f, [10, dur], [0, 1], CL);
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${ang}deg) scale(${1.36 - 0.1 * k})`, transformOrigin: "52% 70%" }}>
        <Img src={staticFile(src)} style={FULL} />
      </div>
    </AbsoluteFill>
  );
};

// 4 · Bend and open: la foto llega doblada por una bisagra horizontal (y=540) y se despliega
const Despliega: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const ab = interpolate(f, [12, 46], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const k = interpolate(f, [10, dur], [0, 1], CL);
  const mitad = (arriba: boolean) => (
    <div style={{ position: "absolute", left: 0, top: arriba ? 0 : 540, width: 1920, height: 540, overflow: "hidden", transformOrigin: arriba ? "50% 100%" : "50% 0%",
      transform: arriba ? `rotateX(${-92 * (1 - ab)}deg)` : undefined, backfaceVisibility: "hidden" }}>
      <Img src={staticFile(src)} style={{ ...FULL, marginTop: arriba ? 0 : -540 }} />
      {arriba && <div style={{ position: "absolute", inset: 0, background: `rgba(8,12,26,${0.75 * (1 - ab)})` }} />}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden", perspective: 1700, perspectiveOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `scale(${1.04 + 0.05 * k})` }}>
        {mitad(false)}{mitad(true)}
      </div>
    </AbsoluteFill>
  );
};

// 5 · Stand up and sit down: sube de un impulso desde abajo, se pasa, y baja muy lento hasta asentarse
const SubeBaja: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const sube = interpolate(f, [8, 26], [100, -3.5], { ...CL, easing: Easing.out(Easing.cubic) });
  const baja = interpolate(f, [26, Math.max(60, dur - 6)], [0, 3.5], { ...CL, easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${sube + baja}%) scale(1.09)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={FULL} />
      </div>
    </AbsoluteFill>
  );
};

const LADO: ("izq" | "der")[] = ["der", "izq", "der", "der", "izq"];
const TOP = [250, 120, 150, 110, 250];

export const Apertura: React.FC<{ n: number; title: string; src: string; dur: number }> = ({ n, title, src, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const Cuerpo = [Estira, Alarga, Hamaca, Despliega, SubeBaja][n - 1];
  return (
    <AbsoluteFill>
      {f >= 10 && (
        <AbsoluteFill style={{ opacity: o }}>
          <Cuerpo src={src} dur={dur} />
          <Rotulo n={n} title={title} lado={LADO[n - 1]} top={TOP[n - 1]} />
        </AbsoluteFill>
      )}
      <FranjaBuzo dir={n - 1} len={20} />
    </AbsoluteFill>
  );
};
