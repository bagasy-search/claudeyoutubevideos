// ── HÉROES de Abuela Rosa · rosa4 (25 comidas de pobre para sobrevivir, 16-oct-2026) ──
// El mundo de Rosa: papel de recetario amarillento, libreta de cuentas a lápiz, azulejo azul y blanco, barro, la olla que se
// llena, la despensa de siete frascos, el calendario de la cocina. Cada golpe cae en SU palabra (t = segundo absoluto).
// Contrato único: { bed, title, items: [{t, txt}] }. Familias: Fraunces (serif) + Caveat (mano).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, sp, useT, cl, img, SERIF, HAND, P } from "../lkit/core";

const AZUL = "#23408E", CREMA = "#F6EEDC", BARRO = "#B5562A", ROSA = "#C9707E", TINTA = "#2A211B", LAPIZ = "#3B3A44", ROJO = "#B3261E";
const sombra = "0 34px 70px rgba(20,10,4,0.6), 0 8px 16px rgba(0,0,0,0.35)";
type It = { t: number; txt: string };
type H = { bed: string; title: string; items: It[] };
const papel: React.CSSProperties = { background: "radial-gradient(ellipse at 35% 25%, #FBF3DD 0%, #F0E2BE 62%, #E2CC98 100%)" };
const rayas: React.CSSProperties = { backgroundImage: "repeating-linear-gradient(180deg, transparent 0 62px, rgba(35,64,142,0.22) 62px 64px)" };
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 16, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ ...style, clipPath: `inset(-30% ${100 - u * 112}% -30% -6%)`, whiteSpace: "nowrap" }}>{children}</div>;
};
// marco de azulejo (borde talavera dibujado)
const Azulejo: React.FC<{ s?: number }> = ({ s = 90 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: "block" }}>
    <rect width="100" height="100" fill="#F7F3EA" />
    <circle cx="50" cy="50" r="22" fill="none" stroke={AZUL} strokeWidth="6" />
    {[0, 90, 180, 270].map((r) => <path key={r} d="M50 8 Q60 28 50 30 Q40 28 50 8Z" fill={AZUL} transform={`rotate(${r} 50 50)`} />)}
    {[45, 135, 225, 315].map((r) => <circle key={r} cx="50" cy="12" r="5" fill={AZUL} transform={`rotate(${r} 50 50)`} />)}
    <circle cx="50" cy="50" r="8" fill={AZUL} />
  </svg>
);
const Cenefa: React.FC<{ n: number; s?: number; style?: React.CSSProperties }> = ({ n, s = 70, style }) => (
  <div style={{ display: "flex", ...style }}>{Array.from({ length: n }).map((_, i) => <Azulejo key={i} s={s} />)}</div>
);
const Titulo: React.FC<{ f: number; txt: string; y?: number; color?: string; size?: number }> = ({ f, txt, y = 70, color = CREMA, size = 66 }) => {
  const u = sp(f, 3, 14, 120);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: u, transform: `translateY(${(1 - u) * -30}px)`,
    fontFamily: SERIF, fontWeight: 800, fontSize: size, color, textShadow: "0 4px 22px rgba(0,0,0,0.75)", letterSpacing: 0.5 }}>{txt}</div>;
};

// 1 · CONTEO: la tarjeta de recetario con el número que se estampa como sello de goma
export const Conteo: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const n = items[0]?.txt || "25", T = at(items[0]?.t ?? a);
  const card = sp(f, 0, 13, 110), st = sp(f, T, 9, 260), w = sp(f, T + 10, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 460, top: 150, width: 1000, height: 780, ...papel, borderRadius: 10, boxShadow: sombra,
        transform: `translateY(${(1 - card) * 700}px) rotate(${-2 + (1 - card) * 8}deg)` }}>
        <Cenefa n={14} s={71} style={{ position: "absolute", top: 0, left: 3 }} />
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 380, lineHeight: 1,
          color: ROJO, opacity: cl(st * 1.4), transform: `scale(${2.2 - 1.2 * st}) rotate(-6deg)`, textShadow: "0 0 1px rgba(0,0,0,0.3)", mixBlendMode: "multiply" }}>{n}</div>
        <Escrito f={f} at={T + 10} dur={26} style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 82, color: TINTA }}>
          <span style={{ opacity: w }}>{title}</span>
        </Escrito>
      </div>
    </AbsoluteFill>
  );
};

// 2 · BUCLES: tres fichas de recetario prendidas con alfiler, cada una entra en SU palabra
export const Bucles: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const X = [300, 960, 1620];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={80} />
      {items.slice(0, 3).map((it, i) => {
        const u = sp(f, at(it.t), 12, 130); if (f < at(it.t)) return null;
        const [num, ...rest] = it.txt.split(":");
        const rot = [-4, 2, -2][i];
        return (
          <div key={i} style={{ position: "absolute", left: X[i] - 260, top: 280, width: 520, height: 600, ...papel, borderRadius: 8, boxShadow: sombra,
            transform: `translateY(${(1 - u) * 600}px) rotate(${rot + (1 - u) * 14}deg)`, opacity: cl(u * 1.5) }}>
            <div style={{ position: "absolute", top: -18, left: 240, width: 40, height: 40, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ff8a8a, ${ROJO})`, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
            <div style={{ ...rayas, position: "absolute", inset: "90px 30px 30px 30px" }} />
            <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: i === 2 ? ROJO : AZUL }}>{num.trim()}</div>
            <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, lineHeight: 1.05, color: TINTA }}>{rest.join(":").trim()}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 3 · RECETARIO: la tapa REAL del libro + la página que se abre con el capítulo y el sello de la página
export const Recetario: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 100), op = sp(f, at(items[0]?.t ?? a + 1), 14, 90), pg = sp(f, at(items[1]?.t ?? a + 2), 10, 240);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 250 - op * 60, top: 130, width: 560, height: 820, transform: `translateY(${(1 - c) * 800}px) rotate(${-3 + op * 1}deg)`, boxShadow: sombra, borderRadius: 6, overflow: "hidden" }}>
        <Img src={img("cover.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 860, top: 160, width: 820, height: 760, ...papel, borderRadius: 6, boxShadow: sombra, transformOrigin: "0% 50%",
        transform: `perspective(1800px) rotateY(${(1 - op) * -95}deg)`, opacity: cl(op * 3) }}>
        <div style={{ ...rayas, position: "absolute", inset: "230px 60px 60px 60px" }} />
        <div style={{ position: "absolute", top: 60, left: 60, right: 60, fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: BARRO, letterSpacing: 1.5, whiteSpace: "nowrap" }}>{title.toUpperCase()}</div>
        <div style={{ position: "absolute", top: 130, left: 60, right: 60, fontFamily: SERIF, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: TINTA }}>{items[0]?.txt}</div>
        <div style={{ position: "absolute", right: 70, bottom: 70, padding: "14px 30px", border: `6px solid ${ROJO}`, borderRadius: 12, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: ROJO,
          opacity: cl(pg * 1.4), transform: `scale(${2 - pg}) rotate(-8deg)`, mixBlendMode: "multiply" }}>{items[1]?.txt}</div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · BANNER: el cartel del recetario con el QR (archivo real banner_qr.png) sobre mantel, con la frase escrita debajo
export const Banner: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), w = at(items[0]?.t ?? a + 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 260, top: 90, width: 1400, height: 788, borderRadius: 14, overflow: "hidden", boxShadow: sombra, border: `10px solid ${CREMA}`,
        transform: `scale(${0.85 + 0.15 * u}) translateY(${(1 - u) * 300}px)`, opacity: cl(u * 1.6) }}>
        <Img src={img("banner_qr.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <Escrito f={f} at={w} dur={22} style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: CREMA, textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}>
        {items[0]?.txt || title}
      </Escrito>
    </AbsoluteFill>
  );
};

// 5 · LIBRETA: la libreta de cuentas de la madre; cada renglón se escribe a lápiz en su palabra y el último se encierra en rojo
export const Libreta: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), n = items.length;
  const lastT = at(items[n - 1]?.t ?? a);
  const ring = cl((f - lastT - 18) / 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 380, top: 90, width: 1160, height: 900, ...papel, borderRadius: "6px 18px 18px 6px", boxShadow: sombra,
        transform: `translateY(${(1 - u) * 900}px) rotate(${1.5 - (1 - u) * 6}deg)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 46, background: "linear-gradient(90deg, #6b4b2a, #8a6440)", borderRadius: "6px 0 0 6px" }} />
        <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 3, background: "rgba(179,38,30,0.45)" }} />
        <div style={{ ...rayas, position: "absolute", inset: "170px 40px 40px 60px" }} />
        <div style={{ position: "absolute", top: 60, left: 160, right: 40, fontFamily: HAND, fontWeight: 700, fontSize: 74, color: AZUL }}>{title}</div>
        {items.map((it, i) => {
          const y = 196 + i * (n > 4 ? 128 : 150);
          const isLast = i === n - 1 && n > 1;
          return (
            <div key={i} style={{ position: "absolute", top: y, left: 160 }}>
              <Escrito f={f} at={at(it.t)} dur={20} style={{ fontFamily: HAND, fontWeight: 700, fontSize: n > 4 ? 62 : 72, color: LAPIZ }}>{it.txt}</Escrito>
              {isLast && ring > 0 ? (
                <svg style={{ position: "absolute", left: -30, top: -26, overflow: "visible" }} width={it.txt.length * 33 + 60} height={130}>
                  <ellipse cx={(it.txt.length * 33 + 60) / 2} cy={65} rx={(it.txt.length * 33 + 40) / 2} ry={55} fill="none" stroke={ROJO} strokeWidth={7}
                    strokeDasharray={1600} strokeDashoffset={1600 * (1 - ring)} strokeLinecap="round" />
                </svg>
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 6 · OLLA: la olla de aluminio abollada se llena (nivel sube con cada ítem) y los tazones salen al final
export const Olla: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const n = items.length;
  const lvl = items.reduce((m, it, i) => m + sp(f, at(it.t), 16, 90) / Math.max(1, n - 1) * (i < n - 1 ? 1 : 0), 0);
  const bowls = sp(f, at(items[n - 1]?.t ?? a), 12, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={60} />
      <svg width={760} height={620} viewBox="0 0 760 620" style={{ position: "absolute", left: 200, top: 300 }}>
        <defs><clipPath id="olla"><path d="M80 120 L680 120 L650 560 Q380 600 110 560 Z" /></clipPath>
          <linearGradient id="alu" x1="0" x2="1"><stop offset="0" stopColor="#8d949b" /><stop offset="0.45" stopColor="#e3e7ea" /><stop offset="1" stopColor="#7b8188" /></linearGradient></defs>
        <path d="M80 120 L680 120 L650 560 Q380 600 110 560 Z" fill="url(#alu)" />
        <g clipPath="url(#olla)"><rect x="0" y={560 - 420 * cl(lvl)} width="760" height="620" fill="#F3EBDD" />
          <rect x="0" y={560 - 420 * cl(lvl)} width="760" height="18" fill="#fffaf0" opacity="0.8" /></g>
        <path d="M200 230 q30 40 0 80" stroke="#6f767c" strokeWidth="8" fill="none" opacity="0.5" />
        <rect x="60" y="100" width="640" height="34" rx="16" fill="#a7adb3" />
        <rect x="0" y="150" width="90" height="26" rx="12" fill="#5b5f63" /><rect x="670" y="150" width="90" height="26" rx="12" fill="#5b5f63" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${260 + i * 110} 90 q-25 -40 0 -80 q25 -40 0 -80`} stroke="rgba(255,255,255,0.55)" strokeWidth="10" fill="none" opacity={cl(lvl) * (0.5 + 0.5 * Math.sin(f / 12 + i))} />)}
      </svg>
      {items.slice(0, n - 1).map((it, i) => (
        <Escrito key={i} f={f} at={at(it.t)} dur={18} style={{ position: "absolute", left: 1040, top: 360 + i * 140, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: CREMA, textShadow: "0 4px 18px rgba(0,0,0,0.85)" }}>+ {it.txt}</Escrito>
      ))}
      <div style={{ position: "absolute", left: 1000, top: 360 + (n - 1) * 140, display: "flex", gap: 12, opacity: cl(bowls * 1.5) }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const u = sp(f, at(items[n - 1]?.t ?? a) + i * 3, 12, 160);
          return <div key={i} style={{ width: 70, height: 46, borderRadius: "0 0 40px 40px", background: `linear-gradient(${BARRO}, #8C3E1C)`, transform: `scale(${u})`, boxShadow: "0 8px 12px rgba(0,0,0,0.4)" }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 1000, top: 430 + (n - 1) * 140, fontFamily: HAND, fontWeight: 700, fontSize: 72, color: CREMA, opacity: bowls, textShadow: "0 4px 18px rgba(0,0,0,0.85)" }}>{items[n - 1]?.txt}</div>
    </AbsoluteFill>
  );
};

// 7 · DESPENSA: estante de madera; cada frasco con su etiqueta de papel entra en SU palabra
export const Despensa: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const n = items.length, w = Math.min(230, 1640 / n);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={70} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 760, height: 46, background: "linear-gradient(#8a5a33, #5e3a1f)", boxShadow: "0 20px 30px rgba(0,0,0,0.5)", borderRadius: 4 }} />
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 11, 170); if (f < at(it.t)) return null;
        const x = 960 - (n * w) / 2 + i * w;
        return (
          <div key={i} style={{ position: "absolute", left: x + 10, top: 400, width: w - 20, height: 360, transform: `translateY(${(1 - u) * -500}px)`, opacity: cl(u * 2) }}>
            <div style={{ position: "absolute", left: "18%", right: "18%", top: 0, height: 40, background: i % 2 ? BARRO : AZUL, borderRadius: 6 }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 34, bottom: 0, borderRadius: "22px 22px 14px 14px", background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.3))", border: "3px solid rgba(255,255,255,0.55)" }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "62%", borderRadius: "0 0 12px 12px", background: ["#efe6d2", "#e8c35a", "#d9c7a0", "#c9a77a", "#f1e7cf", "#efe3c8", "#d6a93a"][i % 7] }} />
              <div style={{ position: "absolute", left: "8%", right: "8%", top: "34%", padding: "10px 4px", ...papel, borderRadius: 4, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: Math.min(46, w / 4.4), color: TINTA, boxShadow: "0 3px 6px rgba(0,0,0,0.3)", transform: `rotate(${(i % 3) - 1}deg)` }}>{it.txt}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 8 · CALENDARIO: el almanaque de la cocina; cada día se llena con su comida a lápiz en SU palabra
export const Calendario: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 170, top: 70, width: 1580, height: 940, ...papel, borderRadius: 8, boxShadow: sombra, transform: `translateY(${(1 - u) * -1000}px)` }}>
        <div style={{ position: "absolute", top: -26, left: 770, width: 40, height: 40, borderRadius: "50%", background: "#555", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }} />
        <div style={{ height: 150, background: AZUL, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: CREMA }}>{title}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, padding: 24 }}>
          {items.map((it, i) => {
            const [day, dish] = it.txt.split(":");
            return (
              <div key={i} style={{ height: 350, border: `3px solid rgba(35,64,142,0.35)`, borderRadius: 8, padding: 18, background: "rgba(255,255,255,0.25)" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: i === 6 ? ROJO : AZUL, textTransform: "uppercase" }}>{day}</div>
                <Escrito f={f} at={at(it.t)} dur={18} style={{ marginTop: 40, fontFamily: HAND, fontWeight: 700, fontSize: 54, lineHeight: 1.05, color: LAPIZ, whiteSpace: "normal" }}>{(dish || "").trim()}</Escrito>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 9 · TABLERO: el resumen; las comidas nombradas se clavan como fichas sobre el azulejo
export const Tablero: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <Titulo f={f} txt={title} y={60} />
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 12, 150); if (f < at(it.t)) return null;
        const col = i % 3, row = Math.floor(i / 3);
        return (
          <div key={i} style={{ position: "absolute", left: 200 + col * 520, top: 260 + row * 330, width: 480, height: 270, ...papel, borderRadius: 8, boxShadow: sombra,
            transform: `scale(${0.6 + 0.4 * u}) rotate(${((i * 7) % 5) - 2}deg)`, opacity: cl(u * 1.5), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: 14, left: 14 }}><Azulejo s={46} /></div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: TINTA, textAlign: "center", padding: "0 30px" }}>{it.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── SUPERPOSICIÓN: lengüeta de papel "Recetario de Rosa · pág. N" cuando Rosa dice la página ──
export const PageTag: P<{ page: number }> = ({ a, d, page }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 13, 150), out = cl((f - (d - 10)) / 10);
  return (
    <div style={{ position: "absolute", left: 70, bottom: 80, display: "flex", alignItems: "center", gap: 18, padding: "16px 30px 16px 22px", ...papel, borderRadius: 10,
      boxShadow: "0 10px 26px rgba(0,0,0,0.5)", borderLeft: `14px solid ${AZUL}`, transform: `translateX(${(1 - u) * -700 - out * 700}px) rotate(-1.5deg)` }}>
      <Img src={img("cover.jpg")} style={{ width: 62, height: 90, objectFit: "cover", borderRadius: 3, boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }} />
      <div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: BARRO }}>Recetario de la Abuela Rosa</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, lineHeight: 1, color: TINTA }}>página {page}</div>
      </div>
    </div>
  );
};
