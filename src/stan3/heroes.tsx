// ── HÉROES de Stan the Butcher · video 3 (stan3, 15-oct): "la carne picada que hervís en vez de dorar" ──
// Juego PROPIO de este video: la COCINA de atrás (enamel, hierro fundido, llama azul, azulejo), no el mostrador de stan2.
// Capas: textura real del oficio → foto/objeto con sombra → dibujo técnico (SVG) → dato → acento en su palabra.
// Dos familias: LABEL (Oswald: lo impreso, diales, stickers, tickets) y HAND (Caveat: tiza, lápiz graso, fichas de la cocina).
// Paleta: crema enlozado, negro hierro, costra marrón, llama azul, rojo del gorro, amarillo de oferta.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { useT, sp, cl, ez, eo, img, LABEL, HAND, Mark, Tick, P } from "../lkit/core";

const RED = "#B3262B", INK = "#1F1A16", CREAM = "#F3ECDD", YEL = "#F2C230", IRON = "#1B1B1D", CRUST = "#6B3A1E", FLAME = "#2E6BD6", GREEN = "#2F7D4A", PEN = "#2A3F6B", GRAY = "#8C8A86";
const SH = "0 34px 70px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.3)";
const tsh = "0 4px 18px rgba(0,0,0,0.65)";

// ── capas comunes ──
const Tex: React.FC<{ k: string; f: number; d: number; dim?: number; z?: [number, number] }> = ({ k, f, d, dim = 0, z = [1.04, 1.1] }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#141110" }}>
    <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, d)})` }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    {dim ? <AbsoluteFill style={{ background: `rgba(12,10,8,${dim})` }} /> : null}
  </AbsoluteFill>
);
const Photo: React.FC<{ k: string; f: number; d: number; z?: [number, number]; o?: string; dim?: number; filter?: string }> = ({ k, f, d, z = [1.03, 1.12], o = "50% 50%", dim = 0, filter }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
    <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, d)})`, transformOrigin: o }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter }} />
    </AbsoluteFill>
    {dim ? <AbsoluteFill style={{ background: `rgba(10,8,6,${dim})` }} /> : null}
  </AbsoluteFill>
);
// foto recortada en círculo como si fuera un plato/sartén visto desde arriba
const Round: React.FC<{ k: string; r: number; f: number; rim?: string; rimW?: number; filter?: string }> = ({ k, r, f, rim = IRON, rimW = 22, filter }) => (
  <div style={{ width: r * 2, height: r * 2, borderRadius: r, border: `${rimW}px solid ${rim}`, overflow: "hidden", boxShadow: SH, boxSizing: "border-box", background: "#000" }}>
    <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter, transform: `scale(${1.08 + 0.03 * Math.sin(f / 50)})` }} />
  </div>
);
const texBg = (k: string): React.CSSProperties => ({ backgroundImage: `url(${img(k)})`, backgroundSize: "cover", backgroundPosition: "center" });
// texto que se escribe con máscara (tiza / lápiz graso)
const Write: React.FC<{ txt: string; u: number; size: number; color: string; font?: string; weight?: number; ls?: number; sh?: string }> = ({ txt, u, size, color, font = HAND, weight = 700, ls = 0, sh }) => (
  <div style={{ display: "inline-block", fontFamily: font, fontWeight: weight, fontSize: size, color, letterSpacing: ls, whiteSpace: "nowrap", textShadow: sh, clipPath: `inset(-25% ${100 - 100 * cl(u)}% -25% -2%)` }}>{txt}</div>
);
const wr = (f: number, at: number, dur = 18) => ez((f - at) / dur);
// sello de goma (borde doble, entra grande y golpea)
const Stamp: React.FC<{ txt: string; u: number; color?: string; size?: number; rot?: number }> = ({ txt, u, color = RED, size = 120, rot = -12 }) => (
  <div style={{ display: "inline-block", opacity: cl(u * 3), transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * u})`, border: `10px double ${color}`, borderRadius: 14, padding: `${size * 0.06}px ${size * 0.3}px`,
    fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: size * 0.06, color, lineHeight: 1.05, mixBlendMode: "multiply", whiteSpace: "nowrap", background: "rgba(255,255,255,0.08)" }}>{txt}</div>
);
// tarjeta de cocina (ficha con renglones azules y margen rojo)
const Card: React.FC<{ w: number; h: number; rot?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, rot = 0, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, background: "#FBF7EC", boxShadow: SH, transform: `rotate(${rot}deg)`, overflow: "hidden",
    backgroundImage: "repeating-linear-gradient(180deg, transparent 0 74px, rgba(58,90,140,0.28) 74px 77px), linear-gradient(90deg, transparent 0 86px, rgba(179,38,43,0.5) 86px 89px, transparent 89px)",
    backgroundPosition: "0 46px, 0 0", ...style }}>{children}</div>
);
// chinche de corcho
const Pin: React.FC<{ color?: string }> = ({ color = RED }) => (
  <div style={{ position: "absolute", left: "50%", top: -14, marginLeft: -18, width: 36, height: 36, borderRadius: 18, background: `radial-gradient(circle at 35% 35%, #fff8 0 18%, ${color} 40%, #5a1013 100%)`, boxShadow: "0 8px 10px rgba(0,0,0,0.5)" }} />
);

// 1 · HERVIDA vs DORADA: la sartén gris entra a la izquierda con sus tres palabras; la dorada por la derecha; el sello "BOILED." golpea la gris.
export const BoiledBrowned: P<{ left: { k: string; txt: string; t: number }; right: { k: string; txt: string; t: number }; stamp: number }> = ({ a, d, left, right, stamp }) => {
  const { f, at } = useT(a);
  const ul = sp(f, at(left.t) - 4, 15, 120), ur = sp(f, at(right.t), 13, 150), us = sp(f, at(stamp), 9, 260);
  const words = ["gray", "wet", "crumbly"], wt = [3.6, 4.2, 4.8];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: IRON }}>
      {/* gris: media pantalla izquierda, desaturada */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `polygon(0 0, ${50 + 50 * (1 - ur) + 4}% 0, ${50 + 50 * (1 - ur) - 4}% 100%, 0 100%)`, opacity: cl(ul * 1.4) }}>
        <Photo k={left.k} f={f} d={d} z={[1.06, 1.16]} o="30% 50%" filter={`saturate(${0.35 + 0.65 * (1 - us)})`} />
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6), transparent 45%)" }} />
      </div>
      {/* dorada: entra en diagonal por la derecha */}
      {f >= at(right.t) - 2 ? (
        <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${50 + 50 * (1 - ur) + 4}% 0, 100% 0, 100% 100%, ${50 + 50 * (1 - ur) - 4}% 100%)` }}>
          <Photo k={right.k} f={f} d={d} z={[1.12, 1.04]} o="75% 50%" />
          <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6), transparent 45%)" }} />
        </div>
      ) : null}
      {/* filo de acero entre las dos */}
      {f >= at(right.t) ? <div style={{ position: "absolute", left: `${50 + 50 * (1 - ur) - 4}%`, top: 0, width: 16, height: 1080 * 1.1, background: "linear-gradient(90deg,#444,#ddd,#555)",
        transform: "skewX(-4.3deg)", transformOrigin: "0 100%", boxShadow: "0 0 30px rgba(0,0,0,0.8)" }} /> : null}
      {/* tres palabras escritas sobre la gris */}
      <div style={{ position: "absolute", left: 90, bottom: 110, display: "flex", gap: 30 }}>
        {words.map((w, i) => <Write key={i} txt={w + (i < 2 ? "," : "")} u={wr(f, at(wt[i]), 10)} size={96} color="#E9E4DA" sh={tsh} />)}
      </div>
      {f >= at(right.t) ? (
        <div style={{ position: "absolute", right: 110, bottom: 100, transform: `translateY(${(1 - ur) * 80}px)`, opacity: cl(ur * 2) }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 132, letterSpacing: 10, color: YEL, textShadow: tsh }}>{right.txt}</div>
          <div style={{ height: 10, background: YEL, width: `${100 * ez((f - at(right.t) - 6) / 12)}%`, boxShadow: tsh }} />
        </div>
      ) : null}
      {f >= at(stamp) ? <div style={{ position: "absolute", left: 220, top: 260 }}><Stamp txt={left.txt + "."} u={us} size={150} /></div> : null}
    </AbsoluteFill>
  );
};

// 2 · SIETE AZULEJOS: la pared de la cocina con 7 azulejos numerados; cada uno que nombra se da vuelta y muestra su foto.
export const SevenTiles: P<{ items: { k: string; t: number; txt: string }[] }> = ({ a, d, items }) => {
  const { f, at } = useT(a);
  const S = 330, G = 26, cols = 4;
  const pos = (i: number) => { const r = i < 4 ? 0 : 1; const c = i < 4 ? i : i - 4; const off = r ? (S + G) / 2 : 0; return { x: 960 - (cols * S + (cols - 1) * G) / 2 + off + c * (S + G), y: 150 + r * (S + G + 60) }; };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_tile" f={f} d={d} dim={0.45} />
      {Array.from({ length: 7 }).map((_, i) => {
        const it = items[i]; const p = pos(i);
        const ui = sp(f, i * 2, 16, 160);
        const flip = it ? ez((f - at(it.t)) / 10) : 0;
        const cur = it && f >= at(it.t) && (i === items.length - 1 || f < at(items[i + 1].t));
        const back = flip > 0.5;
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: S, height: S, transform: `perspective(1400px) rotateY(${180 * flip}deg) scale(${(0.6 + 0.4 * ui) * (cur ? 1.06 : 1)})`, opacity: cl(ui * 2) }}>
            {!back ? (
              <div style={{ width: S, height: S, background: "linear-gradient(145deg,#FBF8F1,#E6E0D3)", borderRadius: 10, boxShadow: "0 18px 30px rgba(0,0,0,0.45), inset 0 0 0 6px rgba(255,255,255,0.7)",
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 170, color: it ? FLAME : "#B9B2A5" }}>{i + 1}</div>
            ) : (
              <div style={{ width: S, height: S, borderRadius: 10, overflow: "hidden", boxShadow: cur ? `0 0 0 8px ${YEL}, ${SH}` : SH, position: "relative", transform: "rotateY(180deg)" }}>
                <Img src={img(it.k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: cur ? undefined : "brightness(0.7)" }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: 64, height: 64, background: FLAME, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 16px 12px", background: "linear-gradient(0deg, rgba(0,0,0,0.85), transparent)", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#fff", textAlign: "center" }}>{it.txt}</div>
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 3 · REGLA DE TIZA: pizarrita colgada de un clavo en el azulejo de la cocina de la madre; la regla se escribe en su palabra.
export const ChalkRule: P<{ rule: string; sub: string; t: number }> = ({ a, d, rule, sub, t }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, 0, 12, 90), sw = Math.sin(f / 18) * 2.2 * (1 - cl(f / 60)) + Math.sin(f / 40) * 0.6;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_tile" f={f} d={d} dim={0.25} z={[1.1, 1.04]} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.55))" }} />
      {/* clavo + hilo */}
      <div style={{ position: "absolute", left: 948, top: 70, width: 24, height: 24, borderRadius: 12, background: "radial-gradient(circle at 35% 35%, #ccc, #333)", boxShadow: "0 6px 8px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${(1 - u0) * -700}px) rotate(${sw}deg)`, transformOrigin: "960px 82px" }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}><path d="M 960 82 L 640 250 M 960 82 L 1280 250" stroke="#d8cdb6" strokeWidth={5} fill="none" /></svg>
        <div style={{ position: "absolute", left: 560, top: 240, width: 800, height: 520, borderRadius: 8, border: "26px solid #7A5534", boxShadow: SH, ...texBg("t_chalk"), boxSizing: "border-box",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: LABEL, fontSize: 34, letterSpacing: 8, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>MAMA'S KITCHEN</div>
          <Write txt={rule} u={wr(f, at(t), 22)} size={150} color="#F4F1EA" sh="0 0 6px rgba(255,255,255,0.35)" />
          <div style={{ height: 6, width: 520 * ez((f - at(t) - 22) / 12), background: "rgba(244,241,234,0.85)", borderRadius: 3, marginTop: 4 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}>
        <Write txt={sub} u={wr(f, 10, 30)} size={64} color={CREAM} sh={tsh} />
      </div>
    </AbsoluteFill>
  );
};

// 4 · BARRA DE MEZCLA: la carne con sus vetas a la izquierda; a la derecha cada paquete es una barra magra/grasa que se llena en su palabra.
export const BlendBar: P<{ k: string; rows: { t: number; lean: number; lab: string; good: boolean }[]; hl: number }> = ({ a, d, k, rows, hl }) => {
  const { f, at } = useT(a);
  const ord = [...rows].sort((x, y) => x.t - y.t);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} z={[1.14, 1.04]} o="20% 50%" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0) 18%, rgba(10,8,6,0.82) 52%)" }} />
      {ord.map((r, i) => {
        if (f < at(r.t) - 2) return null;
        const u = sp(f, at(r.t), 14, 150), fill = ez((f - at(r.t) - 4) / 18);
        const big = r.good && f >= at(hl);
        return (
          <div key={i} style={{ position: "absolute", left: 920, top: 230 + i * 330, width: 900, opacity: cl(u * 2), transform: `translateX(${(1 - u) * 200}px) scale(${big ? 1 + 0.06 * sp(f, at(hl), 10, 200) : 1})`, transformOrigin: "0 50%" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 12 }}>
              <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 104, color: r.good ? YEL : "#D9D4CC", textShadow: tsh }}>{r.lab}</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CREAM, textShadow: tsh }}>{r.good ? "the juicy one" : "dry and sandy"}</span>
            </div>
            <div style={{ position: "relative", height: 86, borderRadius: 43, overflow: "hidden", background: "#2a2522", boxShadow: "inset 0 6px 12px rgba(0,0,0,0.6), 0 10px 22px rgba(0,0,0,0.4)" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${r.lean * fill}%`, background: "linear-gradient(180deg,#D0423F,#8E1E22)" }} />
              <div style={{ position: "absolute", left: `${r.lean * fill}%`, top: 0, bottom: 0, width: `${(100 - r.lean) * fill}%`, background: "linear-gradient(180deg,#FFF8EA,#E8DCC4)" }} />
              <div style={{ position: "absolute", left: 30, top: 14, fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: "#fff", opacity: fill }}>LEAN {r.lean}%</div>
              <div style={{ position: "absolute", right: 24, top: 14, fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: INK, opacity: fill * (r.lean < 88 ? 1 : 0) }}>FAT {100 - r.lean}%</div>
            </div>
            <div style={{ position: "absolute", right: -10, top: -6 }}><Tick f={f} at={at(r.t) + 18} size={70} color={r.good ? GREEN : RED} no={!r.good} /></div>
            {big ? <Mark kind="circle" x={-30} y={-20} w={330} h={150} f={f} at={at(hl)} dur={12} color={YEL} sw={9} /> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 5 · NOTA EN EL PAQUETE: el paquete de papel de carnicería; Stan escribe el pedido con lápiz graso sobre el papel.
export const WrapNote: P<{ k: string; lines: { t: number; txt: string }[] }> = ({ a, d, k, lines }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, 0, 14, 140);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.3} z={[1.05, 1.13]} />
      <div style={{ position: "absolute", left: 420, top: 250, width: 1080, height: 560, ...texBg("t_paper"), boxShadow: SH, transform: `rotate(${-3 + 1.5 * u0}deg) translateY(${(1 - u0) * 700}px)`,
        clipPath: "polygon(0 3%, 6% 0, 14% 2%, 26% 0, 40% 3%, 55% 0, 70% 2%, 84% 0, 100% 2%, 99% 98%, 85% 100%, 68% 97%, 50% 100%, 33% 98%, 17% 100%, 0 97%)" }}>
        {/* hilo de atar */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 268, height: 8, background: "linear-gradient(180deg,#c9b48d,#8e7a55)", opacity: 0.85 }} />
        <div style={{ position: "absolute", left: 520, top: 0, bottom: 0, width: 8, background: "linear-gradient(90deg,#c9b48d,#8e7a55)", opacity: 0.85 }} />
        {lines.map((l, i) => (
          <div key={i} style={{ position: "absolute", left: 80, top: 70 + i * 250, transform: `rotate(${i ? 1.5 : -2}deg)` }}>
            <Write txt={l.txt} u={wr(f, at(l.t), 18)} size={i ? 116 : 150} color={i ? RED : INK} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 6 · DIAL DE CALOR: la sartén con vapor de fondo; un dial de horno: la aguja se clava en 212 °F (hervir) y no llega a la zona de dorar.
export const HeatGauge: P<{ k: string; boil: number; brown: number }> = ({ a, d, k, boil, brown }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, 0, 15, 130);
  const T0 = 100, T1 = 450; const ang = (T: number) => -120 + 240 * (T - T0) / (T1 - T0);
  const target = f < at(boil) ? lin0(f, 0, at(boil), 120, 212) : 212 + 4 * Math.sin((f - at(boil)) / 3) * (1 - cl((f - at(boil)) / 40));
  const ub = sp(f, at(brown), 13, 150);
  const R = 300, cx = 560, cy = 560;
  const arc = (t0: number, t1: number, r: number) => { const p = (T: number) => { const A = (ang(T) - 90) * Math.PI / 180; return [cx + r * Math.cos(A), cy + r * Math.sin(A)]; };
    const [x0, y0] = p(t0), [x1, y1] = p(t1); return `M ${x0} ${y0} A ${r} ${r} 0 ${ang(t1) - ang(t0) > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.45} z={[1.04, 1.14]} />
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${0.8 + 0.2 * u0})`, transformOrigin: "560px 560px", opacity: cl(u0 * 2) }}>
        <svg width={1120} height={1080}>
          <defs><radialGradient id="dial3" cx="45%" cy="40%"><stop offset="0" stopColor="#FFFDF7" /><stop offset="1" stopColor="#DCD3C1" /></radialGradient></defs>
          <circle cx={cx} cy={cy} r={R + 50} fill="#2b2b2e" stroke="#9aa0a4" strokeWidth={14} />
          <circle cx={cx} cy={cy} r={R + 20} fill="url(#dial3)" />
          <path d={arc(100, 212, R - 20)} stroke={FLAME} strokeWidth={36} fill="none" />
          <path d={arc(300, 450, R - 20)} stroke={CRUST} strokeWidth={36} fill="none" opacity={0.35 + 0.65 * cl(ub)} />
          {Array.from({ length: 15 }).map((_, i) => { const T = T0 + i * 25; const A = (ang(T) - 90) * Math.PI / 180;
            return <line key={i} x1={cx + (R - 60) * Math.cos(A)} y1={cy + (R - 60) * Math.sin(A)} x2={cx + (R - 90 + (i % 2 ? 12 : 0)) * Math.cos(A)} y2={cy + (R - 90 + (i % 2 ? 12 : 0)) * Math.sin(A)} stroke={INK} strokeWidth={i % 2 ? 4 : 7} />; })}
          <g transform={`rotate(${ang(target)} ${cx} ${cy})`}>
            <path d={`M ${cx - 14} ${cy} L ${cx} ${cy - R + 40} L ${cx + 14} ${cy} Z`} fill={RED} />
          </g>
          <circle cx={cx} cy={cy} r={34} fill="#2b2b2e" stroke="#9aa0a4" strokeWidth={6} />
          <text x={cx} y={cy + 150} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={96} fill={INK}>{Math.round(target)}°F</text>
        </svg>
      </div>
      {f >= at(boil) ? (
        <div style={{ position: "absolute", left: 1120, top: 260, opacity: cl(sp(f, at(boil), 14, 150) * 2) }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: "#9CC0FF" }}>WATER IN THE PAN</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 150, color: "#fff", lineHeight: 1, textShadow: tsh }}>212°F</div>
          <Write txt="stuck right here" u={wr(f, at(boil) + 10, 16)} size={64} color={CREAM} sh={tsh} />
        </div>
      ) : null}
      {f >= at(brown) ? (
        <div style={{ position: "absolute", left: 1120, top: 640, opacity: cl(ub * 2), transform: `translateX(${(1 - ub) * 120}px)` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: "#E9A36B" }}>BROWNING NEEDS</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 150, color: YEL, lineHeight: 1, textShadow: tsh }}>300°F+</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const lin0 = (f: number, a: number, b: number, v0: number, v1: number) => v0 + (v1 - v0) * eo((f - a) / Math.max(1, b - a));

// 7 · TAMAÑO DE SARTÉN (vista cenital sobre acero): 1 lb en sartén chica = amontonada; la de 12"; y dos libras = dos sartenes.
const Pan: React.FC<{ r: number; fill: number; crowd?: boolean; f: number; label?: string }> = ({ r, fill, crowd, f, label }) => (
  <div style={{ position: "relative", width: r * 2 + 220, height: r * 2 }}>
    <div style={{ position: "absolute", left: r * 2 - 30, top: r - 34, width: 250, height: 68, borderRadius: 20, background: "linear-gradient(180deg,#38383c,#141416)", boxShadow: "0 16px 20px rgba(0,0,0,0.5)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: r * 2, height: r * 2, borderRadius: r, background: "radial-gradient(circle at 45% 40%, #2c2c30, #0d0d0f 70%)", boxShadow: `${SH}, inset 0 0 0 ${r * 0.08}px #232326, inset 0 0 ${r * 0.2}px #000` }}>
      {Array.from({ length: crowd ? 46 : 26 }).map((_, i) => {
        const A = i * 2.399, rr = Math.sqrt((i + 0.5) / (crowd ? 46 : 26)) * r * (crowd ? 0.8 : 0.7) * fill;
        const s = crowd ? r * 0.2 : r * 0.13;
        return <div key={i} style={{ position: "absolute", left: r + rr * Math.cos(A) - s / 2, top: r + rr * Math.sin(A) - s / 2, width: s, height: s * 0.85, borderRadius: "45% 55% 50% 50%",
          background: crowd ? "radial-gradient(circle at 40% 35%, #b8a89c, #7d6c62)" : `radial-gradient(circle at 40% 35%, #a2603a, ${CRUST})`, transform: `rotate(${i * 37}deg)`, opacity: fill > 0.05 ? 1 : 0 }} />;
      })}
      {crowd ? <div style={{ position: "absolute", inset: r * 0.12, borderRadius: "50%", background: "radial-gradient(circle, transparent 55%, rgba(200,200,190,0.35) 75%)" }} /> : null}
    </div>
    {label ? <div style={{ position: "absolute", left: 0, width: r * 2, top: r * 2 + 18, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#fff", textShadow: tsh }}>{label}</div> : null}
  </div>
);
export const PanSizes: P<{ t: number; big: number; two: number }> = ({ a, d, t, big, two }) => {
  const { f, at } = useT(a);
  const ub = sp(f, at(big), 14, 130), u2 = sp(f, at(two), 14, 130), u0 = sp(f, at(t), 14, 140);
  const phase2 = f >= at(two);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_steel" f={f} d={d} dim={0.3} />
      {!phase2 ? (
        <>
          <div style={{ position: "absolute", left: 170, top: 330, opacity: cl(u0 * 2), transform: `scale(${0.7 + 0.3 * u0})` }}><Pan r={210} fill={1} crowd f={f} label="8-inch · crowded" /></div>
          {f >= at(big) ? <div style={{ position: "absolute", left: 830, top: 150, opacity: cl(ub * 2), transform: `scale(${0.7 + 0.3 * ub})`, transformOrigin: "40% 50%" }}><Pan r={330} fill={1} f={f} label="12-inch skillet · 1 lb" /></div> : null}
          {f >= at(big) ? <div style={{ position: "absolute", left: 175, top: 260 }}><Mark kind="strike" x={0} y={0} w={420} h={420} f={f} at={at(big) + 8} dur={10} color={RED} sw={14} /></div> : null}
        </>
      ) : (
        <>
          {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 880, top: 230, opacity: cl(sp(f, at(two) + i * 8, 14, 130) * 2), transform: `translateY(${(1 - sp(f, at(two) + i * 8, 14, 130)) * 300}px)` }}>
            <Pan r={300} fill={1} f={f} label={`pan ${i + 1} · 1 lb`} /></div>)}
          <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 96, color: YEL, letterSpacing: 6, textShadow: tsh, opacity: cl(u2 * 2) }}>2 LB = 2 PANS</div>
        </>
      )}
    </AbsoluteFill>
  );
};

// 8 · MANOS AFUERA: el borde chisporroteando; un aro de cronómetro corre 4-5 min y cada "don't" cae como sello sobre el costado.
export const HandsOff: P<{ k: string; t: number; no: number[] }> = ({ a, d, k, t, no }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, at(t), 14, 140), prog = cl((f - at(t)) / Math.max(1, d - at(t)));
  const labs = ["don't poke", "don't stir", "don't peek"];
  const C = 2 * Math.PI * 190;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.3} z={[1.05, 1.18]} o="40% 60%" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.6), transparent 45%)" }} />
      <div style={{ position: "absolute", left: 120, top: 250, width: 460, height: 460, opacity: cl(u0 * 2), transform: `scale(${0.8 + 0.2 * u0})` }}>
        <svg width={460} height={460}>
          <circle cx={230} cy={230} r={210} fill="rgba(20,18,16,0.82)" />
          <circle cx={230} cy={230} r={190} stroke="#3a3632" strokeWidth={26} fill="none" />
          <circle cx={230} cy={230} r={190} stroke={YEL} strokeWidth={26} fill="none" strokeDasharray={`${C * prog} ${C}`} transform="rotate(-90 230 230)" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 120, color: "#fff", lineHeight: 1 }}>4–5</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 8, color: YEL }}>MINUTES</div>
        </div>
      </div>
      {no.map((n, i) => f >= at(n) ? (
        <div key={i} style={{ position: "absolute", left: 760 + i * 120, top: 200 + i * 240 }}>
          <Stamp txt={labs[i] || "don't"} u={sp(f, at(n), 9, 260)} size={110} rot={-8 + i * 7} color={i === 2 ? RED : "#E8E2D6"} />
        </div>
      ) : null)}
    </AbsoluteFill>
  );
};

// 9 · GUÍA DE TAMAÑO: dos sartenes redondas vistas desde arriba, trozos grandes (chili) y migas chicas (salsa), con su regla de pulgar.
export const SizeGuide: P<{ left: { k: string; txt: string; t: number }; right: { k: string; txt: string; t: number } }> = ({ a, d, left, right }) => {
  const { f, at } = useT(a);
  const sides = [left, right];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_block" f={f} d={d} dim={0.3} />
      {sides.map((s, i) => {
        const u = sp(f, at(s.t) - (i ? 0 : 4), 14, 140); const [big, use] = s.txt.split("·").map((x) => x.trim());
        if (f < at(s.t) - (i ? 2 : 6)) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 150 + i * 880, top: 120, width: 760, display: "flex", flexDirection: "column", alignItems: "center", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 160}px) rotate(${(1 - u) * (i ? 12 : -12)}deg)` }}>
            <Round k={s.k} r={300} f={f} rimW={28} />
            <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 22 }}>
              <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 96, color: i ? YEL : "#fff", textShadow: tsh }}>{big}</span>
              <Write txt={"→ " + use} u={wr(f, at(s.t) + 8, 14)} size={72} color={CREAM} sh={tsh} />
            </div>
            {/* regla del tamaño del trozo */}
            <div style={{ display: "flex", gap: 10, marginTop: 6, alignItems: "flex-end" }}>
              {Array.from({ length: 5 }).map((_, j) => <div key={j} style={{ width: i ? 18 : 48, height: i ? 18 : 48, borderRadius: "40%", background: `radial-gradient(circle at 40% 35%, #a2603a, ${CRUST})`, opacity: cl(u * 3 - j * 0.3) }} />)}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 10 · ORDEN DE LA SAL: tres pasos impresos como fichas sobre papel; el salero cae al final y la dosis se escribe con lápiz.
export const SaltOrder: P<{ steps: { t: number; txt: string }[]; amt: { t: number; txt: string } }> = ({ a, d, steps, amt }) => {
  const { f, at } = useT(a);
  const ua = sp(f, at(amt.t), 13, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_paper" f={f} d={d} dim={0.05} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 12, color: "#6b5f52" }}>THE ORDER</div>
      {steps.map((s, i) => {
        const u = sp(f, at(s.t), 13, 160); const salt = i === steps.length - 1;
        if (f < at(s.t) - 2) return null;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 170 + i * 560, top: 250, width: 460, height: 280, background: salt ? RED : "#FBF8F1", boxShadow: SH, borderRadius: 6,
              transform: `translateY(${(1 - u) * -500}px) rotate(${(i - 1) * 2.5}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: salt ? "#fff" : RED }}>{i + 1}</div>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 112, letterSpacing: 6, color: salt ? "#fff" : INK }}>{s.txt}</div>
            </div>
            {i < steps.length - 1 && f >= at(steps[i + 1].t) - 6 ? (
              <svg style={{ position: "absolute", left: 630 + i * 560, top: 350 }} width={100} height={80}>
                <path d="M 6 40 L 80 40 M 56 14 L 86 40 L 56 66" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={200} strokeDashoffset={200 * (1 - ez((f - at(steps[i + 1].t) + 6) / 10))} />
              </svg>
            ) : null}
          </React.Fragment>
        );
      })}
      {f >= at(amt.t) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
          {/* salero dibujado */}
          <svg width={150} height={220} style={{ transform: `translateY(${(1 - ua) * -300}px) rotate(${-14 * ua}deg)` }}>
            <rect x={25} y={60} width={100} height={150} rx={18} fill="#EDEAE3" stroke="#9a948c" strokeWidth={5} />
            <path d="M 25 70 Q 75 20 125 70 Z" fill="#B8BDC0" stroke="#7d8488" strokeWidth={5} />
            {[0, 1, 2].map((j) => <circle key={j} cx={55 + j * 20} cy={52} r={4} fill="#444" />)}
          </svg>
          <Write txt={amt.txt} u={wr(f, at(amt.t) + 6, 24)} size={104} color={PEN} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 11 · FICHA DEL BICARBONATO: tarjeta de receta sobre la tabla, cada medida con su cuchara dibujada a escala.
export const SodaCard: P<{ lines: { t: number; q: string; txt: string }[] }> = ({ a, d, lines }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, 0, 14, 120);
  const spoon = (i: number) => i === 0 ? 34 : i === 1 ? 58 : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_block" f={f} d={d} dim={0.15} />
      <div style={{ position: "absolute", left: 360, top: 150, transform: `translateY(${(1 - u0) * 800}px)` }}>
        <Card w={1200} h={760} rot={-1.5 + 0.4 * Math.sin(f / 70)}>
          <div style={{ position: "absolute", left: 120, top: 34, fontFamily: LABEL, fontWeight: 700, fontSize: 54, letterSpacing: 6, color: RED }}>THE BROWNING TRICK</div>
          {lines.map((l, i) => {
            if (f < at(l.t)) return null;
            const u = wr(f, at(l.t), 14), us = sp(f, at(l.t), 12, 170);
            return (
              <div key={i} style={{ position: "absolute", left: 120, top: 190 + i * 180, display: "flex", alignItems: "center", gap: 40 }}>
                <div style={{ width: 130, display: "flex", justifyContent: "center", transform: `scale(${us})` }}>
                  {spoon(i) ? (
                    <svg width={130} height={80}><ellipse cx={spoon(i) / 2 + 6} cy={40} rx={spoon(i) / 2} ry={spoon(i) / 2.6} fill="#C9CED1" stroke="#6f777b" strokeWidth={4} />
                      <rect x={spoon(i) + 4} y={36} width={130 - spoon(i) - 8} height={9} rx={4} fill="#9aa1a5" /></svg>
                  ) : <div style={{ width: 110, height: 80, borderRadius: 10, background: `radial-gradient(circle at 40% 35%, #d0605a, #8e2a28)`, boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }} />}
                </div>
                <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 104, color: INK, minWidth: 300, opacity: cl(u * 2) }}>{l.q}</span>
                <Write txt={l.txt} u={u} size={100} color={PEN} />
              </div>
            );
          })}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// 12 · DE AFUERA AL MEDIO (corte técnico): un bife en corte con los gérmenes sólo en la superficie; al picar, los puntos se meten adentro.
export const GrindMix: P<{ out: number; mix: number }> = ({ a, d, out, mix }) => {
  const { f, at } = useT(a);
  const uo = sp(f, at(out), 14, 120), um = ez((f - at(mix)) / 40);
  const N = 60;
  const W = 760, H = 380, X0 = 580, Y0 = 330;
  const dots = Array.from({ length: N }).map((_, i) => {
    const per = i / N; const p = per * 2 * (W + H);
    const sx = p < W ? p : p < W + H ? W : p < 2 * W + H ? 2 * W + H - p : 0;
    const sy = p < W ? 0 : p < W + H ? p - W : p < 2 * W + H ? H : 2 * (W + H) - p;
    const hx = ((i * 97) % 89) / 89 * (W - 80) + 40, hy = ((i * 53) % 61) / 61 * (H - 80) + 40;
    return { x: sx + (hx - sx) * um, y: sy + (hy - sy) * um };
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_paper" f={f} d={d} dim={0.05} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 80, letterSpacing: 6, color: INK }}>
        {f < at(mix) ? "A STEAK" : "GROUND MEAT"}
      </div>
      <div style={{ position: "absolute", left: X0, top: Y0, width: W, height: H, transform: `scale(${0.85 + 0.15 * uo})`, opacity: cl(uo * 2) }}>
        {/* cuerpo: bife → picada (textura cambia) */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(180deg,#C8433F,#93242A)", boxShadow: SH, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: um, backgroundImage: "radial-gradient(circle, rgba(255,240,225,0.6) 0 5px, transparent 6px), radial-gradient(circle, rgba(90,10,15,0.45) 0 7px, transparent 8px)",
            backgroundSize: "34px 30px, 46px 38px", backgroundPosition: "0 0, 17px 14px" }} />
          <div style={{ position: "absolute", left: 30, right: 30, top: "45%", height: 12, borderRadius: 6, background: "rgba(255,245,230,0.7)", opacity: 1 - um }} />
        </div>
        {dots.map((p, i) => <div key={i} style={{ position: "absolute", left: p.x - 11, top: p.y - 11, width: 22, height: 22, borderRadius: 11, background: "#55C26A", border: "3px solid #1e5a2a", opacity: cl(uo * 2) }} />)}
      </div>
      {/* flechas de la sartén caliente sobre la superficie */}
      {f < at(mix) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: cl(sp(f, at(out) + 40, 14, 140) * 2) }}>
          <Write txt="only on the outside → the hot pan gets them" u={wr(f, at(out) + 40, 30)} size={70} color={PEN} />
        </div>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center" }}>
          <Write txt="the outside ends up in the middle" u={wr(f, at(mix) + 30, 24)} size={76} color={RED} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// 13 · SONDA A 160: la foto del termómetro clavado; un display LCD grande cuenta hasta 160 y se enciende "SAFE".
export const Probe160: P<{ k: string; t: number; safe: number }> = ({ a, d, k, t, safe }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, at(t), 14, 140), v = Math.round(70 + 90 * eo((f - at(t)) / 40)), us = sp(f, at(safe), 10, 220);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.25} z={[1.04, 1.15]} o="35% 50%" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 40%, rgba(0,0,0,0.6))" }} />
      <div style={{ position: "absolute", right: 140, top: 220, width: 640, padding: "40px 40px 30px", borderRadius: 40, background: "linear-gradient(160deg,#E33A33,#9C1C1F)", boxShadow: SH,
        transform: `translateX(${(1 - u0) * 700}px) rotate(${3 - 3 * u0}deg)` }}>
        <div style={{ borderRadius: 18, background: "linear-gradient(180deg,#A9B79A,#8C9C7D)", padding: "16px 30px", boxShadow: "inset 0 8px 16px rgba(0,0,0,0.45)", textAlign: "right" }}>
          <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 210, color: "#1d2418", lineHeight: 1, letterSpacing: 8 }}>{v}</span>
          <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 80, color: "#1d2418" }}>°F</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: "#fff", opacity: 0.85 }}>THICKEST PART</div>
      </div>
      {f >= at(safe) ? (
        <div style={{ position: "absolute", right: 200, top: 700, transform: `scale(${us})`, display: "flex", alignItems: "center", gap: 24, background: GREEN, padding: "18px 46px", borderRadius: 60, boxShadow: SH }}>
          <Tick f={f} at={at(safe) + 4} size={70} color="#fff" box={false} />
          <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 84, color: "#fff", letterSpacing: 6 }}>THE SAFE NUMBER</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 14 · EL COLOR MIENTE: dos medias hamburguesas como fotos de expediente; la etiqueta de cada una se da vuelta y al final manda el número.
export const ColorLie: P<{ a_: { k: string; txt: string; t: number }; b_: { k: string; txt: string; t: number }; end: { t: number; txt: string } }> = ({ a, d, a_, b_, end }) => {
  const { f, at } = useT(a);
  const ue = sp(f, at(end.t), 11, 180);
  const items = [a_, b_];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_kraft" f={f} d={d} dim={0.25} />
      {items.map((s, i) => {
        const u = sp(f, at(s.t) - 6, 14, 130); const [head, tail] = s.txt.split("·").map((x) => x.trim());
        const good = i === 1;
        return (
          <div key={i} style={{ position: "absolute", left: 140 + i * 860, top: 110, opacity: cl(u * 2) * (f >= at(end.t) ? 1 - 0.55 * ue : 1), transform: `translateY(${(1 - u) * 200}px) rotate(${i ? 2 : -2}deg) scale(${f >= at(end.t) ? 1 - 0.1 * ue : 1})` }}>
            <div style={{ background: "#FBF8F1", padding: 14, boxShadow: SH, width: 760 }}>
              <div style={{ width: 732, height: 470, overflow: "hidden" }}><Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.03 * Math.sin(f / 50)})` }} /></div>
              <div style={{ padding: "16px 10px 6px", fontFamily: LABEL, fontWeight: 700, fontSize: 56, color: INK }}>{head}</div>
              <div style={{ padding: "0 10px 10px" }}><Write txt={tail} u={wr(f, at(s.t) + 12, 18)} size={66} color={good ? GREEN : RED} /></div>
            </div>
          </div>
        );
      })}
      {f >= at(end.t) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `scale(${ue}) rotate(-3deg)`, background: YEL, padding: "26px 70px", boxShadow: SH, display: "flex", alignItems: "center", gap: 36 }}>
            <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 130, color: INK, letterSpacing: 6 }}>{end.txt}</span>
            <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 130, color: RED }}>160°F</span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 15 · LO MARRÓN DEL FONDO: la sartén con los pegotes; flechas a mano señalan el sabor, entra el cuarto de taza y el giro de la cuchara.
export const FondArrows: P<{ k: string; t: number; amt: number; scrape: number }> = ({ a, d, k, t, amt, scrape }) => {
  const { f, at } = useT(a);
  const ua = sp(f, at(amt), 13, 150), uc = ez((f - at(scrape)) / 30);
  const arrows = [[300, 220, 640, 430], [1650, 250, 1250, 450], [420, 900, 760, 650]];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.15} z={[1.1, 1.02]} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {arrows.map(([x0, y0, x1, y1], i) => {
          const u = ez((f - at(t) - i * 8) / 14); const mx = (x0 + x1) / 2 + (i % 2 ? 60 : -60), my = (y0 + y1) / 2 - 70;
          return <g key={i}><path d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`} stroke={YEL} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - u)} style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.7))" }} />
            <circle cx={x1} cy={y1} r={18 * u} fill={YEL} /></g>;
        })}
        {f >= at(scrape) ? <path d="M 1160 560 m -260 0 a 260 170 0 1 0 520 0 a 260 170 0 1 0 -520 0" stroke="#fff" strokeWidth={10} fill="none" strokeDasharray={1400} strokeDashoffset={1400 * (1 - uc)} strokeLinecap="round" opacity={0.85} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 120, top: 90, fontFamily: HAND, fontWeight: 700, fontSize: 104, color: "#fff", textShadow: tsh }}>
        <Write txt="that's the flavor" u={wr(f, at(t) + 4, 20)} size={104} color="#fff" sh={tsh} />
      </div>
      {f >= at(amt) ? (
        <div style={{ position: "absolute", right: 120, bottom: 110, transform: `translateY(${(1 - ua) * 300}px)`, display: "flex", alignItems: "flex-end", gap: 20 }}>
          <svg width={180} height={200}><path d="M 20 30 L 150 30 L 135 190 L 35 190 Z" fill="rgba(230,240,250,0.45)" stroke="#fff" strokeWidth={6} />
            <path d={`M ${32} ${190 - 110 * ua} L ${143} ${190 - 110 * ua} L 135 190 L 35 190 Z`} fill="rgba(200,120,60,0.75)" />
            <path d="M 150 60 Q 185 60 185 100 Q 185 140 145 140" stroke="#fff" strokeWidth={8} fill="none" /></svg>
          <div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 130, color: YEL, lineHeight: 1, textShadow: tsh }}>¼ CUP</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: tsh }}>water, broth or sauce</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 16 · FICHA DE LA HAMBURGUESA: plano de taller sobre papel madera: el bollo, la medalla ½" más ancha (cota) y el borde suelto.
export const BurgerSpec: P<{ rows: { t: number; txt: string }[] }> = ({ a, d, rows }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, 0, 14, 120);
  const r1 = f >= at(rows[1].t);
  const uw = ez((f - at(rows[1].t)) / 16), ue = ez((f - at(rows[2].t)) / 16);
  const bun = 230, patty = bun + 40 * uw;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_kraft" f={f} d={d} dim={0.05} />
      <svg width={1000} height={1080} style={{ position: "absolute", left: 40, top: 0, opacity: cl(u0 * 2) }}>
        {/* bollo (línea punteada) */}
        <circle cx={500} cy={520} r={bun} fill="none" stroke={PEN} strokeWidth={6} strokeDasharray="18 14" opacity={0.85} />
        <text x={500} y={520 - bun - 70} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={50} fill={PEN}>the bun</text>
        {/* medalla */}
        <path d={Array.from({ length: 49 }).map((_, i) => { const A = i / 48 * 2 * Math.PI; const rr = patty + (ue * 10) * Math.sin(i * 7.3) * Math.cos(i * 2.1);
          return `${i ? "L" : "M"} ${500 + rr * Math.cos(A)} ${520 + rr * Math.sin(A)}`; }).join(" ") + " Z"}
          fill={CRUST} fillOpacity={0.85} stroke="#3a1d0e" strokeWidth={5} style={{ filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.45))" }} />
        {/* hoyuelo */}
        <circle cx={500} cy={520} r={40} fill="rgba(0,0,0,0.25)" />
        {r1 ? <g opacity={uw}>
          <line x1={500 + bun} y1={860} x2={500 + patty} y2={860} stroke={RED} strokeWidth={6} />
          <line x1={500 + bun} y1={520} x2={500 + bun} y2={880} stroke={RED} strokeWidth={3} strokeDasharray="8 8" />
          <line x1={500 + patty} y1={520} x2={500 + patty} y2={880} stroke={RED} strokeWidth={3} strokeDasharray="8 8" />
          <text x={500 + bun + 20} y={930} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={54} fill={RED}>+½"</text>
        </g> : null}
      </svg>
      <div style={{ position: "absolute", left: 1040, top: 210, width: 820 }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 50, letterSpacing: 10, color: RED, marginBottom: 30 }}>STAN'S BURGER</div>
        {rows.map((r, i) => f >= at(r.t) ? (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 46 }}>
            <Tick f={f} at={at(r.t) + 10} size={56} color={GREEN} />
            <Write txt={r.txt} u={wr(f, at(r.t), 18)} size={72} color={INK} />
          </div>
        ) : null)}
      </div>
    </AbsoluteFill>
  );
};

// 17 · EL ARO DEL AIRE: el paquete abierto; un anillo rojo marca la superficie que toca el aire, el centro oscuro se etiqueta, y la prueba de nariz.
export const AirRing: P<{ k: string; t: number; inner: number; nose: number }> = ({ a, d, k, t, inner, nose }) => {
  const { f, at } = useT(a);
  const ur = ez((f - at(t)) / 20), ui = sp(f, at(inner), 13, 150), un = sp(f, at(nose), 13, 150);
  const checks = [{ t: nose, txt: "smells fresh" }, { t: nose + 1.8, txt: "not slimy, not sticky" }, { t: nose + 3.2, txt: "it's fine" }];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.15} z={[1.04, 1.12]} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ellipse cx={820} cy={540} rx={560} ry={360} stroke="#FF4B42" strokeWidth={24} fill="none" strokeDasharray={3000} strokeDashoffset={3000 * (1 - ur)} opacity={f >= at(nose) ? 0.4 : 0.95} />
        {f >= at(inner) ? <ellipse cx={820} cy={540} rx={250 * ui} ry={160 * ui} stroke="#B48CE0" strokeWidth={10} strokeDasharray="20 16" fill="rgba(60,20,70,0.2)" opacity={f >= at(nose) ? 0.4 : 1} /> : null}
      </svg>
      {f >= at(t) ? <div style={{ position: "absolute", left: 160, top: 90, opacity: cl(ur * 2) * (f >= at(nose) ? 0.4 : 1) }}>
        <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 72, color: "#FF6A62", textShadow: tsh }}>AIR = RED</span></div> : null}
      {f >= at(inner) ? <div style={{ position: "absolute", left: 640, top: 500, opacity: cl(ui * 2) * (f >= at(nose) ? 0.4 : 1) }}>
        <Write txt="no air → darker" u={wr(f, at(inner), 16)} size={70} color="#fff" sh={tsh} /></div> : null}
      {f >= at(nose) ? (
        <div style={{ position: "absolute", right: 90, top: 250, padding: "36px 50px", background: "rgba(251,248,241,0.96)", boxShadow: SH, transform: `translateX(${(1 - un) * 700}px) rotate(2deg)` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 8, color: RED, marginBottom: 20 }}>THE REAL TEST</div>
          {checks.map((c, i) => f >= at(c.t) ? (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
              <Tick f={f} at={at(c.t) + 6} size={52} color={GREEN} />
              <Write txt={c.txt} u={wr(f, at(c.t), 14)} size={62} color={INK} />
            </div>
          ) : null)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 18 · CUENTA DE ETIQUETAS: dos stickers de precio de góndola pegados sobre acero; la diferencia se escribe con lápiz rojo.
export const StickerMath: P<{ a1: { t: number; lab: string; price: string }; a2: { t: number; lab: string; price: string }; rows: { t: number; txt: string }[] }> = ({ a, d, a1, a2, rows }) => {
  const { f, at } = useT(a);
  const S = [a1, a2];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_steel" f={f} d={d} dim={0.2} />
      {S.map((s, i) => {
        const u = sp(f, at(s.t) - 3, 11, 190); const peel = 1 - u;
        if (f < at(s.t) - 4) return null;
        const loser = i === 0 && f >= at(rows[0].t);
        return (
          <div key={i} style={{ position: "absolute", left: 220 + i * 800, top: 170, width: 640, height: 420, transform: `rotate(${i ? 3 : -4}deg) scale(${1.25 - 0.25 * u}) perspective(1200px) rotateX(${peel * 50}deg)`, opacity: cl(u * 2),
            background: i ? YEL : "#fff", borderRadius: 26, boxShadow: SH, padding: 40, boxSizing: "border-box", filter: loser ? "brightness(0.75)" : undefined }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: INK, letterSpacing: 4 }}>{s.lab}</div>
            <div style={{ borderTop: `5px solid ${INK}`, margin: "16px 0" }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 190, color: i ? RED : INK, lineHeight: 1 }}>{s.price}</span>
              <span style={{ fontFamily: LABEL, fontWeight: 500, fontSize: 56, color: INK }}>/ LB</span>
            </div>
            {loser ? <Mark kind="strike" x={30} y={190} w={360} h={120} f={f} at={at(rows[0].t)} dur={10} color={RED} sw={16} /> : null}
          </div>
        );
      })}
      {rows.map((r, i) => f >= at(r.t) ? (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center" }}>
          <Write txt={r.txt} u={wr(f, at(r.t) + 4, 28)} size={104} color="#fff" sh={tsh} />
        </div>
      ) : null)}
    </AbsoluteFill>
  );
};

// 19 · DOS TICKETS: la hamburguesa del centro con su ticket de US$18; la mesa de casa con el suyo de US$3; los tickets salen enrollados.
export const Receipts: P<{ out: { k: string; price: string; txt: string; t: number }; home: { k: string; price: string; txt: string; t: number } }> = ({ a, d, out, home }) => {
  const { f, at } = useT(a);
  const S = [out, home];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: IRON }}>
      {S.map((s, i) => {
        const u = sp(f, at(s.t) - (i ? 0 : 4), 14, 130);
        if (f < at(s.t) - (i ? 2 : 6)) return null;
        const roll = ez((f - at(s.t) - 6) / 16);
        return (
          <div key={i} style={{ position: "absolute", left: i * 960, top: 0, width: 960, height: 1080, overflow: "hidden", opacity: cl(u * 2) }}>
            <div style={{ position: "absolute", inset: 0, transform: `scale(${1.1 - 0.05 * f / Math.max(1, d)})` }}>
              <Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: i === 0 && f >= at(home.t) ? "saturate(0.4) brightness(0.7)" : undefined }} />
            </div>
            <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55), transparent 50%)" }} />
            {/* ticket */}
            <div style={{ position: "absolute", left: 250, top: 0, width: 460, height: 120 + 440 * roll, overflow: "hidden", filter: "drop-shadow(0 20px 24px rgba(0,0,0,0.55))" }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 560, background: "#FBFAF6", padding: "30px 36px", boxSizing: "border-box",
                clipPath: "polygon(0 0,100% 0,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0 97%)" }}>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: INK, textAlign: "center" }}>{i ? "HOME" : "RESTAURANT"}</div>
                <div style={{ borderTop: "3px dashed #9a948c", margin: "18px 0" }} />
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: PEN, textAlign: "center" }}>{s.txt}</div>
                <div style={{ borderTop: "3px dashed #9a948c", margin: "18px 0" }} />
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: "#6b645c", letterSpacing: 4 }}>PER BURGER</div>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 170, color: i ? GREEN : RED, lineHeight: 1 }}>{s.price}</div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 20 · CORCHO DE LA COCINA: las fichas de los 7 trucos clavadas en el corcho; las ya dichas quedan, la nueva entra girando con su chinche.
export const CorkBoard: P<{ items: { t: number; txt: string }[]; pre: number; pre_items: string[] }> = ({ a, d, items, pre, pre_items }) => {
  const { f, at } = useT(a);
  const all = [...pre_items.map((txt) => ({ txt, t: -1 })), ...items];
  const slot = (i: number) => { const r = i < 4 ? 0 : 1; const c = i < 4 ? i : i - 4; return { x: (r ? 300 : 100) + c * 440, y: 140 + r * 440 }; };
  const cols = [RED, FLAME, GREEN, YEL];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ ...texBg("t_kraft"), filter: "sepia(0.35) saturate(1.4) brightness(0.85)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, rgba(70,40,20,0.35) 0 2px, transparent 3px)", backgroundSize: "13px 11px", opacity: 0.6 }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 0 40px #6E4A2C, inset 0 0 0 46px #3e2815, inset 0 0 120px rgba(0,0,0,0.5)" }} />
      {all.map((it, i) => {
        const done = it.t < 0; const p = slot(i);
        if (!done && f < at(it.t) - 2) return null;
        const u = done ? 1 : sp(f, at(it.t), 12, 140);
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: 380, height: 340, opacity: done ? 0.75 : 1,
            transform: `translateY(${(1 - u) * -400}px) rotate(${((i * 37) % 7) - 3 + (1 - u) * 25}deg) scale(${done ? 0.94 : 1 + 0.04 * (1 - cl((f - at(it.t)) / 30))})` }}>
            <div style={{ position: "absolute", inset: 0, background: "#FBF7EC", boxShadow: "0 22px 34px rgba(0,0,0,0.5)", padding: "56px 26px 20px", boxSizing: "border-box",
              backgroundImage: "repeating-linear-gradient(180deg, transparent 0 62px, rgba(58,90,140,0.25) 62px 64px)", backgroundPosition: "0 44px" }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 56, color: cols[i % 4] === YEL ? CRUST : cols[i % 4], lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: PEN, lineHeight: 1.05, marginTop: 8, clipPath: done ? undefined : `inset(0 ${100 - 100 * wr(f, at(it.t) + 6, 16)}% 0 0)` }}>{it.txt}</div>
            </div>
            <Pin color={cols[i % 4]} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
