// marcelloen01 · CTA = LA GUÍA EN 3D DENTRO DEL MUNDO: el libro está sobre la mesa de la nonna → la cámara se acerca →
// la tapa se abre y se ve una página REAL ("page 23 · Pasta e Fagioli for one"). Sin cortar el video.
// PARAMETRIZADO: el canal todavía no tiene guía → nombre provisorio genérico, SIN URL y SIN precio.
// Cuando exista: pasar name / url / page y la 1ª línea de la descripción deja de ser «[CTA: link de la guía]».
// ⛔ Nunca PDF gratis ni lead magnet.
import React from "react";
import { FONT, SERIF, COL, e, ei, spr, extrude } from "./lib";

export type GuideProps = {
  t: number;
  at: number;            // segundo en que la cámara empieza a ir al libro (anclar con at("frase"))
  out: number;           // segundo en que se cierra y el mundo sigue
  x: number; y: number;  // punto de pantalla del libro sobre la mesa (screenOf del mundo)
  name?: string;         // nombre de la guía (provisorio mientras no exista)
  sub?: string;
  url?: string;          // vacío = no se muestra nada de link
  page?: number;         // página que se abre
  pageTitle?: string;
  pageLines?: string[];
};

export const GUIDE_DEFAULT = {
  name: "One-Pot Dinners for One",
  sub: "NONNA'S KITCHEN NOTEBOOK",
  page: 23,
  pageTitle: "Pasta e Fagioli — for one",
  pageLines: ["½ cup dry borlotti beans, soaked", "1 parmesan rind (the old trick)", "⅓ cup ditalini, cooked IN the beans", "1 clove garlic · rosemary · olive oil", "≈ $1.40 a plate"],
};

export const GuideCTA: React.FC<GuideProps> = (p) => {
  const { t, at: a, out, x, y } = p;
  const name = p.name ?? GUIDE_DEFAULT.name, sub = p.sub ?? GUIDE_DEFAULT.sub, page = p.page ?? GUIDE_DEFAULT.page;
  const pageTitle = p.pageTitle ?? GUIDE_DEFAULT.pageTitle, lines = p.pageLines ?? GUIDE_DEFAULT.pageLines;
  const o = e(t, a - 0.2, a + 0.1) * (1 - e(t, out - 0.3, out));
  if (o < 0.01) return null;
  // 1) el libro "aterriza" en la mesa, 2) zoom: viene al centro y crece, 3) la tapa gira y aparece la página
  const land = Math.min(1.06, spr(t, a, 0.8));
  const zoom = ei(t, a + 0.7, a + 1.6);
  const open = ei(t, a + 1.5, a + 2.3);
  const cx = x + (960 - x) * zoom, cy = y + (560 - y) * zoom;
  const sc = (0.38 + 0.62 * zoom) * (0.7 + 0.3 * land);
  const BW = 520, BH = 700;
  const typed = (s: string, st: number) => s.slice(0, Math.round(s.length * e(t, st, st + 0.6)));
  return (
    <div style={{ position: "absolute", left: cx, top: cy, opacity: o, transform: `translate(-50%,-50%) scale(${sc})`, perspective: 2200 }}>
      <div style={{ width: BW * 2, height: BH, position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${(1 - zoom) * 52 + 6}deg) rotateZ(${(1 - zoom) * -8}deg)` }}>
        {/* página derecha (la receta real) */}
        <div style={{ position: "absolute", left: BW, top: 0, width: BW, height: BH, background: "linear-gradient(90deg,#e9dcc0,#f8eedb 12%,#f6ead2)", borderRadius: "0 10px 10px 0", boxShadow: "0 50px 90px rgba(0,0,0,.6)", padding: "56px 50px", boxSizing: "border-box", fontFamily: SERIF, color: "#3a2414" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 6, color: "#9a6a3a" }}>PAGE {page}</div>
          <div style={{ fontStyle: "italic", fontWeight: 900, fontSize: 52, lineHeight: 1.05, marginTop: 10 }}>{typed(pageTitle, a + 2.2)}</div>
          <div style={{ height: 2, background: "#c9a676", margin: "22px 0" }} />
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, lineHeight: 1.65, color: i === lines.length - 1 ? COL.tomato : "#4a2f1c", opacity: e(t, a + 2.5 + i * 0.25, a + 2.8 + i * 0.25) }}>• {l}</div>
          ))}
          <div style={{ position: "absolute", right: 46, bottom: 40, fontStyle: "italic", fontSize: 30, color: "#8a5a32", opacity: e(t, a + 3.6, a + 4) }}>— Nonna Rosa</div>
        </div>
        {/* tapa: gira sobre el lomo (izquierda de la página) y queda como página izquierda */}
        <div style={{ position: "absolute", left: BW, top: 0, width: BW, height: BH, transformOrigin: "0 50%", transformStyle: "preserve-3d", transform: `rotateY(${-178 * open}deg)` }}>
          {/* frente de la tapa */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "0 12px 12px 0", background: "linear-gradient(135deg,#7a2e1c,#4a1a10)", border: "4px solid #c9a14a", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, boxShadow: "inset 0 0 60px rgba(0,0,0,.45)" } as React.CSSProperties}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 7, color: COL.gold }}>{sub}</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 76, lineHeight: 1.02, color: COL.ink, marginTop: 20, textShadow: extrude(5, "#1d0703") }}>{name}</div>
            <div style={{ width: 160, height: 3, background: COL.gold, marginTop: 26 }} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: "rgba(251,243,228,.8)", marginTop: 18 }}>MARCELLO</div>
          </div>
          {/* dorso de la tapa = página izquierda (guardas) */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "10px 0 0 10px", background: "linear-gradient(270deg,#e2d3b4,#f3e6cc 14%,#efe1c4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: "#8a5a32", padding: 50, textAlign: "center" } as React.CSSProperties}>
            “Ten dinners, one pot, one person.”
          </div>
        </div>
      </div>
      {/* link sólo si existe la guía (nunca se inventa) */}
      {p.url && (
        <div style={{ position: "absolute", left: "50%", top: BH + 40, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.ink, background: "rgba(40,20,8,.9)", borderLeft: `8px solid ${COL.terra}`, padding: "14px 30px", borderRadius: 10, whiteSpace: "nowrap", opacity: e(t, a + 2.6, a + 3) }}>
          LINK IN THE DESCRIPTION · {p.url}
        </div>
      )}
    </div>
  );
};
