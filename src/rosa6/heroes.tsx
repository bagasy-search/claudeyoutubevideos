// ── HÉROES de Abuela Rosa · rosa6 (25 comidas con pan duro, 16-oct-2026) ──
// Mundo propio de ESTE video: la PANADERÍA — la bolsa de papel de estraza, el turno de la panadería, el ticket de caja que se
// imprime, el mantel de cuadros, la tabla del pan, la canasta, las estampillas de las abuelas del mundo y la perilla del horno.
// Contrato único: { bed, title, items: [{t, txt}] }. Cada golpe cae en SU palabra (t = segundo absoluto).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, sp, useT, cl, img, SERIF, HAND, LABEL, P } from "../lkit/core";

const ROJO = "#B8322A", VERDE = "#3D7A3F", AZUL = "#2B4C8C", CREMA = "#F7EFDD", KRAFT = "#C9A273", CORTEZA = "#A0612A", MIGA = "#F3DEB0", TINTA = "#241A12";
const sombra = "0 30px 64px rgba(20,10,4,0.62), 0 8px 16px rgba(0,0,0,0.35)";
type It = { t: number; txt: string };
type H = { bed: string; title: string; items: It[] };
const kraft: React.CSSProperties = { background: "linear-gradient(170deg, #D8B587 0%, #C9A273 55%, #B88E5E 100%)" };
const cuadros: React.CSSProperties = { backgroundColor: "#F4EFE6", backgroundImage: "linear-gradient(90deg, rgba(184,50,42,0.55) 50%, transparent 50%), linear-gradient(rgba(184,50,42,0.55) 50%, transparent 50%)", backgroundSize: "80px 80px" };
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 16, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ ...style, clipPath: `inset(-30% ${100 - u * 112}% -30% -6%)` }}>{children}</div>;
};
const Titulo: React.FC<{ f: number; txt: string; y?: number; size?: number }> = ({ f, txt, y = 60, size = 64 }) => {
  const u = sp(f, 3, 14, 120);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: u, transform: `translateY(${(1 - u) * -30}px)`,
    fontFamily: SERIF, fontWeight: 800, fontSize: size, color: CREMA, textShadow: "0 4px 22px rgba(0,0,0,0.8)" }}>{txt}</div>;
};
// rebanada de pan dibujada (con moho opcional)
const Rebanada: React.FC<{ s: number; moho?: boolean }> = ({ s, moho }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: "block", filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.4))" }}>
    <path d="M18 92 L18 44 C6 40 6 14 30 10 C40 2 60 2 70 10 C94 14 94 40 82 44 L82 92 Z" fill={CORTEZA} />
    <path d="M24 86 L24 40 C14 36 14 18 32 16 C42 9 58 9 68 16 C86 18 86 36 76 40 L76 86 Z" fill={MIGA} />
    {[[36, 34], [58, 30], [46, 54], [64, 62], [34, 70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill="#d9bf8a" />)}
    {moho ? [[38, 40, 9], [58, 56, 12], [44, 72, 7], [66, 34, 6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#7FA37A" : "#E9EEE4"} opacity="0.9" />) : null}
  </svg>
);
// pancito redondo con greñas (el bollo de la canasta)
const Bollo: React.FC<{ w: number; h: number; children?: React.ReactNode }> = ({ w, h, children }) => (
  <div style={{ width: w, height: h, borderRadius: "50% 50% 42% 42% / 60% 60% 40% 40%", background: "radial-gradient(ellipse at 40% 30%, #E8B46C 0%, #C98A3E 55%, #8E5422 100%)",
    boxShadow: "inset 0 -14px 24px rgba(80,40,10,0.45), 0 18px 24px rgba(0,0,0,0.45)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "absolute", top: "16%", left: "22%", right: "22%", height: 10, borderRadius: 6, background: "#F2D59A", opacity: 0.7, transform: "rotate(-8deg)" }} />
    {children}
  </div>
);

// 1 · CONTEO: la bolsa de papel de la panadería; el número se estampa en tinta roja y la frase va escrita en el ticket
export const Conteo: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const n = items[0]?.txt || "25", T = at(items[0]?.t ?? a);
  const b = sp(f, 0, 12, 110), st = sp(f, T, 9, 260), w = sp(f, T + 10, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 560, top: 90, width: 800, height: 900, transform: `translateY(${(1 - b) * 1000}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 80, ...kraft, filter: "brightness(0.85)", clipPath: "polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 76, bottom: 0, ...kraft, borderRadius: "0 0 12px 12px", boxShadow: sombra }}>
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 8, color: "#6b4a2a" }}>PANADERÍA · PAN DURO</div>
          <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 400, lineHeight: 1, color: ROJO,
            opacity: cl(st * 1.4) * 0.92, transform: `scale(${2.2 - 1.2 * st}) rotate(-7deg)`, mixBlendMode: "multiply" }}>{n}</div>
          <div style={{ position: "absolute", left: 90, right: 90, top: 600, padding: "26px 20px", background: "#FFFDF6", boxShadow: "0 8px 18px rgba(0,0,0,0.35)", transform: `rotate(2deg) translateY(${(1 - w) * 80}px)`, opacity: w, textAlign: "center",
            fontFamily: HAND, fontWeight: 700, fontSize: 76, color: TINTA }}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · BUCLES: tres boletos de turno de la panadería (los que se arrancan del rollo), cada uno en SU palabra
export const Bucles: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={70} />
      {items.slice(0, 3).map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t), 10, 160);
        const [num, ...rest] = it.txt.split(":");
        return (
          <div key={i} style={{ position: "absolute", left: 220 + i * 70, top: 250 + i * 250, width: 1480 - i * 140, height: 210, display: "flex", boxShadow: sombra,
            transform: `translateX(${(1 - u) * 1900}px) rotate(${[-1.5, 1, -0.5][i]}deg)` }}>
            <div style={{ width: 380, background: ROJO, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CREMA,
              borderRight: "6px dashed rgba(255,255,255,0.7)" }}>{num.trim()}</div>
            <div style={{ flex: 1, background: "#FFF8E8", display: "flex", alignItems: "center", padding: "0 50px", fontFamily: HAND, fontWeight: 700, fontSize: 72, color: TINTA }}>{rest.join(":").trim()}</div>
            <div style={{ position: "absolute", right: 30, top: 18, fontFamily: LABEL, fontSize: 26, letterSpacing: 4, color: ROJO, opacity: 0.8 }}>SU TURNO</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 3 · RECETARIO: el libro real sobre el mantel de cuadros; la etiqueta de precio de panadería dice el capítulo y el sello la página
export const Recetario: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 13, 100), e = sp(f, at(items[0]?.t ?? a + 1), 11, 140), pg = sp(f, at(items[1]?.t ?? a + 2), 9, 240);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 140, top: 110, width: 1640, height: 860, ...cuadros, borderRadius: 6, boxShadow: sombra, transform: `rotate(-1.5deg) scale(${0.9 + 0.1 * c})`, opacity: c }} />
      <div style={{ position: "absolute", left: 300, top: 150, width: 540, height: 790, boxShadow: sombra, borderRadius: 6, overflow: "hidden", transform: `translateX(${(1 - c) * -900}px) rotate(${3 - 2 * c}deg)` }}>
        <Img src={img("cover.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 930, top: 260, width: 760, padding: "30px 40px", background: "#FFFDF6", border: `8px solid ${AZUL}`, borderRadius: 10, boxShadow: sombra,
        transform: `scale(${e}) rotate(-2deg)`, opacity: cl(e * 2) }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: AZUL }}>{title.toUpperCase()}</div>
        <div style={{ marginTop: 14, fontFamily: SERIF, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: TINTA }}>{items[0]?.txt}</div>
      </div>
      <div style={{ position: "absolute", left: 1130, top: 600, width: 380, height: 380, borderRadius: "50%", border: `9px solid ${ROJO}`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        fontFamily: SERIF, fontWeight: 900, fontSize: 46, lineHeight: 1.05, color: ROJO, opacity: cl(pg * 1.4) * 0.9, transform: `scale(${2 - pg}) rotate(-12deg)`, mixBlendMode: "multiply", padding: 30, boxSizing: "border-box" }}>{items[1]?.txt}</div>
    </AbsoluteFill>
  );
};

// 4 · BANNER: el cartel real del recetario (banner_qr.png) apoyado en la tabla del pan, con la frase en una tira de papel
export const Banner: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 12, 100), e = sp(f, at(items[0]?.t ?? a + 1), 12, 140);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 230, top: 70, width: 1460, height: 860, transform: `translateY(${(1 - u) * 1000}px)` }}>
        <div style={{ position: "absolute", left: 650, top: -60, width: 160, height: 120, borderRadius: "60px 60px 10px 10px", background: "linear-gradient(90deg, #8a5a30, #b07a46, #8a5a30)" }}>
          <div style={{ position: "absolute", left: 50, top: 22, width: 60, height: 40, borderRadius: 30, background: "#2a1a0e" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, padding: 34, background: "linear-gradient(100deg, #9b6a3c, #c08b55 30%, #a8743f 60%, #c69159)", borderRadius: 26, boxShadow: sombra }}>
          <Img src={img("banner_qr.png")} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", opacity: cl(e * 2) }}>
        <div style={{ padding: "16px 50px", background: "#FFFDF6", boxShadow: "0 10px 20px rgba(0,0,0,0.45)", transform: `rotate(-1deg) scale(${0.8 + 0.2 * e})`, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: TINTA }}>{items[0]?.txt || title}</div>
      </div>
    </AbsoluteFill>
  );
};

// 5 · LIBRETA → aquí es el TICKET DE CAJA de la panadería: sale impreso renglón por renglón; el último se encierra en rojo
export const Libreta: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const n = items.length, step = n > 3 ? 120 : 150;
  const shown = items.filter((it) => f >= at(it.t)).length;
  const len = 230 + shown * step + 60;
  const H0 = sp(f, 0, 14, 120) * 230 + items.reduce((m, it) => m + sp(f, at(it.t), 14, 140) * step, 0) + 60;
  const lastT = at(items[n - 1]?.t ?? a), ring = cl((f - lastT - 16) / 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 560, top: 30, width: 800, height: 46, borderRadius: 10, background: "linear-gradient(#4b4f55, #2c2f33)", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 600, top: 60, width: 720, height: Math.min(H0, len), overflow: "hidden", background: "#FFFEF8", boxShadow: sombra,
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), 96% 100%, 92% calc(100% - 14px), 88% 100%, 84% calc(100% - 14px), 80% 100%, 76% calc(100% - 14px), 72% 100%, 68% calc(100% - 14px), 64% 100%, 60% calc(100% - 14px), 56% 100%, 52% calc(100% - 14px), 48% 100%, 44% calc(100% - 14px), 40% 100%, 36% calc(100% - 14px), 32% 100%, 28% calc(100% - 14px), 24% 100%, 20% calc(100% - 14px), 16% 100%, 12% calc(100% - 14px), 8% 100%, 4% calc(100% - 14px), 0 100%)" }}>
        <div style={{ padding: "40px 50px 0" }}>
          <div style={{ textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: "#555" }}>PANADERÍA DE LA ESQUINA</div>
          <div style={{ marginTop: 16, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: TINTA }}>{title}</div>
          <div style={{ marginTop: 22, borderTop: "4px dashed #999" }} />
          {items.map((it, i) => {
            const isLast = i === n - 1 && n > 1;
            return (
              <div key={i} style={{ position: "relative", height: step, display: "flex", alignItems: "center", fontFamily: i === n - 1 ? SERIF : HAND, fontWeight: 700, fontSize: n > 3 ? 56 : 62, color: isLast ? ROJO : TINTA }}>
                {it.txt}
                {isLast && ring > 0 ? <svg style={{ position: "absolute", left: -24, top: 6, overflow: "visible" }} width={660} height={step - 12}>
                  <ellipse cx={330} cy={(step - 12) / 2} rx={325} ry={(step - 12) / 2} fill="none" stroke={ROJO} strokeWidth={6} strokeDasharray={2200} strokeDashoffset={2200 * (1 - ring)} strokeLinecap="round" /></svg> : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 6 · TABLERO: la charola de la panadería; cada comida es un bollo que se acomoda en SU palabra
export const Tablero: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={50} />
      <div style={{ position: "absolute", left: 170, top: 200, width: 1580, height: 820, borderRadius: 24, background: "linear-gradient(135deg, #9aa0a6, #c9cdd1 40%, #8d9399)", boxShadow: sombra,
        transform: `translateY(${(1 - u) * 900}px)` }}>
        <div style={{ position: "absolute", inset: 22, borderRadius: 16, background: "linear-gradient(135deg, #3a3d40, #55595d)" }} />
      </div>
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const v = sp(f, at(it.t), 10, 170), col = i % 3, row = Math.floor(i / 3);
        return (
          <div key={i} style={{ position: "absolute", left: 250 + col * 500, top: 260 + row * 380, transform: `translateY(${(1 - v) * -600}px) rotate(${((i * 13) % 7) - 3}deg)` }}>
            <Bollo w={440} h={330}>
              <div style={{ padding: "8px 26px", background: "rgba(255,253,246,0.94)", borderRadius: 8, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: TINTA, boxShadow: "0 4px 8px rgba(0,0,0,0.3)", transform: "rotate(-3deg)", whiteSpace: "nowrap" }}>{it.txt}</div>
            </Bollo>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 7 · REGLA: dos rebanadas frente a frente — la seca con su palomita verde, la del moho con la cruz roja
export const Regla: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.6} />
      <Titulo f={f} txt={title} y={60} size={70} />
      {items.slice(0, 2).map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t), 10, 150), m = sp(f, at(it.t) + 12, 9, 220);
        const [k, ...r] = it.txt.split(":");
        return (
          <div key={i} style={{ position: "absolute", left: i ? 1030 : 230, top: 230, width: 660, textAlign: "center", transform: `translateY(${(1 - u) * 700}px)` }}>
            <div style={{ display: "inline-block", position: "relative" }}>
              <Rebanada s={480} moho={i === 1} />
              <svg width={300} height={300} viewBox="0 0 100 100" style={{ position: "absolute", right: -70, bottom: -40, overflow: "visible" }}>
                {i === 0
                  ? <path d="M14 54 L40 80 L90 14" stroke={VERDE} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="140" strokeDashoffset={140 * (1 - m)} />
                  : <g stroke={ROJO} strokeWidth="13" strokeLinecap="round"><path d="M16 16 L84 84" strokeDasharray="100" strokeDashoffset={100 * (1 - m)} /><path d="M84 16 L16 84" strokeDasharray="100" strokeDashoffset={100 * (1 - cl(m * 2 - 1))} /></g>}
              </svg>
            </div>
            <div style={{ marginTop: 30, fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: CREMA, textShadow: "0 4px 18px rgba(0,0,0,0.85)" }}>{k.trim()}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, color: i ? "#FF8A7A" : "#9BE39C", textShadow: "0 4px 18px rgba(0,0,0,0.85)", opacity: m }}>{r.join(":").trim()}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 8 · GUARDAR: la bolsa del congelador; las rebanadas entran y cada paso aparece con su escarcha
export const Guardar: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 12, 110), n = items.length;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={60} />
      <div style={{ position: "absolute", left: 170, top: 210, width: 640, height: 780, borderRadius: 26, border: "4px solid rgba(255,255,255,0.75)",
        background: "linear-gradient(120deg, rgba(220,235,250,0.35), rgba(255,255,255,0.12) 40%, rgba(220,235,250,0.3))", boxShadow: sombra, transform: `scale(${0.8 + 0.2 * u})`, opacity: u, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 50, height: 14, background: AZUL, opacity: 0.85 }} />
        {Array.from({ length: 6 }).map((_, i) => {
          const v = sp(f, 8 + i * 5, 12, 140);
          return <div key={i} style={{ position: "absolute", left: 90 + (i % 2) * 210, top: 120 + Math.floor(i / 2) * 210, transform: `translateY(${(1 - v) * -800}px) rotate(${(i * 23) % 14 - 7}deg)` }}><Rebanada s={240} /></div>;
        })}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(60deg, rgba(255,255,255,0.08) 0 6px, transparent 6px 30px)" }} />
      </div>
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const v = sp(f, at(it.t), 11, 150);
        return (
          <div key={i} style={{ position: "absolute", left: 920, top: 280 + i * (n > 3 ? 170 : 220), display: "flex", alignItems: "center", gap: 30, transform: `translateX(${(1 - v) * 900}px)` }}>
            <svg width={80} height={80} viewBox="0 0 100 100"><g stroke="#DCEBFA" strokeWidth="9" strokeLinecap="round">{[0, 60, 120].map((r) => <path key={r} d="M50 8 L50 92 M38 18 L50 30 L62 18 M38 82 L50 70 L62 82" transform={`rotate(${r} 50 50)`} fill="none" />)}</g></svg>
            <div style={{ padding: "18px 40px", background: "#FFFDF6", borderRadius: 10, boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: TINTA, whiteSpace: "nowrap" }}>{it.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 9 · MUNDO: las abuelas del mundo como estampillas de correo; cada país se pega en SU palabra con su matasellos
export const Mundo: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const COL = [ROJO, VERDE, AZUL, "#C27C1E", "#5B4B8A", "#2F7F86"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={50} />
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t), 10, 170), col = i % 3, row = Math.floor(i / 3), sello = cl((f - at(it.t) - 10) / 10);
        const [pais, ...plato] = it.txt.split(":");
        return (
          <div key={i} style={{ position: "absolute", left: 200 + col * 540, top: 200 + row * 420, width: 480, height: 370, transform: `scale(${1.5 - 0.5 * u}) rotate(${((i * 11) % 9) - 4}deg)`, opacity: cl(u * 2) }}>
            <div style={{ position: "absolute", inset: 0, background: "#FFFDF6", boxShadow: sombra, WebkitMaskImage: "radial-gradient(circle at 10px 10px, transparent 9px, black 10px)", WebkitMaskSize: "28px 28px", WebkitMaskPosition: "-4px -4px" }} />
            <div style={{ position: "absolute", inset: 22, background: COL[i % 6], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, letterSpacing: 5, color: CREMA }}>{pais.trim().toUpperCase()}</div>
              <div style={{ marginTop: 14, fontFamily: HAND, fontWeight: 700, fontSize: 62, lineHeight: 1, color: "#FFF6DF" }}>{plato.join(":").trim()}</div>
            </div>
            <svg width={220} height={140} style={{ position: "absolute", right: -60, top: -30, opacity: sello * 0.75, overflow: "visible" }}>
              <circle cx="70" cy="70" r="58" fill="none" stroke="#2a2a2a" strokeWidth="5" />
              {[0, 1, 2, 3].map((k) => <path key={k} d={`M130 ${40 + k * 18} q22 -10 44 0 q22 10 44 0`} stroke="#2a2a2a" strokeWidth="5" fill="none" />)}
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 10 · REVIVIR: la perilla del horno gira hasta 180 y el reloj de cocina marca los minutos; cada dato cae en SU palabra
export const Revivir: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 12, 110);
  const t1 = at(items[1]?.t ?? a), t2 = at(items[2]?.t ?? a);
  const ang = -135 + 200 * sp(f, t1, 16, 80), arc = sp(f, t2, 30, 40);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={60} />
      <div style={{ position: "absolute", left: 220, top: 260, width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f4f4f2, #c8c8c4 70%, #9c9c98)", boxShadow: sombra, transform: `scale(${u})` }}>
        {Array.from({ length: 11 }).map((_, i) => {
          const r = -135 + i * 27;
          return <div key={i} style={{ position: "absolute", left: 316, top: 30, width: 8, height: 44, background: TINTA, transformOrigin: "4px 290px", transform: `rotate(${r}deg)`, opacity: 0.7 }} />;
        })}
        <div style={{ position: "absolute", left: 120, top: 120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3a3a3a, #111)", transform: `rotate(${ang}deg)` }}>
          <div style={{ position: "absolute", left: 186, top: 20, width: 28, height: 150, borderRadius: 14, background: "#E84A2A" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: ROJO, opacity: cl((f - t1 - 12) / 10) }}>180°</div>
      </div>
      <svg width={300} height={300} viewBox="0 0 100 100" style={{ position: "absolute", left: 1480, top: 760, opacity: cl((f - t2) / 8) }}>
        <circle cx="50" cy="50" r="44" fill="#FFFDF6" stroke={TINTA} strokeWidth="4" />
        <path d={`M50 50 L50 10 A40 40 0 ${arc > 0.5 ? 1 : 0} 1 ${50 + 40 * Math.sin(arc * Math.PI * 2 * 0.999)} ${50 - 40 * Math.cos(arc * Math.PI * 2 * 0.999)} Z`} fill={ROJO} opacity="0.8" />
        <circle cx="50" cy="50" r="4" fill={TINTA} />
      </svg>
      {items.map((it, i) => (
        <Escrito key={i} f={f} at={at(it.t)} dur={16} style={{ position: "absolute", left: 960, top: 300 + i * 150, whiteSpace: "nowrap", fontFamily: i === 1 ? SERIF : HAND, fontWeight: 800, fontSize: 84, color: CREMA, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{it.txt}</Escrito>
      ))}
    </AbsoluteFill>
  );
};

// 11 · PUNTAS: siete platos en la mesa y un solo pan con dos puntas que brillan
export const Puntas: P<H> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const t0 = at(items[0]?.t ?? a), t1 = at(items[1]?.t ?? a + 1);
  const pan = sp(f, 0, 12, 110), glow = cl((f - t1) / 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <Titulo f={f} txt={title} y={60} size={72} />
      <div style={{ position: "absolute", left: 160, top: 250, display: "flex", gap: 34 }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const v = sp(f, t0 + i * 3, 10, 180);
          return (
            <div key={i} style={{ width: 190, height: 190, borderRadius: "50%", background: "radial-gradient(circle, #FFFDF6 0 52%, #E9E1CF 53% 64%, #FFFDF6 65%)", border: `5px solid ${["#2B4C8C", "#B8322A"][i % 2]}`,
              boxShadow: "0 12px 18px rgba(0,0,0,0.4)", transform: `scale(${v})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: TINTA }}>{i + 1}</div>
          );
        })}
      </div>
      <svg width={1300} height={340} viewBox="0 0 1300 340" style={{ position: "absolute", left: 310, top: 560, transform: `translateY(${(1 - pan) * 600}px)`, overflow: "visible" }}>
        <defs><radialGradient id="pt" cx="0.5" cy="0.35" r="0.7"><stop offset="0" stopColor="#E8B46C" /><stop offset="0.6" stopColor="#C2803A" /><stop offset="1" stopColor="#7E4A1C" /></radialGradient></defs>
        <path d="M60 170 C60 60 260 40 650 40 C1040 40 1240 60 1240 170 C1240 280 1040 300 650 300 C260 300 60 280 60 170Z" fill="url(#pt)" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${330 + i * 150} 90 q60 40 40 130`} stroke="#F2D59A" strokeWidth="14" fill="none" opacity="0.7" strokeLinecap="round" />)}
        {[150, 1150].map((x, i) => <ellipse key={i} cx={x} cy={170} rx={140 + 30 * glow} ry={150 + 30 * glow} fill="none" stroke="#FFD86B" strokeWidth={10} opacity={glow * (0.6 + 0.4 * Math.sin(f / 5))} />)}
      </svg>
      {items.map((it, i) => (
        <Escrito key={i} f={f} at={at(it.t)} dur={14} style={{ position: "absolute", left: i ? 1180 : 200, top: 940, whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: i ? "#FFD86B" : CREMA, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{it.txt}</Escrito>
      ))}
    </AbsoluteFill>
  );
};

// ── SUPERPOSICIÓN: tira de papel de la panadería "Recetario de Rosa · pág. N" cuando Rosa dice la página ──
export const PageTag: P<{ page: number }> = ({ a, d, page }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 13, 150), out = cl((f - (d - 10)) / 10);
  return (
    <div style={{ position: "absolute", left: 70, top: 70, display: "flex", alignItems: "center", gap: 18, padding: "14px 30px 14px 18px", background: "#FFFDF6", borderRadius: 4,
      boxShadow: "0 10px 26px rgba(0,0,0,0.5)", borderTop: `10px solid ${ROJO}`, transform: `translateY(${(1 - u) * -300 - out * 300}px) rotate(-2deg)` }}>
      <Img src={img("cover.jpg")} style={{ width: 58, height: 84, objectFit: "cover", borderRadius: 3, boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }} />
      <div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: ROJO }}>RECETARIO DE ROSA</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, lineHeight: 1, color: TINTA }}>página {page}</div>
      </div>
    </div>
  );
};
