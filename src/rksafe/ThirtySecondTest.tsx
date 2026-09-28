// ThirtySecondTest.tsx — EL TEST DE 30 SEGUNDOS (canal Ray Kessler · rkhanger).
// Un reloj-anillo que corre de `from` a `to` segundos + un checklist de 4 preguntas. Se usa varias
// veces seguidas (una por pregunta): `active` = la pregunta que suena AHORA (0 = presentación, se
// muestran todas vacías). Las anteriores ya están tildadas; la activa se tilda en cámara.
// El reloj NO es el tiempo real del video: es la metáfora del test (30 s repartidos en 4 preguntas).
import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, interpolate } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, PhotoBed, Keyring, clamp01 } from "./RayStage";

const ez = Easing.bezier(0.25, 0.1, 0.2, 1);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const ThirtySecondTest: React.FC<{
  title?: string;
  items?: { text: string }[];
  active?: number;
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "The 30-second test",
  items = [{ text: "Carry it?" }, { text: "Door gap?" }, { text: "Fire label only?" }, { text: "Backup key?" }],
  active = 0,
  bed,
  durationInFrames = 150,
}) => {
  const f = useCurrentFrame();
  const dur = Math.max(45, durationInFrames);
  const p = f / dur;
  const n = items.length;
  // tramo del reloj que le toca a este uso
  const from = 30 - (30 / n) * Math.max(0, active - 1);
  const to = active === 0 ? 30 : 30 - (30 / n) * active;
  const t = interpolate(ez(seg(p, 0.08, 0.92)), [0, 1], [from, to]);
  const secs = Math.ceil(t - 1e-6);
  const aIn = ez(seg(p, 0, 0.12));
  const R = 150, C = 2 * Math.PI * R;
  const frac = t / 30;
  const tick = f % 30 < 2 ? 1 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.76} />
      {/* reloj-anillo */}
      <div style={{ position: "absolute", left: "8%", top: "50%", transform: `translateY(-50%) scale(${(0.85 + 0.15 * aIn).toFixed(3)})`, opacity: aIn }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r={R} fill={rgba(V.ink0, 0.78)} stroke={rgba(V.bone, 0.2)} strokeWidth="18" />
          <circle cx="200" cy="200" r={R} fill="none" stroke={secs <= 8 ? V.danger : V.brass} strokeWidth="18" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 200 200)" />
          {Array.from({ length: 30 }).map((_, i) => {
            const a = (i / 30) * Math.PI * 2 - Math.PI / 2;
            return <line key={i} x1={200 + Math.cos(a) * 118} y1={200 + Math.sin(a) * 118} x2={200 + Math.cos(a) * (i % 5 ? 126 : 132)} y2={200 + Math.sin(a) * (i % 5 ? 126 : 132)} stroke={rgba(V.bone, 0.5)} strokeWidth="3" />;
          })}
          <text x="200" y="228" textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={800} fontSize="104" fill={V.white} opacity={1 - tick * 0.15}>{secs}</text>
          <text x="200" y="272" textAnchor="middle" fontFamily={F_BODY} fontSize="26" fill={V.bone}>seconds</text>
        </svg>
      </div>
      {/* checklist */}
      <div style={{ position: "absolute", left: "42%", top: "50%", transform: "translateY(-50%)", width: "50%" }}>
        <div style={{ opacity: aIn, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 62, color: V.white, marginBottom: 26, textShadow: "0 6px 30px rgba(0,0,0,0.92)" }}>{title}</div>
        {items.map((it, i) => {
          const idx = i + 1;
          const done = idx < active;
          const now = idx === active;
          const aRow = ez(seg(p, 0.06 + i * 0.06, 0.16 + i * 0.06));
          const chk = done ? 1 : now ? ez(seg(p, 0.55, 0.7)) : 0;
          const glow = now ? 0.5 + 0.5 * Math.sin(f / 6) : 0;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 18, opacity: aRow * (active === 0 || now || done ? 1 : 0.45), transform: `translateX(${((1 - aRow) * 40 + (now ? -8 * (1 - chk) : 0)).toFixed(1)}px)` }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <rect x="4" y="4" width="56" height="56" rx="8" fill={rgba(V.ink0, 0.75)} stroke={now ? V.brassSoft : rgba(V.bone, 0.6)} strokeWidth={now ? 4 + 2 * glow : 3} />
                <path d="M16 33 L28 45 L49 19" fill="none" stroke={V.brass} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={60 * (1 - chk)} />
              </svg>
              <div style={{ fontFamily: F_BODY, fontWeight: now ? 700 : 500, fontSize: now ? 50 : 42, color: now ? V.brassSoft : done ? V.bone : V.white, padding: "6px 16px", background: rgba(V.ink0, 0.66), borderRadius: 4 }}>{it.text}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: "5%", bottom: "7%", opacity: 0.85 * aIn }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
