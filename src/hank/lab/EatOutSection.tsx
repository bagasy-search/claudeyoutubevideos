// EatOutSection — corte transversal de la marisma (explicador del "eat-out"): pasto arriba, la ESTERA DE
// RAÍCES que sostiene todo, barro blando abajo. Fase 1 se presenta cada capa; fase 2 la nutria come las
// raíces (se borran de izquierda a derecha, el pasto cae); fase 3 el suelo se desarma y el agua ocupa el
// hueco → "OPEN WATER". Todo procedural (SVG), determinista, con leve cámara en mano y profundidad.
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HAND, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

const W = 1920, H = 1080;
const WATER_Y = 520;          // nivel del agua
const TOP = 500;              // superficie de la marisma
const MAT0 = 520, MAT1 = 640; // estera de raíces
const MUD1 = 860;             // barro blando → arcilla

export const EatOutSection: React.FC<{
  photo?: string; labels?: { grass: string; roots: string; mud: string };
  healthy?: string; eaten?: string; open?: string;
  punch?: string; caption?: string; split?: [number, number];
}> = ({
  photo = "yc/hankeat/i_077.jpg", healthy = "yc/hankeat/i_145.jpg", eaten: eatenImg = "yc/hankeat/i_142.jpg", open = "yc/hankeat/i_155.jpg",
  labels = { grass: "MARSH GRASS", roots: "ROOT MAT — holds the marsh together", mud: "SOFT ORGANIC MUD" },
  punch = "OPEN WATER", caption = "No roots, no marsh.", split = [0.3, 0.62],
}) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const t = f / Math.max(1, D - 1);
  const pIntro = clamp(t / split[0]);
  const pEat = clamp((t - split[0]) / (split[1] - split[0]));
  const pFall = clamp((t - split[1]) / (1 - split[1] - 0.06));
  const eatX = lerp(-80, W + 80, easeInOut(pEat));   // frente de "comida" que avanza
  const eaten = (x: number) => clamp((eatX - x) / 160);
  const drop = easeInOut(pFall);                      // el suelo se hunde y el agua entra

  const blades = useMemo(() => Array.from({ length: 260 }, (_, i) => ({ x: (i / 260) * W + rnd(i) * 10, h: 40 + rnd(i + 7) * 90, lean: (rnd(i + 3) - 0.5) * 30, w: 3 + rnd(i + 5) * 3, g: rnd(i + 11) })), []);
  const roots = useMemo(() => Array.from({ length: 900 }, (_, i) => {
    const x = rnd(i + 21) * W, y0 = MAT0 + rnd(i + 23) * 30, len = 50 + rnd(i + 29) * 110, dx = (rnd(i + 31) - 0.5) * 60;
    return { x, d: `M${x.toFixed(0)} ${y0.toFixed(0)} q ${(dx * 0.4).toFixed(0)} ${(len * 0.5).toFixed(0)} ${dx.toFixed(0)} ${len.toFixed(0)}`, o: 0.4 + rnd(i + 37) * 0.6 };
  }), []);
  const rhiz = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const x = rnd(i + 301) * W, y = MAT0 + 10 + rnd(i + 303) * (MAT1 - MAT0 - 20), l = 120 + rnd(i + 307) * 260;
    return { x, d: `M${x.toFixed(0)} ${y.toFixed(0)} c ${(l * 0.3).toFixed(0)} ${(-10 + rnd(i + 309) * 20).toFixed(0)} ${(l * 0.6).toFixed(0)} ${(-8 + rnd(i + 311) * 16).toFixed(0)} ${l.toFixed(0)} ${(-6 + rnd(i + 313) * 12).toFixed(0)}`, w: 3 + rnd(i + 317) * 4 };
  }), []);
  const specks = useMemo(() => Array.from({ length: 420 }, (_, i) => ({ x: rnd(i + 401) * W, y: MAT1 + rnd(i + 403) * (H - MAT1), r: 1 + rnd(i + 407) * 3.5, c: rnd(i + 409) })), []);
  const chunks = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ x: rnd(i + 51) * W, y: MAT0 + rnd(i + 53) * (MUD1 - MAT0), s: 14 + rnd(i + 57) * 40, r: rnd(i + 59) * 360, v: 0.4 + rnd(i + 61) })), []);

  // cámara: leve empuje y respiración
  const camS = 1.02 + 0.05 * easeInOut(t), camX = Math.sin(f / 60) * 6, camY = Math.cos(f / 75) * 4;
  const waterRise = drop * (MUD1 - 40 - WATER_Y);     // cuánto baja el suelo = cuánto entra el agua
  const label = (on: number, y: number, txt: string, x = 90) => (
    <g opacity={ease(on) * (1 - pFall)} transform={`translate(${x + (1 - ease(on)) * -30}, ${y})`}>
      <line x1={0} y1={0} x2={70} y2={0} stroke={HK.bone} strokeWidth={3} />
      <circle cx={0} cy={0} r={7} fill={HK.orange} />
      <text x={86} y={11} fontFamily={SANS} fontSize={34} letterSpacing={5} fill={HK.bone} style={{ paintOrder: "stroke" }} stroke="rgba(0,0,0,0.6)" strokeWidth={6}>{txt}</text>
    </g>
  );

  return (
    <AbsoluteFill style={{ background: "#0A1614", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${camX}px, ${camY}px) scale(${camS})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: TOP + 20, overflow: "hidden" }}>
          <Img src={staticFile(healthy)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", transform: `scale(${1.08 + 0.04 * t})` }} />
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${Math.max(0, W - eatX)}px 0 0)` }}>
            <Img src={staticFile(eatenImg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", transform: `scale(${1.08 + 0.04 * t})` }} />
          </div>
          <Img src={staticFile(open)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", opacity: ease(clamp(pFall * 1.4)), transform: `scale(${1.08 + 0.04 * t})` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)" }} />
        </div>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8DB4C9" /><stop offset="1" stopColor="#E9D8B4" /></linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3D6B6A" stopOpacity="0.85" /><stop offset="1" stopColor="#12302F" stopOpacity="0.95" /></linearGradient>
            <linearGradient id="mat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A3520" /><stop offset="1" stopColor="#3A2A1A" /></linearGradient>
            <linearGradient id="mud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2E2418" /><stop offset="1" stopColor="#1C1711" /></linearGradient>
            <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A5147" /><stop offset="1" stopColor="#3A342E" /></linearGradient>
            <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 8} /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
            <clipPath id="soilClip"><rect x={0} y={TOP + waterRise} width={W} height={H} /></clipPath>
          </defs>
          {/* cielo y horizonte */}

          {/* capas del suelo (se hunden con drop) */}
          <g clipPath="url(#soilClip)">
            <rect x={0} y={MUD1} width={W} height={H - MUD1} fill="url(#clay)" />
            <rect x={0} y={MAT1} width={W} height={MUD1 - MAT1} fill="url(#mud)" />
            <rect x={0} y={MAT0 - 20} width={W} height={MAT1 - MAT0 + 20} fill="url(#mat)" />
          </g>
          {/* textura: motas del barro y la arcilla */}
          <g clipPath="url(#soilClip)" opacity={0.9}>
            {specks.map((k, i) => <circle key={i} cx={k.x} cy={k.y + waterRise} r={k.r} fill={k.c > 0.6 ? "#6B5A44" : k.c > 0.3 ? "#15110C" : "#8A7456"} opacity={0.45} />)}
          </g>
          {/* rizomas: los "cables" horizontales de la estera */}
          <g opacity={1 - drop}>
            {rhiz.map((r, i) => <path key={i} d={r.d} stroke="#B08A5C" strokeWidth={r.w} fill="none" strokeLinecap="round" opacity={0.75 * (1 - eaten(r.x))} />)}
          </g>
          {/* raíces: se borran detrás del frente de comida */}
          <g opacity={1 - drop}>
            {roots.map((r, i) => <path key={i} d={r.d} stroke={i % 3 ? "#C9A77A" : "#8E6E48"} strokeWidth={i % 5 ? 1.2 : 2.2} fill="none" opacity={r.o * (1 - eaten(r.x))} strokeLinecap="round" />)}
          </g>
          {/* pasto: cae y desaparece donde ya comieron */}
          {blades.map((b, i) => {
            const e = eaten(b.x); const sway = Math.sin(f / 18 + i) * 4;
            const fall = e * (1 - (i % 3) * 0.1);
            const x2 = b.x + b.lean + sway + fall * 90, y2 = TOP - b.h * (1 - fall * 0.85);
            return <path key={i} d={`M${b.x} ${TOP + 4} Q ${b.x + b.lean * 0.3} ${TOP - b.h * 0.5} ${x2} ${y2}`} stroke={`hsl(${lerp(95, 45, fall)}, ${lerp(38, 20, fall)}%, ${lerp(30 + b.g * 15, 35, fall)}%)`} strokeWidth={b.w} fill="none" strokeLinecap="round" opacity={1 - clamp(fall * 1.2 - 0.1) * 0.9 - drop} />;
          })}
          {/* terrones que se desprenden */}
          {chunks.map((c, i) => {
            const e = eaten(c.x); const k = clamp(pFall * 1.6 - c.v * 0.3);
            return <rect key={i} x={c.x} y={c.y + k * 220 * c.v} width={c.s} height={c.s * 0.7} rx={4} fill="#3F2D1C" opacity={e * (pEat > 0.2 ? 1 : 0) * (1 - k) * 0.9} transform={`rotate(${c.r * k} ${c.x} ${c.y})`} />;
          })}
          {/* agua: sube a ocupar el hueco */}
          <rect x={0} y={WATER_Y - 6} width={W} height={waterRise + 6 + (pFall > 0 ? 0 : 0)} fill="url(#water)" opacity={0.2 + 0.8 * drop} />
          <path d={`M0 ${WATER_Y} ${Array.from({ length: 25 }, (_, k) => `Q ${k * 80 + 40} ${WATER_Y + Math.sin(f / 10 + k) * 5} ${(k + 1) * 80} ${WATER_Y}`).join(" ")}`} stroke="#CFE3E0" strokeWidth={2} fill="none" opacity={0.5 + 0.4 * drop} />
          {/* borde del corte (bisel) */}
          <rect x={0} y={TOP + waterRise} width={W} height={6} fill="rgba(255,240,210,0.18)" />
          {label(clamp(pIntro * 3), TOP - 150, labels.grass)}
          {label(clamp(pIntro * 3 - 0.8), (MAT0 + MAT1) / 2, labels.roots)}
          {label(clamp(pIntro * 3 - 1.6), (MAT1 + MUD1) / 2, labels.mud)}
          <rect x={0} y={0} width={W} height={H} filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      {/* inserto de la nutria comiendo (foto real del video, recortada en círculo) que sigue al frente */}
      {pEat > 0 && pEat < 1 ? (
        <div style={{ position: "absolute", left: clamp(eatX - 150, 40, W - 340), top: 190, width: 300, height: 300, borderRadius: 150, overflow: "hidden", border: `5px solid ${HK.orange}`, boxShadow: "0 18px 40px rgba(0,0,0,0.6)", opacity: ease(pEat * 6) * (1 - clamp((pEat - 0.85) / 0.15)), transform: `scale(${0.8 + 0.2 * ease(pEat * 6)})` }}>
          <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.15 + 0.05 * Math.sin(f / 12)})` }} />
        </div>
      ) : null}
      {pEat > 0 && pEat < 1 ? (
        <div style={{ position: "absolute", left: clamp(eatX - 150, 40, W - 340) + 320, top: 300, fontFamily: HAND, fontSize: 56, color: HK.bone, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: ease(pEat * 5) * (1 - clamp((pEat - 0.8) / 0.2)) }}>eats the roots</div>
      ) : null}
      {/* golpe final */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: ease(clamp((pFall - 0.45) / 0.2)) }}>
        <div style={{ fontFamily: SERIF, fontSize: 150, color: HK.bone, letterSpacing: 4, textShadow: "0 10px 40px rgba(0,0,0,0.85)", transform: `scale(${1.15 - 0.15 * ease(clamp((pFall - 0.45) / 0.2))})` }}>{punch}</div>
        <div style={{ fontFamily: MONO, fontSize: 36, color: HK.orange, marginTop: 6 }}>{caption}</div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "#000", opacity: clamp((f - (D - 10)) / 10) }} />
    </AbsoluteFill>
  );
};
