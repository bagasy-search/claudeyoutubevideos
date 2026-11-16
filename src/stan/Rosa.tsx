// Kit "Rosa" (Abuela Rosa: Sabores de Antes, ros14): azulejo de talavera azul y blanco, ficha de receta escrita a mano,
// papel de estraza del mercado, barro, mantel bordado. PURO CSS y DOM: sin SVG, sin blur, sin backdrop-filter. Las fotos van enteras.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL, useOut } from "./Kit";

const { SERIF, SANS, HAND } = FONTS;
export const R = { azul: "#1F3F8F", azul2: "#2F5BB7", cal: "#F7F2E6", crema: "#FBF6EA", barro: "#B5562F", barro2: "#8A3B1E", estraza: "#C9A37A", estraza2: "#B88E63", ink: "#2A211B", pen: "#24418A", ok: "#3F8A4A", no: "#C0392B", oro: "#E9B949" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 14) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.8 } });
const tsh = "0 3px 14px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.8)";
// azulejo de talavera hecho con gradientes (flor central + esquinas)
export const azulejo = (size = 120) => ({
  background: `radial-gradient(circle at 50% 50%, ${R.azul} 0 ${size * 0.09}px, transparent ${size * 0.1}px), radial-gradient(circle at 50% 50%, transparent 0 ${size * 0.17}px, ${R.azul2} ${size * 0.18}px ${size * 0.22}px, transparent ${size * 0.23}px), radial-gradient(circle at 0 0, ${R.azul} 0 ${size * 0.16}px, transparent ${size * 0.17}px), radial-gradient(circle at 100% 0, ${R.azul} 0 ${size * 0.16}px, transparent ${size * 0.17}px), radial-gradient(circle at 0 100%, ${R.azul} 0 ${size * 0.16}px, transparent ${size * 0.17}px), radial-gradient(circle at 100% 100%, ${R.azul} 0 ${size * 0.16}px, transparent ${size * 0.17}px), linear-gradient(${R.cal}, #EFE8D6)`,
  backgroundSize: `${size}px ${size}px`,
});
const estraza = { background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12) 0 1px, transparent 2px) 0 0 / 9px 11px, radial-gradient(circle at 70% 60%, rgba(90,60,30,0.12) 0 1px, transparent 2px) 0 0 / 13px 7px, linear-gradient(170deg, ${R.estraza}, ${R.estraza2})` };
const ficha = { background: `linear-gradient(180deg, transparent 0 86px, rgba(192,57,43,0.55) 86px 88px, transparent 88px) 0 0 / 100% 100% no-repeat, repeating-linear-gradient(180deg, transparent 0 51px, rgba(47,91,183,0.28) 51px 53px), ${R.crema}` };
const Base: React.FC<{ bg?: string; dur: number; seed?: number; dim?: number }> = ({ bg, dur, seed = 3, dim = 0.5 }) => (
  <AbsoluteFill>
    {bg ? <Photo src={bg} seed={seed} dur={dur} /> : <AbsoluteFill style={azulejo(160)} />}
    <AbsoluteFill style={{ background: `rgba(20,14,10,${dim})` }} />
  </AbsoluteFill>
);
const Big: React.FC<{ txt: string; f0?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ txt, f0 = 0, size = 86, color = "#FBF6EA", style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 15);
  return <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1.08, color, textShadow: tsh, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, ...style }}>{txt}</div>;
};
// una baldosa de talavera con número o letra, que entra girando como si la pusieran en la pared
const Baldosa: React.FC<{ txt: string; size?: number; f0?: number; style?: React.CSSProperties }> = ({ txt, size = 220, f0 = 0, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 12);
  return (
    <div style={{ width: size, height: size, ...azulejo(size), border: `${size * 0.04}px solid ${R.azul}`, boxShadow: "0 18px 40px rgba(0,0,0,0.5), inset 0 0 0 6px #EFE8D6", display: "flex", alignItems: "center", justifyContent: "center", transform: `perspective(900px) rotateY(${(1 - p) * 90}deg)`, opacity: cl(p * 2), ...style }}>
      <div style={{ width: size * 0.62, height: size * 0.62, borderRadius: "50%", background: R.cal, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: size * (txt.length > 2 ? 0.92 / txt.length : 0.42), color: R.azul, whiteSpace: "nowrap" }}>{txt}</div>
    </div>
  );
};
// renglón escrito a mano: se "escribe" de izquierda a derecha
const Escrito: React.FC<{ txt: string; f0: number; size?: number; color?: string; done?: boolean; cross?: boolean }> = ({ txt, f0, size = 46, color = R.pen, done, cross }) => {
  const f = useCurrentFrame(); const w = interpolate(f, [f0, f0 + Math.max(10, txt.length * 0.55)], [0, 100], { ...CL, easing: ease });
  const tick = sp(f, f0 + txt.length * 0.55 + 2, 12);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, height: 53 }}>
      <div style={{ width: 34, fontFamily: HAND, fontWeight: 700, fontSize: size, color: cross ? R.no : R.ok, transform: `scale(${done || cross ? tick : 0})` }}>{cross ? "✗" : "✓"}</div>
      <div style={{ position: "relative", fontFamily: HAND, fontSize: size, color, clipPath: `inset(-10px ${100 - w}% -10px 0)`, whiteSpace: "nowrap" }}>
        {txt}
        {cross ? <div style={{ position: "absolute", left: 0, top: "52%", height: 4, background: R.no, width: `${100 * tick}%` }} /> : null}
      </div>
    </div>
  );
};

// ---------- apertura de receta: la foto del plato; una baldosa gira con el número y el título se escribe en una franja de mantel
export const ChapR: React.FC<{ n: number; N: number; title: string; src: string; unit?: string; dur: number }> = ({ n, N, title, src, unit = "RECETA", dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const band = interpolate(f, [8, 24], [0, 100], { ...CL, easing: ease });
  const right = n % 2 === 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={n * 17 + 5} dur={dur} />
      <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(16,10,6,0.72), rgba(16,10,6,0.12) 58%, transparent 78%)` }} />
      <div style={{ position: "absolute", [right ? "right" : "left"]: 110, top: 190, width: 720 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
          <Baldosa txt={String(n)} size={230} />
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: R.oro, textShadow: tsh, paddingBottom: 14 }}>{unit} {n} DE {N}</div>
        </div>
        <div style={{ marginTop: 34, padding: "18px 30px", background: R.crema, borderLeft: `14px solid ${R.barro}`, clipPath: `inset(0 ${100 - band}% 0 0)`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 62, lineHeight: 1.1, color: R.ink }}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- índice / repaso: 3 fichas sobre la pared de azulejos; en el repaso cada una se ilumina cuando la voz la nombra
export const IdxR: React.FC<{ head: string; cards: { n: number; title: string; src: string; f?: number }[]; on?: number; dur: number }> = ({ head, cards, on, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ ...azulejo(150), opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(16,24,48,0.35)" }} />
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}><Big txt={head} size={64} /></div>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 56, transform: `scale(${1 + 0.06 * cl(f / Math.max(1, dur))})`, transformOrigin: "50% 40%" }}>
        {cards.map((c, i) => { const p = sp(f, c.f ?? 10 + i * 12, 13); const lit = on === undefined || on === c.n;
          return (
            <div key={i} style={{ width: 500, background: R.crema, padding: 18, paddingBottom: 26, transform: `translateY(${(1 - p) * 300}px) rotate(${(i - 1) * 2.2}deg)`, opacity: p * (lit ? 1 : 0.72), boxShadow: "0 24px 50px rgba(0,0,0,0.5)" }}>
              <div style={{ height: 300, overflow: "hidden" }}><Img src={staticFile(c.src)} style={{ width: "100%", height: 300, objectFit: "cover", transform: `scale(${1.04 + 0.1 * cl(f / Math.max(1, dur))})` }} /></div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: R.barro, marginTop: 16 }}>RECETA {c.n}</div>
              <div style={{ fontFamily: HAND, fontSize: 44, lineHeight: 1.1, color: R.pen, marginTop: 6 }}>{c.title}</div>
            </div>
          ); })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- ficha de receta rayada (ingredientes / señales / repaso): los renglones se escriben cuando la voz los dice
export const ListaR: React.FC<{ head: string; title: string; rows: { txt: string; f: number; done?: boolean; cross?: boolean }[]; bg?: string; dur: number }> = ({ head, title, rows, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 15); const o = useOut(dur, 10);
  const n = rows.length; const fs = n > 8 ? 38 : n > 6 ? 42 : 46;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.45} />
      <div style={{ position: "absolute", left: "50%", top: 112, width: 1080, marginLeft: -540, height: 900, ...ficha, transform: `translateY(${(1 - p) * 900}px) rotate(-1.2deg)`, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", padding: "26px 60px" }}>
        <div style={{ position: "absolute", top: -18, left: 420, width: 240, height: 44, background: "rgba(236,224,190,0.9)", transform: "rotate(2deg)" }} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: R.barro }}>{head}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: R.ink, marginTop: 2 }}>{title}</div>
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: n > 8 ? 2 : 8 }}>
          {rows.map((r, i) => <Escrito key={i} txt={r.txt} f0={r.f} size={fs} done={r.done ?? true} cross={r.cross} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- cuenta en papel de estraza: precios escritos con pluma; el total se encierra en un círculo
export const TicketR: React.FC<{ head: string; rows: { t: string; v: string; f: number }[]; total?: string; fT?: number; sub?: string; bg?: string; dur: number }> = ({ head, rows, total, fT = 0, sub, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 14); const o = useOut(dur, 10); const ring = interpolate(f, [fT + 6, fT + 22], [0, 360], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.5} />
      <div style={{ position: "absolute", left: "50%", top: 60, width: 860, marginLeft: -430, ...estraza, padding: "40px 56px 48px", transform: `translateY(${(1 - p) * 900}px) rotate(1.4deg)`, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", clipPath: "polygon(0 0, 100% 0, 100% 97%, 96% 100%, 92% 97%, 88% 100%, 84% 97%, 80% 100%, 76% 97%, 72% 100%, 68% 97%, 64% 100%, 60% 97%, 56% 100%, 52% 97%, 48% 100%, 44% 97%, 40% 100%, 36% 97%, 32% 100%, 28% 97%, 24% 100%, 20% 97%, 16% 100%, 12% 97%, 8% 100%, 4% 97%, 0 100%)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: R.barro2 }}>{head}</div>
        <div style={{ marginTop: 20 }}>
          {rows.map((r, i) => { const q = sp(f, r.f, 15);
            return <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px dashed rgba(60,40,20,0.35)", padding: "10px 0", opacity: q, transform: `translateX(${(1 - q) * -40}px)`, fontFamily: HAND, fontSize: 46, color: R.ink }}><span>{r.t}</span><span style={{ color: R.pen, fontWeight: 700 }}>{r.v}</span></div>; })}
        </div>
        {total ? <div style={{ marginTop: 26, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "relative", padding: "6px 34px", fontFamily: HAND, fontWeight: 700, fontSize: 76, color: R.no, opacity: sp(f, fT, 14) }}>
            {total}
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `5px solid ${R.no}`, clipPath: `polygon(50% 50%, 50% -60%, ${ring > 90 ? "160% -60%" : "50% -60%"}, ${ring > 180 ? "160% 160%" : "50% -60%"}, ${ring > 270 ? "-60% 160%" : "50% -60%"}, ${ring >= 360 ? "-60% -60%" : "50% -60%"}, ${ring >= 360 ? "50% -60%" : "50% -60%"})` }} />
          </div>
        </div> : null}
        {sub ? <div style={{ fontFamily: HAND, fontSize: 40, color: R.barro2, textAlign: "right", marginTop: 8, opacity: sp(f, fT + 14, 15) }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- número grande en baldosa + título (señal, error, paso del truco)
export const NumR: React.FC<{ unit: string; k: number | string; N?: number; title: string; sub?: string; bg?: string; tone?: "ok" | "no" | "azul"; dur: number }> = ({ unit, k, N, title, sub, bg, tone = "azul", dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const col = tone === "no" ? R.no : tone === "ok" ? R.ok : R.oro;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.58} />
      <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 70 }}>
        <Baldosa txt={String(k)} size={300} />
        <div style={{ maxWidth: 1180 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, letterSpacing: 8, ...(tone === "no" ? { color: "#fff", background: R.no, display: "inline-block", padding: "6px 20px", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.45)" } : { color: col, textShadow: tsh }), opacity: sp(f, 6) }}>{unit}{N ? ` ${k} DE ${N}` : ""}</div>
          <Big txt={title} f0={10} size={88} style={{ marginTop: 10 }} />
          {sub ? <div style={{ fontFamily: HAND, fontSize: 50, color: "#F3E6C8", textShadow: tsh, marginTop: 18, opacity: sp(f, 22) }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- mal / bien: dos mitades, la mala se tacha y la buena se palomea
export const VsR: React.FC<{ head: string; mal: { t: string; s: string; src: string }; bien: { t: string; s: string; src: string }; modo: "mal" | "bien"; dur: number }> = ({ head, mal, bien, modo, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const m = sp(f, 4, 15), b = sp(f, modo === "bien" ? 4 : 999, 15); const mark = sp(f, 18, 11);
  const Half: React.FC<{ x: typeof mal; on: number; bad: boolean; lit: boolean }> = ({ x, on, bad, lit }) => (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", opacity: cl(on) * (lit ? 1 : 0.82), filter: lit ? undefined : "saturate(0.45) brightness(0.8)", transform: `translateY(${(1 - on) * 80}px)` }}>
      <Img src={staticFile(x.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.1 * cl(f / Math.max(1, dur))})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(16,10,6,0.85), transparent 55%)" }} />
      <div style={{ position: "absolute", left: 50, bottom: 60, right: 40 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: "#FBF6EA", textShadow: tsh }}>{x.t}</div>
        <div style={{ fontFamily: HAND, fontSize: 44, color: bad ? "#F5B7A8" : "#C9EBC4", textShadow: tsh }}>{x.s}</div>
      </div>
      {lit ? <div style={{ position: "absolute", right: 50, top: 50, width: 130, height: 130, borderRadius: "50%", background: bad ? R.no : R.ok, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 90, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${mark})` }}>{bad ? "✗" : "✓"}</div> : null}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: R.azul }}>
      <div style={{ display: "flex", position: "absolute", inset: 0, gap: 12 }}>
        <Half x={mal} on={m} bad lit={modo === "mal"} />
        <Half x={bien} on={modo === "bien" ? b : m} bad={false} lit={modo === "bien"} />
      </div>
      <div style={{ position: "absolute", top: 36, left: 0, right: 0, textAlign: "center", zIndex: 5 }}><span style={{ background: R.crema, padding: "14px 44px", fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.45)", color: R.azul }}>{head}</span></div>
    </AbsoluteFill>
  );
};

// ---------- dato con fuente (FDA): cifras grandes que suben cuando la voz las dice
export const DatoR: React.FC<{ cite: string; title: string; rows: { big: string; txt: string; f: number }[]; foot?: string; bg?: string; dur: number }> = ({ cite, title, rows, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 130, top: 110, right: 130 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: R.oro, textShadow: tsh }}>{cite}</div>
        <Big txt={title} f0={4} size={64} style={{ marginTop: 8 }} />
        <div style={{ display: "flex", gap: 40, marginTop: 70 }}>
          {rows.map((r, i) => { const p = sp(f, r.f, 13);
            return <div key={i} style={{ flex: 1, ...azulejo(110), border: `8px solid ${R.azul}`, padding: "30px 26px", transform: `translateY(${(1 - p) * 200}px)`, opacity: p, boxShadow: "0 20px 44px rgba(0,0,0,0.5)" }}>
              <div style={{ background: R.crema, padding: "20px 18px", textAlign: "center" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: R.azul, lineHeight: 1 }}>{r.big}</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: R.ink, marginTop: 10 }}>{r.txt}</div>
              </div>
            </div>; })}
        </div>
        {foot ? <div style={{ fontFamily: HAND, fontSize: 44, color: "#F3E6C8", textShadow: tsh, marginTop: 50, opacity: sp(f, rows[rows.length - 1].f + 20) }}>{foot}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- reloj de cocina: el aro de barro se va llenando hasta los minutos que dice la voz
export const RelojR: React.FC<{ min: number; label: string; sub?: string; bg?: string; dur: number }> = ({ min, label, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 14); const fill = interpolate(f, [8, Math.min(dur - 12, 50)], [0, (min / 60) * 360], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.55} />
      <div style={{ position: "absolute", left: 230, top: 190, width: 700, height: 700, borderRadius: "50%", background: `conic-gradient(${R.barro} 0 ${fill}deg, ${R.crema} ${fill}deg 360deg)`, border: `22px solid ${R.azul}`, boxShadow: "0 30px 70px rgba(0,0,0,0.55)", transform: `scale(${p})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 430, height: 430, borderRadius: "50%", background: R.crema, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 190, color: R.azul, lineHeight: 1 }}>{min % 1 && fill >= (min / 60) * 360 - 0.5 ? `${Math.floor(min) || ""}½` : Math.floor((fill / 360) * 60 + 0.001)}</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: R.barro2 }}>MINUTOS</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 380, width: 760 }}>
        <Big txt={label} f0={12} size={76} />
        {sub ? <div style={{ fontFamily: HAND, fontSize: 48, color: "#F3E6C8", textShadow: tsh, marginTop: 16, opacity: sp(f, 24) }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- foto del álbum: cae sobre el mantel bordado, con su pie escrito a mano
export const AlbumR: React.FC<{ src: string; caption: string; seed?: number; dur: number }> = ({ src, caption, seed = 1, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 12); const rot = (seed % 2 ? -1 : 1) * (2 + (seed % 3));
  const z = interpolate(f, [0, dur], [1, 1.06], CL);
  return (
    <AbsoluteFill style={{ opacity: o, background: `repeating-linear-gradient(45deg, rgba(181,86,47,0.10) 0 6px, transparent 6px 22px), repeating-linear-gradient(-45deg, rgba(31,63,143,0.10) 0 6px, transparent 6px 22px), #F1EADB` }}>
      <div style={{ position: "absolute", left: "50%", top: 70, width: 1240, marginLeft: -620, background: "#FAF7F0", padding: "26px 26px 100px", boxShadow: "0 40px 80px rgba(0,0,0,0.45)", transform: `translateY(${(1 - p) * -120}px) rotate(${rot * (0.4 + 0.6 * p)}deg) scale(${z})` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: 760, objectFit: "cover", filter: "sepia(0.25)" }} />
        <div style={{ position: "absolute", left: 40, bottom: 22, fontFamily: HAND, fontSize: 52, color: R.pen, opacity: sp(f, 14) }}>{caption}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- menú de la semana: siete azulejos, cada día se escribe cuando la voz lo nombra
export const SemanaR: React.FC<{ head: string; days: { d: string; txt: string; f: number }[]; upto?: number; foot?: string; fF?: number; bg?: string; dur: number }> = ({ head, days, upto = 7, foot, fF = 0, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.6} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center" }}><Big txt={head} size={60} /></div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 210, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
        {days.slice(0, upto).map((x, i) => { const p = sp(f, x.f, 13);
          return <div key={i} style={{ height: 330, ...azulejo(100), border: `8px solid ${R.azul}`, padding: 16, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, boxShadow: "0 16px 36px rgba(0,0,0,0.5)" }}>
            <div style={{ background: R.crema, height: "100%", padding: "16px 20px" }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: R.barro }}>{x.d}</div>
              <div style={{ fontFamily: HAND, fontSize: 40, lineHeight: 1.12, color: R.pen, marginTop: 8 }}>{x.txt}</div>
            </div>
          </div>; })}
        {foot ? <div style={{ height: 330, ...estraza, padding: 26, opacity: sp(f, fF, 13), boxShadow: "0 16px 36px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1.1, color: R.ink }}>{foot}</div>
        </div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- aviso (con cariño): franja de barro y renglones
export const AvisoR: React.FC<{ head: string; title: string; lines: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ head, title, lines, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10); const p = sp(f, 0, 15);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.5} />
      <div style={{ position: "absolute", right: 110, top: 150, width: 900, background: R.crema, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", transform: `translateX(${(1 - p) * 1100}px)` }}>
        <div style={{ background: R.barro, padding: "18px 40px", fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: R.crema }}>{head}</div>
        <div style={{ padding: "30px 40px 40px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, lineHeight: 1.1, color: R.ink }}>{title}</div>
          <div style={{ marginTop: 22 }}>
            {lines.map((l, i) => { const q = sp(f, l.f, 15); return <div key={i} style={{ fontFamily: HAND, fontSize: 44, lineHeight: 1.25, color: R.pen, opacity: q, transform: `translateX(${(1 - q) * 30}px)` }}>· {l.txt}</div>; })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- comentario de la gente ("Me preguntaron…"): tarjeta de comentario sin logos
export const ComentR: React.FC<{ head: string; who: string; txt: string; likes: number; bg?: string; dur: number }> = ({ head, who, txt, likes, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10); const p = sp(f, 4, 14);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center" }}><Big txt={head} size={66} color={R.oro} /></div>
      <div style={{ position: "absolute", left: "50%", top: 380, width: 1240, marginLeft: -620, background: "#FFFFFF", borderRadius: 22, padding: "38px 46px", display: "flex", gap: 30, boxShadow: "0 30px 70px rgba(0,0,0,0.55)", transform: `translateY(${(1 - p) * 300}px)`, opacity: p }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: R.barro, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{who[0]}</div>
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#333" }}>{who}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, lineHeight: 1.25, color: "#111", marginTop: 8 }}>{txt}</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: "#666", marginTop: 16 }}>♥ {Math.round(interpolate(f, [10, 40], [0, likes], CL))}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- precio colgado en etiqueta de estraza
export const PrecioR: React.FC<{ big: string; sub: string; bg?: string; dur: number }> = ({ big, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 9); const sw = Math.sin(f / 9) * 4 * (1 - cl(f / 60));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.35} />
      <div style={{ position: "absolute", left: 1150, top: -20, width: 4, height: 200 * p + 40, background: "#E8DCC0" }} />
      <div style={{ position: "absolute", left: 960, top: 200 * p + 10, width: 400, transformOrigin: "50% 0", transform: `rotate(${sw}deg)`, ...estraza, padding: "60px 30px 40px", textAlign: "center", clipPath: "polygon(20% 0, 80% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 182, top: 18, width: 36, height: 36, borderRadius: "50%", background: "rgba(40,24,10,0.55)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 130, color: R.no, lineHeight: 1 }}>{big}</div>
        <div style={{ fontFamily: HAND, fontSize: 40, color: R.ink, marginTop: 10 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- (overlay) progreso: 3 azulejos chicos abajo a la izquierda, el de la receta actual encendido
export const ProgR: React.FC<{ n: number; N: number; title: string; unit?: string; dur: number }> = ({ n, N, title, unit = "RECETA", dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 18); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", left: 56, bottom: 42, display: "flex", alignItems: "center", gap: 16, opacity: p * o, transform: `translateY(${(1 - p) * 50}px)` }}>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: N }, (_, i) => <div key={i} style={{ width: 46, height: 46, ...azulejo(46), border: `3px solid ${i === n - 1 ? R.oro : R.azul}`, opacity: i < n ? 1 : 0.45 }} />)}
      </div>
      <div style={{ background: "rgba(20,14,10,0.62)", padding: "8px 16px", fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "#F7F2E6", letterSpacing: 2 }}>{unit} {n}/{N} · {title.toUpperCase()}</div>
    </div>
  );
};
// ---------- (overlay) Gran Recetario: portada + QR, entra por la derecha
export const QrR: React.FC<{ qr: string; cover: string; dur: number }> = ({ qr, cover, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 15); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", right: 64, top: 150, width: 620, opacity: o, transform: `translateX(${(1 - p) * 760}px)` }}>
      <div style={{ ...azulejo(90), border: `10px solid ${R.azul}`, padding: 22, boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
        <div style={{ background: R.crema, padding: 24, display: "flex", gap: 22, alignItems: "center" }}>
          <Img src={staticFile(cover)} style={{ width: 230, height: 300, objectFit: "cover", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }} />
          <div style={{ flex: 1 }}>
            <Img src={staticFile(qr)} style={{ width: 270, height: 270, background: "#fff", padding: 8 }} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: R.ink, marginTop: 10 }}>Escanea con tu cámara</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: -10, marginLeft: 26, display: "inline-block", background: R.barro, padding: "10px 24px", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: R.crema, transform: "rotate(-2deg)" }}>Mi Gran Recetario · en la descripción</div>
    </div>
  );
};
// ---------- (overlay) pantalla partida: la foto entra a la izquierda con su etiqueta
export const PanelR: React.FC<{ src: string; label: string; dur: number }> = ({ src, label, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 16); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 900, opacity: o, clipPath: `inset(0 ${100 - 100 * p}% 0 0)` }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 18, ...azulejo(18) }} />
      <div style={{ position: "absolute", left: 50, bottom: 70, background: R.crema, padding: "12px 26px", fontFamily: HAND, fontWeight: 700, fontSize: 42, color: R.pen, transform: "rotate(-1.5deg)" }}>{label}</div>
    </div>
  );
};
