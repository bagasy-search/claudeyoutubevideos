// CostLadder.tsx — ESCALERA DE COSTO animada: los arreglos se APILAN de más barato a más caro
// (canal Ray Kessler · rkwindow). Cada escalón sube con resorte, su precio cuenta hacia arriba, y
// una línea de latón traza el perfil de la escalera. Al final aparece el total/cierre.
// `steps[].cost` es NÚMERO (altura del escalón en dólares), `price` es el texto que se lee.
// Escalonado relativo a la duración (nunca cuadros fijos); `highlight` pinta un escalón en ámbar.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, PhotoBed, Kick, Head, Keyring } from "./RayStage";

export const CostLadder: React.FC<{
  title?: string;
  steps?: { label: string; price: string; cost: number }[];
  caption?: string;
  highlight?: number;
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "Seven fixes, cheapest first",
  steps = [
    { label: "Stick", price: "$0–2", cost: 2 },
    { label: "Pin", price: "$3", cost: 3 },
    { label: "Lock", price: "$15", cost: 15 },
    { label: "Sensor", price: "$15", cost: 15 },
    { label: "Thorns", price: "$40", cost: 40 },
    { label: "Film", price: "$60", cost: 60 },
    { label: "Light", price: "$60", cost: 60 },
  ],
  caption = "",
  highlight = -1,
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: dv } = useVideoConfig();
  const D = Math.max(60, durationInFrames ?? dv);
  const n = steps.length;
  const maxC = Math.max(...steps.map((s) => s.cost), 1);
  const x0 = 240, x1 = 1680, base = 850, top = 330;
  const colW = (x1 - x0) / n;
  const hOf = (c: number) => 60 + (base - top - 60) * Math.sqrt(c / maxC);
  const span = D * 0.62;                                  // los escalones entran en el 62 % del plano
  const tIn = (i: number) => D * 0.1 + (span * i) / Math.max(1, n);
  const titleA = enter(frame, 10);
  const capA = caption ? enter(frame - D * 0.78, 12) : 0;
  const cam = interpolate(frame, [0, D], [1.0, 1.045], { easing: Easing.inOut(Easing.quad) });

  // perfil de la escalera trazado por la línea de latón
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const k = spring({ frame: frame - tIn(i), fps, config: { damping: 14, stiffness: 120 } });
    const h = hOf(steps[i].cost) * k;
    pts.push(`${x0 + i * colW},${base - h}`, `${x0 + (i + 1) * colW},${base - h}`);
  }
  const lineA = enter(frame - D * 0.1, 16);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.74} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(V.ink0, 0.55)} 0%, ${rgba(V.ink0, 0.35)} 40%, ${rgba(V.ink0, 0.85)} 100%)` }} />
      <div style={{ position: "absolute", left: "5.5%", top: "7%", opacity: titleA, transform: `translateY(${((1 - titleA) * 16).toFixed(1)}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <Keyring size={32} /><Kick>WHAT IT COSTS</Kick>
        </div>
        <div style={{ display: "inline-block", padding: "10px 24px 14px", background: rgba(V.ink0, 0.6), borderLeft: `6px solid ${V.brass}`, borderRadius: 4 }}>
          <Head size={64}>{title}</Head>
        </div>
      </div>
      <AbsoluteFill style={{ transform: `scale(${cam.toFixed(4)})`, transformOrigin: "50% 80%" }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="cl_step" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={rgba(V.brass, 0.55)} />
              <stop offset="100%" stopColor={rgba(V.brass, 0.12)} />
            </linearGradient>
            <linearGradient id="cl_hi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={rgba(V.brassSoft, 0.95)} />
              <stop offset="100%" stopColor={rgba(V.brass, 0.3)} />
            </linearGradient>
          </defs>
          <line x1={x0 - 30} y1={base} x2={x1 + 30} y2={base} stroke={rgba(V.bone, 0.5)} strokeWidth={3} />
          {steps.map((s, i) => {
            const k = spring({ frame: frame - tIn(i), fps, config: { damping: 14, stiffness: 120 } });
            const h = hOf(s.cost) * k;
            const a = enter(frame - tIn(i), 6);
            const hi = i === highlight;
            const cnt = Math.round(s.cost * Math.min(1, Math.max(0, (frame - tIn(i)) / (fps * 0.6))));
            return (
              <g key={i} opacity={a}>
                <rect x={x0 + i * colW + 8} y={base - h} width={colW - 16} height={h} fill={hi ? "url(#cl_hi)" : "url(#cl_step)"} stroke={hi ? V.brassSoft : rgba(V.brass, 0.8)} strokeWidth={hi ? 4 : 2} rx={4} />
                <text x={x0 + (i + 0.5) * colW} y={base - h - 22} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={50} fill={hi ? V.brassSoft : V.white}>
                  {k > 0.98 ? s.price : `$${cnt}`}
                </text>
                <text x={x0 + (i + 0.5) * colW} y={base + 50} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={34} fill={V.bone} letterSpacing={1.5}
                  style={{ textTransform: "uppercase" }}>{s.label}</text>
                <text x={x0 + (i + 0.5) * colW} y={base + 88} textAnchor="middle" fontFamily={F_BODY} fontWeight={600} fontSize={22} fill={rgba(V.brass, 0.9)}>{`#${i + 1}`}</text>
              </g>
            );
          })}
          <polyline points={pts.join(" ")} fill="none" stroke={V.brassSoft} strokeWidth={4} opacity={lineA * 0.9} strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>
      {caption ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "3.5%", display: "flex", justifyContent: "center", opacity: capA }}>
          <div style={{ padding: "10px 30px", background: rgba(V.ink0, 0.82), border: `2px solid ${V.brass}`, borderRadius: 6, fontFamily: F_BODY, fontWeight: 700, fontSize: 36, color: V.brassSoft }}>
            {caption}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
