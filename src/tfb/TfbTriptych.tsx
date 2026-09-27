// TfbTriptych — la gramática de la miniatura del canal hecha movimiento: tres paneles verticales (problema → arreglo →
// resultado) que caen uno tras otro con un leve Ken-Burns propio; en el 2º se traza un CÍRCULO ROJO sobre el parche y
// en el 3º una FLECHA ROJA señala el resultado. Sin texto (como las miniaturas); `labels` opcional.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_DISPLAY, lin, outline, pop, roughEllipse } from "./theme";

export type Panel = { src: string; kind?: "image" | "video"; startFrom?: number; focusX?: number; focusY?: number; mark?: "circle" | "arrow"; mx?: number; my?: number; label?: string };

export const TfbTriptych: React.FC<{ dur: number; panels: Panel[]; stagger?: number }> = ({ dur, panels, stagger = 9 }) => {
  const f = useCurrentFrame(); const { fps, width: W, height: H } = useVideoConfig();
  const out = lin(f, [dur - 8, dur], [1, 0], EIO);
  const pw = W / panels.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b", opacity: out, flexDirection: "row" }}>
      {panels.map((p, i) => {
        const t0 = i * stagger, s = pop(f, fps, t0, 170, 16), z = 1.08 + lin(f, [t0, dur], [0, 0.07]);
        const mk = lin(f, [t0 + 12, t0 + 26], [0, 1], EO);
        const mx = ((p.mx ?? 50) / 100) * pw, my = ((p.my ?? 50) / 100) * H;
        const media = p.kind === "video"
          ? <OffthreadVideo src={staticFile(p.src)} startFrom={p.startFrom ?? 0} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${p.focusX ?? 50}% ${p.focusY ?? 50}%` }} />
          : <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${p.focusX ?? 50}% ${p.focusY ?? 50}%` }} />;
        return (
          <div key={i} style={{ position: "relative", width: pw, height: H, overflow: "hidden", transform: `translateY(${(1 - Math.max(0, s)) * -H * 0.6}px)`, opacity: Math.min(1, Math.max(0, s) * 1.4),
            borderLeft: i ? `8px solid ${C.white}` : undefined }}>
            <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${p.focusX ?? 50}% ${p.focusY ?? 50}%` }}>{media}</div>
            <svg width={pw} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              {p.mark === "circle" ? <path d={roughEllipse(mx, my, pw * 0.3, H * 0.2, i + 3)} fill="none" stroke={C.red} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${mk} 1`} /> : null}
              {p.mark === "arrow" ? (() => {
                const x2 = mx, y2 = my, x1 = x2 + pw * 0.28, y1 = y2 - H * 0.2, a = Math.atan2(y2 - y1, x2 - x1);
                const d = `M ${x1} ${y1} Q ${x1 - 20} ${y2 - 10} ${x2 + Math.cos(a) * -30} ${y2 + Math.sin(a) * -30}`;
                return <g opacity={mk > 0 ? 1 : 0}>
                  <path d={d} fill="none" stroke={C.red} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={`${mk} 1`} />
                  {mk > 0.9 ? <path d={`M ${x2} ${y2} l ${Math.cos(a + 2.6) * 60} ${Math.sin(a + 2.6) * 60} l ${Math.cos(a - 2.6) * 60 - Math.cos(a + 2.6) * 60} ${Math.sin(a - 2.6) * 60 - Math.sin(a + 2.6) * 60} Z`} fill={C.red} /> : null}
                </g>;
              })() : null}
            </svg>
            {p.label ? <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", fontFamily: F_DISPLAY, fontSize: 64, color: C.white, textShadow: outline(5), opacity: mk }}>{p.label}</div> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
