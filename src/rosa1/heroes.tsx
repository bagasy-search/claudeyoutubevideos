// ── HÉROES de Abuela Rosa · rosa1 (25 comidas cuando comes solo y no hay dinero, parte 2 · 16-oct-2026) ──
// Mundo de la cocina de Rosa: calendario de la cocina, la mesa puesta para dos, la despensa casi vacía, tarjetas de los 3 bucles,
// el recetario con su página, ficha de receta amarillenta que se escribe sola, libreta de cuentas con precios, lo que rinde,
// tres días de un muslo, precio tachado, la mesa bien puesta para uno, etiqueta de cada plato y el QR del recetario.
// Familias: Fraunces (serif) + Caveat (mano). Cada golpe en SU palabra (t = segundo absoluto). Sin grano, sin filtros.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { sp, useT, cl, ez, img, SERIF, HAND, P } from "../lkit/core";

const TERRA = "#B5562A", CREMA = "#F4E8CF", AZUL = "#1F4E8C", TINTA = "#2A211B", ROJO = "#B3261E", MOSTAZA = "#D9A21B", VERDE = "#4E6B3A";
const sombra = "0 30px 60px rgba(20,10,4,0.55), 0 6px 14px rgba(0,0,0,0.3)";
const txtSh = "0 4px 18px rgba(0,0,0,0.75)";
type Beat = { t: number; txt: string };
const papel: React.CSSProperties = { background: "radial-gradient(ellipse at 40% 30%, #FBF4E2 0%, #F1E5C6 68%, #E2CDA0 100%)" };
const papelViejo: React.CSSProperties = { background: "radial-gradient(ellipse at 60% 40%, #F6E7C1 0%, #EAD39E 60%, #D7B877 100%)" };
const madera: React.CSSProperties = {
  background: "repeating-linear-gradient(0deg, #6B4425 0px, #7A4E2B 38px, #5E3A1F 40px, #6E4627 118px, #4E3018 120px), linear-gradient(90deg, rgba(0,0,0,0.18), rgba(255,255,255,0.05), rgba(0,0,0,0.18))",
  backgroundBlendMode: "multiply",
};
// azulejo azul y blanco (CSS) para fondos
const azulejo: React.CSSProperties = {
  backgroundColor: "#F3F0E6",
  backgroundImage: `radial-gradient(circle at 50% 50%, ${AZUL} 0 9px, transparent 10px), radial-gradient(circle at 50% 50%, transparent 0 34px, ${AZUL}AA 35px 38px, transparent 39px),
    linear-gradient(45deg, transparent 47%, ${AZUL}55 48% 52%, transparent 53%), linear-gradient(-45deg, transparent 47%, ${AZUL}55 48% 52%, transparent 53%), linear-gradient(#cfc8b8 2px, transparent 2px), linear-gradient(90deg, #cfc8b8 2px, transparent 2px)`,
  backgroundSize: "120px 120px",
};
const mantel: React.CSSProperties = {
  backgroundColor: "#F7F1E4",
  backgroundImage: `linear-gradient(90deg, ${ROJO}38 50%, transparent 50%), linear-gradient(${ROJO}38 50%, transparent 50%)`,
  backgroundSize: "90px 90px",
};
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 18, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - u * 110}% -20% -5%)`, whiteSpace: "nowrap", paddingRight: 12 }}>{children}</div>;
};
const Foto: React.FC<{ k: string; f: number; style?: React.CSSProperties; z?: number }> = ({ k, f, style, z = 1.08 }) => (
  <div style={{ overflow: "hidden", ...style }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z + f * 0.0006})` }} /></div>
);
// círculo rojo dibujado a mano alrededor de algo
const Circulo: React.FC<{ u: number; w: number; h: number; color?: string }> = ({ u, w, h, color = ROJO }) => (
  <svg width={w + 60} height={h + 60} style={{ position: "absolute", left: -30, top: -30, overflow: "visible" }}>
    <ellipse cx={(w + 60) / 2} cy={(h + 60) / 2} rx={w / 2 + 12} ry={h / 2 + 8} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} transform={`rotate(-4 ${(w + 60) / 2} ${(h + 60) / 2})`} />
  </svg>
);

// 1 · CALENDARIO de la cocina: la hoja del día cae y queda el 12 de noviembre, que se encierra en rojo
export const Calendario: P<{ t: number; dia: number; mes: string; sub?: Beat }> = ({ a, d, t, dia, mes, sub }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 15, 110), hojas = [dia + 3, dia + 2, dia + 1];
  const c = cl((f - at(t) - 14) / 22), s = sub ? sp(f, at(sub.t), 14, 120) : 0;
  return (
    <AbsoluteFill style={{ ...azulejo, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(30,20,10,0.35) 100%)" }} />
      <div style={{ position: "absolute", left: 660, top: 90, width: 600, height: 820, transform: `rotate(-1.5deg) scale(${0.96 + 0.04 * u})` }}>
        <div style={{ position: "absolute", left: 270, top: -40, width: 60, height: 60, borderRadius: "50%", background: "#7a6a55", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", inset: 0, ...papel, boxShadow: sombra, borderRadius: 8 }}>
          <div style={{ height: 170, background: ROJO, borderRadius: "8px 8px 0 0", color: CREMA, fontFamily: SERIF, fontWeight: 900, fontSize: mes.length > 7 ? 74 : 96, textAlign: "center", lineHeight: "170px", letterSpacing: mes.length > 7 ? 2 : 6 }}>{mes}</div>
          <div style={{ position: "relative", textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 380, color: TINTA, lineHeight: "520px" }}>
            <span style={{ position: "relative", display: "inline-block" }}>{dia}<Circulo u={c} w={460} h={330} /></span>
          </div>
          <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 64, color: TERRA, marginTop: -40 }}>de hace seis años</div>
        </div>
        {hojas.map((n, i) => {
          const fall = cl((f - at(t) + 10 - i * 7) / 16);
          return (
            <div key={i} style={{ position: "absolute", inset: 0, top: 170, ...papel, borderRadius: 4, boxShadow: "0 10px 20px rgba(0,0,0,0.3)", opacity: 1 - fall,
              transform: `translate(${fall * (i % 2 ? 300 : -260)}px, ${ez(fall) * 900}px) rotate(${fall * (i % 2 ? 40 : -35)}deg)`, transformOrigin: "50% 0%",
              textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 380, color: "#5c5045", lineHeight: "520px" }}>{n}</div>
          );
        })}
      </div>
      {sub && <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 70, color: "#fff", textShadow: txtSh, opacity: cl(s * 1.4), transform: `translateY(${(1 - s) * 30}px)` }}>{sub.txt}</div>}
    </AbsoluteFill>
  );
};

// 2 · MESA PARA DOS: mantel visto desde arriba con dos cubiertos; en su palabra el de él se vuelve un fantasma
export const MesaDos: P<{ t1: number; t2: number; txt1: string; txt2: string }> = ({ a, d, t1, t2, txt1, txt2 }) => {
  const { f, at } = useT(a);
  const u1 = sp(f, at(t1), 14, 110), g = cl((f - at(t2)) / 30), u2 = sp(f, at(t2), 14, 110);
  const Cubierto: React.FC<{ x: number; op: number; gray: number }> = ({ x, op, gray }) => (
    <div style={{ position: "absolute", left: x, top: 260, width: 520, height: 520, opacity: op, filter: `grayscale(${gray}) blur(${gray * 1.5}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #fff 55%, #e9e4da 56%, #fff 62%, #d8d2c6 100%)", boxShadow: sombra }} />
      <div style={{ position: "absolute", left: 140, top: 140, width: 240, height: 240, borderRadius: "50%", border: `6px solid ${AZUL}55` }} />
      <div style={{ position: "absolute", left: -10, top: 120, width: 26, height: 300, borderRadius: 13, background: "linear-gradient(90deg,#bbb,#eee,#aaa)", boxShadow: "0 8px 12px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: 500, top: 120, width: 26, height: 300, borderRadius: 13, background: "linear-gradient(90deg,#bbb,#eee,#aaa)", boxShadow: "0 8px 12px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: 420, top: -40, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(200,220,235,0.5))", boxShadow: "0 8px 16px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", left: -80, top: 200, width: 120, height: 180, background: "#fff", transform: "rotate(-8deg)", boxShadow: "0 6px 10px rgba(0,0,0,0.2)", borderLeft: `8px solid ${ROJO}66` }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ ...mantel, overflow: "hidden", transform: `scale(${1.04 + 0.03 * f / Math.max(1, d)})` }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(40,20,10,0.4) 100%)" }} />
      <div style={{ transform: `translateY(${(1 - u1) * 80}px)`, opacity: cl(u1 * 1.5) }}>
        <Cubierto x={300} op={1} gray={0} />
        <Cubierto x={1100} op={1 - 0.65 * g} gray={g} />
      </div>
      <div style={{ position: "absolute", left: 300, top: 860, width: 520, textAlign: "center", fontFamily: HAND, fontSize: 70, color: TINTA, opacity: cl(u1 * 1.4) }}>{txt1}</div>
      <div style={{ position: "absolute", left: 1100, top: 860, width: 520, textAlign: "center", fontFamily: HAND, fontSize: 70, color: ROJO, opacity: cl(u2 * 1.4), transform: `rotate(-3deg) scale(${0.8 + 0.2 * u2})` }}>{txt2}</div>
    </AbsoluteFill>
  );
};

// 3 · DESPENSA: estante de madera casi vacío; cada cosa que queda aparece en su palabra con su etiqueta escrita a mano
export const Despensa: P<{ bed: string; head: Beat; items: { t: number; k: string; txt: string }[] }> = ({ a, d, bed, head, items }) => {
  const { f, at } = useT(a);
  const hu = sp(f, at(head.t), 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2b1d12" }}>
      <AbsoluteFill style={{ opacity: 0.35 }}><Foto k={bed} f={f} style={{ width: "100%", height: "100%", filter: "blur(10px)" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 140, right: 140, top: 700, height: 46, ...madera, boxShadow: "0 24px 30px rgba(0,0,0,0.6)" }} />
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t), 11, 130), x = 260 + i * (1400 / Math.max(1, items.length));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 300, width: 400, transform: `translateY(${(1 - u) * -300}px)`, opacity: cl(u * 2) }}>
            <div style={{ width: 400, height: 400, borderRadius: 26, overflow: "hidden", boxShadow: sombra, border: `10px solid ${CREMA}` }}>
              <Img src={img(it.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ ...papel, position: "absolute", left: 40, top: 420, padding: "4px 24px 8px", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: TINTA, boxShadow: sombra,
              transform: `rotate(${i % 2 ? 3 : -3}deg)`, whiteSpace: "nowrap" }}>{it.txt}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: CREMA, textShadow: txtSh,
        opacity: cl(hu * 1.5), transform: `translateY(${(1 - hu) * -30}px)` }}>{head.txt}</div>
    </AbsoluteFill>
  );
};

// 4 · CONTEO: un 25 enorme se estampa sobre una hoja del recetario; debajo, la línea que lo explica
export const Conteo: P<{ t: number; n: number; txt: string; tag?: Beat }> = ({ a, d, t, n, txt, tag }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 9, 170), g = tag ? sp(f, at(tag.t), 12, 140) : 0;
  return (
    <AbsoluteFill style={{ ...madera, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 360, top: 100, width: 1200, height: 880, boxShadow: sombra, transform: "rotate(-1deg)",
        background: "repeating-linear-gradient(transparent 0 58px, rgba(31,78,140,0.18) 58px 60px), radial-gradient(ellipse at 60% 40%, #F6E7C1 0%, #EAD39E 60%, #D7B877 100%)" }}>
        <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: 3, background: `${ROJO}66` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 420, lineHeight: 1, color: TERRA,
          transform: `scale(${2.2 - 1.2 * u}) rotate(${(1 - u) * -8}deg)`, opacity: cl(u * 2), textShadow: "0 8px 0 rgba(0,0,0,0.12)" }}>{n}</div>
        <div style={{ position: "absolute", left: 110, right: 40, top: 560, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 60, lineHeight: 1.1, color: TINTA, opacity: cl((f - at(t) - 10) / 14) }}>{txt}</div>
        {tag && <div style={{ position: "absolute", right: 90, top: 700, padding: "6px 30px", border: `6px solid ${ROJO}`, color: ROJO, fontFamily: SERIF, fontWeight: 900, fontSize: 64, letterSpacing: 4,
          transform: `rotate(-8deg) scale(${1.8 - 0.8 * g})`, opacity: cl(g * 2) }}>{tag.txt}</div>}
      </div>
    </AbsoluteFill>
  );
};

// 5 · BUCLES: tres tarjetas de recetario numeradas que se dan vuelta en su palabra (los tres platos que no hay que perderse)
export const Bucles: P<{ items: { t: number; n: number; txt: string }[] }> = ({ a, d, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ ...azulejo, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "rgba(25,18,10,0.45)" }} />
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 13, 120), x = 150 + i * 560, flip = (1 - cl(u)) * 180;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 210, width: 500, height: 660, perspective: 1400 }}>
            <div style={{ position: "absolute", inset: 0, transform: `rotateY(${flip}deg) rotate(${(i - 1) * 3}deg)`, transformStyle: "preserve-3d" }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", ...papel, boxShadow: sombra, borderTop: `26px solid ${i === 2 ? ROJO : TERRA}` }}>
                <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: TINTA, marginTop: 30 }}>Nº</div>
                <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 250, lineHeight: 1, color: i === 2 ? ROJO : TERRA }}>{it.n}</div>
                <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 56, lineHeight: 1.05, color: TINTA, padding: "26px 34px 0" }}>{it.txt}</div>
              </div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: `repeating-linear-gradient(45deg, ${TERRA} 0 20px, #9c4723 20px 40px)`, boxShadow: sombra }} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6 · RECETARIO: el libro entra sobre la mesa de madera; en su palabra se pega la etiqueta de la página
export const Recetario: P<{ t: number; page: Beat; cap: Beat; foot?: string }> = ({ a, d, t, page, cap, foot }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 14, 100), p = sp(f, at(page.t), 10, 160), c = sp(f, at(cap.t), 14, 120);
  return (
    <AbsoluteFill style={{ ...madera, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, rgba(255,220,160,0.25) 0%, rgba(0,0,0,0.45) 100%)" }} />
      <Img src={staticFile("rosa/libro1_3d.png")} style={{ position: "absolute", left: 260, top: 80, height: 920, transform: `translateY(${(1 - u) * 500}px) rotate(${(1 - u) * -10 - 3}deg)`,
        filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.6))" }} />
      <div style={{ position: "absolute", left: 1000, top: 250, width: 760, opacity: cl(c * 1.5), transform: `translateX(${(1 - c) * 120}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 82, color: CREMA, lineHeight: 1.05, textShadow: txtSh }}>{cap.txt}</div>
        {foot && <div style={{ fontFamily: HAND, fontSize: 58, color: "#F6D9A8", marginTop: 20, textShadow: txtSh }}>{foot}</div>}
      </div>
      <div style={{ position: "absolute", left: 1040, top: 620, padding: "18px 44px", background: MOSTAZA, color: TINTA, fontFamily: SERIF, fontWeight: 900, fontSize: 92, boxShadow: sombra,
        transform: `rotate(-6deg) scale(${1.6 - 0.6 * p})`, opacity: cl(p * 2) }}>{page.txt}</div>
    </AbsoluteFill>
  );
};

// 7 · BANNER del recetario con el QR (pantalla completa, empuje lento hacia el QR)
export const BannerQR: P<{}> = ({ a, d }) => {
  const { f } = useT(a);
  const u = ez(f / Math.max(1, d));
  return (
    <AbsoluteFill style={{ background: "#f4ece2", overflow: "hidden" }}>
      <Img src={staticFile("rosa/banner_qr.png")} style={{ position: "absolute", left: 150, width: 1620, height: 1080, top: 0, transform: `scale(${1 + 0.05 * u})`, transformOrigin: "78% 50%" }} />
    </AbsoluteFill>
  );
};

// 8 · FICHA de receta amarillenta: título, cantidades que se escriben en su palabra y la página abajo
export const Ficha: P<{ bed: string; title: string; page?: string; items: { t: number; q: string; txt: string }[] }> = ({ a, d, bed, title, page, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1c140d" }}>
      <AbsoluteFill style={{ opacity: 0.55 }}><Foto k={bed} f={f} style={{ width: "100%", height: "100%", filter: "blur(6px) brightness(0.8)" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 420, top: 90, width: 1080, height: 900, boxShadow: sombra, transform: `rotate(${-2 + (1 - u) * 6}deg) translateY(${(1 - u) * 300}px)`,
        background: "repeating-linear-gradient(transparent 0 66px, rgba(31,78,140,0.2) 66px 68px) 0 150px, radial-gradient(ellipse at 60% 40%, #F6E7C1 0%, #EAD39E 60%, #D7B877 100%)" }}>
        <div style={{ height: 150, borderBottom: `5px solid ${ROJO}88`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: title.length > 26 ? 62 : 76, color: TINTA, padding: "0 40px", textAlign: "center", lineHeight: 1 }}>{title}</div>
        {items.map((it, i) => (
          <Escrito key={i} f={f} at={at(it.t)} dur={16} style={{ position: "absolute", left: 70, top: 160 + i * 102, fontFamily: HAND, fontSize: 64, color: AZUL }}>
            <span style={{ display: "inline-block", width: 270, fontWeight: 700, color: ROJO }}>{it.q}</span>{it.txt}
          </Escrito>
        ))}
        {page && <div style={{ position: "absolute", right: 50, bottom: 34, fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: TERRA }}>{page}</div>}
      </div>
    </AbsoluteFill>
  );
};

// 9 · LIBRETA de cuentas: renglones con su precio a la derecha que entran en su palabra; el total se encierra en rojo
export const Libreta: P<{ head: string; rows: { t: number; txt: string; p: string }[]; total?: { t: number; txt: string; p: string } }> = ({ a, d, head, rows, total }) => {
  const { f, at } = useT(a);
  const tu = total ? cl((f - at(total.t) - 6) / 20) : 0;
  return (
    <AbsoluteFill style={{ ...madera, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 470, top: 70, width: 980, height: 940, background: "#FBF7EC", boxShadow: sombra, transform: "rotate(1.5deg)",
        backgroundImage: "repeating-linear-gradient(transparent 0 78px, rgba(31,78,140,0.22) 78px 80px), linear-gradient(90deg, transparent 760px, rgba(179,38,30,0.35) 760px 763px, transparent 763px)" }}>
        <div style={{ position: "absolute", left: -26, top: 40, bottom: 40, width: 40, background: "repeating-linear-gradient(transparent 0 30px, #555 30px 40px)", borderRadius: 8 }} />
        <div style={{ position: "absolute", left: 60, right: 40, top: 40, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: TINTA }}>{head}</div>
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <Escrito f={f} at={at(r.t)} style={{ position: "absolute", left: 70, top: 170 + i * 80, fontFamily: HAND, fontSize: 62, color: AZUL }}>{r.txt}</Escrito>
            <Escrito f={f} at={at(r.t) + 10} dur={10} style={{ position: "absolute", left: 790, top: 170 + i * 80, fontFamily: HAND, fontWeight: 700, fontSize: 62, color: TINTA }}>{r.p}</Escrito>
          </React.Fragment>
        ))}
        {total && (
          <div style={{ position: "absolute", left: 70, right: 40, top: 200 + rows.length * 80, borderTop: `4px double ${TINTA}`, paddingTop: 10 }}>
            <Escrito f={f} at={at(total.t)} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: ROJO, display: "inline-block" }}>{total.txt}</Escrito>
            <div style={{ position: "absolute", left: 690, top: 10, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: ROJO, opacity: cl((f - at(total.t) - 4) / 8) }}>
              <span style={{ position: "relative" }}>{total.p}<Circulo u={tu} w={190} h={80} /></span>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// 10 · RINDE: una cosa (foto en círculo) → en su palabra se reparten N platos alrededor
export const Rinde: P<{ k: string; one: Beat; n: number; many: Beat }> = ({ a, d, k, one, n, many }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(one.t), 13, 120), m = cl((f - at(many.t)) / 6);
  return (
    <AbsoluteFill style={{ ...mantel, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 35%, rgba(40,20,10,0.45) 100%)" }} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", width: 420, height: 420, borderRadius: "50%", overflow: "hidden", border: `14px solid ${CREMA}`, boxShadow: sombra, transform: `scale(${u})` }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {Array.from({ length: n }).map((_, i) => {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2, s = sp(f, at(many.t) + i * 5, 12, 140);
        const x = 960 + Math.cos(ang) * 420 * s, y = 520 + Math.sin(ang) * 330 * s;
        return <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", width: 190, height: 190, borderRadius: "50%", opacity: cl(s * 2),
          background: "radial-gradient(circle, #fff 52%, #e7e1d5 53%, #fff 60%, #d5cfc2 100%)", boxShadow: "0 16px 26px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: TERRA }}>{i + 1}</div>;
      })}
      <div style={{ position: "absolute", left: 60, top: 60, ...papel, padding: "10px 34px", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: TINTA, boxShadow: sombra, transform: "rotate(-3deg)", opacity: cl(u * 1.5) }}>{one.txt}</div>
      <div style={{ position: "absolute", right: 70, bottom: 60, background: ROJO, padding: "10px 38px", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CREMA, boxShadow: sombra, transform: `rotate(3deg) scale(${0.6 + 0.4 * m})`, opacity: m }}>{many.txt}</div>
    </AbsoluteFill>
  );
};

// 11 · TRES DÍAS: tres fotos tipo polaroid colgadas con broche, una por día, cada una en su palabra
export const TresDias: P<{ head: Beat; items: { t: number; k: string; day: string; txt: string }[] }> = ({ a, d, head, items }) => {
  const { f, at } = useT(a);
  const hu = sp(f, at(head.t), 14, 120);
  return (
    <AbsoluteFill style={{ ...azulejo, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "rgba(20,14,8,0.35)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 6, background: "#6b5a44", transform: "rotate(-1deg)" }} />
      {items.map((it, i) => {
        if (f < at(it.t) - 2) return null;
        const u = sp(f, at(it.t), 10, 110), sw = Math.sin((f - at(it.t)) / 9) * 6 * (1 - cl((f - at(it.t)) / 45));
        return (
          <div key={i} style={{ position: "absolute", left: 160 + i * 560, top: 140, width: 480, transformOrigin: "50% 0%", transform: `translateY(${(1 - u) * -700}px) rotate(${sw + (i - 1) * 3}deg)` }}>
            <div style={{ position: "absolute", left: 220, top: -20, width: 40, height: 80, background: "#c9a26b", borderRadius: 6, zIndex: 2, boxShadow: "0 4px 6px rgba(0,0,0,0.4)" }} />
            <div style={{ background: "#fbfaf6", padding: "24px 24px 0", boxShadow: sombra, marginTop: 30 }}>
              <div style={{ width: 432, height: 420, overflow: "hidden" }}><Img src={img(it.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ height: 150, textAlign: "center", fontFamily: HAND, color: TINTA }}>
                <div style={{ fontSize: 58, fontWeight: 700, color: ROJO }}>{it.day}</div>
                <div style={{ fontSize: 50, lineHeight: 1 }}>{it.txt}</div>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CREMA, textShadow: txtSh, opacity: cl(hu * 1.5) }}>{head.txt}</div>
    </AbsoluteFill>
  );
};

// 12 · PRECIO: etiqueta colgante; el precio de afuera se tacha y aparece el de la cocina de Rosa
export const Precio: P<{ bed: string; t1: number; old: string; oldp: string; t2: number; neu: string; neup: string }> = ({ a, d, bed, t1, old, oldp, t2, neu, neup }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t1), 13, 110), x = cl((f - at(t2)) / 10), n = sp(f, at(t2) + 8, 11, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1c140d" }}>
      <AbsoluteFill style={{ opacity: 0.7 }}><Foto k={bed} f={f} style={{ width: "100%", height: "100%", filter: "brightness(0.75)" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 300, top: 220, width: 600, height: 380, ...papel, borderRadius: "30px 30px 30px 30px", boxShadow: sombra, transform: `rotate(${-6 + Math.sin(f / 20) * 1.2}deg) translateY(${(1 - u) * -500}px)` }}>
        <div style={{ position: "absolute", left: 40, top: 40, width: 40, height: 40, borderRadius: "50%", background: "#3a2a1c" }} />
        <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 60, color: TINTA, marginTop: 70 }}>{old}</div>
        <div style={{ position: "relative", textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: oldp.length > 5 ? 88 : 130, color: TINTA, whiteSpace: "nowrap" }}>
          {oldp}
          <div style={{ position: "absolute", left: 120, top: 80, height: 14, width: 360 * x, background: ROJO, transform: "rotate(-8deg)", borderRadius: 7 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 380, width: 640, height: 400, background: VERDE, borderRadius: 30, boxShadow: sombra, transform: `rotate(4deg) scale(${n})`, opacity: cl(n * 2), color: CREMA, textAlign: "center" }}>
        <div style={{ fontFamily: HAND, fontSize: 62, marginTop: 60 }}>{neu}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: neup.length > 5 ? 96 : 140, whiteSpace: "nowrap" }}>{neup}</div>
      </div>
    </AbsoluteFill>
  );
};

// 13 · MESA BIEN PUESTA para uno: mantel, vaso bueno, servilleta… cada cosa se tilda en su palabra
export const MesaUno: P<{ bed: string; head: Beat; items: Beat[] }> = ({ a, d, bed, head, items }) => {
  const { f, at } = useT(a);
  const hu = sp(f, at(head.t), 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,12,6,0.82) 0%, rgba(20,12,6,0.55) 45%, rgba(0,0,0,0) 75%)" }} />
      <div style={{ position: "absolute", left: 110, top: 120, fontFamily: SERIF, fontWeight: 900, fontSize: 86, color: CREMA, lineHeight: 1.02, width: 900, opacity: cl(hu * 1.5), transform: `translateX(${(1 - hu) * -60}px)` }}>{head.txt}</div>
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 12, 140), c = cl((f - at(it.t) - 4) / 10);
        return (
          <div key={i} style={{ position: "absolute", left: 120, top: 420 + i * 130, display: "flex", alignItems: "center", gap: 30, opacity: cl(u * 2), transform: `translateX(${(1 - u) * -80}px)` }}>
            <div style={{ width: 84, height: 84, border: `6px solid ${CREMA}`, borderRadius: 10, position: "relative" }}>
              <svg width={110} height={100} style={{ position: "absolute", left: -6, top: -26 }}><path d="M10 55 L40 85 L100 10" fill="none" stroke={MOSTAZA} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c} /></svg>
            </div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 78, color: CREMA, textShadow: txtSh }}>{it.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 14 · RESUMEN de la cuenta del video: el más caro y el más barato en dos platos
export const Extremos: P<{ t1: number; hi: string; hip: string; t2: number; lo: string; lop: string; k1: string; k2: string }> = ({ a, d, t1, hi, hip, t2, lo, lop, k1, k2 }) => {
  const { f, at } = useT(a);
  const P1 = sp(f, at(t1), 13, 120), P2 = sp(f, at(t2), 13, 120);
  const Pl: React.FC<{ k: string; u: number; x: number; txt: string; p: string; c: string }> = ({ k, u, x, txt, p, c }) => (
    <div style={{ position: "absolute", left: x, top: 170, width: 640, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 200}px)` }}>
      <div style={{ width: 560, height: 560, margin: "0 40px", borderRadius: "50%", overflow: "hidden", border: `16px solid #fff`, boxShadow: sombra }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 64, color: CREMA, marginTop: 20, textShadow: txtSh }}>{txt}</div>
      <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: c, textShadow: txtSh }}>{p}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ ...madera, overflow: "hidden" }}>
      <Pl k={k1} u={P1} x={230} txt={hi} p={hip} c={MOSTAZA} />
      <Pl k={k2} u={P2} x={1050} txt={lo} p={lop} c="#9FD38A" />
    </AbsoluteFill>
  );
};

// ── SUPERPOSICIONES (van encima del plano que haya) ──
// etiqueta de cada plato: número, nombre, página y lo que cuesta (abajo a la izquierda, papel de recetario)
export const PlatoTag: P<{ n: number; name: string; page?: number; cost?: string }> = ({ a, d, n, name, page, cost }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 120), out = cl((f - (d - 12)) / 12);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 70, bottom: 70, display: "flex", alignItems: "stretch", boxShadow: sombra, transform: `translateX(${(1 - u) * -700 - out * 700}px) rotate(-1deg)` }}>
        <div style={{ background: TERRA, color: CREMA, fontFamily: SERIF, fontWeight: 900, fontSize: 88, padding: "6px 30px", display: "flex", alignItems: "center" }}>{n}</div>
        <div style={{ ...papel, padding: "12px 34px 14px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: name.length > 30 ? 46 : 54, color: TINTA, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: ROJO, marginTop: 2 }}>{[page ? `recetario · pág. ${page}` : "", cost || ""].filter(Boolean).join("   ·   ")}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// QR del recetario en la esquina mientras Rosa habla del libro
export const QRCorner: P<{ txt?: string }> = ({ a, d, txt }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 120), out = cl((f - (d - 10)) / 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 60, top: 60, width: 330, background: "#fff", borderRadius: 22, padding: 18, boxShadow: sombra, transform: `scale(${u * (1 - out)})`, transformOrigin: "100% 0%" }}>
        <Img src={staticFile("rosa/qr_card.png")} style={{ width: "100%", borderRadius: 10 }} />
        {txt && <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: TERRA, marginTop: 6 }}>{txt}</div>}
      </div>
    </AbsoluteFill>
  );
};
