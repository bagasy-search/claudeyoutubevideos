// OleLedger — el libro de cuentas del cocinero (serie olworld: ol30min · ol30suppers · olsled).
// Libro abierto sobre la mesa a la luz del farol: cada cena se escribe a lápiz en su renglón (supper · plates · back then · today),
// el lápiz recorre el renglón que se está escribiendo y la página derecha suma el total con el visto del capataz.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SLAB, HAND, SERIF, hexA, paperBg, rnd } from "../olsup/OleSupTheme";
import { Bed, CL, easeOut, fadeOut, flicker, clipR } from "../olsup/OleBits";

export type LedgerRow = { item: string; plates?: string; then?: string; today?: string };

const Pencil: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <div style={{ position: "absolute", left: x - 8, top: y - 250, width: 26, height: 300, rotate: `${24 + Math.sin(f * 0.6) * 2}deg`, transformOrigin: "50% 100%" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 26, height: 236, background: "linear-gradient(90deg,#c9932f,#f2c14e 45%,#b9821f)", borderRadius: "4px 4px 0 0", boxShadow: "6px 10px 18px rgba(0,0,0,0.45)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 26, height: 30, background: "linear-gradient(90deg,#8d8d8d,#d8d8d8,#7a7a7a)", borderRadius: "4px 4px 0 0" }} />
    <div style={{ position: "absolute", left: 0, top: 236, width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderTop: "52px solid #e7c79a" }} />
    <div style={{ position: "absolute", left: 8, top: 272, width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "18px solid #2a2a2a" }} />
  </div>
);

export const OleLedger: React.FC<{
  title: string;
  rows: LedgerRow[];
  totalLabel?: string;
  totalThen?: string;
  totalToday?: string;
  note?: string;
  highlight?: number;
  bed?: string;
}> = ({ title, rows, totalLabel = "Total", totalThen, totalToday, note, highlight, bed }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const D = durationInFrames;
  const inP = interpolate(f, [0, 16], [0, 1], { ...CL, easing: easeOut });
  const out = fadeOut(f, D, 8);
  const R = rows.slice(0, 7);
  // reparto del tiempo: título 0-0,6 s · renglones hasta el 70 % · total y visto al final
  const t0 = Math.round(fps * 0.6), tRowsEnd = Math.max(t0 + R.length * 12, Math.round(D * 0.7));
  const per = (tRowsEnd - t0) / Math.max(1, R.length);
  const rowP = (i: number) => interpolate(f, [t0 + i * per, t0 + (i + 0.85) * per], [0, 100], CL);
  const totP = interpolate(f, [tRowsEnd, tRowsEnd + 16], [0, 100], CL);
  const stamp = interpolate(f, [tRowsEnd + 14, tRowsEnd + 24], [0, 1], { ...CL, easing: easeOut });
  // cámara: empuje lento hacia el renglón resaltado (o el último escrito)
  const focus = highlight ?? Math.min(R.length - 1, Math.floor((f - t0) / Math.max(1, per)));
  const LX = 210, LY = 300, ROWH = 74;
  const fy = LY + 170 + Math.max(0, focus) * ROWH;
  const z = 1.0 + 0.07 * interpolate(f, [0, D], [0, 1], CL);
  const glow = flicker(f, 3);
  // posición del lápiz: sobre el renglón que se está escribiendo
  const writing = R.findIndex((_, i) => rowP(i) > 0 && rowP(i) < 100);
  const pY = writing >= 0 ? LY + 170 + writing * ROWH + 40 : LY + 170 + R.length * ROWH + 60;
  const pX = writing >= 0 ? LX + 40 + (rowP(writing) / 100) * 640 : LX + 600 + (totP / 100) * 300;
  const pencilVis = interpolate(f, [t0 - 6, t0 + 4, tRowsEnd + 22, tRowsEnd + 32], [0, 1, 1, 0], CL);
  const col = (s?: string) => s ?? "";
  return (
    <AbsoluteFill style={{ opacity: out, backgroundColor: OLE.wood0 }}>
      <Bed src={bed} dim={0.42} blur={9} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 35%, rgba(255,185,95,${0.28 * glow}), transparent 62%)` }} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `50% ${(fy / 1080) * 100}%` }}>
        {/* el libro abierto */}
        <div style={{ position: "absolute", left: 150, top: 150 + (1 - inP) * 60, width: 1620, height: 860, rotate: "-2.2deg", opacity: inP, filter: "drop-shadow(26px 34px 40px rgba(0,0,0,0.6))" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 860, ...paperBg(OLE.paper), borderRadius: "14px 0 0 14px", boxShadow: "inset -40px 0 50px rgba(90,60,20,0.25)" }} />
          <div style={{ position: "absolute", left: 820, top: 0, width: 800, height: 860, ...paperBg(OLE.paperLight), borderRadius: "0 14px 14px 0", boxShadow: "inset 40px 0 50px rgba(90,60,20,0.22)" }} />
          <div style={{ position: "absolute", left: 790, top: -6, width: 40, height: 872, background: "linear-gradient(90deg, rgba(60,35,15,0.0), rgba(60,35,15,0.55), rgba(60,35,15,0.0))" }} />
          {/* margen rojo */}
          <div style={{ position: "absolute", left: 92, top: 0, width: 3, height: 860, background: hexA(OLE.plaid, 0.55) }} />
          <div style={{ position: "absolute", left: 912, top: 0, width: 3, height: 860, background: hexA(OLE.plaid, 0.55) }} />
          {/* título */}
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: SLAB, fontSize: 30, letterSpacing: 6, color: OLE.inkSoft }}>COOK'S LEDGER</div>
          <div style={{ position: "absolute", left: 60, top: 80, width: 720, fontFamily: HAND, fontWeight: 700, fontSize: 64, lineHeight: "72px", color: OLE.ink, whiteSpace: "nowrap", clipPath: clipR(interpolate(f, [4, t0 + 6], [0, 100], CL)) }}>{title}</div>
          {/* encabezados de columnas */}
          <div style={{ position: "absolute", left: 110, top: 176, fontFamily: SLAB, fontSize: 24, letterSpacing: 3, color: OLE.inkSoft }}>SUPPER</div>
          <div style={{ position: "absolute", left: 470, top: 176, fontFamily: SLAB, fontSize: 24, letterSpacing: 3, color: OLE.inkSoft }}>PLATES</div>
          <div style={{ position: "absolute", left: 590, top: 176, fontFamily: SLAB, fontSize: 24, letterSpacing: 3, color: OLE.inkSoft }}>THEN</div>
          <div style={{ position: "absolute", left: 690, top: 176, fontFamily: SLAB, fontSize: 24, letterSpacing: 3, color: OLE.plaid }}>TODAY</div>
          {R.map((r, i) => {
            const p = rowP(i);
            const hi = highlight === i && p >= 99;
            return (
              <div key={i} style={{ position: "absolute", left: 104, top: 214 + i * ROWH, width: 690, height: ROWH, clipPath: clipR(p) }}>
                {hi ? <div style={{ position: "absolute", left: -14, top: 6, width: 700, height: ROWH - 10, borderRadius: 30, border: `4px solid ${hexA(OLE.plaid, 0.75)}`, rotate: "-0.8deg" }} /> : null}
                <div style={{ position: "absolute", left: 0, top: 6, width: 360, fontFamily: HAND, fontWeight: 600, fontSize: 46, lineHeight: "56px", color: OLE.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "clip" }}>{r.item}</div>
                <div style={{ position: "absolute", left: 370, top: 6, width: 100, fontFamily: HAND, fontWeight: 600, fontSize: 46, lineHeight: "56px", color: OLE.ink, textAlign: "center" }}>{col(r.plates)}</div>
                <div style={{ position: "absolute", left: 478, top: 6, width: 100, fontFamily: HAND, fontWeight: 600, fontSize: 46, lineHeight: "56px", color: OLE.inkSoft, textAlign: "center" }}>{col(r.then)}</div>
                <div style={{ position: "absolute", left: 578, top: 6, width: 112, fontFamily: HAND, fontWeight: 700, fontSize: 48, lineHeight: "56px", color: OLE.plaid, textAlign: "center" }}>{col(r.today)}</div>
              </div>
            );
          })}
          {/* página derecha: total + visto del capataz + nota */}
          <div style={{ position: "absolute", left: 960, top: 70, fontFamily: SLAB, fontSize: 30, letterSpacing: 6, color: OLE.inkSoft }}>{totalLabel.toUpperCase()}</div>
          {totalThen || totalToday ? (
            <div style={{ position: "absolute", left: 960, top: 130, width: 600, clipPath: clipR(totP) }}>
              {totalThen ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: OLE.inkSoft }}>back then: <span style={{ fontSize: 76, color: OLE.ink }}>{totalThen}</span></div> : null}
              {totalToday ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: OLE.inkSoft, marginTop: 10 }}>today: <span style={{ fontSize: 96, color: OLE.plaid, textDecoration: "underline", textDecorationThickness: 5, textUnderlineOffset: 10 }}>{totalToday}</span></div> : null}
            </div>
          ) : null}
          {note ? <div style={{ position: "absolute", left: 960, top: 470, width: 600, fontFamily: HAND, fontWeight: 600, fontSize: 50, lineHeight: "62px", color: OLE.ink, rotate: "-1.5deg", clipPath: clipR(interpolate(f, [tRowsEnd + 6, tRowsEnd + 30], [0, 100], CL)) }}>{note}</div> : null}
          <div style={{ position: "absolute", left: 1300, top: 690, rotate: "-9deg", scale: String(0.5 + 0.5 * stamp), opacity: stamp * 0.9, border: `6px solid ${hexA(OLE.enamel, 0.85)}`, borderRadius: 12, padding: "4px 18px", fontFamily: SLAB, fontSize: 34, color: hexA(OLE.enamel, 0.9), textAlign: "center", lineHeight: 1.15 }}>CHECKED<br />SATURDAY</div>
          {/* clavo y cordel del libro */}
          <div style={{ position: "absolute", left: 802, top: -52, width: 16, height: 16, borderRadius: 8, background: "radial-gradient(circle at 35% 35%, #9a948c, #2c2a27)" }} />
        </div>
        <div style={{ opacity: pencilVis }}>
          <Pencil x={150 + pX} y={150 + pY} f={f} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(10,5,2,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

// semilla estable para variar la inclinación entre usos (no Math.random)
export const ledgerSeed = (s: string) => rnd(s.length * 97 + s.charCodeAt(0));
