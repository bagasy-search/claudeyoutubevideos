// ── HÉROES de mickey2 (Mickey's Butcher Shop, video 2: el pot roast en la hornalla). Claude, 15-oct-2026.
//    Juego PROPIO de este video (no recicla los de mickey1): cada escena = textura real del oficio (pizarra, papel de carnicería,
//    taco de arce, acero) + luz + sombra proyectada + objeto real (foto) + dato + acento animado con resorte, anclado a SU palabra.
//    Tipografías: 2 familias (Oswald = rótulos/números · Caveat = tiza y mano). Paleta = el local de la foto: verde boiserie,
//    rojo del delantal, crema, kraft, cobre. Sin grano, sin viñeta, nada que tiemble.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { useT, sp, ez, eo, cl, img, LABEL, HAND, fit, camAt, camStyle, P } from "../lkit/core";

const GREEN = "#1E4637", GREEN2 = "#2E5E4A", RED = "#B3262E", CREAM = "#F4ECDD", CHALK = "#F1EEE6", KRAFT = "#C9A27A", INK = "#2A231C", COPPER = "#B8733A", OK = "#3F8A5C";
type B = { t: number; txt: string };

// ── capas base ───────────────────────────────────────────────────────────
// textura del oficio a pantalla completa: deriva lenta (parallax de fondo) + luz cenital cálida; nunca vacía
const Tex: React.FC<{ k: string; f: number; T: number; dark?: number }> = ({ k, f, T, dark = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#16120d" }}>
    <AbsoluteFill style={{ transform: `scale(${1.06 + 0.04 * f / Math.max(1, T)}) translateX(${-12 * f / Math.max(1, T)}px)`, filter: dark ? `brightness(${1 - dark})` : undefined }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,236,200,0.20), rgba(255,236,200,0) 70%)" }} />
  </AbsoluteFill>
);
// foto real impresa con borde blanco, cinta y sombra proyectada; entra con resorte
const Photo: React.FC<{ k: string; w: number; h: number; x: number; y: number; u: number; rot?: number; tape?: boolean; f: number; children?: React.ReactNode }> =
  ({ k, w, h, x, y, u, rot = -2, tape = true, f, children }) => (
    <div style={{ position: "absolute", left: x, top: y, width: w + 28, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 90}px) rotate(${rot * u + (1 - u) * rot * 3}deg) scale(${0.9 + 0.1 * u})`, transformOrigin: "50% 0" }}>
      <div style={{ background: "#FBF8F1", padding: 14, boxShadow: "0 38px 70px rgba(0,0,0,0.55), 0 8px 16px rgba(0,0,0,0.3)" }}>
        <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "#888" }}>
          <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.05 * f / 300})` }} />
          {children}
        </div>
      </div>
      {tape ? <div style={{ position: "absolute", left: "50%", top: -18, width: 150, height: 40, marginLeft: -75, background: "rgba(236,226,196,0.82)", transform: "rotate(-3deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} /> : null}
    </div>
  );
// texto que se escribe (tiza o lapicera): revelado de izquierda a derecha
const Write: React.FC<{ txt: string; u: number; size: number; color?: string; font?: string; w?: number; style?: React.CSSProperties }> = ({ txt, u, size, color = CHALK, font = HAND, w, style }) => (
  <div style={{ fontFamily: font, fontWeight: 700, fontSize: w ? Math.min(size, fit(txt, w, size, font === HAND ? "hand" : "label")) : size, color, whiteSpace: "nowrap", lineHeight: 1.05, paddingRight: "0.35em",
    clipPath: `inset(-20% ${(100 - 100 * ez(u)) * 1.06 - 6}% -20% -2%)`, textShadow: color === CHALK ? "0 0 2px rgba(255,255,255,0.35)" : undefined, ...style }}>{txt}</div>
);
// rótulo Oswald sobre papel/cinta
const Label: React.FC<{ txt: string; u: number; bg?: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ txt, u, bg = CREAM, color = INK, size = 46, rot = -2, style }) => (
  <div style={{ display: "inline-block", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 30}px) rotate(${rot}deg) scale(${0.85 + 0.15 * u})`, background: bg, color, fontFamily: LABEL, fontWeight: 700,
    fontSize: size, letterSpacing: 2, textTransform: "uppercase", padding: `${size * 0.18}px ${size * 0.45}px`, boxShadow: "0 16px 34px rgba(0,0,0,0.4)", whiteSpace: "nowrap", ...style }}>{txt}</div>
);
// tilde / cruz trazados
const Mark2: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 90, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}>
    {no ? <path d="M 10 10 L 42 42 M 42 10 L 10 42" stroke={color || RED} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
      : <path d="M 8 28 L 21 40 L 44 12" stroke={color || OK} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />}
  </svg>
);
// flecha de tiza/lapicera dibujada
const Arrow: React.FC<{ d: string; u: number; color?: string; w?: number }> = ({ d, u, color = CHALK, w = 7 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
    <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.45))" }} />
  </svg>
);
// deriva lenta y continua de todo el componente: nunca un cuadro quieto entre evento y evento (el QC del MP4 lo mide)
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${10 * Math.sin(f / 37)}px, ${6 * Math.cos(f / 51)}px) scale(${1.03 + 0.012 * Math.sin(f / 45)})` }}>{children}</AbsoluteFill>;
};
const shell = (children: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden" }}><Drift>{children}</Drift></AbsoluteFill>;

// 1 · la olla sobre la sartén: foto grande impresa sobre acero, dos rótulos a mano con flecha que llegan en su palabra
export const PotOnPan: P<{ k: string; tags: B[]; bed?: string }> = ({ a, d, k, tags, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={1000} h={562} x={120} y={200} u={sp(f, 0, 14, 120)} rot={-2} f={f} />
    {tags.map((t, i) => {
      const u = sp(f, at(t.t), 14, 140), y = 300 + i * 300;
      return <React.Fragment key={i}>
        <Arrow d={i === 0 ? `M 1400 ${y + 40} C 1300 ${y + 70} 1180 ${y + 160} 1000 ${y + 200}` : `M 1400 ${y + 40} C 1300 ${y + 40} 1150 ${y} 980 ${y - 30}`} u={cl((f - at(t.t) - 6) / 14)} color={RED} />
        <div style={{ position: "absolute", left: 1400, top: y - 10 }}><Write txt={t.txt} u={cl((f - at(t.t)) / 16)} size={86} color={CREAM} style={{ textShadow: "0 4px 18px rgba(0,0,0,0.8)" }} /></div>
        <div style={{ position: "absolute", left: 1400, top: y + 80, width: 360 * ez(u), height: 6, background: RED }} />
      </React.Fragment>;
    })}
  </>);
};

// 2 · ticket de balanza que se imprime: foto del chuck sobre papel de carnicería + tira térmica que sale línea por línea
export const ScaleTicket: P<{ k: string; lines: { t: number; l: string; r: string; big?: boolean }[]; bed?: string }> = ({ a, d, k, lines, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const shown = lines.filter((l) => f >= at(l.t) - 2).length;
  const feed = lines.reduce((acc, l, i) => acc + (i < shown ? (l.big ? 150 : 90) * ez((f - at(l.t)) / 12) : 0), 0);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={880} h={500} x={110} y={250} u={sp(f, 0, 14, 120)} rot={-3} f={f} tape={false} />
    <div style={{ position: "absolute", left: 1170, top: 120, width: 560, height: 70, background: "#3b3f43", borderRadius: "14px 14px 4px 4px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 10, height: 8, background: "#111", borderRadius: 4 }} />
    </div>
    <div style={{ position: "absolute", left: 1210, top: 182, width: 480, height: 80 + feed, overflow: "hidden", background: "#FAF8F2", boxShadow: "0 30px 50px rgba(0,0,0,0.45)" }}>
      <div style={{ padding: "26px 34px", fontFamily: LABEL, color: INK }}>
        <div style={{ fontSize: 30, letterSpacing: 6, textAlign: "center", borderBottom: "3px dashed #b9b1a3", paddingBottom: 10, marginBottom: 14 }}>MICKEY'S · DORCHESTER</div>
        {lines.map((l, i) => i < shown ? (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: l.big ? 76 : 44, fontWeight: 700, marginTop: l.big ? 26 : 8, color: l.big ? RED : INK,
            borderTop: l.big ? "3px solid #2a231c" : undefined, paddingTop: l.big ? 14 : 0 }}><span>{l.l}</span><span>{l.r}</span></div>) : null)}
      </div>
    </div>
  </>);
};

// 3 · autopsia del asado: la cámara recorre la foto de arriba (seco) a abajo (pegado); rótulos rojos con línea guía
export const Autopsy: P<{ k: string; marks: { t: number; txt: string; x: number; y: number }[] }> = ({ a, d, k, marks }) => {
  const { f, at } = useT(a);
  const cam = camAt(f, at, [{ t: a, s: 1.02, x: 960, y: 540 }, ...marks.map((m) => ({ t: m.t, s: 1.18, x: Math.min(m.x + 200, 1100), y: Math.max(460, Math.min(620, m.y)) }))], 1.2);
  return shell(<>
    <AbsoluteFill style={camStyle(cam)}>
      <div style={{ position: "absolute", width: 1920, height: 1080 }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {marks.map((m, i) => {
          const u = sp(f, at(m.t), 15, 150), lu = cl((f - at(m.t)) / 10);
          return <React.Fragment key={i}>
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
              <circle cx={m.x} cy={m.y} r={18 * u} fill={RED} stroke="#fff" strokeWidth={4} />
              <line x1={m.x} y1={m.y} x2={m.x + 330 * lu} y2={m.y} stroke="#fff" strokeWidth={5} style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))" }} />
            </svg>
            <div style={{ position: "absolute", left: m.x + 340, top: m.y - 40 }}><Label txt={m.txt} u={u} bg={RED} color="#fff" size={52} rot={0} /></div>
          </React.Fragment>;
        })}
      </div>
    </AbsoluteFill>
  </>);
};

// 4 · ver · oír · arreglar: foto de Mickey mirando la olla + tres sellos de tinta que caen en sus palabras
export const SeeHearFix: P<{ k: string; words: B[]; bed?: string }> = ({ a, d, k, words, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  const icons = ["M 6 26 C 16 10 36 10 46 26 C 36 42 16 42 6 26 Z M 26 20 A 6 6 0 1 0 26.1 20", "M 18 10 C 34 6 42 22 32 32 C 28 36 28 42 22 44 M 22 22 C 24 18 30 18 30 24", "M 12 40 L 30 22 M 30 22 C 26 12 34 4 44 8 L 36 16 L 40 20 L 48 12 C 50 22 42 30 32 26"];
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={820} h={461} x={90} y={300} u={sp(f, 0, 14, 120)} rot={-3} f={f} />
    {words.map((w, i) => {
      const u = sp(f, at(w.t), 11, 200), s = 1.6 - 0.6 * ez(u);
      return <div key={i} style={{ position: "absolute", left: 1080, top: 170 + i * 270, display: "flex", alignItems: "center", gap: 34, opacity: cl(u * 3), transform: `scale(${s}) rotate(${i % 2 ? 2 : -3}deg)`, transformOrigin: "20% 50%" }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, border: `8px solid ${RED}`, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(244,236,221,0.92)" }}>
          <svg width={90} height={90} viewBox="0 0 52 52"><path d={icons[i % 3]} stroke={RED} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 120, color: CREAM, letterSpacing: 4, textShadow: "0 8px 24px rgba(0,0,0,0.7)" }}>{w.txt}</div>
      </div>;
    })}
  </>);
};

// 5 · instantánea vieja que cae sobre el taco de arce, con su pie escrito a mano y la fecha
export const Snapshot: P<{ k: string; caption: string; date: string; t: number; bed?: string; fw?: number }> = ({ a, d, k, caption, date, t, bed = "n_tex_wood", fw = 1080 }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 16, 90);
  return shell(<>
    <Tex k={bed} f={f} T={d} dark={0.15} />
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%, -50%) translateY(${(1 - u) * -500}px) rotate(${-4 + 6 * (1 - u)}deg) scale(${1 + 0.04 * f / Math.max(1, d)})` }}>
      <div style={{ background: "#F5F0E4", padding: "30px 30px 120px", boxShadow: "0 50px 90px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.35)" }}>
        <div style={{ width: fw, height: 608, overflow: "hidden" }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        <div style={{ position: "absolute", left: 50, bottom: 26 }}><Write txt={caption} u={cl((f - at(t) - 10) / 24)} size={70} color="#2b3a5a" /></div>
        <div style={{ position: "absolute", right: 50, bottom: 36, fontFamily: LABEL, fontSize: 40, color: COPPER, letterSpacing: 4, opacity: cl((f - at(t) - 20) / 10) }}>{date}</div>
      </div>
    </div>
  </>);
};

// 6 · pizarra de truco: número de tiza grande que se escribe, título a mano, foto clavada con cinta a la derecha
export const ChalkTrick: P<{ n: number; title: string; k: string; big?: boolean; bed?: string }> = ({ a, d, n, title, k, big, bed = "n_tex_chalk" }) => {
  const { f } = useT(a);
  const sw = cl(f / 14), tw = cl((f - 10) / 22), pu = sp(f, 12, 14, 120);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 120, top: 150 }}>
      <Write txt="TRICK" u={sw} size={70} font={LABEL} style={{ letterSpacing: 18, opacity: 0.8 }} />
      <Write txt={`#${n}`} u={sw} size={big ? 330 : 280} font={LABEL} style={{ marginTop: -10, color: big ? "#F4D35E" : CHALK }} />
      <div style={{ width: 760, marginTop: 10 }}><Write txt={title} u={tw} size={96} w={760} /></div>
      <div style={{ width: 620 * ez(cl((f - 30) / 14)), height: 7, background: RED, marginTop: 18, borderRadius: 4 }} />
    </div>
    <Photo k={k} w={760} h={428} x={1020} y={300} u={pu} rot={3} f={f} />
  </>);
};

// 7 · el termostato que oscila: dial redondo con aguja que salta 300↔375 + gráfico de temperatura que se traza en papel
export const OvenSwing: P<{ k: string; on: number; off: number; again: number; off25: number; off50: number; bed?: string }> = ({ a, d, k, on, off, again, off25, off50, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  const swing = f < at(on) ? 0 : Math.sin((f - at(on)) / 11) * 32 * cl((f - at(on)) / 10);
  const ang = -30 + swing + 0; // 325 = arriba; ±32° ≈ ±50 °F
  const pts = Array.from({ length: 60 }, (_, i) => { const x = i / 59; return [80 + x * 760, 220 - 110 * Math.sin(x * 15) * (0.6 + 0.4 * Math.sin(x * 3.3))]; });
  const gu = cl((f - at(on)) / 70);
  const path = pts.slice(0, Math.max(2, Math.round(gu * 60))).map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 140, top: 190, width: 620, height: 620, borderRadius: 310, background: "radial-gradient(circle at 40% 35%, #f6f3ec, #d9d4c8)", boxShadow: "0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 18px #9aa0a5, inset 0 0 0 24px #5d6268" }}>
      {[250, 275, 300, 325, 350, 375, 400].map((v, i) => {
        const t = (-90 + (i - 3) * 32) * Math.PI / 180;
        return <div key={v} style={{ position: "absolute", left: 310 + 210 * Math.cos(t) - 50, top: 310 + 210 * Math.sin(t) - 26, width: 100, textAlign: "center", fontFamily: LABEL, fontSize: 40, fontWeight: 700, color: v === 325 ? RED : INK }}>{v}</div>;
      })}
      <div style={{ position: "absolute", left: 300, top: 90, width: 20, height: 230, background: RED, borderRadius: 10, transformOrigin: "50% 100%", transform: `rotate(${ang + 30}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", left: 280, top: 280, width: 60, height: 60, borderRadius: 30, background: "#3b3f43" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: LABEL, fontSize: 38, letterSpacing: 6, color: "#5d6268" }}>°F · YOUR OVEN</div>
    </div>
    <div style={{ position: "absolute", left: 900, top: 230, width: 920, height: 460, background: CREAM, boxShadow: "0 30px 60px rgba(0,0,0,0.45)", transform: "rotate(1.5deg)", opacity: cl((f - at(on) + 8) / 10) }}>
      <svg width={920} height={460} style={{ position: "absolute" }}>
        <line x1={80} x2={860} y1={220} y2={220} stroke="#9c8f7c" strokeWidth={3} strokeDasharray="14 10" />
        <text x={870} y={212} fontFamily={LABEL} fontSize={30} fill="#7a6e5e" textAnchor="end">325°</text>
        <path d={path} stroke={RED} strokeWidth={7} fill="none" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 40, top: 20, fontFamily: HAND, fontSize: 56, color: INK, opacity: cl((f - at(off)) / 10) }}>hot · off · hot again</div>
    </div>
    <div style={{ position: "absolute", left: 980, top: 740, display: "flex", gap: 40 }}>
      <Label txt="off by 25°" u={sp(f, at(off25), 13, 160)} bg={COPPER} color="#fff" size={58} rot={-3} />
      <Label txt="some by 50°" u={sp(f, at(off50), 13, 160)} bg={RED} color="#fff" size={58} rot={2} />
    </div>
  </>);
};

// 8 · burbuja perezosa vs hervor: dos fotos con sello verde/rojo y su consecuencia
export const BubbleVs: P<{ good: { k: string; txt: string; sub: string; t: number }; bad: { k: string; txt: string; sub: string; t: number }; bed?: string }> = ({ a, d, good, bad, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  const side = (s: typeof good, x: number, no: boolean) => {
    const u = sp(f, no ? at(s.t) : Math.min(at(s.t), 12), 14, 130), lu = cl((f - at(s.t)) / 8);
    return <div style={{ position: "absolute", left: x, top: 160, width: 800, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px) rotate(${no ? 2 : -2}deg)` }}>
      <div style={{ background: "#FBF8F1", padding: 14, boxShadow: "0 36px 70px rgba(0,0,0,0.55)" }}>
        <div style={{ height: 450, overflow: "hidden" }}><Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 10px 6px", opacity: lu }}>
          <Mark2 u={cl((f - at(s.t) - 8) / 10)} no={no} size={80} />
          <div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 56, color: no ? RED : OK, textTransform: "uppercase", letterSpacing: 2 }}>{s.txt}</div>
            <div style={{ fontFamily: HAND, fontSize: 54, color: INK, marginTop: -6 }}>{s.sub}</div>
          </div>
        </div>
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 120, top: 36 }}><Write txt="in the oven you can't see the bubble" u={cl(f / 40)} size={78} color={INK} /></div>
    {side(good, 120, false)}{side(bad, 1000, true)}</>);
};

// 9 · mapa de costuras: foto del chuck sobre papel; líneas de tiza siguen las costuras y caen rótulos de tiempo por músculo
export const SeamMap: P<{ k: string; lines: { t: number; d: string }[]; tags: { t: number; txt: string; x: number; y: number; bad?: boolean }[]; bed?: string }> = ({ a, d, k, lines, tags, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, 0, 15, 110);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 170, top: 90, width: 1580, height: 900, opacity: cl(u0 * 2), transform: `scale(${0.94 + 0.06 * u0}) rotate(-1deg)`, background: "#FBF8F1", padding: 16, boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.04 * f / Math.max(1, d)})` }} />
        <svg width={1548} height={868} viewBox="0 0 1920 1080" preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0 }}>
          {lines.map((l, i) => <path key={i} d={l.d} stroke="#fff" strokeWidth={10} strokeDasharray="1" fill="none" strokeLinecap="round" pathLength={1} strokeDashoffset={1 - eo((f - at(l.t)) / 22)} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6))" }} />)}
        </svg>
      </div>
    </div>
    {tags.map((t, i) => <div key={i} style={{ position: "absolute", left: t.x, top: t.y }}><Label txt={t.txt} u={sp(f, at(t.t), 13, 150)} bg={t.bad ? RED : GREEN} color="#fff" size={56} rot={i % 2 ? 3 : -3} /></div>)}
  </>);
};

// 10 · reloj de cocina: la aguja retrocede de 3:00 a 2:30 en la palabra; rótulo "30 min sooner"
export const Clock: P<{ k: string; from_h: number; to_h: number; t: number; txt: string; bed?: string }> = ({ a, d, k, from_h, to_h, t, txt, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  const u = ez((f - at(t)) / 24), h = from_h + (to_h - from_h) * u;
  const mAng = (h % 1) * 360, hAng = (h / 12) * 360;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={760} h={428} x={1040} y={330} u={sp(f, 0, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 170, top: 180, width: 640, height: 640, borderRadius: 320, background: "#FBF8F1", boxShadow: "0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 22px " + RED }}>
      {Array.from({ length: 12 }, (_, i) => { const r = (i * 30 - 90) * Math.PI / 180; return <div key={i} style={{ position: "absolute", left: 320 + 235 * Math.cos(r) - 30, top: 320 + 235 * Math.sin(r) - 30, width: 60, textAlign: "center", fontFamily: LABEL, fontSize: 48, fontWeight: 700, color: INK }}>{i || 12}</div>; })}
      <svg width={640} height={640} style={{ position: "absolute" }}>
        <path d={`M 320 320 L ${320 + 260 * Math.sin(Math.PI * 2 * (to_h % 1))} ${320 - 260 * Math.cos(Math.PI * 2 * (to_h % 1))} A 260 260 0 0 1 ${320 + 260 * Math.sin(Math.PI * 2 * (from_h % 1 || 1) - 0.0001)} ${320 - 260 * Math.cos(Math.PI * 2 * (from_h % 1 || 1) - 0.0001)} Z`} fill={`rgba(63,138,92,${0.35 * u})`} />
      </svg>
      <div style={{ position: "absolute", left: 312, top: 140, width: 16, height: 180, background: INK, borderRadius: 8, transformOrigin: "50% 100%", transform: `rotate(${hAng}deg)` }} />
      <div style={{ position: "absolute", left: 314, top: 70, width: 12, height: 250, background: RED, borderRadius: 6, transformOrigin: "50% 100%", transform: `rotate(${mAng}deg)` }} />
      <div style={{ position: "absolute", left: 296, top: 296, width: 48, height: 48, borderRadius: 24, background: INK }} />
    </div>
    <div style={{ position: "absolute", left: 230, top: 860 }}><Label txt={txt} u={sp(f, at(t) + 14, 13, 150)} bg={GREEN} color="#fff" size={70} rot={-2} /></div>
  </>);
};

// 11 · amontonado vs con aire: dos fotos, cruz y tilde
export const Crowd: P<{ no: { k: string; txt: string; t: number }; yes: { k: string; txt: string; t: number }; bed?: string }> = ({ a, d, no, yes, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    {[no, yes].map((s, i) => {
      const u = sp(f, at(s.t), 14, 130), x = i ? 1000 : 120;
      return <div key={i} style={{ position: "absolute", left: x, top: 200, width: 800, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px) rotate(${i ? 2 : -2}deg)` }}>
        <div style={{ background: "#FBF8F1", padding: 14, boxShadow: "0 36px 70px rgba(0,0,0,0.55)" }}>
          <div style={{ height: 450, overflow: "hidden" }}><Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        </div>
        <div style={{ position: "absolute", right: -20, top: -40 }}><Mark2 u={cl((f - at(s.t) - 8) / 10)} no={!i ? true : false} size={140} /></div>
        <div style={{ marginTop: 24, marginLeft: 20 }}><Label txt={s.txt} u={u} bg={i ? OK : RED} color="#fff" size={56} rot={i ? 1 : -1} /></div>
      </div>;
    })}
  </>);
};

// 12 · escala de color "penique viejo": la costra en foto + tira de color crudo→dorado→cobre; marcador que viaja hasta el cobre
export const PennyScale: P<{ k: string; t: number; mins: number; bed?: string }> = ({ a, d, k, t, mins, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const sw = ["#9b2d30", "#b4554a", "#b9805a", "#a8693a", "#8a5128"], lab = ["raw", "grey-pink", "tan", "old penny", "too far"];
  const pos = ez((f - at(t)) / 26) * 3;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={880} h={495} x={110} y={140} u={sp(f, 0, 14, 120)} rot={-2} f={f} />
    <div style={{ position: "absolute", left: 1090, top: 170, opacity: cl(f / 12) }}>
      <Label txt="4 min a side" u={sp(f, at(mins) < 0 ? 4 : at(mins), 13, 150)} bg={INK} color={CREAM} size={60} rot={-2} />
    </div>
    <div style={{ position: "absolute", left: 1090, top: 360, width: 700 }}>
      <div style={{ display: "flex", boxShadow: "0 24px 50px rgba(0,0,0,0.45)" }}>
        {sw.map((c, i) => <div key={i} style={{ flex: 1, height: 170, background: c, opacity: cl((f - 6 - i * 4) / 8) }} />)}
      </div>
      <div style={{ display: "flex", marginTop: 12 }}>{lab.map((l, i) => <div key={i} style={{ flex: 1, fontFamily: HAND, fontSize: 40, color: INK, textAlign: "center", fontWeight: 700 }}>{l}</div>)}</div>
      <div style={{ position: "absolute", left: 70 + pos * 140 - 30, top: -60, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: `50px solid ${INK}`, opacity: cl((f - at(t) + 10) / 8) }} />
      <div style={{ position: "absolute", left: 3 * 140 - 10, top: -16, width: 160, height: 202, border: `7px solid ${INK}`, borderRadius: 6, opacity: cl((f - at(t) - 26) / 8) }} />
    </div>
  </>);
};

// 13 · "fond": zoom al fondo de la olla con etiqueta colgante que cambia NOT BURNT → FLAVOR
export const FondTag: P<{ k: string; word: number; not_: number; taste: number }> = ({ a, d, k, word, not_, taste }) => {
  const { f, at } = useT(a);
  const cam0 = camAt(f, at, [{ t: a, s: 1.02, x: 960, y: 540 }, { t: word, s: 1.22, x: 900, y: 600 }], 1.4);
  const cam = { ...cam0, s: cam0.s * (1 + 0.06 * f / Math.max(1, d)), x: cam0.x - 40 * f / Math.max(1, d) }; // deriva continua: nunca un cuadro quieto
  const u = sp(f, at(word), 12, 120), sw = f >= at(taste);
  return shell(<>
    <AbsoluteFill style={camStyle(cam)}><Img src={img(k)} style={{ width: 1920, height: 1080, objectFit: "cover" }} /></AbsoluteFill>
    <div style={{ position: "absolute", left: 1320, top: -10, transformOrigin: "50% 0", transform: `rotate(${(1 - u) * 18 + Math.sin(f / 16) * 1.2}deg)`, opacity: cl(u * 2) }}>
      <div style={{ width: 4, height: 150, background: "#d8cdb6", margin: "0 auto" }} />
      <div style={{ width: 460, background: CREAM, borderRadius: 18, padding: "26px 30px", boxShadow: "0 36px 70px rgba(0,0,0,0.6)", textAlign: "center", border: "3px solid #cbbd9c" }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: "#2a2018", margin: "0 auto 14px" }} />
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 120, color: INK, letterSpacing: 6, lineHeight: 1 }}>FOND</div>
        <div style={{ position: "relative", height: 80, marginTop: 10 }}>
          <div style={{ position: "absolute", inset: 0, fontFamily: HAND, fontSize: 64, color: RED, opacity: sw ? 0 : cl((f - at(not_)) / 8) }}>not burnt</div>
          <div style={{ position: "absolute", inset: 0, fontFamily: HAND, fontSize: 64, color: OK, opacity: sw ? cl((f - at(taste)) / 8) : 0 }}>= all the flavor</div>
        </div>
      </div>
    </div>
  </>);
};

// 14 · EL HÉROE: corte de la hornalla en tiza. Sin sartén: un anillo de calor rojo en el centro; entra la sartén y el calor se reparte parejo
export const HeatSpread: P<{ ring: number; hot: number; pan: number; flat: number; nohot: number; bed?: string }> = ({ a, d, ring, hot, pan, flat, nohot, bed = "n_tex_chalk" }) => {
  const { f, at } = useT(a);
  const pu = sp(f, at(pan), 15, 110), fu = ez((f - at(flat)) / 30), hu = ez((f - at(hot)) / 16);
  const flame = (cx: number, y: number, k: number) => Array.from({ length: 7 }, (_, i) => {
    const x = cx - 150 + i * 50, hgt = 46 + 10 * Math.sin(f / 5 + i * 1.7);
    return <path key={i} d={`M ${x - 14} ${y} Q ${x} ${y - hgt} ${x + 14} ${y} Z`} fill="#6fa8ff" opacity={0.85 * k} />;
  });
  const heatBar = (x: number, y: number, w: number, spread: number) => {
    const cells = 24;
    return <div style={{ position: "absolute", left: x, top: y, width: w, height: 34, display: "flex", borderRadius: 6, overflow: "hidden", boxShadow: "0 6px 14px rgba(0,0,0,0.4)" }}>
      {Array.from({ length: cells }, (_, i) => {
        const c = Math.abs(i - (cells - 1) / 2) / ((cells - 1) / 2);
        const focus = Math.max(0, 1 - c * 2.6), even = 0.62;
        const v = (focus * hu) * (1 - spread) + even * spread;
        return <div key={i} style={{ flex: 1, background: `rgb(${Math.round(90 + 165 * v)}, ${Math.round(70 + 90 * v * (1 - v))}, ${Math.round(60 - 30 * v)})` }} />;
      })}
    </div>;
  };
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 120, top: 80, fontFamily: HAND, fontSize: 84, color: CHALK, opacity: cl(f / 12) }}>
      {f < at(pan) ? "pot right on the burner" : "the old Boston way"}
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {/* olla */}
      <path d="M 610 300 L 610 640 Q 610 680 650 680 L 1270 680 Q 1310 680 1310 640 L 1310 300" stroke={CHALK} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(f / 20)} />
      <path d="M 580 300 L 1340 300" stroke={CHALK} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - 8) / 14)} />
      {/* líquido */}
      <path d={`M 618 ${520 + Math.sin(f / 9) * 3} Q 960 ${510 - Math.sin(f / 9) * 3} 1302 ${520 + Math.sin(f / 9) * 3} L 1302 672 L 618 672 Z`} fill="rgba(160,100,60,0.45)" opacity={cl((f - 14) / 10)} />
      {/* hornalla */}
      <rect x={720} y={880} width={480} height={22} rx={6} fill="none" stroke={CHALK} strokeWidth={7} opacity={cl((f - 10) / 10)} />
      {/* sartén que entra desde la izquierda */}
      <g transform={`translate(${(1 - pu) * -900}, 0)`} opacity={cl(pu * 2)}>
        <rect x={560} y={700} width={800} height={60} rx={14} fill="#2b2b2b" stroke={CHALK} strokeWidth={7} />
        <path d="M 1360 730 L 1620 730" stroke={CHALK} strokeWidth={22} strokeLinecap="round" />
      </g>
      {flame(960, 870, cl((f - at(ring)) / 10))}
    </svg>
    {/* barra de calor bajo la olla: concentrada (rojo en el centro) → pareja cuando entra la sartén */}
    {heatBar(620, 640 - 0, 680, fu)}
    <div style={{ position: "absolute", left: 1380, top: 380, width: 480 }}>
      <Label txt="hot ring = burnt" u={sp(f, at(hot), 13, 150)} bg={RED} color="#fff" size={48} rot={-2} />
      <div style={{ height: 30 }} />
      <Label txt="spread out flat" u={sp(f, at(flat), 13, 150)} bg={COPPER} color="#fff" size={52} rot={2} />
      <div style={{ height: 30 }} />
      <Label txt="no hot spot" u={sp(f, at(nohot), 13, 150)} bg={OK} color="#fff" size={60} rot={-1} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 700, opacity: cl((f - at(pan)) / 10) }}>
      <Write txt="old cast iron pan" u={cl((f - at(pan) - 4) / 18)} size={64} />
    </div>
  </>);
};

// 15 · la perilla: tacha "medium low" y gira hasta LOWEST
export const Knob: P<{ k: string; no: number; yes: number; bed?: string }> = ({ a, d, k, no, yes, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  const ang = -120 + 60 * ez((f - at(no) + 10) / 16) - 80 * ez((f - at(yes)) / 22) + 120;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={720} h={405} x={1060} y={340} u={sp(f, 0, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 210, top: 210, width: 560, height: 560, borderRadius: 280, background: "radial-gradient(circle at 40% 35%, #fbfbf8, #d3d0c8)", boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }}>
      {["OFF", "LOWEST", "LOW", "MED-LOW", "MED", "HIGH"].map((l, i) => {
        const r = (-90 + 40 + i * 42) * Math.PI / 180;
        return <div key={l} style={{ position: "absolute", left: 280 + 225 * Math.cos(r) - 80, top: 280 + 225 * Math.sin(r) - 20, width: 160, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: l === "LOWEST" ? OK : "#6a6660" }}>{l}</div>;
      })}
      <div style={{ position: "absolute", left: 160, top: 160, width: 240, height: 240, borderRadius: 120, background: "#2f3236", transform: `rotate(${ang}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 108, top: 10, width: 24, height: 100, background: "#f1efe9", borderRadius: 12 }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 220, top: 820, display: "flex", gap: 40, alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        <Label txt="medium low" u={sp(f, at(no), 13, 150)} bg={CREAM} size={50} rot={-2} />
        <div style={{ position: "absolute", left: -10, top: 36, height: 8, width: 360 * ez((f - at(no) - 8) / 10), background: RED, transform: "rotate(-4deg)" }} />
      </div>
      <Label txt="the LOWEST" u={sp(f, at(yes), 13, 150)} bg={OK} color="#fff" size={64} rot={2} />
    </div>
  </>);
};

// 16 · nivel de líquido: regla de acero junto a la olla, marca 1/3 que se pinta y "not more"
export const Level: P<{ k: string; t: number; no: number }> = ({ a, d, k, t, no }) => {
  const { f, at } = useT(a);
  const lu = ez((f - at(t)) / 18);
  return shell(<>
    <AbsoluteFill style={{ transform: `scale(${1.03 + 0.05 * f / Math.max(1, d)})` }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    <div style={{ position: "absolute", left: 1500, top: 180, width: 110, height: 720, background: "linear-gradient(90deg,#c9cdd1,#eef0f2 45%,#a9aeb3)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", borderRadius: 6, opacity: cl(f / 10) }}>
      {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 30 + i * 55, width: i % 3 === 0 ? 60 : 34, height: 4, background: "#3b3f43" }} />)}
      <div style={{ position: "absolute", left: -12, right: -12, bottom: 0, height: 240 * lu, background: "rgba(150,90,50,0.55)", borderTop: `6px solid ${COPPER}` }} />
    </div>
    <div style={{ position: "absolute", left: 1180, top: 560 }}><Label txt="⅓ of the way up" u={sp(f, at(t), 13, 150)} bg={COPPER} color="#fff" size={60} rot={-2} /></div>
    <div style={{ position: "absolute", left: 1240, top: 300 }}><Label txt="not more" u={sp(f, at(no), 13, 150)} bg={RED} color="#fff" size={56} rot={3} /></div>
  </>);
};

// 17 · la tapa de papel en 4 pasos: 4 instantáneas que caen en fila sobre el taco, numeradas, con su verbo a mano
export const PaperSteps: P<{ steps: { k: string; txt: string; t: number }[]; bed?: string }> = ({ a, d, steps, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 110, top: 80, fontFamily: HAND, fontSize: 80, color: CREAM, textShadow: "0 4px 16px rgba(0,0,0,0.7)", opacity: cl(f / 12) }}>the paper lid</div>
    {steps.map((s, i) => {
      const u = sp(f, at(s.t), 15, 130), x = 90 + i * 445, rot = [-4, 2, -2, 4][i % 4];
      return <div key={i} style={{ position: "absolute", left: x, top: 260 + (i % 2) * 50, width: 410, opacity: cl(u * 2), transform: `translateY(${(1 - u) * -260}px) rotate(${rot}deg)` }}>
        <div style={{ background: "#FBF8F1", padding: "14px 14px 80px", boxShadow: "0 36px 60px rgba(0,0,0,0.55)" }}>
          <div style={{ height: 380, overflow: "hidden" }}><Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div style={{ position: "absolute", left: 24, bottom: 14, display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 54, color: RED }}>{i + 1}</span>
            <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: INK }}>{s.txt}</span>
          </div>
        </div>
      </div>;
    })}
  </>);
};

// 18 · el sonido: tira de papel con onda que se dibuja. Tic-tic parejo (verde) → traqueteo (rojo) → "turn it down"
export const Sound: P<{ tick: number; rattle: number; down: number; bed?: string }> = ({ a, d, tick, rattle, down, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const N = 90, W = 1600;
  const prog = cl((f - at(tick) + 4) / Math.max(10, at(down) - at(tick) + 20));
  const bars = Array.from({ length: N }, (_, i) => {
    const tt = i / (N - 1), isR = f >= at(rattle) && tt > (at(rattle) - at(tick)) / Math.max(1, at(down) - at(tick) + 20);
    const hh = isR ? 60 + 120 * Math.abs(Math.sin(i * 1.9 + f / 3)) : (i % 6 === 0 ? 90 : 8);
    return { hh, isR, on: tt <= prog };
  });
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 160, top: 300, width: W, height: 380, background: CREAM, boxShadow: "0 30px 60px rgba(0,0,0,0.45)", transform: "rotate(-1deg)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 189, height: 2, background: "#cdbfa5" }} />
      {bars.map((b, i) => b.on ? <div key={i} style={{ position: "absolute", left: 20 + i * (W - 40) / N, top: 190 - b.hh / 2, width: 8, height: b.hh, borderRadius: 4, background: b.isR ? RED : OK }} /> : null)}
    </div>
    <div style={{ position: "absolute", left: 200, top: 160 }}><Write txt="tick . . . tick . . . tick" u={cl((f - at(tick)) / 30)} size={88} color={OK} font={HAND} style={{ textShadow: "0 3px 10px rgba(255,255,255,0.6)" }} /></div>
    <div style={{ position: "absolute", left: 1050, top: 720 }}><Label txt="rattle = boiling" u={sp(f, at(rattle), 12, 170)} bg={RED} color="#fff" size={62} rot={2} /></div>
    <div style={{ position: "absolute", left: 240, top: 760 }}><Label txt="turn it down. now." u={sp(f, at(down), 12, 170)} bg={INK} color={CREAM} size={62} rot={-2} /></div>
  </>);
};

// 19 · cada 45 minutos: anillo de temporizador que se llena + flecha circular de "dar vuelta" sobre la foto
export const Turn45: P<{ k: string; t: number; flip: number; bed?: string }> = ({ a, d, k, t, flip, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  const u = ez((f - at(t)) / 40), R = 230, C2 = 2 * Math.PI * R;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={900} h={506} x={900} y={260} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    <svg width={600} height={600} style={{ position: "absolute", left: 180, top: 220, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}>
      <circle cx={300} cy={300} r={280} fill={CREAM} />
      <circle cx={300} cy={300} r={R} fill="none" stroke="#e1d6c0" strokeWidth={48} />
      <circle cx={300} cy={300} r={R} fill="none" stroke={RED} strokeWidth={48} strokeDasharray={`${C2 * 0.75 * u} ${C2}`} transform="rotate(-90 300 300)" />
      <text x={300} y={320} fontFamily={LABEL} fontWeight={700} fontSize={150} fill={INK} textAnchor="middle">{Math.round(45 * u)}</text>
      <text x={300} y={400} fontFamily={LABEL} fontSize={44} letterSpacing={8} fill="#7a6e5e" textAnchor="middle">MINUTES</text>
    </svg>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M 1250 230 A 140 70 0 1 1 1500 250" stroke={CREAM} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - at(flip)) / 18)} style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.6))" }} />
      <path d="M 1478 222 L 1505 255 L 1465 268" stroke={CREAM} strokeWidth={12} fill="none" strokeLinecap="round" opacity={cl((f - at(flip) - 16) / 6)} />
    </svg>
    <div style={{ position: "absolute", left: 1180, top: 840 }}><Label txt="turn the pieces" u={sp(f, at(flip), 13, 150)} bg={GREEN} color="#fff" size={60} rot={-2} /></div>
  </>);
};

// 20 · agua caliente sí, fría no
export const HotCold: P<{ hot: { k: string; t: number }; cold: { k: string; t: number }; bed?: string }> = ({ a, d, hot, cold, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  const it = (s: { k: string; t: number }, i: number) => {
    const u = sp(f, at(s.t), 14, 130), x = i ? 1010 : 130;
    return <div key={i} style={{ position: "absolute", left: x, top: 190, width: 780, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px) rotate(${i ? 2 : -2}deg)` }}>
      <div style={{ background: "#FBF8F1", padding: 14, boxShadow: "0 36px 70px rgba(0,0,0,0.55)" }}><div style={{ height: 440, overflow: "hidden" }}><Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div></div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 26, marginLeft: 20 }}>
        <Mark2 u={cl((f - at(s.t) - 6) / 10)} no={!!i} size={90} />
        <Label txt={i ? "cold = it seizes up" : "hot, from the kettle"} u={u} bg={i ? "#3d6fa8" : RED} color="#fff" size={54} rot={0} />
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{it(hot, 0)}{it(cold, 1)}</>);
};

// 21 · la prueba de los dos tenedores
export const ForkTest: P<{ no: { k: string; txt: string; sub: string; t: number }; yes: { k: string; txt: string; sub: string; t: number }; bed?: string }> = ({ a, d, no, yes, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  const it = (s: typeof no, i: number) => {
    const u = sp(f, at(s.t), 14, 130), x = i ? 1000 : 120;
    return <div key={i} style={{ position: "absolute", left: x, top: 150, width: 800, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px) rotate(${i ? 2 : -2}deg)` }}>
      <div style={{ background: "#FBF8F1", padding: 14, boxShadow: "0 36px 70px rgba(0,0,0,0.55)" }}><div style={{ height: 450, overflow: "hidden" }}><Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div></div>
      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 18 }}>
        <Mark2 u={cl((f - at(s.t) - 6) / 10)} no={!i} size={84} />
        <div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: CREAM, textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>{s.txt}</div>
          <Label txt={s.sub} u={sp(f, at(s.t) + 10, 13, 150)} bg={i ? OK : RED} color="#fff" size={44} rot={0} /></div>
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{it(no, 0)}{it(yes, 1)}</>);
};

// 22 · línea de tiempo en papel kraft: 0 → 3 h, la franja de los últimos 50 min se pinta y cae la foto de las verduras
export const Timeline: P<{ k: string; total: number; at: number; t: number; txt: string; bed?: string }> = ({ a, d, k, total, at: when, t, txt, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const L0 = 180, W = 1560, xw = L0 + W * when / total, u = ez((f - at(t)) / 22);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={640} h={360} x={xw - 340} y={150} u={sp(f, at(t) + 8, 14, 120)} rot={-2} f={f} />
    <div style={{ position: "absolute", left: L0, top: 690, width: W, height: 26, background: INK, borderRadius: 13, opacity: cl(f / 10) }} />
    <div style={{ position: "absolute", left: xw, top: 676, width: (L0 + W - xw) * u, height: 54, background: COPPER, borderRadius: 10, boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }} />
    {Array.from({ length: total * 2 + 1 }, (_, i) => <div key={i} style={{ position: "absolute", left: L0 + (W * i) / (total * 2) - 60, top: 750, width: 120, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: INK, opacity: cl(f / 10) }}>{i % 2 ? `${(i / 2).toFixed(1)}h` : `${i / 2}h`}</div>)}
    <div style={{ position: "absolute", left: Math.min(xw - 40, 820), top: 820 }}><Label txt={`last 50 min · ${txt}`} u={sp(f, at(t), 13, 150)} bg={GREEN} color="#fff" size={52} rot={-1} /></div>
  </>);
};

// 23 · ficha de receta del fichero viejo: renglones azules, margen rojo, cada paso se escribe en su palabra
export const RecipeCard: P<{ head: string; lines: B[]; bed?: string }> = ({ a, d, head, lines, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 16, 100);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 960, top: 540, width: 1300, height: 820, transform: `translate(-50%,-50%) translateY(${(1 - u) * 300}px) rotate(${-2 + (1 - u) * 6}deg)`, background: "#FBF7EC",
      backgroundImage: "repeating-linear-gradient(0deg, transparent 0 98px, #9fc0de 98px 101px)", boxShadow: "0 50px 90px rgba(0,0,0,0.55)", opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 3, background: "#e08a8a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 4, background: "#d35d5d" }} />
      <div style={{ position: "absolute", left: 170, top: 40, fontFamily: HAND, fontWeight: 700, fontSize: 92, color: "#1d2c4f" }}>{head}</div>
      {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 170, top: 185 + i * 101 }}>
        <Write txt={`${i + 1}.  ${l.txt}`} u={cl((f - at(l.t)) / 20)} size={74} color="#1d2c4f" />
      </div>)}
    </div>
  </>);
};

// 24 · ticket de balanza "problema → arreglo": la foto del problema a la izquierda; a la derecha el ticket se imprime
export const FixTicket: P<{ k: string; n: number; prob: string; fix: string; t: number }> = ({ a, d, k, n, prob, fix, t }) => {
  const { f, at } = useT(a);
  const pu = ez(f / 14), fu = ez((f - at(t)) / 14);
  return shell(<>
    <AbsoluteFill style={{ transform: `scale(${1.04 + 0.05 * f / Math.max(1, d)})` }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(14,10,6,0.62) 0%, rgba(14,10,6,0) 55%)" }} />
    <div style={{ position: "absolute", left: 1180, top: 0, width: 560, height: 130 + 230 * pu + 200 * fu, overflow: "hidden", background: "#FAF8F2", boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
      <div style={{ padding: "40px 40px", fontFamily: LABEL, color: INK }}>
        <div style={{ fontSize: 32, letterSpacing: 8, borderBottom: "3px dashed #b9b1a3", paddingBottom: 12 }}>IF IT WENT WRONG · #{n}</div>
        <div style={{ fontSize: 30, letterSpacing: 4, color: "#8a8174", marginTop: 26 }}>PROBLEM</div>
        <div style={{ fontSize: 64, fontWeight: 700, color: RED, lineHeight: 1.05, marginTop: 4 }}>{prob}</div>
        <div style={{ fontSize: 30, letterSpacing: 4, color: "#8a8174", marginTop: 34 }}>FIX</div>
        <div style={{ fontSize: 58, fontWeight: 700, color: OK, lineHeight: 1.05, marginTop: 4 }}>{fix}</div>
      </div>
    </div>
  </>);
};

// 25 · pizarra de menú de restaurante: "POT ROAST ......... $28-38" se escribe a tiza y la foto del plato al costado
export const MenuPrice: P<{ k: string; t: number; txt: string; price: string; sub: string; bed?: string }> = ({ a, d, k, t, txt, price, sub, bed = "n_tex_chalk" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={720} h={405} x={1060} y={150} u={sp(f, 0, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 140, top: 160 }}><Write txt="DOWNTOWN" u={cl(f / 16)} size={60} font={LABEL} style={{ letterSpacing: 16, opacity: 0.75 }} /></div>
    <div style={{ position: "absolute", left: 140, top: 640, display: "flex", alignItems: "baseline", gap: 30 }}>
      <Write txt={txt} u={cl((f - 6) / 20)} size={110} font={LABEL} />
      <Write txt="· · · · · ·" u={cl((f - 18) / 14)} size={90} />
      <Write txt={price} u={cl((f - at(t)) / 18)} size={150} font={LABEL} style={{ color: "#F4D35E" }} />
    </div>
    <div style={{ position: "absolute", left: 1000, top: 860 }}><Write txt={sub} u={cl((f - at(t) - 16) / 16)} size={76} /></div>
  </>);
};

// 26 · ticket de caja: renglones que se imprimen, total, y el sello rojo "under $4 a plate"
export const Receipt: P<{ k: string; rows: { t: number; txt: string; amt: string }[]; total: { t: number; amt: string }; per: { t: number; txt: string; amt: string }; bed?: string }> = ({ a, d, k, rows, total, per, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const n = rows.filter((r) => f >= at(r.t) - 2).length + (f >= at(total.t) ? 1 : 0);
  const su = sp(f, at(per.t), 10, 220);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={800} h={450} x={100} y={300} u={sp(f, 0, 14, 120)} rot={-3} f={f} />
    <div style={{ position: "absolute", left: 1060, top: 0, width: 700, height: 220 + n * 110, overflow: "hidden", background: "#FAF8F2", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", transition: "none" }}>
      <div style={{ padding: "60px 46px 30px", fontFamily: LABEL, color: INK }}>
        <div style={{ fontSize: 34, letterSpacing: 8, textAlign: "center", borderBottom: "3px dashed #b9b1a3", paddingBottom: 12 }}>SUNDAY POT ROAST</div>
        {rows.map((r, i) => f >= at(r.t) - 2 ? <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 50, marginTop: 30 }}><span>{r.txt}</span><span>{r.amt}</span></div> : null)}
        {f >= at(total.t) ? <div style={{ display: "flex", justifyContent: "space-between", fontSize: 76, fontWeight: 700, marginTop: 30, borderTop: "4px solid #2a231c", paddingTop: 14 }}><span>TOTAL</span><span>{total.amt}</span></div> : null}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1150, top: 760, opacity: cl(su * 3), transform: `scale(${1.8 - 0.8 * ez(su)}) rotate(-8deg)` }}>
      <div style={{ border: `9px solid ${RED}`, color: RED, fontFamily: LABEL, fontWeight: 700, fontSize: 84, padding: "6px 30px", letterSpacing: 4, background: "rgba(250,248,242,0.85)" }}>{per.amt} A PLATE</div>
      <div style={{ fontFamily: HAND, fontSize: 56, color: INK, textAlign: "center", marginTop: 6 }}>{per.txt}</div>
    </div>
  </>);
};

// 27 · gas: el horno entero contra la hornalla chica — dos fotos con barras de llama que suben
export const GasBars: P<{ oven: { k: string; t: number }; burner: { k: string; t: number }; bed?: string }> = ({ a, d, oven, burner, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  const bar = (s: { k: string; t: number }, i: number, h: number, col: string, txt: string) => {
    const u = sp(f, at(s.t), 14, 130), hu = ez((f - at(s.t) - 8) / 30);
    return <div key={i} style={{ position: "absolute", left: i ? 1000 : 160, top: 140, width: 760, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px)` }}>
      <div style={{ background: "#FBF8F1", padding: 12, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", transform: `rotate(${i ? 2 : -2}deg)` }}><div style={{ height: 400, overflow: "hidden" }}><Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div></div>
      <div style={{ position: "relative", height: 330, marginTop: 30 }}>
        <div style={{ position: "absolute", left: 40, bottom: 60, width: 160, height: h * hu, background: col, borderRadius: "10px 10px 0 0", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 240, bottom: 70, fontFamily: LABEL, fontWeight: 700, fontSize: 58, color: CREAM, textShadow: "0 3px 10px rgba(0,0,0,0.7)", opacity: cl(hu * 2) }}>{txt}</div>
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{bar(oven, 0, 260, RED, "whole oven · 3 h")}{bar(burner, 1, 60, OK, "one small flame")}</>);
};

// 28 · pizarra de menú: la lista de los 8 trucos se escribe renglón por renglón
export const ChalkList: P<{ head: string; items: B[]; start?: number; bed?: string }> = ({ a, d, head, items, bed = "n_tex_chalk" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 170, top: 110 }}>
      <Write txt={head} u={cl(f / 18)} size={84} font={LABEL} style={{ letterSpacing: 8 }} />
      <div style={{ width: 900 * ez(cl((f - 10) / 14)), height: 6, background: RED, marginTop: 10, borderRadius: 3 }} />
    </div>
    {items.map((it, i) => <div key={i} style={{ position: "absolute", left: 190, top: 300 + i * 160 }}><Write txt={it.txt} u={cl((f - at(it.t)) / 20)} size={104} w={1560} /></div>)}
  </>);
};

// 29 · tarjeta de comentario: pregunta de Mickey en un papel de envolver + la foto de la sartén vieja
export const CommentCard: P<{ k: string; q: string; t: number; sub: number; sub_txt: string; bed?: string }> = ({ a, d, k, q, t, sub, sub_txt, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t) - 6, 14, 120);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={640} h={360} x={1150} y={140} u={sp(f, 0, 14, 120)} rot={4} f={f} />
    <div style={{ position: "absolute", left: 130, top: 300, width: 1000, background: "#fff", borderRadius: 26, padding: "40px 50px", boxShadow: "0 36px 70px rgba(0,0,0,0.45)", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: RED, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>M</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, color: "#555" }}>Mickey's Butcher Shop · asks</div>
      </div>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 72, color: INK, marginTop: 24, lineHeight: 1.1 }}>{q}</div>
      <div style={{ fontFamily: HAND, fontSize: 64, color: RED, marginTop: 14, opacity: cl((f - at(sub)) / 10) }}>{sub_txt}</div>
    </div>
  </>);
};

// 30 · avance "coming up": esquina de pizarra con el número del truco y la foto que se asoma
export const Teaser: P<{ k: string; n: number; txt: string; t: number; bed?: string }> = ({ a, d, k, n, txt, t, bed = "n_tex_chalk" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={980} h={551} x={820} y={240} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    <div style={{ position: "absolute", left: 130, top: 220 }}>
      <Label txt="coming up" u={sp(f, 2, 13, 150)} bg={RED} color="#fff" size={50} rot={-3} />
      <div style={{ marginTop: 30 }}><Write txt={`TRICK #${n}`} u={cl((f - 6) / 16)} size={150} font={LABEL} style={{ color: "#F4D35E" }} /></div>
      <div style={{ width: 640, marginTop: 10 }}><Write txt={txt} u={cl((f - at(t)) / 20)} size={84} w={640} /></div>
    </div>
  </>);
};
