// ── HÉROES de Abuela Rosa · rosa8 (NUNCA vuelvas a tirar las sobras, 16-oct-2026) ──
// El mundo de las sobras de Rosa: cinta de pintor con la fecha escrita a mano, recipientes con tapa, etiquetas de papel kraft
// colgadas de un hilo, la nevera abierta, el ticket de la tienda, la pizarra de la cocina, el cubo de la basura.
// Paleta propia (oliva + mostaza + kraft + tomate), distinta del azulejo azul de rosa7. Sin grano, sin viñeta, sin temblor.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, sp, useT, ez, cl, img, SERIF, HAND, P } from "../lkit/core";

const OLIVA = "#4E5B2C", OLIVA2 = "#6B7A3A", MOSTAZA = "#D9A13B", KRAFT = "#C9A577", CREMA = "#F6EEDB", TINTA = "#2A2118", TOMATE = "#B8432F", PIZARRA = "#26302A";
const sombra = "0 30px 60px rgba(15,10,5,0.55), 0 6px 14px rgba(0,0,0,0.3)";
const txtSh = "0 4px 18px rgba(0,0,0,0.85)";
type Beat = { t: number; txt: string };
const kraft: React.CSSProperties = { background: "radial-gradient(ellipse at 30% 20%, #DDBF92 0%, #C9A577 60%, #B38D5E 100%)" };
const cinta: React.CSSProperties = { background: "linear-gradient(180deg, #F3E6B8 0%, #EAD9A0 100%)", boxShadow: "0 4px 10px rgba(0,0,0,0.35)" };
// mantel de cuadros oliva (fondo propio de este video)
const cuadros: React.CSSProperties = {
  backgroundColor: "#EFE6CF",
  backgroundImage: "linear-gradient(90deg, rgba(78,91,44,0.38) 50%, transparent 50%), linear-gradient(0deg, rgba(78,91,44,0.38) 50%, transparent 50%)",
  backgroundSize: "120px 120px",
};
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 18, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ whiteSpace: "nowrap", ...style, clipPath: `inset(-20% ${100 - u * 112}% -20% -5%)`, paddingRight: 14 }}>{children}</div>;
};
const Foto: React.FC<{ k: string; f: number; d: number; z?: [number, number]; style?: React.CSSProperties }> = ({ k, f, d, z = [1.04, 1.12], style }) => (
  <div style={{ overflow: "hidden", ...style }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, d)})` }} /></div>
);
// etiqueta kraft con agujero y cordel
const Etiqueta: React.FC<{ w: number; h: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ w, h, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, ...kraft, clipPath: "polygon(14% 0, 86% 0, 100% 10%, 100% 100%, 0 100%, 0 10%)", boxShadow: sombra, ...style }}>
    <div style={{ position: "absolute", left: "50%", top: 22, width: 30, height: 30, marginLeft: -15, borderRadius: "50%", background: "rgba(40,30,20,0.85)", border: `5px solid ${CREMA}` }} />
    {children}
  </div>
);

// 1 · BASURA: el cubo dibujado a la izquierda; las sobras de la semana (etiquetas) caen dentro en su palabra; a la derecha la frase
export const Basura: P<{ bed: string; items: Beat[]; txt: string; t: number }> = ({ a, d, bed, items, txt, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120), lid = ez((f - at(items[0]?.t ?? 0) + 8) / 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.62} blur={12} />
      <div style={{ position: "absolute", left: 520, top: 600, translate: "-50% -50%", opacity: cl(u * 2) }}>
        <svg width={560} height={700} viewBox="0 0 560 700">
          <g transform={`rotate(${-35 * lid} 60 120)`}><rect x={40} y={90} width={480} height={50} rx={14} fill="#8C949A" stroke="#5B6268" strokeWidth={6} /><rect x={230} y={62} width={100} height={34} rx={10} fill="#5B6268" /></g>
          <path d="M70 160 L110 680 L450 680 L490 160 Z" fill="#9AA2A8" stroke="#5B6268" strokeWidth={8} />
          {[0, 1, 2, 3].map((i) => <line key={i} x1={170 + i * 75} y1={200} x2={180 + i * 70} y2={640} stroke="#6C7378" strokeWidth={6} />)}
        </svg>
      </div>
      {items.map((x, i) => {
        if (f < at(x.t)) return null;
        const v = ez((f - at(x.t)) / 16), y = -200 + 520 * v, r = (i % 2 ? 18 : -14) * (1 - v) + (i % 2 ? 8 : -6);
        return (
          <div key={i} style={{ position: "absolute", left: 360 + (i % 3) * 120, top: y, ...cinta, padding: "8px 26px 12px", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: TINTA,
            transform: `rotate(${r}deg) scale(${1 - 0.25 * v})`, opacity: 1 - cl((f - at(x.t) - 26) / 8) }}>{x.txt}</div>
        );
      })}
      <div style={{ position: "absolute", left: 960, top: 300, width: 860, fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1.04, color: CREMA, textShadow: txtSh }}>
        <Escrito f={f} at={at(t)} dur={30} style={{ whiteSpace: "normal" }}>{txt}</Escrito>
      </div>
      <div style={{ position: "absolute", left: 960, top: 640, height: 12, width: 640 * ez((f - at(t) - 30) / 14), background: TOMATE, borderRadius: 6 }} />
    </AbsoluteFill>
  );
};

// 2 · CINTA: un trozo de cinta de pintor se pega sobre la foto (la tapa de un recipiente) y la fecha se escribe a mano
export const Cinta: P<{ bed: string; t: number; txt: string; sub: string; ts: number }> = ({ a, d, bed, t, txt, sub, ts }) => {
  const { f, at } = useT(a);
  const u = ez((f - at(t)) / 12), s = cl((f - at(ts)) / 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} z={[1.02, 1.1]} />
      <AbsoluteFill style={{ background: "rgba(10,8,5,0.35)" }} />
      <div style={{ position: "absolute", left: 960, top: 470, translate: "-50% -50%", width: 1300 * u, height: 210, ...cinta, overflow: "hidden", transform: "rotate(-3deg)",
        clipPath: "polygon(0 4%, 2% 0, 98% 3%, 100% 0, 100% 96%, 98% 100%, 2% 97%, 0 100%)" }}>
        <Escrito f={f} at={at(t) + 10} dur={26} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 130, color: TINTA, textAlign: "center", lineHeight: "210px", width: 1300 }}>{txt}</Escrito>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 72, color: CREMA, textShadow: txtSh,
        opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>{sub}</div>
    </AbsoluteFill>
  );
};

// 3 · TAPAS: tres recipientes vistos desde arriba sobre el mantel; la tapa se levanta y aparece el número de la promesa
export const Tapas: P<{ bed: string; items: { t: number; n: string; txt: string }[] }> = ({ a, d, items }) => {
  const { f, at } = useT(a);
  const cols = [MOSTAZA, TOMATE, OLIVA2];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...cuadros }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(30,20,10,0.35) 100%)" }} />
      {items.map((x, i) => {
        if (f < at(x.t) - 4) return null;
        const v = sp(f, at(x.t) - 4, 12, 150), o = ez((f - at(x.t) - 6) / 12), X = 360 + i * 600;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 520, translate: "-50% -50%", width: 500, height: 500, opacity: cl(v * 2), transform: `scale(${0.6 + 0.4 * v})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "rgba(255,255,255,0.55)", border: "6px solid rgba(255,255,255,0.9)", boxShadow: sombra,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 230, color: cols[i % 3], lineHeight: 1 }}>{x.n}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: TINTA, textAlign: "center", padding: "0 30px", lineHeight: 1.05 }}>{x.txt}</div>
            </div>
            <div style={{ position: "absolute", left: -10, right: -10, top: -10, height: 520, borderRadius: 46, background: cols[i % 3], opacity: 0.96, boxShadow: sombra,
              transform: `translate(${o * 330}px, ${o * -260}px) rotate(${o * 28}deg)`, transformOrigin: "100% 0%" }}>
              <div style={{ position: "absolute", left: 60, right: 60, top: 200, height: 110, ...cinta, transform: "rotate(-2deg)", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: TINTA,
                display: "flex", alignItems: "center", justifyContent: "center" }}>Nº {x.n}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 4 · BANNER del recetario (CTA): el banner con el QR + cinta de pintor con "pág. N" pegada en su palabra
export const Banner: P<{ bed: string; t: number; page: string; tp: number; txt: string }> = ({ a, d, t, page, tp, txt }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 15, 100), p = ez((f - at(tp)) / 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#EFE6D6" }}>
      <AbsoluteFill style={{ opacity: cl(u * 1.5), transform: `scale(${1.0 + 0.03 * f / Math.max(1, d)}) translateY(${(1 - u) * 60}px)` }}>
        <Img src={img("banner_qr.png")} style={{ width: 1920, height: 1280, objectFit: "cover", marginTop: -100 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 50, top: 460, ...cinta, padding: "10px 44px 16px", transform: "rotate(-3deg)", overflow: "hidden", width: 760 * p, whiteSpace: "nowrap",
        fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: OLIVA }}>{page} · <span style={{ fontFamily: HAND, fontWeight: 700, color: TOMATE }}>{txt}</span></div>
    </AbsoluteFill>
  );
};

// 5 · CADENA: una comida lleva a la otra — polaroids colgadas de un cordel con pinzas, unidas por flechas, cada una en su palabra
export const Cadena: P<{ bed: string; title: string; items: { t: number; k: string; txt: string }[] }> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120), n = items.length, gap = 1700 / n;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={14} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{title}</div>
      <svg width={1920} height={400} style={{ position: "absolute", left: 0, top: 220 }}><path d="M60 40 Q960 160 1860 40" stroke="#E9DCC0" strokeWidth={5} fill="none" opacity={cl(u * 2)} /></svg>
      {items.map((x, i) => {
        if (f < at(x.t)) return null;
        const v = sp(f, at(x.t), 12, 140), X = 110 + gap * i + gap / 2, rot = [-4, 3, -2, 4, -3][i % 5];
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 290 + Math.sin((i + 0.5) / n * Math.PI) * 60, translate: "-50% 0", transformOrigin: "50% 0%",
            transform: `rotate(${rot + (1 - v) * 25}deg)`, opacity: cl(v * 2) }}>
            <div style={{ width: 38, height: 70, margin: "0 auto -26px", background: "#B0855A", borderRadius: 6, position: "relative", zIndex: 2, boxShadow: "0 4px 6px rgba(0,0,0,0.4)" }} />
            <div style={{ width: Math.min(400, gap - 30), padding: "18px 18px 0", background: "#FBF8F1", boxShadow: sombra }}>
              <div style={{ height: Math.min(400, gap - 30) - 36, overflow: "hidden" }}><Img src={img(x.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ height: 110, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: TINTA, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1 }}>{x.txt}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6 · FICHA: etiqueta kraft grande colgada; título de la receta y cada medida en su palabra, con sello de la página
export const Ficha: P<{ bed: string; title: string; page: string; items: { t: number; q: string; txt: string }[] }> = ({ a, d, bed, title, page, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), s = sp(f, 20, 10, 200);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(10,8,5,0.78) 0%, rgba(10,8,5,0.4) 45%, rgba(10,8,5,0) 70%)" }} />
      <div style={{ position: "absolute", right: 120, top: -40, transformOrigin: "50% 0%", transform: `rotate(${3 - (1 - u) * 14}deg) translateY(${(1 - u) * -900}px)` }}>
        <div style={{ width: 4, height: 120, margin: "0 auto", background: "#E9DCC0" }} />
        <Etiqueta w={820} h={880}>
          <div style={{ padding: "90px 50px 0", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: OLIVA, lineHeight: 1.04, textAlign: "center" }}>{title}</div>
          <div style={{ height: 4, margin: "20px 60px 10px", background: "rgba(42,33,24,0.45)" }} />
          <div style={{ padding: "0 50px" }}>
            {items.map((x, i) => (
              <Escrito key={i} f={f} at={at(x.t) + i * 8} dur={16} style={{ fontFamily: HAND, fontSize: 66, color: TINTA, height: 116, display: "flex", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: TOMATE, minWidth: 200, marginRight: 18, whiteSpace: "nowrap", display: "inline-block" }}>{x.q}</span>{x.txt}
              </Escrito>
            ))}
          </div>
          <div style={{ position: "absolute", right: 40, bottom: 34, border: `5px solid ${OLIVA}`, color: OLIVA, borderRadius: 10, padding: "4px 20px 8px", fontFamily: SERIF, fontWeight: 900, fontSize: 42,
            transform: `rotate(-8deg) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2) }}>RECETARIO · {page}</div>
        </Etiqueta>
      </div>
    </AbsoluteFill>
  );
};

// 7 · NEVERA: la nevera abierta dibujada; en cada palabra entra un recipiente a un estante con su cinta (qué y cuántos días)
export const Nevera: P<{ bed: string; title: string; items: { t: number; txt: string; dias: string }[] }> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), door = ez(f / 18);
  const cols = [MOSTAZA, TOMATE, OLIVA2, "#8A6B4A"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={14} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 700, fontFamily: SERIF, fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{title}</div>
      <div style={{ position: "absolute", left: 900, top: 70, width: 780, height: 940, background: "#F2F4F2", borderRadius: 30, boxShadow: sombra, opacity: cl(u * 2), overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 26, background: "linear-gradient(180deg, #FFFFFF 0%, #E3ECEE 100%)", borderRadius: 16, boxShadow: "inset 0 0 40px rgba(120,160,180,0.35)" }} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 26, right: 26, top: 250 + i * 200, height: 10, background: "rgba(170,200,210,0.8)" }} />)}
        {items.map((x, i) => {
          if (f < at(x.t)) return null;
          const v = sp(f, at(x.t), 12, 150), row = i % 4, col = Math.floor(i / 4);
          return (
            <div key={i} style={{ position: "absolute", left: 60 + col * 360, top: 100 + row * 200, width: 320, height: 150, opacity: cl(v * 2), transform: `translateX(${(1 - v) * 700}px)` }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: cols[i % 4], borderRadius: 8 }} />
              <div style={{ position: "absolute", left: 8, right: 8, top: 22, bottom: 0, background: "rgba(255,255,255,0.7)", border: "4px solid rgba(255,255,255,0.95)", borderRadius: "0 0 14px 14px", boxShadow: "0 8px 16px rgba(0,0,0,0.25)" }} />
              <div style={{ position: "absolute", left: 22, right: 22, top: 56, ...cinta, padding: "2px 10px 6px", transform: "rotate(-2deg)", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: TINTA, whiteSpace: "nowrap", overflow: "hidden" }}>
                {x.txt} <span style={{ color: TOMATE }}>· {x.dias}</span></div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 860, top: 70, width: 60, height: 940, background: "#DCE0DE", borderRadius: 18, transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-70 * door}deg)`, boxShadow: sombra }} />
    </AbsoluteFill>
  );
};

// 8 · PIZARRA: la pizarrita de la cocina; el dicho se escribe con tiza letra a letra y se firma
export const Pizarra: P<{ bed: string; txt: string; sign: string; t: number }> = ({ a, d, bed, txt, sign, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 15, 100), n = Math.floor(cl((f - at(t) - 6) / 48) * txt.length);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={16} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", width: 1400, padding: "80px 100px 60px", background: `radial-gradient(ellipse at 40% 30%, #34413A 0%, ${PIZARRA} 70%)`,
        border: "26px solid #8A6440", borderRadius: 10, boxShadow: sombra, transform: `rotate(-1deg) translateY(${(1 - u) * 900}px)` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 100, lineHeight: 1.14, color: "#F1EFE6", textAlign: "center", minHeight: 240, textShadow: "0 0 3px rgba(255,255,255,0.35)" }}>
          {txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span>
        </div>
        <div style={{ textAlign: "right", fontFamily: HAND, fontSize: 66, color: MOSTAZA, marginTop: 16, opacity: cl((f - at(t) - 56) / 12) }}>— {sign}</div>
      </div>
    </AbsoluteFill>
  );
};

// 9 · TICKET: el ticket de la tienda se imprime (rollo térmico) con lo que cuesta cada cosa del plato; el total se subraya
export const Ticket: P<{ bed: string; title: string; lines: { t: number; txt: string; p: string }[]; total: Beat }> = ({ a, d, bed, title, lines, total }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const H = 260 + lines.filter((x) => f >= at(x.t)).length * 110 + (f >= at(total.t) ? 200 : 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,5,0.8) 0%, rgba(10,8,5,0.45) 50%, rgba(10,8,5,0) 75%)" }} />
      <div style={{ position: "absolute", left: 160, top: 60, width: 700, height: Math.min(960, H), background: "#FCFBF7", boxShadow: sombra, overflow: "hidden", opacity: cl(u * 2),
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 95% 98.5%, 90% 100%, 85% 98.5%, 80% 100%, 75% 98.5%, 70% 100%, 65% 98.5%, 60% 100%, 55% 98.5%, 50% 100%, 45% 98.5%, 40% 100%, 35% 98.5%, 30% 100%, 25% 98.5%, 20% 100%, 15% 98.5%, 10% 100%, 5% 98.5%, 0 100%)" }}>
        <div style={{ textAlign: "center", padding: "40px 40px 0", fontFamily: SERIF, fontWeight: 900, fontSize: 54, color: TINTA, letterSpacing: 2 }}>{title}</div>
        <div style={{ textAlign: "center", fontFamily: SERIF, fontSize: 30, color: "#777", letterSpacing: 6, marginTop: 6 }}>· · · PARA UNO · · ·</div>
        <div style={{ borderTop: "4px dashed #999", margin: "24px 40px 0" }} />
        <div style={{ padding: "10px 50px 0" }}>
          {lines.map((x, i) => f < at(x.t) ? null : (
            <div key={i} style={{ height: 110, display: "flex", alignItems: "center", fontFamily: SERIF, fontSize: 46, color: TINTA }}>
              <span style={{ flex: 1 }}>{x.txt}</span><span style={{ fontWeight: 800 }}>$ {x.p}</span></div>
          ))}
          {f >= at(total.t) ? <div style={{ borderTop: "4px dashed #999", marginTop: 10, paddingTop: 20, position: "relative" }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, color: TOMATE, textAlign: "center" }}>{total.txt}</div>
            <div style={{ height: 8, background: TOMATE, borderRadius: 4, margin: "0 auto", width: `${80 * ez((f - at(total.t) - 10) / 10)}%` }} />
          </div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 10 · DOCE: lo que queda de un pollo → 12 croquetas; aparecen una a una; 4 al plato de hoy y 8 bajan a la caja del congelador
export const Doce: P<{ bed: string; t: number; tc: number; txt: string; hoy: string; cong: string }> = ({ a, d, bed, t, tc, txt, hoy, cong }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), m = ez((f - at(tc)) / 20);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...cuadros }}>
      <AbsoluteFill style={{ background: "rgba(30,20,10,0.25)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: TINTA, opacity: cl(u * 1.6) }}>{txt}</div>
      <div style={{ position: "absolute", left: 160, top: 300, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, #FFFFFF 62%, #E6E0D2 64%, #FFFFFF 74%, #D6CEBC 100%)", boxShadow: sombra }} />
      <div style={{ position: "absolute", left: 1080, top: 330, width: 700, height: 560, borderRadius: 30, background: "rgba(230,240,245,0.85)", border: "6px solid #FFFFFF", boxShadow: sombra }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: -30, ...cinta, padding: "4px 20px 8px", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: TINTA, transform: "rotate(-2deg)" }}>{cong}</div>
      </div>
      {Array.from({ length: 12 }).map((_, i) => {
        const v = sp(f, at(t) + i * 3, 10, 180), toBox = i >= 4;
        const x0 = 260 + (i % 4) * 140, y0 = 420 + Math.floor(i / 4) * 140;
        const j = i - 4, x1 = toBox ? 1150 + (j % 4) * 150 : 330 + (i % 2) * 190, y1 = toBox ? 470 + Math.floor(j / 4) * 180 : 500 + Math.floor(i / 2) * 170;
        const k = toBox ? m : ez((f - at(tc)) / 14);
        return (
          <div key={i} style={{ position: "absolute", left: x0 + (x1 - x0) * k, top: y0 + (y1 - y0) * k, width: 130, height: 90, borderRadius: 45,
            background: "radial-gradient(ellipse at 40% 35%, #E9B566 0%, #C77F2E 60%, #9A5A1C 100%)", boxShadow: "0 8px 14px rgba(0,0,0,0.35)",
            opacity: cl(v * 2), transform: `scale(${0.4 + 0.6 * v}) rotate(${(i % 3 - 1) * 12}deg)` }} />
        );
      })}
      <div style={{ position: "absolute", left: 470, top: 940, translate: "-50% 0", fontFamily: HAND, fontWeight: 700, fontSize: 72, color: TINTA, opacity: cl((f - at(tc) - 10) / 10) }}>{hoy}</div>
    </AbsoluteFill>
  );
};

// 11 · PAN: la rebanada de pan duro al centro y alrededor sus destinos (fotos redondas) que se encienden en su palabra
export const Pan: P<{ bed: string; txt: string; items: { t: number; k: string; txt: string }[] }> = ({ a, d, bed, txt, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  const pos = [{ x: 380, y: 300 }, { x: 1540, y: 300 }, { x: 380, y: 800 }, { x: 1540, y: 800 }, { x: 960, y: 900 }];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...kraft }}>
      <div style={{ position: "absolute", left: 960, top: 470, translate: "-50% -50%", width: 520, height: 520, borderRadius: "46% 46% 18% 18%", overflow: "hidden", border: `14px solid #A0703A`,
        boxShadow: sombra, opacity: cl(u * 2), transform: `scale(${0.7 + 0.3 * u})` }}><Img src={img(bed)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ position: "absolute", left: 960, top: 60, translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: TINTA, opacity: cl(u * 1.6), whiteSpace: "nowrap" }}>{txt}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {items.map((x, i) => { const w = ez((f - at(x.t)) / 10); const p = pos[i % 5];
          return w <= 0 ? null : <line key={i} x1={960} y1={470} x2={960 + (p.x - 960) * 0.7 * w} y2={470 + (p.y - 470) * 0.7 * w} stroke={OLIVA} strokeWidth={7} strokeDasharray="16 12" strokeLinecap="round" />; })}
      </svg>
      {items.map((x, i) => {
        if (f < at(x.t)) return null;
        const v = sp(f, at(x.t) + 6, 12, 160), p = pos[i % 5];
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", textAlign: "center", opacity: cl(v * 2), transform: `scale(${0.5 + 0.5 * v})` }}>
            <div style={{ width: 250, height: 250, borderRadius: "50%", overflow: "hidden", border: `10px solid ${CREMA}`, boxShadow: sombra, margin: "0 auto" }}><Img src={img(x.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ marginTop: 8, ...cinta, padding: "2px 20px 6px", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: TINTA, whiteSpace: "nowrap" }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 12 · NOTA: nota de papel kraft sujeta con una pinza de madera; la pregunta para los comentarios se escribe a mano
export const Nota: P<{ bed: string; q: string; t: number }> = ({ a, d, bed, q, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={12} />
      <div style={{ position: "absolute", left: 960, top: 560, translate: "-50% -50%", width: 1200, height: 700, ...kraft, borderRadius: 6, boxShadow: sombra,
        transform: `rotate(${-2 + (1 - u) * 8}deg) translateY(${(1 - u) * 1000}px)` }}>
        <div style={{ position: "absolute", left: 560, top: -70, width: 80, height: 170, background: "linear-gradient(90deg, #B98C5C, #D3A877, #B98C5C)", borderRadius: 10, boxShadow: "0 8px 12px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 70, top: 110, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: OLIVA }}>Cuéntame en los comentarios</div>
        <div style={{ position: "absolute", left: 70, top: 230, width: 1060 }}>
          <Escrito f={f} at={at(t)} dur={34} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 88, color: TINTA, whiteSpace: "normal", lineHeight: 1.12 }}>{q}</Escrito>
        </div>
        <div style={{ position: "absolute", right: 70, bottom: 60, fontFamily: HAND, fontSize: 64, color: TOMATE, opacity: cl((f - at(t) - 30) / 12) }}>— la abuela Rosa ♥</div>
      </div>
    </AbsoluteFill>
  );
};

// 13 · SEMANA: siete etiquetas kraft colgadas de un cordel (DOM→SÁB), cada una con su plato hecho con lo de ayer, en su palabra
export const Semana: P<{ bed: string; title: string; days: { t: number; d: string; txt: string }[] }> = ({ a, d, bed, title, days }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={14} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{title}</div>
      <svg width={1920} height={300} style={{ position: "absolute", left: 0, top: 200 }}><path d="M30 30 Q960 130 1890 30" stroke="#E9DCC0" strokeWidth={5} fill="none" /></svg>
      {days.map((x, i) => {
        const v = at(x.t) <= 0 ? 1 : sp(f, at(x.t), 12, 150), X = 150 + i * 270;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 245 + Math.sin((i + 0.5) / 7 * Math.PI) * 70, translate: "-50% 0", transformOrigin: "50% 0%",
            transform: `rotate(${(i % 2 ? 4 : -4) + (1 - v) * 30}deg)`, opacity: cl(v * 2) }}>
            <div style={{ width: 3, height: 50, background: "#E9DCC0", margin: "0 auto" }} />
            <Etiqueta w={240} h={520}>
              <div style={{ paddingTop: 80, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 54, color: i === 0 ? TOMATE : OLIVA }}>{x.d}</div>
              <div style={{ padding: "16px 16px 0", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 48, color: TINTA, lineHeight: 1.05 }}>{x.txt}</div>
            </Etiqueta>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 14 · REGLAS: las reglas de la madre de Rosa como sellos sobre papel kraft; cada número se estampa en su palabra y la regla se escribe
export const Reglas: P<{ bed: string; title: string; items: { t: number; n: string; txt: string }[] }> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={14} />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: 1500, height: 940, ...kraft, borderRadius: 8, boxShadow: sombra, transform: `translateY(${(1 - u) * 1100}px) rotate(0.8deg)` }}>
        <div style={{ textAlign: "center", padding: "40px 0 10px", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: OLIVA }}>{title}</div>
        {items.map((x, i) => {
          const s = at(x.t) <= 0 ? 1 : sp(f, at(x.t), 8, 220), on = at(x.t) <= 0 || f >= at(x.t);
          return (
            <div key={i} style={{ height: 150, display: "flex", alignItems: "center", padding: "0 80px", opacity: on ? 1 : 0.0 }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", border: `8px solid ${TOMATE}`, color: TOMATE, fontFamily: SERIF, fontWeight: 900, fontSize: 80,
                display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${2 - s}) rotate(${-12 + 6 * s}deg)`, opacity: cl(s * 1.5), flexShrink: 0 }}>{x.n}</div>
              {at(x.t) <= 0 ? <div style={{ marginLeft: 40, fontFamily: HAND, fontWeight: 700, fontSize: 74, color: TINTA, whiteSpace: "nowrap" }}>{x.txt}</div>
                : <Escrito f={f} at={at(x.t) + 6} dur={18} style={{ marginLeft: 40, fontFamily: HAND, fontWeight: 700, fontSize: 74, color: TINTA }}>{x.txt}</Escrito>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 15 · UNA·TRES: "cocina una vez, come tres" — una olla grande se reparte en tres recipientes con su cinta de día
export const UnaTres: P<{ bed: string; t: number; txt: string; items: { t: number; txt: string }[] }> = ({ a, d, bed, t, txt, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(10,8,5,0.85) 0%, rgba(10,8,5,0.25) 55%, rgba(10,8,5,0.45) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6),
        transform: `scale(${0.85 + 0.15 * u})` }}>{txt}</div>
      {items.map((x, i) => {
        if (f < at(x.t)) return null;
        const v = sp(f, at(x.t), 12, 160), X = 480 + i * 480;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 640, translate: "-50% 0", width: 380, height: 300, opacity: cl(v * 2), transform: `translateY(${(1 - v) * 300}px)` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 34, background: [MOSTAZA, TOMATE, OLIVA2][i % 3], borderRadius: 10 }} />
            <div style={{ position: "absolute", left: 10, right: 10, top: 30, bottom: 0, background: "rgba(255,255,255,0.6)", border: "5px solid rgba(255,255,255,0.95)", borderRadius: "0 0 18px 18px", boxShadow: sombra }} />
            <div style={{ position: "absolute", left: 30, right: 30, top: 110, ...cinta, padding: "4px 12px 8px", textAlign: "center", transform: "rotate(-3deg)", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: TINTA }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── superposición: PÁGINA del recetario (etiqueta kraft con cordel que asoma abajo a la derecha cuando Rosa cita la página) ──
export const Pagina: React.FC<{ a: number; d: number; n: number; txt: string }> = ({ a, d, n, txt }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 150), o = cl((f - (d - 10)) / 10);
  return (
    <div style={{ position: "absolute", right: 70, bottom: 70, width: 560, ...kraft, borderRadius: 10, boxShadow: sombra, padding: "18px 30px 22px 90px",
      opacity: cl(u * 2) * (1 - o), transform: `translateY(${(1 - u) * 160 + o * 60}px) rotate(2deg)` }}>
      <div style={{ position: "absolute", left: 28, top: "50%", width: 34, height: 34, marginTop: -17, borderRadius: "50%", background: "rgba(40,30,20,0.85)", border: `5px solid ${CREMA}` }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 38, color: OLIVA, letterSpacing: 2 }}>RECETARIO · PÁG. {n}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: TINTA, lineHeight: 1.05 }}>{txt}</div>
    </div>
  );
};
