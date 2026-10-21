// ortega01 · CTA de la GUÍA (parametrizada: el canal todavía no tiene producto). La guía está sobre la mesa → zoom →
// la tapa gira sobre el lomo, pasa una hoja y queda abierta en la página `pagina`; abajo flota la tarjeta de la descripción
// con el nombre de la guía. ⛔ NUNCA un link ni URL en pantalla: el link va SÓLO en la descripción (1ª línea).
// Cuando haya PDF real: `tapa` y `pag` = PNG rasterizados del PDF (la tapa plana y la página citada), en public/ortega01/.
import React from "react";
import { Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

export type Guia = { nombre: string; sub?: string; pagina: number; tapa?: string; pag?: string; titPag?: string; puntos?: string[] };
// nombre provisorio genérico del tema (sin URL ni precio) hasta que exista el producto
export const GUIA_PROVISORIA: Guia = { nombre: "Su Dinero a Salvo en Casa", sub: "GUÍA DEL COMANDANTE", pagina: 23, titPag: "Escondites que el ratero no revisa", puntos: ["El tiempo", "El ruido", "La suciedad"] };

const Tapa: React.FC<{ g: Guia; w: number; h: number }> = ({ g, w, h }) => g.tapa
  ? <Img src={staticFile(P + g.tapa)} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
  : (
    <div style={{ width: w, height: h, background: "linear-gradient(160deg,#1f3c74,#16284d 60%,#0f1c38)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, textAlign: "center", padding: 30, boxSizing: "border-box" }}>
      <svg width={110} height={116} viewBox="0 0 300 310"><path d="M150 8 L270 48 C 270 170 230 250 150 300 C 70 250 30 170 30 48 Z" fill="#e9c46a" /><path d="M150 92 L163 130 L203 130 L171 154 L183 192 L150 169 L117 192 L129 154 L97 130 L137 130 Z" fill="#1f3c74" /></svg>
      <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 6, color: "#e9c46a", marginTop: 18 }}>{g.sub ?? "GUÍA"}</div>
      <div style={{ fontWeight: 900, fontSize: 52, lineHeight: 1.02, color: "#f4efe6", marginTop: 10 }}>{g.nombre}</div>
    </div>
  );

const Pagina: React.FC<{ g: Guia; w: number; h: number; t: number; at: number }> = ({ g, w, h, t, at }) => g.pag
  ? <Img src={staticFile(P + g.pag)} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
  : (
    <div style={{ width: w, height: h, background: "linear-gradient(90deg,#e9e2d0,#fbf8f0 12%)", padding: "40px 38px", boxSizing: "border-box", fontFamily: FONT, color: "#1d2733", position: "relative" }}>
      <div style={{ fontWeight: 900, fontSize: 30, lineHeight: 1.1 }}>{g.titPag}</div>
      <div style={{ height: 4, width: 90, background: COL.red, margin: "14px 0 20px" }} />
      {(g.puntos ?? []).map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, opacity: e(t, at + 0.3 + i * 0.25, at + 0.5 + i * 0.25) }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: "#1f3c74", color: "#e9c46a", fontWeight: 900, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 24 }}>{p}</div>
        </div>
      ))}
      {Array.from({ length: 6 }, (_, i) => <div key={"l" + i} style={{ height: 8, borderRadius: 4, background: "rgba(29,39,51,.13)", margin: "12px 0", width: `${88 - (i % 3) * 14}%` }} />)}
      <div style={{ position: "absolute", bottom: 22, right: 30, fontWeight: 800, fontSize: 18, color: "#7a7468" }}>{g.pagina}</div>
    </div>
  );

// t: tiempo; at: entra el libro; abre: la tapa se abre; pasa: la hoja pasa a la página; descAt: tarjeta de la descripción; out
export const GuiaCTA: React.FC<{ t: number; g: Guia; at: number; abre: number; pasa: number; descAt: number; out: number }> = ({ t, g, at, abre, pasa, descAt, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const Wb = 420, Hb = 560;
  const zoom = ei(t, at, abre);                      // de la mesa (lejos, acostado) al frente
  const cover = ei(t, abre, abre + 0.7);             // tapa 0 → -180°
  const leaf = ei(t, pasa, pasa + 0.6);              // hoja que pasa
  const curl = Math.sin(leaf * Math.PI) * 18;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, perspective: 1800 }}>
      {/* mesa: mantel de hule (motivo de la mesa del avatar) */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0) 30%, rgba(0,0,0,.55) 100%)", opacity: 1 - zoom * 0.4 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d",
        transform: `translate(-50%,-46%) translateX(${Wb / 2 * cover}px) translateZ(${-900 + 900 * zoom}px) rotateX(${62 - 54 * zoom}deg) rotateZ(${-14 + 14 * zoom}deg) scale(${1 + 0.15 * e(t, pasa + 0.6, out)})` }}>
        <div style={{ position: "relative", width: Wb, height: Hb, transformStyle: "preserve-3d" }}>
          {/* sombra y canto */}
          <div style={{ position: "absolute", inset: 0, transform: "translateZ(-24px)", boxShadow: "0 60px 90px rgba(0,0,0,.75)", background: "#d8d0bd", borderRadius: 6 }} />
          {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", inset: 0, transform: `translateZ(${-22 + i * 2.2}px)`, background: i % 2 ? "#efe8d6" : "#e2d9c3", borderRadius: 4 }} />)}
          {/* página citada (derecha) */}
          <div style={{ position: "absolute", inset: 0, transform: "translateZ(1px)", overflow: "hidden", borderRadius: 4 }}><Pagina g={g} w={Wb} h={Hb} t={t} at={pasa + 0.4} /></div>
          {/* hoja que pasa */}
          {leaf < 1 && <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `translateZ(2px) rotateY(${-leaf * 180}deg) skewY(${-curl * 0.3}deg)`, background: "linear-gradient(90deg,#e8e0cc,#fbf8f0)", borderRadius: 4, backfaceVisibility: "hidden" }} />}
          {/* tapa con bisagra en el lomo */}
          <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transformStyle: "preserve-3d", transform: `translateZ(4px) rotateY(${-cover * 178}deg)` }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "4px 8px 8px 4px", overflow: "hidden", boxShadow: "inset 6px 0 10px rgba(0,0,0,.35)" }}><Tapa g={g} w={Wb} h={Hb} /></div>
            <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: "#16284d", borderRadius: 4 }} />
          </div>
        </div>
      </div>
      {/* "página N" que cita el comandante */}
      <div style={{ position: "absolute", right: 150, top: 150, opacity: e(t, pasa + 0.5, pasa + 0.7), transform: `scale(${Math.min(1.05, spr(t, pasa + 0.5, 1))}) rotate(6deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: COL.gold, textShadow: extrude(8, "#5a4316") }}>PÁGINA {g.pagina}</div>
      {/* tarjeta de la descripción con el renglón 1 resaltado */}
      {t > descAt && (
        <div style={{ position: "absolute", left: "50%", bottom: 60, transform: `translateX(-50%) translateY(${(1 - Math.min(1, spr(t, descAt, 0.9))) * 220}px)`, width: 980, padding: "18px 26px", borderRadius: 14, background: "#0f0f0f", boxShadow: "0 30px 70px rgba(0,0,0,.7)", fontFamily: "Roboto, Arial, sans-serif" }}>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: `rgba(233,196,106,${0.18 + 0.12 * Math.sin(t * 6)})`, boxShadow: "inset 0 0 0 2px #e9c46a", color: "#f1f1f1", fontSize: 30, fontWeight: 700 }}>
            📘 {g.nombre}
          </div>
          <div style={{ color: "#aaa", fontSize: 22, marginTop: 10, paddingLeft: 12 }}>El link está en la 1ª línea de la descripción ↓</div>
        </div>
      )}
    </div>
  );
};
