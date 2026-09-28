// LearnButtonWipe.tsx — EL BOTÓN LEARN DEL MOTOR Y EL BORRADO DE MEMORIA (canal Ray Kessler, rkremote).
//
// Motion design de broadcast dibujado cuadro a cuadro: la carcasa del motor del portón en SVG, la
// antena, el botón LEARN de color y su LED. Una cámara virtual ENTRA a la pieza (push hacia el botón),
// un dedo lo aprieta, un anillo cuenta los segundos, y a la derecha la MEMORIA del motor (la lista de
// controles que conoce) se va borrando fila por fila hasta que el LED se apaga y queda "0".
//
// Modos:
//   · "find"  — la cámara entra al motor y señala el botón, el LED y la antena; el botón cicla colores
//               (en muchos modelos el color cambia según la generación).
//   · "wipe"  — el borrado completo: apretar y sostener ~N segundos, la lista se vacía, LED apagado.
//   · "list"  — sólo la memoria llena, con las filas entrando una por una (el motor "recuerda").
// ⛔ Todos los tiempos son FRACCIONES de la duración (nunca cuadros fijos): el plan decide cuánto dura.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

const BTN: Record<string, string> = {
  purple: "#8B5CF6", yellow: "#E8C547", red: "#D8352A", orange: "#E9812F", green: "#4FA34A",
};

export const LearnButtonWipe: React.FC<{
  mode?: "find" | "wipe" | "list";
  kicker?: string;
  title?: string;
  seconds?: number;
  color?: "purple" | "yellow" | "red" | "orange" | "green";
  slots?: { text: string }[];
  bed?: string;
  durationInFrames?: number;
}> = ({
  mode = "wipe",
  kicker = "THE LEARN BUTTON",
  title = "Hold it about six seconds",
  seconds = 6,
  color = "purple",
  slots = [{ text: "Remote 1" }, { text: "Remote 2" }, { text: "Keypad" }, { text: "Car button" }, { text: "Unknown" }],
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;                                   // 0..1 de la vida del componente
  const ease = (a: number, b: number) => clamp01(interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) }));

  // ── cámara virtual: entra a la carcasa y se acerca al botón ──────────────────────────────────
  const push = ease(0.02, mode === "find" ? 0.45 : 0.24);
  const camZ = interpolate(push, [0, 1], [0.72, mode === "find" ? 1.3 : 1.0]);
  const camX = interpolate(push, [0, 1], [0, mode === "find" ? -150 : -40]);
  const camY = interpolate(push, [0, 1], [60, mode === "find" ? 10 : 40]);
  const aIn = ease(0, 0.08);

  // ── la presión y la cuenta ───────────────────────────────────────────────────────────────────
  const p0 = 0.26, p1 = 0.8;                            // ventana del "sostener"
  const pressing = mode === "wipe" ? ease(p0 - 0.04, p0) * (1 - ease(p1 + 0.02, p1 + 0.06)) : 0;
  const hold = mode === "wipe" ? clamp01((t - p0) / (p1 - p0)) : 0;
  const cuenta = Math.max(0, Math.ceil(seconds * (1 - hold)));
  const ledOff = mode === "wipe" ? ease(p1 - 0.01, p1 + 0.02) : 0;
  const ledBlink = mode === "find" ? 0.75 + 0.25 * Math.sin(frame / 4) : 1;
  const ledOn = (1 - ledOff) * ledBlink;

  // el botón cicla colores en "find" (cada modelo tiene el suyo)
  const ciclo = ["purple", "yellow", "red", "orange", "green"];
  const btnColor = mode === "find"
    ? BTN[ciclo[Math.min(ciclo.length - 1, Math.floor(clamp01((t - 0.5) / 0.42) * ciclo.length))]]
    : BTN[color] || BTN.purple;

  // ── memoria del motor: las filas entran y después se borran ──────────────────────────────────
  const n = slots.length;
  const filaIn = (i: number) => ease(0.08 + (i / n) * (mode === "list" ? 0.5 : 0.16), 0.14 + (i / n) * (mode === "list" ? 0.5 : 0.16));
  const filaOut = (i: number) => (mode === "wipe" ? ease(p0 + (i / n) * (p1 - p0) * 0.9, p0 + ((i + 0.7) / n) * (p1 - p0) * 0.9) : 0);
  const vivos = mode === "wipe" ? slots.filter((_, i) => filaOut(i) < 0.5).length : slots.filter((_, i) => filaIn(i) > 0.5).length;
  const sello = mode === "wipe" ? ease(p1 + 0.02, p1 + 0.1) : 0;
  const tituloA = ease(0.03, 0.12);

  // dedo: baja hacia el botón y se hunde un poco al apretar
  const dedoY = interpolate(pressing, [0, 1], [-190, -8]);

  // ondas del LED mientras está prendido
  const halo = (k: number) => ((frame / fps) * 0.9 + k / 3) % 1;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.78} />

      {/* ── título ── */}
      <div style={{ position: "absolute", zIndex: 5, left: 96, top: 72, opacity: tituloA, transform: `translateY(${(1 - tituloA) * 18}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, color: V.white, lineHeight: 1.05, marginTop: 6, textShadow: "0 6px 26px rgba(0,0,0,.9)" }}>{title}</div>
      </div>

      {/* ── LA PIEZA: carcasa del motor en SVG, con cámara virtual ── */}
      <div style={{
        position: "absolute", left: mode === "list" ? 70 : 90, top: 250, width: 1000, height: 760,
        transform: `translate(${camX}px, ${camY}px) scale(${camZ})`, transformOrigin: "62% 52%", opacity: aIn,
      }}>
        <svg width={1000} height={760} viewBox="0 0 1000 760" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="lbw_case" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D9D2C2" />
              <stop offset="0.55" stopColor="#BDB5A3" />
              <stop offset="1" stopColor="#8E8878" />
            </linearGradient>
            <linearGradient id="lbw_rail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#6E6E74" />
              <stop offset="1" stopColor="#3A3A40" />
            </linearGradient>
            <radialGradient id="lbw_led" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#FFF4C8" />
              <stop offset="0.4" stopColor="#FFB23E" />
              <stop offset="1" stopColor="rgba(255,150,40,0)" />
            </radialGradient>
          </defs>
          {/* techo y flejes */}
          <rect x="0" y="0" width="1000" height="26" fill="#1B1B1F" />
          <rect x="250" y="22" width="16" height="120" fill="#55555C" />
          <rect x="690" y="22" width="16" height="120" fill="#55555C" />
          {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={258} cy={34 + i * 18} r={3} fill="#2A2A2E" />)}
          {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={698} cy={34 + i * 18} r={3} fill="#2A2A2E" />)}
          {/* riel que sale hacia la puerta */}
          <rect x="-400" y="300" width="560" height="34" rx="4" fill="url(#lbw_rail)" />
          {/* carcasa */}
          <rect x="150" y="130" width="660" height="400" rx="46" fill="url(#lbw_case)" stroke="#6F6A5E" strokeWidth="4" />
          <rect x="190" y="470" width="580" height="70" rx="24" fill="#EFE9D8" opacity={0.85} />
          {/* rejilla de ventilación */}
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={230 + i * 40} y={190} width={16} height={130} rx={8} fill="#8A8474" opacity={0.7} />
          ))}
          {/* panel de atrás: botón LEARN + LED */}
          <rect x="600" y="340" width="170" height="110" rx="14" fill="#2B2A27" />
          <g transform={`translate(657 397) scale(${(1 - pressing * 0.08).toFixed(3)}) translate(-657 -397)`}>
            <rect x="628" y="368" width="58" height="58" rx="9" fill={btnColor} />
            <rect x="628" y="368" width="58" height="12" rx="6" fill="rgba(255,255,255,.28)" />
          </g>
          {/* LED */}
          <circle cx="730" cy="397" r="11" fill={ledOn > 0.05 ? "#FFB23E" : "#3A3228"} />
          {ledOn > 0.05 ? <circle cx="730" cy="397" r={46} fill="url(#lbw_led)" opacity={ledOn * 0.9} /> : null}
          {ledOn > 0.05 ? [0, 1, 2].map((k) => (
            <circle key={k} cx="730" cy="397" r={14 + halo(k) * 60} fill="none" stroke={rgba("#FFB23E", (1 - halo(k)) * 0.55 * ledOn)} strokeWidth="2" />
          )) : null}
          {/* antena */}
          <path d="M 790 450 C 810 520, 800 600, 830 700" stroke="#E7E1D0" strokeWidth="4" fill="none" />
          {/* anillo de cuenta alrededor del botón */}
          {mode === "wipe" && hold > 0 && hold < 1 ? (
            <circle cx="657" cy="397" r="58" fill="none" stroke={V.brass} strokeWidth="7"
              strokeDasharray={`${(2 * Math.PI * 58 * hold).toFixed(1)} 999`} transform="rotate(-90 657 397)" strokeLinecap="round" />
          ) : null}
          {/* el dedo */}
          {mode === "wipe" ? (
            <g transform={`translate(657, ${397 + dedoY})`} opacity={pressing > 0.02 ? 1 : 0}>
              <rect x="-26" y="-230" width="52" height="236" rx="26" fill="#C99A7C" />
              <rect x="-18" y="-10" width="36" height="16" rx="8" fill="#E8C2A9" />
              <rect x="-26" y="-230" width="14" height="236" rx="7" fill="rgba(0,0,0,.12)" />
            </g>
          ) : null}
          {/* llamadas del modo FIND: trazo a trazo */}
          {mode === "find" ? ([
            { x1: 657, y1: 360, x2: 430, y2: 200, txt: "LEARN button", a: ease(0.42, 0.52) },
            { x1: 742, y1: 392, x2: 900, y2: 250, txt: "The little light", a: ease(0.52, 0.62) },
            { x1: 815, y1: 640, x2: 920, y2: 720, txt: "Antenna wire", a: ease(0.62, 0.72) },
          ].map((c, i) => {
            const len = Math.hypot(c.x2 - c.x1, c.y2 - c.y1);
            return (
              <g key={i} opacity={c.a > 0 ? 1 : 0}>
                <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={V.brass} strokeWidth="4"
                  strokeDasharray={`${len}`} strokeDashoffset={`${len * (1 - c.a)}`} />
                <circle cx={c.x2} cy={c.y2} r={8 * c.a} fill={V.brass} />
                <text x={c.x2 + (c.x2 > c.x1 ? 16 : -16)} y={c.y2 - 14} fill={V.white} fontFamily={F_DISPLAY} fontSize={40}
                  textAnchor={c.x2 > c.x1 ? "start" : "end"} opacity={c.a}>{c.txt}</text>
              </g>
            );
          })) : null}
        </svg>
      </div>

      {/* cuenta regresiva grande */}
      {mode === "wipe" && hold > 0 && ledOff < 0.5 ? (
        <div style={{ position: "absolute", left: 96, bottom: 90, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 150, color: V.brass, lineHeight: 1, textShadow: `0 0 50px ${rgba(V.brass, 0.4)}` }}>
          {cuenta}<span style={{ fontSize: 56, color: V.bone, marginLeft: 10 }}>sec</span>
        </div>
      ) : null}

      {/* ── LA MEMORIA DEL MOTOR ── */}
      {mode !== "find" ? (
        <div style={{ position: "absolute", right: 96, top: 230, width: 600, opacity: ease(0.05, 0.14) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px solid ${V.brass}`, paddingBottom: 10 }}>
            <div style={{ fontFamily: F_DISPLAY, fontSize: 34, letterSpacing: 3, color: V.brass }}>MOTOR MEMORY</div>
            <div style={{ fontFamily: F_DISPLAY, fontSize: 52, color: vivos === 0 && mode === "wipe" ? V.ok : V.white }}>{vivos}</div>
          </div>
          {slots.map((s, i) => {
            const a = filaIn(i), o = filaOut(i);
            const barrido = clamp01(o * 1.4);
            return (
              <div key={i} style={{
                position: "relative", marginTop: 14, height: 70, borderRadius: 10, overflow: "hidden",
                background: rgba(V.ink2, 0.92), border: `2px solid ${rgba(V.bone, 0.18)}`,
                opacity: a * (1 - clamp01((o - 0.6) / 0.4)), transform: `translateX(${(1 - a) * 60 + o * 30}px)`,
              }}>
                <div style={{ position: "absolute", left: 22, top: 17, width: 22, height: 36, borderRadius: 6, border: `3px solid ${V.bone}` }} />
                <div style={{ position: "absolute", left: 30, top: 23, width: 7, height: 7, borderRadius: 4, background: V.brass }} />
                <div style={{ position: "absolute", left: 66, top: 12, fontFamily: F_BODY, fontWeight: 600, fontSize: 34, color: V.white }}>{s.text}</div>
                {/* el borrado: una banda roja que barre la fila */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barrido * 100}%`, background: `linear-gradient(90deg, ${rgba(V.danger, 0.15)}, ${rgba(V.danger, 0.75)})` }} />
                <div style={{ position: "absolute", left: 60, right: 30, top: 34, height: 4, background: V.dangerSoft, transform: `scaleX(${barrido})`, transformOrigin: "left" }} />
              </div>
            );
          })}
          {mode === "wipe" ? (
            <div style={{
              marginTop: 26, display: "inline-block", padding: "12px 22px", border: `4px solid ${V.ok}`, borderRadius: 8,
              fontFamily: F_DISPLAY, fontSize: 46, letterSpacing: 2, color: V.ok, opacity: sello,
              transform: `scale(${interpolate(sello, [0, 1], [1.5, 1])}) rotate(-4deg)`,
            }}>MEMORY CLEARED</div>
          ) : null}
        </div>
      ) : null}

      <div style={{ position: "absolute", right: "4.5%", bottom: "6%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
