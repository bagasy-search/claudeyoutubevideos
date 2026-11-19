// Escenas sobre fotos ch14a (ideas en D:/rtmp/ch14a/ideas.md). Código nuevo, sin SVG ni componentes hechos.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";

const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const io = Easing.bezier(0.45, 0, 0.2, 1);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
// polígono de elipse (contorno con n puntos) en coordenadas de 1920x1080
const elip = (cx: number, cy: number, rx: number, ry: number, n = 28) =>
  "polygon(" + Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `${(cx + rx * Math.cos(a)).toFixed(1)}px ${(cy + ry * Math.sin(a)).toFixed(1)}px`; }).join(", ") + ")";

// Escena 1: la boca del colador se acuesta y se vuelve la superficie del caldillo del tazón
export const ColadorTazon: React.FC<{ a: string; b: string; dur: number; tCol?: number; tLiso?: number }> = ({ a, b, dur, tCol = 199, tLiso = 263 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [tCol - 8, tCol + 34], [0, 1], { ...cl, easing: io }); // el disco se acuesta
  const fuera = interpolate(f, [tCol - 4, tCol + 26], [0, 1], cl); // afuera aparece el tazón
  const adentro = interpolate(f, [tCol + 22, tCol + 46], [1, 0], cl); // jitomates → caldillo
  const sx = 1, sy = 1 - k * (1 - 195 / 600), dx = 180 * k, dy = 60 * k;
  // cámara: antes acerca al colador, después al tazón, con deriva curva
  const camS = interpolate(f, [0, tCol], [1.0, 1.07], { ...cl, easing: io }) * (1 - 0.06 * k) + interpolate(f, [tCol + 40, dur], [0, 0.05], cl);
  const ox = interpolate(k, [0, 1], [765, 945]), oy = interpolate(k, [0, 1], [518, 578]);
  const drift = Math.sin(f / 70) * 10;
  const brillo = interpolate(f, [tLiso, tLiso + 42], [-0.3, 1.3], cl);
  return (
    <AbsoluteFill style={{ background: "#e9e6e1", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${drift}px,0) scale(${camS})`, transformOrigin: `${ox}px ${oy}px` }}>
        {fuera > 0 ? <Img src={staticFile(b)} style={FULL} /> : null}
        <AbsoluteFill style={{ opacity: 1 - fuera }}><Img src={staticFile(a)} style={FULL} /></AbsoluteFill>
        {adentro > 0 ? (
          <AbsoluteFill style={{ opacity: adentro, transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, transformOrigin: "765px 518px", filter: `drop-shadow(0 ${6 * k}px ${10 * k}px rgba(0,0,0,${0.25 * k}))` }}>
            <Img src={staticFile(a)} style={{ ...FULL, clipPath: elip(765, 518, 600, 600, 30) }} />
          </AbsoluteFill>
        ) : null}
        {f >= tLiso && brillo < 1.3 ? (
          <AbsoluteFill style={{ clipPath: elip(945, 578, 585, 186, 30), mixBlendMode: "screen", opacity: 0.55,
            background: `linear-gradient(100deg, rgba(255,255,255,0) ${(brillo * 100 - 14).toFixed(1)}%, rgba(255,236,220,0.55) ${(brillo * 100).toFixed(1)}%, rgba(255,255,255,0) ${(brillo * 100 + 14).toFixed(1)}%)` }} />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Escena 2: el chorro de sal de una foto cae dentro de la cuchara de la otra; la cámara baja con la sal
export const SalCuchara: React.FC<{ a: string; b: string; dur: number; tBaja?: number; tMedia?: number; texto?: string }> = ({ a, b, dur, tBaja = 128, tMedia = 208, texto = "½ cucharadita por taza" }) => {
  const f = useCurrentFrame();
  // mundo vertical: arriba y2730 a 1,6x (chorro en x 500, punta en y 1616); abajo y2731 a 1,3x desde y 1280 (cuenco en 499,1650)
  const camY = interpolate(f, [0, tBaja, tBaja + 64, dur], [150, 230, 1170, 1195], { ...cl, easing: io });
  const camX = Math.sin(interpolate(f, [tBaja, tBaja + 64], [0, Math.PI], cl)) * -40;
  const txt = spring({ frame: f - tMedia, fps: 30, config: { damping: 16, mass: 0.8 } });
  return (
    <AbsoluteFill style={{ background: "#2c2c2e", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 2700, transform: `translate(${camX}px, ${-camY}px)` }}>
        <Img src={staticFile(a)} style={{ position: "absolute", left: -1148, top: 0, width: 3072, height: 1728 }} />
        <Img src={staticFile(b)} style={{ position: "absolute", left: -8, top: 1280, width: 2496, height: 1404,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, black 165px)", maskImage: "linear-gradient(to bottom, transparent 0px, black 165px)" }} />
      </div>
      {f >= tMedia ? (
        <div style={{ position: "absolute", left: 1080, top: 640, opacity: txt, transform: `translateY(${(1 - txt) * 30}px)`,
          fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 64, color: "#fff7e8", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{texto}</div>
      ) : null}
    </AbsoluteFill>
  );
};

// Escena 3: el montón se escurre del puesto y quedan sólo cuatro jitomates sobre el paño
const T4 = [[885, 450, 138, 118], [1372, 650, 166, 136], [1040, 740, 176, 140], [783, 700, 128, 126]];
export const CuatroJitomates: React.FC<{ a: string; dur: number; tCae?: number; tJunta?: number; tPrecio?: number; precio?: string }> = ({ a, dur, tCae = 4, tJunta = 76, tPrecio = 127, precio = "$10 a $15" }) => {
  const f = useCurrentFrame();
  const c = interpolate(f, [tCae, tCae + 30], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
  const cam = interpolate(f, [0, dur], [1.0, 1.08], cl);
  const j = spring({ frame: f - tJunta, fps: 30, config: { damping: 12, mass: 1.1 } }); // se juntan con peso
  const p = spring({ frame: f - tPrecio, fps: 30, config: { damping: 15 } });
  const cx = 1020, cy = 600;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 52% 55%, rgb(34,64,48) 0%, rgb(20,40,30) 60%, rgb(12,24,18) 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: `${cx}px ${cy}px` }}>
        {c < 1 ? <Img src={staticFile(a)} style={{ ...FULL, transform: `translateY(${c * 1150}px) rotate(${c * 4}deg)`, transformOrigin: "0px 1080px" }} /> : null}
        {T4.map(([x, y, rx, ry], i) => {
          const tx = (cx - x) * 0.28 * j, ty = (cy - y) * 0.28 * j;
          return <AbsoluteFill key={i} style={{ transform: `translate(${tx}px,${ty}px)`, filter: `drop-shadow(0 ${14 * c}px ${18 * c}px rgba(0,0,0,${0.45 * c}))` }}>
            <Img src={staticFile(a)} style={{ ...FULL, clipPath: elip(x, y, rx, ry, 26) }} />
          </AbsoluteFill>;
        })}
      </AbsoluteFill>
      {f >= tPrecio ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 26}px)`,
          fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 72, color: "#fff4e0", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{precio}</div>
      ) : null}
    </AbsoluteFill>
  );
};
