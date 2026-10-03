// OpLens — lupa de mano que se desliza sobre la foto (la señal clara) y, dentro del vidrio, muestra ESA zona
// agrandada ×2,4; al llegar, entra el rótulo a lápiz con lo que es. Props: bed (foto), from/to {x,y} (px 1920x1080
// del centro de la lupa), zoom, label, sub, ok (verde) o alarma (rojo).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { OP, LABEL } from "./OpTheme";
import { FeedTag, OpBed, Written, ease } from "./OpParts";

export const OpLens: React.FC<{ bed?: string; from?: { x: number; y: number }; to: { x: number; y: number }; zoom?: number; label: string; sub?: string; ok?: boolean; seed?: number }> = ({ bed, from = { x: 300, y: 300 }, to, zoom = 2.4, label, sub, ok = false, seed = 15 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [6, 34], [0, 1], { ...ease, easing: Easing.inOut(Easing.cubic) });
  const x = from.x + (to.x - from.x) * k, y = from.y + (to.y - from.y) * k;
  const R = 230;
  const col = ok ? OP.green : OP.red;
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.25} />
      {bed && !/\.mp4$/.test(bed) ? (
        <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: R, overflow: "hidden", boxShadow: "0 0 0 16px #3b2a1a, 0 0 0 22px #6b4a2b, 0 30px 50px rgba(0,0,0,0.5)" }}>
          <Img src={staticFile(bed)} style={{ position: "absolute", width: 1920 * zoom, height: 1080 * zoom, left: -(x * zoom - R), top: -(y * zoom - R), objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: R, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), transparent 40%)" }} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: x + R * 0.62, top: y + R * 0.62, width: 40, height: 230, background: "#3b2a1a", borderRadius: 16, transform: "rotate(-45deg)", transformOrigin: "top center" }} />
      <div style={{ position: "absolute", left: 80, bottom: 80, opacity: interpolate(f, [36, 44], [0, 1], ease), transform: "rotate(-1.5deg)" }}>
        <FeedTag w={760} h={sub ? 230 : 170}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: col, textTransform: "uppercase" }}>under the lens</div>
          <Written text={label} at={40} size={62} color={col} />
          {sub ? <Written text={sub} at={52} size={44} color={OP.pencilSoft} /> : null}
        </FeedTag>
      </div>
    </AbsoluteFill>
  );
};

// OpRetreat — almanaque de pared que pasa hojas en 3D (CSS): "Day 1 · treat" → días → "Day 7–10 · treat again",
// con la razón a lápiz. Props: days [{d, note, mark?}], every (cuadros por hoja), why.
export const OpRetreat: React.FC<{ days: { d: string; note?: string; mark?: boolean }[]; every?: number; why?: string; title?: string }> = ({ days, every = 26, why = "the eggs hatch after you treat", title = "the second treatment" }) => {
  const f = useCurrentFrame();
  const idx = Math.min(days.length - 1, Math.floor(Math.max(0, f - 10) / every));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#e9dcc0, #d7c49e)" }}>
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 9, color: OP.red, textTransform: "uppercase" }}>{title}</div>
      <div style={{ position: "absolute", left: "50%", top: 170, width: 760, height: 640, marginLeft: -380, perspective: 2200 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: OP.red, borderRadius: "10px 10px 0 0", zIndex: 50 }} />
        {days.map((d, i) => {
          const t0 = 10 + (i + 1) * every; const flip = interpolate(f, [t0 - 10, t0], [0, -175], ease);
          if (i < idx - 1) return null;
          return (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 70, height: 570, transformOrigin: "top center", transform: `rotateX(${i < days.length - 1 ? flip : 0}deg)`, backfaceVisibility: "hidden", zIndex: 40 - i, background: "#FFFDF7", boxShadow: "0 18px 30px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 200, color: d.mark ? OP.red : OP.pencil, lineHeight: 1 }}>{d.d}</div>
              {d.note ? <Written text={d.note} at={t0 - every + 6} size={70} color={d.mark ? OP.red : OP.pencilSoft} /> : null}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", opacity: interpolate(f, [10 + days.length * every - 20, 10 + days.length * every], [0, 1], ease) }}>
        <Written text={why} at={10 + days.length * every - 20} size={64} color={OP.pencil} />
      </div>
    </AbsoluteFill>
  );
};
