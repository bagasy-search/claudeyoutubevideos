// OleTriangle — el triángulo de hierro del porche que llama a comer: separador de capítulo de la serie olworld.
// Porche de noche con nieve: el hierro golpea, el triángulo se balancea y vibra (amortiguado), el sonido se ve en anillos,
// y el título del capítulo aparece quemado en una tabla. El SONIDO va aparte en la línea de tiempo (sfx_ole/triangle.wav).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SLAB, HAND, woodBg, rnd } from "../olsup/OleSupTheme";
import { CL, easeOut, fadeOut } from "../olsup/OleBits";

const Snow: React.FC<{ f: number; n?: number; seed?: number }> = ({ f, n = 90, seed = 7 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 1.2 + rnd(seed + i) * 2.6, sz = 2 + rnd(seed + i * 3) * 6, x0 = rnd(seed + i * 5) * 1920;
      const y = ((rnd(seed + i * 7) * 1200 + f * sp * 2.2) % 1200) - 60;
      const x = x0 + Math.sin((f + i * 17) * 0.03) * 22 + f * 0.6;
      return <div key={i} style={{ position: "absolute", left: x % 1960, top: y, width: sz, height: sz, borderRadius: "50%", background: `rgba(235,242,250,${0.35 + rnd(seed + i * 11) * 0.5})`, filter: sz > 5 ? "blur(1.5px)" : undefined }} />;
    })}
  </>
);

export const OleTriangle: React.FC<{ kicker?: string; title: string; sub?: string; bed?: string; hit?: number }> = ({ kicker = "", title, sub, bed, hit = 12 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = fadeOut(f, durationInFrames, 8);
  const inP = interpolate(f, [0, 10], [0, 1], CL);
  const t = Math.max(0, f - hit);
  // vibración amortiguada después del golpe + balanceo lento
  const shake = f >= hit ? Math.sin(t * 2.2) * 7 * Math.exp(-t / 9) : 0;
  const swing = f >= hit ? Math.sin(t * 0.16) * 6 * Math.exp(-t / 50) : Math.sin(f * 0.05) * 0.8;
  // el golpeador entra, pega en `hit` y rebota
  const sx = interpolate(f, [0, hit - 2, hit, hit + 8, hit + 20], [-260, -40, 0, -120, -220], CL);
  const rings = [0, 7, 14, 21].map((d) => Math.max(0, f - hit - d));
  const titleP = interpolate(f, [hit + 4, hit + 18], [0, 1], { ...CL, easing: easeOut });
  const subP = interpolate(f, [hit + 16, hit + 34], [0, 100], CL);
  const CX = 640, CY = 420; // centro del triángulo
  return (
    <AbsoluteFill style={{ opacity: out * inP, backgroundColor: "#0b1320" }}>
      {bed ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile(bed)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(3px) brightness(0.55) saturate(0.7)", scale: String(1.06 + f * 0.0006) }} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 20%, #23324a 0%, #0e1726 55%, #070b12 100%)" }} />
      )}
      {/* farol del porche */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 18% 30%, rgba(255,180,90,0.45) 0%, rgba(255,150,60,0.12) 18%, transparent 40%)" }} />
      {/* viga del porche */}
      <div style={{ position: "absolute", left: -40, top: 120, width: 2000, height: 70, ...woodBg(OLE.wood2, 4), boxShadow: "0 18px 30px rgba(0,0,0,0.6), inset 0 -10px 0 rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", left: -40, top: 106, width: 2000, height: 18, background: "linear-gradient(180deg,#f2f6fa,#c9d4de)", borderRadius: "0 0 8px 8px", opacity: 0.85 }} />
      {/* cadena + triángulo */}
      <div style={{ position: "absolute", left: CX, top: 190, width: 0, height: 0, rotate: `${swing}deg`, transformOrigin: "0 0" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: -7, top: i * 18, width: 14, height: 22, borderRadius: 7, border: "4px solid #3a3733", background: "transparent" }} />
        ))}
        <svg width={420} height={420} style={{ position: "absolute", left: -210, top: 104, overflow: "visible", translate: `${shake}px 0` }}>
          <defs>
            <linearGradient id="iron" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#6b665f" /><stop offset="0.5" stopColor="#2a2724" /><stop offset="1" stopColor="#514c46" /></linearGradient>
          </defs>
          <path d="M210 10 L392 330 L40 330 L200 48" fill="none" stroke="url(#iron)" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M210 10 L392 330 L40 330 L200 48" fill="none" stroke="rgba(255,190,110,0.35)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" transform="translate(-5,-5)" />
        </svg>
      </div>
      {/* golpeador */}
      <div style={{ position: "absolute", left: CX + 60 + sx, top: CY + 120, width: 300, height: 18, borderRadius: 9, background: "linear-gradient(180deg,#5d5852,#24211e)", rotate: "-18deg", boxShadow: "6px 10px 16px rgba(0,0,0,0.6)" }} />
      {/* anillos de sonido */}
      {rings.map((r, i) => r > 0 ? (
        <div key={i} style={{ position: "absolute", left: CX - r * 14, top: CY + 70 - r * 14, width: r * 28, height: r * 28, borderRadius: "50%", border: `3px solid rgba(255,214,150,${Math.max(0, 0.55 - r * 0.018)})` }} />
      ) : null)}
      <Snow f={f} />
      {/* tabla con el título quemado */}
      <div style={{ position: "absolute", left: 1060, top: 300, width: 760, padding: "34px 40px 40px", borderRadius: 14, ...woodBg(OLE.wood3, 8), boxShadow: "0 26px 40px rgba(0,0,0,0.6), inset 0 0 0 4px rgba(0,0,0,0.45)", rotate: "2deg", scale: String(0.85 + 0.15 * titleP), opacity: titleP }}>
        {kicker ? <div style={{ fontFamily: SLAB, fontSize: 40, letterSpacing: 10, color: "rgba(30,15,5,0.75)" }}>{kicker}</div> : null}
        <div style={{ fontFamily: SLAB, fontSize: title.length > 9 ? 110 : 170, lineHeight: 1.0, color: "#2a1508", textShadow: "0 2px 0 rgba(255,210,150,0.35), 0 -1px 0 rgba(0,0,0,0.5)" }}>{title}</div>
        {sub ? <div style={{ marginTop: 14, fontFamily: HAND, fontWeight: 700, fontSize: 56, lineHeight: 1.1, color: OLE.cream, textShadow: "0 3px 0 rgba(0,0,0,0.6)", clipPath: subP >= 99.9 ? "none" : `inset(0 ${100 - subP}% 0 0)` }}>{sub}</div> : null}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};
