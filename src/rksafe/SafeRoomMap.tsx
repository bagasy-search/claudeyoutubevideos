// SafeRoomMap.tsx — PLANO DE LA CASA: dónde NO poner la caja (canal Ray Kessler · rkhanger).
// La planta se dibuja trazo a trazo; una ruta roja punteada va derecho al dormitorio principal
// (la continuidad con el video de dónde busca primero) y ahí cae una X roja; después se encienden
// en latón los lugares aburridos. Cámara virtual: paneo por el plano siguiendo la ruta.
import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, PhotoBed, Keyring, clamp01 } from "./RayStage";

const ez = Easing.bezier(0.3, 0, 0.2, 1);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

type Room = { key: string; x: number; y: number; w: number; h: number };
const ROOMS: Room[] = [
  { key: "master", x: 250, y: 170, w: 420, h: 300 },
  { key: "hall", x: 670, y: 170, w: 160, h: 520 },
  { key: "linen", x: 830, y: 170, w: 150, h: 150 },
  { key: "laundry", x: 830, y: 320, w: 280, h: 170 },
  { key: "kitchen", x: 250, y: 470, w: 420, h: 220 },
  { key: "garage", x: 1110, y: 170, w: 300, h: 520 },
];

export const SafeRoomMap: React.FC<{
  title?: string;
  bad?: string;
  good?: { label: string; room: "linen" | "laundry" | "garage" | "kitchen" }[];
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "Somewhere boring",
  bad = "Master closet",
  good = [{ label: "Laundry", room: "laundry" }, { label: "Linen closet", room: "linen" }, { label: "Garage shelf", room: "garage" }],
  bed,
  durationInFrames = 180,
}) => {
  const f = useCurrentFrame();
  const dur = Math.max(60, durationInFrames);
  const p = f / dur;
  const draw = ez(seg(p, 0.02, 0.24));
  const route = ez(seg(p, 0.22, 0.42));
  const x = ez(seg(p, 0.4, 0.5));
  const aHead = ez(seg(p, 0, 0.1));
  const pan = -60 + 120 * ez(seg(p, 0.2, 0.95));
  const z = 1.02 + 0.08 * ez(seg(p, 0.2, 0.6)) - 0.06 * ez(seg(p, 0.6, 0.95));
  const byKey = Object.fromEntries(ROOMS.map((r) => [r.key, r]));
  const m = byKey.master;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.84} />
      <AbsoluteFill style={{ transform: `translateX(${pan.toFixed(1)}px) scale(${z.toFixed(4)})` }}>
        <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "100%" }}>
          {ROOMS.map((r) => (
            <rect key={r.key} x={r.x} y={r.y} width={r.w} height={r.h} fill={rgba(V.ink1, 0.7)} stroke={rgba(V.bone, 0.75)} strokeWidth="4"
              strokeDasharray={2 * (r.w + r.h)} strokeDashoffset={2 * (r.w + r.h) * (1 - draw)} />
          ))}
          {/* placard del principal */}
          <rect x={m.x + 20} y={m.y + 20} width="150" height="60" fill={rgba(V.danger, 0.18 * x)} stroke={rgba(V.bone, 0.6)} strokeWidth="3" opacity={draw} />
          {/* entrada */}
          <rect x="720" y="686" width="60" height="10" fill={V.brass} opacity={draw} />
          {/* ruta roja: puerta -> pasillo -> principal */}
          <path d="M 750 690 L 750 330 L 470 330 L 345 230" fill="none" stroke={V.danger} strokeWidth="7" strokeDasharray="1000" strokeDashoffset={1000 * (1 - route)} strokeLinecap="round" />
          <path d="M 750 690 L 750 330 L 470 330 L 345 230" fill="none" stroke={rgba(V.ink0, 1)} strokeWidth="3" strokeDasharray="14 16" opacity={route} />
          {/* X roja sobre el placard */}
          <g opacity={x} transform={`translate(${m.x + 95} ${m.y + 50}) scale(${(0.6 + 0.4 * x).toFixed(3)})`}>
            <line x1="-40" y1="-40" x2="40" y2="40" stroke={V.danger} strokeWidth="14" strokeLinecap="round" />
            <line x1="40" y1="-40" x2="-40" y2="40" stroke={V.danger} strokeWidth="14" strokeLinecap="round" />
          </g>
          <text x={m.x + 20} y={m.y + 130} fontFamily={F_BODY} fontWeight={700} fontSize="34" fill={V.dangerSoft} opacity={x}>{bad}</text>
          {/* lugares aburridos */}
          {good.map((g, i) => {
            const r = byKey[g.room];
            const a = ez(seg(p, 0.52 + i * 0.1, 0.62 + i * 0.1));
            return (
              <g key={i} opacity={a}>
                <rect x={r.x + 8} y={r.y + 8} width={r.w - 16} height={r.h - 16} fill={rgba(V.brass, 0.16)} stroke={V.brass} strokeWidth="4" />
                <circle cx={r.x + r.w / 2} cy={r.y + r.h / 2 - 16} r="24" fill={V.brass} />
                <path d={`M ${r.x + r.w / 2 - 12} ${r.y + r.h / 2 - 16} l 8 9 l 16 -18`} stroke={V.ink0} strokeWidth="5" fill="none" />
                <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 40} textAnchor="middle" fontFamily={F_BODY} fontWeight={700} fontSize="30" fill={V.white}>{g.label}</text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: "5%", top: "5%", opacity: aHead }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, color: V.white, textShadow: "0 6px 30px rgba(0,0,0,0.92)" }}>{title}</div>
      </div>
      <div style={{ position: "absolute", right: "5%", bottom: "6%", opacity: 0.85 * aHead }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
