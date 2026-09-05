// RouteFlow.tsx — EL RECORRIDO del ladrón: un mapa de flujo animado.
// La línea se dibuja izquierda→derecha por 5 nodos; cada nodo se enciende en secuencia
// con su rótulo; el último (la caja/placard = el objetivo) late en ROJO.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, rgba, enter, clamp01, PhotoBed, Kick, Head, Keyring } from "./RayStage";

export const RouteFlow: React.FC<{
  steps?: { label: string }[];
  title?: string;
  kicker?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "THE ROUTE",
  title = "Straight to one room",
  steps = [
    { label: "Front door" },
    { label: "Master bedroom" },
    { label: "Closet shelf" },
    { label: "Under the mattress" },
    { label: "The drawers" },
  ],
  bed,
}) => {
  const frame = useCurrentFrame();

  // Canvas 1920x1080. La ruta va en un stepped path por 5 nodos.
  const W = 1920;
  const H = 1080;
  const n = Math.max(2, steps.length);
  const marginX = 210;
  const spanX = W - marginX * 2;
  const baseY = 690;

  // nodos con un leve zig-zag vertical (parallax / sensación de plano)
  const nodes = steps.map((s, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    const x = marginX + spanX * t;
    const y = baseY + (i % 2 === 0 ? -46 : 40) + Math.sin(i * 1.7) * 10;
    return { ...s, x, y, i };
  });

  // path que conecta los nodos
  const pathD = nodes
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // longitud aproximada para el strokeDashoffset (se dibuja con el frame)
  let pathLen = 0;
  for (let i = 1; i < nodes.length; i++) {
    pathLen += Math.hypot(nodes[i].x - nodes[i - 1].x, nodes[i].y - nodes[i - 1].y);
  }

  const drawStart = 16;
  const drawDur = 58;
  const drawT = clamp01(interpolate(frame, [drawStart, drawStart + drawDur], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const dashOffset = pathLen * (1 - drawT);

  // cada nodo aparece escalonado ~10 frames (arranca cuando la línea llega)
  const nodeStart = (i: number) => drawStart + 8 + i * 11;

  const titleA = enter(frame, 10);
  const drift = Math.sin(frame / 150) * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.66} />

      {/* viñeta para hundir los bordes y dar profundidad */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 40%, ${rgba(V.ink0, 0)} 44%, ${rgba(V.ink0, 0.72)} 100%)`,
        }}
      />

      {/* Titular arriba-izquierda sobre placa oscura */}
      <div
        style={{
          position: "absolute",
          left: "5.5%",
          top: "9%",
          opacity: titleA,
          transform: `translateY(${((1 - titleA) * 16).toFixed(1)}px)`,
          maxWidth: "70%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <Keyring size={34} />
          <Kick>{kicker}</Kick>
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "12px 26px 16px",
            background: rgba(V.ink0, 0.6),
            borderLeft: `6px solid ${V.brass}`,
            borderRadius: 4,
            backdropFilter: "blur(2px)",
          }}
        >
          <Head size={78}>{title}</Head>
        </div>
      </div>

      {/* El mapa de flujo */}
      <AbsoluteFill style={{ transform: `translateX(${drift.toFixed(2)}px)` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <defs>
            <filter id="rf_glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* traza fantasma (guía tenue del recorrido completo) */}
          <path
            d={pathD}
            fill="none"
            stroke={rgba(V.brass, 0.16)}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 14"
          />

          {/* la línea que se DIBUJA con el frame */}
          <path
            d={pathD}
            fill="none"
            stroke={V.brass}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
            filter="url(#rf_glow)"
          />

          {/* nodos */}
          {nodes.map((p) => {
            const isLast = p.i === nodes.length - 1;
            const a = enter(frame - nodeStart(p.i), 9);
            const pop = interpolate(a, [0, 1], [0.4, 1]);
            const pulse = isLast ? 1 + Math.sin(frame / 8) * 0.06 : 1;
            const color = V.brass;
            const r = (isLast ? 22 : 17) * pop * pulse;
            return (
              <g key={p.i} opacity={a}>
                {/* anillo exterior (rojo latente en el último) */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r + 12}
                  fill="none"
                  stroke={rgba(color, isLast ? 0.5 : 0.28)}
                  strokeWidth={isLast ? 4 : 2.5}
                  style={isLast ? { transformOrigin: `${p.x}px ${p.y}px`, transform: `scale(${pulse.toFixed(3)})` } : undefined}
                />
                <circle cx={p.x} cy={p.y} r={r} fill={V.ink1} stroke={color} strokeWidth={4} />
                <circle cx={p.x} cy={p.y} r={r * 0.42} fill={color} />
              </g>
            );
          })}
        </svg>

        {/* rótulos de los nodos (placas oscuras con punto brass) */}
        {nodes.map((p) => {
          const isLast = p.i === nodes.length - 1;
          const a = enter(frame - nodeStart(p.i) - 4, 10);
          const above = p.i % 2 === 0;
          const color = V.brass;
          // px% respecto de 1920/1080
          const leftPct = (p.x / W) * 100;
          const topPct = ((p.y + (above ? -118 : 84)) / H) * 100;
          return (
            <div
              key={p.i}
              style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: `translate(-50%, ${((1 - a) * (above ? -10 : 10)).toFixed(1)}px)`,
                opacity: a,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 18px 11px",
                  background: rgba(V.ink0, 0.82),
                  border: `1.5px solid ${rgba(color, 0.55)}`,
                  borderRadius: 6,
                  boxShadow: `0 6px 22px ${rgba(V.ink0, 0.7)}`,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 12px ${rgba(color, 0.7)}`,
                    flex: "0 0 auto",
                  }}
                />
                <span
                  style={{
                    fontFamily: F_DISPLAY,
                    fontSize: 34,
                    letterSpacing: "0.01em",
                    color: V.white,
                  }}
                >
                  {p.label}
                </span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
