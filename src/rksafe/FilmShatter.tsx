// FilmShatter.tsx — VIDRIO COMÚN vs VIDRIO CON FILM (canal Ray Kessler · rkwindow).
//
// Dos hojas lado a lado reciben el mismo golpe:
//   · izquierda (común): se raja UNA vez, los pedazos CAEN con gravedad y queda el agujero; el
//     cronómetro se detiene en "2 s".
//   · derecha (con film): la tela de araña se DIBUJA trazo a trazo desde el punto de impacto
//     (radiales + anillos, generados con rnd() determinista), la hoja se abolla un poco y NO se cae;
//     2º y 3º golpe suman grietas; el cronómetro sigue corriendo: "still holding".
// Tiempos relativos a la duración. Encuadre defensivo: explica por qué el film compra tiempo.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, rnd, PhotoBed, Kick, Head, Keyring } from "./RayStage";

type Seg = { x1: number; y1: number; x2: number; y2: number; t: number };

// grietas de una tela de araña alrededor de (cx, cy) — deterministas
const web = (cx: number, cy: number, seed: number, rays: number, rMax: number): Seg[] => {
  const segs: Seg[] = [];
  const angs: number[] = [];
  for (let i = 0; i < rays; i++) angs.push((i / rays) * Math.PI * 2 + (rnd(seed + i) - 0.5) * 0.5);
  for (let i = 0; i < rays; i++) {
    let px = cx, py = cy;
    const n = 5;
    for (let k = 1; k <= n; k++) {
      const r = (rMax * k) / n * (0.8 + rnd(seed * 7 + i * 13 + k) * 0.4);
      const a = angs[i] + (rnd(seed * 3 + i * 5 + k) - 0.5) * 0.18;
      const nx = cx + Math.cos(a) * r, ny = cy + Math.sin(a) * r;
      segs.push({ x1: px, y1: py, x2: nx, y2: ny, t: k / n * 0.6 });
      px = nx; py = ny;
    }
  }
  for (let ring = 1; ring <= 3; ring++) {
    const rr = rMax * (0.18 + ring * 0.2);
    for (let i = 0; i < rays; i++) {
      if (rnd(seed * 11 + ring * 17 + i) < 0.25) continue;
      const a1 = angs[i], a2 = angs[(i + 1) % rays] + (i + 1 === rays ? Math.PI * 2 : 0);
      const j1 = rr * (0.9 + rnd(seed + ring + i) * 0.2), j2 = rr * (0.9 + rnd(seed + ring * 2 + i) * 0.2);
      segs.push({ x1: cx + Math.cos(a1) * j1, y1: cy + Math.sin(a1) * j1, x2: cx + Math.cos(a2) * j2, y2: cy + Math.sin(a2) * j2, t: 0.45 + ring * 0.15 });
    }
  }
  return segs;
};

const Pane: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; label: string; color: string }> = ({ x, y, w, h, children, label, color }) => (
  <g>
    <rect x={x - 18} y={y - 18} width={w + 36} height={h + 36} fill="none" stroke={rgba(V.bone, 0.85)} strokeWidth={14} rx={4} />
    {children}
    <text x={x + w / 2} y={y + h + 80} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={46} fill={color} letterSpacing={2}
      style={{ textTransform: "uppercase" }}>{label}</text>
  </g>
);

export const FilmShatter: React.FC<{
  title?: string;
  leftLabel?: string;
  rightLabel?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "Same hit. Different ending.",
  leftLabel = "Plain glass",
  rightLabel = "With film",
  caption = "Film doesn't stop him. It buys time.",
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: dv } = useVideoConfig();
  const D = Math.max(90, durationInFrames ?? dv);
  const L = { x: 270, y: 300, w: 520, h: 510 };
  const R = { x: 1130, y: 300, w: 520, h: 510 };
  const hits = [D * 0.18, D * 0.42, D * 0.6];
  const titleA = enter(frame, 10);
  const capA = enter(frame - D * 0.74, 12);

  // IZQUIERDA: un golpe, caen los pedazos
  const lc = { x: L.x + L.w * 0.46, y: L.y + L.h * 0.44 };
  const shards = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + rnd(90 + i) * 0.3;
    const r0 = 30 + rnd(40 + i) * 140;
    const t = Math.max(0, (frame - hits[0] - 4) / fps);
    return { a, cx: lc.x + Math.cos(a) * r0, cy: lc.y + Math.sin(a) * r0, dy: 0.5 * 2200 * t * t, rot: (rnd(7 + i) - 0.5) * 400 * t, s: 30 + rnd(3 + i) * 50 };
  });
  const holeA = frame > hits[0] ? 1 : 0;
  const leftWeb = web(lc.x, lc.y, 11, 11, 260);

  // DERECHA: tela de araña que crece con cada golpe y la hoja se abolla
  const rc = [{ x: R.x + R.w * 0.46, y: R.y + R.h * 0.44 }, { x: R.x + R.w * 0.55, y: R.y + R.h * 0.5 }, { x: R.x + R.w * 0.4, y: R.y + R.h * 0.56 }];
  const webs = rc.map((c, i) => web(c.x, c.y, 31 + i * 9, 12, 300 - i * 40));
  const bulge = Math.min(1, hits.filter((t) => frame > t).length / 3);
  const shakeR = hits.some((t) => frame > t && frame < t + 8) ? Math.sin(frame * 3) * 5 : 0;

  // cronómetro
  const tSec = Math.max(0, (frame - hits[0]) / fps);
  const leftStop = Math.min(tSec, 2);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.76} />
      <AbsoluteFill style={{ background: `radial-gradient(100% 90% at 50% 50%, ${rgba(V.ink0, 0.25)} 0%, ${rgba(V.ink0, 0.85)} 100%)` }} />
      <div style={{ position: "absolute", left: "5.5%", top: "5%", opacity: titleA }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <Keyring size={30} /><Kick>SECURITY FILM</Kick>
        </div>
        <div style={{ display: "inline-block", padding: "8px 22px 12px", background: rgba(V.ink0, 0.6), borderLeft: `6px solid ${V.brass}`, borderRadius: 4 }}>
          <Head size={56}>{title}</Head>
        </div>
      </div>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="fs_glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={rgba("#BFE3F0", 0.26)} />
            <stop offset="100%" stopColor={rgba("#BFE3F0", 0.08)} />
          </linearGradient>
          <mask id="fs_hole">
            <rect x={0} y={0} width={1920} height={1080} fill="white" />
            <path d={shards.map((s, i) => `${i ? "L" : "M"} ${lc.x + Math.cos(s.a) * (150 + (i % 2) * 40)} ${lc.y + Math.sin(s.a) * (150 + (i % 2) * 40)}`).join(" ") + " Z"} fill="black" opacity={holeA} />
          </mask>
        </defs>
        {/* IZQUIERDA */}
        <Pane x={L.x} y={L.y} w={L.w} h={L.h} label={leftLabel} color={V.dangerSoft}>
          <rect x={L.x} y={L.y} width={L.w} height={L.h} fill="url(#fs_glass)" mask="url(#fs_hole)" />
          {frame > hits[0] ? leftWeb.map((s, i) => (
            <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={rgba(V.white, 0.55)} strokeWidth={1.6} mask="url(#fs_hole)" />
          )) : null}
          {frame > hits[0] ? shards.map((s, i) => (
            <polygon key={i} points={`0,${-s.s / 2} ${s.s / 2},${s.s / 3} ${-s.s / 3},${s.s / 2}`} fill={rgba("#BFE3F0", 0.35)} stroke={rgba(V.white, 0.6)} strokeWidth={1.2}
              transform={`translate(${s.cx.toFixed(1)},${(s.cy + s.dy).toFixed(1)}) rotate(${s.rot.toFixed(1)})`} opacity={s.cy + s.dy < 1060 ? 1 : 0} />
          )) : null}
        </Pane>
        {/* DERECHA */}
        <g transform={`translate(${shakeR.toFixed(2)},0)`}>
          <Pane x={R.x} y={R.y} w={R.w} h={R.h} label={rightLabel} color={V.brassSoft}>
            <rect x={R.x} y={R.y} width={R.w} height={R.h} fill="url(#fs_glass)" />
            <rect x={R.x} y={R.y} width={R.w} height={R.h} fill={rgba("#DDEFF6", 0.08 * bulge)} />
            {webs.map((wb, wi) => {
              const p = interpolate(frame, [hits[wi], hits[wi] + D * 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
              if (p <= 0) return null;
              return wb.map((s, i) => {
                const q = Math.max(0, Math.min(1, (p - s.t * 0.6) / 0.4));
                if (q <= 0) return null;
                return <line key={`${wi}_${i}`} x1={s.x1} y1={s.y1} x2={s.x1 + (s.x2 - s.x1) * q} y2={s.y1 + (s.y2 - s.y1) * q}
                  stroke={rgba(V.white, 0.75)} strokeWidth={1.8} />;
              });
            })}
            {hits.map((t, i) => frame > t && frame < t + 14 ? (
              <circle key={i} cx={rc[i].x} cy={rc[i].y} r={10 + (frame - t) * 6} fill="none" stroke={rgba(V.danger, 1 - (frame - t) / 14)} strokeWidth={5} />
            ) : null)}
          </Pane>
        </g>
        {/* cronómetros */}
        <g fontFamily={F_DISPLAY} fontWeight={700}>
          <text x={L.x + L.w / 2} y={L.y - 40} textAnchor="middle" fontSize={54} fill={V.dangerSoft} opacity={enter(frame - hits[0], 6)}>
            {tSec >= 2 ? "DONE · 2 s" : `${leftStop.toFixed(1)} s`}
          </text>
          <text x={R.x + R.w / 2} y={R.y - 40} textAnchor="middle" fontSize={54} fill={V.brassSoft} opacity={enter(frame - hits[0], 6)}>
            {tSec >= 2.5 ? `STILL HOLDING · ${tSec.toFixed(0)} s` : `${tSec.toFixed(1)} s`}
          </text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "3%", display: "flex", justifyContent: "center", opacity: capA }}>
        <div style={{ padding: "10px 30px", background: rgba(V.ink0, 0.82), border: `2px solid ${V.brass}`, borderRadius: 6, fontFamily: F_BODY, fontWeight: 700, fontSize: 36, color: V.brassSoft }}>
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
