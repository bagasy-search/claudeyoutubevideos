// PeltStacks — el boom y la caída de la piel como PILAS FÍSICAS de pieles (planchas marrones con textura de
// pelo procedural, levemente irregulares) que crecen por temporada. Altura ∝ valor (escala honesta, una sola
// escala para todas). La cámara sigue la cima de las pilas altas, después abre a plano general y la última
// pila aparece minúscula. Contadores grandes sobre cada pila, reglas de referencia en el fondo.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

type Bar = { label: string; value: number; note?: string };
export type PeltStacksProps = { bars: Bar[]; title?: string; unit?: string };

const Grain: React.FC<{ o?: number }> = ({ o = 0.22 }) => {
  const f = useCurrentFrame();
  return (
    <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
  );
};

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const niceStep = (max: number) => {
  const raw = max / 3.2;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2.5 : m < 7.5 ? 5 : 10) * p;
};

const HMAX = 1100; // altura en mundo de la pila mayor
const SW = 340; // ancho de pila
const SPACE = 520; // separación entre pilas
const NSLAB = 90; // planchas en la pila mayor
const FUR = ["#8a5a36", "#7a4d2c", "#94643d", "#6d4326", "#835532", "#9b6c44"];

export const PeltStacks: React.FC<PeltStacksProps> = ({ bars, title, unit = "pelts" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const n = bars.length;
  const vmax = Math.max(...bars.map((b) => b.value));
  const slabV = vmax / NSLAB;
  const th = HMAX / NSLAB;
  const xs = bars.map((_, i) => (i - (n - 1) / 2) * SPACE);
  const hOf = (v: number) => (v / vmax) * HMAX;

  // ----- horario (se comprime a la duración) -----
  const imax = bars.reduce((m, b, i) => (b.value > bars[m].value ? i : m), 0);
  // plano general justo después de la pila más alta; las de después crecen en el plano general
  const lens = bars.map((b) => 18 + 44 * Math.sqrt(b.value / vmax));
  const pullLen = 34;
  let acc = 12;
  const g0: number[] = [], g1: number[] = [];
  let pull0 = 0;
  bars.forEach((_, i) => {
    g0.push(acc); g1.push(acc + lens[i]); acc += lens[i] + 8;
    if (i === imax) { pull0 = acc - 4; acc += pullLen - 10; }
  });
  const need = acc + 40;
  const k = clamp((D - 16) / need, 0.45, 1.25);
  const t = frame / k;
  const prog = (i: number) => easeInOut((t - g0[i]) / (g1[i] - g0[i]));

  // ----- cámara -----
  const GROUND_Y = 820; // y de pantalla del suelo cuando la cámara está "abajo"
  const zFor = (i: number) => (bars[i].value / vmax < 0.1 ? 2.0 : 1.55);
  const raw = (i: number) => {
    const z = zFor(i);
    const top = hOf(bars[i].value) * prog(i);
    const cyGround = (GROUND_Y - 540) / z; // cy que deja el suelo en GROUND_Y
    const cy = Math.max(cyGround, top - 170 / z); // cy = altura de mundo en el centro de pantalla
    return { cx: xs[i], cy, z };
  };
  const zWide = Math.min(1500 / ((n - 1) * SPACE + SW + 200), 640 / HMAX);
  const wide = { cx: 0, cy: 340 / zWide, z: zWide };
  let cam = raw(0);
  for (let i = 1; i <= imax; i++) {
    const w = easeInOut((t - (g0[i] - 14)) / 22);
    const r = raw(i);
    cam = { cx: lerp(cam.cx, r.cx, w), cy: lerp(cam.cy, r.cy, w), z: lerp(cam.z, r.z, w) };
  }
  const wp = easeInOut((t - pull0) / pullLen);
  cam = { cx: lerp(cam.cx, wide.cx, wp), cy: lerp(cam.cy, wide.cy, wp), z: lerp(cam.z, wide.z, wp) };
  // deriva lenta
  const drift = frame / Math.max(1, D);
  cam.cx += Math.sin(frame * 0.02) * 6;
  cam.z *= 1 + 0.03 * easeInOut(drift);
  const SX = (wx: number) => 960 + (wx - cam.cx) * cam.z;
  const SY = (wy: number) => 540 - (wy - cam.cy) * cam.z;
  const gY = SY(0);

  const tOut = clamp((frame - (D - 12)) / 12);
  const out = 1 - easeInOut(tOut);
  const step = niceStep(vmax);

  return (
    <AbsoluteFill style={{ background: "#0a0806", overflow: "hidden", opacity: out }}>
      {/* pared del galpón: se mueve con parallax */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at 50% ${clamp(gY / 10.8 - 40, -30, 60)}%, #3a2a1a 0%, #1f160e 45%, #0b0806 85%)` }} />
      <AbsoluteFill style={{ opacity: 0.5, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 2px, rgba(0,0,0,0) 2px 120px)", backgroundPosition: `${-cam.cx * cam.z * 0.4}px 0` }} />
      {/* haces de luz sobre cada pila */}
      {xs.map((x, i) => (
        <div key={i} style={{ position: "absolute", left: SX(x) - 300 * cam.z, top: 0, width: 600 * cam.z, height: gY,
          background: "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(255,190,120,0.10), rgba(0,0,0,0) 70%)" }} />
      ))}
      {/* reglas de referencia */}
      {Array.from({ length: Math.floor(vmax / step) }).map((_, j) => {
        const v = (j + 1) * step;
        const y = SY(hOf(v));
        if (y < -40 || y > gY - 10) return null;
        return (
          <React.Fragment key={j}>
            <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 0, borderTop: "2px dashed rgba(241,235,221,0.13)" }} />
            <div style={{ position: "absolute", left: 40, top: y - 30, fontFamily: MONO, fontSize: 22, color: "rgba(241,235,221,0.45)" }}>{fmt(v)}</div>
          </React.Fragment>
        );
      })}
      {/* piso */}
      <div style={{ position: "absolute", left: 0, right: 0, top: gY, bottom: 0, minHeight: 0,
        background: "linear-gradient(180deg, #2a1d12 0%, #150f09 40%, #080604 100%)", boxShadow: "0 -1px 0 rgba(255,210,150,0.18)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: gY, height: Math.max(0, 1080 - gY), opacity: 0.35,
        backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.5) 0 2px, rgba(0,0,0,0) 2px 34px)" }} />

      {/* pilas */}
      {bars.map((b, i) => {
        const p = prog(i);
        const hNow = hOf(b.value) * p;
        const fullSlabs = Math.floor((b.value * p) / slabV);
        const rem = (b.value * p) / slabV - fullSlabs;
        const total = fullSlabs + (rem > 0.001 ? 1 : 0);
        const x0 = SX(xs[i] - SW / 2);
        const w = SW * cam.z;
        // recortar planchas fuera de pantalla
        const slabs: React.ReactNode[] = [];
        for (let j = 0; j < total; j++) {
          const partial = j === fullSlabs;
          const hWorld = partial ? th * rem : th;
          const y0w = j * th;
          const yTop = SY(y0w + hWorld);
          const yBot = SY(y0w);
          if (yBot < -20 || yTop > 1100) continue;
          const s = i * 1000 + j;
          const ww = w * (0.9 + 0.1 * rnd(s));
          const off = (rnd(s + 5) - 0.5) * 14 * cam.z;
          const col = FUR[Math.floor(rnd(s + 2) * FUR.length)];
          // la plancha más nueva cae desde arriba
          const drop = 0;
          const hh = Math.max(1.5, yBot - yTop - (hWorld > 4 ? 1.2 : 0));
          slabs.push(
            <div key={j} style={{
              position: "absolute", left: x0 + (w - ww) / 2 + off, top: yTop - drop, width: ww, height: hh,
              borderRadius: `${hh * 0.5}px ${hh * 0.6}px ${hh * 0.45}px ${hh * 0.55}px / ${hh * 0.5}px`,
              background: `linear-gradient(180deg, rgba(255,230,190,0.28) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 100%), repeating-linear-gradient(${96 + rnd(s + 7) * 8}deg, rgba(0,0,0,0.16) 0 2px, rgba(255,220,170,0.06) 2px 3px, rgba(0,0,0,0) 3px 5px), ${col}`,
              boxShadow: `0 ${Math.max(1, 2 * cam.z)}px ${Math.max(1, 3 * cam.z)}px rgba(0,0,0,0.55)`,
            }} />
          );
        }
        const topY = SY(hNow);
        const vis = clamp((t - g0[i] + 6) / 8);
        const fs = clamp(lerp(44, 96, (cam.z - 0.45) / 0.8), 44, 110);
        const done = p >= 1;
        return (
          <React.Fragment key={i}>
            {/* sombra en el piso */}
            <div style={{ position: "absolute", left: x0 - 30 * cam.z, top: gY - 6 * cam.z, width: w + 60 * cam.z, height: 26 * cam.z, borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(0,0,0,0.7), rgba(0,0,0,0))", opacity: vis }} />
            {slabs}
            {hNow > 0.5 && (
              <div style={{ position: "absolute", left: x0 - 8 * cam.z, top: topY, width: w + 16 * cam.z, height: Math.max(0, gY - topY), pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(255,220,170,0.10) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.42) 100%)" }} />
            )}
            {hNow > 0.5 && (
              <div style={{ position: "absolute", left: x0 + w * 0.08, top: topY - 3 * cam.z, width: w * 0.84, height: 7 * cam.z, borderRadius: "50%",
                background: "radial-gradient(closest-side, rgba(255,215,160,0.35), rgba(255,215,160,0))" }} />
            )}
            {/* contador */}
            <div style={{ position: "absolute", left: SX(xs[i]) - 300, width: 600, top: topY - fs * 1.15 - 18, textAlign: "center", opacity: vis * clamp((960 - (topY - fs * 1.15)) / 120) }}>
              <div style={{ fontFamily: SERIF, fontSize: fs, lineHeight: 1, color: b.note && done ? HK.gold : HK.bone, textShadow: "0 6px 26px rgba(0,0,0,0.8)", fontVariantNumeric: "tabular-nums" }}>{fmt(b.value * p)}</div>
            </div>
            {b.note && (
              <div style={{ position: "absolute", left: SX(xs[i]) - 300, width: 600, top: topY - fs * 1.15 - 18 - 44, textAlign: "center", opacity: ease((t - g1[i]) / 10) * clamp((960 - (topY - fs * 1.15)) / 120) }}>
                <span style={{ fontFamily: SANS, fontSize: 24, letterSpacing: 5, color: HK.ink, background: HK.orange, padding: "4px 12px 3px 16px", boxShadow: "0 4px 14px rgba(0,0,0,0.5)" }}>{b.note}</span>
              </div>
            )}
            {/* etiqueta de temporada */}
            <div style={{ position: "absolute", left: SX(xs[i]) - 200, width: 400, top: gY + 18 * Math.min(1, cam.z) + 4, textAlign: "center", fontFamily: SANS, fontSize: clamp(34 * cam.z + 8, 30, 48), letterSpacing: 4, color: HK.bone, opacity: vis * 0.9 }}>{b.label}</div>
          </React.Fragment>
        );
      })}

      {/* título */}
      {title && (
        <div style={{ position: "absolute", left: 80, top: 60, opacity: ease((frame - 4) / 14) }}>
          <div style={{ fontFamily: SANS, fontSize: 32, letterSpacing: 8, color: HK.bone }}>{title}</div>
          <div style={{ width: 80, height: 3, background: HK.orange, marginTop: 12 }} />
        </div>
      )}
      <div style={{ position: "absolute", right: 80, top: 66, fontFamily: MONO, fontSize: 22, color: "rgba(241,235,221,0.55)", opacity: ease((frame - 10) / 14) }}>
        1 SLAB ≈ {fmt(slabV)} {unit.toUpperCase()}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.72) 100%)", pointerEvents: "none" }} />
      <Grain o={0.24} />
    </AbsoluteFill>
  );
};
