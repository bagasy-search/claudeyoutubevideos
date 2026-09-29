// SpotlightHunt — cacería nocturna desde el bote: la foto del pantano pasada a noche azul ("day for night"),
// un reflector de mano (cono volumétrico, borde suave, polvo en suspensión) barre los juncos; cuando se frena,
// aparecen pares de ojos que devuelven la luz (eyeshine naranja-rojo). HUD chico en la esquina. Sin disparos, sin gore.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

export type SpotlightHuntProps = { bg: string; label?: string; eyes?: number };

const src = (p: string) => (/^(https?:|data:|\/)/.test(p) ? p : staticFile(p));
const W = 1920, H = 1080;
const S = { x: 470, y: 1260 }; // la linterna: fuera de cuadro, abajo a la izquierda (mano de Hank en el bote)
const LAMP = "255,226,178"; // halógeno cálido

// ojos: posiciones relativas al punto donde se frena el haz (px), deterministas
const EYE_SLOTS = [
  { dx: -70, dy: 28, sep: 17, delay: 0 },
  { dx: 118, dy: -6, sep: 13, delay: 9 },
  { dx: 30, dy: 76, sep: 21, delay: 17 },
  { dx: -168, dy: -18, sep: 11, delay: 25 },
];

export const SpotlightHunt: React.FC<SpotlightHuntProps> = ({ bg, label = "NIGHT · SPOTLIGHT · 20 NOV – 31 MAR", eyes = 3 }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const nEyes = Math.max(0, Math.min(4, Math.round(eyes)));

  // --- tiempos
  const ON = 7; // encendido con parpadeo del halógeno
  const fStop = Math.round(clamp(D * 0.42, 40, 110));
  const out = clamp((f - (D - 10)) / 10);

  // --- punto del haz: barre de derecha a izquierda y se frena con un pequeño rebote
  const T0 = { x: 1640, y: 540 }, T1 = { x: 900, y: 600 };
  const ts = clamp((f - ON) / (fStop - ON));
  const sweep = easeInOut(ts);
  const settle = f > fStop ? Math.sin((f - fStop) / 3.2) * Math.exp(-(f - fStop) / 7) * 22 : 0;
  const hand = (k: number) => Math.sin(f / 7.3 + k) * 5 + Math.sin(f / 3.1 + k * 2) * 2.2 + Math.sin(f / 13 + k * 3) * 7;
  const tx = lerp(T0.x, T1.x, sweep) - settle + hand(0);
  const ty = lerp(T0.y, T1.y, sweep) + Math.sin(sweep * Math.PI) * -40 + hand(5) * 0.7;

  // --- geometría del cono
  const dx = tx - S.x, dy = ty - S.y;
  const dist = Math.hypot(dx, dy);
  const ang = (Math.atan2(dx, -dy) * 180) / Math.PI; // grados desde "arriba", horario (convención conic-gradient)
  const spotRX = 250, spotRY = 175;
  const hw = (Math.atan((spotRX * 0.85) / dist) * 180) / Math.PI / 1.3; // semiángulo: el cono llega justo a la mancha
  const flick = f < ON ? [0.2, 0.9, 0.3, 1, 0.55, 1, 0.9][f] ?? 1 : 1;
  const P = flick * (1 - out);

  const conic = (a: number) =>
    `conic-gradient(from ${ang - hw * 2.2}deg at ${S.x}px ${S.y}px, rgba(${LAMP},0) 0deg, rgba(${LAMP},${0.12 * a}) ${hw * 0.9}deg, rgba(${LAMP},${0.62 * a}) ${hw * 1.75}deg, rgba(${LAMP},${a}) ${hw * 2.2}deg, rgba(${LAMP},${0.62 * a}) ${hw * 2.65}deg, rgba(${LAMP},${0.12 * a}) ${hw * 3.5}deg, rgba(${LAMP},0) ${hw * 4.4}deg, rgba(${LAMP},0) 360deg)`;
  const along = `radial-gradient(circle at ${S.x}px ${S.y}px, #000 0px, rgba(0,0,0,0.9) ${dist * 0.55}px, rgba(0,0,0,0.55) ${dist * 0.95}px, rgba(0,0,0,0) ${dist * 1.25}px)`;
  const LIT = "brightness(1.12) saturate(0.9) sepia(0.45) contrast(1.35)";
  const nearMask = `radial-gradient(circle at ${S.x}px ${S.y}px, #000 0px, #000 ${dist * 0.8}px, rgba(0,0,0,0) ${dist * 1.05}px)`;
  const spotMask = `radial-gradient(ellipse ${spotRX}px ${spotRY}px at ${tx}px ${ty}px, #000 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0) 100%)`;

  // --- cámara: leve empuje + balanceo del bote
  const cam = `scale(${lerp(1.06, 1.11, f / D)}) rotate(${Math.sin(f / 22) * 0.35}deg) translateY(${Math.sin(f / 17) * 4}px)`;

  // --- polvo / insectos en el haz (coordenadas de mundo; sólo se ven dentro del cono)
  const dust = Array.from({ length: 110 }).map((_, i) => {
    const z = rnd(i * 3.7); // 0 lejos, 1 cerca
    const bx = rnd(i * 1.3) * W, by = 380 + rnd(i * 2.9) * 780;
    const x = bx + Math.sin(f / (40 + z * 30) + i) * (18 + z * 30) + f * (0.25 + z * 0.8);
    const y = by + Math.cos(f / (35 + rnd(i) * 30) + i * 2) * 14 - f * (0.15 + rnd(i * 5) * 0.3);
    const xx = ((x % W) + W) % W;
    const a = (Math.atan2(xx - S.x, -(y - S.y)) * 180) / Math.PI;
    const d = Math.hypot(xx - S.x, y - S.y);
    const inCone = clamp(1 - Math.abs(a - ang) / (hw * 1.3));
    const inLen = d < dist * 1.05 ? 1 : clamp(1 - (d - dist * 1.05) / 120);
    const tw = 0.55 + 0.45 * Math.sin(f / 3 + i * 1.7);
    const alpha = Math.min(1, Math.pow(inCone, 1.3) * inLen * tw * P * 1.4);
    const size = 1.6 + z * z * 9;
    return { x: xx, y, alpha, size, z };
  }).filter((p) => p.alpha > 0.02);

  return (
    <AbsoluteFill style={{ background: "#03060B", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: cam }}>
        {/* 1) noche: foto apagada y enfriada */}
        <AbsoluteFill>
          <Img src={src(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.62) saturate(0.2) contrast(1.5)" }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #213E78 0%, #2A4C86 24%, #1C3658 40%, #132840 65%, #0A1624 100%)", mixBlendMode: "multiply" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,4,10,0.55) 0%, rgba(3,6,14,0.05) 22%, rgba(3,6,14,0.2) 40%, rgba(3,6,14,0.45) 60%, rgba(2,4,8,0.8) 100%)" }} />

        {/* 2) lo que ilumina el haz: la misma foto en tono halógeno, recortada por el cono + la mancha */}
        <AbsoluteFill style={{ opacity: P, WebkitMaskImage: spotMask, maskImage: spotMask }}>
          <Img src={src(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: LIT }} />
        </AbsoluteFill>
        {/* derrame del cono sobre el agua/juncos cercanos (sólo hasta la mancha, no ilumina el horizonte) */}
        <AbsoluteFill style={{ opacity: P, WebkitMaskImage: nearMask, maskImage: nearMask }}>
          <AbsoluteFill style={{ WebkitMaskImage: conic(0.3), maskImage: conic(0.3) }}>
            <Img src={src(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: LIT }} />
          </AbsoluteFill>
        </AbsoluteFill>
        {/* núcleo caliente de la mancha */}
        <AbsoluteFill style={{ opacity: P, mixBlendMode: "screen",
          background: `radial-gradient(ellipse ${spotRX * 0.55}px ${spotRY * 0.5}px at ${tx}px ${ty}px, rgba(${LAMP},0.28), rgba(${LAMP},0.08) 60%, rgba(${LAMP},0) 100%)` }} />
      </AbsoluteFill>

      {/* 3) cono volumétrico en el aire (screen) */}
      <AbsoluteFill style={{ opacity: 0.42 * P, mixBlendMode: "screen", background: conic(1), WebkitMaskImage: along, maskImage: along }} />
      <AbsoluteFill style={{ opacity: 0.25 * P, mixBlendMode: "screen", background: conic(0.6).replace(`${hw * 4.4}deg`, `${hw * 6}deg`), WebkitMaskImage: along, maskImage: along }} />

      {/* 4) polvo en suspensión dentro del haz */}
      <AbsoluteFill style={{ mixBlendMode: "screen" }}>
        {dust.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x - p.size, top: p.y - p.size, width: p.size * 2, height: p.size * 2, borderRadius: "50%", opacity: p.alpha,
            background: p.z > 0.7 ? `radial-gradient(circle, rgba(${LAMP},0.55), rgba(${LAMP},0.15) 60%, rgba(${LAMP},0) 100%)` : `radial-gradient(circle, rgba(${LAMP},1), rgba(${LAMP},0) 70%)` }} />
        ))}
      </AbsoluteFill>

      {/* 5) ojos que devuelven la luz */}
      {EYE_SLOTS.slice(0, nEyes).map((e, i) => {
        const t0 = fStop + 5 + e.delay;
        const k = clamp((f - t0) / 8);
        if (k <= 0) return null;
        // iluminación: dependen de estar dentro de la mancha (retrorreflexión)
        const ex = tx + e.dx + Math.sin(f / 19 + i) * 3, ey = ty + e.dy + Math.cos(f / 23 + i * 2) * 2;
        const lit = clamp(1.35 - Math.hypot((ex - tx) / spotRX, (ey - ty) / spotRY));
        const blinkPh = (f - t0 - 20 - i * 11) % 67;
        const blink = blinkPh >= 0 && blinkPh < 4 ? [0.5, 0.05, 0.05, 0.6][blinkPh] : 1;
        const a = ease(k) * lit * blink * P;
        const tilt = Math.sin(f / 31 + i) * 3;
        const r = 3.6 + e.sep * 0.14;
        return (
          <div key={i} style={{ position: "absolute", left: ex, top: ey, opacity: a, mixBlendMode: "screen", transform: `rotate(${tilt}deg)` }}>
            {[-1, 1].map((s) => (
              <React.Fragment key={s}>
                <div style={{ position: "absolute", left: (s * e.sep) / 2 - r * 7, top: -r * 7, width: r * 14, height: r * 14, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,90,30,0.6), rgba(215,38,20,0.2) 45%, rgba(215,38,20,0) 70%)" }} />
                <div style={{ position: "absolute", left: (s * e.sep) / 2 - r, top: -r * 0.8, width: r * 2, height: r * 1.6, borderRadius: "50%",
                  background: "radial-gradient(circle, #FFF3D6 0%, #FFB347 35%, #FF5A1F 70%, rgba(215,38,20,0) 100%)" }} />
              </React.Fragment>
            ))}
          </div>
        );
      })}

      {/* 6) la linterna: resplandor en el borde inferior izquierdo + velo de lente */}
      <AbsoluteFill style={{ opacity: P, mixBlendMode: "screen",
        background: `radial-gradient(ellipse 520px 300px at ${S.x - 60}px ${H + 40}px, rgba(${LAMP},0.55), rgba(255,160,70,0.18) 45%, rgba(0,0,0,0) 100%)` }} />
      <AbsoluteFill style={{ opacity: 0.12 * P, mixBlendMode: "screen", background: `linear-gradient(${ang + 90}deg, rgba(${LAMP},0), rgba(${LAMP},0.5) 50%, rgba(${LAMP},0))` }} />

      {/* 7) textura: viñeta + grano fuerte de noche + ruido de sensor azul */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)" }} />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.42 }}>
        <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.1, transform: `translate(${(f * 37) % 11}px, ${(f * 53) % 7}px)` }}>
        <Img src={staticFile(`yc/grain/g${(f + 3) % 8}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(1) hue-rotate(180deg) saturate(3)" }} />
      </AbsoluteFill>

      {/* 8) HUD */}
      <div style={{ position: "absolute", left: 84, top: 72, opacity: ease((f - 10) / 14) * (1 - out) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 11, height: 11, borderRadius: 6, background: HK.orange, boxShadow: "0 0 10px rgba(255,122,26,0.9)", opacity: Math.floor(f / 15) % 2 ? 0.35 : 1 }} />
          <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 500, letterSpacing: "0.32em", color: "rgba(241,235,221,0.9)", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
            {label}
          </div>
        </div>
        <div style={{ marginTop: 12, marginLeft: 25, height: 1, width: lerp(0, 380, ease((f - 16) / 18)), background: "linear-gradient(90deg, rgba(241,235,221,0.6), rgba(241,235,221,0))" }} />
      </div>
      {/* marcas de visor */}
      <AbsoluteFill style={{ opacity: 0.35 * ease((f - 6) / 12) * (1 - out) }}>
        {[[60, 50, 1, 1], [W - 60, 50, -1, 1], [60, H - 50, 1, -1], [W - 60, H - 50, -1, -1]].map(([x, y, sx, sy], i) => (
          <div key={i} style={{ position: "absolute", left: sx > 0 ? x : x - 40, top: sy > 0 ? y : y - 40, width: 40, height: 40,
            borderLeft: sx > 0 ? "2px solid #F1EBDD" : undefined, borderRight: sx < 0 ? "2px solid #F1EBDD" : undefined,
            borderTop: sy > 0 ? "2px solid #F1EBDD" : undefined, borderBottom: sy < 0 ? "2px solid #F1EBDD" : undefined }} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: out }} />
    </AbsoluteFill>
  );
};
