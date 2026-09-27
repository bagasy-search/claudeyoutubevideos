// TfbMark — anotaciones "a marcador" que se TRAZAN sobre el footage: círculo imperfecto, flecha curva, subrayado,
// tachado (cruz) y etiqueta manuscrita. Cada ítem tiene su propio arranque (cuadro relativo a la pieza).
// Coordenadas en % del cuadro. Pensado para señalar la grieta, el símbolo, el agujerito, el borde del parche…
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_HAND, lin, outline, roughEllipse } from "./theme";

export type MarkItem = {
  kind: "circle" | "arrow" | "underline" | "cross" | "label";
  x: number; y: number; w?: number; h?: number;   // centro (circle/cross/label), inicio (arrow/underline)
  x2?: number; y2?: number;                        // fin (arrow/underline)
  from?: number; color?: string; width?: number; text?: string; size?: number; rot?: number; seed?: number;
};

export const TfbMark: React.FC<{ dur: number; items: MarkItem[] }> = ({ dur, items }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const out = lin(f, [dur - 8, dur], [1, 0], EIO);
  const X = (p: number) => (p / 100) * W, Y = (p: number) => (p / 100) * H;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {items.filter((it) => it.kind !== "label").map((it, i) => {
          const t0 = it.from ?? 0, p = lin(f, [t0, t0 + (it.kind === "circle" ? 14 : 10)], [0, 1], EO);
          if (p <= 0) return null;
          const col = it.color ?? C.red, sw = it.width ?? 12;
          let d = "", head = null as null | string;
          if (it.kind === "circle") d = roughEllipse(X(it.x), Y(it.y), ((it.w ?? 12) / 100) * W / 2, ((it.h ?? 12) / 100) * H / 2, it.seed ?? i + 1);
          else if (it.kind === "underline") { const x1 = X(it.x), x2 = X(it.x2 ?? it.x + 20), y = Y(it.y); d = `M ${x1} ${y} C ${x1 + (x2 - x1) * 0.3} ${y + 6}, ${x1 + (x2 - x1) * 0.7} ${y - 8}, ${x2} ${y + 2}`; }
          else if (it.kind === "cross") { const cx = X(it.x), cy = Y(it.y), rx = ((it.w ?? 10) / 100) * W / 2, ry = ((it.h ?? 10) / 100) * H / 2; d = `M ${cx - rx} ${cy - ry} L ${cx + rx} ${cy + ry} M ${cx + rx} ${cy - ry} L ${cx - rx} ${cy + ry}`; }
          else if (it.kind === "arrow") {
            const x1 = X(it.x), y1 = Y(it.y), x2 = X(it.x2 ?? it.x + 10), y2 = Y(it.y2 ?? it.y + 10);
            const mx = (x1 + x2) / 2 + (y2 - y1) * 0.22, my = (y1 + y2) / 2 - (x2 - x1) * 0.22;
            d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
            const a = Math.atan2(y2 - my, x2 - mx), k = 34;
            head = `M ${x2 + Math.cos(a + 2.6) * k} ${y2 + Math.sin(a + 2.6) * k} L ${x2} ${y2} L ${x2 + Math.cos(a - 2.6) * k} ${y2 + Math.sin(a - 2.6) * k}`;
          }
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth={sw + 8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} transform="translate(3 5)" />
              <path d={d} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
              {head && p > 0.9 ? <path d={head} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /> : null}
            </g>
          );
        })}
      </svg>
      {items.filter((it) => it.kind === "label").map((it, i) => {
        const t0 = it.from ?? 0, p = lin(f, [t0, t0 + 9], [0, 1], EO);
        const chars = Math.round((it.text ?? "").length * lin(f, [t0, t0 + 14], [0, 1]));
        return p <= 0 ? null : (
          <div key={"l" + i} style={{ position: "absolute", left: X(it.x), top: Y(it.y), transform: `translate(-50%,-50%) rotate(${it.rot ?? -4}deg) scale(${0.9 + 0.1 * p})`,
            fontFamily: F_HAND, fontWeight: 700, fontSize: it.size ?? 76, color: it.color ?? C.yellow, whiteSpace: "nowrap", textShadow: outline(4), opacity: p }}>
            {(it.text ?? "").slice(0, chars)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
