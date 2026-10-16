// ── HÉROES de Abuela Rosa · rosa2 (25 comidas de UNA sola olla · 16-oct-2026) ──
// Mundo de la olla (nada repetido de rosa1): diario de 1962, la olla de barro que se llena desde arriba, nueve platos alrededor,
// etiqueta de frasco, tres tapas numeradas, recetario con pestaña, tres reglas en papel de estraza con broche, orden de la olla,
// frascos de la semana, rendimiento de la bolsa, perilla del fuego, monedas sobre el mantel, retrato de la boda, la semana de la
// olla del domingo, cinco secretos en placas de peltre, etiqueta esmaltada de cada plato y QR. Familias: Fraunces + Caveat.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { sp, useT, cl, ez, img, SERIF, HAND, P } from "../lkit/core";

const PELTRE = "#2C5D8A", ESMALTE = "#F2EBDD", BARRO = "#A8502A", HIERRO = "#1E1B18", CHILE = "#B3261E", OCRE = "#C99A2E", HOJA = "#5B7A3A";
const sombra = "0 30px 60px rgba(15,10,5,0.55), 0 6px 14px rgba(0,0,0,0.3)";
const txtSh = "0 4px 18px rgba(0,0,0,0.75)";
type Beat = { t: number; txt: string };
const estraza: React.CSSProperties = { background: "radial-gradient(ellipse at 35% 30%, #D8BF94 0%, #C9AA78 60%, #B8956A 100%)" };
const diario: React.CSSProperties = { background: "radial-gradient(ellipse at 50% 40%, #FAF3E1 0%, #EFE2BF 70%, #E0CC9C 100%)" };
const pino: React.CSSProperties = {
  background: "repeating-linear-gradient(90deg, #A97B4F 0px, #B88A5C 60px, #9C6F45 62px, #AE8053 150px, #92673F 152px), linear-gradient(0deg, rgba(0,0,0,0.2), rgba(255,255,255,0.05), rgba(0,0,0,0.2))",
  backgroundBlendMode: "multiply",
};
const esmaltado: React.CSSProperties = { background: `radial-gradient(circle at 30% 30%, #4A7DAA 0%, ${PELTRE} 55%, #1E4466 100%)` };
const manteles: React.CSSProperties = { backgroundColor: "#EFE6D3", backgroundImage: `repeating-linear-gradient(0deg, transparent 0 34px, ${PELTRE}30 34px 40px), repeating-linear-gradient(90deg, transparent 0 34px, ${PELTRE}30 34px 40px)` };
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 18, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - u * 110}% -20% -5%)`, whiteSpace: "nowrap", paddingRight: 12 }}>{children}</div>;
};
const Redondo: React.FC<{ k: string; size: number; border?: string }> = ({ k, size, border = ESMALTE }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: `${Math.round(size / 26)}px solid ${border}`, boxShadow: sombra }}>
    <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

// 1 · DIARIO: hoja de diario de 1962; la fecha y la línea se escriben a mano en su palabra
export const Diario: P<{ t: number; fecha: string; line: Beat; line2?: Beat }> = ({ a, d, t, fecha, line, line2 }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 100);
  return (
    <AbsoluteFill style={{ ...pino, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,230,180,0.18) 0%, rgba(0,0,0,0.5) 100%)" }} />
      <div style={{ position: "absolute", left: 380, top: 90, width: 1160, height: 900, boxShadow: sombra, transform: `rotate(${1.5 - (1 - u) * 5}deg) translateY(${(1 - u) * 200}px)`,
        background: "repeating-linear-gradient(transparent 0 70px, rgba(44,93,138,0.22) 70px 72px) 0 40px, radial-gradient(ellipse at 50% 40%, #FAF3E1 0%, #EFE2BF 70%, #E0CC9C 100%)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0))" }} />
        <Escrito f={f} at={at(t)} dur={26} style={{ position: "absolute", left: 120, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 92, color: HIERRO }}>{fecha}</Escrito>
        <div style={{ position: "absolute", left: 120, top: 200, width: 900, height: 5, background: CHILE, transform: `scaleX(${cl((f - at(t) - 20) / 14)})`, transformOrigin: "0 50%" }} />
        <Escrito f={f} at={at(line.t)} dur={30} style={{ position: "absolute", left: 120, top: 300, fontFamily: HAND, fontSize: 80, color: PELTRE }}>{line.txt}</Escrito>
        {line2 && <Escrito f={f} at={at(line2.t)} dur={26} style={{ position: "absolute", left: 120, top: 440, fontFamily: HAND, fontSize: 80, color: PELTRE }}>{line2.txt}</Escrito>}
      </div>
    </AbsoluteFill>
  );
};

// 2 · OLLA QUE SE LLENA: la olla de barro desde arriba; cada cosa cae adentro en su palabra (con onda en el caldo)
export const OllaLlena: P<{ head: Beat; items: { t: number; k: string; txt: string }[] }> = ({ a, d, head, items }) => {
  const { f, at } = useT(a);
  const hu = sp(f, at(head.t), 14, 120);
  const fill = cl(items.filter((it) => f >= at(it.t)).length / items.length);
  return (
    <AbsoluteFill style={{ ...pino, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: 560, translate: "-50% -50%", width: 820, height: 820, borderRadius: "50%", background: `radial-gradient(circle, #7A3418 58%, ${BARRO} 60%, #8C3E1C 70%, #6E2E14 100%)`, boxShadow: sombra }}>
        <div style={{ position: "absolute", inset: 90, borderRadius: "50%", background: `radial-gradient(circle at 45% 40%, ${fill > 0 ? "#B9782F" : "#3a1c0e"} 0%, #6b3a17 ${40 + 40 * fill}%, #2a140a 100%)`, overflow: "hidden" }}>
          {items.map((it, i) => {
            if (f < at(it.t)) return null;
            const u = sp(f, at(it.t), 12, 120), ang = (i / items.length) * Math.PI * 2 + 0.6;
            const x = 320 + Math.cos(ang) * 150, y = 320 + Math.sin(ang) * 150, r = cl((f - at(it.t)) / 25);
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: x, top: y, width: 60 + 360 * r, height: 60 + 360 * r, translate: "-50% -50%", borderRadius: "50%", border: `4px solid rgba(255,230,180,${0.5 * (1 - r)})` }} />
                <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", transform: `scale(${1.6 - 0.6 * u})`, opacity: cl(u * 2) }}><Redondo k={it.k} size={220} border="#e9d2a8" /></div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t) + 4, 14, 140);
        return <div key={"t" + i} style={{ position: "absolute", left: i % 2 ? 1480 : 90, top: 260 + Math.floor(i / 2) * 210, ...estraza, padding: "8px 30px", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: HIERRO, boxShadow: sombra,
          transform: `rotate(${i % 2 ? 3 : -3}deg) translateX(${(1 - u) * (i % 2 ? 300 : -300)}px)`, opacity: cl(u * 2) }}>{it.txt}</div>;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: ESMALTE, textShadow: txtSh, opacity: cl(hu * 1.5) }}>{head.txt}</div>
    </AbsoluteFill>
  );
};

// 3 · NUEVE: platos hondos de peltre que se encienden uno por uno alrededor de la olla hasta el número dicho
export const Platos: P<{ t: number; n: number; txt: string }> = ({ a, d, t, n, txt }) => {
  const { f, at } = useT(a);
  const k = Math.min(n, Math.floor(cl((f - at(t)) / 40) * n + 0.999));
  return (
    <AbsoluteFill style={{ ...manteles, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 35%, rgba(20,20,30,0.45) 100%)" }} />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, #6a2e14 55%, ${BARRO} 57%, #7a3416 100%)`, boxShadow: sombra }} />
      {Array.from({ length: n }).map((_, i) => {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2, on = i < k, s = sp(f, at(t) + (i * 40) / n, 12, 150);
        return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang) * 400, top: 540 + Math.sin(ang) * 360, translate: "-50% -50%", width: 170, height: 170, borderRadius: "50%",
          ...(on ? esmaltado : { background: "#d9d2c3" }), border: `8px solid ${ESMALTE}`, boxShadow: on ? sombra : "none", transform: `scale(${on ? 0.7 + 0.3 * s : 0.7})`,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: on ? ESMALTE : "#b9b0a0" }}>{i + 1}</div>;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: HIERRO, opacity: cl((f - at(t) - 30) / 12) }}>{txt}</div>
    </AbsoluteFill>
  );
};

// 4 · FRASCO: etiqueta de frasco de conserva con el número enorme y la promesa del video
export const Frasco: P<{ t: number; n: number; txt: string; sub?: Beat }> = ({ a, d, t, n, txt, sub }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 11, 140), s = sub ? sp(f, at(sub.t), 13, 130) : 0;
  return (
    <AbsoluteFill style={{ background: "#2a2018", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,220,160,0.25), rgba(0,0,0,0.6) 80%)" }} />
      <div style={{ position: "absolute", left: 610, top: 60, width: 700, height: 960, borderRadius: "90px 90px 60px 60px", background: "linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.28) 20%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.18) 85%)", border: "4px solid rgba(255,255,255,0.35)", boxShadow: sombra }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: -40, height: 90, borderRadius: 16, background: `repeating-linear-gradient(90deg, ${CHILE} 0 24px, #f4efe6 24px 48px)`, boxShadow: "0 8px 16px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 420, ...diario, borderRadius: 18, border: `6px double ${PELTRE}`, transform: `scale(${0.6 + 0.4 * u})`, opacity: cl(u * 2), textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 230, color: CHILE, lineHeight: 1.05 }}>{n}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: PELTRE, padding: "0 20px", lineHeight: 1 }}>{txt}</div>
        </div>
      </div>
      {sub && <div style={{ position: "absolute", right: 140, top: 160, padding: "10px 34px", background: OCRE, fontFamily: SERIF, fontWeight: 900, fontSize: 66, color: HIERRO, boxShadow: sombra, transform: `rotate(8deg) scale(${1.5 - 0.5 * s})`, opacity: cl(s * 2) }}>{sub.txt}</div>}
    </AbsoluteFill>
  );
};

// 5 · TAPAS: tres tapas de olla esmaltadas que giran y muestran su número y su promesa
export const Tapas: P<{ items: { t: number; n: number; txt: string }[] }> = ({ a, d, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ ...pino, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "rgba(10,8,5,0.35)" }} />
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 12, 110), x = 330 + i * 630;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 470, translate: "-50% -50%", opacity: cl(u * 2), transform: `rotate(${(1 - u) * -200}deg) scale(${0.5 + 0.5 * u})` }}>
            <div style={{ width: 460, height: 460, borderRadius: "50%", ...(i === 2 ? { background: `radial-gradient(circle at 30% 30%, #d84a3a, ${CHILE} 60%, #7a1810)` } : esmaltado), border: `14px solid ${ESMALTE}`, boxShadow: sombra,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 90, height: 40, borderRadius: 20, background: HIERRO, marginBottom: 10 }} />
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 190, lineHeight: 1, color: ESMALTE }}>{it.n}</div>
            </div>
            <div style={{ position: "absolute", left: "50%", top: 470, translate: "-50% 0", width: 520, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: ESMALTE, textShadow: txtSh, lineHeight: 1.05 }}>{it.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6 · RECETARIO con pestaña: el libro sobre el mantel y una pestaña de papel que sale con la página
export const RecetarioTab: P<{ t: number; page: Beat; cap: Beat; foot?: string }> = ({ a, d, t, page, cap, foot }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 14, 100), p = sp(f, at(page.t), 12, 130), c = sp(f, at(cap.t), 14, 120);
  return (
    <AbsoluteFill style={{ ...manteles, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0) 30%, rgba(20,20,30,0.5) 100%)" }} />
      <div style={{ position: "absolute", left: 1060, top: 330, width: 260 * p, height: 120, background: OCRE, boxShadow: sombra, borderRadius: "0 16px 16px 0", overflow: "hidden",
        fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: HIERRO, display: "flex", alignItems: "center", paddingLeft: 30, whiteSpace: "nowrap" }}>{page.txt}</div>
      <Img src={staticFile("rosa/libro1_3d.png")} style={{ position: "absolute", left: 420, top: 70, height: 940, transform: `translateX(${(1 - u) * -700}px) rotate(${(1 - u) * 12 + 2}deg)`, filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.55))" }} />
      <div style={{ position: "absolute", left: 1100, top: 520, width: 720, opacity: cl(c * 1.5), transform: `translateY(${(1 - c) * 60}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: HIERRO, lineHeight: 1.05 }}>{cap.txt}</div>
        {foot && <div style={{ fontFamily: HAND, fontSize: 56, color: BARRO, marginTop: 18 }}>{foot}</div>}
      </div>
    </AbsoluteFill>
  );
};

// 7 · BANNER del recetario con el QR (deriva lenta hacia la izquierda)
export const BannerQR2: P<{}> = ({ a, d }) => {
  const { f } = useT(a);
  const u = ez(f / Math.max(1, d));
  return (
    <AbsoluteFill style={{ background: "#f4ece2", overflow: "hidden" }}>
      <Img src={staticFile("rosa/banner_qr.png")} style={{ position: "absolute", width: 1920, height: 1280, top: -100, transform: `scale(${1.08 - 0.08 * u})`, transformOrigin: "20% 50%" }} />
    </AbsoluteFill>
  );
};

// 8 · REGLAS: papel de estraza colgado con broche sobre los azulejos; cada regla se escribe en su palabra
export const Reglas: P<{ head: string; items: { t: number; txt: string }[] }> = ({ a, d, head, items }) => {
  const { f, at } = useT(a);
  const sw = Math.sin(f / 18) * 1.2;
  return (
    <AbsoluteFill style={{ background: "#e9e4d6", backgroundImage: `linear-gradient(${PELTRE}55 3px, transparent 3px), linear-gradient(90deg, ${PELTRE}55 3px, transparent 3px)`, backgroundSize: "160px 160px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 340, top: 70, width: 1240, height: 940, ...estraza, boxShadow: sombra, transform: `rotate(${sw}deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 590, top: -50, width: 60, height: 130, background: "#c9a26b", borderRadius: 8, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
        <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: HIERRO, marginTop: 90 }}>{head}</div>
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: 90, top: 260 + i * 210, display: "flex", alignItems: "center", gap: 34 }}>
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: CHILE, color: ESMALTE, fontFamily: SERIF, fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${sp(f, at(it.t), 10, 160)})` }}>{i + 1}</div>
            <Escrito f={f} at={at(it.t) + 4} dur={22} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: HIERRO }}>{it.txt}</Escrito>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 9 · FRASCOS DE LA SEMANA: cinco frascos llenos que entran en fila con su día; el precio por plato al final
export const Semana: P<{ head: Beat; t: number; days: string[]; price: Beat }> = ({ a, d, head, t, days, price }) => {
  const { f, at } = useT(a);
  const hu = sp(f, at(head.t), 14, 120), pu = sp(f, at(price.t), 11, 150);
  return (
    <AbsoluteFill style={{ ...pino, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 60, background: "linear-gradient(#6b4a2c, #4a321d)", boxShadow: "0 20px 30px rgba(0,0,0,0.5)" }} />
      {days.map((dd, i) => {
        const u = sp(f, at(t) + i * 7, 12, 130);
        return (
          <div key={i} style={{ position: "absolute", left: 200 + i * 320, top: 330, width: 240, height: 380, transform: `translateY(${(1 - u) * -600}px)`, opacity: cl(u * 2) }}>
            <div style={{ position: "absolute", left: 30, right: 30, top: 0, height: 44, borderRadius: 8, background: OCRE, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 40, bottom: 0, borderRadius: "30px 30px 24px 24px", background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0 22%, #8a4a1e 22%, #6e3814 100%)`, border: "4px solid rgba(255,255,255,0.4)", boxShadow: sombra }} />
            <div style={{ position: "absolute", left: 30, right: 30, top: 170, padding: "6px 0", ...diario, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: HIERRO }}>{dd}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: ESMALTE, textShadow: txtSh, opacity: cl(hu * 1.5) }}>{head.txt}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", opacity: cl(pu * 2), transform: `scale(${1.4 - 0.4 * pu})` }}>
        <span style={{ background: CHILE, color: ESMALTE, fontFamily: SERIF, fontWeight: 900, fontSize: 84, padding: "8px 40px", boxShadow: sombra }}>{price.txt}</span>
      </div>
    </AbsoluteFill>
  );
};

// 10 · RINDE LA BOLSA: la bolsa (foto) a la izquierda y un contador que sube hasta N platos en cuadrícula
export const Bolsa: P<{ k: string; t: number; n: number; txt: string; one: string }> = ({ a, d, k, t, n, txt, one }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), c = Math.round(cl((f - at(t) + 6) / 28) * n);
  return (
    <AbsoluteFill style={{ ...manteles, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 120, top: 200, transform: `translateX(${(1 - u) * -500}px) rotate(-4deg)` }}><Redondo k={k} size={560} /></div>
      <div style={{ position: "absolute", left: 160, top: 800, width: 500, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: HIERRO, opacity: cl(u * 1.4) }}>{one}</div>
      <div style={{ position: "absolute", left: 800, top: 170, width: 1000, display: "flex", flexWrap: "wrap", gap: 26 }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{ width: 170, height: 120, borderRadius: "0 0 85px 85px", ...(i < c ? esmaltado : { background: "#d3cbbb" }), border: `6px solid ${ESMALTE}`, boxShadow: i < c ? "0 12px 18px rgba(0,0,0,0.3)" : "none",
            transform: `scale(${i < c ? 1 : 0.85})` }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 800, top: 800, fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CHILE }}>{c} <span style={{ fontSize: 66, color: HIERRO }}>{txt}</span></div>
    </AbsoluteFill>
  );
};

// 11 · PERILLA: la perilla de la estufa gira al mínimo y la llama se achica en su palabra
export const Perilla: P<{ t: number; txt: string; sub?: string }> = ({ a, d, t, txt, sub }) => {
  const { f, at } = useT(a);
  const u = ez(cl((f - at(t)) / 24)), ang = -20 + 150 * u, fl = 1 - 0.7 * u;
  return (
    <AbsoluteFill style={{ background: HIERRO, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 60%, rgba(70,110,200,0.25), rgba(0,0,0,0) 60%)" }} />
      <div style={{ position: "absolute", left: 300, top: 300, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #4a4a4a, #151515)", boxShadow: "0 20px 40px rgba(0,0,0,0.7), inset 0 0 0 10px #2b2b2b" }}>
        <div style={{ position: "absolute", left: 200, top: 30, width: 60, height: 400, borderRadius: 30, background: "linear-gradient(90deg,#2a2a2a,#666,#2a2a2a)", transform: `rotate(${ang}deg)`, transformOrigin: "50% 50%" }} />
        {["MÁX", "", "MÍN"].map((x, i) => <div key={i} style={{ position: "absolute", left: 230 + Math.cos((-110 + i * 75) * Math.PI / 180) * 300 - 50, top: 230 + Math.sin((-110 + i * 75) * Math.PI / 180) * 300 - 30, width: 100, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 40, color: "#ddd" }}>{x}</div>)}
      </div>
      <div style={{ position: "absolute", left: 1150, top: 680, display: "flex", gap: 18 }}>
        {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ width: 40, height: 160 * fl * (0.8 + 0.2 * Math.sin(f / 3 + i)), borderRadius: "50% 50% 40% 40%", alignSelf: "flex-end",
          background: "linear-gradient(0deg, #2a5bd8, #6fa0ff 60%, rgba(255,255,255,0.8))", filter: "blur(1px)", opacity: 0.9 }} />)}
      </div>
      <div style={{ position: "absolute", left: 1000, top: 300, fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: ESMALTE, opacity: cl((f - at(t)) / 10) }}>{txt}</div>
      {sub && <div style={{ position: "absolute", left: 1000, top: 420, fontFamily: HAND, fontSize: 62, color: OCRE, opacity: cl((f - at(t) - 12) / 10) }}>{sub}</div>}
    </AbsoluteFill>
  );
};

// 12 · MONEDAS sobre el mantel: caen de a una hasta formar el precio; al lado lo que se compra con eso
export const Monedas: P<{ t: number; n: number; price: string; txt: string; k: string }> = ({ a, d, t, n, price, txt, k }) => {
  const { f, at } = useT(a);
  const pu = sp(f, at(t) + n * 5 + 4, 12, 140);
  return (
    <AbsoluteFill style={{ ...manteles, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 1120, top: 180 }}><Redondo k={k} size={620} border="#fff" /></div>
      {Array.from({ length: n }).map((_, i) => {
        const u = sp(f, at(t) + i * 5, 10, 160);
        return <div key={i} style={{ position: "absolute", left: 360 + (i % 3) * 18, top: 640 - i * 26, width: 300, height: 90, borderRadius: "50%",
          background: "radial-gradient(ellipse at 40% 35%, #f3d77a, #c99a2e 60%, #8a6618)", border: "4px solid #7a5a14", boxShadow: "0 10px 14px rgba(0,0,0,0.35)",
          transform: `translateY(${(1 - u) * -700}px)`, opacity: cl(u * 3) }} />;
      })}
      <div style={{ position: "absolute", left: 250, top: 200, fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: CHILE, opacity: cl(pu * 2), transform: `scale(${1.3 - 0.3 * pu})` }}>{price}</div>
      <div style={{ position: "absolute", left: 1140, top: 840, width: 600, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 62, color: HIERRO, opacity: cl(pu * 2) }}>{txt}</div>
    </AbsoluteFill>
  );
};

// 13 · RETRATO: foto vieja en marco ovalado de madera colgada en los azulejos, con su leyenda escrita
export const Retrato: P<{ k: string; t: number; txt: string }> = ({ a, d, k, t, txt }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 100), sw = Math.sin(f / 22) * 1.5 * (1 - cl(f / 60));
  return (
    <AbsoluteFill style={{ background: "#e9e4d6", backgroundImage: `radial-gradient(circle at 50% 50%, ${PELTRE}AA 0 8px, transparent 9px), linear-gradient(#cfc8b8 2px, transparent 2px), linear-gradient(90deg, #cfc8b8 2px, transparent 2px)`, backgroundSize: "130px 130px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: 40, width: 4, height: 120, background: "#555", transform: "rotate(18deg)", transformOrigin: "50% 0" }} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", transform: `rotate(${sw}deg) scale(${0.85 + 0.15 * u})`, transformOrigin: "50% 0%" }}>
        <div style={{ width: 760, height: 860, borderRadius: "50%", background: "linear-gradient(135deg,#7a4a22,#4a2a10)", padding: 40, boxShadow: sombra }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "8px solid #d8b878" }}>
            <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.25)" }} />
          </div>
        </div>
      </div>
      <Escrito f={f} at={at(t)} dur={24} style={{ position: "absolute", left: 1380, top: 760, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: HIERRO, transform: "rotate(-4deg)" }}>{txt}</Escrito>
    </AbsoluteFill>
  );
};

// 14 · LA SEMANA DE LA OLLA DEL DOMINGO: tira de días; el domingo se cocina, el miércoles se come sin cocinar
export const Tira: P<{ items: { t: number; day: string; txt: string; hot?: boolean }[] }> = ({ a, d, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ ...pino, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "rgba(10,8,5,0.3)" }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 300, display: "flex", gap: 30 }}>
        {items.map((it, i) => {
          const u = sp(f, at(it.t), 12, 130);
          return (
            <div key={i} style={{ flex: 1, height: 480, ...diario, boxShadow: sombra, borderTop: `40px solid ${it.hot ? CHILE : PELTRE}`, transform: `translateY(${(1 - u) * 400}px) rotate(${(i - 1) * 1.5}deg)`, opacity: cl(u * 2), textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: HIERRO, marginTop: 40 }}>{it.day}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: it.hot ? CHILE : PELTRE, marginTop: 60, padding: "0 20px", lineHeight: 1.05 }}>{it.txt}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 15 · CINCO SECRETOS: placas de peltre numeradas que se clavan en su palabra (una por secreto)
export const Secretos: P<{ head: string; items: { t: number; txt: string }[] }> = ({ a, d, head, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ background: HIERRO, overflow: "hidden" }}>
      <AbsoluteFill style={{ ...pino, opacity: 0.35 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: ESMALTE, textShadow: txtSh }}>{head}</div>
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 10, 150);
        return (
          <div key={i} style={{ position: "absolute", left: 200, top: 210 + i * 160, display: "flex", alignItems: "center", gap: 30, opacity: cl(u * 2), transform: `translateX(${(1 - u) * 200}px)` }}>
            <div style={{ width: 120, height: 120, borderRadius: 18, ...esmaltado, border: `6px solid ${ESMALTE}`, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: ESMALTE, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: sombra }}>{i + 1}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: ESMALTE, textShadow: txtSh }}>{it.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── SUPERPOSICIONES ──
// etiqueta esmaltada de cada plato (arriba a la izquierda): número en círculo de peltre, nombre, página y costo
export const OllaTag: P<{ n: number; name: string; page?: number; cost?: string }> = ({ a, d, n, name, page, cost }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 13, 130), out = cl((f - (d - 12)) / 12);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, top: 60, display: "flex", alignItems: "center", gap: 0, transform: `translateY(${(1 - u) * -300 - out * 300}px)`, opacity: 1 - out }}>
        <div style={{ width: 150, height: 150, borderRadius: "50%", ...esmaltado, border: `8px solid ${ESMALTE}`, boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: ESMALTE, zIndex: 2 }}>{n}</div>
        <div style={{ marginLeft: -30, padding: "14px 34px 14px 56px", background: ESMALTE, borderRadius: "0 20px 20px 0", boxShadow: sombra, borderLeft: `6px solid ${PELTRE}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: name.length > 30 ? 44 : 52, color: HIERRO, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: BARRO }}>{[page ? `recetario · pág. ${page}` : "", cost || ""].filter(Boolean).join("   ·   ")}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
export const QRCorner2: P<{ txt?: string }> = ({ a, d, txt }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 120), out = cl((f - (d - 10)) / 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 60, bottom: 60, width: 320, background: ESMALTE, borderRadius: 24, padding: 16, boxShadow: sombra, border: `6px solid ${PELTRE}`, transform: `scale(${u * (1 - out)})`, transformOrigin: "100% 100%" }}>
        <Img src={staticFile("rosa/qr_card.png")} style={{ width: "100%", borderRadius: 10 }} />
        {txt && <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: PELTRE, marginTop: 6 }}>{txt}</div>}
      </div>
    </AbsoluteFill>
  );
};
