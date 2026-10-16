// Escritorio de evidencia en CSS 3D puro: fotos de archivo reales, polaroids, informes a máquina, notas, chinches,
// hilo rojo y círculos de marcador que se dibujan. Una sola cámara continua (sin cortes) con profundidad de campo.
import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, spring, Easing } from "remotion";
import { loadFont as loadType } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

import { sf } from "./sf";
const { fontFamily: TYPE } = loadType("normal", { weights: ["400"] });
const { fontFamily: MARK } = loadMarker("normal", { weights: ["400"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["700"] });
const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

export type DeskItem = {
  id: string; kind: "photo" | "polaroid" | "doc" | "note" | "label";
  x: number; y: number; w: number; rot: number; t0: number;
  src?: string; caption?: string; title?: string; lines?: string[]; color?: string; pin?: boolean; h?: number;
};
export type DeskMark = { item: string; t0: number; dx?: number; dy?: number; rx: number; ry: number; color?: string };
export type DeskString = { a: string; b: string; t0: number };
export type DeskCam = [number, number, number, number, number, number]; // t, x, y, zoom, tilt, rotZ
export type DeskScene = { items: DeskItem[]; marks: DeskMark[]; strings: DeskString[]; cam: DeskCam[] };

const DW = 5200, DH = 3200;

function camAt(K: DeskCam[], t: number) {
  let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
  return { x: a[1] + (b[1] - a[1]) * k, y: a[2] + (b[2] - a[2]) * k, z, tilt: a[4] + (b[4] - a[4]) * k, rz: a[5] + (b[5] - a[5]) * k };
}
// proyección aproximada desk → pantalla (para la profundidad de campo por ítem)
function toScreen(c: ReturnType<typeof camAt>, x: number, y: number): [number, number] {
  const r = (c.rz * Math.PI) / 180;
  const dx = (x - c.x) * c.z, dy = (y - c.y) * c.z;
  const rx = dx * Math.cos(r) - dy * Math.sin(r), ry = dx * Math.sin(r) + dy * Math.cos(r);
  const ty = ry * Math.cos((c.tilt * Math.PI) / 180);
  const depth = ry * Math.sin((c.tilt * Math.PI) / 180);
  const s = 1200 / (1200 + depth);
  return [960 + rx * s, 540 + ty * s];
}

// chinche roja
const Pin: React.FC = () => (
  <div style={{ position: "absolute", left: "50%", top: -14, width: 30, height: 30, marginLeft: -15, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a7a 0%, #d8261a 45%, #7a0f08 100%)", boxShadow: "3px 6px 6px rgba(0,0,0,.55)", zIndex: 3 }} />
);

const ItemView: React.FC<{ it: DeskItem }> = ({ it }) => {
  if (it.kind === "photo" || it.kind === "polaroid") {
    const pol = it.kind === "polaroid";
    return (
      <div style={{ width: it.w, background: "#f4f1ea", padding: pol ? `${it.w * 0.05}px ${it.w * 0.05}px ${it.w * 0.2}px` : it.w * 0.025, boxSizing: "border-box" }}>
        <Img src={sf(it.src!)} style={{ width: "100%", height: it.h ?? it.w * 0.72, objectFit: "cover", display: "block", filter: "sepia(.25) contrast(1.05)" }} />
        {pol && it.caption && <div style={{ fontFamily: HAND, fontSize: it.w * 0.085, color: "#222", textAlign: "center", marginTop: it.w * 0.03 }}>{it.caption}</div>}
      </div>
    );
  }
  if (it.kind === "doc") {
    return (
      <div style={{ width: it.w, minHeight: it.w * 1.3, background: "linear-gradient(#f2ede0,#e9e2cf)", padding: it.w * 0.08, boxSizing: "border-box", fontFamily: TYPE, color: "#2a2620" }}>
        <div style={{ fontSize: it.w * 0.075, letterSpacing: 2, borderBottom: "3px solid #2a2620", paddingBottom: it.w * 0.02, marginBottom: it.w * 0.05, textTransform: "uppercase" }}>{it.title}</div>
        {it.lines?.map((l, i) => <div key={i} style={{ fontSize: it.w * 0.055, lineHeight: 1.55 }}>{l}</div>)}
      </div>
    );
  }
  if (it.kind === "note") {
    return <div style={{ width: it.w, height: it.w, background: it.color ?? "#f3dc6a", padding: it.w * 0.09, boxSizing: "border-box", fontFamily: MARK, fontSize: it.w * 0.15, lineHeight: 1.15, color: "#1d1d1d", boxShadow: "inset 0 -18px 20px rgba(0,0,0,.08)" }}>{it.caption}</div>;
  }
  return <div style={{ background: it.color ?? "#e9d79a", padding: `${it.w * 0.05}px ${it.w * 0.1}px`, fontFamily: MARK, fontSize: it.w * 0.2, color: "#1d1d1d", whiteSpace: "nowrap" }}>{it.caption}</div>;
};

// círculo de marcador "a mano": elipse con temblor, se dibuja con dashoffset
const ring = (rx: number, ry: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    // trazo a mano: deformación de baja frecuencia y el final no cierra exacto (pasa de largo y se abre)
    const a = (i / 64) * Math.PI * 2.12 - 0.4, w = 1 + 0.05 * Math.sin(a * 2 + 0.7) + 0.025 * Math.sin(a * 3 + 2) + (i > 56 ? (i - 56) * 0.012 : 0);
    pts.push(`${(Math.cos(a) * rx * w).toFixed(1)},${(Math.sin(a) * ry * w).toFixed(1)}`);
  }
  return "M" + pts.join("L");
};

export const EvidenceDesk: React.FC<{ scene: DeskScene; t: number; f: number; t0: number; t1: number; tr: number }> = ({ scene, t, f, t0, t1, tr }) => {
  if (t < t0 - 0.05 || t > t1 + 0.05) return null;
  const c = camAt(scene.cam, t);
  const c0 = camAt(scene.cam, t - 1 / FPS);
  const speed = Math.hypot(c.x - c0.x, c.y - c0.y) * c.z;
  const fade = Math.min(interpolate(t, [t0, t0 + 0.4], [0, 1], clamp), interpolate(t, [t1 - 0.4, t1], [1, 0], clamp));
  const byId = Object.fromEntries(scene.items.map((i) => [i.id, i]));
  const center = (it: DeskItem): [number, number] => [it.x + it.w / 2, it.y + (it.h ?? it.w * 0.9) / 2];
  // respiración de cámara a mano (sutil)
  const hx = Math.sin(tr * 1.3) * 6, hy = Math.cos(tr * 1.1) * 5;
  return (
    <AbsoluteFill style={{ opacity: fade, background: "#0d0a08", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1200, perspectiveOrigin: "50% 50%", filter: speed > 14 ? `blur(${Math.min(2.5, (speed - 14) / 14)}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: DW, height: DH, transformOrigin: "0 0",
          transform: `translate(${960 + hx}px,${540 + hy}px) rotateX(${c.tilt}deg) rotateZ(${c.rz}deg) scale(${c.z}) translate(${-c.x}px,${-c.y}px)` }}>
          {/* corcho/fieltro: gradientes + ruido SVG */}
          <div style={{ position: "absolute", inset: 0,  background: "radial-gradient(ellipse at 50% 45%, #6b5238 0%, #4a3826 55%, #2c2117 100%)" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.55, backgroundImage: `url(${sf("desk/cork.png")})`, backgroundSize: "256px 256px" }} />
          {/* hilo rojo */}
          <svg width={DW} height={DH} style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: 50 }}>
            {scene.strings.map((s, i) => {
              const A = byId[s.a], B = byId[s.b]; if (!A || !B || t < s.t0) return null;
              const [ax, ay] = [A.x + A.w / 2, A.y - 4], [bx, by] = [B.x + B.w / 2, B.y - 4];
              const k = interpolate(t, [s.t0, s.t0 + 0.7], [0, 1], { ...clamp, easing: ease });
              const sag = Math.hypot(bx - ax, by - ay) * 0.06;
              const d = `M${ax},${ay} Q${(ax + bx) / 2},${(ay + by) / 2 + sag} ${bx},${by}`;
              return <path key={i} d={d} fill="none" stroke="#c8160c" strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} style={{ filter: "drop-shadow(4px 8px 3px rgba(0,0,0,.5))" }} />;
            })}
          </svg>
          {scene.items.map((it, idx) => {
            if (t < it.t0 - 0.02) return null;
            const p = spring({ frame: (t - it.t0) * FPS, fps: FPS, config: { damping: 14, stiffness: 120, mass: 0.8 } });
            const lift = (1 - p) * 420;
            const [sx, sy] = toScreen(c, ...center(it));
            const dist = Math.hypot(sx - 960, (sy - 540) * 1.35);
            const blur = Math.min(7, Math.max(0, (dist - 380) / 160) * Math.min(1.6, c.z) * 1.4);
            return (
              <div key={it.id} style={{ position: "absolute", left: it.x, top: it.y, transform: `scale(${1 + lift / 700}) rotate(${it.rot + (1 - p) * 9}deg)`, transformOrigin: "50% 50%",
                boxShadow: `${6 + lift / 30}px ${12 + lift / 14}px ${14 + lift / 10}px rgba(0,0,0,${0.55 - lift / 1400})`, filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined, opacity: Math.min(1, p * 3) }}>
                {it.pin !== false && <Pin />}
                <ItemView it={it} />
                {/* círculos de marcador sobre este ítem */}
                {scene.marks.filter((m) => m.item === it.id && t >= m.t0).map((m, i) => {
                  const k = interpolate(t, [m.t0, m.t0 + 0.55], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
                  return (
                    <svg key={i} width={1} height={1} style={{ position: "absolute", left: it.w / 2 + (m.dx ?? 0), top: (it.h ?? it.w * 0.9) / 2 + (m.dy ?? 0), overflow: "visible" }}>
                      <path d={ring(m.rx, m.ry)} fill="none" stroke={m.color ?? "#d4170c"} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} opacity={0.9} />
                    </svg>
                  );
                })}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* luz de lámpara + viñeta */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at ${50 + Math.sin(tr * 0.4) * 6}% 42%, rgba(255,214,150,.10) 0%, transparent 55%, rgba(0,0,0,.62) 100%)`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
