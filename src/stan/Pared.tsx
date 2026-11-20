// Kit "Pared" del Constructor Libre (cl19d, tapar agujeros en la pared): todo nace del AGUJERO, la MASILLA y la ESPÁTULA.
// La placa beige se rompe y se tapa, la espátula barre y deja masilla, el papel se infla, la luz rasante delata, el ladrillo chupa agua.
// PURO CSS y DOM: sin SVG, sin blur grande, sin backdrop-filter. Ningún mecanismo de Obra/Muro/Piso/Frasco se repite.
// Lecciones del EVALUADOR: legible desde el primer cuadro (entradas ≤ 8 cuadros), placas opacas, letra secundaria ≥ 46 px,
// máximo dos renglones y una idea, siempre algo en movimiento, nada cortado contra el borde.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL } from "./Kit";

const { SERIF, SANS, HAND } = FONTS as any;
export const W = { yeso: "#F3EEE4", beige: "#DCCBAA", beigeL: "#E8DCC4", beigeD: "#B9A57F", papel: "#C9C3B6", gris: "#8F8A80", ink: "#22201C", mas: "#F7F5EF", lad: "#A9553A", ladD: "#7A3725", rev: "#BDB4A4", acero: "#C3CAD0", rojo: "#C8372D", ok: "#4E9A57", luz: "#FFE7A8", noche: "rgba(20,17,13,0.9)" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 15) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.6 } });
const out = (f: number, dur: number, len = 4) => interpolate(f, [dur - len, dur], [1, 0], CL);
const tsh = "0 3px 14px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)";
const Pic: React.FC<{ src: string; style?: React.CSSProperties; fit?: "cover" | "contain" }> = ({ src, style, fit = "cover" }) => <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, ...style }} />;
const Fondo: React.FC<{ bg?: string; dur: number; seed?: number; side?: "left" | "right" | "bottom" | "all"; k?: number }> = ({ bg, dur, seed = 5, side = "left", k = 0.78 }) => {
  const g = side === "all" ? `rgba(18,15,11,${k * 0.62})` : side === "bottom" ? `linear-gradient(0deg, rgba(18,15,11,${k}) 0%, rgba(18,15,11,${k * 0.5}) 45%, transparent 75%)` : `linear-gradient(${side === "left" ? 90 : 270}deg, rgba(18,15,11,${k}) 0%, rgba(18,15,11,${k * 0.6}) 45%, transparent 78%)`;
  return <AbsoluteFill>{bg ? <Photo src={bg} seed={seed} dur={dur} /> : <Muro />}<AbsoluteFill style={{ background: g }} /></AbsoluteFill>;
};
// la pared beige de placa: pintura con rodillo (piel de naranja muy suave) y una luz que entra de costado
const Muro: React.FC<{ tone?: string; style?: React.CSSProperties }> = ({ tone = W.beigeL, style }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 30% 20%, rgba(255,250,238,0.55), transparent 70%), repeating-radial-gradient(circle at 37% 41%, rgba(0,0,0,0.018) 0 2px, transparent 2px 5px), ${tone}`, ...style }} />
);
const Ladrillo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <AbsoluteFill style={{ background: `repeating-linear-gradient(0deg, #8E8579 0 8px, transparent 8px 92px), repeating-linear-gradient(90deg, #8E8579 0 8px, transparent 8px 210px), linear-gradient(160deg, ${W.lad}, ${W.ladD})`, ...style }} />
);
// un agujero de verdad en la placa: borde de papel roto, yeso desmenuzado, oscuridad atrás
const Hueco: React.FC<{ w: number; h?: number; x: number; y: number; k?: number; style?: React.CSSProperties }> = ({ w, h, x, y, k = 1, style }) => {
  const hh = h ?? w * 0.86;
  return <div style={{ position: "absolute", left: x - (w * k) / 2, top: y - (hh * k) / 2, width: w * k, height: hh * k, borderRadius: "46% 54% 41% 59% / 55% 43% 57% 45%", background: "radial-gradient(ellipse at 45% 40%, #0B0907 40%, #2A241D 70%, #EDE6D6 74%, #CFC6B4 82%, transparent 86%)", boxShadow: "0 0 0 6px rgba(255,255,255,0.35)", ...style }} />;
};
const Kick: React.FC<{ txt: string; color?: string; style?: React.CSSProperties }> = ({ txt, color = W.luz, style }) => <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: 4, color, textShadow: tsh, ...style }}>{txt}</div>;
const Titulo: React.FC<{ txt: string; size?: number; color?: string; f0?: number; style?: React.CSSProperties }> = ({ txt, size = 92, color = "#FFF8EE", f0 = 0, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 16);
  return <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1.06, color, textShadow: color === "#FFF8EE" ? tsh : "none", opacity: cl(p * 1.6), transform: `translateY(${(1 - p) * 18}px)`, ...style }}>{txt}</div>;
};
const Placa: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; edge?: string }> = ({ children, style, edge = W.beigeD }) => <div style={{ background: W.noche, borderLeft: `12px solid ${edge}`, padding: "24px 38px 28px", boxShadow: "0 24px 50px rgba(0,0,0,0.55)", ...style }}>{children}</div>;
// espátula: hoja de acero con mango de madera; `a` = ángulo
const Espatula: React.FC<{ x: number; y: number; w?: number; a?: number; carga?: boolean }> = ({ x, y, w = 320, a = 0, carga }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.9, transform: `rotate(${a}deg)`, transformOrigin: "50% 0" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: w * 0.42, background: `linear-gradient(180deg, #EEF2F5, ${W.acero} 60%, #9AA3AA)`, clipPath: "polygon(0 0,100% 0,78% 100%,22% 100%)", boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }} />
    {carga ? <div style={{ position: "absolute", left: w * 0.06, top: -12, width: w * 0.88, height: 26, borderRadius: 14, background: W.mas, boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.08)" }} /> : null}
    <div style={{ position: "absolute", left: w * 0.42, top: w * 0.4, width: w * 0.16, height: w * 0.5, borderRadius: 12, background: "linear-gradient(90deg,#7A4E2A,#A8743F,#7A4E2A)" }} />
  </div>
);
const Tilde: React.FC<{ ok: boolean; size?: number; style?: React.CSSProperties }> = ({ ok, size = 110, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: ok ? W.ok : W.rojo, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: size * 0.62, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.4)", ...style }}>{ok ? "✓" : "✕"}</div>
);

// ---------- apertura de método: un agujero en la placa; la espátula pasa y lo deja tapado, y en la masilla queda el número
export const MetodoD: React.FC<{ n: number; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame(); const pass = interpolate(f, [2, 16], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) }); const p = sp(f, 12, 14);
  const ex = -260 + pass * 1100;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={src} dur={dur} side="left" k={0.62} />
      <div style={{ position: "absolute", left: 110, top: 150, width: 760, height: 520, overflow: "hidden", boxShadow: "0 40px 70px rgba(0,0,0,0.6)", borderRadius: 6 }}>
        <Muro />
        <Hueco w={300} x={380} y={260} style={{ opacity: 1 - cl((ex - 240) / 160) }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: cl(ex, 0, 760), background: `linear-gradient(90deg, ${W.mas}, #EFEBE1)`, boxShadow: "inset -10px 0 14px rgba(0,0,0,0.05)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 230, lineHeight: 1, color: W.ink, textShadow: "-3px -3px 0 rgba(255,255,255,0.9), 5px 6px 0 rgba(0,0,0,0.22)", opacity: cl(p * 1.4) }}>{n}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 54, letterSpacing: 6, color: "#3A342C", opacity: cl(p * 1.4) }}>MÉTODO {n} DE {total}</div>
        {pass < 1 ? <Espatula x={ex - 60} y={-30} w={360} a={88} /> : null}
      </div>
      <div style={{ position: "absolute", left: 110, top: 710, width: 1100 }}><Titulo txt={title} size={title.length > 30 ? 74 : 88} f0={10} /></div>
    </AbsoluteFill>
  );
};

// ---------- índice y progreso: la pared de práctica con 12 agujeros; se tapan de a uno mientras aparece su nombre
export const AgujerosD: React.FC<{ head: string; items: { n: number; t: string }[]; done?: number; dur: number }> = ({ head, items, done, dur }) => {
  const f = useCurrentFrame(); const k = done !== undefined ? done : interpolate(f, [6, Math.max(60, dur - 24)], [0, 12], CL);
  const cur = Math.min(11, Math.floor(k));
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 6, color: "#5A5246" }}>{head}</div>
      {items.map((it, i) => { const col = i % 6, row = Math.floor(i / 6); const x = 195 + col * 306, y = 290 + row * 330; const tap = cl(k - i); const now = done === undefined && i === cur;
        return <div key={i}>
          <Hueco w={150 + ((i * 37) % 50)} x={x} y={y} style={{ opacity: 1 - tap }} />
          <div style={{ position: "absolute", left: x - 110, top: y - 92, width: 220, height: 184, borderRadius: "48% 52% 46% 54%", background: `radial-gradient(ellipse, ${W.mas} 55%, rgba(247,245,239,0) 72%)`, opacity: tap, transform: `scale(${0.7 + 0.3 * tap})` }} />
          <div style={{ position: "absolute", left: x - 130, top: y - 40, width: 260, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 64, color: tap > 0.5 ? "#B7AD9C" : "#FFF", textShadow: tap > 0.5 ? "none" : tsh }}>{it.n}</div>
          {now ? <div style={{ position: "absolute", left: x - 100, top: y - 100, width: 200, height: 200, borderRadius: "50%", boxShadow: `0 0 0 8px ${W.rojo}` }} /> : null}
        </div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center" }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 84, padding: "10px 40px", whiteSpace: "nowrap" }}>{done !== undefined ? "Faltan el 10, el 11 y el 12" : `${items[cur].n} · ${items[cur].t}`}</span></div>
    </AbsoluteFill>
  );
};

// ---------- cinco minutos: el número aparece en relieve de masilla, la espátula lo alisa y debajo «de trabajo»
export const CincoD: React.FC<{ big: string; sub: string; dur: number }> = ({ big, sub, dur }) => {
  const f = useCurrentFrame(); const pass = interpolate(f, [0, 14], [0, 1], { ...CL, easing: ease }); const p = sp(f, 8, 14);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 330, lineHeight: 1, color: "#3A342C", textShadow: "-4px -4px 0 rgba(255,255,255,0.85), 7px 9px 0 rgba(0,0,0,0.25), 12px 16px 26px rgba(0,0,0,0.25)", clipPath: `inset(0 ${(1 - pass) * 100}% 0 0)` }}>{big}</div>
      {pass < 1 ? <Espatula x={pass * 1800 + 60} y={170} w={420} a={80} carga /> : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", opacity: cl(p * 1.5), transform: `translateY(${(1 - p) * 20}px)` }}>
        <span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 80, padding: "12px 40px" }}>{sub}</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- la honestidad: una regla de obra con dos tramos — el corto es tu trabajo, el largo es el secado
export const ReglaD: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const k1 = interpolate(f, [4, 18], [0, 1], { ...CL, easing: ease }); const k2 = interpolate(f, [22, 60], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2A251E,#15120E)" }}>
      <div style={{ position: "absolute", left: 120, right: 120, top: 430, height: 120, background: "linear-gradient(180deg,#F2D35B,#D9B53A)", borderRadius: 10, boxShadow: "0 24px 40px rgba(0,0,0,0.5)", backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0 3px, transparent 3px 56px)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${16 * k1}%`, background: "rgba(78,154,87,0.92)", borderRadius: "10px 0 0 10px" }} />
        <div style={{ position: "absolute", left: "16%", top: 0, bottom: 0, width: `${84 * k2}%`, background: "repeating-linear-gradient(135deg, rgba(120,110,95,0.9) 0 18px, rgba(150,140,124,0.9) 18px 36px)" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 190, opacity: k1 }}><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 96, color: "#8FDB98" }}>5 min</div><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: "#FFF8EE" }}>{a}</div></div>
      <div style={{ position: "absolute", left: 720, top: 620, opacity: k2 }}><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 80, color: "#FFF8EE" }}>{b}</div><Kick txt="ESO NO LO APURA NADIE" color="#D9CFBF" style={{ marginTop: 10 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- la placa por dentro: se abre en corte, papel · yeso · papel, y el calibre marca 12,5 mm
export const PlacaD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const k = interpolate(f, [4, 30], [0, 1], { ...CL, easing: ease }); const c = sp(f, 30, 14);
  const capa = (h: number, bg: string, y: number, lbl: string, d: number) => { const q = sp(f, d, 14); return <div style={{ position: "absolute", left: 200, width: 1100, top: y, height: h, background: bg, transform: `translateX(${(1 - q) * -200}px)`, opacity: cl(q * 2), boxShadow: "0 6px 12px rgba(0,0,0,0.25)" }}><div style={{ position: "absolute", left: 1140, top: h / 2 - 34, width: 500, fontFamily: SANS, fontWeight: 600, fontSize: 54, color: "#FFF8EE", whiteSpace: "nowrap" }}>{lbl}</div></div>; };
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      {capa(34, "linear-gradient(180deg,#F4EFE6,#DDD6C8)", 300, "papel de la cara", 0)}
      {capa(300, "repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,0.05) 0 3px, transparent 3px 9px), #ECE6DA", 334 + 8 * k, "yeso", 6)}
      {capa(34, "linear-gradient(180deg,#B3ADA2,#8F897E)", 642 + 16 * k, "papel gris de atrás", 12)}
      <div style={{ position: "absolute", left: 90, top: 300, width: 70, height: 376 + 16 * k, borderTop: "8px solid #F2D35B", borderBottom: "8px solid #F2D35B", opacity: cl(c * 1.5) }}><div style={{ position: "absolute", left: 30, top: 0, bottom: 0, width: 8, background: "#F2D35B" }} /></div>
      <div style={{ position: "absolute", left: 200, top: 120, opacity: cl(c * 1.5) }}><span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 120, color: "#F2D35B" }}>12,5 mm</span></div>
      <div style={{ position: "absolute", left: 200, top: 800, opacity: cl(c * 1.5) }}><Kick txt="ATORNILLADA A PERFILES DE METAL O LISTONES" color="#D9CFBF" /></div>
    </AbsoluteFill>
  );
};

// ---------- el golpe del nudillo: en la placa salen anillos anchos (tambor), en el ladrillo uno solo, seco
export const GolpeD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const anillos = (x: number, t0: number, n: number, col: string) => Array.from({ length: n }, (_, i) => { const t = (f - t0 - i * 6) % 48; const r = t < 0 ? 0 : t * 9; return <div key={i} style={{ position: "absolute", left: x - r, top: 470 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `8px solid ${col}`, opacity: t < 0 ? 0 : cl(1 - t / 40) }} />; });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 960, overflow: "hidden" }}><Muro />{anillos(480, 6, 4, "rgba(80,70,55,0.7)")}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center" }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 84, padding: "8px 34px" }}>Placa: hueca</span></div></div>
      <div style={{ position: "absolute", left: 960, top: 0, bottom: 0, right: 0, overflow: "hidden" }}><Ladrillo />{anillos(480, 20, 1, "rgba(255,240,220,0.85)")}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center" }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 84, padding: "8px 34px" }}>Ladrillo: seco</span></div></div>
      <div style={{ position: "absolute", left: 954, top: 0, bottom: 0, width: 12, background: "#14110D" }} />
    </AbsoluteFill>
  );
};

// ---------- los cables: desde el enchufe se encienden la línea vertical y la horizontal; la diagonal se tacha en rojo
export const CablesD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const v = interpolate(f, [6, 26], [0, 1], { ...CL, easing: ease }); const h = interpolate(f, [20, 40], [0, 1], { ...CL, easing: ease }); const d = sp(f, 44, 12);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 860, top: 640, width: 150, height: 210, borderRadius: 18, background: "#FBFAF6", boxShadow: "0 10px 20px rgba(0,0,0,0.25)" }}>
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 52, top: 80, width: 18, height: 46, borderRadius: 6, background: "#2A2621" }} />)}</div>
      <div style={{ position: "absolute", left: 927, top: 640 - 640 * v, width: 16, height: 640 * v, background: "#F2C230", boxShadow: "0 0 24px rgba(242,194,48,0.85)" }} />
      <div style={{ position: "absolute", left: 1010, top: 737, width: 900 * h, height: 16, background: "#F2C230", boxShadow: "0 0 24px rgba(242,194,48,0.85)" }} />
      <div style={{ position: "absolute", left: 860, top: 640, width: 700 * cl(d), height: 16, background: W.rojo, transformOrigin: "0 50%", transform: "rotate(-34deg)", opacity: cl(d * 2) }} />
      <div style={{ position: "absolute", left: 1290, top: 250, opacity: cl(d * 2), transform: `scale(${0.6 + 0.4 * d})` }}><Tilde ok={false} size={140} /></div>
      <div style={{ position: "absolute", left: 110, top: 110, width: 700 }}><Titulo txt="Derechos, nunca en diagonal" size={86} color={W.ink} /><Kick txt="DESDE EL ENCHUFE O LA LLAVE" color="#6E665A" style={{ textShadow: "none", marginTop: 14, whiteSpace: "nowrap" }} /></div>
    </AbsoluteFill>
  );
};

// ---------- el detector: aparato amarillo que barre la pared; la luz pasa de verde a rojo cuando cruza el cable escondido
export const DetectorD: React.FC<{ price: string; dur: number }> = ({ price, dur }) => {
  const f = useCurrentFrame(); const x = 260 + Math.sin(f / 22) * 520; const hot = Math.abs(x - 960) < 110; const p = sp(f, 0, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 952, top: 0, bottom: 0, width: 16, background: "repeating-linear-gradient(180deg, rgba(200,55,45,0.18) 0 30px, transparent 30px 50px)" }} />
      <div style={{ position: "absolute", left: x + 380, top: 330, width: 260, height: 420, borderRadius: 50, background: "linear-gradient(160deg,#F7D44A,#D9AE22)", boxShadow: "0 30px 50px rgba(0,0,0,0.4)", transform: `translateY(${(1 - p) * 300}px)` }}>
        <div style={{ position: "absolute", left: 60, top: 50, width: 140, height: 80, borderRadius: 14, background: "#1C2420", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 46, height: 46, borderRadius: "50%", background: hot ? "#FF3B2E" : "#43D06A", boxShadow: `0 0 26px ${hot ? "#FF3B2E" : "#43D06A"}` }} /></div>
        <div style={{ position: "absolute", left: 90, top: 200, width: 80, height: 80, borderRadius: "50%", background: "#3A3530" }} />
      </div>
      {hot ? <div style={{ position: "absolute", left: x + 640, top: 300, fontFamily: SANS, fontWeight: 700, fontSize: 80, color: W.rojo }}>¡pi pi pi!</div> : null}
      <div style={{ position: "absolute", left: 110, top: 90 }}><span style={{ background: W.noche, color: W.luz, fontFamily: SANS, fontWeight: 700, fontSize: 100, padding: "6px 34px" }}>{price}</span><div style={{ marginTop: 18 }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 64, padding: "6px 30px" }}>metal y tensión</span></div></div>
    </AbsoluteFill>
  );
};

// ---------- polvo: puntitos de yeso que flotan en un rayo de luz; al final se dibuja la silueta del barbijo
export const PolvoD: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const m = sp(f, 24, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="all" k={0.9} />
      <div style={{ position: "absolute", left: 300, top: -200, width: 700, height: 1500, background: "linear-gradient(90deg, transparent, rgba(255,240,200,0.16), transparent)", transform: "rotate(24deg)" }} />
      {Array.from({ length: 70 }, (_, i) => { const x = (i * 271) % 1500 + 200; const y = ((i * 137 + f * (0.6 + (i % 5) * 0.2)) % 1100) - 40; const s = 4 + (i % 4) * 3;
        return <div key={i} style={{ position: "absolute", left: x + Math.sin((f + i * 9) / 20) * 14, top: 1080 - y, width: s, height: s, borderRadius: "50%", background: "rgba(255,248,232,0.8)" }} />; })}
      <div style={{ position: "absolute", left: 1180, top: 200, width: 520, height: 560, opacity: cl(m * 2), transform: `scale(${0.7 + 0.3 * m})` }}>
        <div style={{ position: "absolute", left: 40, top: 0, width: 440, height: 170, display: "flex", gap: 40, justifyContent: "center", alignItems: "center", background: "rgba(200,225,240,0.25)", border: "12px solid #2E2A25", borderRadius: 60 }}>
          <div style={{ width: 150, height: 110, borderRadius: 40, background: "linear-gradient(160deg,rgba(255,255,255,0.7),rgba(170,210,235,0.35))" }} /><div style={{ width: 150, height: 110, borderRadius: 40, background: "linear-gradient(160deg,rgba(255,255,255,0.7),rgba(170,210,235,0.35))" }} /></div>
        <div style={{ position: "absolute", left: 60, top: 240, width: 400, height: 260, borderRadius: "40px 40px 120px 120px", background: "repeating-linear-gradient(180deg,#FAFAF6 0 26px,#E4E2DA 26px 30px)", boxShadow: "0 20px 30px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: -60, top: 300, width: 130, height: 10, background: "#FAFAF6" }} /><div style={{ position: "absolute", right: -60, top: 300, width: 130, height: 10, background: "#FAFAF6" }} /></div>
      <div style={{ position: "absolute", left: 120, top: 700 }}><Titulo txt="Barbijo y anteojos" size={100} f0={24} /><Kick txt="EL POLVO DE YESO QUEDA EN EL AIRE" style={{ marginTop: 12, fontSize: 54 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- el batidor de la feria: ticket de feria que se arranca del talonario
export const TicketD: React.FC<{ big: string; lines: string[]; bg?: string; dur: number }> = ({ big, lines, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 11); const r = interpolate(p, [0, 1], [18, -4]);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.55} />
      <div style={{ position: "absolute", right: 170, top: 200, width: 620, background: "#F6E7B8", padding: "40px 46px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", transform: `rotate(${r}deg) translateY(${(1 - p) * -400}px)`, borderTop: "10px dashed #C9B47A" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 6, color: "#7A5A22" }}>FERIA · Nº 0412</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 200, lineHeight: 1, color: W.ink }}>{big}</div>
        {lines.map((l, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, whiteSpace: "nowrap", color: "#3A2C1A", opacity: cl(sp(f, 10 + i * 8, 14) * 2) }}>{l}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- dos clases de masilla: el pote (seca por aire) y la bolsa (fragua); cada una con su tiempo
export const DosMasD: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame();
  const Col = ({ src, t, rows, x, d }: { src: string; t: string; rows: string[]; x: number; d: number }) => { const q = sp(f, d, 14);
    return <div style={{ position: "absolute", left: x, top: 90, width: 780, opacity: cl(q * 2), transform: `translateY(${(1 - q) * 60}px)` }}>
      <div style={{ height: 470, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}><Pic src={src} /></div>
      <div style={{ background: W.yeso, padding: "24px 34px" }}><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: W.ink }}>{t}</div>{rows.map((r, i) => <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#5A5246", marginTop: 6 }}>{r}</div>)}</div>
    </div>; };
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2A251E,#15120E)" }}>
      <Col src={a} t="En pote" rows={["seca por aire", "1-2 h · o toda la noche"]} x={140} d={0} />
      <Col src={b} t="En polvo" rows={["fragua por química", "5 · 20 · 45 minutos"]} x={1000} d={8} />
    </AbsoluteFill>
  );
};

// ---------- tres bolsas: cada bolsa se llena como un reloj según su tiempo (5, 20, 45)
export const BolsasD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro tone="#D9CDB6" />
      {[5, 20, 45].map((m, i) => { const q = sp(f, i * 5, 13); const k = cl(interpolate(f, [10, 10 + m * 2.2], [0, 1], CL));
        return <div key={i} style={{ position: "absolute", left: 210 + i * 540, top: 200, width: 420, transform: `translateY(${(1 - q) * 300}px) rotate(${(i - 1) * 2}deg)` }}>
          <div style={{ height: 560, borderRadius: "30px 30px 16px 16px", background: "linear-gradient(170deg,#EDE4D0,#CFC1A5)", boxShadow: "0 30px 50px rgba(0,0,0,0.4)", position: "relative", overflow: "hidden", clipPath: "polygon(4% 0,96% 0,100% 100%,0 100%)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: "repeating-linear-gradient(90deg,#B9A57F 0 14px,transparent 14px 28px)" }} />
            <div style={{ position: "absolute", left: 90, top: 150, width: 240, height: 240, borderRadius: "50%", background: `conic-gradient(${W.rojo} 0 ${k * 360}deg, #F3EEE4 ${k * 360}deg)`, boxShadow: "0 0 0 10px #F3EEE4" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 96, color: W.ink }}>{m} min</div>
          </div>
        </div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center" }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 72, padding: "8px 36px" }}>La bolsa te dice el tiempo</span></div>
    </AbsoluteFill>
  );
};

// ---------- al revés: agua sobre polvo = grumos (✕) · polvo sobre agua, como lluvia = crema (✓)
export const AlRevesD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const r = sp(f, 30, 14);
  const Balde = ({ x, ok, d }: { x: number; ok: boolean; d: number }) => { const q = sp(f, d, 14);
    return <div style={{ position: "absolute", left: x, top: 300, width: 600, height: 560, opacity: cl(q * 2) }}>
      <div style={{ position: "absolute", left: 60, bottom: 0, width: 480, height: 360, background: "linear-gradient(90deg,#3A7BC8,#5C98DC,#3A7BC8)", clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", borderRadius: 10 }}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 30, height: 120, background: ok ? "linear-gradient(180deg,#F4F1EA,#E3DED2)" : "#E9E4D8", borderRadius: "40%" }}>
          {!ok ? Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 46, top: 20 + (i % 3) * 22, width: 40, height: 34, borderRadius: "40%", background: "#C9C2B2", boxShadow: "inset -4px -4px 0 rgba(0,0,0,0.15)" }} />) : null}
        </div></div>
      {Array.from({ length: ok ? 26 : 6 }, (_, i) => { const t = ((f * (ok ? 9 : 16) + i * 41) % 260); return <div key={i} style={{ position: "absolute", left: ok ? 180 + (i * 53) % 240 : 270 + (i % 3) * 20, top: t, width: ok ? 10 : 30, height: ok ? 10 : 48, borderRadius: ok ? "50%" : 12, background: ok ? "#F7F4EC" : "#7FB7E8", opacity: 0.95 }} />; })}
      <div style={{ position: "absolute", left: 230, top: -110, opacity: cl(r * 2), transform: `scale(${0.6 + 0.4 * r})` }}><Tilde ok={ok} size={140} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -110, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: "#FFF8EE" }}>{ok ? "polvo sobre agua" : "agua sobre polvo"}</div>
    </div>; };
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}><Balde x={210} ok={false} d={0} /><Balde x={1110} ok d={8} /></AbsoluteFill>;
};

// ---------- proporción: dos cucharadas de polvo caen en la balanza contra una de agua
export const ProporD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const t = sp(f, 24, 10); const tilt = interpolate(t, [0, 1], [0, -6]);
  const cubo = (c: string, d: number, k: number) => { const q = sp(f, d, 12); return <div key={k} style={{ width: 170, height: 170, borderRadius: 18, background: c, boxShadow: "0 10px 16px rgba(0,0,0,0.35)", transform: `translateY(${(1 - q) * -260}px)`, opacity: cl(q * 3) }} />; };
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      <div style={{ position: "absolute", left: 260, right: 260, top: 640, height: 22, background: "#8A8378", transform: `rotate(${tilt}deg)` }}>
        <div style={{ position: "absolute", left: 60, bottom: 22, display: "flex", gap: 16 }}>{cubo("linear-gradient(160deg,#FBF8F1,#DCD5C6)", 0, 1)}{cubo("linear-gradient(160deg,#FBF8F1,#DCD5C6)", 8, 2)}</div>
        <div style={{ position: "absolute", right: 120, bottom: 22 }}>{cubo("linear-gradient(160deg,#8CC3EC,#3D84C6)", 16, 3)}</div>
      </div>
      <div style={{ position: "absolute", left: 930, top: 662, width: 60, height: 110, background: "#6A645B" }} /><div style={{ position: "absolute", left: 820, top: 770, width: 280, height: 18, background: "#6A645B", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 812, textAlign: "center" }}><Titulo txt="2 de polvo · 1 de agua" size={96} /><Kick txt="MÁS O MENOS · MANDA LA BOLSA" style={{ marginTop: 12 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- ya fraguó: el bloque duro se parte en el balde y cae el sello «SE TIRA»
export const FraguoD: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const s = sp(f, 14, 9);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.7} />
      <div style={{ position: "absolute", right: 300, top: 230, transform: `rotate(-12deg) scale(${2.2 - 1.2 * s})`, opacity: cl(s * 2), border: `14px solid ${W.rojo}`, padding: "18px 50px", fontFamily: SANS, fontWeight: 700, fontSize: 140, color: W.rojo, letterSpacing: 6, background: "rgba(255,248,238,0.92)" }}>SE TIRA</div>
      <div style={{ position: "absolute", right: 200, top: 560, width: 700 }}><Placa edge={W.rojo}><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: "#FFF8EE" }}>No le agregues agua</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#FFD9CC", marginTop: 6 }}>ya fraguó: se hace otra</div></Placa></div>
    </AbsoluteFill>
  );
};

// ---------- el círculo que vuelve: un calendario arranca hojas y alrededor del tarugo se dibuja la grieta
export const CirculoD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const m = Math.min(2, Math.floor(interpolate(f, [6, 54], [0, 2.99], CL))); const c = interpolate(f, [50, 80], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 1150, top: 400, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, #EFEADF 36%, #E2DACB 40%, transparent 42%)` }} />
      <div style={{ position: "absolute", left: 1150, top: 400, width: 200, height: 200, borderRadius: "50%", border: "6px solid #6C6355", clipPath: `polygon(50% 50%, 50% 0, ${c > 0.25 ? "100% 0, 100% 100%" : "100% 0"}, ${c > 0.5 ? "0 100%" : "50% 50%"}, ${c > 0.75 ? "0 0" : "50% 50%"})`, opacity: c }} />
      <div style={{ position: "absolute", left: 220, top: 230, width: 520, background: "#FFFDF6", boxShadow: "0 30px 50px rgba(0,0,0,0.4)" }}>
        <div style={{ background: W.rojo, height: 110, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>MESES</div>
        <div style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 300, color: W.ink }}>{m}</div>
      </div>
      <div style={{ position: "absolute", left: 220, top: 790 }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 72, padding: "8px 32px" }}>el tarugo se mueve, la masilla se raja</span></div>
    </AbsoluteFill>
  );
};

// ---------- en cruz: la espátula hace la pasada de arriba abajo y después la de costado; queda la cruz de masilla
export const CruzD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const a = interpolate(f, [4, 22], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) }); const b = interpolate(f, [28, 46], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 830, top: 160, width: 260, height: 620 * a, background: `linear-gradient(90deg, rgba(247,245,239,0), ${W.mas} 18%, ${W.mas} 82%, rgba(247,245,239,0))` }} />
      <div style={{ position: "absolute", left: 650, top: 400, width: 620 * b, height: 240, background: `linear-gradient(180deg, rgba(247,245,239,0), ${W.mas} 18%, ${W.mas} 82%, rgba(247,245,239,0))` }} />
      <Hueco w={70} x={960} y={520} style={{ opacity: 1 - a }} />
      {a > 0 && a < 1 ? <Espatula x={800} y={60 + 620 * a} w={320} a={0} carga /> : null}
      {b > 0 && b < 1 ? <Espatula x={500 + 620 * b} y={300} w={320} a={-90} /> : null}
      <div style={{ position: "absolute", left: 1300, top: 700 }}><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 64, color: W.ink, opacity: a > 0 ? 1 : 0.3 }}>1 · de arriba abajo</div><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 64, color: W.ink, opacity: b > 0 ? 1 : 0.3, marginTop: 8 }}>2 · de costado</div></div>
      <div style={{ position: "absolute", left: 120, top: 820, opacity: cl(sp(f, 50, 14) * 2) }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 78, padding: "8px 34px" }}>Dos pasadas. Nada más.</span></div>
    </AbsoluteFill>
  );
};

// ---------- se encoge: corte de la pared con el agujero lleno; la masilla baja al secar y la segunda mano la empareja
export const EncogeD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const dip = interpolate(f, [8, 40], [0, 1], { ...CL, easing: ease }); const two = interpolate(f, [50, 74], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      <div style={{ position: "absolute", left: 200, right: 200, top: 360, height: 300, background: "repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,0.05) 0 3px, transparent 3px 9px), #E9E2D3" }} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 340, height: 24, background: W.beige }} />
      <div style={{ position: "absolute", left: 830, top: 340, width: 260, height: 220, background: "#1A1612", borderRadius: "0 0 40% 40%" }} />
      <div style={{ position: "absolute", left: 830, top: 340 + 36 * dip, width: 260, height: 220 - 36 * dip, background: W.mas, borderRadius: `${50 * dip}% ${50 * dip}% 40% 40% / ${30 * dip}% ${30 * dip}% 40% 40%` }} />
      <div style={{ position: "absolute", left: 790, top: 340, width: 340, height: 40 * two, background: "#FFFFFF", borderRadius: "0 0 50% 50%", opacity: two }} />
      <div style={{ position: "absolute", left: 1000, top: 250, opacity: dip }}><Kick txt="1ª MANO: QUEDA HUNDIDA" style={{ fontSize: 52, whiteSpace: "nowrap" }} /></div>
      <div style={{ position: "absolute", left: 1000, top: 700, opacity: two }}><Kick txt="2ª MANO: A NIVEL" color="#9EE0A6" style={{ fontSize: 52, whiteSpace: "nowrap" }} /></div>
      <div style={{ position: "absolute", left: 200, top: 120 }}><Titulo txt="La masilla se encoge al secar" size={84} /></div>
    </AbsoluteFill>
  );
};

// ---------- cronómetro de obra: un reloj de pared con la cuña del tiempo de manos
export const CronoD: React.FC<{ big: string; title: string; bg?: string; dur: number }> = ({ big, title, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12); const k = interpolate(f, [4, 40], [0, 1], { ...CL, easing: ease }); const sec = f * 6;
  const mins = parseFloat(big.replace(",", ".")); const frac = Math.min(1, mins / 15);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.82} />
      <div style={{ position: "absolute", left: 180, top: 180, width: 640, height: 640, borderRadius: "50%", background: "#FBFAF6", border: "26px solid #2E2A25", boxShadow: "0 40px 70px rgba(0,0,0,0.55)", transform: `scale(${0.8 + 0.2 * p})` }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: `conic-gradient(rgba(78,154,87,0.85) 0 ${frac * k * 360}deg, transparent ${frac * k * 360}deg)` }} />
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 291, top: 10, width: 6, height: 40, background: "#2E2A25", transformOrigin: "3px 284px", transform: `rotate(${i * 30}deg)` }} />)}
        <div style={{ position: "absolute", left: 291, top: 70, width: 6, height: 224, background: W.rojo, transformOrigin: "3px 224px", transform: `rotate(${sec}deg)` }} />
        <div style={{ position: "absolute", left: 274, top: 274, width: 40, height: 40, borderRadius: "50%", background: "#2E2A25" }} />
      </div>
      <div style={{ position: "absolute", left: 960, top: 300, width: 860 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 180, lineHeight: 1, color: W.luz, textShadow: tsh }}>{big} min</div>
        <Titulo txt={title} size={78} style={{ marginTop: 18 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- pasta de dientes vs masilla: dos tubos lado a lado, cada uno con su veredicto
export const PastaD: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame();
  const fila = (t: string, ok: boolean, d: number, y: number) => { const q = sp(f, d, 14); return <div style={{ position: "absolute", left: 1000, top: y, display: "flex", alignItems: "center", gap: 26, opacity: cl(q * 2), transform: `translateX(${(1 - q) * 80}px)` }}><Tilde ok={ok} size={92} /><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 64, padding: "6px 26px" }}>{t}</span></div>; };
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.86} />
      {fila("tapa un clavo, sí", true, 0, 220)}{fila("se encoge", false, 10, 380)}{fila("se pone amarilla", false, 20, 540)}{fila("la pintura agarra mal", false, 30, 700)}
    </AbsoluteFill>
  );
};

// ---------- recuerdo: la foto vieja atornillada a la placa con un tornillo negro en cada esquina
export const RecuerdoD: React.FC<{ src: string; year: string; caption: string; dur: number }> = ({ src, year, caption, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12); const r = (src.length % 5) - 2.5; const tor = (d: number) => cl(sp(f, d, 10) * 2);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 300, top: 110, width: 1320, height: 800, background: "#FFFDF6", padding: 26, boxShadow: "0 40px 70px rgba(0,0,0,0.45)", transform: `rotate(${r * (1 - 0.5 * p)}deg) scale(${0.9 + 0.1 * p})`, opacity: cl(p * 2) }}>
        <div style={{ width: "100%", height: 640, overflow: "hidden" }}><Pic src={src} style={{ transform: `scale(${1.04 + f / 1500})` }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#2D3A5A" }}>{caption}</span><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: W.rojo, paddingRight: 60 }}>{year}</span></div>
        {[[8, 8], [1270, 8], [8, 750], [1270, 750]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #6A6A6A, #1C1C1C)", opacity: tor(10 + i * 4), transform: `rotate(${f * 4}deg)` }}><div style={{ position: "absolute", left: 15, top: 4, width: 4, height: 26, background: "#888" }} /><div style={{ position: "absolute", left: 4, top: 15, width: 26, height: 4, background: "#888" }} /></div>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- ampolla: corte del papel suelto; el agua de la masilla entra y el papel se infla
export const AmpollaD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const w = interpolate(f, [10, 50], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      <div style={{ position: "absolute", left: 160, right: 160, top: 560, height: 280, background: "#E9E2D3" }} />
      <div style={{ position: "absolute", left: 560, top: 560 - 150 * w, width: 800, height: 150 * w + 26, borderRadius: "50% 50% 0 0 / 100% 100% 0 0", border: "14px solid #D8CFBE", borderBottom: "none", background: `rgba(127,183,232,${0.25 * w})` }} />
      <div style={{ position: "absolute", left: 160, top: 546, width: 400, height: 16, background: "#D8CFBE" }} /><div style={{ position: "absolute", left: 1360, top: 546, width: 400, height: 16, background: "#D8CFBE" }} />
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 620 + i * 70, top: 520 - ((f * 3 + i * 23) % 120) * w, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#7FB7E8", opacity: w }} />)}
      <div style={{ position: "absolute", left: 160, top: 110 }}><Titulo txt="Papel suelto + agua = ampolla" size={90} /><Kick txt="EL PAPEL SUELTO SIEMPRE SE CORTA ANTES" style={{ marginTop: 14 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- plumear: perfil de la pared con luz rasante; el borde con escalón hace sombra, el plumeado no
export const PlumearD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const k = interpolate(f, [30, 60], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) }); const lx = interpolate(f, [0, dur], [-200, 1900], CL);
  const h = (x: number) => { const c = 960, half = k ? 160 + 520 * k : 160; const d = Math.abs(x - c); if (d > half) return 0; return k > 0 ? 60 * (1 - (d / half) ** 2) * (1 - 0.5 * k) + 30 * (1 - k) : 60; };
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#1E1B17,#0E0C0A)" }}>
      <div style={{ position: "absolute", left: lx - 300, top: 0, width: 600, height: 1080, background: "linear-gradient(90deg, transparent, rgba(255,231,168,0.14), transparent)" }} />
      {Array.from({ length: 48 }, (_, i) => { const x = 200 + i * 32; const hh = h(x); return <div key={i} style={{ position: "absolute", left: x, top: 620 - hh, width: 34, height: hh + 300, background: hh > 0 ? W.mas : W.beigeL }} />; })}
      <div style={{ position: "absolute", left: 160, top: 110 }}><Titulo txt={k < 0.5 ? "Con escalón: se ve el parche" : "Plumeado: se pierde en la pared"} size={84} /></div>
      <div style={{ position: "absolute", left: 160, top: 260, opacity: k }}><Kick txt="5 CM MÁS ALLÁ DEL BORDE" /></div>
    </AbsoluteFill>
  );
};

// ---------- mallas: tres parches de malla (10, 15, 20 cm) se pegan uno al lado del otro con su precio
export const MallasD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      {[10, 15, 20].map((c, i) => { const q = sp(f, i * 6, 12); const s = 150 + c * 13;
        return <div key={i} style={{ position: "absolute", left: 230 + i * 560 + (440 - s) / 2, top: 420 - s / 2, width: s, height: s, transform: `scale(${0.5 + 0.5 * q}) rotate(${(1 - q) * 20}deg)`, opacity: cl(q * 2), background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.95) 0 3px, transparent 3px 14px), repeating-linear-gradient(90deg, rgba(255,255,255,0.95) 0 3px, transparent 3px 14px), rgba(240,235,222,0.55)", boxShadow: "0 12px 20px rgba(0,0,0,0.25)" }}>
          {i === 1 ? <div style={{ position: "absolute", left: "30%", top: "30%", width: "40%", height: "40%", background: `linear-gradient(135deg,#E3E6E8,${W.acero})` }} /> : null}
          <div style={{ position: "absolute", left: 0, right: 0, top: s + 30, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 80, color: W.ink }}>{c} cm</div>
        </div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 840, textAlign: "center" }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 72, padding: "8px 36px" }}>$2 a $5 el parche</span></div>
    </AbsoluteFill>
  );
};

// ---------- tres manos: óvalos de masilla cada vez más anchos y más finos alrededor de la malla
export const ManosD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro tone="#CDBE9F" />
      {[3, 2, 1].map((n) => { const d = (n - 1) * 16; const q = sp(f, d, 14); const w = 380 + n * 380, h = 240 + n * 190;
        return <div key={n} style={{ position: "absolute", left: 960 - w / 2, top: 480 - h / 2, width: w, height: h, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(250,248,242,${1 - n * 0.12}) 55%, rgba(250,248,242,${0.85 - n * 0.12}) 70%)`, boxShadow: `0 0 0 5px rgba(60,52,40,${0.35 * q}), 0 12px 24px rgba(0,0,0,0.18)`, transform: `scale(${q})`, opacity: cl(q * 2) }}>
          <div style={{ position: "absolute", left: w / 2 - 70, top: 34, width: 140, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 66, color: W.ink }}>{n}ª</div></div>; })}
      <Hueco w={150} x={960} y={540} style={{ opacity: 0.35 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center" }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 70, padding: "8px 34px" }}>Cada mano más ancha que la anterior</span></div>
    </AbsoluteFill>
  );
};

// ---------- esqueleto: la masilla sola se raja como vidrio; con malla adentro aguanta como hormigón armado
export const ArmadoD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const sh = Math.sin(f * 1.6) * (f > 20 && f < 40 ? 6 : 0); const crack = interpolate(f, [22, 34], [0, 1], CL);
  const Bloque = ({ x, malla }: { x: number; malla: boolean }) => (
    <div style={{ position: "absolute", left: x, top: 260, width: 620, height: 420, transform: `translateX(${sh}px)`, background: "linear-gradient(160deg,#F5F2EA,#DDD6C7)", boxShadow: "0 30px 50px rgba(0,0,0,0.5)", overflow: "hidden" }}>
      {malla ? <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(160,96,60,0.45) 0 6px, transparent 6px 60px), repeating-linear-gradient(90deg, rgba(160,96,60,0.45) 0 6px, transparent 6px 60px)" }} />
        : [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 160, top: 0, width: 6, height: 420 * crack, background: "#5B5348", transform: `rotate(${(i - 1) * 18}deg)`, transformOrigin: "50% 0" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center" }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 60, padding: "4px 24px" }}>{malla ? "con malla: aguanta" : "sola: se raja"}</span></div>
    </div>);
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}><Bloque x={220} malla={false} /><Bloque x={1080} malla /><div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}><Titulo txt="La malla es el esqueleto" size={90} /></div></AbsoluteFill>;
};

// ---------- el cartón: el rectángulo se recorta 2 cm más grande que el agujero y entra en diagonal
export const CartonD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const r = interpolate(f, [30, 56], [0, 38], { ...CL, easing: Easing.inOut(Easing.cubic) }); const p = sp(f, 0, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <Hueco w={300} x={960} y={500} />
      <div style={{ position: "absolute", left: 960 - 230, top: 500 - 200, width: 460, height: 400, border: "6px dashed #8A5A32", transform: `rotate(${r}deg) scale(${0.9 + 0.1 * p})`, background: "repeating-linear-gradient(90deg, rgba(185,140,90,0.85) 0 10px, rgba(165,120,74,0.85) 10px 20px)", opacity: cl(p * 2) * 0.85 }} />
      <div style={{ position: "absolute", left: 1240, top: 300, opacity: cl(p * 2) }}><Kick txt="+2 CM DE CADA LADO" color={W.ink} style={{ textShadow: "none" }} /></div>
      <div style={{ position: "absolute", left: 120, top: 860 }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 70, padding: "8px 32px" }}>cartón de mudanza, no de cereales</span></div>
    </AbsoluteFill>
  );
};

// ---------- el títere: corte de la pared visto de costado; el cartón atrás, los hilos tiran, el palito cruza adelante
export const TitereD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const pull = interpolate(f, [10, 34], [0, 1], { ...CL, easing: ease }); const st = sp(f, 36, 12);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      <div style={{ position: "absolute", left: 900, top: 210, width: 60, height: 190, background: "#E9E2D3" }} /><div style={{ position: "absolute", left: 900, top: 640, width: 60, height: 170, background: "#E9E2D3" }} />
      <div style={{ position: "absolute", left: 1200 - 230 * pull, top: 300, width: 30, height: 440, background: "linear-gradient(90deg,#B98C5A,#A5784A)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 640, top: 515, width: 560 - 230 * pull + 300 * (1 - pull) * 0, height: 5, background: "#F2EAD8" }} /><div style={{ position: "absolute", left: 640, top: 525, width: 560 - 230 * pull, height: 5, background: "#F2EAD8" }} />
      <div style={{ position: "absolute", left: 600, top: 380, width: 30, height: 280, borderRadius: 10, background: "linear-gradient(90deg,#E7C890,#C9A464)", opacity: cl(st * 2), transform: `translateX(${(1 - st) * -120}px)` }} />
      <div style={{ position: "absolute", left: 1000, top: 120 }}><Kick txt="ATRÁS: EL CARTÓN" color="#E7C890" /></div>
      <div style={{ position: "absolute", left: 120, top: 120 }}><Kick txt="ADELANTE: EL PALITO" color="#E7C890" /></div>
      <div style={{ position: "absolute", left: 120, top: 870 }}><Placa><Titulo txt="El hilo tenso lo aprieta contra la placa" size={66} /></Placa></div>
    </AbsoluteFill>
  );
};

// ---------- gasto cero: el ticket se imprime y el total queda en $0
export const CeroD: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const h = interpolate(f, [0, 30], [0, 1], { ...CL, easing: ease });
  const rows = [["cartón de caja", "$0"], ["hilo", "$0"], ["palito", "$0"]];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.7} />
      <div style={{ position: "absolute", right: 220, top: 120, width: 600, height: 760 * h, overflow: "hidden", background: "#FFFEF8", boxShadow: "0 30px 50px rgba(0,0,0,0.5)", padding: h > 0.1 ? "40px 44px" : 0, fontFamily: "monospace" }}>
        {rows.map(([a, b], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 50, color: "#333", marginBottom: 18 }}><span>{a}</span><span>{b}</span></div>)}
        <div style={{ borderTop: "4px dashed #999", marginTop: 30, paddingTop: 20, display: "flex", justifyContent: "space-between", fontSize: 70, fontWeight: 700, color: W.ink }}><span>TOTAL</span><span style={{ color: W.ok }}>$0</span></div>
        <div style={{ marginTop: 40, fontFamily: HAND, fontSize: 60, color: "#2D3A5A" }}>lo tenías en casa</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- el recorte: tarjeta del corralón con el espesor marcado en grande
export const PideD: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12); const p2 = sp(f, 10, 13); const p3 = sp(f, 20, 13); const fl = Math.sin(f / 22) * 6;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.7} />
      <div style={{ position: "absolute", left: 130, top: 220, width: 960, height: 580, background: "linear-gradient(180deg,#F1ECE1,#DCD4C4)", boxShadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 -26px 0 #C9C1B1", transform: `perspective(1600px) rotateX(${(1 - p) * 40}deg) translateY(${fl}px) rotate(${-1 + Math.sin(f / 31)}deg)`, transformOrigin: "50% 100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 70px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: 4, color: "#4A4338", whiteSpace: "nowrap" }}>PEDÍ UN RECORTE DE PLACA</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 168, color: W.ink, lineHeight: 1.05, whiteSpace: "nowrap", opacity: cl(p2 * 2), transform: `translateX(${(1 - p2) * 60}px)` }}>12,5 mm</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: W.rojo, whiteSpace: "nowrap", opacity: cl(p3 * 2), transform: `scale(${0.8 + 0.2 * p3})`, transformOrigin: "0 50%" }}>cuesta de $2 a $6</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- rectángulo, no círculo: el lápiz traza los dos; el círculo se tacha
export const RectD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const a = interpolate(f, [4, 30], [0, 1], CL); const b = interpolate(f, [8, 34], [0, 1], CL); const x = sp(f, 40, 12);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <Hueco w={260} x={520} y={500} /><Hueco w={260} x={1400} y={500} />
      <div style={{ position: "absolute", left: 300, top: 320, width: 440, height: 360, border: "8px solid #3A3A3A", clipPath: `inset(0 ${(1 - a) * 100}% 0 0)` }} />
      <div style={{ position: "absolute", left: 1200, top: 300, width: 400, height: 400, borderRadius: "50%", border: "8px solid #3A3A3A", clipPath: `inset(0 0 ${(1 - b) * 100}% 0)` }} />
      <div style={{ position: "absolute", left: 460, top: 760, opacity: cl(x * 2) }}><Tilde ok size={120} /></div>
      <div style={{ position: "absolute", left: 1340, top: 760, opacity: cl(x * 2) }}><Tilde ok={false} size={120} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}><Titulo txt="Un rectángulo se corta derecho" size={84} color={W.ink} /></div>
    </AbsoluteFill>
  );
};

// ---------- los listones: rayos X de la pared; detrás del hueco aparecen dos listones y los tornillos entran
export const ListonD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const x = sp(f, 2, 13); const p0 = Math.max(40, Math.round(dur * 0.62)); const pl = interpolate(f, [p0, p0 + 16], [0, 1], { ...CL, easing: ease });
  const tor = (l: number, t: number, d: number) => { const q = sp(f, d, 10); return <div key={l + "" + t} style={{ position: "absolute", left: l, top: t, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #EDEDED, #5A5A5A)", transform: `scale(${q}) rotate(${f * 8}deg)`, boxShadow: "0 4px 8px rgba(0,0,0,0.4)", opacity: cl(q * 2) }}><div style={{ position: "absolute", left: 19, top: 6, width: 6, height: 32, background: "#3A3A3A" }} /><div style={{ position: "absolute", left: 6, top: 19, width: 32, height: 6, background: "#3A3A3A" }} /></div>; };
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 610, top: 260, width: 700, height: 500, background: "radial-gradient(ellipse at 50% 45%, #2E261D, #0E0B08 75%)", boxShadow: "inset 0 0 0 10px #CFC6B4, inset 0 0 40px rgba(0,0,0,0.9)" }}>
        <div style={{ position: "absolute", left: 300, top: 0, width: 26, height: 500, background: "linear-gradient(90deg,#8F3A26,#C25A3C)", opacity: 0.55 }} />
      </div>
      {[600, 1200].map((l, i) => <div key={i} style={{ position: "absolute", left: l + (i ? 1 : -1) * (1 - x) * 160, top: 210, width: 120, height: 600, background: "repeating-linear-gradient(90deg, rgba(120,80,40,0.25) 0 2px, transparent 2px 13px), linear-gradient(90deg,#D9AA6E,#B0804A)", boxShadow: "0 14px 24px rgba(0,0,0,0.5)", opacity: cl(x * 2), borderRadius: 4 }} />)}
      <div style={{ position: "absolute", left: 610, top: 260, width: 700, height: 500, background: "linear-gradient(170deg,#F2EDE2,#DAD2C1)", clipPath: `inset(0 ${(1 - pl) * 100}% 0 0)`, boxShadow: "0 0 0 4px rgba(0,0,0,0.12)" }} />
      {tor(638, 290, p0 + 14)}{tor(638, 700, p0 + 18)}{tor(1238, 290, p0 + 22)}{tor(1238, 700, p0 + 26)}
      <div style={{ position: "absolute", left: 610, top: 120, opacity: cl(x * 2) }}><Kick txt="LISTÓN DETRÁS DE CADA BORDE" color={W.ink} style={{ textShadow: "none" }} /></div>
      <div style={{ position: "absolute", left: 110, top: 880 }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 70, padding: "8px 32px" }}>un listón de cada lado: ya tienes dónde atornillar</span></div>
    </AbsoluteFill>
  );
};

// ---------- la cinta de juntas: el rectángulo de placa nueva y la cinta de papel que se va pegando en las cuatro uniones
export const CintaD: React.FC<{ dur: number }> = ({ dur }) => {
  // la cinta de papel color kraft contra la pared más oscura
  const f = useCurrentFrame(); const k = (i: number) => interpolate(f, [4 + i * 12, 18 + i * 12], [0, 1], { ...CL, easing: ease });
  const T: [number, number, number, number][] = [[620, 270, 680, 56], [620, 714, 680, 56], [620, 270, 56, 500], [1244, 270, 56, 500]];
  const cur = Math.min(3, Math.floor(cl((f - 4) / 12, 0, 3.99))); const [l, t, w, h] = T[cur]; const kc = k(cur);
  const ex = w > 56 ? l + w * kc : l + 28; const ey = h > 56 ? t + h * kc : t + 28;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro tone="#BFAE8C" />
      <div style={{ position: "absolute", left: 640, top: 290, width: 640, height: 460, background: "linear-gradient(170deg,#F4F0E7,#DED6C6)", boxShadow: "0 0 0 4px rgba(0,0,0,0.18), 0 10px 18px rgba(0,0,0,0.2)" }}>
        {[[30, 30], [590, 30], [30, 410], [590, 410], [310, 30], [310, 410]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 20, height: 20, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #BDBDBD, #4A4A4A)" }} />)}
      </div>
      {T.map(([l2, t2, w2, h2], i) => <div key={i} style={{ position: "absolute", left: l2, top: t2, width: w2 === 56 ? 56 : w2 * k(i), height: h2 === 56 ? 56 : h2 * k(i), background: "repeating-linear-gradient(90deg, rgba(90,60,20,0.10) 0 2px, transparent 2px 9px), #D3B98A", boxShadow: "0 3px 8px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(120,90,40,0.35)" }} />)}
      {kc > 0 && kc < 1 ? <Espatula x={ex - 150} y={ey - 40} w={300} a={w > 56 ? 90 : 0} /> : null}
      <div style={{ position: "absolute", left: 110, top: 80 }}><Titulo txt="Cinta de papel en las juntas" size={84} color={W.ink} /></div>
      <div style={{ position: "absolute", left: 110, top: 860 }}><span style={{ background: W.noche, color: W.luz, fontFamily: SANS, fontWeight: 700, fontSize: 56, padding: "8px 30px" }}>en lo recto, más fuerte que la de malla</span></div>
    </AbsoluteFill>
  );
};

// ---------- lámina: la página del método se recorre con la cámara (enfoques anclados a la voz)
export const LaminaD: React.FC<{ src: string; focus: { x: number; y: number; z: number; f: number }[]; qrAt?: number; dur: number }> = ({ src, focus, qrAt, dur }) => {
  const f = useCurrentFrame(); let a = 0; focus.forEach((z, i) => { if (f >= z.f) a = i; });
  const cur = focus[a]; const prev = focus[Math.max(0, a - 1)]; const t = a === 0 ? 1 : interpolate(f, [cur.f, cur.f + 30], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const cz = (v: number) => 1 + (Math.min(v, 2) - 1) * 0.12;
  const x = prev.x + (cur.x - prev.x) * t + Math.sin(f / 40) * 1.6; const y = prev.y + (cur.y - prev.y) * t + Math.cos(f / 47) * 1.3; const z = cz(prev.z) + (cz(cur.z) - cz(prev.z)) * t + 0.03 * Math.sin(f / 55);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#F4EFE4", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "30px 30px", transform: qrAt === undefined ? "none" : `scale(${1 - 0.45 * interpolate(f, [qrAt, qrAt + 14], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) })})`, boxShadow: qrAt !== undefined && f > qrAt ? "0 30px 60px rgba(0,0,0,0.35)" : "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, transform: qrAt !== undefined && f > qrAt ? `translate(${Math.sin(f / 37) * 8}px, ${Math.cos(f / 43) * 6}px)` : `scale(${z})`, transformOrigin: `${x}% ${y}%` }}><Pic src={src} fit="contain" /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- el pozo en el ladrillo: corte del revoque; la masilla sola se raja, la mezcla llena el fondo
export const PozoD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const a = interpolate(f, [6, 26], [0, 1], { ...CL, easing: ease }); const cr = interpolate(f, [26, 36], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      <div style={{ position: "absolute", left: 160, right: 160, top: 560, height: 360, background: `linear-gradient(160deg, ${W.lad}, ${W.ladD})` }} />
      <div style={{ position: "absolute", left: 160, right: 160, top: 380, height: 180, background: W.rev }} />
      <div style={{ position: "absolute", left: 160, right: 160, top: 360, height: 20, background: W.beigeL }} />
      <div style={{ position: "absolute", left: 760, top: 360, width: 400, height: 200, background: "#1A1612", borderRadius: "0 0 50% 50%" }} />
      <div style={{ position: "absolute", left: 760, top: 360 + 200 * (1 - a), width: 400, height: 200 * a, background: W.mas, borderRadius: "0 0 50% 50%", overflow: "hidden" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 90 + i * 110, top: 0, width: 5, height: 200 * cr, background: "#5B5348", transform: `rotate(${(i - 1) * 22}deg)` }} />)}</div>
      <div style={{ position: "absolute", left: 160, top: 110 }}><Titulo txt="3-4 cm de hondo: la masilla sola se raja" size={78} /><Kick txt="PARA EL FONDO, MEZCLA DE VERDAD" style={{ marginTop: 14 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- el ladrillo esponja: seco chupa el agua de la mezcla (flechas hacia adentro); mojado no
export const SedD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const w = interpolate(f, [40, 60], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Ladrillo style={{ filter: `brightness(${1 - 0.35 * w}) saturate(${1 + 0.2 * w})` }} />
      <div style={{ position: "absolute", left: 660, top: 330, width: 600, height: 420, background: `repeating-radial-gradient(circle at 37% 41%, rgba(0,0,0,0.10) 0 3px, transparent 3px 8px), linear-gradient(160deg,#B3ACA0,${w > 0.5 ? "#8C857A" : "#C9C2B6"})`, borderRadius: 30, boxShadow: "inset 0 0 40px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,255,255,0.25)" }}><div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 56, letterSpacing: 4, color: "#2B261F" }}>MEZCLA NUEVA</div></div>
      {Array.from({ length: 12 }, (_, i) => { const t = ((f * 4 + i * 30) % 120) / 120; const ang = (i / 12) * Math.PI * 2; const r = 200 + 260 * t;
        return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang) * r - 12, top: 540 + Math.sin(ang) * r * 0.7 - 18, width: 24, height: 36, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#7FB7E8", opacity: (1 - t) * (1 - w) }} />; })}
      <div style={{ position: "absolute", left: 110, top: 100 }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 80, padding: "8px 34px" }}>{w < 0.5 ? "Seco: le chupa el agua a la mezcla" : "Mojado: la mezcla fragua bien"}</span></div>
    </AbsoluteFill>
  );
};

// ---------- mezcla 1 : 3 — un balde de cemento y tres de arena se vuelcan en la batea
export const MezclaD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const balde = (c: string, i: number, lbl: string) => { const q = sp(f, i * 6, 12); return <div key={i} style={{ position: "relative", width: 230, height: 280, transform: `translateY(${(1 - q) * 300}px)`, opacity: cl(q * 2) }}>
    <div style={{ position: "absolute", left: 0, bottom: 0, width: 230, height: 250, background: "linear-gradient(90deg,#3A3A3A,#5A5A5A,#3A3A3A)", clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)" }} />
    <div style={{ position: "absolute", left: 14, top: 22, width: 202, height: 40, borderRadius: "50%", background: c }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 48, color: "#FFF8EE" }}>{lbl}</div></div>; };
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      <div style={{ position: "absolute", left: 200, top: 330, display: "flex", gap: 60, alignItems: "flex-end" }}>
        {balde("#9C9891", 0, "cemento")}<div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 120, color: W.luz, paddingBottom: 90 }}>+</div>{balde("#D8C79F", 1, "arena")}{balde("#D8C79F", 2, "arena")}{balde("#D8C79F", 3, "arena")}
      </div>
      <div style={{ position: "absolute", left: 200, top: 90 }}><Titulo txt="1 de cemento · 3 de arena fina" size={96} /><Kick txt="COMO UNA PASTA QUE SE SOSTIENE EN LA CUCHARA" style={{ marginTop: 12 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- una cara por vez: la esquina vista de arriba (una L); primero se llena una cara, fragua, después la otra
export const UnaCaraD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const a = interpolate(f, [6, 24], [0, 1], { ...CL, easing: ease }); const b = interpolate(f, [48, 66], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      <div style={{ position: "absolute", left: 700, top: 300, width: 80, height: 600, background: "#E9E2D3" }} /><div style={{ position: "absolute", left: 700, top: 300, width: 700, height: 80, background: "#E9E2D3" }} />
      <div style={{ position: "absolute", left: 690, top: 290, width: 40, height: 40, background: W.acero, transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", left: 640, top: 340, width: 60, height: 540 * a, background: W.mas }} />
      <div style={{ position: "absolute", left: 740, top: 240, width: 640 * b, height: 60, background: W.mas }} />
      <div style={{ position: "absolute", left: 160, top: 420, opacity: a }}><Kick txt="CARA 1" /></div>
      <div style={{ position: "absolute", left: 1000, top: 420, opacity: b }}><Kick txt="CARA 2, DESPUÉS" /></div>
      <div style={{ position: "absolute", left: 140, top: 935, opacity: cl((a - b) * 3 + (f > 30 && f < 48 ? 1 : 0)) }}><span style={{ background: W.noche, color: W.luz, fontFamily: SANS, fontWeight: 700, fontSize: 60, padding: "6px 26px" }}>esperas que fragüe</span></div>
      <div style={{ position: "absolute", left: 140, top: 110 }}><Titulo txt="El canto te hace de regla" size={84} /></div>
    </AbsoluteFill>
  );
};

// ---------- lija o esponja: una nube de polvo con la lija; la esponja húmeda, cero polvo
export const LijaD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const Lado = ({ x, nube, t }: { x: number; nube: boolean; t: string }) => (
    <div style={{ position: "absolute", left: x, top: 0, width: 960, height: 1080, overflow: "hidden" }}><Muro />
      <div style={{ position: "absolute", left: 340 + Math.sin(f / 5) * 60, top: 420 + Math.cos(f / 5) * 30, width: 280, height: 160, borderRadius: nube ? 10 : 40, background: nube ? "linear-gradient(160deg,#B5764A,#8A5432)" : "linear-gradient(160deg,#F2D35B,#CFA92E)", boxShadow: "0 20px 30px rgba(0,0,0,0.35)" }} />
      {nube ? Array.from({ length: 40 }, (_, i) => { const t2 = ((f * 2 + i * 13) % 90) / 90; return <div key={i} style={{ position: "absolute", left: 480 + Math.cos(i) * 300 * t2, top: 500 - 300 * t2 + Math.sin(i * 3) * 80, width: 30 + (i % 5) * 10, height: 30 + (i % 5) * 10, borderRadius: "50%", background: "rgba(250,248,240,0.75)", opacity: 1 - t2 }} />; }) : null}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, textAlign: "center" }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 76, padding: "8px 34px" }}>{t}</span></div>
    </div>);
  return <AbsoluteFill style={{ opacity: out(f, dur) }}><Lado x={0} nube t="lija: nube de polvo" /><Lado x={960} nube={false} t="esponja húmeda: nada" /><div style={{ position: "absolute", left: 954, top: 0, bottom: 0, width: 12, background: "#14110D" }} /></AbsoluteFill>;
};

// ---------- luz rasante: la linterna barre la pared de costado; el bulto hace sombra y el hundido se vuelve un pozo
export const RasanteD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const x = interpolate(f, [6, Math.max(40, Math.min(dur - 10, 120))], [300, 1700], { ...CL, easing: Easing.inOut(Easing.sin) }); const near = (cx: number) => cl(1 - Math.abs(x - cx) / 420);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#1E1A15" }}>
      <Muro tone="#9A8E78" />
      <AbsoluteFill style={{ background: "rgba(10,8,6,0.28)" }} />
      <div style={{ position: "absolute", left: x - 520, top: 140, width: 1040, height: 760, background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,236,190,0.85), rgba(255,236,190,0.25) 55%, transparent 72%)" }} />
      <div style={{ position: "absolute", left: 640, top: 430, width: 240, height: 170, borderRadius: "50%", background: `radial-gradient(ellipse at ${x < 760 ? 30 : 70}% 40%, rgba(255,246,222,${0.25 + 0.6 * near(760)}), rgba(140,128,108,${0.5 * near(760)}) 70%)`, boxShadow: `${(x < 760 ? 1 : -1) * (40 + 110 * near(760))}px 12px 30px rgba(0,0,0,${0.35 + 0.6 * near(760)})` }} />
      <div style={{ position: "absolute", left: 1160, top: 450, width: 220, height: 150, borderRadius: "50%", background: `rgba(30,24,18,${0.35 + 0.45 * near(1270)})`, boxShadow: `inset ${(x < 1270 ? -1 : 1) * (24 + 50 * near(1270))}px 0 26px rgba(0,0,0,${0.5 + 0.45 * near(1270)})` }} />
      <div style={{ position: "absolute", left: x - 900, top: 470, width: 380, height: 110, transform: "rotate(3deg)" }}>
        <div style={{ position: "absolute", left: 0, top: 20, width: 300, height: 70, borderRadius: 14, background: "linear-gradient(180deg,#3A3A3A,#121212,#2A2A2A)" }} />
        <div style={{ position: "absolute", left: 290, top: 0, width: 90, height: 110, borderRadius: "10px 40px 40px 10px", background: "linear-gradient(180deg,#5A5A5A,#1C1C1C)", boxShadow: "18px 0 30px rgba(255,236,190,0.9)" }} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 660, opacity: cl(near(760) * 1.6) }}><span style={{ background: W.noche, color: W.luz, fontFamily: SANS, fontWeight: 700, fontSize: 60, padding: "6px 22px", whiteSpace: "nowrap" }}>BULTO: LIJA</span></div>
      <div style={{ position: "absolute", left: 1060, top: 660, opacity: cl(near(1270) * 1.6) }}><span style={{ background: W.noche, color: W.luz, fontFamily: SANS, fontWeight: 700, fontSize: 60, padding: "6px 22px", whiteSpace: "nowrap" }}>HUNDIDO: OTRA MANO</span></div>
      <div style={{ position: "absolute", left: 120, top: 80 }}><Titulo txt="La linterna de costado te delata" size={88} /></div>
    </AbsoluteFill>
  );
};

// ---------- error k: un parche mal hecho en la pared con su número tachado en rojo
export const ErrorD: React.FC<{ k: number; title: string; sub: string; bg?: string; head?: boolean; dur: number }> = ({ k, title, sub, bg, head, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 10); const tach = interpolate(f, [8, 18], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.86} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 300, height: 300, borderRadius: "48% 52% 46% 54%", background: `radial-gradient(ellipse, ${W.mas} 55%, rgba(247,245,239,0) 72%)`, transform: `scale(${0.7 + 0.3 * p})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 210, color: W.rojo, lineHeight: 1 }}>{head ? "5" : k}</div>
        <div style={{ position: "absolute", left: 30, top: 140, width: 240 * tach, height: 18, background: W.rojo, transform: "rotate(-28deg)", transformOrigin: "0 50%" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 480, width: 1100 }}>
        <Titulo txt={title} size={head ? 104 : 88} />
        <Placa edge={W.rojo} style={{ marginTop: 26 }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 54, color: "#FFDCCF", lineHeight: 1.12 }}>{sub}</div></Placa>
      </div>
    </AbsoluteFill>
  );
};

// ---------- sin nada: tres objetos (listón, tornillos, malla) entran y los tacha una raya roja de a uno
export const SinD: React.FC<{ items: { t: string; f: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame();
  const obj = (i: number) => i === 0 ? <div style={{ width: 380, height: 70, background: "linear-gradient(180deg,#C99A62,#A7773F)", borderRadius: 6 }} />
    : i === 1 ? <div style={{ display: "flex", gap: 30 }}>{[0, 1, 2].map((j) => <div key={j} style={{ width: 28, height: 150, background: "linear-gradient(90deg,#9A9A9A,#E0E0E0,#9A9A9A)", clipPath: "polygon(0 0,100% 0,100% 85%,50% 100%,0 85%)" }} />)}</div>
    : <div style={{ width: 200, height: 200, background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.95) 0 3px, transparent 3px 14px), repeating-linear-gradient(90deg, rgba(255,255,255,0.95) 0 3px, transparent 3px 14px), rgba(200,195,180,0.5)" }} />;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      {items.map((it, i) => { const q = sp(f, it.f, 12); const t = interpolate(f, [it.f + 6, it.f + 14], [0, 1], CL);
        return <div key={i} style={{ position: "absolute", left: 160 + i * 560, top: 300, width: 480, height: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: cl(q * 2), transform: `translateY(${(1 - q) * 80}px)` }}>
          {obj(i)}<div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: "#FFF8EE", marginTop: 40 }}>Sin {it.t}</div>
          <div style={{ position: "absolute", left: 30, top: 190, width: 420 * t, height: 16, background: W.rojo, transform: "rotate(-14deg)", transformOrigin: "0 50%" }} />
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- el parche mariposa: el cuadrado de yeso con sus alas de papel; según el modo, adelanto, medidas, alas o corte
export const MariposaD: React.FC<{ modo: "teaser" | "medidas" | "alas" | "corte"; bg?: string; dur: number }> = ({ modo, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 13); const flap = modo === "alas" || modo === "teaser" ? 0.82 + 0.18 * Math.cos(f / 9) : 1; const m = sp(f, 14, 14);
  const parche = (
    <div style={{ position: "relative", width: 560, height: 560 }}>
      <div style={{ position: "absolute", inset: 0, display: modo === "alas" ? "none" : "block", background: "linear-gradient(160deg,#FFFFFF,#ECE8DF)", transform: `scaleX(${flap})`, boxShadow: "0 30px 50px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 140, top: 140, width: 280, height: 280, background: "repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,0.06) 0 3px, transparent 3px 9px), #DDD6C6", boxShadow: "0 0 0 4px rgba(0,0,0,0.12)" }} />
      {modo === "alas" ? [0, 1, 2, 3].map((i) => { const q = sp(f, 6 + i * 7, 12); const st: React.CSSProperties = i === 0 ? { left: 140, top: 0, width: 280, height: 140, transformOrigin: "50% 100%", transform: `scaleY(${q})` } : i === 1 ? { left: 140, top: 420, width: 280, height: 140, transformOrigin: "50% 0", transform: `scaleY(${q})` } : i === 2 ? { left: 0, top: 140, width: 140, height: 280, transformOrigin: "100% 50%", transform: `scaleX(${q})` } : { left: 420, top: 140, width: 140, height: 280, transformOrigin: "0 50%", transform: `scaleX(${q})` };
        return <div key={i} style={{ position: "absolute", ...st, background: "linear-gradient(160deg,#FFFFFF,#E9E4D8)", boxShadow: `0 0 0 4px ${W.rojo}`, opacity: cl(q * 2) }} />; }) : null}
      {modo === "medidas" ? <>
        <div style={{ position: "absolute", left: 140, top: 450, width: 280, height: 6, background: W.rojo, opacity: cl(m * 2) }} /><div style={{ position: "absolute", left: 180, top: 466, fontFamily: SANS, fontWeight: 700, fontSize: 52, color: W.rojo, opacity: cl(m * 2) }}>10 cm</div>
        <div style={{ position: "absolute", left: 0, top: -70, width: 560, height: 6, background: "#2D3A5A", opacity: cl(m * 2) }} /><div style={{ position: "absolute", left: 190, top: -140, fontFamily: SANS, fontWeight: 700, fontSize: 60, color: "#FFF8EE", opacity: cl(m * 2), textShadow: tsh }}>20 cm</div>
        <div style={{ position: "absolute", left: 10, top: 260, fontFamily: SANS, fontWeight: 700, fontSize: 56, color: "#2D3A5A", opacity: cl(m * 2) }}>+5</div><div style={{ position: "absolute", left: 460, top: 260, fontFamily: SANS, fontWeight: 700, fontSize: 56, color: "#2D3A5A", opacity: cl(m * 2) }}>+5</div></> : null}
    </div>);
  if (modo === "corte") {
    const k = interpolate(f, [8, 34], [0, 1], { ...CL, easing: ease });
    return (
      <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
        <div style={{ position: "absolute", left: 200, top: 380, width: 560, height: 300, background: "#E9E2D3" }} /><div style={{ position: "absolute", left: 1160, top: 380, width: 560, height: 300, background: "#E9E2D3" }} />
        <div style={{ position: "absolute", left: 760, top: 380 - 300 * (1 - k), width: 400, height: 300, background: "#DDD6C6", opacity: cl(k * 2) }} />
        <div style={{ position: "absolute", left: 560, top: 364 - 300 * (1 - k), width: 800, height: 16, background: "#FFFFFF", boxShadow: "0 3px 6px rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", left: 560, top: 356 - 300 * (1 - k), width: 800, height: 8, background: W.mas, opacity: k }} />
        {[[200, "PLACA"], [760, "PARCHE"], [1160, "PLACA"]].map(([x, t], i) => <div key={i} style={{ position: "absolute", left: (x as number), top: 700, width: i === 1 ? 400 : 560, textAlign: "center", opacity: cl(k * 2) }}><Kick txt={t as string} color={i === 1 ? W.luz : "#D9CFBF"} /></div>)}
        <div style={{ position: "absolute", left: 1380, top: 296 - 300 * (1 - k), opacity: k }}><Kick txt="← PESTAÑA" color="#FFF8EE" style={{ fontSize: 50, whiteSpace: "nowrap" }} /></div>
        <div style={{ position: "absolute", left: 200, top: 110 }}><Titulo txt="El papel hace el trabajo del listón" size={80} /><Kick txt="EL YESO TRABADO · LA PESTAÑA LO SOSTIENE" style={{ marginTop: 14 }} /></div>
      </AbsoluteFill>);
  }
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.75} />
      <div style={{ position: "absolute", right: 200, top: 250, transform: `scale(${0.7 + 0.3 * p}) rotate(${(1 - p) * 12 - 3}deg)`, opacity: cl(p * 2) }}>{parche}</div>
      <div style={{ position: "absolute", left: 120, top: 300, width: 860 }}>
        {modo === "teaser" ? <><Kick txt="EL QUE LO DEJÓ HELADO" color="#FFB4A6" /><Titulo txt="El parche mariposa" size={110} style={{ marginTop: 10 }} /><div style={{ marginTop: 24 }}><span style={{ background: W.rojo, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 52, padding: "6px 24px", letterSpacing: 3 }}>SIN LISTÓN · SIN TORNILLOS</span></div></>
          : modo === "medidas" ? <><Titulo txt="Hueco de 10 × 10" size={96} /><Titulo txt="pedazo de 20 × 20" size={96} f0={14} style={{ color: W.luz }} /></>
          : <><Titulo txt="Parece una mariposa" size={100} /><Kick txt="5 CM DE PESTAÑA DE PAPEL" style={{ marginTop: 14 }} /></>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- cinco lunas: la foto del living; las cinco manchas se encienden de a una
export const LunasD: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame(); const P: [number, number][] = [[22, 34], [38, 30], [55, 38], [70, 28], [83, 40]];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Pic src={src} style={{ transform: `scale(${1.04 + f / 1600})` }} />
      <AbsoluteFill style={{ background: "rgba(10,8,6,0.35)" }} />
      {P.map(([x, y], i) => { const q = sp(f, 6 + i * 8, 12); return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 170, height: 170, marginLeft: -85, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,220,0.85) 30%, rgba(255,246,220,0) 70%)", transform: `scale(${q})` }} />; })}
      <div style={{ position: "absolute", left: 120, bottom: 110 }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 84, padding: "8px 36px" }}>cinco manchas, como cinco lunas</span></div>
    </AbsoluteFill>
  );
};

// ---------- el poro: la masilla vista de cerca es un colador; la pintura se hunde. El fijador pasa y cierra los poros
export const PoroD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const fx = interpolate(f, [20, 60], [-120, 960], { ...CL, easing: Easing.inOut(Easing.sin) }); const z = 1.0 + f / 1200; const lb = sp(f, 56, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#D9D1C0" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <Muro tone="#E8E1D2" />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(0, fx), background: "linear-gradient(180deg,#B7C7AE,#A9BBA0)" }} />
        {Array.from({ length: 60 }, (_, i) => { const x = (i % 10) * 190 + 50 + ((i * 53) % 60); const y = Math.floor(i / 10) * 170 + 70 + ((i * 29) % 40); const sealed = x < fx; const r = 50 + ((i * 17) % 30);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%", background: sealed ? "radial-gradient(circle, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0) 72%)" : "radial-gradient(circle, #2F2920 28%, #7A6F5E 52%, rgba(200,190,170,0) 72%)", transform: `scale(${sealed ? 0.5 : 1 + 0.12 * Math.sin((f + i * 7) / 8)})` }} />; })}
      </AbsoluteFill>
      {fx > -100 && fx < 950 ? <div style={{ position: "absolute", left: fx - 70, top: 340 + Math.sin(f / 5) * 120, width: 140, height: 360, borderRadius: 30, background: "repeating-linear-gradient(0deg,#C9D6C0 0 6px,#B2C3A8 6px 12px)", boxShadow: "0 20px 30px rgba(0,0,0,0.3)" }} /> : null}
      <div style={{ position: "absolute", left: 956, top: 0, bottom: 0, width: 8, background: "#2B261F", opacity: cl(lb * 2) }} />
      <div style={{ position: "absolute", left: 80, top: 120, opacity: cl(lb * 2) }}><span style={{ background: W.noche, color: "#C8F0C0", fontFamily: SANS, fontWeight: 700, fontSize: 56, padding: "6px 24px" }}>con fijador: parejo</span></div>
      <div style={{ position: "absolute", left: 1040, top: 120, opacity: cl(lb * 2) }}><span style={{ background: W.noche, color: "#FFC9B8", fontFamily: SANS, fontWeight: 700, fontSize: 56, padding: "6px 24px" }}>sin fijador: chupa</span></div>
      <div style={{ position: "absolute", left: 120, top: 880 }}><span style={{ background: W.noche, color: "#FFF8EE", fontFamily: SERIF, fontWeight: 700, fontSize: 74, padding: "8px 34px" }}>De cerca, la masilla es un colador</span></div>
    </AbsoluteFill>
  );
};

// ---------- el paño completo: primero se pinta sólo el parche (se ve el borde); después el rodillo cubre de esquina a esquina
export const PanoD: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const e = sp(f, 0, 14); const r = interpolate(f, [26, 70], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) }); const lb = sp(f, 70, 13);
  const Pared = ({ x, full }: { x: number; full: boolean }) => (
    <div style={{ position: "absolute", left: x, top: 200, width: 860, height: 600, overflow: "hidden", boxShadow: "0 30px 50px rgba(0,0,0,0.45)" }}>
      <Muro tone="#C9B48E" />
      <div style={{ position: "absolute", left: 250, top: 160, width: 360, height: 270, background: "linear-gradient(160deg,#E9DCBC,#DCCB9F)", boxShadow: "0 0 0 5px rgba(255,255,255,0.6), 0 0 30px rgba(255,248,230,0.7)", opacity: full ? 1 - r : 1 }} />
      {full ? <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${r * 100}%`, background: "linear-gradient(180deg,#D3C19C,#C9B48E)" }} /> : null}
      {full && r > 0 && r < 1 ? <div style={{ position: "absolute", left: `calc(${r * 100}% - 60px)`, top: 120 + Math.sin(f / 4) * 140, width: 120, height: 300, borderRadius: 26, background: "repeating-linear-gradient(0deg,#D9CBAE 0 6px,#E7DCC5 6px 12px)", boxShadow: "0 20px 30px rgba(0,0,0,0.3)" }} /> : null}
    </div>);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
      <div style={{ opacity: cl(e * 2), transform: `translateY(${(1 - e) * 40}px)` }}><Pared x={70} full={false} /><Pared x={990} full /></div>
      <div style={{ position: "absolute", left: 70, top: 830, width: 860, textAlign: "center" }}><span style={{ background: W.rojo, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 54, padding: "6px 24px" }}>sólo el parche: se nota</span></div>
      <div style={{ position: "absolute", left: 990, top: 830, width: 860, textAlign: "center", opacity: cl(lb * 2) }}><span style={{ background: W.ok, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 54, padding: "6px 24px" }}>el paño entero: no se nota</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Titulo txt="De esquina a esquina" size={90} /></div>
    </AbsoluteFill>
  );
};

// ---------- me preguntaron: papelitos pegados con cinta en la placa; cada pregunta con su respuesta corta
export const NotaD: React.FC<{ q: string; a: string; bg?: string; head?: boolean; dur: number }> = ({ q, a, bg, head, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12); const pa = sp(f, 16, 14); const r = (q.length % 5) - 2;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.6} />
      {head ? [0, 1, 2, 3].map((i) => { const q = sp(f, 8 + i * 6, 12); return <div key={i} style={{ position: "absolute", left: 1180 + (i % 2) * 220, top: 180 + i * 150, width: 300, height: 200, background: ["#FFF3A8", "#FFFDF4", "#FFD9C9", "#E3F1D9"][i], boxShadow: "0 16px 30px rgba(0,0,0,0.45)", transform: `rotate(${(i % 2 ? 6 : -5)}deg) translateY(${(1 - q) * -300}px)`, opacity: cl(q * 2), fontFamily: HAND, fontWeight: 700, fontSize: 120, color: "#2D3A5A", display: "flex", alignItems: "center", justifyContent: "center" }}>?</div>; }) : null}
      <div style={{ position: "absolute", left: 140, top: 200, width: 980, background: "#FFFDF4", padding: "56px 56px 50px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", transform: `rotate(${r * (1 - 0.6 * p)}deg) translateY(${(1 - p) * -200}px)`, opacity: cl(p * 2) }}>
        <div style={{ position: "absolute", left: 380, top: -26, width: 220, height: 56, background: "rgba(230,221,200,0.88)", transform: "rotate(-3deg)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: head ? 110 : 76, lineHeight: 1.08, color: "#2D3A5A" }}>{q}</div>
        {a ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 56, lineHeight: 1.12, color: W.ink, marginTop: 26, opacity: cl(pa * 2), borderTop: `6px solid ${W.beigeD}`, paddingTop: 20 }}>{a}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- el costo: la visita del que viene a tapar contra lo que gastas tú (dos columnas que crecen)
export const CostoD: React.FC<{ rows: { t: string; v: string; f: number }[]; total?: string; bg?: string; mode: "visita" | "lista" | "total"; dur: number }> = ({ rows, total, bg, mode, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 13);
  if (mode === "visita") {
    const a = interpolate(f, [4, 30], [0, 1], { ...CL, easing: ease });
    return (
      <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B261F,#16130F)" }}>
        <div style={{ position: "absolute", left: 300, bottom: 220, width: 360, height: 600 * a, background: `linear-gradient(180deg, ${W.rojo}, #8E2620)` }} />
        <div style={{ position: "absolute", left: 1160, bottom: 220, width: 360, height: 60 * a, background: `linear-gradient(180deg, ${W.ok}, #2F6A37)` }} />
        <div style={{ position: "absolute", left: 300, bottom: 240 + 600 * a, width: 360, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 84, color: "#FFB4A6" }}>$20–50</div>
        <div style={{ position: "absolute", left: 1160, bottom: 300, width: 360, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 84, color: "#9EE0A6", opacity: a }}>minutos</div>
        <div style={{ position: "absolute", left: 180, bottom: 120, width: 600, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: "#FFF8EE", whiteSpace: "nowrap" }}>que venga alguien</div>
        <div style={{ position: "absolute", left: 1040, bottom: 120, width: 600, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: "#FFF8EE", whiteSpace: "nowrap" }}>tu trabajo</div>
      </AbsoluteFill>);
  }
  if (mode === "total") {
    const n = Math.round(interpolate(f, [4, 34], [0, 25], { ...CL, easing: ease }));
    return (
      <AbsoluteFill style={{ opacity: out(f, dur) }}>
        <Fondo bg={bg} dur={dur} side="all" k={0.9} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 320, color: W.luz, textShadow: tsh, lineHeight: 1 }}>${n}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}><Titulo txt={total || ""} size={80} f0={20} /></div>
      </AbsoluteFill>);
  }
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.6} />
      <div style={{ position: "absolute", left: 140, top: 60, width: 1100, minHeight: 940, background: "#FFFDF4", padding: "60px 60px 40px", boxShadow: "0 40px 70px rgba(0,0,0,0.6)", transform: `rotate(-1deg) translateY(${(1 - p) * 60}px)`, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 116px, rgba(86,124,170,0.3) 116px 119px)" }}>
        {rows.map((r, i) => { const q = sp(f, r.f, 14); return <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", height: 116, opacity: cl(q * 1.6) }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#22304A" }}>{r.t}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: "#8E3B12" }}>{r.v}</div></div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- repaso: la pared de práctica vuelve, ahora con los 12 parches; el que se nombra se ilumina y sube su nombre
export const RepasoD: React.FC<{ cards: { n: number; t: string; src: string; f: number }[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame(); let a = 0; cards.forEach((c, i) => { if (f >= c.f) a = i; }); const cur = cards[a]; const pa = sp(f, cur.f, 14);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro tone="#CDBE9F" />
      <div style={{ position: "absolute", left: 60, right: 60, top: 40, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
        {cards.map((c, i) => { const on = i === a; const done = f >= c.f;
          return <div key={i} style={{ height: 290, position: "relative", overflow: "hidden", borderRadius: "46% 54% 41% 59% / 55% 43% 57% 45%", boxShadow: on ? `0 0 0 10px ${W.luz}` : "inset 0 0 0 6px rgba(255,255,255,0.4)", opacity: 1, transform: `scale(${on ? 1 + 0.05 * pa : 0.94})` }}>
            <Pic src={c.src} style={{ filter: done ? "none" : "brightness(0.78) saturate(0.7)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 60, color: "#FFF", textShadow: tsh }}>{c.n}</div>
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 50, height: 150, background: W.noche, display: "flex", alignItems: "center", padding: "0 44px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 96, color: W.luz, width: 150 }}>{cur.n}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: "#FFF8EE", opacity: a === 0 ? 1 : cl(pa * 1.5), transform: `translateY(${a === 0 ? 0 : (1 - pa) * 30}px)` }}>{cur.t}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- pregunta final: tres agujeros en la pared con su foto adentro; el que se nombra se agranda
export const VotoD: React.FC<{ q: string; opts: { t: string; src: string; f: number }[]; dur: number }> = ({ q, opts, dur }) => {
  const f = useCurrentFrame(); let a = -1; opts.forEach((o, i) => { if (f >= o.f) a = i; });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Muro />
      <div style={{ position: "absolute", left: 100, right: 100, top: 50, textAlign: "center" }}><Titulo txt={q} size={76} color={W.ink} /></div>
      {opts.map((o, i) => { const p = sp(f, i * 4, 12); const on = i === a;
        return <div key={i} style={{ position: "absolute", left: 140 + i * 580, top: 290, width: 500, transform: `scale(${(0.6 + 0.4 * p) * (on ? 1.08 : 1)})`, opacity: cl(p * 2) }}>
          <div style={{ height: 460, overflow: "hidden", borderRadius: "46% 54% 41% 59% / 55% 43% 57% 45%", boxShadow: on ? `0 0 0 12px ${W.rojo}` : "0 0 0 10px #FFFFFF" }}><Pic src={o.src} /></div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 76, color: W.ink, textAlign: "center", marginTop: 20 }}>{o.t}</div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- capas sobre el avatar
// progreso: una tira de 12 marcas de masilla abajo a la izquierda; la del método actual se tapa
export const ProgD: React.FC<{ n: number; N: number; title: string; dur: number }> = ({ n, N: tot, title, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 16);
  return (
    <div style={{ position: "absolute", left: 50, bottom: 40, display: "flex", alignItems: "center", gap: 20, opacity: out(f, dur, 10) * cl(p * 1.5), transform: `translateY(${(1 - p) * 40}px)`, background: "rgba(20,17,13,0.84)", padding: "12px 26px 12px 16px", borderRadius: 14 }}>
      <div style={{ display: "flex", gap: 7 }}>{Array.from({ length: tot }, (_, i) => { const now = i === n - 1; const k = i < n - 1 ? 1 : now ? interpolate(f, [4, 26], [0, 1], CL) : 0;
        return <div key={i} style={{ width: 28, height: 28, borderRadius: "46% 54% 41% 59%", background: k >= 1 ? W.mas : `radial-gradient(circle, #0B0907 ${(1 - k) * 60}%, ${W.mas} ${(1 - k) * 60 + 2}%)`, boxShadow: now ? `0 0 0 3px ${W.luz}` : "none" }} />; })}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: "#FFF4E2", letterSpacing: 1 }}>{n}/{tot} · {title}</div>
    </div>
  );
};
// QR: un recorte de placa atornillado a la derecha del avatar
export const QrD: React.FC<{ qr: string; cover: string; dur: number }> = ({ qr, cover, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 13);
  return (
    <div style={{ position: "absolute", right: 50, bottom: 50, width: 700, opacity: out(f, dur, 6), transform: `translateX(${(1 - p) * 800}px) translateY(${Math.sin(f / 28) * 6}px) rotate(${(1 - p) * 8 + 1 + Math.sin(f / 45) * 0.6}deg)` }}>
      <div style={{ background: "linear-gradient(170deg,#F4EFE6,#E1D9C9)", padding: "34px 30px 22px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", position: "relative" }}>
        {[[12, 12], [662, 12], [12, 392], [662, 392]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #8A8A8A, #262626)" }} />)}
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <Img src={staticFile(cover)} style={{ width: 380, height: 212, objectFit: "cover", objectPosition: "50% 30%", boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }} />
          <Img src={staticFile(qr)} style={{ width: 236, height: 236, background: "#fff", padding: 8 }} />
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: W.ink, marginTop: 14, textAlign: "center" }}>constructorlibre.com</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#8E3B12", textAlign: "center" }}>las láminas de los 12 métodos</div>
      </div>
    </div>
  );
};
// panel partido: la foto entra detrás de un recorte de placa que se arranca hacia la izquierda
export const PanelD: React.FC<{ src: string; label: string; dur: number }> = ({ src, label, dur }) => {
  const f = useCurrentFrame(); const p = interpolate(f, [0, 12], [0, 1], { ...CL, easing: ease });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 900, opacity: out(f, dur, 10), overflow: "hidden", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, borderRight: `14px solid ${W.beigeD}` }}>
      <Pic src={src} />
      <div style={{ position: "absolute", left: 50, right: 50, bottom: 60, background: W.noche, borderLeft: `12px solid ${W.luz}`, padding: "18px 26px", fontFamily: SERIF, fontWeight: 700, fontSize: 52, lineHeight: 1.08, color: "#FFF8EE" }}>{label}</div>
    </div>
  );
};
// versión SIMPLE (rondas del EVALUADOR): foto viva + placa oscura opaca + texto grande
export const SimpleD: React.FC<{ bg?: string; title: string; sub?: string; dur: number }> = ({ bg, title, sub, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 15);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="all" k={0.25} />
      <div style={{ position: "absolute", left: 110, bottom: 100, maxWidth: 1300, background: "rgba(24,20,15,0.9)", borderLeft: `14px solid ${W.beigeD}`, padding: "40px 56px 44px", transform: `translateY(${(1 - p) * 50}px)`, opacity: cl(p * 2) }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: title.length > 30 ? 72 : 86, lineHeight: 1.06, color: "#FFF8EE" }}>{title}</div>
        {sub ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 4, color: W.luz, marginTop: 16 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
