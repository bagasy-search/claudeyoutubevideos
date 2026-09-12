import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  InkDraw,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// MapPinKit — MAPA / PLANO DE PERGAMINO con pin(es) latiendo en ubicaciones.
// Genérico: "dónde plantar" (huerta), "dónde está la fuga" (reparación) o "el
// recorrido de la granja" (amish). Pergamino envejecido con relieve de papel,
// líneas de mapa antiguas (paralelos + costa/senda dibujadas a tinta), rosa de
// los vientos, y pines que caen con rebote (spring) y laten con ondas (ripple
// SvgFilters). Con route=true traza una senda de tinta punteada uniendo los
// pines. Profundidad: parallax multicapa + god rays + polvo + filtros SVG.
// Pines en coordenadas 0..100 (x,y) sobre el mapa. Deja libre esquina inf-der.
// ═══════════════════════════════════════════════════════════════════════════

type Pin = { x: number; y: number; label?: string };

const DEFAULT_PINS: Pin[] = [{ x: 42, y: 46, label: "Aquí" }];

export const MapPinKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  pins?: Pin[];
  route?: boolean;
}> = ({
  durationInFrames,
  title = "El lugar exacto",
  subtitle = "Marcado en el plano",
  accent = COLORS.danger,
  pins = DEFAULT_PINS,
  route = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });

  // Marco del mapa dentro del viewBox 1600x900 (deja aire para el encabezado).
  const VB = 1600;
  const VBH = 900;
  const M = { x: 150, y: 170, w: 1300, h: 640 };
  const toPx = (p: Pin) => ({ x: M.x + (p.x / 100) * M.w, y: M.y + (p.y / 100) * M.h });
  const n = Math.max(1, Math.min(pins.length, 8));
  const list = pins.slice(0, n);

  const mapReveal = spring({ frame: frame - sec(0.3), fps, config: { damping: 20, mass: 0.9, stiffness: 90 } });
  const pinAt = (i: number) => sec(1.1) + i * sec(0.6);
  const routeAt = sec(1.0);

  // Senda de tinta uniendo pines (para route). Comba orgánica leve entre puntos.
  const routeD = (() => {
    if (list.length < 2) return "";
    const pts = list.map(toPx);
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const mx = (a.x + b.x) / 2 + Math.sin(i * 1.3) * 40;
      const my = (a.y + b.y) / 2 - 34;
      d += ` Q ${mx} ${my} ${b.x} ${b.y}`;
    }
    return d;
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="map" />
      <TechBackground glowX={50} glowY={34} hue="amber" drift={0.3} />

      <ParallaxLayer depth={0.22} driftX={14} driftY={9}>
        <GodRays x={64} y={-12} angle={22} color="rgba(169,121,74,0.16)" rays={7} intensity={0.9} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.5} driftX={24} driftY={16}>
        <ParticleField count={20} kind="dust" rise drift={22} color={COLORS.amber} opacity={0.42} />
      </ParallaxLayer>

      <SfxCue at={0} src={SFX.whoosh} volume={0.35} />
      {route && list.length > 1 && <SfxCue at={routeAt} src={SFX.lineDraw} volume={0.26} />}
      {list.map((_, i) => (
        <SfxCue key={"sfx" + i} at={pinAt(i)} src={SFX.nodeLand} volume={0.3} />
      ))}

      {/* Encabezado */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px)`,
          zIndex: 3,
        }}
      >
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: accent }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, color: COLORS.text, lineHeight: 1.02, marginTop: 2 }}>
          {title}
        </div>
      </div>

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox={`0 0 ${VB} ${VBH}`} width="94%" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <linearGradient id="mapPaper" x1="0" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#F0E7CF" />
              <stop offset="55%" stopColor="#E6DAB9" />
              <stop offset="100%" stopColor="#D6C49B" />
            </linearGradient>
            <radialGradient id="mapVignette" cx="50%" cy="46%">
              <stop offset="55%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(80,55,20,0.28)" />
            </radialGradient>
            <clipPath id="mapClip">
              <rect x={M.x} y={M.y} width={M.w} height={M.h} rx={16} />
            </clipPath>
          </defs>

          {/* LÁMINA del mapa (aparece con leve escala/asiento) */}
          <g
            transform={`translate(${VB / 2} ${M.y + M.h / 2}) scale(${interpolate(mapReveal, [0, 1], [0.94, 1])}) translate(${-VB / 2} ${-(M.y + M.h / 2)})`}
            opacity={mapReveal}
          >
            {/* sombra del papel */}
            <rect x={M.x} y={M.y + 14} width={M.w} height={M.h} rx={16} fill="rgba(42,38,32,0.26)" />
            <rect x={M.x} y={M.y} width={M.w} height={M.h} rx={16} fill="url(#mapPaper)" stroke="#7A6440" strokeWidth={4} />

            {/* contenido del mapa (recortado al marco), levemente ondulado (ripple) */}
            <g clipPath="url(#mapClip)" style={{ filter: "url(#map-ripple)" }}>
              {/* paralelos / meridianos de mapa antiguo */}
              {Array.from({ length: 8 }, (_, k) => (
                <line key={"h" + k} x1={M.x} y1={M.y + (k + 1) * (M.h / 9)} x2={M.x + M.w} y2={M.y + (k + 1) * (M.h / 9)} stroke="rgba(122,100,64,0.28)" strokeWidth={1.5} />
              ))}
              {Array.from({ length: 12 }, (_, k) => (
                <line key={"v" + k} x1={M.x + (k + 1) * (M.w / 13)} y1={M.y} x2={M.x + (k + 1) * (M.w / 13)} y2={M.y + M.h} stroke="rgba(122,100,64,0.22)" strokeWidth={1.5} />
              ))}

              {/* costa / senda de tinta dibujada (decorativa, determinística) */}
              <path
                d={`M ${M.x - 20} ${M.y + M.h * 0.62}
                    C ${M.x + M.w * 0.2} ${M.y + M.h * 0.5}, ${M.x + M.w * 0.32} ${M.y + M.h * 0.78}, ${M.x + M.w * 0.5} ${M.y + M.h * 0.66}
                    C ${M.x + M.w * 0.68} ${M.y + M.h * 0.54}, ${M.x + M.w * 0.82} ${M.y + M.h * 0.82}, ${M.x + M.w + 20} ${M.y + M.h * 0.7}`}
                fill="none"
                stroke="rgba(111,132,120,0.55)"
                strokeWidth={4}
                style={{ filter: "url(#map-rough)" }}
              />
              {/* relieve de terreno: puntitos de bosque/arbustos deterministas */}
              {Array.from({ length: 46 }, (_, k) => {
                const px = M.x + rand(k, 1) * M.w;
                const py = M.y + rand(k, 2) * M.h;
                const rr = 3 + rand(k, 3) * 5;
                return <circle key={"t" + k} cx={px} cy={py} r={rr} fill="rgba(124,138,90,0.30)" />;
              })}
              {/* mancha sepia de humedad (envejecido) */}
              <ellipse cx={M.x + M.w * 0.22} cy={M.y + M.h * 0.28} rx={130} ry={90} fill="rgba(140,100,50,0.12)" />
              <ellipse cx={M.x + M.w * 0.8} cy={M.y + M.h * 0.75} rx={160} ry={100} fill="rgba(140,100,50,0.1)" />
            </g>

            {/* borde interior de tinta que se dibuja */}
            <g clipPath="url(#mapClip)">
              <InkDraw
                d={`M ${M.x + 16} ${M.y + 16} H ${M.x + M.w - 16} V ${M.y + M.h - 16} H ${M.x + 16} Z`}
                at={sec(0.5)}
                duration={40}
                color="rgba(42,38,32,0.4)"
                width={3}
                length={2 * (M.w + M.h)}
              />
            </g>
            {/* viñeta */}
            <rect x={M.x} y={M.y} width={M.w} height={M.h} rx={16} fill="url(#mapVignette)" pointerEvents="none" />

            {/* ROSA DE LOS VIENTOS (esquina sup-izq, gira lento idle) */}
            <g transform={`translate(${M.x + 96} ${M.y + 96})`} opacity={interpolate(mapReveal, [0.4, 1], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <circle r={54} fill="none" stroke="rgba(42,38,32,0.3)" strokeWidth={2} />
              <g transform={`rotate(${(frame / fps) * 4})`}>
                {[0, 90, 180, 270].map((deg) => (
                  <path key={deg} d="M 0 -50 L 11 0 L 0 12 L -11 0 Z" fill={accent} opacity={0.85} transform={`rotate(${deg})`} />
                ))}
                {[45, 135, 225, 315].map((deg) => (
                  <path key={deg} d="M 0 -34 L 7 0 L 0 8 L -7 0 Z" fill="rgba(42,38,32,0.45)" transform={`rotate(${deg})`} />
                ))}
              </g>
              <text x={0} y={-62} textAnchor="middle" fontSize={22} fontWeight={900} fill={COLORS.text} fontFamily={FONT_STACK}>N</text>
            </g>
          </g>

          {/* RUTA de tinta uniendo pines */}
          {route && routeD && (
            <g clipPath="url(#mapClip)">
              <InkDraw d={routeD} at={routeAt} duration={sec(1.4)} color={accent} width={5} length={2600} dropShadow />
              {/* guiones sobre la ruta ya trazada (senda punteada de mapa) */}
              <path
                d={routeD}
                fill="none"
                stroke={COLORS.bg0}
                strokeWidth={5}
                strokeDasharray="2 16"
                opacity={interpolate(frame - routeAt, [sec(1.4), sec(1.7)], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              />
            </g>
          )}

          {/* PINES */}
          {list.map((p, i) => {
            const { x, y } = toPx(p);
            const at = pinAt(i);
            const s = spring({ frame: frame - at, fps, config: { damping: 11, mass: 0.7, stiffness: 150 } });
            const drop = interpolate(s, [0, 1], [-70, 0]);
            const bob = wobble(i, frame, 0.8) * 2.5;
            // ondas de pulso (ripple) — 2 anillos desfasados en loop
            const rings = [0, 1].map((k) => {
              const t = ((frame - at + k * 30) % 60) / 60;
              return { r: interpolate(t, [0, 1], [10, 64]), op: interpolate(t, [0, 1], [0.5, 0]) * (s > 0.6 ? 1 : 0) };
            });
            const pinH = 78;
            return (
              <g key={"pin" + i}>
                {/* ondas en la base */}
                {rings.map((rg, k) => (
                  <ellipse key={k} cx={x} cy={y} rx={rg.r} ry={rg.r * 0.42} fill="none" stroke={accent} strokeWidth={3} opacity={rg.op} />
                ))}
                {/* sombra del pin en el suelo */}
                <ellipse cx={x} cy={y} rx={interpolate(s, [0, 1], [4, 20])} ry={interpolate(s, [0, 1], [2, 8])} fill="rgba(42,38,32,0.32)" opacity={s} />
                {/* cuerpo del pin (cae con rebote) */}
                <g transform={`translate(${x} ${y + drop + bob})`} opacity={interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" })}>
                  <g style={{ filter: "drop-shadow(0 6px 8px rgba(42,38,32,0.4))" }}>
                    <path
                      d={`M 0 0 C -20 ${-pinH * 0.5} -22 ${-pinH * 0.8} -22 ${-pinH} A 22 22 0 1 1 22 ${-pinH} C 22 ${-pinH * 0.8} 20 ${-pinH * 0.5} 0 0 Z`}
                      fill={accent}
                      stroke="rgba(42,38,32,0.4)"
                      strokeWidth={2}
                    />
                    <circle cx={0} cy={-pinH} r={11} fill="#F0E7CF" />
                    <circle cx={0} cy={-pinH} r={11} fill="none" stroke="rgba(42,38,32,0.35)" strokeWidth={2} />
                  </g>
                  {/* etiqueta del pin en cartelito de pergamino */}
                  {p.label && (
                    <g
                      transform={`translate(0 ${-pinH - 54})`}
                      opacity={interpolate(s, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                    >
                      {(() => {
                        const w = 40 + p.label.length * 20;
                        return (
                          <g transform={`translate(${-w / 2} 0)`}>
                            <rect x={0} y={0} width={w} height={52} rx={12} fill="#F6EFDC" stroke="rgba(42,38,32,0.3)" strokeWidth={2} style={{ filter: "drop-shadow(0 6px 10px rgba(42,38,32,0.28))" }} />
                            <path d={`M ${w / 2 - 10} 52 L ${w / 2} 66 L ${w / 2 + 10} 52 Z`} fill="#F6EFDC" stroke="rgba(42,38,32,0.3)" strokeWidth={2} />
                            <text x={w / 2} y={34} textAnchor="middle" fontSize={30} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK}>
                              {p.label}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      <PaperGrain opacity={0.12} scale={0.9} seed={9} />
    </AbsoluteFill>
  );
};

export default MapPinKit;
