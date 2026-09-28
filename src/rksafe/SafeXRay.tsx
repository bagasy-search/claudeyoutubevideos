// SafeXRay.tsx — RAYOS X de una caja fuerte barata de keypad (canal Ray Kessler · rkhanger).
// El cuerpo se DIBUJA trazo a trazo, un barrido de escáner lo atraviesa, los pernos salen de la
// puerta y una CÁMARA VIRTUAL entra al punto débil: el solenoide (pin + resorte) o la rendija.
// ⛔ Encuadre DEFENSIVO: muestra POR QUÉ es débil (dónde está la pieza chica y que hay un camino),
//    NUNCA cómo meter un alambre. No hay alambre dibujado.
// Staggers RELATIVOS a la duración (p = frame / dur), nunca cuadros fijos.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, PhotoBed, Keyring, clamp01 } from "./RayStage";

const ez = Easing.bezier(0.33, 0, 0.2, 1);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const SafeXRay: React.FC<{
  kicker?: string;
  title?: string;
  labels?: { text: string }[];
  focus?: "solenoid" | "gap";
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "X-RAY · CHEAP KEYPAD SAFE",
  title = "What actually holds the door",
  labels = [{ text: "Steel bolts" }, { text: "A tiny solenoid" }, { text: "One small spring" }],
  focus = "solenoid",
  bed,
  durationInFrames = 180,
}) => {
  const f = useCurrentFrame();
  const dur = Math.max(60, durationInFrames);
  const p = f / dur;

  // trazo a trazo
  const draw = ez(seg(p, 0.02, 0.26));
  const bolts = ez(seg(p, 0.18, 0.34));
  const scan = seg(p, 0.05, 0.55);
  // cámara virtual: entra al punto débil y sale un poco al final
  const tgt = focus === "gap" ? { x: 1180, y: 250 } : { x: 900, y: 430 };
  const zin = ez(seg(p, 0.36, 0.6));
  const zout = ez(seg(p, 0.86, 1.0));
  const z = 1 + 0.55 * zin - 0.25 * zout;
  const cx = 800 + (tgt.x - 800) * (zin - 0.45 * zout);
  const cy = 450 + (tgt.y - 450) * (zin - 0.45 * zout);
  const hot = seg(p, 0.46, 0.56);
  const pulse = 0.55 + 0.45 * Math.sin(f / 4.5);
  const pin = focus === "solenoid" ? Math.sin(Math.max(0, p - 0.5) * 60) * 6 * hot : 0;
  const L = (d: number) => ({ strokeDasharray: d, strokeDashoffset: d * (1 - draw) });
  const aHead = ez(seg(p, 0.0, 0.12));
  const la = (i: number) => ez(seg(p, 0.3 + i * 0.16, 0.38 + i * 0.16));

  const brass = V.brass, red = V.danger;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.82} />
      {/* retícula azul-negra de placa de rayos X */}
      <AbsoluteFill style={{ opacity: 0.18, backgroundImage: `linear-gradient(${rgba(brass, 0.25)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(brass, 0.25)} 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: `${(cx / 16).toFixed(2)}% ${(cy / 9).toFixed(2)}%` }}>
        <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="xrScan" x1="0" x2="1">
              <stop offset="0" stopColor={brass} stopOpacity="0" />
              <stop offset="0.5" stopColor={V.brassSoft} stopOpacity="0.55" />
              <stop offset="1" stopColor={brass} stopOpacity="0" />
            </linearGradient>
            <filter id="xrGlow"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>
          {/* cuerpo */}
          <rect x="440" y="170" width="720" height="560" rx="18" fill={rgba(V.steel, 0.07)} stroke={brass} strokeWidth="5" {...L(2600)} />
          {/* puerta (frente) */}
          <rect x="480" y="205" width="640" height="490" rx="10" fill="none" stroke={rgba(brass, 0.8)} strokeWidth="3" {...L(2300)} />
          {/* keypad */}
          <g opacity={draw}>
            <rect x="560" y="300" width="170" height="210" rx="10" fill="none" stroke={V.bone} strokeWidth="3" />
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={582 + (i % 3) * 48} y={322 + Math.floor(i / 3) * 44} width="34" height="30" rx="5" fill={rgba(V.bone, 0.18)} stroke={rgba(V.bone, 0.6)} strokeWidth="1.5" />
            ))}
            <circle cx="645" cy="580" r="44" fill="none" stroke={V.bone} strokeWidth="3" />
          </g>
          {/* cable del keypad al solenoide */}
          <path d="M730 400 C 800 400, 820 430, 860 430" fill="none" stroke={rgba(V.bone, 0.7)} strokeWidth="3" strokeDasharray="220" strokeDashoffset={220 * (1 - draw)} />
          {/* barra de pernos */}
          <rect x="930" y="300" width="36" height="300" rx="6" fill={rgba(V.steel, 0.35)} stroke={V.steel} strokeWidth="3" opacity={draw} />
          {[340, 450, 560].map((y, i) => (
            <rect key={y} x={950 + 120 * bolts} y={y - 16} width="190" height="32" rx="16"
              fill={rgba(V.steel, 0.55)} stroke={V.white} strokeWidth="2.5" opacity={clamp01(bolts * 3 - i * 0.4)} />
          ))}
          {/* SOLENOIDE: bobina + pin + resorte */}
          <g transform={`translate(0, ${pin.toFixed(2)})`}>
            <rect x="860" y="405" width="62" height="50" rx="8" fill={rgba(focus === "solenoid" ? red : brass, 0.25 + 0.35 * hot * pulse)} stroke={focus === "solenoid" ? (hot > 0 ? red : brass) : brass} strokeWidth="3" opacity={draw} />
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={i} x1={866 + i * 9} y1="408" x2={866 + i * 9} y2="452" stroke={rgba(V.bone, 0.55)} strokeWidth="2" opacity={draw} />
            ))}
            <rect x="922" y="424" width="30" height="12" rx="4" fill={V.white} opacity={draw} />
            <path d="M 860 430 l -8 -10 l -8 20 l -8 -20 l -8 20 l -8 -20 l -8 10" fill="none" stroke={focus === "solenoid" && hot > 0 ? red : V.bone} strokeWidth="3" opacity={draw} />
          </g>
          {focus === "solenoid" && hot > 0 ? (
            <circle cx="880" cy="430" r={70 + 10 * pulse} fill="none" stroke={red} strokeWidth="4" opacity={hot * 0.9} filter="url(#xrGlow)" />
          ) : null}
          {/* RENDIJA en el canto de la puerta */}
          {focus === "gap" ? (
            <g opacity={hot}>
              <line x1="1122" y1="210" x2="1122" y2="690" stroke={red} strokeWidth="5" strokeDasharray="18 12" strokeDashoffset={-f * 2} />
              <path d="M1250 250 L 1135 250" stroke={red} strokeWidth="4" markerEnd="" />
              <circle cx="1122" cy="250" r={30 + 8 * pulse} fill="none" stroke={red} strokeWidth="4" filter="url(#xrGlow)" />
            </g>
          ) : null}
          {/* barrido del escáner */}
          <rect x={300 + 1000 * scan - 60} y="140" width="120" height="620" fill="url(#xrScan)" opacity={scan > 0 && scan < 1 ? 0.8 : 0} />
        </svg>
      </AbsoluteFill>

      {/* titular */}
      <div style={{ position: "absolute", left: "5%", top: "7%", opacity: aHead, transform: `translateY(${((1 - aHead) * 14).toFixed(1)}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, color: brass }}>{kicker}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, color: V.white, textShadow: "0 6px 30px rgba(0,0,0,0.92)" }}>{title}</div>
      </div>
      {/* etiquetas, escalonadas por fracción de la duración */}
      <div style={{ position: "absolute", right: "5%", bottom: "9%", display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end" }}>
        {labels.slice(0, 3).map((l, i) => {
          const a = la(i);
          const alert = i === labels.length - 1 || (focus === "gap" && i === 2);
          return (
            <div key={i} style={{ opacity: a, transform: `translateX(${((1 - a) * 40).toFixed(1)}px)`, padding: "10px 20px", background: rgba(V.ink0, 0.8), borderRight: `5px solid ${alert ? red : brass}`, borderRadius: 3 }}>
              <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 34, color: alert ? V.dangerSoft : V.white }}>{l.text}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: "5%", bottom: "7%", opacity: 0.85 * aHead }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
