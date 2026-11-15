// Kit "Piso" del Constructor Libre (fb14c, silicato en piso de cemento que suelta polvo): losa, polvo, cinta de embalar, llave, gota,
// tiza amarilla, regadera, secador de goma, lustradora de disco, baldes y jarras. PURO CSS y DOM: sin SVG, sin blur grande,
// sin backdrop-filter, sin feTurbulence. Ningún mecanismo de Muro (fb14b) ni de Obra (fb14a) se repite; dentro del video, uno por idea.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL, hash, useOut } from "./Kit";

const { SERIF, SANS, HAND } = FONTS as any;
export const P = { cem: "#9C9891", cemL: "#CDC9C1", cemD: "#5F5B55", cemX: "#3A3734", polvo: "#B9B4AA", tiza: "#F2D23A", ok: "#4FA25A", no: "#D2452F", ink: "#1B1A18", sil: "#E3B85A", agua: "#6FB0D8", paper: "#F4F1EA", rub: "#26292C" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 14) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.8 } });
const tsh = "0 3px 14px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.85)";
const r01 = (n: number) => (hash(n) % 10000) / 10000;
// cemento visto de arriba: granito fino + manchas suaves
const cem = (tone = 0, sheen = 0): React.CSSProperties => ({
  background: `radial-gradient(circle at 30% 40%, rgba(0,0,0,0.16) 0 1px, transparent 2px) 0 0 / 9px 11px, radial-gradient(circle at 70% 20%, rgba(255,255,255,0.16) 0 1px, transparent 2px) 0 0 / 13px 7px, radial-gradient(ellipse at 25% 70%, rgba(0,0,0,0.12), transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(255,255,255,${0.08 + sheen * 0.25}), transparent 60%), linear-gradient(160deg, ${tone ? P.cemD : P.cemL}, ${tone ? P.cemX : P.cem})`,
});
const Base: React.FC<{ bg?: string; dur: number; seed?: number; dim?: number }> = ({ bg, dur, seed = 5, dim = 0.6 }) => (
  <AbsoluteFill>
    {bg ? <Photo src={bg} seed={seed} dur={dur} /> : <AbsoluteFill style={cem(1)} />}
    <AbsoluteFill style={{ background: `rgba(16,15,14,${Math.min(0.5, dim * 0.72)})` }} />
  </AbsoluteFill>
);
const Kick: React.FC<{ txt: string; f0?: number; color?: string; style?: React.CSSProperties }> = ({ txt, f0 = 0, color = P.tiza, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 16);
  return <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, letterSpacing: 5, color, textShadow: tsh, opacity: p, transform: `translateY(${(1 - p) * 18}px)`, ...style }}>{txt}</div>;
};
const Big: React.FC<{ txt: string; f0?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ txt, f0 = 0, size = 88, color = "#F5F3EE", style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 15);
  return <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.08, color, textShadow: tsh, opacity: p, transform: `translateY(${(1 - p) * 28}px)`, ...style }}>{txt}</div>;
};
// tiza amarilla escrita a mano (se revela de izquierda a derecha como un trazo)
const Tiza: React.FC<{ txt: string; f0?: number; size?: number; color?: string; len?: number; style?: React.CSSProperties }> = ({ txt, f0 = 0, size = 64, color = P.tiza, len = 16, style }) => {
  const f = useCurrentFrame(); const w = interpolate(f, [f0, f0 + len], [0, 100], CL);
  return <div style={{ fontFamily: HAND || SANS, fontWeight: 700, fontSize: size, color, clipPath: `inset(-10% ${100 - w}% -10% 0)`, textShadow: "0 2px 6px rgba(0,0,0,0.6)", whiteSpace: "nowrap", ...style }}>{txt}</div>;
};
const Sello: React.FC<{ ok: boolean; txt: string; f0: number; style?: React.CSSProperties }> = ({ ok, txt, f0, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 9); const s = interpolate(p, [0, 1], [1.8, 1]);
  return <div style={{ display: "inline-block", border: `5px solid ${ok ? P.ok : P.no}`, color: ok ? P.ok : P.no, background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "6px 18px", fontFamily: SANS, fontWeight: 800, fontSize: 42, letterSpacing: 2, opacity: cl(p * 1.4), transform: `scale(${s}) rotate(-4deg)`, ...style }}>{txt}</div>;
};
const Pic: React.FC<{ src: string; style?: React.CSSProperties; fit?: "cover" | "contain"; filter?: string }> = ({ src, style, fit = "cover", filter }) => <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, filter, ...style }} />;

// ---------- apertura de paso: la foto del paso se acuesta en el piso (de rasante a plano) y el número se escribe con tiza
export const ChapP: React.FC<{ n: number; N: number; title: string; src: string; dur: number }> = ({ n, N, title, src, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = interpolate(f, [0, 20], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(1) }}>
      <div style={{ position: "absolute", left: 760, top: 120, width: 1060, height: 800, perspective: 1600 }}>
        <div style={{ width: "100%", height: "100%", transform: `rotateX(${interpolate(p, [0, 1], [72, 6])}deg) translateZ(${interpolate(p, [0, 1], [-300, 0])}px)`, transformOrigin: "50% 100%", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", border: "10px solid #EDEAE3" }}><Pic src={src} /></div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 250, width: 640 }}>
        <Tiza txt={`Paso ${n}`} f0={8} size={120} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 39, letterSpacing: 6, color: "#D8D4CC", opacity: sp(f, 20), marginTop: 6 }}>DE {N}</div>
        <Big txt={title} f0={16} size={70} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- índice: el portón de chapa sube y detrás están los 12 pasos
export const IdxP: React.FC<{ head: string; cards: { n: number; title: string; src: string }[]; dur: number }> = ({ head, cards, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const up = interpolate(f, [8, 34], [0, 105], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(1) }}>
      <div style={{ position: "absolute", left: 90, top: 60, fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: P.tiza, textShadow: tsh }}>{head}</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 140, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 22 }}>
        {cards.map((c, i) => { const p = sp(f, 24 + i * 2, 15);
          return <div key={i} style={{ background: "#EDEAE3", padding: 8, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
            <div style={{ height: 210, overflow: "hidden" }}><Pic src={c.src} /></div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: P.no, marginTop: 8 }}>{c.n}</div>
            <div style={{ fontFamily: SERIF, fontSize: 38, color: P.ink, lineHeight: 1.1, height: 62 }}>{c.title}</div>
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: `${-up}%`, height: "100%", background: "repeating-linear-gradient(180deg, #8E9297 0 26px, #6D7176 26px 34px, #A9ADB2 34px 40px)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: "46%", bottom: 40, width: 160, height: 26, borderRadius: 6, background: "#3D4145" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- repaso: un camino de pisadas sobre el cemento; cada pisada destapa un paso en su palabra
export const RepasoP: React.FC<{ cards: { n: number; title: string; f: number }[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(0) }}>
      <AbsoluteFill style={{ background: "rgba(20,19,18,0.35)" }} />
      <div style={{ position: "absolute", left: 90, top: 50, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 8, color: P.tiza, textShadow: tsh }}>REPASO · LOS 12 PASOS</div>
      {cards.map((c, i) => { const col = i < 6 ? 0 : 1, row = i % 6; const x = 120 + col * 860 + (row % 2) * 50, y = 140 + row * 150; const p = sp(f, c.f, 13); const on = f >= c.f;
        return <div key={i} style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 28, opacity: on ? 1 : 0.18 }}>
          <div style={{ width: 70, height: 110, borderRadius: "46% 46% 40% 40% / 55% 55% 45% 45%", background: on ? "rgba(30,28,26,0.75)" : "rgba(30,28,26,0.25)", transform: `rotate(${row % 2 ? 12 : -12}deg) scale(${0.7 + 0.3 * p})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: P.tiza }}>{c.n}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: "#F5F3EE", textShadow: tsh, transform: `translateX(${(1 - p) * -24}px)` }}>{c.title}</div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- precio: un chorro espeso cae y hace un charquito; el precio aparece dentro del charco
export const PrecioP: React.FC<{ big: string; sub: string; bg?: string; dur: number }> = ({ big, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const fall = interpolate(f, [0, 12], [0, 1], CL); const pool = interpolate(f, [10, 34], [0, 1], { ...CL, easing: ease }); const stop = interpolate(f, [34, 44], [1, 0], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.55} />
      <div style={{ position: "absolute", left: 950, top: 0, width: 26 * stop + 2, height: 520 * fall, background: `linear-gradient(90deg, rgba(227,184,90,0.6), rgba(255,236,190,0.95), rgba(227,184,90,0.6))`, borderRadius: 14, transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: 960, top: 640, width: 1100 * pool, height: 380 * pool, transform: "translate(-50%,-50%)", borderRadius: "48% 52% 46% 54% / 50% 44% 56% 50%", background: "radial-gradient(ellipse at 40% 35%, rgba(255,245,215,0.85), rgba(227,184,90,0.75) 55%, rgba(150,110,40,0.7))", boxShadow: "0 0 0 6px rgba(255,255,255,0.15)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center" }}>
        <Big txt={big} f0={26} size={210} color={P.ink} style={{ textShadow: "0 2px 0 rgba(255,255,255,0.5)" }} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, letterSpacing: 4, color: P.ink, opacity: sp(f, 34) }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- premio: teaser = el piso partido opaco | brillante; final = una lustradora pasa en franjas y deja el brillo detrás
export const PremioP: React.FC<{ teaser?: boolean; a: string; b: string; title: string; sub: string; dur: number }> = ({ teaser, a, b, title, sub, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  if (teaser) { const p = sp(f, 2, 16); return (
    <AbsoluteFill style={{ opacity: o, background: "#111" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", overflow: "hidden", transform: `translateX(${(1 - p) * -200}px)` }}><Pic src={a} /></div>
      <div style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", overflow: "hidden", transform: `translateX(${(1 - p) * 200}px)` }}><Pic src={b} /></div>
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 8, background: P.tiza, transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}><Kick txt={sub} f0={10} /><Big txt={title} f0={16} size={96} /></div>
    </AbsoluteFill>); }
  const passes = 4, t = interpolate(f, [6, Math.max(40, dur - 30)], [0, passes], CL); const k = Math.floor(t), fr = t - k; const dx = k % 2 ? 1 - fr : fr; const discX = 160 + dx * 1600, discY = 160 + k * 250;
  return (
    <AbsoluteFill style={{ opacity: o, background: "#111" }}>
      <AbsoluteFill><Pic src={a} filter="grayscale(0.5) brightness(0.72) contrast(0.85)" /></AbsoluteFill>
      {Array.from({ length: passes }, (_, i) => { const w = i < k ? 100 : i === k ? fr * 100 : 0; const left = i % 2 ? 100 - w : 0;
        return w > 0 ? <AbsoluteFill key={i} style={{ clipPath: `inset(${i * 25}% ${100 - left - w}% ${Math.max(0, 75 - i * 25)}% ${left}%)` }}><Pic src={b} /></AbsoluteFill> : null; })}
      <div style={{ position: "absolute", left: discX - 130, top: discY - 130, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, #DADADA 0 18%, #F2F2F2 19% 60%, #BDBDBD 61% 64%, #4A4A4A 65%)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", transform: `rotate(${f * 40}deg)`, opacity: t < passes ? 1 : interpolate(f, [dur - 30, dur - 20], [1, 0], CL) }} />
      <div style={{ position: "absolute", left: 120, bottom: 110 }}><Kick txt={sub} f0={4} /><Big txt={title} f0={10} size={96} /></div>
    </AbsoluteFill>
  );
};

// ---------- comentarios: tarjetas que caen desde arriba de la cámara y se apoyan en el piso con su sombra
export const ComentP: React.FC<{ items: { txt: string; f: number }[]; head: string; bg?: string; dur: number }> = ({ items, head, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1400 }}>
      <Base bg={bg} dur={dur} dim={0.66} />
      <div style={{ position: "absolute", left: 120, top: 80 }}><Kick txt={head} /></div>
      {items.map((it, i) => { const p = interpolate(f, [it.f, it.f + 16], [0, 1], { ...CL, easing: Easing.in(Easing.quad) }); const land = sp(f, it.f + 16, 8);
        const x = 150 + i * 560, y = 300 + (i % 2) * 120, rot = (i % 2 ? 4 : -5);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 500, opacity: cl(p * 3), transform: `translateZ(${(1 - p) * 700}px) rotate(${rot + (1 - p) * 20}deg) scale(${1 + (1 - land) * 0.03})`, background: P.paper, borderRadius: 14, padding: "30px 32px", boxShadow: `0 ${10 + 30 * p}px ${20 + 40 * p}px rgba(0,0,0,${0.2 + 0.4 * p})` }}>
          <div style={{ fontFamily: SANS, fontSize: 38, color: "#857F75", marginBottom: 10 }}>comentario del video de la pared</div>
          <div style={{ fontFamily: SERIF, fontSize: 42, color: P.ink, lineHeight: 1.15 }}>{it.txt}</div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- álbum 1997: la foto vieja cae sobre el piso del taller y levanta un poco de polvo
export const FotoCaeP: React.FC<{ src: string; caption: string; dur: number }> = ({ src, caption, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = interpolate(f, [0, 14], [0, 1], { ...CL, easing: Easing.in(Easing.quad) }); const puff = interpolate(f, [14, 40], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(0), perspective: 1600 }}>
      <div style={{ position: "absolute", left: 460, top: 130, width: 1000, height: 700, background: "#F1ECE0", padding: "26px 26px 90px", transform: `rotateX(${(1 - p) * 40}deg) translateZ(${(1 - p) * 500}px) rotate(-3deg)`, boxShadow: `0 ${10 + 30 * p}px ${30 + 30 * p}px rgba(0,0,0,0.5)` }}>
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Pic src={src} filter="sepia(0.25) saturate(0.85)" /></div>
        <div style={{ position: "absolute", left: 30, bottom: 18 }}><Tiza txt={caption} f0={20} size={46} color="#3A3530" /></div>
      </div>
      {Array.from({ length: 26 }, (_, i) => { const a = r01(i) * Math.PI * 2, d = 520 + r01(i + 40) * 260; const x = 960 + Math.cos(a) * d * puff, y = 820 + Math.sin(a) * 140 * puff - 60 * puff;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14 + (i % 4) * 6, height: 14 + (i % 4) * 6, borderRadius: "50%", background: "rgba(200,196,188,0.6)", opacity: puff > 0 ? 1 - puff : 0 }} />; })}
    </AbsoluteFill>
  );
};

// ---------- álbum final: la foto gira sobre su eje y del otro lado está el mismo taller años después
export const GiroP: React.FC<{ a: string; b: string; ca: string; cb: string; dur: number }> = ({ a, b, ca, cb, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const r = interpolate(f, [Math.round(dur * 0.35), Math.round(dur * 0.35) + 18], [0, 180], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const face = (src: string, c: string, back: boolean) => <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: back ? "rotateY(180deg)" : undefined, background: "#F1ECE0", padding: "22px 22px 80px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}><div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Pic src={src} filter={back ? undefined : "sepia(0.25)"} /></div><div style={{ position: "absolute", left: 28, bottom: 18, fontFamily: HAND || SANS, fontSize: 42, color: "#3A3530" }}>{c}</div></div>;
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(1), perspective: 2000 }}>
      <div style={{ position: "absolute", left: 460, top: 140, width: 1000, height: 720, transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>{face(a, ca, false)}{face(b, cb, true)}</div>
    </AbsoluteFill>
  );
};

// ---------- 2015: la funda gris se corre del auto y debajo igual hay polvo
export const FundaP: React.FC<{ src: string; caption: string; dur: number }> = ({ src, caption, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const off = interpolate(f, [8, 34], [0, 110], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(1) }}>
      <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 740, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", border: "12px solid #EEE9DE" }}>
        <Pic src={src} />
        {Array.from({ length: 70 }, (_, i) => <div key={i} style={{ position: "absolute", left: r01(i) * 1180, top: r01(i + 99) * 720, width: 5, height: 5, borderRadius: "50%", background: "rgba(215,212,205,0.75)", opacity: cl((off - 40) / 60) }} />)}
        <div style={{ position: "absolute", top: -20, bottom: -20, left: `${off}%`, width: "115%", background: "repeating-linear-gradient(95deg, #7E8186 0 40px, #8E9196 40px 70px, #73767B 70px 120px)", boxShadow: "-20px 0 40px rgba(0,0,0,0.5)" }} />
      </div>
      <div style={{ position: "absolute", left: 380, bottom: 60 }}><Tiza txt={caption} f0={30} size={52} /></div>
    </AbsoluteFill>
  );
};

// ---------- 2008: sobre la foto del depósito aparecen las lagunas blancas que dejó el charco seco
export const HarinaP: React.FC<{ src: string; caption: string; lesson: string; dur: number }> = ({ src, caption, lesson, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#151413" }}>
      <div style={{ position: "absolute", left: 160, top: 110, width: 1100, height: 720, overflow: "hidden", transform: "rotate(-1.5deg)", border: "14px solid #EEE9DE", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
        <Pic src={src} filter="sepia(0.2)" />
        {[[180, 480], [520, 560], [760, 430], [330, 620], [900, 600]].map(([x, y], i) => { const g = interpolate(f, [10 + i * 6, 34 + i * 6], [0, 1], { ...CL, easing: ease });
          return <div key={i} style={{ position: "absolute", left: x - 110 * g, top: y - 50 * g, width: 220 * g, height: 100 * g, borderRadius: "50% 46% 54% 48%", background: "radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.95), rgba(236,236,232,0.85) 60%, rgba(220,220,214,0.6))" }} />; })}
      </div>
      <div style={{ position: "absolute", left: 1320, top: 260, width: 520 }}>
        <Tiza txt={caption} f0={6} size={50} />
        <Big txt="Lagunas blancas, duras, resbalosas" f0={30} size={58} style={{ marginTop: 26 }} />
        <div style={{ marginTop: 34 }}><Sello ok txt={lesson} f0={dur - 50} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- dusting: la palabra se deshace en polvo que sube
export const DustP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 2, 18);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 210, letterSpacing: 18, color: P.cemL, opacity: p * interpolate(f, [40, dur], [1, 0.55], CL), textShadow: tsh }}>DUSTING</div>
      {Array.from({ length: 90 }, (_, i) => { const st = 10 + (hash(i) % 50); const t = cl((f - st) / 60); const x = 380 + r01(i + 3) * 1160 + Math.sin(i + f / 9) * 18 * t; const y = 470 - t * (220 + r01(i + 7) * 260);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 4 + (i % 4) * 2, height: 4 + (i % 4) * 2, borderRadius: "50%", background: "rgba(220,216,208,0.85)", opacity: t > 0 ? 1 - t : 0 }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center" }}><Big txt="el piso que se harina" f0={18} size={74} color={P.tiza} /></div>
    </AbsoluteFill>
  );
};

// ---------- capas: corte de la platea fresca; el agua sube, la llana la mezcla con la capa de arriba y esa capa queda débil
export const CapasP: React.FC<{ items: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ items, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const w = interpolate(f, [6, 26], [0, 1], CL); const ll = interpolate(f, [26, 56], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 120, top: 260, width: 900, height: 480, perspective: 1200 }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateY(14deg)", transformOrigin: "0 50%" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, bottom: 0, ...cem(1) }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 120 - 70 * w, height: 70 * w, background: "linear-gradient(180deg, rgba(111,176,216,0.75), rgba(111,176,216,0.35))" }} />
          <div style={{ position: "absolute", left: 0, width: `${ll * 100}%`, top: 120, height: 46, background: "linear-gradient(180deg, #D9D4CA, #BDB7AC)", borderBottom: "3px dashed rgba(0,0,0,0.25)" }} />
          <div style={{ position: "absolute", left: `${ll * 100}%`, top: 40, width: 220, height: 30, marginLeft: -110, background: "linear-gradient(180deg,#C8CBD0,#7E8288)", borderRadius: 4, opacity: ll > 0 && ll < 1 ? 1 : 0, boxShadow: "0 8px 12px rgba(0,0,0,0.5)" }}><div style={{ position: "absolute", left: 80, top: -60, width: 60, height: 60, borderRadius: 10, background: "#7A4E2B" }} /></div>
          <div style={{ position: "absolute", right: 20, top: 128, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: P.ink, opacity: ll }}>capa aguada, débil</div>
          <div style={{ position: "absolute", right: 20, bottom: 20, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: "#E8E4DC" }}>piso sano</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1110, top: 230, width: 700 }}>
        <Kick txt="EL DÍA QUE LO COLARON" />
        {items.map((it, i) => <div key={i} style={{ marginTop: 22, fontFamily: SERIF, fontSize: 46, color: "#F5F3EE", textShadow: tsh, opacity: sp(f, it.f, 15), transform: `translateX(${(1 - sp(f, it.f, 15)) * 40}px)` }}><span style={{ color: P.tiza, fontFamily: SANS, fontWeight: 800 }}>{i + 1}.</span> {it.txt}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- costra: corte lateral; la cascarita de arriba se rompe en lascas que caen y se vuelven polvo
export const CostraP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 160, top: 440, width: 1600, height: 380, ...cem(1), boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
      {Array.from({ length: 24 }, (_, i) => { const st = 14 + (hash(i) % 60); const t = cl((f - st) / 24); const x = 160 + i * 66.6;
        return <div key={i} style={{ position: "absolute", left: x, top: 400 + t * t * 420, width: 64, height: 40, background: "linear-gradient(180deg,#D7D2C8,#B5AFA4)", clipPath: `polygon(0 ${hash(i) % 30}%, 100% ${hash(i + 1) % 30}%, ${90 - (hash(i + 2) % 20)}% 100%, ${hash(i + 3) % 20}% 100%)`, transform: `rotate(${t * ((hash(i) % 2 ? 1 : -1) * 70)}deg)`, opacity: 1 - t * 0.9 }} />; })}
      <div style={{ position: "absolute", left: 170, top: 330 }}><Kick txt="CASCARITA FLOJA · 2 A 3 MM" color="#F0ECE4" /></div>
      <div style={{ position: "absolute", left: 200, top: 700, fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: "#ECE8E0" }}>ABAJO: PISO SANO Y DURO</div>
      <div style={{ position: "absolute", right: 160, top: 160, width: 760, textAlign: "right" }}><Big txt="Como la costra de un pan mal cocido" f0={20} size={60} /></div>
    </AbsoluteFill>
  );
};

// ---------- cinta: de arriba, la cinta se pega, el pulgar pasa, se despega y queda gris sobre la hoja
export const CintaP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const T = Math.max(60, dur - 30);
  const thumb = interpolate(f, [10, T * 0.5], [0, 3.5], CL); const tx = 560 + Math.abs(((thumb % 2) - 1)) * 800; const peel = interpolate(f, [T * 0.55, T * 0.75], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(0), perspective: 1400 }}>
      <AbsoluteFill style={{ background: "rgba(150,146,138,0.25)" }} />
      <div style={{ position: "absolute", left: 520, top: 440, width: 900, height: 140, transformOrigin: "50% 0", transform: `rotateX(${-peel * 75}deg) translateY(${-peel * 120}px)`, background: `rgba(230,228,220,${0.25 + 0.2 * peel})`, border: "2px solid rgba(255,255,255,0.5)", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }}>
        <div style={{ position: "absolute", inset: 10, background: "radial-gradient(circle, rgba(90,86,80,0.7) 0 1.5px, transparent 2px) 0 0 / 8px 9px", opacity: peel }} />
      </div>
      <div style={{ position: "absolute", left: tx - 60, top: 450, width: 120, height: 150, borderRadius: "50% 50% 45% 45%", background: "rgba(205,160,130,0.92)", boxShadow: "0 12px 20px rgba(0,0,0,0.4)", opacity: f > 10 && peel < 0.1 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 520, top: 360, fontFamily: SANS, fontWeight: 700, fontSize: 39, color: P.ink }}>← 15 cm →</div>
      <div style={{ position: "absolute", left: 120, top: 100, width: 1600 }}>
        <Kick txt="LA PRUEBA DE LA CINTA" color={P.ink} style={{ textShadow: "none" }} />
        <Big txt={peel > 0.3 ? "Despega de un tirón" : "Aprieta con el pulgar, 3 o 4 veces"} f0={peel > 0.3 ? Math.round(T * 0.55) : 6} size={70} color={P.ink} style={{ textShadow: "none" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- escala de la cinta: tres hojas en abanico, cada una con su veredicto
export const EscalaP: React.FC<{ rows: { g: number; t: string; v: string; ok: boolean; s: string; f: number }[]; bg?: string; dur: number }> = ({ rows, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      {rows.map((r, i) => { const p = sp(f, r.f, 13);
        return <div key={i} style={{ position: "absolute", left: 160 + i * 560, top: 170, width: 480, height: 640, background: "#FBFAF6", transform: `rotate(${(i - 1) * 4}deg) translateY(${(1 - p) * 600}px)`, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", padding: 36 }}>
          <div style={{ height: 120, background: `rgba(${110 - r.g * 70},${108 - r.g * 70},${104 - r.g * 70},${0.1 + r.g * 0.8})`, border: "2px solid rgba(200,200,200,0.7)", marginTop: 40 }} />
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 48, color: P.ink, marginTop: 40 }}>{r.t}</div>
          <div style={{ fontFamily: SANS, fontSize: 39, color: "#5B5650", marginTop: 12, lineHeight: 1.2 }}>{r.v}</div>
          <div style={{ marginTop: 30 }}><Sello ok={r.ok} txt={r.s} f0={r.f + 12} /></div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- las dos cintas: la hoja de la pared, antes y a los 7 días
export const DosCintasP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 4, 12);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.72} />
      <div style={{ position: "absolute", left: 460, top: 120, width: 1000, height: 820, background: "#FBFAF6", transform: "rotate(-1deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", padding: 60 }}>
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 90 + i * 450, top: 140, width: 380 }}>
          <div style={{ height: 520, background: i ? "rgba(225,222,214,0.35)" : "rgba(70,67,62,0.85)", border: "2px solid rgba(190,190,190,0.8)", transformOrigin: "50% 0", transform: i ? `scaleY(${p})` : undefined }}>
            {i ? [0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 80 + j * 90, top: 120 + j * 130, width: 7, height: 7, borderRadius: "50%", background: "#777" }} />) : null}
          </div>
          <div style={{ fontFamily: HAND || SANS, fontSize: 44, color: i ? P.ok : P.no, marginTop: 18 }}>{i ? "a los 7 días" : "antes"}</div>
        </div>)}
        <div style={{ position: "absolute", left: 90, top: 50, fontFamily: SANS, fontWeight: 700, fontSize: 39, letterSpacing: 4, color: "#6B665E" }}>MISMO LUGAR · MISMA CINTA · MISMO PULGAR</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- llave: antes = la llave abre un surco con polvito; después = perfil del surco contra la rayita nueva
export const LlaveP: React.FC<{ modo: "antes" | "despues"; bg?: string; dur: number }> = ({ modo, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  if (modo === "despues") { const p = sp(f, 6, 14); return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.75} />
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 180 + i * 820, top: 260, width: 720 }}>
        <div style={{ height: 300, position: "relative", ...cem(1), overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 300, top: 0, width: i ? 30 : 110, height: (i ? 14 : 120) * p, background: "#1C1A18", borderRadius: "0 0 50% 50%" }} />
          {!i && [0, 1].map((k) => <div key={k} style={{ position: "absolute", left: k ? 420 : 230, top: -10, width: 60, height: 40 * p, borderRadius: "50% 50% 0 0", background: P.polvo }} />)}
        </div>
        <Big txt={i ? "Ahora: la llave patina" : "Antes: un surco con polvito"} f0={10 + i * 12} size={50} style={{ marginTop: 26 }} />
        <div style={{ marginTop: 18 }}><Sello ok={!!i} txt={i ? "UNA RAYITA QUE SE BORRA" : "SE SIENTE CON LA UÑA"} f0={24 + i * 12} /></div>
      </div>)}
    </AbsoluteFill>); }
  const t = interpolate(f, [8, 44], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) }); const x = 360 + t * 1100;
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(0) }}>
      <div style={{ position: "absolute", left: 360, top: 520, width: t * 1100, height: 16, background: "#2B2826", borderRadius: 8, boxShadow: `0 -10px 0 -2px ${P.polvo}, 0 10px 0 -2px ${P.polvo}` }} />
      {Array.from({ length: 40 }, (_, i) => { const px = 360 + (i / 40) * 1100; return px < x ? <div key={i} style={{ position: "absolute", left: px, top: 520 + (i % 2 ? -28 - (hash(i) % 14) : 30 + (hash(i) % 14)), width: 8, height: 8, borderRadius: "50%", background: "#E2DED6" }} /> : null; })}
      <div style={{ position: "absolute", left: x - 30, top: 330, width: 60, height: 200, background: "linear-gradient(90deg,#C9A445,#E9CE7A,#B48E33)", borderRadius: "6px 6px 30px 6px", transform: "rotate(28deg)", transformOrigin: "50% 100%", boxShadow: "8px 12px 18px rgba(0,0,0,0.45)" }}>
        <div style={{ position: "absolute", left: -40, top: -110, width: 140, height: 120, borderRadius: "50%", background: "linear-gradient(90deg,#C9A445,#E9CE7A)" }}><div style={{ position: "absolute", left: 50, top: 22, width: 40, height: 40, borderRadius: "50%", background: P.cem }} /></div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 110 }}><Kick txt="LA PRUEBA DE LA LLAVE" color={P.ink} style={{ textShadow: "none" }} /><Big txt="10 cm, como un lápiz apretando" f0={8} size={64} color={P.ink} style={{ textShadow: "none" }} /></div>
      <div style={{ position: "absolute", left: 360, top: 700, display: "flex", gap: 40 }}><Sello ok txt="MARQUITA BLANCA = DURO" f0={50} /><Sello ok={false} txt="SURCO + POLVITO = BLANDO" f0={60} /></div>
    </AbsoluteFill>
  );
};

// ---------- gota: de arriba; la que chupa se oscurece y desaparece, la perla se queda parada
export const GotaP: React.FC<{ modo: "antes" | "despues"; bg?: string; dur: number }> = ({ modo, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const drop = (x: number, y: number, chupa: number, perla: boolean, lab: string, clock: string, ok: boolean, f0: number) => {
    const s = sp(f, f0, 10); const r = 120 + chupa * 90;
    return <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ position: "absolute", left: -r, top: -r * 0.85, width: 2 * r * s, height: 1.7 * r * s, borderRadius: "50%", background: perla ? "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0 10%, rgba(140,190,220,0.65) 30%, rgba(60,100,130,0.6))" : `radial-gradient(circle, rgba(50,46,42,${0.7 * (1 - chupa * 0.6)}), rgba(60,56,52,${0.35 * (1 - chupa)}) 70%, transparent)`, boxShadow: perla ? "6px 14px 18px rgba(0,0,0,0.35)" : "none" }} />
      <div style={{ position: "absolute", left: -200, top: 210, width: 400, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: P.ink }}>{clock}</div>
        <div style={{ fontFamily: SERIF, fontSize: 36, color: P.ink, marginTop: 6 }}>{lab}</div>
        <div style={{ marginTop: 16 }}><Sello ok={ok} txt={ok ? "EL SILICATO ENTRA" : "NO VA A ENTRAR"} f0={f0 + 40} /></div>
      </div>
    </div>;
  };
  if (modo === "despues") { const c = interpolate(f, [10, dur - 10], [0, 0.35], CL); const m = Math.round(interpolate(f, [10, dur - 10], [0, 4], CL));
    return <AbsoluteFill style={{ opacity: o, ...cem(0, 0.7) }}>{drop(960, 380, c, true, "se achata despacio", `${m} min…`, true, 4)}
      <div style={{ position: "absolute", left: 120, top: 90 }}><Kick txt="A LOS 7 DÍAS" color={P.ink} style={{ textShadow: "none" }} /><Big txt="Ya no es una esponja" f0={8} size={70} color={P.ink} style={{ textShadow: "none" }} /></div></AbsoluteFill>; }
  const c = interpolate(f, [12, 50], [0, 1], CL); const sec = Math.round(c * 30);
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(0) }}>
      {drop(560, 380, c, false, "se oscurece y desaparece", `${sec} s`, true, 4)}
      {drop(1360, 380, 0, true, "se queda parada, como perla", f > 50 ? "5 min" : `${Math.round(c * 5)} min`, false, 10)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Kick txt="LA PRUEBA DE LA GOTA" color={P.ink} style={{ textShadow: "none" }} /></div>
      <div style={{ position: "absolute", left: 960, top: 160, bottom: 120, width: 4, background: "rgba(30,28,26,0.4)" }} />
    </AbsoluteFill>
  );
};

// ---------- origen: arena + carbonato → horno → vidrio → con agua = vidrio líquido (una cadena de discos)
export const OrigenP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const S = [{ t: "arena", c: "#D9C59A" }, { t: "carbonato de sodio", c: "#EDEDEA" }, { t: "horno muy caliente", c: "#E2763A" }, { t: "vidrio", c: "#BFE0E8" }, { t: "+ agua", c: P.agua }];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.75} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 300, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {S.map((s, i) => { const p = sp(f, 4 + i * 9, 12); return <React.Fragment key={i}>
          <div style={{ width: 230, textAlign: "center", opacity: p, transform: `scale(${0.6 + 0.4 * p})` }}>
            <div style={{ width: 200, height: 200, margin: "0 auto", borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff 0 6%, ${s.c} 40%, rgba(0,0,0,0.35))`, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 39, color: "#F2EFE8", marginTop: 18, textShadow: tsh }}>{s.t}</div>
          </div>
          {i < S.length - 1 && <div style={{ width: 70 * sp(f, 8 + i * 9), height: 8, background: P.tiza, borderRadius: 4 }} />}
        </React.Fragment>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center" }}><Big txt="vidrio líquido · agua de vidrio" f0={50} size={76} color={P.sil} /></div>
    </AbsoluteFill>
  );
};

// ---------- cal libre: el agua del poro se evapora y deja en el fondo un sobrante blanco, como sal
export const CalP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const lv = interpolate(f, [8, 50], [1, 0], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 140, top: 240, width: 1000, height: 560, ...cem(1), display: "flex", justifyContent: "space-around", alignItems: "flex-start", paddingTop: 40 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "relative", width: 150, height: 300 + (i % 2) * 80, background: "#2C2926", borderRadius: "0 0 70px 70px", overflow: "hidden", boxShadow: "inset 0 6px 14px rgba(0,0,0,0.7)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 90}%`, background: "rgba(111,176,216,0.7)" }} />
          {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ position: "absolute", left: 18 + (hash(i * 9 + j) % 110), bottom: 8 + (hash(j + i) % 40), width: 14, height: 12, background: "#F6F6F2", transform: `rotate(${hash(j) % 45}deg)`, opacity: cl(1 - lv * 1.3) }} />)}
        </div>)}
      </div>
      <div style={{ position: "absolute", left: 1210, top: 300, width: 600 }}><Kick txt="EN LOS PORITOS" /><Big txt="la cal libre" f0={30} size={96} /><Big txt="un sobrante que no sostiene nada" f0={44} size={46} color="#DCD7CE" style={{ marginTop: 16 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- gel: el silicato baja entre los granitos sueltos y los va atando con puentes; se juntan en piso
export const GelP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const front = interpolate(f, [8, Math.max(40, dur - 40)], [0, 1], CL);
  const G = Array.from({ length: 34 }, (_, i) => ({ x: 70 + (i % 7) * 135 + (hash(i) % 40), y: 60 + Math.floor(i / 7) * 115 + (hash(i + 5) % 30), r: 38 + (hash(i + 9) % 20) }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 120, top: 200, width: 1040, height: 640, background: "#2E2B28", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${front * 100}%`, background: "linear-gradient(180deg, rgba(227,184,90,0.35), rgba(227,184,90,0.12))" }} />
        {G.map((g, i) => { const on = cl((front * 640 - g.y) / 80); const k = 1 - on * 0.12; const cx = 520, cy = 320;
          return <div key={i} style={{ position: "absolute", left: cx + (g.x - cx) * k - g.r / 2, top: cy + (g.y - cy) * k - g.r / 2, width: g.r, height: g.r, borderRadius: "40%", background: "linear-gradient(140deg,#C4BEB3,#8E887E)", boxShadow: on > 0.5 ? `0 0 0 ${8 * on}px rgba(95,170,95,0.75)` : "none" }} />; })}
      </div>
      <div style={{ position: "absolute", left: 1230, top: 280, width: 580 }}><Kick txt="CAL + SILICATO" color={P.sil} /><Big txt="un gel que se vuelve piso" f0={16} size={78} /><Big txt="pega los granitos de la capa floja" f0={50} size={44} color="#DCD7CE" style={{ marginTop: 18 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- fuentes: dos carpetas de la biblioteca técnica; un resaltador marca la línea de los silicatos
export const FuentesP: React.FC<{ docs: { a: string; b: string; f: number }[]; foot: string; bg?: string; dur: number }> = ({ docs, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.72} />
      {docs.map((d, i) => { const p = sp(f, d.f, 14); const hl = interpolate(f, [d.f + 20, d.f + 36], [0, 100], CL);
        return <div key={i} style={{ position: "absolute", left: 180 + i * 820, top: 180, width: 740, height: 560, background: "#EEE7D6", borderTop: "40px solid #C9B78A", padding: "40px 46px", transform: `rotate(${i ? 2 : -2}deg) translateX(${(1 - p) * (i ? 900 : -900)}px)`, boxShadow: "0 30px 50px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: P.ink }}>{d.a}</div>
          <div style={{ fontFamily: SERIF, fontSize: 34, color: "#4A453E", marginTop: 12, lineHeight: 1.2 }}>{d.b}</div>
          {[0, 1, 2].map((k) => <div key={k} style={{ height: 14, background: "rgba(60,55,50,0.18)", marginTop: 26, width: `${90 - k * 12}%` }} />)}
          <div style={{ position: "relative", marginTop: 26, fontFamily: SERIF, fontSize: 36, color: P.ink }}>
            <div style={{ position: "absolute", left: -8, top: 4, height: 44, width: `${hl}%`, background: "rgba(242,210,58,0.75)" }} /><span style={{ position: "relative" }}>endurecedores químicos: silicatos</span>
          </div>
        </div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}><Big txt={foot} f0={70} size={46} color={P.tiza} /></div>
    </AbsoluteFill>
  );
};

// ---------- qué pedir: un bidón de líquido como miel clara; su etiqueta en blanco se escribe con marcador
export const BidonP: React.FC<{ lines: string[]; side: { txt: string; no?: boolean; f: number }[]; bg?: string; dur: number }> = ({ lines, side, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 2, 14);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.66} />
      <div style={{ position: "absolute", left: 220, top: 160, width: 560, height: 760, transform: `translateY(${(1 - p) * 300}px)` }}>
        <div style={{ position: "absolute", left: 200, top: 0, width: 160, height: 80, background: "#E8E6E0", borderRadius: "12px 12px 0 0" }} />
        <div style={{ position: "absolute", left: 0, top: 70, right: 0, bottom: 0, borderRadius: 50, background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.3))", border: "4px solid rgba(255,255,255,0.45)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "78%", background: "linear-gradient(180deg, rgba(240,205,120,0.55), rgba(205,160,70,0.75))" }} />
          <div style={{ position: "absolute", left: 50, right: 50, top: 220, background: "#FBFAF6", padding: "24px 26px", boxShadow: "0 6px 14px rgba(0,0,0,0.3)" }}>
            {lines.map((l, i) => <Tiza key={i} txt={l} f0={12 + i * 14} size={i ? 34 : 40} color={P.ink} len={14} style={{ whiteSpace: "normal" }} />)}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 920, top: 260, width: 860 }}>
        {side.map((s, i) => <div key={i} style={{ fontFamily: SERIF, fontSize: 50, color: s.no ? "#BDB7AD" : "#F5F3EE", textShadow: tsh, marginTop: 26, opacity: sp(f, s.f, 15), textDecoration: s.no ? "line-through" : "none", textDecorationColor: P.no }}>{s.txt}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- seguridad: un tablero perforado; cada cosa se cuelga de su gancho y se balancea hasta quedarse quieta
export const TableroP: React.FC<{ head: string; items: { txt: string; f: number }[]; dur: number }> = ({ head, items, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle, #2A221B 0 5px, transparent 6px) 0 0 / 46px 46px, linear-gradient(180deg, #8C6B48, #6E5236)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}><Kick txt={head} color="#FFF6DA" /></div>
      {items.map((it, i) => { const t = f - it.f; const sw = t < 0 ? 0 : Math.exp(-t / 14) * Math.sin(t / 3) * 18; const p = sp(f, it.f, 12);
        return <div key={i} style={{ position: "absolute", left: 160 + i * 420, top: 260, width: 360, transformOrigin: "50% 0", transform: `rotate(${sw}deg)`, opacity: p }}>
          <div style={{ width: 26, height: 26, margin: "0 auto", borderRadius: "50%", border: "6px solid #C9CCD0" }} />
          <div style={{ marginTop: -4, background: P.paper, borderRadius: 18, padding: "40px 24px", textAlign: "center", boxShadow: "0 24px 40px rgba(0,0,0,0.5)", borderTop: `16px solid ${P.tiza}` }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: P.ink, lineHeight: 1.1 }}>{it.txt}</div>
          </div>
        </div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}><Big txt="Siempre. Aunque sea un ratito." f0={items[items.length - 1].f + 10} size={64} /></div>
    </AbsoluteFill>
  );
};

// ---------- vidrio: una salpicadura cae en el vidrio y al secarse queda opaco, esmerilado, para siempre
export const VidrioP: React.FC<{ items: string[]; bg?: string; dur: number }> = ({ items, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const hit = sp(f, 6, 9); const fr = interpolate(f, [18, 46], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.55} />
      <div style={{ position: "absolute", left: 140, top: 160, width: 760, height: 740, border: "22px solid #B7BCC2", background: "linear-gradient(135deg, rgba(200,225,235,0.35), rgba(255,255,255,0.12) 50%, rgba(200,225,235,0.3))", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 220, top: 260, width: 300 * hit, height: 260 * hit, borderRadius: "46% 54% 40% 60% / 50% 42% 58% 50%", background: `rgba(240,240,236,${0.25 + 0.65 * fr})`, boxShadow: `0 0 ${30 * fr}px rgba(255,255,255,${0.6 * fr})` }} />
        <div style={{ position: "absolute", left: 30, bottom: 30, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: P.no, background: "rgba(255,255,255,0.9)", padding: "6px 16px", opacity: fr }}>SECO, NO SALE NUNCA</div>
      </div>
      <div style={{ position: "absolute", left: 990, top: 210, width: 820 }}>
        <Kick txt="TAPA CON NYLON Y CINTA" />
        {items.map((t, i) => <div key={i} style={{ fontFamily: SERIF, fontSize: 50, color: "#F5F3EE", textShadow: tsh, marginTop: 20, opacity: sp(f, 40 + i * 10, 15) }}>— {t}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- truco: la mancha de aceite vieja queda tapada por un sobre cerrado que apunta a la descripción
export const TrucoP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 12, 13); const b = Math.sin(f / 5) * 12;
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(0) }}>
      <div style={{ position: "absolute", left: 640, top: 260, width: 640, height: 420, borderRadius: "48% 52% 40% 60% / 52% 44% 56% 48%", background: "radial-gradient(ellipse, rgba(30,26,22,0.85), rgba(40,36,30,0.55) 60%, transparent 75%)" }} />
      <div style={{ position: "absolute", left: 660, top: 330, width: 600, height: 380, background: "#E9DFC8", transform: `translateY(${(1 - p) * -700}px) rotate(-3deg)`, boxShadow: "0 30px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 50% 55%)", background: "#D8CCB0" }} />
        <div style={{ position: "absolute", left: 255, top: 170, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #E06A4E, #9E2C1A)" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 90 }}><Kick txt="MANCHAS DE ACEITE MUY VIEJAS" color={P.ink} style={{ textShadow: "none" }} /><Big txt="La variante que mejor me funcionó" f0={8} size={66} color={P.ink} style={{ textShadow: "none" }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 770 + b, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 48, color: P.ink, opacity: sp(f, 30) }}>está en la descripción ↓</div>
    </AbsoluteFill>
  );
};

// ---------- poros: un poro lleno de agua no deja lugar; el seco se llena de silicato
export const PorosP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const d = interpolate(f, [8, 26], [0, 1], { ...CL, easing: Easing.in(Easing.quad) }); const fill = interpolate(f, [26, 56], [0, 1], CL);
  const pore = (x: number, wet: boolean, lab: string, ok: boolean) => <div style={{ position: "absolute", left: x, top: 330 }}>
    <div style={{ position: "relative", width: 300, height: 420, background: "#2C2926", borderRadius: "0 0 150px 150px", overflow: "hidden" }}>
      {wet && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "92%", background: "rgba(111,176,216,0.75)" }} />}
      {!wet && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 92}%`, background: "rgba(227,184,90,0.85)" }} />}
      {wet && <div style={{ position: "absolute", left: 40, right: 40, top: 20, height: 26 * fill + 4, borderRadius: 14, background: "rgba(227,184,90,0.7)" }} />}
    </div>
    <div style={{ position: "absolute", left: 125, top: -260 + d * (wet ? 250 : 300), width: 50, height: 64, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: P.sil, opacity: fill > 0.1 ? 0 : 1 }} />
    <div style={{ width: 300, textAlign: "center", fontFamily: SERIF, fontSize: 42, color: "#F5F3EE", textShadow: tsh, marginTop: 20 }}>{lab}</div>
    <div style={{ textAlign: "center", marginTop: 12 }}><Sello ok={ok} txt={ok ? "ENTRA" : "SE QUEDA ARRIBA"} f0={50} /></div>
  </div>;
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(1) }}>
      <AbsoluteFill style={{ background: "rgba(20,19,18,0.45)" }} />
      {pore(460, true, "poro con agua", false)}{pore(1160, false, "poro seco", true)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Kick txt="POR QUÉ HAY QUE ESPERAR" /></div>
    </AbsoluteFill>
  );
};

// ---------- 48 horas: por la abertura del portón pasan dos días y dos noches
export const SolP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const t = interpolate(f, [6, Math.max(50, dur - 24)], [0, 2], CL); const ph = t % 1; const day = ph < 0.5;
  const sky = day ? `linear-gradient(180deg, #8EC3E6, #E8D9B5)` : `linear-gradient(180deg, #0E1630, #2A3350)`; const a = (day ? ph / 0.5 : (ph - 0.5) / 0.5) * Math.PI;
  return (
    <AbsoluteFill style={{ opacity: o, background: "#1B1A18" }}>
      <div style={{ position: "absolute", left: 160, top: 160, width: 1000, height: 720, background: sky, overflow: "hidden", border: "24px solid #6F7378" }}>
        <div style={{ position: "absolute", left: 500 - Math.cos(a) * 420 - 50, top: 560 - Math.sin(a) * 440, width: 100, height: 100, borderRadius: "50%", background: day ? "#FFE58A" : "#E9EDF5", boxShadow: day ? "0 0 60px #FFE58A" : "0 0 30px #C9D2E6" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, ...cem(1) }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, background: "repeating-linear-gradient(180deg, #8E9297 0 20px, #6D7176 20px 26px)" }} />
      </div>
      <div style={{ position: "absolute", left: 1240, top: 300, width: 600 }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 200, color: "#F5F3EE", lineHeight: 1 }}>{Math.round(t * 24)}<span style={{ fontSize: 60, color: P.tiza }}> h</span></div>
        <Big txt="sin mojar nada" f0={10} size={60} />
        <Kick txt="CON FRÍO O HUMEDAD: HASTA 3 DÍAS" f0={30} style={{ marginTop: 20 }} color="#DDD8CF" />
      </div>
    </AbsoluteFill>
  );
};

// ---------- prueba del plástico: de arriba, el cuadrado pegado con cinta; dos resultados
export const PlasticoP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const sq = (x: number, wet: boolean, f0: number) => { const p = sp(f, f0, 13); const g = interpolate(f, [f0 + 10, f0 + 40], [0, 1], CL);
    return <div style={{ position: "absolute", left: x, top: 230, width: 600 }}>
      <div style={{ position: "relative", height: 600, ...cem(0), opacity: p }}>
        <div style={{ position: "absolute", inset: 60, background: wet ? `rgba(60,56,52,${0.45 * g})` : "transparent" }} />
        <div style={{ position: "absolute", inset: 60, background: "rgba(235,240,242,0.22)", border: "26px solid rgba(178,130,70,0.85)" }} />
        {wet && Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 110 + (hash(i) % 380), top: 110 + (hash(i + 30) % 380), width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, rgba(140,190,220,0.8))", opacity: cl(g * 1.5 - (i % 5) * 0.12) }} />)}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 44, color: "#F5F3EE", textShadow: tsh, marginTop: 20 }}>{wet ? "gotitas o más oscuro" : "seco, mismo color"}</div>
      <div style={{ marginTop: 12 }}><Sello ok={!wet} txt={wet ? "ESPERA OTRO DÍA" : "PUEDES AVANZAR"} f0={f0 + 40} /></div>
    </div>; };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}><Kick txt="NYLON 40 × 40 CM · UNA NOCHE" /></div>
      {sq(220, true, 4)}{sq(1100, false, 20)}
    </AbsoluteFill>
  );
};

// ---------- clima: una regla de temperatura con la franja buena; el puntero la recorre
export const ClimaP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const v = interpolate(f, [6, 30, 54, 76], [4, 36, 36, 20], { ...CL, easing: Easing.inOut(Easing.quad) }); const X = (c: number) => 160 + (c / 40) * 1600;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.72} />
      <div style={{ position: "absolute", left: 160, top: 500, width: 1600, height: 70, background: `linear-gradient(90deg, #5A8FD0 0 25%, ${P.ok} 25% 75%, #E0703A 75%)`, borderRadius: 35, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} />
      {[0, 10, 20, 30, 40].map((c) => <div key={c} style={{ position: "absolute", left: X(c) - 60, top: 590, width: 120, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 36, color: "#F2EFE8" }}>{c} °C</div>)}
      <div style={{ position: "absolute", left: X(v) - 20, top: 440, width: 40, height: 190, background: "#F5F3EE", borderRadius: 20, boxShadow: "0 8px 18px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 160, top: 300, width: 520, fontFamily: SERIF, fontSize: 40, color: "#CFE0F2", textShadow: tsh, opacity: v < 10 ? 1 : 0.35 }}>frío: el líquido se queda arriba</div>
      <div style={{ position: "absolute", right: 160, top: 300, width: 560, textAlign: "right", fontFamily: SERIF, fontSize: 40, color: "#F5C9A8", textShadow: tsh, opacity: v > 30 ? 1 : 0.35 }}>sol directo: se seca antes de entrar</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center" }}><Big txt="entre 10 y 30 grados" f0={56} size={80} color="#BFE5C3" /></div>
    </AbsoluteFill>
  );
};

// ---------- dilución: las jarras se vuelcan una a una en el balde (visto desde arriba): primero el agua, al final el silicato
export const MezclaP: React.FC<{ n: number; note: string; bg?: string; dur: number }> = ({ n, note, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const step = Math.max(8, Math.min(14, Math.floor((dur - 50) / (n + 1)))); const done = cl((f - 8) / (step * (n + 1)));
  const sil = cl((f - 8 - step * n) / step);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.75} />
      <div style={{ position: "absolute", left: 120, top: 200, display: "flex", gap: 26 }}>
        {Array.from({ length: n + 1 }, (_, i) => { const t = cl((f - 8 - i * step) / step); const last = i === n;
          return <div key={i} style={{ width: 110, height: 200, borderRadius: "14px 14px 20px 20px", border: "5px solid rgba(255,255,255,0.7)", position: "relative", overflow: "hidden", transform: `rotate(${Math.sin(t * Math.PI) * 50}deg) translateY(${Math.sin(t * Math.PI) * -40}px)`, background: "rgba(255,255,255,0.08)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(1 - t) * 85}%`, background: last ? "rgba(227,184,90,0.9)" : "rgba(111,176,216,0.85)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 6, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: "#fff" }}>{last ? "SILICATO" : "AGUA"}</div>
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 260, top: 500, width: 440, height: 440, borderRadius: "50%", background: "#DCDDDB", boxShadow: "inset 0 0 0 24px #C2C4C2, 0 30px 60px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 392 * done, height: 392 * done, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(circle, rgba(${Math.round(111 + 60 * sil)},${Math.round(176 - 10 * sil)},${Math.round(216 - 90 * sil)},0.9), rgba(90,140,170,0.8))` }} />
      </div>
      <div style={{ position: "absolute", left: 1000, top: 340, width: 800 }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 220, color: "#F5F3EE", lineHeight: 1, opacity: sp(f, 10) }}>1 : {n}</div>
        <Big txt={note} f0={30} size={52} color={P.tiza} />
        <Kick txt="SIEMPRE EL SILICATO SOBRE EL AGUA" f0={50} color="#DDD8CF" style={{ marginTop: 24 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- cuánto rinde: la cochera en cuadritos de 1 m²; cada litro pinta su pedacito
export const RindeP: React.FC<{ f2: number; bg?: string; dur: number }> = ({ f2, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const a = Math.round(interpolate(f, [8, 30], [0, 5], CL)); const b = Math.round(interpolate(f, [f2, f2 + 30], [5, 30], CL));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 140, top: 200, width: 900, height: 750, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, transform: "perspective(1400px) rotateX(28deg)", transformOrigin: "50% 100%" }}>
        {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ ...cem(0), boxShadow: i < Math.max(a, b) ? `inset 0 0 0 999px ${i < a ? "rgba(111,176,216,0.65)" : "rgba(111,176,216,0.4)"}` : "none" }} />)}
      </div>
      <div style={{ position: "absolute", left: 1130, top: 240, width: 680 }}>
        <Kick txt="1 LITRO DE MEZCLA" />
        <Big txt="4 a 5 m² · 1.ª mano" f0={10} size={66} />
        <Big txt="6 a 7 m² · 2.ª mano" f0={30} size={50} color="#CFC9BF" style={{ marginTop: 10 }} />
        <div style={{ marginTop: 50, opacity: sp(f, f2) }}><Kick txt="MIS 30 M²" f0={f2} /><Big txt="5 L de silicato + 20 L de agua" f0={f2 + 6} size={58} color={P.tiza} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- lámina: una linterna recorre la página en penumbra y se detiene en cada parte que se nombra
export const LaminaP: React.FC<{ src: string; focus: { x: number; y: number; f: number }[]; dur: number }> = ({ src, focus, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10); const p = sp(f, 2, 15);
  let i = 0; for (let k = 0; k < focus.length; k++) if (f >= focus[k].f) i = k; const a = focus[Math.max(0, i - 1)], b = focus[i]; const k = cl((f - b.f) / 16);
  const x = a.x + (b.x - a.x) * (i ? Easing.inOut(Easing.cubic)(k) : 1), y = a.y + (b.y - a.y) * (i ? Easing.inOut(Easing.cubic)(k) : 1);
  const dark = f < focus[0].f ? 0 : interpolate(f, [focus[0].f, focus[0].f + 10], [0, 0.62], CL) * (i === focus.length - 1 ? interpolate(f, [b.f, b.f + 12], [1, 0], CL) : 1);
  const W = 1640, H = 922;
  return (
    <AbsoluteFill style={{ opacity: o, background: "#1E1C1A" }}>
      <div style={{ position: "absolute", left: 140, top: 79, width: W, height: H, transform: `scale(${(0.9 + 0.1 * p) * (1 + 0.04 * f / Math.max(1, dur))}) rotate(${0.5 * Math.sin(f / 70)}deg)`, background: "#F4F0E6", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width: W, height: H, objectFit: "contain" }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle 260px at ${x}% ${y}%, transparent 0 70%, rgba(10,10,10,${dark}) 100%)` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 20 minutos mojado: una franja de piso oscura que se seca desde los bordes; se vuelve a regar donde chupa
export const MojadoP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const m = Math.round(interpolate(f, [6, dur - 20], [0, 20], CL));
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(0) }}>
      <div style={{ position: "absolute", left: 120, top: 260, width: 1100, height: 600, perspective: 1200 }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(30deg)", ...cem(1), boxShadow: "inset 0 0 0 999px rgba(30,28,26,0.35)" }}>
          {Array.from({ length: 8 }, (_, i) => { const t = cl((f - 10 - i * 5) / 40) * (1 - cl((f - 60 - i * 4) / 10)); return <div key={i} style={{ position: "absolute", left: (hash(i) % 900), top: (hash(i + 8) % 480), width: 180, height: 110, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(200,196,188,${0.8 * t}), transparent 70%)` }} />; })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1300, top: 260, width: 520 }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 180, color: P.ink, lineHeight: 1 }}>{m}<span style={{ fontSize: 56 }}> min</span></div>
        <Big txt="mojado de 15 a 20 minutos" f0={8} size={52} color={P.ink} style={{ textShadow: "none" }} />
        <div style={{ marginTop: 30 }}><Sello ok={false} txt="SIN CHARCOS" f0={40} /></div>
        <Kick txt="DONDE SE SECA ANTES, OTRO POQUITO" f0={60} color={P.ink} style={{ textShadow: "none", marginTop: 26, fontSize: 38 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- sobrante: el secador de goma empuja la película brillosa hacia la zona que todavía tiene sed
export const SecadorP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const t = interpolate(f, [10, Math.max(46, dur - 30)], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) }); const x = 200 + t * 1100;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.45} />
      <div style={{ position: "absolute", left: x, top: 260, right: 120, height: 560, background: "linear-gradient(100deg, rgba(255,255,248,0.0), rgba(255,255,248,0.35) 20%, rgba(255,255,248,0.15) 60%, rgba(255,255,248,0.3))", opacity: 1 - t * 0.8 }} />
      <div style={{ position: "absolute", left: x - 20, top: 240, width: 40, height: 600, background: P.rub, borderRadius: 8, boxShadow: "10px 0 20px rgba(0,0,0,0.5)" }}><div style={{ position: "absolute", left: -260, top: 280, width: 270, height: 26, background: "#A07A4E", borderRadius: 13 }} /></div>
      <div style={{ position: "absolute", left: 120, top: 80 }}><Kick txt="A LOS 20 O 30 MINUTOS" /><Big txt="Brilloso = sobrante · mate = bien" f0={8} size={66} /></div>
      <div style={{ position: "absolute", left: 120, bottom: 90 }}><Big txt="se empuja hacia donde todavía chupa" f0={30} size={50} color={P.tiza} /></div>
    </AbsoluteFill>
  );
};

// ---------- una semana: siete losas en fila; el gel se endurece día a día y se habilitan zapatos y auto
export const SemanaP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const d = interpolate(f, [6, Math.max(40, dur - 30)], [0, 7], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 360, display: "flex", gap: 16 }}>
        {Array.from({ length: 7 }, (_, i) => { const h = cl(d - i); return <div key={i} style={{ flex: 1, height: 260, ...cem(0, h), position: "relative", boxShadow: `0 0 0 ${h > 0.98 ? 5 : 0}px ${P.ok}, 0 20px 30px rgba(0,0,0,0.5)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${h * 100}%`, background: "linear-gradient(0deg, rgba(79,162,90,0.35), transparent)" }} />
          <div style={{ position: "absolute", left: 14, top: 10, fontFamily: SANS, fontWeight: 800, fontSize: 42, color: P.ink }}>día {i + 1}</div>
        </div>; })}
      </div>
      <div style={{ position: "absolute", left: 120, top: 680, fontFamily: SERIF, fontSize: 44, color: "#F5F3EE", textShadow: tsh, opacity: d > 1 ? 1 : 0.3 }}>día 1: zapatos limpios</div>
      <div style={{ position: "absolute", right: 120, top: 680, fontFamily: SERIF, fontSize: 44, color: P.tiza, textShadow: tsh, opacity: d > 6.9 ? 1 : 0.3 }}>día 7: el auto y lo pesado</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center" }}><Kick txt="SOLO ESCOBA, NADA FUERTE" /><Big txt="El gel sigue endureciendo" f0={8} size={70} /></div>
    </AbsoluteFill>
  );
};

// ---------- errores: carteles amarillos de piso mojado (caballete de dos caras) que se abren
const Cartel: React.FC<{ k: number; f0: number; w?: number }> = ({ k, f0, w = 220 }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 11);
  return <div style={{ width: w, height: w * 1.45, perspective: 900 }}>
    <div style={{ width: "100%", height: "100%", transformOrigin: "50% 100%", transform: `rotateX(${(1 - p) * 85}deg)`, background: P.tiza, clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: w * 0.12, color: P.ink, letterSpacing: 2 }}>ERROR</div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: w * 0.5, color: P.ink, lineHeight: 1 }}>{k}</div>
    </div>
  </div>;
};
export const ErroresP: React.FC<{ title: string; sub: string; bg?: string; dur: number }> = ({ title, sub, bg, dur }) => {
  const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.72} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 380, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>{[1, 2, 3, 4, 5].map((k) => <Cartel key={k} k={k} f0={4 + k * 4} />)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center" }}><Big txt={title} f0={4} size={96} /><Kick txt={sub} f0={14} color="#DDD8CF" style={{ marginTop: 10 }} /></div>
    </AbsoluteFill>
  );
};
export const ErrorP: React.FC<{ k: number; title: string; sub: string; bg?: string; dur: number }> = ({ k, title, sub, bg, dur }) => {
  const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.66} />
      <div style={{ position: "absolute", left: 180, top: 200 }}><Cartel k={k} f0={2} w={420} /></div>
      <div style={{ position: "absolute", left: 760, top: 330, width: 1040 }}><Big txt={title} f0={10} size={86} /><Big txt={sub} f0={22} size={48} color={P.tiza} style={{ marginTop: 22 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- preguntas: un cartel de paletas que giran (como los de las estaciones) y muestra cada pregunta
export const PreguntasP: React.FC<{ qs: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ qs, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.72} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}><Kick txt="ME PREGUNTARON" /></div>
      <div style={{ position: "absolute", left: 260, right: 260, top: 190, display: "flex", flexDirection: "column", gap: 18, perspective: 1200 }}>
        {qs.map((q, i) => { const r = interpolate(f, [q.f, q.f + 12], [-90, 0], { ...CL, easing: ease });
          return <div key={i} style={{ background: "#202326", border: "3px solid #3A3E42", borderRadius: 10, padding: "20px 34px", transformOrigin: "50% 0", transform: `rotateX(${r}deg)`, opacity: f >= q.f ? 1 : 0, fontFamily: SANS, fontWeight: 700, fontSize: 46, color: "#F4E9C8", boxShadow: "0 12px 24px rgba(0,0,0,0.5)" }}>{q.txt}</div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- cuánto dura: la pintura está arriba y se pela; el silicato está adentro
export const DuraP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const peel = interpolate(f, [16, 46], [0, 1], { ...CL, easing: ease }); const g = interpolate(f, [16, 46], [0, 1], CL);
  const block = (x: number, paint: boolean) => <div style={{ position: "absolute", left: x, top: 380, width: 700 }}>
    <div style={{ position: "relative", height: 320, ...cem(1) }}>
      {paint ? <div style={{ position: "absolute", left: 0, top: -18, width: 700, height: 18, background: "#7B8D99", transformOrigin: "0 100%", transform: `rotate(${-peel * 12}deg)`, clipPath: `inset(0 0 0 ${peel * 50}%)` }} /> : <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: `rgba(227,184,90,${0.25 + 0.45 * g})` }} />}
    </div>
    <div style={{ fontFamily: SERIF, fontSize: 48, color: "#F5F3EE", textShadow: tsh, marginTop: 22 }}>{paint ? "pintura: arriba, se pela" : "silicato: adentro, no se pela"}</div>
  </div>;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.75} />
      {block(160, true)}{block(1060, false)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}><Big txt="En una cochera: años" f0={4} size={96} color={P.tiza} /></div>
    </AbsoluteFill>
  );
};

// ---------- costo: cada cosa cae dentro del balde y suma
export const CostoP: React.FC<{ rows: { t: string; v: string; f: number }[]; bg?: string; dur: number }> = ({ rows, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.75} />
      <div style={{ position: "absolute", left: 1220, top: 520, width: 520, height: 420, background: "linear-gradient(90deg, #8E9AA3, #C9D1D6 40%, #8E9AA3)", clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)" }} />
      <div style={{ position: "absolute", left: 1220, top: 500, width: 520, height: 46, borderRadius: "50%", background: "#5F686F" }} />
      {rows.map((r, i) => { const t = interpolate(f, [r.f + 14, r.f + 28], [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: 140, top: 220 + i * 120, display: "flex", gap: 30, alignItems: "baseline", opacity: sp(f, r.f, 15) }}>
            <div style={{ fontFamily: SERIF, fontSize: 50, color: "#F5F3EE", textShadow: tsh, width: 700 }}>{r.t}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: P.tiza }}>{r.v}</div>
          </div>
          <div style={{ position: "absolute", left: 1400 + (i % 3) * 40, top: 200 + t * 330, width: 120, height: 70, borderRadius: 10, background: P.paper, boxShadow: "0 10px 20px rgba(0,0,0,0.4)", opacity: f >= r.f + 14 && t < 1 ? 1 : 0, fontFamily: SANS, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", color: P.ink }}>{r.v}</div>
        </React.Fragment>; })}
      <div style={{ position: "absolute", left: 140, top: 90 }}><Kick txt="MI COCHERA · 30 M²" /></div>
    </AbsoluteFill>
  );
};

// ---------- total: tres barras que crecen sobre el piso: lo mío, un densificador de etiqueta y un epoxi
export const TotalP: React.FC<{ rows: { t: string; v: string; w: number; c: string; f: number }[]; bg?: string; dur: number }> = ({ rows, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 140, top: 110 }}><Kick txt="EL MISMO PISO · 30 M²" /></div>
      {rows.map((r, i) => { const w = interpolate(f, [r.f, r.f + 22], [0, r.w], { ...CL, easing: ease });
        return <div key={i} style={{ position: "absolute", left: 140, top: 250 + i * 230 }}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: "#F5F3EE", textShadow: tsh, opacity: sp(f, r.f) }}>{r.t}</div>
          <div style={{ marginTop: 12, height: 80, width: w, background: r.c, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 24, fontFamily: SANS, fontWeight: 900, fontSize: 48, color: "#fff", boxShadow: "0 12px 24px rgba(0,0,0,0.4)", whiteSpace: "nowrap", overflow: "hidden" }}>{w > 200 ? r.v : ""}</div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- discos: cuatro discos de lustrar girando; dos sí, dos no
export const DiscosP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const D = [{ c: "#F3F1EC", t: "blanco", ok: true }, { c: "#C8452F", t: "rojo", ok: true }, { c: "#262626", t: "negro", ok: false }, { c: "#2F7A3E", t: "verde", ok: false }];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.72} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 260, display: "flex", justifyContent: "space-between" }}>
        {D.map((d, i) => { const p = sp(f, 4 + i * 6, 12); return <div key={i} style={{ width: 340, textAlign: "center", opacity: p }}>
          <div style={{ width: 320, height: 320, margin: "0 auto", borderRadius: "50%", background: `repeating-radial-gradient(circle, ${d.c} 0 10px, rgba(0,0,0,0.12) 10px 12px)`, boxShadow: "inset 0 0 0 50px rgba(0,0,0,0.08), 0 24px 40px rgba(0,0,0,0.5)", transform: `rotate(${f * 14}deg)`, position: "relative" }}><div style={{ position: "absolute", left: 120, top: 120, width: 80, height: 80, borderRadius: "50%", background: "#555" }} /></div>
          <div style={{ fontFamily: SERIF, fontSize: 48, color: "#F5F3EE", textShadow: tsh, marginTop: 20 }}>{d.t}</div>
          <div style={{ marginTop: 10 }}><Sello ok={d.ok} txt={d.ok ? "PARA LUSTRAR" : "PARA DECAPAR"} f0={30 + i * 6} /></div>
        </div>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}><Kick txt="EL DISCO DE LA LUSTRADORA" /></div>
    </AbsoluteFill>
  );
};

// ---------- el piso canta: barras de sonido que pasan de un zumbido sordo a un silbido agudo y limpio
export const CantaP: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const k = interpolate(f, [10, Math.max(40, dur - 30)], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const freq = 0.25 + k * 1.4, amp = 150 - k * 70;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.72 - k * 0.2} />
      <div style={{ position: "absolute", left: 160, right: 160, top: 300, height: 360, display: "flex", alignItems: "center", gap: 8 }}>
        {Array.from({ length: 60 }, (_, i) => { const h = 20 + Math.abs(Math.sin(i * freq + f * (0.2 + k * 0.5))) * amp * (k < 0.5 ? 0.6 + 0.4 * r01(i + f) : 1);
          return <div key={i} style={{ flex: 1, height: h, borderRadius: 6, background: k > 0.5 ? P.tiza : "#8E8A84", boxShadow: k > 0.5 ? `0 0 12px rgba(242,210,58,${k - 0.5})` : "none" }} />; })}
      </div>
      <div style={{ position: "absolute", left: 160, top: 720, fontFamily: SERIF, fontSize: 52, color: "#CFC9BF", textShadow: tsh, opacity: 1 - k }}>ruido opaco, sordo</div>
      <div style={{ position: "absolute", right: 160, top: 720, fontFamily: SERIF, fontSize: 64, color: P.tiza, textShadow: tsh, opacity: k }}>agudo, limpio: el piso canta</div>
    </AbsoluteFill>
  );
};

// ---------- pregunta final: tres planos de piso (cochera, patio, depósito); la tiza los rodea uno por uno
export const VotaP: React.FC<{ opts: { t: string; src: string }[]; foot: string; dur: number }> = ({ opts, foot, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o, ...cem(1) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}><Big txt="¿Dónde te suelta polvo a ti?" f0={2} size={76} /></div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 250, display: "flex", justifyContent: "space-between" }}>
        {opts.map((op, i) => { const p = sp(f, 6 + i * 8, 13); const c = interpolate(f, [20 + i * 10, 36 + i * 10], [0, 100], CL);
          return <div key={i} style={{ width: 480, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
            <div style={{ position: "relative", height: 340, padding: 14 }}>
              <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 6 }}><Pic src={op.src} /></div>
              <div style={{ position: "absolute", inset: -6, border: `8px solid ${P.tiza}`, borderRadius: "48% 52% 46% 54% / 52% 46% 54% 48%", clipPath: `inset(0 ${100 - c}% 0 0)` }} />
            </div>
            <div style={{ fontFamily: HAND || SANS, fontWeight: 700, fontSize: 64, color: P.tiza, textAlign: "center", marginTop: 14 }}>{op.t}</div>
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center" }}><Big txt={foot} f0={50} size={50} color="#E8E3DA" /></div>
    </AbsoluteFill>
  );
};
