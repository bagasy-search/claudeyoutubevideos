// Shots.tsx — capa de planos de oldtech01v2: cada plano con su cámara y transiciones que pasan A TRAVÉS de la imagen.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { FPS, W, H, k01, lerp, ease } from "./lib";

// dissolve = fundido (arcilla→arcilla) · white = se lava a blanco (avalancha→mapa) · sweep = barrido de luz que revela el siguiente
// shrink = el plano se encoge dentro de un anillo (fx,fy en pantalla) del plano siguiente, como un portal al revés
export type Out = { type: "cut" | "zoom" | "whip" | "flash" | "pull" | "dissolve" | "white" | "sweep" | "shrink"; d?: number; fx?: number; fy?: number; vx?: number; vy?: number; r?: number };
export type Shot = {
  a: number; b: number;
  v?: string; from?: number; rate?: number;       // clip (ruta en public, sin .mp4), segundo de origen, velocidad (1.25 ó 0.625)
  img?: string;                                    // foto (ruta en public, con extensión)
  comp?: string;                                   // componente de pantalla completa (lo dibuja el que llama)
  cam?: number[];                                  // [z0,fx0,fy0,z1,fx1,fy1]
  out?: Out; thermal?: number; credit?: string; grade?: string; flipX?: boolean;
};
const D = (o?: Out) => (o && o.type !== "cut" ? o.d ?? ({ flash: 0.16, dissolve: 0.5, white: 0.4, sweep: 0.55, shrink: 0.9 } as Record<string, number>)[o.type] ?? 0.34 : 0);

function xform(S: Shot[], s: Shot, i: number, t: number) {
  const prev = S[i - 1], next = S[i + 1];
  const dIn = prev ? D(prev.out) : 0, dOut = next ? D(s.out) : 0;
  if (t < s.a - dIn / 2 - 0.02 || t >= s.b + dOut / 2 + (dOut ? 0.02 : 0)) return null;
  const cam = s.cam ?? [1.04, 0.5, 0.5, 1.12, 0.5, 0.5];
  const k = ease(k01(t, s.a - dIn / 2, s.b + dOut / 2));
  let z = Math.exp(lerp(Math.log(cam[0]), Math.log(cam[3]), k)), fx = lerp(cam[1], cam[4], k), fy = lerp(cam[2], cam[5], k);
  let dx = 0, dy = 0, op = 1, bx = 0, by = 0, flash = 0, white = 0, mask: string | undefined, top = false, sc = 1, sfx = 0.5, sfy = 0.5, clip: string | undefined;
  if (next && dOut && t > s.b - dOut / 2) {
    const e = k01(t, s.b - dOut / 2, s.b + dOut / 2), o = s.out!;
    if (o.type === "zoom") { z *= 1 + 3.4 * Math.pow(e, 2.4); fx = lerp(fx, o.fx ?? fx, ease(Math.min(1, e * 1.6))); fy = lerp(fy, o.fy ?? fy, ease(Math.min(1, e * 1.6))); const b = 26 * Math.pow(e, 1.5); bx = b; by = b; op = 1 - k01(e, 0.45, 0.85); }
    else if (o.type === "pull") { z *= 1 - 0.2 * Math.pow(e, 2); const b = 14 * e * e; bx = b; by = b; op = 1 - k01(e, 0.4, 0.8); }
    else if (o.type === "whip") { const p = Math.pow(e, 2.2); dx = -(o.vx ?? 0) * W * 1.15 * p; dy = -(o.vy ?? 0) * H * 1.15 * p; bx = Math.abs(o.vx ?? 0) * 70 * Math.sin(Math.PI * e); by = Math.abs(o.vy ?? 0) * 70 * Math.sin(Math.PI * e); }
    else if (o.type === "flash") { flash = Math.max(flash, e); z *= 1 + 0.08 * e; }
    else if (o.type === "white") { white = Math.max(white, ease(e)); z *= 1 + 0.12 * e; }
    else if (o.type === "shrink") { const q = ease(e); top = true; sc = lerp(1, o.r ?? 0.1, q); sfx = lerp(0.5, o.fx ?? 0.5, q); sfy = lerp(0.5, o.fy ?? 0.5, q); clip = `ellipse(${lerp(75, 50, q)}% ${lerp(75, 50, q)}% at 50% 50%)`; op = 1 - k01(e, 0.8, 1); }
  }
  if (prev && dIn && t < s.a + dIn / 2) {
    const e = k01(t, s.a - dIn / 2, s.a + dIn / 2), o = prev.out!;
    if (o.type === "zoom") { z *= 1 + 0.55 * Math.pow(1 - e, 2); const b = 20 * Math.pow(1 - e, 2); bx = Math.max(bx, b); by = Math.max(by, b); op = k01(e, 0.35, 0.75); }
    else if (o.type === "pull") { z *= 1 + 0.9 * Math.pow(1 - e, 2.2); const b = 16 * Math.pow(1 - e, 2); bx = Math.max(bx, b); by = Math.max(by, b); op = k01(e, 0.05, 0.5); }
    else if (o.type === "whip") { const p = Math.pow(1 - e, 2.2); dx += (o.vx ?? 0) * W * 1.15 * p; dy += (o.vy ?? 0) * H * 1.15 * p; bx = Math.max(bx, Math.abs(o.vx ?? 0) * 70 * Math.sin(Math.PI * e)); by = Math.max(by, Math.abs(o.vy ?? 0) * 70 * Math.sin(Math.PI * e)); }
    else if (o.type === "flash") { op = e < 0.5 ? 0 : 1; flash = Math.max(flash, 1 - e); z *= 1 + 0.08 * (1 - e); }
    else if (o.type === "dissolve") { op = ease(e); }
    else if (o.type === "white") { op = e < 0.5 ? 0 : 1; white = Math.max(white, 1 - ease(e)); z *= 1 + 0.1 * (1 - e); }
    else if (o.type === "sweep") { const p = lerp(-25, 125, ease(e)); mask = `linear-gradient(105deg, black ${p - 18}%, transparent ${p + 18}%)`; flash = Math.max(flash, 0.35 * Math.sin(Math.PI * e)); }
  }
  z = Math.max(1, z);
  const hx = 0.5 / z, hy = 0.5 / z;
  fx = Math.min(1 - hx, Math.max(hx, fx)); fy = Math.min(1 - hy, Math.max(hy, fy));
  return { z, fx, fy, dx, dy, op, bx, by, flash, white, mask, top, sc, sfx, sfy, clip };
}

export const ShotLayer: React.FC<{ S: Shot[]; i: number; t: number; renderComp?: (s: Shot, t: number) => React.ReactNode }> = ({ S, i, t, renderComp }) => {
  const s = S[i], x = xform(S, s, i, t);
  if (!x) return null;
  const id = `bl${i}`, th = s.thermal != null ? (t >= s.thermal ? 1 : 0) : 0;
  const scanX = s.thermal != null ? ease(k01(t, s.thermal, s.thermal + 0.55)) : 0;
  const startF = Math.round((s.a - D(S[i - 1]?.out) / 2 - 0.05) * FPS);
  const media = (filter?: string) => s.v ? (
    <Sequence from={startF} layout="none">
      <OffthreadVideo src={staticFile(`${s.v}.mp4`)} startFrom={Math.round((s.from ?? 0) * FPS)} playbackRate={s.rate ?? 1.25} muted
        style={{ width: W, height: H, objectFit: "cover", filter, transform: s.flipX ? "scaleX(-1)" : undefined }} />
    </Sequence>
  ) : s.img ? <Img src={staticFile(s.img)} style={{ width: W, height: H, objectFit: "cover", filter, transform: s.flipX ? "scaleX(-1)" : undefined }} />
    : <div style={{ width: W, height: H }}>{renderComp?.(s, t)}</div>;
  return (
    <AbsoluteFill style={{ opacity: x.op, zIndex: x.top ? 500 + i : i, maskImage: x.mask, WebkitMaskImage: x.mask, clipPath: x.clip,
      transformOrigin: "0 0", transform: x.sc !== 1 ? `translate(${x.sfx * W}px,${x.sfy * H}px) scale(${x.sc}) translate(${-W / 2}px,${-H / 2}px)` : undefined }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${x.bx.toFixed(2)} ${x.by.toFixed(2)}`} /></filter></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", filter: x.bx + x.by > 0.4 ? `url(#${id})` : undefined,
        transform: `translate(${W / 2 + x.dx}px,${H / 2 + x.dy}px) scale(${x.z}) translate(${-x.fx * W}px,${-x.fy * H}px)` }}>
        {media(s.grade ?? "contrast(1.06) saturate(1.04)")}
        {s.thermal != null && scanX > 0 && (
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - scanX) * 100}% 0 0)` }}>{media("url(#thermal) contrast(1.15)")}</div>
        )}
      </div>
      {x.flash > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,240,220,${x.flash}), rgba(255,170,90,${x.flash * 0.85}))` }} />}
      {x.white > 0 && <AbsoluteFill style={{ background: `rgba(246,248,252,${x.white})` }} />}
    </AbsoluteFill>
  );
};
