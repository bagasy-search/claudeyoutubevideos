// ── HÉROES de Abuela Rosa · rosa9 (25 sopas de pobre, 16-oct-2026) ──
// El mundo de las sopas de Rosa: el taco de calendario de 1958, la despensa casi vacía, la olla grande y los nueve tazones,
// el cuaderno cuadriculado de la escuela con las recetas, las monedas contadas, los frascos de caldo, el vapor.
// Paleta propia (vino + cobre + crema + pizarra), distinta de rosa7 (azulejo azul) y rosa8 (oliva/kraft). Sin grano ni viñeta.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, sp, useT, ez, cl, img, SERIF, HAND, P } from "../lkit/core";

const VINO = "#7A2431", VINO2 = "#9B3442", COBRE = "#B8733A", CREMA = "#F5ECD9", PIZARRA = "#2F3A44", TINTA = "#2A2118", VERDE = "#5E7A4A", AZULT = "#2C4C7A";
const sombra = "0 30px 60px rgba(15,10,5,0.55), 0 6px 14px rgba(0,0,0,0.3)";
const txtSh = "0 4px 18px rgba(0,0,0,0.85)";
type Beat = { t: number; txt: string };
// hoja de cuaderno cuadriculado de escuela (las recetas de Rosa niña)
const cuadri: React.CSSProperties = {
  backgroundColor: "#FBF7EC",
  backgroundImage: "linear-gradient(rgba(44,76,122,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(44,76,122,0.18) 1px, transparent 1px)",
  backgroundSize: "36px 36px",
};
const cobre: React.CSSProperties = { background: "linear-gradient(135deg, #D59457 0%, #B8733A 45%, #8C5226 100%)" };
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 18, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ whiteSpace: "nowrap", ...style, clipPath: `inset(-20% ${100 - u * 112}% -20% -5%)`, paddingRight: 14 }}>{children}</div>;
};
const Foto: React.FC<{ k: string; f: number; d: number; z?: [number, number]; style?: React.CSSProperties }> = ({ k, f, d, z = [1.04, 1.12], style }) => (
  <div style={{ overflow: "hidden", ...style }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, d)})` }} /></div>
);
// vapor: tres hilos que suben y se mueven
const Vapor: React.FC<{ f: number; w?: number; h?: number; o?: number }> = ({ f, w = 200, h = 220, o = 0.7 }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: "50%", bottom: "100%", marginLeft: -w / 2, opacity: o }}>
    {[0, 1, 2].map((i) => {
      const x = w * (0.3 + 0.2 * i), ph = f / 9 + i * 2;
      return <path key={i} d={`M${x} ${h} C ${x + 30 * Math.sin(ph)} ${h * 0.7}, ${x - 30 * Math.sin(ph + 1)} ${h * 0.4}, ${x + 18 * Math.sin(ph + 2)} ${h * 0.05}`} stroke="rgba(255,255,255,0.75)" strokeWidth={10} fill="none" strokeLinecap="round" />;
    })}
  </svg>
);
const Tazon: React.FC<{ size: number; fill: number; col?: string; f: number; steam?: boolean }> = ({ size, fill, col = "#C9862F", f, steam }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {steam && fill > 0.6 ? <Vapor f={f} w={size * 0.7} h={size * 0.7} o={0.6} /> : null}
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, #F4EDE0 60%, #D9CDB6 62%, #EFE6D3 72%, #C2B394 100%)", boxShadow: sombra }} />
    <div style={{ position: "absolute", left: "18%", top: "18%", width: "64%", height: "64%", borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${col} 0%, ${col} 55%, rgba(0,0,0,0.25) 100%)`,
      transform: `scale(${fill})`, opacity: fill > 0.02 ? 1 : 0 }} />
  </div>
);

// 1 · ALMANAQUE: el taco de calendario de pared; las hojas pasan volando hasta "10 ENERO 1958"
export const Almanaque: P<{ bed: string; t: number; dia: string; mes: string; anio: string; sub: string; ts: number }> = ({ a, d, bed, t, dia, mes, anio, sub, ts }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), flips = 7, fl = cl((f - at(t)) / 20) * flips, s = cl((f - at(ts)) / 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={14} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", width: 620, height: 760, opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, ...cobre, borderRadius: "10px 10px 0 0", boxShadow: sombra }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, bottom: 0, background: "#FBF7EC", boxShadow: sombra }}>
          <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: VINO, marginTop: 30, letterSpacing: 8 }}>{mes}</div>
          <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 300, lineHeight: 1, color: TINTA }}>{fl >= flips ? dia : String(Math.max(1, Math.floor(fl) + 3))}</div>
          <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 70, color: VINO, letterSpacing: 6 }}>{anio}</div>
        </div>
        {fl < flips ? <div style={{ position: "absolute", left: 0, right: 0, top: 100, height: 660, background: "#F1E9D6", transformOrigin: "50% 0%",
          transform: `perspective(1400px) rotateX(${(fl % 1) * 110}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.25)" }} /> : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 72, color: CREMA, textShadow: txtSh, opacity: s }}>{sub}</div>
    </AbsoluteFill>
  );
};

// 2 · DESPENSA: un estante de madera casi vacío; en su palabra aparece cada cosa que quedaba, con su etiqueta escrita
export const Despensa: P<{ bed: string; items: { t: number; k: string; txt: string }[]; title: string }> = ({ a, d, bed, items, title }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#3B2A1E" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.7} blur={18} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{title}</div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 720, height: 44, background: "linear-gradient(180deg, #8A5F3B, #5E3D24)", boxShadow: sombra, opacity: cl(u * 2) }} />
      {items.map((x, i) => {
        if (f < at(x.t)) return null;
        const v = sp(f, at(x.t), 12, 150), X = 330 + i * (1260 / Math.max(1, items.length - 1 || 1));
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 720, translate: "-50% -100%", textAlign: "center", opacity: cl(v * 2), transform: `translateY(${(1 - v) * -200}px)` }}>
            <div style={{ width: 300, height: 300, borderRadius: 18, overflow: "hidden", border: `8px solid ${CREMA}`, boxShadow: sombra, margin: "0 auto" }}><Img src={img(x.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ position: "absolute", left: "50%", top: 330, translate: "-50% 0", ...cuadri, padding: "4px 22px 8px", borderRadius: 4, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: TINTA, whiteSpace: "nowrap", boxShadow: sombra, transform: "rotate(-2deg)" }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 3 · NUEVE: la olla grande al centro, vista desde arriba, y nueve tazones alrededor que se llenan uno a uno con el cucharón
export const Nueve: P<{ bed: string; t: number; txt: string; sub: string; n?: number }> = ({ a, d, bed, t, txt, sub, n = 9 }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.62} blur={14} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 640, fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1.02, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{txt}</div>
      <div style={{ position: "absolute", left: 120, top: 480, width: 620, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#F2C98F", textShadow: txtSh, opacity: cl((f - at(t) - 10) / 12) }}>{sub}</div>
      <div style={{ position: "absolute", left: 1280, top: 540, translate: "-50% -50%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #5B4A3C 0 58%, #9A9A9A 60%, #6E6E6E 70%, #4A4A4A 100%)", boxShadow: sombra, opacity: cl(u * 2) }}>
        <Vapor f={f} w={220} h={200} />
      </div>
      {Array.from({ length: n }).map((_, i) => {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2, R = 360, x = 1280 + R * Math.cos(ang), y = 540 + R * Math.sin(ang) * 0.92;
        const v = sp(f, at(t) + i * 4, 10, 170);
        return <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: cl(u * 2) }}><Tazon size={170} fill={v} f={f} col="#A8603A" steam /></div>;
      })}
    </AbsoluteFill>
  );
};

// 4 · TRES TAZONES: las tres promesas — tres tazones con su número grande y el vapor, en su palabra
export const Tazones: P<{ bed: string; items: { t: number; n: string; txt: string }[] }> = ({ a, d, bed, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PIZARRA }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.66} blur={16} />
      {items.map((x, i) => {
        if (f < at(x.t)) return null;
        const v = sp(f, at(x.t), 12, 140), X = 360 + i * 600;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 560, translate: "-50% -50%", textAlign: "center", opacity: cl(v * 2), transform: `translateY(${(1 - v) * 160}px)` }}>
            <div style={{ position: "relative", margin: "0 auto", width: 380 }}><Tazon size={380} fill={ez((f - at(x.t) - 6) / 14)} f={f} col={[COBRE, VINO2, VERDE][i % 3]} steam /></div>
            <div style={{ position: "absolute", left: "50%", top: 190, translate: "-50% -50%", fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CREMA, textShadow: "0 6px 20px rgba(0,0,0,0.7)" }}>{x.n}</div>
            <div style={{ marginTop: 26, ...cuadri, padding: "8px 24px 12px", borderRadius: 6, fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1.05, color: TINTA, boxShadow: sombra, width: 460, marginLeft: -40 }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 5 · BANNER del recetario (CTA): el banner con el QR + una pestaña de cobre "pág. N" que asoma en su palabra
export const Banner: P<{ bed: string; t: number; page: string; tp: number; txt: string }> = ({ a, d, t, page, tp, txt }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 15, 100), p = sp(f, at(tp), 12, 170);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#EFE6D6" }}>
      <AbsoluteFill style={{ opacity: cl(u * 1.5), transform: `scale(${1.0 + 0.03 * f / Math.max(1, d)}) translateY(${(1 - u) * 60}px)` }}>
        <Img src={img("banner_qr.png")} style={{ width: 1920, height: 1280, objectFit: "cover", marginTop: -100 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 470, ...cobre, color: CREMA, padding: "12px 46px 16px 60px", borderRadius: "0 40px 40px 0", boxShadow: sombra,
        fontFamily: SERIF, fontWeight: 900, fontSize: 60, transform: `translateX(${(1 - p) * -800}px)`, whiteSpace: "nowrap" }}>{page} · <span style={{ fontFamily: HAND, fontWeight: 700 }}>{txt}</span></div>
    </AbsoluteFill>
  );
};

// 6 · CUADERNO: hoja de cuaderno cuadriculado de escuela con la receta; cada medida se escribe en su palabra; sello de la página
export const Cuaderno: P<{ bed: string; title: string; page: string; items: { t: number; q: string; txt: string }[] }> = ({ a, d, bed, title, page, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), s = sp(f, 22, 10, 200);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,5,0.78) 0%, rgba(10,8,5,0.4) 48%, rgba(10,8,5,0) 72%)" }} />
      <div style={{ position: "absolute", left: 100, top: 110, width: 860, height: 860, ...cuadri, boxShadow: sombra, overflow: "hidden",
        transform: `translateY(${(1 - u) * 1000}px) rotate(${-1.5 + (1 - u) * 5}deg)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: "repeating-linear-gradient(180deg, transparent 0 30px, rgba(60,40,30,0.9) 30px 44px, transparent 44px 72px)" }} />
        <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 4, background: "rgba(155,52,66,0.6)" }} />
        <div style={{ padding: "40px 40px 0 150px", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: VINO, lineHeight: 1.04 }}>{title}</div>
        <div style={{ padding: "26px 40px 0 150px" }}>
          {items.map((x, i) => (
            <Escrito key={i} f={f} at={at(x.t) + i * 8} dur={16} style={{ fontFamily: HAND, fontSize: 66, color: AZULT, height: 118, display: "flex", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: VINO2, minWidth: 210, marginRight: 18, whiteSpace: "nowrap", display: "inline-block" }}>{x.q}</span>{x.txt}
            </Escrito>
          ))}
        </div>
        <div style={{ position: "absolute", right: 36, bottom: 34, width: 190, height: 190, borderRadius: "50%", border: `6px double ${VINO}`, color: VINO, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: 2, transform: `rotate(-12deg) scale(${0.5 + 0.5 * s})`, opacity: cl(s * 1.6) * 0.85 }}>
          RECETARIO<div style={{ fontSize: 52 }}>{page}</div></div>
      </div>
    </AbsoluteFill>
  );
};

// 7 · OLLA = 3: la olla pequeña se reparte en tres tazones (hoy · mañana · pasado); el nivel de la olla baja en cada uno
export const OllaTres: P<{ bed: string; t: number; txt: string; items: Beat[] }> = ({ a, d, bed, t, txt, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 14, 120);
  const lvl = 1 - (items.reduce((s, x) => s + ez((f - at(x.t)) / 12), 0) / Math.max(1, items.length)) * 0.85;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={14} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{txt}</div>
      <div style={{ position: "absolute", left: 360, top: 330, width: 420, height: 420, opacity: cl(u * 2) }}>
        <svg width={420} height={420} viewBox="0 0 420 420">
          <rect x={20} y={110} width={380} height={290} rx={40} fill="#8E8E8E" stroke="#5E5E5E" strokeWidth={8} />
          <rect x={36} y={110 + 270 * (1 - lvl) + 20} width={348} height={Math.max(0, 270 * lvl - 30)} rx={20} fill="#C9862F" />
          <rect x={0} y={90} width={420} height={36} rx={14} fill="#6E6E6E" />
          <rect x={-10} y={180} width={40} height={24} rx={8} fill="#5E5E5E" /><rect x={390} y={180} width={40} height={24} rx={8} fill="#5E5E5E" />
        </svg>
        <div style={{ position: "absolute", left: 210, top: 100 }}><Vapor f={f} w={200} h={180} /></div>
      </div>
      {items.map((x, i) => {
        const v = sp(f, at(x.t), 12, 150);
        return f < at(x.t) ? null : (
          <div key={i} style={{ position: "absolute", left: 1000 + i * 300, top: 620, translate: "-50% -50%", textAlign: "center", opacity: cl(v * 2), transform: `translateY(${(1 - v) * 120}px)` }}>
            <Tazon size={230} fill={ez((f - at(x.t) - 4) / 12)} f={f} col="#C9862F" steam />
            <div style={{ marginTop: 18, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CREMA, textShadow: txtSh }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 8 · VAPOR: el dicho sube como vapor desde un tazón caliente, palabra por palabra; firma abajo
export const Dicho: P<{ bed: string; txt: string; sign: string; t: number }> = ({ a, d, bed, txt, sign, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), w = txt.split(" ");
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} z={[1.02, 1.1]} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,5,0.72) 0%, rgba(10,8,5,0.35) 60%, rgba(10,8,5,0.15) 100%)" }} />
      <div style={{ position: "absolute", left: 160, right: 160, top: 170, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: 96, lineHeight: 1.15, color: CREMA, textShadow: txtSh }}>
        {w.map((x, i) => { const v = ez((f - at(t) - i * 4) / 14);
          return <span key={i} style={{ display: "inline-block", marginRight: 26, opacity: v, filter: `blur(${(1 - v) * 10}px)`, transform: `translateY(${(1 - v) * 60}px)` }}>{x}</span>; })}
      </div>
      <div style={{ position: "absolute", right: 200, top: 640, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#F2C98F", textShadow: txtSh, opacity: cl((f - at(t) - w.length * 4 - 8) / 12) * cl(u * 2) }}>— {sign}</div>
    </AbsoluteFill>
  );
};

// 9 · MONEDAS: lo que cuesta la sopa — las monedas caen una a una en una pila y el total se escribe al lado
export const Monedas: P<{ bed: string; title: string; lines: { t: number; txt: string; p: string }[]; total: Beat; n?: number }> = ({ a, d, bed, title, lines, total, n = 6 }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(10,8,5,0.82) 0%, rgba(10,8,5,0.45) 50%, rgba(10,8,5,0.1) 80%)" }} />
      {Array.from({ length: n }).map((_, i) => {
        const tt = at(lines[Math.min(i, lines.length - 1)].t) + i * 5, v = ez((f - tt) / 10);
        return f < tt ? null : <div key={i} style={{ position: "absolute", left: 1100, top: 820 - i * 34 - (1 - v) * 500, width: 200, height: 60, borderRadius: "50%",
          background: "radial-gradient(ellipse at 40% 35%, #F1D38A 0%, #C99B3C 60%, #8F6A22 100%)", border: "3px solid #7A5A1C", boxShadow: "0 6px 10px rgba(0,0,0,0.45)" }} />;
      })}
      <div style={{ position: "absolute", left: 1300, top: 140, width: 580, opacity: cl(u * 2) }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CREMA, textShadow: txtSh, lineHeight: 1.05 }}>{title}</div>
        <div style={{ height: 4, background: COBRE, margin: "20px 0 10px", width: "80%" }} />
        {lines.map((x, i) => (
          <Escrito key={i} f={f} at={at(x.t) + i * 6} dur={14} style={{ fontFamily: HAND, fontSize: 48, color: CREMA, textShadow: txtSh, height: 84, display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1, minWidth: 0 }}>{x.txt}</span><span style={{ fontWeight: 700, color: "#F2C98F", flexShrink: 0, marginLeft: 16 }}>$ {x.p}</span>
          </Escrito>
        ))}
        <Escrito f={f} at={at(total.t)} dur={18} style={{ marginTop: 20, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: "#F2C98F", textShadow: txtSh, whiteSpace: "normal", lineHeight: 1.1 }}>{total.txt}</Escrito>
      </div>
    </AbsoluteFill>
  );
};

// 10 · CARTA: un sobre se abre y sale la carta con la pregunta para los comentarios, escrita a mano
export const Carta: P<{ bed: string; q: string; t: number }> = ({ a, d, bed, q, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), o = ez((f - 8) / 12), c = sp(f, 18, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={14} />
      <div style={{ position: "absolute", left: 960, top: 640, translate: "-50% -50%", width: 1100, height: 600, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 600}px)` }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 120 - 420 * c, height: 560, ...cuadri, boxShadow: sombra, padding: "50px 70px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: VINO }}>Cuéntame en los comentarios</div>
          <Escrito f={f} at={at(t)} dur={34} style={{ marginTop: 26, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: AZULT, whiteSpace: "normal", lineHeight: 1.12 }}>{q}</Escrito>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 420, background: "#E8D9B8", boxShadow: sombra, clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 180, height: 300, background: "#DCCBA6", transformOrigin: "50% 0%", transform: `perspective(1600px) rotateX(${180 * o}deg)`,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)", opacity: o > 0.5 ? 0.0 : 1 }} />
        <div style={{ position: "absolute", left: 500, top: 360, width: 100, height: 100, borderRadius: "50%", background: VINO, boxShadow: "0 4px 10px rgba(0,0,0,0.4)", opacity: 1 - o }} />
      </div>
    </AbsoluteFill>
  );
};

// 11 · SEMANA de sopas: siete tazones en fila (LUN…DOM); cada uno se llena con su color en su palabra; dos ollas marcan los días de cocinar
export const SemanaSopas: P<{ bed: string; title: string; days: { t: number; d: string; txt: string; c: string; olla?: boolean }[] }> = ({ a, d, bed, title, days }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.62} blur={14} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{title}</div>
      {days.map((x, i) => {
        const v = at(x.t) <= 0 ? 1 : ez((f - at(x.t)) / 14), X = 170 + i * 263;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 420, translate: "-50% 0", textAlign: "center", opacity: cl(u * 2) }}>
            {x.olla ? <div style={{ position: "absolute", left: "50%", top: -110, translate: "-50% 0", ...cobre, color: CREMA, fontFamily: SERIF, fontWeight: 900, fontSize: 30, padding: "4px 14px 6px", borderRadius: 20, opacity: v, whiteSpace: "nowrap" }}>COCINO</div> : null}
            <Tazon size={200} fill={v} f={f} col={x.c} steam />
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: CREMA, textShadow: txtSh, marginTop: 14 }}>{x.d}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, lineHeight: 1.0, color: "#F2C98F", textShadow: txtSh, width: 240, opacity: v, marginTop: 6 }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 12 · SECRETOS: cinco frascos de especias en un estante; cada uno se ilumina con su número y su secreto en su palabra
export const Secretos: P<{ bed: string; title: string; items: { t: number; n: string; txt: string }[] }> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120), cur = items.reduce((c, x, i) => (f >= at(x.t) ? i : c), -1);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2B211A" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.72} blur={18} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 86, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{title}</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 560, height: 36, background: "linear-gradient(180deg, #8A5F3B, #5E3D24)", boxShadow: sombra }} />
      {items.map((x, i) => {
        const on = at(x.t) <= 0 || f >= at(x.t), v = at(x.t) <= 0 ? 1 : ez((f - at(x.t)) / 12), X = 300 + i * 330;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 560, translate: "-50% -100%", textAlign: "center" }}>
            <div style={{ width: 160, height: 220, borderRadius: "24px 24px 16px 16px", background: on ? "rgba(255,240,210,0.35)" : "rgba(255,255,255,0.12)", border: "5px solid rgba(255,255,255,0.7)",
              boxShadow: on ? `0 0 ${50 * v}px rgba(242,201,143,0.75)` : "none", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: -34, left: 18, right: 18, height: 34, ...cobre, borderRadius: 8 }} />
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: on ? VINO : "rgba(255,255,255,0.4)" }}>{x.n}</div>
            </div>
          </div>
        );
      })}
      {cur >= 0 ? <div key={cur} style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
        <span style={{ ...cuadri, padding: "12px 40px 18px", borderRadius: 8, boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: TINTA, display: "inline-block",
          opacity: ez((f - at(items[cur].t)) / 10), transform: `translateY(${(1 - ez((f - at(items[cur].t)) / 10)) * 40}px)` }}>{items[cur].txt}</span></div> : null}
    </AbsoluteFill>
  );
};

// 13 · BOLSA de cáscaras: una bolsa de congelador que se llena por capas de colores (cebolla, zanahoria, perejil) → "= caldo"
export const Bolsa: P<{ bed: string; items: Beat[]; txt: string; tt: number }> = ({ a, d, bed, items, txt, tt }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120), cols = ["#D9A35C", "#E0782F", "#6C9A3C", "#B9B07A"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.62} blur={14} />
      <div style={{ position: "absolute", left: 560, top: 560, translate: "-50% -50%", width: 520, height: 700, opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 50px 50px", background: "rgba(230,240,248,0.22)", border: "6px solid rgba(255,255,255,0.85)", overflow: "hidden" }}>
          {items.map((x, i) => {
            const h = 150 * ez((f - at(x.t)) / 14);
            return <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: i * 150, height: h, background: cols[i % 4], opacity: 0.9,
              backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0 8px, transparent 9px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.15) 0 10px, transparent 11px)", backgroundSize: "70px 60px" }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: -10, right: -10, top: 30, height: 18, background: AZULT, borderRadius: 6 }} />
      </div>
      {items.map((x, i) => f < at(x.t) ? null : (
        <div key={i} style={{ position: "absolute", left: 880, top: 820 - i * 150, ...cuadri, padding: "6px 28px 10px", borderRadius: 6, boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: TINTA,
          opacity: ez((f - at(x.t) - 4) / 10), transform: `translateX(${(1 - ez((f - at(x.t) - 4) / 10)) * 200}px)` }}>← {x.txt}</div>
      ))}
      <div style={{ position: "absolute", left: 1320, top: 360, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CREMA, textShadow: txtSh, opacity: ez((f - at(tt)) / 12), transform: `scale(${0.7 + 0.3 * ez((f - at(tt)) / 12)})` }}>{txt}</div>
    </AbsoluteFill>
  );
};

// ── superposición: PÁGINA del recetario (pestaña de cobre con hoja cuadriculada abajo a la derecha cuando Rosa cita la página) ──
export const Pagina: React.FC<{ a: number; d: number; n: number; txt: string }> = ({ a, d, n, txt }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 150), o = cl((f - (d - 10)) / 10);
  return (
    <div style={{ position: "absolute", right: 70, bottom: 80, width: 560, ...cuadri, borderRadius: 8, boxShadow: sombra, padding: "16px 30px 20px",
      opacity: cl(u * 2) * (1 - o), transform: `translateY(${(1 - u) * 160 + o * 60}px) rotate(-1.5deg)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 12, ...cobre, borderRadius: "8px 8px 0 0" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 38, color: VINO, letterSpacing: 2, marginTop: 6 }}>RECETARIO · PÁG. {n}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: AZULT, lineHeight: 1.05 }}>{txt}</div>
    </div>
  );
};
