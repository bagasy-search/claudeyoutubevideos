// ── HÉROES de Abuela Rosa · rosa5 (los 9 trucos de los frijoles, 16-oct-2026) ──
// Mundo propio de ESTE video: la LOTERÍA de la cocina (las cartas y la tabla, que se marcan con frijoles), la pizarra de la
// cocina escrita con gis, la etiqueta de papel de estraza atada con hilo, la frijolera de barro y la bolsa del mercado.
// Contrato único: { bed, title, items: [{t, txt}] }. Cada golpe cae en SU palabra (t = segundo absoluto).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, sp, useT, cl, img, SERIF, HAND, LABEL, P } from "../lkit/core";

const ROJO = "#C8262B", VERDE = "#2E7D4F", AZUL = "#1F4E9A", AMAR = "#E8B321", CREMA = "#F4E9D0", KRAFT = "#C49A6C", FRIJOL = "#6B3A2A", TINTA = "#231A14", GIS = "#F2EFE6";
const sombra = "0 30px 64px rgba(20,10,4,0.62), 0 8px 16px rgba(0,0,0,0.35)";
type It = { t: number; txt: string };
type H = { bed: string; title: string; items: It[] };
const kraft: React.CSSProperties = { background: "linear-gradient(160deg, #D4AE80 0%, #C49A6C 55%, #B38658 100%)" };
const BORDES = [ROJO, AZUL, VERDE, AMAR];
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 16, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ ...style, clipPath: `inset(-30% ${100 - u * 112}% -30% -6%)` }}>{children}</div>;
};
// un frijol pinto dibujado (el marcador de la lotería)
const Frijol: React.FC<{ s?: number; rot?: number }> = ({ s = 60, rot = 0 }) => (
  <svg width={s} height={s * 0.66} viewBox="0 0 90 60" style={{ display: "block", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.45))" }}>
    <path d="M8 34 C4 12 34 2 52 8 C70 12 88 20 84 38 C80 56 56 58 40 52 C26 48 10 50 8 34Z" fill={FRIJOL} />
    <path d="M24 22 q8 -6 16 -2 M50 18 q10 0 14 8 M30 40 q10 4 20 0" stroke="#C99A72" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
    <ellipse cx="34" cy="20" rx="12" ry="5" fill="#fff" opacity="0.22" />
  </svg>
);
// carta de lotería: borde de color, número arriba, texto grande al centro, nombre en la franja de abajo
const Carta: React.FC<{ w: number; h: number; n: string; txt: string; name?: string; color: string; size?: number }> = ({ w, h, n, txt, name, color, size = 64 }) => (
  <div style={{ width: w, height: h, background: CREMA, borderRadius: 14, border: `10px solid ${color}`, boxShadow: sombra, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 10, border: `3px solid ${TINTA}`, borderRadius: 6 }} />
    <div style={{ position: "absolute", top: 18, left: 26, fontFamily: SERIF, fontWeight: 900, fontSize: Math.round(h * 0.09), color: TINTA }}>{n}</div>
    <div style={{ position: "absolute", top: "20%", bottom: "24%", left: 26, right: 26, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
      fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.02, color }}>{txt}</div>
    {name ? <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: "17%", background: color, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: LABEL, fontWeight: 700, fontSize: Math.round(h * 0.06), letterSpacing: 3, color: CREMA, textTransform: "uppercase" }}>{name}</div> : null}
  </div>
);
const Titulo: React.FC<{ f: number; txt: string; y?: number; size?: number }> = ({ f, txt, y = 64, size = 64 }) => {
  const u = sp(f, 3, 14, 120);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: u, transform: `translateY(${(1 - u) * -30}px)`,
    fontFamily: SERIF, fontWeight: 800, fontSize: size, color: CREMA, textShadow: "0 4px 22px rgba(0,0,0,0.8)" }}>{txt}</div>;
};
// etiqueta de estraza con su ojal e hilo
const Etiqueta: React.FC<{ w: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, children, style }) => (
  <div style={{ position: "relative", width: w, padding: "26px 40px 26px 92px", ...kraft, clipPath: "polygon(48px 0, 100% 0, 100% 100%, 48px 100%, 0 50%)", boxShadow: sombra, ...style }}>
    <div style={{ position: "absolute", left: 40, top: "50%", width: 26, height: 26, marginTop: -13, borderRadius: "50%", background: "#3a2a1c", boxShadow: "inset 0 0 0 5px #E7D2AE" }} />
    {children}
  </div>
);

// 1 · BUCLES: tres cartas de lotería que se cantan, cada una en SU palabra
export const Bucles: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const X = [330, 960, 1590], N = ["Nº 9", "Nº 0", "Nº 1"], NAME = ["los trucos", "el gasto", "el primero"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={70} />
      {items.slice(0, 3).map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t), 11, 150), rot = [-5, 1.5, 4][i];
        return (
          <div key={i} style={{ position: "absolute", left: X[i] - 250, top: 250, transformOrigin: "50% 120%",
            transform: `translateX(${(1 - u) * (960 - X[i]) }px) translateY(${(1 - u) * 500}px) rotate(${rot * u + (1 - u) * -30}deg)` }}>
            <Carta w={500} h={720} n={N[i]} txt={it.txt} name={NAME[i]} color={BORDES[i]} size={i === 2 ? 64 : 76} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 2 · RECETARIO: el libro real cae sobre el costal; dos etiquetas de estraza cuelgan con el capítulo y las páginas
export const Recetario: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 100);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 230, top: 120, width: 580, height: 850, boxShadow: sombra, borderRadius: 6, overflow: "hidden",
        transform: `translateY(${(1 - c) * -900}px) rotate(${-4 + c * 1.5}deg)` }}>
        <Img src={img("cover.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 880, top: 110, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: CREMA, opacity: c, textShadow: "0 3px 14px rgba(0,0,0,0.8)" }}>{title.toUpperCase()}</div>
      {items.slice(0, 2).map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t), 9, 120), sw = Math.sin((f - at(it.t)) / 7) * 4 * (1 - cl((f - at(it.t)) / 50));
        return (
          <div key={i} style={{ position: "absolute", left: 900 + i * 60, top: 250 + i * 330, transformOrigin: "0% 50%", transform: `rotate(${sw + (1 - u) * -50}deg)`, opacity: cl(u * 2) }}>
            <Etiqueta w={860}>
              <div style={{ fontFamily: i ? SERIF : HAND, fontWeight: i ? 900 : 700, fontSize: i ? 70 : 76, lineHeight: 1.05, color: i ? ROJO : TINTA }}>{it.txt}</div>
            </Etiqueta>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 3 · BANNER: el cartel real del recetario (banner_qr.png) en un marco de madera colgado de un clavo
export const Banner: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 10, 90), sw = Math.sin(f / 9) * 2.2 * (1 - cl(f / 60));
  const w = at(items[0]?.t ?? a + 1), e = sp(f, w, 12, 140);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 952, top: 18, width: 18, height: 18, borderRadius: "50%", background: "#555", boxShadow: "0 3px 6px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 300, top: 40, width: 1320, height: 820, transformOrigin: "50% 0%", transform: `translateY(${(1 - u) * -900}px) rotate(${sw}deg)` }}>
        <svg width={1320} height={110} style={{ position: "absolute", top: -20, left: 0 }}><path d="M660 0 L120 100 M660 0 L1200 100" stroke="#8a6a46" strokeWidth="5" /></svg>
        <div style={{ position: "absolute", top: 80, left: 0, right: 0, bottom: 0, padding: 26, background: "linear-gradient(135deg, #7a4f2c, #5a3820 50%, #7a4f2c)", borderRadius: 10, boxShadow: sombra }}>
          <Img src={img("banner_qr.png")} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 560, top: 900, transform: `scale(${e}) rotate(-2deg)`, transformOrigin: "0% 50%" }}>
        <Etiqueta w={800}><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: TINTA, whiteSpace: "nowrap" }}>{items[0]?.txt || title}</div></Etiqueta>
      </div>
    </AbsoluteFill>
  );
};

// 4 · TRUCO: la carta del truco a la izquierda; a la derecha las etiquetas se cuelgan del hilo con pinzas de ropa, una por palabra
export const Truco: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 12, 120), n = items.length;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 110, top: 170, transform: `translateX(${(1 - u) * -700}px) rotate(${-3 * u}deg)` }}>
        <Carta w={540} h={760} n="TRUCO" txt={title} name="de la abuela" color={ROJO} size={78} />
      </div>
      <svg width={1200} height={1080} style={{ position: "absolute", left: 720, top: 0 }}>
        {items.map((_, i) => <path key={i} d={`M0 ${210 + i * 260} Q600 ${250 + i * 260} 1200 ${200 + i * 260}`} stroke="#d9c7a8" strokeWidth="4" fill="none" opacity={cl(u * 2)} />)}
      </svg>
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const v = sp(f, at(it.t), 8, 150), sw = Math.sin((f - at(it.t)) / 6) * 5 * (1 - cl((f - at(it.t)) / 40));
        return (
          <div key={i} style={{ position: "absolute", left: 800 + (i % 2) * 70, top: 222 + i * 260, transformOrigin: "50% 0%", transform: `translateY(${(1 - v) * -300}px) rotate(${sw}deg)` }}>
            <div style={{ position: "absolute", left: 360, top: -40, width: 34, height: 74, background: "linear-gradient(90deg, #c9a46f, #e5c896, #c9a46f)", borderRadius: 6, zIndex: 2, boxShadow: "0 4px 6px rgba(0,0,0,0.4)" }} />
            <div style={{ width: 920, minHeight: 150, ...kraft, borderRadius: 8, boxShadow: sombra, display: "flex", alignItems: "center", gap: 28, padding: "20px 40px", boxSizing: "border-box" }}>
              <Frijol s={70} rot={i * 30} />
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: n > 3 ? 64 : 76, lineHeight: 1, color: TINTA }}>{it.txt}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 5 · OLLA: la frijolera de barro se llena de caldo negro con cada palabra; el último ítem sirve las tazas
export const Olla: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const n = items.length;
  const lvl = items.reduce((m, it) => m + sp(f, at(it.t), 16, 90) / n, 0);
  const last = sp(f, at(items[n - 1]?.t ?? a), 12, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={56} />
      <svg width={760} height={700} viewBox="0 0 760 700" style={{ position: "absolute", left: 170, top: 260 }}>
        <defs>
          <clipPath id="frijolera"><path d="M150 150 Q60 260 90 430 Q130 640 380 650 Q630 640 670 430 Q700 260 610 150 Z" /></clipPath>
          <radialGradient id="barro" cx="0.35" cy="0.35" r="0.8"><stop offset="0" stopColor="#D27A48" /><stop offset="0.6" stopColor="#A9542A" /><stop offset="1" stopColor="#6E3216" /></radialGradient>
        </defs>
        <path d="M150 150 Q60 260 90 430 Q130 640 380 650 Q630 640 670 430 Q700 260 610 150 Z" fill="url(#barro)" />
        <g clipPath="url(#frijolera)" opacity="0.92">
          <rect x="0" y={600 - 430 * cl(lvl)} width="760" height="700" fill="#3B1F14" />
          {Array.from({ length: 26 }).map((_, i) => <ellipse key={i} cx={130 + ((i * 97) % 500)} cy={610 - 430 * cl(lvl) + 30 + ((i * 53) % 380)} rx="17" ry="11" fill="#7B4630" opacity="0.9" />)}
        </g>
        <path d="M120 560 Q380 600 640 560" stroke="#F1D3A8" strokeWidth="10" fill="none" opacity="0.5" />
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={210 + i * 85} cy={520} r="10" fill="#F1D3A8" opacity="0.55" />)}
        <ellipse cx="380" cy="150" rx="240" ry="34" fill="#7E3A1A" />
        <ellipse cx="380" cy="146" rx="214" ry="24" fill="#2A140C" />
        <path d="M150 220 Q70 210 80 280 Q110 300 130 260" stroke="#8E431E" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M610 220 Q690 210 680 280 Q650 300 630 260" stroke="#8E431E" strokeWidth="22" fill="none" strokeLinecap="round" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${300 + i * 80} 110 q-24 -40 0 -80 q24 -40 0 -80`} stroke="rgba(255,255,255,0.55)" strokeWidth="10" fill="none" opacity={cl(lvl) * (0.5 + 0.5 * Math.sin(f / 12 + i))} />)}
      </svg>
      {items.map((it, i) => (
        <Escrito key={i} f={f} at={at(it.t)} dur={18} style={{ position: "absolute", left: 1000, top: 330 + i * 170, whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 84,
          color: i === n - 1 ? AMAR : CREMA, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{i === n - 1 ? "= " : "+ "}{it.txt}</Escrito>
      ))}
      <div style={{ position: "absolute", left: 1000, top: 330 + n * 170 - 40, display: "flex", gap: 14, opacity: cl(last * 1.5) }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const u = sp(f, at(items[n - 1]?.t ?? a) + 6 + i * 3, 12, 160);
          return <div key={i} style={{ width: 62, height: 50, borderRadius: "6px 6px 30px 30px", background: `linear-gradient(#E9E3D6, #BDB5A6)`, borderTop: `8px solid ${AZUL}`, transform: `scale(${u})`, boxShadow: "0 8px 12px rgba(0,0,0,0.4)" }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

// 6 · LIBRETA → aquí es la PIZARRA de la cocina: cada renglón se escribe con gis en su palabra; el último se subraya en amarillo
export const Libreta: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 110), n = items.length;
  const lastT = at(items[n - 1]?.t ?? a), und = cl((f - lastT - 16) / 14);
  const fs = n > 3 ? 58 : 68;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 210, top: 80, width: 1500, height: 920, borderRadius: 10, padding: 30, boxSizing: "border-box",
        background: "linear-gradient(135deg, #7b5432, #5b3b20 50%, #7b5432)", boxShadow: sombra, transform: `translateY(${(1 - u) * 1000}px) rotate(${-1 + (1 - u) * 5}deg)` }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 4, overflow: "hidden",
          background: "radial-gradient(ellipse at 40% 30%, #3E4A42 0%, #2F3A33 60%, #26302A 100%)" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0 40px, transparent 40px 90px)" }} />
          <div style={{ position: "absolute", top: 40, left: 70, right: 70, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: AMAR, opacity: 0.95 }}>{title}</div>
          <div style={{ position: "absolute", top: 150, left: 70, width: 600, height: 4, background: GIS, opacity: 0.5 }} />
          {items.map((it, i) => {
            const y = 200 + i * (n > 3 ? 150 : 180), isLast = i === n - 1 && n > 1;
            return (
              <div key={i} style={{ position: "absolute", top: y, left: 70 }}>
                <Escrito f={f} at={at(it.t)} dur={20} style={{ fontFamily: HAND, fontWeight: 700, fontSize: fs, color: GIS, whiteSpace: "nowrap", opacity: 0.93, textShadow: "0 0 2px rgba(255,255,255,0.35)" }}>{it.txt}</Escrito>
                {isLast ? <div style={{ position: "absolute", left: 0, top: fs + 14, height: 8, width: it.txt.length * fs * 0.42 * und, background: AMAR, borderRadius: 4, opacity: 0.9 }} /> : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 7 · LISTA: la lista escrita en la bolsa de papel del mercado; cada cosa se escribe y se palomea en su palabra
export const Lista: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 110), n = items.length;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 520, top: 60, width: 880, height: 980, transform: `translateY(${(1 - u) * 1000}px) rotate(${1.5}deg)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, ...kraft, filter: "brightness(0.88)", clipPath: "polygon(0 100%, 4% 0, 9% 100%, 14% 0, 19% 100%, 24% 0, 29% 100%, 34% 0, 39% 100%, 44% 0, 49% 100%, 54% 0, 59% 100%, 64% 0, 69% 100%, 74% 0, 79% 100%, 84% 0, 89% 100%, 94% 0, 100% 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 66, bottom: 0, ...kraft, boxShadow: sombra, borderRadius: "0 0 10px 10px" }}>
          <div style={{ position: "absolute", left: 30, top: 0, bottom: 0, width: 2, background: "rgba(0,0,0,0.12)" }} />
          <div style={{ position: "absolute", right: 30, top: 0, bottom: 0, width: 2, background: "rgba(0,0,0,0.12)" }} />
          <div style={{ position: "absolute", top: 40, left: 80, fontFamily: HAND, fontWeight: 700, fontSize: 72, color: AZUL }}>{title}</div>
          {items.map((it, i) => {
            const y = 160 + i * Math.min(120, 720 / n);
            const tick = sp(f, at(it.t) + 14, 10, 200);
            return (
              <div key={i} style={{ position: "absolute", top: y, left: 80, display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 54, height: 54, border: `4px solid ${TINTA}`, borderRadius: 6, position: "relative" }}>
                  {f >= at(it.t) + 14 ? <svg width={80} height={70} style={{ position: "absolute", left: -6, top: -22, overflow: "visible" }}>
                    <path d="M8 40 L28 60 L74 4" stroke={ROJO} strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray="120" strokeDashoffset={120 * (1 - tick)} /></svg> : null}
                </div>
                <Escrito f={f} at={at(it.t)} dur={16} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: TINTA, whiteSpace: "nowrap" }}>{it.txt}</Escrito>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 8 · TABLERO: la TABLA de lotería de 3x3 con los nueve trucos; en cada palabra cae un frijol que marca su casilla
export const Tablero: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 110), W = 330, Hh = 270;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 160, top: 300, width: 420, fontFamily: SERIF, fontWeight: 900, fontSize: 78, lineHeight: 1.05, color: CREMA, textShadow: "0 4px 22px rgba(0,0,0,0.85)", opacity: u }}>{title}</div>
      <div style={{ position: "absolute", left: 640, top: 70, width: W * 3 + 60, height: Hh * 3 + 60, padding: 20, boxSizing: "border-box", background: CREMA, borderRadius: 14,
        border: `10px solid ${VERDE}`, boxShadow: sombra, display: "grid", gridTemplateColumns: `repeat(3, ${W}px)`, gap: 10, transform: `scale(${0.7 + 0.3 * u}) rotate(${(1 - u) * 6}deg)`, opacity: cl(u * 2) }}>
        {items.slice(0, 9).map((it, i) => {
          const [num, ...rest] = it.txt.split(".");
          const on = f >= at(it.t), v = sp(f, at(it.t), 10, 220);
          return (
            <div key={i} style={{ position: "relative", height: Hh, border: `5px solid ${BORDES[i % 4]}`, borderRadius: 8, background: "#FBF4E2", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 8, left: 14, fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: BORDES[i % 4] }}>{rest.length ? num : i + 1}</div>
              <div style={{ position: "absolute", inset: "50px 14px 14px 14px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1, color: TINTA }}>{(rest.length ? rest.join(".") : it.txt).trim()}</div>
              {on ? <div style={{ position: "absolute", right: 10, top: 8, transform: `translateY(${(1 - v) * -400}px) scale(${1.6 - 0.6 * v})`, opacity: 0.96 }}><Frijol s={86} rot={(i * 37) % 60 - 30} /></div> : null}
              {on ? <div style={{ position: "absolute", inset: 0, border: `6px solid ${FRIJOL}`, borderRadius: 4, opacity: 0.35 * cl(v) }} /> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 9 · BALANZA: la balanza de platillos del mercado; la SAL cae en un platillo (al principio), el ÁCIDO (limón y tomate) en el
//   otro (al final), y el fiel se inclina con cada uno. Ítem "QUÉ: cuándo".
const Platillo: React.FC<{ que: "sal" | "acido"; v: number }> = ({ que, v }) => (
  <svg width={300} height={120} viewBox="0 0 300 120" style={{ overflow: "visible" }}>
    <path d="M10 30 Q150 130 290 30 Z" fill="#b9b2a3" stroke="#6d6658" strokeWidth="5" />
    {que === "sal"
      ? <path d={`M90 ${34 - 26 * v} Q150 ${-40 * v} 210 ${34 - 26 * v} L230 40 L70 40 Z`} fill="#FBFAF5" stroke="#d9d4c6" strokeWidth="3" opacity={cl(v * 3)} />
      : <g opacity={cl(v * 3)} transform={`translate(0 ${(1 - v) * -200})`}>
          <circle cx="115" cy="8" r="34" fill="#C8262B" /><path d="M105 -24 q10 -8 20 0" stroke={VERDE} strokeWidth="6" fill="none" />
          <ellipse cx="190" cy="14" rx="34" ry="26" fill="#7DB244" /><ellipse cx="190" cy="14" rx="22" ry="15" fill="#C9E39A" />
        </g>}
  </svg>
);
export const Balanza: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 12, 110);
  const v0 = items[0] ? sp(f, at(items[0].t), 10, 140) : 0, v1 = items[1] ? sp(f, at(items[1].t), 10, 140) : 0;
  const ang = 9 * v0 - 9 * v1;   // primero baja la sal (izq.), después el ácido la empareja
  const PLATOS: ("sal" | "acido")[] = ["sal", "acido"], COL = [AZUL, ROJO];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.58} />
      <Titulo f={f} txt={title} y={54} size={70} />
      <div style={{ position: "absolute", left: 960 - 700, top: 230, width: 1400, height: 760, transform: `translateY(${(1 - u) * 700}px)` }}>
        <div style={{ position: "absolute", left: 680, top: 120, width: 40, height: 560, background: "linear-gradient(90deg, #8a6a3a, #d2b072, #8a6a3a)", borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 560, top: 660, width: 280, height: 60, background: "linear-gradient(#a8844a, #6d5328)", borderRadius: "40px 40px 10px 10px", boxShadow: sombra }} />
        <div style={{ position: "absolute", left: 100, top: 100, width: 1200, height: 0, transform: `rotate(${ang}deg)`, transformOrigin: "600px 0" }}>
          <div style={{ position: "absolute", left: 0, top: -12, width: 1200, height: 24, background: "linear-gradient(#d2b072, #8a6a3a)", borderRadius: 12, boxShadow: "0 8px 14px rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", left: 576, top: -30, width: 48, height: 48, borderRadius: "50%", background: "#6d5328" }} />
          {PLATOS.map((q, i) => (
            <div key={i} style={{ position: "absolute", left: i ? 1050 : -150, top: 0, width: 300, transform: `rotate(${-ang}deg)`, transformOrigin: "150px 0" }}>
              <svg width={300} height={200} style={{ position: "absolute", left: 0, top: 0 }}><path d="M150 0 L20 200 M150 0 L280 200" stroke="#6d6658" strokeWidth="4" /></svg>
              <div style={{ position: "absolute", left: 0, top: 190 }}><Platillo que={q} v={i ? v1 : v0} /></div>
            </div>
          ))}
        </div>
      </div>
      {items.slice(0, 2).map((it, i) => {
        if (f < at(it.t)) return null;
        const v = sp(f, at(it.t), 10, 150); const [que, ...cuando] = it.txt.split(":");
        return (
          <div key={i} style={{ position: "absolute", left: i ? 1180 : 90, top: 760, width: 650, textAlign: "center", transform: `scale(${v}) rotate(${i ? 2 : -2}deg)`, opacity: cl(v * 2) }}>
            <div style={{ display: "inline-block", padding: "20px 44px", background: CREMA, border: `8px solid ${COL[i]}`, borderRadius: 14, boxShadow: sombra }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 60, letterSpacing: 6, color: COL[i] }}>{que.trim().toUpperCase()}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 76, lineHeight: 1, color: TINTA }}>{cuando.join(":").trim()}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── SUPERPOSICIÓN: etiqueta de estraza "Recetario de Rosa · pág. N" cuando Rosa dice la página ──
export const PageTag: P<{ page: number }> = ({ a, d, page }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 12, 150), out = cl((f - (d - 10)) / 10), sw = Math.sin(f / 7) * 3 * (1 - cl(f / 40));
  return (
    <div style={{ position: "absolute", right: 70, top: 70, transformOrigin: "100% 0%", transform: `translateY(${(1 - u) * -400 - out * 400}px) rotate(${2 + sw}deg)` }}>
      <Etiqueta w={520}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Img src={img("cover.jpg")} style={{ width: 60, height: 88, objectFit: "cover", borderRadius: 3, boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }} />
          <div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "#5a3a1c" }}>RECETARIO DE ROSA</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, lineHeight: 1, color: ROJO }}>página {page}</div>
          </div>
        </div>
      </Etiqueta>
    </div>
  );
};
