// TfbXRay — corte de RAYOS X animado de un inodoro (vista lateral, frame a frame con SVG): el cuerpo de loza se dibuja,
// el agua baja por el sifón en la descarga, la costra de sarro CRECE capa por capa dentro del paso y lo estrecha, los
// agujeritos del borde se tapan, y un resaltador marca la parte de la que se habla ("linea" | "borde" | "sifon" | "escalon").
// Todo con props de tiempo (cuadros relativos a la Sequence). `children` = footage de fondo (se desenfoca y oscurece).
// Etiquetas ≤3 palabras (props), sin texto quemado. Reusable para cualquier video de plomería del canal.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TFB, F_DISPLAY, F_SANS, EASE_IN, EASE_IO, clamp } from "./theme";

export type XRayFocus = "none" | "linea" | "borde" | "sifon" | "escalon";
export type TfbXRayProps = {
  children?: React.ReactNode;
  crustFrom?: number; crustTo?: number; crustMax?: number; // crecimiento de la costra (0-1 = fracción del paso tapado)
  crust0?: number;                                          // costra inicial
  flushAt?: number | null;                                  // cuadro en que descarga (agua baja y corre por el sifón)
  flushWeak?: boolean;                                      // descarga floja (poco caudal, se nota el estrechamiento)
  jetsBlocked?: number[];                                   // índices de agujeritos del borde tapados (0-9)
  focus?: XRayFocus; focusAt?: number;
  labels?: Partial<Record<Exclude<XRayFocus, "none">, string>>;
  title?: string;                                           // rótulo arriba (≤4 palabras)
  exitAt?: number;
};

const CL = "M 862 604 C 812 648 748 612 730 548 C 716 496 690 452 648 466 C 604 482 596 566 606 652 C 616 742 694 820 716 912";
const BODY = "M 560 300 L 1330 300 Q 1392 302 1380 360 C 1360 520 1262 640 1128 694 L 1096 706 L 1080 862 L 1124 912 L 640 912 L 668 862 L 636 700 C 572 640 548 520 560 300 Z";
const BOWL = "M 700 332 L 1302 332 C 1302 452 1232 562 1102 612 C 1022 642 960 642 912 622 C 820 586 722 466 700 332 Z";
const WATER_Y = 470;
const JETS = [760, 830, 900, 970, 1040, 1110, 1180, 1250];

export const TfbXRay: React.FC<TfbXRayProps> = ({ children, crustFrom = 20, crustTo = 110, crustMax = 0.55, crust0 = 0, flushAt = null, flushWeak = false,
  jetsBlocked = [], focus = "none", focusAt = 30, labels = {}, title, exitAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  const exit = exitAt == null ? 0 : interpolate(f, [exitAt - 10, exitAt], [0, 1], { ...clamp, easing: EASE_IO });
  const draw = interpolate(f, [0, 22], [0, 1], { ...clamp, easing: EASE_IO });
  const crust = crust0 + (crustMax - crust0) * interpolate(f, [crustFrom, crustTo], [0, 1], { ...clamp, easing: EASE_IO });
  const CH = 84, open = CH * (1 - crust);
  // descarga: el nivel baja y vuelve; el agua corre por el paso abierto
  const fl = flushAt == null ? -1 : f - flushAt;
  const flow = fl < 0 ? 0 : interpolate(fl, [0, 10, 60, 90], [0, 1, 1, 0], clamp) * (flushWeak ? 0.45 : 1);
  const level = WATER_Y + (fl < 0 ? 0 : interpolate(fl, [0, 30, 70, 110], [0, flushWeak ? 55 : 120, flushWeak ? 55 : 120, 0], { ...clamp, easing: EASE_IO }));
  const dash = -f * (flushWeak ? 5 : 11);
  const fa = interpolate(f, [focusAt, focusAt + 12], [0, 1], { ...clamp, easing: EASE_IN });
  const pulse = 1 + Math.sin((f - focusAt) / 5) * 0.06;
  const FOC: Record<Exclude<XRayFocus, "none">, { x: number; y: number; r: number; lx: number; ly: number }> = {
    linea: { x: 1268, y: WATER_Y, r: 70, lx: 1500, ly: 420 },
    borde: { x: 1010, y: 350, r: 90, lx: 1500, ly: 250 },
    sifon: { x: 690, y: 520, r: 120, lx: 300, ly: 380 },
    escalon: { x: 604, y: 640, r: 64, lx: 290, ly: 700 },
  };
  const M = (x: number, y: number) => ({ x: 990 + 1.22 * (x - 960), y: 560 + 1.22 * (y - 610) }); // mismo transform que el dibujo
  const f0 = focus !== "none" ? FOC[focus] : null;
  const fo = f0 ? { ...f0, ...M(f0.x, f0.y), r: f0.r * 1.22 } : null;
  const lab = fo ? labels[focus as Exclude<XRayFocus, "none">] : undefined;
  const o = enter * (1 - exit);
  const layers = [0.0, 0.35, 0.7, 1.0];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {children && <AbsoluteFill style={{ filter: "blur(14px) brightness(0.45) saturate(0.7)", transform: "scale(1.08)" }}>{children}</AbsoluteFill>}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(12,26,40,0.55), rgba(4,8,14,0.88))" }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${0.94 + 0.06 * enter})` }}>
        <defs>
          <pattern id="xg" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(120,190,255,0.10)" strokeWidth="1.5" /></pattern>
          <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="9" /></filter>
          <clipPath id="bowl"><path d={BOWL} /></clipPath>
          <linearGradient id="loza" x1="0" x2="1"><stop offset="0" stopColor={TFB.porcelainShade} /><stop offset="0.6" stopColor={TFB.porcelain} /><stop offset="1" stopColor={TFB.porcelainShade} /></linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#xg)" />
        <g transform="translate(990 560) scale(1.22) translate(-960 -610)">
        {/* cuerpo de loza */}
        <path d={BODY} fill="url(#loza)" opacity={draw} />
        <path d={BODY} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={4200} strokeDashoffset={4200 * (1 - draw)} />
        {/* taza: hueco + agua */}
        <path d={BOWL} fill="#2a3440" opacity={draw} />
        <g clipPath="url(#bowl)" opacity={draw}>
          <rect x={600} y={level} width={800} height={400} fill={TFB.water} opacity={0.85} />
          <rect x={600} y={level} width={800} height={6} fill="#bfe6ff" />
        </g>
        {/* la línea amarilla: sarro en el nivel del agua, crece con la costra */}
        <g filter="url(#rough)" opacity={draw}>
          <path d={`M 1255 ${WATER_Y - 6 - 30 * crust} Q 1276 ${WATER_Y} 1262 ${WATER_Y + 12}`} stroke={TFB.crust} strokeWidth={10 + 26 * crust} fill="none" strokeLinecap="round" />
          <path d={`M 748 ${WATER_Y - 4 - 30 * crust} Q 730 ${WATER_Y} 744 ${WATER_Y + 12}`} stroke={TFB.crust} strokeWidth={10 + 26 * crust} fill="none" strokeLinecap="round" />
        </g>
        {/* borde hueco + agujeritos */}
        <path d="M 700 318 L 1310 318" stroke="#2a3440" strokeWidth={22} strokeLinecap="round" opacity={draw} />
        {JETS.map((x, i) => {
          const blocked = jetsBlocked.includes(i);
          const drop = !blocked && flow > 0 ? ((f * 9 + i * 23) % 120) : -1;
          return (
            <g key={i} opacity={draw}>
              <circle cx={x} cy={334} r={9} fill={blocked ? TFB.crust : "#0b1118"} stroke={blocked ? TFB.crustDark : "#9fb6c8"} strokeWidth={3} />
              {drop >= 0 && <ellipse cx={x + (x > 1000 ? 1 : -1) * drop * 0.25} cy={344 + drop} rx={5} ry={9} fill={TFB.water} opacity={1 - drop / 120} />}
            </g>
          );
        })}
        {/* sifón: capas de costra (anillos) + paso abierto + agua corriendo */}
        <g opacity={draw}>
          <path d={CL} stroke={TFB.porcelainShade} strokeWidth={CH + 26} fill="none" strokeLinecap="round" />
          {layers.map((l, i) => (
            <path key={i} d={CL} filter="url(#rough)" stroke={[TFB.crustDark, TFB.crust, TFB.crustLight, TFB.crust][i]} strokeWidth={CH - (CH - open) * l} fill="none" strokeLinecap="round" opacity={crust > 0.01 ? 1 : 0} />
          ))}
          <path d={CL} stroke="#1b2530" strokeWidth={open} fill="none" strokeLinecap="round" />
          {flow > 0 && <path d={CL} stroke={TFB.water} strokeWidth={open * 0.8} fill="none" strokeLinecap="round" strokeDasharray="38 26" strokeDashoffset={dash} opacity={flow} />}
          {focus === "escalon" && <path d="M 578 620 L 640 628 L 606 668 Z" fill={TFB.crustDark} stroke={TFB.red} strokeWidth={4} filter="url(#rough)" opacity={fa} />}
        </g>
        </g>
        {/* resaltador */}
        {fo && (
          <g opacity={fa}>
            <circle cx={fo.x} cy={fo.y} r={fo.r * pulse} fill="none" stroke={TFB.yellow} strokeWidth={9} />
            <line x1={fo.x + (fo.lx > fo.x ? fo.r : -fo.r)} y1={fo.y} x2={fo.lx} y2={fo.ly} stroke={TFB.yellow} strokeWidth={5} strokeDasharray={600} strokeDashoffset={600 * (1 - fa)} />
          </g>
        )}
      </svg>
      {fo && lab && (
        <div style={{ position: "absolute", left: fo.lx > 960 ? fo.lx : fo.lx - 420, top: fo.ly - 44, width: 420, textAlign: fo.lx > 960 ? "left" : "right", opacity: fa, transform: `translateY(${(1 - fa) * 16}px)` }}>
          <span style={{ fontFamily: F_DISPLAY, fontSize: 64, color: TFB.ink, background: TFB.yellow, padding: "2px 18px 6px", borderRadius: 8, boxShadow: TFB.shadow, whiteSpace: "nowrap" }}>{lab}</span>
        </div>
      )}
      {title && (
        <div style={{ position: "absolute", left: 90, top: 70, fontFamily: F_SANS, fontWeight: 800, fontSize: 46, letterSpacing: 6, color: "#cfe8ff", opacity: draw, textTransform: "uppercase" }}>
          <span style={{ color: TFB.yellow }}>●</span> {title}
        </div>
      )}
    </AbsoluteFill>
  );
};
